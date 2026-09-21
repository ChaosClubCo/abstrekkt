import { useState, useEffect } from "react";

const THINKERS = [
  { name: "Pseudo-Dionysius", era: "5th c.", tradition: "Christian Mysticism", insight: "God transcends all categories, including existence and nonexistence as we ordinarily understand them. The truest statement about God is what God is not.", color: "#a0856a" },
  { name: "Meister Eckhart", era: "13th c.", tradition: "Christian Mysticism", insight: "Distinguished the personified God of worship from the Gottheit — the Godhead — a desert of silence beyond all attributes. 'The ground without ground, the abyss from which all things emerge.'", color: "#a0856a" },
  { name: "Ibn Arabi", era: "12th c.", tradition: "Sufi Islam", insight: "Wahdat al-wujud: the unity of being. God is not a being who created the world from outside — God is the being of the world, its continuous self-disclosure.", color: "#7a9e8a" },
  { name: "Baruch Spinoza", era: "17th c.", tradition: "Philosophy", insight: "Deus sive Natura. One infinite, self-causing substance. God is the necessary structure of existence, not a person standing behind it. Excommunicated at 23 for this.", color: "#7a7aae" },
  { name: "Paul Tillich", era: "20th c.", tradition: "Theology", insight: "God is not a being. God is being-itself — the ground that makes all beings possible. You cannot ask whether being-itself exists. Existence is what being-itself is.", color: "#ae8a5a" },
  { name: "Martin Heidegger", era: "20th c.", tradition: "Philosophy", insight: "The Seinsfrage: the question of Being itself. Western thought catalogued beings while forgetting the deeper question. The ontological difference — between beings and Being — is the forgotten question.", color: "#7a7aae" },
];

const PARADOXES = [
  {
    name: "The Problem of Evil",
    old: "If God is all-powerful and all-good, why does suffering exist? Every theodicy attempts to justify the behavior of an agent who chose not to prevent harm — and none fully succeeds.",
    reframed: "The principle of existence does not choose. Asking why God permits suffering is like asking why mathematics permits negative numbers. It's a category error. The problem depends entirely on God being an agent — remove the agent, and the problem dissolves into a different, starker question: what is the cost of being real?"
  },
  {
    name: "Conflict with Science",
    old: "If God designed life, Darwin is a threat. If God created in six days, geology is a threat. Only one account of origins can be correct.",
    reframed: "Science describes how existence operates. The word God names the fact that existence operates at all. These answer different questions — one asks how, the other names the that. Evolution is not an alternative to God; it is one of the shapes existence takes in the domain of biology."
  },
  {
    name: "The Creator Regress",
    old: "If God created everything, who created God? Any being that exists seems to require an explanation for its existence, generating an infinite regress.",
    reframed: "A definition is not the kind of thing that requires a prior cause. It is the terminus of the explanatory chain, not another link in it. Asking 'who created the principle of existence?' is like asking what is north of the North Pole — not a question cleverly dodged, but one that has no coherent application."
  },
  {
    name: "The Hiddenness of God",
    old: "A loving personal God who wants relationship but remains hidden from sincere seekers looks indistinguishable from a God who does not exist.",
    reframed: "Existence is not hidden — it is the most pervasive, inescapable fact there is. The 'hiddenness' was never a property of God. It was an artifact of scanning the room for a person while standing in the very space the word God was always trying to indicate."
  }
];

const IMPLICATIONS = [
  { area: "Ethics", icon: "⚖", color: "#c9a84c", summary: "Compassion as recognition, not obedience", detail: "If every being arises from the same ground, then to harm another is to act in contradiction to what you are — to deny the unity that constitutes your own existence. Morality rooted in ontology rather than authority may be more durable than either divine command or social contract." },
  { area: "Practice", icon: "◌", color: "#7a9e8a", summary: "Prayer becomes attention, worship becomes awe", detail: "The contemplative traditions were never really about petitioning a cosmic manager. They were about attention — the disciplined turning of consciousness toward the ground of its own existence. Under the reframing, this is what they always were." },
  { area: "Death", icon: "∞", color: "#a0856a", summary: "Not ejection from existence — transformation within it", detail: "The wave does not survive the ocean, but the wave was never other than the ocean. Your particular pattern of consciousness will end. The existence that produced and sustained it cannot end — because existence is what endings happen within." },
  { area: "Civilization", icon: "⊕", color: "#7a7aae", summary: "No exclusive franchise to defend", detail: "If the principle of existence is universal by definition, no tradition owns it. Every tradition is a particular, culturally shaped encounter with the same fundament. Holy wars become incoherent. Ecological destruction becomes self-mutilation." },
];

