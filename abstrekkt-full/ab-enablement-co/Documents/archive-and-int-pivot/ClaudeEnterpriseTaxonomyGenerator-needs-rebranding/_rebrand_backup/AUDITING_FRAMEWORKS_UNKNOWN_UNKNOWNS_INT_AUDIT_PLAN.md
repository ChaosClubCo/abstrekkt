# PROMPTING FRAMEWORKS FOR AUDITING UNKNOWN UNKNOWNS
## Applied to INT Inc Claude Role Taxonomy v4.0

**Date:** December 11, 2025  
**Status:** Ready for Implementation  
**Scope:** Comprehensive audit methodology to surface gaps, blind spots, and missed opportunities in role taxonomy

---

## EXECUTIVE SUMMARY

To audit INT Inc's Claude Role Taxonomy v4.0 for **unknown unknowns** (risks/gaps we don't know we don't know), we need frameworks that:

1. **Identify knowledge gaps** (missing context, unspecified requirements, ambiguous instructions)
2. **Reveal blind spots** (what we assume but haven't verified)
3. **Catch missing nice-to-haves** (features that add value but weren't prioritized)
4. **Test robustness** (does the system fail gracefully? What edge cases exist?)
5. **Ensure completeness** (have we covered all scenarios, all personas, all departments?)

This document presents **9 best prompting frameworks** for auditing, plus a **risk-based matrix (Johari Window)** to systematically find what we don't know we don't know.

---

## PART 1: BEST PROMPTING FRAMEWORKS FOR AUDITING

### Framework 1: CLEAR (Context, Logic, Expectations, Action, Restrictions)

**Best For:** Structured, detailed research queries that leave no ambiguity  
**Use Case:** Auditing role definitions, feature access, guardrails

**Structure:**
```
Context: [Why are we auditing this? What's the business driver?]
Logic: [What are we trying to accomplish? What questions need answers?]
Expectations: [What should the output look like? (checklist, gaps list, scoring?)]
Action: [What specific audit task? (completeness check, consistency audit, edge case testing?)]
Restrictions: [Scope boundaries? (INT-specific only? B2B model only? Security-focused?)]
```

**Example Audit Prompt (CLEAR):**
```
Context: We have a role taxonomy with 30+ roles across 7 teams. 
We need to audit it for completeness and identify gaps.

Logic: Are all roles properly configured for their team context? 
Do they have appropriate feature access (web search, memory, code exec)? 
Are there edge cases we haven't covered?

Expectations: Generate a checklist of 20+ audit questions, organized by category 
(completeness, consistency, security, usability, scalability).

Action: Audit the role taxonomy against best practices for B2B services companies 
with Claude Enterprise + SAML SSO deployment.

Restrictions: Focus on INT Inc context (41 FTE, 7 teams, managed services model). 
Don't suggest roles outside existing structure.
```

**Strength:** Leaves no room for ambiguity. Auditor knows exactly what they're looking for.  
**Weakness:** Requires detailed pre-work to define scope.

---

### Framework 2: SMART (Specific, Measurable, Achievable, Relevant, Time-bound)

**Best For:** Focused, measurable audit results with clear success criteria  
**Use Case:** Measuring adoption, feature utilization, compliance

**Structure:**
```
Specific: [Exactly what gap/risk are we auditing?]
Measurable: [How will we know we've found it? (metric, threshold, evidence?)]
Achievable: [Can we realistically test this? (data available? time?)]
Relevant: [Does this matter to INT Inc's Claude deployment?]
Time-bound: [When should we complete this audit? (pre-pilot? monthly? quarterly?)]
```

**Example (SMART):**
```
Specific: Identify all roles that may need special handling for confidential data 
(financials, customer contracts, security architecture).

Measurable: Map roles to data classification level (public/internal/confidential/restricted). 
Mark as PASS if all confidential-handling roles have proper guardrails.

Achievable: Yes - audit the role taxonomy + data classification matrix.

Relevant: Yes - INT Inc must protect customer & financial data. Security gap = 
reputational risk + compliance failure.

Time-bound: Complete before pilot deployment (Week 2-3). Review quarterly.
```

**Strength:** Metrics force precision. You can't fudge the results.  
**Weakness:** Requires defining success metrics upfront (may be hard for "unknown unknowns").

---

### Framework 3: STRIDE/PASTA (Threat Modeling for Security Audits)

**Best For:** Security-focused audits (finding threat vectors, attack surfaces)  
**Use Case:** Auditing for data exfiltration, privilege escalation, unauthorized access

**Structure (STRIDE):**
```
Spoofing: Can an attacker impersonate a role? (MFA? Device posture? SAML tokens?)
Tampering: Can outputs be modified before the user acts on them?
Repudiation: Can a user deny they asked Claude for something? (audit logs?)
Information Disclosure: Can sensitive data leak? (memory poisoning? search results?)
Denial of Service: Can Claude access be blocked or rate-limited maliciously?
Elevation of Privilege: Can a contractor escalate to Staff Engineer access?
```

**Example (STRIDE) for Sales Team:**
```
Spoofing: Sales Rep access requires SAML login (MFA required). ✅ OK
Tampering: Sales Rep generates RFP proposals in Claude. Could competitor 
modify response before it's sent? (Users should copy/verify; not a Claude issue)
Repudiation: All web searches logged to Sentry. ✅ Audit trail exists
Information Disclosure: Sales Rep can search for competitors but not customer data. 
Risk: Memory could leak customer pricing. (Mitigated: No customer data in memory)
DoS: Rate limits on web search? (Unknown) ❓ AUDIT GAP
Elevation: Can Sales Rep use code execution? (No, blocked) ✅ Correct
```

**Strength:** Forces you to think like an attacker. Reveals real security gaps.  
**Weakness:** Requires security expertise. Not all gaps are exploitable.

---

### Framework 4: Chain of Thought (CoT) Prompting

**Best For:** Complex reasoning, identifying interdependencies between roles  
**Use Case:** Tracing how decisions in one role affect others

**Structure:**
```
"Let's think step by step.

Step 1: [Premise/assumption]
Step 2: [What follows logically?]
Step 3: [Are there side effects?]
Step 4: [What could go wrong?]
Step 5: [Conclusion]"
```

**Example (CoT) for Feature Access:**
```
Q: If we give Sales Team web search access (to research competitors), 
what are the downstream implications?

Let's think step by step.

Step 1: Sales Team needs web search to research competitors & customers.
Step 2: Web search could accidentally expose INT public website, Slack invites, 
job postings → internal org info leaked.
Step 3: Side effect: Competitors learn INT hiring, product roadmap, pricing strategy.
Step 4: What could go wrong? Sales Rep accidentally shares URL with 
confidential info. Or web search returns INT's own private documents.
Step 5: Conclusion: Web search for Sales needs guardrails. Whitelist external 
sites only (competitor websites, industry reports). Block intinc.com, 
internal wikis, github.com/intinc.
```

**Strength:** Forces you to trace implications through the system.  
**Weakness:** Can be verbose. Not great for listing unknowns quickly.

---

### Framework 5: Tree of Thought (ToT) - Multi-Path Exploration

**Best For:** Exploring multiple scenarios, edge cases, alternative designs  
**Use Case:** Testing "what if" scenarios (what if we change a guardrail? what if a role is misused?)

**Structure:**
```
Root Question: [Main audit question]
├─ Path A: [Scenario 1 & implications]
├─ Path B: [Scenario 2 & implications]
└─ Path C: [Scenario 3 & implications]

Evaluation: Which path is most likely? Most risky? Most valuable?
```

**Example (ToT) for Code Execution Guardrails:**
```
Root: Should Support Engineers have code execution access?

├─ Path A (YES - Full code execution):
│   ├─ Pro: Can test fixes in real-time, faster troubleshooting
│   ├─ Con: Could access production systems if not air-gapped properly
│   ├─ Risk: Medium (test/staging only, but mistakes happen)
│
├─ Path B (NO - No code execution):
│   ├─ Pro: Safe, no risk of accidental prod changes
│   ├─ Con: Slow problem-solving, must wait for engineering team
│   ├─ Risk: Low, but UX impact = longer MTTR
│
└─ Path C (YES - Air-gapped code execution in test env only):
    ├─ Pro: Fast + safe (if properly isolated)
    ├─ Con: Requires validation that air-gapping works, costs time to setup
    ├─ Risk: Low IF isolation verified, medium IF not
    
Evaluation: Path C is best. Requires: (1) proof of air-gapping, 
(2) quarterly security audit, (3) Support Engineer training on constraints.
```

**Strength:** Maps decision trees. Great for "what-if" audits.  
**Weakness:** Requires pre-defining scenarios. May miss novel scenarios.

---

### Framework 6: LLM-as-Judge (Red Teaming / Adversarial Audit)

**Best For:** Finding holes by "attacking" the system (red team approach)  
**Use Case:** Testing robustness, finding workarounds, edge cases

**Structure:**
```
"You are an adversarial auditor. Your job is to break the INT Claude taxonomy 
and find exploits, workarounds, or gaps. 

For each role, ask:
- How could someone abuse this access?
- What's the path to escalation?
- What guardrails could be bypassed?
- What would an attacker try?

Report findings as: [Exploit] → [Impact] → [Mitigation]"
```

**Example (Red Team):**
```
Role: Sales Rep (web search ✅, memory ✅, code exec ❌)

Exploit 1: Use memory to accumulate customer data across conversations.
Impact: Breach customer confidentiality (even without code exec).
Mitigation: Mark memory with data classification tags. Audit memory quarterly.
Severity: MEDIUM

Exploit 2: Search for competitor APIs, then ask Claude to generate 
phishing email using competitor branding.
Impact: Fraud, brand damage.
Mitigation: Add prompt guardrail. Filter outputs for phishing signals.
Severity: MEDIUM

Exploit 3: Request web search for "how to use Claude memory to export data". 
Answer = Sentry logs. Then exfiltrate logs via social engineering.
Impact: Indirect but possible.
Mitigation: Restrict Sentry access to IT only. OK currently.
Severity: LOW
```

**Strength:** Finds real exploits, not just theoretical gaps.  
**Weakness:** Requires security mindset. May overstate risk.

---

### Framework 7: Johari Window (Known/Unknown Matrix) - BEST FOR UNKNOWNS

**Best For:** Systematically mapping what we know vs. don't know  
**Use Case:** Auditing for unknown unknowns, blind spots, and assumptions

**Structure:**
```
        KNOWN TO SELF       |    UNKNOWN TO SELF
        (We Know)            |    (We Don't Know)
────────────────────────────────────────────────
KNOWN TO OTHERS | Arena (Known Known)  | Blind Spot (Known Unknown)
(Visible)       | ✅ Verified, tested  | ⚠️ Others see but we don't
                |                      | (e.g., "we missed a role")
────────────────────────────────────────────────
UNKNOWN TO      | Facade (Unknown Known) | Unknown Unknown
OTHERS          | 🚩 We know but hide   | ❌ No one sees
(Hidden)        | (intentional or not)  | (the biggest risk)
────────────────────────────────────────────────
```

**Example (Johari) for INT Taxonomy:**
```
✅ ARENA (Known Known):
- 30 roles mapped ✓
- Feature access matrix defined ✓
- Security clearance levels assigned ✓
- SAML SSO plan in place ✓

⚠️ BLIND SPOTS (Known Unknown - Others see, we don't):
- Missing support roles for on-call escalation?
- Claude feature limitations we haven't stress-tested? (memory leakage? rate limits?)
- SAML sync latency effects on deployment timeline?
- Integration gaps with Sentry/PostHog auditing?

🚩 FACADE (Unknown Known - We know but aren't saying):
- Lack of training plan for 41 users?
- No rollback plan if SAML fails?
- Haven't contacted Anthropic to verify Okta integration?
- Budget not approved yet?

❌ UNKNOWN UNKNOWN (Neither we nor others see):
- What happens if Claude Enterprise deprioritizes ZDR?
- Are there LLM-specific attack vectors we haven't imagined?
- Will 41 users actually adopt, or is it theater?
- How will Claude affect hiring/firing decisions?
- Could Claude memory reveal trade secrets in transcripts?
```

**Strength:** Systematically maps all four knowledge states.  
**Weakness:** Unknown unknowns are hard to fill in (by definition!).

---

### Framework 8: Capability Gap Analysis (RACI + Features)

**Best For:** Ensuring all roles have right tools for their job  
**Use Case:** Auditing feature-to-job-fit (do roles have enough features to do their work?)

**Structure:**
```
For each role, ask:
- What's their primary job?
- What are their top 5 use cases?
- What features do they NEED? (must-have)
- What features do they WANT? (nice-to-have)
- What are they missing? (gap)
- What else could they do with more features? (untapped potential)
```

**Example (Gap Analysis) for Finance Team:**
```
Role: Financial Analyst

Primary Job: Forecasting, budgeting, variance analysis

Must-Have Features:
✅ Memory (store financial context) - HAS
✅ Files (upload spreadsheets) - HAS
✅ Artifacts (generate reports) - HAS
❌ Web search (needed for benchmarking?) - MISSING
❌ Code exec (for financial modeling?) - MISSING

Nice-to-Have (Untapped):
- Web search (industry benchmarks, competitor pricing)
  → Could add strategic pricing decisions
- Code execution (Python for financial models)
  → Could add scenario analysis, Monte Carlo simulations
- Custom instructions (org-wide financial policies)
  → Could add consistency, compliance

Gap: Finance could do 3x more with web search + code exec. 
Worth enabling? Trade-off: complexity vs. capability.
```

**Strength:** Shows what features could unlock new value.  
**Weakness:** Can lead to scope creep if not carefully managed.

---

### Framework 9: Role-Based Testing Matrix

**Best For:** Ensuring completeness - did we test all roles, all features, all guardrails?  
**Use Case:** Quality gate before deployment (checklist-based audit)

**Structure:**
```
[Role] × [Feature] × [Guardrail] × [Use Case]

For each cell: PASS / FAIL / UNKNOWN / N/A

Then summarize: % coverage, failures, unknowns
```

**Example (Test Matrix):**
```
Role: Sales Rep

Features:
├─ Web Search:
│  ├─ Can search competitors? PASS ✓
│  ├─ Blocked from intinc.com? PASS ✓
│  ├─ Blocked from customer data sites? UNKNOWN ❓
│  └─ Rate limit enforced? UNKNOWN ❓
│
├─ Memory:
│  ├─ Can store deal data? PASS ✓
│  ├─ Data expires after 30 days? UNKNOWN ❓
│  ├─ Cross-team memory isolation? PASS ✓ (assumed)
│  └─ Memory flagged as confidential? UNKNOWN ❓
│
└─ Code Execution:
   └─ Blocked? PASS ✓

Coverage: 5 PASS, 0 FAIL, 4 UNKNOWN, 0 N/A
Result: 55% tested, 45% untested

Audit Finding: Need to resolve 4 unknowns before pilot.
Actions:
1. Test web search domain blocking
2. Verify memory retention policy
3. Test rate limits under load
4. Verify memory confidentiality tagging
```

**Strength:** Clear pass/fail results. Easy to measure progress.  
**Weakness:** Requires actually testing everything (time-consuming).

---

## PART 2: JOHARI WINDOW APPLIED TO INT TAXONOMY v4.0

### Current State Assessment

#### ✅ ARENA (Known Known - We Know, Others Know)
What we've verified & documented:

| Category | Status | Evidence |
|----------|--------|----------|
| 30+ roles mapped | ✅ | v4.0 document lists all roles |
| 7 teams identified | ✅ | Org chart verified vs. LinkedIn |
| Feature access matrix | ✅ | Table in v4.0 |
| Security clearance levels | ✅ | Assigned per role (⭐ to ⭐⭐⭐⭐⭐) |
| Use cases defined | ✅ | 3-5 per role in v4.0 |
| Guardrails specified | ✅ | Summarized per team |
| SAML SSO plan | ✅ | Week 1-3 deployment path |
| Pilot size (10 users) | ✅ | Defined in deployment checklist |
| Compliance baseline | ✅ | SOC 2 Type II assumed |
| AWS architecture | ✅ | Multi-region capable |

**Confidence Level:** HIGH (90%+). Backed by research, org verification, industry standards.

---

#### ⚠️ BLIND SPOTS (Known Unknown - Others See, We Don't)

What we assume works but haven't tested:

| Gap | Impact | How to Verify |
|-----|--------|---------------|
| **SAML sync latency** | New hires wait >15 min for access; go-live stalls | Test with Okta/Azure AD; measure real sync time |
| **Memory isolation** | Could contractors see each other's data? Breach? | Load test memory across concurrent users |
| **Web search rate limits** | Sales team hits limit mid-day; frustration | Test with production load (all 41 users simultaneously) |
| **Code execution air-gap** | Does "no network egress" actually prevent exfiltration? | Security audit; pen test the air-gap |
| **Feature adoption** | Will roles actually use memory? Code exec? Or just web search? | Usage telemetry post-pilot; interview users |
| **Cost vs. budget** | 50 seats × heavy usage = $50K+/month? | Validate against finance approval |
| **Contractor off-boarding** | When contractor leaves, are their Claude memories deleted? | Test deprovisioning flow |
| **Custom instructions gap** | Org-wide instructions but per-user preferences? Missing? | Gather user feedback Week 1-2 of pilot |

**How to Fix:** Create test plan; run controlled experiments before GA.

---

#### 🚩 FACADE (Unknown Known - We Know But Aren't Saying)

Implicit assumptions or decisions not yet made public:

| Facade | What's Hidden | Risk |
|--------|--------------|------|
| **Training not planned** | We have 41 users but no training syllabus, videos, or guides | Users confused; adoption stalls; support tickets spike |
| **Rollback undefined** | What if SAML breaks mid-deployment? No Plan B documented | 4-hour outage possible; credibility damaged |
| **Anthropic relationship** | Haven't confirmed Okta/Azure AD compatibility with Anthropic | Integration might not work; 1-week delay |
| **Executive approval pending** | Leadership hasn't signed off on budget ($10-50K/month for 50 seats) | Surprise cost = project killed |
| **Security clearance process vague** | How do finance/engineering get "restricted" data access? Manual review? | Compliance gap; audit finding |
| **Usage monitoring TBD** | No dashboard set up to track adoption, feature usage, cost | Can't measure ROI; can't optimize |
| **Competitor analysis missing** | Haven't researched what GitLab, Figma, Stripe do with Claude | v4.0 may not reflect industry consensus |
| **Anthropic roadmap unknown** | ZDR might be discontinued; memory might have security issues | v4.0 could become obsolete |

**Risk:** These become scandals if discovered during deployment.

**How to Fix:** Surface them now. Make decisions. Document.

---

#### ❌ UNKNOWN UNKNOWN (Neither We Nor Others See)

The biggest risks - things we don't even know to ask about:

| Unknown | Scenario | Impact | Probability |
|---------|----------|--------|-------------|
| **LLM memory has exploitable jailbreak** | Attacker uses prompt injection to extract other users' memory | Data breach; regulatory fine | LOW-MEDIUM |
| **Claude feature pricing changes dramatically** | ZDR cost goes from included → +$10K/month | Budget shock; project paused | MEDIUM |
| **SAML provisioning breaks at scale** | Okta sync fails for >10 concurrent users | Rollback to manual keys; chaos | LOW |
| **Contractors use Claude for freelance projects** | Sales rep uses INT Claude to pitch for side hustle | IP theft; legal action | MEDIUM |
| **Claude quality degrades for niche use cases** | Memory works for execs but fails for support teams | Role-based UX nightmare | LOW |
| **B2B services firm doesn't benefit from Claude** | Manual work + doc writing not the bottleneck; other things are | Low adoption; ROI negative; project deemed failure | MEDIUM |
| **Integration with MCP servers fails** | GitHub/Jira/Sentry MCPs don't sync properly with Claude Enterprise | Engineers can't use them; capability wasted | MEDIUM |
| **Audit trail creates compliance issue** | Sentry logs contain PII; GDPR complaint filed | Breach notification; reputational damage | LOW |
| **Personal vs. work boundary blurs** | Employees use Claude for personal projects on INT account | IP ownership disputes; contractual violations | MEDIUM |
| **Tool saturation** | INT already has ChatGPT, Copilot, other AI tools; Claude is redundant | Adoption = 0%; tool fatigue | MEDIUM |

**Mitigation Strategy:** (See Section 3 below - "Audit Recommendations")

---

## PART 3: AUDIT RECOMMENDATIONS FOR v4.0

### CLARIFIER (BEFORE PROCEEDING)

**The one critical question** that will determine whether this audit is comprehensive:

---

## 🎯 CLARIFIER: Audit Scope & Risk Appetite

**Question:** 

What is INT Inc's risk tolerance for **"unknown unknowns" in the Claude deployment**, and what's the highest-priority blind spot to resolve before pilot?

**Context for Your Answer:**

1. **Risk Appetite (Choose One):**
   - **Conservative (Green):** Only deploy if we can verify ZDR, test air-gap, validate SAML, resolve all unknowns. Timeline: 6-8 weeks.
   - **Moderate (Yellow):** Deploy with pilot; accept some unknowns; use pilot to validate assumptions. Timeline: 4 weeks.
   - **Aggressive (Red):** Deploy fast; fix issues post-deployment; measure via usage. Timeline: 2-3 weeks.

2. **Highest-Priority Unknown to Resolve (Rank Top 3):**
   - [ ] **Security:** Verify memory isolation & air-gap code execution work
   - [ ] **Cost:** Validate budget & usage won't exceed approval
   - [ ] **Adoption:** Confirm user base will actually use Claude (not theater)
   - [ ] **Compliance:** Ensure SAML sync, audit trails, data classification are foolproof
   - [ ] **Integration:** Prove MCP servers + Sentry/PostHog logging work
   - [ ] **Anthropic:** Confirm Okta/Azure AD support before committing

3. **Who Owns the Audit?**
   - [ ] Security team lead
   - [ ] Finance
   - [ ] IT/Infrastructure
   - [ ] Kyle (technical lead)
   - [ ] Combination (specify)

---

## Why This Clarifier Matters

Your answer determines the **audit depth & timeline**:

- **Green (Conservative):** Full 9-point audit; all unknowns resolved → 6 weeks to GA
- **Yellow (Moderate):** Prioritize top 3 unknowns; test during pilot → 4 weeks to GA
- **Red (Aggressive):** Minimal audit; focus on deployment → 2 weeks to GA; high risk post-GA

**Without this answer:** I could recommend a 12-week security audit that overkills your needs, or a 1-week minimal audit that misses critical risks.

---

## ONCE YOU ANSWER THE CLARIFIER: Recommended Audit Tasks

### Audit Tasks (Ordered by Priority)

#### **Tier 1: Must-Do Before Pilot (Weeks 1-2)**

1. **CLEAR Framework Audit:** Enumerate 20+ questions about role completeness, guardrails, edge cases
   - Owner: Kyle + Security
   - Effort: 4 hours
   - Output: Audit checklist

2. **Johari Window Assessment:** Map all unknowns into Arena/Blind Spot/Facade/Unknown
   - Owner: Kyle
   - Effort: 2 hours
   - Output: Risk matrix (what we know vs. don't know)

3. **STRIDE Security Audit (High-Risk Roles Only):** Sales, Engineering, Finance, Executive
   - Owner: Security team
   - Effort: 6 hours
   - Output: Exploit list + mitigations

4. **Blind Spot Verification (3 Critical Items):** Test your top 3 unknowns
   - Examples: SAML latency, memory isolation, cost model
   - Owner: IT + Finance
   - Effort: 8 hours
   - Output: Verification report (PASS/FAIL/UNKNOWN)

#### **Tier 2: Nice-to-Have Before Pilot (Weeks 2-3)**

5. **Tree of Thought (ToT) Edge Case Testing:** What if SAML breaks? What if ZDR is removed? What if adoption = 0%?
   - Owner: Kyle
   - Effort: 3 hours
   - Output: Contingency plan

6. **Role-Based Test Matrix:** Spot-check 5-10 roles for feature-to-job fit
   - Owner: Team leads (Sales, Engineering, etc.)
   - Effort: 4 hours
   - Output: Coverage report (% tested)

7. **Capability Gap Analysis:** Could any role do 3x more with different features?
   - Owner: Kyle
   - Effort: 2 hours
   - Output: Feature enhancement roadmap

#### **Tier 3: Post-Pilot (Weeks 4-5)**

8. **LLM-as-Judge Red Team:** Find exploits, workarounds, abuse vectors
   - Owner: Security + Kyle
   - Effort: 6 hours
   - Output: Real attack vectors + fixes

9. **SMART Metrics Audit:** Did adoption match forecast? Feature usage? Cost?
   - Owner: Finance + Kyle
   - Effort: 2 hours
   - Output: Success/failure report

---

### Nice-to-Haves Missed in v4.0 (Suggested Additions)

Based on prompting frameworks + Johari analysis, here are features/capabilities not in v4.0 but should be considered:

| Feature | Team | Impact | Effort | Add Before Pilot? |
|---------|------|--------|--------|-------------------|
| **Custom per-user instructions** | All | Consistency, compliance | MEDIUM | Maybe |
| **Memory export** (for audit/compliance) | Finance, Legal | Compliance, data control | LOW | Yes |
| **Usage dashboard** (logins, features, costs) | All | ROI measurement, optimization | MEDIUM | Yes |
| **Role-based guardrail templates** | All | Reduces config errors | LOW | Yes |
| **Automated memory expiration** (30-day cleanup) | All | Data privacy, GDPR | MEDIUM | Yes |
| **Multi-workspace isolation** (sensitive teams) | Finance, Engineering | Extra security layer | HIGH | No (Phase 2) |
| **Prompt approval workflow** (legal reviews RFPs) | Sales | Compliance, brand control | MEDIUM | Maybe |
| **Cost attribution** (which role costs how much?) | Finance | Accountability, optimization | LOW | Yes |
| **Escalation playbook** (if Claude fails) | Operations | Business continuity | LOW | Yes |
| **Contractor deprecation plan** (off-board memory) | HR/IT | Compliance | LOW | Yes |
| **Anthropic SLA review** (support, uptime guarantees) | IT | Risk management | N/A | Yes |

**Priority Additions (Pre-Pilot):**
1. ✅ Usage dashboard
2. ✅ Memory export (audit trail)
3. ✅ Memory auto-expiration
4. ✅ Cost attribution
5. ✅ Escalation playbook

**Nice-to-Have (Phase 2):**
1. Custom per-user instructions
2. Multi-workspace isolation
3. Prompt approval workflow

---

### Success Criteria (Post-Audit)

Before proceeding to GA, v4.0 must pass:

| Criterion | Definition | Owner |
|-----------|-----------|-------|
| **Completeness** | All 41 roles have defined use cases, features, guardrails | Kyle |
| **Security** | STRIDE audit done; no high-risk exploits; air-gap verified | Security |
| **Consistency** | All roles in same team have uniform feature access | Kyle |
| **Compliance** | SOC 2, SAML SSO, audit trails, data classification aligned | IT/Legal |
| **Testability** | 80%+ of roles tested in pilot; coverage >80% | QA/Kyle |
| **Adoption** | 70%+ of pilot users active; <5 support tickets | Kyle |
| **Cost** | Usage <$50K/month; aligns with budget | Finance |
| **Risk Mitigation** | Top 3 unknowns resolved; blind spots validated | Risk owner |

**Fail Criteria (Gate Before GA):**
- Security audit finds high-risk exploit → Fix before GA
- SAML sync fails → Debug or revert to manual keys
- Cost exceeds budget → Reduce scope or request budget increase
- Adoption <50% → Extend pilot; investigate blockers

---

## CONCLUSION

**v4.0 is a strong foundation**, but it has **unknowns and blind spots** typical of any first deployment:

1. ✅ **What we've done well:** Roles mapped, features assigned, guardrails defined, deployment path clear
2. ⚠️ **What we haven't tested:** SAML sync, memory isolation, code execution air-gap, usage patterns, cost model, adoption rate
3. 🚩 **What we're assuming:** Training will happen, rollback will work, contractors know the rules, budget is approved
4. ❌ **What we can't predict:** LLM attacks, feature deprecations, Anthropic roadmap changes, B2B value proposition

**Next Step:** **Answer the Clarifier.** Your risk tolerance determines audit depth.

- **Green:** Full audit (6 weeks)
- **Yellow:** Prioritized audit (4 weeks)
- **Red:** Minimal audit (2 weeks)

Once you decide, I'll generate the specific audit prompts, test plan, and success metrics.

---

**Document:** Best Prompting Frameworks for Auditing Unknown Unknowns + INT Inc Audit Plan  
**Status:** Ready for Clarifier Response  
**Date:** December 11, 2025
