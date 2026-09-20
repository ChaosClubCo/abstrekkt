# PHASE A1: TIER 1 SKILL SELECTION & CONCEPT MAPPING
## Detailed Step-by-Step Execution Runbook

**Duration:** Days 1-2  
**Status checkpoint:** `tier-1-selection-complete`  
**Can stop/resume:** YES (after each substep)

---

## STEP A1.1: Identify 70 Tier 1 Candidates

### What We're Doing
Scanning `_master-skills/` directory for skills that directly benefit from Claude Code concepts.

### Tier 1 Criteria
A skill is Tier 1 if it:
1. Involves **building or using Claude Code** (agents, hooks, orchestration, etc.)
2. **Generates code** (refactoring, generation, testing, etc.)
3. **Designs systems** (architecture, microservices, APIs, etc.)
4. **Automates workflows** (directly uses Claude Code for automation)

### Tier 1 Categories (Where to Look)
- `_master-skills/ai-agents/` (all 232 skills, pick ~35)
- `_master-skills/technical/` (all 127 skills, pick ~35)
- Total: ~70 skills

### Manual Selection (If Script Fails)

**Option A: Use Script**
```powershell
cd D:\02_Development\Skills
.\scripts\Find-Tier1-Skills.ps1
# Output: tier-1-skills-candidates.csv
```

**Option B: Manual (If Script Unavailable)**

Open each category and identify skills:

**From `_master-skills/ai-agents/` (35-40 skills):**
```
create-agent-skills ✓
create-subagents ✓
create-hooks ✓
create-slash-commands ✓
ai-agents-workflow ✓
create-meta-prompts ✓
debug-like-expert ✓
staff-engineer-v3 ✓
code-auditor ✓
code-review-excellence ✓
skill-developer ✓
skill-reminder ✓
error-handling-patterns ✓
bash-defensive-patterns ✓
architecture-patterns ✓
mcp-builder ✓
create-slash-commands ✓
conversation-analyzer ✓
defense-in-depth ✓
compliance-automation ✓
collision-zone-thinking ✓

[From TIER1_SKILL_DEFINITIONS.md, Batch 1-5: pick others from ai-agents]
```

**From `_master-skills/technical/` (35-40 skills):**
```
code-refactor ✓
code-transfer ✓
backend-development ✓
frontend-development ✓
api-development ✓
github-actions-templates ✓
github-workflows ✓
gitops-workflow ✓
nodejs-backend-patterns ✓
review-implementing ✓
test-fixing ✓
api-design-principles ✓
microservices-patterns ✓
database-design ✓
postgresql ✓
async-python-patterns ✓
fastapi-templates ✓
auth-implementation-patterns ✓
deployment-pipeline-design ✓
devops-practices ✓
cloud-architecture ✓
design-system-builder ✓
distributed-tracing ✓
performance-optimization ✓
gitlab-ci-patterns ✓
security-compliance ✓
data-modeling ✓
testing-strategies ✓
e2e-testing-patterns ✓
code-review ✓
penetration-testing ✓
error-tracking ✓
disaster-recovery ✓
incident-response ✓
workflow-orchestration-patterns ✓

[Total: ~35-40 from technical]
```

### Output: `tier-1-skills-candidates.csv`

Create this file manually if script unavailable:

```csv
skill_name,category,matched_keywords,tier
create-agent-skills,ai-agents,agent;skill;claude-code,1
create-subagents,ai-agents,agent;subagent;orchestration,1
create-hooks,ai-agents,hook;validation;control,1
... (70 total)
```

### ✅ Checkpoint: A1.1 Complete
- [ ] 70 skills identified (within ±5)
- [ ] All from ai-agents or technical categories
- [ ] File created: `tier-1-skills-candidates.csv`
- [ ] Update ENHANCEMENT_STATUS.json:
  ```json
  "A1_skill_selection": {
    "status": "COMPLETE",
    "completed": "2026-02-XX",
    "skills_selected": 70
  }
  ```

**If you stop here:** You have the full list of 70 skills. Resume at A1.2.

---

## STEP A1.2: Map Concepts to Each Tier 1 Skill

### What We're Doing
For each of the 70 skills, identify which 10-15 of 30 Claude Code concepts apply.

### The 30 Claude Code Concepts
(From the cheat sheet you provided)

```
Core Concepts (6):
1. Claude Code
2. Terminal CLI
3. CLAUDE.md
4. Context Window
5. Compaction
6. Checkpoints

Access & Control (3):
7. Permissions
8. Tool Use
9. Plan Mode

Advanced (11):
10. MCP
11. MCP Server
12. Hooks
13. Skills
14. Plugins
15. Subagents
16. Background Tasks
17. Slash Commands
18. Agent SDK
19. Ultrathink
20. Artifacts

IDE & Integration (6):
21. VS Code Extension
22. JetBrains Plugin
23. Inline Diffs
24. LSP Support
25. Claude in Chrome
26. Settings.json

Automation (4):
27. GitHub Actions
28. Slack Integration
29. Headless Mode
30. Git Worktrees
```

