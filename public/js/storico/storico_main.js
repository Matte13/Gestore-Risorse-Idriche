"use strict";

const listaCampiAziendaContainer = document.getElementById("listaCampiAzienda");

let app;

// Inserisco la lista delle aziende nella select
document.addEventListener("DOMContentLoaded", async () => {
    let resp = await fetch(`/aziende`);
    const aziende = await resp.json();

    this.loggedAgri();

    const listaAziende = document.getElementById("listaAziende");

    for(let i = 0; i < aziende.length; i++){
        let opt = document.createElement('option');
        opt.value = aziende[i].id;
        opt.innerHTML = aziende[i].nome;
        listaAziende.appendChild(opt);
    }

    listaAziende.addEventListener("change", function() {
        app = new storico_app(listaCampiAziendaContainer, listaAziende.value);
    });

});

function loggedAgri(){
    let lajson;
    let azienda;
    (async function(){

        let logged_gestore = await fetch('/loggato_agri');
        lajson = await logged_gestore.json();

        let logged_azienda = await fetch('/idAzienda');
        azienda = await logged_azienda.json();

    })().then( () => {
        if(lajson.log) // l'utente è loggato come agricoltore
        {

            const parent = document.getElementById("container-start");
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
            const h1 = document.createElement("h1");
            const textNode = document.createTextNode("Storico consumo acqua totale");
            h1.appendChild(textNode);
            parent.appendChild(h1);

            const app = new storico_app(listaCampiAziendaContainer, azienda.idAzienda);

        }
    });
}
