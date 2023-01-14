function submitClick() {
    let uneseniUsername = document.getElementById("username").value;
    let uneseniPassword = document.getElementById("password").value;
    
    PoziviAjax.postLogin(uneseniUsername, uneseniPassword, function(error, data) {
        if(error) {
            /* Ako korisnik želi odmah pristupiti localhost:3000/predmeti */ 

            let poruka = document.getElementById("porukaUpozorenja")
            poruka.innerHTML=""
            poruka.appendChild(document.createTextNode('Unijeli ste pogrešan username ili password!'));
            poruka.setAttribute("class", "errorPoruka")
            document.body.appendChild(poruka);
        } 
        else {
            window.location.href = "/predmeti.html";
        }
    });
}