//Código de Bootstrap 
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

window.addEventListener("load",principal);

function principal() {

    document.querySelector("#cerrarSesion").addEventListener("click", cerrarSesion);
    document.querySelector("#perfil").addEventListener("click", perfilAdmin);
}

function crearElemento(etiqueta, contenido, atributos) {
    let elementoNuevo = document.createElement(etiqueta);
    if (contenido !== undefined) {
        let contenidoNuevo = document.createTextNode(contenido);
        elementoNuevo.appendChild(contenidoNuevo);
    }
    if (atributos !== undefined) {
        for (let clave in atributos) {
            elementoNuevo.setAttribute(clave, atributos[clave]);
        }
    }
    return elementoNuevo;
}

function cerrarSesion() {

    const parametros = { 
        cerrarSesion: JSON.stringify({
        'cerrarSesion': true
    })
    }
    $.ajax({
        url: "../../assets/php/controladores/controladorSesion.php",
        type: "POST",
        data: parametros,
        success: function(data) {
            console.log(data);
            if (data) {
                // console.log('OK', data);
                //Se vacia el localstorage de la sesión iniciada
                localStorage.setItem('usuarioSesion', JSON.stringify([]));
                window.location.href = '../html/sesion.html';
            } else {
                // console.log('NO OK');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
        }
    });
}

//Imprime los datos del perfil del administrador en una carta
function perfilAdmin() {

    const contenedor = document.querySelector('#tabla-container');
    contenedor.innerHTML = "";

    const userInicioSesion = localStorage.getItem('usuarioSesion');
    const datosInicioSesion =JSON.parse(userInicioSesion);

    const carta = crearElemento("div", undefined, {class: "card"});
    const cartaTitulo = crearElemento("div", undefined, {class: "card-title"});
    const cartaBody = crearElemento("div", undefined, {class: "card-body"});
    let contenedorRow;
    let contenedorCol;

    cartaBody.appendChild(cartaTitulo);
    
    contenedorRow = crearElemento("div", undefined, {class: "row"});

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelNombreUsuario = crearElemento("h6", 'Nombre usuario');
    const nombreUsuario = crearElemento("p", datosInicioSesion.nombre_usuario, {id: "nombreUsuarioSesion"});
    contenedorElemForm.appendChild(labelNombreUsuario);
    contenedorElemForm.appendChild(nombreUsuario);
    cartaBody.appendChild(contenedorElemForm);

    contenedorCol = crearElemento("div", undefined, {class: "col-6 mb-3"});
    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelNombre = crearElemento("h6", 'Nombre');
    const nombre = crearElemento("p", datosInicioSesion.nombre, {id: "nombreOriginalSesion"});
    contenedorCol.appendChild(labelNombre);
    contenedorCol.appendChild(nombre);
    contenedorRow.appendChild(contenedorCol);

    contenedorCol = crearElemento("div", undefined, {class: "col-6 mb-3"});
    const labelApellidos = crearElemento("h6", 'Apellidos');
    const apellidos = crearElemento("p", datosInicioSesion.apellido, {id: "apellidosUsuarioSesion"});
    contenedorCol.appendChild(labelApellidos);
    contenedorCol.appendChild(apellidos);
    contenedorRow.appendChild(contenedorCol);

    cartaBody.appendChild(contenedorRow);

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelEmail = crearElemento("h6", 'Email');
    const email = crearElemento("p", datosInicioSesion.email, {id: "emailUsuarioSesion"});
    contenedorElemForm.appendChild(labelEmail);
    contenedorElemForm.appendChild(email);
    cartaBody.appendChild(contenedorElemForm);

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelTelefono = crearElemento("h6", 'Telefono');
    const telefono = crearElemento("p", datosInicioSesion.telefono, {id: "telefonoUsuarioSesion"});
    contenedorElemForm.appendChild(labelTelefono);
    contenedorElemForm.appendChild(telefono);
    cartaBody.appendChild(contenedorElemForm);

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelObservaciones = crearElemento("h6", 'Observaciones');
    const observaciones = crearElemento("p", datosInicioSesion.observaciones, {id: "observacionesUsuarioSesion"});
    contenedorElemForm.appendChild(labelObservaciones);
    contenedorElemForm.appendChild(observaciones);
    cartaBody.appendChild(contenedorElemForm);

    const contenedorBtn = crearElemento("div", undefined, {class: "mb-3"});
    const btnActualizar = crearElemento("input", undefined, {type: "button", value: "Actualizar", id: "btnUpdate", class: "btn btn-primary botonCustom"});
    contenedorBtn.appendChild(btnActualizar);
    cartaBody.appendChild(contenedorBtn);   

    carta.appendChild(cartaBody);
    contenedor.appendChild(carta);
    
    btnActualizar.addEventListener("click", formUsuario);
}

//Aparecen los datos del administrador en un formulario para poder modificarlo
function formUsuario() {

    const userInicioSesion = localStorage.getItem('usuarioSesion');
    const datosInicioSesion =JSON.parse(userInicioSesion);

    const contenedor = document.querySelector('#tabla-container');
    contenedor.innerHTML = "";
    
    const formulario = crearElemento("form", undefined, {id: "formUsuario"});
    let contenedorElemForm;
    
    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelNombreUsuario = crearElemento("h6", 'Nombre usuario', {for: "nombreUsuarioSesion"});
    const inputNombreUsuario = crearElemento("input", undefined, {type: "text", id: "nombreUsuarioSesion"});
    contenedorElemForm.appendChild(labelNombreUsuario);
    contenedorElemForm.appendChild(inputNombreUsuario);
    formulario.appendChild(contenedorElemForm);
    inputNombreUsuario.value = datosInicioSesion.nombre_usuario;

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelNombre = crearElemento("h6", 'Nombre', {for:"nombreOriginalSesion"});
    const inputNombre = crearElemento("input", undefined, {type: "text", id: "nombreOriginalSesion"});
    contenedorElemForm.appendChild(labelNombre);
    contenedorElemForm.appendChild(inputNombre);
    formulario.appendChild(contenedorElemForm);
    inputNombre.value = datosInicioSesion.nombre;


    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelApellidos = crearElemento("h6", 'Apellidos', {for: "apellidosUsuarioSesion"});
    const inputApellidos = crearElemento("input", undefined, {type: "text", id: "apellidosUsuarioSesion"});
    contenedorElemForm.appendChild(labelApellidos);
    contenedorElemForm.appendChild(inputApellidos);
    formulario.appendChild(contenedorElemForm);
    inputApellidos.value = datosInicioSesion.apellido;

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelEmail = crearElemento("h6", 'Email', {for: "emailUsuarioSesion"});
    const inputEmail = crearElemento("input", undefined, {type: "text", id: "emailUsuarioSesion"});
    contenedorElemForm.appendChild(labelEmail);
    contenedorElemForm.appendChild(inputEmail);
    formulario.appendChild(contenedorElemForm);
    inputEmail.value = datosInicioSesion.email;

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelTelefono = crearElemento("h6", 'Telefono', {for: "telefonoUsuarioSesion"});
    const inputTelefono = crearElemento("input", undefined, {type:"text", id: "telefonoUsuarioSesion"});
    contenedorElemForm.appendChild(labelTelefono);
    contenedorElemForm.appendChild(inputTelefono);
    formulario.appendChild(contenedorElemForm);
    inputTelefono.value = datosInicioSesion.telefono;

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelObservaciones = crearElemento("h6", 'Observaciones', {for: "observacionesUsuarioSesion"});
    const inputObservaciones = crearElemento("input", undefined, {type:"text", id: "observacionesUsuarioSesion"});
    contenedorElemForm.appendChild(labelObservaciones);
    contenedorElemForm.appendChild(inputObservaciones);
    formulario.appendChild(contenedorElemForm);
    inputObservaciones.value = datosInicioSesion.observaciones;

    const contenedorBtn = crearElemento("div", undefined, {class: "mb-3"});
    const btnActualizar = crearElemento("input", undefined, {type: "button", value: "Guardar Cambios", id: "btnUpdate", class: "btn btn-primary botonCustom"});
    contenedorBtn.appendChild(btnActualizar);
    formulario.appendChild(contenedorBtn);

    contenedor.appendChild(formulario);
    btnActualizar.addEventListener("click", function () {
        updateAdministrador(datosInicioSesion.id_usuario)
    });
}

//Ajax para enviar la actualización de los datos al servidor
function updateAdministrador(idUsuario) {

    const nombreUsuario = document.querySelector('#nombreUsuarioSesion').value;
    const nombre = document.querySelector('#nombreOriginalSesion').value;
    const apellido = document.querySelector('#apellidosUsuarioSesion').value;
    const email = document.querySelector('#emailUsuarioSesion').value;
    const telefono = document.querySelector('#telefonoUsuarioSesion').value;
    const observaciones = document.querySelector('#observacionesUsuarioSesion').value;

    const parametros = {
        updateUsuario: JSON.stringify({
            "id_usuario": idUsuario,
            "nombre_usuario": nombreUsuario,
            "nombre": nombre,
            "apellido": apellido,
            "email": email,
            "telefono": telefono,
            "observaciones": observaciones
        })
    }
    console.log(parametros)
    $.ajax({
        type:"POST",
        url: "../../assets/php/controladores/controladorUsuario/controladorUsuario.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                console.log(respuesta);
                actualizarPaginaPerfil(idUsuario)
            }
            else {
                console.log(respuesta);
            }
        },
        error: function(a,b,errorMsg) {
            console.log(errorMsg);
        }
    })

}

//Se recarga la página con los nuevos datos del usuario
function actualizarPaginaPerfil(idUsuario) {

    const parametros = {
        actualizarPaginaPerfil: JSON.stringify({
            "id_usuario": idUsuario,
        })
    }
    console.log(parametros)
    $.ajax({
        type:"POST",
        url: "../../assets/php/controladores/controladorUsuario/controladorUsuario.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                // console.log(respuesta);
                //Actualizar el localstorage con los nuevos datos
                const usuarioSesion = JSON.parse(respuesta);
                localStorage.removeItem('usuarioSesion');
                localStorage.setItem('usuarioSesion', JSON.stringify(usuarioSesion));
                perfilAdmin();
            }
            else {
                console.log(respuesta);
            }
        },
        error: function(a,b,errorMsg) {
            console.log(errorMsg);
        }
    })

}