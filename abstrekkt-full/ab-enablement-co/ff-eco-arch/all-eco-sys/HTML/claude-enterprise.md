# Claude Enterprise - Complete Guide

**Last Updated:** January 2025  
**Scope:** Team Plans, SSO/SAML, Compliance, Security, Deployment, Support

---

## TL;DR

Claude Enterprise offers team collaboration ($60/user/mo minimum), SSO/SAML integration, SOC 2/HIPAA compliance, dedicated support, and custom deployments via AWS Bedrock or Google Vertex AI. Includes audit logging, data residency controls, and Business Associate Agreements.

---

## Plans Overview

### Pro ($20/month)
- **Users:** Individual
- **Usage:** 5× more than free tier
- **Projects:** Unlimited
- **Files:** 10 per conversation
- **Features:** Priority access, early features, all models
- **Support:** Email support
- **Best For:** Solo professionals, freelancers

### Team (Starting $60/user/month)
- **Users:** 5+ members minimum
- **Usage:** Higher limits than Pro
- **Projects:** Unlimited + team sharing
- **Collaboration:** Shared workspaces, project templates
- **Admin:** Centralized billing, user management
- **Features:** All Pro features + team collaboration
- **Support:** Priority email support
- **Best For:** Small teams, startups

### Enterprise (Custom Pricing)
- **Users:** 50+ recommended
- **Usage:** Custom rate limits
- **SSO:** SAML, OIDC support
- **Compliance:** SOC 2, HIPAA BAA, GDPR
- **Security:** Audit logs, data residency, IP allowlisting
- **Deployment:** API, AWS Bedrock, Google Vertex AI
- **Support:** Dedicated account manager, SLA
- **Best For:** Large organizations, regulated industries

---

## Team Features

### Centralized Management

**Admin Console:**
- User provisioning/deprovisioning
- Role-based access control (Admin, Member, Viewer)
- Usage analytics and billing
- Project access management
- Audit log access

**Billing:**
- Single invoice for entire team
- Volume discounts (50+ users)
- Flexible payment terms (annual/monthly)
- Usage tracking per user/project

---

### Team Collaboration

**Shared Projects:**
```
1. Create team project
2. Add team members (Admin, Editor, Viewer)
3. Upload shared knowledge base
4. Set team-wide custom instructions
5. All members have same context
```

**Access Levels:**
- **Admin:** Full control, can delete project
- **Editor:** Can chat, edit knowledge, update instructions
- **Viewer:** Read-only access to conversations

**Project Templates:**
- Create reusable project setups
- Share across team
- Standardize workflows

---

## Single Sign-On (SSO)

### Supported Providers

**SAML 2.0:**
- Okta
- Azure Active Directory (Microsoft Entra ID)
- Google Workspace
- OneLogin
- Ping Identity
- Auth0

**OIDC (OpenID Connect):**
- Available for enterprise customers
- Custom identity providers

---

### SSO Setup

**1. Contact Anthropic Sales:**
```
https://anthropic.com/enterprise
Request SSO enablement for your domain
```

**2. Provide Domain:**
```
Company domain: example.com
All emails ending in @example.com will require SSO
```

**3. Configure Provider:**
```
Okta Example:
- Application type: SAML 2.0
- Single sign-on URL: Provided by Anthropic
- Audience URI: Provided by Anthropic
- Attribute mappings:
  - email → ${user.email}
  - firstName → ${user.firstName}
  - lastName → ${user.lastName}
```

**4. Test & Enable:**
```
1. Test with admin account
2. Verify login flow
3. Enable for all users
4. Optional: Enforce SSO (block password login)
```

---

### User Provisioning

**SCIM 2.0 (Enterprise):**
- Automatic user creation
- Group sync
- Deprovisioning on termination
- Attribute updates

**Manual (Team/Enterprise):**
- CSV upload
- Individual invites
- API provisioning

---

## Compliance & Security

### Certifications

**SOC 2 Type II:**
- Annual audit
- Security, availability, confidentiality
- Report available to enterprise customers
- Covers: Access controls, encryption, monitoring, incident response

**HIPAA Compliance:**
- Business Associate Agreement (BAA) available
- Encryption at rest (AES-256) and in transit (TLS 1.3)
- Audit logging of all PHI access
- Data retention controls
- Secure disposal procedures

**GDPR Compliance:**
- Data Processing Agreement (DPA) available
- EU data residency option
- Right to erasure (delete all data)
- Right to access (export all data)
- Data minimization practices
- Breach notification (72 hours)

