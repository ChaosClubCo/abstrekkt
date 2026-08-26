# Growth OS — Reusable Build Prompt

Paste this entire prompt into Claude. Fill in the `[BRACKETS]` sections with your project's real data before sending. The more specific you are, the better the AI context layer performs.

---

## PROMPT (copy everything below this line)

---

Build a React JSX artifact called **[PROJECT NAME] Growth OS** — a radial strategy wheel with a collapsible Claude-powered AI chat panel. Use the exact architecture, layout, and design system described below.

---

### DESIGN SYSTEM (do not deviate)

**Colors:**

- Background: `#0F0618`  
- Primary: `#A855F7` (violet)  
- Secondary: `#F472B6` (pink), `#22D3EE` (cyan)  
- Status — Good: fill `#0d2918`, badge/dot `#22c55e`, text `#bbf7d0`  
- Status — Moderate: fill `#291d06`, badge/dot `#f59e0b`, text `#fde68a`  
- Status — Poor: fill `#2a0d0d`, badge/dot `#ef4444`, text `#fecaca`  
- Status — Critical: fill `#2a0511`, badge/dot `#e11d48`, text `#fda4af`

**Typography:** Poppins (headings/logo, weight 700–800), Inter (body), JetBrains Mono (labels, meta, code). Load all three from Google Fonts.

**Style:** Dark-mode only. Glassmorphic panels with `backdrop-filter: blur`. No pure white. No generic purple gradients as backgrounds.

---

### LAYOUT

Two-column flex layout filling 100vh:

- **Left:** radial SVG wheel centered, fills remaining space  
- **Right:** chat panel, 400px wide, collapsible (slides to 0px width with CSS transition)

**Topbar** (46px, blurred dark):

- Logo: `⚡ [PROJECT NAME]` — Poppins 800, violet→pink→cyan gradient text  
- Badge: `Growth OS — [OPERATOR NAME]`  
- Tag: `[CONTEXT TAG] · [DATE]`  
- Right side: status legend row (Good / Moderate / Poor / Critical dots)

**Collapse mechanic:**

- Chat panel has a `›` button in the top-right of its header that closes it (width → 0, opacity → 0)  
- When closed, a fixed floating pill `✦ AI Strategy` appears bottom-right to reopen it

---

### RADIAL WHEEL

SVG viewBox `0 0 540 540`, center point `cx=270 cy=270`.

Five concentric rings (innerR → outerR):

1. **Target** — 65 → 102  
2. **Personas** — 105 → 142  
3. **Insights** — 145 → 182  
4. **Impact** — 185 → 222  
5. **Initiatives** — 225 → 268

Each ring contains segments. A segment is:

`{ label: "string", status: "good|moderate|poor|critical", start: 0, end: 360, detail: "tooltip text" }`

**Rules:**

- Segments within a ring must not overlap. Start/end values span 0–360 (with a 1.8° gap between segments).  
- A single-segment ring uses `start: 2, end: 358`.  
- Each segment renders: colored arc path + status dot + label text (truncated at 13 chars).  
- Hover triggers a rich tooltip: segment name, ring label, detail text, status badge.  
- Center node: two concentric circles, project name in two lines, "Growth OS" subtitle.

**Ring label guide text** (subtle, placed at top of each ring): Target / Personas / Insights / Impact / Initiatives

---

### CHAT PANEL

- Header: `✦` spark (gradient text), bold title "Let's ship your / growth strategy.", monospace subtitle with context and date  
- 4 pre-loaded suggested questions (shown only before first message)  
- Message thread: user bubbles (right-aligned, violet tint) + AI text (left-aligned, muted)  
- Thinking animation: 4 sequential steps reveal with spinner on current step, checkmarks on completed  
- Context tag pills below messages (clickable to add/remove, dashed style for inactive)  
- Textarea input with `Enter` to send, `Shift+Enter` for newline  
- Send button: violet gradient, disabled when empty or loading  
- Model tag footer: `Claude Sonnet 4 · [context label]`

**Claude API call:**

```javascript
fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: FF_SYSTEM, // your system prompt string
    messages: conversationHistory
  })
})
```

Extract reply: `data.content?.find(b => b.type === "text")?.text`

---

### YOUR PROJECT DATA (fill in below)

