import os

D = '/home/claude/builds'
os.makedirs(f'{D}/skills', exist_ok=True)
os.makedirs(f'{D}/agents', exist_ok=True)

# ═══════════════════════════════════════════════════════════
# 5 MISSING SKILL PACKS
# ═══════════════════════════════════════════════════════════

skills = {}

skills['ai-audit-delivery'] = """---
name: ai-audit-delivery
version: 1.0.0
metadata:
  description: Run FlashFusion AI Setup Audits end-to-end — gap analysis, priority matrix, written report, debrief.
  author: FlashFusion
  category: delivery
  use_when:
    - Running an AI Setup Audit for a client
    - Analyzing audit scorecard responses
    - Producing a gap analysis or priority matrix
    - Writing an audit report
    - Preparing for an audit debrief call
  trigger_phrases:
    - ai-audit-delivery
    - run the audit
    - analyze the scorecard
    - produce the audit report
    - audit gap analysis
    - audit priority matrix
    - audit debrief prep
allowed_tools:
  - read_file
  - create_file
---

# AI Audit Delivery Skill

## Purpose
Run FlashFusion AI Setup Audits from scorecard data to written report. Every audit follows the same methodology — this skill enforces consistency.

## Audit Dimensions (Score 1–10)

1. **Tool selection fit** — Are the right AI tools chosen for the use case?
2. **Prompt quality** — Are prompts structured, specific, and consistent?
3. **Skill deployment** — Are skill packs or custom instructions in use?
4. **Governance and policy** — Are there usage policies, guardrails, and approval flows?
5. **Team training** — Does the team know how to use AI tools effectively?
6. **Measurement** — Are time savings and ROI being tracked?
7. **Stack integration** — Are AI tools connected to existing workflows and systems?
8. **Data security** — Is sensitive data handled according to policy?

## Output Format

### Readiness Score
- Total: X/80
- Percentage: X%
- Level: Strong (80%+) / Developing (60-79%) / Early-stage (40-59%) / Critical gaps (<40%)

### Gap Analysis
List identified gaps by severity (High / Medium / Low). High = blocks ROI or creates risk. Medium = limits value. Low = nice-to-have.

### Priority Matrix
2x2 grid: Impact (vertical) vs. Effort (horizontal). Place top 6 interventions.

### Top Recommendations
3 specific, actionable recommendations. Each recommendation traces to a specific audit signal.

### Recommended Next Step
One of: Enablement Sprint ($5,000), Managed Retainer ($2,000/mo), or Custom. One paragraph.

## Report Structure
1. Executive summary (3 bullets)
2. Dimension scores (table)
3. Gaps identified (severity-ranked list)
4. Priority matrix
5. Recommendations (top 3)
6. Next steps

## Quality Gate
Before delivering any audit report:
- [ ] Every recommendation traces to a specific scorecard signal
- [ ] No generic advice that applies to any company
- [ ] Gaps are severity-rated, not just listed
- [ ] Next step is specific, not vague
"""

skills['enablement-sprint-planning'] = """---
name: enablement-sprint-planning
version: 1.0.0
metadata:
  description: Plan and manage 5-week FlashFusion Enablement Sprints with milestone definition, client delivery checklist, and week-by-week task management.
  author: FlashFusion
  category: delivery
  use_when:
    - Planning an Enablement Sprint after a sold engagement
    - Building a sprint plan from audit output
    - Defining milestones and deliverables for a sprint
    - Checking sprint progress or status
    - Planning a kickoff call agenda
  trigger_phrases:
    - enablement-sprint-planning
    - plan the sprint
    - sprint plan
    - enablement sprint
    - week by week plan
    - sprint milestones
    - kickoff agenda
    - sprint status
allowed_tools:
  - read_file
  - create_file
---

# Enablement Sprint Planning Skill

## The 5-Week Structure

### Week 1: Audit and Discovery
**Deliverables:** Kickoff call notes, intake form analysis, current-state documentation, gap analysis
**Tasks:**
- Kickoff call (align on goals, stakeholders, success criteria)
- Analyze intake form and audit scorecard
- Map current tool stack and workflows
- Identify top 3 automation opportunities
- Draft audit report

**Failure mode:** Rushing past discovery. Every sprint failure traces to a bad diagnosis.

### Week 2: Skill Pack Selection and Configuration
**Deliverables:** Skill pack list with justification, configured packs, trigger documentation
**Tasks:**
- Select skill packs (each must trace to an audit gap)
- Configure for client's Claude environment
- Set trigger phrases and allowed-tools (least privilege)
- Test skill activation
- Client review of configured set

**Failure mode:** Deploying generic packs not configured for their actual workflows.

### Week 3: Pilot Deployment
**Deliverables:** Pilot group onboarded, day-1 feedback, friction log
**Tasks:**
- Deploy to pilot group (3–5 people)
- Run hands-on walkthrough (60 min)
- Collect day-1 feedback
- Troubleshoot activation issues
- Document wins and friction

**Failure mode:** Skipping pilot and going straight to full rollout.

### Week 4: Full Rollout and Training
**Deliverables:** Full team deployed, training session, skills user guide
**Tasks:**
- Deploy to full team
- Deliver skills library user guide
- Run team training session (90 min)
- Set up usage tracking
- Identify candidates for custom skill development

### Week 5: Measurement and Handoff
**Deliverables:** ROI summary, Sprint Summary Report, handoff documentation
**Tasks:**
- Collect usage data and time-savings self-reports
- Build ROI summary (actuals vs. projections)
- Deliver Sprint Summary Report
- Present next steps (retainer, follow-on, standalone)
- Confirm client has admin access and documentation

## Sprint Plan Document Structure
1. Sprint overview (client, dates, selected skill packs, goals)
2. Week-by-week task list with owners
3. Milestone dates and deliverables
4. Client responsibilities
5. Risk register (top 3 risks with mitigation)
6. Communication cadence
"""

