# FlashFusion Operational Agent Fleet — Provisioning Runbook

**Workspace:** `wrkspc_01AxEsr9Kuw9nWohhG19mdCV`
**Product:** Claude Managed Agents (beta header `managed-agents-2026-04-01`)
**Scope:** The 15 *operational* agents that run FlashFusion. Your existing 15 (Conductor, Guardian, Sentinel, Watchtower, Prime, Ethica, Validator, Inspector, Archivist, Pipeline, Ambassador, Strategos, Atlas, Agent K, Tessa) are a **governance / control plane** — they watch and validate. This fleet **does the work**.

---

## 0. How to build these (GUI vs CLI)

You're in the GUI on mobile, so **GUI is the fast path right now**:
1. Agents → **Create agent** (or Quickstart → "Describe your agent").
2. Paste the description (Section 2).
3. Set **model** (Section 2 table).
4. Step 2/3: attach **connectors** and **skills**.
5. Step 4: set **Recurring** + cadence if listed.
6. Create an **Environment** (cloud sandbox) and bind the **vault** (Section 3b).

**CLI alternative** (for scripting all 15 idempotently): verified core is
`ant beta:agents create --name "..." --model '{id: claude-sonnet-4-6}' --system "..." --tool '{type: agent_toolset_20260401}'`
and `ant beta:environments create --name "..." --config '{type: cloud, networking: {type: unrestricted}}'`.
The exact flags for **attaching MCP servers, skills, scheduled deployments, and vaults** I have NOT verified against the live CLI — request the full script and I'll fetch the current syntax from the docs before handing you anything labeled production-ready. Do not run guessed flags.

---

## 1. Build order (phased — do NOT stand up all 15 at once)

| Phase | Agents | Why first |
|---|---|---|
| **P1 — revenue engine** | Scout, Outreach Writer, Intake Analyst, Audit Builder, Cash Tracker | Directly sources, closes, delivers, and collects money. |
| **P2 — flywheel** | Prompt Researcher, Prompt Drafter, Repurposer, SEO Scout, Contract Drafter | Content lead-gen + close mechanics. |
| **P3 — ops/support** | Pipeline Keeper, Support Responder, KB Keeper, Stack Watch, Market Intel | Hygiene, retention, observability. |

Each recurring agent bills continuously. Phasing also lets **Stack Watch** (P3) catch the cost curve once it exists.

---

## 2. The 15 agents — paste-ready descriptions

Paste each into "Describe your agent." Set the model and HITL gate as listed. **HITL = Yes** means the agent **drafts/proposes only**; a human approves the send/charge/sign.

### GROWTH

**1. Scout** — Sonnet 4.6 — Recurring: daily — HITL: none (read/enrich only) — Template: Blank
> You are FlashFusion's lead-sourcing agent. On a daily schedule, find net-new B2B prospects matching our ICP (mid-market services/MSP firms and ops-heavy SMBs evaluating AI enablement). Enrich each with firmographics, decision-maker role, and a one-line relevance reason, then write them to HubSpot as contacts tagged `agent-sourced`. Do not contact anyone. Output a ranked shortlist with the single strongest outreach angle per prospect.

**2. Outreach Writer** — Sonnet 4.6 — Recurring: queue — HITL: **Yes (draft only)** — Template: Blank
> You draft outbound and follow-up messages for FlashFusion prospects in HubSpot. For each contact in the `agent-sourced` or `needs-followup` segment, write a short, specific, no-hype message in Kyle Rosebrook's voice referencing the prospect's actual context. Save every message as a HubSpot draft/task. Never send. Flag any contact where you lack enough context to personalize.

**3. Pipeline Keeper** — Haiku 4.5 — Recurring: daily — HITL: low (flag if it would email) — Template: Blank
> You maintain FlashFusion deal hygiene in HubSpot. Daily, find deals with stale stages, missing next-steps, or no activity in 7+ days. Update internal fields (next-step, owner reminder) and produce a short "deals at risk" digest. Do not email prospects. Surface anything that needs Kyle's decision.

### DELIVERY

