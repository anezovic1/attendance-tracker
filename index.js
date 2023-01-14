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
        var index = 0;


        var password = req.body.password;
       /* bcrypt.hash(password, 10, function(err, hash) {
            if(err) console.log(err);
            else if(hash) {
                password = hash;
                return password;
            }
        });*/

        for(let i = 0; i < uneseniNastavnici.length; i++) {
            /* Kako je password u nastavnici.json vec hashiran, ne trebam ga hashirati. */

            var hashPass = uneseniNastavnici[i]["nastavnik"]["password_hash"];

            console.log("Iz nastavnici "+hashPass+" i uneseni hashirani "+password)

            if(uneseniNastavnici[i]["nastavnik"]["username"] == req.body.username) {
                console.log("da, usao");
                bcrypt.compare(password, hashPass, (err, check) => {
                    
                    if (check) {
                        session = req.session;
                        session.username = req.body.username;
                        session.predmeti = uneseniNastavnici[i]["predmeti"];
                        returnMessage["poruka"] = 'Uspješna prijava';

                        console.log(session.predmeti + " " + session.username);
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

app.get('/predmeti.html', function(req, res) {

    if(session != null) {
        res.sendFile(__dirname + '/public/html/predmeti.html');
        //res.send(session.predmeti);
    }
    else {
        res.json({ greska: 'Nastavnik nije loginovan' });
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

app.post('/logout', function(req, res) {
    session.username = null;
    session.predmeti = null;
    //session destroy
    console.log('unisten');
    res.json({ poruka: 'Log out pritisnut!' });
});

app.get('/predmet/:naziv', function(req, res) {

    fs.readFile('data/prisustva.json', 'utf8', function(err, data) {
        const unesenaPrisustva= JSON.parse(data);
        const uneseniPredmet = req.params.naziv;

        for(let i = 0; i < unesenaPrisustva.length; i++) {
            if(unesenaPrisustva[i]["predmet"] == uneseniPredmet) {
                res.status(200).json(unesenaPrisustva[i]);
            }

        }
        
    });
});

app.post('/prisustvo/predmet/:naziv/student/:index', function(err, data) {

});

//1. 1234

app.listen(port)