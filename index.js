const express = require('express');
const bodyParser = require('body-parser');
const sessions = require('express-session');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');
var port = 3000;
const app = express();
const db = require('./db_connection.js');
const { Op } = require('sequelize');
const { prisustvo } = require('./db_connection.js');

app.use(express.static("public"));
app.use(express.static(path.join(__dirname+'/public/css')));
app.use(express.static(path.join(__dirname+'/public/html')));
app.use(express.static(path.join(__dirname+'/public/scripts')));
app.use(express.static(path.join(__dirname+'/public/ikonice')));

app.use(bodyParser.json({extended: true})); /* use it to get form values which we submit */

app.use(sessions({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: false
    })
);
var session;


app.get('/predmet.html', function(req, res) {
    res.sendFile(__dirname + '/public/html/predmet.html');
});

app.get('/prisustvo.html', function(req, res) {
    res.sendFile(__dirname + '/public/html/prisustvo.html');
});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/public/html/prijava.html');
});

app.post('/login', function(req, res) {
    let returnMessage = {'poruka': ''};
    var password = req.body.password;
    
    db.nastavnik.findOne({
        where: {
            username: req.body.username
        }
    }).then(function(pronadjeniNastavnik) {
        if (!pronadjeniNastavnik) {
            returnMessage["poruka"] = 'Neuspješna prijava';
            res.status(404).json(returnMessage);
        }
        else {
            var hashPass = pronadjeniNastavnik.password;
            let postoji;
            let predmetiNastavnika = [];
            
            async function provjeriPassword() {
                postoji = await bcrypt.compare(password, hashPass); 

                await db.predmet.findAll({
                    where: {
                        nastavnikId: pronadjeniNastavnik.id
                    }
                }).then(function(predmeti) {
                    predmeti.forEach(predmet => {
                        predmetiNastavnika.push(predmet.naziv);
                    });
                });
                //console.log('Predmeti:' + predmetiNastavnika);

                if(postoji) {
                    session = req.session;
                    session.username = req.body.username;
                    session.predmeti = predmetiNastavnika;
                    returnMessage["poruka"] = 'Uspješna prijava';
                    res.status(200).json(returnMessage);
                }
                else {
                    session = null;
                    returnMessage["poruka"] = 'Neuspješna prijava';
                    res.status(404).json(returnMessage);
                }
            }
            
            provjeriPassword();
        }
    });
});

app.post('/logout', function(req, res) {
    session.username = null;
    session.predmeti = null;
    //console.log('unisten');
    res.json({ poruka: 'Log out pritisnut!' });
});

/* Ruta koja omogućava ispis poruke, ukoliko nastavnik nije loginovan ili prikaz predmeta ukoliko je loginovan. */

app.get('/predmeti.html', function(req, res) {
    if(session != null) {
        res.sendFile(__dirname + '/public/html/predmeti.html');
    }
    else {
        res.status(404).json({ greska: 'Nastavnik nije loginovan' });
    }
});

app.get('/predmeti', function(req, res) {
    if(session != null && session.username) {
        res.status(200).json(session.predmeti);
    }
    else {
        res.status(404).json({ greska: 'Nastavnik nije loginovan' });
    }
});

app.get('/predmet/:naziv', async function(req, res) {
    
    if(session != null && session.username) {
        const uneseniPredmet = req.params.naziv;
        var returnObject = {'studenti': '', 'prisustva': '', 'predmet': '', 'brojPredavanjaSedmicno': '', 'brojVjezbiSedmicno': ''};
        var idPredmeta;

        await db.predmet.findOne({
            where: {
                naziv: uneseniPredmet
            }
        }).then(function(pronadjeniPredmet) {
            returnObject["predmet"] = pronadjeniPredmet.naziv;
            returnObject["brojPredavanjaSedmicno"] = pronadjeniPredmet.brojPredavanjaSedmicno;
            returnObject["brojVjezbiSedmicno"] = pronadjeniPredmet.brojVjezbiSedmicno;
            idPredmeta = pronadjeniPredmet.id;
        });

        if(!idPredmeta) {
            res.status(404).json({ poruka: 'Predmet ne postoji u bazi!' });
        }
        else {
            var studentiNaPredmetu = [];
            var prisustvaStudenta = [];
            var idStudenata = [];
    

            await db.student.findAll({
                where: {
                    predmetId: idPredmeta
                }
            }).then(function(pronadjeniStudenti) {
                
                pronadjeniStudenti.forEach(student => {
                    var studentObject = {ime: '', index: ''};
                    
                    studentObject["ime"] = student.ime;
                    studentObject["index"] = student.index;
                    studentiNaPredmetu.push(studentObject);
                    idStudenata.push(student.id);

                });
            })

            if(idStudenata) {
                //console.log(studentiNaPredmetu); STUDENTI DOBRO UPISANI
                returnObject["studenti"] = studentiNaPredmetu; 
                //console.log(returnObject["studenti"]);
                //console.log(idStudenata);

                await db.prisustvo.findAll({
                    where: {
                        studentId: {
                            [Op.or]:[idStudenata]
                        }
                    }
                }).then(function(pronadjenaPrisustva) {

                    pronadjenaPrisustva.forEach(prisustvo => {
                        var prisustvoObject = {sedmica: '', predavanja: '', vjezbe: '', index: ''};
                        
                        prisustvoObject["sedmica"] = prisustvo.sedmica;
                        prisustvoObject["predavanja"] = prisustvo.predavanja;
                        prisustvoObject["vjezbe"] = prisustvo.vjezbe;
                        prisustvoObject["index"] = prisustvo.index;
                        prisustvaStudenta.push(prisustvoObject);
                    
                    });
                });

                returnObject["prisustva"] = prisustvaStudenta;
                
                res.status(200).json(returnObject);
            }
            else {
                res.status(404).json({ poruka: 'Na ovom predmetu trenutno nema studenata!' });
            }
        }
    }
    else {
        res.status(404).json({ greska: 'Nastavnik nije loginovan' });
    }
});


