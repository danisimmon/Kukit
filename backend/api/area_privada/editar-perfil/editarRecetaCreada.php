<?php
// Incluye el archivo de conexión a la base de datos de MongoDB
include '../../conecta-mongo.php';
// Incluye el archivo de conexión a la base de datos de MySQL (aunque no se usa directamente para actualizar la receta en Mongo, puede ser necesario para la sesión)
include '../../conecta-mysql.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173'); // Ajusta a la URL de tu frontend
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Manejar la solicitud preflight OPTIONS
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

// Inicia la sesión para obtener el ID del usuario y verificar autenticación
session_start();
if (!isset($_SESSION['user']['id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["success" => false, "message" => "Usuario no autenticado."]);
    exit;
}
$id_usuario_sesion = $_SESSION['user']['id'];

// Obtener el ID de la receta a actualizar
$recetaId = $_POST['recetaId'] ?? null;
if (!$recetaId) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "message" => "No se proporcionó el ID de la receta a actualizar."]);
    exit;
}

// Convertir recetaId a ObjectId de MongoDB
try {
    $recetaObjectId = new MongoDB\BSON\ObjectId($recetaId);
} catch (MongoDB\Driver\Exception\InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID de receta no válido para MongoDB.']);
    exit;
}


// Procesa los datos de la receta
$nombre = $_POST['nombre'] ?? '';
$dificultad = $_POST['dificultad'] ?? '';
$tiempo = $_POST['tiempo'] ?? '';
$pais = $_POST['pais'] ?? '';
$gluten = isset($_POST['gluten']) && $_POST['gluten'] === 'true';
$vegetariana = isset($_POST['vegetariana']) && $_POST['vegetariana'] === 'true';
$lactosa = isset($_POST['lactosa']) && $_POST['lactosa'] === 'true';
$vegana = isset($_POST['vegana']) && $_POST['vegana'] === 'true';

// Procesa los ingredientes
$ingredientes = [];
if (isset($_POST['ingredientes'])) {
    $ingredientesDecoded = json_decode($_POST['ingredientes'], true);
    if (json_last_error() === JSON_ERROR_NONE) {
        $ingredientes = $ingredientesDecoded;
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Error al decodificar los ingredientes."]);
        exit;
    }
}

// Procesa los pasos
$pasos = [];
if (isset($_POST['pasos'])) {
    $pasosDecoded = json_decode($_POST['pasos'], true);
    if (json_last_error() === JSON_ERROR_NONE) {
        $pasos = $pasosDecoded;
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Error al decodificar los pasos."]);
        exit;
    }
}

// Campos a actualizar en MongoDB
$updateData = [
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
    // 'id_usuario' no se actualiza, ya que el creador no cambia.
    // 'fecha_creacion' tampoco se actualiza.
    // Se podría añadir un campo 'fecha_actualizacion'.
    'fecha_actualizacion' => new MongoDB\BSON\UTCDateTime()
];

