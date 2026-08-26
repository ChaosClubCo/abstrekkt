# AI SafeStart — Delivery Methodology

## Engagement Timeline (Growth Tier: 50-150 Employees)

Total: 4 weeks, ~160 hours allocated. Adjust ±25% for Starter/Enterprise tiers.

---

## Week 1: Shadow AI Audit (40 hours)

### Day 1-2: Discovery Setup (16 hours)

**Kickoff Meeting (2 hours)**
- Attendees: Sponsor (CIO/CTO), IT lead, CISO (if exists), Kyle
- Agenda: Scope confirmation, access requirements, department contact list, compliance requirements, timeline commitments
- Output: Signed engagement brief, access credentials, department interview schedule

**Network-Level Discovery (8 hours)**
- If client has SaaS discovery tooling (Zscaler, Netskope, Grip Security, Microsoft Defender for Cloud Apps): Pull usage reports for GenAI domains
- If client lacks discovery tooling: Manual audit using DNS logs, proxy logs, or browser extension inventory
- Tools: Client's existing CASB/DLP tools, manual DNS log analysis, SaaS management platform if available
- Output: Raw tool usage data — every AI-related domain accessed in last 90 days

**IT Environment Inventory (6 hours)**
- Licensed AI tools (M365 Copilot licenses, Salesforce AI, Google Gemini Enterprise)
- Approved browser extensions
- API keys provisioned for AI services
- SSO-integrated AI tools vs. standalone accounts
- Tools: Client's IAM system, license management, SSO dashboard
- Output: Sanctioned tool inventory with license counts and access lists

### Day 3-4: Department Interviews (16 hours)

**Interview Structure (45 min each, 8-12 departments)**
- Template questions:
  1. What AI tools does your team use? (both official and "I just use it on my phone")
  2. What types of work do you use AI for? (specific tasks, not "everything")
  3. What data do you typically paste/upload into AI tools?
  4. Have you or your team created any custom GPTs, Claude Projects, or agents?
  5. What AI tools have you tried and stopped using? Why?
  6. What would the ideal AI setup look like for your team?
  7. Any incidents or close calls with AI and sensitive data?
- Output: Structured interview notes per department, captured in consistent format

**Shadow Tool Identification (concurrent)**
- Cross-reference network discovery with interview findings
- Identify gaps: tools IT doesn't know about, personal accounts, browser-based tools
- Output: Shadow AI inventory — unsanctioned tools with usage frequency and department

### Day 5: Analysis & Report (8 hours)

**Risk Scoring Matrix**
- Each tool scored on: data sensitivity of typical inputs × usage frequency × governance gap × compliance impact
- Scale: 1-5 per dimension, composite score determines priority
- Output: Prioritized risk matrix spreadsheet

**Audit Report Assembly**
- Tool Inventory Report (sanctioned + unsanctioned)
- Data Exposure Map (department → data → tool flows)
- Ecosystem Diagram (visual map of all AI touchpoints)
- Risk Score Matrix (prioritized action items)
- Department Interview Summaries (structured notes)
- Output: Week 1 deliverable package — presented to sponsor in 60-min readout

**Week 1 Readout Meeting (1 hour)**
- Present findings to sponsor + IT lead
- Validate shadow tools discovered (sometimes there are explanations)
- Confirm priority order for Week 2-3 configuration work
- Get sign-off to proceed

---

## Weeks 2-3: Configuration Build (80 hours)

### Phase 2A: Framework Design (Week 2, Days 1-3, 24 hours)

**Data Classification Framework (8 hours)**
- Map client's existing data policies to four-tier AI classification
- Customize tiers to industry compliance (SOC 2 / HIPAA / GDPR / PCI-DSS)
- Define per-tier rules: which tools, which features, audit requirements
- Tools: Client's compliance documentation, industry frameworks
- Output: Data Classification Framework document — customized, not templated

**Role-to-AI Configuration Matrix (12 hours)**
- Map every role in org chart to:
  - Approved tools (which AI platforms)
  - Platform variant (Claude Desktop vs Web vs Code, Copilot in Teams vs standalone)
  - Data tier (what they can share with AI)
  - Feature access (code execution, web search, file upload, computer use)
  - Connector/integration access (which MCP servers, which data sources)
  - Use case library (3-5 approved use cases per role with examples)
- Tools: Org chart, HR role definitions, department interview notes
- Output: Master spreadsheet — the blueprint for all configurations

**Acceptable Use Policy (4 hours)**
- Draft company-wide AI acceptable use policy
- Customize to findings: address specific shadow tools discovered, data handling by department
- Include: approved tools, data rules, incident reporting, consequences, review cadence
- Tools: Client's existing policies, industry templates as starting point
- Output: Policy document ready for legal review

### Phase 2B: Configuration Deployment (Week 2 Day 4 through Week 3 Day 4, 48 hours)

**Claude Configurations (if applicable, 12-16 hours)**
- Create Claude Projects per department/role cluster
- Write custom instructions (system prompts) tailored to each role's workflows
- Configure skills packages per role
- Set up connector access (MCP servers) appropriate to role permissions
- Build prompt libraries and workflow templates per department
- Tools: Claude.ai interface, Claude Code CLI for bulk operations
- Output: Live, tested Claude configurations per role cluster

