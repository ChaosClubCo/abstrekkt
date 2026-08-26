import React, { useState, useMemo } from 'react';
import { Compass, AlertTriangle, CheckCircle2, Calendar, Zap, Link2, Layers, Lock } from 'lucide-react';

// ---------------------------------------------------------------------------
// ARC DATA — all 27 arcs with metadata the selector needs
// ---------------------------------------------------------------------------

const ARCS = [
  // SERIES 1 — Platform arcs (5)
  { id: 'mastery',    series: 1, lane: null, title: 'Mastery Arc',         em: 'Mastery',       sub: 'Gemini · Prompt eng',            kind: 'platform',  accent: '#c6f432', loadHrs: 7,  exam: 'Google ML Engineer (M11)',  feedsInto: ['gcp'],  fedBy: ['gcp'],   capstone: 'M10 multi-provider build' },
  { id: 'claude',     series: 1, lane: null, title: 'Claude Arc',          em: 'Claude',        sub: 'Anthropic deepening',            kind: 'platform',  accent: '#e07856', loadHrs: 6,  exam: 'Architect Foundations (M1)', feedsInto: ['mcp'],  fedBy: [],        capstone: 'M5 MCP authorship' },
  { id: 'copilot',    series: 1, lane: null, title: 'Copilot Arc',         em: 'Copilot',       sub: 'Microsoft · Intinc paycheck',    kind: 'platform',  accent: '#6ba8e8', loadHrs: 6,  exam: 'AI-102 or MB-820 (M11)',    feedsInto: ['azure'],fedBy: ['azure'], capstone: 'M12 AIaaS service pitch' },
  { id: 'openai',     series: 1, lane: null, title: 'OpenAI Arc',          em: 'OpenAI',        sub: 'Portfolio rounding',             kind: 'platform',  accent: '#5ee0c0', loadHrs: 5,  exam: 'No cert',                    feedsInto: ['voice'],fedBy: [],        capstone: 'M10 multi-provider build' },
  { id: 'practitioner', series: 1, lane: null, title: 'Practitioner Arc',  em: 'Practitioner',  sub: 'All 5 platforms · combo',        kind: 'platform',  accent: '#d4a843', loadHrs: 12, exam: 'M1 Arch + M8 MS AI + M11 GCP', feedsInto: [],   fedBy: [],        capstone: 'M5+M10 PEAK weeks · 3 certs' },

  // SERIES 1 — Thematic arcs (8)
  { id: 'aiaas',      series: 1, lane: null, title: 'AIaaS Arc',           em: 'AIaaS',         sub: 'FlashFusion + Intinc dept',      kind: 'business',  accent: '#e8962a', loadHrs: 5,  exam: 'Business artifact',          feedsInto: ['strategy'], fedBy: ['strategy','eval'], capstone: 'M11 dept decision' },
  { id: 'mcp',        series: 1, lane: null, title: 'MCP Builder Arc',     em: 'MCP',           sub: 'Developer ecosystem',            kind: 'thematic',  accent: '#8b5cf6', loadHrs: 5,  exam: 'Published servers',          feedsInto: ['cloudflare'],fedBy: ['claude'], capstone: 'M10 flagship + M11 contrib' },
  { id: 'security',   series: 1, lane: null, title: 'Security Arc',        em: 'Security',      sub: 'AppSec · OWASP · CAISP',         kind: 'thematic',  accent: '#e05252', loadHrs: 7,  exam: 'SecAI+ (M5) · CAISP (M11)',  feedsInto: ['teaching','fullstack','regulated'], fedBy: [], capstone: 'M7 multi-tenant isolation' },
  { id: 'rag',        series: 1, lane: null, title: 'RAG & Data Arc',      em: 'RAG',           sub: 'Knowledge layer',                kind: 'thematic',  accent: '#14b8a6', loadHrs: 5,  exam: 'Published ADR + playbook',   feedsInto: ['azure','cloudflare'], fedBy: ['gcp'], capstone: 'M10 KB upgrade + M11 vector DB compare' },
  { id: 'n8n',        series: 1, lane: null, title: 'n8n Automation Arc',  em: 'n8n',           sub: 'Workflow orchestration',         kind: 'thematic',  accent: '#f97316', loadHrs: 4,  exam: 'n8n Certified (M11)',        feedsInto: [],       fedBy: ['eval'],  capstone: 'M6 3-platform decision framework' },
  { id: 'brand',      series: 1, lane: null, title: 'Brand Arc',           em: 'Brand',         sub: 'LinkedIn · Prompt · CLC · Amb',  kind: 'thematic',  accent: '#38bdf8', loadHrs: 4,  exam: '1,000 followers · 200+ subs', feedsInto: [],     fedBy: ['eval','gcp','fullstack','strategy','book','partner'], capstone: 'M7 flagship long-form + M12 retro' },
  { id: 'teaching',   series: 1, lane: null, title: 'Teaching Arc',        em: 'Teaching',      sub: '3-tier curriculum · CLC',        kind: 'thematic',  accent: '#4ade80', loadHrs: 4,  exam: 'CLC formal path + 6+ deliveries', feedsInto: ['course'], fedBy: ['security'], capstone: 'M10 all 3 tiers in sequence' },

  // SERIES 2 — Leverage arcs (7)
  { id: 'gcp',        series: 2, lane: null, title: 'GCP / Vertex Arc',    em: 'GCP',           sub: 'Cloud · ML Engineer cert',       kind: 'platform',  accent: '#4285f4', loadHrs: 9,  exam: 'Google Pro ML Engineer (M11)', feedsInto: ['mastery','rag','brand','enterprise'], fedBy: ['mastery'], capstone: 'M12 multi-cloud comparison' },
  { id: 'fullstack',  series: 2, lane: null, title: 'Full-Stack App Arc',  em: 'App',           sub: 'Next.js · FastAPI · Vercel',     kind: 'thematic',  accent: '#e879f9', loadHrs: 10, exam: 'Portfolio · 3 apps shipped',  feedsInto: ['voice','brand','saas'], fedBy: ['security'], capstone: 'M12 flagship · paying users' },
  { id: 'azure',      series: 2, lane: null, title: 'Azure Foundry Arc',   em: 'Foundry',       sub: 'Azure OpenAI · Prompt Flow',     kind: 'platform',  accent: '#6366f1', loadHrs: 6,  exam: 'AI-102 deepening (M11)',     feedsInto: ['copilot','enterprise'], fedBy: ['copilot','rag'], capstone: 'M11 Copilot vs Foundry guide' },
  { id: 'eval',       series: 2, lane: null, title: 'Eval Arc',            em: 'Eval',          sub: 'LangSmith · Braintrust · CI/CD', kind: 'thematic',  accent: '#eab308', loadHrs: 5,  exam: 'Published playbook + service line', feedsInto: ['aiaas','brand','n8n','evalexpert'], fedBy: [], capstone: 'M11 published playbook' },
  { id: 'voice',      series: 2, lane: null, title: 'Voice & Realtime Arc', em: 'Voice',        sub: 'OpenAI Realtime · sub-700ms',    kind: 'thematic',  accent: '#a855f7', loadHrs: 6,  exam: 'Shipped flagship · service line', feedsInto: [],   fedBy: ['fullstack','openai'], capstone: 'M12 flagship voice product' },
  { id: 'strategy',   series: 2, lane: null, title: 'AI Product Strategy', em: 'Strategy',      sub: 'PRDs · roadmap · advisory',      kind: 'thematic',  accent: '#f43f5e', loadHrs: 4,  exam: 'Published framework + service line', feedsInto: ['aiaas','brand','enterprise'], fedBy: ['aiaas'], capstone: 'M12 framework + Head of AIaaS conv' },
  { id: 'cloudflare', series: 2, lane: null, title: 'Cloudflare Edge AI',  em: 'Edge',          sub: 'Workers AI · Vectorize · D1',    kind: 'thematic',  accent: '#ea580c', loadHrs: 3,  exam: '5 deployments + guide',      feedsInto: [],       fedBy: ['mcp','rag'], capstone: 'M12 AI at the Edge guide' },

  // SERIES 3 — Output Lane (4 arcs, combinable)
  { id: 'book',       series: 3, lane: 'B', title: 'Book Arc',             em: 'Book',          sub: 'Memoir OR practitioner · forked', kind: 'output',   accent: '#06b6d4', loadHrs: 8,  exam: 'Published book by M12',      feedsInto: ['brand'],    fedBy: [],                       capstone: 'M11 launch + Y2 plan' },
  { id: 'course',     series: 3, lane: 'B', title: 'Course Arc',           em: 'Course',        sub: 'Maven cohort · 4 ships · $50-200K', kind: 'output', accent: '#0891b2', loadHrs: 10, exam: '4 cohorts · $50-200K Y1',    feedsInto: ['brand','partner'], fedBy: ['teaching'],         capstone: 'M11 Y2 strategic decision' },
  { id: 'saas',       series: 3, lane: 'B', title: 'SaaS Arc',             em: 'SaaS',          sub: 'MVP → MRR · $5-50K M12',         kind: 'output',    accent: '#15803d', loadHrs: 13, exam: '$5-50K MRR by M12',          feedsInto: ['partner','brand'], fedBy: ['fullstack'],        capstone: 'M11 scale-or-sunset decision' },
  { id: 'partner',    series: 3, lane: 'B', title: 'Partner Anchor Arc',   em: 'Partner',       sub: 'Anthropic Partner · $200-500K',  kind: 'output',    accent: '#be185d', loadHrs: 7,  exam: '4 case studies · 2+ engagements', feedsInto: ['aiaas','brand'], fedBy: ['security','rag','eval','strategy','azure','gcp','saas','course'], capstone: 'M12 primary channel' },

  // SERIES 3 — Specialization Lane (3 arcs, MUTUALLY EXCLUSIVE)
  { id: 'regulated',  series: 3, lane: 'A', title: 'Regulated AI Security Arc', em: 'Regulated', sub: 'HIPAA · FedRAMP · SOC2 · GDPR', kind: 'spec',     accent: '#dc2626', loadHrs: 12, exam: 'Credential + 3 case studies + guide', feedsInto: ['partner','aiaas'], fedBy: ['security','eval'], capstone: 'M11 published guide' },
  { id: 'evalexpert', series: 3, lane: 'A', title: 'Eval & Safety Expert Arc', em: 'Safety',     sub: 'Red-team · alignment · research', kind: 'spec',    accent: '#7c3aed', loadHrs: 13, exam: '3 publications + community standing', feedsInto: ['brand'],  fedBy: ['eval','security'], capstone: 'M12 Y2 research agenda' },
  { id: 'enterprise', series: 3, lane: 'A', title: 'Enterprise AI Architect Arc', em: 'Architect', sub: 'F500 · multi-cloud · transformation', kind: 'spec', accent: '#1e40af', loadHrs: 15, exam: '3 ref archs + 2 F500 engagements', feedsInto: ['partner','aiaas'], fedBy: ['gcp','azure','strategy','rag','security'], capstone: 'M12 indep vs Principal Architect' },
];

