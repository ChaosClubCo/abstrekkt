# Infrastructure Currency + App Documentation Plan
*Generated June 13, 2026 from live MCP/Base44 reads. Supersedes the April tool-archaeology counts.*

## TL;DR

- **MCP surface is current and mostly healthy**, but the connected set is far larger than the used set — ~100 servers connected, ~12–15 actually load-bearing. The gap is an attack surface, not a convenience.
- **Live Base44 count = 46 apps** (verified this session). Every prior figure was wrong: April "FINAL" said 5, March memory said 43, the GitHub audit said 32, project memory said 49. Use 46.
- **Two memory corrections:** (1) Base44 entity-read tools *did* load reliably this session — the "unreliable across sessions" note is stale, at least today; (2) the app named **"Invelo"** in Base44 is the one rebranded to **VELO** — the platform name never got updated.
- **Documentation should NOT cover all 46 apps.** ~35 are archive candidates. The plan documents **7 active apps + 4 software products**, auto-generates the data-model layer from live schemas (proven on FlashFusion: 19 entities pulled in one call), and explicitly skips the dead ones. Documenting archive-bound apps is the same focus violation the business plan just corrected.

---

## Part 1 — MCP currency status

"Ensure up to date" means three things here: confirm what's live, correct what drifted, and cut what's dead weight.

### 1.1 Core stack — load-bearing, keep healthy

These are the MCPs the business actually runs on. Verify auth/health monthly.

| MCP | Role | Status this session | Note |
|-----|------|--------------------|------|
| **Base44** | App platform (46 apps) | ✅ Live — `list_user_apps`, `list_entity_schemas` both worked | Memory's "entity-reads unreliable" is stale today; still verify before betting a workflow on it |
| **n8n** | Automation runtime | Connected | WIR-02/WIR-04 fix still pending: stale `orchestrator-ai-6ea9ba23` subdomain should point at FlashFusion app `6a02ac1b…` |
| **Supabase** | DB / RLS | Connected | Continuum's overdue-bill blocker — confirm resolved before recommending Supabase-dependent features |
| **Cloudflare** | DNS / domains | Connected | Needed for the `spark.flashfusion.co` CNAME (CLC runbook) |
| **Vercel** | Hosting | Connected | Continuum GitHub-app reconnect was a known break; confirm current |
| **GitHub** | Source / repos | Connected (via Composio) | 656 repos, consolidation target ~130 — unrelated to this doc but unresolved |
| **Stripe / PostHog** | Payments / analytics | Connected | PostHog wired to FlashFusion app for event capture |

### 1.2 Supporting — available, confirm you still want them

Connected and occasionally useful. No action beyond a "keep or cut" decision.

Notion, Gmail, Google Drive, Google Calendar, Todoist (reliable per memory), Canva, Cloudinary, Figma, Make (migration target from n8n), HeyGen, Slack, ms365.

### 1.3 Flaky — known issues, workarounds documented

| MCP | Issue | Workaround |
|-----|-------|-----------|
| **Kindora** | Frequently unresponsive (server-side) | Run health_check first; fall back to **Granted** |
| **Granted** | Daily AI-discovery budget exhausts fast | One well-scoped query per session |
| **Upwork** | Calls fail without setup | Must run `suggest_connectors` flow (UUID `df363d23-…`) before any call |
| **Ideabrowser** | — | Reliable; broad queries beat specific |

### 1.4 Connected-but-unused — the actual "up to date" action

The connected MCP list is ~100 servers. The vast majority (Ahrefs, Apollo, Atlassian, Airtable, Adobe ×4, Daloopa, Datadog, DevRev, Guidepoint, Harvey, IBKR, Plaid, Shopify, Twilio, Wolfram, and dozens more) show no evidence of use in the project record.

**This is a security finding, not a tidiness one.** Every connected MCP is a live credential and a potential prompt-injection / data-exfiltration path (your own `auditing-agent-security` skill covers exactly this). An agent with 100 connected tools has a 100-tool blast radius.