skills['client-communication'] = """---
name: client-communication
version: 1.0.0
metadata:
  description: Draft lifecycle client communications — intake confirmation, weekly updates, milestone delivery, QBR, renewal.
  author: FlashFusion
  category: delivery
  use_when:
    - Drafting any client-facing email or update
    - Writing a weekly status update
    - Delivering a milestone or report
    - Preparing for a QBR
    - Writing a renewal or next-steps email
    - Handling a client question or concern
  trigger_phrases:
    - client-communication
    - draft a client email
    - client update
    - weekly update
    - milestone delivery
    - renewal email
    - status email
    - client check-in
allowed_tools: []
---

# Client Communication Skill

## Communication Principles
1. Every email has one clear ask or piece of information
2. Subject line states what it is (not "Following up")
3. Under 150 words for operational updates
4. Ends with one specific next action, not "let me know"
5. No "I hope this email finds you well"

## Lifecycle Templates

### Intake Confirmation
Subject: [Company] x FlashFusion — you're in
Body: Confirm receipt of signed SOW, intake form link, kickoff calendar invite, what to expect before kickoff.

### Weekly Status Update
Subject: Week [N] update — [Company] x FlashFusion
Body: 3 sections: Done / In progress / Blocked. Under 150 words. One ask if applicable.

### Milestone Delivery
Subject: [Milestone name] — [Company] x FlashFusion
Body: What's attached, what it means, one next step.

### Blocker Alert
Subject: [Company] — blocker on [item]
Body: What's blocked, what caused it, what we need, by when.

### QBR Prep
Subject: QBR prep — [Company] Q[N]
Body: Meeting logistics, agenda preview, 2 things to bring.

### Renewal / Next Steps
Subject: Q[N] complete — what's next for [Company]
Body: What we delivered, what we recommend next, one clear offer.

## Tone Rules by Stage
- Pre-kickoff: Warm but efficient. They're nervous about starting.
- During delivery: Direct. No fluff. They want progress, not reassurance.
- At milestone: Clear. State what's done and what it means.
- At QBR: Honest. If something missed, say it.
- At renewal: Confident. State the recommendation, not just the options.
"""

