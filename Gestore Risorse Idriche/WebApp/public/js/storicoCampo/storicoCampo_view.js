"use strict";

class storicoCampo_view {

    constructor(id, data, acquaAssegnata, acquaConsumata, campo) {

        this.id = id;
        this.data = data;
        this.acquaAssegnata = acquaAssegnata;
        this.acquaConsumata = acquaConsumata;
        this.bilancio = this.acquaAssegnata - this.acquaConsumata;
        this.campo = campo;
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
        td.innerHTML = this.acquaAssegnata + " L";
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