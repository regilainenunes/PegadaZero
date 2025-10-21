import { Link } from 'react-router-dom'

export default function Carreiras() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 -z-10 particles" />
      <header className="container mx-auto px-4 py-12 fade-in">
        <h1 className="text-4xl font-bold">Faça Parte do Time que Zera Impactos</h1>
        <p className="mt-2 text-muted-foreground">Trabalhe com propósito, inovação e sustentabilidade.</p>
      </header>
      <main className="container mx-auto px-4 pb-20">
        <section className="max-w-3xl bg-card text-card-foreground p-8 rounded-2xl shadow card-hover fade-in-slow">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Trabalhar na PegadaZero é mais do que fazer parte de uma startup: é contribuir para o futuro do planeta.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Buscamos pessoas apaixonadas por inovação, tecnologia e sustentabilidade — mentes inquietas que acreditam que é possível crescer sem destruir.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Oferecemos um ambiente colaborativo, criativo e 100% orientado a propósito.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Se você quer impactar o mundo de forma positiva, junte-se a nós.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 max-w-3xl">
          <div className="bg-card text-card-foreground p-6 rounded-xl shadow flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Envie seu perfil</h3>
              <p className="text-muted-foreground">Estamos sempre atentos a talentos com propósito.</p>
            </div>
            <Link to="/" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90">Voltar para Home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}