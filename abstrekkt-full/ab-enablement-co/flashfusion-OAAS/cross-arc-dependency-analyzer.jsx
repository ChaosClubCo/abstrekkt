import React, { useState, useMemo } from 'react';
import { Compass, ArrowRight, TrendingUp, AlertCircle, Lightbulb, Lock, Layers, Zap } from 'lucide-react';

// ---------------------------------------------------------------------------
// FULL ARC DATA — 27 arcs with feedsInto + fedBy relationships
// Ported from master-arc-selector-v2.jsx (source of truth)
// ---------------------------------------------------------------------------

const ARCS = [
  // SERIES 1 — Platform (5)
  { id: 'mastery',      series: 1, lane: null, title: 'Mastery Arc',         em: 'Mastery',       accent: '#c6f432', feedsInto: ['gcp'],                                                fedBy: ['gcp'] },
  { id: 'claude',       series: 1, lane: null, title: 'Claude Arc',          em: 'Claude',        accent: '#e07856', feedsInto: ['mcp'],                                                fedBy: [] },
  { id: 'copilot',      series: 1, lane: null, title: 'Copilot Arc',         em: 'Copilot',       accent: '#6ba8e8', feedsInto: ['azure'],                                              fedBy: ['azure'] },
  { id: 'openai',       series: 1, lane: null, title: 'OpenAI Arc',          em: 'OpenAI',        accent: '#5ee0c0', feedsInto: ['voice'],                                              fedBy: [] },
  { id: 'practitioner', series: 1, lane: null, title: 'Practitioner Arc',    em: 'Practitioner',  accent: '#d4a843', feedsInto: [],                                                     fedBy: [] },

  // SERIES 1 — Thematic (8)
  { id: 'aiaas',        series: 1, lane: null, title: 'AIaaS Arc',           em: 'AIaaS',         accent: '#e8962a', feedsInto: ['strategy'],                                           fedBy: ['strategy', 'eval', 'partner', 'regulated', 'enterprise'] },
  { id: 'mcp',          series: 1, lane: null, title: 'MCP Builder Arc',     em: 'MCP',           accent: '#8b5cf6', feedsInto: ['cloudflare'],                                         fedBy: ['claude'] },
  { id: 'security',     series: 1, lane: null, title: 'Security Arc',        em: 'Security',      accent: '#e05252', feedsInto: ['teaching', 'fullstack', 'regulated', 'evalexpert', 'partner', 'enterprise'], fedBy: [] },
  { id: 'rag',          series: 1, lane: null, title: 'RAG & Data Arc',      em: 'RAG',           accent: '#14b8a6', feedsInto: ['azure', 'cloudflare', 'partner', 'enterprise'],       fedBy: ['gcp'] },
  { id: 'n8n',          series: 1, lane: null, title: 'n8n Automation Arc',  em: 'n8n',           accent: '#f97316', feedsInto: [],                                                     fedBy: ['eval'] },
  { id: 'brand',        series: 1, lane: null, title: 'Brand Arc',           em: 'Brand',         accent: '#38bdf8', feedsInto: [],                                                     fedBy: ['eval', 'gcp', 'fullstack', 'strategy', 'book', 'partner', 'course', 'saas', 'evalexpert'] },
  { id: 'teaching',     series: 1, lane: null, title: 'Teaching Arc',        em: 'Teaching',      accent: '#4ade80', feedsInto: ['course'],                                             fedBy: ['security'] },

  // SERIES 2 — Leverage (7)
  { id: 'gcp',          series: 2, lane: null, title: 'GCP / Vertex Arc',    em: 'GCP',           accent: '#4285f4', feedsInto: ['mastery', 'rag', 'brand', 'enterprise', 'partner'],   fedBy: ['mastery'] },
  { id: 'fullstack',    series: 2, lane: null, title: 'Full-Stack App Arc',  em: 'App',           accent: '#e879f9', feedsInto: ['voice', 'brand', 'saas'],                             fedBy: ['security'] },
  { id: 'azure',        series: 2, lane: null, title: 'Azure Foundry Arc',   em: 'Foundry',       accent: '#6366f1', feedsInto: ['copilot', 'enterprise', 'partner'],                   fedBy: ['copilot', 'rag'] },
  { id: 'eval',         series: 2, lane: null, title: 'Eval Arc',            em: 'Eval',          accent: '#eab308', feedsInto: ['aiaas', 'brand', 'n8n', 'evalexpert', 'regulated', 'partner'], fedBy: [] },
  { id: 'voice',        series: 2, lane: null, title: 'Voice & Realtime Arc', em: 'Voice',        accent: '#a855f7', feedsInto: [],                                                     fedBy: ['fullstack', 'openai'] },
  { id: 'strategy',     series: 2, lane: null, title: 'AI Product Strategy', em: 'Strategy',      accent: '#f43f5e', feedsInto: ['aiaas', 'brand', 'enterprise', 'partner'],            fedBy: ['aiaas'] },
  { id: 'cloudflare',   series: 2, lane: null, title: 'Cloudflare Edge AI',  em: 'Edge',          accent: '#ea580c', feedsInto: [],                                                     fedBy: ['mcp', 'rag'] },

  // SERIES 3 Lane B — Output (4)
  { id: 'book',         series: 3, lane: 'B', title: 'Book Arc',             em: 'Book',          accent: '#06b6d4', feedsInto: ['brand'],                                              fedBy: [] },
  { id: 'course',       series: 3, lane: 'B', title: 'Course Arc',           em: 'Course',        accent: '#0891b2', feedsInto: ['brand', 'partner'],                                   fedBy: ['teaching'] },
  { id: 'saas',         series: 3, lane: 'B', title: 'SaaS Arc',             em: 'SaaS',          accent: '#15803d', feedsInto: ['partner', 'brand'],                                   fedBy: ['fullstack'] },
  { id: 'partner',      series: 3, lane: 'B', title: 'Partner Anchor Arc',   em: 'Partner',       accent: '#be185d', feedsInto: ['aiaas', 'brand'],                                     fedBy: ['security', 'rag', 'eval', 'strategy', 'azure', 'gcp', 'saas', 'course'] },

  // SERIES 3 Lane A — Specialization (3, mutually exclusive)
  { id: 'regulated',    series: 3, lane: 'A', title: 'Regulated AI Sec Arc', em: 'Regulated',     accent: '#dc2626', feedsInto: ['partner', 'aiaas'],                                   fedBy: ['security', 'eval'] },
  { id: 'evalexpert',   series: 3, lane: 'A', title: 'Eval & Safety Expert', em: 'Safety',        accent: '#7c3aed', feedsInto: ['brand'],                                              fedBy: ['eval', 'security'] },
  { id: 'enterprise',   series: 3, lane: 'A', title: 'Enterprise Architect', em: 'Architect',     accent: '#1e40af', feedsInto: ['partner', 'aiaas'],                                   fedBy: ['gcp', 'azure', 'strategy', 'rag', 'security'] },
];

