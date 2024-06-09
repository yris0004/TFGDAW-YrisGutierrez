window.addEventListener("load",principal);

function principal() {
   document.querySelector('#iconLibroAdmin').addEventListener("click", tablaLibros);
   document.querySelector('#iconAutorAdmin').addEventListener("click", tablaAutores);
   document.querySelector('#iconLibroEditorial').addEventListener("click", tablaEditoriales);
   document.querySelector('#iconLibroGeneros').addEventListener("click", tablaGeneros);
   document.querySelector('#iconLibroEjemplares').addEventListener("click", tablaEjemplares);

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

function tablaLibros() {
    const contenedor = document.querySelector('#tabla-container');
    contenedor.innerHTML = "";

    const tabla = crearElemento("table",undefined,{id:"tablaLibros"});
    contenedor.appendChild(tabla);

    const parametrosLibros = {
        allLibros: JSON.stringify({
            'allLibros': true
        })
    };

    $.ajax({
        url: "../../assets/php/controladorSesion.php",
        type: "POST",
        data: parametrosLibros,
        success: function(data) {
            if (data) {
                console.log('OK');
                const allLibros = JSON.parse(data);
                console.log(allLibros);

                // Inicializar DataTables con los datos recibidos
                $('#tablaLibros').DataTable({
                    data: allLibros,
                    columns: [
                        { data: 'nombre_libro', title: 'Título' },
                        { 
                            data: null,
                            title: 'Autor',
                            render: function(data) {
                                return data.nombre_autor + " " + data.apellidos_autor
                            }
                        },
                        { data: 'nombres_generos', title: 'Generos' },
                        { data: 'pais_autor', title: 'País' },
                        { data: 'sinopsis', title: 'Sinopsis', orderable: false},
                        { data:'observaciones', title: 'Observaciones', orderable: false},
                        {   
                            data: null,
                            title: 'Acciones',
                            orderable: false,
                            render: function(row) {
                                return `
                                <div class="d-flex">
                                    <a class="nav-link btn-remove" id="btnRemove_${row.id_libro}"><i class="bi bi-trash iconCustomTrash"></i></a>
                                    <a class="nav-link btn-edit" id="btnEdit_${row.id_libro}" type="button" data-bs-toggle="modal" data-bs-target="#modalFormulario"><i class="bi bi-pencil-square iconCustomUpdate"></i></a>
                                </div>`
                            }
                        }
                    ]
                });
                $('.dt-start').eq(0).addClass('encabezadoTabla');
                $('.dt-search input').attr('placeholder', 'Buscador');
                $('#tablaLibros').on('click','.btn-edit', function() {
                    let idBtnLibros = this.id;
                    let cadena = idBtnLibros.split("_");
                    let idLibro = parseInt(cadena[1]);
                    const datosLibro = allLibros.find(libro => libro.id_libro === idLibro)
                    // console.log(allLibros);
                    // console.log(datosLibro);
                    formLibro(datosLibro);
                });
                $('#tablaLibros').on('click','.btn-remove', function() {
                    let idBtnEditorial = this.id;
                    let cadena = idBtnEditorial.split("_");
                    let idEditorial = parseInt(cadena[1]);
                    swal({
                        title:"¿Estás seguro de eliminar?",
                        text: "Esta acción eliminará permanentemente los registros asociados. ¿Estás seguro de continuar?",
                        icon: "warning",
                        buttons: {
                            cancel: "Cancelar",
                            confirm: "Confirmar"
                        },
                        dangerMode: true,
                      })
                      .then((willDelete) => {
                        if (willDelete) {
                          swal("Se ha borrado correctamente", {
                            icon: "success",
                          });
                          deleteLibro(idEditorial);
                        } else {
                          swal("Operación cancelada");
                        }
                      });
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

function tablaAutores() {
    const contenedor = document.querySelector('#tabla-container');
    contenedor.innerHTML = "";

    const tabla = crearElemento("table",undefined,{id:"tablaLibros"});
    contenedor.appendChild(tabla);

    const parametrosLibros = {
        allAutores: JSON.stringify({
            'allAutores': true
        })
    };

    $.ajax({
        url: "../../assets/php/controladorSesion.php",
        type: "POST",
        data: parametrosLibros,
        success: function(data) {
            if (data) {
                console.log('OK');
                const allAutores = JSON.parse(data);
                console.log(allAutores);

                // Inicializar DataTables con los datos recibidos
                $('#tablaLibros').DataTable({
                    data: allAutores,
                    columns: [
                        { data: 'nombre_autor', title: 'Nombre' },
                        { data: 'apellidos_autor', title: 'Apellidos'},
                        { data: 'pais_autor', title: 'Pais de origen'},
                        { data:'observaciones', title: 'Observaciones', orderable: false},
                        { 
                            data: null,
                            title: 'Acciones',
                            orderable: false,
                            render: function(row) {
                                return `
                                <div class="d-flex">
                                    <a class="nav-link btn-remove" id="btnRemove_${row.id_autor}"><i class="bi bi-trash iconCustomTrash"></i></a>
                                    <a class="nav-link btn-edit" id="btnEdit_${row.id_autor}" type="button" data-bs-toggle="modal" data-bs-target="#modalFormulario"><i class="bi bi-pencil-square iconCustomUpdate"></i></a>
                                </div>`
                            }
                        }
                    ]
                });
                $('.dt-start').eq(0).addClass('encabezadoTabla');
                $('.dt-search input').attr('placeholder', 'Buscador');                
                $('#tablaLibros').on('click','.btn-edit', function() {
                    let idBtnAutor = this.id;
                    let cadena = idBtnAutor.split("_");
                    let idAutor = parseInt(cadena[1]);
                    const datosAutor = allAutores.find(autor => autor.id_autor === idAutor)
                    // console.log(datosAutor);
                    formAutor(datosAutor);
                });
                $('#tablaLibros').on('click','.btn-remove', function() {
                    let idBtnEditorial = this.id;
                    let cadena = idBtnEditorial.split("_");
                    let idEditorial = parseInt(cadena[1]);
                    swal({
                        title:"¿Estás seguro de eliminar?",
                        text: "Esta acción eliminará permanentemente los registros asociados. ¿Estás seguro de continuar?",
                        icon: "warning",
                        buttons: {
                            cancel: "Cancelar",
                            confirm: "Confirmar"
                        },
                        dangerMode: true,
                      })
                      .then((willDelete) => {
                        if (willDelete) {
                          swal("Se ha borrado correctamente", {
                            icon: "success",
                          });
                          deleteAutor(idEditorial);
                        } else {
                          swal("Operación cancelada");
                        }
                      });
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
 
function tablaEditoriales() {
    const contenedor = document.querySelector('#tabla-container');
    contenedor.innerHTML = "";

    const tabla = crearElemento("table",undefined,{id:"tablaLibros"});
    contenedor.appendChild(tabla);

    const parametrosLibros = {
        allEditoriales: JSON.stringify({
            'allEditoriales': true
        })
    };

    $.ajax({
        url: "../../assets/php/controladorSesion.php",
        type: "POST",
        data: parametrosLibros,
        success: function(data) {
            if (data) {
                console.log('OK');
                const allEditoriales = JSON.parse(data);
                console.log(allEditoriales);

                // Inicializar DataTables con los datos recibidos
                $('#tablaLibros').DataTable({
                    data: allEditoriales,
                    columns: [
                        { data: 'nombre_editorial', title: 'Nombre' },
                        { data:'observaciones', title: 'Observaciones', orderable: false},
                        { 
                            data: null,
                            title: 'Acciones',
                            orderable: false,
                            render: function(row) {
                                return `
                                <div class="d-flex">
                                    <a class="nav-link btn-remove" id="btnRemove_${row.id_editorial}"><i class="bi bi-trash iconCustomTrash"></i></a>
                                    <a class="nav-link btn-edit" id="btnEdit_${row.id_editorial}" type="button" data-bs-toggle="modal" data-bs-target="#modalFormulario"><i class="bi bi-pencil-square iconCustomUpdate"></i></a>
                                </div>`
                            }
                        }
                    ]
                });
                $('.dt-start').eq(0).addClass('encabezadoTabla');
                $('.dt-search input').attr('placeholder', 'Buscador');                
                $('#tablaLibros').on('click','.btn-edit', function() {
                    let idBtnEditorial = this.id;
                    let cadena = idBtnEditorial.split("_");
                    let idEditorial = parseInt(cadena[1]);
                    const datosEditorial = allEditoriales.find(editorial => editorial.id_editorial === idEditorial)
                    console.log(datosEditorial);
                    formEditorial(datosEditorial);
                });
                $('#tablaLibros').on('click','.btn-remove', function() {
                    let idBtnEditorial = this.id;
                    let cadena = idBtnEditorial.split("_");
                    let idEditorial = parseInt(cadena[1]);
                    swal({
                        title:"¿Estás seguro de eliminar?",
                        text: "Esta acción eliminará permanentemente los registros asociados. ¿Estás seguro de continuar?",
                        icon: "warning",
                        buttons: {
                            cancel: "Cancelar",
                            confirm: "Confirmar"
                        },
                        dangerMode: true,
                      })
                      .then((willDelete) => {
                        if (willDelete) {
                          swal("Se ha borrado correctamente", {
                            icon: "success",
                          });
                          deleteEditorial(idEditorial);
                        } else {
                          swal("Operación cancelada");
                        }
                      });
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

function tablaGeneros() {
    const contenedor = document.querySelector('#tabla-container');
    contenedor.innerHTML = "";

    const tabla = crearElemento("table",undefined,{id:"tablaLibros"});
    contenedor.appendChild(tabla);

    const parametrosLibros = {
        allGeneros: JSON.stringify({
            'allGeneros': true
        })
    };

    $.ajax({
        url: "../../assets/php/controladorSesion.php",
        type: "POST",
        data: parametrosLibros,
        success: function(data) {
            if (data) {
                console.log('OK');
                const allGeneros = JSON.parse(data);
                // console.log(allGeneros);

                // Inicializar DataTables con los datos recibidos
                $('#tablaLibros').DataTable({
                    data: allGeneros,
                    columns: [
                        { data: 'nombre_genero', title: 'Nombre' },
                        { data:'observaciones', title: 'Observaciones', orderable: false},
                        { 
                            data: null,
                            title: 'Acciones',
                            orderable: false,
                            render: function(row) {
                                return `
                                <div class="d-flex">
                                    <a class="nav-link btn-remove" id="btnRemove_${row.id_genero}"><i class="bi bi-trash iconCustomTrash"></i></a>
                                    <a class="nav-link btn-edit" id="btnEdit_${row.id_genero}" type="button" data-bs-toggle="modal" data-bs-target="#modalFormulario"><i class="bi bi-pencil-square iconCustomUpdate"></i></a>
                                </div>`
                            }
                        }
                    ]
                });
                $('.dt-start').eq(0).addClass('encabezadoTabla');
                $('.dt-search input').attr('placeholder', 'Buscador');
                $('#tablaLibros').on('click','.btn-edit', function() {
                    let idBtnGenero = this.id;
                    let cadena = idBtnGenero.split("_");
                    let idGenero = parseInt(cadena[1]);
                    const datosGenero = allGeneros.find(genero => genero.id_genero === idGenero)
                    // console.log(datosGenero);
                    formGenero(datosGenero);
                });
                $('#tablaLibros').on('click','.btn-remove', function() {
                    let idBtnEditorial = this.id;
                    let cadena = idBtnEditorial.split("_");
                    let idEditorial = parseInt(cadena[1]);
                    swal({
                        title:"¿Estás seguro de eliminar?",
                        text: "Esta acción eliminará permanentemente los registros asociados. ¿Estás seguro de continuar?",
                        icon: "warning",
                        buttons: {
                            cancel: "Cancelar",
                            confirm: "Confirmar"
                        },
                        dangerMode: true,
                      })
                      .then((willDelete) => {
                        if (willDelete) {
                          swal("Se ha borrado correctamente", {
                            icon: "success",
                          });
                          deleteGenero(idEditorial);
                        } else {
                          swal("Operación cancelada");
                        }
                      });
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

function tablaEjemplares() {
    const contenedor = document.querySelector('#tabla-container');
    contenedor.innerHTML = "";

    const tabla = crearElemento("table",undefined,{id:"tablaLibros"});
    contenedor.appendChild(tabla);

    const parametrosLibros = {
        allEjemplares: JSON.stringify({
            'allEjemplares': true
        })
    };

    $.ajax({
        url: "../../assets/php/controladorSesion.php",
        type: "POST",
        data: parametrosLibros,
        success: function(data) {
            if (data) {
                console.log('OK');
                const allEjemplares = JSON.parse(data);
                console.log(allEjemplares);

                // Inicializar DataTables con los datos recibidos
                $('#tablaLibros').DataTable({
                    data: allEjemplares,
                    columns: [
                        { data: 'nombre_libro', title: 'Titulo' },
                        { 
                            data: 'portada', 
                            title: 'Portada', 
                            orderable: false,
                            render: function(data, row) {
                                return `<img src="../../assets/imagenes/${data}"
                                alt="${row.nombre_libro}>" style="width:100px; height:auto;">`
                            }
                        },
                        { data: 'nombre_editorial', title: 'Editorial' },
                        { data: 'num_paginas', title: 'Numero paginas' },
                        { data: 'stock', title: 'Stock' },

                        { data:'observaciones', title: 'Observaciones', orderable: false},
                        { 
                            data: null,
                            title: 'Acciones',
                            orderable: false,
                            render: function(row) {
                                return `
                                <div class="d-flex">
                                    <a class="nav-link btn-remove" id="btnRemove_${row.id_ejemplar}"><i class="bi bi-trash iconCustomTrash"></i></a>
                                    <a class="nav-link btn-edit" id="btnEdit_${row.id_ejemplar}" type="button" data-bs-toggle="modal" data-bs-target="#modalFormulario"><i class="bi bi-pencil-square iconCustomUpdate"></i></a>
                                    <a class="nav-link btn-noDisponible" id="noDisponible_${row.id_ejemplar}"><i class="bi bi-0-circle iconCustomTrash"></i>
</a>
                                </div>`
                            }
                        }
                    ]
                });
                $('.dt-start').eq(0).addClass('encabezadoTabla');
                $('.dt-search input').attr('placeholder', 'Buscador');                
                $('#tablaLibros').on('click','.btn-edit', function() {
                    let idBtnEjemplar = this.id;
                    let cadena = idBtnEjemplar.split("_");
                    let idEjemplar = parseInt(cadena[1]);
                    const datosEjemplar = allEjemplares.find(ejemplar => ejemplar.id_ejemplar === idEjemplar)
                    // console.log(datosGenero);
                    formEjemplar(datosEjemplar);
                });
                $('#tablaLibros').on('click','.btn-remove', function() {
                    let idBtnEjemplar = this.id;
                    let cadena = idBtnEjemplar.split("_");
                    let idEjemplar = parseInt(cadena[1]);
                    swal({
                        title:"¿Estás seguro de eliminar?",
                        text: "Esta acción eliminará permanentemente los registros asociados. ¿Estás seguro de continuar?",
                        icon: "warning",
                        buttons: {
                            cancel: "Cancelar",
                            confirm: "Confirmar"
                        },
                        dangerMode: true,
                      })
                      .then((willDelete) => {
                        if (willDelete) {
                          swal("Se ha borrado correctamente", {
                            icon: "success",
                          });
                          deleteEjemplar(idEjemplar);
                        } else {
                          swal("Operación cancelada");
                        }
                      });
                });
                $('#tablaLibros').on('click','.btn-noDisponible', function() {
                    let idBtnEjemplar = this.id;
                    let cadena = idBtnEjemplar.split("_");
                    let idEjemplar = parseInt(cadena[1]);
                    console.log(idEjemplar);
                    swal({
                        title:"¿Estás seguro de vaciar el stock?",
                        text: "Este ejemplar dejará de estar disponible para todos los usuarios.",
                        icon: "warning",
                        buttons: {
                            cancel: "Cancelar",
                            confirm: "Confirmar"
                        },
                        dangerMode: true,
                      })
                      .then((willDelete) => {
                        if (willDelete) {
                          swal("Se ha ha vaciado el stock", {
                            icon: "success",
                          });
                          vaciarStock(idEjemplar);
                        } else {
                          swal("Operación cancelada");
                        }
                    });
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

function tablaUsuarios() {
    const contenedor = document.querySelector('#tabla-container');
    contenedor.innerHTML = "";

    const tabla = crearElemento("table",undefined,{id:"tablaLibros"});
    contenedor.appendChild(tabla);

    const userInicioSesion = localStorage.getItem('usuarioSesion');
    const idInicioSesion =JSON.parse(userInicioSesion).id_usuario;

    const parametros = {
        allUsuarios: JSON.stringify({
            'allUsuarios': true
        })
    };

    $.ajax({
        url: "../../assets/php/controladorSesion.php",
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
                $('#tablaLibros').DataTable({
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
                $('.dt-start').eq(0).addClass('encabezadoTabla');
                $('.dt-search input').attr('placeholder', 'Buscador');                
                $('#tablaLibros').on('click','.btn-regsitro', function() {
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

    const tabla = crearElemento("table",undefined,{id:"tablaLibros"});
    contenedor.appendChild(tabla);

    const parametros = {
        allPrestamos: JSON.stringify({
            'allPrestamos': datosUsuario.id_usuario
        })
    };

    $.ajax({
        url: "../../assets/php/controladorSesion.php",
        type: "POST",
        data: parametros,
        success: function(data) {
            if (data) {
                console.log('OK');
                const allPrestamos = JSON.parse(data);
                console.log(allPrestamos);
    
                // Inicializar DataTables con los datos recibidos
                
                $('#tablaLibros').DataTable({
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
        url: "../../assets/php/controladorSesion.php",
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

