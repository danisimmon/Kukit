<?php

$host = "localhost";
$username = "root";
$password = "root";
$database = "kukit"; // Nombre de la base de datos que deseas usar
$uri = 'mongodb://root:root@mongo:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-1';

// Conexión a MongoDB
require '../vendor/autoload.php'; // Asegúrate de incluir el autoload de Composer
use MongoDB\Client;
$client = new MongoDB\Client($uri);

//compruebo si la base de datos existe
$databases = $client->listDatabases();
$databaseExists = false;
foreach ($databases as $db) {
    if ($db->getDatabaseName() === $database) {
        $databaseExists = true;
        break;
    }
}
if (!$databaseExists) {
    // Crear la base de datos y la colección si no existen
    $db = $client->selectDatabase($database);
    
    //Llamo a tablas-mongo.php para crear las colecciones necesarias
    include_once 'colecciones-mongo.php';
}




