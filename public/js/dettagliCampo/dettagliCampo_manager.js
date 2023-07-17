"use strict";

class dettagliCampo_manager {

    constructor() {

        this.dettagli = [];
    }

    async fetchDettagliCampo() {

        let resp= await fetch(`/idAzienda`);
        const azienda= await resp.json();
        let currentUrl = new URL(window.location.href);
        let getId = currentUrl.searchParams.get('campo');
        console.log("idcampo " + getId);
        let response = await fetch(`/aziende/${azienda.idAzienda}/campi/${getId}`);
        const dettagliCampoJson = await response.json();
        console.log(dettagliCampoJson);
        if (response.ok){
            this.dettagli.push(new dettagliCampo_view(getId,dettagliCampoJson.coltura, dettagliCampoJson.azienda, dettagliCampoJson.ettari, dettagliCampoJson.tipoIrrigazione, dettagliCampoJson.qtaAcqua, dettagliCampoJson.acquaAssegnata, dettagliCampoJson.umiditaIdeale , dettagliCampoJson.sensori , dettagliCampoJson.attuatori ));
                
        }
        else{
            throw dettagliCampoJson;
        }
    }

    async CambiaModalita(att){
        
        let idAtt = att.currentTarget.id;
        let resp= await fetch(`/idAzienda`);
        const azienda= await resp.json();

        let currentUrl = new URL(window.location.href);
        let getId = currentUrl.searchParams.get('campo');

        console.log("idcampo " + getId);

        let resp2= await fetch(`/attuatore/${idAtt}`);
        const mod= await resp2.json();
        
        const cambioM = { modalita: mod.modalita, tipo: mod.tipo};
        console.log(cambioM)
       
        let response  = await fetch(`/aziende/${azienda.idAzienda}/campi/${getId}/attuatori/${idAtt}/modalita`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(cambioM)
        });
        if(response.status === 200)
        {

            window.location="http://localhost:3000/dettagliCampo.html?campo="+getId;
        }


        
    }

    async CambioStato(att){
        
        let idAtt = att.currentTarget.id.replace(/^\D+/g, '');
        let resp= await fetch(`/idAzienda`);
        const azienda= await resp.json();

        let currentUrl = new URL(window.location.href);
        let getId = currentUrl.searchParams.get('campo');

        let resp2= await fetch(`/attuatore/${idAtt}`);
        const attuatore= await resp2.json();
        
        const cambioS = { modalita: attuatore.attivo, tipo: attuatore.tipo};
        console.log(cambioS)
       
        let response  = await fetch(`/aziende/${azienda.idAzienda}/campi/${getId}/attuatori/${idAtt}/stato`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(cambioS)
        });
        if(response.status === 200)
        {
            window.location="http://localhost:3000/dettagliCampo.html?campo="+getId;
        }
    }

}