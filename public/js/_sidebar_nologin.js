"use strict";

let menu = document.getElementById("sidebar_nologin");

const x = `

<!-- MENU DI NAVIGAZIONE -->
<div class="w3-sidebar w3-bar-block" style="width:20%; background-color: #00ff2636">
  <a href="/registrazione.html" class="w3-bar-item w3-button">Registrazione</a>
  <a href="/login.html" class="w3-bar-item w3-button">Accedi</a>
</div>

  <!-- FINE MENU DI NAVIGAZIONE -->

`;

menu.innerHTML += x;

