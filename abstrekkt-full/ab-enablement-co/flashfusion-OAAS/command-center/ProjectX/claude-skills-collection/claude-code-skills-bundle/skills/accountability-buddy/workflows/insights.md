# Workflow: Cross-Challenge Insights

<required_reading>
**Read these reference files NOW:**
1. references/challenge-types.md (compound_learning section)
</required_reading>

<process>

## Step 1: Load All Challenge Data

For each challenge in `~/.claude/challenges/`:
- meta.json
- challenge-log.md (all entries)
- preferences.md

Build unified dataset of:
- All sessions with dates
- Topics/skills worked on
- Tools used
- Outcomes/progress

## Step 2: Detect Direct Connections

Look for skill transfer between challenges:

**Pattern: Topic overlap**
- Challenge A learning topic appears in Challenge B's tools/stack
- Example: "Learn Rust" → "Build CLI Tools" (Rust appears in both)

**Pattern: Sequential enablement**
- Skill learned in A directly used in B shortly after
- Example: "Learned async/await" in Session 12 → "Built concurrent processor" in Session 3 of another challenge

```
🔗 Compound Learning Detected

Your "Learn Rust" challenge (Session 12) where you learned async/await
directly enabled your "Build CLI Tools" challenge (Session 3) where
you built a concurrent file processor.

Skills transferred: async/await, tokio runtime
Time between: 2 days
```

## Step 3: Detect Supporting Connections

Look for correlation patterns:

**Pattern: Performance correlation**
- Sessions after certain activities show better outcomes
- Example: Workouts correlate with productive coding sessions

**Pattern: Time clustering**
- Multiple challenges checked in same time window
- Example: Morning routine enables multiple challenge check-ins

```
📊 Supporting Pattern Detected

Your morning workout (Fitness) correlates with higher productivity
in your coding sessions (Building).

Evidence:
- Sessions after workouts: avg 8/10 mood, 45 min duration
- Sessions without workouts: avg 6/10 mood, 30 min duration

Suggestion: Consider workout before coding sessions.
```

## Step 4: Detect Temporal Patterns

Analyze timing across challenges:

**Pattern: Day of week**
- Which days have most check-ins?
- Which days have breaks?

**Pattern: Time of day**
- Morning vs evening productivity
- Challenge-specific timing patterns

**Pattern: Streak correlation**
- When one streak breaks, do others follow?
- What external factors correlate with breaks?

```
📅 Timing Insights

Peak productivity: Tuesday, Thursday mornings
Challenge combinations that work: workout → coding → reading
Streak breaks often follow: weekends, travel

Your "win stack": Morning workout → 2 pomodoros on building → 
30 min learning → creative writing (highest completion rate)
```

## Step 5: Generate Compound Score

Calculate how challenges reinforce each other:

```
🔄 Compound Effect Score: 7.2/10

Your challenges are well-connected:
- Learning feeds Building (direct skill transfer)
- Fitness supports Building (energy/focus)
- Creative provides mental reset

Weakest link: Reading challenge is isolated.
Suggestion: Choose books related to your build projects.
```

## Step 6: Identify Opportunities

Based on analysis, suggest:

**Optimization opportunities:**
- "Stack your challenges: workout → code → read for best results"
- "Your Rust learning is ready to apply. Start that CLI project."

**Gap opportunities:**
- "No creative outlet. Consider adding for balance."
- "All solo activities. Maybe add a social/collaborative challenge?"

**Risk alerts:**
- "Three challenges all due today. Consider staggering cadences."
- "Weekend pattern: all streaks break. Plan for this."

## Step 7: Display Insights Dashboard

```
🔍 Cross-Challenge Insights
═══════════════════════════════════

📊 CHALLENGE HEALTH
───────────────────
Active challenges: 4
Total sessions: 47
Compound score: 7.2/10

🔗 CONNECTIONS FOUND
───────────────────
• Learn Rust → Build CLI Tools (direct skill transfer)
• Morning Workout → Building sessions (energy boost)
• Reading + Writing (creative fuel)

📈 PATTERNS
───────────────────
Best days: Tuesday, Thursday
Best sequence: Workout → Code → Learn
Streak breaks cluster on: Weekends

💡 RECOMMENDATIONS
───────────────────
1. Stack challenges in optimal order
2. Apply Rust learning to a real project
3. Stagger cadences to avoid "due day" clusters
4. Build weekend routine to protect streaks

⚠️ RISKS
───────────────────
• Reading challenge isolated - low compound effect
• Weekend streak breaks - 3 of 4 challenges affected
```

</process>

<success_criteria>
Insights analysis is complete when:
- [ ] All challenge data loaded
- [ ] Direct connections identified
- [ ] Supporting patterns detected
- [ ] Temporal patterns analyzed
- [ ] Compound score calculated
- [ ] Opportunities identified
- [ ] Risks flagged
- [ ] Dashboard displayed
</success_criteria>

<limitations>

**What this can detect:**
- Topic/skill overlap between challenges
- Temporal correlations (same-day patterns)
- Sequence patterns (A before B works better)
- Streak break patterns

**What this cannot reliably detect:**
- Causation (correlation ≠ causation)
- External factors (travel, illness, life events)
- Quality of sessions (only frequency/duration)
- Long-term compounding effects (need more data)

**Minimum data needed:**
- At least 2 challenges with 5+ sessions each
- At least 2 weeks of data
- Overlapping time periods

If insufficient data:
```
📊 Not enough data for cross-challenge insights yet.

Current: 2 challenges, 7 total sessions
Needed: 2+ challenges, 10+ sessions, 2+ weeks

Keep checking in! Insights will appear as patterns emerge.
```

</limitations>
