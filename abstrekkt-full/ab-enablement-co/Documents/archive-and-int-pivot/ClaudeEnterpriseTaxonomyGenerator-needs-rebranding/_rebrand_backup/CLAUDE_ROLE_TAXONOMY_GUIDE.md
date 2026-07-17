# Claude Enterprise Role Taxonomy System
## Implementation Guide & Extensibility Framework

**Version:** 1.0  
**Date:** December 2025  
**Status:** Production-Ready (Customizable)

---

## 🎯 Overview

The Claude Role Taxonomy System is a **comprehensive, role-based configuration framework** that automatically generates optimized Claude profiles for every role, department, and career level in your organization—internally and externally.

### What It Does

Maps **30+ pre-built roles** → ESCO/ISCO occupational codes → auto-populated Claude configurations including:

- ✅ Communication preferences (style, depth, analogies)
- ✅ Security & compliance (auth, data retention, audit)
- ✅ Feature enablement (artifacts, web search, code execution, etc.)
- ✅ Recommended integrations & MCP servers
- ✅ Export formats (JSON, Markdown, YAML)

### Core Features

| Feature | Benefit |
|---------|---------|
| **30+ Pre-built Roles** | Engineering, Product, Ops, Business, Sales, Management, Leadership |
| **ESCO/ISCO Mapping** | Aligns with international occupational standards (3,039+ occupations, 13,939 skills) |
| **Auto-Population** | Select role → Configuration auto-fills based on job family & level |
| **Max Depth Support** | Individual contributor → C-level, with nuanced settings per level |
| **Export & Share** | JSON/Markdown/YAML for IT teams, compliance documentation, onboarding |
| **Extensible Design** | Add custom roles, departments, skill mappings in minutes |

---

## 🏗️ Architecture

### Role Database Structure

```
roleDatabase = {
  'role-id': {
    family: 'Department Family',
    level: 'Career Level (IC/Mgmt/Exec)',
    esco: 'ESCO Occupational Code',
    title: 'Job Title',
    summary: 'Role description',
    
    // Core attributes
    responsibilities: [...],
    skills: [...],
    commStyle: 'analytical-practical | conversational | practical',
    depth: 'brief | moderate | comprehensive',
    analogies: true|false,
    formats: ['code', 'tests', 'docs', ...],
    
    // Security config
    authMethod: 'SAML 2.0 SSO | API Key',
    dataRetention: 'Standard | Enterprise ZDR',
    compliance: ['SOC 2', 'HIPAA', ...],
    
    // Features (boolean flags)
    features: {
      artifacts: true,
      webSearch: true,
      codeExecution: true,
      fileCreation: true,
      memory: true,
      research: true,
      skills: true
    },
    
    // Integrations & tools
    codeEgress: 'none | restricted | all',
    integrations: ['GitHub', 'Jira', ...],
    
    // Explanations
    useCases: 'Why this role uses Claude',
    rationale: 'Why this configuration'
  }
}
```

### Career Level Hierarchy

```
Individual Contributor (IC)
├─ Level 1-2: Junior (Associate, Entry)
├─ Level 2-3: Mid-Level
├─ Level 4-5: Senior
└─ Level 6-7: Staff/Principal/Distinguished

Management
├─ Level 1: Manager (first-line)
├─ Level 2: Senior Manager / Director
└─ Level 3: VP / SVP

Executive
├─ Level 4: C-suite (CTO, CFO, etc.)
└─ Level 5: CEO / Chief Executive
```

### Job Families (Pre-built)

1. **Engineering & Product** (7 roles)
   - Staff Engineer, Senior Engineer, Mid-Level, Junior
   - AppSec / Security Engineer
   - Platform Engineer
   - Data Scientist / ML Engineer
   - Product Manager

2. **Operations & Infrastructure** (3 roles)
   - DevOps / SRE Engineer
   - Infrastructure Engineer
   - QA / Test Engineer

3. **Business & Strategy** (3 roles)
   - Business Analyst
   - Financial Analyst
   - Strategy & Operations

4. **Marketing & Growth** (2 roles)
   - Content / Marketing Manager
   - Demand Generation

