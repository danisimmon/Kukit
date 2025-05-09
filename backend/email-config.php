<?php
require 'vendor/autoload.php'; // Autoload files using Composer autoload
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function crearMailer(): PHPMailer {
    $mail = new PHPMailer(true);

    // Configuración SMTP
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'tuemail@gmail.com';
    $mail->Password   = 'tu_contraseña_app';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom('kukit_app@gmail.com', 'Kukit App');
    $mail->isHTML(true);

    return $mail;
}
