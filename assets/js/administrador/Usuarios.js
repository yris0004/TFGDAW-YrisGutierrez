window.addEventListener("load",principal);

function principal() {

    document.querySelector('#btnAllUsuarios').addEventListener("click", tablaUsuarios)
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

//Imprime todos los usuarios exceptuando al usuario que ha iniciado sesión
function tablaUsuarios() {

    const contenedor = document.querySelector('#tabla-container');
    contenedor.innerHTML = "";

    //Se añade el titulo de la gestión
    const nombreGestion = document.querySelector('#nombreGestion');
    nombreGestion.innerHTML = "Gestión de usuarios";

    //Se borra el botón de nuevo usuario
    const encabezadoTablaBoton = document.querySelector('#botonAddGestion');
    encabezadoTablaBoton.innerHTML = ""; 

    const tabla = crearElemento("table",undefined,{id:"tablaUsuarios", class:"table table-striped responsive"});
    contenedor.appendChild(tabla);

    const userInicioSesion = localStorage.getItem('usuarioSesion');
    const idInicioSesion =JSON.parse(userInicioSesion).id_usuario;

    const parametros = {
        allUsuarios: JSON.stringify({
            'allUsuarios': true
        })
    };

    $.ajax({
        url: "../../assets/php/controladores/controladorUsuario/controladorUsuario.php",
        type: "POST",
        data: parametros,
        success: function(data) {
            if (data) {
                console.log('OK');

                const allUsuarios = JSON.parse(data);
                console.log(allUsuarios);
                const indice = allUsuarios.findIndex(usuario => usuario.id_usuario === idInicioSesion);
                console.log(indice);
                if(indice !== -1) {
                    allUsuarios.splice(indice,1);
                }
                console.log(allUsuarios);
                // Inicializar DataTables con los datos recibidos
                $('#tablaUsuarios').DataTable({
                    data: allUsuarios,
                    columns: [
                        { data: 'nombre_usuario', title: 'Nombre Usuario' },
                        { data:'nombre', title: 'Nombre'},
                        { data:'apellido', title: 'Apellidos'},
                        { data:'email', title: 'Email'},
                        { 
                            data:'activo', 
                            title: 'Activo',
                            render: function(data) {
                                if(data) {
                                    return '<span class="badge bg-success">Activo</span>';
                                }
                                else {
                                    return '<span class="badge bg-danger">Inactivo</span>'; 
                                }
                            }
                        },
                        { 
                            data:'admin', 
                            title: 'Admin',
                            render: function(data) {
                                if(data) {
                                    return '<span class="badge bg-success">Admin</span>';
                                }
                                else {
                                    return '<span class="badge bg-danger">No admin</span>'; 
                                }
                            }
                        },
                        { data:'telefono', title: 'Telefono'},
                        { data:'observaciones', title: 'Observaciones'},
                        { 
                            data: null,
                            title: 'Visualizar',
                            orderable: false,
                            render: function(row) {
                                return `
                                <div class="d-flex">
                                    <a class="nav-link btn-regsitro" id="btnRegistro_${row.id_usuario}"><i class="bi bi-eye-fill iconVisualizacion"></i>
                                    </a>
                                </div>`
                            }
                        }
                    ]
                });
                $('.dt-search input').attr('placeholder', 'Buscador');                
                $('#tablaUsuarios').on('click','.btn-regsitro', function() {
                    let idBtnUsuario = this.id;
                    let cadena = idBtnUsuario.split("_");
                    let idUsuario = parseInt(cadena[1]);
                    const datosUsuario = allUsuarios.find(usuario => usuario.id_usuario === idUsuario)
                    tablaPrestamosUsuario(datosUsuario);
                });
            } else {
                console.log('NO OK');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
        }
    });
}

//Muestra todos los prestamos del usuario seleccionado anteriormente junto con los datos personales que puede modificar el administrador
function tablaPrestamosUsuario(datosUsuario) {
    const contenedor = document.querySelector('#tabla-container');
    contenedor.innerHTML = "";

    let contenedorDerecha = crearElemento("div", undefined, {class: "d-flex justify-content-end formularioModificarUsuario"});
    const formulario = crearElemento("form", undefined, {id: "formularioUser"});
    contenedorDerecha.appendChild(formulario);

    let contenedorElemForm;
    let checkedPropiedad;

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const nombreUsuario = crearElemento("h2", datosUsuario.nombre_usuario, {id:"nombreUsuario"});
    contenedorElemForm.appendChild(nombreUsuario);
    formulario.appendChild(contenedorElemForm);

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelEmail = crearElemento("label", 'Email', {for: "inputEmailUsuario"});
    const inputEmail = crearElemento("input", undefined,{type: "text", id: "inputEmailUsuario", class: "form-control"});
    contenedorElemForm.appendChild(labelEmail);
    contenedorElemForm.appendChild(inputEmail);

    inputEmail.value = datosUsuario.email;

    formulario.appendChild(contenedorElemForm);

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelTelefono = crearElemento("label", 'Telefono', {for: "inputTelefonoUsuario"});
    const inpuTelefono = crearElemento("input", undefined, {type: "text", id: "inputTelefonoUsuario", class: "form-control"});
    contenedorElemForm.appendChild(labelTelefono);
    contenedorElemForm.appendChild(inpuTelefono);

    inpuTelefono.value = datosUsuario.telefono;

    formulario.appendChild(contenedorElemForm);

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelObservaciones = crearElemento("label", 'Observaciones', {for: "inputObservacionesUsuario"});
    const inputObservaciones = crearElemento("input", undefined, {type: "text", id: "inputObservacionesUsuario", class: "form-control"});
    contenedorElemForm.appendChild(labelObservaciones);
    contenedorElemForm.appendChild(inputObservaciones);

    inputObservaciones.value = datosUsuario.observaciones;

    formulario.appendChild(contenedorElemForm);

    checkedPropiedad = datosUsuario.admin ? 'checked' : '';
    contenedorElemForm = crearElemento("div", undefined, {class: "form-check form-switch mb-3"});
    const labelAministrador = crearElemento("label", 'Administrador', {class: "form-check-label", for: "inputCheckAdministrador"});
    const inputAdminsistrador = crearElemento("input", undefined, {class:"form-check-input", type:"checkbox", role:"switch", id: "inputCheckAdministrador"});
    contenedorElemForm.appendChild(labelAministrador);
    contenedorElemForm.appendChild(inputAdminsistrador);
    formulario.appendChild(contenedorElemForm);   
    inputAdminsistrador.checked = checkedPropiedad;

    checkedPropiedad = datosUsuario.activo ? 'checked' : '';
    contenedorElemForm = crearElemento("div", undefined, {class: "form-check form-switch mb-3"});
    const labelActivo = crearElemento("label", 'Activo', {class: "form-check-label", for: "inputCheckActivo"});
    const inputActivo = crearElemento("input", undefined, {class:"form-check-input", type:"checkbox", role:"switch", id: "inputCheckActivo"});
    contenedorElemForm.appendChild(labelActivo);
    contenedorElemForm.appendChild(inputActivo);
    formulario.appendChild(contenedorElemForm); 
    inputActivo.checked = checkedPropiedad;

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const btnGuardar = crearElemento("input", undefined, {class: "btn btn-primary botonCustom", value:"Guardar Todo", type:"button"});
    contenedorElemForm.appendChild(btnGuardar);
    formulario.appendChild(contenedorElemForm); 

    contenedor.appendChild(contenedorDerecha);

    const tabla = crearElemento("table",undefined,{id:"tablaPrestamos"});
    contenedor.appendChild(tabla);

    const parametros = {
        allPrestamos: JSON.stringify({
            'allPrestamos': datosUsuario.id_usuario
        })
    };
    // console.log(parametros);
    $.ajax({
        url: "../../assets/php/controladores/controladorPrestamo/controladorPrestamo.php",
        type: "POST",
        data: parametros,
        success: function(data) {
            if (data) {
                console.log('OK');
                const allPrestamos = JSON.parse(data);
                console.log(allPrestamos);
    
                // Inicializar DataTables con los datos recibidos
                $('#tablaPrestamos').DataTable({
                    data: allPrestamos,
                    columns: [
                        { data:'nombre_libro', title: 'Nombre Libro' },
                        { data:'portada', title: 'Portada'},
                        { data:'fecha_salida', title: 'Fecha salida'},
                        { data:'fecha_devolucion', title: 'Fecha limite'},
                        { 
                            data:'devuelto', 
                            title: 'Devuelto',
                            render: function(data, row) {
                                checkedPropiedad = data ? 'checked' : '';
                                return `
                                <div class="form-check form-switch mb-3">
                                    <input class="form-check-input" type="checkbox" role="switch" id="inputCheckDevuelto_${row.id}" ${checkedPropiedad}>
                                </div>`;
                            }
                        },
                        { data:'observaciones', title: 'Observaciones'},
                    ]
                });
                $('.dt-start').eq(0).addClass('encabezadoTabla');
                $('.dt-search input').attr('placeholder', 'Buscador');
            } else {
                console.log('NO OK');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
        }
    });
    
    btnGuardar.addEventListener("click", function () {
        updateUsuario(datosUsuario.id_usuario);
    })

}

//Ajax para actualizar al usuario
function updateUsuario(idUsuario) {
    
    const emailUsuario = document.querySelector("#inputEmailUsuario").value;
    const telefonoUsuario = document.querySelector("#inputTelefonoUsuario").value;
    const observacionesUsuario = document.querySelector("#inputObservacionesUsuario").value;
    const inputAdminsistrador = document.querySelector("#inputCheckAdministrador");
    const inputActivo = document.querySelector("#inputCheckActivo");

    const admin = inputAdminsistrador ? (inputAdminsistrador.checked ? 1 : 0) : undefined;
    const activo = inputActivo ? (inputActivo.checked ? 1 : 0) : undefined;

    const parametros = {
        updateUsuario: JSON.stringify({
            'id_usuario': idUsuario,
            'email': emailUsuario,
            'telefono': telefonoUsuario,
            'observaciones': observacionesUsuario,
            'admin': admin,
            'activo': activo
        })
    };
    console.log(parametros);
    $.ajax({
        url: "../../assets/php/controladores/controladorUsuario/controladorUsuario.php",
        type: "POST",
        data: parametros,
        success: function(data) {
            if (data) {
                console.log('OK');
                  
            } else {
                console.log('NO OK');
                console.log(data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
        }
    });
}

