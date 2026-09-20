# Acceptance Criteria Template (Gherkin)

> **Audience:** ENG | **Phase:** ALL

---

## Template

```gherkin
Feature: [Workflow Name]

  Background:
    Given the customer is on [Starter/Growth/Enterprise] tier
    And the n8n instance is healthy
    And all required connectors are configured

  Scenario: Happy path - [description]
    Given [precondition]
    When [trigger action]
    Then [expected step 1 outcome]
    And [expected step 2 outcome]
    And total execution time is <[X] seconds
    And audit log contains [expected events]

  Scenario: Approval required
    Given the step requires [role] approval
    When the workflow reaches the approval step
    Then an approval request is sent via [Slack/Teams/Email]
    And the workflow pauses with status WAITING_FOR_APPROVAL
    And when [role] approves
    Then the workflow resumes

  Scenario: Approval denied
    Given the step requires [role] approval
    When [role] denies the request with reason "[reason]"
    Then the step fails with status DENIED
    And the initiator is notified with the denial reason

  Scenario: Approval timeout
    Given the approval TTL is [X] seconds
    When no decision is made within TTL
    Then a reminder is sent at TTL-10min
    And the approval escalates at TTL
    And auto-rejects at TTL+30min

  Scenario: Connector failure
    Given [connector] returns [error code]
    When the step executes
    Then the step retries [N] times with exponential backoff
    And if all retries fail, the step moves to DLQ
    And an alert is sent to INT support

  Scenario: Idempotency
    Given a run with the same idempotency_key already completed
    When a duplicate trigger arrives
    Then the existing result is returned
    And no new run is created

  Scenario: Input validation
    Given the input contains [invalid data]
    When the workflow is triggered
    Then the run fails with VALIDATION error
    And an audit entry records the rejection
```

## Checklist Per Workflow

- [ ] Happy path scenario passes
- [ ] All approval scenarios (approve, deny, timeout, escalate) pass
- [ ] Connector failure scenario passes (retry + DLQ)
- [ ] Idempotency scenario passes (no duplicates)
- [ ] Input validation scenario passes (injection attempts blocked)
- [ ] Load test: 10 concurrent executions with no race conditions
- [ ] Audit log: all events present and HMAC-signed
- [ ] Latency: P95 within SLO for customer's tier
