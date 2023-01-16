const express = require('express');
const bodyParser = require('body-parser');
const sessions = require('express-session');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');
//const { nextTick } = require('process');

var port = 3000;

const app = express();

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

    fs.readFile('data/nastavnici.json', 'utf8', function(err, data) {
        if (err) console.error(err);
        const uneseniNastavnici = JSON.parse(data);
        var postoji = 0;

        var password = req.body.password;
       
        for(let i = 0; i < uneseniNastavnici.length; i++) {
            /* Kako je password u nastavnici.json vec hashiran, ne trebam ga hashirati. */

            var hashPass = uneseniNastavnici[i]["nastavnik"]["password_hash"];

            //console.log("Iz nastavnici " + hashPass + " i uneseni hashirani " + password)

            if(uneseniNastavnici[i]["nastavnik"]["username"] == req.body.username) {
                bcrypt.compare(password, hashPass, function(err, check) {
                    
                    if (check) {
                        session = req.session;
                        session.username = req.body.username;
                        session.predmeti = uneseniNastavnici[i]["predmeti"];
                        returnMessage["poruka"] = 'Uspješna prijava';
                        res.status(200).json(returnMessage);
                    } 
                    else {
                        session = null;
                        returnMessage["poruka"] = 'Neuspješna prijava';
                        //console.log(returnMessage);
                        res.status(404).json(returnMessage);
                    }
                });  
            }
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

app.get('/predmet/:naziv', function(req, res) {

    if(session != null && session.username) {
        fs.readFile('data/prisustva.json', 'utf8', function(err, data) {
            const unesenaPrisustva= JSON.parse(data);
            const uneseniPredmet = req.params.naziv;
    
            for(let i = 0; i < unesenaPrisustva.length; i++) {
                if(unesenaPrisustva[i]["predmet"] == uneseniPredmet) {
                    res.status(200).json(unesenaPrisustva[i]);
                }
            }
        });
    }
    else {
        res.status(404).json({ greska: 'Nastavnik nije loginovan' });
    }
});

app.post('/prisustvo/predmet/:naziv/student/:index', function(req, res) {
    const uneseniPredmet = req.params.naziv;
    const uneseniIndex = req.params.index;
    //console.log(req.body)
    let sedmica = req.body["sedmica"];
    let predavanja = req.body["predavanja"];
    let vjezbe = req.body["vjezbe"];
 
    let fileData = fs.readFileSync('data/prisustva.json', 'utf8')
    const jsonData = JSON.parse(fileData)

    //console.log(fileData);
    //console.log(jsonData); 

    var dodan = 0;
    for(let i = 0; i < jsonData.length; i++) {
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
    });
});


app.listen(port)