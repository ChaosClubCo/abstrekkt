---
name: service-level-agreements
description: Design, negotiate, and manage service level agreements with measurable KPIs, escalation procedures, and remediation clauses to ensure consistent service delivery and accountability between providers and consumers. Use when managing, optimizing, or automating operational workflows.
---

# Service Level Agreements

> Define, measure, and enforce the promises that keep operations running

## Description

Service level agreements (SLAs) are the contractual backbone of service delivery, defining expected performance levels, measurement methodologies, reporting requirements, and consequences for non-compliance. This skill covers SLA design methodology, metric selection, threshold calibration, penalty and incentive structures, and ongoing SLA governance. It addresses internal SLAs (between departments), external SLAs (with vendors and customers), and operational level agreements (OLAs) that underpin service delivery chains. Practitioners use this skill to create agreements that drive accountability, align expectations, and provide objective frameworks for measuring and improving service quality.

## Activation Triggers

- "Define SLAs for our new managed service provider"
- "Design internal SLAs between IT and business departments"
- "Set up availability and response time targets for our platform"
- "Build an SLA monitoring and reporting framework"
- "Negotiate SLA terms with penalties and service credits"
- "Create OLAs that support our customer-facing SLA commitments"
- "Review and update our existing SLAs for the contract renewal"
- "Define SLAs for a multi-tier support model (L1/L2/L3)"
- "Build an SLA dashboard with real-time compliance tracking"
- "Design SLA escalation procedures for critical service failures"

## Instructions

### Core Workflow

**Step 1: Service Definition and Scoping**
- Identify all services in scope and their business criticality classification
- Map service dependencies: upstream providers, downstream consumers, shared resources
- Document current performance baselines from historical data (minimum 90 days)
- Identify stakeholder expectations through interviews and requirement gathering
- Define service hours, maintenance windows, and exclusion periods

**Step 2: Metric Design and Calibration**
- Select metrics that are measurable, meaningful, and within the provider's control
- Define each metric precisely: formula, data source, measurement interval, reporting lag
- Set thresholds using baseline data: target (aspirational), commitment (contractual), breach
- Calibrate targets to balance business need with achievable performance levels
- Validate metric feasibility with the service provider before finalizing

**Step 3: Agreement Structure**
- Draft SLA document with standard sections and clear legal language
- Define service credit calculations tied to specific metric breaches
- Establish earnback provisions and performance incentives for exceeding targets
- Include mutual obligations: customer responsibilities that enable provider performance
- Specify change management process for SLA modifications

**Step 4: Governance and Monitoring**
- Implement automated SLA monitoring using service management tooling
- Design dashboards with real-time and historical SLA compliance views
- Establish reporting cadence: daily operational, weekly summary, monthly formal
- Define escalation matrix with clear triggers, contacts, and response expectations
- Create SLA review meeting structure: monthly operational, quarterly strategic

**Step 5: Continuous Improvement**
- Analyze SLA performance trends to identify systemic issues vs. one-off events
- Conduct root cause analysis for any breach and track corrective actions
- Review SLA targets annually against changing business needs and market benchmarks
- Retire metrics that no longer drive meaningful behavior or outcomes
- Add new metrics as service scope evolves or new capabilities are introduced

### SLA Metric Design Framework

**Common SLA Metric Categories**

