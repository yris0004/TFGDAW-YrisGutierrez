<?php
session_start();
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
// header("Content-Type: application/json");

include_once "../../BD.php";

$metodos = new BD();

//Controlador añadir nuevo genero
if(isset($_POST['newGenero'])) 
{
    $insertarGenero = json_decode($_REQUEST['newGenero'], true);
    // echo var_dump($insertarUsuario);
    $addGenero = $metodos->insertarRegistro('generos', $insertarGenero);
    echo json_encode($addGenero);
}

//Controlador obtener todos los generos
if(isset($_POST['allGeneros'])) 
{
    $generos = $metodos->imprimirConsultas('generos');
    echo json_encode($generos);
}

//Controlador actualizar genero
if(isset($_POST['updateGenero'])) 
{   
    $actualizarGenero = json_decode($_REQUEST['updateGenero'], true);
    echo var_dump($actualizarGenero);
    $updateGenero = $metodos->actualizarRegistro($actualizarGenero, 'generos');
    echo json_encode($updateGenero);
}

//Controlador borrar genero
if(isset($_REQUEST['deleteGenero'])) {
    
    $deleteGenero = json_decode($_REQUEST['deleteGenero'], true);

    $borrarGenero = $metodos->borrarRegistro($deleteGenero, 'generos');
    echo json_encode($borrarGenero);  
}

?>