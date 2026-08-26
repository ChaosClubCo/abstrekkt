import { useState, useEffect } from "react";

const manifesto = [
  {
    number: "I",
    title: "The diagnostic instinct survived everything else.",
    body: "At the bar I knew which guy was about to start trouble before he moved. In quality control, I read processes the way I used to read drunks. In code, I diagnose system failures before the error log catches up. Same skill. Different substrate. The architecture broke. The instinct didn't. This is the one thing the cognitive disruption left intact, and the entire reconstruction was built on top of it.",
  },
  {
    number: "II",
    title: "I am not in recovery. I am under construction.",
    body: "There is a difference. Recovery assumes the old self is still in there, waiting to be excavated. The old self is gone. The hardware was changed by what happened to it. Whatever I am now is not a restoration. It is a different person, built out of non-standard materials, using a process I am still inventing while I live inside it.",
  },
  {
    number: "III",
    title: "My systems are prosthetic memory, not productivity.",
    body: "About thirty tools I use deeply. A handful of MCP configurations. The rest is catalog — and the catalog is real, too, because sometimes the act of building the system is what tells me I had a thought. The documentation isn't organization. It's the place I keep things when my head won't.",
  },
  {
    number: "IV",
    title: "Reading the room is also a way of not being in it.",
    body: "The instinct that survived is not free. Diagnosing a moment is not the same as being inside it. Some of the precision in my voice is the precision of distance. The systems saved me and the systems keep me at arm's length from the thing that broke me. Both are true. The book I am writing knows this. So does Kinsley, in the way kids know things they can't name yet.",
  },
  {
    number: "V",
    title: "I show up where I am.",
    body: "I work a service desk by day and build agent platforms at night. Both are real. The credentialed path didn't open, so I built a different one in the margins. I'm not what my title says. I'm not what my title undersells either. I'm a person who keeps showing up at the work I'm paid for and uses the rest of the available hours to make something the door wouldn't open for.",
  },
  {
    number: "VI",
    title: "I don't break rules. I find frameworks that allow me.",
    body: "The first time someone offered me a way to quiet my head, what they handed me wasn't a substance. It was permission. I am still careful about permission. I have watched it become a load-bearing pattern in my life — once for damage, now for construction. The frameworks I trust now are the ones I built. Including this one.",
  },
  {
    number: "VII",
    title: "Chaos Club is the same project as the book.",
    body: "The mental health platform I am building is not separate from this story. It is the version of the story I am building for the people still inside their own. No masks. No clinical distance. The crisis protocols are written by someone who's been there. I'm not selling recovery. I'm offering construction tools to people who, like me, are not going back anywhere.",
  },
  {
    number: "VIII",
    title: "This whole construction project is, finally, for her.",
    body: "Kinsley will not remember the Fridays I was tired. She will remember the apps her dad made for her. The voice stories. The worlds we drew on a screen because I wanted her to know she could build the thing herself — that she didn't have to wait for someone to hand it to her. The book I am writing is a letter. She is the only reader who has to understand it. The rest is overflow.",
  },
];

const signature = "Kyle Rosebrook — Mundelein, Illinois.";
const stamp = "Construction · Not Recovery";

