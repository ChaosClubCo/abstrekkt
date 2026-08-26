# Supabase Schema — Drive Automation Audit

**Load this file when:** Querying the audit log, running migrations, debugging missing rows, verifying table structure, or writing new queries against `file_audit` or `council_memos`.

> ⚠ **Lane rule (non-negotiable):** Personal drive automation uses a **dedicated** Supabase project — NOT `oorstbwcydxwiojrsoim` (Intinc). Verify `SUPABASE_URL` in `.env` before any operation.

---

## Table of Contents
- [Project Identity](#project-identity)
- [Tables](#tables)
  - [file_audit](#file_audit)
  - [council_memos](#council_memos)
- [RLS Policies](#rls-policies)
- [Common Queries](#common-queries)
- [Migration Instructions](#migration-instructions)

---

## Project Identity

| Field | Value |
|---|---|
| Project | Personal Drive Automation (dedicated) |
| Intinc project (DO NOT USE here) | `oorstbwcydxwiojrsoim` |
| Migration source | `personal/drive-automation/supabase_migration.sql` (7.6KB — push via git) |
| Required tables | `file_audit`, `council_memos` |

Verify correct project before any operation:
```sql
-- Should return your personal project name, NOT Intinc
SELECT current_database();
```

---

## Tables

### file_audit

Logs every file processed by Chain 1 (Drive Router) and Chain 2 (Agent Council).

```sql
CREATE TABLE file_audit (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id          TEXT NOT NULL,
  file_id         TEXT NOT NULL,
  file_name       TEXT NOT NULL,
  original_path   TEXT,
  destination_path TEXT,
  classification  TEXT,
  routing_rule    TEXT,
  status          TEXT NOT NULL CHECK (status IN (
                    'ROUTED', 'COUNCIL_QUEUED', 'COUNCIL_COMPLETE',
                    'DRIFT', 'REVIEW', 'ERROR'
                  )),
  error_message   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common lookups
CREATE INDEX idx_file_audit_run_id ON file_audit(run_id);
CREATE INDEX idx_file_audit_file_id ON file_audit(file_id);
CREATE INDEX idx_file_audit_status ON file_audit(status);
```

**Status values:**

| Status | Meaning |
|---|---|
| `ROUTED` | Chain 1 moved the file successfully |
| `COUNCIL_QUEUED` | File is in the council run manifest |
| `COUNCIL_COMPLETE` | All 10 crews have evaluated; memo written |
| `DRIFT` | File moved or changed classification since last run |
| `REVIEW` | Router or crew could not confidently decide; needs human |
| `ERROR` | Processing failed; see `error_message` |

---

### council_memos

One row per file per council run. Written by Crew 10 (Memo Synthesizer).

```sql
CREATE TABLE council_memos (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id                TEXT NOT NULL,
  file_id               TEXT NOT NULL,
  file_name             TEXT NOT NULL,

  -- Crew outputs (stored as JSONB for flexibility)
  classification        JSONB,   -- Crew 1 output
  routing               JSONB,   -- Crew 2 output
  duplicate_status      JSONB,   -- Crew 3 output
  freshness             JSONB,   -- Crew 4 output
  privacy_risk          JSONB,   -- Crew 5 output
  naming_compliance     JSONB,   -- Crew 6 output
  ownership_flags       JSONB,   -- Crew 7 output
  archive_recommendation JSONB,  -- Crew 8 output
  action_plan           JSONB,   -- Crew 9 output

  -- Synthesized summary (Crew 10)
  overall_status        TEXT CHECK (overall_status IN ('CLEAN', 'NEEDS_ATTENTION', 'CRITICAL')),
  human_review_required BOOLEAN DEFAULT FALSE,
  crew_contradictions   JSONB DEFAULT '[]',

  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_council_memos_run_id ON council_memos(run_id);
CREATE INDEX idx_council_memos_file_id ON council_memos(file_id);
CREATE INDEX idx_council_memos_status ON council_memos(overall_status);
CREATE INDEX idx_council_memos_review ON council_memos(human_review_required)
  WHERE human_review_required = TRUE;
```

---

## RLS Policies

[GENERATED] RLS policies below are recommended defaults. Verify actual policies in Supabase Dashboard → Authentication → Policies.

```sql
-- Enable RLS on both tables
ALTER TABLE file_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE council_memos ENABLE ROW LEVEL SECURITY;

-- Personal project: allow all ops for authenticated user only
-- (single-user personal project — no multi-tenant isolation needed)
CREATE POLICY "Personal owner full access" ON file_audit
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Personal owner full access" ON council_memos
  FOR ALL USING (auth.role() = 'authenticated');

-- Service role (used by agent_council.py and n8n) bypasses RLS by default
-- Verify: Supabase Dashboard → Settings → API → service_role key is in .env, NOT exposed client-side
```

---

## Common Queries

**See the last 20 processed files:**
```sql
SELECT file_name, classification, status, created_at
FROM file_audit
ORDER BY created_at DESC
LIMIT 20;
```

**See all files from a specific run:**
```sql
SELECT * FROM file_audit
WHERE run_id = '2026-04-08-001'
ORDER BY created_at;
```

**Find all files needing human review:**
```sql
SELECT fa.file_name, cm.overall_status, cm.crew_contradictions
FROM file_audit fa
JOIN council_memos cm ON fa.file_id = cm.file_id
WHERE fa.status = 'REVIEW'
   OR cm.human_review_required = TRUE
ORDER BY cm.created_at DESC;
```

**Find all DRIFT flags:**
```sql
SELECT file_id, file_name, original_path, destination_path, created_at
FROM file_audit
WHERE status = 'DRIFT'
ORDER BY created_at DESC;
```

**Find all CRITICAL council memos:**
```sql
SELECT run_id, file_name, action_plan, crew_contradictions
FROM council_memos
WHERE overall_status = 'CRITICAL'
ORDER BY created_at DESC;
```

**Verify tables exist (smoke test query):**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('file_audit', 'council_memos');
-- Expected: 2 rows
```

---

## Migration Instructions

Run migration on the **personal** Supabase project only.

```bash
# Via Supabase CLI
supabase db push --db-url <PERSONAL_SUPABASE_DB_URL>

# Or via psql
psql <PERSONAL_SUPABASE_DB_URL> -f personal/drive-automation/supabase_migration.sql

# Verify after migration
psql <PERSONAL_SUPABASE_DB_URL> -c "\dt"
# Expected: file_audit, council_memos (plus any auth tables)
```

**Never run against `oorstbwcydxwiojrsoim`.** If you're unsure which URL you're connected to, stop and check `.env` first.
