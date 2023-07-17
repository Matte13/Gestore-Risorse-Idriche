"use strict";

class gestore_app {
    constructor(listaCampiAziendeContainer) {

        this.listaCampiAziendeContainer = listaCampiAziendeContainer;
        this.gestoreManager = new gestore_manager();
        this.gestoreView = new gestore_view();
        this.campiAziende = this.gestoreManager.campiAziende;
        let lgjson;
        (async function(){

            let logged_gestore = await fetch('/loggato_gestore');
            lgjson = await logged_gestore.json();

        })().then( () => {
            if(lgjson.log) //l'utente è loggato
              {
                    this.gestoreManager.fetchAcquaTotale().then((r)=>{
                        document.getElementById("acquaTotale").innerHTML = "La quantità complessiva di acqua disponibile è " + r[0].acquaTotale + " litri";
                    });
            
                    this.gestoreManager.fetchCampiAziende().then(() => {

                        this.campiAziende = this.gestoreManager.campiAziende;
                        if(lgjson.log)
                            this.showListaCampiAziende(this.campiAziende);
                    });

              }
            else {
                  let main = document.getElementsByTagName("main")[0];
                  main.innerHTML = "<h5 class='hspace'>&nbsp</h5><h5 class='hspace'> Pagina riservata agli utenti loggati correttamente </h5><a href='login.html' class='nodecor'>Torna alla homepage</a>";
                }
            });
        
    }

    showListaCampiAziende(campiAziende) {

        if(campiAziende.length === 0){
            const row = document.createElement("div");
            row.className = "row";
            const hr = document.createElement("hr");
            row.appendChild(hr);
            let col = document.createElement("div");
            col.className = "col";
            row.appendChild(col);
            let h1 = document.createElement("h1");
            h1.innerHTML = "Non sono presenti aziende.";
            col.appendChild(h1);
            const hr1 = document.createElement("hr");
            row.appendChild(hr1);

            this.listaCampiAziendeContainer.append(row);
        }
        else
        {
            let campi = [];
            for (let i = 0; i < campiAziende.length; i++)
            {
                campi = [];
                let br = document.createElement("br");
                this.listaCampiAziendeContainer.append(br);
                const h3 = document.createElement("h3");
                h3.innerHTML = campiAziende[i][0].nome;
                this.listaCampiAziendeContainer.append(h3);
                for (let j = 0; j < this.campiAziende[i][1].length; j++)
                {
                    this.gestoreView = campiAziende[i][1][j];
                    campi.push(this.gestoreView);
                }
                if(campi.length === 0)
                {
                    const h5 = document.createElement("h5");
                    h5.innerHTML = "Non ci sono ancora campi per questa azienda";
                    this.listaCampiAziendeContainer.append(h5);
                }
                else
                    this.creaTabCampi(campi);
            }
        }


    }

    creaTabCampi(campi){

        const table = document.createElement("table");

        const tr = document.createElement("tr");
        table.appendChild(tr);

        let th = document.createElement("th");
        th.innerHTML = "Id Campo";
        tr.appendChild(th);

        th = document.createElement("th");
        th.innerHTML = "Coltura";
        tr.appendChild(th);

        th = document.createElement("th");
        th.innerHTML = "Ettari";
        tr.appendChild(th);

        th = document.createElement("th");
        th.innerHTML = "Acqua Assegnata";
        tr.appendChild(th);

        th = document.createElement("th");
        th.innerHTML = "Umidità Ideale";
        tr.appendChild(th);

        th = document.createElement("th");
        th.innerHTML = "Dettagli";
        tr.appendChild(th);

        for(let i = 0; i < campi.length; i++) {
            let campo = campi[i];
            const s = campo.getHtmlNodeCampo();

            s.childNodes[5].childNodes[0].id = campo.id;
            s.childNodes[5].childNodes[0].coltura = campo.coltura;
            s.childNodes[5].childNodes[0].ettari = campo.ettari;
            s.childNodes[5].childNodes[0].acquaAssegnata = campo.acquaAssegnata;
            s.childNodes[5].childNodes[0].umiditaIdeale = campo.umiditaIdeale;

            s.childNodes[5].childNodes[0].addEventListener("click",this.gestoreManager.addIdAzienda, false);

            table.appendChild(s);
        }
        this.listaCampiAziendeContainer.append(table);
    }




}