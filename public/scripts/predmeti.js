window.onload = function() {
    
}

function getPredmeti() {
    PoziviAjax.getPredmeti(function(error, data) {
        if(error) console.log('Greška: ' + error);
        if(data) console.log('OK');
    });
}