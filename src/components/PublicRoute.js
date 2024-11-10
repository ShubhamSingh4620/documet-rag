import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PublicRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  return children;
}
