# Timeline at a Glance — Ops Autopilot

> **Audience:** All | **Phase:** All

---

## Master Timeline (Weeks 1–20)

```
WEEK  1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17+
      ├────────────────┤├────────────────┤├────────────────┤├────────────────┤├──────
      │      MVP       ││  CLOSED BETA   ││   OPEN BETA    ││    RC PHASE    ││  GA
      │   (2 pilots)   ││  (5–10 cust)   ││  (15–30 cust)  ││   (30+ cust)   ││LAUNCH
      └────────────────┘└────────────────┘└────────────────┘└────────────────┘└──────

KEY MILESTONES:
  W1  ▲ Schema + API design locked
  W2  ▲ Approval engine + audit logging live
  W3  ▲ Azure AD + Slack + Jira connectors integrated
  W4  ▲ 3 workflows live with 2 pilot customers
  W5  ▲ First 5 beta customers onboarded
  W8  ▲ Closed beta retrospective, 6 workflows
  W11 ▲ All 7 workflows live
  W15 ▲ Go/No-Go decision meeting
  W17 ▲ Full GA launch
```

## Week-by-Week MVP (Weeks 1–4)

**Week 1: Foundation** — Schema finalized, 8 API endpoints designed, Supabase tables + RLS, OAuth2 authn, CI/CD pipeline (GitHub Actions → Vercel)

**Week 2: Approval + Security** — Approval engine (policy matching, TTL, resume/fail), secrets vault (AES-256, rotation, audit), immutable audit log (HMAC signing, append-only)

**Week 3: Connectors + n8n** — Azure AD connector (create/disable user, groups, password reset), Slack connector (approval modals), Jira connector (tickets), n8n provisioning (<10min)

**Week 4: Workflows + Testing** — Ticket Routing (6 steps, P95 <5s), Password Reset (3 steps, <2min e2e), Onboarding (7 steps, multi-approval), load testing, documentation

## Staffing Requirements

| Phase | Engineers | Support | Success | Total |
|-------|-----------|---------|---------|-------|
| MVP (W1–4) | 2 | 0 | 0 | 2 |
| Closed Beta (W5–8) | 2 | 1 | 0.5 | 3.5 |
| Open Beta (W9–12) | 3 | 2 | 1 | 6 |
| GA (W17+) | 3 | 3 | 2 | 8 |

## Decision Points

| Decision | When | Who | Criteria |
|----------|------|-----|----------|
| Approve MVP build | Week 0 | CEO/CTO | Budget, staffing, pilots |
| Expand to open beta | Week 8 | Product Lead | NPS >40, <5% churn |
| Go/No-Go for GA | Week 15 | Exec Team | Security audit passed, 99.5% uptime, NPS >50 |
