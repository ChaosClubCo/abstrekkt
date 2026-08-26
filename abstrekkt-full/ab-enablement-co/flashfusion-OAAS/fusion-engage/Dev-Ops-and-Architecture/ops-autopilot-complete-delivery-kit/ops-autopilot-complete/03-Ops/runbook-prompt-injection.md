# Runbook: Prompt Injection Attempt

> **Severity:** MEDIUM | **Detection:** Input validation rejects non-conforming payload

## Symptoms
- Step fails with `INPUT_VALIDATION` error
- Audit log: `input.validation_failed` with `raw_input_hash`
- Pattern: multiple rejections from same source in short period

## Automated Response
1. Step fails immediately (no execution)
2. Audit log records rejection with input hash (not raw content)
3. Alert INT security team if >5 rejections in 10 minutes

## Investigation
1. Query audit log: `GET /audit?event_type=input.validation_failed&from=...`
2. Identify source: which user, which workflow, which Teams/Slack channel
3. Analyze pattern: single user experimenting vs coordinated attack
4. Check: did any injected content bypass validation? (should be zero)
5. If external source: consider IP block at Cloudflare WAF

## Escalation
- Single instance from known user: educate user, no escalation
- Repeated attempts from known user: escalate to customer IT admin
- External/unknown source: escalate to INT security lead
- Successful bypass (any execution from injected content): SEV-1, kill-switch
