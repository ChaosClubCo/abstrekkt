import { useState } from "react";
import {
  ChevronRight, Compass, Users2, Anchor, Landmark,
  Armchair, Building, Hourglass, Infinity as InfinityIcon
} from 'lucide-react';

// ---------------------------------------------------------------------------
// SERIES 8 — The meta layer. Where the practice outgrows the practitioner.
// ---------------------------------------------------------------------------

const ARCS = [
  {
    id: 'succession',
    Icon: Users2,
    title: 'The Succession Arc',
    titleEm: 'Succession',
    lane: 'Delegation architecture · operator handoff · the bus-factor problem',
    accent: '#0ea5e9',
    accentDim: 'rgba(14,165,233,0.10)',
    load: 'HIGH',
    horizon: '18 mo',
    cert: 'No cert — a week away with nothing breaking as proof',
    why:
      "Every arc through Series 7 made you more capable. This one makes you more replaceable — on purpose. The bus-factor problem is the unspoken ceiling on everything a solo founder builds: if the operation stops the moment you stop, you don't own a business, you own a job with good margins. The Succession arc is the deliberate transfer of the things only you can currently do — the judgment calls, the client relationships, the architectural decisions, the quality bar — into systems, documented decision frameworks, and people who can exercise them without you. This is harder than any technical arc because the obstacle isn't skill, it's the identity attachment to being the person who does the thing. The practitioners who never solve this stay personally essential and structurally trapped. The ones who do solve it own something that has value independent of their presence in the room.",
    capstone:
      "A documented succession plan covering every business-critical function: who does it, what decision framework they use, what triggers escalation back to you. A two-week absence — fully offline — during which client work ships, decisions get made, and nothing waits for you. The proof that FlashFusion is an entity rather than a synonym for your calendar.",
    buildPrompt: 'Build The Succession Arc — delegation architecture, decision framework documentation, operator handoff, bus-factor elimination, two-week-absence test',
  },
  {
    id: 'cofounder',
    Icon: Anchor,
    title: 'The Second Founder Arc',
    titleEm: 'Founder',
    lane: 'Partnership architecture · equity · the offer worth taking',
    accent: '#0f766e',
    accentDim: 'rgba(15,118,110,0.10)',
    load: 'MED',
    horizon: 'Ongoing',
    cert: 'No cert — a signed partnership that survives a year as proof',
    why:
      "The founding rule has always been: solo, unless someone approaches with an offer heavily in your favor. That rule was correct for the building years — it protected you from the wrong partnerships, the equity dilution, the co-founder conflicts that kill more companies than market failure does. But a rule that protects you in the building years can trap you in the scaling years. The Second Founder arc isn't about abandoning the solo discipline — it's about building the architecture to recognize and structure the right partnership if it ever appears, and knowing precisely what 'heavily in your favor' means in concrete terms before the conversation happens rather than improvising it under pressure. The work is mostly preparation: a partnership thesis, an equity framework, a values-and-roles document, and the clear-eyed assessment of what a second founder would have to bring that you cannot build or hire. Most founders who take on a partner do it reactively, from a position of exhaustion or fear. This arc means that if you ever do it, you do it from leverage.",
    capstone:
      "A written partnership thesis — what a second founder would have to bring, what equity and role structure would make it worth it, what the deal-breakers are. An equity and vesting framework you'd actually use. The clarity that means if the right offer ever comes, you recognize it in the first conversation rather than realizing it two years too late — and that if it never comes, the solo path was a choice, not a default.",
    buildPrompt: 'Build The Second Founder Arc — partnership thesis, equity framework, co-founder evaluation criteria, the offer-worth-taking definition, values and role architecture',
  },
  {
    id: 'capital',
    Icon: Landmark,
    title: 'The Capital Allocation Arc',
    titleEm: 'Capital',
    lane: 'Personal holding co · acquisitions · portfolio thinking · Abstrekkt as engine',
    accent: '#b45309',
    accentDim: 'rgba(180,83,9,0.10)',
    load: 'MED',
    horizon: '18 mo',
    cert: 'No cert — first acquisition or allocated portfolio as proof',
    why:
      "By the time the leverage layer arcs are producing — book royalties, course revenue, SaaS MRR, advisory fees, consulting margins — the constraint shifts from earning capital to allocating it. Abstrekkt was always structured as a parent holding company, not just a brand umbrella. The Capital Allocation arc is where that structure starts to matter: small acquisitions of complementary businesses or assets, portfolio thinking across the products and ventures under the Abstrekkt roof, and the discipline of treating capital as a tool to be deployed deliberately rather than cash to be spent reactively. This is a fundamentally different skill from building or selling — it's the investor's discipline applied to your own holding company. The practitioners who only ever earn income stay on the income treadmill. The ones who learn to allocate capital build something that compounds while they sleep, the same way the SaaS and royalty arcs do, but at the level of whole businesses rather than individual products.",
    capstone:
      "An Abstrekkt capital allocation thesis — what kinds of assets or businesses fit under the roof, what return profile justifies an acquisition, what the holding-company structure optimizes for. A first small acquisition or a deliberately allocated investment portfolio. The shift from earning income to allocating capital — the financial expression of everything the prior arcs built.",
    buildPrompt: 'Build The Capital Allocation Arc — Abstrekkt holding company structure, acquisition criteria, portfolio thinking, capital deployment discipline, first acquisition or allocation',
  },
  {
    id: 'board',
    Icon: Armchair,
    title: 'The Board & Governance Arc',
    titleEm: 'Board',
    lane: 'Board seats · advisory roles · governance from the inside · institutional influence',
    accent: '#4338ca',
    accentDim: 'rgba(67,56,202,0.10)',
    load: 'LOW',
    horizon: 'Ongoing',
    cert: 'No cert — a board seat held as proof',
    why:
      "The M&A Advisory arc put you in the room where companies get evaluated. The Board arc puts you in the room where they get governed. Board seats — startup advisory boards, nonprofit boards, eventually for-profit company boards — are the institutional expression of accumulated credibility. They are also a fundamentally different kind of work: not building, not selling, not even advising on a single engagement, but exercising fiduciary judgment over an organization's direction across years. For someone whose entire trajectory has been about reading systems — rooms, processes, organizations — the board seat is where that diagnostic instinct operates at the highest level of consequence. The compensation matters less than the position: a board seat is a vote of institutional confidence that compounds your credibility in every other arena, and a vantage point on how organizations actually make decisions at the top that no amount of consulting from the outside can replicate.",
    capstone:
      "At least one board or formal advisory seat held — nonprofit, startup, or company — with documented contribution to the organization's direction. A personal governance philosophy: what you believe boards are for, what good governance looks like, what you bring to a board that the other members don't. The institutional position that signals you operate at the level of organizational direction, not just project delivery.",
    buildPrompt: 'Build The Board & Governance Arc — board seat pursuit, advisory role positioning, fiduciary judgment, governance philosophy, institutional contribution',
  },
  {
    id: 'institute',
    Icon: Building,
    title: 'The Institute Arc',
    titleEm: 'Institute',
    lane: 'Training org · cohort engine · the school that outlasts you · institutional permanence',
    accent: '#9333ea',
    accentDim: 'rgba(147,51,234,0.10)',
    load: 'HIGH',
    horizon: '24 mo',
    cert: 'No cert — an institution running without you as proof',
    why:
      "The Course arc built a product. The Community arc built a network. The Teaching & Publishing arc built authority. The Institute arc builds the thing that contains all three and outlasts all of them: a permanent training organization with its own faculty, its own curriculum that evolves past your direct authorship, its own reputation that exists independent of your personal brand. This is the difference between being a teacher and founding a school. The hardest part is not the curriculum or the operations — it's the deliberate decision to build something whose success requires it to need you less over time. An institute that depends on you for every cohort is just a course with extra overhead. An institute that develops its own faculty, refines its own pedagogy, and graduates practitioners who go on to teach is an institution. It's the most ambitious thing on any of these maps, and the one most directly connected to the founding impulse behind Chaos Club: build the thing you needed, then make it permanent enough to outlive your involvement in it.",
    capstone:
      "A training institute with its own faculty beyond you, a curriculum that has evolved past your direct authorship, and at least one full cohort taught primarily by people you trained to teach it. A documented institutional structure — governance, faculty development, curriculum evolution — that could survive your departure. The school that graduates the practitioners who build the next thing, the way you built this one.",
    buildPrompt: 'Build The Institute Arc — training organization structure, faculty development, curriculum that evolves past you, institutional permanence, cohort engine independent of founder',
  },
  {
    id: 'sabbatical',
    Icon: Hourglass,
    title: 'The Reinvention Arc',
    titleEm: 'Reinvention',
    lane: 'Sabbatical · the deliberate stop · the next thing · permission to leave',
    accent: '#dc2626',
    accentDim: 'rgba(220,38,38,0.10)',
    load: 'LOW',
    horizon: 'Ongoing',
    cert: 'No cert — a real stop, fully taken, as proof',
    why:
      "Every arc on every map has been about building forward — more capability, more revenue, more leverage, more influence. The Reinvention arc is the only one that asks whether to keep building this particular thing at all. The succession and institute arcs make it structurally possible to step away. This arc asks whether you should — and what comes next if you do. A real sabbatical, not a vacation: months away from the operation, deliberately undertaken, with the explicit purpose of finding out who you are when you're not the person running FlashFusion. The reinvention question matters most precisely for someone whose identity got fused to the building during the years when building was survival. The diagnostic instinct that reads rooms and processes and systems doesn't expire if you stop consulting — it can point at an entirely different problem. The practitioners who can never stop are not free, however successful they look. This arc is about earning, and then actually using, the permission to leave a thing you built — whether to rest, to reinvent, or to discover that you genuinely chose to stay.",
    capstone:
      "A real sabbatical taken — weeks or months fully away from the operation, made possible by the succession and institute work — with an honest reckoning of who you are when you're not running the company. A clear-eyed answer to whether the next decade is more of this or something different. The permission, structurally earned and actually exercised, to stop building this if you want to build something else.",
    buildPrompt: 'Build The Reinvention Arc — sabbatical structure, identity beyond the operation, the next-thing question, permission to leave, deliberate reinvention vs deliberate continuation',
  },
  {
    id: 'legacy',
    Icon: InfinityIcon,
    title: 'The Legacy Arc',
    titleEm: 'Legacy',
    lane: 'What outlasts you · the letter finished · what it was all for',
    accent: '#e11d48',
    accentDim: 'rgba(225,29,72,0.10)',
    load: 'LOW',
    horizon: 'Ongoing',
    cert: 'No cert — there is no proof for this one',
    why:
      "The memoir was always framed as a letter to Kinsley — an accounting, written across years, of how a person builds a self out of non-standard materials. The Legacy arc is where the maps and the memoir converge on the same question: what was all of this for? Not the revenue, not the credentials, not the arcs completed — those were the means. The Legacy arc is about deliberately deciding what you want to have built that outlasts you, and then making sure the building serves it. For most people this question arrives too late, as a deathbed reckoning. The discipline here is to ask it early enough that the answer can still shape the work: what do you want Kinsley to be able to point to and say her father made? What do you want the people Chaos Club helped to carry forward? What does a self built from the materials you were handed — the TBI, the addiction, the systems that failed you — actually leave behind when it's built well? This arc has no capstone in the normal sense because legacy is not a deliverable. But it is the only arc that gives every other arc its reason. Build it consciously, or let it be assembled by accident from whatever you happened to do.",
    capstone:
      "There is no capstone for this one — that's the point. The closest thing is a finished memoir, an institution that outlives you, a daughter who understands what her father built and why, and a clear-eyed personal answer to the question every other arc was secretly in service of. The deliberate authorship of what remains when the building is done — written, like the memoir always was, as a letter to the person it was all partly for.",
    buildPrompt: 'Build The Legacy Arc — what outlasts you, the memoir finished, the letter to Kinsley completed, conscious legacy authorship, what it was all for',
  },
];

