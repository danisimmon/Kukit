<?php
include 'conecta-mongo.php';

// Crear la colección de recetas si no existe
$collection = $db->selectCollection('recetas');

//creamos documentos por defecto en recetas
require 'insertar-recetas.php';

// Crear la colección de menus si no existe
$menusCollection = $db->selectCollection('menus');

$menus = [
    [
        "_id" => "menu789",
        "idUsuario" => "usuario456",
        "fecha" => "2025-04-10",
        "tipoComida" => "almuerzo",
        "descripcion" => "Menú ligero para mediodía",
        "receta" => [
            "nombre" => "Ensalada de quinoa",
            "ingredientes" => [
                [ "nombre" => "Quinoa", "cantidad" => 100, "unidad" => "g" ],
                [ "nombre" => "Tomate", "cantidad" => 1, "unidad" => "unidad" ]
            ],
            "pasos" => ["Lavar la quinoa", "Cocer durante 10 minutos", "Mezclar con los vegetales"]
        ],
        "compartido" => false
    ]
];

// Insertar los documentos en la colección
$collection->insertMany($menus);

// Insertar plan semanal (colección: plan-semanal)
$planSemanalCollection = $db->selectCollection('plan-semanal');

$planSemanal = [
    [
        "_id" => "plan123", // Puedes usar un ObjectId real si estás en producción
        "idUsuario" => "usuario456",
        "fechaInicio" => "2025-04-01",
        "fechaFin" => "2025-04-07",
        "menus" => [
            [
                "fecha" => "2025-04-01",
                "tipoComida" => "desayuno",
                "receta" => [
                    "nombre" => "Tostadas con aguacate",
                    "ingredientes" => [
                        [
                            "nombre" => "Pan integral",
                            "cantidad" => 2,
                            "unidad" => "rebanadas"
                        ],
                        [
                            "nombre" => "Aguacate",
                            "cantidad" => 1,
                            "unidad" => "unidad"
                        ]
                    ],
                    "pasos" => [
                        "Tostar el pan",
                        "Aplastar el aguacate y untar"
                    ]
                ]
            ],
            [
                "fecha" => "2025-04-01",
                "tipoComida" => "comida",
                "receta" => [
                    "nombre" => "Ensalada César",
                    "ingredientes" => [
                        [
                            "nombre" => "Lechuga",
                            "cantidad" => 100,
                            "unidad" => "g"
                        ],
                        [
                            "nombre" => "Pollo",
                            "cantidad" => 150,
                            "unidad" => "g"
                        ]
                    ],
                    "pasos" => [
                        "Lavar la lechuga",
                        "Cocer el pollo y mezclar"
                    ]
                ]
            ],
            [
                "fecha" => "2025-04-02",
                "tipoComida" => "desayuno",
                "receta" => [
                    "nombre" => "Batido de plátano",
                    "ingredientes" => [
                        [
                            "nombre" => "Plátano",
                            "cantidad" => 1,
                            "unidad" => "unidad"
                        ],
                        [
                            "nombre" => "Leche",
                            "cantidad" => 200,
                            "unidad" => "ml"
                        ]
                    ],
                    "pasos" => [
                        "Pelar el plátano",
                        "Batir con leche hasta que quede suave"
                    ]
                ]
            ]
        ]
    ]
];

$planSemanalCollection->insertMany($planSemanal);