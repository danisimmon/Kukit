<?php
include '../../conecta-mysql.php';

header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['usuario']) || empty($input['correo'])) {
    $data = ["success" => false, "message" => "Todos los campos son obligatorios."];
    echo json_encode($data);
    exit;
}

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $usuario = $input['usuario'];
    $correo = $input['correo'];
    $id = $_SESSION['user']['id'];
    $password = password_hash($input['password'], PASSWORD_DEFAULT);

    // Verificar si el correo ya está en uso
    $sql = "SELECT * FROM usuario WHERE email = ? AND id != ?";
    $sql = $conexion->prepare($sql);
    $sql->bind_param("si", $correo, $id);
    $sql->execute();
    $queryCorreo = $sql->get_result();

    if ($queryCorreo->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Este correo ya está en uso"]);
        exit;
    }

    // Verificar si el correo ya está en uso
    $sql = "SELECT * FROM usuario WHERE nombre = ? AND id != ?";
    $sql = $conexion->prepare($sql);
    $sql->bind_param("si", $nombre, $id);
    $sql->execute();
    $queryNombre = $sql->get_result();

    if ($queryNombre->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Este nombre ya está en uso"]);
        exit;
    }

    // Si no hay conflictos, actualiza
    $sql = "UPDATE usuario SET email = ?, nombre = ? WHERE id = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssi", $correo, $usuario, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Perfil actualizado correctamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar el perfil"]);
    }
}
