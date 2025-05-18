<?php
include '../../conecta-mongo.php';
include '../../conecta-mysql.php';
session_start();
if (!isset($_SESSION['user']['id'])) {
    echo json_encode(["success" => false, "message" => "No estás autenticado"]);
    exit;
}

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
    if (isset($_SESSION['user']['id'])) {
        $usuario = $_SESSION['user']['id'];
        $recetaId = $receta['_id'];

        // Comprobar si la receta está en favoritos
        $sql = "SELECT * FROM favoritos WHERE id_usuario = ? AND id_receta = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("is", $usuario, $recetaId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // La receta está en favoritos
            $receta['favorito'] = true;
        }
    }
    $recetasArray[] = $receta;
}

if (count($recetasArray) > 0) {
    echo json_encode(["success" => true, "recetas" => $recetasArray, "n_recetas" => count($recetasArray)]);
} else {
    // No se encontraron recetas y muestra un mensaje con el error recibido de la bbdd

    echo json_encode(["success" => false, "message" => "No se encontraron recetas"]);
}
