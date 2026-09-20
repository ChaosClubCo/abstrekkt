# INT Inc AI Pilot Validation: Complete Deliverables Index

**Date:** December 11, 2025  
**Prepared by:** AI Strategy Team  
**For:** INT Inc Product/Portfolio Management & Executive Leadership

---

## Overview

Three complementary, maximum-depth deliverables—all wired to the 11-section hierarchy from the original outline:

1. **WSJF-Initiatives-List.md** – Portfolio-ready initiative prioritization
2. **Pilot-Scorecard-Template.md** – Reusable evaluation and go/no-go framework
3. **Prompts-Slides-Skeletons.md** – Prompt templates and slide decks for stakeholder communication

---

## DELIVERABLE 1: WSJF-Initiatives-List.md

### Purpose
Translate the INT Inc AI strategy hierarchy into a prioritized portfolio of 8 initiatives across three phases (Quick Wins, Medium Wins, Long-Term Wins). Each initiative includes:
- WSJF score and tier (Critical/High/Medium/Backlog)
- Validated alignment to real-world case studies
- Detailed phasing, success metrics, and budget
- Champion program integration
- Risk mitigations
- Dependencies and successor initiatives

### Key Content
- **Section 1:** WSJF methodology and scoring formula
- **Initiatives 1–3:** Quick Wins (AI Support Copilot, Invoice Processing, Tech Doc Generation)
  - WSJF scores: 10.0, 9.0, 8.5 (all Critical/High)
  - Target: Q4 2025 – Q1 2026 launch
  - Total budget: ~$16K
- **Initiatives 4–5:** Medium Wins (QA Test Automation, Churn Prediction)
  - WSJF scores: 6.2, 8.25 (High/Critical)
  - Target: Q1 2026 – Q3 2026
  - Total budget: ~$20K
- **Initiatives 6–8:** Long-Term Wins (Multi-Agent Orchestrator, CS Agent, Resource Allocation)
  - WSJF scores: 3.75, 3.25, 3.57 (Medium/Backlog)
  - Target: Q3 2026+ (24-month roadmap)
  - Total budget: ~$250K
- **Summary Table:** All 8 initiatives ranked by WSJF score, budget, duration
- **Execution Guidance:** Q4 2025 – 2027+ calendar with phase objectives
- **Governance Checklist:** NIST RMF, SOC 2, monitoring, compliance

### How to Use
1. **Executive Steering:** Review Summary Table (bottom of file); approve WSJF tier assignments and Q4–Q1 launch timeline
2. **Portfolio Management:** Use for Q1 2026 roadmap planning; align budgets to tiers
3. **Initiative Kickoff:** Provide to pilot owners as context; reference specific sections for phasing/metrics
4. **Quarterly Review:** Update WSJF scores as research metrics refresh (Section 10.2 schedule)

### Key Metrics
- Total 24-month investment: ~$450K (Quick + Medium + Long-Term)
- Expected breakeven: Q2–Q3 2027
- Strategic outcomes: 8 initiatives, 3 product tiers (quick-win copilots, specialized agents, orchestrator platform)

---

## DELIVERABLE 2: Pilot-Scorecard-Template.md

### Purpose
Operational execution tool for each initiative. Provides:
- Hypothesis and go/no-go decision framework
- Primary (critical), secondary (informational), and initiative-specific metrics
- Risk registers and mitigation tracking
- Budget and resource utilization
- Champion program engagement metrics
- Bi-weekly/monthly reporting structure

### Key Content
- **Section 1:** Pilot overview, hypothesis, success criteria, constraints
- **Section 2:** Health summary, WSJF decision confidence, key risks, assumptions, budget tracking
- **Section 3:** Initiative-specific metrics (detailed templates for each Quick/Medium/Long-Term Win)
  - Initiative 1 (AI Support Copilot): AHT, deflection, CSAT, KB hit rate, cost, governance
  - Initiative 2 (Invoice Processing): Time/capacity, accuracy, compliance, ROI
  - Initiative 5 (Churn Prediction): Model accuracy (AUC), winback conversion, adoption, cost/ROI
  - Initiative 6 (Multi-Agent Orchestrator): POC validation, MVP agent count, internal pilot scope, governance
  - (Plus templates for Initiatives 3, 4, 7, 8)
- **Section 4:** Champion program engagement, team sentiment, executive sponsorship
- **Section 5:** Go/no-go recommendation, phase transition plan, learnings for successors
- **Section 6:** Appendices (data snapshots, risk register maintenance, sign-off)

