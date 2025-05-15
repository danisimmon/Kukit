import React from "react";

const recetas = () => {
  return (
    <>
      <div className="container">
        <div className="titulo-pagina">
          <h2>Recetas</h2>
          <div className="linea-vertical"></div>
          <h2 className="numero-recetas">4 recetas</h2>
        </div>

        <div className="tarjetas">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className="tarjeta btn"
              data-bs-toggle="offcanvas"
              href="#receta-offcanvasExample"
              role="button"
              aria-controls="offcanvasExample"
            >
              <img
                src="img/comida.jpg"
                className="imagen-receta-tarjeta"
                alt={`Receta ${num}`}
              />
              <h3>{`Receta ${num}`}</h3>
              <p className="likesNumero">160</p>
              <img
                src="./img/megusta.png"
                alt="like"
                className="like"
              />
              <p className="duracion">
                {num === 1 ? "20min" : num === 2 ? "40min" : num === 3 ? "1h" : "2h 30min"}
              </p>
              {num === 1 && <p className=""></p>}
              <img
                src="img/bookmark.png"
                className="icono-bookmark"
                alt="Guardar"
              />
              {/* 
              <a className="btn" data-bs-toggle="offcanvas" href="#receta-offcanvasExample" role="button"
                 aria-controls="offcanvasExample">Ver receta</a>
              */}
            </div>
          ))}
        </div>
      </div>

      {/* Offcanvas de receta */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="receta-offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            Información de la receta
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div>
            <div>
              <h3>Ingredientes</h3>
              <ul>
                <li>1 kg de carne de res</li>
                <li>2 cebollas</li>
                <li>1 pimiento rojo</li>
                <li>2 dientes de ajo</li>
                <li>1 cucharadita de comino</li>
                <li>Sal y pimienta al gusto</li>
                <li>12 tortillas de maíz</li>
              </ul>
              <h3>Instrucciones</h3>
              <ol>
                <li>
                  En una sartén grande, calienta un poco de aceite y sofríe la
                  cebolla y el ajo picados.
                </li>
                <li>Agrega la carne y cocina hasta que esté dorada.</li>
                <li>
                  Incorpora el pimiento rojo y el comino, y cocina por unos
                  minutos más.
                </li>
                <li>Calienta las tortillas en otra sartén.</li>
                <li>Sirve la carne en las tortillas y disfruta.</li>
              </ol>
            </div>
          </div>
          <div className="dropdown mt-3">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              Ver instrucciones
            </button>
          </div>
        </div>
      </div>

      {/* Offcanvas de lista de compra */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="lista-offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h2 className="offcanvas-title" id="offcanvasExampleLabel">
            Lista de la Compra
          </h2>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div>
            <div>
              <h3>Ingredientes</h3>
              <ul>
                <li>1 kg de carne de res</li>
                {/* <hr className="linea-separacion-compra" /> */}
                <li>2 cebollas</li>
                <li>1 pimiento rojo</li>
                <li>2 dientes de ajo</li>
                <li>1 cucharadita de comino</li>
                <li>Sal y pimienta al gusto</li>
                <li>12 tortillas de maíz</li>
              </ul>
            </div>
          </div>
          <div className="botones-lista-compra">
            <button>Vaciar Lista</button>
            <button className="botones-inversos">Ir a recetas</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default recetas;
