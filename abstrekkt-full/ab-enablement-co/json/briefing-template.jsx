import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, FileText, Send, Eye, Edit3, Compass, Target, Layers, MessageSquare, Printer, Briefcase } from 'lucide-react';

// ---------------------------------------------------------------------------
// ARC DATA — same 3 arcs as execution dashboard, gates only (briefing doesn't
// need weekly sprint detail — only monthly gates)
// ---------------------------------------------------------------------------

const ARCS = [
  {
    id: 'claude', title: 'Claude Arc', em: 'Claude', accent: '#e07856',
    gates: [
      'Architect Foundations cert earned',
      'Sonnet 4.6 differences applied to one production project',
      'Tool use + structured outputs patterns operational',
      'Computer use exploratory project shipped',
      'First MCP server published to Anthropic registry',
      'Constitutional AI principles internalized + documented',
      'Agentic workflow patterns documented as playbook',
      'Multi-agent orchestration first version shipped',
      'Prompt eval discipline operational across 3 projects',
      'Production deployment runbook published',
      'Claude Architect cert sit + passed',
      'Year retrospective + Y2 Claude depth plan published',
    ],
  },
  {
    id: 'security', title: 'Security Arc', em: 'Security', accent: '#e05252',
    gates: [
      'OWASP Top 10 for LLMs internalized + applied to current systems',
      'Threat modeling toolkit for AI systems documented',
      'Prompt injection defense patterns operational',
      'Multi-tenant isolation architecture documented',
      'SecAI+ cert sit + passed',
      'Adversarial testing toolkit operational',
      'Multi-tenant isolation capstone shipped',
      'AI access control patterns documented as playbook',
      'Incident response runbook for AI failures',
      'Compliance framework introduction (HIPAA + SOC2)',
      'CAISP cert sit + passed',
      'Security year retrospective + Series 3 Regulated decision',
    ],
  },
  {
    id: 'brand', title: 'Brand Arc', em: 'Brand', accent: '#38bdf8',
    gates: [
      'LinkedIn positioning audit complete + repositioning live',
      'The Prompt editorial cadence locked at weekly',
      'First flagship long-form post published',
      'CLC strategic conversation completed',
      'Anthropic Ambassador pathway initiated',
      '500 followers checkpoint',
      'Flagship long-form #2 published (technical depth piece)',
      'Speaking circuit: first booking confirmed',
      'First podcast appearance recorded',
      '1000 followers checkpoint',
      'Year flagship: substantial published artifact',
      'Year retrospective + Y2 brand strategy',
    ],
  },
];

// ---------------------------------------------------------------------------
// STAKEHOLDER FRAMINGS — different angles on the same underlying work
// ---------------------------------------------------------------------------

const STAKEHOLDERS = [
  {
    id: 'daniel',
    name: 'Daniel',
    role: 'AIaaS Product / Direct Cadence',
    framing: 'Capability growth + cross-arc compounding + Head-of-AIaaS readiness signals',
    tldr: 'Monthly capability update on the AI portfolio I\'m developing in parallel with my service desk role — what shipped, what it unlocks, what I need from you to keep the velocity.',
    implication: 'The arcs are compounding faster than I expected. The cross-arc cap­stones are starting to look more like service-line foundations than like personal learning projects. Worth a 30-min strategic conversation about how this surfaces against the AIaaS function we\'ve been discussing.',
    asks: 'Confirm whether the leadership alignment meeting is the right venue to surface portfolio progress, or whether to keep it in our 1:1s through Q2 and surface formally only at quarterly cadence.',
  },
  {
    id: 'jackie',
    name: 'Jackie',
    role: 'Cross-Functional / Delivery',
    framing: 'Tangible outputs + cross-team dependencies + capacity signals',
    tldr: 'Quick monthly view of the AI capability work I\'m running — focus on shipped artifacts, what they unlock for cross-team use, and where I see dependencies you should know about.',
    implication: 'Several of the capstones (multi-tenant isolation architecture, MCP server, eval discipline playbook) are reusable across teams. If any of your projects could benefit from these as starting points, the patterns are documented and portable rather than locked in my head.',
    asks: 'Flag any cross-team initiatives where the arc capstones might shortcut work your team is otherwise about to start. I\'d rather hand off than re-explain.',
  },
  {
    id: 'dave',
    name: 'Dave',
    role: 'Executive / Strategic',
    framing: 'Intinc differentiation + market positioning + AIaaS strategic case',
    tldr: 'Quarterly progress on AI capability development positioning Intinc for AIaaS expansion — what changed in our depth, what it means against the market, what the next quarter looks like.',
    implication: 'The portfolio is structurally building the capability profile of an AIaaS practice lead — multi-platform fluency, security depth, eval discipline, MCP-ecosystem positioning, publishing surface. The Y1 outcome maps to something between "ready to lead an AIaaS function" and "ready to consult into AIaaS pilots". The Y2 decision will need to be deliberate.',
    asks: 'Place the AIaaS service-line conversation on the Q3 leadership agenda formally. Whether the answer is yes, not yet, or never — the deliberate decision is what I need to plan around.',
  },
];

