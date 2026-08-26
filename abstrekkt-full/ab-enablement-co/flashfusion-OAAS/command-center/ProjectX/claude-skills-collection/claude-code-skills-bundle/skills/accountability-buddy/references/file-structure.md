# File Structure Reference

<directory_structure>

## Challenge Directory Layout

```
~/.claude/challenges/
├── .active                    # Contains name of active challenge
├── {challenge-name}/
│   ├── meta.json             # Challenge metadata (type, cadence, created, etc.)
│   ├── preferences.md        # Type-specific preferences and context
│   ├── backlog.md            # Ideas, tasks, things to try
│   ├── challenge-log.md      # Progress entries (append-only)
│   └── daily-context.md      # Today's focus (refreshed each session)
```

</directory_structure>

<file_descriptions>

## meta.json

Stores challenge configuration:

```json
{
  "name": "learn-rust",
  "type": "learning",
  "goal": "Master Rust fundamentals in 30 days",
  "cadence": "daily",
  "created": "2025-01-15",
  "current_streak": 12,
  "longest_streak": 12,
  "total_sessions": 12,
  "last_checkin": "2025-01-26",
  "milestones": [
    { "name": "Ownership chapter", "done": true },
    { "name": "Async/await", "done": false }
  ],
  "custom_questions": []  // Only for type: custom
}
```

## preferences.md

Type-specific context. Structure varies by challenge type.

Example (learning):
```markdown
## Topics & Resources
- **Learning:** Rust programming
- **Resources:** Rustlings, The Rust Book
- **Tools:** VS Code, cargo

## Learning Style
- **Approach:** hands-on with reading
- **Practice:** exercises after each chapter

## Milestones
- [ ] Complete Rustlings
- [ ] Build small CLI tool
- [ ] Understand async/await
```

Example (fitness):
```markdown
## Workout Style & Equipment
- **Focus:** strength training
- **Equipment:** home gym - dumbbells, pull-up bar
- **Workout types:** push/pull/legs split

## Location & Schedule
- **Where:** home gym
- **Best days:** weekdays morning
- **Rest days:** Wednesday, Sunday

## Constraints
- **Injuries:** recovering from knee injury
- **Avoid:** heavy squats for now
```

## backlog.md

Running list of ideas, tasks, and things to explore:

```markdown
# Backlog

## High Priority
- [ ] Try the lifetimes chapter (heard it's tricky)
- [ ] Build a small CLI tool to practice

## Ideas
- [ ] Explore async runtime options
- [ ] Read "Zero to Production in Rust"

## Someday/Maybe
- [ ] Contribute to a Rust open source project
- [ ] Try embedded Rust
```

## challenge-log.md

Append-only progress log. Each entry timestamped:

```markdown
# Challenge Log

---
## Session 12 | 2025-01-26

**Duration:** 45 min
**Focus:** Async/await fundamentals

### Progress
- Completed async chapter exercises
- Built first async function

### Learnings
- `tokio` vs `async-std` - went with tokio
- Pin<Box<T>> still confusing

### Next
- Practice more async patterns
- Try building concurrent file processor

### Mood:** 8/10

---
## Session 11 | 2025-01-25
...
```

## daily-context.md

Refreshed at start of each session:

```markdown
# Today's Context

**Date:** 2025-01-26
**Challenge:** learn-rust
**Streak:** 12 days 🔥

## Quick Recap
Last session you learned about async/await basics and built your first async function.

## Suggested Focus
- Continue async patterns
- Try the concurrent file processor from backlog

## Time Available
[Ask at check-in]

## Backlog Items to Consider
- Try the lifetimes chapter (marked high priority)
```

</file_descriptions>

<streak_calculation>

## Streak Logic

**Current streak:** Consecutive check-ins within cadence + grace period

**Cadence check:**
- daily: must check in every day (1 day grace)
- every-2-days: must check in every other day (2 day grace)
- weekly: must check in once per week (7 day grace)

**Streak breaks when:**
- Days since last check-in > cadence + grace period

**Streak survives when:**
- Check-in happens within grace period
- Logged entry exists for the period

</streak_calculation>

<status_indicators>

## Challenge Status

| Status | Meaning | Visual |
|--------|---------|--------|
| ✅ On Track | Checked in within cadence | Green |
| ⏰ Due | Should check in today | Yellow |
| ⚠️ Overdue | Past grace period, streak at risk | Orange |
| 💔 Streak Broken | Exceeded grace period | Red |
| 😴 Paused | Intentionally paused | Gray |

</status_indicators>