// ---------------------------------------------------------------------------
// PRESET CONFIGURATIONS — 8 total (5 original + 3 new for Series 3)
// ---------------------------------------------------------------------------

const PRESETS = [
  // Original 5 presets (Series 1+2 only)
  { id: 'sustainable',   title: 'Sustainable',         span: '1+2', desc: 'Realistic starting point alongside full-time role. ~15 hrs/week.',     arcs: ['claude', 'security', 'brand'] },
  { id: 'aiaas_path',    title: 'AIaaS Pathway',       span: '1+2', desc: 'Head-of-AIaaS sequence — business + strategy + engineering depth.',    arcs: ['aiaas', 'strategy', 'azure', 'eval'] },
  { id: 'engineering',   title: 'Engineering Heavy',   span: '1+2', desc: 'HIGH-load engineering portfolio. Exam collisions guaranteed.',         arcs: ['fullstack', 'gcp', 'security', 'eval'] },
  { id: 'brand_capital', title: 'Brand Capital',       span: '1+2', desc: 'Public-facing portfolio — brand + flagship-producing arcs.',          arcs: ['brand', 'fullstack', 'voice', 'teaching'] },
  { id: 'practitioner',  title: 'Practitioner Combo',  span: '1+2', desc: 'All 5 platforms via single coordinated sprint.',                       arcs: ['practitioner', 'brand'] },

  // 3 new presets for Series 3 paths
  { id: 'productize',    title: 'Lane B Productization', span: '3',  desc: 'Post-2027. The full output sequence — Partner → Course → Book → SaaS.', arcs: ['partner', 'course', 'book', 'saas'] },
  { id: 'spec_regulated',title: 'Lane A Regulated',    span: '3',   desc: 'Post-2027. Regulated-AI specialization + Partner Network amplification.', arcs: ['regulated', 'partner'] },
  { id: 'spec_architect',title: 'Lane A Architect',    span: '3',   desc: 'Post-2027. F500 architect specialization + Partner Network amplification.', arcs: ['enterprise', 'partner'] },
];

