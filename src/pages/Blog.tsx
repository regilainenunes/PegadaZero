export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-foreground">Blog</h1>
        <p className="mt-2 text-muted-foreground">Novidades, dicas e conteúdos sobre sustentabilidade.</p>
      </header>
      <main className="container mx-auto px-4 pb-16">
        <section className="bg-card text-card-foreground p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Em breve</h2>
          <p className="text-muted-foreground">Estamos preparando conteúdos incríveis para você.</p>
        </section>
      </main>
    </div>
  );
}