import { Link } from 'react-router-dom'

export default function Blog() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 -z-10 particles" />
      <header className="container mx-auto px-4 py-12 fade-in">
        <h1 className="text-4xl font-bold">Conhecimento que Reduz Pegadas</h1>
        <p className="mt-2 text-muted-foreground">Sustentabilidade, ESG e tecnologia climática ao seu alcance.</p>
      </header>
      <main className="container mx-auto px-4 pb-20">
        <section className="max-w-3xl bg-card text-card-foreground p-8 rounded-2xl shadow card-hover fade-in-slow">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7H5a2 2 0 00-2 2v8a2 2 0 002 2h6l2 2 2-2h4a2 2 0 002-2V9a2 2 0 00-2-2z"/></svg>
            </div>
            <div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                No blog da PegadaZero, compartilhamos reflexões, tendências e soluções sobre sustentabilidade, ESG, inovação verde e tecnologia climática.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Aqui você encontra guias, estudos e histórias inspiradoras de quem está mudando o mundo — um passo consciente de cada vez.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Acompanhe nossas publicações e descubra como pequenas atitudes geram grandes transformações.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 max-w-3xl">
          <div className="bg-card text-card-foreground p-6 rounded-xl shadow flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Assine atualizações</h3>
              <p className="text-muted-foreground">Fique por dentro dos nossos artigos.</p>
            </div>
            <Link to="/" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90">Voltar para Home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}