import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logo from '../../img/logo_kukit.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import CorazonRelleno from '../../img/corazonRelleno.png'
import CorazonSinRelleno from '../../img/corazonSinRelleno.png'
// Importaciones de iconos de favoritos actualizadas para coincidir con el estilo de recetas.jsx
import NoFavorito from '../../img/bookmark.png'; // Icono para no favorito (era Favoritos)
import Favorito from '../../img/bookmark-relleno.png'; // Icono para favorito (asegúrate que este archivo exista)
// import Login from '../../login/login'; // Eliminado si no se usa directamente aquí
// import Registro from '../../login/registro/registro'; // Eliminado si no se usa directamente aquí
import Footer from '../../footer/footer';
// import ListaCompra from '../../listaCompra/listaCompra'; // Eliminado si no se usa directamente aquí
import Header from '../../header/header';

const RecetasGuardadas = () => {
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [n_recetas, setN_recetas] = useState(0);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const offcanvasRef = useRef(null);
  // const [showListaCompra, setListaCompra] = useState(false); // Estado eliminado
  // const [showLogin, setShowLogin] = useState(false); // Estado eliminado
  // const [showRegistro, setShowRegistro] = useState(false); // Estado eliminado
  const [likes, setLikes] = useState({});
  const [liked, setLiked] = useState({});
  const [favoritos, setFavoritos] = useState({}); // Estado para almacenar el estado de favorito de cada receta

  const [paginaActual, setPaginaActual] = useState(1);
  const recetasPorPagina = 8;

  const manejarLike = (idReceta) => {
    const yaLeGusta = liked[idReceta];

    setLiked((prev) => ({
      ...prev,
      [idReceta]: !yaLeGusta,
    }));

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
        const respuesta = await axios.get('http://localhost/api/area_privada/recetas/getRecetasGuardadas.php');
        setN_recetas(respuesta.data.n_recetas);
        setRecetas(respuesta.data.recetas);
        console.log(respuesta);
        const likesIniciales = {};
        const favoritosIniciales = {};
        respuesta.data.recetas.forEach(r => {
          likesIniciales[r._id] = r.likes || 0;
          favoritosIniciales[r._id] = r.favorito || false;
        });
        setLikes(likesIniciales);
        setFavoritos(favoritosIniciales);
        setCargando(false);
      } catch (err) {
        console.error('Error al cargar las recetas:', err);
        setError(`Error al cargar las recetas. ${err.message ? err.message : 'Inténtelo de nuevo más tarde.'}`);
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
        accion: esFavoritoActual ? 'eliminar' : 'guardar'
      });

      if (respuesta.data.success) {
        alert(esFavoritoActual ? 'Receta eliminada de favoritos' : 'Receta guardada en favoritos');
        setFavoritos(prevFavoritos => ({
          ...prevFavoritos,
          [idReceta]: !esFavoritoActual,
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
      // Asegúrate de que Bootstrap esté disponible globalmente o importa `Offcanvas` directamente
      const bsOffcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
      bsOffcanvas.show();
    }
  };

  const cerrarOffcanvas = () => {
    setRecetaSeleccionada(null);
    const offcanvasElement = offcanvasRef.current;
    if (offcanvasElement) {
      const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasElement);
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
      <Header />
      {/* Renderizado de ListaCompra eliminado para simplificar y alinear con recetas.jsx */}
      {/* {showListaCompra && (
        <ListaCompra showListaCompra={showListaCompra} setListaCompra={setListaCompra} />
      )} */}
      <main>


        <div className="container">
          <div className="titulo-pagina">
            <h2>Recetas Guardadas</h2>
            <div className="linea-vertical"></div>
            <h2 className="numero-recetas">{`${n_recetas} recetas`}</h2>
          </div>

          {recetas.length === 0 && !cargando ? (
            <div className="alert alert-info mt-4" role="alert">
              Aún no tienes recetas guardadas. ¡Explora y guarda tus favoritas!
            </div>
          ) : (
            <div className="tarjetas">
              {recetasActuales.map((receta) => (
                <div
                  key={receta._id}
                  className="tarjeta btn"
                  role="button"
                  onClick={() => abrirReceta(receta)}
                >
                  <img
                    src={receta.href || "/img/comida_default.jpg"}
                    className="imagen-receta-tarjeta"
                    alt={`Receta ${receta.nombre}`} // Alt text consistente con recetas.jsx
                    onError={(e) => { e.target.onerror = null; e.target.src = "/img/comida_default.jpg"; }}
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
                  {/* Duración eliminada de la tarjeta */}
                  {/* <p className="duracion">{receta.duracion || 'N/A'} min</p> */}
                  <img
                    src={favoritos[receta._id] ? Favorito : NoFavorito} // Icono dinámico
                    className="icono-bookmark"
                    alt={favoritos[receta._id] ? "En favoritos" : "No en favoritos"} // Alt text dinámico
                    onClick={(e) => {
                      e.stopPropagation();
                      guardarFavorito(receta._id);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  {/* Texto explícito de favorito eliminado */}
                  {/* {favoritos[receta._id] ? (
                <p>En favoritos</p>
              ) : (
                <p>No en favoritos</p>
              )} */}
                </div>
              ))}
            </div>
          )}
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
      </main>
      <Footer />
    </>
  );
};

export default RecetasGuardadas;
