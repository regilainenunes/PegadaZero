import { Link } from 'react-router-dom'

export default function Empresa() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 -z-10 particles" />
      <header className="container mx-auto px-4 py-12 fade-in">
        <h1 className="text-4xl font-bold">Nossa Missão é Zerar Impactos, Não Ideias.</h1>
        <p className="mt-2 text-muted-foreground">Transformando a relação entre crescimento e responsabilidade ambiental.</p>
      </header>
      <main className="container mx-auto px-4 pb-20">
        <section className="max-w-3xl bg-card text-card-foreground p-8 rounded-2xl shadow card-hover fade-in-slow">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .672-3 1.5S10.343 11 12 11s3-.672 3-1.5S13.657 8 12 8zm0 9c-3.866 0-7-1.79-7-4V9a1 1 0 011-1h12a1 1 0 011 1v4c0 2.21-3.134 4-7 4z"/></svg>
            </div>
            <div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A PegadaZero é uma plataforma criada para transformar a forma como empresas e pessoas entendem, monitoram e reduzem sua pegada de carbono. Acreditamos que sustentabilidade não é apenas sobre números, mas sobre escolhas conscientes que geram impacto real.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nosso objetivo é democratizar o acesso a ferramentas de mensuração ambiental, tornando simples o que antes era complexo.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Com tecnologia acessível e dados inteligentes, ajudamos organizações e indivíduos a alcançar o equilíbrio entre crescimento e responsabilidade ambiental.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 max-w-3xl">
          <div className="bg-card text-card-foreground p-6 rounded-xl shadow flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Fale Conosco</h3>
              <p className="text-muted-foreground">Quer levar a PegadaZero para sua empresa?</p>
            </div>
            <Link to="/" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90">Voltar para Home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}