import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Calendar, Zap, Target, AlertTriangle, Compass, Flag } from 'lucide-react';

// ---------------------------------------------------------------------------
// ARC DATA — three arcs with full M1-M12 × W1-W4 sprint data
// Sustainable preset: Claude (6h) + Security (7h) + Brand (4h) = 17h/wk balanced
// Extend by adding more arcs to this array following the same structure.
// ---------------------------------------------------------------------------

const ARCS = [
  {
    id: 'claude',
    title: 'Claude Arc',
    em: 'Claude',
    accent: '#e07856',
    loadHrs: 6,
    series: 1,
    gates: [
      'Architect Foundations cert earned',
      'Sonnet 4.6 differences applied to one production project',
      'Tool use + structured outputs patterns operational',
      'Computer use exploratory project shipped',
      'First MCP server published to Anthropic registry',
      'Constitutional AI principles internalized + documented',
      'Agentic workflow patterns documented as playbook',
      'Multi-agent orchestration first version shipped',
      'Prompt eval discipline operational across 3 projects',
      'Production deployment runbook published',
      'Claude Architect cert sit + passed',
      'Year retrospective + Y2 Claude depth plan published',
    ],
    sprints: [
      'Architect Foundations modules 1-3. RAG fundamentals notes.',
      'Modules 4-6. First architecture diagram in your own voice.',
      'Modules 7-9. Schedule exam window. Daily practice questions.',
      'Modules 10-final. Exam sit. Pass or document remediation.',
      'Re-read Sonnet 4.6 system card. Identify 5 work-affecting changes.',
      'Apply Sonnet 4.6 patterns to one existing project. Measure delta.',
      'Compare Sonnet 4.6 to Opus 4.6 across 3 use cases. Tradeoffs documented.',
      'Write findings as Prompt edition or LinkedIn long-form post.',
      'Tool use deep dive. Build 3 internal tool definitions for daily work.',
      'Structured outputs across 5 different prompt patterns. Eval each.',
      'Combine tool use + structured outputs in one production-grade workflow.',
      'Workflow shipped to internal Intinc use case. Document and measure.',
      'Computer use docs read. Sandbox installed locally. First trivial test.',
      'Computer use spike: navigate one specific workflow Kyle would automate.',
      'Document failure modes. Identify where computer use is genuinely useful.',
      'Ship the exploratory project. Internal demo to Daniel.',
      'MCP server architecture review. Pick the server to build (productivity-adjacent).',
      'Build MCP server core. Schema, tool definitions, basic logic.',
      'MCP server polish + documentation. README that another dev could use.',
      'Publish to Anthropic MCP registry. LinkedIn announcement.',
      'Read Constitutional AI papers (original + recent updates).',
      'Apply CAI principles to one of your prompts. Before/after comparison.',
      'Document the CAI vs raw prompting tradeoff for AIaaS service line.',
      'Mid-year retrospective. M1-M6 honest assessment. M7-M12 plan locked.',
      'Agentic workflow patterns: research the canon (LangGraph, Anthropic SDK).',
      'Build one multi-step agent for a real Intinc use case.',
      'Agent observability: logging, eval, failure recovery patterns.',
      'Document the agentic playbook as Prompt edition.',
      'Multi-agent architecture: orchestrator pattern, supervisor pattern.',
      'Build supervisor pattern POC for an Intinc workflow.',
      'Multi-agent failure modes documented. Where it works vs where it breaks.',
      'Ship first multi-agent system to internal use. Daniel/Jackie demo.',
      'Prompt eval discipline: integrate Promptfoo or LangSmith into one project.',
      'Build eval datasets for 3 active prompts. Run baseline + iteration.',
      'Eval-driven prompt improvement: measurable delta documented.',
      'Document the eval-as-process playbook. Eval arc dependency check.',
      'Production deployment patterns: rate limits, retries, observability.',
      'Build production-grade wrapper around one Claude integration.',
      'Cost optimization patterns: prompt caching, model routing, batch APIs.',
      'Ship deployment runbook as published artifact + GitHub repo.',
      'Claude Architect cert prep: Anthropic learning paths review.',
      'Practice exam #1. Identify weak areas. Remediate.',
      'Practice exam #2-3. Confirm readiness. Schedule real exam.',
      'Architect cert sit. Pass or document specific remediation + retake date.',
      'Year retrospective draft: what changed in Claude practice over 12 months.',
      'Retrospective: cross-arc dependencies surfaced (MCP, Eval, AIaaS feeds).',
      'Y2 Claude depth plan: deeper specialization or maintenance cadence.',
      'Retrospective published as Prompt edition. Personal Brand arc Q4 feed.',
    ],
  },
  {
    id: 'security',
    title: 'Security Arc',
    em: 'Security',
    accent: '#e05252',
    loadHrs: 7,
    series: 1,
    gates: [
      'OWASP Top 10 for LLMs internalized + applied to current systems',
      'Threat modeling toolkit for AI systems documented',
      'Prompt injection defense patterns operational',
      'Multi-tenant isolation architecture documented',
      'SecAI+ cert sit + passed',
      'Adversarial testing toolkit operational',
      'Multi-tenant isolation capstone shipped',
      'AI access control patterns documented as playbook',
      'Incident response runbook for AI failures',
      'Compliance framework introduction (HIPAA + SOC2 surface)',
      'CAISP cert sit + passed',
      'Security year retrospective + Series 3 Regulated arc decision',
    ],
    sprints: [
      'OWASP Top 10 for LLMs spec read in full. Notes on each category.',
      'Apply Top 10 to 3 existing Intinc AI systems. Findings documented.',
      'Pick the 3 highest-severity findings. Mitigations designed.',
      'Mitigations implemented or queued. Top 10 audit complete.',
      'Threat modeling fundamentals (STRIDE, PASTA). Read primary sources.',
      'Threat model one Intinc AI deployment end-to-end.',
      'Threat modeling toolkit: template, examples, runbook.',
      'Apply toolkit to second deployment. Pattern emerging.',
      'Prompt injection types: direct, indirect, multi-modal. Documented.',
      'Defense patterns: input filtering, prompt boundaries, output filtering.',
      'Build injection test suite against one Intinc system. Findings.',
      'Defense patterns deployed where needed. Test suite as CI/CD asset.',
      'Multi-tenant isolation: read enterprise patterns (Microsoft, AWS).',
      'Apply isolation patterns to AI Search / Vector DB if relevant.',
      'Multi-tenant architecture diagram for one Intinc deployment.',
      'Mid-quarter review: M1-M4 audit. Strongest finding documented.',
      'SecAI+ cert prep: exam outline review.',
      'Cert prep: practice exams. Weak areas identified.',
      'Cert prep: drill weak areas. Mock exam under conditions.',
      'SecAI+ cert sit. Pass or remediation + retake.',
      'Adversarial testing: red-team techniques canon (Anthropic, Apollo).',
      'Build adversarial test suite for one Intinc deployment.',
      'Run adversarial campaign. Document successes + failures.',
      'Findings synthesized as internal artifact. Possible Prompt edition.',
      'Multi-tenant isolation capstone: scope decision.',
      'Architecture work: end-to-end multi-tenant AI Search deployment.',
      'Implementation week. Document gotchas in real time.',
      'Capstone shipped. Internal demo. Documentation published.',
      'AI access control: RBAC, ABAC, identity federation for AI.',
      'Entra ID + AI service integration patterns documented.',
      'Build access control playbook for AIaaS service line.',
      'Playbook reviewed by Daniel. Integrated into AIaaS positioning.',
      'Incident response: classical IR + AI-specific failure modes.',
      'Build IR runbook for prompt-injection-as-incident scenario.',
      'Build IR runbook for data-leak-via-inference scenario.',
      'IR runbook tested via tabletop exercise. Refined.',
      'Compliance frameworks intro: HIPAA Security Rule primary source.',
      'SOC 2 Trust Service Criteria. NIST AI RMF four functions.',
      'Map current AIaaS service line against framework surface.',
      'Compliance surface document published. Daniel briefed.',
      'CAISP cert prep: exam outline + study guide.',
      'Cert prep: practice exams. Weak area drill.',
      'Cert prep: mock exam. Confirm readiness.',
      'CAISP cert sit. Pass or remediation + retake.',
      'Year retrospective draft: 12-month security depth growth.',
      'Retrospective: cross-arc feeds (Teaching, Regulated arc M1-M3 prereqs).',
      'Series 3 Regulated AI Security arc decision: Y2 or defer.',
      'Retrospective published. Brand arc Q4 feed.',
    ],
  },
  {
    id: 'brand',
    title: 'Brand Arc',
    em: 'Brand',
    accent: '#38bdf8',
    loadHrs: 4,
    series: 1,
    gates: [
      'LinkedIn positioning audit complete + repositioning live',
      'The Prompt editorial cadence locked at weekly',
      'First flagship long-form post published',
      'CLC strategic conversation completed',
      'Anthropic Ambassador pathway initiated',
      '500 followers checkpoint',
      'Flagship long-form #2 published (technical depth piece)',
      'Speaking circuit: first booking confirmed',
      'First podcast appearance recorded',
      '1000 followers checkpoint',
      'Year flagship: substantial published artifact',
      'Year retrospective + Y2 brand strategy',
    ],
    sprints: [
      'LinkedIn audit: bio, headline, About section, recent post performance.',
      'Repositioning draft: niche + value prop sharpened.',
      'Repositioning live: bio, headline, About updated.',
      'First post under new positioning. Engagement baseline measured.',
      'The Prompt audit: subscriber count, open rate, recent edition quality.',
      'Editorial cadence decision: weekly vs biweekly. Lock for Y1.',
      'Editorial calendar for next 12 weeks drafted.',
      'First edition under locked cadence. Distribution motion executed.',
      'Flagship #1 topic decision: from cross-arc capstone candidates.',
      'Flagship draft: 1,500-3,000 words. Structural outline first.',
      'Flagship polish: voice consistency, structural integrity.',
      'Flagship published. Multi-channel distribution executed.',
      'CLC institutional context: current state of relationship.',
      'CLC strategic conversation prep: agenda, asks, value to offer.',
      'CLC conversation conducted. Outcomes documented.',
      'CLC follow-through commitments scheduled and tracked.',
      'Anthropic Ambassador research: pathway, criteria, application.',
      'Ambassador application prep: portfolio, references, positioning.',
      'Application submitted or pathway initiated.',
      'Mid-year retrospective: M1-M6 brand audit. M7-M12 plan locked.',
      '500 followers checkpoint: where are you, what works, what does not.',
      'Engagement audit: posts that produced inbound. Pattern documented.',
      'Doubling-down on what works. Cutting what does not.',
      'First piece using the refined approach. Measured against baseline.',
      'Flagship #2 topic decision: technical depth piece tied to engineering arc.',
      'Flagship draft: technical depth, accessible voice.',
      'Flagship polish + technical review by peer.',
      'Flagship published. Engineering community distribution venues.',
      'Speaking circuit research: 5-8 relevant venues. CFPs reviewed.',
      'Speaking submissions: 3 submitted across different venues.',
      'Direct outreach to track chairs at most-relevant venues.',
      'First booking confirmation OR pivot to podcast circuit.',
      'Podcast circuit: 5 podcasts identified, specific pitches drafted.',
      'Podcast pitches sent. Tracking responses.',
      'First podcast scheduled. Talking points prepared.',
      'First podcast recorded. Distribution amplification planned.',
      '1000 followers checkpoint: trajectory honest. Cumulative learning.',
      'Y2 brand strategy first draft.',
      'Y2 brand strategy review with peer or advisor.',
      'Y2 strategy committed. Q4 work shapes around it.',
      'Year flagship topic decision: book launch tie-in, methodology framework, or capstone synthesis.',
      'Year flagship: substantial draft. 3,000-5,000 words minimum.',
      'Year flagship: external review by 2-3 readers. Revisions integrated.',
      'Year flagship published. Major distribution push.',
      'Year retrospective draft: 12-month brand audit honest.',
      'Retrospective: cross-arc integration (Book, Course, Partner all feed).',
      'Retrospective polish. Y2 brand strategy referenced.',
      'Year retrospective published as Prompt edition. Y1 arc closed.',
    ],
  },
];

