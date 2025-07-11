import React, { useState } from 'react';
import axios from 'axios';
import Header from '../../header/header';

const NuevaPassword = () => {
    const [formData, setFormData] = useState({
        token: '',
        codigo_verificacion: '',
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
    const obtenerTokenURL = async () => {
        // Recibimos el parametro de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        setFormData({
            ...formData,
            token: token || ''
        });
    };

    // Cargar los datos del usuario al montar el componente
    React.useEffect(() => {
        obtenerTokenURL();
    }, []);

    const manejarEnvio = async (e) => {
        e.preventDefault();

        try {
            const respuesta = await axios.post('http://localhost/api/login/password-reset/nuevo-password.php', formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (respuesta.data.success) {
                setExito(true);
                setMensaje(respuesta.data.message);
                // Redirigir al usuario a la página de inicio de sesión o donde sea necesario
                setTimeout(() => {
                    window.location.href = '/home'; // Redirigir a la página de inicio
                }, 2000); // Esperar 2 segundos antes de redirigir
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
                            {/* <label htmlFor="token">Token:</label> */}
                            <input
                                type="text"
                                id="token"
                                name="token"
                                value={formData.token}
                                onChange={manejarCambio}
                                hidden
                                required
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="codigo_verificacion">Código de verificación:</label>
                            <input
                                type="number"
                                id="codigo_verificacion"
                                name="codigo_verificacion"
                                value={formData.codigo_verificacion}
                                onChange={manejarCambio}
                                min="100000"
                                max="999999"
                                required
                                placeholder="Código de verificación"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Nueva contraseña:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={manejarCambio}
                                required
                                placeholder="Nueva contraseña"
                            />
                        </div>
                        <button type="submit" className="submit-button">Restablecer contraseña</button>
                    </form>
                    {mensaje && (
                        <div className={`mensaje ${exito ? 'mensaje-exito' : 'mensaje-error'}`}>
                            {mensaje}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default NuevaPassword;