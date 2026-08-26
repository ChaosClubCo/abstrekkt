# Runbook: n8n Instance Unreachable

> **Severity:** HIGH | **Detection:** Health check fails for 10+ minutes

## Symptoms
- `ops_n8n_health{customer_id="X"} == 0` for 10 min
- All workflows for customer stuck/failing
- Cloudflare Tunnel reports connection lost

## Automated Response
1. Mark all active runs PAUSED
2. Retry health check every 5 min for 1 hour
3. Alert customer IT admin + INT on-call
4. If restored within 1hr: auto-resume paused runs via Bull queue replay

## Manual Recovery
1. **Customer checks:** Docker running? `docker ps | grep n8n`. Disk full? `df -h`. Memory? `free -m`. Logs? `docker logs n8n --tail 100`
2. **Common fixes:** Restart container: `docker restart n8n`. Clear disk: remove old logs. Increase memory allocation.
3. **INT support (with consent):** SSH tunnel to customer n8n, run diagnostics, restart services
4. **If unrecoverable:** Redeploy from Docker Compose template, re-import workflow definitions, verify connectors, test end-to-end

## Resume Procedure
1. Control plane detects health check success
2. All PAUSED runs auto-resume
3. Bull queue replays queued jobs
4. Verify: 5 workflow executions succeed
5. Close incident

## Prevention
- Docker health check in compose file
- Resource monitoring on n8n host (disk, memory, CPU)
- Customer training: basic Docker troubleshooting
- Fallback: INT-managed hosting option (Enterprise)
