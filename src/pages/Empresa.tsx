export default function Empresa() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-foreground">Empresa</h1>
        <p className="mt-2 text-muted-foreground">Conheça nossa missão, visão e valores.</p>
      </header>
      <main className="container mx-auto px-4 pb-16">
        <section className="bg-card text-card-foreground p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Nossa missão</h2>
          <p className="text-muted-foreground">Conteúdo em construção. Em breve compartilharemos nossa história e impacto.</p>
        </section>
        <section className="bg-card text-card-foreground p-6 rounded-lg shadow mt-6">
          <h2 className="text-2xl font-semibold mb-2">Compromisso com sustentabilidade</h2>
          <p className="text-muted-foreground">A PegadaZero ajuda empresas a medir, reduzir e compensar emissões.</p>
        </section>
      </main>
    </div>
  );
}