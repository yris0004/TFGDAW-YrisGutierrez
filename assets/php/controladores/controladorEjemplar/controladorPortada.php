<?php
include_once "../../BD.php";

$metodos = new BD();

//Controlador agregar una portada a un ejemplar
if (isset($_FILES['portadaEjemplar'])) {

    // Verificar si hubo algún error al subir el archivo
    if ($_FILES['portadaEjemplar']['error'] === UPLOAD_ERR_OK) {

        $directorioDestino = "../../../imagenes";

        // Nuevos permisos que deseas establecer (en octal)
        $nuevosPermisos = 0777;

        // Intenta cambiar los permisos
        if (chmod($directorioDestino, $nuevosPermisos)) {
            // echo "Se han cambiado los permisos de la carpeta correctamente.";
        } else {
            // echo "Hubo un error al cambiar los permisos de la carpeta.";
        }

        $permisos = fileperms($directorioDestino);

        // Comprobar los permisos
        if ($permisos !== false) {
            // echo "Los permisos de la carpeta son: " . decoct($permisos) . "\n";
            // echo "Permisos en formato octal: " . substr(sprintf('%o', $permisos), -4) . "\n";

            // Puedes realizar más acciones según los permisos obtenidos
        } else {
            // echo "Hubo un error al obtener los permisos de la carpeta.";
        }
        $nombreArchivo = $_FILES['portadaEjemplar']['name'];
        $rutaFinal = $directorioDestino . '/' . $nombreArchivo;
        // Obtener la información del archivo
        $rutaTemporal = $_FILES['portadaEjemplar']['tmp_name'];

        move_uploaded_file($rutaTemporal, $rutaFinal);
        echo json_encode($nombreArchivo);

    } else {
        // Si ocurrió algún error al subir el archivo, enviar una respuesta de error
        // echo "Error al subir el archivo: " . $_FILES['portadaEjemplar']['error'];
    }
} else {
    // Si no se recibió ningún archivo, enviar un mensaje de error
    // echo "No se recibió ningún archivo";
}

//Controlador eliminar portada 
// if (isset($_FILES['eliminarPortadaEjemplar'])) {

//     // Verificar si hubo algún error al subir el archivo
//     if ($_FILES['portadaEjemplar']['error'] === UPLOAD_ERR_OK) {

//         $directorioDestino = "../../../imagenes/";

//         // Nuevos permisos que deseas establecer (en octal)
//         $nuevosPermisos = 0777;

//         // Intenta cambiar los permisos
//         if (chmod($directorioDestino, $nuevosPermisos)) {
//             echo "Se han cambiado los permisos de la carpeta correctamente.";
//         } else {
//             echo "Hubo un error al cambiar los permisos de la carpeta.";
//         }

//         $permisos = fileperms($directorioDestino);

//         // Comprobar los permisos
//         if ($permisos !== false) {
//             echo "Los permisos de la carpeta son: " . decoct($permisos) . "\n";
//             echo "Permisos en formato octal: " . substr(sprintf('%o', $permisos), -4) . "\n";

//             // Puedes realizar más acciones según los permisos obtenidos
//         } else {
//             echo "Hubo un error al obtener los permisos de la carpeta.";
//         }
//         $nombreArchivo = $_FILES['portadaEjemplar']['name'];
//         $rutaFinal = $directorioDestino . '/' . $nombreArchivo;
//         // Obtener la información del archivo
//         $rutaTemporal = $_FILES['portadaEjemplar']['tmp_name'];

//         move_uploaded_file($rutaTemporal, $rutaFinal);

//         echo "Archivo subido correctamente";
//     } else {
//         // Si ocurrió algún error al subir el archivo, enviar una respuesta de error
//         echo "Error al subir el archivo: " . $_FILES['portadaEjemplar']['error'];
//     }
// } else {
//     // Si no se recibió ningún archivo, enviar un mensaje de error
//     // echo "No se recibió ningún archivo";
// }