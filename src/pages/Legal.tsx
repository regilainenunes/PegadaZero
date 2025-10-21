import { Link } from 'react-router-dom'

export default function Legal() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 -z-10 particles" />
      <header className="container mx-auto px-4 py-12 fade-in">
        <h1 className="text-4xl font-bold">Compromisso com Transparência e Responsabilidade</h1>
        <p className="mt-2 text-muted-foreground">Direitos, deveres e práticas alinhadas à legislação vigente.</p>
      </header>
      <main className="container mx-auto px-4 pb-20">
        <section className="max-w-3xl bg-card text-card-foreground p-8 rounded-2xl shadow card-hover fade-in-slow">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-7 4h8M7 8h10m2 10a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12z"/></svg>
            </div>
            <div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Na PegadaZero, operamos com base em valores éticos e na transparência total com nossos usuários, parceiros e colaboradores.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Aqui você encontra informações legais, direitos e deveres relacionados ao uso da nossa plataforma.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nosso compromisso é garantir que todas as nossas práticas estejam alinhadas às legislações ambientais, digitais e de proteção de dados vigentes.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 max-w-3xl">
          <div className="bg-card text-card-foreground p-6 rounded-xl shadow flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Consulte também</h3>
              <p className="text-muted-foreground">Política de Privacidade, Termos e Segurança.</p>
            </div>
            <Link to="/" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90">Voltar para Home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}