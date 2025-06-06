import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './logout/AuthContext'; // Asegúrate de que la ruta sea correcta

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Si aún estamos cargando el estado de autenticación, puedes renderizar un spinner o null
  // para evitar la redirección inmediata antes de saber si está autenticado.
  if (isLoading) {
    return null; // O un componente de carga
  }

  if (!isAuthenticated) {
    // Si no está autenticado, redirige al home
    return <Navigate to="/home" replace />;
  }

  // Si está autenticado, renderiza el elemento (la página solicitada)
  return element;
};

export default ProtectedRoute;