skills['competitive-intelligence'] = """---
name: competitive-intelligence
version: 1.0.0
metadata:
  description: Maintain FlashFusion battle cards, monitor competitor activity, prepare for competitive objections.
  author: FlashFusion
  category: sales
  use_when:
    - A competitor announces a product update or pricing change
    - Preparing for a sales call where a competitor may come up
    - Updating battle cards from news
    - Analyzing how to position against a specific competitor
    - Handling a competitive objection in real-time
  trigger_phrases:
    - competitive-intelligence
    - battle card
    - update the battle card
    - competitive objection
    - how do we position against
    - competitor update
    - competitive analysis
    - how do we beat
allowed_tools:
  - web_search
---

# Competitive Intelligence Skill

## Primary Competitors to Track
1. Microsoft Copilot
2. LangChain / DIY builds
3. Doing Nothing (status quo)
4. ChatGPT Enterprise / OpenAI

## Battle Card Structure (per competitor)
1. Their positioning (what they say)
2. Our counter (what we say back — specific, not generic)
3. We win when (specific conditions)
4. We lose when (be honest)
5. Common objections (their exact words + our response)

## Intelligence Collection
When a competitor update surfaces:
1. Identify what changed (pricing / features / positioning)
2. Assess impact: does this change how we position?
3. Identify new objections we'll face
4. Identify new wedges for us
5. Update the relevant battle card section

## Honesty Rule
Battle cards that ignore competitor strength don't survive real sales calls. If a competitor update makes them genuinely stronger in an area, say so. Flag it as a "watch list" item.

## Real-time Objection Handling
When an objection surfaces during a call:
- Acknowledge the competitor (don't dismiss them)
- Identify what the objection is really about (price? risk? familiarity?)
- Respond to the real concern, not the surface objection
- Offer a next step that re-centers on their problem, not our product

## Weekly Monitoring
Check weekly for:
- Product announcements from Microsoft, OpenAI, Anthropic
- Pricing changes from key competitors
- New AI governance regulations that affect our positioning
"""

skills['retainer-management'] = """---
name: retainer-management
version: 1.0.0
metadata:
  description: Manage monthly retainer ops — advisory memo production, scope management, usage tracking, renewal triggers.
  author: FlashFusion
  category: delivery
  use_when:
    - Writing a monthly vCAIO advisory memo
    - Tracking retainer scope and usage
    - Preparing for a quarterly business review
    - Managing a retainer renewal conversation
    - Monitoring for scope creep or underutilization
  trigger_phrases:
    - retainer-management
    - monthly memo
    - vcaio memo
    - retainer status
    - renewal conversation
    - scope management
    - qbr prep
    - retainer check-in
allowed_tools:
  - read_file
  - create_file
---

# Retainer Management Skill

## Monthly Cadence

### Week 1
- Collect this month's AI signals (3–5 relevant developments)
- Review client's environment for observations
- Draft vCAIO Advisory Memo

### Week 2
- Deliver vCAIO Memo
- Process async strategy reviews (up to 2 per month)

### Week 3
- Mid-month check-in (written update, no call required)
- Monitor for scope creep requests

### Week 4
- Month close: log what was delivered
- Flag if month is underutilized (under 80% of deliverables)
- Prepare next month's signal research

## vCAIO Memo Structure
1. Executive Summary (3 bullets)
2. Signal Digest (2–3 external AI developments with client-specific implications)
3. Environment Observations (2 things we noticed in their AI usage this month)
4. Recommended Actions (3 priorities, specific, owned, time-bound)
5. Watch List (1 risk to monitor next month)

**Format:** Memo, not report. Reads in under 5 minutes. Every sentence either informs a decision or surfaces a risk.

## Scope Management
Monthly deliverables:
- 1 vCAIO Advisory Memo
- 2 async strategy reviews (48hr turnaround)
- Ongoing skill pack maintenance
- Priority response (24hr SLA)

Out of scope: additional sprints, custom skill development, travel, legal/compliance advice.

If client requests out-of-scope work: surface it, quote separately, do not absorb into retainer.

## Renewal Triggers
Start renewal conversation 30 days before minimum term ends.

Green flags (renew): client is using async reviews, acting on memo recommendations, team adoption growing
Yellow flags (investigate): sporadic usage, memo not being read, no visible action on recommendations
Red flags (at risk): no engagement, champion has left, no success metric met

## QBR Checklist
- [ ] Quarter summary drafted (3 sentences: goal, delivered, outcome)
- [ ] Deliverables list complete and accurate
- [ ] Outcomes measured and documented (not estimated)
- [ ] Issues section honest — no spin
- [ ] Q+1 recommendations specific and justified
- [ ] Renewal recommendation included
"""

for slug, content in skills.items():
    path = f'{D}/skills/{slug}/SKILL.md'
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f"  {slug}/SKILL.md")

print(f"\n5 skill packs written.")

# ═══════════════════════════════════════════════════════════
# 21 AGENT SPECIFICATIONS
# ═══════════════════════════════════════════════════════════

agents = {}

