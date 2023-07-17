"use strict";

class gestore_manager {

    constructor() {
        this.campi = [];
        this.campiAziende = [];
    }

    //Richiedo i campi di ogni azienda
    async fetchAcquaTotale() {

        let response = await fetch(`/idAzienda`);
        let idAziendaJson = await response.json();

        let resp= await fetch(`/getAcquaTotale/${idAziendaJson.idAzienda}`);
        return await resp.json();
    }

    //Richiedo i campi di ogni azienda
    async fetchCampiAziende() {

        let resp= await fetch(`/aziende`);
        const listaAziende= await resp.json();

        for(let i = 0; i < listaAziende.length; i++ )
        {
            let response = await fetch(`/aziende/${listaAziende[i].id}/campi`);
            let listaCampiJson = await response.json();
            this.campi = [];
            for(let i = 0; i < listaCampiJson.length; i++)
                this.campi.push(new gestore_view(listaCampiJson[i].id, listaCampiJson[i].coltura, listaCampiJson[i].idAzienda, listaCampiJson[i].ettari, listaCampiJson[i].tipoIrrigazione, listaCampiJson[i].qtaAcqua, listaCampiJson[i].acquaAssegnata + " L", listaCampiJson[i].umiditaIdeale + "%"));
            this.campiAziende[i] = [listaAziende[i], this.campi];
        }

        return this.campiAziende;
    }

    async addIdAzienda(id){

        let idCampo = id.currentTarget.id;

        let response = await fetch(`/getAzienda/${idCampo}`);
        let idAziendaJson = await response.json();

        // Creating Our XMLHttpRequest object
        let xhr = new XMLHttpRequest();

        // Making our connection
        let url = 'http://localhost:3000/modificaIdAzienda/' + idAziendaJson.idAzienda;
        xhr.open("PUT", url, true);

        // function execute after request is successful
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log(this.responseText);
            }
        }
        // Sending our request
        xhr.send();



    }

}
