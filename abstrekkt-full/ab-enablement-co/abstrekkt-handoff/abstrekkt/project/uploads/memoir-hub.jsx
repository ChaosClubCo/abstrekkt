import { useState } from "react";

const PHASE_META = {
  BEFORE: { label: "BEFORE THE BREAK", color: "#4d7fc4", bg: "rgba(77,127,196,0.12)", border: "rgba(77,127,196,0.3)" },
  RUPTURE: { label: "THE RUPTURE", color: "#c45050", bg: "rgba(196,80,80,0.12)", border: "rgba(196,80,80,0.3)" },
  CONSTRUCTION: { label: "THE CONSTRUCTION", color: "#4ca876", bg: "rgba(76,168,118,0.12)", border: "rgba(76,168,118,0.3)" },
  GAPS: { label: "CRITICAL GAPS", color: "#c48a40", bg: "rgba(196,138,64,0.12)", border: "rgba(196,138,64,0.3)" },
  STRUCTURE: { label: "STRUCTURAL DECISIONS", color: "#8a55c4", bg: "rgba(138,85,196,0.12)", border: "rgba(138,85,196,0.3)" },
  META: { label: "META / CONTRAST", color: "#7a7a9a", bg: "rgba(122,122,154,0.12)", border: "rgba(122,122,154,0.3)" }
};