// Build arc lookup
const ARC_BY_ID = ARCS.reduce((acc, a) => { acc[a.id] = a; return acc; }, {});

// ---------------------------------------------------------------------------
// TIER CLASSIFICATION
// Sources: out >= 2 && in <= 1
// Sinks:   in >= 2 && out <= 1
// Bidir:   everything else (including isolated)
// ---------------------------------------------------------------------------

const tierOf = (arc) => {
  const out = arc.feedsInto.length;
  const inn = arc.fedBy.length;
  if (out >= 2 && inn <= 1) return 'sources';
  if (inn >= 2 && out <= 1) return 'sinks';
  return 'bidir';
};

const TIER_DEFS = {
  sources: {
    label: 'Sources',
    sub: 'Pure leverage producers',
    desc: 'These arcs feed many others and are fed by zero or one. Build capability that multiplies downstream — Tier 1 is where Y1 portfolio strength comes from.',
    icon: TrendingUp,
    color: '#4ade80',
  },
  bidir: {
    label: 'Bidirectional',
    sub: 'Working layer',
    desc: 'Both feed and fed. The middle tier where most arcs live — mutual reinforcement with other arcs across tiers.',
    icon: Layers,
    color: '#94a3b8',
  },
  sinks: {
    label: 'Sinks',
    sub: 'Aggregation surfaces',
    desc: 'Many arcs feed in, few feed out. Where the portfolio becomes legible — Brand, Partner, AIaaS, Enterprise are how the world sees the work.',
    icon: Zap,
    color: '#fb923c',
  },
};

