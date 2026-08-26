import React, { useState } from 'react';
import { FileText, Printer, Edit3, ChevronLeft, ChevronRight, Feather, Compass } from 'lucide-react';

const LANES = [
  { id: 'ff', em: 'FlashFusion', accent: '#7c3aed' },
  { id: 'ccc', em: 'ChaosClubCo', accent: '#e11d48' },
  { id: 'memoir', em: 'Memoir', accent: '#b89968' },
];

const ADAPTERS = [
  {
    id: 'self', name: 'Self', sub: 'Kyle briefing Kyle',
    intro: "Quarter closed. Honest read across the three lanes — what shipped, what slipped, what the constraints actually were rather than what I thought they would be. This is a self-document, not a positioning artifact. If something here reads as performance, rewrite it.",
    decisionsLead: "What I need to decide before Q+1 starts, in priority order:",
  },
  {
    id: 'lafu', name: 'Lafu', sub: 'FF technical co-founder',
    intro: "Quarter update on FlashFusion. The other two lanes (ChaosClubCo, Memoir) are noted briefly for context only — they affect my bandwidth but not the FF work itself. Focus is FF revenue motion, delivery quality, and the technical-build decisions where your view matters.",
    decisionsLead: "Decisions I need from you for Q+1, in priority order:",
  },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Crimson+Pro:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
* { box-sizing: border-box; }
:root {
  --bg: #0e0a06; --bg-2: #1a130c; --bg-3: #251a10;
  --paper: #f4ecdc; --paper-2: #e6dcc4;
  --paper-fg: #1a1410; --paper-fg-dim: #5a4e3e; --paper-fg-mute: #8a7e6a;
  --paper-border: #cabea0;
  --fg: #f0e6d2; --fg-dim: #9a8c70; --fg-mute: #6a5f4a;
  --border: #2a2014; --border-bright: #3a2d1c;
  --accent: #b89968;
  --serif: 'Fraunces', Georgia, serif;
  --body: 'Crimson Pro', Georgia, serif;
  --mono: 'JetBrains Mono', monospace;
}
body, .root { margin: 0; background: var(--bg); color: var(--fg); font-family: var(--body); font-size: 15px; line-height: 1.65; }
.root { min-height: 100vh; padding: 48px 24px 96px; background: radial-gradient(ellipse 70% 40% at 50% -10%, rgba(184,153,104,0.06), transparent 60%), var(--bg); }
.container { max-width: 1200px; margin: 0 auto; }
.header { display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end; padding-bottom: 24px; border-bottom: 1px solid var(--border); margin-bottom: 28px; }
.kicker { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em; color: var(--accent); margin: 0 0 14px; display: flex; align-items: center; gap: 8px; }
.title { font-family: var(--serif); font-size: clamp(40px, 5.6vw, 66px); line-height: 0.96; letter-spacing: -0.02em; margin: 0; font-weight: 500; }
.title em { color: var(--accent); font-style: italic; font-weight: 400; }
.title-sub { font-family: var(--serif); font-style: italic; font-weight: 400; font-size: 16px; color: var(--fg-dim); margin: 16px 0 0; max-width: 62ch; line-height: 1.7; }
.meta { text-align: right; font-family: var(--mono); font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.14em; }
.meta strong { color: var(--fg); font-weight: 500; }

.controls { padding: 14px 18px; background: var(--bg-2); border: 1px solid var(--border); margin-bottom: 28px; display: flex; gap: 18px; align-items: center; flex-wrap: wrap; }
.controls-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); }
.q-stepper { display: flex; align-items: center; gap: 4px; }
.q-btn { background: var(--bg-3); border: 1px solid var(--border-bright); color: var(--fg); padding: 4px 6px; cursor: pointer; display: flex; align-items: center; }
.q-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.q-val { font-family: var(--serif); font-style: italic; font-size: 22px; padding: 0 10px; min-width: 50px; text-align: center; }
.adapter-pills { display: flex; gap: 6px; }
.adapter-pill { padding: 6px 14px; background: var(--bg-3); border: 1px solid var(--border-bright); font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-dim); cursor: pointer; }
.adapter-pill.active { color: var(--accent); border-color: var(--accent); background: rgba(184,153,104,0.06); }
.view-toggle { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: var(--bg-3); border: 1px solid var(--border-bright); font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-dim); cursor: pointer; margin-left: auto; }
.view-toggle.active { color: var(--accent); border-color: var(--accent); }

.brief { background: var(--paper); color: var(--paper-fg); border: 1px solid var(--paper-border); padding: 56px 64px; font-family: var(--body); font-size: 15px; line-height: 1.72; box-shadow: 0 24px 60px rgba(0,0,0,0.5); }

.brief-head { display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: end; padding-bottom: 24px; border-bottom: 1.5px solid var(--paper-fg); margin-bottom: 32px; }
.brief-title { font-family: var(--serif); font-style: italic; font-weight: 400; font-size: 40px; color: var(--paper-fg); line-height: 1; margin: 0; }
.brief-stamps { text-align: right; font-family: var(--mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--paper-fg-dim); line-height: 1.8; }
.brief-stamps strong { color: var(--paper-fg); font-weight: 600; }

