import React, { useState, useMemo } from 'react';
import { Plus, Trash2, ArrowUpDown, Briefcase, Layers, BookOpen, AlertTriangle, Compass, TrendingUp } from 'lucide-react';

const LANES = [
  { id: 'ff', name: 'FlashFusion', em: 'FlashFusion', accent: '#7c3aed', icon: Briefcase },
  { id: 'ccc', name: 'Abstrekkt Products', em: 'Abstrekkt Products', accent: '#34d399', icon: Layers },
  { id: 'memoir', name: 'Memoir', em: 'Memoir', accent: '#b89968', icon: BookOpen },
];

const FIBS = [1, 2, 3, 5, 8, 13];

const SCORE_GUIDES = {
  value: {
    label: 'Lane Strategic Value',
    help: 'How much this moves the lane\'s strategic spine — FF revenue, Products lane product/brand, Memoir chapter/thesis.',
    levels: ['1 = trivial', '2 = nice-to-have', '3 = useful', '5 = lane-significant', '8 = quarter-defining', '13 = year-defining'],
  },
  time: {
    label: 'Time Criticality',
    help: 'Penalty for delay — hard deadlines, market timing, momentum loss.',
    levels: ['1 = no pressure', '2 = comfortable', '3 = comfortable+', '5 = momentum risk', '8 = soft external dep', '13 = hard deadline'],
  },
  risk: {
    label: 'Risk Reduction',
    help: 'What this unblocks or de-risks downstream.',
    levels: ['1 = speculative', '2 = minor', '3 = reduces known risk', '5 = unblocks 1 item', '8 = unblocks 2 items', '13 = unblocks 3+ items'],
  },
  size: {
    label: 'Job Size',
    help: 'Honest estimate, not aspirational. Be skeptical of small estimates on memoir work.',
    levels: ['1 = 1-3 hrs', '2 = half day', '3 = 1-2 days', '5 = 3-5 days', '8 = 1-2 weeks', '13 = 2+ weeks'],
  },
};

const SEEDED = [
  { id: 's1', title: 'Ship Ryan audit + capture artifacts for case study #1', lane: 'ff', value: 13, time: 13, risk: 13, size: 5 },
  { id: 's2', title: 'Session 3 Tool Archaeology excavation', lane: 'memoir', value: 13, time: 5, risk: 13, size: 3 },
  { id: 's3', title: 'Marketplace distribution path decision', lane: 'ccc', value: 8, time: 5, risk: 5, size: 1 },
  { id: 's4', title: 'Skills Library compliance gap audit (4 gaps)', lane: 'ff', value: 5, time: 3, risk: 8, size: 3 },
  { id: 's5', title: 'Tom Ropel excavation session', lane: 'memoir', value: 8, time: 3, risk: 8, size: 3 },
  { id: 's6', title: 'Load-Bearing essay #5 draft + publish', lane: 'ff', value: 3, time: 5, risk: 3, size: 2 },
];

const wsjf = (item) => Math.round(((item.value + item.time + item.risk) / item.size) * 10) / 10;

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
* { box-sizing: border-box; }
:root {
  --bg: #0c0d10; --bg-2: #14161b; --bg-3: #1c1f29;
  --fg: #e8e9ed; --fg-dim: #8a8f9a; --fg-mute: #555a65;
  --border: #1f2229; --border-bright: #2c303a; --accent: #cbd5e1;
}
body, .root { margin: 0; background: var(--bg); color: var(--fg); font-family: 'JetBrains Mono', monospace; font-size: 14px; line-height: 1.55; }
.root { min-height: 100vh; padding: 48px 24px 96px; background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(203,213,225,0.04), transparent 60%), var(--bg); }
.container { max-width: 1280px; margin: 0 auto; }

.header { display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end; padding-bottom: 24px; border-bottom: 1px solid var(--border); margin-bottom: 28px; }
.kicker { font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--fg-dim); margin: 0 0 14px; display: flex; align-items: center; gap: 8px; }
.title-serif { font-family: 'Instrument Serif', serif; font-size: clamp(38px, 5.4vw, 64px); line-height: 0.96; margin: 0; font-weight: 400; letter-spacing: -0.02em; }
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub { font-size: 12.5px; color: var(--fg-dim); margin: 12px 0 0; max-width: 60ch; line-height: 1.6; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--fg); font-weight: 500; }

.layout { display: grid; grid-template-columns: 360px 1fr; gap: 24px; align-items: start; }

