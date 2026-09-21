# 5 CRITICAL CLARIFIERS: Grounding v3.1 in Current Best Practices

## Context
The Intinc Claude Role Taxonomy v3.1 is functionally complete but may lack alignment with:
1. **Modern enterprise security frameworks** (NIST, Zero Trust architecture)
2. **Current Claude API/product capabilities & limitations** (ZDR, context windows, rate limits)
3. **Real-world SAML/SSO deployment patterns** (drift, sync issues, identity provider gotchas)
4. **Actual Intinc organizational structure & constraints** (undocumented, may be different from Intinc.com)
5. **Industry best practices for role-based LLM access** (emerging field, consensus unclear)

**Status:** v3.1 is theoretically sound but may be misaligned with Intinc's actual capabilities, constraints, and industry consensus.

---

## CLARIFIER 1: Claude Product Evolution & Limitations

### Current Assumptions in v3.1
- Enterprise plan: 500K context, SAML SSO, ZDR, RBAC, audit logs (based on public pricing as of Jan 2025)
- All Claude features available to all roles (artifacts, code execution, memory, web search, research)
- No known product bugs or limitations affecting role access
- Feature set stable for next 12 months

### Critical Questions

#### 1.1 What Claude product/plan does Intinc have RIGHT NOW?
- [ ] Team plan or Enterprise plan? (Locked in for how long?)
- [ ] Actual context window: 200K or 500K tokens?
- [ ] Is SAML 2.0 SSO already configured, or is it planned?
- [ ] ZDR enabled? For how many seats? (Pro-rated cost?)
- [ ] Audit trail retention period? (90 days? 1 year? 6 years?)
- [ ] Any custom agreements or exceptions with Anthropic?

#### 1.2 What Claude features have been validated in PRODUCTION (not theory)?
- [ ] **Memory**: Persists correctly across conversations? Any data loss? Cross-session isolation verified?
- [ ] **Code execution**: Works reliably? Any known Docker/sandbox issues? Performance acceptable?
- [ ] **Web search**: Rate limits? (100/day? 1000/day?) Blocked domains? Fallback if search fails?
- [ ] **Artifacts**: Browser compatibility tested? File size limits? Rendering issues?
- [ ] **Deep research**: Latency acceptable? (5 sec? 30 sec? 2 min?) Success rate?
- [ ] **Files/Upload**: Max file size? Format support? Latency for large PDFs?

#### 1.3 What Claude features are NOT available or are planned to be removed?
- [ ] Any sunset features in next 6 months?
- [ ] Known bugs affecting role use? (e.g., "code execution + memory cause crashes")
- [ ] Features disabled for security/compliance? (e.g., "web search disabled for healthcare")
- [ ] Rate limits per role/seat/day that should inform v3.1?
- [ ] Known jailbreak vectors that should inform ZDR/air-gapped decisions?

### Why This Matters

**Scenario A (Optimistic):** v3.1 recommends "Enterprise ZDR + 500K context" but Intinc is on Team plan with 250K context and no ZDR → roles overestimate capabilities, IT frustration.

**Scenario B (Risk):** v3.1 assumes memory is safe for all roles, but Anthropic discovers memory-poisoning vulnerability that exfiltrates other users' data → ZDR doesn't help, contractors should never have memory.

**Scenario C (Gotcha):** v3.1 assumes code execution available for Senior Engineers, but Anthropic disables it for healthcare compliance → 3+ roles become non-functional.

### Action Items
1. **Verify with Anthropic:** Current plan, features, roadmap, known issues
2. **Test in staging:** Each feature with expected usage patterns
3. **Document limits:** Context, rate limits, latency SLAs
4. **Plan for change:** What happens if Anthropic sunsets a feature?

---

## CLARIFIER 2: Intinc's Actual Organizational Structure & Constraints

