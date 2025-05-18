<?php
include 'conecta-mysql.php';

$id_usuario = $_GET['id_usuario']; // o usa POST si lo prefieres

$sql = "SELECT r.*
        FROM recetas r
        JOIN favoritos f ON r.id = f.id_receta
        WHERE f.id_usuario = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$resultado = $stmt->get_result();

$favoritos = array();

while ($fila = $resultado->fetch_assoc()) {
    $favoritos[] = $fila;
}

echo json_encode($favoritos);
?>