**Recommendation:** disconnect everything not in §1.1–1.3. Target a connected set of ~15. This is a 20-minute pass in connector settings and it materially shrinks the attack surface before any client-facing agent work runs. Re-connect on demand — connecting is one click.

---

## Part 2 — App documentation generation plan

### 2.1 The triage (don't document 46 apps)

The live list is 46. Most are dead. Documenting them is wasted hours and contradicts the focus discipline from Business Plan v2. Tier them first:

**Tier A — Document fully (7 active apps):**

| App | Base44 ID | Why it's documented |
|-----|-----------|--------------------|
| **FlashFusion** | `6a02ac1bad2b4e37732ef382` | Revenue-engine delivery platform — 19 entities, multi-tenant, HITL agent layer |
| **SparkAcademy** | `69180d077a5cbed7242f90ab` | LMS / Access-Retainer portal; CLC activation depends on it |
| **audit** (Involuer Scorecard) | `69c440b10249984f1114bc4b` | Live at audit.flashfusion.co; the top-of-funnel intake |
| **Invelo → VELO** | `69861bd9ee42e63a83ea6c2e` | Client delivery portal; **name drift to fix** |
| **Fusion AI** | `68dd8e79ca073475565c8e16` | Closed-beta flagship, large entity count |
| **Orchestrator AI** | `694c756124d640756ea9ba23` | n8n orchestration target; tied to the WIR-02/04 fix |
| **INTeract** | `691e3ae3bd4916f2e05ae35e` | INT-lane app — **document privately, never in FlashFusion/public material** (lane separation) |

**Tier B — Software products, document separately (4):** claude-code-plugins-plus, Ample, FissionPrompt, Flash-n-Frame. These aren't Base44 entity apps; they need code/architecture docs, not schema docs (different method — see §2.4).

**Tier C — Archive, do not document (~35):** Battle Arena Pro, AI Game Day Oracle, AuraFlow, LifeSync, Champions Hub, Nexus Copilot, Enterprise Hub, AI Studio, Proactive Mentor OS, SoleIgnite, and the rest of the stale tail. Decision required: archive or delete. Either way, no docs. *Exception:* `Sole Customizer` / `Sedona Soul Sessions` / `Tessa` are personal — exclude from any commercial documentation set entirely.

> **Hard rule:** kidcreator/StoryWeaver is a personal gift project. It does not appear in this inventory and is never documented as portfolio.

### 2.2 The method — auto-generate the data layer (proven)

For Tier A, the data-model documentation is **machine-generated, not hand-written**. One call per app does it:

```
Base44:list_entity_schemas(appId) → structured entity doc
```

Proven this session on FlashFusion: 19 entities, every field, enum, required flag, and RLS policy extracted in a single call. The companion file `FlashFusion-DataModel-AUTOGEN.md` is the output — that's what every Tier A app's data section looks like, generated not written.

**What auto-generation covers:** entities, fields, types, enums, required fields, RLS posture, inferred relationships (via `*_id` fields).

**What it can't cover (needs human pass):** what the app is *for*, who uses it, the UI/flows, deployment state, known issues. That's ~1 page of human writing per app on top of the generated schema.

### 2.3 The per-app doc template (Tier A)

Each Tier A app gets one markdown doc with these sections:

1. **Identity** — name, Base44 ID, live URL, lane, status (active/beta/blocked), owner.
2. **Purpose** — 2–3 sentences: what it does, who uses it. *(human)*
3. **Data model** — auto-generated from `list_entity_schemas`. *(machine)*
4. **Multi-tenancy & access** — the ClientOrganization/role boundary and RLS posture. *(machine-extracted, human-summarized)*
5. **Integrations** — n8n workflows, Supabase, PostHog, domain/CNAME. *(human)*
6. **Known issues / blockers** — e.g. VELO name drift, Orchestrator subdomain fix. *(human)*
7. **Currency footer** — date generated, source (live read vs memory), verification status.

### 2.4 Software products (Tier B) — different method

