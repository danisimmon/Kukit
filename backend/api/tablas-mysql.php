<?php

include 'conecta-mysql.php';

$sql = "CREATE TABLE IF NOT EXISTS usuario (
    id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100),
    google_id VARCHAR(255) DEFAULT NULL
)";

mysqli_query($conexion, $sql);

// Insertamos usuarios
$password = password_hash('TrenZapato@81', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Pepe Viyuela', 'pepeviyuela@gmail.com', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('FuegoTijera@37', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Penélope Cruz', 'penelopecruz@hotmail.es', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('MonoTrampa#48', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Koi Sevilla', 'koisevilla@gmail.com', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('GuitarraRosa+77', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Farrukito', 'farrukito@outlook.com', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('PezCereza#66', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('El Xokas', 'elxokas@yahoo.es', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('SillaCometa@19', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Ja Morant', 'jamorant@hotmail.com', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('ToroMochila#08', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Andy y Lucas', 'andylucas@hotmail.com', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('RanaVelcro@33', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Operación Camarón', 'operacioncamaron@gmail.es', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('CieloGalleta_96', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Bad Bunny', 'badbunny@yahoo.com', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('TrucoSombra$74', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Fernando Alonso', 'fernandoalonso@hotmail.es', '$password')";
mysqli_query($conexion, $sql);


//Tabla password reset
$sql = "CREATE TABLE IF NOT EXISTS password_reset (
    id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(200) NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    codigo_verificacion VARCHAR(100) NOT NULL
)";

mysqli_query($conexion, $sql);

// Obtener los IDs de los nuevos tutores

// Obtener el id.
// $id_tutor1 = mysqli_insert_id($conexion) - 3;
// $id_tutor2 = $id_tutor1 + 1;
// $id_tutor3 = $id_tutor1 + 2;
// $id_tutor4 = $id_tutor1 + 3;

//Tabla lista compra
$sql = "CREATE TABLE IF NOT EXISTS lista_compra (
    id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT(20) UNSIGNED NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL, 
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
    )";

mysqli_query($conexion, $sql);

mysqli_query($conexion, "INSERT INTO lista_compra (id_usuario, nombre, descripcion, fecha) VALUES 
    (1, 'Comida familiar', 'Comida familiar de 12 personas', '2025/04/16'),
    (2, 'Cena navidad', 'Cena navidad para 8 personas', '2025/12/24'),
    (3, 'Torrijas', 'Todos los ingredientes para hacer torrijas', '2025/04/16'),
    (4, 'Cumpleaños', 'Lista de la compra para el cumpleaños de Duneplay', '2025/04/17')");


$sql = "CREATE TABLE IF NOT EXISTS productos (
    id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    unidad VARCHAR(50) NOT NULL
)";

mysqli_query($conexion, $sql);

mysqli_query($conexion, "INSERT INTO productos (nombre, categoria, unidad) VALUES 
('Tomate', 'Alimentación seca', 'kg'),
('Lechuga', 'Bebidas', 'litros'),
('Cebolla', 'Verduras', 'unidad'),
('Zanahoria', 'Carne', 'unidad'),
('Pimiento', 'Fruta', 'kg'),
('Judías verdes', 'Despensa', 'unidad'),
('Espinacas', 'Despensa', 'unidad'),
('Acelgas', 'Alimentación seca', 'pack'),
('Pepino', 'Panadería', 'unidad'),
('Brócoli', 'Pescado', 'kg'),
('Lentejas', 'Legumbres', 'kg'),
('Garbanzos', 'Panadería', 'unidad'),
('Alubias blancas', 'Lácteos', 'litros'),
('Soja', 'Lácteos', 'unidad'),
('Judión', 'Fruta', 'kg'),
('Carne picada', 'Huevos', 'docena'),
('Filete de ternera', 'Verduras', 'kg'),
('Pollo entero', 'Fruta', 'unidad'),
('Muslos de pollo', 'Huevos', 'docena'),
('Chuletas de cerdo', 'Carne', 'unidad'),
('Salmón', 'Fruta', 'kg'),
('Merluza', 'Huevos', 'docena'),
('Atún fresco', 'Huevos', 'docena'),
('Calamares', 'Fruta', 'kg'),
('Gambas', 'Huevos', 'docena'),
('Manzana', 'Panadería', 'unidad'),
('Pera', 'Panadería', 'unidad'),
('Plátano', 'Panadería', 'unidad'),
('Naranja', 'Legumbres', 'pack'),
('Mandarina', 'Carne', 'kg'),
('Leche entera', 'Panadería', 'unidad'),
('Leche semidesnatada', 'Alimentación seca', 'kg'),
('Yogur natural', 'Verduras', 'unidad'),
('Yogur de sabores', 'Fruta', 'unidad'),
('Queso curado', 'Alimentación seca', 'kg'),
('Huevos camperos', 'Huevos', 'docena'),
('Huevos blancos', 'Huevos', 'docena'),
('Huevos ecológicos', 'Huevos', 'docena'),
('Agua mineral', 'Limpieza', 'litros'),
('Zumo de naranja', 'Huevos', 'docena'),
('Refresco de cola', 'Huevos', 'docena'),
('Refresco de limón', 'Verduras', 'unidad'),
('Cerveza', 'Huevos', 'docena'),
('Vino tinto', 'Pescado', 'kg'),
('Vino blanco', 'Verduras', 'kg'),
('Pan de molde', 'Despensa', 'pack'),
('Pan integral', 'Lácteos', 'pack'),
('Bollos', 'Lácteos', 'unidad'),
('Magdalenas', 'Legumbres', 'kg'),
('Harina', 'Lácteos', 'litros'),
('Cereal de desayuno', 'Lácteos', 'pack'),
('Galletas', 'Alimentación seca', 'kg'),
('Chocolates', 'Fruta', 'unidad'),
('Patatas', 'Verduras', 'kg'),
('Arroz', 'Legumbres', 'kg'),
('Pasta', 'Despensa', 'kg'),
('Aceite de oliva', 'Alimentación seca', 'litros'),
('Vinagre', 'Alimentación seca', 'litros'),
('Sal', 'Lácteos', 'kg'),
('Azúcar', 'Despensa', 'kg'),
('Harina de trigo', 'Panadería', 'kg'),
('Levadura', 'Lácteos', 'unidad'),
('Chocolate en polvo', 'Panadería', 'kg'),
('Café', 'Alimentación seca', 'kg'),
('Té', 'Bebidas', 'kg'),
('Galletas saladas', 'Alimentación seca', 'kg'),
('Patatas fritas', 'Panadería', 'pack'),
('Snacks', 'Bebidas', 'unidad'),
('Cerveza sin alcohol', 'Bebidas', 'litros'),
('Vino rosado', 'Bebidas', 'litros'),
('Vino espumoso', 'Bebidas', 'litros'),
('Gaseosa', 'Bebidas', 'litros'),
('Leche de almendras', 'Lácteos', 'litros'),
('Leche de soja', 'Lácteos', 'litros'),
('Lata de atún', 'Pescado', 'unidad'),
('Lata de sardinas', 'Pescado', 'unidad'),
('Lata de mejillones', 'Pescado', 'unidad'),
('Lata de berberechos', 'Pescado', 'unidad'),
('Sopa enlatada', 'Despensa', 'unidad'),
('Puré de patatas', 'Despensa', 'unidad'),
('Caldo de pollo', 'Legumbres', 'litros'),
('Caldo de verduras', 'Legumbres', 'litros'),
('Puré de verduras', 'Legumbres', 'unidad'),
('Salsa de tomate', 'Alimentación seca', 'litros'),
('Ketchup', 'Alimentación seca', 'litros'),
('Mayonesa', 'Alimentación seca', 'litros'),
('Aceite de girasol', 'Alimentación seca', 'litros'),
('Vinagre balsámico', 'Alimentación seca', 'litros'),
('Miel', 'Alimentación seca', 'kg'),
('Mostaza', 'Alimentación seca', 'kg'),
('Pechugas de pollo', 'Carne', 'kg'),
('Pechugas de pavo', 'Carne', 'kg'),
('Filetes de merluza', 'Pescado', 'kg'),
('Bacalao', 'Pescado', 'kg'),
('Pargo', 'Pescado', 'kg'),
('Trucha', 'Pescado', 'kg'),
('Salmón ahumado', 'Pescado', 'kg'),
('Langostinos', 'Pescado', 'kg'),
('Pulpo', 'Pescado', 'kg'),
('Calamares congelados', 'Pescado', 'kg'),
('Gambas congeladas', 'Pescado', 'kg'),
('Aceite de coco', 'Alimentación seca', 'litros'),
('Aceite de palma', 'Alimentación seca', 'litros'),
('Harina de avena', 'Alimentación seca', 'kg'),
('Pan rallado', 'Alimentación seca', 'kg')
");

//Lista de la compra
$sql = "CREATE TABLE IF NOT EXISTS listacompra_productos (
    id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT(20) UNSIGNED NOT NULL,
    productos VARCHAR(100) NOT NULL,
    cantidad VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
)";
mysqli_query($conexion, $sql);

$sql = "CREATE TABLE IF NOT EXISTS favoritos (
    id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT(20) UNSIGNED NOT NULL,
    id_receta VARCHAR(100) NOT NULL,
    fecha_favorito DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
)";
mysqli_query($conexion, $sql);

// tabla para almacenar las recetas que ha creado el usuario
$sql = "CREATE TABLE IF NOT EXISTS recetas_creadas (
    id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT(20) UNSIGNED NOT NULL,
    id_receta VARCHAR(100) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
)";
mysqli_query($conexion, $sql);

// $sql = "INSERT INTO listacompra_productos (id_lista_compra, id_producto, cantidad, comprado) VALUES
// (1, 1, 1, false),
// (1, 2, 2, true),
// (1, 3, 1, false),
// (1, 4, 1, false),
// (1, 5, 6, true),
// (1, 6, 1, false),
// (2, 26, 1, false),
// (2, 16, 2, true),
// (2, 18, 1, true),
// (2, 14, 1, true),
// (2, 27, 1, false),
// (2, 35, 1, true),
// (2, 10, 0.5, false),
// (3, 8, 2, true),
// (3, 42, 2, false),
// (3, 38, 1, true),
// (3, 15, 1, false),
// (3, 3, 2, true),
// (3, 9, 1, false),
// (4, 43, 2, true),
// (4, 38, 2, true),
// (4, 51, 1, false),
// (4, 48, 2, true),
// (4, 12, 2, true),
// (4, 33, 1, false),
// (4, 52, 2, true),
// (4, 50, 1, false)";

// mysqli_query($conexion, $sql);
