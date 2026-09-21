# Incident Response — Kill-Switch & Forensics

> **Audience:** ENG, LEAD
> **Phase:** MVP (Week 2)
> **Last Updated:** 2025-02-13

---

## Response Tiers

| Tier | Trigger | Response Time | Who |
|------|---------|---------------|-----|
| **SEV-1 (Critical)** | Data breach, credential theft, kill-switch activation | 15 minutes | On-call + VP Engineering + CISO |
| **SEV-2 (High)** | Service outage, cross-tenant leak, approval bypass | 1 hour | On-call + Engineering Lead |
| **SEV-3 (Medium)** | Connector failure, performance degradation | 4 hours | On-call engineer |
| **SEV-4 (Low)** | Non-critical bug, documentation gap | 24 hours | Support queue |

---

## Kill-Switch — Automated Response

### Trigger Conditions

```
Any of these conditions → ACTIVATE KILL-SWITCH:

1. Rate anomaly: >100 failed auth attempts in 10 minutes (any customer)
2. Data anomaly: Cross-tenant query detected (RLS bypass)
3. Secret exposure: Plaintext secret detected in any log or error message
4. Audit tampering: Chain hash verification failure
5. Manual trigger: INT engineer or customer activates via API or dashboard
```

### Automated Sequence (executes in <30 seconds)

```
T+0s:    Anomaly detected by monitoring
T+1s:    Kill-switch trigger evaluation
T+2s:    All active workflows PAUSED (Bull queue: pause all jobs)
         → Every running step completes current operation then halts
         → No new runs accepted (API returns 503)
T+5s:    PagerDuty incident created (SEV-1)
         → On-call engineer paged
         → VP Engineering notified
T+10s:   API tokens for affected scope revoked
         → New tokens required after resolution
T+15s:   Evidence preservation
         → Snapshot: all runs in last 1 hour
         → Snapshot: audit log entries in last 1 hour
         → Snapshot: Bull queue state
         → Snapshot: Redis state
T+20s:   Customer notification
         → Email to IT admin: "Service paused due to security event"
         → Slack/Teams: Status update in customer channels
T+30s:   INT support team alert
         → Slack: #incidents channel
         → All relevant dashboards linked
```

### Manual Response (within 30 minutes of kill-switch)

```
1. ASSESS (5 minutes)
   - Review kill-switch trigger (which condition fired?)
   - Check audit log: what happened in the last 30 minutes?
   - Check affected customers: how many impacted?
   - Check data exposure: any secrets or PII leaked?

2. CONTAIN (10 minutes)
   - If credential theft: rotate all affected secrets
   - If cross-tenant leak: identify which customers affected
   - If n8n compromise: isolate affected instance (kill tunnel)
   - If API abuse: block source IP at Cloudflare WAF

3. INVESTIGATE (15 minutes — can extend)
   - Root cause analysis using audit log + Jaeger traces
   - Determine: was this intentional attack or system bug?
   - Determine: what data was accessed/modified?
   - Document timeline (hour-by-hour)

4. RESOLVE
   - Deploy fix (hot-fix if code change needed)
   - Verify fix in staging
   - Deploy to production
   - Run RLS test suite
   - Run audit chain verification

5. RESUME
   - Deactivate kill-switch
   - Paused runs auto-resume (Bull queue replays)
   - API accepts new requests
   - Verify: 10 workflow executions succeed

6. COMMUNICATE
   - Customer notification: what happened, what we did, what's different now
   - Internal post-mortem (within 48 hours)
   - Regulatory notification if required (GDPR: 72 hours)
```

---

## Forensics Procedure

### Evidence Collection

