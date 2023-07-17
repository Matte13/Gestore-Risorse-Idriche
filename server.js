"use strict";

const user = require('./user');
const azienda = require('./azienda');
const campo = require('./campo');
const sensore = require('./sensore');
const attuatore = require('./attuatore');
const dettagliCampo = require('./dettagliCampo');
const configurazione = require('./configurazione');
const piano = require('./piano');
const misura = require('./misura');
const sqlite = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const {promise, reject} = require("bcrypt/promises");

class Server {

    constructor() {
        this.DBSOURCE = './database.db';
        this.db =  new sqlite.Database(this.DBSOURCE, (err) => {
            if (err) {
                //errore non si riesce ad aprire il db
                console.err(err.message);
                throw err;
            }
            else{
                console.log('Il Database è stato aperto con successo');
            }
        });

    }

    // Lista degli utenti
    getAllUser() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM utenti";
            this.db.all(sql, [], (err, rows) =>{
                if (err)
                    reject(err);
                else {
                    if (rows === undefined)
                        resolve({error: 'Nessun utente trovato.'});
                    else {
                        let utenti = rows.map((row) => {return new user(row.nome, row.cognome, row.mail, row.password, row.tipo,row.azienda)});
                        console.log("utenti: ",utenti);
                        resolve(utenti);
                    }
                }
            });
        });
    }

    // Restituisce la configurazione
    getConfigurazione(){

        let aziende=[];
        let campi=[];
        let config= [];

        return new Promise((resolve, reject) => {

            (async () =>{

                aziende = await this.getListaAziende();

                for( let azienda of aziende)
                {


                    campi = await this.getListaCampiAzienda(azienda.id);

                    let dettagliCampi= [];
                    let piani= [];
                    if(campo.length != 0)
                    {
                        for (let campo of campi)
                        {

                            let sensori = [];
                            let s = await this.getSensori(campo);
                            sensori=s;
                            let attuatori = [];
                            let a= await this.getAttuatori(campo);
                            attuatori=a;
                            for (let att of a)
                            {
                                let listaPiani= await this.getPianiDettagli(att.id);
                                if(listaPiani.length!=0)
                                {
                                    piani.push(listaPiani);
                                }

                            }

                            let dettagli= new dettagliCampo(campo.id,campo.coltura,campo.azienda, campo.ettari, campo.tipoIrrigazione, campo.qtaAcqua, campo.acquaAssegnata, campo.umiditaIdeale,sensori,attuatori);
                            dettagliCampi.push(dettagli);


                        }
                    }


                    let conf= new configurazione(azienda.id, dettagliCampi,piani);
                    config.push(conf);
                }

                resolve(config);
            })();

        });

    }

    // Restituisce l'acqua totale assegnata dal fornitore
    getAcquaTotaleAssegnata(idFornitore){
        let aziende=[];
        let totaleAcquaAssegnata = 0;

        return new Promise((resolve, reject) => {

            (async () =>{

                aziende = await this.getListaAziende();

                for( let azienda of aziende)
                    totaleAcquaAssegnata += await this.getAcqua(azienda.id);

                resolve(totaleAcquaAssegnata);
            })();

        });
    }

    //Restiuisce l'acqua di un'azienda
    async getAcqua(aziendaId) {
        console.log("id az:" + aziendaId);
        let res = await fetch(`http://localhost:3000/getAcquaAzienda/${aziendaId}`);
        const ultimaRichiesta = await res.json();
        if(ultimaRichiesta !== null)
            return JSON.parse(ultimaRichiesta);
        else
            return 0;
    }


    // Lista delle aziende
    getListaAziende(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Aziende";
            this.db.all(sql, [], (err, rows) =>{
                if (err)
                    reject(err);
                else {
                    if (rows === undefined)
                        resolve({error: 'Nessuna azienda trovata.'});
                    else{
                        let aziende = rows.map((row) => {return new azienda(row.id,row.nome)});
                        resolve(aziende);

                    }
                }
            });
        });
    }

    // Nome di una specifica azienda
    getNomeAzienda(idAzienda){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Aziende WHERE id = ?";
            this.db.all(sql, [idAzienda], (err, rows) =>{
                if (err)
                    reject(err);
                else {
                    if (rows === undefined)
                        resolve({error: 'Nessuna azienda trovata.'});
                    else{
                        let aziende = rows.map((row) => {return new azienda(row.id,row.nome)});
                        resolve(aziende);

                    }
                }
            });
        });
    }

    // Lista dei campi di un azienda
    getListaCampiAzienda(idAzienda){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM campi WHERE idAzienda = ?';

            this.db.all(sql, [idAzienda], (err, rows) =>{
                if (err)
                    reject(err);
                else {
                    if (rows === undefined)
                        resolve({error: 'Nessuna serra trovata.'});
                    else{
                        let campi = rows.map((row) => {return new campo(row.id, row.coltura, row.idAzienda, row.ettari, row.tipoIrrigazione, row.qtaAcqua, row.acquaAssegnata, row.umiditaIdeale)});
                        resolve(campi);
                    }
                }
            });
        });
    }

    // Restituisce il campo
    getCampo(idAzienda,idCampo){
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM campi,aziende WHERE campi.idAzienda=aziende.id AND campi.idAzienda=? AND campi.id=?';

            this.db.get(sql, [idAzienda,idCampo], (err,campo) =>{
                if (err)
                    reject(err);
                else {
                    if (campo === undefined)
                        resolve({error: 'Nessun campo trovato.'});
                    else{

                        (async () =>{
                            let sensori = [];
                            console.log("passo il campo " + campo.id);
                            let s = await this.getSensori(idCampo);
                            sensori=s;
                            let attuatori = [];
                            let a= await this.getAttuatori(idCampo);
                            attuatori=a;
                            //let dettagli= new dettagliCampo(serra.id,serra.coltura,serra.azienda,sensori,attuatori);
                            //La riga sotto solo per provare
                            let dettagli= new dettagliCampo(campo.id,campo.coltura,campo.azienda, campo.ettari, campo.tipoIrrigazione, campo.qtaAcqua, campo.acquaAssegnata, campo.umiditaIdeale,sensori,attuatori);
                            console.log(dettagli);
                            resolve(dettagli)
                        })();
                    }
                }
            });
        });
    }

    // Restituisce i dettagli dei sensori del campo
    getSensoriDettagli(idCampo) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id,tipo FROM sensori WHERE idCampo=?";
            this.db.all(sql,[idCampo],(err, rows) =>{
                if (err)
                    reject(err);
                else {
                    if (rows === 0)
                        resolve({error: 'Nessun sensore trovato.'});
                    else{

                        let sensori = rows.map((row) => {return new sensore(row.id,row.tipo,idCampo)});
                        resolve(sensori);
                    }
                }
            });
        });
    }

    // Restituisce i dettagli degli attuatori del campo
    getAttuatoriDettagli(idCampo) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id,attivo,modalita,tipo FROM attuatori WHERE idCampo=?";

            this.db.all(sql,[idCampo],(err, rows) =>{
                if (err)
                    reject(err);
                else {
                    if (rows === undefined)
                        resolve({error: 'Nessun attuatore trovato.'});
                    else{

                        let attuatori = rows.map((row) => {return new attuatore(row.id,row.modalita,row.attivo,row.tipo, idCampo)});
                        resolve(attuatori);
                    }
                }
            });
        });
    }

    // Restituisce i sensori del campo
    getSensori(idCampo) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM sensori WHERE idCampo=?";

            console.log("idCampo = " + idCampo);
            this.db.all(sql,[idCampo],(err, rows) =>{
                if (err)
                    reject(err);
                else {
                    if (rows === undefined)
                        resolve({error: 'Nessun sensore trovato.'});
                    else{
                        console.log("row" + rows.length);
                        let sensori = rows.map((row) => {return new sensore(row.id,row.tipo,row.idCampo)});
                        console.log("sensore: " + sensori );
                        resolve(sensori);
                    }
                }
            });
        });
    }

    // Restituisce gli attuatori del campo
    getAttuatori(idCampo) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id,attivo,modalita,tipo FROM attuatori WHERE idCampo=?";
            this.db.all(sql,[idCampo],(err, rows) =>{
                if (err)
                    reject(err);
                else {
                    if (rows === undefined)
                        resolve({error: 'Nessun attuatore trovato.'});
                    else{

                        let attuatori = rows.map((row) => {return new attuatore(row.id,row.modalita,row.attivo,row.tipo, idCampo)});
                        resolve(attuatori);
                    }
                }
            });
        });
    }

    // Inserimento di una nuova azienda
    insertAzienda(azienda) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO aziende (nome) VALUES (?)';
            this.db.run(sql, [azienda.nome],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
            });
        });
    }

    // Restituisce true se un'azienda è già presente altrimenti false
    aziendaAlreadyExist(azienda) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT nome FROM aziende WHERE nome = ?';
            this.db.all(sql,[azienda.nome],(err, nome) =>{
                if (nome.length === 0)
                    resolve(false);
                else {
                    resolve(true);
                }
            });
        });
    }


    // Inserimento nuovo campo
    insertCampo(campo) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO campi (coltura,idAzienda, ettari, tipoIrrigazione, qtaAcqua, acquaAssegnata, umiditaIdeale) VALUES (?, ?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [campo.coltura, campo.idAzienda, campo.ettari, campo.tipoIrrigazione, campo.qtaAcqua, campo.acquaAssegnata, campo.umiditaIdeale],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
        });
    }

    // Inserimento del consumo totale di giornata di acqua di un'azienda
    inserisciConsumoTotaleGiornata(consumo) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO storicoAcqua (data,azienda, acquaRichiesta, acquaConsumata) VALUES (?, ?, ?, ?)';
            this.db.run(sql, [consumo.data, consumo.azienda, consumo.acquaRichiesta, consumo.acquaConsumata],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
        });
    }

    // Inserimento del consumo totale di giornata di acqua di un campo
    inserisciConsumoCampoGiornata(consumo) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO storicoAcquaCampi (data,campo, acquaAssegnata, acquaConsumata) VALUES (?, ?, ?, ?)';
            this.db.run(sql, [consumo.data, consumo.campo, consumo.acquaAssegnata, consumo.acquaConsumata],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
        });
    }

    // Inserimento nuovo sensore in uno specifico campo
    insertSensore(sensore) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO sensori (tipo,idCampo) VALUES (?, ?)';
            this.db.run(sql, [sensore.tipo, sensore.idCampo],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
        });
    }

    // Inserimento nuovo attuatore in uno specifico campo
    insertAttuatore(attuatore) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO attuatori (attivo,modalita,tipo,idCampo) VALUES (?, ?, ?, ?)';
            this.db.run(sql, [attuatore.attivo,attuatore.modalita,attuatore.tipo, attuatore.idCampo],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
        });
    }

    //Inserimento nuovo piano per un attuatore
    insertPiano(piano) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO piani (giorno, condizione, descrizione, ora_inizio, ora_fine, idAttuatore) VALUES (?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [piano.giorno,piano.condizione,piano.descrizione,piano.ora_inizio,piano.ora_fine,piano.idAttuatore],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
        });
    }

    // Inserimento una nuova misura
    insertMisura(misura,idSensore) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO misure (valore ,data ,ora ,idSensore) VALUES (? ,? ,? ,?)';
            this.db.run(sql, [misura.valore,misura.data, misura.ora,idSensore],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
        });
    }

    // Elimina un campo
    eliminaCampo(idAzienda,idCampo){

        (async () =>{

            await this.eliminaSensori(idCampo);
            await this.eliminaAttuatori(idCampo);

        })();
        return new Promise((resolve, reject) => {

            const sql = 'DELETE from campi WHERE id = ?';
            this.db.run(sql,  [idCampo],
                function (err) {
                    if(err){
                        reject(err);
                    } else {
                        if (this.changes === 0)
                            resolve({error: 'Nessun campo è stato eliminato.'});
                        else {
                            resolve();
                        }
                    }
                })
        });
    }

    // Elimina Sensori
    eliminaSensori(idCampo){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE from sensori WHERE idCampo = ?';
            this.db.run(sql,  [idCampo],
                function (err) {
                    if(err){
                        reject(err);
                    } else {
                        if (this.changes === 0)
                            resolve({error: 'Nessun sensore è stato eliminato.'});
                        else {
                            resolve();
                        }
                    }
                })
        });
    }

    // Elimina Attuatori
    eliminaAttuatori(idCampo){

        (async () =>{
            let rows = await this.GetIdDeleted(idCampo);

            for(let row of rows){
                await this.eliminaPiani(row.id);
            }

        })();

        return new Promise(async(resolve, reject) => {
            const sql = 'DELETE from attuatori WHERE idCampo = ?';
            this.db.run(sql,  [idCampo],
                function (err) {
                    if(err){
                        reject(err);
                    } else {
                        if (this.changes === 0)
                            resolve({error: 'Nessun attuatore è stato eliminato.'});
                        else {

                            resolve();
                        }
                    }
                })
        });
    }

    // Elimina i paini
    eliminaPiani(id){

        console.log("PIANO"+id);
        return new Promise((resolve, reject) => {
            const sql = 'DELETE from piani WHERE idAttuatore = ?';
            this.db.run(sql,  [id],
                function (err) {
                    if(err){
                        reject(err);
                    } else {
                        if (this.changes === 0)
                            resolve({error: 'Nessun piano è stato eliminato.'});
                        else {
                            resolve();
                        }
                    }
                })
        });
    }

    // Elimina un paino dal suo id
    eliminaPiano(id){

        return new Promise((resolve, reject) => {
            const sql = 'DELETE from piani WHERE id = ?';
            this.db.run(sql,  [id],
                function (err) {
                    if(err){
                        reject(err);
                    } else {
                        if (this.changes === 0)
                            resolve({error: 'Il piano non è stato eliminato.'});
                        else {
                            resolve();
                        }
                    }
                })
        });
    }

    GetIdDeleted(idCampo) {
        console.log(idCampo);
        return new Promise((resolve, reject) => {
            const sql = "SELECT id FROM attuatori WHERE idCampo=?";
            this.db.all(sql,[idCampo],(err, rows) =>{
                if (err)
                    reject(err);
                else {
                    if (rows === undefined)
                        resolve({error: 'Nessun attuatore trovato.'});
                    else{
                        let righe = rows.map((row) => {return new attuatore(row.id)});
                        resolve(righe);

                    }
                }
            });
        });
    }

    // Modifica i dati di un campo
    modificaCampo(campo){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE campi SET coltura = ?, idAzienda = ?, ettari = ?, tipoIrrigazione = ?, qtaAcqua = ?, acquaAssegnata = ?, umiditaIdeale = ? WHERE id = ?';
            this.db.run(sql,  [campo.coltura, campo.idAzienda, campo.ettari, campo.tipoIrrigazione, campo.qtaAcqua, campo.acquaAssegnata, campo.umiditaIdeale, campo.id],

                function (err) {
                    if(err){
                        reject(err);
                    } else {
                        if (this.changes === 0)
                            resolve({error: 'Nessuna modifica è stata apportata al campo'});
                        else {
                            resolve();
                        }
                    }
                })
        });
    }

    // Cambia la modalità di un attuatore
    cambioModalita(valore, idAttuatore){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE attuatori SET modalita = ? WHERE id = ?';
            this.db.run(sql,  [valore, idAttuatore],

                function (err) {
                    if(err){
                        reject(err);
                    } else {
                        if (this.changes === 0)
                            resolve({error: 'Nessuna modifica è stata apportata '});
                        else {
                            resolve();
                        }
                    }
                })
        });
    }

    // Cambia lo stato di un attuatore
    cambioStato(valore, idAttuatore){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE attuatori SET attivo = ? WHERE id = ?';
            this.db.run(sql,  [valore, idAttuatore],

                function (err) {
                    if(err){
                        reject(err);
                    } else {
                        if (this.changes === 0)
                            resolve({error: 'Nessuna modifica è stata apportata '});
                        else {
                            resolve();
                        }
                    }
                })
        });
    }

    // Restituisce un attuatore specifico
    getAttuatore(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id, attivo, modalita, tipo FROM attuatori WHERE id = ?";

            this.db.get(sql,[id],(err, att) =>{
                if (err)
                    reject(err);
                else {
                    if (att === undefined)
                        resolve({error: 'Nessun attuatore trovato.'});
                    else{

                        let res = new attuatore(att.id,att.modalita,att.attivo,att.tipo,att.idCampo);
                        resolve(res);
                    }
                }
            });
        });
    }

    // Restituisce i dettagli di un piano
    getPianiDettagli(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id, giorno, condizione, descrizione, ora_inizio, ora_fine, idAttuatore FROM piani WHERE idAttuatore = ?";


            this.db.all(sql, [id], (err, rows) =>{
                if (err)
                    reject(err);
                else {
                    if (rows === undefined)
                        resolve({error: 'Nessun piano trovato.'});
                    else{

                        let piani = rows.map((row) => {return  new piano(row.id, row.giorno, row.condizione, row.descrizione, row.ora_inizio, row.ora_fine, row.idAttuatore)});
                        resolve(piani);
                    }
                }
            });
        });
    }

    // Restituisce i dettagli di una misurazione
    getMisureDettagli(id){
        return new Promise((resolve, reject) => {
            const sql = "SELECT id, valore, data, ora, idSensore FROM misure WHERE idSensore = ?";

            this.db.all(sql, [id], (err, rows) =>{
                if (err)
                    reject(err);
                else {
                    if (rows === undefined)
                        resolve({error: 'Nessuna misura trovata.'});
                    else{

                        let misure = rows.map((row) => {return new misura(row.id, row.valore, row.data, row.ora, row.idSensore)});
                        resolve(misure);
                    }
                }
            });
        });
    }

    // Restituisce l'azienda collegata al campo
    getAziendaFromCampo(idCampo){
        return new Promise((resolve, reject) => {
            const sql = "SELECT idAzienda FROM campi WHERE id = ?";

            this.db.get(sql,[idCampo],(err, idAzienda) =>{
                if (err)
                    reject(err);
                else
                    resolve(idAzienda);
            });
        });
    }

    // Restituisce le richieste di acqua di un'azienda
    getRichiestaAcqua(data, idAzienda){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM richiesteAcqua WHERE azienda = ? AND data = ?";

            this.db.get(sql,[idAzienda, data],(err, resp) =>{
                if (err)
                    reject(err);
                else
                    resolve(resp);
            });
        });
    }

    // Restituisce l'acqua del fornitore
    getAcquaTotale(idFornitore){
        return new Promise((resolve, reject) => {
            const sql = "SELECT acquaTotale FROM fornitori WHERE id = ? ";

            this.db.all(sql,[idFornitore],(err, resp) =>{
                if (err)
                    reject(err);
                else
                    resolve(resp);
            });
        });
    }

    // Modifica l'acqua totale del fornitore
    modificaAcquaTotale(acquaTotale, idFornitore){
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE fornitori SET acquaTotale = ? WHERE id = ?';
            this.db.run(sql,  [acquaTotale, idFornitore],

                function (err) {
                    if(err){
                        reject(err);
                    } else {
                        if (this.changes === 0)
                            resolve({error: 'Nessuna modifica è stata apportata al fornitore'});
                        else {
                            resolve();
                        }
                    }
                })
        });
    }

    // Restituisce le richieste di acqua di un'azienda
    getRichiesteAcqua(idAzienda){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM richiesteAcqua WHERE azienda = ? ";

            this.db.all(sql,[idAzienda],(err, resp) =>{
                if (err)
                    reject(err);
                else
                    resolve(resp);
            });
        });
    }

    // Restituisce lo storico dell'utilizzo dell'acqua di un'azienda in ordine DESC di data
    getStoricoAcqua(idAzienda){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM storicoAcqua WHERE azienda = ? ORDER BY data DESC";

            this.db.all(sql,[idAzienda],(err, resp) =>{
                if (err)
                    reject(err);
                else
                    resolve(resp);
            });
        });
    }

    // Restituisce lo storico dell'utilizzo dell'acqua di un campo in ordine DESC di data
    getStoricoCampo(idCampo){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM storicoAcquaCampi WHERE campo = ? ORDER BY data DESC";

            this.db.all(sql,[idCampo],(err, resp) =>{
                if (err)
                    reject(err);
                else
                    resolve(resp);
            });
        });
    }

    // Restituisce il tipo del sensore
    getTipoSensore(idSensore){
        return new Promise((resolve, reject) => {
            const sql = "SELECT tipo FROM sensori WHERE id = ?";

            this.db.all(sql,[idSensore],(err, resp) =>{
                if (err)
                    reject(err);
                else
                    resolve(resp);
            });
        });
    }

    // Restituisce il nome del campo
    getNomeCampo(idCampo){
        return new Promise((resolve, reject) => {
            const sql = "SELECT coltura FROM campi WHERE id = ?";

            this.db.all(sql,[idCampo],(err, resp) =>{
                if (err)
                    reject(err);
                else
                    resolve(resp);
            });
        });
    }

    // Inserisce una nuova richiesta di acqua
    inserisciRichiestaAcqua(richiesta){

        console.log("dentro funzione richiesta " + richiesta);
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO richiesteAcqua (data, acquaRichiesta, azienda, fornitore) VALUES (?, ?, ?, ?);";
            this.db.run(sql,[richiesta.data,richiesta.acquaRichiesta, richiesta.azienda, 1 ],function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    // Restituisce l'id dell'azienda dal nome
    geIdAzienda(nomeAzienda){
        return new Promise((resolve, reject) => {
            const sql = "SELECT id FROM aziende WHERE nome = ?";

            this.db.get(sql,[nomeAzienda],(err, idAzienda) =>{
                if (err)
                    reject(err);
                else
                    resolve(idAzienda);
            });
        });
    }

    // Restituisce l'acqua dell'azienda
    getAcquaAzienda(idAzienda){
        return new Promise((resolve, reject) => {
            const sql = "SELECT acquaRichiesta FROM richiesteAcqua WHERE azienda = ? AND id = (SELECT MAX(id) FROM richiesteAcqua WHERE azienda = ?)";

            this.db.get(sql,[idAzienda, idAzienda],(err, acquaRichiesta) =>{
                if (err)
                    reject(err);
                else
                {
                    //let resp = [];
                    //resp.push(acquaRichiesta)
                    resolve(acquaRichiesta.acquaRichiesta);
                }
            });
        });
    }

    getUserByMail(email){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM utenti WHERE mail = ?";

            this.db.get(sql,[email],(err, user) =>{
                if (err)
                    reject(err);
                else {
                    if (user === undefined)
                        resolve(false);
                    else{
                        reject(true);
                    }
                }
            });
        });
    }

    // Restituisce il sensore del campo corrispondente al tipo
    getSensoreMisura(idCampo, tipo) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id FROM sensori WHERE idCampo = ? AND tipo = ?";

            this.db.get(sql,[idCampo,tipo],(err, sens) =>{
                if (err)
                    reject(err);
                else {
                    if (sens === undefined)
                        resolve({error: 'Nessun sensore trovato.'});
                    else{
                        resolve(sens);
                    }
                }
            });
        });
    }

    /* REGISTRAZIONE / LOGIN DEGLI UTENTI */

    // Creazione utente
    createUser(user) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO utenti(nome, cognome, mail, password, tipo) VALUES (?, ?, ?, ?, ?)';
            bcrypt.hash(user.password, 10).then((hash => { //hash della password
                this.db.run(sql, [user.nome, user.cognome, user.mail, hash, 'a'], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(this.lastID + " " + user.azienda);
                        let resp = [];
                        resp.push(this.lastID);
                        resp.push(user.azienda);
                        resolve(resp);
                    }
                });
            }));
        });
    }

    // Crea agricoltore
    createAgricoltore(idUtente, idAzienda){
         return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO agricoltori(idUtente, idAzienda) VALUES (?, ?)';
            this.db.run(sql, [idUtente, idAzienda], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
         });

    }

    // Restituisce un utente dall'id
    getUserById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Utenti WHERE id = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err)
                    reject(err);
                else if (row === undefined)
                    resolve({error: 'Utente non trovato.'});
                else {
                    const user = {nome: row.nome, cognome: row.cognome, mail: row.mail, password: row.password, tipo:row.tipo}
                    resolve(user);
                }
            });
        });
    };

    // Restituisce un utente da mail e password
    getUser(mail, password) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Utenti WHERE mail = ?';
            this.db.get(sql, [mail], (err, row) => {
                if (err)
                    reject(err);
                else if (row === undefined)
                    resolve({error: 'Utente non trovato.'});
                else {
                    if(row.tipo === 'a')
                    {
                        const sql = 'SELECT * FROM Utenti, agricoltori WHERE mail = ? AND utenti.id == agricoltori.idUtente';
                        this.db.get(sql, [mail], (err, row) => {
                            if (err)
                                reject(err);
                            else if (row === undefined)
                                resolve({error: 'Utente non trovato.'});
                            else {
                                const user = {nome: row.nome, cognome: row.cognome, tipo: row.tipo, idAzienda: row.idAzienda};
                                let check = false;
                                if(bcrypt.compareSync(password, row.password))
                                    check = true;
                                resolve({user, check});
                            }
                        });
                    }
                    else {
                        const sql = 'SELECT * FROM Utenti, gestori WHERE mail = ? AND utenti.id == gestori.idUtente';
                        this.db.get(sql, [mail], (err, row) => {
                            if (err)
                                reject(err);
                            else if (row === undefined)
                                resolve({error: 'Utente non trovato.'});
                            else {
                                const user = {nome: row.nome, cognome: row.cognome, tipo: row.tipo, idAzienda: row.idFornitore};
                                let check = false;
                                if(bcrypt.compareSync(password, row.password))
                                    check = true;
                                resolve({user, check});
                            }
                        });
                    }


                }
            });
        });
    };

}

module.exports = Server;