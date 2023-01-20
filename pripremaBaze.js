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
    var prisustvaListaPromisea = [];

    return new Promise(function(resolve, reject) {

        predmetiListaPromisea.push(db.predmet.create({naziv: 'PREDMET1', brojPredavanjaSedmicno: 2, brojVjezbiSedmicno: 2}));
        predmetiListaPromisea.push(db.predmet.create({naziv: 'PREDMET2', brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 3}));
        predmetiListaPromisea.push(db.predmet.create({naziv: 'PREDMET3', brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2}));
        predmetiListaPromisea.push(db.predmet.create({naziv: 'PREDMET4', brojPredavanjaSedmicno: 2, brojVjezbiSedmicno: 2}));

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

        studentiListaPromisea.push(db.student.create({ime: 'Neko Nekic', index: '12345'}));
        studentiListaPromisea.push(db.student.create({ime: 'Drugi Neko', index: '12346'}));
        studentiListaPromisea.push(db.student.create({ime: 'Neko Drugic', index: '12347'}));
        studentiListaPromisea.push(db.student.create({ime: 'Drugi Nekic', index: '12348'}));
        studentiListaPromisea.push(db.student.create({ime: 'Student Studentic', index: '12349'}));

        Promise.all(studentiListaPromisea).then(function(studenti) {

            var student1 = studenti.filter(function(s) { return s.ime === 'Neko Nekic' && s.index === '12345' })[0];
            var student2 = studenti.filter(function(s) { return s.ime === 'Drugi Neko' && s.index === '12346' })[0];
            var student3 = studenti.filter(function(s) { return s.ime === 'Neko Drugic' && s.index === '12347' })[0];
            var student4 = studenti.filter(function(s) { return s.ime === 'Drugi Nekic' && s.index === '12348' })[0];
            var student5 = studenti.filter(function(s) { return s.ime === 'Student Studentic' && s.index === '12349' })[0];

            Promise.all(predmetiListaPromisea).then(function(predmeti) {

                db.predmet.findOne({where:{naziv: 'PREDMET1'}}).then(function(p) {
                    return p.setPredmetiStudenti([student1, student2]).then(function() {
                        return new Promise(function(resolve, reject) { 
                            resolve(p);
                        })
                    })
                });

                db.predmet.findOne({where:{naziv: 'PREDMET2'}}).then(function(p) {
                    return p.setPredmetiStudenti([student3]).then(function() {
                        return new Promise(function(resolve, reject) { 
                            resolve(p);
                        })
                    })
                });

                db.predmet.findOne({where:{naziv: 'PREDMET3'}}).then(function(p) {
                    return p.setPredmetiStudenti([student4]).then(function() {
                        return new Promise(function(resolve, reject) { 
                            resolve(p);
                        })
                    })
                });

                db.predmet.findOne({where:{naziv: 'PREDMET4'}}).then(function(p) {
                    return p.setPredmetiStudenti([student5]).then(function() {
                        return new Promise(function(resolve, reject) { 
                            resolve(p);
                        })
                    })
                });

            }).catch(function(err) {
                console.log("Predmeti greska " + err);
            });

        }).catch(function(err) {
            console.log("Studenti greska " + err);
        });

        prisustvaListaPromisea.push(db.prisustvo.create({sedmica: 2, predavanja: 0, vjezbe: 1, index: '12345'}));
        prisustvaListaPromisea.push(db.prisustvo.create({sedmica: 1, predavanja: 2, vjezbe: 1, index: '12345'}));
        prisustvaListaPromisea.push(db.prisustvo.create({sedmica: 2, predavanja: 1, vjezbe: 1, index: '12346'}));
        prisustvaListaPromisea.push(db.prisustvo.create({sedmica: 1, predavanja: 0, vjezbe: 0, index: '12346'}));
        prisustvaListaPromisea.push(db.prisustvo.create({sedmica: 1, predavanja: 1, vjezbe: 1, index: '12347'})); 
        prisustvaListaPromisea.push(db.prisustvo.create({sedmica: 1, predavanja: 0, vjezbe: 0, index: '12348'})); 
        prisustvaListaPromisea.push(db.prisustvo.create({sedmica: 1, predavanja: 2, vjezbe: 2, index: '12349'})); 

        Promise.all(prisustvaListaPromisea).then(function(prisustva) {

            var prisustvo1 = prisustva.filter(function(p) { return p.sedmica === 2 && p.predavanja === 0 && p.vjezbe === 1 && p.index === '12345'})[0];
            var prisustvo2 = prisustva.filter(function(p) { return p.sedmica === 1 && p.predavanja === 2 && p.vjezbe === 1 && p.index === '12345'})[0];
            var prisustvo3 = prisustva.filter(function(p) { return p.sedmica === 2 && p.predavanja === 1 && p.vjezbe === 1 && p.index === '12346'})[0];
            var prisustvo4 = prisustva.filter(function(p) { return p.sedmica === 1 && p.predavanja === 0 && p.vjezbe === 0 && p.index === '12346'})[0];
            var prisustvo5 = prisustva.filter(function(p) { return p.sedmica === 1 && p.predavanja === 1 && p.vjezbe === 1 && p.index === '12347'})[0];
            var prisustvo6 = prisustva.filter(function(p) { return p.sedmica === 1 && p.predavanja === 0 && p.vjezbe === 0 && p.index === '12348'})[0];
            var prisustvo7 = prisustva.filter(function(p) { return p.sedmica === 1 && p.predavanja === 2 && p.vjezbe === 2 && p.index === '12349'})[0];

            Promise.all(studentiListaPromisea).then(function(studenti) {

                db.student.findOne({where:{ime: 'Student Studentic'}}).then(function(s) {
                    return s.setStudentPrisustva([prisustvo7]).then(function() {
                        return new Promise(function(resolve, reject) { 
                            resolve(s);
                        })
                    })
                });

                db.student.findOne({where:{ime: 'Neko Drugic'}}).then(function(s) {
                    return s.setStudentPrisustva([prisustvo5]).then(function() {
                        return new Promise(function(resolve, reject) { 
                            resolve(s);
                        })
                    })
                });

                db.student.findOne({where:{ime: 'Drugi Nekic'}}).then(function(s) {
                    return s.setStudentPrisustva([prisustvo6]).then(function() {
                        return new Promise(function(resolve, reject) { 
                            resolve(s);
                        })
                    })
                });

                db.student.findOne({where:{ime: 'Neko Nekic'}}).then(function(s) {
                    return s.setStudentPrisustva([prisustvo1]).then(function() {
                        return new Promise(function(resolve, reject) { 
                            resolve(s);
                        })
                    })
                });

                db.student.findOne({where:{ime: 'Neko Nekic'}}).then(function(s) {
                    return s.setStudentPrisustva([prisustvo2]).then(function() {
                        return new Promise(function(resolve, reject) { 
                            resolve(s);
                        })
                    })
                });

                db.student.findOne({where:{ime: 'Drugi Neko'}}).then(function(s) {
                    return s.setStudentPrisustva([prisustvo3]).then(function() {
                        return new Promise(function(resolve, reject) { 
                            resolve(s);
                        })
                    })
                });

                db.student.findOne({where:{ime: 'Drugi Neko'}}).then(function(s) {
                    return s.setStudentPrisustva([prisustvo4]).then(function() {
                        return new Promise(function(resolve, reject) { 
                            resolve(s);
                        })
                    })
                });

                

            }).catch(function(err) {
                console.log("Studenti greska " + err);
            });

        }).catch(function(err) {
            console.log("Prisustva greska " + err);
        });

        

    });
}