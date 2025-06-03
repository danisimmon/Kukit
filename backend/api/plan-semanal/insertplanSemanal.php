<?php
header('Content-Type: application/json');
// Ajusta el origen según tu frontend para CORS
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require '../conecta-mysql.php';
require '../conecta-mongo.php'; // Aquí la conexión MongoDB

session_start();

define('NUMERO_SEMANAS_PLAN', 4);

// Respuesta JSON genérica
function send_json_response($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

if (!isset($_SESSION['user']['id'])) {
    send_json_response(['status' => 'error', 'message' => 'Usuario no autenticado.'], 401);
}
$id_usuario = $_SESSION['user']['id'];

// Guardar plan en MySQL (solo existencia y relación usuario-plan)
function guardarPlanMySQL($conexion, $id_usuario) {
    // Buscamos plan existente
    $sql = "SELECT id FROM plan_alimentacion WHERE id_usuario = ?";
    $stmt = mysqli_prepare($conexion, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id_usuario);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        $id_plan = $row['id'];
        // Actualizar fecha
        $upd = "UPDATE plan_alimentacion SET fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?";
        $stmt_upd = mysqli_prepare($conexion, $upd);
        mysqli_stmt_bind_param($stmt_upd, "i", $id_plan);
        mysqli_stmt_execute($stmt_upd);
        mysqli_stmt_close($stmt_upd);
    } else {
        // Insertar nuevo plan
        $ins = "INSERT INTO plan_alimentacion (id_usuario) VALUES (?)";
        $stmt_ins = mysqli_prepare($conexion, $ins);
        mysqli_stmt_bind_param($stmt_ins, "i", $id_usuario);
        mysqli_stmt_execute($stmt_ins);
        $id_plan = mysqli_insert_id($conexion);
        mysqli_stmt_close($stmt_ins);
    }
    mysqli_stmt_close($stmt);
    return $id_plan;
}

// Guardar el plan completo en MongoDB (colección plan-recetas)
function guardarPlanMongo($client, $id_usuario, $plan) {
    $collection = $client->selectCollection('kukit', 'plan-recetas');

    // Eliminar documentos previos de este usuario para no acumular basura
    $collection->deleteMany(['id_usuario' => $id_usuario]);

    // Insertar plan completo
    // Aquí guardamos el objeto completo con id_usuario para consulta futura
    $document = [
        'id_usuario' => $id_usuario,
        'plan' => $plan,
        'fecha_actualizacion' => new MongoDB\BSON\UTCDateTime()
    ];

    $result = $collection->insertOne($document);
    return $result->getInsertedId();
}

function guardarPlanCompleto($conexion_mysql, $client, $id_usuario) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        send_json_response(['status' => 'error', 'message' => 'JSON inválido: '.json_last_error_msg()], 400);
    }
    if (!isset($input['plan']) || !is_array($input['plan'])) {
        send_json_response(['status' => 'error', 'message' => 'Estructura plan inválida.'], 400);
    }

    $plan = $input['plan'];
    if (count($plan) !== NUMERO_SEMANAS_PLAN) {
        send_json_response(['status' => 'error', 'message' => 'El plan debe tener '.NUMERO_SEMANAS_PLAN.' semanas.'], 400);
    }

    mysqli_begin_transaction($conexion_mysql);

    try {
        // Guardar plan en MySQL (solo la referencia)
        $id_plan = guardarPlanMySQL($conexion_mysql, $id_usuario);

        // Guardar plan detallado en MongoDB
        $id_mongo = guardarPlanMongo($client, $id_usuario, $plan);

        mysqli_commit($conexion_mysql);
        send_json_response([
            'status' => 'success',
            'message' => 'Plan guardado en MySQL y MongoDB',
            'id_plan_mysql' => $id_plan,
            'id_plan_mongo' => (string)$id_mongo
        ]);
    } catch (Exception $e) {
        mysqli_rollback($conexion_mysql);
        send_json_response(['status' => 'error', 'message' => 'Error guardando plan: '.$e->getMessage()], 500);
    }
}

function obtenerPlanCompleto($conexion_mysql, $client, $id_usuario) {
    // Primero comprobamos si el plan existe en MySQL
    $sql = "SELECT id FROM plan_alimentacion WHERE id_usuario = ?";
    $stmt = mysqli_prepare($conexion_mysql, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id_usuario);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if (!$row = mysqli_fetch_assoc($result)) {
        send_json_response(['status' => 'success', 'data' => ['plan' => []], 'message' => 'No hay plan para este usuario.']);
    }
    mysqli_stmt_close($stmt);

    // Recuperar plan detallado de MongoDB
    $collection = $client->selectCollection('kukit', 'plan-recetas');
    $doc = $collection->findOne(['id_usuario' => $id_usuario]);

    if (!$doc) {
        send_json_response(['status' => 'success', 'data' => ['plan' => []], 'message' => 'Plan Mongo no encontrado.']);
    }

    send_json_response(['status' => 'success', 'data' => ['plan' => $doc['plan']]]);
}


// Enrutador principal
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    guardarPlanCompleto($conexion, $client, $id_usuario);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    obtenerPlanCompleto($conexion, $client, $id_usuario);
} else {
    send_json_response(['status' => 'error', 'message' => 'Método no permitido'], 405);
}
