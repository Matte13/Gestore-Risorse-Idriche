'use strict';
class DettagliCampo {
    constructor(id, coltura, azienda, ettari, tipoIrrigazione, qtaAcqua, acquaAssegnata, umiditaIdeale, sensori, attuatori) {

        this.id = id;
        this.coltura = coltura;
        this.azienda = azienda;
        this.ettari = ettari;
        this.tipoIrrigazione = tipoIrrigazione;
        this.qtaAcqua = qtaAcqua;
        this.acquaAssegnata = acquaAssegnata;
        this.umiditaIdeale = umiditaIdeale;
        this.sensori = sensori;
        this.attuatori = attuatori;
    }
}

module.exports = DettagliCampo;