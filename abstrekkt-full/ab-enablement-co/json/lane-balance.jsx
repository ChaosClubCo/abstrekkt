import React, { useState, useMemo } from 'react';
import { Layers, AlertTriangle, CheckCircle2, Circle, Compass } from 'lucide-react';

const LANES = [
  { id: 'ff', em: 'FlashFusion', accent: '#7c3aed', register: 'Consulting / revenue-oriented / hold-the-floor discipline' },
  { id: 'ccc', em: 'ChaosClubCo', accent: '#e11d48', register: 'Product / brand / distribution / ship-not-pillar' },
  { id: 'memoir', em: 'Memoir', accent: '#b89968', register: 'Literary / declarative / construction-not-recovery / letter to Kinsley' },
];

const VOICE_CHECKS = [
  { id: 'ff-mem', lane: 'ff', other: 'memoir', text: 'FF essay/copy borrowing memoir literary register — "the architecture of trust," "what it means to ship" — drift toward serif-mode sentences in client surfaces' },
  { id: 'ff-ccc', lane: 'ff', other: 'ccc', text: 'FF essay borrowing CCC brand-pillar voice — "embrace the mess," "chaos organized" — playful registers in consulting contexts' },
  { id: 'ccc-mem', lane: 'ccc', other: 'memoir', text: 'CCC content borrowing memoir gravitas — "what it means to build" in product copy — reflective when the surface needs operational' },
  { id: 'ccc-ff', lane: 'ccc', other: 'ff', text: 'CCC content borrowing FF consulting register — "service line maturity," "outcome-oriented" — selling instead of shipping' },
  { id: 'mem-ff', lane: 'memoir', other: 'ff', text: 'Memoir paragraph reading like FF essay — "the framework I developed," "the system I built" — consulting-as-narrator voice' },
  { id: 'mem-ccc', lane: 'memoir', other: 'ccc', text: 'Memoir paragraph reading like CCC content — "the chaos of those years," "embracing the mess" — brand-pillar phrases in literary work' },
];

const STRUCTURAL_CHECKS = [
  { id: 'exception', text: 'Has the $4,500 audit floor leaked to anyone besides Ryan? (Audit the exception list — should still be 1.)' },
  { id: 'kinsley', text: 'Has memoir excavation produced any content drafted for Kinsley\'s eyes specifically that ended up in public surfaces?' },
  { id: 'peer', text: 'Has any ChaosClubCo content drifted back toward peer-support / mental-health framing post-pivot?' },
  { id: 'intinc', text: 'Has any in-project artifact referenced Intinc by name, MSP framing, or named leadership (Daniel/Jackie/Dave)?' },
  { id: 'voice', text: 'Has any cross-lane content been published without re-reading for voice contamination?' },
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

.layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }

.panel { border: 1px solid var(--border); background: var(--bg-2); margin-bottom: 16px; }
.panel-head { padding: 16px 20px; border-bottom: 1px solid var(--border); display: grid; grid-template-columns: 1fr auto; gap: 14px; align-items: end; }
.panel-title { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 22px; color: var(--fg); font-weight: 400; line-height: 1; }
.panel-title em { color: #cbd5e1; }
.panel-sub { font-size: 11px; color: var(--fg-dim); margin-top: 4px; }
.panel-body { padding: 16px 20px; }

.balance-bars { display: grid; gap: 14px; }
.bar-row { display: grid; grid-template-columns: 140px 1fr 80px; gap: 16px; align-items: center; }
.bar-name { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 18px; color: var(--fg); }
.bar-name em { color: var(--br-accent); }
.bar-track { height: 32px; background: var(--bg-3); position: relative; border: 1px solid var(--border); }
.bar-fill { position: absolute; top: 0; left: 0; bottom: 0; background: var(--br-accent); opacity: 0.7; transition: width 0.4s ease; display: flex; align-items: center; padding: 0 10px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--bg); font-weight: 600; }
.bar-pct { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 22px; color: var(--br-accent); text-align: right; font-weight: 400; }

