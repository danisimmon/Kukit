<?php
include '../tablas-mysql.php';

header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['password']) || empty($input['token'])) {
    $data = ["success" => false, "message" => "Todos los campos son obligatorios."];
    echo json_encode($data);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $token = $input['token'];
    $codigo_verificacion = $input['codigo_verificacion'];

    $sql = "SELECT * FROM password_reset WHERE token = ?";
    $sql = $conexion->prepare($sql);
    $sql->bind_param("s", $token);
    $sql->execute();
    $query = mysqli_fetch_array($sql->get_result());

    if ($query > 0) {
        if ($query['fecha'] > date("Y-m-d H:i:s", strtotime('-1 hour'))) {
            if ($codigo_verificacion == $query['codigo_verificacion']) {
                $correo = $query['email'];
                $password = password_hash($input['password'], PASSWORD_DEFAULT);

                $sql = "UPDATE usuario SET password = ? WHERE email = ?";
                $sql = $conexion->prepare($sql);
                $sql->bind_param("ss", $password, $correo);
                $sql->execute();

                // Eliminar token
                $sql = "DELETE FROM password_reset WHERE token = ?";
                $sql = $conexion->prepare($sql);
                $sql->bind_param("s", $token);
                $sql->execute();

                echo json_encode([
                    "success" => true,
                    "message" => "Contraseña actualizada correctamente"
                ]);
            } else {
                echo json_encode(["success" => false, "message" => "Código de verificación incorrecto"]);
            }
        } else {
            // Eliminar token si ha expirado
            $sql = "DELETE FROM password_reset WHERE token = ?";
            $sql = $conexion->prepare($sql);
            $sql->bind_param("s", $token);
            $sql->execute();
            echo json_encode(["success" => false, "message" => "La solicitud ha expirado."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid token"]);
    }
}
