<?php
session_start();
require '../conecta-mysql.php';
if (!isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit();
}

$id = $_SESSION['user']['id'];

// Borra datos asociados
$conexion->query("DELETE FROM lista_compra WHERE id_usuario = $id");
$conexion->query("DELETE FROM favoritos WHERE id_usuario = $id");
$conexion->query("DELETE FROM recetas_creadas WHERE id_usuario = $id");
$conexion->query("DELETE FROM listacompra_productos WHERE id_usuario = $id");

// Borra el usuario
$stmt = $conexion->prepare("DELETE FROM usuario WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    session_destroy();
    unset($_SESSION);
    echo json_encode(['success' => true]);
    exit();
} else {
    echo json_encode(['success' => false, 'message' => 'Error al borrar usuario']);
    exit();
}