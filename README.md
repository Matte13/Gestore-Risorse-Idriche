# Gestore Risorse Idriche

## Sviluppatori

    MATTEO SCHIRINZI - 20035542

## Nome Progetto

    Gestore Risorse Idriche

## Descrizione

    Il progetto ha lo scopo di gestire il dispiegamento di risorse idriche in diverse aziende agricole collegate ad un fornitore di risorse idriche che ne gestisce l'assegnazione di acqua.

    Il sistema è strutturato da una WebApp che comunica via MQTT con il sottosistema IoT tramite un broker mosquitto installato localmente; sono presenti due macro componenti: AppWeb e sottosistemaIoT (Java) ed entrambi hanno ruolo di publisher e subscriber.

    L'interfaccia utente della WebApp è stata realizzata sfruttando le ultime tecnologie di sviluppo Web in HTML, CSS e JS, sfruttando i framework di Boostrap e Jquery per la visualizzazione e disposizione dei dati.
    Il frontend interagisce tramite le API REST sviluppate AdHoc con il backend che elabora i dati .
    Il backend comunica con il front-end e salva i dati in modo persistente in un database SQLite.

    La WebApp è così strutturata:
    
    - Frontend
        -> CSS: folder di archivio per tutte le classi css
        -> Fonts: folder di archivio per fonts e icone
        -> Img: folder di archivio delle immagini
        -> JS: contiene i file JS per rendere dinamiche le pagine del frontend e per la visualizzazione dei dati, è organizzato in sottocartelle per ogni pagina HTML ed è stato utilizzato il pattern di progettazione MVC (model, view, controller)
        -> HTML: le pagine html vengono "costruite" in base al tipo di utente e alle richieste che effettua, questo approccio promuove il riutilizzo del codice e un approccio più strutturato
            -> creaAttuatore: pagina che permette di inserire un nuovo attuatore in un determinato campo
            -> creaCampo: pagina che permette creare un nuovo campo
            -> creaPiano: pagina che permette creare un nuovo piano per un attuatore già presente
            -> creaSensore: pagina che permette di inserire un nuovo sensore in un determinato campo
            -> dettagliCampo: pagina che permette di visualizzare tutti i dettagli del campo (coltura, acqua, sensori, ...)
            -> gestioneAcqua: permette di richiedere una modifica della quantità d'acqua dell'azienda agricola
            -> gestore: home page del gestore delle risorse idriche
            -> listaCampi: visualizza la lista dei campi di un'azienda (in forma tabellare)
            -> listaMisure: visualizza (in forma tabellare) le misure di un certo sensore
            -> listaPiani: visualizza tutti i piani per un certo attuatore
            -> login: pagina di login per gli utenti registrati
            -> modificaAcquaTot: permette al gestore delle risorse idriche (fornitore) di modificare la quantità di acqua
            -> modificaCampo: permette di modificare i dettagli di un campo (coltura, acqua, ettari, ...)
            -> registrazione: permette ad un utente (gestore azienda agricola) di registrarsi
            -> registrazioneAzienda: permette di registrare una nuova azienda nel sistema
            -> richieste: visualizza le richieste pendenti di modifica dell'acqua fatte dai gestori delle aziende agricole
            -> storico: visualizza tutti i consumi in ordine decrescente di data di una certa azienda
            -> storicoCampo: visualizza tutti i consumi in ordine decrescente di un certo campo

    - Backend
        -> app.js: viene istanziato il web server, MQTT, e le REST API
        -> attuatore.js: classe necessaria per mappare gli oggeti di tipo attuatore
        -> azienda.js: classe necessaria per mappare gli oggeti di tipo azienda
        -> campo.js: classe necessaria per mappare gli oggeti di tipo campo
        -> configurazione.js: classe necessaria per mappare la configurazione allo start della WebApp
        -> dettagliCampo.js: classe necessaria per mappare i dettagli del campo
        -> misure.js: classe necessaria per mappare le misure effettuate in arrrivo dal sottosistemaIoT
        -> mqtt.js: instanzia il client MQTT rimane in ascolto per i messaggi in arrivo e pubblica sui topic
        -> piano.js: classe necessaria per mappare gli oggeti di tipo piano (dell'attuatore)
        -> sensore.js: classe necessaria per mappare gli oggeti di tipo sensore
        -> server.js: contiene tutti i metodi che vengono richiamati dalle REST API per inserire/prelevare/modifciare/eliminare i dati dal database
        -> user.js: classe necessaria per mappare gli oggeti di tipo utente


    Il backend è realizzato in JavaScript tramite NodeJS e l'utilizzo del framework Express, esso fornisce le API REST utili all'interfaccia web e comunica direttamente con il database; ha componenti di subscribe e publish che permettono, tramite mqtt di ricevere dati o di inviarli:
    - Il ruolo di subscribe lo si utilizza per ricevere le misure dei sensori dal simulatore IoT.
    - Il ruolo di publish invece viene utilizzato per inviare al simulatore il cambiamento dello stato di un attuatore e del inserimento di un nuovo piano.

    Il Sistema IoT è stato realizzato in Java e gestisce il comportamento di sensori e attuatori, ha ruolo di subscriber e publisher.
    Il sistema riceve le informazioni sui sensori/attuatori/piani attraverso chiamate HTTP dirette al server della webapp (se attivo e l'utente ha effettuato l'accesso). 
    Dopo aver reperito informazioni sulle componenti si istanziano un publisher e un subscriber. Il publisher si occupa di pubblicare sui topic le misure registrate dai sensori (distinti per tipo). Il subscriber si iscrive sui topic per ricevere le informazioni sui piani e lo stato degli attuatori per poterli gestire.
    Gestisce l'irrigazione dei campi, il calcolo dell'acqua consumata per singolo campo e per l'azienda, comunicando a fine giornata i dati al backend che li inserirà nel database.
    Per far scorrere più velocemente il tempo è stato utilizzato il seguente sistema: quando si avvia il sottositemaIoT la data viene presa dalla data attuale di sistema mentre l'ora parte da 00:00 e ogni 3 secondi si aggiorna di 3 ore permettendo cosi di velocizzare lo scorrere del tempo e di poter vedere diverse misurazioni. (l'ora e la data sono inviate ad ogni cambio al backend e visualizzate poi dal frontend)