// ---------------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg:           #0a0e12;
  --bg-2:         #101620;
  --fg:           #e2e8ec;
  --fg-dim:       #7a8a98;
  --fg-mute:      #4a5560;
  --card:         #0f1620;
  --border:       #1a2330;
  --border-bright:#2a3850;
}

body, .root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 70% 40% at 50% -10%, rgba(125,148,180,0.06), transparent 60%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1120px; margin: 0 auto; }

.header-grid {
  display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end;
  padding-bottom: 32px; border-bottom: 1px solid var(--border); margin-bottom: 40px;
}
.kicker {
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em;
  color: var(--fg-dim); margin: 0 0 16px; display: flex; align-items: center; gap: 8px;
}
.title-serif {
  font-family: 'Instrument Serif', serif; font-size: clamp(40px, 5.6vw, 68px);
  line-height: 0.96; letter-spacing: -0.02em; margin: 0; font-weight: 400; color: var(--fg);
}
.title-serif em { color: #cbd5e1; font-style: italic; }
.title-sub { font-size: 13px; color: var(--fg-dim); margin: 16px 0 0; max-width: 60ch; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--fg); font-weight: 500; }

.cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.card {
  background: var(--card); border: 1px solid var(--border);
  border-left: 3px solid var(--card-accent);
  cursor: pointer; transition: border-color 0.2s, transform 0.15s;
}
.card:hover { border-color: var(--border-bright); border-left-color: var(--card-accent); transform: translateY(-1px); }
.card.open { border-color: var(--card-accent); }

