# Chris Butler — 5-skill suite for product workflow automation

> **TL;DR:** FlashFusion delivered a 5-skill pack that compressed Chris Butler's product research and synthesis workflow from a 4-step manual process across 3 tools into a single skill-driven flow inside Claude. Engagement completed in 3 weeks. Suite is now in daily use.

**Client:** Chris Butler — independent product strategist working with enterprise B2B clients
**Engagement type:** Enablement Sprint — Custom Skill Pack
**Duration:** 3 weeks
**Investment:** $5,000 fixed
**Outcome:** Skill pack live, in daily production use, paying back the engagement cost within the first 6 weeks of use based on Chris's own time-tracking estimate.

---

### The problem

Chris's working day involved a lot of synthesis: turning interview transcripts into themes, themes into market positioning briefs, briefs into client-ready decks. Each step lived in a different tool — Otter for transcripts, a personal Notion stack for theme tracking, a slide template in Google Slides. The handoff between steps was the bottleneck. Not the thinking — the carrying.

Specifically: pulling structured insight out of a 60-minute transcript and getting it into a Notion page in a usable format was a 25-30 minute job per interview, done across two tools, with consistent format drift between sessions. After 4 interviews, the format drift made cross-interview comparison brittle. After 8, it became unusable.

The trigger event was a project where Chris had 12 customer interviews to process in 4 days. The math didn't work. He needed the synthesis steps to compress, and he needed format consistency that would survive across the full set.

### What we built

We scoped 5 skills, each addressing a specific bottleneck in the workflow. Each skill is a structured prompt with role definition, process steps, output schema, and quality gates — installable in Chris's Claude environment and triggerable with a short invocation.

**Key components:**

- **`extracting-interview-themes`** — takes a raw transcript, identifies the 5-7 dominant themes, returns them with verbatim quotes and timestamp ranges. Replaces the manual highlight-and-tag step.
- **`synthesizing-cross-interview-patterns`** — takes 3-12 themed transcripts, finds recurring patterns and dissenting signals, returns a synthesis brief in Chris's preferred outline format. Replaces the manual cross-reference step.
- **`drafting-positioning-statement`** — takes a synthesis brief and returns 3 positioning options with explicit tradeoffs. Designed for client-ready review, not first-draft brainstorming.
- **`generating-deck-outline`** — takes a positioning statement and returns a 12-slide outline with section headers, key claims, and supporting evidence pointers. Direct handoff to Slides.
- **`auditing-evidence-chain`** — runs across the full deliverable and flags any claim not traceable to a specific interview or piece of source material. The quality gate Chris previously did manually as a 30-minute review.

The skills share a common output schema, which means cross-skill data passes cleanly. The synthesis brief from skill 2 is the input to skill 3 without manual reformatting.

### What changed

**Before:**
- Per-interview synthesis time: ~25 minutes
- 12-interview project total: ~5 hours of synthesis labor before drafting could begin
- Format drift across interviews: visible by interview 4, breaking by interview 8
- Quality audit step: ~30 minutes manual, often skipped when deadline was tight

**After:**
- Per-interview synthesis time: ~6 minutes
- 12-interview project total: ~70 minutes of synthesis labor before drafting could begin
- Format drift across interviews: zero — the schema enforces consistency
- Quality audit step: ~3 minutes, always run because it's now built into the closing skill

The headline win isn't the time savings — it's that the audit step now actually happens. The thing Chris valued most was the bottom of the funnel, not the top. Compressing the synthesis step freed enough margin that the quality gate stopped being negotiable.

### What this looks like for someone considering a similar engagement

If you're an independent operator or a small team running a research-heavy workflow that lives across 2-3 tools, and the bottleneck is synthesis quality at scale rather than thinking time on any single artifact, an Enablement Sprint is probably the right shape. The fixed-fee model ($5,000) and 3-week duration mean you don't carry the integration cost; FlashFusion does.

The audit step before the sprint is the AI Setup Audit ($4,500, 90 minutes) — that's the diagnosis that tells us whether a skill pack is the right move or whether the answer is something else entirely.

If your synthesis workflow has the same shape Chris's did — multiple steps, format drift, a quality gate that gets skipped — let's talk. Email kyle@flashfusion.co or book the audit at audit.flashfusion.co.

---

### Quote

> "The format drift was the thing I'd given up on. I figured it was the cost of doing this work. The skill pack made it stop being a cost. Now I run interviews and trust that the synthesis step will produce something I can actually use across the set."
>
> — Chris Butler

---

*Case study published with explicit permission. Skill pack reviewed and approved by client prior to publication. Numbers based on client's own time-tracking estimates, not vendor measurements.*
