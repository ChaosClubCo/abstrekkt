---
name: software-administration
description: SaaS management, license tracking, integration workflows, user provisioning, SSO configuration, software audits, and tech stack documentation for SMB operations. Use when managing software licenses, configuring integrations, provisioning users, or documenting technology infrastructure.
---

# Software Administration

## Overview

Software administration is critical for SMB operational efficiency and cost control. This skill covers the complete lifecycle of software management - from procurement and deployment to optimization and retirement. Modern organizations rely on dozens of SaaS applications, making centralized management essential for security, compliance, and budget control.

Effective software administration reduces shadow IT risks, optimizes license spending, streamlines user onboarding/offboarding, and ensures applications work together seamlessly. For SMBs, this function often falls to IT generalists who need structured approaches to manage complex software ecosystems.

## When to Use

Invoke this skill when:
- Evaluating new SaaS applications
- Managing software license inventory
- Tracking license costs and renewals
- Configuring SSO and user provisioning
- Building integration workflows between applications
- Conducting software audits
- Documenting the technology stack
- Optimizing software spending
- Offboarding users from multiple systems
- Planning software migrations

## Core Processes

### 1. SaaS Management Framework

#### SaaS Lifecycle Management

```
SAAS LIFECYCLE STAGES
====================

1. DISCOVERY & EVALUATION
   - Identify business need
   - Research solutions
   - Security assessment
   - Cost analysis
   - Pilot testing

2. PROCUREMENT
   - Negotiate terms
   - Contract review
   - Budget approval
   - Purchase/subscribe

3. DEPLOYMENT
   - Configuration
   - SSO integration
   - User provisioning
   - Training
   - Documentation

4. OPERATION
   - Ongoing support
   - User management
   - Performance monitoring
   - License optimization
   - Renewal management

5. RETIREMENT
   - Data export
   - User notification
   - Access termination
   - Contract cancellation
   - Documentation update
```

#### SaaS Evaluation Criteria

| Category | Weight | Criteria |
|----------|--------|----------|
| Security | 25% | SOC2, encryption, MFA support, data residency |
| Functionality | 25% | Feature fit, ease of use, mobile support |
| Integration | 20% | SSO support, API availability, existing integrations |
| Cost | 15% | Pricing model, per-user cost, hidden fees |
| Vendor Viability | 10% | Company stability, customer base, roadmap |
| Support | 5% | Support hours, SLA, documentation quality |

#### SaaS Evaluation Template

```markdown
# SaaS Evaluation: [Application Name]

**Evaluator:** [Name]
**Date:** [Date]
**Business Sponsor:** [Name]

## Business Need
[Description of the problem being solved]

## Alternatives Evaluated
1. [Option A]
2. [Option B]
3. [Option C]

## Evaluation Scores

### Security (25%)
- [ ] SOC 2 Type II certified
- [ ] Data encryption at rest and transit
- [ ] MFA support
- [ ] SSO support (SAML/OIDC)
- [ ] Data residency options
- [ ] Security documentation available
**Score:** _/10

### Functionality (25%)
- [ ] Meets core requirements
- [ ] User interface quality
- [ ] Mobile accessibility
- [ ] Customization options
- [ ] Reporting capabilities
**Score:** _/10

### Integration (20%)
- [ ] SSO compatibility
- [ ] REST API available
- [ ] Pre-built integrations
- [ ] Webhook support
- [ ] Export capabilities
**Score:** _/10

### Cost (15%)
- Pricing model: [Per user/Flat/Usage]
- Monthly cost: $____
- Annual cost: $____
- Implementation cost: $____
- Hidden fees identified: [List]
**Score:** _/10

### Vendor (10%)
- Company age: ___ years
- Customer count: ___
- Funding/revenue status: ___
- Product roadmap alignment: ___
**Score:** _/10

### Support (5%)
- Support hours: ___
- SLA: ___
- Documentation quality: ___
- Training available: ___
**Score:** _/10

## TOTAL SCORE: ___/10

## Recommendation
[Approve/Deny with justification]

## Approvals
- IT Security: _______ Date: _______
- Finance: _______ Date: _______
- IT Manager: _______ Date: _______
```

### 2. License Management

#### Software License Inventory

| Field | Description | Example |
|-------|-------------|---------|
| Application Name | Software/SaaS name | Salesforce |
| Vendor | Provider company | Salesforce Inc. |
| Category | Application type | CRM |
| License Type | Subscription/perpetual | Annual Subscription |
| License Count | Number of licenses | 50 users |
| Active Users | Currently using | 45 users |
| Cost per License | Individual cost | $150/user/month |
| Total Annual Cost | Full yearly cost | $90,000 |
| Contract Start | Agreement start date | 2024-01-01 |
| Contract End | Agreement end date | 2024-12-31 |
| Auto-Renew | Renewal terms | Yes, 30-day notice |
| Owner | Business owner | VP of Sales |
| Admin | Technical admin | IT Manager |

#### License Optimization Process

```
LICENSE OPTIMIZATION WORKFLOW
============================

MONTHLY REVIEW
1. Pull current usage reports
2. Identify inactive users (no login 30+ days)
3. Compare licensed vs. active users
4. Calculate utilization percentage
5. Flag underutilized licenses

QUARTERLY ACTIONS
1. Review underutilized licenses
2. Contact managers of inactive users
3. Reclaim unused licenses
4. Adjust license counts if possible
5. Update forecasts

ANNUAL REVIEW
1. Full license audit
2. Usage trend analysis
3. Right-sizing assessment
4. Renewal negotiation preparation
5. Budget planning

OPTIMIZATION TARGETS
- Target utilization: >85%
- Inactive user threshold: 30 days
- Cost savings target: 10-15% annually
```

#### License Tracking Dashboard

```
MONTHLY LICENSE REPORT
=====================

SUMMARY
Total SaaS Applications: 47
Total Monthly Spend: $23,450
Total Licenses: 892
Active Users: 756
Utilization Rate: 84.8%

TOP 5 BY SPEND
1. Salesforce: $7,500 (50 licenses, 47 active)
2. Microsoft 365: $3,200 (80 licenses, 78 active)
3. Slack: $2,400 (120 licenses, 95 active)
4. Zoom: $1,800 (60 licenses, 52 active)
5. Jira: $1,500 (75 licenses, 68 active)

OPTIMIZATION OPPORTUNITIES
- Slack: 25 unused licenses = $500/month savings
- Zoom: 8 unused licenses = $240/month savings
- Adobe: 12 unused licenses = $600/month savings
Total Potential Savings: $1,340/month

UPCOMING RENEWALS (Next 90 Days)
- Salesforce: Renews 2024-03-01 ($90,000)
- HubSpot: Renews 2024-04-15 ($12,000)
- Dropbox: Renews 2024-05-01 ($4,800)
```

### 3. User Provisioning & Deprovisioning

#### User Provisioning Workflow

```
NEW USER PROVISIONING
====================

TRIGGER: HR new hire notification

DAY -5: PREPARATION
[ ] Receive new hire details from HR
    - Name, email, department, role, manager
    - Start date
    - Required applications (from role template)

DAY -3: ACCOUNT CREATION
[ ] Create identity provider account (Azure AD/Okta)
[ ] Set temporary password
[ ] Configure MFA
[ ] Add to appropriate groups
[ ] Create email/calendar

DAY -2: APPLICATION PROVISIONING
[ ] Provision SSO-enabled apps (automatic via groups)
[ ] Provision non-SSO apps (manual)
[ ] Configure app-specific permissions
[ ] Verify access levels

DAY -1: VALIDATION
[ ] Test all account access
[ ] Verify group memberships
[ ] Confirm license assignments
[ ] Prepare welcome documentation

DAY 0: HANDOFF
[ ] Deliver credentials securely
[ ] Provide access documentation
[ ] Schedule IT orientation
[ ] Confirm successful logins
```

#### Role-Based Application Templates

```
APPLICATION TEMPLATES BY ROLE
============================

ALL EMPLOYEES
- Microsoft 365 (Email, Calendar, Teams)
- Slack
- Password Manager
- HR System (self-service)

ENGINEERING
Base +
- GitHub
- Jira
- Development tools
- Cloud console access

SALES
Base +
- Salesforce
- LinkedIn Sales Navigator
- Zoom (full license)
- Document signing

MARKETING
Base +
- HubSpot
- Canva
- Social media tools
- Analytics platforms

FINANCE
Base +
- Accounting software
- Expense management
- Financial reporting
- Payroll system

HR
Base +
- HRIS full access
- Recruiting platform
- Background check system
- Benefits portal
```

#### User Deprovisioning Checklist

```
USER OFFBOARDING
===============

TRIGGER: HR termination notification

IMMEDIATE (Within 4 hours of notification)
[ ] Disable identity provider account
[ ] Revoke SSO sessions
[ ] Change shared passwords if applicable
[ ] Remove from email groups
[ ] Forward email to manager (if approved)

SAME DAY
[ ] Disable non-SSO application accounts
[ ] Revoke API keys and tokens
[ ] Remove from Slack/Teams channels
[ ] Transfer document ownership
[ ] Remove from shared drives

WITHIN 48 HOURS
[ ] Complete license reclamation
[ ] Archive mailbox (per retention policy)
[ ] Generate access removal report
[ ] Update license inventory
[ ] Remove from hardware assignments

WITHIN 30 DAYS
[ ] Delete accounts per retention policy
[ ] Verify no orphaned access
[ ] Complete offboarding audit
[ ] Update documentation
```

### 4. SSO Configuration

#### SSO Implementation Checklist

```
SSO SETUP CHECKLIST
==================

PRE-IMPLEMENTATION
[ ] Verify application supports SAML/OIDC
[ ] Obtain admin access to application
[ ] Identify IdP administrator
[ ] Document current authentication method
[ ] Plan migration approach

IDENTITY PROVIDER (IdP) SETUP
[ ] Create enterprise application in IdP
[ ] Configure SAML/OIDC settings
[ ] Define attribute mappings:
    - NameID (usually email)
    - First Name
    - Last Name
    - Groups/Roles
[ ] Generate IdP metadata/certificate

APPLICATION (SP) SETUP
[ ] Enable SSO in application
[ ] Upload IdP metadata/certificate
[ ] Configure attribute mappings
[ ] Set up user provisioning (SCIM if available)
[ ] Configure just-in-time provisioning

TESTING
[ ] Test IdP-initiated login
[ ] Test SP-initiated login
[ ] Verify attribute mapping
[ ] Test user provisioning
[ ] Test user deprovisioning
[ ] Test group-based access

DEPLOYMENT
[ ] Communicate to users
[ ] Migrate users in phases
[ ] Monitor for issues
[ ] Disable legacy authentication
[ ] Document configuration
```

#### Common SSO Configurations

```
SAML CONFIGURATION TEMPLATE
===========================

IdP Settings (Azure AD/Okta):
- Entity ID: https://app.example.com/saml
- ACS URL: https://app.example.com/saml/callback
- Logout URL: https://app.example.com/saml/logout
- Name ID Format: emailAddress

Attribute Mappings:
- email → user.mail
- firstName → user.givenName
- lastName → user.surname
- groups → user.groups

OIDC CONFIGURATION TEMPLATE
===========================

IdP Settings:
- Client ID: [generated]
- Client Secret: [generated]
- Redirect URI: https://app.example.com/callback
- Scopes: openid profile email groups

Token Configuration:
- Access Token Lifetime: 1 hour
- Refresh Token Lifetime: 24 hours
- ID Token Claims: sub, email, name, groups
```

### 5. Integration Workflows

#### Integration Inventory

| Integration | Source | Destination | Method | Data | Frequency |
|-------------|--------|-------------|--------|------|-----------|
| HR → IdP | BambooHR | Azure AD | SCIM | User data | Real-time |
| CRM → Email | Salesforce | Gmail | API | Contacts | Real-time |
| Tickets → Slack | Jira | Slack | Webhook | Notifications | Real-time |
| Finance → CRM | QuickBooks | Salesforce | iPaaS | Invoices | Daily |
| IdP → Apps | Azure AD | All SaaS | SAML/SCIM | Auth/Users | Real-time |

#### Integration Platform Options

| Platform | Best For | Complexity | Cost |
|----------|----------|------------|------|
| Zapier | Simple automations | Low | $19-599/mo |
| Make (Integromat) | Complex workflows | Medium | $9-299/mo |
| Workato | Enterprise automation | High | Custom |
| Power Automate | Microsoft ecosystem | Medium | $15/user/mo |
| Tray.io | API-heavy integrations | High | Custom |

#### Integration Documentation Template

```markdown
# Integration: [Name]

**Created:** [Date]
**Owner:** [Name]
**Last Updated:** [Date]

## Overview
[Brief description of integration purpose]

## Systems Connected
- **Source:** [Application name]
- **Destination:** [Application name]
- **Method:** [API/Webhook/iPaaS/Native]

## Data Flow
1. [Trigger event]
2. [Data extraction]
3. [Transformation]
4. [Data loading]

## Field Mappings
| Source Field | Destination Field | Transformation |
|--------------|-------------------|----------------|
| field_a | field_1 | None |
| field_b | field_2 | Format date |

## Authentication
- **Source:** [API key/OAuth/etc.]
- **Destination:** [API key/OAuth/etc.]
- **Credentials Location:** [Vault/Secret manager]

## Error Handling
- Retry logic: [Description]
- Failure notification: [Email/Slack]
- Logging: [Location]

## Monitoring
- Health check: [Frequency]
- Success metrics: [Description]
- Alert thresholds: [Description]

## Maintenance
- Review frequency: [Monthly/Quarterly]
- Dependencies: [List]
- Upgrade considerations: [Notes]
```

### 6. Software Audit

#### Software Audit Process

```
SOFTWARE AUDIT PROCEDURE
========================

PREPARATION (Week 1)
[ ] Define audit scope
[ ] Gather license agreements
[ ] Export usage reports
[ ] Identify audit stakeholders
[ ] Schedule interviews

DATA COLLECTION (Week 2)
[ ] Inventory all software
[ ] Collect license documentation
[ ] Pull usage analytics
[ ] Interview department heads
[ ] Identify shadow IT

ANALYSIS (Week 3)
[ ] Compare licenses vs. deployment
[ ] Identify compliance gaps
[ ] Calculate utilization rates
[ ] Assess security risks
[ ] Evaluate cost optimization opportunities

REPORTING (Week 4)
[ ] Document findings
[ ] Prioritize remediation items
[ ] Prepare recommendations
[ ] Create action plan
[ ] Present to stakeholders

REMEDIATION (Ongoing)
[ ] Address compliance gaps
[ ] Optimize license counts
[ ] Implement controls
[ ] Track progress
[ ] Schedule follow-up audit
```

#### Software Audit Checklist

```
AUDIT CHECKLIST
==============

LICENSE COMPLIANCE
[ ] All software properly licensed
[ ] License counts match deployment
[ ] License types match usage
[ ] Maintenance/support current
[ ] No unauthorized software

SECURITY ASSESSMENT
[ ] All apps security reviewed
[ ] SSO implemented where possible
[ ] MFA enabled
[ ] Access controls appropriate
[ ] Data protection adequate

COST ANALYSIS
[ ] All costs documented
[ ] Utilization reviewed
[ ] Optimization opportunities identified
[ ] Renewal terms favorable
[ ] Budget alignment verified

OPERATIONAL REVIEW
[ ] Documentation current
[ ] Owners assigned
[ ] Support processes defined
[ ] Integration stability
[ ] Business continuity planned
```

### 7. Tech Stack Documentation

#### Tech Stack Inventory Template

```markdown
# Technology Stack Documentation

**Last Updated:** [Date]
**Maintained By:** [Name]

## Infrastructure

### Cloud Providers
| Provider | Services Used | Monthly Cost | Owner |
|----------|---------------|--------------|-------|
| AWS | EC2, S3, RDS | $X,XXX | DevOps |
| Azure | AD, Blob Storage | $XXX | IT |

### Network
- ISP: [Provider]
- Firewall: [Device/Service]
- VPN: [Solution]
- DNS: [Provider]

## Business Applications

### Core Operations
| Application | Purpose | Users | Integration | SSO |
|-------------|---------|-------|-------------|-----|
| Microsoft 365 | Email, Collaboration | All | Hub | Yes |
| Salesforce | CRM | Sales | Multiple | Yes |
| QuickBooks | Accounting | Finance | Limited | No |

### Department-Specific
[Organized by department with same table format]

## Development Tools
| Tool | Purpose | Users | License |
|------|---------|-------|---------|
| GitHub | Source control | Dev | Enterprise |
| Jira | Project management | Dev | Cloud |

## Security Stack
| Tool | Function | Coverage |
|------|----------|----------|
| CrowdStrike | Endpoint protection | All devices |
| Okta | Identity management | All users |

## Integration Map
[Visual diagram or detailed description of how systems connect]

## Vendor Contacts
| Vendor | Contact | Phone | Account # |
|--------|---------|-------|-----------|
| Microsoft | rep@microsoft.com | XXX | XXXXX |
```

## Tools & Templates

### SaaS Management Platforms

| Tool | Best For | Key Features |
|------|----------|--------------|
| Zylo | Large SaaS portfolios | Discovery, optimization |
| Productiv | Usage analytics | AI-driven insights |
| Torii | SMB SaaS management | Automation, workflows |
| Vendr | Procurement | Negotiation, benchmarks |
| BetterCloud | Security-focused | DLP, automation |

### License Management Tools

| Tool | Type | Best For |
|------|------|----------|
| ServiceNow SAM | Enterprise | Full SAM suite |
| Flexera | Enterprise | Complex environments |
| Snow Software | Enterprise | Discovery-based |
| Zluri | SMB | SaaS-focused |
| NinjaOne | SMB | IT management combo |

### Integration Platforms Comparison

```
INTEGRATION PLATFORM SELECTION
==============================

ZAPIER
Best for: Simple, no-code automations
Pros: Easy to use, wide app support
Cons: Limited for complex logic
Price: $19-599/month

MAKE (INTEGROMAT)
Best for: Visual workflow building
Pros: Powerful, cost-effective
Cons: Learning curve
Price: $9-299/month

POWER AUTOMATE
Best for: Microsoft ecosystem
Pros: Native M365 integration
Cons: Limited outside Microsoft
Price: $15/user/month

WORKATO
Best for: Enterprise automation
Pros: Advanced capabilities
Cons: Expensive, complex
Price: Custom pricing
```

## Metrics & KPIs

### License Management Metrics

| Metric | Target | Calculation |
|--------|--------|-------------|
| License Utilization | >85% | Active users / Licensed users |
| Shelfware Percentage | <10% | Unused licenses / Total licenses |
| Cost per User | Decreasing | Total SaaS spend / Employees |
| Shadow IT Count | Decreasing | Unsanctioned apps discovered |
| Renewal Savings | >10% | Negotiated savings / Original cost |

### Operational Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Provisioning Time | <4 hours | Request to access granted |
| Deprovisioning Time | <4 hours | Termination to access revoked |
| SSO Coverage | >90% | SSO apps / Total apps |
| Integration Uptime | >99.9% | Successful syncs / Total syncs |
| Audit Findings | Decreasing | Issues found per audit |

### Cost Metrics

| Metric | Target | Frequency |
|--------|--------|-----------|
| Total SaaS Spend | Budget | Monthly |
| Spend per Employee | Benchmark | Quarterly |
| License Waste | <5% of spend | Monthly |
| Renewal Cost Change | <CPI increase | At renewal |

## Common Pitfalls

### License Management Pitfalls
- **Annual true-ups:** Understand and track true-up requirements
- **Auto-renewal traps:** Calendar cancellation deadlines
- **Tier misalignment:** Using wrong license tier for needs
- **Orphaned licenses:** Track terminated user licenses

### Integration Pitfalls
- **Single point of failure:** Build redundancy
- **Undocumented integrations:** Everything must be documented
- **API rate limits:** Understand and plan for limits
- **Security gaps:** Integrations can bypass controls

### Process Pitfalls
- **Manual processes:** Automate provisioning/deprovisioning
- **Shadow IT blindness:** Actively discover unsanctioned apps
- **Documentation decay:** Keep documentation current
- **Vendor lock-in:** Plan for portability

## Integration Points

### HR Integration
- New hire provisioning triggers
- Role change updates
- Termination deprovisioning
- Org structure sync

### Finance Integration
- License cost tracking
- Budget management
- Invoice processing
- Renewal forecasting

### Security Integration
- Access reviews
- SSO management
- Compliance reporting
- Incident response

### IT Operations
- Help desk integration
- Asset management
- Change management
- Monitoring and alerting
