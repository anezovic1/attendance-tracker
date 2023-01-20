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

/*
db.sequelize.sync({force: true}).then((res) => {
    console.log('Tabele kreirane');
}).catch((err) => {
    console.log(err);
});
*/


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

app.post('/prisustvo/predmet/:naziv/student/:index', function(req, res) {
    const uneseniPredmet = req.params.naziv;
    const uneseniIndex = req.params.index;

    let unesenaSedmica = req.body["sedmica"];
    let unesenoPredavanja = req.body["predavanja"];
    let uneseneVjezbe = req.body["vjezbe"];
    var dodan = 0;

    let fileData = fs.readFileSync('data/prisustva.json', 'utf8')
    const jsonData = JSON.parse(fileData)

    
    //console.log("jsondata" + jsonData[0]['studenti']); [object Object],[object Object]

    /*db.predmet.findOne({
        where: {
            naziv: uneseniPredmet
        }
    }).then(function(pronadjeniPredmet) {
        console.log('pronasao predmet:' + pronadjeniPredmet.naziv)

        if(pronadjeniPredmet) {
            db.student.findAll({
                where: {
                    predmetId: pronadjeniPredmet.id,
                    index: uneseniIndex
                }
            }).then(function(pronadjeniStudent) {
                console.log('pronasao studenta:' + pronadjeniStudent.ime)

                db.prisustvo.findOne({
                    where: {
                        studentId: pronadjeniStudent.id,
                        sedmica: unesenaSedmica
                    }
                }).then(function(pronadjenoPrisustvo) {
                    console.log('pronasao prisustvo:' + pronadjenoPrisustvo.studentId)

                    db.prisustvo.update(
                        { predavanja: unesenoPredavanja, vjezbe: uneseneVjezbe },
                        { where: { id: pronadjenoPrisustvo.id } }
                    );
                });

                
                //ovdje dodajem prisustvo za tog studenta, dodajem element u tabelu prisustvo

                db.student.create(
                    { ime: 'Novi', index: '4242' },
                );

            });

           //if(dodan == 0) {
             //   var novi = {"sedmica": sedmica, "predavanja": predavanja, "vjezbe": vjezbe, "index": parseInt(uneseniIndex)};
             //   jsonData[i]["prisustva"].push(novi);
           // }
        }
    });
    */






   
    /*for(let i = 0; i < jsonData.length; i++) {
        if(jsonData[i]["predmet"] == uneseniPredmet) {
            for(let j = 0; j < jsonData[i]["prisustva"].length; j++) {
                if(jsonData[i]["prisustva"][j]["index"] == uneseniIndex && jsonData[i]["prisustva"][j]["sedmica"] == sedmica) {
                    jsonData[i]["prisustva"][j]["predavanja"] = predavanja;
                    jsonData[i]["prisustva"][j]["vjezbe"] = vjezbe;
                    dodan = 1;
                }
            }

            if(dodan == 0) {
                var novi = {"sedmica": sedmica, "predavanja": predavanja, "vjezbe": vjezbe, "index": parseInt(uneseniIndex)};
                jsonData[i]["prisustva"].push(novi);
            }
        }
    }

    fs.writeFile('data/prisustva.json', JSON.stringify(jsonData), function (err) {
        if (err) {
            return console.error(err);
        }
        res.status(200).json(jsonData);
    });*/

});


app.listen(port)