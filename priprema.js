const db = require('./db_connection.js')
db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});

function inicializacija(){
    var nastavniciListaPromisea = [];
    var predmetiListaPromisea = [];
    var studentiListaPromisea = [];

    return new Promise(function(resolve, reject) {

        predmetiListaPromisea.push(db.predmet.create({naziv: 'PREDMET1'}));
        predmetiListaPromisea.push(db.predmet.create({naziv: 'PREDMET2'}));
        predmetiListaPromisea.push(db.predmet.create({naziv: 'PREDMET3'}));
        predmetiListaPromisea.push(db.predmet.create({naziv: 'PREDMET4'}));

        Promise.all(predmetiListaPromisea).then(function(predmeti) {

            var predmet1 = predmeti.filter(function(p) { return p.naziv === 'PREDMET1' })[0];
            var predmet2 = predmeti.filter(function(p) { return p.naziv === 'PREDMET2' })[0];
            var predmet3 = predmeti.filter(function(p) { return p.naziv === 'PREDMET3' })[0];
            var predmet4 = predmeti.filter(function(p) { return p.naziv === 'PREDMET4' })[0];

            nastavniciListaPromisea.push(
                db.nastavnik.create({username: 'USERNAME', password: '$2b$10$jQXkLSXBdzETfHDPCcXzWud1jebCQD5AOe6Mbj0wRc4lMhLKl5Yhu'})
                    .then(function(n) {
                        return n.setPredmetiNastavnici([predmet1, predmet2, predmet3]).then(function() {
                            return new Promise(function(resolve, reject) { 
                                resolve(n);
                            }
                        );
                    });
                })
            );

            nastavniciListaPromisea.push(
                db.nastavnik.create({username: 'USERNAME2', password: '$2b$10$o8YlyozWKFjh9fOQuewEaOcniaKYOWvQwyBlSqyedAOYstX10Nipy'})
                    .then(function(n) {
                        return n.setPredmetiNastavnici([predmet4]).then(function() {
                            return new Promise(function(resolve, reject) { 
                                resolve(n);
                            }
                        );
                    });
                })
            );

            Promise.all(nastavniciListaPromisea).then(function(n) {
                resolve(n);
            }).catch(function(err) {
                console.log("Nastavnici greska " + err);
            });

        }).catch(function(err) {
            console.log("Predmeti greska " + err);
        });

    });
}