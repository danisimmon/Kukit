import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Footer from '../footer/footer';
import Header from '../header/header';

// Arrays con los dias de la semana y tipos de comida
const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const TIPOS_COMIDA = [
  { key: 'desayuno', nombre: 'Desayuno' },
  { key: 'almuerzo', nombre: 'Almuerzo' },
  { key: 'comida', nombre: 'Comida' },
  { key: 'merienda', nombre: 'Merienda' },
  { key: 'cena', nombre: 'Cena' },
];
const NUMERO_SEMANAS_PLAN = 4; // El usuario puede planificar para 4 semanas
const API_BASE_URL = 'http://localhost/api/area_privada';
const API_URL_PLAN = `${API_BASE_URL}/planAlimentacion/api-plan-semanal.php`;
const API_URL_RECETAS_GUARDADAS = `${API_BASE_URL}/recetas/getRecetasGuardadas.php`;
const API_URL_RECETAS_CREADAS = `${API_BASE_URL}/recetas/getRecetasCreadas.php`;

const getDefaultPlan = () => Array(NUMERO_SEMANAS_PLAN).fill(null).map(() =>
  Array(DIAS_SEMANA.length).fill(null).map(() => TIPOS_COMIDA.reduce((acc, tipo) => {
    acc[tipo.key] = null;
    return acc;
  }, {}))
);

