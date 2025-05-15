import React, { useState } from 'react';
import axios from 'axios';

const EditarPerfil = () => {
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(''); // 'success' o 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/ruta/al/php/editar-perfil.php', {
        usuario,
        correo,
        password
      });

      const data = response.data;
      setMensaje(data.message);
      setTipoMensaje(data.success ? 'success' : 'error');

    } catch (error) {
      setMensaje('Error en la conexión con el servidor.');
      setTipoMensaje('error');
      console.error(error);
    }
  };

  return (
    <div className="editar-perfil">
      <h2>Editar Perfil</h2>
      {mensaje && (
        <div className={`mensaje ${tipoMensaje}`}>
          {mensaje}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Correo electrónico</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nueva contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
};

export default EditarPerfil;
