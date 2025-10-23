import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Empresa from './pages/Empresa'
import SobreNos from './pages/SobreNos'
import Blog from './pages/Blog'
import Carreiras from './pages/Carreiras'
import Legal from './pages/Legal'
import Privacidade from './pages/Privacidade'
import Termos from './pages/Termos'
import Seguranca from './pages/Seguranca'
import Pricing from './pages/Pricing'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import MasterRoute from './components/MasterRoute'
import AdminDashboardMaster from './pages/AdminDashboardMaster'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        <Route path="/empresa" element={<Empresa />} />
        <Route path="/sobre-nos" element={<SobreNos />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/carreiras" element={<Carreiras />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/seguranca" element={<Seguranca />} />
        
        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/relatorios" element={<Dashboard />} />
          <Route path="/dashboard/atividades" element={<Dashboard />} />
          <Route path="/dashboard/dicas" element={<Dashboard />} />
          <Route path="/dashboard/configuracoes" element={<Dashboard />} />
        </Route>

        {/* Rota Master */}
        <Route element={<MasterRoute />}>
          <Route path="/admin/dashboard-master" element={<AdminDashboardMaster />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App