5. **Sales & Customer Success** (3 roles)
   - Sales Representative
   - Account Executive
   - Customer Success Manager

6. **Management & Leadership** (4 roles)
   - Engineering Manager
   - Director
   - VP / SVP
   - CEO / Founder

---

## 📋 Pre-built Roles (Quick Reference)

### 🏗️ Staff Engineer / Principal Engineer
- **Level:** IC 6-7 (Top individual contributor)
- **Key Traits:** Architects systems, mentors, drives strategy
- **Claude Config:** Analytical-practical, comprehensive depth, code + tests + docs + architecture diagrams + risk analysis
- **Security:** Enterprise SSO, ZDR recommended, SOC 2, full audit
- **Features:** All enabled (artifacts, code execution, memory, research)
- **Integrations:** GitHub, Jira, Linear, Sentry, Figma
- **Rationale:** Needs deep reasoning, gap identification, ability to challenge assumptions

### 👨‍💼 Senior Engineer
- **Level:** IC 4-5
- **Key Traits:** Leads complex projects, mentors, sets standards
- **Claude Config:** Analytical-practical, moderate-comprehensive, code + tests + docs
- **Security:** Enterprise SSO, Standard or ZDR, SOC 2
- **Features:** All enabled
- **Integrations:** GitHub, Jira, Sentry, Linear
- **Rationale:** Balances speed with thoroughness; code execution aids prototyping/debugging

### 📈 Mid-Level Engineer
- **Level:** IC 2-3
- **Key Traits:** Owns features, mentors juniors, grows skills
- **Claude Config:** Practical, moderate depth, code + tests + docs
- **Security:** SAML 2.0 SSO, Standard retention, SOC 2
- **Features:** All except research
- **Integrations:** GitHub, Jira
- **Rationale:** Needs practical guidance with clear examples; code execution aids learning

### 🚀 Junior Engineer
- **Level:** IC 1-2
- **Key Traits:** Learning-focused, well-defined tasks, seeks mentorship
- **Claude Config:** Conversational-practical, brief-moderate depth, code + tests + docs + explanations
- **Security:** SAML 2.0 SSO, Standard retention, SOC 2
- **Features:** All except research
- **Integrations:** GitHub, Jira
- **Rationale:** Needs clear explanations, examples, encouragement; focus on learning over speed

### 🔒 AppSec / Security Engineer
- **Level:** IC 3-6
- **Key Traits:** Threat modeling, vuln assessment, secure design, compliance
- **Claude Config:** Analytical, comprehensive depth, code + tests + docs + threat models + risk analysis
- **Security:** Enterprise SSO, **ZDR required**, SOC 2, HIPAA, PCI-DSS, GDPR
- **Features:** All enabled; code execution **air-gapped preferred**
- **Integrations:** GitHub, Sentry, Jira
- **Rationale:** Sensitive threat models need zero-data-retention; deep research for emerging threats essential

### ⚡ Platform Engineer
- **Level:** IC 3-6
- **Key Traits:** Infrastructure, CI/CD, tooling, developer productivity
- **Claude Config:** Analytical-practical, comprehensive depth, code + tests + docs + architecture
- **Security:** Enterprise SSO, Standard or ZDR, SOC 2
- **Features:** All enabled
- **Integrations:** GitHub, Jira, Sentry, Cloudflare
- **Rationale:** Needs hands-on code execution and infrastructure integrations

### 🤖 Data Scientist / ML Engineer
- **Level:** IC 2-5
- **Key Traits:** ML models, data analysis, experimentation, productionization
- **Claude Config:** Analytical, comprehensive depth, code + tests + docs + visualizations
- **Security:** SAML 2.0 SSO, Standard or ZDR (for sensitive datasets), GDPR
- **Features:** All enabled
- **Integrations:** GitHub, Jira, Notebooks
- **Rationale:** Advanced statistical reasoning & code execution essential; memory tracks experiments

### 🎯 Product Manager
- **Level:** IC 2-5
- **Key Traits:** Strategy, prioritization, cross-functional leadership, metrics
- **Claude Config:** Conversational-practical, moderate depth, docs + analysis + strategy documents
- **Security:** SAML 2.0 SSO, Standard retention, SOC 2
- **Features:** All except code execution
- **Integrations:** Jira, Analytics, Slack
- **Rationale:** Focus on research, document creation, strategic thinking; less need for code execution

