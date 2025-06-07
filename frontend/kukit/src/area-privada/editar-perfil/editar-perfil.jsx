import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Footer from '../../footer/footer';
import Header from '../../header/header';
import { useNavigate } from 'react-router-dom';
import CorazonRelleno from '../../img/corazonRelleno.png'
import CorazonSinRelleno from '../../img/corazonSinRelleno.png'
import NoFavorito from '../../img/bookmark.png'
import Favorito from '../../img/bookmark-relleno.png'

const EditarPerfil = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mostrarPopup, setMostrarPopup] = useState(false);

  // Estados para los nuevos inputs de ingredientes y pasos
  const [newIngredienteNombre, setNewIngredienteNombre] = useState('');
  const [newIngredienteCantidad, setNewIngredienteCantidad] = useState('');
  const [newIngredienteUnidad, setNewIngredienteUnidad] = useState('');
  const [errorNuevoIngrediente, setErrorNuevoIngrediente] = useState('');
  const [likes, setLikes] = useState({});
  const [liked, setLiked] = useState({});
  const [Favoritos, setFavoritos] = useState({});
  const [N_recetas, setN_recetas] = useState(0);
  const [Cargando, setCargando] = useState(true);
  const [newPaso, setNewPaso] = useState('');
  const [errorNuevoPaso, setErrorNuevoPaso] = useState('');
  const [PaginaActual, setPaginaActual] = useState(1);

  // Estados para errores de validación del perfil
  const [errorUsuario, setErrorUsuario] = useState('');
  // const [errorCorreo, setErrorCorreo] = useState(''); // Ya no se necesita si el correo no es editable

  // Estados para errores de validación de la receta
  const [errorNombreReceta, setErrorNombreReceta] = useState('');
  const [errorDificultad, setErrorDificultad] = useState('');
  const [errorImagenReceta, setErrorImagenReceta] = useState('');
  const [errorTiempo, setErrorTiempo] = useState('');
  const [errorPais, setErrorPais] = useState('');
  const [errorIngredientesLista, setErrorIngredientesLista] = useState('');
  const [errorPasosLista, setErrorPasosLista] = useState('');

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const handleEliminarCuenta = async () => {
    try {
      const respuesta = await axios.post('http://localhost/api/login/borrar-cuenta.php', {}, {
        withCredentials: true
      });
      if (respuesta.data.success) {
        // Redirige al login o página principal tras eliminar
        navigate("/home");
      } else {
        alert(respuesta.data.message || "No se pudo eliminar la cuenta.");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error al eliminar la cuenta.");
    }
    setMostrarModalEliminar(false);
  };

  // Usar para cerrar y redirigir
  const handleCerrarPopup = () => {
    setMostrarPopup(false);
    //navigate("/ruta-destino"); // o usar window.location.href = "/..."
  };

  const [formData, setFormData] = useState({
    usuario: '',
    correo: '',
    password: ''
  });

  const [formRecetaNueva, setRecetaNueva] = useState({
    nombre: '',
    dificultad: '',
    tiempo: '',
    // Se eliminan ingredientes y pasos de aquí porque ahora se gestionan con sus propios estados
    pais: '',
    gluten: false,
    vegetariana: false,
    lactosa: false,
    vegana: false,
  });

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

  const manejarCambioPais = (e) => {
    setRecetaNueva({
      ...formRecetaNueva,
      pais: e.target.value
    });
    setErrorPais(''); // Limpiar error al cambiar
  };

  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  // Handler para la subida de la imagen
  const manejarCambioImagen = (e) => {
    const file = e.target.files[0];
    setErrorImagenReceta(''); // Limpiar error previo de imagen

    if (file) {
      // Validar tamaño del archivo (40MB = 40 * 1024 * 1024 bytes)
      const maxSize = 40 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrorImagenReceta('La imagen no puede superar los 40MB.');
        setImagen(null);
        setImagenPreview(null);
        e.target.value = null; // Limpiar el input file
        return;
      }
      setImagen(file); // Guardar el archivo si es válido
      setImagenPreview(URL.createObjectURL(file)); // Mostrar vista previa
    } else {
      setImagen(null);
      setImagenPreview(null);
    }
  };

  // Handler genérico para opciones booleanas de la receta (gluten, vegetariana, lactosa, vegana)
  const manejarCambioOpcionBooleanaReceta = (e) => {
    const { name, value } = e.target; // name será "gluten", "vegetariana", etc.
    setRecetaNueva(prevState => ({
      ...prevState,
      // Convertir el valor "sí" a true
      [name]: value === 'sí'
    }));
  };

  // Se modifican los estados iniciales para ingredientes y pasos a arrays vacíos
  const [ingredientes, setIngredientes] = useState([]);
  const [pasos, setPasos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("perfil");
  const [recetasCreadas, setRecetasCreadas] = useState([]);
  const [loadingRecetas, setLoadingRecetas] = useState(false);
  const [errorRecetas, setErrorRecetas] = useState('');

  // Manejadores para Ingredientes (añadido para la nueva funcionalidad)
  const validateNewIngredientFields = () => {
    if (!newIngredienteNombre.trim()) {
      setErrorNuevoIngrediente('El nombre del ingrediente es obligatorio.');
      return false;
    }
    if (!isNaN(parseFloat(newIngredienteNombre)) && isFinite(newIngredienteNombre)) {
      setErrorNuevoIngrediente('El nombre del ingrediente no puede ser un número.');
      return false;
    }
    if (!newIngredienteCantidad.trim()) {
      setErrorNuevoIngrediente('La cantidad del ingrediente es obligatoria.');
      return false;
    }
    if (isNaN(parseFloat(newIngredienteCantidad)) || !isFinite(newIngredienteCantidad)) {
      setErrorNuevoIngrediente('La cantidad debe ser un número.');
      return false;
    }
    if (Number(newIngredienteCantidad) <= 0) {
      setErrorNuevoIngrediente('La cantidad debe ser un número positivo.');
      return false;
    }
    if (!newIngredienteUnidad.trim()) {
      setErrorNuevoIngrediente('La unidad del ingrediente es obligatoria.');
      return false;
    }
    if (!isNaN(parseFloat(newIngredienteUnidad)) && isFinite(newIngredienteUnidad)) {
      setErrorNuevoIngrediente('La unidad del ingrediente no puede ser un número.');
      return false;
    }
    setErrorNuevoIngrediente('');
    return true;
  };

  const handleAddIngrediente = () => {
    if (validateNewIngredientFields()) {
      setIngredientes([
        ...ingredientes,
        {
          nombre: newIngredienteNombre,
          cantidad: parseFloat(newIngredienteCantidad), // Guardar como número
          unidad: newIngredienteUnidad,
        },
      ]);
      setNewIngredienteNombre('');
      setNewIngredienteCantidad('');
      setNewIngredienteUnidad('');
      setErrorIngredientesLista(''); // Limpiar error de la lista general
    }
  };

  const handleRemoveIngrediente = (index) => {
    const newIngredientes = ingredientes.filter((_, i) => i !== index);
    setIngredientes(newIngredientes);
  };

  // Manejadores para Pasos (añadido para la nueva funcionalidad)
  const handleAddPaso = () => {
    if (newPaso) {
      setPasos([...pasos, newPaso]);
      setNewPaso('');
      setErrorNuevoPaso(''); // Limpiar mensaje de error específico
      setErrorPasosLista(''); // Limpiar error de la lista general
    } else {
      setErrorNuevoPaso('Por favor, escribe el paso para añadirlo.');
    }
  };

  const abrirReceta = (receta) => {
    // Cambiar la navegación para ir a la página de edición en lugar de la vista
    navigate(`/area-privada/editarrecetacreada/${receta._id}`);
  };

  const handleRemovePaso = (index) => {
    const newPasos = pasos.filter((_, i) => i !== index);
    setPasos(newPasos);
  };

  const manejarCambioReceta = (e) => {
    const { name, value } = e.target;
    setRecetaNueva({
      ...formRecetaNueva,
      [name]: value
    });
    // Limpiar errores específicos al escribir
    if (name === 'nombre') setErrorNombreReceta('');
    if (name === 'dificultad') setErrorDificultad('');
    if (name === 'tiempo') setErrorTiempo('');
    // Pais se maneja en manejarCambioPais
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'usuario') {
      setErrorUsuario('');
    }
  };

  const handleProfileBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'usuario' && !value.trim()) {
      setErrorUsuario('El nombre de usuario es obligatorio.');
    }
  };

  const handleRecipeFieldBlur = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'nombre':
        if (!value.trim()) setErrorNombreReceta('El nombre de la receta es obligatorio.');
        break;
      case 'dificultad':
        if (!value) setErrorDificultad('La dificultad es obligatoria.');
        break;
      case 'tiempo':
        if (!value.trim()) {
          setErrorTiempo('El tiempo de preparación es obligatorio.');
        } else if (isNaN(value) || Number(value) <= 0) {
          setErrorTiempo('El tiempo debe ser un número positivo en minutos.');
        }
        break;
      case 'pais': // El select de país se valida por su valor, no por trim()
        if (!value) setErrorPais('El país es obligatorio.');
        break;
      default:
        break;
    }
  };

  const handleNewIngredientFieldBlur = (fieldName) => {
    let error = '';
    switch (fieldName) {
      case 'nombre':
        if (!newIngredienteNombre.trim()) error = 'El nombre del ingrediente es obligatorio.';
        else if (!isNaN(parseFloat(newIngredienteNombre)) && isFinite(newIngredienteNombre)) error = 'El nombre no puede ser un número.';
        break;
      case 'cantidad':
        if (!newIngredienteCantidad.trim()) error = 'La cantidad del ingrediente es obligatoria.';
        else if (isNaN(parseFloat(newIngredienteCantidad)) || !isFinite(newIngredienteCantidad)) error = 'La cantidad debe ser un número.';
        else if (Number(newIngredienteCantidad) <= 0) error = 'La cantidad debe ser un número positivo.';
        break;
      case 'unidad':
        if (!newIngredienteUnidad.trim()) error = 'La unidad del ingrediente es obligatoria.';
        else if (!isNaN(parseFloat(newIngredienteUnidad)) && isFinite(newIngredienteUnidad)) error = 'La unidad no puede ser un número.';
        break;
      default:
        break;
    }
    if (error) {
      setErrorNuevoIngrediente(error);
    }
  };

  const handleNewStepFieldBlur = () => {
    if (!newPaso.trim()) setErrorNuevoPaso('Por favor, escribe el paso para añadirlo.');
  };

  // Recibir datos del usuario
  const obtenerDatosUsuario = async () => {
    try {
      const respuesta = await axios.get('http://localhost/api/area_privada/editar-perfil/get_editar-perfil.php', {
        withCredentials: true
      });
      if (respuesta.data.success) {
        setFormData({
          usuario: respuesta.data.usuario || '',
          correo: respuesta.data.correo || '',
          password: respuesta.data.password || ''
        });
      } else {
        setMensaje(respuesta.data.message);
      }
    } catch (error) {
      setMensaje('Hubo un error al cargar los datos del usuario.');
      console.error('Error:', error);
    }
  };

  // Recibir datos de las recetas creadas
  const obtenerRecetasCreadas = async () => {
    setLoadingRecetas(true);
    setErrorRecetas('');
    try {
      const respuesta = await axios.get('http://localhost/api/area_privada/recetas/getRecetasCreadas.php', {
        withCredentials: true,
      });
      if (respuesta.data.success) {
        setRecetasCreadas(respuesta.data.recetas);
        // Likes y favoritos
        const likesIniciales = {};
        const favoritosIniciales = {};
        respuesta.data.recetas.forEach(r => {
          likesIniciales[r._id] = r.likes || 0;
          favoritosIniciales[r._id] = r.favorito || false;
        });
        setLikes(likesIniciales);
        setFavoritos(favoritosIniciales);
        setN_recetas(respuesta.data.n_recetas);
        setCargando(false);
        setPaginaActual(1);
      } else {
        setErrorRecetas(respuesta.data.message || 'Error al cargar las recetas creadas.');
      }
    } catch (error) {
      setErrorRecetas('Hubo un error al conectar con el servidor para obtener las recetas.');
      console.error('Error fetching created recipes:', error);
    } finally {
      setLoadingRecetas(false);
    }
  };

  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    obtenerDatosUsuario();

    // Check for navigation state to set active section
    if (location.state?.seccion) {
      setSeccionActiva(location.state.seccion);
    } else {
      // Default section if no state is passed
      setSeccionActiva("perfil");
    }
  }, []);

  // Cargar las recetas creadas cuando la sección "recetas" esté activa
  useEffect(() => {
    if (seccionActiva === "recetas") {
      obtenerRecetasCreadas();
    }
  }, [seccionActiva]);

  // Manejar el envío del formulario de perfil
  const manejarEnvio = async (e) => {
    e.preventDefault();
    let formIsValid = true;
    // Limpiar errores previos
    setErrorUsuario('');
    // setErrorCorreo(''); // Ya no se necesita
    setMensaje('');
    setExito(false);

    // Validar usuario
    if (!formData.usuario.trim()) {
      setErrorUsuario('El nombre de usuario es obligatorio.');
      formIsValid = false;
    }

    if (!formIsValid) return;

    try {
      const respuesta = await axios.post('http://localhost/api/area_privada/editar-perfil/editar-perfil.php', formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (respuesta.data.success) {
        setExito(true);
        setMensaje(respuesta.data.message);
        console.log('Usuario:', respuesta.data.user);
      } else {
        setExito(false);
        setMensaje(respuesta.data.message);
      }
    } catch (error) {
      setExito(false);
      setMensaje('Hubo un error al procesar la solicitud.');
      console.error('Error:', error);
    }
  };
  console.log({
    ...formRecetaNueva,
    ingredientes: ingredientes,
    pasos: pasos,
  });


  // Manejar el envio de la receta
  const manejarEnvioReceta = async (e) => {
    e.preventDefault();
    let formIsValid = true;
    // Limpiar errores previos
    setErrorNombreReceta('');
    setErrorDificultad('');
    setErrorTiempo('');
    setErrorPais('');
    setErrorIngredientesLista('');
    setErrorImagenReceta('');
    setErrorPasosLista('');
    setMensaje('');
    setExito(false);

    if (!formRecetaNueva.nombre.trim()) {
      setErrorNombreReceta('El nombre de la receta es obligatorio.');
      formIsValid = false;
    }
    if (!formRecetaNueva.dificultad) {
      setErrorDificultad('La dificultad es obligatoria.');
      formIsValid = false;
    }
    if (!formRecetaNueva.tiempo.trim()) {
      setErrorTiempo('El tiempo de preparación es obligatorio.');
      formIsValid = false;
    } else if (isNaN(formRecetaNueva.tiempo) || Number(formRecetaNueva.tiempo) <= 0) {
      setErrorTiempo('El tiempo debe ser un número positivo en minutos.');
      formIsValid = false;
    }
    if (!formRecetaNueva.pais) {
      setErrorPais('El país es obligatorio.');
      formIsValid = false;
    }
    if (ingredientes.length === 0) {
      setErrorIngredientesLista('Debes añadir al menos un ingrediente.');
      formIsValid = false;
    }
    if (pasos.length === 0) {
      setErrorPasosLista('Debes añadir al menos un paso.');
      formIsValid = false;
    }
    // Validar si hay un error de imagen pendiente (por ejemplo, si se intentó subir una muy grande)
    if (errorImagenReceta) {
      // No es necesario establecer formIsValid = false aquí si el error ya impidió que 'imagen' se estableciera.
      // Pero es bueno tenerlo en cuenta si la lógica cambia.
    }

    if (!formIsValid) return;
    // Crear un objeto FormData para enviar datos mixtos (texto y archivo)
    const formDataToSend = new FormData();

    // Añadir los campos de texto de formRecetaNueva
    for (const key in formRecetaNueva) {
      // Asegúrate de que los valores booleanos se envíen como 'true' o 'false' strings
      if (typeof formRecetaNueva[key] === 'boolean') {
        formDataToSend.append(key, formRecetaNueva[key] ? 'true' : 'false');
      } else {
        formDataToSend.append(key, formRecetaNueva[key]);
      }
    }

    // Añadir la imagen si existe
    if (imagen) {
      formDataToSend.append('imagen', imagen); // 'imagen' es el nombre del campo que tu backend esperará para el archivo
    }

    // Añadir los ingredientes y pasos, convirtiéndolos a string JSON
    formDataToSend.append('ingredientes', JSON.stringify(ingredientes));
    formDataToSend.append('pasos', JSON.stringify(pasos));

    try {
      const respuesta = await axios.post(
        'http://localhost/api/area_privada/editar-perfil/crear-receta.php',
        formDataToSend, // Se envía el objeto FormData
        {
          withCredentials: true,
        }
      );

      if (respuesta.data.success) {
        setExito(true);
        setMensaje(respuesta.data.message);
        console.log('Receta:', respuesta.data.receta);
        // Limpiar los formularios después de un envío exitoso
        setRecetaNueva({
          nombre: '',
          dificultad: '',
          tiempo: '',
          pais: '',
          gluten: false,
          vegetariana: false,
          lactosa: false,
          vegana: false,
        });
        setIngredientes([]); // Limpiar la tabla de ingredientes
        setPasos([]); // Limpiar la tabla de pasos
        setNewIngredienteNombre('');
        setNewIngredienteCantidad('');
        setNewIngredienteUnidad('');
        setNewPaso('');
        setImagen(null); // Limpiar la imagen seleccionada
        setImagenPreview(null); // Limpiar la vista previa de la imagen
        setErrorImagenReceta(''); // Limpiar error de imagen
        // Redirigir inmediatamente after successful creation
        navigate("/area-privada/editar-perfil", { state: { seccion: "recetas" } });
        // Optionally show the popup after navigation
        setMostrarPopup(true);
      } else {
        setExito(false);
        setMensaje(respuesta.data.message);
      }
    } catch (error) {
      setExito(false);
      setMensaje('Hubo un error al procesar la solicitud.');
      console.error('Error:', error);
    }
  };
  return (
    <>
      <Header />
      <main>
        <div className='container'>
          <div className="d-flex align-items-center mb-4">
            <button
              onClick={() => navigate(-1)}
              className="btn volver me-3"
              title="Volver a la página anterior"
            >
              Volver
            </button>
            <div className="titulo-pagina d-flex align-items-center justify-content-start">
              <ul className="d-flex list-unstyled mb-0"> {/* ul con d-flex para alinear items y limpiar estilos */}
                <li onClick={() => setSeccionActiva("perfil")} role="button" tabIndex="0" className="me-2 nav-item-editar-perfil"><h4 className="numero-recetas mb-0">Mi Perfil</h4></li>
                <div className="linea-vertical mx-2"></div>
                <li onClick={() => setSeccionActiva("recetas")} role="button" tabIndex="0" className="mx-2 nav-item-editar-perfil"><h4 className="numero-recetas mb-0">Recetas creadas</h4></li>
                <div className="linea-vertical mx-2"></div>
                <li onClick={() => setSeccionActiva("crear")} role="button" tabIndex="0" className="ms-2 nav-item-editar-perfil"><h4 className="numero-recetas mb-0">Crear Receta</h4></li>
              </ul>
            </div>
          </div>

          {/* Apartado Perfil Usuario */}
          {seccionActiva === "perfil" && (
            <div className="tarjeta-perfil">
              <h1 className="titulos-perfil">Mi Perfil</h1>
              <div className="info-perfil">
                <div className="contenedores-info-perfil">
                  <h3 className="titulos-perfil">Usuario</h3>
                  {/* Se cambia <h3> por <p> ya que no es un input editable en esta vista */}
                  <p className='nombreUsuarioEditarPerfil' id="usuario" name="usuario">{formData.usuario}</p>
                </div>
              </div>

              <div className="info-perfil">
                <div className="contenedores-info-perfil">
                  <h3 className="titulos-perfil">Correo Electrónico</h3>
                  <h3>{formData.correo}</h3>
                </div>
              </div>

              <div className="info-perfil">
                <p className="mensaje-subrayado" ><a className='mensajeSubrayadoA' href="/login/restablecer-password">Reestablecer contraseña</a></p>
              </div>
              <div className="botones-perfil">
                <button className="botones-inversos" type="button" onClick={() => setMostrarModalEliminar(true)}>
                  Eliminar Cuenta
                </button>
                <button className='botones-editar-perfil' type='button' onClick={() => setSeccionActiva("editar-perfil")}>Editar Perfil</button>

              </div>
            </div>
          )} {/* Modal Bootstrap */}
          <div className={`modal fade ${mostrarModalEliminar ? "show d-block" : ""}`} tabIndex="-1" style={{ background: mostrarModalEliminar ? "rgba(0,0,0,0.5)" : "none" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">¿Estás seguro?</h5>
                  <button type="button" className="btn-close" onClick={() => setMostrarModalEliminar(false)}></button>
                </div>
                <div className="modal-body">
                  <p>¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.
                    <br />Tus recetas se guadaran pero los datos asociados a tu cuenta serán eliminados.
                  </p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setMostrarModalEliminar(false)}>
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-danger" onClick={handleEliminarCuenta}>
                    Sí, eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
          {seccionActiva === "editar-perfil" && (
            <div className="tarjeta-perfil">
              <h1 className="titulos-perfil">Mi Perfil</h1>
              <form onSubmit={manejarEnvio}>
                <div className="info-perfil">
                  <div className="contenedores-info-perfil">
                    <h3 className="titulos-perfil">Usuario</h3>
                    <input
                      type="text"
                      id="usuario"
                      name="usuario"
                      value={formData.usuario}
                      onChange={manejarCambio}
                      onBlur={handleProfileBlur}
                      required
                    />
                    {errorUsuario && <span className="error-mensaje" style={{ color: 'red', display: 'block', minHeight: '1em' }}>{errorUsuario}</span>}
                  </div>
                </div>

                <div className="info-perfil">
                  <div className="contenedores-info-perfil">
                    <h3 className="titulos-perfil">Correo Electrónico</h3>
                    {/* Campo de correo no editable */}
                    <p id="correo" name="correo" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f0f0f0' }}>{formData.correo}</p>
                  </div>
                </div>

                <div className="botones-perfil">
                  <button className="botones-inversos" type='button' onClick={() => setSeccionActiva("perfil")}>Cancelar</button>
                  <button className='botones-editar-perfil' type="submit">Guardar</button>
                </div>
              </form>
            </div>
          )}


          {/* {CONTENEDOR RECETAS GUARDADAS} */}
          {seccionActiva === "recetas" && (
            <div className="tarjetas">
              {loadingRecetas && <p>Cargando tus recetas...</p>}
              {errorRecetas && <p style={{ color: 'red' }}>{errorRecetas}</p>}
              {!loadingRecetas && !errorRecetas && recetasCreadas.length === 0 && (
                <p>Aún no has creado ninguna receta. ¡Anímate a crear la primera!</p>
              )}
              {!loadingRecetas && !errorRecetas && recetasCreadas.map((receta) => (
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
                    </div>
                  </div>
                </div>
              ))}
            </div>


          )}


          {seccionActiva === "crear" && (
            <div className="crear-receta">
              <div className="crear-receta-info">
                <h3>Nombre de la Receta</h3>
                <p className="info-racion">*Los datos son para 1 ración*</p>
                <input
                  type="text"
                  id="nombre-receta-nueva"
                  name="nombre"
                  placeholder='Introduce el nombre de la receta'
                  value={formRecetaNueva.nombre}
                  onChange={manejarCambioReceta}
                  onBlur={handleRecipeFieldBlur}
                  required
                />
                {errorNombreReceta && <span className="error-mensaje" style={{ color: 'red', display: 'block', minHeight: '1em' }}>{errorNombreReceta}</span>}
                {/* Sección para subir la imagen */}
                <div className="subir-imagen-receta">
                  <h3>Imagen de la Receta</h3>
                  <input
                    type="file"
                    id="imagen-receta-nueva"
                    name="imagen"
                    accept="image/*"
                    onChange={manejarCambioImagen}
                  />
                  {errorImagenReceta && <span className="error-mensaje" style={{ color: 'red', display: 'block', minHeight: '1em' }}>{errorImagenReceta}</span>}
                  {imagenPreview && (
                    <div className="vista-previa-imagen">
                      <img src={imagenPreview} alt="Vista previa" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                    </div>
                  )}
                </div>
                <div className="info-basica-receta">
                  <div className="apartado-dificultad">
                    <h5>Introduce la dificultad</h5>
                    <select
                      name="dificultad"
                      id="nivel-dificultad"
                      value={formRecetaNueva.dificultad}
                      onChange={manejarCambioReceta}
                      onBlur={handleRecipeFieldBlur}
                      required
                    >
                      <option value="" disabled>
                        Selecciona una dificultad
                      </option>
                      <option value="facil">Fácil</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="dificil">Difícil</option>
                    </select>
                    {errorDificultad && <span className="error-mensaje" style={{ color: 'red', display: 'block', minHeight: '1em' }}>{errorDificultad}</span>}
                  </div>
                  <div className="apartado-tiempo">
                    <h5>Introduce el tiempo (min)</h5>
                    <input
                      type="number"
                      name="tiempo"
                      id="tiempo"
                      placeholder='Tiempo en minutos'
                      value={formRecetaNueva.tiempo}
                      onChange={manejarCambioReceta}
                      onBlur={handleRecipeFieldBlur}
                      required
                    />
                    {errorTiempo && <span className="error-mensaje" style={{ color: 'red', display: 'block', minHeight: '1em' }}>{errorTiempo}</span>}
                  </div>

                  <div className="apartado-pais">
                    <h5>Selecciona el país de la receta</h5>
                    <select
                      className="form-select"
                      name="pais"
                      value={formRecetaNueva.pais}
                      onChange={manejarCambioPais}
                      onBlur={handleRecipeFieldBlur}
                      aria-label="Selecciona el país"
                    >
                      <option value="" disabled>
                        Selecciona un país
                      </option>
                      <option value="Italia">Italia</option>
                      <option value="México">México</option>
                      <option value="Japón">Japón</option>
                      <option value="España">España</option>
                      <option value="India">India</option>
                      <option value="Francia">Francia</option>
                      <option value="Alemania">Alemania</option>
                      <option value="Estados Unidos">Estados Unidos</option>
                      <option value="China">China</option>
                      <option value="Brasil">Brasil</option>
                      <option value="Tailandia">Tailandia</option>
                      <option value="Grecia">Grecia</option>
                      <option value="Turquía">Turquía</option>
                      <option value="Corea del Sur">Corea del Sur</option>
                      <option value="Libano">Líbano</option>
                    </select>
                    {errorPais && <span className="error-mensaje" style={{ color: 'red', display: 'block', minHeight: '1em' }}>{errorPais}</span>}
                    <br />
                    <div className="apartado-gluten">
                      <h5>¿Contiene gluten?</h5>
                      <label>
                        <input
                          type="radio"
                          name="gluten"
                          value="sí"
                          checked={formRecetaNueva.gluten === true}
                          onChange={manejarCambioOpcionBooleanaReceta}
                        /> Sí
                      </label><br />
                      <label>
                        <input
                          type="radio"
                          name="gluten"
                          value="no"
                          checked={formRecetaNueva.gluten === false}
                          onChange={manejarCambioOpcionBooleanaReceta}
                        /> No
                      </label>
                    </div>

                    <div className="apartado-lactosa">
                      <h5>¿Contiene lactosa?</h5>
                      <label>
                        <input
                          type="radio"
                          name="lactosa"
                          value="sí"
                          checked={formRecetaNueva.lactosa === true}
                          onChange={manejarCambioOpcionBooleanaReceta}
                        /> Sí
                      </label><br />
                      <label>
                        <input
                          type="radio"
                          name="lactosa"
                          value="no"
                          checked={formRecetaNueva.lactosa === false}
                          onChange={manejarCambioOpcionBooleanaReceta}
                        /> No
                      </label>
                    </div>
                    <div className="apartado-vegetariana">
                      <h5>¿Es vegetariana?</h5>
                      <label>
                        <input
                          type="radio"
                          name="vegetariana"
                          value="sí"
                          checked={formRecetaNueva.vegetariana === true}
                          onChange={manejarCambioOpcionBooleanaReceta}
                        /> Sí
                      </label><br />
                      <label>
                        <input
                          type="radio"
                          name="vegetariana"
                          value="no"
                          checked={formRecetaNueva.vegetariana === false}
                          onChange={manejarCambioOpcionBooleanaReceta}
                        /> No
                      </label>
                    </div>
                    <div className="vegana">
                      <h5>¿Es vegana?</h5>
                      <label>
                        <input
                          type="radio"
                          name="vegana"
                          value="sí"
                          checked={formRecetaNueva.vegana === true}
                          onChange={manejarCambioOpcionBooleanaReceta}
                        /> Sí
                      </label><br />
                      <label>
                        <input
                          type="radio"
                          name="vegana"
                          value="no"
                          checked={formRecetaNueva.vegana === false}
                          onChange={manejarCambioOpcionBooleanaReceta}
                        /> No
                      </label>
                    </div>

                  </div>

                </div>
              </div>

              <div className="ingredientes-pasos">
                <div className="ingredientes-crear-receta">
                  <div className="contenedor-ingredientes">
                    <h5>INGREDIENTES</h5>
                    {/* Tabla para mostrar los ingredientes añadidos */}
                    {ingredientes.length > 0 && (
                      <table className="tabla-ingredientes table table-striped table-sm">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Unidad</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ingredientes.map((ing, index) => (
                            <tr key={index}>
                              <td>{ing.nombre}</td>
                              <td>{ing.cantidad}</td>
                              <td>{ing.unidad}</td>
                              <td>
                                <button type="button" onClick={() => handleRemoveIngrediente(index)}>
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {errorIngredientesLista && <p style={{ color: 'red', minHeight: '1em' }}>{errorIngredientesLista}</p>}
                    {/* Campos de entrada para añadir un nuevo ingrediente */}
                    <div className="rellenar-ingrediente">
                      Nombre Ingrediente:
                      <input
                        type="text"
                        placeholder="Ej: Harina"
                        value={newIngredienteNombre}
                        onChange={(e) => { setNewIngredienteNombre(e.target.value); setErrorNuevoIngrediente(''); }}
                        onBlur={() => handleNewIngredientFieldBlur('nombre')}
                      />
                      <span>Cantidad</span>
                      <input
                        type="text" // Cambiado a text para permitir validación más flexible antes de convertir a número
                        placeholder="Ej: 200"
                        value={newIngredienteCantidad}
                        onChange={(e) => { setNewIngredienteCantidad(e.target.value); setErrorNuevoIngrediente(''); }}
                        onBlur={() => handleNewIngredientFieldBlur('cantidad')}
                      />
                      <span>Unidad</span>
                      <select
                        value={newIngredienteUnidad}
                        onChange={(e) => {
                          setNewIngredienteUnidad(e.target.value);
                          setErrorNuevoIngrediente('');
                        }}
                        onBlur={() => handleNewIngredientFieldBlur('unidad')}
                      >
                        <option value="">Selecciona una unidad</option>
                        <option value="unidad">Unidad</option>
                        <option value="gramos">Gramos</option>
                        <option value="kilos">Kilos</option>
                        <option value="mililitros">Mililitros</option>
                        <option value="litros">Litros</option>
                        <option value="cucharadas">Cucharadas</option>
                        <option value="cucharaditas">Cucharaditas</option>
                      </select>

                      <button type="button" onClick={handleAddIngrediente} className="anadir-ingrediente-btn">
                        Añadir Ingrediente
                      </button>
                      {errorNuevoIngrediente && <span style={{ color: 'red', display: 'block', minHeight: '1em', marginTop: '5px' }}>{errorNuevoIngrediente}</span>}
                    </div>
                  </div>
                </div>
                <div className="pasos-crear-receta">
                  <h5>PASOS</h5>
                  {/* Tabla para mostrar los pasos añadidos */}
                  {pasos.length > 0 && (
                    <table className="tabla-pasos table table-striped table-sm">
                      <thead>
                        <tr>
                          <th>Paso</th>
                          <th>Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pasos.map((paso, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{paso}</td>
                            <td>
                              <button type="button" onClick={() => handleRemovePaso(index)}>
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {errorPasosLista && <p style={{ color: 'red', minHeight: '1em' }}>{errorPasosLista}</p>}
                  {/* Campo de entrada para añadir un nuevo paso */}
                  <div className="rellenar-pasos">
                    Paso:
                    <input
                      type="text"
                      placeholder="Describe el paso"
                      value={newPaso}
                      onChange={(e) => { setNewPaso(e.target.value); setErrorNuevoPaso(''); }}
                      onBlur={handleNewStepFieldBlur}
                    />
                    <button type="button" onClick={handleAddPaso} className="anadir-pasos-btn">
                      Añadir Paso
                    </button>
                    {errorNuevoPaso && <span style={{ color: 'red', display: 'block', minHeight: '1em', marginTop: '5px' }}>{errorNuevoPaso}</span>}
                  </div>
                </div>
              </div>

              <div className="botones-crear-receta">

                <button className="botones-inversos" id="cancelar-receta" type='button'
                  onClick={() => {
                    setSeccionActiva("perfil"); // Vuelve a la sección de perfil
                    setRecetaNueva({ // Limpia el formulario de receta
                      nombre: '',
                      dificultad: '',
                      tiempo: '',
                      pais: '',
                      gluten: false,
                      vegetariana: false,
                      lactosa: false,
                      vegana: false,
                    });
                    setIngredientes([]); // Limpia la tabla de ingredientes
                    setPasos([]); // Limpia la tabla de pasos
                    setNewIngredienteNombre('');
                    setNewIngredienteCantidad('');
                    setNewIngredienteUnidad('');
                    setErrorNuevoIngrediente('');
                    setNewPaso('');
                    setErrorNuevoPaso('');
                    // Limpiar también los errores de validación del formulario de receta
                    setErrorNombreReceta(''); setErrorDificultad(''); setErrorTiempo(''); setErrorPais(''); setErrorIngredientesLista(''); setErrorPasosLista(''); setMensaje(''); setErrorImagenReceta('');
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="boton-crear-receta"
                  id="terminar-receta"
                  type="button" // Dejar como button si el form tiene su propio onSubmit, o submit si este es el que gatilla el form.
                  onClick={manejarEnvioReceta} // Este botón ahora llama a la función que valida y envía
                >
                  Terminar
                </button>
              </div>
              {mensaje && (
                <div style={{ color: exito ? 'green' : 'red', marginTop: '1rem' }}>
                  {mensaje}
                </div>
              )}
            </div>
          )}
          {mostrarPopup && (
            <div className="popup-receta-creada">
              <div className="popup-contenido-receta-creada">
                <h2>¡Receta creada con éxito!</h2>
                <button
                  className="boton-cerrar-popup-receta-creada"
                  onClick={handleCerrarPopup}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </main >
    </>
  );
};

export default EditarPerfil;