# PHASE A3: BATCH ENHANCEMENT (All 5 Batches)
## Detailed Step-by-Step Execution Runbook

**Total Duration:** Days 4-10 (5 batches, ~1.5 days per batch)  
**Depends on:** Phase A1 (concept mapping), Phase A2 (template + concept library)  
**Status checkpoints:** `tier-1-batch-[1-5]-complete`  
**Can stop/resume:** YES (after each skill, each batch)

---

## PRE-BATCH SETUP (Before Any Batch Starts)

### Prepare Your Workspace

**Step 1: Open 3 windows side-by-side**
```
Left Window:   tier-1-concept-mapping.json (lookup)
Middle Window: tier-1-enhancement-template.md (template)
Right Window:  [skill-name]/SKILL.md (file to edit)
```

**Step 2: Have these files ready**
```
✓ tier-1-concept-mapping.json (from Phase A1)
✓ tier-1-enhancement-template.md (from Phase A2)
✓ concept-descriptions.json (from Phase A2)
✓ TIER1_SKILL_DEFINITIONS.md (batch breakdown)
✓ ENHANCEMENT_STATUS.json (to track progress)
```

**Step 3: Create backup directory**
```powershell
mkdir D:\02_Development\Skills\_skill-backups
# This is where original SKILL.md files are backed up before enhancement
```

### For Each Batch

**Pre-batch checklist:**
- [ ] Have concept mappings for all skills in this batch
- [ ] Template is open and ready
- [ ] Concept library is open (for lookups)
- [ ] Backup directory ready
- [ ] ENHANCEMENT_STATUS.json open in editor

---

## DETAILED ENHANCEMENT PROCESS (Per Skill)

### The 8-Step Process (Per Skill)

Each skill follows these 8 steps. Repeat for all 15 skills in a batch.

#### **STEP 1: Load Current Skill**

```powershell
$skillName = "create-agent-skills"
$skillPath = "D:\02_Development\Skills\_master-skills\ai-agents\$skillName\SKILL.md"

# Open the file
code $skillPath

# Read frontmatter (first 10 lines or so)
# Example:
# ---
# name: create-agent-skills
# description: Expert guidance for creating Claude Code Skills
# version: 1.0
# ...
# ---
```

**What to look for:**
- YAML frontmatter (lines 1-N until closing `---`)
- Skill description
- Current content (everything after frontmatter)

**Save this info:** You'll insert enhancement block right after frontmatter closes.

#### **STEP 2: Get Concept Mapping**

Open `tier-1-concept-mapping.json` and find this skill's concepts:

```json
{
  "skill": "create-agent-skills",
  "concepts": [
    { "name": "Subagents", "why": "...", "example": "..." },
    { "name": "Hooks", "why": "...", "example": "..." },
    ...
  ],
  "count": 15
}
```

**Save this:** You'll use these 15 concepts to fill your enhancement block.

#### **STEP 3: Build Enhancement Block (Top Section)**

Using the template from A2.1, fill in the opening section:

```markdown
# Claude Code Essentials for [create-agent-skills]

This skill reaches its full power in Claude Code...

## Why These [15] Concepts Matter

Think of these concepts like a **toolkit for [agent building]:**
- Core tools: [Subagents], [Hooks], [Permissions]
- Power tools: [Slash Commands], [Plan Mode], [Tool Use], [MCP Servers]
- Advanced moves: [CLAUDE.md], [Checkpoints], [Artifacts], [Context Window], [Ultrathink]

Together, they let you **[build multi-agent systems that coordinate, validate, and scale].**
```

**Key:** Customize for this skill:
- Replace `[create-agent-skills]` with actual skill name
- Replace `[15]` with actual count
- Replace `[agent building]` with domain (from mapping)
- Replace `[Subagents], [Hooks], ...` with actual concepts (grouping by category)
- Replace `[outcome]` with what the user can achieve

#### **STEP 4: Build Concept Sections (1-15)**

For each concept in the mapping, create a section:

**Template (from A2.1):**
```markdown
### N. [CONCEPT_NAME]

**What it is:**
[Definition from concept-descriptions.json]

**Why it matters for [create-agent-skills]:**
[From mapping: the "why" field]

**Example:**
\`\`\`
[From mapping: the "example" field, OR create skill-specific one]
\`\`\`

**Learn more:**
[Link from concept-descriptions.json + link to related Tier 1 skill if applicable]

---
```

