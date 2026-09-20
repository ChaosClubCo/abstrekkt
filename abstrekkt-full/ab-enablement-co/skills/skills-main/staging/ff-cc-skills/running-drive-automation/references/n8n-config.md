# Chain 1 — n8n Drive Router Config

**Load this file when:** Configuring Chain 1, debugging a webhook failure, updating trigger conditions, adding new routing rules, or understanding the node-by-node flow.

> **[GENERATED] Notice:** Webhook URL, auth token, and node IDs below are placeholders. Replace with actuals from `krosebrook.app.n8n.cloud` → Workflows → "Drive Router Chain 1".

---

## Table of Contents
- [Workflow Identity](#workflow-identity)
- [Webhook Trigger Config](#webhook-trigger-config)
- [Node Map](#node-map)
- [Routing Rules Table](#routing-rules-table)
- [Manual Trigger (Batch)](#manual-trigger-batch)
- [Error Handling](#error-handling)
- [Deployment Notes](#deployment-notes)

---

## Workflow Identity

| Field | Value |
|---|---|
| Workflow name | Drive Router Chain 1 [GENERATED - verify in n8n] |
| n8n instance | `krosebrook.app.n8n.cloud` |
| Source file | `personal/drive-automation/chain1_drive_router.n8n.json` |
| Status required | **Active** (verify before any manual trigger) |
| Last known export | `chain1_drive_router.n8n.json` (32KB — push via git, not Zapier) |

---

## Webhook Trigger Config

```bash
# Trigger Chain 1 manually (one-off or batch)
curl -X POST <CHAIN1_WEBHOOK_URL> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <N8N_WEBHOOK_TOKEN>" \
  -d '{
    "trigger": "manual",
    "folder_id": "<DRIVE_INBOX_FOLDER_ID>",
    "run_id": "<YYYY-MM-DD-HHmm>"
  }'
```

> **[GENERATED]** Replace `<CHAIN1_WEBHOOK_URL>` and `<N8N_WEBHOOK_TOKEN>` with values from:
> `krosebrook.app.n8n.cloud` → Workflow → Settings → "Webhook URL" and environment variables.

**Auth method:** Bearer token in `Authorization` header [GENERATED — verify; may be basic auth or API key instead]

**Expected response:**
```json
{
  "status": "accepted",
  "execution_id": "<n8n_execution_id>",
  "run_id": "<run_id>"
}
```

---

## Node Map

Chain 1 executes in this order. Node names are [GENERATED] — verify against actual workflow JSON.

```
[Webhook Trigger]
      │
      ▼
[Google Drive: List Files in Inbox Folder]
      │ (for each file)
      ▼
[Set: Normalize File Metadata]
  (file_id, name, mime_type, path, modified_time)
      │
      ▼
[Switch: MIME Type Classifier]
  ├─ Google Docs → "documents"
  ├─ Google Sheets → "spreadsheets"
  ├─ Google Slides → "presentations"
  ├─ PDF → "pdf"
  ├─ Image → "media"
  ├─ Video → "media"
  ├─ Folder → "skip"
  └─ Other → "uncategorized"
      │
      ▼
[Switch: Routing Rules]
  (matches by category + name pattern)
  ├─ Projects → /Projects/Active/<ProjectCode>/
  ├─ Finance → /Finance/<YYYY>/
  ├─ Reference → /Reference/<Category>/
  ├─ Archive → /Archive/<YYYY>/
  ├─ Media → /Media/<Category>/
  └─ Uncategorized → /Inbox/_Review/
      │
      ▼
[Google Drive: Move File to Destination]
      │
      ▼
[Supabase: Insert into file_audit]
  (file_id, original_path, destination_path, classification,
   routing_rule, run_id, status="ROUTED", created_at)
      │
      ▼
[Respond to Webhook: { status: "complete" }]
```

---

## Routing Rules Table

[GENERATED] Rules below inferred from system context. Verify/expand in actual workflow.

| Rule Name | Match Condition | Destination |
|---|---|---|
| `active-project` | Name contains project code pattern OR path starts with `/Inbox/Projects/` | `/Projects/Active/<ProjectCode>/` |
| `finance-doc` | Name contains `invoice`, `receipt`, `statement`, `budget` | `/Finance/<YYYY>/` |
| `meeting-notes` | Name contains `meeting`, `notes`, `agenda`, `recap` + Docs MIME | `/Reference/Meetings/<YYYY>/` |
| `media-file` | MIME type = image/* or video/* | `/Media/<Category>/` |
| `reference-doc` | Name contains `guide`, `reference`, `spec`, `docs` | `/Reference/<Category>/` |
| `archive-candidate` | Modified > 365 days ago AND not in /Projects/ | `/Archive/<YYYY>/` |
| `fallback` | No rule matched | `/Inbox/_Review/` |

---

## Manual Trigger (Batch)

To route a specific list of files (not the whole inbox folder):

```bash
curl -X POST <CHAIN1_WEBHOOK_URL> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <N8N_WEBHOOK_TOKEN>" \
  -d '{
    "trigger": "batch",
    "file_ids": ["<file_id_1>", "<file_id_2>"],
    "run_id": "manual-<YYYY-MM-DD>"
  }'
```

[GENERATED] Verify that Chain 1 supports `file_ids` array mode — may require separate workflow or an additional switch node.

---

## Error Handling

Common failure modes and recovery:

| Error | Likely Cause | Fix |
|---|---|---|
| `401 Unauthorized` | Webhook token expired or wrong header | Rotate token in n8n env vars; update `.env` locally |
| `404 on webhook URL` | Workflow is inactive or URL changed | Activate workflow in n8n dashboard; re-copy webhook URL |
| Drive move fails | File already in destination or permissions | Check Drive permissions; verify destination folder exists |
| Supabase insert fails | Migration not run or wrong project URL | Run `supabase_migration.sql`; verify `.env` SUPABASE_URL |
| Execution times out | Inbox folder has 100+ files | Batch into smaller chunks (≤ 25 files per trigger) |

---

## Deployment Notes

- **Exporting the workflow:** `krosebrook.app.n8n.cloud` → Workflow → Export → JSON → save as `chain1_drive_router.n8n.json`
- **Importing after changes:** Import JSON via n8n UI; re-verify all credentials (Google Drive OAuth, Supabase) after import
- **Credential IDs change on import** — always re-link OAuth nodes after a fresh import
- **32KB file** — cannot be updated via Zapier `github_create_or_update_file`. Always `git push` locally.
