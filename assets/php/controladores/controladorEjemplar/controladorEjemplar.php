<?php
session_start();
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
// header("Content-Type: application/json");

include_once "../../BD.php";

$metodos = new BD();

//Controlador obtener todos los ejemplares en la página de usuario
if(isset($_REQUEST['cargarTodosLibros']))
{   
    // echo var_dump($_REQUEST['cargarTodosLibros']);
    $libros = $metodos->consultaGeneralInicioUsuario('ejemplares');
    echo json_encode($libros);

    // echo var_dump($libros);
}

//Controlador obtener todos los ejemplares
if(isset($_POST['allEjemplares'])) 
{
    $ejemplares = $metodos->tablaEjemplares();
    echo json_encode($ejemplares);
}

//Controlador agregar un nuevo ejemplar
if(isset($_POST['newEjemplar'])) 
{   
    //echo var_dump($_REQUEST['newEditorial']);
    $insertarEjemplar = json_decode($_REQUEST['newEjemplar'], true);
    // echo var_dump($insertarUsuario);
    $addEjemplar = $metodos->insertarRegistro('ejemplares', $insertarEjemplar);
    echo json_encode($addEjemplar);
}

//Controlador eliminar ejemplar
if(isset($_REQUEST['deleteEjemplar'])) {
    
    $deleteEjemplar = json_decode($_REQUEST['deleteEjemplar'], true);

    $borrarEjemplar = $metodos->borrarRegistro($deleteEjemplar, 'ejemplares');
    echo json_encode($borrarEjemplar);  
}

//Controlador vaciar stock del ejemplar
if(isset($_REQUEST['vaciarStock'])) {

    echo var_dump($_REQUEST['vaciarStock']);    
    
    $vaciarStock = json_decode($_REQUEST['vaciarStock'], true);

    $ejemplarNoDisponible = $metodos->actualizarRegistro($vaciarStock, 'ejemplares');
    echo json_encode($ejemplarNoDisponible);  
}


?>