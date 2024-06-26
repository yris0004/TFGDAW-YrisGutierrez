window.addEventListener("load", principal);

//Se crean estas variables para acceder desdde cualquier punto del archivo
let AllBooks;
let fechaHoy;
let fechaDevolucionLibros;

//Se accede a la cesta almacenada en el localstorage aunque se recargue la página
let carrito = JSON.parse(localStorage.getItem('carritoLibros')) || [];

function principal() {
    document.querySelector("#cerrarSesion").addEventListener("click", cerrarSesion);
    document.querySelector("#iconoCatalogo").addEventListener("click", volverInicio);
    document.querySelector('#iconoCesta').addEventListener("click", imprimirCarrito);
    document.querySelector("#solicitarPrestamo").addEventListener("click", realizarPrestamo);

    const parametros = {
        cargarTodosLibros: JSON.stringify({
            'cargarTodosLibros': true,
        })
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

    //Se imprimen todos los libros nuevamente cada vez que se reinicia la página
    imprimirLibros(AllBooks);
    document.querySelector("#buscador").addEventListener("keyup", function () {
        filtroLibros(event, AllBooks);
    });
}

function volverInicio() {
    imprimirLibros(AllBooks);
}

function cerrarSesion(e) {
    e.preventDefault();

    const parametros = {
        cerrarSesion: JSON.stringify({
            'cerrarSesion': true
        })
    }
    $.ajax({
        url: "../../assets/php/controladores/controladorSesion.php",
        type: "POST",
        data: parametros,
        success: function (data) {
            console.log(data);
            if (data) {
                console.log('OK', data);
                //Se borran todas las variables del localstorage al cerrar sesión
                localStorage.setItem('usuarioSesion', JSON.stringify([]));
                localStorage.setItem('carritoLibros', JSON.stringify([]));
                window.location.href = '../html/sesion.html';
            } else {
                console.log('NO OK');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
        }
    });
}

//Función para crear cualquier elemento HTML
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

//Se pasa por parametro el array de objetos recibido en la consulta de todos los ejemplares al cargar la página
function imprimirLibros(arrLibros) {

    const contenedorTodosLibros = document.querySelector("#contenedorLibros");
    contenedorTodosLibros.innerHTML = "";

    const tituloSeccion = crearElemento("h1", "Catalogo de libros");
    contenedorTodosLibros.appendChild(tituloSeccion);

    const contenedorBuscador = crearElemento("div", undefined, {class:"contenedorBuscador"});
    const buscador = crearElemento("input", undefined, {
        placeholder: "Buscador",
        id: "buscador",
    });
    const iconoBuscador = crearElemento("lord-icon", undefined, {
        src:"https://cdn.lordicon.com/fkdzyfle.json",
        trigger:"hover",
        colors:"primary:#5d043f",
        style:"width:30px;height:30px"
    })
    contenedorBuscador.appendChild(iconoBuscador)
    contenedorBuscador.appendChild(buscador);
    contenedorTodosLibros.appendChild(contenedorBuscador);

    const contenedorFiltros = crearElemento("div", undefined, { class: "col-3 border border-danger contenedorFiltros" });
    const tituloFiltros = crearElemento("h3", "Filtros");

    contenedorFiltros.appendChild(tituloFiltros);
    contenedorTodosLibros.appendChild(contenedorFiltros);

    const contenedorCartaFiltros = crearElemento("div", undefined, {class: "border border-primary contenedorCartaFiltros"});
    contenedorFiltros.appendChild(contenedorCartaFiltros);

    const contenedorLibrosCatalogo = crearElemento("div", undefined, { class: "col-7 row h-100 eliminarGutter border border-warning contenedorLibros" });
    //Recorrer dicho array de objetos
    arrLibros.forEach(libro => {

        //Se crea una carta para cada imprimir cada libro
        const contenedorLibro = crearElemento("div", undefined, {
            class: "col-3 cartaCatalogo"
        });
        const contenedorImagen = crearElemento("div", undefined, {
            class: "cartaContendorImagen"
        });
        const contenedorBoton = crearElemento("div", undefined, {
            class: "contenedorBotonCarta row"
        });
        const botonNombreLibro = crearElemento("button", "Vista previa", {
            id: libro.id_ejemplar,
            class: "botonNombreLibro w-100"
        });
        const enlacePortada = "../../assets/imagenes/" + libro.portada;
        const portadaLibro = crearElemento("img", undefined, {
            src: enlacePortada,
            alt: libro.portada,
            class: "img-fluid h-100"
        })

        contenedorImagen.append(portadaLibro);
        contenedorImagen.appendChild(contenedorBoton);
        contenedorBoton.appendChild(botonNombreLibro);
        contenedorLibro.append(contenedorImagen);
        contenedorLibrosCatalogo.appendChild(contenedorLibro);
        //Se llama a la funcion que imprime la vista previa de cada libro
        botonNombreLibro.addEventListener("click", function () {
            infoLibro(libro);

        });
    });
    contenedorTodosLibros.appendChild(contenedorLibrosCatalogo);

    //         <lord-icon
    //     src="https://cdn.lordicon.com/pbrgppbb.json"
    //     trigger="hover"
    //     colors="primary:#5d043f"
    //     style="width:250px;height:250px">
    // </lord-icon>
}

//Función para buscar los libros por titulo
function filtroLibros(event, arrLibros) {

    // if(event.key === "Enter"){
    //     console.log('yris')
    const textoIntroducido = event.target.value.toLowerCase();
    console.log(textoIntroducido);

    const librosBuscados = arrLibros.filter(libro =>
        libro.nombre_libro.toLowerCase().includes(textoIntroducido)
    );
    imprimirLibros(librosBuscados)
    // }
}

//Función para mostrar una página con todos los datos sobre el libro
function infoLibro(libroSeleccionado) {

    console.log(libroSeleccionado);
    contenedorTodosLibros = document.querySelector('#contenedorLibros');
    contenedorTodosLibros.innerHTML = "";

    const contenedorTituloSeccion = crearElemento("div", undefined, { class: "d-flex justify-content-center align-items-center" });
    const tituloSeccion = crearElemento("h1", "Vista previa");

    contenedorTodosLibros.appendChild(contenedorTituloSeccion);
    contenedorTituloSeccion.appendChild(tituloSeccion);

    const contedorFilaFlecha = crearElemento("div", undefined, { class: "row w-100" });
    const contenedorVacioFilaFlecha = crearElemento("div", undefined, { class: "col-2" });
    const contenedorFlecha = crearElemento("div", undefined, { class: "col-10" });
    const iconoFlecha = crearElemento("lord-icon", undefined, {
        src: "https://cdn.lordicon.com/whtfgdfm.json",
        trigger: "hover",
        colors: "primary:#5d043f",
        style: "width:70px;height:70px",
        class: "iconoVistaPrevia",
        id: "volverCatalogo"
    });
    const Iratras = crearElemento("p", "Volver al inicio");

    contenedorTodosLibros.appendChild(contedorFilaFlecha);
    contedorFilaFlecha.appendChild(contenedorVacioFilaFlecha);
    contedorFilaFlecha.appendChild(contenedorFlecha);
    contenedorFlecha.appendChild(iconoFlecha);
    contenedorFlecha.appendChild(Iratras);

    const contenedorVistaPrevia = crearElemento("div", undefined, { class: "row contenedorVistaPrevia" });
    const contenedorVistaPreviaVacio = crearElemento("div", undefined, { class: "col-3" });
    const contenedorInfoImagen = crearElemento("div", undefined, { class: "col-3 contenedorInfoImagen eliminarGutter" });
    const contenedorVistaPreviaImagen = crearElemento("div", undefined, { class: "contenedorVistaPreviaImagen" });
    const imagenVistaPrevia = crearElemento("img", undefined, { src: "../../assets/imagenes/" + libroSeleccionado.portada });

    contenedorTodosLibros.appendChild(contenedorVistaPrevia);
    contenedorVistaPrevia.appendChild(contenedorVistaPreviaVacio);
    contenedorVistaPrevia.appendChild(contenedorInfoImagen);
    contenedorInfoImagen.appendChild(contenedorVistaPreviaImagen);
    contenedorVistaPreviaImagen.appendChild(imagenVistaPrevia);

    const contenedorInfoLibro = crearElemento("div", undefined, { class: "col-4 row contenedorInfoLibro eliminarGutter" });
    const contenidoInfoLibro = crearElemento("div", undefined);
    const titulo = crearElemento("p", "Titulo: " + libroSeleccionado.nombre_libro);
    const autor = crearElemento("p", "Autor: " + libroSeleccionado.nombre_autor + " " + libroSeleccionado.apellidos_autor);
    const generos = crearElemento("p", "Géneros: " + libroSeleccionado.generos_asociados);
    const editorial = crearElemento("p", "Editorial: " + libroSeleccionado.nombre_editorial);
    const pagNumero = crearElemento("p", "Número de páginas: " + libroSeleccionado.num_paginas);
    const pais = crearElemento("p", "Pais: " + libroSeleccionado.pais_autor);
    const stock = crearElemento("p", "Stock: " + libroSeleccionado.stock);

    const botonCarrito = crearElemento("input", undefined, {
        class: "w-100 botonCustom mb-3",
        value: "Añadir a la cesta", type: "button",
        "data-bs-toggle": "offcanvas",
        "data-bs-target": "#offcanvasRight",
        "aria-controls": "offcanvasRight",
    });

    contenedorVistaPrevia.appendChild(contenedorInfoLibro);
    contenedorInfoLibro.appendChild(contenidoInfoLibro);
    contenidoInfoLibro.append(titulo, autor, generos, editorial, pagNumero, pais, stock);
    contenidoInfoLibro.appendChild(botonCarrito);

    const contenedorAcordeon = crearElemento("div", undefined, { class: "accordion", id: "acordeonVistaPrevia" });
    const acordeonItem = crearElemento("div", undefined, { class: "accordion-item" });
    const acordeonHeader = crearElemento("h2", undefined, { class: "accordion-header", id: "headingOne" });
    const botonSinopsis = crearElemento("button", "Sinopsis", {
        class: "accordion-button",
        type: "button",
        "data-bs-toggle": "collapse",
        "data-bs-target": "#collapseOne",
        "aria-expanded": "true",
        "aria-controls": "collapseOne"
    });
    const collapseOne = crearElemento("div", undefined, {
        id: "collapseOne",
        class: "accordion-collapse collapse show",
        "aria-labelledby": "headingOne",
        "data-bs-parent": "#acordeonVistaPrevia"
    });
    const acordeonBody = crearElemento("div", undefined, { class: "accordion-body" });
    const contenidoAcordeon = crearElemento("div", libroSeleccionado.sinopsis, { class: "overflow-auto", style: "max-height: 300px;" });

    acordeonBody.appendChild(contenidoAcordeon);
    collapseOne.appendChild(acordeonBody);

    contenidoInfoLibro.appendChild(contenedorAcordeon);
    contenedorAcordeon.appendChild(acordeonItem);
    acordeonItem.appendChild(acordeonHeader);
    acordeonItem.appendChild(botonSinopsis);
    acordeonItem.appendChild(collapseOne);

    const acordeonItemSegundo = crearElemento("div", undefined, { class: "accordion-item" });
    const acordeonHeaderEnvio = crearElemento("h2", undefined, { class: "accordion-header", id: "headingTwo" });
    const botonEnvio = crearElemento("button", "Condiciones de envío", {
        class: "accordion-button collapsed",
        type: "button",
        "data-bs-toggle": "collapse",
        "data-bs-target": "#collapseTwo",
        "aria-expanded": "false",
        "aria-controls": "collapseTwo"
    })
    const collapseTwo = crearElemento("div", undefined, {
        id: "collapseTwo",
        class: "accordion-collapse collapse",
        "aria-labelledby": "headingTwo",
        "data-bs-parent": "#acordeonVistaPrevia"
    });
    const acordeonBodySegundo = crearElemento("div", "El préstamo de libros en nuestra biblioteca tiene una duración máxima de cuatro semanas. Es fundamental que los libros sean devueltos en el mismo estado en que fueron prestados para mantener la integridad de nuestra colección. Además, se aplican multas por retraso en la devolución.", { class: "accordion-body" });

    collapseTwo.appendChild(acordeonBodySegundo);

    contenedorAcordeon.appendChild(acordeonItemSegundo);
    acordeonItemSegundo.appendChild(acordeonHeaderEnvio);
    acordeonItemSegundo.appendChild(botonEnvio);
    acordeonItemSegundo.appendChild(collapseTwo);

    botonCarrito.addEventListener('click', function () {
        agregarCarrito(libroSeleccionado)
    });

    iconoFlecha.addEventListener("click", volverInicio);

}

//Guardar los datos actualizados en el localstorage
function guardarCarritoEnLocalStorage(carritoLibros) {
    localStorage.setItem('carritoLibros', JSON.stringify(carritoLibros));
}

//Se recogen los datos del localstorage para guardarlos en la cesta
function mostrarCarritoEnLocalStorage() {
    carrito = JSON.parse(localStorage.getItem('carritoLibros')) || [];
}

//En caso de que la ceste esté vacía
function mostrarMensajeCarritoVacio() {

    const bodyOffcanvas = document.querySelector('#bodyOffcanvas');
    bodyOffcanvas.innerHTML = "";

    if (carrito.length === 0) {
        const items = crearElemento("ul", undefined, { id: "items" });
        const carritoVacio = crearElemento("div", "Tu cesta está vacía");
        bodyOffcanvas.appendChild(items);
        items.appendChild(carritoVacio);
        // console.log("cesta vacia");
    }
}

//Se imprime la cesta 
function imprimirCarrito() {

    const bodyOffcanvas = document.querySelector('#bodyOffcanvas');
    bodyOffcanvas.innerHTML = "";

    const items = crearElemento("div", undefined, { id: "items" });

    if (carrito.length === 0) {
        mostrarMensajeCarritoVacio();
    }
    else {
        carrito.forEach(libroCarrito => {

            const filaElemento = crearElemento("div", undefined, { class: "row eliminarGutter fondoFilaCesta mb-4" });
            const contenedorImagenElemento = crearElemento("div", undefined, { class: "col-4 contenedorIzquierdoCesta" });
            const imagen = crearElemento("img", undefined, { class: "h-75 img-fluid", src: "../../assets/imagenes/" + libroCarrito.portada });

            const contenedorInfoElemento = crearElemento("div", undefined, { class: "col-8 contenedorDerechoCesta" });
            const borrarItem = crearElemento("lord-icon", undefined, {
                src: "https://cdn.lordicon.com/zxvuvcnc.json",
                id: libroCarrito.id_ejemplar,
                class: "iconoCestaBorrar",
                trigger: "hover",
                colors: "primary:#e83a30",
            });

            borrarItem.addEventListener("click", function () {
                items.removeChild(filaElemento);
                carrito = carrito.filter(carritoEjemplar => carritoEjemplar.id_ejemplar !== libroCarrito.id_ejemplar);
                guardarCarritoEnLocalStorage(carrito)
                // console.log("Eliminado del carrito");
                if (carrito.length === 0) {
                    mostrarMensajeCarritoVacio();
                }
            });
            bodyOffcanvas.appendChild(items);
            items.appendChild(filaElemento);
            filaElemento.appendChild(contenedorImagenElemento);
            contenedorImagenElemento.appendChild(imagen);
            filaElemento.appendChild(contenedorInfoElemento);
            contenedorInfoElemento.appendChild(borrarItem);
        });
        const contendorBotonComprar = crearElemento("div", undefined, { id: "contendorBotonComprar", class: "mt-auto p-2" });
        //Es necesario crear un boton oculto para hacer poder cerrar el offCanvas y abrir el modal
        const botonComprar = crearElemento("button", "Pedir prestamo", { id: "botonComprar", class: "btn btn-primary", "data-bs-toggle": "modal", "data-bs-target": "#staticBackdrop" });
        const botonOculto = crearElemento("button", undefined, { id: "botonOcultoCerrarOffcanvas", class: "btn btn-primary", "data-bs-toggle": "offcanvas", "data-bs-target": "#offcanvasRight", "aria-controls": "offcanvasRight" });
        botonComprar.appendChild(botonOculto);
        bodyOffcanvas.appendChild(contendorBotonComprar);
        contendorBotonComprar.appendChild(botonComprar);

        botonComprar.addEventListener("click", modalPedirPrestamo);
    }
}

//Se recogen los datos guardados en el localstorage y se agrega el seleccionado 
function agregarCarrito(libro) {

    mostrarCarritoEnLocalStorage();
    if (!carrito.find(item => item.id_ejemplar === libro.id_ejemplar)) {
        // console.log("añadido");
        carrito.push(libro)
        guardarCarritoEnLocalStorage(carrito);
    }
    else {
        console.log("Ya esta ese libro agregado");
    }
    imprimirCarrito();
}

//Aparece un modal de confirmación del préstamo junto con otros datos relevantes como la fecha de devolución
function modalPedirPrestamo() {
    const contenedorSlide = document.querySelector("#contenedorSlide");
    contenedorSlide.innerHTML = "";

    //Slide de los libros seleccionados
    carrito.forEach((libro, index) => {

        const enlacePortada = "../../assets/imagenes/" + libro.portada;

        const slideLibros = crearElemento("div", undefined, { class: `carousel-item ${index === 0 ? "active" : ""}`, "data-bs-interval": "3000" });
        const slidePortadaLibro = crearElemento("img", undefined, { class: "d-block w-100", src: enlacePortada });

        contenedorSlide.appendChild(slideLibros);
        slideLibros.appendChild(slidePortadaLibro);

    });

    //Calcurar fecha de devolución
    const contenedorPlazoPrestamo = document.querySelector("#contenedorPlazoPrestamo");
    contenedorPlazoPrestamo.innerHTML = "";
    //Primero se calcula la fecha actual
    const hoy = new Date();

    const diaHoy = String(hoy.getDate()).padStart(2, '0');
    const mesHoy = String(hoy.getMonth() + 1).padStart(2, '0');
    const yearHoy = hoy.getFullYear();

    fechaHoy = yearHoy + "-" + mesHoy + "-" + diaHoy;
    // console.log(fechaHoy);

    const fechaDevolucion = new Date();
    //Por cada ejemplar solicitado se suman 7 días a la fecha limite
    fechaDevolucion.setDate(fechaDevolucion.getDate() + carrito.length * 7);

    const diaDevolucion = String(fechaDevolucion.getDate()).padStart(2, '0');
    const mesDevolucion = String(fechaDevolucion.getMonth() + 1).padStart(2, '0');
    const yearDevolucion = fechaDevolucion.getFullYear();

    fechaDevolucionLibros = yearDevolucion + "-" + mesDevolucion + "-" + diaDevolucion;
    // console.log(fechaDevolucionLibros);

    const contenedorFechaDevolucion = crearElemento("div", fechaDevolucionLibros);
    contenedorPlazoPrestamo.appendChild(contenedorFechaDevolucion);

}

//Función para realizar el ajax de añadir préstamo
function realizarPrestamo() {

    const observaciones = document.getElementById('observacionesPrestamo').value;
    //Se recogen los datos del usuario almacenados en el localstorage de la sesión para acceder al id
    const usuarioSesion = JSON.parse(localStorage.getItem('usuarioSesion'));

    //Primer array enviado en la petición
    let parametros = {
        fecha_salida: fechaHoy,
        fecha_devolucion: fechaDevolucionLibros,
        fk_usuario: usuarioSesion.id_usuario,
        observaciones: observaciones,
    }

    //Segundo array enviado en la petición con los id de cada ejemplar seleccionado
    let parametrosEjemplares = carrito.map(libroCarrito => {
        return { fk_ejemplar: libroCarrito.id_ejemplar };
    });

    $.ajax({
        type: "POST",
        url: "../../assets/php/controladores/controladorPrestamo/controladorPrestamo.php",
        data: {
            newPrestamo: JSON.stringify(parametros),
            newPrestamoEjemplar: JSON.stringify(parametrosEjemplares)
        },
        success: function (respuesta) {
            // respuesta = false;
            if (respuesta) {
                console.log(respuesta);
                console.log("hecho");

                Swal.fire({
                    icon: "success",
                    title: "Se ha realizado el pedido con éxito",
                    showConfirmButton: false,
                    timer: 1500
                });

                setTimeout(() => {
                    window.location.href = '../../index.html'
                }, 1500);

                //Se vacía la cesta una vez se realice el préstamo
                carrito = [];
                guardarCarritoEnLocalStorage(carrito);
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Vaya... :(",
                    text: "Algo ha salido mal",
                });
            }
        },
        error: function (a, b, errorMsg) {
            console.log(errorMsg);
        }

    });

}