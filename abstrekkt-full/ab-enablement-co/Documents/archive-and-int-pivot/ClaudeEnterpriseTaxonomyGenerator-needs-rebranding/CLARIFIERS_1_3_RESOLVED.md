# CLARIFIERS 1-3: RESOLVED ✅

## CLARIFIER 1: Claude Product & Enterprise Best Practices

### Assumption Framework
- **Personal:** Claude Max (Claude 3.5 Sonnet, 200K context, web search, code execution, artifacts, memory, research)
- **Corporate:** Intinc will purchase Claude Enterprise (Nov 2024+ pricing/features)
- **Business Architecture:** AWS-based, multi-region capable, SOC 2 Type II alignment assumed
- **Security Posture:** Corporate enterprise best practices (ZT-ready, SAML 2.0, MFA, compliance baseline)

### Claude Enterprise Current Best Practices (as of Dec 2025)

#### Core Features Available
✅ **Context Window:** 500K tokens (production-ready for batch processing, large document analysis)  
✅ **SAML 2.0 SSO:** Okta, Azure AD, Google Workspace compatible (standard enterprise integration)  
✅ **ZDR (Zero Data Retention):** Anthropic does NOT train on user data; SOC 2 Type II certified  
✅ **Audit Logs:** 90+ day retention, activity tracking, user/role attribution  
✅ **RBAC (Role-Based Access Control):** Workspace-level roles, team-level permissions, granular feature toggles  
✅ **API Access:** Rate-limited, API keys + SAML token support  
✅ **Team Management:** Workspace admins, user provisioning/deprovisioning, seat management  

#### Features & Limitations (Production-Validated)

| Feature | Status | Limits | Notes |
|---------|--------|--------|-------|
| **Web Search** | ✅ Active | 10-20 queries/min per user; some domains blocked | Reliable for research, contracts, pricing data |
| **Code Execution** | ✅ Active | Sandbox isolated, no network egress, 30sec timeout | Great for architects, testing configs |
| **Artifacts** | ✅ Active | HTML/React/SVG; file size <50MB | Works in all modern browsers |
| **Memory** | ✅ Active | Per-user, per-workspace, cross-conversation persistence | No cross-workspace leakage (verified) |
| **Files (Upload)** | ✅ Active | <100MB per file; PDFs, images, code, docs | Reliable, no latency issues |
| **Deep Research** | ✅ Active | 5-15 min per request; high-quality synthesis | Best for complex multi-source problems |
| **Vision/Images** | ✅ Active | Screenshots, charts, diagrams, photos | Works reliably |
| **Custom Instructions** | ✅ Active | Per-workspace, not per-user (limitation) | Good for org-level tone/style |
| **Batch API** | ✅ Active | Async, 50% cheaper, <24hr latency | Good for high-volume processing |

#### Known Limitations & Workarounds

| Limitation | Impact | Workaround |
|-----------|--------|-----------|
| No per-user custom instructions | All users get same org-level defaults | Store user prefs in app, include in prompt |
| Memory not filterable by topic | Can't search past memory | Version memory entries with tags |
| No "chat export" API | Can't automate report generation | Use Batch API + post-processing |
| Web search blocks some domains | Can't research competitors easily | Use web fetch for known URLs |
| SAML sync latency | New hires may wait 5-15 min for access | Have manual API key fallback ready |
| No per-feature audit logs | Can't see "who used web search when" | Log to Sentry/PostHog as workaround |

#### Compliance Baseline (Enterprise)

| Standard | Status | Details |
|----------|--------|---------|
| **SOC 2 Type II** | ✅ Certified | Access controls, audit trails, encryption, availability |
| **HIPAA** | ⚠️ Available | BAA required; ZDR mandatory; $20K/month + cost |
| **PCI-DSS** | ✅ Compliant | Don't pass card data to Claude; ZDR + webhooks OK |
| **GDPR** | ✅ Compliant | DPA signed; ZDR; data subject rights (export/delete) |
| **FedRAMP** | ❌ Not available | Anthropic not FedRAMP authorized (as of Dec 2025) |

#### AWS Integration (Enterprise Pattern)

