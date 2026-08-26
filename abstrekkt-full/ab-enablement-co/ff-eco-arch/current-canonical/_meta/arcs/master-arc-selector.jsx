import React, { useState, useMemo } from 'react';
import { Compass, AlertTriangle, CheckCircle2, Circle, Calendar, Zap, Link2, Layers } from 'lucide-react';

// ---------------------------------------------------------------------------
// ARC DATA — all 20 arcs with the metadata the selector needs
// ---------------------------------------------------------------------------

const ARCS = [
  // SERIES 1 — Platform arcs (5)
  { id: 'mastery',    title: 'Mastery Arc',         em: 'Mastery',       lane: 'Gemini · Prompt eng',            series: 1, kind: 'platform',  accent: '#c6f432', loadHrs: 7, exam: 'Google ML Engineer (M11)',  feedsInto: ['gcp'],  fedBy: ['gcp'],   capstone: 'M10 multi-provider build' },
  { id: 'claude',     title: 'Claude Arc',          em: 'Claude',        lane: 'Anthropic deepening',            series: 1, kind: 'platform',  accent: '#e07856', loadHrs: 6, exam: 'Architect Foundations (M1)', feedsInto: ['mcp'],  fedBy: [],        capstone: 'M5 MCP authorship' },
  { id: 'copilot',    title: 'Copilot Arc',         em: 'Copilot',       lane: 'Microsoft · Intinc paycheck',    series: 1, kind: 'platform',  accent: '#6ba8e8', loadHrs: 6, exam: 'AI-102 or MB-820 (M11)',    feedsInto: ['azure'],fedBy: ['azure'], capstone: 'M12 AIaaS service pitch' },
  { id: 'openai',     title: 'OpenAI Arc',          em: 'OpenAI',        lane: 'Portfolio rounding',             series: 1, kind: 'platform',  accent: '#5ee0c0', loadHrs: 5, exam: 'No cert',                    feedsInto: ['voice'],fedBy: [],        capstone: 'M10 multi-provider build' },
  { id: 'practitioner', title: 'Practitioner Arc',  em: 'Practitioner',  lane: 'All 5 platforms · combo',        series: 1, kind: 'platform',  accent: '#d4a843', loadHrs: 12, exam: 'M1 Arch + M8 MS AI + M11 GCP', feedsInto: [],   fedBy: [],        capstone: 'M5+M10 PEAK weeks · 3 certs' },

  // SERIES 1 — Thematic arcs (8)
  { id: 'aiaas',      title: 'AIaaS Arc',           em: 'AIaaS',         lane: 'FlashFusion + Intinc dept',      series: 1, kind: 'business',  accent: '#e8962a', loadHrs: 5, exam: 'Business artifact',          feedsInto: ['strategy'],fedBy: ['strategy','eval'], capstone: 'M11 dept decision' },
  { id: 'mcp',        title: 'MCP Builder Arc',     em: 'MCP',           lane: 'Developer ecosystem',            series: 1, kind: 'thematic',  accent: '#8b5cf6', loadHrs: 5, exam: 'Published servers',          feedsInto: ['cloudflare'],fedBy: ['claude'], capstone: 'M10 flagship + M11 contrib' },
  { id: 'security',   title: 'Security Arc',        em: 'Security',      lane: 'AppSec · OWASP · CAISP',         series: 1, kind: 'thematic',  accent: '#e05252', loadHrs: 7, exam: 'SecAI+ (M5) · CAISP (M11)',  feedsInto: ['teaching','fullstack'], fedBy: [], capstone: 'M7 multi-tenant isolation' },
  { id: 'rag',        title: 'RAG & Data Arc',      em: 'RAG',           lane: 'Knowledge layer',                series: 1, kind: 'thematic',  accent: '#14b8a6', loadHrs: 5, exam: 'Published ADR + playbook',   feedsInto: ['azure','cloudflare'], fedBy: ['gcp'], capstone: 'M10 KB upgrade + M11 vector DB compare' },
  { id: 'n8n',        title: 'n8n Automation Arc',  em: 'n8n',           lane: 'Workflow orchestration',         series: 1, kind: 'thematic',  accent: '#f97316', loadHrs: 4, exam: 'n8n Certified (M11)',        feedsInto: [],       fedBy: ['eval'],  capstone: 'M6 3-platform decision framework' },
  { id: 'brand',      title: 'Brand Arc',           em: 'Brand',         lane: 'LinkedIn · Prompt · CLC · Amb',  series: 1, kind: 'thematic',  accent: '#38bdf8', loadHrs: 4, exam: '1,000 followers · 200+ subs', feedsInto: [],      fedBy: ['eval','gcp','fullstack','strategy'], capstone: 'M7 flagship long-form + M12 retro' },
  { id: 'teaching',   title: 'Teaching Arc',        em: 'Teaching',      lane: '3-tier curriculum · CLC',        series: 1, kind: 'thematic',  accent: '#4ade80', loadHrs: 4, exam: 'CLC formal path + 6+ deliveries', feedsInto: [],   fedBy: ['security'], capstone: 'M10 all 3 tiers in sequence' },

  // SERIES 2 — Leverage arcs (7)
  { id: 'gcp',        title: 'GCP / Vertex Arc',    em: 'GCP',           lane: 'Cloud · ML Engineer cert',       series: 2, kind: 'platform',  accent: '#4285f4', loadHrs: 9, exam: 'Google Pro ML Engineer (M11)', feedsInto: ['mastery','rag','brand'], fedBy: ['mastery'], capstone: 'M12 multi-cloud comparison' },
  { id: 'fullstack',  title: 'Full-Stack App Arc',  em: 'App',           lane: 'Next.js · FastAPI · Vercel',     series: 2, kind: 'thematic',  accent: '#e879f9', loadHrs: 10, exam: 'Portfolio · 3 apps shipped',  feedsInto: ['voice','brand'], fedBy: ['security'], capstone: 'M12 flagship · paying users' },
  { id: 'azure',      title: 'Azure Foundry Arc',   em: 'Foundry',       lane: 'Azure OpenAI · Prompt Flow',     series: 2, kind: 'platform',  accent: '#6366f1', loadHrs: 6, exam: 'AI-102 deepening (M11)',     feedsInto: ['copilot'], fedBy: ['copilot','rag'], capstone: 'M11 Copilot vs Foundry guide' },
  { id: 'eval',       title: 'Eval Arc',            em: 'Eval',          lane: 'LangSmith · Braintrust · CI/CD', series: 2, kind: 'thematic',  accent: '#eab308', loadHrs: 5, exam: 'Published playbook + service line', feedsInto: ['aiaas','brand','n8n'], fedBy: [], capstone: 'M11 published playbook' },
  { id: 'voice',      title: 'Voice & Realtime Arc', em: 'Voice',        lane: 'OpenAI Realtime · sub-700ms',    series: 2, kind: 'thematic',  accent: '#a855f7', loadHrs: 6, exam: 'Shipped flagship · service line', feedsInto: [],   fedBy: ['fullstack','openai'], capstone: 'M12 flagship voice product' },
  { id: 'strategy',   title: 'AI Product Strategy', em: 'Strategy',      lane: 'PRDs · roadmap · advisory',      series: 2, kind: 'thematic',  accent: '#f43f5e', loadHrs: 4, exam: 'Published framework + service line', feedsInto: ['aiaas','brand'], fedBy: ['aiaas'], capstone: 'M12 framework + Head of AIaaS conv' },
  { id: 'cloudflare', title: 'Cloudflare Edge AI',  em: 'Edge',          lane: 'Workers AI · Vectorize · D1',    series: 2, kind: 'thematic',  accent: '#ea580c', loadHrs: 3, exam: '5 deployments + guide',      feedsInto: [],       fedBy: ['mcp','rag'], capstone: 'M12 AI at the Edge guide' },
];

