import React from 'react';
import { Compass, TrendingUp, Flag, AlertCircle } from 'lucide-react';

const ARC = {
  title: 'The Construction Arc',
  em: 'Construction',
  sub: 'Memoir to first manuscript draft · literary nonfiction · letter to Kinsley · comps: Solomon, Maté, Cahalan',
  meta: { kicker: 'Lane 03 // Memoir trajectory', target: 'Y1 = full first manuscript draft complete' },
  tradeoff: {
    gain: 'A complete first manuscript draft by M12. Sixteen-plus chapters that survive structural review. The Five excavated. Living-people legal protection in place. A book that is "construction, not recovery" in every paragraph — when a reader thinks "brave recovery story," the book failed. Y2 begins query letters from material strength, not aspirational hope.',
    giveUp: 'Speed in the other lanes. The 7-11am cognitive window is memoir-shaped — not FlashFusion-shaped. Some weeks the excavation work surfaces material that requires recovery time, not output time. Comfortable narrative arcs (the temptation of "and that\'s when I realized"). Anything performative.',
    principle: 'Excavate specifics before themes. Sensory first. Surface what isn\'t remembered as material, not as gap. Preserve contradictions. The thesis is "construction, not recovery" — every chapter must earn it without naming it.',
  },
  monthly: [
    {
      m: 1, gate: 'Session 3 Tool Archaeology completed · 3 chapters unblocked',
      weeks: [
        'Session 3 Tool Archaeology prep: review 13 outstanding excavation tasks, identify Tool Archaeology specific scope, schedule 7-11am Wednesday block',
        'Tool Archaeology excavation session 1 — sensory specifics, technical emotion descriptions, what Kyle doesn\'t remember (treat absence as material)',
        'Tool Archaeology session 2 — contradictions surfaced, surface vs depth, the diagnostic-instinct spine',
        'Tool Archaeology raw material consolidated into project files. Three chapters now unblocked structurally',
      ],
    },
    {
      m: 2, gate: 'Tom Ropel excavation executed',
      weeks: [
        'Tom Ropel excavation prep: review what\'s known, what\'s unknown, what Kyle protects. Best-friend-by-itself-chapter framing',
        'Tom Ropel session 1 — sensory, scenes, specific moments. No themes yet. No "what it meant"',
        'Tom Ropel session 2 — contradictions, what Kyle protects and why. Pseudonym discussion if living',
        'Tom Ropel raw consolidated. Chapter-shape preliminary, not locked',
      ],
    },
    {
      m: 3, gate: 'Dave Datt excavation executed',
      weeks: [
        'Dave Datt excavation prep: brain aneurysm context, pre-event Dave, what Kyle remembers vs what\'s structured-into-story',
        'Dave Datt session 1: scenes if accessible, sensory specifics, technical descriptions of the medical event without dramatization',
        'Dave Datt session 2: pre-event Dave, what\'s lost, what\'s structured-into-memory after the fact',
        'Dave Datt raw consolidated. Q1 retro — three of The Five excavated, two remaining',
      ],
    },
    {
      m: 4, gate: 'Internal timeline reframed · SPECT + Aug 2 scenes drafted',
      weeks: [
        'Internal date conflict (p2 "summer 2020" vs p3 "Oct 2021"): reframe as memoir material, not error to resolve. The unreliability is the spine',
        'Follow-up SPECT scan scene drafted — sensory + clinical, no interpretation imposed on contemporary self',
        'Aug 2 2022 results review scene drafted — Easton/Creado present, the moment the cognitive data lands',
        'Three timeline scenes connected. Voice consistency check across the trio',
      ],
    },
    {
      m: 5, gate: 'First 3 chapters drafted from excavated material',
      weeks: [
        'Chapter 1 draft from O\'Toole\'s excavation — reading rooms as the diagnostic-instinct origin',
        'Chapter 2 draft from Tool Archaeology — the diagnostic-instinct surviving cognitive disruption',
        'Chapter 3 draft from card table material — building Soaring Bear\'s site as the self-teaching origin',
        'Voice consistency check across 3 chapters. Maté/Solomon/Cahalan comp re-read for calibration',
      ],
    },
    {
      m: 6, gate: 'Mid-year audit · Beta reader #1 selected + briefed · 5 chapters drafted',
      weeks: [
        'Mid-year audit honest: chapters drafted vs excavation still pending. What\'s the actual completion arc',
        'Beta reader #1 selection: structural reader, not friend reader. Someone who reads Solomon/Maté for pleasure',
        'Beta reader brief drafted: frame, comps, what to read for (construction not recovery; pacing; voice consistency)',
        'Mid-year retro kept private (memoir lane discipline — not Prompt edition material)',
      ],
    },
    {
      m: 7, gate: '8 chapters drafted · Sudowrite manuscript merged',
      weeks: [
        'Chapters 4-5 drafts from Tom Ropel material — best-friend chapter sits alone if it needs to',
        'Chapter 6 draft from Dave Datt material — technical-emotion description, brain aneurysm without dramatization',
        'Sudowrite manuscript merge: integrate parallel work. Voice unification pass',
        '8 chapters drafted. Mid-manuscript voice audit honest — where does "recovery story" leak in',
      ],
    },
    {
      m: 8, gate: 'Beta reader #1 feedback integrated · Voice refined',
      weeks: [
        'Beta reader #1 feedback received. Structural critique reviewed without defensiveness',
        'Feedback integration: voice consistency, structural gaps, missing material flagged for re-excavation',
        'Chapters 9-10 drafts. Settlement / Trump Tower / The Five contextual material',
        'Q3 retro. Chapter 10 close. Sensitive material legal-review queue identified',
      ],
    },
    {
      m: 9, gate: 'Michael journal attorney review initiated',
      weeks: [
        'Michael journal attorney review: initial conversation, scope of review, cost estimate, timeline',
        'Attorney review continues. Pseudonym tracking spreadsheet begins for all living people',
        'Chapters 11-12 drafts. Continue forward while legal review runs parallel',
        'Attorney initial guidance integrated. Living-people pseudonym decisions begin',
      ],
    },
    {
      m: 10, gate: 'Pseudonyms locked · Release tracking begins',
      weeks: [
        'Pseudonym locks for all named living people: who appears as themselves with release, who as pseudonym',
        'Release request drafts for those willing to be named. Legal language reviewed by attorney',
        'Release tracking spreadsheet active. Chapter 13 draft (Sedona / Soaring Bear context)',
        'Release responses tracked. Q4 retro. Living-people coverage honest assessment',
      ],
    },
    {
      m: 11, gate: 'Manuscript draft 75%+ complete · Beta reader #2 brought in',
      weeks: [
        'Manuscript at ~75% — assess structurally what\'s left, what\'s incomplete, what to cut',
        'Beta reader #2 brought in if available (broader-audience reader vs structural-reader from M6)',
        'Chapters 14-15 drafts. Hard chapters drafted before Y1 close',
        'Manuscript at 90%. Hardest material drafted. Voice consistency maintained',
      ],
    },
    {
      m: 12, gate: 'First full manuscript draft complete · Y2 plan locked',
      weeks: [
        'First full manuscript draft complete. Mark and celebrate the milestone — Y1 commitment hit',
        'Y2 plan: query letters, comps positioning (Solomon/Maté/Cahalan exact framing), agent shortlist',
        'Comps positioning: where this book sits on the literary nonfiction shelf, who it sits next to',
        'Y2 plan published in PROJECT_STATE.md. Year close. First read-through of complete manuscript begins',
      ],
    },
  ],
  yearGate: 'By M12, the first full manuscript draft exists. Sixteen-plus chapters. The Five excavated. Living-people legal protection in place. Voice consistent. Construction-not-recovery thesis intact across every paragraph. Y2 begins query letters from material strength, not aspirational hope.',
  claims: [
    'Genre is literary nonfiction. Comps are Solomon (The Noonday Demon), Maté (In the Realm of Hungry Ghosts), Cahalan (Brain on Fire). If a draft passage reads as recovery memoir, it has failed — regardless of accuracy.',
    'The frame is letter to Kinsley. She is the primary reader. Every passage must survive her reading it at age 18, 25, 35. Zero interiority projected onto her, no speculation about her perspective, no instrumentalizing her.',
    'No "and that\'s when I realized" — that phrase and all variants are banned. No performative vulnerability. No epiphanies. No clean arc resolution. Yes to declarative observations, technical emotion descriptions, uncertainty admissions, humor that doesn\'t defuse tension prematurely, contradictions preserved as material.',
    'Recursive trap framing is load-bearing: addiction caused brain injury (hypoxia from OD), injury made escape harder. Don\'t simplify this into "addiction story" or "brain injury story" — it is structurally both, recursively.',
    'The Five (Matt Horne, Tom Ropel, Dave Datt, Ryan, [fifth]): Matt + Ryan have prior material. Tom + Dave excavation scheduled M2 + M3. Tom is a chapter-by-itself. Dave died (brain aneurysm). Treat with care; never push on flagged sensitive threads.',
    'Substance timeline is confirmed source material, handled with care, never surfaced in public-facing content. Settlement $50K spent over several months on various purchases including Trump Tower weekend — Kyle paid for everything.',
    'Cognitive profile (Total Brain Jul 2022) is data, not metaphor: Processing Speed 99th percentile, Recall Memory 12th, Flexibility 17th, Resilience 2nd. The thesis lives in the data: engine full speed, storage empty → tools as prosthetic memory.',
    'Michael journal = highest legal risk per project description. Attorney review before any publication or public excerpting. Do not draft or surface Michael journal content in public-facing output under any framing.',
    'Pseudonyms required for all living people until written releases obtained. M9-M10 of this arc explicitly schedules attorney work and release tracking — these are not afterthoughts; they\'re gating.',
    'Memoir outputs (excavation text, drafted prose, scenes) go to `/mnt/project/` not temp directories, and deliver inline unless Kyle requests file output. This arc artifact is a planning tool, not memoir content — it can be a file.',
    'Book 1 ("Breathe Through the Bullsh*t") is nuked — never reference. This arc is the only memoir trajectory. Old framing is dead.',
  ],
};

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Crimson+Pro:ital,wght@0,400;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #0e0a06;
  --bg-2: #16100a;
  --bg-3: #1f180f;
  --fg: #f0e7d6;
  --fg-dim: #a09682;
  --fg-mute: #6b6253;
  --border: #2a2014;
  --border-bright: #38291a;
  --brass: #cbb582;
  --brass-soft: #d9c89a;
  --brass-deep: #a8945e;
}