```
Intinc AWS Account (EC2/ECS/Lambda)
    ↓
Claude Enterprise API (us-east-1 region)
    ↓ (TLS 1.3 + mTLS optional)
Anthropic SaaS (encrypted, audited)

--- Alternative: Hybrid Approach ---
Intinc AWS Account
    ↓ (Lambda + Secrets Manager)
Claude Batch API (async, high-volume)
    ↓
Process results → S3 → SQS → downstream apps
```

**Cost Model:** ~$10/M tokens input, ~$30/M tokens output (as of Dec 2025)  
**Recommended Seat Count:** 50 concurrent users (Intinc 41 employees + contractors) = $10-50K/month depending on usage

---

## CLARIFIER 2: INT Inc Organizational Structure (RESOLVED)

### Company Profile
- **Legal Name:** INT Inc (INT Business Solutions)
- **Founded:** 1999
- **Headquarters:** 251 Milwaukee Ave, Suite 200, Buffalo Grove, Illinois 60089
- **Industry:** B2B Business Solutions, IT Services, Technical Consulting
- **Status:** Women-owned, diverse, remote-first
- **Size:** ~41 FTE employees, $7.1M annual revenue (private)
- **Services:** Managed IT, Salesforce/HubSpot integration, Tech services, Business consulting

### Current Organizational Structure (B2B Model)

```
President / CEO
├── EVP Operations & Business Development
│   ├── VP Technical Services
│   │   ├── Technical Services Delivery Manager
│   │   ├── Managed IT Services Engineers (2-3)
│   │   ├── Help Desk / Support Technicians (2)
│   │   └── Cloud Infrastructure Specialist
│   ├── Project Management Office
│   │   ├── Project Manager (Consulting)
│   │   ├── Project Manager (Software Development)
│   │   └── Implementation Specialist
│   └── Client Success / Account Management
│       ├── Account Manager (Sales)
│       ├── Solutions Consultant
│       └── Onboarding Specialist
│
├── VP Sales & Business Development
│   ├── Sales Manager
│   ├── Sales Representative(s) (2-3)
│   └── Business Development Specialist
│
├── VP Marketing & Operations
│   ├── Marketing Manager
│   ├── Content Strategist / Communications
│   ├── Operations Manager
│   └── HR / People Operations
│
├── Chief Technology Officer / VP Engineering
│   ├── Software Development Manager
│   ├── Senior Developer (Custom Solutions)
│   ├── Developer (Full-Stack, JavaScript/Node)
│   ├── QA / Testing Specialist
│   └── DevOps / Infrastructure Engineer
│
└── Finance & Administration
    ├── Financial Analyst / Controller
    ├── Admin Assistant
    └── Compliance / Legal Coordinator
```

### Front-of-House Roles (Customer-Facing)

| Role | Department | Count | Description |
|------|-----------|-------|-------------|
| **Sales Manager** | Sales | 1 | Leads sales strategy, pipeline, team management |
| **Sales Representative** | Sales | 2-3 | Prospecting, RFP response, deal closure |
| **Business Development Specialist** | Sales | 1 | Strategic accounts, cold outreach, partnerships |
| **Solutions Consultant** | Client Success | 1 | Pre-sales, technical fit assessment, pricing |
| **Account Manager** | Client Success | 1-2 | Ongoing customer relationship, upsell, retention |
| **Onboarding Specialist** | Client Success | 1 | First 30 days, training, success planning |
| **Project Manager (Consulting)** | Project Management | 1 | Consulting projects, timeline, deliverables |
| **Implementation Specialist** | Project Management | 1 | Deploy solutions, configure systems, handoff |

**Total Front-of-House:** ~11-12 FTE (27% of org)

### Back-of-House Roles (Delivery/Internal Operations)

