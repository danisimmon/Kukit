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
        "pasos" => ["Cocinar el pollo
            Corta los 200 g de pollo en tiras o trozos pequeños.
            Calienta una sartén con un poco de aceite a fuego medio-alto.
            Añade el pollo a la sartén y cocínalo durante 10 minutos, removiendo ocasionalmente, hasta que esté bien dorado y completamente cocido por dentro.
            Puedes sazonarlo con sal, pimienta o tus especias favoritas (como comino o pimentón).",

            "Preparar los ingredientes adicionales
            Lava y corta la lechuga en tiras finas.
            Si vas a usar salsa, asegúrate de tenerla lista (puede ser salsa picante, guacamole, o la de tu preferencia).",

            "Montar los tacos
            Calienta ligeramente las 4 tortillas en una sartén o en el microondas.
            Coloca una porción del pollo cocido en el centro de cada tortilla.
            Añade lechuga por encima y un poco de salsa si lo deseas.
            Dobla las tortillas para formar los tacos.",

            "Servir
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
            "pasos" => ["Cocinar el arroz
                Lava el arroz para sushi bajo el grifo, removiendo con la mano, hasta que el agua salga clara.
                Cocina los 200 g de arroz según las instrucciones del paquete (normalmente, se hierve en agua durante 10–12 minutos y luego se deja reposar).
                Una vez cocido, mezcla el arroz con un poco de vinagre de arroz, azúcar y sal (opcional), y déjalo enfriar a temperatura ambiente.",

                "Preparar los ingredientes del relleno
                Pela y corta el aguacate en tiras finas.
                Lava y corta el pepino también en tiras delgadas, retirando las semillas si lo deseas.",

                "Montar el sushi
                Coloca una hoja de alga nori sobre una esterilla de bambú (makisu), con el lado rugoso hacia arriba.
                Extiende una capa fina y uniforme de arroz sobre el alga, dejando un borde de unos 2 cm en la parte superior sin arroz.
                Coloca las tiras de aguacate y pepino en línea horizontal, cerca de la parte inferior del arroz.",

                "Enrollar el sushi
                Con ayuda de la esterilla, enrolla el sushi firmemente empezando desde la parte inferior.
                Presiona ligeramente para que quede bien formado, y sella el borde del alga humedeciéndolo con un poco de agua.",

                "Cortar y servir
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
        "pasos" => ["Preparar los ingredientes
            Lava bien los tomates, el pimiento y el pepino.
            Pela el pepino si prefieres un sabor más suave y corta todos los vegetales en trozos grandes.
            Pela el ajo (puedes quitarle el germen para que sea más suave).",

            "Hidratar el pan (opcional)
            Si vas a usar pan, remójalo en un poco de agua fría durante unos minutos hasta que esté blando. Escúrrelo bien.",

            "Triturar todos los ingredientes
            En una batidora o robot de cocina, añade los tomates troceados, el pimiento, el pepino, el ajo y el pan escurrido (si lo usas).
            Agrega una pizca de sal y el vinagre de vino. Tritura a máxima potencia hasta obtener una mezcla homogénea.",

            "Incorporar el aceite de oliva
            Con la batidora aún en marcha, añade poco a poco el aceite de oliva virgen extra para emulsionar el gazpacho y que quede cremoso.",

            "Ajustar la textura
            Si queda muy espeso, añade un poco de agua fría hasta obtener la textura deseada. Vuelve a batir unos segundos.",

            "Colar (opcional)
            Si quieres un gazpacho más fino, pásalo por un colador o chino para eliminar pieles y semillas.",

            "Refrigerar y servir
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
        "pasos" => ["Preparar la base aromática
            Pela y pica la cebolla, los ajos y el jengibre. Sofríelos en una sartén amplia con el aceite caliente a fuego medio, durante unos 5 minutos, hasta que la cebolla esté transparente.",

            "Agregar las especias
            Añade el comino, curry, cúrcuma y pimentón. Remueve rápidamente para que no se quemen, y deja que se cocinen 30 segundos para liberar su aroma.",

            "Incorporar el tomate
            Agrega los tomates rallados o el tomate triturado. Cocina a fuego medio-bajo durante unos 10 minutos, hasta que la mezcla espese y los tomates estén bien integrados.",

            "Añadir los garbanzos
            Incorpora los garbanzos cocidos y escurridos. Mezcla bien para que se impregnen del sofrito con especias.",

            "Verter la leche de coco
            Añade la leche de coco y mezcla todo. Cocina a fuego lento unos 10 minutos, removiendo de vez en cuando. Puedes añadir un poco de agua si quieres que quede más caldoso.",

            "Rectificar y reposar
            Prueba y ajusta de sal y pimienta. Retira del fuego y deja reposar unos minutos para que los sabores se asienten.",

            "Servir y acompañar
            Sirve caliente, decorado con un poco de cilantro fresco picado si lo deseas. Acompaña con arroz blanco, pan naan o solo."],
        "idUsuario" => "usuario456",
        "compartido" => true,
        "alergias" => [],
        "pais" => "India",
        "otrasCategorias" => ["vegetariana", "proteico", "sin gluten"],
        "tiempo" => "25 min",
        "dificultad" => "intermedio",
        "likes" => 12,
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
        "pasos" => ["Preparar los ingredientes
            Pela las patatas y córtalas en rodajas de medio centímetro o en gajos gruesos. Pela la cebolla y córtala en juliana. Pela los ajos y aplástalos ligeramente con la hoja del cuchillo (sin picarlos).",

            "Hacer la cama de patatas y cebolla
            En una fuente de horno grande, reparte las patatas, la cebolla y los ajos. Rocía con un poco de aceite de oliva, salpimienta y añade las hierbas aromáticas. Mezcla bien con las manos para que todo quede impregnado.",

            "Colocar el pollo
            Limpia el pollo de restos de plumas si los tuviera y colócalo sobre la cama de patatas. Exprime el limón por encima del pollo y coloca las mitades del limón dentro de la bandeja. Añade sal, pimienta, un poco de pimentón dulce y más hierbas si te gusta el sabor más intenso. Riega con un buen chorrito de aceite de oliva.",

            "Opcional: añadir vino blanco
            Si usas vino blanco, vierte el vaso en el fondo de la bandeja, con cuidado de no mojar la piel del pollo para que quede crujiente.",

            "Hornear
            Precalienta el horno a 200 °C (calor arriba y abajo). Introduce la bandeja en la parte media del horno. Hornea durante 50-60 minutos, dándole la vuelta al pollo a mitad de cocción si quieres que se dore por ambos lados, o sube la bandeja en los últimos 10 minutos para gratinar la piel.",

            "Comprobar y servir
            Asegúrate de que el pollo está bien hecho por dentro (puedes pinchar con un cuchillo: el jugo debe salir claro) y que las patatas estén tiernas y doradas. Saca del horno y deja reposar 5 minutos antes de servir."],
        "idUsuario" => "usuario321",
        "compartido" => false,
        "alergias" => [],
        "pais" => "Alemania",
        "otrasCategorias" => ["alta en proteínas", "kid friendly"],
        "tiempo" => "50 min",
        "dificultad" => "intermedio",
        "likes" => 7,
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
        "pasos" => ["Cocinar el arroz (mejor si es del día anterior)
            Cuece el arroz en agua con sal siguiendo las instrucciones del paquete (generalmente 10-12 min), escúrrelo bien y deja enfriar. Si puedes, guarda el arroz cocido en la nevera unas horas o desde el día anterior: al estar más seco, quedará perfecto al freír.",

            "Preparar las verduras
            Pela las zanahorias y córtalas en dados pequeños. Haz lo mismo con el pimiento, calabacín y cebolla. Pela y pica finamente los ajos. Si usas jengibre fresco, rállalo en este momento.",

            "Saltear los huevos (si los usas)
            En una sartén grande o wok con una cucharadita de aceite, bate los huevos y cocínalos como si hicieras un revuelto. Retíralos y resérvalos en un plato.",

            "Saltear las verduras
            En la misma sartén o wok, añade 2-3 cucharadas de aceite (mejor si es de sésamo). Cuando esté caliente, añade el ajo picado y, si usas, el jengibre. Luego incorpora la cebolla y cocina 2-3 minutos. Añade las zanahorias, pimientos y calabacín. Saltea a fuego medio-alto durante unos 6-8 minutos, removiendo con frecuencia para que queden al dente.",

            "Añadir el arroz y mezclar
            Incorpora el arroz frío o a temperatura ambiente. Rompe los grumos con una cuchara y mezcla bien con las verduras. Cocina a fuego fuerte unos 5 minutos más para que el arroz se fría y tome sabor.",

            "Sazonar
            Añade la salsa de soja (ajusta cantidad al gusto) y mezcla bien. Puedes añadir un poco más de aceite de sésamo o unas gotas de salsa de ostras si tienes. Agrega los huevos revueltos que habías reservado y remueve para integrar todo.",

            "Opcional: añadir guisantes o brotes de soja
            Si usas estos ingredientes, añádelos en los últimos 2 minutos de cocción para que se calienten sin pasarse.",

            "Servir caliente
            Sirve tu arroz frito con verduras recién hecho. Puedes decorarlo con cebollino picado o semillas de sésamo por encima."],
        "idUsuario" => "usuario654",
        "compartido" => true,
        "alergias" => [],
        "pais" => "China",
        "otrasCategorias" => ["vegetariana", "rápido", "bajo en grasas"],
        "tiempo" => "20 min",
        "dificultad" => "facil",
        "likes" => 6,
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
        "pasos" => ["Preparar la masa
            En un bol grande, tamiza la harina y añade una pizca de sal y el azúcar. Haz un hueco en el centro y añade los huevos. Mezcla con unas varillas manuales o eléctricas desde el centro hacia fuera.",

            "Añadir la leche poco a poco
            Incorpora la leche gradualmente mientras sigues batiendo para evitar grumos. Añade también la esencia de vainilla y la mantequilla derretida. La masa debe quedar líquida y suave, sin grumos.",

            "Reposar la masa
            Cubre el bol con film transparente y deja reposar en la nevera al menos 30 minutos. Esto ayuda a que las crêpes queden más elásticas y suaves.",

            "Preparar la sartén
            Calienta una sartén antiadherente de unos 20 cm de diámetro a fuego medio-alto. Unta con un poco de mantequilla (puedes usar papel de cocina para distribuirla bien).",

            "Cocinar las crêpes
            Vierte un cucharón pequeño de masa en la sartén caliente. Inclina y gira la sartén para repartir la masa en una capa fina. Cocina 1-2 minutos hasta que los bordes empiecen a dorarse.",

            "Dar la vuelta
            Usa una espátula fina para despegar los bordes y da la vuelta con cuidado. Cocina por el otro lado 30 segundos más o hasta que esté dorada. Repite con el resto de la masa, engrasando la sartén ligeramente entre cada una.",

            "Servir y acompañar
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
        "pasos" => ["Preparar el tofu
            Saca el tofu del envase, escúrrelo y envuélvelo en papel de cocina. Coloca un peso encima (como un plato o libro) durante 15-20 minutos para eliminar el exceso de agua. Esto ayuda a que quede más firme y dorado al cocinarlo.",

            "Cortar el tofu y marinar
            Corta el tofu en cubos medianos. Opcionalmente, puedes marinarlo durante 15 minutos con una mezcla de salsa de soja, jengibre y unas gotas de aceite de sésamo para potenciar el sabor.",

            "Dorar el tofu
            Calienta un poco de aceite en una sartén grande o wok. Dora el tofu a fuego medio-alto durante unos 6-8 minutos, girándolo hasta que todos los lados estén dorados y crujientes. Retíralo y resérvalo.",

            "Preparar las verduras
            Lava y corta en tiras o bastones los pimientos, la zanahoria (puedes hacerlo con pelador o en juliana), el calabacín y la cebolla. Pela y pica los ajos finamente.",

            "Saltear las verduras
            En la misma sartén o wok, añade un poco más de aceite. Agrega el ajo y la cebolla y sofríe 1 minuto. Incorpora las demás verduras y saltea durante 5-7 minutos, hasta que estén al dente (tiernas pero aún crujientes).",

            "Incorporar el tofu
            Vuelve a añadir el tofu dorado a la sartén con las verduras. Agrega la salsa de soja y, si lo deseas, un chorrito de agua o más salsa para que se mezclen bien los sabores. Cocina todo junto 2-3 minutos removiendo bien.",

            "Servir
            Sirve caliente, espolvoreando con semillas de sésamo por encima si tienes. Puedes acompañarlo con arroz blanco, arroz integral, noodles o comerlo solo como plato único."],
        "idUsuario" => "usuario852",
        "compartido" => true,
        "alergias" => ["soja"],
        "pais" => "China",
        "otrasCategorias" => ["vegetariana", "rico en fibra", "bajo en carbohidratos"],
        "tiempo" => "15 min",
        "dificultad" => "facil",
        "likes" => 9,
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
        "pasos" => ["Preparar la masa:
            En un bol grande, añade el agua tibia, el azúcar y la levadura seca. Remueve y deja reposar durante unos 5 minutos hasta que la levadura comience a burbujear.
            Agrega la harina y la sal. Mezcla con una cuchara de madera hasta que la masa empiece a tomar forma. Añade el aceite de oliva y amasa con las manos durante unos 10 minutos hasta que la masa esté suave y elástica. Si la masa se pega, añade un poco más de harina.
            Forma una bola con la masa, colócala en un bol enharinado, cúbrela con un paño limpio y déjala reposar durante 1-1.5 horas en un lugar cálido, hasta que haya duplicado su tamaño.",

            "Preparar la salsa de tomate:
            En una sartén, añade el aceite de oliva y sofríe el ajo picado durante 1-2 minutos a fuego medio, hasta que esté dorado.
            Añade el tomate triturado, el azúcar, sal y pimienta al gusto, y deja cocinar a fuego lento durante unos 10-15 minutos. Si te gusta la salsa más suave, puedes triturarla un poco.
            Cuando esté lista, retírala del fuego y deja enfriar.",

            "Formar la base de la pizza:
            Precalienta el horno a 220°C (con ventilador, si lo tiene).
            Una vez que la masa haya reposado, amásala en una superficie enharinada hasta que tenga el tamaño de la bandeja del horno (si no tienes piedra para pizza, una bandeja normal está bien). Puedes hacer una forma redonda o rectangular según prefieras.
            Coloca la masa estirada sobre una bandeja con papel de hornear.",

            "Montar la pizza:
            Extiende una capa fina de salsa de tomate sobre la masa.
            Coloca la mozzarella sobre la salsa, rompiéndola en trozos pequeños si es una bola de mozzarella.
            Rocía un poco de aceite de oliva por encima y sazona con sal y pimienta al gusto.",

            "Hornear:
            Lleva la pizza al horno precalentado y hornea durante 10-15 minutos o hasta que la masa esté dorada y crujiente y el queso se haya derretido y burbujeado.",

            "Añadir las hojas de albahaca:
            Retira la pizza del horno y añade unas hojas de albahaca fresca por encima. Puedes añadir un chorrito de aceite de oliva virgen extra para darle más sabor.",

            "Servir:
            Corta en porciones y disfruta de tu pizza margarita casera."],
        "idUsuario" => "usuario999",
        "compartido" => false,
        "alergias" => ["gluten", "lactosa"],
        "pais" => "Italia",
        "otrasCategorias" => ["vegetariana", "kid friendly"],
        "tiempo" => "25 min",
        "dificultad" => "intermedio",
        "likes" => 11,
        "href" => "http://localhost/api/img/recetas/pizzaMargarita.jpg",
        "fecha_creacion" => "2024-04-01T19:00:00.000Z"
    ],
    [
    "nombre" => "Enchiladas verdes",
    "ingredientes" => [
        ["nombre" => "Tortillas de maíz", "cantidad" => 4, "unidad" => "unidades"],
        ["nombre" => "Pechuga de pollo deshebrada", "cantidad" => 150, "unidad" => "g"],
        ["nombre" => "Salsa verde", "cantidad" => 200, "unidad" => "ml"],
        ["nombre" => "Crema agria", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Queso fresco", "cantidad" => 50, "unidad" => "g"],
        ["nombre" => "Cebolla", "cantidad" => 30, "unidad" => "g"],
        ["nombre" => "Aceite vegetal", "cantidad" => 1, "unidad" => "cucharada"]
    ],
    "pasos" => [
        "1.Calentar la salsa  
        Coloca la salsa verde en una cacerola pequeña y caliéntala a fuego medio hasta que hierva suavemente.  
        Reserva caliente.",

        "2.Freír las tortillas  
        En una sartén, calienta el aceite vegetal.  
        Fríe ligeramente las tortillas una por una durante unos segundos por lado, lo justo para que se ablanden.  
        Colócalas sobre papel absorbente para quitar el exceso de grasa.",

        "3.Rellenar y enrollar  
        Coloca una porción de pollo deshebrado en el centro de cada tortilla.  
        Enróllalas con cuidado y colócalas en un plato.",

        "4.Bañar y decorar  
        Vierte la salsa verde caliente sobre las enchiladas.  
        Añade la crema agria por encima, espolvorea el queso fresco y agrega cebolla picada al gusto.  
        Sirve caliente."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["lactosa", "gluten"],
    "pais" => "México",
    "otrasCategorias" => ["tradicional", "picante"],
    "tiempo" => "25 min",
    "dificultad" => "media",
    "likes" => 9,
    "href" => "http://localhost/api/img/recetas/enchiladasVerdes.jpg",
    "fecha_creacion" => "2023-10-03T13:30:00.000Z"
],
[
    "nombre" => "Onigiri (bolas de arroz)",
    "ingredientes" => [
        ["nombre" => "Arroz japonés", "cantidad" => 200, "unidad" => "g"],
        ["nombre" => "Agua", "cantidad" => 300, "unidad" => "ml"],
        ["nombre" => "Sal", "cantidad" => 1, "unidad" => "cucharadita"],
        ["nombre" => "Alga nori", "cantidad" => 2, "unidad" => "hojas"],
        ["nombre" => "Atún enlatado", "cantidad" => 50, "unidad" => "g"],
        ["nombre" => "Mayonesa", "cantidad" => 1, "unidad" => "cucharada"]
    ],
    "pasos" => [
        "1.Cocer el arroz  
        Lava el arroz con agua fría hasta que el agua salga clara.  
        Coloca el arroz con los 300 ml de agua en una olla y cocina a fuego medio-alto hasta que hierva.  
        Luego baja el fuego y cocina tapado durante 10-12 minutos.  
        Deja reposar 10 minutos sin destapar.",

        "2.Preparar el relleno  
        Mezcla el atún escurrido con la mayonesa en un bol pequeño.  
        Reserva para usar como relleno.",

        "3.Formar los onigiri  
        Humedece tus manos con agua y un poco de sal.  
        Toma una porción de arroz, aplánala ligeramente y coloca una cucharadita del relleno en el centro.  
        Cierra con más arroz y forma un triángulo compacto con las manos.",

        "4.Decorar con alga nori  
        Corta las hojas de alga nori en tiras y colócalas alrededor o en la base del onigiri.  
        Sirve a temperatura ambiente o ligeramente tibios."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["pescado", "gluten"],
    "pais" => "Japón",
    "otrasCategorias" => ["tradicional", "snack"],
    "tiempo" => "30 min",
    "dificultad" => "media",
    "likes" => 7,
    "href" => "http://localhost/api/img/recetas/onigiri.jpg",
    "fecha_creacion" => "2023-10-04T11:15:00.000Z"
],
[
    "nombre" => "Tortilla de patatas",
    "ingredientes" => [
        ["nombre" => "Patatas", "cantidad" => 400, "unidad" => "g"],
        ["nombre" => "Huevos", "cantidad" => 4, "unidad" => "unidades"],
        ["nombre" => "Cebolla", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Aceite de oliva", "cantidad" => 100, "unidad" => "ml"],
        ["nombre" => "Sal", "cantidad" => 1, "unidad" => "cucharadita"]
    ],
    "pasos" => [
        "1.Preparar las patatas y la cebolla  
        Pela las patatas y córtalas en rodajas finas o en dados pequeños.  
        Pela y pica la cebolla en juliana o trozos pequeños, según tu preferencia.",

        "2.Freír las patatas y cebolla  
        Calienta el aceite de oliva en una sartén grande a fuego medio.  
        Añade las patatas y la cebolla, y cocina lentamente durante unos 20 minutos, removiendo de vez en cuando hasta que estén blandas pero no crujientes.  
        Escurre el aceite y reserva las patatas y cebolla en un bol.",

        "3.Batir los huevos y mezclar  
        Bate los huevos en un bol grande con una pizca de sal.  
        Añade las patatas y cebolla escurridas y mezcla bien.  
        Deja reposar la mezcla 5 minutos para que los sabores se integren.",

        "4.Cocinar la tortilla  
        Calienta una sartén antiadherente con un chorrito de aceite.  
        Vierte la mezcla y cocina a fuego medio durante 4-5 minutos.  
        Da la vuelta con cuidado usando un plato o tapa, y cocina otros 3-4 minutos por el otro lado.  
        La tortilla puede quedar jugosa o bien hecha, según tu gusto."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["huevo"],
    "pais" => "España",
    "otrasCategorias" => ["tradicional", "vegetariana"],
    "tiempo" => "35 min",
    "dificultad" => "media",
    "likes" => 12,
    "href" => "http://localhost/api/img/recetas/tortillaPatatas.jpg",
    "fecha_creacion" => "2023-10-05T17:45:00.000Z"
],
[
    "nombre" => "Chana Masala",
    "ingredientes" => [
        ["nombre" => "Garbanzos cocidos", "cantidad" => 400, "unidad" => "g"],
        ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Tomate", "cantidad" => 2, "unidad" => "unidades"],
        ["nombre" => "Ajo", "cantidad" => 2, "unidad" => "dientes"],
        ["nombre" => "Jengibre fresco", "cantidad" => 1, "unidad" => "cucharadita"],
        ["nombre" => "Aceite vegetal", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Garam masala", "cantidad" => 1, "unidad" => "cucharadita"],
        ["nombre" => "Comino en polvo", "cantidad" => 1, "unidad" => "cucharadita"],
        ["nombre" => "Cúrcuma", "cantidad" => 0.5, "unidad" => "cucharadita"],
        ["nombre" => "Sal", "cantidad" => 1, "unidad" => "cucharadita"],
        ["nombre" => "Cilantro fresco", "cantidad" => 2, "unidad" => "cucharadas"]
    ],
    "pasos" => [
        "1.Preparar la base  
        Pela y pica finamente la cebolla, el ajo y el jengibre.  
        Ralla o tritura los tomates.",

        "2.Sofreír las especias  
        En una sartén grande, calienta el aceite vegetal.  
        Añade la cebolla y sofríe a fuego medio hasta que esté dorada.  
        Agrega el ajo, el jengibre y todas las especias (garam masala, comino, cúrcuma). Cocina 1 minuto más.",

        "3.Añadir tomate y garbanzos  
        Incorpora el tomate triturado y cocina unos 5-7 minutos hasta que espese.  
        Añade los garbanzos cocidos y mezcla bien.  
        Agrega un poco de agua si es necesario para ajustar la consistencia. Cocina 10 minutos a fuego medio.",

        "4.Servir  
        Corrige de sal si es necesario.  
        Sirve caliente, decorado con cilantro fresco picado.  
        Acompaña con arroz basmati o pan naan."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => [],
    "pais" => "India",
    "otrasCategorias" => ["vegana", "sin gluten", "tradicional"],
    "tiempo" => "40 min",
    "dificultad" => "media",
    "likes" => 9,
    "href" => "http://localhost/api/img/recetas/chanaMasala.jpg",
    "fecha_creacion" => "2023-10-06T14:30:00.000Z"
],
[
    "nombre" => "Quiche Lorraine",
    "ingredientes" => [
        ["nombre" => "Masa quebrada", "cantidad" => 1, "unidad" => "base"],
        ["nombre" => "Tocino ahumado", "cantidad" => 150, "unidad" => "g"],
        ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Huevos", "cantidad" => 3, "unidad" => "unidades"],
        ["nombre" => "Nata para cocinar", "cantidad" => 200, "unidad" => "ml"],
        ["nombre" => "Nuez moscada", "cantidad" => 0.25, "unidad" => "cucharadita"],
        ["nombre" => "Sal y pimienta", "cantidad" => "al gusto", "unidad" => ""]
    ],
    "pasos" => [
        "1.Preparar la base y el relleno  
        Precalienta el horno a 180 °C.  
        Forra un molde con la masa quebrada y pínchala con un tenedor. Reserva.",

        "2.Sofreír el tocino y la cebolla  
        Corta el tocino en tiras y la cebolla en juliana.  
        En una sartén, sofríe el tocino hasta que esté dorado, luego añade la cebolla y cocina 3-4 minutos. Escurre el exceso de grasa.",

        "3.Batir los huevos y nata  
        En un bol, bate los huevos con la nata, añade sal, pimienta y nuez moscada. Incorpora el tocino y la cebolla.",

        "4.Hornear  
        Vierte la mezcla sobre la masa.  
        Hornea durante 30-35 minutos hasta que cuaje y la superficie esté dorada.  
        Deja enfriar unos minutos antes de desmoldar y servir."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["lactosa", "gluten", "huevo"],
    "pais" => "Francia",
    "otrasCategorias" => ["entrante", "tradicional"],
    "tiempo" => "50 min",
    "dificultad" => "media",
    "likes" => 14,
    "href" => "http://localhost/api/img/recetas/quicheLorraine.jpg",
    "fecha_creacion" => "2023-10-07T12:00:00.000Z"
],
[
    "nombre" => "Bratwurst con chucrut",
    "ingredientes" => [
        ["nombre" => "Bratwurst (salchichas alemanas)", "cantidad" => 4, "unidad" => "unidades"],
        ["nombre" => "Chucrut (col fermentada)", "cantidad" => 300, "unidad" => "g"],
        ["nombre" => "Cerveza alemana", "cantidad" => 100, "unidad" => "ml"],
        ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Aceite", "cantidad" => 1, "unidad" => "cucharada"],
        ["nombre" => "Pimienta negra", "cantidad" => 0.5, "unidad" => "cucharadita"]
    ],
    "pasos" => [
        "1.Dorar las salchichas  
        En una sartén con aceite, dora las bratwurst a fuego medio-alto durante 5-6 minutos por cada lado hasta que estén bien marcadas. Reserva.",

        "2.Sofreír la cebolla y chucrut  
        En la misma sartén, añade la cebolla picada y sofríela hasta que se torne transparente.  
        Agrega el chucrut y la cerveza, mezcla y cocina a fuego medio durante 8-10 minutos.",

        "3.Servir  
        Apoya las bratwurst sobre una cama de chucrut caliente.  
        Espolvorea con pimienta negra molida y sirve con pan o patatas."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["gluten"],
    "pais" => "Alemania",
    "otrasCategorias" => ["principal", "tradicional"],
    "tiempo" => "30 min",
    "dificultad" => "fácil",
    "likes" => 8,
    "href" => "http://localhost/api/img/recetas/bratwurst.jpg",
    "fecha_creacion" => "2023-10-08T18:00:00.000Z"
],
[
    "nombre" => "Mac and Cheese",
    "ingredientes" => [
        ["nombre" => "Macarrones", "cantidad" => 200, "unidad" => "g"],
        ["nombre" => "Mantequilla", "cantidad" => 30, "unidad" => "g"],
        ["nombre" => "Harina", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Leche", "cantidad" => 300, "unidad" => "ml"],
        ["nombre" => "Queso cheddar rallado", "cantidad" => 200, "unidad" => "g"],
        ["nombre" => "Sal y pimienta", "cantidad" => "al gusto", "unidad" => ""]
    ],
    "pasos" => [
        "1.Cocer la pasta  
        Cocina los macarrones en abundante agua con sal según el tiempo del paquete, generalmente 8-10 minutos. Escurre y reserva.",

        "2.Preparar la bechamel ligera  
        En una cacerola, derrite la mantequilla a fuego medio.  
        Añade la harina y cocina 1 minuto, removiendo.  
        Poco a poco, añade la leche sin dejar de remover hasta que espese y tenga consistencia cremosa.",

        "3.Añadir el queso  
        Retira la cacerola del fuego y añade el queso cheddar rallado.  
        Remueve hasta que se funda y obtengas una salsa homogénea. Sazona al gusto.",

        "4.Mezclar y gratinar  
        Incorpora los macarrones a la salsa de queso.  
        Coloca todo en una fuente apta para horno y gratina a 200 °C durante 10 minutos hasta que la superficie esté dorada."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["gluten", "lactosa"],
    "pais" => "Estados Unidos",
    "otrasCategorias" => ["confort", "familiar"],
    "tiempo" => "40 min",
    "dificultad" => "media",
    "likes" => 15,
    "href" => "http://localhost/api/img/recetas/macAndCheese.jpg",
    "fecha_creacion" => "2023-10-09T16:20:00.000Z"
],
[
    "nombre" => "Feijão Tropeiro",
    "ingredientes" => [
        ["nombre" => "Frijoles cocidos", "cantidad" => 400, "unidad" => "g"],
        ["nombre" => "Tocino picado", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Chorizo", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Farinha de mandioca", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Huevos", "cantidad" => 2, "unidad" => "unidades"],
        ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Ajo", "cantidad" => 2, "unidad" => "dientes"],
        ["nombre" => "Aceite vegetal", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Sal y pimienta", "cantidad" => "al gusto", "unidad" => ""]
    ],
    "pasos" => [
        "1.Sofreír tocino y chorizo  
        En una sartén grande, calienta el aceite y fríe el tocino picado hasta que esté dorado.  
        Añade el chorizo y cocina unos minutos más.",

        "2.Añadir cebolla y ajo  
        Incorpora la cebolla picada y el ajo; sofríe hasta que la cebolla esté transparente.",

        "3.Incorporar frijoles y mandioca  
        Agrega los frijoles cocidos y mezcla bien.  
        Añade la farinha de mandioca (harina de yuca), remueve y cocina 5 minutos.",

        "4.Finalizar con huevo  
        En una sartén aparte, fríe los huevos al gusto.  
        Sirve los frijoles con un huevo encima y sazona con sal y pimienta."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["gluten"],
    "pais" => "Brasil",
    "otrasCategorias" => ["tradicional", "principal"],
    "tiempo" => "35 min",
    "dificultad" => "media",
    "likes" => 10,
    "href" => "http://localhost/api/img/recetas/feijaoTropeiro.jpg",
    "fecha_creacion" => "2023-10-10T14:00:00.000Z"
],
[
    "nombre" => "Pollo Kung Pao",
    "ingredientes" => [
        ["nombre" => "Pechuga de pollo", "cantidad" => 300, "unidad" => "g"],
        ["nombre" => "Cacahuetes", "cantidad" => 50, "unidad" => "g"],
        ["nombre" => "Pimiento rojo", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Cebolla tierna", "cantidad" => 2, "unidad" => "unidades"],
        ["nombre" => "Ajo", "cantidad" => 2, "unidad" => "dientes"],
        ["nombre" => "Jengibre fresco", "cantidad" => 1, "unidad" => "cucharadita"],
        ["nombre" => "Salsa de soja", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Vinagre de arroz", "cantidad" => 1, "unidad" => "cucharada"],
        ["nombre" => "Azúcar", "cantidad" => 1, "unidad" => "cucharadita"],
        ["nombre" => "Aceite de sésamo (o vegetal)", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Ají seco (opcional)", "cantidad" => 2, "unidad" => "unidades"]
    ],
    "pasos" => [
        "1.Marinado rápido  
        Corta el pollo en dados y marínalo con una cucharada de salsa de soja y una cucharadita de aceite de sésamo durante 10 minutos.",

        "2.Salta ajo, jengibre y pimiento  
        En un wok o sartén grande, calienta una cucharada de aceite.  
        Añade el ajo picado, el jengibre y el pimiento cortado en trozos. Saltea 2–3 minutos.",

        "3.Cocina el pollo  
        Agrega el pollo marinado al wok. Cocina hasta que esté dorado y bien cocido.",

        "4.Salsa y cacahuetes  
        Incorpora la otra cucharada de soja, el vinagre, azúcar y ají seco.  
        Mezcla bien y añade los cacahuetes. Cocina 2 minutos más.",

        "5.Servir  
        Retira y sirve caliente sobre arroz blanco."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["frutos secos", "gluten"],
    "pais" => "China",
    "otrasCategorias" => ["picante", "principal"],
    "tiempo" => "30 min",
    "dificultad" => "media",
    "likes" => 13,
    "href" => "http://localhost/api/img/recetas/kungPao.jpg",
    "fecha_creacion" => "2023-10-11T13:00:00.000Z"
],
[
    "nombre" => "Pad Thai",
    "ingredientes" => [
        ["nombre" => "Fideos de arroz", "cantidad" => 200, "unidad" => "g"],
        ["nombre" => "Gambas peladas", "cantidad" => 150, "unidad" => "g"],
        ["nombre" => "Huevo", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Brotes de soja", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Cacahuetes picados", "cantidad" => 30, "unidad" => "g"],
        ["nombre" => "Cebolla verde", "cantidad" => 2, "unidad" => "unidades"],
        ["nombre" => "Salsa de pescado", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Azúcar de palma o moreno", "cantidad" => 1, "unidad" => "cucharada"],
        ["nombre" => "Tamarindo en pasta", "cantidad" => 1, "unidad" => "cucharada"],
        ["nombre" => "Aceite vegetal", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Chile en polvo (opcional)", "cantidad" => "al gusto", "unidad" => ""]
    ],
    "pasos" => [
        "1.Preparar los fideos  
        Remoja los fideos en agua tibia durante 10 minutos hasta que estén blandos. Escurre y reserva.",

        "2.Cocinar gambas y huevo  
        Calienta aceite en wok. Añade las gambas y cocina 2 minutos.  
        Empuja las gambas a un lado y rompe el huevo; revuélvelo hasta que cuaje.",

        "3.Incorporar salsa y fideos  
        Añade la salsa de pescado, tamarindo y azúcar; mezcla.  
        Incorpora los fideos y los brotes de soja. Saltea todo junto un par de minutos.",

        "4.Terminar y servir  
        Retira del fuego, añade los cacahuetes picados y cebolla verde en rodajas.  
        Sirve caliente, con chile en polvo si gustas."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["frutos secos", "marisco", "gluten"],
    "pais" => "Tailandia",
    "otrasCategorias" => ["callejera", "picante"],
    "tiempo" => "35 min",
    "dificultad" => "media",
    "likes" => 11,
    "href" => "http://localhost/api/img/recetas/padThai.jpg",
    "fecha_creacion" => "2023-10-12T12:30:00.000Z"
],
[
    "nombre" => "Bibimbap",
    "ingredientes" => [
        ["nombre" => "Arroz blanco cocido", "cantidad" => 300, "unidad" => "g"],
        ["nombre" => "Carne de ternera", "cantidad" => 150, "unidad" => "g"],
        ["nombre" => "Zanahoria", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Espinacas", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Brotes de soja", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Huevo", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Pasta gochujang", "cantidad" => 1, "unidad" => "cucharada"],
        ["nombre" => "Aceite de sésamo", "cantidad" => 1, "unidad" => "cucharada"],
        ["nombre" => "Ajo", "cantidad" => 1, "unidad" => "diente"],
        ["nombre" => "Aceite vegetal", "cantidad" => 1, "unidad" => "cucharada"]
    ],
    "pasos" => [
        "1.Preparar los ingredientes  
        Corta la zanahoria en tiras, saltea las espinacas y brotes de soja por separado.  
        Cocina la carne con ajo picado y aceite de sésamo.",

        "2.Cocinar el arroz y el huevo  
        Cocina el arroz blanco y fríe un huevo con la yema líquida (estilo sunny side up).",

        "3.Montar el plato  
        Sirve el arroz en un bol y coloca por encima la carne y las verduras.  
        Añade el huevo frito en el centro y una cucharada de gochujang.",

        "4.Servir  
        Mezclar todo bien antes de comer."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["gluten", "huevo"],
    "pais" => "Corea del Sur",
    "otrasCategorias" => ["completo", "picante"],
    "tiempo" => "40 min",
    "dificultad" => "media",
    "likes" => 14,
    "href" => "http://localhost/api/img/recetas/bibimbap.jpg",
    "fecha_creacion" => "2023-10-13T11:30:00.000Z"
],
[
    "nombre" => "Moussaka",
    "ingredientes" => [
        ["nombre" => "Berenjenas", "cantidad" => 2, "unidad" => "unidades"],
        ["nombre" => "Carne picada de cordero o ternera", "cantidad" => 300, "unidad" => "g"],
        ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Ajo", "cantidad" => 2, "unidad" => "dientes"],
        ["nombre" => "Tomate triturado", "cantidad" => 200, "unidad" => "g"],
        ["nombre" => "Canela en polvo", "cantidad" => 1, "unidad" => "cucharadita"],
        ["nombre" => "Bechamel", "cantidad" => 300, "unidad" => "ml"],
        ["nombre" => "Queso rallado", "cantidad" => 50, "unidad" => "g"],
        ["nombre" => "Aceite de oliva", "cantidad" => 3, "unidad" => "cucharadas"],
        ["nombre" => "Sal y pimienta", "cantidad" => "al gusto", "unidad" => ""]
    ],
    "pasos" => [
        "1.Preparar las berenjenas  
        Corta las berenjenas en rodajas y fríelas ligeramente o ásalas.",

        "2.Cocinar la carne  
        Sofríe la cebolla y el ajo, añade la carne picada y cocina hasta que se dore.  
        Agrega el tomate y la canela. Cocina a fuego lento 15 minutos.",

        "3.Montar el plato  
        En una fuente para horno, coloca una capa de berenjenas, luego la carne, repite y termina con la bechamel.",

        "4.Hornear  
        Espolvorea con queso y hornea a 180°C durante 30–35 minutos.  
        Deja reposar antes de servir."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["lácteos", "gluten"],
    "pais" => "Grecia",
    "otrasCategorias" => ["horno", "principal"],
    "tiempo" => "1 h",
    "dificultad" => "alta",
    "likes" => 9,
    "href" => "http://localhost/api/img/recetas/moussaka.jpg",
    "fecha_creacion" => "2023-10-14T16:00:00.000Z"
],
[
    "nombre" => "Tabbouleh",
    "ingredientes" => [
        ["nombre" => "Bulgur fino", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Perejil fresco", "cantidad" => 1, "unidad" => "manojo"],
        ["nombre" => "Hierbabuena fresca", "cantidad" => 1, "unidad" => "puñado"],
        ["nombre" => "Tomates", "cantidad" => 2, "unidad" => "unidades"],
        ["nombre" => "Cebolleta", "cantidad" => 2, "unidad" => "unidades"],
        ["nombre" => "Zumo de limón", "cantidad" => 3, "unidad" => "cucharadas"],
        ["nombre" => "Aceite de oliva", "cantidad" => 3, "unidad" => "cucharadas"],
        ["nombre" => "Sal", "cantidad" => "al gusto", "unidad" => ""]
    ],
    "pasos" => [
        "1.Hidratar el bulgur  
        Coloca el bulgur en un bol con agua caliente durante 20 minutos. Escurre y deja enfriar.",

        "2.Picar los ingredientes  
        Pica finamente el perejil, hierbabuena, tomates y cebolleta.",

        "3.Mezclar todo  
        En un bol grande, mezcla el bulgur con los vegetales.  
        Añade el zumo de limón, aceite y sal al gusto. Mezcla bien.",

        "4.Servir frío  
        Sirve como entrante o acompañamiento frío."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["gluten"],
    "pais" => "Líbano",
    "otrasCategorias" => ["vegano", "ensalada", "fresco"],
    "tiempo" => "30 min",
    "dificultad" => "fácil",
    "likes" => 8,
    "href" => "http://localhost/api/img/recetas/tabbouleh.jpg",
    "fecha_creacion" => "2023-10-15T12:15:00.000Z"
],
[
    "nombre" => "Menemen",
    "ingredientes" => [
        ["nombre" => "Huevos", "cantidad" => 3, "unidad" => "unidades"],
        ["nombre" => "Tomates maduros", "cantidad" => 3, "unidad" => "unidades"],
        ["nombre" => "Pimiento verde", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Cebolla (opcional)", "cantidad" => 0.5, "unidad" => "unidad"],
        ["nombre" => "Aceite de oliva", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Sal y pimienta", "cantidad" => "al gusto", "unidad" => ""]
    ],
    "pasos" => [
        "1.Picar y sofreír  
        Pica los tomates, el pimiento y la cebolla si la usas. Sofríe todo en aceite caliente.",

        "2.Añadir los huevos  
        Bate ligeramente los huevos y añádelos a la sartén. Remueve lentamente.",

        "3.Cocinar al gusto  
        Cocina hasta que los huevos estén en el punto deseado (jugosos o más firmes).",

        "4.Servir  
        Sirve caliente, acompañado de pan fresco."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["huevo"],
    "pais" => "Turquía",
    "otrasCategorias" => ["desayuno", "rápido", "vegetariano"],
    "tiempo" => "20 min",
    "dificultad" => "fácil",
    "likes" => 7,
    "href" => "http://localhost/api/img/recetas/menemen.jpg",
    "fecha_creacion" => "2023-10-16T09:45:00.000Z"
],
[
"nombre" => "Risotto ai Funghi",
"ingredientes" => [
    ["nombre" => "Arroz arborio", "cantidad" => 200, "unidad" => "g"],
    ["nombre" => "Champiñones", "cantidad" => 150, "unidad" => "g"],
    ["nombre" => "Caldo de verduras", "cantidad" => 800, "unidad" => "ml"],
    ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"],
    ["nombre" => "Parmesano", "cantidad" => 30, "unidad" => "g"]
],
"pasos" => [
    "1. Sofreír la cebolla picada hasta que esté transparente.",
    "2. Añadir los champiñones troceados y cocinar 5 minutos.",
    "3. Incorporar el arroz y remover durante 2 minutos.",
    "4. Ir añadiendo el caldo caliente poco a poco mientras se remueve.",
    "5. Cocinar durante unos 18-20 minutos. Añadir el parmesano y servir."
],
"idUsuario" => "usuario456",
"compartido" => true,
"alergias" => ["gluten", "lactosa"],
"pais" => "Italia",
"otrasCategorias" => ["vegetariana"],
"tiempo" => "30 min",
"dificultad" => "media",
"likes" => 8,
"href" => "http://localhost/api/img/recetas/risotoFunghi.jpg",
"fecha_creacion" => "2023-10-02T12:00:00.000Z"
],
[
"nombre" => "Sopa Azteca",
"ingredientes" => [
    ["nombre" => "Tortillas de maíz", "cantidad" => 4, "unidad" => "unidad"],
    ["nombre" => "Tomate", "cantidad" => 3, "unidad" => "unidad"],
    ["nombre" => "Ajo", "cantidad" => 2, "unidad" => "diente"],
    ["nombre" => "Caldo de pollo", "cantidad" => 500, "unidad" => "ml"],
    ["nombre" => "Chile pasilla", "cantidad" => 1, "unidad" => "unidad"]
],
"pasos" => [
    "1. Freír las tortillas en tiras hasta que estén crujientes.",
    "2. Licuar los tomates con ajo y chile pasilla.",
    "3. Cocinar esta salsa en una olla con un poco de aceite.",
    "4. Añadir el caldo y cocinar 15 minutos.",
    "5. Servir con las tiras de tortilla, aguacate y queso fresco."
],
"idUsuario" => "usuario456",
"compartido" => true,
"alergias" => [],
"pais" => "Mexico",
"otrasCategorias" => ["sin gluten"],
"tiempo" => "25 min",
"dificultad" => "media",
"likes" => 6,
"href" => "http://localhost/api/img/recetas/sopaAzteca.jpg",
"fecha_creacion" => "2023-10-03T14:00:00.000Z"
],

[
"nombre" => "Yakitori",
"ingredientes" => [
    ["nombre" => "Pollo (muslo)", "cantidad" => 300, "unidad" => "g"],
    ["nombre" => "Salsa de soja", "cantidad" => 50, "unidad" => "ml"],
    ["nombre" => "Mirin", "cantidad" => 30, "unidad" => "ml"],
    ["nombre" => "Azúcar", "cantidad" => 1, "unidad" => "cucharada"],
    ["nombre" => "Brochetas de bambú", "cantidad" => 6, "unidad" => "unidad"]
],
"pasos" => [
    "1. Cortar el pollo en cubos y ensartar en las brochetas.",
    "2. Mezclar la salsa de soja, mirin y azúcar en una sartén.",
    "3. Cocinar las brochetas en una sartén o parrilla.",
    "4. Pintar con la salsa varias veces durante la cocción.",
    "5. Servir caliente como aperitivo o plato principal."
],
"idUsuario" => "usuario456",
"compartido" => true,
"alergias" => ["soja"],
"pais" => "Japon",
"otrasCategorias" => ["sin gluten si se usa soja especial"],
"tiempo" => "20 min",
"dificultad" => "facil",
"likes" => 7,
"href" => "http://localhost/api/img/recetas/yakitori.jpg",
"fecha_creacion" => "2023-10-04T16:00:00.000Z"
],
[
"nombre" => "Palak Paneer",
"ingredientes" => [
    ["nombre" => "Espinacas", "cantidad" => 300, "unidad" => "g"],
    ["nombre" => "Paneer", "cantidad" => 150, "unidad" => "g"],
    ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"],
    ["nombre" => "Tomate", "cantidad" => 1, "unidad" => "unidad"],
    ["nombre" => "Ajo", "cantidad" => 2, "unidad" => "diente"]
],
"pasos" => [
    "1. Hervir las espinacas y licuarlas hasta obtener un puré.",
    "2. Sofreír cebolla, ajo y tomate picado hasta formar una pasta.",
    "3. Añadir el puré de espinacas y cocinar 5 minutos.",
    "4. Incorporar el paneer en cubos y cocinar 5 minutos más.",
    "5. Servir con arroz o pan naan caliente."
],
"idUsuario" => "usuario456",
"compartido" => true,
"alergias" => ["lactosa"],
"pais" => "India",
"otrasCategorias" => ["vegetariana", "sin gluten"],
"tiempo" => "30 min",
"dificultad" => "media",
"likes" => 9,
"href" => "http://localhost/api/img/recetas/palakPaneer.jpg",
"fecha_creacion" => "2023-10-06T10:00:00.000Z"
],

[
"nombre" => "Ratatouille",
"ingredientes" => [
    ["nombre" => "Berenjena", "cantidad" => 1, "unidad" => "unidad"],
    ["nombre" => "Calabacín", "cantidad" => 1, "unidad" => "unidad"],
    ["nombre" => "Pimiento rojo", "cantidad" => 1, "unidad" => "unidad"],
    ["nombre" => "Tomate", "cantidad" => 2, "unidad" => "unidad"],
    ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"]
],
"pasos" => [
    "1. Cortar todas las verduras en rodajas finas.",
    "2. Sofreír cebolla y tomate en una sartén hasta que se ablanden.",
    "3. En una fuente para horno, colocar las verduras alternando colores.",
    "4. Hornear a 180°C durante 40 minutos con un poco de aceite y hierbas.",
    "5. Servir caliente como plato principal o acompañamiento."
],
"idUsuario" => "usuario456",
"compartido" => true,
"alergias" => [],
"pais" => "Francia",
"otrasCategorias" => ["vegana", "sin gluten"],
"tiempo" => "1 h",
"dificultad" => "media",
"likes" => 6,
"href" => "http://localhost/api/img/recetas/ratatouille.jpg",
"fecha_creacion" => "2023-10-07T11:00:00.000Z"
],

[
"nombre" => "Spätzle",
"ingredientes" => [
    ["nombre" => "Harina", "cantidad" => 250, "unidad" => "g"],
    ["nombre" => "Huevos", "cantidad" => 3, "unidad" => "unidad"],
    ["nombre" => "Leche", "cantidad" => 100, "unidad" => "ml"],
    ["nombre" => "Sal", "cantidad" => 1, "unidad" => "cucharadita"]
],
"pasos" => [
    "1. Mezclar harina, huevos, leche y sal hasta obtener una masa densa.",
    "2. Colocar la masa en un rallador especial o tabla de Spätzle sobre agua hirviendo.",
    "3. Cocer hasta que floten, unos 2-3 minutos.",
    "4. Escurrir y saltear con mantequilla o acompañar con salsa.",
    "5. Servir como guarnición o plato principal con queso fundido."
],
"idUsuario" => "usuario456",
"compartido" => true,
"alergias" => ["gluten", "huevo", "lactosa"],
"pais" => "Alemania",
"otrasCategorias" => [],
"tiempo" => "30 min",
"dificultad" => "media",
"likes" => 4,
"href" => "http://localhost/api/img/recetas/spatzel.jpg",
"fecha_creacion" => "2023-10-07T13:00:00.000Z"
],

[
"nombre" => "Clam Chowder",
"ingredientes" => [
    ["nombre" => "Almejas", "cantidad" => 300, "unidad" => "g"],
    ["nombre" => "Papas", "cantidad" => 2, "unidad" => "unidad"],
    ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"],
    ["nombre" => "Leche", "cantidad" => 200, "unidad" => "ml"],
    ["nombre" => "Bacon", "cantidad" => 100, "unidad" => "g"]
],
"pasos" => [
    "1. Sofreír el bacon y la cebolla hasta que estén dorados.",
    "2. Añadir las papas en cubos y las almejas.",
    "3. Incorporar la leche y cocer a fuego medio.",
    "4. Cocinar hasta que las papas estén tiernas.",
    "5. Servir caliente con perejil picado."
],
"idUsuario" => "usuario456",
"compartido" => true,
"alergias" => ["marisco", "lactosa"],
"pais" => "Estados Unidos",
"otrasCategorias" => ["sopa"],
"tiempo" => "45 min",
"dificultad" => "media",
"likes" => 5,
"href" => "http://localhost/api/img/recetas/clamChowder.jpg",
"fecha_creacion" => "2023-10-08T10:30:00.000Z"
],

[
    "nombre" => "Moqueca de Peixe",
    "ingredientes" => [
        ["nombre" => "Filetes de pescado blanco", "cantidad" => 400, "unidad" => "g"],
        ["nombre" => "Pimiento rojo", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Tomates", "cantidad" => 2, "unidad" => "unidades"],
        ["nombre" => "Leche de coco", "cantidad" => 200, "unidad" => "ml"],
        ["nombre" => "Aceite de palma (dendê)", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Cilantro fresco", "cantidad" => "al gusto", "unidad" => ""],
        ["nombre" => "Zumo de lima", "cantidad" => 2, "unidad" => "cucharadas"]
    ],
    "pasos" => [
        "1. Marinar el pescado con lima, sal y cilantro.",
        "2. En una olla, saltear cebolla, pimiento y tomate en aceite de palma.",
        "3. Añadir el pescado y leche de coco; cocinar a fuego bajo 15–20 min.",
        "4. Corregir sal y decorar con más cilantro.",
        "5. Servir con arroz blanco."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["pescado", "coco"],
    "pais" => "Brasil",
    "otrasCategorias" => ["guiso", "sin gluten", "tradicional"],
    "tiempo" => "50 min",
    "dificultad" => "media",
    "likes" => 14,
    "href" => "http://localhost/api/img/recetas/moquecaPeixe.jpg",
    "fecha_creacion" => "2025-06-08T12:05:00.000Z"
],

[
    "nombre" => "Pisto Manchego",
    "ingredientes" => [
        ["nombre" => "Calabacín", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Berenjena", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Pimiento rojo", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Pimiento verde", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Tomate triturado", "cantidad" => 400, "unidad" => "g"],
        ["nombre" => "Aceite de oliva", "cantidad" => 50, "unidad" => "ml"],
        ["nombre" => "Sal", "cantidad" => "al gusto", "unidad" => ""]
    ],
    "pasos" => [
        "1. Lavar y trocear todas las verduras en cubos pequeños.",
        "2. En una sartén grande, añadir el aceite y sofreír la cebolla y los pimientos hasta que estén blandos.",
        "3. Añadir la berenjena y el calabacín, y cocinar durante 10 minutos más.",
        "4. Incorporar el tomate triturado y una pizca de sal. Cocinar a fuego medio durante 20–25 minutos removiendo ocasionalmente.",
        "5. Servir caliente como plato principal o acompañamiento. Puede añadirse un huevo frito por encima si se desea."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => [],
    "pais" => "España",
    "otrasCategorias" => ["vegetariana", "vegana", "tradicional", "sin gluten"],
    "tiempo" => "45 min",
    "dificultad" => "media",
    "likes" => 16,
    "href" => "http://localhost/api/img/recetas/pistoManchego.jpg",
    "fecha_creacion" => "2025-06-08T12:30:00.000Z"
],

[
"nombre" => "Dumplings al vapor",
"ingredientes" => [
    ["nombre" => "Harina", "cantidad" => 200, "unidad" => "g"],
    ["nombre" => "Carne picada", "cantidad" => 150, "unidad" => "g"],
    ["nombre" => "Col china", "cantidad" => 100, "unidad" => "g"],
    ["nombre" => "Jengibre", "cantidad" => 1, "unidad" => "cucharadita"],
    ["nombre" => "Salsa de soja", "cantidad" => 2, "unidad" => "cucharadas"]
],
"pasos" => [
    "1. Amasar la harina con agua hasta formar una masa suave.",
    "2. Mezclar la carne con col picada, jengibre y soja.",
    "3. Formar discos con la masa y rellenarlos.",
    "4. Cocinar los dumplings al vapor durante 15 minutos.",
    "5. Servir con salsa de soja o vinagre."
],
"idUsuario" => "usuario456",
"compartido" => true,
"alergias" => ["gluten", "soja"],
"pais" => "China",
"otrasCategorias" => [],
"tiempo" => "1 h",
"dificultad" => "alta",
"likes" => 8,
"href" => "http://localhost/api/img/recetas/dumplingVapor.jpg",
"fecha_creacion" => "2023-10-09T12:00:00.000Z"
],

[
    "nombre" => "Tom Yum",
    "ingredientes" => [
        ["nombre" => "Gambas", "cantidad" => 200, "unidad" => "g"],
        ["nombre" => "Caldo de pollo o marisco", "cantidad" => 500, "unidad" => "ml"],
        ["nombre" => "Hierba limón", "cantidad" => 2, "unidad" => "tallos"],
        ["nombre" => "Galanga (o jengibre)", "cantidad" => 3, "unidad" => "rodajas"],
        ["nombre" => "Hojas de lima kaffir", "cantidad" => 3, "unidad" => "hojas"],
        ["nombre" => "Setas", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Chile", "cantidad" => 2, "unidad" => "unidades"],
        ["nombre" => "Salsa de pescado", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Zumo de lima", "cantidad" => 2, "unidad" => "cucharadas"]
    ],
    "pasos" => [
        "1. Hervir el caldo con hierba limón, galanga y hojas de lima durante 5 minutos.",
        "2. Añadir las setas y cocinar 3 minutos más.",
        "3. Incorporar las gambas y el chile; cocinar 2–3 minutos hasta que cambien de color.",
        "4. Apagar el fuego, añadir salsa de pescado y zumo de lima.",
        "5. Servir caliente, con algo de picante."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["marisco"],
    "pais" => "Tailandia",
    "otrasCategorias" => ["sopa", "picante"],
    "tiempo" => "30 min",
    "dificultad" => "media",
    "likes" => 13,
    "href" => "http://localhost/api/img/recetas/tomYum.jpg",
    "fecha_creacion" => "2023-10-10T15:00:00.000Z"
],

[
    "nombre" => "Tteokbokki",
    "ingredientes" => [
        ["nombre" => "Tteok (pasteles de arroz)", "cantidad" => 200, "unidad" => "g"],
        ["nombre" => "Gochujang", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Azúcar", "cantidad" => 1, "unidad" => "cucharada"],
        ["nombre" => "Salsa de soja", "cantidad" => 1, "unidad" => "cucharada"],
        ["nombre" => "Cebolla verde", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Caldo (vegetal o dashi)", "cantidad" => 300, "unidad" => "ml"]
    ],
    "pasos" => [
        "1. Hervir el caldo con gochujang, azúcar y soja.",
        "2. Añadir los tteok y cocinar 5–7 minutos hasta que estén tiernos.",
        "3. Incorporar la cebolla verde en rodajas.",
        "4. Cocinar un par de minutos más.",
        "5. Servir caliente y algo picante."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["gluten", "picante"],
    "pais" => "Corea del Sur",
    "otrasCategorias" => ["callejera", "picante"],
    "tiempo" => "25 min",
    "dificultad" => "media",
    "likes" => 11,
    "href" => "http://localhost/api/img/recetas/tteokbokki.jpg",
    "fecha_creacion" => "2023-10-11T13:00:00.000Z"
],

[
    "nombre" => "Souvlaki",
    "ingredientes" => [
        ["nombre" => "Carne de cerdo o pollo", "cantidad" => 300, "unidad" => "g"],
        ["nombre" => "Aceite de oliva", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Orégano seco", "cantidad" => 1, "unidad" => "cucharadita"],
        ["nombre" => "Limón", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Ajo", "cantidad" => 2, "unidad" => "dientes"],
        ["nombre" => "Brochetas de madera", "cantidad" => 4, "unidad" => "unidades"]
    ],
    "pasos" => [
        "1. Cortar la carne en dados y marinar con aceite, orégano, limón y ajo 30 minutos.",
        "2. Ensartar la carne en brochetas.",
        "3. Cocinar en parrilla o sartén durante 8–10 minutos, girando para dorar por todos lados.",
        "4. Servir con pan pita, quizá tzatziki o verduras."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => [],
    "pais" => "Grecia",
    "otrasCategorias" => ["callejera", "principal"],
    "tiempo" => "40 min",
    "dificultad" => "media",
    "likes" => 10,
    "href" => "http://localhost/api/img/recetas/souvlaki.jpg",
    "fecha_creacion" => "2023-10-12T17:00:00.000Z"
],

[
    "nombre" => "Hummus",
    "ingredientes" => [
        ["nombre" => "Garbanzos cocidos", "cantidad" => 400, "unidad" => "g"],
        ["nombre" => "Tahini", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Ajo", "cantidad" => 1, "unidad" => "diente"],
        ["nombre" => "Zumo de limón", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Aceite de oliva", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Sal", "cantidad" => "al gusto", "unidad" => ""]
    ],
    "pasos" => [
        "1. Triturar los garbanzos con tahini, ajo y limón.",
        "2. Añadir aceite y sal y mezclar hasta textura cremosa.",
        "3. Ajustar limón o sal al gusto.",
        "4. Servir con aceite y pimentón encima, acompañado de pan."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["sésamo"],
    "pais" => "Líbano",
    "otrasCategorias" => ["vegano", "aperitivo"],
    "tiempo" => "15 min",
    "dificultad" => "fácil",
    "likes" => 13,
    "href" => "http://localhost/api/img/recetas/humus.jpg",
    "fecha_creacion" => "2023-10-13T12:00:00.000Z"
],

[
    "nombre" => "Baklava",
    "ingredientes" => [
        ["nombre" => "Masa filo", "cantidad" => 200, "unidad" => "g"],
        ["nombre" => "Nueces picadas", "cantidad" => 150, "unidad" => "g"],
        ["nombre" => "Mantequilla derretida", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Miel o jarabe", "cantidad" => 100, "unidad" => "ml"],
        ["nombre" => "Azúcar", "cantidad" => 50, "unidad" => "g"]
    ],
    "pasos" => [
        "1. Colocar hojas de filo pinceladas con mantequilla en una fuente.",
        "2. Añadir capa de nueces y repetir filo y mantequilla.",
        "3. Cortar en porciones y hornear a 180 °C 25–30 minutos hasta dorar.",
        "4. Calentar miel con azúcar y verter sobre el baklava caliente.",
        "5. Dejar enfriar y servir como dulce."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["frutos secos", "gluten", "lácteos"],
    "pais" => "Turquía",
    "otrasCategorias" => ["postre"],
    "tiempo" => "1 h",
    "dificultad" => "media",
    "likes" => 12,
    "href" => "http://localhost/api/img/recetas/baklava.jpg",
    "fecha_creacion" => "2023-10-14T11:00:00.000Z"
],

[
    "nombre" => "Pulpo a la gallega",
    "ingredientes" => [
        ["nombre" => "Pulpo cocido", "cantidad" => 500, "unidad" => "g"],
        ["nombre" => "Patatas", "cantidad" => 3, "unidad" => "unidad"],
        ["nombre" => "Pimentón dulce", "cantidad" => 1, "unidad" => "cucharadita"],
        ["nombre" => "Aceite de oliva virgen extra", "cantidad" => 50, "unidad" => "ml"],
        ["nombre" => "Sal gruesa", "cantidad" => "al gusto", "unidad" => ""]
    ],
    "pasos" => [
        "1. Cocer las patatas con piel en agua con sal. Pelar y cortar en rodajas.",
        "2. Cortar el pulpo cocido en rodajas de 1 cm.",
        "3. Colocar una base de patata en un plato y encima el pulpo.",
        "4. Espolvorear con pimentón dulce y sal gruesa.",
        "5. Rociar con aceite de oliva antes de servir."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["marisco"],
    "pais" => "España",
    "otrasCategorias" => ["tapa", "tradicional"],
    "tiempo" => "25 min",
    "dificultad" => "fácil",
    "likes" => 30,
    "href" => "http://localhost/api/img/recetas/pulpoGallega.jpg",
    "fecha_creacion" => "2025-06-08T13:05:00.000Z"
],

[
    "nombre" => "Fabada asturiana",
    "ingredientes" => [
        ["nombre" => "Fabes (alubias blancas)", "cantidad" => 400, "unidad" => "g"],
        ["nombre" => "Chorizo", "cantidad" => 2, "unidad" => "unidad"],
        ["nombre" => "Morcilla", "cantidad" => 2, "unidad" => "unidad"],
        ["nombre" => "Panceta", "cantidad" => 150, "unidad" => "g"],
        ["nombre" => "Ajo", "cantidad" => 2, "unidad" => "dientes"],
        ["nombre" => "Pimentón", "cantidad" => 1, "unidad" => "cucharadita"],
        ["nombre" => "Agua", "cantidad" => 1.5, "unidad" => "litros"],
        ["nombre" => "Sal", "cantidad" => "al gusto", "unidad" => ""]
    ],
    "pasos" => [
        "1. Dejar las fabes en remojo la noche anterior.",
        "2. Escurrir y colocar en una olla con agua limpia. Añadir chorizo, morcilla, panceta y ajos enteros.",
        "3. Cocinar a fuego lento durante 2 horas. Espumar si es necesario.",
        "4. Añadir sal y pimentón. Cocinar 30 minutos más.",
        "5. Dejar reposar antes de servir para intensificar el sabor."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => [],
    "pais" => "España",
    "otrasCategorias" => ["tradicional", "invierno"],
    "tiempo" => "3 h",
    "dificultad" => "alta",
    "likes" => 18,
    "href" => "http://localhost/api/img/recetas/fabada.jpg",
    "fecha_creacion" => "2025-06-08T13:10:00.000Z"
],

[
    "nombre" => "Callos a la madrileña",
    "ingredientes" => [
        ["nombre" => "Callos de ternera", "cantidad" => 500, "unidad" => "g"],
        ["nombre" => "Chorizo", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Morcilla", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Pimiento choricero", "cantidad" => 2, "unidad" => "unidad"],
        ["nombre" => "Ajo", "cantidad" => 2, "unidad" => "dientes"],
        ["nombre" => "Cebolla", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Pimentón", "cantidad" => 1, "unidad" => "cucharadita"]
    ],
    "pasos" => [
        "1. Cocer los callos previamente limpios en agua con sal. Escurrir.",
        "2. Sofreír ajo, cebolla y pimiento choricero picado.",
        "3. Añadir los callos, chorizo y morcilla en rodajas. Añadir pimentón.",
        "4. Cubrir con agua o caldo y cocinar a fuego lento 2 horas.",
        "5. Dejar reposar para intensificar el sabor. Servir caliente."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => [],
    "pais" => "España",
    "otrasCategorias" => ["tradicional", "invierno"],
    "tiempo" => "2 h 30 min",
    "dificultad" => "alta",
    "likes" => 21,
    "href" => "http://localhost/api/img/recetas/callosMadrilena.jpg",
    "fecha_creacion" => "2025-06-08T13:35:00.000Z"
],

[
    "nombre" => "Croquetas de jamón",
    "ingredientes" => [
        ["nombre" => "Leche entera", "cantidad" => 500, "unidad" => "ml"],
        ["nombre" => "Harina", "cantidad" => 50, "unidad" => "g"],
        ["nombre" => "Mantequilla", "cantidad" => 50, "unidad" => "g"],
        ["nombre" => "Jamón serrano", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Huevo", "cantidad" => 2, "unidad" => "unidad"],
        ["nombre" => "Pan rallado", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Aceite para freír", "cantidad" => 250, "unidad" => "ml"]
    ],
    "pasos" => [
        "1. Derretir mantequilla en un cazo y añadir la harina, cocinando unos minutos.",
        "2. Añadir la leche poco a poco sin dejar de remover para formar una bechamel.",
        "3. Agregar el jamón picado y cocinar hasta que espese bien.",
        "4. Dejar enfriar la masa en la nevera varias horas.",
        "5. Formar las croquetas, pasarlas por huevo y pan rallado, y freír en aceite caliente."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["gluten", "huevo", "lácteos"],
    "pais" => "España",
    "otrasCategorias" => ["tapa", "casera"],
    "tiempo" => "1 h 30 min",
    "dificultad" => "media",
    "likes" => 35,
    "href" => "http://localhost/api/img/recetas/croquetasJamon.jpg",
    "fecha_creacion" => "2025-06-08T13:45:00.000Z"
],

[
    "nombre" => "Migas extremeñas",
    "ingredientes" => [
        ["nombre" => "Pan duro", "cantidad" => 300, "unidad" => "g"],
        ["nombre" => "Chorizo", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Panceta", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Ajo", "cantidad" => 5, "unidad" => "dientes"],
        ["nombre" => "Aceite de oliva", "cantidad" => 3, "unidad" => "cucharadas"],
        ["nombre" => "Pimentón", "cantidad" => 1, "unidad" => "cucharadita"],
        ["nombre" => "Agua", "cantidad" => 100, "unidad" => "ml"]
    ],
    "pasos" => [
        "1.Preparar el pan  
        Corta el pan duro en trozos pequeños y colócalo en un bol.  
        Humedécelo con el agua y cúbrelo con un paño húmedo. Deja reposar al menos 1 hora.",
        
        "2.Freír los ingredientes  
        En una sartén grande, calienta el aceite.  
        Sofríe los ajos enteros y luego añade el chorizo y la panceta cortados en trozos.  
        Añade el pimentón y remueve bien.",
        
        "3.Cocinar las migas  
        Incorpora el pan y cocina a fuego medio-alto.  
        Remueve constantemente para que se suelten las migas y se doren.  
        Cocina durante 20-25 minutos hasta que estén sueltas y crujientes.",
        
        "4.Servir  
        Sirve caliente, acompañadas si se desea de uvas o huevo frito."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["gluten"],
    "pais" => "España",
    "otrasCategorias" => ["tradicional", "de cuchara"],
    "tiempo" => "40 min",
    "dificultad" => "media",
    "likes" => 3,
    "href" => "http://localhost/api/img/recetas/migas.jpg",
    "fecha_creacion" => "2025-06-08T10:00:00.000Z"
],

[
    "nombre" => "Alcachofas con jamón",
    "ingredientes" => [
        ["nombre" => "Alcachofas", "cantidad" => 8, "unidad" => "unidades"],
        ["nombre" => "Jamón serrano", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Ajo", "cantidad" => 2, "unidad" => "dientes"],
        ["nombre" => "Aceite de oliva", "cantidad" => 2, "unidad" => "cucharadas"],
        ["nombre" => "Limón", "cantidad" => 1, "unidad" => "unidad"],
        ["nombre" => "Sal", "cantidad" => 1, "unidad" => "pizca"]
    ],
    "pasos" => [
        "1.Preparar las alcachofas  
        Limpia las alcachofas retirando las hojas duras y corta las puntas.  
        Frota con limón para que no se oxiden.  
        Corta en cuartos y cuécelas en agua con sal durante 15 minutos.",
        
        "2.Sofreír  
        En una sartén, calienta el aceite y sofríe los ajos picados.  
        Añade el jamón cortado en taquitos y cocina un par de minutos.",
        
        "3.Mezclar  
        Escurre las alcachofas y añádelas a la sartén.  
        Saltea todo junto durante 5 minutos para que se mezclen los sabores.",
        
        "4.Servir  
        Sirve caliente como entrante o acompañamiento."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => [],
    "pais" => "España",
    "otrasCategorias" => ["ligera", "sin gluten"],
    "tiempo" => "30 min",
    "dificultad" => "fácil",
    "likes" => 4,
    "href" => "http://localhost/api/img/recetas/alcachofasJamon.jpg",
    "fecha_creacion" => "2025-06-08T10:05:00.000Z"
],

[
    "nombre" => "Cachopo asturiano",
    "ingredientes" => [
        ["nombre" => "Filetes de ternera", "cantidad" => 2, "unidad" => "unidades grandes"],
        ["nombre" => "Jamón serrano", "cantidad" => 2, "unidad" => "lonchas"],
        ["nombre" => "Queso (tipo Cabrales o fundente)", "cantidad" => 2, "unidad" => "lonchas"],
        ["nombre" => "Huevo", "cantidad" => 2, "unidad" => "unidades"],
        ["nombre" => "Pan rallado", "cantidad" => 100, "unidad" => "g"],
        ["nombre" => "Harina", "cantidad" => 50, "unidad" => "g"],
        ["nombre" => "Aceite de oliva", "cantidad" => 250, "unidad" => "ml"],
        ["nombre" => "Sal", "cantidad" => 1, "unidad" => "pizca"]
    ],
    "pasos" => [
        "1.Montar el cachopo  
        Extiende un filete de ternera.  
        Coloca encima una loncha de jamón y otra de queso.  
        Tapa con el otro filete y presiona bien los bordes.",
        
        "2.Empanar  
        Pasa el cachopo por harina, luego por huevo batido y finalmente por pan rallado.  
        Asegúrate de que queda bien cubierto.",
        
        "3.Freír  
        Calienta el aceite en una sartén amplia.  
        Fríe el cachopo por ambos lados hasta que esté dorado y crujiente.  
        Retira y escurre sobre papel absorbente.",
        
        "4.Servir  
        Sirve caliente, acompañado de patatas fritas o ensalada."
    ],
    "idUsuario" => "usuario456",
    "compartido" => true,
    "alergias" => ["gluten", "lactosa", "huevo"],
    "pais" => "España",
    "otrasCategorias" => ["contundente", "tradicional"],
    "tiempo" => "35 min",
    "dificultad" => "media",
    "likes" => 6,
    "href" => "http://localhost/api/img/recetas/cachopo.jpg",
    "fecha_creacion" => "2025-06-08T10:10:00.000Z"
],
// Conexión a la base de datos MongoDB

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