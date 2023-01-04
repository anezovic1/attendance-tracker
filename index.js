const express = require('express');
const app = express();
const path = require('path');
var port = 3000;

app.use(express.static("public"));

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
app.listen(port)