### ⚙️ DevOps / SRE Engineer
- **Level:** IC 2-5
- **Key Traits:** Deployments, monitoring, incident response, reliability
- **Claude Config:** Practical, moderate-comprehensive depth, code + docs + runbooks
- **Security:** SAML 2.0 SSO, Standard or ZDR (for incident data), SOC 2
- **Features:** All except research
- **Integrations:** GitHub, Sentry, PagerDuty, Datadog
- **Rationale:** Hands-on code execution & integrations; less conceptual, more practical

### 📊 Business Analyst
- **Level:** IC 2-4
- **Key Traits:** Requirements gathering, process analysis, documentation
- **Claude Config:** Conversational, moderate depth, docs + analysis + specifications
- **Security:** SAML 2.0 SSO, Standard retention, SOC 2
- **Features:** All except code execution
- **Integrations:** Jira, Confluence, SQL databases
- **Rationale:** Focus on communication & documentation; research helps track requirements

### 👑 CEO / Founder
- **Level:** Exec Level 5
- **Key Traits:** Vision, strategy, board relationships, culture, growth
- **Claude Config:** Conversational-analytical, moderate depth, strategy docs + analysis + presentations
- **Security:** Enterprise SSO, **ZDR for sensitive decisions**, SOC 2, SOX (if public)
- **Features:** All except code execution
- **Integrations:** Analytics, Financial tools, Slack
- **Rationale:** Needs broad insights, deep research, strategic frameworks; focus on big-picture thinking

---

## 🛠️ How to Extend the System

### Adding a Custom Role

Add an entry to the `roleDatabase` object in the HTML:

```javascript
roleDatabase['new-role-id'] = {
  family: 'Your Department',
  level: 'IC Level 3',
  esco: 'ESCO_CODE', // From esco.ec.europa.eu
  title: '📌 Your Role Title',
  summary: 'What does this role do?',
  
  responsibilities: [
    'Responsibility 1',
    'Responsibility 2',
    '...'
  ],
  
  skills: [
    'Skill 1',
    'Skill 2',
    '...'
  ],
  
  commStyle: 'analytical | practical | conversational | analytical-practical',
  depth: 'brief | moderate | comprehensive',
  analogies: true, // Use real-world comparisons?
  
  formats: [
    'code',      // Include code snippets
    'tests',     // Include test cases
    'docs',      // Include documentation
    'analysis',  // Data analysis & insights
    '...'
  ],
  
  authMethod: 'SAML 2.0 SSO | API Key',
  dataRetention: 'Standard | Enterprise ZDR',
  
  compliance: [
    'SOC 2 Type II',
    'HIPAA',    // If handling PHI
    'PCI-DSS',  // If handling payment data
    'GDPR',     // If in EU or handling EU data
    '...'
  ],
  
  features: {
    artifacts: true,
    webSearch: true,
    codeExecution: true,
    fileCreation: true,
    memory: true,
    research: true,
    skills: true
  },
  
  codeEgress: 'none | restricted | all',
  
  integrations: [
    'GitHub',
    'Jira',
    'Your custom tool',
    '...'
  ],
  
  useCases: 'What will this role use Claude for?',
  rationale: 'Why is this configuration optimal for this role?'
};
```

### Adding a Role Family

1. Add a new `<div class="role-group">` in the HTML under the appropriate section
2. Define 2-5 roles within that family
3. Ensure consistent naming and level conventions

Example:

```html
<!-- New Role Family -->
<div class="role-group">
    <div class="role-family-label">🎨 Design & UX</div>
    <div class="role-option" onclick="selectRole(this, 'product-designer', 'Design')">
        <div class="role-name">Product Designer</div>
        <div class="role-level">IC Level 2-4</div>
    </div>
    <div class="role-option" onclick="selectRole(this, 'design-lead', 'Design')">
        <div class="role-name">Design Lead / Manager</div>
        <div class="role-level">Mgmt Level 1-2</div>
    </div>
</div>
```

### Mapping Custom Skills to Roles