const ACTIONS = [
  {
    id: 1, phase: "BEFORE",
    title: "O'Toole's Sensory Excavation",
    description: "Retrieve the physical world of the bar before writing a word. What did competence feel like when memory worked?",
    prompt: `Memoir excavation session. Phase: BEFORE THE BREAK. Target: O'Toole's + hospitality years.

Don't write prose yet. Ask me three targeted sensory questions at a time to extract raw material from this period. Start with the physical environment — the bar, the work, the body. What did it smell like on a Saturday night?

After each response, push for specific details and contradictions between how it felt then vs. how it reads now. Flag if any answer sounds too resolved or clean. We're building the material bank for "Before the Break" — the chapter where competence existed in a body that still trusted its own memory.

Session format: Questions only, three at a time, until I say "enough for today."`
  },
  {
    id: 2, phase: "BEFORE",
    title: "Diagnostic Instinct Origins",
    description: "Map where the reading-the-room skill started. Bartending → QC → engineering — this is the memoir's narrative spine.",
    prompt: `Memoir excavation. Focus: The diagnostic instinct — where it started.

The narrative spine of this memoir is that my defining skill is DIAGNOSING — reading rooms, spotting the real problem behind the stated one. Started at O'Toole's (reading customers), carried through QC (reading processes), into engineering (reading systems). That instinct survived cognitive disruption and became the foundation for construction.

Ask me: What was the first time I remember knowing something was wrong before anyone else in the room did? Was this at O'Toole's? Earlier? What did that knowing feel like — intellectual or physical? Did I trust it?

Three questions at a time. Don't write prose yet. Push for specific scenes, not summaries.`
  },
  {
    id: 3, phase: "BEFORE",
    title: "What Memory Felt Like When It Worked",
    description: "Critical contrast material. Need the texture of a functioning mind — retrieved before documenting its loss.",
    prompt: `Memoir excavation. Topic: What competence felt like before the break — specifically, what memory felt like when it was reliable.

This is essential material because the entire book is built on the contrast between then and now. I need to retrieve specific sensory memories of holding complexity without systems: knowing who ordered what without writing it down, managing a full shift in my head, multi-threading without scaffolding.

Ask me: What's the most complex thing I held in my head without writing it down during the hospitality years? What did it feel like to not need a system? Did I ever think about memory, or was it just air — invisible because it worked?

Three questions at a time. Surface specifics, not conclusions. We're after the texture of a functioning mind before I knew it could break.`
  },
  {
    id: 4, phase: "RUPTURE",
    title: "The Rupture — First Pass",
    description: "Sensitive area. Rough notes only. Fragments, impressions, contradictions all welcome. No narrative shape required.",
    prompt: `Memoir excavation. Phase: THE RUPTURE. Handle carefully.

We are not writing a chapter today. Goal: rough notes only. I want to put down what I'm willing to put down right now about when things broke — fragments, impressions, questions, contradictions all count. No narrative shape required.

Start with this single question: What's the first specific moment you can point to where you noticed that old strategies had stopped working? Not the cause — just the moment of noticing. If there isn't a clean moment, what's the closest thing to one?

One question at a time. Hold space for uncertainty. Don't summarize what I say back to me — record it and ask the next thing. If I stop you, we stop.`
  },
  {
    id: 5, phase: "RUPTURE",
    title: "Ground the Relief Line",
    description: "\"No one tells you that relief is the most addictive feeling of all.\" Seven words. Needs real memory underneath.",
    prompt: `Memoir excavation. Focus: Grounding the line "No one tells you that relief is the most addictive feeling of all."

This line survived the voice test from earlier material. It's declarative, inverts the expected framing (chasing highs → chasing silence), reads like something true. Now it needs real memory underneath it.

Three questions, one at a time:
1. When I first used, was "relief" the right word? Or was it silence? Escape? Disappearance? Something with no name?
2. What was the noise that stopped? Be specific — what was actually loud inside my head before?
3. What had I tried before this that didn't produce relief?

Don't let me be vague. Push on every abstraction — "the noise," "the pressure," "the feeling" — make me name what it actually was.`
  },
  {
    id: 6, phase: "RUPTURE",
    title: "19 or 21 — The Age Oscillation",
    description: "The uncertainty IS the material. Earlier material: three corrections in three messages. Real answer or documented uncertainty — both serve the book.",
    prompt: `Memoir excavation. Focus: The age question — was it 19 or 21?

Context: In earlier material, I corrected the start date three times in three messages (19 → 21 → 19). That oscillation is the memoir's thesis in action — not error, evidence. A reliable narrator says "I was 19." Mine says "I was 19 — or 21 — I've told this both ways and I'm not sure which one is the lie."

Questions one at a time:
1. Right now, without looking anything up, what number comes first?
2. What specific memory is attached to that number — any sensory detail at all?
3. Could something have started at 19 and escalated at 21, making both true?

Don't accept "I don't know" as a final answer — push toward what I DO remember from each age. If honest uncertainty is the real answer, that uncertainty becomes the chapter opening.`
  },
  {
    id: 7, phase: "CONSTRUCTION",
    title: "First Tool Archaeology",
    description: "240+ tools as prosthetic cognition. Find the first nail. The specific moment of delegation — when a system did something your brain used to do.",
    prompt: `Memoir excavation. Phase: THE CONSTRUCTION. Focus: The first system.

The book's argument is that I built external cognition to replace internal function — 240+ tools as prosthetic memory. Every construction project has a first nail.

One question at a time:
1. What was the first thing — any thing: a notebook, a phone habit, an app, a ritual, a folder structure — that you remember thinking "this helps, this is different from what I was doing before"?
2. What specific problem was it solving? What kept falling through the cracks before it existed?
3. Was it embarrassing to need it? Did you hide that you were using it?

Push past "I started using calendar apps" to the specific instance where you realized the system was doing something your brain used to do. That moment of delegation — that's the first page of the construction chapter.`
  },
  {
    id: 8, phase: "CONSTRUCTION",
    title: "Chronological Tool Map",
    description: "Build the archaeological record in order: what appeared when, what crisis each answered, what emotion surrounded needing it.",
    prompt: `Memoir excavation. Focus: Building the chronological archaeology of the construction project.

We're mapping the tools/systems in historical order — not the current inventory, but the record of what I built when, and what crisis or need each one answered.

As I answer, build a running list in this format:
[APPROXIMATE PERIOD] — [TOOL/SYSTEM] — [PROBLEM IT SOLVED] — [EMOTION AROUND NEEDING IT]

Start here: What period came immediately after things broke? What year roughly? What was the very first thing I remember adding to my life that functioned as a system — even a crude one?

Build the list entry by entry. Each item should carry an emotional valence — was needing it shameful, practical, desperate, accidental? This becomes the archaeological record the memoir references.`
  },
  {
    id: 9, phase: "GAPS",
    title: "The Life Coach Figure",
    description: "Significant character with almost no documented material. Connects to the permission mechanism. May be load-bearing.",
    prompt: `Memoir excavation. Critical gap: The life coach figure.

This person appears in the architecture as significant but is almost entirely undocumented. Thematically connects to the "permission" mechanism from the couch scene — the pattern where permission unlocks what pressure never could. Barely any concrete material exists.

One question at a time:
1. Who was this person? How did you find them, or how did they find you?
2. What did they actually say or do that mattered — specific words if you have them, or the shape of what they said?
3. Why does this figure feel significant to the reconstruction story rather than just the recovery one?

Don't accept summaries. Push for specific scenes, specific words. If memory is genuinely thin here, document the thinness — it may tell us something about why this person mattered and why the memory resists.`
  },
  {
    id: 10, phase: "GAPS",
    title: "The Late-Night Walk — Real or Constructed?",
    description: "Verification pass: age 17, streetlights, hands in pockets, counting. Real memory or AI extrapolation that got absorbed as true?",
    prompt: `Memoir excavation. Focus: The late-night walk scene — verification pass.

Earlier material contained this: "Seventeen. Walking alone at night, hands in pockets, counting streetlights. I remember thinking: If I don't find a way to quiet my head, it's going to tear me apart."

This may be a real memory. Or it may be something a previous AI generated from emotional logic and I absorbed as memory. Both are usable — but the book needs to know which it's working with.

One question only:
Does this walk feel like a real memory when you read it? Is there a physical sensation of recognition — a specific location, temperature, a reason for being out that night? Or does it feel like emotional truth wearing a scene that never happened?

If it's real: where? What season? What prompted the walk?
If it's constructed but emotionally accurate: what's the actual pre-dependency moment where you articulated the problem to yourself, even privately?`
  },
  {
    id: 11, phase: "GAPS",
    title: "Meditation Practice — What Actually Shifted",
    description: "The 'I am open to this helping' reframe mirrors the book's thesis. When did it happen and what did it feel different?",
    prompt: `Memoir excavation. Focus: The meditation practice and the "I am open to this helping" reframe.

A documented pivot: from "I want this to work" to "I am open to this helping." This shift mirrors the construction vs. recovery thesis — stopping the demand for recovery, starting to allow construction. It may be load-bearing material.

One question at a time:
1. When did meditation enter the picture? What was it supposed to fix, and was that expectation part of the problem?
2. What was the specific moment or period when the approach actually shifted — gradual or a specific instance?
3. What does "I am open to this helping" actually feel different from "I want this to work" — in the body, not in concept?

Connect this to the Chaos Club philosophy only where it's genuinely true — not narrative convenience, but an actual throughline you recognize.`
  },
  {
    id: 12, phase: "STRUCTURE",
    title: "Draft Three Chapter Openings",
    description: "Three 300-word structural tests in voice. Commit to architecture based on what actually works, not theory.",
    prompt: `Memoir drafting session. Goal: test drive three structural options — write a single chapter opening (300 words max each) in my voice.

Commit to architecture based on what works, not what sounds good in theory.

Option A — Prologue: The Age Oscillation. Opens with me trying to tell an AI my life story and not knowing when it started. The inability to locate the beginning IS the beginning.

Option B — In medias res: O'Toole's on a Saturday night. Opens in the diagnostic body, before any break, before any system — pure functional competence in a body that doesn't know it's about to lose something.

Option C — The Construction: Opens in the present, 240 tools running, and works backward. The archaeological evidence first, the excavation as structure.

Voice reference: direct without cold. Metaphor-heavy. Technical precision where it serves. Strategic profanity where earned. Zero "And that's when I realized" constructions. Let the reader work. Declarative observations. Admissions of uncertainty about memory.

Write Option A first. Stop. Ask which one I want next.`
  },
  {
    id: 13, phase: "STRUCTURE",
    title: "Structural Commit — Pick One",
    description: "Honest recommendation required. Which architecture fits the material, serves the argument, and is actually executable?",
    prompt: `Memoir structure decision session. Based on everything excavated, I need to commit to one architecture before drafting chapters.

Four options:
1. Chronological with memory intrusions — linear timeline punctuated by memory breaks, mimicking how a damaged memory actually works
2. Systems as chapters — "The Calendar System," "The Documentation Compulsion," each tool as an entry point with personal history woven through
3. Parallel timelines — external career progression on one track, internal reconstruction on another, converging at present
4. The Arsenal structure — Chaos Club's categories as organizing principle, each chapter a different aspect of navigating chaos

Give me the honest case for each. Then give me your actual recommendation — not diplomatic options. Which one fits the material we have, creates the most room for the construction vs. recovery argument, and is executable given the constraints (writing in margins, genuine memory gaps)?

Tell me why the other three don't work as well.`
  },
  {
    id: 14, phase: "META",
    title: "The Failed First Draft — Chapter, Fragments, or Prologue?",
    description: "The Storyteller Pro attempt produced a redemption arc called 'FlashFusion: A Mind Unchained.' That failure is evidence. What do we do with it?",
    prompt: `Memoir decision. Topic: What to do with the Storyteller Pro failed first draft material.

Context: I previously tried to write this memoir with a different AI tool. It generated a redemption arc titled "FlashFusion: A Mind Unchained" — emoji chapter titles, cinematic openings, clean chronological structure. I kept correcting the premise, not the prose. The real book (construction vs. recovery) emerged from the failure of that first attempt. The AI couldn't hold the complexity. Kyle kept adding contradictions.

Three options:
A. Meta-chapter: "The Wrong Book" — 3-5 dedicated pages describing the attempt, showing the gap between what the tool produced and what the story required. The failure of the first draft as its own chapter about construction.
B. Scattered fragments — embed moments from the failure throughout as evidence: the 19/21 oscillation in the memory chapter, the "Mind Unchained" framing when discussing recovery vs. construction. Failure as texture rather than chapter.
C. Prologue reframe — open the book at the moment of trying and failing to tell an AI where the story started. The inability to locate the beginning IS the beginning.

Arguments for each, then your recommendation. The book is about construction — does the failure of the first draft become evidence or distraction?`
  }
];

