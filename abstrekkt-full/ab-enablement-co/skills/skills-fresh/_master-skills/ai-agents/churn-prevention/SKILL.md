---
name: churn-prevention
description: Helps configure and build churn prevention processes. Churn prevention strategies for INT Inc., including at-risk customer identification, early warning systems, intervention playbooks, and win-back campaigns. Protects revenue through proactive retention efforts and systematic recovery processes. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Churn Prevention

## Overview

Churn prevention is the proactive identification and remediation of factors that lead customers to discontinue their relationship with INT Inc. Effective churn prevention protects revenue, reduces acquisition costs, and strengthens the overall customer base.

The cost of acquiring a new customer is typically 5-7 times higher than retaining an existing one. Beyond direct revenue impact, churn affects market reputation, team morale, and growth trajectory.

### Churn Prevention Philosophy

1. **Prevention Over Recovery** - Identify risks before they become crises
2. **Root Cause Focus** - Address underlying issues, not just symptoms
3. **Data-Driven Detection** - Use signals and patterns for early warning
4. **Personalized Intervention** - Tailor response to specific risk factors
5. **Continuous Learning** - Analyze every churn to prevent future losses

### Churn Categories

| Category | Description | Preventability |
|----------|-------------|----------------|
| Voluntary - Controllable | Dissatisfaction, poor fit, better alternatives | High |
| Voluntary - Uncontrollable | Business closure, acquisition, budget elimination | Low |
| Involuntary | Payment failure, contract violation | Medium |
| Logo Churn | Customer completely departs | Primary focus |
| Revenue Churn | Downgrades, reduced spend | Secondary focus |

### Churn Timeline

```
Healthy Customer
     ↓
Early Warning Signs (T-180 to T-90)
     ↓
At-Risk Status (T-90 to T-30)
     ↓
Critical Risk (T-30 to T-0)
     ↓
Churn Event
     ↓
Win-Back Opportunity (Post-Churn)
```

## When to Use

### Trigger Scenarios

- **Health Score Drop** - Significant decrease in customer health score
- **Usage Decline** - Meaningful reduction in platform engagement
- **Support Escalation** - Major unresolved issues or complaints
- **Stakeholder Changes** - Champion departure, sponsor change
- **Renewal Risk** - Concerns expressed about continuation
- **Competitive Activity** - Vendor evaluations underway
- **Payment Issues** - Late payments, failed transactions

### Risk Level Definitions

| Level | Health Score | Timeline | Action Required |
|-------|--------------|----------|-----------------|
| Green | 70-100 | Normal ops | Standard engagement |
| Yellow | 50-69 | 90+ days | Enhanced monitoring |
| Orange | 30-49 | 30-90 days | Intervention plan |
| Red | 0-29 | <30 days | Escalated response |

### Stakeholder Involvement

**Internal Team:**
- Customer Success Manager - Primary owner
- CS Leadership - Escalation and resources
- Executive Sponsor - Strategic relationships
- Support - Issue resolution
- Product - Technical solutions
- Finance - Contract flexibility

**Client Stakeholders:**
- Day-to-day contacts - Relationship maintenance
- Champions - Internal advocacy
- Decision makers - Contract authority
- Executive sponsors - Strategic alignment

## Core Processes

### 1. At-Risk Identification

**Early Warning Indicators:**

**Behavioral Signals:**
| Signal | Weight | Detection Method |
|--------|--------|------------------|
| Login frequency decline >30% | High | Usage analytics |
| Feature adoption stagnation | Medium | Product telemetry |
| Support ticket surge | High | Support system |
| Meeting cancellations | Medium | CRM activity |
| Unresponsiveness to outreach | High | Email/call tracking |
| Reduced stakeholder engagement | Medium | Relationship tracking |

**Situational Signals:**
| Signal | Weight | Detection Method |
|--------|--------|------------------|
| Champion departure | Critical | Stakeholder monitoring |
| Budget discussions | High | CSM intelligence |
| Competitive evaluation | Critical | CSM intelligence |
| Organizational changes | Medium | News monitoring |
| Negative feedback | High | Survey responses |
| Contract negotiation difficulties | High | Renewal tracking |

**Risk Scoring Model:**

```
Risk Score = Σ (Signal Weight × Presence)

Score Ranges:
0-20:   Low Risk (Green)
21-40:  Moderate Risk (Yellow)
41-60:  Elevated Risk (Orange)
61-100: Critical Risk (Red)
```

