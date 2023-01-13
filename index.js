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

        var hashedPassword = req.body.password;
        bcrypt.hash(hashedPassword, 10, function(err, hash) {
            if(err) console.log(err);
            else if(hash) {
                hashedPassword = hash;
                return hashedPassword;
            }
        });

        for(let i = 0; i < uneseniNastavnici.length; i++) {
            var hashPass = uneseniNastavnici[i]["nastavnik"]["password_hash"];

            bcrypt.hash(hashPass, 10, function(err, hash) {
                if(err) console.log(err);
                else if(hash) {
                    hashPass = hash;
                    return hashPass;
                }
            });


            //console.log(hashPass + "     " + hashedPassword);

            if(uneseniNastavnici[i]["nastavnik"]["username"] == req.body.username && hashedPassword == hashPass) {
                postoji = 1;
                index = i;
            }
        }

        if(postoji){
            session = req.session;
            session.username = req.body.username;
            session.predmeti = uneseniNastavnici[index]["predmeti"];
            returnMessage["poruka"] = 'Uspješna prijava';

            //console.log(returnMessage);
            res.status(200).json(returnMessage);
        }
        else{
            session = null;
            returnMessage["poruka"] = 'Neuspješna prijava';
            //console.log(returnMessage);
            res.json(returnMessage);
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
    res.sendFile(__dirname + '/public/html/prijava.html');
});

app.post('/logout', function(req, res) {
    session.username = null;
    session.predmeti = null;
    res.json({ poruka: 'Log out pritisnut!' });
});

app.get('/predmet/:naziv', function(req, res) {

    fs.readFile('data/prisustva.json', 'utf8', function(err, data) {
        const unesenaPrisustva= JSON.parse(data);
        const uneseniPredmet = req.params.naziv;

        /*for(let i = 0; i < unesenaPrisustva.length; i++) {
            if(unesenaPrisustva[i]["predmet"] == uneseniPredmet)

        }*/
        
    });
});

app.post('/prisustvo/predmet/:naziv/student/:index', function(err, data) {

});

app.listen(port)