// ---------------------------------------------------------------------------
// CAPACITY GUIDANCE — same 5 bands, slightly recalibrated for 27-arc portfolio
// ---------------------------------------------------------------------------

const CAPACITY_BANDS = [
  { max: 10, label: 'Light',         color: '#4ade80', note: 'Sustainable alongside demanding role. Under-committing if weekends are free.' },
  { max: 18, label: 'Balanced',      color: '#fcd34d', note: 'Realistic sustained load for someone with full-time role and personal time intact.' },
  { max: 28, label: 'Aggressive',    color: '#fb923c', note: 'Sustainable 6-9 months. Past that, something gives — usually brand or teaching first.' },
  { max: 40, label: 'Unsustainable', color: '#f43f5e', note: 'Not workable for 12 months. Portfolio collapses by M4-M6. Drop arcs or cut scope.' },
  { max: 999,label: 'Implausible',   color: '#ef4444', note: 'Not a 12-month plan, this is 24-36 months compressed into 12. Re-scope.' },
];

// ---------------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500&display=swap');

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
  --laneA:        #8b5cf6;
  --laneB:        #22d3ee;
  --warn:         #fb923c;
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

.container { max-width: 1240px; margin: 0 auto; }

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

/* PRESETS */
.presets-section { margin-bottom: 28px; }
.presets-label {
  font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim);
  margin-bottom: 10px;
}
.presets {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
  margin-bottom: 10px;
}
.preset {
  background: var(--bg-2); border: 1px solid var(--border);
  padding: 12px 14px; cursor: pointer; text-align: left;
  font-family: 'JetBrains Mono', monospace; color: var(--fg);
  transition: border-color 0.15s;
  position: relative;
}
.preset:hover { border-color: var(--border-bright); }
.preset-span {
  position: absolute; top: 8px; right: 10px;
  font-size: 8.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--fg-mute);
}
.preset.is-s3 .preset-span { color: var(--laneB); }
.preset-label { font-size: 9px; letter-spacing: 0.2em; color: var(--fg-dim); text-transform: uppercase; margin-bottom: 4px; }
.preset-title {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 16px; line-height: 1.15; color: var(--fg); margin-bottom: 4px;
}
.preset-desc { font-size: 10.5px; color: var(--fg-dim); line-height: 1.4; }

