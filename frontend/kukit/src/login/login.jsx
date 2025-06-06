import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../img/logo_kukit.png';
import { useAuth } from '../logout/AuthContext'; // Importar useAuth

const Login = ({ setShowLogin, setShowRegistro}) => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });

  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth(); // Obtener el contexto de autenticación

  // Cargar script de Google Identity Services dinámicamente
  useEffect(() => {
    if (document.getElementById('google-client-script')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.id = 'google-client-script';

    script.onload = () => setScriptLoaded(true);

    document.body.appendChild(script);

    return () => {
      if (document.getElementById('google-client-script')) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Inicializar botón Google cuando el script está listo
  useEffect(() => {
    if (scriptLoaded && window.google) {
      window.google.accounts.id.initialize({
        client_id: '457729135946-4i3fug0fv5h3p1h8kfmmkhra1dfuvn81.apps.googleusercontent.com',
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { theme: 'outline', size: 'large', width: 300 }
      );

      // Opcional: mostrar el prompt de login Google
      // window.google.accounts.id.prompt();
    }
  }, [scriptLoaded]);

  const handleGoogleResponse = async (response) => {
    console.log('Google ID Token:', response.credential);

    try {
      // Enviar token al backend para validación y login/registro
      const res = await axios.post(
        'http://localhost/api/login/google/login-google.php',
        { id_token: response.credential },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      if (res.data.success) {
        setExito(true);
        setMensaje('Login con Google exitoso');
        // Actualizar el estado de autenticación y esperar
        await auth.checkAuthStatus();
        // Cerrar el modal de login
        if (setShowLogin) {
          setShowLogin(false);
        }
        // Navegar a la página de recetas
        navigate('/recetas'); 
      } else {
        setExito(false);
        setMensaje(res.data.message || 'Error en login con Google');
      }
    } catch (error) {
      setExito(false);
      setMensaje('Error en comunicación con el servidor');
      console.error(error);
    }
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'correo') setErrorEmail('');
    if (name === 'password') setErrorPassword('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'correo') {
      if (!value.trim()) setErrorEmail('El correo no puede estar vacío');
      else if (!/\S+@\S+\.\S+/.test(value)) setErrorEmail('El formato del correo no es válido');
      else setErrorEmail('');
    }
    if (name === 'password') {
      if (!value) setErrorPassword('La contraseña no puede estar vacía');
      else setErrorPassword('');
    }
  };

  const emailRegex = /^\S+@\S+\.\S+$/;

  const manejarEnvio = async (e) => {
    e.preventDefault();
    let formIsValid = true;

    if (!formData.correo.trim()) {
      setErrorEmail('El correo es obligatorio.');
      formIsValid = false;
    } else if (!emailRegex.test(formData.correo)) {
      setErrorEmail('El formato del correo no es válido.');
      formIsValid = false;
    }

    if (!formData.password) {
      setErrorPassword('La contraseña es obligatoria.');
      formIsValid = false;
    }

    if (!formIsValid) return;

    try {
      const respuesta = await axios.post(
        'http://localhost/api/login/login.php',
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (respuesta.data.success) {
        setExito(true);
        setMensaje(respuesta.data.message);
        // Actualizar el estado de autenticación y esperar
        await auth.checkAuthStatus();
        // Cerrar el modal de login
        if (setShowLogin) {
          setShowLogin(false);
        }
        // Navegar a la página de recetas
        navigate('/recetas'); 
      } else {
        setExito(false);
        setMensaje(respuesta.data.message || 'Correo o contraseña incorrectos.');
      }
    } catch (error) {
      setExito(false);
      setMensaje(error.response?.data?.message || 'Hubo un error al procesar la solicitud.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="pop-up-sign-up">
      <section className="contenedor-sign-in" id="contenedor-sign-in">
        <figure>
          <a href="/">
            <img src={logo} alt="Logo de Kukit" />
          </a>
        </figure>

        <h1>INICIAR SESIÓN</h1>
        <hr className="linea-inicio-sesion" />
        <hr />

        <form onSubmit={manejarEnvio} className='formulario-inicio-sesion'>
          <div className="contenedor-email-password">
            <label htmlFor="correo" className="mail">Correo electrónico:</label>
            <input
              type="email"
              name="correo"
              id="correo"
              value={formData.correo}
              onChange={manejarCambio}
              onBlur={handleBlur}
            />
            {errorEmail && (
              <span className="error" style={{ color: 'red', display: 'block', minHeight: '1em' }}>
                {errorEmail}
              </span>
            )}
          </div>

          <div className="contenedor-email-password">
            <label htmlFor="password" className="password-sign-in">Contraseña:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={manejarCambio}
              onBlur={handleBlur}
            />
            {errorPassword && (
              <span className="error" style={{ color: 'red', display: 'block', minHeight: '1em' }}>
                {errorPassword}
              </span>
            )}
          </div>

          <button type="submit" className="botones-inicio-sesion">
            Iniciar sesión
          </button>
        </form>

        <hr style={{ margin: '1rem 0' }} />

        <div id="googleSignInButton"></div>

        <p>¿No tienes cuenta?</p>

        <button type="submit" className="botones-inversos" onClick={() => {
            setShowLogin(false);
            setShowRegistro(true);
          }}>
            Crear Cuenta
          </button>

        {mensaje && (
          <p style={{ color: exito ? 'green' : 'red', marginTop: '1rem' }}>{mensaje}</p>
        )}

        <button type="button" onClick={() => setShowLogin(false)}>
          Cerrar
        </button>
      </section>
    </div>
  );
};

export default Login;
