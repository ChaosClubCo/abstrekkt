# Threat Model

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


## Critical Threats

- Auth bypass exposing client data.
- Unauthenticated execution endpoints.
- Unauthorized budget/agent mutation.
- Prompt injection causing data leakage.
- Fake claims delivered to clients.
- Webhook replay or forged events.
- Secret leakage in logs or generated artifacts.

## Controls

RLS, signed webhooks, scoped retrieval, human review, secret scanning, audit logs, evals, and CI gates.
