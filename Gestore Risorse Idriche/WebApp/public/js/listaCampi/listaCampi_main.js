"use strict";

const listaCampiContainer = document.getElementById("listaCampi");
let app = new listaCampi_app(listaCampiContainer);

window.setInterval( async function aggiornaDataOra(){
    let resp = await fetch(`/getData`);
    const data = await resp.json();

    resp = await fetch(`/getOra`);
    const ora = await resp.json();

    document.getElementById("data").innerHTML = "Data: " + data + "";
    document.getElementById("ora").innerHTML = "Ora: " + ora + "";
}, 1000);


