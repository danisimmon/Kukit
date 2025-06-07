import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './logout/AuthContext'; // Asegúrate de que la ruta sea correcta

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Now isLoading is available

  // If still loading, render nothing or a loading spinner
  if (isLoading) {
    return null; // Or <LoadingSpinner />
  }

  // If not authenticated (and no longer loading), redirect to home
  if (!isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // If authenticated (and no longer loading), render the protected element
  return element;
};

export default ProtectedRoute;