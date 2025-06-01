import React from "react";
import Header from "../header/header.jsx";

const features = [
  {
    title: "🍳 Recetas Personalizadas",
    description: "Encuentra recetas que encajan con tus gustos y necesidades fácilmente.",
    emoji: "🍳",
  },
  {
    title: "🛒 Lista de la Compra",
    description: "Crea y gestiona tu lista de la compra automáticamente para no olvidar nada.",
    emoji: "🛒",
  },
  {
    title: "🔗 Comparte Recetas",
    description: "Comparte tus recetas favoritas con amigos y familiares fácilmente.",
    emoji: "🔗",
  },
  {
    title: "♿ Accesibilidad Integrada",
    description: "Incluimos un lector de recetas para que todos puedan seguirlas sin problemas.",
    emoji: "♿",
  },
];

function Partners() {
  return (
    <>
      <Header />
      <div className="container py-5">
        <h1 className="mb-4 text-center">¿Qué puedes hacer con Kukit?</h1>
        <p className="text-center mb-5">
          Kukit simplifica tu día a día con herramientas para que cocinar sano sea sencillo, rápido y divertido.
        </p>
        <div className="row text-center">
          {features.map(({ title, description, emoji }, idx) => (
            <div className="col-md-3 mb-4" key={idx}>
              <div
                className="partner-logo mb-3"
                style={{
                  fontSize: "5rem",
                  lineHeight: 1,
                }}
              >
                {emoji}
              </div>
              <h5 className="mt-3">{title.replace(/^. /, "")}</h5>
              <p className="small">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Partners;
