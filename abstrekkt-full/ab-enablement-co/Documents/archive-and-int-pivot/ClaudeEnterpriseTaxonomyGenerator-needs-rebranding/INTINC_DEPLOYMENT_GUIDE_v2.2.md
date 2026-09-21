# {{COMPANY_NAME}} Claude Enterprise Role Taxonomy v2.2 FINAL
## Complete Deployment & Implementation Guide

**Version:** 2.2 FINAL  
**Date:** December 11, 2025  
**Organization:** {{COMPANY_NAME}} (50-200 employees)  
**Status:** Production-Ready for Deployment  

---

## Executive Summary

This guide walks IT/Security teams through deploying Claude enterprise configurations across {{COMPANY_NAME}}'s 20 role variants (internal, external, advisory). Two-phase approach:

- **Phase 1 (Weeks 1-4): Manual Setup (Option A)** → IT controls access, distributes configs manually
- **Phase 2 (Months 2-3): Self-Service Portal (Option C)** → Optional: build internal onboarding page

**Key Decisions Made:**
- ✅ **Organization:** Hybrid department-first (Executive → Technology → Finance → Product → Sales/CS → Contractors)
- ✅ **Defaults:** Smart pre-fill for internal roles (AWS CloudTrail, VPC isolation, etc.); blank for external
- ✅ **Ownership:** IT/Security team with quarterly reviews (recommend {{DEPLOYMENT_OWNER}} as technical advisor)
- ✅ **Customization:** Editable fields per role (AWS implementation, integrations, MCP servers, team name, Slack channel)

---

## Part 1: Phase 1 - Manual Setup (Weeks 1-4)

### Week 1: Planning & Assessment

**Monday:**
- [ ] Review this guide with IT leadership
- [ ] Confirm Claude plan (Pro, Team, Enterprise?)
- [ ] List current Claude users (if any)
- [ ] Assign owner: IT team lead / Security / {{DEPLOYMENT_OWNER}} as advisor?

**Tuesday-Wednesday:**
- [ ] Audit {{COMPANY_NAME}}'s 240+ integrations → list which apply to each role
- [ ] Verify AWS structure (single account? Organizations? Dev/prod separation?)
- [ ] Confirm 13 MCP servers → document which roles access which servers
- [ ] Identify PCI-DSS, HIPAA, GDPR applicability (handle payment cards? healthcare data? EU employees?)

**Thursday-Friday:**
- [ ] Plan SAML 2.0 setup (Okta? Azure AD? Google Workspace?)
- [ ] Prepare pilot group (5-10 users from different departments)
- [ ] Schedule 30-min intro call with leadership

### Week 2: SAML 2.0 & Team Workspace Setup

**Prerequisite: Anthropic Account**
If {{COMPANY_NAME}} doesn't have Team/Enterprise yet:
1. Go to https://claude.ai/login
2. Contact Anthropic sales (support.claude.com)
3. Upgrade from Pro/Max → Team or Enterprise
4. Wait 1-2 days for activation

**SAML 2.0 Configuration:**

**Step 1: Get SAML Metadata from Anthropic**
- Log into Team/Enterprise workspace as admin
- Go to Settings → Organization → SAML SSO
- Copy Anthropic's Entity ID & ACS URL

**Step 2: Configure in Your Identity Provider**

*If using Okta:*
1. Admin dashboard → Applications → Add integration
2. Search "Anthropic Claude" (pre-built integration available)
3. Paste Anthropic metadata
4. Assign groups: "{{COMPANY_SLUG}}-all-employees", "{{COMPANY_SLUG}}-staff-engineers", etc.
5. Test with IT admin account
6. Enable & deploy

*If using Azure AD:*
1. Azure portal → Enterprise applications → New application
2. Create custom SAML application
3. Paste Anthropic metadata
4. Configure user attributes (email, department, role)
5. Assign groups
6. Test & deploy

*If using Google Workspace:*
1. Google Admin → Apps → SAML apps
2. Add custom SAML app
3. Paste metadata
4. Test & deploy