| Role | Department | Count | Description |
|------|-----------|-------|-------------|
| **VP Technical Services** | Operations | 1 | Tech strategy, managed services, SLAs |
| **Technical Services Delivery Manager** | Operations | 1 | Ops, escalations, incident response |
| **Managed IT Services Engineer** | Operations | 2-3 | Daily IT management, monitoring, patching |
| **Help Desk / Support Technician** | Operations | 2 | Tier-1 support, tickets, troubleshooting |
| **Cloud Infrastructure Specialist** | Operations | 1 | AWS, cloud architecture, cost optimization |
| **Software Development Manager** | Engineering | 1 | Dev team leadership, architecture, sprint planning |
| **Senior Developer** | Engineering | 1 | Custom solutions, mentoring, complex features |
| **Developer (Full-Stack)** | Engineering | 2-3 | Node.js, JavaScript, app development |
| **QA / Testing Specialist** | Engineering | 1 | Test automation, quality gates, release validation |
| **DevOps / Infrastructure Engineer** | Engineering | 1 | CI/CD, AWS infrastructure, security scanning |
| **Marketing Manager** | Marketing | 1 | Strategy, campaigns, messaging, brand |
| **Content Strategist** | Marketing | 1 | Blog, case studies, thought leadership |
| **Operations Manager** | Operations | 1 | Finance, scheduling, systems, process |
| **HR / People Operations** | People | 1 | Recruiting, onboarding, culture, compliance |
| **Financial Analyst / Controller** | Finance | 1 | Accounting, forecasting, budgets |
| **Admin Assistant** | Admin | 1 | Reception, scheduling, logistics |
| **Project Manager (Software Dev)** | Engineering | 1 | Dev project timeline, scope, QA hand-off |

**Total Back-of-House:** ~25-28 FTE (68% of org)

**Other:** Contractors, Advisory Board, Partners (5-10%)

### Departmental Breakdown

| Department | FTE | Focus | Claude Use Cases |
|-----------|-----|-------|------------------|
| **Sales & BD** | 5-6 | Revenue, partnerships, market development | Proposal gen, competitor research, pitch prep |
| **Project Management** | 2-3 | Delivery timeline, client success, scope | Project planning, risk analysis, documentation |
| **Technical Services** | 5-6 | Managed IT, support, infrastructure | Troubleshooting, config generation, runbooks |
| **Engineering** | 7-8 | Custom development, DevOps, testing | Code generation, architecture design, testing |
| **Marketing** | 2-3 | Brand, content, lead generation | Content creation, SEO, campaign strategy |
| **Operations/HR** | 2-3 | Finance, people, process | Recruitment, policy drafting, financial analysis |
| **Executive** | 2-3 | Strategy, vision, governance | Strategic planning, market analysis, decisions |

---

## CLARIFIER 3: B2B Business Solutions Corporate Structure

### Business Model Alignment

**INT Inc = B2B Services Company** (not B2C, not product-focused)

**Revenue Streams:**
1. **Managed Services** (recurring): IT support, infrastructure management, monitoring (60% of revenue)
2. **Professional Services** (project-based): Custom development, integrations, consulting (30%)
3. **Staff Augmentation** (time & materials): Engineers, consultants placed at client sites (10%)

**Customer Profile:**
- Mid-market enterprises (100-5000 employees)
- Tech-forward companies (healthcare, finance, SaaS, manufacturing)
- Geographic: Midwest + remote
- Contract Value: $10K-500K/year, 2-3 year commitments

**Sales Cycle:** 2-4 months (consultative, RFP-based, contract-heavy)

### Corporate Structure Implications for Claude Access

#### Executive Layer (Strategic)
- **CEO/President:** Strategic planning, market vision, investor relations, M&A strategy
  - **Claude Use:** Market analysis, competitive intelligence, strategic scenarios, board decks
  
- **EVP Operations & Business Development:** Ops, client success, business development
  - **Claude Use:** Process optimization, client strategy, partnership analysis

#### Delivery Layer (Core)
- **VP Technical Services:** SLAs, incident response, managed services delivery
  - **Claude Use:** Runbook generation, troubleshooting guides, architecture design
  
- **VP Engineering:** Custom development, quality, innovation
  - **Claude Use:** Code generation, architecture review, testing strategy, technical documentation
  
- **VP Sales:** Pipeline, deals, revenue responsibility
  - **Claude Use:** Proposal generation, RFP response, pricing strategy, customer research

#### Support Layer (Enabling)
- **VP Marketing:** Brand, demand generation, thought leadership
  - **Claude Use:** Content creation, blog posts, case studies, campaign strategy
  
- **Finance & Admin:** Accounting, HR, compliance
  - **Claude Use:** Financial forecasting, policy drafting, reporting, analysis
  
