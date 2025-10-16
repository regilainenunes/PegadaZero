export default function SobreNos() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-foreground">Sobre nós</h1>
        <p className="mt-2 text-muted-foreground">Quem somos, nossa equipe e propósito.</p>
      </header>
      <main className="container mx-auto px-4 pb-16">
        <section className="bg-card text-card-foreground p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Nossa história</h2>
          <p className="text-muted-foreground">Página em construção. Em breve traremos detalhes sobre nossa jornada.</p>
        </section>
        <section className="bg-card text-card-foreground p-6 rounded-lg shadow mt-6">
          <h2 className="text-2xl font-semibold mb-2">Equipe</h2>
          <p className="text-muted-foreground">Conheça as pessoas que tornam a PegadaZero possível.</p>
        </section>
      </main>
    </div>
  );
}