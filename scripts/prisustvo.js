import {TabelaPrisustvo} from '../scripts/TabelaPrisustvo.js'

let div = document.getElementById("mainContent");

let prisustvo = TabelaPrisustvo(div, {
    "studenti": [{
            "ime": "Neko Nekic",
            "index": 12345
        },
        {
            "ime": "Neko Drugic",
            "index": 12346
        },
        {
            "ime": "Suljo Suljic",
            "index": 12312
        }
    ],
    "prisustva": [{
            "sedmica": 1,
            "predavanja": 2,
            "vjezbe": 1,
            "index": 12345
        },
        {
            "sedmica": 1,
            "predavanja": 2,
            "vjezbe": 1,
            "index": 12346
        },
        {
            "sedmica": 1,
            "predavanja": 2,
            "vjezbe": 1,
            "index": 12312
        },
        {
            "sedmica": 2,
            "predavanja": 2,
            "vjezbe": 1,
            "index": 12312
        },
        {
            "sedmica": 2,
            "predavanja": 2,
            "vjezbe": 1,
            "index": 12346
        }
    ],
    "predmet": "Razvoj mobilnih aplikacija",
	"brojPredavanjaSedmicno": 2,
	"brojVjezbiSedmicno": 2
}
)