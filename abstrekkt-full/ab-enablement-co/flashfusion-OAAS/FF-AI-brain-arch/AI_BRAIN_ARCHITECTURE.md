---
title: AI Brain Architecture
tags: [architecture, ai-brain, mcp, n8n, claude-code, spec]
status: active
created: 2026-05-04
version: "1.0.0"
author: Kyle Rosebrook
---

# AI Brain Architecture
> **Context-persistent, multi-layer AI automation bridging Obsidian, n8n, and Claude Code — with safety gates to prevent unreviewed autonomous changes.**

---

## Status Board
```dataview
TABLE status, created, version
FROM "SPECS"
WHERE title = "AI Brain Architecture"
```

---

## Architecture Overview

Your Obsidian MCP connection being live means the local filesystem bridge is already solved. The updated architecture removes filesystem polling entirely — Claude reads and writes vault files directly through MCP. n8n listens to GitHub instead.

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 5 · Safety Gates                                     │
│  Prompt sanitization → Schema validation → Human review     │
│  → Git audit trail                                          │
├─────────────────────────────────────────────────────────────┤
│  LAYER 4 · Subagent Orchestration                           │
│  Task Analyzer → Spec Generator → Validator → Auditor       │
│  Stateless · Token-budgeted · MCP-whitelisted               │
├─────────────────────────────────────────────────────────────┤
│  LAYER 3 · MCP Bridge (ALREADY LIVE)                        │
│  Obsidian MCP ──read/write──▶ Claude Code                   │
│  GitHub webhook ──trigger──▶ n8n ──dispatch──▶ subagents    │
├─────────────────────────────────────────────────────────────┤
│  LAYER 2 · Persistent Memory                                │
│  Obsidian Sync (cross-device) · Git (version history)       │
│  Dataview queries · [[Backlinks]] as relationship graph      │
├─────────────────────────────────────────────────────────────┤
│  LAYER 1 · Foundation                                       │
│  Local Markdown files · .obsidian/ config · .git/           │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Architectural Decision: MCP Bridge Already Built

| Old Design | Current Design |
|---|---|
| n8n polls filesystem every 5 min | n8n receives GitHub push webhook |
| inotify daemon on local disk | Obsidian MCP handles file I/O |
| Claude Code reads files via filesystem tool | Claude reads/writes via Obsidian MCP directly |
| Sync via iCloud or Google Drive | Obsidian Sync (native, encrypted) |

**What this unlocks:**
- Claude can query vault notes as context *before* generating output
- No polling lag (webhook is immediate on push)
- All changes are committed to GitHub automatically via Obsidian Sync → Git integration
- Single ground truth: your Obsidian vault

---

## System Data Flow

```
You write a task note in Obsidian
  ↓  (add #task tag in YAML frontmatter)
  
Obsidian Sync pushes to GitHub
  ↓  (automatic on save, within seconds)

GitHub webhook fires → n8n receives POST
  ↓  (filter: only files with #task status: pending)

n8n dispatches Task Analyzer subagent
  ↓  (passes: file path, git commit hash, timestamp)

Task Analyzer reads task note via Obsidian MCP
  ↓  (reads note content + linked notes via [[backlinks]])

Task Analyzer generates SPEC.md
  ↓  (writes to /OUTPUT/pending-review/ via Obsidian MCP)

GATE ✋ You review /OUTPUT/pending-review/ in Obsidian
  ↓  (move file to /OUTPUT/approved/ to continue)

n8n detects file move (GitHub webhook on /approved/)
  ↓  (triggers Implementation Agent)

Implementation Agent executes plan
  ↓  (writes output to /RESULTS/, commits to GitHub)

Supabase audit trail updated
  ↓  (timestamp · agent name · file path · commit hash)
```

---

## Folder Structure (Add to Your Vault)

```
Obsidian/Main/
├── SPECS/
│   ├── AI_BRAIN_ARCHITECTURE.md    ← this file
│   └── AGENT_CONTRACTS.md
├── TASKS/
│   └── _template.md                ← task note template
├── OUTPUT/
│   ├── pending-review/             ← agents write here (not auto-committed)
│   └── approved/                   ← you move here to trigger next agent
├── RESULTS/
│   └── (agent-generated outputs)
├── CONTEXT/
│   ├── glossary.md
│   └── active-projects.md
└── .obsidian/
    └── (managed by Obsidian)
```

---

## Task Note Template

Save as `/TASKS/_template.md` in your vault:

```markdown
---
title: 
status: pending
type: task
agent: task-analyzer
created: {{date}}
priority: medium
tags: [task]
---

## Task Description
(What needs to be done)

## Context
(Links to relevant notes)
- [[]]

## Acceptance Criteria
- [ ] 
- [ ] 

## Agent Output
(Populated by agent — do not edit manually)
```

---

## Subagent Definitions