/* LAYOUT */
.layout { display: grid; grid-template-columns: 1fr 340px; gap: 32px; align-items: start; }

/* ARC SECTIONS */
.arc-section {
  border: 1px solid var(--border); background: var(--bg-2);
  margin-bottom: 16px;
}
.arc-section.is-series-3 {
  border-color: var(--border-bright);
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
.arc-section-meta {
  display: flex; align-items: center; gap: 12px;
}
.arc-section-count {
  font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--fg-dim);
}
.arc-section-horizon {
  font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--warn);
  padding: 2px 8px; border: 1px solid rgba(251,146,60,0.3);
  background: rgba(251,146,60,0.05);
}

/* LANE SUBHEADERS within Series 3 */
.lane-subhead {
  padding: 8px 16px;
  background: rgba(0,0,0,0.2);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center;
}
.lane-subhead-label {
  font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--lane-color); font-weight: 500;
  display: flex; align-items: center; gap: 6px;
}
.lane-subhead-rule {
  font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--fg-dim); font-style: italic;
}

/* ARC ROW */
.arc-row {
  display: grid; grid-template-columns: 32px 4px 1fr 60px 32px;
  gap: 12px; align-items: center;
  padding: 11px 16px;
  border-top: 1px solid var(--border);
  cursor: pointer; transition: background 0.12s;
}
.arc-row:hover { background: rgba(255,255,255,0.015); }
.arc-row.selected { background: rgba(255,255,255,0.025); }
.arc-row.locked-out {
  opacity: 0.4;
  cursor: not-allowed;
}
.arc-row.locked-out:hover { background: transparent; }
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
.arc-row.locked-out .arc-check { border-color: var(--fg-mute); }

