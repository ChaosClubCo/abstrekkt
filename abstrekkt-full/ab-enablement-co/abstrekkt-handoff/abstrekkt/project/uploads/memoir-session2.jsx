import { useState } from "react";

const SEEDS = [
  {
    id: 1,
    title: "The age question",
    source: "Oscillating: 19 → 21 → 19 across three consecutive messages in Storyteller Pro",
    question: "Do you know? Or is the honest answer \"I don't know\"? If you don't know — what's the earliest specific memory you actually have, stripped of the number, just the event?",
    statuses: ["CONFIRMED DATE", "INTENTIONALLY UNRESOLVED", "CAN'T REACH IT"],
    note: "The oscillation between 19 and 21 is the memoir's thesis in action. A reliable narrator says 'I was 19.' Your narrator says 'I was 19 — or 21 — I've told this story both ways and I'm not sure which is the lie.'"
  },
  {
    id: 2,
    title: "\"Relief is the most addictive feeling of all\"",
    source: "Emerged during the Storyteller Pro couch scene draft — first use chapter",
    question: "When you read it now, does it land as true? And if so — relief from what, specifically? The inner monologue? The self-monitoring? Something you'd call noise?",
    statuses: ["TRUE AS WRITTEN", "CLOSE BUT NOT QUITE", "AI EXTRAPOLATION"],
    note: "This is the only line from the entire Storyteller Pro conversation that passes the voice test. It inverts the expected addiction frame (chasing highs) with something more precise (chasing silence). Seven words that might explain the next 18 years."
  },
  {
    id: 3,
    title: "The late-night walk (age 17)",
    source: "\"Counting streetlights. I remember thinking: if I don't find a way to quiet my head, it's going to tear me apart.\"",
    question: "Did this happen? Not necessarily this specific walk — but a pre-dependency moment where you articulated the problem to yourself, out loud or internally?",
    statuses: ["THIS HAPPENED", "SOMETHING LIKE THIS — HERE'S WHAT'S DIFFERENT", "AI GENERATED FROM EMOTIONAL LOGIC"],
    note: "'Counting streetlights' reads as early evidence of the pattern-seeking behavior that would later become the 240+ tools. If real, it's the earliest data point in the book — the moment the architecture was already under strain."
  },
  {
    id: 4,
    title: "The couch permission scene",
    source: "\"You don't have to.\" That was the permission I needed. Not pressure — permission.",
    question: "Was there an actual couch? A specific person? A first time that felt like permission rather than pressure?",
    statuses: ["GROUNDED IN ACTUAL MEMORY", "EMOTIONAL TRUTH, CONSTRUCTED SCENE", "DIFFERENT — HERE'S WHAT ACTUALLY HAPPENED"],
    note: "The mechanism is what matters: not transgression, not rebellion, but permission. If that's accurate, it maps to a broader pattern — Kyle doesn't break rules, he finds frameworks that allow him to. That's a fundamentally different origin story than most addiction memoirs tell."
  },
  {
    id: 5,
    title: "The monitor reflection",
    source: "First day at Intinc — seeing your reflection in a dark screen before it boots",
    question: "Do you actually remember your first day at Intinc? Was there a moment of orientation — realizing something had shifted? Or was it more mundane than the Storyteller Pro version?",
    statuses: ["REAL MEMORY EXISTS", "CAN'T ACCESS IT", "DIFFERENT SCENE WORTH KEEPING"],
    note: "This was pitched as a prologue — it shouldn't be (too resolved, too neat). But as a buried mid-book moment, the dark-to-lit-screen transition works as a motif for moving from self-observation to engagement. Needs demotion, not deletion."
  }
];