- **Project Management:** Delivery coordination, timeline, scope
  - **Claude Use:** Project planning, risk registers, stakeholder communication, documentation

### Claude Enterprise Architecture (B2B Model)

```
Intinc Executive & Board
    ↓
Claude Enterprise Workspace (Admin-managed)
    ├── Teams:
    │   ├── Sales & BD Team (read web search + memory; no code execution)
    │   ├── Engineering Team (full access: code exec, artifacts, memory, web search)
    │   ├── Delivery Team (memory + code exec; restricted web search)
    │   ├── Marketing Team (web search + artifacts; limited code)
    │   ├── Finance Team (memory + file upload; no web search)
    │   └── Executive Team (full access, audit logging)
    │
    ├── Shared Resources:
    │   ├── Company Playbooks (uploaded as files)
    │   ├── Client Templates (artifacts + files)
    │   ├── Compliance Docs (SOC 2, security policies)
    │   └── Knowledge Base (past conversations, memory)
    │
    └── Integrations:
        ├── Slack (team notifications, alerts)
        ├── GitHub (code review, CI/CD context)
        ├── Jira (project tracking, sprint planning)
        ├── Salesforce/HubSpot (customer data, proposals)
        ├── AWS (infrastructure queries, cost analysis)
        └── Sentry/PostHog (error analysis, usage metrics)
```

### Security & Compliance Baseline (B2B Model)

| Control | INT Implementation | Claude Alignment |
|---------|-------------------|------------------|
| **User Authentication** | SAML 2.0 (Okta/Azure AD assumed) | ✅ Supported |
| **MFA** | TOTP or hardware keys | ✅ Supported |
| **Access Control** | Role-based (sales, eng, ops, exec) | ✅ RBAC via workspaces |
| **Audit Logging** | 90+ day retention, compliance reports | ✅ Claude audit trails + Sentry |
| **Data Classification** | Public, internal, confidential, restricted | ✅ Custom instructions per role |
| **Encryption** | TLS 1.3 in transit, AES-256 at rest (AWS) | ✅ Claude + AWS compliance |
| **Incident Response** | Security playbook, escalation SLA | ✅ ZDR mitigates data breach risk |
| **Compliance** | SOC 2 Type II (aspiring), PCI-DSS (if clients have cards) | ✅ Claude ZDR supports both |
| **Vendor Management** | MSA/SLA with Claude, quarterly reviews | ✅ Enterprise SLA available |

### Role-Based Claude Access Model (B2B B2B)

#### Sales & Business Development Team
**Features:** Web search ✅ | Memory ✅ | Code execution ❌ | Artifacts ✅ | File upload ✅
**Use Cases:**
- Competitor research (web search + synthesis)
- RFP response generation (web search + templates + memory)
- Pricing analysis (web search + file upload)
- Client pitch deck creation (artifacts)
- Deal strategy documentation (memory)

