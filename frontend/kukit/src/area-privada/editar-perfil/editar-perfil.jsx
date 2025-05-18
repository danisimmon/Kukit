import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../../img/logo_kukit.png';
import comida from "../../img/comida.jpg";
import bookmark from "../../img/bookmark.png";
import Footer from '../../footer/footer';

const EditarPerfil = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    correo: '',
    password: ''
  });

  const [formRecetaNueva, setRecetaNueva] = useState({
    nombre: '',
    dificultad: '',
    tiempo: '',
    ingredientes: [],
    pasos: []
  });

  const [ingredientes, setIngredientes] = useState([{ nombre: '', cantidad: '', unidad: '' }]);
  const [pasos, setPasos] = useState(['']);
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("perfil");

  // Manejadores para Ingredientes
    const handleIngredienteChange = (index, field, value) => {
        const newIngredientes = [...ingredientes];
        newIngredientes[index] = {
            ...newIngredientes[index],
            [field]: value,
        };
        setIngredientes(newIngredientes);
    };

    const handleAddIngrediente = () => {
        setIngredientes([...ingredientes, { nombre: '', cantidad: '', unidad: '' }]);
    };

    const handleRemoveIngrediente = (index) => {
        const newIngredientes = ingredientes.filter((_, i) => i !== index);
        setIngredientes(newIngredientes);
    };

  // Manejadores para Pasos
  const handlePasoChange = (index, value) => {
    const newPasos = [...pasos];
    newPasos[index] = value;
    setPasos(newPasos);
  };

  const handleAddPaso = () => {
    setPasos([...pasos, '']);
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

  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    obtenerDatosUsuario();
  }, []);

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

  // Manejar el envio de la receta
    const manejarEnvioReceta = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await axios.post(
                'http://localhost/api/area_privada/editar-perfil/crear-receta.php',
                {
                    ...formRecetaNueva,
                    ingredientes: ingredientes, // Include ingredientes in the payload
                    pasos: pasos, // Include pasos in the payload
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            if (respuesta.data.success) {
                setExito(true);
                setMensaje(respuesta.data.message);
                console.log('Receta:', respuesta.data.receta);
                // Optionally reset the form
                setRecetaNueva({ nombre: '', dificultad: '', tiempo: '', ingredientes: [], pasos: [] });
                setIngredientes([{ nombre: '', cantidad: '', unidad: '' }]);
                setPasos(['']);
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
      <header>
        <a href="./index.html" id="logo-header">
          <img src={logo} alt="Logo Kukit" id="logo-header" />
        </a>
        <button id="hamburger-menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav>
          <ul>
            <li><a href="productos.html">Recetas</a></li>
            <li>
              <a className="btn" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
                Lista de la compra
              </a>
            </li>
            <li><a href="#">Plan de alimentación</a></li>
          </ul>
        </nav>

        <div className="contenedor-header">
          <button className="sign-in" id="sign-in">Iniciar sesión</button>
          <button className="sign-up" id="sign-up">Regístrate</button>
        </div>
        <div id="pop-up">
          {/* <div class="pop-up-sign-up" id="pop-up-sign-up">
            <section class="contenedor-sign-up" id="contenedor-sign-up">
              <figure>
                <a href=""><img src="img/logo_kukit.png" alt="logo de kukit"></a>
              </figure>

              <h1>CREAR CUENTA</h1>
              <hr class="linea-inicio-sesion">
              <form action="" id="sign-up-form">

                <div>
                  <label for="email-sign-up">Correo electrónico:</label>
                  <input type="email" name="email-sign-up" id="email-sign-up">
                </div>

                <div>
                  <label for="password-sign-up">Contraseña:</label>
                  <input type="password" name="password-sign-up" id="password-sign-up">
                </div>
                <label class="checkbox-label">
                  <input type="checkbox" name="recordarme" id="recordarme">
                  <span>Recordarme</span>
                </label>

                <p class="aceptar-terminos">
                  Al hacer clic en «Aceptar y crear cuenta», aceptas las <b><u>Condiciones de
                    uso</u></b>, la <b><u>Política de privacidad</u></b> y la <b><u>Política de
                    cookies</u></b> de Kukit
                </p>

                <button type="submit" class="botones-inicio-sesion">Aceptar y crear cuenta</button>
              </form>
              <p>¿Ya tienes cuenta?</p>
              <button class="botones-inicio-sesion" id="inicio-google">Iniciar sesión</button>

              <hr>

            </section>
        </div> */}

          {/* <div class="pop-up-sign-in" id="pop-up-sign-in">
            <section class="contenedor-sign-in" id="contenedor-sign-in">
              <figure>
                <a href="index.html"><img src="img/logo_kukit.png" alt="Logo de Kukit"></a>
              </figure>

              <h1>INICIAR SESIÓN</h1>
              <hr class="linea-inicio-sesion">

              <hr>

              <form>
                <div class="contenedor-email-password">
                  <label for="email-sign-in" id="mail" class="mail">Correo electrónico:</label>
                  <input type="email" name="email-sign-in" id="email-sign-in">
                  <span id="errorEmail"></span>
                </div>

                <div class="contenedor-email-password">
                  <label for="password-sign-in" class="password-sign-in">Contraseña:</label>
                  <input type="password" name="password-sign-in" id="password-sign-in">
                  <span id="errorPassword"></span>
                </div>

                <button class="botones-inicio-sesion">Iniciar sesión</button>

              </form>
              <button class="botones-inicio-sesion" id="inicio-google">Iniciar sesión con Google</button>
            </section>
        </div> */}
        </div>
      </header>

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
            <div class="tarjeta-perfil">
              <h1 className="titulos-perfil">Mi Perfil</h1>
              <div class="info-perfil">
                <div class="contenedores-info-perfil">
                  <h3 class="titulos-perfil">Usuario</h3>
                  <h3 type="text"
                    id="usuario"
                    name="usuario"
                    value={formData.usuario}
                    onChange={manejarCambio}
                    required>{formData.usuario}</h3>
                </div>
              </div>

              <div class="info-perfil">
                <div class="contenedores-info-perfil">
                  <h3 class="titulos-perfil">Correo Electrónico</h3>
                  <h3>{formData.correo}</h3>
                </div>
              </div>

              <div class="info-perfil">
                <div class="contenedores-info-perfil">
                  <h3 class="titulos-perfil">Contraseña</h3>
                  <h3>******</h3>
                </div>
              </div>
              <div class="botones-perfil">
                <button onClick={() => setSeccionActiva("editar-perfil")}>Editar Perfil</button>
                <button class="botones-inversos">Eliminar Cuenta</button>
              </div>
            </div>
          )}
          {seccionActiva === "editar-perfil" && (
            <div class="tarjeta-perfil">
              <h1 class="titulos-perfil">Mi Perfil</h1>
              <form onSubmit={manejarEnvio}>
                <div class="info-perfil">
                  <div class="contenedores-info-perfil">
                    <h3 class="titulos-perfil">Usuario</h3>
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

                <div class="info-perfil">
                  <div class="contenedores-info-perfil">
                    <h3 class="titulos-perfil">Correo Electrónico</h3>
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

                <div class="info-perfil">
                  <div class="contenedores-info-perfil">
                    <h3 class="titulos-perfil">Contraseña</h3>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={manejarCambio}
                    />
                  </div>
                </div>
                <div class="botones-perfil">
                  <button type="submit">Guardar</button>
                  <button class="botones-inversos">Cancelar</button>
                </div>
              </form>
            </div>
          )}


          {/* {CONTENEDOR RECETAS GUARDADAS} */}
          {seccionActiva === "recetas" && (
            <div className="tarjetas">
              <div className="tarjeta">
                <img src={comida} className="imagen-receta-tarjeta" alt="Receta 1" />
                <h3>Receta 1</h3>
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

              <div className="tarjeta">
                <img src={comida} className="imagen-receta-tarjeta" alt="Receta 1" />
                <h3>Receta 1</h3>
                <img src={bookmark} className="icono-bookmark" alt="Guardar" />
              </div>

              <div className="tarjeta">
                <img src={comida} className="imagen-receta-tarjeta" alt="Receta 1" />
                <h3>Receta 1</h3>
                <img src={bookmark} className="icono-bookmark" alt="Guardar" />
              </div>

              <div className="tarjeta">
                <img src={comida} className="imagen-receta-tarjeta" alt="Receta 1" />
                <h3>Receta 1</h3>
                <img src={bookmark} className="icono-bookmark" alt="Guardar" />
              </div>
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
              <div className="info-basica-receta">
                <div className="apartado-dificultad">
                  <h5>Dificultad</h5>
                  <h5>Selecciona la dificultad</h5>
                  <select
                    name="dificultad"
                    id="nivel-dificultad"
                    value={formRecetaNueva.dificultad}
                    onChange={manejarCambioReceta}
                    required
                  >
                    <option value="" disabled selected>
                      Selecciona una dificultad
                    </option>
                    <option value="facil">Fácil</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="dificil">Difícil</option>
                  </select>
                </div>
                <div className="apartado-tiempo">
                  <h5>Tiempo</h5>
                  <h5>Selecciona el tiempo</h5>
                  <input
                    type="text"
                    name="tiempo"
                    id="tiempo"
                    value={formRecetaNueva.tiempo}
                    onChange={manejarCambioReceta}
                    required
                  />
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
                  {ingredientes.map((ing, index) => (
                    <div key={index} className="rellenar-ingrediente">
                      Nombre Ingrediente:
                      <input
                        type="text"
                        value={ing.nombre}
                        onChange={(e) => handleIngredienteChange(index, 'nombre', e.target.value)}
                      />
                      <span>Cantidad</span>
                      <input
                        type="number"
                        value={ing.cantidad}
                        onChange={(e) => handleIngredienteChange(index, 'cantidad', e.target.value)}
                      />
                      <span>Unidad</span>
                      <input
                        type="text"
                        value={ing.unidad}
                        onChange={(e) => handleIngredienteChange(index, 'unidad', e.target.value)}
                      />
                      <button type="button" onClick={() => handleRemoveIngrediente(index)}>
                        Eliminar
                      </button>
                    </div>
                  ))}
                  <div className="anadir-ingrediente" onClick={handleAddIngrediente}>
                    Añadir Ingrediente
                  </div>
                </div>
              </div>
              <div className="pasos-crear-receta">
                <h5>PASOS</h5>
                {pasos.map((paso, index) => (
                  <div key={index} className="rellenar-pasos">
                    Paso {index + 1}
                    <input
                      type="text"
                      value={paso}
                      onChange={(e) => handlePasoChange(index, e.target.value)}
                    />
                     <button type="button" onClick={() => handleRemovePaso(index)}>
                        Eliminar
                      </button>
                  </div>
                ))}
                <div className="anadir-pasos" onClick={handleAddPaso}>
                  Añadir Paso
                </div>
              </div>
            </div>

            <div className="botones-crear-receta">
              <button
                className="boton-crear-receta"
                id="terminar-receta"
                onClick={manejarEnvioReceta}
              >
                Terminar
              </button>
              <button className="botones-inversos" id="cancelar-receta">
                Cancelar
              </button>
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Offcanvas para Lista de la compra */}
      {
        // <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        //   <div className="offcanvas-header">
        //     <h2 className="offcanvas-title" id="offcanvasExampleLabel">Lista de la Compra</h2>
        //     <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        //   </div>
        //   <div className="offcanvas-body">
        //     <div>
        //       <div>
        //         <h3>Ingredientes</h3>
        //         <ul>
        //           <li>1 kg de carne de res</li>
        //           <li>2 cebollas</li>
        //           <li>1 pimiento rojo</li>
        //           <li>2 dientes de ajo</li>
        //           <li>1 cucharadita de comino</li>
        //           <li>Sal y pimienta al gusto</li>
        //           <li>12 tortillas de maíz</li>
        //         </ul>
        //       </div>
        //     </div>
        //     <div className="botones-lista-compra">
        //       <button>Vaciar Lista</button>
        //       <button className="botones-inversos">Ir a recetas</button>
        //     </div>
        //   </div>
        // </div>
      }
      <Footer />
    </>

    // <div>
    //   <h2>Editar Perfil</h2>
    //   <form onSubmit={manejarEnvio}>
    //     <div>
    //       <label htmlFor="usuario">Usuario:</label>
    //       <input
    //         type="text"
    //         id="usuario"
    //         name="usuario"
    //         value={formData.usuario}
    //         onChange={manejarCambio}
    //         required
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="correo">Correo:</label>
    //       <input
    //         type="email"
    //         id="correo"
    //         name="correo"
    //         value={formData.correo}
    //         onChange={manejarCambio}
    //         required
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="password">Contraseña:</label>
    //       <input
    //         type="password"
    //         id="password"
    //         name="password"
    //         value={formData.password}
    //         onChange={manejarCambio}
    //         required
    //       />
    //     </div>
    //     <button type="submit">Actualizar perfil</button>
    //   </form>
    //   {mensaje && (
    //     <div style={{ color: exito ? 'green' : 'red' }}>
    //       {mensaje}
    //     </div>
    //   )}
    // </div>
  );
};

export default EditarPerfil;

