<?php
include '../../conecta-mongo.php';
include '../../conecta-mysql.php';
session_start();
if (!isset($_SESSION['user']['id'])) {
    echo json_encode(["success" => false, "message" => "No estás autenticado"]);
    exit;
}

json_decode(file_get_contents('php://input'), true);
$input = json_decode(file_get_contents('php://input'), true);

header('Content-Type: application/json');

$collection = $db->recetas;
$recetas = $collection->find([
    '_id' => $_GET['recetaId'] ? new MongoDB\BSON\ObjectId($_GET['recetaId']) : null
]);

$recetasArray = [];
foreach ($recetas as $receta) {
    $recetasArray[] = $receta;
}


if (count($recetasArray) > 0) {
    echo json_encode(["success" => true, "recetas" => $recetasArray]);
} else {
    // No se encontraron recetas y muestra un mensaje con el error recibido de la bbdd

    echo json_encode(["success" => false, "message" => "No se encontraron recetas"]);
}
