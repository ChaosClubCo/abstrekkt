const docs = [
  {
    title: "Routing",
    body: "Send each prompt through one routing layer that selects the best model for latency, price, and quality.",
  },
  {
    title: "Observability",
    body: "Track model choice, response time, spend, and fallback behavior across every agent workflow.",
  },
  {
    title: "Deployment",
    body: "Ship with production defaults first, then tune providers and policies per vertical.",
  },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-void px-8 py-16 text-ice">
      <section className="mx-auto max-w-5xl">
        <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-neon">
          FlashFusion Docs
        </p>
        <h1 className="mt-6 font-display text-4xl font-bold uppercase text-white md:text-6xl">
          Agent Infrastructure Notes
        </h1>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {docs.map((item) => (
            <article
              className="border border-neon/25 bg-void/60 p-6"
              key={item.title}
            >
              <h2 className="font-mono text-sm uppercase tracking-mono text-neon">
                {item.title}
              </h2>
              <p className="mt-4 leading-relaxed text-ice/70">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