**Copilot Configurations (if applicable, 12-16 hours)**
- Configure Copilot Studio agents per department workflow
- Set up SharePoint knowledge bases for department-specific context
- Configure Teams integrations and meeting assistant settings
- Set DLP policies in Microsoft Purview for AI interactions
- Tools: Microsoft Admin Center, Copilot Studio, Purview
- Output: Live Copilot agents and policies per department

**Other Platform Configurations (as applicable, 8-12 hours)**
- Google Gemini Enterprise: Workspace integrations, data access controls
- Salesforce Agentforce: Prompt Builder templates, custom actions
- Standalone tools: API key management, SSO integration where possible
- Tools: Platform-specific admin consoles
- Output: Configured and tested per the role matrix

**Cross-Platform Governance Layer (8 hours)**
- Ensure consistent data classification enforcement across all platforms
- Verify role permissions are coherent (e.g., if a role can't share Tier 3 data with Claude, they also can't share it with Copilot)
- Document any platform-specific exceptions or limitations
- Output: Cross-platform governance verification checklist — signed off

### Phase 2C: Validation (Week 3, Day 5, 8 hours)

**Configuration Testing**
- Test each role cluster's configuration with realistic scenarios
- Verify data classification enforcement (attempt to paste Tier 3 data — confirm it's blocked or flagged)
- Verify cross-platform consistency
- Document any exceptions or workarounds
- Output: Test results log, issues resolved, exceptions documented

---

## Week 4: Deploy & Handoff (40 hours)

### Days 1-3: Training (24 hours)

**Department Workshops (3-4 hours each, 4-6 sessions)**
- Schedule per department or role cluster (never whole-company)
- Agenda per workshop:
  1. What changed and why (10 min)
  2. Your specific AI tools and configurations (20 min)
  3. Hands-on exercises with your deployed profiles (60 min)
  4. Data rules — what goes where (15 min)
  5. Where to get help, how to request exceptions (10 min)
  6. Q&A (15 min)
- Materials: Slide deck, exercise sheets, quick-reference card per role
- All materials given to client for future use

**Admin Training (4 hours)**
- IT team + designated AI governance owner
- How to: add new employees to AI profiles, modify configurations, run quarterly audits
- Tools walkthrough: admin consoles, monitoring dashboards, reporting
- Output: Admin trained, documented procedures

### Days 4-5: Handoff (16 hours)

**Governance Playbook Assembly (8 hours)**
- Compile all documentation into structured knowledge base
- New hire onboarding checklist
- Quarterly audit procedure (step-by-step, not abstract)
- Tool evaluation criteria for future AI additions
- Incident response procedure
- Annual policy review checklist

**Final Readout (2 hours)**
- Present to sponsor + IT lead + CISO
- Review: what was found, what was built, what was trained, what's handed off
- Confirm: client has access to everything, understands maintenance procedures
- Sign-off: engagement complete, mission retired

**Documentation & Cleanup (6 hours)**
- Final documentation pass — ensure no gaps
- Remove any temporary access (consultant accounts, shared credentials)
- Transfer all files to client's preferred knowledge base (SharePoint, Confluence, Notion, etc.)
- Output: Complete documentation package, all access transferred

---

## Tools & Infrastructure Used

### Discovery & Audit
| Tool | Purpose | Provided By |
|------|---------|-------------|
| Client's CASB/DLP (Zscaler, Netskope, etc.) | SaaS discovery, usage analytics | Client |
| Microsoft Defender for Cloud Apps | Shadow IT discovery for M365 shops | Client |
| DNS/proxy logs | Network-level AI tool detection | Client |
| Structured interview template | Department AI usage capture | FlashFusion |
| Risk scoring spreadsheet | Prioritization framework | FlashFusion |

### Configuration
| Tool | Purpose | Provided By |
|------|---------|-------------|
| Claude.ai / Claude Code CLI | Claude profile configuration | FlashFusion |
| Microsoft Admin Center / Copilot Studio | M365 AI configuration | Client access |
| Google Admin Console | Gemini Enterprise configuration | Client access |
| Salesforce Setup / Agentforce | CRM AI configuration | Client access |

### Documentation & Training
| Tool | Purpose | Provided By |
|------|---------|-------------|
| Markdown + PDF export | Policies, playbooks, documentation | FlashFusion |
| Slide deck tool | Training presentations | FlashFusion |
| Client's knowledge base (SharePoint, Confluence, etc.) | Final documentation home | Client |

---

## Staffing Model

### Year 1: Kyle-Led
| Role | Person | Hours/Engagement |
|------|--------|-----------------|
| Lead Architect / PM | Kyle | 80-100 hours |
| Platform Specialist (M365/Copilot) | INT M365 engineer (if needed) | 20-40 hours |
| Platform Specialist (Google/Salesforce) | Partner or INT engineer | 10-20 hours (if applicable) |
| Total | | 110-160 hours |

### Year 2: Scaled
- Train 2-3 INT engineers in methodology → 3-4 concurrent engagements
- Kyle shifts to QA/oversight on 50% of engagements

### Year 3: Productized
- Methodology documented as repeatable playbook
- Partner network delivers, FlashFusion/INT certifies
- Kyle focuses on enterprise tier and methodology evolution