**Process (for each of 15 concepts):**
1. Open `concept-descriptions.json`
2. Find concept → copy definition
3. Open `tier-1-concept-mapping.json`
4. Find this skill → find this concept → copy "why" and "example"
5. Fill the template section
6. Move to next concept

**Example (fully populated):**
```markdown
### 1. Subagents

**What it is:**
Specialized child agents that handle specific subtasks within a parent agent's workflow.

**Why it matters for Agent Building:**
Instead of one monolithic agent doing everything, you split complex work across task-specialized agents. This is how production systems scale.

**Example:**
\`\`\`python
# Parent agent: BrandCreationAgent
class BrandCreationAgent:
  def __init__(self):
    self.research_agent = SubAgent("BrandResearchAgent")
    self.design_agent = SubAgent("BrandDesignAgent")
    self.validation_agent = SubAgent("ValidationAgent")
  
  def create_brand(self, brief):
    research = self.research_agent.run(brief)
    design = self.design_agent.run(research)
    validated = self.validation_agent.run(design)
    return validated
\`\`\`

**Learn more:**
[See create-subagents skill](D:\02_Development\Skills\_master-skills\ai-agents\create-subagents\SKILL.md)

---
```

#### **STEP 5: Build "How They Work Together" Section**

Create a narrative showing how these concepts combine for this skill:

```markdown
## How These Concepts Work Together

When [doing this skill's core activity], you start simple:
1. [Step 1 using concept A]
2. [Step 2 using concept B]
3. [Step 3 using concept C]
... (3-5 steps)

### Quick Workflow: [Skill-specific workflow title]

1. [Concrete step 1]
2. [Concrete step 2]
3. [Concrete step 3]
4. [Result: outcome]
```

**Example (for create-agent-skills):**
```markdown
## How These Concepts Work Together

When building an agent system, you start simple:
1. **Define the agent** (CLAUDE.md → instructions)
2. **Plan its workflow** (Plan Mode → decompose tasks)
3. **Add subagents** (Subagents → task specialization)
4. **Add guardrails** (Hooks → validation + safety)
5. **Checkpoint progress** (Checkpoints → resumable workflows)
6. **Expose quick actions** (Slash Commands → shortcuts)
7. **Connect tools** (Tool Use + MCP Servers → integrations)

### Quick Workflow: Building a Multi-Agent Brand Creator

1. Create parent agent with Subagents for research, design, validation
2. Add PreToolUse hook to check permissions before design operations
3. Use Plan Mode to decompose the full workflow
4. Add checkpoint after research phase (so you can resume from here)
5. Add /create-brand slash command for quick invocation
6. Document agent instructions in CLAUDE.md
7. Test with small examples, checkpoint, iterate
```

#### **STEP 6: Build "Next Steps" Section**

Create progression path:

```markdown
## Next Steps

- Start with [related Tier 1 skill 1]: [Quick description]
- Then add [related Tier 1 skill 2]: [Quick description]
- Then add [related Tier 1 skill 3]: [Quick description]
- Then add [related Tier 1 skill 4]: [Quick description]

See also:
- [Related Tier 1 skill A](path)
- [Related Tier 1 skill B](path)
- [Tier 2 skill for next level](path)
```

#### **STEP 7: Assemble Full Enhancement Block**

Combine sections 1-6 into one markdown block:

```markdown
# Claude Code Essentials for [skill]

[From STEP 3: opening section]

## The [N] Concepts (with examples)

[From STEP 4: all concept sections 1-15]

## How These Concepts Work Together

[From STEP 5: narrative + workflow]

## Next Steps

[From STEP 6: progression path]

---
```

#### **STEP 8: Insert into SKILL.md and Save**

Now combine the enhancement block with the original SKILL.md:

```powershell
# 1. Read current SKILL.md
$skillPath = "D:\02_Development\Skills\_master-skills\ai-agents\create-agent-skills\SKILL.md"
$original = Get-Content $skillPath -Raw

# 2. Extract YAML frontmatter (lines 1-N until ---)
$lines = $original -split "`n"
$frontmatterEnd = 0
for ($i = 1; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -eq "---") {
        $frontmatterEnd = $i
        break
    }
}

$frontmatter = $lines[0..$frontmatterEnd] -join "`n"
$originalContent = $lines[($frontmatterEnd + 1)..$lines.Count] -join "`n"

# 3. Build final content: frontmatter + enhancement block + original
$enhancement = @"
# Claude Code Essentials for [skill]
...
[full enhancement block from STEP 7]
...
"@

$final = $frontmatter + "`n`n" + $enhancement + "`n`n" + $originalContent

