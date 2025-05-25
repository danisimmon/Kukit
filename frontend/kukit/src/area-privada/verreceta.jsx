import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logo from '../img/logo_kukit.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import CorazonRelleno from '../img/corazonRelleno.png'
import CorazonSinRelleno from '../img/corazonSinRelleno.png'
import NoFavorito from '../img/bookmark.png'
import Favorito from '../img/bookmark-relleno.png'
import dificultadIcon from '../img/velocidad.png';
import tiempoIcon from '../img/tiempo.png';
import Login from '../login/login';
import Registro from '../login/registro/registro';
import Footer from '../footer/footer';
import ListaCompra from '../listaCompra/listaCompra';
import Header from '../header/header';
import { useParams, useNavigate } from 'react-router-dom'; // Importar useNavigate
// import ImagenReceta from 'http://localhost/api/img/recetas/pasta-al-pesto.jpg';

const VerReceta = () => {
    const [receta, setReceta] = useState(null);
    const [raciones, setRaciones] = useState(2);
    // Estado para la paginación de los pasos
    const [paginaPasosActual, setPaginaPasosActual] = useState(1);
    const PASOS_POR_PAGINA = 1; // Mostrar un paso a la vez

    const { recetaId } = useParams(); // Obtener recetaId de los parámetros de la URL
    const navigate = useNavigate(); // Hook para la navegación

    useEffect(() => {
        axios.get('http://localhost/api/area_privada/recetas/getRecetas.php') // Ajusta esta URL a la tuya
            .then(res => {
                if (res.data.success) {
                    const recetaSeleccionada = res.data.recetas.find(r => r._id === recetaId);
                    setReceta(recetaSeleccionada);
                }
            })
            .catch(err => {
                console.error('Error al obtener recetas:', err);
            });
        setPaginaPasosActual(1); // Resetear la paginación de pasos si cambia la receta
    }, [recetaId]);

    const ajustarRaciones = (cambio) => {
        setRaciones(prev => Math.max(1, prev + cambio));
    };

    // Lógica de paginación de pasos
    const totalPaginasPasos = receta ? Math.ceil(receta.pasos.length / PASOS_POR_PAGINA) : 0;
    const indexUltimoPaso = paginaPasosActual * PASOS_POR_PAGINA;
    const indexPrimerPaso = indexUltimoPaso - PASOS_POR_PAGINA;
    const pasosEnPaginaActual = receta ? receta.pasos.slice(indexPrimerPaso, indexUltimoPaso) : [];

    const cambiarPaginaPasos = (numero) => {
        if (numero >= 1 && numero <= totalPaginasPasos) {
            setPaginaPasosActual(numero);
        }
    };

    // Función para renderizar los números de página de los pasos con elipsis
    const renderNumerosPaginaPasos = () => {
        const items = [];
        const maxPaginasVisibles = 3; // Máximo de números de página visibles (ej. 1 ... 5 6 7 ... 10)
        let inicio = Math.max(1, paginaPasosActual - Math.floor(maxPaginasVisibles / 2));
        let fin = Math.min(totalPaginasPasos, inicio + maxPaginasVisibles - 1);

        if (fin - inicio + 1 < maxPaginasVisibles && inicio > 1) {
            inicio = Math.max(1, fin - maxPaginasVisibles + 1);
        }

        if (inicio > 1) {
            items.push(<li key="start-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
        }

        for (let i = inicio; i <= fin; i++) {
            items.push(
                <li key={i} className={`page-item ${paginaPasosActual === i ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => cambiarPaginaPasos(i)}>
                        {i}
                    </button>
                </li>
            );
        }

        if (fin < totalPaginasPasos) {
            items.push(<li key="end-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
        }
        return items;
    };

    const handleVerComoTexto = () => {
        if (recetaId) {
            navigate(`/area-privada/verrecetaportexto/${recetaId}`);
        }
    };


    if (!receta) return <p className="text-center mt-5">Cargando receta...</p>;
    // Eliminamos el console.log(receta) que estaba aquí para limpiar.
    // Si necesitas depurar, puedes volver a añadirlo temporalmente.
    // console.log(receta);




    return (
        <>
            <Header />
            <div className="container mt-4">
                <h4>Recetas Guardadas <span className="text-danger">| {receta.nombre}</span></h4>

                <button
                    className="btn btn-outline-secondary mt-2 mb-3"
                    onClick={handleVerComoTexto}
                >
                    Ver como Texto
                </button>

                <div className="d-flex flex-column flex-md-row gap-4 mt-4">
                    <div className="text-center">
                        <img src={receta.href} alt={receta.nombre} className="img-fluid rounded shadow" style={{ maxWidth: '300px' }} />
                        <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                            <button className="btn btn-danger" onClick={() => ajustarRaciones(-1)}>-</button>
                            <span className="fs-4">{raciones}</span>
                            <button className="btn btn-danger" onClick={() => ajustarRaciones(1)}>+</button>
                        </div>
                        <p className="mt-2">Raciones</p>
                    </div>

                    <div className="flex-fill">
                        <h3>{receta.nombre}</h3>
                        <div className="d-flex gap-4">
                            <div>
                                <p className="mb-1 fw-bold">Dificultad</p>
                                <img src={dificultadIcon} alt="Icono de dificultad" />
                                <p>{receta.dificultad}</p>
                            </div>
                            <div>
                                <p className="mb-1 fw-bold">Tiempo</p>
                                <img src={tiempoIcon} alt="Icono de tiempo" />
                                <p>{receta.tiempo_estimado}</p>
                            </div>
                        </div>

                        <div className="row mt-4">
                            {/* Columna Izquierda: Ingredientes e Información Nutricional */}
                            <div className="col-md-5">
                                <div className="mb-4">
                                    <h5>INGREDIENTES</h5>
                                    <div className="d-flex flex-column gap-3">
                                        {receta.ingredientes.map((ing, idx) => {
                                            const cantidadBase = ing.cantidad || 0;
                                            const racionesBase = receta.raciones_originales || 1;
                                            const cantidadFinal = (cantidadBase * raciones) / racionesBase;

                                            return (
                                                <div key={idx} className="bg-white rounded shadow-sm p-3">
                                                    {ing.nombre}: {cantidadFinal.toFixed(2)} {ing.unidad}
                                                </div>
                                            );
                                        })}
                                        {/* Asumiendo que receta.raciones_originales existe o es un valor base como 1 */}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h5>INFORMACIÓN NUTRICIONAL POR RACIÓN</h5>
                                    <div className="row g-3 mt-2">
                                        <div className="col-12"> {/* Usar col-12 para que apilen bien en esta columna */}
                                            <div className="bg-white rounded shadow-sm p-3">
                                                <strong>Calorías:</strong> {receta.nutricion?.calorias}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="bg-white rounded shadow-sm p-3">
                                                <strong>Proteína:</strong> {receta.nutricion?.proteina}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="bg-white rounded shadow-sm p-3">
                                                <strong>Grasa:</strong> {receta.nutricion?.grasa}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="bg-white rounded shadow-sm p-3">
                                                <strong>Carbohidratos:</strong> {receta.nutricion?.carbohidratos}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="bg-white rounded shadow-sm p-3">
                                                <strong>Fibra:</strong> {receta.nutricion?.fibra}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha: Pasos y Paginación */}
                            <div className="col-md-7">
                                <h5>PASOS</h5>
                                <div className="d-flex flex-column gap-3 mb-3">
                                    {pasosEnPaginaActual.map((paso, idx) => (
                                        <div key={indexPrimerPaso + idx} className="d-flex align-items-start bg-white rounded shadow-sm p-3">
                                            <span className="badge bg-dark me-3 fs-6" style={{ minWidth: "30px", height: "30px", lineHeight: "20px" }}>{indexPrimerPaso + idx + 1}</span>
                                            <span>{paso}</span>
                                        </div>
                                    ))}
                                </div>
                                {totalPaginasPasos > 1 && (
                                    <nav>
                                        <ul className="pagination justify-content-center">
                                            <li className={`page-item ${paginaPasosActual === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => cambiarPaginaPasos(paginaPasosActual - 1)}>&lt;</button>
                                            </li>
                                            {renderNumerosPaginaPasos()}
                                            <li className={`page-item ${paginaPasosActual === totalPaginasPasos ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => cambiarPaginaPasos(paginaPasosActual + 1)}>&gt;</button>
                                            </li>
                                        </ul>
                                    </nav>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default VerReceta;