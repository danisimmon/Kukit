<?php
require '../../../vendor/autoload.php'; // Asegúrate de incluir el autoload de Composer
include '../../conecta-mysql.php';
header('Content-Type: application/json');
session_start();
// Verificar si la sesión está iniciada
if (!isset($_SESSION['user']['id'])) {
    echo json_encode(array("success" => "false", "message" => "Sesion no iniciada"));
    exit();
}

// Obtener los datos de la lista de la compra desde MySQL
$query = "SELECT * FROM listacompra_productos WHERE id_usuario = ?";
$stmt = $conexion->prepare($query);
$stmt->bind_param("i", $_SESSION['user']['id']);
$stmt->execute();
$resultado = $stmt->get_result();
if (!$resultado) {
    die("Error en la consulta: " . mysqli_error($conexion));
}

// Crear un array para almacenar los datos de la lista de la compra
$listaCompra = [];
while ($fila = mysqli_fetch_assoc($resultado)) {
    $id_producto = $fila['id_producto'];
    $cantidad = $fila['cantidad'];

    // Obtener los detalles del producto
    $queryProducto = "SELECT * FROM productos WHERE id = ?";
    $stmtProducto = $conexion->prepare($queryProducto);
    $stmtProducto->bind_param("i", $id_producto);
    $stmtProducto->execute();
    $resultadoProducto = $stmtProducto->get_result();
    if ($resultadoProducto) {
        $producto = mysqli_fetch_assoc($resultadoProducto);
        if ($producto) {
            // Agregar el producto a la lista de compra
            $listaCompra[] = [
                "id_producto" => $id_producto,
                "nombre" => $producto['nombre'],
                "cantidad" => $cantidad
            ];
        }
    }
}

// Devolver una respuesta JSON
echo json_encode([
    "status" => "success",
    "message" => "Lista de compra recibida correctamente",
    "data" => $listaCompra
]);
?>
