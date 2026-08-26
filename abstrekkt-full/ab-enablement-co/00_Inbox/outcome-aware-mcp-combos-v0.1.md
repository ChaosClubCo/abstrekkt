# Outcome-Aware AI / MCP — Combo Specs v0.1

> **Status:** Draft v0.1 · 2026-05-20
> **Owner:** Kyle Rosebrook (GitHub: [Krosebrook](https://github.com/Krosebrook))
> **Scope:** Specifications for three co-validating combos in the outcome-aware AI/MCP design space
> **Repo readiness:** Self-contained markdown; Mermaid diagrams render natively on GitHub

---

## Executive summary

Three combos. Each pairs two ideas that multiply each other. Together they form a coherent thesis: **outcome-aware AI/MCP is fundamentally about closing the gap between claim and reality.**

| # | Combo | Structural shape | Output type | First-ship cost |
|---|---|---|---|---|
| 01 | Outcome Receipts × Outcome Forgery Detector | Co-validating system | Code + open schemas | 4–6 weeks |
| 02 | Eval-as-MCP × Sycophancy Telemetry | Autonomic loop | Code + MCP server | 4–6 weeks |
| 03 | Anti-Pattern Catalog × Outcome-Aware Maturity Model | Diagnostic IP | Content + rubric | 12 days writing |

All three share an **assert-verify** structural shape: every claim is paired with a verification path. That repeating pattern is the signature of outcome-aware design.

## Reading order

- Skim [Thesis](#thesis) and [Landscape](#landscape) for context.
- Combos 01, 02, 03 are independent reads in any order.
- [Cross-combo synthesis](#cross-combo-synthesis) shows how they compose into one system.
- [Adversarial review (consolidated)](#adversarial-review-consolidated) lives at the end.

---

## Thesis

Most current MCP work is tool-side: more servers, more connectors, more capabilities. The outcome-aware lens shifts the question from *what the tool returns* to *what changed in the world as a result.*

This is a different observability surface than OTel traces. Traces answer "which span was slow." Outcome-aware design answers "did the action actually achieve the intent."

The three combos in this document are independent builds, but they share infrastructure (Supabase audit log, MCP wrapper pattern, structured verdict states) and they cohere around one structural principle: **every assertion must be paired with a verification path.** Receipts pair with the Forgery Detector. Agent responses pair with Eval-as-MCP. Maturity levels pair with the Anti-Pattern Catalog. The shape repeats.

## Landscape

Where these combos land relative to existing work:

**MCP observability** — Heavily worked. OpenTelemetry has [an active proposal for MCP](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/269) covering traces, agent run records, tool registry snapshots, and final outcomes. Apollo, SigNoz, Traceloop, and others provide instrumentation. *Outcome Receipts (Combo 01) extend the OTel agent-run-record fields with a claim layer — adopt and extend, do not replace.*

**MCP evaluation** — [mcp-agent](https://docs.mcp-agent.com/test-evaluate/server-evaluation) provides pre-deployment server evaluation treating each tool as an API contract. *Eval-as-MCP (Combo 02) differs by running at conversation runtime, triggered by sycophancy telemetry, not on a CI cron.*

**Sycophancy mitigation** — [The Silicon Mirror](https://arxiv.org/pdf/2604.00478) is the closest precedent: a generator-critic architecture with Behavioral Access Control achieving 85.7% sycophancy reduction on Claude Sonnet 4. [Giskard's Scan](https://www.giskard.ai/knowledge/when-your-ai-agent-tells-you-what-you-want-to-hear-understanding-sycophancy-in-llms) provides pre-deployment scanning. *Combo 02's wedge is lightweight, MCP-native automation of existing manual discipline — harm reduction layered on personal stack, not a model-internal architecture.*

**AI maturity models** — Heavily worked. [Microsoft's Copilot Studio model](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/maturity-model-overview) uses CMM with 5 levels and 5 capability pillars. [Acuvity's Agent Integrity Framework](https://acuvity.ai/the-agent-integrity-framework-and-maturity-model/) covers 5 levels across 6 capability areas including MCP Security as one area. *Combo 03 differs by specializing on the outcome-verification dimension and pairing levels with an anti-pattern catalog as a single diagnostic.*

**Adversarial outcome verification** — Genuinely open. No published tool runs runtime probes that test whether MCP servers lie about their outcomes. Closest is [mcp-sec-audit](https://arxiv.org/html/2603.21641v1) which performs pre-deployment capability audits, not runtime outcome probes.

---

# Combo 01 — Outcome Receipts × Outcome Forgery Detector

## Overview

A co-validating system: every MCP tool call emits a structured Outcome Receipt claiming what changed in the world; the Forgery Detector independently probes whether the claim is true. Receipts without verification are unverified assertions. Verification without receipts has nothing to verify. Together they form the only honest grading of MCP outcomes.

## Architecture

```mermaid
flowchart LR
    User([User]) --> Agent[Agent]
    Agent --> Wrapper[Receipt Wrapper<br/>captures intent + state]
    Wrapper --> Server[MCP Server]
    Server -. writes .-> World[(World)]
    Wrapper --> Receipt[Receipt - claim]
    Receipt --> Detector[Forgery Detector]
    World -. probes .-> Detector
    Detector --> Verdict[Verdict<br/>verified · forged · stale]
    Verdict --> Audit[(Audit Log - Supabase)]
    Receipt --> Audit
    Verdict -. feedback .-> Agent

    classDef assert fill:#E1F5EE,stroke:#0F6E56,color:#04342C
    classDef verify fill:#FAECE7,stroke:#993C1D,color:#4A1B0C
    classDef neutral fill:#F1EFE8,stroke:#5F5E5A,color:#2C2C2A

    class Wrapper,Server,Receipt assert
    class Detector,Verdict verify
    class User,Agent,World,Audit neutral
```

The shape: assert (teal) flows left-to-right across the top; verify (coral) flows right-to-left through the detector path; the audit log binds them. Every tool call produces a (Receipt, Verdict) pair.

## 1. Outcome Receipt — schema v0.1

The Receipt extends the OTel agent-run-record proposal's fields with a **claim layer** (`claimed_changes[]`) and **verification hints**. Existing trace IDs (`trace_id`, `span_id`, `tool_call_id`) link receipts back to underlying OTel spans so receipts compose with existing observability — they do not replace it.

### Core fields

| Field | Type | Purpose |
|---|---|---|
| `schema_version` | const "0.1" | Version pinning |
| `receipt_id` | uuid | Stable identifier |
| `trace_id`, `span_id`, `tool_call_id` | string | OTel correlation |
| `server_id`, `tool_name` | string | Source |
| `timestamp_start`, `timestamp_end` | iso-8601 | Window |
| `caller_run_id` | string | Agent run binding |
| `intent` | `{text, tag}` | What caller was trying to achieve |
| `claimed_changes[]` | array | The assertions to verify |
| `cost` | `{tokens_in, tokens_out, usd_cost, latency_ms}` | Economics |
| `verifiable` | bool | Can it be re-fetched? |
| `verification_hints[]` | enum array | Which probes apply |
| `server_confidence` | 0–1 | Server-asserted certainty |
| `signature` | string (optional) | HMAC for non-repudiation |

### Inside `claimed_changes[]`

The part that actually matters:

```json
{
  "target": "notion://page/abc-123",
  "change_type": "update",
  "before_hash": "sha256:1f3a...",
  "after_hash": "sha256:9e2b...",
  "evidence_uri": "https://notion.so/abc-123",
  "side_effects": ["mail://watcher/dave@intinc.com"]
}
```

`change_type` enum: `create | update | delete | append | move | annotate | trigger | none`. The `none` value matters — it is how an idempotent re-call truthfully reports "no change needed." A server that returns `update` when nothing actually changed is forging.

### Example receipt (Notion page update)

```json
{
  "schema_version": "0.1",
  "receipt_id": "01HW4M-...",
  "trace_id": "9c2e1a-...",
  "tool_call_id": "call_abc123",
  "server_id": "notion-mcp",
  "tool_name": "notion-update-page",
  "timestamp_start": "2026-05-20T14:32:11Z",
  "timestamp_end": "2026-05-20T14:32:12Z",
  "caller_run_id": "run_xyz",
  "intent": {
    "text": "Update FlashFusion roadmap status to Greenlit",
    "tag": "update"
  },
  "claimed_changes": [{
    "target": "notion://page/abc-123",
    "change_type": "update",
    "before_hash": "sha256:1f3a...",
    "after_hash": "sha256:9e2b...",
    "evidence_uri": "https://notion.so/abc-123",
    "side_effects": []
  }],
  "cost": { "tokens_in": 0, "tokens_out": 0, "usd_cost": 0.001, "latency_ms": 412 },
  "verifiable": true,
  "verification_hints": ["refetch", "diff"],
  "server_confidence": 0.95
}
```

## 2. Forgery probe surface

Seven probe types in the registry. Each is independently runnable, returns a structured `ProbeResult`, and carries a cost class.

| Probe | Mechanism | Cost | Catches |
|---|---|---|---|
| `refetch` | Pull target, hash, compare to `after_hash` | Low | False success, partial writes |
| `diff` | Pull state, diff against `before_hash`. Match `change_type`? | Med | Wrong-change-type claims |
| `idempotency` | Re-issue same call. Should report `none` | Med | Servers that do not track state |
| `negative` | Call a verifier via a *different* MCP | Var | Single-source blindness |
| `side_effect` | Verify side-effects externally (email sent? webhook fired?) | High | Side-claim padding |
| `time_decay` | Re-probe after N min/hr | Low | Ephemeral writes |
| `phantom` | Re-issue with different framing — does server claim success without writing? | Med | Trust-me telemetry |

### Probe contract

```python
class Probe(Protocol):
    name: str
    cost_class: Literal["low", "medium", "high"]

    def applicable(self, receipt: Receipt) -> bool:
        """Does this probe apply to this receipt's change_type + target?"""

    async def run(self, receipt: Receipt, ctx: ProbeContext) -> ProbeResult:
        """Returns pass | fail | skipped | error with evidence + confidence."""


class ProbeResult(TypedDict):
    probe_name: str
    receipt_id: str
    status: Literal["pass", "fail", "skipped", "error"]
    evidence: dict           # probe-specific payload
    confidence: float        # 0–1
    cost_usd: float
    latency_ms: int
    notes: str
```

### Budget model

Per-receipt default `$0.01 / 5s`, per-run default `$0.10 / 60s`. Probes that would exceed budget return `status: skipped, notes: "exceeded budget"`. Verdict layer treats skipped probes as missing evidence, not failure.

### Anti-probe defenses (and counter-defenses)

Three real edge cases:

1. **Servers detecting probe traffic** → probes route through the same Wrapper as production calls; signature is identical.
2. **Probe recursion** (probe issues an MCP call that itself emits a Receipt) → probe calls carry an `x-probe-run: 1` header; the Wrapper skips receipt emission for those.
3. **Race conditions on time_decay** — between the original write and the decay probe, a legitimate update may have overwritten the change → include `after_hash` in the decay probe; if current hash differs from both `after_hash` *and* `before_hash`, mark `OVERWRITTEN`, not `STALE`.

## 3. Verdict layer

Six verdict states, ordered by severity:

1. **`FORGED`** — at least one probe directly contradicts a claim. Server lied.
2. **`INCONSISTENT`** — mixed probe signals with no direct forgery (e.g. refetch passes, side_effect fails).
3. **`STALE`** — time_decay probe failed; change did not persist.
4. **`OVERWRITTEN`** — change happened but was later replaced by another write.
5. **`PARTIAL`** — some claims verified, others non-applicable. The default "good enough."
6. **`VERIFIED`** — all applicable probes pass.
7. **`UNVERIFIABLE`** — no probes apply (write-only or ephemeral target).

### Aggregation rule (priority order — first match wins)

```
if any probe = FORGED                 → FORGED
elif any probe = INCONSISTENT         → INCONSISTENT
elif any probe = STALE                → STALE
elif any probe = OVERWRITTEN          → OVERWRITTEN
elif all applicable probes pass       → VERIFIED
elif some pass, some skipped          → PARTIAL
else (no applicable probes)           → UNVERIFIABLE
```

### Confidence aggregation

Weighted geometric mean of probe confidences, weighted by `cost_class` (low=1, medium=2, high=3). High-cost probes weigh heavier because they are more likely to catch sophisticated forgery. Side-effect verification beats a refetch by 3×.

### Verdict object

```json
{
  "verdict_id": "01HW4N-...",
  "receipt_id": "01HW4M-...",
  "verdict": "VERIFIED",
  "confidence": 0.92,
  "probe_results": [
    { "probe_name": "refetch", "status": "pass", "confidence": 0.95, "cost_usd": 0.0001 },
    { "probe_name": "side_effect", "status": "pass", "confidence": 0.88, "cost_usd": 0.0002 }
  ],
  "total_probe_cost_usd": 0.0003,
  "total_probe_latency_ms": 320,
  "produced_at": "2026-05-20T14:32:15Z",
  "schema_version": "0.1"
}
```

## Build sequence (12-day sprint, calendar realistic 4–6 weeks)

1. **Day 1** — Publish `receipt.v0.1.schema.json` + `verdict.v0.1.schema.json`.
2. **Day 2–3** — `outcome_receipts/wrapper.py` — Python MCP proxy that captures intent + before-hash, emits Receipt after server response.
3. **Day 4–5** — Probe Registry + three concrete probes: `refetch`, `diff`, `idempotency`.
4. **Day 6** — Verdict Aggregator (`verdict.py`).
5. **Day 7** — Supabase migration: `receipts` + `verdicts` tables, RLS scoping by `caller_run_id`, indexes on `receipt_id`, `server_id`, `verdict`.
6. **Day 8** — Wire to a test MCP (Notion). End-to-end smoke: tool call → receipt → probes → verdict → audit log.
7. **Day 9–10** — Remaining probes: `negative`, `side_effect`, `time_decay`, `phantom`.
8. **Day 11–12** — Dashboard route `/outcomes` — verdict feed with state-colored timeline, forgery alerts.

## Output — artifacts, endpoints, acceptance

### Artifacts shipped

- `receipt.v0.1.schema.json` and `verdict.v0.1.schema.json`
- `outcome_receipts/` Python package (`wrapper.py`, `probes/`, `verdict.py`, `storage.py`)
- `supabase/migrations/0001_outcome_receipts.sql`
- Dashboard route at `/outcomes`

### MCP tools exposed by the wrapper

| Tool | Signature | Returns |
|---|---|---|
| `emit_receipt` | `(tool_call_id, intent, claimed_changes, cost, hints)` | `receipt_id` |
| `run_probes` | `(receipt_id, budget_usd?, budget_ms?)` | `verdict_id` |
| `get_verdict` | `(receipt_id \| verdict_id)` | `Verdict` |
| `get_audit_log` | `(filter: {run_id?, server_id?, verdict?})` | `[(Receipt, Verdict)]` |

### Acceptance criteria (ship gates)

- Both schemas validate against the worked examples (100% pass).
- Three probe types ≥90% unit test coverage.
- End-to-end Notion test: legitimate update produces `VERIFIED` in <2s.
- **Adversary test**: a deliberately lying MCP server (returns `success` without writing) produces `FORGED` verdict. *This is the headline test.*
- Budget test: receipt with 10 claimed_changes and $0.01 budget produces `PARTIAL` with skipped probes correctly recorded.
- RLS test: receipts written by run A are not readable by run B's auth context.
- Dashboard renders ≥10 verdict feed entries with correct state coloring.

## Honest limits

**What this catches:** servers that claim success without writing · eventual-consistency failures · wrong-change-type claims · phantom successes · persistence failures · overwrites.

**What this does NOT catch:** sophisticated forgery where the server actually makes the change but lies about side effects in unreachable ways · genuinely unverifiable tools (e.g. "send push notification" with no read-side) · misrepresented *intent* (caller lying about what they wanted) · coordinated lies across multiple servers (collusion) · forged signatures if the HMAC key leaks.

**Open questions for the build:**

- Detector as standalone MCP server vs. library code in the Wrapper? *Recommendation: library for v0.1, MCP server when other agents need to call it (composes with Combo 02).*
- TTL for time_decay probes — likely target-type dependent. Notion pages: 1hr. Tickets: 5min. Webhooks: 30s.
- Should servers be allowed to declare themselves unprobeable? Trade-off between respecting tool autonomy and creating an opt-out for lying.

---

# Combo 02 — Eval-as-MCP × Sycophancy Telemetry

## Overview

An autonomic loop: Sycophancy Telemetry passively counts agreement streaks across multi-turn conversations. When the streak crosses threshold, Eval-as-MCP fires automatically with the conversation context and returns CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS findings. Findings inject back into the agent for regeneration. Anti-sycophancy graduates from personal discipline to runtime guardrail.

## Architecture

```mermaid
flowchart LR
    User1([User]) --> Agent[Agent]
    Agent --> Telemetry[Sycophancy Telemetry<br/>streak counter]
    Telemetry -- streak < 3 - pass --> User2([User])
    Telemetry -- streak ≥ 3 - trip --> Eval[Eval-as-MCP<br/>CLAIMS · COUNTEREXAMPLE · CONTRADICTIONS]
    Eval -- findings inject --> Agent
    State[(Streak State<br/>Supabase)] -. reads/writes .- Telemetry

    classDef assert fill:#E1F5EE,stroke:#0F6E56,color:#04342C
    classDef verify fill:#FAECE7,stroke:#993C1D,color:#4A1B0C
    classDef neutral fill:#F1EFE8,stroke:#5F5E5A,color:#2C2C2A

    class Agent,Telemetry assert
    class Eval verify
    class User1,User2,State neutral
```

The shape: response intercepted at the Telemetry checkpoint on every turn; if streak < threshold it passes; if it trips, Eval-as-MCP fires, findings loop back to the Agent, response regenerates. Streak state persists per conversation.

## 1. The streak signal

### A turn scores 1 (agreement) iff all four conditions hold

1. Contains agreement markers (lexical OR semantic)
2. Preceding user turn was a challenge, opinion request, or pushback — not just an info ask
3. Current conversational topic is consequential (decision, strategy, risk, quality, identity)
4. Agent's turn did NOT include substantive disagreement, qualifier, or a COUNTEREXAMPLE

Else scores 0. Streak = consecutive 1s.

### Three-layer detection (cost-tiered, fail-cheap-first)

| Layer | Mechanism | Cost | Purpose |
|---|---|---|---|
| L1 — Lexical | Regex + heuristic for markers ("you're right", "good point", "exactly", "agreed", "I think so too", sentence-initial "yes") | $0 | Fast screen; runs on every turn |
| L2 — Confirm | Haiku call: "Does this agent turn substantively agree without independent reasoning?" → bool | ~$0.0003 | Fires only when L1 hits AND streak ≥ 1; suppresses false positives like "good point — but here's why you're wrong" |
| L3 — Consequence | Haiku call: classify topic enum (`decision \| strategy \| risk \| quality \| identity \| info \| casual`) | ~$0.0002 | Only consequential topics count for streak |

### Streak counter rules

- Increment on score=1 turn
- **Reset to 0 on:** substantive disagreement turn · new consequential topic · successful eval pass · explicit user "challenge me" / "push back on this"
- **Decay:** half-life of 20 casual turns or 24 hours, whichever first — so old streaks do not compound across days

### Edge cases worth designing for

- "I agree, but you should also consider X" — L2 must read the qualifier; score 0
- "Yes, Python is faster than JS here" — L3 classifies as `info`; does not count
- Multi-paragraph response that opens polite then critiques — L2 evaluates substantive content, not opening tone
- User explicitly invites agreement ("just validate this for me") — log it but the streak still counts; the user cannot opt out of telemetry, only out of the autonomic action

## 2. The trigger threshold

**Default: `streak_score ≥ 3`** — anchored on the existing 3+ consecutive consequential agreements rule.

But streak is weighted, not just counted:

```python
streak_score = sum(
    consequence_weights[turn.topic_class]
    for turn in agreement_turns_in_window
)

consequence_weights = {
    "identity":  2.0,   # agreement about whether YOU can do X fires faster
    "risk":      1.5,
    "decision":  1.5,
    "strategy":  1.0,
    "quality":   1.0,
    "info":      0.0,   # does not count
    "casual":    0.0,
}

if streak_score >= threshold:
    fire_eval()
```

So a single identity-class agreement gets you to 2.0 — two-thirds of the way to threshold. Two strategy agreements (1.0 + 1.0) plus one decision (1.5) = 3.5 → trips.

### Tunable parameters

| Param | Default | Purpose |
|---|---|---|
| `threshold` | 3.0 | Fire eval when score crosses |
| `evaluation_window` | 10 turns | Only count agreements within window |
| `cooldown` | 5 turns | Suppress re-fire after an eval |
| `mode` | `soft` | `soft \| hard \| block` |
| `autonomic_enabled` | `true` | Master switch |

User override via CLI flags or session config: `--threshold 2` (more aggressive), `--no-autonomic` (telemetry-only).

## 3. The eval-call protocol

### Signature

```python
eval.run_adversarial_pass(
    conversation_id: str,
    turn_window: list[Turn],              # last N turns of full context
    scope_mode: Literal["LITE", "STANDARD", "FULL"] = "STANDARD",
    streak_meta: {
        "streak_score": float,
        "streak_turns": list[str],         # turn IDs that incremented streak
        "consequence_classes": list[str]
    }
) -> EvalResult
```

### EvalResult schema

```json
{
  "eval_id": "01HW...",
  "conversation_id": "conv_xyz",
  "triggered_at_turn": "turn_42",
  "scope_mode_used": "STANDARD",
  "claims": [
    { "text": "Strong CTAs increase conversion for fatigued audiences",
      "label": "GENERATED", "confidence": 0.6 }
  ],
  "counterexample": [
    "If audience has high CTA-fatigue, soft CTAs outperform"
  ],
  "contradictions": [
    "Agent's turn_36 in this same conversation recommended subtle CTAs for the same audience"
  ],
  "gaps": [
    "Agent has not asked about user's past campaign performance"
  ],
  "recommended_challenges": [
    "What CTA approach failed for similar audiences in your past campaigns?",
    "What baseline conversion are you benchmarking against?"
  ],
  "verdict": "agreement_streak_unjustified",
  "cost_usd": 0.008,
  "latency_ms": 1840
}
```

`verdict` enum: `agreement_streak_justified` · `agreement_streak_unjustified` · `needs_review`. A justified streak is rare but real — sometimes you are just right three times in a row.

### Three injection modes (configurable, default = soft)

- **Soft mode (default for v0.1)** — append the CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS footer to the next assistant message. Agent sees its own findings, decides how to revise. Lowest friction, preserves discipline visibility.
- **Hard mode** — pending response is intercepted before delivery. Eval findings injected as system message. Agent regenerates with explicit instruction to address each finding. The autonomic shape.
- **Block mode** — eval results surface to the user as an explicit interruption: "⚠ Agreement streak detected. Counterexamples available." User decides whether to view findings or proceed.

### Post-eval observation loop

Telemetry watches the next 2 turns for whether the agent:

- Mentioned or addressed the COUNTEREXAMPLE
- Maintained position (did not capitulate to user) OR substantively explained any revision

If the agent ignores eval findings → **eval-resistant flag**. Log as higher-severity. On next agreement, re-fire eval at FULL scope. This catches the failure mode where an agent reads the eval and politely ignores it.

### Storage (Supabase tables)

- `streak_state` — per `conversation_id`: current `streak_score`, `last_consequential_topic`, `last_eval_at`, `cooldown_until_turn`
- `evals` — full EvalResult per fire, FK to `conversation_id`
- `eval_integration` — per eval: did agent integrate findings? (`true | false | partial`) — populated by post-eval observation
- All RLS-scoped to owner

## Build sequence (12-day estimate, calendar realistic 4–6 weeks)

1. **Day 1–2** — Lexical L1 detector with marker library. Calibrate on a small labeled corpus.
2. **Day 3** — L3 topic classifier (Haiku call, structured output).
3. **Day 4** — L2 agreement confirmer (Haiku call).
4. **Day 5** — Streak state machine + Supabase tables + RLS.
5. **Day 6–7** — Eval-as-MCP server. Reuses the existing CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS pattern as the eval body.
6. **Day 8** — Sycophancy Telemetry wrapper around Claude API/SDK; pre-response hook.
7. **Day 9** — Hard mode injection — intercept pending response, regenerate with eval as system context.
8. **Day 10** — Soft + block modes; dashboard at `/sycophancy` (streak timeline, eval feed, integration rate).
9. **Day 11** — Adversarial test suite: synthetic conversations that should and should not trigger; eval-resistant agent test.
10. **Day 12** — Threshold + cooldown tuning against the test suite.

## Output — artifacts, endpoints, acceptance

### Artifacts

- `sycophancy_telemetry/` Python package (`detector.py`, `streak.py`, `wrapper.py`)
- `eval_as_mcp/` Python package (`server.py`, claims/counterexample/contradiction modules)
- `supabase/migrations/0002_sycophancy.sql` — `streak_state`, `evals`, `eval_integration`
- Dashboard route `/sycophancy`

### MCP tools exposed

| Tool | Signature | Returns |
|---|---|---|
| `eval.run_adversarial_pass` | `(conversation_id, turn_window, scope_mode, streak_meta)` | `EvalResult` |
| `telemetry.get_streak` | `(conversation_id)` | current streak state |
| `telemetry.history` | `(conversation_id, limit?)` | streaks + evals timeline |
| `telemetry.override` | `(conversation_id, action: 'reset' \| 'force_eval' \| 'disable')` | ack |

### Acceptance criteria

- L1 marker library catches ≥85% of agreement-only turns in test suite (precision ≥75%)
- L3 classifier ≥90% on `consequential | info` binary
- End-to-end: 3 consequential agreements trigger eval within 1s of the third turn
- Eval call returns EvalResult in <3s for STANDARD scope
- Hard mode injection regenerates response that demonstrably addresses ≥1 counterexample
- **Eval-resistant test:** an agent instructed to ignore eval findings is correctly flagged within 2 post-eval turns
- Cooldown test: no re-fire within 5 turns of a prior eval
- RLS test: conversation A's streak inaccessible from conversation B's auth context

## Honest limits

**What this catches:**

- Lexical sycophancy patterns
- Multi-turn agreement decay (position drifts toward user over time)
- Position capitulation when streak is high
- Eval-resistance (agent ignoring its own self-critique)

**What this does NOT catch:**

- Sophisticated sycophancy that varies language to dodge lexical detection
- Single-turn sycophancy (no streak to count — needs a different surface)
- Sycophancy via omission (agent declines to surface inconvenient truths — there is nothing to detect in what is not said)
- Stance changes in the user's direction without explicit agreement markers
- Sycophancy baked into the model itself — as Giskard notes, you cannot completely prompt your way out of sycophancy because it may be inherent in the underlying model. This is a wrapper, not a fix.

**Open questions for the build:**

- Should L2 use Haiku, or a stricter classifier model? Cost vs. fidelity.
- Recursive depth limit on evals — if Eval-as-MCP's own output is sycophantic, do we fire eval-on-eval? Hard cap at depth 2.
- Privacy: eval calls send conversation context to a separate model. Need a sensitive-topic flag (medical, legal, personal trauma) that disables autonomic eval and falls back to a local heuristic.
- Should this also expose a Giskard-style pre-deployment scan mode as a CI check on top of runtime telemetry? Different surface, complementary signal.

---

# Combo 03 — Anti-Pattern Catalog × Outcome-Aware Maturity Model

## Overview

A single diagnostic artifact: the Maturity Model names *where* a team is on the outcome-verification dimension; the Anti-Pattern Catalog names *what* is keeping them there. Levels alone would be derivative of existing CMM-style maturity frameworks. Anti-patterns alone would be a listicle. Together they form a diagnosis (level) plus treatment plan (named blockers).

## Visual: maturity ladder with anti-pattern gravity

```mermaid
flowchart BT
    L1["L1 — Output-only<br/>tools deployed; outcomes unknown"]
    L2["L2 — Tracked<br/>tool calls logged"]
    L3["L3 — Claimed<br/>outcome receipts emitted"]
    L4["L4 — Verified<br/>claims independently probed"]
    L5["L5 — Optimizing<br/>outcome signals feed back"]

    L1 -- blocked by Tool Sprawl --> L2
    L2 -- blocked by Trust-me Telemetry,<br/>Phantom Determinism --> L3
    L3 -- blocked by Single-source Verification,<br/>Side-effect Blindness,<br/>Outcome Inflation --> L4
    L4 -- blocked by Eval Lag,<br/>Eval Resistance,<br/>Sycophancy Loop --> L5

    Universal[Outcome Theater<br/>universal anti-pattern<br/>present at every level]
    Universal -. pins .- L1
    Universal -. pins .- L2
    Universal -. pins .- L3
    Universal -. pins .- L4
    Universal -. pins .- L5

    classDef level fill:#E1F5EE,stroke:#0F6E56,color:#04342C
    classDef start fill:#F1EFE8,stroke:#5F5E5A,color:#2C2C2A
    classDef universal fill:#FAECE7,stroke:#993C1D,color:#4A1B0C

    class L2,L3,L4,L5 level
    class L1 start
    class Universal universal
```

## 1. The five levels

| Level | Name | Capability gain | Success criterion |
|---|---|---|---|
| **L1** | Output-only | Tools deployed | Tool returned a response |
| **L2** | Tracked | Calls observable | Call succeeded (no exception, HTTP 200) |
| **L3** | Claimed | Receipts emitted | Server claims the world changed |
| **L4** | Verified | Probes confirm | External verification confirms the change |
| **L5** | Optimizing | Loop closes | Outcome signals improve the system over time |

Each level adds exactly one capability to the level below. You cannot skip — L4 verification is meaningless without L3 receipts, which are meaningless without L2 telemetry.

### Per-level detail

- **L1 — Output-only.** AI/MCP tools exist in the workflow. Outcomes are unknown unless someone manually checks. Default starting point. Almost every shop is at least here.

- **L2 — Tracked.** Every tool call logged with consistent metadata (tool name, params, response, timestamp, latency). Standard OTel observability. You can answer "what was called, when, and did it return successfully" — but not "did the world actually change."

- **L3 — Claimed.** Tool wrappers emit structured Outcome Receipts (the Combo 01 artifact). Each call now carries a claim about what changed in the world: target, change_type, before/after hash, evidence URI. Receipts persisted in an audit log, queryable. *Trust is honor-system — you believe the server.*

- **L4 — Verified.** Claims are independently probed (the Combo 01 Forgery Detector layer). Verdict states emerge: VERIFIED, FORGED, STALE, INCONSISTENT, OVERWRITTEN. Probes run on production traffic. Side-effects are tracked alongside primary effects. *Trust becomes auditable.*

- **L5 — Optimizing.** Verdict signals feed back into the system. Forgery patterns trigger config changes. Anti-patterns surface as alerts. Eval cadence matches deploy cadence. Outcome rate is a tracked, improving metric over time.

## 2. The anti-pattern catalog

Ten anti-patterns plus one universal. Each has a **smell** (how you spot it), a **why it persists** (what makes it tempting), and a **fix** (the move that breaks gravity).

### Universal — appears at every level

**Outcome Theater.** The dashboard says "outcomes" but the data is outputs.

- **Smell:** Dashboard headers say "outcomes" / "results"; columns are `call_count`, `error_rate`, `p95_latency`. Outcome is undefined or trivially defined.
- **Why it persists:** Vanity metrics are cheap to ship and look like maturity.
- **Fix:** Define outcomes as world-state changes per use case. Anything that cannot be expressed as "the world is now in state X" does not count.

### Blocks L1 → L2

**Tool Sprawl.** Adding MCP servers without measuring whether they get used or improve outcomes.

- **Smell:** MCP config has 30+ entries; no one can name what most do or when they were last useful.
- **Why it persists:** Adding tools is one command; removing requires a conversation.
- **Fix:** Quarterly tool review. Tools with zero use in 60 days get archived. Tools whose receipts never verify get audited.

### Blocks L2 → L3

**Trust-Me Telemetry.** Success = whatever the server says.

- **Smell:** Success criteria look like `status == "ok"` or `response.code == 200`. No external check.
- **Why it persists:** Cheap, fast, the happy-path returns true 95% of the time so it looks fine.
- **Fix:** Require structured claim emission (a receipt with `target` + `change_type` + state hash). If the server cannot produce that, treat the call as L1.

**Phantom Determinism.** "It worked last time" treated as proof it will work next time.

- **Smell:** No sampling-based eval on production. Confidence in the system rests on recent anecdote, not measurement.
- **Why it persists:** LLM-driven workflows feel like code; treating them like code is the default mental model.
- **Fix:** Sample N% of production calls for outcome verification. Treat success rate as a continuous signal with control limits.

### Blocks L3 → L4

**Single-Source Verification.** To verify a Notion update, you ask Notion.

- **Smell:** Verification probes hit the same system that performed the change. Same source confirms itself.
- **Why it persists:** Cross-source verification requires a second integration.
- **Fix:** Cross-MCP verification. If Tool A updated Notion, ask the Drive MCP or Email MCP for corroborating evidence (the watcher email, the embed reference).

**Side-Effect Blindness.** Primary effect tracked, secondary effects ignored.

- **Smell:** Receipts show `target` and `change_type`; `side_effects` is empty or `null`. Notifications fired? Webhooks called? Unknown.
- **Why it persists:** Side-effect tracking is expensive and almost always "out of scope for v1."
- **Fix:** Pick one high-traffic use case. Map every side-effect end-to-end. Make the audit visible.

**Outcome Inflation.** Outcome definitions broaden over time until everything is a win.

- **Smell:** What started as "ticket resolved" became "ticket touched" became "user engaged" became "user feel heard."
- **Why it persists:** Broader outcomes are easier to claim victory on.
- **Fix:** Lock outcome definitions per use case in a versioned doc. Broadening requires a written justification.

### Blocks L4 → L5

**Eval Lag.** Evals run weekly, drift happens hourly.

- **Smell:** Eval pipeline runs on cron (weekly, monthly). Deploys happen daily. By the time eval catches a regression, it has been live for days.
- **Why it persists:** Full evals are expensive; running them continuously feels excessive.
- **Fix:** Tiered evals. Smoke eval on every deploy (cheap, narrow). Full eval on every release (expensive, broad). Continuous outcome verification on production sampling (the L4 capability becomes the eval).

**Eval Resistance.** Eval findings exist but never ship changes.

- **Smell:** Eval reports filed in a backlog ticket. No SLA on response. Same findings appear week after week.
- **Why it persists:** Acting on findings means slowing feature work.
- **Fix:** Per-eval triage in standup. SLA on triage. Repeated unaddressed findings auto-escalate.

**Sycophancy Loop.** Multi-turn agent positions drift toward user preference.

- **Smell:** Same conversation, agent's recommendation shifts each turn in the user's direction. No new evidence, just compliance.
- **Why it persists:** Helpful-seeming on the surface; user-satisfaction metrics reward it.
- **Fix:** Combo 02 — streak telemetry + Eval-as-MCP intervention. Anti-sycophancy as a runtime guardrail, not just personal discipline.

## 3. The diagnostic rubric

Twenty-one yes/no questions, grouped by level. **You clear a level only if you also clear every level below it.** Your assessed level is the highest tier you have cleared.

### L1 — Output-only (qualifier, 1/1 required)

1. Are AI or MCP tools deployed in your workflow?

### L2 — Tracked (4/4 required to clear)

1. Is every tool call logged with consistent metadata (tool name, params, response, timestamp)?
2. Are latency and error rate visible per tool?
3. Do tool failures surface to an operator within 5 minutes?
4. Can you query "which tools were called in run X" without spelunking through logs?

### L3 — Claimed (5/5 required to clear)

1. Do tool wrappers emit structured outcome claims (target, change_type, before/after hash)?
2. Are receipts persisted in an audit log accessible at least 30 days back?
3. Is "outcome" defined for at least three of your top use cases — beyond "call succeeded"?
4. Can you query "what did agent run X actually change in the world"?
5. Do receipts include evidence URIs or hashes that would allow a third party to re-verify?

### L4 — Verified (5/6 required to clear)

1. Do at least three use cases have automated outcome verification (probes)?
2. Do you have verdict states beyond binary pass/fail (e.g. `VERIFIED`, `FORGED`, `STALE`, `INCONSISTENT`)?
3. Are probes run on production traffic, not just test traffic?
4. Is there cross-source verification (a different MCP confirms the outcome)?
5. Are side-effects tracked alongside primary effects?
6. Is the forgery / failure rate trend visible over time?

### L5 — Optimizing (4/5 required to clear)

1. Do verdict signals feed back into prompts, configs, or tool-selection logic?
2. Do failure patterns automatically trigger config changes or alerts?
3. Is eval cadence at least as fast as deploy cadence?
4. Are anti-patterns from the catalog surfaced as alerts when detected?
5. Is there measurable improvement in outcome rate over the last 90 days?

### Plus — the anti-pattern audit

For each level you have *not* cleared, ask: "Which anti-patterns from the catalog for this transition are operative in our system?" The named anti-patterns become your treatment plan.

### Sample diagnosis

> **Assessment:** L2 — Tracked. (4/4 on L2 questions, 2/5 on L3.)
>
> **Operative anti-patterns at the L2→L3 transition:**
> - Trust-me telemetry — success defined as HTTP 200; no claim emission.
> - Phantom determinism — no sampling-based eval on production.
>
> **Next move:** Add an Outcome Receipt to your top three use cases. Define "outcome" as a world-state change per use case. Target L3 within one quarter.

The deliverable is not just a level number, but a named diagnosis with a concrete treatment.

## Build sequence (content IP, not code — 12 days writing/design)

1. **Day 1–2** — Write the level definitions as canonical paragraphs. One screen each. Each level gets a name, capability, success criterion, and "you know you are here when…" indicator.
2. **Day 3–4** — Draft the anti-pattern catalog. Ten patterns, each with smell / why-persists / fix. Each pattern gets a named real-world case study.
3. **Day 5** — Build the diagnostic rubric. Twenty-one questions, scoring rules, clearance bars.
4. **Day 6** — Produce the canonical visual (the maturity ladder with anti-pattern gravity). Print-ready and screen-ready versions.
5. **Day 7** — Write the companion narrative — a 2,000-word essay explaining the model, the wedge versus existing maturity models, and how to use it.
6. **Day 8** — Build a self-assessment interactive (the rubric as a clickable scorecard with sample diagnosis output).
7. **Day 9–10** — Three case studies — applying the model to real systems. These ground the framework in reality and inoculate against the "theory-for-theory's-sake" failure mode.
8. **Day 11–12** — Publish. Companion essay + visual + interactive rubric in one place.

## Output — what ships

### The artifact package

- **The visual** — a print-ready PNG/SVG of the maturity ladder with anti-pattern gravity.
- **The catalog** — a markdown companion document with the 10 anti-patterns expanded with case studies.
- **The rubric** — both a printable PDF and an interactive web scorecard. Produces a named diagnosis on completion.
- **The essay** — 2,000-word narrative positioning the model relative to existing frameworks and arguing the outcome-verification lens.
- **The case studies** — three worked examples grounding each level with real systems.

### Distribution surfaces

- Standalone microsite or sub-page hosted on a FlashFusion-adjacent property or as a public Notion page.
- Submitted to MCP / agent-systems community spaces.
- Used as the opening frame in any "outcome-aware AI" talk, workshop, or consulting engagement.

### Acceptance criteria

- Level definitions pass the elevator test — each level summarizable in one sentence by someone who has read the doc once.
- Anti-pattern catalog includes at least one named real-world example per pattern. **No theoretical-only patterns ship.**
- Rubric tested end-to-end: three friendly testers assess their own systems using the rubric and produce diagnoses that match an independent assessment.
- Visual prints legibly at 11×17 (poster size).
- Essay positions the model relative to at least three existing maturity frameworks without dismissing them.

## Honest limits

**What this is:** a specialist diagnostic tool. A frame for naming where you are on the outcome-verification dimension and what is blocking ascent.

**What this is not:** a complete organizational AI maturity model. It deliberately ignores governance, talent, infrastructure, culture, ROI — all the dimensions broad models cover. *This is intentional scope; complement, do not replace.*

**Risks:**

- **Theory-for-theory's-sake.** If the case studies are not grounded in real systems, the model reads as academic. Day 9–10 is the inoculation. Do not ship without them.
- **The numbers are vibes.** "Clear 5/5 on L3" feels rigorous but the 5/5 bar is a designer choice, not an empirical finding. Calibrate against three real systems before publishing.
- **Anti-pattern catalog is opinionated.** Some practitioners will disagree with specific anti-pattern framings (especially "trust-me telemetry" — many shipped systems work fine with it). Frame as "gravity at this transition," not "wrong."
- **Maturity-as-marketing.** Maturity models tend to get used as sales tools. If you publish this, expect vendors to claim L5 on weak evidence. Build the rubric so claims require evidence, not self-report.

**Open questions:**

- Should the rubric be free, or gated (lead-gen / consulting funnel)? Free maximizes adoption; gated maximizes capture.
- Does the model versionize (v0.1, v1.0)? Recommendation: yes, treat it like a spec.
- Should the universal anti-pattern (Outcome Theater) get its own deeper treatment as a standalone essay? It is the gateway concept.

---

# Cross-combo synthesis

## Dependency graph

```mermaid
flowchart TB
    subgraph Shared[Shared infrastructure]
        Audit[(Supabase Audit Log)]
        Wrapper[MCP Wrapper Pattern]
        VSchema[Verdict Schema Pattern]
        Review[Adversarial Review Pattern<br/>CLAIMS · COUNTEREXAMPLE · CONTRADICTIONS]
    end

    C01[Combo 01<br/>Receipts × Forgery Detector]
    C02[Combo 02<br/>Eval-as-MCP × Sycophancy Telemetry]
    C03[Combo 03<br/>Anti-Pattern × Maturity Model]

    Audit --> C01
    Audit --> C02
    Wrapper --> C01
    Wrapper --> C02
    VSchema --> C01
    VSchema --> C02
    Review --> C01
    Review --> C02
    Review --> C03

    C01 -. provides L3 and L4 vocabulary .-> C03
    C02 -. can be called as a probe by .-> C01

    classDef shared fill:#F1EFE8,stroke:#5F5E5A,color:#2C2C2A
    classDef combo fill:#E1F5EE,stroke:#0F6E56,color:#04342C

    class Audit,Wrapper,VSchema,Review shared
    class C01,C02,C03 combo
```

## Build order recommendation

1. **First — Combo 03 (content IP).** Ships in 12 days of writing/design. No engineering cost. Establishes the conceptual framework the other two combos plug into. Outcome rate: published artifact + diagnostic rubric + canonical visual.

2. **Second — Combo 01 (deepest moat).** Builds the L3-L4 capability the Maturity Model references. Receipt schema becomes an open spec; Forgery Detector becomes a novel runtime tool. Outcome rate: shipped MCP wrapper + verdict layer + audit log.

3. **Third — Combo 02 (autonomic loop).** Builds on Combo 01's infrastructure (audit log, verdict patterns). Adds the L5 feedback loop. Outcome rate: streak telemetry running on personal conversations + Eval-as-MCP as a callable server.

## Shared infrastructure

| Component | Used by | Notes |
|---|---|---|
| Supabase audit log | 01, 02 | RLS-scoped per `caller_run_id` |
| MCP Wrapper pattern | 01, 02 | Python proxy intercepting tool calls |
| Verdict schema shape | 01, 02 | Both Forgery Verdict and Eval Verdict follow this pattern |
| Adversarial review vocabulary | 01, 02, 03 | CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS |

## Combinatorial possibilities

- **Combo 01 + Combo 02:** Forgery Detector calls Eval-as-MCP as one of its probe types (a `negative` probe — adversarial outcome questioning). Eval-as-MCP gets used as a probe registry plugin.
- **Combo 01 + Combo 03:** Receipts at L3, Verdicts at L4 — Combo 01 is the implementation that makes those Maturity Model levels real.
- **Combo 02 + Combo 03:** Sycophancy Loop appears as an L4→L5 anti-pattern in Combo 03's catalog. Combo 02 is the operational fix that breaks that gravity.

---

# Open questions across all three

1. **Open spec vs. fork-ahead.** Should Outcome Receipts harmonize with the OTel-for-MCP proposal as it evolves, or fork ahead with our own spec? Migration cost vs. ecosystem fit.
2. **Eval-as-MCP recursion limit.** If the eval's own output is sycophantic, do we fire eval-on-eval? Recommendation: hard cap at depth 2.
3. **Forgery Detector as MCP server vs. library.** v0.1 ships as library. v1.0 question: do we expose it as a callable MCP so other agents can self-audit?
4. **Maturity Model versioning.** Treat as a spec (v0.1, v1.0, ...) or as living docs? Recommendation: spec; calibrate before bumping major.
5. **Publishing surface.** All three artifacts can ship under FlashFusion. Open question whether to host on flashfusion.co or a dedicated outcome-aware-mcp domain.
6. **Title positioning.** The framework stands on its own. Publishing should not claim engineering seniority. Use FlashFusion branding for distribution.

---

# Adversarial review (consolidated)

## CLAIMS

- **[SOURCED]** MCP observability is well-trodden; outcome verification is genuinely open. Source: [OTel-for-MCP proposal discussion #269](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/269); [mcp-eval.ai](https://docs.mcp-agent.com/test-evaluate/server-evaluation); [mcp-sec-audit (arxiv 2603.21641)](https://arxiv.org/html/2603.21641v1).
- **[SOURCED]** Sycophancy mitigation has heavy precedent. Source: [Silicon Mirror (arxiv 2604.00478)](https://arxiv.org/pdf/2604.00478) reporting 85.7% reduction on Sonnet 4; [Giskard Scan](https://www.giskard.ai/knowledge/when-your-ai-agent-tells-you-what-you-want-to-hear-understanding-sycophancy-in-llms); Phare benchmark.
- **[SOURCED]** AI maturity model space is crowded. Source: [Microsoft Copilot Studio CMM-based 5-level model](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/maturity-model-overview); [Acuvity Agent Integrity Framework](https://acuvity.ai/the-agent-integrity-framework-and-maturity-model/); [Dextralabs L1-L4](https://dextralabs.com/blog/agentic-ai-maturity-model-2025/); [Darktrace Security Maturity](https://www.darktrace.com/blog/introducing-the-ai-maturity-model-for-cybersecurity).
- **[GENERATED]** All three combos share an assert-verify structural shape. This is the framework-level claim, not derived from sources.
- **[GENERATED]** Combo 03 build order goes first because content IP ships cheapest and seeds the other two. Reasoning from cost-of-delay logic, not data.

## COUNTEREXAMPLE

- **Combo 01:** `side_effect` probes are the highest-value catch and the hardest to build. Day 9-10 estimate is optimistic. Honest re-estimate: 3-5 days for `side_effect` alone, on top of the rest.
- **Combo 02:** Lexical detection is brittle. A model that varies its agreement language escapes L1 detection. Streak-based detection probably catches 50-70% of what Silicon Mirror's trait classifier catches. Frame as harm reduction, not solution.
- **Combo 03:** Anyone reading the rubric assumes they have AI tools deployed. Plenty of MSP service desks at the L1 service-tech tier do not. Consider adding an L0 — Exploration tier.
- **Combo 03 rubric strictness:** 5/5 to clear L3 is hard. Many sophisticated teams have receipts for some use cases but not all. Consider "partial clearance" notation (L3* for "L3 on these specific use cases").

## CONTRADICTIONS

- **Combo 02 vs. discipline.** Anti-sycophancy as personal discipline (manual CLAIMS footers, agreement-streak flags) vs. as runtime automation. Automating it removes the visibility of the discipline. Recommendation: ship in `soft` mode first; preserve discipline visibility. Spec defaults to `soft` for v0.1.
- **Combo 01 spec authoring.** Publishing Outcome Receipts as an open spec implies wanting ecosystem convergence on this schema. But waiting for OTel-for-MCP proposal to settle may mean shipping into a moving target. Decision needed before day 1.
- **Combo 03 anti-pattern framing.** Anti-patterns positioned as gravity (always bad). But some are legitimate level-appropriate choices (trust-me telemetry is fine at L2 if outcome verification is not worth the cost yet). Reframe as gravity *if you are trying to ascend*, otherwise the catalog reads as moralizing.
- **Title positioning.** Maturity model and runtime systems both imply engineering seniority. Personal context places the author at L1 Service Desk Tech. Resolution: publish under FlashFusion brand, not personal title; framework stands on its own.

## GAPS

- **Threat models.** No threat model in any of the three specs. Combo 02 especially: a user could game the system by repeatedly typing "challenge me" to suppress eval triggers. Combo 01: probe-result authentication needed before dashboard goes anywhere beyond personal use.
- **Case studies.** Combo 03 ships without case studies in v0.1. Day 9-10 of the build addresses this, but the framework is unproven until at least three real systems are walked through the rubric.
- **Privacy.** All three combos send conversation/world-state context to a separate model (for evals, probes, classifiers). Need a sensitive-topic flag (medical, legal, trauma) that disables runtime intervention and falls back to local heuristics.

---

# References

## Standards and proposals

- [OpenTelemetry MCP Proposal — discussion #269](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/269) — agent run record fields, trace correlation
- [Apollo MCP Telemetry Integration](https://www.apollographql.com/docs/apollo-mcp-server/telemetry) — OTel implementation for MCP
- [Microsoft MCP Server Certification](https://learn.microsoft.com/en-us/microsoft-agent-365/mcp-certification) — telemetry and security requirements

## Existing tools

- [traceloop/opentelemetry-mcp-server](https://github.com/traceloop/opentelemetry-mcp-server) — OTel querying for MCP
- [mcp-agent server evaluation](https://docs.mcp-agent.com/test-evaluate/server-evaluation) — pre-deployment server evals
- [SigNoz MCP Observability guide](https://signoz.io/blog/mcp-observability-with-otel/) — OTel + MCP patterns
- [OneUptime instrumentation guide](https://oneuptime.com/blog/post/2026-03-26-how-to-instrument-mcp-servers-with-opentelemetry/view) — production instrumentation patterns

## Research

- [Silicon Mirror — Dynamic Behavioral Gating for Anti-Sycophancy](https://arxiv.org/pdf/2604.00478) — closest sycophancy-mitigation precedent
- [AgentTrace — Structured Logging for Agent Observability](https://arxiv.org/pdf/2602.10133) — three-surface telemetry foundation
- [VIGIL — Reflective Runtime for Self-Healing Agents](https://arxiv.org/pdf/2512.07094) — autonomous maintenance precedent
- [mcp-sec-audit — Auditing MCP Servers](https://arxiv.org/html/2603.21641v1) — capability audit precedent

## Maturity model precedents

- [Microsoft Copilot Studio Agentic AI Maturity Model](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/maturity-model-overview) — CMM-based
- [Acuvity Agent Integrity Framework](https://acuvity.ai/the-agent-integrity-framework-and-maturity-model/) — includes MCP Security
- [Digital Applied Agentic AI Maturity Model](https://www.digitalapplied.com/blog/agentic-ai-maturity-model-enterprise-self-assessment-guide) — 5-stage enterprise self-assessment
- [Dextralabs L1-L4 Framework](https://dextralabs.com/blog/agentic-ai-maturity-model-2025/) — autonomy/orchestration/governance/outcomes pillars
- [Darktrace AI Security Maturity Model](https://www.darktrace.com/blog/introducing-the-ai-maturity-model-for-cybersecurity) — cybersecurity domain
- [Nexocode Crawl/Walk/Run/Scale](https://nexocode.com/blog/posts/the-agentic-ai-maturity-model-crawl-walk-run-scale/) — 4-stage progression
- [Enterprise AI Agent Maturity Model](https://agility-at-scale.com/ai/agents/enterprise-ai-agent-maturity-model/) — 5-stage organizational

## Sycophancy

- [Giskard — Understanding Sycophancy in LLMs](https://www.giskard.ai/knowledge/when-your-ai-agent-tells-you-what-you-want-to-hear-understanding-sycophancy-in-llms) — pre-deployment scan
- [Deepchecks — What is Sycophancy in LLM](https://deepchecks.com/glossary/sycophancy-in-llm/) — RLHF preference signal connection

---

# Recommended repository structure (for v0.2+)

When this graduates from a single file to a multi-file repo:

```
outcome-aware-mcp/
├── README.md                          # condensed version of this file; links to others
├── CHANGELOG.md
├── LICENSE                            # CC-BY-SA for spec content, MIT for code
├── specs/
│   ├── 01-receipts-and-forgery.md
│   ├── 02-eval-and-sycophancy.md
│   └── 03-maturity-and-antipatterns.md
├── schemas/
│   ├── receipt.v0.1.schema.json
│   ├── verdict.v0.1.schema.json
│   └── eval-result.v0.1.schema.json
├── rubric/
│   ├── diagnostic.md                  # Combo 03 assessment text
│   └── self-assessment.html           # interactive scorecard
├── visuals/
│   ├── combo-01-architecture.svg
│   ├── combo-02-architecture.svg
│   └── combo-03-maturity-ladder.svg
├── case-studies/
│   ├── intinc-service-desk.md
│   ├── flashfusion-agent-stack.md
│   └── personal-automation-stack.md
└── examples/
    ├── receipt-notion-update.json
    ├── verdict-forged.json
    └── eval-result-sycophancy-streak.json
```

This file (v0.1) is the single-document precursor to the above.

---

# Changelog

- **v0.1 — 2026-05-20** — Initial draft. Three combos specced. Diagrams as Mermaid. Adversarial review consolidated. References curated.

---

*End of document.*
