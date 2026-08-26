# E5 — Demo Delivery
**Session Date:** Apr 4–5 | **Duration:** 90 min | **Location:** Video call + screen share

---

## Learning Objective
By the end of this session, Kelan can run the 5–7 minute Compliance Copilot demo from cold start to close — including handling a live interruption — without losing the thread. This is execution coaching, not content learning.

The deliverable from this session is not a document. It's a confirmed "yes, Kelan is ready to demo" from Kyle.

---

## Kyle's Teaching Notes (Pre-Read Before Session)

### What this session actually is

E5 is a rehearsal session, not a teaching session. 80% of the time is Kelan demoing and Kyle giving feedback. 20% is structure and strategy.

The most common failure mode in sales demos is **talking while the screen is doing nothing interesting.** The second most common is **losing momentum when interrupted.** Both are fixable with reps.

Review the E4 Loom before the session. Do not start E5 until you've watched it. Use it to calibrate where Kelan is.

### The Demo Structure (fixed, not improvised)

The Compliance Copilot demo has five beats. Each beat has one job:

| Beat | Name | Job | Target Time |
|------|------|-----|-------------|
| 1 | Setup | Tell the buyer what they're about to see | 30s |
| 2 | Builder | Show the configuration layer | 45s |
| 3 | Runtime | Run a live query | 90s |
| 4 | Audit | Show the WorkflowExecution log | 45s |
| 5 | Trust | Trigger ComplianceReport + SecurityScan | 90s |
| — | Close | Land the "all three layers" message | 30s |

Total: ~5 min 45 sec. Under 6 minutes is the target. Over 8 minutes is a fail.

### The Setup Beat is the most important

Most demos fail before they start because the seller jumps straight to screen without framing what the buyer is about to see. The Setup beat fixes this.

Script:
"Before I show you the product, let me describe the scenario so you can see it the way your team would. You have a compliance officer. She received a question from an auditor. She's going to ask our agent that question. I want you to watch what the agent does — and then I'm going to show you the documentation that gets produced automatically. Ready?"

That's 15 seconds. It primes the buyer to watch for the right things.

### Handling interruptions without losing the thread

Buyers interrupt. That's good — it means they're engaged. The skill is parking the question without losing your place.

**Parking formula:**
"Good question — let me finish this step so you can see the context, then I'll address that directly."
Then finish the beat you're in. Then answer. Then re-anchor: "So back to where we were — [next beat name]."

Practice this sequence explicitly. It feels awkward at first. It's powerful in execution.

### The close must land one idea

After Beat 5, the close is:

"That's the full loop. Where you build the agent, where it runs, and where every action gets documented automatically. Most platforms give you one or two of these. We give you all three — with the audit paper trail your compliance team is going to ask for anyway."

One pause. Then: "Questions?"

Do not add more to the close. The silence after the close is part of the demo. Let it sit.

### What Demo Day (Apr 18) actually looks like

This session needs to cover logistics:

- **Format:** 30–45 min total slot. Kyle intro (2 min) → Kelan demo (6 min) → joint Q&A (15 min) → next step ask (3 min)
- **Audience:** 1–4 people. Likely: technical lead or engineering manager + compliance or security stakeholder
- **Goal:** Leave with a scheduled follow-up. Not a signed contract. A next call.
- **Environment:** Live product, not slides. If live breaks → screen recording fallback on standby
- **Kelan's job:** Demo + discovery. Kyle handles deep technical questions.

### The Next Step Ask (critical, often skipped)

At the end of every demo, there must be a specific ask. Not "any questions?" Not "let me know if you want to learn more."

Script:
"Based on what you saw today — is there a specific use case you'd want to map this to in your environment? If so, I'd love to set up a 30-minute call with Kyle where we can scope that out specifically for your team."

This is the transition from demo to discovery. Practice it.

---

## Timed Agenda

| Time | Block | Content |
|------|-------|---------|
| 0:00–0:05 | E4 Feedback Review | Kyle shares written feedback from the Loom. 3 things that worked, 3 things to fix. |
| 0:05–0:20 | Demo Structure + Logistics | Five-beat structure, timing targets, Demo Day logistics |
| 0:20–0:25 | Interruption Handling | Parking formula — explain, practice once |
| 0:25–0:55 | Demo Run 1 | Kelan runs the full demo, Kyle watches silently. Kyle scores with rubric. |
| 0:55–1:05 | Feedback Round 1 | Kyle delivers feedback against rubric. Not notes — rubric scores. |
| 1:05–1:25 | Demo Run 2 | Kelan runs again with interruptions from Kyle mid-demo |
| 1:25–1:35 | Feedback Round 2 + Close Drill | Focus on the close and next step ask |
| 1:35–1:40 | Demo Day Logistics | Environment setup, fallback plan, day-of checklist |
| 1:40–1:45 | Deliverable Assignment | E5 homework |
| 1:45–1:50 | Buffer | Overflow / extra reps if needed |

