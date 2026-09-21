import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, Circle, Flag, AlertTriangle, Zap } from 'lucide-react';

const LANES = [
  {
    id: 'ff', em: 'FlashFusion', accent: '#7c3aed', surface: 'rgba(124,58,237,0.08)',
    gates: [
      'FreeAssessment operational · Ryan delivered · case study #1',
      'First paid audit at $4,500 floor — no exceptions',
      'Three audits · three case studies · referral motion warm',
      'First Enablement Sprint signed at $5K fixed',
      'Sprint #1 delivered · testimonial captured · retainer pipeline visible',
      'Mid-year: $50K cumulative · sprint pricing validated',
      'Sprints #2 + #3 in delivery · retainer offer formalized',
      'Skills Library compliance gaps closed · skill pack productized',
      'First retainer signed · Load-Bearing at 200 subs',
      'Two retainers active · audit pipeline self-sustaining',
      'First vCAIO conversation initiated with best-fit client',
      '$200K+ cumulative · Y2 strategy locked',
    ],
    sprints: [
      'Confirm FreeAssessment flow end-to-end. Send Ryan kickoff.',
      'Deliver Ryan audit. Capture artifacts for case study.',
      'Write Ryan case study draft. Schedule permission conversation.',
      'Ship case study live. Begin outreach to 2 prospects at floor.',
      'Outreach: 5 warm prospects contacted with Ryan case study.',
      'First discovery call. Hold $4,500 floor without hedging.',
      'Audit signed at $4,500. Kickoff scheduled.',
      'Audit delivered. Case study #2 captured.',
      'Third audit prospect contacted. Discovery + pricing call.',
      'Audit #3 signed and delivered.',
      'Three case studies live. Cross-link sequence built.',
      'Q1 retro: pricing held, conversion measured, exception check.',
      'Sprint offer page drafted. Scope-locked, fixed deliverables.',
      'Audit-to-sprint upsell motion: re-engage Q1 clients.',
      'First sprint discovery call. Scope discipline.',
      'Sprint #1 signed at $5K. Scope locked in writing.',
      'Sprint #1 W1 delivery. Daily-cadence client comms operational.',
      'Sprint #1 W2-3 delivery. Mid-sprint scope-creep gate.',
      'Sprint #1 W4 delivery + handoff. Testimonial captured.',
      'Sprint #1 case study published. Retainer conversations initiated.',
      'Two more sprint discovery calls. Pipeline review vs $222K.',
      'Sprint #2 signed. Sprint #3 in negotiation.',
      'Sprint #2 delivery W1-2. Sprint #3 closing.',
      'Mid-year retro: revenue actual vs target, lane discipline check.',
      'Retainer offer page drafted. Tier definition + boundaries.',
      'Sprint #2 delivered + Sprint #3 W1. Retainer pitch to 2 strongest.',
      'Sprint #3 W2-3 delivery. First retainer discovery call.',
      'Sprint #3 delivered. Retainer pipeline: 2 active conversations.',
      'Skills Library audit: confirm 4 compliance gaps. Triage fixes.',
      'Gap fix sprint W1: triggers + version-nesting fixes.',
      'Gap fix sprint W2: hooks + least-privilege. Library re-audit.',
      'Skill pack productized as audit deliverable. Hold floor.',
      'Retainer #1 signed. Onboarding sequence operationalized.',
      'Retainer #1 W1-2 delivery. Cadence + boundary tested live.',
      'Load-Bearing essay #5. Newsletter at 200 subs gate check.',
      'Retainer #2 close attempt. Audit pipeline self-sustaining?',
      'Retainer #2 signed. Cohort cadence locked for two clients.',
      'Audit pipeline: confirm 60%+ new audits via referrals.',
      'Q4 outreach focused on highest-fit only. Ladder positioned.',
      'Retainer #1 90-day review. vCAIO precursor conversation.',
      'vCAIO offer page drafted. Month-12+ positioning defined.',
      'vCAIO discovery with strongest retainer. Pricing $5-8K/mo.',
      'vCAIO scope negotiation. Bundle or replace retainer.',
      'vCAIO signed OR formal "not now" with Y2 path locked.',
      'Revenue actual vs $222K target measured. Honest assessment.',
      'Y2 strategy first draft: retainer vs audit vs vCAIO heavy.',
      'Y2 strategy review vs CCC + Memoir bandwidth.',
      'Y2 locked. Q5 onboarding. Year-one closing reflection.',
    ],
  },
  {
    id: 'ccc', em: 'ChaosClubCo', accent: '#e11d48', surface: 'rgba(225,29,72,0.08)',
    gates: [
      'Marketplace distribution strategy decided · launch path locked',
      'Launch executed · first 100 installs · feedback loop active',
      'Marketplace stable · plugin contribution path open',
      'Ample scope locked · v1 spec written · Figma synced',
      'Ample core feature shipped · 5 closed beta users active',
      'Mid-year: Ample v1 stable · marketplace 500+ · voice draft',
      'FissionPrompt v0.2 scope locked · sequencing decided',
      'FissionPrompt closed alpha · 3 generations shipped publicly',
      'Portfolio thesis tested · Chaos Collective decision',
      'Brand voice doc finalized · 14 pillars resolved',
      'One flagship surfaces · investment concentration',
      'Y2 strategy locked · ChaosClubCo identity stable',
    ],
    sprints: [
      'Audit plugins-plus state. Confirm 244 installable.',
      'Distribution path: marketplace vs blog vs Anthropic partner.',
      'README + landing polish for chosen path. Demo recorded.',
      'Launch sequence drafted. Outreach list built. Date locked.',
      'Launch day execution. Coordinated post + outreach + community.',
      'Week 2 metrics. Install count, install-to-active ratio.',
      'First wave feedback triaged. Top 5 plugin issues identified.',
      'Top issues patched. Second outreach wave to fence-sitters.',
      'Plugin contribution guide drafted. PR template built.',
      'First external contributor onboarded. PR merged.',
      'Plugin spotlight: 5 best plugins as standalone posts.',
      'Q1 retro: distribution honest. Solo product or feeder?',
      'Ample current state audit. Exists vs Figma file.',
      'Scope: v1 minimum surface. Cut everything optional.',
      'Spec written: features in/out, success criteria.',
      'Figma file synced to v1 spec. Handoff doc.',
      'Core build W1: foundation + auth.',
      'Core build W2: primary user flow end-to-end.',
      'Core build W3: feedback capture built in.',
      '5 closed beta users invited. Feedback loop active.',
      'Ample week 1 production feedback. Top 3 bugs triaged.',
      'Bug fixes + UX polish based on beta data.',
      'Marketplace 500-install gate check. Trajectory honest.',
      'Brand voice doc first draft. 14 pillars activated or pruned.',
      'FissionPrompt current state audit (last commit Nov 2025).',
      'Sequencing decision: parallel with Ample or sequential?',
      'v0.2 scope written. Cut everything off critical path.',
      'Build kickoff. Resource allocation vs FF + Memoir docd.',
      'Alpha build W1: core generation pipeline operational.',
      'Alpha build W2: 3 example videos shipped publicly.',
      'Alpha user onboarding: 3 trusted testers invited.',
      'Alpha feedback triage. Top issues prioritized.',
      'Three products evaluated: use, revenue, brand fit.',
      'Chaos Collective vs ChaosClubCo: rebrand, separate, or kill?',
      'Decision documented with evidence. Voice doc updated.',
      'Q3 retro: which product earns more, which sunsets.',
      'Brand voice doc audit. Three flagged pillars resolved.',
      'Brand voice integrated across marketplace + Ample + Fission.',
      'Content style guide finalized: structure, voice, discipline.',
      'Brand audit external review (Lafu or trusted reader).',
      'Three-product evaluation: distribution, use, revenue, leverage.',
      'Flagship decision: marketplace, Ample, Fission, or new.',
      'Investment concentration: 70% flagship, 30% maintenance.',
      'Y2 portfolio shape written. Decision rationale captured.',
      'Y2 strategy first draft. Single vs portfolio reaffirmed.',
      'Lane discipline retro: any FF or Memoir bleed?',
      'ChaosClubCo identity statement finalized.',
      'Y2 plan locked. Year-one closing reflection.',
    ],
  },
  {
    id: 'memoir', em: 'Memoir', accent: '#b89968', surface: 'rgba(184,153,104,0.08)',
    gates: [
      'Session 3 Tool Archaeology complete — three chapters unblocked',
      'Tom Ropel chapter excavated · best-friend material captured',
      'Dave Datt excavated · Tier-3 tasks completed · Q1 retro',
      'Opening chapter drafted — voice locked, frame established',
      'Chapters 2-3 drafted · recursive-trap framing tested',
      'Mid-year: 5 chapters drafted · cognitive-profile thesis tested',
      'Chapters 6-8 drafted · Tom Ropel + Dave Datt material',
      'Chapters 9-10 · Sedona · card-table origin',
      'First draft complete · structure decision triggered',
      'Structural revision complete · chapter order locked',
      'Manuscript at submittable quality · attorney review triggered',
      'Agent submission path decided · Y2 plan locked',
    ],
    sprints: [
      'Tool Archaeology session structure prepared. Materials assembled.',
      'Session run W1. Raw material captured to material bank.',
      'Session run W2. Specificity discipline; theme-jumping resisted.',
      'Material organized into chapter feeds. Three unblocks logged.',
      'Tom Ropel material prep. Remembered vs missing surfaced.',
      'Excavation W1: specifics before themes. Sensory first.',
      'Excavation W2: moments not remembered named explicitly.',
      'Contradictions preserved. Pseudonym question logged for legal.',
      'Dave Datt material prep. Aneurysm framing with care.',
      'Excavation conducted. What survived him in Kyles practice.',
      'Tier-3 tasks closed (follow-up SPECT, Aug 2 2022 scene).',
      'Q1 retro: depth, new unblocks, what still owes work.',
      'Opening scene decision: from excavation, which opens the book.',
      'First draft W1. Letter-to-Kinsley frame enforced.',
      'First draft W2-3. Sensory specifics; no realized moments.',
      'Opening chapter complete. External read for frame audit.',
      'Chapter 2 (origins) drafted — addiction to hypoxia to injury.',
      'Chapter 3 (the trap) drafted — recursive framing tested.',
      'Read-aloud: Kyles voice or memoirist performing Kyle?',
      'Revisions. Performance language excised. Declarative preserved.',
      'Chapter 4 (tools as prosthetic memory) drafted.',
      'Chapter 5 (OToole, diagnostic instinct) drafted.',
      'Sudowrite manuscript consolidated. Chapter order tested.',
      'Mid-year retro: voice, frame discipline, lane separation honest.',
      'Chapter 6 (Tom Ropel) drafted from Q1 excavation material.',
      'Chapter 7 (friends who survived him) drafted.',
      'Chapter 8 (Dave Datt) drafted — aneurysm framing care.',
      'Pseudonym pass for all living people. Legal log updated.',
      'Chapter 9 (Sedona / Soaring Bear / arrangement by Phillis).',
      'Chapter 10 (card table — self-teaching origin) drafted.',
      'Read-aloud: construction-not-recovery thesis visible in prose.',
      'Revisions. Brave-recovery moments rewritten or cut.',
      'Final chapter drafted. Letter-to-Kinsley frame closes deliberately.',
      'End-to-end read. Chapters compress, expand, or move.',
      'Structure decision: chronological, thematic, letter-sequence?',
      'Q3 retro: draft exists. Honest read. Distance before revision.',
      'Structural revision: scenes moved, compressed, cut per M9.',
      'Second draft W1: opening + first three chapters.',
      'Second draft W2: middle four chapters.',
      'External structural read by one trusted reader.',
      'Second draft W3: late chapters + ending.',
      'Manuscript polish: line edits, voice consistency.',
      'Attorney review scheduled for Michael journal sections.',
      'Comp titles confirmed. Query letter first draft.',
      'Agent research: who represents Solomon/Mate/Cahalan comps.',
      'Query letter polish. Synopsis written. First 50 pages prepared.',
      'Submission decision: query now, query Y2, or self-publish.',
      'Y2 plan locked. Year-one reflection. Frame reaffirmed.',
    ],
  },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
* { box-sizing: border-box; }
:root { --bg: #0c0d10; --bg-2: #14161b; --bg-3: #1c1f29; --fg: #e8e9ed; --fg-dim: #8a8f9a; --fg-mute: #555a65; --border: #1f2229; --border-bright: #2c303a; }
body, .root { margin: 0; background: var(--bg); color: var(--fg); font-family: 'JetBrains Mono', monospace; font-size: 14px; line-height: 1.55; }
.root { min-height: 100vh; padding: 48px 24px 96px; background: radial-gradient(ellipse 80% 40% at 50% -10%, rgba(203,213,225,0.04), transparent 60%), var(--bg); }
.container { max-width: 1320px; margin: 0 auto; }
.header { display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end; padding-bottom: 24px; border-bottom: 1px solid var(--border); margin-bottom: 28px; }
.kicker { font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em; color: var(--fg-dim); margin: 0 0 14px; display: flex; align-items: center; gap: 8px; }
.title { font-family: 'Instrument Serif', serif; font-size: clamp(38px, 5.4vw, 64px); line-height: 0.96; letter-spacing: -0.02em; margin: 0; font-weight: 400; }
.title em { color: #cbd5e1; font-style: italic; }
.title-sub { font-size: 13px; color: var(--fg-dim); margin: 12px 0 0; max-width: 60ch; line-height: 1.65; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.14em; }
.meta strong { color: var(--fg); font-weight: 500; }
.controls { display: grid; grid-template-columns: auto auto 1fr; gap: 16px; align-items: center; margin-bottom: 24px; padding: 12px 18px; background: var(--bg-2); border: 1px solid var(--border); }
.control-block { display: flex; align-items: center; gap: 10px; }
.control-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); }
.stepper { display: flex; align-items: center; gap: 4px; }
.step-btn { background: var(--bg-3); border: 1px solid var(--border-bright); color: var(--fg); padding: 4px 6px; cursor: pointer; display: flex; align-items: center; }
.step-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.step-val { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 22px; color: var(--fg); padding: 0 8px; min-width: 40px; text-align: center; }
.layout { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }
.lanes-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
.lane-col { border: 1px solid var(--border); background: var(--bg-2); border-top: 3px solid var(--lane-accent); }
.lane-col-head { padding: 14px 16px; border-bottom: 1px solid var(--border); }
.lane-col-name { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 22px; color: var(--fg); line-height: 1; font-weight: 400; }
.lane-col-name em { color: var(--lane-accent); }
.lane-month-gate { padding: 12px 16px; background: var(--lane-surface); border-bottom: 1px solid var(--border); }
.gate-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--lane-accent); margin-bottom: 4px; font-weight: 500; }
.gate-text { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 14px; color: var(--fg); line-height: 1.4; }
.weeks { display: grid; }
.week { padding: 10px 16px; border-top: 1px solid var(--border); cursor: pointer; display: grid; grid-template-rows: auto 1fr; gap: 6px; min-height: 78px; }
.week:hover { background: rgba(255,255,255,0.015); }
.week:first-child { border-top: none; }
.week.current { background: rgba(255,255,255,0.025); border-left: 2px solid var(--lane-accent); padding-left: 14px; }
.week.done .week-text { color: var(--fg-mute); text-decoration: line-through; text-decoration-color: rgba(255,255,255,0.2); }
.week-head { display: flex; justify-content: space-between; align-items: center; }
.week-label { font-size: 9px; letter-spacing: 0.16em; color: var(--fg-dim); }
.week.current .week-label { color: var(--lane-accent); font-weight: 600; }
.week-check { color: var(--fg-mute); }
.week.done .week-check { color: var(--lane-accent); }
.week-text { font-size: 11px; color: var(--fg); line-height: 1.5; }
.sidebar { position: sticky; top: 24px; display: grid; gap: 12px; }
.stat-card { border: 1px solid var(--border); background: var(--bg-2); padding: 16px; }
.stat-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.stat-value { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 30px; line-height: 1; font-weight: 400; }
.stat-unit { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--fg-dim); font-style: normal; margin-left: 4px; }
.stat-meta { margin-top: 8px; font-size: 10.5px; color: var(--fg-dim); line-height: 1.55; }
.lane-progress { display: grid; gap: 8px; margin-top: 6px; }
.lp-row { display: grid; grid-template-columns: 8px 1fr auto; gap: 10px; align-items: center; padding: 4px 0; }
.lp-dot { width: 8px; height: 8px; background: var(--lp-accent); }
.lp-name { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 14px; color: var(--fg); }
.lp-name em { color: var(--lp-accent); font-style: italic; }
.lp-pct { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--fg-dim); }
.flag { padding: 12px 14px; border-left: 2px solid var(--flag-color); background: var(--bg-2); border-top: 1px solid var(--border); border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); font-size: 11px; color: var(--fg); line-height: 1.55; }
.flag-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--flag-color); font-weight: 500; margin-bottom: 5px; display: flex; align-items: center; gap: 6px; }
.claims { margin-top: 32px; padding: 22px; border: 1px solid var(--border); background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7; }
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }
.claims strong { color: var(--fg); font-weight: 500; }
@media (max-width: 1100px) { .lanes-grid { grid-template-columns: 1fr; } }
@media (max-width: 880px) { .layout { grid-template-columns: 1fr; } .sidebar { position: static; } .header { grid-template-columns: 1fr; } .meta { text-align: left; } }
`;

export default function LaneDashboard() {
  const [month, setMonth] = useState(1);
  const [week, setWeek] = useState(1);
  const [done, setDone] = useState(new Set());

  const toggleTask = (laneId, m, w) => {
    const key = `${laneId}-${m}-${w}`;
    setDone(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  };

  const stats = useMemo(() => {
    const lanePcts = LANES.map(lane => {
      let total = 0, completed = 0;
      for (let m = 1; m <= 12; m++) for (let w = 1; w <= 4; w++) { total++; if (done.has(`${lane.id}-${m}-${w}`)) completed++; }
      return { lane, pct: Math.round((completed/total)*100), done: completed };
    });
    const thisWeekDone = LANES.map(l => `${l.id}-${month}-${week}`).filter(k => done.has(k)).length;

    const max = Math.max(...lanePcts.map(l => l.done));
    const min = Math.min(...lanePcts.map(l => l.done));

    let flag;
    if (thisWeekDone === 3) flag = { type: 'ok', text: `All three lanes shipped W${week}. Strong week. Don't pull next week's work forward — rest counts.` };
    else if (max - min >= 8 && (lanePcts[0].done + lanePcts[1].done + lanePcts[2].done > 0)) {
      const dom = lanePcts.find(l => l.done === max).lane;
      const slip = lanePcts.find(l => l.done === min).lane;
      flag = { type: 'warn', text: `Lane imbalance: ${dom.em} dominating (${max} sprints) while ${slip.em} slipping (${min}). Reallocate at next planning window.` };
    } else if (thisWeekDone === 0 && week >= 3) flag = { type: 'warn', text: `Nothing checked across any lane in W${week} of M${month}. Catch up this weekend or formally renegotiate M${month} gates.` };
    else flag = { type: 'neutral', text: `Pace looks normal for W${week} of M${month}. ${thisWeekDone}/3 lanes shipped this week.` };

    return { lanePcts, thisWeekDone, flag };
  }, [done, month, week]);

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">
          <div className="header">
            <div>
              <p className="kicker"><Calendar size={12} /> Execution Layer // Operational Surface</p>
              <h1 className="title">This <em>week</em>.</h1>
              <p className="title-sub">Three lanes side by side. Current month gate per lane. Four weeks of sprints per lane with the current week highlighted. Check things off; the sidebar surfaces lane balance and pattern flags.</p>
            </div>
            <div className="meta">
              <div>Active <strong>3 lanes</strong></div>
              <div style={{ marginTop: 4 }}>Position <strong>M{month} · W{week}</strong></div>
              <div style={{ marginTop: 4 }}>This week <strong>{stats.thisWeekDone}/3 shipped</strong></div>
            </div>
          </div>
          <div className="controls">
            <div className="control-block">
              <span className="control-label">Month</span>
              <div className="stepper">
                <button className="step-btn" onClick={() => setMonth(m => Math.max(1, m-1))} disabled={month === 1}><ChevronLeft size={14} /></button>
                <span className="step-val">M{month}</span>
                <button className="step-btn" onClick={() => setMonth(m => Math.min(12, m+1))} disabled={month === 12}><ChevronRight size={14} /></button>
              </div>
            </div>
            <div className="control-block">
              <span className="control-label">Week</span>
              <div className="stepper">
                <button className="step-btn" onClick={() => setWeek(w => Math.max(1, w-1))} disabled={week === 1}><ChevronLeft size={14} /></button>
                <span className="step-val">W{week}</span>
                <button className="step-btn" onClick={() => setWeek(w => Math.min(4, w+1))} disabled={week === 4}><ChevronRight size={14} /></button>
              </div>
            </div>
          </div>
          <div className="layout">
            <div className="lanes-grid">
              {LANES.map(lane => {
                const monthIdx = month - 1;
                const gate = lane.gates[monthIdx];
                return (
                  <div key={lane.id} className="lane-col" style={{ ['--lane-accent']: lane.accent, ['--lane-surface']: lane.surface }}>
                    <div className="lane-col-head">
                      <div className="lane-col-name">The <em>{lane.em}</em>.</div>
                    </div>
                    <div className="lane-month-gate">
                      <div className="gate-label">M{month} gate</div>
                      <div className="gate-text">{gate}</div>
                    </div>
                    <div className="weeks">
                      {[1,2,3,4].map(w => {
                        const sprintIdx = monthIdx * 4 + (w-1);
                        const sprintText = lane.sprints[sprintIdx] || '—';
                        const key = `${lane.id}-${month}-${w}`;
                        const isDone = done.has(key);
                        const isCurrent = w === week;
                        return (
                          <div key={w} className={`week ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''}`} onClick={() => toggleTask(lane.id, month, w)}>
                            <div className="week-head">
                              <span className="week-label">W{w}</span>
                              {isDone ? <CheckCircle2 size={13} className="week-check" /> : <Circle size={13} className="week-check" />}
                            </div>
                            <div className="week-text">{sprintText}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="sidebar">
              <div className="stat-card">
                <div className="stat-label"><Zap size={9} /> This week</div>
                <div className="stat-value">{stats.thisWeekDone}<span className="stat-unit">/ 3 lanes</span></div>
                <div className="stat-meta">W{week} of M{month}. One sprint per active lane this week.</div>
              </div>
              <div className="stat-card">
                <div className="stat-label"><Flag size={9} /> Lane progress (year)</div>
                <div className="lane-progress">
                  {stats.lanePcts.map(({ lane, pct, done }) => (
                    <div key={lane.id} className="lp-row" style={{ ['--lp-accent']: lane.accent }}>
                      <div className="lp-dot" />
                      <div className="lp-name">The <em>{lane.em}</em>.</div>
                      <div className="lp-pct">{done}/48 · {pct}%</div>
                    </div>
                  ))}
                </div>
                <div className="stat-meta" style={{ marginTop: 12 }}>Lane balance is the leading indicator. If one lane runs &gt;15% ahead of another, the allocation needs renegotiation.</div>
              </div>
              {stats.flag && (
                <div className="flag" style={{ ['--flag-color']: stats.flag.type === 'ok' ? '#4ade80' : stats.flag.type === 'warn' ? '#fb923c' : '#8a8f9a' }}>
                  <div className="flag-label"><AlertTriangle size={9} /> Pattern flag</div>
                  {stats.flag.text}
                </div>
              )}
            </div>
          </div>
          <div className="claims">
            <h4>Dashboard logic</h4>
            <ul>
              <li><strong>Three lanes side-by-side, not stacked.</strong> Each lane stays in its own accent color (purple/rose/brass). Lane discipline at the operational level, not just the planning level.</li>
              <li><strong>Lane balance is the leading indicator.</strong> Sprint check-rate fluctuates; cumulative balance across lanes determines whether the year compounds. &gt;15% spread = allocation was wrong, not the worker.</li>
              <li><strong>Pattern flags surface conditions, not prescriptions.</strong> All three shipped (ok), imbalance (warn), nothing late in month (warn), default pace (neutral). Renegotiation, not heroics.</li>
              <li><strong>Demo state is M1·W1 with all 0s.</strong> Step through months and weeks. Hardcoded sprint data current as of the three arc files in this project.</li>
              <li><strong>Not yet modeled:</strong> retrospective free-text per week, state persistence between sessions, integration with Allocator pace toggles, capstone tracking separate from weekly sprints.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
