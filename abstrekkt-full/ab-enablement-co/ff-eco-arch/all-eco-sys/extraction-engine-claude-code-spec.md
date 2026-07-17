# Extraction Engine — Claude Code Workflow Spec
## Phase 2: Programmatic Pipeline

> **Status:** Spec / decision document — not yet built  
> **Prerequisite:** v4.0 prompt is Phase 1; this is Phase 2  
> **Decision needed:** Confirm before build (see NEEDS_HUMAN_DECISION items)

---

## Why a Claude Code Version

The v4.0 prompt is still a single-context execution. It works well for conversations up to ~60K tokens.
A Claude Code pipeline breaks that ceiling and adds:

| Capability | v4.0 Prompt | Claude Code Pipeline |
|---|---|---|
| Context limit | ~60K tokens | Unlimited (chunked) |
| File system output | Manual copy-paste | Direct write to disk |
| Merge across runs | Manual | Automated with conflict detection |
| Git history as source | Not possible | `git log` → structured input |
| Incremental re-runs | Full re-extract each time | Diff-only re-extract |
| Validation | Self-scored | External assertion runner |
| Parallelism | Sequential | Parallel system cards |

---

## Architecture

```
INPUT SOURCES
  ├── Conversation export (JSON / markdown)
  ├── Git repository (git log --oneline, PRs, issues)
  ├── Claude.ai session transcript
  └── Paste / stdin

          ↓
    [STEP 0: Pre-flight]
      context_budget_estimator.ts
      topic_map_builder.ts
      partition_strategy.ts        ← splits >80K token convos into chunks

          ↓
    [STEP 1-2: Extraction + Reconstruction]  ← Claude API call per chunk
      extractor.ts                           ← calls claude-sonnet-4-6
      system_card_builder.ts
      confidence_tagger.ts

          ↓ (parallel per system card)
    [STEP 3-4: Gap Analysis + Upgrades]      ← Claude API call per system
      gap_analyzer.ts
      upgrade_card_generator.ts

          ↓
    [STEP 5: Completeness Gate]              ← deterministic, no LLM
      completeness_gate.ts                   ← type-aware scoring
      gate_enforcer.ts

          ↓
    [STEP 6: Artifact Generation]            ← Claude API call per artifact set
      artifact_generator.ts
      test_generator.ts
      doc_generator.ts

          ↓
    [STEP 7: Packaging]                      ← deterministic, no LLM
      manifest_builder.ts
      merge_manifest_builder.ts              ← handles multi-chunk merges
      delta_writer.ts
      packager.ts                            ← zip output

          ↓
    [STEP 8: Validation]                     ← assertion runner, no LLM
      validator.ts                           ← scored rubric (0-2 per item)
      report_generator.ts
```

---

## Key Design Decisions

### LLM calls: 3 distinct API calls, not 1

```typescript
// Call 1: Extract + Reconstruct (per chunk)
// System prompt: Steps 0-2 only
// Input: conversation chunk
// Output: topic_map.json + system_cards.json

// Call 2: Gap + Upgrade (per system card, parallelized)
// System prompt: Steps 3-4 only
// Input: single system card
// Output: gaps.json + upgrade_cards.json

// Call 3: Artifact Generation (per system that passes gate)
// System prompt: Step 6 only
// Input: system card + upgrade cards + gaps
// Output: raw artifact files
```

