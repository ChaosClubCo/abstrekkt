# INT Inc AI Pilot Scorecard Template

**Pilot Name:** ________________________  
**Pilot Owner:** ________________________  
**Pilot Phase:** ☐ Weeks 1–4 (Setup) | ☐ Weeks 5–8 (Build) | ☐ Weeks 9–12 (Validate) | ☐ Weeks 13+ (Scale)  
**Scorecard Date:** ________________________  
**Next Review:** ________________________

---

## Section 1: Pilot Overview & Objectives

### 1.1 Pilot Hypothesis
*What are you trying to prove? What is the core assumption?*

Example: "AI-powered support copilot will reduce average handle time (AHT) by 25–40% while maintaining or improving CSAT, enabling support team to handle 50–75% more tickets with same headcount."

**Your Hypothesis:**
```
[Write hypothesis here, referencing Section 2–5 of the Hierarchy]
```

### 1.2 Primary Success Metrics (GO/NO-GO Criteria)
*Define 2–3 non-negotiable metrics. If these aren't met, pilot stops or pivots.*

| Metric | Target | Current | Status | Owner |
|--------|--------|---------|--------|-------|
| **Primary Metric 1:** | | | ☐ On Track ☐ At Risk ☐ Off Track | |
| **Primary Metric 2:** | | | ☐ On Track ☐ At Risk ☐ Off Track | |
| **Primary Metric 3:** | | | ☐ On Track ☐ At Risk ☐ Off Track | |

**Decision Rule:** Go/Scale if ≥2/3 on track. No-Go if ≤1/3 on track.

### 1.3 Secondary Success Metrics (Value Signals)
*Track these; they inform medium-term decisions and Medium/Long-Term Win phasing.*

| Metric | Target | Current | Status | Notes |
|--------|--------|---------|--------|-------|
| Metric 1: | | | | |
| Metric 2: | | | | |
| Metric 3: | | | | |

### 1.4 Constraints & Boundaries
*What is OUT OF SCOPE for this pilot?*

- [ ] Geography / customer segments (specific regions, customer sizes excluded)
- [ ] Feature scope (e.g., no multi-language support; no custom integrations)
- [ ] Team scope (e.g., support team only, no sales/marketing participation)
- [ ] Data scope (e.g., last 12 months only; anonymized data)
- [ ] Cost cap (e.g., <$5K for Initiative 1)
- [ ] Timeline (e.g., <30 days deployment for Quick Wins)

**Your Constraints:**
```
[List constraints here]
```

---

## Section 2: Health & Status Summary

### 2.1 Overall Pilot Health
**Status:** ☐ Green (On Track) | ☐ Yellow (At Risk) | ☐ Red (Off Track)

**Confidence in Go/No-Go Decision:** ☐ High (80%+) | ☐ Medium (50–80%) | ☐ Low (<50%)

### 2.2 Key Risks & Mitigations (This Period)

| Risk | Probability | Impact | Mitigation | Owner | Status |
|------|-------------|--------|-----------|-------|--------|
| **Risk 1:** | ☐ Low ☐ Med ☐ High | ☐ Low ☐ Med ☐ High | Specific action | | ☐ Open ☐ In Progress ☐ Mitigated |
| **Risk 2:** | ☐ Low ☐ Med ☐ High | ☐ Low ☐ Med ☐ High | Specific action | | ☐ Open ☐ In Progress ☐ Mitigated |

### 2.3 Key Assumptions Being Tested

| Assumption | Test Method | Result | Valid? | Owner |
|-----------|-----------|--------|---------|-------|
| Example: "Knowledge base quality is sufficient for 50% deflection" | Pilot data shows KB hits vs misses | 47% hit rate | ☐ Yes ☐ No ☐ TBD | |
| | | | | |

### 2.4 Budget & Resource Tracking

| Item | Budget | Spent YTD | Remaining | Status | Notes |
|------|--------|-----------|-----------|--------|-------|
| **Software/APIs** | | | | | |
| **Labor (FTE-weeks)** | | | | | |
| **Integrations/Infrastructure** | | | | | |
| **Contingency (10%)** | | | | | |
| **TOTAL** | | | | | |

