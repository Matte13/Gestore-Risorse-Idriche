"use strict";
let header = document.getElementById("navTop");

(async function(){


    let logged_agri = await fetch('/loggato_agri');
    let logged_gestore = await fetch('/loggato_gestore');
    const lajson = await logged_agri.json();
    const lgjson = await logged_gestore.json();

    if(lajson.log)
    {
        const x=`
        <nav class="navbar navbar-expand navbar-dark" data-spy="affix" data-offset-top="100" style="background-color: #0ec900">
            <a href="/listaCampi.html"><span class="navbar-brand mb-0" style="width:50%;" id="header-title" >Gestionale Azienda</span></a>

            <a style="color:white; width:100%; text-align:right"><i class="fa-solid fa-user"></i><span style="font-family: Segoe UI,Arial,sans-serif; font-weight: 400; margin: 10px 0;" id="ilnome"></span></a>

        
        </nav>

        <div id="error-message"></div>`;


        header.innerHTML += x

        let nomeA = await fetch('/loggato_agri_nome');
        const json = await nomeA.json();
        document.getElementById("ilnome").innerText = "  " + json.ilnome + " - Agricoltore";

        let idAzienda = await fetch('/idAziendaConfig');
        const jsonAz = await idAzienda.json();

        let nomeAzienda = await fetch(`/azienda/${jsonAz.idAzienda}`);
        const jsonNome = await nomeAzienda.json();

        document.getElementById("header-title").innerHTML = "Gestionale Azienda: " + jsonNome[0].nome;

    }
    if(lgjson.log)
    {
        const x=`
        <nav class="navbar navbar-expand navbar-dark bg-primary" data-spy="affix" data-offset-top="100">
            <a href="/gestore.html"><span class="navbar-brand mb-0" style="width:50%;" id="header-title" >Gestionale Risorse Idriche</span></a>

            <a style="color:white; width:100%; text-align:right"><i class="fa-solid fa-user"></i><span style="font-family: Segoe UI,Arial,sans-serif; font-weight: 400; margin: 10px 0;" id="ilnome"></span></a>

        
        </nav>

        <div id="error-message"></div>`;

        header.innerHTML += x;

        let nomeG = await fetch('/loggato_gestore_nome');
        const json = await nomeG.json();
        document.getElementById("ilnome").innerText = " " + json.ilnome + " - Gestore";

        document.getElementById("header-title").innerHTML = "Gestionale Risorse Idriche";
    }
})();

document.addEventListener("DOMContentLoaded", function(){
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.getElementById('navbar_top').classList.add('fixed-top');
            // add padding top to show content behind navbar
            let navbar_height;
            navbar_height = document.querySelector('.navbar').offsetHeight;
            document.body.style.paddingTop = navbar_height + 'px';
        } else {
            document.getElementById('navbar_top').classList.remove('fixed-top');
            // remove padding top from body
            document.body.style.paddingTop = '0';
        }
    });
});
// DOMContentLoaded  end