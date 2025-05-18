<?php
include '../../conecta-mongo.php';

header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['nombre-receta-nueva']) || empty($input['dificultad']) || empty($input['tiempo']) || empty($input['cantidad']) || empty($input['ingredientes']) || empty($input['pasos'])) {
    $data = ["success" => false, "message" => "Todos los campos son obligatorios."];
    echo json_encode($data);
    exit;
}

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombrereceta = $input['nombre-receta-nueva'];
    $dificultad = $input['dificultad'];
    $tiempo = $input['tiempo'];
    $id = $_SESSION['user']['id'];

    // Agregar la receta a la base de datos de MongoDB en la colección de recetas
    $ingredientes = $input['ingredientes'];
    $instrucciones = $input['instrucciones'];
    $ingredientes = implode(", ", $ingredientes);
    $instrucciones = implode(", ", $instrucciones);

    // Agregamos a Mongo la receta
    $bulk = new MongoDB\Driver\BulkWrite;
    $bulk->insert([
        'nombre' => $nombrereceta,
        'dificultad' => $dificultad,
        'tiempo' => $tiempo,
        'cantidad' => $input['cantidad'],
        'ingredientes' => $ingredientes,
        'instrucciones' => $instrucciones,
        'id_usuario' => $id
    ]);
    
    try {
        $result = $client->executeBulkWrite('recetas.recetas', $bulk);
        if ($result->getInsertedCount() > 0) {
            echo json_encode(["success" => true, "message" => "Receta creada correctamente"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al crear la receta"]);
        }
    } catch (MongoDB\Driver\Exception\Exception $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Perfil actualizado correctamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar el perfil"]);
    }
}