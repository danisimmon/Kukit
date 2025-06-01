import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListaCompra = ({ showListaCompra, setListaCompra, refreshTrigger }) => {
  const navigate = useNavigate();
  const offcanvasRef = useRef();
  const bsOffcanvasRef = useRef(null);

  useEffect(() => {
    if (!offcanvasRef.current || !window.bootstrap?.Offcanvas) return;

    // Solo inicializamos una vez
    if (!bsOffcanvasRef.current) {
      bsOffcanvasRef.current = new window.bootstrap.Offcanvas(offcanvasRef.current);

      // Listener que se dispara cuando se cierra el offcanvas
      offcanvasRef.current.addEventListener("hidden.bs.offcanvas", () => {
        if (typeof setListaCompra === 'function') {
          setListaCompra(false);
        }
      });
    }

    // Mostrar el offcanvas solo cuando cambia a true
    if (showListaCompra) {
      bsOffcanvasRef.current.show();
    }

  }, [showListaCompra, setListaCompra]);

  const [listaCompra, setLista] = useState([]); // Lista de la compra
  const [nuevoProducto, setNuevoProducto] = useState({
    id_producto: "",
    cantidad: "",
  }); // Datos del producto para insertar
  const [mensaje, setMensaje] = useState(""); // Mensaje de éxito o error
  const [exito, setExito] = useState(false); // Estado de éxito o fallo

  // Obtener la lista de la compra
  const getListaCompra = async () => {
    try {
      const response = await axios.get(
        "http://localhost/api/area_privada/listaCompra/getListaCompra.php",
        {
          withCredentials: true,
        }
      );
      if (response.data.status === "success") {
        setLista(response.data.data || []);
        setMensaje("Lista de compra obtenida correctamente.");
        setExito(true);
      } else {
        setMensaje(
          response.data.message || "Error al obtener la lista de la compra."
        );
        setExito(false);
      }
    } catch (error) {
      setMensaje("Error al obtener la lista de la compra.");
      setExito(false);
      console.error(error);
    }
  };

  // Eliminar un producto de la lista de la compra
  const deleteListaCompra = async (nombre, cantidad) => {
    try {
      const response = await axios.post(
        "http://localhost/api/area_privada/listaCompra/deleteListaCompra.php",
        { nombre, cantidad },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.success === "true") {
        setMensaje(
          response.data.message || "Producto eliminado correctamente."
        );
        setExito(true);
        getListaCompra(); // Actualizar la lista
      } else {
        setMensaje(response.data.message || "Error al eliminar el producto.");
        setExito(false);
      }
    } catch (error) {
      setMensaje("Error al eliminar el producto.");
      setExito(false);
      console.error(error);
    }
  };

  // Vaciar la lista de la compra
  const vaciarListaCompra = async () => {
    try {
      for (const producto of listaCompra) {
        await deleteListaCompra(producto.nombre, producto.cantidad);
      }
      setMensaje("Lista de la compra vaciada correctamente.");
      setExito(true);
    } catch (error) {
      setMensaje("Error al vaciar la lista de la compra.");
      setExito(false);
      console.error(error);
    }
  };

  // Efecto para cargar/recargar la lista de la compra
  useEffect(() => {
    if (showListaCompra) { // Solo cargar si el offcanvas está destinado a estar visible
      getListaCompra();
    }
  }, [showListaCompra, refreshTrigger]); // Recargar si se muestra o si hay un trigger de refresco

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Mostrar la confirmación
  const handleMostrarConfirmacion = () => {
    setMostrarConfirmacion(true);
  };

  // Ocultar sin vaciar
  const handleCancelarVaciado = () => {
    setMostrarConfirmacion(false);
  };

  // Confirmar y vaciar la lista
  const handleConfirmarVaciado = async () => {
    await vaciarListaCompra();
    setMostrarConfirmacion(false); // Ocultamos después
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css"
        integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7"
        rel="stylesheet"
      ></link>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-k6d4wzSIapyDyv1kpU366/PK5hCdSbCRGRCMv+eplOQJWyd1fbcAu9OCUj5zNLiq"
        crossOrigin="anonymous"
        defer
      ></script>

      <div
        ref={offcanvasRef}
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="lista-offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel" style={{ fontSize: '1.25rem', fontWeight: '500' }}>
            Lista de la Compra
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body" style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div className="lista-compra-contenido" style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '10px' /* Para que la barra de scroll no tape contenido */ }}>
            <h6 style={{ marginTop: '0', marginBottom: '15px', fontSize: '1rem', fontWeight: 'bold', color: '#495057' }}>
              TUS INGREDIENTES
            </h6>
            {listaCompra.length === 0 && (
              <p style={{ textAlign: 'center', color: '#6c757d', marginTop: '20px' }}>
                Tu lista de la compra está vacía.
              </p>
            )}
            <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: '0' }}>
              {listaCompra.map((producto) => (
                <li 
                  key={producto.id_producto} 
                  style={{ 
                    display: 'flex', // Mantenemos flex para alinear la cruz y el texto
                    alignItems: 'flex-start', // Alineamos al inicio para que la cruz quede arriba si el texto es largo
                    padding: '12px 8px', /* Más padding para cada item */
                    borderBottom: '1px solid #e9ecef', /* Separador sutil entre items */
                    marginBottom: '0', /* Quitamos el margen inferior ya que usamos border-bottom */
                  }}
                >
                  <button
                    onClick={() => deleteListaCompra(producto.nombre, producto.cantidad)}
                    className="btn btn-danger btn-sm no-hover" // Añadida la clase no-hover
                    style={{ 
                      marginRight: '10px', /* Espacio entre la cruz y el texto */
                      padding: '2px 6px', /* Ajustar padding para que la cruz se vea bien */
                      lineHeight: '1.2', /* Para que la cruz esté bien centrada en el botón */
                      borderRadius: '50%', /* Para hacer el botón de la cruz redondo */
                    }}
                  >
                    &times; {/* Esto crea una 'X' (cruz) */}
                  </button>
                  <span 
                    style={{ 
                      flexGrow: 1, /* Permite que el span ocupe el espacio restante */
                      fontSize: '0.9rem',
                      color: '#212529'
                    }}
                  >
                    <strong style={{ fontWeight: '500' }}>{producto.nombre}</strong>
                    {producto.cantidad && <span style={{ color: '#6c757d', marginLeft: '5px' }}>- Cantidad: {producto.cantidad}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Botones principales del offcanvas, con un poco de separación superior */}
          <div className="botones-lista-compra pt-3 mt-auto border-top" style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', paddingBottom: '10px' }}>
            <button className="btn btn-danger no-hover" style={{ flexGrow: 1 }} onClick={handleMostrarConfirmacion}>
              Vaciar Lista
            </button>
            <button
              className="btn btn-secondary"
              style={{ flexGrow: 1 }}
              onClick={() => navigate("/recetas")}
            >
              Ir a recetas
            </button>
          </div>

          {/* Panel de Confirmación (debajo de los botones) */}
          {mostrarConfirmacion && (
            <div style={{
              marginTop: '20px', // Espacio superior para separarlo de los botones
              padding: '15px',
              border: '1px solid #dee2e6', // Un borde sutil
              borderRadius: '8px',
              backgroundColor: '#f8f9fa', // Un fondo ligeramente diferente para distinguirlo
              textAlign: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)' // Sombra sutil
            }}>
              <p style={{ marginBottom: '15px', fontSize: '0.95rem', color: '#343a40' }}>
                ¿Seguro que quieres vaciar tu lista de la compra?
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button className="btn btn-danger no-hover btn-sm" onClick={handleConfirmarVaciado}>
                Sí, Vaciar
              </button>
              <button className="btn btn-secondary btn-sm" onClick={handleCancelarVaciado}>
                Cancelar
              </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ListaCompra;