**Automated Alert Triggers:**
- Health score drops >15 points in 30 days
- Usage drops >40% month-over-month
- NPS score of 6 or below
- Support escalation opened
- No login for 14+ days
- Payment 30+ days overdue

### 2. Risk Assessment Framework

**Root Cause Categories:**

| Category | Common Causes | Investigation Approach |
|----------|---------------|----------------------|
| Product | Missing features, bugs, performance | Usage analysis, support tickets |
| Service | Poor support, implementation issues | CSAT, ticket history, feedback |
| Value | ROI not realized, unclear benefits | Success criteria review |
| Relationship | CSM turnover, poor communication | Engagement history, feedback |
| Strategic | Business change, budget, M&A | Client discussions, news |
| Competitive | Better alternatives identified | Discovery conversations |

**Assessment Questions:**

```
PRODUCT FIT
- Are they using the core features they purchased?
- What features are they not using and why?
- Have they reported bugs or performance issues?
- Is the product meeting their stated needs?

VALUE REALIZATION
- Have they achieved their success criteria?
- Can they quantify the value received?
- Is the ROI clear and compelling?
- Are they getting value commensurate with investment?

RELATIONSHIP HEALTH
- How is their relationship with their CSM?
- Are stakeholders engaged and responsive?
- Is there an active champion?
- Do we have executive-level relationships?

EXTERNAL FACTORS
- Are there organizational changes affecting them?
- Have they mentioned budget constraints?
- Are they evaluating competitors?
- Has their business strategy changed?
```

**Risk Documentation Template:**

```
AT-RISK ACCOUNT ASSESSMENT
Account: [Name]
Assessment Date: [Date]
Assessed By: [CSM Name]
Risk Level: [Red/Orange/Yellow]

RISK SIGNALS IDENTIFIED:
1. [Signal] - [Evidence]
2. [Signal] - [Evidence]
3. [Signal] - [Evidence]

ROOT CAUSE ANALYSIS:
Primary Cause: [Category]
Description: [Detailed explanation]

STAKEHOLDER STATUS:
- Champion: [Name] - [Status]
- Decision Maker: [Name] - [Status]
- Executive Sponsor: [Name] - [Status]

RECOMMENDED INTERVENTION:
[Proposed approach]

RESOURCES NEEDED:
[Required support]

SUCCESS CRITERIA FOR RECOVERY:
[How we will know the risk is mitigated]
```

### 3. Intervention Playbooks

**Playbook Selection Matrix:**

| Risk Factor | Primary Playbook | Secondary Actions |
|-------------|------------------|-------------------|
| Low usage | Adoption Recovery | Training, Success Planning |
| Poor support experience | Service Recovery | Executive apology, Credits |
| Value not realized | Value Acceleration | QBR, ROI workshop |
| Champion loss | Relationship Rebuild | Multi-threading, Exec engagement |
| Competitive threat | Competitive Response | Executive briefing, Roadmap |
| Budget concerns | Value Defense | ROI documentation, Right-sizing |

**Adoption Recovery Playbook:**

```
OBJECTIVE: Increase product usage and engagement

DAY 1-3:
□ Analyze usage patterns to identify gaps
□ Review original success criteria
□ Schedule discovery call with key users

DAY 4-7:
□ Conduct adoption assessment call
□ Identify barriers to usage
□ Develop targeted enablement plan

DAY 8-14:
□ Deliver focused training sessions
□ Create quick-win action items
□ Establish usage goals and tracking

DAY 15-30:
□ Weekly check-ins on progress
□ Celebrate wins and address blockers
□ Adjust approach based on results

SUCCESS METRICS:
- Usage increase of 30%+ within 30 days
- Key features adopted
- User satisfaction improvement
```

**Service Recovery Playbook:**

```
OBJECTIVE: Restore confidence after poor service experience

IMMEDIATE (Day 1):
□ Acknowledge the issue personally
□ Apologize sincerely (CSM and Manager)
□ Commit to resolution and timeline

SHORT-TERM (Day 2-7):
□ Resolve outstanding issues with priority
□ Provide regular status updates
□ Consider goodwill gesture (credits, extended service)

MEDIUM-TERM (Day 8-30):
□ Conduct post-recovery check-in
□ Document preventive measures taken
□ Schedule QBR to rebuild relationship

LONG-TERM (Day 31+):
□ Enhanced monitoring of account health
□ Proactive outreach cadence
□ Executive relationship building

SUCCESS METRICS:
- Issue fully resolved
- CSAT improvement
- No further escalations
- Positive QBR outcome
```

