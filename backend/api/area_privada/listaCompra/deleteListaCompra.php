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

if($_SERVER['REQUES_METHOD'] == 'POST'){
    $id_producto = $input['id_producto'];
    $cantidad = $input['cantidad'];
    $id_usuario = $_SESSION['user']['id'];

    $query = "DELETE FROM lista_compra WHERE id_producto = ? AND id_usuario = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("ii", $id_producto, $id_usuario);
    $stmt->execute();
    $queryBorrar = $stmt->get_result();

    if ($queryBorrar->num_rows> 0) {
        echo json_encode(array("success" => "false", "message" => "Error en la consulta SQL."));
        exit();
    }
    if ($stmt->execute()) {
        echo json_encode(array("success" => "true", "message" => "Producto eliminado de la lista de compra."));
    } else {
        echo json_encode(array("success" => "false", "message" => "Error al eliminar el producto de la lista de compra."));
    }
}