---
name: poc-development
description: Comprehensive proof of concept development expertise covering POC planning, rapid prototyping, validation strategies, and stakeholder demonstration for de-risking technical solutions. Use when building, debugging, or optimizing technical implementations.
---

# POC Development

## Overview

Proof of Concept (POC) development validates technical feasibility and reduces project risk before full implementation investment. This skill covers the complete POC lifecycle from scoping and planning through execution, evaluation, and stakeholder presentation.

Effective POC development focuses on answering specific technical questions with minimal investment. It involves identifying the right questions to answer, building just enough to validate assumptions, and presenting findings in ways that drive confident decision-making.

This skill provides frameworks for planning focused POCs, executing rapid prototyping sprints, measuring success objectively, and communicating results to technical and business stakeholders. The goal is de-risking major technical decisions efficiently.

### Why This Matters

- **Risk reduction**: Validate assumptions before committing major resources
- **Cost efficiency**: Fail fast and cheap rather than late and expensive
- **Stakeholder confidence**: Demonstrate feasibility to build buy-in
- **Technical validation**: Prove integration patterns and performance characteristics
- **Learning acceleration**: Gain hands-on experience with new technologies

## When to Use

### Primary Triggers

- "Can this technology work for our use case?"
- "Build a proof of concept"
- "Validate this integration approach"
- "We need to prove this is feasible"
- "Show that this will work"
- "Test the new technology"
- "Prototype this feature"

### Specific Use Cases

1. **Technology Evaluation**: Validating new tools, frameworks, or platforms
2. **Integration Validation**: Proving integration patterns work as expected
3. **Performance Testing**: Verifying system meets performance requirements
4. **Concept Demonstration**: Showing stakeholders a working example
5. **Migration Feasibility**: Validating migration approaches
6. **API Compatibility**: Testing third-party API capabilities

## Core Processes

### Process 1: POC Planning and Scoping

**Objective**: Define focused POC scope with clear success criteria.

**POC Charter Template**:

```markdown
# POC Charter: [POC Name]

## Executive Summary
**Objective**: [One-sentence description of what we're proving]
**Duration**: [1-4 weeks typical]
**Team**: [Who's involved]
**Investment**: [Effort estimate]

---

## 1. Problem Statement

### Business Context
[Why is this POC needed? What decision does it inform?]

### Technical Questions to Answer
1. [Primary question we need to answer]
2. [Secondary question]
3. [Secondary question]

### What This POC Is NOT
- Not a production-ready implementation
- Not a complete feature set
- Not a performance benchmark (unless that's the objective)
- Not an evaluation of [out of scope items]

---

## 2. Hypothesis

### Primary Hypothesis
"We believe that [technology/approach] can [achieve objective] for [use case]."

### Sub-Hypotheses
1. [Technology X] can integrate with [System Y] via [method]
2. [Approach A] can achieve [performance target]
3. [Pattern B] is suitable for [requirement]

---

## 3. Scope Definition

### In Scope
| Feature/Capability | Priority | Notes |
|-------------------|----------|-------|
| [Capability 1] | Must Have | [Notes] |
| [Capability 2] | Must Have | [Notes] |
| [Capability 3] | Nice to Have | [Notes] |

### Explicitly Out of Scope
- Production error handling
- Full security implementation
- Complete UI/UX
- Performance optimization
- Documentation

### Success Criteria
| Criterion | Target | Measurement |
|-----------|--------|-------------|
| [Criterion 1] | [Specific target] | [How measured] |
| [Criterion 2] | [Specific target] | [How measured] |
| [Criterion 3] | [Specific target] | [How measured] |

### Go/No-Go Decision Criteria
- **GO**: [Conditions that validate proceeding]
- **NO-GO**: [Conditions that invalidate the approach]
- **PIVOT**: [Conditions suggesting alternative approach]

---

## 4. Technical Approach

### Architecture Overview
[Simple diagram of POC architecture]

### Technology Stack
| Component | Technology | Rationale |
|-----------|------------|-----------|
| [Component] | [Technology] | [Why for POC] |

### Key Technical Decisions
1. [Decision and rationale]
2. [Decision and rationale]

### Data Requirements
- Sample data source: [Where data comes from]
- Data volume: [Size for POC]
- Sensitive data: [Handling approach]

---

## 5. Plan and Timeline

### Phases
| Phase | Duration | Activities | Deliverables |
|-------|----------|------------|--------------|
| Setup | 2 days | Environment, dependencies | Working dev environment |
| Core Build | 5 days | Primary functionality | Working prototype |
| Integration | 2 days | External system integration | Connected system |
| Validation | 2 days | Testing, measurement | Test results |
| Presentation | 1 day | Demo prep, documentation | Final presentation |

### Milestones
- Day 3: Environment ready, basic scaffold
- Day 7: Core functionality working
- Day 10: Integration complete
- Day 12: Validation complete, demo ready

### Risk Mitigation
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API access delayed | Medium | High | Request access immediately |
| Technology learning curve | Medium | Medium | Allocate time for learning |

---

## 6. Resources

### Team
| Role | Person | Allocation |
|------|--------|------------|
| POC Lead | [Name] | 80% |
| Developer | [Name] | 100% |

### External Dependencies
- [Dependency 1] - Owner, timeline
- [Dependency 2] - Owner, timeline

### Budget
- [Any costs: licenses, infrastructure, etc.]

---

## 7. Stakeholders

| Stakeholder | Role | Involvement |
|-------------|------|-------------|
| [Name] | Decision Maker | Final go/no-go |
| [Name] | Technical Sponsor | Architecture guidance |
| [Name] | Business Sponsor | Requirements validation |

---

## 8. Deliverables

1. Working POC demonstrating [key capability]
2. Technical findings document
3. Recommendation report (Go/No-Go/Pivot)
4. Demo presentation
5. (Optional) Performance measurements
```