// ---------------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #0c0d10;
  --bg-2: #14161b;
  --bg-3: #1c1f29;
  --fg: #e8e9ed;
  --fg-dim: #8a8f9a;
  --fg-mute: #555a65;
  --border: #1f2229;
  --border-bright: #2c303a;
  --accent: #cbd5e1;
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

.container { max-width: 1320px; margin: 0 auto; }

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
  font-family: 'Instrument Serif', serif; font-size: clamp(38px, 5.4vw, 66px);
  line-height: 0.96; letter-spacing: -0.02em; margin: 0; font-weight: 400; color: var(--fg);
}
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub {
  font-size: 12.5px; color: var(--fg-dim); margin: 12px 0 0;
  max-width: 60ch; line-height: 1.6;
}
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--fg); font-weight: 500; }

/* ACTIVE TOGGLE STRIP */
.toggle-strip {
  display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 28px;
  padding: 12px 14px; background: var(--bg-2); border: 1px solid var(--border);
}
.toggle-label {
  font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--fg-dim); margin-right: 10px; align-self: center;
}
.arc-pill {
  padding: 4px 9px; background: var(--bg-3); border: 1px solid var(--border-bright);
  font-size: 10px; letter-spacing: 0.08em; color: var(--fg-mute);
  cursor: pointer; transition: all 0.15s; font-family: 'JetBrains Mono', monospace;
  display: flex; align-items: center; gap: 6px;
}
.arc-pill:hover { color: var(--fg-dim); }
.arc-pill.active {
  color: var(--ap-accent); border-color: var(--ap-accent);
  background: rgba(255,255,255,0.02);
}
.arc-pill-dot { width: 6px; height: 6px; background: var(--ap-accent); opacity: 0.4; }
.arc-pill.active .arc-pill-dot { opacity: 1; }

/* LAYOUT */
.layout { display: grid; grid-template-columns: 1fr 320px; gap: 28px; align-items: start; }

