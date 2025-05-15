<?php
include '../../conecta-mongo.php';
// session_start();
// if (!isset($_SESSION['user']['id'])) {
//     echo json_encode(["success" => false, "message" => "No estás autenticado"]);
//     exit;
// }
header('Content-Type: application/json');

$collection = $db->recetas;
$recetas = $collection->find();

// $recetasArray = iterator_to_array($recetas);

// if (count($recetasArray) === 0) {
//     echo json_encode(["success" => false, "message" => "No se encontraron recetas"]);
//     exit;
// }
$recetasArray = [];
foreach ($recetas as $receta) {
    $receta['_id'] = (string)$receta['_id'];
    $recetasArray[] = $receta;
}

if (count($recetasArray) > 0) {
    echo json_encode(["success" => true, "recetas" => $recetasArray, "n_recetas" => count($recetasArray)]);
} else {
    echo json_encode(["success" => false, "message" => "No se encontraron recetas"]);
}