**Competitive Response Playbook:**

```
OBJECTIVE: Defend against competitive displacement

DISCOVERY (Day 1-3):
□ Understand competitive evaluation drivers
□ Identify competitors being considered
□ Assess decision timeline and criteria

RESPONSE (Day 4-14):
□ Engage executive sponsor
□ Conduct competitive positioning session
□ Address specific competitor claims
□ Demonstrate unique value and roadmap

REINFORCEMENT (Day 15-30):
□ Provide customer references
□ Offer proof of concept if applicable
□ Document ROI and switching costs
□ Negotiate if necessary

SUCCESS METRICS:
- Competitive evaluation halted
- Renewal commitment secured
- Relationship strengthened
```

### 4. Escalation Protocol

**Escalation Triggers:**

| Condition | Escalation Level | Response Time |
|-----------|------------------|---------------|
| Health score <30 | Manager | Same day |
| Churn notice received | Director + VP | Immediate |
| Executive complaint | VP + C-Level | Within 2 hours |
| Multi-account risk | VP | Same day |
| >$100K ARR at risk | C-Level | Within 4 hours |

**Executive Save Engagement:**

```
PREPARATION:
- Full account history and context
- Root cause analysis
- Proposed resolution options
- Customer contact information
- Talking points and positioning

EXECUTIVE ACTIONS:
1. Personal outreach (call or email)
2. Acknowledge concerns and apologize
3. Present resolution commitment
4. Offer executive-level ongoing engagement
5. Follow up with written confirmation

POST-ENGAGEMENT:
- Document conversation outcomes
- Implement agreed actions
- Monitor closely
- Regular executive updates until stable
```

### 5. Win-Back Program

**Win-Back Eligibility:**
- Churned within past 12 months
- Voluntary departure (controllable reasons)
- Not hostile or contentious departure
- Product/service improvements address their concerns

**Win-Back Timeline:**

| Timeframe | Activity |
|-----------|----------|
| Day 1-7 | Post-churn analysis and documentation |
| Day 30 | Initial check-in communication |
| Day 90 | Win-back offer consideration |
| Day 180 | Relationship maintenance |
| Day 365 | Final outreach attempt |

**Win-Back Communication Sequence:**

**Day 30 Email:**
```
Subject: We miss you at INT Inc.

Dear [Name],

It has been a month since we parted ways, and I wanted to
reach out personally.

I hope your transition has been smooth. We have been reflecting
on your feedback and have made several improvements that
address the concerns you raised.

I would welcome the chance to stay in touch. No pressure,
just an open door if your needs change.

Best regards,
[CSM Name]
```

**Day 90 Email:**
```
Subject: Updates from INT Inc. - Thought you would be interested

Dear [Name],

I wanted to share some updates from INT Inc. that might be
relevant to you:

- [Improvement 1 related to their concerns]
- [Improvement 2 related to their concerns]
- [New feature that addresses their needs]

If your situation has changed or you would like to explore
returning, we would welcome the conversation. We have also
created a special return offer for former customers.

Would you be open to a brief call?

Best regards,
[CSM Name]
```

**Win-Back Offer Framework:**
- Discounted pricing for return
- Waived implementation fees
- Extended trial period
- Dedicated onboarding resources
- Executive sponsorship commitment

### 6. Churn Analysis and Learning

**Churn Post-Mortem Template:**

```
CHURN POST-MORTEM ANALYSIS
Account: [Name]
Churn Date: [Date]
ARR Lost: $[Amount]
CSM: [Name]

ACCOUNT OVERVIEW:
- Customer since: [Date]
- Products: [List]
- Use case: [Description]

CHURN REASON:
Primary: [Category]
Secondary: [Category]
Description: [Detailed explanation]

TIMELINE OF EVENTS:
- [Date]: [Event]
- [Date]: [Event]
- [Date]: [Event]

WARNING SIGNS IDENTIFIED:
- [Signal] at [Date] - [Was it detected?]
- [Signal] at [Date] - [Was it detected?]

INTERVENTION ATTEMPTS:
- [Action taken] - [Result]
- [Action taken] - [Result]

ROOT CAUSE ANALYSIS:
[Deep dive into why churn occurred]

LESSONS LEARNED:
1. [Lesson]
2. [Lesson]
3. [Lesson]

RECOMMENDED PREVENTIVE ACTIONS:
1. [Action] - Owner: [Name]
2. [Action] - Owner: [Name]

WIN-BACK POTENTIAL:
[Assessment of likelihood to return]
```