**Step 3: Test SAML Login**
- Have 2-3 IT staff test login via SSO
- Verify email domain auto-detection works (@{{COMPANY_DOMAIN}} auto-enrolled)
- Check audit logs in Anthropic dashboard

**Step 4: Prepare Claude Workspace**
- Enable RBAC (Team/Enterprise feature)
- Create role groups:
  ```
  Executive Leadership
  Technology Department
  Finance & Operations
  Product & Strategy
  Sales & Customer Success
  Contractors & Partners (External)
  ```
- Assign pilot users to appropriate groups

### Week 3: Pilot Rollout (5-10 Users)

**Monday-Tuesday: Onboarding**
1. Send pilot users this email:

---

**Subject: Welcome to Claude for {{COMPANY_NAME}}! 👋**

Hi [Name],

As part of our new productivity initiative, {{COMPANY_NAME}} is rolling out Claude enterprise access. You've been selected as a pilot user.

**Your Claude Configuration:**
- **Role:** [Staff Engineer / Product Manager / Senior Engineer / etc.]
- **Plan:** Team or Enterprise (managed by IT)
- **Authentication:** SAML 2.0 (log in with your @{{COMPANY_DOMAIN}} email)
- **Features:** Artifacts, code execution, web search, memory, research, skills
- **Integrations:** GitHub, Jira, Sentry, HubSpot, Slack, AWS

**How to get started:**
1. Go to https://claude.ai
2. Click "Sign in with SAML"
3. Enter your @{{COMPANY_DOMAIN}} email
4. Log in via company SSO
5. Review your configuration: [Link to this system, filtered to your role]
6. Optional: customize preferences in Settings → Profile

**Questions?**
- Contact IT: [it-support@{{COMPANY_DOMAIN}}]
- Security concerns: [security@{{COMPANY_DOMAIN}}]
- Feature request: [{{DEPLOYMENT_OWNER_EMAIL}}] (Staff Engineer)

---

**Wednesday: Training Session (30 min)**
- Live demo: showing how to access role configuration
- Answer questions
- Collect feedback

**Thursday-Friday: Monitor & Iterate**
- Check login success rates in SAML logs
- Ask pilot users: "Any issues? Does your config match your role?"
- Adjust defaults if needed
- Document feedback

### Week 4: Rollout Checklist & General Availability

