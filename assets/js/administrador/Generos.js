window.addEventListener("load",principal);

function principal() {

    document.querySelector('#selectNewGenero').addEventListener("click", () => formGenero());
    document.querySelector('#iconLibroGeneros').addEventListener("click", tablaGeneros);
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

//Crear el formulario de genero tanto para insertar como actualizar
function formGenero(datosGenero = null) {
    const contenedor = document.querySelector('#contenedorFormularioModal');
    contenedor.innerHTML = "";

    const formulario = crearElemento("form", undefined, {id: "formGenero"});
    let contenedorElemForm;

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelNombre = crearElemento("label", 'Nombre', {for: "inputNombreGenero"});
    const inputNombre = crearElemento("input", undefined, {type: "text", id: "inputNombreGenero", class:"form-control"});
    contenedorElemForm.appendChild(labelNombre);
    contenedorElemForm.appendChild(inputNombre);
    formulario.appendChild(contenedorElemForm);

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelObservaciones = crearElemento("label", 'Observaciones', {for: "inputObservacionesGenero"});
    const inputObservaciones = crearElemento("textarea", undefined, {type: "text", id: "inputObservacionesGenero", class:"form-control", style:"resize: none;"});
    contenedorElemForm.appendChild(labelObservaciones);
    contenedorElemForm.appendChild(inputObservaciones);
    formulario.appendChild(contenedorElemForm);

    const contenedorBtn = crearElemento("div", undefined, {class: "mb-3"});
    const btnAdd = crearElemento("input", undefined, {type: "button", value: "Añadir", id: "btnAddAutor", class: "btn btn-primary botonCustom"});
    contenedorBtn.appendChild(btnAdd);
    formulario.appendChild(contenedorBtn);

    // Añadir el formulario completo al contenedor
    contenedor.appendChild(formulario);
    btnAdd.addEventListener("click", crearNewGenero); 

    if(datosGenero !== undefined && datosGenero !==null) {
        console.log(datosGenero);
        inputNombre.value = datosGenero.nombre_genero;
        inputObservaciones.value = datosGenero.observaciones;

        // btnAdd.removeEventListener("click", crearNewAutor);
        btnAdd.parentElement.remove();
        const contenedorBtn = crearElemento("div", undefined, {class: "mb-3"});
        const btnUpdate = crearElemento("input", undefined, {type: "button", value: "Actualizar", id: "btnUpdate", class: "btn btn-primary botonCustom"});
        contenedorBtn.appendChild(btnUpdate);
        formulario.appendChild(contenedorBtn);

        btnUpdate.addEventListener("click", function () {
            updateGenero(datosGenero.id_genero);
        });
    }
}

//Se crea una tabla con todos los generos
function tablaGeneros() {

    const contenedor = document.querySelector('#tabla-container');
    contenedor.innerHTML = "";

    //Se añade el titulo de la gestión
    const nombreGestion = document.querySelector('#nombreGestion');
    nombreGestion.innerHTML = "Gestión de géneros";

    //Se añade el boton para un nuevo registro y se borra el anterior 
    const encabezadoTablaBoton = document.querySelector('#botonAddGestion');
    encabezadoTablaBoton.innerHTML = ""; 

    const imagenRegistro = crearElemento("img",undefined, {src:"../../assets/imagenes/iconos/registro.png", alt:"Nuevo Registro"});
    const botonAddGestion = crearElemento("input",undefined, {type:"button", value:"Añadir género", class:"botonCustom", id:"addLibroTabla", "data-bs-toggle":"modal",
    "data-bs-target":"#modalFormulario"});
    
    encabezadoTablaBoton.appendChild(imagenRegistro);
    encabezadoTablaBoton.appendChild(botonAddGestion);

    const tabla = crearElemento("table",undefined,{id:"tablaGeneros", class:"table table-striped responsive"});
    contenedor.appendChild(tabla);
    
    botonAddGestion.addEventListener("click", () => formGenero());

    const parametrosLibros = {
        allGeneros: JSON.stringify({
            'allGeneros': true
        })
    };

    $.ajax({
        url: "../../assets/php/controladores/controladorGenero/controladorGenero.php",
        type: "POST",
        data: parametrosLibros,
        success: function(data) {
            if (data) {
                console.log('OK');
                const allGeneros = JSON.parse(data);
                // console.log(allGeneros);

                // Inicializar DataTables con los datos recibidos
                $('#tablaGeneros').DataTable({
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
                // $('.dt-start').eq(0).addClass('encabezadoTabla');
                $('.dt-search input').attr('placeholder', 'Buscador');
                $('#tablaGeneros').on('click','.btn-edit', function() {
                    let idBtnGenero = this.id;
                    let cadena = idBtnGenero.split("_");
                    let idGenero = parseInt(cadena[1]);
                    const datosGenero = allGeneros.find(genero => genero.id_genero === idGenero)
                    // console.log(datosGenero);
                    formGenero(datosGenero);
                });
                $('#tablaGeneros').on('click','.btn-remove', function() {
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

//Ajax de los datos de un nuevo genero
function crearNewGenero() {
    const nombreGenero = document.querySelector('#inputNombreGenero').value;
    const observacionesGenero = document.querySelector('#inputObservacionesGenero').value;

    const parametros = {
        newGenero: JSON.stringify({
            "nombre_genero": nombreGenero,
            "observaciones": observacionesGenero
        })
    }

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladores/controladorGenero/controladorGenero.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                console.log(respuesta);
                tablaGeneros();
                document.querySelector("#inputNombreGenero").value = "";
                document.querySelector("#inputObservacionesGenero").value = "";
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

//Ajax para actualizar un genero ya existente
function updateGenero(idGenero) {  

    const nombreGenero = document.querySelector('#inputNombreGenero').value;
    const observacionesGenero = document.querySelector('#inputObservacionesGenero').value;
    console.log(idGenero);

    const parametros = {
        updateGenero: JSON.stringify({
            "id_genero": idGenero,
            "nombre_genero": nombreGenero,
            "observaciones": observacionesGenero
        })
    }

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladores/controladorGenero/controladorGenero.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                // console.log(respuesta);
                tablaGeneros();
                document.querySelector("#inputNombreGenero").value = "";
                document.querySelector("#inputObservacionesGenero").value = "";
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

//Ajax para eliminar un genero
function deleteGenero(idGenero) {

    parametros = {
        deleteGenero : JSON.stringify ({
            'id_genero': idGenero
        })
    }

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladores/controladorGenero/controladorGenero.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                tablaGeneros();
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