.brief-section { margin-bottom: 32px; }
.brief-section:last-child { margin-bottom: 0; }
.section-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--paper-fg-mute); margin-bottom: 10px; font-weight: 500; display: flex; align-items: center; gap: 6px; }
.section-num { font-family: var(--serif); font-style: italic; font-size: 14px; color: var(--accent); margin-right: 4px; }

.brief-textarea { width: 100%; background: transparent; border: none; outline: none; resize: vertical; font-family: var(--body); font-size: 15px; line-height: 1.72; color: var(--paper-fg); padding: 4px 0; min-height: 60px; border-bottom: 1px dashed var(--paper-border); }
.brief-textarea:focus { border-bottom-color: var(--accent); }
.brief-textarea.intro { font-family: var(--serif); font-style: italic; font-size: 17px; }

.lanes-block { display: grid; gap: 14px; margin-top: 10px; }
.lane-block { padding: 16px 20px; border-left: 3px solid var(--lb-accent); background: var(--paper-2); }
.lane-block-head { display: grid; grid-template-columns: 1fr auto; gap: 14px; align-items: baseline; margin-bottom: 10px; }
.lane-block-name { font-family: var(--serif); font-style: italic; font-size: 22px; color: var(--paper-fg); }
.lane-block-name em { color: var(--lb-accent); font-style: italic; }
.lane-block-status { font-family: var(--mono); font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--lb-accent); }
.lane-block-textarea { width: 100%; background: transparent; border: none; outline: none; resize: vertical; font-family: var(--body); font-size: 14.5px; line-height: 1.7; color: var(--paper-fg); padding: 4px 0; min-height: 50px; border-bottom: 1px dashed rgba(0,0,0,0.15); }
.lane-block-textarea:focus { border-bottom-color: var(--lb-accent); }

.brief-foot { margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--paper-border); display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center; font-family: var(--mono); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--paper-fg-mute); }
.brief-foot-sig { font-family: var(--serif); font-style: italic; font-size: 16px; color: var(--paper-fg); letter-spacing: 0; text-transform: none; }

.claims { margin-top: 36px; padding: 22px; border: 1px solid var(--border); background: var(--bg-2); font-family: var(--body); font-size: 14px; color: var(--fg-dim); line-height: 1.75; }
.claims h4 { font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 12px; }
.claims ul { margin: 6px 0; padding-left: 20px; }
.claims li { margin-bottom: 6px; }
.claims strong { color: var(--accent); font-style: italic; font-family: var(--serif); }

