<!-- crear update que reciba los datos de la lista de la compra de mysql -->
<?php
require '../vendor/autoload.php'; // Asegúrate de incluir el autoload de Composer
include 'conecta-mysql.php';
session_start();

header('Content-Type: application/json');

//Leer el contenido del cuerpo de la petición
$input = json_decode(file_get_contents('php://input'), true);

//Validar que se recibieron los datos necesarios
if (!isset($input['id_producto']) || !isset($input['cantidad'])) {
    echo json_encode(array("success" => "false", "message" => "Todos los campos son obligatorios."));
    exit();
}

//Verificar si la sesión está iniciada
if (!isset($_SESSION['user']['id'])) {
    echo json_encode(array("success" => "false", "message" => "Sesion no iniciada"));
    exit();
}
// Obtener el id del usuario de la sesión
$id_usuario = $_SESSION['user']['id'];
$id_producto = $input['id_producto'];
$cantidad = $input['cantidad'];
// Verificar si el producto ya está en la lista de compra
$sql = "SELECT * FROM lista_compra WHERE id_producto = ? AND id_usuario = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ii", $id_producto, $id_usuario);
$stmt->execute();
$queryProducto = $stmt->get_result();
if ($queryProducto->num_rows == 0) {
    echo json_encode(value: array("success" => "false", "message" => "Este producto no está en la lista de compra"));
    exit();
}
// Actualizar la cantidad del producto en la lista de compra
$sql = "UPDATE lista_compra SET cantidad = ? WHERE id_producto = ? AND id_usuario = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("iii", $cantidad, $id_producto, $id_usuario);
if ($stmt->execute()) {
    echo json_encode(array("success" => "true", "message" => "Cantidad actualizada correctamente"));
} else {
    echo json_encode(array("success" => "false", "message" => "Error al actualizar la cantidad"));
}
