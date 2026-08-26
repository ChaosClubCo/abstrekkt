---
name: incident-management-ops
description: Manage operational incidents from detection through resolution and post-incident review, with structured triage, escalation procedures, communication protocols, and root cause analysis to minimize MTTR and business impact. Use when managing, optimizing, or automating operational workflows.
---

# Incident Management Operations

> Detect fast, respond faster, resolve permanently

## Description

Incident management operations provides a structured framework for identifying, categorizing, prioritizing, and resolving unplanned disruptions to services or operations. This skill covers incident detection and alerting, triage and classification, escalation procedures, communication management, resolution coordination, and post-incident review processes. It applies ITIL-aligned practices adapted for operational environments to minimize mean time to detect (MTTD), mean time to respond (MTTR), and business impact duration. Practitioners use this skill to build organizational muscle for handling incidents efficiently while extracting learning that prevents recurrence.

## Activation Triggers

- "Set up an incident management process for our operations team"
- "Reduce our mean time to resolution for critical incidents"
- "Build an incident escalation matrix with clear ownership"
- "Create a post-incident review template and process"
- "Design an on-call rotation and incident response structure"
- "Improve our incident communication to stakeholders during outages"
- "Classify and prioritize incidents by business impact"
- "Build a runbook library for common incident scenarios"
- "Set up incident metrics tracking and trend analysis"
- "Design a major incident management process for P1 events"

## Instructions

### Core Workflow

**Step 1: Detection and Intake**
- Configure monitoring and alerting for all critical systems and services
- Define alert thresholds that balance sensitivity (catch real issues) with specificity (avoid noise)
- Establish intake channels: monitoring alerts, user reports, automated health checks
- Assign unique incident ID and timestamp upon creation
- Perform initial triage: validate the incident is real, not a false positive or duplicate

**Step 2: Classification and Prioritization**
- Categorize by affected service, component, and incident type (outage, degradation, security)
- Assess business impact: users affected, revenue impact, safety implications, regulatory exposure
- Determine urgency: rate of degradation, time sensitivity, workaround availability
- Assign priority using impact x urgency matrix (P1-P4)
- Route to appropriate resolver group based on category and technical domain

**Step 3: Investigation and Diagnosis**
- Assemble incident response team appropriate to priority level
- Establish communication bridge (war room, Slack channel, conference call) for P1/P2
- Follow diagnostic runbooks where available for known incident patterns
- Collect and correlate data: logs, metrics, recent changes, alerts timeline
- Identify root cause or most probable cause hypothesis and test it

**Step 4: Resolution and Recovery**
- Implement fix: apply known resolution, rollback change, failover, or temporary workaround
- Validate resolution: confirm service restored and metrics return to normal
- Communicate resolution to all stakeholders with impact summary
- Monitor for recurrence during a stability observation period (minimum 30 minutes for P1)
- Close incident record with resolution details, timeline, and categorization

**Step 5: Post-Incident Review**
- Conduct blameless post-incident review within 48 hours for P1, 5 days for P2
- Build detailed incident timeline: detection, response, diagnosis, resolution milestones
- Identify root cause(s) and contributing factors using 5-Whys or fishbone analysis
- Define corrective actions with owners, due dates, and tracking mechanism
- Publish post-incident review to knowledge base for organizational learning

### Incident Priority Framework

**Impact x Urgency Matrix**

|  | Urgency: Critical | Urgency: High | Urgency: Medium | Urgency: Low |
|---|---|---|---|---|
| **Impact: Critical** | P1 | P1 | P2 | P3 |
| **Impact: High** | P1 | P2 | P2 | P3 |
| **Impact: Medium** | P2 | P2 | P3 | P4 |
| **Impact: Low** | P3 | P3 | P4 | P4 |

**Priority Level Definitions and Response Targets**

| Priority | Definition | Response | Engagement | Resolution Target | Communication |
|---|---|---|---|---|---|
| P1 - Critical | Complete service outage, all users impacted, revenue-impacting | 5 min | Incident commander + SMEs + management | 4 hours | Every 30 min |
| P2 - High | Major degradation, many users impacted, significant feature loss | 15 min | On-call engineer + backup SME | 8 hours | Every 2 hours |
| P3 - Medium | Partial impact, workaround exists, limited user impact | 1 hour | On-call engineer | 3 business days | Daily |
| P4 - Low | Minor issue, cosmetic, single user, no workaround urgency | 4 hours | Queue-based assignment | 5 business days | On resolution |

**Incident Severity Classification Criteria**

| Criterion | Critical | High | Medium | Low |
|---|---|---|---|---|
| Users Affected | All / >50% | 25-50% | 5-25% | <5% or single |
| Revenue Impact | Direct revenue loss | Indirect revenue risk | Potential future impact | No revenue impact |
| Data Impact | Data loss or corruption | Data access impaired | Data delayed | No data impact |
| Safety/Compliance | Safety risk or regulatory breach | Compliance risk | Audit finding | No compliance impact |
| Workaround | None available | Partial, difficult | Available, moderate effort | Easy workaround |

