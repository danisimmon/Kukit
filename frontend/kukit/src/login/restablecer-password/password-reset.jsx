import React, { useState } from 'react';
import axios from 'axios';
import Header from '../../header/header';

const PasswordReset = () => {
  const [formData, setFormData] = useState({
    correo: ''
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
      const respuesta = await axios.post('http://localhost/api/login/password-reset/password-reset.php', formData, {
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
      <Header />
      <main>
        <div className="form-container">
          <form onSubmit={manejarEnvio} className="form-box">
            <div className="form-group">
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
            <button type="submit" className="submit-button">
              Restablecer contraseña
            </button>
            {mensaje && (
              <div className={`mensaje ${exito ? 'mensaje-exito' : 'mensaje-error'}`}>
                {mensaje}
              </div>
            )}
          </form>
        </div>

      </main>
    </>

  );
};

export default PasswordReset;