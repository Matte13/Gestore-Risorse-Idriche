"use strict";

/* IMPORT E REQUIRE */
const express = require('express') ;
const morgan = require('morgan');
const mqtt = require ('mqtt');
const campo = require('./campo');
require('./sensore');
require('./attuatore');
require('./piano');
require('./dettagliCampo');
const myserver = require('./server');
const passport = require('passport'); //auth middleware
const LocalStrategy = require('passport-local').Strategy; //username and password for login
const session = require('express-session');
const flash = require('connect-flash');
const {validationResult} = require('express-validator');
const {status} = require("express/lib/response");
const {json} = require("express");
const server = new myserver();
const app = express();
const port = 3000;

app.use(flash());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(express.static('public'));
app.get('/', (req, res) => res.redirect('/login.html'));

/* VARIABILI E OGGETTI */
let idAzienda= 0;
// MQTT
let options={
  clientId: "mqttx_7d99a61f"
};
// Data e Ora attuali
let data = " ";
let ora = " ";

const client = mqtt.connect("mqtt://127.0.0.1", options);

client.on("connect",function(){
  console.log("connected  "+ client.connected);

})
const topic = "+/+/sensori/+";

// Subscribe
client.subscribe(topic,{qos:1});

// Handle incoming messages
client.on('message',function(topic, message){
  console.log("message is "+ message);

  let parseTopic= topic.split("/");
  console.log(topic);
  let misura;
  let tipo;
  let jsonMessage = JSON.parse(message);
  if(parseTopic[3] === "sensoreTemp")
  {
    console.log("dentro sensTemp if");
    misura = {
      valore : jsonMessage.valore,
      data: jsonMessage.data,
      ora: jsonMessage.ora,
    };
    tipo = "t"

  }
  else if(parseTopic[3] === "sensoreUmid"){
    misura = {
      valore : jsonMessage.valore,
      data: jsonMessage.data,
      ora: jsonMessage.ora,
    };
    tipo = "u"

  }

  server.getSensoreMisura(parseTopic[1],tipo).then ((id) => {
    if (id.error){
      status(404).json(id);
    } else {
      console.log("Inserisco misura " + misura.valore);
      server.insertMisura(misura,id.id).then((err) => {
        if(err.error)
        {
          status(500).json({
            'errors': [{'param': 'Server', 'msg': err}],
          });
        }
        else
        {
          console.log("Inserimento misura andato a buon fine")
        }
      })


    }}).catch( (err) => {
    status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });


});

// Handle errors
client.on("error",function(error){
  console.log("Can't connect" + error);
  process.exit(1)});

// Publish
function publish(topic,msg,options){
  console.log("publishing",msg);

  if (client.connected === true){

    client.publish(topic,msg,options);

  }
}


// "Username e password" login strategy --> strategia di login locale
passport.use(new LocalStrategy(
    function(mail, password, done) {
      server.getUser(mail, password).then(({user, check}) => {
        if (!user) {
          return done(null, false, { message: 'Username non corretto.' });
        }
        if (!check) {
          return done(null, false, { message: 'Password non corretta.' });
        }
        console.log("use in passport: ", user);
        idAzienda= user.idAzienda;
        return done(null, user); //da qui faccio la serialize dell'utente
      })
    }
));

// Serialize e de-serialize dell'utente
passport.serializeUser(function(user, done) {
  //done(null, user.cf, user.tipouser);
  done(null,user);
});

passport.deserializeUser(function(cf, done) {
  server.getUserById(cf).then(user => {
    done(null, user);
  });
});



// Controlla se la richiesta perviene da un utente autenticato come Agricoltore
const isLoggedA = (req, res, next) => {

  if(req.user && req.session.passport.user.tipo=== 'a'){
    return next();
  }
  return res.status(401).json({"statusCode" : 401, "message" : "NON AUTENTICATO"});
}

// Controlla se la richiesta perviene da un utente autenticato come Gestore delle risorse idriche
const isLoggedG = (req, res, next) => {
  if(req.user && req.session.passport.user.tipo==='g'){
    return next();
  }
  return res.status(401).json({"statusCode" : 401, "message" : "NON AUTENTICATO"});
}