**ISO 27001 (In Progress):**
- Expected Q2 2025
- Information security management

---

### Data Residency

**Available Regions:**
- **US:** Default (us-east-1, us-west-2)
- **EU:** eu-central-1 (Frankfurt), eu-west-1 (Ireland)
- **Coming:** UK, Canada, Australia

**How It Works:**
```
1. Select region during enterprise onboarding
2. All data stored in selected region
3. Data never leaves region
4. API endpoints are region-specific
```

---

### Data Retention

**Consumer/Pro:**
- Conversations: Indefinite (user can delete)
- API data: 30 days
- Training: Never (opt-out by default)

**Team:**
- Conversations: Configurable (30-∞ days)
- API data: 30-90 days
- Training: Never
- Deleted data: 30-day recovery window

**Enterprise:**
- Conversations: Custom (30-2555 days for compliance)
- API data: Custom (90-365 days)
- Training: Never
- Audit logs: 1-7 years
- Secure deletion: Immediate or scheduled

---

### Audit Logging

**What's Logged:**
- All API calls (timestamp, user, model, tokens)
- All web app actions (login, logout, project access)
- Admin actions (user changes, config updates)
- Data access (project views, file uploads)
- SSO events (login attempts, failures)

**Log Format:**
```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "event_type": "api_call",
  "user_id": "usr_abc123",
  "user_email": "user@example.com",
  "action": "messages.create",
  "model": "claude-sonnet-4.5-20241217",
  "tokens_input": 1500,
  "tokens_output": 800,
  "ip_address": "192.168.1.100",
  "status": "success"
}
```

**Access:**
- Admin console (real-time)
- S3 export (daily batches)
- SIEM integration (Splunk, Datadog, etc.)

---

### Security Features

**Encryption:**
- **In Transit:** TLS 1.3, perfect forward secrecy
- **At Rest:** AES-256, envelope encryption
- **Keys:** AWS KMS, customer-managed keys (Enterprise)

**Access Controls:**
- Role-based access control (RBAC)
- IP allowlisting (Enterprise)
- API key rotation (quarterly recommended)
- MFA enforcement (optional)

**Network Security:**
- DDoS protection
- Rate limiting (per user/API key)
- Private VPC endpoints (Enterprise, AWS/GCP only)

---

## Deployment Options

### 1. Direct API (Default)

**Endpoint:**
```
https://api.anthropic.com/v1/messages
```

**Pros:**
- Simplest setup
- Latest features first
- Managed by Anthropic

**Cons:**
- Data leaves your infrastructure
- Limited customization

**Best For:** Most teams, SaaS companies

---

### 2. AWS Bedrock

**What:** Claude models hosted on AWS infrastructure

**Setup:**
```bash
# 1. Enable Bedrock in AWS Console
# 2. Request model access (Claude 3+)
# 3. Use AWS SDK

import boto3

bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')

response = bedrock.invoke_model(
    modelId='anthropic.claude-sonnet-4-5-20241217-v1:0',
    body={
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1024,
        "messages": [{"role": "user", "content": "Hello"}]
    }
)
```

**Pros:**
- Data stays in your AWS account
- Integrate with AWS services (S3, Lambda, SageMaker)
- Use AWS billing/credits
- Private VPC access

**Cons:**
- Slightly behind direct API for new features
- AWS-specific setup

**Pricing:** Same as direct API + AWS infrastructure costs

**Best For:** AWS-heavy organizations, regulated industries

---

### 3. Google Cloud Vertex AI

**What:** Claude models on Google Cloud Platform

**Setup:**
```python
from anthropic import AnthropicVertex

client = AnthropicVertex(
    region="us-central1",
    project_id="your-project-id"
)

response = client.messages.create(
    model="claude-sonnet-4.5@20241217",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}]
)
```

**Pros:**
- Integrate with Google Cloud (BigQuery, Cloud Functions)
- Data residency in GCP regions
- Use GCP billing/credits

**Cons:**
- Limited to certain GCP regions
- Feature parity may lag

**Pricing:** Same as direct API + GCP costs

**Best For:** GCP-native organizations, Google Workspace users

---

### 4. Private Cloud (Enterprise Only)

**What:** Dedicated Claude deployment in your environment

**Requirements:**
- Minimum commitment: $500K/year
- 100+ users
- Dedicated infrastructure
- Custom SLA

**Contact:** enterprise@anthropic.com

---

## Support & SLA

### Support Tiers

**Pro:**
- Email support
- 24-hour response time (business hours)
- Community Discord access