.add-card { border: 1px solid var(--border); background: var(--bg-2); padding: 18px 20px; position: sticky; top: 24px; }
.add-card-title { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 22px; line-height: 1; margin-bottom: 16px; font-weight: 400; }
.field { margin-bottom: 14px; }
.field-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 6px; display: block; }
.field-help { font-size: 10px; color: var(--fg-mute); margin-bottom: 8px; line-height: 1.5; }
.field input, .field textarea, .field select { width: 100%; background: var(--bg-3); border: 1px solid var(--border-bright); color: var(--fg); padding: 8px 10px; font-family: 'JetBrains Mono', monospace; font-size: 12px; outline: none; resize: vertical; }
.field input:focus, .field textarea:focus, .field select:focus { border-color: var(--accent); }
.lane-row { display: flex; gap: 6px; }
.lane-btn { flex: 1; padding: 6px 8px; background: var(--bg-3); border: 1px solid var(--border-bright); font-size: 9.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fg-mute); cursor: pointer; font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; justify-content: center; gap: 5px; }
.lane-btn.active { color: var(--lb-accent); border-color: var(--lb-accent); }
.fib-row { display: flex; gap: 4px; }
.fib-btn { flex: 1; padding: 6px 4px; background: var(--bg-3); border: 1px solid var(--border-bright); font-size: 12px; color: var(--fg-mute); cursor: pointer; font-family: 'JetBrains Mono', monospace; font-weight: 500; }
.fib-btn.active { color: var(--bg); background: var(--accent); border-color: var(--accent); }
.add-btn { width: 100%; padding: 10px; background: var(--accent); color: var(--bg); border: none; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; }
.add-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.live-score { margin-top: 16px; padding: 10px 14px; background: var(--bg-3); border-left: 2px solid var(--accent); display: flex; align-items: center; justify-content: space-between; }
.live-score-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg-dim); }
.live-score-val { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 28px; color: var(--accent); line-height: 1; }

.backlog { display: grid; gap: 14px; }
.backlog-head { display: flex; align-items: center; justify-content: space-between; padding: 0 4px; }
.backlog-title { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 24px; line-height: 1; font-weight: 400; }
.backlog-title em { color: var(--accent); }
.backlog-meta { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; text-transform: uppercase; }
.backlog-list { display: grid; gap: 8px; }
.item { display: grid; grid-template-columns: 4px auto 1fr auto auto; gap: 12px; align-items: center; padding: 12px 16px; background: var(--bg-2); border: 1px solid var(--border); transition: background 0.12s; }
.item:hover { background: var(--bg-3); }
.item.top-3 { border-left: 3px solid var(--accent); padding-left: 13px; }
.item-bar { width: 4px; height: 100%; background: var(--it-accent); align-self: stretch; }
.item-rank { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; color: var(--fg-dim); width: 30px; text-align: right; line-height: 1; }
.item.top-3 .item-rank { color: var(--accent); }
.item-body { min-width: 0; }
.item-title { font-size: 13px; color: var(--fg); margin-bottom: 3px; line-height: 1.4; }
.item-meta { font-size: 10px; color: var(--fg-dim); display: flex; gap: 10px; flex-wrap: wrap; }
.item-meta-tag { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.06em; }
.item-meta-tag em { color: var(--it-accent); font-style: normal; }
.item-score { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 28px; color: var(--it-accent); min-width: 60px; text-align: right; line-height: 1; }
.item-delete { background: transparent; border: none; color: var(--fg-mute); cursor: pointer; padding: 4px; display: flex; align-items: center; }
.item-delete:hover { color: #ef4444; }

.empty-state { padding: 60px 24px; text-align: center; color: var(--fg-dim); font-size: 13px; border: 1px dashed var(--border-bright); }

.claims { margin-top: 36px; padding: 22px; border: 1px solid var(--border); background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7; }
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }
.claims strong { color: var(--fg); font-weight: 500; }