---

## Core Content

### Five-Beat Demo Breakdown (Kelan's Reference Card)

**Beat 1 — Setup (30s)**

Goal: Frame the scenario. No product yet.

"Before I show you the product, let me describe the scenario. You have a compliance officer. She's received a question from an auditor. She's going to ask our agent that question. Watch what happens — then I'll show you what gets produced automatically."

Do not open the product yet. This is words only. Eye contact with the camera.

---

**Beat 2 — Builder (45s)**

Goal: Show the configuration layer. Make it feel controlled, not magic.

"This is the builder. You can see the agent's configuration — its persona, which is Compliance Copilot, the knowledge base it's connected to, and the tools it has access to. Everything here was set by your technical lead. Nothing is automatic or uncontrolled. The agent can only do what it's configured to do."

Point to: persona name, connected knowledge base, tool list.

Do not linger. 45 seconds max.

---

**Beat 3 — Runtime (90s)**

Goal: Run a live query. Let the agent work. Comment on what's happening.

"I'm typing in the question the compliance officer received: 'Describe your organization's controls for restricting access to sensitive data.'"

[Type the query. Hit submit. While it runs:]

"You can see it retrieving from the connected knowledge base — this is the actual policy documentation — not hallucinating, pulling from source."

[Response appears.]

"Here's the answer. Structured. With citations. The compliance officer can use this as a starting point for her auditor response. Took about eight seconds."

Point to: the citations, the structured format.

---

**Beat 4 — Audit (45s)**

Goal: Show the trace. Reinforce that nothing is a black box.

"Every time the agent runs, this log is created. This is the WorkflowExecution record. You can see exactly what tools it called, what data it retrieved, and what it returned. Your security team can review this. Your auditors can request it. Nothing happens without a trace."

Point to: tool calls, data source, output summary.

---

**Beat 5 — Trust (90s)**

Goal: Trigger ComplianceReport + SecurityScan. This is the money moment.

"Now I'll trigger the ComplianceReport."

[Click trigger. While it generates:]

"This is pulling from the agent's recent activity log and mapping each action to a specific SOC 2 CC6 control."

[Report appears.]

"This is what you'd hand to your auditor. Generated in about 30 seconds. Previously this took a compliance team two to three weeks to prepare manually."

[Pause. Let the buyer look.]

"Before this agent went to production, the security team ran a SecurityScan. This is the report — minimum privilege, output sanitization, blast radius controls, secret handling. Security team reviewed this and approved the agent in one day."

Point to: the control mappings in the ComplianceReport, the green checkmarks in the SecurityScan.

---

**Close (30s)**

"That's the full loop. Where you build the agent, where it runs, and where every action gets documented automatically. Most platforms give you one or two of these. We give you all three — with the audit paper trail your compliance team is going to ask for anyway."

[Pause. Silence. 3 seconds.]

"Questions?"

---

### Interruption Handling (Practice Scripts)

**Interruption type 1 — Technical deep-dive**
"How does the MCP connection work exactly?"

Response: "Good question — let me finish this step so you can see the context, then I'll have Kyle address that directly. [Continue beat.] So back to where we were — [next beat name]. [After beat:] On the MCP question — Kyle, do you want to take that, or should I park it for the follow-up call?"

**Interruption type 2 — Competitor comparison**
"How is this different from what Microsoft Copilot does?"

Response: "Great timing — you'll actually see the answer in the next step. [Continue beat.] [After beat:] On the Microsoft question — what Copilot doesn't give you is what you just saw: the audit trail and the compliance documentation. That's the gap we fill."

**Interruption type 3 — Objection in demo**
"Our security team would never approve this."

Response: "That's exactly why I want to show you the next step. [Continue to SecurityScan.] [After SecurityScan:] The SecurityScan is designed specifically for that conversation — it's the report your security team would review. Does that change the picture at all?"

---

### Demo Environment Setup (Day-Of Protocol)

**T-60 min before demo**
- [ ] Open browser, navigate to live demo environment
- [ ] Log in with demo credentials (not personal account)
- [ ] Run a test query — confirm response time under 15 seconds
- [ ] Open WorkflowExecution log — confirm it populated
- [ ] Trigger a ComplianceReport — confirm it generates
- [ ] Run SecurityScan — confirm it runs

