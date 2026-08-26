---
name: technical-discovery
description: Comprehensive technical discovery methodology for requirements gathering, stakeholder interviews, system analysis, and solution scoping. Covers discovery frameworks, interview techniques, and requirements documentation. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Technical Discovery

## Overview

Technical discovery is the critical first phase of any solution engagement that establishes the foundation for successful project delivery. This skill covers comprehensive methodologies for understanding client needs, documenting requirements, assessing technical constraints, and defining solution scope.

Effective technical discovery goes beyond basic requirements gathering. It involves understanding the business context driving technical decisions, identifying unstated assumptions, uncovering hidden constraints, and building relationships with key stakeholders who will determine project success.

This skill provides frameworks for conducting structured discovery sessions, documenting findings in actionable formats, and translating business requirements into technical specifications. The focus is on thorough, efficient discovery that de-risks project delivery while building client confidence.

### Why This Matters

- **Project success**: 68% of project failures trace back to poor requirements definition
- **Scope accuracy**: Thorough discovery reduces scope creep and change orders by 40%
- **Client confidence**: Structured discovery demonstrates expertise and builds trust
- **Team efficiency**: Clear requirements enable accurate estimation and planning
- **Risk mitigation**: Early identification of constraints prevents late-stage surprises

## When to Use

### Primary Triggers

- "We need to understand the client's requirements"
- "Conduct a discovery session"
- "Scope this new project"
- "What questions should we ask?"
- "Document the requirements"
- "Assess their current system"
- "Identify technical constraints"

### Specific Use Cases

1. **New Client Engagement**: Initial discovery for prospective clients
2. **Project Kickoff**: Detailed requirements gathering for approved projects
3. **System Assessment**: Evaluation of existing systems for migration/upgrade
4. **RFP Response**: Discovery to inform proposal development
5. **Integration Planning**: Understanding systems that need to connect
6. **Feature Expansion**: Scoping additions to existing implementations

## Core Processes

### Process 1: Discovery Planning and Preparation

**Objective**: Prepare for effective discovery sessions with clear objectives and structure.

**Discovery Plan Template**:

```markdown
# Discovery Plan: [Project/Client Name]

## Executive Summary
- **Client**: [Company name]
- **Opportunity**: [Brief description of what they want to achieve]
- **Discovery Duration**: [Estimated time - typically 1-4 weeks]
- **Discovery Lead**: [Name]

## Discovery Objectives
1. Understand current state of [system/process]
2. Document requirements for [new solution]
3. Identify integration points with [existing systems]
4. Assess technical constraints and risks
5. Define success criteria and KPIs

## Stakeholder Map
| Name | Role | Interest Level | Influence | Interview Priority |
|------|------|---------------|-----------|-------------------|
| [Name] | [Title] | High/Med/Low | High/Med/Low | 1-5 |

## Discovery Sessions Schedule
| Session | Participants | Duration | Topics | Date |
|---------|-------------|----------|--------|------|
| Kickoff | All stakeholders | 90 min | Objectives, timeline, process | TBD |
| Business Requirements | Product owner, SMEs | 2 hours | Use cases, workflows | TBD |
| Technical Deep-dive | IT team, architects | 3 hours | Systems, integrations | TBD |
| User Research | End users (3-5) | 1 hour each | Pain points, workflows | TBD |
| Data Workshop | Data team, business | 2 hours | Data sources, requirements | TBD |
| Wrap-up | All stakeholders | 60 min | Findings, next steps | TBD |

## Information Requests (Pre-Discovery)
- [ ] Organization chart
- [ ] Existing system documentation
- [ ] Process flow diagrams
- [ ] Sample data exports
- [ ] Integration specifications
- [ ] Previous project documentation
- [ ] Current vendor contracts
- [ ] Security/compliance requirements

## Success Criteria for Discovery
- Complete stakeholder interviews (minimum 80% scheduled)
- Document all core requirements with acceptance criteria
- Identify and assess all integration points
- Quantify data volumes and performance requirements
- Produce discovery summary with recommendations
```

**Pre-Discovery Research Checklist**:

