<?php
include 'conecta-mongo.php';

$collection = $db->selectCollection('recetas');

// Asegurarse de que la colección esté vacía antes de insertar para evitar duplicados
// si se ejecuta el script varias veces.
if ($collection->countDocuments() > 0) {
    $collection->drop();
}


$recetas = [
    [
        "nombre" => "Pasta al pesto",
        "ingredientes" => [
            ["nombre" => "Pasta", "cantidad" => 200, "unidad" => "g"],
            ["nombre" => "Pesto", "cantidad" => 3, "unidad" => "cucharadas"]
        ],
        "pasos" => ["1.Hervir la pasta
                Llena una olla grande con agua y añade una pizca de sal. Lleva a ebullición.
                Una vez que el agua esté hirviendo, agrega los 200 g de pasta.
                Cocina durante 8 minutos (o el tiempo indicado en el paquete) hasta que la pasta esté al dente.
                Remueve de vez en cuando para que no se pegue.",

                "2.Escurrir y mezclar con el pesto
                Una vez cocida, escurre la pasta utilizando un colador, reservando una cucharada del agua de cocción.
                Coloca la pasta caliente de nuevo en la olla o en un bol grande.
                Añade las 3 cucharadas de pesto y, si lo deseas, la cucharada del agua reservada para ayudar a ligar la salsa.
                Mezcla bien hasta que toda la pasta esté cubierta de manera uniforme.",

                "3.Servir
                Sirve inmediatamente mientras está caliente.
                Puedes añadir por encima un poco de queso parmesano rallado o nueces picadas si lo deseas."],
        "idUsuario" => "usuario456",
        "compartido" => true,
        "alergias" => ["gluten", "lactosa"],
        "pais" => "Italia",
        "otrasCategorias" => ["rápida", "vegetariana"],
        "tiempo" => "15 min",
        "dificultad" => "facil",
        "likes" => 5,
        "informacionNutricional" => ["calorias" => 350, "proteinas" => 12, "carbohidratos" => 50, "grasas" => 10],
        "href" => "http://localhost/api/img/recetas/pasta-al-pesto.jpg",
        "fecha_creacion" => "2023-10-01T10:00:00.000Z"
    ],
    [
        "nombre" => "Tacos de pollo",
        "ingredientes" => [
            ["nombre" => "Tortillas", "cantidad" => 3, "unidad" => "unidad"],
            ["nombre" => "Pollo", "cantidad" => 150, "unidad" => "g"],
            ["nombre" => "Lechuga", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Salsa", "cantidad" => 1, "unidad" => "unidad"]
        ],
        "pasos" => ["1.Cocinar el pollo
            Corta los 200 g de pollo en tiras o trozos pequeños.
            Calienta una sartén con un poco de aceite a fuego medio-alto.
            Añade el pollo a la sartén y cocínalo durante 10 minutos, removiendo ocasionalmente, hasta que esté bien dorado y completamente cocido por dentro.
            Puedes sazonarlo con sal, pimienta o tus especias favoritas (como comino o pimentón).",

            "2.Preparar los ingredientes adicionales
            Lava y corta la lechuga en tiras finas.
            Si vas a usar salsa, asegúrate de tenerla lista (puede ser salsa picante, guacamole, o la de tu preferencia).",

            "3.Montar los tacos
            Calienta ligeramente las 4 tortillas en una sartén o en el microondas.
            Coloca una porción del pollo cocido en el centro de cada tortilla.
            Añade lechuga por encima y un poco de salsa si lo deseas.
            Dobla las tortillas para formar los tacos.",

            "4.Servir
            Sirve los tacos inmediatamente, calientes.
            Puedes acompañarlos con lima, arroz, frijoles o lo que más te guste."],
        "idUsuario" => "usuario123",
        "compartido" => true,
        "alergias" => [],
        "pais" => "México",
        "otrasCategorias" => ["rápida"],
        "tiempo" => "20 min",
        "dificultad" => "intermedio",
        "likes" => 10,
        "informacionNutricional" => ["calorias" => 400, "proteinas" => 25, "carbohidratos" => 35, "grasas" => 15],
        "href" => "http://localhost/api/img/recetas/tacosPollo.jpg",
        "fecha_creacion" => "2023-10-15T11:30:00.000Z"
    ],
    [
        "nombre" => "Sushi vegetal",
        "ingredientes" => [
            ["nombre" => "Arroz para sushi", "cantidad" => 100, "unidad" => "g"],
            ["nombre" => "Aguacate", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Pepino", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Alga nori", "cantidad" => 2, "unidad" => "hojas"]
        ],
            "pasos" => ["1.Cocinar el arroz
                Lava el arroz para sushi bajo el grifo, removiendo con la mano, hasta que el agua salga clara.
                Cocina los 200 g de arroz según las instrucciones del paquete (normalmente, se hierve en agua durante 10–12 minutos y luego se deja reposar).
                Una vez cocido, mezcla el arroz con un poco de vinagre de arroz, azúcar y sal (opcional), y déjalo enfriar a temperatura ambiente.",

                "2.Preparar los ingredientes del relleno
                Pela y corta el aguacate en tiras finas.
                Lava y corta el pepino también en tiras delgadas, retirando las semillas si lo deseas.",

                "3.Montar el sushi
                Coloca una hoja de alga nori sobre una esterilla de bambú (makisu), con el lado rugoso hacia arriba.
                Extiende una capa fina y uniforme de arroz sobre el alga, dejando un borde de unos 2 cm en la parte superior sin arroz.
                Coloca las tiras de aguacate y pepino en línea horizontal, cerca de la parte inferior del arroz.",

                "4.Enrollar el sushi
                Con ayuda de la esterilla, enrolla el sushi firmemente empezando desde la parte inferior.
                Presiona ligeramente para que quede bien formado, y sella el borde del alga humedeciéndolo con un poco de agua.",

                "5.Cortar y servir
                Usa un cuchillo afilado y húmedo para cortar el rollo en piezas de aproximadamente 2–3 cm de grosor.
                Sirve con salsa de soja, wasabi y jengibre encurtido si lo deseas."],
        "idUsuario" => "usuario789",
        "compartido" => true,
        "alergias" => [],
        "pais" => "Japón",
        "otrasCategorias" => ["vegetariana"],
        "tiempo" => "30 min",
        "dificultad" => "dificil",
        "likes" => 8,
        "informacionNutricional" => ["calorias" => 250, "proteinas" => 6, "carbohidratos" => 40, "grasas" => 5],
        "href" => "http://localhost/api/img/recetas/sushiVegetal.png",
        "fecha_creacion" => "2023-09-20T09:15:00.000Z"
    ],
    [
        "nombre" => "Gazpacho andaluz",
        "ingredientes" => [
            ["nombre" => "Tomate", "cantidad" => 1, "unidad" => "kg"],
            ["nombre" => "Pepino", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Pimiento verde", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Ajo", "cantidad" => 1, "unidad" => "diente"],
            ["nombre" => "Pan del día anterior(opcional, para espesar)", "cantidad" => 50, "unidad" => "g"],
            ["nombre" => "Vinagre", "cantidad" => 30, "unidad" => "ml"],
            ["nombre" => "Sal", "cantidad" => 1, "unidad" => "cucharadita"],
            ["nombre" => "Aceite de oliva", "cantidad" => 2, "unidad" => "cucharadas"]
        ],
        "pasos" => ["1.Preparar los ingredientes
            Lava bien los tomates, el pimiento y el pepino.
            Pela el pepino si prefieres un sabor más suave y corta todos los vegetales en trozos grandes.
            Pela el ajo (puedes quitarle el germen para que sea más suave).",

            "2.Hidratar el pan (opcional)
            Si vas a usar pan, remójalo en un poco de agua fría durante unos minutos hasta que esté blando. Escúrrelo bien.",

            "3.Triturar todos los ingredientes
            En una batidora o robot de cocina, añade los tomates troceados, el pimiento, el pepino, el ajo y el pan escurrido (si lo usas).
            Agrega una pizca de sal y el vinagre de vino. Tritura a máxima potencia hasta obtener una mezcla homogénea.",

            "4.Incorporar el aceite de oliva
            Con la batidora aún en marcha, añade poco a poco el aceite de oliva virgen extra para emulsionar el gazpacho y que quede cremoso.",

            "5.Ajustar la textura
            Si queda muy espeso, añade un poco de agua fría hasta obtener la textura deseada. Vuelve a batir unos segundos.",

            "6.Colar (opcional)
            Si quieres un gazpacho más fino, pásalo por un colador o chino para eliminar pieles y semillas.",

            "7.Refrigerar y servir
            Deja el gazpacho en la nevera al menos una hora antes de servir para que esté bien frío.
            Sírvelo en vaso o cuenco, y puedes acompañarlo con picatostes, trocitos de pepino, pimiento o huevo duro picado."],
        "idUsuario" => "usuario321",
        "compartido" => true,
        "alergias" => [],
        "pais" => "España",
        "otrasCategorias" => ["vegetariana", "bajo en grasas"],
        "tiempo" => "10 min",
        "dificultad" => "facil",
        "likes" => 15,
        "informacionNutricional" => ["calorias" => 120, "proteinas" => 2, "carbohidratos" => 10, "grasas" => 5],
        "href" => "http://localhost/api/img/recetas/gazpacho.png",
        "fecha_creacion" => "2024-01-05T14:00:00.000Z"
    ],
    [
        "nombre" => "Curry de garbanzos",
        "ingredientes" => [
            ["nombre" => "Garbanzos cocidos", "cantidad" => 250, "unidad" => "g"],
            ["nombre" => "Pepino", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Ajo", "cantidad" => 2, "unidad" => "dientes"],
            ["nombre" => "Jengibre fresco", "cantidad" => 1, "unidad" => "cm"],
            ["nombre" => "Aceite de oliva", "cantidad" => 2, "unidad" => "cucharadas"],
            ["nombre" => "Comino molido", "cantidad" => 1, "unidad" => "cucharadita"],
            ["nombre" => "Cúrcuma en polvo", "cantidad" => 1, "unidad" => "cucharadita"],
            ["nombre" => "Pimentón dulce", "cantidad" => 1, "unidad" => "cucharadita"],
            ["nombre" => "Tomate triturado", "cantidad" => 400, "unidad" => "g"],
            ["nombre" => "Leche de coco", "cantidad" => 200, "unidad" => "ml"],
            ["nombre" => "Curry en polvo", "cantidad" => 1, "unidad" => "cucharada"]
        ],
        "pasos" => ["1.Preparar la base aromática
            Pela y pica la cebolla, los ajos y el jengibre. Sofríelos en una sartén amplia con el aceite caliente a fuego medio, durante unos 5 minutos, hasta que la cebolla esté transparente.",

            "2.Agregar las especias
            Añade el comino, curry, cúrcuma y pimentón. Remueve rápidamente para que no se quemen, y deja que se cocinen 30 segundos para liberar su aroma.",

            "3.Incorporar el tomate
            Agrega los tomates rallados o el tomate triturado. Cocina a fuego medio-bajo durante unos 10 minutos, hasta que la mezcla espese y los tomates estén bien integrados.",

            "4.Añadir los garbanzos
            Incorpora los garbanzos cocidos y escurridos. Mezcla bien para que se impregnen del sofrito con especias.",

            "5.Verter la leche de coco
            Añade la leche de coco y mezcla todo. Cocina a fuego lento unos 10 minutos, removiendo de vez en cuando. Puedes añadir un poco de agua si quieres que quede más caldoso.",

            "6.Rectificar y reposar
            Prueba y ajusta de sal y pimienta. Retira del fuego y deja reposar unos minutos para que los sabores se asienten.",

            "7.Servir y acompañar
            Sirve caliente, decorado con un poco de cilantro fresco picado si lo deseas. Acompaña con arroz blanco, pan naan o solo."],
        "idUsuario" => "usuario456",
        "compartido" => true,
        "alergias" => [],
        "pais" => "India",
        "otrasCategorias" => ["vegetariana", "proteico", "sin gluten"],
        "tiempo" => "25 min",
        "dificultad" => "intermedio",
        "likes" => 12,
        "informacionNutricional" => ["calorias" => 420, "proteinas" => 14, "carbohidratos" => 35, "grasas" => 18],
        "href" => "http://localhost/api/img/recetas/curryGarbanzos.jpg",
        "fecha_creacion" => "2023-11-10T16:45:00.000Z"
    ],
    [
        "nombre" => "Pollo al horno con patatas",
        "ingredientes" => [
            ["nombre" => "Muslos de pollo", "cantidad" => 4, "unidad" => "unidad"],
            ["nombre" => "Patatas", "cantidad" => 4, "unidad" => "unidad"],
            ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Ajo", "cantidad" => 4, "unidad" => "dientes"],
            ["nombre" => "Limón", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Vino blanco", "cantidad" => 1, "unidad" => "vaso"],
            ["nombre" => "Aceite de oliva", "cantidad" => 2, "unidad" => "cucharadas"],
            ["nombre" => "Sal", "cantidad" => 1, "unidad" => "cucharadita"],
            ["nombre" => "Pimienta negra molida", "cantidad" => 1, "unidad" => "cucharadita"],
            ["nombre" => "Pimentón dulce", "cantidad" => 1, "unidad" => "cucharadita"]
        ],
        "pasos" => ["1.Preparar los ingredientes
            Pela las patatas y córtalas en rodajas de medio centímetro o en gajos gruesos. Pela la cebolla y córtala en juliana. Pela los ajos y aplástalos ligeramente con la hoja del cuchillo (sin picarlos).",

            "2.Hacer la cama de patatas y cebolla
            En una fuente de horno grande, reparte las patatas, la cebolla y los ajos. Rocía con un poco de aceite de oliva, salpimienta y añade las hierbas aromáticas. Mezcla bien con las manos para que todo quede impregnado.",

            "3.Colocar el pollo
            Limpia el pollo de restos de plumas si los tuviera y colócalo sobre la cama de patatas. Exprime el limón por encima del pollo y coloca las mitades del limón dentro de la bandeja. Añade sal, pimienta, un poco de pimentón dulce y más hierbas si te gusta el sabor más intenso. Riega con un buen chorrito de aceite de oliva.",

            "4.Opcional: añadir vino blanco
            Si usas vino blanco, vierte el vaso en el fondo de la bandeja, con cuidado de no mojar la piel del pollo para que quede crujiente.",

            "5.Hornear
            Precalienta el horno a 200 °C (calor arriba y abajo). Introduce la bandeja en la parte media del horno. Hornea durante 50-60 minutos, dándole la vuelta al pollo a mitad de cocción si quieres que se dore por ambos lados, o sube la bandeja en los últimos 10 minutos para gratinar la piel.",

            "6.Comprobar y servir
            Asegúrate de que el pollo está bien hecho por dentro (puedes pinchar con un cuchillo: el jugo debe salir claro) y que las patatas estén tiernas y doradas. Saca del horno y deja reposar 5 minutos antes de servir."],
        "idUsuario" => "usuario321",
        "compartido" => false,
        "alergias" => [],
        "pais" => "Alemania",
        "otrasCategorias" => ["alta en proteínas", "kid friendly"],
        "tiempo" => "50 min",
        "dificultad" => "intermedio",
        "likes" => 7,
        "informacionNutricional" => ["calorias" => 500, "proteinas" => 35, "carbohidratos" => 30, "grasas" => 20],
        "href" => "http://localhost/api/img/recetas/polloHornoPatatas.jpg",
        "fecha_creacion" => "2024-02-20T12:00:00.000Z"
    ],
    [
        "nombre" => "Arroz frito con verduras",
        "ingredientes" => [
            ["nombre" => "Arroz", "cantidad" => 200, "unidad" => "g"],
            ["nombre" => "Zanahoria", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Pimiento rojo", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Pimiento verde", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Salsa de soja", "cantidad" => 2, "unidad" => "cucharadas"],
            ["nombre" => "Aceite de sésamo", "cantidad" => 1, "unidad" => "cucharada"],
            ["nombre" => "Sal", "cantidad" => 1, "unidad" => "cucharadita"],
            ["nombre" => "Pimienta negra molida", "cantidad" => 1, "unidad" => "cucharadita"],
            ["nombre" => "Brotes de soja", "cantidad" => 50, "unidad" => "g"],
            ["nombre" => "Jengibre fresco", "cantidad" => 1, "unidad" => "cm"]
        ],
        "pasos" => ["1.Cocinar el arroz (mejor si es del día anterior)
            Cuece el arroz en agua con sal siguiendo las instrucciones del paquete (generalmente 10-12 min), escúrrelo bien y deja enfriar. Si puedes, guarda el arroz cocido en la nevera unas horas o desde el día anterior: al estar más seco, quedará perfecto al freír.",

            "2.Preparar las verduras
            Pela las zanahorias y córtalas en dados pequeños. Haz lo mismo con el pimiento, calabacín y cebolla. Pela y pica finamente los ajos. Si usas jengibre fresco, rállalo en este momento.",

            "3.Saltear los huevos (si los usas)
            En una sartén grande o wok con una cucharadita de aceite, bate los huevos y cocínalos como si hicieras un revuelto. Retíralos y resérvalos en un plato.",

            "4.Saltear las verduras
            En la misma sartén o wok, añade 2-3 cucharadas de aceite (mejor si es de sésamo). Cuando esté caliente, añade el ajo picado y, si usas, el jengibre. Luego incorpora la cebolla y cocina 2-3 minutos. Añade las zanahorias, pimientos y calabacín. Saltea a fuego medio-alto durante unos 6-8 minutos, removiendo con frecuencia para que queden al dente.",

            "5.Añadir el arroz y mezclar
            Incorpora el arroz frío o a temperatura ambiente. Rompe los grumos con una cuchara y mezcla bien con las verduras. Cocina a fuego fuerte unos 5 minutos más para que el arroz se fría y tome sabor.",

            "6.Sazonar
            Añade la salsa de soja (ajusta cantidad al gusto) y mezcla bien. Puedes añadir un poco más de aceite de sésamo o unas gotas de salsa de ostras si tienes. Agrega los huevos revueltos que habías reservado y remueve para integrar todo.",

            "7.Opcional: añadir guisantes o brotes de soja
            Si usas estos ingredientes, añádelos en los últimos 2 minutos de cocción para que se calienten sin pasarse.",

            "8.Servir caliente
            Sirve tu arroz frito con verduras recién hecho. Puedes decorarlo con cebollino picado o semillas de sésamo por encima."],
        "idUsuario" => "usuario654",
        "compartido" => true,
        "alergias" => [],
        "pais" => "China",
        "otrasCategorias" => ["vegetariana", "rápido", "bajo en grasas"],
        "tiempo" => "20 min",
        "dificultad" => "facil",
        "likes" => 6,
        "informacionNutricional" => ["calorias" => 300, "proteinas" => 5, "carbohidratos" => 45, "grasas" => 7],
        "href" => "http://localhost/api/img/recetas/arrozFrito.jpg",
        "fecha_creacion" => "2023-12-01T18:20:00.000Z"
    ],
    [
        "nombre" => "Crepes dulces",
        "ingredientes" => [
            ["nombre" => "Harina de trigo", "cantidad" => 250, "unidad" => "g"],
            ["nombre" => "Huevos", "cantidad" => 2, "unidad" => "unidad"],
            ["nombre" => "Leche", "cantidad" => 500, "unidad" => "ml"],
            ["nombre" => "Azúcar", "cantidad" => 1, "unidad" => "cucharada"],
            ["nombre" => "Esencia de vainilla", "cantidad" => 1, "unidad" => "cucharadita"],
            ["nombre" => "Mantequilla derretida", "cantidad" => 30, "unidad" => "g"]
        ],
        "pasos" => ["1.Preparar la masa
            En un bol grande, tamiza la harina y añade una pizca de sal y el azúcar. Haz un hueco en el centro y añade los huevos. Mezcla con unas varillas manuales o eléctricas desde el centro hacia fuera.",

            "2.Añadir la leche poco a poco
            Incorpora la leche gradualmente mientras sigues batiendo para evitar grumos. Añade también la esencia de vainilla y la mantequilla derretida. La masa debe quedar líquida y suave, sin grumos.",

            "3.Reposar la masa
            Cubre el bol con film transparente y deja reposar en la nevera al menos 30 minutos. Esto ayuda a que las crêpes queden más elásticas y suaves.",

            "4.Preparar la sartén
            Calienta una sartén antiadherente de unos 20 cm de diámetro a fuego medio-alto. Unta con un poco de mantequilla (puedes usar papel de cocina para distribuirla bien).",

            "5.Cocinar las crêpes
            Vierte un cucharón pequeño de masa en la sartén caliente. Inclina y gira la sartén para repartir la masa en una capa fina. Cocina 1-2 minutos hasta que los bordes empiecen a dorarse.",

            "6.Dar la vuelta
            Usa una espátula fina para despegar los bordes y da la vuelta con cuidado. Cocina por el otro lado 30 segundos más o hasta que esté dorada. Repite con el resto de la masa, engrasando la sartén ligeramente entre cada una.",

            "7.Servir y acompañar
            Sirve las crêpes calientes o templadas. Puedes rellenarlas con:

            Azúcar y canela

            Mermelada o compota

            Nutella o chocolate derretido

            Plátano, fresas, frutos rojos

            Crema batida, miel, sirope de arce o limón y azúcar"],
        "idUsuario" => "usuario999",
        "compartido" => false,
        "alergias" => ["gluten", "lactosa", "huevo"],
        "pais" => "Francia",
        "otrasCategorias" => ["postre", "kid friendly"],
        "tiempo" => "15 min",
        "dificultad" => "facil",
        "likes" => 3,
        "informacionNutricional" => ["calorias" => 250, "proteinas" => 6, "carbohidratos" => 35, "grasas" => 8],
        "href" => "http://localhost/api/img/recetas/crepesDulces.jpg",
        "fecha_creacion" => "2024-03-10T08:00:00.000Z"
    ],
    [
        "nombre" => "Salteado de tofu",
        "ingredientes" => [
            ["nombre" => "Tofu firme", "cantidad" => 200, "unidad" => "g"],
            ["nombre" => "Pimiento rojo", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Pimiento verde", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Zanahoria", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Calabacín", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"],
            ["nombre" => "Ajo", "cantidad" => 2, "unidad" => "dientes"],
            ["nombre" => "Salsa de soja", "cantidad" => 2, "unidad" => "cucharadas"],
            ["nombre" => "Aceite de sésamo", "cantidad" => 1, "unidad" => "cucharadita"],
            ["nombre" => "Aceite de oliva", "cantidad" => 1, "unidad" => "cucharada"],
            ["nombre" => "Semillas de sésamo", "cantidad" => 1, "unidad" => "cucharadita"],
            ["nombre" => "Arroz blanco o integral", "cantidad" => 200, "unidad" => "g"]
        ],
        "pasos" => ["1.Preparar el tofu
            Saca el tofu del envase, escúrrelo y envuélvelo en papel de cocina. Coloca un peso encima (como un plato o libro) durante 15-20 minutos para eliminar el exceso de agua. Esto ayuda a que quede más firme y dorado al cocinarlo.",

            "2.Cortar el tofu y marinar
            Corta el tofu en cubos medianos. Opcionalmente, puedes marinarlo durante 15 minutos con una mezcla de salsa de soja, jengibre y unas gotas de aceite de sésamo para potenciar el sabor.",

            "3.Dorar el tofu
            Calienta un poco de aceite en una sartén grande o wok. Dora el tofu a fuego medio-alto durante unos 6-8 minutos, girándolo hasta que todos los lados estén dorados y crujientes. Retíralo y resérvalo.",

            "4.Preparar las verduras
            Lava y corta en tiras o bastones los pimientos, la zanahoria (puedes hacerlo con pelador o en juliana), el calabacín y la cebolla. Pela y pica los ajos finamente.",

            "5.Saltear las verduras
            En la misma sartén o wok, añade un poco más de aceite. Agrega el ajo y la cebolla y sofríe 1 minuto. Incorpora las demás verduras y saltea durante 5-7 minutos, hasta que estén al dente (tiernas pero aún crujientes).",

            "6.Incorporar el tofu
            Vuelve a añadir el tofu dorado a la sartén con las verduras. Agrega la salsa de soja y, si lo deseas, un chorrito de agua o más salsa para que se mezclen bien los sabores. Cocina todo junto 2-3 minutos removiendo bien.",

            "7.Servir
            Sirve caliente, espolvoreando con semillas de sésamo por encima si tienes. Puedes acompañarlo con arroz blanco, arroz integral, noodles o comerlo solo como plato único."],
        "idUsuario" => "usuario852",
        "compartido" => true,
        "alergias" => ["soja"],
        "pais" => "China",
        "otrasCategorias" => ["vegetariana", "rico en fibra", "bajo en carbohidratos"],
        "tiempo" => "15 min",
        "dificultad" => "facil",
        "likes" => 9,
        "informacionNutricional" => ["calorias" => 280, "proteinas" => 15, "carbohidratos" => 10, "grasas" => 14],
        "href" => "http://localhost/api/img/recetas/salteadoTofu.jpg",
        "fecha_creacion" => "2024-03-25T13:10:00.000Z"
    ],
    [
        "nombre" => "Pizza margarita casera",
        "ingredientes" => [
            ["nombre" => "Harina de trigo", "cantidad" => 250, "unidad" => "g"],
            ["nombre" => "Agua tibia", "cantidad" => 150, "unidad" => "ml"],
            ["nombre" => "Azúcar", "cantidad" => 1, "unidad" => "cucharadita"],
            ["nombre" => "Sal", "cantidad" => 1, "unidad" => "cucharadita"],
            ["nombre" => "Aceite de oliva", "cantidad" => 1, "unidad" => "cucharada"],
            ["nombre" => "Levadura seca de panadería", "cantidad" => 7, "unidad" => "g"],
            ["nombre" => "Tomate triturado", "cantidad" => 200, "unidad" => "g"],
            ["nombre" => "Ajo picado", "cantidad" => 1, "unidad" => "diente"],
            ["nombre" => "Mozzarella fresca", "cantidad" => 200, "unidad" => "g"],
            ["nombre" => "Albahaca fresca", "cantidad" => 5, "unidad" => "hojas"],
            ["nombre" => "Pimienta negra molida", "cantidad" => 1, "unidad" => "cucharadita"],
            ["nombre" => "Sal", "cantidad" => 1, "unidad" => "cucharadita"],
            ["nombre" => "Aceite de oliva virgen extra", "cantidad" => 1, "unidad" => "cucharada"]
        ],
        "pasos" => ["1.Preparar la masa:
            En un bol grande, añade el agua tibia, el azúcar y la levadura seca. Remueve y deja reposar durante unos 5 minutos hasta que la levadura comience a burbujear.
            Agrega la harina y la sal. Mezcla con una cuchara de madera hasta que la masa empiece a tomar forma. Añade el aceite de oliva y amasa con las manos durante unos 10 minutos hasta que la masa esté suave y elástica. Si la masa se pega, añade un poco más de harina.
            Forma una bola con la masa, colócala en un bol enharinado, cúbrela con un paño limpio y déjala reposar durante 1-1.5 horas en un lugar cálido, hasta que haya duplicado su tamaño.",

            "2.Preparar la salsa de tomate:
            En una sartén, añade el aceite de oliva y sofríe el ajo picado durante 1-2 minutos a fuego medio, hasta que esté dorado.
            Añade el tomate triturado, el azúcar, sal y pimienta al gusto, y deja cocinar a fuego lento durante unos 10-15 minutos. Si te gusta la salsa más suave, puedes triturarla un poco.
            Cuando esté lista, retírala del fuego y deja enfriar.",

            "3.Formar la base de la pizza:
            Precalienta el horno a 220°C (con ventilador, si lo tiene).
            Una vez que la masa haya reposado, amásala en una superficie enharinada hasta que tenga el tamaño de la bandeja del horno (si no tienes piedra para pizza, una bandeja normal está bien). Puedes hacer una forma redonda o rectangular según prefieras.
            Coloca la masa estirada sobre una bandeja con papel de hornear.",

            "4.Montar la pizza:
            Extiende una capa fina de salsa de tomate sobre la masa.
            Coloca la mozzarella sobre la salsa, rompiéndola en trozos pequeños si es una bola de mozzarella.
            Rocía un poco de aceite de oliva por encima y sazona con sal y pimienta al gusto.",

            "5.Hornear:
            Lleva la pizza al horno precalentado y hornea durante 10-15 minutos o hasta que la masa esté dorada y crujiente y el queso se haya derretido y burbujeado.",

            "6.Añadir las hojas de albahaca:
            Retira la pizza del horno y añade unas hojas de albahaca fresca por encima. Puedes añadir un chorrito de aceite de oliva virgen extra para darle más sabor.",

            "7.Servir:
            Corta en porciones y disfruta de tu pizza margarita casera."],
        "idUsuario" => "usuario999",
        "compartido" => false,
        "alergias" => ["gluten", "lactosa"],
        "pais" => "Italia",
        "otrasCategorias" => ["vegetariana", "kid friendly"],
        "tiempo" => "25 min",
        "dificultad" => "intermedio",
        "likes" => 11,
        "informacionNutricional" => ["calorias" => 450, "proteinas" => 20, "carbohidratos" => 40, "grasas" => 18],
        "href" => "http://localhost/api/img/recetas/pizzaMargarita.jpg",
        "fecha_creacion" => "2024-04-01T19:00:00.000Z"
    ]
];

try {
    if (!empty($recetas)) {
        $insertManyResult = $collection->insertMany($recetas);
        // Opcional: puedes añadir un mensaje de éxito si lo deseas para depuración
        // echo "Se insertaron " . $insertManyResult->getInsertedCount() . " recetas correctamente.";
    } else {
        // echo "No hay recetas para insertar.";
    }
} catch (Exception $e) {
    // Considera loggear el error en lugar de solo hacer echo, o manejarlo de forma más robusta.
    error_log("Error al insertar las recetas: " . $e->getMessage());
    // echo "Error al insertar las recetas: " . $e->getMessage(); // Puedes mantener el echo si es para desarrollo rápido
    exit;
}