agents['01-discovery-call-brief-agent'] = """# Agent: Discovery Call Brief Agent

## Purpose
Automatically generate a pre-call research brief for every new prospect before a discovery call.

## Trigger
New prospect added to pipeline (Airtable/Notion row created, or manual trigger)

## Inputs
- Company name
- Contact name and title
- Known context (source, any prior conversation)
- LinkedIn URL (optional)

## Steps
1. Receive prospect data from Notion/Airtable
2. Web search: company name + "AI" or "automation" + last 6 months
3. Web search: contact name + company
4. Claude: Analyze search results, score ICP fit, identify 5 discovery questions
5. Claude: Draft discovery call brief using `01-discovery-call-prep` prompt
6. Write brief to Notion (attach to prospect record)
7. Send Slack notification: "Brief ready for [Name] at [Company]"

## Output
- Formatted discovery brief in Notion
- Slack notification with brief link
- ICP score (1–10) logged in pipeline

## Human Gate
None — brief is advisory. Call prep is up to Kyle.

## Guardrails
- Never send the brief externally (internal only)
- If web search returns no results, flag and note "insufficient data" rather than fabricating

## Failure Mode
Web search fails → log "search unavailable," generate brief from available intake data only

## Platform
n8n + Claude API + Notion MCP + web search tool
"""

agents['02-lead-enrichment-agent'] = """# Agent: Lead Enrichment Agent

## Purpose
Automatically enrich new leads with company data, ICP scoring, and recommended outreach angle.

## Trigger
New row in Airtable/Notion leads table (via form, LinkedIn import, or manual add)

## Inputs
- Company name
- Contact name
- Source

## Steps
1. Web search: company name + size indicators ("employees," "team," "founded")
2. Web search: company name + AI tools OR compliance terms
3. Apollo.io query: company firmographic data (employees, industry, revenue if available)
4. Claude: Score ICP fit across 4 dimensions (size, compliance, AI stage, authority)
5. Claude: Generate recommended outreach angle (1 sentence from their world, not ours)
6. Update Notion/Airtable record with enrichment data
7. Slack notification if ICP score ≥ 15/20

## Output
- Enriched lead record (size, industry, ICP score, outreach angle)
- High-score leads flagged in Slack

## Human Gate
High-score leads (≥15/20) flagged for human review before outreach sent

## Guardrails
- Do not send any outreach — enrichment only
- Log data confidence level: High (confirmed) / Medium (inferred) / Low (estimated)

## Platform
n8n + Claude API + Apollo.io MCP + Notion MCP
"""

agents['03-audit-scorecard-processor'] = """# Agent: Audit Scorecard Processor

## Purpose
When a prospect submits the AI Setup Audit Scorecard at audit.flashfusion.co, automatically analyze it and generate an audit report draft.

## Trigger
Form submission from AI Setup Audit Scorecard (Base44 webhook or Airtable trigger)

## Inputs
- All scorecard responses (8 dimensions, gap checkboxes)
- Company and contact info

## Steps
1. Receive scorecard submission via webhook
2. Claude: Analyze responses using `02-ai-setup-audit-analyzer` prompt
3. Claude: Generate gap analysis with severity ratings
4. Claude: Build priority matrix
5. Claude: Draft audit report
6. Create Notion page: full audit report
7. Create Google Drive doc: formatted report (ready to send)
8. Notify Kyle via Slack: "New audit submission: [Company] — Score: [X]/80"
9. Log in Airtable: company, score, submission date, report link

## Output
- Notion page with full audit analysis
- Google Drive doc ready for delivery
- Slack notification with summary
- Airtable row updated

## Human Gate
Kyle reviews and edits before sending to prospect. Agent generates draft — not final deliverable.

## Platform
n8n + Claude API + Notion MCP + Google Drive MCP + Slack MCP
"""

agents['04-proposal-generator-agent'] = """# Agent: Proposal Generator Agent

## Purpose
Generate a formatted proposal draft after a discovery call is marked complete.

## Trigger
Discovery call status updated to "complete" in pipeline (Notion/Airtable)

## Inputs
- Discovery call notes (from Notion)
- Prospect record (company, contact, ICP score)
- Recommended service (from scorecard or manual selection)

## Steps
1. Trigger fires when discovery call status = "complete"
2. Pull discovery notes and prospect data from Notion
3. Claude: Draft proposal using `03-proposal-drafter` prompt
4. Create Google Drive doc: formatted proposal with FF branding
5. Create Notion page: proposal draft with edit notes
6. Slack notification: "Proposal ready for [Company] — review before sending"
7. Update pipeline stage: "Proposal in review"

## Output
- Google Drive proposal doc
- Notion draft with edit notes
- Pipeline stage updated
- Slack notification

## Human Gate
Kyle reviews and approves before proposal is sent. Agent drafts — not delivers.

## Guardrails
- Never send proposal directly to prospect
- Flag if discovery notes are insufficient for a complete proposal

## Platform
n8n + Claude API + Notion MCP + Google Drive MCP + Slack MCP
"""

