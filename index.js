const express = require('express');
const bodyParser = require('body-parser');
const sessions = require('express-session');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');

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

app.get('/predmet', function(req, res) {
    res.sendFile(__dirname + '/public/html/predmet.html');
});

app.get('/prisustvo.html', function(req, res) {
    res.sendFile(__dirname + '/public/html/prisustvo.html');
});

app.get('/prisustvo', function(req, res) {
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
        for(let i = 0; i < uneseniNastavnici.length; i++) {
            if(uneseniNastavnici[i]["nastavnik"]["username"] == req.body.username && uneseniNastavnici[i]["nastavnik"]["password_hash"] == req.body.password) {
                postoji = 1;
                index = i;
            }
        }

        if(postoji){
            session = req.session;
            session.username = req.body.username;
            session.predmeti = uneseniNastavnici[index]["predmeti"];
            returnMessage["poruka"] = 'Uspješna prijava';

            //console.log(req.session)
            //res.json(returnMessage);
            res.send(returnMessage);
        }
        else{
            returnMessage["poruka"] = 'Neuspješna prijava';
            res.json(returnMessage);
        }
        
    });

});

app.post('/logout', function(req, res) {
   
});


app.listen(port)