/* TIER COLUMNS */
.tiers {
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px;
  margin-bottom: 28px;
}
.tier {
  border: 1px solid var(--border); background: var(--bg-2);
  border-top: 2px solid var(--tier-color);
}
.tier-head {
  padding: 14px 16px; border-bottom: 1px solid var(--border);
  display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: start;
}
.tier-icon {
  color: var(--tier-color); margin-top: 2px;
}
.tier-label {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 20px; color: var(--fg); font-weight: 400; line-height: 1;
}
.tier-sub {
  font-size: 9.5px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--tier-color); margin-top: 3px;
}
.tier-count {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 18px; color: var(--fg-dim);
}
.tier-count strong { color: var(--fg); }
.tier-desc {
  padding: 10px 16px;
  font-size: 11px; color: var(--fg-dim); line-height: 1.55;
  border-bottom: 1px solid var(--border);
  background: rgba(0,0,0,0.15);
}
.tier-arcs { display: grid; }
.tier-arc {
  padding: 10px 14px;
  border-top: 1px solid var(--border);
  cursor: pointer; transition: background 0.12s, opacity 0.15s;
  display: grid; grid-template-columns: 4px 1fr auto; gap: 10px; align-items: start;
}
.tier-arc:first-child { border-top: none; }
.tier-arc:hover { background: rgba(255,255,255,0.015); }
.tier-arc.inactive { opacity: 0.4; }
.tier-arc.compounding { background: rgba(74,222,128,0.04); }
.tier-arc.isolated { background: rgba(251,146,60,0.04); }
.tier-arc-bar { width: 4px; align-self: stretch; background: var(--ta-accent); opacity: 0.7; }
.tier-arc.inactive .tier-arc-bar { opacity: 0.25; }
.tier-arc-name {
  font-size: 12px; color: var(--fg); font-weight: 500; line-height: 1.3;
  margin-bottom: 4px;
}
.tier-arc-name em { color: var(--ta-accent); font-style: normal; font-weight: 700; }
.tier-arc-degrees {
  display: flex; gap: 10px; font-size: 9.5px; color: var(--fg-mute);
  letter-spacing: 0.06em;
}
.deg-out { color: var(--ta-accent); opacity: 0.8; }
.tier-arc-flag {
  font-size: 8px; letter-spacing: 0.16em; text-transform: uppercase;
  align-self: start; padding: 1px 5px; font-weight: 500;
}
.flag-compound {
  background: rgba(74,222,128,0.1); color: #4ade80;
}
.flag-isolated {
  background: rgba(251,146,60,0.1); color: #fb923c;
}
.flag-laneA {
  background: rgba(139,92,246,0.1); color: #8b5cf6;
  border: 1px solid rgba(139,92,246,0.3);
}
.flag-laneB {
  background: rgba(34,211,238,0.1); color: #22d3ee;
  border: 1px solid rgba(34,211,238,0.3);
}

/* ACTIVE COMPOUNDING */
.compounding-panel {
  border: 1px solid var(--border); background: var(--bg-2);
  padding: 20px 24px;
}
.cp-head {
  display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: end;
  margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--border);
}
.cp-title {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 26px; color: var(--fg); font-weight: 400; line-height: 1;
}
.cp-title em { color: var(--accent); }
.cp-count {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 32px; color: var(--accent); font-weight: 400; line-height: 1;
}
.cp-count-unit {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--fg-dim); margin-left: 6px; font-style: normal; letter-spacing: 0.16em; text-transform: uppercase;
}

.feeds-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
}
.feed-card {
  padding: 12px 14px;
  background: rgba(255,255,255,0.015);
  border-left: 2px solid var(--feed-from);
  display: grid; grid-template-columns: 1fr auto 1fr; gap: 10px; align-items: center;
  font-size: 11.5px;
}
.feed-from-name, .feed-to-name {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 16px; color: var(--fg); line-height: 1.1;
}
.feed-from-name em { color: var(--feed-from); }
.feed-to-name em { color: var(--feed-to); }
.feed-arrow {
  color: var(--fg-mute); display: flex; align-items: center;
}
.feeds-empty {
  padding: 24px 20px; text-align: center;
  color: var(--fg-dim); font-style: italic; font-size: 12.5px;
  border: 1px dashed var(--border-bright);
}

/* SIDEBAR */
.sidebar { position: sticky; top: 24px; display: grid; gap: 12px; }

.score-card {
  border: 1px solid var(--border); background: var(--bg-2);
  padding: 16px;
}
.stat-label {
  font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--fg-dim); margin-bottom: 8px;
  display: flex; align-items: center; gap: 6px;
}
.score-value {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 44px; line-height: 1; color: var(--fg); font-weight: 400;
}
.score-unit {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--fg-dim); font-style: normal; margin-left: 4px;
}
.score-bar {
  margin-top: 10px; height: 4px; background: var(--border);
  position: relative; overflow: hidden;
}
.score-bar-fill {
  position: absolute; top: 0; left: 0; bottom: 0;
  background: var(--sb-color); transition: width 0.4s ease;
}
.score-meta {
  margin-top: 8px; font-size: 10.5px; color: var(--fg-dim); line-height: 1.55;
}

