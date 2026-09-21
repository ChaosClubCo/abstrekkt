---
name: sprint-planning
category: product-management
subcategory: front-of-house
description: Comprehensive sprint planning including capacity planning, velocity tracking, commitment ceremonies, and sprint goal setting. Use when preparing for development sprints, allocating team capacity, setting sprint commitments, or establishing iteration goals and boundaries.
author: IntInc Strategy Skills
tags:
  - sprint-planning
  - agile
  - scrum
  - velocity
  - capacity-planning
  - sprint-goals
  - team-commitment
  - iteration-planning
complexity: intermediate
time_horizon: sprint-based
stakeholders:
  - product-owners
  - scrum-masters
  - development-team
  - engineering-managers
  - designers
outputs:
  - sprint-backlog
  - sprint-goal
  - capacity-plan
  - commitment-record
  - sprint-forecast
metadata:
  version: "1.0.0"
---

# Sprint Planning

## Overview

Sprint planning is the collaborative ceremony that transforms a prioritized product backlog into a focused, achievable sprint commitment. This critical Scrum event establishes the sprint goal, selects backlog items for development, and creates a shared understanding of how the team will deliver value within the iteration timeframe.

Effective sprint planning balances ambition with realism, considering team capacity, technical complexity, dependencies, and organizational constraints. The session produces not just a list of work items but a coherent plan that maximizes value delivery while protecting team sustainability.

Beyond the mechanics of story selection and estimation, sprint planning serves as a team alignment ritual that reinforces shared ownership, surfaces concerns early, and builds collective confidence in the sprint commitment.

### Why This Matters

Sprint planning directly determines development productivity and predictability. Poor planning leads to incomplete sprints, team frustration, stakeholder disappointment, and eroded trust in delivery timelines. Well-executed planning creates flow, reduces context switching, and enables teams to deliver consistent value increment after increment.

## When to Use

### Primary Triggers

- Beginning of each new sprint cycle
- After significant scope or priority changes
- When onboarding new team members
- Following major technical architecture decisions
- After sprint retrospective identifies planning improvements
- When transitioning to new project phases

### Specific Use Cases

| Scenario | Planning Focus | Special Considerations |
|----------|---------------|----------------------|
| Standard Sprint | Balanced commitment | Normal capacity, known velocity |
| Post-Holiday Sprint | Reduced scope | Adjusted capacity, ramp-up time |
| Release Sprint | Stabilization | Bug fixes, polish, deployment prep |
| Discovery Sprint | Learning goals | Spikes, prototypes, research tasks |
| Hardening Sprint | Quality focus | Tech debt, test coverage, performance |
| Emergency Sprint | Crisis response | Focused scope, extended hours |

## Core Processes

### Phase 1: Pre-Planning Preparation

#### Product Owner Preparation (1-2 Days Before)

```markdown
## PO Pre-Planning Checklist

### Backlog Readiness
- [ ] Top 2 sprints worth of stories refined
- [ ] Stories prioritized by business value
- [ ] Dependencies identified and documented
- [ ] Acceptance criteria finalized
- [ ] Design assets available for top items

### Context Gathering
- [ ] Stakeholder input collected
- [ ] Market or customer urgency assessed
- [ ] Technical constraints understood
- [ ] Previous sprint learnings incorporated

### Goal Framing
- [ ] Draft sprint goal prepared
- [ ] Success metrics identified
- [ ] Value proposition articulated
- [ ] Trade-off preferences documented
```

#### Team Preparation

```markdown
## Team Pre-Planning Activities

### Capacity Assessment
- Identify planned time off
- Account for recurring meetings
- Note training or conference commitments
- Flag known support rotations

### Technical Readiness
- Review outstanding pull requests
- Identify incomplete stories from last sprint
- Note environment or tooling issues
- Prepare questions about upcoming work
```

### Phase 2: Capacity Planning

#### Capacity Calculation Framework