**Burn Rate:** $_____ per week | **Projected Final Cost:** $_____ | **Target Budget:** $_____

---

## Section 3: Initiative-Specific Metrics (Choose Template Below)

### A. Quick Win: AI Support Copilot (Initiative 1)

**Section 2.3 Reference:** Success Metrics from WSJF List

#### 3.A.1 Time Savings
- **Metric:** Avg handle time (AHT) reduction
  - Baseline: _____ minutes
  - Target: _____ minutes (25–40% reduction)
  - Current: _____ minutes
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  - **Notes:** 
  
- **Metric:** % of time spent in AI copilot drafting
  - Target: >60% of tickets use copilot draft
  - Current: _____% 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  
#### 3.A.2 Ticket Deflection & Efficiency
- **Metric:** Ticket deflection rate
  - Target: 50–75%
  - Current: _____% 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  - **Notes:** Deflection = % of tickets resolved by AI without human edit; <5% edit rate acceptable
  
- **Metric:** Agent "edit rate" (% of copilot drafts edited by rep)
  - Target: <15% (reps trust drafts)
  - Current: _____% 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  
#### 3.A.3 Customer Satisfaction
- **Metric:** CSAT (by survey or NPS proxy)
  - Baseline: _____ / 5.0
  - Target: Maintain or improve (≥baseline)
  - Current: _____ / 5.0
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  
- **Metric:** First Contact Resolution (FCR) or resolution rate
  - Baseline: _____% 
  - Target: +10–20% improvement (tied to Section 3.2.1 AssemblyAI case: 27% → 50%)
  - Current: _____% 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  
#### 3.A.4 Cost & Deployment
- **Metric:** Total implementation cost
  - Target: <$5K
  - Current: $_____ (spend to date)
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  
- **Metric:** Days to deployment
  - Target: <30 days
  - Current: _____ days elapsed
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track

#### 3.A.5 Data Quality & Governance
- **Metric:** KB hit rate (% of queries matched to knowledge base)
  - Target: >60%
  - Current: _____% 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  - **Notes:** Track misses; update KB monthly (Section 4.2.1 asserts KB quality drives resolution rate)
  
- **Metric:** Data governance compliance (Section 9.1 NIST RMF)
  - ☐ Risk mapping complete
  - ☐ Monitoring dashboards active
  - ☐ Incident response process defined
  - ☐ Monthly governance review scheduled
  
---

### B. Quick Win: Invoice Processing (Initiative 2)

**Section 2.3.3 Reference:** Section 5.4 Professional Services ROI Formula

#### 3.B.1 Time Savings
- **Metric:** Time per invoice (manual processing)
  - Baseline: _____ minutes
  - Target: 15–40% reduction
  - Current: _____ minutes
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  
- **Metric:** Invoices processed per FTE per month
  - Baseline: _____ invoices/FTE/month
  - Target: 6x improvement (e.g., 50 → 300)
  - Current: _____ invoices/FTE/month
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track

#### 3.B.2 Accuracy & Quality
- **Metric:** Extraction accuracy (% of fields correctly extracted on first pass)
  - Target: >95%
  - Current: _____% 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  - **Notes:** Track false positives; log edge cases for model retraining
  
- **Metric:** False-positive anomaly rate (% flagged invoices that are actually valid)
  - Target: <1%
  - Current: _____% 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track

#### 3.B.3 Cost & ROI
- **Metric:** Cost savings (monthly)
  - Calculation: (Hours Saved/Week × Loaded Labor Cost × 4.3) per Section 5.4
  - Target: $30K+ annual savings
  - Current: $_____ / month
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  
- **Metric:** Payback period
  - Target: <2 months (given $8.5K cost, should breakeven by month 2–3)
  - Current: _____ months estimated
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track

#### 3.B.4 Compliance & Governance
- **Metric:** SOC 2 Type II attestation obtained (Section 9.2)
  - ☐ Yes (date: _____) | ☐ In Process (target: _____) | ☐ Not Started
  
