async function registra(){
    let nome = document.getElementById("nome").value;

    if(nome === "")
    {
        document.getElementById("errore_div").innerHTML = "Inserisci un nome valido!";
        document.getElementById("errore_div").style.display = "block";
        setTimeout(function() {
            document.getElementById("errore_div").style.display = "none";
        }, 3500);
    }
    else
    {
        let data = {nome: nome};

        fetch("/registrazione/azienda", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(res => {
            if(res.status === 404)
            {
                document.getElementById("errore_div").innerHTML = "Azienda già presente! Reinserisci";
                document.getElementById("errore_div").style.display = "block";
                setTimeout(function() {
                    document.getElementById("errore_div").style.display = "none";
                }, 3500);
            }
            else if(res.status === 200)
            {
                //Acquisisco nome azienda
                fetch("/aziendaId/" + nome, {
                    method: "GET"
                }).then(async (res) => {
                    let idAzienda = await res.json();

                    console.log(idAzienda.id);

                    //Acquisisco data odierna
                    const date = new Date();
                    let currentDay= String(date.getDate()).padStart(2, '0');
                    let currentMonth = String(date.getMonth()+1).padStart(2,"0");
                    let currentYear = date.getFullYear();
                    let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

                    fetch("http://localhost:3000/inserisciRichiestaAcqua", {
                        method: "POST",
                        body: JSON.stringify({
                            data: currentDate,
                            acquaRichiesta: 0,
                            azienda: idAzienda.id
                        }),
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        }
                    }).then((res) => {
                        if(res.status === 200)
                        {
                            document.getElementById("success").style.display = "block";
                            setTimeout(function() {
                                document.getElementById("success").style.display = "none";
                                window.location.href = "../registrazione.html";
                            }, 3500);
                        }
                    });
                })


            }
        });
    }

}