**T-30 min before demo**
- [ ] Close all tabs except the demo environment
- [ ] Close all notifications (Slack, email, calendar)
- [ ] Open fallback recording (local file, already downloaded)
- [ ] Confirm screen share setup — share just the browser window, not full screen
- [ ] Test audio and camera

**T-5 min before demo**
- [ ] Refresh the demo environment
- [ ] Have the Setup beat script visible (physical notecard or second monitor, not the shared screen)
- [ ] Kyle is on call and ready for technical questions

**If live environment breaks:**
"Give me one second — I want to show you this without any lag. I have a recording that will be cleaner."
[Switch to screen recording. Continue narrating. Never apologize. Never explain the technical issue.]

---

### Demo Day (Apr 18) — Full Run of Play

**Pre-meeting (Kyle + Kelan, 10 min before)**
- Confirm who's in the room (name, role)
- Agree on Kyle's Q&A coverage (technical questions = Kyle, commercial questions = Kelan)
- Confirm next step ask script

**Kyle intro (2 min)**
"We're a Claude-native enterprise AI agent platform. Today Kelan is going to show you the product — about 6 minutes — and then we'd love to hear about what your team is working on."

**Kelan demo (6 min)**
Five-beat structure. No improvising. No going long.

**Joint Q&A (15 min)**
- Kelan handles: product questions, use case questions, "how long does this take" questions
- Kyle handles: technical architecture, security depth, integration details
- Both: keep an ear for the real problem behind each question

**Next step ask (3 min — Kelan)**
"Based on what you saw — is there a specific use case you'd want to map this to? If so, I'd love to set up a 30-minute call with Kyle where we scope that out specifically for your team."

Wait for a yes/maybe/no. Don't fill the silence. Don't offer alternatives unprompted. Get the commitment or get a clear objection.

---

## Demo Scoring Rubric (Kyle Uses This)

| Criterion | 1 (Needs Work) | 3 (Acceptable) | 5 (Demo Day Ready) |
|-----------|---------------|----------------|-------------------|
| **Setup Beat** | Skipped or vague | Present but rushed | 30s, scenario clear, buyer primed |
| **Timing** | Over 8 min or under 4 min | 6–8 min | 5–6.5 min |
| **Three Layers Named** | Not mentioned | Mentioned in passing | Named at setup and close |
| **ComplianceReport Story** | Skipped or garbled | Explained adequately | "Auditor asks for this. We generate it in 30 sec." |
| **SecurityScan Story** | Skipped or garbled | Explained adequately | "Security team's review artifact. One day, not weeks." |
| **Interruption Handling** | Lost place, got flustered | Parked okay but lost momentum | Parked, finished beat, answered, re-anchored |
| **Close** | No close or padded | Close present | Exact close script, 3-second pause |
| **Next Step Ask** | None | Vague ("let me know") | Specific ask, waits for answer |

**Demo Day threshold: 4.0 average across all criteria. Any criterion below 3 is a blocker.**

---

## Deliverable

**Due: Apr 7 (before E6)**

Run the demo twice solo (no audience). Record the second run as a Loom. Send to Kyle.

Kelan's self-assessment (to be completed before sending the Loom):
- Time on the recording: _____ (target: 5–7 min)
- Which beat felt weakest: _____
- Did you pause after the close? Y / N
- Did you deliver the next step ask? Y / N

Kyle will score against the rubric and return feedback before E6.

**Demo Day pass criteria:** 4.0 average on the rubric, confirmed in E7 dress rehearsal.

---

## Common Questions / Resistance

**"What if I go blank mid-demo?"**
The five-beat structure is your recovery. If you lose your place: "Let me back up — [beat name]. The point I want to make here is [beat job]." The structure rescues you.

**"What if they ask a question I don't know?"**
"That's exactly the kind of thing we'd dig into on a follow-up call with Kyle — he built the architecture. Can we get that on the calendar?" You're not expected to have every answer. You're expected to get to the next call.

**"What if they're not interested?"**
Then you find out fast, which is good. "What would have to be different about what you saw for it to be relevant to your team?" If the answer is nothing useful, thank them and move on. Not every demo leads to a deal.

**"What if they ask about pricing mid-demo?"**
"Great question — let me finish the demo so you have the full picture, and we'll cover commercial specifics right after." Then finish. Then go to pricing (E6 content).

---

## Prep for E6

E6 is pricing and proposals. Come to E6 having:
1. Watched your E5 Loom with Kyle's rubric score in hand
2. Identified the company from E2's ICP list you would most want to close
3. Written down: what do you think a POC engagement costs? What does Y1 look like?

You'll build a mock proposal in E6 for that specific company.
