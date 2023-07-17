(async function (){

  let options = {
    t:"Temperatura",
    u:"Umidità"
  };
    let resp= await fetch(`/idAzienda`);
    const azienda= await resp.json();
    let currentUrl = new URL(window.location.href);
    let getId = currentUrl.searchParams.get('campo');
    console.log(getId)   
    let response = await fetch(`/aziende/${azienda.idAzienda}/campi/${getId}/sensori`);
    const sensori = await response.json();
    if(sensori!= null)
    {
      for (let sensore of sensori)
      {
        tipo=sensore.tipo;
        if(options[tipo]!=null)
        {
          delete options[tipo];
        }
      }
    
      let x = document.getElementById("tipo");
    if(Object.keys(options).length === 0)
    {
      let d = document.getElementById("divTipo");
      d.replaceChildren();
      let c = document.getElementById("contenuto");
      let h3 = document.createElement("h3");
      h3.innerHTML = "Sono gia' stati aggiunti tutti i sensori per questo campo!" ;
      c.appendChild(h3);
      const br = document.createElement("br");
      c.appendChild(br);

     
      let a = document.createElement("a");
      a.innerText = "Torna a Dettagli Campo";
      a.href = "/dettagliCampo.html?campo="+getId;
      a.className = "nodecor";
      c.appendChild(a);

    }
    else{

      for(let key in options) {
        let value = options[key];
        let option = document.createElement("option");
        option.value= key;
        option.text = value;
        x.add(option);
        }
      }  
    }
    else{
      for(let key in options) {
        let value = options[key];
        let option = document.createElement("option");
        option.value= key;
        option.text = value;
        x.add(option);
        }

    }

  })();


