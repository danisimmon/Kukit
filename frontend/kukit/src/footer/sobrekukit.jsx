import React from "react";
import Header from "../header/header.jsx";

const SobreKukit = () => {
    return (
        <>
        <Header />
        <div className="sobre-kukit-container" style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
            <h1 style={{ marginBottom: "1rem" }}>🥗 Sobre Kukit</h1>
            <p>
                <strong>Kukit</strong> es una iniciativa que combina alimentación saludable, organización semanal y tecnología.
                Nuestro objetivo es ayudarte a planificar tus comidas de manera sencilla, generando automáticamente tus listas
                de la compra y ofreciéndote recetas adaptadas a tus necesidades.
            </p>

            <p>
                Pensado para personas ocupadas, estudiantes o cualquier usuario que quiera comer mejor sin complicarse la vida,
                Kukit es tu asistente de cocina digital que te acompaña en todo momento: desde la planificación hasta el
                supermercado.
            </p>

            <h2 style={{ marginTop: "2rem" }}>🎯 ¿Qué ofrece Kukit?</h2>
            <ul>
                <li>📝 Recetas personalizadas y fáciles de preparar.</li>
                <li>🛒 Listas de la compra automáticas con ingredientes agrupados.</li>
                <li>📆 Un planificador de comidas para organizar tu semana en minutos.</li>
            </ul>

            <h2 style={{ marginTop: "2rem" }}>👩‍💻 Quiénes somos</h2>
            <p>
                Kukit ha sido desarrollado por un equipo de estudiantes con pasión por el diseño, la programación y la
                alimentación saludable:
            </p>
            <ul>
                <li>Ainhoa Blanca</li>
                <li>Manuel Gómez</li>
                <li>Rubén Peña</li>
                <li>Daniel Simón</li>
            </ul>

            <h2 style={{ marginTop: "2rem" }}>💡 ¿Por qué Kukit?</h2>
            <p>
                Porque creemos que comer bien no tiene que ser caro ni complicado. Kukit simplifica tu día a día con una
                plataforma útil, clara y atractiva.
            </p>
        </div>
        </>
    );
};

export default SobreKukit;
