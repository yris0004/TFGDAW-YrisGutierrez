<?php
session_start();
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
// header("Content-Type: application/json");

include_once "../../BD.php";

$metodos = new BD();

//Controlador nuevo prestamo
if(isset($_POST['newPrestamo']) && isset($_POST['newPrestamoEjemplar']))
{
    // echo var_dump($_REQUEST['newPrestamo']);
    // echo var_dump($_REQUEST['newPrestamoEjemplar']);
    $insertarPrestamo = json_decode($_REQUEST['newPrestamo'], true);
    $insertarPrestamoEjemplar = json_decode($_REQUEST['newPrestamoEjemplar'], true);
    $addPrestamo = $metodos->transaccionRegistro($insertarPrestamo,$insertarPrestamoEjemplar);
    echo json_encode($addPrestamo);
}

//Controlador obtener todos los prestamos
if(isset($_POST['allPrestamos'])) 
{   
    // echo var_dump($_REQUEST['allPrestamos']);

    $idUsuario = json_decode($_REQUEST['allPrestamos'], true);

    $prestamos = $metodos->prestamosUsuarios($idUsuario);
    echo json_encode($prestamos);
}

?>