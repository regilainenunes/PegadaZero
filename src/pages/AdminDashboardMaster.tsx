import React, { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface StatsResp {
  users_total: number;
  companies_total: number;
  carbon_records_total: number;
  payments_total: number;
  growth_users: number;
  growth_companies: number;
}

interface RecentCompanyItem {
  id: number;
  name: string;
  cnpj?: string;
  sector?: string;
  created_at?: string;
  payment_status: string;
}

interface RecentCompaniesResp {
  page: number;
  page_size: number;
  total: number;
  items: RecentCompanyItem[];
}

interface MapPoint {
  id: number;
  name: string;
  lat: number;
  lng: number;
  emissions: number;
  level: 'baixo' | 'medio' | 'alto';
  updated_at?: string;
}

export default function AdminDashboardMaster() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsResp | null>(null);
  const [recent, setRecent] = useState<RecentCompaniesResp | null>(null);
  const [sectorFilter, setSectorFilter] = useState<string>('');
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Funções de exportação autenticadas (CSV/PDF)
  const handleExportCSV = async () => {
    try {
      const res = await api.get('/admin/export.csv', { responseType: 'blob', params: { period: 'weekly' } });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_master_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Falha ao exportar CSV', e);
      alert('Falha ao exportar CSV. Verifique se está autenticado como Master e se o backend está rodando.');
    }
  };

  const handleExportPDF = async () => {
    try {
      const res = await api.get('/admin/export.pdf', { responseType: 'blob', params: { period: 'weekly' } });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_master_${new Date().toISOString().slice(0,10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Falha ao gerar PDF', e);
      alert('Falha ao gerar PDF. Verifique se está autenticado como Master e se o backend está rodando.');
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, r, m] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/companies/recent', { params: { page: 1, page_size: 10, sector: sectorFilter || undefined } }),
          api.get('/admin/companies/map'),
        ]);
        setStats(s.data);
        setRecent(r.data);
        setMapPoints(m.data.points || []);
      } catch (e) {
        console.error('Erro ao carregar dados do dashboard master', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [sectorFilter]);

  const chartData = useMemo(() => {
    // Mock para crescimento 30 dias: derivar de totals
    if (!stats) return [];
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    return days.map((d) => ({
      day: `${d}`,
      usuarios: Math.round((stats.users_total / 30) * (1 + (stats.growth_users / 100))) + d,
      empresas: Math.round((stats.companies_total / 30) * (1 + (stats.growth_companies / 100))) + Math.max(0, d - 2),
    }));
  }, [stats]);

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/80 backdrop-blur border-b border-muted p-4 flex items-center justify-between">
        <div className="font-semibold">Dashboard Master</div>
        <div className="flex items-center gap-3">
          <input className="px-3 py-2 rounded bg-card border border-muted text-foreground" placeholder="Buscar..."/>
          <button className="px-3 py-2 rounded bg-card border border-muted">🔔</button>
          <span className="text-muted-foreground">{user?.name} ({(user?.role || '').toUpperCase()})</span>
          <Link to="/login" className="px-3 py-2 rounded bg-card border border-muted">Sair</Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-64px)] border-r border-muted bg-card p-4 hidden lg:block">
          <nav className="flex flex-col gap-2">
            <Link className="px-3 py-2 rounded hover:bg-background" to="/admin/dashboard-master">📊 Dashboard</Link>
            <button className="px-3 py-2 rounded hover:bg-background">👥 Usuários</button>
            <button className="px-3 py-2 rounded hover:bg-background">🏢 Empresas</button>
            <button className="px-3 py-2 rounded hover:bg-background">💳 Pagamentos</button>
            <button className="px-3 py-2 rounded hover:bg-background">🌍 Pegadas de Carbono</button>
            <button className="px-3 py-2 rounded hover:bg-background">📈 Relatórios</button>
            <button className="px-3 py-2 rounded hover:bg-background">⚙️ Configurações</button>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 space-y-6">
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded p-4 border border-muted">
              <div className="flex items-center justify-between">
                <span>👥 Usuários Cadastrados</span>
                <span className="text-green-600 text-sm">+{stats?.growth_users}%</span>
              </div>
              <div className="mt-2 text-3xl font-bold">{stats?.users_total ?? 0}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded p-4 border border-muted">
              <div className="flex items-center justify-between">
                <span>🏢 Empresas Ativas</span>
                <span className="text-green-600 text-sm">+{stats?.growth_companies}%</span>
              </div>
              <div className="mt-2 text-3xl font-bold">{stats?.companies_total ?? 0}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded p-4 border border-muted">
              <div className="flex items-center justify-between">
                <span>🌍 Pegadas Registradas</span>
              </div>
              <div className="mt-2 text-3xl font-bold">{stats?.carbon_records_total ?? 0}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded p-4 border border-muted">
              <div className="flex items-center justify-between">
                <span>💳 Pagamentos Realizados</span>
              </div>
              <div className="mt-2 text-3xl font-bold">{formatCurrency(stats?.payments_total || 0)}</div>
            </motion.div>
          </div>

          {/* Chart */}
          <div className="bg-card rounded border border-muted p-4">
            <div className="font-semibold mb-2">Crescimento (30 dias)</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="usuarios" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="empresas" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Companies Table */}
          <div className="bg-card rounded border border-muted p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Empresas Recentes</div>
              <div className="flex items-center gap-2">
                <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} className="px-2 py-1 rounded border border-muted bg-background">
                  <option value="">Todos os setores</option>
                  <option value="Tecnologia">Tecnologia</option>
                  <option value="Indústria">Indústria</option>
                  <option value="Serviços">Serviços</option>
                </select>
                <button onClick={handleExportCSV} className="px-2 py-1 rounded border border-muted bg-background">Exportar CSV</button>
                <button onClick={handleExportPDF} className="px-2 py-1 rounded border border-muted bg-background">Gerar PDF</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="text-left p-2">Empresa</th>
                    <th className="text-left p-2">CNPJ</th>
                    <th className="text-left p-2">Setor</th>
                    <th className="text-left p-2">Cadastro</th>
                    <th className="text-left p-2">Pagamento</th>
                    <th className="text-left p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {recent?.items?.map((c) => (
                    <tr key={c.id} className="border-t border-muted">
                      <td className="p-2">{c.name}</td>
                      <td className="p-2">{c.cnpj || '-'}</td>
                      <td className="p-2">{c.sector || '-'}</td>
                      <td className="p-2">{c.created_at ? new Date(c.created_at).toLocaleDateString('pt-BR') : '-'}</td>
                      <td className="p-2">{c.payment_status}</td>
                      <td className="p-2"><button className="px-2 py-1 rounded bg-background border border-muted">Ver detalhes</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Map */}
          <div className="bg-card rounded border border-muted p-4">
            <div className="font-semibold mb-2">Mapa de Pegadas</div>
            <div className="h-[360px]">
              <MapContainer center={[-14.2350, -51.9253]} zoom={4} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {mapPoints.map((p) => (
                  <CircleMarker key={p.id} center={[p.lat, p.lng]} pathOptions={{ color: p.level === 'alto' ? '#ef4444' : p.level === 'medio' ? '#f59e0b' : '#22c55e' }}>
                    <Popup>
                      <div className="space-y-1">
                        <div className="font-semibold">{p.name}</div>
                        <div>Total CO₂: {p.emissions} kg</div>
                        <div>Última atualização: {p.updated_at ? new Date(p.updated_at).toLocaleDateString('pt-BR') : '-'}</div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}