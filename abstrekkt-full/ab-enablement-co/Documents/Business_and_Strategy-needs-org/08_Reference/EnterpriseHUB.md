# Enterprise Hub - Base44 Master Prompt

## WHO (User Persona)

**Primary Users:**
- **Enterprise Architects** (Senior level, 10+ years experience)
  - Pain points: Managing complex microservices architectures across 50+ teams
  - Goals: Generate production-ready code scaffolding in minutes instead of days
  - Context: Need to enforce standards while allowing team autonomy
  
- **AI Agent Operators** (ML Engineers, DevOps)
  - Pain points: Training, deploying, and monitoring AI agents at scale
  - Goals: Reduce agent training time from weeks to hours
  - Context: Multi-cloud deployments with strict compliance requirements

- **Compliance Officers** (Security, Legal)
  - Pain points: Manually auditing 100+ microservices for SOC2/HIPAA/GDPR compliance
  - Goals: Automated compliance dashboards with real-time violation alerts
  - Context: Need immutable audit trails with 7-year retention

- **Cost Controllers** (FinOps, CFO)
  - Pain points: Unexpected cloud bills, no cost attribution by team/service
  - Goals: Forecast and control AI/infrastructure costs within ±10% accuracy
  - Context: Multi-provider (AWS, GCP, Azure) with complex pricing

## WHAT (Core Features)

### Module 1: Microservices Architecture Designer
**Must-Have Features:**
1. **Visual Service Designer** - Drag-and-drop canvas with real-time validation
   - Components: Services, databases, message queues, API gateways, load balancers
   - Relationships: Sync/async communication, data flows, dependencies
   - Auto-layout with force-directed graphs for clean visualization
   
2. **Code Generation Engine**
   - Languages: Go (microservices), Node.js (BFFs), Python (ML services), Java (legacy integration)
   - Frameworks: Gin/Echo (Go), Express/Fastify (Node), FastAPI (Python), Spring Boot (Java)
   - Output: Production-ready scaffolding with tests, Dockerfiles, CI/CD configs
   - Quality: 90%+ test coverage, OWASP secure by default

3. **Infrastructure as Code Generator**
   - Tools: Terraform (multi-cloud), Pulumi (type-safe), Helm (K8s)
   - Providers: AWS, GCP, Azure
   - Features: VPCs, service meshes (Istio/Linkerd), secrets management, monitoring

4. **API Gateway Configuration**
   - Gateways: Kong, Traefik, AWS API Gateway
   - Features: Rate limiting, auth (JWT/OAuth2), request/response transformation
   - Security: API key rotation, IP whitelisting, DDoS protection

5. **Database Schema Designer**
   - Databases: PostgreSQL, MongoDB, Redis, Elasticsearch
   - Features: ER diagrams, migrations, indexes, partitioning strategies
   - Validation: Normal forms, query optimization suggestions

6. **Service Mesh Setup**
   - Meshes: Istio, Linkerd, Consul
   - Features: Traffic management, circuit breakers, retries, timeouts
   - Observability: Distributed tracing, service graphs

### Module 2: AI Agent Management Platform
**Must-Have Features:**
1. **Agent Lifecycle Manager**
   - Create: Template-based agent creation (customer support, data analysis, workflow automation)
   - Train: Upload training data, fine-tune prompts, validate on test sets
   - Deploy: One-click deploy to production with canary rollouts
   - Monitor: Real-time health checks, performance metrics, error tracking

2. **Multi-Agent Orchestration**
   - Workflows: Define agent chains (agent A → agent B → agent C)
   - Coordination: Shared memory, handoffs, conflict resolution
   - Parallel execution: Fan-out/fan-in patterns for high throughput
   - Rollback: Automatic rollback on validation failures

3. **Training Pipeline**
   - Data ingestion: CSV, JSON, API, database connections
   - Preprocessing: Tokenization, embedding generation, data augmentation
   - Fine-tuning: GPT-4, Claude, Gemini, Llama 3
   - Validation: Hold-out sets, cross-validation, A/B testing

4. **Agent Analytics Dashboard**
   - Metrics: Accuracy, latency (p50/p95/p99), cost per request, error rate
   - Trends: Daily/weekly/monthly performance trends
   - Alerts: Slack/email notifications on SLA breaches
   - Debugging: Session replay, conversation logs, prompt traces

### Module 3: Governance & Compliance Hub
**Must-Have Features:**
1. **Compliance Dashboard**
   - Frameworks: SOC2 Type II, HIPAA, GDPR, PCI-DSS Level 1
   - Coverage: Real-time compliance score (0-100%) per framework
   - Violations: Auto-detect violations with remediation steps
   - Reports: Generate audit-ready compliance reports (PDF/DOCX)

2. **Policy Manager**
   - Policy types: Security (RBAC rules), Cost (budget limits), Quality (test coverage thresholds)
   - Enforcement: Block deployments that violate policies
   - Exceptions: Approval workflows for policy overrides
   - Versioning: Track policy changes with audit trail

3. **Audit Log Viewer**
   - Events: All user actions, API calls, data access, policy changes
   - Retention: 7 years (immutable, tamper-proof)
   - Search: Full-text search with filters (user, action, resource, timestamp)
   - Export: JSON/CSV for external SIEM systems

4. **Risk Assessment Tool**
   - Threat modeling: STRIDE analysis for each microservice
   - Vulnerability scanning: CVE checks, dependency audits
   - Risk scoring: CVSS scores with remediation priority
   - Attack surface: Visualize public endpoints, data flows

### Module 4: Cost Management & Forecasting
**Must-Have Features:**
1. **Real-Time Cost Tracking**
   - Providers: AWS, GCP, Azure, OpenAI, Anthropic, Google AI
   - Granularity: Per service, per team, per environment (dev/staging/prod)
   - Alerting: Budget alerts at 50%, 80%, 100% thresholds
   - Attribution: Tag-based cost allocation

2. **Cost Forecasting Engine**
   - Models: Linear regression, exponential smoothing, ARIMA
   - Accuracy: ±10% for 30-day forecasts, ±20% for 90-day
   - What-if analysis: Model cost impact of architectural changes
   - Recommendations: Auto-suggest cost optimizations (right-sizing, reserved instances)

3. **Budget Management**
   - Budgets: Set budgets per team, project, or service
   - Enforcement: Auto-scale down or block deployments when budget exceeded
   - Approval workflows: Manager approval for budget increases
   - Historical trends: Compare current vs. previous month/quarter/year

4. **Cost Anomaly Detection**
   - ML-based: Detect unusual spending patterns
   - Alerts: Real-time notifications on anomalies (>2 standard deviations)
   - Root cause: Drill down to specific service/API causing spike
   - Auto-remediation: Optionally auto-scale down on anomalies

### Module 5: Observability & Monitoring
**Must-Have Features:**
1. **Unified Metrics Dashboard**
   - Sources: Prometheus, Datadog, New Relic, CloudWatch
   - Metrics: CPU, memory, network, disk, request rate, error rate, latency
   - Visualization: Time series, heatmaps, service topology
   - Drill-down: From cluster → node → pod → container

2. **Log Aggregation & Analysis**
   - Sources: Application logs, system logs, audit logs
   - Storage: Elasticsearch, Loki, CloudWatch Logs
   - Search: Full-text with regex, filters, time ranges
   - Patterns: Auto-detect log patterns and anomalies

3. **Distributed Tracing**
   - Tools: Jaeger, Zipkin, AWS X-Ray
   - Visualization: Service maps, trace timelines, dependency graphs
   - Analysis: Critical path analysis, bottleneck detection
   - Sampling: Intelligent sampling for high-volume services

4. **Alert Manager**
   - Channels: Slack, PagerDuty, email, webhook
   - Rules: Threshold-based, trend-based, ML-based anomaly detection
   - Escalation: Auto-escalate to on-call if not acknowledged in 15 min
   - Runbooks: Link alerts to automated remediation playbooks

### Module 6: Security & Vulnerability Management
**Must-Have Features:**
1. **Security Scanner**
   - SAST: Static code analysis (SonarQube, Semgrep)
   - DAST: Dynamic testing (OWASP ZAP, Burp Suite)
   - SCA: Dependency scanning (Snyk, Dependabot)
   - IaC scanning: Terraform/CloudFormation security checks

2. **Vulnerability Dashboard**
   - Severity: Critical, High, Medium, Low
   - Status: Open, In Progress, Resolved, False Positive
   - SLA: Auto-escalate critical vulnerabilities not fixed in 7 days
   - Remediation: Link to patches, code fixes, config changes

3. **Threat Modeling Tool**
   - Framework: STRIDE (Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation)
   - Output: Threat model diagrams, attack trees, mitigation strategies
   - Validation: Map threats to security controls
   - Versioning: Track threat model changes over time

4. **Incident Response Console**
   - Incidents: Create incidents from alerts or manual reports
   - War rooms: Chat, timeline, action items, postmortem templates
   - Playbooks: Automated runbooks for common incidents
   - Reporting: Generate incident reports for stakeholders

## WHY (User Outcomes)

### Success Metrics
1. **Architecture Generation Time:** From days → minutes (<60 seconds for microservices design)
2. **Code Quality:** 90%+ production-ready code (validated by automated tests)
3. **Compliance Coverage:** 100% for SOC2, HIPAA, GDPR, PCI-DSS with real-time monitoring
4. **Agent Training Accuracy:** 85%+ on validation sets with <10 hour training time
5. **Cost Forecast Accuracy:** ±10% of actual cloud/AI spending
6. **Security Vulnerability Time-to-Fix:** <7 days for critical, <30 days for high
7. **Incident Response Time:** <5 minutes from alert to war room creation
8. **Developer Productivity:** 3x faster microservices deployment

### User Journeys

#### Journey 1: Enterprise Architect - Design Microservices Architecture
**Goal:** Design a new e-commerce platform with 12 microservices in <30 minutes

**Steps:**
1. Login → Navigate to "Architecture Designer"
2. Click "New Architecture" → Name: "E-commerce Platform v2"
3. Drag services onto canvas:
   - User Service (Auth, profiles)
   - Product Catalog (Search, inventory)
   - Order Service (Cart, checkout, payments)
   - Notification Service (Email, SMS)
   - Analytics Service (Tracking, reporting)
4. Define data flows:
   - User Service → Order Service (authenticated API calls)
   - Order Service → Payment Gateway (Stripe webhook)
   - Order Service → Notification Service (async via RabbitMQ)
5. Click "Generate Code" → Select stack:
   - Language: Go
   - Framework: Gin
   - Database: PostgreSQL
   - Message Queue: RabbitMQ
   - Observability: Prometheus + Jaeger
6. Click "Generate IaC" → Select provider: AWS
7. Download zip with:
   - 12 microservice repos with Dockerfiles
   - Terraform files for VPC, EKS, RDS, ElastiCache
   - CI/CD configs for GitHub Actions
   - Helm charts for Kubernetes deployment
8. Review security scan results → Fix 3 medium vulnerabilities
9. Click "Deploy to Staging" → Canary rollout starts
10. Monitor metrics dashboard → All services green in <5 minutes

**Result:** Saved 2 weeks of manual architecture work

#### Journey 2: AI Agent Operator - Train & Deploy Customer Support Agent
**Goal:** Train a customer support agent that handles 80% of tier-1 tickets

**Steps:**
1. Login → Navigate to "Agent Manager"
2. Click "Create Agent" → Select template: "Customer Support Bot"
3. Upload training data:
   - 10,000 support tickets (CSV)
   - Company knowledge base (100 docs, PDF)
   - Product documentation (Markdown)
4. Configure agent:
   - Model: GPT-4 Turbo
   - Temperature: 0.3
   - Max tokens: 1000
   - Fallback: Escalate to human if confidence <70%
5. Click "Start Training" → Progress bar shows 8 hours remaining
6. (Next day) Review validation results:
   - Accuracy: 87% on hold-out set
   - Latency: p95 = 1.2 seconds
   - Cost: $0.03 per conversation
7. Click "A/B Test" → Deploy to 10% of traffic for 48 hours
8. Review A/B results:
   - Agent handled 78% of tickets (vs 0% baseline)
   - Customer satisfaction: 4.2/5 (vs 4.5/5 for humans)
   - Cost savings: $12,000/month
9. Click "Deploy to Production" → 100% traffic cutover
10. Set up monitoring alerts:
    - Alert if accuracy drops below 80%
    - Alert if latency exceeds 3 seconds
    - Alert if cost exceeds $0.05/conversation

**Result:** Reduced support costs by 60%, improved response time from 4 hours to <2 minutes

#### Journey 3: Compliance Officer - SOC2 Audit Preparation
**Goal:** Pass SOC2 Type II audit with zero critical findings

**Steps:**
1. Login → Navigate to "Compliance Dashboard"
2. Select framework: "SOC2 Type II"
3. Review compliance score: 78% (22 violations)
4. Click "View Violations" → Sorted by severity:
   - Critical (3): Missing encryption at rest for PII data
   - High (8): Incomplete access logs for admin actions
   - Medium (11): Missing MFA for 5 admin accounts
5. Click on critical violation → See remediation steps:
   - Enable encryption for `users` and `orders` tables
   - Rotate encryption keys quarterly
   - Update IaC to enforce encryption
6. Click "Auto-Remediate" → Terraform PR created
7. Review PR → Approve → Merge → Deploy
8. Wait 24 hours → Compliance score updates to 92% (critical resolved)
9. Manually fix remaining high/medium violations over 2 weeks
10. Final score: 100% → Click "Generate Audit Report" → PDF downloaded

**Result:** Passed audit on first try, saved $50K in consultant fees

## USER JOURNEY (Detailed Flow)

### Onboarding Flow (First-Time User)
1. **Login via SSO** (Google OAuth, Microsoft Entra ID, Okta)
   - If first login → Create user account automatically
   - Assign default role: "Viewer" (read-only access)
2. **Welcome Modal** → 3-step tour:
   - Step 1: "This is your dashboard - see all metrics at a glance"
   - Step 2: "Use the sidebar to navigate modules"
   - Step 3: "Need help? Click the ? icon or press Shift+?"
3. **Role Assignment Prompt** (for admins only):
   - "What's your primary role?" → Choose: Architect / Agent Operator / Compliance Officer / Cost Controller
   - Based on selection → Customize dashboard with relevant widgets
4. **Sample Project Pre-Loaded**:
   - Name: "Demo E-commerce Platform"
   - Purpose: "Explore features with pre-configured data"
   - Actions: "Try designing a service, training an agent, or viewing compliance dashboard"

### Core Workflow (Architecture Design)
1. **Navigate to Architecture Designer** (sidebar → "Architecture" → "Designer")
2. **Create New Architecture**:
   - Name: [User input]
   - Description: [Optional]
   - Template: [Blank / E-commerce / SaaS / IoT / Healthcare]
3. **Design on Canvas**:
   - Drag services from left palette → Drop on canvas
   - Click service → Configure properties:
     - Name, language, framework, database, dependencies
   - Draw connections → Auto-suggest communication pattern (REST, gRPC, async)
   - Right-click canvas → "Auto-layout" for clean visualization
4. **Validate Architecture**:
   - Click "Validate" button → Real-time checks:
     - Circular dependencies → Show error
     - Missing authentication → Show warning
     - Best practice violations → Show suggestions
5. **Generate Code**:
   - Click "Generate Code" → Modal opens:
     - Select stack per service (or apply template to all)
     - Choose IaC provider (Terraform / Pulumi)
     - Choose CI/CD (GitHub Actions / GitLab CI / Jenkins)
   - Click "Generate" → Progress bar (30-60 seconds)
   - Download zip file with all code
6. **Security Scan**:
   - Auto-triggered after code generation
   - Results shown in right panel:
     - Critical: 0
     - High: 2 (hardcoded API keys detected)
     - Medium: 5 (missing input validation)
   - Click vulnerability → See code snippet + fix suggestion
7. **Deploy**:
   - Click "Deploy to Staging" → Dropdown:
     - Environment: [Dev / Staging / Production]
     - Rollout: [Instant / Canary / Blue-Green]
   - Click "Deploy" → Progress dashboard opens:
     - Infrastructure provisioning (Terraform apply)
     - Docker images building (parallel per service)
     - Kubernetes deployments rolling out
     - Health checks running
   - Success → "All services healthy" + metrics dashboard link

### Error States & Empty States

**Error States:**
- **Network failure during code generation:**
  - Message: "Code generation failed due to network timeout. Your architecture is auto-saved. Retry?"
  - Actions: [Retry] [Contact Support] [View Logs]
  
- **Invalid architecture (circular dependency):**
  - Message: "Circular dependency detected: Service A → B → C → A. Remove one edge to proceed."
  - Visual: Highlight offending edges in red on canvas
  
- **Deployment failure (insufficient quota):**
  - Message: "Deployment failed: AWS EKS quota exceeded. Request quota increase or reduce cluster size."
  - Actions: [Request Quota] [Reduce Size] [View AWS Console]

**Empty States:**
- **No architectures created yet:**
  - Visual: Friendly illustration (empty canvas with dotted outline)
  - Message: "Create your first architecture"
  - CTA: [Create from Template] [Start from Blank]
  
- **No agents trained yet:**
  - Visual: Robot illustration with "?" thought bubble
  - Message: "No agents yet. Train your first AI agent in 3 clicks."
  - CTA: [Use Template] [Upload Data] [Watch Demo]
  
- **No compliance violations:**
  - Visual: Green checkmark with confetti
  - Message: "🎉 100% compliant! Great work."
  - CTA: [View Report] [Schedule Audit]

## CONSTRAINTS (Technical & Business)

### Data Constraints
- **NO MOCK DATA:** All entities use real empty states, not fake placeholder data
- **NO SAMPLE USERS:** Authentication must work with real SSO providers (no "admin@example.com")
- **NO LOREM IPSUM:** All copy must be production-ready, not placeholder text

### Security Constraints
- **Authentication:** All users MUST authenticate via SSO (Google, Microsoft, Okta)
  - No username/password login (security risk)
  - Email verification required for first login
  - MFA enforced for admin roles
  
- **Authorization (RBAC):**
  - Roles: Admin, Architect, Agent Operator, Compliance Officer, Cost Controller, Viewer
  - Permissions enforced at API level (not just UI hiding)
  - Audit log for all role changes
  
- **Data Isolation:**
  - Multi-tenant with RLS (Row-Level Security) in PostgreSQL
  - Each organization's data is isolated (no cross-org queries)
  - Encryption at rest for PII (AES-256)
  - Encryption in transit (TLS 1.3)

### Performance Constraints
- **Page Load:** <3 seconds for initial load (p95)
- **API Response:** <500ms for CRUD operations (p95)
- **Code Generation:** <60 seconds for 12-service architecture
- **Real-Time Metrics:** <5 second delay from event to dashboard update
- **Concurrent Users:** Support 1000+ concurrent users without degradation

### Compliance Constraints
- **GDPR:**
  - User data export feature (JSON/CSV)
  - User data deletion feature (right to be forgotten)
  - Consent management for analytics/marketing
  - Data retention policies (7 years for audit logs, 90 days for analytics)
  
- **SOC2:**
  - Audit trail for all admin actions (immutable logs)
  - Access controls with least privilege
  - Encryption at rest and in transit
  - Incident response procedures documented
  
- **HIPAA (if healthcare customers):**
  - BAA (Business Associate Agreement) required
  - PHI (Protected Health Information) encrypted
  - Audit logs for all PHI access
  - No PHI in logs or error messages

### Cost Constraints
- **Infrastructure:** Optimize for Base44 integration credits
  - Batch database queries to reduce API calls
  - Cache frequently accessed data (Redis)
  - Use webhooks instead of polling where possible
  
- **AI Costs:**
  - Set budget limits per organization ($100/month default)
  - Auto-pause agents when budget exceeded
  - Cost estimation before training (show upfront cost)
  - Recommend cheaper models when accuracy allows (GPT-3.5 vs GPT-4)

## EXAMPLES (Reference Apps & Designs)

### Visual Design Inspiration
- **Architecture Designer:** Inspired by Figma's canvas + AWS Architecture Diagrams
  - Clean white canvas with subtle grid
  - Colorful service icons (microservices in different colors)
  - Smooth drag-and-drop with snap-to-grid
  - Real-time collaboration cursors
  
- **Metrics Dashboard:** Inspired by Datadog + Grafana
  - Dark mode with high contrast charts
  - Time range selector (last 1h / 6h / 24h / 7d / 30d)
  - Drill-down by clicking chart elements
  - Export to PNG/PDF

- **Compliance Dashboard:** Inspired by Vanta + Drata
  - Progress bars for compliance scores
  - Color-coded violations (red/yellow/green)
  - Remediation checklist with progress tracking
  - One-click audit report generation

### Component Examples
- **Service Card (Architecture Designer):**
  ```
  ┌─────────────────────┐
  │ 🛒 Order Service    │
  ├─────────────────────┤
  │ Language: Go        │
  │ Database: Postgres  │
  │ Status: ✅ Healthy  │
  └─────────────────────┘
  ```

- **Agent Card (Agent Manager):**
  ```
  ┌─────────────────────────┐
  │ 🤖 Support Bot          │
  ├─────────────────────────┤
  │ Accuracy: 87%           │
  │ Latency: 1.2s (p95)     │
  │ Cost: $0.03/conv        │
  │ Status: 🟢 Deployed     │
  └─────────────────────────┘
  ```

- **Compliance Violation (Governance Dashboard):**
  ```
  ┌────────────────────────────────────┐
  │ 🔴 Critical: Missing Encryption    │
  ├────────────────────────────────────┤
  │ Affected: `users` table            │
  │ Remediation: Enable encryption     │
  │ [Auto-Fix] [View Details] [Snooze] │
  └────────────────────────────────────┘
  ```

## STYLING (Design System)

### Color Palette
**Primary (Brand):**
- Primary Blue: `#0066FF` (CTAs, links, primary actions)
- Primary Dark: `#0052CC` (hover states)
- Primary Light: `#E6F0FF` (backgrounds, highlights)

**Semantic (Status):**
- Success Green: `#00C851` (healthy, passed, completed)
- Warning Yellow: `#FFBB33` (warnings, pending, review needed)
- Error Red: `#FF4444` (errors, critical, failed)
- Info Blue: `#33B5E5` (informational, tips)

**Neutral (UI):**
- Background: `#FFFFFF` (light mode), `#1A1A1A` (dark mode)
- Surface: `#F5F5F5` (light mode), `#2D2D2D` (dark mode)
- Border: `#E0E0E0` (light mode), `#404040` (dark mode)
- Text Primary: `#212121` (light mode), `#FFFFFF` (dark mode)
- Text Secondary: `#757575` (light mode), `#AAAAAA` (dark mode)

### Typography
**Font Family:**
- Headings: Inter (sans-serif, 600 weight)
- Body: Inter (sans-serif, 400 weight)
- Code: JetBrains Mono (monospace, 400 weight)

**Type Scale:**
- H1: 36px / 44px line-height (page titles)
- H2: 28px / 36px (section headers)
- H3: 20px / 28px (subsection headers)
- Body: 16px / 24px (paragraphs)
- Small: 14px / 20px (labels, captions)
- Tiny: 12px / 16px (metadata, timestamps)

### Spacing (8px Grid)
- XXS: 4px (tight spacing, icon padding)
- XS: 8px (compact spacing, button padding)
- S: 16px (default spacing, card padding)
- M: 24px (section spacing, modal padding)
- L: 32px (large spacing, page padding)
- XL: 48px (extra large spacing, hero sections)
- XXL: 64px (maximum spacing, page margins)

### Components (shadcn/ui + Radix UI)
**Buttons:**
- Primary: Blue background, white text, rounded corners
- Secondary: White background, blue border, blue text
- Danger: Red background, white text
- Ghost: Transparent background, text only
- Icon: Icon only, no background

**Forms:**
- Input: White background, gray border, focus ring
- Select: Dropdown with search, keyboard navigation
- Checkbox: Square with checkmark, accessible
- Radio: Circle with dot, accessible
- Toggle: Switch with on/off states

**Feedback:**
- Toast: Bottom-right corner, auto-dismiss in 5 seconds
- Modal: Centered overlay, backdrop blur, ESC to close
- Alert: Inline message with icon, dismissible
- Progress: Linear bar or circular spinner

**Navigation:**
- Sidebar: Left-aligned, collapsible, icon + text
- Breadcrumbs: Top of page, clickable path
- Tabs: Horizontal or vertical, keyboard navigation
- Pagination: Numbered pages, prev/next buttons

### Visual Style
**Aesthetic:** Professional, clean, modern (similar to Vercel, Linear, Retool)
- Generous white space
- Subtle shadows and borders
- Smooth animations (200-300ms transitions)
- High contrast for accessibility (WCAG AA)
- Dark mode support (toggle in user settings)

**Illustrations:**
- Empty states: Friendly, minimal line art (similar to Undraw)
- Error states: Helpful, not scary (robot with wrench, not fire emoji)
- Success states: Celebratory but professional (checkmark, not party popper)

## DEPLOYMENT & INFRASTRUCTURE

### Base44 Configuration
**Project Settings:**
- Name: Enterprise Hub
- Domain: enterprisehub.base44.app (custom domain later)
- Region: Auto (closest to user)
- Storage: 10GB initial, auto-scale to 100GB

**Authentication:**
- Provider: Base44 Auth (built-in)
- SSO: Google OAuth, Microsoft Entra ID, Okta SAML
- MFA: TOTP (Google Authenticator, Authy)
- Session: 24 hours, refresh token valid for 30 days

**Database Entities:**
(See separate DATABASE-SCHEMA.csv file for full details)
- Organizations (multi-tenant root)
- Users (linked to organizations via RBAC)
- Architectures (microservices designs)
- Services (individual microservices in an architecture)
- Agents (AI agent definitions)
- AgentTrainingJobs (training history)
- ComplianceFrameworks (SOC2, HIPAA, GDPR, PCI-DSS)
- ComplianceViolations (detected issues)
- CostRecords (cost tracking per service/agent)
- AuditLogs (immutable action logs)

**Serverless Functions (Deno):**
- `/functions/architecture/generate-code.ts` - Generate microservice code
- `/functions/architecture/generate-iac.ts` - Generate Terraform/Pulumi
- `/functions/agents/train.ts` - Start agent training job
- `/functions/agents/deploy.ts` - Deploy agent to production
- `/functions/governance/scan-compliance.ts` - Run compliance checks
- `/functions/cost/forecast.ts` - Generate cost forecasts
- `/functions/security/scan-vulnerabilities.ts` - SAST/DAST/SCA scans

**Integrations:**
- **Stripe:** Payment processing for subscription billing
- **OpenAI API:** GPT-4 for agent training
- **Anthropic API:** Claude for code generation
- **Google AI API:** Gemini for cost optimization
- **AWS SDK:** Deploy to AWS (EC2, EKS, RDS)
- **GCP SDK:** Deploy to GCP (GKE, Cloud SQL)
- **Slack API:** Send alerts and notifications
- **GitHub API:** Create repos, PRs for generated code

