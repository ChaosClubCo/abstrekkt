# Enablement Suite — Deployment Gate & Data-Loss Warning

> **Insert this at the top of `00-suite-README.md`, above "Deployment Order."**
> It documents a hard platform dependency the README currently omits.
> Status: verified against support.claude.com (March 2026 articles).

---

## ⛔ READ BEFORE DEPLOYING THE SUITE

The 7-artifact suite is architected entirely on `window.storage` (Anthropic
Artifacts persistent storage). Three platform facts govern whether it works
at all. None of them are optional.

### Fact 1 — Storage only works on PUBLISHED artifacts

> *"Persistent storage is only available for published artifacts. During
> development and testing, storage operations will not succeed until the
> artifact is published."* — support.claude.com [SOURCED]

**Consequence:** An unpublished artifact, or raw `.jsx` shared as code,
**fails every read and write silently.** The intake form will appear to
work, then lose the record. The prompt builder will find nothing. The
health report will aggregate zero.

**Gate:** Every artifact (`01`–`07`, plus `00`) MUST be individually
published before the program runs. There is no "test mode" that persists.

### Fact 2 — Unpublishing permanently destroys all stored data

> *"Unpublishing also permanently deletes all associated storage data
> (both personal and shared) if the artifact used persistent storage.
> Once you unpublish an artifact, you cannot publish that same artifact
> again."* — support.claude.com [SOURCED]

**Consequence:** Unpublishing the accountability tracker mid-cohort
**irreversibly deletes every check-in record.** You also cannot republish
the same artifact — you would ship a new URL, orphaning every bookmark,
every employee's saved progress, and every link embedded in n8n nudges.

**Gate:** Treat publish as one-way for the life of a cohort. Do not
unpublish a live suite artifact. If a fix is required, ship a NEW versioned
artifact and migrate intentionally — never unpublish the running one.

### Fact 3 — Team/Enterprise artifacts are org-locked

> *"Artifacts created on Team or Enterprise accounts can only be shared
> within your organization—they cannot be published publicly."*
> — support.claude.com [SOURCED]

**Consequence:** If the suite is built and published from an INT
Team/Enterprise account, it is internal-only and **cannot be delivered to
an external consulting client.** External delivery requires rebuilding and
publishing from a Free/Pro/Max account, which forfeits the org boundary.

**Gate:** Decide account provenance per audience BEFORE building.
INT-internal → INT org account (secure, org-locked). External/portable
→ separate Pro/Max account (publicly shareable, no org boundary). A single
build cannot serve both.

---

## Required Backup Architecture (currently missing)

`00-suite-README.md` "What's Not Built" admits: *"Auto-save to Notion —
all storage is local to the artifact."* The n8n automations
(CRON #6 nudge, API #9 escalation, health reports) query
`NOTION_ENABLEMENT_DB_ID`. **If no MCP push wires `window.storage` →
Notion, the automations read an empty database.** [GENERATED — inferred
from README + n8n routine env vars; verify by inspecting whether any
artifact actually calls the Notion MCP connector on write.]

Two options to close this — pick one before next cohort:

**Option A — Notion as system of record (recommended).**
Add a Notion MCP write call in `01-intake-form` (on submit),
`04-outcome-tracker` (on save), `05-accountability-tracker` (on check-in).
`window.storage` becomes a fast local cache; Notion is durable truth.
Survives unpublish. n8n automations have real data to query.
Job size: M. Touches 3 artifacts.

**Option B — Scheduled export.**
Add an "Export All" button to `07-program-health-report` that serializes
every storage key to downloadable JSON. Run it weekly, store off-platform.
Cheaper to build (1 artifact, S) but manual and lossy between exports.

**Do not run another cohort on storage-only.** Unpublish risk + empty-Notion
risk compound into total program-data loss with no recovery path.

---

## Corrected Storage Schema Note

`00-suite-README.md` states: *"Keys are scoped — no cross-contamination
between artifacts."* This is true but easily misread. Clarification:

- Scoping is **per key, within one user's storage namespace** — it prevents
  artifact A's `intake-records-v1` from colliding with artifact B's keys.
- It is **NOT cross-user isolation.** `shared:true` storage is one global
  pool every visitor reads and writes. Personal storage is per-user but
  still requires that user to have opened the published artifact.
- **Facilitator/employee handoff caveat:** the intake→prompt-builder chain
  only works if the SAME account opens both artifacts. A facilitator on
  their machine and an employee on theirs write to different namespaces.
  The documented "BEFORE SESSION" flow assumes single-operator use — make
  this explicit in facilitator training. [GENERATED — derived from
  per-user personal storage scope; confirm with a two-device test.]

---

## Deployment Checklist (replaces ad-hoc deploy)

- [ ] Account provenance decided (INT org vs. portable Pro/Max) — Fact 3
- [ ] Backup architecture chosen and built (Option A or B) — before cohort
- [ ] All of `00`–`07` individually published — Fact 1
- [ ] Published URLs recorded in a durable location off-platform
- [ ] "Do not unpublish" written into the runbook — Fact 2
- [ ] Two-device handoff test passed (facilitator writes, confirm read path)
- [ ] n8n `NOTION_ENABLEMENT_DB_ID` confirmed receiving live records
- [ ] Model strings in `02`/`06`/`07` checked against current API (see fix #4)
