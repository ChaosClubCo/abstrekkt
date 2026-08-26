# Claude at Work: The Team Prompt Library

*A practical guide to using Claude for your job — no prompt-engineering background required.*

---

## How to use this guide

**TL;DR:** Find your role below, pick the task you're doing today, copy the template, fill in the brackets, paste into Claude.

**Think of it like this:** briefing Claude is like briefing a brand-new hire on their first day. They're smart — genuinely one of the best you'll ever work with — but they know nothing about your company, your customers, or what "good" looks like to you until you tell them. A vague ask ("write me some marketing copy") gets a vague, generic result, the same way it would from a new employee with no direction. A specific ask — who it's for, what tone, what it needs to accomplish, what "done" looks like — gets something you can actually use.

That's really the entire skill this guide teaches. Not "prompt engineering," not frameworks, not jargon. Just: be as specific with Claude as you'd be briefing a smart new coworker, and use the templates below as a starting point so you're not starting from a blank page every time.

**A few ground rules for every template in this guide:**

- **The `[BRACKETS]` are yours to fill in.** Nothing in brackets is real content — replace it with your actual details before sending.
- **More specific inputs beat more clever wording.** If a result comes back generic, the fix is almost always "I wasn't specific enough about the audience/goal/tone," not "I need a fancier prompt."
- **Treat the first result as a draft, not a delivery.** Read it, then tell Claude what to change — "make this more casual," "cut it in half," "the second paragraph is wrong, here's why." Claude will revise. You don't need to get it perfect in one shot.
- **If something feels off, say so directly.** "This sounds too much like a press release" is a perfectly good instruction.

**What this guide is not:** a course on prompt engineering. You will not find frameworks, acronyms, or theory about how large language models work. If you're curious about that separately, that's a different resource — this one is entirely about getting your job done faster.

---

## Table of contents

