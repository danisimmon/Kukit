import React, { useState } from 'react';
import axios from 'axios';
import Header from '../../header/header';

const PasswordReset = () => {
  const [formData, setFormData] = useState({
    correo: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);
  const [showModal, setShowModal] = useState(false); 

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensaje(''); 
    setExito(false);
    setShowModal(false); 

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
        setShowModal(true);
        console.log('Usuario:', respuesta.data.user);
      } else {
        setExito(false);
        setMensaje(respuesta.data.message);
        setShowModal(true);
      }
    } catch (error) {
      setExito(false);
      setMensaje('Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo.');
      setShowModal(true); 
      console.error('Error:', error);
    }
  };

  const handleCloseModal = () => setShowModal(false);

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
          </form>
        </div>

        {/* Bootstrap Modal */}
        {showModal && (
          <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{exito ? 'Restablecimiento Exitoso' : 'Error'}</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  <p className={exito ? 'text-success' : 'text-danger'}>{mensaje}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default PasswordReset;