```markdown
## Client Research Checklist

### Business Context
- [ ] Company website and about page
- [ ] Recent press releases and news
- [ ] LinkedIn company page and employee profiles
- [ ] Industry analyst reports
- [ ] Competitor landscape
- [ ] Annual report (if public)

### Technical Context
- [ ] Job postings (technology indicators)
- [ ] Technology stack (BuiltWith, Wappalyzer)
- [ ] GitHub/public repositories
- [ ] Technology blog posts
- [ ] Conference presentations
- [ ] Integration marketplace listings

### Existing Relationship
- [ ] Previous proposals or conversations
- [ ] CRM notes and history
- [ ] Past project documentation
- [ ] Support ticket history
- [ ] Account team input
```

### Process 2: Stakeholder Interview Framework

**Objective**: Conduct structured interviews that uncover complete requirements.

**Interview Question Framework by Role**:

```markdown
# Interview Question Bank

## Executive Sponsor
**Duration**: 45-60 minutes

### Strategic Context
1. What business problem is this project solving?
2. How does this initiative align with company strategy?
3. What happens if this project doesn't happen?
4. What does success look like in 6 months? 12 months?
5. How will you measure ROI?

### Constraints and Priorities
6. What is your timeline expectation?
7. What budget parameters should we work within?
8. What are the non-negotiable requirements?
9. What would you be willing to sacrifice if needed?
10. Who are the key decision makers?

### Risk Awareness
11. What keeps you up at night about this project?
12. Have similar initiatives failed before? Why?
13. What organizational changes might affect this project?
14. Are there political considerations we should be aware of?

---

## Product Owner / Business Lead
**Duration**: 90-120 minutes

### Current State
1. Walk me through the current process/system
2. What works well today?
3. What are the biggest pain points?
4. How much time/money does the current process cost?
5. Who are the users? How many? Where located?

### Requirements Deep-Dive
6. What are the must-have capabilities?
7. What would be nice to have?
8. Are there features you've seen elsewhere you want?
9. What reports or outputs are needed?
10. What are the workflow stages?

### Edge Cases
11. What happens when things go wrong today?
12. Are there seasonal or peak usage patterns?
13. What exceptions or special cases exist?
14. How do you handle [specific scenario]?

### Success Criteria
15. How will users know this is successful?
16. What metrics will improve?
17. What training will users need?
18. How will you handle the transition?

---

## Technical Lead / IT
**Duration**: 2-3 hours

### Current Architecture
1. Describe the current technical environment
2. What systems need to integrate?
3. What is the data architecture?
4. What security requirements exist?
5. What compliance frameworks apply?

### Technical Requirements
6. Performance requirements (users, transactions, latency)?
7. Availability requirements (uptime, DR)?
8. Scalability expectations?
9. Authentication/authorization requirements?
10. Data retention and archival needs?

### Constraints
11. Technology standards or preferences?
12. Hosting requirements (cloud, on-prem, hybrid)?
13. Network or firewall considerations?
14. Existing vendor relationships?
15. Internal development capacity?

### Integration Details
16. API availability for existing systems?
17. Data formats and protocols?
18. Real-time vs batch requirements?
19. Error handling expectations?
20. Monitoring and alerting needs?

---

## End Users (3-5 individual interviews)
**Duration**: 30-45 minutes each

### Daily Work
1. Describe a typical day in your role
2. What systems do you use most?
3. What tasks take the most time?
4. What do you find frustrating?

### Specific Processes
5. Walk me through how you [specific task]
6. What information do you need to do your job?
7. How do you handle [specific scenario]?
8. What workarounds have you developed?

### Ideal State
9. If you had a magic wand, what would you change?
10. What would make your job easier?
11. What have you seen elsewhere that you liked?
```

**Interview Conduct Guidelines**:

```markdown
## Interview Best Practices

### Before the Interview
- Review stakeholder background (LinkedIn, org chart)
- Prepare role-specific questions
- Set up recording (with permission)
- Have discovery artifacts ready to reference

### During the Interview
- Start with rapport building (2-3 minutes)
- Explain discovery purpose and how input will be used
- Ask permission to record
- Take structured notes (requirements, constraints, risks)
- Listen more than talk (80/20 rule)
- Ask "why" frequently (5 Whys technique)
- Probe for specific examples
- Watch for body language on sensitive topics
- Save time for their questions

### Question Techniques
- Open-ended: "Tell me about..."
- Probing: "Can you give me an example?"
- Clarifying: "When you say X, do you mean..."
- Hypothetical: "What if [scenario] happened?"
- Ranking: "Which is more important: A or B?"

### After the Interview
- Send thank you email within 24 hours
- Transcribe key points same day
- Flag items needing follow-up
- Update stakeholder map with insights
```

### Process 3: Requirements Documentation