body, .root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 15px; line-height: 1.65;
}

.root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 60% 40% at 50% -10%, rgba(203,181,130,0.08), transparent 60%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1100px; margin: 0 auto; }

.header { padding-bottom: 28px; border-bottom: 1px solid var(--border); margin-bottom: 36px; }
.kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em;
  color: var(--brass); margin: 0 0 16px;
  display: flex; align-items: center; gap: 8px;
}
.title-serif {
  font-family: 'Fraunces', serif; font-size: clamp(54px, 8vw, 108px);
  line-height: 0.92; letter-spacing: -0.02em; margin: 0; font-weight: 400; color: var(--fg);
}
.title-serif em { color: var(--brass); font-style: italic; }
.title-sub {
  font-family: 'Crimson Pro', Georgia, serif; font-style: italic;
  font-size: 18px; color: var(--fg-dim); margin: 16px 0 0; max-width: 64ch; line-height: 1.55;
}
.title-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; color: var(--fg-mute); margin-top: 16px;
  letter-spacing: 0.15em; text-transform: uppercase;
}
.title-meta strong { color: var(--brass-soft); font-weight: 500; }

.tradeoff {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
  background: var(--border); border: 1px solid var(--border);
  margin-bottom: 36px;
}
.tradeoff-cell { background: var(--bg-2); padding: 22px 26px; }
.tradeoff-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.24em; text-transform: uppercase;
  color: var(--fg-mute); margin-bottom: 10px;
}
.tradeoff-text {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 15px; color: var(--fg); line-height: 1.65;
}
.tradeoff-principle {
  grid-column: 1 / -1; padding: 18px 26px;
  background: rgba(203,181,130,0.05); border-top: 1px dashed var(--border-bright);
  font-family: 'Fraunces', serif; font-style: italic;
  font-size: 18px; color: var(--brass-soft); line-height: 1.5;
}
.tradeoff-principle-label {
  font-family: 'JetBrains Mono', monospace; font-style: normal;
  font-size: 9.5px; letter-spacing: 0.24em; color: var(--brass);
  text-transform: uppercase; margin-right: 12px;
}

