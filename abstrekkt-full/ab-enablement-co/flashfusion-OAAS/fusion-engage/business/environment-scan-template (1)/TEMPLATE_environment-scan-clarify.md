# Environment Scan + Clarification Template

## When to Use
Invoke this template at **project kick-off**, **architecture reviews**, **scope uncertainty**, or **risk assessment gates**. Use the phrase "run full environment scan" or "scan and clarify" to trigger this workflow.

---

## PHASE 1: Environment Introspection (Auto-Populated)

### Current Project Lanes
- **Active:** FlashFusion (Wix, Catalog V1, 20 products), chaosclub.co (React 19 + Firebase + Gemini), Fusion AI (Base44), Intinc Deployment Kit
- **Blockers:** n8n workflows (11 pending Base44 Bearer creds + SCH-02), FlashFusion (Velo 500 error, shipping API, click tracking)
- **Infrastructure:** Claude + Google Antigravity IDE + GitHub + Vercel, Supabase, n8n, Make, Zapier, Stripe, PostHog, Resend, Cloudflare, Notion, Gemini, Base44

### Available MCP Servers
- **Deployed:** Gmail, Google Drive, Google Calendar, Slack, Linear, Notion, Supabase, Base44, Zapier, Make, n8n, Vercel, Cloudflare, Stripe, PostHog, Canva
- **Primary workflow:** Claude API ↔ Base44 ↔ n8n/Make orchestration

### Skill Stack (Active)
- **Data/Architecture:** DB-ARCH v1.0, applying-sparc-methodology
- **Build & Deploy:** engineering-staff-workflows, writing-shell-scripts, organizing-projects, project-bootstrapper
- **Content & Design:** managing-design-briefs, elite-ui-design, drafting-multi-format-content, producing-ai-newsletter
- **Automation:** orchestrating-ai-agents, workflow-automation, running-drive-automation
- **Debug & QA:** code-auditor, fixing-tests, debug-like-expert

### Known Constraints
- **Security:** No frontend API keys; server-side auth only; env vars mandatory
- **Integration:** Drive-only reference system; GitHub hoard (~500 repos); Obsidian plugin scoped but not deployed
- **Velocity:** Parallel lane model; no lane gatekeeping; "what's the focus sprint?" before prioritization

---

## PHASE 2: Five Clarification Questions

Answer **all 5** unless you explicitly request "LITE mode" (skip to 3 critical questions). Format: short answers OK, but be specific.

### Q1: Scope & Deliverable
**What's the intended output? (feature, system, audit, content, decision)**
- Examples: "Production API endpoint," "design system audit," "2-hour POC," "competitive research deck," "capstone artifact"
- *Why:* Determines LITE/STANDARD/FULL gate and skill routing

### Q2: Timeline & Stage
**When do you need this? Is this early-stage or production-hardened?**
- Examples: "Next 2 hours," "ship Friday," "long-term research," "audit before launch," "proof of concept"
- *Why:* Affects depth, testing rigor, documentation thoroughness

### Q3: Constraints & Dependencies
**What's locked in? (existing tech, API contracts, compliance, integrations, budget)**
- Examples: "Must use Supabase," "Stripe mandatory," "no external API costs," "SOC2 audit requirement," "depends on n8n flow X"
- *Why:* Eliminates false paths early; surfaces integration/auth risk

### Q4: Success Criteria & Risk Tolerance
**What makes this done? What's the blast radius if it breaks?**
- Examples: "90+ Lighthouse score," "zero data loss," "handles 1K concurrent," "POC, acceptable to fail," "customer-facing, must be bulletproof"
- *Why:* Sets acceptance bar; gates security/reliability trade-offs

### Q5: Context & Prior Art
**Has this been attempted before? Are there patterns/tools you want to reuse?**
- Examples: "Similar to chaosclub.co auth flow," "start from the INT customization PoC," "fresh build," "refactor the old Orchestrator"
- *Why:* Avoids reinvention; identifies architectural debt or proven patterns

---

## PHASE 3: Analysis & Routing

### Scope Gate Assignment
After answers, I assign:
- **LITE:** Single file, <4 hr, low risk → One ! flag max
- **STANDARD:** Multi-file, feature-level, moderate risk → Adversarial critic step
- **FULL:** System-level, auth/payment/data, high risk → Adversarial critic + threat model

### Skill + Tool Mapping
Map your answers to:
1. **Primary skill(s)** that activate (from your skill stack)
2. **MCP servers** needed (Gmail, Base44, Notion, etc.)
3. **Tech stack overlap** (existing infra reuse vs. new tooling)
4. **Blockers** (missing tools, integration gaps, knowledge gaps)

