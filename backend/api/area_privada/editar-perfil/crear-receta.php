<?php
// Incluye el archivo de conexión a la base de datos
include '../../conecta-mongo.php';

header('Content-Type: application/json');

// Verifica que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Método no permitido
    echo json_encode(["success" => false, "message" => "Método no permitido. Se espera una solicitud POST."]);
    exit;
}

// Obtiene los datos del cuerpo de la la solicitud en formato JSON
$input = json_decode(file_get_contents('php://input'), true);

// Verifica que los datos se hayan recibido correctamente
if (!$input) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "message" => "No se recibieron datos o el formato no es válido. Se espera un JSON."]);
    exit;
}

// Valida que todos los campos requeridos estén presentes
$campos_requeridos = ['nombre', 'dificultad', 'tiempo', 'ingredientes', 'pasos'];
foreach ($campos_requeridos as $campo) {
    if (empty($input[$campo])) {
        http_response_code(400); // Bad Request
        echo json_encode(["success" => false, "message" => "El campo '$campo' es obligatorio."]);
        exit;
    }
}

// Inicia la sesión para obtener el ID del usuario
session_start();
if (!isset($_SESSION['user']['id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["success" => false, "message" => "Usuario no autenticado."]);
    exit;
}
$id_usuario = $_SESSION['user']['id'];

// Procesa los datos de la receta
$nombre = $input['nombre'];
$dificultad = $input['dificultad'];
$tiempo = $input['tiempo'];
$ingredientes = $input['ingredientes']; // Ya es un array desde el frontend
$pasos = $input['pasos']; // Ya es un array desde el frontend
$pais = $input['pais'];
$gluten = $input['gluten'];
$vegetariana = $input['vegetariana'];
$lactosa = $input['lactosa'];
$vegana = $input['vegana'];

// Agregamos a Mongo la receta
$receta = [
    'nombre' => $nombre,
    'dificultad' => $dificultad,
    'tiempo' => $tiempo,
    'pais' => $pais,
    'gluten' => $gluten,
    'vegetariana' => $vegetariana,
    'lactosa' => $lactosa,
    'vegana' => $vegana,
    'ingredientes' => $ingredientes,
    'pasos' => $pasos,
    'id_usuario' => $id_usuario
];

try {
    // Accede a la variable $db desde el ámbito global, ya que conecta-mongo.php la define
    global $db;
    $coleccionRecetas = $db->selectCollection('recetas');
    $result = $coleccionRecetas->insertOne($receta);
    if ($result->getInsertedCount() > 0) {
        echo json_encode(["success" => true, "message" => "Receta creada correctamente"]);
        // aqui necesuitamos el ID de la receta creada en MySQL para que se pueda relacionar con el usuario
        $id_receta = (string)$result->getInsertedId();
        // Ahora insertamos la relación en MySQL
        include '../../conecta-mysql.php';
        $sql = "INSERT INTO recetas_creadas (id_receta, id_usuario) VALUES (?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("si", $id_receta, $id_usuario);
        $stmt->execute();
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(["success" => false, "message" => "Error al crear la receta en la base de datos."]);
    }
} catch (MongoDB\Driver\Exception\Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Error de MongoDB: " . $e->getMessage()]);
}
?>