.months { border: 1px solid var(--border); background: var(--bg-2); margin-bottom: 36px; }
.month { display: grid; grid-template-columns: 90px 1fr; border-top: 1px solid var(--border); }
.month:first-child { border-top: none; }
.month-num {
  padding: 20px 18px; background: var(--bg-3);
  border-right: 1px solid var(--border);
  font-family: 'Fraunces', serif; font-style: italic;
  font-size: 32px; color: var(--brass); line-height: 1;
}
.month-num-sub {
  font-family: 'JetBrains Mono', monospace; font-style: normal;
  font-size: 9px; letter-spacing: 0.18em; color: var(--fg-mute);
  text-transform: uppercase; margin-top: 6px;
}
.month-body { padding: 20px 24px; }
.month-gate {
  display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  padding-bottom: 14px; border-bottom: 1px dashed var(--border-bright);
}
.month-gate-icon { color: var(--brass); opacity: 0.7; }
.month-gate-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--fg-mute); margin-right: 4px;
}
.month-gate-text {
  font-family: 'Fraunces', serif; font-style: italic;
  font-size: 18px; color: var(--fg); line-height: 1.4;
}

.weeks { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.week {
  display: grid; grid-template-columns: 28px 1fr; gap: 10px;
  align-items: start; padding: 6px 0;
}
.week-num {
  font-family: 'Fraunces', serif; font-style: italic;
  font-size: 15px; color: var(--brass); line-height: 1.4;
}
.week-text {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 13.5px; color: var(--fg-dim); line-height: 1.55;
}

.year-gate {
  padding: 28px 30px; margin-bottom: 36px;
  background: var(--bg-2); border: 1px solid var(--border);
  border-left: 3px solid var(--brass);
}
.year-gate-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.24em; color: var(--brass);
  text-transform: uppercase; margin-bottom: 14px;
  display: flex; align-items: center; gap: 8px;
}
.year-gate-text {
  font-family: 'Fraunces', serif; font-style: italic;
  font-size: 24px; color: var(--fg); line-height: 1.4;
}

