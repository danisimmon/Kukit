<?php 
include "../../conecta-mysql.php";
header('Content-Type: application/json');

session_start();
if (!isset($_SESSION['user']['id'])) {
    echo json_encode(array("success" => "false", "message" => "Sesion no iniciada"));
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['nombre']) || empty($input['cantidad'])) {
    echo json_encode(array("success" => "false", "message" => "Todos los campos son obligatorios."));
    exit();
}

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $id_producto = $input['nombre'];
    $cantidad = $input['cantidad'];
    $id_usuario = $_SESSION['user']['id'];

    $query = "DELETE FROM listacompra_productos WHERE productos = ? AND id_usuario = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("si", $id_producto, $id_usuario);
    $stmt->execute();
    //Comprobar si se ha eliminado correctamente
    if ($stmt->affected_rows > 0) {
        echo json_encode(array("success" => "true", "message" => "Producto eliminado de la lista de compra"));
    } else {
        echo json_encode(array("success" => "false", "message" => "Error al eliminar el producto de la lista de compra"));
    }
}