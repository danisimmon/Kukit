import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const [mensaje, setMensaje] = useState('');
    const [exito, setExito] = useState(false);
    const navigate = useNavigate();

    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await axios.post('http://localhost/api/login/logout.php', {}, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (respuesta.data.success) {
                setExito(true);
                setMensaje(respuesta.data.message);
                navigate('/home');
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
        <form onSubmit={manejarEnvio}>
            <button type="submit">Cerrar sesión</button>
            {mensaje && <p>{mensaje}</p>}
        </form>
    );
};

export default Logout;