.claims {
  padding: 24px 26px; border: 1px solid var(--border);
  background: var(--bg-2);
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 13.5px; color: var(--fg-dim); line-height: 1.7;
}
.claims h4 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.24em; color: var(--fg);
  text-transform: uppercase; margin: 0 0 14px;
  display: flex; align-items: center; gap: 8px;
}
.claims ul { margin: 6px 0; padding-left: 22px; }
.claims li { margin-bottom: 8px; }
.claims strong { color: var(--fg); font-weight: 400; font-style: italic; }

@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.stagger > * { opacity: 0; animation: rise 0.45s ease forwards; }
.stagger > *:nth-child(1) { animation-delay: 0.04s; }
.stagger > *:nth-child(2) { animation-delay: 0.10s; }
.stagger > *:nth-child(3) { animation-delay: 0.16s; }

@media (max-width: 820px) {
  .tradeoff { grid-template-columns: 1fr; }
  .month { grid-template-columns: 70px 1fr; }
  .month-num { padding: 14px 12px; font-size: 26px; }
  .weeks { grid-template-columns: 1fr; }
}
`;

export default function MemoirArc() {
  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container stagger">

          <div className="header">
            <p className="kicker"><Compass size={12} /> {ARC.meta.kicker}</p>
            <h1 className="title-serif">The <em>{ARC.em}</em> Arc.</h1>
            <p className="title-sub">{ARC.sub}</p>
            <div className="title-meta">
              Horizon <strong>12 months</strong> · {ARC.meta.target} · Lane <strong>Memoir</strong>
            </div>
          </div>

          <div className="tradeoff">
            <div className="tradeoff-cell">
              <div className="tradeoff-label">What you gain</div>
              <div className="tradeoff-text">{ARC.tradeoff.gain}</div>
            </div>
            <div className="tradeoff-cell">
              <div className="tradeoff-label">What you give up</div>
              <div className="tradeoff-text">{ARC.tradeoff.giveUp}</div>
            </div>
            <div className="tradeoff-principle">
              <span className="tradeoff-principle-label">Operating principle</span>
              {ARC.tradeoff.principle}
            </div>
          </div>

          <div className="months">
            {ARC.monthly.map(m => (
              <div key={m.m} className="month">
                <div className="month-num">
                  M{m.m.toString().padStart(2, '0')}
                  <div className="month-num-sub">Q{Math.ceil(m.m/3)}</div>
                </div>
                <div className="month-body">
                  <div className="month-gate">
                    <Flag size={14} className="month-gate-icon" />
                    <span className="month-gate-label">Gate</span>
                    <span className="month-gate-text">{m.gate}</span>
                  </div>
                  <div className="weeks">
                    {m.weeks.map((w, i) => (
                      <div key={i} className="week">
                        <span className="week-num">W{i+1}</span>
                        <span className="week-text">{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="year-gate">
            <div className="year-gate-label">
              <TrendingUp size={11} /> Year gate
            </div>
            <div className="year-gate-text">{ARC.yearGate}</div>
          </div>

          <div className="claims">
            <h4><AlertCircle size={11} /> Claims & limits</h4>
            <ul>
              {ARC.claims.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
