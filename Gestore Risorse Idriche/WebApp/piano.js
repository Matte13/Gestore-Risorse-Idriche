'use strict';

class Piano {

    constructor(id, giorno, condizione, descrizione, ora_inizio, ora_fine, idAttuatore) {

        this.id = id;
        this.giorno = giorno;
        this.condizione = condizione;
        this.descrizione = descrizione;
        this.ora_inizio = ora_inizio;
        this.ora_fine = ora_fine;
        this.idAttuatore = idAttuatore;
    }
}

module.exports = Piano;