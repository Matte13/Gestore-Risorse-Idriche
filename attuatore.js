'use strict';
class Attuatore {

    constructor(id, modalita, attivo, tipo, idCampo) {

        this.id = id;
        this.modalita = modalita;
        this.attivo = attivo;
        this.tipo = tipo;
        this.idCampo = idCampo;
    }
}

module.exports = Attuatore;