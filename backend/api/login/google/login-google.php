<?php
session_start();
include '../../conecta-mysql.php';

// Ruta absoluta y correcta al autoload de Composer
require __DIR__ . '/../../../vendor/autoload.php';

// Verifica que la clase Google_Client esté disponible
if (!class_exists('Google_Client')) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error interno: no se pudo cargar la librería de Google Client. Revisa el autoload y dependencias."
    ]);
    exit;
}

header('Content-Type: application/json');

$data = ["success" => false, "message" => "Error desconocido"];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (empty($input['id_token'])) {
        $data['message'] = "Token de Google no proporcionado.";
        echo json_encode($data);
        exit;
    }

    // Inicializa Google_Client con client_id para validar el token
    $client = new Google_Client(['client_id' => '457729135946-4i3fug0fv5h3p1h8kfmmkhra1dfuvn81.apps.googleusercontent.com']);

    // Verificar el token de Google
    $payload = $client->verifyIdToken($input['id_token']);
    if (!$payload) {
        $data['message'] = "Token inválido o expirado.";
        echo json_encode($data);
        exit;
    }

    // Obtener datos del usuario de Google
    $googleId = $payload['sub'];
    $email = $payload['email'];
    $nombre = $payload['name'] ?? '';

    // Buscar usuario en base de datos
    $sql = "SELECT * FROM usuario WHERE email = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user) {
        // Usuario no existe, crearlo
        $sqlInsert = "INSERT INTO usuario (nombre, email, password, google_id) VALUES (?, ?, NULL, ?)";
        $stmtInsert = $conexion->prepare($sqlInsert);
        $stmtInsert->bind_param("sss", $nombre, $email, $googleId);
        $stmtInsert->execute();
        $userId = $stmtInsert->insert_id;
    } else {
        $userId = $user['id'];
        // Opcional: actualizar datos
        $sqlUpdate = "UPDATE usuario SET nombre = ?, google_id = ? WHERE id = ?";
        $stmtUpdate = $conexion->prepare($sqlUpdate);
        $stmtUpdate->bind_param("ssi", $nombre, $googleId, $userId);
        $stmtUpdate->execute();
    }

    // Iniciar sesión PHP
    $_SESSION['user']['id'] = $userId;
    $_SESSION['user']['correo'] = $email;
    $_SESSION['user']['nombre'] = $nombre;

    $data = [
        "success" => true,
        "message" => "Login con Google exitoso",
        "user" => [
            "id" => $userId,
            "correo" => $email,
            "nombre" => $nombre
        ]
    ];
} else {
    $data['message'] = "Método no permitido.";
}

echo json_encode($data);
