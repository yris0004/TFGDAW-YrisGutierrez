window.addEventListener("load",principal);

function principal() {

    document.querySelector("#registroUsuario").addEventListener("click", registroUsuario);
}

function registroUsuario(e) {
    e.preventDefault();
    const nombreRegistro = document.querySelector("#nombreRegistro").value;
    const apellidoRegistro = document.querySelector("#apellidoRegistro").value;
    const nombreUsuarioRegistro = document.querySelector("#nombreUsuarioRegistro").value;
    const emailRegistro = document.querySelector("#emailRegistro").value;
    const passwordRegistro = document.querySelector("#passwordRegistro").value;
    const telefonoRegistro = document.querySelector("#telefonoRegistro").value;
    const comentarioRegistro = document.querySelector("#comentarioRegistro").value;

    const parametros = {
        newUsuario: JSON.stringify({
            'admin': 0,
            'nombre_usuario': nombreUsuarioRegistro,
            'nombre': nombreRegistro,
            'apellido': apellidoRegistro,
            'email': emailRegistro,
            'password': passwordRegistro,
            'activo': 1,
            'observaciones': comentarioRegistro,
            'telefono': telefonoRegistro
        })
    }; 
    console.log(parametros);
    $.ajax({
        type: "POST",
        url: "../../assets/php/controladorSesion.php",
        data: parametros,
        success: function (respuesta) {
            let usuarioCreado = JSON.parse(respuesta);
            if(usuarioCreado) {
                // console.log(usuarioCreado);
                window.location.href = '../html/sesion.html';
            }
            else {
                // console.log(usuarioCreado);
            }
        },
        error: function(a,b,errorMsg) {
            console.log(errorMsg);
        }
    });
}