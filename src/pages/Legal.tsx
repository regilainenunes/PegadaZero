export default function Legal() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-foreground">Legal</h1>
        <p className="mt-2 text-muted-foreground">Informações legais e políticas da PegadaZero.</p>
      </header>
      <main className="container mx-auto px-4 pb-16">
        <section className="bg-card text-card-foreground p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Visão geral</h2>
          <p className="text-muted-foreground">Consulte nossa Política de Privacidade, Termos e Segurança.</p>
        </section>
      </main>
    </div>
  );
}