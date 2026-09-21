# Approval Gates — Human-in-the-Loop Design

> **Audience:** ENG, LEAD
> **Phase:** MVP (Week 2)
> **Last Updated:** 2025-02-13

---

## Design Principle

No privileged action executes without a human decision. The approval engine is deterministic — no LLM involvement in the approval path. Policy rules are evaluated as structured conditions, not natural language.

---

## Approval Flow

```
Step requires privileged action (e.g., azure_ad.create_user)
  │
  ▼
Policy Engine evaluates rules
  │
  ├── Match found: require_approval
  │     │
  │     ▼
  │   Create Approval record
  │   (status: PENDING, TTL: from policy, approver: from chain)
  │     │
  │     ▼
  │   Send notification to approver
  │   (Slack modal / Teams adaptive card / Email)
  │     │
  │     ▼
  │   Step pauses (status: WAITING_FOR_APPROVAL)
  │     │
  │     ├── Approver clicks APPROVE
  │     │     → Record decision + reason in audit log
  │     │     → Resume step execution
  │     │
  │     ├── Approver clicks DENY
  │     │     → Record decision + reason in audit log
  │     │     → Fail step with DENIED status
  │     │     → Notify initiator
  │     │
  │     └── TTL expires (no decision)
  │           → At TTL - 10min: send reminder
  │           → At TTL: escalate to next approver in chain
  │           → At TTL + 30min: auto-reject
  │           → Record EXPIRED in audit log
  │
  ├── Match found: auto_approve
  │     → Record auto-approval in audit log
  │     → Continue execution (no human needed)
  │
  ├── Match found: deny
  │     → Fail step immediately
  │     → Record policy denial in audit log
  │
  └── No match found (fallback)
        → Default: REQUIRE_APPROVAL (safety-first)
        → Alert INT support: "unmatched policy condition"
```

---

## Policy Engine

### Rule Evaluation

Rules are evaluated top-to-bottom. First match wins.

```typescript
interface PolicyRule {
  condition: {
    connector_type: string;        // "azure_ad", "okta", "*"
    connector_action: string;      // "create_user", "delete_user", "*"
    context_match?: Record<string, string>;  // Optional: {"department": "engineering"}
  };
  action: "require_approval" | "auto_approve" | "deny" | "rate_limit";
  approval_chain?: string[];       // ["manager", "hr_admin", "security_officer"]
  ttl_seconds?: number;            // 60–604800 (1 min to 7 days)
  rate_limit?: {
    max_per_hour: number;
    max_per_day: number;
  };
  fallback: "REQUIRE_APPROVAL" | "DENY";  // If rule parsing fails
}
```

### Default Policies by Tier

**Starter ($49/mo):**
```json
[
  {
    "condition": { "connector_type": "*", "connector_action": "*" },
    "action": "require_approval",
    "approval_chain": ["manager"],
    "ttl_seconds": 3600
  }
]
```
All actions require manager approval. Simple, safe default.

**Growth ($149/mo):**
```json
[
  {
    "condition": { "connector_type": "azure_ad", "connector_action": "create_user" },
    "action": "require_approval",
    "approval_chain": ["manager", "hr_admin"],
    "ttl_seconds": 3600
  },
  {
    "condition": { "connector_type": "azure_ad", "connector_action": "disable_user" },
    "action": "require_approval",
    "approval_chain": ["manager", "security_officer"],
    "ttl_seconds": 1800
  },
  {
    "condition": { "connector_type": "jira", "connector_action": "create_ticket" },
    "action": "auto_approve"
  },
  {
    "condition": { "connector_type": "slack", "connector_action": "send_message" },
    "action": "auto_approve"
  }
]
```
High-risk actions need approval. Low-risk actions (ticket creation, notifications) auto-approve.

**Enterprise ($500+/mo):**
Custom policies per customer. INT configures during onboarding based on customer's security requirements.

---

## Approval Chain Mechanics

An approval chain is an ordered list of roles. Each role must approve before the step proceeds.

**Single approver:**
```json
"approval_chain": ["manager"]
```
→ Manager approves → step proceeds.

**Sequential chain:**
```json
"approval_chain": ["manager", "hr_admin"]
```
→ Manager approves first → then HR admin approves → step proceeds.
→ If manager denies → step fails (HR admin not asked).

**Escalation chain (on TTL expiry):**
```json
"approval_chain": ["manager", "director"]
```
→ Manager gets 1 hour to decide.
→ If no decision: escalate to director.
→ Director gets 30 minutes.
→ If no decision: auto-reject.

