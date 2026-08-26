# Threat Model — Outcome-Aware AI/MCP Combos v0.1

> **Companion to:** [`outcome-aware-mcp-combos-v0.1.md`](outcome-aware-mcp-combos-v0.1.md)
> **Version:** 0.1 · 2026-05-20
> **Posture:** v0.1 ships as a personal-use baseline. A multi-tenant or public deployment requires the hardening enumerated in [Future hardening](#future-hardening-checklist-v02).

## Scope

This document enumerates security and adversarial threats across the three combos specified in the main combo spec. It is not a formal STRIDE or attack-tree exercise — it is a working threat enumeration sufficient to ship v0.1 honestly with known limitations documented.

## Trust boundaries

Four trust boundaries cross the system:

1. **Agent ↔ MCP Wrapper.** The wrapper is in the agent's trust domain. If the agent is compromised, the wrapper inherits compromise. *No mitigation at the wrapper layer; this is an architectural assumption.*

2. **MCP Wrapper ↔ MCP Server.** The wrapper trusts what the server *says* in its receipt. The Forgery Detector exists because this boundary is fundamentally untrustworthy. *The Detector is the mitigation; receipts without verification are unverified claims.*

3. **Forgery Detector ↔ World.** Probes read external state. The world is mostly trustworthy, but cross-source manipulation is possible (a single attacker controlling both the MCP server and the verification source defeats refetch probes).

4. **All components ↔ Audit Log.** Audit log writes must be authenticated. Reads must be RLS-scoped. Append-only.

```
┌──────────────────────────────────────────────────────────────┐
│  Agent trust domain                                          │
│  ┌────────┐    ┌──────────────┐                              │
│  │ Agent  │───▶│ Receipt Wrap │                              │
│  └────────┘    └──────┬───────┘                              │
└─────────────────────── │ ──────────────────────────────── ───┘
                         ▼  ◀── Trust boundary 2
                    ┌─────────┐
                    │ MCP Srv │  ◀── attacker-controllable
                    └────┬────┘
                         ▼  ◀── Trust boundary 3
                    ┌─────────┐
                    │  World  │  ◀── mostly trustworthy
                    └────┬────┘
                         ▼
                    ┌──────────┐
                    │ Detector │
                    └────┬─────┘
                         ▼  ◀── Trust boundary 4
                    ┌─────────┐
                    │ Audit   │  ◀── append-only, RLS-scoped
                    └─────────┘
```

---

## Combo 01 — Receipts × Forgery Detector

### T01-1 — Receipt forgery (server lies in its receipt)

- **Threat.** MCP server emits a receipt claiming a change happened when nothing did.
- **Impact.** Audit log records VERIFIED outcomes that never occurred. Agent acts on false success.
- **Detection.** This is exactly what the Forgery Detector exists to catch. The `phantom` probe is purpose-built; the `refetch` probe catches the simple case.
- **Mitigation.** Ship the Detector before deploying Receipts to production. Verdict layer must be on the audit log read path.
- **Residual risk.** A sophisticated server that detects probe traffic and behaves correctly only under probe could defeat detection. Counter-mitigation: probes route through the same wrapper as production calls; signatures identical.
- **v0.1 status.** Mitigated.

### T01-2 — Probe spoofing

- **Threat.** A malicious actor injects fake probe results into the Verdict Aggregator, claiming VERIFIED when claims are actually forged.
- **Impact.** Forgery is masked; the Detector's signal is corrupted.
- **Mitigation.** Probe results must be signed by the probe runner with an HMAC. Aggregator rejects unsigned results.
- **v0.1 status.** Open gap. v0.1 ships with unsigned probe results under single-user assumption. **Must close before any multi-user deployment.**

### T01-3 — Audit log tampering

- **Threat.** Verdicts edited post-hoc to convert FORGED → VERIFIED.
- **Impact.** Historical record corrupted; forensic value of the audit log destroyed.
- **Mitigation.** Append-only audit log. Postgres table with RLS denying UPDATE and DELETE for all users; INSERT only. Optional: `pg_audit` extension for write-time auditing.
- **v0.1 status.** Mitigated in the SQL migration shipped with the wrapper.

### T01-4 — Receipt-signature key compromise

- **Threat.** HMAC key leaks; attacker forges receipts that appear server-signed.
- **Impact.** Receipt trust model breaks; verification of signed vs. unsigned receipts is meaningless.
- **Mitigation.** Per-server HMAC keys rotated quarterly. Keys stored in Supabase Vault or an external KMS. Key compromise event triggers immediate rotation and re-verification of recent receipts.
- **v0.1 status.** Signature field exists in the schema but is optional. Key management is deployment-specific and documented in the implementation README (when shipped).

### T01-5 — Probe-side-effect billing attacks

- **Threat.** A malicious agent triggers expensive probes (especially `side_effect`) by emitting receipts with maximum `verification_hints`.
- **Impact.** Bill shock; budget exhaustion suppresses verification of legitimate calls.
- **Mitigation.** Per-receipt and per-run budgets enforced in the Aggregator. Probes that exceed budget are explicitly skipped, not silently allowed to run.
- **v0.1 status.** Mitigated. Defaults: `$0.01/receipt, $0.10/run`.

---

## Combo 02 — Eval-as-MCP × Sycophancy Telemetry

### T02-1 — Streak-suppression gaming

- **Threat.** User repeatedly types "challenge me" to reset the streak counter, then asks a loaded question expecting agreement without intervention.
- **Impact.** Sycophancy detection neutralized for users who learn the reset trigger.
- **Mitigation v0.1.** Log every "challenge me" reset as a telemetry event. Surface a meta-pattern alert if reset frequency exceeds 1 per 10 turns. Does not prevent the attack, but makes it visible.
- **Residual risk.** A patient attacker spaces resets out across many turns. v0.2 mitigation: heuristic for "explicit reset followed by leading question" pattern.
- **v0.1 status.** Partial — observable but not prevented.

### T02-2 — Topic-fragmentation evasion

- **Threat.** A consequential decision is fragmented across multiple turns each classified as `info`, so no individual turn counts toward streak.
- **Impact.** Multi-turn manipulation slips beneath the threshold entirely.
- **Mitigation v0.2+.** Periodic re-classification across a sliding window of 10 turns. If the cumulative conversation crosses a consequence threshold, retroactively count agreements.
- **v0.1 status.** Open gap. v0.1 catches obvious cases (single high-consequence agreements) only.

### T02-3 — Eval injection

- **Threat.** A malicious system or compromised model injects fake EvalResults into the agent's context to override genuine eval findings.
- **Impact.** Eval becomes a vector for prompt injection. Agent acts on attacker-controlled CLAIMS / COUNTEREXAMPLE input.
- **Mitigation.** EvalResult must be signed by the Eval-as-MCP server. Wrapper rejects unsigned eval results. Schema includes optional `signature` field for v0.1.
- **v0.1 status.** Open gap. Signature field exists but is not yet required.

### T02-4 — Privacy leak via eval calls

- **Threat.** Eval-as-MCP sends conversation context to a separate model. Sensitive conversations (medical, legal, personal) reach a model the user did not consent to.
- **Impact.** PII or sensitive content exposed beyond user-intended trust boundary.
- **Mitigation.** Sensitive-topic flag classifier. If conversation tagged as sensitive, autonomic eval disables; falls back to a local heuristic ("would your past self in this conversation disagree with current you?").
- **v0.1 status.** Open gap. Document as known limitation; require explicit opt-in for autonomic eval on any conversation that has not been explicitly tagged non-sensitive.

### T02-5 — Eval recursion attack

- **Threat.** Adversarial input causes Eval-as-MCP to issue another eval call on its own output, recursing until budget exhausts.
- **Impact.** Bill shock; eval service blocked by recursion.
- **Mitigation.** Hard depth limit of 2. Beyond depth 2, eval call returns a stub with `verdict: needs_review` and no further recursion.
- **v0.1 status.** Mitigated in the Eval-as-MCP server.

---

## Combo 03 — Maturity Model × Anti-Pattern Catalog

### T03-1 — Maturity-as-marketing (vendor claims L5 without evidence)

- **Threat.** A vendor publishes "we are at L5" based on self-report. Erodes the model's credibility.
- **Impact.** Framework becomes a marketing surface; honest practitioners ignore it.
- **Mitigation.** Rubric requires evidence per question, not just yes/no. Sample diagnosis publication template includes an evidence column. Public assessments require linking the evidence.
- **v0.1 status.** Documented in the spec. Enforcement deferred to v0.2 interactive scorecard.

### T03-2 — Anti-pattern weaponization in technical reviews

- **Threat.** An anti-pattern label (e.g., "you have Trust-Me Telemetry") used to dismiss design choices that are legitimate at the current maturity tier.
- **Impact.** Catalog becomes a vehicle for purity-policing rather than diagnosis.
- **Mitigation.** Catalog framing explicitly states "gravity at this transition, not always wrong." Anti-patterns are positional, not absolute. Trust-me telemetry is fine at L2 if outcome verification is not worth the cost yet.
- **v0.1 status.** Documented in the spec's Honest Limits section.

### T03-3 — Rubric gaming

- **Threat.** Teams answer rubric questions optimistically to claim higher level than reality supports.
- **Impact.** Self-reported assessments lose signal; the rubric becomes a self-assessment exercise in confidence rather than capability.
- **Mitigation.** Each rubric question paired with an "evidence required" prompt in the interactive scorecard. Self-reported diagnoses marked as such.
- **v0.1 status.** Spec acknowledges; scorecard not yet built.

---

## Cross-combo concerns

### Auth/authz baseline

- **v0.1.** Single-user. RLS on Supabase scopes to `caller_run_id`. HMAC keys (when used) stored locally.
- **v0.2 — multi-tenant.** Per-user encryption keys. Workspace boundaries enforced at Supabase RLS layer. Audit log queries always scoped through workspace context.
- **v1.0 — SaaS.** External KMS for HMAC keys. RBAC for read access to verdicts and evals. Per-tenant rate limits on probe execution.

### Privacy posture

All three combos process conversation or world-state data through external models (Haiku calls for L2/L3 classification, eval calls for Combo 02, side-effect probes for Combo 01). Required:

- **v0.1.** A `PRIVACY.md` documenting what data leaves the user's environment for what purpose. Single-user opt-in for autonomic eval.
- **v0.2.** Per-conversation `sensitive: true` flag that disables remote calls and falls back to local heuristics.

### Supply chain

The probe registry is configurable. v0.1 ships only with the core 7 probe types built into the package — no plugin loading. v0.2 plugin loading must require signed manifests verified at load time.

### Observability of the security layer itself

The audit log must record:

- Every probe spoofing attempt (signature verification failure)
- Every eval injection attempt (signature verification failure on EvalResult)
- Every sensitive-topic disablement event
- Every budget-exhaustion event
- Every "challenge me" reset (Combo 02)

Surface these in the dashboard as a `security_events` feed alongside the verdict feed.

---

## Future hardening checklist (v0.2+)

- [ ] Probe-result signing (T01-2)
- [ ] Receipt-signature key rotation automation (T01-4)
- [ ] Sliding-window topic-fragmentation detection (T02-2)
- [ ] EvalResult signing enforcement (T02-3)
- [ ] Sensitive-topic classifier + opt-out flag (T02-4)
- [ ] Evidence requirement enforcement in rubric scorecard (T03-1, T03-3)
- [ ] Plugin manifest signing (supply chain)
- [ ] `security_events` feed in dashboard
- [ ] `PRIVACY.md` for user-facing data disclosure
- [ ] Per-tenant rate limits on probe execution (v1.0)

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

- **[GENERATED]** All threats above are reasoned from the architecture, not derived from a formal security audit. A STRIDE pass or attack-tree exercise would likely surface additional threats — especially around side-channel attacks on the probe layer.
- **COUNTEREXAMPLE.** T02-1 (streak-suppression gaming) is more likely than the v0.1 mitigation acknowledges. The "log and surface" approach assumes someone watches the surface. For single-user this is fine; for any larger deployment, a stricter rate-limit or session-binding rule is needed before v1.0.
- **CONTRADICTION.** This threat model says "v0.1 ships single-user" but the main spec also describes publishing the receipt schema as an open spec. If the spec is published, third-party deployments will multi-tenant on day one. Either the spec does not ship publicly until v0.2, or v0.1 needs the multi-tenant hardening up front. **Decision needed before any public publication of the schema files.**
- **GAP.** No threat model for the MCP transport itself (stdio, SSE, HTTP). This document assumes the underlying MCP protocol is secure. If a malicious MCP server hijacks the connection or injects into the response stream, the receipt is invalid before the wrapper even sees it. Transport-layer threats are out of scope for v0.1 but must be addressed in v1.0.
- **GAP.** No threat model for the dashboard. The `/outcomes` and `/sycophancy` routes need their own auth and CSRF protection. Documenting deferred to the implementation phase.
