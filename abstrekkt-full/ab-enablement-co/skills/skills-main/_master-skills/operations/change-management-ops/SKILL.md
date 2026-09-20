---
name: change-management-ops
description: Govern operational changes through structured assessment, approval workflows, implementation planning, and rollback procedures to minimize service disruption risk while enabling continuous improvement velocity. Use when managing, optimizing, or automating operational workflows.
---

# Change Management Operations

> Control the chaos of change so every modification lands safely

## Description

Change management operations provides the governance framework for planning, evaluating, approving, and implementing changes to production systems, processes, and infrastructure. This skill covers change categorization, risk assessment, change advisory board (CAB) processes, implementation scheduling, rollback planning, and post-implementation validation. It applies ITIL change management principles adapted for modern operational environments to balance the need for rapid delivery with the imperative of service stability. Practitioners use this skill to reduce change-related incidents while maintaining organizational agility and throughput velocity.

## Activation Triggers

- "Implement a change management process for production systems"
- "Reduce change-related incidents and unplanned outages"
- "Build a change advisory board review and approval process"
- "Create risk assessment criteria for categorizing changes"
- "Design a change calendar and freeze period policy"
- "Develop rollback and backout plans for high-risk changes"
- "Streamline change approvals for low-risk standard changes"
- "Track change success rates and failure patterns"
- "Build a change management policy for regulatory compliance"
- "Integrate change management with CI/CD deployment pipelines"

## Instructions

### Core Workflow

**Step 1: Change Intake and Classification**
- Capture change request with description, scope, justification, and timeline
- Classify change type: standard (pre-approved), normal (requires assessment), emergency
- Identify affected configuration items, services, and stakeholders
- Assign initial risk level based on change scope and affected service criticality
- Route to appropriate approval path based on classification and risk level

**Step 2: Risk Assessment and Planning**
- Evaluate risk using structured assessment: complexity, impact scope, reversibility, experience
- Develop implementation plan with step-by-step procedures and validation checkpoints
- Create rollback plan with specific triggers and procedures for backout
- Identify dependencies: other changes, maintenance windows, resource availability
- Schedule implementation during approved change windows, avoiding freeze periods

**Step 3: Review and Approval**
- Standard changes: auto-approved per pre-defined criteria, logged for audit
- Normal changes: peer review + technical approval + CAB review based on risk level
- Emergency changes: expedited approval from duty manager, retroactive CAB review
- CAB review evaluates: risk assessment completeness, rollback plan viability, timing conflicts
- Document approval decision, conditions, and any required modifications

**Step 4: Implementation and Validation**
- Execute change per approved implementation plan with real-time communication
- Validate each step against success criteria before proceeding to next
- Monitor affected services during and after implementation for anomalies
- Communicate completion to stakeholders with implementation results
- Enter post-implementation observation period (minimum 30 minutes for high-risk)

**Step 5: Review and Closure**
- Verify change achieved stated objectives and no unintended impacts occurred
- Record actual implementation time vs. planned, deviations, and lessons learned
- Update CMDB and documentation to reflect the changed state
- Close change record with final status: successful, failed, or rolled back
- Feed outcomes into change success metrics and trend analysis

### Change Classification and Risk Framework

**Change Type Definitions**

| Type | Definition | Approval Path | Lead Time | Examples |
|---|---|---|---|---|
| Standard | Pre-approved, low-risk, well-understood, repeatable | Auto-approved, logged | 1 business day | Password reset, user provisioning, patch application |
| Normal - Low Risk | Minor change, limited scope, easily reversible | Peer review + manager | 3 business days | Config change, minor update, add monitoring |
| Normal - Medium Risk | Moderate scope, some complexity, reversible with effort | Peer + manager + CAB | 5 business days | Software upgrade, network change, DB migration |
| Normal - High Risk | Broad impact, complex, difficult to reverse | Full CAB + VP approval | 10 business days | Architecture change, platform migration, core system upgrade |
| Emergency | Addresses active incident or critical vulnerability | Duty manager immediate | Immediate | Security patch for active exploit, incident resolution |

**Risk Assessment Scoring**

| Factor | Low (1) | Medium (2) | High (3) | Critical (4) |
|---|---|---|---|---|
| Impact Scope | Single component | Single service | Multiple services | Enterprise-wide |
| Complexity | Simple, scripted | Moderate, documented | Complex, multi-step | Novel, untested |
| Reversibility | Instant rollback | Rollback < 30 min | Rollback < 4 hours | Irreversible or > 4 hrs |
| Experience | Done many times | Done several times | Done once or twice | First time ever |
| Testing | Full regression | Partial testing | Limited testing | No testing possible |
| Timing | Off-peak, low traffic | Business hours, moderate | Peak hours, high traffic | During critical event |

Risk Score = Sum of all factors (6-24)
- Low Risk: 6-10 | Medium Risk: 11-15 | High Risk: 16-20 | Critical Risk: 21-24