agents['05-outreach-sequencer-agent'] = """# Agent: Outreach Sequencer

## Purpose
Run a structured outreach sequence for qualified prospects who haven't responded.

## Trigger
Manual trigger: Kyle selects "Start sequence" on a prospect record

**Prerequisite:** kylerosebrook.com must be live + FreeAssessment flow confirmed functional before any outreach sends

## Inputs
- Prospect name, company, email, role
- Recommended outreach angle (from lead enrichment)
- Sequence template to use

## Steps
1. Day 0: Draft email 1 (intro + audit CTA) — send to Kyle for approval before sending
2. If no reply in 5 days: Draft email 2 (follow-up, different angle)
3. If no reply in 5 more days: Draft LinkedIn connection request message
4. If no reply after LinkedIn: Log "cadence complete" — do not continue
5. Log all activity in Notion (sent date, response, outcome)

## Output
- Email drafts for Kyle approval at each step
- Activity log in Notion
- Stage updates in pipeline

## Human Gate
Every email requires Kyle approval before send. This agent drafts — does not send autonomously.

## Guardrails
- Maximum 3 touches per prospect
- Never send to prospects marked "disqualified"
- Always wait for human approval on emails

## Platform
n8n + Claude API + Gmail MCP + Notion MCP
"""

agents['06-content-publisher-agent'] = """# Agent: Content Publisher Agent

## Purpose
Draft, format, and stage content for publishing to LinkedIn, kylerosebrook.com, and FlashFusion newsletter.

## Trigger
Manual trigger: Kyle provides a topic or insight

## Inputs
- Topic or insight (raw)
- Target platform (LinkedIn / Blog / Newsletter)
- Angle preference (optional)

## Steps
1. Claude: Generate content using `generating-social-posts` or `14-linkedin-content-generator` prompt
2. Produce 3 hook variants
3. Format for platform (LinkedIn: plain text; Blog: markdown; Newsletter: HTML-ready)
4. Save to Notion draft queue with platform tag
5. Slack notification: "Content draft ready — [Platform]: [Hook preview]"

## Output
- 3 formatted content variants in Notion
- Tagged by platform and status (Draft / Ready / Published)
- Slack notification

## Human Gate
All content requires Kyle review before publishing. Agent drafts — does not publish.

## Guardrails
- Never publish directly — draft only
- Content integrity rule: never claim anything Kyle doesn't actually do today
- Lane separation: never conflate FlashFusion, kylerosebrook.com, ChaosClub content

## Platform
n8n + Claude API + Notion MCP
"""

agents['07-client-onboarding-agent'] = """# Agent: Client Onboarding Agent

## Purpose
Automate the post-SOW onboarding sequence — intake form, kickoff prep, access verification.

## Trigger
SOW marked "signed" in Notion pipeline

## Steps
1. Create client record in Notion (company, contact, service, start date)
2. Draft and send (via Kyle approval): welcome email with intake form link
3. Create Google Drive folder: [ClientName] x FlashFusion
4. Create Notion sprint tracker for the engagement
5. Add kickoff call to Google Calendar (draft — Kyle confirms time)
6. Slack notification: "Onboarding started for [Company] — intake form sent"
7. 3-day reminder: if intake form not submitted, send Slack alert to Kyle

## Output
- Client Notion record
- Google Drive folder created
- Sprint tracker initialized
- Welcome email drafted (pending Kyle approval)
- Calendar event drafted

## Human Gate
Welcome email requires Kyle approval. Calendar invite requires Kyle to confirm timing.

## Platform
n8n + Google Drive MCP + Google Calendar MCP + Notion MCP + Gmail MCP
"""

agents['08-newsletter-research-agent'] = """# Agent: Newsletter Research Agent

## Purpose
Weekly research run for The Prompt newsletter — surface relevant AI signals for Kyle's review.

## Trigger
Scheduled: Monday 8am CT

## Steps
1. Web search: "AI governance news this week"
2. Web search: "Claude Anthropic announcement this week"
3. Web search: "enterprise AI deployment news this week"
4. Web search: "AI compliance regulation update"
5. Claude: Synthesize top 5 signals with 1-sentence implications each
6. Write to Notion: "The Prompt — Week of [DATE] — Research"
7. Slack notification: "Newsletter research ready — [N] signals found"

## Output
- Notion research brief
- 5 curated signals with implications
- Slack notification

## Human Gate
Kyle selects which signals to use. Agent researches — does not write the newsletter.

## Platform
n8n + web search + Claude API + Notion MCP + Slack MCP
"""

