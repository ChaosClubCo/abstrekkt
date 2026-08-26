# AI SafeStart — Service Offering

## What It Is

A 4-week engagement that audits an organization's entire AI ecosystem, deploys role-specific AI configurations across all platforms, trains employees, and hands over a complete governance framework. The client owns everything when it's done.

## Who It's For

Mid-market B2B organizations (50-500 employees) that meet all three criteria:
1. **Using AI** — employees actively using 2+ AI platforms (Copilot, Claude, ChatGPT, Gemini, Cursor, etc.)
2. **No governance** — no formal framework governing which tools are used, by whom, with what data
3. **Aware of the risk** — at least one stakeholder (CIO, CISO, VP IT, CEO) recognizes shadow AI as a problem

### Sweet Spot
The ideal client is a 100-250 person company where AI adoption is organic (employees figured it out themselves), multi-platform (not a single-vendor Microsoft shop), and the CISO or CTO is starting to worry. They're past "should we use AI?" and stuck on "how do we govern what's already happening?"

### Not a Fit
- Companies under 20 employees (overkill — write a policy doc instead)
- Single-platform shops where IT already governs the tool (Copilot-only environments)
- Companies looking for AI strategy consulting (we don't tell you what to automate — we govern what you're already using)
- Companies that want a SaaS platform (we're a service, not software)

---

## The Problem in Numbers

| Reality | Data Point | Source |
|---------|-----------|--------|
| Employees use AI | 86% use AI tools weekly | Salesforce/IBM 2025 |
| Without permission | 38% share sensitive data with unapproved tools | IBM Shadow AI Report |
| On personal accounts | 68% access GenAI through personal accounts | Cisco AI Readiness |
| Nobody governs it | 90% of orgs have AI users, 40% bought subscriptions | Grip Security 2025 |
| The landscape is huge | 1,550+ distinct GenAI SaaS applications tracked | Grip Security |
| Blocking fails | 6 apps = 92.6% of data exposure, but 1,544 others exist | Grip Security |
| Breaches happen | 20% of organizations suffered shadow AI breaches | IBM/CIO surveys |
| They're expensive | $650K+ average additional cost per breach | IBM Cost of Data Breach 2025 |

**The core tension:** Blocking AI doesn't work — employees use personal accounts. The only viable strategy is providing enterprise-grade AI with guardrails that are better than what employees find on their own.

---

## What Gets Delivered

### Week 1 Outputs: Shadow AI Audit

**Tool Inventory Report** — Every AI tool in active use across the organization. Sanctioned and unsanctioned. Covers installed software, browser extensions, web app usage, personal account access, and API integrations. Delivered as a structured spreadsheet with per-tool risk scoring.

**Data Exposure Map** — Which departments are sharing what data sensitivity tier with which tools. Visualized as a flow diagram showing data movement from internal systems into AI platforms. Red/yellow/green classification per flow.

**Ecosystem Diagram** — Complete visual map of the organization's AI touchpoints: enterprise platforms (M365, Google Workspace, Salesforce), standalone tools (Claude, ChatGPT, Cursor, Jasper), personal accounts, and shadow tools. Shows connections, overlaps, and governance gaps.

**Department Interview Summaries** — Structured notes from interviews with each department head (or designated AI point person) capturing: current AI usage, perceived value, pain points, data handled, compliance concerns.

### Weeks 2-3 Outputs: Configuration Build

**Role-to-AI Configuration Matrix** — Master spreadsheet mapping every role in the organization to: approved tools, platform variant (Desktop/Web/CLI/API), data tier permissions, approved use cases, prohibited use cases, training requirements.

**Deployed AI Profiles** — Live, tested configurations in the client's actual platforms. Not documentation about what to configure — the actual configurations deployed and verified working. This includes:
- Claude Projects with custom instructions, skills, and connector access per role
- Copilot Studio agents configured per department workflow
- Gemini Enterprise configurations (if applicable)
- Tool-specific templates and prompt libraries per role

**Data Classification Framework** — Customized to the client's compliance requirements (SOC 2, HIPAA, GDPR, or industry-specific). Defines four tiers:
- Tier 1 (Public): Can enter any AI tool
- Tier 2 (Internal): Enterprise AI tools only, no personal accounts
- Tier 3 (Confidential): Specific enterprise tools with audit logging only
- Tier 4 (Restricted): No AI processing permitted

**Acceptable Use Policy** — Company-wide policy document. Not a generic template — customized to the client's industry, compliance posture, and specific tool ecosystem. Includes: approved tools list, data handling rules, incident reporting, consequences, and quarterly review cadence.

### Week 4 Outputs: Deploy & Handoff

**Employee Training Program** — Live workshops by department (not a company-wide session where marketing and engineering sit in the same room). Each workshop covers: their specific tools, their data rules, hands-on exercises with their deployed profiles, where to get help. All materials (slides, recordings, exercise sheets) handed to the client for future onboarding.

**Governance Playbook** — The operating manual for AI governance going forward. Includes:
- New employee AI onboarding checklist
- Quarterly audit cadence and methodology
- Tool evaluation criteria for future AI tools
- Incident response procedure (data entered into wrong tool)
- Escalation paths (who approves exceptions, who handles incidents)
- Annual policy review process

**Monitoring Framework** — Mechanism for detecting governance drift. Depending on the client's tooling:
- Microsoft Purview integration for M365 ecosystem
- Network-level SaaS discovery (if client has Zscaler, Netskope, etc.)
- Manual quarterly audit checklist (if no SaaS discovery tooling)
- Reporting template for presenting findings to leadership

**Complete Documentation** — Everything built, every decision made, every configuration deployed. Structured knowledge base the client can maintain independently. No tribal knowledge in our heads.

---

## What Makes This Different

**vs. DIY:** Your IT team knows one platform. We govern the ecosystem — Copilot + Claude + Cursor + personal ChatGPT + the 5 tools nobody told IT about.

**vs. Platform Vendors:** Microsoft configures Copilot. Google sets up Gemini. Neither audits your marketing team's Claude usage or your engineers' Cursor instances. We govern across all of them.

**vs. Big 4:** They spend 3-6 months and $50-150K to deliver a strategy deck. We deploy live configurations in 4 weeks for $15-50K. You own everything.

**vs. AI Governance SaaS:** We don't sell another tool to manage your tools. We implement governance as a human process backed by configurations, policies, and training.

---

## Engagement Entity

**Build phase (4 weeks):** Delivered under InVelo — "Build it. Use it. Retire it." The InVelo mission has a clear exit: audit complete, profiles deployed, training delivered, playbook handed off, mission retired.

**Managed services (optional, monthly):** Delivered under INT Inc. managed services. Shadow AI monitoring, new-hire onboarding, quarterly re-audits, profile updates as tools evolve. Same team, different engagement model. Client chooses whether to retain.
