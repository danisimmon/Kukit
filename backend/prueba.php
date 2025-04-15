<?php
header('Content-Type: application/json');

$response = [
    'success' => true,
    'message' => 'Bienvenido/a al backend'
];

echo json_encode($response);
?>