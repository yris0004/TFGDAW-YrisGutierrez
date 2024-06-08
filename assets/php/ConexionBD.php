<?php

//Esta clase se encarga de establecer una conexión con una base de datos utilizando PDO.

class ConexionBD
{   
    // Propiedades privadas para almacenar la información de la conexión a la base de datos
    private $servidor= "localhost";
    private $baseDatos= "biblioteca";
    private $usuario= "yris";
    private $password= "0000";
    // Propiedad protegida para almacenar la conexión establecida
    protected $conexion; 

    //Inicializa la conexión a la base de datos al crear una instancia de la clase.
    public function __construct() {
        $this->conexion = $this->conexionBD();
    }

    public function conexionBD()
    {
        $resultado = false;
        try {
            //Se crea una instancia PDO con la información de conexión 
            $conexion = new PDO('mysql:host=' . $this->servidor . ';dbname='. $this->baseDatos, $this->usuario, $this->password);

            $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            //Si la conexión es exitosa se alamacena la instancia en la variable resultado
            $resultado = $conexion;
        } catch (PDOException $p) {
            echo "<p>Error al conectar " . $p->getMessage() . "</p>";
            exit();
        }
        return $resultado;
    }
}

?>