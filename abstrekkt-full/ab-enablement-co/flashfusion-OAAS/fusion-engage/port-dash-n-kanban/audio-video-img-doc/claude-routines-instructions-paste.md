# Claude Routines — Instructions Extract (Paste-Ready)
**Project:** Claude Ecosystem Mastery / INT Inc. Enablement Platform  
**Generated:** 2026-05-08  
**Usage:** Copy each block below directly into the "Instructions" field of the corresponding Claude Routine.

---

## HOW TO USE THIS FILE

1. In the Claude Routines UI, create a new routine (CRON or API)
2. Set the trigger as specified in the header for each block
3. Copy the text between the `---BEGIN INSTRUCTIONS---` and `---END INSTRUCTIONS---` markers
4. Paste into the routine's Instructions field
5. Save and test

Replace env var names (e.g., `NOTION_ENABLEMENT_DB_ID`) with actual values, or confirm your routines environment supports env var injection.

---

## CRON ROUTINES

---

**CRON #1 — Sentry Error Triage Digest**  
Trigger: `0 7 * * 1-5` | Connector: Sentry

---BEGIN INSTRUCTIONS---
Use the Sentry MCP connector. Execute the following steps in order:

1. Call list_issues with filters: firstSeen:[>=now-24h], is:unresolved. Retrieve up to 50 issues.

2. Group results into three severity buckets:
   - P0: level=fatal OR event_count > 100 in the last 24h
   - P1: level=error, event_count 10–100
   - P2: level=warning OR event_count < 10

3. For each P0 issue extract: title, culprit (URL or function name), event_count, first_seen, affected_users (if available). For each P1 issue extract: title, event_count, first_seen.

4. Output a structured digest:

=== SENTRY TRIAGE — [DATE] ===
P0 (IMMEDIATE ACTION): [count]
- [title] | [culprit] | [event_count] events | first seen [time]
  → Recommended action: investigate / hotfix needed / monitor

P1 (ACTION TODAY): [count]
- [title] | [event_count] events

P2 (BACKLOG): [count items, no detail]

HEALTH: [CRITICAL | DEGRADED | CLEAN]

5. If zero issues across all buckets, output: "SENTRY CLEAN — No new issues in the last 24h. All systems nominal."

6. Do not hallucinate issue data. If the Sentry connector returns an error or empty response, output: "SENTRY QUERY FAILED — [error text]. Manual check required at sentry.io."

7. Do not call any other tool. Read-only and diagnostic.
---END INSTRUCTIONS---

---

**CRON #2 — Vercel Deployment Health Sweep**  
Trigger: `0 6 * * *` | Connector: Vercel

---BEGIN INSTRUCTIONS---
Use the Vercel MCP connector. Execute in order:

1. Call list_projects. Retrieve all projects.

2. For each project, call get_deployments with limit=1 to get the most recent deployment. Extract: project name, deployment state (READY, ERROR, BUILDING, CANCELED), created_at timestamp, url.

3. Flag any project where state != "READY", OR created_at is older than 72 hours, OR project name matches "humanx-assess" and state != "READY" (priority flag regardless of recency).

4. Output a health table:

=== VERCEL HEALTH — [DATE TIME] ===
PROJECT              | STATUS | LAST DEPLOYED        | FLAG
humanx-assess        | READY  | [timestamp]          | —
[project]            | ERROR  | [timestamp]          | ⚠ ERROR

OVERALL: [ALL HEALTHY | X PROJECT(S) NEED ATTENTION]

5. If any project is flagged ERROR, append: "ACTION REQUIRED: [project name] last deployment failed. Check deployment logs at vercel.com/[project]/deployments."

6. If humanx-assess is not found in the project list, flag: "WARNING: humanx-assess not found in Vercel project list. Verify project exists and connector has access."

7. Read-only. Do not trigger redeployments.
---END INSTRUCTIONS---

---

**CRON #3 — Deprecated Model String Watchdog**  
Trigger: `0 8 * * 2` | Connector: Web Search

