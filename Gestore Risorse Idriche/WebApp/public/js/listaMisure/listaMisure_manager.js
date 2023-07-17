"use strict";

class listaMisure_manager{

    constructor() {

        this.misure = [];
    }

    async fetchMisure() {
        let resp = await fetch(`/idAzienda`);
        const Azienda = await resp.json();

        let currentUrl = new URL(window.location.href);
        let campo = currentUrl.searchParams.get('campo');
        let sensore = currentUrl.searchParams.get('sensore');

        let response = await fetch(`/aziende/${Azienda.idAzienda}/campi/${campo}/sensori/${sensore}/misure`);
        const listaMisureJson = await response.json();
        console.log(listaMisureJson)
        
        if (response.ok){
            for(let i = 0; i < listaMisureJson.length; i++)
                this.misure.push(new listaMisure_view(listaMisureJson[i].id, listaMisureJson[i].valore, listaMisureJson[i].data, listaMisureJson[i].ora, listaMisureJson[i].idSensore));
            return this.misure;

        }
        else{
            throw listaMisureJson;
        }
    }
}