### How to Use
1. **Pilot Kickoff:** Assign one scorecard per initiative; fill Section 1 (hypothesis, metrics, constraints)
2. **Weekly:** Update Section 2 (health, risks) and Section 3 metrics
3. **Bi-Weekly:** Run pilot team retrospective; document blockers and early wins
4. **Month End:** Executive sponsor signs scorecard; compare to targets; decide go/no-go
5. **Go/No-Go Gate:** Use Section 5 decision framework; formalize in scorecard sign-off (Section 6)
6. **Post-Pilot:** Archive in documentation repository; use learnings (Section 5.3) for successor initiatives

### Key Metrics
- Decision rule: Go if ≥2/3 primary metrics on track; No-Go if ≤1/3
- Phase gates: Week 4 (initial validation), Week 8 (mid-point), Week 12 (final before scale)
- Success metric targets: Tied to Section 2–5 hierarchy benchmarks (e.g., 50–75% deflection, 6x capacity, 260% uplift)

---

## DELIVERABLE 3: Prompts-Slides-Skeletons.md

### Purpose
Reusable templates for knowledge work and communication. Contains:
- 5 strategic prompts for Claude/GPT (tailored to INT Inc context)
- 3 complete slide deck skeletons (8–14 slides each)
- Usage guide and cross-reference index

### Key Content

**PART 1: Five Research & Content Prompts**

1. **Prompt 1: Quick Win Validation** (2K word response)
   - Validates new Quick Win use cases against Section 2 benchmarks
   - Generates hypothesis, metrics, ROI projection, risk mitigations, phasing
   - Output: 1-page executive summary ready for Pilot Scorecard

2. **Prompt 2: Medium Win Compounding Effect** (1–2 page response)
   - Shows how Quick Win outputs feed Medium Win inputs
   - Creates data flow diagram and ROI compounding analysis
   - Output: "Medium Win readiness" assessment + timeline to go-live

3. **Prompt 3: Risk Mitigation & Governance** (2–3 page response)
   - Maps pilot risks to NIST RMF framework
   - Designs human-in-loop guardrails and graduated autonomy thresholds
   - Output: Risk register, governance checklist ready for compliance sign-off

4. **Prompt 4: Champion Program Activation** (2–3 page response)
   - Designs 3-tier champion program (core/advocates/community)
   - Creates 90-day roadmap, job descriptions, engagement metrics
   - Output: Champion charter and community hub agenda

5. **Prompt 5: ROI Projection & Financial Model** (3–5 page response)
   - Builds 24-month financial model for pilot
   - Generates three scenarios (conservative/realistic/optimistic)
   - Output: Financial summary with sensitivity analysis, benchmarking

**PART 2: Three Complete Slide Decks**

1. **Slide Deck 1: Quick Win Pilot Overview (8–10 slides)**
   - For: Kickoff meetings, team alignment, executive approval
   - Slides:
     1. Title slide
     2. Context & opportunity
     3. Hypothesis & success criteria
     4. 6-week roadmap
     5. Budget & team resources
     6. Risks & governance
     7. Expected outcomes & ROI
     8. Next steps & decision
     9. Q&A
   - Format: Outline-ready for PowerPoint/Google Slides; customizable text + visual guidance

2. **Slide Deck 2: Medium Win Deep Dive (10–12 slides)**
   - For: Steering committee alignment, business case expansion, phase transition
   - Slides:
     1. Title slide
     2. Quick Win foundation & compounding
     3. Medium Win opportunity
     4. 90–180 day scope & timeline
     5. Success metrics & ROI
     6. Champion program & activation
     7. Resource & budget plan
     8. Risks & governance (NIST RMF)
     9. Success stories & learnings (benchmarking)
     10. Next steps & decision
     11. Appendix – Financial deep dive (optional)
   - Format: Outline-ready; reference to Section 3 case studies integrated

3. **Slide Deck 3: Long-Term Win – Multi-Agent Orchestrator (12–14 slides)**
   - For: Board-level strategy, market positioning, talent recruitment
   - Slides:
     1. Title slide
     2. Strategic vision & market opportunity
     3. Multi-agent architecture & design patterns
     4. 24-month phased implementation (POC → MVP → Beta → GA)
     5. Financial projection & 7.4x ROI
     6. Risk management (5 top risks, NIST RMF)
     7. Success metrics & monitoring dashboards
     8. Champion & community engagement (50+ internal, external partners)
     9. Go-to-market & customer strategy
     10. Competitive differentiation
     11. Talent & organization (4.6 FTE team, hiring plan)
     12. Case study pipeline & proof points
     13. Next steps & decision (board-level recommendation)
   - Format: Board-ready; includes competitive positioning & market TAM

