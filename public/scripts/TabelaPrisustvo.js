const tabela = document.createElement("table");
const tableBody = document.createElement("tbody");

const sedmica = ["nula", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];

function crtajTabelu(divRef, podaci, posljednjaSedmica) {
    /* Brisem prethodni sadrzaj. */
    divRef.innerHTML = ""; 
    tableBody.innerHTML = "";

    divRef.style.overflowX = "none";
    divRef.style.overflowY = "scroll";

    const brojStudenata = podaci["studenti"].length;
    const brojPrisustva = podaci["prisustva"].length;

    const divNaslova = document.createElement("div");
    let naslov = document.createTextNode("Naziv predmeta: " + podaci["predmet"]);

    var span = document.createElement('span');

    span.style.fontSize = "20px";
    span.style.marginLeft = "50px";
    span.style.fontWeight = "bold";
    span.appendChild(naslov);

    divNaslova.appendChild(span);
    divRef.appendChild(divNaslova);

    for (let i = 0; i < brojStudenata + 1; i++) {
        const red = document.createElement("tr");
        let textKolone = document.createTextNode(' ');

        for (let j = 0; j < 2; j++) { 
            if(i == 0) {
                const kolona = document.createElement("th");
                
                if(j == 0) {
                    textKolone = document.createTextNode('Ime i prezime');
                }
                else if(j == 1) {
                    textKolone = document.createTextNode('Index');
                }
                
                kolona.appendChild(textKolone);
                kolona.style.width = "65px";
                
                kolona.style.borderRight = "1px solid black";
                red.appendChild(kolona);
            }
            else if(i != 0) {
                if(j == 0) {
                    const kolona = document.createElement("td");
                    textKolone = document.createTextNode(podaci["studenti"][i-1]["ime"]);
                    kolona.appendChild(textKolone);
                    kolona.style.width = "65px";
                    kolona.style.borderRight = "1px solid black";
                    red.appendChild(kolona);
                }
                else if(j == 1) {
                    const kolona = document.createElement("td");
                    textKolone = document.createTextNode(podaci["studenti"][i-1]["index"]);
                    kolona.appendChild(textKolone);
                    kolona.style.width = "65px";
                    kolona.style.borderRight = "1px solid black";
                    red.appendChild(kolona);
                } 
            }
        }

        for(let j = 1; j <= posljednjaSedmica; j++) {
            if(i == 0) {
                const kolona = document.createElement("th");
                textKolone = document.createTextNode(sedmica[j]);
                kolona.appendChild(textKolone);
                kolona.style.borderRight = "1px solid black";
                red.appendChild(kolona);
            }
            else if(i != 0 ) {
                if(j != posljednjaSedmica) {
                    const kolona = document.createElement("td");
                    var ukupnoPredavanjaIVjezbi = podaci["brojPredavanjaSedmicno"] + podaci["brojVjezbiSedmicno"];
                    var stvarnoPrisustvo = 0;
                    
                    for(let k = 0; k < brojPrisustva; k++) {
                        if(podaci["studenti"][i-1]["index"] == podaci["prisustva"][k]["index"] && podaci["prisustva"][k]["sedmica"] == j) {
                            stvarnoPrisustvo = podaci["prisustva"][k]["predavanja"] + podaci["prisustva"][k]["vjezbe"];
                        }
                    }
                    
                    let ukupno = document.createTextNode(Math.round((stvarnoPrisustvo / ukupnoPredavanjaIVjezbi)*100) + "%");
                    
                    kolona.appendChild(ukupno);
                    kolona.style.width = "65px";
                    kolona.style.borderRight = "1px solid black";
                    red.appendChild(kolona);
                }
                else if(j == posljednjaSedmica) {
                    
                    for(let l = 0; l < 2; l++) {
                        
                        const maliRed = document.createElement("tr");

                        if(l == 0 && i != 0) {
                            for(let k = 0; k < podaci["brojPredavanjaSedmicno"]; k++) {
                            
                                const malaKolona = document.createElement("td");
                                var pomocna = k+1;
                                textKolone = document.createTextNode("P" + pomocna);
                                malaKolona.appendChild(textKolone);
                                malaKolona.style.height = "35px";
                                malaKolona.style.borderBottom = "1px solid black";
                                malaKolona.style.borderRight = "1px solid black";
                                malaKolona.style.fontSize = "9px";
                                maliRed.appendChild(malaKolona);
                            }
    
                            for(let k = 0; k < podaci["brojVjezbiSedmicno"]; k++) {
                                const malaKolona = document.createElement("td");
                                var pomocna = k+1;
                                textKolone = document.createTextNode("V" + pomocna);
                                malaKolona.appendChild(textKolone);
                                malaKolona.style.height = "35px";
                                malaKolona.style.borderBottom = "1px solid black";
                                malaKolona.style.borderRight = "1px solid black";
                                malaKolona.style.fontSize = "9px";
                                maliRed.appendChild(malaKolona);
                            }
    
                            red.appendChild(maliRed);
                        }
                        else {

                            var studentUnesen = 0;

                            for(let k = 0; k < brojPrisustva; k++) {
                                if(podaci["studenti"][i-1]["index"] == podaci["prisustva"][k]["index"] && podaci["prisustva"][k]["sedmica"] == j) {
                                    studentUnesen = 1;
                                }
                            }

                            var brojPredavanja = 0;
                            var brojVjezbi = 0;

                            for(let k = 0; k < brojPrisustva; k++) {
                                if(podaci["studenti"][i-1]["index"] == podaci["prisustva"][k]["index"] && podaci["prisustva"][k]["sedmica"] == j) {
                                    brojPredavanja += podaci["prisustva"][k]["predavanja"];
                                    brojVjezbi += podaci["prisustva"][k]["vjezbe"];
                                }
                            }

                            var pomocnaPredavanja = brojPredavanja;
                            var pomocnaVjezbe = brojVjezbi;

                            for(let k = 0; k < podaci["brojPredavanjaSedmicno"]; k++) {
                            
                                const malaKolona = document.createElement("td");
                                var pomocna = k+1;
                                textKolone = document.createTextNode(" ");
                                malaKolona.appendChild(textKolone);
                                malaKolona.style.height = "35px";
                                
                                if(studentUnesen == 0) {
                                    malaKolona.style.background = " ";
                                }
                                else if(brojPredavanja != 0) {
                                    malaKolona.style.background = "green";
                                    brojPredavanja--;
                                }
                                else {
                                    malaKolona.style.background = "red";
                                }

                                malaKolona.style.borderRight = "1px solid black";
                                maliRed.style.borderRight = "1px solid black";

                                malaKolona.setAttribute("id", "P" + "/" + podaci["studenti"][i-1]["index"] + "/" + podaci["predmet"] + "/" + posljednjaSedmica + "/" + pomocnaPredavanja + "/" + pomocnaVjezbe);
                                malaKolona.setAttribute("onClick", "mijenjaBoju(this)");
                                maliRed.appendChild(malaKolona);
                            }
    
                            for(let k = 0; k < podaci["brojVjezbiSedmicno"]; k++) {
                                const malaKolona = document.createElement("td");
                                var pomocna = k+1;
                                textKolone = document.createTextNode(" ");
                                malaKolona.appendChild(textKolone);
                                malaKolona.style.height = "35px";

                                if(studentUnesen == 0) {
                                    malaKolona.style.background = " ";
                                }
                                else if(brojVjezbi != 0) {
                                    malaKolona.style.background = "green";
                                    brojVjezbi--;
                                }
                                else {
                                    malaKolona.style.background = "red";
                                }

                                malaKolona.style.borderRight = "1px solid black";

                                
                                malaKolona.setAttribute("id", "V" + "/" + podaci["studenti"][i-1]["index"] + "/" + podaci["predmet"] + "/" + posljednjaSedmica + "/" + pomocnaPredavanja + "/" + pomocnaVjezbe);
                                malaKolona.setAttribute("onClick", "mijenjaBoju(this)");
                                maliRed.appendChild(malaKolona);
                            }
    
                            red.appendChild(maliRed);
                        }
                    }
                }
            }
        }

        
        if(posljednjaSedmica != 15) {
            if(i == 0) {
                const kolona = document.createElement("th");
                if(posljednjaSedmica + 1 != 15) {
                    textKolone = document.createTextNode(sedmica[posljednjaSedmica+1] + "-" + sedmica[15]);
                }
                else {
                    textKolone = document.createTextNode(sedmica[15]);
                }
                
                kolona.appendChild(textKolone);
                kolona.style.width = "150px";
                kolona.style.borderRight = "1px solid black";
                red.appendChild(kolona);
            }
            else {
                const kolona = document.createElement("td");
                textKolone = document.createTextNode(' ');
                kolona.appendChild(textKolone);
                kolona.style.borderRight = "1px solid black";
                red.appendChild(kolona);
            }
        }

        tableBody.appendChild(red);
        red.style.border = "1px solid";
    }

    tabela.appendChild(tableBody);
    document.body.appendChild(tabela);
    tabela.style.borderCollapse = "collapse";
    tabela.style.marginLeft = "50px";
    tabela.style.marginTop = "50px";
    tabela.style.fontSize = "12px";
    tabela.style.textAlign = "center";
}