### Agent 1 · Task Analyzer
| | |
|---|---|
| **Trigger** | New file in `/TASKS/` with `status: pending` |
| **Reads** | Task note + linked `[[backlinks]]` + `/CONTEXT/active-projects.md` |
| **Produces** | `SPEC.md` in `/OUTPUT/pending-review/` |
| **Token budget** | 5,000 tokens max |
| **Error handling** | Malformed task → writes `ERROR_[filename].md` with reason |

**Input contract:**
```json
{
  "task_file_path": "string",
  "commit_hash": "string",
  "linked_files": ["string"],
  "context_files": ["CONTEXT/active-projects.md", "CONTEXT/glossary.md"]
}
```

**Output contract:**
```json
{
  "spec_file": "OUTPUT/pending-review/SPEC_[task-name].md",
  "schema_version": "1.0",
  "task_name": "string",
  "steps": ["string"],
  "risks": ["string"],
  "acceptance_criteria": ["string"],
  "estimated_complexity": "low|medium|high",
  "timestamp": "ISO8601"
}
```

---

### Agent 2 · Spec Generator
| | |
|---|---|
| **Trigger** | Approved SPEC.md moved to `/OUTPUT/approved/` |
| **Reads** | Approved SPEC.md + relevant linked context |
| **Produces** | Implementation plan in `/RESULTS/` |
| **Token budget** | 8,000 tokens max |
| **Error handling** | Schema mismatch → reject + log to Supabase |

---

### Agent 3 · Validator
| | |
|---|---|
| **Trigger** | New file in `/RESULTS/` |
| **Reads** | Result file + original SPEC |
| **Produces** | Validation report (`VALIDATED` or `REJECTED` status in YAML) |
| **Token budget** | 3,000 tokens max |
| **Error handling** | Invalid schema → reject + write reason to result YAML |

---

### Agent 4 · Auditor
| | |
|---|---|
| **Trigger** | Any commit to `/RESULTS/` |
| **Reads** | Git diff + Supabase audit table |
| **Produces** | Audit log entry in Supabase |
| **Token budget** | 2,000 tokens max |
| **Error handling** | Supabase write fail → write to local `/RESULTS/AUDIT_FALLBACK.log` |

---

## Safety Gates

### Gate 1 · Prompt Sanitization
Runs before any file content reaches an agent. Blocks:
- Raw code execution patterns: `eval(`, `exec(`, `system(`
- Directory traversal: `../`, `../../`
- Script tags and HTML injection
- SQL patterns: `DROP TABLE`, `DELETE FROM`

```typescript
// Sanitization pseudocode (implement in n8n Function node)
const BLOCKED_PATTERNS = [
  /eval\s*\(/gi,
  /exec\s*\(/gi,
  /\.\.\//g,
  /<script/gi,
  /DROP\s+TABLE/gi
];

function sanitizeTaskNote(content: string): string {
  BLOCKED_PATTERNS.forEach(pattern => {
    if (pattern.test(content)) {
      throw new Error(`BLOCKED: Injection pattern detected: ${pattern}`);
    }
  });
  return content;
}
```

### Gate 2 · Schema Validation
Every agent output is validated against its output contract before being written.

```typescript
import { z } from "zod";

const SpecOutputSchema = z.object({
  spec_file: z.string().startsWith("OUTPUT/pending-review/"),
  schema_version: z.literal("1.0"),
  task_name: z.string().min(1),
  steps: z.array(z.string()).min(1),
  risks: z.array(z.string()),
  acceptance_criteria: z.array(z.string()).min(1),
  estimated_complexity: z.enum(["low", "medium", "high"]),
  timestamp: z.string().datetime()
});

// Throws ZodError if invalid — n8n catches and logs
SpecOutputSchema.parse(agentOutput);
```

### Gate 3 · Human Review (Pending → Approved)
Agents write to `/OUTPUT/pending-review/` only. No automated commit happens until you manually move the file to `/OUTPUT/approved/`. This is enforced via:
1. Agents are only given MCP write permission to `pending-review/`
2. `approved/` is writable only by you (system-level permission)
3. n8n's implementation agent triggers only on files committed from `approved/`

### Gate 4 · Audit Trail
Every agent execution writes a record to Supabase:

```sql
CREATE TABLE ai_brain_audit_trail (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  agent_name  TEXT NOT NULL,
  task_file   TEXT NOT NULL,
  output_file TEXT,
  commit_hash TEXT,
  status      TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'error')),
  token_count INTEGER,
  error_msg   TEXT
);

-- Read-only for all roles except service_role
ALTER TABLE ai_brain_audit_trail ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_readonly ON ai_brain_audit_trail
  FOR SELECT USING (true);
```

---

## Persistent Memory: Dataview Queries

Add these to your vault dashboard note:

```dataview
// Active tasks (what agents are watching)
TABLE priority, created, status
FROM "TASKS"
WHERE status = "pending"
SORT priority DESC
```

```dataview
// Pending review queue (what you need to approve)
LIST
FROM "OUTPUT/pending-review"
SORT file.mtime DESC
```

```dataview
// Completed results (what agents shipped)
TABLE agent, created, commit_hash
FROM "RESULTS"
WHERE status = "complete"
SORT created DESC
LIMIT 10
```