```markdown
## Team Capacity Formula

### Individual Capacity
Hours = (Working Days - PTO Days) x Hours/Day x Focus Factor

### Focus Factor Guidelines
- Senior Developer: 0.7-0.8 (meetings, mentoring)
- Mid-Level Developer: 0.75-0.85
- Junior Developer: 0.6-0.7 (learning overhead)
- Tech Lead: 0.5-0.6 (leadership duties)

### Example Calculation
Sprint Days: 10 working days
Developer A: (10 - 1 PTO) x 8 hours x 0.75 = 54 hours
Developer B: (10 - 0 PTO) x 8 hours x 0.80 = 64 hours
Developer C: (10 - 2 PTO) x 8 hours x 0.70 = 44.8 hours

Team Capacity: 162.8 hours available
```

#### Capacity Adjustment Factors

| Factor | Adjustment | Rationale |
|--------|------------|-----------|
| New Team Member | -20% team | Onboarding and pairing overhead |
| Major Holiday Week | -30% team | Focus and momentum disruption |
| Production Incident History | -10% buffer | Unplanned support likelihood |
| New Technology | -15% per story | Learning curve |
| External Dependencies | -10% buffer | Coordination delays |
| End of Quarter | -20% team | Meetings and reporting |

### Phase 3: Sprint Goal Definition

#### Goal Setting Framework

```markdown
## Sprint Goal Criteria

### Structure
"This sprint, we will [achieve outcome] so that [benefit/value]"

### Quality Attributes
- Specific: Clear, unambiguous objective
- Measurable: Success can be evaluated
- Achievable: Within team capability
- Relevant: Aligned to product/company goals
- Time-bound: Completable within sprint

### Examples

#### Weak Goals
- "Make progress on the dashboard"
- "Fix bugs and add features"
- "Complete assigned stories"

#### Strong Goals
- "Enable users to self-serve password resets, reducing support tickets by 30%"
- "Launch MVP checkout flow supporting credit card payments under $500"
- "Achieve 95% test coverage on payment module to enable confident refactoring"
```

#### Goal Validation Questions

```markdown
## Sprint Goal Checklist

### Value Validation
- [ ] Does this goal deliver tangible user or business value?
- [ ] Can stakeholders understand why this matters?
- [ ] Does it advance our product strategy?

### Feasibility Validation
- [ ] Can we reasonably achieve this in one sprint?
- [ ] Do we have the skills and knowledge needed?
- [ ] Are dependencies manageable?

### Coherence Validation
- [ ] Do selected stories clearly support this goal?
- [ ] Is there a logical connection between items?
- [ ] Could we explain this sprint to an outsider?
```

### Phase 4: Story Selection Process

#### Selection Workshop Structure

```markdown
## Sprint Planning Meeting Agenda

### Duration: 2-4 hours (for 2-week sprint)

### Part 1: Context Setting (30 min)
1. Review previous sprint results (10 min)
2. Present sprint goal proposal (10 min)
3. Share capacity calculation (10 min)

### Part 2: Story Walk-Through (60-90 min)
1. PO presents top priority stories
2. Team asks clarifying questions
3. Discuss technical approach
4. Identify risks and dependencies
5. Refine acceptance criteria if needed

### Part 3: Commitment Building (30-45 min)
1. Team estimates or re-estimates stories
2. Match stories to capacity
3. Identify stretch goals vs. commitments
4. Confirm sprint goal achievability

### Part 4: Task Breakdown (30-45 min)
1. Break stories into tasks
2. Identify task owners (optional)
3. Sequence dependent work
4. Create sprint board

### Part 5: Confirmation (15 min)
1. Team verbally commits to sprint
2. PO accepts sprint scope
3. Document decisions and assumptions
4. Schedule sprint events
```

#### Velocity-Based Selection

```markdown
## Velocity Reference Guide

### Calculating Velocity
Velocity = Sum of story points completed in sprint

### Using Historical Velocity
- Use average of last 3 sprints
- Weight recent sprints more heavily
- Adjust for known capacity changes

### Example
Sprint N-3: 34 points
Sprint N-2: 38 points
Sprint N-1: 42 points
Average: 38 points
Adjusted (0.9 factor for holiday): 34 points target

### Velocity Ranges
- Commitment: 80% of average velocity
- Target: 100% of average velocity
- Stretch: 120% of average velocity
```

