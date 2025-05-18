<?php
include '../../conecta-mongo.php';
include '../../conecta-mysql.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user']['id'])) {
    echo json_encode(["success" => false, "message" => "No estás autenticado"]);
    exit;
}

$usuario = $_SESSION['user']['id'];

// Obtener los ID de recetas favoritas desde MySQL
$sql = "SELECT id_receta FROM favoritos WHERE id_usuario = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $usuario);
$stmt->execute();
$result = $stmt->get_result();

$favoritosIds = [];
while ($row = $result->fetch_assoc()) {
    $favoritosIds[] = $row['id_receta'];
}

// Si no hay favoritos, devolvemos vacío
if (empty($favoritosIds)) {
    echo json_encode(["success" => true, "recetas" => [], "n_recetas" => 0]);
    exit;
}

// Buscar recetas en MongoDB que estén en la lista de favoritos
$collection = $db->selectCollection('recetas');
$objectIds = [];
foreach ($favoritosIds as $id) {
    try {
        $objectIds[] = new MongoDB\BSON\ObjectId($id);
    } catch (\MongoDB\Driver\Exception\InvalidArgumentException $e) {
        // Si el ID no es un ObjectId válido, lo ignoramos o logueamos el error
        error_log("ID de favorito no válido: " . $id);
    }
}

$recetasArray = [];
if (!empty($objectIds)) {
    $cursor = $collection->find([
        '_id' => ['$in' => $objectIds]
    ]);

    foreach ($cursor as $receta) {
        $receta['_id'] = (string)$receta['_id'];
        $receta['favorito'] = true; // todas son favoritas
        $recetasArray[] = $receta;
    }
}

echo json_encode([
    "success" => true,
    "recetas" => $recetasArray,
    "n_recetas" => count($recetasArray)
]);