# TIMELINE UPDATE PROMPT
# Paste this into any Claude project along with the project-focus-evolution.html file.
# Claude will run a full context sweep, synthesize all new data, and re-render the visual.
# No additional instructions needed — the prompt is fully self-contained.
# ─────────────────────────────────────────────────────────────────────────────

---

## TASK: UPDATE THE PROJECT FOCUS EVOLUTION TIMELINE

An HTML file has been attached. It is an interactive timeline of my project focus evolution across eras. Your job is to bring it fully up to date with maximum detail by completing the steps below in sequence. Do not skip steps. Do not start generating output until all research phases are complete.

---

### PHASE 1 — CONTEXT SWEEP (run all in parallel)

Pull these simultaneously before touching any code:

1. **recent_chats(n=20, sort_order=desc)** — capture the last 20 conversations
2. **recent_chats(n=20, sort_order=desc, before=[oldest from step 1])** — paginate back one more batch
3. **conversation_search("FlashFusion platform architecture")** — platform builds
4. **conversation_search("Intinc Staff Engineer AppSec")** — Intinc work
5. **conversation_search("Flash-n-Frame SaaS sprint")** — SaaS era
6. **conversation_search("newsletter The Prompt production")** — newsletter lane
7. **conversation_search("skills audit SKILL.md WSJF")** — infra / skill ecosystem
8. **conversation_search("job search career recalibrate")** — career tension signals
9. **conversation_search("ascend-ai investment pipeline")** — any new projects
10. **conversation_search("song lyrics Suno creative")** — personal / creative lane
11. **google_drive_search("FlashFusion OR Intinc OR newsletter")** — Drive documents
12. **Use memory (userMemories tag in system prompt)** — read all fields including recent_updates

Log each search result as one line:
`[SEARCH N]: "[query]" → X results, Y new signals found`

---

### PHASE 2 — SYNTHESIZE FINDINGS

After all searches complete, build a KNOWLEDGE BRIEF before touching any code.

For each era in the existing timeline, document:
- Any new projects, tools, or deliverables added since last update
- Any projects archived, shelved, or deprioritized
- Any stack changes (tools added or dropped)
- Any career/business pivots or tension points
- Any new patterns emerging that weren't in the previous version
- Approximate focus % shifts across lanes

Also check for:
- Whether a **new era** has opened (major pivot that warrants its own node)
- Whether any existing era's date range needs correction
- Whether the "RECURRING PATTERNS" section at the bottom needs new entries or rewrites

Print the KNOWLEDGE BRIEF in full before advancing.

---

### PHASE 3 — UPDATE THE HTML

Now rewrite the attached HTML file with maximum detail. Specifically:

**For each era node:**
- Update date ranges to be accurate
- Update the project tag lists (add new, mark newly archived with ✕)
- Update focus distribution bar percentages to reflect current evidence
- Expand the Key Signals list — aim for 7–9 signals per era, not 5
- Rewrite the Pivot Note if new information changes the narrative
- Add any sub-signals or nuance that was missing

**For the RECURRING PATTERNS section:**
- Update existing cards with new evidence
- Add new pattern cards if new patterns emerged
- Rewrite card copy if the pattern has evolved or contradicted itself

**For the CURRENT STATE banner:**
- Update the live date
- Rewrite the summary sentence to reflect what's actually most active right now

**For any new era (if warranted):**
- Add a full new ERA node with all sections populated
- Assign a color from the palette: rose → sky → amber → green → violet (cycle)
- Mark it as the active/open era if it represents NOW

**Style rules (do not change):**
- Keep the existing CSS design system (JetBrains Mono, Bebas Neue, DM Sans, dark background, grid overlay)
- Keep the toggle interaction (click to expand/collapse)
- Keep the color-coded dot system on the spine
- Do not simplify or abbreviate — this should be MORE detailed than the version attached, never less

---

### PHASE 4 — OUTPUT

Deliver:
1. The fully updated HTML file as a downloadable artifact
2. A plain-language summary of what changed (bullets: new signals added, eras updated, patterns changed, anything flagged as uncertain or contradicted)
3. A CLAIMS/COUNTEREXAMPLE/CONTRADICTIONS footer covering any generated estimates (especially focus % bars) and any unresolved tensions found in the data

---

### CONSTRAINTS

- Do not hallucinate project names, dates, or tools — if uncertain, mark with `[?]` in the HTML and flag in the summary
- Do not remove detail that was already in the attached file unless it is factually contradicted by new evidence
- Do not redesign the visual — evolve the content, preserve the form
- If a search returns zero results, log it as a gap and note it in the summary
- The goal is maximum fidelity to actual history, not a clean narrative

---

**Begin with Phase 1. Run all searches in parallel. Do not output anything until Phase 2 is ready.**
