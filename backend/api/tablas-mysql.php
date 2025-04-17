<?php

include_once 'conecta-mysql.php';

$sql = "CREATE TABLE IF NOT EXISTS usuario (
    id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
    )";

mysqli_query($conexion, $sql);

// Insertamos usuarios por defecto
$password = password_hash('TrenZapato@81', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (email, password) VALUES ('pepeviyuela@gmail.com', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('FuegoTijera@37', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (email, password) VALUES ('penelopecruz@hotmail.es', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('MonoTrampa#48', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (email, password) VALUES ('koisevilla@gmail.com', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('GuitarraRosa+77', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (email, password) VALUES ('farrukito@outlook.com', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('PezCereza#66', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (email, password) VALUES ('elxokas@yahoo.es', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('SillaCometa@19', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (email, password) VALUES ('jamorant@hotmail.com', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('ToroMochila#08', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (email, password) VALUES ('andylucas@hotmail.com', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('RanaVelcro@33', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (email, password) VALUES ('operacioncamaron@gmail.es', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('CieloGalleta_96', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (email, password) VALUES ('badbunny@yahoo.com', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('TrucoSombra$74', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (email, password) VALUES ('fernandoalonso@hotmail.es', '$password')";
mysqli_query($conexion, $sql);


//Tabla password reset
$sql = "CREATE TABLE IF NOT EXISTS password_reset (
    id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(200) NOT NULL,
    codigo_verificacion VARCHAR(100) NOT NULL
)";

// Obtener los IDs de los nuevos tutores

// Obtener el id.
// $id_tutor1 = mysqli_insert_id($conexion) - 3;
// $id_tutor2 = $id_tutor1 + 1;
// $id_tutor3 = $id_tutor1 + 2;
// $id_tutor4 = $id_tutor1 + 3;

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
    (1, 'Comida familiar', 'Comida familiar de 12 personas', '15/04/2025'),
    (2, 'Cena navidad', 'Cena navidad para 8 personas', '24/12/2025'),
    (3, 'Torrijas', 'Todos los ingredientes para hacer torrijas', '16/04/2025'),
    (4, 'Cumpleaños', 'Lista de la compra para el cumpleaños de Duneplay', '30/04/2025'");


$sql = "CREATE TABLE IF NOT EXISTS productos (
    id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    unidad VARCHAR(50) NOT NULL,
    precio_estimado DECIMAL(6,2) NOT NULL
)";

mysqli_query($conexion, $sql);

mysqli_query($conexion, "INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Tomate', 'Alimentación seca', 'kg', 2.11);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Lechuga', 'Bebidas', 'litros', 2.25);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Cebolla', 'Verduras', 'unidad', 1.52);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Zanahoria', 'Carne', 'unidad', 5.01);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Pimiento', 'Fruta', 'kg', 1.87);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Judías verdes', 'Despensa', 'unidad', 3.82);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Espinacas', 'Despensa', 'unidad', 5.81);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Acelgas', 'Alimentación seca', 'pack', 2.67);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Pepino', 'Panadería', 'unidad', 3.11);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Brócoli', 'Pescado', 'kg', 4.03);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Lentejas', 'Legumbres', 'kg', 2.95);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Garbanzos', 'Panadería', 'unidad', 4.75);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Alubias blancas', 'Lácteos', 'litros', 1.44);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Soja', 'Lácteos', 'unidad', 5.26);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Judión', 'Fruta', 'kg', 7.81);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Carne picada', 'Huevos', 'docena', 4.66);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Filete de ternera', 'Verduras', 'kg', 8.42);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Pollo entero', 'Fruta', 'unidad', 9.11);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Muslos de pollo', 'Huevos', 'docena', 7.29);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Chuletas de cerdo', 'Carne', 'unidad', 5.23);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Salmón', 'Fruta', 'kg', 4.72);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Merluza', 'Huevos', 'docena', 8.77);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Atún fresco', 'Huevos', 'docena', 6.81);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Calamares', 'Fruta', 'kg', 6.57);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Gambas', 'Huevos', 'docena', 4.98);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Manzana', 'Panadería', 'unidad', 3.33);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Pera', 'Panadería', 'unidad', 2.62);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Plátano', 'Panadería', 'unidad', 5.17);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Naranja', 'Legumbres', 'pack', 3.69);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Mandarina', 'Carne', 'kg', 7.11);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Leche entera', 'Panadería', 'unidad', 4.65);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Leche semidesnatada', 'Alimentación seca', 'kg', 6.77);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Yogur natural', 'Verduras', 'unidad', 7.62);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Yogur de sabores', 'Fruta', 'unidad', 2.95);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Queso curado', 'Alimentación seca', 'kg', 2.72);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Huevos camperos', 'Huevos', 'docena', 2.52);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Huevos blancos', 'Huevos', 'docena', 6.99);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Huevos ecológicos', 'Huevos', 'docena', 6.78);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Agua mineral', 'Limpieza', 'litros', 1.28);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Zumo de naranja', 'Huevos', 'docena', 7.31);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Refresco de cola', 'Huevos', 'docena', 5.97);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Refresco de limón', 'Verduras', 'unidad', 3.63);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Cerveza', 'Huevos', 'docena', 3.08);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Vino tinto', 'Pescado', 'kg', 2.75);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Vino blanco', 'Verduras', 'kg', 3.93);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Pan de molde', 'Despensa', 'pack', 6.32);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Pan integral', 'Lácteos', 'pack', 3.47);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Bollos', 'Lácteos', 'unidad', 3.01);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Magdalenas', 'Legumbres', 'kg', 8.18);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Harina', 'Lácteos', 'litros', 2.09);INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Cereal de desayuno', 'Lácteos', 'pack', 3.44);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Galletas', 'Alimentación seca', 'kg', 1.92);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Chocolates', 'Fruta', 'unidad', 3.87);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Patatas', 'Verduras', 'kg', 2.12);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Arroz', 'Legumbres', 'kg', 1.54);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Pasta', 'Despensa', 'kg', 1.76);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Aceite de oliva', 'Alimentación seca', 'litros', 6.34);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Vinagre', 'Alimentación seca', 'litros', 1.47);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Sal', 'Lácteos', 'kg', 0.95);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Azúcar', 'Despensa', 'kg', 2.14);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Harina de trigo', 'Panadería', 'kg', 1.66);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Levadura', 'Lácteos', 'unidad', 0.78);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Chocolate en polvo', 'Panadería', 'kg', 3.51);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Café', 'Alimentación seca', 'kg', 8.94);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Té', 'Bebidas', 'kg', 4.32);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Galletas saladas', 'Alimentación seca', 'kg', 2.35);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Patatas fritas', 'Panadería', 'pack', 1.53);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Snacks', 'Bebidas', 'unidad', 2.23);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Cerveza sin alcohol', 'Bebidas', 'litros', 2.18);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Vino rosado', 'Bebidas', 'litros', 5.01);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Vino espumoso', 'Bebidas', 'litros', 6.85);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Gaseosa', 'Bebidas', 'litros', 1.67);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Leche de almendras', 'Lácteos', 'litros', 2.99);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Leche de soja', 'Lácteos', 'litros', 2.45);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Lata de atún', 'Pescado', 'unidad', 1.59);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Lata de sardinas', 'Pescado', 'unidad', 1.23);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Lata de mejillones', 'Pescado', 'unidad', 2.41);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Lata de berberechos', 'Pescado', 'unidad', 1.89);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Sopa enlatada', 'Despensa', 'unidad', 1.68);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Puré de patatas', 'Despensa', 'unidad', 3.16);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Caldo de pollo', 'Legumbres', 'litros', 2.75);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Caldo de verduras', 'Legumbres', 'litros', 2.50);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Puré de verduras', 'Legumbres', 'unidad', 1.98);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Salsa de tomate', 'Alimentación seca', 'litros', 1.69);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Ketchup', 'Alimentación seca', 'litros', 2.40);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Mayonesa', 'Alimentación seca', 'litros', 3.29);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Aceite de girasol', 'Alimentación seca', 'litros', 1.45);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Vinagre balsámico', 'Alimentación seca', 'litros', 3.18);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Miel', 'Alimentación seca', 'kg', 5.62);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Mostaza', 'Alimentación seca', 'kg', 1.85);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Pechugas de pollo', 'Carne', 'kg', 6.90);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Pechugas de pavo', 'Carne', 'kg', 7.50);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Filetes de merluza', 'Pescado', 'kg', 9.85);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Bacalao', 'Pescado', 'kg', 10.25);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Pargo', 'Pescado', 'kg', 12.30);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Trucha', 'Pescado', 'kg', 6.42);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Salmón ahumado', 'Pescado', 'kg', 15.98);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Langostinos', 'Pescado', 'kg', 14.11);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Pulpo', 'Pescado', 'kg', 18.77);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Calamares congelados', 'Pescado', 'kg', 10.50);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Gambas congeladas', 'Pescado', 'kg', 13.99);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Aceite de coco', 'Alimentación seca', 'litros', 6.99);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Aceite de palma', 'Alimentación seca', 'litros', 4.22);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Harina de avena', 'Alimentación seca', 'kg', 4.68);
INSERT INTO productos (nombre, categoria, unidad, precio_estimado) VALUES ('Pan rallado', 'Alimentación seca', 'kg', 2.56);
");







$sql = "CREATE TABLE IF NOT EXISTS listacompra_productos (
    id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_lista_compra INT(20) UNSIGNED NOT NULL,
    id_producto INT(20) UNSIGNED NOT NULL,
    cantidad DECIMAL(6,2) NOT NULL,
    comprado BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (id_lista_compra) REFERENCES lista_compra(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id)
)";
mysqli_query($conexion, $sql);

$sql = "INSERT INTO listacompra_productos (id_lista_compra, id_producto, cantidad, comprado) VALUES
(1, 1, 1, false),
(1, 2, 2, true),
(1, 3, 1, false),
(1, 4, 1, false),
(1, 5, 6, true),
(1, 6, 1, false),
(2, 26, 1, false),
(2, 16, 2, true),
(2, 18, 1, true),
(2, 14, 1, true),
(2, 27, 1, false),
(2, 35, 1, true),
(2, 10, 0.5, false),
(3, 8, 2, true),
(3, 42, 2, false),
(3, 38, 1, true),
(3, 15, 1, false),
(3, 3, 2, true),
(3, 9, 1, false),
(4, 43, 2, true),
(4, 38, 2, true),
(4, 51, 1, false),
(4, 48, 2, true),
(4, 12, 2, true),
(4, 33, 1, false),
(4, 52, 2, true),
(4, 50, 1, false)";

mysqli_query($conexion, $sql);
