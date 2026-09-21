# INT Ops Companion — ChatGPT Sites Build Brief

**For:** Kyle Rosebrook · **Lane:** INTINC (personal, unofficial tool) · **Prepared:** 2026-07-13

## TL;DR

One private ChatGPT Site, two tabs: **Service Desk Companion** (KB drafting, ticket docs, client email templates, escalation reference, a recurring-issue log) and **AI SME Snapshot** (workstream status, open questions, a leadership-brief drafter). Sites can't reach live data — everything here is either static reference content or something you log manually. Before building: turn off "Improve the model for everyone" in ChatGPT's Data Controls, since this is a personal account and the content is INT-adjacent even though sanitized.

## What ChatGPT Sites actually is

Grounded in OpenAI's own docs, fetched today — this shipped after my training cutoff, so none of this came from memory.

- Lets you build "interactive websites and lightweight apps" by describing them in chat (trigger with `@Sites` or just ask), then iterating conversationally afterward.
- Every deployment gets a real URL, and that URL is a production URL the moment you publish — save a version before pushing changes live.
- Storage: **D1** (relational database — good for records that accumulate over time) and **R2** (object/file storage). Both persist across sessions.
- **Cannot connect to live external data sources today.** No FreshService API pull, no live Kaseya/HubSpot feed. Anything "live" has to be pasted in by you or logged manually inside the Site.
- Visibility is your call: private (owner-only), selected people, workspace-wide, or fully public. For a personal-account tool with INT-adjacent content, private is the only sane default.
- Content restrictions (health info, payment data, minors, financial transactions) don't apply here — noting only because they exist.
- Privacy: on Business/Enterprise plans, Sites content isn't used for model training by default. On personal Plus/Pro plans, it can be if "Improve the model for everyone" is on. [GENERATED — I can't see your account's actual toggle state; this reflects ChatGPT's known historical default for consumer plans. Verify it yourself in Settings → Data Controls before pasting anything below.]

