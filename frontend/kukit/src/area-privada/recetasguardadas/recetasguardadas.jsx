import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import CorazonRelleno from '../../img/corazonRelleno.png';
import CorazonSinRelleno from '../../img/corazonSinRelleno.png';
import NoFavorito from '../../img/bookmark.png';
import Favorito from '../../img/bookmark-relleno.png';
import Footer from '../../footer/footer';
import Header from '../../header/header';

const RecetasGuardadas = () => {
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [n_recetas, setN_recetas] = useState(0);
  const [likes, setLikes] = useState({});
  const [liked, setLiked] = useState({});
  const [favoritos, setFavoritos] = useState({});
  const [paginaActual, setPaginaActual] = useState(1);
  const recetasPorPagina = 8;
  const navigate = useNavigate();

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

  const obtenerRecetasGuardadas = async () => {
    try {
      const respuesta = await axios.get('http://localhost/api/area_privada/recetas/getRecetasGuardadas.php');
      setN_recetas(respuesta.data.n_recetas);
      setRecetas(respuesta.data.recetas);
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

  useEffect(() => {
    obtenerRecetasGuardadas();
  }, []);

  const guardarFavorito = async (idReceta) => {
    try {
      const esFavoritoActual = favoritos[idReceta] || false;
      const respuesta = await axios.post('http://localhost/api/area_privada/recetas/favoritas/guardarFavorito.php', {
        id_receta: idReceta,
        accion: esFavoritoActual ? 'eliminar' : 'guardar'
      });

      if (respuesta.data.success) {
        setFavoritos(prevFavoritos => ({
          ...prevFavoritos,
          [idReceta]: !esFavoritoActual,
        }));
        // Vuelve a cargar las recetas guardadas para actualizar la lista
        obtenerRecetasGuardadas();
      } else {
        console.error('Error al guardar/eliminar favorito:', respuesta.data.message);
        alert(esFavoritoActual ? 'Error al eliminar de favoritos' : 'Error al guardar favorito');
      }
    } catch (error) {
      console.error('Error al guardar/eliminar favorito:', error);
      alert('Hubo un problema al guardar/eliminar en favoritos');
    }
  };

  const verDetalleReceta = (idReceta) => {
    navigate(`/area-privada/verreceta/${idReceta}`);
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
      <main>
        <div className="container">
          <div className="titulo-pagina">
            <h2>Recetas Guardadas</h2>
            <div className="linea-vertical"></div>
            <h2 className="numero-recetas">{`${n_recetas} recetas`}</h2>
          </div>
          {recetasActuales.length > 0 ? (
            <div className="tarjetas">
              {recetasActuales.map((receta) => (
                <div
                  key={receta._id}
                  className="tarjeta btn"
                  role="button"
                  onClick={() => verDetalleReceta(receta._id)}
                >
                  <img
                    src={receta.href || "/img/comida_default.jpg"}
                    className="imagen-receta-tarjeta"
                    alt={`Receta ${receta.nombre}`}
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
                  <img
                    src={favoritos[receta._id] ? Favorito : NoFavorito}
                    className="icono-bookmark"
                    alt={favoritos[receta._id] ? "En favoritos" : "No en favoritos"}
                    onClick={(e) => {
                      e.stopPropagation();
                      guardarFavorito(receta._id);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center mt-4">No tienes recetas guardadas todavía.</p>
          )}
          <div className="paginacion d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => cambiarPagina(paginaActual - 1)}>
                    Anterior
                  </button>
                </li>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
                  <li
                    key={numero}
                    className={`page-item ${paginaActual === numero ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => cambiarPagina(numero)}>
                      {numero}
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
      </main>
      <Footer />
    </>
  );
};

export default RecetasGuardadas;