.balance-meta { margin-top: 18px; padding: 12px 16px; background: var(--bg-3); border-left: 2px solid var(--bm-color); font-size: 12px; color: var(--fg); line-height: 1.6; }
.balance-meta-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--bm-color); font-weight: 500; margin-bottom: 5px; display: flex; align-items: center; gap: 6px; }

.month-input { display: grid; grid-template-columns: 100px 1fr 1fr 1fr; gap: 8px; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border); }
.month-input:last-child { border-bottom: none; }
.month-input-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--fg-dim); letter-spacing: 0.12em; }
.month-input input { background: var(--bg-3); border: 1px solid var(--border-bright); color: var(--fg); padding: 6px 10px; font-family: 'JetBrains Mono', monospace; font-size: 12px; width: 100%; text-align: center; }
.month-input input:focus { outline: none; border-color: var(--mi-accent); }
.month-input-head { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--mi-accent); text-align: center; font-weight: 600; padding: 6px 0; border-bottom: 1px solid var(--border); }

.check-row { display: grid; grid-template-columns: 16px 1fr; gap: 12px; align-items: start; padding: 10px 0; border-bottom: 1px solid var(--border); cursor: pointer; transition: opacity 0.15s; }
.check-row:last-child { border-bottom: none; }
.check-row:hover .check-text { color: var(--fg); }
.check-row.checked { opacity: 0.55; }
.check-row.checked .check-text { text-decoration: line-through; text-decoration-color: rgba(255,255,255,0.15); }
.check-box { width: 14px; height: 14px; border: 1.5px solid var(--cr-color); margin-top: 4px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.check-row.checked .check-box { background: var(--cr-color); }
.check-text { font-size: 12px; color: var(--fg-dim); line-height: 1.55; }
.check-arrow { font-family: 'Instrument Serif', serif; font-style: italic; color: var(--cr-color); font-weight: 500; }

.sidebar { position: sticky; top: 24px; display: grid; gap: 12px; }
.stat-card { border: 1px solid var(--border); background: var(--bg-2); padding: 16px; }
.stat-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
.stat-value { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 36px; line-height: 1; font-weight: 400; }
.stat-unit { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--fg-dim); font-style: normal; margin-left: 4px; }
.stat-meta { margin-top: 8px; font-size: 10.5px; color: var(--fg-dim); line-height: 1.55; }

.register-card { border: 1px solid var(--border); background: var(--bg-2); padding: 16px; border-left: 2px solid var(--rc-accent); margin-bottom: 8px; }
.register-name { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 18px; color: var(--fg); margin-bottom: 4px; line-height: 1; }
.register-name em { color: var(--rc-accent); }
.register-text { font-size: 11px; color: var(--fg-dim); line-height: 1.5; }

.claims { margin-top: 32px; padding: 22px; border: 1px solid var(--border); background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7; }
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }
.claims strong { color: var(--fg); font-weight: 500; }

