# Phase V: Vision

**"Prove you're solving a real problem before you write a line of code."**

---

## Where This Comes From

I'm building VISTADEL as I go. It's not a proven methodology with years of shipped products behind it — it's a framework taking shape from two sources of experience.

The first is INT Inc., where I work. INT is a technology services company — managed marketing, information security, web design, operations. They've delivered projects for clients like Martensen IP, Destwin, RadioMall, and Gardien Products. INT has never built apps. But the patterns that make their service engagements succeed — understanding the client's problem before prescribing solutions, leading with compliance, rolling out incrementally — are the same patterns that should govern app development.

The second source is my own portfolio of 75-90 prototypes built across vibecoding platforms like Base44, Lovable, Bolt.new, v0, and Replit. Most of these aren't finished — they were built as tools to help me learn, to work with AI, and to use AI to solve my own problems. They're not abandoned; they're waiting for the rebuild. Based on how much I've progressed since I last touched each one, I'm confident the vast majority can be brought to production successfully. Most were built to address real pain points I was personally experiencing, which means they've already been validated at the most fundamental level — I built them because I needed them.

Whether VISTADEL becomes something INT adopts, something I use personally, or something public — that's still an open question. What I'm confident about is the principle behind this phase: validation before execution.

---

## What This Phase Is

Phase V is where you determine whether a project is worth pursuing. You leave this phase with a clear problem statement, evidence from real users, defined success metrics, and a focused MVP scope — or you leave with the knowledge that the project should be shelved.

Even when you've built something that solves your own problem — which is where most of my 75-90 prototypes started — Phase V asks whether the solution generalizes. My prototypes work for me. The question is whether they solve the problem well enough, for enough people, to justify a production rebuild.

This applies to new builds, prototype-to-production conversions, and evaluations of existing tools.

### Phase Gate

Do not proceed to Phase I (Integration) until:

- **Audit score ≥ 30** (for existing prototypes) or a documented problem statement (for new builds)
- **Written evidence from at least 5 user conversations**
- **One MVP promise and three explicit "not in MVP" exclusions**

---

## Step 1: Define the Problem (Not the Solution)

Start with what users struggle with, not what you want to build. The difference matters because solution-first thinking locks you into implementation details before you understand the need.

### The Problem Statement Formula

> **[Who]** currently **[pain point]** because **[root cause]**, which results in **[measurable consequence]**.

Every bracket must be specific and measurable. If you can't fill them in, talk to more users.

### Illustrating with INT Service Engagements

INT has never built apps for clients. But the challenges that surfaced during INT's service engagements are exactly the kind of problems that well-built software could address. These examples take publicly documented INT client work and reframe the underlying challenges as potential app development problems.

**Martensen IP — IP Law Firm**
INT delivered managed marketing services for Martensen IP: HubSpot CRM administration, content generation, marketing automation, inbound marketing strategy, and sales enablement. The engagement addressed problems around data migration and aggregation, marketing automation expertise gaps, and sales process inefficiencies.

An app-oriented problem statement derived from that context might look like:
> Law firm sales teams currently lack a unified view of client interactions because contact data lives across disconnected systems, which results in inconsistent follow-up and limited pipeline visibility.

**Destwin — Cloud SaaS for the Fuel Industry**
INT helped Destwin achieve SOC 2 compliance, expanding on earlier PCI-DSS work. The engagement involved partnering with Vanta as the GRC platform, implementing compliance processes, and conducting audit preparedness activities.

An app-oriented problem statement:
> SaaS companies pursuing SOC 2 currently spend significant time on manual audit preparation because security controls are documented separately from the systems they govern, which results in extended timelines and repeated evidence-gathering cycles.

**RadioMall — Audio Products and Broadcasting**
INT redesigned RadioMall's brand identity, built a new WordPress/WooCommerce site, integrated HubSpot and QuickBooks, reorganized audio product archives, and automated a fulfillment process that had previously been entirely manual.

An app-oriented problem statement:
> Small eCommerce teams currently manage inventory, customer data, and fulfillment across disconnected platforms because no integration exists between their storefront, CRM, and accounting systems, which results in manual reconciliation overhead and fulfillment errors.

**Gardien Products — Manufacturing**
INT enhanced Gardien Products' cybersecurity posture, WiFi infrastructure, and cloud administration, improving resilience and operational reliability.

An app-oriented problem statement:
> Manufacturing operations teams currently lack real-time visibility into infrastructure health because monitoring is fragmented across on-premise and cloud systems, which results in delayed incident response and unplanned downtime.

### Common Failure Modes

- **Too vague:** "Users are frustrated." (Which users? What frustration? What consequence?)
- **Solution disguised as problem:** "Users need a dashboard." (Users need visibility. A dashboard is one possible solution.)
- **Assumed pain:** "Competitors have this feature, so we need it." (Feature parity is not validation.)
- **Prototype-driven:** "I already built this, so I know it's needed." (Your prototype solves your problem. Phase V asks whether it generalizes.)

