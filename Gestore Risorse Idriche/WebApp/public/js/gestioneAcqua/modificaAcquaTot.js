"use strict";

let azienda;
const date = new Date();
let getAcquaTotaleAssegnata;

async function fetchAcquaAzienda() {
    let resp= await fetch(`/idAzienda`);
    azienda = await resp.json();

    let currentUrl = new URL(window.location.href);
    let response = await fetch(`/getAcquaTotale/${azienda.idAzienda}`);
    const getAcquaTotale = await response.json();
    
    if (response.ok){
        console.log(getAcquaTotale);
        document.getElementById("acquaAttuale").innerHTML = "Quantità complessiva di acqua attualmente disponibile: " + getAcquaTotale[0].acquaTotale + " litri";
    }
    else{
        throw getAcquaTotale;
    }

    response = await fetch(`/getAcquaTotaleAssegnata/1`);
    getAcquaTotaleAssegnata = await response.json();

    if (response.ok){
        console.log(getAcquaTotaleAssegnata);
        document.getElementById("getAcquaTotaleAssegnata").innerHTML = "Quantità complessiva di acqua attualmente già assegnata: " + getAcquaTotaleAssegnata + " litri";
    }
    else{
        throw getAcquaTotaleAssegnata;
    }

}

fetchAcquaAzienda().then(r => {});



async function inviaRichiesta() {

    let acquaMod = document.getElementById("acquaMod").value;

    console.log(acquaMod);

    if (acquaMod > getAcquaTotaleAssegnata) {
        console.log("dentro if");

        //Inserisco la nuova acqua totale nel db
        fetch("http://localhost:3000/modificaAcquaTotale", {
            method: "POST",
            body: JSON.stringify({
                acquaTotale: acquaMod,
                idFornitore: azienda.idAzienda
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(r => {
            alert("Modifica effettuata correttamente");
            window.location.replace("/gestore.html");
        });


    }
    else
    {
        alert("Attenzione non puoi inserire un valore minore uguale dell'acqua attualmente assegnata");
    }

}
