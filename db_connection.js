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
db.student = require(__dirname + '/student.js')(sequelize);
db.nastavnik = require(__dirname + '/nastavnik.js')(sequelize);
db.predmet = require(__dirname + '/predmet.js')(sequelize);
db.prisustvo = require(__dirname + '/prisustvo.js')(sequelize);


/*
    1 nastavnik -> vise predmeta
    1 predmet -> vise studenata
    1 student -> vise prisustva
*/

db.nastavnik.hasMany(db.predmet, {as: 'predmetiNastavnici'});
db.predmet.hasMany(db.student, {as: 'predmetiStudenti'});
db.student.hasMany(db.prisustvo, {as: 'studentPrisustva'});

module.exports = db;


