<?php
session_start();
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
// header("Content-Type: application/json");

include_once "./BD.php";

$metodos = new BD();

if(isset($_POST['newUsuario'])) 
{
    // echo var_dump($_REQUEST['newUsuario']);
    $insertarUsuario = json_decode($_REQUEST['newUsuario'], true);
    // echo var_dump($insertarUsuario);
    $addUsuario = $metodos->crearUsuario($insertarUsuario);
    echo json_encode($addUsuario);
}

if(isset($_REQUEST['iniciarSesion']))
{   
    // echo var_dump($_REQUEST['iniciarSesion']);
    $iniciarSesion = json_decode($_REQUEST['iniciarSesion'], true);
    
    $respuesta = $metodos->iniciarSesion($iniciarSesion['nombre_usuario'], $iniciarSesion['password']);
    if(!$respuesta) {
    echo json_encode(false);
    }
    else {        
    $_SESSION['usuarioActivo'] = $respuesta;
    echo json_encode($respuesta);
    }
}

if(isset($_REQUEST['cerrarSesion']))
{   
    // echo var_dump($_REQUEST['cerrarSesion']);
    $_SESSION['usuarioActivo'] = "";
    session_destroy();
    echo json_encode(true);
}

if(isset($_REQUEST['sesionActiva']))
{
    $resultado = false;

    if(isset($_SESSION['usuarioActivo'])) {
        $resultado = $_SESSION['usuarioActivo'];
    }
    echo json_encode($resultado);
}

// $mierda = [true,'ygutierrez','Yris','Gutierrez','ygutierrez03@educantabria.es','hoid',true,'No hay ninguna observacion','653938570'];
// echo $metodos->crearUsuario($mierda);

// var_dump($metodos->iniciarSesion('ygutierrez', 'hoid'));
// session_destroy();

if(isset($_REQUEST['cargarTodosLibros']))
{   
    // echo var_dump($_REQUEST['cargarTodosLibros']);
    $libros = $metodos->consultaGeneralInicioUsuario('ejemplares');
    echo json_encode($libros);

    // echo var_dump($libros);
}

if(isset($_POST['newPrestamo']) && isset($_POST['newPrestamoEjemplar']))
{
    // echo var_dump($_REQUEST['newPrestamo']);
    // echo var_dump($_REQUEST['newPrestamoEjemplar']);
    $insertarPrestamo = json_decode($_REQUEST['newPrestamo'], true);
    $insertarPrestamoEjemplar = json_decode($_REQUEST['newPrestamoEjemplar'], true);
    $addPrestamo = $metodos->transaccionRegistro($insertarPrestamo,$insertarPrestamoEjemplar);
    echo json_encode($addPrestamo);
}

if(isset($_POST['newAutor'])) 
{
    // echo var_dump($_REQUEST['newAutor']);
    $insertarAutor = json_decode($_REQUEST['newAutor'], true);
    // echo var_dump($insertarUsuario);
    $addAutor = $metodos->insertarRegistro('autores', $insertarAutor);
    echo json_encode($addAutor);
}

if(isset($_POST['newGenero'])) 
{
    $insertarGenero = json_decode($_REQUEST['newGenero'], true);
    // echo var_dump($insertarUsuario);
    $addGenero = $metodos->insertarRegistro('generos', $insertarGenero);
    echo json_encode($addGenero);
}

if(isset($_POST['newEditorial'])) 
{   
    //echo var_dump($_REQUEST['newEditorial']);
    $insertarEditorial = json_decode($_REQUEST['newEditorial'], true);
    // echo var_dump($insertarUsuario);
    $addEditorial = $metodos->insertarRegistro('editoriales', $insertarEditorial);
    echo json_encode($addEditorial);
}

if(isset($_POST['allGeneros'])) 
{
    $generos = $metodos->imprimirConsultas('generos');
    echo json_encode($generos);
}

if(isset($_POST['allAutores'])) 
{
    $autores = $metodos->imprimirConsultas('autores');
    echo json_encode($autores);
}

if(isset($_POST['allEditoriales'])) 
{
    $editoriales = $metodos->imprimirConsultas('editoriales');
    echo json_encode($editoriales);
}

if(isset($_POST['allLibros'])) 
{
    $libros = $metodos->tablaLibros();
    echo json_encode($libros);
}

if(isset($_POST['allEjemplares'])) 
{
    $ejemplares = $metodos->tablaEjemplares();
    echo json_encode($ejemplares);
}

if(isset($_POST['newLibro']) && isset($_POST['newLibrosGeneros']))
{   

        echo var_dump($_REQUEST['newLibro']);
        echo var_dump($_REQUEST['newLibrosGeneros']);


    $insertarLibro = json_decode($_REQUEST['newLibro'], true);
    $insertarLibroGenero = json_decode($_REQUEST['newLibrosGeneros'], true);
    $addLibro = $metodos->transaccionLibro($insertarLibro, $insertarLibroGenero);
    echo json_encode($addLibro);
}

if(isset($_POST['updateEditorial'])) 
{   
    $actualizarEditorial = json_decode($_REQUEST['updateEditorial'], true);

    $updateEditorial = $metodos->actualizarRegistro($actualizarEditorial, 'editoriales');
    echo json_encode($updateEditorial);
}

