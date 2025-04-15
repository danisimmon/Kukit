<?php
require_once 'mongo-example.php';  // Asegúrate de que la conexión esté correctamente incluida

// Recibir el cuerpo de la solicitud POST (suponiendo que es JSON)
$data = json_decode(file_get_contents('php://input'), true);

// Validar que los datos estén completos
if (isset($data['nombre']) && isset($data['correo'])) {
    $nombre = $data['nombre'];
    $correo = $data['correo'];

    // Insertar el nuevo usuario en la colección 'usuarios'
    $collection = $client->kukit->usuarios;  // Asegúrate de que el nombre de la base de datos y la colección sean correctos
    $result = $collection->insertOne([
        'nombre' => $nombre,
        'correo' => $correo
    ]);

    if ($result->getInsertedCount() > 0) {
        echo json_encode(['message' => 'Usuario agregado correctamente']);
    } else {
        echo json_encode(['message' => 'Error al agregar usuario']);
    }
} else {
    echo json_encode(['message' => 'Datos incompletos']);
}
?>
