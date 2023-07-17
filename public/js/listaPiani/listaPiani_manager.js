"use strict";

class listaPiani_manager{

    constructor() {

        this.piani = [];
    }

    
    //Richiedo i campi dell'azienda identificata dall'id
    async fetchPiani() {
        let resp = await fetch(`/idAzienda`);
        const Azienda = await resp.json();

        let currentUrl = new URL(window.location.href);
        let campo = currentUrl.searchParams.get('campi');
        let attuatore = currentUrl.searchParams.get('attuatore');

        let response = await fetch(`/aziende/${Azienda.idAzienda}/campi/${campo}/attuatori/${attuatore}/piani`);
        const listaPianiJson = await response.json();
        console.log(listaPianiJson)
        

        if (response.ok){
            for(let i = 0; i < listaPianiJson.length; i++)
                this.piani.push(new listaPiani_view(listaPianiJson[i].id, listaPianiJson[i].giorno, listaPianiJson[i].condizione, listaPianiJson[i].descrizione, listaPianiJson[i].ora_inizio, listaPianiJson[i].ora_fine, listaPianiJson[i].idAttuatore));   
            return this.piani;

        }
        else{
            throw listaPianiJson;
        }
    }

    //Elimino il piano
    async eliminaPiano(piano){

        let idPiano = piano.currentTarget.id;

        console.log("id piano = " + idPiano);



        let response  = await fetch(`/delPiano/${idPiano}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });



    }
}