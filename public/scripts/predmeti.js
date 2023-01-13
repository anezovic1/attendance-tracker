window.onload = function() {
    PoziviAjax.getPredmeti(function(error, data) {
        if(error) console.log('Greška: ' + error);
        if(data) console.log('OK');
    });
    //pre
    //pravim
}

function logoutClick() {
    
    PoziviAjax.postLogout(function(error, data) {
        if(error) console.log('Greška: ' + error);  
        if(data) {
            console.log('OK');
            window.location.href = "/login";
        }
    });
}