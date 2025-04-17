<?php
require '../vendor/autoload.php'; // Asegúrate de incluir el autoload de Composer
include 'conecta-mongo.php';

// Crear la colección de usuarios si no existe
$collection = $db->selectCollection('recetas');

//creamos documentos por defecto
$recetas = {
    "_id": "receta123",
    "nombre": "Pasta al pesto",
    "ingredientes": [
      { "nombre": "Pasta", "cantidad": 200, "unidad": "g" },
      { "nombre": "Pesto", "cantidad": 3, "unidad": "cucharadas" }
    ],
    "pasos": [
      "Hervir la pasta durante 8 minutos.",
      "Añadir el pesto y mezclar bien."
    ],
    "idUsuario": "usuario456",
    "compartido": true,
    "categorias": ["italiana", "rápida"],
    "tiempo_estimado": "15 min"
}

// Insertar los documentos en la colección
$collection->insertMany($recetas);

// Crear la colección de menus si no existe
$collection = $db->selectCollection('menus');

$menus = {
    "_id": "menu789",
    "idUsuario": "usuario456",
    "fecha": "2025-04-10",
    "tipoComida": "almuerzo",
    "descripcion": "Menú ligero para mediodía",
    "receta": {
      "nombre": "Ensalada de quinoa",
      "ingredientes": [
        { "nombre": "Quinoa", "cantidad": 100, "unidad": "g" },
        { "nombre": "Tomate", "cantidad": 1, "unidad": "unidad" }
      ],
      "pasos": ["Lavar la quinoa", "Cocer durante 10 minutos", "Mezclar con los vegetales"]
    },
    "compartido": false
  }

// Insertar los documentos en la colección
$collection->insertMany($menus);

