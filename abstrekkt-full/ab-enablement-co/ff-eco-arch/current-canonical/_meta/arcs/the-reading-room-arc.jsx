import React, { useState } from 'react';
import { ChevronRight, Mail, Flag, AlertCircle } from 'lucide-react';

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Crimson+Pro:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #1a1a1d;
  --bg-2: #232328;
  --bg-3: #2c2c33;
  --fg: #e8e0cc;
  --fg-dim: #94907e;
  --fg-mute: #5e5b50;
  --border: #2e2e35;
  --border-bright: #3d3d44;
  --accent: #C8A86A;
  --accent-soft: #d9bd87;
  --accent-bg: rgba(200,168,106,0.07);
  --gate: #e6cd9a;
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
    radial-gradient(ellipse 70% 40% at 50% -10%, rgba(200,168,106,0.06), transparent 60%),
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
  font-size: 16px; color: var(--fg-dim); margin: 20px 0 0; max-width: 62ch; line-height: 1.7;
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
.quarter { border: 1px solid var(--border); background: var(--bg-2); border-left: 3px solid var(--accent); }
.quarter-head {
  padding: 16px 22px; display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: center;
  border-bottom: 1px solid var(--border); cursor: pointer; user-select: none;
}
.quarter-num { font-family: var(--serif); font-style: italic; font-weight: 400; font-size: 34px; color: var(--accent); line-height: 1; }
.quarter-title { font-family: var(--serif); font-size: 17px; color: var(--fg); font-weight: 500; }
.quarter-sub { font-size: 12.5px; color: var(--fg-dim); margin-top: 4px; font-style: italic; font-family: var(--serif); }
.quarter-chevron { color: var(--fg-mute); transition: transform 0.2s; }
.quarter.open .quarter-chevron { transform: rotate(90deg); }

