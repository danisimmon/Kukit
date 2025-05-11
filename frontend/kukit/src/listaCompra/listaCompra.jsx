import React, { useState, useEffect } from "react";
import axios from "axios";

const ListaCompra = () => {
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
      const response = await axios.get("http://localhost/api/area_privada/listaCompra/getListaCompra.php", {
        withCredentials: true,
      });
      if (response.data.status === "success") {
        setListaCompra(response.data.data || []);
        setMensaje("Lista de compra obtenida correctamente.");
        setExito(true);
      } else {
        setMensaje(response.data.message || "Error al obtener la lista de la compra.");
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
        setMensaje(response.data.message || "Producto añadido correctamente.");
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
  const deleteListaCompra = async (id_producto, cantidad) => {
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
        setMensaje(response.data.message || "Producto eliminado correctamente.");
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

  // Actualizar la cantidad de un producto en la lista de la compra
  const updateListaCompra = async (id_producto, cantidad) => {
    try {
      const response = await axios.put(
        "http://localhost/api/area_privada/listaCompra/updateListaCompra.php",
        { id_producto, cantidad },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.success === "true") {
        setMensaje(response.data.message || "Cantidad actualizada correctamente.");
        setExito(true);
        getListaCompra(); // Actualizar la lista
      } else {
        setMensaje(response.data.message || "Error al actualizar la cantidad.");
        setExito(false);
      }
    } catch (error) {
      setMensaje("Error al actualizar la cantidad.");
      setExito(false);
      console.error(error);
    }
  };

  // Llamar a getListaCompra al cargar el componente
  useEffect(() => {
    getListaCompra();
  }, []);

  return (
    <div>
      <div className="offcanvas-header">
        <h2 className="offcanvas-title">Lista de la Compra</h2>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <div>
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
                  <button
                    onClick={() =>
                      updateListaCompra(
                        producto.id_producto,
                        prompt("Nueva cantidad:", producto.cantidad)
                      )
                    }
                    className="btn btn-primary btn-sm"
                  >
                    Actualizar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="botones-lista-compra">
          <button
            className="btn btn-danger"
            onClick={() => listaCompra.forEach((producto) => deleteListaCompra(producto.id_producto, producto.cantidad))}
          >
            Vaciar Lista
          </button>
          <button className="btn btn-secondary">Ir a recetas</button>
        </div>
        <div>
          <h3 className="mt-3">Añadir Producto</h3>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="ID del Producto"
            value={nuevoProducto.id_producto}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, id_producto: e.target.value })
            }
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Cantidad"
            value={nuevoProducto.cantidad}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, cantidad: e.target.value })
            }
          />
          <button onClick={insertListaCompra} className="btn btn-success">
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListaCompra;