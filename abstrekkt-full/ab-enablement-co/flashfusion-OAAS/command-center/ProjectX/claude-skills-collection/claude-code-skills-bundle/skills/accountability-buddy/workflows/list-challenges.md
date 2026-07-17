# Workflow: List Challenges

<process>

## Step 1: Scan Challenges Directory

```bash
# List all challenge directories
ls -d ~/.claude/challenges/*/ 2>/dev/null | xargs -I {} basename {}
```

Skip `.active` file.

## Step 2: Load Metadata for Each

For each challenge directory:
- Read meta.json
- Calculate current status
- Determine if streak at risk

## Step 3: Calculate Status for Each

For each challenge, determine:

| Status | Condition |
|--------|-----------|
| ✅ Active | Is the current active challenge |
| ✅ On Track | Checked in within cadence |
| ⏰ Due | Should check in today |
| ⚠️ Overdue | Past cadence, within grace |
| 💔 Broken | Streak broken |
| 😴 Paused | Intentionally paused |

## Step 4: Display Challenge List

```
📋 Your Challenges
═══════════════════

  STATUS   NAME              TYPE       STREAK    LAST CHECK-IN
  ──────   ────              ────       ──────    ─────────────
→ ✅       learn-rust        learning   12 days   Today
  ⏰       morning-workout   fitness     5 days   Yesterday  
  ⚠️       read-12-books     learning    0 days   3 days ago
  😴       write-novel       creative   (paused)  2 weeks ago

→ = Active challenge

📊 Summary:
- 4 challenges total
- 1 on track, 1 due today, 1 overdue, 1 paused
- Total sessions across all: 47
```

## Step 5: Quick Actions

Offer quick actions:

```
Quick actions:
1. Check in to active (learn-rust)
2. Switch active challenge
3. View stats for a challenge
4. Create new challenge
```

</process>

<success_criteria>
List is complete when:
- [ ] All challenge directories found
- [ ] Metadata loaded for each
- [ ] Status calculated for each
- [ ] Formatted list displayed
- [ ] Active challenge indicated
- [ ] Summary stats shown
- [ ] Quick actions offered
</success_criteria>

<sorting_options>

**Default sort:** Active first, then by status priority (due > overdue > on track > paused)

**Alternative sorts:**
- By streak (longest first)
- By last check-in (most recent first)
- By type
- Alphabetical

</sorting_options>