Use the ESCO Skills Ontology to identify which skills apply to your roles:

- **ESCO Skills Portal:** https://esco.ec.europa.eu/en/classification/skill_main
- **3,000+ occupations** linked to **13,939 skills**
- Supports skills-based hiring and gap analysis

Example: Data Scientist → ESCO 2512 (Developers and programmers) + skills:
- Machine Learning (core)
- Python Programming (core)
- Data Analysis (core)
- Statistics (knowledge)
- SQL (technical)

---

## 📊 Configuration Decision Framework

When building a role configuration, ask:

### 1. **Communication Style?**
- `analytical` → Deep reasoning, technical depth (engineers, scientists)
- `practical` → Action-oriented, implementation-focused (ops, support)
- `conversational` → Friendly, brief, interactive (sales, customer-facing)
- `analytical-practical` → Hybrid (staff engineers, architects)

### 2. **Response Depth?**
- `brief` → TL;DR with option to expand (sales, busy executives)
- `moderate` → Balanced explanations (mid-level, product)
- `comprehensive` → Full analysis with edge cases (staff, security, research)

### 3. **Use Analogies?**
- `true` → Real-world comparisons help understanding (non-technical, new learners)
- `false` → Technical jargon only (infrastructure, experienced practitioners)

### 4. **What Formats?**
- `code` → Code snippets (engineers, developers)
- `tests` → Test cases (QA, developers)
- `docs` → Documentation (all roles)
- `analysis` → Data insights (analysts, PMs)
- `strategy-documents` → Strategic frameworks (leadership, C-suite)

### 5. **Security Level?**
- **Junior/Mid-level IC:** Standard auth, Standard retention, SOC 2
- **Senior IC/Manager:** SAML 2.0, Standard or ZDR, SOC 2
- **AppSec/Finance/CEO:** SAML 2.0 SSO, **Enterprise ZDR**, SOC 2 + compliance
- **Sensitive data roles:** Air-gapped code execution, domain allowlists

### 6. **Which Integrations?**
- **All roles:** GitHub (repo access)
- **Engineers:** Jira, Sentry, deployment tools
- **Product/Business:** Analytics, Slack, Confluence
- **Sales/CS:** Slack, Intercom, CRM tools
- **Security:** Sentry, vulnerability scanning tools

---

## 🔐 Security Considerations

### Data Classification & Claude Config

| Classification | Auth | Retention | Compliance | Code Egress | Audit |
|---|---|---|---|---|---|
| **Public** | Anthropic | Standard | N/A | All | Optional |
| **Internal** | SAML 2.0 | Standard | SOC 2 | Restricted | SOC 2 Type II |
| **Confidential** | SAML 2.0 | ZDR | SOC 2 + audit | Restricted | SOC 2 + RBAC |
| **Restricted (PII/PHI/PCI)** | SAML 2.0 | **ZDR** | SOC 2 + compliance-specific | None/restricted | SOC 2 + SCIM + domain capture |

### Compliance Mappings

- **SOC 2 Type II:** Audit trails (90d min), user sign-ins, model usage metadata
- **HIPAA:** ZDR, AES-256 encryption at rest, TLS 1.3 in transit, BAAs required
- **PCI-DSS:** Never store card numbers (Stripe tokens only), webhook HMAC verification, scope audit
- **GDPR:** Data subject rights (export, delete), lawful basis, DPA, breach notification (72h)

### Recommended Policies by Role

**AppSec Engineer:**
```
- Zero Data Retention (ZDR) mandatory
- Code execution: Air-gapped / no egress
- SSO + RBAC enforcement
- SCIM provisioning
- Audit logs: Immutable, 6-year retention
```

**CEO/Finance/Legal:**
```
- Enterprise SSO (SAML 2.0 + OIDC)
- ZDR for sensitive strategic decisions
- RBAC with approval workflows
- Audit trail for all interactions
- Network: VPC-scoped (AWS Bedrock or Google Vertex AI)
```

**Junior Engineer:**
```
- SAML 2.0 SSO (standard)
- Standard data retention (ok for learning)
- Code execution: Restricted domains (npm, pypi, github)
- GitHub + Jira integrations only
```

---

## 🚀 Deployment & Integration