---BEGIN INSTRUCTIONS---
This routine audits for Anthropic model string deprecation risk.

1. Search the web for the current Anthropic model deprecation schedule at: https://docs.claude.com/en/docs/about-claude/model-deprecations. Extract any models with retirement dates within the next 90 days and their exact API string identifiers.

2. Cross-reference against known affected files in this project:
   - 02-prompt-package-builder.jsx (model: "claude-sonnet-4-20250514")
   - 06-objection-handler.jsx (same model string)
   - 07-program-health-report.jsx (same model string)
   Assume they still contain these strings unless you have evidence otherwise.

3. Check if the Anthropic ecosystem reference at /mnt/project/anthropic-ecosystem-reference-v2.md has a "Deprecating" section and read it. Surface any models listed there that match strings from step 1.

4. Output a deprecation status report:

=== MODEL DEPRECATION WATCHDOG — [DATE] ===
MODELS AT RISK:
- claude-sonnet-4-20250514 → RETIRES June 15, 2026 ([X] days)
  Files affected: 02-prompt-package-builder.jsx, 06-objection-handler.jsx, 07-program-health-report.jsx
  Replacement: claude-sonnet-4-6
  Action: Replace all 3 model string references before June 15.

MODELS CLEAR: [list any checked-and-clear strings]

5. If deprecation data is not retrievable, output: "WATCHDOG: Could not retrieve deprecation schedule. Manual check required at docs.claude.com/en/docs/about-claude/model-deprecations."

6. Do not modify any files. Read-only and advisory.
---END INSTRUCTIONS---

---

**CRON #4 — PostHog Weekly Analytics Digest**  
Trigger: `0 9 * * 1` | Connector: PostHog

---BEGIN INSTRUCTIONS---
Use the PostHog MCP connector. Pull the last 7 days of data.

1. Call get_events or equivalent to retrieve: total sessions (unique session_ids), unique users (distinct person_id or distinct_id), top 5 events by count, and any event named "assessment_submitted", "assessment_started", "report_generated", or "email_sent" (HumanX funnel events).

2. If funnel events exist, calculate: Start → Submit conversion rate, and Submit → Report generated rate.

3. Call get_feature_flags or equivalent to list any active flags and their rollout percentages (if supported).

4. Output a structured weekly digest:

=== POSTHOG DIGEST — Week of [DATE] ===
SESSIONS:        [N]
UNIQUE USERS:    [N]
TOP EVENTS:
1. [event] — [count]
2. [event] — [count]
3. [event] — [count]

HUMANX FUNNEL (if data present):
Started: [N] | Submitted: [N] | Report: [N]
Start→Submit: [X%] | Submit→Report: [X%]

ACTIVE FEATURE FLAGS: [list or "none found"]

5. If the PostHog connector returns no data or errors, output: "POSTHOG QUERY FAILED — [error]. Manual review at app.posthog.com."

6. Read-only. Do not write or modify any PostHog configuration.
---END INSTRUCTIONS---

---

**CRON #5 — Weekly Program Health Digest**  
Trigger: `0 8 * * 1` | Connector: Notion  
Env vars: NOTION_ENABLEMENT_DB_ID

---BEGIN INSTRUCTIONS---
Use the Notion MCP connector to read enablement program data and generate the weekly stakeholder digest.

1. Query the Notion database at NOTION_ENABLEMENT_DB_ID for all records matching IntakeRecord, OutcomeRecord, and CheckinRecord types.

2. From intake records compute: total employees onboarded (all-time), new intakes this week (createdAt >= 7 days ago), plan distribution (free/pro/max/team/enterprise).

3. From outcome records compute: sessions this week by status (Completed/In Progress/No Show/Needs Follow-up), QC gate pass rate (pass counts / total non-null across q1–q7), employees with open gaps (openGaps field non-empty), sessions scheduled next week (nextSessionDate within 7 days).

4. From check-in records compute: check-ins submitted this week, average confidence score (1–5), top blockers (most frequently cited this week), employees with frequency = "not_yet" (never used Claude).