const TRACK2 = [
  {
    id: "room",
    label: "The room",
    sub: "O'Toole's — sensory inventory",
    prompts: [
      "What did it smell like?",
      "What was the bar's layout? Where did you stand? Where were the regulars?",
      "What time did your shift typically start? End?",
      "What did 'competent' feel like in your body back then — when a shift was going well?"
    ],
    note: "Sensory details before meaning-making. Flag anything with visual weight as [SCENE POTENTIAL]."
  },
  {
    id: "skill",
    label: "The skill",
    sub: "Reading the room — locate it specifically",
    prompts: [
      "What was the actual mechanism? How did you know when a table was about to turn bad? When a regular was off?",
      "Did you have a name for it at the time, or was it just something you did?",
      "Was this a skill you were taught, or one you discovered you had?",
      "Was it reliable? Did it ever fail badly?"
    ],
    note: "The book's argument is that you rebuilt this skill using external systems after the break. The original version was organic, interior. The book needs to understand what the unassisted version felt like so readers can feel the difference later."
  },
  {
    id: "timeline",
    label: "The timeline",
    sub: "Rough mapping — gaps are data",
    prompts: [
      "O'Toole's / Bartending: [years? ages?]",
      "Management: [years? ages?]",
      "Quality Control: [years? ages?]",
      "First interest in code: [when? what prompted it?]",
      "First engineering job: [company? year?]",
      "Intinc: [year?]"
    ],
    note: "Wherever you're uncertain, write 'unclear.' Gaps are not failures — they're data about what the break took and what the reconstruction had to work around."
  },
  {
    id: "signal",
    label: "The signal",
    sub: "Before the break — was there signal?",
    prompts: [
      "Was there anything in the hospitality years that in retrospect reads as early evidence of the strain?",
      "A coping behavior that seemed functional at the time? A pattern of overcompensation?",
      "The counting-streetlights equivalent — if that's real?",
      "Or: nothing. If pre-break Kyle was genuinely functional, that's equally important to establish."
    ],
    note: "Not looking for a dramatic warning sign. If there was nothing — if the break arrived without signal — that matters for the book's argument. Don't reach for continuity that isn't there."
  }
];

const BACKGROUND_QUESTIONS = [
  "What does pre-injury Kyle feel like to remember? Pride? Distance? Grief?",
  "What would he think of constructed Kyle?",
  "What's permanently lost? What exists now that couldn't have existed before?",
  "How does building Chaos Club relate to writing this book? Are they the same project?",
  "What does Kinsley see? What will she understand when she's older?"
];

