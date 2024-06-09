window.addEventListener("load",principal);

//Se crea la variable usuarioSesion como un array vacio 
let usuarioSesion = [];

function principal() {

    document.querySelector("#LogIn").addEventListener("click", inicioSesion);

}

//Dependiendo de si el usuario es administrador o no se le redirecciona a una interfaz u otra
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
    
    $.ajax({
        url: "../../assets/php/controladores/controladorSesion.php",
        type: "POST",
        data: parametros,
        success: function(data) {
            usuarioSesion = JSON.parse(data);
            if (usuarioSesion === false) {
                // console.log('NO OK');
            } else {
                // console.log('OK');
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