- **Metric:** Monthly extraction accuracy audit
  - ☐ Completed (last date: _____)
  - ☐ Scheduled for: _____
  - Sample size: _____ invoices

---

### C. Medium Win: Churn Prediction (Initiative 5)

**Section 3.2.1 Reference:** Section 5.2 ROI Benchmarks

#### 3.C.1 Prediction Accuracy
- **Metric:** Model AUC (area under ROC curve)
  - Target: >0.75 (validation set)
  - Current: _____ 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  - **Notes:** Measure precision >70%; avoid false alarms on healthy customers
  
- **Metric:** Top 10 churn factors identified & validated
  - ☐ Completed (factors: _____)
  - ☐ In Progress
  - ☐ Not Started

#### 3.C.2 Business Impact (Winback Campaign)
- **Metric:** Winback campaign conversion rate
  - Baseline: _____ % (historical)
  - Target: 260% uplift (per Hydrant case, Section 3.2.1)
  - Current: _____% 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  
- **Metric:** Revenue per recovered customer
  - Target: $310 (per Hydrant case)
  - Current: $_____ average
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  
- **Metric:** Churn reduction (% of predicted churners retained)
  - Target: 20%+ churn rate reduction (per Telecom case, Section 3.2.1)
  - Current: _____% 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track

#### 3.C.3 Team Adoption
- **Metric:** CS team adoption of churn predictions
  - Target: >90% of team using predictions within 30 days of launch
  - Current: _____% 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  
- **Metric:** Human-in-loop decision tracking
  - ☐ Logging system active (date: _____)
  - Monitor: % of AI predictions acted upon by CS team (target: >60%)
  - Current: _____% 

#### 3.C.4 Cost & ROI
- **Metric:** Model build & deployment cost
  - Target: <$8K
  - Current: $_____ 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  
- **Metric:** Monthly cost savings (avoided churn)
  - Target: >$5K/month (assumes >10 recovered customers/month @ $310 each + retention value)
  - Current: $_____ / month
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  - **ROI:** _____ x (within 60 days if positive)

#### 3.C.5 Data Quality & Model Drift (Section 8.3)
- **Metric:** CRM data quality (% complete, consistent)
  - Target: >95% valid, >85% non-null
  - Current: Valid ____%, Non-null ____% 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  
- **Metric:** Monthly model retraining & AUC monitoring
  - ☐ Retraining process defined
  - Last retraining: _____ (target: monthly)
  - AUC trend (last 3 months): _____ → _____ → _____ (alert if >5% drop)

---

### D. Long-Term Win: Multi-Agent Orchestrator (Initiative 6)

**Section 4 & 6 Reference:** Section 4.2 Multi-Agent Examples, Section 9 Governance

#### 3.D.1 POC Phase (Months 1–4)
- **Metric:** Agent architecture design document completed
  - ☐ Yes (date: _____) | ☐ In Progress | ☐ Not Started
  - Agents defined: _____ (target: 2 for POC, 4 for MVP)
  
- **Metric:** POC implementation (2 agents running)
  - ☐ Yes (date: _____) | ☐ In Progress | ☐ Not Started
  - Agent 1: _____ (e.g., Support Coordinator)
  - Agent 2: _____ (e.g., QA Planner)

- **Metric:** POC validation against Quick Win data
  - ☐ Completed (date: _____) | ☐ In Progress | ☐ Scheduled for _____
  - Latency (target: <5 sec per decision): _____ sec
  - Accuracy (target: >85% decision quality): _____% 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track

#### 3.D.2 MVP Phase (Months 5–9)
- **Metric:** 4-agent system live (Support Coordinator, QA Planner, Customer Health Monitor, Supervisor)
  - ☐ Deployed (date: _____) | ☐ In Development | ☐ Planning
  
- **Metric:** Production system integrations (Freshservice, CRM, QA platform)
  - Freshservice: ☐ Connected | ☐ In Progress | ☐ Planned
  - CRM: ☐ Connected | ☐ In Progress | ☐ Planned
  - QA platform: ☐ Connected | ☐ In Progress | ☐ Planned

