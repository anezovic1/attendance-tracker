export let TabelaPrisustvo = function(divRef, podaci) {

    divRef.innerHTML=""; //brisem prethodni sadrzaj

    const tabela = document.createElement("table");
    const tableBody = document.createElement("tbody");
    const brojStudenata = podaci["studenti"].length;
    const brojPrisustva = podaci["prisustva"].length;

    const sedmica = ["nula", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];

    const posljednjaSedmica = podaci["prisustva"][brojPrisustva-1]["sedmica"];
    

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
                kolona.style.width = "50px";
                red.appendChild(kolona);
            }
            else if(i != 0) {
                if(j == 0) {
                    const kolona = document.createElement("td");
                    textKolone = document.createTextNode(podaci["studenti"][i-1]["ime"]);
                    kolona.appendChild(textKolone);
                    red.appendChild(kolona);
                }
                else if(j == 1) {
                    const kolona = document.createElement("td");
                    textKolone = document.createTextNode(podaci["studenti"][i-1]["index"]);
                    kolona.appendChild(textKolone);
                    red.appendChild(kolona);
                } 
            }
        }

        for(let j = 1; j <= posljednjaSedmica; j++) {
            if(i == 0) {
                const kolona = document.createElement("th");
                textKolone = document.createTextNode(sedmica[j]);
                kolona.appendChild(textKolone);
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
                    
                    let ukupno = document.createTextNode((stvarnoPrisustvo / ukupnoPredavanjaIVjezbi)*100 + "%");
                    
                    kolona.appendChild(ukupno);
                    red.appendChild(kolona);
                }
                else {

                    for(let l = 0; l < 2; l++) {
                        const maliRed = document.createElement("tr");

                        for(let k = 0; k < podaci["prisustva"]["brojPredavanjaSedmicno"]; k++) {
                            const malaKolona = document.createElement("td");
                            var pomocna = k+1;
                            textKolone = document.createTextNode("P" + pomocna);
                            malaKolona.appendChild(textKolone);
                            maliRed.appendChild(malaKolona);
                        }

                        for(let k = 0; k < podaci["prisustva"]["brojVjezbiSedmicno"]; k++) {
                            const malaKolona = document.createElement("td");
                            var pomocna = k+1;
                            textKolone = document.createTextNode("V" + pomocna);
                            malaKolona.appendChild(textKolone);
                            maliRed.appendChild(malaKolona);
                        }

                        tableBody.appendChild(maliRed);
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
                red.appendChild(kolona);
            }
            else {
                const kolona = document.createElement("td");
                textKolone = document.createTextNode(' ');
                kolona.appendChild(textKolone);
                
                red.appendChild(kolona);
                
            }
        }
        
        

      tableBody.appendChild(red);
      red.style.border = "2px solid";
      red.style.height = "50px"
    }
  
    tabela.appendChild(tableBody);
    document.body.appendChild(tabela);
    /*tabela.style.border = "2px solid";*/
    tabela.setAttribute("border", "3");
}
