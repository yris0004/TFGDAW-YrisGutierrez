window.addEventListener("load",principal);

function principal() {
    document.querySelector('#selectNewLibro').addEventListener("click", () => formLibro());
    document.querySelector('#selectNewAutor').addEventListener("click", () => formAutor());
    document.querySelector('#selectNewGenero').addEventListener("click", () => formGenero());
    document.querySelector('#selectNewEditorial').addEventListener("click", () => formEditorial());
    document.querySelector('#selectNewEjemplar').addEventListener("click", () => formEjemplar());
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

        // btnAdd.removeEventListener("click", crearNewAutor);
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
        url: "../../assets/php/controladorSesion.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                console.log(respuesta);
                // window.location.href = '../html/sesion.html';
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
        url: "../../assets/php/controladorSesion.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                console.log(respuesta);
                // window.location.href = '../html/sesion.html';
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

function formLibro(datosLibro = null) {

    let allAutores;
    const parametros = {
        allAutores : JSON.stringify({
            'allAutores' : true
        })
    };

    $.ajax({
        url: "../../assets/php/controladorSesion.php",
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
        url: "../../assets/php/controladorSesion.php",
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

function crearNewLibro(selectedGeneros, selectedAutor) {

    const nombreLibro = document.querySelector('#inputNombreLibro').value;
    const sinopsisLibro = document.querySelector('#inputSinopsisLibro').value;
    const observacionesLibro = document.querySelector('#inputObservacionesLibro').value;

    console.log(selectedAutor);
    console.log(selectedGeneros);

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
        url: "../../assets/php/controladorSesion.php",
        data: {
            newLibro: JSON.stringify(parametros),
            newLibrosGeneros: JSON.stringify(parametrosGeneros)
        },
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                console.log(respuesta);
                // window.location.href = '../html/sesion.html';
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
        url: "../../assets/php/controladorSesion.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                console.log(respuesta);
                // window.location.href = '../html/sesion.html';
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

function formEjemplar(datosEjemplar = null) {

let allEditoriales;
  const parametros = {
    allEditoriales : JSON.stringify({
          'allEditoriales' : true
      })
  };

  $.ajax({
      url: "../../assets/php/controladorSesion.php",
      type: "POST",
      data: parametros,
      async: false,
      success: function(data) {
          if (data) {
              console.log('OK');
              // console.log(JSON.parse(data));
              allEditoriales = JSON.parse(data);
          } else {
              console.log('NO OK');
          }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
      }
  });

  let allLibros;
  const parametrosLibros = {
    allLibros : JSON.stringify({
          'allLibros' : true
      })
  };

  $.ajax({
      url: "../../assets/php/controladorSesion.php",
      type: "POST",
      data: parametrosLibros,
      async: false,
      success: function(data) {
          if (data) {
              console.log('OK');
              // console.log(JSON.parse(data));
              allLibros = JSON.parse(data);
          } else {
              console.log('NO OK');
          }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
      }
  });;

  const contenedor = document.querySelector('#contenedorFormularioModal');
  contenedor.innerHTML = "";
  
  const formulario = crearElemento("form", undefined, {id: "formLibro", method: "POST", enctype:"multipart/form-data"});
  let contenedorElemForm;

  contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
  const labelNumPag = crearElemento("label", 'Numero de paginas', {for: "inputnumPaginas"});
  const inputNumPag = crearElemento("input", undefined, {type: "number", id: "inputnumPaginas", class: "form-control"});
  contenedorElemForm.appendChild(labelNumPag);
  contenedorElemForm.appendChild(inputNumPag);
  formulario.appendChild(contenedorElemForm);

  contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
  const labelStock = crearElemento("label", 'Stock', {for: "inputstock"});
  const inputStock = crearElemento("input", undefined, {type: "text", id: "inputstock", class: "form-control"});
  contenedorElemForm.appendChild(labelStock);
  contenedorElemForm.appendChild(inputStock);
  formulario.appendChild(contenedorElemForm);

  contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
  const selectLibros = crearElemento("select", undefined, { name:'tagLibro', id:"selectLibro", class:"selectpicker", "data-show-subtext":true,"data-live-search":true});

  allLibros.forEach(libro => {
      // console.log(genero)
      let opcionLibro = crearElemento("option",libro["nombre_libro"],{id: "libro_" + libro["id_libro"]});

      if (datosEjemplar && libro.id_libro === datosEjemplar.id_libro) {
        opcionLibro.setAttribute("selected", true);
    }

      selectLibros.appendChild(opcionLibro);
  });

  contenedorElemForm.appendChild(selectLibros);
  formulario.appendChild(contenedorElemForm);

  contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
  const labelFormFile = crearElemento("label", 'Elige un archivo', {for: "inputFormFile", class: "form-label"});
  const inputFormFile = crearElemento("input", undefined, {type: "file", id: "portadaEjemplar", accept:"image/*", name: "portada",class: "form-control",});
  contenedorElemForm.appendChild(labelFormFile);
  contenedorElemForm.appendChild(inputFormFile);
  formulario.appendChild(contenedorElemForm);

  contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
  const selectEditoriales = crearElemento("select", undefined, { name:'tagEditorial', id:"selectEditorial", class:"selectpicker", "data-show-subtext":true,"data-live-search":true});

  allEditoriales.forEach(editorial => {
      // console.log(genero)
      let opcionEditorial = crearElemento("option",editorial["nombre_editorial"],{id: "editorial_" + editorial["id_editorial"]});
      
        if (datosEjemplar && editorial.id_editorial === datosEjemplar.id_editorial) {
        opcionEditorial.setAttribute("selected", true);
        }

      selectEditoriales.appendChild(opcionEditorial);
  });

  contenedorElemForm.appendChild(selectEditoriales);
  formulario.appendChild(contenedorElemForm);

  contenedorElemForm = crearElemento("div", undefined, {class: "mb-3"});
  const labelObservaciones = crearElemento("label", 'Observaciones', {for: "inputObservacionesEjemplar"});
  const inputObservaciones = crearElemento("textarea", undefined, {type: "text", id: "inputObservacionesEjemplar", style:"resize: none;", class: "form-control"});
  contenedorElemForm.appendChild(labelObservaciones);
  contenedorElemForm.appendChild(inputObservaciones);
  formulario.appendChild(contenedorElemForm);

  const contenedorBtn = crearElemento("div", undefined, {class: "mb-3"});
  const btnAdd = crearElemento("input", undefined, {type: "button", value: "Añadir", id: "btnAddEjemplar", class: "btn btn-primary botonCustom"});
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

    // let formData = new FormData();

    // if(inputFormFile.files.length > 0) {
    //     formData.append('file', inputFormFile.file[0]);

    //     fetch('../../assets/php/controladorSesion.php', {
    //         method: 'POST',
    //         body: formData,
    //     })
    // }

    crearNewEjemplar(idEditorial,idLibro)
  });

  if(datosEjemplar !== null && datosEjemplar !== undefined) {
    console.log(datosEjemplar);
    inputNumPag.value = datosEjemplar.num_paginas;
    inputStock.value = datosEjemplar.stock;
    inputObservaciones.value = datosEjemplar.observaciones;

    const opcionesTitulo = selectLibros.options;
    if(datosEjemplar.id_libro === null) {

        selectLibros.selectedIndex = -1;
    } 
    else {
    for (let i = 0; i < opcionesTitulo.length; i++) {
        // Verificar si el ID de la opción coincide con el ID esperado
        if (opcionesTitulo[i].id === String('libro_'+datosEjemplar.id_libro)) {
            // Seleccionar esta opción
            opcionesTitulo[i].selected = true;
        }
    }
    }

    const opcionesEditorial = selectEditoriales.options;
    if(datosEjemplar.id_editorial === null) {

        selectEditoriales.selectedIndex = -1;
    } 
    else {
    for (let i = 0; i < opcionesEditorial.length; i++) {
        // Verificar si el ID de la opción coincide con el ID esperado
        if (opcionesEditorial[i].id === String('editorial_'+datosEjemplar.id_editorial)) {
            // Seleccionar esta opción
            opcionesEditorial[i].selected = true;
        }
    }
    }

    btnAdd.parentElement.remove();
    const contenedorBtn = crearElemento("div", undefined, {class: "mb-3"});
    const btnUpdate = crearElemento("input", undefined, {type: "button", value: "Actualizar", id: "btnUpdate", class: "btn btn-primary botonCustom"});
    contenedorBtn.appendChild(btnUpdate);
    formulario.appendChild(contenedorBtn);

    // btnUpdate.addEventListener("click", updateEjemplar);
}

$('.selectpicker').selectpicker();
}

function crearNewEjemplar(selectedLibro, selectedEditorial) {
    const numPaginas = document.querySelector("#inputnumPaginas").value;
    const stock = document.querySelector("#inputstock").value;
    const observacionesEjemplar = document.querySelector("#inputObservacionesEjemplar").value;

    const parametros = {
        newEjemplar: JSON.stringify ({
            "num_paginas": numPaginas,
            "fk_editorial": selectedEditorial,
            "fk_libro": selectedLibro,
            "stock": stock,
            "observaciones": observacionesEjemplar
        })
    }
    console.log(parametros);
    $.ajax({
        type:"POST",
        url: "../../assets/php/controladorSesion.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                console.log(respuesta);
                // window.location.href = '../html/sesion.html';
                document.querySelector("#inputnumPaginas").value = "";
                document.querySelector("#inputstock").value = "";
                document.querySelector("#inputObservacionesEjemplar").value = "";
                crearNewPortada();
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

function crearNewPortada() {
    const portadaEjemplar = document.querySelector('#portadaEjemplar');

    // console.log(portadaEjemplar);
    if (portadaEjemplar.files && portadaEjemplar.files[0]) {
        const formData = new FormData();
    
        // console.log('Archivo seleccionado:', portadaEjemplar.files[0]); 
         formData.append('portadaEjemplar', portadaEjemplar.files[0]);
        console.log(formData)
        parametros = {
         newPortada: JSON.stringify ({
            'portada': formData
        }) 
        }
        console.log(parametros);

        $.ajax({
            type:"POST",
            url: "../../assets/php/controladorSesion.php",
            data: parametros,
            success: function (respuesta) {
                // respuesta = false;
                if(respuesta) {
                    console.log('Se ha subido la imagen');
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
}

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
        updateUsuarios(datosInicioSesion.id_usuario)
    });
}

$(document).ready(function () {
    formLibro();
    formEjemplar();
});