1. [Founder & Executive](#1-founder--executive)
2. [Sales](#2-sales)
3. [Manager & Team Lead](#3-manager--team-lead)
4. [Marketing & Communications](#4-marketing--communications)
5. [Operations & Admin](#5-operations--admin)
6. [HR](#6-hr)
7. [Support & Customer Service](#7-support--customer-service)
8. [General Everyday Professional](#8-general-everyday-professional)
9. [Appendix A: What got cut, and why](#appendix-a-what-got-cut-and-why)
10. [Appendix B: Gaps — what's still missing](#appendix-b-gaps--whats-still-missing)

---

## 1. Founder & Executive

Think of these like the questions a sharp board member asks you before you've fully thought something through — they force you to name the metric, name the assumption, name the number, before you commit resources to it. Claude is good at playing that role: it won't let a fuzzy strategy slide the way a busy exec team sometimes will.

### Strategy & Product Decisions

#### North Star Metric Definer

**When to use it:** You need one metric the whole company can rally around, not a dashboard of twenty.

**Copy this into Claude:**
```
Help me define a North Star Metric for [COMPANY/PRODUCT].

What we do: [DESCRIBE PRODUCT]
Who we serve: [CUSTOMER SEGMENT]
Current metrics we track: [LIST WHAT YOU MEASURE TODAY]
Business model: [SUBSCRIPTION / TRANSACTIONAL / AD-SUPPORTED / OTHER]

For 3 candidate North Star Metrics, evaluate each against:
1. Does it capture value delivered to the customer, not just to us?
2. Does it lead revenue rather than lag it?
3. Can a team actually move it through their daily work?
4. Is it resistant to gaming (can't be inflated without real value created)?

Recommend one, explain why it beats the other two, and list the 3-5 input metrics that roll up into it.
```

**Example — filled in:** Someone running a project-management SaaS might get back: "Recommended: Weekly Active Projects with 3+ Contributors" (not "monthly signups," which is easy to inflate and doesn't reflect real usage) — with reasoning that it captures multi-user value delivered, leads revenue, and is hard to fake.

**Watch out for:** If Claude's first answer feels like a vanity metric (signups, downloads), push back — say "that measures activity, not value" and ask it to try again focused on customer outcome.

---

#### Activation Event Identifier

**When to use it:** You want to know the exact moment a new user "gets it" — the point after which they're much more likely to stick around.

**Copy this into Claude:**
```
Help me identify the activation event for [PRODUCT].

What the product does: [DESCRIBE]
Data I have: [LIST — e.g. signup date, feature usage logs, retention by cohort]
Retained users tend to do: [WHAT YOU'VE OBSERVED, IF ANYTHING]

Propose 3 candidate activation events (specific actions, not vague states like "engaged").
For each: why it likely predicts retention, how to measure it, and what a realistic "time to activation" target looks like.
Then recommend the strongest candidate to test first.
```

**Example — filled in:** For a note-taking app: "Candidate: user creates a note AND returns to edit it within 48 hours" (not just "creates first note," which many users do once and abandon).

**Watch out for:** An activation event you can't actually measure yet isn't useful this quarter — ask Claude to also flag which candidates require new tracking versus what you can check with existing data today.

---

#### Pricing Research (Van Westendorp)

**When to use it:** You're setting or re-testing price and want a structured way to find the range customers will actually accept, not a guess.

**Copy this into Claude:**
```
Design a Van Westendorp Price Sensitivity survey for [PRODUCT].

Product: [DESCRIBE]
Target customer: [DESCRIBE]
Current price (if any): [PRICE]

Give me:
1. The 4 required survey questions (too cheap / cheap / expensive / too expensive), worded for this specific product
2. How to recruit respondents (sample size, who to survey, how to avoid bias)
3. How to plot and read the results (where the 4 curves intersect and what each intersection means)
4. The price range I should conclude from the results
5. Limitations of this method I should keep in mind
```

**Example — filled in:** For a $49/mo tool, Claude drafts the 4 questions with the product name and use case worked in naturally, plus a note that Van Westendorp works best with 100+ responses and tends to run conservative for premium/luxury positioning.

**Watch out for:** This method estimates a price *range*, not a single number — if Claude gives you one number, ask it to show the full range and the tradeoffs at each end.

---

#### Feature Kill Criteria

**When to use it:** Before you build something, decide now what would prove it a mistake — much easier than deciding after you're emotionally invested.

**Copy this into Claude:**
```
Set kill criteria for [FEATURE], before we build it.

Feature: [DESCRIBE]
Hypothesis: [WHY WE THINK THIS WILL WORK]
Cost to build: [ROUGH ESTIMATE]

Define:
1. The success metric and target that would justify keeping this
2. The specific number, by what date, that would mean we kill it
3. A pre-mortem: 3 ways this fails that we're not currently guarding against
4. Who owns the kill decision and when we'll revisit
```

**Example — filled in:** "Kill if: fewer than 8% of eligible users try it within 30 days of launch, OR fewer than 20% of those who try it use it twice." Specific, dated, and assigned to someone.

**Watch out for:** If the criteria come back vague ("if it doesn't perform well"), that's not a real kill criterion — ask for a specific number and date.

---

#### Product-Market Fit Signal Scorecard

**When to use it:** You want an honest read on whether you actually have PMF, not just optimism.

**Copy this into Claude:**
```
Score our product-market fit signals.

Product: [DESCRIBE]
What I know: [RETENTION NUMBERS, GROWTH RATE, HOW USERS DESCRIBE US, NPS IF YOU HAVE IT, WHETHER GROWTH IS ORGANIC OR PAID-DEPENDENT]

Score us on each of these signals (strong / mixed / weak / unknown), with reasoning:
1. Organic growth (word of mouth, not just paid acquisition)
2. Retention curve flattening (not decaying to zero)
3. "How would you feel if this went away" — very disappointed threshold (Sean Ellis test, 40%+)
4. Usage intensity growing per account over time
5. Sales cycle shortening / inbound increasing
6. Customers pulling for more (not us pushing for adoption)

Then give an honest overall read: do we have PMF, are we close, or are we not there yet — and what's the single most convincing or most concerning signal.
```

**Example — filled in:** A team with strong retention but growth that's 90% paid-acquisition-dependent gets flagged: "mixed — retention suggests real value, but the absence of organic growth is a signal worth taking seriously before scaling spend."

**Watch out for:** Don't feed Claude only the good numbers — if you cherry-pick inputs, you'll get a falsely confident answer.

---

#### JTBD Forces of Progress Interview

**When to use it:** You want to understand why customers actually switched to (or away from) a solution — the real triggers, not surface-level feature requests.

**Copy this into Claude:**
```
Write a Jobs-to-be-Done "Forces of Progress" interview guide for understanding why customers chose [PRODUCT].

Product: [DESCRIBE]
Who to interview: [RECENT CUSTOMERS WHO SWITCHED TO YOU]

Structure the interview around the 4 forces:
1. Push (what was wrong with the old way)
2. Pull (what attracted them to the new solution)
3. Anxiety (what almost stopped them from switching)
4. Habit (what made staying with the old way comfortable, despite its problems)

Give me 3-4 open-ended questions per force, plus guidance on follow-up probing ("tell me more about that moment") and what NOT to ask (leading or hypothetical questions).
```

**Example — filled in:** Under "Push," a sample question: "Walk me through the day you decided the old way wasn't working anymore — what happened?"

**Watch out for:** If interviewees give hypothetical answers ("I'd probably..."), redirect them to a specific real memory — hypotheticals are unreliable.

---

#### Reverse Trial Designer

**When to use it:** You're deciding whether to let new users start on your premium tier and downgrade later, instead of the traditional free-tier-and-upgrade model.

**Copy this into Claude:**
```
Design a reverse trial for [PRODUCT].

Current model: [FREE TIER / PAID ONLY / OTHER]
Premium features: [LIST]

Recommend:
1. Trial length and what happens at expiration (auto-downgrade vs. requires action)
2. Which premium features to expose during trial (all vs. a curated subset)
3. How to communicate the coming downgrade without feeling like a bait-and-switch
4. What "aha moment" during trial should trigger an upgrade prompt
5. Risks of this model for our specific product and how to mitigate them
```

**Example — filled in:** For a collaboration tool, Claude might recommend a 14-day full-access trial with an in-app countdown starting day 10, and flag the risk that teams who build workflows around premium features during trial may feel punished at downgrade — recommending a data-export grace period as mitigation.

**Watch out for:** Reverse trials work best when premium value is immediately obvious — if your premium tier's value only shows up after weeks of use, this model may backfire; ask Claude to sanity-check that fit specifically.

---

#### TAM / SAM / SOM (Bottom-Up)

**When to use it:** You need a market-size estimate that survives scrutiny from an investor or your own team, not a top-down guess from an analyst report.

**Copy this into Claude:**
```
Build a bottom-up TAM/SAM/SOM for [PRODUCT/MARKET].

Product: [DESCRIBE]
Target customer unit: [E.G. "MID-MARKET SAAS COMPANIES" OR "MARKETING MANAGERS AT B2C BRANDS"]
Price point: [PRICE]
Data I have: [ANY KNOWN NUMBERS — INDUSTRY SIZE, CUSTOMER COUNT ESTIMATES, ETC.]

Build up from unit economics, not down from a big industry report:
1. TAM: total number of potential customer units × realistic price = ceiling
2. SAM: the subset we could realistically serve given our current product/geography/segment
3. SOM: the subset we could realistically capture in 1-3 years given our resources and competition

Show your math at each step so I can sanity-check the assumptions, and flag which inputs are the shakiest.
```

**Example — filled in:** "TAM: ~85,000 mid-market SaaS companies × $6K/year average contract = ~$510M ceiling" — with the count sourced from a named estimate (e.g., Crunchbase/industry association) rather than invented.

**Watch out for:** Any market-size number here should be marked as an estimate, not a fact — verify Claude's source for the customer-count figure before putting it in an investor deck.

---

### Fundraising & Investor Relations

#### Investor Pitch Email (Cold Outreach)

**When to use it:** You're reaching out cold to a VC or angel and need to earn a reply, not get filtered as spam.

**Copy this into Claude:**
```
Write a cold investor outreach email for [COMPANY].

Company: [WHAT YOU DO, 1 SENTENCE]
Traction: [KEY METRICS — REVENUE, GROWTH RATE, NOTABLE CUSTOMERS]
Why this investor: [SPECIFIC REASON — THEIR THESIS, PORTFOLIO OVERLAP, A PARTNER'S PAST WRITING]
Ask: [WHAT ROUND, HOW MUCH, TIMELINE]

Keep it under 150 words. Structure:
1. One line on what you do (no jargon)
2. One line of traction that proves it's working
3. One line on why THIS investor specifically (not generic flattery)
4. The ask: a short call, with 2-3 time options
```

**Example — filled in:** "We help mid-market retailers cut return-processing costs by 40% — 60 stores live, $180K ARR, 22% MoM growth. I saw your thesis on vertical retail infra and think this is squarely in that lane. Would love 15 minutes — Tuesday or Thursday afternoon work?"

**Watch out for:** If the "why this investor" line is generic ("I love your portfolio"), investors notice — do the 10 minutes of research to make it specific before sending.

---

#### Investor Update Email

**When to use it:** Your regular monthly/quarterly investor update — the email that keeps investors informed and useful to you between rounds.

**Copy this into Claude:**
```
Write a monthly investor update email for [COMPANY], [MONTH YEAR].

Metrics this month: [KEY NUMBERS VS LAST MONTH AND YEAR-OVER-YEAR]
Wins: [3-5 THINGS THAT WENT WELL]
Challenges: [BE HONEST — WHAT'S NOT WORKING]
Asks: [SPECIFIC HELP YOU NEED — INTROS, HIRES, FEEDBACK]
Runway: [MONTHS REMAINING AT CURRENT BURN]

Structure: TL;DR (3 bullets max), metrics table, wins, challenges (don't spin these), specific asks, and runway — never skip the runway line.
```

**Example — filled in:** The TL;DR might read: "Revenue up 18% MoM. Lost our second-largest customer to a competitor — investigating why. Looking for an intro to enterprise security buyers."

**Watch out for:** Investors have seen every trick — if Claude's draft spins a bad month as neutral, ask it to be more direct. Investors trust founders who are honest about problems more than founders who never have any.

---

### Internal Communication & Decisions

#### All-Hands Deck Outline

**When to use it:** You're prepping the company all-hands and want it to land as alignment and energy, not a boring function-by-function status readout.

**Copy this into Claude:**
```
Outline an all-hands deck for [COMPANY/TEAM], [QUARTER CONTEXT].

Top metrics: [WHAT MATTERS MOST RIGHT NOW]
Wins: [SPECIFIC, NOT GENERIC]
Challenges: [BE HONEST]
This quarter's priorities: [TOP 3-5]

Structure the deck: opening question that frames the quarter, where we are (metrics with honest red/yellow/green framing), what's working (with a specific customer story and a named shout-out), what's hard (with what we're doing about it), what's next (specific priorities with owners), and a Q&A prep section.

Keep it to 60 minutes, 25 slides max.
```

**Example — filled in:** The opening slide might be a single question: "Are we becoming the default tool for X, or just another option?" — setting the lens for the whole meeting rather than a generic "Welcome!" slide.

**Watch out for:** Don't let this become a list of function-by-function updates — that's the exact failure mode this format is designed to avoid. If Claude's draft reads like a status report, ask it to cut everything that isn't company-wide-relevant.

---

#### Bezos-Style 6-Page Memo

**When to use it:** You have a real strategic decision to bring to a leadership meeting and want the room to think clearly, not nod along to slides.

**Copy this into Claude:**
```
Write a 6-page narrative memo (no slides) proposing [DECISION].

Context: [THE SITUATION FORCING THIS DECISION]
Proposal: [WHAT YOU WANT TO DO]
Resources needed: [TIME, PEOPLE, MONEY]

Structure: executive summary (1 paragraph), context, the proposal in detail, at least 2 real alternatives considered (including "do nothing") with honest pros/cons, risks and mitigations, how we'll measure success, and a crystal-clear ask at the end.

Write in full sentences and paragraphs — no bullet-heavy slides. Meeting format: everyone reads silently for 15-20 minutes, then discusses.
```

**Example — filled in:** Instead of a slide that says "Improve onboarding," the memo says: "We propose reducing time-to-first-value from 12 minutes to under 3 by removing the account-setup step before users see their first result. We considered doing nothing (rejected: our activation rate has been flat for two quarters) and a full onboarding redesign (rejected: 3x the engineering cost for uncertain additional benefit)."

**Watch out for:** If the memo doesn't name at least one real alternative you considered and rejected, it reads as a sales pitch, not a decision document — ask Claude to add genuine alternatives, including the option of doing nothing.

---

#### DACI / RAPID Decision Memo

**When to use it:** A decision needs to be made and everyone needs to know afterward who actually made it — prevents "wait, who decided this?" three months later.

**Copy this into Claude:**
```
Document this decision using the DACI framework.

Decision to be made: [ONE SENTENCE]
Driver (owns the process): [NAME]
Approver (makes the final call): [NAME]
Contributors (give input): [NAMES]
Informed (told after): [NAMES/GROUPS]

Write the full memo: the decision and why it's needed now, context, 2-4 real options with pros/cons/cost, a recommendation from the Driver, space for each Contributor's input, the final decision and reasoning (filled in after the Approver decides), and who needs to be told once it's made.
```

**Example — filled in:** A decision about which CRM to adopt gets a clean record: who proposed each option, who pushed back and why, and what the Approver ultimately chose — searchable months later instead of relitigated from memory.

**Watch out for:** If one person is both Driver and Approver, that's not really a structured decision — it's a rubber stamp. Worth naming a genuine second person as Approver when the stakes justify it.

---

### Competitive Intelligence

#### Competitive Analysis Framework

**When to use it:** You need a real read on where you win and lose against named competitors, not a vague "we're better because we care more."

**Copy this into Claude:**
```
Run a competitive analysis for [OUR PRODUCT] against [LIST 3-5 COMPETITORS].

For each competitor, cover: how they position themselves (in their own words), who they target, their pricing, their strongest feature (the one that keeps customers from leaving), their weakest point, and what they've shipped or announced in the last 12 months.

Then summarize: where we clearly win, where we clearly lose, where we're basically the same as everyone else (the boring middle), and — most importantly — the one thing we should double down on that nobody else is doing.
```

**Example — filled in:** "Where we lose: Competitor B has native Salesforce integration and we don't — this comes up in every enterprise deal we lose. Where we win: our setup time is under 10 minutes vs. their multi-week onboarding — we're not using this in sales conversations enough."

**Watch out for:** Claude's knowledge of a competitor's current pricing or recent announcements can be outdated — verify anything time-sensitive (pricing, features shipped this year) against the competitor's actual site before using it in a deck.

## 2. Sales

Think of these like the difference between a salesperson who talks at a prospect and one who's clearly done their homework. The templates below are structure for the second kind — they force you to gather real information before you pitch, instead of running the same script on everyone.

#### Discovery Call Script (MEDDPICC)

**When to use it:** Prepping for a discovery call where you need to actually qualify the deal, not just build rapport.

**Copy this into Claude:**
```
Build a discovery call script for a call with [PROSPECT/COMPANY TYPE].

What we sell: [DESCRIBE]
What we typically need to know to qualify a deal: [YOUR TYPICAL DEAL BLOCKERS, IF KNOWN]

Structure the questions around MEDDPICC:
- Metrics: what number are they trying to move?
- Economic buyer: who actually signs?
- Decision criteria: what will they judge vendors on?
- Decision process: what are the steps and timeline to a signed deal?
- Paper process: procurement, legal, security review — what's required?
- Identify pain: what's the cost of not solving this?
- Champion: who internally will fight for us?
- Competition: who else are they evaluating?

Give me 2-3 natural, non-interrogation-style questions per category.
```

**Example — filled in:** Under "Economic buyer," instead of bluntly asking "who signs the check," a natural version: "Once you're ready to move forward, walk me through who else needs to be in the room."

**Watch out for:** If you ask all these questions like a checklist, it feels like an interrogation — weave them into a natural conversation across the call, not a rapid-fire Q&A.

---

#### Personalized Demo Script

**When to use it:** You've done discovery and now need to build a demo that speaks to what this specific prospect said mattered to them — not your standard walkthrough.

**Copy this into Claude:**
```
Build a demo script personalized to this prospect's discovery call.

What they told us matters most: [KEY PAINS/GOALS FROM DISCOVERY]
Their role: [TITLE]
Their technical sophistication: [HIGH / LOW]

Structure: open by restating their stated goal in their words, show only the 3-4 features that map directly to what they said mattered (skip everything else), and close each feature shown with "how does that land for what you described." End with a clear next step.
```

**Example — filled in:** If a prospect said their biggest pain was manual data entry, the demo opens with "You mentioned your team loses hours a week on manual entry — let me show you exactly how that goes away," not a generic tour starting from the login screen.

**Watch out for:** Resist showing your favorite features if the prospect didn't mention needing them — a demo that wanders off their stated priorities loses attention fast.

---

#### Objection Handling Matrix

**When to use it:** You want a prepared, calm response to the objections you hear over and over, instead of improvising every time.

**Copy this into Claude:**
```
Build an objection-handling matrix for [PRODUCT/SERVICE].

Common objections we hear: [LIST THEM — e.g. "too expensive," "we already use a competitor," "not the right time"]

For each objection, give me:
1. What's really being said underneath the objection (often not the literal words)
2. A short acknowledgment (don't argue immediately)
3. A clarifying question to understand their specific concern
4. A response that addresses the real concern, with proof if relevant
```

**Example — filled in:** For "it's too expensive," the underlying concern is often "I'm not convinced of the ROI yet," not the raw price — the response reframes around cost of the status quo rather than discounting.

**Watch out for:** Never argue directly with an objection first — acknowledging it before responding keeps the prospect from getting defensive, which kills the conversation.

---

#### QBR Deck Outline

**When to use it:** Prepping a quarterly business review with an existing customer — you want it to feel like a partnership check-in, not a sales pitch in disguise.

**Copy this into Claude:**
```
Outline a QBR deck for [CUSTOMER].

Their goals when they bought: [WHAT THEY WERE TRYING TO ACHIEVE]
Results so far: [METRICS, USAGE DATA, WINS]
Open issues: [ANYTHING UNRESOLVED]

Structure: recap of their original goals, results delivered against those goals (with real numbers), a candid look at anything not going well, upcoming roadmap relevant to them, and a forward-looking discussion of what's next (expansion, renewal, or just continued partnership) — not a sales pitch buried in a business review.
```

**Example — filled in:** Instead of opening with "here's what's new in our product," the deck opens with the customer's own stated goal from onboarding: "You told us your priority was cutting response time in half — here's where that stands."

**Watch out for:** If the customer has an open issue, don't bury it at the end or skip it — surfacing it yourself builds more trust than waiting for them to bring it up.

---

#### Churn Root Cause Interview

**When to use it:** A customer has canceled or is about to, and you want to understand the real reason, not just log "pricing" and move on.

**Copy this into Claude:**
```
Write a churn interview script for [CUSTOMER WHO CANCELED/IS CANCELING].

What we know: [WHAT THEY TOLD US SO FAR, IF ANYTHING]

Give me 6-8 open-ended questions that get past the surface reason to the real trigger — when they first started disengaging, what alternative they're moving to (and why it won over us), and whether anything could have changed their mind earlier. Make it feel like genuine curiosity, not a retention pitch in disguise.
```

**Example — filled in:** Instead of "why are you leaving," a better question: "Looking back, when do you think you first started feeling like this wasn't the right fit?" — it surfaces the real turning point, which is often weeks before the cancellation.

**Watch out for:** If the call turns into a last-ditch save pitch, you'll get less honest answers — separate the "can we save this" conversation from the "help us understand" conversation if you can.

---

#### Customer Health Score Model

**When to use it:** You want an early-warning system for which accounts are at risk, instead of finding out when they cancel.

**Copy this into Claude:**
```
Design a customer health score model for [PRODUCT/BUSINESS].

Data available: [WHAT YOU CAN ACTUALLY TRACK — usage frequency, feature adoption, support tickets, NPS, contract value, etc.]

Recommend which signals to weight most heavily, how to combine them into a single health score (red/yellow/green or numeric), and what specific action should trigger at each risk level (e.g., yellow = check-in call, red = executive escalation).
```

**Example — filled in:** A model might weight "login frequency dropped 50%+ in 30 days" and "support tickets with no resolution" more heavily than raw NPS, since behavioral signals tend to predict churn earlier than survey responses.

**Watch out for:** A health score with no action attached to each tier is just a report nobody reads — make sure every risk level has a specific, owned next step.

---

#### Expansion Opportunity Finder

**When to use it:** You want to spot which existing customers are ready for an upsell or cross-sell, based on real usage signals rather than a gut feeling.

**Copy this into Claude:**
```
Identify expansion signals for our customer base.

What we sell / what upsell options exist: [DESCRIBE TIERS/ADD-ONS]
Signals I can see per account: [USAGE DATA, SEAT COUNT VS LICENSE COUNT, FEATURE REQUESTS, ETC.]

List the specific signals that typically indicate an account is ready to expand (e.g., hitting usage limits, requesting features only available on a higher tier, adding new team members). For each signal, suggest how to open that conversation without it feeling like a hard sell.
```

**Example — filled in:** "Signal: account is at 95%+ of their seat limit for 2+ consecutive months" pairs with a suggested opener: "I noticed your team's grown — want to talk through what the next tier unlocks before you hit the ceiling?"

**Watch out for:** Expansion conversations that lead with "you should buy more" instead of "here's what would help you" tend to land poorly — frame it around their growth, not your quota.

## 3. Manager & Team Lead

Think of managing like coaching a sports team — feedback works best delivered right after the play happens, not saved up for the season review, and everyone performs better when they know exactly what "good" looks like. These templates are built around that idea: specific, timely, and honest.

#### 1:1 Agenda Framework

**When to use it:** Your 1:1s have drifted into status updates and you want them to actually be useful for the person's growth and blockers.

**Copy this into Claude:**
```
Build a 1:1 agenda template for meeting with [DIRECT REPORT / MY MANAGER].

Current format: [WHAT YOUR 1:1S LOOK LIKE TODAY]
What's not working: [E.G. "TURNS INTO STATUS UPDATES," "THEY DON'T BRING TOPICS"]

Give me a repeatable structure that prioritizes their development and blockers over status updates, with a few open-ended questions I can use to draw out real topics if they show up with nothing prepared.
```

**Example — filled in:** Instead of starting with "what did you work on this week," the template opens with "How are you, really?" — followed by a shared, rolling agenda doc the report drives, and status updates pushed to the last five minutes only if needed.

**Watch out for:** If you're doing all the talking or driving the agenda every week, that's a signal the 1:1 has become a status meeting again — hand the agenda back to them.

---

#### Performance Review Writer

**When to use it:** Writing a performance review that needs to hold up when compared against other people at the same level, not just read well on its own.

**Copy this into Claude:**
```
Help me write a performance review for [PERSON], [ROLE/LEVEL].

Their accomplishments this cycle: [LIST WITH ANY NUMBERS YOU HAVE]
Areas they're working on: [1-2 HONEST GROWTH AREAS]
Overall rating I'm considering: [RATING]

Write: a one-paragraph headline that justifies the rating, 3-5 accomplishments with specifics (not "did a great job" — what they actually did and its impact), 1-2 growth areas framed constructively with a path forward, and how they compare to what's expected at their level.
```

**Example — filled in:** Instead of "James is a strong contributor," the draft says: "James redesigned the onboarding flow that cut new-user drop-off by 15%, and did it while mentoring two newer team members — that's above what we'd expect at his current level."

**Watch out for:** Every claim in the review should be something you can back up if questioned later — if Claude's draft includes something you can't point to a specific example for, cut it or find the example first.

---

#### SBI Feedback (Situation-Behavior-Impact)

**When to use it:** You need to give feedback — positive or constructive — in a way that lands as observation, not judgment.

**Copy this into Claude:**
```
Help me draft SBI feedback for [PERSON].

What happened: [DESCRIBE THE SPECIFIC SITUATION]
What they did: [THE OBSERVABLE BEHAVIOR — WHAT THEY ACTUALLY SAID OR DID]
The impact: [WHAT RESULTED — ON THE TEAM, THE WORK, THE OUTCOME]
Type: [POSITIVE OR CONSTRUCTIVE]

Write it in Situation → Behavior → Impact order: name the specific moment, describe only what was observable (not what you assume they were thinking), and state the actual effect. End with an open question inviting their perspective.
```

**Example — filled in — constructive:** "In yesterday's standup, when Sarah mentioned the deadline was slipping, you moved straight to your own update. Sarah didn't get to explain what she needed, and we didn't figure out how to help her. What was going on for you in that moment?"

**Watch out for:** Deliver this within 48 hours of the event — feedback saved up for a review meeting weeks later loses its impact and can feel like an ambush.

---

#### Hiring Rubric (Calibrated Scorecard)

**When to use it:** Building interview loops that produce evidence-based hiring decisions instead of "I just got a good feeling about them."

**Copy this into Claude:**
```
Build a hiring scorecard for [ROLE/LEVEL].

Top capabilities this role needs: [LIST 5-6 — BE SPECIFIC, NOT "IS SMART"]

For each capability, give me: behavioral anchors at 4 levels (clearly below bar, meets bar on routine work only, consistently meets bar, exceeds bar), 3-5 interview questions to probe it, and an example of what a strong answer sounds like versus a weak one.

Then suggest how to structure a 4-5 interview loop so no two interviewers are testing the exact same thing.
```

**Example — filled in:** For "ownership" at a mid-level role, a "meets bar" anchor might read: "Drives a project from ambiguous start to finish with occasional check-ins," while "exceeds bar" reads: "Proactively identifies and resolves problems nobody assigned them."

**Watch out for:** Don't score on vague "culture fit" without anchoring it to specific behaviors — vague fit criteria are where hiring bias creeps in hardest.

---

#### Promo Packet Drafter

**When to use it:** Building the case for someone's promotion in a way a calibration committee — people who don't work with them daily — can actually evaluate.

**Copy this into Claude:**
```
Help me draft a promotion packet for [PERSON], from [CURRENT LEVEL] to [TARGET LEVEL].

Their accomplishments at the next level: [LIST 5-7, WITH SPECIFICS]
How long they've been operating at this level: [TIMEFRAME]
Feedback from others: [ANY QUOTES OR THEMES FROM PEERS/PARTNERS]

Structure: a one-paragraph summary of why they're ready now, then for each next-level expectation in your ladder, at least one specific example with real evidence — not just "they're ready," but what they actually did that proves it. Include one or two honest growth areas too; a packet with none looks unreliable.
```

**Example — filled in:** Instead of "Maria is ready for senior," the packet shows: "Maria led the migration project end-to-end, made the call to delay launch by a week when she found a data integrity risk nobody else caught, and that decision prevented what would have been a customer-facing incident."

**Watch out for:** Padding the packet with routine work doesn't help — committees look for specific evidence at the *next* level, not a longer list of normal-level accomplishments.

---

#### PIP (Performance Improvement Plan) Drafter

**When to use it:** A performance gap has been real, persistent, and already discussed directly — and you need a structured, fair plan. This is a serious, often final step; treat it that way.

> **Important:** this is a structural starting point, not legal advice. Performance Improvement Plans carry real legal weight — always loop in HR or People Ops before finalizing one, and don't skip that step because the draft looks complete.

**Copy this into Claude:**
```
Help me draft a Performance Improvement Plan for [PERSON], [ROLE].

The performance gap: [SPECIFIC, WITH AT LEAST 2-3 CONCRETE EXAMPLES OVER SEVERAL WEEKS]
Feedback already given: [WHEN AND HOW YOU'VE ALREADY RAISED THIS DIRECTLY]
Support available: [WHAT RESOURCES/TIME YOU CAN OFFER]

Write: the specific gap with examples, what's expected at their level, 3-5 measurable goals (each with a deadline and a clear way to know if it's met), the support you'll provide, and what happens at each possible outcome (met / partially met / not met) at the end of the plan period.
```

**Example — filled in:** A vague goal like "improve communication" becomes measurable: "Resolve 80% of assigned support tickets within SLA over the next 30 days, verified via the ticket dashboard."

**Watch out for:** A PIP should only happen after direct, documented feedback has already been given and hasn't resolved the gap — if this is the first time you're raising the issue, have that direct conversation first, this isn't the right tool yet.

---

#### Team Charter / Operating Manual

**When to use it:** Onboarding is inconsistent because norms only live in people's heads — you want new joiners to have something to read instead of guessing.

**Copy this into Claude:**
```
Help me write a team charter for [TEAM].

Team's purpose: [WHY THIS TEAM EXISTS]
Current rituals: [STANDUPS, PLANNING, RETROS — WHATEVER YOU DO TODAY]
Known friction points: [ANYTHING THAT'S UNCLEAR OR CAUSES CONFUSION TODAY]

Cover: mission, what we own vs. don't, how success is measured, who decides what (especially the recurring decisions that cause friction), meeting rhythm, communication norms (response-time expectations, what's urgent vs. async), and 3-5 specific values that describe this team's actual culture, not generic ones.
```

**Example — filled in:** Instead of a generic value like "we communicate openly," a specific one: "We put decisions in writing within 24 hours, even informal ones — if it's not written down, it didn't happen."

**Watch out for:** A charter that isn't revisited goes stale within a few months — build in a quarterly review, and have new joiners read it on day one and suggest edits based on what confused them.

## 4. Marketing & Communications

Think of this like briefing a sharp marketing hire on day one — the more specific you are about audience, tone, and goal, the less generic the result. "Write me some social posts" gets you filler; "write posts for busy small-business owners who are skeptical of software, in a direct and slightly funny voice" gets you something you'd actually post.

### Content & Social

#### Social Media Calendar (7-Day)

**When to use it:** Planning a week of posts across platforms without starting from a blank page each day.

**Copy this into Claude:**
```
Create a 7-day content calendar for [BRAND] across [PLATFORMS].

Content pillars (the 2-4 themes you post about): [PILLARS]
Posting frequency: [E.G. "1 POST/DAY PER PLATFORM"]

For each post, give me: day + platform, content type (carousel, reel, text, story), a scroll-stopping first line, a full caption under 100 words, 5-8 hashtags, a call to action, and a one-sentence visual direction. Format as a table. Include one engagement-focused post (a poll, question, or prompt) during the week.
```

**Example — filled in:** A Tuesday LinkedIn post for a project-management tool might open with "We tracked how our own team spends their Mondays. The results were not flattering." — not a generic "Happy Tuesday! Here's a tip."

**Watch out for:** If every post sounds interchangeable, your content pillars were probably too broad or too similar — go back and make them more distinct before regenerating.

---

#### Content Repurposing Engine

**When to use it:** You've written one solid piece (a blog post, a talk, a long LinkedIn post) and want to get more mileage out of it across channels without rewriting from scratch each time.

**Copy this into Claude:**
```
Turn this content into 6 platform-native formats:
[PASTE YOUR ORIGINAL CONTENT]

Give me: a 10-tweet thread, a LinkedIn post (under 1500 characters), an email newsletter section with subject line and CTA, an Instagram caption with hashtags, a YouTube description with timestamps, and a 60-second short-form video script (hook, problem, solution, CTA).

Each format should feel native to its platform, not a copy-paste of the original with formatting changed.
```

**Example — filled in:** A blog post about a product launch becomes a Twitter thread that opens with the single most surprising stat from the post, not the post's own headline restated.

**Watch out for:** If the LinkedIn version reads exactly like the Twitter thread with line breaks removed, ask Claude to actually adapt the tone and structure to each platform's norms, not just reformat.

---

#### Weekly Newsletter Draft

**When to use it:** Your recurring newsletter, when you have notes and links but no time to write it from scratch.

**Copy this into Claude:**
```
Draft this week's edition of [NEWSLETTER NAME].

Audience: [WHO READS THIS AND WHAT THEY CARE ABOUT]
This week's theme: [THEME]
Source material: [PASTE YOUR NOTES, LINKS, DRAFT THOUGHTS]

Structure: two subject line options (one curiosity-driven, one direct), a short preview line, a personal 2-3 sentence opener (specific, not generic), a 300-400 word main section with one real teachable insight, 3 quick-hit links with one-sentence commentary each, and a short closer. No "I hope this email finds you well."
```

**Example — filled in:** The opener might reference something specific that happened that week ("We shipped three things and broke one thing — here's the one worth talking about") rather than "Welcome to this week's newsletter!"

**Watch out for:** If the draft sounds like it could run in any newsletter, the "source material" you provided was probably too thin — feed in specific details, not just a topic.

---

#### Brand Voice Generator

**When to use it:** You need a reference document that keeps everyone's copy — yours, a freelancer's, a new hire's — sounding like the same brand.

**Copy this into Claude:**
```
Generate a brand voice document for [BRAND].

Describe the brand: [WHAT YOU DO, WHO YOU SERVE]
3-5 adjectives that describe the voice: [E.G. "TRUSTWORTHY, PLAYFUL, DIRECT"]
Brands whose voice is in a similar zone: [REFERENCE BRANDS, IF ANY]

Cover: the core identity adjectives, where the voice sits on key spectrums (formal vs. casual, serious vs. playful), 5 "we are / we are not" contrast pairs, 3 before/after examples of generic copy rewritten in voice, a words-we-use / words-we-avoid list, and how the voice adapts for edge cases like apologies or bad news.
```

**Example — filled in:** A "we are / we are not" pair: "We are direct. We are not blunt to the point of being cold" — with a before/after showing a generic error message rewritten to match.

**Watch out for:** A voice guide with no before/after examples is hard for anyone else to actually apply — always ask for the concrete rewrites, not just adjectives.

---

### Ad Copy & Landing Pages

#### Product Landing Page Copy

**When to use it:** Launching or refreshing a landing page and need copy that leads with the customer's problem, not your feature list.

**Copy this into Claude:**
```
Write landing page copy for [PRODUCT] targeting [AUDIENCE].

Key benefits: [LIST 3, IN PLAIN LANGUAGE]
Tone: [TONE]

Structure: a benefit-driven hero headline (under 8 words, not clever for its own sake), a one-sentence subheadline, 3 core benefits framed as problem → solution (not a feature list), a social proof section with a specific testimonial, an FAQ answering the top 5 objections, and a clear CTA. Use "you," not "our users." Lead with the pain, not the product.
```

**Example — filled in:** Instead of "AI-Powered Analytics Platform" as a headline, something like "Stop Guessing Why Customers Leave" — specific to the pain, not the technology.

**Watch out for:** If the headline describes what your product *is* rather than what it *does for the customer*, ask Claude to rewrite it starting from the customer's problem instead.

---

#### Facebook/Instagram Ad Copy (3 Variants)

**When to use it:** You need a few different angles to test against each other, not just one version of an ad.

**Copy this into Claude:**
```
Write 3 Facebook/Instagram ad copy variants for [PRODUCT].

Target audience: [AUDIENCE]
Main benefit: [BENEFIT]

Give me three distinct angles: one pain-led ("if you've ever..."), one social-proof-led (opens with a result or number), and one curiosity-led (opens with a counterintuitive claim or question). For each: primary text (under 125 characters), headline (under 40 characters), description (under 30 characters).
```

**Example — filled in:** The social-proof variant might open with "1,200 small business owners switched last quarter. Here's why." rather than describing the product first.

**Watch out for:** If all three variants feel like the same ad with different opening lines, ask Claude to make the underlying angle genuinely different, not just the hook.

---

#### A/B Hypothesis-Driven Ad Test

**When to use it:** Before you run an A/B test, you want a real hypothesis for why one version might win — not just two random variations.

**Copy this into Claude:**
```
Design a hypothesis-driven A/B test for [WHAT YOU'RE TESTING — AD COPY / SUBJECT LINE / ETC.].

Audience: [AUDIENCE]
What I'm testing: [E.G. "PAIN-LED VS. SOCIAL-PROOF-LED MESSAGING"]

Write 3 hypotheses in this format: "We believe [audience] will respond better to [message type] because [psychological reason]." Then write the copy for each hypothesis, keeping everything else identical. Tell me what metric decides the winner and roughly how much data I need before I trust the result.
```

**Example — filled in:** "We believe budget-conscious small business owners will respond better to social-proof messaging than pain-led messaging because they're more skeptical of being sold to and trust peer behavior more."

**Watch out for:** Don't call a test early — if Claude's suggested sample size is 2,000 impressions per variant and you've only got 300, the "winner" isn't reliable yet.

---

#### Sales Page (Long-Form)

**When to use it:** A single product or offer needs a dedicated, persuasive page — the kind that does the selling on its own.

**Copy this into Claude:**
```
Write a long-form sales page for [PRODUCT].

Price: [PRICE]
Audience: [WHO]
Main pain point: [PAIN]

Structure: benefit-driven headline, subheadline naming who it's for, vivid description of the current pain, the cost of not solving it, the product as the bridge (not a features list — the mechanism behind why it works), proof (real testimonials/data with names and numbers), the offer broken down by what's included, price anchored against the value, a risk-reversal guarantee, real urgency only if it exists, an FAQ covering the top 7 objections, and a clear CTA repeated 3-5 times through the page.
```

**Example — filled in:** Instead of "Our platform includes 15 features," the mechanism section explains the one core insight that makes those features work together — the "how," not just the "what."

**Watch out for:** Fake urgency ("only 3 spots left!" when that's not true) damages trust fast — only include scarcity or deadlines that are real.

---

### Email Marketing & Outreach

#### Email Sequence (3-Part)

**When to use it:** Launching a product or nurturing a lead over a short window without writing each email from scratch.

**Copy this into Claude:**
```
Write a 3-email sequence for [PRODUCT] targeting [AUDIENCE].

Email 1 (Day 0): hook + problem awareness — lead with the problem, not the product.
Email 2 (Day 3): solution + social proof — one clear CTA.
Email 3 (Day 7): urgency + the #1 objection, answered — final CTA.

Keep subject lines under 50 characters, each email body under 150 words, and write conversationally — like a person, not a brand. Each email should work as a standalone read.
```

**Example — filled in:** Email 1's subject might be "The thing nobody tells you about [PAIN POINT]" rather than "Introducing [Product Name]."

**Watch out for:** If email 3's "urgency" isn't real, cut it — readers can tell the difference between genuine urgency and manufactured pressure, and it costs you trust on future emails.

---

#### Follow-Up Email Sequence

**When to use it:** Someone went quiet after an initial pitch or proposal, and you want a structured way to follow up without sounding desperate.

**Copy this into Claude:**
```
Write a 4-email follow-up sequence after [INITIAL CONTACT/PITCH].

What was originally pitched: [DESCRIBE]
Why they might be slow to respond: [YOUR BEST GUESS]

Email 1 (Day 3): bump the thread with a small piece of new value.
Email 2 (Day 8): a different angle on the offer.
Email 3 (Day 15): give permission to close — "should I assume this isn't a fit?"
Email 4 (Day 30): leave the door open with a resource, then stop.

Keep each under 60 words. No "just checking in."
```

**Example — filled in:** Email 3 often gets the highest reply rate specifically because it removes pressure: "Totally understand if the timing's not right — should I close this out, or is it worth reconnecting in a few months?"

**Watch out for:** If you're still following up after email 4 with no response, that's a signal to stop — repeated follow-ups past this point tend to hurt the relationship more than help it.

---

#### Customer Win-Back Email

**When to use it:** Reaching out to a customer who churned, without it reading as a discount-driven spam blast.

**Copy this into Claude:**
```
Write a win-back email for a churned customer.

How long they've been gone: [TIMEFRAME]
Their original use case: [WHAT THEY USED IT FOR]
What's changed since they left: [SPECIFIC IMPROVEMENTS, NOT GENERIC "WE'VE IMPROVED"]
Offer (if any): [DISCOUNT / EXTENDED TRIAL / NEW FEATURE]

Structure: an honest subject line (no clickbait), a specific acknowledgment of their absence, what's genuinely changed, an easy low-commitment way back in, and a graceful, visible exit option if they'd rather not hear from you again.
```

**Example — filled in:** "What's changed" should name something real and relevant to why they left ("the export feature you asked about is live now"), not a vague "we've been working hard."

**Watch out for:** Avoid any language that shames them for leaving ("we noticed you haven't been back...") — it reads as guilt-tripping, not an invitation.

---

#### Apology Email

**When to use it:** Something went wrong — an outage, a billing error, a shipping failure — and you need to communicate it honestly.

**Copy this into Claude:**
```
Write an apology email for [INCIDENT].

What happened: [DESCRIBE, PLAINLY]
Who was affected: [BE SPECIFIC — HOW MANY, WHAT KIND OF IMPACT]
What we're doing about it: [CONCRETE ACTIONS]
Compensation if any: [REFUND / CREDIT / ETC.]

Structure: a subject line that names the issue plainly, what happened with no jargon or blame-deflection, honest scope of who was affected, concrete next steps, what it means for the reader specifically, and a signature from a real, senior person for anything significant. No "we apologize for any inconvenience this may have caused" — that phrase reads as corporate distance, not empathy.
```

**Example — filled in:** "About yesterday's outage" as a subject line, not "A Service Update" — naming the issue directly earns more trust than vague framing.

**Watch out for:** Passive voice ("mistakes were made") is the single most common way these emails undercut their own apology — check the draft for it and rewrite in active voice if you find it.

---

#### Sales Email — Cold Outreach

**When to use it:** Reaching a new prospect cold, when you have one shot to earn a reply.

**Copy this into Claude:**
```
Write a cold outreach email to [PERSONA — ROLE, COMPANY SIZE, THEIR PROBLEM].

What I'm offering: [WHAT YOU'RE SELLING]
Why now: [TIMING REASON — WHY THIS OUTREACH, WHY THIS MOMENT]

Keep it under 100 words: a specific subject line under 8 words, one line of real personalization (not "saw your post"), one line connecting your offer to their world, one line on what's in it for them, and one specific ask (a question or a 15-minute meeting request). No "I hope this finds you well," no "just a quick question," no pitch in the first line.
```

**Example — filled in:** Personalization done well references something specific and current — "Noticed you just posted the VP of Ops role — usually a sign the team's scaling fast" — not a vague "I saw your LinkedIn."

**Watch out for:** If you can't fill in real personalization specific to this person, you're not ready to send — generic "personalization" is easy to spot and often backfires.

---

### PR & Partnerships

#### Press Release Generator

**When to use it:** Announcing something newsworthy — a launch, a funding round, a milestone — in the format journalists actually expect.

**Copy this into Claude:**
```
Write a press release for [ANNOUNCEMENT].

Key facts: [WHAT, WHO, WHEN, WHY IT MATTERS]

Use AP style: FOR IMMEDIATE RELEASE, a headline under 15 words with an action verb, a lead paragraph answering who/what/when/where/why, supporting facts and a quote from a named exec (specific, not generic praise), a customer quote if relevant, company boilerplate, and contact info. Keep the whole thing 400-600 words, no marketing fluff, and make sure the quotes are genuinely quotable — something a journalist would actually copy.
```

**Example — filled in:** A weak quote: "We're thrilled to launch this exciting new product." A quotable one: "We built this because our own team was losing four hours a week to the exact problem we're solving."

**Watch out for:** If the exec quote sounds like generic marketing copy, journalists skip it entirely — push for something specific and slightly opinionated instead.

---

#### Partnership Pitch Email

**When to use it:** Proposing a partnership to another company — you need to make the mutual value obvious fast.

**Copy this into Claude:**
```
Write a partnership pitch email to [TARGET COMPANY].

Who I am: [YOUR COMPANY + RELEVANCE]
Why them specifically: [SOMETHING SPECIFIC TO THEIR COMPANY, NOT GENERIC FLATTERY]
The partnership idea: [WHAT EACH SIDE BRINGS, WHAT USERS GET]

Keep it under 200 words: a direct subject line naming both brands, who you are in one line, why them specifically, the partnership idea in one paragraph, why now, one line of proof (your traction or similar partnerships), and an ask for a 15-minute call with 2-3 time options.
```

**Example — filled in:** "Why them specifically" should reference something real — a recent product launch, an audience overlap you can point to — not "I love what you're building."

**Watch out for:** A vague partnership idea ("we should collaborate somehow") gets ignored — be concrete about what each side actually contributes and gets.

---

### SEO & Content Strategy

#### SEO Blog Post Outline

**When to use it:** Starting a new blog post and want a structure built around what will actually rank, not just a topic dump.

**Copy this into Claude:**
```
Create an SEO-optimized blog post outline.

Target keyword: [PRIMARY KEYWORD]
Secondary keywords: [3-5]
Audience: [AUDIENCE]
Target length: [WORD COUNT]

Give me: 3 title options with the keyword near the front, a meta description under 155 characters, a full H1→H2→H3 outline, a 40-60 word direct-answer section near the top (for featured snippet potential), internal linking suggestions, and a note on what the top-ranking competitors for this keyword are missing that we could cover better.
```

**Example — filled in:** For "how to reduce customer churn," the outline might flag that competitor articles all skip pricing-related churn causes — a gap this post could fill.

**Watch out for:** Don't force the keyword into every paragraph — modern search ranks for topic relevance and quality, not keyword density; write for the reader first.

---

#### Pillar Content Strategy

**When to use it:** Planning a cluster of content around a core topic so it reads as authoritative to both readers and search engines.

**Copy this into Claude:**
```
Build a pillar + cluster content strategy for [TOPIC].

Audience: [AUDIENCE]
Current site authority: [LOW / MEDIUM / HIGH]

Give me: one pillar page concept (a comprehensive resource targeting the broad head term), 8-12 cluster page ideas (each targeting a specific long-tail subtopic), how they should link to each other, and a suggested publishing order.
```

**Example — filled in:** A pillar on "employee onboarding" might have clusters like "30-60-90 day plan templates," "remote onboarding checklists," and "onboarding survey questions" — each linking back to the pillar.

**Watch out for:** Publishing the pillar page before any clusters exist means it has nothing to link to yet — many teams get better results writing 2-3 clusters first, then the pillar.

---

#### Content Brief Template

**When to use it:** Handing a writing assignment to yourself, a freelancer, or a teammate — with enough detail that the first draft doesn't miss the mark.

**Copy this into Claude:**
```
Generate a content brief for [TOPIC].

Target keyword: [KEYWORD]
Audience: [AUDIENCE]
What makes our angle different: [YOUR UNIQUE POV, IF YOU HAVE ONE]

Cover: 3 working title options, target and secondary keywords, audience and their expertise level, the differentiating angle, a target word count, a full section outline with key points each section must cover, suggested sources to cite, and a clear call to action for the end of the piece.
```

**Example — filled in:** The "differentiating angle" section might note: "Most articles on this topic assume the reader already has budget approved — ours should address the pre-budget stage instead."

**Watch out for:** A brief with no differentiating angle just produces another generic article — if you can't articulate what's different about your take, that's worth solving before the brief goes out.

---

#### Topical Authority Map (SEO)

**When to use it:** Planning your content strategy at a bigger scale than one article — building genuine depth on a subject area instead of scattered one-off posts.

**Copy this into Claude:**
```
Build a topical authority map for [YOUR BUSINESS/SUBJECT AREA].

Business: [WHAT YOU DO, WHO YOU SERVE]
Existing content: [WHAT YOU'VE ALREADY PUBLISHED, IF ANYTHING]

Give me: a pillar topic for the overall theme, 5-10 subtopic clusters underneath it, what content type fits each cluster (guide, comparison, tool, case study), how clusters should link to each other and to the pillar, and a realistic production cadence given a small team.
```

**Example — filled in:** For a business selling scheduling software, the pillar might be "shift scheduling" with clusters like "overtime law by state," "scheduling for hourly retail teams," and "shift-swap policy templates."

**Watch out for:** Publishing unrelated one-off topics dilutes the authority-building effect this strategy relies on — resist the temptation to chase every trending keyword outside your map.

---

#### Cold Outbound Deliverability Audit

**When to use it:** Your cold outreach emails are landing in spam and you don't know why — before blaming your copy, check the plumbing.

**Copy this into Claude:**
```
Audit our cold outbound email deliverability setup.

Current setup: [SENDING DOMAIN, WHETHER IT'S SEPARATE FROM YOUR MAIN DOMAIN, TOOLS USED]
Volume and cadence: [HOW MANY EMAILS/DAY, HOW MANY TOUCHES PER PROSPECT]

Check: whether we're using a separate domain from our primary one (protects the main domain's reputation), whether SPF/DKIM/DMARC are all set up, whether the domain has been properly warmed up, common spam-trigger language in our copy, and whether our list is verified before sending. Give me a prioritized fix list.
```

**Example — filled in:** A common finding: sending cold outreach from the same domain used for regular company email — the audit would flag this as the top fix, recommending a separate subdomain to protect the main domain's reputation.

**Watch out for:** If your bounce rate is above 3%, that's usually a sign your list wasn't verified before sending — fix the list before troubleshooting anything else, since a bad list undermines every other fix.

## 5. Operations & Admin

Think of this like handing a well-organized binder to whoever covers for you when you're out — the goal of everything here is that someone unfamiliar with the task can follow it without having to ask you a single question.

#### SOP / Runbook Writer

**When to use it:** Documenting a repeatable process so it doesn't live only in your head.

**Copy this into Claude:**
```
Write an SOP for [TASK].

What the task involves: [DESCRIBE THE STEPS AS YOU KNOW THEM]
Who typically does this: [ROLE/TEAM]

Cover: why this process exists, when to use it (specific enough that someone knows if they're in the right place), what's needed before starting (access, tools, permissions), numbered steps that are specific and verifiable (how do you know each step worked), a table of common issues and fixes, and when to escalate instead of continuing.
```

**Example — filled in:** Instead of "save your work," a good step reads: "Click Save in the top-right corner. You'll see a green checkmark appear next to the file name within 2 seconds — that confirms it saved."

**Watch out for:** Test the SOP on someone unfamiliar with the task before treating it as final — if they get stuck or have to ask a question, that's a gap in the doc, not a gap in them.

---

#### Knowledge Base Article

**When to use it:** Writing a help-center article customers or employees will search for when they're stuck.

**Copy this into Claude:**
```
Write a knowledge base article answering: [QUESTION/PROBLEM]

Give me: a title phrased as the reader's actual question, a 2-3 sentence summary, a short "quick answer" section (most readers only read this part, so it needs to be complete on its own), numbered step-by-step instructions, a section for common variations (different plans, roles, or scenarios that need different steps), and a troubleshooting table.

Tone: warm and plainspoken, no jargon. Avoid "simply" and "just" — nothing is simple to someone who's already confused.
```

**Example — filled in:** A "quick answer" for "how do I reset my password" gives the complete two-step process right at the top, not a teaser that sends the reader further down the page.

**Watch out for:** If the quick-answer section doesn't fully solve the problem on its own, most readers will bounce without scrolling further — make sure it's genuinely complete.

---

#### Internal Wiki Page

**When to use it:** Documenting internal knowledge — a tool, a process, a decision — for the team member who joins six months from now and has zero context.

**Copy this into Claude:**
```
Write an internal wiki page about [TOPIC].

What it covers: [DESCRIBE]
Who owns this: [NAME/ROLE]

Cover: a TL;DR (most readers stop here), why this exists and what problem it solves, current owner and backup, how it works, the top 5 use cases with examples, an FAQ, and a "last reviewed" date. Write for someone joining the team six months from now who has zero context.
```

**Example — filled in:** The "why this exists" section might note: "We built this after our second missed renewal in a quarter — it replaced a process that relied on someone remembering to check a spreadsheet."

**Watch out for:** An out-of-date wiki page is worse than no page at all, since people trust it and follow stale instructions — set a real review cadence and actually keep it, or delete the page.

---

#### New Hire Onboarding Doc

**When to use it:** Building a structured first-week (and first-month) plan for someone joining your team.

**Copy this into Claude:**
```
Write an onboarding doc for someone joining as [ROLE] on [TEAM].

Tools/systems they'll need access to: [LIST]
What a successful first month looks like: [DESCRIBE]

Cover: a Day 1 checklist (access setup with a named owner per item, key people to meet and why, required reading, and one small real task to complete by end of day), a Week 1 plan (pairing sessions, key terminology, a first real assignment scoped to be doable but instructive), and a Month 1 milestone (a concrete deliverable and a feedback checkpoint).
```

**Example — filled in:** Instead of "meet the team," the plan names specific people and why: "Meet with Dana (Ops lead) — she owns the vendor relationships you'll be managing."

**Watch out for:** Don't front-load everything into Day 1 — a plan that dumps all required reading and every system on day one overwhelms rather than orients; sequence it across the first two weeks instead.

---

#### Email Triage System

**When to use it:** Your inbox has gotten unmanageable and you want a structured way to sort it into action, instead of reading everything twice.

**Copy this into Claude:**
```
Help me triage this batch of emails.

[PASTE EMAIL SUBJECTS/SUMMARIES, OR THE FULL EMAILS]

Sort each into: Act Now (under 5 minutes — respond, decide, or delete), Schedule (needs a real focus block — give me a time estimate), Waiting on Others (track who I'm waiting on), Informational (no action needed), or Delete/Unsubscribe.

For each: a one-line summary, the category, and a suggested action. Flag anything with a deadline in the next 48 hours, and point out if multiple people are asking the same thing — that's usually a sign it needs a shared doc, not individual replies.
```

**Example — filled in:** Three different people emailing about the same policy question gets flagged: "3 separate emails asking about the new expense process this week — worth writing one FAQ doc instead of replying individually."

**Watch out for:** Anything that's been sitting for over a week without resolution should either get acted on or explicitly let go — don't let it silently pile up in "waiting on others" forever.

## 6. HR

> **A note on this section:** HR is the thinnest role bucket in this library. The source material this guide was built from skewed heavily toward engineering, sales, and management content — genuinely HR-specific templates (benefits communication, employee handbook Q&A, leave-of-absence letters, exit interviews) weren't well represented. Two strong templates below are shared with the Manager & Team Lead section since they sit at the intersection of both roles. See [Appendix B](#appendix-b-gaps--whats-still-missing) for a list of HR templates worth commissioning next.

#### Hiring Rubric (Calibrated Scorecard)

See the full template under [Manager & Team Lead → Hiring Rubric](#hiring-rubric-calibrated-scorecard) — the same template applies whether you're the hiring manager or the HR partner running the loop.

#### PIP (Performance Improvement Plan) Drafter

See the full template under [Manager & Team Lead → PIP Drafter](#pip-performance-improvement-plan-drafter). As HR, your role is usually reviewing and co-signing this with the manager, not drafting it solo — the legal-review note in that template applies doubly here.

#### Interview Scheduling & Candidate Communication

**When to use it:** Coordinating interview logistics with a candidate — clear, professional, and not a chore to write every time.

**Copy this into Claude:**
```
Write a candidate scheduling email for [ROLE].

Interview stage: [E.G. "FIRST-ROUND SCREEN," "ONSITE LOOP"]
Format: [PHONE / VIDEO / IN-PERSON]
Logistics: [DURATION, WHO THEY'LL MEET, ANY PREP NEEDED]

Keep it warm and clear: confirm the role and stage, propose 2-3 time options (or ask for their availability), explain the format and who they'll meet, note any prep needed on their end, and close with an easy way to reach you with questions.
```

**Example — filled in:** For an onsite loop, the email names each interviewer and their role ("You'll meet with Priya, our engineering lead, and Sam from the team you'd be joining") rather than a vague "you'll have a few conversations."

**Watch out for:** Double-check interviewer names and role titles before sending — a wrong name in a candidate-facing email is a small thing that reads as sloppy to someone evaluating whether they want to work with you.

## 7. Support & Customer Service

Think of a support rep like the front desk at a busy hotel — guests are sometimes upset, policy has real limits, and every word you say might get reread later. These templates are the laminated cards a good shift lead keeps under the counter: enough structure to stay calm and consistent, enough room to still sound like a person.

> **A note on this section:** these templates are newly written to fill a real gap in the source material, not adapted from an existing doc — see [Appendix B](#appendix-b-gaps--whats-still-missing) for detail. Treat them as a strong first draft to test against your real tickets and adjust to your actual policies before rolling out team-wide.

#### Empathetic Complaint Response

**When to use it:** A customer emails or messages you upset about something going wrong, and you need a reply that acknowledges their frustration and gives them a real next step.

**Copy this into Claude:**
```
I need to reply to an upset customer. Here's what happened: [DESCRIBE THE SITUATION IN YOUR OWN WORDS]

Here's what we can actually do for them: [BE SPECIFIC — REFUND, REPLACEMENT, FIX, ESCALATION — WHAT'S ACTUALLY ON THE TABLE]

Write a short email reply that acknowledges their frustration without being defensive, explains what happened in plain language with no excuses, tells them exactly what we're doing and by when, and ends on a warm, human note. Under 150 words. Don't use "we apologize for any inconvenience this may have caused."
```

**Example — filled in:** For a 3-year customer whose order arrived late and damaged, a 90-word reply opens with "You've been ordering with us for three years, and this isn't the experience you should've had" rather than a generic opener — and offers a clear choice (refund or free reshipment) with no return required.

**Watch out for:** If you skip filling in "what we can actually do," Claude will guess — and it might promise something outside your actual policy. Always fill in the real, approved options first, and reread the draft for any promise language before sending.

---

#### De-escalation Script for a Live Call

**When to use it:** You're about to get on a call or chat with a customer who's already worked up, and want a few calm, ready-to-use lines before you go in.

**Copy this into Claude:**
```
A customer is angry about [DESCRIBE THE ISSUE AND HOW ANGRY THEY ARE].

I'm about to talk to them live. Give me 5 short, calm phrases to acknowledge how they feel and slow things down, one line to redirect toward a solution once they've vented, and one line I can use if they ask for a manager. Keep everything short enough to say out loud naturally.
```

**Example — filled in:** For a customer threatening to cancel over a double billing charge, one line: "That's frustrating, and you're right to flag it" — followed by a redirect: "Let's get this sorted before we talk about anything else."

**Watch out for:** Reading a script word-for-word on a live call sounds robotic and can make things worse — use these as a starting point in your own voice, not a transcript to recite.

---

#### Ticket Summary for Handoff

**When to use it:** Handing a ticket to another rep, a manager, or a different team, and you need a short, accurate summary so nobody has to reread the whole thread.

**Copy this into Claude:**
```
Summarize this support ticket for handoff to [WHO'S RECEIVING IT].

[PASTE THE FULL TICKET/EMAIL THREAD]

Give me: a one-line summary of the issue, what the customer has already been told, what's been tried so far, and what still needs to happen next. Bullet points only, 6 lines max total.
```

**Example — filled in:** A billing dispute handoff to the billing team notes the price mismatch already confirmed, that the customer was told to expect a follow-up within 24 hours, and that the current rep can't process the refund without billing-team access.

**Watch out for:** Pasting a long, messy thread can cause Claude to miss a commitment you already made to the customer (a date, a dollar amount) — cross-check the summary against the original thread before handing off, especially anything you promised.

---

#### FAQ Answer from an Internal Macro

**When to use it:** You have a canned internal answer that's technical or clunky, and need to turn it into something a non-technical customer can actually understand.

**Copy this into Claude:**
```
Turn this internal support answer into a customer-facing FAQ response.

[PASTE YOUR INTERNAL MACRO OR NOTES]

Rewrite it so a non-technical customer understands it in one read. Keep the core facts and steps in order. No internal jargon, system names, or ticket references. Under 100 words unless the steps genuinely need more room.
```

**Example — filled in:** An internal macro referencing "SSO flag in admin panel" and "escalate to L2" becomes: "If you're stuck in a login loop, try clearing your browser's cache and cookies first — that fixes it most of the time. Still stuck? Reply here and we'll take a closer look."

**Watch out for:** Internal macros often contain details that shouldn't reach a customer (system names, other customers' info, ticket IDs) — strip those before pasting in, and re-read the output yourself before publishing.

---

#### Refund / Exception Request Write-Up

**When to use it:** You want to ask your manager for approval on a refund, discount, or policy exception, and need to make the case clearly.

**Copy this into Claude:**
```
I want to request approval for a customer exception.

Customer situation: [WHAT HAPPENED]
What they're asking for: [REFUND AMOUNT / REPLACEMENT / DISCOUNT]
Our normal policy: [WHAT THE STANDARD POLICY ACTUALLY SAYS]
Why I think an exception is reasonable: [YOUR REASONING]

Write a short, professional note to my manager requesting approval — situation, ask, and your recommendation, in 5 sentences or less.
```

**Example — filled in:** A customer who missed the return window by 4 days due to a documented shipping delay on the company's own end gets a 4-sentence note recommending approval "given this was outside the customer's control."

**Watch out for:** If you skip "our normal policy," Claude may build a case that sounds reasonable but ignores real policy limits your manager will notice immediately — and never tell the customer an exception is approved until your manager has actually said yes.

---

#### Turning Customer Feedback Into Clear Notes

**When to use it:** You just got off a call or read through messages where a customer explained a pain point, and need to turn it into clean notes for product or leadership without losing what they actually said.

**Copy this into Claude:**
```
Here is raw feedback or notes from a customer conversation:
[PASTE NOTES OR A ROUGH TRANSCRIPT]

Turn this into a short summary for the product team: what the customer is trying to do, where it's breaking down, any exact quotes that capture how they feel, and how urgent it seems. Keep it factual — don't add your own opinion about whether it's a valid complaint.
```

**Example — filled in:** A customer who said on a call that the export feature "just doesn't work for anything bigger than 50 rows" and that they've "given up and gone back to spreadsheets" gets a summary that preserves that exact quote and flags urgency as high, since they described actively reverting to a workaround.

**Watch out for:** It's tempting to let Claude smooth over blunt or emotional customer language — explicitly ask it to preserve direct quotes, since the exact wording is often what gets a fix prioritized.

## 8. General Everyday Professional

These are the tools that don't belong to one department — meetings, planning, career development, and explaining things clearly are jobs everyone has, regardless of title. Treat Claude here like a sharp assistant who's great at structure but doesn't know your specific meeting, your specific goals, or your specific career history until you tell it.

### Meetings & Notes

#### Meeting Summary + Action Items

**When to use it:** Turning a meeting transcript or your rough notes into something people will actually read and act on.

**Copy this into Claude:**
```
[PASTE TRANSCRIPT OR MEETING NOTES]

Produce: a 3-5 sentence summary of what was discussed and decided (not a topic list), key decisions with owner and date if mentioned, an action items table (Task / Owner / Deadline / Priority), open questions and who needs to decide them, and a draft agenda for the next meeting based on what's still open.

Be specific ("update pricing page copy" not "follow up on website"). Don't invent dates — mark undecided items as TBD. Flag any conflicting statements between participants.
```

**Example — filled in:** Instead of "discussed pricing," the summary reads: "Team agreed to test a 14-day trial instead of the current 7-day trial, pending finance sign-off on the revenue impact — Sarah to model this by Friday."

**Watch out for:** If two people said contradictory things in the meeting, don't let Claude quietly pick one — ask it to flag the conflict explicitly so it gets resolved, not buried.

---

#### Weekly Status Report

**When to use it:** Your regular update to leadership — wins, blockers, and priorities, without burying the important parts.

**Copy this into Claude:**
```
Write a weekly status report for leadership.

Accomplishments: [WHAT WAS DONE, WITH IMPACT WHERE POSSIBLE]
In progress: [WHAT'S PARTWAY DONE + EXPECTED DATE]
Blockers: [WHAT'S BLOCKED, WHY, WHO OWNS THE FIX]
Metrics: [ANY NUMBERS THAT MATTER]

Lead with wins. Be specific about blockers — vague blockers get ignored by people who could actually help. Cap next-week priorities at 5, ranked by impact.
```

**Example — filled in:** A blocker written vaguely as "waiting on design" becomes specific: "Blocked on final icon set from design — needed by Wednesday to hit the Friday release; Jamie is the owner."

**Watch out for:** A vague blocker doesn't get solved because nobody knows what to do with it — always name the specific thing you're waiting on and who owns unblocking it.

---

#### Daily Standup Update

**When to use it:** Turning yesterday's work log into a tight, honest standup update.

**Copy this into Claude:**
```
Generate a daily standup update from my work log: [PASTE OR DESCRIBE WHAT YOU DID YESTERDAY AND YOUR PLAN FOR TODAY]

Format: Yesterday (what shipped, with the concrete thing produced — not "worked on X"), Today (top 1-3 things, roughly sized), Blockers (or "none"). Keep it under 90 seconds to read aloud. No status theater.
```

**Example — filled in:** Instead of "worked on the dashboard," the update says: "Shipped the new filter UI on the dashboard — in review now."

**Watch out for:** If you're not sure you'll finish something today, say "I'll start X" rather than "I'll finish X" — honest sizing builds more trust over time than optimistic promises that slip.

---

#### Decision Log Entry

**When to use it:** Recording a real decision so nobody has to relitigate it from memory three months later.

**Copy this into Claude:**
```
Log this decision: [DESCRIBE THE DECISION, WHO MADE IT, AND WHY]

Format: title, date, decider, the context that forced this decision, the options genuinely considered (including "do nothing"), the decision and reasoning, what tradeoffs we accepted, what would make us reverse it, and who needs to be informed.
```

**Example — filled in:** "Tradeoffs accepted: slower initial rollout in exchange for lower support burden — we're OK with that given our current team size."

**Watch out for:** If the log doesn't name a real alternative that was seriously considered, it reads as a justification after the fact rather than an honest decision record.

---

### Planning & Goals

#### OKR Drafter

**When to use it:** Setting goals for your team or project that are actually measurable, not just aspirational.

**Copy this into Claude:**
```
Draft OKRs for [TEAM/PROJECT], [QUARTER].

What matters most this quarter: [STRATEGIC CONTEXT]

Objectives should be qualitative and inspirational — a stakeholder should care if it happens. Key Results should be quantitative and genuinely contestable (something you could actually fail to hit), 3-5 per objective. Avoid KRs that measure activity ("ship 5 features") instead of outcomes ("cut time-to-first-value from 12 min to 3 min").
```

**Example — filled in:** A weak KR: "Ship the new onboarding flow." A strong one: "Reduce time-to-first-value from 12 minutes to under 5 minutes by [date]."

**Watch out for:** A KR you're 100% sure you'll hit isn't a real goal — if every KR feels safe, ask Claude to push them further before you lock them in.

---

#### Goal → Daily Tasks

**When to use it:** A big goal feels overwhelming and you need it broken into what to actually do today.

**Copy this into Claude:**
```
Break down this goal into daily tasks: [GOAL]
Timeline: [DAYS/WEEKS/MONTHS]
Constraints: [TIME PER DAY, OTHER OBLIGATIONS]

Work backwards from the goal: what milestones prove progress along the way, what should exist each week, and 1-3 daily tasks (each finishable in under 2 hours) with a clear definition of done. Build in buffer days and a mid-point checkpoint to recalibrate.
```

**Example — filled in:** A goal like "launch a podcast in 6 weeks" breaks into week-by-week milestones (equipment + format by week 1, first 3 episodes recorded by week 3) rather than a vague daily to-do list.

**Watch out for:** If there's no buffer built in, one missed day cascades into the whole plan falling apart — always ask for slack days, not a fully packed schedule.

---

#### Calendar Audit

**When to use it:** You feel like you're always in meetings and never doing focused work, and want a structured look at why.

**Copy this into Claude:**
```
Audit my calendar for [WEEK/MONTH]: [PASTE OR DESCRIBE YOUR TYPICAL WEEK]

Diagnose: meeting load vs. heads-down time, recurring meetings that could be a message instead, whether I have any 2+ hour focus blocks, and whether hard tasks land during my actual peak-energy hours. Recommend what to decline, what to convert to async, and where to protect focus time.
```

**Example — filled in:** "Your Tuesday status meeting has had no new information in the last three updates — this is a strong candidate to convert to a written update instead."

**Watch out for:** Don't just cut meetings randomly — ask Claude to flag which ones are actually decision-making meetings (keep those) versus status-sharing ones (convert those to async).

---

### Communication

#### Async Update (Instead of a Meeting)

**When to use it:** You're about to schedule a meeting for something that could be a well-written message instead.

**Copy this into Claude:**
```
I need to share [WHAT YOU'D COVER IN A MEETING] as an async update instead.

Write it as: a title that states the takeaway, a 2-sentence TL;DR, when a decision is needed by (or "FYI only"), context, 2-3 options with real tradeoffs if a decision is needed, your recommendation, and exactly what you need from the reader and by when.
```

**Example — filled in:** "If you don't respond by Thursday, I'll proceed with Option B" — gives a clear default instead of leaving the decision open-ended indefinitely.

**Watch out for:** Async only works for status-sharing and low-stakes decisions — genuinely hard tradeoffs or conflict resolution usually still need a real conversation; don't force those into a doc.

---

#### Boundary-Setting Email

**When to use it:** You need to decline a request clearly and kindly, without an over-apologetic ramble or a vague non-answer.

**Copy this into Claude:**
```
Write an email declining [REQUEST].

Relationship: [HOW WELL YOU KNOW THEM]
Real reason for declining: [YOUR ACTUAL REASON]

Structure: acknowledge the request and the relationship, decline clearly (don't bury it), one honest sentence on why — don't over-explain, an alternative if one exists, and genuine warmth without over-apologizing.
```

**Example — filled in:** Instead of "Unfortunately, I don't think I'll be able to..." (vague, distancing), a clean version: "I'm not going to be able to take this on right now — happy to revisit in Q2 if the timing works better then."

**Watch out for:** A vague "let me think about it" when you actually mean no wastes both people's time — most people respect a clean, kind no more than a soft maybe that never resolves.

---

### Career

#### Resume Bullet Rewrite (XYZ Format)

**When to use it:** Turning a vague resume bullet into one that actually shows impact.

**Copy this into Claude:**
```
Rewrite these resume bullets using the XYZ format (accomplished X, measured by Y, by doing Z): [PASTE YOUR CURRENT BULLETS]

For each: pull out the real accomplishment, find or estimate a number that shows impact, and describe specifically how you did it — not just what the result was.
```

**Example — filled in:** "Responsible for customer onboarding" becomes "Cut new-customer time-to-first-value from 12 days to 4 by redesigning the onboarding checklist and adding two automated check-in emails."

**Watch out for:** Don't let Claude invent numbers you don't actually have — if you don't know the exact percentage, use a real estimate you can defend if asked, and say so.

---

#### LinkedIn About Section

**When to use it:** Writing (or finally rewriting) your LinkedIn summary so it doesn't read like a resume pasted into paragraph form.

**Copy this into Claude:**
```
Write a LinkedIn About section for me.

Role/field: [WHAT YOU DO]
Career highlights: [2-3 REAL ACCOMPLISHMENTS]
What I'm looking for / open to: [IF RELEVANT]

Write it in first person, conversational but professional — not a list of job titles. Open with what you actually do and care about, not "I am a results-driven professional." Include one or two specific, real accomplishments. End with what you're open to or curious about next.
```

**Example — filled in:** Instead of "Results-driven marketing professional with 8 years of experience," an opener like: "I build marketing systems that let small teams punch above their weight — most recently helping a 4-person team hit the pipeline numbers of a team twice that size."

**Watch out for:** Generic opening lines ("results-driven," "passionate about") are the first thing to cut — if Claude's draft starts with one, ask for a version that leads with something specific to you.

---

#### Job Description Reverse-Engineer

**When to use it:** Preparing for an application or interview by figuring out what a job posting is actually asking for, beneath the corporate language.

**Copy this into Claude:**
```
Reverse-engineer this job description: [PASTE THE POSTING]

Tell me: what this role is really responsible for day-to-day (not just the bullet list), what the top 3 "must-haves" likely are versus nice-to-haves, what questions I should expect in an interview based on this posting, and what gaps in my background (if I describe them) I should be ready to address.

My background: [DESCRIBE, IF YOU WANT A GAP ANALYSIS]
```

**Example — filled in:** A posting listing 15 requirements might reveal that only 3 are truly load-bearing (based on what's mentioned first and repeated), with the rest being aspirational "nice to haves."

**Watch out for:** Claude is inferring from the posting's language, not reading the hiring manager's mind — treat its guesses as a starting hypothesis to validate in the actual interview, not a certainty.

---

#### Behavioral Interview Prep (STAR Story Bank)

**When to use it:** Preparing a set of go-to stories for behavioral interviews instead of improvising under pressure.

**Copy this into Claude:**
```
Help me build a STAR-format story bank for behavioral interviews.

My background/experience: [3-5 ROUGH STORIES WITH NOTES]

Structure each in Situation (context, what was at stake), Task (specifically your responsibility, not the team's), Action (what YOU did — the bulk of the story, in first person), Result (outcome with numbers if possible). Then tell me which 2-3 common interview questions each story could answer (e.g., "tell me about a failure," "tell me about leading without authority").
```

**Example — filled in:** One story might map to both "tell me about a time you disagreed with your manager" and "tell me about a project that didn't go as planned" — good stories often serve multiple questions.

**Watch out for:** Don't memorize the story word-for-word — it sounds canned in the room. Know the structure and the key details, and let the delivery vary naturally each time you tell it.

---

#### 30-60-90 Day Plan

**When to use it:** Starting a new role and want a structured plan for the first three months instead of winging it.

**Copy this into Claude:**
```
Build a 30-60-90 day plan for starting as [ROLE] at [COMPANY/TEAM].

What I know about the team/role so far: [DESCRIBE]

Structure: Days 0-30 (learn — meet people, read context, understand what's working and broken, ship one small real thing, but don't make changes yet), Days 30-60 (identify a couple of quick wins and start one deeper project), Days 60-90 (ship the quick wins, drive your first planning cycle, and produce an aligned plan for the next quarter).
```

**Example — filled in:** For an engineering role, the plan notes: "Ship a small real code change by week 3, even something minor — it builds confidence and shows you're already contributing."

**Watch out for:** Resist making org or process changes in the first 30 days, even if you spot something obviously broken — people need to feel heard and understood by you first, or changes land as presumptuous.

---

#### Self-Review (Performance Cycle)

**When to use it:** Writing your own performance self-review in a way that helps your case without sounding like a sales pitch.

**Copy this into Claude:**
```
Help me write a self-review for this performance cycle.

Top accomplishments: [LIST WITH NUMBERS IF YOU HAVE THEM]
Areas I want to grow: [HONEST — WHERE YOU'RE STILL DEVELOPING]

Structure: a one-paragraph headline summarizing the year, 3-5 accomplishments in XYZ format (with real numbers and honest attribution of who else contributed), 1-2 growth areas framed as progress rather than confession, and what specific support would help you grow further.
```

**Example — filled in:** Instead of "improved team processes," a specific version: "Redesigned the sprint planning process, which cut planning meeting time from 90 to 45 minutes across the team — proposed with two teammates, implemented and iterated by me."

**Watch out for:** Taking sole credit for team work is easy to spot and damages trust — be honest about who else contributed; specific, honest attribution reads as more credible, not less impressive.

---

#### Salary Negotiation Script

**When to use it:** You have an offer (or are about to) and want to negotiate without leaving money on the table or fumbling the conversation.

**Copy this into Claude:**
```
Help me prepare a salary negotiation.

Current offer: [BASE, BONUS, EQUITY, SIGN-ON — WHATEVER YOU HAVE]
Market data I've found: [ANY BENCHMARKS]
Other offers or leverage: [IF ANY]
What I'd walk away over: [YOUR ACTUAL FLOOR]

Give me: a script for if they ask my current or desired compensation first, a counter-offer email once I have the full written offer, and what to say if they call it their "final offer."
```

**Example — filled in:** If asked for current compensation first: "My current comp isn't the best benchmark for this role — based on the scope here and market data, I'm looking at a range of [X-Y]. What's the budget for this level?"

**Watch out for:** Don't threaten to walk away unless you actually would — and get any verbal offer in writing before you start negotiating specifics, so you're negotiating against something real.

---

#### Brag Doc / Impact Tracker

**When to use it:** Keeping a running record of your accomplishments so you're not scrambling to remember them at review time.

**Copy this into Claude:**
```
Turn this into a brag doc entry: [DESCRIBE WHAT YOU JUST FINISHED]

Format: date, what it was in one sentence, the measurable result, who benefited, who else was involved (be honest about attribution), how hard it actually was, and a link to any artifact (doc, PR, dashboard) if relevant.
```

**Example — filled in:** "Reduced onboarding time-to-first-value by 40% — designed solo, implemented with two engineers, verified via the activation dashboard."

**Watch out for:** This only works if you actually keep it updated — a five-minute entry every Friday beats trying to reconstruct a year of work from memory in review week.

---

### Learning & Explaining Things

#### Concept Explainer (Layered)

**When to use it:** Explaining something complex to people with very different levels of background knowledge — without writing three separate documents.

**Copy this into Claude:**
```
Explain [CONCEPT] in three layers for [AUDIENCE].

Layer 1 (under 80 words): one strong analogy, zero jargon — a newcomer should get it.
Layer 2 (under 200 words): a real-world example showing it in action, light jargon defined as it appears.
Layer 3 (under 300 words): the precise technical definition, edge cases, and what experts disagree about.

Add a 5-10 line cheat sheet summary at the end.
```

**Example — filled in:** Explaining "compound interest" at Layer 1 might use a snowball rolling downhill; at Layer 3, it covers the actual formula and where simple approximations break down.

**Watch out for:** Confident-sounding oversimplification at Layer 1 can create a false sense of understanding — if a concept has an important nuance, it's fine to note that Layer 1 is a simplification, and point to Layer 3 for the real picture.

---

#### Lesson Plan (Skill-Based)

**When to use it:** Teaching a specific skill to someone — training a new hire, running an internal workshop session, mentoring.

**Copy this into Claude:**
```
Design a lesson plan to teach [SKILL].

Learner's starting level: [BEGINNER/INTERMEDIATE/ADVANCED]
Time available: [HOURS/SESSIONS]
What they should be able to DO after (not just know): [SPECIFIC BEHAVIOR]

Structure: a hook (a problem they can't solve yet but will by the end), why this matters, core teaching (concept with an analogy, demonstration, guided practice, then independent practice), a quick check that proves they got it (not a lecture-back), and one harder extension example.
```

**Example — filled in:** For "how to run a good 1:1," the hook might be a short clip or example of a 1:1 that turned into a pure status update — the exact failure the lesson is designed to fix.

**Watch out for:** A lesson that ends with a lecture instead of the learner actually doing the thing hasn't actually taught anything — always end with them demonstrating it themselves, not just watching you.

---

#### Workshop Facilitation Guide

**When to use it:** Planning a group session where you need real participation, not sixty people watching slides.

**Copy this into Claude:**
```
Design a [DURATION] workshop on [TOPIC] for [N] people.

Desired outcome: [WHAT MUST EXIST BY THE END]

Structure: an opening with a quick check-in and shared norms, alternating work blocks (brief input, then an activity, then a debrief — rotating between solo, pairs, and group work), a synthesis segment pulling patterns together into real decisions and owned action items, and a close where each person makes one commitment.
```

**Example — filled in:** A strategy workshop's synthesis segment might explicitly separate "decisions made" from "ideas parked for later" — so the room leaves clear on what was actually decided versus just discussed.

**Watch out for:** If every activity is the same format (all group discussion, say), energy drops by the halfway mark — vary between solo reflection, pairs, and full-group activities to keep the room engaged.

---

#### Tutorial Writer (Step-by-Step)

**When to use it:** Writing instructions for how to do something — a process, a tool, a workflow — that a reader can follow without getting stuck.

**Copy this into Claude:**
```
Write a step-by-step tutorial for: [GOAL]
Reader's level: [BEGINNER/INTERMEDIATE/ADVANCED]

Cover: what the reader will build or accomplish (with a description of the finished result), what they need before starting, then 5-10 numbered steps — one action per step, with a checkpoint after each one describing exactly what they should see if it worked (and what to do if it didn't). End with common mistakes and what to try next.
```

**Example — filled in:** After a step involving a save action, a checkpoint reads: "You should now see a green confirmation banner at the top of the screen. If you see a red error instead, check that all required fields are filled in."

**Watch out for:** Test the tutorial on someone unfamiliar with the task — if they get stuck at a step with no checkpoint to tell them whether they're on track, that's the fix to make before sharing it more broadly.

## Appendix A: What got cut, and why

This guide was built by cherry-picking from roughly 480 raw prompt entries across five source documents in the Prompt Library project (`prompt_library_v2.html`, `v3.html`, `v3_pro.html`, `prompt_library_search.html`, and `prompt-to-power-v2.html`). Most of that material was cut. Here's the breakdown of what didn't make it in, and why — so nothing looks like it was overlooked by accident.

**Cut entirely — developer/technical audience, out of scope for this guide:**
Engineering (code generation, refactoring, algorithms), Code Review & Audit, Architecture & Design, Security & AppSec, DevOps & Infrastructure, Testing & QA, Data & Analytics, AI/Agents/MCP (building agents and MCP servers), the more technical half of Automation (n8n/Make/Zapier workflow-building, cron scheduling, webhook testing), Documentation entries aimed at engineers (README generator, API reference docs, architecture docs, changelog generator, RFC writer, engineering design docs, tech specs, API changelogs, migration guides), and all of v3_pro's Infra/Database, LLM Ops, and Incident/SRE categories. This guide is explicitly about *using* Claude for work, not building software with it — those templates live in a separate, more technical resource if your team needs them.

**Cut entirely — compliance and legal content, held pending a decision:**
v3_pro's Legal-Adjacent category (NDA Review Checklist, Privacy Policy Template Drafter, and two others) and the Compliance category (DPIA, retention schedules, records of processing, privacy policy) were flagged during Phase 2 review as needing an explicit go/no-go from Kyle before inclusion, given the legal exposure of shipping "checklist, not legal advice" content to a non-technical audience without a lawyer in the loop. No response was given by the time this document was assembled, so per the default-to-cut rule established earlier in this project, they're excluded. If you want them included, they exist in `prompt_library_v3_pro.html` and can be added in a follow-up pass with appropriate disclaimers.

**Cut for redundancy — a near-duplicate survived instead:**
`prompt_library_v3.html` and `prompt_library_search.html` overlap heavily with `v2.html` and with each other (roughly 30 of `search.html`'s 42 entries are near-identical to entries already in `v2.html` or `v3.html`). Rather than include every near-duplicate, this guide kept the clearer or more complete version of each and dropped the rest. Marketing/content templates specifically drew primarily from `v2.html`, since it had the most complete and audience-appropriate versions.

**Cut for scope — useful, but a step too far into specialist territory for a generalist guide:**
Tagline/Slogan Generator, Search Intent Analyzer, Content Refresh Audit, Internal Linking Strategy, Topic Cluster Generator, and Featured Snippet Optimizer (all SEO & Content from v2) were cut as more specialist SEO-practitioner tools that overlap significantly with the SEO templates that did make the cut (SEO Blog Post Outline, Pillar Content Strategy, Content Brief Template, Topical Authority Map). Notion Database Schema (v2 Productivity) was cut as too tool-specific. Spaced Repetition Card Maker (v2 Education) was cut as a niche use case relevant mainly to people building formal training curricula. Quiz/Assessment Generator (v2 Education) survived; Spaced Repetition did not.

**Cut for scope — incident response and site-reliability content:**
v3_pro's full Incident & SRE category (Incident Commander Playbook, Status Page Communications, On-Call Handoff, Runbook Auto-Generator) is technical operations content aimed at engineering teams running production infrastructure — out of scope for this guide's non-technical audience, and arguably belongs alongside the cut Engineering/DevOps material in a technical companion resource if one gets built.

**Cut individually, with reasoning:**
- *Tech Screen / System Design Prep* (v3_pro Career) — developer-interview-specific, doesn't generalize.
- *Tech Debt Triage* (v3_pro Eng Leadership) — requires engineering context to use meaningfully.
- *Prompt Migration (Cross-Model)* (v2 Bonus) — this is prompt-engineering meta-content about adapting prompts between AI models, exactly the kind of framework theory this guide is designed to exclude.
- v2's own "Brag Doc Generator" (Bonus category) — a near-duplicate of v3_pro's more detailed "Brag Doc / Impact Tracker," which was kept instead.
- Image, Video, and Music generation categories (v2 and v3, roughly 26 entries total covering Midjourney, Sora, Runway, Veo, Suno, and related tools) — cut as a specialized creative-production skill set adjacent to, but distinct from, the day-to-day office-work focus of this guide. Worth a dedicated companion guide if there's demand.
- All 20 "Top Prompting Frameworks" entries present in both `v2.html` and `v3.html` (RTF, CO-STAR, Chain-of-Thought, ReAct, and so on) — this is exactly the prompt-engineering theory this project was explicitly scoped to exclude from the start.

**Cut after a Google Drive review pass, post-delivery:** a background search of Kyle's Google Drive turned up roughly a dozen additional prompt-engineering-related documents outside the five project source files. Five were opened and read in full; the rest were left unopened on the strength of their titles matching the same exclusion pattern found in the five that were read. What was found:
- `promptlibrarymaster.md` (Google Doc, same title as this guide) — a byte-for-byte match of this document's content, modulo Google Docs' own markdown-export formatting artifacts (escaped brackets, full URLs instead of anchor links, extra blank lines). This is a synced copy of the file already written to this project as `claude/phase-3-final-prompt-library.md`, not independent source material. No new content.
- *Organizational Training Strategy: Transitioning to AI Engineering* — a six-phase curriculum for upskilling software engineers into AI/LLMOps engineers (RAG pipelines, agent orchestration, LLMOps tooling). Same exclusion category as the Engineering/DevOps/AI-Agents material already cut above — technical, engineer-audience, not a set of usable prompt templates.
- *Training Manual: Integrating Generative AI into Your UX Workflow* — a methodology document (the "intern-style workflow," "promptframe" technique, C.A.R.E. prompt structure) aimed at UX designers. This is prompt-engineering *theory and pedagogy*, exactly what this project was scoped to exclude, and it targets a role (UX design) not covered by this guide.
- *Claude Live Artifact Use Cases and Prompts* (Google Sheet) — six real, well-specified interactive-dashboard builds (YouTube growth tracker, live product-launch dashboard, sponsor/lead qualifier, journal & habit tracker, and others). This is genuine, non-theory content, but it's a different deliverable type than this guide covers: these are specs for building live interactive Claude Artifacts (dashboards with charts, sliders, and connected-tool data), not one-shot text prompt templates a reader pastes into a chat. Worth a dedicated "Claude Artifacts for dashboards" companion resource rather than folding into this guide's template format.
- Intinc prompt registry (`intinc_prompts.csv.xlsx`) — Google Drive reported this file as ineligible for AI-context access; content could not be reviewed. Flagging rather than silently skipping.

Left unopened, on title alone matching the pattern confirmed above: *Prompt Engineering Playbook for Production Systems*, *Prompt Engineering Frameworks: A Hierarchy*, *Prompt Engineering Research Blueprint*, *Prompt Engineering Report Generation*, *LLM Prompt Engineering Techniques & Security Vulnerabilities*, *Anthropic Prompt Engineering Tutorial Course Structure*, *Prompt Engineering Components and Best Practices Table*, *Advanced Prompt Engineering Frameworks and Reasoning Techniques* — all framework/theory-titled documents matching the exact exclusion criterion this project was scoped against from the start. [GENERATED] judgment call based on title pattern-matching against five confirmed examples, not a read of each file — flagged here rather than left silently unaccounted for.

---

## Appendix B: Gaps — what's still missing

Being honest about where the source material was thin, rather than papering over it with invented content:

**HR is the weakest-covered role in this guide.** The source documents this guide was built from lean heavily toward engineering, sales, and general management — genuinely HR-specialist content (benefits communication, leave-of-absence letters, employee handbook Q&A, exit interviews, harassment/complaint intake, compensation banding) simply wasn't present in any of the five source files. The two templates in the HR section (Hiring Rubric, PIP Drafter) are borrowed from the Manager & Team Lead section because they sit at the intersection of both roles, plus one net-new template for interview scheduling. **Recommended next step:** commission 5-8 net-new HR-specific templates, ideally reviewed by whoever handles HR/People Ops at your org before wide rollout, since this content touches legal and compliance territory more than most sections in this guide.

**Support & Customer Service required net-new content.** Unlike every other section, none of the six templates in that section were adapted from the existing source docs — a scan for support-relevant content (complaint handling, ticket triage, help-center writing) across all five source files came up largely empty. The six templates included were written fresh to fill the gap, following the same format as the rest of the guide, but they haven't been tested against real support tickets the way the sourced sections implicitly have been (since those templates were rated and marked "tested"/"go-to" by whoever built the original libraries). **Recommended next step:** have an actual support team lead review and pressure-test these against real ticket examples before treating them as final, and consider adding a churn/retention-save template and a social-media-complaint response template, which weren't covered.

**Legal-Adjacent and Compliance content is a known, deliberate gap** (see Appendix A) — pending an explicit decision on whether and how to include checklist-style legal/compliance content with appropriate disclaimers.

**A dedicated technical companion guide is a natural next project** if there's appetite — the cut material in Appendix A (engineering, DevOps, security, testing, data, AI/agent-building) is extensive and high-quality; it just serves a different, more technical audience than this guide targets.

**A creative-production companion guide (image/video/music generation)** is a similar candidate — roughly 26 well-built templates for Midjourney, Sora, Runway, Veo, and Suno were cut purely on audience-fit grounds, not quality.

**A "Claude Artifacts for live dashboards" companion resource is a newly-identified candidate** — the Claude Live Artifact Use Cases sheet found in the Google Drive review (see Appendix A) contains six solid specs for interactive, connected-tool dashboards (revenue/ops command centers, YouTube analytics, launch tracking, and similar). Different deliverable format than this guide, but clearly usable material if there's appetite for a companion doc.

**One Drive source (Intinc prompt registry spreadsheet) could not be reviewed** — Google Drive reported it ineligible for AI-context access. Unknown whether it contains material relevant to this guide; flagged rather than assumed empty.

---

### A note on how this was built

CLAIMS: The role taxonomy and section boundaries in this guide are [GENERATED] — a reasoned organization of the source material, not a standard published by anyone else. The specific counts of source prompts (~480 raw entries across five docs) are [SOURCED] from direct reading of the project's five source documents during this consolidation. Individual template text was rewritten by hand from source material where a source existed, and is marked as net-new in the two sections where it didn't (Support & Customer Service, one HR template). The claim that the Google Drive doc `promptlibrarymaster.md` is a duplicate of this document is [SOURCED] from a full byte-count diff (109,983 vs. 106,758 characters, identical template count of 83, identical subsection count of 15) run against the saved Drive content, not just a spot-check.

CONTRADICTIONS: None identified between sections; role assignments (e.g., PIP Drafter appearing in both Manager and HR) are intentional cross-references, not conflicting content.

GAPS / BLINDSPOTS: This guide has not been tested with real, non-technical end users yet — the "watch out for" guidance in each template is [GENERATED] from reasoning about common failure modes, not from observed usage data. Two of the five source documents (`v3.html` and `search.html`) were read and catalogued in an earlier phase of this project but not re-verified line-by-line during final assembly, since `v2.html` and `v3_pro.html` alone provided sufficient breadth and quality for a curated first edition — treat any specific claim about what those two files contain as directionally accurate but not double-checked in this final pass. The Google Drive review pass (this update) opened 5 of ~13 additional documents found; the other ~8 were excluded on title-pattern judgment rather than a direct read — low risk given the 5/5 hit rate on the exclusion pattern, but not a 100% verification.