// ---------------------------------------------------------------------------
// PRESET CONFIGURATIONS
// ---------------------------------------------------------------------------

const PRESETS = [
  {
    id: 'sustainable',
    title: 'Sustainable',
    desc: 'One platform deepening + one thematic + one low-load practice. ~15 hrs/week.',
    arcs: ['claude', 'security', 'brand'],
  },
  {
    id: 'aiaas_path',
    title: 'AIaaS Pathway',
    desc: 'The Head of AIaaS sequence — business arc + strategy + the engineering depth to back it.',
    arcs: ['aiaas', 'strategy', 'azure', 'eval'],
  },
  {
    id: 'engineering',
    title: 'Engineering Heavy',
    desc: 'The HIGH-load engineering portfolio. Plan exam collisions carefully.',
    arcs: ['fullstack', 'gcp', 'security', 'eval'],
  },
  {
    id: 'brand_capital',
    title: 'Brand Capital',
    desc: 'Build the public-facing portfolio — brand work + flagship-producing arcs that feed it.',
    arcs: ['brand', 'fullstack', 'voice', 'teaching'],
  },
  {
    id: 'practitioner',
    title: 'Practitioner Combo',
    desc: 'The one-arc combo path. Replaces the 5 platform arcs with a single coordinated sprint.',
    arcs: ['practitioner', 'brand'],
  },
];

