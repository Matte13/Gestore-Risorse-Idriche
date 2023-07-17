"use strict";

class storicoCampo_manager {

    constructor() {
        this.storicoAcquaCampo = [];
    }

    //Richiedo l'utilizzo dell'acqua dell'azienda identificata dall'id
    async fetchAcqua(idCampo) {

        let response = await fetch(`/getStoricoCampo/${idCampo}`);
        const richiesteJson = await response.json();

        if (response.ok){
            for(let i = 0; i < richiesteJson.length; i++)
                this.storicoAcquaCampo.push(new storicoCampo_view(richiesteJson[i].id, richiesteJson[i].data, richiesteJson[i].acquaAssegnata, richiesteJson[i].acquaConsumata));
            return this.storicoAcquaCampo;
        }
        else{
            throw richiesteJson;
        }
    }


}