### Phase 5: Risk and Dependency Management

#### Dependency Mapping

```markdown
## Dependency Categories

### Internal Dependencies
- Story A must complete before Story B starts
- Shared component needed by multiple stories
- Design approval required before development

### External Dependencies
- API from another team
- Third-party service availability
- Stakeholder review or approval
- Vendor delivery or setup

### Dependency Documentation
| Story | Depends On | Owner | Status | Risk Level |
|-------|------------|-------|--------|------------|
| US-42 | API-15 from Team B | @mike | In Progress | Medium |
| US-43 | Design Review | @sarah | Blocked | High |
| US-44 | None | - | Ready | Low |
```

#### Risk Assessment

```markdown
## Sprint Risk Register

### Risk Categories
1. Technical: Unknown complexity, new technology
2. Resource: Capacity, skills availability
3. External: Dependencies, third parties
4. Scope: Requirements clarity, change likelihood

### Risk Matrix
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API delay | Medium | High | Start with mock; parallel track |
| Designer PTO | High | Medium | Front-load design reviews |
| Performance unknown | Low | High | Spike in first 2 days |

### Contingency Planning
- Identify which stories to drop if risks materialize
- Prepare alternative approaches for high-risk items
- Establish daily check-in on risk status
```

## Tools & Templates

### Sprint Planning Canvas

```markdown
## Sprint Planning Canvas

+--------------------------------------------------+
|                  SPRINT GOAL                      |
|  [Single sentence describing sprint outcome]     |
+--------------------------------------------------+

+------------------+------------------+
|     CAPACITY     |    VELOCITY      |
|   X hours/       |   Y points       |
|   Z story points |   (avg last 3)   |
+------------------+------------------+

+--------------------------------------------------+
|              COMMITTED STORIES                    |
| ID   | Title        | Points | Owner | Status   |
|------|--------------|--------|-------|----------|
|      |              |        |       |          |
+--------------------------------------------------+

+--------------------------------------------------+
|              STRETCH GOALS                        |
| ID   | Title        | Points | Dependencies      |
|------|--------------|--------|-------------------|
|      |              |        |                   |
+--------------------------------------------------+

+--------------------------------------------------+
|           RISKS & DEPENDENCIES                   |
| Risk/Dep | Owner | Mitigation | Status          |
|----------|-------|------------|-----------------|
|          |       |            |                 |
+--------------------------------------------------+

+--------------------------------------------------+
|              ASSUMPTIONS                         |
| - [Key assumption 1]                             |
| - [Key assumption 2]                             |
+--------------------------------------------------+
```

### Capacity Planning Spreadsheet

```markdown
## Team Capacity Calculator

| Team Member | Role | Sprint Days | PTO | Focus % | Capacity (hrs) |
|-------------|------|-------------|-----|---------|----------------|
| Alice | Senior Dev | 10 | 0 | 75% | 60 |
| Bob | Mid Dev | 10 | 1 | 80% | 57.6 |
| Carol | Junior Dev | 10 | 0 | 65% | 52 |
| Dave | Tech Lead | 10 | 0 | 50% | 40 |
| Eve | QA | 10 | 2 | 70% | 44.8 |
| **Total** | | | | | **254.4** |

### Capacity to Points Conversion
Historical: 1 story point = ~6 hours
This sprint capacity: 254.4 / 6 = 42 points maximum
Recommended commitment: 42 x 0.85 = 36 points
```

## Metrics & KPIs

### Sprint Planning Effectiveness

```markdown
## Leading Indicators
- Planning meeting duration vs. target (efficiency)
- Story readiness score entering planning
- Capacity calculation accuracy
- Dependency identification rate

## Lagging Indicators
- Sprint goal achievement rate (target: >80%)
- Commitment completion rate (target: >85%)
- Velocity variance (target: <15%)
- Carryover rate (target: <15%)
```

### Sprint Health Metrics

