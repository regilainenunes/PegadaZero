import { Link } from 'react-router-dom'

export default function SobreNos() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 -z-10 particles" />
      <header className="container mx-auto px-4 py-12 fade-in">
        <h1 className="text-4xl font-bold">Quem Somos</h1>
        <p className="mt-2 text-muted-foreground">Tecnologia, inovação e propósito — nossa essência verde.</p>
      </header>
      <main className="container mx-auto px-4 pb-20">
        <section className="max-w-3xl bg-card text-card-foreground p-8 rounded-2xl shadow card-hover fade-in-slow">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6l-2 4H6l4 3-2 4 4-3 4 3-2-4 4-3h-4l-2-4z"/></svg>
            </div>
            <div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Somos uma startup verde movida por tecnologia, inovação e propósito. A PegadaZero nasceu da necessidade de tornar a sustentabilidade prática, mensurável e acessível a todos.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nossa equipe é formada por desenvolvedores, analistas de dados e especialistas ambientais comprometidos em construir soluções que unem tecnologia e consciência.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Trabalhamos para que cada ação — de empresas ou pessoas — possa contribuir para um planeta mais equilibrado e regenerativo.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 max-w-3xl">
          <div className="bg-card text-card-foreground p-6 rounded-xl shadow flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Fale Conosco</h3>
              <p className="text-muted-foreground">Quer saber mais sobre nossa jornada?</p>
            </div>
            <Link to="/" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90">Voltar para Home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}