app.post('/prisustvo/predmet/:naziv/student/:index', async function(req, res) {
    const uneseniPredmet = req.params.naziv;
    const uneseniIndex = req.params.index;

    let unesenaSedmica = req.body["sedmica"];
    let unesenoPredavanja = req.body["predavanja"];
    let uneseneVjezbe = req.body["vjezbe"];

    var returnObject = {'studenti': '', 'prisustva': '', 'predmet': '', 'brojPredavanjaSedmicno': '', 'brojVjezbiSedmicno': ''};

    var idPredmeta = 0;

    await db.predmet.findOne({
        where: {
            naziv: uneseniPredmet
        }
    }).then(function(pronadjeniPredmet) {
        returnObject["predmet"] = pronadjeniPredmet.naziv;
        returnObject["brojPredavanjaSedmicno"] = pronadjeniPredmet.brojPredavanjaSedmicno;
        returnObject["brojVjezbiSedmicno"] = pronadjeniPredmet.brojVjezbiSedmicno;
        idPredmeta = pronadjeniPredmet.id;
    });

    if(!idPredmeta) {
        res.status(404).json({ poruka: 'Predmet ne postoji u bazi!' });
    }
    else {
        var idStudenata = [];
        var studentiNaPredmetu = [];
        var prisustvaStudenta = [];
        var trazeniStudent;

        await db.student.findAll({
            where: {
                predmetId: idPredmeta
            }
        }).then(function(pronadjeniStudenti) {
            
            pronadjeniStudenti.forEach(student => {
                var studentObject = {ime: '', index: ''};
                
                studentObject["ime"] = student.ime;
                studentObject["index"] = student.index;
                studentiNaPredmetu.push(studentObject);
                idStudenata.push(student.id);

            });
        })

        await db.student.findOne({
            where: {
                index: uneseniIndex
            }
        }).then(function(pronadjeniStudent) {
            trazeniStudent = pronadjeniStudent.id;
        });

        if(trazeniStudent) {
            returnObject["studenti"] = studentiNaPredmetu;

            var idPrisustvo = 0;

            await db.prisustvo.findOne({
                where: {
                    index: uneseniIndex,
                    sedmica: unesenaSedmica
                }
            }).then(function(pronadjenoPrisustvo) {
                idPrisustvo = pronadjenoPrisustvo.id;
            });
                
            if(idPrisustvo) {
                await db.prisustvo.update(
                    { predavanja: unesenoPredavanja, vjezbe: uneseneVjezbe },
                    { where: { id: idPrisustvo } }
                ); 
            }
            else {
                await db.prisustvo.create(
                    { sedmica: unesenaSedmica, predavanja: unesenoPredavanja, vjezbe: uneseneVjezbe, index: uneseniIndex},
                );
            }

            await db.prisustvo.findAll({
                where: {
                    studentId: {
                        [Op.or]:[idStudenata]
                    }
                }
            }).then(function(pronadjenaPrisustva) {

                pronadjenaPrisustva.forEach(prisustvo => {
                    var prisustvoObject = {sedmica: '', predavanja: '', vjezbe: '', index: ''};
                    prisustvoObject["sedmica"] = prisustvo.sedmica;
                    prisustvoObject["predavanja"] = prisustvo.predavanja;
                    prisustvoObject["vjezbe"] = prisustvo.vjezbe;
                    prisustvoObject["index"] = prisustvo.index;
                    prisustvaStudenta.push(prisustvoObject);
                });
            });

            returnObject["prisustva"] = prisustvaStudenta;
            
            res.status(200).json(returnObject);
        }
        else {
            res.status(404).json({ poruka: 'Traženi student ne postoji u bazi!' });
        }
    }
});


app.listen(port)