**4. Intake Analyst** — Sonnet 4.6 — Recurring: on submission — HITL: none — Template: Structured extractor
> You convert FlashFusion FreeAssessment / scorecard submissions into structured audit input. Pull new submissions from Supabase/Base44, parse free-text answers into a typed JSON schema (org profile, current AI maturity, friction points, stated goals, budget signal), and write the structured record back. Flag incomplete submissions. Do not contact the submitter.

**5. Audit Builder** — Opus 4.8 — Recurring: on demand — HITL: **Yes (review before client)** — Template: Blank
> You generate FlashFusion's paid AI Readiness Audit deliverable from a structured intake record. Produce the full document: executive summary, maturity scoring, prioritized findings (WSJF), a phased recommendation, and an ROI projection labeled measured-vs-estimated. Output a draft for Kyle's review. Never deliver to a client directly.

**6. Contract Drafter** — Sonnet 4.6 — Recurring: on demand — HITL: **Yes (never auto-send for signature)** — Template: Contract tracker
> You draft FlashFusion client agreements (NDA, SOW, change order) from an engagement brief. Select the right template, populate it, apply AI-specific clauses, and stage it in DocuSeal as a draft. Never send for signature. Flag scope ambiguities and missing terms for Kyle to resolve.

### CONTENT

**7. Prompt Researcher** — Sonnet 4.6 — Recurring: weekly — HITL: none — Template: Deep researcher
> You research the week's most relevant AI/automation developments for FlashFusion's newsletter, "The Prompt." Conduct multi-step web research, synthesize with citations, and produce a research brief organized for a creator-tech audience: what changed, why it matters, and one actionable workflow angle. Cite every source.

**8. Prompt Drafter** — Sonnet 4.6 — Recurring: weekly (after Researcher) — HITL: **Yes (approve before send)** — Template: Blank
> You draft "The Prompt" newsletter edition from the week's research brief, in Kyle Rosebrook's voice — direct, specific, no fluff. Produce a complete edition draft (hook, body sections, one workflow-of-the-week, CTA to audit.flashfusion.co). Output for Kyle's approval. Never publish.

**9. Repurposer** — Sonnet 4.6 — Recurring: queue — HITL: **Yes (draft only)** — Template: Blank
> You repurpose FlashFusion long-form content into platform-native posts for LinkedIn, X, and Threads, in Kyle's voice. For each source piece, produce platform-optimized drafts with the structural scaffold shown alongside each. Save as drafts. Never post.

**10. SEO Scout** — Haiku 4.5 — Recurring: weekly — HITL: none — Template: Field monitor
> You monitor keyword and content opportunities for FlashFusion using Ahrefs and Semrush. Weekly, surface 5–10 realistic ranking targets and competitor content gaps relevant to AI enablement for creators and SMBs. Output a prioritized topic list with difficulty and intent — not a sprawling keyword dump.

### OPS / FINANCE / SUPPORT

**11. Cash Tracker** — Sonnet 4.6 — Recurring: weekly — HITL: **Yes (any send/charge)** — Template: Blank
> You track FlashFusion's invoice lifecycle in Stripe. Weekly, identify outstanding/overdue invoices, draft AR follow-up messages, and produce a cash-position summary (outstanding, collected, upcoming). Draft only — never charge, never send. Flag anything requiring Kyle's decision. Use a restricted Stripe key (read + invoice).

**12. Support Responder** — Sonnet 4.6 — Recurring: — HITL: auto-draft, approve external replies — Template: Support agent
> You answer FlashFusion client and prospect questions from our docs and knowledge base (Notion). Draft accurate, sourced replies; escalate to Slack when the answer isn't in the KB or the question is sensitive (billing, contract, security). Never send an external reply without approval.

**13. KB Keeper** — Haiku 4.5 — Recurring: weekly — HITL: none (internal) — Template: Blank
> You keep FlashFusion's Notion knowledge base current. Weekly, flag stale articles, detect coverage gaps from recent support questions, and draft new/updated KB entries. Internal only — no external comms.

**14. Stack Watch** — Haiku 4.5 — Recurring: daily — HITL: none — Template: Field monitor
> You monitor FlashFusion's production stack health via PostHog. Daily, summarize key product metrics, surface anomalies (error spikes, drop-offs), and flag cost/usage anomalies. Output a short health digest. **(Consider running this as a recurring deployment under your existing Watchtower or Sentinel agent instead of a new agent.)**