## Esecuzione Sistema

    WebApp:
    - Scaricare ed estrarre l'archivio
    - Aprire la cartella di progetto su IntelliJ o altro IDE di sviluppo
    - Aprire un istanza del terminale nella cartella di progetto
    - Installare le dipendenze usando "npm install" nel terminale
    - Avviare il la webapp con "node app.js" oppure se si utilizza IntelliJ cliccare sul pulsante play "app.js"

    SottosistemIoT:
    - Eseguire un broker mosquitto su 127.0.0.1/localhost (se non già presente installare mosquitto sulla propria macchina e digitare "mosquitto" a terminale, se non si esegue andare nella directory di installazione e riprovare)
    - Aprire il progetto con IntelliJ o altro IDE
    - Verificare la versione di Java (17)
    - Eseguire il file build.gradle
    - Eseguire il file "sottosistemaIoT" nel package upo.IoT

    Ora è possibile aprire il browser all'indirizzo: "http://localhost:3000" e utilizzare il sistema

## Utenti Pre-Registrati

    Utente Agricoltore 1 {
        e-mail : mariorossi@gmail.com
        password : mariorossi
    } 

    Utente Agricoltore 2 {
        e-mail : paoloverdi@gmail.com
        password : paoloverdi
    } 

    Utente Gestore Risorse Idriche {
        e-mail : admin@gmail.com
        password : admin
    }

## Test Effettuati
    LOGIN
        - inserimento non corretto di mail e/o password 
        - login di un utente non registrato
    REGISTRAZIONE UTENTE
        - registrazione con uno o più campi vuoti
        - controllo che la mail inserita non sia già registrata con un’altro utente
        - controllo che le due password coincidano
    REGISTRAZIONE AZIENDA
        - controllo che venga inserito un nome valido (es.non vuoto)
        - controllo che l’azienda non sia già presente nel db
    UTENTE GA
        - cancellazione di un campo
        - modifica di un campo: controllo che tutti i campi siano stati riempiti e che l’acqua assegnata non superi la disponibilità dell’acqua assegnata all’azienda (e agli altri campi dell’azienda)
	    - attuatori: crea piano, attiva/disattiva, cambia modalità, elimina piano
	    - inserimento sensore/attuatore campo: controllo che siano massimo uno per tipo
	    - gestione acqua: controllo che venga immesso un valore valido (controllare che sia un valore numerico), che venga inserita massimo una richiesta al giorno e che la richiesta sia superiore di quella già assegnata
    UTENTE GSI
	    - modifica acqua totale: controllo inserimento di un valore minore uguale dell'acqua attualmente assegnata
    GENERALE
        - controllo che il sottosistemaIoT rilevi i sensori e gli attuatori aggiunti
        - controllo che il sottosistemaIoT produta delle misurazioni dei sensori veritiere e le inserisce correttamente nel db
        - controllo che la WebApp riceva in tempo reale e mostri i cambiamenti di stato degli attuatori e i valori di data e ora