.months { display: grid; }
.month { padding: 16px 22px; border-top: 1px solid var(--border); }
.month-head { display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: start; cursor: pointer; }
.month-num { font-family: var(--serif); font-style: italic; font-weight: 400; font-size: 24px; color: var(--accent-soft); min-width: 50px; }
.month-gate-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gate); margin-bottom: 4px; }
.month-gate-text { font-family: var(--serif); font-style: italic; font-weight: 400; font-size: 17px; color: var(--fg); line-height: 1.45; }
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
    num: 'Q1', title: 'Platform + cadence locked', sub: 'May → Jul 2026 — the room exists, the door is open, the cadence is a promise that\'s being kept',
    months: [
      {
        m: 1, gate: 'Platform decision locked · cadence committed · voice doc draft separate from FF/CCC/Memoir',
        weeks: [
          'Platform research. Beehiiv vs Substack vs Ghost vs custom on flashfusion.co. Decision criteria written before the choice.',
          'Platform decision made. Initial setup. Subscriber seed list built from existing FF audience.',
          'Voice doc draft. Read 5 prior essays from drafts folder; mark what is Reading Room voice vs FF, Memoir, or CCC voice.',
          'First Load-Bearing post written and published. "Why this newsletter exists" framing — the room introduced, not announced.',
        ],
      },
      {
        m: 2, gate: 'First 4 weekly posts shipped · 50 subscribers · cadence proven for one month',
        weeks: [
          'Load-Bearing #2 published. Topic: a real AI tool tested under load — what held, what didn\'t.',
          'Load-Bearing #3 published. Topic: a counter-pattern from consulting work that the marketing doesn\'t tell you.',
          'Load-Bearing #4 published. Topic: the tool stack reality vs the tool stack marketing.',
          'Load-Bearing #5 published. 50-subscriber gate check. Cadence is now a public commitment.',
        ],
      },
      {
        m: 3, gate: 'Essay series #1 concept locked · editorial calendar built · Q1 retro',
        weeks: [
          'Essay series #1 concept brief. 3-5 essays, unified theme, distinct from weekly posts in shape and intent.',
          'Editorial calendar built. Posts mapped through Q2. Series sequence planned around bandwidth, not aspiration.',
          'Load-Bearing #6. Series teaser published — readers know what is coming next month.',
          'Q1 retro: subscriber count honest, voice consistency check, cadence sustainable under FF + Memoir load.',
        ],
      },
    ],
  },
  {
    num: 'Q2', title: 'Cadence proven · 200 subscribers', sub: 'Aug → Oct 2026 — the publishing system is no longer being assembled while it runs',
    months: [
      {
        m: 4, gate: 'Essay series #1 publishing · 100 subscribers · cadence absorbing essay weeks without slipping',
        weeks: [
          'Essay series #1 / essay 1 published. Longer-form than a weekly post; cross-link to FF case study if it fits without selling.',
          'Load-Bearing weekly. Lighter touch this week — essay weeks need recovery room.',
          'Essay series #1 / essay 2 published.',
          'Load-Bearing weekly. 100-subscriber gate check.',
        ],
      },
      {
        m: 5, gate: '150 subscribers · voice audit passed · cadence held through essay-week pressure',
        weeks: [
          'Essay series #1 / essay 3 published.',
          'Voice audit: read 8 weeks back. Confirm Reading Room voice is distinct from FF, CCC, Memoir registers — flag any bleed.',
          'Essay series #1 / essay 4 (final) published. Series closes deliberately, not just stops.',
          'Load-Bearing weekly. Series wrap reflection in the room\'s voice.',
        ],
      },
      {
        m: 6, gate: '200 subscribers · mid-year retro · the year is half done and the room is real',
        weeks: [
          'Load-Bearing weekly.',
          'Load-Bearing weekly.',
          '200-subscriber gate check. Distribution analysis: which posts compounded, which didn\'t, what the data actually says vs what felt true.',
          'Mid-year retro: cadence sustained, voice clean, audience honest count, lane discipline retrospective for Reading Room specifically.',
        ],
      },
    ],
  },
  {
    num: 'Q3', title: 'Distribution + amplification', sub: 'Nov 2026 → Jan 2027 — the room is found by people who didn\'t know they were looking for it',
    months: [
      {
        m: 7, gate: 'Essay series #2 launching · first FF case study cross-link without selling',
        weeks: [
          'Essay series #2 concept brief. Theme harder than series #1, audience more earned.',
          'Essay #1 of series #2. First explicit cross-link to a FF case study — written so a reader who doesn\'t click loses nothing.',
          'Load-Bearing weekly.',
          'Essay #2 of series #2.',
        ],
      },
      {
        m: 8, gate: '400 subscribers · first guest essay or syndication moment',
        weeks: [
          'Essay #3 of series #2.',
          'Outreach for guest essay or syndication. 1-2 pitches to publications or newsletters whose audience overlaps; voice match matters more than scale.',
          'Guest essay drafted or syndication confirmed. The room\'s voice carries to a new surface without dilution.',
          'Load-Bearing weekly. 400-subscriber gate check.',
        ],
      },
      {
        m: 9, gate: '600 subscribers · editorial system mature · Q3 retro',
        weeks: [
          'Editorial workflow audit: writing → editing → publishing → distribution is a real system now, not an artisanal weekly improvisation.',
          'Essay #4 of series #2.',
          'Load-Bearing weekly.',
          '600-subscriber gate check. Q3 retro: distribution honest, voice clean across 9 months, surface decision framing drafted for Q4.',
        ],
      },
    ],
  },
  {
    num: 'Q4', title: 'Surface decision + Y2', sub: 'Feb → Apr 2027 — what the room becomes in year two is decided deliberately, not absorbed by drift',
    months: [
      {
        m: 10, gate: 'Surface options written out · evaluation framework locked · decision in progress',
        weeks: [
          'Surface options brief: (a) standalone editorial newsletter, (b) FF top-of-funnel feeder, (c) paid tier, (d) amplification only. Each with revenue, audience, voice, and bandwidth implications.',
          'Subscriber survey or feedback gathering. What do readers value; what would they pay for; what would break the trust if it changed.',
          'Load-Bearing weekly.',
          'Surface decision made. Decision rationale captured for the project file — not just the choice, but the reasoning.',
        ],
      },
      {
        m: 11, gate: 'Paid tier OR sustained-free decision implemented · 800 subscribers',
        weeks: [
          'Paid tier infrastructure built OR formal "remains free" decision operationalized in voice + cadence.',
          'Sponsorship outreach (if paid path) OR cross-lane amplification strategy (if feeder path).',
          'Load-Bearing weekly.',
          '800-subscriber gate check. Surface decision tested in market for one month.',
        ],
      },
      {
        m: 12, gate: 'Y2 editorial strategy locked · cross-lane attribution analysis · year-one reflection',
        weeks: [
          'Cross-lane attribution analysis: how much FF revenue traces back to Reading Room readers; how much CCC distribution rides on it; honest accounting.',
          'Y2 editorial strategy first draft. Cadence, series count, audience target, surface position.',
          'Load-Bearing weekly. Year-one reflection in the room\'s voice — what got built, what shifted, what the room is.',
          'Y2 strategy locked. Year-one closing reflection captured. The room continues; the next year is chosen, not drifted into.',
        ],
      },
    ],
  },
];

