window.addEventListener("load", principal);

//Se crean estas variables para acceder desdde cualquier punto del archivo
let AllBooks;
let fechaHoy;
let fechaDevolucionLibros;

//Se accede a la cesta almacenada en el localstorage aunque se recargue la página
let carrito = JSON.parse(localStorage.getItem('carritoLibros')) || [];

function principal() {
    document.querySelector("#cerrarSesion").addEventListener("click", cerrarSesion);
    document.querySelector("#home").addEventListener("click", volverInicio);
    document.querySelector('#iconoCarrito').addEventListener("click", imprimirCarrito);
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

    //Recorrer dicho array de objetos
    arrLibros.forEach(libro => {

        //Se crea una carta para cada imprimir cada libro
        const contenedorLibro = crearElemento("div", undefined, {
            class: "col-2 me-3 mb-5 card cartaCatalogo"
        });
        const cardImagen = crearElemento("div", undefined, {
            class: "d-flex h-100 w-100 pt-3 align-self-center cartaContendorImagen"
        });
        const cardBody = crearElemento("div", undefined, {
            class: "card-body text-center contenedorCuerpoCarta"
        });
        const vistaPrevia = crearElemento("p", "Vista previa", {
            class: "vistaPreviaCatalogo"
        });
        const botonNombreLibro = crearElemento("button", "Agregar", {
            id: libro.id_ejemplar,
            class: "botonLibroCatalogo w-100 botonCatalogo"
        });
        const enlacePortada = "../../assets/imagenes/" + libro.portada;
        const portadaLibro = crearElemento("img", undefined, {
            src: enlacePortada,
            alt: libro.portada,
            class: "card-img-top"
        })

        //Con el append se puede añadir varios elementos a la vez a un elemento padre
        cardImagen.append(portadaLibro, vistaPrevia);
        cardBody.append(botonNombreLibro);
        contenedorLibro.append(cardImagen, cardBody);
        contenedorTodosLibros.appendChild(contenedorLibro);

        //Se llama a la funcion que imprime la vista previa de cada libro
        botonNombreLibro.addEventListener("click", function () {
            infoLibro(libro);
        });
    });
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

    contenedorTodosLibros = document.querySelector('#contenedorLibros');
    contenedorTodosLibros.innerHTML = "";
    // console.log(libroSeleccionado);
    const contenedorLibro = crearElemento("div", undefined, {
        class: "row"
    });
    const contenedorCartaIzquierda = crearElemento("div", undefined, {
        class: "col-4 contenedorCartaVistaPreviaIzquierda"
    });
    const contenedorCartaDerecha = crearElemento("div", undefined, {
        class: "col-7 contenedorCartaVistaPreviaDerecho"
    });
    const titulo = crearElemento("p", libroSeleccionado.nombre_libro, {
        id: libroSeleccionado.id_ejemplar
    });
    const stock = crearElemento("p", "Quedan en stock: " + libroSeleccionado.stock);
    // console.log(portada)
    const enlacePortada = "../../assets/imagenes/" + libroSeleccionado.portada;
    const botonCarrito = crearElemento("button", "Agregar al carrito", {
        class: "btn btn-primary botonCustom",
        type: "button",
        "data-bs-toggle": "offcanvas",
        "data-bs-target": "#offcanvasRight",
        "aria-controls": "offcanvasRight",
    });
    const portadaLibro = crearElemento("img", undefined, {
        src: enlacePortada,
        alt: libroSeleccionado.portada,
        class: "img-fluid"
    });

    contenedorCartaIzquierda.appendChild(portadaLibro);
    contenedorCartaDerecha.append(titulo, stock, botonCarrito)
    contenedorLibro.append(contenedorCartaIzquierda, contenedorCartaDerecha);
    contenedorTodosLibros.appendChild(contenedorLibro);

    botonCarrito.addEventListener('click', function () {
        agregarCarrito(libroSeleccionado)
    });

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
            const item = crearElemento("div", libroCarrito.nombre_libro + ", " + libroCarrito.num_paginas);
            const borrarItem = crearElemento("button", "Borrar", {
                id: libroCarrito.id_ejemplar,
                class: "btn btn-danger"
            });

            borrarItem.addEventListener("click", function () {
                items.removeChild(item);
                carrito = carrito.filter(carritoEjemplar => carritoEjemplar.id_ejemplar !== libroCarrito.id_ejemplar);
                guardarCarritoEnLocalStorage(carrito)
                console.log("Eliminado del carrito");
                if (carrito.length === 0) {
                    mostrarMensajeCarritoVacio();
                }
            });
            bodyOffcanvas.appendChild(items);
            items.appendChild(item);
            item.appendChild(borrarItem);
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