// ---------------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700&display=swap');

* { box-sizing: border-box; }

:root {
  --bg: #0d0e12;
  --bg-2: #161820;
  --bg-3: #1c1f29;
  --fg: #e8e9ed;
  --fg-dim: #8a8f9a;
  --fg-mute: #555a65;
  --border: #1f2229;
  --border-bright: #2c303a;
  --warn: #fb923c;
  --ok: #4ade80;
}

body, .root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 40% at 50% -10%, rgba(203,213,225,0.03), transparent 60%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1280px; margin: 0 auto; }

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
  font-family: 'Instrument Serif', serif; font-size: clamp(38px, 5.4vw, 64px);
  line-height: 0.96; letter-spacing: -0.02em; margin: 0; font-weight: 400; color: var(--fg);
}
.title-serif em { color: #cbd5e1; font-style: italic; }
.title-sub {
  font-size: 12.5px; color: var(--fg-dim); margin: 12px 0 0;
  max-width: 56ch; line-height: 1.6;
}
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--fg); font-weight: 500; }

/* POSITION CONTROLS */
.controls {
  display: grid; grid-template-columns: auto auto 1fr; gap: 16px; align-items: center;
  margin-bottom: 24px; padding: 14px 18px;
  background: var(--bg-2); border: 1px solid var(--border);
}
.control-block { display: flex; align-items: center; gap: 10px; }
.control-label {
  font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim);
}
.control-stepper { display: flex; align-items: center; gap: 4px; }
.stepper-btn {
  background: var(--bg-3); border: 1px solid var(--border-bright);
  color: var(--fg); padding: 4px 6px; cursor: pointer; display: flex; align-items: center;
  transition: background 0.15s;
}
.stepper-btn:hover { background: var(--border-bright); }
.stepper-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.stepper-val {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 22px; color: var(--fg); padding: 0 8px; min-width: 40px; text-align: center;
}
.arc-toggles { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
.arc-toggle {
  padding: 5px 10px; background: var(--bg-3); border: 1px solid var(--border-bright);
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-dim);
  cursor: pointer; transition: all 0.15s; font-family: 'JetBrains Mono', monospace;
  display: flex; align-items: center; gap: 6px;
}
.arc-toggle:hover { color: var(--fg); }
.arc-toggle.active {
  color: var(--at-accent); border-color: var(--at-accent);
  background: rgba(255,255,255,0.02);
}
.arc-toggle-dot {
  width: 8px; height: 8px; background: var(--at-accent); opacity: 0.4;
  transition: opacity 0.15s;
}
.arc-toggle.active .arc-toggle-dot { opacity: 1; }

