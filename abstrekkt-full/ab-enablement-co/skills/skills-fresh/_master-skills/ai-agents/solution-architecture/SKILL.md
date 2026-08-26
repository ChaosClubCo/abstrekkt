---
name: solution-architecture
description: Comprehensive solution architecture expertise covering technical proposals, system design, architecture documentation, and pre-sales technical leadership for enterprise solutions. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Solution Architecture

## Overview

Solution architecture bridges business requirements and technical implementation by defining how systems will meet client needs. This skill covers the complete solution architecture lifecycle from initial concept through detailed design documentation and stakeholder communication.

Effective solution architecture requires balancing technical excellence with business pragmatism. It involves making trade-off decisions, communicating complex concepts to diverse audiences, and producing documentation that guides successful implementation while managing client expectations.

This skill provides frameworks for designing scalable, maintainable solutions that address stated requirements while anticipating future needs. The focus is on creating architectures that are both technically sound and practically implementable within client constraints.

### Why This Matters

- **Project success**: Good architecture reduces implementation risk by 60%
- **Cost efficiency**: Right-sized solutions avoid over-engineering and under-delivering
- **Client confidence**: Clear architecture documentation builds trust
- **Team alignment**: Architecture provides shared vision for delivery team
- **Maintainability**: Well-designed systems reduce long-term TCO

## When to Use

### Primary Triggers

- "Design the solution architecture"
- "Create a technical proposal"
- "How should we structure this system?"
- "Document the architecture"
- "Present the technical approach"
- "Compare architecture options"
- "Design for scale"

### Specific Use Cases

1. **Pre-Sales**: Technical proposals for prospective clients
2. **Project Initiation**: Detailed architecture for approved projects
3. **System Modernization**: Migration and refactoring strategies
4. **Integration Design**: Enterprise integration architecture
5. **Platform Selection**: Technology evaluation and recommendation
6. **Architecture Review**: Assessment of existing architectures

## Core Processes

### Process 1: Solution Design Framework

**Objective**: Develop comprehensive solution architectures from requirements.

**Architecture Development Process**:

```markdown
# Solution Architecture Process

## Phase 1: Requirements Analysis
### Inputs
- Discovery documentation
- Business requirements
- Technical requirements
- Constraints and assumptions

### Activities
1. Categorize requirements (functional, non-functional, constraints)
2. Identify architecturally significant requirements (ASRs)
3. Map requirements to quality attributes
4. Prioritize requirements by business value and risk

### Outputs
- Prioritized requirements matrix
- Quality attribute scenarios
- Architecture decision log (initial)

---

## Phase 2: Architecture Synthesis
### Activities
1. Identify candidate architecture patterns
2. Map patterns to requirements
3. Develop conceptual architecture
4. Define system boundaries and interfaces
5. Allocate responsibilities to components

### Key Decisions
- Deployment model (cloud, hybrid, on-prem)
- Architecture style (monolith, microservices, serverless)
- Integration approach (API, event-driven, batch)
- Data architecture (centralized, distributed, hybrid)

### Outputs
- Conceptual architecture diagram
- Component responsibility matrix
- Initial technology selections

---

## Phase 3: Architecture Evaluation
### Activities
1. Scenario-based evaluation (ATAM light)
2. Trade-off analysis
3. Risk assessment
4. Cost estimation
5. Stakeholder review

### Evaluation Criteria
| Quality Attribute | Scenarios | Architecture Response |
|------------------|-----------|----------------------|
| Performance | 1000 users, < 2s response | Caching, CDN, horizontal scaling |
| Security | PII protection | Encryption, RBAC, audit logging |
| Scalability | 10x growth in 3 years | Stateless services, auto-scaling |

### Outputs
- Architecture trade-off analysis
- Risk register
- Cost model
- Architecture decision records (ADRs)

---

## Phase 4: Architecture Documentation
### Deliverables
1. Solution overview document
2. Architecture diagrams (C4 model)
3. Integration specifications
4. Data architecture
5. Security architecture
6. Infrastructure architecture
7. ADRs
```

**Quality Attribute Scenarios Template**:

```markdown
## Quality Attribute Scenario

### Scenario ID: QA-001
**Quality Attribute**: Performance

**Source**: End user
**Stimulus**: Submits search query
**Artifact**: Search API
**Environment**: Normal operation, peak load
**Response**: Return results
**Response Measure**: 95th percentile < 500ms

### Architecture Tactics
1. Implement search index (Elasticsearch)
2. Cache frequent queries (Redis)
3. Paginate results
4. Lazy load related data

### Trade-offs
- Increased infrastructure cost
- Added operational complexity
- Eventual consistency for index updates
```

