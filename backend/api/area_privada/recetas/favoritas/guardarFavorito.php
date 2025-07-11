<?php
include "../../../conecta-mysql.php";

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

session_start();
if (!isset($_SESSION['user']) || empty($_SESSION['user']) || !isset($_SESSION['user']['id']) || empty($_SESSION['user']['id'])) {
    echo json_encode(array('success' => false, 'message' => 'No hay usuario logueado'));
    exit();
}

if (!isset($input['id_receta']) || empty($input['id_receta'])) {
    echo json_encode(array('success' => false, 'message' => 'No se ha recibido el id de la receta'));
    exit();
}

$usuario = $_SESSION['user']['id'];
$receta = $input['id_receta'];

// Si $receta es un objeto, intenta acceder a su propiedad $oid o convertirlo a string
if (is_object($receta)) {
    if (isset($receta->{'$oid'})) {
        $recetaIdString = $receta->{'$oid'};
    } else {
        // Si el objeto no tiene la propiedad $oid, podrías intentar convertirlo a string de otra manera
        $recetaIdString = (string) $receta; //esto puede dar problemas si el objeto no tiene una representación de cadena útil
    }
} else {
    $recetaIdString = $receta;
}


$sql = "SELECT * FROM favoritos WHERE id_usuario = ? AND id_receta = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("is", $usuario, $recetaIdString);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // La receta ya está en favoritos, eliminarla
    $sql = "DELETE FROM favoritos WHERE id_usuario = ? AND id_receta = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("is", $usuario, $recetaIdString);
    if ($stmt->execute()) {
        echo json_encode(array('success' => true, 'message' => 'Receta eliminada de favoritos'));
    } else {
        echo json_encode(array('success' => false, 'message' => 'Error al eliminar la receta de favoritos'));
    }
} else {
    // La receta no está en favoritos, agregarla
    $sql = "INSERT INTO favoritos (id_usuario, id_receta) VALUES (?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("is", $usuario, $recetaIdString);
    if ($stmt->execute()) {
        echo json_encode(array('success' => true, 'message' => 'Receta añadida a favoritos'));
    } else {
        echo json_encode(array('success' => false, 'message' => 'Error al añadir la receta a favoritos'));
    }
}
?>
