'use strict';
class Campo {

    constructor(id, coltura, idAzienda, ettari, tipoIrrigazione, qtaAcqua, acquaAssegnata, umiditaIdeale) {

        this.id = id;
        this.coltura = coltura;
        this.idAzienda = idAzienda;
        this.ettari = ettari;
        this.tipoIrrigazione = tipoIrrigazione;
        this.qtaAcqua = qtaAcqua;
        this.acquaAssegnata = acquaAssegnata;
        this.umiditaIdeale = umiditaIdeale;
    }
}

module.exports = Campo;