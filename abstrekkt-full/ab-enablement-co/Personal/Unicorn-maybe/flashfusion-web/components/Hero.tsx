import Link from "next/link";
import { Button } from "./Button";

const agents = [
  ["Research Agent", "Web search, analysis"],
  ["Design Agent", "UI/UX, Figma, brand"],
  ["Code Agent", "Next.js, API, database"],
  ["DevOps Agent", "CI/CD, deploy, monitor"],
];

export function Hero() {
  return (
    <section className="relative z-10 min-h-screen overflow-hidden px-6 py-6 md:px-10 lg:px-12">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          className="font-display text-lg font-bold uppercase tracking-[0.14em] text-white"
          href="/"
        >
          FlashFusion
        </Link>
        <div className="hidden items-center gap-8 text-sm text-ice/70 md:flex">
          <Link className="transition-colors hover:text-white" href="/docs">
            Platform
          </Link>
          <Link className="transition-colors hover:text-white" href="/docs">
            Agents
          </Link>
          <Link className="transition-colors hover:text-white" href="/docs">
            Deployments
          </Link>
          <Link className="transition-colors hover:text-white" href="/docs">
            Analytics
          </Link>
        </div>
        <Button href="/docs" variant="ghost" className="hidden md:inline-flex">
          Docs
        </Button>
      </nav>

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="max-w-3xl pt-16 text-left md:pt-0">
          <p className="mb-8 inline-flex border border-neon/45 bg-neon/10 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-eyebrow text-neon shadow-glow-sm">
            FLASHFUSION_OS / AGENT INFRASTRUCTURE
          </p>

          <h1 className="font-display text-[clamp(3.6rem,10vw,8.5rem)] font-bold uppercase leading-[0.9] text-white">
            <span className="block">FLASH</span>
            <span className="block text-fusion">FUSION</span>
          </h1>

          <div className="my-7 h-px max-w-[360px]">
            <div
              className="h-full bg-gradient-divider shadow-glow-sm"
              aria-hidden="true"
            />
          </div>

          <p className="max-w-xl font-body text-lg leading-relaxed text-ice/70">
            Route every prompt to its perfect model. Natively. Instantly.
            Intelligently.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              href="mailto:kyle@intinc.io?subject=FlashFusion%20early%20access"
              variant="primary"
            >
              Get Early Access
            </Button>
            <Button href="/docs" variant="ghost">
              View Docs
            </Button>
          </div>

          <p className="mt-12 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ice/40">
            PRODUCTION INFRASTRUCTURE FOR THE AGENT INTERNET
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ice/45">
            <span>OpenAI</span>
            <span>Anthropic</span>
            <span>Vector DB</span>
            <span>Cloudflare</span>
          </div>
        </div>

        <aside className="hidden justify-self-end lg:block">
          <div className="w-[390px] border border-cyan-300/25 bg-void/35 p-5 shadow-[0_0_80px_rgba(6,182,212,0.12)] backdrop-blur-md">
            <div className="mb-5 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ice/60">
              <span>Agentic Execution</span>
              <span className="text-cyan-300">Live</span>
            </div>
            <div className="space-y-3">
              {agents.map(([agent, detail]) => (
                <div
                  className="border border-cyan-300/15 bg-[#07111f]/65 px-4 py-3"
                  key={agent}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-cyan-200">
                    {agent}
                  </p>
                  <p className="mt-1 text-sm text-ice/55">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