**Monday-Tuesday: Prepare Company-Wide Launch**
- [ ] Create IT onboarding runbook (see below)
- [ ] Draft announcement email
- [ ] Set up support channel (#claude-support on Slack)
- [ ] Brief all managers: "Your team gets Claude this week"

**Wednesday: Company Announcement**

Subject: **Claude is Now Available to All {{COMPANY_NAME}} Employees! 🚀**

Hi {{COMPANY_NAME}},

As of today, all employees have access to Claude, Anthropic's AI assistant, via enterprise SAML single sign-on.

**Why Claude?**
- Faster code reviews, debugging, documentation
- Research support for product strategy, market analysis
- Security reviews, threat modeling (AppSec team)
- Customer support content generation
- Across 50-200 employees with role-based access control

**How to Access:**
1. Go to https://claude.ai
2. Click "Sign in with SAML"
3. Use your @{{COMPANY_DOMAIN}} email
4. View your role configuration: [Link to role taxonomy system]

**Your Role & Configuration:**
- Each role has tailored Claude settings
- [Engineering] = Code execution, deep research, team features
- [Product] = Web search, document creation, strategy research
- [Finance] = Data analysis, AWS cost tools
- [Sales/CS] = Proposal writing, outreach templates
- [Contractors] = Limited scope, project-based

**Support:**
- #claude-support Slack channel
- IT: it-support@{{COMPANY_DOMAIN}}
- Security: security@{{COMPANY_DOMAIN}}
- Technical guidance: {{DEPLOYMENT_OWNER}} (Staff Engineer)

---

**Thursday-Friday: Monitor GA Rollout**
- [ ] Verify all employees can log in via SAML
- [ ] Track adoption (logins/day)
- [ ] Resolve login issues
- [ ] Answer initial questions in #claude-support

---

## Part 2: Phase 2 - Self-Service Portal (Optional, Months 2-3)

If IT wants to **reduce manual setup burden**, optionally build an internal onboarding portal:

### Option C: Self-Service Portal

**What it does:**
1. Employee logs into {{COMPANY_NAME}} intranet
2. Sees their assigned role + Claude configuration
3. Reads: "Here's what Claude features you have, why you have them, how to use them"
4. Optional: one-click apply settings to Claude account (requires API integration)

**Low-effort implementation:**

**Approach 1: Embed HTML (Simplest)**
- Copy/paste the role-taxonomy-v2.2-FINAL.html into your intranet
- Add authentication check (only logged-in employees see it)
- Add filter: "Show me only my role"
- Time to deploy: ~1 week (requires web dev)

**Approach 2: Build Custom Page**
- Use this guide to build a custom portal in your CMS (Sharepoint, Notion, etc.)
- Pull role data from a Google Sheet (easier than HTML)
- Embed in employee handbook/onboarding flow
- Time to deploy: ~2-3 weeks

**Approach 3: Full API Integration (Advanced)**
- Build API → pulls roles from LDAP/AD
- Employee logs in → automatically sees their role
- Optional: auto-apply preferences to Claude account via Anthropic API
- Time to deploy: ~4-6 weeks (requires backend dev)

**Recommendation:** Approach 1 (embed HTML) for quick wins. Revisit Approach 3 (API) in 6 months if adoption is high.

---

## Part 3: Maintenance & Governance (Quarterly)

### Quarterly Review Checklist

**Q1 Review (March 2026):**
- [ ] How many employees are using Claude? (check login metrics)
- [ ] Which features are most used? (analyze in team chat)
- [ ] Any role mismatches? (e.g., junior engineer asking for Staff Engineer features?)
- [ ] New integrations needed? (240+ tools available; pick most valuable)
- [ ] MCP server access right? (13 servers; any access requests?)
- [ ] Compliance updates? (any new PCI-DSS, HIPAA, GDPR changes?)

**Update Process:**
1. IT/{{DEPLOYMENT_OWNER}} review feedback
2. Update role configurations if needed (editable fields in system)
3. Re-export as JSON/Markdown
4. Announce changes: "Senior Engineers now have access to Sentry + n8n"
5. Archive old version (keep for 1 year)

### Annual Security Audit

**Once a year (Dec):**
- [ ] Review all roles for data sensitivity (who accesses what?)
- [ ] Audit ZDR usage (AppSec, Staff Engineer threads should be ZDR-only)
- [ ] Check SAML logs for anomalies (unexpected access patterns?)
- [ ] Review integrations for security (any high-risk API tokens?)
- [ ] Verify SOC 2 audit trail (CloudTrail logging still enabled?)

---

## Part 4: Troubleshooting & Support

### Common Issues & Resolutions

**Issue 1: "I can't log in with SAML"**
- **Cause:** SAML setup incomplete or domain not matching
- **Fix:** 
  - Verify @{{COMPANY_DOMAIN}} email in Okta/Azure AD user list
  - Check SAML metadata URLs match Anthropic's dashboard
  - Have user try incognito/private mode (clear cache)
  - IT: check SAML logs for error codes
- **Prevention:** Test with 3 users before GA

**Issue 2: "I don't see my role configuration"**
- **Cause:** User not assigned to correct group in SAML
- **Fix:**
  - IT: verify user is in "{{COMPANY_SLUG}}-all-employees" group
  - Assign to department-specific group (e.g., "{{COMPANY_SLUG}}-technology")
  - Have user log out & back in
- **Prevention:** Batch assign groups based on LDAP/AD department field

**Issue 3: "I need access to [specific integration]"**
- **Cause:** Their role doesn't include it by default
- **Fix:**
  - Check if it's a justified need (manager approval?)
  - Update editable fields in role taxonomy system
  - Re-export config & send to user
  - Consider if other roles need it too (update template)
- **Prevention:** Document request process in #claude-support

**Issue 4: "AppSec Engineer's Claude still has network egress enabled"**
- **Cause:** ZDR wasn't properly applied during workspace setup
- **Fix:**
  - Go to Claude Team settings → find AppSec team member
  - Disable code execution network egress (air-gapped mode)
  - Verify in CloudTrail logs
- **Prevention:** IT checklist: verify all ZDR roles are air-gapped

**Issue 5: "We need to remove someone's Claude access (contractor leaving)"**
- **Cause:** Contractor end-of-engagement
- **Fix:**
  - IT: remove user from SAML groups (AD/Okta)
  - Remove from Claude Team in dashboard (if manual assignment)
  - Revoke API keys if used
  - Optional: export their chats first (data retention)
- **Prevention:** HR notifies IT 2 weeks before contractor end date

---

## Part 5: Customization Examples (For Your IT Team)

### Example 1: Customizing AppSec Role

**Scenario:** AppSec engineer needs GitHub security scanning + custom threat intel API

**Steps:**
1. Open role-taxonomy-v2.2-FINAL.html
2. Find & click "AppSec / Security Engineer"
3. Go to "Customization" tab
4. Edit "Custom Integrations" field:
   ```
   GitHub-security-scanning, Jira, AWS Security Hub, internal-threat-intel-api
   ```
5. Edit "MCP Servers" field:
   ```
   github, jira, security-hub, custom-threat-intel
   ```
6. Click "Copy to Clipboard"
7. Paste into IT ticket: "Update AppSec Claude config with above integrations"
8. Export as JSON → save to shared drive

### Example 2: Creating New Role (Marketing Manager)

**Scenario:** Just hired a head of marketing, need custom Claude config

**Steps:**
1. Use existing "Product Manager" role as template
2. Copy all fields except:
   - Change title: "Marketing Manager"
   - Change dept: "Finance & Operations" (marketing sits here in {{COMPANY_NAME}})
   - Add integration: "HubSpot (marketing hub)", "Mailchimp", "Analytics"
   - Remove: "Jira", "AWS Cost Explorer"
   - Keep: Research, web search, file creation
3. Save new role with ID: "marketing-manager-internal"
4. Test with head of marketing
5. Add to next quarterly update docs

### Example 3: Restricting Contractor Access (PCI Compliance)

**Scenario:** Contractor engineer shouldn't access AWS or payment-related code

**Steps:**
1. Find "Contractor / Freelance Engineer" role
2. Edit "AWS Implementation" field: `None - external contractors don't access AWS`
3. Edit "Custom Integrations": Remove AWS, keep only GitHub & Jira
4. Edit "MCP Servers": Remove security hub, keep github & jira only
5. Note in alert: "🔴 This contractor is on PCI-regulated project. NO AWS access."

---

## Part 6: Security Guardrails Checklist

**Before going live (Week 1-2), verify:**

- [ ] **SAML 2.0 is working** - Test with 3 users from different departments
- [ ] **ZDR is enabled for AppSec & Staff Engineer** - Check in Anthropic dashboard
- [ ] **Air-gapped code execution** - AppSec engineer has NO network egress
- [ ] **Audit logs are enabled** - CloudTrail logging verified in AWS
- [ ] **Data retention policy** - ZDR roles don't appear in model training
- [ ] **Contractor NDA signed** - All external contractors have signed agreements
- [ ] **Compliance baseline** - SOC 2, PCI-DSS, HIPAA, GDPR flags documented
- [ ] **Integration security** - All API tokens stored in Secrets Manager, not hardcoded
- [ ] **Slack integration secure** - Slack channel is private, only relevant team members
- [ ] **Monthly audit** - Schedule recurring monthly review of access logs

---

## Part 7: FAQ for {{COMPANY_NAME}} Employees

**Q: What's Claude?**
A: Claude is Anthropic's AI assistant. It helps engineers code, product teams research, security teams with threat modeling, etc. Each role has tailored access.

**Q: How do I see my configuration?**
A: Go to [link to system], find your role, read the tabs. Or contact IT.

**Q: Can I use Claude for personal projects?**
A: No, {{COMPANY_NAME}} Claude is for work only. For personal use, you can use claude.ai Pro ($20/month).

**Q: How is my data handled?**
A: Enterprise ZDR means Anthropic doesn't use your data for model training. All chats are encrypted in transit (TLS 1.3). AWS stores backups encrypted (KMS).

**Q: What if I need a different feature?**
A: Ask your manager, then contact IT. We review feature requests quarterly.

**Q: How do I report a security issue?**
A: Email security@{{COMPANY_DOMAIN}} with details. Don't post in public Slack channels.

---

## Part 8: Success Metrics (Measure Impact)

**Track these metrics monthly:**

| Metric | Target | How to Measure |
|--------|--------|---|
| **Adoption** | >80% of relevant users logging in weekly | Claude dashboard analytics |
| **Feature usage** | Code execution + research > file creation | Claude audit logs |
| **Security** | 0 accidental data leaks | CloudTrail logs + chat audit |
| **Compliance** | SOC 2 audit trail complete | AWS CloudTrail retention |
| **User satisfaction** | >4/5 in quarterly survey | Send Slack poll |
| **Support tickets** | <5 per week (after ramp-up) | IT ticketing system |

---

## Part 9: Glossary & References

**SAML 2.0:** Security Assertion Markup Language - enables single sign-on across apps

**ZDR:** Zero Data Retention - Anthropic doesn't use your chats to train Claude. Data is encrypted & deleted per schedule.

**Air-Gapped:** Code execution with no network access - threat research stays isolated, can't leak findings

**RBAC:** Role-Based Access Control - different users get different feature sets based on job role

**MCP Server:** Model Context Protocol - lets Claude access {{COMPANY_NAME}}'s custom tools (n8n, internal APIs, etc.)

**References:**
- Anthropic Claude Enterprise: https://claude.ai/pricing/enterprise
- AWS Shared Responsibility Model: https://aws.amazon.com/compliance/shared-responsibility-model/
- PCI-DSS v4.0: https://www.pcisecuritystandards.org/
- OWASP API Security: https://owasp.org/www-project-api-security/

---

## Part 10: What's Next?

**Immediate (After Go-Live):**
- [ ] Monitor adoption for 4 weeks
- [ ] Respond to support tickets within 24 hours
- [ ] Celebrate wins (team shipping code faster, security team faster audits, etc.)

**Month 2-3 (Phase 2 - Optional):**
- [ ] If adoption >50%: consider self-service portal (Option C)
- [ ] If adoption <30%: reassess; maybe increase comms or adjust features

**Month 4-6:**
- [ ] Quarterly review of roles & configurations
- [ ] Gather feedback for next iteration
- [ ] Plan API automation (if not done in Phase 2)

**Month 12:**
- [ ] Annual security audit
- [ ] Evaluate Claude plan (Pro → Team → Enterprise) based on usage
- [ ] Scale to 200+ employees if needed

---

## Final Checklist Before Rollout

- [ ] SAML 2.0 configured & tested with 3 users
- [ ] Claude Team/Enterprise plan activated
- [ ] 5-10 pilot users have access & reviewed their configs
- [ ] IT support process documented (#claude-support channel ready)
- [ ] Announcement email drafted & approved by leadership
- [ ] Role taxonomy system (HTML) saved to shared drive
- [ ] Owner assigned (IT lead + {{DEPLOYMENT_OWNER}} as technical advisor)
- [ ] Quarterly review calendar scheduled
- [ ] Security guardrails verified (ZDR, air-gapped, audit logs)
- [ ] Manager briefing complete (expectations set)

**Once all checked: You're ready for Phase 1 → Phase 2 rollout! 🚀**

---

**Questions?**
- **IT Setup:** it-support@{{COMPANY_DOMAIN}}
- **Security:** security@{{COMPANY_DOMAIN}}
- **Technical Guidance:** {{DEPLOYMENT_OWNER}} (Staff Engineer) {{DEPLOYMENT_OWNER_EMAIL}}
- **General Questions:** #claude-support on Slack

---

**Document Version:** 2.2 FINAL  
**Last Updated:** December 11, 2025  
**Status:** Ready for Production Deployment  
**Next Review:** March 31, 2026 (Quarterly)