var  validacijaPodataka = function(podaci) {
    const brojStudenata = podaci["studenti"].length;
    const brojPrisustva = podaci["prisustva"].length;

    const posljednjaSedmica = podaci["prisustva"][brojPrisustva-1]["sedmica"];
    var validno = 1;

    var predavanja = podaci["brojPredavanjaSedmicno"];
    var vjezbe = podaci["brojVjezbiSedmicno"];

    for(let i = 0; i < brojPrisustva; i++) {
        /* Broj prisustva na predavanju/vjezbi je veci od predavanja/vjezbi sedmicno. */
        if(podaci["prisustva"][i]["predavanja"] > predavanja) validno = 0;
        if(podaci["prisustva"][i]["vjezbe"] > vjezbe) validno = 0;

        /* Broj pisustva je manji od nule. */
        if(podaci["prisustva"][i]["predavanja"] < 0) validno = 0;
        if(podaci["prisustva"][i]["vjezbe"] < 0) validno = 0;
    }

    const brojiSedmice = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    for(let i = 0; i < brojStudenata; i++) {
        /* Isti student ima dva ili vise unosa prisustva za istu sedmicu. */
        for(let j = 0; j < brojPrisustva; j++) {
            if(podaci["studenti"][i]["index"] == podaci["prisustva"][j]["index"]) {
                brojiSedmice[podaci["prisustva"][j]["sedmica"]]++;
            }
        }

        for(let j = 0; j < brojiSedmice.length; j++) {
            if(brojiSedmice[j] > 1) {
                validno = 0;
                break;
            }
        }

        if(validno == 0) break;
        else {
            for(let j = 0; j < brojiSedmice.length; j++) {
                brojiSedmice[j] = 0;
            }
        }

        /* Postoje dva ili vise studenata sa istim indeksom u listi studenata. */
        for(let j = i+1; j < brojStudenata; j++) {
            if(podaci["studenti"][i]["index"] == podaci["studenti"][j]["index"]) {
                validno = 0;
                break;
            }
        }

        if(validno == 0) break;
    }

    /* Postoji prisustvo za studenta koji nije u listi studenata, */
    var postojiIndex = 0;
    for(let j = 0; j < brojPrisustva; j++) {
        postojiIndex = 0;
        for(let i = 0; i < brojStudenata; i++) {
            if(podaci["prisustva"][j]["index"] == podaci["studenti"][i]["index"]) {
                postojiIndex = 1;
            }
        }
        if(postojiIndex == 0) {
            validno = 0;
            break;
        }
    }
    
    /* Sedmica između, npr. 1 i 3, ne postoji 2. */
    var min = 15;
    var max = podaci["prisustva"][0]["sedmica"];

    for(let i = 0; i < brojPrisustva; i++) {
        if(podaci["prisustva"][i]["sedmica"] > max) max = podaci["prisustva"][i]["sedmica"];
        if(podaci["prisustva"][i]["sedmica"] < min) min = podaci["prisustva"][i]["sedmica"];
    }
    
    for(let i = 0; i < brojiSedmice.length; i++) {
        brojiSedmice[i] = 0;
    }

    for(let i = 0; i < brojPrisustva; i++) {
        brojiSedmice[podaci["prisustva"][i]["sedmica"]] = podaci["prisustva"][i]["sedmica"];
    }
   
    var dodatak = 1;
   
    while(min + dodatak < max) {
        console.log(dodatak)
        if(brojiSedmice[min + dodatak] != max && brojiSedmice[min + dodatak] == 0) {
            validno = 0;
            break;
        }
        dodatak++;
    }

    return validno;
}