/* LAYOUT */
.layout { display: grid; grid-template-columns: 1fr 320px; gap: 28px; align-items: start; }

/* ARC CARDS */
.arc-grid { display: grid; gap: 16px; }
.arc-card {
  border: 1px solid var(--border); border-left: 3px solid var(--ac-accent);
  background: var(--bg-2);
}
.arc-card-head {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center;
}
.arc-card-title {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 22px; color: var(--fg); font-weight: 400; line-height: 1.1;
}
.arc-card-title em { color: var(--ac-accent); font-style: italic; }
.arc-card-load {
  font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--fg-dim);
}
.arc-card-load strong { color: var(--ac-accent); font-weight: 600; }

.arc-month-gate {
  padding: 10px 18px; background: rgba(0,0,0,0.2);
  border-bottom: 1px solid var(--border);
  display: grid; grid-template-columns: auto 1fr; gap: 10px; align-items: start;
}
.gate-icon { color: var(--ac-accent); opacity: 0.6; margin-top: 1px; }
.gate-label {
  font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--ac-accent); opacity: 0.85; margin-bottom: 3px;
}
.gate-text {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 13px; color: var(--fg); line-height: 1.4;
}

.weeks-row {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
  border-top: 1px solid var(--border);
}
.week-cell {
  padding: 12px 14px;
  border-right: 1px solid var(--border);
  cursor: pointer; transition: background 0.15s;
  display: grid; grid-template-rows: auto 1fr auto; gap: 8px;
  min-height: 110px;
}
.week-cell:last-child { border-right: none; }
.week-cell:hover { background: rgba(255,255,255,0.015); }
.week-cell.is-current {
  background: rgba(255,255,255,0.025);
  border-top: 2px solid var(--ac-accent);
  padding-top: 11px;
}
.week-cell.is-done .week-text {
  color: var(--fg-mute);
  text-decoration: line-through;
  text-decoration-color: rgba(255,255,255,0.2);
}
.week-cell-head {
  display: flex; justify-content: space-between; align-items: center;
}
.week-label {
  font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--fg-dim);
}
.week-cell.is-current .week-label { color: var(--ac-accent); font-weight: 600; }
.week-check { color: var(--fg-mute); }
.week-cell.is-done .week-check { color: var(--ac-accent); }
.week-text {
  font-size: 11.5px; color: var(--fg); line-height: 1.5;
  align-self: start;
}