export default function Manifesto() {
  const [loaded, setLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [allOpen, setAllOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const toggleAll = () => {
    setAllOpen(!allOpen);
    setActiveIndex(null);
  };

  const isOpen = (i) => allOpen || activeIndex === i;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0907",
        color: "#f2efe9",
        fontFamily: "'Georgia', 'Garamond', 'Times New Roman', serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric radial */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at 15% 10%, rgba(196, 147, 90, 0.05) 0%, transparent 45%), radial-gradient(ellipse at 85% 90%, rgba(196, 147, 90, 0.03) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Grain overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.05 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Vertical hairline */}
      <div
        style={{
          position: "fixed",
          left: "clamp(24px, 6vw, 80px)",
          top: 0,
          bottom: 0,
          width: "1px",
          background:
            "linear-gradient(to bottom, transparent, rgba(196, 147, 90, 0.22), rgba(196, 147, 90, 0.1), transparent)",
          zIndex: 0,
        }}
      />

      {/* Toolbar */}
      <div
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 10,
          display: "flex",
          gap: "0.6rem",
        }}
      >
        <button
          onClick={toggleAll}
          style={{
            background: allOpen ? "#c4935a" : "rgba(10, 9, 7, 0.7)",
            color: allOpen ? "#0a0907" : "#a09888",
            border: `1px solid ${allOpen ? "#c4935a" : "rgba(255,255,255,0.06)"}`,
            padding: "0.5rem 0.85rem",
            cursor: "pointer",
            fontFamily: "'Courier New', monospace",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            backdropFilter: "blur(8px)",
            transition: "all 0.25s ease",
          }}
        >
          {allOpen ? "Collapse" : "Expand all"}
        </button>
      </div>

      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "clamp(40px, 8vw, 100px) clamp(20px, 5vw, 40px)",
          position: "relative",
          zIndex: 3,
        }}
      >
        {/* Header */}
        <header
          style={{
            marginBottom: "clamp(48px, 8vw, 80px)",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "6px",
              textTransform: "uppercase",
              color: "#c4935a",
              marginBottom: "24px",
              fontFamily: "'Courier New', monospace",
            }}
          >
            A Personal Manifesto
          </div>
          <h1
            style={{
              fontSize: "clamp(32px, 6vw, 56px)",
              fontWeight: "400",
              lineHeight: "1.15",
              margin: 0,
              color: "#f2efe9",
              letterSpacing: "-0.5px",
            }}
          >
            The Construction
            <br />
            <span style={{ fontStyle: "italic", color: "#c4935a" }}>
              Manifesto
            </span>
          </h1>
          <div
            style={{
              width: "60px",
              height: "1px",
              background: "#c4935a",
              marginTop: "28px",
            }}
          />
        </header>

        {/* Epigraph */}
        <div
          style={{
            marginBottom: "clamp(48px, 8vw, 72px)",
            paddingLeft: "24px",
            borderLeft: "2px solid rgba(196, 147, 90, 0.2)",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(16px)",
            transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}
        >
          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              fontStyle: "italic",
              color: "#a09888",
              lineHeight: "1.8",
              margin: 0,
            }}
          >
            Recovery assumes returning to a previous state.
            <br />
            There was nothing to return to.
            <br />
            So I built.
          </p>
        </div>

        {/* Manifesto items */}
        {manifesto.map((item, i) => {
          const open = isOpen(i);
          return (
            <article
              key={i}
              onClick={() => {
                if (allOpen) return;
                setActiveIndex(activeIndex === i ? null : i);
              }}
              style={{
                marginBottom: "clamp(36px, 5vw, 52px)",
                cursor: allOpen ? "default" : "pointer",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(24px)",
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${
                  0.4 + i * 0.08
                }s`,
              }}
            >
              {/* Number */}
              <div
                style={{
                  fontSize: "11px",
                  letterSpacing: "4px",
                  color: open ? "#c4935a" : "rgba(196, 147, 90, 0.45)",
                  fontFamily: "'Courier New', monospace",
                  marginBottom: "10px",
                  transition: "color 0.4s ease",
                }}
              >
                {item.number}
              </div>

              {/* Title */}
              <h2
                style={{
                  fontSize: "clamp(18px, 3vw, 24px)",
                  fontWeight: "400",
                  margin: "0 0 14px 0",
                  lineHeight: "1.35",
                  color: open ? "#c4935a" : "#f2efe9",
                  transition: "color 0.4s ease",
                }}
              >
                {item.title}
              </h2>

              {/* Body */}
              <p
                style={{
                  fontSize: "clamp(14px, 1.8vw, 16px)",
                  lineHeight: "1.75",
                  color: "#9a9080",
                  margin: 0,
                  maxHeight: open ? "400px" : "0px",
                  overflow: "hidden",
                  opacity: open ? 1 : 0,
                  transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  paddingTop: open ? "4px" : "0",
                }}
              >
                {item.body}
              </p>

              {/* Divider */}
              <div
                style={{
                  width: open ? "100%" : "32px",
                  height: "1px",
                  background: open
                    ? "rgba(196, 147, 90, 0.22)"
                    : "rgba(255, 255, 255, 0.04)",
                  marginTop: open ? "24px" : "16px",
                  transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </article>
          );
        })}

        {/* Signature */}
        <footer
          style={{
            marginTop: "clamp(48px, 8vw, 80px)",
            paddingTop: "32px",
            borderTop: "1px solid rgba(255, 255, 255, 0.04)",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(16px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 1.6s",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "rgba(196, 147, 90, 0.6)",
              fontStyle: "italic",
              letterSpacing: "0.3px",
              lineHeight: "1.6",
              margin: "0 0 16px 0",
            }}
          >
            {signature}
          </p>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "5px",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.12)",
              fontFamily: "'Courier New', monospace",
            }}
          >
            {stamp}
          </div>
        </footer>

        {/* Tap hint */}
        <div
          style={{
            marginTop: "48px",
            textAlign: "center",
            fontSize: "10px",
            color: "rgba(255, 255, 255, 0.1)",
            letterSpacing: "2px",
            fontFamily: "'Courier New', monospace",
          }}
        >
          tap each tenet to expand
        </div>
      </div>
    </div>
  );
}
