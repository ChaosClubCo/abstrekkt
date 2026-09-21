# Practical AI Builder Enablement — 1-Day Workshop Kit

> Designed for groups of 6-12 beginners who have access to Claude or similar tools but haven't built anything substantive. Goal: each participant ships one working artifact (mini-app, prompt template, or workflow) by end of day. This is the workshop curriculum that pairs with the Claude Community Ambassador application.

**Time budget:** 6 hours total — 4 hours instruction, 2 hours breakout build, plus 30 min wrap.
**Cohort size:** 6-12 participants for in-person, 8-15 for remote.
**Prerequisites:** Each participant brings a problem from their actual work. No coding required.
**Outcome:** Each participant leaves with a shipped artifact, a CLAUDE.md template configured for their context, and a written 30-day continuation plan.

---

## Agenda

| Time | Block | Format |
|------|-------|--------|
| 0:00–0:15 | Welcome + workshop frame | Instructor monologue |
| 0:15–0:45 | Block 1: What AI is and isn't (in builder terms) | Discussion + slides |
| 0:45–1:00 | Break |
| 1:00–2:00 | Block 2: The diagnostic prompt — using AI as a thinking partner | Live demo + paired exercise |
| 2:00–3:00 | Block 3: First build — Claude or Base44 mini-app | Solo work, instructor floats |
| 3:00–3:30 | Lunch |
| 3:30–4:30 | Block 4: CLAUDE.md and the working configuration | Instructor walkthrough + participant configuration |
| 4:30–5:30 | Block 5: Breakout build — ship the artifact | Solo work, instructor support |
| 5:30–6:00 | Wrap: demo round + 30-day plans + feedback | Each participant shows their work |

---

## Block 1 — What AI is and isn't (30 min)

**Goal:** Shift the participant's mental model from "AI writes for me" to "AI thinks alongside me." This is the single most important reframe of the day.

### Talking points

1. **AI doesn't replace judgment. It surfaces it.** Most beginners use AI as a generator — write me an email, write me a function. The build skill is using AI as a *diagnostic mirror*: forcing yourself to articulate why something is broken before asking for a fix.

2. **The output is only as good as the constraint.** A vague prompt produces vague output. A specific, constrained prompt with explicit failure modes produces something usable. We'll practice this.

3. **AI is a confidence amplifier in both directions.** It will tell you a wrong answer with the same confidence as a right one. The builder's job is to not be impressed by the confidence — to verify.

4. **You are not behind.** Most "AI experts" online have built less than you'll build today. The actual frontier is people *using* AI on their own work, not people writing about AI.

### Discussion prompt (5 min)

Each participant: name one task they currently do where they suspect AI could help, and one task where they suspect it can't. Share with the room. The instructor will refer back to these throughout the day.

---

## Block 2 — The Diagnostic Prompt (60 min)

**Goal:** Demonstrate and practice the core skill of using AI to sharpen thinking, not generate output.

### Live demo (15 min)

The instructor takes one of the participant's "where AI could help" tasks and works through it live. The pattern:

1. State the task to the AI in one paragraph
2. AI offers a solution
3. Instructor *doesn't accept it* — instead asks: "What are the assumptions you made? What would change your answer?"
4. Iterate three times until the AI's response actually fits the situation
5. Compare the first attempt to the final attempt

### The diagnostic prompt template

```
I'm trying to [specific task with concrete details].

Constraints:
- [constraint 1]
- [constraint 2]
- [constraint 3]

What I've tried so far: [brief summary]

What I want from you: not a solution yet. First tell me:
1. What assumptions am I making that might be wrong?
2. What questions would change your answer?
3. What's the failure mode I'm not seeing?

Then ask me what I want before generating anything.
```

### Paired exercise (30 min)

Participants pair up. Each takes 15 minutes:
- Person A: brings a real task, runs the diagnostic prompt with Claude
- Person B: watches, notes when the prompt is too vague or too specific
- Switch

Debrief (15 min): What surprised you? Where did the AI push back usefully?

---

## Block 3 — First Build: Mini-App or Prompt Library (60 min)

**Goal:** Each participant ships *something* by lunch. Doesn't have to be polished — has to exist.

### Two paths

**Path A: Base44 mini-app.** For participants who want to ship a working tool. Template: a single-purpose app that solves one problem from their work (e.g., interview note synthesizer, weekly retro generator, deal qualifier).

**Path B: Prompt library.** For participants whose work is text-heavy (writing, analysis, synthesis). Template: a markdown file with 5-10 prompts they'd actually use, structured with role, constraints, and output schema.

### Path A — Base44 mini-app starter template

```
App name: [your-tool-name]
Purpose: [one sentence — what does it do, who's it for]

Entities:
- [Entity 1]: [fields needed]
- [Entity 2]: [fields needed]

UI screens:
- [Screen 1]: [what's on it]
- [Screen 2]: [what's on it]

AI integration:
- [Where does Claude/AI get called? What's the input, what's the output?]

Success criteria:
- [The single test of "did this work" — be specific]
```

Participants paste this into Base44 and iterate with the platform's natural-language interface.

### Path B — Prompt library starter template

```
Library name: [your-name]'s [domain] prompts

Prompt 1: [name]
Use when: [trigger phrase]
Role: You are [specific role with constraints]
Input schema: [what the user provides]
Output schema: [what you return — be specific about format]
Quality gates: [how to know the output is good]

[Repeat for prompts 2-N]
```

