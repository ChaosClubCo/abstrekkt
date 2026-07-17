/**
 * Stats section — ported from flashfusion-v2.html.
 * Four metric cards with glass-morphism styling.
 */
const stats = [
  { value: "12ms", label: "Avg Routing Latency" },
  { value: "99.97%", label: "Uptime SLA" },
  { value: "18+", label: "Model Endpoints" },
  { value: "60%", label: "Avg Cost Reduction" },
];

export function Stats() {
  return (
    <section className="relative z-10 py-24 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="btn-clipped border border-neon/25 bg-void/60 backdrop-blur-md p-6 text-center hover:border-neon/60 hover:shadow-glow-sm transition-all duration-300"
          >
            <p className="font-display font-bold text-4xl text-fusion mb-2">
              {stat.value}
            </p>
            <p className="font-mono text-[0.55rem] tracking-eyebrow uppercase text-ice/50">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