const SECTIONS = ["The Problem", "Intellectual History", "The Reframing", "The Bridge", "Implications"];

const POSITION_DATA = {
  believer: {
    label: "Holding some form of faith",
    symbol: "✦",
    color: "#c9a84c",
    context: "This essay doesn't ask you to abandon your tradition. It asks you to hold your images more lightly — to treat the personified God as a pointer rather than a portrait. The psalms still reach. The burning bush is still burning.",
    getsRight: "Existence is not a neutral backdrop. It calls for a response. The materialist worldview leaves something essential out — the dimension of meaning, the reality of the sacred encounter, the fact that awe is not a malfunction.",
    limitation: "The personified God of popular theism — cosmic monarch, selective intervenor, tribal champion — has become incoherent. Holding images as portraits rather than pointers closes off the deeper reality the images were always trying to indicate."
  },
  atheist: {
    label: "Finding the God-hypothesis unconvincing",
    symbol: "⊘",
    color: "#7a9e8a",
    context: "Every critique of the agent-God stands here. What the essay asks is that you notice the narrowness of the target. The God that's been effectively dismantled is not the God of Eckhart, Spinoza, or Tillich. It's not the God whose name is I AM.",
    getsRight: "The agent-God is incoherent. There is no credible evidence for supernatural intervention. Religious institutions have wielded fictitious divine authority to cause real harm. The atheist critique, at its best, is a genuine theological service.",
    limitation: "Defining God narrowly enough that the rejection is easy wins the argument by choosing the opponent. Most serious theologians across history would also reject the God being defeated. The question of fundamental existence remains untouched."
  },
  seeker: {
    label: "Finding neither camp adequate",
    symbol: "◎",
    color: "#d4724a",
    context: "You were the intended reader. The sense that the question hasn't been asked correctly is the correct starting point — not a failure to choose sides, but the beginning of the right question.",
    getsRight: "The unease with both camps is well-founded. Both are fighting over a definition neither has examined. Both are oriented toward the wrong concept. The real question precedes the one being fought over.",
    limitation: "Without a reframe, the unease can produce paralysis — neither the comfort of tradition nor the clarity of rejection. The third position is a beginning, not a destination."
  }
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lato:ital,wght@0,300;0,400;0,700;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; background: #0c0b09; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #3a2a1a; border-radius: 2px; }
  
  @keyframes flicker {
    0%,100% { transform: scaleY(1) scaleX(1) translateX(-50%); opacity: 1; }
    20% { transform: scaleY(1.06) scaleX(0.96) translateX(-50%); opacity: 0.88; }
    50% { transform: scaleY(0.95) scaleX(1.04) translateX(-50%); opacity: 0.92; }
    75% { transform: scaleY(1.04) scaleX(0.97) translateX(-50%); opacity: 0.85; }
  }
  @keyframes flicker2 {
    0%,100% { transform: scaleY(1) scaleX(1) translateX(-50%); opacity: 0.9; }
    30% { transform: scaleY(1.1) scaleX(0.92) translateX(-50%); opacity: 0.7; }
    60% { transform: scaleY(0.92) scaleX(1.06) translateX(-50%); opacity: 0.8; }
  }
  @keyframes float-up {
    0% { opacity: 0.8; transform: translateY(0) translateX(0) scale(1); }
    50% { opacity: 0.5; transform: translateY(-20px) translateX(3px) scale(0.8); }
    100% { opacity: 0; transform: translateY(-40px) translateX(-2px) scale(0.2); }
  }
  @keyframes glow-pulse {
    0%,100% { box-shadow: 0 0 12px rgba(212,114,74,0.15); }
    50% { box-shadow: 0 0 24px rgba(212,114,74,0.3); }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .fade-up { animation: fade-up 0.45s ease forwards; }
  .fade-in { animation: fade-in 0.3s ease forwards; }
  
  button { cursor: pointer; font-family: inherit; }
  button:focus-visible { outline: 2px solid #d4724a; outline-offset: 2px; }
`;

function Fire({ size = 1 }) {
  const s = size;
  return (
    <div style={{ position: "relative", width: `${28*s}px`, height: `${44*s}px`, flexShrink: 0 }}>
      {/* Base glow */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: `${20*s}px`, height: `${8*s}px`,
        background: "radial-gradient(ellipse, rgba(212,114,74,0.4) 0%, transparent 70%)",
        borderRadius: "50%"
      }} />
      {/* Outer flame */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%",
        width: `${16*s}px`, height: `${32*s}px`,
        background: `linear-gradient(to top, #d4724a 0%, #c9a84c 40%, rgba(201,168,76,0.3) 80%, transparent 100%)`,
        borderRadius: "50% 50% 30% 30% / 60% 60% 40% 40%",
        animation: `flicker ${1.8*s+0.5}s ease-in-out infinite`,
        filter: `blur(${1.5*s}px)`,
        transformOrigin: "bottom center"
      }} />
      {/* Inner flame */}
      <div style={{
        position: "absolute", bottom: `${2*s}px`, left: "50%",
        width: `${8*s}px`, height: `${20*s}px`,
        background: `linear-gradient(to top, #fff3d4 0%, #f5c842 30%, rgba(245,200,66,0.4) 70%, transparent 100%)`,
        borderRadius: "50% 50% 30% 30% / 60% 60% 40% 40%",
        animation: `flicker2 ${1.4*s+0.3}s ease-in-out infinite`,
        filter: `blur(${0.8*s}px)`,
        transformOrigin: "bottom center"
      }} />
      {/* Embers */}
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          bottom: `${8*s + i*5*s}px`,
          left: `${10*s + (i-1)*4*s}px`,
          width: `${2*s}px`, height: `${2*s}px`,
          background: i === 1 ? "#c9a84c" : "#d4724a",
          borderRadius: "50%",
          animation: `float-up ${1.2 + i*0.5}s ease-in infinite ${i*0.7}s`,
          opacity: 0
        }} />
      ))}
    </div>
  );
}

