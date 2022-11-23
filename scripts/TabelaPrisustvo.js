export let TabelaPrisustvo = function(divRef, podaci) {

    divRef.innerHTML=""; //brisem prethodni sadrzaj

    const tabela = document.createElement("table");
    const tableBody = document.createElement("tbody");
    const brojStudenata = podaci["studenti"].length;
    const brojPrisustva = podaci["prisustva"].length;

    const sedmica = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];

    const posljednjaSedmica = podaci["prisustva"][brojPrisustva-1]["sedmica"];


    for (let i = 0; i < brojStudenata + 1; i++) {
        const red = document.createElement("tr");
        let textKolone = document.createTextNode(' ');

        for (let j = 0; j < posljednjaSedmica + 2; j++) {
            if(i == 0) {
                const kolona = document.createElement("th");
                
                if(j == 0) {
                    textKolone = document.createTextNode('Ime i prezime');
                }
                else if(j == 1) {
                    textKolone = document.createTextNode('Index');
                }
                else {
                    textKolone = document.createTextNode(sedmica[j-2]);
                }
                
                kolona.appendChild(textKolone);
                red.appendChild(kolona);
            }
            else {
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
                else if(j > 1 && j < posljednjaSedmica + 2 - 1){
                    const kolona = document.createElement("td");
                    var ukupnoPredavanjaIVjezbi = podaci["brojPredavanjaSedmicno"] + podaci["brojVjezbiSedmicno"];
                    var stvarnoPrisustvo = 0;
                    
                    for(let k = 0; k < brojPrisustva; k++) {
                        if(podaci["studenti"][i-1]["index"] == podaci["prisustva"][k]["index"] && podaci["prisustva"][k]["sedmica"] == j-1) {
                            stvarnoPrisustvo = podaci["prisustva"][k]["predavanja"] + podaci["prisustva"][k]["vjezbe"];
                        }
                    }
                    
                    let ukupno = document.createTextNode((stvarnoPrisustvo / ukupnoPredavanjaIVjezbi)*100 + "%");
                    

                    kolona.appendChild(ukupno);
                    red.appendChild(kolona);
                }
                else if(j == posljednjaSedmica + 2 - 1) {
                    

                }
            }
        }
  
        
      tableBody.appendChild(red);
      red.style.border = "2px solid";
      
    }
  
    tabela.appendChild(tableBody);
    document.body.appendChild(tabela);
    tabela.style.border = "2px solid";
    tabela.setAttribute("border", "2");
}