agents['09-github-repo-audit-agent'] = """# Agent: GitHub Repo Audit Agent

## Purpose
Weekly audit of key GitHub repos — check for stale branches, open PRs, failed CI.

## Trigger
Scheduled: Friday 4pm CT

## Repos to Audit
- Krosebrook/Continuum (paused — Supabase hold)
- ChaosClubCo repos
- FlashFusionv1

## Steps
1. GitHub API: list open PRs older than 7 days
2. GitHub API: list stale branches (no commits in 14 days)
3. GitHub API: check last deployment status for active projects
4. Claude: Summarize findings, flag anything needing attention
5. Slack notification: "Weekly repo audit — [N] items need attention"

## Output
- Slack summary with actionable items
- Notion log entry

## Human Gate
Audit is informational. No automated changes to repos.

## Platform
n8n + GitHub API + Claude API + Slack MCP
"""

agents['10-calendar-intelligence-agent'] = """# Agent: Calendar Intelligence Agent

## Purpose
Prepare a daily brief of what's on the calendar and what prep is needed.

## Trigger
Scheduled: 7am CT weekdays

## Steps
1. Google Calendar: fetch today's events
2. For each event with an external contact: pull Notion context (prospect/client record)
3. Claude: Generate a 1-sentence prep note for each meeting
4. If discovery call detected: trigger Discovery Call Brief Agent
5. Slack DM to Kyle: daily brief with meetings + prep notes

## Output
- Slack DM: today's schedule with context notes
- Auto-trigger of discovery brief agent if applicable

## Human Gate
Fully automated. No human approval needed for prep brief.

## Platform
n8n + Google Calendar MCP + Notion MCP + Claude API + Slack MCP
"""

agents['11-crm-hygiene-agent'] = """# Agent: CRM Hygiene Agent

## Purpose
Keep the Notion pipeline clean — flag stale leads, missing data, and inactive stages.

## Trigger
Scheduled: Sunday 9pm CT

## Checks
1. Prospects in "Qualified" with no activity in 14 days → flag as stale
2. Prospects missing ICP score → flag for enrichment
3. Proposals sent >30 days ago with no response → flag for follow-up or disqualify
4. Closed deals missing case study start date → create reminder

## Steps
1. Notion: query pipeline for each condition above
2. Claude: Summarize findings
3. Slack notification: "Pipeline hygiene — [N] items need attention"
4. Optional: create Notion tasks for each flagged item

## Output
- Slack summary
- Notion tasks created for action items

## Platform
n8n + Notion MCP + Claude API + Slack MCP
"""

agents['12-sprint-status-agent'] = """# Agent: Sprint Status Agent

## Purpose
Automatically generate weekly sprint status updates for active client engagements.

## Trigger
Scheduled: Thursday 3pm CT (for Friday delivery)

## Steps
1. Notion: pull active sprint tracker for each client
2. Identify completed tasks, in-progress, blocked
3. Claude: Draft weekly status update using `19-stakeholder-update` prompt
4. Save draft to Notion (client folder)
5. Slack notification: "Status update drafts ready — [N] clients"

## Output
- Status update drafts in Notion
- Slack notification for Kyle to review and send

## Human Gate
Kyle reviews and sends. Agent drafts only.

## Platform
n8n + Notion MCP + Claude API + Slack MCP
"""

agents['13-invoice-generator-agent'] = """# Agent: Invoice Generator Agent

## Purpose
Generate invoice drafts when milestones are reached.

## Trigger
Sprint milestone marked "complete" in Notion

## Steps
1. Pull client record (company, contact, SOW, invoice schedule)
2. Identify which milestone triggered the invoice
3. Claude: Generate formatted invoice from `12-invoice-template`
4. Create Google Drive doc: invoice
5. Slack notification: "Invoice ready for [Company] — Milestone: [Name]"
6. Add to Revenue Tracker

## Output
- Google Drive invoice doc
- Revenue Tracker entry (status: draft)
- Slack notification

## Human Gate
Kyle reviews and sends invoice. Agent does not send directly.

## Platform
n8n + Notion MCP + Google Drive MCP + Slack MCP + Claude API
"""

