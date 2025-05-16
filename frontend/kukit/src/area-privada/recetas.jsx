import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logo from '../img/logo_kukit.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Login from '../login/login';
import Registro from '../login/registro/registro';
import Footer from '../footer/footer';


const Recetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [n_recetas, setN_recetas] = useState(0);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const offcanvasRef = useRef(null);
  const [showListaCompra, setListaCompra] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);


  useEffect(() => {
    const obtenerRecetas = async () => {
      try {
        const respuesta = await axios.get('http://localhost/api/area_privada/recetas/getRecetas.php');
        setN_recetas(respuesta.data.n_recetas);
        setRecetas(respuesta.data.recetas);
        setCargando(false);
      } catch (err) {
        setError('Error al cargar las recetas', err);
        setCargando(false);
      }
    };
    obtenerRecetas();
  }, []);

  const abrirReceta = (receta) => {
    console.log('Abriendo receta:', receta.nombre);
    setRecetaSeleccionada(receta);
    const offcanvasElement = offcanvasRef.current;
    if (offcanvasElement) {
      const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
      bsOffcanvas.show();
      console.log('Offcanvas mostrado.');
    } else {
      console.error('Elemento offcanvas no encontrado.');
    }
  };

  const cerrarOffcanvas = () => {
    console.log('Cerrando offcanvas.');
    setRecetaSeleccionada(null);
    const offcanvasElement = offcanvasRef.current;
    if (offcanvasElement) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    }
  };

  // Agrega un log para ver cuándo cambia recetaSeleccionada
  useEffect(() => {
    console.log('recetaSeleccionada cambió a:', recetaSeleccionada);
  }, [recetaSeleccionada]);

  if (cargando) return <p>Cargando recetas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <header>
        <a href="/" id="logo-header">
          <img src={logo} alt="" id="logo-header" />
        </a>
        <button id="hamburger-menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav>
          <ul>
            <li>Recetas</li>
            <li onClick={() => setListaCompra(true)}>Lista de la Compra</li>
            <li><a href="/plan-alimentacion">Plan de alimentación</a></li>
          </ul>
        </nav>
        <div className="contenedor-header">
          <button className="sign-in" onClick={() => setShowLogin(true)}>Iniciar sesión</button>
          <button className="sign-up" onClick={() => setShowRegistro(true)} id="sign-up">Regístrate</button>
        </div>
      </header>

      <div id="pop-up-sign-in" style={{ display: showLogin ? 'flex' : 'none' }} onClick={() => setShowLogin(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <Login setShowLogin={setShowLogin} />
        </div>
      </div>
      <div id="pop-up-sign-up" style={{ display: showRegistro ? 'flex' : 'none' }} onClick={() => setShowRegistro(false)}>
        <div className="modal-content-2" onClick={e => e.stopPropagation()}>
          <Registro setShowRegistro={setShowRegistro} />
        </div>
      </div>
      {showListaCompra && (
        <ListaCompra showListaCompra={showListaCompra} setListaCompra={setListaCompra} />
      )}

      <div className="container">
        <div className="titulo-pagina">
          <h2>Recetas</h2>
          <div className="linea-vertical"></div>
          <h2 className="numero-recetas">{`${n_recetas} recetas`}</h2>
        </div>

        <div className="tarjetas">
          {recetas.map((receta) => (
            <div
              key={receta._id}
              className="tarjeta btn"
              role="button"
              onClick={() => abrirReceta(receta)}
            >
              <img
                src="img/comida.jpg"
                className="imagen-receta-tarjeta"
                alt={`Receta ${receta._id}`}
              />
              <h3>{receta.nombre}</h3>
              <p className="likesNumero">{receta.likes || 0}</p>
              <img src="./img/megusta.png" alt="like" className="like" />
              <p className="duracion">{receta.duracion || 'N/A'} min</p>
              <img src="img/bookmark.png" className="icono-bookmark" alt="Guardar" />
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
        ref={offcanvasRef}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            {recetaSeleccionada ? recetaSeleccionada.nombre : 'Información de la receta'}
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={cerrarOffcanvas}
          ></button>
        </div>
        <div className="offcanvas-body">
          {recetaSeleccionada ? (
            <>
              <h3>Ingredientes</h3>
              <ul>
                {recetaSeleccionada.ingredientes?.map((ing, index) => (
                  <li key={index}>
                    {ing.cantidad && `${ing.cantidad} `}
                    {ing.unidad && `${ing.unidad} `}
                    {ing.nombre}
                  </li>
                ))}
              </ul>
              <h3>Instrucciones</h3>
              <ol>
                {recetaSeleccionada.pasos?.map((paso, index) => (
                  <li key={index}>{paso}</li>
                ))}
              </ol>
            </>
          ) : (
            <p>Selecciona una receta para ver los detalles.</p>
          )}
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
          </div>
          <div className="botones-lista-compra">
            <button>Vaciar Lista</button>
            <button className="botones-inversos">Ir a recetas</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Recetas;