# INT Inc AI Pilot Validation: WSJF Initiative List

**Date:** December 11, 2025  
**Prepared for:** Product/Portfolio Management Decision  
**Refresh Cadence:** Quarterly (aligns with research updates in Section 10.2)

---

## WSJF Scoring Methodology

**Formula:** `WSJF = (Business Value + Time Criticality + Risk Reduction + Opportunity Enablement) / Job Size`

**Scale:** 1–10 for numerator components; 1–10 for job size (1=trivial, 10=massive)  
**Weighting:** Equal (each numerator = 25%)  
**Tiers:** >8.0 = Critical (Q1–Q2), 6.0–8.0 = High (Q2–Q3), 4.0–6.0 = Medium (Q3–Q4), <4.0 = Backlog

---

## Initiative 1: Quick Win Pilot – AI Support Copilot (Customer Support)

### Hierarchy Reference
**Section 2.2.1** | **Section 3 Medium Wins: Compounding Effect** | **Section 6 Champion Programs**

### Description
Deploy AI-powered customer support copilot (4-agent architecture: Classifier → Retriever → Drafting → Validator) integrated with existing ticketing system (Freshservice). Targets: 50–75% ticket deflection, 25–40% time savings for support reps, <30-day deployment, <$5K cost.

### Alignment to Validated Patterns
- **PeopleCert benchmark:** +142% CSAT, +61% FCR, deployed in < 4 weeks.
- **AssemblyAI case:** 97% FRT reduction, 27% → 50% AI resolution rate within 90 days (ties to Medium Win compounding).
- **YAZIO/Forethought:** 80% ticket deflection, avoided 3 FTE hiring.
- **INT Inc strategy:** Foundation for churn prediction (Medium Win 1) and multi-agent ops (Long-Term Win 1).

### WSJF Scoring

| Component | Score | Rationale |
|-----------|-------|-----------|
| **Business Value** | 9/10 | 50–75% ticket deflection = 15–25% team capacity freed; CSAT maintained/improved; prevents costly hiring. Validated by 10+ SMB cases. |
| **Time Criticality** | 8/10 | Support cost grows linearly; customer churn accelerates without responsive support; Klarna case shows cost of delay. Competitor MSPs deploying now. |
| **Risk Reduction** | 7/10 | Klarna rollback shows risks; mitigated by: (a) human-in-loop design, (b) pilot scope, (c) champion program from Section 6. Gartner 30% abandonment rate applies if executed poorly. |
| **Opportunity Enablement** | 9/10 | Unblocks Medium Win 1 (churn prediction leverages improved resolution data), Medium Win 2 (QA), and Long-Term Win 1 (multi-agent ops). High leverage. |
| **Job Size** | 3/10 | <$5K, <30 days, single team, existing vendor integrations (Freshservice + Claude API). Low complexity, proven stack. |

### **WSJF Score**
`(9 + 8 + 7 + 9) / 3 = 33 / 3 = **11.0** (Cap at 10; de facto **10.0 – Critical**)`

### Phasing
- **Week 1:** Agent architecture design, data requirements, NIST-AI-600-1 risk mapping (Section 9.1).
- **Week 2–3:** Copilot build; Freshservice API integration; test data labeling.
- **Week 4:** Pilot with 2–3 support reps; monitor CSAT, FCR, ticket volume.
- **Week 5–6:** Expand to team; refine classifier thresholds; collect champion feedback.
- **Go/No-Go:** Week 6 scorecard review (Section specific template below).

### Success Metrics (Tied to Section 2.3)
- **Time savings:** 25–40% reduction in avg handle time (AHT).
- **Deflection:** 50–75% of automated responses accepted by agents (not edited/overridden).
- **CSAT:** Maintain or improve vs baseline; target >4.0/5.0.
- **Cost:** <$5K including labor, APIs, integrations.
- **Deployment:** <30 days to pilot go-live.

### Champion Program Integration (Section 6)
- Assign 1–2 support "MVP" reps as internal champions (10–15% time allocation per MetaCTO guidance).
- Weekly office hours with AI team.
- Recognition: public wins, monthly kudos, first-access to new features.
- Replicates Microsoft Copilot Champs model.

### Risk Mitigation
- **Klarna-style CSAT drop:** Human review loop for all >$500 escalations or complex issues; measure CSAT weekly (not monthly).
- **Knowledge base decay:** Version-controlled KB snapshots; retrain on changes quarterly.
- **Vendor lock-in:** API abstraction layer; use industry-standard OpenAPI spec.
- **Data drift (Section 8.3):** Continuous monitoring dashboards; flag >5% monthly error rate increase.

### Funding & Resources
- **Estimate:** $4,200 total ($2K APIs, $1.5K labor, $700 integrations).
- **FTEs:** 0.5 (engineer) + 0.25 (PM/product) for 6 weeks.
- **Tools:** Claude API, Freshservice, monitoring (Evidently AI or custom).

