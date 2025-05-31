<?php
include '../../conecta-mongo.php';
include '../../conecta-mysql.php';

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
    //si esta en favoritos que eso lo guardamos en mysql 
    $receta['favorito'] = false;
    $recetasArray[] = $receta;
}

if (count($recetasArray) > 0) {
    echo json_encode(["success" => true, "recetas" => $recetasArray, "n_recetas" => count($recetasArray)]);
} else {
    // No se encontraron recetas y muestra un mensaje con el error recibido de la bbdd

    echo json_encode(["success" => false, "message" => "No se encontraron recetas"]);
}
