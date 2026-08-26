# Agent Council — Crew Definitions

**Load this file when:** Running the council, debugging a specific crew's output, tuning crew behavior, or understanding what each crew evaluates.

All 10 crews are instantiated in `agent_council.py`. Each crew receives the same file manifest item as input and returns a structured memo section. The **Memo Synthesizer** (Crew 10) aggregates all crew outputs into the final council memo written to `council_memos`.

> **[GENERATED] Notice:** Crew definitions below were inferred from system context. Verify each crew's `role`, `goal`, `backstory`, and `expected_output` against `agent_council.py` and correct as needed. Fields marked `[GENERATED]` are inferred.

---

## Table of Contents
1. [Classifier Crew](#1-classifier-crew)
2. [Router Crew](#2-router-crew)
3. [Duplicate Detector Crew](#3-duplicate-detector-crew)
4. [Staleness Evaluator Crew](#4-staleness-evaluator-crew)
5. [Privacy Auditor Crew](#5-privacy-auditor-crew)
6. [Naming Convention Crew](#6-naming-convention-crew)
7. [Ownership Crew](#7-ownership-crew)
8. [Archive Evaluator Crew](#8-archive-evaluator-crew)
9. [Action Recommender Crew](#9-action-recommender-crew)
10. [Memo Synthesizer Crew](#10-memo-synthesizer-crew)

---

## 1. Classifier Crew

**Role:** File Classification Specialist [GENERATED]
**Goal:** Determine the canonical file category, subcategory, and content type for the input file based on name, MIME type, path, and any available metadata. [GENERATED]
**Backstory:** Expert in document taxonomy with deep knowledge of Google Workspace file types, project folder conventions, and naming patterns across personal and professional Drive structures. [GENERATED]

**Input:** `{file_id, name, mime_type, path}`
**Expected output:**
```json
{
  "crew": "classifier",
  "category": "<primary category>",
  "subcategory": "<subcategory>",
  "confidence": 0.0-1.0,
  "signals": ["<signal1>", "<signal2>"]
}
```

**Notes:** [GENERATED] Confidence < 0.7 should trigger a REVIEW flag in the final memo. If MIME type and filename extension conflict, flag as AMBIGUOUS.

---

## 2. Router Crew

**Role:** Drive Routing Strategist [GENERATED]
**Goal:** Determine the correct destination folder path for the file based on its classification, existing folder structure, and routing rules. [GENERATED]
**Backstory:** Deep familiarity with the personal Drive folder taxonomy. Knows the difference between active projects, archive layers, and intake staging areas. Produces actionable routing instructions. [GENERATED]

**Input:** Classifier output + `{file_id, name, path}`
**Expected output:**
```json
{
  "crew": "router",
  "destination_path": "<full Drive folder path>",
  "routing_rule": "<rule name that matched>",
  "action": "MOVE | COPY | STAY | REVIEW",
  "rationale": "<1-2 sentence explanation>"
}
```

**Notes:** [GENERATED] `STAY` = file is already in the correct location. `REVIEW` = router cannot determine destination with confidence.

---

## 3. Duplicate Detector Crew

**Role:** Duplicate and Near-Duplicate Analyst [GENERATED]
**Goal:** Identify whether the file is a duplicate, near-duplicate, or version-of an existing file in Drive. Flag for consolidation or deletion. [GENERATED]
**Backstory:** Pattern-matching expert. Looks for identical names, similar names with version suffixes (`_v2`, `_final`, `_copy`), same MIME type in same folder, and recently modified files with identical stems. [GENERATED]

**Input:** `{file_id, name, mime_type, path, modified_time}`
**Expected output:**
```json
{
  "crew": "duplicate_detector",
  "status": "UNIQUE | DUPLICATE | NEAR_DUPLICATE | POSSIBLE_VERSION",
  "match_ids": ["<file_id>"],
  "match_names": ["<file_name>"],
  "recommendation": "KEEP | DELETE | MERGE | FLAG_FOR_REVIEW"
}
```

**Notes:** [GENERATED] Does not delete files — only flags. Final deletion decision belongs to the user.

---

## 4. Staleness Evaluator Crew

**Role:** File Freshness and Relevance Auditor [GENERATED]
**Goal:** Determine whether the file is stale, outdated, or no longer actively relevant based on modification date, last access time, and file category lifecycle rules. [GENERATED]
**Backstory:** Applies different staleness thresholds by category: reference docs age faster than creative projects; meeting notes are stale after 90 days; active project files are never stale. [GENERATED]

**Input:** `{file_id, name, category (from Classifier), modified_time, viewed_time}`
**Expected output:**
```json
{
  "crew": "staleness_evaluator",
  "age_days": 0,
  "freshness": "ACTIVE | AGING | STALE | DORMANT",
  "threshold_applied": "<rule>",
  "recommendation": "KEEP_ACTIVE | ARCHIVE | REVIEW | DELETE_CANDIDATE"
}
```

**Notes:** [GENERATED] `DORMANT` = not accessed in 365+ days and no active project link. Threshold rules should live in a config block in `agent_council.py` — verify they exist.

---

## 5. Privacy Auditor Crew

**Role:** PII and Sensitive Content Detector [GENERATED]
**Goal:** Scan file name, path, and any readable metadata for signals of personally identifiable information, credentials, financial data, or sensitive content that requires access controls. [GENERATED]
**Backstory:** AppSec-aware auditor. Flags files that may contain SSNs, API keys, passwords, financial records, health data, or legal documents. Does NOT read file content — works from metadata signals only. [GENERATED]

**Input:** `{file_id, name, path, mime_type}`
**Expected output:**
```json
{
  "crew": "privacy_auditor",
  "risk_level": "NONE | LOW | MEDIUM | HIGH | CRITICAL",
  "signals": ["<signal>"],
  "recommended_action": "NO_ACTION | ADD_RESTRICTION | MOVE_TO_PRIVATE | REVIEW"
}
```

**Notes:** [GENERATED] CRITICAL = file name or path contains explicit credential/PII signals (e.g., `passwords.txt`, `ssn_records.xlsx`). Works on metadata only — no file content reads.

---

## 6. Naming Convention Crew

**Role:** File Naming Standards Enforcer [GENERATED]
**Goal:** Evaluate the file name against personal Drive naming conventions. Flag violations and propose a corrected name. [GENERATED]
**Backstory:** Enforces the naming standard: `YYYY-MM-DD_ProjectCode_Description_v#.ext` or the simplified `Category_Description.ext` pattern. Knows exceptions by file type and folder context. [GENERATED]

**Input:** `{file_id, name, path, category (from Classifier)}`
**Expected output:**
```json
{
  "crew": "naming_convention",
  "compliant": true | false,
  "violations": ["<violation>"],
  "proposed_name": "<corrected_name>",
  "auto_rename_safe": true | false
}
```

**Notes:** [GENERATED] `auto_rename_safe: false` = proposed rename requires human confirmation (e.g., shared files, files with external links).

---

## 7. Ownership Crew

**Role:** File Ownership and Collaboration Auditor [GENERATED]
**Goal:** Determine who owns the file, whether it is shared, and whether sharing permissions are appropriate for its category and sensitivity. [GENERATED]
**Backstory:** Looks at ownership metadata, shared status, and known collaborators. Cross-references classification and privacy risk to flag mismatched permissions (e.g., sensitive file shared publicly). [GENERATED]

**Input:** `{file_id, name, category, privacy_risk (from Privacy Auditor), sharing_metadata}`
**Expected output:**
```json
{
  "crew": "ownership",
  "owner": "<email>",
  "shared": true | false,
  "sharing_scope": "PRIVATE | SPECIFIC_PEOPLE | DOMAIN | PUBLIC",
  "permission_mismatch": true | false,
  "recommendation": "NO_ACTION | RESTRICT | TRANSFER | REVIEW"
}
```

**Notes:** [GENERATED] Permission mismatch = sharing scope is broader than the file's privacy risk level warrants.

---

## 8. Archive Evaluator Crew

**Role:** Archival Candidacy Assessor [GENERATED]
**Goal:** Determine whether the file is a candidate for archiving, and if so, recommend the appropriate archive tier (cold storage, project archive, reference archive). [GENERATED]
**Backstory:** Balances staleness, active project linkage, and storage cost. Knows that dormant reference docs belong in cold archive, completed project files belong in project archive, and frequently accessed old files should stay warm. [GENERATED]

**Input:** Staleness output + Ownership output + `{file_id, name, category}`
**Expected output:**
```json
{
  "crew": "archive_evaluator",
  "archive_candidate": true | false,
  "archive_tier": "NONE | PROJECT_ARCHIVE | REFERENCE_ARCHIVE | COLD_STORAGE",
  "rationale": "<1-2 sentences>",
  "blocks_on": ["<dependency that prevents archiving>"]
}
```

**Notes:** [GENERATED] `blocks_on` = active project references, recent shares, or open tasks that prevent safe archiving.

---

## 9. Action Recommender Crew

**Role:** Consolidated Action Synthesizer [GENERATED]
**Goal:** Synthesize outputs from all preceding crews (Classifier through Archive Evaluator) into a prioritized, non-conflicting set of recommended actions for the file. [GENERATED]
**Backstory:** Conflict-resolution layer. If Router says MOVE but Ownership says RESTRICT first, the action plan sequences RESTRICT → MOVE. Produces a ranked action list with clear sequencing. [GENERATED]

**Input:** All prior crew outputs (1–8)
**Expected output:**
```json
{
  "crew": "action_recommender",
  "actions": [
    {"priority": 1, "action": "<action>", "rationale": "<why>", "blocking": false},
    {"priority": 2, "action": "<action>", "rationale": "<why>", "blocking": true}
  ],
  "overall_status": "CLEAN | NEEDS_ATTENTION | CRITICAL",
  "human_review_required": true | false
}
```

**Notes:** [GENERATED] `blocking: true` = this action must complete before subsequent actions can execute.

---

## 10. Memo Synthesizer Crew

**Role:** Council Memo Author [GENERATED]
**Goal:** Aggregate all 9 crew outputs into a single structured council memo, written to `council_memos` in Supabase. The memo is the authoritative record of the council's evaluation for this file. [GENERATED]
**Backstory:** The final voice of the council. Neutral, structured, no editorial opinion — just synthesis. Flags contradictions between crew outputs. Writes the Supabase record. [GENERATED]

**Input:** All prior crew outputs (1–9) + `{run_id, file_id, name}`
**Expected output (Supabase `council_memos` row):**
```json
{
  "run_id": "<run_id>",
  "file_id": "<file_id>",
  "file_name": "<name>",
  "classification": "<from Crew 1>",
  "routing": "<from Crew 2>",
  "duplicate_status": "<from Crew 3>",
  "freshness": "<from Crew 4>",
  "privacy_risk": "<from Crew 5>",
  "naming_compliant": true | false,
  "proposed_name": "<from Crew 6>",
  "ownership_flags": "<from Crew 7>",
  "archive_recommendation": "<from Crew 8>",
  "action_plan": [],
  "overall_status": "CLEAN | NEEDS_ATTENTION | CRITICAL",
  "human_review_required": true | false,
  "crew_contradictions": [],
  "created_at": "<timestamp>"
}
```

**Notes:** [GENERATED] `crew_contradictions` = array of `{crew_a, crew_b, conflict_description}` where crew outputs are logically incompatible. Synthesizer flags but does not resolve — human resolves.

---

## Crew Execution Order

```
Classifier (1) ──► Router (2)
                ├──► Duplicate Detector (3)
                ├──► Staleness Evaluator (4)
                ├──► Privacy Auditor (5)
                ├──► Naming Convention (6)
                └──► Ownership (7)
                         │
                         ▼
              Archive Evaluator (8)
                         │
                         ▼
              Action Recommender (9)
                         │
                         ▼
               Memo Synthesizer (10) ──► Supabase council_memos
```

Crews 2–7 can run in parallel after Crew 1 completes. Crew 8 depends on Crews 4+7. Crew 9 depends on Crews 2–8. Crew 10 depends on Crew 9.