if(isset($_POST['updateGenero'])) 
{   
    $actualizarGenero = json_decode($_REQUEST['updateGenero'], true);
    echo var_dump($actualizarGenero);
    $updateGenero = $metodos->actualizarRegistro($actualizarGenero, 'generos');
    echo json_encode($updateGenero);
}

if(isset($_POST['updateAutor'])) 
{   
    $actualizarAutor = json_decode($_REQUEST['updateAutor'], true);

    $updateAutor = $metodos->actualizarRegistro($actualizarAutor, 'autores');
    echo json_encode($updateAutor);
}

if(isset($_POST['updateAutor'])) 
{   
    $actualizarAutor = json_decode($_REQUEST['updateAutor'], true);

    $updateAutor = $metodos->actualizarRegistro($actualizarAutor, 'autores');
    echo json_encode($updateAutor);
}

if(isset($_POST['updateLibros']) && isset($_POST['updateGenerosLibros'])) 
{   
    // echo var_dump($_REQUEST['updateLibros']);
    // echo var_dump($_REQUEST['updateGenerosLibros']);

    $actualizarLibros = json_decode($_REQUEST['updateLibros'], true);
    $actualizarGenerosLibros = json_decode($_REQUEST['updateGenerosLibros'], true);

    $updateLibro = $metodos->actualizarLibro($actualizarLibros, $actualizarGenerosLibros);
    echo json_encode($updateLibro);
}

if(isset($_POST['allUsuarios'])) 
{
    $usuarios = $metodos->imprimirUsuarios();
    echo json_encode($usuarios);
}

if(isset($_POST['allPrestamos'])) 
{   
    // echo var_dump($_REQUEST['allPrestamos']);

    $idUsuario = json_decode($_REQUEST['allPrestamos'], true);

    $prestamos = $metodos->prestamosUsuarios($idUsuario);
    echo json_encode($prestamos);
}

if(isset($_POST['newEjemplar'])) 
{   
    //echo var_dump($_REQUEST['newEditorial']);
    $insertarEjemplar = json_decode($_REQUEST['newEjemplar'], true);
    // echo var_dump($insertarUsuario);
    $addEjemplar = $metodos->insertarRegistro('ejemplares', $insertarEjemplar);
    echo json_encode($addEjemplar);
}

if(isset($_FILES['portadaEjemplar'])) {

    // echo var_dump($_REQUEST['portadaEjemplar']);
    // $portada = json_decode($_REQUEST['portadaEjemplar'], true);
    // echo var_dump($_REQUEST['portadaEjemplar']);

    // $prestamos = $metodos->prestamosUsuarios($idUsuario);
    // echo json_encode($prestamos);
}

if(isset($_REQUEST['updateUsuario'])) {

    // echo var_dump($_REQUEST['updateUsuario']);    
    
    $actualizarSwitch = json_decode($_REQUEST['updateUsuario'], true);

    $updateSwitch = $metodos->actualizarRegistro($actualizarSwitch, 'usuarios');
    echo json_encode($updateSwitch);  
}

if(isset($_REQUEST['deleteEditorial'])) {
    
    $deleteEditorial = json_decode($_REQUEST['deleteEditorial'], true);

    $borrarEditorial = $metodos->borrarRegistro($deleteEditorial, 'editoriales');
    echo json_encode($borrarEditorial);  
}

if(isset($_REQUEST['deleteGenero'])) {
    
    $deleteGenero = json_decode($_REQUEST['deleteGenero'], true);

    $borrarGenero = $metodos->borrarRegistro($deleteGenero, 'generos');
    echo json_encode($borrarGenero);  
}

if(isset($_REQUEST['deleteAutor'])) {
    
    $deleteAutor = json_decode($_REQUEST['deleteAutor'], true);

    $borrarAutor = $metodos->borrarRegistro($deleteAutor, 'autores');
    echo json_encode($borrarAutor);  
}

if(isset($_REQUEST['deleteLibro'])) {
    
    $deleteLibro = json_decode($_REQUEST['deleteLibro'], true);

    $borrarLibro = $metodos->borrarRegistro($deleteLibro, 'libros');
    echo json_encode($borrarLibro);  
}

if(isset($_REQUEST['deleteEjemplar'])) {
    
    $deleteEjemplar = json_decode($_REQUEST['deleteEjemplar'], true);

    $borrarEjemplar = $metodos->borrarRegistro($deleteEjemplar, 'ejemplares');
    echo json_encode($borrarEjemplar);  
}

if(isset($_REQUEST['actualizarPaginaPerfil'])) {

    $idUsuarioActualizado = json_decode($_REQUEST['actualizarPaginaPerfil'], true);

    $obtenerUsuarioActualizado = $metodos->obtenerUsuarioActualizado($idUsuarioActualizado);
    echo json_encode($obtenerUsuarioActualizado);  
}

if(isset($_REQUEST['vaciarStock'])) {

    echo var_dump($_REQUEST['vaciarStock']);    
    
    $vaciarStock = json_decode($_REQUEST['vaciarStock'], true);

    $ejemplarNoDisponible = $metodos->actualizarRegistro($vaciarStock, 'ejemplares');
    echo json_encode($ejemplarNoDisponible);  
}

?>