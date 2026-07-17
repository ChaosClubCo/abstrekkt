# Observability — Sentry + PostHog

Centralized logging, error tracking, and product analytics so agent failures are
visible and every action is auditable.

## What goes where
- **Sentry** — errors, exceptions, performance traces from app + agent runs.
- **PostHog** — product/agent event analytics (who did what, in which zone).

## Required tags on every agent action
`actor` (which agent/human), `zone` (1/2/3), `correlationId`, `repo`, `prNumber`.
This makes repudiation impossible and powers the audit trail.

## Setup (sketch)
```ts
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.2 });
// PostHog: capture agent_action { actor, zone, action, correlationId }
```

## Alerts
- Error-rate spike → page on-call (see `scripts/alert.sh`).
- `cost-monitoring.yml` kill-switch trip → immediate alert.
- Agent hallucination flag (PR quarantined) → notify reviewer.

## Scripts
- `scripts/alert.sh "<message>"` — used by cost-monitoring + rollback runbooks.