@media (max-width: 880px) { .brief { padding: 32px 28px; } .brief-head { grid-template-columns: 1fr; } .brief-stamps { text-align: left; } .header { grid-template-columns: 1fr; } .meta { text-align: left; } .controls { flex-direction: column; align-items: flex-start; } .view-toggle { margin-left: 0; } }
@media print { .root { background: white; padding: 0; } .container { max-width: none; } .header, .controls, .claims { display: none; } .brief { box-shadow: none; border: none; padding: 0; } }
`;

export default function QuarterlySelfBriefing() {
  const [quarter, setQuarter] = useState(1);
  const [adapterId, setAdapterId] = useState('self');
  const [printView, setPrintView] = useState(false);
  const [narratives, setNarratives] = useState({});

  const adapter = ADAPTERS.find(a => a.id === adapterId);
  const lanesShown = adapterId === 'lafu' ? LANES : LANES;

  const key = (field) => `${adapterId}-Q${quarter}-${field}`;
  const get = (field, fallback) => narratives[key(field)] ?? fallback;
  const set = (field, val) => setNarratives(prev => ({ ...prev, [key(field)]: val }));

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">
          <div className="header">
            <div>
              <p className="kicker"><FileText size={12} /> Execution Layer // Quarterly Self-Review</p>
              <h1 className="title">The <em>Briefing</em>.</h1>
              <p className="title-sub">Quarterly self-document. Lane health, what shipped, what slipped, constraints honest, decisions needed. Default audience is Kyle briefing Kyle. Lafu adapter reframes for FF co-founder briefings — same structural skeleton, narrower scope, different decision set.</p>
            </div>
            <div className="meta">
              <div>Adapter <strong>{adapter.name}</strong></div>
              <div style={{ marginTop: 4 }}>Period <strong>Q{quarter}</strong></div>
              <div style={{ marginTop: 4 }}>Lanes <strong>3</strong></div>
            </div>
          </div>

          <div className="controls">
            <span className="controls-label">Quarter</span>
            <div className="q-stepper">
              <button className="q-btn" onClick={() => setQuarter(q => Math.max(1, q-1))} disabled={quarter === 1}><ChevronLeft size={14} /></button>
              <span className="q-val">Q{quarter}</span>
              <button className="q-btn" onClick={() => setQuarter(q => Math.min(4, q+1))} disabled={quarter === 4}><ChevronRight size={14} /></button>
            </div>
            <span className="controls-label">Audience</span>
            <div className="adapter-pills">
              {ADAPTERS.map(a => (
                <button key={a.id} className={`adapter-pill ${adapterId === a.id ? 'active' : ''}`} onClick={() => setAdapterId(a.id)}>{a.name}</button>
              ))}
            </div>
            <button className={`view-toggle ${printView ? 'active' : ''}`} onClick={() => setPrintView(!printView)}>
              {printView ? <Edit3 size={11} /> : <Printer size={11} />}
              {printView ? 'Edit mode' : 'Print view'}
            </button>
          </div>

          <div className="brief">
            <div className="brief-head">
              <h2 className="brief-title">Q{quarter} <em>{adapterId === 'self' ? 'self-review' : 'briefing'}</em>.</h2>
              <div className="brief-stamps">
                <div>{adapterId === 'self' ? 'For' : 'To'} <strong>{adapter.name}</strong></div>
                <div>From <strong>Kyle Rosebrook</strong></div>
                <div>RE <strong>{adapterId === 'lafu' ? 'FlashFusion · quarterly' : 'three-lane state'}</strong></div>
              </div>
            </div>

            <div className="brief-section">
              <div className="section-label"><span className="section-num">01</span> Frame</div>
              <textarea className="brief-textarea intro" value={get('intro', adapter.intro)} onChange={e => set('intro', e.target.value)} placeholder="Opening frame for this briefing..." />
            </div>

            <div className="brief-section">
              <div className="section-label"><span className="section-num">02</span> Lane health</div>
              <div className="lanes-block">
                {lanesShown.map(lane => {
                  const isFocus = adapterId === 'lafu' && lane.id !== 'ff';
                  return (
                    <div key={lane.id} className="lane-block" style={{ ['--lb-accent']: lane.accent, opacity: isFocus ? 0.7 : 1 }}>
                      <div className="lane-block-head">
                        <div className="lane-block-name">The <em>{lane.em}</em>.</div>
                        <div className="lane-block-status">{isFocus ? 'context only' : 'primary'}</div>
                      </div>
                      <textarea className="lane-block-textarea" value={get(`lane-${lane.id}`, '')} onChange={e => set(`lane-${lane.id}`, e.target.value)} placeholder={isFocus ? "Brief note: bandwidth impact on FF this quarter..." : "What shipped, what slipped, current state honest. 2-4 sentences..."} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="brief-section">
              <div className="section-label"><span className="section-num">03</span> Constraints — what was actually load-bearing</div>
              <textarea className="brief-textarea" value={get('constraints', '')} onChange={e => set('constraints', e.target.value)} placeholder="The real constraint of the quarter, not the one you planned around. Capacity, capital, infrastructure, dependency, energy, attention. Specifically what limited what." />
            </div>

            <div className="brief-section">
              <div className="section-label"><span className="section-num">04</span> {adapterId === 'self' ? 'Open decisions before Q+1' : 'Decisions needed from you'}</div>
              <textarea className="brief-textarea" style={{ minHeight: 120 }} value={get('decisions', adapter.decisionsLead)} onChange={e => set('decisions', e.target.value)} placeholder="Prioritized decision list. Each item: the decision, the options, the implication of each." />
            </div>

            <div className="brief-section">
              <div className="section-label"><span className="section-num">05</span> Q+1 focus</div>
              <textarea className="brief-textarea" value={get('next', '')} onChange={e => set('next', e.target.value)} placeholder="What the next quarter shapes around. Pace per lane, key gates, what would have to go right for Q+1 to compound rather than just continue." />
            </div>

            <div className="brief-foot">
              <div>Quarterly cadence · Next briefing <strong>Q{Math.min(4, quarter+1)}</strong></div>
              <div className="brief-foot-sig">— Kyle</div>
            </div>
          </div>

          {!printView && (
            <div className="claims">
              <h4>What this template is for</h4>
              <ul>
                <li><strong>Self-review is the primary use.</strong> Quarterly honest read of the three lanes — what shipped, what slipped, what the real constraint was vs what was anticipated. Not for sharing; for thinking. If a sentence here reads as performance, rewrite it.</li>
                <li><strong>The Lafu adapter is the only external surface.</strong> When the FF co-founder partnership formalizes, the briefing becomes the operating cadence with Lafu. Other adapters (editor for memoir, audience for CCC) are speculative and not built yet — add only when the relationship is real.</li>
                <li><strong>Decisions section is the most-skipped and the most-important.</strong> A self-review without prioritized decisions is just journaling. A Lafu briefing without decisions is just a status update. The friction of populating it is the value.</li>
                <li><strong>Reading Room at Midnight aesthetic deliberately matches the memoir register.</strong> The briefing is reflective work — closer to literary nonfiction than to dashboard ops. The aesthetic signals the mode of attention.</li>
                <li><strong>Print view strips chrome.</strong> Edit mode shows controls and claims; print view is screen-share or paste-into-email surface. Browser print converts to PDF.</li>
                <li><strong>Not yet modeled:</strong> state persistence between sessions (drafts lost on refresh), integration with arc gate state, export to Markdown, multi-quarter retrospective view that aggregates four quarters into a Y1 retrospective.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