// Procesa la imagen si se envió una nueva
$nuevaImagenUrl = null;
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['imagen']['tmp_name'];
    $fileName = $_FILES['imagen']['name'];
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];

    if (in_array($fileExt, $allowedExts)) {
        $newFileName = md5(uniqid()) . '.' . $fileExt;
        $uploadDir = '../../img/recetas/'; // Asegúrate que esta ruta sea correcta y tenga permisos de escritura
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $nuevaImagenUrl = 'http://localhost/api/img/recetas/' . $newFileName;
            $updateData['href'] = $nuevaImagenUrl; // Actualizar la URL de la imagen
            // Opcional: Lógica para eliminar la imagen antigua del servidor si es necesario
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Error al mover la nueva imagen al directorio de destino."]);
            exit;
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Formato de imagen no permitido. Solo se permiten JPG, JPEG, PNG y GIF."]);
        exit;
    }
} elseif (isset($_FILES['imagen']) && $_FILES['imagen']['error'] !== UPLOAD_ERR_NO_FILE) {
    // Manejo de errores de subida de imagen (como tamaño excedido, etc.)
    $upload_errors = array(
        UPLOAD_ERR_INI_SIZE   => "El archivo excede la directiva upload_max_filesize en php.ini.",
        UPLOAD_ERR_FORM_SIZE  => "El archivo excede la directiva MAX_FILE_SIZE especificada en el formulario HTML.",
        UPLOAD_ERR_PARTIAL    => "El archivo fue solo parcialmente subido.",
        UPLOAD_ERR_NO_TMP_DIR => "Falta una carpeta temporal.",
        UPLOAD_ERR_CANT_WRITE => "No se pudo escribir el archivo en el disco.",
        UPLOAD_ERR_EXTENSION  => "Una extensión de PHP detuvo la subida del archivo.",
    );
    $error_code = $_FILES['imagen']['error'];
    $message = isset($upload_errors[$error_code]) ? $upload_errors[$error_code] : "Error desconocido al cargar la imagen (código: $error_code).";
    http_response_code(400);
    echo json_encode(["success" => false, "message" => $message]);
    exit;
}
// Si no se sube una nueva imagen, $updateData['href'] no se establecerá,
// por lo que la URL de la imagen existente en MongoDB no se modificará a menos que se maneje explícitamente.

try {
    global $db; // Asegúrate de que $db (conexión MongoDB) esté disponible
    $coleccionRecetas = $db->selectCollection('recetas');

    // Verificar que el usuario que edita es el mismo que creó la receta
    // (o si tienes roles de administrador, ajustar esta lógica)
    $recetaExistente = $coleccionRecetas->findOne(['_id' => $recetaObjectId]);
    if (!$recetaExistente) {
        http_response_code(404); // Not Found
        echo json_encode(["success" => false, "message" => "La receta a actualizar no existe."]);
        exit;
    }

    // Comprobar si el campo id_usuario existe en el documento de la receta
    if (!isset($recetaExistente['id_usuario'])) {
        http_response_code(500); 
        echo json_encode(["success" => false, "message" => "La receta no tiene un propietario asignado."]);
        exit;
    }
    
    if ((string)$recetaExistente['id_usuario'] !== (string)$id_usuario_sesion) {
        http_response_code(403); // Forbidden
        echo json_encode(["success" => false, "message" => "No tienes permiso para editar esta receta."]);
        exit;
    }

    // Actualizar la receta en MongoDB
    $result = $coleccionRecetas->updateOne(
        ['_id' => $recetaObjectId, 'id_usuario' => $id_usuario_sesion], // Condición para asegurar que solo el propietario pueda editar
        ['$set' => $updateData]
    );

    if ($result->getModifiedCount() > 0) {
        $responseData = ["success" => true, "message" => "Receta actualizada correctamente"];
        if ($nuevaImagenUrl) {
            $responseData['nuevaImagenUrl'] = $nuevaImagenUrl; // Enviar la URL de la nueva imagen si se actualizó
        }
        echo json_encode($responseData);
    } elseif ($result->getMatchedCount() > 0 && $result->getModifiedCount() === 0) {
        // Se encontró el documento pero no se modificó nada (quizás los datos eran idénticos)
        echo json_encode(["success" => true, "message" => "No se realizaron cambios en la receta (datos idénticos)."]);
    }
    else {
        // No se encontró la receta o no se pudo modificar (podría ser por la condición id_usuario)
        http_response_code(404); // O 403 si es un problema de permisos no detectado antes
        echo json_encode(["success" => false, "message" => "No se pudo actualizar la receta. Verifica que seas el propietario y que la receta exista."]);
    }

} catch (MongoDB\Driver\Exception\Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Error de MongoDB al actualizar: " . $e->getMessage()]);
} catch (Exception $e) { // Captura general para otros posibles errores
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error general del servidor: " . $e->getMessage()]);
} finally {
    // Cerrar conexión MySQL si está abierta y se usó
    if (isset($conexion) && $conexion instanceof mysqli) {
        $conexion->close();
    }
}
?>