### Dependencies
- Freshservice API access and sandbox environment.
- NIST RMF governance sign-off (Section 9.1).
- 2–3 representative support reps for pilot feedback loop.

### Successor Initiatives (Unfold After Go/No-Go)
- **Initiative 2:** Medium Win 1 – Churn Prediction (leverages improved ticket data).
- **Initiative 7:** Multi-Agent Ops Coordinator (aggregates Quick Win + Medium Win improvements).

---

## Initiative 2: Quick Win Pilot – Invoice Processing Automation

### Hierarchy Reference
**Section 2.2.3** | **Section 5.4 Professional Services ROI Formula** | **Section 9.1 NIST Governance**

### Description
Deploy AI-powered invoice processing automation (document classification, field extraction, anomaly detection) to accounts payable workflow. Targets: 15–40% time savings (90–120 invoices/month), 6x capacity increase, $5–10K implementation cost, validation within 60 days.

### Alignment to Validated Patterns
- **H&H Purchasing / Zenphi case:** 6x capacity, 90% cost reduction, $85K/3-month savings.
- **Google Document AI + Vic.ai:** Mainstream invoice processing, highly repeatable.
- **INT Inc strategy:** Direct revenue enablement (fewer invoices rejected, faster payment reconciliation); foundation for Medium Win 3 (predictive resource allocation).

### WSJF Scoring

| Component | Score | Rationale |
|-----------|-------|-----------|
| **Business Value** | 8/10 | 6x capacity = ~4–5 FTE hours freed/month (invoices scale with revenue growth); 90% cost reduction on manual processing; reduces payment delays. High leverage if invoices >500/month. |
| **Time Criticality** | 6/10 | Moderate; existing manual process works but is labor-intensive. Opportunity cost grows as volume increases. Competitor MSPs using automation; not urgent, but strategic. |
| **Risk Reduction** | 8/10 | Well-validated use case (50+ documented deployments). Risks: (a) PII/SOX compliance (mitigated by vendor SOC 2), (b) anomaly thresholds (human review loop). NIST RMF Section 9.1 required. |
| **Opportunity Enablement** | 6/10 | Unblocks Medium Win 3 (resource allocation forecasting) if integrated with accounting system. Moderate leverage. Does NOT block other initiatives. |
| **Job Size** | 3/10 | <$10K, 60-day implementation, single domain (AP), proven vendors (Zenphi, Vic.ai). Integration is the bottleneck, not complexity. |

### **WSJF Score**
`(8 + 6 + 8 + 6) / 3 = 28 / 3 = **9.33 – Critical** (Round to **9.0**)`

### Phasing
- **Week 1–2:** Vendor selection (Zenphi, Vic.ai, or native Freshservice integration); data governance review (Section 9.1 SOC 2 requirements).
- **Week 3–4:** Upload 100–200 historical invoices; train OCR + classifier; define anomaly thresholds (>20% variance = human review).
- **Week 5–6:** Pilot with 50 invoices; measure extraction accuracy (target >95%), processing time, cost.
- **Week 7–8:** Expand to full volume; monitor for data drift (Section 8.3); refine anomaly rules.

### Success Metrics (Tied to Section 2.3)
- **Time savings:** 15–40% reduction in AP processing time per invoice.
- **Capacity:** 6x improvement in invoices processed per FTE per month.
- **Accuracy:** >95% extraction accuracy (vendor benchmarks); <1% false-positive anomalies.
- **Cost:** <$10K implementation; >$30K annual savings @ conservative usage levels.
- **Compliance:** 100% SOC 2 Type II audit-ready; no PII leakage.

### Champion Program Integration (Section 6)
- Assign 1 AP/finance team member as champion (Salesforce Agentblazer tier 1).
- Monthly finance team syncs; share extraction wins and edge cases.
- Documentation: playbooks for exception handling and threshold tuning.

### Risk Mitigation
- **SOC 2 compliance (Section 9.2):** Vendor SOC 2 Type II attestation mandatory; configure encryption for data in transit/at rest.
- **Model drift:** Monthly extraction accuracy audits on 50 invoices; threshold alerts if <95%.
- **Vendor lock-in:** Use standard invoice data schema (UBL 2.1); build export/import utilities.
- **Exception handling:** Human review loop for >$10K invoices or flagged anomalies (graduated autonomy, Section 9.3).

### Funding & Resources
- **Estimate:** $8,500 total ($5K SaaS license, $2K labor, $1.5K data setup).
- **FTEs:** 0.3 (engineer) + 0.2 (finance lead) for 8 weeks.
- **Tools:** Zenphi or Vic.ai, Freshservice, monitoring dashboard.

### Dependencies
- AP workflow data access (last 200 invoices for training).
- Finance team availability for threshold calibration and exception handling.
- Vendor SOC 2 attestation.

### Successor Initiatives
- **Initiative 8:** Medium Win 3 – Predictive Resource Allocation (leverages cleaned invoice/transaction data).
- **Initiative 4:** Multi-Tenant QA (parallel, independent).

