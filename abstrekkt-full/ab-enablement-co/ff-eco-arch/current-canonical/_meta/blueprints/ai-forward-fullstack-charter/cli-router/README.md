# CLI Router (Agent Gateway)

Single gateway every agent call passes through. Closes three gaps at once: no rate
limiting/failover, no quota governance, and no agent-conflict resolution.

## Responsibilities
1. **Rate limiting** — per-agent and global token-bucket limits.
2. **Quota enforcement** — per-agent daily budget; feeds `cost-monitoring.yml`.
3. **Failover** — if a provider/agent is down, route to a configured fallback.
4. **File-lease lock** — one writer per file at a time; others queue (stops two
   agents editing the same file).
5. **Kill switch** — revoke a token + pause a queue on runaway behavior.

## Config (sketch)
```jsonc
{
  "agents": {
    "claude":   { "dailyUsd": 50, "rps": 2, "fallback": "gemini" },
    "gemini":   { "dailyUsd": 30, "rps": 2, "fallback": null },
    "copilot":  { "dailyUsd": 20, "rps": 5, "fallback": null }
  },
  "fileLease": { "ttlSeconds": 900 }
}
```

## Scripts (referenced by workflows)
- `scripts/fetch-spend.sh` — emits per-agent spend JSON for cost-monitoring.
- `scripts/kill-switch.sh <agent...>` — revoke tokens + pause queues.

## Open risk
AntiGravity's real concurrent-job ceiling is UNVERIFIED — the router throttles
global concurrency until it's benchmarked (see README CLAIMS CHECK).