// ---------------------------------------------------------------------------
// CAPACITY GUIDANCE
// ---------------------------------------------------------------------------

const CAPACITY_BANDS = [
  { max: 10, label: 'Light',       color: '#4ade80', note: 'Sustainable alongside a demanding role. Likely under-committing if you have weekends free.' },
  { max: 18, label: 'Balanced',    color: '#fcd34d', note: 'The realistic sustained load for someone with a full-time role and personal time intact.' },
  { max: 28, label: 'Aggressive',  color: '#fb923c', note: 'Sustainable for 6-9 months. Past that, something gives — usually the brand or teaching work first.' },
  { max: 40, label: 'Unsustainable', color: '#f43f5e', note: 'Not workable for 12 months. The portfolio collapses by month 4-6. Drop arcs or cut scope.' },
  { max: 999,label: 'Implausible', color: '#ef4444', note: 'This is not a 12-month plan, this is a 24-month plan compressed into 12. Re-scope.' },
];

// ---------------------------------------------------------------------------
// STYLES — neutral graphite, per-arc accent in row badges only
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg:           #0c0d10;
  --bg-2:         #14161b;
  --fg:           #e8e9ed;
  --fg-dim:       #8a8f9a;
  --fg-mute:      #555a65;
  --accent:       #cbd5e1;
  --card:         #14161b;
  --border:       #1f2229;
  --border-bright:#2c303a;
}

body, .root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(203,213,225,0.04), transparent 60%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1200px; margin: 0 auto; }

/* HEADER */
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
.title-sub { font-size: 13px; color: var(--fg-dim); margin: 16px 0 0; max-width: 62ch; line-height: 1.6; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--fg); font-weight: 500; }

/* LAYOUT */
.layout { display: grid; grid-template-columns: 1fr 320px; gap: 32px; align-items: start; }

/* PRESETS */
.presets {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;
  margin-bottom: 28px;
}
.preset {
  background: var(--bg-2); border: 1px solid var(--border);
  padding: 12px 14px; cursor: pointer; text-align: left;
  font-family: 'JetBrains Mono', monospace; color: var(--fg);
  transition: border-color 0.15s;
}
.preset:hover { border-color: var(--border-bright); }
.preset-label { font-size: 9px; letter-spacing: 0.2em; color: var(--fg-dim); text-transform: uppercase; margin-bottom: 4px; }
.preset-title {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 17px; line-height: 1.15; color: var(--fg); margin-bottom: 4px;
}
.preset-desc { font-size: 10.5px; color: var(--fg-dim); line-height: 1.4; }

/* ARC TABLE */
.arc-section {
  border: 1px solid var(--border); background: var(--bg-2);
  margin-bottom: 16px;
}
.arc-section-head {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center;
}
.arc-section-title {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 18px; color: var(--fg); font-weight: 400;
}
.arc-section-count {
  font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--fg-dim);
}

.arc-row {
  display: grid; grid-template-columns: 32px 4px 1fr 60px 32px;
  gap: 12px; align-items: center;
  padding: 11px 16px;
  border-top: 1px solid var(--border);
  cursor: pointer; transition: background 0.12s;
}
.arc-row:hover { background: rgba(255,255,255,0.015); }
.arc-row.selected { background: rgba(255,255,255,0.025); }
.arc-row:first-of-type { border-top: none; }

.arc-check {
  width: 20px; height: 20px; border: 1.5px solid var(--fg-mute);
  display: flex; align-items: center; justify-content: center;
  transition: border-color 0.15s, background 0.15s;
}
.arc-row.selected .arc-check {
  border-color: var(--row-accent);
  background: var(--row-accent);
}
.arc-row.selected .arc-check svg { color: var(--bg); }

.arc-bar {
  width: 4px; height: 32px; background: var(--row-accent); opacity: 0.4;
  transition: opacity 0.15s;
}
.arc-row.selected .arc-bar { opacity: 1; }