### Incident Response Operating Model

**On-Call Structure**

| Role | Responsibility | Availability | Escalation Path |
|---|---|---|---|
| Primary On-Call | First responder, initial triage and diagnosis | 24/7 during rotation | -> Secondary On-Call |
| Secondary On-Call | Backup, complex escalations, additional expertise | 24/7 during rotation | -> Engineering Manager |
| Incident Commander | Major incident coordination, communications, decisions | Activated for P1/P2 | -> VP/Director of Ops |
| Communications Lead | Stakeholder updates, status page, customer comms | Activated for P1 | -> Head of Comms |
| Subject Matter Expert | Deep technical expertise for specific domains | On-call by domain | -> Domain Lead |

**Escalation Matrix**

| Trigger | Action | Timeframe |
|---|---|---|
| P1 incident declared | Page IC + Primary + Secondary + Engineering Manager | Immediate |
| P1 not acknowledged in 5 min | Auto-escalate to Secondary and Manager | 5 minutes |
| P1 no diagnosis after 30 min | Engage additional SMEs, notify Director | 30 minutes |
| P1 no resolution after 2 hours | Escalate to VP, activate vendor support if applicable | 2 hours |
| P1 no resolution after 4 hours | Executive notification, evaluate business continuity plan | 4 hours |
| P2 not acknowledged in 15 min | Auto-escalate to Secondary | 15 minutes |
| P2 no resolution after 4 hours | Escalate to Manager, consider upgrade to P1 | 4 hours |
| Any incident exceeding resolution SLA | Auto-notify manager + SLA reporting | At SLA breach |

**Incident Communication Templates**

Initial notification: "INCIDENT [ID] - [Priority]: [Service] experiencing [issue description]. Impact: [who/what affected]. Investigation in progress. Next update in [X] minutes."

Progress update: "INCIDENT [ID] UPDATE: Root cause identified as [cause]. Remediation in progress: [action being taken]. Estimated resolution: [time or TBD]. Current impact: [updated scope]."

Resolution notice: "INCIDENT [ID] RESOLVED: [Service] fully restored at [timestamp]. Duration: [X hours/minutes]. Root cause: [brief]. Full post-incident review to follow within [X] days."

### Templates

**Template 1: Incident Report**

```
INCIDENT REPORT
Incident ID: [INC-XXXX] | Priority: [P1/P2/P3/P4]
Status: [Open / Investigating / Resolved / Closed]

SUMMARY
Service Affected: [Name]
Start Time: [Timestamp] | Detected: [Timestamp] | Resolved: [Timestamp]
Duration: [X hours, X minutes]
Impact: [Description of business impact, users affected, revenue impact]

TIMELINE
| Time | Event | Actor |
|------|-------|-------|
| [HH:MM] | Alert triggered: [description] | Monitoring |
| [HH:MM] | Incident acknowledged by [name] | On-call |
| [HH:MM] | Incident commander engaged | [Name] |
| [HH:MM] | Root cause identified: [brief] | [Name] |
| [HH:MM] | Fix applied: [action taken] | [Name] |
| [HH:MM] | Service confirmed restored | [Name] |
| [HH:MM] | Stability observation complete, incident closed | [Name] |

ROOT CAUSE
[Detailed explanation of what caused the incident]
Contributing factors: [What made it worse or delayed resolution]

RESOLUTION
[What was done to restore service]
Permanent fix status: [Implemented / Pending / Requires change request]

METRICS
MTTD (time to detect): [X minutes]
MTTR (time to respond): [X minutes]
MTTF (time to fix): [X hours]
Total business impact duration: [X hours]

CORRECTIVE ACTIONS
| # | Action | Owner | Due Date | Status |
|---|--------|-------|----------|--------|
| 1 | [Action item] | [Name] | [Date] | [Open] |
| 2 | [Action item] | [Name] | [Date] | [Open] |
| 3 | [Action item] | [Name] | [Date] | [Open] |
```

**Template 2: Post-Incident Review (PIR)**

```
POST-INCIDENT REVIEW
Incident: [INC-XXXX] | Date of Review: [Date] | Facilitator: [Name]
Attendees: [Names and roles]

INCIDENT SUMMARY
[2-3 sentence summary: what happened, impact, duration, resolution]

WHAT WENT WELL
- [Aspect of response that worked effectively]
- [Detection or communication that was timely]
- [Team behavior or process that aided resolution]

WHAT COULD BE IMPROVED
- [Gap in detection or monitoring]
- [Delay in response or escalation]
- [Missing runbook or documentation]
- [Communication gap or confusion]

5-WHYS ROOT CAUSE ANALYSIS
1. Why did the service fail? [Answer]
2. Why did [Answer 1] happen? [Answer]
3. Why did [Answer 2] happen? [Answer]
4. Why did [Answer 3] happen? [Answer]
5. Why did [Answer 4] happen? [Root cause]

CONTRIBUTING FACTORS
- [Factor that amplified impact or delayed resolution]
- [Systemic issue that enabled the root cause]

ACTION ITEMS (Preventive and Detective)
| # | Action | Type | Owner | Priority | Due Date |
|---|--------|------|-------|----------|----------|
| 1 | [Prevent recurrence] | Preventive | [Name] | High | [Date] |
| 2 | [Improve detection] | Detective | [Name] | Medium | [Date] |
| 3 | [Improve response] | Process | [Name] | Medium | [Date] |

LESSONS LEARNED
[Key takeaway that should be shared with the broader organization]
```

