import { useState } from "react";
import { ChevronRight, Compass, BookMarked, GraduationCap, Microscope, UserPlus, Boxes, TrendingUp, Archive } from 'lucide-react';

// ---------------------------------------------------------------------------
// SERIES 6 — Expertise becomes assets that generate without you
// ---------------------------------------------------------------------------

const ARCS = [
  {
    id: 'book',
    Icon: BookMarked,
    title: 'The Book Arc',
    titleEm: 'Book',
    lane: 'Technical writing · publisher deal · manuscript · launch',
    accent: '#b45309',
    accentDim: 'rgba(180,83,9,0.10)',
    load: 'HIGH',
    horizon: '18 mo',
    cert: 'Published work',
    why:
      "A book is the highest-credibility artifact in the consulting world. Not because books generate direct revenue — they often don't — but because they signal the depth of investment in a domain that no blog post or LinkedIn thread can replicate. The AI consulting space is moving fast enough that a practitioner-written, experience-grounded book on building production AI systems for enterprise clients doesn't exist yet in the form it should. O'Reilly, Manning, Pragmatic Bookshelf, and Apress all have active acquisitions programs for this material. The Teaching & Publishing arc builds the writing muscle. The Community arc builds the launch audience. This arc synthesizes everything into the definitive artifact that outlasts any individual engagement.",
    capstone:
      "A published book — traditional or self-published — on building production AI systems for enterprise practitioners. Pre-orders from community audience before launch date. At least three inbound speaking or advisory requests attributable to the book in the six months after publication. The credential that means every future client engagement starts with the question already answered: 'can you teach this?'",
    buildPrompt: 'Build The Book Arc — outline, publisher research, manuscript plan, technical writing process, launch strategy using community audience',
  },
  {
    id: 'course',
    Icon: GraduationCap,
    title: 'The Course Arc',
    titleEm: 'Course',
    lane: 'Self-paced curriculum · Teachable/Maven · recurring revenue · 1,000 students',
    accent: '#0369a1',
    accentDim: 'rgba(3,105,161,0.10)',
    load: 'MED',
    horizon: '12 mo',
    cert: 'No cert — revenue and completion rate as metrics',
    why:
      "Workshops are live and labor-intensive. A self-paced course is the leverage version of the same content: record it once, sell it indefinitely, support it asynchronously. The AI practitioner course market is crowded at the beginner level and almost empty at the practitioner-to-practitioner level — people who can already prompt-engineer but need to understand production architecture, evaluation methodology, and enterprise deployment patterns. Your accumulated arc capstones are the curriculum. The community is the launch audience. The question is execution: recording quality, platform selection (Teachable, Maven, Circle, or direct), pricing architecture (one-time vs. cohort vs. subscription), and the ongoing content refresh cycle that keeps it from going stale in a fast-moving field.",
    capstone:
      "A self-paced course with 1,000+ enrolled students, a documented completion rate above 40%, and a monthly revenue target sustained for 90 days. A content refresh protocol that keeps the material current without a full rebuild. The passive income asset that makes active consulting optional rather than necessary.",
    buildPrompt: 'Build The Course Arc — practitioner-level AI curriculum, platform selection, pricing model, launch to community audience, completion rate optimization',
  },
  {
    id: 'research',
    Icon: Microscope,
    title: 'The Original Research Arc',
    titleEm: 'Research',
    lane: 'Benchmarks · published methodology · practitioner papers · citations',
    accent: '#065f46',
    accentDim: 'rgba(6,95,70,0.10)',
    load: 'HIGH',
    horizon: '18 mo',
    cert: 'No cert — published research with citations',
    why:
      "Most AI practitioners consume research. Almost none produce it. The practitioner-researcher hybrid — someone building production systems and also publishing rigorous benchmarks and methodology papers drawn from real deployments — occupies a nearly empty position in the current landscape. Not academic research with the associated overhead, but practitioner research: benchmarks comparing RAG architectures on real enterprise corpora, cost-per-quality analyses of fine-tuned vs. prompted models at production scale, red-team datasets published for community use. The citations and the references compound in ways that blog posts don't. A paper cited by other researchers changes your category from practitioner to contributor.",
    capstone:
      "One published benchmark or methodology paper with documented citations. A practitioner research methodology — how to run rigorous experiments while shipping production systems simultaneously. A citation network that places your work in the lineage of the field rather than beside it. The artifact that gets you conference keynote invitations rather than conference attendee badges.",
    buildPrompt: 'Build The Original Research Arc — benchmark design, practitioner methodology papers, publication strategy, citation building, conference submission process',
  },
  {
    id: 'firm',
    Icon: UserPlus,
    title: 'The Firm-Building Arc',
    titleEm: 'Firm',
    lane: 'Subcontracting · hiring · SOPs · team delivery · margin architecture',
    accent: '#4338ca',
    accentDim: 'rgba(67,56,202,0.10)',
    load: 'HIGH',
    horizon: '18 mo',
    cert: 'No cert — team revenue and margin as metrics',
    why:
      "At current trajectory, FlashFusion's ceiling is one person's available hours. The transition from solo consulting to a small firm — two to five contractors, well-documented delivery SOPs, a project management system that doesn't require your constant presence, margin architecture that accounts for bench time and rework — is not primarily a business skills question. It's a systems design question. The bottleneck is documentation: which parts of your delivery can be delegated to a contractor with two years of experience vs. which parts require your specific judgment. This arc builds the infrastructure to find out. The output isn't headcount — it's a delivery machine that can run projects without you in every meeting.",
    capstone:
      "A team of at least two active contractors delivering client work under FlashFusion. A delivery SOP library covering the five most common engagement types. A margin model that accounts for contractor cost, bench time, and management overhead — and still produces target margins. The transition from 'Kyle does the work' to 'FlashFusion does the work.'",
    buildPrompt: 'Build The Firm-Building Arc — subcontractor recruitment and onboarding, delivery SOPs, project management system, margin architecture, team capacity model',
  },
  {
    id: 'saas',
    Icon: Boxes,
    title: 'The SaaS Platform Arc',
    titleEm: 'Platform',
    lane: 'Productized IP · recurring revenue · AI-native SaaS · $10K MRR',
    accent: '#0891b2',
    accentDim: 'rgba(8,145,178,0.10)',
    load: 'HIGH',
    horizon: '18 mo',
    cert: 'No cert — MRR and retention as metrics',
    why:
      "Every arc has produced frameworks, playbooks, templates, and tools. The SaaS platform arc asks: which of those has a market willing to pay $50-500/month for ongoing access to it? The answer isn't a generic AI wrapper — those are already commoditized. The answer is a narrow, opinionated product built on top of accumulated expertise in one specific domain: an eval harness SaaS for small AI teams, an agent deployment checklist tool for regulated industries, a RAG quality dashboard. The Full-Stack AI App arc builds the technical foundation. The Vertical arc identifies the domain. This arc builds the product that generates recurring revenue from the intersection. The difference between consulting and a software company.",
    capstone:
      "$10K MRR sustained for 90 days from a self-serve SaaS product. A documented customer acquisition channel that doesn't require outbound sales. A churn rate below 5% monthly demonstrating real retained value. The business model shift that means your monthly revenue floor is not zero when you take a vacation.",
    buildPrompt: 'Build The SaaS Platform Arc — AI-native SaaS product identification, build, pricing, GTM, $10K MRR milestone plan',
  },
  {
    id: 'angel',
    Icon: TrendingUp,
    title: 'The Angel & Syndicate Arc',
    titleEm: 'Syndicate',
    lane: 'Angel investing · AngelList · technical due diligence · deal flow',
    accent: '#15803d',
    accentDim: 'rgba(21,128,61,0.10)',
    load: 'LOW',
    horizon: 'Ongoing',
    cert: 'No cert — portfolio as proof',
    why:
      "The domain expertise you accumulate across all prior arcs has a financial expression beyond consulting fees: the ability to evaluate AI startup technical claims that most investors cannot. Technical due diligence — whether a startup's architecture is defensible, whether their benchmark claims hold up, whether their team's stated capabilities match their shipped work — is genuinely rare among people who also understand early-stage deal structure. AngelList syndicates, SPVs, and small check angel rounds ($5K-$25K) are accessible at your current income trajectory. The ROI isn't primarily financial at this stage — it's deal flow, network access, and the feedback loop of seeing how the companies you evaluate evolve over time.",
    capstone:
      "A deployed angel portfolio of at least five companies with documented investment theses. An AngelList syndicate or group participation established. A technical due diligence framework — the questions that reveal whether an AI startup's claims are credible — published as an advisory resource. The network position that means founders come to you before the round closes, not after.",
    buildPrompt: 'Build The Angel & Syndicate Arc — angel investing basics, AngelList setup, technical due diligence framework, deal flow network, portfolio construction',
  },
  {
    id: 'ip',
    Icon: Archive,
    title: 'The IP Portfolio Arc',
    titleEm: 'Portfolio',
    lane: 'Frameworks · trademarks · licensing · acqui-hire positioning',
    accent: '#78716c',
    accentDim: 'rgba(120,113,108,0.10)',
    load: 'LOW',
    horizon: '12 mo',
    cert: 'No cert — documented IP portfolio',
    why:
      "You have named frameworks — R-I-S-E, F-L-O-W, R-O-S-E, the CLAIMS/COUNTEREXAMPLE/CONTRADICTIONS system, skill library architecture, prompt engineering conventions. These exist informally inside your tools and your head. An IP portfolio arc formalizes them: registered trademarks where applicable, documented licensing models, a framework register that could survive due diligence in an acquisition conversation. Most independent AI consultants never get acquired because there's nothing to acquire — the value walks out the door when they do. Documented, licensed IP changes that equation. It also changes the client conversation from 'we hire Kyle' to 'we license Kyle's methodology,' which is a higher-margin and more scalable business model.",
    capstone:
      "A formal IP register documenting all original frameworks, methodologies, and tools with licensing terms. At least two trademark filings for the most commercially valuable named frameworks. A licensing deck that presents the IP portfolio as a standalone acquirable or licensable asset. The document that turns consulting deliverables into a company someone might want to buy.",
    buildPrompt: 'Build The IP Portfolio Arc — framework documentation, trademark filings, licensing model design, acqui-hire positioning, IP register',
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
.title-sub { font-size: 13px; color: var(--fg-dim); margin: 16px 0 0; max-width: 58ch; }
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
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
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

.card-body { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
.card.open .card-body { max-height: 800px; }
.card-body-inner { padding: 4px 20px 18px; border-top: 1px dashed var(--border); margin-top: 4px; }

.why { font-size: 12.5px; color: var(--fg); line-height: 1.65; margin: 14px 0 16px; }
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
.note li { margin-bottom: 5px; }
.note strong { color: var(--fg); font-weight: 500; }

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
}
`;

export default function Series6Selector() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Compass size={12} /> Learning Ops // Series Six</p>
              <h1 className="title-serif">The <em>leverage</em> layer.</h1>
              <p className="title-sub">
                Where expertise becomes assets that generate without you present.
                A book that outlasts every engagement. A course that sells while
                you sleep. Research that earns citations. A team that delivers
                without you in every meeting. A SaaS floor on monthly revenue.
                An angel portfolio that bets on what you already understand.
                And an IP register that makes FlashFusion acquirable.
              </p>
            </div>
            <div className="meta">
              <div>For <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Series <strong>06 of N</strong></div>
              <div style={{ marginTop: 4 }}>Total candidates: <strong>7</strong></div>
              <div style={{ marginTop: 4 }}>Tap a card to expand</div>
            </div>
          </div>

          <div className="cards stagger">
            {ARCS.map((arc, i) => {
              const isOpen = open === i;
              const Icon = arc.Icon;
              const cardStyle = {
                ['--card-accent']: arc.accent,
                ['--card-accent-dim']: arc.accentDim,
              };
              const titleParts = arc.title.split(arc.titleEm);

              return (
                <div
                  key={arc.id}
                  className={`card ${isOpen ? 'open' : ''}`}
                  style={cardStyle}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <div className="card-head">
                    <div className="card-icon"><Icon size={18} strokeWidth={1.5} /></div>
                    <div>
                      <h3 className="card-title">
                        {titleParts[0]}<em>{arc.titleEm}</em>{titleParts[1]}
                      </h3>
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
                <strong>Series 6 has four HIGH-load arcs — the most of any series.</strong>{' '}
                Book, Research, Firm-Building, and SaaS are all 18-month or longer
                commitments that require genuine output to claim as capstones. None of
                them are bluffable. Don't start any of them without the prior-series
                infrastructure that feeds them: community audience for Book and Course,
                RAG + Fine-Tuning + Eval for Research, Enterprise Sales + Consulting
                Infrastructure for Firm-Building, Full-Stack App + Vertical for SaaS.
              </li>
              <li>
                <strong>IP Portfolio is the lowest-effort arc with the longest tail.</strong>{' '}
                LOW load, existing material to document, and the output compounds
                indefinitely. Start it in parallel with any active arc from any series —
                it doesn't require focused sprints, just a systematic documentation habit
                applied to work you're already doing.
              </li>
              <li>
                <strong>SaaS and Firm-Building are structural choices, not sequential ones.</strong>{' '}
                One path scales through software. The other scales through people. Both
                are valid. Running both simultaneously produces a fragmented mess.
                Choose a primary vector before Series 6 begins — the infrastructure of
                each arc is different enough that they don't share scaffolding.
              </li>
              <li>
                <strong>This is as far as the arc map goes — for now.</strong>{' '}
                Forty-two named arcs across six series plus the foundational thirteen
                represents a plausible decade of compound deliberate practice in one field.
                The arcs beyond Series 6 depend on which of these you actually completed
                and what the landscape looks like when you get there. Build the map then.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
