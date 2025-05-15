import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ListaCompra = ({ showListaCompra }) => {
  const offcanvasRef = useRef();

  useEffect(() => {
    if (showListaCompra && offcanvasRef.current) {
      const bsOffcanvas = new window.bootstrap.Offcanvas(offcanvasRef.current);
      bsOffcanvas.show();
    }
  }, [showListaCompra]);

  const [listaCompra, setListaCompra] = useState([]); // Lista de la compra
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
        setListaCompra(response.data.data || []);
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

  // Insertar un producto en la lista de la compra
  const insertListaCompra = async () => {
    try {
      const response = await axios.post(
        "http://localhost/api/area_privada/listaCompra/insertListaCompra.php",
        nuevoProducto,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.success === "true") {
        setMensaje(
          response.data.message || "Producto añadido correctamente."
        );
        setExito(true);
        getListaCompra(); // Actualizar la lista
      } else {
        setMensaje(response.data.message || "Error al añadir el producto.");
        setExito(false);
      }
    } catch (error) {
      setMensaje("Error al añadir el producto.");
      setExito(false);
      console.error(error);
    }
  };

  // Eliminar un producto de la lista de la compra
  const deleteListaCompra = async (id_producto) => {
    try {
      const response = await axios.post(
        "http://localhost/api/area_privada/listaCompra/deleteListaCompra.php",
        { id_producto, cantidad },
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
        await deleteListaCompra(producto.id_producto);
      }
      setMensaje("Lista de la compra vaciada correctamente.");
      setExito(true);
    } catch (error) {
      setMensaje("Error al vaciar la lista de la compra.");
      setExito(false);
      console.error(error);
    }
  };

  // Llamar a getListaCompra al cargar el componente
  useEffect(() => {
    getListaCompra();
  }, []);

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
          <h2 className="offcanvas-title" id="offcanvasExampleLabel">
            Lista de la Compra
          </h2>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div>
            <h3>Ingredientes</h3>
            <ul>
              {listaCompra.map((producto) => (
                <li key={producto.id_producto}>
                  {producto.nombre} - Cantidad: {producto.cantidad}
                  <button
                    onClick={() => deleteListaCompra(producto.id_producto, producto.cantidad)}
                    className="btn btn-danger btn-sm mx-2"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="botones-lista-compra">
            <button
              className="btn btn-danger"
              onClick={vaciarListaCompra}
            >
              Vaciar Lista
            </button>
            <button className="btn btn-secondary">Ir a recetas</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListaCompra;