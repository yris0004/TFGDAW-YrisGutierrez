<?php
session_start();
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
// header("Content-Type: application/json");

include_once "../BD.php";

$metodos = new BD();

//Controlador inicio sesión
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

//Controlador cerrar sesión
if(isset($_REQUEST['cerrarSesion']))
{   
    // echo var_dump($_REQUEST['cerrarSesion']);
    $_SESSION['usuarioActivo'] = "";
    session_destroy();
    echo json_encode(true);
}

?>