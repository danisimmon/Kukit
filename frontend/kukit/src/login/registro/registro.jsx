import React, { useState, useEffect } from 'react';
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

  const navigate = useNavigate();
  const auth = useAuth();

  // Cargar script de Google Identity Services dinámicamente
  useEffect(() => {
    if (document.getElementById('google-client-script-registro')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.id = 'google-client-script-registro';

    script.onload = () => setScriptLoaded(true);

    document.body.appendChild(script);

    return () => {
      if (document.getElementById('google-client-script-registro')) {
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
        document.getElementById('googleSignUpButton'),
        { theme: 'outline', size: 'large', width: 300 }
      );
    }
  }, [scriptLoaded]);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await axios.post(
        'http://localhost/api/login/google/registro-google.php',
        { id_token: response.credential },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

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
  };

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
    <div className="pop-up-sign-up">
      <section className="contenedor-sign-up">
        <figure>
          <a href="/">
            <img src={logo} alt="Logo de Kukit" />
          </a>
        </figure>

        <h1>CREAR CUENTA</h1>
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

        <div id="googleSignUpButton"></div>

        <p>¿Ya tienes cuenta?</p>
        <button type="button" className="botones-inicio-sesion" id="inicio-google" onClick={() => {
          setShowRegistro(false);
          setShowLogin(true);
        }}>Iniciar sesión</button>
        <hr />
        <button type="button" onClick={() => setShowRegistro(false)}>Cerrar</button>
        {mensaje && (
          <p style={{ color: exito ? 'green' : 'red', marginTop: '1rem' }}>{mensaje}</p>
        )}
      </section>
    </div>
  );
};

export default Registro;