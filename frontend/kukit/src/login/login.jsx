import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../img/logo_kukit.png';

const Login = ({ setShowLogin }) => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });

  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);

  const navigate = useNavigate(); // Hook para redirección

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores específicos del campo al escribir
    if (name === 'correo') {
      setErrorEmail('');
    }
    if (name === 'password') {
      setErrorPassword('');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'correo' && !value.trim()) {
      setErrorEmail('El correo no puede estar vacío');
    }
    if (name === 'password' && !value) { // Para password no se suele usar trim
      setErrorPassword('La contraseña no puede estar vacía');
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    let formIsValid = true;

    // Validar campos vacíos al enviar, por si el usuario no interactuó (onBlur)
    if (!formData.correo.trim()) {
      setErrorEmail('El correo es obligatorio');
      formIsValid = false;
    }
    if (!formData.password) {
      setErrorPassword('La contraseña es obligatoria');
      formIsValid = false;
    }

    if (!formIsValid) {
      return;
    }
    // Si llegamos aquí, los campos obligatorios tienen algún valor (la validación de formato/existencia se hace en el backend)

    try {
      const respuesta = await axios.post('http://localhost/api/login/login.php', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (respuesta.data.success) {
        setExito(true);
        setMensaje(respuesta.data.message);
        console.log('Usuario:', respuesta.data.user);
        // Aquí podrías guardar el usuario en el contexto o estado global si es necesario
        navigate('/recetas'); // Redirige a la página de recetas
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

        <form onSubmit={manejarEnvio}>
          <div className="contenedor-email-password">
            <label htmlFor="correo" className="mail">Correo electrónico:</label>
            <input
              type="email"
              name="correo"
              id="correo"
              value={formData.correo}
              onChange={manejarCambio}
              onBlur={handleBlur} // Añadido onBlur
            />
      <span className="error" style={{ color: 'red', display: 'block', minHeight: '1em'  }}>{errorEmail}</span>
      </div>

          <div className="contenedor-email-password">
            <label htmlFor="password" className="password-sign-in">Contraseña:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={manejarCambio}
              onBlur={handleBlur} // Añadido onBlur
            />
            <span className="error" style={{ color: 'red', display: 'block', minHeight: '1em' }}>{errorPassword}</span>
          </div>

          <button type="submit" className="botones-inicio-sesion">
            Iniciar sesión
          </button>
        </form>

        <button type="button" className="botones-inicio-sesion" id="inicio-google">
          Iniciar sesión con Google
        </button>

        {mensaje && (
          <p style={{ color: exito ? 'green' : 'red', marginTop: '1rem' }}>{mensaje}</p>
        )}
        <button type="button" onClick={() => setShowLogin(false)}>Cerrar</button>
      </section>
    </div>
  );
};

export default Login;