**PART 3: Usage Guide & Cross-Reference Index**
- Mapping prompts to hierarchy sections (which prompt addresses each section?)
- Mapping slides to prompts (which slide leverages which prompt output?)
- Role-specific guidance (PM, engineer, exec, compliance, HR)

### How to Use
1. **For a new Quick Win:** Copy Prompt 1 → Feed output to Slide Deck 1 → Fill Pilot Scorecard
2. **For Medium Win approval:** Use Prompt 2 → Slides Deck 2 → Steering committee review
3. **For strategic roadmap:** Use Slide Deck 3 → Board presentation + external market positioning
4. **For deep research:** Use Prompts 3–5 → Governance charter, champion program, financial model
5. **For team enablement:** Use all three decks → Training curriculum, change management

### Key Customization Points
- All prompts have [USER FILLS IN] placeholders for use case, team size, timelines, etc.
- All slides have [CUSTOM DATA] placeholders for metrics, names, dates
- Cross-reference index shows exact Section numbers to cite for credibility

---

## Integration Guide: How the Three Deliverables Work Together

### Phase 1: Strategic Planning (Month 1 of each initiative)
1. **Start with WSJF-Initiatives-List** → Select top initiative by WSJF score
2. **Use Prompts 1–3 from Prompts-Slides** → Validate business case, design governance
3. **Create Pilot Scorecard** (Section 1) → Define hypothesis and success metrics
4. **Present Slide Deck 1** (Quick Win) or **Deck 2** (Medium Win) → Secure executive approval

### Phase 2: Execution (Weeks 1–12 of pilot)
1. **Monitor Pilot Scorecard (Sections 2–3)** → Update metrics bi-weekly
2. **Run Champion Program** (Section 6 guidance + Prompt 4) → Weekly office hours, celebrate wins
3. **Track against WSJF timeline** → Ensure phase gates are hit on schedule
4. **Reference governance checklist** (Section 9 + Prompt 3) → Monthly compliance reviews

### Phase 3: Decision & Transition (Week 12 go/no-go)
1. **Complete Pilot Scorecard (Section 5)** → Finalize go/no-go recommendation
2. **Use Prompt 2** (Medium Win compounding) → Assess readiness for successor initiative
3. **Present Slide Deck 2** (if Medium Win approved) → Transition to next phase
4. **Archive learnings** (Section 5.3 of Scorecard) → Feed into next pilot's Prompt setup

### Phase 4: Continuous Improvement (Quarterly)
1. **Refresh metrics from WSJF list** (Section 10.2 schedule) → Update ROI benchmarks, adoption stats
2. **Re-score remaining initiatives** using updated research → Reprioritize backlog if needed
3. **Publish champion case studies** → Use Prompt 4 + Slide Deck 1/2 templates for marketing
4. **Update long-term roadmap** → Use Slide Deck 3 + Prompt 5 for annual planning

---

## File Cross-References

### WSJF-Initiatives-List.md References
- **Section 2 (Quick Wins):** Details for Initiatives 1–3; Success Metrics (Section 2.3)
- **Section 3 (Medium Wins):** Details for Initiatives 4–5; Compounding Effect
- **Section 4 (Long-Term Wins):** Details for Initiatives 6–8; Agentic AI framework
- **Section 5 (ROI):** Benchmarks and financial methodology for all initiatives
- **Section 6 (Champions):** Integration for each initiative
- **Section 9 (Governance):** Compliance requirements mapped to each initiative
- **Section 10.2 (Refresh):** Quarterly research update schedule

### Pilot-Scorecard-Template.md References
- **Section 1.1–1.2:** Hierarchy Section 2–5 (use as hypothesis template)
- **Section 2.1–2.2:** Hierarchy Section 8 (risk references)
- **Section 3.A–D:** Initiative 1–6 metrics wired to hierarchy benchmarks
- **Section 4 (Champions):** Hierarchy Section 6 (champion engagement)
- **Section 5.2 (ROI):** Hierarchy Section 5.2–5.3 (decision thresholds)
- **Section 6 (Governance):** Hierarchy Section 9 (compliance checklist)

### Prompts-Slides-Skeletons.md References
- **Prompt 1:** Hierarchy Section 2 (Quick Win validation) + Section 2.2 (case studies)
- **Prompt 2:** Hierarchy Section 3 (Medium Win compounding)
- **Prompt 3:** Hierarchy Section 8–9 (risks & governance)
- **Prompt 4:** Hierarchy Section 6 (champion programs)
- **Prompt 5:** Hierarchy Section 5 (ROI methodology)
- **Slide Deck 1:** Hierarchy Sections 2, 2.2–2.3, 5.4–5.5, 6
- **Slide Deck 2:** Hierarchy Sections 3, 3.2, 5.2–5.3, 6, 8–9
- **Slide Deck 3:** Hierarchy Sections 4, 4.2, 4.4, 5.2–5.3, 6, 8–9

