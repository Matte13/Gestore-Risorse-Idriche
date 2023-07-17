"use strict";


class listaCampi_view {

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

    getHtmlNodeAgri() {

        let tr = document.createElement("tr");
        
        let td = document.createElement("td");
        td.innerHTML = this.id;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = this.coltura;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = this.ettari;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = this.acquaAssegnata;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = this.umiditaIdeale;
        tr.appendChild(td);

        td = document.createElement("td");
        let a = document.createElement("a");
        a.style = "color:red";
        a.innerText = "Elimina";
        a.className = "disdici";
        a.href = "";
        td.appendChild(a);
        tr.appendChild(td);
            
        td = document.createElement("td");
        a = document.createElement("a");
        a.style = "color:blue";
        a.innerText = "Modifica ";
        a.href = "/modificaCampo.html?campo="+this.id;
        a.className = "nodecor";
        td.appendChild(a);
        tr.appendChild(td);

        td = document.createElement("td");
        a = document.createElement("a");
        a.style = "color:green";
        a.innerText = "Dettagli ";
        a.href = "/dettagliCampo.html?campo="+this.id;
        a.className = "nodecor";
        td.appendChild(a);
        tr.appendChild(td);

        return tr;
    }
}