let TabelaPrisustvo = function(divRef, podaci) {

    divRef.innerHTML = "";
    
    const brojStudenata = podaci["studenti"].length;
    const brojPrisustva = podaci["prisustva"].length;

    /* Određivanje posljednje sedmice. */
    var max = podaci["prisustva"][0]["sedmica"];

    for(let i = 0; i < brojPrisustva; i++) {
        if(podaci["prisustva"][i]["sedmica"] > max) max = podaci["prisustva"][i]["sedmica"];
    }
    const posljednjaSedmica = max;

    //const posljednjaSedmica = podaci["prisustva"][brojPrisustva-1]["sedmica"];
    var trenutnaSedmica = posljednjaSedmica;
    
    if(validacijaPodataka(podaci) == 0) {
        divRef.innerHTML = "Podaci o prisustvu nisu validni!";
    }
    else {
        crtajTabelu(divRef, podaci, posljednjaSedmica);
    }
    

    //dodavanje dugmadi

    let prethodnaSedmica = function() {
        trenutnaSedmica--;
        if(trenutnaSedmica <= 0) trenutnaSedmica = 1;
        if(trenutnaSedmica > 15) trenutnaSedmica = 15;
        
        if(trenutnaSedmica >= 1 && validacijaPodataka(podaci) == 1) {
            crtajTabelu(divRef, podaci, trenutnaSedmica);
        }
    }

    let sljedecaSedmica = function() {
        trenutnaSedmica++;
        if(trenutnaSedmica <= 0) trenutnaSedmica = 1;
        if(trenutnaSedmica > 15) trenutnaSedmica = 15;
        if(trenutnaSedmica > posljednjaSedmica) trenutnaSedmica = posljednjaSedmica;

        if(validacijaPodataka(podaci) == 1) {
            crtajTabelu(divRef, podaci, trenutnaSedmica);
        }
    }
 
    if(validacijaPodataka(podaci) == 1) {
        
        let divDugmadi = document.createElement("div");
        
        let button1 = document.createElement("button");
        button1.style.margin = "20px";
        button1.style.width = "60px";
        button1.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
        divDugmadi.appendChild(button1);

        let button2 = document.createElement("button");
        button2.style.margin = "20px";
        button2.style.width = "60px";
        button2.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
        divDugmadi.appendChild(button2);

        divDugmadi.style.marginLeft= "50px";
        document.body.appendChild(divDugmadi);

        divRef.style.position = "relative";
        divDugmadi.style.position = "absolute";
        divDugmadi.style.bottom = "0px";
    
        button1.onclick = prethodnaSedmica;
        button2.onclick = sljedecaSedmica;
        
    }
    
    return {
        sljedecaSedmica: sljedecaSedmica,
        prethodnaSedmica: prethodnaSedmica
    }
};
