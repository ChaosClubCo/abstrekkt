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


## References
- `references/overview.md` — Overview
