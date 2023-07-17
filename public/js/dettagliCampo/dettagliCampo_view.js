"use strict";

class dettagliCampo_view {

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


    getHtmlNode() {

        const div = document.createElement("div");

        let h3 = document.createElement("h3");
        h3.innerHTML = "Informazioni del campo " + this.id;
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

        const br = document.createElement("br");
        div.appendChild(br);

        const hr = document.createElement("hr");
        div.appendChild(hr);
    
        return div;
    }
        
    getHtmlSensore(sensore) {   

        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.innerHTML = sensore.id;

        tr.appendChild(td);
        
        td = document.createElement("td");
        if(sensore.tipo === 'u')
            td.innerHTML = "Umidità";
        else if(sensore.tipo === 't')
            td.innerHTML = "Temperatura";
        tr.appendChild(td);
           
        td = document.createElement("td");
        let a = document.createElement("a");
        a.style = "color:blue";
        a.innerText = "Visualizza";
        a.href = "/listaMisure.html?campo=" + this.id + "&sensore=" + sensore.id;
        a.className = "nodecor";
        td.appendChild(a);
        tr.appendChild(td);

        return tr;
    }

    getHtmlAttuatore(attuatore) {

            let tr = document.createElement("tr");

            let td = document.createElement("td");
            td.innerHTML = attuatore.id;
            tr.appendChild(td);

            td = document.createElement("td");
            if(attuatore.tipo === 'u')
                td.innerHTML = "Umidità";
            else if(attuatore.tipo === 't')
                td.innerHTML = "Temperatura";
            tr.appendChild(td);

            td = document.createElement("td");
            if(attuatore.attivo === 1)
                td.innerHTML = "SI";
            else
                td.innerHTML = "NO";
            tr.appendChild(td);

            td = document.createElement("td");
            if(attuatore.modalita === "m")
                td.innerHTML = "Manuale";
            else
                td.innerHTML = "Automatica";
            tr.appendChild(td);



                td = document.createElement("td");
                let a = document.createElement("a");
                a.style = "color:blue";
                a.innerText = "Crea";
                a.href = "/creaPiano.html?campo=" + this.id + "&attuatore=" + attuatore.id;
                a.className = "nodecor";
                td.appendChild(a);
                tr.appendChild(td);


            td = document.createElement("td");
            a = document.createElement("a");
            a.style = "color:blue";
            a.innerText = "Visualizza";
            a.href = "/listaPiani.html?campo=" + this.id + "&attuatore=" + attuatore.id;
            a.className = "nodecor";
            td.appendChild(a);
            tr.appendChild(td);



                td = document.createElement("td");
                a = document.createElement("a");
                a.style = "color:blue";
                a.innerHTML = "Cambia Modalità";
                td.appendChild(a);
                tr.appendChild(td);



                td = document.createElement("td");
                a = document.createElement("a");
                a.style = "color:blue";

                if(attuatore.attivo === 1)
                    a.innerHTML = "Disattiva";
                else
                    a.innerHTML = "Attiva";
                td.appendChild(a);
                tr.appendChild(td);


            return tr;


    }
}