// Componente principal de la planificación semanal
function PlanificacionSemanal() {
  const [plan, setPlan] = useState([]);
  const [cargandoPlanInicial, setCargandoPlanInicial] = useState(true);
  const [semanaActualVisualizada, setSemanaActualVisualizada] = useState(0);
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);
  const [recetasGuardadas, setRecetasGuardadas] = useState([]);
  const [recetasCreadas, setRecetasCreadas] = useState([]);
  const [slotParaEliminar, setSlotParaEliminar] = useState(null);

  const recipeSelectorOffcanvasRef = useRef(null);
  const recipeSelectorOffcanvasInstance = useRef(null);
  const confirmDeleteModalRef = useRef(null);
  const confirmDeleteModalInstance = useRef(null);

  useEffect(() => {
    const cargarPlan = async () => {
      setCargandoPlanInicial(true);
      try {
        const response = await axios.get(API_URL_PLAN, { withCredentials: true });
        if (response.data && response.data.status === 'success' && response.data.data && Array.isArray(response.data.data.plan) && response.data.data.plan.length === NUMERO_SEMANAS_PLAN) {
          setPlan(response.data.data.plan);
        } else {
          console.warn("Plan no encontrado o formato incorrecto desde API, inicializando uno nuevo.", response.data);
          setPlan(getDefaultPlan());
        }
      } catch (error) {
        console.error("Error cargando el plan semanal:", error);
        setPlan(getDefaultPlan());
      } finally {
        setCargandoPlanInicial(false);
      }
    };

    cargarPlan();

    // Cargar recetas guardadas
    const cargarRecetasGuardadas = async () => {
      try {
        const response = await axios.get(API_URL_RECETAS_GUARDADAS, {
          withCredentials: true,
        });
        const data = response.data;
        if (Array.isArray(data)) {
          setRecetasGuardadas(data);
        } else if (data && Array.isArray(data.recetas)) {
          setRecetasGuardadas(data.recetas);
        } else if (data && data.n_recetas && Array.isArray(data.n_recetas)) {
          setRecetasGuardadas(data.n_recetas);
        } else {
          setRecetasGuardadas([]);
          console.error("Respuesta inesperada recetas guardadas:", data);
        }
      } catch (error) {
        setRecetasGuardadas([]);
        console.error("Error cargando recetas guardadas:", error);
      }
    };

    // Cargar recetas creadas
    const cargarRecetasCreadas = async () => {
      try {
        const response = await axios.get(API_URL_RECETAS_CREADAS, {
          withCredentials: true,
        });
        const data = response.data;
        if (Array.isArray(data)) {
          setRecetasCreadas(data);
        } else if (data && Array.isArray(data.recetas)) {
          setRecetasCreadas(data.recetas);
        } else if (data && data.n_recetas && Array.isArray(data.n_recetas)) {
          setRecetasCreadas(data.n_recetas);
        } else {
          setRecetasCreadas([]);
          console.error("Respuesta inesperada recetas creadas:", data);
        }
      } catch (error) {
        setRecetasCreadas([]);
        console.error("Error cargando recetas creadas:", error);
      }
    };

    cargarRecetasGuardadas();
    cargarRecetasCreadas();

    // Inicializar Bootstrap Offcanvas y Modal
    import('bootstrap/dist/js/bootstrap.bundle.min.js').then(bootstrap => {
      if (recipeSelectorOffcanvasRef.current && !recipeSelectorOffcanvasInstance.current) {
        recipeSelectorOffcanvasInstance.current = new bootstrap.Offcanvas(recipeSelectorOffcanvasRef.current);
      }
      if (confirmDeleteModalRef.current && !confirmDeleteModalInstance.current) {
        confirmDeleteModalInstance.current = new bootstrap.Modal(confirmDeleteModalRef.current);
      }
    }).catch(err => console.error("No se pudo cargar Bootstrap JS", err));

    return () => {
      if (recipeSelectorOffcanvasInstance.current) {
        recipeSelectorOffcanvasInstance.current.dispose();
        recipeSelectorOffcanvasInstance.current = null;
      }
      if (confirmDeleteModalInstance.current) {
        confirmDeleteModalInstance.current.dispose();
        confirmDeleteModalInstance.current = null;
      }
    };
  }, []);

  const guardarPlan = async (planAGuardar) => {
    try {
      const response = await axios.post(API_URL_PLAN, { plan: planAGuardar }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      if (response.data && response.data.status === 'success') {
        console.log("Plan guardado exitosamente.");
      } else {
        console.error("Error al guardar el plan:", response.data.message || "Respuesta desconocida del servidor.");
        // Aquí podrías implementar un reintento o una notificación al usuario más robusta
      }
    } catch (error) {
      console.error("Error de red o servidor al guardar el plan:", error);
      // Aquí podrías implementar un reintento o una notificación al usuario más robusta
    }
  };

  const cambiarSemana = (direccion) => {
    setSemanaActualVisualizada(prev => {
      const nuevaSemana = prev + direccion;
      if (nuevaSemana >= 0 && nuevaSemana < NUMERO_SEMANAS_PLAN) {
        return nuevaSemana;
      }
      return prev;
    });
  };

  const abrirSelectorRecetas = (semanaIndex, diaIndex, tipoComidaKey) => {
    setSlotSeleccionado({ semanaIndex, diaIndex, tipoComidaKey });
    if (recipeSelectorOffcanvasInstance.current) {
      recipeSelectorOffcanvasInstance.current.show();
    }
  };

  const seleccionarRecetaParaSlot = async (receta) => {
    if (!slotSeleccionado) return;

    const { semanaIndex, diaIndex, tipoComidaKey } = slotSeleccionado;

    const nuevoPlan = plan.map((semana, sIndex) => {
      if (sIndex === semanaIndex) {
        return semana.map((dia, dIndex) => {
          if (dIndex === diaIndex) {
            return {
              ...dia,
              [tipoComidaKey]: receta,
            };
          }
          return dia;
        });
      }
      return semana;
    });

    setPlan(nuevoPlan);
    await guardarPlan(nuevoPlan);
    if (recipeSelectorOffcanvasInstance.current) {
      recipeSelectorOffcanvasInstance.current.hide();
    }
    setSlotSeleccionado(null);
  };

  const iniciarEliminacionComida = (semanaIndex, diaIndex, tipoComidaKey) => {
    setSlotParaEliminar({ semanaIndex, diaIndex, tipoComidaKey });
    if (confirmDeleteModalInstance.current) {
      confirmDeleteModalInstance.current.show();
    }
  };

  const confirmarEliminacionComida = async () => {
    if (!slotParaEliminar) return;

    const { semanaIndex, diaIndex, tipoComidaKey } = slotParaEliminar;

    const nuevoPlan = plan.map((semana, sIndex) => {
      if (sIndex === semanaIndex) {
        return semana.map((dia, dIndex) => {
          if (dIndex === diaIndex) {
            return {
              ...dia,
              [tipoComidaKey]: null,
            };
          }
          return dia;
        });
      }
      return semana;
    });

    setPlan(nuevoPlan);
    await guardarPlan(nuevoPlan);
    if (confirmDeleteModalInstance.current) {
      confirmDeleteModalInstance.current.hide();
    }
    setSlotParaEliminar(null);
  };

  const cancelarEliminacion = () => {
    if (confirmDeleteModalInstance.current) {
      confirmDeleteModalInstance.current.hide();
    }
    setSlotParaEliminar(null);
  };

  if (cargandoPlanInicial) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando planificación...</span>
        </div>
      </div>
    );
  }

  // Fallback por si algo muy extraño ocurre y el plan no se carga ni se inicializa
  if (!plan || plan.length !== NUMERO_SEMANAS_PLAN) {
    return <div className="container mt-5 text-center alert alert-danger">Error: No se pudo cargar la estructura del plan. Intente recargar la página.</div>;
  }

  const semanaVisible = plan[semanaActualVisualizada];

  return (
    <>
      <Header />
      <main>
        <div className="container mt-4">
          <h2 className="mb-4 text-center">Planificación Semanal de Comidas</h2>

          <div className="d-flex justify-content-between align-items-center mb-3 semana-navegacion">
            <button
              className="btn btn-outline-primary"
              onClick={() => cambiarSemana(-1)}
              disabled={semanaActualVisualizada === 0}
            >
              &laquo; Semana Anterior
            </button>
            <h4>Semana {semanaActualVisualizada + 1} de {NUMERO_SEMANAS_PLAN}</h4>
            <button
              className="btn btn-outline-primary"
              onClick={() => cambiarSemana(1)}
              disabled={semanaActualVisualizada === NUMERO_SEMANAS_PLAN - 1}
            >
              Semana Siguiente &raquo;
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered text-center">
              <thead>
                <tr>
                  <th>Comida</th>
                  {DIAS_SEMANA.map(dia => <th key={dia}>{dia}</th>)}
                </tr>
              </thead>
              <tbody>
                {TIPOS_COMIDA.map(tipoComida => (
                  <tr key={tipoComida.key}>
                    <td><strong>{tipoComida.nombre}</strong></td>
                    {DIAS_SEMANA.map((diaNombre, diaIndex) => {
                      const comidaPlanificada =
                        semanaVisible && semanaVisible[diaIndex]
                          ? semanaVisible[diaIndex][tipoComida.key]
                          : null;
                      return (
                        <td key={`${diaNombre}-${tipoComida.key}`} style={{ verticalAlign: 'middle' }}>
                          {comidaPlanificada ? (
                            <div>
                              <span>{comidaPlanificada.nombre}</span>
                              <div className="mt-1">
                                <button
                                  className="btn btn-sm btn-outline-secondary me-1"
                                  onClick={() => abrirSelectorRecetas(semanaActualVisualizada, diaIndex, tipoComida.key)}
                                  title="Cambiar receta"
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => iniciarEliminacionComida(semanaActualVisualizada, diaIndex, tipoComida.key)}
                                  title="Eliminar receta"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              className="btn btn-light btn-sm"
                              onClick={() => abrirSelectorRecetas(semanaActualVisualizada, diaIndex, tipoComida.key)}
                            >
                              + Añadir
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/*Botón guardar cambios*/}
        <div className="boton-plan-semanal">
          <button id="vaciarPlanButton"
            className="btn vaciar-plan"
            onClick={() => {
              if (window.confirm("¿Estás seguro de que quieres vaciar todo el plan? Esta acción no se puede deshacer.")) {
                setPlan(getDefaultPlan());
                guardarPlan(getDefaultPlan());
              }
            }}
            >Vaciar Plan</button>
          <button id="guardarPlanButton"
            className="btn guardar-plan"
            onClick={() => guardarPlan(plan)}
            >Guardar Cambios</button>
            
        </div>

        {/* Offcanvas para Selector de Recetas */}
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="recipeSelectorOffcanvas"
          aria-labelledby="recipeSelectorOffcanvasLabel"
          ref={recipeSelectorOffcanvasRef}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="recipeSelectorOffcanvasLabel">Seleccionar Receta</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => recipeSelectorOffcanvasInstance.current && recipeSelectorOffcanvasInstance.current.hide()}
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            {slotSeleccionado && (
              <p>
                Añadiendo/Editando para: Semana {slotSeleccionado.semanaIndex + 1}, {DIAS_SEMANA[slotSeleccionado.diaIndex]}, {TIPOS_COMIDA.find(tc => tc.key === slotSeleccionado.tipoComidaKey)?.nombre}
              </p>
            )}
            <hr />
            <h6>Recetas Guardadas</h6>
            <ul className="list-group mb-3">
              {recetasGuardadas.length > 0 ? (
                recetasGuardadas.map(receta => (
                  <li
                    key={receta.id_receta || receta.id}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: 'pointer' }}
                    onClick={() => seleccionarRecetaParaSlot(receta)}
                  >
                    {receta.nombre}
                  </li>
                ))
              ) : (
                <li className="list-group-item">No tienes recetas guardadas.</li>
              )}
            </ul>

            <h6>Mis Recetas Creadas</h6>
            <ul className="list-group">
              {recetasCreadas.length > 0 ? (
                recetasCreadas.map(receta => (
                  <li
                    key={receta.id}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: 'pointer' }}
                    onClick={() => seleccionarRecetaParaSlot(receta)}
                  >
                    {receta.nombre}
                  </li>
                ))
              ) : (
                <li className="list-group-item">No has creado recetas.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Modal de Confirmación de Eliminación */}
        <div
          className="modal fade"
          id="confirmDeleteModal"
          tabIndex="-1"
          aria-labelledby="confirmDeleteModalLabel"
          aria-hidden="true"
          ref={confirmDeleteModalRef}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="confirmDeleteModalLabel">Confirmar Eliminación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelarEliminacion}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                ¿Estás seguro de que quieres eliminar esta comida de tu planificación?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelarEliminacion}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={confirmarEliminacionComida}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default PlanificacionSemanal;
