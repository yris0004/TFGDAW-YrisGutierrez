window.addEventListener("load",principal);

function principal() {
    
    document.querySelector('#selectNewEditorial').addEventListener("click", () => formEditorial());
    document.querySelector('#iconLibroEditorial').addEventListener("click", tablaEditoriales);
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

//Crear el formulario de editorial tanto para insertar como actualizar
function formEditorial(datosEditorial = null) {
    const contenedor = document.querySelector('#contenedorFormularioModal');
    contenedor.innerHTML = "";

    const formulario = crearElemento("form", undefined, {id: "formEditorial"});
    let contenedorElemForm;

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelNombre = crearElemento("label", 'Nombre', {for: "inputNombreEditorial"});
    const inputNombre = crearElemento("input", undefined, {type: "text", id: "inputNombreEditorial", class: "form-control"});
    contenedorElemForm.appendChild(labelNombre);
    contenedorElemForm.appendChild(inputNombre);
    formulario.appendChild(contenedorElemForm);

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelObservaciones = crearElemento("label", 'Observaciones', {for: "inputObservacionesEditorial"});
    const inputObservaciones = crearElemento("textarea", undefined, {type: "text", id: "inputObservacionesEditorial", style:"resize: none;", class: "form-control"});
    contenedorElemForm.appendChild(labelObservaciones);
    contenedorElemForm.appendChild(inputObservaciones);
    formulario.appendChild(contenedorElemForm);

    const contenedorBtn = crearElemento("div", undefined, {class: "mb-3"});
    const btnAdd = crearElemento("input", undefined, {type: "button", value: "Añadir", id: "btnAddEditorial", class: "btn btn-primary botonCustom"});
    contenedorBtn.appendChild(btnAdd);
    formulario.appendChild(contenedorBtn);

    contenedor.appendChild(formulario);

    if(datosEditorial !== null && datosEditorial !== undefined) {
        console.log(datosEditorial);
        inputNombre.value = datosEditorial.nombre_editorial;
        inputObservaciones.value = datosEditorial.observaciones;

        btnAdd.parentElement.remove();
        const contenedorBtn = crearElemento("div", undefined, {class: "mb-3"});
        const btnUpdate = crearElemento("input", undefined, {type: "button", value: "Actualizar", id: "btnUpdate", class: "btn btn-primary botonCustom"});
        contenedorBtn.appendChild(btnUpdate);
        formulario.appendChild(contenedorBtn);

        btnUpdate.addEventListener("click", function () {
            updateEditorial(datosEditorial.id_editorial)
        });
    }

    btnAdd.addEventListener("click", crearNewEditorial);
}

//Crear tabla de todas las editoriales
function tablaEditoriales() {

    const contenedor = document.querySelector('#tabla-container');
    contenedor.innerHTML = "";

    //Se añade el titulo de la gestión
    const nombreGestion = document.querySelector('#nombreGestion');
    nombreGestion.innerHTML = "Gestión de editoriales";

    //Se añade el boton para un nuevo registro y se borra el anterior 
    const encabezadoTablaBoton = document.querySelector('#botonAddGestion');
    encabezadoTablaBoton.innerHTML = ""; 

    const imagenRegistro = crearElemento("img",undefined, {src:"../../assets/imagenes/iconos/registro.png", alt:"Nuevo Registro"});
    const botonAddGestion = crearElemento("input",undefined, {type:"button", value:"Añadir editorial", class:"botonCustom", id:"addLibroTabla", "data-bs-toggle":"modal",
    "data-bs-target":"#modalFormulario"});
    
    encabezadoTablaBoton.appendChild(imagenRegistro);
    encabezadoTablaBoton.appendChild(botonAddGestion);

    const tabla = crearElemento("table",undefined,{id:"tablaEditoriales", class:"table table-striped responsive"});
    contenedor.appendChild(tabla);

    botonAddGestion.addEventListener("click", () => formEditorial());

    const parametrosLibros = {
        allEditoriales: JSON.stringify({
            'allEditoriales': true
        })
    };

    $.ajax({
        url: "../../assets/php/controladores/controladorEditorial/controladorEditorial.php",
        type: "POST",
        data: parametrosLibros,
        success: function(data) {
            if (data) {
                console.log('OK');
                const allEditoriales = JSON.parse(data);
                console.log(allEditoriales);

                // Inicializar DataTables con los datos recibidos
                $('#tablaEditoriales').DataTable({
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
                // $('.dt-start').eq(0).addClass('encabezadoTabla');
                $('.dt-search input').attr('placeholder', 'Buscador');                
                $('#tablaEditoriales').on('click','.btn-edit', function() {
                    let idBtnEditorial = this.id;
                    let cadena = idBtnEditorial.split("_");
                    let idEditorial = parseInt(cadena[1]);
                    const datosEditorial = allEditoriales.find(editorial => editorial.id_editorial === idEditorial)
                    console.log(datosEditorial);
                    formEditorial(datosEditorial);
                });
                $('#tablaEditoriales').on('click','.btn-remove', function() {
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

//Ajax para insertar una nueva editorial
function crearNewEditorial() {

    const nombreEditorial = document.querySelector('#inputNombreEditorial').value;
    const observacionesEditorial = document.querySelector('#inputObservacionesEditorial').value;

    const parametros = {
        newEditorial: JSON.stringify({
            "nombre_editorial": nombreEditorial,
            "observaciones": observacionesEditorial
        })
    }

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladores/controladorEditorial/controladorEditorial.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                console.log(respuesta);
                tablaEditoriales();
                document.querySelector("#inputNombreEditorial").value = "";
                document.querySelector("#inputObservacionesEditorial").value = "";
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

//Ajax para actualizar una editorial
function updateEditorial(idEditorial) {

    const nombreEditorial = document.querySelector('#inputNombreEditorial').value;
    const observacionesEditorial = document.querySelector('#inputObservacionesEditorial').value;
    console.log(idEditorial);
    const parametros = {
        updateEditorial: JSON.stringify({
            "id_editorial": idEditorial,
            "nombre_editorial": nombreEditorial,
            "observaciones": observacionesEditorial
        })
    }

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladores/controladorEditorial/controladorEditorial.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                // console.log(respuesta);
                tablaEditoriales();
                document.querySelector("#inputNombreEditorial").value = "";
                document.querySelector("#inputObservacionesEditorial").value = "";
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

//Ajax para eliminar una editorial
function deleteEditorial(idEditorial) {

    parametros = {
        deleteEditorial : JSON.stringify ({
            'id_editorial': idEditorial
        })
    }

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladores/controladorEditorial/controladorEditorial.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                tablaEditoriales();
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