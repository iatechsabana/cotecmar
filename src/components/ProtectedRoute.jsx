import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export function ProtectedRoute({ children, requiredRol }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    // Redirigir a login y guardar la ruta intentada
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRol && user.rol !== requiredRol) {
    // Si se requiere un rol específico y el usuario no lo tiene
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}