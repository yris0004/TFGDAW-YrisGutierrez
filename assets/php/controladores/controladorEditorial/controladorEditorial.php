<?php
session_start();
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
// header("Content-Type: application/json");

include_once "../../BD.php";

$metodos = new BD();

//Controlador nueva editorial
if(isset($_POST['newEditorial'])) 
{   
    //echo var_dump($_REQUEST['newEditorial']);
    $insertarEditorial = json_decode($_REQUEST['newEditorial'], true);
    // echo var_dump($insertarUsuario);
    $addEditorial = $metodos->insertarRegistro('editoriales', $insertarEditorial);
    echo json_encode($addEditorial);
}

//Controlador obtener todas las editoriales
if(isset($_POST['allEditoriales'])) 
{
    $editoriales = $metodos->imprimirConsultas('editoriales');
    echo json_encode($editoriales);
}

//Controlador actualizar editorial
if(isset($_POST['updateEditorial'])) 
{   
    $actualizarEditorial = json_decode($_REQUEST['updateEditorial'], true);

    $updateEditorial = $metodos->actualizarRegistro($actualizarEditorial, 'editoriales');
    echo json_encode($updateEditorial);
}

//Controlador eliminar editorial
if(isset($_REQUEST['deleteEditorial'])) {
    
    $deleteEditorial = json_decode($_REQUEST['deleteEditorial'], true);

    $borrarEditorial = $metodos->borrarRegistro($deleteEditorial, 'editoriales');
    echo json_encode($borrarEditorial);  
}

?>