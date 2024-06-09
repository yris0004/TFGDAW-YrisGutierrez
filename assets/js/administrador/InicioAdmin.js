const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

window.addEventListener("load",principal);

function principal() {

    document.querySelector('#btnAllUsuarios').addEventListener("click", tablaUsuarios)
    document.querySelector("#cerrarSesion").addEventListener("click", cerrarSesion);
    document.querySelector("#perfil").addEventListener("click", perfilAdmin);
}

function cerrarSesion() {

    const parametros = { 
        cerrarSesion: JSON.stringify({
        'cerrarSesion': true
    })
    }

    // console.log(parametros);
    $.ajax({
        url: "../../assets/php/controladores/controladorSesion.php",
        type: "POST",
        data: parametros,
        success: function(data) {
            console.log(data);
            if (data) {
                console.log('OK', data);
                localStorage.setItem('usuarioSesion', JSON.stringify([]));
                window.location.href = '../html/sesion.html';
            } else {
                console.log('NO OK');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
        }
    });
}

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