---

## Red-Team Summary (Top 10 → Prioritized)

| # | Threat | Severity | Status | Fix |
|---|--------|----------|--------|-----|
| 1 | Prompt injection via task notes | CRITICAL | ⚠ OPEN | Gate 1 sanitization |
| 2 | Privilege escalation via MCP path traversal | CRITICAL | ⚠ OPEN | Whitelist folders only |
| 3 | Autonomous commit without review | CRITICAL | ✅ GATED | pending-review folder |
| 4 | Context leakage across stateless agents | HIGH | ⚠ OPEN | Explicit input contracts |
| 5 | Concurrent writes causing Git conflicts | HIGH | ✅ MITIGATED | Single-writer (n8n queue) |
| 6 | Audit trail tampering | HIGH | ✅ MITIGATED | Supabase RLS read-only |
| 7 | Token budget overflow | MEDIUM | ⚠ OPEN | Per-agent caps |
| 8 | Unvalidated agent schema output | MEDIUM | ✅ GATED | Zod schema validation |
| 9 | Silent n8n workflow failure | MEDIUM | ⚠ OPEN | Retry + Slack alert |
| 10 | Vault corruption from bad merge | MEDIUM | ✅ MITIGATED | Obsidian Sync + Git |

---

## Implementation Sequence (WSJF Order)

- [ ] **Week 1** — Add folder structure to vault (`/TASKS/`, `/OUTPUT/`, `/RESULTS/`, `/CONTEXT/`)
- [ ] **Week 1** — Create task note template (`/TASKS/_template.md`)
- [ ] **Week 1** — Add GitHub webhook → n8n workflow (filter: `#task` + `status: pending`)
- [ ] **Week 2** — Deploy Task Analyzer subagent (TypeScript · Obsidian MCP)
- [ ] **Week 2** — Test end-to-end: write task → review → approve → commit
- [ ] **Week 3** — Add Gate 1 sanitization to n8n Function node
- [ ] **Week 3** — Add Gate 2 Zod schema validation
- [ ] **Week 3** — Wire Supabase audit table
- [ ] **Week 4** — Deploy Agents 2–4 (Spec Generator, Validator, Auditor)
- [ ] **Week 4** — Add Dataview dashboard queries
- [ ] **Week 5** — Add token budget enforcement + Slack error alerts

---

## Runnable Prompt (Paste into Claude Code)

```
SYSTEM: You are building an AI Brain automation system. 
Your vault is accessible via Obsidian MCP. 
GitHub is connected. 
Supabase is available for audit logging.

TASK: Generate a complete SPEC for the Task Analyzer subagent.

CONSTRAINTS:
- Write output ONLY to OUTPUT/pending-review/
- Validate output against the SpecOutputSchema before writing
- Do not use eval(), exec(), or any dynamic code execution
- Token budget: 5,000 tokens max
- If task note is malformed, write ERROR_[filename].md with reason

CONTEXT FILES TO READ (via Obsidian MCP):
- CONTEXT/active-projects.md
- CONTEXT/glossary.md
- TASKS/_template.md (for schema reference)

INPUT:
- Task file path: [INJECT: file_path]
- Commit hash: [INJECT: commit_hash]

OUTPUT FORMAT (strict JSON, no preamble, no markdown fences):
{
  "spec_file": "OUTPUT/pending-review/SPEC_[task-name].md",
  "schema_version": "1.0",
  "task_name": "",
  "steps": [],
  "risks": [],
  "acceptance_criteria": [],
  "estimated_complexity": "low|medium|high",
  "timestamp": ""
}
```

---

## Open Questions

- [ ] What is the vault path on your local machine? (needed for MCP config)
- [ ] Is the GitHub repo for your vault private? (webhook auth token required)
- [ ] Which Supabase project should audit trail go into? (Fusion AI or new project?)
- [ ] Do you want Slack alerts for n8n errors, or email?

---

## Related Notes

- [[n8n Workflows]]
- [[Claude Code Subagents]]
- [[Supabase Audit Trail Setup]]
- [[Obsidian MCP Configuration]]
- [[GitHub Webhook Setup]]

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIMS:**
- [GENERATED] Obsidian MCP being live eliminates the need for a separate filesystem polling layer in n8n
- [GENERATED] GitHub webhook trigger is lower latency and more reliable than cron-based polling
- [GENERATED] Stateless agents with explicit input contracts reduce context leakage risk

**COUNTEREXAMPLES:**
- GitHub webhook trigger fails if Obsidian Sync delays push by >30s; edge tasks may be missed
- Stateless agents require more input data per call, increasing token cost per execution

**! CONTRADICTIONS:**
- "Pending-review gate prevents autonomous commits" conflicts with the gate being a filesystem convention, not a technical enforcement — agents with escalated MCP permissions could bypass it
- "Obsidian Sync as ground truth" conflicts with "Git as audit trail" — if Sync and Git diverge on conflict resolution, you have two sources of truth

---

*Last updated: 2026-05-04 · v1.0.0 · [[AI Brain Architecture]]*