.arc-bar {
  width: 4px; height: 32px; background: var(--row-accent); opacity: 0.4;
  transition: opacity 0.15s;
}
.arc-row.selected .arc-bar { opacity: 1; }

.arc-info { min-width: 0; }
.arc-name {
  font-size: 13.5px; color: var(--fg); font-weight: 500;
  margin-bottom: 2px; letter-spacing: -0.005em;
  display: flex; align-items: center; gap: 8px;
}
.arc-name-text em { color: var(--row-accent); font-style: normal; font-weight: 700; }
.arc-lane-tag {
  font-size: 8.5px; letter-spacing: 0.16em; text-transform: uppercase;
  padding: 1px 5px;
  font-weight: 500;
}
.arc-lane-tag.is-A {
  color: var(--laneA);
  border: 1px solid rgba(139,92,246,0.3);
  background: rgba(139,92,246,0.08);
}
.arc-lane-tag.is-B {
  color: var(--laneB);
  border: 1px solid rgba(34,211,238,0.3);
  background: rgba(34,211,238,0.08);
}
.arc-sub {
  font-size: 10.5px; color: var(--fg-dim);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.arc-hrs {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 16px; color: var(--row-accent); text-align: right;
}
.arc-hrs-unit { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--fg-dim); font-style: normal; }

.arc-icon {
  font-size: 8.5px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--fg-mute); text-align: center;
}
.arc-row.locked-out .arc-icon { color: var(--fg-mute); }
.arc-row.locked-out .arc-icon svg { width: 12px; height: 12px; }

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

.collisions, .cross-feeds {
  border: 1px solid var(--border); background: var(--bg-2);
  padding: 16px; margin-bottom: 12px;
}

.collision-row {
  padding: 8px 10px; margin-bottom: 6px;
  border-left: 2px solid var(--c-color);
  background: var(--c-bg);
  font-size: 11px; color: var(--fg); line-height: 1.5;
}
.collision-row:last-child { margin-bottom: 0; }
.collision-empty, .feed-empty {
  font-size: 11px; color: var(--fg-dim); font-style: italic; padding: 4px 0;
}

.feed-row {
  padding: 8px 10px; margin-bottom: 6px;
  background: rgba(74,222,128,0.05); border-left: 2px solid #4ade80;
  font-size: 11px; color: var(--fg); line-height: 1.5;
}
.feed-row:last-child { margin-bottom: 0; }
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