.card-head {
  padding: 18px 20px; display: grid;
  grid-template-columns: 36px 1fr auto; gap: 14px; align-items: center;
}
.card-icon {
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  background: var(--card-accent-dim); color: var(--card-accent);
  border: 1px solid var(--card-accent-dim);
}
.card-title {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 22px; line-height: 1.15; font-weight: 400; margin: 0 0 3px; color: var(--fg);
}
.card-title em { color: var(--card-accent); font-style: italic; }
.card-lane { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg-dim); }
.card-chev { color: var(--fg-mute); transition: transform 0.25s, color 0.2s; }
.card.open .card-chev { transform: rotate(90deg); color: var(--card-accent); }

.card-body { max-height: 0; overflow: hidden; transition: max-height 0.5s ease; }
.card.open .card-body { max-height: 1000px; }
.card-body-inner { padding: 4px 20px 18px; border-top: 1px dashed var(--border); margin-top: 4px; }

.why { font-size: 12.5px; color: var(--fg); line-height: 1.68; margin: 14px 0 16px; }
.capstone-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--card-accent); margin-bottom: 5px; }
.capstone { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 13.5px; color: var(--fg); line-height: 1.5; margin: 0 0 16px; }
.meta-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
.pill { font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 8px; border: 1px solid var(--border-bright); color: var(--fg-dim); }
.pill.cert { border-color: var(--card-accent-dim); color: var(--card-accent); background: var(--card-accent-dim); }
.build-cta {
  display: block; width: 100%; padding: 12px 14px; background: transparent;
  border: 1px solid var(--card-accent); color: var(--card-accent);
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.build-cta:hover { background: var(--card-accent); color: var(--bg); }
.prompt-readout {
  margin-top: 8px; padding: 10px 12px;
  background: var(--bg-2); border: 1px dashed var(--border-bright);
  font-size: 11px; color: var(--fg-dim); line-height: 1.45; font-style: italic;
}
.prompt-readout strong { color: var(--fg); font-weight: 500; font-style: normal; }

.note {
  margin-top: 36px; padding: 18px 20px;
  border: 1px solid var(--border); background: var(--bg-2);
  font-size: 11.5px; color: var(--fg-dim); line-height: 1.7;
}
.note h4 { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg); margin: 0 0 10px; display: flex; align-items: center; gap: 6px; }
.note ul { margin: 6px 0 0; padding-left: 18px; }
.note li { margin-bottom: 6px; }
.note strong { color: var(--fg); font-weight: 500; }

