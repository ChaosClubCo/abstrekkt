import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, ShieldCheck } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month Security Arc
// Kyle-specific: AppSec background → AI security creds → published red-team playbook
// Certs: CompTIA SecAI+ (M5) + CAISP (M11)
// Frameworks: OWASP LLM Top 10, MITRE ATLAS, NIST AI RMF
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'AI THREAT LANDSCAPE',
    subtitle: 'Three frameworks cold. Applied to your own stack, not to hypotheticals.',
    months: [
      {
        n: 1,
        title: 'OWASP LLM Top 10 — applied, not theoretical',
        why: 'This is the framework enterprise security teams reach for first when evaluating AI deployments. You already cite it. Citing it and owning it are different. Every vulnerability needs a test run against something you actually shipped.',
        weeks: [
          'Read the OWASP LLM Top 10 end to end. For each vulnerability, name one system you have shipped where that class of bug could exist. No hypotheticals.',
          'LLM01 — Prompt Injection: build a structured test harness that attempts direct and indirect injection against one of your Claude or Copilot Studio deployments. Document every finding.',
          'LLM02 through LLM06 (Insecure Output Handling, Training Data Poisoning, Model DoS, Supply Chain, Sensitive Info Disclosure): one practical test per vulnerability against real infrastructure.',
          'LLM07 through LLM10 (Insecure Plugin Design, Excessive Agency, Overreliance, Model Theft): finish the set. Score each finding by severity. Remediate anything critical before moving on.',
        ],
        gate: 'A completed OWASP LLM Top 10 vulnerability assessment against one of your own production systems. Published publicly — this is the first proof artifact.',
      },
      {
        n: 2,
        title: 'MITRE ATLAS — the adversarial ML threat matrix',
        why: 'ATLAS is the ATT&CK equivalent for AI systems. It covers the attack surfaces OWASP LLM Top 10 does not: model evasion, data poisoning at training time, model inversion, and extraction. If you want to brief a red team or a CISO, you need fluency in both.',
        weeks: [
          'Read the full MITRE ATLAS technique catalog. Map every technique to the adversarial ML attack lifecycle: reconnaissance → initial access → execution → exfiltration. One diagram.',
          'Attack surface map for your stack: which ATLAS techniques apply to your Claude, Copilot Studio, and n8n deployments? Be specific about which component each technique targets.',
          'ATLAS vs. OWASP LLM Top 10 crosswalk: where do they complement each other, where do they conflict, and where does one cover gaps the other misses? Write the comparison you would use to brief a CISO.',
          'Simulate two ATLAS techniques in a test environment (not production). Document what you found, what you could not fully test, and what would require a dedicated red-team engagement.',
        ],
        gate: 'An ATLAS attack surface map for your own stack, mapped to real deployment components. A CISO-ready crosswalk of ATLAS and OWASP LLM Top 10.',
      },
      {
        n: 3,
        title: 'NIST AI RMF — governance as practitioner fluency',
        why: 'SecAI+ and CAISP both reference NIST AI RMF. Enterprise buyers use it as an evaluation checklist. Understanding it as a practitioner — not just as a test-taker — is what makes your security posture documents land with people who sign purchase orders.',
        weeks: [
          'NIST AI RMF 1.0 core structure: GOVERN, MAP, MEASURE, MANAGE. Each function, its outcomes, and the specific relevance to deployed agentic AI systems. Not a summary — a working model.',
          'Map the RMF to a real AI deployment you own: which controls are implemented, which are explicitly missing, which genuinely do not apply. Honest assessment.',
          'Create a basic AI RMF organizational profile for Intinc or FlashFusion. This is a deliverable you will use in a real sales or procurement conversation within 12 months.',
          'Full crosswalk: NIST AI RMF ↔ OWASP LLM Top 10 ↔ MITRE ATLAS. Where do all three align? Where are the gaps none of them cover? This document becomes your exam reference sheet.',
        ],
        gate: 'A NIST AI RMF profile for one real deployment. The three-framework crosswalk document. Both referenced in your Q2 exam prep.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'SecAI+ SPRINT',
    subtitle: 'Domain coverage, practice loops, and the first cert in hand by end of quarter.',
    months: [
      {
        n: 4,
        title: 'SecAI+ domain mapping and gap closure',
        why: 'Sitting an exam without mapping the objectives to your knowledge first is expensive guessing. You already have Q1 framework depth. This month is about finding the 20% of exam coverage that Q1 did not handle.',
        weeks: [
          'Pull the current CompTIA SecAI+ exam objectives. Map every domain and sub-objective to one of three buckets: strong (Q1 covered it), needs work (partially covered), unknown (not touched yet).',
          'SecAI+ domains 1 and 2: AI concepts in security contexts and core security fundamentals with AI implications. Focus exclusively on the intersections — not the pure-security basics you already know.',
          'SecAI+ domains 3 and 4: AI-specific risk management, governance, and attack surfaces. These are the most exam-weighted domains. Depth here, not breadth.',
          'Practice exam #1. Score honestly. Write down the specific topic of every question you got wrong or guessed correctly. That list is your M5 study plan.',
        ],
        gate: 'A practice exam baseline score. A gap list with specific topics, not just domain names. A study plan for M5 built from actual wrong answers.',
      },
      {
        n: 5,
        title: 'SecAI+ final prep and sit',
        why: 'The exam is this month. The single rule for exam week: no new material. Reviewing what you know beats cramming what you do not.',
        weeks: [
          'Close the gaps from M4. Targeted study on identified weak topics only. If a topic did not appear on the M4 practice exam, it is lower priority this week.',
          'Practice exam #2. If your score is within 10% of the passing threshold, you are ready. If not, identify which single domain is dragging the score and fix it.',
          'Review the three-framework crosswalk from M3. The frameworks appear throughout SecAI+ — your Q1 work is the study material here, not new content.',
          'Sit CompTIA SecAI+. No new material this week. Schedule the exam for early in the week so you have buffer days if you need to reschedule.',
        ],
        gate: 'CompTIA SecAI+ cert in hand. First AI security credential. Update LinkedIn, capability brief, and Claude Partner Network profile immediately.',
      },
      {
        n: 6,
        title: 'Prompt injection hardening — applied post-exam',
        why: 'The exam is closed. Now make the knowledge useful. Prompt injection is the most common LLM attack vector in real deployments — LLM01 from M1. Your AppSec background means you already understand injection classes. Translate that into LLM-specific hardening that you can publish.',
        weeks: [
          'Prompt injection taxonomy: direct injection, indirect injection (via retrieved content), payload injection via tool outputs, and context manipulation. Build a named test case for each type.',
          'Defense patterns in practice: input validation layers, output sanitization, instruction hierarchy enforcement, and system prompt isolation. Apply each to one of your Claude deployments.',
          'Jailbreak resistance: run a structured jailbreak attempt against your own system prompts using published jailbreak taxonomies. Document what breaks, what holds, and why.',
          'Write and publish the hardening guide: "Prompt injection defense for Claude deployments." Practical, opinionated, with the real test cases you ran. Not a summary of OWASP — your own findings.',
        ],
        gate: 'A published prompt injection hardening guide with named test cases run against your own system. Referenced in your SecAI+ credential post.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'RED TEAM',
    subtitle: 'Multi-tenant isolation. Full adversarial engagement. CISO-ready posture documentation.',
    months: [
      {
        n: 7,
        title: 'Multi-tenant isolation — your strongest lane',
        why: 'This is the failure mode that ends enterprise AI deployments. When one tenant\'s data leaks into another\'s context, it is a breach, not a bug. Your AppSec background and your Supabase/RLS experience make this your most credible technical specialization in AI security.',
        weeks: [
          'Multi-tenant threat model for AI systems: enumerate every failure mode — context bleed between sessions, shared cache exposure, tool output leakage, system prompt exposure across tenants. All of them, in writing.',
          'Row-level security in Supabase applied to AI workloads: build a test that attempts to retrieve another tenant\'s data through a Claude agent. Verify that RLS holds under adversarial inputs — not just normal usage.',
          'Context isolation patterns for agent sessions: how do you prevent conversation context from one tenant bleeding into another\'s session? Test the boundary explicitly. Document what the MCP server layer needs to enforce.',
          'Permission scoping for multi-tenant MCP servers: which tools should be available to which tenants, at which privilege levels? Build the policy document and implement at least one enforcement check.',
        ],
        gate: 'A multi-tenant isolation design document and a test suite that verifies isolation holds under 20 adversarial inputs. Publishable — this becomes your most-cited security artifact.',
      },
      {
        n: 8,
        title: 'Full red-team engagement — your own production system',
        why: 'Vulnerability assessments find known classes of bugs. Red-teaming finds the ones you did not know to look for because you were not thinking like an attacker. This month you apply adversarial thinking systematically. The target is your most sensitive Claude or Copilot deployment.',
        weeks: [
          'Red-team planning: scope definition, threat actor profile (script kiddie / insider threat / nation-state — pick the one most relevant to Intinc\'s actual risk), attack path enumeration, and rules of engagement in writing before touching anything.',
          'Execute. Document every finding as you find it — not after. Include the attack path, the payload, the observed behavior, and whether it is exploitable in practice.',
          'Score and prioritize findings using CVSS or a simplified severity matrix. What is critical, what is a medium, what is informational? Be honest — a finding you downplay will get exploited.',
          'Write the red-team report to a publishable standard: executive summary for non-technical readers, technical findings section, remediation steps with owners and timelines. This is your flagship public security artifact.',
        ],
        gate: 'A published red-team report on your own production AI system. Every finding documented. Every remediation specified with a timeline. Your most concrete public proof of security depth.',
      },
      {
        n: 9,
        title: 'Security posture documentation',
        why: 'A red-team report proves you can find problems. A posture document proves you can govern them. Enterprise procurement requires both. This month you build the artifact that pre-answers the "how do we know your AI deployments are safe?" question in any sales or partner conversation.',
        weeks: [
          'Security posture framework for AI systems: define the domains (data governance, access control, model behavior monitoring, incident response) and map each to controls you actually have in place — not aspirational ones.',
          'CISO-ready posture document for one of your deployments: what a security team needs to see before approving an AI system for enterprise use. Written for Intinc\'s actual risk profile.',
          'Incident response playbook for AI systems: what do you do when a deployed Claude agent exhibits unexpected behavior? Detection triggers, containment steps, rollback procedure, communication protocol.',
          'Publish a general-purpose posture document template: a version other practitioners can adapt for their own deployments. This becomes a Partner Network artifact and a Community Ambassador workshop handout.',
        ],
        gate: 'A CISO-ready posture document for one real deployment and a published general-purpose template. Both linked from your bio and Partner Network profile.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'CAISP + PUBLISH',
    subtitle: 'Second cert closed. The complete AI security playbook published. The AppSec brand anchor event.',
    months: [
      {
        n: 10,
        title: 'CAISP domain coverage',
        why: 'CAISP goes deeper than SecAI+ on AI governance, ethics frameworks, and regulatory landscape. Your Q1 NIST AI RMF work is your strongest preparation. The genuine gaps are likely: AI ethics review processes, international regulatory landscape, and accountability structures.',
        weeks: [
          'Pull the current CAISP exam objectives. Map every domain to your knowledge. The honest gaps are likely non-technical: ethics frameworks, accountability structures, international regulations (EU AI Act, sector-specific rules).',
          'CAISP-specific depth: AI governance models, accountability chain from developer to deployer to user, ethics review processes for AI systems. Not abstract — applied to your own deployments.',
          'International regulatory landscape: EU AI Act risk tiers, CCPA implications for AI systems, HIPAA considerations for healthcare AI, and financial sector AI guidance. Enough to speak credibly to a compliance team, not enough to practice law.',
          'Practice exam #1. Score honestly. Flag any domain where your score is more than 15 points below passing — those get M11 week 1.',
        ],
        gate: 'CAISP practice exam baseline. Gap list by specific topic. Study plan for M11 built from wrong answers, not from domain names.',
      },
      {
        n: 11,
        title: 'CAISP final prep and sit',
        why: 'Same rule as SecAI+: no new material in the final week. The SecAI+ cert already proves technical AI security depth. CAISP adds governance and ethics breadth. Together they are a credential stack almost no AI practitioner carries.',
        weeks: [
          'Close M10 gaps. Targeted study on identified weak topics only. If the gap is regulatory, use the EU AI Act official text and NIST AI RMF — not third-party summaries.',
          'Practice exam #2. Verify gaps from M10 are closing. If overall score is at or above passing, stop studying new material.',
          'Review your Q1 NIST AI RMF crosswalk — CAISP exam questions map closely to the RMF\'s GOVERN and MAP functions. Your M3 work is the best exam prep you have.',
          'Sit CAISP. Two AI security certs closed in one arc. Update every surface immediately: LinkedIn, Partner Network, capability brief, Claude Ambassador profile.',
        ],
        gate: 'CAISP cert in hand. SecAI+ + CAISP credential stack complete. The combination is rare — almost no one in the partner ecosystem carries both.',
      },
      {
        n: 12,
        title: 'Publish the security playbook and close the arc',
        why: 'Twelve months of framework study, two certs, a red-team report, a hardening guide, a posture document, and a multi-tenant isolation design. You do not own this body of knowledge until it is synthesized, published, and someone else is using it.',
        weeks: [
          'Synthesize the complete "security-first AI deployment" playbook: OWASP LLM Top 10 → ATLAS → NIST RMF → prompt injection hardening → multi-tenant isolation → red-team methodology → posture documentation. One document, your voice.',
          'Workshop: "Securing AI deployments for enterprise engineering teams" — at CLC, Intinc, or a security community event. The AppSec brand anchor event. Use the posture template as the hands-on artifact.',
          'Update every positioning surface: LinkedIn headline to include SecAI+ and CAISP, Partner Network profile with the playbook and red-team report linked, capability brief updated with the security posture offering as a named SKU.',
          'Retrospective: what changed in your threat model? Was the SecAI+ + CAISP path the right order? What does Y2 look like — offensive security depth, regulatory compliance specialization, or security tooling built on top of this arc?',
        ],
        gate: 'The playbook is published. The workshop is delivered. Three security teams are using your posture template. Your credential stack is updated on every surface.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// FRAMEWORK + CERT COVERAGE STRIP
// ---------------------------------------------------------------------------
const COVERAGE = [
  { type: 'framework', label: 'Framework', name: 'OWASP LLM Top 10', month: 'M1', pct: 100 },
  { type: 'framework', label: 'Framework', name: 'MITRE ATLAS',       month: 'M2', pct: 75  },
  { type: 'framework', label: 'Framework', name: 'NIST AI RMF',       month: 'M3', pct: 50  },
  { type: 'cert',      label: 'Cert',      name: 'SecAI+',            month: 'Sit M5', pct: 33 },
  { type: 'cert',      label: 'Cert',      name: 'CAISP',             month: 'Sit M11', pct: 8 },
];

// ---------------------------------------------------------------------------
// STYLES — Security Arc / deep crimson on near-black
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg:           #0e0707;
  --bg-2:         #160c0c;
  --fg:           #f5e8e8;
  --fg-dim:       #b08a8a;
  --accent:       #e05252;
  --accent-2:     #f07878;
  --gate:         #22d3ee;
  --muted:        #5a3838;
  --card:         #1a0e0e;
  --border:       #2e1a1a;
  --border-bright:#422828;
}

body, .arc-root {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

.arc-root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(224,82,82,0.09), transparent 60%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(34,211,238,0.04), transparent 70%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1120px; margin: 0 auto; }

/* HEADER */
.header-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 32px;
  align-items: end;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 48px;
}
.kicker {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  color: var(--accent);
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.title-serif {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(42px, 6vw, 76px);
  line-height: 0.95;
  letter-spacing: -0.02em;
  margin: 0;
  font-weight: 400;
  color: var(--fg);
}
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub {
  font-size: 13px;
  color: var(--fg-dim);
  margin: 16px 0 0;
  max-width: 54ch;
}
.meta {
  text-align: right;
  font-size: 11px;
  color: var(--fg-dim);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.meta strong { color: var(--accent); font-weight: 500; }

/* COVERAGE STRIP */
.coverage-strip {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
  margin-bottom: 48px;
  border: 1px solid var(--border);
  overflow: hidden;
}
.cov-item {
  padding: 16px 16px 20px;
  border-right: 1px solid var(--border);
  position: relative;
}
.cov-item:last-child { border-right: none; }
.cov-item.is-cert {
  background: rgba(34,211,238,0.03);
  border-right-color: var(--border);
}
.cov-item.is-cert:first-of-type {
  border-left: 1px solid rgba(34,211,238,0.2);
}
.cov-type {
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin-bottom: 5px;
}
.is-framework .cov-type { color: var(--fg-dim); }
.is-cert      .cov-type { color: var(--gate); }
.cov-name {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 17px;
  line-height: 1.15;
  margin-bottom: 4px;
  font-weight: 400;
}
.is-framework .cov-name { color: var(--accent); }
.is-cert      .cov-name { color: var(--gate); }
.cov-month {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.is-framework .cov-month { color: var(--fg-dim); }
.is-cert      .cov-month { color: rgba(34,211,238,0.7); }
.cov-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: var(--border);
}
.is-framework .cov-bar-fill { background: var(--accent); height: 100%; }
.is-cert      .cov-bar-fill { background: var(--gate);   height: 100%; }

/* TRADEOFF */
.tradeoff {
  border: 1px solid var(--accent);
  border-left-width: 3px;
  background: linear-gradient(90deg, rgba(224,82,82,0.08), rgba(224,82,82,0.01));
  padding: 20px 24px;
  margin-bottom: 56px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: start;
}
.tradeoff-icon { color: var(--accent); margin-top: 2px; }
.tradeoff h3 {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 20px;
  margin: 0 0 8px;
  color: var(--accent);
  font-weight: 400;
}
.tradeoff-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 12px;
  font-size: 12.5px;
}
.tradeoff-grid h4 {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--fg-dim);
  margin: 0 0 6px;
}
.tradeoff-grid ul { margin: 0; padding-left: 16px; color: var(--fg); }
.tradeoff-grid li { margin-bottom: 4px; }

/* QUARTER TABS */
.quarter-rail {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin-bottom: 40px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.qtab {
  padding: 20px 18px;
  cursor: pointer;
  background: transparent;
  border: none;
  border-right: 1px solid var(--border);
  text-align: left;
  color: var(--fg-dim);
  transition: background 0.2s, color 0.2s;
  font-family: 'JetBrains Mono', monospace;
  position: relative;
}
.qtab:last-child { border-right: none; }
.qtab:hover  { background: var(--bg-2); color: var(--fg); }
.qtab.active { background: var(--bg-2); color: var(--fg); }
.qtab.active::before {
  content: '';
  position: absolute;
  top: -1px; left: 0; right: 0;
  height: 2px;
  background: var(--accent);
}
.qtab-num   { font-size: 10px; letter-spacing: 0.2em; color: var(--accent); text-transform: uppercase; }
.qtab-phase {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 22px;
  line-height: 1.1;
  margin: 6px 0 4px;
  color: inherit;
  font-weight: 400;
}
.qtab.active .qtab-phase { color: var(--fg); }
.qtab-sub { font-size: 11px; color: var(--fg-dim); line-height: 1.4; }

/* MONTHS */
.months { display: grid; gap: 16px; }
.month {
  border: 1px solid var(--border);
  background: var(--card);
  transition: border-color 0.2s;
}
.month:hover { border-color: var(--border-bright); }
.month.open  { border-color: var(--accent); }

.month-head {
  padding: 20px 24px;
  cursor: pointer;
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 24px;
  align-items: center;
  user-select: none;
}
.month-num {
  font-family: 'Instrument Serif', serif;
  font-size: 48px;
  line-height: 1;
  color: var(--accent);
  font-style: italic;
  font-weight: 400;
}
.month-title { font-size: 15px; font-weight: 500; color: var(--fg); margin: 0 0 4px; letter-spacing: -0.01em; }
.month-why   { font-size: 12px; color: var(--fg-dim); margin: 0; max-width: 64ch; }
.month-chev  { color: var(--fg-dim); transition: transform 0.25s; }
.month.open .month-chev { transform: rotate(90deg); color: var(--accent); }

.month-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
.month.open .month-body { max-height: 900px; }
.month-body-inner {
  padding: 4px 24px 24px;
  border-top: 1px dashed var(--border);
  margin-top: 4px;
}

/* WEEKS */
.weeks { display: grid; gap: 8px; margin: 16px 0 20px; }
.week {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: start;
  padding: 10px 12px;
  background: var(--bg-2);
  border-left: 2px solid var(--border-bright);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.week:hover { border-left-color: var(--accent); }
.week.done  { border-left-color: var(--accent); background: rgba(224,82,82,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text  { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(224,82,82,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

/* GATE — cyan = clearance granted */
.gate {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(34,211,238,0.3);
  background: rgba(34,211,238,0.04);
  align-items: start;
}
.gate-icon  { color: var(--gate); margin-top: 1px; }
.gate-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--gate);
  margin-bottom: 4px;
}
.gate-text {
  font-size: 13px;
  color: var(--fg);
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  line-height: 1.45;
}

/* PROGRESS */
.progress-wrap {
  position: sticky;
  top: 0;
  background: var(--bg);
  padding: 12px 0 16px;
  margin-bottom: 24px;
  z-index: 10;
  border-bottom: 1px solid var(--border);
}
.progress-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.progress-label { font-size: 10px; letter-spacing: 0.2em; color: var(--fg-dim); text-transform: uppercase; }
.progress-val   { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; color: var(--accent); }
.progress-track { height: 2px; background: var(--border); position: relative; overflow: hidden; }
.progress-fill  { position: absolute; top: 0; left: 0; bottom: 0; background: var(--accent); transition: width 0.4s ease; }

/* CLAIMS */
.claims {
  margin-top: 72px;
  padding: 24px;
  border: 1px solid var(--border);
  background: var(--bg-2);
  font-size: 11.5px;
  color: var(--fg-dim);
  line-height: 1.7;
}
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims code { color: var(--accent-2); background: rgba(224,82,82,0.1); padding: 1px 6px; font-size: 11px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }

@keyframes rise {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.stagger > * { opacity: 0; animation: rise 0.55s ease forwards; }
.stagger > *:nth-child(1) { animation-delay: 0.05s; }
.stagger > *:nth-child(2) { animation-delay: 0.10s; }
.stagger > *:nth-child(3) { animation-delay: 0.16s; }
.stagger > *:nth-child(4) { animation-delay: 0.22s; }
.stagger > *:nth-child(5) { animation-delay: 0.28s; }

@media (max-width: 720px) {
  .header-grid  { grid-template-columns: 1fr; }
  .meta         { text-align: left; }
  .coverage-strip { grid-template-columns: 1fr 1fr; }
  .cov-item:nth-child(2) { border-right: none; }
  .cov-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); }
  .tradeoff-grid  { grid-template-columns: 1fr; }
  .quarter-rail   { grid-template-columns: 1fr 1fr; }
  .qtab:nth-child(2) { border-right: none; }
  .qtab:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
  .month-head     { grid-template-columns: 56px 1fr auto; gap: 16px; padding: 16px; }
  .month-num      { font-size: 36px; }
  .month-body-inner { padding: 4px 16px 20px; }
}
`;

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
export default function SecurityArc() {
  const [activeQ,    setActiveQ]    = useState(0);
  const [openMonth,  setOpenMonth]  = useState(1);
  const [done,       setDone]       = useState(new Set());

  const totalWeeks = 48;
  const pct = Math.round((done.size / totalWeeks) * 100);

  const toggleWeek = (key) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const quarter = ARC[activeQ];

  return (
    <>
      <style>{STYLE}</style>
      <div className="arc-root">
        <div className="container">

          {/* HEADER */}
          <div className="header-grid stagger">
            <div>
              <p className="kicker"><ShieldCheck size={12} /> Learning Ops // AppSec Brand Lane</p>
              <h1 className="title-serif">The <em>Security</em> Arc.</h1>
              <p className="title-sub">
                12 months. Three frameworks cold. Two certs in hand. A red-team report,
                a multi-tenant isolation design, a prompt injection hardening guide, and
                a CISO-ready posture template — all published. The AppSec brand formalized
                into credentials no one else in the partner ecosystem carries together.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Cert 1: <strong>SecAI+, M5</strong></div>
              <div style={{ marginTop: 4 }}>Cert 2: <strong>CAISP, M11</strong></div>
            </div>
          </div>

          {/* FRAMEWORK + CERT COVERAGE STRIP */}
          <div className="coverage-strip stagger">
            {COVERAGE.map((c) => (
              <div key={c.name} className={`cov-item is-${c.type}`}>
                <div className="cov-type">{c.label}</div>
                <div className="cov-name">{c.name}</div>
                <div className="cov-month">{c.month}</div>
                <div className="cov-bar">
                  <div className="cov-bar-fill" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* TRADEOFF */}
          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — this arc deepens a lane you already own.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Your AppSec background is the differentiator. This arc turns it into credentials,
                published proof, and a named service offering. The risk is over-investing in the
                security lane at the expense of cross-platform breadth — especially if Partner
                Network positioning needs multi-model fluency, not just security depth.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>SecAI+ + CAISP together is rare — almost no one in the partner ecosystem carries both right now</li>
                    <li>The red-team report and posture template are publishable artifacts that no cert alone produces</li>
                    <li>Security-first positioning becomes verifiable — not a claim, a credential stack with published proof</li>
                    <li>Multi-tenant isolation is your most credible enterprise differentiator — this arc formalizes it</li>
                    <li>CISO-ready materials open procurement conversations that a general AI resume does not</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up</h4>
                  <ul>
                    <li>~4–5 hrs/week over 12 months — direct opportunity cost against platform depth (Claude, Gemini)</li>
                    <li>Two exams in one arc is achievable but requires actual study discipline in M4–M5 and M10–M11</li>
                    <li>Security specialization can narrow perceived scope — some enterprise buyers want breadth first</li>
                    <li>Framework knowledge becomes stale without ongoing engagement — OWASP LLM Top 10 updates regularly</li>
                  </ul>
                </div>
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-dim)' }}>
                <strong style={{ color: 'var(--fg)' }}>Sequencing note:</strong> run this arc
                after Claude Architect Foundations closes (Claude Arc M1). The cert combines best with
                the Architect credential — "Claude Certified Architect + SecAI+ + CAISP" is a package
                no other Partner Network candidate carries. The gap between the first and second exam
                is six months — enough recovery time if M5 is tight.
              </p>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="progress-wrap">
            <div className="progress-top">
              <span className="progress-label">Weekly sprints complete</span>
              <span className="progress-val">{done.size} / {totalWeeks} · {pct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* QUARTER TABS */}
          <div className="quarter-rail">
            {ARC.map((q, i) => (
              <button
                key={q.quarter}
                className={`qtab ${i === activeQ ? 'active' : ''}`}
                onClick={() => setActiveQ(i)}
              >
                <div className="qtab-num">{q.quarter} · Months {q.months[0].n}–{q.months[q.months.length - 1].n}</div>
                <div className="qtab-phase">{q.phase}</div>
                <div className="qtab-sub">{q.subtitle}</div>
              </button>
            ))}
          </div>

          {/* MONTHS */}
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
                          const key    = `${m.n}-${wi}`;
                          const isDone = done.has(key);
                          return (
                            <div
                              key={key}
                              className={`week ${isDone ? 'done' : ''}`}
                              onClick={() => toggleWeek(key)}
                            >
                              <span className="week-label">W{wi + 1}</span>
                              <span className="week-text">{w}</span>
                              {isDone
                                ? <CheckCircle2 size={16} className="week-check" />
                                : <Circle       size={16} className="week-check" />}
                            </div>
                          );
                        })}
                      </div>
                      <div className="gate">
                        <Flag size={16} className="gate-icon" />
                        <div>
                          <div className="gate-label">Clearance gate · M{m.n}</div>
                          <div className="gate-text">{m.gate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CLAIMS */}
          <div className="claims">
            <h4>
              <Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              CLAIMS &amp; ASSUMPTIONS
            </h4>
            <ul>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Verify both exam objective lists before M4 and M10.</strong> CompTIA
                updates SecAI+ objectives periodically. The CAISP body of knowledge is also subject to revision. Pull the
                current official objectives at the start of the prep month — not now. Stale objectives are the most common
                cause of exam surprises.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The OWASP LLM Top 10 is actively maintained.</strong> Version 2.0
                was released in 2025. Check for updates at the start of M1 and again at M6. The vulnerability classes may
                have shifted. <code>owasp.org/www-project-top-10-for-large-language-model-applications</code>
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Red-teaming requires explicit scope agreement.</strong> Before M8,
                document the scope in writing — which system, which components, which attack vectors are in and out of bounds.
                Even on your own production system, a written scope protects you if something goes wrong during testing.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The multi-tenant isolation work (M7) is the arc's most valuable artifact.</strong>
                If the arc compresses, protect M7 and M8 above everything else. The red-team report + isolation design is the
                combination that opens enterprise procurement conversations no cert alone reaches.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Two exams six months apart is achievable — barely.</strong> The M5
                exam prep window is M4–M5 (8 weeks). The M11 window is M10–M11 (8 weeks). Do not let M3 framework work spill
                into M4 exam prep. The frameworks are preparation for the exam — they are not the exam prep itself.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Load is MED across the arc (~4–5 hrs/week)</strong> with two
                HIGH spikes at M4–M5 and M10–M11 exam windows. Plan around those two windows. Do not schedule other
                arc milestones or major Intinc deliverables in the same calendar slots.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
