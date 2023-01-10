function submitClick() {
    let uneseniUsername = document.getElementById("username").value;
    let uneseniPassword = document.getElementById("password").value;
    
    PoziviAjax.postLogin(uneseniUsername, uneseniPassword, function(error, data) {
        if(uneseniUsername == null || uneseniPassword == null) console.log("Greška!");
        if(error) console.log('Greška: ' + error);
        if(data) console.log('OK');
    });
}