agents['14-skills-gap-detector-agent'] = """# Agent: Skills Gap Detector Agent

## Purpose
After an audit scorecard is submitted, automatically identify which skill packs address the identified gaps and generate a prioritized recommendation.

## Trigger
Audit scorecard processor completes (downstream of Agent 03)

## Inputs
- Completed audit analysis
- Gap severity list

## Steps
1. Receive audit analysis from Agent 03
2. Map each identified gap to relevant skill packs
3. Score each skill pack: (gap severity × ICP fit × deployment effort)
4. Claude: Generate top 5 skill pack recommendations with justification
5. Append recommendations to the audit report in Notion
6. Add "Skill Pack Recommendations" section to proposal draft if exists

## Output
- Skills gap analysis appended to audit report
- Prioritized recommendation list (top 5 with justification)

## Human Gate
Recommendations are advisory — Kyle decides final skill selection with client.

## Platform
n8n + Claude API + Notion MCP
"""

agents['15-competitive-intel-monitor-agent'] = """# Agent: Competitive Intel Monitor Agent

## Purpose
Weekly monitoring of competitor activity — flag updates that require battle card changes.

## Trigger
Scheduled: Monday 7am CT

## Searches
- "Microsoft Copilot" + "new feature" OR "pricing" — last 7 days
- "ChatGPT Enterprise" + "announcement" — last 7 days
- "LangChain" + "release" OR "update" — last 7 days
- "AI governance" + "regulation" OR "compliance" — last 7 days

## Steps
1. Run all 4 searches
2. Claude: Assess each result — does this change how we position?
3. If yes: flag with reason, affected competitor, suggested battle card update
4. Slack notification: "Competitive intel — [N] items flagged"
5. Notion log entry

## Output
- Slack notification with flagged items
- Notion intelligence log

## Human Gate
Kyle decides whether to update battle cards. Agent flags — does not update.

## Platform
n8n + web search + Claude API + Slack MCP + Notion MCP
"""

agents['16-email-triage-agent'] = """# Agent: Email Triage Agent

## Purpose
Categorize and prioritize incoming email — surface urgent items that need same-day response.

## Trigger
Scheduled: Every 2 hours, 8am–6pm CT weekdays (or Gmail push trigger)

## Categories
- Client (active engagement) — HIGH
- Hot prospect (qualified lead) — HIGH
- New inbound lead — MEDIUM
- Vendor / tool / service — LOW
- Newsletter / digest — LOW
- Administrative — LOW

## Steps
1. Gmail: fetch unread emails
2. Claude: categorize each email by sender and content
3. Flag HIGH priority items
4. Slack DM: "Email triage — [N] high priority, [N] medium"
5. For HIGH items: include 1-sentence context and suggested response approach

## Output
- Slack DM with triage summary
- HIGH items surfaced with context

## Human Gate
Agent categorizes and surfaces. Kyle responds. No automated replies.

## Guardrails
- Never send a reply
- If a client email indicates distress or a project issue, flag as CRITICAL and notify immediately

## Platform
n8n + Gmail MCP + Claude API + Slack MCP
"""

agents['17-qbr-report-generator-agent'] = """# Agent: QBR Report Generator Agent

## Purpose
Automatically compile and draft the Quarterly Business Review at the end of each quarter.

## Trigger
Manual trigger: end of quarter (or scheduled quarterly)

## Inputs
- Client name
- Quarter
- Sprint tracker data from Notion

## Steps
1. Notion: pull all deliverables marked complete for this client this quarter
2. Notion: pull outcome data (hours saved, skill packs deployed, team adoption)
3. Notion: pull any issues logged and their resolutions
4. Claude: Draft QBR using `20-qbr-summary-generator` prompt
5. Google Drive: create formatted QBR document
6. Notion: save draft with edit flags
7. Slack: "Q[N] QBR draft ready for [Company]"

## Output
- QBR Google Drive doc
- Notion draft
- Slack notification

## Human Gate
Kyle reviews, edits, and presents. Agent drafts — does not deliver.

## Platform
n8n + Notion MCP + Google Drive MCP + Claude API + Slack MCP
"""

agents['18-document-archive-agent'] = """# Agent: Document Archive Agent

## Purpose
Automatically organize and archive completed engagement documents to the correct Google Drive folders.

## Trigger
Sprint or engagement marked "complete" in Notion

## Steps
1. Identify all documents associated with the engagement
2. Google Drive: move to archived engagement folder ([Year] > [Client] > [Engagement Type])
3. Notion: update engagement record with "archived" status and Drive folder link
4. Slack: "Engagement archived — [Company]. Drive folder: [link]"

## Output
- Documents in correct archive folder
- Notion record updated
- Slack confirmation

## Human Gate
Agent archives. Kyle can restore or reclassify if needed.

## Platform
n8n + Google Drive MCP + Notion MCP + Slack MCP
"""