**Objective**: Document requirements in clear, actionable formats.

**Requirements Document Template**:

```markdown
# Requirements Specification
## [Project Name]

### Document Control
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | [Date] | [Name] | Initial draft |

---

## 1. Executive Summary
[2-3 paragraphs summarizing the project, key requirements, and recommendations]

## 2. Business Context

### 2.1 Problem Statement
[Clear statement of the problem being solved]

### 2.2 Business Objectives
1. [Objective 1 - measurable]
2. [Objective 2 - measurable]
3. [Objective 3 - measurable]

### 2.3 Success Criteria
| Criterion | Current State | Target State | Measurement |
|-----------|---------------|--------------|-------------|
| [Metric 1] | [Value] | [Value] | [How measured] |

### 2.4 Stakeholders
| Stakeholder | Role | Interest | Concerns |
|-------------|------|----------|----------|
| [Name] | Sponsor | Budget, ROI | Timeline |

---

## 3. Functional Requirements

### 3.1 User Stories

#### Epic: [Epic Name]

**US-001: [User Story Title]**
- **As a** [user role]
- **I want** [capability]
- **So that** [business value]

**Acceptance Criteria:**
- [ ] Given [context], when [action], then [result]
- [ ] Given [context], when [action], then [result]

**Priority:** Must Have / Should Have / Could Have / Won't Have
**Estimated Effort:** S / M / L / XL
**Dependencies:** [List any dependencies]

---

### 3.2 Use Cases

#### UC-001: [Use Case Name]

**Primary Actor:** [Role]
**Preconditions:** [What must be true before this use case]
**Trigger:** [What initiates this use case]

**Main Flow:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Alternative Flows:**
- 2a. If [condition]: [alternative steps]

**Postconditions:** [State after successful completion]
**Business Rules:** [Rules that apply]

---

## 4. Non-Functional Requirements

### 4.1 Performance
| Requirement | Specification |
|-------------|---------------|
| Response time | < 2 seconds for 95th percentile |
| Throughput | 1000 transactions per minute |
| Concurrent users | 500 simultaneous |

### 4.2 Availability
- Uptime: 99.9% (8.76 hours downtime/year)
- Maintenance window: Sundays 2-4 AM EST
- RTO: 4 hours
- RPO: 1 hour

### 4.3 Security
- Authentication: SSO via Okta
- Authorization: Role-based access control
- Data encryption: AES-256 at rest, TLS 1.3 in transit
- Compliance: SOC 2 Type II, GDPR

### 4.4 Scalability
- User growth: 50% annually for 3 years
- Data growth: 100GB per year
- Geographic expansion: NA now, EU in year 2

---

## 5. Technical Requirements

### 5.1 Integration Requirements
| System | Direction | Method | Frequency | Data |
|--------|-----------|--------|-----------|------|
| [System] | Inbound | REST API | Real-time | [Data type] |

### 5.2 Data Requirements
- Data migration: [Volume, complexity]
- Data retention: [Duration, archival rules]
- Data quality: [Validation requirements]

### 5.3 Infrastructure
- Hosting: [Cloud/On-prem/Hybrid]
- Regions: [Geographic requirements]
- Environments: [Dev, QA, Staging, Prod]

---

## 6. Constraints and Assumptions

### 6.1 Constraints
1. [Technical constraint]
2. [Business constraint]
3. [Timeline constraint]

### 6.2 Assumptions
1. [Assumption 1]
2. [Assumption 2]

### 6.3 Dependencies
1. [External dependency]
2. [Internal dependency]

---

## 7. Risks and Mitigations
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Strategy] |

---

## 8. Appendices
- A: Interview Notes
- B: Current State Documentation
- C: Data Dictionary
- D: Process Flow Diagrams
```

### Process 4: Current State Assessment

**Objective**: Thoroughly document and assess existing systems and processes.

**System Assessment Framework**:

```markdown
# Current State Assessment

## System Inventory

### System: [System Name]
| Attribute | Value |
|-----------|-------|
| **Purpose** | [Primary function] |
| **Vendor** | [Vendor name] |
| **Version** | [Current version] |
| **Age** | [Years in production] |
| **Users** | [Number and types] |
| **Owner** | [Business/IT owner] |
| **Support** | [Internal/Vendor/None] |

### Technical Details
- **Technology Stack**: [Languages, frameworks, database]
- **Hosting**: [Where hosted, infrastructure]
- **Architecture**: [Monolith, microservices, etc.]
- **APIs**: [Available APIs, documentation quality]

### Data Assessment
| Data Element | Volume | Quality | Sensitivity |
|--------------|--------|---------|-------------|
| [Data type] | [Size/count] | High/Med/Low | PII/Confidential/Public |

### Integration Map
```
[System A] --REST API--> [Current System] --Batch ETL--> [System B]
                              |
                              +--SFTP--> [System C]
