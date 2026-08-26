---
name: accountability-buddy
description: Helps build and debug accountability buddy processes. Track any personal challenge (learning, fitness, building, creative, habits) with type-adaptive check-ins, progress logging, and cross-challenge insights. Use when starting a new challenge, checking in daily, viewing stats, or analyzing patterns across multiple goals.
---

## Core Workflow


<essential_principles>

## How This Skill Works

Think of this as a personal coach that adapts to what you're tracking. The same file structure works for any challenge - only the questions and content adapt.

### 1. Type-Adaptive System

Same files, different content based on challenge type:
- **preferences.md** → For code: stack/tools. For fitness: equipment/workout types. For learning: resources/style.
- **backlog.md** → Ideas, tasks, things to try next
- **challenge-log.md** → Progress entries with type-specific fields
- **daily-context.md** → Today's focus and session setup

### 2. Challenge Types

| Type | Best For | Check-in Focus |
|------|----------|----------------|
| **learning** | Courses, books, skills | Aha moments, milestones, resources |
| **building** | Projects, shipping | What shipped, blockers, tech decisions |
| **fitness** | Workouts, health | Exercises, body feel, PRs |
| **creative** | Art, writing, music | What created, inspiration, flow state |
| **habit** | Routines, consistency | Completion, feeling, streak |
| **custom** | Anything else | User-defined questions |

### 3. Core Philosophy

- **Bite-sized wins** → Even small progress counts. Log it.
- **Follow your mood** → If not feeling top priority, work on something else. Still log.
- **Doesn't have to be perfect** → Consistency > perfection.
- **Context preservation** → Logging brings back context fast.

### 4. File Locations

All challenges stored in: `~/.claude/challenges/{challenge-name}/`

Active challenge tracked in: `~/.claude/challenges/.active`

</essential_principles>

<intake>

What would you like to do?

1. **Check in** to my active challenge
2. **Create** a new challenge
3. **View stats** for a challenge
4. **List** all my challenges
5. **Switch** active challenge
6. **Insights** across challenges
7. Something else

**Wait for response before proceeding.**

</intake>

<routing>

| Response | Intent | Workflow |
|----------|--------|----------|
| 1, "check in", "daily", "log", "streak" | Daily check-in | `workflows/check-in.md` |
| 2, "create", "new", "start" | New challenge | `workflows/create-challenge.md` |
| 3, "stats", "progress", "how am I doing" | View statistics | `workflows/view-stats.md` |
| 4, "list", "show all", "challenges" | List challenges | `workflows/list-challenges.md` |
| 5, "switch", "change", "activate" | Switch active | `workflows/switch-challenge.md` |
| 6, "insights", "patterns", "connections" | Cross-challenge analysis | `workflows/insights.md` |
| 7, other | Clarify intent, then route |

**After reading the workflow, follow it exactly.**

</routing>

<reference_index>

## Domain Knowledge

All in `references/`:

**Challenge Types:** challenge-types.md (type definitions, questions, preferences structure)
**File Structure:** file-structure.md (what goes where, templates)

</reference_index>

<workflows_index>

| Workflow | Purpose |
|----------|---------|
| check-in.md | Log daily progress with type-adaptive questions |
| create-challenge.md | Guided setup for new challenge |
| view-stats.md | Show progress, streaks, achievements |
| list-challenges.md | Display all challenges with status |
| switch-challenge.md | Change active challenge |
| insights.md | Cross-challenge pattern detection |

</workflows_index>

<quick_commands>

## Slash Command Quick Reference

| Command | Action |
|---------|--------|
| `/streak` | Check in to active challenge |
| `/streak-new` | Create a new challenge |
| `/streak-stats` | View progress and achievements |
| `/streak-list` | List all challenges |
| `/streak-switch [name]` | Switch active challenge |
| `/streak-insights` | Cross-challenge analysis |

</quick_commands>
