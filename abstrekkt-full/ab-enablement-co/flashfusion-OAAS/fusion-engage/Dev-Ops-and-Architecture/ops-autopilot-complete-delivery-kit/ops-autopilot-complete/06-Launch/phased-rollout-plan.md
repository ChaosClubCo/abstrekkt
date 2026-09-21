# Phased Rollout Plan

> **Audience:** LEAD | **Phase:** ALL

---

## Wave 1: MVP (Weeks 1–4)
**Scope:** Control plane + 3 workflows + 2 pilot customers
**Workflows:** Ticket Routing, Password Reset, Onboarding
**Customers:** 2 hand-picked (warm leads, Azure AD + Slack stack)
**Risk:** Technical — connectors may have unexpected behavior
**Mitigation:** Daily check-ins with pilots, 2-day buffer in timeline

## Wave 2: Closed Beta (Weeks 5–8)
**Scope:** +3 workflows + 5–10 customers
**Workflows:** Offboarding, License Provisioning, VPN Access
**Customers:** Selected by criteria (see beta-customer-selection.md)
**Risk:** Support capacity — more customers = more issues
**Mitigation:** Hire support engineer (Week 5), daily standups

## Wave 3: Open Beta (Weeks 9–12)
**Scope:** +1 workflow + 15–30 customers + self-service onboarding
**Workflows:** Security Incident Response
**Customers:** Open signup with qualification form
**Risk:** Quality — self-service means less hand-holding
**Mitigation:** Comprehensive docs, video tutorials, automated onboarding checks

## Wave 4: GA (Week 17+)
**Scope:** All 10 workflows, unlimited customers
**Gating:** Phased rollout — 50 customers first week, 100 next, then unlimited
**Risk:** Scale — infrastructure under real load
**Mitigation:** Load testing at Week 15, auto-scaling, kill-switch ready
