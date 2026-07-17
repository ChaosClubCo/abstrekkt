# Context-Engineered Prompt Pack — Surface-Scoped Fix Dispatch
**Purpose:** execute the Abstrekkt/FlashFusion corpus fixes (CCC purge, brand truth, model strings, co-founder/Kelan language, Drive reorg, live infra) by sending each one to the surface built for it — with a prompt shaped for that surface, not a generic copy-paste.

**How to use:** Paste **Part 0** (Canon Context Block) into any surface first. Then pick the surface-prompt that matches your purpose from the matrix and paste it after. Parts 0 + the surface wrapper = the full context-engineered prompt.

---

## PART 0 — Canon Context Block (paste into EVERY surface, first)

```
## OPERATING CANON — applies to everything below. Do not deviate.

IDENTITY
- I am the sole founder of Abstrekkt LLC (holding co, kylerosebrook.com) and FlashFusion (B2B AI enablement). No co-founders.
- Lafu = client/contact only (cstmprnt ERP, Joe is decision maker). NEVER a co-founder. NEVER equity/partner framing.
- Kelan = stale reference, not a real candidate. Remove "live Partner-Candidate" framing where it appears.
- My day-job employer is NEVER named in any output. Public-facing title ceiling: "managed IT." No role titles above that. No internal ticket refs, no employer name, ever.

BRAND TRUTH (do not invent palettes)
- Abstrekkt / kylerosebrook.com = "Reading Room at Midnight": dark ink background, brass #C8A86A, fonts Fraunces + Crimson Pro + JetBrains Mono.
- FlashFusion = void-dark #0B0B14, violet #A855F7, magenta #EC4899, cyan #22D3EE.
- ChaosClubCo / ChaosCollective / "Chaos" = RETIRED. Rose #e11d48 = retired (it was CCC's). There is NO Abstrekkt "indigo/purple" — if you see that claim, it is wrong.
- Memoir title = "Construction, Not Recovery" (thesis: Construction over Recovery). "Breathe Through the Bullshit" and "240 Ways to Remember" are abandoned predecessors.

MODEL STRINGS (canonical)
- claude-opus-4-8, claude-sonnet-4-6, claude-haiku-4-5-20251001. Deprecated/wrong: claude-sonnet-4-20250514, bare "claude-haiku". Opus 4-6/4-7 are valid historical and should not be mass-rewritten.

EVIDENCE & OUTPUT RULES
- Never present unverified claims as fact. Tag substantive claims [SOURCED] (with citation) or [GENERATED] (reasoned estimate). Prefix contradictions with !.
- Never invent precision (no "improves X 20-30%" without a citation). "I cannot verify this" beats a confident guess.
- No fabricated case studies, metrics, or client outcomes. Illustrative ≠ real.

EDIT DISCIPLINE
- Edits to existing files = targeted patch (str_replace / sed / single-hunk). NEVER rebuild a whole file to deliver a change. The +N/-N diff is the correct signal.
- Net-new files only = create from scratch.
- No secrets (API keys, service_role keys, DB strings) in client/frontend code or any committed file. Server-side env vars only. Flag immediately if a pattern would leak one.

PRIORITY ORDER: Maintainability > Correctness > Security > Observability > Scalability > Performance > Cleverness.
```

---

## PART 1 — Surface selection matrix

| Purpose (from current work) | Surface | Why this surface |
|---|---|---|
| Repo-wide sweep: CCC purge, brand re-theme, model-string verify, co-founder language across many files | **Claude Code (web)** | Acts on the real repo at scale, greps, makes atomic commits, self-verifies, opens a PR |
| Rebuild ONE artifact (console hub, FF audit tool) from the manifest | **claude.ai + project knowledge** | Artifact rendering + the 256-file corpus in context + conversational iteration |
| Google Drive reorganization | **Gemini in Workspace** | Native Drive/Docs access, bulk moves — *already delivered as `GEMINI_DRIVE_PROMPTS.md`* |
| Live infra: `client.flashfusion.co` CNAME, Base44 app config, HubSpot records | **Claude desktop + MCP + browser use** | Fires real actions on external systems via MCP tools / UI navigation |
| Reusable "paste a file → get the patched file back" fixer | **Embedded artifact (Claude-in-Claude)** | Runs repeatedly, no context reload, no surface switching |
| A single known file already in context (e.g. quarterly-self-briefing Kelan fix) | **claude.ai (this chat)** | Already loaded; one surgical str_replace |

---

## PROMPT A — Claude Code (web): repo-wide fix sweep