// Set up the session
app.use(session({
  //store: new FileStore(), // by default, Passport uses a MemoryStore to keep track of the sessions - if you want to use this, launch nodemon with the option: --ignore sessions/
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Inizializzazione di passport
app.use(passport.initialize());
app.use(passport.session());



/* REST API */



// Configurazione simulatore
app.get ('/config', (req, res) => {
  server.getConfigurazione().then ((config) => {
    if (config.error){
      res.status(404).json(config);
    } else {

      res.json(config);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});


// Restituisce la lista delle aziende
app.get ('/aziende', (req, res) => {
  server.getListaAziende().then ((aziende) => {
    if (aziende.error){
      res.status(404).json(aziende);
    } else {
      console.log(aziende);
      res.json(aziende);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});


// Restituisce tutte i campi di un azienda
app.get ('/aziende/:idAzienda/campi',(req, res) => {
  server.getListaCampiAzienda(req.params.idAzienda).then ((campi) => {
    if (campi.error){
      res.status(404).json(campi);
    } else {
      res.json(campi);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});

// Restituisce un'azienda in particolare
app.get ('/azienda/:idAzienda',(req, res) => {
  server.getNomeAzienda(req.params.idAzienda).then ((azienda) => {
    if (azienda.error){
      res.status(404).json(azienda);
    } else {
      res.json(azienda);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});

// Restituisce l'id di un'azienda in particolare dal nome
app.get ('/aziendaId/:nomeAzienda',(req, res) => {
  server.geIdAzienda(req.params.nomeAzienda).then ((idAzienda) => {
    if (idAzienda.error){
      res.status(404).json(idAzienda);
    } else {
      res.json(idAzienda);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});

// Restituisce i dettagli di un campo
app.get ('/aziende/:idAzienda/campi/:idCampo', (req, res) => {
  server.getCampo(req.params.idAzienda,req.params.idCampo).then ((dettagli) => {
    if (dettagli.error){
      res.status(404).json(dettagli);
    } else {
      res.json(dettagli);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});

// Restituisce la lista dei sensori di un'azienda
app.get ('/aziende/:idAzienda/campi/:idCampo/sensori', (req, res) => {
  server.getSensoriDettagli(req.params.idCampo).then ((sensori) => {
    if (sensori.error){
      res.status(404).json(sensori);
    } else {
      res.json(sensori);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});


// Restituisce la lista degli attuatori di un campo
app.get ('/aziende/:idAzienda/campi/:idCampo/attuatori', (req, res) => {
  server.getAttuatoriDettagli(req.params.idCampo).then ((attuatori) => {
    if (attuatori.error){
      res.status(404).json(attuatori);
    } else {
      res.json(attuatori);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});

// Restituisce true se la mail è già presente, false altrimenti
app.get (`/user/:email`, (req, res) => {
  server.getUserByMail(req.params.email).then ((user) => {
    if (user.error){
      res.status(300).json({user});
    } else {
      res.json({user});
    }}).catch( (err) => {
      res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});



// Restituisce la lista dei piani di un attuatore
app.get ('/aziende/:idAzienda/campi/:idCampo/attuatori/:idAttuatore/piani', (req, res) => {
  server.getPianiDettagli(req.params.idAttuatore).then ((piani) => {
    if (piani.error){
      res.status(404).json(piani);
    } else {
      res.json(piani);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});

// Restituisce le misure rilevate da un sensore
app.get ('/aziende/:idAzienda/campi/:idCampo/sensori/:idSensore/misure', (req, res) => {
  server.getMisureDettagli(req.params.idSensore).then ((misure) => {
    if (misure.error){
      res.status(404).json(misure);
    } else {
      res.json(misure);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});

// Restituisce un'attuatore in particolare
app.get ('/attuatore/:idAtt', (req, res) => {
  server.getAttuatore(req.params.idAtt).then ((attuatore) => {
    if (attuatore.error){
      res.status(404).json(attuatore);
    } else {
      res.json(attuatore);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});

// Inserimento di una nuova Azienda
app.post('/registrazione/azienda', (req, res) => {

  console.log(req.body.nome);

  const azienda = {
    nome: req.body.nome,
  };

  server.aziendaAlreadyExist(azienda).then((presente) =>{
    if(presente === false)
    {
      server.insertAzienda(azienda)
          .then((err) => {
            if(err.error)
            {
              res.status(500).json({
                'errors': [{'param': 'Server', 'msg': err}],
              });
            }
            else
            {
              res.redirect("/registrazione.html");
            }
          })
          .catch(() => res.status(503).json({ error: 'Errore db durante il salvataggio della nuova azienda'}));
    }
    else
      res.status(404).json({
        'errors': [{'param': 'Server', 'msg': 'Azienda già presente'}],
      });
  });

});


// Inserimento di nuovo Campo
app.post('/aziende/:idAzienda/campi', (req, res) => {

  const campo = {
    coltura: req.body.coltura,
    idAzienda: req.session.passport.user.idAzienda,
    ettari: req.body.ettari,
    tipoIrrigazione: req.body.tipoIrrigazione,
    qtaAcqua: req.body.qtaAcqua,
    acquaAssegnata: req.body.acquaAssegnata,
    umiditaIdeale: req.body.umiditaIdeale
  };


  server.insertCampo(campo)
      .then((err) => {
        if(err.error)
        {
          res.status(500).json({
            'errors': [{'param': 'Server', 'msg': err}],
          });
        }
        else
        {
          res.redirect("/listaCampi.html")
        }
      })
      .catch(() => res.status(503).json({ error: 'Errore db durante il salvataggio del nuovo campo'}));
});

// Inserimento di un nuovo sensore nel campo specificato da idCampo
app.post('/aziende/:idAzienda/campi/:idCampo/sensori', (req, res) => {

  const sensore = {
    tipo: req.body.tipo,
    idCampo: req.params.idCampo
  };

  server.insertSensore(sensore)
      .then((err) => {
        if(err.error)
        {
          res.status(500).json({
            'errors': [{'param': 'Server', 'msg': err}],
          });
        }
        else
        {
          return res.status(200).end();
        }
      })
      .catch(() => res.status(503).json({ error: 'Errore db durante il salvataggio del nuovo sensore'}));
});


// Inserimento di un nuovo attuatore nel campo con idCampo
app.post('/aziende/:idAzienda/campi/:idCampo/attuatori', (req, res) => {

  const attuatore = {
    attivo: 0,
    modalita: "m",
    tipo: req.body.tipo,
    idCampo: req.params.idCampo
  };

  server.insertAttuatore(attuatore)
      .then((err) => {
        if(err.error)
        {
          res.status(500).json({
            'errors': [{'param': 'Server', 'msg': err}],
          });
        }
        else
        {
          return res.status(200).end();
        }
      })
      .catch(() => res.status(503).json({ error: 'Errore db durante il salvataggio del nuovo attuatore'}));
});

// Inserimento di un nuovo piano
app.post('/aziende/:idAzienda/campi/:idCampo/attuatori/:idAttuatore/piani', (req, res) => {

  const piano = {
    giorno : req.body.giorno,
    condizione : req.body.condizione,
    descrizione : req.body.descrizione,
    ora_inizio : req.body.ora_inizio,
    ora_fine : req.body.ora_fine,
    idAttuatore : req.params.idAttuatore
  };

  server.insertPiano(piano)
      .then((err) => {
        if(err.error)
        {
          res.status(500).json({
            'errors': [{'param': 'Server', 'msg': err}],
          });
        }
        else
        {

          server.getAttuatore(req.params.idAttuatore).then ((attuatore) => {
            if (attuatore.error){
              res.status(404).json(attuatore);
            } else {
              let tipo;
              if(attuatore.tipo==='u')
              {
                tipo="attuatoreUmid";

              }
              else if(attuatore.tipo==='t'){
                tipo="attuatoreRisc";

              }

              const options = {
                retain: false,
                qos: 1
              };

              let message;

              message=piano;


              let topic=req.params.idAzienda+"/"+req.params.idCampo+"/attuatori/"+tipo;
              publish(topic,JSON.stringify(message),options);
              res.redirect("/dettagliCampo.html?"+ req.params.idCampo)
            }}).catch( (err) => {
            res.status(500).json({
              'errors': [{'param': 'Server', 'msg': err}],
            });
          });
        }
      })
      .catch(() => res.status(503).json({ error: 'Errore db durante il salvataggio del nuovo piano'}));
});



// Elimina un campo( inclusi tutti i suoi sensori, attuatori e piani eventualmente associati)
app.delete ('/aziende/:idAzienda/delcampo/:idCampo', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  server.eliminaCampo(req.params.idAzienda,req.params.idCampo).then ((err) => {
    if (err){
      res.status(404).json(campo);
    } else {
      server.getListaCampiAzienda(req.params.idAzienda).then ((campo) => {
        if (campo.error){
          res.status(404).json(campo);
        } else {
          res.json(campo);
        }}).catch( (err) => {
        res.status(500).json({
          'errors': [{'param': 'Server', 'msg': err}],
        });
      });

    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});

// Elimina un piano
app.delete ('/delPiano/:idPiano', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  server.eliminaPiano(req.params.idPiano).then ((err) => {
    if (err){
      res.status(404).json(campo);
    } else {
      res.status(500).json({
        'errors': [{'param': 'Server', 'msg': err}]
      });

    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});

// Modifica campo
app.put('/aziende/:idAzienda/campi/:idCampo', (req, res) => {

  const campo = {
    coltura : req.body.coltura,
    idAzienda : req.params.idAzienda,
    id : req.params.idCampo,
    ettari: req.body.ettari,
    tipoIrrigazione: req.body.tipoIrrigazione,
    qtaAcqua: req.body.qtaAcqua,
    acquaAssegnata: req.body.acquaAssegnata,
    umiditaIdeale: req.body.umiditaIdeale
  };


  server.modificaCampo(campo).then((err) => {
    if (err)
      res.status(404).json(err);
    else
        //return res.redirect(303,"/listaCampi.html")    non so perche non fa il redirect anche se è giusta
      return res.status(200).end();   // prova a fare il redirect in modificaCampo_Manager
  }).catch((err) =>{
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}]
    });
  } );
});


// Cambia modalita attuatore
app.put('/aziende/:idAzienda/campi/:idCampo/attuatori/:idAttuatore/modalita', (req, res) => {

  let valore = '';
  if( req.body.modalita === 'm')
  {
    valore = 'a';
  }
  else {
    valore = 'm'
  }

  server.cambioModalita(valore,req.params.idAttuatore).then((err) => {
    if (err)
      res.status(404).json(err);
    else
    {
      let tipo;
      if(req.body.tipo==='u')
      {
        tipo="attuatoreUmid";

      }
      else if(req.body.tipo==='t'){
        tipo="attuatoreRisc";

      }

      const options = {
        retain: false,
        qos: 1
      };

      let message;
      if(valore==='a')
      {
        message={ modalita: 'a', idAttuatore: req.params.idAttuatore};
      }
      else
      {
        message={ modalita: 'm', idAttuatore: req.params.idAttuatore};
      }

      let topic= req.params.idAzienda+"/" + req.params.idCampo +"/attuatori/" + tipo;
      publish(topic,JSON.stringify(message),options);
      return res.status(200).end();
    }
  }).catch((err) =>{
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}]
    });
  } );
});


// Attiva o disattiva attuatore
app.put('/aziende/:idAzienda/campi/:idCampo/attuatori/:idAttuatore/stato', (req, res) => {

  let valore = 0;
  if( req.body.modalita === 0)
  {
    valore = 1;
  }
  else {
    valore = 0;
  }

  server.cambioStato(valore,req.params.idAttuatore).then((err) => {
    if (err)
      res.status(404).json(err);
    else
    {

      let tipo;

      if(req.body.tipo==='u')
      {
        tipo="attuatoreUmid";
      }
      else if(req.body.tipo==='t'){
        tipo="attuatoreRisc";
      }

      const options = {
        retain: false,
        qos: 1
      };

      let message;

      message={ attivo: valore, idAttuatore: req.params.idAttuatore};


      let topic= req.params.idAzienda + "/" + req.params.idCampo + "/attuatori/" + tipo;
      publish(topic,JSON.stringify(message),options);
      return res.status(200).end();
    }
  }).catch((err) =>{
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}]
    });
  } );
});


app.put('/aziende/:idAzienda/campi/:idCampo/attuatori/:idAttuatore/statoDB', (req, res) => {

  let valore = 0;
  if( req.body.attivo === 1)
  {
    valore = 1;
  }
  else {
    valore = 0;
  }

  server.cambioStato(valore,req.params.idAttuatore).then((err) => {
    if (err)
      res.status(404).json(err);
    else
    {
      return res.status(200).end();
    }
  }).catch((err) =>{
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}]
    });
  } );
});


/* LOGIN / REGISTRAZIONE  */
app.post('/registrazione', (req, res) => {

  const user = {
    nome: req.body.nome,
    cognome: req.body.cognome,
    mail: req.body.email,
    password: req.body.password,
    tipo: req.body.tipo,
    azienda: req.body.azienda
  };

  server.createUser(user)
      .then((err) => {
        if(err.error)
        {
          res.status(500).json({
            'errors': [{'param': 'Server', 'msg': err}],
          });
        }
        else
        {
          server.createAgricoltore(err[0], err[1])
              .then((err) => {
                if(err.error)
                {
                  res.status(500).json({
                    'errors': [{'param': 'Server', 'msg': err}],
                  });
                }
              })
              .catch(() => res.status(503).json({ error: 'Errore db durante la registrazione agricoltore'}));
          res.redirect("login.html?errore=successo");
        }
      })
      .catch(() => res.status(503).json({ error: 'Errore db durante la registrazione'}));
});



// Login
app.post('/loginuser', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      return res.redirect("login.html?errore="+info.message);
    }
    // success, perform the login
    req.login(user, function(err) {
      if (err) { return next(err); }

      if(req.session.passport.user.tipo === 'a') //se è un agricoltore
        return res.redirect("listaCampi.html");
      else if(req.session.passport.user.tipo === 'g') //se è un gestore
        return res.redirect("gestore.html");
    });
  })(req, res, next);
});


// Logout
app.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if(err) return next(err);
    idAzienda=0;
    res.redirect("/");
  });
});



// Restituiscono il tipo di utente che è loggato -> utilizzato per rendere dinamiche le pagine
app.get('/loggato_agri', function(req,res){
  if(req.user && req.session.passport.user.tipo==='a')
    res.send({log: true});
  else
    res.send({log: false});
});
app.get('/loggato_gestore', function(req,res){
  if(req.user && req.session.passport.user.tipo==='g')
    res.send({log: true});
  else
    res.send({log: false});
});
app.get('/loggato_agri_nome', isLoggedA, function(req,res){
  res.send({ilnome: req.session.passport.user.nome + " " +req.session.passport.user.cognome});
});

app.get('/loggato_gestore_nome', isLoggedG, function(req,res){
  res.send({ilnome: req.session.passport.user.nome + " " +req.session.passport.user.cognome});
});

app.get('/idAzienda', function(req,res){
  res.send({idAzienda: req.session.passport.user.idAzienda});
});

app.get('/idAziendaConfig', function(req,res){
  res.json({ idAzienda: idAzienda});
});

// Restituisce l'azienda dall'id del campo
app.get('/getAzienda/:idCampo', function(req,res){
  server.getAziendaFromCampo(req.params.idCampo).then ((resp) => {
    res.json(resp);
  });
});

// Restituisce l'acqua a disposizione dell'azienda
app.get('/getAcquaAzienda/:idAzienda', function(req,res){
  server.getAcquaAzienda(req.params.idAzienda).then ((resp) => {
    res.json(resp);
  });
});

// Restituisce la richiesta di una specifica azienda per un dato giorno
app.get('/getRichiesta/:data/:idAzienda', function(req,res){
  server.getRichiestaAcqua(req.params.data, req.params.idAzienda).then ((resp) => {
    res.json(resp);
  });
});

// Restituisce il tipo di sensore dall'id del sensore come parametro
app.get('/getTipoSensore/:idSensore', function(req,res){
  server.getTipoSensore(req.params.idSensore).then ((resp) => {
    res.json(resp);
  });
});

// Restituisce il nome del campo dall'id del campo come parametro
app.get('/getNomeCampo/:idCampo', function(req,res){
  server.getNomeCampo(req.params.idCampo).then ((resp) => {
    res.json(resp);
  });
});

// Restituisce le richieste di una specifica azienda
app.get('/getRichieste/:idAzienda', function(req,res){
  server.getRichiesteAcqua(req.params.idAzienda).then ((richieste) => {
    if (richieste.error){
      res.status(404).json(richieste);
    } else {
      res.json(richieste);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});

// Restituisce lo storico di una specifica azienda
app.get('/getStorico/:idAzienda', function(req,res){
  server.getStoricoAcqua(req.params.idAzienda).then ((storico) => {
    if (storico.error){
      res.status(404).json(storico);
    } else {
      res.json(storico);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});

// Restituisce lo storico di uno specifico campo
app.get('/getStoricoCampo/:idCampo', function(req,res){
  server.getStoricoCampo(req.params.idCampo).then ((storico) => {
    if (storico.error){
      res.status(404).json(storico);
    } else {
      res.json(storico);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});

// Restituisce l'acqua totale di un fornitore
app.get('/getAcquaTotale/:idFornitore', function(req,res){
  server.getAcquaTotale(req.params.idFornitore).then ((acquaTot) => {
    if (acquaTot.error){
      res.status(404).json(acquaTot);
    } else {
      console.log(acquaTot);
      res.json(acquaTot);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});

// Restituisce l'acqua totale attualemente assegnada alle aziende da un fornitore
app.get('/getAcquaTotaleAssegnata/:idFornitore', function(req,res){
  server.getAcquaTotaleAssegnata(req.params.idFornitore).then ((acquaTotAssegnata) => {
    if (acquaTotAssegnata.error){
      res.status(404).json(acquaTotAssegnata);
    } else {
      res.json(acquaTotAssegnata);
    }}).catch( (err) => {
    res.status(500).json({
      'errors': [{'param': 'Server', 'msg': err}],
    });
  });
});

// Modifica l'acqua totale di un fornitore
app.post('/modificaAcquaTotale', function(req,res){
  server.modificaAcquaTotale(req.body.acquaTotale, req.body.idFornitore).then((err) => {
    if(err.error)
    {
      res.status(500).json({
        'errors': [{'param': 'Server', 'msg': err}],
      });
    }
    else
    {
      return res.status(200).end();
    }
  })
      .catch(() => res.status(503).json({ error: "Errore db durante la modifica dell'acqua totale del fornitore"}));
});

// Modifica l'id dell'azienda "loggata" in passport
app.put('/modificaIdAzienda/:idAzienda', function(req,res){
  req.session.passport.user.idAzienda = req.params.idAzienda;
  req.session.save();
});

// Inserisce una nuova richiesta di modifica acqua
app.post("/inserisciRichiestaAcqua", function (req, res){

  const richiesta = {
    data: req.body.data,
    acquaRichiesta:req.body.acquaRichiesta,
    azienda:req.body.azienda
  }

  server.inserisciRichiestaAcqua(richiesta)
      .then((err) => {
        if(err.error)
        {
          res.status(500).json({
            'errors': [{'param': 'Server', 'msg': err}],
          });
        }
        else
        {
          return res.status(200).end();
        }
      })
      .catch(() => res.status(503).json({ error: "Errore db durante l'inserimento della richiesta"}));
});

// Inserisce il consumo di acqua totale di un'azienda in un giorno
app.post("/inserisciConsumoTotaleGiornata", function (req, res){

  const consumo = {
    data: req.body.data,
    azienda:req.body.azienda,
    acquaRichiesta:req.body.acquaRichiesta,
    acquaConsumata:req.body.acquaConsumata
  }

  server.inserisciConsumoTotaleGiornata(consumo)
      .then((err) => {
        if(err.error)
        {
          res.status(500).json({
            'errors': [{'param': 'Server', 'msg': err}],
          });
        }
        else
        {
          return res.status(200).end();
        }
      })
      .catch(() => res.status(503).json({ error: "Errore db durante l'inserimento del consumo tot azienda"}));
});

// Inserisce il consumo di un campo in un giorno
app.post("/inserisciConsumoCampoGiornata", function (req, res){

  const consumo = {
    data: req.body.data,
    campo:req.body.campo,
    acquaAssegnata:req.body.acquaAssegnata,
    acquaConsumata:req.body.acquaConsumata
  }

  server.inserisciConsumoCampoGiornata(consumo)
      .then((err) => {
        if(err.error)
        {
          res.status(500).json({
            'errors': [{'param': 'Server', 'msg': err}],
          });
        }
        else
        {
          return res.status(200).end();
        }
      })
      .catch(() => res.status(503).json({ error: "Errore db durante l'inserimento del consumo del campo"}));
});

// Setta le variabili globali data e ora con i parametri passati nella POST
app.post("/inserisciDataOra", function (req, res){

  data = req.body.data;
  ora = req.body.ora;

  return res.status(200).end();

});

// Restituisce la data attuale
app.get('/getData', function(req,res){
  res.json(data);
});

// Restituisce l'ora attuale
app.get('/getOra', function(req,res){
  res.json(ora);
});

// Attivo definitivamente il server --> le richieste ora possono essere accettate!
app.listen (port, () =>  console.log(`Server attivo: http://localhost:${port}` )) ;