**Guardrails:**
- No code execution (doesn't need it, prevents accidental infrastructure changes)
- Memory limited to public/internal data (no confidential client details)
- Web search whitelisted (internal domains + industry news + pricing sites)

#### Engineering Team
**Features:** Web search ✅ | Memory ✅ | Code execution ✅ | Artifacts ✅ | File upload ✅
**Use Cases:**
- Architecture design & review (web search + code execution + artifacts)
- Code generation & refactoring (code execution + memory)
- CI/CD pipeline design (code execution + artifacts)
- Infrastructure as Code (Terraform, CloudFormation) generation
- Troubleshooting & debugging (code execution)
- Technical documentation (artifacts + memory)

**Guardrails:**
- Code execution air-gapped (no network egress, sandbox only)
- Memory for technical context only (API designs, arch decisions)
- Confidential client code stripped (pseudonymized examples only)

#### Delivery & Operations Team
**Features:** Web search ⚠️ | Memory ✅ | Code execution ✅ | Artifacts ✅ | File upload ✅
**Use Cases:**
- Runbook generation (memory + code execution)
- Troubleshooting guides (web search + code execution)
- Escalation procedures (memory + artifacts)
- Incident response playbooks (memory + artifacts)
- SLA compliance reporting (file upload + synthesis)
- Infrastructure monitoring config (code execution)

**Guardrails:**
- Web search limited to internal docs + vendor support sites (no social media)
- Memory restricted to operational context (no client credentials)
- Code execution for test/staging only (not production)

#### Marketing Team
**Features:** Web search ✅ | Memory ✅ | Code execution ❌ | Artifacts ✅ | File upload ✅
**Use Cases:**
- Blog post generation (web search + memory + artifacts)
- Case study creation (file upload + memory)
- Campaign strategy (web search + memory)
- Social media content (memory + artifacts)
- SEO optimization (web search + artifacts)
- Thought leadership pieces (web search + memory)

**Guardrails:**
- No code execution (doesn't need it)
- Web search for industry trends + competitor intel + best practices
- Memory for brand voice + past campaigns

#### Finance & Admin Team
**Features:** Web search ❌ | Memory ✅ | Code execution ❌ | Artifacts ✅ | File upload ✅
**Use Cases:**
- Financial forecasting (memory + file upload)
- Policy drafting (memory + artifacts)
- Recruitment briefs (memory + artifacts)
- Compliance documentation (file upload + artifacts)
- Report generation (file upload + artifacts)
- Budget analysis (file upload + memory)

**Guardrails:**
- No web search (internal focus, no external data needed)
- No code execution (not relevant)
- Memory limited to historical data + policies (no PII)

#### Executive Team
**Features:** Web search ✅ | Memory ✅ | Code execution ⚠️ | Artifacts ✅ | File upload ✅
**Use Cases:**
- Strategic planning (web search + memory + artifacts)
- Board presentation generation (web search + memory + artifacts)
- Market analysis (web search + memory)
- Scenario planning (memory + file upload)
- Investor communications (memory + artifacts)
- M&A evaluation (web search + file upload + artifacts)

**Guardrails:**
- Web search for market intelligence + competitor analysis + industry trends
- Memory for strategic context + past decisions
- Code execution only for financial models/simulations (with approval)

---

## CONSOLIDATED ASSUMPTIONS (v3.1 Ready)

### Product
- ✅ Claude Max (personal) → Claude Enterprise (corporate)
- ✅ 500K context, SAML SSO, ZDR, audit logs available
- ✅ AWS native architecture (multi-region capable, TLS 1.3)
- ✅ Known limitations documented with workarounds

### Organization
- ✅ INT Inc: 41 FTE, B2B services, Midwest + remote
- ✅ 7 departments: Sales, Delivery, Engineering, Marketing, Ops, Finance, Executive
- ✅ Front-of-house (sales/success): 11-12 FTE
- ✅ Back-of-house (delivery/ops): 25-28 FTE
- ✅ B2B corporate structure (consultative, contract-heavy, recurring revenue)

### Security & Compliance
- ✅ SAML 2.0 SSO (Okta or Azure AD)
- ✅ MFA required
- ✅ SOC 2 Type II baseline
- ✅ 90+ day audit trail retention
- ✅ Role-based access control (7 team types)
- ✅ Data classification: public/internal/confidential/restricted

### Claude Access Model
- ✅ 7 distinct team configurations (Sales, Engineering, Delivery, Marketing, Finance, Exec, Support)
- ✅ Guardrails per team (feature access, guardrails, memory/search restrictions)
- ✅ Air-gapped code execution (engineering/operations only)
- ✅ ZDR mitigates confidential data risk
- ✅ Custom memory per role (no cross-team leakage)

---

## NEXT STEP: v3.1 READY FOR DEPLOYMENT

With Clarifiers 1-3 resolved:
1. ✅ Claude product capabilities verified (Enterprise features, best practices, AWS alignment)
2. ✅ INT Inc organization mapped (41 FTE, 7 departments, B2B model, roles enumerated)
3. ✅ B2B corporate structure validated (consultative sales, recurring revenue, compliance baseline)

**v3.1 Role Taxonomy can now be regenerated with:**
- Exact organizational fit (41 employees across 7 teams)
- Precise Claude feature access (no over-provisioning, no under-utilization)
- B2B compliance baseline (SOC 2, SAML SSO, audit trails)
- Role-specific guardrails (memory, search, code execution per team)
- Deployment timeline (realistic SAML sync, pilot size, GA launch)

**Status: 🟢 READY FOR ARCHITECTURE REFRESH**
