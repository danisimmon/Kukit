import React, { useState } from 'react';
import axios from 'axios';
import logo from '../../img/logo_kukit.png';


const EditarPerfil = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    correo: '',
    password: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);

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
  React.useEffect(() => {
    obtenerDatosUsuario();
  }, []);

  // Manejar el envío del formulario
  const manejarEnvio = async (e) => {
    e.preventDefault();
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
        <div id="pop-up"></div>
      </header>

      <div className="container">
        <div className="titulo-pagina">
          <ul>
            <li><h4 className="numero-recetas">Mi Perfil</h4></li>
            <div className="linea-vertical"></div>
            <li><h4 className="numero-recetas">Recetas creadas</h4></li>
            <div className="linea-vertical"></div>
            <li><h4 className="numero-recetas">Crear Receta</h4></li>
          </ul>
        </div>

        <div className="crear-receta">
          <div className="crear-receta-info">
            <h3>Nombre de la Receta</h3>
            <div className="info-basica-receta">
              <div className="apartado-dificultad">
                <h5>Dificultad</h5>
                <img src="" alt="grado de dificultad" />
                <h5>Selecciona la dificultad</h5>
                <select name="nivel-dificultad" id="nivel-dificultad">
                  <option value="facil">Fácil</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="dificil">Difícil</option>
                </select>
              </div>
              <div className="apartado-tiempo">
                <h5>Tiempo</h5>
                <img src="" alt="tiempo" />
                <h5>Selecciona el tiempo</h5>
                <input type="text" name="tiempo" id="tiempo" />
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
                <div className="rellenar-ingrediente">Nombre Ingrediente <span>Cantidad</span></div>
                <div className="anadir-ingrediente">Añadir Ingrediente <img src="" alt="icono-más" /></div>
              </div>
            </div>
            <div className="pasos-crear-receta">
              <h5>PASOS</h5>
              <div className="rellenar-pasos">Paso 1</div>
              <div className="anadir-pasos">Añadir Paso <img src="" alt="icono-más" /></div>
            </div>
          </div>

          <div className="botones-crear-receta">
            <button className="boton-crear-receta" id="terminar-receta">Terminar</button>
            <button className="botones-inversos" id="cancelar-receta">Cancelar</button>
          </div>
        </div>
      </div>

      {/* Offcanvas para Lista de la compra */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <h2 className="offcanvas-title" id="offcanvasExampleLabel">Lista de la Compra</h2>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
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
            </div>
          </div>
          <div className="botones-lista-compra">
            <button>Vaciar Lista</button>
            <button className="botones-inversos">Ir a recetas</button>
          </div>
        </div>
      </div>

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