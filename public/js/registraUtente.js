async function registra(){

    let nome = document.getElementById("nome").value;
    let cognome = document.getElementById("cognome").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let re_password = document.getElementById("re_password").value;
    let azienda = document.getElementById("azienda").value;

    if(nome === "" || cognome === "" || email === "" || password === "" || re_password === "" || azienda === "")
    {
        document.getElementById("errore_div").innerHTML = "Completa tutti i campi!";
        document.getElementById("errore_div").style.display = "block";
        setTimeout(function() {
            document.getElementById("errore_div").style.display = "none";
        }, 3500);
    }
    else if(! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
        document.getElementById("errore_div").innerHTML = "Inserisci un indirizzo email valido!";
        document.getElementById("errore_div").style.display = "block";
        setTimeout(function() {
            document.getElementById("errore_div").style.display = "none";
        }, 3500);
    }
    else
    {
        fetch("/user/" + email, {
            method: "GET"
        }).then(res => {

            if(res.status === 500)
            {
                document.getElementById("errore_div").innerHTML = "Email già esistente!";
                document.getElementById("errore_div").style.display = "block";
                setTimeout(function() {
                    document.getElementById("errore_div").style.display = "none";
                }, 3500);
            }
            else if(res.status === 200)
            {
                //Inserimento utente
                let tipo = "a";
                let nome = document.getElementById("nome").value;
                let cognome = document.getElementById("cognome").value;
                let email = document.getElementById("email").value;
                let password = document.getElementById("password").value;
                let re_password = document.getElementById("re_password").value;
                let azienda = document.getElementById("azienda").value;

                if(password === re_password)
                {
                    let data = {nome: nome, cognome: cognome, email: email, password: password, tipo: tipo, azienda: azienda};

                    fetch("/registrazione", {
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(data)
                    }).then(res => {
                        if(res.status === 404)
                        {
                            document.getElementById("errore_div").innerHTML = "Errore nella registrazione dell'utente";
                            document.getElementById("errore_div").style.display = "block";
                            setTimeout(function() {
                                document.getElementById("errore_div").style.display = "none";
                            }, 3500);
                        }
                        else if(res.status === 200)
                        {
                            document.getElementById("success").style.display = "block";
                            setTimeout(function() {
                                document.getElementById("success").style.display = "none";
                                window.location.href = "../login.html";
                            }, 3500);
                        }
                    });
                }
                else
                {
                    document.getElementById("errore_div").innerHTML = "Le password non coincidono!";
                    document.getElementById("errore_div").style.display = "block";
                    setTimeout(function() {
                        document.getElementById("errore_div").style.display = "none";
                    }, 3500);
                }
            }

        });
    }

}