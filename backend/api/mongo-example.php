<?php
require '../vendor/autoload.php'; // Asegúrate de incluir el autoload de Composer

try {
    // 1. Conexión al servidor MongoDB usando SCRAM-SHA-1 para evitar errores con SSL
    $uri = 'mongodb://root:root@mongo:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-1';
    $client = new MongoDB\Client($uri);

    echo "<h1>Conexión exitosa a MongoDB 🎉</h1>";

    // 2. Seleccionar base de datos y colección
    $database = $client->kukit_db;
    $collection = $database->test_collection;

    // 3. Insertar un documento de prueba
    $insertResult = $collection->insertOne([
        'name' => 'Kukit Test',
        'status' => 'active',
        'created_at' => new MongoDB\BSON\UTCDateTime(),
        'features' => ['php', 'mongodb', 'docker']
    ]);

    echo "<p>Documento insertado con ID: " . $insertResult->getInsertedId() . "</p>";

    // 4. Consultar documentos
    $documents = $collection->find();

    echo "<h2>Documentos en la colección:</h2>";
    echo "<ul>";
    foreach ($documents as $doc) {
        echo "<li>" . json_encode($doc) . "</li>";
    }
    echo "</ul>";

    // 5. Estadísticas
    echo "<h3>Estadísticas:</h3>";
    echo "<pre>Server Info: " . print_r($client->getManager()->getServers(), true) . "</pre>";

} catch (Exception $e) {
    die("<h1>Error de conexión ❌</h1><p>" . $e->getMessage() . "</p>");
}