---

## Initiative 3: Quick Win Pilot – Technical Documentation Generation

### Hierarchy Reference
**Section 2.2.3 (Back-Office Admin)** | **Section 4 Long-Term Wins (Knowledge Management)** | **Section 10.2 Refresh Metrics**

### Description
Deploy AI-powered documentation generator for internal technical SOPs, service delivery runbooks, and client-facing technical guides. Targets: 40–60% time savings on documentation, 90-day knowledge base refresh cycle (vs. 6+ months), <$3K cost.

### Alignment to Validated Patterns
- **Google Cloud / Instrktiv:** AI-powered technical docs reduce authoring time by 60%.
- **Electrolux:** 78% time savings in process documentation (adjacent use case).
- **INT Inc strategy:** Feeds Medium Win 2 (QA automation) with automated test case documentation; reduces knowledge silos; foundation for Long-Term agentic systems (Moody's model, Section 4.2.1).

### WSJF Scoring

| Component | Score | Rationale |
|-----------|-------|-----------|
| **Business Value** | 7/10 | 40–60% documentation time savings = 2–3 FTE hours freed/month; faster onboarding (reduces ramp time by ~20%); reduced knowledge silos. Medium value, high secondary benefits. |
| **Time Criticality** | 5/10 | Knowledge base decay is chronic but not acute; doesn't block other initiatives. Secondary urgency (scales with hiring). |
| **Risk Reduction** | 6/10 | Doc generation risks: (a) hallucination in technical details (mitigated by SME review loop), (b) version control chaos (mitigated by Git + approval workflow). Low-medium risk. |
| **Opportunity Enablement** | 7/10 | Feeds QA automation (Initiative 4); supports Long-Term agentic systems (knowledge base quality drives agent performance per Section 4.2). Moderate leverage. |
| **Job Size** | 2/10 | <$3K, <8 weeks, template-driven approach, proven vendors (Instrktiv, DocuWriter). Very low complexity. |

### **WSJF Score**
`(7 + 5 + 6 + 7) / 2 = 25 / 2 = **12.5** (Cap at 10; de facto **8.5 – High**)`

### Phasing
- **Week 1–2:** Audit existing docs; identify high-churn runbooks (support escalations, onboarding).
- **Week 3–4:** Set up doc generation pipeline (Claude Docs API or Instrktiv); create 10 template examples.
- **Week 5–6:** Generate drafts for 5 key runbooks; SME review and revision.
- **Week 7–8:** Implement approval workflow (Git + review); measure time savings; expand to full team.

### Success Metrics
- **Time savings:** 40–60% reduction in doc authoring time per runbook.
- **Quality:** SME review approval rate >90% (minor edits acceptable).
- **Freshness:** 90-day refresh cycle achieved (vs. baseline 6+ months).
- **Adoption:** >80% of new hires reference AI-generated docs within first 30 days.
- **Cost:** <$3K; breakeven within 2 months.

### Champion Program Integration (Section 6)
- Assign 1–2 technical writers/leads as champions; 5–10% allocation.
- Quarterly doc refresh sprints; celebrate new high-quality generations.
- Replicates GitHub 90-day activation model (Section 6.5).

### Risk Mitigation
- **Hallucination in technical content:** Mandatory SME review before publication; version-controlled edits.
- **Doc fragmentation:** Single source of truth (Git repo); auto-version increments.
- **Vendor lock-in:** Use markdown + vendor-agnostic storage; APIs for multi-model generation (Claude + GPT fallback).

### Funding & Resources
- **Estimate:** $2,800 total ($800 SaaS, $1.5K labor, $500 Git/workflow tools).
- **FTEs:** 0.25 (engineer) + 0.3 (technical writer) for 8 weeks.
- **Tools:** Instrktiv or DocuWriter.ai, GitHub, monitoring.

### Dependencies
- Access to current SOP/runbook library (Google Docs, Confluence, or internal wiki).
- 1–2 SME reviewers for quality gates.

### Successor Initiatives
- **Initiative 4:** Medium Win 2 – QA Test Automation (leverages high-quality doc baseline for test case generation).

---

## Initiative 4: Medium Win Pilot – QA Test Automation & Root Cause Analysis

### Hierarchy Reference
**Section 3.2.2 (QA Use Case)** | **Section 8.3 Data Governance** | **Section 9 Risk Controls**

### Description
Deploy AI-powered QA test automation for regression testing and root cause analysis on customer deployments. Targets: 60–90% time savings on test case generation, 75–85% automation coverage, 90–120 day payback, <$15K cost.

### Alignment to Validated Patterns
- **GE Healthcare / Functionize:** 90% labor savings (40 hours → 4 hours test execution).
- **Qase.io / TestRigor:** Enterprise-scale test automation; 70–80% time savings documented.
- **INT Inc strategy:** Differentiator for MSP customers (QA as managed service); scales with customer deployments; foundation for Medium Win 3 (predictive resource allocation).

### WSJF Scoring

| Component | Score | Rationale |
|-----------|-------|-----------|
| **Business Value** | 9/10 | 75–85% automation coverage = 2–3 FTE QA hours freed/day; reduces deployment risk (fewer bugs reach production); premium service offering for MSP customers. High direct value + revenue enablement. |
| **Time Criticality** | 7/10 | QA is often bottleneck in deployment cycles; competitors offering managed QA; moderate urgency (quarter or two of delay acceptable). |
| **Risk Reduction** | 7/10 | AI test generation risks: (a) false negatives (mitigated by manual spot-checks), (b) over-automation of manual tests (mitigated by step classification). Medium risk. Section 9.1 RMF required. |
| **Opportunity Enablement** | 8/10 | Unblocks revenue-generating QA service; scales with customer base; foundation for Long-Term multi-agent ops (Section 4.2). High leverage. |
| **Job Size** | 5/10 | <$15K, 90–120 day implementation, cross-functional (engineering + QA), vendor integration (Functionize or TestRigor). Medium complexity. |

### **WSJF Score**
`(9 + 7 + 7 + 8) / 5 = 31 / 5 = **6.2 – High** (Tier: Q2–Q3)`

### Phasing
- **Phase 1 (Weeks 1–4):** Vendor selection (Functionize, TestRigor, or Qase.io); map existing test suite (manual + automated).
- **Phase 2 (Weeks 5–8):** Set up pilot on 2–3 representative customer deployments; generate test cases via AI; execute and compare vs manual baseline.
- **Phase 3 (Weeks 9–12):** Expand to 5–10 deployments; refine model (false negatives, coverage gaps); measure time savings and cost.
- **Phase 4 (Weeks 13+):** Productize QA service; train support team; launch to customer base.

### Success Metrics
- **Time savings:** 60–90% reduction in test case generation time.
- **Automation coverage:** 75–85% of test cases automated (vs. baseline 40–50%).
- **Execution time:** 50% faster test execution (parallel runs, fewer manual waits).
- **Defect detection:** Maintain or improve baseline defect discovery rate; <5% false-positive failure reports.
- **Cost:** <$15K; positive ROI within 90 days (via customer upsell).
- **Customer CSAT:** >4.2/5.0 for managed QA service.

### Champion Program Integration (Section 6)
- Assign 1–2 QA engineers as champions; 15% allocation.
- Bi-weekly QA guild meetings; share test patterns, edge cases, model improvements.
- Replicates Salesforce Agentblazer progression (Champion → Innovator).

### Risk Mitigation
- **False negatives (missed bugs):** Mandatory manual spot-checks on 10% of critical paths; escalate coverage gaps.
- **Model drift on customer-specific code:** Retrain classifier every 30 days on new test results; monitor defect escape rate.
- **Over-automation:** Classify steps (UI-heavy vs. logic-heavy); only automate high-confidence candidates.
- **Vendor lock-in:** Prefer vendors with standard test export (Gherkin, TestNG format); avoid proprietary languages.

### Funding & Resources
- **Estimate:** $12,500 total ($6K SaaS license, $4K labor, $2.5K integrations & training).
- **FTEs:** 0.6 (QA engineer) + 0.4 (automation engineer) + 0.2 (PM) for 12 weeks.
- **Tools:** Functionize or TestRigor, customer test repos, CI/CD integration.

### Dependencies
- Access to representative customer test suites (2–3 deployments with permission).
- QA engineer availability for model tuning and validation.
- CI/CD pipeline integration (Jenkins, GitLab CI, or GitHub Actions).

### Successor Initiatives
- **Initiative 8:** Medium Win 3 – Predictive Resource Allocation (leverages QA metrics and deployment data).
- **Initiative 6:** Long-Term Win 1 – Multi-Agent Ops (QA automation feeds into full orchestration).

---

## Initiative 5: Medium Win Pilot – Customer Churn Prediction & Winback

### Hierarchy Reference
**Section 3.2.1 (Churn Prediction Case)** | **Section 5.2 ROI Benchmarks** | **Section 9.3 Human-in-Loop**

### Description
Deploy AI-powered customer churn prediction model integrated with CRM (HubSpot, Salesforce). Targets: 260% higher winback conversion rate, 310% revenue uplift per customer, 60–90 day model maturity, <$8K cost.

### Alignment to Validated Patterns
- **Hydrant / Pecan AI:** 260% winback conversion, 310% revenue uplift, 2-week model build.
- **Telecom / Neoteric:** 20%+ churn reduction, 10x ROI within 90 days, $39K+/month savings.
- **INT Inc strategy:** Direct revenue protection; customers staying longer = higher LTV; feeds customer success and account management teams.

### WSJF Scoring

| Component | Score | Rationale |
|-----------|-------|-----------|
| **Business Value** | 10/10 | 260% higher winback conversion + 310% revenue uplift = substantial pipeline for CS/sales. 10x ROI in 90 days (Telecom case) highly attractive. Direct revenue impact. |
| **Time Criticality** | 9/10 | Customer churn is continuous; every month of delay = lost customers + forgone winback revenue. Competitors using churn models. High urgency. |
| **Risk Reduction** | 6/10 | Model risks: (a) class imbalance (churn is rare), (b) data quality (CRM hygiene), (c) feedback loops (actions change future behavior). Mitigated by human-in-loop (Section 9.3) and periodic retraining. |
| **Opportunity Enablement** | 8/10 | Feeds Medium Win 3 (resource allocation for at-risk accounts); enables proactive customer success; differentiator in market. Moderate-high leverage. |
| **Job Size** | 4/10 | <$8K, 60–90 days, single domain (churn), well-established vendors (Pecan, Addepto, custom build). Low-medium complexity. |

### **WSJF Score**
`(10 + 9 + 6 + 8) / 4 = 33 / 4 = **8.25 – Critical** (Tier: Q1–Q2, after Quick Wins stabilize)`

### Phasing
- **Week 1–2:** Data extraction from CRM (HubSpot/Salesforce); identify churn definition (days since last engagement, NRR <0, etc.); label historical cohorts (12–24 months).
- **Week 3–4:** Feature engineering (customer health score, support tickets, usage metrics, NPS); train initial model (logistic regression → gradient boosting).
- **Week 5–6:** Model validation (hold-out test set, AUC >0.75); identify top churn factors; define confidence thresholds for intervention.
- **Week 7–8:** Deploy to staging; CS team review predictions; design winback playbook (email sequence, discount offer, success call).
- **Week 9–10:** Pilot with 100 at-risk customers; run A/B test (AI-predicted vs. random); measure conversion, revenue.
- **Week 11–12:** Expand to full customer base; monitor model drift; retrain monthly.

### Success Metrics
- **Prediction accuracy:** AUC >0.75 (validation set); precision >70% (avoid false alarms on healthy customers).
- **Winback conversion:** 260% uplift vs. baseline (industry benchmark from Hydrant case).
- **Revenue impact:** $310 average revenue per recovered customer.
- **Cost:** <$8K; positive ROI within 60 days (assumes >10 recovered customers/month).
- **Adoption:** >90% of CS team using predictions within 30 days of launch.

### Champion Program Integration (Section 6)
- Assign 1–2 CS/account managers as champions; 10–15% allocation.
- Bi-weekly CS guild meetings; share winback success stories and churn factor insights.
- Track churn reduction KPI publicly; celebrate wins.

### Risk Mitigation
- **Class imbalance:** Use stratified sampling, SMOTE, or cost-weighted loss function; monitor recall (don't miss churners).
- **Data quality (Section 8.3):** Validate CRM data before model build; flag missing/inconsistent fields; version control training data.
- **Feedback loops (Section 9.3):** Human review of top 50 churn predictions before automated outreach; measure conversion by model confidence level.
- **Model drift:** Monthly retraining on new churn labels; alert if AUC drops >5%.

### Funding & Resources
- **Estimate:** $7,200 total ($2K Pecan AI or build cost, $3.5K labor, $1.7K CRM integrations).
- **FTEs:** 0.5 (data scientist) + 0.3 (CS lead) + 0.2 (PM) for 12 weeks.
- **Tools:** Pecan AI or custom (scikit-learn, XGBoost), CRM API, monitoring dashboards.

### Dependencies
- 12–24 months of clean CRM transaction and engagement data.
- CS team availability for playbook design and pilot execution.
- Business definition of "churn" (clear, agreed-upon threshold).

### Successor Initiatives
- **Initiative 8:** Medium Win 3 – Predictive Resource Allocation (leverages churn + support metrics).
- **Initiative 6:** Long-Term Win 1 – Multi-Agent Customer Success (CS agents leverage churn scores for proactive outreach).

---

## Initiative 6: Long-Term Win – Multi-Agent AI Operations Orchestrator

### Hierarchy Reference
**Section 4 (Long-Term Wins, Agentic AI)** | **Section 4.2 (Multi-Agent Examples: Moody's, ServiceNow, Gelato)** | **Section 6 Champion Programs** | **Section 9 Governance**

### Description
Design and prototype a multi-agent AI orchestration system coordinating support, QA, resource allocation, and churn prediction workflows. Agents: (1) Support Coordinator (routes tickets, escalates P1s), (2) QA Planner (designs test strategies, allocates resources), (3) Customer Health Monitor (tracks churn, triggers winback), (4) Supervisor Agent (orchestrates cross-agent collaboration, resolution). Targets: 1–2 year implementation, >$50K investment, 3–5x ROI over 24 months.

### Alignment to Validated Patterns
- **Moody's:** 35 autonomous agents for research workflow; demonstrates multi-agent architecture at scale.
- **ServiceNow + Microsoft:** Multi-agent P1 incident management; agents collaborate to resolve and generate knowledge base.
- **Gelato / CrewAI:** Multi-agent automation reduces carrier onboarding from 5 days → 10 minutes.
- **Andrew Ng's Agentic AI framework (Section 4.4):** Reflection, Tool Use, Planning, Multi-Agent Collaboration; applicable to ops orchestration.
- **INT Inc strategy:** Long-term competitive moat; differentiates INT Inc's managed services portfolio; foundation for spin-off products.

### WSJF Scoring

| Component | Score | Rationale |
|-----------|-------|-----------|
| **Business Value** | 9/10 | 3–5x ROI over 24 months (Moody's, ServiceNow cases). Multi-agent orchestration scales across all prior Quick/Medium wins. Potential new revenue stream (sell orchestrator to MSP customers). High strategic value. |
| **Time Criticality** | 6/10 | Long-term play; not urgent (12–24 month horizon). Competitors exploring agentic AI (Gartner: 21% of enterprises using multi-agent systems). Moderate-low urgency; strategic positioning. |
| **Risk Reduction** | 5/10 | Long-term project risk is high: (a) model coordination complexity, (b) emergent behaviors (Section 8.3 model drift), (c) regulatory uncertainty (EU AI Act, NIST RMF evolution). Mitigated by phased rollout and strong governance. |
| **Opportunity Enablement** | 10/10 | Enables highest ROI opportunities (Section 5.3: 1200% ROI in specific cases). Unlocks new service revenue; platform for competitive differentiation; feeds all downstream initiatives. Maximum leverage. |
| **Job Size** | 8/10 | >$50K, 12–24 month implementation, multi-disciplinary (ML engineers, product, DevOps, compliance), complex orchestration. High complexity, long duration. |

### **WSJF Score**
`(9 + 6 + 5 + 10) / 8 = 30 / 8 = **3.75 – Medium** (Tier: Q3–Q4 planning, Q1 2026+ execution)`

### Phasing

#### Phase 1: Design & Proof of Concept (Months 1–4)
- **Month 1:** Workshop INT Inc team + external advisors (Andrew Ng DeepLearning.AI or similar); define agent roles, interaction patterns, decision boundaries.
- **Month 2:** Build proof-of-concept with 2 agents (Support Coordinator + QA Planner); use LangGraph or CrewAI; local execution.
- **Month 3:** Validate POC against Quick Win data (support tickets, QA metrics); measure latency, accuracy, cost.
- **Month 4:** Governance review (NIST RMF Section 9.1); risk assessment; stakeholder buy-in.

#### Phase 2: MVP Development (Months 5–9)
- **Month 5:** Expand to 4 agents (add Customer Health Monitor, Supervisor); integrate with production systems (Freshservice, CRM, QA platform).
- **Month 6–7:** Agent training on INT Inc data; refine decision thresholds; implement human-in-loop guardrails (Section 9.3: graduated autonomy).
- **Month 8:** Pilot with internal INT Inc operations (20–30% workload); measure latency, accuracy, cost vs. baseline.
- **Month 9:** Iterate on failure modes; improve knowledge bases and tool integrations.

#### Phase 3: Beta & Productization (Months 10–14)
- **Month 10–11:** Expand to 60–80% of operations workload; monitor for emergent behaviors and model drift (Section 8.3).
- **Month 12:** Regulatory compliance (SOC 2, NIST RMF, EU AI Act implications); documentation; customer-ready runbooks.
- **Month 13–14:** Beta launch to select MSP customers; gather feedback; refine UX/API.

#### Phase 4: Go-to-Market (Months 15+)
- **Month 15:** Full GA release; productized pricing (SaaS model or per-agent licensing).
- **Months 16+:** Scale to customer base; continuous improvement cycles.

### Success Metrics
- **Operational efficiency:** 35–50% time savings across orchestrated workflows (support + QA + CS).
- **Accuracy:** Agent decision accuracy >90% (human-validated); escalation rate <10%.
- **Cost:** <$5K/month operational cost (agent compute, APIs, monitoring); positive ROI by month 18–20.
- **Speed:** P1 incident resolution time reduced by 40%; QA test cycle time reduced by 50%.
- **Adoption:** >80% internal team adoption within 6 months of MVP launch; 3+ customers in beta by month 14.
- **Revenue:** New product revenue stream (agentic orchestration SaaS or licensing); target $100K+ ARR by month 24.

### Champion Program Integration (Section 6)
- Build AI Champion community (50+ INT Inc employees + MSP partner champions).
- Replicates Microsoft Copilot Champs (Section 6.2) and MetaCTO engineering maturity levels (Section 6.6).
- Monthly innovation forums; quarterly training on multi-agent design patterns (Andrew Ng framework).
- Public recognition (case studies, conference talks).

### Risk Mitigation

**Governance (Section 9):**
- NIST RMF framework: GOVERN (culture), MAP (agent roles/risks), MEASURE (metrics), MANAGE (escalation rules).
- SOC 2 Type II for all agent integrations; audit quarterly.
- Graduated autonomy (Section 9.3): $100 decisions agent-only, $500–$5K decisions human-in-loop, >$5K human-driven.

**Technical Risks (Section 8.3):**
- Model drift monitoring: Agent decision accuracy tracked daily; alert if <90% for 5 consecutive days.
- Edge case accumulation: Logging of all agent decisions; monthly review of top 10 failure modes; model retraining every quarter.
- Emergent behaviors: Controlled rollout (internal-only → beta customers → general release); staged workload increase.

**Operational Risks:**
- Vendor lock-in: Multi-model support (Claude + GPT + Gemini); open-source orchestration framework (LangGraph or equivalent).
- Cost overrun: Budget reserve of 30%; monthly burn tracking against milestones.
- Team capacity: Dedicated cross-functional team (4–6 FTEs); external contractors for specialized tasks (regulatory, ML).

### Funding & Resources
- **Estimate:** $180,000–$250,000 total over 24 months.
  - Phase 1 (Design/POC): $30K (labor, licensing, advisors).
  - Phase 2 (MVP): $80K (engineering, cloud compute, integrations).
  - Phase 3 (Beta/Productization): $60K (engineering, compliance, documentation).
  - Phase 4 (GTM): $30K (marketing, customer enablement).
- **FTEs:** 1.0 (AI/ML engineer lead) + 0.8 (backend engineer) + 0.4 (PM) + 0.3 (DevOps) + 0.2 (compliance/governance) = 2.7 FTE average over 24 months.
- **Tools:** LangGraph or CrewAI (orchestration), Claude/GPT/Gemini APIs, cloud infrastructure (AWS/GCP), monitoring (DataDog, Splunk).

### Dependencies
- Successful completion of Quick Wins (Initiatives 1–3) and Medium Wins (Initiatives 4–5).
- Clean, versioned data from all prior initiatives (support tickets, QA results, CRM, financial data).
- Executive alignment and budget commitment for 24-month roadmap.
- External expertise in agentic AI design (consider partnership with DeepLearning.AI or similar).

### Successor Initiatives
- **Initiative 7:** Long-Term Win 2 – Customer Success Agent (standalone agent for account management automation).
- **Initiative 9:** Long-Term Win 3 – Competitive Intelligence Agent (market research and win/loss analysis automation).
- **Product Spinoff:** Standalone multi-agent orchestration platform for MSP/managed services market.

---

## Initiative 7: Long-Term Win 2 – Customer Success AI Agent

### Hierarchy Reference
**Section 4.4 (Andrew Ng's Agentic AI Design Patterns)** | **Section 3.2.1 (Churn Prediction Medium Win)**

### Description
Autonomous agent designed to manage customer success activities: health monitoring, playbook execution, escalation to human CSMs, and retention outreach. Builds on churn prediction (Initiative 5) and multi-agent orchestrator (Initiative 6). Targets: 30–40% reduction in CSM workload, <$25K incremental cost, 2+ year timeline post-orchestrator launch.

### WSJF Score
`(8 + 5 + 5 + 8) / 8 = 26 / 8 = **3.25 – Medium/Backlog**` (Deferred to Long-Term roadmap, post-Initiative 6 stabilization)

### Key Details
- **Phasing:** Months 16–20 (post-multi-agent orchestrator MVP).
- **Success metrics:** 30–40% CSM time savings, CSAT >4.3/5.0, retention rate improvement >5%.
- **Funding:** $20K–$25K labor (leverages shared orchestrator platform).
- **Champion program:** CSM guild; monthly success story sharing.
- **Risk mitigation:** Human-in-loop for all high-value accounts (>$50K ARR); graduated autonomy for playbook execution.

---

## Initiative 8: Long-Term Win 3 – Predictive Resource Allocation & Capacity Planning

### Hierarchy Reference
**Section 3.2.1 (Medium Wins compounding)** | **Section 4 (Long-Term Wins, Operational Excellence)**

### Description
AI system predicting demand for IT support, QA, and professional services based on customer deployment schedules, historical ticket patterns, seasonal trends, and forecast data. Optimizes resource allocation (hiring, contractor ramp, team assignments). Targets: 20–25% reduction in underutilized capacity, 15–20% faster project staffing, <$20K incremental cost, 18–24 month timeline.

### WSJF Score
`(7 + 5 + 6 + 7) / 7 = 25 / 7 = **3.57 – Medium/Backlog**` (Post-Medium Win 1–3 stabilization, Q3 2026+)

### Key Details
- **Phasing:** Months 12–18 (leverages data from Quick Wins + Medium Wins).
- **Success metrics:** 20–25% capacity utilization improvement, 15–20% faster staffing decisions, >$50K annual savings.
- **Funding:** $18K–$20K (engineers + modeling).
- **Dependencies:** Clean invoice, ticket, and deployment data from Initiatives 2–4.
- **Champion program:** Finance/ops team; quarterly forecasting reviews.

---

## Summary: Initiative Roadmap & Prioritization

| # | Initiative | Type | WSJF Score | Tier | Target Start | Duration | Est. Cost | Key Success Metric |
|---|-----------|------|-----------|------|--------------|----------|-----------|------------------|
| **1** | AI Support Copilot | Quick Win | **10.0** | Critical | Q4 2025 | 6 weeks | $4.2K | 50–75% ticket deflection |
| **2** | Invoice Processing | Quick Win | **9.0** | Critical | Q4 2025 | 8 weeks | $8.5K | 6x capacity, $30K+/yr savings |
| **3** | Tech Doc Generation | Quick Win | **8.5** | High | Q1 2026 | 8 weeks | $2.8K | 40–60% doc time savings |
| **4** | QA Test Automation | Medium Win | **6.2** | High | Q1 2026 | 12 weeks | $12.5K | 75–85% automation coverage |
| **5** | Churn Prediction | Medium Win | **8.25** | Critical | Q1 2026 | 12 weeks | $7.2K | 260% winback conversion uplift |
| **6** | Multi-Agent Orchestrator | Long-Term | **3.75** | Medium | Q3 2026 | 24 months | $180–250K | 3–5x ROI, 35–50% ops time savings |
| **7** | CS AI Agent | Long-Term | **3.25** | Medium | Q1 2027 | 12 months | $20–25K | 30–40% CSM workload reduction |
| **8** | Resource Allocation | Long-Term | **3.57** | Medium | Q3 2026 | 12 months | $18–20K | 20–25% capacity optimization |

---

## Execution Guidance

### Q4 2025: Quick Win Launch (Initiatives 1–2)
- **Week 1–4:** Simultaneous kickoffs; divide teams (support team + AP team).
- **Governance:** NIST RMF mapping for both; SOC 2 prep; champion recruiting.
- **Go/No-Go:** End of Week 6 (Initiative 1), Week 8 (Initiative 2); formal scorecard reviews (see Pilot Scorecard Template below).

### Q1 2026: Scale Quick Wins + Launch Medium Wins
- **Quick Win scaling:** Roll out copilot to full support team; invoice processing to broader finance workflows.
- **Medium Win kickoffs:** Initiative 4 (QA) and Initiative 5 (Churn) start in parallel; share learnings from Quick Wins.
- **Champion program:** Formalize with selection of 8–12 champions across all initiatives.

### Q2–Q3 2026: Medium Win Stabilization + Long-Term Planning
- **QA automation:** Move to customer beta; productize service offering.
- **Churn prediction:** Scale to full customer base; measure retention impact.
- **Long-term planning:** Initiative 6 (multi-agent orchestrator) design phase; external partnerships (DeepLearning.AI).

### Q4 2026–Q1 2027: Long-Term Wins Launch
- **Orchestrator:** MVP launch internally; refine agents and knowledge bases.
- **Initiatives 7–8:** Begin planning (resource allocation, CS agent design).

### 2027+: Maturity & Expansion
- **Product portfolio:** Multiple agents (support, QA, CS, resource planning) operating autonomously.
- **Market positioning:** Managed AI operations service for MSP/service org customers.
- **Revenue:** New SaaS/licensing streams; customer upsells; potential spin-off entity.

---

## Governance & Compliance Checklist (All Initiatives)

- [ ] NIST AI RMF mapping (GOVERN, MAP, MEASURE, MANAGE) per Section 9.1.
- [ ] SOC 2 Type II vendor attestation (Initiatives 1, 2, 4); internal control design.
- [ ] Data governance: versioning, access logs, anomaly detection (Section 8.3).
- [ ] Human-in-loop design: graduated autonomy thresholds per Section 9.3.
- [ ] Continuous monitoring: dashboards tracking accuracy, cost, drift.
- [ ] Quarterly refresh on research metrics (Capgemini ROI, Gartner abandonment, MSP adoption rates per Section 10.2).
- [ ] Incident response procedures for model failures or unexpected behavior.

---

## Notes for Portfolio Management

1. **WSJF > 8.0:** Initiatives 1, 2, 5 are critical path; execute Q4 2025–Q1 2026.
2. **6.0–8.0 range:** Initiatives 3, 4 are high-priority; queue for Q1 2026 start.
3. **< 6.0 range:** Initiatives 6, 7, 8 are strategic long-term; plan for 2026+ execution.
4. **Dependencies:** Long-Term Wins depend on Quick/Medium Win data and team maturity; no parallel launches of all initiatives.
5. **Flex points:** Initiatives 3 and 4 can be resequenced based on resource availability and customer feedback from Initiative 1–2 pilots.
6. **Funding:** Total over 24 months ≈ $450K (Quick + Medium + Long-Term); breakeven expected Q2–Q3 2027 based on revenue uplift + cost savings.
7. **Risk mitigation:** Gartner's 30% AI project abandonment rate (Section 8.3) applies; champion program and governance are non-negotiable to stay in success cohort.

---

**Document prepared:** December 11, 2025 | **Next review:** March 31, 2026 (Q1 Refresh)
