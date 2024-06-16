window.addEventListener("load",principal);

function principal() {

    document.querySelector('#selectNewAutor').addEventListener("click", () => formAutor());
    document.querySelector('#iconAutorAdmin').addEventListener("click", tablaAutores);
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

//Crear el formulario de autor tanto para insertar como actualizar
function formAutor(datosAutor = null) {
    // console.log(datosAutor);
    const contenedor = document.querySelector('#contenedorFormularioModal');
    contenedor.innerHTML = "";

    const formulario = crearElemento("form", undefined, {id: "formAutor"});
    let contenedorElemForm;
    let contenedorCol;

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    contenedorRow = crearElemento("div", undefined, {class: "row"});
    contenedorCol = crearElemento("div", undefined, {class: "col-6"});

    contenedorElemForm.appendChild(contenedorRow);
    contenedorRow.appendChild(contenedorCol);
    formulario.appendChild(contenedorElemForm);

    const labelNombre = crearElemento("label", 'Nombre', {for: "inputNombreAutor"});
    const inputNombre = crearElemento("input", undefined, {type: "text", id: "inputNombreAutor", class: "form-control"});
    contenedorCol.appendChild(labelNombre);
    contenedorCol.appendChild(inputNombre);
    contenedorRow.appendChild(contenedorCol);

    contenedorCol = crearElemento("div", undefined, {class: "col-6"});
    const labelApellidos = crearElemento("label", 'Apellidos', {for: "inputApellidosAutor"});
    const inputApellidos = crearElemento("input", undefined, {type: "text", id: "inputApellidosAutor", class: "form-control"});
    contenedorCol.appendChild(labelApellidos);
    contenedorCol.appendChild(inputApellidos);
    contenedorRow.appendChild(contenedorCol);


    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelPais = crearElemento("label", 'Pais', {for: "inputPaisAutor"});
    const inputPais = crearElemento("input", undefined, {type: "text", id: "inputPaisAutor", class: "form-control"});
    contenedorElemForm.appendChild(labelPais);
    contenedorElemForm.appendChild(inputPais);
    formulario.appendChild(contenedorElemForm);

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelObservaciones = crearElemento("label", 'Observaciones', {for: "inputObservacionesAutor"});
    const inputObservaciones = crearElemento("textarea", undefined, {type: "text", id: "inputObservacionesAutor", class: "form-control", style:"resize: none;"});
    contenedorElemForm.appendChild(labelObservaciones);
    contenedorElemForm.appendChild(inputObservaciones);
    formulario.appendChild(contenedorElemForm);

    const contenedorBtn = crearElemento("div", undefined, {class: "mb-3"});
    const btnAdd = crearElemento("input", undefined, {type: "button", value: "Añadir", id: "btnAddAutor", class: "btn btn-primary botonCustom"});
    contenedorBtn.appendChild(btnAdd);
    formulario.appendChild(contenedorBtn);

    btnAdd.addEventListener("click", crearNewAutor);

    // Añadir el formulario completo al contenedor
    contenedor.appendChild(formulario);
    if(datosAutor !== undefined && datosAutor !==null) {
        // console.log(datosAutor);
        inputNombre.value = datosAutor.nombre_autor;
        inputApellidos.value = datosAutor.apellidos_autor;
        inputPais.value = datosAutor.pais_autor;
        inputObservaciones.value = datosAutor.observaciones;

        btnAdd.parentElement.remove();
        const contenedorBtn = crearElemento("div", undefined, {class: "mb-3"});
        const btnUpdate = crearElemento("input", undefined, {type: "button", value: "Actualizar", id: "btnUpdate", class: "btn btn-primary botonCustom"});
        contenedorBtn.appendChild(btnUpdate);
        formulario.appendChild(contenedorBtn);

        btnUpdate.addEventListener("click", function () {
            updateAutor(datosAutor.id_autor);
        });
    }
}

//Se crea la tabla con todos lo autores
function tablaAutores() {

    const contenedor = document.querySelector('#tabla-container');
    contenedor.innerHTML = "";

    //Se añade el titulo de la gestión
    const nombreGestion = document.querySelector('#nombreGestion');
    nombreGestion.innerHTML = "Gestión de autores";

    //Se añade el boton para un nuevo registro y se borra el anterior 
    const encabezadoTablaBoton = document.querySelector('#botonAddGestion');
    encabezadoTablaBoton.innerHTML = ""; 

    const imagenRegistro = crearElemento("img",undefined, {src:"../../assets/imagenes/iconos/registro.png", alt:"Nuevo Registro"});

    const botonAddGestion = crearElemento("input",undefined, {type:"button", value:"Añadir autor", class:"botonCustom", id:"addLibroTabla", "data-bs-toggle":"modal",
    "data-bs-target":"#modalFormulario"});
    encabezadoTablaBoton.appendChild(imagenRegistro);
    encabezadoTablaBoton.appendChild(botonAddGestion);

    const tabla = crearElemento("table",undefined,{id:"tablaAutores", class:"table table-striped responsive"});
    contenedor.appendChild(tabla);

    botonAddGestion.addEventListener("click", () => formAutor());

    const parametrosLibros = {
        allAutores: JSON.stringify({
            'allAutores': true
        })
    };

    $.ajax({
        url: "../../assets/php/controladores/controladorAutor/controladorAutor.php",
        type: "POST",
        data: parametrosLibros,
        success: function(data) {
            if (data) {
                console.log('OK');
                const allAutores = JSON.parse(data);
                console.log(allAutores);

                // Inicializar DataTables con los datos recibidos
                $('#tablaAutores').DataTable({
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
                // $('.dt-start').eq(0).addClass('encabezadoTabla');
                $('.dt-search input').attr('placeholder', 'Buscador');                
                $('#tablaAutores').on('click','.btn-edit', function() {
                    let idBtnAutor = this.id;
                    let cadena = idBtnAutor.split("_");
                    let idAutor = parseInt(cadena[1]);
                    const datosAutor = allAutores.find(autor => autor.id_autor === idAutor)
                    // console.log(datosAutor);
                    formAutor(datosAutor);
                });
                $('#tablaAutores').on('click','.btn-remove', function() {
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

//Ajax de los datos de un nuevo autor
function crearNewAutor() {
    const nombreAutor = document.querySelector("#inputNombreAutor").value;
    const apellidosAutor = document.querySelector("#inputApellidosAutor").value;
    const paisAutor = document.querySelector("#inputPaisAutor").value;
    const observacionesAutor = document.querySelector("#inputObservacionesAutor").value;

    const parametros = {
        newAutor: JSON.stringify({
            "nombre_autor": nombreAutor,
            "apellidos_autor": apellidosAutor,
            "pais_autor": paisAutor,
            "observaciones": observacionesAutor
        })
    }
    console.log(parametros);
    $.ajax({
        type: "POST",
        url: "../../assets/php/controladores/controladorAutor/controladorAutor.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                console.log(respuesta);
                tablaAutores();
                document.querySelector("#inputNombreAutor").value = "";
                document.querySelector("#inputApellidosAutor").value = "";
                document.querySelector("#inputPaisAutor").value = "";
                document.querySelector("#inputObservacionesAutor").value = "";
            }
            else {
                console.log(respuesta);
            }
        },
        error: function(a,b,errorMsg) {
            console.log(errorMsg);
        }
    });

}

//Ajax para actualizar un autor ya creado
function updateAutor(idAutor) {

    const nombreAutor = document.querySelector("#inputNombreAutor").value;
    const apellidosAutor = document.querySelector("#inputApellidosAutor").value;
    const paisAutor = document.querySelector("#inputPaisAutor").value;
    const observacionesAutor = document.querySelector("#inputObservacionesAutor").value;
    console.log(idAutor);

    const parametros = {
        updateAutor: JSON.stringify({
            "id_autor": idAutor,
            "nombre_autor": nombreAutor,
            "apellidos_autor": apellidosAutor,
            "pais_autor": paisAutor,
            "observaciones": observacionesAutor
        })
    }

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladores/controladorAutor/controladorAutor.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                console.log(respuesta);
                tablaAutores();
                document.querySelector("#inputNombreAutor").value = "";
                document.querySelector("#inputApellidosAutor").value = "";
                document.querySelector("#inputPaisAutor").value = "";
                document.querySelector("#inputObservacionesAutor").value = "";
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

//Ajax para eliminar un autor
function deleteAutor(idAutor) {
    
    parametros = {
        deleteAutor : JSON.stringify ({
            'id_autor': idAutor
        })
    }

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladores/controladorAutor/controladorAutor.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                tablaAutores();
                console.log(respuesta);
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