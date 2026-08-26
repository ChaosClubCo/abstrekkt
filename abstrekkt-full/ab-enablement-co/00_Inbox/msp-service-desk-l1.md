# Case Study — MSP Service Desk L1 Through the Outcome-Aware Rubric

> **Subject:** An MSP managed-services L1 service desk operation. ~30 endpoints across one named client, plus internal IT support for the MSP itself. AI/automation work is self-initiated by the L1 technician, not a department-level mandate.
> **Assessor:** Operator (self-assessment) + independent validator review.
> **Date:** 2026-05-20
> **Purpose:** First grounded application of the [Combo 03 diagnostic rubric](../outcome-aware-mcp-combos-v0.1.md#3-the-diagnostic-rubric). Demonstrates how the rubric reads a real system and what kind of diagnosis it produces.

---

## Subject environment

This case study uses category descriptions rather than vendor names to keep the subject's specific tooling and clients private. The mapping is real; the names are categorical.

**Stack (categorical):**

| Category | Class of tool |
|---|---|
| ITSM | ITIL-aligned ticketing platform with public + internal notes, KB integration, time tracking |
| RMM | Remote monitoring and management with scripting, patch management, agent-based endpoint control |
| EDR | Enterprise endpoint detection and response with centralized policy management |
| Softphone | Cloud VoIP with CRM integration |
| VPN | Enterprise SSL VPN with cert-based auth |
| MFA | Push-based multi-factor authentication |
| Password manager | Enterprise vault with team sharing |
| Identity | AD-joined Windows domain |

**AI / automation surface (categorical):**

- Coding assistant in the operator's local environment
- Custom MCP servers for KB lookup and ticket-triage classification
- n8n workflows bridging ITSM webhooks to AI-driven note drafting
- A Supabase store for telemetry and tool call logging

**Scale:** L1 tier, ~30 client endpoints + MSP-internal IT. Single L1 technician self-initiating AI work alongside the standard service desk role.

---

## Walking the rubric

### L1 — Output-only (qualifier, 1/1 required)

> Are AI or MCP tools deployed in your workflow?

**Yes.** Custom MCP servers handle KB lookup, ticket triage, and draft generation. A coding assistant runs locally for note drafting and script work.

**L1 status: CLEARED (qualifier).**

### L2 — Tracked (4/4 required)

> 1. Is every tool call logged with consistent metadata?

**Partial.** The coding assistant logs requests/responses locally to disk. Custom MCP servers log to a Supabase table with tool name, params, timestamp, latency. ITSM-platform automation steps log to the platform's own activity stream. **Three sources, three schemas, no `run_id` correlation across them.**

> 2. Are latency and error rate visible per tool?

**Partial.** Latency: yes for Supabase-logged MCP calls; the ITSM platform exposes ticket-level metrics. Error rate: no centralized view. Failures show up indirectly as tickets that breach SLA or escalations that should not have happened.

> 3. Do tool failures surface to an operator within 5 minutes?

**No.** Failures are detected only when downstream impact appears — usually a ticket aging past SLA or a user calling back. Median time-to-notice: 15–45 minutes.

> 4. Can you query "which tools were called in run X" without spelunking through logs?

**No.** No `run_id` correlation across the three log sources. Reconstructing a single ticket's tool history is a manual cross-source exercise.

**L2 score: 0/4 strict (some questions partial). NOT CLEARED.**

This is a real finding and worth honoring rather than papering over. The operation has telemetry — but not *coherent* telemetry. The L2 gap surfaces a category of work that must ship before any L3 receipts can meaningfully exist. Receipts assume you can correlate the receipt back to the call that produced it; without `run_id`, that correlation is manual.

### L3 — Claimed (5/5 required, requires L2 cleared)

**BLOCKED by L2.** Not assessed in detail, but pre-emptive notes:

- No structured outcome claims are emitted today.
- The closest equivalent to a "receipt" is the ITSM resolution note. Free-text. Not schema-validated. Not queryable as a claim.
- "Outcome" is defined implicitly as "ticket closed in the ITSM platform." This is exactly the Outcome Theater anti-pattern.

### L4 — Verified (5/6 required, requires L3 cleared)

**BLOCKED by L3.**

### L5 — Optimizing (4/5 required, requires L4 cleared)

**BLOCKED by L4.**

---

## Diagnosis

**Assessed level: L1 — Output-only.** AI/MCP tools are deployed. Outcomes are unknown without manual ticket review.

**Operative anti-patterns at the L1→L2 transition:**

- **Tool Sprawl** — Three distinct logging surfaces (local coding-assistant logs, MCP Supabase logs, ITSM activity stream). Each was added independently for a real need; none was retired or unified. The sprawl is across observability surfaces, not across MCP server count (a useful expansion of the catalog entry).

**Operative universal anti-pattern:**

- **Outcome Theater** — The dashboards that exist show ticket counts, resolution time, time-to-first-touch, AI tool usage counts. None of them show whether the *underlying issue actually got resolved.* They show whether the ticket got closed. In MSP work, *closed ≠ resolved* — a closed ticket can mean "user stopped responding," "issue reappeared on a different endpoint and got a new ticket," or "resolution path was a workaround that masks the root cause." The Outcome Theater pattern is operative because the existing dashboards optimize for ticket lifecycle, not for whether problems actually got solved.

---

## Treatment plan — clear L2

Three concrete actions before any work on receipts, verification, or higher tiers:

### 1. Unify the telemetry surface

One Supabase table with `run_id` correlation across all three log sources. Backfill via batch import from existing logs. Once unified, the answer to "which tools were called in run X" becomes a single SQL query.

Estimated cost: one focused weekend.

### 2. Add a failure alert

Webhook on tool-call error → operator notification within 60 seconds. Replaces "discovered when SLA threatens" with "discovered when it happens." Reduces the median time-to-notice from 30 minutes to under 2.

Estimated cost: half a day.

### 3. Decide what "outcome" means for the top three use cases

These three are by ticket volume the most common L1 work:

| Use case | Current "success" | Proposed "outcome" | How to verify |
|---|---|---|---|
| User reports can't connect to VPN | Ticket marked resolved | User can connect to VPN | User confirmation by a follow-up ping; VPN connection log check |
| User requests software install | Ticket marked resolved | Software is functioning on the user's endpoint | RMM-side install audit; user confirmation |
| Password reset | Ticket marked resolved | User successfully logged in within 24 hours | SSO log check |

Locking these three outcome definitions is the precondition for emitting meaningful Receipts later. Without locked outcomes, Receipts have nothing to claim.

Estimated cost: half a day of writing + alignment with the on-paper documentation.

**Total work to clear L2:** ~2 days. Once cleared, the operation is ready to consider Combo 01 Receipts. Until then, Receipts have no schema-meaningful outcome to claim.

---

## What this case study demonstrates

The diagnosis is not "you are bad at this." It is "here is where you are, here is what is holding you, here is the next concrete move."

A few things to notice about the rubric's behavior in this case:

- **The L2 strictness caught a real gap.** Many MSP operations would self-report L2 or higher because they have *some* telemetry. The rubric's all-four-conditions gating is what catches the difference between telemetry and *coherent* telemetry. A more lenient rubric would have over-graded the operation and produced a treatment plan focused on Combo 01 — which would have been wasted work, because the L2 gap blocks L3 anyway.
- **The named anti-pattern (Tool Sprawl) was operative and treatable.** This is the framework working as intended — a diagnosis that names a specific blocker and points at a specific next move.
- **The universal (Outcome Theater) shows up here because the existing dashboards optimize for ticket lifecycle.** This is the failure mode the framework was designed to surface: doing observability that *looks like* outcome work but isn't.
- **The treatment plan is small and concrete.** Two days of work to clear L2. The framework's value is not in painting an aspirational future state; it is in naming the very next move.

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

- **[SOURCED]** Stack categories (ITSM, RMM, EDR, Softphone, VPN, MFA, password manager, AD-joined Windows) accurately describe the subject environment per the operator's own documentation.
- **[GENERATED]** Latency and error-rate descriptions are reconstructed from typical MSP tooling defaults. Actual rates are operator-private and not disclosed.
- **[GENERATED]** "Closed ≠ resolved" framing is this case study's own characterization, not a direct quote from any internal documentation.
- **[GENERATED]** The 2-day total-work estimate to clear L2 is reasoned from the three action items, each scoped independently. Real calendar time depends on what L1 work is in flight.
- **COUNTEREXAMPLE.** The L1 assessment may be too strict. The operator runs specific diagnostic scripts (softphone diagnostics, endpoint environment checks) that arguably constitute a form of outcome verification on specific use cases. A more generous read could land at "L2 partial for those specific verified use cases, L1 elsewhere." The strict reading is honest, but the partial-clearance notation suggested in the spec's COUNTEREXAMPLE section would represent the reality more fairly.
- **CONTRADICTION.** The "Tool Sprawl" finding in this case study expands the catalog entry from "adding MCP servers without measuring use" to "adding *any* observability surface without measuring use." This is a useful expansion but the catalog as written does not cover it. **Action item for v0.2 of the catalog:** rename to "Observability Sprawl" or add "Logging Sprawl" as a sibling entry.
- **GAP.** This case study does not assess the operator's *manual* verification work — for example, personally pinging a user after a VPN fix to confirm connectivity. The rubric treats only automated probe-based verification as L4-grade evidence. A team doing thorough manual verification across all top use cases is genuinely doing outcome work that the rubric undercounts. v0.2 of the rubric should add a "manual verification covered" supplementary question.
- **GAP.** No assessment of cost. The treatment plan is 2 days of L1-tech time. That is meaningful in an L1 service desk context where ticket queue pressure dictates how much side-project time is available. The rubric does not consider cost-of-treatment as a variable; in resource-constrained contexts this matters.
