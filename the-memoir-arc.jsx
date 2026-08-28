import React, { useState } from 'react';
import { ChevronRight, BookOpen, Flag, AlertCircle, Feather } from 'lucide-react';

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Crimson+Pro:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #0e0a06;
  --bg-2: #1a130c;
  --bg-3: #251a10;
  --fg: #f0e6d2;
  --fg-dim: #9a8c70;
  --fg-mute: #6a5f4a;
  --border: #2a2014;
  --border-bright: #3a2d1c;
  --accent: #b89968;
  --accent-soft: #d4b88a;
  --accent-bg: rgba(184,153,104,0.07);
  --gate: #e6c98a;
  --serif: 'Fraunces', Georgia, serif;
  --body: 'Crimson Pro', Georgia, serif;
  --mono: 'JetBrains Mono', monospace;
}

body, .root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: var(--body);
  font-size: 15px; line-height: 1.65; -webkit-font-smoothing: antialiased;
}

.root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 70% 40% at 50% -10%, rgba(184,153,104,0.06), transparent 60%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1080px; margin: 0 auto; }

.header-grid {
  display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end;
  padding-bottom: 32px; border-bottom: 1px solid var(--border); margin-bottom: 36px;
}
.kicker {
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em;
  color: var(--accent); margin: 0 0 16px; display: flex; align-items: center; gap: 8px;
  font-family: var(--mono);
}
.title-serif {
  font-family: var(--serif); font-size: clamp(48px, 6.4vw, 80px);
  line-height: 0.96; letter-spacing: -0.02em; margin: 0; font-weight: 500; color: var(--fg);
  font-variation-settings: 'opsz' 144, 'SOFT' 50;
}
.title-serif em { color: var(--accent); font-style: italic; font-weight: 400; }
.title-sub {
  font-size: 16px; color: var(--fg-dim); margin: 20px 0 0; max-width: 60ch; line-height: 1.7;
  font-style: italic; font-family: var(--serif); font-weight: 400;
}
.meta {
  text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.14em;
  font-family: var(--mono);
}
.meta strong { color: var(--fg); font-weight: 500; }

.strip {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px;
  background: var(--border); border: 1px solid var(--border); margin-bottom: 36px;
}
.strip-cell {
  padding: 16px 18px; background: var(--bg-2);
  display: grid; grid-template-rows: auto auto auto; gap: 6px;
}
.strip-label {
  font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg-mute);
  font-family: var(--mono);
}
.strip-value {
  font-family: var(--serif); font-style: italic; font-weight: 500;
  font-size: 28px; color: var(--accent); line-height: 1;
}
.strip-note { font-size: 11.5px; color: var(--fg-dim); line-height: 1.45; font-family: var(--mono); }

.tradeoff {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
  background: var(--border); border: 1px solid var(--border); margin-bottom: 20px;
}
.tradeoff-cell { padding: 22px 26px; background: var(--bg-2); }
.tradeoff-label {
  font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent);
  margin-bottom: 12px; font-family: var(--mono);
}
.tradeoff-text { font-size: 16px; color: var(--fg); line-height: 1.75; font-family: var(--serif); font-weight: 400; }
.tradeoff-text strong { color: var(--accent-soft); font-weight: 500; font-style: italic; }

.principle {
  margin-bottom: 36px; padding: 18px 26px;
  border: 1px dashed var(--border-bright); background: var(--accent-bg);
  font-family: var(--serif); font-style: italic; font-weight: 400;
  font-size: 19px; color: var(--accent-soft); line-height: 1.55;
}
.principle-label {
  font-family: var(--mono); font-style: normal;
  font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 10px; display: block; font-weight: 500;
}

.progress-wrap {
  margin-bottom: 28px; padding: 14px 22px; background: var(--bg-2);
  border: 1px solid var(--border); position: sticky; top: 20px; z-index: 5;
  display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: center;
}
.progress-bar { height: 6px; background: var(--bg-3); position: relative; }
.progress-fill { position: absolute; top: 0; left: 0; bottom: 0; background: var(--accent); transition: width 0.4s ease; }
.progress-meta { font-family: var(--mono); font-size: 11px; color: var(--fg-dim); letter-spacing: 0.1em; }
.progress-meta strong { color: var(--accent); font-weight: 600; }

