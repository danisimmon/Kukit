<?php 
session_start(); //Recuperamos la sesión iniciada por el usuario

if(isset($_SESSION) && isset($_SESSION['user']['id'])) {
    session_destroy(); // Destruye la sesión actual
    $data = ["success" => true, "message" => "Sesión cerrada correctamente."];
} else {
    $data = ["success" => false, "message" => "No hay sesión activa."];
}

header('Content-Type: application/json');
echo json_encode($data);