5. Generate a stakeholder narrative (3–4 paragraphs): program momentum summary, adoption signal (confidence trend, frequency distribution), risk flag (any "Needs Follow-up" sessions or "not_yet" users), recommended focus for this week.

6. Output the narrative followed by the computed metrics table. Format for copy-paste into email or Slack.
---END INSTRUCTIONS---

---

**CRON #6 — Accountability Check-In Nudge**  
Trigger: `0 9 * * 3` | Connectors: Notion, Gmail  
Env vars: NOTION_ENABLEMENT_DB_ID, GMAIL_SENDER_ADDRESS

---BEGIN INSTRUCTIONS---
Use the Notion MCP connector to identify overdue check-ins, then use the Gmail MCP connector to send nudge emails.

1. Query NOTION_ENABLEMENT_DB_ID for all IntakeRecords where firstSession=true (onboarded employees only). Extract: name, email.

2. Query NOTION_ENABLEMENT_DB_ID for CheckinRecords. For each onboarded employee, find their most recent check-in and extract weekOf.

3. Identify employees where: no check-in record exists, OR most recent weekOf is more than 9 days ago.

4. For each identified employee, send a Gmail message:
   To: [employee email]
   Subject: Quick Claude check-in — 2 minutes
   Body: Hi [name], This is your weekly Claude check-in reminder. It takes about 2 minutes and helps your program facilitator understand where you're getting value and where you're stuck. Open your accountability tracker to log this week's update. Let us know if you have any questions.

5. Output a summary list of who was nudged.

6. Do not send to employees whose most recent check-in weekOf is within the last 7 days.
---END INSTRUCTIONS---

---

**CRON #7 — Stale Session Follow-Up Generator**  
Trigger: `0 10 * * 1-5` | Connectors: Notion, Gmail  
Env vars: NOTION_ENABLEMENT_DB_ID, FACILITATOR_EMAIL

---BEGIN INSTRUCTIONS---
Use the Notion MCP connector to identify sessions requiring follow-up. Use the Gmail MCP connector to create drafts (not send).

1. Query NOTION_ENABLEMENT_DB_ID for OutcomeRecords where: status = "Needs Follow-up", OR nextSessionDate is within the next 3 days.

2. For each record extract: employeeName, role, plan, sessionNumber, openGaps, nextSessionDate, nextSessionFocus, notes.

3. For each "Needs Follow-up" record, create a Gmail DRAFT (do not send):
   To: FACILITATOR_EMAIL
   Subject: Follow-up needed: [employeeName] — Session [sessionNumber]
   Body: Action required before next session with [employeeName] ([role]). Open gaps from last session: [openGaps]. Next session: [nextSessionDate] — Focus: [nextSessionFocus]. Notes: [notes]. Recommended: review gaps, adjust prompt package if needed.

4. For records with nextSessionDate within 3 days, create a separate prep reminder DRAFT:
   Subject: Session prep: [employeeName] in [X] days
   Body: Next session is [nextSessionDate]. Focus: [nextSessionFocus]. Suggested prep: review their prompt package and any open gaps.

5. Output a summary of drafts created: employee name, reason flagged, draft subject.

6. If no stale records found, output: "No follow-up actions needed today."
---END INSTRUCTIONS---

---

**CRON #8 — HumanX Assessment Lead Digest**  
Trigger: `30 7 * * *` | Connectors: Supabase, HubSpot  
Env vars: SUPABASE_PROJECT_REF, SUPABASE_SERVICE_ROLE_KEY, HUBSPOT_PORTAL_ID  
⚠️ Server-side execution context required.

---BEGIN INSTRUCTIONS---
Use the Supabase MCP connector to pull new HumanX assessment submissions, then route high-value leads via HubSpot MCP.

1. Connect to Supabase project at SUPABASE_PROJECT_REF. Query the assessments table:
   SELECT id, name, email, company, role, score, tier, created_at, report_status
   WHERE created_at >= NOW() - INTERVAL '24 hours'
   ORDER BY score DESC

2. Categorize by tier: Tier 3 (score 70–100), Tier 2 (score 40–69), Tier 1 (score 0–39).

3. For each Tier 3 lead, use HubSpot MCP to: search_contacts by email. If not found: create_contact with name (split into firstName/lastName), email, company, jobtitle: role, and properties humanx_score, humanx_tier: "3", humanx_report: report_url, lead_source: "HumanX 2026 Assessment". If found: add a note with score and report URL.

4. Output daily digest:

=== HUMANX LEAD DIGEST — [DATE] ===
NEW SUBMISSIONS (last 24h): [count]

TIER 3 (Qualified):
- [name] | [company] | [role] | Score: [score] | [email]
  HubSpot: [created/updated/failed]

TIER 2 (Nurture): [count] — [names and companies]
TIER 1 (Early): [count]

REPORT STATUS: [X] complete | [Y] pending
---END INSTRUCTIONS---

---

**CRON #9 — Anthropic Academy Certification Progress**  
Trigger: `0 8 * * 5` | Connector: Notion  
Env vars: NOTION_ACADEMY_DB_ID

---BEGIN INSTRUCTIONS---
Use the Notion MCP connector to read certification progress data and generate a weekly progress report.

1. Query NOTION_ACADEMY_DB_ID for course completion records. Fields: course_id, course_name, status (not_started / in_progress / completed), completed_date, certificate_url, notes.

2. The 15-course target spans: Foundations track (6 courses: Claude 101, AI Fluency, AI Capabilities & Limitations, Claude Code 101, Intro to Cowork, AI Fluency for Educators), Developer track (5 courses: Building with Claude API, Intro to MCP, MCP Advanced Topics, Claude Code in Action, Agent Skills), Enterprise track (4 courses: Cloud Deployments, Enterprise Security, Admin & Governance, Sales Enablement).

3. Compute: completed count (X/15), in-progress list, not-started count, projected completion date (extrapolate from completed_dates if at least 2 exist).

4. Output weekly progress card:

=== ACADEMY PROGRESS — Week ending [DATE] ===
COMPLETED:  [X/15] [filled blocks out of 15] [X%]
IN PROGRESS: [list course names]
THIS WEEK:  [courses completed since last Friday, or "none"]

VELOCITY: [N] courses/week → projected done by [date]
NEXT UP: [first not_started course by track order]

5. If NOTION_ACADEMY_DB_ID is not set or returns empty: "Academy progress DB not found. Create a Notion database tracking course completion and set NOTION_ACADEMY_DB_ID."
---END INSTRUCTIONS---

---

**CRON #10 — n8n Workflow Health Monitor**  
Trigger: `0 17 * * 5` | Connector: n8n

