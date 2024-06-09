<?php
session_start();
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
// header("Content-Type: application/json");

include_once "../../BD.php";

$metodos = new BD();

//Controlador nuevo usuario
if(isset($_POST['newUsuario'])) 
{
    // echo var_dump($_REQUEST['newUsuario']);
    $insertarUsuario = json_decode($_REQUEST['newUsuario'], true);
    // echo var_dump($insertarUsuario);
    $addUsuario = $metodos->crearUsuario($insertarUsuario);
    echo json_encode($addUsuario);
}

//Controlador obtener todos los ususarios
if(isset($_POST['allUsuarios'])) 
{
    $usuarios = $metodos->imprimirUsuarios();
    echo json_encode($usuarios);
}

//Controlador actualizar usuarios
if(isset($_REQUEST['updateUsuario'])) {

    // echo var_dump($_REQUEST['updateUsuario']);    
    
    $actualizarSwitch = json_decode($_REQUEST['updateUsuario'], true);

    $updateSwitch = $metodos->actualizarRegistro($actualizarSwitch, 'usuarios');
    echo json_encode($updateSwitch);  
}

//Controlador actualizar perfil
if(isset($_REQUEST['actualizarPaginaPerfil'])) {

    $idUsuarioActualizado = json_decode($_REQUEST['actualizarPaginaPerfil'], true);

    $obtenerUsuarioActualizado = $metodos->obtenerUsuarioActualizado($idUsuarioActualizado);
    echo json_encode($obtenerUsuarioActualizado);  
}
?>