### Security Configuration
**RBAC Roles & Permissions:**
```yaml
roles:
  admin:
    permissions: ["*"]  # Full access
    description: "Platform administrators"
  
  architect:
    permissions:
      - architectures:read
      - architectures:write
      - architectures:delete
      - services:*
      - code-generation:execute
      - deployments:execute
    description: "Enterprise architects designing microservices"
  
  agent-operator:
    permissions:
      - agents:read
      - agents:write
      - agents:delete
      - training:execute
      - deployments:execute
      - analytics:read
    description: "ML engineers training and deploying AI agents"
  
  compliance-officer:
    permissions:
      - compliance:read
      - compliance:write
      - audit-logs:read
      - policies:write
      - reports:generate
    description: "Security and compliance team"
  
  cost-controller:
    permissions:
      - costs:read
      - budgets:write
      - forecasts:read
      - alerts:configure
    description: "FinOps managing cloud costs"
  
  viewer:
    permissions:
      - "*:read"  # Read-only access to all modules
    description: "Stakeholders with view-only access"
```

**Rate Limits (Prevent Abuse):**
- API calls: 1000 requests/hour per user
- Code generation: 10 generations/hour per user
- Agent training: 5 training jobs/day per organization
- Export: 20 exports/hour per user

### Monitoring & Observability
**Error Tracking (Sentry):**
- Auto-capture all exceptions
- Source maps for stack traces
- User feedback on errors
- Release tracking with git commits

**Analytics (PostHog):**
- Page views, button clicks, feature usage
- Funnel analysis (onboarding → first architecture → deployment)
- Retention cohorts (weekly active users)
- A/B testing for new features

**Performance (Vercel Analytics):**
- Core Web Vitals (LCP, FID, CLS)
- Server response times (TTFB)
- Edge function performance
- CDN cache hit rates

## FINAL INSTRUCTIONS FOR BASE44

**Build this app with the following priorities:**
1. **Security First:** Implement RBAC, RLS, encryption before any features
2. **User Flows:** Ensure error states and empty states are as polished as happy paths
3. **Real Data Only:** No mock data, no lorem ipsum, no fake users
4. **Production-Ready:** All code must pass security scans, have tests, and be deployable
5. **Compliance:** SOC2/HIPAA/GDPR requirements baked in from day 1
6. **Scalability:** Design for 1000+ concurrent users, not just 10

**Start with:**
- Authentication (SSO with Google/Microsoft/Okta)
- Database schema (see DATABASE-SCHEMA.csv)
- RBAC enforcement (admin, architect, agent-operator, compliance-officer, cost-controller, viewer)
- Empty states for all modules

**Then build in this order:**
1. Module 1: Architecture Designer (highest user demand)
2. Module 5: Observability (needed to monitor Module 1)
3. Module 2: Agent Manager (second highest demand)
4. Module 3: Governance (needed for compliance customers)
5. Module 4: Cost Management (reduces churn)
6. Module 6: Security (required before production launch)

**Testing Requirements:**
- Unit tests: ≥80% coverage
- E2E tests: Critical user journeys (login, create architecture, generate code, deploy)
- Security tests: OWASP Top 10 validation
- Performance tests: Load testing with 1000+ concurrent users

**Documentation:**
- In-app help tooltips (every page, every button)
- Knowledge base (Notion or GitBook with search)
- Video tutorials (Loom for common tasks)
- API documentation (auto-generated from function comments)

**Launch Checklist:**
- [ ] Security audit passed (no critical vulnerabilities)
- [ ] Performance benchmarks met (p95 < 3s page load)
- [ ] E2E tests passing (100% critical paths)
- [ ] Documentation complete (in-app + external)
- [ ] Compliance verified (SOC2 controls documented)
- [ ] Beta testing complete (10+ users, ≥4.0/5 satisfaction)
- [ ] Monitoring configured (Sentry + PostHog + alerts)
- [ ] Backup & disaster recovery tested

---

**This prompt is comprehensive and production-ready. Use it as the primary input to Base44's AI to build the Enterprise Hub platform. Supplement with the other upload files (database schema, mockups, component samples, etc.) for best results.**
