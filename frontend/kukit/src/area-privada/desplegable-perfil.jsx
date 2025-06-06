import React, {useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useAuth } from '../logout/AuthContext';

const DesplegablePerfil = ({ showDesplegablePerfil, setDesplegablePerfil }) => {
    const navigate = useNavigate();
    const offcanvasRef = useRef();
    const bsOffcanvasRef = useRef(null);
    const auth = useAuth();

    useEffect(() => {
        if (!offcanvasRef.current || !window.bootstrap?.Offcanvas) return;

        if (!bsOffcanvasRef.current) {
            bsOffcanvasRef.current = new window.bootstrap.Offcanvas(offcanvasRef.current);

            offcanvasRef.current.addEventListener("hidden.bs.offcanvas", () => {
                setDesplegablePerfil(false);
            });
        }

        if (showDesplegablePerfil) {
            bsOffcanvasRef.current.show();
        } else {
            bsOffcanvasRef.current?.hide();
        }

    }, [showDesplegablePerfil]);

    const navegarYCerrar = (path, state) => {
        bsOffcanvasRef.current?.hide();
        setTimeout(() => {
            navigate(path, { state });
        }, 150);
        setDesplegablePerfil(false);
    };

    const editarPerfil = () => {
        navegarYCerrar("/area-privada/editar-perfil", { seccion: "perfil" });
    };
    const crearReceta = () => {
        navegarYCerrar("/area-privada/editar-perfil", { seccion: "crear" });
    };
    const verRecetas = () => {
        navegarYCerrar("/area-privada/editar-perfil", { seccion: "recetas" });
    };

    const cerrarSesion = () => {
        axios
            .get("http://localhost/api/login/gestion-autenticacion/logout.php", {
                withCredentials: true,
            })
            .then((response) => {
                if (response.data.success) {
                    auth.logout();
                    
                    bsOffcanvasRef.current?.hide();
                    setTimeout(() => {
                        navigate("/home");
                    }, 150);
                    setDesplegablePerfil(false);
                } else {
                    setDesplegablePerfil(false);
                }
            })
            .catch((error) => {
                setDesplegablePerfil(false);
            })
            .finally(() => {
            });
    };

    return (
        <>
            <div
                ref={offcanvasRef}
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="perfil-offcanvasExample"
                aria-labelledby="offcanvasExampleLabel"
            >
                <div className="offcanvas-header">
                    <h2 className="offcanvas-title" id="offcanvasExampleLabel">
                        Mi perfil
                    </h2>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        onClick={() => setDesplegablePerfil(false)}
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <p className="perfil-titulo">Mi perfil</p>
                    <ul className="perfil-opciones">
                        <li onClick={editarPerfil}>Editar perfil</li>
                        <li onClick={crearReceta}>Crear receta</li>
                        <li onClick={verRecetas}>Recetas creadas</li>
                        <li onClick={cerrarSesion}>Salir</li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default DesplegablePerfil;