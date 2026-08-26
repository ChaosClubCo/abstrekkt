# Workflow Catalog — Ops Autopilot

> **Audience:** ALL | **Phase:** ALL

---

## 10-Workflow Catalog

| # | Workflow | Phase | Steps | Approvals | Connectors | Effort |
|---|---------|-------|-------|-----------|------------|--------|
| 1 | Ticket Routing & Escalation | MVP (W4) | 6 | Escalation only | Jira, Slack, Teams | 2 days |
| 2 | Self-Service Password Reset | MVP (W4) | 3 | None (identity verification) | Azure AD, Slack, SMS | 1 day |
| 3 | Employee Onboarding | MVP (W4) | 7 | Manager + HR | Azure AD, Okta, Slack, Teams, Jira | 3 days |
| 4 | Employee Offboarding | Beta W5–8 | 8 | Manager + Security | Azure AD, Okta, Slack, Teams, Jira | 3 days |
| 5 | Software License Provisioning | Beta W5–8 | 7 | Manager (+ finance if >$500) | Okta, Slack, Email | 2 days |
| 6 | VPN Access Provisioning | Beta W5–8 | 6 | Manager + Security Officer | FortiNet/custom, Azure AD, Slack | 2 days |
| 7 | Security Incident Response | Open Beta W9–12 | 8 | Auto (containment) + Security Officer (forensics) | Azure AD, Okta, Slack, Jira, Email | 3 days |
| 8 | Cost Allocation Reporting | GA W17+ | 5 | Auto | Finance API, Email | 2 days |
| 9 | Compliance Evidence Collection | GA W17+ | 6 | Compliance Officer | Jira, Azure AD, Okta, Email | 2 days |
| 10 | Custom Workflow (template) | Enterprise | Varies | Configurable | Any | 3–10 days |

---

## Workflow-to-Tier Mapping

| Tier | Price | Included Workflows |
|------|-------|--------------------|
| Starter ($49) | 2 | Ticket Routing, Password Reset |
| Growth ($149) | 5–6 | + Onboarding, Offboarding, License Provisioning, (VPN optional) |
| Enterprise ($500+) | All 10 | + Security Incident, Cost Allocation, Compliance, Custom |

---

## Workflow Complexity Tiers

**Simple (1–3 steps, no approval):** Password Reset
**Standard (4–6 steps, single approval):** Ticket Routing, License Provisioning, VPN Access
**Complex (7+ steps, multi-approval):** Onboarding, Offboarding, Security Incident, Compliance

---

## Cross-Workflow Dependencies

```
Onboarding creates → accounts used by License Provisioning, VPN Access
Offboarding revokes → accounts created by Onboarding
Security Incident → may trigger Emergency Offboarding
Ticket Routing → may escalate to any other workflow
Compliance Evidence → queries audit logs from all workflows
```

---

## Trigger Types

| Trigger | Workflows | How |
|---------|-----------|-----|
| Teams Bot (user request) | Ticket Routing, Password Reset | Employee sends message |
| Teams Bot (manager request) | Onboarding, Offboarding | Manager fills form |
| Slack command | Password Reset, VPN Access | `/ops-reset-password` |
| Scheduled (cron) | Cost Allocation, Compliance | Monthly/weekly |
| Webhook (external) | Security Incident | SIEM/MDR integration |
| API call | Any | Custom integration |
