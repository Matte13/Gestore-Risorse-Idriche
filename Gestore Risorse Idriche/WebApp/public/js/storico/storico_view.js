"use strict";

class storico_view {

    constructor(id, data, acquaRichiesta, acquaConsumata, azienda) {

        this.id = id;
        this.data = data;
        this.acquaRichiesta = acquaRichiesta;
        this.acquaConsumata = acquaConsumata;
        this.bilancio = this.acquaRichiesta - this.acquaConsumata;
        this.azienda = azienda;
    }

    getHtmlNodeRichiesta() {

        let tr = document.createElement("tr");
        
        let td = document.createElement("td");
        td.innerHTML = this.id;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = this.data;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = this.acquaRichiesta + " L";
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = this.acquaConsumata + " L";
        tr.appendChild(td);

        td = document.createElement("td");
        if(this.bilancio > 0) {
            td.style.backgroundColor = "green";
            td.innerHTML = "+" + this.bilancio;
        }
            else if(this.bilancio === 0) {
            td.style.backgroundColor = "yellow";
            td.innerHTML = this.bilancio;
        }
            else {
            td.style.backgroundColor = "red";
            td.innerHTML = this.bilancio;
        }
        tr.appendChild(td);

        return tr;
    }

}