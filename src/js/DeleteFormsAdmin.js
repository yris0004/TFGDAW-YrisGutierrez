window.addEventListener("load",principal);

function principal() {

}

function deleteEditorial(idEditorial) {

    parametros = {
        deleteEditorial : JSON.stringify ({
            'id_editorial': idEditorial
        })
    }

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladorSesion.php",
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

function deleteGenero(idGenero) {

    parametros = {
        deleteGenero : JSON.stringify ({
            'id_genero': idGenero
        })
    }

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladorSesion.php",
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

function deleteAutor(idAutor) {
    
    parametros = {
        deleteAutor : JSON.stringify ({
            'id_autor': idAutor
        })
    }

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladorSesion.php",
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

function deleteLibro(idLibro) {
    
    parametros = {
        deleteLibro : JSON.stringify ({
            'id_Libro': idLibro
        })
    }

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladorSesion.php",
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

function deleteEjemplar(idEjemplar) {
    
    parametros = {
        deleteEjemplar : JSON.stringify ({
            'id_ejemplar': idEjemplar
        })
    }

    $.ajax({
        type:"POST",
        url: "../../assets/php/controladorSesion.php",
        data: parametros,
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                tablaEjemplares();
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