"use strict";

const listaConsumoCampoContainer = document.getElementById("listaConsumoCampo");

let app;

//Inserisco la lista delle campi nella select
document.addEventListener("DOMContentLoaded", async () => {
    
    let resp = await fetch(`/idAzienda`);
    const azienda = await resp.json();

    resp = await fetch(`/aziende/${azienda.idAzienda}/campi`);
    let campi = await resp.json();

    const listaCampi = document.getElementById("listaCampi");

    for(let i = 0; i < campi.length; i++){
        let opt = document.createElement('option');
        opt.value = campi[i].id;
        opt.innerHTML = campi[i].coltura;
        listaCampi.appendChild(opt);
    }

    listaCampi.addEventListener("change", function() {
        app = new storicoCampo_app(listaConsumoCampoContainer, listaCampi.value);
    });

});


