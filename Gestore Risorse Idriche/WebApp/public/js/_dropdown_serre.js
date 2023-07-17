"use strict";

(async function (){
                     
    let r = await fetch('/idAzienda');
    const azienda = await r.json(); 

    let response = await fetch(`/aziende/${azienda.idAzienda}/campi`);
    const campi = await response.json();
    console.log(campi);
    let x = document.getElementById("_dropdown_serre");

    for (let campo of campi)
    {
        let option = document.createElement("option");
        option.value= campo.id;
        option.text = campo.id;
        x.add(option);
    }
})();