### Risk Surface
- **Data:** PII exposure, secret leakage, drift, loss
- **Auth:** Token scope, rate limits, rotation, service account overflow
- **Integration:** API breaking changes, rate limits, cost overruns, vendor lock-in
- **Execution:** Latency spikes, race conditions, resource exhaustion
- **Operational:** Observability gaps, runbook missing, on-call readiness

### Recommendation Path
- **Immediate action** (what to do in the next 30 min)
- **Phase 1 blockers** (what must be resolved before coding)
- **Workflow choice** (SPARC → code-gen → test → deploy, or rapid POC → iterate)
- **Handoff readiness** (what's needed for Base44/n8n/Notion integration later)

---

## PHASE 4: Next Actions (Choose One)

### Path A: **Execute Now**
- Clarifications answered, scope clear, zero blockers → jump straight to BUILD
- Deliverable: step-by-step implementation, test plan, deployment steps

### Path B: **SPARC First**
- Multi-file, architectural uncertainty, or high risk → run specification → pseudocode → architecture phase
- Deliverable: spec doc, architecture diagram, threat model (before a single line of code)

### Path C: **Quick Audit / Pre-Mortem**
- Uncertain if approach is sound → adversarial critic review of your plan
- Deliverable: weak points identified, alternative approaches suggested, go/no-go recommendation

### Path D: **Context Gathering**
- Missing information (competitor research, market data, existing systems audit) → research phase first
- Deliverable: structured findings, decision matrix, then proceed to build

### Path E: **Design Brief**
- Visual/UX component involved → anti-slop design gates first
- Deliverable: brief, token system, component hierarchy, then handoff to code

---

## Template Usage Examples

### Example 1: "Build a feature"
```
Run full environment scan for: [Feature Name]

Q1: Output → "API endpoint + React component + Base44 data model"
Q2: Timeline → "Ship by end of week, production-hardened"
Q3: Dependencies → "Integrates with existing Stripe flow, uses Supabase RLS"
Q4: Success → "100% test coverage, zero secrets in bundle, <100ms latency"
Q5: Prior art → "Similar to chaosclub.co Gemini integration"

→ Routes to: STANDARD gate → engineering-staff-workflows + SPARC → build
```

### Example 2: "Is this a good idea?"
```
Run environment scan for: [Project/Idea]

Q1: Output → "Feasibility assessment + recommendation"
Q2: Timeline → "Decision needed today, implementation TBD"
Q3: Constraints → "Must work with existing INT stack, no new vendors"
Q4: Risk tolerance → "POC acceptable to fail, but informs architecture choice"
Q5: Context → "Builds on Fusion AI, might become INT Customization Service"

→ Routes to: LITE gate → adversarial critic + threat model → decision memo
```

### Example 3: "Audit & optimize"
```
Run environment scan for: [System/Codebase]

Q1: Output → "Code audit + tech debt assessment + roadmap"
Q2: Timeline → "Ongoing, prioritize highest ROI improvements"
Q3: Constraints → "Can't refactor critical paths without feature freeze"
Q4: Success → "Identify 3–5 quick wins (1–4 hr each), long-term architectural improvements"
Q5: Context → "Flash-n-Frame scored 40/100, target 90+; inform overall debt strategy"

→ Routes to: FULL gate → code-auditor + priority matrix → parallel roadmap
```

---

## Customization & Reuse

Save this template in your reference system. When invoking:
- **Full mode:** "Run full environment scan + clarify for [project]"
- **Lite mode:** "Quick scan: [question 1], [question 2], [question 3]"
- **Async mode:** Paste Q1–Q5 answers in a note; I'll run analysis + routing when you're ready

Update Q1–Q5 answers as context shifts. Re-run before major phase gates (spec → code, code → deploy).

---

## Footer

**CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS**
- [GENERATED] Scope gates (LITE/STANDARD/FULL) are estimated based on task complexity; your actual scope may shift mid-execution.
- [GENERATED] Skill routing assumes your current skill library (as of Apr 2026); new tools or frameworks may open alternative paths.
- ! Risk surface is not exhaustive; project-specific threats (regulatory, vendor-specific, domain-specific) require separate threat modeling.

**GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS**
- This template assumes you're building within your current stack; greenfield projects on unfamiliar stacks need external research first.
- Blockers from previous sprints (n8n creds, FlashFusion Velo, Obsidian plugin) may cascade into new work; not all dependencies are visible at scan time.
- Timeline estimates assume solo execution; collaborative or approval-gated work requires visibility into other stakeholders' availability.