.quarters { display: grid; gap: 14px; }
.quarter {
  border: 1px solid var(--border); background: var(--bg-2);
  border-left: 3px solid var(--accent);
}
.quarter-head {
  padding: 16px 22px; display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: center;
  border-bottom: 1px solid var(--border); cursor: pointer; user-select: none;
}
.quarter-num {
  font-family: var(--serif); font-style: italic; font-weight: 400;
  font-size: 34px; color: var(--accent); line-height: 1;
}
.quarter-title { font-family: var(--serif); font-size: 17px; color: var(--fg); font-weight: 500; }
.quarter-sub { font-size: 12.5px; color: var(--fg-dim); margin-top: 4px; font-style: italic; font-family: var(--serif); }
.quarter-chevron { color: var(--fg-mute); transition: transform 0.2s; }
.quarter.open .quarter-chevron { transform: rotate(90deg); }

.months { display: grid; }
.month { padding: 16px 22px; border-top: 1px solid var(--border); }
.month-head { display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: start; cursor: pointer; }
.month-num {
  font-family: var(--serif); font-style: italic; font-weight: 400;
  font-size: 24px; color: var(--accent-soft); min-width: 50px;
}
.month-gate-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gate); margin-bottom: 4px; }
.month-gate-text {
  font-family: var(--serif); font-style: italic; font-weight: 400;
  font-size: 17px; color: var(--fg); line-height: 1.45;
}
.month-check { width: 18px; height: 18px; border: 1.5px solid var(--fg-mute); cursor: pointer; margin-top: 4px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.month-check.done { background: var(--accent); border-color: var(--accent); color: var(--bg); }

.weeks { display: grid; gap: 6px; margin-top: 14px; padding-left: 66px; }
.week { display: grid; grid-template-columns: 32px 1fr 16px; gap: 12px; align-items: start; padding: 10px 12px; background: var(--bg-3); cursor: pointer; border-left: 2px solid transparent; transition: background 0.12s; }
.week:hover { background: var(--bg); }
.week.done { border-left-color: var(--accent); opacity: 0.65; }
.week.done .week-text { text-decoration: line-through; text-decoration-color: rgba(255,255,255,0.2); }
.week-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; color: var(--accent); font-weight: 600; }
.week-text { font-size: 14px; color: var(--fg); line-height: 1.6; font-family: var(--body); }
.week-check { width: 14px; height: 14px; border: 1.5px solid var(--fg-mute); display: flex; align-items: center; justify-content: center; }
.week.done .week-check { background: var(--accent); border-color: var(--accent); }

.claims {
  margin-top: 40px; padding: 26px; border: 1px solid var(--border);
  background: var(--bg-2); font-size: 14px; color: var(--fg-dim); line-height: 1.75; font-family: var(--body);
}
.claims h4 { font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 14px; }
.claims ul { margin: 6px 0; padding-left: 20px; }
.claims li { margin-bottom: 8px; }
.claims strong { color: var(--accent-soft); font-weight: 500; font-style: italic; font-family: var(--serif); }

