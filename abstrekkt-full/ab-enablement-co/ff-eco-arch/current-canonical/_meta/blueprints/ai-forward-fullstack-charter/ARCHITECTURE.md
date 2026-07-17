# Architecture — AI-Forward Full-Stack Development System

## System overview
A multi-agent development environment where AI agents and humans collaborate under
explicit governance. AntiGravity IDE orchestrates parallel agent jobs; Claude Code,
Gemini, Copilot, and Codex execute scoped work; CI/CD, Vault, Atlantis, and
observability form the safety perimeter.

## Three-zone governance (the core decision)
```
ZONE 1 AUTONOMOUS   reads, lint, format, draft PRs, run tests        (no gate)
ZONE 2 GATED        infra changes, deploys, schema migrations,       (human approval
                    secret access                                     via CI/CD + Atlantis)
ZONE 3 FORBIDDEN    prod data deletion, billing, cred exfiltration,  (kill switch)
                    quota override
```
Every agent maps to a zone in `docs/agents/AGENTS.md`.

## Control plane
- **CLI Router** — single gateway: rate limiting, failover, per-agent quota, and a
  file-lease lock so two agents never edit one file.
- **Vault** — brokers all cross-ecosystem credentials (Google/MS/GitHub/AWS); agents
  never hold long-lived keys.
- **Atlantis** — human approval gate for Terraform/infra.
- **Observability (Sentry + PostHog)** — every agent action logged with actor + zone.
- **cost-monitoring.yml** — trips the kill switch on runaway spend.

## Data consistency
Supabase + Firebase + AWS can diverge (eventual consistency). Designate one system
of record per entity; treat others as read replicas or async projections.

## Decision log
- Chose a CLI router over per-agent config to centralize quota + failover.
- Chose Vault over per-agent env files to kill credential siloing.
- Kept AntiGravity's real concurrency ceiling UNVERIFIED — throttle until benchmarked.
