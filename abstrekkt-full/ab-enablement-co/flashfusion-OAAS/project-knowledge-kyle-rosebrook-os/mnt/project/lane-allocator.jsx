import React, { useState, useMemo } from 'react';
import { Compass, AlertTriangle, Zap } from 'lucide-react';

const LANES = [
  {
    id: 'ff', em: 'FlashFusion', accent: '#7c3aed', surface: 'rgba(124,58,237,0.06)',
    fullHours: 24, maintHours: 8,
    quarters: { Q1: 'Audit motion validated · floor pricing held', Q2: 'Sprint motion launched · $5K fixed validated', Q3: 'Retainer + recurring revenue established', Q4: 'vCAIO sale + Y2 planning' },
    peakWeeks: [
      { m: 5, w: 1, label: 'Sprint #1 W1 delivery' },
      { m: 5, w: 4, label: 'Sprint #1 handoff + case study' },
      { m: 9, w: 1, label: 'Retainer #1 onboarding' },
      { m: 11, w: 3, label: 'vCAIO negotiation' },
    ],
  },
  {
    id: 'ccc', em: 'ChaosClubCo', accent: '#e11d48', surface: 'rgba(225,29,72,0.06)',
    fullHours: 14, maintHours: 5,
    quarters: { Q1: 'Marketplace distribution launched', Q2: 'Ample MVP shipped to closed beta', Q3: 'FissionPrompt + portfolio thesis tested', Q4: 'Consolidation + flagship decision' },
    peakWeeks: [
      { m: 2, w: 1, label: 'Marketplace launch day' },
      { m: 5, w: 4, label: 'Ample beta launch' },
      { m: 8, w: 2, label: 'FissionPrompt alpha' },
      { m: 11, w: 2, label: 'Flagship decision' },
    ],
  },
  {
    id: 'memoir', em: 'Memoir', accent: '#b89968', surface: 'rgba(184,153,104,0.06)',
    fullHours: 12, maintHours: 4,
    quarters: { Q1: 'Excavation completion (13 tasks)', Q2: 'First draft begins (5 chapters)', Q3: 'First draft completes end-to-end', Q4: 'Revision + agent path decision' },
    peakWeeks: [
      { m: 1, w: 2, label: 'Tool Archaeology session run' },
      { m: 4, w: 2, label: 'Opening chapter first draft' },
      { m: 9, w: 1, label: 'Final chapter draft' },
      { m: 11, w: 3, label: 'Attorney review (Michael journal)' },
    ],
  },
];

const PACES = {
  full:  { label: 'Full',        hoursKey: 'fullHours' },
  maint: { label: 'Maintenance', hoursKey: 'maintHours' },
  pause: { label: 'Paused',      hoursKey: null },
};