/* SIDEBAR */
.sidebar { position: sticky; top: 24px; display: grid; gap: 12px; }
.stat-card {
  border: 1px solid var(--border); background: var(--bg-2);
  padding: 16px;
}
.stat-label {
  font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--fg-dim); margin-bottom: 10px;
  display: flex; align-items: center; gap: 6px;
}
.stat-value {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 32px; line-height: 1; color: var(--fg); font-weight: 400;
}
.stat-unit {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--fg-dim); font-style: normal; margin-left: 4px;
}
.stat-bar {
  margin-top: 10px; height: 4px; background: var(--border);
  position: relative; overflow: hidden;
}
.stat-bar-fill {
  position: absolute; top: 0; left: 0; bottom: 0;
  background: var(--sb-color); transition: width 0.4s ease;
}
.stat-meta {
  margin-top: 8px; font-size: 10.5px; color: var(--fg-dim); line-height: 1.5;
}

.pattern-flag {
  border: 1px solid var(--border); background: var(--bg-2);
  padding: 14px 16px;
  border-left: 2px solid var(--pf-color);
  font-size: 11.5px; color: var(--fg); line-height: 1.55;
}
.pattern-flag-label {
  font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--pf-color); font-weight: 500; margin-bottom: 5px;
  display: flex; align-items: center; gap: 6px;
}

