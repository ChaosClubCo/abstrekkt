# Workflow: Ticket Routing & Escalation

> **Audience:** ENG | **Phase:** MVP (Week 4) | **Effort:** 2 days

---

## Overview
Automatically classify, route, and escalate support tickets. Reduces routing time from 15 minutes to <5 seconds.

## Trigger
Teams Bot: employee submits support request via adaptive card (subject, description, urgency).

## Steps

| # | Step | Connector | Action | Approval | Timeout |
|---|------|-----------|--------|----------|---------|
| 1 | Extract ticket fields | Internal | Parse subject, description, urgency from Teams payload | None | 2s |
| 2 | Classify category | Internal | Keyword match: network, access, software, hardware, general | None | 1s |
| 3 | Match agent | Internal | Query agent pool by category + availability + capacity | None | 2s |
| 4 | Check capacity | Internal | If agent at capacity → flag for escalation | None | 1s |
| 5 | Route ticket | Jira | Create ticket, assign to matched agent | Manager (if escalation) | 10s |
| 6 | Notify | Slack/Teams | Notify agent + requester of assignment | None | 5s |

## Acceptance Criteria

```gherkin
Scenario: Standard ticket routing
  Given a user submits a ticket with subject "VPN not connecting"
  When the workflow executes
  Then the ticket is classified as "network"
  And assigned to an available network support agent
  And the agent receives a Slack notification
  And the user receives a Teams confirmation
  And total execution time is <5 seconds

Scenario: Escalation when no agent available
  Given all network agents are at capacity
  When the workflow executes
  Then a manager approval is requested
  And the ticket is held until approval
  And if approved, assigned to next-available agent from any pool

Scenario: Unclassifiable ticket
  Given a ticket with subject "miscellaneous request"
  When classification returns "general"
  Then the ticket is routed to the triage queue
  And no escalation approval is needed
```

## Test Data
- 100 tickets across 5 categories (20 each)
- 10 escalation scenarios (all agents at capacity)
- 5 unclassifiable tickets
- Target: P95 latency <5s, <2% classification errors

## Error Handling
| Error | Response |
|-------|----------|
| Jira API unavailable | Retry 3x → DLQ → alert |
| Slack notification failure | Fallback to email |
| No agents in pool | Auto-escalate to manager |