### Mapping Logic (Decision Tree)

For each Tier 1 skill, ask these questions in order:

```
Q1: Does this skill involve BUILDING agents/systems?
  YES → Include: Subagents, Hooks, Slash Commands, Plan Mode, Permissions
  NO  → Go to Q2

Q2: Does this skill involve GENERATING or MODIFYING code?
  YES → Include: Code Execution, Inline Diffs, Checkpoints, Git, Terminal, Artifacts
  NO  → Go to Q3

Q3: Does this skill involve SYSTEM ARCHITECTURE or DESIGN?
  YES → Include: Plan Mode, MCP Servers, Tool Use, Terminal, Context Window, Checkpoints
  NO  → Go to Q4

Q4: Does this skill involve DEBUGGING or ANALYSIS?
  YES → Include: Plan Mode, Checkpoints, Terminal, Inline Diffs, Ultrathink, Artifacts
  NO  → Go to Q5

Q5: Does this skill involve AUTOMATION or ORCHESTRATION?
  YES → Include: Hooks, Slash Commands, Plan Mode, Terminal, CLAUDE.md, Checkpoints
  NO  → Probably not Tier 1; reconsider

Result: Skill now has 10-15 concepts mapped
```

### Pre-Mapped Tier 1 Skills (Use These as Reference)

**Skill: create-agent-skills**
```json
{
  "skill": "create-agent-skills",
  "concepts": [
    { "name": "Subagents", "why": "Creating multi-agent systems", "example": "Parent agent spawning task-specific agents" },
    { "name": "Hooks", "why": "Intercepting agent behavior", "example": "PreToolUse hook for permission checking" },
    { "name": "Permissions", "why": "Agent access control", "example": "Allow/Ask/Deny model for sensitive tools" },
    { "name": "Slash Commands", "why": "Quick agent shortcuts", "example": "/create-skill shortcut" },
    { "name": "Plan Mode", "why": "Decomposing complex tasks", "example": "Planning agent creation workflow" },
    { "name": "Tool Use", "why": "Agents calling external tools", "example": "MCP integration for agent actions" },
    { "name": "CLAUDE.md", "why": "Agent configuration", "example": "CLAUDE.md defining agent instructions" },
    { "name": "MCP Servers", "why": "Agent integrations", "example": "MCP server providing agent tools" },
    { "name": "Checkpoints", "why": "Resuming agent tasks", "example": "Checkpoint after agent multi-step process" },
    { "name": "Artifacts", "why": "Agent output formatting", "example": "Artifact for agent workflow diagram" },
    { "name": "Context Window", "why": "Managing agent state", "example": "Context window allocation for agent messages" },
    { "name": "Ultrathink", "why": "Deep agent reasoning", "example": "Ultrathink mode for complex agent logic" },
    { "name": "Inline Diffs", "why": "Agent code updates", "example": "Showing agent instruction changes" },
    { "name": "Terminal CLI", "why": "Agent testing", "example": "Testing agent via CLI before deployment" },
    { "name": "Code Execution", "why": "Running agent examples", "example": "Execute agent code blocks in live environment" }
  ],
  "count": 15,
  "category": "ai-agents",
  "status": "mapped"
}
```

**Skill: code-refactor**
```json
{
  "skill": "code-refactor",
  "concepts": [
    { "name": "Code Execution", "why": "Testing refactored code", "example": "Run tests after refactoring" },
    { "name": "Inline Diffs", "why": "Showing code changes", "example": "Side-by-side before/after" },
    { "name": "Checkpoints", "why": "Tracking refactoring progress", "example": "Checkpoint after each refactoring step" },
    { "name": "Git Worktrees", "why": "Parallel refactoring branches", "example": "Test refactoring in separate worktree" },
    { "name": "Terminal CLI", "why": "Running linters/formatters", "example": "Execute formatting commands" },
    { "name": "Artifacts", "why": "Showing refactoring output", "example": "Artifact with refactored code" },
    { "name": "Plan Mode", "why": "Refactoring strategy", "example": "Plan multi-file refactoring" },
    { "name": "VS Code Extension", "why": "IDE integration", "example": "Using Claude Code extension in VS Code" },
    { "name": "Inline Diffs", "why": "Previewing changes", "example": "Inline diffs during refactoring" },
    { "name": "Permissions", "why": "File access control", "example": "Only touch certain files" },
    { "name": "Context Window", "why": "Managing large codebases", "example": "Splitting large refactoring across contexts" },
    { "name": "Ultrathink", "why": "Deep code analysis", "example": "Ultrathink for complex refactoring logic" },
    { "name": "CLAUDE.md", "why": "Refactoring instructions", "example": "CLAUDE.md defining refactoring rules" }
  ],
  "count": 13,
  "category": "technical",
  "status": "mapped"
}
```

