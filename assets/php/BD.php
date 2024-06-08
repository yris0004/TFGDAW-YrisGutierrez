<?php
require_once __DIR__.'/ConexionBD.php';

//Está clase se hereda de conexiónBD, para así poder acceder a todas las propiedades y metódos de la clase padre
//Se usan consultas preparadas para evitar la inyección externa de código sql
class BD extends ConexionBD
{    
    //Es necesario añadir esta funcion para heredar los metodos de conexion
    public function __construct() {
        parent::__construct();
    }


    //--------------------------FUNCIONES MANEJO USUARIOS---------------------------

    //Función para crear un nuevo registro de usuario mediante un parametro que es un array asociativo con las columnas y sus valores correspondientes
    public function crearUsuario($arrDatosUsuario) {
        //var_dump($this->conexion);
        try {

            $sql = $this->conexion->prepare("SELECT COUNT(*) 
            FROM usuarios 
            WHERE nombre_usuario = ?");
            $sql->execute([$arrDatosUsuario['nombre_usuario']]);
            if ($sql->fetchColumn() > 0) {
                return false;
            }
    
            // Verificar si el correo electrónico ya existe
            $sql = $this->conexion->prepare("SELECT COUNT(*) 
            FROM usuarios 
            WHERE email = ?");
            $sql->execute([$arrDatosUsuario['email']]);
            if ($sql->fetchColumn() > 0) {
                return false;
            }
    
            // Verificar si el número de teléfono ya existe
            $sql = $this->conexion->prepare("SELECT COUNT(*) 
            FROM usuarios 
            WHERE telefono = ?");
            $sql->execute([$arrDatosUsuario['telefono']]);
            if ($sql->fetchColumn() > 0) {
                return false;
            }

            //Se comprueba que la contraseña no está vacía
            if (empty($arrDatosUsuario['password'])) {
                return false;
            }

            //Se utiliza un hash para guardar la contraseña codificada por motivos de seguridad
            $arrDatosUsuario["password"] = password_hash($arrDatosUsuario["password"], PASSWORD_DEFAULT);
            $sql = $this->conexion->prepare("INSERT INTO usuarios 
            (admin, nombre_usuario, nombre, apellido, email, password, activo, observaciones, telefono) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
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

    //Funcion para comprobar si el nombre de usuario y la contraseña introducidos es correcta
    public function iniciarSesion($nombreUsuario, $password) {

        try {
        $sql = $this->conexion->prepare("SELECT * from usuarios where nombre_usuario = ?;");
        $sql-> execute([$nombreUsuario]);
        $resultado = $sql->fetch(\PDO::FETCH_ASSOC);

            //Este if se encarga de comprobar que se ha devuelto un registro con el nombre de usuario introducido y verifica si la contraseña es correcta
            if($resultado && password_verify($password, $resultado['password'])){
                unset($resultado['password']);
                return $resultado; 
            }
            //Este if solo está para poder acceder con usuario sin la contraseña codificada, creados en la base de datos para realizar pruebas
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

    //--------------------------FUNCIONES MANEJO USUARIOS---------------------------
    

    //--------------------------FUNCIONES DINAMICAS---------------------------

    //Podemos insertar de manera dinámica cualquier registro, al pasarle el nombre de la tabla y un array asociativo con las columnas y sus respectivos valores
    public function insertarRegistro($tabla, $datos) {
        try {
            //Con el array_keys podemos separar mediante comas las columnas de los valores
            $columnas = implode(', ', array_keys($datos));
            //var_dump(array_keys($datos));
            //echo "<br>".$columnas;
            //Con array_fill indicaremos que la cadena empiece en la posicion 0, tendrá la misma longitud que el numero de datos que haya
            $valores = implode(', ', array_fill(0, count($datos), '?'));

            $sql = "INSERT INTO $tabla ($columnas) VALUES ($valores)";
            $consulta = $this->conexion->prepare($sql);

            $consulta->execute(array_values($datos));
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }

    //Podemos borrar de manera dinámica cualquier registro, al pasarle el nombre de la tabla y el id del registro que deseamos borrar
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

    //Función dinámica para actualizar cualquier registro que queramos pasando el nombre de la tabla y un array asociatico con las columnas y sus respectivos valores
    public function actualizarRegistro($arrDatosUpdate,$tabla) {
        
        try {
            $columnaId = array_key_first($arrDatosUpdate);
            $valorId = $arrDatosUpdate[$columnaId];
            //borrar del array el id del registro que se quiere actualizar
            unset($arrDatosUpdate[$columnaId]);

            //Se crea un array con todas las columnas
            $columnas = [];
            foreach ($arrDatosUpdate as $clave => $valor) {
                $columnas[] = "$clave = ?";
            }

            $unionColumnas = implode(', ', $columnas);
            $sql = "UPDATE $tabla SET $unionColumnas WHERE $columnaId = ?";
            $consulta = $this->conexion->prepare($sql);

            //Se crea un array con todos los valores
            $valores = array_values($arrDatosUpdate);
            $valores[] = $valorId;

            $consulta->execute($valores);
            return true;
        } catch (PDOException $e) {
            // throw new Exception("ERROR: " . $e->getMessage());
            return false;
        }
    }

    //Devuelve todos los registros de la tabla recibida como parámetro
    public function imprimirConsultas($tablaImprimir){

        try {
            $sql = "SELECT * FROM $tablaImprimir";
            $resultado = $this->conexion->query($sql);

            // Crear un array para almacenar todas las filas        
            $filas = [];
            // Recorrer los resultados y almacenar cada fila en el array        
            while ($fila = $resultado->fetch()) {
                $filas[] = $fila;
            }
            return $filas;
        } catch (Exception $e) {
            throw new Exception("ERROR: " + $e);
        }
    }

    //--------------------------FUNCIONES DINAMICAS---------------------------

        
    //--------------------------FUNCIONES ULTIMO ID---------------------------

    //Devuelve el id del último préstamo realizado
    public function idPrestamo () {

        try {

            $sql = "SELECT id_prestamo 
            FROM prestamos
            ORDER BY id_prestamo DESC 
            LIMIT 1";
            $consulta = $this->conexion->prepare($sql);
            $consulta->execute();
            $resultado = $consulta->fetch(PDO::FETCH_ASSOC);
            return $resultado['id_prestamo'];
        } catch (PDOException $e) {
            // throw new Exception("ERROR: " . $e->getMessage());
            return false;
        }

    }

    //Devuelve el id del último libro agregado
    public function idUltimoLibro() {
        try {

            $sql = "SELECT id_libro 
            FROM libros
            ORDER BY id_libro DESC 
            LIMIT 1";
            $consulta = $this->conexion->prepare($sql);
            $consulta->execute();
            $resultado = $consulta->fetch(PDO::FETCH_ASSOC);
            return $resultado['id_libro'];
        } catch (PDOException $e) {
            throw new Exception("ERROR: " . $e->getMessage());
        }
    }

    //--------------------------FUNCIONES ULTIMO ID---------------------------


    //--------------------------FUNCIONES IMPRIMIR TABLA---------------------------

    //Retorna todos los datos necesarios que se mostrar en la tabla libros de la página del administrador
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
    
    //Gracias a esta función mostramos todos los datos necesarios en la ejemplares de la página del administrador
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

    //Muestra todos los prestamos asociados a un usuario
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

    //Devuelve todos los usuarios pero sin su respectiva constraseña
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

    //--------------------------FUNCIONES IMPRIMIR TABLA---------------------------


    //--------------------------FUNCIONES PÁGINA USUARIO---------------------------

    //Esta función diabolica devuelve la consulta que se muestra en la página de usuario para poder filtrar los ejemplares
    public function consultaGeneralInicioUsuario() {
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

    //--------------------------FUNCIONES PÁGINA USUARIO---------------------------


    //--------------------------FUNCIONES MODIFICAR LIBROS---------------------------
    
    //Gracias a esta función podemos insertar un libro, pasando por parámetros un array con los datos del libro y otro con los generos asociados
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

    //Su funcionalidad consiste en borrar los generos asociadoss al id del libro pasado por parametro
    public function borrarGeneroLibro($idLibro) {

        try {
            $sql = "DELETE 
            FROM libro_genero 
            WHERE fk_libro = ?";

            $consulta = $this->conexion->prepare($sql);
            $consulta->execute([$idLibro]);

            return true;
        } catch (PDOException $e) {
            throw new Exception("ERROR: " . $e->getMessage());
        }

    }
    
    //Esta función nos permite actualizar el registro de cualquier libro pasando un array con los datos del libro y un array con los generos asociados
    public function actualizarLibro($arrLibroUpdate,$arrGenerosLibros) {
        
        try {
            $this->conexion->beginTransaction();

            $columnaId = array_key_first($arrLibroUpdate);
            $valorId = $arrLibroUpdate[$columnaId];

            self::actualizarRegistro($arrLibroUpdate, 'libros');

            self::borrarGeneroLibro($valorId);
            
            foreach ($arrGenerosLibros as &$generoLibro) {
                $generoLibro['fk_libro'] = $valorId;
                self::insertarRegistro('libro_genero', $generoLibro);
            }
            $this->conexion->commit();

            return true;
        } catch (PDOException $e) {
            $this->conexion->rollBack();
            throw new Exception("ERROR: " . $e->getMessage());
        }
    }
        
    //--------------------------FUNCIONES MODIFICAR LIBROS---------------------------


    //Devuelve el valor de stock del id_ejemplar que se recibe como parámetro
    public function stockEjemplar($idEjemplar) {
        try {

            $sql = "SELECT stock
            FROM ejemplares
            WHERE id_ejemplar = ?";
            $consulta = $this->conexion->prepare($sql);
            $consulta->execute([$idEjemplar]);
            $resultado = $consulta->fetch(PDO::FETCH_ASSOC);
            return $resultado['stock'];
        } catch (PDOException $e) {
            // throw new Exception("ERROR: " . $e->getMessage());
            return false;
        }
    }

    //Funcion para insertar un nuevo préstamo. Para ello debemos hacer dos inserciones, cada una en una tabla diferente
    public function transaccionRegistro ($arrNewPrestamos, $arrNewPrestamoEjemplar) {
        
        try {
            $conexion = self::conexionBD();
            $this->conexion->beginTransaction();
            
            self::insertarRegistro('prestamos', $arrNewPrestamos);
            $id_ultimoPrestamo = self::idPrestamo();

            foreach ($arrNewPrestamoEjemplar as &$ejemplar) {
                unset($actualizarStockEjemplar);
                $ejemplar['fk_prestamo'] = $id_ultimoPrestamo;
                self::insertarRegistro('prestamo_ejemplar', $ejemplar);
                $stock = self::stockEjemplar($ejemplar['fk_ejemplar']);
                $actualizarStockEjemplar = array(
                    'id_ejeplar' => $ejemplar['fk_ejemplar'],
                    'stock' => $stock-1,
                );
                self::actualizarRegistro($actualizarStockEjemplar,'ejemplares');
            }

            $desactivarUsuario = array(
                'id_usuario' => $arrNewPrestamos['fk_usuario'],
                'activo' => 0
            );
            self::actualizarRegistro($desactivarUsuario,'usuarios');
            $this->conexion->commit();    
            return true;
        } catch (PDOException $e) {
            $this->conexion->rollBack();
            throw new Exception("ERROR: " . $e->getMessage());
        }
    }

    //Actualiza el usuario del administrador cuando lo actualiza
    public function obtenerUsuarioActualizado($idUsuario) {
        try {
            $sql = $this->conexion->prepare("SELECT * 
            FROM usuarios 
            WHERE id_usuario = ?");

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