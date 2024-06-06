window.addEventListener("load",principal);

let AllBooks;
let carrito = JSON.parse(localStorage.getItem('carritoLibros')) || [];
let fechaHoy;
let fechaDevolucionLibros;

function principal() {

    document.querySelector("#cerrarSesion").addEventListener("click", cerrarSesion);
    document.querySelector("#home").addEventListener("click", volverInicio);
    document.querySelector('#iconoCarrito').addEventListener("click",imprimirCarrito);
    document.querySelector("#solicitarPrestamo").addEventListener("click", realizarPrestamo);

    const parametros = {
        cargarTodosLibros: JSON.stringify({
            'cargarTodosLibros': true,
        })
    };

    // console.log(parametros);
    
    $.ajax({
        url: "../../assets/php/controladorSesion.php",
        type: "POST",
        data: parametros,
        async: false,
        success: function(data) {
            if (data) {
                console.log('OK');
                AllBooks = JSON.parse(data);
                console.log(AllBooks);
                // imprimirLibros(AllBooks);
                // console.log(typeof(AllBooks));
            } else {
                console.log('NO OK');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
        }
    });

    imprimirLibros(AllBooks);
    document.querySelector("#buscador").addEventListener("keyup", function () {
        filtroLibros(event, AllBooks);
    });
    // console.log(AllBooks);
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

    // console.log(parametros);
    $.ajax({
        url: "../../assets/php/controladorSesion.php",
        type: "POST",
        data: parametros,
        success: function(data) {
            console.log(data);
            if (data) {
                console.log('OK', data);
                localStorage.setItem('usuarioSesion', JSON.stringify([]));
                window.location.href = '../html/sesion.html';
            } else {
                console.log('NO OK');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud AJAX: " + textStatus, errorThrown);
        }
    });
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

function imprimirLibros(arrLibros) {

    const contenedorTodosLibros = document.querySelector("#contenedorLibros");
    contenedorTodosLibros.innerHTML = "";
    // let nombresLibrosExistentes = new Map();
    
    arrLibros.forEach(libro => {
        // const key = `${libro.nombre_libro}-${libro.fk_editorial}`;
        
        // if(!nombresLibrosExistentes.has(key)) {
        //     nombresLibrosExistentes.set(key,true);

            const contenedorLibro = crearElemento("div",undefined,{
                class:"col-12 col-sm-6 col-md-3"
            });

            const botonNombreLibro = crearElemento("button",libro.nombre_libro,{
                id: libro.id_ejemplar
            });

            // console.log(portada)
            const enlacePortada = "../../assets/imagenes/" + libro.portada;
            
            const portadaLibro = crearElemento("img",undefined,{
                src: enlacePortada,
                alt: libro.portada,
                class: "w-100"
            })
            // console.log(enlacePortada);
            // console.log(libro);
            
            contenedorTodosLibros.appendChild(contenedorLibro);
            contenedorLibro.appendChild(portadaLibro);
            contenedorLibro.appendChild(botonNombreLibro);

            botonNombreLibro.addEventListener("click", function(event) {
                infoLibro(libro);
            });
        
    });
}

function filtroLibros(event, arrLibros)
{    

    // if(event.key === "Enter"){
    //     console.log('yris')
        const textoIntroducido = event.target.value.toLowerCase();
        console.log(textoIntroducido);

        const librosBuscados = arrLibros.filter(libro =>
            libro.nombre_libro.toLowerCase().includes(textoIntroducido)
        );

        console.log(librosBuscados);
        imprimirLibros(librosBuscados)
    // }
}

function infoLibro(libroSeleccionado){

    contenedorTodosLibros = document.querySelector('#contenedorLibros');
    contenedorTodosLibros.innerHTML = "";
    // console.log(libroSeleccionado);
    const contenedorLibro = crearElemento("div", undefined);
    const titulo = crearElemento("p",libroSeleccionado.nombre_libro,{
        id: libroSeleccionado.id_ejemplar
    });

    const stock = crearElemento("p", "Quedan en stock: " + libroSeleccionado.stock);
    // console.log(portada)
    const enlacePortada = "../../assets/imagenes/" + libroSeleccionado.portada;
    const botonCarrito = crearElemento("button", "Agregar al carrito",{
        class:"btn btn-primary",
        type:"button",
        "data-bs-toggle":"offcanvas",
        "data-bs-target":"#offcanvasRight", 
        "aria-controls":"offcanvasRight",
    });
    const portadaLibro = crearElemento("img",undefined,{
        src: enlacePortada,
        alt: libroSeleccionado.portada,
    });
    contenedorTodosLibros.appendChild(contenedorLibro);
    contenedorLibro.appendChild(portadaLibro);
    contenedorLibro.appendChild(titulo);
    contenedorLibro.appendChild(stock);
    contenedorLibro.appendChild(botonCarrito);

    botonCarrito.addEventListener('click', function (){
        agregarCarrito(libroSeleccionado)
    });

}

function guardarCarritoEnLocalStorage(carritoLibros) {
    localStorage.setItem('carritoLibros', JSON.stringify(carritoLibros));
}

function mostrarCarritoEnLocalStorage(){
    carrito = JSON.parse(localStorage.getItem('carritoLibros')) || [];
    console.log(carrito);
}

function mostrarMensajeCarritoVacio() {
    
    const bodyOffcanvas = document.querySelector('#bodyOffcanvas');
    bodyOffcanvas.innerHTML = "";
    
    if(carrito.length === 0) {

        const items = crearElemento("ul",undefined,{id:"items"});
        const carritoVacio = crearElemento("div","Tu cesta está vacía");
        bodyOffcanvas.appendChild(items);
        items.appendChild(carritoVacio);
        console.log("cesta vacia");
    }
}

function imprimirCarrito() {

    const bodyOffcanvas = document.querySelector('#bodyOffcanvas');
    bodyOffcanvas.innerHTML = "";

    const items = crearElemento("div",undefined,{id:"items"});

    if(carrito.length === 0) {
        mostrarMensajeCarritoVacio();
    }
    else {
        carrito.forEach(libroCarrito => {
            const item = crearElemento("div",libroCarrito.nombre_libro+", "+libroCarrito.num_paginas);
            const borrarItem = crearElemento("button", "Borrar", {
                id: libroCarrito.id_ejemplar,
                class: "btn btn-danger"
            });

            borrarItem.addEventListener("click", function() {
                items.removeChild(item);
                carrito = carrito.filter(carritoEjemplar => carritoEjemplar.id_ejemplar !== libroCarrito.id_ejemplar);
                guardarCarritoEnLocalStorage(carrito)
                console.log("Eliminado del carrito");
                if(carrito.length === 0) {
                    mostrarMensajeCarritoVacio();
                }
            });
            bodyOffcanvas.appendChild(items);
            items.appendChild(item);
            item.appendChild(borrarItem);
        });
        const contendorBotonComprar = crearElemento("div",undefined,{id:"contendorBotonComprar", class:"mt-auto p-2"});
        //Es necesario crear un boton oculto para hacer poder hacer que el offCanvas se 
        const botonComprar = crearElemento("button", "Pedir prestamo", {id:"botonComprar", class: "btn btn-primary", "data-bs-toggle":"modal", "data-bs-target":"#staticBackdrop"});
        const botonOculto = crearElemento("button",undefined, {id:"botonOcultoCerrarOffcanvas", class: "btn btn-primary", "data-bs-toggle":"offcanvas", "data-bs-target":"#offcanvasRight", "aria-controls":"offcanvasRight"});
        botonComprar.appendChild(botonOculto);
        bodyOffcanvas.appendChild(contendorBotonComprar);
        contendorBotonComprar.appendChild(botonComprar);

        botonComprar.addEventListener("click", modalPedirPrestamo);
    }
}

function agregarCarrito(libro) {
    // console.log(libro);
    mostrarCarritoEnLocalStorage();
    if(!carrito.find(item => item.id_ejemplar === libro.id_ejemplar)) {
    console.log("añadido");
    carrito.push(libro)
    guardarCarritoEnLocalStorage(carrito);
    } 
    else {
        console.log("Ya esta ese libro agregado");
    }
    imprimirCarrito();
}

function modalPedirPrestamo() {
    const contenedorSlide = document.querySelector("#contenedorSlide");
    contenedorSlide.innerHTML = "";

    carrito.forEach((libro, index) => {
        
        const enlacePortada = "../../assets/imagenes/" + libro.portada;
            
        const slideLibros = crearElemento("div", undefined, {class:`carousel-item ${index === 0 ? "active" : ""}`, "data-bs-interval":"3000"});
        const slidePortadaLibro = crearElemento("img",undefined,{class:"d-block w-100", src: enlacePortada}); 
        
        contenedorSlide.appendChild(slideLibros);
        slideLibros.appendChild(slidePortadaLibro);
        
    });

    const contenedorPlazoPrestamo = document.querySelector("#contenedorPlazoPrestamo");
    contenedorPlazoPrestamo.innerHTML = "";
    const hoy = new Date();

    const diaHoy = String(hoy.getDate()).padStart(2,'0');    
    const mesHoy = String(hoy.getMonth() + 1).padStart(2, '0');
    const yearHoy = hoy.getFullYear();
    
    fechaHoy = yearHoy+"-"+mesHoy+"-"+diaHoy;
    console.log(fechaHoy);  

    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(fechaDevolucion.getDate() + carrito.length * 7);

    const diaDevolucion = String(fechaDevolucion.getDate()).padStart(2,'0');
    const mesDevolucion = String(fechaDevolucion.getMonth() +1).padStart(2, '0');
    const yearDevolucion = fechaDevolucion.getFullYear();

    fechaDevolucionLibros = yearDevolucion+"-"+mesDevolucion+"-"+diaDevolucion;
    console.log(fechaDevolucionLibros);
    
    const contenedorFechaDevolucion = crearElemento("div",fechaDevolucionLibros);
    contenedorPlazoPrestamo.appendChild(contenedorFechaDevolucion);
    
}

function realizarPrestamo() {

    const observaciones = document.getElementById('observacionesPrestamo').value;
    const usuarioSesion = JSON.parse(localStorage.getItem('usuarioSesion'));

    let parametros = {
           fecha_salida: fechaHoy,
           fecha_devolucion: fechaDevolucionLibros,
           fk_usuario: usuarioSesion.id_usuario,
           observaciones: observaciones,
    }

    let parametrosEjemplares = carrito.map(libroCarrito => {
        return {fk_ejemplar: libroCarrito.id_ejemplar};
    });

    $.ajax({
        type: "POST",
        url: "../../assets/php/controladorSesion.php",
        data: {
            newPrestamo: JSON.stringify(parametros),
            newPrestamoEjemplar: JSON.stringify(parametrosEjemplares)
        },
        success: function (respuesta) {
            // respuesta = false;
            if(respuesta) {
                console.log(respuesta);
                console.log("hecho");

                Swal.fire({
                    icon: "success",
                    title: "Se ha realizado el pedido con éxito",
                    showConfirmButton: false,
                    timer: 1500
                });

                setTimeout(() => {
                    window.location.href = '../html/Home.html'
                    // imprimirLibros(AllBooks);
                } ,1500);

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
        error: function(a,b,errorMsg) {
            console.log(errorMsg);
        }

    });
 
}