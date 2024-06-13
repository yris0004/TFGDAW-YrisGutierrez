// document.addEventListener("DOMContentLoaded", function() {
//     principal();
// });

function principal() {

    document.querySelector("#iconoCatalogo").addEventListener("click", imprimirLibros);

    let parametros = {
        // Define aquí los parámetros necesarios para la solicitud AJAX
    };

    $.ajax({
        url: "../../assets/php/controladores/controladorEjemplar/controladorEjemplar.php",
        type: "POST",
        data: parametros,
        async: false,
        success: function (data) {
            if (data) {
                console.log('OK');
                AllBooks = JSON.parse(data);
            } else {
                console.log('NO OK');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
        }
    });
}

function imprimirLibros() {
    console.log('a');
}