# 4. Save to temp file first (for review)
$tempPath = $skillPath + "-enhanced"
Set-Content $tempPath $final -Encoding UTF8

# 5. After manual review (see STEP QA below), rename:
# Rename-Item $skillPath ($skillPath + "-backup")  # backup original
# Rename-Item $tempPath $skillPath                  # use enhanced
```

### QA: After Enhancing Each Skill

**Before marking skill as ENHANCED:**

Open `$skillPath-enhanced` and check:

```
YAML Frontmatter:
  ✓ Valid YAML (no syntax errors)
  ✓ Closing --- at the end of frontmatter

Enhancement Block:
  ✓ Exactly 15 concepts (count them)
  ✓ Each concept has definition (1-2 sentences)
  ✓ Each concept has "why" (relevant to this skill)
  ✓ Each concept has example (code or workflow)
  ✓ Each concept has "Learn more" link
  ✓ No typos or formatting errors
  ✓ Code examples are clean and readable

Narrative Section:
  ✓ "How They Work Together" makes sense
  ✓ Quick Workflow is 3-5 steps
  ✓ "Next Steps" suggests 3-4 follow-on skills

Original Content:
  ✓ Completely preserved (no accidental deletions)
  ✓ Follows enhancement block

Overall:
  ✓ File parses as valid markdown
  ✓ File parses as valid YAML (frontmatter)
  ✓ No broken links
  ✓ No orphaned or incomplete sections
```

**If any ✗:**
- [ ] Fix in temp file
- [ ] Re-check
- [ ] Repeat until all ✓

**Once all ✓:**
- [ ] Backup original: `rename SKILL.md SKILL-backup.md`
- [ ] Use enhanced: `rename SKILL-enhanced.md SKILL.md`
- [ ] Mark in TIER1_SKILL_DEFINITIONS.md: change "PENDING" → "ENHANCED"
- [ ] Log in ENHANCEMENT_STATUS.json: update batch progress

---

## BATCH EXECUTION SCHEDULE

### BATCH 1: Agent Building (Skills 1-15)
**Days 4-5 | Expected duration: 1.5 days (60-90 min per skill)**

| Skill # | Skill Name | Expected Time | Actual Time | QA Pass | Notes |
|---------|---|---|---|---|---|
| 1 | create-agent-skills | 90 min | [fill in] | [ ] | |
| 2 | create-subagents | 90 min | [fill in] | [ ] | |
| 3 | create-hooks | 90 min | [fill in] | [ ] | |
| 4 | create-slash-commands | 90 min | [fill in] | [ ] | |
| 5 | ai-agents-workflow | 90 min | [fill in] | [ ] | |
| 6 | create-meta-prompts | 60 min | [fill in] | [ ] | |
| 7 | mcp-builder | 60 min | [fill in] | [ ] | |
| 8 | conversation-analyzer | 60 min | [fill in] | [ ] | |
| 9 | debug-like-expert | 90 min | [fill in] | [ ] | |
| 10 | staff-engineer-v3 | 90 min | [fill in] | [ ] | |
| 11 | code-auditor | 60 min | [fill in] | [ ] | |
| 12 | code-review-excellence | 60 min | [fill in] | [ ] | |
| 13 | project-bootstrapper | 60 min | [fill in] | [ ] | |
| 14 | skill-developer | 90 min | [fill in] | [ ] | |
| 15 | skill-reminder | 60 min | [fill in] | [ ] | |

**Batch 1 Checkpoint:** All 15 enhanced, all QA passed
```json
{
  "A3_batch_1": {
    "status": "COMPLETE",
    "completed": "2026-02-XX",
    "skills_done": 15,
    "avg_time_per_skill": "[X] min"
  }
}
```

**If you stop after Batch 1:** Mark A3_batch_1 COMPLETE. Resume at Batch 2, skill 16.

---

### BATCH 2: Code Generation (Skills 16-30)
**Days 5-6 | Expected duration: 1.5 days**

Same 8-step process for all 15 skills. Refer to TIER1_SKILL_DEFINITIONS.md Batch 2 for skill names.

**Batch 2 Checkpoint:**
```json
{
  "A3_batch_2": {
    "status": "COMPLETE",
    "completed": "2026-02-XX",
    "skills_done": 15
  }
}
```

---

### BATCH 3: Backend & Full-Stack (Skills 31-45)
**Days 7-8 | Expected duration: 1.5 days**

Same process. Refer to TIER1_SKILL_DEFINITIONS.md Batch 3.

**Batch 3 Checkpoint:**
```json
{
  "A3_batch_3": {
    "status": "COMPLETE",
    "completed": "2026-02-XX",
    "skills_done": 15
  }
}
```

---

### BATCH 4: Architecture & Design (Skills 46-60)
**Days 8-9 | Expected duration: 1.5 days**

Same process. Refer to TIER1_SKILL_DEFINITIONS.md Batch 4.

**Batch 4 Checkpoint:**
```json
{
  "A3_batch_4": {
    "status": "COMPLETE",
    "completed": "2026-02-XX",
    "skills_done": 15
  }
}
```

---

### BATCH 5: Debugging & Testing (Skills 61-70)
**Days 9-10 | Expected duration: 1 day (10 skills)**

Same process. Refer to TIER1_SKILL_DEFINITIONS.md Batch 5.

**Batch 5 Checkpoint:**
```json
{
  "A3_batch_5": {
    "status": "COMPLETE",
    "completed": "2026-02-XX",
    "skills_done": 10
  }
}
```

---

## RESUMPTION LOGIC (Mid-Batch or Between Batches)

### Scenario: Stopped in Batch 2, Skill 20 (github-actions-templates)

**You completed:** Skills 16-19  
**Next:** Skill 20

**To resume:**
1. Open TIER1_SKILL_DEFINITIONS.md
2. Find Batch 2, Skill 20 (github-actions-templates)
3. Run enhancement 8-step process starting at STEP 1
4. Continue through Batch 2

**Update ENHANCEMENT_STATUS.json:**
```json
{
  "A3_batch_2": {
    "status": "IN_PROGRESS",
    "last_skill_completed": 19,
    "next_skill": "github-actions-templates",
    "skills_done": 19,
    "skills_remaining": 11
  }
}
```

### Scenario: Completed Batch 2, About to Start Batch 3

**You completed:** All 15 in Batch 2  
**Next:** Batch 3, Skill 31

**Update ENHANCEMENT_STATUS.json:**
```json
{
  "A3_batch_2": {
    "status": "COMPLETE",
    "completed": "2026-02-XX"
  },
  "A3_batch_3": {
    "status": "PENDING",
    "started": null
  }
}
```

When resuming: Start at Batch 3, Skill 31 (api-design-principles).

---

## TIME TRACKING (For Planning Future Work)

After each skill, note actual time in the batch table above:

```
Skill 1 (create-agent-skills): 
  Expected: 90 min
  Actual: 85 min
  ✓ QA passed
