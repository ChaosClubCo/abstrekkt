import React, { useState, useMemo } from 'react';
import { FileText, Send, Edit3, Printer, Compass, Briefcase, Layers, BookOpen } from 'lucide-react';

const LANES = [
  {
    id: 'ff', name: 'FlashFusion', em: 'FlashFusion', accent: '#7c3aed', icon: Briefcase,
    recipients: [
      {
        id: 'client_audit_recap', label: 'Audit recap to client',
        sub: 'Post-delivery summary · case study consent ask',
        tldr: 'Recap of the audit we delivered last week. The three highest-leverage findings, the recommended sequencing, and one ask about case study permission so this work can serve future engagements.',
        body: 'Hi [name],\n\nQuick recap of the audit we wrapped last [day/week]. Three findings worth your direct attention:\n\n1. [Highest-leverage finding — specific, measurable, with the recommendation in one sentence]\n2. [Second finding]\n3. [Third finding]\n\nSequencing recommendation: address #1 in the next two weeks; #2 and #3 can wait for the sprint engagement if you decide to go that direction.\n\nOne ask: would you be open to letting me use this engagement as a case study (anonymized to whatever extent you prefer)? It helps future clients see the shape of what we do; it does not have to surface your company name.\n\nHappy to talk through any of it on a follow-up call.\n\nBest,\nKyle',
        asks: 'Case study consent. Decision on sprint engagement timing.',
      },
      {
        id: 'prospect_outreach', label: 'Outreach to warm prospect',
        sub: 'Floor pricing held · case study attached',
        tldr: 'Initial outreach to a warm prospect with a clear pitch and a case study attached. Hold the $4,500 floor without flinching. The exception list does not grow.',
        body: 'Hi [name],\n\n[One-sentence personal opener that proves this isn\'t cold — referenced person, prior conversation, specific work they did].\n\nI run an AI enablement practice that does one specific thing well: 30-day audits that produce a sequenced roadmap of where AI fits and where it doesn\'t, scoped to your actual stack and team.\n\nAttached case study from a recent engagement gives you the shape of what gets delivered. The audit is $4,500 fixed. Three to four weeks. Outcome is a roadmap document and a working session walking your team through it.\n\nIf the timing or fit isn\'t right, no worries — but if it is, happy to set up a 30-min discovery call to scope properly before either of us commits.\n\nBest,\nKyle',
        asks: 'Discovery call scheduled. Decision-maker confirmed.',
      },
      {
        id: 'sprint_kickoff', label: 'Sprint kickoff to client',
        sub: 'Scope locked in writing · cadence set',
        tldr: 'Kickoff for the Enablement Sprint. Scope locked in writing, cadence set, escalation path clear. The first week\'s deliverables and what success looks like.',
        body: 'Hi [name],\n\nLooking forward to the sprint kickoff [day/date]. To get everyone aligned before we start:\n\n**Scope (in writing, locked)**\n[Bullet list of in-scope deliverables — be specific]\n\n**Out of scope (also in writing)**\n[Bullet list of what we are NOT doing — equally specific, prevents scope creep mid-sprint]\n\n**Cadence**\n- Daily Slack/email check-in (async, 5 min)\n- Weekly 45-min sync, [day] at [time]\n- Sprint review + handoff on [end date]\n\n**Success criteria**\n[1-2 specific outcomes that will tell us the sprint worked]\n\n**Escalation path**\nIf anything is unclear or going sideways, you can text me directly. Better to surface early than at the end.\n\nLooking forward to it.\n\nBest,\nKyle',
        asks: 'Kickoff call attendance confirmed. Scope sign-off via email.',
      },
    ],
  },
  {
    id: 'ccc', name: 'Abstrekkt Products', em: 'Abstrekkt Products', accent: '#34d399', icon: Layers,
    recipients: [
      {
        id: 'newsletter_essay', label: 'Newsletter essay',
        sub: 'Load-Bearing voice · no hype · what holds under load',
        tldr: 'This week: [specific tool / technique / pattern tested in real use]. The setup, what held under load, what didn\'t, what I\'d do differently. No hype, no sales pitch, just what worked.',
        body: 'Last [day/week] I [specific situation that put a tool/pattern under load].\n\nHere\'s what I tried, what held, what didn\'t.\n\n## The setup\n\n[Specific context, no abstraction — readers should be able to picture the workflow]\n\n## What held under load\n\n[The tool/technique that surprised you positively. Specifics — not just "it worked great" but exactly what worked and why]\n\n## What didn\'t\n\n[Honest about the failure mode. The thing the tool claimed to do that it didn\'t. This is the section that distinguishes Load-Bearing from every other AI newsletter]\n\n## What I\'d do differently\n\n[One concrete adjustment for next time. Specific enough that a reader could apply it]\n\n— Kyle',
        asks: 'No ask. Newsletter is value-given, not value-extracted. The ask happens in adjacent surfaces.',
      },
      {
        id: 'marketplace_launch', label: 'Marketplace announcement',
        sub: 'claude-code-plugins-plus · 244 plugins · install path',
        tldr: 'Announcement of the marketplace launch. Specific install instructions. What\'s in it, what\'s NOT in it, who it\'s for, who it isn\'t for.',
        body: '[Hook — specific problem the marketplace solves, one sentence, no marketing copy]\n\nclaude-code-plugins-plus is a Claude Code marketplace catalog of 244 plugins, browseable, installable via /plugin install.\n\n**What\'s in it**\n[3-5 specific use cases the plugins cover. Pick the most concrete examples.]\n\n**What it doesn\'t do**\nIt\'s not a replacement for Anthropic\'s official tooling. It\'s a curated index of community plugins. Some are mine, most are not.\n\n**Install**\n```\n[Specific install command — must be tested, must work]\n```\n\nLink: [github URL]\n\nIf you build something with it that I should add to the catalog, the contribution guide is in the README.\n\n— Kyle',
        asks: 'Plugin contributions via PR. Issue reports for broken installs.',
      },
      {
        id: 'product_update', label: 'Product update (Ample / FissionPrompt)',
        sub: 'Beta user-facing · honest about state',
        tldr: 'Honest update on the product for current beta users. What shipped, what broke, what\'s next, what I need from you.',
        body: 'Quick update for [product] beta users.\n\n**What shipped this [period]**\n[Specific features / fixes — be honest about size of changes]\n\n**What broke / I caught**\n[Bugs found, fixes shipped or in progress. This section builds trust; do not skip it]\n\n**What\'s next**\n[Next 2-3 items in the queue. Estimated timing, hedged honestly]\n\n**What I need from you**\n[Specific feedback ask — not "any thoughts?" — something concrete like "if you\'ve hit issue X, tell me how you worked around it"]\n\nThanks for testing this. The beta phase is what makes the production version not break.\n\n— Kyle',
        asks: 'Specific feedback on named issue. Continued testing.',
      },
    ],
  },
  {
    id: 'memoir', name: 'Memoir', em: 'Memoir', accent: '#b89968', icon: BookOpen,
    recipients: [
      {
        id: 'agent_query', label: 'Agent query letter',
        sub: 'Comp titles · pitch paragraph · first 50 ready',
        tldr: 'Standard query format. Pitch paragraph, comp titles (Solomon / Maté / Cahalan), bio paragraph, ask. Adapted to the agent\'s submission guidelines.',
        body: 'Dear [Agent name],\n\n[Personalized opening — why this agent specifically. Reference a recent sale or interview, NOT generic flattery]\n\n*Construction, Not Recovery* is a literary nonfiction memoir of [word count] words about [one-sentence pitch — not the back cover, the actual structural premise]. It will resonate with readers of *[Comp title 1]* by [Author 1] and *[Comp title 2]* by [Author 2].\n\n[Two-paragraph pitch — what happens, who it\'s for, why now. The frame as letter to Kinsley should be visible. The thesis (construction, not recovery) should be visible without being announced. This is the section that earns the partial request or doesn\'t]\n\nI live in Grayslake, Illinois. [One sentence about non-memoir credentials only if directly relevant — most don\'t need to surface]\n\nFirst 50 pages and a synopsis are attached per your submission guidelines.\n\nThank you for your time.\n\nBest,\nKyle Rosebrook',
        asks: 'Partial manuscript request. Decision on representation.',
      },
      {
        id: 'test_reader', label: 'Test reader request',
        sub: 'Specific reading lens · honest signal · 2-week turnaround',
        tldr: 'Asking a trusted reader to read a specific section or draft with a specific lens. Honest about what kind of feedback you want, what kind you don\'t.',
        body: 'Hi [name],\n\nI\'m at a point in the memoir where I need one trusted reader on [specific section / full draft / specific question].\n\n**What you\'d be reading**\n[Specific scope — chapters, pages, or full draft. Word count. Estimated reading time]\n\n**The lens I need**\n[Specific question. Examples: "Does the recursive frame land?" "Does this read as recovery memoir despite my intention?" "Where does the letter-to-Kinsley frame break?"]\n\n**What I don\'t need**\nLine edits, copy editing, or "I would have written this differently." Those are useful at a later stage, not this one.\n\n**Timing**\n2-week turnaround would be great. If that\'s not workable, I\'d rather know now than have it slip silently.\n\nI know reading a draft is real time. Owe you one if you take this on.\n\nBest,\nKyle',
        asks: 'Yes/no on reading. Date locked. Specific feedback lens confirmed.',
      },
      {
        id: 'kinsley_direct', label: 'Letter to Kinsley',
        sub: 'Inside the frame · no audience awareness · private',
        tldr: 'This is not a draft for a recipient. It is inside the memoir\'s frame — the letter you\'re actually writing. The audience is one person.',
        body: '[This is the only template that doesn\'t pre-populate. The frame as letter to Kinsley is structural — it has to be written, not assembled from a starter.]\n\n[Write what you\'d say if she were sitting across from you and the whole book had to fit into one sitting. Then cut everything that is performance, that\'s a reach for a wider reader, that\'s explanation she doesn\'t need.]\n\n[What remains is what belongs in the memoir.]',
        asks: 'No ask. This category is structural rehearsal, not communication. It exists because the frame is the load-bearing element of the book.',
      },
    ],
  },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');
* { box-sizing: border-box; }
:root {
  --bg: #0c0d10; --bg-2: #14161b; --bg-3: #1c1f29;
  --paper: #f5f1e8; --paper-fg: #1a1714; --paper-fg-dim: #57514a; --paper-border: #d4cbb8; --paper-border-light: #e0d8c5;
  --fg: #e8e9ed; --fg-dim: #8a8f9a; --fg-mute: #555a65;
  --border: #1f2229; --border-bright: #2c303a;
}
body, .root { margin: 0; background: var(--bg); color: var(--fg); font-family: 'JetBrains Mono', monospace; font-size: 14px; line-height: 1.55; }
.root { min-height: 100vh; padding: 48px 24px 96px; background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(203,213,225,0.04), transparent 60%), var(--bg); }
.container { max-width: 1280px; margin: 0 auto; }

