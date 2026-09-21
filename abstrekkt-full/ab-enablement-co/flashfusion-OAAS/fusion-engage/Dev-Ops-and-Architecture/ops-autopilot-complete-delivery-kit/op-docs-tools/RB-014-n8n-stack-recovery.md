# RB-014 · n8n Stack Recovery After Base44 Bearer Rotation

> **Status:** Active
> **Owner:** Automation Lead (kyle@krosebrook)
> **Last reviewed:** 2026-04-18
> **Next review trigger:** Any Base44 credential rotation OR 2026-10-18

---

## TRIGGER

This runbook fires when **any** of the following are true:

- All n8n workflows in the `WIR-*` lane (4 workflows) show `status="error"` within a 5-minute window
- All n8n workflows in the `OAI-*` lane (7 workflows) show `status="error"` within a 5-minute window
- Both lanes simultaneously failing
- HTTP node responses contain `401 Unauthorized` referencing `https://app.base44.com/api/...`

If only **one** workflow is failing, use **RB-009 (Single Workflow Failure)** instead.

---

## PREREQUISITES & ACCESS

Before running this runbook, the operator must have:

- [ ] **n8n Cloud admin** at `krosebrook.app.n8n.cloud` (role: owner)
- [ ] **Base44 console** access for app `68dd8e79ca073475565c8e16` (role: admin)
- [ ] **1Password vault** read access: `ops/base44-bearer`
- [ ] Current laptop on a trusted network (not a customer site)
- [ ] No active n8n workflow editing session by another operator

If any item is missing, do not proceed. Page the Automation Lead and stop.

---

## PRE-CHECKS

Run these in order. If any fail, escalate via §ESCALATION before continuing.

**1. Confirm scope of failure**
```
n8n → Executions → filter by status=error, last 1h
```
Expected: ≥4 entries from WIR lane OR ≥7 from OAI lane within 5 min of each other.
If failures are scattered across time (>15 min spread), this is not a credential rotation event — escalate.

**2. Confirm Base44 console reachable**
```
curl -I https://app.base44.com/api/health
```
Expected: `200 OK`. If `5xx`, this is a Base44 outage, not a credential issue. Stop and check Base44 status page.

**3. Confirm 1Password Bearer matches Base44 Active Tokens**
```
Base44 console → Settings → API Tokens → Active
1Password → ops/base44-bearer → "current" field
```
Expected: hashes match (last 8 chars of token).
If mismatched: 1Password has not been updated post-rotation. **Update 1Password first** before touching n8n.

**4. Pause SCH-02 lane scheduler**
```
n8n → Workflows → SCH-02 (Lane Scheduler) → toggle Active → Inactive
```
Why: SCH-02 will retry failed workflows during recovery and create false signal. Pause for the duration of this runbook only.

---

## STEPS

> **Estimated time:** 6–12 minutes
> **Customer impact during procedure:** None (workflows already failing; this restores them)

### Step 1 — Open n8n credentials store

```
n8n → Credentials → "Base44 Bearer (prod)"
```
**Expected:** Credential entry exists, last-used timestamp within 24h.
**If missing:** Stop. The credential entry has been deleted — this is a different incident. Page Automation Lead.

### Step 2 — Replace Bearer token

1. Click the credential entry to open it
2. In the `Authorization` field, replace existing value with the format:
   ```
   Bearer <paste-from-1password-current>
   ```
3. Click **Save**

**Expected:** Save confirmation toast within 2 seconds.

### Step 3 — Test the credential

1. Click **"Test"** button next to the saved credential
2. Wait for response

**Expected output:**
```json
{ "status": "ok", "service": "base44", "version": "..." }
```
**If response is `401`:** Token is wrong. Re-check 1Password value, retry from Step 2.
**If response is `5xx`:** Base44 is down. Re-run Pre-check 2.

### Step 4 — Re-trigger one workflow per lane to verify

**WIR lane:**
```
n8n → Workflows → WIR-01 → Execute Workflow (manual trigger)
```
Wait up to 60 seconds. Expected: `status=success`, no auth errors in the execution log.

**OAI lane:**
```
n8n → Workflows → OAI-01 → Execute Workflow (manual trigger)
```
Same expectation.

**If either fails:** Stop. The credential is correct but workflows have a downstream issue. Escalate.

### Step 5 — Resume scheduler

```
n8n → Workflows → SCH-02 (Lane Scheduler) → toggle Inactive → Active
```

**Expected:** Within 5 minutes, SCH-02 begins re-running queued workflows. All previously-failed executions will re-run on their next scheduled trigger.

---

## VERIFICATION

After Step 5, monitor for **15 minutes**:

| Signal | Expected | Where |
|---|---|---|
| WIR lane error rate | 0 errors | n8n Executions filter |
| OAI lane error rate | 0 errors | n8n Executions filter |
| SCH-02 status | Active, scheduling | n8n Workflows view |
| Base44 API errors | None new | Base44 console → Logs |

**If errors persist after 15 minutes:** Move to §ROLLBACK.

---

## ROLLBACK

If Step 3 or Step 4 fail and you cannot recover:

1. Re-pause SCH-02 (`Active → Inactive`) to stop further failed runs
2. In n8n credential entry, restore previous Bearer value if you have it cached
3. If previous value not available, leave invalid credential in place — workflows will continue to fail but cleanly
4. Page the Automation Lead with:
   - Time you started this runbook
   - Step where you stopped
   - Output of failing test (Step 3 or Step 4)
   - Whether SCH-02 is currently paused

Do not attempt further Bearer manipulation. Risk of cascading failures across all dependent workflows.

---

## ESCALATION PATH

| Trigger | Who | Channel | SLA |
|---|---|---|---|
| Pre-check 3 mismatch and source unknown | Automation Lead | Slack DM + phone | 5 min |
| Step 4 verification fails after correct credential | Automation Lead + Base44 SME | Slack #ops-incidents | 10 min |
| Verification still failing after 15 min | Director + Base44 vendor support | Email + ticket | 30 min |

Roles, not people. If the Automation Lead is OOO, the secondary on-call holds the role.

---

## NOTES

- This runbook assumes Base44 Bearer rotation is the trigger. If the actual cause turns out to be different (e.g., n8n Cloud outage, network issue), document the divergence in the post-incident review and update this runbook's **TRIGGER** section if a similar pattern needs to be added.
- The 15-minute verification window is conservative. Most recoveries clear in 5–8 min. Do not shorten the window even if it looks fine — silent failures have happened.
- Related: **PM-2026-04-21** (the postmortem that prompted this runbook's creation) — review before next Bearer rotation.

---

## REVISION HISTORY

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-04-21 | 1.0 | Initial draft after WIR lane outage | Kyle R. |
| 2026-04-22 | 1.1 | Added SCH-02 pause to PRE-CHECKS | Kyle R. |
| 2026-04-25 | 1.2 | Added measurable verification table | Kyle R. |
