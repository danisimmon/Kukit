<?php
include '../../conecta-mysql.php';

header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['correo'])) {
    $data = ["success" => false, "message" => "Todos los campos son obligatorios."];
    echo json_encode($data);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $correo = $input['correo'];

    $sql = "SELECT * FROM usuario WHERE email = ?";
    $sql = $conexion->prepare($sql);
    $sql->bind_param("s", $correo);
    $sql->execute();
    $query = mysqli_fetch_array($sql->get_result());

    if ($query > 0) {
        $token = bin2hex(random_bytes(32));
        $codigo_verificacion = rand(100000, 999999); // Genera un código de verificación de 6 dígitos

        $sql = "INSERT INTO password_reset (email, token, codigo_verificacion, fecha) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, fecha = NOW()";
        $sql = $conexion->prepare($sql);
        $fecha_actual = date("Y-m-d H:i:s"); // formato DATETIME de MySQL

        $sql->bind_param("sssss", $correo, $token, $codigo_verificacion, $fecha_actual, $token);
        $sql->execute();

        require_once '../../../email-config.php'; // importa la función crearMailer

        $reset_link = "localhost/login/restablecer-password/nueva-password?token=$token"; // crea enlace

        try {
            $mail = crearMailer();
            $mail->addAddress($correo);
            $mail->Subject = "Recupera tu contraseña";
            $mail->Body = "
        <h3>Solicitud de recuperación</h3>
        <p>Tu código de verificación es: <strong>$codigo_verificacion</strong></p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href='$reset_link'>Restablece tu contraseña</a>
    ";
            $mail->AltBody = "Código: $codigo_verificacion. Enlace: $reset_link";
            $mail->send();

            echo json_encode([
                "success" => true,
                "message" => "Se ha enviado un correo con las instrucciones para recuperar tu contraseña"
            ]);
        } catch (Exception $e) {
            echo json_encode([
                "success" => false,
                "message" => "No se pudo enviar el correo. Error: " . $mail->ErrorInfo
            ]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Correo no encontrado"]);
    }
}
