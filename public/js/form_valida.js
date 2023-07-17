"use strict";

(function (){
    let currentUrl = new URL(window.location.href);
    let getErrore = currentUrl.searchParams.get('errore');
    if(getErrore != null){
      if(getErrore.includes("successo")){
          document.getElementById("success_div").style.display = "block";
          document.getElementById("success_msg").className = "success_msg";
          document.getElementById("success_msg").innerHTML = "Registrazione avvenuta con successo, effettua il login.";

          setTimeout(function() {
              document.getElementById("success_div").style.display = "none";
          }, 3500);

      }
      else{
        document.getElementById("errore_msg").className = "errore_msg";
        document.getElementById("errore_msg").innerHTML = "Errore: ";
        document.getElementById("errore_msg").innerHTML += getErrore;
        document.getElementById("errore_div").style.display = "block";
          setTimeout(function() {
              document.getElementById("errore_div").style.display = "none";
          }, 3500);

      }
    }
})();

(function () {
    let forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })();