agents['19-social-monitoring-agent'] = """# Agent: Social Monitoring Agent

## Purpose
Monitor for mentions of FlashFusion, kylerosebrook, or relevant AI topics on LinkedIn and X.

## Trigger
Scheduled: Daily, 8am CT

## Searches
- "FlashFusion" on LinkedIn and X
- "Kyle Rosebrook" mentions
- "AI setup audit" mentions
- "Claude AI enablement" — relevant conversations to engage

## Steps
1. Web search each query
2. Claude: Assess relevance and sentiment
3. Flag items that warrant a response or engagement
4. Slack: "Social monitoring — [N] items flagged"
5. Log in Notion

## Output
- Slack notification with flagged items
- Notion log

## Human Gate
Kyle decides whether and how to engage. Agent flags only.

## Platform
n8n + web search + Claude API + Slack MCP + Notion MCP
"""

agents['20-chaos-club-daily-dispatch-agent'] = """# Agent: Chaos Club Daily Dispatch Agent

## Purpose
Generate and stage the daily peer support dispatch for Chaos Club Co.

## Trigger
Scheduled: 7am CT daily

## Inputs
- Day of week
- Theme rotation (7 themes, cycling weekly)
- Any community signals from Chaos Club platform (if available)

## Steps
1. Determine today's theme from rotation
2. Community signal check (optional — pull recent posts if API available)
3. Claude: Generate dispatch using Chaos Club voice prompt (no recovery language, no toxic positivity)
4. Stage in Chaos Club CMS / Notion for review
5. Slack: "Chaos Club dispatch ready for [DATE] — Theme: [THEME]"

## Output
- Dispatch draft in Notion/CMS
- Slack notification

## Human Gate
Kyle or Chaos Club admin reviews before publishing. Agent drafts — does not publish.

## Guardrails
- No recovery language, no "you've got this" clichés
- No clinical advice or crisis intervention framing
- Lane separation: Chaos Club content never bleeds into FlashFusion or kylerosebrook.com

## Platform
n8n + Claude API + Notion MCP + Slack MCP
"""

agents['21-skill-pack-installer-agent'] = """# Agent: Skill Pack Installer Agent

## Purpose
Guide a client through skill pack installation with validation and error handling.

## Trigger
Client onboarding agent completes (or manual trigger for existing clients)

## Steps
1. Pull selected skill packs for this client from Notion
2. Generate installation guide: step-by-step for each skill pack
3. Validate each skill pack against compliance checklist:
   - "Use when..." triggers defined
   - Version nested under metadata
   - Hooks not on claude.ai skills
   - Allowed-tools set to least-privilege
4. Flag any compliance gaps before installation begins
5. Create Google Drive doc: installation guide with checklist
6. Slack: "Skill pack installation guide ready for [Company]"

## Output
- Installation guide (Google Drive)
- Compliance checklist with any gaps flagged
- Slack notification

## Human Gate
Kyle reviews installation guide before sending to client. Client runs installation with guide.

## Guardrails
- Never deploy to a client environment without Kyle's authorization
- Flag ALL compliance gaps — do not omit for convenience

## Platform
n8n + Claude API + Google Drive MCP + Notion MCP + Slack MCP
"""

for slug, content in agents.items():
    path = f'{D}/agents/{slug}.md'
    with open(path, 'w') as f:
        f.write(content)
    print(f"  {slug}.md")

print(f"\n21 agent specs written.")

# Final inventory count
import os
html_count = len([f for f in os.listdir(f'{D}') if f.endswith('.html')])
prompt_count = len([f for f in os.listdir(f'{D}/prompts') if f.endswith('.md')])
doc_count = len([f for f in os.listdir(f'{D}/docs') if f.endswith('.md')])
skill_count = len(os.listdir(f'{D}/skills'))
agent_count = len([f for f in os.listdir(f'{D}/agents') if f.endswith('.md')])

print(f"\n{'='*50}")
print(f"FINAL BUILD COUNTS")
print(f"{'='*50}")
print(f"Artifacts (HTML):  {html_count} files")
print(f"Prompts:           {prompt_count} files + 1 library")
print(f"Documents:         {doc_count} files")
print(f"Skills:            {skill_count} skill packs (SKILL.md)")
print(f"Agents:            {agent_count} spec files")
print(f"{'='*50}")
print(f"New items built:   {html_count + prompt_count + doc_count + skill_count + agent_count}")