@media (max-width: 980px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { position: static; }
  .presets { grid-template-columns: 1fr 1fr; }
  .header-grid { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .arc-row { grid-template-columns: 28px 3px 1fr 50px; }
  .arc-icon { display: none; }
}
`;

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
export default function MasterArcSelectorV2() {
  const [selected, setSelected] = useState(new Set(['claude', 'security', 'brand']));

  // Find currently selected Lane A arc (if any)
  const selectedLaneA = useMemo(() => {
    return ARCS.find(a => a.lane === 'A' && selected.has(a.id))?.id || null;
  }, [selected]);

  const toggle = (id) => {
    const arc = ARCS.find(a => a.id === id);
    if (!arc) return;

    setSelected((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        // Lane A enforcement: selecting one Lane A arc auto-deselects others
        if (arc.lane === 'A') {
          ARCS.forEach(a => {
            if (a.lane === 'A' && a.id !== id) next.delete(a.id);
          });
        }
        next.add(id);
      }

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

    const collisions = [];

    // Exam collisions — shared exam months
    const examsByMonth = {};
    selectedArcs.forEach(arc => {
      const monthMatches = arc.exam.match(/M(\d+)/g) || [];
      monthMatches.forEach(m => {
        const month = parseInt(m.slice(1));
        if (!examsByMonth[month]) examsByMonth[month] = [];
        examsByMonth[month].push(arc);
      });
    });
    Object.keys(examsByMonth).forEach(month => {
      if (examsByMonth[month].length > 1) {
        collisions.push({
          severity: 'warn',
          type: 'exam',
          month: parseInt(month),
          arcs: examsByMonth[month],
        });
      }
    });

    // HIGH-load collisions — multiple 8+ hr arcs
    const highArcs = selectedArcs.filter(a => a.loadHrs >= 8);
    if (highArcs.length >= 2) {
      collisions.push({
        severity: 'warn',
        type: 'high-load',
        arcs: highArcs,
      });
    }

    // Series 3 horizon mismatch — mixing Series 3 with Series 1+2 in same year
    const hasS12 = selectedArcs.some(a => a.series === 1 || a.series === 2);
    const hasS3 = selectedArcs.some(a => a.series === 3);
    if (hasS12 && hasS3) {
      const s3Arcs = selectedArcs.filter(a => a.series === 3);
      collisions.push({
        severity: 'warn',
        type: 'horizon',
        arcs: s3Arcs,
      });
    }

    // Lane A duplicate enforcement (shouldn't happen with toggle logic, but defensive)
    const laneAArcs = selectedArcs.filter(a => a.lane === 'A');
    if (laneAArcs.length > 1) {
      collisions.push({
        severity: 'critical',
        type: 'lane-a-duplicate',
        arcs: laneAArcs,
      });
    }

    // Cross-feeds
    const feeds = [];
    selectedArcs.forEach(arc => {
      arc.feedsInto.forEach(targetId => {
        if (selected.has(targetId)) {
          const target = ARCS.find(a => a.id === targetId);
          if (target) feeds.push({ from: arc, to: target });
        }
      });
    });

    return { selectedArcs, totalHrs, band, collisions, feeds };
  }, [selected]);

  const series1 = ARCS.filter(a => a.series === 1);
  const series2 = ARCS.filter(a => a.series === 2);
  const series3LaneB = ARCS.filter(a => a.series === 3 && a.lane === 'B');
  const series3LaneA = ARCS.filter(a => a.series === 3 && a.lane === 'A');

  const renderArcRow = (arc) => {
    const isSelected = selected.has(arc.id);
    const isLockedOut = arc.lane === 'A' && selectedLaneA && selectedLaneA !== arc.id;

    return (
      <div
        key={arc.id}
        className={`arc-row ${isSelected ? 'selected' : ''} ${isLockedOut ? 'locked-out' : ''}`}
        style={{ ['--row-accent']: arc.accent }}
        onClick={() => !isLockedOut && toggle(arc.id)}
      >
        <div className="arc-check">
          {isSelected && <CheckCircle2 size={14} strokeWidth={3} />}
        </div>
        <div className="arc-bar" />
        <div className="arc-info">
          <div className="arc-name">
            <span className="arc-name-text">
              {arc.title.replace(arc.em, '')}<em>{arc.em}</em>
            </span>
            {arc.lane && (
              <span className={`arc-lane-tag is-${arc.lane}`}>Lane {arc.lane}</span>
            )}
          </div>
          <div className="arc-sub">{arc.sub}</div>
        </div>
        <div className="arc-hrs">{arc.loadHrs}<span className="arc-hrs-unit">/wk</span></div>
        <div className="arc-icon">
          {isLockedOut ? <Lock size={12} /> : arc.kind.slice(0, 4)}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Compass size={12} /> Learning Ops // Portfolio Selector v2</p>
              <h1 className="title-serif">The <em>Selector</em>.</h1>
              <p className="title-sub">
                Twenty-seven arcs exist across three series. You cannot run all twenty-seven in one
                year. This tool turns "what arcs sound interesting" into "what arcs am I actually
                committing to, with what combined load, what collisions, what cross-feeds, and what
                horizon mismatches." Toggle arcs; watch the math.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Series <strong>01 (13) · 02 (7) · 03 (7) = 27</strong></div>
              <div style={{ marginTop: 4 }}>Horizon <strong>Apr 2026 → 2028+</strong></div>
              <div style={{ marginTop: 4 }}>Currently selected: <strong>{selected.size}</strong></div>
            </div>
          </div>

          {/* PRESETS */}
          <div className="presets-section">
            <div className="presets-label">Presets — starting points, not endpoints</div>
            <div className="presets">
              {PRESETS.slice(0, 4).map(p => (
                <button key={p.id} className={`preset ${p.span === '3' ? 'is-s3' : ''}`} onClick={() => applyPreset(p)}>
                  <div className="preset-span">{p.span === '3' ? 'S3' : 'S1+2'}</div>
                  <div className="preset-label">Preset</div>
                  <div className="preset-title">{p.title}</div>
                  <div className="preset-desc">{p.desc}</div>
                </button>
              ))}
            </div>
            <div className="presets">
              {PRESETS.slice(4).map(p => (
                <button key={p.id} className={`preset ${p.span === '3' ? 'is-s3' : ''}`} onClick={() => applyPreset(p)}>
                  <div className="preset-span">{p.span === '3' ? 'S3' : 'S1+2'}</div>
                  <div className="preset-label">Preset</div>
                  <div className="preset-title">{p.title}</div>
                  <div className="preset-desc">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* LAYOUT */}
          <div className="layout">

            <div>
              {/* SERIES 1 */}
              <div className="arc-section">
                <div className="arc-section-head">
                  <div className="arc-section-title">Series One — foundational thirteen</div>
                  <div className="arc-section-meta">
                    <div className="arc-section-count">{series1.filter(a => selected.has(a.id)).length} / {series1.length}</div>
                  </div>
                </div>
                {series1.map(renderArcRow)}
              </div>

              {/* SERIES 2 */}
              <div className="arc-section">
                <div className="arc-section-head">
                  <div className="arc-section-title">Series Two — leverage layer</div>
                  <div className="arc-section-meta">
                    <div className="arc-section-count">{series2.filter(a => selected.has(a.id)).length} / {series2.length}</div>
                  </div>
                </div>
                {series2.map(renderArcRow)}
              </div>

              {/* SERIES 3 */}
              <div className="arc-section is-series-3">
                <div className="arc-section-head">
                  <div className="arc-section-title">Series Three — output + specialization</div>
                  <div className="arc-section-meta">
                    <div className="arc-section-horizon">Post-2027</div>
                    <div className="arc-section-count">
                      {[...series3LaneA, ...series3LaneB].filter(a => selected.has(a.id)).length} / 7
                    </div>
                  </div>
                </div>

                {/* Lane B subhead */}
                <div className="lane-subhead" style={{ ['--lane-color']: 'var(--laneB)' }}>
                  <div className="lane-subhead-label">
                    <Layers size={10} /> Lane B · Productization
                  </div>
                  <div className="lane-subhead-rule">combinable · sequence-friendly</div>
                </div>
                {series3LaneB.map(renderArcRow)}

                {/* Lane A subhead */}
                <div className="lane-subhead" style={{ ['--lane-color']: 'var(--laneA)' }}>
                  <div className="lane-subhead-label">
                    <Lock size={10} /> Lane A · Specialization
                  </div>
                  <div className="lane-subhead-rule">pick ONE · auto-locks others</div>
                </div>
                {series3LaneA.map(renderArcRow)}
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="sidebar">

              {/* COMBINED LOAD */}
              <div className="stat-card">
                <div className="stat-label">
                  <Zap size={9} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  Combined load
                </div>
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
                  <div className="collision-empty">No exam-month, HIGH-load, horizon, or Lane A collisions detected.</div>
                )}
                {stats.collisions.map((c, i) => {
                  const isCritical = c.severity === 'critical';
                  const color = isCritical ? '#ef4444' : '#fb923c';
                  return (
                    <div
                      key={i}
                      className="collision-row"
                      style={{ ['--c-color']: color, ['--c-bg']: `${color}10` }}
                    >
                      {c.type === 'high-load' && (
                        <>
                          <strong>Multiple HIGH-load arcs:</strong>{' '}
                          {c.arcs.map(a => a.em).join(' + ')}. Pre-Q1 sequencing review required.
                        </>
                      )}
                      {c.type === 'exam' && (
                        <>
                          <strong>Month {c.month} exam collision:</strong>{' '}
                          {c.arcs.map(a => a.em).join(' + ')}. Sit exams in different weeks of M{c.month}.
                        </>
                      )}
                      {c.type === 'horizon' && (
                        <>
                          <strong>Horizon mismatch:</strong>{' '}
                          Series 3 arcs ({c.arcs.map(a => a.em).join(', ')}) are post-2027 commitments. Series 1+2 are current-year. Combining suggests a multi-year plan, not a 12-month plan.
                        </>
                      )}
                      {c.type === 'lane-a-duplicate' && (
                        <>
                          <strong>Lane A conflict:</strong>{' '}
                          Only one Lane A specialization can run at a time. Currently selected: {c.arcs.map(a => a.em).join(', ')}.
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* CROSS-FEEDS */}
              <div className="cross-feeds">
                <div className="stat-label" style={{ marginBottom: 10 }}>
                  <Link2 size={9} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  Cross-arc feeds ({stats.feeds.length})
                </div>
                {stats.feeds.length === 0 && (
                  <div className="feed-empty">No cross-arc feeds in this selection. Consider adding feeder arcs to compound leverage.</div>
                )}
                {stats.feeds.slice(0, 7).map((f, i) => (
                  <div key={i} className="feed-row">
                    <strong>{f.from.em}</strong><span className="feed-arrow">→</span><strong>{f.to.em}</strong>
                    <div style={{ marginTop: 2, fontSize: 10, color: 'var(--fg-dim)' }}>{f.from.capstone}</div>
                  </div>
                ))}
                {stats.feeds.length > 7 && (
                  <div className="feed-empty" style={{ marginTop: 6 }}>
                    + {stats.feeds.length - 7} more — selected arcs are highly compounding.
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* CLAIMS */}
          <div className="claims">
            <h4>
              <Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              How v2 differs from v1
            </h4>
            <ul>
              <li>
                <strong>Series 3 is integrated but visually distinct.</strong> Series 3 arcs are post-2027 commitments — they belong to a different planning horizon than current-year Series 1+2 work. The "Post-2027" badge on the Series 3 section is the constant reminder. Combining Series 3 with Series 1+2 in a single selection produces a horizon-mismatch warning, not a hard error — multi-year plans are valid, but should be acknowledged as such.
              </li>
              <li>
                <strong>Lane A "pick one" is enforced at the UI level.</strong> Selecting one Lane A specialization (Regulated, Eval Expert, or Architect) automatically locks the other two. The lock icon and reduced opacity make the constraint visible. This is the structural rule that determines whether Lane A actually produces depth — running multiple specializations in parallel defeats the entire purpose.
              </li>
              <li>
                <strong>Lane B is combinable.</strong> Book, Course, SaaS, and Partner Anchor can all run together or in sequence. The most common sequencing is Partner Anchor → Course → Book → SaaS over 24-36 months, with each feeding the next. The "Lane B Productization" preset shows the full combination.
              </li>
              <li>
                <strong>Three new presets cover Series 3 paths.</strong> Lane B Productization (the full output sequence), Lane A Regulated (specialization + Partner amplification), and Lane A Architect (specialization + Partner amplification). The Eval & Safety Expert path isn't a separate preset because its compounding pattern is different — it pairs less directly with Partner Anchor and more with the Brand arc's research-credibility surface.
              </li>
              <li>
                <strong>Cross-feed logic now spans all three series.</strong> Course arc is fed by Teaching arc (Series 1). SaaS arc is fed by Full-Stack arc (Series 2). Partner Anchor is fed by virtually every Series 1+2 capstone. Regulated AI Security is fed by Series 1 Security arc. Enterprise Architect is fed by GCP, Azure, Strategy, RAG, and Security. The compounding is real and the selector now surfaces it across series boundaries.
              </li>
              <li>
                <strong>What v2 still does not model:</strong> energy variation across months, life events compressing available time, context-switching cost between arcs, Q1 onboarding ramp, exam-prep compression. Treat the displayed number as the optimistic case in a stable life — multiply by 1.2-1.3x for a realistic plan. This is unchanged from v1 and remains the most important caveat.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