**Churn Pattern Analysis:**

| Analysis Type | Frequency | Purpose |
|---------------|-----------|---------|
| Individual post-mortem | Every churn | Specific learnings |
| Monthly cohort analysis | Monthly | Trend identification |
| Quarterly deep-dive | Quarterly | Strategic insights |
| Annual churn review | Annually | Program effectiveness |

## Tools & Templates

### Risk Monitoring Dashboard

**Dashboard Elements:**
- Accounts by risk level
- Risk score trends
- Intervention status tracking
- Upcoming renewals with risk
- Churn forecast
- Win-back pipeline

### Communication Templates

**Risk Outreach:**
```
Subject: Checking in - [Account Name]

Dear [Name],

I wanted to reach out personally because I have noticed
[observation, e.g., we have not connected recently /
some changes in how your team is using INT Inc.].

I want to make sure you are getting the value you expected
from our partnership. Would you have time for a quick call
this week?

I am here to help however I can.

Best regards,
[CSM Name]
```

**Executive Save Request (Internal):**
```
EXECUTIVE INTERVENTION REQUEST

Account: [Name]
ARR: $[Amount]
Risk Level: Critical
CSM: [Name]
Date: [Date]

SITUATION:
[Brief summary of the risk]

ACTIONS TAKEN:
[What has been tried]

REQUEST:
Executive outreach to [Client Contact Name/Title]

TALKING POINTS:
1. [Key point]
2. [Key point]
3. [Key point]

TIMELINE:
[Urgency and key dates]
```

## Metrics & KPIs

### Retention Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| Gross Retention Rate | Revenue retained (no expansion) | >90% |
| Net Retention Rate | Revenue retained + expansion | >110% |
| Logo Retention Rate | Customers retained | >95% |
| Churn Rate | Revenue/customers lost | <10% |

### Prevention Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| At-Risk Save Rate | % of at-risk accounts saved | >70% |
| Early Detection Rate | % of churns with prior risk flag | >90% |
| Intervention Success | % of interventions that stabilize | >60% |
| Time to Detection | Days from first signal to identification | <14 days |

### Win-Back Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| Win-Back Rate | % of churned customers who return | >10% |
| Win-Back Revenue | ARR recovered from returns | Track |
| Win-Back Timeline | Average days to return | Track |

## Common Pitfalls

### 1. Reactive Response

**Problem:** Only addressing churn after notice is given.

**Prevention:**
- Early warning system
- Regular health monitoring
- Proactive outreach triggers
- Leading indicator focus

### 2. Single-Threaded Relationships

**Problem:** Depending on one contact who leaves.

**Prevention:**
- Multi-threading strategy
- Executive relationship building
- Regular stakeholder mapping
- Succession planning discussions

### 3. Ignoring Small Signals

**Problem:** Dismissing early warning signs as noise.

**Prevention:**
- Signal aggregation
- Pattern recognition
- Trust but verify approach
- Regular account reviews

### 4. Generic Interventions

**Problem:** Same response regardless of churn reason.

**Prevention:**
- Root cause analysis
- Playbook selection based on cause
- Personalized action plans
- Continuous playbook refinement

### 5. Giving Up Too Early

**Problem:** Abandoning save efforts prematurely.

**Prevention:**
- Escalation protocol
- Executive engagement
- Multiple intervention attempts
- Creative solution exploration

### 6. Not Learning from Churn

**Problem:** Same churn reasons recurring.

**Prevention:**
- Mandatory post-mortems
- Pattern analysis
- Systemic improvements
- Cross-functional feedback

## Integration Points

### Internal Systems

- **Health Scoring Platform** - Risk signals, automated alerts
- **CRM** - Account history, activity tracking
- **Analytics** - Usage data, trend analysis
- **Support System** - Ticket history, satisfaction
- **Finance** - Payment status, contract terms

### Cross-Functional Teams

- **Product** - Feature gaps, roadmap prioritization
- **Support** - Issue escalation, service recovery
- **Finance** - Pricing flexibility, credits
- **Sales** - Competitive intelligence, win-back
- **Leadership** - Executive engagement, resources

### Prevention Ecosystem

```
Early Warning System
        ↓
Risk Assessment
        ↓
Intervention Selection
        ↓
Playbook Execution
        ↓
Outcome Tracking
        ↓
Learning & Improvement
```

---

*Last Updated: 2024*
*Owner: Customer Success Team*
*Review Cycle: Quarterly*