export default function ReadingRoomArc() {
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
              <p className="kicker"><Mail size={12} /> Reading Room // Editorial + Publishing + Voice Distribution</p>
              <h1 className="title-serif">The <em>Reading Room</em> Arc.</h1>
              <p className="title-sub">
                Twelve months of editorial work. Load-Bearing newsletter as the spine; essay series as the connective tissue; a voice locked separate from FF consulting, CCC brand, and Memoir literary. The room either compounds or it doesn\'t — what holds the year is the weekly cadence. Subscriber gates are projections, not promises.
              </p>
            </div>
            <div className="meta">
              <div>Lane <strong>Reading Room</strong></div>
              <div style={{marginTop: 4}}>Horizon <strong>May 2026 → Apr 2027</strong></div>
              <div style={{marginTop: 4}}>Cadence <strong>Weekly</strong></div>
              <div style={{marginTop: 4}}>Spine <strong>Load-Bearing</strong></div>
            </div>
          </div>

          <div className="strip">
            <div className="strip-cell">
              <div className="strip-label">Q1 work</div>
              <div className="strip-value">Platform</div>
              <div className="strip-note">cadence locked · 50 subs</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Q2 work</div>
              <div className="strip-value">200 subs</div>
              <div className="strip-note">essay series #1 shipped</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Q3 work</div>
              <div className="strip-value">600 subs</div>
              <div className="strip-note">guest + system mature</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Q4 work</div>
              <div className="strip-value">Surface</div>
              <div className="strip-note">free or paid · 800 subs</div>
            </div>
            <div className="strip-cell">
              <div className="strip-label">Y1 question</div>
              <div className="strip-value">Standalone?</div>
              <div className="strip-note">or feeder for FF</div>
            </div>
          </div>

          <div className="tradeoff">
            <div className="tradeoff-cell">
              <div className="tradeoff-label">What you gain</div>
              <div className="tradeoff-text">
                <strong>Compounding voice</strong> — a publishing surface that earns authority without depending on consulting case studies. <strong>Audience optionality</strong> — paid tier, sponsorship, syndication all become possible without rebuilding from scratch. <strong>Distribution surface</strong> the FF + CCC + Memoir lanes can borrow. <strong>A room that survives any single product or revenue motion</strong>.
              </div>
            </div>
            <div className="tradeoff-cell">
              <div className="tradeoff-label">What you give up</div>
              <div className="tradeoff-text">
                <strong>4-8 hours per week</strong> that could go to FF delivery or memoir drafting. <strong>The temptation to use the surface to sell FF or market CCC</strong> — a constant pull. <strong>Audience expectations</strong> that lock the cadence regardless of bandwidth — once readers expect Wednesday, Wednesday must arrive even when the rest of the week broke. <strong>Lane-bleed risk higher than any other lane</strong>; the room is too easy to drift.
              </div>
            </div>
          </div>

          <div className="principle">
            <span className="principle-label">Operating principle</span>
            Publish thinking, not announcements. The Reading Room is the room where the thinking happens out loud — not where FF gets sold, not where CCC ships, not where the memoir excavates. Voice discipline is the load-bearing constraint; cadence is the proof that the constraint held.
          </div>

          <div className="progress-wrap">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="progress-meta">
              <strong>{completedWeeks}</strong> / 48 weeks · {pct}% complete · Q1 platform
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
              <li><strong>Subscriber gates (50/100/200/400/600/800) are projections, not promises.</strong> If the audience compounds faster, gates beat the schedule and the M9 gate moves up. If slower, gates slip with no shame — the cadence is what counts. The 200-subscriber gate at M6 was previously embedded in the FlashFusion arc; it now lives in this lane structurally.</li>
              <li><strong>Reading Room voice and Memoir voice are not the same voice</strong> despite the shared Fraunces/Crimson Pro aesthetic. Memoir is literary excavation — slow, declarative, frame held in a letter to Kinsley. Reading Room is operational thinking-in-public — sharper, faster, written for adults reading at midnight. The M5 voice audit is the structural test; if Reading Room essays could appear in the memoir, the lane has bled.</li>
              <li><strong>The platform decision at M1 is fragile and has lock-in cost.</strong> Beehiiv, Substack, Ghost, custom on flashfusion.co — each carries different audience portability, monetization shape, and editorial discipline. Decision criteria matter more than the platform choice itself; criteria written before the choice is the discipline.</li>
              <li><strong>The 4-8 hrs/wk bandwidth assumption is honest at Full pace.</strong> Weekly posts ≈ 3-4 hrs each plus editorial work; essay weeks compress to single longer posts. Sustainable for someone with a full-time job + FF + Memoir is real-but-tight. Maintenance pace = essay-only cadence at ~3 hrs/wk; the room stays open but doesn\'t grow.</li>
              <li><strong>Surface decision at M10 is the strategic moment of the year</strong> — does Reading Room remain free editorial, become a paid product, serve as FF top-of-funnel, or amplify across lanes only? Each is valid; drift is not. The decision is the lane\'s biggest WSJF event in Year 1.</li>
              <li><strong>Lane bleed risks are highest for Reading Room of any lane.</strong> The room is too easy to use for the other three — FF consulting voice bleeds in when revenue feels tight, CCC brand voice bleeds in when a product needs distribution, Memoir literary voice bleeds in when the writer is tired. Voice audit at M5 plus the lane-balance artifact\'s voice contamination checks (which will need updating to include this lane as a fourth set of cross-lane pairs) are the corrective.</li>
              <li><strong>What this arc explicitly does not model:</strong> platform-specific subscriber growth dynamics, sponsorship revenue projections, cross-lane attribution mathematics, the possibility that one essay goes viral and breaks every cadence assumption, audience-driven topic drift, the legal risk of writing in public while the memoir is unpublished and unprotected.</li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
