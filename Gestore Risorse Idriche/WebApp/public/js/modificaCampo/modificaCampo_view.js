"use strict";

class modificaCampo_view {

    constructor(id, coltura, ettari, tipoIrrigazione, qtaAcqua, acquaAssegnata, umiditaIdeale, sensori, attuatori) {

        this.id = id;
        this.coltura = coltura;
        this.ettari = ettari;
        this.tipoIrrigazione = tipoIrrigazione;
        this.qtaAcqua = qtaAcqua;
        this.acquaAssegnata = acquaAssegnata;
        this.umiditaIdeale = umiditaIdeale;
        this.sensori = sensori;
        this.attuatori = attuatori;
    }

    getHtmlNode() {

        const div = document.createElement("div");

        let h3 = document.createElement("h3");
        h3.innerHTML = "Informazioni attuali del campo " + this.id;
        div.appendChild(h3);

        let col = document.createElement("div");
        col.className = "col";
        div.appendChild(col);

        col = document.createElement("div");
        col.className = "col";
        div.appendChild(col);

        let h4 = document.createElement("h4");
        h4.innerHTML = "Coltura: " + this.coltura;
        col.appendChild(h4);

        col = document.createElement("div");
        col.className = "col";
        div.appendChild(col);

        h4 = document.createElement("h4");
        h4.innerHTML = "Ettari: " + this.ettari;
        col.appendChild(h4);

        col = document.createElement("div");
        col.className = "col";
        div.appendChild(col);

        h4 = document.createElement("h4");
        h4.innerHTML = "Tipo di irrigazione: " + this.tipoIrrigazione;
        col.appendChild(h4);

        col = document.createElement("div");
        col.className = "col";
        div.appendChild(col);

        h4 = document.createElement("h4");
        h4.innerHTML = "Quantità acqua richiesta: " + this.qtaAcqua;
        col.appendChild(h4);

        col = document.createElement("div");
        col.className = "col";
        div.appendChild(col);

        h4 = document.createElement("h4");
        h4.innerHTML = "Acqua Assegnata: " + this.acquaAssegnata + " litri";
        col.appendChild(h4);

        col = document.createElement("div");
        col.className = "col";
        div.appendChild(col);

        h4 = document.createElement("h4");
        h4.innerHTML = "Umidità ideale: " + this.umiditaIdeale + " %";
        col.appendChild(h4);

        const hr = document.createElement("hr");
        div.appendChild(hr);
    
        return div;
    }
        
}