- **Metric:** Internal pilot scope
  - Target: 20–30% of operations workload
  - Current: _____% 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track

- **Metric:** Agent decision accuracy
  - Target: >90% (human-validated)
  - Current: _____% 
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track
  - Escalation rate (target: <10%): _____% 

#### 3.D.3 Risk & Governance (All Phases)
- **Metric:** NIST RMF compliance (Section 9.1)
  - ☐ GOVERN: AI governance culture & accountability framework (date: _____)
  - ☐ MAP: Agent roles, risks, and decision boundaries documented (date: _____)
  - ☐ MEASURE: Monitoring dashboards active for accuracy, cost, drift (date: _____)
  - ☐ MANAGE: Escalation and incident response procedures (date: _____)

- **Metric:** SOC 2 Type II readiness
  - ☐ Audit scheduled (date: _____)
  - ☐ In Progress
  - ☐ Completed
  - Control design review: ☐ Completed | ☐ In Progress

- **Metric:** Human-in-loop guardrails (Section 9.3, Graduated Autonomy)
  - ☐ Decision thresholds defined ($100 agent-only, $500–$5K human-in-loop, >$5K human-driven)
  - ☐ Testing completed; working as designed
  - **Status:** ☐ On Track ☐ At Risk ☐ Off Track

- **Metric:** Model drift monitoring (Section 8.3)
  - Agent decision accuracy tracked: ☐ Daily | ☐ Weekly | ☐ Manual
  - Alert threshold: If accuracy <90% for 5 consecutive checks
  - **Status (last check):** Accuracy _____ % | ☐ Alert Triggered ☐ Normal

#### 3.D.4 Cost Tracking (Long-Term)
- **Phase Budget vs. Spend**
  - Phase 1 (Design/POC): Budget $30K | Spent $_____ | Remaining $_____ | Status: ☐ On Track ☐ At Risk
  - Phase 2 (MVP): Budget $80K | Spent $_____ | Remaining $_____ | Status: ☐ On Track ☐ At Risk
  - Phase 3 (Beta/Productization): Budget $60K | Spent $_____ | Remaining $_____ | Status: ☐ On Track ☐ At Risk
  - Phase 4 (GTM): Budget $30K | Spent $_____ | Remaining $_____ | Status: ☐ On Track ☐ At Risk

- **Contingency Reserve:** $_____ remaining (target: 30% of active phase budget)

---

## Section 4: Champion Program & Team Feedback

### 4.1 Champion Recruitment & Engagement

| Champion Name | Role | Hours/Week Allocated | Participation | Key Feedback | Status |
|---------------|------|---------------------|----------------|--------------|--------|
| | | | ☐ Active ☐ At Risk ☐ Inactive | | |
| | | | ☐ Active ☐ At Risk ☐ Inactive | | |

**Target:** 1–2 champions per Quick Win; 2–3 per Medium Win (per Section 6 guidance)

### 4.2 Team Engagement & Morale
- **Pilot team sentiment:** ☐ Enthusiastic | ☐ Neutral | ☐ Concerned | ☐ Resistant
- **Key blockers or concerns from team:**
  ```
  [Notes]
  ```
- **Quick wins to celebrate (in addition to metrics):**
  ```
  [Notes]
  ```

### 4.3 Executive Sponsorship & Support
- **Executive sponsor name:** _____
- **Sponsor engagement level:** ☐ Highly Engaged | ☐ Moderate | ☐ Minimal
- **Sponsor sign-off on go/no-go decision needed?** ☐ Yes (date: _____) | ☐ No | ☐ TBD
- **Key decision/resource needed from exec:** 
  ```
  [Notes]
  ```

---

## Section 5: Next Phase & Decisions

### 5.1 Current Phase Summary
**Phase:** ☐ Setup | ☐ Build | ☐ Validate | ☐ Scale | ☐ Completed

**Accomplishments this period:**
```
[Bullet list of key wins, learnings, deliverables]
```