.arc-info { min-width: 0; }
.arc-name {
  font-size: 13.5px; color: var(--fg); font-weight: 500;
  margin-bottom: 2px; letter-spacing: -0.005em;
}
.arc-name em { color: var(--row-accent); font-style: normal; font-weight: 700; }
.arc-lane {
  font-size: 10.5px; color: var(--fg-dim);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.arc-hrs {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 16px; color: var(--row-accent); text-align: right;
}
.arc-hrs-unit { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--fg-dim); font-style: normal; }

.arc-kind {
  font-size: 8.5px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--fg-mute); text-align: center;
}

/* SIDEBAR */
.sidebar { position: sticky; top: 24px; }

.stat-card {
  border: 1px solid var(--border); background: var(--bg-2);
  padding: 16px; margin-bottom: 12px;
}
.stat-label {
  font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--fg-dim); margin-bottom: 8px;
}
.stat-value {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 36px; line-height: 1; color: var(--fg); font-weight: 400;
}
.stat-unit {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--fg-dim); font-style: normal; margin-left: 4px;
}
.stat-band {
  margin-top: 10px; padding: 8px 10px;
  border-left: 2px solid var(--band-color);
  background: var(--band-bg);
  font-size: 11px; color: var(--fg); line-height: 1.5;
}
.stat-band-label {
  font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--band-color); font-weight: 500; margin-bottom: 4px;
}

.collisions {
  border: 1px solid var(--border); background: var(--bg-2);
  padding: 16px; margin-bottom: 12px;
}
.collision-row {
  padding: 8px 10px; margin-bottom: 6px;
  background: rgba(244,63,94,0.06); border-left: 2px solid #f43f5e;
  font-size: 11px; color: var(--fg); line-height: 1.5;
}
.collision-row:last-child { margin-bottom: 0; }
.collision-empty {
  font-size: 11px; color: var(--fg-dim); font-style: italic; padding: 4px 0;
}

.cross-feeds {
  border: 1px solid var(--border); background: var(--bg-2);
  padding: 16px;
}
.feed-row {
  padding: 8px 10px; margin-bottom: 6px;
  background: rgba(74,222,128,0.05); border-left: 2px solid #4ade80;
  font-size: 11px; color: var(--fg); line-height: 1.5;
}
.feed-row:last-child { margin-bottom: 0; }
.feed-empty {
  font-size: 11px; color: var(--fg-dim); font-style: italic; padding: 4px 0;
}
.feed-arrow { color: var(--fg-dim); margin: 0 4px; }

/* CLAIMS */
.claims {
  margin-top: 40px; padding: 24px; border: 1px solid var(--border);
  background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7;
}
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }
.claims strong { color: var(--fg); font-weight: 500; }

@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.stagger > * { opacity: 0; animation: rise 0.45s ease forwards; }
.stagger > *:nth-child(1) { animation-delay: 0.04s; }
.stagger > *:nth-child(2) { animation-delay: 0.08s; }
.stagger > *:nth-child(3) { animation-delay: 0.12s; }