**Sources:**
- [Creating and managing ChatGPT Sites — OpenAI Help Center](https://help.openai.com/en/articles/20001339-creating-and-managing-chatgpt-sites)
- [ChatGPT Sites — OpenAI Academy](https://openai.com/academy/chatgpt-sites/)
- [Sites — OpenAI Developers docs](https://learn.chatgpt.com/docs/sites)

## Why one Site, two tabs — not one blob, not two disconnected Sites

You asked for both workstreams in one hub. OpenAI's own guidance says Sites work best narrow and focused — "internal, focused tools rather than complex software products." Splitting into two separate Sites would honor that guidance more cleanly, but it breaks your explicit "one hub" answer, and it isn't really necessary here: a service-desk KB drafter and an AI-SME status tracker don't share data, so they don't need to be architecturally tangled — they just need to live behind one URL. Tabs solve that: one bookmark, two clean, non-overlapping surfaces, neither bloated by the other's content. If this ever grows real workflow logic in both halves, split it into two Sites at that point — don't force it now.

## Before you build: privacy setting

1. ChatGPT → Settings → Data Controls.
2. Turn OFF "Improve the model for everyone" if it's on.
3. Then build. This applies regardless of tab content — even sanitized internal process detail (your ticket workflow, your KB standards, your business-case numbers) isn't something you want feeding a foundation model's training set by default.

## The build prompt

Paste this into ChatGPT (prefix with `@Sites` if it doesn't auto-trigger). It's long on purpose — Sites builds better from one dense brief than from ten small follow-ups. Refine afterward with plain-language edit requests once you see the first draft.

```
@Sites Build me a private, personal internal tool called "INT Ops Companion."
This is for my own individual use only — not shared with anyone else, not an
official INT Inc. system, just my personal reference/productivity tool as a
Service Tech Level 1 and informal AI SME there.

HARD RULE, apply everywhere in this Site: never include real client names,
real employee PII beyond the named stakeholders below, credentials, tokens,
or connection strings. Use bracketed placeholders like [Client Name] in any
example content. If I ever paste something that looks like real client data
into a field, don't echo it back verbatim in generated drafts without a
placeholder swap.

Structure this as two tabs.

======================
TAB 1: SERVICE DESK COMPANION
======================

Purpose: help me draft KB articles, document tickets, write client emails,
and track recurring issues I notice, following INT Inc.'s standards below.

1. KB ARTICLE DRAFTER
Given a short description of an issue, draft a KB article in this exact
structure (COBA standard: Clear, Objective, Brief, Actionable):
- Title (include error code if there is one)
- Summary (1-2 sentences)
- Symptoms
- Cause
- Resolution Steps (numbered, sequential)
- Escalation Criteria
- Additional Notes

Seed example (already-written article, use as the style bar):
Title: Troubleshooting Printer Installation Error #740 — "The requested
operation requires elevation"
Summary: Windows printer installation fails with error #740, requiring
administrator privileges. Typically occurs when installing printer drivers
or connecting to shared printers.
Cause: Windows requires elevated permissions to install printer drivers or
add network devices; user account lacks admin rights; Group Policy
restrictions prevent installation.
Resolution Steps: 1) Open Control Panel to Devices and Printers. 2) Click
"Add a printer." 3) If prompted, right-click and select "Run as
administrator." 4) Open Command Prompt as Administrator. 5) Confirm printer
is shared correctly on server. 6) Test connectivity to server (e.g., ping
the print server hostname).
Escalation Criteria: User lacks admin rights (needs IT admin); drivers
require elevated install and Group Policy may block it; Group Policy
restrictions block install.
Additional Notes: Ensure VPN/network connectivity is active if installing
remotely; check driver compatibility if the issue persists after elevation.

2. TICKET DOCUMENTATION HELPER
Given raw notes about an interaction, reformat into this structure:
Client Name | Contact (name/email/phone) | Issue Description (what plus
when) | Impact (who's affected, business impact level) | Steps Attempted |
Environment (OS, software versions, network location) | Resolution
(detailed steps taken) | Follow-up (monitoring or future actions needed)
Standard: zero ambiguity, complete sentences, proper grammar, timestamps on
major actions, note client sentiment (frustrated, satisfied, urgent).

3. CLIENT EMAIL DRAFTER
Two templates, fill-in-the-blank style, matching this tone (empathetic,
sets expectations, translates technical to business impact, proactive):

INITIAL RESPONSE (P2/P3):
Subject: [Ticket #] [Issue] - Acknowledged
Hi [Client Name], Thank you for reporting [issue]. I've reviewed your
ticket and understand [restate issue in plain language]. I'll need to
[next diagnostic step] and expect to have an update within [timeframe],
with full resolution by [target]. [Optional: workaround if urgent.] I'll
keep you updated.
Best regards, Kyle Rosebrook, Service Tech Level 1, INT Inc.

ESCALATION NOTIFICATION:
Subject: [Ticket #] [Issue] - Escalated to [Team]
Hi [Client Name], I've completed initial troubleshooting on [issue].
[Root cause summary]. I've escalated to our [Team] ([Ticket #]) with full
context, and they'll reach out within [timeframe]. You should have full
resolution by [target]. I'll monitor and follow up.
Best regards, Kyle

4. ESCALATION SEVERITY REFERENCE (static table)
P0 — under 5 min response — all systems down, client business halted —
executive escalation, all-hands
P1 — under 15 min response — major service disruption, 10%+ users
affected — immediate tech lead involvement
P2 — under 1 hr response — feature broken, workaround exists — standard
escalation path
P3 — under 4 hrs response — UI issue, minimal functional impact — queue
assignment

Also include the Tier 1 workflow as a simple ordered list: Receive ticket
then Triage (urgency plus complexity) then ask: resolvable in under 15
minutes? If yes: resolve, document, close, follow up. If no: does it need
Tier 2 (networking, security, dev)? If yes: escalate with context, monitor,
update client. If no: does it need research or testing? Research, test,
then resolve or escalate.

5. RECURRING ISSUE LOG (use D1 for this — persistent structured data)
A simple form plus list where I can log: issue summary, date first seen,
running occurrence count (increment if I log the same issue again), and
whether I've already drafted a KB article for it (yes/no). Sort by
occurrence count descending so I can see at a glance which recurring
issues most need a KB article. This is how I hit my "3 to 5 KB articles
per month" target — it's my personal backlog, not connected to the real
ticketing system.

======================
TAB 2: AI SME SNAPSHOT
======================

Purpose: a leadership-ready snapshot of my AI enablement work at INT, plus
a tool to draft leadership updates. This is a STATIC reference I'll ask
you to update by hand periodically, not a live tracker — I have a separate
Claude-based tool for live tracking; this is the snapshot and output layer.

1. WORKSTREAM STATUS (static content block, I'll paste updates when they
change)
Seed with these six workstreams and their current status:
- EPB Platform — Launch ready
- InVelo (AI consulting service line) — Repositioning
- Skills Library — Phase 1 active
- Repo/Knowledge — Pre-execution
- HumanX Deck — Ready
- INT OS / Dotty — In dev

2. OPEN QUESTIONS TRACKER (use D1 — I need to check these off as they get
answered)
Seed with these open questions, each with a status field (open/answered)
and a notes field:
- Does the current LastPass tier meet SOC 2 audit-log and MFA-enforcement
requirements?
- What does Kaseya VSA currently cover for client monitoring, and what
falls through the gaps?
- What specific Azure services is INT using (App Service, SQL, VMs, etc.)?
- Does INT manage any AWS environments, for itself or for clients?
- Who approves software purchases at INT: Dave, Jackie, or Stacy Mueller
(EVP Finance)?
- What is INT's current fiscal year and budget cycle, and when are new
tools typically approved?
- Is there an existing AI/automation budget line, or is this a net-new
ask?

3. NEXT STEPS CHECKLIST (use D1 — checkbox list I can mark done)
- Get my Claude Teams seat added (INT org exists, one admin action, $30 a
month, no approval needed)
- Verify activation status of Microsoft Purview, Power Automate, and
Azure Monitor with an IT admin
- Answer the 7 open questions above
- Pull real ROI numbers (FreshService ticket volume and handle time,
HR/Finance headcount and rates)
- Schedule the Dave/Jackie/Daniel meeting

4. LEADERSHIP BRIEF DRAFTER
Given bullet-point notes from me, draft a formatted update addressed to
one of: Daniel Bell (direct manager, Service Desk Manager), Dave Linderman
(President), or Jackie Miles. Support these update types: monthly progress
update, initiative proposal, adoption-milestone announcement, domain-unlock
request, blocker or escalation communication. Keep tone direct,
evidence-first, no fluff. State what's confirmed versus what's still an
open question, don't blur the two.

======================
GENERAL
======================
Keep the visual style plain and functional — this is a working tool for
one person, not a client-facing product. Dark or light theme, your choice,
just keep it readable. Set sharing and visibility to private, owner only,
no public link.
```

## Data model (D1)

| Table | Fields | Purpose |
|---|---|---|
| `recurring_issues` | id, issue_summary, first_seen_date, occurrence_count, kb_drafted (bool) | Service Desk KB backlog |
| `open_questions` | id, question, status (open/answered), notes | AI SME open-questions tracker |
| `next_steps` | id, step, status (pending/done), owner | AI SME next-steps checklist |

## Verification / acceptance criteria

Run these after ChatGPT actually builds the Site — don't treat "it looks done" as done:

1. **Visibility check:** confirm the Site's sharing setting is private/owner-only, not public. This is the single most important check given the content.
2. **No real data check:** skim both tabs for anything that isn't a placeholder or already-public INT info. Company name, service lines, and stakeholder names/titles are fine; real client names or credentials are not.
3. **Tab 1 smoke test:** describe a fake issue ("test client's monitor won't wake from sleep") and confirm the KB Article Drafter returns COBA-structured output with no real client name leaking through.
4. **Tab 1 D1 test:** log the same fake recurring issue twice and confirm `occurrence_count` increments to 2 rather than creating two rows.
5. **Tab 2 smoke test:** ask the Leadership Brief Drafter for a "monthly progress update to Daniel Bell" from 3 fake bullet points, and confirm it produces a direct, evidence-first draft rather than vague filler.
6. **Tab 2 D1 test:** mark one open question "answered" and confirm it persists after closing and reopening the Site.
7. **Privacy setting:** confirm "Improve the model for everyone" is off in your account before step 3 onward.

## Open follow-ups

- If this tool ever needs live ticket data, Sites can't do that today — that would push you back toward a custom-built option (a bespoke web app hitting FreshService's API directly, or extending the WorkstreamMapper pattern) instead of Sites.
- If this ever becomes something Daniel or the wider Service Desk team would use, revisit the "personal, unofficial" framing — that changes the privacy defaults, the sharing tier, and probably means checking with IT first, per your own project's stated data-handling rules.
- Your business case's "one confirmed ask" (the Claude Teams seat) and this Site are unrelated but adjacent — worth mentioning to Daniel or Jackie in the same conversation if one ever happens, since both are "formalize the tools I'm already using" asks.

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

- Sites cannot connect to live external data sources today. [SOURCED — OpenAI developer docs]
- Sites content on personal (non-Business/Enterprise) plans may be used for model training if "Improve the model for everyone" is on; this is off by default only on Business/Enterprise. [SOURCED for the Business/Enterprise default; GENERATED for what the personal-plan default currently is — verify in your own settings]
- ! Contradiction to flag: you asked for one hub covering two workstreams, but OpenAI's own guidance recommends narrow, single-purpose Sites. I resolved this with tabs rather than picking a side — say so if you'd rather I just split it into two Sites instead.
- FreshService, Kaseya VSA, Bitdefender, LastPass, Cisco AnyConnect, Duo, HubSpot, SOC 2 Type II, KnowBe4, and Vanta are INT's confirmed current stack. [SOURCED — your own int-business-case-real.jsx]
- No OpenAI/ChatGPT enterprise relationship appears anywhere in INT's confirmed stack. [SOURCED — absence from the same document]

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS

- I don't know your current ChatGPT plan tier (Plus, Pro, or Pro Lite) — it affects the training-data default. You clearly have Sites access already per your screenshot, so this doesn't block building it, but it does matter for the privacy check above.
- I don't know whether Sites supports exporting or backing up D1 data. If OpenAI changes or sunsets this beta feature, you could lose the recurring-issue log and open-questions tracker with no export path — worth testing an export early rather than assuming one exists.
- I haven't seen INT's actual current KB tooling first-hand (whether FreshService's built-in KB module differs from what the Dec 2025 project doc assumed). The COBA template above should be format-agnostic regardless, but confirm the real destination system before treating this as final.
- This entire tool sits outside INT's audit boundary — the same caveat that already applies to your Claude Cowork usage. Fine for a personal reference tool, not fine if it ever touches anything regulated.

## SELF-REVIEW

Caught and corrected before shipping this: I initially scoped this as either a pure Tier-1 tool or a pure AI-SME tool, based on the original Dec 2025 project doc alone — then found your WorkstreamMapper and business-case artifacts mid-research and had to substantially widen scope. The version above reflects that wider, more current picture. I also almost defaulted the AI-SME tab into a live tracker duplicating WorkstreamMapper's job; caught that and scoped it as a static snapshot plus leadership-brief tool instead, since Sites can't do live data anyway and duplicating your existing Claude tool would be pure scaffolding with no new value. One thing I did not resolve unilaterally: the tension between your "one hub" answer and OpenAI's "keep it narrow" guidance — I picked tabs as the reconciliation and said so explicitly rather than quietly picking a side.