// ---------------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------------

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #0d0e12;
  --bg-2: #161820;
  --bg-3: #1c1f29;
  --paper: #f5f1e8;
  --paper-2: #e8e2d2;
  --paper-fg: #1a1714;
  --paper-fg-dim: #57514a;
  --paper-fg-mute: #8a847a;
  --paper-border: #d4cbb8;
  --paper-border-light: #e0d8c5;

  --fg: #e8e9ed;
  --fg-dim: #8a8f9a;
  --fg-mute: #555a65;
  --border: #1f2229;
  --border-bright: #2c303a;
  --accent: #c4a875;
}

body, .root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 40% at 50% -10%, rgba(196,168,117,0.04), transparent 60%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1280px; margin: 0 auto; }

/* HEADER */
.header {
  display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end;
  padding-bottom: 24px; border-bottom: 1px solid var(--border); margin-bottom: 28px;
}
.kicker {
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em;
  color: var(--fg-dim); margin: 0 0 14px; display: flex; align-items: center; gap: 8px;
}
.title-serif {
  font-family: 'Instrument Serif', serif; font-size: clamp(38px, 5.4vw, 64px);
  line-height: 0.96; letter-spacing: -0.02em; margin: 0; font-weight: 400; color: var(--fg);
}
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub {
  font-size: 12.5px; color: var(--fg-dim); margin: 12px 0 0;
  max-width: 60ch; line-height: 1.6;
}
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--fg); font-weight: 500; }

/* CONTROLS */
.controls {
  display: grid; grid-template-columns: auto auto auto 1fr auto; gap: 16px; align-items: center;
  margin-bottom: 28px; padding: 14px 18px;
  background: var(--bg-2); border: 1px solid var(--border);
}
.control-block { display: flex; align-items: center; gap: 10px; }
.control-label {
  font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim);
}
.control-stepper { display: flex; align-items: center; gap: 4px; }
.stepper-btn {
  background: var(--bg-3); border: 1px solid var(--border-bright);
  color: var(--fg); padding: 4px 6px; cursor: pointer; display: flex; align-items: center;
  transition: background 0.15s;
}
.stepper-btn:hover { background: var(--border-bright); }
.stepper-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.stepper-val {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 20px; color: var(--fg); padding: 0 8px; min-width: 36px; text-align: center;
}
.cadence-toggle {
  display: flex; border: 1px solid var(--border-bright); background: var(--bg-3);
}
.cadence-btn {
  padding: 6px 12px; background: transparent; border: none; cursor: pointer;
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.15em; text-transform: uppercase; color: var(--fg-dim);
}
.cadence-btn.active {
  background: var(--accent); color: var(--bg);
  font-weight: 500;
}
.stakeholder-pills { display: flex; gap: 6px; justify-content: flex-end; }
.stakeholder-pill {
  padding: 6px 12px; background: var(--bg-3); border: 1px solid var(--border-bright);
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-dim);
  cursor: pointer; transition: all 0.15s; font-family: 'JetBrains Mono', monospace;
}
.stakeholder-pill:hover { color: var(--fg); }
.stakeholder-pill.active {
  color: var(--accent); border-color: var(--accent);
  background: rgba(196,168,117,0.06);
}
.view-toggle {
  display: flex; align-items: center; gap: 4px;
  padding: 6px 10px; background: var(--bg-3); border: 1px solid var(--border-bright);
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-dim);
  cursor: pointer; font-family: 'JetBrains Mono', monospace;
}
.view-toggle:hover { color: var(--fg); }
.view-toggle.active { color: var(--accent); border-color: var(--accent); }

