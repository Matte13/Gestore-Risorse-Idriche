"use strict";

class listaCampi_manager {

    constructor() {

        this.campi = [];
    }


    //Richiedo i campi dell'azienda identificata dall'id
    async fetchCampo() {

        let resp= await fetch(`/idAzienda`);
        const Azienda= await resp.json();

        resp= await fetch(`/getAcquaAzienda/${Azienda.idAzienda}`);
        const acqua = await resp.json();

        const acquaContainer = document.getElementById("acquaAssegnata");
        const h3 = document.createElement("h3");
        const textNode = document.createTextNode("Acqua attualmente assegnata: " + acqua + " L");
        h3.appendChild(textNode);
        acquaContainer.appendChild(h3);

        let response = await fetch(`/aziende/${Azienda.idAzienda}/campi`);
        const listaCampiJson = await response.json();

        if (response.ok){
            for(let i = 0; i < listaCampiJson.length; i++)
                this.campi.push(new listaCampi_view(listaCampiJson[i].id, listaCampiJson[i].coltura, listaCampiJson[i].idAzienda, listaCampiJson[i].ettari, listaCampiJson[i].tipoIrrigazione, listaCampiJson[i].qtaAcqua, listaCampiJson[i].acquaAssegnata + " L", listaCampiJson[i].umiditaIdeale + "%"));
            return this.campi;
        }
        else{
            throw listaCampiJson;
        }
    }

    async eliminaCampo(campo){

        let idAzienda = campo.currentTarget.idAzienda;
        let id = campo.currentTarget.id;

        let response  = await fetch(`/aziende/${idAzienda}/delcampo/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }



}
