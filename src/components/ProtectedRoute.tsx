import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const previewBypass = params.get('preview') === '1';

  // Mostra um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Permite preview de rotas protegidas quando ?preview=1 está presente
  if (previewBypass) {
    return <Outlet />;
  }

  // Redireciona para a página de login se não estiver autenticado
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}