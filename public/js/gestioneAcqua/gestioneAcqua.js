"use strict";

let azienda;
let acquaAttuale = 0;

async function fetchAcquaAzienda() {
    let resp= await fetch(`/idAzienda`);
    azienda = await resp.json();
    let currentUrl = new URL(window.location.href);
    let response = await fetch(`/getAcquaAzienda/${azienda.idAzienda}`);
    const ultimaRichiesta = await response.json();
    acquaAttuale = ultimaRichiesta;
    if (response.ok)
        document.getElementById("acquaAttuale").innerHTML = "Acqua giornaliera attualmente assegnata all'azienda: " + acquaAttuale + " litri";
    else
        throw ultimaRichiesta;

}

fetchAcquaAzienda().then(r => {});

function inviaRichiesta() {

    let acquaMod = document.getElementById("acquaMod").value;

    if(acquaMod === "")
    {
        document.getElementById("errore_div").innerHTML = "Inserisci un valore!";
        document.getElementById("errore_div").style.display = "block";
        setTimeout(function() {
            document.getElementById("errore_div").style.display = "none";
        }, 3500);
    }
    else if(parseInt(acquaMod) <= acquaAttuale)
    {
        document.getElementById("errore_div").innerHTML = "Inserisci una quantità maggiore di quella attuale!";
        document.getElementById("errore_div").style.display = "block";
        setTimeout(function() {
            document.getElementById("errore_div").style.display = "none";
        }, 3500);
    }
    else
    {
        //Data
        getData().then(data => {
            console.log(data);
            getNomeAzienda().then(nomeAzienda => {
                if(localStorage.getItem(nomeAzienda+data) === null)
                {
                    const richiesta = {
                        data : data,
                        acquaMod : acquaMod,
                        nomeAzienda : nomeAzienda
                    }

                    window.localStorage.setItem(nomeAzienda+data, JSON.stringify(richiesta));
                    alert("Richiesta inserita correttamente, verrà valutata da un GSI");
                    window.location.href = "../../listaCampi.html"
                }
                else
                {
                    alert("Hai già effettuato una richiesta per oggi, non puoi effettuarne un'altra attendi domani");
                }
            });


        })


    }


}

async function getNomeAzienda(){
    let resp= await fetch(`/azienda/${azienda.idAzienda}`);
    let myAzienda = await resp.json();
    return myAzienda[0].nome;
}

async function getData(){
    let resp= await fetch(`/getData`);
    return await resp.json();
}