import { Link } from 'react-router-dom'

export default function Seguranca() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 -z-10 particles" />
      <header className="container mx-auto px-4 py-12 fade-in">
        <h1 className="text-4xl font-bold">Segurança é a Base de Tudo</h1>
        <p className="mt-2 text-muted-foreground">Proteção de dados com criptografia, autenticação e auditorias periódicas.</p>
      </header>
      <main className="container mx-auto px-4 pb-20">
        <section className="max-w-3xl bg-card text-card-foreground p-8 rounded-2xl shadow card-hover fade-in-slow">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 10-6 0v2c0 1.657 1.343 3 3 3zm7 2a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6z"/></svg>
            </div>
            <div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A segurança das suas informações é fundamental para nós. Implementamos protocolos avançados de criptografia, autenticação segura e monitoramento constante para proteger todos os dados processados na plataforma.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nosso sistema é auditado periodicamente para garantir integridade e confiabilidade.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Na PegadaZero, cuidar do planeta começa por proteger quem cuida dele.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 max-w-3xl">
          <div className="bg-card text-card-foreground p-6 rounded-xl shadow flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Saiba mais</h3>
              <p className="text-muted-foreground">Consulte nossa Política de Privacidade e Termos de Uso.</p>
            </div>
            <Link to="/" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90">Voltar para Home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}