# Replit Multi-CLI Installer (Phase 1 spike)

Stands up a multi-CLI AI engineering environment in a Replit runtime for the
FlashFusion team, with multi-tenant RBAC, a ChatGPT MCP connector, and audit logging
to S3 + Sentry. Designed for FlashFusion's team first, with future B2B-client resale —
so **personas are data, not code forks**.

## What it installs (in the Replit app runtime)

- **Claude Code CLI** — primary architect/editor.
- **Gemini CLI** — systems integrator / research.
- **Codex CLI** — secondary generator.
- **ChatGPT.com connector / MCP** — a FastMCP server exposing the environment to
  ChatGPT as a custom connector.

## Architecture (layers)

```
Replit template
├── personas/                  persona configs (variants as DATA)
├── mcp-server/                FastMCP server = ChatGPT connector
├── cli-orchestrator/          routes a request to the right CLI
├── rbac/                      multi-tenant role → scope mapping
├── audit/                     every CLI exec → S3 + Sentry (immutable)
├── bootstrap/                 one-shot install script (sets up all CLIs)
├── tests/                     validation (RLS, auth, exec smoke)
└── docs/                      usage + persona authoring guide
```

## Implementation sequence (from source)

1. **Replit environment setup** — template + runtime.
2. **Multi-tenant RBAC** — role → scope; tenant isolation.
3. **MCP server** — FastMCP ChatGPT connector.
4. **Audit logging pipeline** — CLI output → S3 + Sentry.
5. **CLI orchestrator** — dispatch to Claude/Gemini/Codex.
6. **Installation bootstrap** — one script installs all CLIs.
7. **Tests & validation** — RLS, auth, exec smoke.
8. **Documentation** — usage + persona authoring.

## Audit logging (non-negotiable)

Every CLI execution is captured and shipped to **S3** (durable store) and
**Sentry** (alerting/triage). Logs are immutable and access-controlled — the
"black-box flight recorder."

```bash
# CLI exec is wrapped so output always lands in the audit pipeline
run-cli claude "<task>"   # → stdout to user, full transcript → S3 + Sentry
```

## Personas / variants

Personas are config files (role, allowed CLIs, scopes, default prompt preamble),
not forks — so new FlashFusion roles and, later, B2B-client variants are added by
dropping a config, not editing the orchestrator.

## Why this is a spike, not production

Replit is fine to prove the multi-CLI + MCP + audit loop cheaply. For production,
transition to AWS ECS (`../aws-deploy/terraform-ecs.md`) — multi-tenant, RLS,
JWT rotation, RDS. **Do not ship the Replit spike as production.**

## Validation

- [ ] All three CLIs install via the bootstrap script
- [ ] ChatGPT MCP connector responds
- [ ] Every CLI exec produces an S3 + Sentry audit record
- [ ] RBAC: a tenant cannot access another tenant's context