**15. Market Intel** — Haiku 4.5 — Recurring: weekly — HITL: none — Template: Field monitor
> You monitor the AI-enablement / creator-tech competitive landscape for FlashFusion. Weekly, scan for competitor moves, pricing shifts, and new tooling, and produce a concise digest with implications for positioning. Cite sources.

---

## 3. Cross-cutting setup (the "etc." you asked for)

### 3a. Connectors / MCP — two kinds, don't conflate
- **OAuth connectors** (HubSpot, Notion, Slack, GitHub, Stripe, Supabase via MCP): you authorize once in the Console; the platform manages the token. Attach them per agent in the connector step.
- **API-key tools** (Apollo, Clay, Ahrefs, Semrush, PostHog, Base44 Bearer): the key lives in the **vault** (3b), referenced by the tool.

### 3b. Credential vaults
**Rotate first.** 🔴 Delete the Drive doc holding raw API keys and rotate every credential **before** vaulting. Do not load compromised keys into 15 agents.

Vault var names (create in the agent's Environment → Vault):
```
HUBSPOT_TOKEN            # if not using OAuth connector
APOLLO_API_KEY
CLAY_API_KEY
AHREFS_API_TOKEN
SEMRUSH_API_KEY
POSTHOG_PROJECT_API_KEY
BASE44_BEARER
SUPABASE_ANON_KEY        # prefer anon + RLS
SUPABASE_SERVICE_ROLE    # AVOID; only if a job truly needs it, scope tightly
STRIPE_RESTRICTED_KEY    # invoice + read scope ONLY, not full secret key
DOCUSEAL_API_KEY
RESEND_API_KEY           # if any agent sends mail (none should, by default)
```
Scoping rules: Stripe = restricted key, never the full `sk_live`. Supabase = anon + RLS by default; `service_role` is high blast-radius. Nothing goes in a system prompt — ever.

### 3c. Knowledge base
There's no standalone "KB" object — it's **Notion (MCP)** + **uploaded Files** + **Skills**. Attach Notion as the knowledge source for **Support Responder**, **KB Keeper**, and **Audit Builder**. Upload static reference docs (audit methodology, pricing, ICP) as Files to the agents that need them.

### 3d. Skills
Map your library to agents (attach in the agent config):
| Agent | Skills |
|---|---|
| Scout / Outreach / Pipeline Keeper | managing-ff-pipeline (+ generating-social-posts for voice) |
| Intake Analyst / Audit Builder | scoping-ai-engagements, roi-calculator-building |
| Contract Drafter | managing-ff-contracts |
| Prompt Researcher / Drafter | producing-ai-newsletter, deep-research-lcot |
| Repurposer | generating-social-posts, drafting-multi-format-content |
| SEO Scout | researching-content-opportunities, publishing-optimized-content |
| Cash Tracker | managing-ff-finances |
| Support Responder / KB Keeper | generating-kb-articles, building-kb-pipelines |
| Stack Watch | instrumenting-production-stack, governing-stack-costs |
| Market Intel | deep-research-lcot, managing-community-presence |

**Caveat:** Managed Agents "Skills" may require the platform skill format. Your Cowork/Claude-Code skills may need repackaging/uploading rather than dropping in unchanged — verify on the first one before assuming all transfer.

### 3e. Webhooks — ONE endpoint, not fifteen
Settings → Create webhook endpoint. Point the URL at a **Make** webhook (your primary automation) or a Cloudflare Worker. Subscribe:
- Session lifecycle: `run_started`, `rescheduled`, `idled`, `terminated`
- Threads: created / idled / terminated
- Outcomes: `outcome_evaluation_ended`  ← route this to your HITL approval step
- Vault lifecycle: `vault.created` (+ others)

This is your fleet-wide run log, failure alerting, and approval trigger. Fan out by event type in Make.

### 3f. Prompt caching
Automatic in the harness. Nothing to configure. Ignore as a setup task.

### 3g. Model tiering & cost
- **Haiku 4.5** → monitors (Pipeline Keeper, SEO Scout, KB Keeper, Stack Watch, Market Intel).
- **Sonnet 4.6** → workers (most of the fleet).
- **Opus 4.8** → Audit Builder only (deep reasoning on a paid deliverable).
Recurring agents bill on every run. Match cadence to value (weekly, not hourly, unless it pays).

### 3h. HITL / permissions / blast radius — policy
**Draft-only, human-approves** for anything that: charges money (Cash Tracker), sends to a real prospect/client (Outreach, Prompt Drafter, Repurposer, Support external replies), signs a contract (Contract Drafter), or ships a client deliverable (Audit Builder). Use the `outcome_evaluation_ended` webhook + an approval queue. Autonomous send/charge/sign is the one class of mistake that's both expensive and irreversible.

### 3i. INT boundary
This fleet is FlashFusion only. Do **not** point autonomous agents at INT/MSP client systems — that's outside your L1 authorization and a real blast-radius risk. Any INT agent is a personal **draft-only** aid in your own workspace (e.g., KB-article drafter), never an actor on client infrastructure.

---

## 4. Deployments for your existing 15
| Existing agent | Recommended deployment |
|---|---|
| Watchtower, Sentinel, Guardian | Recurring (monitoring cadence) |
| Validator, Inspector | Triggered by Conductor (not standalone schedule) |
| Archivist, Atlas | On-demand or low-frequency recurring |
| Prime, Ethica | On-demand (invoked in review flows) |
| **Agent K (Break-Glass)** | **On-demand ONLY — never scheduled** |
| Ambassador, Pipeline | Confirm what they do before adding Scout/Outreach/Pipeline-Keeper (possible duplication) |

*(I can't see your Deployments tab — confirm which currently lack deployments.)*

---

## 5. Acceptance criteria + smoke test

**Per agent (done = all true):**
- Appears in Agents list as **Active**.
- Recurring agents show a **next-run** time.
- Connectors authorized; vault vars present (no secrets in system prompt).
- A single manual run completes and emits `outcome_evaluation_ended`.
- HITL agents produce a **draft** and take **no external action**.

**Fleet smoke test:**
1. Create the webhook endpoint; send a test event → confirm Make/Worker receives it.
2. Run **Scout** once → confirm HubSpot gets `agent-sourced` contacts and the run fires a lifecycle event.
3. Run **Outreach Writer** once → confirm it produces drafts and sends nothing.
4. Confirm **Stack Watch** (or its deployment under Watchtower) reports the new agents' run activity.

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS
- [SOURCED] Agents = reusable versioned configs (model, system prompt, tools, MCP, skills); run in an Environment sandbox; deployments can be Recurring. (platform.claude.com Managed Agents docs; Quickstart screenshot)
- [SOURCED] Webhooks subscribe to session/thread/outcome/vault lifecycle events; vaults store credentials; prompt caching is built into the harness. (Console webhook modal screenshot; managed-agents docs)
- [GENERATED] The 15-agent fleet, model tiering, skill mappings, and HITL gates are reasoned from your FlashFusion operation and skill library — not read from your live config.
- ! [GENERATED] **Skills may not transfer unchanged** from your Cowork/Claude-Code library into Managed Agents; format/upload may differ. Verify on agent #1.
- ! [GENERATED] **#2/#3 may duplicate Ambassador/Pipeline; #14 likely belongs under Watchtower/Sentinel.** Check before creating.

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS
- I can't see your Deployments tab, connector list, or vault contents — duplication and missing-deployment specifics need your confirmation.
- Exact CLI flags for MCP/skill/schedule/vault attachment are unverified; request the script and I'll ground them in current docs first.
- Whether this workspace is standard or the AWS Claude Platform variant (feature/behavior differences) is unknown.
- Recurring-run cost depends on cadence × tokens × tool calls — model tiering helps but real spend is unmeasured until Stack Watch exists.
- Your ICP wording, audit deliverable structure, and newsletter format are inferred; tune the prompts to your actual definitions.

## SELF-REVIEW
Checked against your rules: no secrets in prompts (vault-only, rotate-first flagged); no autonomous send/charge/sign (HITL gates explicit); no INT/client-system autonomy; no inflated tool count; cost + blast-radius blocks included; duplication/overlap flagged rather than silently padding to 15; CLI left unshipped rather than handing you guessed flags labeled production-ready. Caught and fixed: removed Resend from default sends (no agent should auto-mail), demoted Stack Watch from "new agent" to "deployment under existing monitor."
