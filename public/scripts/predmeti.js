window.onload = function() {
    PoziviAjax.getPredmeti(function(error, data) {
        if(error){
            let poruka = JSON.parse(error);
            document.body.innerHTML="";
            document.body.appendChild(document.createTextNode("Greška! Morate se prijaviti da biste vidjeli predmete."));
        } 
        else {
           // console.log(data);
            const predmeti = JSON.parse(data);
            const predmetiDiv = document.getElementById("listaPredmeta");

            for(let i = 0; i < predmeti.length; i++) {
                let predmet = document.createElement("div");
                predmet.setAttribute("onClick", "otvoriTabelu(this.innerText)");
                predmet.setAttribute("class", "klasaPredmet");
                predmet.appendChild(document.createTextNode(predmeti[i]))
                predmetiDiv.appendChild(predmet);

            }
        }
    });
}

function logoutClick() {
    PoziviAjax.postLogout(function(error, data) {
        if(error) console.log('Greška: ' + error);  
        if(data) {
            console.log('OK');
            window.location.href = "/login";
        }
    });
}

function otvoriTabelu(nazivPredmeta) {
    PoziviAjax.getPredmet(nazivPredmeta, function(err, data) {
        if(err){
            
        } 
        else {
            let podaci = JSON.parse(data);
            let divRef = document.getElementById("mainDiv");
            let tabela = TabelaPrisustvo(divRef, podaci);
        }
    })

}
/*
function mijenjajBoju(polje) {
    let niz = polje.id.split("-");

    +
    //logika za boje

    PoziviAjax.postPrisustvo(naziv, index, prissustvo, function(err, data) {
        if(error) {

        }else {
            let main =documnet.getElementById("mainDiv")
            main.innerHTML = ""
            let podaci =JSON.parse(data);
            let tabela = TabelaPrisustvo(main, podaci);

        }
    })

}
this.background
this.classNam
dodam id gdje onlick */