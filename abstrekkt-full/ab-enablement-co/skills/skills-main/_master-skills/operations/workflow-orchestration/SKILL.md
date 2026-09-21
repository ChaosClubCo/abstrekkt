---
name: workflow-orchestration
description: Design, implement, and manage complex multi-step workflows across systems and teams using orchestration patterns, dependency management, and state tracking to ensure reliable end-to-end process execution. Use when managing, optimizing, or automating operational workflows.
---

# Workflow Orchestration

> Coordinate complex processes across systems, teams, and time with precision

## Description

Workflow orchestration is the practice of designing, coordinating, and managing multi-step business and technical processes that span multiple systems, teams, and time boundaries. This skill covers workflow pattern design, dependency management, state machine modeling, error handling strategies, parallel and sequential execution patterns, and observability for distributed workflows. It applies orchestration patterns (centralized coordination) and choreography patterns (event-driven) to build reliable, scalable process automation that handles both happy paths and exception scenarios gracefully. Practitioners use this skill to transform fragmented, manually-coordinated processes into reliable automated workflows with full visibility and control.

## Activation Triggers

- "Design a multi-step workflow spanning several systems and teams"
- "Orchestrate a data pipeline with dependencies and error handling"
- "Build an order fulfillment workflow from placement to delivery"
- "Create a workflow for employee lifecycle management across HR systems"
- "Design retry and compensation logic for distributed transactions"
- "Implement a state machine for case management or approval processes"
- "Coordinate parallel tasks with synchronization points"
- "Build workflow monitoring with status tracking and SLA alerts"
- "Design event-driven workflows with publish-subscribe patterns"
- "Create a DAG-based workflow for batch processing pipelines"
- "Implement saga patterns for long-running business transactions"

## Instructions

### Core Workflow

**Step 1: Process Analysis and Decomposition**
- Map the end-to-end process identifying all steps, decisions, and outcomes
- Identify participants: systems, services, APIs, human actors, external parties
- Determine step dependencies: which steps must be sequential, which can run in parallel
- Classify each step: automated, semi-automated (human-in-loop), or manual
- Document data flows: inputs required, outputs produced, transformations applied at each step

**Step 2: Workflow Pattern Design**
- Select orchestration model: centralized orchestrator, event-driven choreography, or hybrid
- Design workflow topology: linear, branching, parallel, looping, or DAG (directed acyclic graph)
- Define state transitions with explicit states, events, and guard conditions
- Design error handling: retry policies, compensation actions, dead letter queues
- Specify timeout and SLA parameters for each step and end-to-end

**Step 3: Integration Architecture**
- Define integration patterns for each participant: sync API, async messaging, webhook, file transfer
- Design idempotency for all operations to handle safe retries
- Implement correlation mechanisms to track workflow instances across systems
- Design payload schemas and data transformation between steps
- Establish authentication and authorization for cross-system interactions

**Step 4: Implementation and Testing**
- Implement workflow definitions in chosen orchestration platform
- Build integration adapters for each participating system
- Develop comprehensive test scenarios: happy path, error paths, timeout, partial failure
- Test idempotency by replaying steps and verifying no duplicate side effects
- Validate SLA compliance under expected and peak load conditions

**Step 5: Operations and Observability**
- Deploy workflow monitoring: instance status, step duration, error rates, queue depth
- Implement distributed tracing with correlation IDs across all participating systems
- Build dashboards showing workflow throughput, success rate, and bottleneck identification
- Establish alerting for stuck workflows, SLA breaches, and error rate spikes
- Create operational procedures for manual intervention, restart, and skip-step scenarios

### Workflow Pattern Library

**Core Orchestration Patterns**

| Pattern | Description | Use Case | Complexity |
|---|---|---|---|
| Sequential | Steps execute one after another | Simple approval chains, data pipelines | Low |
| Parallel | Multiple steps execute simultaneously | Multi-system provisioning, parallel checks | Medium |
| Fan-Out/Fan-In | Split into parallel branches, merge results | Batch processing, multi-source aggregation | Medium |
| Conditional Branch | Different paths based on data or rules | Risk-based routing, tiered processing | Medium |
| Loop/Iteration | Repeat steps until condition met | Retry logic, batch item processing | Medium |
| Sub-Workflow | Nested workflow invocation | Reusable process components | Medium |
| Saga | Long-running transaction with compensations | Order processing, booking systems | High |
| State Machine | Explicit states with event-driven transitions | Case management, ticket lifecycle | High |
| Event-Driven | Steps triggered by events, loosely coupled | Microservice choreography, async processing | High |
| Human-in-Loop | Automated flow pauses for human decision/action | Approval workflows, exception handling | Medium |

