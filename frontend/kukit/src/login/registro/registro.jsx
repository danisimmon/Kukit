import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../img/logo_kukit.png';
import { useAuth } from '../../logout/AuthContext';

const Registro = ({ setShowRegistro, setShowLogin }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    correo: '',
    password: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);
  const [errorUsuario, setErrorUsuario] = useState('');
  const [errorCorreo, setErrorCorreo] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const googleSignUpButtonRef = useRef(null); // Cambiado de googleSignInButtonRef a googleSignUpButtonRef


  const navigate = useNavigate();
  const auth = useAuth();

  // Cargar script de Google Identity Services dinámicamente
  useEffect(() => {
    // Usar el mismo ID que en login.jsx para asegurar que se cargue una sola vez.
    const scriptId = 'google-client-script';
    if (document.getElementById(scriptId)) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.id = scriptId;

    script.onload = () => setScriptLoaded(true);

    document.body.appendChild(script);
  }, []); // Eliminadas dependencias innecesarias como auth, navigate, setShowLogin

  const handleGoogleRegisterResponse = useCallback(async (response) => { // Renombrada la función
    try {
      "../../../../../backend/api/login/google/login-google.php"
      const res = await axios.post('http://localhost/api/login/google/login-google.php', { id_token: response.credential }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true });

      if (res.data.success) {
        setExito(true);
        setMensaje('Registro con Google exitoso');
        await auth.checkAuthStatus();
        if (setShowRegistro) setShowRegistro(false);
        navigate('/recetas');
      } else {
        setExito(false);
        setMensaje(res.data.message || 'Error en registro con Google');
      }
    } catch (error) {
      setExito(false);
      setMensaje('Error en comunicación con el servidor');
      console.error(error);
    }
  }, [auth, navigate, setShowRegistro]); // Ajustada la dependencia

  // Inicializar botón Google cuando el script está listo y el div está disponible
  useEffect(() => {
    if (scriptLoaded && window.google && window.google.accounts && window.google.accounts.id) {
      if (googleSignUpButtonRef.current && googleSignUpButtonRef.current.childNodes.length === 0) {
        try {
          window.google.accounts.id.initialize({
            client_id: '457729135946-4i3fug0fv5h3p1h8kfmmkhra1dfuvn81.apps.googleusercontent.com',
            callback: handleGoogleRegisterResponse, // Usar la función renombrada
          });
          window.google.accounts.id.renderButton(
            googleSignUpButtonRef.current, // Usar la ref correcta
            { theme: 'outline', size: 'large', width: 300 }
          );
        } catch (error) {
          console.error("Error initializing or rendering Google Sign-Up button:", error); // Mensaje de error específico
          setMensaje("Error al cargar el botón de Google.");
        }
      }
    }
  }, [scriptLoaded, handleGoogleRegisterResponse]); // Usar la callback correcta en dependencias


  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrorUsuario('');
    setErrorCorreo('');
    setErrorPassword('');
    setMensaje('');

    let esValido = true;
    if (!formData.usuario.trim()) {
      setErrorUsuario('El nombre de usuario es obligatorio');
      esValido = false;
    }
    if (!formData.correo.trim()) {
      setErrorCorreo('El correo electrónico es obligatorio');
      esValido = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      setErrorCorreo('El formato del correo electrónico no es válido');
      esValido = false;
    }
    if (!formData.password) {
      setErrorPassword('La contraseña es obligatoria');
      esValido = false;
    }

    if (!esValido) return;

    try {
      const respuesta = await axios.post('http://localhost/api/login/registro/registro.php', formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (respuesta.data.success) {
        setExito(true);
        setMensaje(respuesta.data.message);
        await auth.checkAuthStatus();
        if (setShowRegistro) setShowRegistro(false);
        navigate('/recetas');
      } else {
        setExito(false);
        setMensaje(respuesta.data.message || 'Error desconocido al registrar.');
      }
    } catch (error) {
      setExito(false);
      setMensaje(error.response?.data?.message || 'Hubo un error al procesar la solicitud.');
      console.error('Error:', error);
    }
  };

  return (
    <div
      className="pop-up-sign-up"
      onClick={() => setShowRegistro(false)}
      style={{ zIndex: 300 }}
    >
      <section
        className="contenedor-sign-up"
        onClick={e => e.stopPropagation()}
        style={{ position: 'relative' }}
      >
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 2 }}
          onClick={() => setShowRegistro(false)}
        ></button>
        <figure>
          <a href="/">
            <img src={logo} alt="Logo de Kukit" />
          </a>
        </figure>

        <h1>Crear cuenta</h1>
        <hr className="linea-inicio-sesion" />

        <form onSubmit={manejarEnvio}>
          <div>
            <label htmlFor="usuario">Nombre de usuario:</label>
            <input
              type="text"
              name="usuario"
              id="usuario"
              value={formData.usuario}
              onChange={manejarCambio}
            />
            <span className="error" style={{ color: 'red', display: 'block', marginBottom: '10px', minHeight: '1em' }}>{errorUsuario}</span>
          </div>

          <div>
            <label htmlFor="correo">Correo electrónico:</label>
            <input
              type="email"
              name="correo"
              id="correo"
              value={formData.correo}
              onChange={manejarCambio}
            />
            <span className="error" style={{ color: 'red', display: 'block', marginBottom: '10px', minHeight: '1em' }}>{errorCorreo}</span>
          </div>

          <div>
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={manejarCambio}
            />
            <span className="error" style={{ color: 'red', display: 'block', marginBottom: '10px', minHeight: '1em' }}>{errorPassword}</span>
          </div>

          <p className="aceptar-terminos">
            Al hacer clic en «Aceptar y crear cuenta», aceptas las <b><u>Condiciones de uso</u></b>, la <b><u>Política de privacidad</u></b> y la <b><u>Política de cookies</u></b> de Kukit.
          </p>

          <button type="submit" className="botones-inicio-sesion">Aceptar y crear cuenta</button>
        </form>

        <hr style={{ margin: '1rem 0' }} />

        <div id="googleSignUpButton" ref={googleSignUpButtonRef}></div>


        <p>¿Ya tienes cuenta?</p>
        <button
          type="button"
          className="botones-inversos"
          onClick={() => {
            setShowRegistro(false);
            setShowLogin(true);
          }}
        >
          Iniciar sesión
        </button>
        {mensaje && (
          <p style={{ color: exito ? 'green' : 'red', marginTop: '1rem' }}>{mensaje}</p>
        )}
      </section>
    </div>
  );
};

export default Registro;