.total-bar {
  margin-top: 20px; padding: 16px 20px;
  background: transparent; border: 1px solid var(--border-bright);
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
}
.total-bar .label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); }
.total-bar .count { font-family: 'Instrument Serif', serif; font-size: 40px; color: var(--fg); font-weight: 400; line-height: 1; }
.total-bar .sub { font-size: 11px; color: var(--fg-dim); max-width: 56ch; line-height: 1.7; }

@keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.stagger > * { opacity: 0; animation: rise 0.5s ease forwards; }
.stagger > *:nth-child(1) { animation-delay: 0.04s; }
.stagger > *:nth-child(2) { animation-delay: 0.08s; }
.stagger > *:nth-child(3) { animation-delay: 0.12s; }
.stagger > *:nth-child(4) { animation-delay: 0.16s; }
.stagger > *:nth-child(5) { animation-delay: 0.20s; }
.stagger > *:nth-child(6) { animation-delay: 0.24s; }
.stagger > *:nth-child(7) { animation-delay: 0.28s; }

@media (max-width: 720px) {
  .header-grid { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .cards { grid-template-columns: 1fr; }
  .card-head { padding: 16px; }
  .card-title { font-size: 19px; }
  .card-body-inner { padding: 4px 16px 16px; }
  .total-bar { flex-direction: column; align-items: flex-start; }
}
`;

export default function Series8Selector() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Compass size={12} /> Learning Ops // Series Eight</p>
              <h1 className="title-serif">The <em>meta</em> layer.</h1>
              <p className="title-sub">
                Where the practice outgrows the practitioner. Every prior series made
                you more capable. This one asks what happens when capability is no longer
                the constraint — when the work becomes succession, partnership, capital,
                governance, institution-building, and finally the two questions every
                other arc was quietly in service of: whether to keep going, and what it
                was all for. These are not skills to acquire. They are decisions to make
                consciously rather than by default.
              </p>
            </div>
            <div className="meta">
              <div>For <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Series <strong>08 of 08</strong></div>
              <div style={{ marginTop: 4 }}>Total candidates: <strong>7</strong></div>
              <div style={{ marginTop: 4 }}>Tap a card to expand</div>
            </div>
          </div>

          <div className="cards stagger">
            {ARCS.map((arc, i) => {
              const isOpen = open === i;
              const Icon = arc.Icon;
              const style = { ['--card-accent']: arc.accent, ['--card-accent-dim']: arc.accentDim };
              const parts = arc.title.split(arc.titleEm);

              return (
                <div
                  key={arc.id}
                  className={`card ${isOpen ? 'open' : ''}`}
                  style={style}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <div className="card-head">
                    <div className="card-icon"><Icon size={18} strokeWidth={1.5} /></div>
                    <div>
                      <h3 className="card-title">{parts[0]}<em>{arc.titleEm}</em>{parts[1]}</h3>
                      <div className="card-lane">{arc.lane}</div>
                    </div>
                    <ChevronRight className="card-chev" size={18} />
                  </div>

                  <div className="card-body">
                    <div className="card-body-inner">
                      <p className="why">{arc.why}</p>
                      <div className="capstone-label">Capstone output</div>
                      <p className="capstone">{arc.capstone}</p>
                      <div className="meta-row">
                        <span className="pill">Load: {arc.load}</span>
                        <span className="pill">{arc.horizon}</span>
                        <span className="pill cert">{arc.cert}</span>
                      </div>
                      <button
                        className="build-cta"
                        onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(arc.buildPrompt); }}
                      >
                        Copy build prompt →
                      </button>
                      <div className="prompt-readout">
                        <strong>Prompt:</strong> {arc.buildPrompt}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="note">
            <h4><Compass size={11} /> Sequencing notes</h4>
            <ul>
              <li>
                <strong>Succession is the gate for the entire series.</strong> The Institute,
                the Reinvention, the Board work, and the Capital arc all assume the operation
                can run without you in the room. None of them are possible while you are still
                personally essential to daily delivery. If any arc in this series runs first,
                it is this one — everything else depends on it.
              </li>
              <li>
                <strong>Three arcs in this series are not skills — they are decisions.</strong>{' '}
                The Second Founder arc, the Reinvention arc, and the Legacy arc don't have a
                curriculum. They have a question that most people answer by default, too late,
                and badly. The discipline is to answer them consciously and early enough that
                the answer can still shape the work.
              </li>
              <li>
                <strong>This series will not feel urgent, and that is the trap.</strong> Every
                prior arc had a revenue or capability justification that created its own pressure.
                These arcs produce no immediate income and solve no immediate problem — which is
                exactly why founders skip them until the absence of succession, the wrong
                partnership, or the unexamined legacy becomes a crisis. The whole point is to
                do this work before it is forced.
              </li>
              <li>
                <strong>The Legacy arc is the only one in sixty-nine that has no capstone.</strong>{' '}
                That is deliberate. It is also the arc the memoir was always pointing at — the
                letter to Kinsley, finished. Every map, every series, every arc was a way of
                answering one question that this arc finally asks directly. Build it consciously,
                or let it assemble itself from whatever you happened to do.
              </li>
            </ul>

            <div className="total-bar">
              <div>
                <div className="label">Complete arc map · all series</div>
                <div className="count">69</div>
              </div>
              <div className="sub">
                13 foundational arcs plus 56 candidate arcs across Series 2–8. From the first
                prompt written deliberately to the last question worth asking. This is the end
                of the map — not because there is nothing beyond it, but because what lies
                beyond depends entirely on which of these you actually walked, and on who you
                turn out to be when you get there. The arcs past Series 8 cannot be written in
                advance. They are written by living them.
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
