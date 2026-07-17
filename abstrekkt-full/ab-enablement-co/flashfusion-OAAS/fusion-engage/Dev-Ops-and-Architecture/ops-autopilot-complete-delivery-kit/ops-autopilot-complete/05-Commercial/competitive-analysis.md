# Competitive Analysis

> **Audience:** SALES, EXEC | **Phase:** GA

---

## Competitive Matrix

| Dimension | Ops Autopilot | Zapier | Make | Power Automate | ServiceNow |
|-----------|---------------|--------|------|----------------|------------|
| **Price** | $49–500/mo | $20–100/mo | $9–100/mo | $15/user/mo | $50K+/yr |
| **Target** | SMB IT ops | Anyone | Anyone | Microsoft shops | Enterprise |
| **Approval workflows** | Built-in, HITL | None | None | Basic | Complex setup |
| **Audit trail** | Immutable, HMAC-signed | None | Basic logs | Basic | Enterprise-grade |
| **IT-specific workflows** | Pre-built (10) | Build yourself | Build yourself | Templates | Build with consultants |
| **Deployment** | Managed service | Self-service | Self-service | Self-service | 6-month project |
| **Security model** | Zero-knowledge secrets | Shared cloud | Shared cloud | Microsoft cloud | On-prem option |
| **Time to value** | 1 week | Hours (simple) | Hours (simple) | Weeks | 6+ months |
| **Support** | Managed (included) | Self-service | Self-service | Microsoft support | Premium ($$$) |

---

## Positioning Against Each Competitor

### vs Zapier / Make
**Their strength:** Easy to set up simple automations. Large connector library.
**Their weakness:** No approval workflows, no audit trail, no IT-specific templates, shared multi-tenant (security risk), no managed service.
**Our pitch:** "Zapier is great for marketing automations. For IT operations where you need approvals, audit trails, and security, you need Ops Autopilot."

### vs Power Automate
**Their strength:** Deep Microsoft integration, included in M365.
**Their weakness:** Complex to configure, per-user pricing gets expensive, limited approval customization, no zero-knowledge secrets.
**Our pitch:** "Power Automate is a platform. Ops Autopilot is a managed service. We give you working IT workflows in 1 week, not a tool that takes months to configure."

### vs ServiceNow
**Their strength:** Enterprise-grade, comprehensive ITSM platform.
**Their weakness:** $50K+ annual cost, 6-month implementation, requires dedicated admin, overkill for SMBs.
**Our pitch:** "ServiceNow is the right choice for 5,000+ employee enterprises. For SMBs, Ops Autopilot delivers 80% of the value at 5% of the cost."

---

## Our Moat

1. **Pre-built IT workflows:** Competitors are platforms; we're a solution. 10 workflows ready on day 1.
2. **Approval gates built-in:** Not an add-on. Every privileged action has human oversight.
3. **Zero-knowledge security:** Customer secrets never leave their environment. Unique in this space.
4. **Managed service:** We run it. Customer doesn't need an automation engineer.
5. **Immutable audit trail:** HMAC-signed, chain-hashed. Compliance-ready from day 1.

## Competitive Response Playbook

| Objection | Response |
|-----------|----------|
| "We already use Zapier" | "Does Zapier have approval workflows for creating Azure AD users? Does it have an immutable audit trail?" |
| "Power Automate is free with M365" | "Free to access, expensive to configure. How many hours has your team spent building and maintaining Power Automate flows?" |
| "ServiceNow does everything" | "Absolutely. For $50K+/year and 6 months of implementation. What's your budget?" |
| "We'll build it ourselves" | "Your team can build the automations. But who builds the approval engine, audit trail, security model, and maintains the connectors? That's 6–12 months of engineering." |
