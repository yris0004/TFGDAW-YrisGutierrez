<?php
session_start();
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
// header("Content-Type: application/json");

include_once "../../BD.php";

$metodos = new BD();

//Controlador obtener todos los libros en la página de adminsitrador
if(isset($_POST['allLibros'])) 
{
    $libros = $metodos->tablaLibros();
    echo json_encode($libros);
}

//Controlador añadir nuevo libro
if(isset($_POST['newLibro']) && isset($_POST['newLibrosGeneros']))
{   
    // echo var_dump($_REQUEST['newLibro']);
    // echo var_dump($_REQUEST['newLibrosGeneros']);

    $insertarLibro = json_decode($_REQUEST['newLibro'], true);
    $insertarLibroGenero = json_decode($_REQUEST['newLibrosGeneros'], true);
    $addLibro = $metodos->transaccionLibro($insertarLibro, $insertarLibroGenero);
    echo json_encode($addLibro);
}

//Controlador actualizar libro
if(isset($_POST['updateLibros']) && isset($_POST['updateGenerosLibros'])) 
{   
    // echo var_dump($_REQUEST['updateLibros']);
    // echo var_dump($_REQUEST['updateGenerosLibros']);

    $actualizarLibros = json_decode($_REQUEST['updateLibros'], true);
    $actualizarGenerosLibros = json_decode($_REQUEST['updateGenerosLibros'], true);

    $updateLibro = $metodos->actualizarLibro($actualizarLibros, $actualizarGenerosLibros);
    echo json_encode($updateLibro);
}

//Controlador eliminar libro
if(isset($_REQUEST['deleteLibro'])) {
    
    $deleteLibro = json_decode($_REQUEST['deleteLibro'], true);

    $borrarLibro = $metodos->borrarRegistro($deleteLibro, 'libros');
    echo json_encode($borrarLibro);  
}

?>