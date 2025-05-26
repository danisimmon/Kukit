<?php
header('Content-Type: application/json');
include '../../conecta-mongo.php';
include '../../conecta-mysql.php';

// Verificar si la sesión está iniciada
if (!isset($_SESSION['user']['id'])) {
    echo json_encode(array("success" => "false", "message" => "Sesion no iniciada"));
    exit();
}

try {
    // Leer JSON enviado por POST
    $json = file_get_contents('php://input');
    $planSemanal = json_decode($json, true);

    if (!$planSemanal) {
        throw new Exception("Datos inválidos o JSON no recibido");
    }

    // Validar que exista idUsuario, fechaInicio y fechaFin (ejemplo mínimo)
    if (
        empty($planSemanal['idUsuario']) ||
        empty($planSemanal['fechaInicio']) ||
        empty($planSemanal['fechaFin']) ||
        !isset($planSemanal['menus'])
    ) {
        throw new Exception("Faltan campos obligatorios en el plan semanal");
    }

    $collection = $db->selectCollection('plan-semanal');

    // Buscar plan existente por idUsuario y rango de fechas para actualizar
    $filtro = [
        'idUsuario' => $planSemanal['idUsuario'],
        'fechaInicio' => $planSemanal['fechaInicio'],
        'fechaFin' => $planSemanal['fechaFin']
    ];

    // Si quieres manejar _id explícito:
    // $planSemanal['_id'] = new MongoDB\BSON\ObjectId();

    // Reemplazar o insertar (upsert)
    $resultado = $collection->updateOne(
        $filtro,
        ['$set' => $planSemanal],
        ['upsert' => true]
    );

    echo json_encode([
        'success' => true,
        'matchedCount' => $resultado->getMatchedCount(),
        'modifiedCount' => $resultado->getModifiedCount(),
        'upsertedId' => (string) $resultado->getUpsertedId()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}