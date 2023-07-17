(async function (){

    let response = await fetch(`/aziende`);
    const aziende = await response.json();
    console.log(aziende)
    let x = document.getElementById("azienda");
  
    for (let azienda of aziende)
    {
      let option = document.createElement("option");
      option.value= azienda.id;
      option.text = azienda.nome;
      x.add(option);
    }
  })();