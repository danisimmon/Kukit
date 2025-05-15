<?php
require_once __DIR__ . '/../vendor/autoload.php'; // Asegúrate de incluir el autoload de Composer
$host = "localhost";
$username = "root";
$password = "root";
$database = "kukit"; // Nombre de la base de datos que deseas usar
$uri = 'mongodb://root:root@mongo:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-1';

// Conexión a MongoDB
use MongoDB\Client;
$client = new MongoDB\Client($uri);

//compruebo si la base de datos existe
$databases = $client->listDatabases();
$databaseExists = false;
foreach ($databases as $db) {
    if ($db->getName() === $database) {
        $databaseExists = true;
        break;
    }
}
// Crear la base de datos y la colección si no existen
$db = $client->selectDatabase($database);
if (!$databaseExists) {
    //Llamo a tablas-mongo.php para crear las colecciones necesarias
    include_once 'colecciones-mongo.php';
}




