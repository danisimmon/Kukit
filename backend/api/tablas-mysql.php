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

$password = password_hash('RanaVelcro@33', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Operación Camarón', 'operacioncamaron@gmail.es', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('Sara.Villanueva', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Sara Villanueva', 'SARA.VILLANUEVA@universidadeuropea.es', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('Irene.Delrincon', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Irene Del Rincón', 'irene.delrincon@universidadeuropea.es', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('Duneplay@123', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Daniel Simón', '22348403@live.uem.es', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('Ruben@123', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Rubén Peña', '22337489@live.uem.es', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('Ainhoa@123', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Ainhoa Blanca', '22360520@live.uem.es', '$password')";
mysqli_query($conexion, $sql);

$password = password_hash('Manu@123', PASSWORD_DEFAULT);
$sql = "INSERT INTO usuario (nombre, email, password) VALUES ('Manuel Gómez', '22301982@live.uem.es', '$password')";
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

$sql = "CREATE TABLE IF NOT EXISTS me_gusta (
  id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT(20) UNSIGNED NOT NULL,
  id_receta VARCHAR(100) NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
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

$sql = "CREATE TABLE IF NOT EXISTS plan_alimentacion (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT UNSIGNED NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
  UNIQUE KEY idx_usuario_plan_unico (id_usuario)
)";
mysqli_query($conexion, $sql);

$sql = "CREATE TABLE IF NOT EXISTS plan_alimentacion_semanas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_plan_alimentacion INT UNSIGNED NOT NULL,
  numero_semana TINYINT NOT NULL,
  datos_semana JSON,
  FOREIGN KEY (id_plan_alimentacion) REFERENCES plan_alimentacion(id) ON DELETE CASCADE,
  UNIQUE KEY idx_plan_semana_unica (id_plan_alimentacion, numero_semana)
)";
mysqli_query($conexion, $sql);