| Category | Metric | Typical Formula | Common Target Range |
|---|---|---|---|
| Availability | Service Uptime | (Total time - Downtime) / Total time x 100 | 99.5% - 99.99% |
| Availability | Planned Downtime | Hours of scheduled maintenance per month | < 4-8 hours/month |
| Performance | Response Time (P95) | 95th percentile response latency | < 200ms - 2s |
| Performance | Throughput | Transactions processed per second | Service-specific |
| Reliability | Error Rate | Failed transactions / Total transactions | < 0.1% - 1% |
| Reliability | MTBF | Operating hours between failures | Trend upward |
| Recovery | RTO (Recovery Time Objective) | Max time to restore service after failure | 1-4 hours |
| Recovery | RPO (Recovery Point Objective) | Max data loss in time units | 0-24 hours |
| Support | Response Time | Time from ticket creation to first response | 15 min - 4 hours |
| Support | Resolution Time (MTTR) | Time from ticket creation to resolution | 1 hour - 5 days |
| Support | First Contact Resolution | % resolved on first interaction | 65-85% |
| Quality | Customer Satisfaction | CSAT score on post-interaction survey | > 4.0/5.0 |
| Quality | Defect Rate | Defects per delivery / deployment | < 1-3% |

**Availability Tier Definitions**

| Tier | Uptime % | Max Downtime/Month | Max Downtime/Year | Typical Use Case |
|---|---|---|---|---|
| Tier 1 - Standard | 99.5% | 3h 39m | 43h 48m | Internal tools, non-critical apps |
| Tier 2 - Enhanced | 99.9% | 43m 50s | 8h 46m | Business applications, portals |
| Tier 3 - High | 99.95% | 21m 55s | 4h 23m | Customer-facing services |
| Tier 4 - Critical | 99.99% | 4m 23s | 52m 36s | Payment, healthcare, safety systems |
| Tier 5 - Ultra | 99.999% | 26s | 5m 16s | Life-critical, continuous operation |

**Priority-Based Response and Resolution Targets**

| Priority | Definition | Response Time | Resolution Target | Update Frequency |
|---|---|---|---|---|
| P1 - Critical | Service down, major business impact, no workaround | 15 minutes | 4 hours | Every 30 minutes |
| P2 - High | Service degraded, significant impact, limited workaround | 30 minutes | 8 hours | Every 2 hours |
| P3 - Medium | Partial impact, workaround available, multiple users | 2 hours | 2 business days | Daily |
| P4 - Low | Minor issue, single user, cosmetic, enhancement request | 4 hours | 5 business days | Weekly |

### Service Credit and Penalty Framework

**Service Credit Calculation Methods**

Method 1: Tiered Percentage
- 99.9% - 99.5%: 5% credit on monthly service fee
- 99.5% - 99.0%: 10% credit on monthly service fee
- 99.0% - 98.0%: 20% credit on monthly service fee
- Below 98.0%: 30% credit + right to terminate without penalty

Method 2: Per-Incident
- Each P1 breach of resolution SLA: $[X] per incident
- Each P2 breach of resolution SLA: $[X] per incident
- Maximum monthly credit cap: 30% of monthly fee

Method 3: Performance Scorecard
- Monthly composite score calculated from weighted metrics
- Score > 95%: No action (meets commitment)
- Score 90-95%: Improvement plan required within 10 business days
- Score 80-90%: 10% service credit + improvement plan
- Score < 80%: 20% service credit + executive escalation + 60-day cure period

**Service Credit Checklist**

- [ ] Credits are meaningful enough to incentivize performance (not token amounts)
- [ ] Credit cap prevents provider from treating credits as "cost of doing business"
- [ ] Calculation methodology is objective and based on automated measurements
- [ ] Claim process is simple: automatic application vs. customer-must-claim
- [ ] Credits do not excuse fundamental service failures (termination rights preserved)
- [ ] Earnback or incentive provisions reward sustained excellence above targets
- [ ] Force majeure and exclusion conditions are clearly bounded

### Templates

**Template 1: SLA Document Structure**

