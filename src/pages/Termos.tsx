import { Link } from 'react-router-dom'

export default function Termos() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 -z-10 particles" />
      <header className="container mx-auto px-4 py-12 fade-in">
        <h1 className="text-4xl font-bold">Termos de Uso da Plataforma</h1>
        <p className="mt-2 text-muted-foreground">Diretrizes para uma experiência segura e consciente.</p>
      </header>
      <main className="container mx-auto px-4 pb-20">
        <section className="max-w-3xl bg-card text-card-foreground p-8 rounded-2xl shadow card-hover fade-in-slow">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-7 4h8M7 8h10m2 10a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12z"/></svg>
            </div>
            <div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ao acessar e utilizar a PegadaZero, você concorda com nossos Termos de Uso. Esses termos descrevem as regras de funcionamento da plataforma, responsabilidades de usuários e diretrizes para o uso ético dos dados e recursos oferecidos.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Recomendamos a leitura completa para garantir uma experiência segura e consciente.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                A PegadaZero se reserva o direito de atualizar estes termos conforme o avanço da legislação e de suas funcionalidades.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 max-w-3xl">
          <div className="bg-card text-card-foreground p-6 rounded-xl shadow flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Dúvidas?</h3>
              <p className="text-muted-foreground">Consulte nossa Política de Privacidade e Segurança.</p>
            </div>
            <Link to="/" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90">Voltar para Home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}