### Instructor role during build (60 min)

Float between participants. Each participant gets ~5-10 minutes of attention. Watch for:
- Stuck on platform mechanics → unblock fast
- Stuck on conceptual framing → ask the diagnostic prompt
- Going down a rabbit hole → reframe to the success criterion

---

## Block 4 — CLAUDE.md and the Working Configuration (60 min)

**Goal:** Each participant configures their personal AI working environment so future sessions don't start from zero.

### What CLAUDE.md is

A markdown file that lives at the root of any project, telling Claude (or any AI assistant) the context, rules, and preferences for working on that project. The most leveraged single artifact a builder can create.

### Template

```markdown
# CLAUDE.md — [Project name]

## Context
[1 paragraph: what is this project, who is it for, what's the current state]

## My role and current focus
[1 paragraph: what I'm doing, what stage I'm at, what I'm not doing]

## How I want to work
- [Communication preference: e.g., terse, no fluff, push back when I'm wrong]
- [Output preference: e.g., production-ready code only, no placeholders]
- [Decision-making default: e.g., show 2-3 options with tradeoffs before picking one]

## Hard rules (never violated)
- [Security: e.g., no secrets in client code]
- [Naming: e.g., never use "MSP" externally]
- [Quality: e.g., all code includes tests]

## What I'm avoiding right now
[1 paragraph: things that look adjacent but I'm explicitly not doing]

## Useful context links
- [Project state doc]
- [Architecture decisions]
- [Anything else load-bearing]
```

### Configuration exercise (40 min)

Each participant fills in their own CLAUDE.md for their workshop project (the artifact they're building). The instructor reviews 2-3 examples publicly to model the approach.

### The discipline

Every new AI session for this project starts with the CLAUDE.md loaded. After each session, update the doc with anything that changed. The doc is the project's memory — without it, every session re-litigates decisions that were already made.

---

## Block 5 — Breakout Build & Ship (60 min)

**Goal:** Take the morning's first-build artifact and *ship it* — meaning move it from "draft" to "I would actually use this."

### Quality bar (read aloud at start)

By the end of this block, your artifact must:
- [ ] Solve a specific problem you actually have (not a hypothetical)
- [ ] Run end-to-end without manual intervention
- [ ] Be something you'd send to a colleague without explanation
- [ ] Have a name that isn't "untitled"

### Instructor support

Same as Block 3 — float, unblock, refocus to success criteria.

---

## Wrap (30 min)

### Demo round (15 min)

Each participant gets 1-2 minutes to show what they built. Format:
- "I built X."
- "It solves Y for me."
- "The thing that surprised me was Z."

This is the most important part of the workshop. People who ship and demo internalize the day's lesson; people who don't, lose it within 48 hours.

### 30-day plan (10 min)

Each participant writes 3 commitments for the next 30 days:
1. **One artifact** they will ship publicly (own site, GitHub, internal blog)
2. **One CLAUDE.md** they will maintain and iterate on
3. **One person** they will share their build with for feedback

### Feedback form (5 min)

See [feedback form template, end of this document].

---

## AI Fluency Checklist (handout)

Beginner participants should be able to do all of these by end of workshop. Mark each:

**Diagnostic prompt:**
- [ ] Can write a prompt that asks the AI to challenge my assumptions before generating
- [ ] Can identify when an AI response is confident-but-wrong
- [ ] Can iterate a prompt 3 times to get to a usable answer
- [ ] Can recognize the difference between AI as generator vs. AI as thinking partner

**Build:**
- [ ] Can scope a single-purpose tool from a real problem
- [ ] Can define success criteria before starting to build
- [ ] Can ship something that runs end-to-end (even if rough)
- [ ] Can update a tool based on actual use (not theoretical edge cases)

**Working configuration:**
- [ ] Have a CLAUDE.md (or equivalent) for at least one project
- [ ] Update it regularly enough that future sessions have context
- [ ] Have at least 3 prompts I reuse (not just one-off generations)

**Boundary discipline:**
- [ ] Know what I won't ask AI to do (privacy, judgment-heavy decisions, things requiring local context)
- [ ] Have a way to verify AI output before trusting it
- [ ] Don't paste secrets, customer data, or unreleased information into AI tools

---

## Feedback Form (template)

```
Workshop date: ___________
Your name (optional): ___________

1. What did you build today?

2. What's one specific thing that clicked for you?

3. What's one thing that didn't land? (Be specific — what was confusing, what felt rushed, what felt like filler.)

4. On a scale of 1-10, how likely are you to use what you built in the next 14 days?
   ___________

5. What would have made this workshop more useful?

6. Would you recommend this workshop to a peer? Why / why not?

7. (Optional) Permission to use your build as a public example, with attribution? Y / N
```

---

## Proof-of-work capture (instructor checklist)

After each workshop, capture:

- [ ] Workshop date, location, cohort size
- [ ] Photo of the room (with permission) or screenshot of remote session
- [ ] Anonymized list of what each participant built
- [ ] 2-3 direct quotes from the feedback form (with permission)
- [ ] What worked, what didn't, what to change next time
- [ ] Date the proof-of-work post (LinkedIn, blog) is published — within 7 days

This artifact is what the Claude Community Ambassador application references. Without it, the workshop is invisible to the application reviewer. The capture is the proof.
