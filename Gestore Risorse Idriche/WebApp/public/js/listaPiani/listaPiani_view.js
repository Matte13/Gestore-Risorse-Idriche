"use strict";


class listaPiani_view{

    constructor(id, giorno, condizione, descrizione, ora_inizio, ora_fine, idAttuatore) {

        this.id = id,
        this.giorno = giorno;
        this.condizione = condizione;
        this.descrizione = descrizione;
        this.ora_inizio = ora_inizio;
        this.ora_fine = ora_fine;
        this.idAttuatore = idAttuatore;
    }

    getHtmlNode() {

        let tr = document.createElement("tr");
        
        let td = document.createElement("td");
        td.innerHTML = this.id;
        tr.appendChild(td);
        
        td = document.createElement("td");
        if(this.giorno === 0)
            td.innerHTML = "Lunedì";
        else if(this.giorno === 1)
            td.innerHTML = "Martedì";
        else if(this.giorno === 2)
            td.innerHTML = "Mercoledì";
        else if(this.giorno === 3)
            td.innerHTML = "Giovedì";
        else if(this.giorno === 4)
            td.innerHTML = "Venerdì";
        else if(this.giorno === 5)
            td.innerHTML = "Sabato";
        else if(this.giorno === 6)
            td.innerHTML = "Domenica";
        
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = this.condizione;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = this.descrizione;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = this.ora_inizio;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = this.ora_fine;
        tr.appendChild(td);

        td = document.createElement("td");
        let a = document.createElement("a");
        a.style = "color:red";
        a.innerText = "Elimina";
        a.className = "disdici";
        a.href = "";
        td.appendChild(a);
        tr.appendChild(td);

        return tr;
    }
}