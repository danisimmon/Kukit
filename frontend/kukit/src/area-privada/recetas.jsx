import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import Header from '../header/header';
import { useNavigate } from 'react-router-dom';

const Recetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [n_recetas, setN_recetas] = useState(0);
  const [showListaCompra, setListaCompra] = useState(false);
  const [likes, setLikes] = useState({});
  const [liked, setLiked] = useState({});
  const [favoritos, setFavoritos] = useState({});
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const recetasPorPagina = 8;
  // Estados para los nuevos filtros
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [selectedDificultad, setSelectedDificultad] = useState('');
  const [selectedPais, setSelectedPais] = useState('');
  const [filterTiempo, setFilterTiempo] = useState('');
  const [filterGluten, setFilterGluten] = useState(''); // '' para cualquiera, 'true' para sí, 'false' para no
  const [filterVegetariana, setFilterVegetariana] = useState('');
  const [filterLactosa, setFilterLactosa] = useState('');
  const [filterVegana, setFilterVegana] = useState('');

  const PAISES_FILTRO = [
    "Italia", "México", "Japón", "España", "India", "Francia", "Alemania",
    "Estados Unidos", "China", "Brasil", "Tailandia", "Grecia", "Turquía",
    "Corea del Sur", "Libano" // Ajustado para coincidir con el value de editar-perfil.jsx
  ];

  const DIFICULTADES = [
    { value: "facil", label: "Fácil" },
    { value: "intermedio", label: "Intermedio" },
    { value: "dificil", label: "Difícil" }
  ];

  const OPCIONES_BOOLEANAS = [
    { value: "true", label: "Sí" },
    { value: "false", label: "No" }
  ];

  const manejarLike = async (idReceta) => {
  try {
    const respuesta = await axios.post('http://localhost/api/area_privada/recetas/guardarMeGustas.php', {
      id_receta: idReceta
    });

    if (respuesta.data.success) {
      const nuevoEstado = respuesta.data.liked;

      setLiked(prev => ({
        ...prev,
        [idReceta]: nuevoEstado,
      }));

      setLikes(prev => ({
        ...prev,
        [idReceta]: nuevoEstado
          ? (prev[idReceta] || 0) + 1
          : Math.max((prev[idReceta] || 1) - 1, 0),
      }));
    } else {
      console.error("No se pudo cambiar el estado de me gusta");
    }
  } catch (error) {
    console.error("Error al manejar el like:", error);
  }
};


  // useEffect(() => {
  //   const obtenerRecetas = async () => {
  //     try {
  //       const respuesta = await axios.get('http://localhost/api/area_privada/recetas/getRecetas.php');
  //       setN_recetas(respuesta.data.n_recetas);
  //       setRecetas(respuesta.data.recetas);
  //       // Inicializa los likes y favoritos
  //       const likesIniciales = {};
  //       const favoritosIniciales = {};
  //       respuesta.data.recetas.forEach(r => {
  //         likesIniciales[r._id] = r.likes || 0;
  //         favoritosIniciales[r._id] = r.favorito || false;
  //       });
  //       setLikes(likesIniciales);
  //       setFavoritos(favoritosIniciales);
  //       setCargando(false);
  //       setPaginaActual(1);
  //     } catch (err) {
  //       setError('Error al cargar las recetas', err);
  //       setCargando(false);
  //     }
  //   };
  //   obtenerRecetas();
  // }, []);

  useEffect(() => {
    const obtenerRecetas = async () => {
      try {
        const respuesta = await axios.get('http://localhost/api/area_privada/recetas/getRecetas.php');
        const recetasRaw = respuesta.data.recetas;

        const recetasNormalizadas = recetasRaw.map(r => ({
          ...r,
          gluten: r.gluten === true || r.gluten === "true",
          vegetariana: r.vegetariana === true || r.vegetariana === "true",
          lactosa: r.lactosa === true || r.lactosa === "true",
          vegana: r.vegana === true || r.vegana === "true",
          dificultad: (r.dificultad || '').toLowerCase().trim(),
          pais: r.pais || '',
          tiempo: r.tiempo || '',
          // Asume que la API devuelve un campo como 'usuarioDioLike' (true/false)
          // para cada receta, indicando si el usuario actual ya le dio "me gusta".
          usuarioDioLike: r.usuarioDioLike || false // Normaliza este campo si existe
        }));

        setRecetas(recetasNormalizadas);

        // Likes y favoritos
        const likesIniciales = {};
        const favoritosIniciales = {};
        const likedStatusInicial = {}; // Para el estado de "me gusta" del usuario
        recetasNormalizadas.forEach(r => {
          likesIniciales[r._id] = r.likes || 0;
          favoritosIniciales[r._id] = r.favorito || false;
          // Usa el campo de la API para el estado inicial de "me gusta"
          likedStatusInicial[r._id] = r.usuarioDioLike;
        });
        setLikes(likesIniciales);
        setFavoritos(favoritosIniciales);
        setLiked(likedStatusInicial); // Inicializar el estado 'liked'
        setN_recetas(respuesta.data.n_recetas);
        setCargando(false);
        setPaginaActual(1);
      } catch (err) {
        setError('Error al cargar las recetas');
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
        // alert(esFavoritoActual ? 'Receta eliminada de favoritos' : 'Receta guardada en favoritos');
        setFavoritos(prevFavoritos => ({
          ...prevFavoritos,
          [idReceta]: !esFavoritoActual,
        }));
      } else {
        // alert(esFavoritoActual ? 'Error al eliminar de favoritos' : 'Error al guardar favorito');
        console.error('Error al guardar/eliminar favorito:', respuesta.data.message);
      }
    } catch (error) {
      console.error('Error al guardar/eliminar favorito:', error);
      alert('Hubo un problema al guardar/eliminar en favoritos');
    }
  };

  const abrirReceta = (receta) => {
    navigate(`/area-privada/verreceta/${receta._id}`);
  };

  const cambiarPagina = (numero) => {
    if (numero >= 1 && numero <= totalPaginas) {
      setPaginaActual(numero);
    }
  };

  // Handlers para los cambios en los filtros
  const handleFilterChange = (setter) => (event) => {
    setter(event.target.value);
    setPaginaActual(1); // Resetear a la primera página al cambiar un filtro
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDificultad('');
    setSelectedPais('');
    setFilterTiempo('');
    setFilterGluten('');
    setFilterVegetariana('');
    setFilterLactosa('');
    setFilterVegana('');
    setPaginaActual(1);
  };

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPaginaActual(1); // Resetear a la primera página al buscar
  };

  const recetasFiltradas = recetas.filter(receta => {
    const matchesSearchTerm = receta.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    // const matchesDificultad = selectedDificultad ? receta.dificultad === selectedDificultad : true;
    const matchesDificultad = selectedDificultad
      ? (receta.dificultad || '').trim().toLowerCase() === selectedDificultad
      : true;
    const matchesPais = selectedPais ? receta.pais === selectedPais : true;
    const matchesTiempo = filterTiempo ? (receta.tiempo || '').toLowerCase().includes(filterTiempo.toLowerCase()) : true;

    const checkBooleanFilter = (filterValue, recetaValue) => {
      if (filterValue === '') return true; // 'Cualquiera' no filtra
      return (filterValue === 'true' ? recetaValue === true : recetaValue === false);
    };

    const matchesGluten = checkBooleanFilter(filterGluten, receta.gluten);
    const matchesVegetariana = checkBooleanFilter(filterVegetariana, receta.vegetariana);
    const matchesLactosa = checkBooleanFilter(filterLactosa, receta.lactosa);
    const matchesVegana = checkBooleanFilter(filterVegana, receta.vegana);

    //     console.log({
    //   matchesSearchTerm,
    //   matchesDificultad,
    //   matchesPais,
    //   matchesTiempo,
    //   matchesGluten,
    //   matchesVegetariana,
    //   matchesLactosa,
    //   matchesVegana
    // });

    return matchesSearchTerm && matchesDificultad && matchesPais && matchesTiempo && matchesGluten && matchesVegetariana && matchesLactosa && matchesVegana;
  });

  // Lógica de paginación aplicada a las recetas filtradas
  const indexUltima = paginaActual * recetasPorPagina;
  const indexPrimera = indexUltima - recetasPorPagina;
  const recetasActuales = recetasFiltradas.slice(indexPrimera, indexUltima); // Obtiene las recetas para la página actual

  // Calcular el total de páginas basado en las recetas filtradas
  const totalPaginas = Math.ceil(recetasFiltradas.length / recetasPorPagina);



  if (cargando) return (
    <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border text-primary" role="status" ><span className="visually-hidden">Loading...</span></div>
    </div>);
  if (error) return <p>{error}</p>;

  return (
    <>
      <Header />
      {showListaCompra && (
        <ListaCompra showListaCompra={showListaCompra} setListaCompra={setListaCompra} />
      )}
      <main>


        <div className="container">
        {/* Contenedor para alinear el botón de volver y el título */}
          <div className="d-flex align-items-center mb-4"> {/* Contenedor Flex para alinear elementos en la misma línea y centrados verticalmente */}
            {/* Botón para volver atrás */}
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-secondary me-3" /* Estilo de botón más integrado y margen a la derecha */
              title="Volver a la página anterior" /* Tooltip para accesibilidad y claridad */
            >
              &lt; Volver
            </button>
            <div className="titulo-pagina d-flex align-items-center flex-grow-1"> {/* El título ocupa el espacio restante y alinea sus items */}
              <h2>Recetas</h2>
              <div className="linea-vertical mx-2"></div> {/* Margen horizontal para el separador */}
              <h2 className="numero-recetas">{`${n_recetas} recetas`}</h2>
            </div>

          </div>

          {/* Barra de búsqueda */}
          <div className="search-container mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar recetas por nombre..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="search-icon">🔍</span>
          </div>

          <button className="btn-mostrar-filtros" onClick={() => setMostrarFiltros(prev => !prev)}>
            {mostrarFiltros ? "Ocultar Filtros" : "Mostrar Filtros"}
          </button>

          {/* Sección de Filtros Adicionales */}
          {mostrarFiltros && (
            <div className="filtros-adicionales mb-4 p-3 border rounded">
              <h5 className="mb-3">Filtros Adicionales</h5>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label htmlFor="filtroDificultad" className="form-label">Dificultad</label>
                  <select id="filtroDificultad" className="form-select" value={selectedDificultad} onChange={handleFilterChange(setSelectedDificultad)}>
                    <option value="">Cualquiera</option>
                    {DIFICULTADES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="filtroPais" className="form-label">País</label>
                  <select id="filtroPais" className="form-select" value={selectedPais} onChange={handleFilterChange(setSelectedPais)}>
                    <option value="">Cualquiera</option>
                    {PAISES_FILTRO.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="filtroTiempo" className="form-label">Tiempo (ej: "30 min")</label>
                  <input
                    type="text"
                    id="filtroTiempo"
                    className="form-control"
                    value={filterTiempo}
                    onChange={handleFilterChange(setFilterTiempo)}
                    placeholder="Ej: 30 min"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label htmlFor="filtroGluten" className="form-label">Sin Gluten</label>
                  <select id="filtroGluten" className="form-select" value={filterGluten} onChange={handleFilterChange(setFilterGluten)}>
                    <option value="">Cualquiera</option>
                    {OPCIONES_BOOLEANAS.map(op => <option key={`gluten-${op.value}`} value={op.value}>{op.label}</option>)}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="filtroLactosa" className="form-label">Sin Lactosa</label>
                  <select id="filtroLactosa" className="form-select" value={filterLactosa} onChange={handleFilterChange(setFilterLactosa)}>
                    <option value="">Cualquiera</option>
                    {OPCIONES_BOOLEANAS.map(op => <option key={`lactosa-${op.value}`} value={op.value}>{op.label}</option>)}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="filtroVegetariana" className="form-label">Vegetariana</label>
                  <select id="filtroVegetariana" className="form-select" value={filterVegetariana} onChange={handleFilterChange(setFilterVegetariana)}>
                    <option value="">Cualquiera</option>
                    {OPCIONES_BOOLEANAS.map(op => <option key={`vegetariana-${op.value}`} value={op.value}>{op.label}</option>)}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="filtroVegana" className="form-label">Vegana</label>
                  <select id="filtroVegana" className="form-select" value={filterVegana} onChange={handleFilterChange(setFilterVegana)}>
                    <option value="">Cualquiera</option>
                    {OPCIONES_BOOLEANAS.map(op => <option key={`vegana-${op.value}`} value={op.value}>{op.label}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn btn-secondary mt-2 limpiar-filtros" onClick={resetFilters}>Limpiar Filtros</button>
            </div>
          )}

          {/* Mensaje cuando no hay resultados con los filtros aplicados */}
          {recetasFiltradas.length === 0 && !cargando && (
            <div className="alert alert-info" role="alert">
              No se encontraron recetas con los filtros aplicados. Prueba con otros criterios o limpia los filtros.
            </div>
          )}

          <div className="tarjetas">
            {recetasActuales.map((receta) => (
              <div
                key={receta._id}
                className="tarjeta btn"
                role="button"
                onClick={() => abrirReceta(receta)}
              >
                <img
                  src={receta.href}
                  className="imagen-receta-tarjeta"
                  alt={`Receta ${receta.nombre}`}
                />
                <h3>{receta.nombre}</h3>
                <div className="like-container" onClick={(e) => { e.stopPropagation(); manejarLike(receta._id); }}>
                  <div className="like-inner">
                    <div className='like-info'>
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
                      alt={favoritos[receta._id] ? "En favoritos" : "No en favoritos"}
                      className="icono-bookmark"
                      onClick={(e) => {
                        e.stopPropagation();
                        guardarFavorito(receta._id);
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación principal */}
          {/* <div className="paginacion d-flex justify-content-center mt-4"> */}
          {totalPaginas > 1 && ( // Mostrar paginación solo si hay más de una página
            <nav>
              <ul className="pagination">
                <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => cambiarPagina(paginaActual - 1)}>
                    &lt;
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
                    &gt;
                  </button>
                </li>
              </ul>
            </nav>)}
        </div>
      </main>
    </>
  );
};

export default Recetas;