### Process 2: Architecture Documentation (C4 Model)

**Objective**: Create clear, multi-level architecture documentation.

**C4 Model Documentation**:

```markdown
# Architecture Documentation
## [Solution Name]

---

## Level 1: System Context Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTEM CONTEXT                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐         ┌─────────────────┐        ┌───────────┐  │
│  │          │ Uses    │                 │ Sends  │           │  │
│  │  Users   │────────▶│   [System]      │───────▶│  Email    │  │
│  │          │         │                 │        │  Service  │  │
│  └──────────┘         └─────────────────┘        └───────────┘  │
│                              │                                   │
│       ┌──────────────────────┴───────────────────────┐          │
│       │                      │                       │          │
│       ▼                      ▼                       ▼          │
│  ┌──────────┐         ┌───────────┐          ┌───────────┐      │
│  │  CRM     │         │  Payment  │          │  Analytics│      │
│  │  System  │         │  Gateway  │          │  Platform │      │
│  └──────────┘         └───────────┘          └───────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Context Description
| Element | Description |
|---------|-------------|
| Users | [Description of users and their needs] |
| [System] | [Description of what system does] |
| CRM System | [Integration purpose] |
| Payment Gateway | [Integration purpose] |
| Analytics Platform | [Integration purpose] |
| Email Service | [Integration purpose] |

---

## Level 2: Container Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     [SYSTEM NAME]                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Web Application                        │   │
│  │                    [Next.js, React]                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              │ HTTPS/JSON                        │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    API Gateway                            │   │
│  │                    [Kong/AWS API Gateway]                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│           │                  │                  │                │
│           ▼                  ▼                  ▼                │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │  User       │    │  Order      │    │  Payment    │          │
│  │  Service    │    │  Service    │    │  Service    │          │
│  │  [Node.js]  │    │  [Node.js]  │    │  [Node.js]  │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│         │                  │                  │                  │
│         ▼                  ▼                  ▼                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    PostgreSQL                            │    │
│  │                    [Primary Database]                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │  Redis      │    │  S3         │    │  SQS        │          │
│  │  [Cache]    │    │  [Storage]  │    │  [Queue]    │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Container Descriptions
| Container | Technology | Purpose |
|-----------|------------|---------|
| Web Application | Next.js 14, React 18 | User interface, SSR |
| API Gateway | Kong | Rate limiting, auth, routing |
| User Service | Node.js, Express | User management, auth |
| Order Service | Node.js, Express | Order processing |
| Payment Service | Node.js, Express | Payment integration |
| PostgreSQL | PostgreSQL 15 | Primary data store |
| Redis | Redis 7 | Session cache, rate limiting |
| S3 | AWS S3 | File storage |
| SQS | AWS SQS | Async processing |

---

## Level 3: Component Diagram (per container)

### Order Service Components

```
┌─────────────────────────────────────────────────────────────────┐
│                     ORDER SERVICE                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │  Order      │    │  Order      │    │  Inventory  │          │
│  │  Controller │───▶│  Service    │───▶│  Client     │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│                            │                                     │
│                            ▼                                     │
│                     ┌─────────────┐                              │
│                     │  Order      │                              │
│                     │  Repository │                              │
│                     └─────────────┘                              │
│                            │                                     │
│                            ▼                                     │
│                     ┌─────────────┐    ┌─────────────┐          │
│                     │  Order      │    │  Event      │          │
│                     │  Entity     │    │  Publisher  │          │
│                     └─────────────┘    └─────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Level 4: Code (as needed)

### Key Class Diagram
[UML or simplified class diagram for complex components]

### API Specifications
[OpenAPI/Swagger reference]
```

### Process 3: Architecture Decision Records (ADRs)

**Objective**: Document and communicate key architecture decisions.

**ADR Template**:

```markdown
# ADR-001: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-XXX]

## Date
[YYYY-MM-DD]

## Context
[Describe the issue motivating this decision. What is the problem?
What are the forces at play? Include technical, business, and social factors.]

## Decision
[State the architecture decision. Use active voice: "We will..."]

## Rationale
[Explain why this decision was made. Include:
- Alternatives considered
- Trade-offs evaluated
- Criteria used for decision]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Drawback 1]
- [Drawback 2]

### Risks
- [Risk 1 and mitigation]
- [Risk 2 and mitigation]

## Related Decisions
- [Links to related ADRs]

## References
- [Links to supporting documentation]
```

**Example ADRs**:

```markdown
# ADR-002: Use PostgreSQL as Primary Database

## Status
Accepted

## Date
2024-01-15