const BANDS = [
  { max: 30, label: 'Light',         color: '#4ade80', note: 'Sustainable. Under-allocated against ambitions; expect slipping gates.' },
  { max: 45, label: 'Balanced',      color: '#fcd34d', note: 'Honest capacity for full-time job + family. Sustainable for 8-12 months.' },
  { max: 55, label: 'Aggressive',    color: '#fb923c', note: 'Sustainable 3-4 months max. Past that, one lane slips or family/health absorbs the cost.' },
  { max: 999,label: 'Unsustainable', color: '#ef4444', note: 'Not workable. Two lanes need to drop to maintenance or the math breaks.' },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
* { box-sizing: border-box; }
:root { --bg: #0c0d10; --bg-2: #14161b; --bg-3: #1c1f29; --fg: #e8e9ed; --fg-dim: #8a8f9a; --fg-mute: #555a65; --border: #1f2229; --border-bright: #2c303a; }
body, .root { margin: 0; background: var(--bg); color: var(--fg); font-family: 'JetBrains Mono', monospace; font-size: 14px; line-height: 1.55; }
.root { min-height: 100vh; padding: 48px 24px 96px; background: radial-gradient(ellipse 80% 40% at 50% -10%, rgba(203,213,225,0.04), transparent 60%), var(--bg); }
.container { max-width: 1240px; margin: 0 auto; }
.header { display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end; padding-bottom: 24px; border-bottom: 1px solid var(--border); margin-bottom: 32px; }
.kicker { font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em; color: var(--fg-dim); margin: 0 0 14px; display: flex; align-items: center; gap: 8px; }
.title { font-family: 'Instrument Serif', serif; font-size: clamp(38px, 5.4vw, 64px); line-height: 0.96; letter-spacing: -0.02em; margin: 0; font-weight: 400; }
.title em { color: #cbd5e1; font-style: italic; }
.title-sub { font-size: 13px; color: var(--fg-dim); margin: 14px 0 0; max-width: 60ch; line-height: 1.65; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.14em; }
.meta strong { color: var(--fg); font-weight: 500; }
.controls { padding: 14px 18px; background: var(--bg-2); border: 1px solid var(--border); margin-bottom: 24px; display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
.controls-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); }
.month-pick { display: flex; gap: 4px; flex-wrap: wrap; }
.mp-btn { padding: 6px 10px; background: var(--bg-3); border: 1px solid var(--border-bright); font-family: 'JetBrains Mono', monospace; color: var(--fg-dim); cursor: pointer; font-size: 10.5px; }
.mp-btn.active { color: var(--fg); border-color: #cbd5e1; }
.layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }
.lanes { display: grid; gap: 14px; }
.lane-card { border: 1px solid var(--border); background: var(--bg-2); border-left: 3px solid var(--lane-accent); }
.lane-card.paused { opacity: 0.45; }
.lane-head { padding: 16px 20px; display: grid; grid-template-columns: 1fr auto auto; gap: 18px; align-items: center; }
.lane-name { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 24px; color: var(--fg); line-height: 1; font-weight: 400; }
.lane-name em { color: var(--lane-accent); font-style: italic; }
.lane-hours { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 28px; color: var(--lane-accent); font-weight: 400; }
.lane-hours-unit { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--fg-dim); margin-left: 4px; font-style: normal; letter-spacing: 0.16em; text-transform: uppercase; }
.pace-toggle { display: flex; border: 1px solid var(--border-bright); }
.pace-btn { padding: 6px 12px; background: transparent; border: none; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-dim); }
.pace-btn.active { color: var(--bg); font-weight: 600; }
.lane-quarter { padding: 12px 20px; background: var(--lane-surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: center; }
.lane-q-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--lane-accent); font-weight: 500; }
.lane-q-focus { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 16px; color: var(--fg); line-height: 1.3; }
.lane-peaks { padding: 12px 20px; }
.peaks-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-mute); margin-bottom: 8px; }
.peak-row { display: grid; grid-template-columns: 60px 1fr; gap: 12px; padding: 5px 0; font-size: 11px; color: var(--fg-dim); }
.peak-row.collision { color: var(--fg); }
.peak-mw { font-family: 'JetBrains Mono', monospace; color: var(--lane-accent); font-weight: 600; }
.sidebar { position: sticky; top: 24px; display: grid; gap: 12px; }
.stat-card { border: 1px solid var(--border); background: var(--bg-2); padding: 16px; }
.stat-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
.stat-value { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 36px; line-height: 1; font-weight: 400; }
.stat-unit { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--fg-dim); font-style: normal; margin-left: 4px; }
.stat-band { margin-top: 10px; padding: 8px 10px; border-left: 2px solid var(--band-color); background: var(--band-bg); font-size: 11px; color: var(--fg); line-height: 1.5; }
.stat-band-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--band-color); font-weight: 500; margin-bottom: 4px; }
.coll-card { border: 1px solid var(--border); background: var(--bg-2); padding: 16px; }
.coll-row { padding: 9px 10px; margin-bottom: 6px; border-left: 2px solid #fb923c; background: rgba(251,146,60,0.06); font-size: 11px; line-height: 1.5; }
.coll-row:last-child { margin-bottom: 0; }
.coll-row strong { color: var(--fg); font-weight: 600; }
.coll-empty { font-size: 11px; color: var(--fg-dim); font-style: italic; line-height: 1.55; }
.claims { margin-top: 36px; padding: 22px; border: 1px solid var(--border); background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7; }
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }
.claims strong { color: var(--fg); font-weight: 500; }
@media (max-width: 960px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { position: static; }
  .header { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .lane-head { grid-template-columns: 1fr; gap: 12px; }
}
`;

export default function Allocator() {
  const [paces, setPaces] = useState({ ff: 'full', ccc: 'maint', memoir: 'maint' });
  const [month, setMonth] = useState(1);

  const setPace = (laneId, pace) => setPaces(prev => ({ ...prev, [laneId]: pace }));
  const quarter = `Q${Math.floor((month - 1) / 3) + 1}`;

  const laneHours = LANES.map(lane => {
    const pace = paces[lane.id];
    const def = PACES[pace];
    return { lane, pace, hours: def.hoursKey ? lane[def.hoursKey] : 0 };
  });
  const totalHours = laneHours.reduce((s, l) => s + l.hours, 0);
  const band = BANDS.find(b => totalHours <= b.max);

  const upcomingPeaks = useMemo(() => {
    const peaks = {};
    LANES.forEach(lane => {
      if (paces[lane.id] === 'pause') return;
      lane.peakWeeks.forEach(pw => {
        const key = `M${pw.m}W${pw.w}`;
        if (!peaks[key]) peaks[key] = [];
        peaks[key].push({ lane, label: pw.label });
      });
    });
    return peaks;
  }, [paces]);
  const collisions = Object.entries(upcomingPeaks).filter(([_, items]) => items.length >= 2);

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">
          <div className="header">
            <div>
              <p className="kicker"><Compass size={12} /> Execution Layer // Bandwidth Allocator</p>
              <h1 className="title">The <em>Allocator</em>.</h1>
              <p className="title-sub">Three lanes all run by design — the question is at what pace each one runs. Full / Maintenance / Paused per lane; the math reveals whether the allocation is honest or whether a lane is going to slip. Cross-lane peak weeks where capacity actually breaks surface separately.</p>
            </div>
            <div className="meta">
              <div>Total <strong>{totalHours}hrs/wk</strong></div>
              <div style={{marginTop: 4}}>Band <strong style={{color: band.color}}>{band.label}</strong></div>
              <div style={{marginTop: 4}}>Period <strong>M{month} · {quarter}</strong></div>
              <div style={{marginTop: 4}}>Active <strong>{laneHours.filter(l => l.hours > 0).length} of 3</strong></div>
            </div>
          </div>

          <div className="controls">
            <span className="controls-label">Period</span>
            <div className="month-pick">
              {Array.from({length: 12}).map((_, i) => (
                <button key={i} className={`mp-btn ${month === i+1 ? 'active' : ''}`} onClick={() => setMonth(i+1)}>M{i+1}</button>
              ))}
            </div>
          </div>

          <div className="layout">
            <div className="lanes">
              {laneHours.map(({ lane, pace, hours }) => (
                <div key={lane.id} className={`lane-card ${pace === 'pause' ? 'paused' : ''}`} style={{ ['--lane-accent']: lane.accent, ['--lane-surface']: lane.surface }}>
                  <div className="lane-head">
                    <div className="lane-name">The <em>{lane.em}</em>.</div>
                    <div className="pace-toggle">
                      {Object.entries(PACES).map(([k, def]) => (
                        <button key={k} className={`pace-btn ${pace === k ? 'active' : ''}`} onClick={() => setPace(lane.id, k)} style={pace === k ? { background: lane.accent } : {}}>{def.label}</button>
                      ))}
                    </div>
                    <div className="lane-hours">{hours}<span className="lane-hours-unit">hrs/wk</span></div>
                  </div>
                  <div className="lane-quarter">
                    <div className="lane-q-label">{quarter} focus</div>
                    <div className="lane-q-focus">{lane.quarters[quarter]}</div>
                  </div>
                  <div className="lane-peaks">
                    <div className="peaks-label">Peak weeks (capacity breakpoints)</div>
                    {lane.peakWeeks.map((pw, i) => {
                      const key = `M${pw.m}W${pw.w}`;
                      const isColl = upcomingPeaks[key]?.length >= 2;
                      return (
                        <div key={i} className={`peak-row ${isColl ? 'collision' : ''}`}>
                          <div className="peak-mw">M{pw.m} W{pw.w}</div>
                          <div>{pw.label}{isColl ? ' · ⚠ collision' : ''}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="sidebar">
              <div className="stat-card">
                <div className="stat-label"><Zap size={9} /> Combined load</div>
                <div className="stat-value" style={{ color: band.color }}>{totalHours}<span className="stat-unit">hrs/wk</span></div>
                <div className="stat-band" style={{ ['--band-color']: band.color, ['--band-bg']: `${band.color}10` }}>
                  <div className="stat-band-label">{band.label}</div>
                  {band.note}
                </div>
              </div>
              <div className="coll-card">
                <div className="stat-label"><AlertTriangle size={9} /> Cross-lane collisions ({collisions.length})</div>
                {collisions.length === 0 ? (
                  <div className="coll-empty">No multi-lane peak weeks in this pace configuration. Either active lanes don't peak together, or paused lanes have absorbed the conflicts.</div>
                ) : (
                  collisions.map(([key, items]) => (
                    <div key={key} className="coll-row">
                      <strong>{key}</strong> · {items.map(i => i.lane.em).join(' + ')} peak together. Pre-week renegotiation: which lane absorbs the slip.
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="claims">
            <h4>Allocator logic + caveats</h4>
            <ul>
              <li><strong>Full / Maintenance / Paused is the only allocation primitive.</strong> Halfway states ("a little bit of memoir this week") are the failure mode that produces drift; force the discrete choice.</li>
              <li><strong>Realistic project-work capacity ≈ 40-45 hrs/wk</strong> on top of full-time job, custody days, family time. Bands calibrated against this baseline.</li>
              <li><strong>Peak weeks are when capacity actually breaks</strong>, not just busy weeks. A collision = two or more lanes hit a peak in the same calendar week.</li>
              <li><strong>Default state (FF Full, CCC Maint, Memoir Maint) is the recommended Q1 setup.</strong> FF is revenue critical path; the others should not slip but should not steal bandwidth either.</li>
              <li><strong>Not modeled:</strong> Intinc job hours, family events, custody calendar specifics, energy variation, context-switching cost between lanes, the fact that creative work needs uninterrupted blocks while ops tolerates fragmentation.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