const phaseOrder = ["BEFORE", "RUPTURE", "CONSTRUCTION", "GAPS", "STRUCTURE", "META"];

export default function MemoirHub() {
  const [copied, setCopied] = useState(null);

  const handleCopy = async (id, prompt) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = prompt;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#070b12",
      fontFamily: "'Georgia', serif",
      color: "#ced4e8",
      padding: "0 0 60px 0"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .card { transition: border-color 0.2s, transform 0.15s; }
        .card:hover { transform: translateY(-1px); }
        .copy-btn { transition: all 0.15s; cursor: pointer; }
        .copy-btn:hover { filter: brightness(1.2); }
        .copy-btn:active { transform: scale(0.97); }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1a2240",
        padding: "32px 40px 28px",
        background: "linear-gradient(180deg, #0a0f1e 0%, #070b12 100%)"
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "#4a6080",
            marginBottom: 10,
            textTransform: "uppercase"
          }}>
            Literary Memoir — Session Hub
          </div>
          <h1 style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 34,
            fontWeight: 500,
            margin: "0 0 6px",
            color: "#e8edf8",
            letterSpacing: "-0.01em"
          }}>
            Construction, Not Recovery
          </h1>
          <p style={{
            margin: 0,
            fontSize: 15,
            color: "#5a6888",
            fontFamily: "'EB Garamond', serif",
            fontStyle: "italic"
          }}>
            Click any action to copy its engineered prompt — then paste it here to start that session.
          </p>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        background: "#0a0f1e",
        borderBottom: "1px solid #141c30",
        padding: "12px 40px",
        display: "flex",
        gap: 32,
        overflowX: "auto"
      }}>
        {[
          { label: "Phase", value: "Early Excavation" },
          { label: "Chapters drafted", value: "0" },
          { label: "Material bank", value: "In progress" },
          { label: "Structure committed", value: "No" },
          { label: "Scenes verified", value: "Pending" }
        ].map(item => (
          <div key={item.label} style={{ whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#384060", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {item.label}
            </span>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#8898b8", marginTop: 2 }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 40px" }}>
        {phaseOrder.map(phase => {
          const phaseActions = ACTIONS.filter(a => a.phase === phase);
          const meta = PHASE_META[phase];
          return (
            <div key={phase} style={{ marginTop: 44 }}>
              {/* Phase Header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 16
              }}>
                <div style={{
                  width: 3,
                  height: 22,
                  background: meta.color,
                  borderRadius: 2,
                  flexShrink: 0
                }} />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  color: meta.color,
                  textTransform: "uppercase",
                  fontWeight: 500
                }}>
                  {meta.label}
                </span>
                <div style={{ flex: 1, height: 1, background: "#141c30" }} />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: "#2a3450",
                  letterSpacing: "0.1em"
                }}>
                  {phaseActions.length} {phaseActions.length === 1 ? "action" : "actions"}
                </span>
              </div>

              {/* Cards */}
              <div style={{ display: "grid", gap: 10 }}>
                {phaseActions.map(action => (
                  <div
                    key={action.id}
                    className="card"
                    style={{
                      background: "#0c1220",
                      border: `1px solid ${meta.border}`,
                      borderRadius: 8,
                      padding: "18px 20px",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 16,
                      alignItems: "center"
                    }}
                  >
                    {/* Left */}
                    <div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 5
                      }}>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          color: "#2a3858",
                          letterSpacing: "0.1em"
                        }}>
                          #{String(action.id).padStart(2, "0")}
                        </span>
                        <h3 style={{
                          fontFamily: "'EB Garamond', serif",
                          fontSize: 17,
                          fontWeight: 500,
                          margin: 0,
                          color: "#dde4f4",
                          letterSpacing: "-0.01em"
                        }}>
                          {action.title}
                        </h3>
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: 13,
                        color: "#5a6a88",
                        lineHeight: 1.5,
                        fontFamily: "'EB Garamond', serif",
                        fontStyle: "italic"
                      }}>
                        {action.description}
                      </p>
                    </div>

                    {/* Copy Button */}
                    <button
                      className="copy-btn"
                      onClick={() => handleCopy(action.id, action.prompt)}
                      style={{
                        background: copied === action.id ? meta.bg : "transparent",
                        border: `1px solid ${copied === action.id ? meta.color : "#1e2840"}`,
                        borderRadius: 6,
                        padding: "8px 16px",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        letterSpacing: "0.1em",
                        color: copied === action.id ? meta.color : "#3a4a68",
                        whiteSpace: "nowrap",
                        minWidth: 100,
                        textAlign: "center",
                        outline: "none"
                      }}
                    >
                      {copied === action.id ? "COPIED ✓" : "COPY PROMPT"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div style={{
          marginTop: 56,
          paddingTop: 24,
          borderTop: "1px solid #141c30",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 32
        }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#2a3450", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
              Session protocol
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#3a4a68", fontFamily: "'EB Garamond', serif", fontStyle: "italic", lineHeight: 1.6 }}>
              Excavation → Material Bank → Voice-Matched Drafting.<br />
              Surface before shaping. Specifics before themes. Draft in passes.
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#2a3450", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
              Working thesis
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "#3a4a68", fontFamily: "'EB Garamond', serif", fontStyle: "italic", maxWidth: 260, lineHeight: 1.6, textAlign: "right" }}>
              "Construction of what never existed<br />rather than recovery of what was lost."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
