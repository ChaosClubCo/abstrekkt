---
name: running-drive-automation
description: >
  Operates the Drive Automation Chain 1+2 system — a multi-agent Google Drive
  classification and routing pipeline backed by a Supabase audit trail. Activates
  when the user wants to classify, route, or organize Google Drive files; invoke
  the agent council; run the drive router; check for file drift; trigger smoke
  tests; view the Supabase audit log; or work with any component of the personal
  drive automation system. Also triggers on: organize my drive, run the council,
  classify these files, drive drift, agent council, chain 1, chain 2, drive router,
  run smoke test, check drive audit, council memo, n8n drive workflow, supabase
  drive, CrewAI council, fire up the council, batch classify, council throughput,
  asyncio parallel, drive pipeline, file routing, drive inbox. Always use this
  skill before touching any part of the drive automation system — even if the
  request seems simple (e.g., "check the audit log", "did the router run?").
compatibility:
  tools: [bash, google_drive_search, google_drive_fetch]
  dependencies: [n8n, CrewAI, Supabase, Python 3.11+]
  mcp_servers: [n8n, Google Drive]
metadata:
  version: "2.0.0"
---

# Running Drive Automation

**TL;DR:** Chain 1 (n8n) classifies + routes incoming Drive files automatically. Chain 2 (10 CrewAI crews in `agent_council.py`) performs deep per-file evaluation and writes structured memos. Supabase logs every action. Smoke tests gate production runs. This skill guides both operational execution and diagnostic troubleshooting.

---

## Decision Tree

```
What do you need?
  ├─ Route a batch of new files ──────────► Chain 1 — see §Golden Path: Chain 1
  ├─ Deep evaluation on files ────────────► Chain 2 Council — see §Golden Path: Council
  ├─ Check for file drift ────────────────► Drift Watcher — see §Golden Path: Drift
  ├─ Verify pipeline health ──────────────► Smoke Tests — see §Smoke Test Protocol
  ├─ View what happened to a file ────────► Supabase audit — see references/supabase-schema.md
  ├─ Understand crew roles/behavior ──────► See references/crews.md
  ├─ Configure n8n Chain 1 ───────────────► See references/n8n-config.md
  └─ Apply asyncio throughput fix ────────► See references/asyncio-fix.md
```

---

## System Map

| Component | Location | Purpose |
|---|---|---|
| Chain 1 — Drive Router | `krosebrook.app.n8n.cloud` → `chain1_drive_router.n8n.json` | Watches Drive, classifies files, routes to destination folders |
| Chain 2 — Agent Council | `personal/drive-automation/agent_council.py` | 10 CrewAI crews evaluate each file; produces structured memo |
| Supabase Audit | `personal/drive-automation/supabase_migration.sql` | Schema: `file_audit` + `council_memos` tables |
| Smoke Tests | `personal/drive-automation/smoke_test.py` | End-to-end validation; all must PASS before production |
| Drift Watcher | Embedded in `agent_council.py` | Detects files that moved or changed classification since last run |

**⚠ Lane rule:** Personal drive automation uses a **dedicated** Supabase project. Never route through `oorstbwcydxwiojrsoim` (Intinc). Verify `.env` `SUPABASE_URL` before any Supabase op.

**⚠ Large-file rule:** Files >3KB (`agent_council.py` 22K, `chain1_drive_router.n8n.json` 32K, `supabase_migration.sql` 7.6K, `smoke_test.py` 7.9K) must be pushed via `git push` locally — Zapier's `github_create_or_update_file` times out above 3KB.

---

## Golden Path: Chain 1 (Route New Files)

```bash
# 1. Verify Chain 1 is active in n8n dashboard
#    krosebrook.app.n8n.cloud → Workflows → "Drive Router Chain 1" → Status: Active

# 2. Trigger via webhook (see references/n8n-config.md for full URL + auth headers)
curl -X POST <CHAIN1_WEBHOOK_URL> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <N8N_WEBHOOK_TOKEN>" \
  -d '{"trigger": "manual", "folder": "<DRIVE_INBOX_FOLDER_ID>"}'

# 3. Monitor execution in n8n execution log
# 4. Verify results in Supabase file_audit table
#    SELECT * FROM file_audit ORDER BY created_at DESC LIMIT 20;
```

