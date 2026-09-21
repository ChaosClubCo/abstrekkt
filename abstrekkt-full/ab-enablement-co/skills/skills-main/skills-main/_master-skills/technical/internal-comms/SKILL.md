---
name: internal-comms
description: Helps build and debug internal comms processes. Internal communications toolkit for crafting effective team updates, stakeholder briefings, and organizational announcements. Use when writing status reports, change communications, or cross-team coordination messages.
---

# Internal Communications

A comprehensive toolkit for writing all kinds of internal communications using formats that align with company standards. This skill covers status reports, leadership updates, 3P updates, company newsletters, FAQs, incident reports, project updates, change announcements, and cross-team coordination messages.

## When to Use

Activate this skill when asked to write:
- 3P updates (Progress, Plans, Problems)
- Company newsletters
- FAQ responses
- Status reports
- Leadership updates and executive briefings
- Project updates
- Incident reports and post-mortems
- Change announcements
- Cross-team coordination messages
- Escalation communications

## Core Workflow

1. **Identify the Communication Type** - Determine which format fits the request: status update, announcement, incident report, newsletter, FAQ, or general communication. If unclear, ask the user to clarify the audience and purpose.

2. **Load the Appropriate Guideline** - Check the `examples/` directory for format-specific templates:
   - `examples/3p-updates.md` - For Progress/Plans/Problems team updates
   - `examples/company-newsletter.md` - For company-wide newsletters
   - `examples/faq-answers.md` - For answering frequently asked questions
   - `examples/general-comms.md` - For anything that does not match the above

3. **Gather Context** - Identify the audience (team, department, leadership, all-company). Determine the key message: what does the reader need to know, do, or feel? Collect supporting data, dates, and names.

4. **Draft Using the Template** - Follow the specific instructions in the guideline file for formatting, tone, and content structure. Apply the audience-specific messaging guidelines (see below).

5. **Review for Clarity and Tone** - Read the draft from the audience's perspective. Remove jargon when writing for non-technical audiences. Ensure action items are explicit and assigned. Verify dates, numbers, and names.

6. **Select the Right Channel** - Match the communication to the appropriate delivery channel based on urgency, audience size, and formality (see Channel Strategy below).

7. **Follow Up** - For important communications, plan a follow-up cadence. Track whether action items are completed. Collect feedback on communication effectiveness.

## Templates / Frameworks

### 3P Update (Progress, Plans, Problems)

```markdown
# [Team Name] - Weekly 3P Update
**Period**: [Date range]
**Author**: [Name]

## Progress (What we accomplished)
- [Completed item 1] - [Impact or metric]
- [Completed item 2] - [Impact or metric]
- [Completed item 3] - [Impact or metric]

## Plans (What we will do next)
- [Planned item 1] - [Owner] - [Target date]
- [Planned item 2] - [Owner] - [Target date]
- [Planned item 3] - [Owner] - [Target date]

## Problems (Blockers and risks)
- [Problem 1] - [Severity: High/Medium/Low] - [Help needed]
- [Problem 2] - [Severity: High/Medium/Low] - [Help needed]

## Key Metrics
| Metric | Last Week | This Week | Target |
|--------|-----------|-----------|--------|
| [Metric 1] | [Value] | [Value] | [Value] |
| [Metric 2] | [Value] | [Value] | [Value] |
```

### Incident Report Template

```markdown
# Incident Report: [Brief Title]
**Severity**: [P0/P1/P2/P3]
**Date**: [Incident date]
**Duration**: [Start time] - [End time] ([Total duration])
**Author**: [Name]
**Status**: [Active / Resolved / Post-mortem complete]

## Summary
[2-3 sentence summary: what happened, who was affected, current status]

## Timeline
| Time (UTC) | Event |
|------------|-------|
| HH:MM | [First detection or alert] |
| HH:MM | [Response initiated] |
| HH:MM | [Key decision or action] |
| HH:MM | [Resolution or mitigation] |

## Impact
- **Users affected**: [Number or percentage]
- **Revenue impact**: [Estimated amount or "None"]
- **Data impact**: [Any data loss or corruption]
- **Duration of degraded service**: [Time]

## Root Cause
[Clear explanation of what caused the incident. Be specific and factual.]

## Resolution
[What was done to resolve the incident]

## Action Items
| Action | Owner | Priority | Due Date | Status |
|--------|-------|----------|----------|--------|
| [Action 1] | [Name] | [P0/P1/P2] | [Date] | [Open/Done] |
| [Action 2] | [Name] | [P0/P1/P2] | [Date] | [Open/Done] |

## Lessons Learned
- [What went well]
- [What could be improved]
- [What we will change going forward]
```

### Change Announcement Template

```markdown
# [Change Title]
**Effective Date**: [Date]
**Affected Teams/Systems**: [List]
**Change Owner**: [Name]

## What is Changing
[1-2 paragraphs explaining the change in plain language. Lead with the
impact on the reader, not the technical details.]

## Why We Are Making This Change
[Brief explanation of the motivation. Connect to company goals or user
needs. Be honest about tradeoffs.]

## What You Need to Do
1. [Specific action 1] - by [date]
2. [Specific action 2] - by [date]
3. [Specific action 3] - by [date]

## What Will Stay the Same
[Reassure readers about what is NOT changing. This reduces anxiety.]

## Timeline
| Date | Milestone |
|------|-----------|
| [Date] | Announcement (today) |
| [Date] | [Preparation step] |
| [Date] | Change goes live |
| [Date] | Old system/process retired |

## FAQ
**Q: [Most likely question]?**
A: [Answer]

**Q: [Second most likely question]?**
A: [Answer]

## Support and Questions
[How to get help. Name a specific person or channel, not "reach out to
your manager."]
```

### Executive Briefing Template

```markdown
# [Topic] - Executive Briefing
**Date**: [Date]
**Prepared by**: [Name]

## Bottom Line
[One paragraph: the single most important thing leadership needs to
know. State the recommendation or decision needed upfront.]

## Context
[2-3 sentences of essential background. Assume the reader has 60
seconds.]

## Options and Tradeoffs
| Option | Pros | Cons | Cost | Timeline |
|--------|------|------|------|----------|
| [Option A] | [Pros] | [Cons] | [Cost] | [Time] |
| [Option B] | [Pros] | [Cons] | [Cost] | [Time] |

## Recommendation
[Which option and why. Be direct.]

## Risks
- [Risk 1] - [Mitigation]
- [Risk 2] - [Mitigation]

## Ask
[What you need from leadership: approval, budget, headcount, decision]
```

## Best Practices

### Audience-Specific Messaging

- **Engineering team**: Be technical and specific. Include code references, system names, and metrics. Skip motivational framing.
- **Product/Design team**: Focus on user impact and experience changes. Use before/after comparisons. Include screenshots or mockups when relevant.
- **Leadership/Executives**: Lead with the bottom line. Use numbers and business impact. Keep it under one page. State the ask clearly.
- **All-company**: Use plain language. Explain acronyms. Focus on "what this means for you." Keep tone warm but professional.
- **External stakeholders**: Be formal. Focus on outcomes and timelines. Avoid internal jargon entirely. Get legal review for anything contractual.

### Writing Tone Guidelines

- **Be direct**: State the main point in the first sentence. Do not build up to it.
- **Be specific**: "Latency increased by 200ms" is better than "performance degraded."
- **Be honest**: Acknowledge problems directly. Teams trust leaders who do not sugarcoat.
- **Be human**: Write like a person, not a press release. First person is fine.
- **Be brief**: Respect the reader's time. If it can be said in fewer words, use fewer words.
- **Use structure**: Bullet points, headers, and tables are easier to scan than prose paragraphs.

### Channel Strategy

| Channel | Best For | Response Time | Formality |
|---------|----------|---------------|-----------|
| Slack message | Quick updates, questions, FYIs | Minutes | Low |
| Slack thread | Discussion, decisions | Minutes-hours | Low |
| Email | Formal announcements, external | Hours-day | Medium-High |
| Wiki/Confluence page | Permanent reference, documentation | N/A | High |
| All-hands meeting | Major changes, Q&A | Scheduled | Medium |
| 1:1 or small group | Sensitive topics, feedback | Immediate | Low |
| Video recording | Demos, walkthroughs, async updates | Async | Medium |

**Channel selection rules**:
- If it requires action within 24 hours, use Slack and email.
- If it is a permanent reference, put it on the wiki and link from Slack/email.
- If it is sensitive or could cause anxiety, deliver in person (or video call) first, then follow up in writing.
- If it affects more than 20 people, use a dedicated announcement channel.

### Escalation Framework

When a problem needs to be escalated, follow this structure:

```
Level 1: Team lead (informational, no action needed yet)
Level 2: Department head (blocker, need decision within 48 hours)
Level 3: VP/Director (significant risk or cross-team conflict)
Level 4: Executive team (business-critical, customer-facing impact)
```

For each escalation, include:
- **What** is happening (facts, not opinions)
- **Impact** if not addressed (quantified: users, revenue, timeline)
- **What has been tried** so far
- **What you need** (specific ask: decision, resources, air cover)
- **Deadline** for the decision

## Common Patterns

### Pattern 1: The Status Cadence

Establish a regular rhythm for team updates:
- **Daily**: Async standup in Slack (what I did, what I am doing, blockers)
- **Weekly**: 3P update posted to team channel every Friday by 4pm
- **Bi-weekly**: Sprint review summary shared with stakeholders
- **Monthly**: Department metrics and highlights for leadership
- **Quarterly**: OKR progress report and next-quarter planning

### Pattern 2: The Bad News Sandwich (Avoid It)

Do NOT bury bad news between good news. Instead, be direct:
- State the problem clearly upfront
- Explain the impact honestly
- Describe what is being done about it
- Provide a timeline for resolution
- Offer a channel for questions

People respect directness. They resent discovering that bad news was hidden.

### Pattern 3: The Decision Record

When a significant decision is made, document it:
- **Decision**: What was decided (one sentence)
- **Date**: When it was decided
- **Deciders**: Who made the decision
- **Context**: Why this decision was needed
- **Options considered**: What alternatives were evaluated
- **Rationale**: Why this option was chosen
- **Consequences**: What changes as a result

### Pattern 4: Cross-Team Request

When requesting something from another team:
- Lead with context about YOUR team's situation (briefly)
- State the specific request clearly
- Explain the impact on THEIR priorities (show you understand the cost)
- Propose a timeline that gives them flexibility
- Offer to meet synchronously if needed
- Thank them and acknowledge the burden

### Pattern 5: The All-Hands Update Structure

For company-wide presentations or written updates:
1. **Celebrate wins** (start positive, be specific about who contributed)
2. **Share key metrics** (trends matter more than absolute numbers)
3. **Address challenges** (be honest, show the plan)
4. **Announce changes** (what, why, when, what to do)
5. **Look ahead** (connect to vision, create excitement)
6. **Open for questions** (have prepared answers for likely hard questions)

## Anti-Patterns to Avoid

- **The wall of text**: Long unstructured paragraphs that nobody reads. Use headers, bullets, and bold.
- **The passive voice dodge**: "Mistakes were made" instead of "We made a mistake." Own it.
- **The premature announcement**: Announcing a change before the plan is solid. This creates confusion and erodes trust.
- **The CC firehose**: Adding too many people to an email thread. Ask: does this person need to act, or just know?
- **The Slack-only announcement**: Posting critical information only in a fast-moving Slack channel where it will be buried in minutes.
- **Jargon overload**: Using acronyms and internal terms without explanation when the audience includes people outside your team.

## Keywords
internal communications, status report, 3P update, incident report, change announcement, newsletter, FAQ, executive briefing, escalation, team update, stakeholder communication