**Error Handling Strategies**

| Strategy | When to Use | Implementation |
|---|---|---|
| Retry with Backoff | Transient errors (network, timeout, rate limit) | Exponential backoff: 1s, 2s, 4s, 8s, max 5 retries |
| Retry with Circuit Breaker | Downstream service instability | Open circuit after 3 consecutive failures, half-open after 30s |
| Compensation (Saga) | Multi-step transaction requires undo | Each step has a compensating action; execute in reverse on failure |
| Dead Letter Queue | Unrecoverable errors needing manual review | Route failed items to DLQ with full context for investigation |
| Skip and Continue | Non-critical step failure | Log warning, proceed with default/null value |
| Fallback | Primary method unavailable | Switch to alternative method or cached data |
| Human Escalation | Automation cannot resolve | Route to human operator queue with context and suggested action |

**State Machine Design Principles**

- Every state must have at least one exit transition (no orphan states)
- Terminal states must be explicitly defined (completed, cancelled, failed)
- Guard conditions on transitions must be mutually exclusive within a state
- Actions can be: entry actions (on entering state), exit actions (on leaving), transition actions
- Include a timeout transition for every non-terminal state to prevent stuck instances
- Log all state transitions with timestamp, trigger event, and actor for full audit trail

### Workflow Observability Framework

**Monitoring Metrics**

| Metric | Definition | Target | Alert Threshold |
|---|---|---|---|
| Workflow Throughput | Completed instances per time period | Meet demand | < 80% of expected |
| Success Rate | Completed successfully / Total completed | > 95% | < 90% |
| Average Duration | Mean end-to-end workflow execution time | Within SLA | > 120% of SLA |
| P95 Duration | 95th percentile execution time | Within SLA | > SLA |
| Active Instances | Currently executing workflows | Below max concurrency | > 80% of max |
| Stuck Instances | Instances with no state change > threshold | 0 | Any > 0 |
| Error Rate | Failed steps / Total step executions | < 2% | > 5% |
| Queue Depth | Items waiting for processing | Low, trending flat | Growing trend |
| Step Duration Breakdown | Time per step as % of total workflow time | Balanced | Any step > 60% |
| DLQ Depth | Items in dead letter queue | 0 or near-zero | > 10 items |

**Distributed Tracing Standards**

- Assign unique workflow instance ID at initiation, propagate to all steps
- Include correlation ID in all API calls, messages, and log entries
- Log step entry and exit with timestamp, status, and payload summary
- Capture error details with stack trace and system context
- Implement trace sampling for high-volume workflows (100% for errors, 10% for success)
- Retain trace data for minimum 30 days (90 days for regulated workflows)

### Templates

**Template 1: Workflow Design Document**