@media (max-width: 980px) { .layout { grid-template-columns: 1fr; } .add-card { position: static; } .header { grid-template-columns: 1fr; } .meta { text-align: left; } }
`;

export default function WSJFPrioritizer() {
  const [items, setItems] = useState(SEEDED);
  const [draft, setDraft] = useState({ title: '', lane: 'ff', value: 5, time: 5, risk: 5, size: 3 });

  const liveScore = useMemo(() => wsjf(draft), [draft]);

  const ranked = useMemo(() => {
    return [...items]
      .map(it => ({ ...it, score: wsjf(it) }))
      .sort((a, b) => b.score - a.score);
  }, [items]);

  const addItem = () => {
    if (!draft.title.trim()) return;
    const id = `i${Date.now()}`;
    setItems(prev => [...prev, { ...draft, id }]);
    setDraft({ title: '', lane: draft.lane, value: 5, time: 5, risk: 5, size: 3 });
  };

  const removeItem = (id) => setItems(prev => prev.filter(it => it.id !== id));

  const setField = (field, val) => setDraft(prev => ({ ...prev, [field]: val }));

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header">
            <div>
              <p className="kicker"><TrendingUp size={12} /> Prioritization Layer // Three Lanes</p>
              <h1 className="title-serif">The <em>Prioritizer</em>.</h1>
              <p className="title-sub">
                Operationalizes the WSJF formula across all three lanes. Score four components on the Fibonacci scale, get a number, sort the backlog by it. Top three highlighted. Common failure mode (inflating Strategic Value) flagged in the claims.
              </p>
            </div>
            <div className="meta">
              <div>Items <strong>{items.length}</strong></div>
              <div style={{ marginTop: 4 }}>Top score <strong>{ranked[0]?.score || 0}</strong></div>
              <div style={{ marginTop: 4 }}>Formula <strong>(V+T+R)/S</strong></div>
            </div>
          </div>

          <div className="layout">

            <div className="add-card">
              <div className="add-card-title">Add to backlog</div>

              <div className="field">
                <label className="field-label">Title</label>
                <input
                  value={draft.title}
                  onChange={e => setField('title', e.target.value)}
                  placeholder="What is the thing?"
                />
              </div>

              <div className="field">
                <label className="field-label">Lane</label>
                <div className="lane-row">
                  {LANES.map(l => {
                    const LIcon = l.icon;
                    return (
                      <button
                        key={l.id}
                        className={`lane-btn ${draft.lane === l.id ? 'active' : ''}`}
                        style={{ ['--lb-accent']: l.accent }}
                        onClick={() => setField('lane', l.id)}
                      >
                        <LIcon size={10} />
                        {l.em}
                      </button>
                    );
                  })}
                </div>
              </div>

              {['value', 'time', 'risk', 'size'].map(field => {
                const guide = SCORE_GUIDES[field];
                return (
                  <div className="field" key={field}>
                    <label className="field-label">{guide.label}</label>
                    <div className="field-help">{guide.help}</div>
                    <div className="fib-row">
                      {FIBS.map(n => (
                        <button
                          key={n}
                          className={`fib-btn ${draft[field] === n ? 'active' : ''}`}
                          onClick={() => setField(field, n)}
                        >{n}</button>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="live-score">
                <span className="live-score-label">Live WSJF</span>
                <span className="live-score-val">{liveScore}</span>
              </div>

              <button
                className="add-btn"
                style={{ marginTop: 12 }}
                onClick={addItem}
                disabled={!draft.title.trim()}
              >
                <Plus size={12} /> Add to backlog
              </button>
            </div>

            <div className="backlog">
              <div className="backlog-head">
                <div className="backlog-title">The <em>backlog</em>, ranked.</div>
                <div className="backlog-meta">Sorted by WSJF · top 3 highlighted</div>
              </div>

              {ranked.length === 0 ? (
                <div className="empty-state">Backlog empty. Add items via the form.</div>
              ) : (
                <div className="backlog-list">
                  {ranked.map((item, idx) => {
                    const lane = LANES.find(l => l.id === item.lane);
                    const isTop = idx < 3;
                    return (
                      <div key={item.id} className={`item ${isTop ? 'top-3' : ''}`} style={{ ['--it-accent']: lane.accent }}>
                        <div className="item-bar" />
                        <div className="item-rank">{idx + 1}</div>
                        <div className="item-body">
                          <div className="item-title">{item.title}</div>
                          <div className="item-meta">
                            <span className="item-meta-tag"><em>{lane.em}</em></span>
                            <span className="item-meta-tag">V:{item.value}</span>
                            <span className="item-meta-tag">T:{item.time}</span>
                            <span className="item-meta-tag">R:{item.risk}</span>
                            <span className="item-meta-tag">S:{item.size}</span>
                          </div>
                        </div>
                        <div className="item-score">{item.score}</div>
                        <button className="item-delete" onClick={() => removeItem(item.id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          <div className="claims">
            <h4><AlertTriangle size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Calibration notes</h4>
            <ul>
              <li><strong>If everything scores 8+, the formula is broken.</strong> The most common failure mode is inflating Strategic Value to justify pet projects. Calibrate against actual revenue, chapter, or product impact — if it doesn't move the needle on the lane's quarterly gates, it's not a 8.</li>
              <li><strong>Job Size is where honesty matters most.</strong> Memoir excavation that "feels like 2 days" is almost always 5 days. FF prospect outreach that "feels like a half day" includes the research + the draft + the follow-up + the discovery call. Multiply your gut estimate by 1.3-1.5x before entering.</li>
              <li><strong>Time Criticality is not urgency.</strong> Hard deadlines (custody days, exam dates, court dates) are 13. Soft external dependencies (publisher window, market timing) are 8. Internal momentum is 5. "I want to do this soon" is not 8 — it's 3.</li>
              <li><strong>Risk Reduction rewards downstream unblock count.</strong> Tool Archaeology unblocks 3 memoir chapters → 13. Marketplace distribution decision unblocks one product → 5. The 13 score is rare and should stay rare.</li>
              <li><strong>The Top 3 highlight is the actionable signal.</strong> If the top 3 don't match your gut about what's important, either the gut is wrong or the scoring is wrong. Re-examine which.</li>
              <li><strong>What this prioritizer does not do:</strong> persist backlog between sessions, account for arc-level sequencing (some items depend on others), track completion, surface across-lane balance. The Three-Lane Dashboard handles completion; this surface is purely "what earns the next slot."</li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