---

## Quick Start Guide (For Different Roles)

### For Product Managers
1. Read WSJF-Initiatives-List.md **Summary Table** (5 min)
2. Select Initiative → Copy Prompts 1–2 from Prompts-Slides (10 min)
3. Feed prompt output to Pilot-Scorecard-Template Section 1 (15 min)
4. Customize Slide Deck 1 or 2 → Stakeholder presentation (30 min)
5. **Total:** ~1 hour to go from strategy to execution plan

### For Executives / Decision-Makers
1. Skim WSJF-Initiatives-List.md **Execution Guidance** section (10 min)
2. Review Slide Deck 1 (Quick Win) or Deck 3 (Long-Term) for your horizon (15 min)
3. Check WSJF scores & tier for approval decision (5 min)
4. Review governance checklist (NIST RMF, SOC 2) in Pilot-Scorecard-Template (5 min)
5. **Total:** ~35 minutes to understand roadmap + make approval decision

### For Data Scientists / Compliance
1. Read Prompt 3 (Risk & Governance) → Customize for your initiative (20 min)
2. Use Pilot-Scorecard-Template Section 3.A.5 / 3.B.4 (governance checkboxes) (10 min)
3. Reference Hierarchy Section 9 (NIST RMF) for control mapping (15 min)
4. Set up monitoring dashboard (20 min)
5. **Total:** ~65 minutes to establish governance framework

### For HR / Talent
1. Reference Prompts-Slides-Skeletons.md **Slide Deck 3, Slide 11** (Hiring plan) (10 min)
2. Use Pilot-Scorecard-Template **Section 4 (Champion Program)** for talent IDs (15 min)
3. Review Section 6 champion program structure (recognition, career growth) (10 min)
4. Build recruitment plan based on WSJF timeline (30 min)
5. **Total:** ~65 minutes to build talent roadmap

---

## Success Criteria for Complete Deliverable Set

✓ **Coverage:** All 8 initiatives (3 Quick + 2 Medium + 3 Long-Term) have detailed phasing, budgets, and metrics

✓ **Wiring:** Every slide, prompt, and scorecard section links back to hierarchy Section 2–10 with explicit references

✓ **Reusability:** Prompts are copy-paste ready; slides are outline-ready (not pre-filled); scorecard is form-ready

✓ **Decision-Ready:** WSJF scores, go/no-go gates, and governance checkboxes enable clear approval workflow

✓ **Depth:** Each initiative has 5–10 page depth (phasing, metrics, risks, budget, governance, champions, ROI)

✓ **Alignment:** All ROI projections, timelines, and benchmarks tied to Section 5 research and validated case studies

✓ **Governance:** NIST RMF, SOC 2, human-in-loop, and model drift monitoring integrated throughout

✓ **Actionable:** Every document has clear next steps, owners, and dates

---

## Document Maintenance & Refresh Schedule

| Artifact | Review Frequency | Owner | Key Updates |
|----------|-------------------|-------|------------|
| WSJF-Initiatives-List.md | Quarterly | PM + Portfolio Lead | Re-score initiatives; update research metrics (Section 10.2) |
| Pilot-Scorecard-Template.md | Per pilot (bi-weekly updates) | Pilot Owner | Metrics, risks, budget tracking; go/no-go decisions |
| Prompts-Slides-Skeletons.md | Annually | PM + Content Lead | Update case studies, add new prompts, refresh slides |

---

## Archive & Attribution

**Prepared by:** INT Inc AI Strategy Team  
**Date:** December 11, 2025  
**Hierarchy Base:** SMB AI Pilot Validation (11-section outline)  
**Research Sources:** 550+ sources across case studies, benchmarks, governance frameworks (see WSJF-Initiatives-List.md Section 1.2)  
**Governance:** NIST AI RMF, SOC 2, EU AI Act, Section 6 champion models (Microsoft, Salesforce, HSBC), Section 4.4 Andrew Ng framework

**Next Refresh:** March 31, 2026 (Q1 research update + initiative retrospectives)

---

**To access these files:**
1. WSJF-Initiatives-List.md → [Link]
2. Pilot-Scorecard-Template.md → [Link]
3. Prompts-Slides-Skeletons.md → [Link]

**For questions or collaboration:**
- PM Lead: [Name] | [Email]
- Governance/Compliance: [Name] | [Email]
- Strategy: [Name] | [Email]

---

*This index is the single source of truth for INT Inc's AI pilot portfolio. Distribute to stakeholders; update quarterly.*
