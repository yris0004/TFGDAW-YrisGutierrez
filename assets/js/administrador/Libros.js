window.addEventListener("load",principal);

function principal() {

    document.querySelector('#selectNewLibro').addEventListener("click", () => formLibro());
    document.querySelector('#iconLibroAdmin').addEventListener("click", tablaLibros);
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

//Crear el formulario de libro tanto para insertar como actualizar
function formLibro(datosLibro = null) {

    let allAutores;
    const parametros = {
        allAutores : JSON.stringify({
            'allAutores' : true
        })
    };

    $.ajax({
        url: "../../assets/php/controladores/controladorAutor/controladorAutor.php",
        type: "POST",
        data: parametros,
        async: false,
        success: function(data) {
            if (data) {
                console.log('OK');
                // console.log(JSON.parse(data));
                allAutores = JSON.parse(data);
            } else {
                console.log('NO OK');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
        }
    });

    let allGeneros;
    const parametrosGenero = {
        allGeneros : JSON.stringify({
            'allGeneros' : true
        })
    };

    $.ajax({
        url: "../../assets/php/controladores/controladorGenero/controladorGenero.php",
        type: "POST",
        data: parametrosGenero,
        async: false,
        success: function(dataGenero) {
            if (dataGenero) {
                console.log('OK');
                // console.log(JSON.parse(dataGenero));
                allGeneros = JSON.parse(dataGenero);
            } else {
                console.log('NO OK');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
        }
    });

    // console.log(allGeneros);
    const contenedor = document.querySelector('#contenedorFormularioModal');
    contenedor.innerHTML = "";

    const formulario = crearElemento("form", undefined, {id: "formLibro"});
    let contenedorElemForm;

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelNombre = crearElemento("label", 'Titulo', {for: "inputNombreLibro"});
    const inputNombre = crearElemento("input", undefined, {type: "text", id: "inputNombreLibro", class:"form-control"});
    contenedorElemForm.appendChild(labelNombre);
    contenedorElemForm.appendChild(inputNombre);
    formulario.appendChild(contenedorElemForm);

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelSinopsis = crearElemento("label", 'Sinopsis', {for: "inputSinopsisLibro"});
    const inputSinopsis = crearElemento("textarea", undefined, {type: "text", id: "inputSinopsisLibro", class:"form-control"});
    contenedorElemForm.appendChild(labelSinopsis);
    contenedorElemForm.appendChild(inputSinopsis);
    formulario.appendChild(contenedorElemForm);

    contenedorElemFormAutores = crearElemento("div", undefined, { class: "mb-3" }); 
    const selectAutores = crearElemento("select", undefined, { name: 'tagsAutores', id: "selectAutor", class:"selectpicker", "data-show-subtext":true, "data-live-search":true});
    allAutores.forEach(autor => {
        let optionAutor = crearElemento("option", autor["nombre_autor"], { id: 'autor_' + autor["id_autor"]});

        if (datosLibro && autor.id_autor === datosLibro.fk_autor) {
            optionAutor.setAttribute("selected", true);
        }
        selectAutores.appendChild(optionAutor);
    });
    contenedorElemFormAutores.appendChild(selectAutores);
    formulario.appendChild(contenedorElemFormAutores);


    contenedorElemForm = crearElemento("div", undefined, {class: "m-5 col-md-6"});
    const selectGeneros = crearElemento("select", undefined, { name:'tags', id:"selectTags", class:"selectpicker", multiple: true, "aria-label":"Default select example", "data-live-search":true});

    allGeneros.forEach(genero => {
        // console.log(genero)
        let optionGenero = crearElemento("option",genero["nombre_genero"],{ id: 'genero_' + genero["id_genero"]});
        selectGeneros.appendChild(optionGenero);

        if (datosLibro && genero.id_autor === datosLibro.id_generos) {
            optionAutor.setAttribute("selected", true);
        }
        selectGeneros.appendChild(optionGenero);
    });

    contenedorElemForm.appendChild(selectGeneros);
    formulario.appendChild(contenedorElemForm);

    contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
    const labelObservaciones = crearElemento("label", 'Observaciones', {for: "inputObservacionesLibro"});
    const inputObservaciones = crearElemento("textarea", undefined, {type: "text", id: "inputObservacionesLibro", class: "form-control", style:"resize: none;"});
    contenedorElemForm.appendChild(labelObservaciones);
    contenedorElemForm.appendChild(inputObservaciones);
    formulario.appendChild(contenedorElemForm);

    const contenedorBtn = crearElemento("div", undefined, {class: "mb-3"});
    const btnAdd = crearElemento("input", undefined, {type: "button", value: "Añadir", id: "btnAddAutor", class: "btn btn-primary botonCustom"});
    contenedorBtn.appendChild(btnAdd);
    formulario.appendChild(contenedorBtn);

    btnAdd.addEventListener("click", function() {
        const selectedGenerosIds = Array.from(selectGeneros.selectedOptions).map(option => option.id);
        const selectedAutoresIds = selectAutores.selectedOptions[0].id;

        const cadenaAutor = selectedAutoresIds.split("_");
        const autorSeleccionado = parseInt(cadenaAutor[1]);
        let generosSeleccionados = [];
        selectedGenerosIds.forEach(idgenero => {

            cadenaGenero = idgenero.split("_");
            generoSeleccionado = parseInt(cadenaGenero[1]);
            generosSeleccionados.push(generoSeleccionado);
        });

        crearNewLibro(generosSeleccionados,autorSeleccionado);
    });

    // Añadir el formulario completo al contenedor
    contenedor.appendChild(formulario);

    if(datosLibro !== null) {
        inputNombre.value = datosLibro.nombre_libro;
        inputSinopsis.value = datosLibro.sinopsis;
        inputObservaciones.value = datosLibro.observaciones;
        // selectAutores.selectedOptions[0].id = String('autor_'+datosLibro.fk_autor);
        // console.log(selectAutores.selectedOptions[0].id)
        const opcionesAutor = selectAutores.options;

        if(datosLibro.fk_autor === null) {

            selectAutores.selectedIndex = -1;
        } 
        else {
        for (let i = 0; i < opcionesAutor.length; i++) {
            // Verificar si el ID de la opción coincide con el ID esperado
            if (opcionesAutor[i].id === String('autor_'+datosLibro.fk_autor)) {
                // Seleccionar esta opción
                opcionesAutor[i].selected = true;
            }
        }
        }
        const opcionesGenero = selectGeneros.options;
        // console.log(datosLibro.id_generos);
        if (datosLibro.id_generos === null) {
            // Establecer la opción por defecto seleccionada
            selectGeneros.selectedIndex = -1; // O el índice de la opción por defecto que desees
        } else {
            const seleccionGeneros = datosLibro.id_generos.split(", ");
            seleccionGeneros.forEach(seleccionGenero => {
                for (let i = 0; i < opcionesGenero.length; i++) {
                    if (opcionesGenero[i].id === String('genero_' + seleccionGenero)) {
                        opcionesGenero[i].selected = true;
                    }
                }
            });
        }
        btnAdd.parentElement.remove();
        const contenedorBtn = crearElemento("div", undefined, {class: "mb-3"});
        const btnUpdate = crearElemento("input", undefined, {type: "button", value: "Actualizar", id: "btnUpdate", class: "btn btn-primary botonCustom"});
        contenedorBtn.appendChild(btnUpdate);
        formulario.appendChild(contenedorBtn);

        btnUpdate.addEventListener("click", function () {
            const selectedGenerosIds = Array.from(selectGeneros.selectedOptions).map(option => option.id);
            const selectedAutoresIds = selectAutores.selectedOptions[0].id;
            updateLibro(datosLibro.id_libro, selectedGenerosIds, selectedAutoresIds)
        });
    }

    $('.selectpicker').selectpicker();
}

//Se crea una tabla para mostrar todos los libros
function tablaLibros() {

    const contenedor = document.querySelector('#tabla-container');
    contenedor.innerHTML = "";

    //Se añade el titulo de la gestión
    const nombreGestion = document.querySelector('#nombreGestion');
    nombreGestion.innerHTML = "Gestión de libros";

    //Se añade el boton para un nuevo registro y se borra el anterior 
    const encabezadoTablaBoton = document.querySelector('#botonAddGestion');
    encabezadoTablaBoton.innerHTML = ""; 

    const imagenRegistro = crearElemento("img",undefined, {src:"../../assets/imagenes/iconos/registro.png", alt:"Nuevo Registro"});
    const botonAddGestion = crearElemento("input",undefined, {type:"button", value:"Añadir libro", class:"botonCustom", id:"addLibroTabla", "data-bs-toggle":"modal",
    "data-bs-target":"#modalFormulario"});

    encabezadoTablaBoton.appendChild(imagenRegistro);
    encabezadoTablaBoton.appendChild(botonAddGestion);

    const tabla = crearElemento("table",undefined,{id:"tablaLibros", class:"table table-striped responsive"});
    contenedor.appendChild(tabla);
    
    botonAddGestion.addEventListener("click", () => formLibro());

    const parametrosLibros = {
        allLibros: JSON.stringify({
            'allLibros': true
        })
    };

    $.ajax({
        url: "../../assets/php/controladores/controladorLibro/controladorLibro.php",
        type: "POST",
        data: parametrosLibros,
        success: function(data) {
            if (data) {
                // console.log('OK');
                const allLibros = JSON.parse(data);
                // console.log(allLibros);            
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
                    ],
                    reponsive: true
                });

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

//Ajax para crear un nuevo libro
function crearNewLibro(selectedGeneros, selectedAutor) {

    const nombreLibro = document.querySelector('#inputNombreLibro').value;
    const sinopsisLibro = document.querySelector('#inputSinopsisLibro').value;
    const observacionesLibro = document.querySelector('#inputObservacionesLibro').value;

    //Es necesario enviar un objeto con todos los datos de la tabla libros y un array de objetos con los datos de libros generos
    const parametros = {
        nombre_libro: nombreLibro,
        sinopsis: sinopsisLibro,
        fk_autor: selectedAutor,
        observaciones: observacionesLibro
    }

    const parametrosGeneros = selectedGeneros.map(generoLibro => {
        return {fk_genero: generoLibro}
    })
    console.log(parametros);
    console.log(parametrosGeneros);
    $.ajax({
        type:"POST",
        url: "../../assets/php/controladores/controladorLibro/controladorLibro.php",
        data: {
            newLibro: JSON.stringify(parametros),
            newLibrosGeneros: JSON.stringify(parametrosGeneros)
        },
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                console.log(respuesta);
                tablaLibros();
                document.querySelector("#inputNombreLibro").value = "";
                document.querySelector("#inputSinopsisLibro").value = "";
                document.querySelector('#inputObservacionesLibro').value = "";

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

//Ajax para actualizar un nuevo libro
function updateLibro(idLibro,selectedGenerosIds, selectedAutoresIds) {

    const nombreLibro = document.querySelector('#inputNombreLibro').value;
    const sinopsisLibro = document.querySelector('#inputSinopsisLibro').value;
    const observacionesLibro = document.querySelector('#inputObservacionesLibro').value;

    let obtenerIdAutor = selectedAutoresIds.split('_');
    let idAutor = obtenerIdAutor[1];

    //Es necesario enviar un objeto con todos los datos de la tabla libros y un array de objetos con los datos de libros generos
    const parametros = {
            "id_Libro": idLibro,
            "nombre_libro": nombreLibro,
            "sinopsis": sinopsisLibro,
            "fk_autor": idAutor,
            "observaciones": observacionesLibro
    }

    const parametrosGeneros = selectedGenerosIds.map(generoLibro => {
        obtenerLibro = generoLibro.split('_');
        idGenero = obtenerLibro[1]; 

        return {fk_libro: idLibro,fk_genero: idGenero}
    })

    // console.log(parametros);
    // console.log(parametrosGeneros);

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladores/controladorLibro/controladorLibro.php",
        data: {
            updateLibros: JSON.stringify(parametros),
            updateGenerosLibros: JSON.stringify(parametrosGeneros)
        },
        success: function (respuesta) {
            if(respuesta) {
                // console.log(respuesta);
                tablaLibros();
                document.querySelector("#inputNombreLibro").value = "";
                document.querySelector("#inputSinopsisLibro").value = "";
                document.querySelector("#inputObservacionesLibro").value = "";
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

//Ajax para eliminar un libro
function deleteLibro(idLibro) {
    
    parametros = {
        deleteLibro : JSON.stringify ({
            'id_Libro': idLibro
        })
    }

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladores/controladorLibro/controladorLibro.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                tablaLibros();
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
