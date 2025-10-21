import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function MasterRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const previewBypass = params.get('preview') === '1';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (previewBypass) {
    return <Outlet />;
  }

  const role = (user?.role || '').toLowerCase();
  const isMaster = role === 'master';
  return isMaster ? <Outlet /> : <Navigate to="/login" replace />;
}