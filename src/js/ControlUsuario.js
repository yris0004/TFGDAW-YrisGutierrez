window.addEventListener("load",principal);

let usuarioSesion = JSON.parse(localStorage.getItem('usuarioSesion')) || [];
function principal() {

        document.querySelector("#LogIn").addEventListener("click", inicioSesion);
    // if(document.querySelector("#cerrarSesion") !== null){
        // document.querySelector("#cerrarSesion").addEventListener("click", cerrarSesion);
    // }
}

function inicioSesion(e) {
    e.preventDefault();

    const nombreUsuario = document.getElementById('nombreUsuario').value;
    const password = document.getElementById('password').value;

    const parametros = {
    iniciarSesion: JSON.stringify({
        'nombre_usuario': nombreUsuario,
        'password': password
    })
    }; 

    console.log(parametros);
    
    $.ajax({
        url: "../../assets/php/controladorSesion.php",
        type: "POST",
        data: parametros,
        success: function(data) {
            usuarioSesion = JSON.parse(data);
            console.log(usuarioSesion);
            if (usuarioSesion === false) {
                console.log('NO OK');
            } else {
                console.log('OK');
                console.log(usuarioSesion.admin);
                if(usuarioSesion.admin === 1) {
                    localStorage.setItem('usuarioSesion', JSON.stringify(usuarioSesion));
                    window.location.href = '../html/InicioAdmin.html';
                } 
                else {
                    localStorage.setItem('usuarioSesion', JSON.stringify(usuarioSesion));
                    window.location.href = '../html/InicioUsuario.html';
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
        }
    });
}





