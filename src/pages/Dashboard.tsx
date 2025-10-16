// Componente de Sidebar
const Sidebar = () => {
  return (
    <div className="bg-primary text-primary-foreground w-64 min-h-screen p-4">
      <div className="flex items-center mb-8">
        <img src="/logo.svg" alt="PegadaZero" className="h-10 w-auto" />
        <span className="ml-2 text-xl font-bold">PegadaZero</span>
      </div>
      
      <nav>
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg bg-primary/90">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-primary/90">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Relatórios
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-primary/90">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Atividades
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-primary/90">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Dicas
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-green-700">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Configurações
            </a>
          </li>
        </ul>
      </nav>
      
      <div className="absolute bottom-0 left-0 p-4 w-64">
        <a href="#" className="flex items-center p-2 rounded-lg hover:bg-primary/90">
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Sair
        </a>
      </div>
    </div>
  );
};

// Componente de Card para métricas
interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const MetricCard = ({ title, value, change, isPositive, icon }: MetricCardProps) => {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="bg-primary/10 p-3 rounded-full">{icon}</div>
      </div>
      <div className="mt-4">
        <span className={`text-sm font-medium ${isPositive ? 'text-primary' : 'text-red-600'}`}>
          {change}
        </span>
        <span className="text-sm text-muted-foreground ml-1">desde o mês passado</span>
      </div>
    </div>
  );
};

// Componente de Gráfico (simplificado)
const Chart = () => {
  return (
    <div className="bg-card rounded-lg shadow p-6 h-80">
      <h3 className="text-lg font-medium text-foreground">Emissões de CO2 (últimos 6 meses)</h3>
      <div className="mt-6 h-48 flex items-end space-x-2">
        <div className="w-1/6 bg-primary/30 rounded-t h-1/4" title="Janeiro"></div>
        <div className="w-1/6 bg-primary/40 rounded-t h-2/5" title="Fevereiro"></div>
        <div className="w-1/6 bg-primary/50 rounded-t h-3/5" title="Março"></div>
        <div className="w-1/6 bg-primary/60 rounded-t h-1/2" title="Abril"></div>
        <div className="w-1/6 bg-primary/70 rounded-t h-2/6" title="Maio"></div>
        <div className="w-1/6 bg-primary/80 rounded-t h-1/6" title="Junho"></div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Jan</span>
        <span>Fev</span>
        <span>Mar</span>
        <span>Abr</span>
        <span>Mai</span>
        <span>Jun</span>
      </div>
    </div>
  );
};

// Componente de Tabela de Atividades
const ActivityTable = () => {
  const activities = [
    { id: 1, activity: 'Consumo de energia elétrica', impact: '120kg CO2', date: '12/06/2023' },
    { id: 2, activity: 'Transporte de funcionários', impact: '85kg CO2', date: '10/06/2023' },
    { id: 3, activity: 'Uso de papel no escritório', impact: '12kg CO2', date: '09/06/2023' },
    { id: 4, activity: 'Viagens de negócios', impact: '450kg CO2', date: '05/06/2023' },
    { id: 5, activity: 'Consumo de água', impact: '8kg CO2', date: '01/06/2023' },
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium text-foreground">Atividades Recentes</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Atividade
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Impacto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.activity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.impact}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href="#" className="text-primary hover:text-primary/80 mr-3">Ver</a>
                  <a href="#" className="text-primary hover:text-primary/80">Editar</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente de Dicas
const TipsSection = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900">Dicas para Redução</h3>
      <ul className="mt-4 space-y-3">
        <li className="flex items-start">
          <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-gray-600">Implemente políticas de trabalho remoto para reduzir emissões de transporte</p>
        </li>
        <li className="flex items-start">
          <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-gray-600">Substitua equipamentos antigos por modelos mais eficientes energeticamente</p>
        </li>
        <li className="flex items-start">
          <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-gray-600">Adote práticas de escritório sem papel e digitalize documentos</p>
        </li>
        <li className="flex items-start">
          <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-gray-600">Instale sensores de movimento para iluminação em áreas de baixo tráfego</p>
        </li>
      </ul>
      <button className="mt-4 text-sm font-medium text-primary hover:text-primary/80">
        Ver todas as dicas
      </button>
    </div>
  );
};

export default function Dashboard() {
  const userName = 'Empresa ABC';
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Bem-vindo de volta, {userName}</p>
          </div>
          <div className="flex items-center">
            <button className="bg-card p-2 rounded-full shadow mr-4">
              <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="flex items-center">
              <img className="h-10 w-10 rounded-full border-2 border-primary" src="https://via.placeholder.com/40" alt="Avatar" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">admin@pegadazero.com</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Pegada de Carbono Total" 
            value="675 kg CO2" 
            change="-12%" 
            isPositive={true}
            icon={
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
          <MetricCard 
            title="Consumo de Energia" 
            value="1,240 kWh" 
            change="-8%" 
            isPositive={true}
            icon={
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <MetricCard 
            title="Transporte" 
            value="320 kg CO2" 
            change="+5%" 
            isPositive={false}
            icon={
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            }
          />
          <MetricCard 
            title="Economia Estimada" 
            value="R$ 3,450" 
            change="+18%" 
            isPositive={true}
            icon={
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Chart />
          </div>
          <div>
            <TipsSection />
          </div>
        </div>
        
        <div className="mb-8">
          <ActivityTable />
        </div>
      </div>
    </div>
  );
}