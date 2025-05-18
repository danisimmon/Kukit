import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logo from '../img/logo_kukit.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import CorazonRelleno from '../img/corazonRelleno.png'
import CorazonSinRelleno from '../img/corazonSinRelleno.png'
import NoFavorito from '../img/bookmark.png'
import Favorito from '../img/bookmark-relleno.png'
import Login from '../login/login';
import Registro from '../login/registro/registro';
import Footer from '../footer/footer';
import ListaCompra from '../listaCompra/listaCompra';

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
  const [likes, setLikes] = useState({});
  const [liked, setLiked] = useState({});
  const [favoritos, setFavoritos] = useState({}); // Estado para almacenar el estado de favorito de cada receta

  const [paginaActual, setPaginaActual] = useState(1);
  const recetasPorPagina = 8;

  const manejarLike = (idReceta) => {
    const yaLeGusta = liked[idReceta];

    // Alternar el estado del like
    setLiked((prev) => ({
      ...prev,
      [idReceta]: !yaLeGusta,
    }));

    // Sumar o restar 1 al contador de likes
    setLikes((prev) => ({
      ...prev,
      [idReceta]: yaLeGusta
        ? Math.max((prev[idReceta] || 0) - 1, 0)
        : (prev[idReceta] || 0) + 1,
    }));
  };



  useEffect(() => {
    const obtenerRecetas = async () => {
      try {
        const respuesta = await axios.get('http://localhost/api/area_privada/recetas/getRecetas.php');
        setN_recetas(respuesta.data.n_recetas);
        setRecetas(respuesta.data.recetas);
        console.log(respuesta);
        // Inicializa los likes y favoritos
        const likesIniciales = {};
        const favoritosIniciales = {};
        respuesta.data.recetas.forEach(r => {
          likesIniciales[r._id] = r.likes || 0;
          favoritosIniciales[r._id] = r.favorito || false; // Usa el campo favorito del backend
        });
        setLikes(likesIniciales);
        setFavoritos(favoritosIniciales);
        setCargando(false);
      } catch (err) {
        setError('Error al cargar las recetas', err);
        setCargando(false);
      }
    };
    obtenerRecetas();
  }, []);

  const guardarFavorito = async (idReceta) => {
    try {
      const esFavoritoActual = favoritos[idReceta] || false;
      const respuesta = await axios.post('http://localhost/api/area_privada/recetas/favoritas/guardarFavorito.php', {
        id_receta: idReceta,
        accion: esFavoritoActual ? 'eliminar' : 'guardar' // Enviar la acción al backend
      });

      if (respuesta.data.success) {
        alert(esFavoritoActual ? 'Receta eliminada de favoritos' : 'Receta guardada en favoritos');
        // Actualiza el estado de favoritos
        setFavoritos(prevFavoritos => ({
          ...prevFavoritos,
          [idReceta]: !esFavoritoActual, // Invierte el estado de favorito
        }));
      } else {
        alert(esFavoritoActual ? 'Error al eliminar de favoritos' : 'Error al guardar favorito');
        console.error('Error al guardar/eliminar favorito:', respuesta.data.message);
      }
    } catch (error) {
      console.error('Error al guardar/eliminar favorito:', error);
      alert('Hubo un problema al guardar/eliminar en favoritos');
    }
  };


  const abrirReceta = (receta) => {
    setRecetaSeleccionada(receta);
    const offcanvasElement = offcanvasRef.current;
    if (offcanvasElement) {
      const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
      bsOffcanvas.show();
    }
  };

  const cerrarOffcanvas = () => {
    setRecetaSeleccionada(null);
    const offcanvasElement = offcanvasRef.current;
    if (offcanvasElement) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    }
  };

  const indexUltima = paginaActual * recetasPorPagina;
  const indexPrimera = indexUltima - recetasPorPagina;
  const recetasActuales = recetas.slice(indexPrimera, indexUltima);
  const totalPaginas = Math.ceil(recetas.length / recetasPorPagina);

  const cambiarPagina = (numero) => {
    if (numero >= 1 && numero <= totalPaginas) {
      setPaginaActual(numero);
    }
  };

  if (cargando) return <div className="spinner-border text-primary" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <header>
        <a href="/home" id="logo-header">
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
            <li><a href="/recetas/recetasguardadas">Recetas Guardadas</a></li>
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
          {recetasActuales.map((receta) => (
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
              <div className="like-container" onClick={(e) => { e.stopPropagation(); manejarLike(receta._id); }}>
                <img
                  src={liked[receta._id] ? CorazonRelleno : CorazonSinRelleno}
                  alt="like"
                  className="like"
                  style={{ cursor: 'pointer' }}
                />
                <p className="likesNumero">{likes[receta._id] || 0}</p>
              </div>
              {/* <p className="duracion">{receta.duracion || 'N/A'} min</p> */}
              <img
                src={favoritos[receta._id] ? Favorito : NoFavorito}
                alt={favoritos[receta._id] ? "En favoritos" : "No en favoritos"}
                className="icono-bookmark"
                onClick={(e) => {
                  e.stopPropagation();
                  guardarFavorito(receta._id);
                }}
                style={{ cursor: 'pointer' }}
              />
              {/* {favoritos[receta._id] ? (
                <p>En favoritos</p>
              ) : (
                <p>No en favoritos</p>
              )} */}
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="paginacion d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => cambiarPagina(paginaActual - 1)}>
                  Anterior
                </button>
              </li>
              {[...Array(totalPaginas)].map((_, index) => (
                <li key={index} className={`page-item ${paginaActual === index + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => cambiarPagina(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => cambiarPagina(paginaActual + 1)}>
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
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

      <Footer />
    </>
  );
};

export default Recetas;