export default function MemoirSession2() {
  const [track, setTrack] = useState("track1");
  const [seedStatuses, setSeedStatuses] = useState({});
  const [openSection, setOpenSection] = useState("room");
  const [showBackground, setShowBackground] = useState(false);
  const [showS3, setShowS3] = useState(false);

  const handleStatus = (id, status) => {
    setSeedStatuses(prev => ({
      ...prev,
      [id]: prev[id] === status ? null : status
    }));
  };

  const markedCount = Object.values(seedStatuses).filter(Boolean).length;

  const statusColor = (status, seedId) => {
    const active = seedStatuses[seedId] === status;
    if (!active) return {
      bg: "var(--color-background-secondary)",
      color: "var(--color-text-secondary)",
      border: "0.5px solid var(--color-border-tertiary)"
    };
    const map = {
      "CONFIRMED DATE": { bg: "var(--color-background-success)", color: "var(--color-text-success)", border: "0.5px solid var(--color-border-success)" },
      "THIS HAPPENED": { bg: "var(--color-background-success)", color: "var(--color-text-success)", border: "0.5px solid var(--color-border-success)" },
      "REAL MEMORY EXISTS": { bg: "var(--color-background-success)", color: "var(--color-text-success)", border: "0.5px solid var(--color-border-success)" },
      "TRUE AS WRITTEN": { bg: "var(--color-background-success)", color: "var(--color-text-success)", border: "0.5px solid var(--color-border-success)" },
      "GROUNDED IN ACTUAL MEMORY": { bg: "var(--color-background-success)", color: "var(--color-text-success)", border: "0.5px solid var(--color-border-success)" },
      "INTENTIONALLY UNRESOLVED": { bg: "var(--color-background-warning)", color: "var(--color-text-warning)", border: "0.5px solid var(--color-border-warning)" },
      "CLOSE BUT NOT QUITE": { bg: "var(--color-background-warning)", color: "var(--color-text-warning)", border: "0.5px solid var(--color-border-warning)" },
      "EMOTIONAL TRUTH, CONSTRUCTED SCENE": { bg: "var(--color-background-warning)", color: "var(--color-text-warning)", border: "0.5px solid var(--color-border-warning)" },
      "SOMETHING LIKE THIS — HERE'S WHAT'S DIFFERENT": { bg: "var(--color-background-warning)", color: "var(--color-text-warning)", border: "0.5px solid var(--color-border-warning)" },
      "DIFFERENT — HERE'S WHAT ACTUALLY HAPPENED": { bg: "var(--color-background-warning)", color: "var(--color-text-warning)", border: "0.5px solid var(--color-border-warning)" },
    };
    return map[status] || {
      bg: "var(--color-background-danger)", color: "var(--color-text-danger)", border: "0.5px solid var(--color-border-danger)"
    };
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", maxWidth: 740, margin: "0 auto", padding: "2rem 1.25rem" }}>
      <h2 className="sr-only">Literary memoir session 2 — foundations and confirmation</h2>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-secondary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Literary memoir</span>
          <span style={{ color: "var(--color-border-secondary)" }}>·</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-secondary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Session 2</span>
        </div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 10px", lineHeight: 1.2 }}>Foundations & Confirmation</h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.7, maxWidth: 560 }}>
          Two tracks. First: confirm or correct the 5 scene seeds from the Storyteller Pro excavation. Second: open the hospitality years — the only period with almost no raw material yet.
        </p>
      </div>

      {/* Context strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8, marginBottom: "2rem" }}>
        {[
          ["Thesis", "locked"],
          ["Voice DNA", "v2 live"],
          ["Scene seeds", "5 mined"],
          ["Chapters drafted", "0"],
        ].map(([label, val]) => (
          <div key={label} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 12px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Track tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid var(--color-border-tertiary)", marginBottom: "2rem" }}>
        {[
          ["track1", "Track 1", "Seed confirmation", `${markedCount}/5 marked`],
          ["track2", "Track 2", "Before the break", "Hospitality years"],
        ].map(([id, label, title, meta]) => (
          <button key={id} onClick={() => setTrack(id)} style={{
            background: "none", border: "none",
            borderBottom: track === id ? "2px solid var(--color-text-primary)" : "2px solid transparent",
            padding: "8px 20px 8px 0", cursor: "pointer", textAlign: "left", marginBottom: -1
          }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
              {label} · <span style={{ color: track === id ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>{meta}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: track === id ? 500 : 400, color: track === id ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>{title}</div>
          </button>
        ))}
      </div>

      {/* Track 1 */}
      {track === "track1" && (
        <div>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
            Each seed needs a single honest answer before it becomes usable. No elaboration required — just the status mark and any corrections. These cannot be built on until grounded.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {SEEDS.map(seed => {
              const active = seedStatuses[seed.id];
              return (
                <div key={seed.id} style={{
                  background: "var(--color-background-primary)",
                  border: active ? "0.5px solid var(--color-border-secondary)" : "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "var(--border-radius-lg)", padding: "1.25rem"
                }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em",
                      background: "var(--color-background-secondary)", color: "var(--color-text-secondary)",
                      border: "0.5px solid var(--color-border-tertiary)",
                      borderRadius: 4, padding: "3px 7px", whiteSpace: "nowrap", marginTop: 2
                    }}>SEED {seed.id}</span>
                    <h3 style={{
                      fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 500,
                      color: "var(--color-text-primary)", margin: 0, lineHeight: 1.3
                    }}>{seed.title}</h3>
                  </div>

                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 10, fontStyle: "italic", lineHeight: 1.5 }}>
                    {seed.source}
                  </div>

                  <p style={{ fontSize: 14, color: "var(--color-text-primary)", margin: "0 0 10px", lineHeight: 1.7 }}>
                    {seed.question}
                  </p>

                  <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 1rem", lineHeight: 1.6, paddingLeft: 12, borderLeft: "2px solid var(--color-border-tertiary)" }}>
                    {seed.note}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {seed.statuses.map(s => {
                      const styles = statusColor(s, seed.id);
                      return (
                        <button key={s} onClick={() => handleStatus(seed.id, s)} style={{
                          background: styles.bg, color: styles.color, border: styles.border,
                          borderRadius: "var(--border-radius-md)", padding: "5px 10px",
                          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.04em",
                          cursor: "pointer"
                        }}>
                          [{s}]
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Track 2 */}
      {track === "track2" && (
        <div>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
            The hospitality years are the only period with almost no material yet. This is all raw excavation — sensory inventory, no meaning-making, no drafting.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {TRACK2.map(sec => {
              const isOpen = openSection === sec.id;
              return (
                <div key={sec.id} style={{
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "var(--border-radius-lg)", overflow: "hidden",
                  background: "var(--color-background-primary)"
                }}>
                  <button onClick={() => setOpenSection(isOpen ? null : sec.id)} style={{
                    width: "100%", background: "none", border: "none",
                    padding: "1rem 1.25rem", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{sec.sub}</div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)" }}>{sec.label}</div>
                    </div>
                    <span style={{ color: "var(--color-text-secondary)", fontSize: 20, fontWeight: 300, lineHeight: 1, marginLeft: 12 }}>{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 1.25rem 1.25rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
                      <ul style={{ margin: "1rem 0 0.75rem", padding: "0 0 0 1.25rem", display: "flex", flexDirection: "column", gap: 8 }}>
                        {sec.prompts.map((p, i) => (
                          <li key={i} style={{ fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.7 }}>{p}</li>
                        ))}
                      </ul>
                      <div style={{
                        fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6,
                        paddingLeft: 12, borderLeft: "2px solid var(--color-border-tertiary)"
                      }}>{sec.note}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "1rem 1.25rem" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>not this session</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Tool archaeology (Session 3)", "The Rupture (Session 4+)", "Drafting anything", "Structural decisions", "Meaning-making"].map(item => (
                <span key={item} style={{
                  fontSize: 11, color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)",
                  background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "var(--border-radius-md)", padding: "3px 9px"
                }}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Session output targets */}
      <div style={{ marginTop: "2.5rem", borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: "1.5rem" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>session output targets</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(0, 1fr))", gap: 8, marginBottom: "1.5rem" }}>
          {[
            ["5 seeds marked", markedCount >= 5 ? "done" : `${markedCount}/5`, markedCount >= 5 ? "success" : "default"],
            ["O'Toole's sensory inventory", "pending", "default"],
            ["Reading-the-room: one specific instance", "pending", "default"],
            ["Rough timeline with gaps labeled", "pending", "default"],
          ].map(([label, val, type]) => (
            <div key={label} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4, lineHeight: 1.4 }}>{label}</div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
                color: type === "success" ? "var(--color-text-success)" : "var(--color-text-secondary)"
              }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setShowBackground(!showBackground)} style={{
            fontSize: 13, color: "var(--color-text-secondary)", background: "none",
            border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)",
            padding: "7px 14px", cursor: "pointer"
          }}>
            Background questions {showBackground ? "−" : "+"}
          </button>
          <button onClick={() => setShowS3(!showS3)} style={{
            fontSize: 13, color: "var(--color-text-secondary)", background: "none",
            border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)",
            padding: "7px 14px", cursor: "pointer"
          }}>
            Next: Session 3 plan {showS3 ? "−" : "+"}
          </button>
        </div>

        {showBackground && (
          <div style={{ marginTop: 12, background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "1rem 1.25rem" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>keep in the background — not for today</div>
            <ul style={{ margin: 0, padding: "0 0 0 1.25rem", display: "flex", flexDirection: "column", gap: 8 }}>
              {BACKGROUND_QUESTIONS.map((q, i) => (
                <li key={i} style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{q}</li>
              ))}
            </ul>
          </div>
        )}

        {showS3 && (
          <div style={{ marginTop: 12, background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "1rem 1.25rem" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>session 3: tool archaeology</div>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 8px", lineHeight: 1.6 }}>
              Chronological mapping of 240+ tools as archaeological evidence of cognitive reconstruction. Each tool marks a moment when an organic function was discovered to be unreliable and needed external scaffolding.
            </p>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
              Prerequisite: O'Toole's excavation and seed confirmation complete. The hospitality baseline needs to exist before the archaeology can show what was lost.
            </p>
          </div>
        )}
      </div>

      {/* Marker legend */}
      <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>excavation markers</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px" }}>
          {[
            ["[SCENE POTENTIAL]", "flag visual weight or emotional charge"],
            ["[BOUNDARY]", "stop here, do not pursue"],
            ["[CONFIRMED DATE]", "memory pinned to a specific time"],
            ["[AI EXTRAPOLATION]", "generated from emotional logic, not sourced memory"],
          ].map(([marker, def]) => (
            <div key={marker} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-primary)" }}>{marker}</span>
              <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{def}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