/* LAYOUT */
.layout { display: grid; grid-template-columns: 1fr 300px; gap: 28px; align-items: start; }
.layout.is-print { grid-template-columns: 1fr; }

/* BRIEFING DOCUMENT — looks like a paper document on the dark page */
.brief {
  background: var(--paper); color: var(--paper-fg);
  border: 1px solid var(--paper-border);
  padding: 56px 64px;
  font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.7;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5);
}

.brief-head {
  display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: end;
  padding-bottom: 24px; border-bottom: 1.5px solid var(--paper-fg);
  margin-bottom: 28px;
}
.brief-title {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 38px; color: var(--paper-fg); line-height: 1; font-weight: 400;
  margin: 0;
}
.brief-stamps {
  text-align: right; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--paper-fg-dim); line-height: 1.7;
}
.brief-stamps strong { color: var(--paper-fg); font-weight: 600; }

.brief-section { margin-bottom: 28px; }
.brief-section:last-child { margin-bottom: 0; }
.brief-section-label {
  font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase;
  color: var(--paper-fg-mute); margin-bottom: 8px; font-weight: 500;
  display: flex; align-items: center; gap: 6px;
}
.brief-section-num {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 14px; color: var(--accent); font-weight: 400;
  margin-right: 4px;
}
.brief-textarea {
  width: 100%; background: transparent; border: none; outline: none; resize: vertical;
  font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.7;
  color: var(--paper-fg); padding: 0; min-height: 60px;
  border-bottom: 1px dashed var(--paper-border-light);
  padding-bottom: 8px;
}
.brief-textarea:focus { border-bottom-color: var(--accent); }
.brief-textarea.is-tldr { font-style: italic; font-size: 14.5px; min-height: 80px; }
.brief-textarea.is-asks { min-height: 100px; }

/* Auto-generated sections — gates met */
.brief-gates-list { padding-left: 0; list-style: none; margin: 0; }
.brief-gate-item {
  display: grid; grid-template-columns: 16px 1fr auto; gap: 12px; align-items: start;
  padding: 8px 0;
  border-bottom: 1px dashed var(--paper-border-light);
}
.brief-gate-item:last-child { border-bottom: none; }
.brief-gate-checkbox {
  width: 12px; height: 12px; border: 1.5px solid var(--paper-fg-mute);
  margin-top: 4px; cursor: pointer; transition: all 0.15s;
}
.brief-gate-checkbox.met {
  background: var(--gate-color); border-color: var(--gate-color);
}
.brief-gate-text { font-size: 13px; color: var(--paper-fg); line-height: 1.55; }
.brief-gate-text strong { color: var(--gate-color); font-weight: 600; }
.brief-gate-meta {
  font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--paper-fg-mute); white-space: nowrap;
}
.brief-gates-empty {
  font-size: 12px; color: var(--paper-fg-mute); font-style: italic;
  padding: 12px 0; border-bottom: 1px dashed var(--paper-border-light);
}

.brief-foot {
  margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--paper-border);
  display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--paper-fg-mute);
}
.brief-foot strong { color: var(--paper-fg-dim); font-weight: 500; }
.brief-foot-sig {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 14px; color: var(--paper-fg); letter-spacing: 0;
  text-transform: none;
}

