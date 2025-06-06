import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Importar useAuth

const Logout = () => {
    const [mensaje, setMensaje] = useState('');
    const [setExito] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth(); // Obtener el contexto de autenticación

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
                auth.logout();
                navigate('/home');
            } else {
                setExito(false);
                setMensaje(respuesta.data.message);
            }
        } catch (error) {
            setExito(false);
            setMensaje('Hubo un error al procesar la solicitud.');
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