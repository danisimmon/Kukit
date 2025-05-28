<?php 
include '../../conecta-mysql.php';

header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['correo']) || empty($input['password'])) {
    $data = ["success" => false, "message" => "Todos los campos son obligatorios."];
    echo json_encode($data);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $usuario = $input['usuario'];
    $correo = $input['correo'];
    $password = password_hash($input['password'], PASSWORD_DEFAULT);

    $sql = "SELECT * FROM usuario WHERE email = ?";
    $sql = $conexion->prepare($sql);
    $sql->bind_param("s", $correo);
    $sql->execute();
    $query = mysqli_fetch_array($sql->get_result());

    if ($query > 0) {
        echo json_encode(["success" => false, "message" => "Este correo ya está en uso"]);
        exit;
    } else {
        // Insertar nuevo usuario
        $sql = "INSERT INTO usuario (nombre, email, password) VALUES (?, ?, ?)";
        $sql = $conexion->prepare($sql);
        $sql->bind_param("sss", $usuario, $correo, $password);
        if ($sql->execute()) {
            // Iniciar sesión automáticamente después del registro
            session_start();
            $_SESSION['user']['id'] = $conexion->insert_id; // Asignar el ID del nuevo usuario a la sesión
            $_SESSION['user']['email'] = $correo;
            echo json_encode(["success" => true, "message" => "Registro exitoso"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al registrar el usuario"]);
        }
    }
}