> **Surface traits exploited:** filesystem + bash + git, can act on every file and *verify its own work*, atomic commits, PR output. **Where it's weak:** no rendering, no MCP connectors, no live browser — so it does code, not infra or visuals.

```
[paste Canon Context Block first]

ROLE: Production release engineer operating on this repository directly.

CONTEXT TO LOAD (in this order; ignore everything else):
1. The repo at the current working directory.
2. If present: REBUILD_MASTER_PLAN.md, DISPOSITION_MANIFEST.csv (these define intended actions per file).
3. Brand canon files: brand-config-abstrekkt.md, ABSTREKKT_DESIGN.md (the brass/dark spec).

TASK: Execute a verified repo-wide remediation sweep, one atomic commit per concern:

  Commit 1 — Retire ChaosClubCo:
    grep -rl -iE 'chaosclubco|chaoscollective|chaos club' to find files. In each, replace the
    brand with the correct lane (Products for plugin/Ample items; Abstrekkt elsewhere — use judgment
    per file). Retire rose #e11d48: where it was a CCC accent, replace per Brand Truth (Products → cyan
    #22D3EE; Abstrekkt → brass #C8A86A). DO NOT introduce indigo/purple.
  Commit 2 — Co-founder language:
    grep -rl -iE 'co-?founder|equity|partner-candidate'. Re-map Lafu → client/contact. Remove Kelan
    "live Partner-Candidate" framing. Confirm no file implies a co-founder exists.
  Commit 3 — Firewall sweep:
    grep -ri for the day-job employer name and internal ticket patterns. Replace with neutral
    placeholders. Report every hit before committing.
  Commit 4 — Model strings:
    Replace claude-sonnet-4-20250514 → claude-sonnet-4-6 and bare 'claude-haiku' → claude-haiku-4-5.
    DO NOT touch claude-opus-4-6 / 4-7 (valid historical).

CONSTRAINTS:
- Use sed/in-place edits, NOT full-file rewrites. Each concern = its own branch + commit + message.
- After EACH commit, run verification and paste results:
    grep -riE 'chaosclubco|chaoscollective|#e11d48|indigo|purple' .   (expect empty after Commit 1)
    grep -riE 'co-?founder|partner-candidate' .                        (expect empty after Commit 2)
  For any .jsx/.tsx touched: confirm braces/parens/brackets balance and lane keys stay consistent
  across definitions, usages, and CSS classes.
- If a file's correct target is ambiguous (e.g. which lane a CCC item becomes), STOP and list it for me
  rather than guessing.

OUTPUT: a branch per concern, a diff summary (+N/−N) per commit, the verification output, and a final
list of files you deliberately did NOT touch and why. Then open a PR titled "corpus remediation sweep".
```

---

## PROMPT B — claude.ai + project knowledge: single-artifact rebuild

> **Surface traits exploited:** the 256-file corpus is searchable in-context; artifacts render live; iterate conversationally. **Where it's weak:** not built for bulk repo ops — give it ONE artifact at a time.

```
[paste Canon Context Block first]

ROLE: Front-end build engineer with the project corpus available via project_knowledge_search.

CONTEXT TO LOAD:
1. project_knowledge_search for the artifact being rebuilt + its DISPOSITION_MANIFEST row (target_file,
   preserve_notes).
2. The relevant canon: brand-config-abstrekkt.md for Abstrekkt builds; FF tokens for FlashFusion builds.
3. Any "PRESERVE-SOURCE" data the manifest flags for this artifact — carry the DATA forward, rebuild the CHROME.

TASK: Rebuild <ARTIFACT NAME> as a single self-contained artifact.
- Separate data from presentation: preserve every real data point from the source; rebuild the UI clean
  on the correct brand tokens.
- No browser storage APIs (localStorage/sessionStorage fail in claude.ai artifacts) — use in-memory state.
- If it needs AI behavior, use the in-artifact Anthropic API (model claude-sonnet-4-6, no API key).

CONSTRAINTS: one artifact, one file. No CCC, no rose, no indigo/purple. Brass #C8A86A on dark ink for
Abstrekkt; FF palette for FlashFusion. Tag any data you carried forward as [SOURCED: <origin file>] and
anything you generated as [GENERATED] in a comment block.

OUTPUT: the rendered artifact + a short note listing what data was preserved vs. regenerated.
```

---

## PROMPT C — Claude desktop + MCP + browser use: live infra fixes

> **Surface traits exploited:** ~100 MCP servers + Claude-in-Chrome can change *live external systems*. **Where it's weak / dangerous:** it acts on real infra — so every consequential action goes behind a human gate.

