# Ops Autopilot for SMB — Complete Delivery Kit

> Managed automation platform: Teams front door → n8n execution → Intinc control plane.
> Target: SMBs (50–500 employees) losing 10–40 hours/week to manual IT operations.

---

## Quick Start (By Role)

| You Are | Start Here | Then Read |
|---------|-----------|-----------|
| **Engineer (Week 1–4 build)** | [08-Engineering-Execution/](./08-Engineering-Execution/) | [01-Architecture/](./01-Architecture/), [02-Security/](./02-Security/) |
| **Engineering Lead** | [01-Architecture/system-overview.md](./01-Architecture/system-overview.md) | [03-Ops/](./03-Ops/), [04-Product/](./04-Product/) |
| **VP Engineering / CTO** | [00-Executive-Summary/](./00-Executive-Summary/) | [06-Launch/](./06-Launch/), [05-Commercial/](./05-Commercial/) |
| **CEO / Board Member** | [00-Executive-Summary/executive-summary.md](./00-Executive-Summary/executive-summary.md) | [09-Investor-Materials/](./09-Investor-Materials/) |
| **Sales / Customer Success** | [07-Customer-Materials/](./07-Customer-Materials/) | [05-Commercial/](./05-Commercial/) |
| **Investor / Advisor** | [09-Investor-Materials/](./09-Investor-Materials/) | [00-Executive-Summary/](./00-Executive-Summary/) |
| **Beta Customer (IT Lead)** | [07-Customer-Materials/deployment-guide.md](./07-Customer-Materials/deployment-guide.md) | [07-Customer-Materials/faq.md](./07-Customer-Materials/faq.md) |

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────┐
│            CUSTOMER ENVIRONMENT              │
│                                              │
│   Teams Bot ──→ n8n Instance (self-hosted)   │
│   (Copilot Studio)   │                       │
│                       │ gRPC + HTTPS          │
└───────────────────────┼──────────────────────┘
                        │
              Cloudflare Tunnel (TLS 1.3 + mTLS)
                        │
┌───────────────────────┼──────────────────────┐
│         INTINC CONTROL PLANE (SaaS)          │
│                                              │
│   API Gateway ──→ Approval Engine            │
│       │              │                       │
│       ▼              ▼                       │
│   Run/Step DB    Audit Log (immutable)       │
│       │              │                       │
│       ▼              ▼                       │
│   Observability  Secrets Vault               │
│   (Prometheus,   (zero-knowledge)            │
│    Loki, Jaeger)                             │
└──────────────────────────────────────────────┘
```

**Core Principle:** Customer n8n instances execute workflows. Intinc control plane handles approvals, audit, policies, and observability. Secrets never leave the customer environment.

---

## Timeline Overview

| Phase | Weeks | Deliverables | Customers |
|-------|-------|-------------|-----------|
| **MVP** | 1–4 | 3 workflows, control plane, approval engine | 2 pilot |
| **Closed Beta** | 5–8 | +3 workflows, operational playbook, support SLA | 5–10 |
| **Open Beta** | 9–12 | +1 workflow (7 total), analytics, documentation | 15–30 |
| **Release Candidate** | 13–16 | Stabilization, security audit, GA prep | 30+ |
| **GA Launch** | 17+ | Full market availability | Unlimited |

## Revenue Model

| Tier | Price | Workflows | Target Margin |
|------|-------|-----------|---------------|
| Starter | $49/mo | 2 | 30% |
| Growth | $149/mo | 5–6 | 50% |
| Enterprise | $500+/mo | All 10 + custom | 54% |

**Y1 Target:** $300–500K ARR | **Beta Target (Week 16):** $8K MRR

---

*Built by Intinc. Designed for SMBs who deserve enterprise-grade automation without enterprise complexity.*