| Metric | Calculation | Healthy Range | Action Trigger |
|--------|-------------|---------------|----------------|
| Velocity Trend | 3-sprint moving average | Stable or up | 2+ sprints declining |
| Commitment Ratio | Completed / Committed | 0.85-1.0 | <0.7 or >1.2 |
| Carryover % | Carried / Committed | <15% | >25% |
| Goal Achievement | Binary per sprint | >80% of sprints | <60% |
| Scope Change | Stories added mid-sprint | <10% | >20% |

### Velocity Tracking Dashboard

```markdown
## Velocity Chart Data

Sprint | Committed | Completed | Carryover | Goal Met
-------|-----------|-----------|-----------|----------
S-6    | 40        | 38        | 2         | Yes
S-5    | 38        | 42        | 0         | Yes
S-4    | 45        | 35        | 10        | No
S-3    | 38        | 40        | 0         | Yes
S-2    | 42        | 38        | 4         | Yes
S-1    | 40        | 36        | 4         | No

### Insights
- Average velocity: 38.2 points
- Commitment accuracy: 91%
- Goal achievement: 67%
- Trend: Stable velocity, improving consistency
```

## Common Pitfalls

### Planning Anti-Patterns

1. **Overcommitment Bias**
   - Symptom: Consistently missing sprint goals
   - Cause: Optimism bias, pressure from stakeholders
   - *Mitigation*: Use velocity data, add buffer, track accuracy

2. **Velocity Fixation**
   - Symptom: Chasing points over value delivery
   - Cause: Using velocity as performance metric
   - *Mitigation*: Focus on goal achievement, not point totals

3. **Insufficient Refinement**
   - Symptom: Long planning meetings, confused team
   - Cause: Unprepared backlog, unclear requirements
   - *Mitigation*: Enforce refinement sessions, readiness criteria

4. **Ignoring Capacity Variations**
   - Symptom: Erratic sprint performance
   - Cause: Not adjusting for PTO, holidays, support duties
   - *Mitigation*: Calculate capacity each sprint, document factors

5. **Silent Disagreement**
   - Symptom: Team doesn't commit confidently
   - Cause: Concerns not raised, psychological safety issues
   - *Mitigation*: Explicit commitment ritual, fist-of-five voting

6. **Goal Ambiguity**
   - Symptom: Sprint feels unfocused, stories don't connect
   - Cause: Weak or missing sprint goal
   - *Mitigation*: Require goal before story selection, validate coherence

7. **Dependency Blindness**
   - Symptom: Blocked work mid-sprint
   - Cause: Dependencies not identified in planning
   - *Mitigation*: Explicit dependency review, external team check-ins

### Warning Signs During Sprint

- Multiple stories blocked by dependencies
- Significant scope added after planning
- Team members unclear on sprint goal
- Daily standup reveals misalignment
- Stories stuck in "in progress" for days

## Integration Points

### Connected Skills

| Skill | Integration Type | Touchpoints |
|-------|-----------------|-------------|
| User Story Writing | Input | Stories must be ready for planning |
| Product Feedback | Input | Feedback informs priority |
| Product Metrics | Validation | Metrics validate sprint success |
| Design Thinking | Input | Discovery work shapes backlog |
| Research Methods | Input | Research findings drive stories |

### Ceremony Connections

```markdown
## Sprint Ceremony Ecosystem

### Pre-Sprint
- Backlog Refinement → Ready stories for planning
- Stakeholder Review → Priority input

### Sprint Planning
- Receives: Refined backlog, capacity data
- Produces: Sprint backlog, sprint goal

### During Sprint
- Daily Standup → Progress tracking
- Story Reviews → Continuous validation

### Post-Sprint
- Sprint Review → Demonstrate increment
- Retrospective → Improve planning process
```

### Stakeholder Communication

```markdown
## Sprint Planning Outputs

### For Development Team
- Sprint backlog with task breakdown
- Dependency map and risk register
- Definition of done reminder
- Team agreements for the sprint

### For Product Owner
- Sprint goal confirmation
- Committed vs. stretch scope
- Risk acknowledgment
- Decision documentation

### For Stakeholders
- Sprint goal statement
- Key deliverables expected
- Timeline and milestone dates
- Known risks and mitigations

### For Leadership
- Velocity trends
- Capacity utilization
- Strategic alignment of sprint work
- Resource or support needs
```