**Open items / blockers:**
```
[Bullet list]
```

### 5.2 Go/No-Go Recommendation & Timeline

**Recommended Decision:** ☐ **GO** (Scale/Proceed) | ☐ **NO-GO** (Stop/Pivot) | ☐ **CONDITIONAL** (Proceed with conditions)

**Rationale:** 
```
Reference Section 2.1 Primary Success Metrics and Section 1.2 decision rule.
Explain which metrics are on track and which are at risk.
```

**Conditions (if conditional):**
```
What must be true to move forward?
```

**Next Phase Start Date:** _____ 

**Expected Phase Duration:** _____ weeks

**Successor Initiative or Pivot:** 
- ☐ Scale to broader use case (specify: _____)
- ☐ Pivot to related use case (specify: _____)
- ☐ Stop pilot; extract learnings and move to backlog (specify: _____)

### 5.3 Learnings & Insights for Successor Initiatives

**What worked well (to replicate):**
```
[Key findings that apply to Initiatives 2–6]
```

**What could be better (to avoid):**
```
[Lessons learned]
```

**Data/artifacts to share with next pilot:**
```
[Training data, prompts, templates, vendor configurations, processes]
```

### 5.4 Research Refresh Needed?

**Per Section 10.2, refresh these metrics quarterly:**
- ☐ Capgemini ROI benchmark (current: 1.7x) – refresh June 2026
- ☐ Gartner GenAI abandonment rate (current: 30%) – refresh July 2026
- ☐ MSP AI adoption statistics (current: 71% using automation, 47% selling AI) – refresh Q1 2026 CompTIA report
- ☐ Andrew Ng agentic AI adoption (current: 21% using multi-agent systems) – refresh quarterly surveys

**Action:** Update WSJF scores in WSJF-Initiatives-List.md by _____ if benchmarks shift >10%.

---

## Section 6: Appendices

### 6.A Data Snapshot (Template for Quick Wins)

**Reporting Period:** _____ to _____

#### Support Copilot (Initiative 1)
```
Week 1–2:  AHT _____ min | Deflection _____ % | CSAT _____ / 5.0 | KB Hit Rate _____ %
Week 3–4:  AHT _____ min | Deflection _____ % | CSAT _____ / 5.0 | KB Hit Rate _____ %
Week 5–6:  AHT _____ min | Deflection _____ % | CSAT _____ / 5.0 | KB Hit Rate _____ %
Trend:     ☐ Improving | ☐ Stable | ☐ Declining
```

#### Invoice Processing (Initiative 2)
```
Week 1–2:  Invoices/FTE _____ | Accuracy _____ % | False Positives _____ % | Cost/Invoice $___
Week 3–4:  Invoices/FTE _____ | Accuracy _____ % | False Positives _____ % | Cost/Invoice $___
Week 5–8:  Invoices/FTE _____ | Accuracy _____ % | False Positives _____ % | Cost/Invoice $___
Trend:     ☐ Improving | ☐ Stable | ☐ Declining
```

### 6.B Risk Register (Ongoing Maintenance)

| Risk ID | Risk Description | Probability | Impact | Current Status | Mitigation Owner | Mitigation Action | Target Resolution |
|---------|------------------|-------------|--------|-----------------|------------------|-------------------|------------------|
| R001 | Example: KB quality insufficient for 50% deflection target | High | High | Open | PM | Weekly KB quality audit | Week 4 |
| | | | | | | | |

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Pilot Owner | | | |
| Product Manager | | | |
| Executive Sponsor | | | |
| Governance/Compliance Lead | | | |

**Scorecard Distribution:**
- [ ] Sent to Executive Sponsor
- [ ] Sent to Product/Portfolio Management
- [ ] Sent to Team (Champions + Key Stakeholders)
- [ ] Archived in Pilot Documentation Repository (e.g., Notion, Confluence)

---

**Document Version:** 1.0  
**Last Updated:** _____  
**Next Scorecard Review:** _____

*For questions or clarifications, contact [Pilot Owner Name] or the INT Inc AI Center of Excellence.*
