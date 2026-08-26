# Cross-project connections

**Status:** Living doc | Last updated: 2026-05-22
**Source notes:** Connections sourced from conversation history (March–May 2026) and Drive documents. May 20 2026 cross-document analysis session identified the INT ≡ FlashFusion PoC equivalence and the "Supervision Tax" unifying mechanism. All [GENERATED] labels mark inferences; [SOURCED] marks confirmed data.

---

## The four projects

| Project | Lane | Status | Core function |
|---------|------|--------|---------------|
| INT (Intinc) | INT | Active daily | L1 service desk + self-initiated AI automation |
| FlashFusion | FlashFusion | Primary focus | AI consulting + Fusion AI agent platform |
| flash-n-frame.com | FlashFusion / Personal | 40/100 production readiness | Visual Intelligence Platform (showcase) |
| Memoir | Personal | Instructions only — no content | Narrative exploration of "Construction over Recovery" |
| Skills Library | Meta | 69 skills | Execution infrastructure for all lanes |

---

## The five connections

---

### Connection 1: INT KB automation ≡ FlashFusion Tier 2 PoC

**Type:** Structural equivalence — the most important undocumented fact across all four projects.

**What it is:**
The INT KB automation pipeline — resolved ticket → AI classify → generate structured KB article → publish to FreshService — is architecturally identical to the FlashFusion Core Build service.

| INT KB automation | FlashFusion Core Build |
|-------------------|------------------------|
| Ingest: FreshService resolved ticket | Ingest: client's manual workflow data |
| Classify: AI categorizes by issue type | Classify: AI identifies automation candidates |
| Generate: KB article in FreshService format | Generate: automated workflow in client's systems |
| Validate: check format and completeness | Validate: test against Benchmark Zero |
| Publish: push to FreshService KB | Publish: deploy to client's environment |

This is the Router → Planner → Executor → Validator → Publisher agent pattern from `ff-agent-stack-v199`, running in production today at Intinc.

**Measured metrics (from INT KB Automation Business Case, May 2026):** [SOURCED]
- Generation time: <90 seconds per KB article
- Cost: $1–5/month on existing stack
- Running in production: yes

**Why this matters:**
FlashFusion has not yet deployed for a paying client. The Anthropic Partner Network requires live proof-of-deployment. The INT KB automation IS that proof. It is the Zero-Admin Agency Package FlashFusion identified as its first PoC experiment. It is already running.

**The one thing to do:**
Package the INT KB automation as a named FlashFusion case study. Write it up with actual metrics. Label it: "Zero-Admin KB Generation — Live at Intinc MSP." This single document changes the FlashFusion sales pitch from "here's what we'll build" to "here's what we already built and measured."

---

### Connection 2: n8n integration layer — 11 workflows blocked

**Type:** Operational dependency — the pipe that automates connection 1.

**What it is:**
11 n8n workflows (4 WIR + 7 OAI) connect the INT service desk to FlashFusion agent workflows. When active, they create a fully automated chain: INT incident closed → n8n trigger → FlashFusion agent analysis → KB article generated and published.

**Current state:**
- Status: INACTIVE. All 11 workflows blocked.
- Blockers: Missing Base44 Bearer credentials + missing SCH-02 lane field
- Orphans: 4 WIR-01 duplicate workflows with no cleanup task

**Why this matters:**
Connection 1 (INT ≡ FlashFusion PoC) currently requires manual or separate-trigger operation. The n8n layer is what makes it automatically continuous. Unblocking it converts the observation into a system.

**The one thing to do:**
Add Base44 Bearer creds + SCH-02 lane field to n8n. Clean 4 orphan WIR-01 duplicates. Estimated: 2–4 hours of work.

---

### Connection 3: flash-n-frame → FlashFusion reference architecture

**Type:** Technical demonstration — a live public version of what FlashFusion proposes to clients.

**What it is:**
flash-n-frame.com uses the exact stack FlashFusion's Core Build service deploys:

| Component | flash-n-frame | FlashFusion client build |
|-----------|--------------|--------------------------|
| Edge runtime | Cloudflare Workers | Cloudflare Workers |
| Auth + DB | Supabase Auth + Postgres | Supabase Auth + Postgres |
| Hot state + rate limiting | Upstash Redis | Upstash Redis |
| LLM routing | 4 providers (Gemini/OpenAI/Anthropic/Grok) | Multi-provider routing |

**Current state:** 40/100 production readiness (NOT READY, April 2026). Seven-phase remediation roadmap delivered. Execution status unknown.

**Why this matters:**
A flash-n-frame at 90+/100 is: (a) a public portfolio proof point, (b) a reference architecture for client proposals, (c) a case study eligible for Anthropic Partner Network. Bringing it to production readiness is not optional for FlashFusion's credibility.

**The one thing to do:**
Run the automated audit to re-establish the current score vs. the April 2026 baseline. Then complete the remaining remediation phases in order.

---

### Connection 4: Memoir → FlashFusion — "Construction over Recovery"

