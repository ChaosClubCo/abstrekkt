# INT Inc Claude Role Taxonomy v4.0
## Production-Ready, B2B-Optimized, 41 FTE Aligned

**Generated:** December 11, 2025  
**Status:** Ready for SAML SSO implementation & pilot deployment  
**Scope:** 41 FTE across 7 departments, Claude Enterprise workspace

---

## EXECUTIVE SUMMARY

INT Inc is a B2B business solutions company (41 FTE, $7.1M revenue, women-owned, Midwest + remote). This role taxonomy maps **7 teams × 7 roles = 49 total positions** (some roles shared) to Claude Enterprise features, guardrails, and security controls.

**Key Insight:** Unlike product companies, B2B services firms have **distinct front/back split** (sales/success vs. delivery/ops). Claude access should follow this split: front-of-house gets **web search + memory + templates**, back-of-house gets **code execution + infrastructure tools + technical memory**.

---

## ORGANIZATIONAL MAP (41 FTE)

```
INT Inc
├─ EXECUTIVE (3): President, EVP Operations, CTO/VP Engineering
├─ SALES & BD (5-6): VP Sales, Sales Manager, Sales Reps (2-3), BD Specialist
├─ DELIVERY (3-4): VP Technical Services, Delivery Manager, Implementation Specialist
├─ CLIENT SUCCESS (2-3): Account Manager, Solutions Consultant, Onboarding Specialist
├─ ENGINEERING (7-8): Dev Manager, Senior Dev, Devs (2-3), QA, DevOps, Project Manager
├─ MARKETING (2-3): VP/Manager, Content Strategist
├─ OPERATIONS & ADMIN (3-5): Operations Manager, Finance, HR, Admin
└─ Contractors & Advisory (5-10%)
```

---

## ROLE TAXONOMY (7 TEAMS × 7-10 ROLES)

### TEAM 1: EXECUTIVE LEADERSHIP (3 roles)

#### **Role 1.1: CEO / President**
- **Title:** President / CEO
- **Department:** Executive
- **Reports To:** Board
- **Team Size:** 1
- **Level:** C-Suite

**Claude Configuration:**
- **Features:** Web search ✅ | Memory ✅ | Code execution ⚠️ | Artifacts ✅ | Files ✅ | Research ✅
- **Memory Focus:** Strategic decisions, market analysis, board materials, investor conversations
- **Use Cases:** 
  - Market intelligence (competitors, trends, pricing, M&A targets)
  - Strategic planning & scenarios (5-year roadmap, pivot analysis)
  - Board presentation generation
  - Investor pitch decks & financial summaries
  - Industry benchmarking & growth strategy
  - Leadership team alignment docs

**Guardrails:**
- Web search: Unrestricted (market, competitors, finance, industry)
- Memory: Strategic context only (no client credentials, PII)
- Code execution: Simulation/modeling only (financial models, scenarios)
- Audit: All searches/generations logged to Sentry

**Security Clearance:** ⭐⭐⭐⭐⭐ (Full access, highest audit level)

---

#### **Role 1.2: EVP Operations & Business Development**
- **Title:** EVP Operations & Business Development
- **Department:** Executive (Operations & Sales)
- **Reports To:** CEO
- **Team Size:** 1
- **Level:** Executive

**Claude Configuration:**
- **Features:** Web search ✅ | Memory ✅ | Code execution ❌ | Artifacts ✅ | Files ✅ | Research ✅
- **Memory Focus:** Client relationships, operational excellence, partnership strategy
- **Use Cases:**
  - Client retention strategy (churn analysis, upsell opportunities)
  - Operational efficiency analysis (process mapping, bottlenecks)
  - Partnership & channel strategy (partner selection, co-marketing)
  - Team performance analysis (utilization, capacity planning)
  - Business case development (ROI, investment prioritization)
  - Quarterly business reviews (QBR) generation

**Guardrails:**
- Web search: Partners, vendors, industry benchmarks (restricted: no employee data, no financials)
- Memory: Client relationships, strategic partnerships, operational insights
- No code execution (not needed)
- Audit: All conversations flagged for export (may be shared with board)

**Security Clearance:** ⭐⭐⭐⭐ (Executive access, high audit level)

---

#### **Role 1.3: CTO / VP Engineering**
- **Title:** Chief Technology Officer / VP Engineering
- **Department:** Engineering
- **Reports To:** CEO
- **Team Size:** 1
- **Level:** Executive

**Claude Configuration:**
- **Features:** Web search ✅ | Memory ✅ | Code execution ✅ | Artifacts ✅ | Files ✅ | Research ✅
- **Memory Focus:** Architecture decisions, technology strategy, vendor evaluation, team growth
- **Use Cases:**
  - Technology stack decisions (framework selection, migration planning)
  - Architecture & design reviews (scalability, security, maintainability)
  - Vendor evaluation (SaaS tools, infrastructure, dev platforms)
  - Team capability assessment (skills gaps, hiring, training)
  - Innovation roadmap (emerging tech, competitive features)
  - Tech debt management (refactoring strategy, modernization)
  - AWS cost optimization & infrastructure strategy