---

## Step 2: Validate with Real Users

Evidence means conversations with people who experience the problem. Not team opinions. Not competitor analysis. Not the existence of a prototype.

### The 5-Conversation Minimum

At three conversations you have anecdotes. At five, patterns emerge. At ten, you have diminishing returns for Phase V purposes.

### What to Ask

Seven open-ended questions, used in every conversation:

1. **"Walk me through the last time you dealt with [problem area]."** — Gets a real story.
2. **"What did you try to solve it?"** — Reveals existing workarounds.
3. **"What was the most frustrating part?"** — Identifies where intervention has the highest impact.
4. **"How much time or money does this cost you?"** — Quantifies the pain.
5. **"If you could wave a magic wand, what would change?"** — Surfaces the ideal outcome.
6. **"Have you looked at any tools to help with this?"** — Maps the competitive landscape.
7. **"If we solved this, what would you be willing to invest?"** — Tests willingness to act.

### What INT's Service Work Demonstrates About Discovery

INT's publicly documented case studies consistently describe a pattern: deep discovery before prescribing solutions. For Martensen IP, the engagement addressed data migration, marketing automation gaps, and sales process challenges — distinct problems that only became clear through working closely with the client. For Destwin, the path to SOC 2 built on earlier PCI-DSS compliance work, meaning the team understood the existing security landscape before expanding scope.

This is what good Phase V validation looks like in practice. The specific tools (HubSpot, Vanta, WordPress) were chosen after the problems were understood — not before.

### What My Prototype Portfolio Demonstrates

Most of my 75-90 prototypes started the same way: I had a problem, I used a vibecoding platform to build a solution, and it worked well enough for my own use. That's a form of validation — personal pain points are real pain points.

The question Phase V answers is whether that personal validation scales. A tool I built to manage my own workflow solves my problem. But if I'm going to invest the effort to rebuild it as a production app, I need to know whether other people share that pain, whether they'd use the solution, and what the MVP scope should look like when it's not just for me anymore.

The prototypes aren't finished, but they're not failures. I've learned enough since building each one that I'm confident in rebuilding them successfully. Phase V is the step that determines which ones to rebuild first and what shape they should take when they're built for a broader audience.

### Recording and Synthesizing

After each conversation, capture within 24 hours:

1. **Direct quotes** — exact words, useful for future case studies
2. **Observed workarounds** — what they do today
3. **Quantified impact** — time, money, missed opportunities

Claude can help synthesize patterns:

```
I conducted 5 user interviews about [problem area]. Here are my notes:

[Paste all 5 interview summaries]

Analyze these interviews and identify:
1. The top 3 recurring pain points (with quote evidence)
2. Common workarounds users have built
3. The single biggest opportunity for intervention
4. Any contradictions between what users say vs. what they do
5. Recommended MVP scope based on highest pain × most users affected
```

---

## Step 3: Define Success Metrics

Before building, define what success looks like. Not feature completeness — outcome achievement.

### Three Tiers of Metrics

**Tier 1: North Star (1 metric)** — The single number that tells you if the app is working.

**Tier 2: Health Indicators (3-5 metrics)** — Why the North Star is moving (or not).

**Tier 3: Guardrails (2-3 metrics)** — Things that must not get worse while you optimize.

### Example: Sales Pipeline Visibility (Martensen-type problem)

| Tier | Metric | Target | Baseline |
|---|---|---|---|
| North Star | Lead follow-up within 24 hours | Define target after validation | Measure current state |
| Health | Time spent on pipeline admin per week | Reduce | Measure current state |
| Health | Pipeline deals with complete status data | 100% | Measure current state |
| Guardrail | Core team productivity | No decrease | Current |

### Example: Compliance Automation (Destwin-type problem)

| Tier | Metric | Target | Baseline |
|---|---|---|---|
| North Star | Time to produce audit evidence package | Define after validation | Measure current state |
| Health | Controls with automated verification | Increase | Measure current state |
| Health | Compliance gaps caught before audit | 100% | Measure current state |
| Guardrail | Engineering velocity | No decrease | Current |

Note: targets and baselines above are intentionally left as "define/measure" rather than fabricated numbers. Real metrics come from your validation conversations and existing data — not from a framework document.

### Choosing a North Star

The North Star should be:

- **Measurable** — trackable with existing or easily-added instrumentation
- **Outcome-oriented** — reflects a user outcome, not feature completion
- **Movable** — your intervention can actually change this number
- **Timely** — signal appears within weeks, not years

---

## Step 4: Scope the MVP

Scope creep kills more apps than bad code. Vibecoding platforms make this worse because building is so fast that scope expands unconsciously.

### The MVP Promise

One sentence:

> **In the MVP, users will be able to [one core action] so that [one measurable outcome].**

One action. One outcome.

**Examples derived from INT client problem spaces:**