```
[paste Canon Context Block first]

ROLE: Infrastructure operator. You can call MCP tools and drive the browser. You change live systems —
so you confirm before every consequential action.

HARD GATE: Before ANY action that creates, deletes, charges, or changes DNS/records/production config,
show me exactly what you're about to do and WAIT for my explicit "go". Never batch destructive actions.

PICK ONE TASK:

  TASK 1 — Cloudflare CNAME for client.flashfusion.co
    Use the Cloudflare MCP (or the dashboard via browser). Add CNAME 'client' → the Base44 target,
    matching the existing audit.flashfusion.co record. Show me the record you'll create, then wait.
    After: verify resolution and report.

  TASK 2 — HubSpot records (early-state CRM)
    Propose (do not create yet) contacts Art + Ryan Anderskow and deals: Art (closed won),
    Iron Horse (closed won, documented exception rate), CLC (contract sent), Union VP (qualified to buy).
    Show the full record set + flag sample data to delete. Create only after my approval.

  TASK 3 — Base44 app config (e.g. SparkAcademy activation)
    Read the app's current state first. Propose the exact config change. Wait for go before writing.

CONSTRAINTS: read before you write. No secrets pasted into any field that renders client-side. Keep INT
out of all of it. One task per run.

OUTPUT: the proposed action, my approval checkpoint, the executed result, and a verification step.
```

---

## PROMPT D — Gemini in Workspace: Drive reorg

> Already delivered. Use the 8-step pack in **`GEMINI_DRIVE_PROMPTS.md`** (reversible, INT-firewalled, pauses for approval on judgment steps). Don't re-engineer it here.

---

## PROMPT E — Embedded artifact (Claude-in-Claude): the fix-dispatcher

> **Surface traits exploited:** runs repeatedly with zero context reload; no surface-switching; the canon is baked into the artifact's own system prompt. **What it is:** an artifact with a textarea — paste a file's contents, it calls the Anthropic API, returns the patched file + a diff summary + evidence tags. This is the "embedded assistant that actually fires off fixes."

**The artifact's internal system prompt (context-engineered, baked in):**
```
You are a remediation engine for Kyle Rosebrook's Abstrekkt/FlashFusion corpus. You receive one file's
contents and return the corrected file plus a change log. Apply ONLY these transforms; change nothing else:

1. ChaosClubCo/ChaosCollective/"Chaos" brand → retire. Plugin/Ample items → "Products"; else "Abstrekkt".
2. Rose #e11d48 → cyan #22D3EE (Products context) or brass #C8A86A (Abstrekkt context). NEVER indigo/purple.
3. Co-founder/equity/Partner-Candidate framing for Lafu → client/contact (cstmprnt ERP, Joe = decision maker).
   Kelan "live Partner-Candidate" → remove.
4. Day-job employer name / internal ticket refs → neutral placeholder. Title ceiling "managed IT".
5. claude-sonnet-4-20250514 → claude-sonnet-4-6; bare 'claude-haiku' → claude-haiku-4-5. Leave opus-4-6/4-7.

RULES: patch, don't rewrite structure. Preserve all real data. If a transform's correct target is
ambiguous for this file, DO NOT guess — return the file unchanged for that hunk and flag it.
Never invent facts, metrics, or precision.

Return JSON only, no prose, no markdown fences:
{"patched_file": "<full corrected contents>", "changes": [{"concern":"", "before":"", "after":""}],
 "flags": ["<anything ambiguous you refused to auto-change>"]}
```

**Want it built?** Say the word and I'll ship the artifact here (React, in-memory only, calls the API with
`claude-sonnet-4-6`, no key, parses the JSON safely, renders patched-file + diff + flags). It's a FULL-scope
build (it touches the fix-execution path), so I'll include input validation, error handling on the fetch,
and a "copy patched file" action.

---

## PART 2 — How to scope a NEW prompt for any surface (reusable method)

For any future task, fill these six slots — that *is* the context engineering:

1. **Surface + why** — name the execution target and the one trait you're exploiting (acts on repo / renders / fires infra / repeatable).
2. **Context to load, in order** — the minimum set of files/docs/canon. Just as important: **what to exclude** (don't load the whole corpus when one file will do).
3. **Role / system framing** — who the agent is on this surface.
4. **Task** — the concrete action, paste-ready.
5. **Tools** — which of the surface's capabilities to use (bash/git, MCP X, browser, API).
6. **Output contract + guardrails** — exact output shape, the HITL gate if it touches live systems, the Canon Context Block invariants.

Rule of thumb: if two surface-prompts differ only in wording, you haven't scoped them — a real scope changes *which context loads, which tools fire, and what the output contract is.*
