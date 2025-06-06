import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../img/logo_kukit.png';
import { useAuth } from '../../logout/AuthContext'; // Importar useAuth
import Login from '../login';

const Registro = ({ setShowRegistro, setShowLogin  }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    correo: '',
    password: '',
    recordarme: false // Asegúrate de que este campo esté en el estado si lo usas
  });


  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);
  const [errorUsuario, setErrorUsuario] = useState('');
  const [errorCorreo, setErrorCorreo] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const navigate = useNavigate();
  const auth = useAuth(); // Obtener el contexto de autenticación

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevFormData => ({ // Usar el callback para asegurar el estado previo correcto
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    // Resetear errores
    setErrorUsuario('');
    setErrorCorreo('');
    setErrorPassword('');
    setMensaje(''); // También reseteamos el mensaje general

    let esValido = true;
    if (!formData.usuario.trim()) { // Añadido .trim() para evitar espacios en blanco
      setErrorUsuario('El nombre de usuario es obligatorio');
      esValido = false;
    }
    if (!formData.correo.trim()) {
      setErrorCorreo('El correo electrónico es obligatorio');
      esValido = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) { // Validación básica de formato de email
      setErrorCorreo('El formato del correo electrónico no es válido');
      esValido = false;
    }
    if (!formData.password) { // Para contraseñas, no se suele usar .trim()
      setErrorPassword('La contraseña es obligatoria');
      esValido = false;
    }
    // Aquí podrías añadir más validaciones, como longitud mínima de contraseña, etc.

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
        // console.log('Usuario:', respuesta.data.user); // Puedes descomentar para depuración

        // Actualizar el estado de autenticación y esperar
        await auth.checkAuthStatus();
        // Cerrar el modal de registro
        if (setShowRegistro) {
          setShowRegistro(false);
        }
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
    <>
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

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="recordarme"
                id="recordarme"
                checked={formData.recordarme}
                onChange={manejarCambio}
              />
              <span>Recordarme</span>
            </label>

            <p className="aceptar-terminos">
              Al hacer clic en «Aceptar y crear cuenta», aceptas las <b><u>Condiciones de uso</u></b>, la <b><u>Política de privacidad</u></b> y la <b><u>Política de cookies</u></b> de Kukit.
            </p>

            <button type="submit" className="botones-inicio-sesion">Aceptar y crear cuenta</button>
          </form>

          {mensaje && (
            <p style={{ color: exito ? 'green' : 'red', marginTop: '1rem' }}>{mensaje}</p>
          )}

          <p>¿Ya tienes cuenta?</p>
          {/* Este botón debería probablemente abrir el pop-up de Login en lugar de ser un submit */}
          <button type="button" className="botones-inicio-sesion" id="inicio-google" onClick={() => {
            setShowRegistro(false);
            setShowLogin(true);
          }}>Iniciar sesión</button>
          <hr />
          <button type="button" onClick={() => setShowRegistro(false)}>Cerrar</button>
        </section>
      </div>
    </>
  );
};

export default Registro;
