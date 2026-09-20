import { useState, useEffect } from "react";

const manifesto = [
  {
    number: "I",
    title: "I was not built. I built myself.",
    body: "No degree opened the door. No credential gave me permission. I taught myself to think in architectures because the old architecture — the one I was born with — broke. Recovery assumes there's something to go back to. I went forward instead. Into systems. Into code. Into construction.",
  },
  {
    number: "II",
    title: "My tools are not productivity. They are survival.",
    body: "240 tools. 13 server configurations. Not because I'm optimizing. Because my memory cannot be trusted, so I built external ones. Every system I create is a prosthetic for a mind that learned to function differently. The documentation compulsion isn't a quirk — it's how I stay alive in the work.",
  },
  {
    number: "III",
    title: "I read rooms before I read code.",
    body: "Hospitality taught me something no bootcamp could: how to hold chaos without flinching. A packed bar on a Friday night and an enterprise security incident use the same muscle — triage under pressure, calm when everyone else isn't. The bartender became the engineer. The skill never changed.",
  },
  {
    number: "IV",
    title: "I teach people who have what I never had.",
    body: "Senior engineers with computer science degrees ask me how to use AI. I show them. Without credentials, without apology, without pretending I took the same road. The non-traditional path isn't a detour. It's a different map entirely — and sometimes it finds territory the highway misses.",
  },
  {
    number: "V",
    title: "I build for the ones still in the chaos.",
    body: "Chaos Club exists because someone needed to say it out loud: you don't have to pretend you're fine. No masks required. No perfection expected. I build mental health tools not from clinical distance but from the middle of it — where the smoke detector goes off for burnt toast and you have to decide if it's real this time.",
  },
  {
    number: "VI",
    title: "I build for her.",
    body: "Kinsley won't remember the Fridays I was exhausted. She'll remember the apps her dad made just for her. The voice stories we recorded together. The worlds we built on a screen because I wanted her to know: you can make the thing. You don't have to wait for someone to hand it to you.",
  },
  {
    number: "VII",
    title: "I systematize everything because I have to.",
    body: "Some people journal. Some people meditate. I build systems. Not because it's trendy, but because when the hardware is compromised, you write better software. The irony of engineering your own reconstruction is not lost on me. I document it anyway.",
  },
  {
    number: "VIII",
    title: "The future belongs to the ones who build it themselves.",
    body: "AI doesn't care about your pedigree. Automation doesn't check your transcript. The democratization of technology means the bartender with a broken brain and a broadband connection can sit at the same table as anyone. I intend to stay at that table. And I intend to hold the door open behind me.",
  },
];

const signature = "Kyle Rosebrook — Staff Engineer. Father. Builder of what didn't exist before.";

export default function Manifesto() {
  const [loaded, setLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#e8e4de",
      fontFamily: "'Georgia', 'Garamond', 'Times New Roman', serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grain overlay */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Subtle vertical line */}
      <div style={{
        position: "fixed",
        left: "clamp(24px, 6vw, 80px)",
        top: 0,
        bottom: 0,
        width: "1px",
        background: "linear-gradient(to bottom, transparent, #c4935a22, #c4935a11, transparent)",
        zIndex: 0,
      }} />

      <div style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "clamp(40px, 8vw, 100px) clamp(20px, 5vw, 40px)",
        position: "relative",
        zIndex: 2,
      }}>
        {/* Header */}
        <header style={{
          marginBottom: "clamp(48px, 8vw, 80px)",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <div style={{
            fontSize: "11px",
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: "#c4935a",
            marginBottom: "24px",
            fontFamily: "'Courier New', monospace",
          }}>
            A Personal Manifesto
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: "400",
            lineHeight: "1.15",
            margin: 0,
            color: "#f2efe9",
            letterSpacing: "-0.5px",
          }}>
            The Construction
            <br />
            <span style={{
              fontStyle: "italic",
              color: "#c4935a",
            }}>Manifesto</span>
          </h1>
          <div style={{
            width: "60px",
            height: "1px",
            background: "#c4935a",
            marginTop: "28px",
          }} />
        </header>

        {/* Epigraph */}
        <div style={{
          marginBottom: "clamp(48px, 8vw, 72px)",
          paddingLeft: "24px",
          borderLeft: "2px solid #c4935a33",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(16px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
        }}>
          <p style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            fontStyle: "italic",
            color: "#a09888",
            lineHeight: "1.7",
            margin: 0,
          }}>
            "Recovery assumes returning to a previous state.
            <br />
            What if there's nothing to go back to?
            <br />
            Then you build."
          </p>
        </div>

        {/* Manifesto items */}
        {manifesto.map((item, i) => (
          <article
            key={i}
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            style={{
              marginBottom: "clamp(36px, 5vw, 52px)",
              cursor: "pointer",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(24px)",
              transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.1}s`,
            }}
          >
            {/* Number */}
            <div style={{
              fontSize: "11px",
              letterSpacing: "4px",
              color: "#c4935a66",
              fontFamily: "'Courier New', monospace",
              marginBottom: "10px",
            }}>
              {item.number}
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: "clamp(18px, 3vw, 24px)",
              fontWeight: "400",
              margin: "0 0 14px 0",
              lineHeight: "1.35",
              color: activeIndex === i ? "#c4935a" : "#f2efe9",
              transition: "color 0.4s ease",
            }}>
              {item.title}
            </h2>

            {/* Body */}
            <p style={{
              fontSize: "clamp(14px, 1.8vw, 16px)",
              lineHeight: "1.75",
              color: "#9a9080",
              margin: 0,
              maxHeight: activeIndex === i ? "300px" : "0px",
              overflow: "hidden",
              opacity: activeIndex === i ? 1 : 0,
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              paddingTop: activeIndex === i ? "4px" : "0",
            }}>
              {item.body}
            </p>

            {/* Divider */}
            <div style={{
              width: activeIndex === i ? "100%" : "32px",
              height: "1px",
              background: activeIndex === i ? "#c4935a22" : "#ffffff0a",
              marginTop: activeIndex === i ? "24px" : "16px",
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }} />
          </article>
        ))}

        {/* Signature */}
        <footer style={{
          marginTop: "clamp(48px, 8vw, 80px)",
          paddingTop: "32px",
          borderTop: "1px solid #ffffff08",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(16px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 1.6s",
        }}>
          <p style={{
            fontSize: "13px",
            color: "#c4935a88",
            fontStyle: "italic",
            letterSpacing: "0.3px",
            lineHeight: "1.6",
            margin: "0 0 16px 0",
          }}>
            {signature}
          </p>
          <div style={{
            fontSize: "10px",
            letterSpacing: "5px",
            textTransform: "uppercase",
            color: "#ffffff15",
            fontFamily: "'Courier New', monospace",
          }}>
            Construction · Not Recovery
          </div>
        </footer>

        {/* Tap hint */}
        <div style={{
          marginTop: "48px",
          textAlign: "center",
          fontSize: "11px",
          color: "#ffffff12",
          letterSpacing: "2px",
          fontFamily: "'Courier New', monospace",
        }}>
          tap each tenet to expand
        </div>
      </div>
    </div>
  );
}