.header { display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end; padding-bottom: 24px; border-bottom: 1px solid var(--border); margin-bottom: 28px; }
.kicker { font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--fg-dim); margin: 0 0 14px; display: flex; align-items: center; gap: 8px; }
.title-serif { font-family: 'Instrument Serif', serif; font-size: clamp(38px, 5.4vw, 64px); line-height: 0.96; margin: 0; font-weight: 400; letter-spacing: -0.02em; }
.title-serif em { color: #cbd5e1; font-style: italic; }
.title-sub { font-size: 12.5px; color: var(--fg-dim); margin: 12px 0 0; max-width: 60ch; line-height: 1.6; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--fg); font-weight: 500; }

.controls { display: grid; grid-template-columns: auto auto 1fr auto; gap: 16px; align-items: center; margin-bottom: 24px; padding: 14px 18px; background: var(--bg-2); border: 1px solid var(--border); }
.control-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); }
.lane-toggles { display: flex; gap: 6px; }
.lane-pill { padding: 6px 12px; background: var(--bg-3); border: 1px solid var(--border-bright); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-dim); cursor: pointer; transition: all 0.15s; font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; gap: 6px; }
.lane-pill:hover { color: var(--fg); }
.lane-pill.active { color: var(--lp-accent); border-color: var(--lp-accent); background: rgba(255,255,255,0.02); }
.recipient-toggles { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
.recipient-pill { padding: 5px 10px; background: var(--bg-3); border: 1px solid var(--border-bright); font-size: 10px; letter-spacing: 0.06em; color: var(--fg-mute); cursor: pointer; transition: all 0.15s; font-family: 'JetBrains Mono', monospace; }
.recipient-pill:hover { color: var(--fg-dim); }
.recipient-pill.active { color: var(--lp-accent); border-color: var(--lp-accent); background: rgba(255,255,255,0.02); }
.view-toggle { padding: 6px 10px; background: var(--bg-3); border: 1px solid var(--border-bright); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-dim); cursor: pointer; font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; gap: 6px; }
.view-toggle.active { color: var(--lp-accent); border-color: var(--lp-accent); }

