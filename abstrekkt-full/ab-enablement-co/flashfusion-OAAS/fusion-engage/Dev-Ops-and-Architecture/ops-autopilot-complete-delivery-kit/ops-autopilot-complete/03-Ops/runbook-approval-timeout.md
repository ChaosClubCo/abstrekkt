# Runbook: Approval Timeout

> **Severity:** MEDIUM | **Detection:** Cron job (every 5 min) finds expired approvals

## Symptoms
- Workflow stuck in `WAITING_FOR_APPROVAL` for >1 hour
- Prometheus: `ops_approval_pending` increasing without corresponding decisions
- Customer reports: "onboarding is stuck"

## Automated Response
1. T+50min: Reminder sent to current approver (Slack/Teams/email)
2. T+60min: Escalate to next approver in chain (if exists)
3. T+90min: Auto-reject, step fails with `APPROVAL_EXPIRED`
4. Notification to workflow initiator: "Your request expired"

## Manual Recovery
1. Check if approver received notification: verify `notification_message_id` in approval record
2. If notification failed: resend manually, check Slack/Teams bot health
3. If approver unavailable: IT admin can decide (it_admin role has global approval rights)
4. Initiator can re-trigger the workflow to create a new run
5. If systemic (all approvals timing out): check cron job health, TTL calculation

## Prevention
- Configure multiple notification channels (Slack + email fallback)
- Set appropriate TTL per workflow (password reset: 30min, onboarding: 4hr)
- Train managers on approval process during onboarding
- Monitor `ops_approval_response_seconds` for trending slow

## Root Causes
| Cause | Fix |
|-------|-----|
| Manager on PTO | Add backup approver to chain |
| Notification lost | Check Slack/Teams webhook health |
| TTL too short | Adjust policy (minimum 60s) |
| Cron job failed | Check cron health, restart if needed |
