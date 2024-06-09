<?php
session_start();
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
// header("Content-Type: application/json");

include_once "../../BD.php";

$metodos = new BD();

//Controlador nuevo autor
if(isset($_POST['newAutor'])) 
{
    // echo var_dump($_REQUEST['newAutor']);
    $insertarAutor = json_decode($_REQUEST['newAutor'], true);
    // echo var_dump($insertarUsuario);
    $addAutor = $metodos->insertarRegistro('autores', $insertarAutor);
    echo json_encode($addAutor);
}

//Controlador obtener todos los autores
if(isset($_POST['allAutores'])) 
{
    $autores = $metodos->imprimirConsultas('autores');
    echo json_encode($autores);
}

//Controlador actualizar autor
if(isset($_POST['updateAutor'])) 
{   
    $actualizarAutor = json_decode($_REQUEST['updateAutor'], true);

    $updateAutor = $metodos->actualizarRegistro($actualizarAutor, 'autores');
    echo json_encode($updateAutor);
}

//Controlador eliminar autor
if(isset($_REQUEST['deleteAutor'])) {
    
    $deleteAutor = json_decode($_REQUEST['deleteAutor'], true);

    $borrarAutor = $metodos->borrarRegistro($deleteAutor, 'autores');
    echo json_encode($borrarAutor);  
}

?>