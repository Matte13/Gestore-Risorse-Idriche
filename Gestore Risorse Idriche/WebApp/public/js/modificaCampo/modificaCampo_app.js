"use strict";


class modificaCampo_app {

    constructor(modificaCampoContainer,buttonContainer) {

        this.modificaCampoContainer = modificaCampoContainer;
        this.buttonContainer = buttonContainer;

        this.modificaCampoManager = new modificaCampo_manager();
        this.dettagli = this.modificaCampoManager.dettagli;

        this.modificaCampoManager.fetchModificaCampo().then(() => {
            this.dettagli = this.modificaCampoManager.dettagli;
            console.log(this.dettagli)
            this.showModificaCampo(this.dettagli);
        });

    }

    showModificaCampo(dettagli) {
        
        for(const campo of dettagli){
            
            const div = campo.getHtmlNode();
            this.modificaCampoContainer.append(div);
            
            this.buttonContainer.addEventListener("click",this.modificaCampoManager.ModificaCampo, false);
        }

       
    }
}