```

After each batch, calculate average:

```
Batch 1 Total Time: 1100 min (18.3 hours for 15 skills)
Average per skill: 73 min
Batch 1 Efficiency: 90% of estimate (slightly faster than expected)
```

This helps you forecast remaining batches and adjust timeline.

---

## TROUBLESHOOTING (If Stuck)

### Problem: "I'm not sure which concepts apply to this skill"

**Solution:** Consult ENHANCEMENT_STATUS.json decision tree (SECTION 4 of MASTER_ENHANCEMENT_PLAN.md)

### Problem: "The example doesn't make sense"

**Solution:** 
1. Check if example is skill-specific (not generic)
2. If too generic: replace with skill-specific example
3. If too abstract: add step-by-step explanation
4. If wrong domain: find better example from mapping

### Problem: "I'm taking too long per skill"

**Solution:**
1. Are you jumping between windows too much? Keep 3 windows side-by-side.
2. Are you over-thinking examples? They don't have to be perfect, just clear.
3. Are you doing full QA after every skill? Skip QA per-skill, do it per-batch instead.

### Problem: "Concept mappings don't match the template"

**Solution:**
- Concept mappings from A1 might differ from template
- Template is generic; mappings are skill-specific
- Trust the mappings (from A1). Use those 10-15 concepts, in that order.

---

## QUALITY GATE: PER-BATCH QA

After completing all 15 skills in a batch (before marking COMPLETE):

```
1. Random sample: Pick 3 random skills from this batch
2. For each sample skill:
   ✓ Open SKILL.md
   ✓ Read entire enhancement block
   ✓ Verify: 10-15 concepts, each with definition+why+example
   ✓ Verify: no typos, no broken markdown
   ✓ Verify: original content still intact below enhancement

3. If any sample fails: Review ALL 15 in batch for issues

4. Once all samples pass: Mark batch COMPLETE
```

---

**PHASE A3 END**

Next phase: A4 - Testing & Validation  
Location: See PHASE_A4_RUNBOOK.md (final testing before deployment)
