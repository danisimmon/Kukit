import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });

  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrorEmail('');
    setErrorPassword('');

    if (!formData.correo) {
      setErrorEmail('El correo es obligatorio');
    }
    if (!formData.password) {
      setErrorPassword('La contraseña es obligatoria');
    }

    if (!formData.correo || !formData.password) return;

    try {
      const respuesta = await axios.post('http://localhost/api/login/login.php', formData, {
        headers: { 'Content-Type': 'application/json' },
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
    <section className="contenedor-sign-in" id="contenedor-sign-in">
      <figure>
        <a href="/">
          <img src="img/logo_kukit.png" alt="Logo de Kukit" />
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
          />
          <span className="error">{errorEmail}</span>
        </div>

        <div className="contenedor-email-password">
          <label htmlFor="password" className="password-sign-in">Contraseña:</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={manejarCambio}
          />
          <span className="error">{errorPassword}</span>
        </div>

        <button type="submit" className="botones-inicio-sesion">
          Iniciar sesión
        </button>
      </form>

      <button className="botones-inicio-sesion" id="inicio-google">
        Iniciar sesión con Google
      </button>

      {mensaje && (
        <p style={{ color: exito ? 'green' : 'red', marginTop: '1rem' }}>{mensaje}</p>
      )}
    </section>
  );
};

export default Login;
