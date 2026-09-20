# Meta-Prompt: Certification Study Tool Generator

## PURPOSE
Generate a complete, production-ready three-mode React certification study tool
(Walk-Up / Exam / Post-Exam) from any course or exam curriculum.

Output is a single `.jsx` artifact using the Reading Room at Midnight design system,
Claude API for AI-powered practice generation, and window.storage for persistence.

---

## HOW TO USE THIS PROMPT

Paste the following prompt into a Claude session. Fill in the bracketed fields.
Attach or paste course/exam content directly into the prompt before the schema section.

---

## THE PROMPT

```
You are building a production-ready three-mode React certification study tool.
Design system: Reading Room at Midnight (bg #0c0c0b, accent #d4893a,
IBM Plex Sans + IBM Plex Mono + Playfair Display, surface #161614, border #2a2a26).

---

EXAM METADATA
Name: [FULL CERT NAME]
Short ID: [e.g. HDI-SCA, AI-103, CAISP]
Pass Score: [e.g. 700/1000 or 80%]
Exam Duration: [minutes]
Question Count: [number or "unknown"]
Exam Format: [MCQ / scenario-based / practical / mixed]
Cost: [$ amount]
Renewal: [e.g. annual / 2 years / none]

---

COURSE CONTENT
[PASTE FULL COURSE OUTLINE, UNIT LIST, OR URL-FETCHED CONTENT HERE.
Include: unit names, sub-topics, what is tested, any published domain weights.]

---

DOMAIN SCHEMA
From the course content above, extract and define domains using this exact structure.
Produce as many domains as the curriculum has major units/sections.
Each domain MUST have all fields populated — no placeholder text, no "TBD."

For each domain:
{
  id: 'snake_case_id',
  short: 'Short Label (≤18 chars)',
  label: 'Full Domain Name',
  weight: [integer, estimated % if not published — must sum to 100],
  range: '[low%–high%] or exact %',
  color: '[assign unique hex from palette: #d4893a #7c6bcc #4a9e6b #5ba3c9 #c94f4f #9e6b9e #6b9e9e]',
  concepts: [
    {
      title: 'Concept Group Name',
      pts: [
        'Specific exam-relevant point — precise, not vague',
        'Include the WHY or HOW, not just the WHAT',
        'Exam trap callout if applicable (e.g. "X ≠ Y — common confuse point")',
        // 4–7 points per concept group
      ]
    },
    // 3–6 concept groups per domain
  ],
  scripts: [
    // "scripts" = domain-specific process flows, frameworks, or quick-reference patterns
    // For technical certs: Python/code snippets
    // For process certs: step-by-step workflows, decision criteria, checklists
    {
      label: 'Process/Pattern Name',
      content: 'Multi-line formatted text showing the workflow, steps, or pattern'
    },
    // 2–4 scripts per domain
  ]
}

---

DECISION TREE SCHEMA
Build 10–14 decision tree entries for the Exam mode quick-reference panel.
Each entry should answer a real exam scenario decision in 3 fields:

{
  q: 'Scenario question starting with "Need to..." or "Caller is..." or "SLA is..." etc.',
  a: 'Correct answer / correct action / correct term — be specific',
  d: 'One-sentence rationale or distinguishing rule that prevents the wrong choice'
}

Focus on: highest-weight domains, common confuse points, process decision forks.

---

COMPONENT REQUIREMENTS

Build a single React JSX file (no imports beyond React hooks) with this exact structure:

1. WALK-UP MODE
   - Domain weight visualization bar (clickable segments)
   - Confidence sliders per domain (1–5, persistent via window.storage)
   - Expandable concept cards per domain
   - Toggle process scripts per domain
   - AI practice question generator button per domain
     (calls Claude API, generates 3 scenario questions A–D, easy/med/hard)

2. EXAM MODE
   - Countdown timer with configurable duration (start buttons for common exam length + custom)
   - Color shifts: amber at 25% time remaining, red at 10%
   - Searchable decision tree (instant filter)
   - Quick domain reference (same expandable cards, compact layout)

3. POST-EXAM MODE
   - Post-exam confidence sliders per domain (1–5, persistent)
   - Pre vs post delta display with directional arrows
   - Retake priority visualization: bar chart ranked by (weakness × domain weight)
   - AI retake study plan generator
     (calls Claude API with actual scores, outputs targeted 3-week plan)

PERSISTENCE: All slider values, timer end time stored via window.storage.
DESIGN: Reading Room at Midnight — bg #0c0c0b, surf #161614, elevated #1e1e1b,
        border #2a2a26, text #e8e6e0, muted #6b6866, accent #d4893a.
        IBM Plex Sans for body, IBM Plex Mono for code/labels, Playfair Display serif for headers.
CLAUDE API INTEGRATION:
  endpoint: https://api.anthropic.com/v1/messages
  model: claude-sonnet-4-20250514
  max_tokens: 1000
  No API key in client — already handled by artifact environment.
  Practice Q prompt: domain-specific, scenario format, A–D choices, mark correct answer.
  Study plan prompt: uses actual post-exam scores + domain weights, outputs week-by-week plan.

CODE STANDARDS:
- Zero placeholder functions or TODO stubs
- All states implemented: empty, loading, error
- Keyboard accessible, ARIA labels on interactive elements
- Animations on transform/opacity only
- No hardcoded hex — use CSS variables or inline with the token values above
- Fonts loaded via Google Fonts @import in style tag

OUTPUT: Single complete .jsx file. No truncation. No "...rest of component" shortcuts.
Every domain fully populated. Every button wired. Ready to paste into Claude artifacts and run.
```

---

## CHECKLIST BEFORE RUNNING

- [ ] Exam metadata all filled in
- [ ] Course content pasted (URL fetch or manual copy)
- [ ] Domain weights estimated if not published (must sum to 100)
- [ ] Decision tree covers highest-weight domains first
- [ ] Script/process content is specific, not generic
- [ ] Timer duration matches actual exam length

---

## DESIGN SYSTEM REFERENCE

**Reading Room at Midnight (INT profile)**
```
bg:       #0c0c0b
surface:  #161614
elevated: #1e1e1b
border:   #2a2a26
text:     #e8e6e0
muted:    #6b6866
dim:      #4a4845
accent:   #d4893a  (primary orange)
```

**Domain color palette (assign one per domain, no repeats):**
```
#d4893a  warm amber
#7c6bcc  soft violet
#4a9e6b  forest green
#5ba3c9  steel blue
#c94f4f  muted red
#9e6b9e  dusty purple
#6b9e9e  teal
#9e9e4a  olive (if 8+ domains)
```

**Font stack:**
```
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');

Headers:  Playfair Display, serif, 700
Body:     IBM Plex Sans, sans-serif, 400/500/600
Mono:     IBM Plex Mono, monospace, 400/500
```

---

## REUSE INSTRUCTIONS

Run this meta-prompt for any certification with:
1. A published course outline or curriculum
2. An identifiable pass score or exam format
3. Discrete knowledge domains or units

Works for: IT certs, security certs, cloud certs, ITSM certs, AI certs,
           project management, compliance, HR, sales enablement, or any
           domain with structured testable knowledge.