### Process 2: Rapid Prototyping Execution

**Objective**: Execute focused prototyping sprints efficiently.

**Daily POC Execution Framework**:

```markdown
# POC Execution Playbook

## Day 1: Foundation

### Morning
- [ ] Confirm POC charter with stakeholders
- [ ] Set up development environment
- [ ] Install required dependencies
- [ ] Create repository with basic structure

### Afternoon
- [ ] Scaffold application structure
- [ ] Implement basic "hello world" for core technology
- [ ] Verify all team members can run locally
- [ ] Document setup instructions

### End of Day Checkpoint
- [ ] Environment working for all team members
- [ ] Basic application runs
- [ ] No blocking issues identified

---

## Day 2-3: Core Functionality

### Focus
- Implement primary capability being validated
- Ignore edge cases and error handling
- Use hardcoded values where appropriate
- Get happy path working

### Daily Activities
- Morning standup (15 min): Progress, blockers, plan
- Development sprints (2-hour blocks)
- Quick demos to team every 4 hours
- End of day: Working increment

### Anti-Patterns to Avoid
- Don't build for production
- Don't optimize prematurely
- Don't implement full error handling
- Don't perfect the UI
- Don't write comprehensive tests

### Code Standards for POC
```typescript
// POC Coding Guidelines

// 1. Use clear, simple code over clever code
async function fetchData() {
  // Hardcoded URL is fine for POC
  const response = await fetch('https://api.example.com/data');
  return response.json();
}

// 2. Console logging is acceptable
console.log('Processing order:', orderId);

// 3. Minimal error handling
try {
  await processPayment(order);
} catch (error) {
  console.error('Payment failed:', error);
  // In POC, we might just log and continue
}

// 4. Mark technical debt explicitly
// TODO: POC - hardcoded credentials, replace for production
const apiKey = 'sk_test_xxx';

// 5. Quick configuration over elaborate config systems
const CONFIG = {
  API_URL: 'https://api.example.com',
  TIMEOUT: 5000,
};
```

---

## Day 4-5: Integration

### Focus
- Connect to external systems
- Validate data flows
- Test end-to-end scenarios

### Integration Checklist
- [ ] API connectivity verified
- [ ] Authentication working
- [ ] Sample data flowing
- [ ] Basic round-trip demonstrated
- [ ] Error cases identified (but not handled)

### Documentation During Integration
```markdown
## Integration Notes

