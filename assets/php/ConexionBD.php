<?php

class ConexionBD
{
    private $servidor= "localhost";
    private $baseDatos= "biblioteca";
    private $usuario= "yris";
    private $password= "0000";
    protected $conexion; 

    public function __construct() {
        $this->conexion = $this->conexionBD();
    }

    public function conexionBD()
    {
        $resultado = false;
        try {
            $conexion = new PDO('mysql:host=' . $this->servidor . ';dbname='. $this->baseDatos, $this->usuario, $this->password);

            $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $resultado = $conexion;
        } catch (PDOException $p) {
            echo "<p>Error al conectar " . $p->getMessage() . "</p>";
            $resultado = true;
            exit();
        }
        return $resultado;
    }
}

?>