.draft { background: var(--paper); color: var(--paper-fg); border: 1px solid var(--paper-border); padding: 56px 64px; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.7; box-shadow: 0 24px 60px rgba(0,0,0,0.5); border-top: 4px solid var(--lp-accent); }
.draft-head { display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: end; padding-bottom: 20px; border-bottom: 1.5px solid var(--paper-fg); margin-bottom: 24px; }
.draft-title { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 34px; line-height: 1; font-weight: 400; }
.draft-title em { color: var(--lp-accent); }
.draft-stamps { text-align: right; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--paper-fg-dim); line-height: 1.7; }
.draft-stamps strong { color: var(--paper-fg); }

.draft-section { margin-bottom: 22px; }
.draft-section-label { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--lp-accent); margin-bottom: 8px; font-weight: 600; }
.draft-textarea { width: 100%; background: transparent; border: none; outline: none; resize: vertical; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.7; color: var(--paper-fg); padding: 0; min-height: 60px; border-bottom: 1px dashed var(--paper-border-light); padding-bottom: 8px; }
.draft-textarea:focus { border-bottom-color: var(--lp-accent); }
.draft-textarea.is-tldr { font-style: italic; font-size: 14px; }
.draft-textarea.is-body { min-height: 320px; }
.draft-textarea.is-asks { min-height: 60px; font-size: 12.5px; color: var(--paper-fg-dim); }