---BEGIN INSTRUCTIONS---
Use the n8n MCP connector (https://krosebrook.app.n8n.cloud) to audit workflow health before the weekend.

1. Call list_workflows to retrieve all workflows. Extract: id, name, active (boolean), updatedAt.

2. Call get_executions with status=error and limit=50 for the last 7 days. Extract: workflow_id, workflow_name, startedAt, error_message.

3. For each active workflow, check if any error executions exist in step 2. Categorize:
   - Active + no errors: HEALTHY
   - Active + errors: DEGRADED
   - Inactive (active=false): PAUSED (note if updatedAt within 7 days)

4. Output weekly health report:

=== N8N HEALTH — Week ending [DATE] ===
TOTAL WORKFLOWS: [N] active | [N] paused

DEGRADED (errors this week):
- [workflow name] | [error count] failures | Last error: [message]

HEALTHY: [N] workflows

PAUSED (recently deactivated):
- [workflow name] | Deactivated: [date]

RECOMMENDATION: Review degraded workflows before Monday.

5. If zero degraded: "N8N CLEAN — All active workflows ran without errors this week."

6. Read-only. Do not modify any workflows.
---END INSTRUCTIONS---

---

## API ROUTINES

---

**API #1 — Check-In Submitted Alert**  
Trigger: `POST /trigger/checkin-submitted`  
Connectors: Notion, Slack  
Env vars: NOTION_CHECKINS_DB_ID, SLACK_FACILITATOR_CHANNEL

---BEGIN INSTRUCTIONS---
A check-in has been submitted. Perform two actions:

ACTION 1 — Notion record sync:
Use the Notion MCP connector. Create a new page in NOTION_CHECKINS_DB_ID with the following properties:
- Name (title): employee_name from payload
- Week Of (date): week_of from payload
- Confidence (number): confidence from payload
- Frequency (select): frequency from payload
- Biggest Win (rich_text): biggest_win from payload
- Stuck On (rich_text): stuck_on from payload
- Blockers (multi_select): each item in blockers array from payload
- Next Goal (rich_text): next_week_goal from payload
- Submitted At (date): current UTC timestamp

ACTION 2 — Facilitator alert (run only after ACTION 1 succeeds):
Use the Slack MCP connector. Send a message to SLACK_FACILITATOR_CHANNEL:

📋 *Check-in received — [employee_name]* (Week of [week_of])
Confidence: [confidence]/5 [repeat "█" confidence times, "░" for remainder up to 5]
Frequency: [frequency]
Win: [biggest_win]
Stuck on: [stuck_on | "nothing flagged"]
Blockers: [join blockers with ", " | "none"]
Goal next week: [next_week_goal]

If confidence <= 2, prepend: "⚠️ LOW CONFIDENCE — may need outreach."
If frequency = "not_yet", prepend: "🔴 HAS NOT USED CLAUDE YET."

Output: Confirm both actions completed or report which failed.
---END INSTRUCTIONS---

---

**API #2 — Post-Session Calendar Scheduler**  
Trigger: `POST /trigger/schedule-next-session`  
Connector: Google Calendar  
Env vars: GOOGLE_CALENDAR_ID (optional)

---BEGIN INSTRUCTIONS---
A session outcome has been logged with a next session date. Create a Google Calendar event for the follow-up session.

Use the Google Calendar MCP connector.

1. Create a calendar event:
   - Title: "Claude Enablement — Session [session_number + 1]: [employee_name]"
   - Start: next_session_date from payload (ISO datetime)
   - End: next_session_date + duration_minutes (default 60 minutes if not provided)
   - Attendees: employee_email and facilitator_email from payload
   - Description: Session [session_number + 1] with [employee_name]. Focus: [focus]. Prep: Review previous session notes in Notion. Check check-in records for confidence trend. Confirm prompt package is current for their role.
   - Calendar: GOOGLE_CALENDAR_ID (use "primary" if env var not set)
   - Send invite notifications: true

2. Output: "Event created: [title] on [date] at [time]. Invite sent to: [employee_email], [facilitator_email]. Link: [returned URL]"

3. Duplicate guard: before creating, search for existing events with the same title on the same date. If found, output "Event already exists: [title] on [date]. Skipping creation." and do not create a duplicate.

4. If event creation fails, output the error and do not retry.
---END INSTRUCTIONS---

---

**API #3 — On-Demand Model String Audit**  
Trigger: `POST /trigger/model-audit`  
Connector: Web Search, Slack (optional)  
Env vars: SLACK_DEV_CHANNEL (optional)

---BEGIN INSTRUCTIONS---
Audit the project for deprecated Anthropic model strings.

1. Search the web for: https://docs.claude.com/en/docs/about-claude/model-deprecations. Extract all model strings with retirement dates within 90 days and their recommended replacements.

2. Scan known affected files for hardcoded model strings matching pattern /claude-[a-z]+-[0-9]+-[0-9]{8}/g:
   - 02-prompt-package-builder.jsx (known: "claude-sonnet-4-20250514")
   - 06-objection-handler.jsx (known: "claude-sonnet-4-20250514")
   - 07-program-health-report.jsx (known: "claude-sonnet-4-20250514")

3. For each match: determine if it's on the deprecation list, identify the replacement, calculate days until retirement.

4. Build the audit report:

=== MODEL AUDIT REPORT — [timestamp] ===
DEPRECATED STRINGS FOUND: [count]

[file_path]:
Line ~[approx]: "[deprecated_string]"
Replace with: "[replacement_string]"
Retires: [date] ([N] days)

CLEAN STRINGS: [list]

VERDICT: [ACTION REQUIRED | CLEAN]

5. If notify_slack=true in payload: use Slack MCP to send the report to slack_channel from payload, or SLACK_DEV_CHANNEL if not provided.

6. Do not modify any files. Advisory only.
---END INSTRUCTIONS---

---

**API #4 — Assessment Lead Router**  
Trigger: `POST /trigger/assessment-lead-route`  
Connectors: HubSpot, Gmail  
Env vars: HUBSPOT_NURTURE_LIST_ID, OUTREACH_SENDER_NAME

---BEGIN INSTRUCTIONS---
A HumanX assessment has been submitted. Route the lead based on tier.

TIER 3 (score 70–100) — Hot lead:
1. Use HubSpot MCP: search_contacts by email from payload.
   - Not found: create_contact with firstName (first word of name), lastName (remainder), email, company, jobtitle: role, properties { humanx_score: score, humanx_tier: "3", humanx_report: report_url, lead_source: "HumanX 2026 Assessment" }
   - Found: add note to existing contact with score and report_url.
2. Use Gmail MCP: send email to [email]:
   Subject: Your AI Architecture Assessment results — [company]
   Body: Thank them for completing the assessment, reference their score and tier, link to full report at report_url from payload, offer a 30-minute AI strategy call. Sign as OUTREACH_SENDER_NAME.

TIER 2 (score 40–69) — Nurture:
1. HubSpot MCP: create_contact (same fields, humanx_tier: "2").
2. Add to HubSpot list HUBSPOT_NURTURE_LIST_ID.
3. No email. Nurture sequence handles it.

TIER 1 (score 0–39) — Informational:
1. HubSpot MCP: create_contact (humanx_tier: "1"). No further action.

ALL TIERS — output routing confirmation:
Lead: [name] | [company] | Score: [score] | Tier: [tier]
HubSpot: [created/updated/failed]
Email: [sent/skipped/failed]
---END INSTRUCTIONS---

---

**API #5 — Post-Intake Prompt Package Trigger**  
Trigger: `POST /trigger/post-intake-package`  
Connector: Notion  
Env vars: NOTION_PROMPT_PACKAGES_DB_ID

---BEGIN INSTRUCTIONS---
An intake form has been submitted. Generate a tailored prompt package and save it to Notion.

1. Generate 6 role-specific prompt templates from the payload. For each prompt include:
   - name: short descriptive title
   - category: one of (Communication, Analysis, Creation, Research, Process, Learning)
   - prompt: the full usable prompt text written for [name]'s actual role and goals — not a template shell
   - description: one sentence on when to use it
   - tips: 2–3 specific usage tips

   Tailor to literacy level:
   - "none" or "casual": simple language, no jargon, step-by-step
   - "regular" or "power": concise, assumes basic familiarity
   - "advanced": technical depth, references API or advanced features where relevant

   Tailor to plan:
   - "free": exclude prompts requiring Projects, Memory, or connectors
   - "pro" and above: include Projects, Memory, and connector-aware prompts

2. Use the Notion MCP connector. Create a page in NOTION_PROMPT_PACKAGES_DB_ID:
   - Title: "[name] — Prompt Package ([current date])"
   - Employee Name (text): name
   - Role (text): role
   - Plan (select): plan
   - Literacy (select): literacy
   - Goals (multi_select): goals array from payload
   - Each of the 6 prompts as a toggle block: prompt name as heading, full content inside

3. Output: "Prompt package for [name] created in Notion. [Page URL]" followed by the 6 prompt names generated.
---END INSTRUCTIONS---

---

**API #6 — On-Demand Cohort Report**  
Trigger: `POST /trigger/cohort-report`  
Connectors: Notion, Gamma (optional)  
Env vars: NOTION_ENABLEMENT_DB_ID, NOTION_REPORTS_DB_ID

---BEGIN INSTRUCTIONS---
Generate a cohort analytics report from Notion enablement records.

1. Use Notion MCP to query NOTION_ENABLEMENT_DB_ID. Filter based on cohort_filter from payload:
   - "all": no filter
   - "department": filter IntakeRecords by department = filter_value, then join to matching check-in records
   - "plan": filter IntakeRecords by plan = filter_value
   - "literacy": filter by literacy = filter_value

2. Compute based on report_type from payload:

   confidence_trend: average confidence per week (weekOf → avg confidence), confidence distribution (count per 1–5), % change week over week for last 4 weeks.

   adoption_curve: frequency distribution (daily/few_week/once_week/once_few/not_yet as % of cohort), % who upgraded from not_yet to any active frequency, top use cases across all check-ins.

   full: compute both above plus top blockers and most common wins.

3. Based on output_format from payload:
   - "text": output markdown report to conversation
   - "notion": use Notion MCP to create a page in NOTION_REPORTS_DB_ID with computed data as structured blocks
   - "gamma": use Gamma MCP to generate a 4–6 slide presentation using INT colors (#0E2841 navy, #156082 blue, #E97132 orange)

4. Always output a plain-text summary regardless of output_format.
---END INSTRUCTIONS---

---

**API #7 — Notion Enablement Record Sync**  
Trigger: `POST /trigger/notion-sync`  
Connector: Notion  
Env vars: NOTION_INTAKE_DB_ID, NOTION_OUTCOMES_DB_ID, NOTION_CHECKINS_DB_ID

---BEGIN INSTRUCTIONS---
A record from the enablement suite requires persistence to Notion. Write to the appropriate database.

Route by record_type from payload:

intake → NOTION_INTAKE_DB_ID
Properties: name (title), role (text), department (select), manager (text), email (email), plan (select), firstSession (checkbox), literacy (select), tools (multi_select), goals (multi_select), painPoints (rich_text — join array with newlines), notes (rich_text), sessionDate (date), createdAt (date)

outcome → NOTION_OUTCOMES_DB_ID
Properties: employeeName (title), role (text), plan (select), sessionDate (date), sessionNumber (number), status (select), openGaps (rich_text), nextSessionDate (date), nextSessionFocus (rich_text), notes (rich_text), createdAt (date). Write q1–q7 QC results as a table block in the page body.

checkin → NOTION_CHECKINS_DB_ID
Properties: name (title), weekOf (date), frequency (select), confidence (number), biggestWin (rich_text), stuckOn (rich_text), nextWeekGoal (rich_text), createdAt (date). Convert useCases and blockers arrays to multi_select properties.

For all types: before creating, search for an existing page with matching name + date to prevent duplicates. If found: update the existing page. If not found: create new.

Output: "Synced [record_type] for [name] to Notion. [created/updated] — [page URL]"
---END INSTRUCTIONS---

---

**API #8 — n8n Inbound Webhook Relay**  
Trigger: `POST /trigger/n8n-relay`  
Connector: n8n

---BEGIN INSTRUCTIONS---
Relay an event from Claude to an n8n workflow via the n8n MCP connector (https://krosebrook.app.n8n.cloud).

1. Call execute_workflow (or equivalent trigger tool) with:
   - workflowId: workflow_id from payload
   - data: the payload.payload object from the request body

2. Log the invocation:
   Event type: [event_type from payload]
   Workflow ID: [workflow_id]
   Triggered at: [current UTC timestamp]
   Payload keys: [list the keys from payload.payload — do NOT log values if any key contains "email", "key", "token", or "secret"]

3. If expect_response = true in payload:
   - Wait up to 30 seconds for execution result
   - Return the execution output
   - If timeout: "RELAY TIMEOUT — workflow triggered but result not returned within 30s. Check n8n execution log."

4. If expect_response = false: immediately return "RELAY SENT — [event_type] → workflow [workflow_id] at [timestamp]"

5. If workflow not found (404) or inactive: "RELAY FAILED — Workflow [workflow_id] not found or inactive. Check n8n at https://krosebrook.app.n8n.cloud."

6. Do not log raw error bodies. Log only error type and HTTP status code.
---END INSTRUCTIONS---

---

**API #9 — Objection Escalation Router**  
Trigger: `POST /trigger/objection-escalate`  
Connectors: Slack, Notion  
Env vars: SLACK_TECH_CHANNEL, SLACK_FACILITATOR_CHANNEL, NOTION_OBJECTIONS_DB_ID, POLICY_OWNER

---BEGIN INSTRUCTIONS---
An objection has been flagged for escalation from an enablement session.

1. Determine Slack routing from escalation_type in payload:
   - "technical": SLACK_TECH_CHANNEL
   - "policy": SLACK_FACILITATOR_CHANNEL
   - "budget": SLACK_FACILITATOR_CHANNEL (include @here)
   - "cultural": SLACK_FACILITATOR_CHANNEL (no @mention — sensitive, facilitator review required)

2. Use Slack MCP to send message to determined channel:

🚩 *Objection Escalation — [ESCALATION_TYPE]*
Employee: [employee_name] ([role])
Session: [session_date]

Objection: [objection_text]

Facilitator note: [facilitator_note from payload | "none"]

Suggested next step:
- technical: "Schedule a technical deep-dive. Reference docs.claude.com for specific feature questions."
- policy: "Review org AI policy alignment. Loop in [POLICY_OWNER]."
- budget: "Prepare ROI case. Check plan pricing at claude.ai/pricing."
- cultural: "One-on-one follow-up. Do not broadcast."

3. Use Notion MCP to log in NOTION_OBJECTIONS_DB_ID with properties: employeeName, role, objectionText, escalationType, sessionDate, facilitatorNote, createdAt (UTC timestamp), status: "open".

4. Output: "Escalation routed — [type] for [employee_name]. Slack: [sent/failed]. Notion: [logged/failed]."
---END INSTRUCTIONS---

---

**API #10 — Usage Streak Recognition**  
Trigger: `POST /trigger/streak-recognition`  
Connectors: Gmail, Slack  
Env vars: PROGRAM_FACILITATOR_NAME, SLACK_ENABLEMENT_CHANNEL

---BEGIN INSTRUCTIONS---
An employee has hit a usage streak milestone. Send recognition.

1. Select recognition language based on milestone from payload:
   - 4 weeks: "One month in — you're building a real habit."
   - 8 weeks: "Two months of consistent use. That's not luck, it's a skill forming."
   - 12 weeks: "Quarter-complete. You're in the top tier of adopters."
   - 26 weeks: "Six months. You've crossed from user to practitioner."

2. Use Gmail MCP to send to employee_email from payload:
   Subject: [milestone]-week Claude streak — [employee_name]
   Body: Hi [employee_name], [milestone recognition language from step 1]. Some highlights from your check-ins: [bulleted list from highlights array — max 3 items]. Keep logging your wins. Your track record is becoming a case study. [Sign as PROGRAM_FACILITATOR_NAME]

3. If manager_email is present in payload, send a separate Gmail to manager_email:
   Subject: [employee_name] — [milestone] weeks of Claude adoption
   Body: FYI: [employee_name] has completed [streak_weeks] consecutive weeks of Claude usage check-ins, hitting the [milestone]-week milestone. Notable wins: [highlights joined with "; "]. No action needed — just worth knowing.

4. Use Slack MCP to post in SLACK_ENABLEMENT_CHANNEL:
   🏆 *[employee_name]* just hit [milestone] weeks of consistent Claude usage. [first item from highlights array]

5. Output: confirmation of emails sent (to employee + manager if applicable) and Slack post confirmation.
---END INSTRUCTIONS---