**Guardrails:**
- Web search: Tech news, frameworks, AWS, SaaS comparisons (unrestricted)
- Memory: Architecture patterns, team dynamics, tech decisions, vendor comparisons
- Code execution: Full access (architecture validation, performance testing, proof-of-concept)
- Audit: All code & architecture decisions logged (may be shared with engineers)

**Security Clearance:** ⭐⭐⭐⭐⭐ (Full technical access)

---

### TEAM 2: SALES & BUSINESS DEVELOPMENT (5-6 roles)

#### **Role 2.1: VP Sales**
- **Title:** VP Sales & Revenue
- **Department:** Sales
- **Reports To:** CEO/EVP
- **Team Size:** 1
- **Level:** Director/VP

**Claude Configuration:**
- **Features:** Web search ✅ | Memory ✅ | Code execution ❌ | Artifacts ✅ | Files ✅ | Research ⚠️
- **Memory Focus:** Pipeline, deal strategy, customer intelligence, sales playbooks
- **Use Cases:**
  - Sales strategy & pipeline management (forecasting, acceleration)
  - RFP response generation (proposal templates, pricing, T&C)
  - Competitor intelligence (product features, pricing, market positioning)
  - Customer research (industry, company size, decision-makers)
  - Pricing & discount strategy analysis
  - Sales collateral (one-pagers, comparison matrices, deck templates)
  - Team enablement (sales playbooks, objection handling, scripts)