#### 1. Operator / Identity

Name: [YOUR NAME]

Role / day job: [e.g. Freelance designer, CTO at X, Solo founder]

Context: [e.g. building a SaaS product on the side, running an agency, etc.]

Constraint: [e.g. solo operator, small team of 3, bootstrapped]

Decision priority: [e.g. Maintainability > Correctness > Speed]

#### 2. Radial Wheel Segments

For each ring, list your segments. Assign each a status (`good`, `moderate`, `poor`, `critical`) and write a 1–2 sentence tooltip detail describing the real current state.

**Ring 1 — Target** (your primary market, usually 1 segment)

- Label: [your ICP / target market]

  Status: [good|moderate|poor|critical]

  Detail: [1–2 sentences on who they are and how well you're reaching them]

**Ring 2 — Personas** (2–4 buyer types)

- Label: [Persona name — archetype]

  Status: [...]

  Detail: [...]

(repeat)

**Ring 3 — Insights** (data signals you do/don't have: market intel, funnel data, delivery feedback)

- Label: [e.g. Market Signals / Funnel Data / User Feedback]

  Status: [...]

  Detail: [...]

**Ring 4 — Impact** (outcome categories: Revenue, Retention, Audience, etc.)

- Label: [...]

  Status: [...]

  Detail: [...]

**Ring 5 — Initiatives** (your actual active projects, 4–8 max)

- Label: [Project/initiative name]

  Status: [...]

  Detail: [Real current state: what's live, what's blocked, what's next]

(repeat)

**Segment math:** Divide 356° evenly across segments in each ring. Single segment = `start: 2, end: 358`. Two equal segments = `start: 2, end: 179` and `start: 182, end: 358`. Three equal ≈ `0–119`, `122–239`, `242–358`. Round to nearest integer.

---

#### 3. AI System Prompt (the most important part)

Write a system prompt that gives the AI real context. Use this structure:

```
You are the [PROJECT NAME] Growth Strategy AI — embedded in [OPERATOR NAME]'s operating system.

═══ WHO YOU'RE TALKING TO ═══
[Name, role, background, constraints, decision priorities]

═══ ACTIVE PROJECTS ═══
[For each initiative: what it is, current status, specific blockers, key IDs/metrics]

═══ BUYER PERSONAS ═══
[For each persona: who they are, how they buy, current status]

═══ CURRENT BLOCKER SUMMARY ═══
[Numbered list of what's actually stuck and why]

═══ HOW YOU ANSWER ═══
- Reference specific project names and blockers
- Prioritize by impact × urgency ÷ effort
- Propose the single next executable action
- Direct: 3–6 sentences unless asked for depth
- Never generic. Never motivational filler.
```

---

#### 4. Suggested Questions (4 questions pre-loaded in the chat)

Write 4 questions that surface the most important strategic tensions in your project right now. Examples:

- "What's leaking the most revenue right now?"  
- "Which initiative should I kill first?"  
- "Where am I losing qualified leads in the funnel?"  
- "What's the highest-leverage move I can make this week?"

Q1: [...]

Q2: [...]

Q3: [...]

Q4: [...]

---

#### 5. Context Tag Pills (shown in the input area)

List 6 context labels users can toggle on/off (default 3 active):

Active by default: [tag1], [tag2], [tag3]

Inactive (addable): [tag4], [tag5], [tag6]

---

#### 6. Topbar / Branding

Logo text: [PROJECT NAME]

Badge text: Growth OS — [OPERATOR NAME]

Tag line: [audience/context] · [Month Year]

---

### IMPLEMENTATION NOTES

- All styles inline via a `<style>` tag (single-file JSX artifact)  
- No external CSS imports except Google Fonts  
- Use `useState`, `useRef`, `useEffect` only (no routing, no Redux)  
- Scrollbar: 4px, violet tint  
- Tooltip clamped to viewport width: `left: Math.min(x + 16, window.innerWidth - 320)`  
- Thinking steps: 4 items, 520ms stagger, spinner on current, ✓ on done  
- Chat messages: full conversation history passed in each API call (stateful multi-turn)  
- `Enter` sends, `Shift+Enter` newlines, textarea auto-expands to 96px max

---

Now build the complete artifact using the architecture above and the project data I've provided.
