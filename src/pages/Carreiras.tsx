export default function Carreiras() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-foreground">Carreiras</h1>
        <p className="mt-2 text-muted-foreground">Junte-se a nós para acelerar a transição sustentável.</p>
      </header>
      <main className="container mx-auto px-4 pb-16">
        <section className="bg-card text-card-foreground p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Vagas</h2>
          <p className="text-muted-foreground">Nenhuma vaga aberta no momento. Fique de olho!</p>
        </section>
      </main>
    </div>
  );
}