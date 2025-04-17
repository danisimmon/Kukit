<?php
include '../conecta-mysql.php';

header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['correo'])) {
    $data = ["success" => false, "message" => "Todos los campos son obligatorios."];
    echo json_encode($data);
    exit;
}

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $correo = $input['correo'];

    $sql = "SELECT * FROM usuarios WHERE email = ?";
    $sql = $conexion->prepare($sql);
    $sql->bind_param("s", $correo);
    $sql->execute();
    $query = mysqli_fetch_array($sql->get_result());

    if ($query > 0) {
        $token = bin2hex(random_bytes(32));
        $codigo_verificacion = bin2hex(random_bytes(4));

        $sql = "INSERT INTO password_reset (email, token, codigo_verificacion) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, fecha = NOW()";
        $sql = $conexion->prepare($sql);
        $sql->bind_param("ssss", $correo, $token, $codigo_verificacion, $token);
        $sql->execute();

        $reset_link = $token;

        echo json_encode([
            "success" => true, 
            "message" => "Se ha enviado un correo con las instrucciones para recuperar tu contraseña",
            "token" => $reset_link,
            "codigo_verificacion" => $codigo_verificacion
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Correo no encontrado"]);
    }
}