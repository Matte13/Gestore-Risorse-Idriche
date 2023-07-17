"use strict";


class dettagliCampo_app {

    constructor(dettagliCampoContainer) {

        this.dettagliCampoContainer = dettagliCampoContainer;
        this.dettagliCampoManager = new dettagliCampo_manager();
        this.dettagli = this.dettagliCampoManager.dettagli;

        this.dettagliCampoManager.fetchDettagliCampo().then(() => {
            this.dettagli = this.dettagliCampoManager.dettagli;
            this.showDettagliCampo(this.dettagli);
        });

    }

    async getLoggatoGestore() {
        let logged_gestore = await fetch('/loggato_gestore');
        let lgjson = await logged_gestore.json();

        return lgjson.log;
    }

    showDettagliCampo(dettagli) {

            this.getLoggatoGestore().then((loggato_gestore) => {

                for(const dettaglio of dettagli){

                    let table = document.createElement("table");
                    let h3 = document.createElement("h3");
                    let tr = document.createElement("tr");
                    let th = document.createElement("th");
                    let h1 = document.createElement("h1");
                    let hr = document.createElement("hr");
                    let br = document.createElement("br");

                    let div = dettaglio.getHtmlNode();
                    this.dettagliCampoContainer.append(div);

                    h3 = document.createElement("h3");
                    h3.innerHTML = "Elenco sensori";
                    this.dettagliCampoContainer.append(h3);

                    if(dettaglio.sensori.length == 0) {

                        h3 = document.createElement("h3");
                        h3.innerHTML = "Nessun sensore presente in questo campo";
                        this.dettagliCampoContainer.append(h3);
                    }
                    else {

                        table = document.createElement("table");
                        tr = document.createElement("tr");

                        table.appendChild(tr);

                        th = document.createElement("th");
                        th.innerHTML = "Id";
                        tr.appendChild(th);

                        th = document.createElement("th");
                        th.innerHTML = "Tipo";
                        tr.appendChild(th);

                        th = document.createElement("th");
                        th.innerHTML = "Misure";
                        tr.appendChild(th);

                        for(const sens of dettaglio.sensori)
                        {
                            const sensore = dettaglio.getHtmlSensore(sens);
                            table.appendChild(sensore);
                        }

                        this.dettagliCampoContainer.append(table);
                    }

                    br = document.createElement("br");
                    this.dettagliCampoContainer.append(br);

                    hr = document.createElement("hr");
                    this.dettagliCampoContainer.append(hr);

                    //Attuatori
                    h3 = document.createElement("h3");
                    h3.innerHTML = "Elenco attuatori";
                    this.dettagliCampoContainer.append(h3);

                    if(dettaglio.attuatori.length == 0) {

                        h3 = document.createElement("h3");
                        h3.innerHTML = "Nessun attuatore presente in questa campo";
                        this.dettagliCampoContainer.append(h3);
                    }
                    else {

                        table = document.createElement("table");
                        tr = document.createElement("tr");

                        table.appendChild(tr);

                        th = document.createElement("th");
                        th.innerHTML = "Id";
                        tr.appendChild(th);

                        th = document.createElement("th");
                        th.innerHTML = "Tipo";
                        tr.appendChild(th);

                        th = document.createElement("th");
                        th.innerHTML = "Attivo";
                        tr.appendChild(th);

                        th = document.createElement("th");
                        th.innerHTML = "Modalità";
                        tr.appendChild(th);

                        if(!loggato_gestore)
                        {
                            th = document.createElement("th");
                            th.innerHTML = "Crea piano";
                            tr.appendChild(th);
                        }

                        th = document.createElement("th");
                        th.innerHTML = "Visualizza piani ";
                        tr.appendChild(th);

                        if(!loggato_gestore)
                        {
                            th = document.createElement("th");
                            th.innerHTML = "Modifica";
                            tr.appendChild(th);
                        }

                        if(!loggato_gestore)
                        {
                            th = document.createElement("th");
                            th.innerHTML = "Attiva/Disattiva";
                            tr.appendChild(th);
                        }

                        if(!loggato_gestore)
                        {
                            for (const att of dettaglio.attuatori) {
                                const attuatore = dettaglio.getHtmlAttuatore(att);

                                attuatore.childNodes[2].id = "idAtt"+att.id;

                                attuatore.childNodes[6].childNodes[0].id = att.id;
                                attuatore.childNodes[6].childNodes[0].modalita = att.modalita;

                                attuatore.childNodes[7].childNodes[0].id = "attivoDisattiva"+att.id;
                                attuatore.childNodes[7].childNodes[0].attivo = att.attivo;

                                attuatore.childNodes[6].childNodes[0].addEventListener("click", this.dettagliCampoManager.CambiaModalita, false);
                                attuatore.childNodes[7].childNodes[0].addEventListener("click", this.dettagliCampoManager.CambioStato, false);
                                table.appendChild(attuatore);

                            }
                        }
                        else
                        {
                            for (const att of dettaglio.attuatori) {
                                const attuatore = dettaglio.getHtmlAttuatore(att);

                                attuatore.childNodes[4].childNodes[0].remove();
                                attuatore.childNodes[4].appendChild(attuatore.childNodes[5].childNodes[0]);
                                attuatore.childNodes[6].childNodes[0].remove();
                                attuatore.childNodes[7].childNodes[0].remove();

                                attuatore.childNodes[5].remove();
                                attuatore.childNodes[6].remove();
                                attuatore.childNodes[5].remove();
                                table.appendChild(attuatore);
                            }
                        }
                        this.dettagliCampoContainer.append(table);
                    }
                }

            });
    }
}