This is Modular Prompting (#9) applied to the engine itself — each call is focused, no context competition.

### Completeness gate is deterministic code

```typescript
// completeness_gate.ts — no LLM, just a scorer

type ArtifactType = 'code' | 'config' | 'knowledge' | 'prompt';

interface SystemCard {
  artifactType: ArtifactType;
  purpose?: string;
  targetUser?: string;
  coreFeatures?: string[];
  architecture?: string;
  dataModel?: string;
  apiSurface?: string;
  dependencies?: string[];
  deploymentTarget?: string;
}

function scoreCompleteness(card: SystemCard): { score: number; blocked: boolean; missing: string[] } {
  if (card.artifactType !== 'code') return { score: -1, blocked: false, missing: [] };

  const fields = [
    { name: 'purpose', present: !!card.purpose },
    { name: 'targetUser', present: !!card.targetUser },
    { name: 'coreFeatures (≥3)', present: (card.coreFeatures?.length ?? 0) >= 3 },
    { name: 'architecture', present: !!card.architecture },
    { name: 'dataModel', present: !!card.dataModel },
    { name: 'apiSurface', present: !!card.apiSurface },
    { name: 'dependencies (versioned)', present: (card.dependencies?.length ?? 0) >= 1 },
    { name: 'deploymentTarget', present: !!card.deploymentTarget },
  ];

  const present = fields.filter(f => f.present);
  const missing = fields.filter(f => !f.present).map(f => f.name);
  const score = present.length;
  const blocked = score < 5;

  return { score, blocked, missing };
}
```

### Validation is an assertion runner

```typescript
// validator.ts — no LLM, deterministic assertions

interface ValidationResult {
  checkId: number;
  description: string;
  score: 0 | 1 | 2;
  detail?: string;
}

// 17 checks from v4.0 Step 8
// Each check is a typed assertion against the generated artifacts
// Score < 28/34 → throw ExtractionValidationError with failing checks listed
```

### Merge strategy for multi-chunk runs

```typescript
// merge_manifest_builder.ts

function mergeManifests(runs: RunManifest[]): MergeManifest {
  // Same file path in multiple runs → later run wins (latest_wins)
  // Conflicting system card fields → emit NEEDS_HUMAN_DECISION
  // New system cards in later runs → union (additive)
  // Deleted systems → flag as NEEDS_HUMAN_DECISION (never silently drop)
}
```

---

## Entry Point (CLI)

```bash
# Single conversation
extract-engine run --input conversation.json --output ./extraction-out/

# Git repo (extracts from commit history + PR descriptions)
extract-engine run --input-git ./my-repo --branch main --output ./extraction-out/

# Multi-chunk (auto-partitions large convos)
extract-engine run --input large-conversation.json --chunk-size 50000 --output ./extraction-out/

# Incremental (only re-extract changed topics)
extract-engine run --input conversation.json --incremental --previous ./extraction-out/manifest.json
```

---

## File Structure

```
/packages/extraction-engine/
  /src/
    cli.ts                       ← entry point
    pre_flight/
      context_budget_estimator.ts
      topic_map_builder.ts
      partition_strategy.ts
    extraction/
      extractor.ts               ← Claude API Call 1
      system_card_builder.ts
      confidence_tagger.ts
    analysis/
      gap_analyzer.ts            ← Claude API Call 2 (parallelized)
      upgrade_card_generator.ts
    gate/
      completeness_gate.ts       ← deterministic
      gate_enforcer.ts
    generation/
      artifact_generator.ts      ← Claude API Call 3
      test_generator.ts
      doc_generator.ts
    packaging/
      manifest_builder.ts        ← deterministic
      merge_manifest_builder.ts
      delta_writer.ts
      packager.ts
    validation/
      validator.ts               ← deterministic, assertion runner
      report_generator.ts
    /prompts/
      step_1_2_extract.md        ← focused extraction prompt (Steps 0-2 only)
      step_3_4_analyze.md        ← focused analysis prompt (Steps 3-4 only)
      step_6_generate.md         ← focused generation prompt (Step 6 only)
  /tests/
    *.test.ts
  package.json
  tsconfig.json
  .env.template
```

---

## NEEDS_HUMAN_DECISION Items

Before this gets built:

1. **Input format priority** — Conversation JSON export, git log, or both? Order of priority?
2. **LLM model** — claude-sonnet-4-6 for all calls, or opus-4-6 for Step 3 (gap analysis) where depth matters more than speed?
3. **Output format** — Files written to disk (current spec) or returned as JSON payload for embedding in another pipeline (e.g., n8n node)?
4. **Incremental mode priority** — Is the `--incremental` flag needed in v1, or is full re-extract acceptable?
5. **CI integration** — Should `extract-engine` be a GitHub Action, or run locally only?

---

## Effort Estimate

| Phase | Work | Hours |
|---|---|---|
| Scaffold + CLI + pre-flight | context estimator, topic map, partition | 4h |
| Extraction + system cards | Claude API Call 1, confidence tagger | 6h |
| Gap + upgrade analysis | Claude API Call 2, parallelization | 4h |
| Completeness gate | Typed scorer, gate enforcer | 2h |
| Artifact generation | Claude API Call 3, doc generator | 6h |
| Packaging + merge | Manifest builder, merge logic, zip | 3h |
| Validation | 17 assertion checks, report generator | 3h |
| Tests + CI | Vitest suite, GitHub Actions | 4h |
| **Total** | | **~32h** |

---

*Extraction Engine — Claude Code Spec v0.1*
*Status: Spec only — not built*
*Phase 1 (v4.0 prompt) should be validated before committing to this build*