@media (max-width: 960px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { position: static; }
  .header { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .bar-row { grid-template-columns: 1fr; }
  .month-input { grid-template-columns: 60px 1fr 1fr 1fr; gap: 4px; }
}
`;

export default function LaneBalance() {
  // Per-lane sprint counts (manually entered or derived from elsewhere)
  // Default: simulated honest state at end of Q1 with FF dominant
  const [counts, setCounts] = useState({
    ff: 11, ccc: 6, memoir: 5,
  });
  const [voiceChecks, setVoiceChecks] = useState(new Set());
  const [structChecks, setStructChecks] = useState(new Set());

  const setCount = (laneId, val) => {
    const n = parseInt(val) || 0;
    setCounts(prev => ({ ...prev, [laneId]: Math.max(0, Math.min(48, n)) }));
  };

  const stats = useMemo(() => {
    const total = counts.ff + counts.ccc + counts.memoir;
    const max = Math.max(counts.ff, counts.ccc, counts.memoir);
    const min = Math.min(counts.ff, counts.ccc, counts.memoir);
    const spread = max - min;
    const ratio = min > 0 ? (max / min).toFixed(2) : '∞';

    let balanceState;
    if (total === 0) balanceState = { label: 'No data', color: '#8a8f9a', note: 'Enter sprint counts per lane to assess balance.' };
    else if (spread <= 3) balanceState = { label: 'Balanced', color: '#4ade80', note: 'Three lanes running in honest proportion. Allocation is working.' };
    else if (spread <= 8) balanceState = { label: 'Drift', color: '#fcd34d', note: 'Mild imbalance. Watchable but not yet structural. Note in quarterly review.' };
    else balanceState = { label: 'Imbalance', color: '#fb923c', note: 'Material lane imbalance. One lane is absorbing bandwidth from the others. Reallocate before next quarter.' };

    const voiceTotal = VOICE_CHECKS.length;
    const voiceClean = VOICE_CHECKS.length - voiceChecks.size;
    return { total, max, min, spread, ratio, balanceState, voiceClean, voiceTotal };
  }, [counts, voiceChecks]);

  const toggleVoice = (id) => { setVoiceChecks(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); };
  const toggleStruct = (id) => { setStructChecks(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); };

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">
          <div className="header">
            <div>
              <p className="kicker"><Layers size={12} /> Execution Layer // Structural Audit</p>
              <h1 className="title">The <em>Balance</em>.</h1>
              <p className="title-sub">Three checks. Lane balance — are the three lanes running in honest proportion or has one absorbed the others. Voice contamination — has any cross-lane content drifted in register. Structural integrity — has anything leaked across the project's hard guardrails. Quarterly cadence; the audit you don't want to do is the one that matters.</p>
            </div>
            <div className="meta">
              <div>Sprints YTD <strong>{stats.total}</strong></div>
              <div style={{ marginTop: 4 }}>Spread <strong>{stats.spread}</strong></div>
              <div style={{ marginTop: 4 }}>Balance <strong style={{ color: stats.balanceState.color }}>{stats.balanceState.label}</strong></div>
              <div style={{ marginTop: 4 }}>Voice clean <strong>{stats.voiceClean}/{stats.voiceTotal}</strong></div>
            </div>
          </div>

          <div className="layout">
            <div>
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <div className="panel-title">Lane <em>balance</em>.</div>
                    <div className="panel-sub">Sprint counts per lane · year-to-date · honest entry, not aspirational</div>
                  </div>
                </div>
                <div className="panel-body">
                  <div className="balance-bars">
                    {LANES.map(lane => {
                      const c = counts[lane.id];
                      const pct = Math.round((c / 48) * 100);
                      return (
                        <div key={lane.id} className="bar-row" style={{ ['--br-accent']: lane.accent }}>
                          <div className="bar-name">The <em>{lane.em}</em>.</div>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${pct}%` }}>
                              {pct >= 8 && `${c}/48`}
                            </div>
                          </div>
                          <div className="bar-pct">{pct}%</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="balance-meta" style={{ ['--bm-color']: stats.balanceState.color }}>
                    <div className="balance-meta-label">{stats.balanceState.label}</div>
                    {stats.balanceState.note} · Spread {stats.spread} sprints · Max/min ratio {stats.ratio}.
                  </div>

                  <div style={{ marginTop: 18 }}>
                    <div className="month-input-head" style={{ ['--mi-accent']: '#cbd5e1', display: 'grid', gridTemplateColumns: '100px 1fr 1fr 1fr', gap: 8 }}>
                      <div style={{ textAlign: 'left' }}>Sprint count</div>
                      {LANES.map(l => <div key={l.id} style={{ color: l.accent }}>{l.em}</div>)}
                    </div>
                    <div className="month-input" style={{ ['--mi-accent']: '#cbd5e1' }}>
                      <div className="month-input-label">YTD total</div>
                      {LANES.map(l => (
                        <input key={l.id} type="number" min="0" max="48" value={counts[l.id]} onChange={e => setCount(l.id, e.target.value)} style={{ ['--mi-accent']: l.accent }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div>
                    <div className="panel-title">Voice <em>contamination</em> check.</div>
                    <div className="panel-sub">Honest audit — has any cross-lane content drifted in register since last review?</div>
                  </div>
                </div>
                <div className="panel-body">
                  {VOICE_CHECKS.map(check => {
                    const lane = LANES.find(l => l.id === check.lane);
                    const other = LANES.find(l => l.id === check.other);
                    const isChecked = voiceChecks.has(check.id);
                    return (
                      <div key={check.id} className={`check-row ${isChecked ? 'checked' : ''}`} style={{ ['--cr-color']: lane.accent }} onClick={() => toggleVoice(check.id)}>
                        <div className="check-box">
                          {isChecked && <CheckCircle2 size={10} color="#fff" />}
                        </div>
                        <div className="check-text">
                          <span style={{ color: lane.accent, fontWeight: 600 }}>{lane.em}</span>
                          <span className="check-arrow"> ← </span>
                          <span style={{ color: other.accent, fontWeight: 600 }}>{other.em}</span>
                          <span style={{ color: 'var(--fg-mute)', margin: '0 8px' }}>·</span>
                          {check.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div>
                    <div className="panel-title">Structural <em>integrity</em>.</div>
                    <div className="panel-sub">Has anything leaked across the project's hard guardrails?</div>
                  </div>
                </div>
                <div className="panel-body">
                  {STRUCTURAL_CHECKS.map(check => {
                    const isChecked = structChecks.has(check.id);
                    return (
                      <div key={check.id} className={`check-row ${isChecked ? 'checked' : ''}`} style={{ ['--cr-color']: '#fb923c' }} onClick={() => toggleStruct(check.id)}>
                        <div className="check-box">
                          {isChecked && <CheckCircle2 size={10} color="#fff" />}
                        </div>
                        <div className="check-text">{check.text}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="sidebar">
              <div className="stat-card">
                <div className="stat-label"><Layers size={9} /> Balance state</div>
                <div className="stat-value" style={{ color: stats.balanceState.color }}>{stats.balanceState.label}</div>
                <div className="stat-meta">Spread {stats.spread} sprints across lanes. {stats.balanceState.note}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label"><AlertTriangle size={9} /> Voice clean rate</div>
                <div className="stat-value">{stats.voiceClean}<span className="stat-unit">/ {stats.voiceTotal}</span></div>
                <div className="stat-meta">Six possible cross-lane voice bleeds. Honest count = number you haven't checked off because you found evidence.</div>
              </div>

              {LANES.map(lane => (
                <div key={lane.id} className="register-card" style={{ ['--rc-accent']: lane.accent }}>
                  <div className="register-name">The <em>{lane.em}</em>.</div>
                  <div className="register-text">{lane.register}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="claims">
            <h4>What this audit is for</h4>
            <ul>
              <li><strong>Quarterly cadence is the right frequency.</strong> Monthly is too noisy; annual is too late. The lane balance audit at quarter close is when allocation decisions actually get renegotiated.</li>
              <li><strong>Voice contamination is the hardest contamination to catch.</strong> Revenue leak (the $4,500 floor breaking) is loud; voice drift is silent. A FF essay reading like memoir or a memoir paragraph reading like FF doesn't show up in any other dashboard — only an explicit audit catches it.</li>
              <li><strong>Spread of ≤3 sprints across lanes is genuinely rare</strong> for someone running three lanes at the same time. ≤8 is normal drift; &gt;8 is structural. Don't expect equality every quarter; expect roughly proportional progress.</li>
              <li><strong>The structural integrity checks are project-specific.</strong> Intinc leak detection, peer-support framing drift on CCC, Kinsley-content leakage on memoir, exception-pricing leak on FF. These are the guardrails that can't soft-fail.</li>
              <li><strong>Checked = clean.</strong> Toggle each check after honest review. A row left unchecked means you haven't audited it OR you found evidence of bleed and are flagging it. Either way, the row stays unchecked until handled.</li>
              <li><strong>Not modeled:</strong> historical balance over time (would need to log quarterly counts), automated voice contamination detection (would require content corpus + classifier), integration with the dashboard's actual sprint completion state.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