@media (max-width: 880px) {
  .strip { grid-template-columns: 1fr 1fr; }
  .tradeoff { grid-template-columns: 1fr; }
  .header-grid { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .weeks { padding-left: 0; }
}
`;

const QUARTERS = [
  {
    num: 'Q1', title: 'Excavation completion', sub: 'May → Jul 2026 — the 13 outstanding tasks worked through, sequenced, captured',
    months: [
      {
        m: 1, gate: 'Session 3 Tool Archaeology complete — three chapters unblocked simultaneously',
        weeks: [
          'Tool Archaeology session structure prepared. Materials assembled.',
          'Session run W1. Raw material captured to memoir_material_bank.',
          'Session run W2. Specificity discipline held; theme-jumping resisted.',
          'Material organized into the three chapter feeds. Three structural unblocks logged.',
        ],
      },
      {
        m: 2, gate: 'Tom Ropel chapter excavated — best-friend material captured without forcing arc',
        weeks: [
          'Tom Ropel material prep. What is remembered, what is missing, surfaced honestly.',
          'Excavation W1: specifics before themes. Sensory first.',
          'Excavation W2: the moments Kyle does not remember named explicitly.',
          'Contradictions preserved as material. Permission/pseudonym question logged for legal.',
        ],
      },
      {
        m: 3, gate: 'Dave Datt excavated · Tier-3 excavation tasks completed · Q1 retrospective',
        weeks: [
          'Dave Datt material prep. The brain aneurysm framing handled with care.',
          'Excavation conducted. What survived him in Kyle\'s practice surfaced.',
          'Tier-3 outstanding tasks closed (follow-up SPECT scan, Aug 2 2022 review scene).',
          'Q1 retro: which excavations went deep, which surfaced new unblocks, which still owe work.',
        ],
      },
    ],
  },
  {
    num: 'Q2', title: 'First draft begins', sub: 'Aug → Oct 2026 — material becomes prose; the letter-to-Kinsley frame holds',
    months: [
      {
        m: 4, gate: 'Opening chapter drafted — voice locked, frame established, no recovery language',
        weeks: [
          'Opening scene decision: from the excavation, which scene opens the book?',
          'First draft W1. The frame as letter to Kinsley enforced sentence by sentence.',
          'First draft W2-3. Sensory specifics; no "and that\'s when I realized."',
          'Opening chapter complete. External read (one trusted reader) for frame audit.',
        ],
      },
      {
        m: 5, gate: 'Chapters 2-3 drafted · the recursive-trap framing tested in prose',
        weeks: [
          'Chapter 2 (origins) drafted — addiction → hypoxia → injury sequence in service of the frame.',
          'Chapter 3 (the trap) drafted — recursive framing tested without forcing it.',
          'Read-aloud pass: does this sound like Kyle or like a memoirist performing Kyle?',
          'Revisions. Performance language excised. Declarative observations preserved.',
        ],
      },
      {
        m: 6, gate: 'Mid-year: 5 chapters drafted · manuscript file consolidated · cognitive-profile thesis tested',
        weeks: [
          'Chapter 4 (the tools as prosthetic memory) drafted — cognitive-profile thesis surfaced.',
          'Chapter 5 (O\'Toole\'s, the diagnostic instinct) drafted — Q1 excavation pays off.',
          'Sudowrite manuscript consolidated. Chapter order tested.',
          'Mid-year retrospective: voice consistency, frame discipline, lane separation honest.',
        ],
      },
    ],
  },
  {
    num: 'Q3', title: 'First draft completes', sub: 'Nov 2026 → Jan 2027 — the book exists end-to-end, even if rough',
    months: [
      {
        m: 7, gate: 'Chapters 6-8 drafted — middle act material from Tom Ropel + Dave Datt excavations',
        weeks: [
          'Chapter 6 (Tom Ropel) drafted from the Q1 excavation material.',
          'Chapter 7 (the friends who survived him) drafted.',
          'Chapter 8 (Dave Datt) drafted — care with the aneurysm framing.',
          'Pseudonym pass for all living people. Legal log updated.',
        ],
      },
      {
        m: 8, gate: 'Chapters 9-10 drafted — Sedona, Soaring Bear, the card-table-website origin',
        weeks: [
          'Chapter 9 (Sedona / Soaring Bear / arrangement by Phillis) drafted.',
          'Chapter 10 (the card table — self-teaching method origin) drafted.',
          'Read-aloud: the construction-not-recovery thesis must be visible in the prose.',
          'Revisions. Any moment that reads as "brave recovery story" gets rewritten or cut.',
        ],
      },
      {
        m: 9, gate: 'First draft complete — every chapter exists in rough form · structure decision triggered',
        weeks: [
          'Final chapter drafted. The letter-to-Kinsley frame closes deliberately.',
          'End-to-end read. Note where chapters compress, expand, or move.',
          'Structure decision: chronological, thematic, or letter-sequence?',
          'Q3 retro: draft exists. Strength + weakness honest read. Distance taken before revision.',
        ],
      },
    ],
  },
  {
    num: 'Q4', title: 'Revision + agent path', sub: 'Feb → Apr 2027 — manuscript becomes submittable, or the year is honestly extended',
    months: [
      {
        m: 10, gate: 'Structural revision complete · chapter order locked · second draft begun',
        weeks: [
          'Structural revision: scenes moved, compressed, or cut based on M9 read.',
          'Second draft W1: opening + first three chapters.',
          'Second draft W2: middle four chapters.',
          'External structural read by one trusted reader (not a memoirist).',
        ],
      },
      {
        m: 11, gate: 'Manuscript at submittable quality · attorney review for Michael journal triggered',
        weeks: [
          'Second draft W3: late chapters + ending.',
          'Manuscript polish pass: line edits, voice consistency, declarative-observation discipline.',
          'Attorney review scheduled for Michael journal sections (highest legal risk).',
          'Comp titles confirmed (Solomon, Maté, Cahalan). Query letter first draft.',
        ],
      },
      {
        m: 12, gate: 'Agent submission path decided · Y2 plan locked · year-one closing reflection',
        weeks: [
          'Agent research: which agents represent Solomon/Maté/Cahalan-comp memoirs?',
          'Query letter polish. Synopsis written. First-50-pages prepared.',
          'Submission decision: query now, query Y2, or self-publish path.',
          'Y2 plan locked. Year-one closing reflection captured. Letter-to-Kinsley frame reaffirmed.',
        ],
      },
    ],
  },
];

export default function MemoirArc() {
  const [openQ, setOpenQ] = useState('Q1');
  const [openM, setOpenM] = useState(1);
  const [doneMonths, setDoneMonths] = useState(new Set());
  const [doneWeeks, setDoneWeeks] = useState(new Set());

  const completedWeeks = doneWeeks.size;
  const pct = Math.round((completedWeeks / 48) * 100);

  const toggleMonth = (m) => { setDoneMonths(prev => { const n = new Set(prev); n.has(m) ? n.delete(m) : n.add(m); return n; }); };
  const toggleWeek = (key) => { setDoneWeeks(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; }); };

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header-grid">
            <div>
              <p className="kicker"><Feather size={12} /> Memoir // Construction, Not Recovery</p>
              <h1 className="title-serif">The <em>Memoir</em> Arc.</h1>
              <p className="title-sub">
                Twelve months to a submittable manuscript. Excavation completion → first draft → revision → agent decision. The frame is a letter to Kinsley; the thesis is construction, not recovery; the test of the year is whether a reader closes the book and thinks "brave recovery story" — if so, the year failed.
              </p>
            </div>
            <div className="meta">
              <div>Lane <strong>Memoir</strong></div>
              <div style={{marginTop: 4}}>Horizon <strong>May 2026 → Apr 2027</strong></div>
              <div style={{marginTop: 4}}>Genre <strong>Literary nonfiction</strong></div>
              <div style={{marginTop: 4}}>Reader <strong>Kinsley</strong></div>
            </div>
          </div>

          <div className="strip">
            <div className="strip-cell">
              <div className="strip-label">Q1 work</div>
              <div className="strip-value">Excavate</div>
              <div className="strip-note">13 outstanding tasks</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Q2 work</div>
              <div className="strip-value">Draft I</div>
              <div className="strip-note">5 chapters</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Q3 work</div>
              <div className="strip-value">Draft I done</div>
              <div className="strip-note">end-to-end exists</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Q4 work</div>
              <div className="strip-value">Submittable</div>
              <div className="strip-note">or Y2 honest</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Y1 test</div>
              <div className="strip-value">The frame</div>
              <div className="strip-note">construction not recovery</div>
            </div>
          </div>

          <div className="tradeoff">
            <div className="tradeoff-cell">
              <div className="tradeoff-label">What you gain</div>
              <div className="tradeoff-text">
                <strong>A finished book</strong>, or at minimum a book whose unfinishedness is honest rather than drifting. <strong>The thesis tested in prose</strong> — construction-not-recovery as a frame that survives 250 pages, not just project documents. <strong>Kinsley has the letter</strong>, in some form, at the end of the year.
              </div>
            </div>
            <div className="tradeoff-cell">
              <div className="tradeoff-label">What you give up</div>
              <div className="tradeoff-text">
                <strong>Bandwidth for FlashFusion + ChaosClubCo</strong> — memoir writing is slow, expensive in attention, irreducibly non-linear. <strong>Speed of release</strong> — twelve months is conservative; many memoirs take three years. <strong>Comfortable framing</strong> — if a reader needs a brave-recovery hook, this book denies it; smaller audience is the cost.
              </div>
            </div>
          </div>

          <div className="principle">
            <span className="principle-label">Operating principle</span>
            Excavate before structuring. Specifics before themes. The unbroken rule: if a paragraph reads as performed vulnerability or arrived-at epiphany, the paragraph is wrong. The book is being written for Kinsley; the reader who finds it is a guest in that letter, not its audience.
          </div>

          <div className="progress-wrap">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="progress-meta">
              <strong>{completedWeeks}</strong> / 48 weeks · {pct}% complete · Q1 excavation
            </div>
          </div>

          <div className="quarters">
            {QUARTERS.map(q => {
              const isOpen = openQ === q.num;
              return (
                <div key={q.num} className={`quarter ${isOpen ? 'open' : ''}`}>
                  <div className="quarter-head" onClick={() => setOpenQ(isOpen ? null : q.num)}>
                    <div className="quarter-num">{q.num}</div>
                    <div>
                      <div className="quarter-title">{q.title}</div>
                      <div className="quarter-sub">{q.sub}</div>
                    </div>
                    <ChevronRight size={20} className="quarter-chevron" />
                  </div>
                  {isOpen && (
                    <div className="months">
                      {q.months.map(month => {
                        const monthOpen = openM === month.m;
                        return (
                          <div key={month.m} className="month">
                            <div className="month-head" onClick={() => setOpenM(monthOpen ? null : month.m)}>
                              <div className="month-num">M{month.m}</div>
                              <div>
                                <div className="month-gate-label">Gate</div>
                                <div className="month-gate-text">{month.gate}</div>
                              </div>
                              <div className={`month-check ${doneMonths.has(month.m) ? 'done' : ''}`} onClick={(e) => { e.stopPropagation(); toggleMonth(month.m); }}>
                                {doneMonths.has(month.m) && <Flag size={11} />}
                              </div>
                            </div>
                            {monthOpen && (
                              <div className="weeks">
                                {month.weeks.map((w, wi) => {
                                  const key = `${month.m}-${wi+1}`;
                                  const isDone = doneWeeks.has(key);
                                  return (
                                    <div key={wi} className={`week ${isDone ? 'done' : ''}`} onClick={() => toggleWeek(key)}>
                                      <div className="week-label">W{wi+1}</div>
                                      <div className="week-text">{w}</div>
                                      <div className="week-check">{isDone && <Flag size={9} />}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="claims">
            <h4><AlertCircle size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Claims, gaps, assumptions</h4>
            <ul>
              <li><strong>The 12-month-to-submittable timeline is aggressive for literary nonfiction.</strong> Solomon, Maté, Cahalan all took longer than 12 months from excavation to submission-ready. Treat the M12 gate as best-case. The fallback is M12 = manuscript exists at quality, Y2 = revision + submission. Both outcomes are valid; only drift is not.</li>
              <li><strong>Tier-3 excavation tasks (follow-up SPECT, Aug 2 2022 review scene, p2/p3 hypoxia date conflict) are treated as memoir material, not errors.</strong> The internal date contradictions stay in the manuscript as evidence of how the mind under hypoxia reorganized time.</li>
              <li><strong>The frame as letter to Kinsley is structural, not aesthetic.</strong> If any chapter reads as written to a general audience, that chapter has lost the frame. The mid-year retrospective at M6 is the structural audit.</li>
              <li><strong>The Michael journal is highest legal risk.</strong> Attorney review at M11 is non-negotiable before any publication or query letter goes out. Do not draft Michael journal content for public-facing surfaces (newsletter, FF content, ChaosClubCo) under any framing.</li>
              <li><strong>The cognitive profile (PS 99th, Recall 12th, Flex 17th, Resil 2nd) is thesis in data.</strong> It must surface in the prose — engine full speed, storage empty, tools as prosthetic memory — without becoming a clinical-report performance. M4 chapter 1 and M6 chapter 4 test the integration.</li>
              <li><strong>Lane bleed risk:</strong> Memoir voice borrowing from FlashFusion consulting register or ChaosClubCo brand voice = failure. Three distinct voices required. If a sentence could appear in a FF essay, it does not belong in the memoir.</li>
              <li><strong>What this arc does not model:</strong> grief or excavation-fatigue that requires pausing the schedule, publisher response time, the possibility that a deeper structural rewrite emerges at M9 and reopens Q3 entirely. Quarterly retros are the renegotiation point; the manuscript is the only honest deadline.</li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
