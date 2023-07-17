"use strict";

class listaMisure_app {

    constructor(listaMisureContainer) {

        this.listaMisureContainer = listaMisureContainer;
        this.listaMisureManager = new listaMisure_manager();
        this.misure = this.listaMisureManager.misure;
        let lajson;
        let lgjson;
        (async function(){

            let logged_agri = await fetch('/loggato_agri');
            lajson = await logged_agri.json();
            let logged_gestore = await fetch('/loggato_gestore');
            lgjson = await logged_gestore.json();
        })().then( () => {
            if(lajson.log | lgjson.log) { 
                this.listaMisureManager.fetchMisure().then(() => {
                        this.misure = this.listaMisureManager.misure; 
                        this.showListaMisure(this.misure); 
                    });
                 }
                else {
                  let main = document.getElementsByTagName("main")[0];
                  main.innerHTML = "<h5 class='hspace'>&nbsp</h5><h5 class='hspace'> Pagina riservata agli utenti loggati correttamente </h5><a href='login.html' class='nodecor'>Torna alla homepage</a>";
                }
            });
        
    }

    showListaMisure(misure) {

        let currentUrl = new URL(window.location.href);
        let campo = currentUrl.searchParams.get('campo');
        let nome;
        let nomeCampo;

        let sensore = currentUrl.searchParams.get('sensore');
        let type;
        let tipoSensore;

        (async function(){

            let resp = await fetch(`/getNomeCampo/${campo}`);
            nome = await resp.json();
            console.log(nome);
            nomeCampo = nome[0].coltura;

            resp = await fetch(`/getTipoSensore/${sensore}`);
            type = await resp.json();
            if(type[0].tipo === "u")
                tipoSensore = "umidità";
            else
            if (type[0].tipo === "t")
                tipoSensore = "temperatura";

        })().then( () => {

            if(misure.length === 0){

                const row = document.createElement("div");
                row.className = "row";
                const hr = document.createElement("hr");
                row.appendChild(hr);
                let col = document.createElement("div");
                col.className = "col";
                row.appendChild(col);
                let h1 = document.createElement("h1");
                h1.innerHTML = "Non sono state effettuate misurazioni.";
                col.appendChild(h1);

                let a = document.createElement("a");
                a.innerText = "Clicca per aggiungere un sensore per rilevare misure.";
                a.href = "/creaSensore.html?campo=" + campo;
                a.className = "nodecor";
                col.appendChild(a);

                const hr1 = document.createElement("hr");
                row.appendChild(hr1);

                this.listaMisureContainer.append(row);
            }
            else
            {
                const h3 = document.createElement("h3");
                h3.style.marginTop = "30px";
                h3.innerHTML = "Lista misure rilevate dal sensore di " + tipoSensore + " nel campo " + nomeCampo;
                this.listaMisureContainer.append(h3);

                let br = document.createElement("br");
                this.listaMisureContainer.append(br);

                const table = document.createElement("table");

                const tr = document.createElement("tr");
                table.appendChild(tr);

                let th = document.createElement("th");
                th.innerHTML = "id Misura";
                tr.appendChild(th);

                th = document.createElement("th");
                th.innerHTML = "Valore";
                tr.appendChild(th);

                th = document.createElement("th");
                th.innerHTML = "Data";
                tr.appendChild(th);

                th = document.createElement("th");
                th.innerHTML = "Ora";
                tr.appendChild(th);

                for(const misura of misure) {

                    const m = misura.getHtmlNode();
                    table.appendChild(m);
                }

                this.listaMisureContainer.append(table);
            }

        });
    }
}