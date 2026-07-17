# Security Architecture

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


## Security Model

Security is enforced across application code, database policies, CI/CD, secrets handling, and AI governance.

## Core Controls

- RLS enabled on all tenant data.
- Least-privilege roles: owner, admin, operator, analyst, client_viewer, agent_runtime, auditor.
- Signed webhooks with replay protection.
- No unauthenticated high-impact endpoints.
- Agent actions have scopes, budgets, tools, evals, logs, and approval rules.
- Prompt outputs affecting external claims must pass review.
