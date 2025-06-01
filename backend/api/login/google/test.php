<?php
require __DIR__ . '/../../../vendor/autoload.php';
try {
    $client = new Google_Client();
    echo "Google_Client loaded successfully!\n";
} catch (\Throwable $e) {
    echo "Error loading Google_Client: " . $e->getMessage() . "\n";
}
?>