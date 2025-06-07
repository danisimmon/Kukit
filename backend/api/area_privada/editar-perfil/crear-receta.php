<?php
// Incluye el archivo de conexión a la base de datos de MongoDB
include '../../conecta-mongo.php';
// Incluye el archivo de conexión a la base de datos de MySQL
include '../../conecta-mysql.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173'); // Adjust to your frontend URL
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verifica que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Método no permitido
    echo json_encode(["success" => false, "message" => "Método no permitido. Se espera una solicitud POST."]);
    exit;
}

// Inicia la sesión para obtener el ID del usuario
session_start();
if (!isset($_SESSION['user']['id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["success" => false, "message" => "Usuario no autenticado."]);
    exit;
}
$id_usuario = $_SESSION['user']['id'];
$nombre_usuario = $_SESSION['user']['nombre'] ?? '';

// Procesa los datos de la receta
$nombre = $_POST['nombre'] ?? '';
$dificultad = $_POST['dificultad'] ?? '';
$tiempo = $_POST['tiempo'] ?? '';
$pais = $_POST['pais'] ?? '';
$gluten = isset($_POST['gluten']) && $_POST['gluten'] === 'true';
$vegetariana = isset($_POST['vegetariana']) && $_POST['vegetariana'] === 'true';
$lactosa = isset($_POST['lactosa']) && $_POST['lactosa'] === 'true';
$vegana = isset($_POST['vegana']) && $_POST['vegana'] === 'true';

// Procesa los ingredientes (deben venir como JSON string desde FormData)
$ingredientes = [];
if (isset($_POST['ingredientes'])) {
    $ingredientes = json_decode($_POST['ingredientes'], true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Error al decodificar los ingredientes."]);
        exit;
    }
}

// Procesa los pasos (deben venir como JSON string desde FormData)
$pasos = [];
if (isset($_POST['pasos'])) {
    $pasos = json_decode($_POST['pasos'], true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Error al decodificar los pasos."]);
        exit;
    }
}

// Procesa la imagen
$imageUrl = null;
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['imagen']['tmp_name'];
    $fileName = $_FILES['imagen']['name'];
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];

    if (in_array($fileExt, $allowedExts)) {
        $newFileName = md5(uniqid()) . '.' . $fileExt;
        $uploadDir = '../../img/recetas/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $imageUrl = 'http://localhost/api/img/recetas/' . $newFileName; // Store the relative path in the database
        } else {
            echo json_encode(["success" => false, "message" => "Error al mover la imagen al directorio de destino."]);
            exit;
        }
    } else {
        echo json_encode(["success" => false, "message" => "Formato de imagen no permitido. Solo se permiten JPG, JPEG, PNG y GIF."]);
        exit;
    }
} elseif (isset($_FILES['imagen']) && $_FILES['imagen']['error'] !== UPLOAD_ERR_NO_FILE) {
    echo json_encode(["success" => false, "message" => "Error al cargar la imagen: " . $_FILES['imagen']['error']]);
    exit;
}

// Agregamos a MongoDB la receta
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
    'idUsuario' => $nombre_usuario,
    'href' => $imageUrl 
];

try {
    global $db;
    $coleccionRecetas = $db->selectCollection('recetas');
    $result = $coleccionRecetas->insertOne($receta);
    if ($result->getInsertedCount() > 0) {
        $id_receta = (string)$result->getInsertedId();
        // Ahora insertamos la relación en MySQL
        $sql = "INSERT INTO recetas_creadas (id_receta, id_usuario) VALUES (?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("si", $id_receta, $id_usuario);
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "Receta creada correctamente", "id_receta" => $id_receta]);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(["success" => false, "message" => "Error al crear la receta en la base de datos."]);
    }
} catch (MongoDB\Driver\Exception\Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Error de MongoDB: " . $e->getMessage()]);
} finally {
    $conexion->close();
}
?>