/* SIDEBAR */
.sidebar { position: sticky; top: 24px; display: grid; gap: 12px; }
.stat-card {
  border: 1px solid var(--border); background: var(--bg-2);
  padding: 16px;
}
.stat-label {
  font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--fg-dim); margin-bottom: 10px;
  display: flex; align-items: center; gap: 6px;
}
.stat-value {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 32px; line-height: 1; color: var(--fg); font-weight: 400;
}
.stat-unit {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--fg-dim); font-style: normal; margin-left: 4px;
}
.stat-meta {
  margin-top: 8px; font-size: 10.5px; color: var(--fg-dim); line-height: 1.55;
}

.framing-card {
  border: 1px solid var(--border); background: var(--bg-2);
  border-left: 2px solid var(--accent);
  padding: 16px;
}
.framing-name {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 22px; color: var(--fg); margin: 0 0 4px; font-weight: 400; line-height: 1;
}
.framing-role {
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 10px;
}
.framing-emphasis {
  font-size: 11.5px; color: var(--fg); line-height: 1.6;
  padding-top: 10px; border-top: 1px solid var(--border);
}
.framing-emphasis strong { color: var(--accent); }

.arc-toggles-side {
  border: 1px solid var(--border); background: var(--bg-2); padding: 16px;
}
.arc-toggle-row {
  display: grid; grid-template-columns: 14px 1fr auto; gap: 10px; align-items: center;
  padding: 8px 0; cursor: pointer; transition: opacity 0.15s;
  border-bottom: 1px solid var(--border);
}
.arc-toggle-row:last-child { border-bottom: none; }
.arc-toggle-row.inactive { opacity: 0.4; }
.arc-toggle-dot {
  width: 10px; height: 10px; background: var(--at-accent); border: 1.5px solid var(--at-accent);
}
.arc-toggle-row.inactive .arc-toggle-dot { background: transparent; }
.arc-toggle-name {
  font-size: 12px; color: var(--fg);
}
.arc-toggle-name em { color: var(--at-accent); font-style: normal; font-weight: 600; }
.arc-toggle-met {
  font-size: 9.5px; letter-spacing: 0.14em; color: var(--fg-dim);
  font-family: 'JetBrains Mono', monospace;
}

/* CLAIMS */
.claims {
  margin-top: 36px; padding: 22px; border: 1px solid var(--border);
  background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7;
}
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }
.claims strong { color: var(--fg); font-weight: 500; }