## Context
The system requires a reliable, scalable database for transactional workloads.
Requirements include:
- ACID compliance for financial transactions
- Complex queries for reporting
- JSON support for flexible schema portions
- Horizontal read scaling
- Client team familiar with SQL databases

Options considered:
1. PostgreSQL
2. MySQL
3. MongoDB
4. AWS Aurora

## Decision
We will use PostgreSQL 15 as the primary database, hosted on AWS RDS.

## Rationale
PostgreSQL was selected because:
- Native JSON/JSONB support allows flexible schema where needed
- Excellent performance for complex analytical queries
- Strong ecosystem and community support
- Client team has PostgreSQL expertise
- AWS RDS provides managed hosting with read replicas

MongoDB rejected due to:
- ACID requirements favor relational
- Client team lacks NoSQL expertise
- Complex joins required

MySQL rejected due to:
- Inferior JSON handling
- Less advanced query optimization

Aurora considered but rejected due to:
- Higher cost at projected scale
- Vendor lock-in concerns

## Consequences

### Positive
- Familiar technology reduces learning curve
- Strong transactional guarantees
- Excellent tooling and monitoring

### Negative
- Schema migrations require careful planning
- Write scaling requires sharding strategy for future

### Risks
- Skill gap if team changes: Mitigate with documentation
- Performance at 10x scale: Mitigate with read replicas and caching
```

### Process 4: Integration Architecture

**Objective**: Design robust integration between systems.

**Integration Architecture Document**:

```markdown
# Integration Architecture
## [Project Name]

---

## 1. Integration Overview

### Integration Principles
1. **API-First**: All integrations via well-defined APIs
2. **Loose Coupling**: Systems should be independently deployable
3. **Idempotency**: Operations must be safely retryable
4. **Observability**: All integrations must be traceable

### Integration Patterns Used
| Pattern | Use Case |
|---------|----------|
| REST API | Synchronous request/response |
| Event-Driven | Async notifications |
| Batch ETL | Large data transfers |
| Webhook | External event notifications |

---

## 2. Integration Catalog

### INT-001: CRM Integration

**Description**: Sync customer data between system and Salesforce

**Direction**: Bidirectional

**Pattern**: REST API + Webhooks

**Data Flow**:
```
[Our System]  ───REST API───▶  [Salesforce]
                  (Create/Update Contact)

[Salesforce]  ───Webhook────▶  [Our System]
                  (Contact Updated Event)
```

**Technical Details**:
| Attribute | Value |
|-----------|-------|
| Protocol | HTTPS |
| Authentication | OAuth 2.0 |
| Format | JSON |
| Frequency | Real-time |
| SLA | < 5 seconds |

**Data Mapping**:
| Our Field | Salesforce Field | Transform |
|-----------|-----------------|-----------|
| email | Email | Direct |
| fullName | Name | Split to First/Last |
| company | Account.Name | Lookup |

**Error Handling**:
- Retry: 3 attempts with exponential backoff
- Dead Letter Queue for persistent failures
- Alert on > 5% failure rate

---

### INT-002: Payment Gateway Integration

**Description**: Process payments via Stripe

**Direction**: Outbound

**Pattern**: REST API

**Sequence Diagram**:
```
┌──────┐          ┌────────┐          ┌────────┐
│Client│          │  API   │          │ Stripe │
└──┬───┘          └───┬────┘          └───┬────┘
   │   Submit Order   │                   │
   │─────────────────▶│                   │
   │                  │  Create PaymentIntent
   │                  │──────────────────▶│
   │                  │   client_secret   │
   │                  │◀──────────────────│
   │  Payment Form    │                   │
   │◀─────────────────│                   │
   │                  │                   │
   │  Confirm Payment │                   │
   │─────────────────▶│                   │
   │                  │  Confirm Intent   │
   │                  │──────────────────▶│
   │                  │   Success/Fail    │
   │                  │◀──────────────────│
   │   Order Confirm  │                   │
   │◀─────────────────│                   │
```

**Security Requirements**:
- PCI DSS compliance via Stripe.js (no card data on our servers)
- Webhook signature verification
- Idempotency keys for all payment operations

---

## 3. API Specifications

### External APIs Consumed
| API | Version | Documentation |
|-----|---------|---------------|
| Salesforce REST | v58.0 | [Link] |
| Stripe | 2024-01-01 | [Link] |
| SendGrid | v3 | [Link] |

### APIs Provided
| API | Specification | Consumers |
|-----|---------------|-----------|
| Customer API | OpenAPI 3.0 | Mobile App, Partner |
| Webhook API | AsyncAPI 2.0 | CRM, Analytics |

---

