import React, { useState } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Editar Perfil</h2>
      <form onSubmit={manejarEnvio}>
        <div>
          <label htmlFor="usuario">Usuario:</label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            value={formData.usuario}
            onChange={manejarCambio}
            required
          />
        </div>
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
        <button type="submit">Actualizar perfil</button>
      </form>
      {mensaje && (
        <div style={{ color: exito ? 'green' : 'red' }}>
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default EditarPerfil;