@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { position: static; }
  .presets { grid-template-columns: 1fr 1fr; }
  .header-grid { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .arc-row { grid-template-columns: 28px 3px 1fr 50px; }
  .arc-kind { display: none; }
}
`;

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
export default function MasterArcSelector() {
  const [selected, setSelected] = useState(new Set(['claude', 'security', 'brand']));

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const applyPreset = (preset) => {
    setSelected(new Set(preset.arcs));
  };

  // -------------------------------------------------------------------------
  // CALCULATIONS
  // -------------------------------------------------------------------------
  const stats = useMemo(() => {
    const selectedArcs = ARCS.filter(a => selected.has(a.id));
    const totalHrs = selectedArcs.reduce((sum, a) => sum + a.loadHrs, 0);
    const band = CAPACITY_BANDS.find(b => totalHrs <= b.max);

    // Exam collisions — arcs with M11 exam windows clashing
    const examsByMonth = {};
    selectedArcs.forEach(arc => {
      const monthMatches = arc.exam.match(/M(\d+)/g) || [];
      monthMatches.forEach(m => {
        const month = parseInt(m.slice(1));
        if (!examsByMonth[month]) examsByMonth[month] = [];
        examsByMonth[month].push(arc);
      });
    });

    const collisions = [];
    Object.keys(examsByMonth).forEach(month => {
      if (examsByMonth[month].length > 1) {
        collisions.push({
          month: parseInt(month),
          arcs: examsByMonth[month],
        });
      }
    });

    // HIGH-load collisions — more than one HIGH arc (loadHrs >= 8) selected
    const highArcs = selectedArcs.filter(a => a.loadHrs >= 8);
    if (highArcs.length >= 2) {
      collisions.push({
        type: 'high-load',
        arcs: highArcs,
      });
    }

    // Cross-feeds — arcs that feed each other when both selected
    const feeds = [];
    selectedArcs.forEach(arc => {
      arc.feedsInto.forEach(targetId => {
        if (selected.has(targetId)) {
          const target = ARCS.find(a => a.id === targetId);
          feeds.push({
            from: arc,
            to: target,
          });
        }
      });
    });

    return { selectedArcs, totalHrs, band, collisions, feeds };
  }, [selected]);

  const series1 = ARCS.filter(a => a.series === 1);
  const series2 = ARCS.filter(a => a.series === 2);

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Compass size={12} /> Learning Ops // Portfolio Selector</p>
              <h1 className="title-serif">The <em>Selector</em>.</h1>
              <p className="title-sub">
                Twenty arcs exist. You cannot run all twenty in one year. This is the tool
                that turns "what arcs am I theoretically excited about" into "what arcs am I
                actually committing to this year, with what combined load, and what collisions
                am I planning around?" Toggle arcs, watch the math.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Series <strong>01 (13) + 02 (7) = 20</strong></div>
              <div style={{ marginTop: 4 }}>Horizon <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Currently selected: <strong>{selected.size}</strong></div>
            </div>
          </div>

          {/* PRESETS */}
          <div className="presets">
            {PRESETS.map(p => (
              <button key={p.id} className="preset" onClick={() => applyPreset(p)}>
                <div className="preset-label">Preset</div>
                <div className="preset-title">{p.title}</div>
                <div className="preset-desc">{p.desc}</div>
              </button>
            ))}
          </div>

          {/* LAYOUT */}
          <div className="layout">

            {/* ARC TABLE */}
            <div>
              <div className="arc-section">
                <div className="arc-section-head">
                  <div className="arc-section-title">Series One — foundational thirteen</div>
                  <div className="arc-section-count">{series1.filter(a => selected.has(a.id)).length} / {series1.length} selected</div>
                </div>
                {series1.map(arc => {
                  const isSelected = selected.has(arc.id);
                  return (
                    <div
                      key={arc.id}
                      className={`arc-row ${isSelected ? 'selected' : ''}`}
                      style={{ ['--row-accent']: arc.accent }}
                      onClick={() => toggle(arc.id)}
                    >
                      <div className="arc-check">
                        {isSelected && <CheckCircle2 size={14} strokeWidth={3} />}
                      </div>
                      <div className="arc-bar" />
                      <div className="arc-info">
                        <div className="arc-name">{arc.title.replace(arc.em, '')}<em>{arc.em}</em></div>
                        <div className="arc-lane">{arc.lane}</div>
                      </div>
                      <div className="arc-hrs">{arc.loadHrs}<span className="arc-hrs-unit">/wk</span></div>
                      <div className="arc-kind">{arc.kind.slice(0, 4)}</div>
                    </div>
                  );
                })}
              </div>

              <div className="arc-section">
                <div className="arc-section-head">
                  <div className="arc-section-title">Series Two — leverage layer</div>
                  <div className="arc-section-count">{series2.filter(a => selected.has(a.id)).length} / {series2.length} selected</div>
                </div>
                {series2.map(arc => {
                  const isSelected = selected.has(arc.id);
                  return (
                    <div
                      key={arc.id}
                      className={`arc-row ${isSelected ? 'selected' : ''}`}
                      style={{ ['--row-accent']: arc.accent }}
                      onClick={() => toggle(arc.id)}
                    >
                      <div className="arc-check">
                        {isSelected && <CheckCircle2 size={14} strokeWidth={3} />}
                      </div>
                      <div className="arc-bar" />
                      <div className="arc-info">
                        <div className="arc-name">{arc.title.replace(arc.em, '')}<em>{arc.em}</em></div>
                        <div className="arc-lane">{arc.lane}</div>
                      </div>
                      <div className="arc-hrs">{arc.loadHrs}<span className="arc-hrs-unit">/wk</span></div>
                      <div className="arc-kind">{arc.kind.slice(0, 4)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="sidebar">

              {/* COMBINED LOAD */}
              <div className="stat-card">
                <div className="stat-label"><Zap size={9} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />Combined load</div>
                <div className="stat-value">
                  {stats.totalHrs}<span className="stat-unit">hrs/wk</span>
                </div>
                <div
                  className="stat-band"
                  style={{
                    ['--band-color']: stats.band.color,
                    ['--band-bg']: `${stats.band.color}10`,
                  }}
                >
                  <div className="stat-band-label">{stats.band.label}</div>
                  {stats.band.note}
                </div>
              </div>

              {/* COLLISIONS */}
              <div className="collisions">
                <div className="stat-label" style={{ marginBottom: 10 }}>
                  <AlertTriangle size={9} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  Collisions ({stats.collisions.length})
                </div>
                {stats.collisions.length === 0 && (
                  <div className="collision-empty">No exam-month or HIGH-load collisions in this selection.</div>
                )}
                {stats.collisions.map((c, i) => (
                  <div key={i} className="collision-row">
                    {c.type === 'high-load' ? (
                      <>
                        <strong>Multiple HIGH-load arcs:</strong>
                        {' '}{c.arcs.map(a => a.em).join(' + ')}. Pre-Q1 sequencing review required.
                      </>
                    ) : (
                      <>
                        <strong>Month {c.month} collision:</strong>
                        {' '}{c.arcs.map(a => a.em).join(' + ')}. Sit exams in different weeks of M{c.month}.
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* CROSS-FEEDS */}
              <div className="cross-feeds">
                <div className="stat-label" style={{ marginBottom: 10 }}>
                  <Link2 size={9} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  Cross-arc feeds ({stats.feeds.length})
                </div>
                {stats.feeds.length === 0 && (
                  <div className="feed-empty">No cross-arc capstone feeds in this selection. Consider adding feeder arcs.</div>
                )}
                {stats.feeds.slice(0, 6).map((f, i) => (
                  <div key={i} className="feed-row">
                    <strong>{f.from.em}</strong><span className="feed-arrow">→</span><strong>{f.to.em}</strong>
                    <div style={{ marginTop: 2, fontSize: 10, color: 'var(--fg-dim)' }}>{f.from.capstone}</div>
                  </div>
                ))}
                {stats.feeds.length > 6 && (
                  <div className="feed-empty" style={{ marginTop: 6 }}>
                    + {stats.feeds.length - 6} more feeds — selected arcs are highly compounding.
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* CLAIMS */}
          <div className="claims">
            <h4>
              <Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              How this tool computes
            </h4>
            <ul>
              <li>
                <strong>Combined load</strong> sums the documented weekly hours from each arc's tradeoff section.
                These are average steady-state weeks. Exam-prep months (typically M10 of cert arcs) spike 1.5-2x.
                Q1 ramps on unfamiliar arcs also spike before settling. The number is the floor, not the ceiling.
              </li>
              <li>
                <strong>Collisions</strong> flag two patterns: shared exam months across selected arcs, and
                multiple HIGH-load arcs (8+ hrs/week each) running simultaneously. The first is solvable by
                scheduling exams in different weeks of the shared month. The second requires either dropping
                an arc or sequencing them across years.
              </li>
              <li>
                <strong>Cross-feeds</strong> show when a capstone or mid-arc artifact from one selected arc
                directly accelerates another selected arc. More feeds means the portfolio is compounding — the
                same hours produce more leverage. Zero feeds means the selection is a collection of independent
                tracks, which is valid but does not compound across arcs.
              </li>
              <li>
                <strong>Capacity bands</strong> are calibrated for someone with a full-time role: under 10 hrs is
                light, 10-18 is balanced, 18-28 is aggressive for 6-9 months, 28-40 collapses by month 4-6,
                and 40+ is implausible. Your historical pace is the truer signal — adjust for what you have
                actually sustained, not what you have planned.
              </li>
              <li>
                <strong>What the tool does not model:</strong> energy variation across months, life events that
                compress available time, the cost of context-switching between arcs, the higher load in Q1
                onboarding months, the compressed exam-prep windows. Treat the number as the optimistic case
                in a stable life — multiply by 1.2-1.3x for a realistic plan.
              </li>
              <li>
                <strong>Use the presets as starting points, not endpoints.</strong> The Sustainable preset is
                where most people should start. The AIaaS Pathway is the explicit Head-of-AIaaS sequence.
                Engineering Heavy is for someone with a 9-month sabbatical or significantly reduced role demands.
                Brand Capital is for someone optimizing for public-facing portfolio over depth. Practitioner
                Combo is the only way to do all five platforms without burning out — the combo arc is
                deliberately sequenced to make peak weeks survivable.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
