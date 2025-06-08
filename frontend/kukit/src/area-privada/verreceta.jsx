import React, { useState, useEffect} from 'react';
import axios from 'axios';
// import logo from '../img/logo_kukit.png'; // No usado directamente en el JSX visible
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
// import CorazonRelleno from '../img/corazonRelleno.png'; // No usado
// import CorazonSinRelleno from '../img/corazonSinRelleno.png'; // No usado
// import NoFavorito from '../img/bookmark.png'; // No usado
// import Favorito from '../img/bookmark-relleno.png'; // No usado
import dificultadIcon from '../img/velocidad.png';
import tiempoIcon from '../img/tiempo.png';
// import Login from '../login/login'; // No usado
// import Registro from '../login/registro/registro'; // No usado
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
    const [mensajeListaCompra, setMensajeListaCompra] = useState({ text: '', type: '' }); // Para mensajes de éxito/error
    const [mostrarListaCompraLocal, setMostrarListaCompraLocal] = useState(false);
    const [lastItemAddedTimestamp, setLastItemAddedTimestamp] = useState(null); // Para forzar la recarga de ListaCompra
    const PASOS_POR_PAGINA = 1; // Mostrar un paso a la vez

    const { recetaId } = useParams(); // Obtener recetaId de los parámetros de la URL
    const navigate = useNavigate(); // Hook para la navegación

    useEffect(() => {
        axios.get('http://localhost/api/area_privada/recetas/getRecetasConcreta.php'
            , {
                params: { recetaId } // Pasar el ID de la receta como parámetro
                // withCredentials: true // Descomentar si necesitas enviar cookies con la solicitud
            }
        )
            .then(res => {
                if (res.data.success) {
                    const recetaSeleccionada = res.data.recetas.find(r => r._id.$oid === recetaId);
                    setReceta(recetaSeleccionada);
                    if (!recetaSeleccionada) {
                        console.warn(`Receta con ID ${recetaId} no encontrada.`);
                    }
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

    const handleAddToShoppingList = (nombreIngrediente, cantidadNum, unidad) => {
        const itemParaBackend = {
            nombre: nombreIngrediente,
            cantidad: cantidadNum, // Enviar cantidad numérica al backend
            unidad: unidad,
        };

        // Ajusta la URL a tu endpoint real del backend
        axios.post('http://localhost/api/area_privada/listaCompra/insertListaCompra.php', itemParaBackend)
            .then(response => {
                console.log('Ingrediente añadido a la lista de compra en el backend:', response.data);

                // Actualizar el timestamp para que ListaCompra sepa que debe recargar
                setLastItemAddedTimestamp(Date.now());

                const mensaje = `${nombreIngrediente} (${cantidadNum.toFixed(1)} ${unidad}) añadido a la lista de la compra.`;
                setMensajeListaCompra({ text: mensaje, type: 'success' });
                setTimeout(() => {
                    setMensajeListaCompra({ text: '', type: '' });
                }, 3000);
                setMostrarListaCompraLocal(true); // Mostrar el componente ListaCompra
            })
            .catch(error => {
                console.error('Error al añadir ingrediente a la lista de compra:', error);
                const errorMensaje = error.response?.data?.message || `Error al añadir ${nombreIngrediente}. Inténtalo de nuevo.`;
                setMensajeListaCompra({ text: errorMensaje, type: 'danger' });
                setTimeout(() => {
                    setMensajeListaCompra({ text: '', type: '' });
                }, 5000); // Mostrar mensaje de error un poco más
                // No se actualiza la lista local ni se muestra `ListaCompra` si hay error
            });
    };


    if (!receta) return <p className="text-center mt-5">Cargando receta...</p>;
    // Eliminamos el console.log(receta) que estaba aquí para limpiar.
    // Si necesitas depurar, puedes volver a añadirlo temporalmente.
    // console.log(receta);




    return (
        <>
            <Header />
            <main>
                <div className="container mt-4">
                <div className="d-flex align-items-center mb-3"> {/* mb-3 para un margen inferior */}
                        {/* Botón para volver atrás */}
                        <button
                            onClick={() => navigate(-1)}
                            className="btn volver me-3" /* Estilo y margen a la derecha */
                            title="Volver a la página anterior"
                        >
                            Volver
                        </button>
                        <h4 className="mb-0">Recetas <span className="text-danger">| {receta.nombre}</span></h4> {/* mb-0 para que no afecte la alineación vertical */}
                    </div>                        

                    <button
                        className="btn btn-outline-secondary mt-2 mb-3 ver-texto"
                        onClick={handleVerComoTexto}
                    >
                        Ver como Texto
                    </button>

                    <div className="d-flex flex-column flex-md-row gap-4 mt-4">
                        <div className="text-center">
                            {receta.href && (
                                <img src={receta.href} alt={receta.nombre} className="img-fluid rounded shadow mb-3" style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'cover' }} />
                            )}
                            <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                                <button className="btn btn-danger" onClick={() => ajustarRaciones(-1)}>-</button>
                                <span className="fs-4">{raciones}</span>
                                <button className="btn btn-danger" onClick={() => ajustarRaciones(1)}>+</button>
                            </div>
                            <p className="mt-2">Raciones</p>
                        </div>

                        <div className="flex-fill">
                            {/* El título ya está arriba, se puede omitir aquí si se prefiere */}
                            {/* <h3>{receta.nombre}</h3> */}
                            <div className="d-flex gap-4">
                                <div>
                                    <p className="mb-1 fw-bold">Dificultad</p>
                                    <div className="d-flex align-items-center">
                                        <img src={dificultadIcon} alt="Icono de dificultad" style={{ width: '20px', marginRight: '5px' }} />
                                        <span>{receta.dificultad}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-1 fw-bold">Tiempo</p>
                                    <div className="d-flex align-items-center">
                                        <img src={tiempoIcon} alt="Icono de tiempo" style={{ width: '20px', marginRight: '5px' }} />
                                        <span>{receta.tiempo}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="receta-header">
                                <h1>{receta.nombre}</h1>
                                <p><strong>Creado por:</strong> {receta.idUsuario}</p>
                            </div>

                            <div className="row mt-4">
                                {/* Columna Izquierda: Ingredientes e Información Nutricional */}
                                <div className="col-md-5">
                                    <div className="mb-4">
                                        <h5>Ingredientes</h5>
                                        <div className="d-flex flex-column gap-3">
                                            {receta.ingredientes.map((ing, idx) => {
                                                const cantidadBase = ing.cantidad || 0;
                                                const racionesBase = receta.raciones_originales || 1;
                                                const cantidadFinal = (cantidadBase * raciones) / racionesBase;

                                                return ( // Contenedor para el ingrediente y el botón
                                                    <div key={idx} className="d-flex justify-content-between align-items-center bg-white rounded shadow-sm p-3">
                                                        <span>
                                                            {ing.nombre}: {cantidadFinal.toFixed(1)} {ing.unidad}
                                                        </span>
                                                        <button
                                                            className="btn btn-sm py-0 px-1"
                                                            onClick={() => handleAddToShoppingList(ing.nombre, cantidadFinal, ing.unidad)}
                                                            title={`Añadir ${ing.nombre} a la lista`}
                                                            style={{ lineHeight: '1', fontSize: '0.9rem', padding: '0.2rem 0.4rem',borderColor: '#c00000', color: '#c00000' } /* Estilo del botón */}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Columna Derecha: Pasos y Paginación */}
                                <div className="col-md-7">
                                    <h5>Pasos</h5>
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
                {/* Renderizar ListaCompra cuando mostrarListaCompraLocal sea true */}
                {mostrarListaCompraLocal && (
                    <ListaCompra
                        showListaCompra={mostrarListaCompraLocal}
                        setListaCompra={setMostrarListaCompraLocal}
                        refreshTrigger={lastItemAddedTimestamp} // Pasamos el trigger para recargar
                    />
                )}
            </main>
            {/* <Footer /> */}
        </>
    );
};

export default VerReceta;