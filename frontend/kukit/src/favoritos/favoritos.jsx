import React, { useEffect, useState } from 'react';

const Favoritos = ({ idUsuario }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerFavoritos = async () => {
      try {
        const respuesta = await fetch(`getFavoritos.php?id_usuario=${idUsuario}`);
        const datos = await respuesta.json();
        setFavoritos(datos);
      } catch (error) {
        console.error('Error al obtener los favoritos:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerFavoritos();
  }, [idUsuario]);

  if (cargando) return <p>Cargando favoritos...</p>;
  if (favoritos.length === 0) return <p>No tienes recetas favoritas.</p>;

  return (
    <div>
      <h2>Mis Recetas Favoritas</h2>
      <ul>
        {favoritos.map((receta) => (
          <li key={receta.id}>
            <h3>{receta.nombre}</h3>
            <p>{receta.descripcion}</p>
            {/* Puedes agregar más info según los campos que tengas en la tabla recetas */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favoritos;
