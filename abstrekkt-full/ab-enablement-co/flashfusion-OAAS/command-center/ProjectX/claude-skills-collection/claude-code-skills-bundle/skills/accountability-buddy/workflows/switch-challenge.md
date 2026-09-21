# Workflow: Switch Challenge

<process>

## Step 1: Check If Name Provided

If challenge name provided in command → Validate and switch
If no name provided → Show list and ask

## Step 2: Show Available Challenges (if needed)

```
📋 Available Challenges:

1. learn-rust (learning) - 12 day streak ← Currently Active
2. morning-workout (fitness) - 5 day streak
3. read-12-books (learning) - Due today
4. write-novel (creative) - Paused

Which challenge do you want to activate?
```

## Step 3: Validate Challenge Exists

Check that `~/.claude/challenges/{name}/` exists.

If not found:
```
❌ Challenge "{name}" not found.

Available challenges:
- learn-rust
- morning-workout
- read-12-books

Did you mean one of these?
```

## Step 4: Switch Active Challenge

```bash
echo "{challenge-name}" > ~/.claude/challenges/.active
```

## Step 5: Load New Challenge Context

Read the new challenge's files:
- meta.json (status, streak)
- daily-context.md (current focus)

## Step 6: Display Confirmation

```
✅ Switched to: {challenge-name}

📋 Type: {type}
🎯 Goal: {goal}
🔥 Streak: {streak} days
📅 Last check-in: {date}
⏰ Status: {status}

Quick recap from last session:
{last_session_summary}

Ready to check in? Run /streak
```

## Step 7: Warn If Switching Away from Due Challenge

If previous active challenge was due or overdue:
```
⚠️ Note: Your previous challenge "learn-rust" is due for check-in.
   Streak at risk if you don't check in by {deadline}.
```

</process>

<success_criteria>
Switch is complete when:
- [ ] Target challenge identified
- [ ] Challenge validated to exist
- [ ] .active file updated
- [ ] New challenge context loaded
- [ ] Confirmation displayed
- [ ] Warning shown if previous challenge at risk
</success_criteria>
