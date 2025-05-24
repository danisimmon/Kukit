import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const TIPOS_COMIDA = [
  { key: 'desayuno', nombre: 'Desayuno' },
  { key: 'comida', nombre: 'Comida' },
  { key: 'cena', nombre: 'Cena' }
];
const NUMERO_SEMANAS_PLAN = 4; // El usuario puede planificar para 4 semanas

function PlanificacionSemanal() {
  const [plan, setPlan] = useState([]);
  const [semanaActualVisualizada, setSemanaActualVisualizada] = useState(0); // Índice de la semana
  const [slotSeleccionado, setSlotSeleccionado] = useState(null); // { semanaIndex, diaIndex, tipoComidaKey }
  const [recetasDisponibles, setRecetasDisponibles] = useState([]);
  const [slotParaEliminar, setSlotParaEliminar] = useState(null);

  // Refs para Offcanvas y Modal de Bootstrap
  const recipeSelectorOffcanvasRef = useRef(null);
  const recipeSelectorOffcanvasInstance = useRef(null);
  const confirmDeleteModalRef = useRef(null);
  const confirmDeleteModalInstance = useRef(null);

  // Inicializar el plan y cargar recetas
  useEffect(() => {
    const planInicial = Array(NUMERO_SEMANAS_PLAN).fill(null).map(() =>
      Array(DIAS_SEMANA.length).fill(null).map(() => ({
        desayuno: null,
        comida: null,
        cena: null,
      }))
    );
    setPlan(planInicial);

    const cargarRecetas = async () => {
      try {
        const response = await fetch('http://localhost/api/area_privada/recetas/getRecetasGuardadas.php');
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json(); // Asumimos que el backend devuelve JSON
        setRecetasDisponibles(data);
      } catch (error) {
        console.error("Error al cargar las recetas desde el backend:", error);
      }
    };
    cargarRecetas();

    // Inicializar instancias de Bootstrap Offcanvas y Modal
    // Import bootstrap dynamically if not available globally
    import('bootstrap/dist/js/bootstrap.bundle.min.js').then(bootstrap => {
      if (recipeSelectorOffcanvasRef.current && !recipeSelectorOffcanvasInstance.current) {
        recipeSelectorOffcanvasInstance.current = new bootstrap.Offcanvas(recipeSelectorOffcanvasRef.current);
      }
      if (confirmDeleteModalRef.current && !confirmDeleteModalInstance.current) {
        confirmDeleteModalInstance.current = new bootstrap.Modal(confirmDeleteModalRef.current);
      }
    }).catch(err => console.error("Failed to load Bootstrap JS", err));
  
    // Cleanup function for Bootstrap instances when component unmounts
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
  }, []); // El array vacío asegura que useEffect se ejecute solo al montar y desmontar

  const cambiarSemana = (direccion) => {
    setSemanaActualVisualizada(prev => {
      const nuevaSemana = prev + direccion;
      if (nuevaSemana >= 0 && nuevaSemana < NUMERO_SEMANAS_PLAN) {
        return nuevaSemana;
      }
      return prev; // Mantener la semana actual si está fuera de los límites
    });
  };

  const abrirSelectorRecetas = (semanaIndex, diaIndex, tipoComidaKey) => {
    setSlotSeleccionado({ semanaIndex, diaIndex, tipoComidaKey });
    if (recipeSelectorOffcanvasInstance.current) {
      recipeSelectorOffcanvasInstance.current.show();
    }
  };

  const seleccionarRecetaParaSlot = (receta) => {
    if (!slotSeleccionado) return;

    const { semanaIndex, diaIndex, tipoComidaKey } = slotSeleccionado;

    // Crear una copia profunda del plan para asegurar la inmutabilidad
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

  const confirmarEliminacionComida = () => {
    if (!slotParaEliminar) return;

    const { semanaIndex, diaIndex, tipoComidaKey } = slotParaEliminar;

    const nuevoPlan = plan.map((semana, sIndex) => {
      if (sIndex === semanaIndex) {
        return semana.map((dia, dIndex) => {
          if (dIndex === diaIndex) {
            return {
              ...dia,
              [tipoComidaKey]: null, // Eliminar la receta
            };
          }
          return dia;
        });
      }
      return semana;
    });

    setPlan(nuevoPlan);
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

  if (plan.length === 0) {
    return <div className="container mt-5 text-center"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando planificación...</span></div></div>;
  }

  const semanaVisible = plan[semanaActualVisualizada];

  return (
    <>
      <div className="container mt-4">
        <h2 className="mb-4 text-center">Planificación Semanal de Comidas</h2>

        {/* Navegación de Semanas */}
        <div className="d-flex justify-content-between align-items-center mb-3">
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

        {/* Tabla de Planificación Semanal */}
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>Día</th>
                {TIPOS_COMIDA.map(tc => <th key={tc.key}>{tc.nombre}</th>)}
              </tr>
            </thead>
            <tbody>
              {DIAS_SEMANA.map((diaNombre, diaIndex) => (
                <tr key={diaIndex}>
                  <td><strong>{diaNombre}</strong></td>
                  {TIPOS_COMIDA.map(tipoComida => {
                    const comidaPlanificada = semanaVisible && semanaVisible[diaIndex] ? semanaVisible[diaIndex][tipoComida.key] : null;
                    return (
                      <td key={tipoComida.key} style={{ verticalAlign: 'middle' }}>
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
          <h6>Recetas Favoritas</h6>
          <ul className="list-group mb-3">
            {recetasDisponibles.filter(r => r.tipo === 'favorita').map(receta => (
              <li
                key={receta.id}
                className="list-group-item list-group-item-action"
                style={{ cursor: 'pointer' }}
                onClick={() => seleccionarRecetaParaSlot(receta)}
              >
                {receta.nombre}
              </li>
            ))}
            {recetasDisponibles.filter(r => r.tipo === 'favorita').length === 0 && <li className="list-group-item">No tienes recetas favoritas.</li>}
          </ul>

          <h6>Mis Recetas Creadas</h6>
          <ul className="list-group">
            {recetasDisponibles.filter(r => r.tipo === 'creada').map(receta => (
              <li
                key={receta.id}
                className="list-group-item list-group-item-action"
                style={{ cursor: 'pointer' }}
                onClick={() => seleccionarRecetaParaSlot(receta)}
              >
                {receta.nombre}
              </li>
            ))}
            {recetasDisponibles.filter(r => r.tipo === 'creada').length === 0 && <li className="list-group-item">No has creado recetas.</li>}
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
    </>
  );
}

export default PlanificacionSemanal;