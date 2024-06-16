window.addEventListener("load", principal);

function principal() {

    document.querySelector('#selectNewEjemplar').addEventListener("click", () => formEjemplar());
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

//Crear el formulario de ejemplar tanto para insertar como actualizar
function formEjemplar(datosEjemplar = null) {

    let allEditoriales;
    const parametros = {
        allEditoriales: JSON.stringify({
            'allEditoriales': true
        })
    };

    $.ajax({
        url: "../../assets/php/controladores/controladorEditorial/controladorEditorial.php",
        type: "POST",
        data: parametros,
        async: false,
        success: function (data) {
            if (data) {
                console.log('OK');
                // console.log(JSON.parse(data));
                allEditoriales = JSON.parse(data);
            } else {
                console.log('NO OK');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
        }
    });

    let allLibros;
    const parametrosLibros = {
        allLibros: JSON.stringify({
            'allLibros': true
        })
    };

    $.ajax({
        url: "../../assets/php/controladores/controladorLibro/controladorLibro.php",
        type: "POST",
        data: parametrosLibros,
        async: false,
        success: function (data) {
            if (data) {
                console.log('OK');
                // console.log(JSON.parse(data));
                allLibros = JSON.parse(data);
            } else {
                console.log('NO OK');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
        }
    });;

    const contenedor = document.querySelector('#contenedorFormularioModal');
    contenedor.innerHTML = "";

    const formulario = crearElemento("form", undefined, { id: "formLibro", method: "POST", enctype: "multipart/form-data" });
    let contenedorElemForm;

    contenedorElemForm = crearElemento("div", undefined, { class: "mb-3" });
    const labelNumPag = crearElemento("label", 'Numero de paginas', { for: "inputnumPaginas" });
    const inputNumPag = crearElemento("input", undefined, { type: "number", id: "inputnumPaginas", class: "form-control" });
    contenedorElemForm.appendChild(labelNumPag);
    contenedorElemForm.appendChild(inputNumPag);
    formulario.appendChild(contenedorElemForm);

    contenedorElemForm = crearElemento("div", undefined, { class: "mb-3" });
    const labelStock = crearElemento("label", 'Stock', { for: "inputstock" });
    const inputStock = crearElemento("input", undefined, { type: "text", id: "inputstock", class: "form-control" });
    contenedorElemForm.appendChild(labelStock);
    contenedorElemForm.appendChild(inputStock);
    formulario.appendChild(contenedorElemForm);

    contenedorElemForm = crearElemento("div", undefined, { class: "mb-3" });
    const selectLibros = crearElemento("select", undefined, { name: 'tagLibro', id: "selectLibro", class: "selectpicker", "data-show-subtext": true, "data-live-search": true });

    allLibros.forEach(libro => {
        // console.log(genero)
        let opcionLibro = crearElemento("option", libro["nombre_libro"], { id: "libro_" + libro["id_libro"] });

        if (datosEjemplar && libro.id_libro === datosEjemplar.id_libro) {
            opcionLibro.setAttribute("selected", true);
        }

        selectLibros.appendChild(opcionLibro);
    });

    contenedorElemForm.appendChild(selectLibros);
    formulario.appendChild(contenedorElemForm);

    contenedorElemForm = crearElemento("div", undefined, { class: "mb-3" });
    const labelFormFile = crearElemento("label", 'Elige un archivo', { for: "inputFormFile", class: "form-label" });
    const inputFormFile = crearElemento("input", undefined, { type: "file", id: "portadaEjemplar", accept: "image/*", name: "portada", class: "form-control", });
    contenedorElemForm.appendChild(labelFormFile);
    contenedorElemForm.appendChild(inputFormFile);
    formulario.appendChild(contenedorElemForm);

    contenedorElemForm = crearElemento("div", undefined, { class: "mb-3" });
    const selectEditoriales = crearElemento("select", undefined, { name: 'tagEditorial', id: "selectEditorial", class: "selectpicker", "data-show-subtext": true, "data-live-search": true });

    allEditoriales.forEach(editorial => {
        // console.log(genero)
        let opcionEditorial = crearElemento("option", editorial["nombre_editorial"], { id: "editorial_" + editorial["id_editorial"] });

        if (datosEjemplar && editorial.id_editorial === datosEjemplar.id_editorial) {
            opcionEditorial.setAttribute("selected", true);
        }

        selectEditoriales.appendChild(opcionEditorial);
    });

    contenedorElemForm.appendChild(selectEditoriales);
    formulario.appendChild(contenedorElemForm);

    contenedorElemForm = crearElemento("div", undefined, { class: "mb-3" });
    const labelObservaciones = crearElemento("label", 'Observaciones', { for: "inputObservacionesEjemplar" });
    const inputObservaciones = crearElemento("textarea", undefined, { type: "text", id: "inputObservacionesEjemplar", style: "resize: none;", class: "form-control" });
    contenedorElemForm.appendChild(labelObservaciones);
    contenedorElemForm.appendChild(inputObservaciones);
    formulario.appendChild(contenedorElemForm);

    const contenedorBtn = crearElemento("div", undefined, { class: "mb-3" });
    const btnAdd = crearElemento("input", undefined, { type: "button", value: "Añadir", id: "btnAddEjemplar", class: "btn btn-primary botonCustom" });
    contenedorBtn.appendChild(btnAdd);
    formulario.appendChild(contenedorBtn);

    contenedor.appendChild(formulario);

    btnAdd.addEventListener("click", function () {
        const selectedLibroId = selectLibros.selectedOptions[0].id;
        const cadena = selectedLibroId.split("_");
        idLibro = cadena[1];
        const selectedEditorialId = selectEditoriales.selectedOptions[0].id;
        const cadena2 = selectedEditorialId.split("_");
        idEditorial = cadena2[1];
        crearNewPortada(idEditorial, idLibro);
    });

    if (datosEjemplar !== null && datosEjemplar !== undefined) {
        console.log(datosEjemplar);
        inputNumPag.value = datosEjemplar.num_paginas;
        inputStock.value = datosEjemplar.stock;
        inputObservaciones.value = datosEjemplar.observaciones;

        const opcionesTitulo = selectLibros.options;
        if (datosEjemplar.id_libro === null) {

            selectLibros.selectedIndex = -1;
        }
        else {
            for (let i = 0; i < opcionesTitulo.length; i++) {
                // Verificar si el ID de la opción coincide con el ID esperado
                if (opcionesTitulo[i].id === String('libro_' + datosEjemplar.id_libro)) {
                    // Seleccionar esta opción
                    opcionesTitulo[i].selected = true;
                }
            }
        }

        const opcionesEditorial = selectEditoriales.options;
        if (datosEjemplar.id_editorial === null) {

            selectEditoriales.selectedIndex = -1;
        }
        else {
            for (let i = 0; i < opcionesEditorial.length; i++) {
                // Verificar si el ID de la opción coincide con el ID esperado
                if (opcionesEditorial[i].id === String('editorial_' + datosEjemplar.id_editorial)) {
                    // Seleccionar esta opción
                    opcionesEditorial[i].selected = true;
                }
            }
        }

        btnAdd.parentElement.remove();
        const contenedorBtn = crearElemento("div", undefined, { class: "mb-3" });
        const btnUpdate = crearElemento("input", undefined, { type: "button", value: "Actualizar", id: "btnUpdate", class: "btn btn-primary botonCustom" });
        contenedorBtn.appendChild(btnUpdate);
        formulario.appendChild(contenedorBtn);

        // btnUpdate.addEventListener("click", updateEjemplar);
    }

    $('.selectpicker').selectpicker();
}

//Crear tabla de ejemplares
function tablaEjemplares() {

    const contenedor = document.querySelector('#tabla-container');
    contenedor.innerHTML = "";

    //Se añade el titulo de la gestión
    const nombreGestion = document.querySelector('#nombreGestion');
    nombreGestion.innerHTML = "Gestión de ejemplares";

    //Se añade el boton para un nuevo registro y se borra el anterior 
    const encabezadoTablaBoton = document.querySelector('#botonAddGestion');
    encabezadoTablaBoton.innerHTML = "";

    const imagenRegistro = crearElemento("img", undefined, { src: "../../assets/imagenes/iconos/registro.png", alt: "Nuevo Registro" });
    const botonAddGestion = crearElemento("input", undefined, {
        type: "button", value: "Añadir ejemplar", class: "botonCustom", id: "addLibroTabla", "data-bs-toggle": "modal",
        "data-bs-target": "#modalFormulario"
    });

    encabezadoTablaBoton.appendChild(imagenRegistro);
    encabezadoTablaBoton.appendChild(botonAddGestion);

    const tabla = crearElemento("table", undefined, { id: "tablaEjemplares", class: "table table-striped table-centered responsive" });
    contenedor.appendChild(tabla);

    botonAddGestion.addEventListener("click", () => formEjemplar());

    const parametrosLibros = {
        allEjemplares: JSON.stringify({
            'allEjemplares': true
        })
    };

    $.ajax({
        url: "../../assets/php/controladores/controladorEjemplar/controladorEjemplar.php",
        type: "POST",
        data: parametrosLibros,
        success: function (data) {
            if (data) {
                // console.log('OK');
                const allEjemplares = JSON.parse(data);
                // console.log(allEjemplares);

                // Inicializar DataTables con los datos recibidos
                $('#tablaEjemplares').DataTable({
                    data: allEjemplares,
                    language: {
                        lengthMenu: "Mostrar _MENU_ ejemplares por página"
                    },
                    columns: [
                        {
                            data: 'nombre_libro',
                            title: 'Titulo',
                            render: function (data) {
                                return data !== null ? data : `<div class="errorFaltaUnDato"><div class="errorFaltaUnDatoColorFondo"></div>No hay ningún titulo asociado</div>`;
                            }
                        },
                        {
                            data: 'portada',
                            title: 'Portada',
                            orderable: false,
                            render: function (data, row) {
                                return data !== null ? `<img src="../../assets/imagenes/portadas/${data}"
                                alt="${row.nombre_libro}>" style="width:100px; height:auto;">` : `<div class="errorFaltaUnDato"><div class="errorFaltaUnDatoColorFondo"></div>No hay ninguna portada asociada</div>`
                            }
                        },
                        {
                            data: 'nombre_editorial',
                            title: 'Editorial',
                            render: function (data) {
                                return data !== null ? data : `<div class="errorFaltaUnDato"><div class="errorFaltaUnDatoColorFondo"></div>No hay ninguna editorial asociada</div>`;
                            }
                        },
                        { data: 'num_paginas', title: 'Número de paginas' },
                        {
                            data: 'stock',
                            title: 'Stock',
                            render: function (data) {
                                return data > 0 ? data : `<div class="noDisponible"><div class="noDisponibleColorFondo"></div>No disponible</div>`;
                            }
                        },
                        { data: 'observaciones', title: 'Observaciones', orderable: false },
                        {
                            data: null,
                            title: 'Acciones',
                            orderable: false,
                            render: function (row) {
                                return `
                                        <div class="d-flex">
                                            <a class="nav-link btn-remove" id="btnRemove_${row.id_ejemplar}">
                                                <lord-icon src="https://cdn.lordicon.com/skkahier.json" 
                                                    trigger="hover"
                                                    colors="primary:#e83a30"
                                                    style="width:50px;height:50px">
                                                </lord-icon>
                                            </a>
                                            <a class="nav-link btn-edit" id="btnEdit_${row.id_ejemplar}" 
                                                type="button" 
                                                data-bs-toggle="modal" 
                                                data-bs-target="#modalFormulario">
                                                <lord-icon src="https://cdn.lordicon.com/xpgofwru.json"
                                                    trigger="hover"
                                                    colors="primary:#5d043f"
                                                    style="width:50px;height:50px">
                                                </lord-icon>
                                            </a>
                                            <a class="nav-link btn-noDisponible" id="noDisponible_${row.id_ejemplar}">
                                                <i class="bi bi-circle-fill iconCustomVaciar"></i>
                                            </a>
                                        </div>`
                            }
                        }
                    ],
                    responsive: true
                });

                $('.dt-search input').attr('placeholder', 'Buscador');
                $('#tablaEjemplares').on('click', '.btn-edit', function () {
                    let idBtnEjemplar = this.id;
                    let cadena = idBtnEjemplar.split("_");
                    let idEjemplar = parseInt(cadena[1]);
                    const datosEjemplar = allEjemplares.find(ejemplar => ejemplar.id_ejemplar === idEjemplar)
                    // console.log(datosGenero);
                    formEjemplar(datosEjemplar);
                });
                $('#tablaEjemplares').on('click', '.btn-remove', function () {
                    let idBtnEjemplar = this.id;
                    let cadena = idBtnEjemplar.split("_");
                    let idEjemplar = parseInt(cadena[1]);
                    swal({
                        title: "¿Estás seguro de eliminar?",
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
                $('#tablaEjemplares').on('click', '.btn-noDisponible', function () {
                    let idBtnEjemplar = this.id;
                    let cadena = idBtnEjemplar.split("_");
                    let idEjemplar = parseInt(cadena[1]);
                    console.log(idEjemplar);
                    swal({
                        title: "¿Estás seguro de vaciar el stock?",
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
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
        }
    });
}

//En caso de que un ejemplar deje de estar disponible se recomienda igualar el stock a 0
function vaciarStock(idEjemplar) {

    const parametros = {
        vaciarStock: JSON.stringify({
            "id_ejemplar": idEjemplar,
            "stock": 0,
        })
    }
    $.ajax({
        type: "POST",
        url: "../../assets/php/controladores/controladorEjemplar/controladorEjemplar.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if (respuesta) {
                console.log(respuesta);
                tablaEjemplares();
                // window.location.href = '../html/sesion.html';
            }
            else {
                console.log(respuesta);
            }
        },
        error: function (a, b, errorMsg) {
            console.log(errorMsg);
        }
    })
}

//Ajax para añadir o actualizar una portada de un ejemplar
function crearNewPortada(selectedLibro, selectedEditorial) {
    console.log("Entra en crear nueva portada");
    const portadaEjemplar = document.querySelector('#portadaEjemplar');

    // Se comprueba que existe una portada 
    if (portadaEjemplar.files && portadaEjemplar.files[0]) {

        const formData = new FormData();
        const archivo = portadaEjemplar.files[0];
        formData.append('portadaEjemplar', archivo);

        $.ajax({
            type: "POST",
            url: "../../assets/php/controladores/controladorEjemplar/controladorPortada.php",
            data: formData,
            dataType: 'json',
            contentType: false, // No establecer contentType para FormData
            processData: false, // No procesar FormData
            success: function (respuesta) {
                if (respuesta) {
                    crearNewEjemplar(selectedLibro, selectedEditorial, respuesta)
                }
                else {
                    console.log(respuesta);
                }
            },
            error: function (a, b, errorMsg) {
                console.log(errorMsg);
            }
        })
    }
}

//Ajax para añadir un nuevo ejemplar 
function crearNewEjemplar(selectedLibro, selectedEditorial, nombrePortada) {
    
    console.log("Entra en crear nuevo ejemplar");
    const numPaginas = document.querySelector("#inputnumPaginas").value;
    const stock = document.querySelector("#inputstock").value;
    const observacionesEjemplar = document.querySelector("#inputObservacionesEjemplar").value;

    const parametros = {
        newEjemplar: JSON.stringify({
            "portada": nombrePortada,
            "num_paginas": numPaginas,
            "fk_editorial": selectedEditorial,
            "fk_libro": selectedLibro,
            "stock": stock,
            "observaciones": observacionesEjemplar
        })
    }

    console.log(parametros);
    $.ajax({
        type: "POST",
        url: "../../assets/php/controladores/controladorEjemplar/controladorEjemplar.php",
        data: parametros,
        success: function (respuesta) {
            console.log(respuesta);
            if (respuesta) {
                tablaEjemplares();
                document.querySelector("#inputnumPaginas").value = "";
                document.querySelector("#inputstock").value = "";
                document.querySelector("#inputObservacionesEjemplar").value = "";
            }
            else {
                console.log(respuesta);
            }
        },
        error: function (a, b, errorMsg) {
            console.log(errorMsg);
        }
    })
}

//Ajax para eliminar un ejemplar
function deleteEjemplar(idEjemplar) {

    parametros = {
        deleteEjemplar: JSON.stringify({
            'id_ejemplar': idEjemplar
        })
    }

    $.ajax({
        type: "POST",
        url: "../../assets/php/controladores/controladorEjemplar/controladorEjemplar.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if (respuesta) {
                tablaEjemplares();
                console.log(respuesta);
            }
            else {
                console.log(respuesta);
            }
        },
        error: function (a, b, errorMsg) {
            console.log(errorMsg);
        }
    })
}
