<?php
header('Content-Type: application/json');
include '../conecta-mongo.php';

// Funciones auxiliares (utils)
function calcularRangoSemana($fecha) {
    $timestamp = strtotime($fecha);
    $fechaInicio = date('Y-m-d', strtotime('monday this week', $timestamp));
    $fechaFin = date('Y-m-d', strtotime('sunday this week', $timestamp));
    return [$fechaInicio, $fechaFin];
}

$collection = $db->selectCollection('plan-semanal');

$accion = $_GET['accion'] ?? '';

switch ($accion) {
    case 'guardar': // Añadir o editar
        $data = json_decode(file_get_contents('php://input'), true);

        $idUsuario = $data['idUsuario'];
        $fecha = $data['fecha'];
        $tipoComida = $data['tipoComida'];
        $receta = $data['receta'];

        list($fechaInicio, $fechaFin) = calcularRangoSemana($fecha);

        $plan = $collection->findOne([
            "idUsuario" => $idUsuario,
            "fechaInicio" => $fechaInicio,
            "fechaFin" => $fechaFin
        ]);

        $menuItem = [
            "fecha" => $fecha,
            "tipoComida" => $tipoComida,
            "receta" => $receta
        ];

        if ($plan) {
            $yaExiste = false;
            foreach ($plan['menus'] as $menu) {
                if ($menu['fecha'] === $fecha && $menu['tipoComida'] === $tipoComida) {
                    $yaExiste = true;
                    break;
                }
            }

            if ($yaExiste) {
                // Editar
                $collection->updateOne(
                    [
                        "_id" => $plan['_id'],
                        "menus.fecha" => $fecha,
                        "menus.tipoComida" => $tipoComida
                    ],
                    [
                        '$set' => [
                            "menus.$.receta" => $receta
                        ]
                    ]
                );
            } else {
                // Agregar
                $collection->updateOne(
                    ["_id" => $plan['_id']],
                    ['$push' => ["menus" => $menuItem]]
                );
            }
        } else {
            // Nuevo plan semanal
            $collection->insertOne([
                "idUsuario" => $idUsuario,
                "fechaInicio" => $fechaInicio,
                "fechaFin" => $fechaFin,
                "menus" => [$menuItem]
            ]);
        }

        echo json_encode(["success" => true]);
        break;

    case 'eliminar':
        $data = json_decode(file_get_contents('php://input'), true);

        $idUsuario = $data['idUsuario'];
        $fecha = $data['fecha'];
        $tipoComida = $data['tipoComida'];

        list($fechaInicio, $fechaFin) = calcularRangoSemana($fecha);

        $collection->updateOne(
            [
                "idUsuario" => $idUsuario,
                "fechaInicio" => $fechaInicio,
                "fechaFin" => $fechaFin
            ],
            [
                '$pull' => [
                    "menus" => [
                        "fecha" => $fecha,
                        "tipoComida" => $tipoComida
                    ]
                ]
            ]
        );

        echo json_encode(["success" => true]);
        break;

    case 'obtener-plan':
        $idUsuario = $_GET['idUsuario'] ?? '';
        $fecha = $_GET['fecha'] ?? date('Y-m-d');

        list($fechaInicio, $fechaFin) = calcularRangoSemana($fecha);

        $plan = $collection->findOne([
            "idUsuario" => $idUsuario,
            "fechaInicio" => $fechaInicio,
            "fechaFin" => $fechaFin
        ]);

        echo json_encode($plan ?? []);
        break;

    default:
        echo json_encode(["error" => "Acción no reconocida"]);
        break;
}
?>