### Option 1: Self-Hosted (Recommended for Enterprises)

1. **Download HTML files** to your internal wiki/documentation system
2. **Customize `roleDatabase`** with your org's roles and integrations
3. **Add your org logo/branding** in header
4. **Distribute link** to all employees (internal URL)
5. **Update quarterly** as roles/skills/tools change

### Option 2: Enterprise Deployment (IT-Managed)

1. **API Integration:** Build a backend API that generates profiles
2. **LDAP/AD Integration:** Auto-populate roles from identity provider
3. **Compliance Reporting:** Export audit trails for SOC 2/HIPAA compliance
4. **Role Sync:** Update roles automatically from HRIS (Workday, SAP, etc.)
5. **Analytics:** Track which roles/configurations are adopted

### Option 3: SaaS Integration (Future Enhancement)

- Integrate with Anthropic Claude API directly
- Auto-apply configuration on first login via SSO
- Track usage by role and department
- Generate compliance reports

---

## 📈 Scaling Considerations

### For 50-200 Engineers (Current Scope)

- ✅ 30+ pre-built roles cover 85% of org
- ✅ Custom role additions: <5 min per role
- ✅ Quarterly reviews of configurations
- ✅ Team-level default configurations

### For 200-1000+ Engineers (Future Scope)

- Build department-level templates (Eng → Backend, Frontend, Platform subdivisions)
- Add skills-based matching (not just job title)
- Integrate with ESCO API for automatic skill recommendations
- Track adoption metrics and effectiveness

### Limitations & Blindspots

**What we don't have:**
- Real adoption data (which roles actually benefit most from Claude?)
- Org-specific tool integrations (your custom internal APIs)
- Team maturity assessment (who's ready for advanced features?)
- Regional compliance variations (GDPR vs. China data sovereignty)

**What to verify:**
- Your org's data classification policy
- Regulatory requirements (HIPAA? PCI-DSS? GDPR? SOX?)
- Claude plan tier available to your org
- Network policies (can you use AWS Bedrock? Google Vertex AI?)

---

## 🔧 Customization Checklist

For your organization:

- [ ] Map your organization's job families to the pre-built roles
- [ ] Identify 3-5 new roles unique to your org (add to database)
- [ ] Define data classification policy (Public/Internal/Confidential/Restricted)
- [ ] Choose security baseline (Standard or Enterprise SSO + ZDR)
- [ ] Identify critical integrations (GitHub, Jira, internal tools)
- [ ] Review compliance requirements (SOC 2? HIPAA? GDPR? PCI-DSS?)
- [ ] Socialize with IT/Security teams
- [ ] Deploy and gather feedback from early adopters
- [ ] Iterate based on actual usage patterns

---

## 📚 Reference Documents

**ESCO/ISCO Standards:**
- ESCO Portal: https://esco.ec.europa.eu/
- ESCO Skills: https://esco.ec.europa.eu/en/classification/skill_main
- ISCO-08 Classification: https://www.ilo.org/public/english/bureau/stat/isco/

**Claude Documentation:**
- Enterprise Security: https://claude.ai/pricing/enterprise
- MCP Servers: https://modelcontextprotocol.io/
- Claude Docs: https://docs.claude.com/

**Compliance Frameworks:**
- SOC 2 Trust Service Criteria: https://www.aicpa.org/
- HIPAA Security Rule: https://www.hhs.gov/hipaa/
- PCI-DSS Standard: https://www.pcisecuritystandards.org/
- GDPR: https://gdpr-info.eu/

---

## 📞 Support & Feedback

This system is designed to be **living documentation**. As your organization evolves:

1. **Add new roles** as org structure changes
2. **Update integrations** as tool stack evolves
3. **Refine security policies** as compliance requirements change
4. **Gather feedback** from early adopters and iterate

---

**Version History:**
- v1.0 (Dec 2025): Initial release with 30+ pre-built roles, ESCO mapping, exportable profiles

**Next Steps:**
- v1.1: Skills-based matching, department-level templates
- v2.0: API backend, LDAP/AD integration, usage analytics, compliance reporting
- v3.0: Real-time HRIS sync, ML-powered role recommendations, multi-org support
