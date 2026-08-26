# Workflow: Check In

<required_reading>
**Read these reference files NOW:**
1. references/challenge-types.md
2. references/file-structure.md
</required_reading>

<process>

## Step 1: Load Active Challenge

```bash
# Check for active challenge
if [ -f ~/.claude/challenges/.active ]; then
  ACTIVE=$(cat ~/.claude/challenges/.active)
  echo "Active challenge: $ACTIVE"
else
  echo "No active challenge. Run /streak-new to create one."
  exit 1
fi
```

Read `~/.claude/challenges/{active}/meta.json` to get:
- Challenge type
- Current streak
- Last check-in date
- Cadence

## Step 2: Calculate Status

Determine status based on last check-in and cadence:

| Condition | Status |
|-----------|--------|
| Checked in today | ✅ Already logged |
| Within cadence | ✅ On Track |
| Due today | ⏰ Due |
| Past cadence but within grace | ⚠️ Overdue |
| Past grace period | 💔 Streak Broken |

Display status prominently with streak count.

## Step 3: Show Context

Read and display `daily-context.md`:
- Quick recap of last session
- Suggested focus based on backlog
- Any patterns noticed

## Step 4: Ask Type-Specific Questions

Based on challenge type from meta.json, ask the appropriate questions:

**Learning:**
- What did you learn today?
- Any aha moments?
- Progress on milestones?

**Building:**
- What did you ship?
- Any blockers?
- Tech decisions made?

**Fitness:**
- What workout/exercises?
- How did your body feel?
- Any PRs?

**Creative:**
- What did you create?
- Creative breakthroughs?
- Flow state achieved?

**Habit:**
- Did you complete it?
- How did it feel?
- What time?

**Custom:**
- Use questions from meta.json.custom_questions

Also ask:
- How much time did you spend?
- Energy/mood (1-10)?
- What's next?

## Step 5: Log Progress

Append to `challenge-log.md`:

```markdown
---
## Session {N} | {DATE}

**Duration:** {time}
**Focus:** {main activity}

### Progress
{what was accomplished}

### Learnings
{key insights, aha moments}

### Next
{what to do next session}

### Mood: {X}/10

---
```

## Step 6: Update Metadata

Update `meta.json`:
- Increment total_sessions
- Update last_checkin to today
- Recalculate streak
- Update milestones if any completed

## Step 7: Update Backlog

If user mentioned completing backlog items:
- Mark them done in `backlog.md`
- Ask if any new ideas to add

If user mentioned new ideas during session:
- Add to appropriate section of `backlog.md`

## Step 8: Refresh Daily Context

Update `daily-context.md` for next session:
- Today's recap
- Suggested next focus
- Relevant backlog items

## Step 9: Celebrate Progress

If milestone reached → Acknowledge it
If streak milestone (7, 14, 30, etc.) → Celebrate
If pattern detected → Share insight

Show summary:
```
✅ Session 12 logged!
🔥 Streak: 12 days
📊 This week: 5 sessions
🎯 Next milestone: Async chapter (2 sessions away based on pace)
```

</process>

<success_criteria>
Check-in is complete when:
- [ ] Active challenge loaded
- [ ] Status calculated and displayed
- [ ] Type-specific questions asked
- [ ] Progress logged to challenge-log.md
- [ ] meta.json updated with new session
- [ ] Backlog updated if needed
- [ ] daily-context.md refreshed
- [ ] Summary shown with streak and progress
</success_criteria>

<edge_cases>

**Already checked in today:**
- Show today's entry
- Ask if want to add notes
- Don't increment session count again

**Streak broken:**
- Acknowledge it without judgment
- Offer to reset streak
- "Consistency is about getting back on, not perfection"

**Long gap:**
- Show what was last worked on
- Recap to restore context
- Don't overwhelm with questions

**First check-in:**
- Congratulate on starting
- Explain what will be tracked
- Keep it light

</edge_cases>
