<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');

// Verificamos si la sesión contiene información del usuario
if (isset($_SESSION['user']) && isset($_SESSION['user']['id'])) {
    echo json_encode([
        "loggedIn" => true,
        "user" => [
            "correo" => $_SESSION['user']['correo']
        ]
    ]);
} else {
    echo json_encode([
        "loggedIn" => false
    ]);
}
