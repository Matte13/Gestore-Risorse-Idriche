"use strict";

class listaPiani_app {

    constructor(listaPianiContainer) {

        this.listaPianiContainer = listaPianiContainer;
        this.listaPianiManager = new listaPiani_manager();
        this.piani = this.listaPianiManager.piani;
        
        let lajson;
        let lgjson;
        (async function(){

            let logged_agri = await fetch('/loggato_agri');
            lajson = await logged_agri.json();
            let logged_gestore = await fetch('/loggato_gestore');
            lgjson = await logged_gestore.json();
        })().then( () => {
            if(lajson.log | lgjson.log) //l'utente è loggato
              { 
            
                    this.listaPianiManager.fetchPiani().then(() => {
                        //tutte i piani
                        this.piani = this.listaPianiManager.piani;
                        
                        this.showListaPiani(this.piani);
                           
                    });
                 }
                else {
                  let main = document.getElementsByTagName("main")[0];
                  main.innerHTML = "<h5 class='hspace'>&nbsp</h5><h5 class='hspace'> Pagina riservata agli utenti loggati correttamente </h5><a href='login.html' class='nodecor'>Torna alla homepage</a>";
                }
            });
        
    }

    showListaPiani(piani) {
            
        if(piani.length == 0){

            let currentUrl = new URL(window.location.href);
            let getId = currentUrl.searchParams.get('campo');

            const row = document.createElement("div");
            row.className = "row";
            const hr = document.createElement("hr");
            row.appendChild(hr);
            let col = document.createElement("div");
            col.className = "col";
            row.appendChild(col);
            let h1 = document.createElement("h1");
            h1.innerHTML = "Non sono presenti piani per questo attuatore.";
            col.appendChild(h1);
            let a = document.createElement("a");
            a.innerText = "Torna a Dettagli Campi";
            a.href = "/dettagliCampo.html?campo="+getId;
            a.className = "nodecor";
            col.appendChild(a);

            const hr1 = document.createElement("hr");
            row.appendChild(hr1);

            this.listaPianiContainer.append(row);
        }
        else{

        
            const h1 = document.createElement("h1");
            h1.innerHTML = "Lista dei piani dell'attuatore ";
            this.listaPianiContainer.append(h1);

            let br = document.createElement("br");
            this.listaPianiContainer.append(br);

            const table = document.createElement("table");
            
            const tr = document.createElement("tr");
            table.appendChild(tr);

            let th = document.createElement("th");
            th.innerHTML = "Id Piano";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Giorno";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Condizione";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Descrizione";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Ora Inizio";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Ora Fine";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Elimina";
            tr.appendChild(th);
            
            for(const piano of piani) {
                
                const p = piano.getHtmlNode();
                p.childNodes[6].childNodes[0].id = piano.id;
                p.childNodes[6].childNodes[0].addEventListener("click",this.listaPianiManager.eliminaPiano, false);
                table.appendChild(p);
            }

            this.listaPianiContainer.append(table);   
        } 
    
     }    
}