import { Scene } from "@/components/Scene";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import Link from "next/link";

export default function FlashFusionPage() {
  return (
    <main className="relative min-h-screen">
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono tracking-wider bg-void/80 backdrop-blur border border-neon/40 text-ice hover:text-white hover:border-neon transition-all"
        >
          ← Back to Kyle Rosebrook
        </Link>
      </div>
      <Scene />
      <div className="relative z-10">
        <Hero />
        <Stats />
      </div>
    </main>
  );
}