```
When: Immediately after containment (before any system changes)

Collect:
1. Audit log export (full customer, last 7 days)
   → Format: JSON, signed with current HMAC key
   → Store: Separate S3 bucket, write-once policy

2. Run/Step records (affected runs)
   → All runs in affected time window
   → All steps with status, timing, error details

3. Approval records (affected period)
   → All decisions, including context snapshots
   → Verify: no unauthorized approvals

4. n8n logs (from customer environment)
   → Request from customer (INT cannot access directly)
   → Docker container logs, Redis state, Bull queue

5. Network logs (Cloudflare)
   → Tunnel connection logs
   → WAF blocks and rate limit events
   → Source IPs for affected period

6. Infrastructure logs (Vercel, Supabase)
   → API request logs
   → Database query logs (slow query, error)
   → Deployment history
```

### Analysis Framework

```
Question 1: WHO performed the action?
  → actor_id in audit log
  → JWT claims (customer_id, role)
  → IP address + user agent
  → Correlation with known service accounts

Question 2: WHAT was accessed or modified?
  → resource_type + resource_id in audit log
  → change_delta shows before/after
  → Secret access: check secret_registry for rotation events
  → Cross-reference with connector calls

Question 3: WHEN did it happen?
  → Audit log timestamps (verified by HMAC)
  → Chain hash ordering (detect inserted/deleted entries)
  → Jaeger trace timeline

Question 4: HOW did it happen?
  → Attack vector identification
  → Code path analysis
  → Configuration review
  → Third-party service investigation

Question 5: WHAT is the blast radius?
  → Affected customers (check RLS isolation)
  → Affected secrets (check rotation needed)
  → Affected data (check PII exposure)
  → Compliance implications (GDPR, SOC2)
```

---

## Incident Communication Templates

### Customer Notification (Initial)

```
Subject: [Ops Autopilot] Service Event — Workflows Temporarily Paused

We detected unusual activity in our platform at [TIME] and have temporarily
paused all workflow execution as a precaution. Your data remains secure.

What happened: [Brief, factual description]
What we're doing: Our engineering team is investigating and will resume service
as soon as we've verified system integrity.
Your action needed: None at this time. We will update you within [1 hour / 4 hours].

Status page: [URL]
```

### Customer Notification (Resolution)

```
Subject: [Ops Autopilot] Service Restored — Incident Summary

Workflows have been resumed as of [TIME]. All systems are operating normally.

Root cause: [1-2 sentence explanation]
Impact: [What was affected, what was not]
Data exposure: [None / Description of any exposure]
Actions taken: [What we fixed]
Prevention: [What we're doing to prevent recurrence]

Full post-mortem will be shared within 48 hours.
```

---

## Post-Mortem Template

```markdown
# Incident Post-Mortem: [Title]

**Date:** [Date]
**Duration:** [Start time — End time]
**Severity:** SEV-[1/2/3/4]
**Affected customers:** [Count and scope]
**Author:** [Name]

## Timeline
- HH:MM — [Event]
- HH:MM — [Event]
- HH:MM — [Resolution]

## Root Cause
[Detailed technical explanation]

## Impact
- Workflows paused: [count]
- Data exposure: [none / description]
- Customer impact: [description]

## Resolution
[What was done to fix the immediate issue]

## Action Items
| # | Action | Owner | Deadline | Status |
|---|--------|-------|----------|--------|
| 1 | [Fix] | [Name] | [Date] | ☐ |
| 2 | [Prevention] | [Name] | [Date] | ☐ |

## Lessons Learned
[What we'll do differently]
```

---

## Kill-Switch Drill Schedule

| Drill | Frequency | Scenario | Success Criteria |
|-------|-----------|----------|-----------------|
| Full kill-switch | Monthly | Simulated rate anomaly | All workflows pause <30s, resume <5min |
| Partial kill-switch | Monthly | Single customer isolation | Only target customer paused, others unaffected |
| Forensics drill | Quarterly | Mock investigation | Evidence collected within 1 hour |
| Communication drill | Quarterly | Mock customer notification | Notification sent within 15 minutes |
| Recovery drill | Quarterly | Database restore from backup | RTO <1hr, RPO <5min verified |