**Team:**
- Priority email support
- 12-hour response time (business hours)
- Shared Slack channel (25+ users)

**Enterprise:**
- Dedicated account manager
- 4-hour response time (P0: 1 hour)
- Shared Slack channel
- Quarterly business reviews
- Custom training sessions

---

### Service Level Agreement (SLA)

**Enterprise Only:**

**Uptime Guarantees:**
- 99.9% monthly uptime
- Credits for downtime:
  - <99.9%: 10% credit
  - <99.0%: 25% credit
  - <95.0%: 50% credit

**Support Response Times:**
| Severity | Response | Resolution Target |
|----------|----------|-------------------|
| **P0** (Down) | 1 hour | 4 hours |
| **P1** (Critical) | 4 hours | 24 hours |
| **P2** (Major) | 8 hours | 3 days |
| **P3** (Minor) | 24 hours | 7 days |

---

## Pricing Details

### Team Pricing

**Base:**
- $60/user/month (annual)
- $70/user/month (monthly)
- Minimum: 5 users

**Volume Discounts:**
- 50-99 users: 10% off
- 100-249 users: 15% off
- 250+ users: Custom pricing

### Enterprise Pricing

**Starting at:**
- $60/user/month (web app access)
- Plus API usage (pay-as-you-go or reserved)

**API Commitment Tiers:**
- Tier 1: $10K/month → 5% discount
- Tier 2: $50K/month → 10% discount
- Tier 3: $100K/month → 15% discount
- Tier 4: $500K/month → Custom discount

**What's Included:**
- SSO/SAML
- Audit logging
- Priority support
- SLA
- Custom rate limits
- Data residency
- BAA (if needed)

---

## Migration to Enterprise

### From Pro to Team

**Process:**
1. Contact sales: sales@anthropic.com
2. Provide user count (5+ minimum)
3. Convert to team billing
4. Invite team members
5. Migrate projects (optional)

**Data:**
- All projects preserved
- Conversations maintained
- API keys continue working

---

### From Team to Enterprise

**Process:**
1. Contact enterprise sales
2. Security questionnaire
3. Custom pricing proposal
4. Legal review (MSA, DPA, BAA)
5. SSO setup
6. User migration
7. Go-live

**Timeline:** 4-8 weeks typical

---

## Use Cases by Industry

### Healthcare
**Requirements:** HIPAA compliance, BAA, audit logs  
**Deployment:** AWS Bedrock (private VPC)  
**Use Cases:** Clinical documentation, patient communication, research

### Finance
**Requirements:** SOC 2, data residency, audit logs  
**Deployment:** Direct API or AWS Bedrock  
**Use Cases:** Document analysis, compliance checking, customer support

### Legal
**Requirements:** Data residency, encryption, audit logs  
**Deployment:** Direct API (EU region) or GCP  
**Use Cases:** Contract review, research, document generation

### Technology
**Requirements:** SSO, API access, high rate limits  
**Deployment:** Direct API  
**Use Cases:** Code generation, customer support, automation

---

## Getting Started

### 1. Contact Sales
```
Web: https://anthropic.com/enterprise
Email: enterprise@anthropic.com
```

### 2. Discovery Call
```
- Use cases and requirements
- Team size and structure
- Compliance needs
- Timeline
```

### 3. Security Review
```
- Complete security questionnaire
- Review certifications (SOC 2, HIPAA)
- Discuss data residency
- Define access controls
```

### 4. Proposal
```
- Custom pricing based on usage
- Contract terms (1-3 years typical)
- SLA details
```

### 5. Onboarding (4-8 weeks)
```
Week 1-2: Legal review, MSA, DPA, BAA
Week 3-4: SSO setup and testing
Week 5-6: User migration and training
Week 7-8: Go-live and optimization
```

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIM:** Enterprise starts at $60/user/month  
**SOURCE:** [anthropic.com/pricing](https://anthropic.com/pricing)  
**STATUS:** Verified January 2025

**CLAIM:** SOC 2 Type II certified, HIPAA compliant with BAA  
**SOURCE:** [anthropic.com/trust](https://anthropic.com/trust)  
**STATUS:** Verified January 2025

**CLAIM:** AWS Bedrock and Google Vertex AI deployments available  
**SOURCE:** [docs.anthropic.com](https://docs.anthropic.com)  
**STATUS:** Verified January 2025

**COUNTEREXAMPLE:** Not all enterprise features available on all deployment options

**CONTRADICTION:** Pricing varies significantly based on usage, commitment, and deployment model