## 4. Event Architecture

### Event Catalog
| Event | Producer | Consumers | Schema |
|-------|----------|-----------|--------|
| order.created | Order Service | Notification, Analytics | [Link] |
| payment.completed | Payment Service | Order Service | [Link] |
| user.registered | User Service | CRM, Email | [Link] |

### Event Schema Example
```json
{
  "eventId": "evt_123",
  "eventType": "order.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0",
  "source": "order-service",
  "data": {
    "orderId": "ord_456",
    "customerId": "cus_789",
    "total": 99.99,
    "currency": "USD"
  }
}
```
```

### Process 5: Technical Proposal Development

**Objective**: Create compelling technical proposals that win business.

**Technical Proposal Template**:

```markdown
# Technical Proposal
## [Project Name]
### Prepared for [Client Name]

---

## Executive Summary
[1-page summary covering problem, solution, approach, and value proposition]

---

## 1. Understanding Your Needs

### Business Context
[Demonstrate understanding of client's business and challenges]

### Key Requirements
[Summarize critical requirements from discovery]

### Success Criteria
[State measurable outcomes]

---

## 2. Proposed Solution

### Solution Overview
[High-level description of the proposed solution]

### Architecture
[Include Level 1 and Level 2 diagrams]

### Key Components
| Component | Purpose | Technology |
|-----------|---------|------------|
| [Component] | [Purpose] | [Technology] |

### Addressing Your Requirements
| Requirement | Solution Approach |
|-------------|-------------------|
| [Req 1] | [How solution addresses it] |

---

## 3. Technical Approach

### Development Methodology
[Describe approach - Agile, phases, etc.]

### Technology Stack
| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | [Tech] | [Why] |
| Backend | [Tech] | [Why] |
| Database | [Tech] | [Why] |
| Infrastructure | [Tech] | [Why] |

### Integration Approach
[Describe how integrations will be handled]

### Security Approach
[Describe security measures]

---

## 4. Implementation Plan

### Project Phases
| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Discovery & Design | 2 weeks | Architecture docs, detailed specs |
| Development - Core | 8 weeks | Core functionality |
| Development - Integrations | 4 weeks | All integrations |
| Testing & QA | 2 weeks | Tested, production-ready |
| Deployment & Go-Live | 1 week | Production deployment |

### Timeline
[Visual timeline or Gantt chart]

### Resource Requirements
| Role | Allocation | Duration |
|------|------------|----------|
| Solution Architect | 50% | Phase 1-2 |
| Senior Developer | 100% | Phase 2-4 |
| Developer | 100% | Phase 2-4 |
| QA Engineer | 100% | Phase 3-4 |

---

## 5. Risk Management

### Identified Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk] | H/M/L | H/M/L | [Strategy] |

---

## 6. Investment

### Cost Summary
| Category | Investment |
|----------|------------|
| Implementation | $XXX,XXX |
| Infrastructure (Annual) | $XX,XXX |
| Support (Annual) | $XX,XXX |

### Payment Terms
[Payment schedule]

---

## 7. Why [Company Name]

### Relevant Experience
[Case studies and examples]

### Team Qualifications
[Key team members and expertise]

### Our Commitment
[Value proposition and guarantees]

---

## Appendices
- A: Detailed Technical Specifications
- B: Team Biographies
- C: Case Studies
- D: Terms and Conditions
```

## Tools & Templates

| Tool | Purpose | When to Use |
|------|---------|-------------|
| C4 Model | Architecture visualization | All projects |
| ADR Template | Decision documentation | Every major decision |
| Draw.io/Miro | Diagramming | Visual documentation |
| OpenAPI/Swagger | API specification | API design |
| AsyncAPI | Event specification | Event-driven systems |

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Architecture Acceptance | > 90% | First proposal acceptance |
| Deviation from Design | < 10% | Implementation vs design |
| Documentation Quality | > 4/5 | Developer feedback |
| Client Confidence | > 4/5 | Post-proposal survey |
| ADR Coverage | 100% major decisions | ADRs per project |

## Common Pitfalls

1. **Over-Engineering**: Match solution complexity to actual requirements.
2. **Insufficient NFRs**: Always quantify performance, security, scalability.
3. **Missing Context**: Include business context, not just technical details.
4. **Diagram Overload**: Use appropriate level of detail for audience.
5. **Ignoring Constraints**: Design within client's real constraints.

## Integration Points

- **Discovery**: Architecture builds on discovery findings
- **Estimation**: Architecture informs effort estimates
- **Development**: Architecture guides implementation
- **Operations**: Architecture includes operational concerns
- **Sales**: Architecture supports commercial proposal