```
SERVICE LEVEL AGREEMENT
Between: [Provider] and [Customer]
Effective Date: [Date] | Review Date: [Date] | Version: [X.X]

1. DEFINITIONS
   - Service: [Detailed description of service in scope]
   - Service Hours: [24x7 / Business hours: M-F 8am-6pm ET]
   - Maintenance Window: [Day/time, notification requirements]
   - Measurement Period: [Calendar month]
   - Exclusions: [Planned maintenance, force majeure, customer-caused]

2. SERVICE LEVELS
   | Metric | Target | Commitment | Breach | Measurement Method |
   |--------|--------|------------|--------|-------------------|
   | Availability | 99.95% | 99.9% | < 99.5% | Synthetic monitoring, 1-min intervals |
   | P1 Response | 10 min | 15 min | > 30 min | Ticket timestamp |
   | P1 Resolution | 2 hours | 4 hours | > 8 hours | Ticket timestamp |
   | P95 Latency | 150ms | 300ms | > 500ms | APM tool, sampled |

3. MEASUREMENT AND REPORTING
   - Data source: [Monitoring tool/platform]
   - Reporting frequency: [Real-time dashboard + monthly formal report]
   - Report delivery: By [X] business day of following month
   - Dispute resolution: [Process for challenging measurements]

4. SERVICE CREDITS
   [Credit structure per framework above]

5. ESCALATION PROCEDURES
   [Escalation matrix per governance framework]

6. CUSTOMER OBLIGATIONS
   - Provide timely access and information for incident resolution
   - Maintain compatible systems and configurations per provider specs
   - Report issues through designated channels within [X] minutes

7. REVIEW AND AMENDMENT
   - Quarterly review of SLA relevance and target appropriateness
   - Annual renegotiation aligned with contract renewal cycle
   - Amendment requires written agreement from both parties
```

**Template 2: SLA Monthly Performance Report**

```
SLA PERFORMANCE REPORT
Service: [Name] | Period: [Month/Year] | Provider: [Name]

EXECUTIVE SUMMARY
Overall SLA Compliance: [X]% | Status: [Met / At Risk / Breached]
Service Credits Incurred: $[X] | Trend: [Improving / Stable / Declining]

DETAILED METRICS
| Metric | Target | Actual | Status | Trend (3mo) | Breaches |
|--------|--------|--------|--------|-------------|----------|
| Availability | 99.9% | [X]% | [G/Y/R] | [Up/Down/Flat] | [N] |
| P1 Response | 15 min | [X] min | [G/Y/R] | [Up/Down/Flat] | [N] |
| P1 Resolution | 4 hrs | [X] hrs | [G/Y/R] | [Up/Down/Flat] | [N] |
| P95 Latency | 300ms | [X]ms | [G/Y/R] | [Up/Down/Flat] | [N] |

INCIDENTS
| ID | Priority | Description | Response | Resolution | SLA Met? | Root Cause |
|----|----------|-------------|----------|------------|----------|------------|
| [ID] | P1 | [Brief desc] | [X min] | [X hrs] | [Y/N] | [Category] |

SERVICE CREDIT CALCULATION
[Show calculation based on agreed formula]
Total credits this period: $[X]
YTD cumulative credits: $[X]

IMPROVEMENT ACTIONS
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Action from RCA] | [Name] | [Date] | [Open/Closed] |

NEXT PERIOD OUTLOOK
[Brief narrative on expected performance, planned changes, risk items]
```

**Template 3: OLA Mapping Template**

```
OPERATIONAL LEVEL AGREEMENT MAPPING
Customer SLA: [Service Name] - [Availability Target]%

SUPPORTING OLAs
| OLA | Team/Provider | Metric | Target | Impact on SLA if Breached |
|-----|---------------|--------|--------|---------------------------|
| Network Availability | Network Ops | Uptime | 99.99% | Direct availability impact |
| Database Performance | DBA Team | Query response < 50ms | 99.9% | Latency SLA degradation |
| Compute Capacity | Cloud Ops | Auto-scale response | < 2 min | Throughput SLA risk |
| Security Patching | Security Ops | Patch within SLA window | < 72 hrs | Availability risk from vulns |
| Incident Response | L2 Support | P1 escalation response | < 10 min | Resolution SLA at risk |
| Change Execution | Change Mgmt | Planned change success | > 95% | Availability SLA risk |

DEPENDENCY CHAIN
Customer -> SLA -> Service Team -> OLA -> Infrastructure Teams -> Underpinning Contracts

GAP ANALYSIS
| SLA Requirement | OLA Coverage | Gap | Mitigation |
|-----------------|-------------|-----|------------|
| 99.9% availability | Network: 99.99%, DB: 99.9% | Compute: no formal OLA | Establish compute OLA by [date] |
| P1 resolution: 4hr | L2 response: 10 min | L3 vendor: 2hr response SLA | Negotiate vendor response to 1hr |
```

