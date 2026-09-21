# Frequently Asked Questions

> **Audience:** CUST | **Phase:** Beta

---

## General

**What is Ops Autopilot?**
A managed automation platform that eliminates repetitive IT tasks — ticket routing, password resets, employee onboarding/offboarding — through pre-built workflows with approval gates and immutable audit trails.

**How is this different from Zapier or Make?**
Zapier and Make are general-purpose automation tools. Ops Autopilot is purpose-built for IT operations with features they lack: human-in-the-loop approvals, zero-knowledge secret management, immutable audit logs, and pre-built IT workflows.

**Do I need to write code?**
No. Workflows are pre-built and configured by Intinc during onboarding. You configure connectors (Azure AD, Slack, etc.) by entering credentials in the n8n interface.

## Security

**Does Intinc see my passwords or API keys?**
Never. Your secrets are stored in your n8n instance (encrypted AES-256). Intinc's control plane only stores SHA-256 hashes for rotation tracking. We call this "zero-knowledge" secrets management.

**Where does my data live?**
Your data stays in your environment. The n8n instance runs on your infrastructure. Intinc's control plane stores only workflow status, approval decisions, and audit logs — never your business data, PII, or credentials.

**Is the audit trail tamper-proof?**
Yes. Every audit entry is HMAC-SHA256 signed and chain-hashed (each entry references the previous one). The audit table is append-only — even database admins cannot modify or delete entries.

**What happens if Intinc is breached?**
An attacker would get workflow metadata (run status, timing) and secret hashes. They cannot recover your actual credentials from SHA-256 hashes, and they have no access to your n8n instance.

## Operations

**What do I need to host?**
A Docker-capable server (VM, container host, or on-prem) with 2–4GB RAM and outbound HTTPS access. We provide the Docker Compose template.

**How long does setup take?**
Typical onboarding: 5 business days. Day 1: kickoff. Days 2–3: infrastructure. Day 4: configuration + testing. Day 5: soft launch.

**What if my n8n instance goes down?**
Intinc's control plane detects the outage within 5 minutes, pauses all workflows, and alerts both you and our support team. When the instance is restored, paused workflows automatically resume.

**Can I run multiple workflows simultaneously?**
Yes. Starter: 10 concurrent, Growth: 50, Enterprise: 200. Each workflow runs independently.

**What happens if an approver doesn't respond?**
After 50 minutes, a reminder is sent. At 60 minutes, the approval escalates to the next person in the chain. At 90 minutes, the request is auto-rejected and the initiator is notified.

## Pricing

**Can I upgrade mid-month?**
Yes. Upgrades are prorated. You pay the difference for the remaining days in the billing cycle.

**Is there a contract?**
Month-to-month by default. Annual billing available at 15% discount. No setup fees during beta.

**What's included in the price?**
Workflows, approval engine, audit logging, dashboard, and support per your tier. n8n hosting is your responsibility (typically $20–50/month for a VM).

## Compliance

**Is Ops Autopilot SOC2 compliant?**
We're SOC2 Type II audit-ready with 85% of controls documented. Formal audit engagement planned for 6 months post-GA.

**Does this help with GDPR?**
Yes. Data minimization (we store only hashes and metadata), right to access (you can query all your data), right to erasure (we can delete your data on request), and breach notification (72-hour procedure in place).

**Can I get an audit report?**
Enterprise tier includes automated monthly compliance reports. Growth tier can request on-demand reports via support.