.isolated-panel, .suggest-panel {
  border: 1px solid var(--border); background: var(--bg-2); padding: 16px;
}

.isolated-row, .suggest-row {
  display: grid; grid-template-columns: 4px 1fr auto; gap: 10px;
  padding: 8px 0; border-bottom: 1px solid var(--border);
}
.isolated-row:last-child, .suggest-row:last-child { border-bottom: none; }
.isolated-row:first-of-type, .suggest-row:first-of-type { padding-top: 4px; }
.isolated-bar { width: 4px; background: var(--ir-accent); opacity: 0.7; }
.isolated-name { font-size: 11px; color: var(--fg); }
.isolated-name em { color: var(--ir-accent); font-style: normal; font-weight: 600; }
.isolated-tag {
  font-size: 9px; letter-spacing: 0.14em; color: var(--fg-dim);
}
.suggest-row { cursor: pointer; transition: background 0.12s; padding: 8px 4px; }
.suggest-row:hover { background: rgba(255,255,255,0.02); }
.suggest-conns {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 14px; color: var(--ir-accent);
}
.empty-panel-text {
  font-size: 11px; color: var(--fg-dim); font-style: italic;
  padding: 6px 0; line-height: 1.55;
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

@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.stagger > * { opacity: 0; animation: rise 0.45s ease forwards; }
.stagger > *:nth-child(1) { animation-delay: 0.04s; }
.stagger > *:nth-child(2) { animation-delay: 0.08s; }
.stagger > *:nth-child(3) { animation-delay: 0.12s; }

@media (max-width: 1100px) {
  .tiers { grid-template-columns: 1fr; }
  .feeds-grid { grid-template-columns: 1fr; }
}
@media (max-width: 980px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { position: static; }
  .header { grid-template-columns: 1fr; }
  .meta { text-align: left; }
}
`;

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
export default function CrossArcDependencyAnalyzer() {
  const [active, setActive] = useState(new Set(['claude', 'security', 'brand', 'eval', 'strategy']));

  const toggle = (id) => {
    const arc = ARC_BY_ID[id];
    setActive(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        // Lane A enforcement
        if (arc?.lane === 'A') {
          ARCS.forEach(a => { if (a.lane === 'A' && a.id !== id) next.delete(a.id); });
        }
        next.add(id);
      }
      return next;
    });
  };

  // Bucket arcs by tier
  const tieredArcs = useMemo(() => {
    const tiers = { sources: [], bidir: [], sinks: [] };
    ARCS.forEach(arc => { tiers[tierOf(arc)].push(arc); });
    return tiers;
  }, []);

  // Active feeds — cross-arc connections inside the selection
  const activeFeeds = useMemo(() => {
    const feeds = [];
    Array.from(active).forEach(id => {
      const arc = ARC_BY_ID[id];
      if (!arc) return;
      arc.feedsInto.forEach(targetId => {
        if (active.has(targetId)) {
          feeds.push({ from: arc, to: ARC_BY_ID[targetId] });
        }
      });
    });
    return feeds;
  }, [active]);

  // Per-arc compounding state (in current selection)
  const arcState = useMemo(() => {
    const state = {};
    ARCS.forEach(arc => {
      if (!active.has(arc.id)) {
        state[arc.id] = 'inactive';
        return;
      }
      const hasInFeed = arc.fedBy.some(id => active.has(id));
      const hasOutFeed = arc.feedsInto.some(id => active.has(id));
      if (hasInFeed || hasOutFeed) state[arc.id] = 'compounding';
      else state[arc.id] = 'isolated';
    });
    return state;
  }, [active]);

  const isolatedArcs = useMemo(
    () => ARCS.filter(a => arcState[a.id] === 'isolated'),
    [arcState]
  );

  // Suggested additions — arcs not selected that would unlock ≥2 connections
  const suggestions = useMemo(() => {
    const result = [];
    ARCS.forEach(arc => {
      if (active.has(arc.id)) return;
      let unlocked = 0;
      arc.feedsInto.forEach(id => { if (active.has(id)) unlocked++; });
      arc.fedBy.forEach(id => { if (active.has(id)) unlocked++; });
      if (unlocked >= 2) result.push({ arc, connections: unlocked });
    });
    return result.sort((a, b) => b.connections - a.connections).slice(0, 5);
  }, [active]);

  // Leverage score: ratio of active feeds to selected arcs, scaled
  const leverageScore = useMemo(() => {
    if (active.size === 0) return 0;
    return Math.round((activeFeeds.length / Math.max(active.size, 1)) * 100);
  }, [activeFeeds, active.size]);

  const scoreColor = leverageScore >= 75 ? '#4ade80' : leverageScore >= 40 ? '#fcd34d' : '#fb923c';
  const scoreLabel = leverageScore >= 75 ? 'High' : leverageScore >= 40 ? 'Moderate' : 'Low';

  const renderArcCard = (arc) => {
    const state = arcState[arc.id];
    const isInactive = state === 'inactive';
    return (
      <div
        key={arc.id}
        className={`tier-arc ${isInactive ? 'inactive' : ''} ${state === 'compounding' ? 'compounding' : ''} ${state === 'isolated' ? 'isolated' : ''}`}
        style={{ ['--ta-accent']: arc.accent }}
        onClick={() => toggle(arc.id)}
      >
        <div className="tier-arc-bar" />
        <div>
          <div className="tier-arc-name">
            The <em>{arc.em}</em>.
          </div>
          <div className="tier-arc-degrees">
            <span className="deg-out">→ {arc.feedsInto.length} out</span>
            <span>← {arc.fedBy.length} in</span>
          </div>
        </div>
        {!isInactive && state === 'compounding' && <div className="tier-arc-flag flag-compound">cmpd</div>}
        {!isInactive && state === 'isolated' && <div className="tier-arc-flag flag-isolated">iso</div>}
        {isInactive && arc.lane === 'A' && <div className="tier-arc-flag flag-laneA">A</div>}
        {isInactive && arc.lane === 'B' && <div className="tier-arc-flag flag-laneB">B</div>}
      </div>
    );
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header stagger">
            <div>
              <p className="kicker"><Compass size={12} /> Learning Ops // Structural Layer</p>
              <h1 className="title-serif">The <em>Compounding</em>.</h1>
              <p className="title-sub">
                The selector enumerates cross-feeds. This artifact shows their structure. Twenty-seven
                arcs sort into three tiers by feed pattern: Sources produce leverage, Sinks aggregate
                value, Bidirectional sits between. The leverage shows up in deliberate combinations
                across tiers — not in stacking one tier.
              </p>
            </div>
            <div className="meta">
              <div>Selected <strong>{active.size} / 27</strong></div>
              <div style={{ marginTop: 4 }}>Active feeds <strong>{activeFeeds.length}</strong></div>
              <div style={{ marginTop: 4 }}>Isolated <strong>{isolatedArcs.length}</strong></div>
              <div style={{ marginTop: 4 }}>Score <strong>{leverageScore}% {scoreLabel}</strong></div>
            </div>
          </div>

          {/* TOGGLE STRIP */}
          <div className="toggle-strip">
            <div className="toggle-label">Selection</div>
            {ARCS.map(arc => {
              const isActive = active.has(arc.id);
              return (
                <button
                  key={arc.id}
                  className={`arc-pill ${isActive ? 'active' : ''}`}
                  style={{ ['--ap-accent']: arc.accent }}
                  onClick={() => toggle(arc.id)}
                >
                  <span className="arc-pill-dot" />
                  {arc.em}
                </button>
              );
            })}
          </div>

          {/* LAYOUT */}
          <div className="layout">

            <div>
              {/* TIERS */}
              <div className="tiers">
                {['sources', 'bidir', 'sinks'].map(tierKey => {
                  const tier = TIER_DEFS[tierKey];
                  const arcs = tieredArcs[tierKey];
                  const activeCount = arcs.filter(a => active.has(a.id)).length;
                  const Icon = tier.icon;
                  return (
                    <div key={tierKey} className="tier" style={{ ['--tier-color']: tier.color }}>
                      <div className="tier-head">
                        <Icon size={16} className="tier-icon" />
                        <div>
                          <div className="tier-label">{tier.label}</div>
                          <div className="tier-sub">{tier.sub}</div>
                        </div>
                        <div className="tier-count">
                          <strong>{activeCount}</strong>/{arcs.length}
                        </div>
                      </div>
                      <div className="tier-desc">{tier.desc}</div>
                      <div className="tier-arcs">
                        {arcs.map(renderArcCard)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ACTIVE COMPOUNDING */}
              <div className="compounding-panel">
                <div className="cp-head">
                  <div>
                    <div className="cp-title">Active <em>compounding</em>.</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-dim)', marginTop: 6, letterSpacing: 0.06 }}>
                      Cross-arc feeds inside your current selection.
                    </div>
                  </div>
                  <div className="cp-count">
                    {activeFeeds.length}<span className="cp-count-unit">feeds</span>
                  </div>
                </div>

                {activeFeeds.length === 0 ? (
                  <div className="feeds-empty">
                    No cross-arc feeds in this selection. Either you're running pure Tier 1 sources (capability without showcase surface) or pure Tier 3 sinks (surface without capability) — both miss the compounding. Add a mid-tier arc that bridges what you have.
                  </div>
                ) : (
                  <div className="feeds-grid">
                    {activeFeeds.map((f, i) => (
                      <div
                        key={i}
                        className="feed-card"
                        style={{ ['--feed-from']: f.from.accent, ['--feed-to']: f.to.accent }}
                      >
                        <div className="feed-from-name">
                          The <em>{f.from.em}</em>.
                        </div>
                        <ArrowRight size={14} className="feed-arrow" />
                        <div className="feed-to-name">
                          The <em>{f.to.em}</em>.
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="sidebar">

              {/* LEVERAGE SCORE */}
              <div className="score-card">
                <div className="stat-label">
                  <TrendingUp size={9} /> Leverage score
                </div>
                <div className="score-value">
                  {leverageScore}<span className="score-unit">%</span>
                </div>
                <div className="score-bar">
                  <div
                    className="score-bar-fill"
                    style={{ width: `${Math.min(100, leverageScore)}%`, ['--sb-color']: scoreColor }}
                  />
                </div>
                <div className="score-meta">
                  <strong style={{ color: scoreColor }}>{scoreLabel}</strong> compounding —
                  {' '}{activeFeeds.length} feed{activeFeeds.length === 1 ? '' : 's'} across {active.size} selected arc{active.size === 1 ? '' : 's'}.
                  Score is feeds-per-arc; ≥75% means most selected arcs are connected through the portfolio.
                </div>
              </div>

              {/* ISOLATED ARCS */}
              <div className="isolated-panel">
                <div className="stat-label">
                  <AlertCircle size={9} /> Isolated arcs ({isolatedArcs.length})
                </div>
                {isolatedArcs.length === 0 ? (
                  <div className="empty-panel-text">
                    All selected arcs have at least one cross-feed inside the selection. Clean portfolio structure.
                  </div>
                ) : (
                  <>
                    <div className="empty-panel-text" style={{ marginBottom: 6 }}>
                      Selected but no feed in or out of other selected arcs. These run standalone — fine if intentional, costly if it's drift.
                    </div>
                    {isolatedArcs.map(arc => (
                      <div
                        key={arc.id}
                        className="isolated-row"
                        style={{ ['--ir-accent']: arc.accent }}
                      >
                        <div className="isolated-bar" />
                        <div className="isolated-name">
                          The <em>{arc.em}</em>.
                        </div>
                        <div className="isolated-tag">{tierOf(arc) === 'sources' ? 'src' : tierOf(arc) === 'sinks' ? 'snk' : 'bid'}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* SUGGESTIONS */}
              <div className="suggest-panel">
                <div className="stat-label">
                  <Lightbulb size={9} /> Unlock compounding
                </div>
                {suggestions.length === 0 ? (
                  <div className="empty-panel-text">
                    No high-leverage additions available — either the selection is already dense, or the remaining arcs don't connect to your current picks at ≥2 connections. Try toggling more arcs to expand candidates.
                  </div>
                ) : (
                  <>
                    <div className="empty-panel-text" style={{ marginBottom: 6 }}>
                      Arcs not currently selected that would activate ≥2 cross-feeds with your selection if added.
                    </div>
                    {suggestions.map(({ arc, connections }) => (
                      <div
                        key={arc.id}
                        className="suggest-row"
                        style={{ ['--ir-accent']: arc.accent }}
                        onClick={() => toggle(arc.id)}
                      >
                        <div className="isolated-bar" />
                        <div className="isolated-name">
                          The <em>{arc.em}</em>.
                        </div>
                        <div className="suggest-conns">+{connections}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>

            </div>
          </div>

          {/* CLAIMS */}
          <div className="claims">
            <h4><Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />How the tiers were derived + what to do with them</h4>
            <ul>
              <li>
                <strong>Tier classification is mechanical, not editorial.</strong> Sources = ≥2 out-feeds and ≤1 in-feed. Sinks = ≥2 in-feeds and ≤1 out-feed. Bidirectional = everything else. The thresholds are tuned so the three tiers are roughly balanced. An arc can sit in a tier that "feels wrong" intuitively (Practitioner is in Bidirectional because it has zero connections, not because it's bridging) — read the in/out counts on each card before drawing conclusions.
              </li>
              <li>
                <strong>The structural insight is that Brand and Partner are aggregate sinks.</strong> Brand has nine arcs feeding into it; Partner has ten. They are not "more important" than other arcs — they are the surface where the portfolio becomes legible to the world. A portfolio with no sinks is invisible to outsiders. A portfolio with sinks but no sources is hollow.
              </li>
              <li>
                <strong>The leverage score is feeds-per-arc, not feeds-total.</strong> A 4-arc portfolio with 4 feeds (1.00 ratio) scores higher than an 8-arc portfolio with 4 feeds (0.50 ratio), even though the second has more raw connections. This is deliberate — what matters is whether the arcs in your portfolio are talking to each other, not the absolute count of edges.
              </li>
              <li>
                <strong>Isolated arcs are not failures — they are choices to surface.</strong> An arc with zero cross-feeds in the current selection still produces value on its own. But if Kyle runs an isolated arc, it should be because the arc itself is worth the load, not because he didn't realize it was running standalone. The "iso" flag is information, not judgment.
              </li>
              <li>
                <strong>Suggestions surface ≥2-connection unlocks, ranked.</strong> The threshold is deliberate — a single-connection addition isn't worth the load. Two-connection additions start producing portfolio-level compounding. Three+ are high-leverage. Click any suggestion to toggle it into the selection and watch the score update.
              </li>
              <li>
                <strong>What this analyzer doesn't model:</strong> the strength of each feed (some are stronger than others — Eval → Brand is much more direct than Cloudflare → MCP), the timing of feeds (some require capstone-level work in the source arc before they activate), and the personal cost of running an isolated arc. The graph is structural; the weights are not modeled. For now: presence/absence of feeds is the signal. Weighted graphs are v2.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