**Type:** Philosophical — the memoir is the origin story of the brand.

**What it is:**
The memoir explores "Construction over Recovery" as a lived personal philosophy. FlashFusion's entire service model is this same philosophy applied to client work:

| "Construction over Recovery" (personal) | FlashFusion service model |
|------------------------------------------|---------------------------|
| Build systems that don't need constant intervention | Audit-first; Benchmark Zero before any build |
| Don't ship fast and fix later | Kill criteria at every phase gate |
| Account for failure modes in advance | Performance bonus tied to proximal metrics, not revenue promises |
| Prefer maintainability over cleverness | Model drift disclaimer in SOW; quarterly prompt reviews |

**Current state of memoir:** Zero written content. Only project instructions exist.

**The "Supervision Tax" extension:** [GENERATED — from May 20 2026 cross-doc analysis]
The unifying mechanism connecting memoir, INT, and FlashFusion is the "Supervision Tax" — the insight that AI output grows faster than the human capacity to verify it, negating the time saved. The INT KB doc identifies this at the service desk level (manual KB creation effort > perceived value under ticket load). The FlashFusion consulting model exists to solve this problem for clients. The memoir is where the human experience of this same dynamic lives. Same pattern, three scales.

This connection is the strongest positioning FlashFusion has. It is not yet named in any outward-facing document.

**The one thing to do:**
Write a "Construction over Recovery" standalone document. ~1,500 words. This closes the memoir gap, creates FlashFusion's origin story, and names the unifying thesis for the first time.

---

### Connection 5: Skills Library → all lanes

**Type:** Meta-infrastructure — the accumulator platform in practice.

**What it is:**
The 69-skill library is the execution layer that enables work in all four project lanes. Every skill encoded from any lane persists and becomes available to all other lanes.

**Lane distribution (approximate):**
- INT: operating-int-service-desk, unifying-service-desk, generating-kb-articles, generating-intinc-documents, int-ai-enablement-pm, int-data-analyst, kb-screenshot-automator
- FlashFusion: ff-agent-stack-v199, building-flashfusion-live-artifacts, facilitating-ai-workshops, use-case-discovery, roi-calculator-building, enabling-ai-solutions, ai-solution-architecture
- flash-n-frame: operating-flash-n-frame (new, from this session)
- Personal: anchor, tracking-personal-challenges, using-fart-prompt
- Cross-cutting (serves all): applying-adversarial-review, engineering-staff-workflows, engineering-patterns, sparc-methodology-coach, task-decomposition, developing-skills, auditing-and-rewriting-skills

**Known gap:** No skill with no assigned lane — 5 overlapping design skills (advanced-ux-patterns, advanced-visual-design, applying-web-design-standards, professional-web-design, ui-component-library) have unclear trigger differentiation.

**Why this matters:**
The skills library IS the accumulator platform described in the FlashFusion model ("good architecture absorbs signals incrementally"). Every session adds to it. Every lane benefits from every other lane's learnings.

**The one thing to do:**
Build a skills lane index (30-minute audit). Map each skill to primary lane, flag ambiguous triggers, consolidate the 5 overlapping design skills. This makes every future session more precise and reduces skill misfires.

---

## The unifying thesis (undocumented)

From the May 20 2026 cross-document analysis session: [SOURCED — session memory]

> "Your memoir philosophy, your technical architecture, and Runbook Part K's failure recovery model are all running the same logic at different layers. That's not a coincidence — it's a unifying thesis that isn't yet named in any of your outward-facing FlashFusion docs."

**The thesis:** The "Supervision Tax" — AI output grows faster than human ability to verify it, negating time saved — is the problem that operates at every scale of this work. The response at every scale is Construction over Recovery: build systems with quality gates, kill criteria, and checkpoints, rather than shipping fast and recovering from failures.

This thesis connects:
- The memoir (lived personal experience of the pattern)
- INT KB automation (service desk scale: manual verification effort > time saved without automation)
- FlashFusion consulting (client scale: 80% of AI projects fail because verification was not designed in)
- FlashFusion agent platform (technical scale: ff-agent-stack-v199 Validator agent + checkpoint recovery are the technical answer)

**Where it needs to appear:**
- FlashFusion About page / pitch deck
- The "Construction over Recovery" standalone document
- FlashFusion website positioning copy

---

## Action priority (WSJF order)

| Action | Time | Value | Urgency |
|--------|------|-------|---------|
| Write the INT KB automation case study | 2–3 hr | Very high (unlocks partner network, client proposals) | High |
| Write "Construction over Recovery" doc | 3–4 hr | High (closes memoir gap + brand origin story) | High |
| Unblock n8n (Base44 creds + SCH-02 field) | 2–4 hr | High (activates INT→FlashFusion automation) | Medium |
| Re-run flash-n-frame production audit | 1 hr | High (establishes current score before remediation) | Medium |
| Build skills lane index | 30 min | Medium (improves session precision) | Low |
