<?php
header('Content-Type: application/json');

$response = [
    'success' => true,
    'message' => 'Se esta conectando al backend por la API.'
];

echo json_encode($response);
?>