### Change Advisory Board Framework

**CAB Structure and Cadence**

| Meeting | Frequency | Attendees | Scope |
|---|---|---|---|
| Weekly CAB | Weekly (Tuesday recommended) | Change manager, tech leads, ops, security | Normal medium and high-risk changes |
| Emergency CAB | As needed (within 1 hour) | Duty manager, impacted service owners | Emergency changes requiring retroactive review |
| Monthly CAB Review | Monthly | CAB members + management | Change metrics, trends, process improvements |
| Change Freeze Board | Pre-freeze period | CAB + business stakeholders | Exception requests during freeze periods |

**CAB Review Checklist**

- [ ] Change description is clear and scope is well-defined
- [ ] Business justification documented and sponsor identified
- [ ] Risk assessment completed with appropriate risk score
- [ ] Implementation plan has step-by-step procedures with time estimates
- [ ] Rollback plan is viable and tested where applicable
- [ ] Post-implementation validation criteria are defined
- [ ] Affected services and stakeholders identified and notified
- [ ] No conflicts with other scheduled changes or freeze periods
- [ ] Required resources confirmed available for implementation window
- [ ] Communication plan covers all impacted parties
- [ ] Compliance and security implications reviewed

**Change Window Policy**

| Window | Timing | Change Types Allowed | Approval |
|---|---|---|---|
| Standard Window | Tue-Thu, 10pm-6am | All approved changes | Per normal approval |
| Extended Window | Sat 10pm - Sun 6am | High-risk, extended duration | CAB + VP |
| Business Hours | M-F, 8am-6pm | Standard and low-risk only | Per type |
| Freeze Period | [Defined periods] | Emergency only | Freeze board exception |
| Blackout | Critical business events | No changes permitted | No exceptions |

### Templates

**Template 1: Change Request Form**

```
CHANGE REQUEST
CR Number: [Auto-generated] | Date: [Auto] | Requester: [Name]

CHANGE DETAILS
Title: [Brief descriptive title]
Type: [Standard / Normal / Emergency]
Category: [Application / Infrastructure / Network / Database / Security / Process]
Priority: [Low / Medium / High / Critical]

DESCRIPTION
What is being changed: [Detailed technical description]
Why is it needed: [Business justification and expected benefit]
What happens if not implemented: [Risk of inaction]

SCOPE AND IMPACT
Affected services: [List all impacted services/applications]
Affected CIs: [Configuration items from CMDB]
User impact during change: [Expected disruption description]
Estimated users affected: [Number or percentage]

SCHEDULE
Requested implementation date: [Date]
Implementation window: [Start time - End time]
Estimated duration: [Hours/Minutes]
Rollback deadline: [Point of no return timestamp]

IMPLEMENTATION PLAN
Pre-implementation:
1. [ ] [Backup/snapshot step]
2. [ ] [Notification to stakeholders]
3. [ ] [Pre-change validation]

Implementation:
1. [ ] [Step 1 with expected duration]
2. [ ] [Step 2 with expected duration]
3. [ ] [Validation checkpoint]
4. [ ] [Step 3 with expected duration]

Post-implementation:
1. [ ] [Service validation]
2. [ ] [Monitoring confirmation]
3. [ ] [Stakeholder notification]

ROLLBACK PLAN
Trigger criteria: [What conditions trigger rollback]
Rollback steps:
1. [ ] [Rollback step 1]
2. [ ] [Rollback step 2]
3. [ ] [Validate rollback complete]
Estimated rollback duration: [Minutes/Hours]

RISK ASSESSMENT
Risk score: [X/24] | Risk level: [Low/Medium/High/Critical]
[Individual factor scores listed]

APPROVALS
| Approver | Role | Decision | Date | Comments |
|----------|------|----------|------|----------|
| [Name] | Peer Reviewer | [Pending] | | |
| [Name] | Manager | [Pending] | | |
| [Name] | CAB | [Pending] | | |
```

**Template 2: Post-Implementation Review**

```
POST-IMPLEMENTATION REVIEW
CR Number: [X] | Implementation Date: [Date] | Reviewer: [Name]

OUTCOME: [Successful / Failed / Rolled Back / Partial]

IMPLEMENTATION SUMMARY
Planned start: [Time] | Actual start: [Time] | Variance: [+/- X min]
Planned end: [Time] | Actual end: [Time] | Variance: [+/- X min]
Planned duration: [X hrs] | Actual duration: [X hrs]

DEVIATIONS FROM PLAN
[List any steps that deviated from the approved plan, and why]

VALIDATION RESULTS
| Check | Expected | Actual | Pass/Fail |
|-------|----------|--------|-----------|
| [Service health] | [Green] | [Status] | [P/F] |
| [Performance metric] | [Baseline +/- X%] | [Value] | [P/F] |
| [User verification] | [Functional] | [Status] | [P/F] |

INCIDENTS RELATED TO CHANGE
| Incident ID | Description | Impact | Resolved? |
|-------------|-------------|--------|-----------|
| [INC-X] | [Brief] | [Scope] | [Y/N] |

LESSONS LEARNED
- [What went well]
- [What could be improved]
- [Recommendation for similar future changes]

STATUS: [Closed - Successful / Closed - Failed / Requires Follow-up]
```

