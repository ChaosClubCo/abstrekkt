import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Work } from "@/components/Work";
import { Writing } from "@/components/Writing";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <div className="divider" style={{ width: "calc(100% - 7rem)", margin: "0 3.5rem", height: "1px", background: "linear-gradient(90deg,transparent,var(--border),transparent)" }} />
      <About />
      <div className="divider" style={{ width: "calc(100% - 7rem)", margin: "0 3.5rem", height: "1px", background: "linear-gradient(90deg,transparent,var(--border),transparent)" }} />
      <Work />
      <div className="divider" style={{ width: "calc(100% - 7rem)", margin: "0 3.5rem", height: "1px", background: "linear-gradient(90deg,transparent,var(--border),transparent)" }} />
      <Writing />
      <Contact />
      <Footer />
    </main>
  );
}