.gate-tracker {
  border: 1px solid var(--border); background: var(--bg-2); padding: 16px;
}
.gate-tracker-rows { display: grid; gap: 8px; margin-top: 8px; }
.gt-row {
  display: grid; grid-template-columns: 22px 1fr 60px; gap: 10px; align-items: center;
}
.gt-dot {
  width: 10px; height: 10px; border: 1.5px solid var(--gt-accent); margin-left: 6px;
}
.gt-dot.gt-met { background: var(--gt-accent); }
.gt-label {
  font-size: 10.5px; color: var(--fg); line-height: 1.4;
  font-family: 'Instrument Serif', serif; font-style: italic;
}
.gt-row.is-current .gt-label { color: var(--gt-accent); }
.gt-mnum {
  font-size: 9px; letter-spacing: 0.14em; color: var(--fg-dim); text-align: right;
  font-family: 'JetBrains Mono', monospace;
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
.claims code {
  font-family: 'JetBrains Mono', monospace; background: rgba(255,255,255,0.06);
  padding: 1px 5px; font-size: 10.5px; color: var(--fg);
}

@media (max-width: 980px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { position: static; }
  .header { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .controls { grid-template-columns: 1fr; }
  .arc-toggles { justify-content: flex-start; }
  .weeks-row { grid-template-columns: 1fr 1fr; }
  .week-cell:nth-child(2) { border-right: none; }
  .week-cell:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
}
`;

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
export default function ExecutionDashboard() {
  const [activeArcs, setActiveArcs] = useState(new Set(['claude', 'security', 'brand']));
  const [month, setMonth] = useState(1);
  const [week, setWeek] = useState(1);
  const [done, setDone] = useState(new Set());

  const activeArcList = useMemo(
    () => ARCS.filter(a => activeArcs.has(a.id)),
    [activeArcs]
  );

  const toggleArc = (id) => {
    setActiveArcs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleTask = (arcId, m, w) => {
    const key = `${arcId}-${m}-${w}`;
    setDone(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // Calculate this week's task count across active arcs
  const stats = useMemo(() => {
    const thisWeekKeys = activeArcList.map(a => `${a.id}-${month}-${week}`);
    const thisWeekDone = thisWeekKeys.filter(k => done.has(k)).length;
    const thisWeekTotal = thisWeekKeys.length;

    // This month's tasks across active arcs
    let monthTotal = 0;
    let monthDone = 0;
    activeArcList.forEach(arc => {
      for (let w = 1; w <= 4; w++) {
        monthTotal += 1;
        if (done.has(`${arc.id}-${month}-${w}`)) monthDone += 1;
      }
    });

    // Year totals
    let yearTotal = 0;
    let yearDone = 0;
    activeArcList.forEach(arc => {
      for (let m = 1; m <= 12; m++) {
        for (let w = 1; w <= 4; w++) {
          yearTotal += 1;
          if (done.has(`${arc.id}-${m}-${w}`)) yearDone += 1;
        }
      }
    });

    // Pattern flag logic
    const totalLoad = activeArcList.reduce((sum, a) => sum + a.loadHrs, 0);
    let patternFlag = null;
    if (thisWeekDone === thisWeekTotal && thisWeekTotal > 0) {
      patternFlag = { type: 'ok', text: `All ${thisWeekTotal} sprints checked for W${week}. Strong week. Don't pull next week's work forward — rest counts.` };
    } else if (totalLoad >= 28) {
      patternFlag = { type: 'warn', text: `Combined load is ${totalLoad}hrs/wk — past the sustainable band. If this week feels harder than M${Math.max(1, month-1)}, the portfolio is the cause, not you.` };
    } else if (thisWeekDone === 0 && week >= 3) {
      patternFlag = { type: 'warn', text: `Nothing checked in W${week} of M${month}. Two paths: catch up this weekend, or formally compress this month's gate to what's achievable.` };
    } else if (monthDone / monthTotal < 0.4 && week >= 3) {
      patternFlag = { type: 'warn', text: `M${month} is ${Math.round((monthDone/monthTotal)*100)}% complete with one week left. The gate ("${activeArcList[0]?.gates[month-1] || ''}") needs honest renegotiation by EOW.` };
    } else if (monthDone === monthTotal && week === 4) {
      patternFlag = { type: 'ok', text: `M${month} fully cleared. Gate hit. Take Friday off if calendar allows — the next month resets the load.` };
    } else {
      patternFlag = { type: 'neutral', text: `Pace looks normal for W${week} of M${month}. Combined load: ${totalLoad}hrs/wk. Active gates: ${activeArcList.length}.` };
    }

    return {
      thisWeekDone, thisWeekTotal,
      monthDone, monthTotal, monthPct: monthTotal ? Math.round((monthDone/monthTotal)*100) : 0,
      yearDone, yearTotal, yearPct: yearTotal ? Math.round((yearDone/yearTotal)*100) : 0,
      totalLoad,
      patternFlag,
    };
  }, [activeArcList, month, week, done]);

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header">
            <div>
              <p className="kicker"><Calendar size={12} /> Learning Ops // Execution Layer</p>
              <h1 className="title-serif">This <em>week</em>.</h1>
              <p className="title-sub">
                The bridge from planning library to operational work. Active arcs, current calendar
                position, this month's gates, this week's sprints. Check things off; watch the math.
                Pattern flags surface when the portfolio needs renegotiation rather than heroics.
              </p>
            </div>
            <div className="meta">
              <div>Active arcs <strong>{activeArcs.size} / {ARCS.length}</strong></div>
              <div style={{ marginTop: 4 }}>Position <strong>M{month} · W{week}</strong></div>
              <div style={{ marginTop: 4 }}>Combined load <strong>{stats.totalLoad}hrs/wk</strong></div>
              <div style={{ marginTop: 4 }}>Year pace <strong>{stats.yearPct}%</strong></div>
            </div>
          </div>

          {/* POSITION CONTROLS */}
          <div className="controls">
            <div className="control-block">
              <span className="control-label">Month</span>
              <div className="control-stepper">
                <button className="stepper-btn" onClick={() => setMonth(m => Math.max(1, m - 1))} disabled={month === 1}>
                  <ChevronLeft size={14} />
                </button>
                <span className="stepper-val">M{month}</span>
                <button className="stepper-btn" onClick={() => setMonth(m => Math.min(12, m + 1))} disabled={month === 12}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div className="control-block">
              <span className="control-label">Week</span>
              <div className="control-stepper">
                <button className="stepper-btn" onClick={() => setWeek(w => Math.max(1, w - 1))} disabled={week === 1}>
                  <ChevronLeft size={14} />
                </button>
                <span className="stepper-val">W{week}</span>
                <button className="stepper-btn" onClick={() => setWeek(w => Math.min(4, w + 1))} disabled={week === 4}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div className="arc-toggles">
              {ARCS.map(arc => {
                const isActive = activeArcs.has(arc.id);
                return (
                  <button
                    key={arc.id}
                    className={`arc-toggle ${isActive ? 'active' : ''}`}
                    style={{ ['--at-accent']: arc.accent }}
                    onClick={() => toggleArc(arc.id)}
                  >
                    <span className="arc-toggle-dot" />
                    {arc.em} · {arc.loadHrs}h
                  </button>
                );
              })}
            </div>
          </div>

          {/* LAYOUT */}
          <div className="layout">

            {/* ARC CARDS */}
            <div className="arc-grid">
              {activeArcList.length === 0 && (
                <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--fg-dim)', border: '1px dashed var(--border-bright)', fontSize: 12.5 }}>
                  No active arcs. Toggle at least one arc to see this week's work.
                </div>
              )}
              {activeArcList.map(arc => {
                const monthIdx = month - 1;
                const monthGate = arc.gates[monthIdx];
                return (
                  <div key={arc.id} className="arc-card" style={{ ['--ac-accent']: arc.accent }}>
                    <div className="arc-card-head">
                      <div className="arc-card-title">
                        The {arc.title.replace(arc.em, '').replace(' Arc', '').trim()} <em>{arc.em}</em>.
                      </div>
                      <div className="arc-card-load"><strong>{arc.loadHrs}h</strong>/wk</div>
                    </div>
                    <div className="arc-month-gate">
                      <Flag size={13} className="gate-icon" />
                      <div>
                        <div className="gate-label">M{month} gate</div>
                        <div className="gate-text">{monthGate}</div>
                      </div>
                    </div>
                    <div className="weeks-row">
                      {[1, 2, 3, 4].map(w => {
                        const sprintIdx = monthIdx * 4 + (w - 1);
                        const sprintText = arc.sprints[sprintIdx] || '—';
                        const key = `${arc.id}-${month}-${w}`;
                        const isDone = done.has(key);
                        const isCurrent = w === week;
                        return (
                          <div
                            key={w}
                            className={`week-cell ${isCurrent ? 'is-current' : ''} ${isDone ? 'is-done' : ''}`}
                            onClick={() => toggleTask(arc.id, month, w)}
                          >
                            <div className="week-cell-head">
                              <span className="week-label">W{w}</span>
                              {isDone
                                ? <CheckCircle2 size={14} className="week-check" />
                                : <Circle size={14} className="week-check" />}
                            </div>
                            <div className="week-text">{sprintText}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SIDEBAR */}
            <div className="sidebar">

              {/* WEEK PROGRESS */}
              <div className="stat-card">
                <div className="stat-label">
                  <Zap size={9} /> This week
                </div>
                <div className="stat-value">
                  {stats.thisWeekDone}<span className="stat-unit">/ {stats.thisWeekTotal}</span>
                </div>
                <div className="stat-bar">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: `${stats.thisWeekTotal ? (stats.thisWeekDone/stats.thisWeekTotal)*100 : 0}%`,
                      ['--sb-color']: '#cbd5e1',
                    }}
                  />
                </div>
                <div className="stat-meta">
                  W{week} of M{month} — sprints across {activeArcList.length} active arcs
                </div>
              </div>

              {/* MONTH PROGRESS */}
              <div className="stat-card">
                <div className="stat-label">
                  <Target size={9} /> M{month} gate progress
                </div>
                <div className="stat-value">
                  {stats.monthPct}<span className="stat-unit">%</span>
                </div>
                <div className="stat-bar">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: `${stats.monthPct}%`,
                      ['--sb-color']: stats.monthPct >= 75 ? '#4ade80' : stats.monthPct >= 40 ? '#fcd34d' : '#fb923c',
                    }}
                  />
                </div>
                <div className="stat-meta">
                  {stats.monthDone} of {stats.monthTotal} M{month} sprints complete. {4 - week} {4 - week === 1 ? 'week' : 'weeks'} remaining in M{month}.
                </div>
              </div>

              {/* PATTERN FLAG */}
              {stats.patternFlag && (
                <div
                  className="pattern-flag"
                  style={{
                    ['--pf-color']:
                      stats.patternFlag.type === 'ok' ? '#4ade80'
                      : stats.patternFlag.type === 'warn' ? '#fb923c'
                      : '#8a8f9a',
                  }}
                >
                  <div className="pattern-flag-label">
                    <AlertTriangle size={9} /> Pattern flag
                  </div>
                  {stats.patternFlag.text}
                </div>
              )}

              {/* YEAR GATE TRACKER */}
              {activeArcList.length > 0 && (
                <div className="gate-tracker" style={{ ['--gt-accent']: activeArcList[0].accent }}>
                  <div className="stat-label">
                    <Compass size={9} /> {activeArcList[0].em} year gates
                  </div>
                  <div className="gate-tracker-rows">
                    {activeArcList[0].gates.map((g, i) => {
                      const monthNum = i + 1;
                      const isMet = [1, 2, 3, 4].every(w => done.has(`${activeArcList[0].id}-${monthNum}-${w}`));
                      const isCurrent = monthNum === month;
                      return (
                        <div key={i} className={`gt-row ${isCurrent ? 'is-current' : ''}`}>
                          <div className={`gt-dot ${isMet ? 'gt-met' : ''}`} />
                          <div className="gt-label">{g}</div>
                          <div className="gt-mnum">M{monthNum.toString().padStart(2, '0')}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="claims">
            <h4><Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />How this dashboard differs from the arc artifacts</h4>
            <ul>
              <li>
                <strong>Different conceptual layer.</strong> The arc artifacts are 12-month plans — reflective, comprehensive, designed to be read carefully and then put away. This dashboard is the daily/weekly surface — operational, present-tense, designed to be touched every morning. Both live in the same system but serve different moments.
              </li>
              <li>
                <strong>Currently includes 3 arcs of full sprint data.</strong> The Sustainable preset (Claude + Security + Brand) is hardcoded with M1-M12 × W1-W4 = 48 sprints per arc plus 12 monthly gates per arc. To extend with the remaining 24 arcs, paste their sprint data into the <code>ARCS</code> array following the same structure. The dashboard pattern is the deliverable; the data is portable.
              </li>
              <li>
                <strong>Pattern flags are heuristic, not prescriptive.</strong> The flag logic surfaces five common patterns: all sprints checked, combined load past sustainable, nothing checked late in month, month gate at risk with one week left, full month cleared. The flags are reminders to renegotiate the portfolio rather than push harder. Heroics are not the recovery move.
              </li>
              <li>
                <strong>Gate progress is the leading indicator, not week progress.</strong> Week progress fluctuates; gate progress is what determines whether the year compounds. If gate progress is below 40% with one week left in the month, the gate needs explicit renegotiation — not just more effort. The Y2 retrospective will judge gate hits, not weekly check-box rates.
              </li>
              <li>
                <strong>The year-gates tracker on the right shows trajectory at a glance.</strong> For the first active arc, all 12 gates are listed with met/unmet state. The current month is highlighted in the arc's accent color. The pattern of met gates across the year is the actual arc completion signal — the single most useful number in the dashboard.
              </li>
              <li>
                <strong>What this dashboard still doesn't model:</strong> free-text retrospectives per week (planned for v2), cross-arc dependency chains (where one arc gates another), explicit calendar integration with Daniel briefings or Intinc commitments, energy variation. For now: task completion + gate tracking + pattern flags. v2 adds the retrospective layer once v1 is in use.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
