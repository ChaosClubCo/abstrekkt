# UX Flow Patterns — Human ↔ AI Collaboration

The five recurring patterns for where humans and AI agents hand off. Each has a flow
and explicit guardrails.

## Pattern 1: AI-generated PR → human review
**Flow:** agent drafts PR → `ai-commit-review` runs → human reviews → merge.
**Guardrails:** no merge without CI pass + human approval on Zone 2/3 paths.

## Pattern 2: Ambiguous request → clarification loop
**Flow:** agent detects ambiguity → asks one focused question → proceeds.
**Guardrails:** agent must not guess on money/auth/infra; cap clarification loops,
then escalate to a human rather than stalling on repeated "nudge".

## Pattern 3: Parallel agent jobs (AntiGravity orchestration)
**Flow:** orchestrator fans out independent tasks → each agent holds a file lease →
results aggregate.
**Guardrails:** CLI-router file-lease prevents same-file collisions; global
concurrency throttled until AntiGravity's ceiling is benchmarked.

## Pattern 4: Cost alert → human intervention
**Flow:** `cost-monitoring.yml` trips → kill switch pauses agent → human triages.
**Guardrails:** per-agent daily budget; auto-revoke token on breach.

## Pattern 5: Security incident → automated rollback
**Flow:** error spike / bad deploy → rollback runbook → post-incident note.
**Guardrails:** rollback point registered every deploy; schema + app revert together.

## Where designers review AI-generated UI
AI-generated UI lands in a preview deployment (Vercel) tagged for design review;
a designer approves before it merges — closing the "UX handoff" blind spot.
