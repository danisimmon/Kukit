<?php
include "../../conecta-mysql.php"; // Asegúrate de que devuelve $conexion (no $conn)
include "../../conecta-mongo.php"; // Para actualizar el contador de likes en MongoDB

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

session_start();

// Verifica que el usuario esté logueado
if (!isset($_SESSION['user']) || empty($_SESSION['user']) || !isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no logueado']);
    exit;
}

$usuario = $_SESSION['user']['id'];

$data = json_decode(file_get_contents("php://input"), true);

// Verifica que se haya enviado id_receta
if (!isset($data['id_receta']) || empty($data['id_receta'])) {
    echo json_encode(['success' => false, 'message' => 'ID de receta no recibido']);
    exit;
}

$receta = $data['id_receta'];

// Si es objeto tipo MongoDB, extraer $oid
if (is_object($receta) && isset($receta->{'$oid'})) {
    $recetaIdString = $receta->{'$oid'};
} else {
    $recetaIdString = (string) $receta;
}

// Convertir a ObjectId para MongoDB
try {
    $recetaObjectId = new MongoDB\BSON\ObjectId($recetaIdString);
} catch (MongoDB\Driver\Exception\InvalidArgumentException $e) {
    echo json_encode(['success' => false, 'message' => 'ID de receta no válido para MongoDB']);
    exit;
}

// Verifica si ya le dio MG
$sql_check = "SELECT * FROM me_gusta WHERE id_usuario = ? AND id_receta = ?";
$stmt = $conexion->prepare($sql_check);
$stmt->bind_param("is", $usuario, $recetaIdString);
$stmt->execute();
$result = $stmt->get_result();

$collectionRecetasMongo = $db->selectCollection('recetas');

if ($result->num_rows > 0) {
    // Ya le dio MG -> eliminar
    $sql_delete = "DELETE FROM me_gusta WHERE id_usuario = ? AND id_receta = ?";
    $stmt_delete_mysql = $conexion->prepare($sql_delete);
    $stmt_delete_mysql->bind_param("is", $usuario, $recetaIdString);

    if ($stmt_delete_mysql->execute()) {
        // Decrementar contador en MongoDB, asegurando que no sea menor que 0
        $collectionRecetasMongo->updateOne(
            ['_id' => $recetaObjectId, 'likes' => ['$gt' => 0]], // Solo si likes es mayor que 0
            ['$inc' => ['likes' => -1]]
        );
        // Obtener el nuevo contador de likes
        $updatedDocument = $collectionRecetasMongo->findOne(['_id' => $recetaObjectId], ['projection' => ['likes' => 1]]);
        $newLikesCount = isset($updatedDocument['likes']) ? $updatedDocument['likes'] : 0;

        echo json_encode(['success' => true, 'liked' => false, 'message' => 'Me gusta eliminado', 'newLikesCount' => $newLikesCount]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al eliminar el Me gusta']);
    }
    $stmt_delete_mysql->close();
} else {
    // No le dio MG -> insertar en MySQL e incrementar en MongoDB
    $sql_insert = "INSERT INTO me_gusta (id_usuario, id_receta) VALUES (?, ?)";
    $stmt_insert_mysql = $conexion->prepare($sql_insert);
    $stmt_insert_mysql->bind_param("is", $usuario, $recetaIdString);

    if ($stmt_insert_mysql->execute()) {
        // Incrementar contador en MongoDB
        // Si el campo 'likes' no existe, $inc lo crea y lo establece en 1.
        // Usamos upsert:false en las opciones de updateOne si asumimos que la receta siempre existe.
        // Para este caso, si la receta existe, y 'likes' no, lo crea.
        $collectionRecetasMongo->updateOne(
            ['_id' => $recetaObjectId],
            ['$inc' => ['likes' => 1]],
            ['upsert' => true] // Crea el campo 'likes' si no existe en el documento.
                               // Si la receta en sí no existiera, la crearía con _id y likes,
                               // lo cual podría no ser deseado, pero para un campo es útil.
                               // Es más seguro asumir que la receta existe y solo se actualiza/crea el campo 'likes'.
        );
        // Obtener el nuevo contador de likes
        $updatedDocument = $collectionRecetasMongo->findOne(['_id' => $recetaObjectId], ['projection' => ['likes' => 1]]);
        $newLikesCount = isset($updatedDocument['likes']) ? $updatedDocument['likes'] : 0;

        echo json_encode(['success' => true, 'liked' => true, 'message' => 'Me gusta añadido', 'newLikesCount' => $newLikesCount]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al añadir el Me gusta']);
    }
    $stmt_insert_mysql->close();
}
$stmt->close();
?>
