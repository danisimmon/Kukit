<?php 
include "../../conecta-mysql.php";
header('Content-Type: application/json');

session_start();
if (!isset($_SESSION['user']['id'])) {
    echo json_encode(array("success" => "false", "message" => "Sesion no iniciada"));
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['id_producto']) || empty($input['cantidad'])) {
    echo json_encode(array("success" => "false", "message" => "Todos los campos son obligatorios."));
    exit();
}

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id_producto = $input['id_producto'];
    $cantidad = $input['cantidad'];
    $id_usuario = $_SESSION['user']['id'];

    // Verificar si el producto ya está en la lista de compra
    $sql = "SELECT * FROM lista_compra WHERE id_producto = ? AND id_usuario = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ii", $id_producto, $id_usuario);
    $stmt->execute();
    $queryProducto = $stmt->get_result();

    if ($queryProducto->num_rows > 0) {
        echo json_encode(array("success" => "false", "message" => "Este producto ya está en la lista de compra"));
        exit();
    }

    // Insertar el producto en la lista de compra
    $sql = "INSERT INTO lista_compra (id_producto, id_usuario, cantidad) VALUES (?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("iii", $id_producto, $id_usuario, $cantidad);

    if ($stmt->execute()) {
        echo json_encode(array("success" => "true", "message" => "Producto agregado a la lista de compra"));
    } else {
        echo json_encode(array("success" => "false", "message" => "Error al agregar el producto a la lista de compra"));
    }
}

