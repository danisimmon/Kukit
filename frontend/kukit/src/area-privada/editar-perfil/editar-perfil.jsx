import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import logo from '../../img/logo_kukit.png';
import comida from "../../img/comida.jpg";
import bookmark from "../../img/bookmark.png";
import Footer from '../../footer/footer';
import Header from '../../header/header';
import { useNavigate } from 'react-router-dom';


const EditarPerfil = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mostrarPopup, setMostrarPopup] = useState(false);

  // Estados para los nuevos inputs de ingredientes y pasos
  const [newIngredienteNombre, setNewIngredienteNombre] = useState('');
  const [newIngredienteCantidad, setNewIngredienteCantidad] = useState('');
  const [newIngredienteUnidad, setNewIngredienteUnidad] = useState('');
  const [newPaso, setNewPaso] = useState('');

  const direccionRecetasCreadas = () => {
    navigate("/area-privada/editar-perfil", {
      state: { seccion: "recetas" },
    });
  };

  // Llamar esta función después de crear la receta
  const mostrarPopupExito = () => {
    console.log("Mostrando popup");
    setMostrarPopup(true);
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

  const manejarCambioPais = (e) => {
    setRecetaNueva({
      ...formRecetaNueva,
      pais: e.target.value
    });
  };

  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  // Handler para la subida de la imagen
  const manejarCambioImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setImagenPreview(URL.createObjectURL(file));
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
  const handleAddIngrediente = () => {
    if (newIngredienteNombre && newIngredienteCantidad && newIngredienteUnidad) {
      setIngredientes([
        ...ingredientes,
        {
          nombre: newIngredienteNombre,
          cantidad: newIngredienteCantidad,
          unidad: newIngredienteUnidad,
        },
      ]);
      // Limpiar los campos de entrada después de añadir
      setNewIngredienteNombre('');
      setNewIngredienteCantidad('');
      setNewIngredienteUnidad('');
      setMensaje(''); // Limpiar mensaje de error si lo hubiera
    } else {
      setMensaje('Por favor, rellena todos los campos del ingrediente para añadirlo.');
      setExito(false);
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
      setMensaje(''); // Limpiar mensaje de error si lo hubiera
    } else {
      setMensaje('Por favor, escribe el paso para añadirlo.');
      setExito(false);
    }
  };

  const handleRemovePaso = (index) => {
    const newPasos = pasos.filter((_, i) => i !== index);
    setPasos(newPasos);
  };

  // Los manejadores originales handleIngredienteChange y handlePasoChange ya no son necesarios
  // para la entrada de nuevos elementos, ya que usamos los estados newIngrediente... y newPaso.
  // Si se usaban para editar elementos existentes en una tabla, se deberían mantener y adaptar.
  // Como la petición es solo añadir y borrar, y no modificar elementos en la tabla, los omitimos.
  // const handleIngredienteChange = (index, field, value) => {
  //   const newIngredientes = [...ingredientes];
  //   newIngredientes[index] = {
  //     ...newIngredientes[index],
  //     [field]: value,
  //   };
  //   setIngredientes(newIngredientes);
  // };

  // const handlePasoChange = (index, value) => {
  //   const newPasos = [...pasos];
  //   newPasos[index] = value;
  //   setPasos(newPasos);
  // };


  const manejarCambioReceta = (e) => {
    const { name, value } = e.target;
    setRecetaNueva({
      ...formRecetaNueva,
      [name]: value
    });
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
    e.preventDefault(); // Prevent the default form submission
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
    e.preventDefault(); // Asegúrate de prevenir el comportamiento por defecto del formulario

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
        <div className="container">
          <div className="titulo-pagina">
            <ul>
              <li onClick={() => setSeccionActiva("perfil")}><h4 className="numero-recetas">Mi Perfil</h4></li>
              <div className="linea-vertical"></div>
              <li onClick={() => setSeccionActiva("recetas")}><h4 className="numero-recetas">Recetas creadas</h4></li>
              <div className="linea-vertical"></div>
              <li onClick={() => setSeccionActiva("crear")}><h4 className="numero-recetas">Crear Receta</h4></li>
            </ul>
          </div>

          {/* Apartado Perfil Usuario */}
          {seccionActiva === "perfil" && (
            <div className="tarjeta-perfil">
              <h1 className="titulos-perfil">Mi Perfil</h1>
              <div className="info-perfil">
                <div className="contenedores-info-perfil">
                  <h3 className="titulos-perfil">Usuario</h3>
                  {/* Se cambia <h3> por <p> ya que no es un input editable en esta vista */}
                  <p id="usuario" name="usuario">{formData.usuario}</p>
                </div>
              </div>

              <div className="info-perfil">
                <div className="contenedores-info-perfil">
                  <h3 className="titulos-perfil">Correo Electrónico</h3>
                  <h3>{formData.correo}</h3>
                </div>
              </div>

              <div className="info-perfil">
                <div className="contenedores-info-perfil">
                  <h3 className="titulos-perfil">Contraseña</h3>
                  <h3>******</h3>
                </div>
              </div>
              <div className="botones-perfil">
                <button className="botones-inversos">Eliminar Cuenta</button>
                <button onClick={() => setSeccionActiva("editar-perfil")}>Editar Perfil</button>

              </div>
            </div>
          )}
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
                      required
                    />
                  </div>
                </div>

                <div className="info-perfil">
                  <div className="contenedores-info-perfil">
                    <h3 className="titulos-perfil">Correo Electrónico</h3>
                    <input
                      type="email"
                      id="correo"
                      name="correo"
                      value={formData.correo}
                      onChange={manejarCambio}
                      required
                    />
                  </div>
                </div>

                <div className="info-perfil">
                  <div className="contenedores-info-perfil">
                    <h3 className="titulos-perfil">Contraseña</h3>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={manejarCambio}
                    />
                  </div>
                </div>
                <div className="botones-perfil">
                  <button className="botones-inversos" type='button' onClick={() => setSeccionActiva("perfil")}>Cancelar</button>
                  <button type="submit">Guardar</button>
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
                <div className="tarjeta" key={receta._id}>
                  <img
                    src={receta.href || comida}
                    className="imagen-receta-tarjeta"
                    alt={receta.nombre}
                  />
                  <h3>{receta.nombre}</h3>
                  <a
                    className="btn"
                    data-bs-toggle="offcanvas"
                    href="#offcanvasExample"
                    role="button"
                    aria-controls="offcanvasExample"
                  >
                    Ver receta
                  </a>
                  <img src={bookmark} className="icono-bookmark" alt="Guardar" />
                </div>
              ))}
            </div>
          )}


          {seccionActiva === "crear" && (
            <div className="crear-receta">
              <div className="crear-receta-info">
                <h3>Nombre de la Receta</h3>
                <input
                  type="text"
                  id="nombre-receta-nueva"
                  name="nombre"
                  value={formRecetaNueva.nombre}
                  onChange={manejarCambioReceta}
                  required
                />
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
                      required
                    >
                      <option value="" disabled>
                        Selecciona una dificultad
                      </option>
                      <option value="facil">Fácil</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="dificil">Difícil</option>
                    </select>
                  </div>
                  <div className="apartado-tiempo">
                    <h5>Introduce el tiempo (minutos)</h5>
                    <input
                      type="text"
                      name="tiempo"
                      id="tiempo"
                      value={formRecetaNueva.tiempo}
                      onChange={manejarCambioReceta}
                      required
                    />
                  </div>

                  <div className="apartado-pais">
                    <h5>Selecciona el país</h5>
                    <select
                      className="form-select"
                      name="pais"
                      value={formRecetaNueva.pais}
                      onChange={manejarCambioPais}
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
                    </select><br />
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

              <div className="racion-ingredientes">
                <h5>Ración</h5>
                <h2>1</h2>
              </div>

              <div className="ingredientes-pasos">
                <div className="ingredientes-crear-receta">
                  <div className="contenedor-ingredientes">
                    <h5>INGREDIENTES</h5>
                    {/* Tabla para mostrar los ingredientes añadidos */}
                    {ingredientes.length > 0 && (
                      <table className="tabla-ingredientes">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Unidad</th>
                            <th>Acciones</th>
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
                    {/* Campos de entrada para añadir un nuevo ingrediente */}
                    <div className="rellenar-ingrediente">
                      Nombre Ingrediente:
                      <input
                        type="text"
                        placeholder="Ej: Harina"
                        value={newIngredienteNombre}
                        onChange={(e) => setNewIngredienteNombre(e.target.value)}
                      />
                      <span>Cantidad</span>
                      <input
                        type="number"
                        placeholder="Ej: 200"
                        value={newIngredienteCantidad}
                        onChange={(e) => setNewIngredienteCantidad(e.target.value)}
                      />
                      <span>Unidad</span>
                      <input
                        type="text"
                        placeholder="Ej: gramos"
                        value={newIngredienteUnidad}
                        onChange={(e) => setNewIngredienteUnidad(e.target.value)}
                      />
                      <button type="button" onClick={handleAddIngrediente} className="anadir-ingrediente-btn">
                        Añadir Ingrediente
                      </button>
                    </div>
                  </div>
                </div>
                <div className="pasos-crear-receta">
                  <h5>PASOS</h5>
                  {/* Tabla para mostrar los pasos añadidos */}
                  {pasos.length > 0 && (
                    <table className="tabla-pasos">
                      <thead>
                        <tr>
                          <th>Paso #</th>
                          <th>Descripción</th>
                          <th>Acciones</th>
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
                  {/* Campo de entrada para añadir un nuevo paso */}
                  <div className="rellenar-pasos">
                    Paso:
                    <input
                      type="text"
                      placeholder="Describe el paso"
                      value={newPaso}
                      onChange={(e) => setNewPaso(e.target.value)}
                    />
                    <button type="button" onClick={handleAddPaso} className="anadir-pasos-btn">
                      Añadir Paso
                    </button>
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
                    setNewPaso('');
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="boton-crear-receta"
                  id="terminar-receta"
                  type="submit" // Cambiado a type="submit" para que el formulario se envíe
                  onClick={manejarEnvioReceta} // Se llama a manejarEnvioReceta directamente aquí
                >
                  Terminar
                </button>
              </div>
              {mensaje && (
                <div style={{ color: exito ? 'green' : 'red' }}>
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
      <Footer />
    </>
  );
};

export default EditarPerfil;