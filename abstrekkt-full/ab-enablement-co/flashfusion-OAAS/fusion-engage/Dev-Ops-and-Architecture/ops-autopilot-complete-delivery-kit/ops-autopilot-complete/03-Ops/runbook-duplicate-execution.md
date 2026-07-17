# Runbook: Duplicate Execution

> **Severity:** HIGH | **Detection:** Idempotency check finds existing resource after creation

## Symptoms
- Duplicate Azure AD users, Jira tickets, or Slack channels
- Step returns 409 Conflict from connector
- Audit log shows two runs with overlapping timestamps for same trigger

## Root Causes
| Cause | Detection |
|-------|-----------|
| Idempotency key collision | Two different triggers hash to same key (unlikely but possible) |
| Network retry creating duplicate POST | n8n retried after timeout, but first request succeeded |
| Race condition in concurrent runs | Two users trigger same workflow simultaneously |
| Bull queue replay after crash | Queue replays job that already completed |

## Immediate Response
1. Identify affected resources (which users/tickets/accounts were duplicated)
2. Check audit log: compare two run IDs for same trigger source
3. Determine which run is authoritative (first to complete)
4. Remove duplicate resources manually via connector (e.g., disable duplicate AD user)

## Prevention
- Idempotency checks at step level: before `create_user`, check if user exists
- Idempotency key includes timestamp bucket (not exact timestamp)
- Bull queue: `removeOnComplete: true` prevents replay of completed jobs
- Connector-level dedup: Azure AD check `GET /users?$filter=mail eq 'X'` before create
