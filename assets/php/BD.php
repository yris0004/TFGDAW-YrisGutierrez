<?php
require_once __DIR__.'/ConexionBD.php';

class BD extends ConexionBD
{    
    //Es necesario añadir esta funcion para heredar los metodos de conexion
    public function __construct() {
        parent::__construct();
    }

    public function crearUsuario($arrDatosUsuario) {
        // var_dump($this->conexion);
        try {
            $arrDatosUsuario["password"] = password_hash($arrDatosUsuario["password"], PASSWORD_DEFAULT);
            $sql = $this->conexion->prepare("INSERT INTO usuarios (admin, nombre_usuario, nombre, apellido, email, password, activo, observaciones, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $sql->execute([
                $arrDatosUsuario['admin'],
                $arrDatosUsuario['nombre_usuario'],
                $arrDatosUsuario['nombre'],
                $arrDatosUsuario['apellido'],
                $arrDatosUsuario['email'],
                $arrDatosUsuario['password'],
                $arrDatosUsuario['activo'],
                $arrDatosUsuario['observaciones'],
                $arrDatosUsuario['telefono']
            ]);
            return true;

        } catch (\PDOException $e) {
            exit("Error en la consulta:" . $e->getMessage());
        }
    }

    public function iniciarSesion($nombreUsuario, $password) {

        try {
        $sql = $this->conexion->prepare("SELECT * from usuarios where nombre_usuario = ?;");
        $sql-> execute([$nombreUsuario]);
        $resultado = $sql->fetch(\PDO::FETCH_ASSOC);

            if($resultado && password_verify($password, $resultado['password'])){
                unset($resultado['password']);
                return $resultado; 
            }
            if($password === $resultado['password']){
                unset($resultado['password']);
                return $resultado;
            }
            else {
                return false;
            }
        }
        catch(\PDOException $e) {
            exit("Error: ". $e->getMessage());
        }
    }

    public function consultaGeneral() {
        try {
            $sql = $this->conexion->prepare("SELECT ejemplares.id_ejemplar,
            libros.nombre_libro, 
            libros.sinopsis,
            autores.nombre_autor, 
            autores.apellidos_autor, 
            autores.pais_autor,
            ejemplares.num_paginas, 
            editoriales.nombre_editorial, 
            ejemplares.portada, 
            ejemplares.stock, 
            ejemplares.observaciones,
               (SELECT GROUP_CONCAT(generos.nombre_genero SEPARATOR ', ')
                 FROM libro_genero
                 INNER JOIN generos ON libro_genero.fk_genero = generos.id_genero
                 WHERE libro_genero.fk_libro = libros.id_libro) AS generos_asociados
            FROM ejemplares 
            INNER JOIN libros
            ON ejemplares.fk_libro = libros.id_libro
            INNER JOIN editoriales
            ON ejemplares.fk_editorial = editoriales.id_editorial
            INNER JOIN autores 
            ON libros.fk_autor = autores.id_autor
            LEFT JOIN libro_genero
            ON libro_genero.id_libro_genero = libros.id_libro
            LEFT JOIN generos 
            ON libro_genero.fk_genero = generos.id_genero
            GROUP BY ejemplares.id_ejemplar
            HAVING 
            generos_asociados IS NOT NULL");
            
            $sql -> execute();
            $resultado = $sql->fetchAll(\PDO::FETCH_ASSOC);
            return $resultado;
        }
        catch(\PDOException $e) {
            exit("Error: ". $e->getMessage());
        }
    }

    public function insertarRegistro($tabla, $datos){
        try {
            $conexion = self::conexionBD();
            $columnas = implode(', ', array_keys($datos));
            // var_dump(array_keys($datos));
            // echo "<br>".$columnas;
            //Con array_fill indicaremos que la cadena empiece en la posicion 0, tendrá la misma longitud que el numero de datos que haya
            $valores = implode(', ', array_fill(0, count($datos), '?'));

            $sql = "INSERT INTO $tabla ($columnas) VALUES ($valores)";
            $consulta = $conexion->prepare($sql);

            // Ejecutar la consulta preparada con los valores
            $consulta->execute(array_values($datos));
            return true;
        } catch (PDOException $e) {
            throw new Exception("ERROR: " . $e->getMessage());
        }
    }

    public function idPrestamo () {

        try {
            $conexion = self::conexionBD();

            $sql = "SELECT id_prestamo 
            FROM prestamos
            ORDER BY id_prestamo DESC 
            LIMIT 1";
            $consulta = $conexion->prepare($sql);
            $consulta->execute();
            $resultado = $consulta->fetch(PDO::FETCH_ASSOC);
            return $resultado['id_prestamo'];
        } catch (PDOException $e) {
            throw new Exception("ERROR: " . $e->getMessage());
        }

    }
    
    public function actualizarRegistro($arrDatosUpdate,$tabla){
        try {
            // $conexion = self::conexionBD();

            $columnaId = array_key_first($arrDatosUpdate);
            $valorId = $arrDatosUpdate[$columnaId];

            unset($arrDatosUpdate[$columnaId]);

            $setClauseParts = [];
            foreach ($arrDatosUpdate as $key => $value) {
                $setClauseParts[] = "$key = ?";
            }

            $setClause = implode(', ', $setClauseParts);

            $sql = "UPDATE $tabla SET $setClause WHERE $columnaId = ?";
            $consulta = $this->conexion->prepare($sql);

            $valores = array_values($arrDatosUpdate);
            $valores[] = $valorId;

            // Ejecutar la consulta preparada con los valores
            $consulta->execute($valores);

        } catch (PDOException $e) {
            throw new Exception("ERROR: " . $e->getMessage());
        }
    }

    public function stockEjemplar($idEjemplar) {
        try {
            $conexion = self::conexionBD();

            $sql = "SELECT stock
            FROM ejemplares
            WHERE id_ejemplar = ?";
            $consulta = $conexion->prepare($sql);
            $consulta->execute([$idEjemplar]);
            $resultado = $consulta->fetch(PDO::FETCH_ASSOC);
            return $resultado['stock'];
        } catch (PDOException $e) {
            throw new Exception("ERROR: " . $e->getMessage());
        }
    }

    public function transaccionRegistro ($arrNewPrestamos, $arrNewPrestamoEjemplar) {
        
        try {
            $conexion = self::conexionBD();
            $conexion->beginTransaction();
            
            self::insertarRegistro('prestamos', $arrNewPrestamos);
            $id_ultimoPrestamo = self::idPrestamo();

            foreach ($arrNewPrestamoEjemplar as &$ejemplar) {
                unset($actualizarStockEjemplar);
                $ejemplar['fk_prestamo'] = $id_ultimoPrestamo;
                self::insertarRegistro('prestamo_ejemplar', $ejemplar);
                $stock = self::stockEjemplar($ejemplar['fk_ejemplar']);
                $actualizarStockEjemplar = array(
                    'id_ejmplar' => $ejemplar['fk_ejemplar'],
                    'stock' => $stock-1,
                );
                self::actualizarRegistro($actualizarStockEjemplar,'ejemplares');
            }

            $desactivarUsuario = array(
                'id_usuario' => $arrNewPrestamos['fk_usuario'],
                'activo' => 0
            );
            self::actualizarRegistro($desactivarUsuario,'usuarios');
            $conexion->commit();    
            return true;
        } catch (PDOException $e) {
            $conexion->rollBack();
            throw new Exception("ERROR: " . $e->getMessage());
        }
    }

    public function transaccionLibro ($arrLibros, $arrGeneros) {
        
        try {
            $conexion = self::conexionBD();
            $conexion->beginTransaction();
            
            self::insertarRegistro('libros', $arrLibros);
            $id_UltimoLibroInsertado = self::idUltimoLibro();

            foreach ($arrGeneros as &$genero) {
                $genero['fk_libro'] = $id_UltimoLibroInsertado;
                self::insertarRegistro('libro_genero', $genero);
            }

            $conexion->commit();
            return true;
        } catch (PDOException $e) {
            $conexion->rollBack();
            throw new Exception("ERROR: " . $e->getMessage());
        }
    }

    public function imprimirConsultas($tablaImprimir){
        try {
            $conexion = self::conexionBD();
            $sql = "SELECT * FROM $tablaImprimir";

            $resultado = $conexion->query($sql);

            // Crear un array para almacenar todas las filas        
            $filas = [];
            // Recorrer los resultados y almacenar cada fila en el array        
            while ($fila = $resultado->fetch()) {
                $filas[] = $fila;
            }
        } catch (Exception $e) {
            throw new Exception("ERROR: " + $e);
        }
        //Esta consulta te devuelve un array de arrays con todos los datos de la tabla producto.
        return $filas;
    }

    public function idUltimoLibro() {
        try {
            $conexion = self::conexionBD();

            $sql = "SELECT id_libro 
            FROM libros
            ORDER BY id_libro DESC 
            LIMIT 1";
            $consulta = $conexion->prepare($sql);
            $consulta->execute();
            $resultado = $consulta->fetch(PDO::FETCH_ASSOC);
            return $resultado['id_libro'];
        } catch (PDOException $e) {
            throw new Exception("ERROR: " . $e->getMessage());
        }
    }
    
    public function tablaLibros() {
        try {
            $sql = $this->conexion->prepare("SELECT 
            libros.id_libro,
            libros.nombre_libro, 
            libros.sinopsis, 
            libros.fk_autor,
            autores.nombre_autor,
            autores.apellidos_autor,
            autores.pais_autor,
            libros.observaciones, 
            (SELECT GROUP_CONCAT(generos.id_genero SEPARATOR ', ')
             FROM libro_genero
             INNER JOIN generos ON libro_genero.fk_genero = generos.id_genero
             WHERE libro_genero.fk_libro = libros.id_libro) AS id_generos,
            (SELECT GROUP_CONCAT(generos.nombre_genero SEPARATOR ', ')
             FROM libro_genero
             INNER JOIN generos ON libro_genero.fk_genero = generos.id_genero
             WHERE libro_genero.fk_libro = libros.id_libro) AS nombres_generos
        FROM 
            libros 
        LEFT JOIN 
            autores ON libros.fk_autor = autores.id_autor");

            $sql -> execute();
            $resultado = $sql->fetchAll(\PDO::FETCH_ASSOC);
            return $resultado;
        }
        catch(\PDOException $e) {
            exit("Error: ". $e->getMessage());
        }
    }
 
    public function tablaEjemplares() {
        try {
            $sql = $this->conexion->prepare("SELECT 
            ejemplares.id_ejemplar,
            libros.id_libro,
            libros.nombre_libro,
            ejemplares.portada, 
            editoriales.id_editorial,
            editoriales.nombre_editorial,
            ejemplares.num_paginas, 
            ejemplares.stock,
            ejemplares.observaciones
            FROM ejemplares 
            LEFT JOIN libros
            ON ejemplares.fk_libro = libros.id_libro
            LEFT JOIN editoriales
            ON editoriales.id_editorial = ejemplares.fk_editorial");
            
            $sql -> execute();
            $resultado = $sql->fetchAll(\PDO::FETCH_ASSOC);
            return $resultado;
        }
        catch(\PDOException $e) {
            exit("Error: ". $e->getMessage());
        }
    }

    public function borrarGeneroLibro($idLibro) {

        try {
            $conexion = self::conexionBD();

            $sql = "DELETE FROM libro_genero 
            WHERE fk_libro = ?";

            $consulta = $conexion->prepare($sql);
            $consulta->execute([$idLibro]);

            return true;
        } catch (PDOException $e) {
            throw new Exception("ERROR: " . $e->getMessage());
        }

    }

    public function actualizarLibro($arrLibroUpdate,$arrGenerosLibros) {
        
        try {
            $conexion = self::conexionBD();
            $conexion->beginTransaction();

            $columnaId = array_key_first($arrLibroUpdate);
            $valorId = $arrLibroUpdate[$columnaId];

            self::actualizarRegistro($arrLibroUpdate, 'libros');

            self::borrarGeneroLibro($valorId);
            
            foreach ($arrGenerosLibros as &$generoLibro) {
                $generoLibro['fk_libro'] = $valorId;
                self::insertarRegistro('libro_genero', $generoLibro);
            }
            $conexion->commit();

            return true;
        } catch (PDOException $e) {
            $conexion->rollBack();
            throw new Exception("ERROR: " . $e->getMessage());
        }
    }

    public function imprimirUsuarios() {

        try {
        $sql = $this->conexion->prepare("SELECT * from usuarios");
        $sql-> execute();
        $resultados = $sql->fetchAll(\PDO::FETCH_ASSOC);

        foreach ($resultados as $key => $usuario) {
            unset($resultados[$key]['password']);
        }

        return $resultados;
           
        }
        catch(\PDOException $e) {
            exit("Error: ". $e->getMessage());
        }
    }

    public function prestamosUsuarios($idUsuario) {
        
        try {
            $sql = $this->conexion->prepare("SELECT
            prestamos.id_prestamo,
            libros.nombre_libro,
            prestamos.fecha_salida,
            prestamos.fecha_devolucion,
            ejemplares.portada,
            prestamos.devuelto,
            prestamos.observaciones
            FROM usuarios
            INNER JOIN prestamos
            ON usuarios.id_usuario = prestamos.fk_usuario
            INNER JOIN prestamo_ejemplar
            ON prestamo_ejemplar.fk_prestamo = prestamos.id_prestamo
            INNER JOIN ejemplares 
            ON ejemplares.id_ejemplar = prestamo_ejemplar.fk_ejemplar
            INNER JOIN libros 
            ON ejemplares.fk_libro = libros.id_libro
            WHERE usuarios.id_usuario = ?");

            $sql-> execute([$idUsuario['allPrestamos']]);
            $resultados = $sql->fetchAll(\PDO::FETCH_ASSOC);
            
            return $resultados;
               
        }
        catch(\PDOException $e) {
            exit("Error: ". $e->getMessage());
        }
    }   

    public function borrarRegistro($idRegistro, $tabla) {
        
        try {
            $columnaId = array_key_first($idRegistro);
            $valorId = $idRegistro[$columnaId];
            
            $sql = $this->conexion->prepare("DELETE
            FROM $tabla 
            WHERE  $columnaId = ?");

            $sql->execute([$valorId]);

            return true;
        } catch (PDOException $e) {
            throw new Exception("ERROR: " . $e->getMessage());
        }

    } 

    public function obtenerUsuarioActualizado($idUsuario) {
        try {
            $sql = $this->conexion->prepare("SELECT * from usuarios where id_usuario = ?;");
            $sql-> execute([$idUsuario['id_usuario']]);
            $resultado = $sql->fetch(\PDO::FETCH_ASSOC);
    
                if ($resultado) {
                    unset($resultado['password']);
                    return $resultado;
                }
                else {
                    return false;
                }
            }
            catch(\PDOException $e) {
                exit("Error: ". $e->getMessage());
            }
    }
    
}
?>