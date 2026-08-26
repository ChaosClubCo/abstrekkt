import React, { useState, useMemo } from 'react';
import { AlertTriangle, Plus, X, Lock, Unlock, ArrowUpDown, Zap } from 'lucide-react';

const LANES = {
  ff:     { em: 'FlashFusion',  accent: '#7c3aed' },
  ccc:    { em: 'ChaosClubCo',  accent: '#e11d48' },
  memoir: { em: 'Memoir',       accent: '#b89968' },
  cross:  { em: 'Cross-lane',   accent: '#94a3b8' },
};

// WSJF: (Lane Strategic Value + Time Criticality + Risk Reduction) / Job Size
// Fibonacci scale: 1, 2, 3, 5, 8, 13

const SEED_BLOCKERS = [
  {
    id: 'continuum',
    title: 'Continuum Supabase bill overdue',
    detail: 'Production project at risk. Last good prod deploy was PR #112 (Mar 23). Vercel GitHub App connection broken — manual reconnect needed after bill resolved. Do not recommend Supabase-dependent features until clear.',
    lane: 'cross', lsv: 8, tc: 13, rr: 13, size: 3,
    status: 'open', owner: 'Kyle',
  },
  {
    id: 'free-assess',
    title: 'FreeAssessment flow end-to-end validation',
    detail: 'Gates Ryan Anderskow audit delivery and all subsequent paid audits. If the flow has a silent failure, the M1 gate slips and Q1 revenue math breaks.',
    lane: 'ff', lsv: 13, tc: 8, rr: 8, size: 2,
    status: 'open', owner: 'Kyle',
  },
  {
    id: 'skills-gaps',
    title: 'Skills Library — 4 compliance gaps',
    detail: 'Missing "Use when..." triggers, version not nested under metadata, hooks on claude.ai skills, allowed-tools not least-privilege. Fix-before-expand rule active — no new skills until gaps closed. Gates FF M8 productization.',
    lane: 'ff', lsv: 5, tc: 5, rr: 8, size: 5,
    status: 'open', owner: 'Kyle',
  },
  {
    id: 'lafu-partnership',
    title: 'Lafu partnership formalization',
    detail: 'FF technical co-founder relationship is informal. Prior working relationship at cstmprnt (Waukegan) but no equity/role/IP agreement yet. Verify IP assignment language before INT subcontract Phase 2 (Phase 2 is out of project scope but the IP cleanliness matters).',
    lane: 'ff', lsv: 8, tc: 3, rr: 8, size: 8,
    status: 'open', owner: 'Kyle + Lafu',
  },
  {
    id: 'michael-journal',
    title: 'Michael journal — attorney review',
    detail: 'Highest legal risk in memoir manuscript. Must happen at M11 before any publication or query letter. Pseudonym-only policy until written releases for all living people referenced; Michael journal sections require attorney sign-off specifically.',
    lane: 'memoir', lsv: 8, tc: 5, rr: 13, size: 3,
    status: 'open', owner: 'Kyle + attorney',
  },
  {
    id: 'cf-cname',
    title: 'Cloudflare CNAME for client.flashfusion.co',
    detail: 'Operational ops CRM at client.flashfusion.co needs DNS configured. audit.flashfusion.co is live (CNAME to Base44); client subdomain still pending.',
    lane: 'ff', lsv: 3, tc: 3, rr: 5, size: 1,
    status: 'open', owner: 'Kyle',
  },
  {
    id: 'mp-distribution',
    title: 'Marketplace distribution strategy decision',
    detail: '244 plugins built and installable. Zero distribution motion. M1 of ChaosClubCo arc picks the launch path (marketplace listing vs blog launch vs Anthropic partnership). Decision blocks all Q1 downstream sprints.',
    lane: 'ccc', lsv: 8, tc: 5, rr: 5, size: 3,
    status: 'open', owner: 'Kyle',
  },
  {
    id: 'ample-scope',
    title: 'Ample v1 scope lock',
    detail: 'Repo exists. Figma file exists. What v1 actually is hasn\'t been decided. M4 forces the decision but earlier resolution unblocks earlier shipping. WSJF impact: medium until M3 then escalates.',
    lane: 'ccc', lsv: 5, tc: 3, rr: 5, size: 3,
    status: 'open', owner: 'Kyle',
  },
  {
    id: 'session-3',
    title: 'Tool Archaeology — Session 3 unrun',
    detail: 'Highest-leverage memoir excavation item per project state — unblocks three chapters simultaneously. M1 gate of the memoir arc. Session structure exists; the session itself hasn\'t happened.',
    lane: 'memoir', lsv: 13, tc: 5, rr: 13, size: 2,
    status: 'open', owner: 'Kyle',
  },
  {
    id: 'exception-leak',
    title: 'Exception pricing leak monitor',
    detail: 'Ryan Anderskow\'s $3,000 case-study trade is documented as one-time. If the $4,500 floor leaks to a second prospect, the entire FF pricing model collapses. Not a one-time blocker; a continuous discipline check.',
    lane: 'ff', lsv: 8, tc: 8, rr: 13, size: 1,
    status: 'monitor', owner: 'Kyle',
  },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
* { box-sizing: border-box; }
:root { --bg: #0c0d10; --bg-2: #14161b; --bg-3: #1c1f29; --fg: #e8e9ed; --fg-dim: #8a8f9a; --fg-mute: #555a65; --border: #1f2229; --border-bright: #2c303a; }
body, .root { margin: 0; background: var(--bg); color: var(--fg); font-family: 'JetBrains Mono', monospace; font-size: 13.5px; line-height: 1.55; }
.root { min-height: 100vh; padding: 48px 24px 96px; background: radial-gradient(ellipse 80% 40% at 50% -10%, rgba(203,213,225,0.04), transparent 60%), var(--bg); }
.container { max-width: 1280px; margin: 0 auto; }
.header { display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end; padding-bottom: 24px; border-bottom: 1px solid var(--border); margin-bottom: 28px; }
.kicker { font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em; color: var(--fg-dim); margin: 0 0 14px; display: flex; align-items: center; gap: 8px; }
.title { font-family: 'Instrument Serif', serif; font-size: clamp(38px, 5.4vw, 64px); line-height: 0.96; letter-spacing: -0.02em; margin: 0; font-weight: 400; }
.title em { color: #cbd5e1; font-style: italic; }
.title-sub { font-size: 13px; color: var(--fg-dim); margin: 12px 0 0; max-width: 62ch; line-height: 1.65; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.14em; }
.meta strong { color: var(--fg); font-weight: 500; }

.controls { display: flex; align-items: center; gap: 14px; padding: 12px 18px; background: var(--bg-2); border: 1px solid var(--border); margin-bottom: 16px; flex-wrap: wrap; }
.ctrl-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); }
.lane-pills { display: flex; gap: 4px; }
.pill { padding: 5px 11px; background: var(--bg-3); border: 1px solid var(--border-bright); color: var(--fg-dim); cursor: pointer; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; }
.pill.active { color: var(--fg); }
.pill.active.ff { border-color: #7c3aed; color: #a78bfa; }
.pill.active.ccc { border-color: #e11d48; color: #fb7185; }
.pill.active.memoir { border-color: #b89968; color: #d4b88a; }
.pill.active.cross { border-color: #94a3b8; color: #cbd5e1; }
.pill.active.all { border-color: #cbd5e1; color: #fff; }
.sort-toggle { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: var(--bg-3); border: 1px solid var(--border-bright); color: var(--fg-dim); cursor: pointer; margin-left: auto; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; }
.sort-toggle.active { color: var(--fg); }

.table { background: var(--bg-2); border: 1px solid var(--border); }
.table-head { display: grid; grid-template-columns: 60px 1fr 100px 100px 80px 80px; gap: 12px; padding: 12px 18px; background: var(--bg-3); border-bottom: 1px solid var(--border); font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); font-weight: 500; }
.row { display: grid; grid-template-columns: 60px 1fr 100px 100px 80px 80px; gap: 12px; padding: 16px 18px; border-bottom: 1px solid var(--border); align-items: start; cursor: pointer; transition: background 0.12s; }
.row:hover { background: rgba(255,255,255,0.015); }
.row:last-child { border-bottom: none; }
.row.expanded { background: rgba(255,255,255,0.02); }
.row.resolved { opacity: 0.45; }

.score { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 26px; line-height: 1; color: var(--sc-color); font-weight: 400; }

.row-title { display: grid; gap: 4px; }
.title-text { font-size: 13px; color: var(--fg); line-height: 1.4; font-weight: 500; }
.row.resolved .title-text { text-decoration: line-through; text-decoration-color: rgba(255,255,255,0.2); }
.title-meta { font-size: 10px; color: var(--fg-dim); display: flex; gap: 10px; align-items: center; }
.lane-tag { padding: 1px 6px; background: var(--lt-color); color: #fff; font-weight: 600; letter-spacing: 0.06em; font-size: 9px; text-transform: uppercase; }
.lane-tag.cross { background: #475569; }

.wsjf-cell { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--fg-dim); }
.wsjf-cell strong { color: var(--fg); font-weight: 600; }

.size-cell { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 18px; color: var(--fg-dim); text-align: center; font-weight: 400; }

.status-pill { padding: 4px 8px; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; text-align: center; background: transparent; border: 1px solid; cursor: pointer; }
.status-pill.open { border-color: #fb923c; color: #fb923c; }
.status-pill.monitor { border-color: #fcd34d; color: #fcd34d; }
.status-pill.progress { border-color: #60a5fa; color: #60a5fa; }
.status-pill.resolved { border-color: #4ade80; color: #4ade80; }

.expand { grid-column: 1 / -1; padding: 14px 0 4px 60px; }
.expand-detail { padding: 12px 16px; background: var(--bg-3); font-size: 12px; color: var(--fg-dim); line-height: 1.65; border-left: 2px solid var(--sc-color); margin-bottom: 12px; }
.expand-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 12px; }
.expand-stat { padding: 10px; background: var(--bg-3); border-left: 2px solid var(--sc-color); }
.expand-stat-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fg-mute); margin-bottom: 4px; }
.expand-stat-value { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 22px; color: var(--fg); line-height: 1; font-weight: 400; }

.legend { margin-top: 28px; padding: 16px 20px; background: var(--bg-2); border: 1px solid var(--border); display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 18px; }
.legend-block { font-size: 11px; color: var(--fg-dim); line-height: 1.6; }
.legend-block strong { color: var(--fg); display: block; margin-bottom: 4px; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; font-weight: 500; }

.claims { margin-top: 28px; padding: 22px; border: 1px solid var(--border); background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7; }
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }
.claims strong { color: var(--fg); font-weight: 500; }

@media (max-width: 1000px) {
  .table-head, .row { grid-template-columns: 50px 1fr 80px 80px; }
  .col-hide { display: none; }
  .legend { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 700px) {
  .table-head, .row { grid-template-columns: 50px 1fr 70px; }
  .col-hide-sm { display: none; }
  .header { grid-template-columns: 1fr; }
  .meta { text-align: left; }
}
`;

function computeScore(b) {
  return ((b.lsv + b.tc + b.rr) / b.size).toFixed(1);
}

function scoreColor(score) {
  const s = parseFloat(score);
  if (s >= 10) return '#ef4444';
  if (s >= 6) return '#fb923c';
  if (s >= 3) return '#fcd34d';
  return '#94a3b8';
}

const STATUS_ORDER = ['open', 'monitor', 'progress', 'resolved'];
function cycleStatus(s) {
  const i = STATUS_ORDER.indexOf(s);
  return STATUS_ORDER[(i + 1) % STATUS_ORDER.length];
}

export default function LaneBlockers() {
  const [blockers, setBlockers] = useState(SEED_BLOCKERS);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    let list = blockers.map(b => ({ ...b, score: computeScore(b) }));
    if (filter !== 'all') list = list.filter(b => b.lane === filter);
    if (sortBy === 'score') list.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
    else if (sortBy === 'lane') list.sort((a, b) => a.lane.localeCompare(b.lane));
    return list;
  }, [blockers, filter, sortBy]);

  const updateStatus = (id) => {
    setBlockers(prev => prev.map(b => b.id === id ? { ...b, status: cycleStatus(b.status) } : b));
  };

  const stats = useMemo(() => {
    const open = blockers.filter(b => b.status === 'open').length;
    const high = blockers.filter(b => parseFloat(computeScore(b)) >= 10 && b.status !== 'resolved').length;
    const total = blockers.length;
    return { open, high, total };
  }, [blockers]);

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">
          <div className="header">
            <div>
              <p className="kicker"><AlertTriangle size={12} /> Execution Layer // Cross-Lane Blocker Tracker</p>
              <h1 className="title">The <em>Blockers</em>.</h1>
              <p className="title-sub">Everything currently gating forward motion across the three lanes, scored by WSJF — (Strategic Value + Time Criticality + Risk Reduction) / Job Size. Higher score = work this first. Pre-populated with known blockers as of project state. Click a row to expand the WSJF breakdown; click the status pill to cycle.</p>
            </div>
            <div className="meta">
              <div>Total <strong>{stats.total}</strong></div>
              <div style={{ marginTop: 4 }}>Open <strong>{stats.open}</strong></div>
              <div style={{ marginTop: 4 }}>High-WSJF <strong style={{ color: '#ef4444' }}>{stats.high}</strong></div>
            </div>
          </div>

          <div className="controls">
            <span className="ctrl-label">Lane</span>
            <div className="lane-pills">
              <button className={`pill all ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
              {Object.entries(LANES).map(([key, l]) => (
                <button key={key} className={`pill ${key} ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>{l.em}</button>
              ))}
            </div>
            <button className={`sort-toggle ${sortBy === 'score' ? 'active' : ''}`} onClick={() => setSortBy(s => s === 'score' ? 'lane' : 'score')}>
              <ArrowUpDown size={11} />
              Sort: {sortBy === 'score' ? 'WSJF score' : 'Lane'}
            </button>
          </div>

          <div className="table">
            <div className="table-head">
              <div>WSJF</div>
              <div>Blocker</div>
              <div className="col-hide">Score breakdown</div>
              <div className="col-hide-sm">Owner</div>
              <div className="col-hide">Size</div>
              <div>Status</div>
            </div>
            {filtered.map(b => {
              const lane = LANES[b.lane];
              const isExp = expanded === b.id;
              const sc = scoreColor(b.score);
              return (
                <React.Fragment key={b.id}>
                  <div className={`row ${isExp ? 'expanded' : ''} ${b.status === 'resolved' ? 'resolved' : ''}`} style={{ ['--sc-color']: sc, ['--lt-color']: lane.accent }} onClick={() => setExpanded(isExp ? null : b.id)}>
                    <div className="score">{b.score}</div>
                    <div className="row-title">
                      <div className="title-text">{b.title}</div>
                      <div className="title-meta">
                        <span className={`lane-tag ${b.lane}`}>{lane.em}</span>
                      </div>
                    </div>
                    <div className="wsjf-cell col-hide">
                      LSV <strong>{b.lsv}</strong> · TC <strong>{b.tc}</strong> · RR <strong>{b.rr}</strong>
                    </div>
                    <div className="wsjf-cell col-hide-sm">{b.owner}</div>
                    <div className="size-cell col-hide">{b.size}</div>
                    <div>
                      <button className={`status-pill ${b.status}`} onClick={(e) => { e.stopPropagation(); updateStatus(b.id); }}>{b.status}</button>
                    </div>
                  </div>
                  {isExp && (
                    <div className="expand">
                      <div className="expand-detail">{b.detail}</div>
                      <div className="expand-grid">
                        <div className="expand-stat"><div className="expand-stat-label">Strategic value</div><div className="expand-stat-value">{b.lsv}</div></div>
                        <div className="expand-stat"><div className="expand-stat-label">Time criticality</div><div className="expand-stat-value">{b.tc}</div></div>
                        <div className="expand-stat"><div className="expand-stat-label">Risk reduction</div><div className="expand-stat-value">{b.rr}</div></div>
                        <div className="expand-stat"><div className="expand-stat-label">Job size</div><div className="expand-stat-value">{b.size}</div></div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="legend">
            <div className="legend-block">
              <strong>Score color</strong>
              <span style={{ color: '#ef4444' }}>●</span> ≥ 10 critical · <span style={{ color: '#fb923c' }}>●</span> 6-9 high · <span style={{ color: '#fcd34d' }}>●</span> 3-5 medium · <span style={{ color: '#94a3b8' }}>●</span> &lt; 3 low
            </div>
            <div className="legend-block">
              <strong>Fibonacci scale</strong>
              1, 2, 3, 5, 8, 13 for LSV, TC, RR, and Size. Inflating values to justify priority is the failure mode — calibrate against actual revenue / chapter / product outcomes.
            </div>
            <div className="legend-block">
              <strong>Status pills</strong>
              Click to cycle: open → monitor → progress → resolved. "Monitor" = continuous discipline (no fix, just watch).
            </div>
            <div className="legend-block">
              <strong>Lane discipline</strong>
              Cross-lane blockers (infrastructure, capital, capacity) get the gray tag. Lane-specific blockers carry the lane's accent. Filter by lane to scope.
            </div>
          </div>

          <div className="claims">
            <h4>Tracker logic + caveats</h4>
            <ul>
              <li><strong>Seed list is current as of project state.</strong> Ten blockers populated — six lane-specific, one cross-lane infrastructure (Continuum), three continuous-discipline items (exception leak monitor, marketplace decision, Tool Archaeology). Edit / remove / add as situation evolves.</li>
              <li><strong>WSJF is a sorting heuristic, not a decision rule.</strong> A score of 12.7 doesn't mean "do this immediately"; it means "this should outrank a 4.2 unless there's an explicit reason." Honest scoring beats clever scoring.</li>
              <li><strong>Job Size is the most-cheated component.</strong> A blocker with a true 2-week scope rated as a "5" (1-2 days) inflates the WSJF score artificially. The discipline is honest sizing, even when it means a high-strategic-value blocker doesn't surface to the top.</li>
              <li><strong>Continuous-discipline blockers ("monitor" status)</strong> should not be sorted by raw score — they\'re always there. Exception leak monitor is permanently a top-3 concern even at WSJF 29; the value is the watch, not the resolution.</li>
              <li><strong>Pre-populated blockers reflect Kyle\'s current ground truth as of project state.</strong> Continuum Supabase bill is the highest-WSJF item because it blocks multiple downstream things and is small to resolve (pay the bill). Tool Archaeology is high because it unblocks three memoir chapters.</li>
              <li><strong>Not modeled:</strong> blocker history (when discovered, when first scored, how the score changed), automatic propagation when a blocker resolution unblocks something downstream, state persistence between sessions, integration with the dashboard\'s gate state.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
