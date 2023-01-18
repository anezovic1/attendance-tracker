const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt22", "root", "password",{ 
    host: "localhost",
    dialect: "mysql",
    logging: false,
    port: 3306,
    sync: true
});
const db={};

try {
    sequelize.authenticate();
    console.log('Uspješno uspostavljena konekcija!');
} 
catch(error) {
    console.log('Konektovanje sa bazom nije moguće: ', error);
}

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.student = require(__dirname + '/student.js');
db.nastavnik = require(__dirname + '/nastavnik.js');
db.predmet = require(__dirname + '/predmet.js');
db.prisustvo = require(__dirname + '/prisustvo.js');


/*
db.nastavnik.hasMany(db.predmet, {as: 'predmetiNastavnici'});
db.predmet.hasMany(db.student, {as: 'predmetiStudenti'});
*/



/*
//relacije
// Veza 1-n vise knjiga se moze nalaziti u biblioteci
db.biblioteka.hasMany(db.knjiga,{as:'knjigeBiblioteke'});

// Veza n-m autor moze imati vise knjiga, a knjiga vise autora
db.autorKnjiga=db.knjiga.belongsToMany(db.autor,{as:'autori',through:'autor_knjiga',foreignKey:'knjigaId'});
db.autor.belongsToMany(db.knjiga,{as:'knjige',through:'autor_knjiga',foreignKey:'autorId'});

*/

module.exports = db;


