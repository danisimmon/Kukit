import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../img/logo_kukit.png';

const Registro = ({ setShowRegistro }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    correo: '',
    password: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);

  const navigate = useNavigate();

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
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
        console.log('Usuario:', respuesta.data.user);

        navigate('/recetas');
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
            <label htmlFor="correo">Correo electrónico:</label>
            <input
              type="email"
              name="correo"
              id="correo"
              value={formData.correo}
              onChange={manejarCambio}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={manejarCambio}
              required
            />
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
          <p style={{ color: exito ? 'green' : 'red' }}>{mensaje}</p>
        )}

        <p>¿Ya tienes cuenta?</p>
        <button className="botones-inicio-sesion" id="inicio-google">Iniciar sesión</button>
        <hr />
        <button onClick={() => setShowRegistro(false)}>Cerrar</button>
      </section>
    </div>
  );
};

export default Registro;