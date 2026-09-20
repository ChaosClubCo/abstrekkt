import { Scene } from "@/components/Scene";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <Scene />
      <div className="relative z-10">
        <Hero />
        <Stats />
      </div>
    </main>
  );
}
