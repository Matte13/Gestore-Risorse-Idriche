"use strict";

class modificaCampo_manager {

    constructor() {

        this.dettagli = [];
    }
    
    async fetchModificaCampo() {

        let resp= await fetch(`/idAzienda`);
        const azienda= await resp.json();
        let currentUrl = new URL(window.location.href);
        let getId = currentUrl.searchParams.get('campo');
        
        let response = await fetch(`/aziende/${azienda.idAzienda}/campi/${getId}`);
        const modificaCampoJson = await response.json();
        console.log(modificaCampoJson);
        if (response.ok){
            this.dettagli.push(new modificaCampo_view(getId, modificaCampoJson.coltura, modificaCampoJson.ettari, modificaCampoJson.tipoIrrigazione, modificaCampoJson.qtaAcqua, modificaCampoJson.acquaAssegnata, modificaCampoJson.umiditaIdeale, modificaCampoJson.sensori, modificaCampoJson.attuatori));
            console.log(this.dettagli[0])
                
        }
        else{
            throw modificaCampoJson;
        }
    }

     async ModificaCampo(campo){

         let resp= await fetch(`/idAzienda`);
         const azienda= await resp.json();

         resp= await fetch(`/getAcquaAzienda/${azienda.idAzienda}`);
         const acquaAzienda = await resp.json();

         let currentUrl = new URL(window.location.href);
         let getId = currentUrl.searchParams.get('campo');

         resp = await fetch(`/aziende/${azienda.idAzienda}/campi`);
         const listaCampiJson = await resp.json();

         let maxAssegnabile = 0;

         for (let i = 0; i < listaCampiJson.length; i++)
         {
                if(listaCampiJson[i].id !== getId)
                    maxAssegnabile += listaCampiJson[i].acquaAssegnata;
         }

         maxAssegnabile = acquaAzienda - maxAssegnabile;

        const colturaMod = document.getElementById("colturaMod").value;
        const ettariMod = document.getElementById("ettariMod").value;
        const irrigazioneMod = document.getElementById("irrigazioneMod").value;
        const acquaRichiestaMod = document.getElementById("acquaRichiestaMod").value;
        const acquaAssegnataMod = document.getElementById("acquaAssegnataMod").value;
        const umiditaMod = document.getElementById("umiditaMod").value;


        if(acquaAssegnataMod > maxAssegnabile)
        {
            document.getElementById("acquaAssegnata-error").innerHTML = "Valore non permesso, supera il totale della disponibilità dell'azienda (max: " + maxAssegnabile + " )";
            document.getElementById("acquaAssegnata-error").style.display = "block";
        }
        else if(colturaMod === "")
            document.getElementById("coltura-error").style.display = "block";
        else if(ettariMod === "")
            document.getElementById("ettari-error").style.display = "block";
        else if(irrigazioneMod === "")
            document.getElementById("irrigazione-error").style.display = "block";
        else if(acquaRichiestaMod === "")
            document.getElementById("acqua-error").style.display = "block";
        else if(acquaAssegnataMod === "")
            document.getElementById("acquaAssegnata-error").style.display = "block";
        else if(umiditaMod === "")
            document.getElementById("umidità-error").style.display = "block";
        else
        {
            const modifica = { coltura: colturaMod, ettari: ettariMod, tipoIrrigazione: irrigazioneMod, qtaAcqua: acquaRichiestaMod, acquaAssegnata: acquaAssegnataMod, umiditaIdeale: umiditaMod };

            /* let idAzienda = serra.currentTarget.idAzienda; */

            let resp= await fetch(`/idAzienda`);
            const Azienda= await resp.json();
            console.log(Azienda.idAzienda)
            let currentUrl = new URL(window.location.href);
            let getId = currentUrl.searchParams.get('campo');

            let response  = await fetch(`/aziende/${Azienda.idAzienda}/campi/${getId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(modifica)
            });
            if(response.status==200)
            {
                window.location="../../listaCampi.html"
            }
        }
    } 
}