### Format for Mapping File

For ALL 70 skills, create `tier-1-concept-mapping.json`:

```json
{
  "metadata": {
    "created": "2026-02-08",
    "total_skills": 70,
    "concepts_per_skill": "10-15",
    "validation": "All skills mapped and reviewed"
  },
  "skills": [
    { /* create-agent-skills mapping above */ },
    { /* code-refactor mapping above */ },
    { /* ... 68 more skills ... */ }
  ]
}
```

### ✅ Checkpoint: A1.2 Complete
- [ ] All 70 skills have concept mappings
- [ ] Each mapping has 10-15 concepts
- [ ] Each concept has "why" + "example"
- [ ] File created: `tier-1-concept-mapping.json`
- [ ] Update ENHANCEMENT_STATUS.json:
  ```json
  "A1_concept_mapping": {
    "status": "COMPLETE",
    "completed": "2026-02-XX",
    "skills_mapped": 70,
    "concepts_mapped": 1050
  }
  ```

**If you stop here:** You have all concept mappings. Resume at A2.1 (Template Development).

---

## STEP A1.3: QA the Mapping

### Validation Checklist (Per Skill)

For each skill in `tier-1-concept-mapping.json`:

```
1. Concept Count
   - [ ] Has 10-15 concepts (not 9, not 16)
   - If < 10: Add more relevant concepts
   - If > 15: Remove least relevant

2. Concept Relevance
   - [ ] Each concept answers: "Why is this useful for THIS skill?"
   - If unclear: Revise "why" field

3. Example Quality
   - [ ] Example is specific to the skill (not generic)
   - [ ] Example is copy-pasteable or at least very clear
   - If too abstract: Replace with concrete example

4. No Duplicates
   - [ ] No concept listed twice in same skill
   - If duplicate: Remove one

5. Coherence
   - [ ] Concepts form a logical progression (roughly)
   - [ ] Not random assortment
   - If poor coherence: Reorder or swap concepts
```

### Validation Script (If Running)

```powershell
# Script: Validate-Tier1-Mapping.ps1
# Checks: concept count, no duplicates, example presence

foreach ($skill in $mappings.skills) {
    $count = $skill.concepts.Count
    if ($count -lt 10 -or $count -gt 15) {
        Write-Warning "Skill $($skill.name): $count concepts (should be 10-15)"
    }
    
    $duplicates = $skill.concepts | Group-Object name | Where-Object Count -gt 1
    if ($duplicates) {
        Write-Warning "Skill $($skill.name): Duplicate concepts: $($duplicates.Name -join ', ')"
    }
    
    $missingExamples = $skill.concepts | Where-Object example -eq $null
    if ($missingExamples) {
        Write-Warning "Skill $($skill.name): Missing examples: $($missingExamples.name -join ', ')"
    }
}
```

### ✅ Checkpoint: A1.3 Complete
- [ ] All 70 skills validated
- [ ] All counts between 10-15
- [ ] No duplicates
- [ ] All examples present
- [ ] Update ENHANCEMENT_STATUS.json:
  ```json
  "A1_skill_selection": {
    "status": "COMPLETE",
    "validation": "PASSED"
  }
  ```

**If you stop here:** All A1 validation done. Resume at A2.1 (Phase A2: Template Development).

---

## PHASE A1 COMPLETE CHECKLIST

Before moving to Phase A2, ensure:

- [ ] `tier-1-skills-candidates.csv` exists (70 skills)
- [ ] `tier-1-concept-mapping.json` exists (all mappings)
- [ ] All skills have 10-15 concepts
- [ ] All concepts have "why" + "example"
- [ ] No syntax errors in JSON
- [ ] ENHANCEMENT_STATUS.json updated for all A1 phases
- [ ] Both files backed up (save copies to safe location)

**If ALL ✓, you're ready for Phase A2.**

---

## RESUMPTION FROM PHASE A1

### If Stopped During A1.1 (Skill Selection)
```
1. Open tier-1-skills-candidates.csv
2. Count skills; if < 70, add more
3. Re-run script or manually add missing skills
4. Mark A1.1 COMPLETE when count = 70
5. Move to A1.2
```

### If Stopped During A1.2 (Concept Mapping)
```
1. Open tier-1-concept-mapping.json
2. Find last skill with complete mapping
3. Resume from next unmapped skill
4. Continue mapping remaining skills
5. Mark A1.2 COMPLETE when all 70 mapped
6. Move to A1.3
```

### If Stopped During A1.3 (Validation)
```
1. Run Validate-Tier1-Mapping.ps1
2. Fix any issues found (see Validation Checklist)
3. Re-run validation until all pass
4. Mark A1.3 COMPLETE
5. Move to Phase A2
```

---

**PHASE A1 END**

Next phase: A2 - Template Development  
Location: See MASTER_ENHANCEMENT_PLAN.md SECTION 2 (Phase A2)
