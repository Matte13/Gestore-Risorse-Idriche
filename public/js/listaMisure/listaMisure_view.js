"use strict";

class listaMisure_view{

    constructor(id, valore, data, ora, idSensore) {

        this.id = id,
        this.valore = valore;
        this.data = data;
        this.ora = ora;
    }

    getHtmlNode() {

        let tr = document.createElement("tr");
        
        let td = document.createElement("td");
        td.innerHTML = this.id;
        tr.appendChild(td);
        
        td = document.createElement("td");
        td.innerHTML = this.valore;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = this.data;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = this.ora;
        tr.appendChild(td);
            
        return tr;
    }
}