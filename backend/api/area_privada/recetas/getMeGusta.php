<?php
include '../../conecta-mysql.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user']['id'])) {
    echo json_encode(["success" => false, "message" => "No estás autenticado"]);
    exit;
}

$usuario = $_SESSION['user']['id'];

$sql = "SELECT id_receta FROM me_gusta WHERE id_usuario = ?";
$stmt = $conexion->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Error en la consulta"]);
    exit;
}
$stmt->bind_param("i", $usuario);
$stmt->execute();
$result = $stmt->get_result();

$meGusta = [];
while ($row = $result->fetch_assoc()) {
    $meGusta[] = $row['id_receta'];
}

echo json_encode([
    "success" => true,
    "me_gusta" => $meGusta
]);
?>