**Template 3: Change Freeze Policy**

```
CHANGE FREEZE POLICY
Effective: [Date] | Owner: [Change Manager]

FREEZE PERIODS FOR [YEAR]
| Period | Start | End | Reason | Exception Authority |
|--------|-------|-----|--------|---------------------|
| Year-End | Dec 15 | Jan 5 | Peak business, reduced staffing | CTO |
| Q1 Close | Mar 28 | Apr 2 | Financial close processing | VP Ops |
| [Event] | [Date] | [Date] | [Reason] | [Authority] |

FREEZE RULES
During freeze periods:
- NO normal changes permitted (standard, low, medium, high risk)
- Emergency changes permitted with enhanced approval:
  1. Active P1/P2 incident remediation
  2. Critical security vulnerability (CVSS > 9.0)
  3. Regulatory compliance deadline

EXCEPTION REQUEST PROCESS
1. Submit exception request to Change Manager with business justification
2. Risk assessment completed at one level higher than normal classification
3. Approval required from exception authority listed above
4. Enhanced monitoring during and 24 hours after implementation
5. Post-implementation review required within 24 hours

COMMUNICATION
- Freeze announcement: 30 days before start
- Reminder: 7 days before start
- Daily freeze status: During freeze period
- Freeze lift confirmation: End of freeze
```

### Best Practices

- Pre-approve standard changes for common, low-risk activities to reduce CAB burden by 40-60%
- Correlate changes with incidents; track change failure rate to identify systemic weaknesses
- Keep CAB meetings focused and time-boxed; review only medium and high-risk changes in CAB
- Require every change to have a documented rollback plan with specific trigger criteria
- Implement automated change conflict detection to prevent scheduling overlaps on shared infrastructure
- Use deployment automation (CI/CD) to reduce human error in repetitive change execution
- Define change freeze periods aligned with critical business dates and communicate early
- Track change lead time (request to implementation) as an agility metric alongside stability metrics
- Implement post-implementation reviews for all failed changes and a sample of successful ones
- Separate change authority from change requestor; no one approves their own changes
- Maintain a forward schedule of change (FSC) visible to all operations and service management
- Emergency changes must have retroactive CAB review within 48 hours, no exceptions
- Use change risk scoring consistently to ensure similar changes receive similar scrutiny
- Integrate change management data with CMDB to maintain accurate configuration records
- Measure and publish change success rate weekly; target > 95% to drive improvement focus

### Common Patterns

**Pattern 1: Reducing Change-Related Incidents**

An IT operations team implements 200 changes monthly with a 12% change failure rate causing 24 incidents per month. Analysis shows failures concentrate in manual database changes (28% failure) and network configuration changes (22% failure). Action: (1) Require automated scripting for all DB changes with dry-run validation, (2) Implement network change automation with pre/post config diff verification, (3) Add mandatory peer review for high-failure categories, (4) Require rollback testing in non-production before approval. Result: Overall change failure rate drops from 12% to 4%, change-related incidents decrease from 24 to 8 per month, MTTR for failed changes improves 50% due to tested rollback plans.

**Pattern 2: Accelerating Change Velocity Without Increasing Risk**

A development team deploys 15 times per month with a 5-day average change lead time due to CAB queue and approval delays. Business pressure demands faster release cycles. Action: (1) Analyze change data: 70% of changes are low-risk application deployments with <2% failure rate, (2) Define these as standard changes with automated approval via CI/CD pipeline gates, (3) Require automated test pass, security scan pass, and canary deployment health check as approval criteria, (4) Reserve CAB review for infrastructure and high-risk changes only. Result: Standard change lead time drops from 5 days to 4 hours, deployment frequency increases to 40+ per month, CAB meeting duration cut in half, overall change failure rate unchanged at 5%.

### Output Formats

**Change Management Dashboard**
Real-time display showing: forward schedule of change calendar view, change pipeline by status (submitted, reviewed, approved, scheduled, implementing), change success/failure rate trending, change volume by type and risk level, and upcoming freeze periods.

**Weekly Change Report**
Summary covering: changes implemented this week (count by type, success/failure), failed changes with brief root cause, upcoming scheduled changes for next week, CAB decisions and action items, and change management KPI snapshot.

**Change Program Health Report**
Monthly executive report covering: change volume and trend analysis, change failure rate with drill-down by category, change-related incident correlation, lead time analysis by change type, process compliance metrics, and improvement recommendations.
