<?php
include 'conecta-mysql.php';

$id_usuario = $_POST['id_usuario'];
$id_receta = $_POST['id_receta'];

// Comprobar si ya es favorito
$sql = "SELECT * FROM favoritos WHERE id_usuario = ? AND id_receta = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ii", $id_usuario, $id_receta);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    // Ya es favorito, entonces lo quitamos
    $sql = "DELETE FROM favoritos WHERE id_usuario = ? AND id_receta = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ii", $id_usuario, $id_receta);
    $stmt->execute();
    echo "eliminado";
} else {
    // No es favorito, lo añadimos
    $sql = "INSERT INTO favoritos (id_usuario, id_receta) VALUES (?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ii", $id_usuario, $id_receta);
    $stmt->execute();
    echo "añadido";
}
?>
