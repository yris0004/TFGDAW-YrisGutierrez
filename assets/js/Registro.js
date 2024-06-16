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

    //Se activa la cuenta por defecto una vez creada 
    const parametros = {
        newUsuario: JSON.stringify({
            'admin': 0,
            'nombre_usuario': nombreUsuarioRegistro,
            'nombre': nombreRegistro,
            'apellido': apellidoRegistro,
            'email': emailRegistro,
            'password': passwordRegistro,
            'activo': 1,
            'telefono': telefonoRegistro
        })
    }; 

    $.ajax({
        type: "POST",
        url: "../../assets/php/controladores/controladorUsuario/controladorUsuario.php",
        data: parametros,
        success: function (respuesta) {
            let usuarioCreado = JSON.parse(respuesta);
            console.log(respuesta);
            console.log(usuarioCreado);
            if(usuarioCreado) {
                //Si el usuario se crea con exito se redirecciona a la página de inicio sesión
                window.location.href = '../../src/html/sesion.html';
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