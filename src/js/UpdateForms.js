window.addEventListener("load",principal);

function principal() {

}

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
    })
}

function updateLibro(idLibro,selectedGenerosIds, selectedAutoresIds) {

    const nombreLibro = document.querySelector('#inputNombreLibro').value;
    const sinopsisLibro = document.querySelector('#inputSinopsisLibro').value;
    const observacionesLibro = document.querySelector('#inputObservacionesLibro').value;

    // console.log(idLibro);
    // console.log(selectedGenerosIds);
    // console.log(selectedAutoresIds);

    let obtenerIdAutor = selectedAutoresIds.split('_');
    let idAutor = obtenerIdAutor[1];

    console.log(idAutor);
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

    console.log(parametros);
    console.log(parametrosGeneros);

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladorSesion.php",
        data: {
            updateLibros: JSON.stringify(parametros),
            updateGenerosLibros: JSON.stringify(parametrosGeneros)
        },
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                console.log(respuesta);
                // window.location.href = '../html/sesion.html';
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

function actualizarPaginaPerfil(idUsuario) {

    const parametros = {
        actualizarPaginaPerfil: JSON.stringify({
            "id_usuario": idUsuario,
        })
    }
    console.log(parametros)
    $.ajax({
        type:"POST",
        url: "../../assets/php/controladorSesion.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                console.log(respuesta);
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

function updateUsuarios(idUsuario) {

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
        url: "../../assets/php/controladorSesion.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                console.log(respuesta);
                actualizarPaginaPerfil(idUsuario)
                // window.location.href = '../html/sesion.html';
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