### [System Name] Integration

**Status**: Working / Partial / Blocked

**Connection Details**:
- Endpoint: [URL]
- Auth: [Method]
- Rate Limits: [If discovered]

**Sample Request**:
```json
{
  "example": "request"
}
```

**Sample Response**:
```json
{
  "example": "response"
}
```

**Gotchas Discovered**:
1. [Issue 1 and workaround]
2. [Issue 2 and workaround]

**Production Considerations**:
1. [What needs to change for production]
```

---

## Day 6-7: Validation and Measurement

### Validation Activities
- [ ] Test all success criteria
- [ ] Document actual vs expected results
- [ ] Capture screenshots/recordings
- [ ] Note any limitations discovered
- [ ] Identify production requirements

### Measurement Template
```markdown
## POC Validation Results

### Success Criterion 1: [Criterion]
- **Target**: [Expected result]
- **Actual**: [Measured result]
- **Status**: Pass / Fail / Partial
- **Notes**: [Observations]
- **Evidence**: [Screenshot/log reference]

### Success Criterion 2: [Criterion]
[Same structure]

### Performance Observations
| Metric | Measured | Notes |
|--------|----------|-------|
| Response time | [Value] | [Context] |
| Throughput | [Value] | [Context] |
| Resource usage | [Value] | [Context] |

### Unexpected Findings
1. [Finding and implications]
2. [Finding and implications]
```

---

## Day 8: Demo Preparation

### Demo Script
```markdown
## POC Demo Script

### Opening (2 min)
"The objective of this POC was to validate [hypothesis].
We explored [approach] over [duration]."

### Demo Flow (10-15 min)
1. Show [capability 1] - explain what it demonstrates
2. Show [capability 2] - explain what it demonstrates
3. Show [integration] - explain significance

### Key Findings (5 min)
"Our primary findings are:
1. [Finding 1]
2. [Finding 2]
3. [Finding 3]"

### Recommendation (2 min)
"Based on our findings, we recommend [GO/NO-GO/PIVOT]
because [rationale]."

### Q&A Preparation
Anticipated questions:
- Q: [Expected question]
  A: [Prepared answer]
```
```

### Process 3: Technology Evaluation POC

**Objective**: Systematically evaluate technology options.

**Technology Evaluation Framework**:

```markdown
# Technology Evaluation POC
## Evaluating: [Technology Options]

---

## 1. Evaluation Criteria

### Weighted Criteria
| Criterion | Weight | Description |
|-----------|--------|-------------|
| Performance | 25% | Response time, throughput |
| Developer Experience | 20% | Learning curve, tooling |
| Integration Capability | 20% | APIs, ecosystem |
| Scalability | 15% | Growth capacity |
| Cost | 10% | License, infrastructure |
| Community/Support | 10% | Documentation, community |

---

## 2. Candidates

### Option A: [Technology Name]
- Version: [Version]
- Website: [URL]
- License: [License type]

### Option B: [Technology Name]
[Same structure]

### Option C: [Technology Name]
[Same structure]

---

## 3. Evaluation Plan

### Test Cases for Each Candidate
| Test Case | What It Validates | Steps |
|-----------|-------------------|-------|
| Basic CRUD | Core functionality | Create, Read, Update, Delete |
| API Integration | External connectivity | Connect to [system] |
| Performance | Speed at scale | Process [X] records |
| Error Handling | Reliability | Simulate failures |

### Evaluation Environment
- Same hardware/infrastructure for all candidates
- Same test data
- Same evaluation team

---

## 4. Evaluation Results

### Option A: [Technology Name]

#### Test Results
| Test Case | Result | Notes |
|-----------|--------|-------|
| Basic CRUD | Pass | [Notes] |
| API Integration | Pass | [Notes] |
| Performance | [Metric] | [Notes] |
| Error Handling | [Result] | [Notes] |

#### Criteria Scoring
| Criterion | Score (1-5) | Evidence |
|-----------|-------------|----------|
| Performance | [Score] | [Measurements] |
| Developer Experience | [Score] | [Observations] |
| Integration | [Score] | [What worked/didn't] |

#### Weighted Score
[Calculate: Criterion Score x Weight]

#### Pros
1. [Pro 1]
2. [Pro 2]

#### Cons
1. [Con 1]
2. [Con 2]

---

### Comparison Matrix

| Criterion | Weight | Option A | Option B | Option C |
|-----------|--------|----------|----------|----------|
| Performance | 25% | 4 (1.0) | 3 (0.75) | 5 (1.25) |
| Dev Experience | 20% | 5 (1.0) | 4 (0.8) | 3 (0.6) |
| Integration | 20% | 4 (0.8) | 5 (1.0) | 4 (0.8) |
| Scalability | 15% | 4 (0.6) | 4 (0.6) | 5 (0.75) |
| Cost | 10% | 5 (0.5) | 3 (0.3) | 4 (0.4) |
| Community | 10% | 4 (0.4) | 5 (0.5) | 3 (0.3) |
| **TOTAL** | | **4.3** | **3.95** | **4.1** |

---

## 5. Recommendation

### Recommended Option: [Option A]

### Rationale
[2-3 paragraphs explaining the recommendation]

### Risk Factors
[Known risks with recommended option]

### Alternative Consideration
[When Option B or C might be preferred]
```

