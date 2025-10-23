import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const HomePage: React.FC = () => {
  // Banner rotativo a partir de imagens na pasta public
  const banners = ['/Banner1.jpg', '/Banner2.jpg', '/Banner3.jpg', '/Banner4.jpg']
  const [currentBanner, setCurrentBanner] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setCurrentBanner((i) => (i + 1) % banners.length), 5000)
    return () => clearInterval(id)
  }, [])

  // Hook simples de contagem regressiva
  const useCountdown = (targetISO: string) => {
    const targetDate = new Date(targetISO)
    const [diffMs, setDiffMs] = useState(targetDate.getTime() - Date.now())
    useEffect(() => {
      const t = setInterval(() => setDiffMs(targetDate.getTime() - Date.now()), 1000)
      return () => clearInterval(t)
    }, [targetISO])
    const clamped = Math.max(0, diffMs)
    const totalSeconds = Math.floor(clamped / 1000)
    const days = Math.floor(totalSeconds / (3600 * 24))
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return { days, hours, minutes, seconds }
  }

  // Contagem com progresso visual (percentual restante entre uma data de início e meta)
  const useProgressCountdown = (startISO: string, targetISO: string) => {
    const startDate = new Date(startISO)
    const targetDate = new Date(targetISO)
    const totalMs = Math.max(0, targetDate.getTime() - startDate.getTime())
    const [diffMs, setDiffMs] = useState(Math.max(0, targetDate.getTime() - Date.now()))
    useEffect(() => {
      const t = setInterval(() => setDiffMs(Math.max(0, targetDate.getTime() - Date.now())), 1000)
      return () => clearInterval(t)
    }, [startISO, targetISO])
    const percentLeft = totalMs > 0 ? Math.min(100, Math.max(0, (diffMs / totalMs) * 100)) : 0
    const totalSeconds = Math.floor(diffMs / 1000)
    const days = Math.floor(totalSeconds / (3600 * 24))
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return { percentLeft, days, hours, minutes, seconds }
  }

  const ProgressRingCard = ({
    title,
    description,
    startISO,
    targetISO,
    sourceHref,
    sourceLabel,
  }: {
    title: string
    description: string
    startISO: string
    targetISO: string
    sourceHref: string
    sourceLabel: string
  }) => {
    const { percentLeft, days, hours, minutes, seconds } = useProgressCountdown(startISO, targetISO)
    const deg = Math.round((percentLeft / 100) * 360)
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 hover:shadow-lg hover:border-green-300 transition-all">
        <h3 className="text-xl font-semibold text-green-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-700 mb-6">{description}</p>

        <div className="flex items-center gap-6">
          {/* Ring */}
          <div className="relative w-40 h-40 shrink-0">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#22c55e ${deg}deg, #e5e7eb ${deg}deg)`,
                transition: 'background 300ms ease-out',
              }}
            />
            <div className="absolute inset-[10px] rounded-full bg-white flex flex-col items-center justify-center">
              <span className="text-xs text-gray-500">Restante</span>
              <span className="text-2xl font-bold text-green-700">{Math.round(percentLeft)}%</span>
            </div>
          </div>

          {/* Counters */}
          <div className="flex-1 grid grid-cols-4 gap-3">
            {[
              { value: days, label: 'dias' },
              { value: hours, label: 'horas' },
              { value: minutes, label: 'min' },
              { value: seconds, label: 's' },
            ].map((item) => (
              <div key={item.label} className="text-center bg-white rounded-md py-3 border border-green-100">
                <div className="text-2xl font-bold text-green-700">{item.value}</div>
                <div className="text-xs font-normal text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Fonte: <a href={sourceHref} target="_blank" rel="noreferrer" className="underline hover:text-gray-700">{sourceLabel}</a>.
        </p>
      </div>
    )
  }

  // Global: estimativa de ~6 anos a partir de nov/2024 (GCB 2024)
  const globalCountdown = useCountdown('2030-11-13T00:00:00Z')
  // Brasil: NDC 2035 (redução 59–67% vs 2005)
  const brazilCountdown = useCountdown('2035-12-31T23:59:59Z')
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/LogoPegadaZero1.svg" alt="PegadaZero" className="h-10 w-auto" />
        </div>
        <nav>
          <ul className="flex items-center gap-6">
            <li><a href="#features" className="text-green-700 hover:text-green-900">Recursos</a></li>
            <li><Link to="/pricing" className="text-green-700 hover:text-green-900">Preços</Link></li>
            <li className="relative group">
              <button className="text-green-700 hover:text-green-900">Institucional</button>
              <div className="absolute right-0 mt-2 w-56 bg-white border border-green-100 rounded-md shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto transition ease-out duration-150 z-50">
                <ul className="py-2">
                  <li><Link to="/empresa" className="block px-4 py-2 text-green-700 hover:bg-green-50 hover:text-green-900">Empresa</Link></li>
                  <li><Link to="/sobre-nos" className="block px-4 py-2 text-green-700 hover:bg-green-50 hover:text-green-900">Sobre Nós</Link></li>
                  <li><Link to="/blog" className="block px-4 py-2 text-green-700 hover:bg-green-50 hover:text-green-900">Blog</Link></li>
                  <li><Link to="/carreiras" className="block px-4 py-2 text-green-700 hover:bg-green-50 hover:text-green-900">Carreiras</Link></li>
                  <li><Link to="/legal" className="block px-4 py-2 text-green-700 hover:bg-green-50 hover:text-green-900">Legal</Link></li>
                  <li><Link to="/privacidade" className="block px-4 py-2 text-green-700 hover:bg-green-50 hover:text-green-900">Privacidade</Link></li>
                  <li><Link to="/termos" className="block px-4 py-2 text-green-700 hover:bg-green-50 hover:text-green-900">Termos</Link></li>
                  <li><Link to="/seguranca" className="block px-4 py-2 text-green-700 hover:bg-green-50 hover:text-green-900">Segurança</Link></li>
                </ul>
              </div>
            </li>
            <li><Link to="/login" className="text-green-700 hover:text-green-900">Entrar</Link></li>
            <li><Link to="/register" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">Registrar</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        {/* Hero Section estilo Greenpeace com banner e overlay */}
        <section className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${banners[currentBanner]})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
          <div className="relative container mx-auto px-4 py-24 text-center max-w-5xl">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
              Juntos por um futuro de baixas emissões
            </h2>
            <p className="text-lg sm:text-xl text-green-100 mb-10">
              Experimente todos os recursos gratuitamente por 3 dias. Depois, continue com o plano completo por R$127/mês.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-lg font-medium">
                Começar teste grátis (3 dias)
              </Link>
              <Link to="/login" className="border border-white text-white hover:bg-white/10 px-6 py-3 rounded-md text-lg font-medium">
                Entrar na plataforma
              </Link>
            </div>
          </div>
        </section>

        {/* Countdown Section: Global e Brasil (interativo) */}
        <section id="countdown" className="bg-white">
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-8">Contagem para metas climáticas</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <ProgressRingCard
                title="Mundo — Orçamento 1,5°C"
                description="Estimativa do Global Carbon Budget 2024: ~6 anos a partir de nov/2024 no ritmo atual."
                startISO="2024-11-13T00:00:00Z"
                targetISO="2030-11-13T00:00:00Z"
                sourceHref="https://globalcarbonbudget.org/faqs/"
                sourceLabel="Global Carbon Budget 2024"
              />
              <ProgressRingCard
                title="Brasil — Meta NDC 2035"
                description="Redução de 59–67% vs 2005 até 2035; neutralidade climática até 2050."
                startISO="2025-01-01T00:00:00Z"
                targetISO="2035-12-31T23:59:59Z"
                sourceHref="https://www.gov.br/planalto/en/latest-news/2024/11/brazil-presents-its-new-climate-target-aligned-with-mission-1.5oc"
                sourceLabel="Planalto — Nova NDC (2024)"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-16">Recursos principais</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Monitoramento em tempo real</h3>
                <p className="text-gray-600">Acompanhe suas emissões de carbono em tempo real com painéis intuitivos e relatórios detalhados.</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Recomendações personalizadas</h3>
                <p className="text-gray-600">Receba sugestões específicas para reduzir suas emissões com base no seu perfil e histórico.</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Compensação de carbono</h3>
                <p className="text-gray-600">Invista em projetos certificados de compensação de carbono diretamente pela nossa plataforma.</p>
              </div>
            </div>
          </div>
        </section>

                {/* Pricing Section atualizado: Gr�tis 3 dias e R$127/m�s */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-16">Planos e preços</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="border-2 border-green-500 rounded-lg p-8 bg-white shadow-md">
                <h3 className="text-xl font-semibold text-green-800 mb-2">Grátis (3 dias)</h3>
                <p className="text-gray-500 mb-6">Todos os recursos do plano de R$99</p>
                <p className="text-4xl font-bold mb-6">R$0<span className="text-lg text-gray-500 font-normal">/3 dias</span></p>
                <ul className="mb-8 space-y-2">
                  <li className="flex items-center"><svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Monitoramento completo</li>
                  <li className="flex items-center"><svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Relatórios e recomendações</li>
                  <li className="flex items-center"><svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Até 5 usuários</li>
                </ul>
                <Link to="/register" className="block text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full">Testar grátis</Link>
              </div>
              <div className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-green-800 mb-2">Completo</h3>
                <p className="text-gray-500 mb-6">Todos os recursos da plataforma</p>
                <p className="text-4xl font-bold mb-6">R$127<span className="text-lg text-gray-500 font-normal">/mês</span></p>
                <ul className="mb-8 space-y-2">
                  <li className="flex items-center"><svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Usuários ilimitados</li>
                  <li className="flex items-center"><svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Relatórios em tempo real</li>
                  <li className="flex items-center"><svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>API completa</li>
                </ul>
                <Link to="/register" className="block text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full">Assinar</Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-green-700 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Pronto para reduzir sua pegada de carbono?</h2>
            <p className="text-green-100 max-w-2xl mx-auto mb-8">
              Junte-se a milhares de empresas que já estão fazendo a diferença para um futuro mais sustentável.
            </p>
            <Link to="/register" className="bg-white text-green-700 hover:bg-green-50 px-6 py-3 rounded-md text-lg font-medium inline-block">
              Comece gratuitamente
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-green-800 text-green-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PegadaZero</h3>
              <p className="mb-4">Tornando a sustentabilidade acessível para empresas de todos os tamanhos.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Recursos</a></li>
                <li><a href="#" className="hover:text-white">Preços</a></li>
                <li><a href="#" className="hover:text-white">Clientes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><Link to="/empresa" className="hover:text-white">Empresa</Link></li>
                <li><Link to="/sobre-nos" className="hover:text-white">Sobre nós</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link to="/carreiras" className="hover:text-white">Carreiras</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/legal" className="hover:text-white">Legal</Link></li>
                <li><Link to="/privacidade" className="hover:text-white">Privacidade</Link></li>
                <li><Link to="/termos" className="hover:text-white">Termos</Link></li>
                <li><Link to="/seguranca" className="hover:text-white">Segurança</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2025 PegadaZero. Todos os direitos reservados.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;