"use strict";

class storicoCampo_app {

    constructor(listaConsumoCampoContainer, idCampo) {

        this.listaConsumoCampoContainer = listaConsumoCampoContainer;
        this.storicoCampoManager = new storicoCampo_manager();
        this.storicoView = new storicoCampo_view();
        this.storicoAcquaCampo = this.storicoCampoManager.storicoAcquaCampo;

        //pulisco il container
        const myNode = document.getElementById("listaConsumoCampo");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.lastChild);
        }

        this.createTable(idCampo);

    }


    createTable(idCampo){

        this.storicoCampoManager.fetchAcqua(idCampo).then(() => {

            this.storicoAcquaCampo = this.storicoCampoManager.storicoAcquaCampo;
            this.showRichieste(this.storicoAcquaCampo);
        });
    }

    showRichieste(storicoAcquaCampo) {

        if(storicoAcquaCampo.length === 0){
            const row = document.createElement("div");
            row.className = "row";
            const hr = document.createElement("hr");
            row.appendChild(hr);
            let col = document.createElement("div");
            col.className = "col";
            row.appendChild(col);
            let h4 = document.createElement("h4");
            h4.innerHTML = "Non sono presenti consumi di acqua per questo campo";
            col.appendChild(h4);
            const hr1 = document.createElement("hr");
            row.appendChild(hr1);

            this.listaConsumoCampoContainer.append(row);
        }
        else
        {

            const table = document.createElement("table");

            const tr = document.createElement("tr");
            table.appendChild(tr);

            let th = document.createElement("th");
            th.innerHTML = "Id";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Data";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Acqua Assegnata";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Acqua Consumata";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Bilancio";
            tr.appendChild(th);

            for(const storico of storicoAcquaCampo) {
                const s = storico.getHtmlNodeRichiesta();

                s.childNodes[2].childNodes[0].id = storico.id;
                s.childNodes[2].childNodes[0].coltura = storico.data;
                s.childNodes[2].childNodes[0].ettari = storico.acquaAssegnata;
                s.childNodes[2].childNodes[0].acquaAssegnata = storico.acquaConsumata;

                table.appendChild(s);
            }

            this.listaConsumoCampoContainer.append(table);
        }
    }



}