.draft-foot { margin-top: 28px; padding-top: 18px; border-top: 1px solid var(--paper-border); display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--paper-fg-dim); }
.draft-foot-sig { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 14px; color: var(--paper-fg); letter-spacing: 0; text-transform: none; }

.claims { margin-top: 36px; padding: 22px; border: 1px solid var(--border); background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7; }
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }
.claims strong { color: var(--fg); font-weight: 500; }

@media (max-width: 980px) {
  .header { grid-template-columns: 1fr; } .meta { text-align: left; }
  .controls { grid-template-columns: 1fr; }
  .recipient-toggles { justify-content: flex-start; }
  .draft { padding: 32px 28px; } .draft-head { grid-template-columns: 1fr; } .draft-stamps { text-align: left; }
}
@media print { .root { background: white; padding: 0; } .container { max-width: none; } .header, .controls, .claims { display: none; } .draft { box-shadow: none; border: none; padding: 0; } }
`;

export default function CommunicationComposer() {
  const [laneId, setLaneId] = useState('ff');
  const [recipientId, setRecipientId] = useState('client_audit_recap');
  const [edits, setEdits] = useState({});
  const [printView, setPrintView] = useState(false);

  const lane = LANES.find(l => l.id === laneId);
  const recipient = lane.recipients.find(r => r.id === recipientId);

  // When lane changes, default to first recipient of that lane
  const handleLaneChange = (id) => {
    setLaneId(id);
    const newLane = LANES.find(l => l.id === id);
    setRecipientId(newLane.recipients[0].id);
  };

  const editKey = (field) => `${laneId}-${recipientId}-${field}`;
  const getField = (field, fallback) => edits[editKey(field)] ?? fallback;
  const setField = (field, val) => setEdits(prev => ({ ...prev, [editKey(field)]: val }));

  const Icon = lane.icon;

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header">
            <div>
              <p className="kicker"><FileText size={12} /> Communication Layer // Three Lanes</p>
              <h1 className="title-serif">The <em>Composer</em>.</h1>
              <p className="title-sub">
                Three lanes, three voices. Pick a recipient; get a recipient-tuned draft starter. Voice register changes per lane — FlashFusion consulting, Abstrekkt Products writer/builder, Memoir literary. Editable fields; print mode strips chrome.
              </p>
            </div>
            <div className="meta">
              <div>Lane <strong>{lane.em}</strong></div>
              <div style={{ marginTop: 4 }}>Recipient <strong>{recipient.label}</strong></div>
              <div style={{ marginTop: 4 }}>Voice <strong>lane-native</strong></div>
            </div>
          </div>

          <div className="controls">
            <span className="control-label">Lane</span>
            <div className="lane-toggles">
              {LANES.map(l => {
                const LIcon = l.icon;
                return (
                  <button
                    key={l.id}
                    className={`lane-pill ${laneId === l.id ? 'active' : ''}`}
                    style={{ ['--lp-accent']: l.accent }}
                    onClick={() => handleLaneChange(l.id)}
                  >
                    <LIcon size={11} />
                    {l.em}
                  </button>
                );
              })}
            </div>
            <div className="recipient-toggles" style={{ ['--lp-accent']: lane.accent }}>
              {lane.recipients.map(r => (
                <button
                  key={r.id}
                  className={`recipient-pill ${recipientId === r.id ? 'active' : ''}`}
                  style={{ ['--lp-accent']: lane.accent }}
                  onClick={() => setRecipientId(r.id)}
                >{r.label}</button>
              ))}
            </div>
            <button
              className={`view-toggle ${printView ? 'active' : ''}`}
              style={{ ['--lp-accent']: lane.accent }}
              onClick={() => setPrintView(!printView)}
            >
              {printView ? <Edit3 size={11} /> : <Printer size={11} />}
              {printView ? 'Edit' : 'Print'}
            </button>
          </div>

          <div className="draft" style={{ ['--lp-accent']: lane.accent }}>
            <div className="draft-head">
              <h2 className="draft-title">The <em>{recipient.label.toLowerCase()}</em>.</h2>
              <div className="draft-stamps">
                <div>Lane <strong>{lane.em}</strong></div>
                <div>For <strong>{recipient.label}</strong></div>
                <div>From <strong>Kyle Rosebrook</strong></div>
              </div>
            </div>

            <div className="draft-section">
              <div className="draft-section-label">Why this · TL;DR</div>
              <textarea
                className="draft-textarea is-tldr"
                value={getField('tldr', recipient.tldr)}
                onChange={e => setField('tldr', e.target.value)}
              />
            </div>

            <div className="draft-section">
              <div className="draft-section-label">Body</div>
              <textarea
                className="draft-textarea is-body"
                value={getField('body', recipient.body)}
                onChange={e => setField('body', e.target.value)}
              />
            </div>

            <div className="draft-section">
              <div className="draft-section-label">Concrete ask / decision needed</div>
              <textarea
                className="draft-textarea is-asks"
                value={getField('asks', recipient.asks)}
                onChange={e => setField('asks', e.target.value)}
              />
            </div>

            <div className="draft-foot">
              <div><strong>{lane.em}</strong> · {recipient.sub}</div>
              <div className="draft-foot-sig">— Kyle</div>
            </div>
          </div>

          {!printView && (
            <div className="claims">
              <h4><Send size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Voice register changes per lane — not stylistic, structural</h4>
              <ul>
                <li><strong>FlashFusion voice = consulting.</strong> Direct, specific, time-bounded. Asks are explicit. Floor pricing held in copy without apology. Scope language ("in writing, locked") signals professionalism without performing it.</li>
                <li><strong>Abstrekkt Products voice = writer/builder.</strong> Honest about state — what shipped, what broke, what's next. No hype. No sales pitch. The "what didn't work" section in the newsletter starter is the load-bearing differentiator and should never be cut.</li>
                <li><strong>Memoir voice = literary.</strong> The agent query is structural; the test-reader ask is honest about kind of feedback wanted; the Kinsley letter is deliberately not pre-populated because the frame must be written, not assembled. That's a feature.</li>
                <li><strong>Defaults are intentionally a touch generic.</strong> The friction of rewriting them is what produces the specificity that makes a draft worth sending. A draft sent with default copy is a draft that wasn't written.</li>
                <li><strong>Print view strips chrome</strong> for screen-share, copy-paste-into-email, or PDF via browser print. The paper styling persists in print; the dashboard chrome disappears.</li>
                <li><strong>What this composer does not do</strong>: persist drafts between sessions (in-memory only), generate multiple variations of the same recipient, schedule sending, integrate with email clients. v2 candidates if any of these become friction in actual use.</li>
              </ul>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
