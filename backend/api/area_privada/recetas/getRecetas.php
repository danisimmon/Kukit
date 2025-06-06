<?php
include '../../conecta-mongo.php';
include '../../conecta-mysql.php';

session_start();
if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id'])) {
    echo json_encode(["success" => false, "message" => "Usuario no autenticado"]);
    exit();
}

header('Content-Type: application/json');

$collection = $db->recetas;
$recetas = $collection->find();

$recetasArray = [];
$usuarioLogueado = isset($_SESSION['user']['id']) ? $_SESSION['user']['id'] : null;

foreach ($recetas as $receta) {
    $receta['_id'] = (string)$receta['_id'];
    $receta['favorito'] = false;
    $receta['usuarioDioLike'] = false;

    if ($usuarioLogueado) {
        $recetaId = $receta['_id'];

        $sql_favorito = "SELECT 1 FROM favoritos WHERE id_usuario = ? AND id_receta = ?";
        $stmt_favorito = $conexion->prepare($sql_favorito);
        $stmt_favorito->bind_param("is", $usuarioLogueado, $recetaId);
        $stmt_favorito->execute();
        $result_favorito = $stmt_favorito->get_result();

        if ($result_favorito->num_rows > 0) {
            $receta['favorito'] = true;
        }
        $stmt_favorito->close();

        $sql_like = "SELECT 1 FROM me_gusta WHERE id_usuario = ? AND id_receta = ?";
        $stmt_like = $conexion->prepare($sql_like);
        $stmt_like->bind_param("is", $usuarioLogueado, $recetaId);
        $stmt_like->execute();
        $result_like = $stmt_like->get_result();

        if ($result_like->num_rows > 0) {
            $receta['usuarioDioLike'] = true;
        }
        $stmt_like->close();
    }
    $recetasArray[] = $receta;
}

if (count($recetasArray) > 0) {
    echo json_encode(["success" => true, "recetas" => $recetasArray, "n_recetas" => count($recetasArray)]);
} else {

    echo json_encode(["success" => false, "message" => "No se encontraron recetas"]);
}
