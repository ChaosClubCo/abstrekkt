# SparkAcademy Onboarding Email Sequence
**5 emails. Drop into Resend, ConvertKit, or any ESP.**
**Voice: Kyle direct — confident, specific, no fluff.**

---

## Variables Used

- `{{first_name}}` — student's first name (fallback: "there")
- `{{path_name}}` — learning path they selected (e.g., "Foundation")
- `{{course_name}}` — first course in their path
- `{{course_url}}` — direct link to first lesson

---

## Email 1 — Welcome (sent immediately)

**Subject:** You're in. Here's where to start.
**Preview text:** Skip the platform tour. Start with the lesson that matters.

```
Hey {{first_name}},

Welcome to SparkAcademy. You picked the {{path_name}} path — good choice.

Most learning platforms make you click around for 20 minutes before you do anything useful. We're skipping that.

Your first lesson is here: {{course_url}}

It takes about 10 minutes. By the end of it, you'll have written one prompt that you can actually use at work today.

That's the whole approach. Every lesson ends with something you can ship.

Talk soon,
Kyle
Founder, FlashFusion

P.S. Reply to this email if you get stuck. I read everything.
```

---

## Email 2 — Day 2 (24 hours after enrollment)

**Subject:** The mistake most people make on day 2
**Preview text:** Spoiler: they don't actually do the practice prompt.

```
{{first_name}},

Quick check-in. Did you do the practice prompt from yesterday's lesson?

Not asking to be annoying. Asking because here's what happens otherwise:

You read lesson 1. It makes sense. You move to lesson 2. That makes sense too. Three lessons in, you've consumed a lot of content and used AI exactly zero new times.

That's the most common SparkAcademy failure mode. People treat it like Netflix instead of like a gym.

The fix is small: actually do the practice prompt at the end of each lesson. Even badly. Even if the output isn't perfect. The work is in the doing.

If you haven't done lesson 1's practice prompt yet, do it now. It takes 5 minutes.

→ {{course_url}}

Kyle
```

---

## Email 3 — Day 5 (5 days after enrollment)

**Subject:** What to do when you get stuck
**Preview text:** Three patterns that mean it's time to switch approach.

```
{{first_name}},

If you're on lesson 2 or 3 by now, you've probably hit one of three sticking points. Here's how to handle each.

**1. The output is generic.**
You wrote a prompt, the result was fine, but it sounds like every other AI-generated thing. Fix: add a voice reference. Paste 2-3 examples of your own writing and ask the AI to match your style. Don't just describe it — show it.

**2. The output is wrong.**
You got a confident-sounding answer that turned out to be inaccurate. Welcome to hallucination. Fix: never use AI output on specific facts (numbers, citations, dates) without verifying. AI is a draft engine, not a fact engine.

**3. You're not using it enough to know.**
You finished the lessons but haven't actually applied the patterns to real work. Fix: pick one task from your this-week list and force yourself to use AI on it. Even if it's slower the first time. The speed comes later.

If you're on a different sticking point, reply to this email and tell me about it.

Kyle
```

---

## Email 4 — Day 10 (10 days after enrollment)

**Subject:** The compound effect of one prompt
**Preview text:** A pattern that turns single prompts into systems.

```
{{first_name}},

There's a moment in SparkAcademy where things click. It's usually not where people expect.

It's not lesson 1 (foundational). It's not the AI ethics lesson (important but not transformative). It's the lesson where you build your first prompt library.

Here's why.

A single prompt is a one-time action. A prompt library is leverage. Once you save a prompt that works — for client emails, status reports, research summaries, whatever — you stop starting from zero every time.

Most people who use AI casually never build a library. They reinvent the wheel every session.

If you've finished a course or two in your path, take 20 minutes this weekend and start a library. Doesn't matter where — Notion, Google Doc, Apple Notes. The format doesn't matter. The compound effect does.

The lesson covering this in detail is here: {{course_url}}

Kyle
```

---

## Email 5 — Day 21 (3 weeks after enrollment)

**Subject:** What's next when you finish your path
**Preview text:** Plus how to bring this to your team.

```
{{first_name}},

By now you've either finished your path, you're close, or you've stalled out. All three are normal.

If you finished: what next?

The honest answer depends on what you do for a living. If you're an operator who wants to scale this past yourself, Path 5 (AI Leadership) covers how to bring AI into your team without forcing it. If you're a technical practitioner, Path 3 picks up where Foundation left off.

If you stalled out: that's information, not failure. The most common reason is that the courses started feeling theoretical relative to your actual work. The fix isn't to push through — it's to pause the path and go directly to a course that solves a specific problem you have right now. "AI for Client Communication" if that's eating your time. "Measuring What AI Is Actually Doing for You" if you can't tell if it's working.

The whole catalog is here: [link]

One more thing.

If your team would benefit from this, FlashFusion does team rollouts. We don't do generic AI training. We come in, audit what your team is actually doing, and build a custom enablement program in 30-60 days. It's not for everyone — but if it's relevant, reply to this email and we'll talk.

Kyle
Founder, FlashFusion

P.S. I read every reply. Tell me what worked, what didn't, what's missing.
```

---

## Sequence Logic

| Email | Trigger | Goal |
|---|---|---|
| 1 | Immediate (on enrollment) | Get them into lesson 1 within 24 hours |
| 2 | +24h | Behavioral nudge — actually do the practice prompt |
| 3 | +5d | Pre-empt the most common failure modes |
| 4 | +10d | Plant the compound-effect mindset |
| 5 | +21d | Convert engaged students to next path OR FlashFusion consulting |

---

## A/B Test Candidates

1. **Subject line on Email 1:** "You're in. Here's where to start." vs. "Don't take the platform tour. Just open this."
2. **Email 5 CTA:** Direct consulting pitch vs. soft "reply if interested"
3. **Send time:** 9am local vs. 7pm local (depends on persona)

---

## Risks Block

- **Spam triggers:** "AI" in every email — some filters flag this. Mitigation: vary subject line phrasing, ensure From address is authenticated (SPF/DKIM/DMARC).
- **Personalization break:** If `{{first_name}}` is empty, fallback to "Hey there" — never send "Hey ," with trailing comma.
- **Path mismatch:** Email 5 references "your path" — if user enrolled in single course without a path, gate this email to path-enrolled users only.
- **Email volume:** 5 emails in 21 days is on the lower end. Consider adding 1-2 educational emails between #3 and #4 for engaged learners (track opens to segment).
