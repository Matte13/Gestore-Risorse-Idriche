"use strict";

class storico_manager {

    constructor() {
        this.storicoAcquaAzienda = [];
    }

    //Richiedo l'utilizzo dell'acqua dell'azienda identificata dall'id
    async fetchAcqua(idAzienda) {

        let response = await fetch(`/getStorico/${idAzienda}`);
        const richiesteJson = await response.json();

        if (response.ok){
            for(let i = 0; i < richiesteJson.length; i++)
                this.storicoAcquaAzienda.push(new storico_view(richiesteJson[i].id, richiesteJson[i].data, richiesteJson[i].acquaRichiesta, richiesteJson[i].acquaConsumata));
            return this.storicoAcquaAzienda;
        }
        else{
            throw richiesteJson;
        }
    }


}