```

### Health Assessment
| Dimension | Score (1-5) | Notes |
|-----------|-------------|-------|
| Performance | [Score] | [Notes] |
| Reliability | [Score] | [Notes] |
| Maintainability | [Score] | [Notes] |
| Security | [Score] | [Notes] |
| Scalability | [Score] | [Notes] |
| User Satisfaction | [Score] | [Notes] |

### Pain Points
1. [Pain point with impact]
2. [Pain point with impact]

### Strengths to Preserve
1. [Strength to maintain]
2. [Strength to maintain]

### Technical Debt
1. [Debt item with remediation cost]
2. [Debt item with remediation cost]
```

### Process 5: Discovery Synthesis and Recommendations

**Objective**: Synthesize findings into actionable recommendations.

**Discovery Summary Template**:

```markdown
# Discovery Summary Report
## [Client Name] - [Project Name]

### Executive Summary
[1-page summary of key findings and recommendations]

---

## 1. Discovery Overview
- **Duration**: [Start] to [End]
- **Sessions Conducted**: [Number]
- **Stakeholders Interviewed**: [Number]
- **Documents Reviewed**: [Number]

## 2. Key Findings

### Business Findings
1. **[Finding Title]**: [Description and supporting evidence]
2. **[Finding Title]**: [Description and supporting evidence]

### Technical Findings
1. **[Finding Title]**: [Description and supporting evidence]
2. **[Finding Title]**: [Description and supporting evidence]

### Risk Findings
1. **[Risk]**: [Description and potential impact]
2. **[Risk]**: [Description and potential impact]

## 3. Requirements Summary

### Must Have (P0)
| ID | Requirement | Rationale |
|----|-------------|-----------|
| R001 | [Requirement] | [Why critical] |

### Should Have (P1)
| ID | Requirement | Rationale |
|----|-------------|-----------|
| R010 | [Requirement] | [Why important] |

### Could Have (P2)
| ID | Requirement | Rationale |
|----|-------------|-----------|
| R020 | [Requirement] | [Why nice to have] |

## 4. Recommended Solution Approach

### Option A: [Approach Name]
- **Description**: [Brief description]
- **Pros**: [Benefits]
- **Cons**: [Drawbacks]
- **Estimated Effort**: [T-shirt size or range]
- **Risk Level**: Low/Medium/High

### Option B: [Approach Name]
[Same structure as above]

### Recommendation
[Clear recommendation with rationale]

## 5. Next Steps
1. [Immediate action] - [Owner] - [Date]
2. [Short-term action] - [Owner] - [Date]
3. [Medium-term action] - [Owner] - [Date]

## 6. Appendices
[Reference to detailed documentation]
```

## Tools & Templates

| Tool | Purpose | When to Use |
|------|---------|-------------|
| Interview Guide | Stakeholder interviews | Every interview |
| Requirements Doc | Formal requirements | All projects |
| System Assessment | Current state analysis | Migration/integration |
| Discovery Summary | Executive communication | Discovery close |
| RACI Matrix | Responsibility clarity | Complex stakeholder environments |

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Stakeholder Coverage | 100% key stakeholders | Interviews conducted |
| Requirement Completeness | < 10% change post-discovery | Requirements changes |
| Discovery Duration | 1-4 weeks | Actual vs planned |
| Client Satisfaction | > 4/5 | Discovery feedback |
| Estimate Accuracy | +/- 20% | Actual vs estimated |

## Common Pitfalls

1. **Insufficient Preparation**: Research client before discovery sessions.
2. **Missing Stakeholders**: Ensure all perspectives are captured.
3. **Leading Questions**: Let stakeholders tell their story.
4. **Assumption Documentation**: Capture and validate all assumptions.
5. **Scope Creep in Discovery**: Stay focused on discovery objectives.

## Integration Points

- **Sales**: Discovery informs proposal development
- **Project Management**: Requirements drive planning
- **Architecture**: Technical findings guide design
- **Delivery**: Discovery de-risks implementation
- **Client Success**: Requirements become success criteria
