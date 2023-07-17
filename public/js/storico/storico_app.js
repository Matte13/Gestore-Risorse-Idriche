"use strict";

class storico_app {

    constructor(listaCampiAziendaContainer, idAzienda) {

        this.listaCampiAziendaContainer = listaCampiAziendaContainer;
        this.storicoManager = new storico_manager();
        this.storicoView = new storico_view();
        this.storicoAcquaAzienda = this.storicoManager.storicoAcquaAzienda;

        //pulisco il container
        const myNode = document.getElementById("listaCampiAzienda");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.lastChild);
        }

        this.createTable(idAzienda);

    }


    createTable(idAzienda){

        this.storicoManager.fetchAcqua(idAzienda).then(() => {

            this.storicoAcquaAzienda = this.storicoManager.storicoAcquaAzienda;
            this.showRichieste(this.storicoAcquaAzienda);
        });
    }

    showRichieste(storicoAcquaAzienda) {

        if(storicoAcquaAzienda.length === 0){
            const row = document.createElement("div");
            row.className = "row";
            const hr = document.createElement("hr");
            row.appendChild(hr);
            let col = document.createElement("div");
            col.className = "col";
            row.appendChild(col);
            let h4 = document.createElement("h4");
            h4.innerHTML = "Non sono presenti consumi di acqua per questa azienda";
            col.appendChild(h4);
            const hr1 = document.createElement("hr");
            row.appendChild(hr1);

            this.listaCampiAziendaContainer.append(row);
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
            th.innerHTML = "Acqua Richiesta";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Acqua Consumata";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Bilancio";
            tr.appendChild(th);

            for(const storico of storicoAcquaAzienda) {
                const s = storico.getHtmlNodeRichiesta();

                s.childNodes[2].childNodes[0].id = storico.id;
                s.childNodes[2].childNodes[0].coltura = storico.data;
                s.childNodes[2].childNodes[0].ettari = storico.acquaRichiesta;
                s.childNodes[2].childNodes[0].acquaAssegnata = storico.acquaConsumata;

                table.appendChild(s);
            }

            this.listaCampiAziendaContainer.append(table);
        }
    }



}