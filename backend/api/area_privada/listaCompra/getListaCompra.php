<!-- crear get que reciba los datos de la lista de la compra de mysql -->
<?php
require '../vendor/autoload.php'; // Asegúrate de incluir el autoload de Composer

include 'conecta-mysql.php';
session_start();
// Obtener los datos de la lista de la compra desde MySQL
$query = "SELECT * FROM listacompra_productos WHERE idUsuario = ?"; 
// Cambia el idUsuario según sea necesario
$resultado = mysqli_query($conexion, $query);
if (!$resultado) {
    die("Error en la consulta: " . mysqli_error($conexion));
}
// Crear un array para almacenar los datos de la lista de la compra
$listaCompra = [];
while ($fila = mysqli_fetch_assoc($resultado)) {
    $listaCompra[] = [
        "id" => $fila['id'],
        "id_producto" => $fila['id_producto'],
        "cantidad" => $fila['cantidad']
    ];
}
// Devolver una respuesta JSON
header('Content-Type: application/json');
echo json_encode([
    "status" => "success",
    "message" => "Lista de compra recibida correctamente",
    "data" => $listaCompra
]);
?>
