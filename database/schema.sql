CREATE DATABASE if NOT EXISTS `biblioteca`;
USE `biblioteca`;

-- Volcando estructura para tabla biblioteca.editoriales
CREATE TABLE IF NOT EXISTS `editoriales` (
  `id_editorial` int NOT NULL AUTO_INCREMENT,
  `nombre_editorial` varchar(50) DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`id_editorial`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla biblioteca.editoriales: ~10 rows (aproximadamente)
INSERT INTO `editoriales` (`id_editorial`, `nombre_editorial`, `observaciones`) VALUES
	(1, 'Editorial Planeta', 'Casi escribo observaciones aquí también'),
	(2, 'Mondadori', 'Casi escribo observaciones aquí también'),
	(3, 'Siruela', 'Casi escribo observaciones aquí también'),
	(4, 'Anagrama', 'Casi escribo observaciones aquí también'),
	(5, 'Tusquets', 'Casi escribo observaciones aquí también'),
	(6, 'Hachette', 'Casi escribo observaciones aquí también'),
	(7, 'Lackington', 'Casi escribo observaciones aquí también'),
	(8, 'Hughes', 'Casi escribo observaciones aquí también'),
	(9, 'Nova', 'Casi escribo observaciones aquí también'),
	(10, 'Ediciones B', 'Casi escribo observaciones aquí también');

CREATE TABLE IF NOT EXISTS `autores` (
  `id_autor` int NOT NULL AUTO_INCREMENT,
  `nombre_autor` varchar(50) DEFAULT NULL,
  `apellidos_autor` varchar(50) DEFAULT NULL,
  `pais_autor` varchar(50) DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`id_autor`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla biblioteca.autores: ~5 rows (aproximadamente)
INSERT INTO `autores` (`id_autor`, `nombre_autor`, `apellidos_autor`, `pais_autor`, `observaciones`) VALUES
	(1, 'Aldous', 'Huxley', 'Inglaterra', 'Sin observaciones aún'),
	(2, 'Brandon', 'Sanderson', 'Estados Unidos', 'Sin observaciones aún'),
	(3, 'Isaac', 'Asimov', 'Rusia', 'Sin observaciones aún'),
	(4, 'Amélie', 'Nothomb', 'Bélgica', 'Sin observaciones aún'),
	(5, 'Mary', 'Shelley', 'Inglaterra', 'Sin observaciones aún');
	
-- Volcando estructura para tabla biblioteca.generos
CREATE TABLE IF NOT EXISTS `generos` (
  `id_genero` int NOT NULL AUTO_INCREMENT,
  `nombre_genero` text,
  `observaciones` text,
  PRIMARY KEY (`id_genero`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla biblioteca.generos: ~7 rows (aproximadamente)
INSERT INTO `generos` (`id_genero`, `nombre_genero`, `observaciones`) VALUES
	(1, 'fantasia', 'Ninguna observación...'),
	(2, 'ciencia-ficción', 'Ninguna observación...'),
	(3, 'distopía', 'Ninguna observación...'),
	(4, 'misterio', 'Ninguna observación...'),
	(5, 'clásico', 'Ninguna observación...'),
	(6, 'terror', 'Ninguna observación...'),
	(7, 'novela épica', 'Ninguna observación...');
	
-- Crear la tabla libros
CREATE TABLE IF NOT EXISTS `libros` (
  `id_libro` int NOT NULL AUTO_INCREMENT,
  `nombre_libro` varchar(50) DEFAULT NULL,
  `sinopsis` varchar(550) DEFAULT NULL,
  `fk_autor` int DEFAULT NULL, -- Permitir valores NULL
  `observaciones` text,
  PRIMARY KEY (`id_libro`),
  KEY `fk__libros_autor` (`fk_autor`),
  CONSTRAINT `fk__libros_autor` FOREIGN KEY (`fk_autor`) REFERENCES `autores` (`id_autor`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla biblioteca.libros: ~7 rows (aproximadamente)
INSERT INTO `libros` (`id_libro`, `nombre_libro`, `sinopsis`, `fk_autor`, `observaciones`) VALUES
	(1, 'Metafisica de los tubos', 'Es una novela corta escrita por la escritora belga Amélie Nothomb y publicada originalmente en francés en el año 2000. La historia cuenta los primeros tres años de vida de un ser obsesionado por el agua que, insatisfecho con su entorno, adopta la inerte forma de un tubo como su condición existencial', 4, NULL),
	(2, 'Frankstein', 'La historia sigue a Victor Frankenstein, un joven científico que crea una criatura consciente en un experimento científico poco convencional', 5, NULL),
	(3, 'Yo, robot', 'Me da mucha pereza copiar y pegar la sinopsis', 1, NULL),
	(4, 'Un mundo feliz', '“Un Mundo Feliz” de Aldous Huxley es una novela distópica que nos sumerge en un futuro imaginario. Publicada en 1932, esta obra maestra explora los límites de la utopía y la tiranía de la felicidad forzada', 1, NULL),
	(5, 'El imperio final', 'En un mundo asolado por cenizas y gobernado por el inmortal Lord Legislador.', 2, NULL),
	(6, 'Higiene del asesino', 'Nothomb presenta a un famoso novelista llamado Prétextat Tach, quien tiene solo dos meses de vida. Los periodistas intentan entrevistarlo, pero solo una periodista desconocida logra obtener respuestas sobre su pasado', 4, NULL),
	(7, 'El camino de los reyes', 'La narrativa sigue a varios personajes principales, cuyas vidas parecen inicialmente desconectadas pero que se entrelazan a medida que avanza la trama.Los puntos de vista rotan entre:Kaladin, un joven soldado que lucha contra la esclavitud y la opresión.Shallan Davar, una estudiante y artista que busca secretos antiguos.Szeth-hijo-hijo-Vallano, un sicario con habilidades sobrenaturales y una espada especial.Dalinar Kholin, un líder militar que enfrenta visiones misteriosas y proféticas.', 2, NULL);

-- Volcando estructura para tabla biblioteca.ejemplares
CREATE TABLE IF NOT EXISTS `ejemplares` (
  `id_ejemplar` int NOT NULL AUTO_INCREMENT,
  `portada` text,
  `num_paginas` int DEFAULT NULL,
  `fk_editorial` int DEFAULT NULL,
  `fk_libro` int DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`id_ejemplar`),
  KEY `fk__ejemplares_editorial` (`fk_editorial`),
  KEY `fk__ejemplares_libro` (`fk_libro`),
  CONSTRAINT `fk__ejemplares_editorial` FOREIGN KEY (`fk_editorial`) REFERENCES `editoriales` (`id_editorial`)ON DELETE SET NULL,
  CONSTRAINT `fk__ejemplares_libro` FOREIGN KEY (`fk_libro`) REFERENCES `libros` (`id_libro`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla biblioteca.ejemplares: ~19 rows (aproximadamente)
INSERT INTO `ejemplares` (`id_ejemplar`, `portada`, `num_paginas`, `fk_editorial`, `fk_libro`, `stock`, `observaciones`) VALUES
	(1, 'ElCaminoDeLosReyesEdicion1.jpg', 565, 4, 1, 2, 'Sin observaciones, de momento'),
	(2, 'FrankensteinEdicion2.jpg', 623, 3, 1, 3, 'Sin observaciones, de momento'),
	(3, 'FrankensteinEdicion1.jpg', 536, 2, 1, 1, 'Sin observaciones, de momento'),
	(4, 'UnMundoFelizEdicion1.jpg', 378, 5, 2, 7, 'Sin observaciones, de momento'),
	(5, 'UnMundoFelizEdicion1.jpg', 410, 7, 2, 3, 'Sin observaciones, de momento'),
	(6, 'UnMundoFelizEdicion2.jpg', 432, 8, 2, 3, 'Sin observaciones, de momento'),
	(7, 'UnMundoFelizEdicion2.jpg', 398, 6, 2, 6, 'Sin observaciones, de momento'),
	(8, 'UnMundoFelizEdicion3.jpg', 354, 9, 3, 4, 'Sin observaciones, de momento'),
	(9, 'UnMundoFelizEdicion3.jpg', 345, 3, 3, 1, 'Sin observaciones, de momento'),
	(10, 'UnMundoFelizEdicion4.jpg', 328, 5, 3, 8, 'Sin observaciones, de momento'),
	(11, 'UnMundoFelizEdicion4.jpg', 226, 6, 4, 4, 'Sin observaciones, de momento'),
	(12, 'UnMundoFelizEdicion3.jpg', 243, 9, 4, 2, 'Sin observaciones, de momento'),
	(13, 'UnMundoFelizEdicion2.jpg', 196, 1, 4, 3, 'Sin observaciones, de momento'),
	(14, 'FrankensteinEdicion1.jpg', 200, 4, 4, 8, 'Sin observaciones, de momento'),
	(15, 'FrankensteinEdicion1.jpg', 743, 10, 5, 4, 'Sin observaciones, de momento'),
	(16, 'FrankensteinEdicion2.jpg', 832, 7, 5, 3, 'Sin observaciones, de momento'),
	(17, 'FrankensteinEdicion2.jpg', 453, 10, 6, 5, 'Sin observaciones, de momento'),
	(18, 'ElCaminoDeLosReyesEdicion1.jpg', 432, 7, 6, 1, 'Sin observaciones, de momento'),
	(19, 'ElCaminoDeLosReyesEdicion1.jpg', 1223, 9, 7, 3, 'Sin observaciones, de momento');
	
CREATE TABLE IF NOT EXISTS `libro_genero` (
  `id_libro_genero` int NOT NULL AUTO_INCREMENT,
  `fk_libro` int DEFAULT NULL,
  `fk_genero` int DEFAULT NULL,
  PRIMARY KEY (`id_libro_genero`),
  KEY `fk__libro_genero_libro` (`fk_libro`),
  KEY `fk__libro_genero_genero` (`fk_genero`),
  CONSTRAINT `fk__libro_genero_genero` FOREIGN KEY (`fk_genero`) REFERENCES `generos` (`id_genero`) ON DELETE SET NULL,
  CONSTRAINT `fk__libro_genero_libro` FOREIGN KEY (`fk_libro`) REFERENCES `libros` (`id_libro`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla biblioteca.libro_genero: ~16 rows (aproximadamente)
INSERT INTO `libro_genero` (`id_libro_genero`, `fk_libro`, `fk_genero`) VALUES
	(1, 1, 3),
	(2, 1, 2),
	(3, 2, 2),
	(4, 2, 4),
	(5, 2, 6),
	(6, 3, 2),
	(7, 3, 3),
	(8, 3, 4),
	(9, 4, 1),
	(10, 4, 6),
	(11, 5, 4),
	(12, 5, 5),
	(13, 5, 6),
	(14, 6, 1),
	(15, 6, 2),
	(16, 6, 6);

-- Volcando estructura para tabla biblioteca.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `admin` tinyint(1) DEFAULT '0',
  `nombre_usuario` varchar(50) DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(250) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `observaciones` text,
  `telefono` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla biblioteca.usuarios: ~5 rows (aproximadamente)
INSERT INTO `usuarios` (`id_usuario`, `admin`, `nombre_usuario`, `nombre`, `apellido`, `email`, `password`, `activo`, `observaciones`, `telefono`) VALUES
	(1, 1, 'ygutierrez', 'Yris', 'Gutierrez', 'ygutierrez03@educantabria.es', 'hoid', 1, 'No hay ninguna observacion', '653938570'),
	(2, 0, 'aldia', 'Adolfo', 'Perez', 'adolfoperez01@educantabria.es', 'kaladin', 1, 'Hay demasiadas observaciones', '983214327'),
	(3, 0, 'mariocrusher', 'Coral', 'Isbell', 'coralisbell02@educantabria.es', 'dalinar', 1, 'Hay demasiadas observaciones', '983214327'),
	(4, 0, 'angel1231', 'Angel', 'Gallurt', 'angelgallurt04@educantabria.es', 'szeth', 1, 'Hay demasiadas observaciones', '983214327'),
	(5, 0, 'marcos231', 'Marcos', 'Lopez', 'marcoslopez05@educantabria.es', 'jasnah', 1, 'Hay demasiadas observaciones', '983214327');
	
-- Volcando estructura para tabla biblioteca.prestamos
CREATE TABLE IF NOT EXISTS `prestamos` (
  `id_prestamo` int NOT NULL AUTO_INCREMENT,
  `fecha_salida` date DEFAULT NULL,
  `fecha_devolucion` date DEFAULT NULL,
  `devuelto` tinyint(1) DEFAULT '0',
  `fk_usuario` int DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`id_prestamo`),
  KEY `fk__prestamos_usuarios` (`fk_usuario`),
  CONSTRAINT `fk__prestamos_usuarios` FOREIGN KEY (`fk_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla biblioteca.prestamos: ~4 rows (aproximadamente)
INSERT INTO `prestamos` (`id_prestamo`, `fecha_salida`, `fecha_devolucion`, `fk_usuario`, `devuelto`,`observaciones`) VALUES
	(1, '2024-05-08', '2024-06-08', 2, 1,'Deberías devolverlos...'),
	(2, '2024-04-21', '2024-05-21', 3, 0,'Deberías devolverlos...'),
	(3, '2024-03-09', '2024-04-09', 4, 1,'Deberías devolverlos...'),
	(4, '2024-05-12', '2024-06-12', 5, 1,'Deberías devolverlos...');

-- Volcando estructura para tabla biblioteca.prestamo_ejemplar
CREATE TABLE IF NOT EXISTS `prestamo_ejemplar` (
  `id_prestamo_ejemplar` int NOT NULL AUTO_INCREMENT,
  `fk_prestamo` int DEFAULT NULL,
  `fk_ejemplar` int DEFAULT NULL,
  PRIMARY KEY (`id_prestamo_ejemplar`),
  KEY `fk__prestamo_ejemplar_prestamo` (`fk_prestamo`),
  KEY `fk__prestamos_ejemplar_ejemplar` (`fk_ejemplar`),
  CONSTRAINT `fk__prestamo_ejemplar_prestamo` FOREIGN KEY (`fk_prestamo`) REFERENCES `prestamos` (`id_prestamo`) ON DELETE SET NULL,
  CONSTRAINT `fk__prestamos_ejemplar_ejemplar` FOREIGN KEY (`fk_ejemplar`) REFERENCES `ejemplares` (`id_ejemplar`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla biblioteca.prestamo_ejemplar: ~12 rows (aproximadamente)
INSERT INTO `prestamo_ejemplar` (`id_prestamo_ejemplar`, `fk_prestamo`, `fk_ejemplar`) VALUES
	(1, 1, 1),
	(2, 1, 4),
	(3, 1, 8),
	(4, 1, 11),
	(5, 2, 19),
	(6, 2, 15),
	(7, 2, 3),
	(8, 3, 6),
	(9, 3, 17),
	(10, 3, 12),
	(11, 4, 10),
	(12, 4, 7);