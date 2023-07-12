# AA22-23-Gruppo11

    MATTEO SCHIRINZI - 20035542

## Nome Progetto

    Gestore Risorse Idriche

## Descrizione

    Il progetto ha lo scopo di gestire il dispiegamento di risorse idriche in diverse aziende agricole collegate ad un fornitore di    risorse idriche che ne gestisce l'assegnazione di acqua.

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

- [ ] [Set up project integrations](https://gitlab.di.unipmn.it/pissir22-23/aa22-23-gruppo11/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Automatically merge when pipeline succeeds](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing(SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thank you to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README
Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
