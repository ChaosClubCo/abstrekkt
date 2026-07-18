# ZDR & Retention — What It Actually Means

> The source repeatedly asserted "Zero Data Retention (ZDR) — Enabled for all roles"
> alongside "All interactions logged to Sentry." Those two statements are in tension.
> This sheet reconciles them so no one tells an auditor, customer, or executive
> something that isn't true. **Verify specifics against your actual Anthropic
> contract — this is guidance, not legal advice.**

## The core correction

**ZDR ≠ "nothing is stored."**

- ZDR (an Anthropic enterprise contractual feature) means Anthropic **does not use
  your inputs/outputs to train models** and limits long-term retention.
- It does **not** mean zero storage everywhere. Operational data exists transiently,
  and a **security/abuse-monitoring log is typically retained for a limited window
  (~30–90 days depending on the agreement)**.
- "Memory" and conversation history are a **separate** product feature you control;
  they persist until you delete them, independent of ZDR.

| Claim | Accurate? | Reality |
|-------|-----------|---------|
| "ZDR = nothing stored" | ✗ | Training opt-out + limited retention; a short-term security log remains |
| "We have ZDR" (no contract check) | ? | Verify it is actually in your contract/admin settings |
| "Memory is wiped under ZDR" | ✗ | Memory/history is user-controlled, not governed by ZDR |
| "All interactions logged to Sentry" | ? | App-layer claim — verify; and reconcile with retention promises |

## The "ZDR + logging" contradiction, resolved

You can have both, because they govern different things:

- **ZDR** governs **training use and Anthropic-side long-term retention**.
- **Your audit logging** (e.g., to Sentry or the Claude admin audit log) is **your
  operational record** at the application/access layer.

What you must NOT do: claim "zero data retention" *and* "we log every interaction"
without explaining that the log is your own short-lived operational record, not
permanent storage of content. If your audit log stores prompt/response **content**,
it has its own retention and access-control obligations — classify it.

## Retention facts to confirm and record

Fill these in from your actual contract/console; attach to the evidence log.

| Item | Value to confirm |
|------|------------------|
| ZDR in contract? | yes / no |
| ZDR enabled in admin console? | yes / no |
| Anthropic security-log retention window | `[~30–90 days — confirm]` |
| Memory/history retention (your policy) | `[e.g., remove >90 days]` |
| Your audit-log retention (Sentry/other) | `[confirm + classify if content stored]` |
| Data-deletion mechanism | `[admin console control name]` |

## How this connects to the rest of the kit

- **Usage policy** (`ai-usage-policy.md` §5): don't represent ZDR as zero storage.
- **Audit** (`../audit/audit-evidence-template.md`): empirically verify ZDR, logging,
  and memory isolation — don't assume.
- **Rollback** (`../rollout/rollout-plan.md`): rollback revokes access; it does
  **not** delete data. Use the admin data-deletion control for genuine privacy
  incidents, and record retention windows so deletion expectations are realistic.

## One-paragraph version (for execs/customers)

> Under our ZDR agreement, Anthropic does not train on FlashFusion's inputs or outputs
> and limits retention; a short-term security/abuse-monitoring log is retained
> (~30–90 days, per contract). Conversation memory/history is a separate feature we
> control and delete on our own schedule. We maintain our own operational audit log,
> which is classified and retention-bounded. "ZDR" is a training-and-retention
> commitment, not a claim that nothing is ever stored.
