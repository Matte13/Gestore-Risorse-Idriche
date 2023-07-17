
"use strict";
let menu = document.getElementById("sidebar_silogin");

(async function(){


  let logged_agri = await fetch('/loggato_agri');
  let logged_gestore = await fetch('/loggato_gestore');
  const lajson = await logged_agri.json();
  const lgjson = await logged_gestore.json();

  let currentUrl = new URL(window.location.href);
  let getId = currentUrl.searchParams.get('campo');
  console.log(getId)

  if(lajson.log){ //utente loggato come agricoltore
    const x = `

    <!-- MENU DI NAVIGAZIONE -->
    
    <div class="w3-sidebar w3-bar-block" style="width:20%; background-color: #00ff2636">
      <a href="/listaCampi.html" class="w3-bar-item w3-button"><i class="fas fa-home"></i> Home</a>
      <a href="/creaSensore.html?campo=${getId}" class="w3-bar-item w3-button"><i class="fa-solid fa-circle-plus"></i> Inserisci sensore</a>
      <a href="/creaAttuatore.html?campo=${getId}" class="w3-bar-item w3-button"><i class="fa-solid fa-circle-plus"></i> Inserisci attuatore</a>
      <a href="/logout" class="w3-bar-item w3-button"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
    </div>
    
      <!-- FINE MENU DI NAVIGAZIONE -->
    `;
    
    menu.innerHTML += x;
  }
  else if(lgjson.log){  //gestore risorse idriche
    const x = `

    <!-- MENU DI NAVIGAZIONE -->
    
    <div class="w3-sidebar w3-bar-block" style="width:20%; background-color: #00bcff36">
      <a href="/gestore.html" class="w3-bar-item w3-button"><i class="fas fa-home"></i> Home</a>
      <a href="/richieste.html" class="w3-bar-item w3-button"><i class="fa-solid fa-droplet"></i>Richieste Acqua</a>
      <a href="/storico.html" class="w3-bar-item w3-button"><i class="fa fa-bar-chart" aria-hidden="true"></i> Storico Acqua</a>
      <a href="/modificaAcquaTot.html" class="w3-bar-item w3-button"><i class="fa fa-bar-chart" aria-hidden="true"></i> Modifica Acqua</a>
      <a href="/logout" class="w3-bar-item w3-button"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
    </div>
    
      <!-- FINE MENU DI NAVIGAZIONE -->
      
    `;
    
    menu.innerHTML += x;
  }
})();

