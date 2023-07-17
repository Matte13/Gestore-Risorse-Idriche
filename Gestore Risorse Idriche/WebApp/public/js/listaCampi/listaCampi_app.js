"use strict";

class listaCampi_app {
    constructor(listaCampiContainer) {

        this.listaCampiContainer = listaCampiContainer;
        this.listaCampiManager = new listaCampi_manager();
        this.campi = this.listaCampiManager.campi;
        let lajson;
        (async function(){

            let logged_agri = await fetch('/loggato_agri');
            lajson = await logged_agri.json();


        })().then( () => {
            if(lajson.log) //l'utente è loggato
              { 
            
                    this.listaCampiManager.fetchCampo().then(() => {

                        this.campi = this.listaCampiManager.campi;
                        if(lajson.log)
                            this.showListaCampiAgri(this.campi);
                    });

              }
            else {
                  let main = document.getElementsByTagName("main")[0];
                  main.innerHTML = "<h5 class='hspace'>&nbsp</h5><h5 class='hspace'> Pagina riservata agli utenti loggati correttamente </h5><a href='login.html' class='nodecor'>Torna alla homepage</a>";
                }
            });
        
    }

    showListaCampiAgri(campi) {

        if(campi.length === 0){
            const row = document.createElement("div");
            row.className = "row";
            const hr = document.createElement("hr");
            row.appendChild(hr);
            let col = document.createElement("div");
            col.className = "col";
            row.appendChild(col);
            let h1 = document.createElement("h1");
            h1.innerHTML = "Non sono presenti campi.";
            col.appendChild(h1);
            let p = document.createElement("p");
            p.innerHTML = "È possibile creare un nuovo campo tramite il pulsante a sinistra.";
            col.appendChild(p);
            const hr1 = document.createElement("hr");
            row.appendChild(hr1);

            this.listaCampiContainer.append(row);
        }
        else
        {
            const h3 = document.createElement("h3");
            h3.innerHTML = "Campi";
            this.listaCampiContainer.append(h3);

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
            th.innerHTML = "Elimina";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Modifica";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Dettagli";
            tr.appendChild(th);
            
            for(const campo of campi) {
                const s = campo.getHtmlNodeAgri();

                    console.log("s " + s);

                    s.childNodes[5].childNodes[0].id = campo.id;
                    s.childNodes[5].childNodes[0].coltura = campo.coltura;
                    s.childNodes[5].childNodes[0].ettari = campo.ettari;
                    s.childNodes[5].childNodes[0].acquaAssegnata = campo.acquaAssegnata;
                    s.childNodes[5].childNodes[0].umiditaIdeale = campo.umiditaIdeale;

                    s.childNodes[5].childNodes[0].addEventListener("click",this.listaCampiManager.eliminaCampo, false);



                table.appendChild(s);
            }

            this.listaCampiContainer.append(table);
        }
    }



    
}