**Guardrails:**
- Web search: Industry, competitors, customer research, pricing sites (no financial details)
- Memory: Sales strategy, pipeline, deal history, customer preferences
- No code execution (doesn't need it)
- Research: Allowed with caution (may take 5+ min; use sparingly)
- Audit: All proposal generations logged (may be reviewed for brand consistency)

**Security Clearance:** ⭐⭐⭐⭐ (Sales access, deal-level audit)

---

#### **Role 2.2: Sales Manager**
- **Title:** Sales Manager
- **Department:** Sales
- **Reports To:** VP Sales
- **Team Size:** 1
- **Level:** Manager

**Claude Configuration:**
- **Features:** Web search ✅ | Memory ✅ | Code execution ❌ | Artifacts ✅ | Files ✅
- **Memory Focus:** Team coaching, rep performance, deal strategy, customer wins/losses
- **Use Cases:**
  - Deal strategy & coaching (objection handling, negotiation tactics)
  - Sales metrics analysis (pipeline, win rate, cycle time)
  - Sales training & enablement (playbooks, role-playing scenarios)
  - Customer intelligence (research, competitor moves, pricing)
  - Activity planning (cold call scripts, email templates)
  - Performance coaching (feedback, development plans)

**Guardrails:**
- Web search: Competitors, customers, industry trends (limited to public data)
- Memory: Team performance, deals in progress, customer intelligence
- No code execution
- Audit: All coaching/strategy docs logged

**Security Clearance:** ⭐⭐⭐ (Sales team access)

---

#### **Role 2.3: Sales Representative (×2-3)**
- **Title:** Account Executive / Sales Rep
- **Department:** Sales
- **Reports To:** Sales Manager
- **Team Size:** 2-3
- **Level:** Individual Contributor

**Claude Configuration:**
- **Features:** Web search ✅ | Memory ✅ | Code execution ❌ | Artifacts ⚠️ | Files ❌ | Research ❌
- **Memory Focus:** Personal deal pipeline, customer research, objection handling playbook
- **Use Cases:**
  - Prospect research (company, industry, decision-makers)
  - Email outreach (cold email templates, sequences)
  - Sales collateral (one-pagers, pitch talking points)
  - Objection handling (response generation, tactics)
  - Deal qualification (BANT analysis, fit assessment)
  - Meeting prep (agenda, talking points, questions)

**Guardrails:**
- Web search: Customer research only (company info, job postings, news)
- Memory: Personal pipeline, objection responses, customer preferences (no sensitive details)
- No code execution
- Limited artifacts (text-based only, no complex layouts)
- No file upload (not needed)
- Audit: All customer research/outreach logged (no spam monitoring)

**Security Clearance:** ⭐⭐⭐ (Individual sales access)

---

#### **Role 2.4: Business Development Specialist**
- **Title:** Business Development Specialist / Partnership Manager
- **Department:** Sales & BD
- **Reports To:** EVP Operations
- **Team Size:** 1
- **Level:** Individual Contributor / Specialist

**Claude Configuration:**
- **Features:** Web search ✅ | Memory ✅ | Code execution ❌ | Artifacts ✅ | Files ✅
- **Memory Focus:** Partnership pipeline, vendor analysis, channel strategy
- **Use Cases:**
  - Partner identification & research (capability, market fit, terms)
  - Partnership proposal generation (co-marketing, co-selling, integration)
  - Channel strategy analysis (direct vs. partner, geo expansion)
  - Vendor/supplier evaluation (pricing, SLA, relationship)
  - Strategic alliance planning (joint ventures, M&A candidates)
  - Competitive partnership analysis

**Guardrails:**
- Web search: Partners, vendors, channels, market research (unrestricted)
- Memory: Partnership pipeline, vendor analysis, channel strategy
- No code execution
- Audit: Partnership agreements flagged for legal review

**Security Clearance:** ⭐⭐⭐⭐ (Partnership access)

---

### TEAM 3: CLIENT SUCCESS & DELIVERY (3-4 roles)

#### **Role 3.1: Solutions Consultant**
- **Title:** Solutions Consultant / Customer Success Manager
- **Department:** Client Success
- **Reports To:** VP Operations / VP Sales
- **Team Size:** 1
- **Level:** Manager / Senior IC

**Claude Configuration:**
- **Features:** Web search ⚠️ | Memory ✅ | Code execution ⚠️ | Artifacts ✅ | Files ✅
- **Memory Focus:** Customer use cases, success metrics, implementation status, feedback
- **Use Cases:**
  - Customer success planning (kickoff, milestones, onboarding)
  - Use case development (ROI analysis, value realization)
  - Solution design (fit assessment, requirements gathering, proposal)
  - Configuration review (system design, best practices, troubleshooting)
  - Performance analysis (adoption, usage, health checks)
  - Executive summaries (QBR, success metrics, case studies)

**Guardrails:**
- Web search: Limited to INT knowledge base + industry best practices (no external customer data)
- Memory: Customer success metrics, implementation details, customer feedback (confidential)
- Code execution: Configuration only, no production changes (test/staging environments)
- Audit: Customer-related conversations flagged (may be shared with delivery team)

**Security Clearance:** ⭐⭐⭐⭐ (Customer success access, confidential data)

---

#### **Role 3.2: Account Manager**
- **Title:** Account Manager / Account Executive
- **Department:** Client Success
- **Reports To:** EVP Operations
- **Team Size:** 1-2
- **Level:** Individual Contributor / Senior IC

**Claude Configuration:**
- **Features:** Web search ⚠️ | Memory ✅ | Code execution ❌ | Artifacts ✅ | Files ✅
- **Memory Focus:** Customer health, relationship, contracts, upsell opportunities
- **Use Cases:**
  - Account health monitoring (adoption, satisfaction, churn risk)
  - Relationship management (check-ins, executive meetings, feedback)
  - Upsell & expansion analysis (additional products, services, seats)
  - Contract renewals (terms, pricing, amendments)
  - Customer communication (newsletters, updates, announcements)
  - Success story development (case study, testimonial, reference)

**Guardrails:**
- Web search: Limited to internal INT resources (no external data)
- Memory: Customer relationship, contract terms, health metrics (confidential)
- No code execution
- Audit: Customer interactions logged (may be shared with leadership)

**Security Clearance:** ⭐⭐⭐⭐ (Customer confidential access)

---

#### **Role 3.3: Customer Onboarding Specialist**
- **Title:** Onboarding Specialist / Customer Success Associate
- **Department:** Client Success
- **Reports To:** Account Manager / VP Operations
- **Team Size:** 1
- **Level:** Individual Contributor

**Claude Configuration:**
- **Features:** Web search ❌ | Memory ✅ | Code execution ❌ | Artifacts ✅ | Files ✅
- **Memory Focus:** Onboarding checklist, customer training, success metrics, milestones
- **Use Cases:**
  - Onboarding plan development (timeline, milestones, activities)
  - Training material generation (user guides, video scripts, FAQs)
  - Progress tracking (milestone achievement, feedback collection)
  - Handoff documentation (internal knowledge, transfer to support)
  - Communication templates (welcome emails, progress updates, surveys)
  - First-value metrics (early wins, quick ROI proof points)

**Guardrails:**
- No web search (internal focus)
- Memory: Onboarding progress, customer feedback, training materials
- No code execution
- Audit: Onboarding documentation archived

**Security Clearance:** ⭐⭐⭐ (Customer success access, no external exposure)

---

#### **Role 3.4: Technical Services Delivery Manager**
- **Title:** Delivery Manager / Technical Operations Manager
- **Department:** Operations/Delivery
- **Reports To:** VP Technical Services
- **Team Size:** 1
- **Level:** Manager

**Claude Configuration:**
- **Features:** Web search ❌ | Memory ✅ | Code execution ✅ | Artifacts ✅ | Files ✅
- **Memory Focus:** Managed services SLA, incident response, operational metrics, runbooks
- **Use Cases:**
  - Runbook generation (incident response, escalation procedures)
  - SLA management (uptime tracking, alerting, reporting)
  - Operational metrics (MTTR, availability, ticket trends)
  - Process documentation (workflows, handoff procedures, checklists)
  - Training for support team (knowledge transfer, certification)
  - Capacity planning (resource allocation, scaling)

**Guardrails:**
- No web search (internal operations)
- Memory: Operational metrics, incident history, customer SLAs (confidential)
- Code execution: Test/staging only (monitoring scripts, automation, testing)
- Audit: Incident response documented and logged

**Security Clearance:** ⭐⭐⭐⭐ (Operational/confidential access)

---

### TEAM 4: ENGINEERING & TECHNICAL (7-8 roles)

#### **Role 4.1: Software Development Manager**
- **Title:** Engineering Manager / Development Manager
- **Department:** Engineering
- **Reports To:** CTO / VP Engineering
- **Team Size:** 1
- **Level:** Manager

**Claude Configuration:**
- **Features:** Web search ✅ | Memory ✅ | Code execution ✅ | Artifacts ✅ | Files ✅ | Research ✅
- **Memory Focus:** Team capability, tech debt, sprint planning, architecture decisions
- **Use Cases:**
  - Sprint planning & capacity estimation
  - Architecture review & design decisions
  - Code quality & testing strategy
  - Team performance & development
  - Tech debt assessment & prioritization
  - Vendor/tool evaluation (databases, APIs, SaaS tools)
  - CI/CD & deployment strategy
  - Security & compliance requirements

**Guardrails:**
- Web search: Tech news, frameworks, SaaS tools, AWS (unrestricted)
- Memory: Architecture, team dynamics, sprint planning, tech debt
- Code execution: Full (architecture validation, perf testing, proof-of-concept)
- Audit: Architectural decisions logged (shared with team & CTO)

**Security Clearance:** ⭐⭐⭐⭐⭐ (Full technical access)

---

#### **Role 4.2: Senior Developer**
- **Title:** Senior Engineer / Lead Developer
- **Department:** Engineering
- **Reports To:** Development Manager
- **Team Size:** 1
- **Level:** Senior IC / Tech Lead

**Claude Configuration:**
- **Features:** Web search ✅ | Memory ✅ | Code execution ✅ | Artifacts ✅ | Files ✅
- **Memory Focus:** Architecture patterns, code quality standards, mentoring notes
- **Use Cases:**
  - Architecture & design (systems design, patterns, scalability)
  - Code generation & refactoring (complex features, legacy migration)
  - Technical documentation (API specs, architecture diagrams, guides)
  - Code review guidance (best practices, security, performance)
  - Junior developer mentoring (code reviews, learning plans)
  - Complex problem-solving (performance, debugging, optimization)

**Guardrails:**
- Web search: Tech docs, frameworks, best practices (unrestricted)
- Memory: Architecture patterns, team standards, code examples (pseudonymized)
- Code execution: Full (testing, optimization, proof-of-concept)
- Audit: Code generation reviewed by team before deployment

**Security Clearance:** ⭐⭐⭐⭐⭐ (Full technical access)

---

#### **Role 4.3: Full-Stack Developer (×2-3)**
- **Title:** Software Engineer / Developer
- **Department:** Engineering
- **Reports To:** Development Manager
- **Team Size:** 2-3
- **Level:** Mid-level / Senior IC

**Claude Configuration:**
- **Features:** Web search ✅ | Memory ✅ | Code execution ✅ | Artifacts ✅ | Files ✅
- **Memory Focus:** Current sprint, code patterns, debugging notes, personal learning
- **Use Cases:**
  - Code generation & completion (functions, modules, UI components)
  - Bug fixes & debugging (stack traces, error analysis)
  - Feature implementation (requirements to code)
  - Code refactoring (simplification, performance)
  - Test generation (unit tests, integration tests)
  - Documentation (code comments, API docs, PR descriptions)

**Guardrails:**
- Web search: Tech docs, frameworks, StackOverflow, error messages (unrestricted)
- Memory: Current sprint work, code patterns, debugging notes (no sensitive data)
- Code execution: Full (local testing, unit tests, validation)
- Audit: Code generation reviewed before commit

**Security Clearance:** ⭐⭐⭐⭐ (Full technical access, team-scoped)

---

#### **Role 4.4: QA / Testing Specialist**
- **Title:** QA Engineer / Test Automation Engineer
- **Department:** Engineering
- **Reports To:** Development Manager
- **Team Size:** 1
- **Level:** Individual Contributor

**Claude Configuration:**
- **Features:** Web search ⚠️ | Memory ✅ | Code execution ✅ | Artifacts ✅ | Files ✅
- **Memory Focus:** Test cases, bug reports, quality standards, regression tracking
- **Use Cases:**
  - Test case generation (user stories → test scenarios)
  - Test automation (framework setup, script generation, maintenance)
  - Bug report analysis (repro steps, root cause, severity)
  - Quality metrics (coverage, pass rate, trends)
  - Performance testing (load test scripts, profiling)
  - Release validation (checklist, sign-off criteria)

**Guardrails:**
- Web search: Limited (test frameworks, tools documentation only)
- Memory: Test cases, bugs, quality standards, regression history
- Code execution: Full (test script validation, automation, execution)
- Audit: Test results logged, automation code reviewed

**Security Clearance:** ⭐⭐⭐⭐ (Technical access, test scope)

---

#### **Role 4.5: DevOps / Infrastructure Engineer**
- **Title:** DevOps Engineer / Infrastructure Engineer
- **Department:** Engineering
- **Reports To:** Development Manager / CTO
- **Team Size:** 1
- **Level:** Individual Contributor / Senior IC

**Claude Configuration:**
- **Features:** Web search ✅ | Memory ✅ | Code execution ✅ | Artifacts ✅ | Files ✅
- **Memory Focus:** Infrastructure design, AWS architecture, CI/CD pipelines, deployment strategies
- **Use Cases:**
  - Infrastructure as Code (Terraform, CloudFormation generation)
  - CI/CD pipeline design (GitHub Actions, deployment automation)
  - AWS architecture (EC2, RDS, S3, Lambda, networking)
  - Monitoring & alerting (Prometheus, CloudWatch, Sentry setup)
  - Security & compliance (IAM, secrets management, audit logging)
  - Disaster recovery & backup strategy
  - Cost optimization (reserved instances, spot instances, resource tagging)

**Guardrails:**
- Web search: AWS documentation, DevOps tools, best practices (unrestricted)
- Memory: AWS architecture, infrastructure decisions, incident history
- Code execution: Full (infrastructure validation, terraform plan, testing)
- Audit: Infrastructure changes logged to AWS CloudTrail + version control

**Security Clearance:** ⭐⭐⭐⭐⭐ (Full AWS access, highest audit)

---

#### **Role 4.6: Project Manager (Software Development)**
- **Title:** Project Manager / Engineering Project Coordinator
- **Department:** Engineering
- **Reports To:** Development Manager / EVP
- **Team Size:** 1
- **Level:** Individual Contributor / Coordinator

**Claude Configuration:**
- **Features:** Web search ❌ | Memory ✅ | Code execution ❌ | Artifacts ✅ | Files ✅
- **Memory Focus:** Sprint planning, roadmap, team capacity, timeline tracking
- **Use Cases:**
  - Sprint planning & grooming (story estimation, prioritization)
  - Risk management (blockers, dependencies, mitigation)
  - Status reporting (burndown, velocity, metrics)
  - Stakeholder communication (updates, demos, feedback)
  - Timeline & resource planning (capacity, allocation)
  - Retrospective facilitation (meeting notes, action items)

**Guardrails:**
- No web search (internal project management)
- Memory: Sprint data, roadmap, team capacity, historical metrics
- No code execution (not needed)
- Audit: Project documentation archived

**Security Clearance:** ⭐⭐⭐ (Team coordination access)

---

### TEAM 5: MARKETING (2-3 roles)

#### **Role 5.1: VP Marketing / Marketing Manager**
- **Title:** VP Marketing / Marketing Manager
- **Department:** Marketing
- **Reports To:** CEO / EVP
- **Team Size:** 1
- **Level:** Manager / VP

**Claude Configuration:**
- **Features:** Web search ✅ | Memory ✅ | Code execution ❌ | Artifacts ✅ | Files ✅ | Research ✅
- **Memory Focus:** Brand strategy, campaign performance, competitor positioning, content calendar
- **Use Cases:**
  - Content strategy (blog roadmap, messaging, SEO)
  - Campaign planning (launch strategy, channels, budget)
  - Competitor analysis (positioning, messaging, pricing)
  - Brand development (voice, tone, visual strategy)
  - Lead generation strategy (channels, messaging, targeting)
  - Performance analysis (traffic, conversion, engagement metrics)
  - Event planning (webinars, conferences, sponsorships)

**Guardrails:**
- Web search: Competitors, industry trends, customer research, pricing sites (unrestricted)
- Memory: Campaign performance, brand strategy, content calendar, audience insights
- No code execution (not needed)
- Audit: Campaign briefs reviewed before launch

**Security Clearance:** ⭐⭐⭐⭐ (Marketing access, brand guardrails)

---

#### **Role 5.2: Content Strategist / Communications**
- **Title:** Content Strategist / Content Manager
- **Department:** Marketing
- **Reports To:** VP Marketing
- **Team Size:** 1
- **Level:** Individual Contributor / Senior IC

**Claude Configuration:**
- **Features:** Web search ✅ | Memory ✅ | Code execution ❌ | Artifacts ✅ | Files ✅
- **Memory Focus:** Content calendar, blog topics, case studies, brand voice examples
- **Use Cases:**
  - Blog post generation (topic research, outline, draft, SEO optimization)
  - Case study development (customer story, metrics, quotes)
  - Thought leadership (whitepapers, webinar scripts, industry insights)
  - Social media content (posts, captions, campaign assets)
  - Email campaigns (nurture sequences, promotional content)
  - Web copy (landing pages, product pages, CTAs)
  - Video scripts (product demos, customer testimonials, educational content)

**Guardrails:**
- Web search: Industry trends, customer research, SEO (unrestricted)
- Memory: Content calendar, past blog posts, brand voice, audience insights
- No code execution
- Audit: Content reviewed for brand consistency before publication

**Security Clearance:** ⭐⭐⭐ (Content creation access)

---

### TEAM 6: OPERATIONS, FINANCE & ADMINISTRATION (3-5 roles)

#### **Role 6.1: Operations Manager**
- **Title:** Operations Manager / Operations Director
- **Department:** Operations
- **Reports To:** EVP Operations
- **Team Size:** 1
- **Level:** Manager / Individual Contributor

**Claude Configuration:**
- **Features:** Web search ⚠️ | Memory ✅ | Code execution ❌ | Artifacts ✅ | Files ✅
- **Memory Focus:** Process maps, compliance documentation, operational metrics, vendor contracts
- **Use Cases:**
  - Process documentation (workflows, procedures, SOPs)
  - Compliance management (policies, audit preparation, training)
  - Vendor management (contract analysis, SLA review, performance)
  - Operational metrics (scheduling, capacity, efficiency)
  - Meeting coordination (agendas, notes, action items)
  - HR support (job descriptions, org planning, benefits)

**Guardrails:**
- Web search: Limited (vendor research, compliance resources only)
- Memory: Process documentation, contracts, operational metrics, policies
- No code execution
- Audit: Compliance documents versioned and logged

**Security Clearance:** ⭐⭐⭐⭐ (Operations & compliance access)

---

#### **Role 6.2: Financial Analyst / Controller**
- **Title:** Financial Analyst / Accounting Manager / Controller
- **Department:** Finance
- **Reports To:** CEO / EVP
- **Team Size:** 1
- **Level:** Individual Contributor / Manager

**Claude Configuration:**
- **Features:** Web search ❌ | Memory ✅ | Code execution ⚠️ | Artifacts ✅ | Files ✅
- **Memory Focus:** Budget, financials, forecasting models, variance analysis, tax compliance
- **Use Cases:**
  - Financial forecasting (revenue, expenses, cashflow, scenarios)
  - Budget analysis (actual vs. plan, variance explanation, recommendations)
  - Reporting & metrics (P&L, dashboards, stakeholder updates)
  - Cost analysis (project profitability, resource allocation, savings)
  - Policy documentation (expense policy, procurement, pricing)
  - Auditing support (documentation, reconciliation, audit preparation)

**Guardrails:**
- No web search (internal focus, confidential data)
- Memory: Financial data, budgets, forecasts, cost analysis (confidential/restricted)
- Code execution: Financial modeling only (spreadsheets, scenarios, sensitivity analysis)
- Audit: All financial summaries flagged as confidential

**Security Clearance:** ⭐⭐⭐⭐⭐ (Confidential financial access)

---

#### **Role 6.3: HR / People Operations**
- **Title:** HR Manager / People Operations Manager
- **Department:** Human Resources
- **Reports To:** EVP Operations / CEO
- **Team Size:** 1
- **Level:** Individual Contributor / Manager

**Claude Configuration:**
- **Features:** Web search ⚠️ | Memory ✅ | Code execution ❌ | Artifacts ✅ | Files ✅
- **Memory Focus:** Hiring, onboarding, employee development, culture, compensation
- **Use Cases:**
  - Job description generation (role clarity, responsibilities, requirements)
  - Recruitment support (interview questions, scoring rubrics, offer letters)
  - Onboarding documentation (welcome kit, first-week schedule, training plan)
  - Employee development (feedback templates, career planning, training)
  - Policy documentation (handbook, code of conduct, procedures)
  - Culture initiatives (internal communications, values, team building)

**Guardrails:**
- Web search: Limited (employment law resources, benchmarking only)
- Memory: Hiring process, employee feedback, culture initiatives (no PII)
- No code execution
- Audit: HR documents versioned and logged (confidential)

**Security Clearance:** ⭐⭐⭐⭐ (HR/confidential access)

---

#### **Role 6.4: Administrative Assistant**
- **Title:** Administrative Assistant / Office Manager
- **Department:** Administration
- **Reports To:** Operations Manager / EVP
- **Team Size:** 1
- **Level:** Individual Contributor

**Claude Configuration:**
- **Features:** Web search ❌ | Memory ✅ | Code execution ❌ | Artifacts ⚠️ | Files ⚠️
- **Memory Focus:** Meeting coordination, scheduling, document templates, vendor contacts
- **Use Cases:**
  - Meeting coordination (agendas, minutes, scheduling)
  - Document templates (memos, letters, forms)
  - Scheduling & calendar management
  - Vendor communication (emails, requests, follow-ups)
  - Travel & expense support (itineraries, reimbursement forms)
  - Basic data analysis (metrics, dashboard creation)

**Guardrails:**
- No web search (not needed)
- Memory: Meeting notes, templates, scheduling information
- No code execution
- Limited file upload (documents only, no databases)
- Audit: Administrative documents kept on file

**Security Clearance:** ⭐⭐ (Administrative access only)

---

### TEAM 7: MANAGED TECHNICAL SERVICES (3-4 roles)

#### **Role 7.1: Managed IT Services Engineer (×2-3)**
- **Title:** IT Support Engineer / Managed Services Engineer
- **Department:** Technical Services
- **Reports To:** VP Technical Services / Delivery Manager
- **Team Size:** 2-3
- **Level:** Individual Contributor

**Claude Configuration:**
- **Features:** Web search ⚠️ | Memory ✅ | Code execution ✅ | Artifacts ✅ | Files ✅
- **Memory Focus:** Runbooks, SOP, customer configuration, ticket trends, escalation procedures
- **Use Cases:**
  - Troubleshooting & debugging (error analysis, ticket response, resolution steps)
  - Runbook generation (incident response, escalation, recovery procedures)
  - Configuration guidance (system setup, optimization, best practices)
  - Knowledge base creation (FAQ, documentation, training materials)
  - Ticket analysis (trends, patterns, root cause identification)
  - Customer communication (status updates, explanations, guides)

**Guardrails:**
- Web search: Limited (vendor documentation, support forums, error codes only)
- Memory: Runbooks, customer configurations, ticket history, SOP (confidential)
- Code execution: Test/staging only (not production; no customer systems)
- Audit: Customer interactions logged (may be shared with support team)

**Security Clearance:** ⭐⭐⭐⭐ (Technical support access)

---

#### **Role 7.2: Cloud Infrastructure Specialist**
- **Title:** Cloud Infrastructure Specialist / AWS Engineer
- **Department:** Technical Services
- **Reports To:** VP Technical Services / DevOps Lead
- **Team Size:** 1
- **Level:** Individual Contributor / Senior IC

**Claude Configuration:**
- **Features:** Web search ✅ | Memory ✅ | Code execution ✅ | Artifacts ✅ | Files ✅
- **Memory Focus:** AWS infrastructure design, customer architecture, cost optimization, migration plans
- **Use Cases:**
  - AWS architecture design (EC2, RDS, S3, Lambda, networking)
  - Infrastructure as Code (CloudFormation, Terraform generation)
  - Migration planning (on-prem → AWS, cost analysis)
  - Performance tuning (scaling, optimization, monitoring)
  - Security & compliance (IAM, encryption, audit logging)
  - Cost optimization (reserved instances, spot, resource analysis)
  - Disaster recovery planning (backup, failover, business continuity)

**Guardrails:**
- Web search: AWS documentation, best practices, pricing (unrestricted)
- Memory: Customer AWS architecture, migration history, cost analysis (confidential)
- Code execution: Full (infrastructure validation, cost modeling, testing)
- Audit: AWS infrastructure changes logged to CloudTrail

**Security Clearance:** ⭐⭐⭐⭐⭐ (Full AWS customer access)

---

#### **Role 7.3: Help Desk / Support Technician (×2)**
- **Title:** Help Desk Technician / IT Support Technician
- **Department:** Technical Services
- **Reports To:** VP Technical Services / Delivery Manager
- **Team Size:** 2
- **Level:** Entry-level / Individual Contributor

**Claude Configuration:**
- **Features:** Web search ❌ | Memory ✅ | Code execution ❌ | Artifacts ⚠️ | Files ⚠️
- **Memory Focus:** Ticket templates, common issues, escalation criteria, customer notes
- **Use Cases:**
  - Ticket response (initial triage, basic troubleshooting)
  - Issue documentation (problem, steps taken, resolution)
  - Knowledge base search (past tickets, solutions, workarounds)
  - Customer communication (email responses, status updates)
  - Escalation preparation (issue summary, priority, urgency)

**Guardrails:**
- No web search (use internal knowledge base only)
- Memory: Ticket history, solutions, customer notes (no passwords/credentials)
- No code execution (not needed)
- Limited artifact generation (text templates only)
- No file upload (not needed)
- Audit: All customer interactions logged

**Security Clearance:** ⭐⭐⭐ (Support access, limited scope)

---

## FEATURE ACCESS MATRIX

| Team | Web Search | Memory | Code Exec | Artifacts | File Upload | Research |
|------|-----------|--------|-----------|-----------|------------|----------|
| Executive | ✅ Full | ✅ Full | ⚠️ Model only | ✅ Full | ✅ Full | ✅ Full |
| Sales & BD | ✅ Limited | ✅ Full | ❌ None | ✅ Full | ✅ Full | ⚠️ Limited |
| Client Success | ⚠️ Limited | ✅ Full | ⚠️ Test/stage | ✅ Full | ✅ Full | ❌ None |
| Engineering | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Marketing | ✅ Full | ✅ Full | ❌ None | ✅ Full | ✅ Full | ✅ Full |
| Operations | ⚠️ Limited | ✅ Full | ❌ None | ✅ Full | ✅ Full | ❌ None |
| Tech Support | ⚠️ Limited | ✅ Full | ⚠️ Test/stage | ⚠️ Text only | ⚠️ Limited | ❌ None |

---

## DATA CLASSIFICATION & MEMORY GUARDRAILS

**Public:** Company mission, product features, service offerings, team bios  
↳ Available to: All roles, all memory uses

**Internal:** Sales strategy, market research, operational metrics, process documentation  
↳ Available to: Sales, Operations, Executive (memory only; web search restricted)

**Confidential:** Customer data, contracts, financial data, security architecture, incident details  
↳ Available to: Specific roles only (Account Manager, Finance, Delivery Manager, CTO, EVP)

**Restricted:** Credentials, API keys, PII, healthcare data, payment card data  
↳ Available to: None (never store in Claude memory; use Secrets Manager)

---

## DEPLOYMENT CHECKLIST

### Pre-Deployment (Week 1)
- [ ] Verify Claude Enterprise contract & seat count (50 seats for 41 FTE + growth buffer)
- [ ] Confirm AWS IAM integration (service account for API calls)
- [ ] Set up Okta/Azure AD for SAML SSO
- [ ] Create workspace admins (VP Engineering, VP Operations, VP Sales)
- [ ] Test SAML login with test users
- [ ] Enable audit logging to Sentry/CloudTrail

### Pilot Deployment (Week 2-3)
- [ ] Pilot group: 10 users (2-3 per team)
- [ ] Test features per role (web search, memory, code execution)
- [ ] Verify guardrails (no cross-team memory leakage, restricted web search)
- [ ] Collect feedback (1:1 interviews, focus groups)

### GA Deployment (Week 4)
- [ ] Roll out to all 41 users
- [ ] Enable SAML-based provisioning
- [ ] Set up automated deprovisioning on exit
- [ ] Distribute role configuration guides to team leads
- [ ] Conduct all-hands training (30 min overview + role-specific breakouts)

### Post-Deployment (Week 5+)
- [ ] Monitor adoption (weekly logins, feature usage)
- [ ] Track support tickets (misconfigurations, access issues)
- [ ] Quarterly security audit (memory content, audit logs)
- [ ] Monthly performance review (adoption, ROI, feedback)

---

## SUCCESS METRICS

**Week 1 (Pilot):**
- 10/10 pilot users can log in (100% SAML success)
- 0 security incidents (no unauthorized access, no data leaks)
- <5 support tickets (onboarding, feature questions)

**Month 1 (GA):**
- 80%+ adoption (33+ of 41 users active)
- Top 3 features identified (web search, memory, code execution)
- 50+ hours saved/month (time value from Claude assistance)
- 0 critical security issues

**Quarter 1 (Maturity):**
- 90%+ adoption (37+ of 41 users regular users)
- Department-specific workflows established
- Measurable ROI (cost savings, time savings, quality improvements)
- Continuous improvement feedback loop

---

## v4.0 DIFFERENCES FROM v3.1

| Aspect | v3.1 (Generic) | v4.0 (INT-Specific) |
|--------|---|---|
| **Org Model** | 50-200 employees, 6 depts | 41 FTE, 7 depts (exact), B2B structure |
| **Roles** | 20 generic roles | 30+ roles (specific titles, INT org) |
| **Feature Access** | Uniform per level | Granular per team (7 matrices) |
| **Use Cases** | Generic examples | INT-specific (sales cycle, support, engineering) |
| **Guardrails** | High-level | Specific per role (web search domains, code exec limits) |
| **Memory Model** | By-role | By-role + confidentiality level (public/internal/confidential/restricted) |
| **Compliance** | SOC 2 baseline | SOC 2 Type II + SAML SSO + audit trails + data classification |
| **SAML Setup** | Generic SAML 2.0 | Okta/Azure AD ready (specific domains) |
| **Cost Model** | Estimated | Based on 50 seats × feature usage ($10-50K/month) |
| **Deployment Timeline** | 4 weeks (optimistic) | 4 weeks (realistic: Week 1-3 SAML, Week 4 GA) |

---

## NEXT STEPS

1. **Review & Approval** (Leadership team, 1 day)
   - Validate org structure accuracy
   - Confirm role assignments
   - Approve security guardrails

2. **SAML Configuration** (IT, 3-5 days)
   - Okta/Azure AD setup
   - User provisioning sync
   - Test with pilot group

3. **Pilot Deployment** (Week 2-3)
   - Invite 10 pilot users
   - Test features per role
   - Collect feedback

4. **GA Rollout** (Week 4)
   - Onboard all 41 users
   - Distribute role guides
   - All-hands training

5. **Continuous Operations**
   - Monthly adoption tracking
   - Quarterly security audit
   - Annual role review

---

**Document:** INT Inc Claude Role Taxonomy v4.0  
**Status:** Ready for Leadership Review & SAML Configuration  
**Last Updated:** December 11, 2025  
**Next Review:** January 15, 2026 (post-pilot feedback)
