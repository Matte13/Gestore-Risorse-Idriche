"use strict";

const dettagliCampoContainer = document.getElementById("dettagliCampo");
let app = new dettagliCampo_app(dettagliCampoContainer);

let idAzienda;
async function getAzienda(){
    let resp= await fetch(`/idAzienda`);
    idAzienda = await resp.json();
}

let currentUrl = new URL(window.location.href);
let idCampo = currentUrl.searchParams.get('campo');

getAzienda();


setInterval(async () => {

    fetch(`/aziende/${idAzienda}/campi/${idCampo}/attuatori`).then(async (resp) => {
        let attuatoriJson = await resp.json();
        let attivo = "NO";
        let attivoDisattiva = "Attiva";
        for (let i = 0; i < attuatoriJson.length; i++){
            if(attuatoriJson[i].attivo === 1)
            {
                attivo = "SI";
                attivoDisattiva = "Disattiva"
            }
            document.getElementById("idAtt" + attuatoriJson[i].id).innerHTML = attivo;
            document.getElementById("attivoDisattiva" + attuatoriJson[i].id).innerHTML = attivoDisattiva;
        }

    })

} ,100);


