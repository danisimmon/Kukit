<?php 
include '../../conecta-mysql.php';
session_start();
if (!isset($_SESSION['user']['id'])) {
    echo json_encode(["success" => false, "message" => "No estás autenticado"]);
    exit;
}

header('Content-Type: application/json');

$sql = "SELECT * FROM usuario WHERE id = ?";
$sql = $conexion->prepare($sql);
$sql->bind_param("i", $_SESSION['user']['id']);
$sql->execute();

$query = mysqli_fetch_array($sql->get_result());
if ($query > 0) {
    echo json_encode([
        "success" => true,
        "message" => "Usuario encontrado",
        "usuario" => $query['nombre'],
        "correo" => $query['email']
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
    exit;
}

// if ($_SERVER['REQUEST_METHOD'] == 'POST') {
//     $usuario = $input['usuario'];
//     $correo = $input['correo'];
//     $password = password_hash($input['password'], PASSWORD_DEFAULT);

//     // Verificar si el correo ya está en uso
//     $sql = "SELECT * FROM usuario WHERE email = ?";
//     $sql = $conexion->prepare($sql);
//     $sql->bind_param("s", $correo);
//     $sql->execute();
//     $query = mysqli_fetch_array($sql->get_result());

//     if ($query > 0) {
//         echo json_encode(["success" => false, "message" => "Este correo ya está en uso"]);
//         exit;
//     } else {
//         // Actualizar usuario
//         $sql = "UPDATE usuario SET email = ?, password = ? WHERE id = ?";
//         $sql = $conexion->prepare($sql);
//         $sql->bind_param("ssi", $correo, $password, $_SESSION['id']);
//         if ($sql->execute()) {
//             echo json_encode(["success" => true, "message" => "Perfil actualizado correctamente"]);
//         } else {
//             echo json_encode(["success" => false, "message" => "Error al actualizar el perfil"]);
//         }
//     }
// }