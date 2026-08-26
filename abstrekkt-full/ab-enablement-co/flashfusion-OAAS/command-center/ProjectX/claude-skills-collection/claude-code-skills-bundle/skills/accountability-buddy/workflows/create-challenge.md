# Workflow: Create Challenge

<required_reading>
**Read these reference files NOW:**
1. references/challenge-types.md
2. references/file-structure.md
</required_reading>

<process>

## Step 1: Ask Challenge Type

**Ask the user:**

What type of challenge is this?

1. **Learning** - Courses, books, skill acquisition
2. **Building** - Projects, shipping, side projects
3. **Fitness** - Workouts, health goals
4. **Creative** - Art, writing, music, content
5. **Habit** - Routines, consistency goals
6. **Custom** - Something else (you define the questions)

**Wait for response.**

## Step 2: Gather Core Info

Ask based on type selected:

**All types:**
- What's a short name for this challenge? (lowercase-with-hyphens)
- What's your goal? (1-2 sentences)
- How often do you want to check in?
  - Daily
  - Every 2 days
  - Every 3 days
  - Weekly

## Step 3: Type-Specific Questions

**Learning:**
- What are you learning? (topic/subject)
- What resources will you use? (books, courses, platforms)
- What tools do you need? (IDE, apps)
- What's your learning style? (hands-on, reading, video, mixed)
- What milestones will you track?

**Building:**
- What are you building? (project name + description)
- What's your tech stack?
- What tools will you use?
- Where will you deploy?
- What's MVP? What milestones?

**Fitness:**
- What's your focus? (strength, cardio, flexibility, sport)
- What equipment do you have?
- What workout types/split?
- Where will you work out?
- Best workout times?
- Rest days?
- Any constraints or injuries?

**Creative:**
- What medium? (writing, visual, music, video)
- What tools/software?
- What style or genre?
- Publishing anywhere?
- Daily target? (words, minutes, pieces)

**Habit:**
- What's the habit?
- What's the trigger/cue?
- What's the reward?
- Best time of day?
- What's the minimum viable version? (for hard days)

**Custom:**
- What do you want to track?
- What questions should I ask at each check-in? (3-5 questions)
- What preferences should I remember?

## Step 4: Create Directory Structure

```bash
CHALLENGE_NAME="{user-provided-name}"
mkdir -p ~/.claude/challenges/$CHALLENGE_NAME
```

## Step 5: Generate meta.json

Create `meta.json` with:

```json
{
  "name": "{name}",
  "type": "{type}",
  "goal": "{goal}",
  "cadence": "{cadence}",
  "created": "{today}",
  "current_streak": 0,
  "longest_streak": 0,
  "total_sessions": 0,
  "last_checkin": null,
  "milestones": [
    { "name": "{milestone1}", "done": false },
    { "name": "{milestone2}", "done": false }
  ],
  "custom_questions": []  // Populate for custom type
}
```

## Step 6: Generate preferences.md

Use templates from `templates/` based on type.

Fill in with user's answers from Step 3.

Example for learning:

```markdown
# Preferences: {challenge-name}

## Topics & Resources
- **Learning:** {topic}
- **Resources:** {resources}
- **Tools:** {tools}

## Learning Style
- **Approach:** {style}
- **Practice:** {practice_approach}

## Milestones
- [ ] {milestone1}
- [ ] {milestone2}
- [ ] {milestone3}

## Notes
{any additional context}
```

## Step 7: Initialize Other Files

**backlog.md:**
```markdown
# Backlog: {challenge-name}

## High Priority
- [ ] {first thing to try}

## Ideas
- [ ] 

## Someday/Maybe
- [ ] 
```

**challenge-log.md:**
```markdown
# Challenge Log: {challenge-name}

**Goal:** {goal}
**Started:** {date}
**Cadence:** {cadence}

---
```

**daily-context.md:**
```markdown
# Today's Context

**Date:** {today}
**Challenge:** {name}
**Status:** 🆕 New challenge!

## Getting Started
This is your first session. Let's make it count!

## Suggested First Steps
Based on your preferences:
- {suggested first action}

## Backlog Preview
- {first backlog item}
```

## Step 8: Set as Active (Optional)

Ask: "Make this your active challenge?"

If yes:
```bash
echo "{challenge-name}" > ~/.claude/challenges/.active
```

## Step 9: Confirm Setup

Display summary:

```
✅ Challenge created: {name}

📋 Type: {type}
🎯 Goal: {goal}
📅 Cadence: {cadence}
📁 Location: ~/.claude/challenges/{name}/

Files created:
- meta.json
- preferences.md  
- backlog.md
- challenge-log.md
- daily-context.md

Ready to start? Run /streak to check in!
```

</process>

<success_criteria>
Challenge creation is complete when:
- [ ] Type selected
- [ ] Core info gathered (name, goal, cadence)
- [ ] Type-specific questions answered
- [ ] Directory created
- [ ] meta.json populated
- [ ] preferences.md generated with type-specific content
- [ ] backlog.md initialized
- [ ] challenge-log.md initialized
- [ ] daily-context.md initialized
- [ ] Active status set (if requested)
- [ ] Summary displayed
</success_criteria>

<validation>

**Name validation:**
- Lowercase with hyphens only
- No spaces or special characters
- Not already in use

**Cadence validation:**
- Must be one of: daily, every-2-days, every-3-days, weekly

**Goal validation:**
- Should be specific and measurable if possible
- "Get fit" → "Build consistent 3x/week workout habit"

</validation>