@media (max-width: 980px) {
  .layout, .layout.is-print { grid-template-columns: 1fr; }
  .sidebar { position: static; }
  .header { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .controls { grid-template-columns: 1fr; }
  .stakeholder-pills { justify-content: flex-start; flex-wrap: wrap; }
  .brief { padding: 32px 28px; }
  .brief-head { grid-template-columns: 1fr; }
  .brief-stamps { text-align: left; }
}

@media print {
  .root { background: white; padding: 0; }
  .container { max-width: none; }
  .header, .controls, .sidebar, .claims { display: none; }
  .layout { grid-template-columns: 1fr; }
  .brief { box-shadow: none; border: none; padding: 0; }
}
`;

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function BriefingTemplate() {
  const [month, setMonth] = useState(3);
  const [cadence, setCadence] = useState('monthly');
  const [stakeholderId, setStakeholderId] = useState('daniel');
  const [activeArcs, setActiveArcs] = useState(new Set(['claude', 'security', 'brand']));
  const [metGates, setMetGates] = useState(new Set([
    // Default: M1+M2 gates from all arcs marked met (for demo realism at M3 view)
    'claude-1', 'claude-2',
    'security-1', 'security-2',
    'brand-1', 'brand-2',
  ]));
  const [printView, setPrintView] = useState(false);

  // Editable narratives per stakeholder
  const [narratives, setNarratives] = useState({});

  const stakeholder = STAKEHOLDERS.find(s => s.id === stakeholderId);

  // Compute period range
  const periodMonths = useMemo(() => {
    if (cadence === 'monthly') return [month];
    // quarterly: M1 → Q1=[1,2,3]; M4 → Q2=[4,5,6]; etc
    const qStart = Math.floor((month - 1) / 3) * 3 + 1;
    return [qStart, qStart + 1, qStart + 2];
  }, [month, cadence]);

  const periodLabel = useMemo(() => {
    if (cadence === 'monthly') return `M${month}`;
    const q = Math.floor((month - 1) / 3) + 1;
    return `Q${q}`;
  }, [month, cadence]);

  // Compute gates met in this period across active arcs
  const periodGates = useMemo(() => {
    const result = [];
    ARCS.forEach(arc => {
      if (!activeArcs.has(arc.id)) return;
      periodMonths.forEach(m => {
        const idx = m - 1;
        if (arc.gates[idx]) {
          const key = `${arc.id}-${m}`;
          result.push({
            arcId: arc.id,
            arcEm: arc.em,
            accent: arc.accent,
            month: m,
            gate: arc.gates[idx],
            met: metGates.has(key),
            key,
          });
        }
      });
    });
    return result;
  }, [periodMonths, activeArcs, metGates]);

  const metCount = periodGates.filter(g => g.met).length;
  const totalGates = periodGates.length;

  // Next period gates (forward look)
  const nextPeriodGates = useMemo(() => {
    const nextMonths = cadence === 'monthly'
      ? [month + 1].filter(m => m <= 12)
      : periodMonths.map(m => m + 3).filter(m => m <= 12);
    const result = [];
    ARCS.forEach(arc => {
      if (!activeArcs.has(arc.id)) return;
      nextMonths.forEach(m => {
        const idx = m - 1;
        if (arc.gates[idx]) {
          result.push({ arcEm: arc.em, accent: arc.accent, month: m, gate: arc.gates[idx] });
        }
      });
    });
    return result;
  }, [periodMonths, month, cadence, activeArcs]);

  // Year-to-date cumulative
  const ytdMet = useMemo(() => {
    let count = 0;
    metGates.forEach(key => {
      const [arcId] = key.split('-');
      if (activeArcs.has(arcId)) count += 1;
    });
    return count;
  }, [metGates, activeArcs]);

  const toggleGate = (key) => {
    setMetGates(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleArc = (id) => {
    setActiveArcs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const narrativeKey = (field) => `${stakeholderId}-${cadence}-${periodLabel}-${field}`;
  const getNarrative = (field, fallback) =>
    narratives[narrativeKey(field)] ?? fallback;
  const setNarrative = (field, val) =>
    setNarratives(prev => ({ ...prev, [narrativeKey(field)]: val }));

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header">
            <div>
              <p className="kicker"><FileText size={12} /> Learning Ops // Upward Communication</p>
              <h1 className="title-serif">The <em>Briefing</em>.</h1>
              <p className="title-sub">
                Arc progress translated for leadership. Three stakeholder framings (Daniel,
                Jackie, Dave), monthly or quarterly cadence, gates pulled from active arcs, narrative
                fields editable. The Head of AIaaS pathway gets built one briefing at a time. Print
                view strips chrome for paste-into-email / paste-into-Slack.
              </p>
            </div>
            <div className="meta">
              <div>Recipient <strong>{stakeholder.name}</strong></div>
              <div style={{ marginTop: 4 }}>Period <strong>{periodLabel}</strong></div>
              <div style={{ marginTop: 4 }}>Gates met <strong>{metCount}/{totalGates}</strong></div>
              <div style={{ marginTop: 4 }}>YTD <strong>{ytdMet} gates</strong></div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="controls">
            <div className="control-block">
              <span className="control-label">Cadence</span>
              <div className="cadence-toggle">
                <button
                  className={`cadence-btn ${cadence === 'monthly' ? 'active' : ''}`}
                  onClick={() => setCadence('monthly')}
                >Monthly</button>
                <button
                  className={`cadence-btn ${cadence === 'quarterly' ? 'active' : ''}`}
                  onClick={() => setCadence('quarterly')}
                >Quarterly</button>
              </div>
            </div>
            <div className="control-block">
              <span className="control-label">Period</span>
              <div className="control-stepper">
                <button className="stepper-btn" onClick={() => setMonth(m => Math.max(1, m - 1))} disabled={month === 1}>
                  <ChevronLeft size={14} />
                </button>
                <span className="stepper-val">{periodLabel}</span>
                <button className="stepper-btn" onClick={() => setMonth(m => Math.min(12, m + 1))} disabled={month === 12}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div className="control-block">
              <span className="control-label">Recipient</span>
              <div className="stakeholder-pills">
                {STAKEHOLDERS.map(s => (
                  <button
                    key={s.id}
                    className={`stakeholder-pill ${stakeholderId === s.id ? 'active' : ''}`}
                    onClick={() => setStakeholderId(s.id)}
                  >{s.name}</button>
                ))}
              </div>
            </div>
            <div />
            <button
              className={`view-toggle ${printView ? 'active' : ''}`}
              onClick={() => setPrintView(!printView)}
            >
              {printView ? <Edit3 size={11} /> : <Printer size={11} />}
              {printView ? 'Edit mode' : 'Print view'}
            </button>
          </div>

          {/* LAYOUT */}
          <div className={`layout ${printView ? 'is-print' : ''}`}>

            {/* BRIEFING DOCUMENT */}
            <div className="brief">
              <div className="brief-head">
                <h2 className="brief-title">
                  {cadence === 'monthly' ? 'Monthly' : 'Quarterly'} briefing — <em>{periodLabel}</em>
                </h2>
                <div className="brief-stamps">
                  <div>To <strong>{stakeholder.name}</strong></div>
                  <div>From <strong>Kyle Rosebrook</strong></div>
                  <div>RE <strong>AI capability portfolio</strong></div>
                </div>
              </div>

              {/* 1. TL;DR */}
              <div className="brief-section">
                <div className="brief-section-label">
                  <span className="brief-section-num">01</span> TL;DR
                </div>
                <textarea
                  className="brief-textarea is-tldr"
                  value={getNarrative('tldr', stakeholder.tldr)}
                  onChange={e => setNarrative('tldr', e.target.value)}
                  placeholder="One-paragraph summary, tuned to recipient..."
                />
              </div>

              {/* 2. What shipped this period */}
              <div className="brief-section">
                <div className="brief-section-label">
                  <span className="brief-section-num">02</span> What shipped this {cadence === 'monthly' ? 'month' : 'quarter'}
                </div>
                {periodGates.length === 0 ? (
                  <div className="brief-gates-empty">
                    No active arcs in {periodLabel}. Toggle arcs in the sidebar to populate.
                  </div>
                ) : (
                  <ul className="brief-gates-list">
                    {periodGates.map(g => (
                      <li
                        key={g.key}
                        className="brief-gate-item"
                        style={{ ['--gate-color']: g.accent }}
                      >
                        <div
                          className={`brief-gate-checkbox ${g.met ? 'met' : ''}`}
                          onClick={() => toggleGate(g.key)}
                        />
                        <div className="brief-gate-text">
                          <strong>{g.arcEm}:</strong> {g.gate}
                        </div>
                        <div className="brief-gate-meta">
                          M{g.month} {g.met ? '· met' : '· pending'}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <textarea
                  className="brief-textarea"
                  style={{ marginTop: 12 }}
                  value={getNarrative('shipped_narrative', '')}
                  onChange={e => setNarrative('shipped_narrative', e.target.value)}
                  placeholder="Optional context paragraph beyond the gate list — what these mean together..."
                />
              </div>

              {/* 3. Capability shift */}
              <div className="brief-section">
                <div className="brief-section-label">
                  <span className="brief-section-num">03</span> Capability shift
                </div>
                <textarea
                  className="brief-textarea"
                  value={getNarrative('capability', `M${month} is where the ${cadence === 'monthly' ? 'monthly' : 'quarterly'} capability shift moves from "studying X" to "can use X in production for INT work." Worth naming what specifically changed in how I approach work this ${cadence === 'monthly' ? 'month' : 'quarter'}.`)}
                  onChange={e => setNarrative('capability', e.target.value)}
                  placeholder="What changed in your skill set this period — in plain language, no jargon..."
                />
              </div>

              {/* 4. Strategic implication for INT */}
              <div className="brief-section">
                <div className="brief-section-label">
                  <span className="brief-section-num">04</span> Strategic implication for {stakeholder.name === 'Dave' ? 'Intinc' : (stakeholder.name === 'Jackie' ? 'cross-team' : 'AIaaS pathway')}
                </div>
                <textarea
                  className="brief-textarea"
                  value={getNarrative('implication', stakeholder.implication)}
                  onChange={e => setNarrative('implication', e.target.value)}
                  placeholder="Why this matters for INT — connecting capability to business outcome..."
                />
              </div>

              {/* 5. Asks */}
              <div className="brief-section">
                <div className="brief-section-label">
                  <span className="brief-section-num">05</span> Asks / decisions needed
                </div>
                <textarea
                  className="brief-textarea is-asks"
                  value={getNarrative('asks', stakeholder.asks)}
                  onChange={e => setNarrative('asks', e.target.value)}
                  placeholder="What specific decision, signal, or input do you need from this recipient..."
                />
              </div>

              {/* 6. Next period focus */}
              <div className="brief-section">
                <div className="brief-section-label">
                  <span className="brief-section-num">06</span> Next {cadence === 'monthly' ? 'month' : 'quarter'} focus
                </div>
                {nextPeriodGates.length === 0 ? (
                  <div className="brief-gates-empty">
                    {month === 12
                      ? 'Year-end. Next period is Y2 planning — separate conversation warranted.'
                      : 'No upcoming gates configured for next period.'}
                  </div>
                ) : (
                  <ul className="brief-gates-list">
                    {nextPeriodGates.map((g, i) => (
                      <li
                        key={i}
                        className="brief-gate-item"
                        style={{ ['--gate-color']: g.accent }}
                      >
                        <div className="brief-gate-checkbox" style={{ borderStyle: 'dashed' }} />
                        <div className="brief-gate-text">
                          <strong>{g.arcEm}:</strong> {g.gate}
                        </div>
                        <div className="brief-gate-meta">M{g.month}</div>
                      </li>
                    ))}
                  </ul>
                )}
                <textarea
                  className="brief-textarea"
                  style={{ marginTop: 12 }}
                  value={getNarrative('next_narrative', '')}
                  onChange={e => setNarrative('next_narrative', e.target.value)}
                  placeholder="Optional context on what's coming — sequencing rationale, dependencies, capacity notes..."
                />
              </div>

              <div className="brief-foot">
                <div>
                  <strong>{cadence === 'monthly' ? 'Monthly' : 'Quarterly'}</strong> cadence ·
                  Next briefing <strong>{cadence === 'monthly' ? `M${Math.min(12, month + 1)}` : `Q${Math.min(4, Math.floor((month-1)/3) + 2)}`}</strong>
                </div>
                <div className="brief-foot-sig">— Kyle</div>
              </div>
            </div>

            {/* SIDEBAR */}
            {!printView && (
              <div className="sidebar">

                {/* Framing card */}
                <div className="framing-card">
                  <div className="stat-label">
                    <Briefcase size={9} /> Stakeholder framing
                  </div>
                  <div className="framing-name">{stakeholder.name}.</div>
                  <div className="framing-role">{stakeholder.role}</div>
                  <div className="framing-emphasis">
                    Default emphasis: <strong>{stakeholder.framing}</strong>
                  </div>
                </div>

                {/* Period stats */}
                <div className="stat-card">
                  <div className="stat-label">
                    <Target size={9} /> {periodLabel} gate progress
                  </div>
                  <div className="stat-value">
                    {metCount}<span className="stat-unit">/ {totalGates}</span>
                  </div>
                  <div className="stat-meta">
                    {totalGates === 0
                      ? 'No active arcs in period — toggle arcs below.'
                      : metCount === totalGates
                        ? `Full ${periodLabel} clear. Strong briefing material.`
                        : `${totalGates - metCount} gate${totalGates - metCount === 1 ? '' : 's'} pending — name explicitly in the briefing rather than soft-pedaling.`}
                  </div>
                </div>

                {/* YTD */}
                <div className="stat-card">
                  <div className="stat-label">
                    <Layers size={9} /> Year-to-date
                  </div>
                  <div className="stat-value">
                    {ytdMet}<span className="stat-unit">gates met</span>
                  </div>
                  <div className="stat-meta">
                    Across {activeArcs.size} active arc{activeArcs.size === 1 ? '' : 's'}. Each met gate is a brick in the longitudinal pitch — the Y2 conversation rests on this cumulative count, not single-month performance.
                  </div>
                </div>

                {/* Arc toggles */}
                <div className="arc-toggles-side">
                  <div className="stat-label">
                    <Compass size={9} /> Active arcs in briefing
                  </div>
                  {ARCS.map(arc => {
                    const isActive = activeArcs.has(arc.id);
                    const arcMet = Array.from(metGates).filter(k => k.startsWith(`${arc.id}-`)).length;
                    return (
                      <div
                        key={arc.id}
                        className={`arc-toggle-row ${isActive ? '' : 'inactive'}`}
                        style={{ ['--at-accent']: arc.accent }}
                        onClick={() => toggleArc(arc.id)}
                      >
                        <div className="arc-toggle-dot" />
                        <div className="arc-toggle-name">
                          The <em>{arc.em}</em> Arc.
                        </div>
                        <div className="arc-toggle-met">{arcMet}/12</div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}
          </div>

          {!printView && (
            <div className="claims">
              <h4><Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />How the briefing template fits the system</h4>
              <ul>
                <li>
                  <strong>This is the fourth layer of the system.</strong> Arc artifacts (planning) → Master Selector (portfolio decision) → Execution Dashboard (operational) → Briefing Template (upward communication). Each layer reads from the same underlying arc data and surfaces a different cut. Gates marked met here can in principle sync with the Execution Dashboard's gate state — that integration is v2.
                </li>
                <li>
                  <strong>Three stakeholder framings reflect three different jobs.</strong> Daniel framing prioritizes capability growth and Head-of-AIaaS readiness signals — the longitudinal pitch he's part of. Jackie framing prioritizes shipped outputs and cross-team reusability — operational handoff value. Dave framing prioritizes strategic positioning and the AIaaS service-line case — executive-level decision context. Same gates, different angle of incidence.
                </li>
                <li>
                  <strong>Editable narrative defaults are starting points, not finished copy.</strong> The defaults intentionally sound a touch generic so they don't get sent as-is. The friction of having to rewrite them is the feature — it forces specificity about what actually shipped this period. A briefing sent with the default capability narrative is a briefing that wasn't written.
                </li>
                <li>
                  <strong>Monthly vs Quarterly cadence is a deliberate choice per stakeholder.</strong> Daniel/direct cadence: monthly. Cross-functional like Jackie: monthly or quarterly depending on what's shipping. Executive/strategic like Dave: quarterly is more credible — monthly executive briefings on a learning portfolio is over-communication and dilutes the signal.
                </li>
                <li>
                  <strong>"Asks / decisions needed" is the section most people skip.</strong> A briefing without a clear ask is a status report. Status reports get read; briefings with asks get acted on. The Head of AIaaS pathway needs the latter — every briefing should leave the recipient with one decision to make or one signal to send.
                </li>
                <li>
                  <strong>What this template still doesn't do:</strong> persist briefings between sessions (state is in-memory only), generate PDFs natively (use browser print), pull live gate state from the Execution Dashboard, support multi-recipient briefings (one stakeholder at a time). For now: clean structured composition with stakeholder-specific defaults. Persistence and integration are v2.
                </li>
              </ul>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