---

## TTL Mechanics

```
T+0:       Approval requested, notification sent
T+50min:   Reminder sent to current approver
T+60min:   If approval_chain has next approver → ESCALATE
           If no next approver → continue to T+90min
T+90min:   Auto-REJECT, step fails
           Audit log: "approval.expired"
           Notification to initiator: "Your request expired"
```

**TTL enforcement:**
- Cron job runs every 5 minutes checking `requested_at + ttl_seconds < now()`
- Application-level redundant check on every approval decision attempt
- ISO 8601 timestamps only (no ambiguous formats)
- Tested with clock skew ±24h to ensure correctness

**TTL boundaries:**
- Minimum: 60 seconds (prevents abuse)
- Default: 3600 seconds (1 hour)
- Maximum: 604800 seconds (7 days, Enterprise only)
- Set by policy engine, never by client request

---

## Notification Channels

### Slack Modal
```json
{
  "type": "modal",
  "title": "Approval Required",
  "blocks": [
    {
      "type": "section",
      "text": "New employee onboarding request"
    },
    {
      "type": "section",
      "fields": [
        { "text": "Requester: hr@acmecorp.com" },
        { "text": "Action: Create Azure AD user" },
        { "text": "Employee: Jane Doe" },
        { "text": "Department: Engineering" },
        { "text": "Approval ID: appr-001" }
      ]
    },
    {
      "type": "actions",
      "elements": [
        { "type": "button", "text": "Approve", "style": "primary", "action_id": "approve" },
        { "type": "button", "text": "Deny", "style": "danger", "action_id": "deny" }
      ]
    }
  ]
}
```

### Teams Adaptive Card
Similar structure adapted to Teams Adaptive Card schema. Includes approval_id for verification.

### Email (Fallback)
HTML email with approve/deny links (one-time-use tokens). Links point to control plane web UI for decision recording.

---

## Context Snapshot

When an approval is created, a read-only snapshot of the request context is stored:

```json
{
  "workflow": "onboarding_v1",
  "step": "create_azure_ad_user",
  "initiator": "hr@acmecorp.com",
  "initiated_at": "2025-02-13T10:00:00Z",
  "parameters": {
    "employee_name": "Jane Doe",
    "department": "Engineering",
    "job_title": "Software Engineer",
    "start_date": "2025-02-14",
    "manager": "john@acmecorp.com"
  },
  "previous_steps": [
    { "step": "validate_hr_record", "status": "COMPLETED" }
  ]
}
```

This snapshot is immutable — even if the underlying data changes after the approval was requested, the approver sees exactly what they approved.

---

## Safety Mechanisms

| Mechanism | Purpose | Implementation |
|-----------|---------|----------------|
| **No-match fallback** | Prevents unapproved actions when no policy matches | Default: `REQUIRE_APPROVAL`. Alert INT support for investigation. |
| **Policy validation** | Prevents malformed rules from creating gaps | JSON schema validation on policy creation. Simulate 10 test cases before activation. |
| **Approval decision audit** | Non-repudiation of who approved what | Ed25519 signature on approval record. HMAC in audit log. |
| **Context freeze** | Prevents TOCTOU (time-of-check-time-of-use) attacks | Snapshot stored at approval creation, not re-evaluated at decision time. |
| **Rate limiting** | Prevents approval flooding | Max 10 pending approvals per customer per hour. Alert on threshold. |
| **Duplicate prevention** | Prevents approving the same action twice | `approval_id` is unique. Decision endpoint returns 409 if already decided. |

---

## Testing Plan

| Test | Input | Expected | Count |
|------|-------|----------|-------|
| Single approval (happy path) | Manager approves within TTL | Step resumes, audit logged | 10 |
| Single denial | Manager denies | Step fails, initiator notified | 10 |
| TTL expiry → reminder | No decision at T+50min | Reminder sent | 5 |
| TTL expiry → escalation | No decision at T+60min | Escalated to next approver | 5 |
| TTL expiry → auto-reject | No decision at T+90min | Step fails, EXPIRED logged | 5 |
| Chain approval (2 approvers) | Manager + HR both approve | Step resumes after both | 5 |
| Chain partial deny | Manager approves, HR denies | Step fails at HR stage | 5 |
| No-match fallback | Action with no matching policy | Default REQUIRE_APPROVAL triggered | 3 |
| Duplicate decision | Approve same approval twice | 409 on second attempt | 2 |
| **Total** | | | **50** |
