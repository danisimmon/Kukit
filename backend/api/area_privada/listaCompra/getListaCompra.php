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

    // Agregar el producto a la lista de compra
    $listaCompra[] = [
        "nombre" => $fila['productos'],
        "cantidad" => $fila['cantidad']
    ];
}

// Devolver una respuesta JSON
echo json_encode([
    "status" => "success",
    "message" => "Lista de compra recibida correctamente",
    "data" => $listaCompra
]);