function PositionSelector({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  const positions = [
    { id: "believer", label: "I hold some form of faith", desc: "Religious tradition, spiritual practice, or belief in something beyond the material" },
    { id: "atheist", label: "I find the God-hypothesis unconvincing", desc: "Evidence-based, skeptical. The cosmic-person God is not credible" },
    { id: "seeker", label: "Neither camp quite fits", desc: "Something real is being pointed at, but the debate feels wrong on both sides" },
  ];
  return (
    <div className="fade-up" style={{
      minHeight: "100vh", background: "#0c0b09", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "2rem",
      fontFamily: "'Lato', sans-serif"
    }}>
      <div style={{ maxWidth: "560px", width: "100%", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
          <Fire size={1.4} />
        </div>
        <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "0.7rem", letterSpacing: "0.25em", color: "#6b5a48", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          An Interactive Companion to
        </div>
        <h1 style={{
          fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(1.8rem,4vw,2.6rem)",
          color: "#e8dcc8", fontWeight: 400, lineHeight: 1.2, marginBottom: "0.75rem"
        }}>
          God as Definition
        </h1>
        <p style={{ color: "#7a6a58", fontSize: "0.9rem", marginBottom: "3rem", fontStyle: "italic" }}>
          Atrophy of Humans · March 2026
        </p>
        <p style={{ color: "#b0a090", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          Before entering, where do you stand in the debate this essay addresses?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {positions.map(p => (
            <button
              key={p.id}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(p.id)}
              style={{
                background: hovered === p.id ? "rgba(212,114,74,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${hovered === p.id ? "rgba(212,114,74,0.5)" : "rgba(232,220,200,0.08)"}`,
                borderRadius: "6px", padding: "1.1rem 1.4rem", textAlign: "left",
                transition: "all 0.2s", color: "#e8dcc8"
              }}
            >
              <div style={{ fontSize: "0.92rem", fontWeight: 700, marginBottom: "0.3rem", color: hovered === p.id ? "#d4724a" : "#e8dcc8", transition: "color 0.2s" }}>{p.label}</div>
              <div style={{ fontSize: "0.8rem", color: "#7a6a58", fontStyle: "italic" }}>{p.desc}</div>
            </button>
          ))}
        </div>
        <p style={{ color: "#4a3e32", fontSize: "0.75rem", marginTop: "2rem" }}>
          Your selection shapes how this companion surfaces the essay's response to your position.
        </p>
      </div>
    </div>
  );
}

function SectionNav({ active, onChange }) {
  return (
    <nav style={{
      position: "sticky", top: 0, height: "100vh", width: "200px", flexShrink: 0,
      padding: "2.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.2rem",
      borderRight: "1px solid rgba(232,220,200,0.05)", background: "#0c0b09", overflowY: "auto"
    }}>
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "2rem" }}>
        <Fire size={0.75} />
      </div>
      <div style={{ fontFamily: "'Libre Baskerville', serif", color: "#4a3e32", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
        Sections
      </div>
      {SECTIONS.map((s, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          style={{
            background: "none", border: "none", textAlign: "left", padding: "0.55rem 0",
            fontSize: "0.82rem", fontFamily: "'Lato', sans-serif", letterSpacing: "0.01em",
            color: active === i ? "#d4724a" : "#6b5a48",
            borderLeft: active === i ? "2px solid #d4724a" : "2px solid transparent",
            paddingLeft: "0.75rem", transition: "all 0.2s", lineHeight: 1.4
          }}
        >
          <span style={{ opacity: 0.5, marginRight: "0.4em", fontSize: "0.7rem" }}>{String(i+1).padStart(2,"0")}</span>
          {s}
        </button>
      ))}
      <div style={{ marginTop: "auto", paddingTop: "2rem", borderTop: "1px solid rgba(232,220,200,0.05)" }}>
        <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "1.4rem", color: "#2a2018", letterSpacing: "0.1em", fontStyle: "italic", lineHeight: 1 }}>
          I AM
        </div>
        <div style={{ fontSize: "0.65rem", color: "#3a2e22", marginTop: "0.3rem", fontStyle: "italic" }}>
          Ehyeh Asher Ehyeh
        </div>
      </div>
    </nav>
  );
}

function ProblemSection({ position }) {
  const pd = POSITION_DATA[position];
  return (
    <div className="fade-up">
      <SectionHeader num="01" title="The Problem" subtitle="A stalemate built on an unexamined definition" />
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2.5rem" }}>
        {[
          { label: "The Believer", desc: "Defends a personified agent: cosmic monarch, intelligent designer, mind behind the machinery.", dim: position !== "believer" },
          { label: "The Atheist", desc: "Rejects precisely this: the superpowered agent who answers some prayers and ignores others.", dim: position !== "atheist" },
          { label: "The Uncertain", desc: "Senses the word God points to something real — but something entirely different from what both camps are fighting over.", dim: position !== "seeker" },
        ].map((c, i) => (
          <div key={i} style={{
            background: c.dim ? "rgba(255,255,255,0.01)" : "rgba(212,114,74,0.06)",
            border: `1px solid ${c.dim ? "rgba(232,220,200,0.05)" : "rgba(212,114,74,0.25)"}`,
            borderRadius: "6px", padding: "1.25rem",
            opacity: c.dim ? 0.5 : 1, transition: "opacity 0.3s"
          }}>
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "0.85rem", color: c.dim ? "#6b5a48" : "#d4724a", marginBottom: "0.6rem", fontWeight: 700 }}>{c.label}</div>
            <div style={{ fontSize: "0.78rem", color: "#8a7a68", lineHeight: 1.65 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <Callout>
        The most consequential debate in human culture has been conducted for centuries on the basis of a definition that none of the parties has seriously examined. The question is not <em>does</em> God exist, but what <em>would</em> God be if God existed?
      </Callout>

      <BodyText>
        The dominant God of Western public discourse is a cosmic person — a being with a mind, a will, preferences, and emotions. This image has been disintegrating for four hundred years. Copernicus, Darwin, geology, cosmology, neuroscience — each has eroded its credibility. What they have not done is disprove the existence of a fundamental ground of being. They have refuted a <em>picture</em> of God, and most people on both sides have mistaken the picture for the thing itself.
      </BodyText>

      <BodyText>
        The result is a stalemate: the atheist wins by choosing a narrow target, the believer loses ground defending an indefensible image, and the void left behind — the unasked question of why anything exists at all — surfaces anyway, in depression, in Sunday-afternoon emptiness, in the persistence of awe among people who have abandoned religion entirely.
      </BodyText>

      <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "6px", padding: "1.5rem", marginTop: "2rem" }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b5a48", marginBottom: "0.75rem", fontFamily: "'Lato', sans-serif" }}>
          Your position · {pd.label}
        </div>
        <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: "italic", color: "#c9a84c", fontSize: "0.9rem", lineHeight: 1.75 }}>
          {pd.context}
        </div>
      </div>
    </div>
  );
}

function HistorySection() {
  const [active, setActive] = useState(null);
  return (
    <div className="fade-up">
      <SectionHeader num="02" title="Intellectual History" subtitle="The oldest insight in the tradition — buried under centuries of elaboration" />
      
      <BodyText>
        The idea that God is not a person but a principle — not a being among beings but the ground of being itself — is not novel. It has surfaced independently across traditions, centuries, and continents. The most rigorous minds in the theological tradition have been saying this for a thousand years. What is novel is its absence from mainstream conversation.
      </BodyText>

      <div style={{ margin: "2rem 0" }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b5a48", marginBottom: "1.25rem", fontFamily: "'Lato', sans-serif" }}>
          Select a thinker
        </div>
        {/* Timeline */}
        <div style={{ display: "flex", gap: "0", position: "relative", marginBottom: active !== null ? "0" : "0" }}>
          <div style={{ position: "absolute", top: "20px", left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(212,114,74,0.3), transparent)" }} />
          {THINKERS.map((t, i) => (
            <button
              key={i}
              onClick={() => setActive(active === i ? null : i)}
              style={{
                flex: 1, background: "none", border: "none", padding: "0 0.25rem",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem"
              }}
            >
              <div style={{
                width: "10px", height: "10px", borderRadius: "50%",
                background: active === i ? t.color : "rgba(212,114,74,0.3)",
                border: active === i ? `2px solid ${t.color}` : "2px solid rgba(212,114,74,0.3)",
                boxShadow: active === i ? `0 0 8px ${t.color}` : "none",
                transition: "all 0.2s", flexShrink: 0, marginTop: "15px"
              }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.68rem", color: active === i ? "#e8dcc8" : "#6b5a48", fontWeight: active === i ? 700 : 400, transition: "color 0.2s", lineHeight: 1.3 }}>{t.name.split(" ").slice(-1)[0]}</div>
                <div style={{ fontSize: "0.6rem", color: "#4a3e32" }}>{t.era}</div>
              </div>
            </button>
          ))}
        </div>

        {active !== null && (
          <div className="fade-in" style={{
            marginTop: "1.5rem", background: "rgba(255,255,255,0.02)",
            border: `1px solid ${THINKERS[active].color}30`, borderRadius: "6px", padding: "1.5rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <div>
                <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "1rem", color: "#e8dcc8", marginBottom: "0.2rem" }}>{THINKERS[active].name}</div>
                <div style={{ fontSize: "0.72rem", color: THINKERS[active].color, letterSpacing: "0.05em" }}>{THINKERS[active].tradition} · {THINKERS[active].era}</div>
              </div>
            </div>
            <div style={{ fontSize: "0.85rem", color: "#b0a090", lineHeight: 1.75, fontStyle: "italic" }}>
              {THINKERS[active].insight}
            </div>
          </div>
        )}
      </div>

      <Callout>
        These thinkers arrived at the same recognition from within traditions that also contained — and officially promoted — the personified, agent-God they were quietly transcending. They were not atheists. They were the opposite: people who took the idea of God so seriously that they could not accept any image of it smaller than reality itself.
      </Callout>

      <BodyText>
        The questions at the frontier of contemporary science converge on the same point. The contingency problem — why does this universe exist rather than none, or a different one? — is live at the edge of cosmology. The hard problem of consciousness remains a conceptual boundary that further neuroscience alone cannot cross. Science describes the structure of reality with extraordinary precision. What it does not and cannot do is explain why there is a reality to have a structure in the first place.
      </BodyText>
    </div>
  );
}

function ReframingSection() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="fade-up">
      <SectionHeader num="03" title="The Reframing" subtitle="Not a new theology. A claim about what the word has always meant." />

      <div style={{
        background: "rgba(212,114,74,0.06)", border: "1px solid rgba(212,114,74,0.25)",
        borderRadius: "8px", padding: "2rem", marginBottom: "2.5rem", textAlign: "center"
      }}>
        <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "0.75rem", color: "#6b5a48", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
          The Proposition
        </div>
        <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(1rem,2.5vw,1.3rem)", color: "#e8dcc8", lineHeight: 1.7, marginBottom: "1.25rem" }}>
          God is the name for the answer to the question:<br />
          <em style={{ color: "#d4724a" }}>Why is there something rather than nothing?</em>
        </div>
        <div style={{ fontSize: "0.8rem", color: "#7a6a58", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto" }}>
          Whatever that answer is — whether it can be fully articulated, whether it takes a form human cognition can grasp — that is what the word God properly refers to. Not a being within reality. The fundamental principle of reality itself.
        </div>
      </div>

      <BodyText>
        Moses asks for a name and receives <em>Ehyeh Asher Ehyeh</em> — I AM WHAT I AM. Not "I am the creator" or "I am the ruler." Just: I am. Pure, unqualified existence, prior to every role theology would later drape over it. Read without the accumulated weight of centuries, the text is not presenting God as a being who happens to also exist. It is identifying God with existence itself.
      </BodyText>

      <BodyText>
        To call God a definition is not to say God is "just a word." It is to insist the word point to something real — something maximally real — rather than to a character in a story. Not the biggest thing in the room. The room.
      </BodyText>

      <div style={{ marginTop: "2.5rem" }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b5a48", marginBottom: "1.25rem", fontFamily: "'Lato', sans-serif" }}>
          Paradoxes Dissolved
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {PARADOXES.map((p, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{
                  width: "100%", background: openIdx === i ? "rgba(212,114,74,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${openIdx === i ? "rgba(212,114,74,0.3)" : "rgba(232,220,200,0.06)"}`,
                  borderRadius: openIdx === i ? "6px 6px 0 0" : "6px",
                  padding: "1rem 1.25rem", textAlign: "left", display: "flex", justifyContent: "space-between",
                  alignItems: "center", transition: "all 0.2s"
                }}
              >
                <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "0.88rem", color: "#c9a84c" }}>{p.name}</span>
                <span style={{ color: "#6b5a48", fontSize: "0.9rem", transition: "transform 0.2s", transform: openIdx === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
              </button>
              {openIdx === i && (
                <div className="fade-in" style={{
                  background: "rgba(255,255,255,0.015)", border: "1px solid rgba(212,114,74,0.15)",
                  borderTop: "none", borderRadius: "0 0 6px 6px", padding: "1.25rem"
                }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    <div>
                      <div style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b5a48", marginBottom: "0.6rem" }}>Under the old frame</div>
                      <div style={{ fontSize: "0.8rem", color: "#7a6a58", lineHeight: 1.7, fontStyle: "italic" }}>{p.old}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(212,114,74,0.8)", marginBottom: "0.6rem" }}>Reframed</div>
                      <div style={{ fontSize: "0.8rem", color: "#b0a090", lineHeight: 1.7 }}>{p.reframed}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BridgeSection({ position }) {
  const pd = POSITION_DATA[position];
  const other = position === "believer" ? "atheist" : "believer";
  const od = POSITION_DATA[other];
  return (
    <div className="fade-up">
      <SectionHeader num="04" title="The Bridge" subtitle="Not a compromise. A reorientation." />

      <BodyText>
        The culture war between belief and unbelief has sorted people into camps defined by their answers. But answers are downstream of attention. The person who stands before the mystery of existence with genuine openness — whether from a cathedral or a laboratory — is in the right posture. The person who has foreclosed the mystery, whether by declaring "God has a plan" or by declaring "it's just physics," has turned away from the thing that matters most.
      </BodyText>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", margin: "2.5rem 0" }}>
        {[
          { id: position, label: `What ${pd.label.toLowerCase()} gets right`, right: pd.getsRight, limit: pd.limitation, color: pd.color, primary: true },
          { id: other, label: `What the other side gets right`, right: od.getsRight, limit: od.limitation, color: "#5a4e42", primary: false },
        ].map((side, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${side.primary ? side.color + "40" : "rgba(232,220,200,0.06)"}`,
            borderRadius: "6px", padding: "1.5rem", opacity: side.primary ? 1 : 0.75
          }}>
            <div style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: side.primary ? side.color : "#4a3e32", marginBottom: "0.75rem" }}>
              {side.label}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#b0a090", lineHeight: 1.7, marginBottom: "1rem" }}>{side.right}</div>
            <div style={{ borderTop: "1px solid rgba(232,220,200,0.06)", paddingTop: "0.85rem" }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a3e32", marginBottom: "0.5rem" }}>Limitation</div>
              <div style={{ fontSize: "0.78rem", color: "#6b5a48", lineHeight: 1.65, fontStyle: "italic" }}>{side.limit}</div>
            </div>
          </div>
        ))}
      </div>

      <Callout>
        The atheist who says "I do not know why there is something rather than nothing, and I find that astonishing" — and the mystic who says "God is beyond all names and images" — are closer to each other than either is to the dogmatist who claims to know God's will, or the dismissive materialist who declares the question uninteresting. Both have arrived at the edge of the same cliff. They differ about what to call the abyss. They do not differ about the abyss.
      </Callout>

      <BodyText>
        The science-versus-religion frame forces a false choice: think clearly about the world, or feel its gravity — as though intellectual honesty and existential depth are incompatible. Science describes how existence operates; the word God names the fact that existence operates at all. These are not rival accounts. They are answers to different questions, and both questions are real.
      </BodyText>
    </div>
  );
}

function ImplicationsSection() {
  const [activeImp, setActiveImp] = useState(null);
  return (
    <div className="fade-up">
      <SectionHeader num="05" title="Implications" subtitle="A reconceptualization that changes nothing about how we live is not a reconceptualization." />

      <BodyText>
        If the reframing is real, it should alter the posture from which we meet the world. Not by imposing new rules — the old God was sufficient in that department — but by shifting orientation. Posture is not a small thing. It is the difference between a life lived as though existence is a problem to be solved, and a life lived as though existence is a gift to be inhabited.
      </BodyText>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", margin: "2rem 0" }}>
        {IMPLICATIONS.map((imp, i) => (
          <button
            key={i}
            onClick={() => setActiveImp(activeImp === i ? null : i)}
            style={{
              background: activeImp === i ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${activeImp === i ? imp.color + "50" : "rgba(232,220,200,0.06)"}`,
              borderRadius: "6px", padding: "1.25rem 1.25rem",
              textAlign: "left", transition: "all 0.2s"
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <span style={{ fontSize: "1.2rem", color: imp.color, flexShrink: 0 }}>{imp.icon}</span>
              <div>
                <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "0.85rem", color: "#e8dcc8", marginBottom: "0.3rem" }}>{imp.area}</div>
                <div style={{ fontSize: "0.75rem", color: "#7a6a58", fontStyle: "italic", lineHeight: 1.5 }}>{imp.summary}</div>
              </div>
            </div>
            {activeImp === i && (
              <div className="fade-in" style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(232,220,200,0.06)", fontSize: "0.8rem", color: "#b0a090", lineHeight: 1.75 }}>
                {imp.detail}
              </div>
            )}
          </button>
        ))}
      </div>

      <div style={{
        background: "rgba(212,114,74,0.04)", border: "1px solid rgba(212,114,74,0.15)",
        borderRadius: "8px", padding: "2rem", marginTop: "2rem", textAlign: "center"
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <Fire size={0.9} />
        </div>
        <blockquote style={{
          fontFamily: "'Libre Baskerville', serif", fontSize: "0.92rem", fontStyle: "italic",
          color: "#c9a84c", borderLeft: "none", padding: 0, lineHeight: 1.85, maxWidth: "480px", margin: "0 auto"
        }}>
          There is a fire that burns without consuming what it burns. Moses approaches, terrified and transfixed. He asks the fire to identify itself. The fire says: <em>I am.</em>
        </blockquote>
        <p style={{ fontSize: "0.78rem", color: "#6b5a48", marginTop: "1.25rem", lineHeight: 1.7 }}>
          We have spent centuries building temples to the voice in the bush, arguing about the precise wording, killing each other over the interpretation. Perhaps it is time to walk up to the bush, feel the heat, and take the words at face value. Not <em>I am your lord.</em> Not <em>I am the creator of heaven and earth.</em> Just: <em>I am.</em> Existence, declaring itself. That is enough. That has always been enough.
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ num, title, subtitle }) {
  return (
    <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(232,220,200,0.06)" }}>
      <div style={{ fontSize: "0.65rem", color: "#4a3e32", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem", fontFamily: "'Lato', sans-serif" }}>{num}</div>
      <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(1.3rem,3vw,1.8rem)", color: "#e8dcc8", fontWeight: 400, marginBottom: "0.5rem" }}>{title}</h2>
      <p style={{ color: "#6b5a48", fontSize: "0.82rem", fontStyle: "italic" }}>{subtitle}</p>
    </div>
  );
}

function Callout({ children }) {
  return (
    <blockquote style={{
      borderLeft: "2px solid #d4724a", paddingLeft: "1.5rem", margin: "2rem 0",
      fontFamily: "'Libre Baskerville', serif", fontStyle: "italic", color: "#b0a090",
      fontSize: "0.9rem", lineHeight: 1.8
    }}>
      {children}
    </blockquote>
  );
}

function BodyText({ children }) {
  return (
    <p style={{ fontSize: "0.88rem", color: "#8a7a68", lineHeight: 1.85, marginBottom: "1.25rem", fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
      {children}
    </p>
  );
}

export default function App() {
  const [position, setPosition] = useState(null);
  const [section, setSection] = useState(0);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalCSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!position) return <PositionSelector onSelect={setPosition} />;

  const SECTION_COMPONENTS = [
    <ProblemSection position={position} />,
    <HistorySection />,
    <ReframingSection />,
    <BridgeSection position={position} />,
    <ImplicationsSection />,
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0c0b09", color: "#e8dcc8" }}>
      <SectionNav active={section} onChange={setSection} />
      <main style={{ flex: 1, padding: "3rem 3.5rem 4rem 3rem", maxWidth: "720px", overflowY: "auto" }} key={section}>
        {SECTION_COMPONENTS[section]}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(232,220,200,0.05)" }}>
          <button
            onClick={() => setSection(s => Math.max(0, s - 1))}
            disabled={section === 0}
            style={{
              background: "none", border: "1px solid rgba(232,220,200,0.08)", borderRadius: "4px",
              padding: "0.6rem 1.1rem", fontSize: "0.75rem", color: section === 0 ? "#3a2e22" : "#8a7a68",
              letterSpacing: "0.05em", cursor: section === 0 ? "default" : "pointer", transition: "all 0.2s"
            }}
          >
            ← Previous
          </button>
          <button
            onClick={() => setSection(s => Math.min(SECTIONS.length - 1, s + 1))}
            disabled={section === SECTIONS.length - 1}
            style={{
              background: section === SECTIONS.length - 1 ? "none" : "rgba(212,114,74,0.08)",
              border: `1px solid ${section === SECTIONS.length - 1 ? "rgba(232,220,200,0.08)" : "rgba(212,114,74,0.25)"}`,
              borderRadius: "4px", padding: "0.6rem 1.1rem", fontSize: "0.75rem",
              color: section === SECTIONS.length - 1 ? "#3a2e22" : "#d4724a",
              letterSpacing: "0.05em", cursor: section === SECTIONS.length - 1 ? "default" : "pointer", transition: "all 0.2s"
            }}
          >
            Next →
          </button>
        </div>
      </main>
    </div>
  );
}
