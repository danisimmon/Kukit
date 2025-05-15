<?php
include 'conecta-mongo.php';

// Crear la colección de recetas si no existe
$collection = $db->selectCollection('recetas');

//creamos documentos por defecto en recetas
require 'insertar-recetas.php';

// Crear la colección de menus si no existe
$collection = $db->selectCollection('menus');

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

