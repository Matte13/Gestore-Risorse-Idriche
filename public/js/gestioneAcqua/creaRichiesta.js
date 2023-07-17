
creaRichiesta().then(r => {});

async function creaRichiesta(){
    const items = { ...localStorage };

    if(localStorage.length !== 0)
    {
        document.getElementById("noRichieste").style.display = "none";
        document.getElementById("siRichieste").style.display = "block";

        for (item in items){
            let richiesta = JSON.parse(localStorage.getItem(item));
            console.log(richiesta);
            aggiungiRichiesta(richiesta);
        }
    }
    else
    {
        document.getElementById("noRichieste").style.display = "block";
        document.getElementById("siRichieste").style.display = "none";
    }

 }

 function aggiungiRichiesta(richiesta){
     const container = document.getElementById("richieste");

     let div = document.createElement("div");
     div.classList.add("row");
     container.appendChild(div);

     let div2 = document.createElement("div");
     div2.classList.add("col-md-7");
     div.appendChild(div2);

     let p = document.createElement("p");
     p.innerHTML = "Nuova richiesta di modifica acqua dall'azienda " + richiesta.nomeAzienda + ", acqua richiesta: " + richiesta.acquaMod + " L";
     div2.appendChild(p);

     let div3 = document.createElement("div");
     div3.classList.add("col-md-1");
     div.appendChild(div3);

     let buttonApprova = document.createElement("button");
     buttonApprova.classList.add("btn");
     buttonApprova.classList.add("btn-success");
     buttonApprova.innerHTML = "Approva";
     buttonApprova.addEventListener("click", async () => {
         //recupero l'id dell'azienda dal nome
         let resp = await fetch(`/aziendaId/${richiesta.nomeAzienda}`);
         let azienda = await resp.json();

         //Inserisco la richiesta nel db
         fetch("http://localhost:3000/inserisciRichiestaAcqua", {
             method: "POST",
             body: JSON.stringify({
                 data: richiesta.data,
                 acquaRichiesta: richiesta.acquaMod,
                 azienda: azienda.id
             }),
             headers: {
                 "Content-type": "application/json; charset=UTF-8"
             }
         }).then(r => {
             alert("Richiesta inserita correttamente");
             localStorage.removeItem(richiesta.nomeAzienda + richiesta.data);
             location.reload();
         });

     });
     div3.appendChild(buttonApprova);

     let div4 = document.createElement("div");
     div4.classList.add("col-md-1");
     div.appendChild(div4);

     let buttonRifiuta = document.createElement("button");
     buttonRifiuta.classList.add("btn");
     buttonRifiuta.classList.add("btn-danger");
     buttonRifiuta.innerHTML = "Rifiuta";
     buttonRifiuta.addEventListener("click", () => {
        localStorage.removeItem(richiesta.nomeAzienda+richiesta.data);
         location.reload();
     });
     div4.appendChild(buttonRifiuta);

     let br = document.createElement("br")
     container.appendChild(br);

 }