### Process 4: Integration POC

**Objective**: Validate integration approaches before implementation.

**Integration POC Template**:

```markdown
# Integration POC
## Validating: [System A] to [System B] Integration

---

## 1. Integration Hypothesis

"We can integrate [System A] with [System B] using [method] to achieve [outcome]."

### Technical Questions
1. Can we authenticate successfully?
2. Can we read [data type] from [System A]?
3. Can we write [data type] to [System B]?
4. What is the latency for [operation]?
5. How do we handle [error scenario]?

---

## 2. Integration Architecture

### Proposed Pattern
[Diagram of integration flow]

### Authentication Flow
```
[System A] ---> [Our Integration] ---> [System B]
                      |
                [Auth Service]
```

### Data Flow
```
1. Trigger: [Event from System A]
2. Transform: [Our service transforms data]
3. Deliver: [Push to System B API]
4. Confirm: [Acknowledgment flow]
```

---

## 3. API Analysis

### System A API
| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| /api/data | GET | Retrieve records | API Key |
| /api/webhooks | POST | Receive events | Signature |

### System B API
| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| /v2/records | POST | Create record | OAuth 2.0 |

### API Limitations Discovered
- Rate limits: [Details]
- Payload size: [Limits]
- Missing fields: [What's not available]

---

## 4. POC Implementation

### Sample Code: Authentication
```typescript
// System A Authentication
async function authenticateSystemA() {
  const response = await fetch('https://system-a.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.SYSTEM_A_CLIENT_ID,
      client_secret: process.env.SYSTEM_A_SECRET,
      grant_type: 'client_credentials',
    }),
  });
  return response.json();
}
```

### Sample Code: Data Sync
```typescript
async function syncRecord(record: SystemARecord) {
  // Transform to System B format
  const transformed = {
    externalId: record.id,
    name: record.fullName,
    email: record.emailAddress,
    customFields: {
      sourceSystem: 'system-a',
      syncedAt: new Date().toISOString(),
    },
  };

  // Send to System B
  const response = await fetch('https://system-b.com/v2/records', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${systemBToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transformed),
  });

  return response.json();
}
```

---

## 5. Validation Results

### Test Scenario: Full Sync Flow
| Step | Expected | Actual | Status |
|------|----------|--------|--------|
| Auth to System A | Token received | Token received | Pass |
| Fetch 100 records | < 2 seconds | 1.3 seconds | Pass |
| Transform data | No errors | No errors | Pass |
| Auth to System B | Token received | Token received | Pass |
| Create in System B | 201 response | 201 response | Pass |
| Round-trip time | < 5 seconds | 3.8 seconds | Pass |

### Error Scenarios Tested
| Scenario | Expected Behavior | Actual | Notes |
|----------|-------------------|--------|-------|
| Invalid auth | 401 error | 401 error | Handled |
| Rate limited | Retry after delay | 429 + retry | Works |
| Network timeout | Timeout error | Timeout | Needs handling |

---

## 6. Findings and Recommendations

### Validation Status: GO

### Key Findings
1. Integration is technically feasible
2. Performance meets requirements (< 5s round-trip)
3. API rate limits require batching for bulk operations
4. Webhook reliability needs monitoring

### Production Requirements
1. Implement proper retry logic with backoff
2. Add dead letter queue for failures
3. Set up monitoring and alerting
4. Handle pagination for large datasets
5. Implement idempotency keys

### Estimated Production Effort
- Development: [X] days
- Testing: [X] days
- Deployment: [X] days
```