### Best Practices

- Design SLAs with no more than 5-7 key metrics; too many dilute focus and complicate governance
- Always baseline current performance for 90+ days before committing to SLA targets
- Separate response time SLAs from resolution time SLAs; they measure different capabilities
- Include customer obligations in SLAs; provider performance depends on customer cooperation
- Use automated monitoring for all SLA metrics; manual measurement introduces error and disputes
- Set meaningful service credits (10-30% of fee at risk) not token amounts that fail to motivate
- Define exclusions narrowly and specifically; broad exclusions render SLAs meaningless
- Map OLAs to every SLA to ensure internal teams understand their contribution to commitments
- Review SLA targets annually; outdated targets either create false comfort or unnecessary cost
- Include termination rights for sustained SLA failures beyond just service credits
- Track SLA trends, not just point-in-time compliance; a metric at 99.91% trending downward needs attention
- Build SLA reporting into standard operational cadence, not as a separate exercise
- Ensure SLA measurement methodology is agreed before signing, not after the first dispute
- Design SLAs that incentivize the right behavior, not just the easily measured behavior

### Common Patterns

**Pattern 1: Multi-Tier Support SLA Design**

A company is outsourcing L1/L2 IT support and needs SLAs for a 3-tier model. Action: (1) Define P1-P4 priority classifications with clear business impact criteria, (2) Set L1 SLAs: answer within 60 seconds, resolve 65% at first contact, escalate within 15 minutes if unresolved, (3) Set L2 SLAs: acknowledge within 30 minutes, resolve within 4 hours for P1/P2, (4) Create OLA with internal L3 teams: respond to escalations within 1 hour for P1, (5) Link metrics in a cascade where L1 FCR target reduction flows to L2 volume reduction. Result: End-to-end P1 MTTR target of 4 hours supported by 15-min L1 triage + 30-min L2 response + 3-hour resolution window, with each tier's SLA designed to feed the overall target.

**Pattern 2: SLA Renegotiation During Contract Renewal**

A vendor consistently meets availability SLA (99.9%) but resolution time SLA is breached 3-4 times monthly. The vendor argues targets are unrealistic for the service complexity. Action: (1) Analyze 12 months of breach data: 80% of breaches are P2 resolution (8-hour target), (2) Benchmark against industry: P2 resolution at 8 hours is aggressive for this service category, (3) Negotiate revised P2 target to 12 hours with corresponding credit structure adjustment, (4) Add a new metric for mean time to workaround (MTTW) at 2 hours to ensure rapid impact mitigation even if full resolution takes longer, (5) Increase service credits for P1 breaches as a trade-off. Result: SLA breach rate drops from 15% to 3%, vendor invests in faster workaround capabilities, customer business impact measurably reduced.

### Output Formats

**SLA Document Package**
Complete agreement documentation including: signed SLA with all metrics and commitments, measurement methodology appendix, escalation matrix, service credit calculation examples, and OLA mapping for supporting services.

**SLA Compliance Dashboard**
Real-time visual display showing: current period compliance by metric with green/yellow/red status, trailing 12-month trend charts, active incidents with SLA countdown timers, breach log with root cause categories, and service credit accrual tracker.

**SLA Review Presentation**
Executive-ready deck covering: period performance summary with scorecard, trend analysis with commentary, breach analysis with root causes and corrective actions, benchmarking against targets and industry, and recommendations for SLA adjustments.
