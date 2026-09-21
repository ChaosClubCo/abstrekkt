import { useState } from "react";
import { ChevronRight, Compass, Brain, GitPullRequest, Mic2, School, Scale, DollarSign, Heart } from 'lucide-react';

// ---------------------------------------------------------------------------
// SERIES 7 — Influence and legacy: shaping the field, not just operating in it
// ---------------------------------------------------------------------------

const ARCS = [
  {
    id: 'personalos',
    Icon: Brain,
    title: 'The AI Personal OS Arc',
    titleEm: 'Personal',
    lane: 'PKM maturity · second brain · AI memory infrastructure · teachable system',
    accent: '#0ea5e9',
    accentDim: 'rgba(14,165,233,0.10)',
    load: 'MED',
    horizon: '12 mo',
    cert: 'No cert — documented system as teachable product',
    why:
      "Every prior arc has produced frameworks, checklists, runbooks, and skill libraries. None of them are connected to each other in a system that compounds deliberately. The AI Personal OS arc is not a tool selection exercise — those are already done. It's the architecture layer that ties everything together: a knowledge graph that surfaces relevant context before you ask for it, a decision journal that prevents you from relitigating solved problems, a project state system that doesn't live inside your head, and a capture-to-action pipeline that turns raw observations into retrievable assets. For someone whose documented cognitive profile includes 99th-percentile processing speed and 12th-percentile recall memory, this isn't optimization. It's the prosthetic infrastructure the rest of the work runs on. It's also teachable — the systematized version of how a high-functioning person with a memory disability built a functional external brain is a genuinely rare and commercially valuable curriculum.",
    capstone:
      "A fully documented AI Personal OS — architecture diagram, component inventory, maintenance protocol, and the reasoning behind every design decision. A published 'external brain design guide' for practitioners with cognitive constraints or high-throughput information environments. A 90-day log demonstrating measurable reduction in repeated decisions, missed context, and cognitive overhead. The system that makes every other arc sustainable rather than depleting.",
    buildPrompt: 'Build The AI Personal OS Arc — PKM architecture, knowledge graph, decision journal, capture-to-action pipeline, external brain design guide for practitioners with memory constraints',
  },
  {
    id: 'oss',
    Icon: GitPullRequest,
    title: 'The Open Source Arc',
    titleEm: 'Source',
    lane: 'Core contributor · LangChain/LlamaIndex · OSS tooling · GitHub authority',
    accent: '#16a34a',
    accentDim: 'rgba(22,163,74,0.10)',
    load: 'MED',
    horizon: '12 mo',
    cert: 'No cert — merged PRs and contributor status as proof',
    why:
      "You use LangChain, LlamaIndex, n8n, and half a dozen other open source projects every week. You've never contributed back. The gap matters for two reasons that aren't about altruism. First, contributor status in a widely-used project puts your name in front of every practitioner who reads changelogs and release notes — a distribution channel that no amount of content production replicates. Second, the code review process inside major OSS projects is the highest-quality technical feedback loop available to a self-taught engineer. Every merged PR teaches you something a tutorial never would. The practitioners who become core contributors to the tools the industry depends on occupy a category that is genuinely different from practitioners who only consume those tools.",
    capstone:
      "Core contributor status or significant merged PRs in at least one major AI OSS project. A published OSS tool of your own with 500+ GitHub stars and documented real-world usage. A 'contributing to AI OSS' guide — not a tutorial on git workflows, but a practitioner's guide to finding the right project, the right first issue, and the right contribution type for someone entering an established codebase. The GitHub profile that signals something about your technical depth that a consulting portfolio can't.",
    buildPrompt: 'Build The Open Source Arc — identify target project, make first contributions, work toward core contributor status, ship original OSS tool, document the contribution process',
  },
  {
    id: 'speaking',
    Icon: Mic2,
    title: 'The Keynote & Speaking Arc',
    titleEm: 'Keynote',
    lane: 'Conference circuit · paid keynotes · speaker fees · thought leadership',
    accent: '#dc2626',
    accentDim: 'rgba(220,38,38,0.10)',
    load: 'LOW',
    horizon: '12 mo',
    cert: 'No cert — speaker fee and stage quality as metrics',
    why:
      "The Teaching & Publishing arc built writing authority. The Community arc built peer network leverage. The Book arc built the highest-credibility artifact. The speaking circuit is the in-person expression of all three: a 45-minute keynote at an enterprise AI conference produces more qualified client conversations than months of content output. The economics shift significantly once you cross the threshold from 'speaker' to 'paid keynote speaker' — not because of the fees themselves, which are real but not transformative at most conference rates, but because of what paid keynote requests signal about your positioning in the market. The conferences that pay are the ones with enterprise buyers in the audience. That's the room. Getting in it consistently requires a speaker kit, a signature talk, a booking agent or speaker bureau relationship, and a pipeline of inbound stage requests that comes from the prior six series doing their jobs.",
    capstone:
      "A polished speaker kit — bio, headshots, talk abstracts at three lengths, video reel from prior appearances. A signature 45-minute talk that can be adapted across AI practitioner, enterprise IT, and business leadership audiences. Three paid keynote engagements in the same calendar year. The speaking pipeline that produces at least one inbound booking request per month without active outreach.",
    buildPrompt: 'Build The Keynote & Speaking Arc — speaker kit, signature talk development, conference submission strategy, speaker bureau outreach, paid keynote pipeline',
  },
  {
    id: 'education',
    Icon: School,
    title: 'The AI in Education Arc',
    titleEm: 'Education',
    lane: 'K-12 AI · higher ed · curriculum design · institutional clients',
    accent: '#9333ea',
    accentDim: 'rgba(147,51,234,0.10)',
    load: 'MED',
    horizon: '12 mo',
    cert: 'No cert — curriculum deployed in an institution',
    why:
      "Education is the vertical you haven't considered and the one most directly connected to your own story. CLC is the institution you failed, returned to, and want to walk back into as a teacher. Chaos Club is the platform you built for people who couldn't get support from the systems that were supposed to provide it. The AI in Education arc isn't about building edtech software — it's about understanding how AI tools change the design of learning environments, how K-12 and higher ed institutions are navigating AI policy and academic integrity, and what curriculum design for AI-literate students actually requires from a practitioner who has taught himself everything he knows. The market is large, the institutional sales cycle is slow and navigable, and the personal narrative alignment with this vertical is stronger than any other on this list.",
    capstone:
      "An AI literacy curriculum deployed in at least one institution — K-12, community college, or higher ed. A published 'AI in the classroom' practitioner guide — not for students, for educators who need to understand what AI changes about their practice. A CLC partnership or advisory relationship that closes the loop on the personal arc. The institutional credibility that makes enterprise training contracts straightforward to close.",
    buildPrompt: 'Build The AI in Education Arc — AI literacy curriculum design, K-12 and higher ed landscape, institutional sales cycle, CLC partnership, educator practitioner guide',
  },
  {
    id: 'policy',
    Icon: Scale,
    title: 'The Policy & Standards Arc',
    titleEm: 'Policy',
    lane: 'NIST AI RMF · IEEE · regulatory comments · standards authorship',
    accent: '#b45309',
    accentDim: 'rgba(180,83,9,0.10)',
    load: 'LOW',
    horizon: '18 mo',
    cert: 'No cert — standards contribution or regulatory comment record',
    why:
      "The AI Governance arc taught you what existing frameworks say and how to document compliance. The Policy & Standards arc is the upstream version of that work: participating in the bodies that write the frameworks, submitting public comments on proposed AI regulations, contributing to IEEE working groups or NIST voluntary frameworks, and positioning yourself as a practitioner who informs the rules rather than only interprets them. This is not primarily about influence for its own sake — it's about the deal-closing impact of being able to tell a regulated-industry client that you contributed to the framework their compliance team is using. The practitioners who show up at the NIST workshops and the IEEE working group meetings are overwhelmingly academic and large-vendor. The independent practitioner with enterprise deployment experience is systematically underrepresented in those rooms and actively wanted in them.",
    capstone:
      "A submitted and accepted public comment on at least one significant AI regulation or framework development process. Participation in an IEEE, NIST, or equivalent working group session with documented contribution. A published 'practitioner's guide to AI policy participation' — how an independent consultant engages with standards bodies without a law degree or a Fortune 500 employer's backing. The positioning that makes you the person regulators call for the practitioner perspective rather than the person who reads about it after the fact.",
    buildPrompt: 'Build The Policy & Standards Arc — NIST AI RMF participation, IEEE working group, regulatory comment process, standards body navigation, practitioner policy guide',
  },
  {
    id: 'ma',
    Icon: DollarSign,
    title: 'The M&A Advisory Arc',
    titleEm: 'Advisory',
    lane: 'Technical due diligence · AI company valuation · PE/VC advisory · deal fees',
    accent: '#0f766e',
    accentDim: 'rgba(15,118,110,0.10)',
    load: 'LOW',
    horizon: '12 mo',
    cert: 'No cert — closed advisory engagements as proof',
    why:
      "The Angel arc in Series 6 built the small-check investing muscle and the technical due diligence framework. M&A Advisory is the fee-generating version of the same capability at higher deal sizes. Private equity firms, strategic acquirers, and growth-stage investors regularly pay independent technical advisors $10K-$50K to evaluate an AI company's architecture claims, assess team capability against stated deliverables, identify IP and technical debt that doesn't show up in financial models, and produce a diligence memo that a generalist analyst cannot write. The work is episodic, high-fee, and directly downstream of the pattern recognition you've been building since Series 1. It's also one of the few consulting engagement types where your self-taught, systems-diagnostic identity is not a disadvantage — it's a feature. You spot the gap between what an AI team claims and what they've actually shipped faster than someone who spent their career inside large organizations building consensus.",
    capstone:
      "Three closed M&A technical advisory engagements with documented fees. A published AI technical due diligence framework — the questions, the evaluation rubric, the red-flag taxonomy — that establishes your methodology before clients see it. A PE/VC advisory relationship that produces recurring deal flow. The engagement type that produces the highest hourly rate in your consulting portfolio with no recurring delivery overhead.",
    buildPrompt: 'Build The M&A Advisory Arc — technical due diligence framework, PE/VC advisory relationships, AI company evaluation rubric, deal sourcing, M&A advisory positioning',
  },
  {
    id: 'impact',
    Icon: Heart,
    title: 'The Social Impact Arc',
    titleEm: 'Impact',
    lane: 'Nonprofit AI · mission-driven · Chaos Club as case study · pro bono program',
    accent: '#e11d48',
    accentDim: 'rgba(225,29,72,0.10)',
    load: 'LOW',
    horizon: 'Ongoing',
    cert: 'No cert — documented impact as proof',
    why:
      "Every series has been about building a more capable and more commercially successful version of a practice. This arc asks a different question: what does the capability actually do in the world when money isn't the filter? Chaos Club is not a side project — it's the platform you built because the mental health system failed you and you decided to build the thing you needed. The Social Impact arc systematizes the relationship between FlashFusion's commercial capability and Chaos Club's mission: a documented pro bono program that provides AI enablement to underfunded nonprofits, a Chaos Club AI integration roadmap that uses everything you've built, a grant-writing capability for mission-driven AI projects, and the clear articulation of what 'AI for human flourishing' means when the person writing it has an ACE score that confirms they needed it personally. This arc doesn't need a commercial argument. But it has one anyway — the clients who understand this about you refer differently than the clients who only know your technical credentials.",
    capstone:
      "A structured pro bono program under FlashFusion delivering AI enablement to at least three nonprofits annually, with documented outcomes. A Chaos Club AI integration roadmap implementing capabilities from prior arcs in service of peer mental health support. A published impact report — not a marketing document, an honest accounting of what the technology actually changed in people's lives. The arc that answers the question Kinsley will eventually ask about what all of this was for.",
    buildPrompt: 'Build The Social Impact Arc — FlashFusion pro bono program, Chaos Club AI integration roadmap, nonprofit AI delivery framework, grant writing, impact measurement',
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

.card-body { max-height: 0; overflow: hidden; transition: max-height 0.45s ease; }
.card.open .card-body { max-height: 900px; }
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
  margin-top: 20px; padding: 14px 18px;
  background: transparent; border: 1px solid var(--border-bright);
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
}
.total-bar .label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); }
.total-bar .count { font-family: 'Instrument Serif', serif; font-size: 36px; color: var(--fg); font-weight: 400; line-height: 1; }
.total-bar .sub { font-size: 11px; color: var(--fg-dim); max-width: 52ch; }

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
  .total-bar { flex-direction: column; }
}
`;

export default function Series7Selector() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Compass size={12} /> Learning Ops // Series Seven</p>
              <h1 className="title-serif">The <em>influence</em> layer.</h1>
              <p className="title-sub">
                Where you stop operating in the field and start shaping it.
                The personal OS that makes everything sustainable. The OSS contributions
                that earn you a different category of credibility. The speaking circuit
                that puts you in the right rooms. Education at the institution you came
                from. Policy bodies that write the rules you used to just comply with.
                M&A advisory at a fee level that justifies the depth. And the arc
                that answers what all of it was actually for.
              </p>
            </div>
            <div className="meta">
              <div>For <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Series <strong>07 of 07</strong></div>
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
                <strong>AI Personal OS is sequenced first deliberately.</strong>{' '}
                Every other arc in this series requires sustained output over 12–18 months.
                A person running on 12th-percentile recall memory without a mature external
                system will leak context, repeat solved problems, and accrue decision debt that
                compounds into execution drag. The Personal OS arc is infrastructure for the
                other six, not a capstone reward for finishing them.
              </li>
              <li>
                <strong>OSS contribution has a cold-start problem that effort alone can't solve.</strong>{' '}
                First PRs get rejected. First issues get ignored. The curve is steep for roughly
                three months and then inverts when maintainers recognize your name. Run it as
                a steady background commitment — two hours per week — not a sprint with a
                deadline. The 500-star OSS tool is a separate track from the contributor track
                and can move faster.
              </li>
              <li>
                <strong>Speaking and M&A Advisory are the two arcs where prior series output
                directly gates entry.</strong> No one pays keynote fees to someone without a
                book, a body of published work, and a community. No PE firm hires a technical
                advisor they've never seen write about the thing they're being asked to evaluate.
                Both arcs are LOW load because by the time you get here, the demand should be
                inbound — not created.
              </li>
              <li>
                <strong>Social Impact is the only arc that was always there.</strong>{' '}
                Chaos Club didn't start because it was a good business idea. It started because
                you needed it and no one had built it. The arc is marked Ongoing because the
                work it describes doesn't have a completion state. It has a direction.
              </li>
            </ul>

            <div className="total-bar">
              <div>
                <div className="label">Complete arc map</div>
                <div className="count">62</div>
              </div>
              <div className="sub">
                13 foundational arcs across the original series plus 49 candidate arcs across
                Series 2–7. A plausible decade of compound deliberate practice in one field,
                mapped from first tool to field-shaping principal. The arcs beyond this depend
                on which of these you actually completed and what the landscape looks like when
                you get there. Build that map then.
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