```
WORKFLOW DESIGN DOCUMENT
Workflow: [Name] | Version: [X] | Author: [Name] | Date: [Date]

PURPOSE
[2-3 sentences describing what this workflow accomplishes and why it exists]

TRIGGER
Event: [What initiates this workflow]
Source: [System/user/schedule that generates the trigger]
Payload: [Key data elements included in trigger]

WORKFLOW STEPS
| Step | Name | Type | System | SLA | Retry | On Failure |
|------|------|------|--------|-----|-------|------------|
| 1 | [Validate input] | Auto | [System A] | 5s | 3x | Reject + notify |
| 2 | [Enrich data] | Auto | [System B] | 10s | 3x | Use cached data |
| 3 | [Check compliance] | Auto | [Rules Engine] | 5s | 2x | Flag for manual review |
| 4 | [Await approval] | Human | [Approval UI] | 24h | N/A | Escalate to manager |
| 5a | [Provision Account] | Auto | [System C] | 30s | 3x | Compensate step 3 |
| 5b | [Send notification] | Auto | [Email Service] | 10s | 3x | Log warning, continue |
| 6 | [Update record] | Auto | [System A] | 5s | 3x | DLQ for manual fix |

PARALLEL EXECUTION
Steps 5a and 5b execute in parallel after step 4 approval
Synchronization: Wait for 5a to complete; 5b is fire-and-forget

STATE DIAGRAM
[Initial] -> Validating -> Enriching -> Compliance Check
  -> Pending Approval -> Provisioning -> Complete
  -> Rejected (from Compliance Check or Pending Approval)
  -> Failed (from any step after max retries)

COMPENSATION (SAGA)
If step 5a fails after step 4 approved:
  1. Undo step 3 compliance flag
  2. Notify approver of failure
  3. Move to "Failed - Requires Manual Resolution" state

DATA FLOW
| Step | Input | Output | Transformation |
|------|-------|--------|----------------|
| 1 | Raw request payload | Validated request | Schema validation, defaults applied |
| 2 | Validated request | Enriched request | External data lookup and merge |
| 3 | Enriched request | Compliance result | Rules evaluation, risk score |
| 4 | Compliance result | Approval decision | Human judgment |
| 5a | Approved request | Account details | System provisioning |
| 6 | Account details | Updated record | Master record update |

END-TO-END SLA: [X hours/minutes]
EXPECTED DAILY VOLUME: [X] instances
MAX CONCURRENT INSTANCES: [X]
```

**Template 2: Workflow Operations Runbook**

```
WORKFLOW OPERATIONS RUNBOOK
Workflow: [Name] | Owner: [Team] | Last Updated: [Date]

NORMAL OPERATIONS
Expected throughput: [X] instances per [hour/day]
Expected success rate: > [X]%
Expected duration: [X] minutes average, [X] minutes P95
Monitoring dashboard: [URL]

COMMON ISSUES AND RESOLUTION

Issue 1: Stuck Instance - Step [X] timeout
Symptoms: Instance in "[State]" for > [X] minutes
Diagnosis: Check [System X] logs for [specific error pattern]
Resolution:
  Option A: [Retry the step]: [exact command/procedure]
  Option B: [Skip the step]: [exact command/procedure]
  Option C: [Cancel the instance]: [exact command/procedure]
Post-action: Verify instance proceeds to next state

Issue 2: High Error Rate on Step [X]
Symptoms: Error rate > [X]% on [step name] in last [X] minutes
Diagnosis: Check [downstream system] health at [URL]
Resolution:
  If system down: Wait for recovery, instances will auto-retry
  If data issue: Check DLQ for pattern, fix source data
  If code issue: Escalate to development team
Post-action: Monitor error rate return to < [X]%

Issue 3: DLQ Accumulation
Symptoms: DLQ depth > [X] items
Diagnosis: Review DLQ messages for common error pattern
Resolution:
  If transient: Replay messages from DLQ [procedure]
  If data error: Fix data and replay [procedure]
  If permanent: Archive with reason code [procedure]

MANUAL INTERVENTION PROCEDURES
Restart a failed instance: [step-by-step procedure]
Skip a stuck step: [step-by-step procedure]
Force-complete an instance: [step-by-step procedure]
Reprocess a batch: [step-by-step procedure]

ESCALATION
L1 (Ops team): Stuck instances, DLQ items, known error resolution
L2 (Dev team): Unknown errors, repeated failures, performance degradation
L3 (Architecture): Systemic issues, design changes, capacity problems
```

**Template 3: Workflow Performance Report**