**Template 3: Operational Runbook**

```
INCIDENT RUNBOOK: [Scenario Name]
Version: [X] | Last Updated: [Date] | Owner: [Team]
Related Alerts: [Alert names/IDs that trigger this runbook]

SYMPTOMS
- [Observable symptom 1: what the user or monitor sees]
- [Observable symptom 2]
- [Observable symptom 3]

IMPACT
Affected service: [Name] | Expected user impact: [Description]
Priority: Typically [P1/P2/P3] based on scope

DIAGNOSTIC STEPS
1. [ ] Check [system/dashboard/log] for [specific indicator]
   Command: [exact command or URL]
   Expected: [what normal looks like]
   Abnormal: [what the problem looks like]

2. [ ] Verify [component] status
   Command: [exact command or URL]
   Expected: [normal state]

3. [ ] Check recent changes in [change management system]
   Look for: [deployments, config changes, infrastructure changes in last 24 hrs]

RESOLUTION PROCEDURES
Scenario A: [Root cause description]
1. [ ] [Step 1 with exact command/action]
2. [ ] [Step 2]
3. [ ] Validate: [how to confirm fix worked]

Scenario B: [Alternative root cause]
1. [ ] [Step 1 with exact command/action]
2. [ ] [Step 2]
3. [ ] Validate: [how to confirm fix worked]

ROLLBACK PROCEDURE (if resolution causes new issues)
1. [ ] [Rollback step 1]
2. [ ] [Rollback step 2]

ESCALATION
If not resolved within [X] minutes, escalate to: [Team/Person] via [Channel]
Include: [What information to provide when escalating]
```

### Best Practices

- Conduct blameless post-incident reviews; punishing responders discourages reporting and transparency
- Invest in MTTD reduction as much as MTTR; you cannot fix what you have not detected
- Maintain runbooks for the top 20 most common incident types covering 80% of incidents
- Set up automated escalation timers; relying on humans to self-escalate under pressure fails
- Separate incident communication from incident resolution; assign dedicated communications lead for P1
- Use a single source of truth for incident status (status page, Slack channel) to prevent conflicting updates
- Track incidents to changes: 60-70% of incidents correlate with recent changes
- Define clear criteria for major incident declaration to avoid ambiguity during stress
- Practice incident response regularly through game days and tabletop exercises
- Maintain an incident commander rotation separate from on-call engineering rotation
- Close corrective actions within 30 days; aging action items signal systemic follow-through issues
- Classify root causes into categories to identify systemic patterns across incidents
- Review incident trends monthly: volume, MTTR, repeat incidents, and corrective action completion
- Design alerts with clear, actionable descriptions including link to relevant runbook
- Keep incident priority definitions visible and non-negotiable to prevent priority inflation

### Common Patterns

**Pattern 1: Reducing MTTR Through Structured Triage**

A platform team averages 47-minute MTTR for P1 incidents, with analysis showing 22 minutes spent on triage and team assembly. Action: (1) Implement automated incident creation from monitoring with pre-populated fields, (2) Create alert-to-runbook mapping so responders immediately know diagnostic steps, (3) Deploy auto-paging of incident commander and relevant SMEs based on affected service, (4) Pre-configure war room bridges that activate automatically for P1 alerts. Result: Triage time reduced from 22 minutes to 6 minutes, overall MTTR improved to 31 minutes, a 34% improvement.

**Pattern 2: Breaking the Repeat Incident Cycle**

An operations team resolves an average of 140 incidents monthly, but 35% are repeat incidents for known issues. Corrective action completion rate from PIRs is only 40%. Action: (1) Implement corrective action tracking in engineering sprint backlog with SLA, (2) Tag incidents with root cause category and link to prior PIR when recurring, (3) Publish monthly "repeat offender" report to engineering leadership showing cost of inaction, (4) Require PIR action items to be completed before related change requests are approved. Result: Corrective action completion improves to 85%, repeat incident rate drops from 35% to 12% over 6 months, total incident volume decreases by 25%.

### Output Formats

**Incident Management Dashboard**
Real-time display showing: active incidents by priority with age timers, MTTD/MTTR trending charts, incident volume by category and priority over time, SLA compliance gauges, on-call roster with current responder, and corrective action completion tracker.

**Monthly Incident Report**
Structured report covering: incident volume summary (total, by priority, by category), MTTR analysis with trend and distribution, top recurring incidents with root cause themes, SLA compliance rates, corrective action status, and notable incidents with summaries.

**Executive Incident Brief**
One-page summary for leadership covering: overall service health score, P1/P2 incident count with comparison to prior period, customer impact summary, top 3 corrective actions requiring investment or decision, and reliability trend indicators.