### Process 5: POC Results Presentation

**Objective**: Present POC findings effectively to stakeholders.

**POC Results Presentation Structure**:

```markdown
# POC Results Presentation
## [POC Name]

---

## Slide 1: Title
- POC Name
- Date
- Team

---

## Slide 2: Objective Recap
"We set out to answer: [Key question]"

### Success Criteria
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]

---

## Slide 3: What We Built
[Screenshot or diagram of POC]

### Scope
- [Capability 1]
- [Capability 2]
- [Integration demonstrated]

---

## Slide 4: Live Demo
[Perform live demonstration]

### Demo Script
1. [Action 1 - explain significance]
2. [Action 2 - explain significance]
3. [Action 3 - explain significance]

---

## Slide 5: Results Summary

| Criterion | Target | Actual | Status |
|-----------|--------|--------|--------|
| [Criterion 1] | [Target] | [Actual] | Pass |
| [Criterion 2] | [Target] | [Actual] | Pass |
| [Criterion 3] | [Target] | [Actual] | Partial |

---

## Slide 6: Key Findings

### Validated
1. [What worked as expected]
2. [What worked as expected]

### Discovered
1. [Unexpected finding]
2. [Unexpected finding]

### Risks Identified
1. [Risk and mitigation]
2. [Risk and mitigation]

---

## Slide 7: Recommendation

### Our Recommendation: [GO / NO-GO / PIVOT]

### Rationale
[2-3 key points supporting recommendation]

### If GO: Next Steps
1. [Immediate next step]
2. [Short-term action]
3. [Medium-term action]

### If NO-GO: Alternative
[What we recommend instead]

---

## Slide 8: Production Roadmap (if GO)

### Phase 1: Foundation (X weeks)
- [Deliverable 1]
- [Deliverable 2]

### Phase 2: Core (X weeks)
- [Deliverable 1]
- [Deliverable 2]

### Estimated Total: [X weeks / $X]

---

## Slide 9: Q&A

### Anticipated Questions
[Be prepared for common questions]

---

## Appendix
- Technical details
- Test results
- Code samples
```

## Tools & Templates

| Tool | Purpose | When to Use |
|------|---------|-------------|
| POC Charter | Scoping | Every POC |
| Daily Checklist | Execution tracking | During development |
| Evaluation Matrix | Technology comparison | Tech selection |
| Results Template | Documentation | POC completion |
| Presentation Deck | Stakeholder communication | Final readout |

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to Decision | < 2 weeks | POC duration |
| Hypothesis Validation | Yes/No/Partial | Clear answer |
| Scope Adherence | Stay in scope | Scope changes |
| Stakeholder Confidence | > 4/5 | Post-POC survey |
| Go Rate (when appropriate) | > 70% | POCs leading to projects |

## Common Pitfalls

1. **Scope Creep**: Resist adding features. POC proves feasibility, not completeness.
2. **Premature Optimization**: Don't optimize POC code. It's throwaway.
3. **Insufficient Success Criteria**: Define measurable criteria upfront.
4. **Over-engineering**: Build minimum to prove hypothesis.
5. **Poor Documentation**: Capture learnings throughout, not just at end.

## Integration Points

- **Discovery**: POC validates discoveries
- **Architecture**: POC informs architecture decisions
- **Estimation**: POC reduces estimation uncertainty
- **Proposals**: POC de-risks proposals
- **Implementation**: POC code may seed production (carefully)