```
WORKFLOW PERFORMANCE REPORT
Period: [Date Range] | Workflow: [Name]

THROUGHPUT
Total instances initiated: [X]
Total instances completed: [X]
Total instances failed: [X]
Total instances in-progress: [X]
Success rate: [X]%

DURATION ANALYSIS
| Percentile | Duration | SLA | Status |
|------------|----------|-----|--------|
| P50 (Median) | [X] min | [X] min | [Met/Exceeded] |
| P90 | [X] min | [X] min | [Met/Exceeded] |
| P95 | [X] min | [X] min | [Met/Exceeded] |
| P99 | [X] min | N/A | [Reference] |

STEP-LEVEL BREAKDOWN
| Step | Avg Duration | P95 Duration | Error Rate | % of Total Time |
|------|--------------|--------------|------------|-----------------|
| [Step 1] | [X]s | [X]s | [X]% | [X]% |
| [Step 2] | [X]s | [X]s | [X]% | [X]% |
| [Step 3] | [X]s | [X]s | [X]% | [X]% |
Bottleneck step: [Step X] consuming [X]% of total workflow time

ERROR ANALYSIS
| Error Type | Count | % of Errors | Root Cause | Resolution |
|------------|-------|-------------|------------|------------|
| [Timeout] | [X] | [X]% | [System latency] | [Increased timeout] |
| [Data error] | [X] | [X]% | [Invalid input] | [Added validation] |

DLQ STATUS
Items added this period: [X]
Items resolved: [X]
Current depth: [X]
Oldest item: [X days]

TRENDS
[Narrative on throughput trends, duration trends, error trends vs. prior periods]
```

### Best Practices

- Design workflows for failure: every step should have a defined failure path and recovery mechanism
- Make all operations idempotent; workflows will retry, and duplicate execution must be safe
- Use correlation IDs throughout the entire workflow for end-to-end traceability
- Separate workflow orchestration logic from business logic; keep orchestrators thin
- Set explicit timeouts on every step; infinite waits create zombie instances that consume resources
- Implement dead letter queues for every async integration point to prevent data loss
- Design compensation (undo) logic at the same time as forward logic, not as an afterthought
- Use event sourcing for workflow state to enable replay, audit, and debugging
- Limit fan-out parallelism to avoid overwhelming downstream systems (use rate limiting)
- Monitor queue depths as a leading indicator of throughput problems before SLA breaches occur
- Build manual override capabilities (retry, skip, force-complete) for operational resilience
- Version workflow definitions so running instances complete on their original version
- Test workflow behavior under partial system failure, not just happy path scenarios
- Keep human-in-loop steps asynchronous with clear SLAs and escalation timeouts
- Document every workflow with a visual diagram, step descriptions, and operational runbook

### Common Patterns

**Pattern 1: Order Fulfillment Orchestration**

An e-commerce company processes 5,000 orders daily across payment, inventory, warehouse, shipping, and notification systems. Manual coordination causes 8% of orders to have fulfillment errors. Action: (1) Design saga-based workflow: payment authorization -> inventory reservation -> warehouse pick/pack -> shipping label generation -> customer notification, (2) Implement compensation: if warehouse cannot fulfill, reverse inventory reservation and payment auth, then notify customer, (3) Parallelize shipping label generation with customer notification, (4) Add real-time status tracking via event stream. Result: Fulfillment error rate drops from 8% to 0.5%, end-to-end cycle time reduced from 48 hours to 6 hours, full order visibility eliminates 90% of "where is my order" support contacts.

**Pattern 2: Multi-System Data Pipeline Orchestration**

A financial services firm runs nightly batch processing across 12 systems with manual handoffs. Pipeline completion takes 8 hours with frequent failures requiring manual restart, sometimes delaying morning reporting. Action: (1) Model pipeline as a DAG with explicit dependencies between jobs, (2) Implement automated health checks between stages with retry and alerting, (3) Design checkpoint/restart capability so pipeline resumes from last successful step after failure, (4) Parallelize independent branches (reference data refresh || transaction processing), (5) Add SLA monitoring with proactive alerts when pipeline is trending late. Result: Pipeline duration reduced from 8 hours to 3.5 hours through parallelization, failure recovery time reduced from 45 minutes (manual) to 3 minutes (automated restart), on-time completion improves from 82% to 99%.

### Output Formats

**Workflow Architecture Diagram**
Visual representation showing: all workflow steps as nodes with transitions as edges, decision points with condition labels, parallel branches with join points, error handling paths, human interaction points, and system integrations clearly labeled.

**Workflow Operations Dashboard**
Real-time display showing: active instance count with status breakdown, throughput rate vs. target, step-level duration heat map, error rate gauges with trend, DLQ depth and age, and SLA compliance indicator.

**Workflow Health Report**
Periodic report covering: throughput and success rate analysis, duration breakdown by step with bottleneck identification, error analysis with categorization and trend, DLQ review with resolution status, and capacity assessment (current load vs. maximum).