→ Full webhook config, auth, node map: **references/n8n-config.md**

---

## Golden Path: Chain 2 (Agent Council)

```bash
# Pre-flight: run smoke tests first — NEVER skip
python personal/drive-automation/smoke_test.py
# Expected: all PASS. One FAIL = stop and debug before proceeding.

# Build manifest
MANIFEST='{
  "run_id": "'$(date +%Y-%m-%d-%H%M)'",
  "items": [
    {"file_id": "...", "name": "...", "mime_type": "...", "path": "..."}
  ]
}'

# POST to council endpoint
curl -X POST https://<COUNCIL_HOST>/council \
  -H "Content-Type: application/json" \
  -d "{\"manifest\": $MANIFEST}"

# Poll Supabase for memo results
# SELECT * FROM council_memos WHERE run_id = '<run_id>';
```

**If batch > 5 files:** Apply the asyncio parallel fix first → **references/asyncio-fix.md**
**Council crew behavior:** → **references/crews.md**
**Or use the script wrapper:** `bash scripts/run_council.sh`

→ For quick execution without manual curl: `bash scripts/run_council.sh --manifest <path_to_manifest.json>`

---

## Golden Path: Drift Check

```bash
# Drift watcher runs inside agent_council.py when invoked with --drift flag
python personal/drive-automation/agent_council.py --drift-check

# Output: files flagged with [DRIFT] have changed classification or path since last run
# Review each DRIFT entry before re-routing — don't auto-re-route drift without review
```

---

## Smoke Test Protocol

Run before **every** production council batch. Never skip.

```bash
cd personal/drive-automation/
python smoke_test.py

# Expected output (all lines must read PASS):
# [PASS] Chain 1 webhook reachable
# [PASS] Supabase connection (personal project)
# [PASS] file_audit table exists
# [PASS] council_memos table exists
# [PASS] agent_council.py imports cleanly
# [PASS] Sample crew instantiation
# [PASS] Drift watcher init

# Any FAIL: stop. Do not run production batch until resolved.
```

---

## Self-Verification Checklist

Before invoking the council on a real batch:
- [ ] `personal/drive-automation/` files are current in GitHub (all 4 large files pushed locally via `git push`)
- [ ] Supabase migration has run on **personal** project (`file_audit`, `council_memos` tables exist)
- [ ] `.env` `SUPABASE_URL` points to personal project (NOT `oorstbwcydxwiojrsoim`)
- [ ] `smoke_test.py` passes with 0 failures
- [ ] Chain 1 n8n workflow is Active and webhook is live
- [ ] If batch > 5 files: asyncio parallel fix applied (see `references/asyncio-fix.md`)
- [ ] `COUNCIL_HOST` env var is set and `/council` endpoint is reachable

---

## Reference Layer

| File | Load when... |
|---|---|
| `references/crews.md` | Running council; need to understand crew roles, tweak behavior, or debug a specific crew output |
| `references/n8n-config.md` | Configuring Chain 1, debugging webhook, updating trigger conditions or node logic |
| `references/supabase-schema.md` | Querying audit log, running migrations, understanding table structure or RLS |
| `references/asyncio-fix.md` | Batch > 5 files; applying or reverting parallel throughput improvement |

---

## Key Constraints Summary

1. **Supabase lane isolation** — personal ≠ Intinc (`oorstbwcydxwiojrsoim`). Cross-contamination breaks audit trails.
2. **RPM cap** — 10 crews × LLM calls. Default model: Haiku. Cap `ThreadPoolExecutor` at 5 workers.
3. **Smoke-gate** — `smoke_test.py` must fully PASS before any production run. One FAIL = debug first.
4. **Git-push for large files** — 4 files exceed Zapier's 3KB limit. Always push locally.
5. **Drift review before re-route** — DRIFT flags require manual review, not automatic re-routing.


---

## CLAIMS
<!-- [SOURCED] or [GENERATED] labels for assertions in this skill. None yet — footer added by audit fix pass. -->

## COUNTEREXAMPLE
<!-- Known cases where this skill should NOT activate or may produce wrong output -->

## CONTRADICTIONS
<!-- ! Conflicts with other skills or system prompts -->
