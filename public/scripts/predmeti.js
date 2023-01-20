window.onload = function() {
    PoziviAjax.getPredmeti(function(error, data) {
        if(error){
            //let poruka = JSON.parse(error);
            document.body.innerHTML="";
            document.body.appendChild(document.createTextNode("Greška! Morate se prijaviti da biste vidjeli predmete."));
            console.log(JSON.parse(error));
        } 
        else {
           // console.log("OVO SU DOBIJENI PODACI" + data);
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
        if(error) {
            console.log('Greška: ' + error);  
        }
        else if(data) {
            console.log('OK');
            window.location.href = "/login";
        }
    });
}

function otvoriTabelu(nazivPredmeta) {
    PoziviAjax.getPredmet(nazivPredmeta, function(err, data) {
        
        if(err){
            console.log(err);
        } 
        else {
            console.log("OVO SU DOBIJENI PODACI" + data);
            let podaci = JSON.parse(data);
            let divRef = document.getElementById("mainDiv");
            let tabela = TabelaPrisustvo(divRef, podaci);
        }
    })
}

function mijenjaBoju(polje) {
    let podaciIzPolja = polje.id.split("/");
    let pritisnuto = podaciIzPolja[0];
    let indeksStudenta = podaciIzPolja[1];
    let predmetStudenta = podaciIzPolja[2];
    let sedmicaStudenta = parseInt(podaciIzPolja[3]);
    let predavanjaStudenta = parseInt(podaciIzPolja[4]);
    let vjezbeStudenta = parseInt(podaciIzPolja[5]);

    //console.log(pritisnuto);
    //console.log(indeksStudenta);
    //console.log(predmetStudenta);
    //console.log(sedmicaStudenta);
    //console.log(predavanjaStudenta);
    //console.log(vjezbeStudenta);

    if(polje.style.background == "red") {
        if(pritisnuto == "P") {
            predavanjaStudenta = predavanjaStudenta + 1;
        }
        if(pritisnuto == "V") {
            vjezbeStudenta = vjezbeStudenta + 1;
        }
        polje.style.background = "green"
    }
    else if(polje.style.background == "green") {
        if(pritisnuto == "P") {
            predavanjaStudenta = predavanjaStudenta - 1;
        }
        if(pritisnuto == "V") {
            vjezbeStudenta = vjezbeStudenta - 1;
        }
        polje.style.background = "red"
    }
    else {
        if(pritisnuto == "P") {
            predavanjaStudenta = predavanjaStudenta + 1;
        }
        if(pritisnuto == "V") {
            vjezbeStudenta = vjezbeStudenta + 1;
        }
        polje.style.background = "green"
    }


    //parseInt(podaciIzPolja[2]);
    //parseInt(podaciIzPolja[3]);

    let prisustvo = {sedmica: sedmicaStudenta, predavanja: predavanjaStudenta, vjezbe: vjezbeStudenta};

    PoziviAjax.postPrisustvo(predmetStudenta, indeksStudenta, prisustvo, function(err, data) {
        if(err) {
            console.log(err);
        } 
        else {
            //console.log("poadaci " + data);
            let main = document.getElementById("mainDiv")
            main.innerHTML = ""
            let podaci = JSON.parse(data);

            for(let i = 0; i < podaci.length; i++) {
                if(podaci[i]["predmet"] == predmetStudenta) {
                    console.log(podaci[i]["predmet"]);
                    let tabela = TabelaPrisustvo(main, podaci[i]);
                    break;
                }
            }
        }
    });

}
