# Workflow: View Stats

<required_reading>
**Read these reference files NOW:**
1. references/file-structure.md
</required_reading>

<process>

## Step 1: Determine Which Challenge

If challenge name provided → Use that
If no name provided → Use active challenge
If no active challenge → Ask which one

## Step 2: Load Challenge Data

Read from `~/.claude/challenges/{name}/`:
- meta.json (streak, sessions, milestones)
- challenge-log.md (session history)

## Step 3: Calculate Statistics

**Core Stats:**
- Total sessions
- Current streak
- Longest streak
- Days since started
- Completion rate (sessions / expected based on cadence)

**Time Stats:**
- Average session duration (if tracked)
- Total time invested
- Most active day of week

**Milestone Stats:**
- Completed milestones
- Remaining milestones
- Estimated completion (based on pace)

**Trend Stats:**
- This week vs last week (sessions)
- This month vs last month
- Streak history (visualize ups and downs)

## Step 4: Generate Achievements

Check for and display earned achievements:

| Achievement | Criteria |
|-------------|----------|
| 🔥 First Flame | 3-day streak |
| 🌟 Week Warrior | 7-day streak |
| 💪 Fortnight Force | 14-day streak |
| 🏆 Monthly Master | 30-day streak |
| 🎯 Milestone Hunter | 3 milestones completed |
| 📚 Dedicated Learner | 20 sessions (learning type) |
| 🚀 Ship It | 5 features shipped (building type) |
| 💪 Iron Will | 15 workouts (fitness type) |
| 🎨 Creative Spark | 10 creations (creative type) |
| ⚡ Habit Hero | 21-day habit streak |
| 🔄 Comeback Kid | Returned after broken streak |
| 📈 Consistency Crown | 80%+ completion rate over 30 days |

## Step 5: Display Stats Dashboard

```
📊 Stats: {challenge-name}
═══════════════════════════════════

🎯 Goal: {goal}
📅 Started: {date} ({days} days ago)

📈 PROGRESS
───────────
Sessions:     {total_sessions}
Completion:   {completion_rate}%
Time Invested: {total_time}

🔥 STREAKS
───────────
Current:  {current_streak} days
Longest:  {longest_streak} days
Status:   {status_emoji} {status_text}

✅ MILESTONES ({completed}/{total})
───────────
{milestone_list}

🏆 ACHIEVEMENTS
───────────
{achievements_earned}

📅 THIS WEEK
───────────
{weekly_breakdown}

💡 INSIGHTS
───────────
{generated_insights}
```

## Step 6: Generate Insights

Analyze patterns and provide actionable insights:

- "You're most productive on {day}. Consider scheduling challenging work then."
- "Your streak broke after {pattern}. Maybe adjust cadence?"
- "At current pace, you'll hit {milestone} in {X} days."
- "Sessions after {time} tend to be shorter. Morning might work better."

## Step 7: Suggest Next Actions

Based on stats, suggest:
- If streak at risk → "Check in soon to maintain streak"
- If milestone close → "2 more sessions to hit {milestone}!"
- If completion rate low → "Consider switching to every-2-days cadence"
- If doing well → "Great consistency! Ready for a stretch goal?"

</process>

<success_criteria>
Stats view is complete when:
- [ ] Challenge data loaded
- [ ] Core statistics calculated
- [ ] Achievements checked and displayed
- [ ] Stats dashboard formatted and shown
- [ ] Insights generated
- [ ] Next actions suggested
</success_criteria>

<visualization_options>

**Text-based streak visualization:**
```
Last 14 days: ✅✅✅✅✅⬜✅✅✅⚠️✅✅✅✅
```

**Weekly grid:**
```
       M  T  W  T  F  S  S
Week 1: ✅ ✅ ✅ ✅ ✅ ⬜ ⬜
Week 2: ✅ ✅ ⚠️ ✅ ✅ ⬜ ⬜
```

**Progress bar:**
```
Milestone: Async Chapter
[████████░░░░░░░░] 50% (4/8 sections)
```

</visualization_options>
