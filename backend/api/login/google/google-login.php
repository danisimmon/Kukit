<?php
require_once '../../../vendor/autoload.php';

use Google\Client;

$input = json_decode(file_get_contents('php://input'), true);
$token = $input['token'] ?? '';

if (!$token) {
    http_response_code(400);
    echo json_encode(['error' => 'Token no proporcionado']);
    exit;
}

$client = new Google\Client(['client_id' => 'TU_CLIENT_ID_DE_GOOGLE']);
$payload = $client->verifyIdToken($token);

if ($payload) {
    $userid = $payload['sub'];
    $email = $payload['email'];
    $name = $payload['name'];

    // TODO: Aquí haces login, crear usuario si no existe, generar tu propio JWT, etc.

    echo json_encode(['message' => 'Login correcto', 'user' => compact('userid', 'email', 'name')]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Token inválido']);
}