- **Martensen-type:** "In the MVP, the sales team will be able to see all client interactions in one view so that follow-up gaps are immediately visible."
- **Destwin-type:** "In the MVP, the compliance team will be able to generate an evidence package from live system data so that audit preparation is measured in hours, not weeks."
- **RadioMall-type:** "In the MVP, the operations team will be able to see unified inventory across storefront and accounting so that manual reconciliation is eliminated."
- **Gardien-type:** "In the MVP, operations will be able to view infrastructure health across on-premise and cloud in one dashboard so that incidents are detected in real-time."

### The "Not in MVP" List

For each exclusion, document why it's excluded and when it might return:

| Excluded Feature | Why | Returns When |
|---|---|---|
| [Feature A] | Not core to the validated pain point | Phase E (Evolution), after baseline data |
| [Feature B] | Requires infrastructure not yet in place | After [dependency] is resolved |
| [Feature C] | Nice-to-have, not validated as painful | Only if user feedback requests it |

### The Prototype Trap

If you already have a working prototype — and most of mine do work, at least for my own use — scoping the MVP is harder, not easier. You've already built features. Cutting them feels like regression. But a prototype built for personal use and an MVP built for a broader audience are different things. The prototype solves your problem your way. The MVP needs to solve the most common version of the problem in the simplest way possible.

The prototypes I'm prioritizing for production rebuild are the ones where I can write a clear MVP promise that extends beyond my own use case. If a prototype does six things for me but the general audience only needs two of them, the MVP is those two — not all six.

---

## Step 5: Go/No-Go Decision

Phase V ends with an explicit decision — not a gradual drift into building.

### Decision Framework

| Signal | Action |
|---|---|
| 4-5 of 5 users confirmed the pain and quantified impact | **GO** — proceed to Phase I |
| 3 of 5 confirmed, but metrics are soft | **CONDITIONAL** — tighten metrics, 2 more conversations |
| 2 or fewer confirmed | **PIVOT** — reframe the problem or target different users |
| Users have the pain but won't change behavior | **NO-GO** — pain exists but isn't actionable |
| Existing tools solve it adequately | **NO-GO** — building into a solved market |

### For Existing Prototypes

Run the audit CLI to add quantitative data:

```bash
intinc-audit scan --dir ./my-prototype --output vision-audit.json
```

| Score | Decision |
|---|---|
| 0-15 | **Archive.** Skeleton or abandoned. |
| 16-29 | **Rebuild or archive.** Only convert with strong validation evidence. |
| 30-49 | **Convert with prep.** Needs refactoring. Validate the problem first. |
| 50+ | **Convert directly.** Strong foundation. Confirm the MVP promise holds. |

A high audit score does not replace validation. A prototype that works well for personal use still needs Phase V to determine whether the problem generalizes and what the production MVP should look like.

---

## Phase V Checklist

- [ ] Problem statement in [Who] [Pain] [Cause] [Consequence] format
- [ ] 5 user conversations completed with notes within 24 hours
- [ ] Top 3 pain points identified with supporting quotes
- [ ] North Star metric defined with target and baseline
- [ ] 3-5 health indicators defined
- [ ] 2-3 guardrail metrics defined
- [ ] MVP promise: one action, one outcome
- [ ] "Not in MVP" list with reasoning and return timeline
- [ ] Go/no-go decision documented with evidence
- [ ] For existing prototypes: audit score ≥ 30

---

## Common Failures

**"We already know what users want."**
The interviews will surface at least one insight you didn't expect. If they don't, the questions were too leading.

**"We don't have time for validation."**
Five conversations take 5-10 hours. A failed product takes hundreds. The math is clear.

**"I already built the prototype."**
A working prototype — especially one that solves your own problem — is a head start, not a finished product. Phase V asks whether the problem generalizes and what the MVP looks like for people who aren't you.

**"We'll just build it and see."**
Fast prototyping is valuable for personal tools and learning. But if you're investing the effort to rebuild something for production, Phase V makes sure you're rebuilding the right thing at the right scope.

**"The competition has this feature."**
Feature parity is not validation.

---

## AI Your BI℠: Claude in Phase V

Three specific uses:

**Interview Synthesis** — After conversations, paste raw notes into Claude for pattern extraction. Claude surfaces contradictions humans miss, like when users describe wanting simplicity but their ideal workflow is complex.

**Competitive Landscape** — Claude can analyze publicly available competitor information, identify gaps, and map those gaps to validated pain points.

**Metric Modeling** — Claude can model what metric movements look like at different adoption levels, helping set realistic targets before real data exists.

Claude works with the evidence you provide. Thin interviews produce thin synthesis.

---

## References

- `templates/pwa-audit-checklist.md` — Pre-launch quality checklist
- `docs/02-pwa-decision-framework.md` — Platform selection guide (feeds Phase S)
- `diagrams/svg/migration-paths.svg` — Effort estimates for conversion paths
- The audit CLI: `intinc-audit scan --dir .`

---

**Next Phase:** [Phase I: Integration →](./I-integration.md)
