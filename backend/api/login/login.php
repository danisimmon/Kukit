<?php
include '../conecta-mysql.php';

header('Content-Type: application/json');

$data = ["success" => false, "message" => "Error desconocido"]; // Respuesta por defecto

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Leer los datos JSON enviados por Axios
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || empty($input['correo']) || empty($input['password'])) {
        $data['message'] = "Todos los campos son obligatorios.";
        echo json_encode($data);
        exit;
    }

    $sql = "SELECT * FROM usuarios WHERE correo = ?";
    $stmt = mysqli_prepare($conexion, $sql);
    $stmt->bind_param("s", $input['correo']);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if ($user) {
        // Verificar la contraseña
        if (password_verify($input['password'], $user['password'])) {
            // Iniciar sesión y devolver el usuario
            session_start();
            $_SESSION['user'] = $user;
            $data['success'] = true;
            $data['message'] = "Inicio de sesión exitoso.";
            $data['user'] = $user; // Devolver el usuario
        } else {
            $data['message'] = "Contraseña incorrecta.";
        }
    } else {
        $data['message'] = "Usuario no encontrado.";
    }
} else {
    $data['message'] = "Método no permitido.";
}

