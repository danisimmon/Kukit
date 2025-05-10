import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
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

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await axios.post('localhost/api/login/login.php', formData, {
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
    <div>
      <form onSubmit={manejarEnvio}>
        <div>
          <label htmlFor="correo">Correo:</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={manejarCambio}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={manejarCambio}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      {mensaje && (
        <div style={{ color: exito ? 'green' : 'red' }}>
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default Login;