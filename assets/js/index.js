window.addEventListener("load", principal);

function principal() {

    const iconCesta = document.querySelector('#iconoCesta');
    const iconoUsuario = document.querySelector('#iconoUsuario')

    // Obtener el objeto almacenado en localStorage
    const userInicioSesion = JSON.parse(localStorage.getItem('usuarioSesion'));

    // Verificar si el objeto se ha obtenido correctamente
    console.log(userInicioSesion);

    // Verificar si el usuario ha iniciado sesión
    if (!userInicioSesion.id_usuario) {
        console.log('mondongo');
        iconCesta.addEventListener("click", function () {
            window.location.href = './src/html/sesion.html';
        });
        iconoUsuario.addEventListener("click", function () {
            window.location.href = './src/html/sesion.html';
        });
    } else {
        console.log('Hay sesion');
        // iconCesta.addEventListener("click", function () {

        // });
        iconoUsuario.addEventListener("click", function () {
            window.location.href = './src/html/InicioUsuario.html';
        });
    }
}

window.addEventListener('scroll', function () {

    const footer = document.querySelector('#footerCustom');
    const header = document.getElementById('headerCustom');
    const usuario = document.querySelector('#iconoUsuario');
    const cesta = document.querySelector('#iconoCesta');
    const catalogo = document.querySelector('#iconoCatalogo');
    const home = document.querySelector('#iconoHome');

    //Cantidad de píxeles que el documento ha sido desplazado verticalmente
    const scrollY = window.scrollY;
    //La altura total del documento incluyendo el área no visible
    const scrollHeight = document.documentElement.scrollHeight;
    //La altura del área visible del documento en la ventana del navegador
    const clientHeight = document.documentElement.clientHeight;

    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        usuario.src = "assets/imagenes/iconos/iconoUsuarioGeneral.png";
        cesta.src = "assets/imagenes/iconos/iconoCestaGeneral.png";
        catalogo.src = "assets/imagenes/iconos/iconoCatalogoGeneral.png";
        home.src = "assets/imagenes/iconos/iconoHomeGeneral.png";

        usuario.parentNode.classList.add('iconoHeaderMorado');
        cesta.parentNode.classList.add('iconoHeaderMorado');
        catalogo.parentNode.classList.add('iconoHeaderMorado');
        home.parentNode.classList.add('iconoHeaderMorado');

        usuario.parentNode.classList.remove('iconoHeader');
        cesta.parentNode.classList.remove('iconoHeader');
        catalogo.parentNode.classList.remove('iconoHeader');
        home.parentNode.classList.remove('iconoHeader');
    } else {
        header.classList.remove('scrolled');
        usuario.src = "assets/imagenes/iconos/usuarioIndex.png";
        cesta.src = "assets/imagenes/iconos/cestaIndex.png";
        catalogo.src = "assets/imagenes/iconos/catalogoIndex.png";
        home.src = "assets/imagenes/iconos/homeIndex.png";

        usuario.parentNode.classList.remove('iconoHeaderMorado');
        cesta.parentNode.classList.remove('iconoHeaderMorado');
        catalogo.parentNode.classList.remove('iconoHeaderMorado');
        home.parentNode.classList.remove('iconoHeaderMorado');

        usuario.parentNode.classList.add('iconoHeader');
        cesta.parentNode.classList.add('iconoHeader');
        catalogo.parentNode.classList.add('iconoHeader');
        home.parentNode.classList.add('iconoHeader');
    }

    if (scrollY + clientHeight >= scrollHeight) {
        footer.classList.add('scrolledFinal');
    } else {
        footer.classList.remove('scrolledFinal');
    }
});

