export default function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <header className="mb-12">
        <h1 className="font-display font-black text-6xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Shortlink
        </h1>
        <p className="font-display font-medium text-xl text-muted-foreground">
          A simple URL shortening service
        </p>
      </header>

      <main className="space-y-8">
        <section className="space-y-4">
          <h2 className="font-primary font-bold text-3xl">Font Weights Demo</h2>

          <div className="grid gap-4">
            <p className="font-primary font-light">
              DM Sans Light (300) - The quick brown fox jumps over the lazy dog
            </p>
            <p className="font-primary font-normal">
              DM Sans Regular (400) - The quick brown fox jumps over the lazy
              dog
            </p>
            <p className="font-primary font-medium">
              DM Sans Medium (500) - The quick brown fox jumps over the lazy dog
            </p>
            <p className="font-primary font-semibold">
              DM Sans Semi Bold (600) - The quick brown fox jumps over the lazy
              dog
            </p>
            <p className="font-primary font-bold">
              DM Sans Bold (700) - The quick brown fox jumps over the lazy dog
            </p>
            <p className="font-primary font-extrabold">
              DM Sans Extra Bold (800) - The quick brown fox jumps over the lazy
              dog
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display font-bold text-3xl">
            SF UI Display Weights
          </h2>

          <div className="grid gap-4">
            <p className="font-display font-light">
              SF UI Display Thin (300) - The quick brown fox jumps over the lazy
              dog
            </p>
            <p className="font-display font-normal">
              SF UI Display Light (400) - The quick brown fox jumps over the
              lazy dog
            </p>
            <p className="font-display font-medium">
              SF UI Display Medium (500) - The quick brown fox jumps over the
              lazy dog
            </p>
            <p className="font-display font-semibold">
              SF UI Display Semi Bold (600) - The quick brown fox jumps over the
              lazy dog
            </p>
            <p className="font-display font-bold">
              SF UI Display Bold (700) - The quick brown fox jumps over the lazy
              dog
            </p>
            <p className="font-display font-extrabold">
              SF UI Display Heavy (800) - The quick brown fox jumps over the
              lazy dog
            </p>
            <p className="font-display font-black">
              SF UI Display Black (900) - The quick brown fox jumps over the
              lazy dog
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-primary font-bold text-3xl">
            Italic Styles (DM Sans)
          </h2>

          <div className="grid gap-4">
            <p className="font-primary font-normal italic">
              DM Sans Regular Italic - The quick brown fox jumps over the lazy
              dog
            </p>
            <p className="font-primary font-medium italic">
              DM Sans Medium Italic - The quick brown fox jumps over the lazy
              dog
            </p>
            <p className="font-primary font-bold italic">
              DM Sans Bold Italic - The quick brown fox jumps over the lazy dog
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