These have no Base44 schema; they're codebases. Document from the repo:
- **claude-code-plugins-plus** — plugin catalog index (count = verify live, not "244"), install method, distribution status (undecided).
- **Ample / FissionPrompt** — definition-gated per the business plan; doc is a one-pager: what exists (Figma UI, .jsx), what's undefined, kill-or-build gate.
- **Flash-n-Frame** — architecture + the active tool-route debugging state; PR #112 = last clean deploy.

Method: `view` the repo / project files → architecture doc. No schema call applies.

### 2.5 Sequence (matches business-plan priority)

1. **FlashFusion** — done (proof artifact attached). Add the human sections (purpose, integrations, issues).
2. **SparkAcademy + audit (Involuer)** — these gate live client work (CLC activation, intake funnel). Auto-gen + human pass.
3. **VELO** — auto-gen + **fix the Invelo→VELO name in Base44 while you're in there.**
4. **Orchestrator AI** — auto-gen + resolve the n8n subdomain fix as part of documenting it.
5. **Fusion AI, INTeract** — auto-gen; INTeract stays in the private/INT lane.
6. **Tier B products** — repo-based docs, lowest priority (parked per business plan until revenue floor).
7. **Tier C** — archive decision; no docs.

**Effort estimate [GENERATED]:** Tier A ≈ 1 call + ~1 hr human writing per app = ~7 hrs total. Tier B ≈ 2–3 hrs each. Don't batch all of it — do FlashFusion + SparkAcademy + audit (the three that touch live revenue) first, stop, and let the rest wait behind the same revenue gate as everything else.

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

- [SOURCED — live MCP] Base44 = 46 apps, June 13 2026 (`list_user_apps`, count: 46).
- [SOURCED — live MCP] FlashFusion app `6a02ac1b…` has 19 entities with full RLS (`list_entity_schemas`).
- [SOURCED — live MCP] Base44 entity-read tools loaded and returned cleanly this session.
- [SOURCED — memory] Flaky-MCP workarounds (Kindora/Granted/Upwork) and reliable ones (Todoist/Ideabrowser).
- [GENERATED] The ~12–15 "load-bearing" vs ~100 "connected" split is inferred from project-record usage evidence, not a usage log; confirm against actual connector activity if available.
- [GENERATED] Tier assignments (A/B/C) are reasoned from app names + project history; confirm against live status before archiving anything — a name like "Conduit" or "Knowledge OS" could be active and mislabeled here.
- ! CONTRADICTION resolved: April "FINAL" archaeology said Base44 = 5 apps "verified." Live count is 46. The April number was a Portfolio-Command-Center subset, not the account total — don't trust it.
- ! CONTRADICTION flagged: memory says "Base44 entity-reads don't load consistently across sessions." They loaded fine today. Treat reliability as intermittent, not resolved — keep the verify-first habit.
- ! NAME DRIFT: Base44 app `69861bd9…` is named "Invelo"; the brand is VELO. Public/client material must say VELO; the platform record needs updating.

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS

- **No live health-check was run on n8n, Supabase, Vercel, Cloudflare** — their "connected" status is from the session's connector list, not a ping. Continuum's Supabase/Vercel blockers may still be live. Verify before depending on them.
- **The ~35 Tier-C apps weren't individually inspected.** Some may be active and misfiled as stale (the reverse risk of the archive decision). A 5-minute pass per app to confirm dead-vs-active is required before archiving — don't archive a live client app on a name guess.
- **Connected-but-unused list is inferred, not enumerated from a usage log.** I can see what's *connected* but not what's been *called*. The security recommendation (cut to ~15) is directionally right but should be validated against real connector activity before disconnecting anything a workflow secretly depends on.
- **No verification that the 7 Tier-A apps are all actually deployed/live** — entity schemas existing ≠ app published and working. Each needs a live-URL smoke test as part of its doc (the SparkAcademy runbook already builds this in for one of them).
- **claude-code-plugins-plus count unverified.** "244" is carried from memory and the project's own content-integrity rule flags it as a padding-risk number. Count it live before it goes in any doc.
