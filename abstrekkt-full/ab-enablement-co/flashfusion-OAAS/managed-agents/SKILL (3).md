---
name: enablement-sprint-planning
version: 1.0.0
metadata:
  description: Plan and manage 5-week FlashFusion Enablement Sprints with milestone definition, client delivery checklist, and week-by-week task management.
  author: FlashFusion
  category: delivery
  use_when:
    - Planning an Enablement Sprint after a sold engagement
    - Building a sprint plan from audit output
    - Defining milestones and deliverables for a sprint
    - Checking sprint progress or status
    - Planning a kickoff call agenda
  trigger_phrases:
    - enablement-sprint-planning
    - plan the sprint
    - sprint plan
    - enablement sprint
    - week by week plan
    - sprint milestones
    - kickoff agenda
    - sprint status
allowed_tools:
  - read_file
  - create_file
---

# Enablement Sprint Planning Skill

## The 5-Week Structure

### Week 1: Audit and Discovery
**Deliverables:** Kickoff call notes, intake form analysis, current-state documentation, gap analysis
**Tasks:**
- Kickoff call (align on goals, stakeholders, success criteria)
- Analyze intake form and audit scorecard
- Map current tool stack and workflows
- Identify top 3 automation opportunities
- Draft audit report

**Failure mode:** Rushing past discovery. Every sprint failure traces to a bad diagnosis.

### Week 2: Skill Pack Selection and Configuration
**Deliverables:** Skill pack list with justification, configured packs, trigger documentation
**Tasks:**
- Select skill packs (each must trace to an audit gap)
- Configure for client's Claude environment
- Set trigger phrases and allowed-tools (least privilege)
- Test skill activation
- Client review of configured set

**Failure mode:** Deploying generic packs not configured for their actual workflows.

### Week 3: Pilot Deployment
**Deliverables:** Pilot group onboarded, day-1 feedback, friction log
**Tasks:**
- Deploy to pilot group (3–5 people)
- Run hands-on walkthrough (60 min)
- Collect day-1 feedback
- Troubleshoot activation issues
- Document wins and friction

**Failure mode:** Skipping pilot and going straight to full rollout.

### Week 4: Full Rollout and Training
**Deliverables:** Full team deployed, training session, skills user guide
**Tasks:**
- Deploy to full team
- Deliver skills library user guide
- Run team training session (90 min)
- Set up usage tracking
- Identify candidates for custom skill development

### Week 5: Measurement and Handoff
**Deliverables:** ROI summary, Sprint Summary Report, handoff documentation
**Tasks:**
- Collect usage data and time-savings self-reports
- Build ROI summary (actuals vs. projections)
- Deliver Sprint Summary Report
- Present next steps (retainer, follow-on, standalone)
- Confirm client has admin access and documentation

## Sprint Plan Document Structure
1. Sprint overview (client, dates, selected skill packs, goals)
2. Week-by-week task list with owners
3. Milestone dates and deliverables
4. Client responsibilities
5. Risk register (top 3 risks with mitigation)
6. Communication cadence
