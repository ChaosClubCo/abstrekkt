import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, BookOpen } from 'lucide-react';

const ARC = [
  {
    quarter: 'Q1',
    phase: 'COMMIT',
    subtitle: 'The fork decision. Structure. First chapters drafted to publishable quality.',
    months: [
      {
        n: 1,
        title: 'The fork — memoir or practitioner book',
        why: 'The single most common reason book projects fail is not lack of skill or time — it is the practitioner trying to write two books at once. The memoir and the practitioner book serve different audiences, require different voices, and live in different markets. M1 forces the irreversible choice that makes the next 11 months possible. Picking is the work.',
        weeks: [
          'The audit: read the existing memoir draft and the existing practitioner notes side by side. Which one has more pages? Which one has more energy? Which one would you regret not finishing in three years? The answers usually surprise you. Write them down.',
          'The market test: for each candidate book, write a one-paragraph pitch and send it to three readers. The memoir pitch to three people who knew Phillis or the era. The practitioner pitch to three peers or potential readers. Watch which responses are genuine vs polite — the gap is real signal.',
          'The constraint test: for each candidate, define what success looks like at M12. Memoir success — published, reviewed by people who knew the story, the diagnostic-instinct spine landed cleanly. Practitioner success — shipped, creates Partner Network pull-through, the central framework cited by name. Specific and dated.',
          'Make the decision. Write it down. Date it. The decision document goes into your project files and becomes the reference for every "should I include this?" moment over the next 11 months. The other book is explicitly deferred to Y2+ with no shame and no exception clauses.',
        ],
        gate: 'One book chosen with documented reasoning, market-test responses, and M12 success criteria. The deferred book is named and dated as a Y2+ commitment. The fork is closed.',
      },
      {
        n: 2,
        title: 'Structure — spine, chapter map, voice, sample',
        why: 'Most book drafts that stall do so because the structure was never solidified. Writing chapter 3 before knowing what chapter 7 contains produces chapter 3 that does not earn its place. M2 is the structural blueprint — boring to produce, expensive to skip. The book is built on this skeleton.',
        weeks: [
          'The spine — the single sentence the entire book serves. For memoir: "Construction, Not Recovery" as the diagnostic-instinct engine of a built life. For practitioner: the central framework that organizes everything else. Write it. Test it against three readers. Refine until they paraphrase it back correctly.',
          'Chapter map — title, 2-3 sentence summary, target length, the role each chapter plays in advancing the spine. Memoir: typically 12-18 chapters at 4-6K words. Practitioner: typically 8-12 chapters at 5-8K words. Do not write — just map.',
          'Voice and reader spec — explicit definition of who reads this and what voice meets them. For memoir: who and why does the story matter to them? For practitioner: which stage of practitioner does this book serve and what voice earns their attention? Written specification, not vibes.',
          'One sample chapter — not chapter 1, which carries the opening burden. Pick one from the middle. 5-8K words at target quality. The first chapter you write tells you whether the spine, structure, voice, and reader are all working. Adjust the structural spec based on what the writing reveals.',
        ],
        gate: 'Full chapter map with per-chapter spine role. Voice and reader specification written. One sample chapter drafted at publishable quality. The structural foundation is real, not theoretical.',
      },
      {
        n: 3,
        title: 'First three chapters polished to sample-quality',
        why: 'M2 produced one chapter. M3 produces three at the same quality. Three chapters is what an agent or acquisitions editor wants to see; three chapters is what a self-publication launch needs as proof; three chapters is the volume at which voice consistency becomes a real discipline. The Q1 output is a sample package, not just a draft.',
        weeks: [
          'Chapter A — pick the chapter that most directly carries the spine. Draft to first-pass quality, ~5-8K words. The "if a reader only ever reads one chapter, this is the one" criterion.',
          'Chapter B — pick the chapter that most directly tests voice in difficult territory. For memoir: a hard emotional terrain chapter. For practitioner: a chapter where the framework actually has teeth and breaks easy intuition. Draft fully.',
          'Chapter C — pick the chapter that proves the book has more than one mode. If A and B were both intense, C is reflective. If A and B were both technical, C connects to the human. Drafted at first-pass quality.',
          'Self-edit pass across all three: voice consistency, structural integrity per chapter, the spine through-line visible across all three. Send to one trusted reader for honest reaction. Not "is this good?" — "what is this book about, and would you read more?"',
        ],
        gate: 'Three chapters drafted at sample quality (~15-24K words total). Read by one trusted reader with feedback that confirms (or course-corrects) the spine, voice, and direction. The Q2 draft has a quality bar to maintain, not invent.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'DRAFT',
    subtitle: 'Full manuscript first draft completed. Chapters 4 through end at first-pass quality.',
    months: [
      {
        n: 4,
        title: 'Manuscript draft — chapters 4-7',
        why: 'Q1 produced the spine and the sample. Q2 is the long middle — the months that separate writers who produce books from writers who produce three-chapter samples. The discipline of "draft pace" matters more than the discipline of "draft quality" in this quarter. Quality comes in Q3 editing; volume comes in Q2 drafting.',
        weeks: [
          'Chapter 4 — drafted to first-pass quality. Word target hit. Aim for ~1.5-2K words per writing session, 3-4 sessions per week.',
          'Chapter 5 — drafted. Track pace honestly. If chapter 5 takes longer than chapter 4, the spine or structure has a problem that surfaces. Diagnose now, not in Q3.',
          'Chapter 6 — drafted. Mid-quarter checkpoint: read all six chapters in one sitting. Does the cumulative arc work? Where is repetition? Where does the voice drift?',
          'Chapter 7 — drafted. Weekly word count for the month documented. The pace data is the predictor for whether the book finishes in Q2 or slips into Q3.',
        ],
        gate: 'Chapters 4-7 drafted at first-pass quality. Cumulative read-through completed. Weekly word count documented as pace data for the remaining drafting months.',
      },
      {
        n: 5,
        title: 'Manuscript draft — chapters 8-11',
        why: 'M5 is the make-or-break month. Either the draft pace from M4 holds and the book is on schedule, or it does not and the M12 launch is at risk. The honest assessment in week 1 of this month determines whether the rest of the arc remains realistic or needs re-scoping.',
        weeks: [
          'Honest pace assessment from M4 data. If on track, continue. If 20%+ behind, decide: extend the draft into Q3 (push edit/pitch right), cut a chapter, or accept reduced word counts per chapter. Decide explicitly — drift is the worst option.',
          'Chapter 8 — drafted. The decision from week 1 is operating now.',
          'Chapter 9 — drafted. Mid-point of the long-middle stretch.',
          'Chapter 10 — drafted. If the book has 12 chapters, you are 2 from finish. If 18 chapters, you are 8 from finish — re-confirm Q3 timeline.',
        ],
        gate: 'Chapters 8-11 drafted. Explicit decision documented if pace required scope or schedule adjustment. The path to M6 completion is realistic, not aspirational.',
      },
      {
        n: 6,
        title: 'Manuscript first draft completed + read-through',
        why: 'Q2 closes with the full first draft existing as a single artifact. The first draft is bad. That is normal. The achievement is having all of it written, in order, available to edit as a whole. The M6 read-through is the diagnostic for what Q3 editing actually needs to address.',
        weeks: [
          'Remaining chapters drafted to completion. If the book has more than 12 chapters and you are still drafting in M6, the M5 decision should have addressed this — re-confirm scope honestly.',
          'Full read-through, ideally in one or two sittings. Print or e-reader, not laptop. Read as a reader, not a writer. Take notes on what works, what drags, what is repeated, what is missing.',
          'Read-through notes synthesized into an edit plan. Three categories: structural problems (chapter order, redundancy, missing chapters), voice problems (drift, inconsistency, lapses), content problems (factual issues, unclear passages, weak transitions). Each item rated by severity.',
          'Quarter break — one full week away from the manuscript. The book needs distance before edit-mode begins. Use the week for any non-book work that has accumulated. Resist the urge to "just touch one chapter." Distance is the work.',
        ],
        gate: 'Complete first-draft manuscript existing as one artifact. Read-through completed with an edit plan documenting structural, voice, and content issues by severity. A one-week deliberate distance from the manuscript taken.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'REVISE & PITCH',
    subtitle: 'Two structural edit passes. Professional editor engaged. Pitch process or self-pub setup.',
    months: [
      {
        n: 7,
        title: 'Edit pass 1 — structural revision',
        why: 'The first edit is not line-level. It is structural. Are the chapters in the right order? Are there chapters that should not exist? Are there chapters that should exist but were missed? The structural edit is where the book actually becomes a book, rather than a sequence of draft chapters in chronological order.',
        weeks: [
          'Chapter order audit — does the current sequence serve the spine? Move or merge chapters as needed. Some chapters die in this week. That is normal and correct.',
          'Missing chapters — what is the read-through revealing as a gap? Write or sketch the new chapter that addresses the gap. Most first drafts need 1-3 new chapters during structural edit.',
          'Redundancy cuts — where does the manuscript say the same thing twice? Cut the weaker passage every time. Most manuscripts lose 8-15% of their word count to redundancy cuts.',
          'Structural read-through #2 — does the book hang together now? If not, another structural pass is needed before line edits. Do not move forward until the structure is right; line editing on a broken structure is wasted work.',
        ],
        gate: 'Edit pass 1 complete. Structural read-through #2 confirms the book hangs together. Word count and chapter map updated to reflect the revised structure.',
      },
      {
        n: 8,
        title: 'Edit pass 2 — line edits + professional editor engaged',
        why: 'M7 fixed the structure. M8 fixes the prose. Line edits are slower than structural edits — each chapter takes longer, even though each change is smaller. This is also the month to engage a professional editor — the outside read that catches what self-editing cannot.',
        weeks: [
          'Engage a professional editor — developmental, copy, or both depending on what M7 revealed needs. For memoir, often developmental. For practitioner book, often copy edit + technical reviewer. Budget $2-5K for serious work. The editor reads while you continue line edits.',
          'Line edits — first half of the book. Voice consistency, sentence rhythm, paragraph flow, transitions. The kind of editing that benefits from reading aloud.',
          'Line edits — second half of the book. Pace is critical here; line editing tends to slow as fatigue accumulates. Schedule shorter sessions to maintain quality.',
          'Editor feedback received and triaged. Critical changes implemented; cosmetic changes queued for later passes. A revised manuscript ready for the pitch process.',
        ],
        gate: 'Edit pass 2 complete across the full manuscript. Professional editor engaged with feedback received and major issues addressed. Manuscript ready for the M9 pitch process.',
      },
      {
        n: 9,
        title: 'Pitch process — agent queries or self-pub decision',
        why: 'M9 is where the book moves from manuscript to publication path. For memoir, the question is usually traditional vs hybrid publication. For practitioner book, the question is often O\'Reilly/Manning vs Substack-as-book vs self-pub. The decision is not aesthetic — it is strategic and depends on what role the book serves in the larger portfolio.',
        weeks: [
          'Publication path decision — for the chosen book, what is the right home? Memoir: agent + traditional, hybrid press, or self-pub via KDP and IngramSpark? Practitioner: technical publisher, established platform, or self-pub? Decide based on what role the book serves, not on prestige alone.',
          'Traditional path: agent query letter, comp titles list, synopsis, and 50-page sample. Query 8-15 agents over 2-3 weeks. Self-pub path: cover designer engaged, ISBN obtained, KDP and IngramSpark accounts set up.',
          'Traditional path: continue queries and track responses. Most queries get no response or polite passes. One or two requests for a full manuscript is a positive signal at this stage. Self-pub path: interior design and layout finalized, ARC copies prepared.',
          'Decision tree branching: if traditional path gets a serious request, accommodate the agent\'s timeline. If queries are not landing or self-pub is the path, the M10-M12 sequence is now self-pub-driven. Document the path clearly so M10 starts without ambiguity.',
        ],
        gate: 'Publication path chosen. Either active agent queries with at least one full-manuscript request, or self-publication infrastructure (cover, ISBN, accounts) in place. The M10-M12 sequence is now path-specific, not theoretical.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'LAUNCH',
    subtitle: 'Final production. Pre-launch positioning. Public launch. The book exists in the world.',
    months: [
      {
        n: 10,
        title: 'Final production — manuscript locked',
        why: 'Q4 is no longer a writing quarter. The book is essentially done; the work is now production and positioning. M10 locks the manuscript, finalizes design, and sets up the pre-launch positioning. The temptation to keep revising is the largest threat in Q4 — name it and resist it.',
        weeks: [
          'Final edit pass — proofread quality, not structural quality. Typos, formatting, citation consistency. Most issues found here are small. If significant structural issues surface, the M11 launch is at risk — push the launch by a month rather than ship a broken book.',
          'Design and layout finalized. Cover (final), interior design, back cover copy, author bio. For traditional path, the publisher drives most of this; for self-pub, you drive it. Either way the M10 close has the package ready.',
          'Pre-launch positioning — the book\'s landing page (your site or the publisher\'s), the launch announcement structure, the ARC list for early reviewers. The audience that will receive the book on day one is built in M10, not M11.',
          'ARC distribution — advance review copies sent to 20-50 readers who can produce reviews, blurbs, or social distribution at launch. The most important ARC recipients are not the most famous; they are the ones who will actually read and respond.',
        ],
        gate: 'Manuscript locked. Design and layout final. Landing page live with pre-order or sign-up. ARC distribution to 20-50 readers complete. The book is ready to launch.',
      },
      {
        n: 11,
        title: 'Launch — release week and distribution',
        why: 'The release is one week of intense activity that has been building for 10 months. The launch is not "marketing" in the abstract — it is the deliberate, structured set of actions across one to two weeks that determines whether the book lands or disappears. M11 is operational, not creative.',
        weeks: [
          'Launch week minus 1 — final landing-page polish, launch-day email to the existing audience pre-drafted, social posts queued, podcast or interview appearances scheduled where possible.',
          'Launch week — book goes live. Launch-day email to The Prompt subscribers and LinkedIn network. Social posts across the week, not all on day 1. Personal thank-yous to the ARC reviewers who actually reviewed. The first week is the bulk of first-month sales.',
          'Post-launch week — capture every review, every mention, every distribution. Respond personally to readers who reach out. The week-after-launch is where you discover what the book is actually about for readers — sometimes different from what you intended.',
          'First-month numbers reviewed honestly. Sales (or downloads, for self-pub), reviews, distribution. What is the book doing in the world? The honest assessment shapes M12 and Y2.',
        ],
        gate: 'Book launched publicly. Launch-week distribution executed across owned and earned channels. First-month numbers documented honestly. The book exists in the world as a real artifact.',
      },
      {
        n: 12,
        title: 'Post-launch positioning and Y2 plan',
        why: 'The book exists. M12 is about what happens next — sustained distribution rather than launch burst, the conversations the book enables, the Y2 work the book funds or unlocks. Most authors stop at launch. The ones who get long compounding from a book treat M12 onward as just as important as the launch week.',
        weeks: [
          'Sustained distribution — speaking engagements, podcast appearances, guest essays in venues that drive the book\'s audience. The book is the credential; the speaking is the distribution. Book at least 3 speaking or interview slots in the next 90 days.',
          'Partner Network and Intinc integration — the book updates your Partner Network listing, your LinkedIn bio, the Intinc internal positioning. The credential is leveraged across every existing channel, deliberately, not assumed.',
          'Y2 plan written — what does the next year look like with this book in the world? Is the deferred book now Y2? Is the work shift toward speaking or workshops based on the book? Is there a Y2 book sequel or follow-on? The plan is written, not assumed.',
          'Year retrospective — what changed when the book existed? What did you learn about your own writing, your own discipline, your own readers? The retrospective feeds the Personal Brand arc Q4 work and becomes a Prompt edition or LinkedIn post.',
        ],
        gate: 'Sustained distribution plan executing. Book integrated into Partner Network and personal-brand assets. Y2 plan written. Retrospective published. The book is now a compounding asset, not a launch event.',
      },
    ],
  },
];

const STAGES = [
  { type: 'stage', label: 'Stage 1', name: 'Outline',  sub: 'Spine + chapter map · M1-M2', fill: 100 },
  { type: 'stage', label: 'Stage 2', name: 'Draft',    sub: 'Full manuscript · M3-M6',     fill: 85  },
  { type: 'stage', label: 'Stage 3', name: 'Edit',     sub: 'Structure + line · M7-M8',    fill: 70  },
  { type: 'stage', label: 'Stage 4', name: 'Pitch',    sub: 'Path decision · M9',          fill: 55  },
  { type: 'stage', label: 'Stage 5', name: 'Launch',   sub: 'Release + distribution · M10-M12', fill: 95 },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');
* { box-sizing: border-box; }
:root {
  --bg: #06101a; --bg-2: #0a1828; --fg: #e0f0fc; --fg-dim: #6896b8;
  --accent: #06b6d4; --accent-2: #67e8f9; --accent-dim: #0e7490;
  --gate: #10b981; --muted: #1a3850; --card: #0a1828; --border: #16263a; --border-bright: #1f3650;
}
body, .arc-root { margin: 0; background: var(--bg); color: var(--fg); font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
.arc-root { min-height: 100vh; background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(6,182,212,0.10), transparent 60%), radial-gradient(ellipse 55% 35% at 100% 100%, rgba(16,185,129,0.05), transparent 65%), var(--bg); padding: 48px 24px 96px; }
.container { max-width: 1120px; margin: 0 auto; }
.header-grid { display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end; padding-bottom: 32px; border-bottom: 1px solid var(--border); margin-bottom: 48px; }
.kicker { font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em; color: var(--accent); margin: 0 0 16px; display: flex; align-items: center; gap: 8px; }
.title-serif { font-family: 'Instrument Serif', serif; font-size: clamp(42px, 6vw, 76px); line-height: 0.95; letter-spacing: -0.02em; margin: 0; font-weight: 400; color: var(--fg); }
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub { font-size: 13px; color: var(--fg-dim); margin: 16px 0 0; max-width: 54ch; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--accent); font-weight: 500; }
.stages-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0; margin-bottom: 48px; border: 1px solid var(--border); overflow: hidden; }
.stage-item { padding: 16px 16px 20px; border-right: 1px solid var(--border); position: relative; }
.stage-item:last-child { border-right: none; }
.stage-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 5px; }
.stage-name { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; line-height: 1.15; font-weight: 400; margin-bottom: 3px; color: var(--accent); }
.stage-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(6,182,212,0.65); }
.stage-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.stage-bar-fill { background: var(--accent); height: 100%; opacity: 0.85; }
.tradeoff { border: 1px solid var(--accent); border-left-width: 3px; background: linear-gradient(90deg, rgba(6,182,212,0.07), rgba(6,182,212,0.01)); padding: 20px 24px; margin-bottom: 56px; display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: start; }
.tradeoff-icon { color: var(--accent); margin-top: 2px; }
.tradeoff h3 { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; margin: 0 0 8px; color: var(--accent); font-weight: 400; }
.tradeoff-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 12px; font-size: 12.5px; }
.tradeoff-grid h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--fg-dim); margin: 0 0 6px; }
.tradeoff-grid ul { margin: 0; padding-left: 16px; color: var(--fg); }
.tradeoff-grid li { margin-bottom: 4px; }
.fork-note { margin-top: 14px; padding: 12px 16px; border: 1px dashed var(--border-bright); background: rgba(6,182,212,0.03); font-size: 12.5px; color: var(--fg); }
.fork-note strong { color: var(--accent); }
.quarter-rail { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-bottom: 40px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.qtab { padding: 20px 18px; cursor: pointer; background: transparent; border: none; border-right: 1px solid var(--border); text-align: left; color: var(--fg-dim); transition: background 0.2s, color 0.2s; font-family: 'JetBrains Mono', monospace; position: relative; }
.qtab:last-child { border-right: none; }
.qtab:hover { background: var(--bg-2); color: var(--fg); }
.qtab.active { background: var(--bg-2); color: var(--fg); }
.qtab.active::before { content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 2px; background: var(--accent); }
.qtab-num { font-size: 10px; letter-spacing: 0.2em; color: var(--accent); text-transform: uppercase; }
.qtab-phase { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 22px; line-height: 1.1; margin: 6px 0 4px; color: inherit; font-weight: 400; }
.qtab.active .qtab-phase { color: var(--fg); }
.qtab-sub { font-size: 11px; color: var(--fg-dim); line-height: 1.4; }
.months { display: grid; gap: 16px; }
.month { border: 1px solid var(--border); background: var(--card); transition: border-color 0.2s; }
.month:hover { border-color: var(--border-bright); }
.month.open { border-color: var(--accent); }
.month-head { padding: 20px 24px; cursor: pointer; display: grid; grid-template-columns: 80px 1fr auto; gap: 24px; align-items: center; user-select: none; }
.month-num { font-family: 'Instrument Serif', serif; font-size: 48px; line-height: 1; color: var(--accent); font-style: italic; font-weight: 400; }
.month-title { font-size: 15px; font-weight: 500; color: var(--fg); margin: 0 0 4px; letter-spacing: -0.01em; }
.month-why { font-size: 12px; color: var(--fg-dim); margin: 0; max-width: 64ch; }
.month-chev { color: var(--fg-dim); transition: transform 0.25s; }
.month.open .month-chev { transform: rotate(90deg); color: var(--accent); }
.month-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
.month.open .month-body { max-height: 900px; }
.month-body-inner { padding: 4px 24px 24px; border-top: 1px dashed var(--border); margin-top: 4px; }
.weeks { display: grid; gap: 8px; margin: 16px 0 20px; }
.week { display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: start; padding: 10px 12px; background: var(--bg-2); border-left: 2px solid var(--border-bright); cursor: pointer; transition: border-color 0.15s, background 0.15s; }
.week:hover { border-left-color: var(--accent); }
.week.done { border-left-color: var(--accent); background: rgba(6,182,212,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(6,182,212,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }
.gate { display: grid; grid-template-columns: auto 1fr; gap: 12px; padding: 14px 16px; border: 1px solid rgba(16,185,129,0.3); background: rgba(16,185,129,0.04); align-items: start; }
.gate-icon { color: var(--gate); margin-top: 1px; }
.gate-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--gate); margin-bottom: 4px; }
.gate-text { font-size: 13px; color: var(--fg); font-family: 'Instrument Serif', serif; font-style: italic; line-height: 1.45; }
.progress-wrap { position: sticky; top: 0; background: var(--bg); padding: 12px 0 16px; margin-bottom: 24px; z-index: 10; border-bottom: 1px solid var(--border); }
.progress-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.progress-label { font-size: 10px; letter-spacing: 0.2em; color: var(--fg-dim); text-transform: uppercase; }
.progress-val { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; color: var(--accent); }
.progress-track { height: 2px; background: var(--border); position: relative; overflow: hidden; }
.progress-fill { position: absolute; top: 0; left: 0; bottom: 0; background: var(--accent); transition: width 0.4s ease; }
.claims { margin-top: 72px; padding: 24px; border: 1px solid var(--border); background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7; }
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }
@media (max-width: 720px) { .header-grid { grid-template-columns: 1fr; } .meta { text-align: left; } .stages-strip { grid-template-columns: 1fr 1fr; } .stage-item:nth-child(2) { border-right: none; } .stage-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); } .tradeoff-grid { grid-template-columns: 1fr; } .quarter-rail { grid-template-columns: 1fr 1fr; } .qtab:nth-child(2) { border-right: none; } .qtab:nth-child(-n+2) { border-bottom: 1px solid var(--border); } .month-head { grid-template-columns: 56px 1fr auto; gap: 16px; padding: 16px; } .month-num { font-size: 36px; } .month-body-inner { padding: 4px 16px 20px; } }
`;

export default function BookArc() {
  const [activeQ, setActiveQ] = useState(0);
  const [openMonth, setOpenMonth] = useState(1);
  const [done, setDone] = useState(new Set());
  const totalWeeks = 48;
  const pct = Math.round((done.size / totalWeeks) * 100);
  const toggleWeek = (key) => { setDone((prev) => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; }); };
  const quarter = ARC[activeQ];

  return (
    <>
      <style>{STYLE}</style>
      <div className="arc-root">
        <div className="container">
          <div className="header-grid">
            <div>
              <p className="kicker"><BookOpen size={12} /> Learning Ops // Output Lane</p>
              <h1 className="title-serif">The <em>Book</em> Arc.</h1>
              <p className="title-sub">
                12 months. One book chosen at M1 — memoir or practitioner, never both. Spine,
                structure, sample chapters in Q1. Full manuscript first draft in Q2. Two structural
                edits and professional review in Q3. Publication path decided. Final production
                locked in Q4. The book exists in the world as a real artifact by M12, with sustained
                distribution and a written Y2 plan.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Fork: <strong>Memoir OR Practitioner · M1</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>Published book + Y2 plan</strong></div>
            </div>
          </div>

          <div className="stages-strip">
            {STAGES.map((s) => (
              <div key={s.name} className={`stage-item is-${s.type}`}>
                <div className="stage-label">{s.label}</div>
                <div className="stage-name">{s.name}</div>
                <div className="stage-sub">{s.sub}</div>
                <div className="stage-bar"><div className="stage-bar-fill" style={{ width: `${s.fill}%` }} /></div>
              </div>
            ))}
          </div>

          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — the failure mode is writing two books at once.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Most book projects fail not from lack of skill or time but from the practitioner
                trying to make progress on two books simultaneously. The memoir and the practitioner
                book serve different audiences, require different voices, and live in different
                markets. M1 forces an explicit, dated decision. The other book gets deferred without
                shame — but it is deferred, not "also in progress."
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>A published book — the most durable brand artifact in any practitioner\'s portfolio, compounding for years after launch</li>
                    <li>The discipline of writing a long-form work, which transfers to every future writing project (Prompt editions, framework documents, course curriculum)</li>
                    <li>If memoir: the spine ("Construction, Not Recovery") resolved into a real artifact — the relationship with Phillis\'s memory landed cleanly</li>
                    <li>If practitioner: a Partner Network and AIaaS asset that closes deals faster than any deck — the book pre-sells the engagement</li>
                    <li>Y2 freedom to write the deferred book without the half-decade of "I should write a book someday" weight</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up / risk</h4>
                  <ul>
                    <li>5-10 hrs/week of consistent writing time across 12 months — non-negotiable, and the largest single time commitment in any arc</li>
                    <li>The other book is genuinely deferred, not paused. Y2 is the earliest realistic restart. Some practitioners cannot accept this and the arc fails at M1</li>
                    <li>Books that under-perform are emotionally costly in ways that engineering work is not. Plan for the possibility that the launch landing softer than hoped is okay, not a failure</li>
                    <li>The professional editor budget ($2-5K) and self-pub costs ($1-3K) if going that path are real out-of-pocket investments</li>
                  </ul>
                </div>
              </div>
              <div className="fork-note">
                <strong>The fork rule that determines whether this arc succeeds:</strong> the M1
                decision is binding for 12 months. The other book is named, dated as Y2+, and not
                touched. The practitioner who keeps "just a few notes" on the deferred book during
                this arc finishes neither book. The one who closes the fork in M1 finishes one
                book in M12. The discipline is in the closing, not the deciding.
              </div>
            </div>
          </div>

          <div className="progress-wrap">
            <div className="progress-top">
              <span className="progress-label">Weekly sprints complete</span>
              <span className="progress-val">{done.size} / {totalWeeks} · {pct}%</span>
            </div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
          </div>

          <div className="quarter-rail">
            {ARC.map((q, i) => (
              <button key={q.quarter} className={`qtab ${i === activeQ ? 'active' : ''}`} onClick={() => setActiveQ(i)}>
                <div className="qtab-num">{q.quarter} · Months {q.months[0].n}–{q.months[q.months.length - 1].n}</div>
                <div className="qtab-phase">{q.phase}</div>
                <div className="qtab-sub">{q.subtitle}</div>
              </button>
            ))}
          </div>

          <div className="months">
            {quarter.months.map((m) => {
              const isOpen = openMonth === m.n;
              return (
                <div key={m.n} className={`month ${isOpen ? 'open' : ''}`}>
                  <div className="month-head" onClick={() => setOpenMonth(isOpen ? null : m.n)}>
                    <div className="month-num">M{String(m.n).padStart(2, '0')}</div>
                    <div>
                      <h3 className="month-title">{m.title}</h3>
                      <p className="month-why">{m.why}</p>
                    </div>
                    <ChevronRight className="month-chev" size={20} />
                  </div>
                  <div className="month-body">
                    <div className="month-body-inner">
                      <div className="weeks">
                        {m.weeks.map((w, wi) => {
                          const key = `${m.n}-${wi}`;
                          const isDone = done.has(key);
                          return (
                            <div key={key} className={`week ${isDone ? 'done' : ''}`} onClick={() => toggleWeek(key)}>
                              <span className="week-label">W{wi + 1}</span>
                              <span className="week-text">{w}</span>
                              {isDone ? <CheckCircle2 size={16} className="week-check" /> : <Circle size={16} className="week-check" />}
                            </div>
                          );
                        })}
                      </div>
                      <div className="gate">
                        <Flag size={16} className="gate-icon" />
                        <div>
                          <div className="gate-label">Manuscript gate · M{m.n}</div>
                          <div className="gate-text">{m.gate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="claims">
            <h4><Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />CLAIMS &amp; ASSUMPTIONS</h4>
            <ul>
              <li><strong style={{ color: 'var(--fg)' }}>This is a HIGH-load arc that runs on writing time, not engineering time.</strong> 5-10 hrs/week minimum, mostly in dedicated writing sessions rather than fitted between other work. Writing is fundamentally different from coding — context-switching costs are higher, momentum is more fragile. Plan dedicated mornings or evenings.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The M1 fork is the most important decision in the arc.</strong> Most arc failures trace back to M1 — the practitioner who chose memoir but kept working on the practitioner book "just for notes" finishes neither. The fork decision is binding. The deferred book is dated and untouched.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The 18-month real-world Book project compressed to 12 months.</strong> Most published books take 18-24 months from first chapter to launch. This arc compresses to 12 by being strict on scope, structure, and the M9 path decision. If the chosen book genuinely needs 18 months (likely for memoir), accept that M10-M12 may push to M13-M15 — the launch is the gate, not the calendar.</li>
              <li><strong style={{ color: 'var(--fg)' }}>Out-of-pocket costs are real.</strong> Professional editor: <code>$2-5K</code>. Cover designer (self-pub): <code>$500-2K</code>. ISBN block, formatting tools, ARC printing: <code>$500-1K</code>. Budget <code>$3-8K</code> total. Some can be deferred; the editor cannot.</li>
              <li><strong style={{ color: 'var(--fg)' }}>This arc feeds Personal Brand arc directly.</strong> M11 launch and M12 retrospective become Brand arc Q4 flagship content. The book is the most concrete brand asset possible. Sequence Book arc Q4 to align with Personal Brand arc Q4 if running both.</li>
              <li><strong style={{ color: 'var(--fg)' }}>The book may under-perform — and that has to be okay.</strong> Most first books sell modestly. The compounding value is in the credential, the discipline learned, the conversations the book enables. If first-month sales are the only metric, most first-time authors are disappointed. The honest framing is: the book is the artifact that exists; commercial success is a separate bet.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