### Current Assumptions in v3.1
- Headcount: 50-200 employees (range, not verified)
- 6 departments: Executive (5), Technology (8), Finance (3), Product (1), Sales/CS (4), Partners (2) = 23 roles mapped
- 20 roles = one-to-one or one-to-many mapping
- SAML SSO feasible (implies LDAP/AD/Okta/AzureAD backend exists or can be stood up)
- 13 MCP servers operational (mentioned in Kyle's memory but never enumerated/verified)
- Contracting/partner roles follow same access model as employees

### Critical Questions

#### 2.1 What is Intinc's ACTUAL current headcount and org structure?
- [ ] Exact headcount right now (not "50-200")? Growth forecast?
- [ ] Are there departments/divisions missing from v3.1?
  - [ ] Legal/Compliance? (if yes, do they get special rules?)
  - [ ] DevRel/Advocacy?
  - [ ] HR/People Ops? (v3.1 has VP HR but no HR Analysts)
  - [ ] Security Ops/Incident Response? (separate from AppSec?)
  - [ ] Infrastructure/SRE? (separate from Platform Eng?)
- [ ] Is there a matrix structure? (engineers report to both tech lead + customer success?)
- [ ] Do customer-facing roles (Sales, CS) have different compliance needs?
- [ ] Contractor/partner ratios? Do they follow different approval paths?

#### 2.2 What identity provider does Intinc use, and is SAML ready?
- [ ] Identity backend: Okta, Azure AD, Google Workspace, Keycloak, or something else?
- [ ] SAML 2.0 status: Already working? Planned? Blocked by budget/security review?
- [ ] Who owns identity management? (IT, Security, HR? Single owner or committee?)
- [ ] Existing SCIM sync rules? (user attributes → Claude roles?)
- [ ] On/off-boarding SLA: Same-day access or 3-5 days?
- [ ] Contractor provisioning: Same SAML or separate API key process?
- [ ] Deprovisioning: Immediate or 30-day trailing access?
- [ ] Identity provider gotchas:
  - [ ] "Okta user deprovisioning doesn't auto-sync to third-party apps" → manual step?
  - [ ] "Azure AD group sync is 15min behind" → grace period needed?
  - [ ] "Google Workspace doesn't support custom attributes for app access" → workaround?

#### 2.3 What are the 13 MCP servers Kyle mentioned?
- [ ] Full enumeration: GitHub, Jira, Sentry, n8n, Stripe, AWS, Slack, HubSpot, Cloudinary, ... [3 more]?
- [ ] Who owns each MCP server? (IT, Engineering, Finance?)
- [ ] Current access: Who has access today? Who SHOULD per role?
- [ ] Infrastructure: Internal-only or vendor-hosted? Multi-region?
- [ ] Maintenance SLA: Uptime guarantee? Maintenance windows?
- [ ] Documentation: Centralized or scattered across Slack/Notion/GitHub/Sheets?
- [ ] Audit/compliance: Are MCP accesses logged? Retained how long?

### Why This Matters

**Scenario A (Org Gap):** Intinc has a 6-person "Incident Response" team not in v3.1 because they're embedded in AppSec and Security Ops → they don't find their role → they get the wrong Claude config.

**Scenario B (Identity Gap):** v3.1 assumes SAML provisioning works Day 1, but Intinc's Okta has 15-minute group sync lag and no API tokens as fallback → first week is chaos (manual keys? re-invites?).

**Scenario C (MCP Gap):** v3.1 recommends "Platform Engineer gets n8n + GitHub + Jira," but Jira MCP isn't documented and Platform Engineer doesn't know how to access it → wasted capability.

### Action Items
1. **Get org chart:** Current headcount, actual departments, reporting lines
2. **Enumerate MCP servers:** Full list, ownership, access patterns, SLAs
3. **Verify identity stack:** SAML readiness, provisioning SLA, deprovisioning process
4. **Map identity attributes:** How do user attributes → Claude roles? (department? title? manager?)

---

## CLARIFIER 3: Zero Trust Architecture & Enterprise Security Baseline

### Current Assumptions in v3.1
- ZDR = "Anthropic doesn't use your data for training" (solves confidentiality/IP concerns)
- Security baseline = "all roles get SOC 2 Type II baseline"
- PCI-DSS applies if "Intinc processes payment card data" (not verified if true)
- HIPAA applies if "Intinc serves healthcare clients" (not verified if true)
- GDPR applies if "Intinc has EU employees" (not verified if true)
- Air-gapped code execution = "NO network egress" (prevents exfiltration)
- Threat model implicitly: "compromised Claude session won't leak secrets"

### Critical Questions

#### 3.1 Does Intinc have a Zero Trust (ZT) security architecture?
- [ ] ZT strategy documented? (policy, roadmap, maturity model?)
- [ ] Current state: Implicit trust (VPN + assume breach inside) or explicit zero trust (micro-perimeter)?
- [ ] Intinc-specific security controls not mentioned in v3.1:
  - [ ] MFA: Required for all cloud tools? Hardware keys? TOTP? Passwordless?
  - [ ] EDR (Endpoint Detection Response): Mandatory on all devices?
  - [ ] DLP (Data Loss Prevention): Monitoring Claude outputs for PII/secrets?
  - [ ] CASB (Cloud Access Security Broker): Inspecting Claude API traffic?
  - [ ] Zero-knowledge architecture: Any tools encrypted end-to-end?
- [ ] Does Claude access need to integrate with ZT infrastructure? (e.g., device posture check before Claude login?)
- [ ] Is Claude an exception to ZT policy? (if yes, documented why?)
- [ ] CSPM (Cloud Security Posture Management) tool: Auditing Claude configs? (e.g., "are all AppSec roles ZDR?")

#### 3.2 What does Intinc's actual threat model say about Claude access?
- [ ] Has security done threat modeling (STRIDE, PASTA, TAM) for "Staff Engineer using Claude for architecture review"?
  - [ ] Spoofing: Can attacker impersonate Staff Engineer? (MFA prevents? Device posture checks?)
  - [ ] Tampering: Can attacker modify Claude output before Staff Engineer acts on it?
  - [ ] Repudiation: Can Staff Engineer deny they asked Claude for something?
  - [ ] Information Disclosure: Can Claude leak trade secrets to Anthropic? (ZDR = no?)
  - [ ] Denial of Service: Can attacker rate-limit Claude for Staff Engineer?
  - [ ] Elevation of Privilege: Can contractor escalate to Staff Engineer access?
- [ ] Known adversary profiles:
  - [ ] Insiders: Disgruntled employees? Contractors with access to sensitive data?
  - [ ] Competitors: Can they infer product strategy from Intinc's Claude usage patterns?
  - [ ] State actors: Is Intinc a target (e.g., defense contractor, healthcare, finance)?
- [ ] Worst-case impact if a role's Claude session is compromised:
  - [ ] Staff Engineer → architecture/secrets leak to competitors?
  - [ ] AppSec Engineer → threat models + vulnerability research exposed?
  - [ ] VP Finance → budget/forecast/pricing strategy exposed?
  - [ ] Sales Manager → customer deals/contracts exposed?
- [ ] Can Claude be used to extract secrets (social engineering Claude itself)?
  - [ ] "What are the AWS secrets this contractor shouldn't know?" → Claude answers from training data?
  - [ ] "Summarize all Intinc's GitHub private repos" → Claude can't see repos, but memory might leak?
- [ ] Does ZDR actually address the threats? (ZDR prevents training data use, but not real-time exfiltration)

#### 3.3 What's Intinc's real compliance posture today (not aspirational)?
- [ ] SOC 2 Type II:
  - [ ] Already certified? (if yes, by whom? audit date? pass/fail?)
  - [ ] In progress? (timeline? scope?)
  - [ ] Not pursuing? (why not?)
- [ ] PCI-DSS:
  - [ ] Do you actually process payment card data? (if yes, how? who's the processor?)
  - [ ] Are you PCI-DSS compliant today? (certified? scope? open audit findings?)
  - [ ] If not compliant: are you in scope, and blocked by compliance? (budget? resources?)
- [ ] HIPAA:
  - [ ] Do you have healthcare clients? (which? how many?)
  - [ ] Are you HIPAA compliant today? (BAAs signed? encryption at rest/transit?)
  - [ ] If not: are you planning to, and is Claude access blocked until then?
- [ ] GDPR:
  - [ ] Do you have EU employees or customers?
  - [ ] Are you GDPR compliant? (DPA signed? data processing agreements with vendors like Anthropic?)
  - [ ] Are EU personal data subject to additional restrictions in Claude access?
- [ ] Ownership & governance:
  - [ ] Who owns compliance? (Security, Legal, Finance? Committee?)
  - [ ] Who approves Claude access per role? (security review SLA?)
  - [ ] Are there open audit findings that affect Claude configs?

### Why This Matters

**Scenario A (ZT Integration):** Intinc has strict ZT policy requiring hardware keys, but Claude Enterprise doesn't support hardware keys → Staff Engineers can't log in → project stalls.

**Scenario B (Threat Model Gap):** v3.1 says "ZDR prevents IP leak," but threat model identifies that "contractors with memory can be socially engineered to leak trade secrets" → disabling memory isn't enough, contractors shouldn't have Claude at all.

**Scenario C (Compliance Theater):** v3.1 claims "PCI-DSS compliance" but Intinc doesn't process cards and hasn't done PCI audit → false confidence, then Q3 audit finds non-compliance.

### Action Items
1. **Get threat model(s):** STRIDE/PASTA for key roles (Staff Eng, AppSec, VP Finance)
2. **Verify compliance:** SOC 2, PCI, HIPAA, GDPR status (certified? in progress? not applicable?)
3. **Assess ZT alignment:** Does Claude access fit ZT architecture, or is it exception?
4. **Map controls:** MFA, EDR, DLP, CSPM requirements that affect Claude access

---

## CLARIFIER 4: Current Best Practices for LLM Role-Based Access (Emerging Field)

### Current Assumptions in v3.1
- Enterprise RBAC (role → feature set mapping) is the right model
- ZDR + air-gapped execution are sufficient mitigations for sensitive roles
- Standard RBAC patterns (from traditional software) apply to LLMs
- No special handling needed for LLM-specific risks (prompt injection, jailbreaks, model extraction)
- Disabling memory for contractors is cautious but correct

### Critical Questions

#### 4.1 Is RBAC the industry consensus for LLM access?
- [ ] What are other enterprises doing? (GitLab, Figma, Stripe, etc.)
  - [ ] Do they use RBAC, or separate instances/API tokens?
  - [ ] Do they have public guidance or case studies?
- [ ] Are there NIST/CISA guidance documents on LLM governance yet?
  - [ ] NIST AI Risk Management Framework addresses this?
  - [ ] CISA guidance on cloud AI services?
  - [ ] Industry consortiums (OWASP, Cloud Security Alliance)?
- [ ] What's Anthropic's recommended architecture for 50-200 person orgs?
  - [ ] Does Anthropic recommend RBAC, or multiple workspaces?
  - [ ] Are there security bulletins about LLM access patterns?
  - [ ] Does Anthropic have reference architectures?
- [ ] Alternatives to RBAC considered?
  - [ ] Separate Claude instances per department? (cost? management?)
  - [ ] Separate API tokens per role? (manual rotation? security?)
  - [ ] Hybrid: employees RBAC, contractors separate workspace?

#### 4.2 What are the ACTUAL risks from LLM-specific features like memory?
- [ ] Can memory be poisoned/jailbroken?
  - [ ] Known attack: "add malicious instruction to memory, next conversation executes it"?
  - [ ] Can contractor memory be extracted by competitor?
  - [ ] Does memory isolation prevent cross-user leakage?
- [ ] Memory leakage across sessions:
  - [ ] "User A's memory visible to User B in same workspace" — known issue?
  - [ ] Anthropic's isolation guarantees? (per-user? per-workspace?)
- [ ] Does Anthropic recommend disabling memory for certain roles?
  - [ ] Public guidance? (documentation? blog post?)
  - [ ] Private guidance? (in customer agreements?)
- [ ] Is v3.1's "no memory for contractors" based on evidence, or overcautious?
  - [ ] What's the actual risk? (contractor + memory + exfiltration path?)
  - [ ] Is the mitigations (no memory) proportionate?

#### 4.3 What does "air-gapped code execution" actually prevent in practice?
- [ ] If AppSec can't run code, what's the real impact on their workflow?
  - [ ] Do they really need to execute code, or just write it?
  - [ ] Are there workarounds (test in local environment first)?
- [ ] Can AppSec exfiltrate data via OTHER features?
  - [ ] Artifacts (write HTML with embedded data)?
  - [ ] Code blocks (copy/paste shell script)?
  - [ ] Memory (log sensitive data in memory)?
- [ ] Is "air-gapped" a meaningful control, or theater?
  - [ ] How does Anthropic implement "NO network egress"? (DNS? Firewall? Container isolation?)
  - [ ] Are there known bypasses? (IPv6? DNS rebinding?)
  - [ ] Is the control audited? (verified by whom?)

### Why This Matters

**Scenario A (Model Gap):** v3.1 uses standard RBAC, but industry consensus (if/when it emerges) is "sensitive roles need separate instances" → v3.1 becomes non-compliant.

**Scenario B (Memory Risk):** v3.1 disables memory for contractors as precaution, but Anthropic later confirms "memory isolation is perfect" → unnecessary restriction, poor UX, contractor frustration.

**Scenario C (Air-Gapped Theater):** v3.1 promotes air-gapped code execution as major security feature for AppSec, but it's actually ineffective (can still exfiltrate via artifacts) → false confidence, security audit finds it irrelevant.

### Action Items
1. **Research industry practices:** Who's solving LLM access control? What are they doing?
2. **Verify with Anthropic:** Memory safety, air-gapped effectiveness, recommended patterns
3. **Do threat modeling:** Can memory/artifacts/other features be weaponized per role?
4. **Validate controls:** Are mitigations (ZDR, air-gapped, no memory) actually effective?

---

## CLARIFIER 5: Deployment Reality vs. v3.1 Playbook

### Current Assumptions in v3.1
- Phase 1 timeline: 4 weeks (Week 1: planning; Week 2: SAML setup; Week 3-4: pilot → GA)
- SAML 2.0 ready by Week 2 (seems optimistic given enterprise bureaucracy)
- Pilot group: 5-10 users from different departments (self-selected? randomly assigned? representative?)
- Pilot feedback drives iteration (or is it theater?)
- Phase 2 (Month 2-3): Self-service portal (if adoption >50%)
- Success metric: 80%+ adoption by Month 1

### Critical Questions

#### 5.1 Has Intinc deployed SAML SSO before? What was the real timeline?
- [ ] SAML history:
  - [ ] Deployed to ANY tool before? (Okta itself? GitHub? Slack? Jira?)
  - [ ] Best case: how long did it take? (1 week? 2 weeks?)
  - [ ] Worst case: what went wrong? (bugs? vendor delays? internal politics?)
  - [ ] Average: what's the realistic timeline?
- [ ] Ownership & skills:
  - [ ] Who owns it? (IT, Security, Kyle? Single owner or cross-functional?)
  - [ ] Does that person have SAML experience?
  - [ ] Is there a backup if primary owner is unavailable?
- [ ] Identity provider gotchas:
  - [ ] "Okta + Claude: do they have pre-built integration?" (if not, custom SAML?)
  - [ ] "Azure AD: does it require special configuration for Claude?" (scopes? claims?)
  - [ ] "Google Workspace: does it support Claude SAML?" (limited support?)
  - [ ] Known issues between Intinc's IdP and Anthropic Claude?
- [ ] Fallback plan if SAML fails:
  - [ ] Revert to manual API keys? (how long to generate 200 keys?)
  - [ ] Extend pilot indefinitely? (what's the blockstopper?)
  - [ ] Abandon project? (under what conditions?)

#### 5.2 What's Intinc's real on/off-boarding SLA?
- [ ] New hire day:
  - [ ] Are they active on Day 1, Day 3, or Day 5?
  - [ ] Who's responsible for provisioning? (IT? HR? Self-service?)
  - [ ] Are there approval steps? (manager? security review?)
  - [ ] Time from "offer signed" to "tool access" = how long?
- [ ] Contractor provisioning:
  - [ ] Same as employees, or separate process?
  - [ ] Who approves? (hiring manager? finance? security?)
  - [ ] Time to provision?
- [ ] Deprovisioning (off-boarding):
  - [ ] When does access revoke? (last day? next day? 30-day trailing?)
  - [ ] Is it automated (SAML + group removal) or manual (ticket)?
  - [ ] What if someone is in multiple groups and only one group is removed?
- [ ] SAML sync frequency:
  - [ ] Real-time? 5-minute cache? 15-minute cycle? (affects new hires)
  - [ ] What if IdP and Claude get out of sync? (who notices? how to fix?)

#### 5.3 Who will be in the pilot, and what biases will they have?
- [ ] Pilot selection:
  - [ ] How will 5-10 users be chosen? (self-selected volunteers? random? representative?)
  - [ ] Early adopters (biased toward success) or skeptics (biased toward failure)?
  - [ ] Mix of departments? (or just Engineering?)
- [ ] Blockers:
  - [ ] Who can veto Claude access? (security? finance? compliance?)
  - [ ] What would cause security to block it? (unmet controls? missing audit?)
  - [ ] Is there a timeline for security review, or is it open-ended?
- [ ] Will pilot feedback actually change v3.1?
  - [ ] If pilots say "memory is useless," does v3.1 disable it?
  - [ ] If pilots say "dark mode was critical," do we add it before GA?
  - [ ] Or is "pilot feedback" just theater, and v3.1 ships unchanged?

#### 5.4 What's the real failure mode if Phase 1 stalls?
- [ ] If SAML doesn't work by Week 2:
  - [ ] Revert to manual API keys? (ask for community feedback)
  - [ ] Delay GA by 2 weeks? (reschedule pilot?)
  - [ ] Escalate to VP Operations? (who's the exec sponsor?)
- [ ] If pilots don't use Claude (adoption 0%):
  - [ ] Push harder (mandatory orientation? showcase)?
  - [ ] Extend pilot (Week 8 instead of Week 4)?
  - [ ] Pivot (maybe it's not the right tool for Intinc)?
- [ ] If security raises compliance concerns:
  - [ ] Deny access until concerns resolved? (6-month delay?)
  - [ ] Approve with "temporary exception" (and never follow up)?
  - [ ] Compromise (ZDR for sensitive roles only)?
- [ ] What kills the project completely?
  - [ ] Anthropic product issue? (e.g., "no SAML support announced")
  - [ ] Intinc org issue? (e.g., "budget cut, hiring freeze")
  - [ ] Both? (convergence of risks?)

### Why This Matters

**Scenario A (Timeline Slip):** v3.1 says "SAML by Week 2," but Intinc's last SAML took 8 weeks → Phase 1 is already 6 weeks behind by mid-project.

**Scenario B (Pilot Bias):** Pilot group is hand-picked early adopters who "love AI" → they report "amazing!" → GA assumes everyone else will too → real skeptics never adopt.

**Scenario C (Blocker):** Security review discovers "memory isn't safe for contractors" → blocks entire project until Anthropic provides evidence → 3-month delay.

### Action Items
1. **Get SAML history:** How long did it take for other tools? Who owns it?
2. **Map provisioning process:** On/off-boarding SLA, approval steps, fallback if SAML fails
3. **Define success criteria:** What's "success" for Phase 1? (% adoption? feature usage? team feedback?)
4. **Pre-identify blockers:** Security review timeline? Finance approval? Executive sponsor?

---

## SUMMARY: What's Missing to Ground v3.1 in Best Practices

### Gaps in Current v3.1

| Gap | v3.1 Assumption | Reality Check Needed | Impact if Wrong |
|-----|-----------------|----------------------|-----------------|
| **Product Knowledge** | Claude Enterprise features stable for 2+ years | Features may change; ZDR may not be available; web search may have limits | Roles overestimate capabilities; IT frustration; reputational damage |
| **Org Reality** | 20 roles cover Intinc's structure; 50-200 headcount; SAML ready | May be missing teams (Security Ops, Legal); SAML may take 8 weeks; contractors provisioned differently | Missing teams don't find roles; deployment timeline wrong; contractor friction |
| **Security Framework** | ZDR + air-gapped sufficient; compliance scope clear | May lack ZT architecture; threat model missing; compliance scope (PCI/HIPAA) unverified | False confidence; audit failures; regulatory risk |
| **Industry Alignment** | RBAC is consensus; disabling memory for contractors is correct | LLM access control emerging; RBAC may be non-standard; memory risks may be theoretical | v3.1 non-compliant with future industry standards; overcautious restrictions |
| **Deployment Pragmatism** | 4-week Phase 1 realistic; pilot feedback drives iteration | SAML takes 8 weeks; pilot biased toward early adopters; security review is blocker | Timeline wrong; feedback unreliable; project stalls at security gate |

### Questions to Ask Before Going Live

**Top 5 Clarifiers:**

1. **Claude Product:** What Claude features/plans does Intinc have locked in? For how long? What are the known limitations?

2. **Org Structure:** What's Intinc's actual headcount, departments, identity provider, and MCP server list (the 13 Kyle mentioned)?

3. **Security Baseline:** Does Intinc have a Zero Trust architecture? Threat model? Real compliance status (SOC 2/PCI/HIPAA/GDPR)?

4. **Industry Alignment:** What's the emerging consensus on LLM role-based access? (RBAC? Separate instances? Something else?)

5. **Deployment Reality:** Has Intinc done SAML before? How long did it take? What's the on/off-boarding SLA? Who are the blockers?

**Answering these 5 will transform v3.1 from "theoretically sound" to "grounded in Intinc's reality and industry best practices."**

---

## Action Plan: From Clarifiers to Validated v3.1

### Phase 0: Validation (Week 1-2)
- [ ] Schedule meetings with: IT lead, Security lead, Product lead, HR lead, Kyle
- [ ] Get answers to 5 clarifiers (send questions in advance)
- [ ] Verify Claude product capabilities (contact Anthropic if needed)
- [ ] Research industry best practices (GitLab, Figma, Stripe case studies; NIST/CISA guidance)
- [ ] Document assumptions + confidence level (high/medium/low)

### Phase 1 (Updated): Deploy with guardrails
- [ ] Week 1: Resolve top 3 blockers (identity, security review, Claude limitations)
- [ ] Week 2-3: SAML setup with fallback (manual API keys if needed)
- [ ] Week 4-5: Pilot with representative group (not just early adopters)
- [ ] Week 6-7: Security review + iterate on v3.1 based on feedback
- [ ] Week 8: GA launch (if blockers resolved)

### Phase 2: Continuous validation
- [ ] Monthly: Track adoption metrics (logins, features used, support tickets)
- [ ] Quarterly: Review Claude product changes (new features, deprecations, bugs)
- [ ] Quarterly: Update threat model (new risks? emerging LLM-specific attacks?)
- [ ] Annually: Verify compliance status (SOC 2 re-audit? PCI scope change?)

---

## Conclusion

**v3.1 is functionally complete and theoretically sound, but it rests on 5 unvalidated assumptions:**

1. Claude features are available and stable ← **verify with Anthropic**
2. v3.1's 20 roles match Intinc's actual structure ← **verify with org chart**
3. Intinc has ZT + threat model + compliance ← **verify with security**
4. RBAC is industry consensus for LLM access ← **research + ask peers**
5. 4-week SAML deployment is realistic ← **check historical data**

**Before deployment, answer these 5 clarifiers. They will reveal what's missing and de-risk the project.**

---

**Document:** Clarifiers for Grounding v3.1 in Best Practices  
**Date:** December 11, 2025  
**Status:** Ready for Leadership Review  
**Next Step:** Schedule validation meetings + answer clarifiers
