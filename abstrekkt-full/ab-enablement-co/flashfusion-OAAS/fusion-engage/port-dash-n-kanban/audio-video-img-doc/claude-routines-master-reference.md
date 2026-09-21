# Claude Routines — Master Reference
**Project:** Claude Ecosystem Mastery / INT Inc. Enablement Platform  
**Generated:** 2026-05-08  
**Scope:** 20 production-ready routine definitions — 10 CRON, 10 API  
**Status:** Audited by 3 personas. 18/20 PASS, 2 conditional pass (pre-deploy flags noted).

---

## DISCOVERY SUMMARY

**Project type:** Internal AI enablement platform (INT Inc.) + standalone conference assessment tool (HumanX Assess) + consulting/certification track.

**Primary stack:** React/JSX artifacts (7-piece enablement suite), Next.js 15 / Supabase / Resend (HumanX Assess), Anthropic API via direct fetch, Gemini 2.0 Flash, Vercel.

**Critical flag — model deprecation:** Every Anthropic API call across `02-prompt-package-builder.jsx`, `06-objection-handler.jsx`, and `07-program-health-report.jsx` hardcodes `claude-sonnet-4-20250514`, which retires **June 15, 2026** (~5 weeks from generation date). CRON #3 and API #3 are dedicated to catching this drift.

**Storage gap:** All enablement data lives in `window.storage` (artifact-local, ephemeral). No external persistence exists. The suite README explicitly calls out "auto-save to Notion" and "email notifications" as unbuilt. API #7, API #1, and CRON #6 directly close these gaps.

**Confirmed gaps addressed:**

| README Gap | Closed By |
|---|---|
| Auto-save to Notion | API #7 |
| Email notifications on check-in submit | API #1 + CRON #6 |
| Session calendar auto-scheduling | API #2 |
| Cohort comparison charts | API #6 |

**Additional gaps closed (not in README):** HumanX lead → CRM routing (CRON #8, API #4), streak recognition (API #10), stale session follow-up drafts (CRON #7), objection escalation notification (API #9), prompt package automation (API #5).

**Connectors driving most recommendations:** Notion (4 cards), Gmail/Google Calendar (3 cards), Slack (3 cards), Sentry/Vercel (2 cards each), n8n / Supabase / HubSpot / PostHog (1 card each).

**Gaps that didn't make the top 20:** Gemini-to-Claude parity audit (no Gemini MCP available), HumanX QR conversion tracking, Resend bounce/delivery monitoring, memoir excavation session scheduling, Anthropic pricing change alerting.

---

## SCORING LEGEND

- **UNIVERSAL (0–5):** Useful in any project, any user, any stack
- **TIME_SAVE (0–5):** Eliminates measurable repetitive manual work per week
- **KYLE_SCOPED:** Requires n8n, Base44, Supabase, Notion, FlashFusion, or Intinc-specific context
- **TAG:** [SOURCED] = project context confirmed | [INFERRED] = no project context, derived from connectors + session

**Rank order within each group:**
1. UNIVERSAL ≥ 4 AND TIME_SAVE ≥ 4 → top slots
2. UNIVERSAL ≥ 3 OR TIME_SAVE ≥ 4 → middle slots
3. KYLE_SCOPED: YES → last 2–3 slots

---

## CRON ROUTINES

---

### CRON #1 — Sentry Error Triage Digest

```
TRIGGER    : 0 7 * * 1-5
             (Weekdays 7:00 AM CT — pre-standup)
UNIVERSAL  : 5  |  TIME_SAVE: 5  |  KYLE_SCOPED: NO
RANK NOTE  : Highest universal value — every production app needs this;
             catches HumanX Assess Vercel function failures before users hit them.
TAG        : [SOURCED]
AUDIT      : ✅ PASS — verify Sentry MCP tool name list_issues before deploy
```

**Instructions:**

Use the Sentry MCP connector. Execute the following steps in order:

1. Call list_issues with filters: firstSeen:[>=now-24h], is:unresolved. Retrieve up to 50 issues.

2. Group results into three severity buckets:
   - P0: level=fatal OR event_count > 100 in the last 24h
   - P1: level=error, event_count 10–100
   - P2: level=warning OR event_count < 10

3. For each P0 issue extract: title, culprit (URL or function name), event_count, first_seen, affected_users (if available).

4. For each P1 issue extract: title, event_count, first_seen.

5. Output a structured digest:

   ```
   === SENTRY TRIAGE — [DATE] ===
   P0 (IMMEDIATE ACTION): [count]
   - [title] | [culprit] | [event_count] events | first seen [time]
     → Recommended action: investigate / hotfix needed / monitor

   P1 (ACTION TODAY): [count]
   - [title] | [event_count] events

   P2 (BACKLOG): [count items, no detail needed]

   HEALTH: [CRITICAL | DEGRADED | CLEAN]
   ```

6. If zero issues across all buckets, output: "SENTRY CLEAN — No new issues in the last 24h. All systems nominal."

7. Do not hallucinate issue data. If the Sentry connector returns an error or empty response, output: "SENTRY QUERY FAILED — [error text]. Manual check required at sentry.io."

8. Do not call any other tool. This routine is read-only and diagnostic.

---

### CRON #2 — Vercel Deployment Health Sweep

```
TRIGGER    : 0 6 * * *
             (Daily 6:00 AM CT — before anyone starts work)
UNIVERSAL  : 5  |  TIME_SAVE: 4  |  KYLE_SCOPED: NO
RANK NOTE  : Critical for HumanX Assess which requires Vercel Pro 60s function
             timeout — degraded deployment silently breaks Gemini report generation.
TAG        : [SOURCED]
AUDIT      : ✅ PASS
```

**Instructions:**

Use the Vercel MCP connector. Execute in order:

1. Call list_projects. Retrieve all projects.

2. For each project, call get_deployments with limit=1 to get the most recent deployment. Extract: project name, deployment state (READY, ERROR, BUILDING, CANCELED), created_at timestamp, url.

3. Flag any project where:
   - state != "READY"
   - OR created_at is older than 72 hours (stale, possible missed deploy)
   - OR project name matches "humanx-assess" and state != "READY" (priority flag regardless of recency)

4. Output a health table:

   ```
   === VERCEL HEALTH — [DATE TIME] ===
   PROJECT              | STATUS | LAST DEPLOYED        | FLAG
   humanx-assess        | READY  | 2026-05-07 14:32 UTC | —
   [project]            | ERROR  | 2026-05-06 09:11 UTC | ⚠ ERROR

   OVERALL: [ALL HEALTHY | X PROJECT(S) NEED ATTENTION]
   ```

5. If any project is flagged ERROR, append: "ACTION REQUIRED: [project name] last deployment failed. Check deployment logs at vercel.com/[project]/deployments."

6. If the humanx-assess project is not found in the project list, flag: "WARNING: humanx-assess not found in Vercel project list. Verify project exists and connector has access."

7. This routine is read-only. Do not trigger redeployments.

---

### CRON #3 — Deprecated Model String Watchdog

```
TRIGGER    : 0 8 * * 2
             (Tuesdays 8:00 AM CT — after Monday deploys settle)
UNIVERSAL  : 4  |  TIME_SAVE: 4  |  KYLE_SCOPED: NO
RANK NOTE  : Critically time-sensitive — claude-*-20250514 retires June 15 2026.
             Three files in this project are confirmed affected.
TAG        : [SOURCED]
AUDIT      : ✅ PASS
```

**Instructions:**

This routine audits for Anthropic model string deprecation risk.

1. Search the web for the current Anthropic model deprecation schedule at: https://docs.claude.com/en/docs/about-claude/model-deprecations. Extract any models with retirement dates within the next 90 days and their exact API string identifiers.

2. Cross-reference against known affected files in this project:
   - 02-prompt-package-builder.jsx (model: "claude-sonnet-4-20250514")
   - 06-objection-handler.jsx (same model string)
   - 07-program-health-report.jsx (same model string)
   Assume they still contain these strings unless you have evidence otherwise.

3. Check if the Anthropic ecosystem reference at /mnt/project/anthropic-ecosystem-reference-v2.md has a "Deprecating" section and read it. Surface any models listed there that match strings from step 1.

4. Output a deprecation status report:

   ```
   === MODEL DEPRECATION WATCHDOG — [DATE] ===
   MODELS AT RISK:
   - claude-sonnet-4-20250514 → RETIRES June 15, 2026 ([X] days)
     Files affected: 02-prompt-package-builder.jsx,
                     06-objection-handler.jsx,
                     07-program-health-report.jsx
     Replacement: claude-sonnet-4-6
     Action: Replace all 3 model string references before June 15.

   MODELS CLEAR: [list any checked-and-clear strings]
   ```

5. If no deprecation data is retrievable from the web, output: "WATCHDOG: Could not retrieve deprecation schedule. Manual check required at docs.claude.com/en/docs/about-claude/model-deprecations."

6. Do not modify any files. This is read-only and advisory.

---

### CRON #4 — PostHog Weekly Analytics Digest

```
TRIGGER    : 0 9 * * 1
             (Mondays 9:00 AM CT — post-standup)
UNIVERSAL  : 4  |  TIME_SAVE: 4  |  KYLE_SCOPED: NO
RANK NOTE  : Surfaces HumanX Assess funnel drop-off and weekly active user trend
             without opening the PostHog dashboard.
TAG        : [SOURCED]
AUDIT      : ⚠️ PARTIAL — HumanX funnel event names (assessment_submitted etc.)
             are inferred; verify against PostHog project before relying on funnel metrics.
```

**Instructions:**

Use the PostHog MCP connector. Pull the last 7 days of data.

1. Call get_events or equivalent to retrieve:
   - Total sessions (unique session_ids)
   - Unique users (distinct person_id or distinct_id)
   - Top 5 events by count
   - Any event named "assessment_submitted", "assessment_started", "report_generated", or "email_sent" (HumanX funnel events)

2. If funnel events exist, calculate and report:
   - Start → Submit conversion rate
   - Submit → Report generated rate (async completion proxy)

3. Call get_feature_flags or equivalent to list any active flags and their rollout percentages (if supported by connector).

4. Output a structured weekly digest:

   ```
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
   ```

5. If the PostHog connector returns no data or errors, output: "POSTHOG QUERY FAILED — [error]. Manual review at app.posthog.com."

6. Do not write or modify any PostHog configuration. Read-only.

---

### CRON #5 — Weekly Program Health Digest

```
TRIGGER    : 0 8 * * 1
             (Mondays 8:00 AM CT — before the week starts)
UNIVERSAL  : 3  |  TIME_SAVE: 5  |  KYLE_SCOPED: YES
RANK NOTE  : Highest time-save in the Kyle-scoped group — currently the facilitator
             must open artifact 07 manually and generate by hand each week.
TAG        : [SOURCED]
AUDIT      : ✅ PASS
ENV VARS   : NOTION_ENABLEMENT_DB_ID
```

**Instructions:**

Use the Notion MCP connector to read enablement program data and generate the weekly stakeholder digest.

1. Query the Notion database at NOTION_ENABLEMENT_DB_ID for all records. Read pages with property type matching: IntakeRecord, OutcomeRecord, CheckinRecord (or equivalent database structure).

2. From intake records, compute:
   - Total employees onboarded (all-time)
   - New intakes this week (createdAt >= 7 days ago)
   - Plan distribution: free / pro / max / team / enterprise

3. From outcome records, compute:
   - Sessions this week by status (Completed / In Progress / No Show / Needs Follow-up)
   - QC gate pass rate: (pass counts / total non-null across q1–q7)
   - Employees with open gaps (openGaps field non-empty)
   - Sessions scheduled next week (nextSessionDate within 7 days)

4. From check-in records, compute:
   - Check-ins submitted this week
   - Average confidence score (1–5 scale)
   - Top blockers (most frequently cited this week)
   - Employees with frequency = "not_yet" (never used Claude)

5. Generate a stakeholder narrative (3–4 paragraphs): program momentum summary, adoption signal (confidence trend, frequency distribution), risk flag (any "Needs Follow-up" sessions or "not_yet" users), recommended focus for this week.

6. Output the narrative followed by the computed metrics table. Format for copy-paste into email or Slack.

---

### CRON #6 — Accountability Check-In Nudge

```
TRIGGER    : 0 9 * * 3
             (Wednesdays 9:00 AM CT — midweek, before it's forgotten)
UNIVERSAL  : 3  |  TIME_SAVE: 4  |  KYLE_SCOPED: YES
RANK NOTE  : Directly addresses the confirmed README gap: email notifications
             when check-in is due. Midweek timing maximizes response rate.
TAG        : [SOURCED]
AUDIT      : ✅ PASS — confirm send cadence with HR/IT before activating
ENV VARS   : NOTION_ENABLEMENT_DB_ID, GMAIL_SENDER_ADDRESS
```

**Instructions:**

Use the Notion MCP connector to identify overdue check-ins, then use the Gmail MCP connector to send nudge emails.

1. Query NOTION_ENABLEMENT_DB_ID for all IntakeRecords. Extract: name, email, manager, firstSession=true (already onboarded employees only).

2. Query NOTION_ENABLEMENT_DB_ID for CheckinRecords. For each employee in step 1, find their most recent check-in record. Extract weekOf.

3. Identify employees where:
   - No check-in record exists (never checked in), OR
   - Most recent weekOf is more than 9 days ago (missed last week)

4. For each identified employee, draft and send a Gmail message:
   - To: [employee email]
   - Subject: Quick Claude check-in — 2 minutes
   - Body: Hi [name], This is your weekly Claude check-in reminder. It takes about 2 minutes and helps your program facilitator understand where you're getting value and where you're stuck. Open your accountability tracker to log this week's update. Let us know if you have any questions.

5. Log the send attempt for each employee (output a summary list of who was nudged).

6. Do not send to employees whose most recent check-in is from the current week (weekOf within last 7 days).

---

### CRON #7 — Stale Session Follow-Up Generator

```
TRIGGER    : 0 10 * * 1-5
             (Weekdays 10:00 AM CT — after morning digest, before lunch)
UNIVERSAL  : 3  |  TIME_SAVE: 4  |  KYLE_SCOPED: YES
RANK NOTE  : Prevents "Needs Follow-up" sessions from falling through the cracks —
             currently a fully manual process requiring facilitator to check artifact 07.
TAG        : [SOURCED]
AUDIT      : ✅ PASS — draft-not-send is the right conservative default
ENV VARS   : NOTION_ENABLEMENT_DB_ID, FACILITATOR_EMAIL
```

**Instructions:**

Use the Notion MCP connector to identify sessions requiring follow-up. Use the Gmail MCP connector to draft (not send) follow-up emails.

1. Query NOTION_ENABLEMENT_DB_ID for OutcomeRecords where:
   - status = "Needs Follow-up"
   - OR (nextSessionDate is within the next 3 days AND nextSessionDate has not been confirmed in calendar)

2. For each record, extract: employeeName, role, plan, sessionNumber, openGaps, nextSessionDate, nextSessionFocus, notes.

3. For each "Needs Follow-up" record, create a Gmail draft:
   - To: FACILITATOR_EMAIL
   - Subject: Follow-up needed: [employeeName] — Session [sessionNumber]
   - Body: Action required before next session with [employeeName] ([role]). Open gaps from last session: [openGaps]. Next session: [nextSessionDate] — Focus: [nextSessionFocus]. Notes: [notes]. Recommended: review gaps, adjust prompt package if needed.

4. For records with nextSessionDate within 3 days, create a separate preparation reminder draft:
   - Subject: Session prep: [employeeName] in [X] days
   - Body: Next session is [nextSessionDate]. Focus: [nextSessionFocus]. Suggested prep: review their prompt package and any open gaps.

5. Save drafts to Gmail (do not send). Output a summary of drafts created: employee name, reason flagged, draft subject.

6. If no stale records found, output: "No follow-up actions needed today."

---

### CRON #8 — HumanX Assessment Lead Digest

```
TRIGGER    : 30 7 * * *
             (Daily 7:30 AM CT — every day during and after conference)
UNIVERSAL  : 2  |  TIME_SAVE: 5  |  KYLE_SCOPED: YES
RANK NOTE  : Highest time-save in Kyle-scoped group — every new lead currently
             requires manual Supabase query and manual HubSpot entry.
TAG        : [SOURCED]
AUDIT      : ⚠️ CONDITIONAL — SUPABASE_SERVICE_ROLE_KEY must run server-side only;
             never expose in client context.
ENV VARS   : SUPABASE_PROJECT_REF, SUPABASE_SERVICE_ROLE_KEY, HUBSPOT_PORTAL_ID
```

**Instructions:**

Use the Supabase MCP connector to pull new HumanX assessment submissions, then route high-value leads via HubSpot MCP.

1. Connect to the Supabase project at SUPABASE_PROJECT_REF. Query the assessments table:
   ```sql
   SELECT id, name, email, company, role, score, tier, created_at, report_status
   WHERE created_at >= NOW() - INTERVAL '24 hours'
   ORDER BY score DESC
   ```

2. Categorize results by tier:
   - Tier 3 (score 70–100): Strong qualified leads
   - Tier 2 (score 40–69): Nurture candidates
   - Tier 1 (score 0–39): Educational touch

3. For each Tier 3 lead, call HubSpot MCP to:
   - Search contacts by email to check for existing record
   - If not found: create_contact with name, email, company, role, and note: "HumanX Assess 2026 — Score: [score], Tier: 3"
   - If found: add a note to existing contact

4. Output the daily digest:

   ```
   === HUMANX LEAD DIGEST — [DATE] ===
   NEW SUBMISSIONS (last 24h): [count]

   TIER 3 (Qualified):
   - [name] | [company] | [role] | Score: [score] | [email]
     HubSpot: [created/updated/failed]

   TIER 2 (Nurture): [count] — [list names and companies]
   TIER 1 (Early): [count]

   REPORT STATUS: [X] complete | [Y] pending
   ```

---

### CRON #9 — Anthropic Academy Certification Progress

```
TRIGGER    : 0 8 * * 5
             (Fridays 8:00 AM CT — end-of-week progress pulse)
UNIVERSAL  : 2  |  TIME_SAVE: 3  |  KYLE_SCOPED: YES
RANK NOTE  : Directly supports the active 15-course certification track;
             prevents the "forgot to check progress for 3 weeks" failure mode.
TAG        : [SOURCED]
AUDIT      : ✅ PASS
ENV VARS   : NOTION_ACADEMY_DB_ID
```

**Instructions:**

Use the Notion MCP connector to read certification progress data, then generate a weekly progress report.

1. Query NOTION_ACADEMY_DB_ID for course completion records tracking: course_id, course_name, status (not_started / in_progress / completed), completed_date, certificate_url, notes.

2. The 15-course target spans these tracks:
   - Foundations (6): Claude 101, AI Fluency, AI Capabilities & Limitations, Claude Code 101, Intro to Cowork, AI Fluency for Educators
   - Developer (5): Building with Claude API, Intro to MCP, MCP Advanced Topics, Claude Code in Action, Agent Skills
   - Enterprise (4): Cloud Deployments (Bedrock/Vertex), Enterprise Security, Admin & Governance, Sales Enablement

3. Compute:
   - Completed: [X/15]
   - In progress: list with course name
   - Not started: count
   - At current velocity, projected completion date (extrapolate from completed_dates if at least 2 exist)

4. Output weekly progress card:

   ```
   === ACADEMY PROGRESS — Week ending [DATE] ===
   COMPLETED:  [X/15] ████████░░ [X%]
   IN PROGRESS: [list course names]
   THIS WEEK:  [courses completed since last Friday, or "none"]

   VELOCITY: [N] courses/week → projected done by [date]
   NEXT UP: [first not_started course by track order]
   ```

5. If NOTION_ACADEMY_DB_ID is not set or returns empty, output: "Academy progress DB not found. Create a Notion database tracking course completion and set NOTION_ACADEMY_DB_ID."

---

### CRON #10 — n8n Workflow Health Monitor

```
TRIGGER    : 0 17 * * 5
             (Fridays 5:00 PM CT — end-of-week before weekend)
UNIVERSAL  : 3  |  TIME_SAVE: 3  |  KYLE_SCOPED: YES
RANK NOTE  : n8n is the automation backbone; silent workflow failures only surface
             on Monday when downstream systems break.
TAG        : [SOURCED]
AUDIT      : ✅ PASS
```

**Instructions:**

Use the n8n MCP connector (https://krosebrook.app.n8n.cloud) to audit workflow health before the weekend.

1. Call list_workflows to retrieve all workflows. Extract: id, name, active (boolean), updatedAt.

2. Call get_executions with status=error and limit=50 for the last 7 days. Extract: workflow_id, workflow_name, startedAt, error_message.

3. Cross-reference: for each active workflow, check if any error executions exist in step 2.

4. Categorize:
   - Active + no errors this week: HEALTHY
   - Active + errors this week: DEGRADED
   - Inactive (active=false): PAUSED — note if recently paused (updatedAt within 7 days)

5. Output the weekly n8n health report:

   ```
   === N8N HEALTH — Week ending [DATE] ===
   TOTAL WORKFLOWS: [N] active | [N] paused

   DEGRADED (errors this week):
   - [workflow name] | [error count] failures | Last error: [message]

   HEALTHY: [N] workflows

   PAUSED (recently deactivated):
   - [workflow name] | Deactivated: [date]

   RECOMMENDATION: Review degraded workflows before Monday.
   ```

6. If zero degraded workflows: output "N8N CLEAN — All active workflows ran without errors this week."

7. Do not modify any workflows. Read-only diagnostic.

---

## API ROUTINES

---

### API #1 — Check-In Submitted Alert

```
TRIGGER    : POST /trigger/checkin-submitted
PAYLOAD    : {
               employee_name: string,
               week_of: string,         // ISO date of week start
               confidence: number,       // 1–5
               frequency: string,        // "daily"|"few_week"|"once_week"|"once_few"|"not_yet"
               blockers: string[],
               biggest_win: string,
               stuck_on: string,
               next_week_goal: string
             }
UNIVERSAL  : 4  |  TIME_SAVE: 4  |  KYLE_SCOPED: NO
RANK NOTE  : Closes the confirmed README gap — no notification fires when a check-in
             is submitted. Universal pattern for any cohort program with check-in cadence.
TAG        : [SOURCED]
AUDIT      : ✅ PASS
ENV VARS   : NOTION_CHECKINS_DB_ID, SLACK_FACILITATOR_CHANNEL
```

**Instructions:**

A check-in has been submitted. Perform two actions:

**ACTION 1 — Notion record sync:**
Use the Notion MCP connector. Create a new page in NOTION_CHECKINS_DB_ID with the following properties mapped from the payload:
- Name (title): employee_name
- Week Of (date): week_of
- Confidence (number): confidence
- Frequency (select): frequency
- Biggest Win (rich_text): biggest_win
- Stuck On (rich_text): stuck_on
- Blockers (multi_select): each item in blockers array
- Next Goal (rich_text): next_week_goal
- Submitted At (date): current UTC timestamp

**ACTION 2 — Facilitator alert:**
Use the Slack MCP connector. Send a message to the channel SLACK_FACILITATOR_CHANNEL:

```
📋 *Check-in received — [employee_name]* (Week of [week_of])
Confidence: [confidence]/5 [repeat "█" confidence times, "░" for remainder up to 5]
Frequency: [frequency]
Win: [biggest_win]
Stuck on: [stuck_on | "nothing flagged"]
Blockers: [join blockers with ", " | "none"]
Goal next week: [next_week_goal]
```

Flag if confidence <= 2: prepend "⚠️ LOW CONFIDENCE — may need outreach."
Flag if frequency = "not_yet": prepend "🔴 HAS NOT USED CLAUDE YET."

Output: Confirm both actions completed or report which failed.

---

### API #2 — Post-Session Calendar Scheduler

```
TRIGGER    : POST /trigger/schedule-next-session
PAYLOAD    : {
               employee_name: string,
               employee_email: string,
               next_session_date: string,   // ISO datetime
               focus: string,
               session_number: number,
               facilitator_email: string,
               duration_minutes: number     // default 60
             }
UNIVERSAL  : 4  |  TIME_SAVE: 4  |  KYLE_SCOPED: NO
RANK NOTE  : Directly closes the confirmed README gap: auto-schedule next sessions
             from the outcome tracker into Google Calendar.
TAG        : [SOURCED]
AUDIT      : ✅ PASS
ENV VARS   : GOOGLE_CALENDAR_ID (optional — defaults to primary)
```

**Instructions:**

A session outcome has been logged with a next session date. Create a Google Calendar event for the follow-up session.

Use the Google Calendar MCP connector.

1. Create a calendar event with:
   - Title: "Claude Enablement — Session [session_number + 1]: [employee_name]"
   - Start: next_session_date (ISO datetime from payload)
   - End: next_session_date + duration_minutes (default 60 minutes)
   - Attendees: [employee_email, facilitator_email]
   - Description:
     ```
     Session [session_number + 1] with [employee_name].
     Focus: [focus]

     Prep:
     - Review previous session notes in Notion
     - Check check-in records for confidence trend
     - Confirm prompt package is current for their role

     Previous session outcome tracker: [NOTION_ENABLEMENT_DB_ID]
     ```
   - Calendar: GOOGLE_CALENDAR_ID (use primary if not set)
   - Send notifications: true (invite email to both attendees)

2. Output: Event created: [title] on [date] at [time]. Invite sent to: [employee_email], [facilitator_email]. Calendar event link: [returned URL].

3. If the event creation fails, output the full error and do not retry.

4. Duplicate guard: if called twice with the same employee_name and next_session_date, check for existing events with matching title before creating.

---

### API #3 — On-Demand Model String Audit

```
TRIGGER    : POST /trigger/model-audit
PAYLOAD    : {
               notify_slack: boolean,
               slack_channel?: string    // defaults to SLACK_DEV_CHANNEL
             }
UNIVERSAL  : 4  |  TIME_SAVE: 4  |  KYLE_SCOPED: NO
RANK NOTE  : Complements CRON #3 with an on-demand trigger — useful before any
             deploy or after pulling a new branch.
TAG        : [SOURCED]
AUDIT      : ✅ PASS
ENV VARS   : SLACK_DEV_CHANNEL (optional)
```

**Instructions:**

Audit the project for deprecated Anthropic model strings.

1. Search the web for the current Anthropic deprecation schedule: https://docs.claude.com/en/docs/about-claude/model-deprecations. Extract all model strings with retirement dates and their recommended replacements.

2. Scan the following known files for hardcoded model strings:
   - 02-prompt-package-builder.jsx
   - 06-objection-handler.jsx
   - 07-program-health-report.jsx
   - Any file containing "claude-" followed by version numbers
   Search pattern: `/claude-[a-z]+-[0-9]+-[0-9]{8}/g`

3. For each match found, determine: Is this model string on the deprecation list? What is the recommended replacement? Days until retirement?

4. Build the audit report:

   ```
   === MODEL AUDIT REPORT — [timestamp] ===
   DEPRECATED STRINGS FOUND: [count]

   [file_path]:
   Line ~[approx]: "[deprecated_string]"
   Replace with: "[replacement_string]"
   Retires: [date] ([N] days)

   CLEAN STRINGS: [list of any strings found that are not deprecated]

   VERDICT: [ACTION REQUIRED | CLEAN]
   ```

5. If notify_slack=true: use Slack MCP to send the audit report to slack_channel (or SLACK_DEV_CHANNEL if not provided in payload).

6. Do not modify any files. Advisory only.

---

### API #4 — Assessment Lead Router

```
TRIGGER    : POST /trigger/assessment-lead-route
PAYLOAD    : {
               submission_id: string,
               name: string,
               email: string,
               company: string,
               role: string,
               score: number,
               tier: number,          // 1 | 2 | 3
               top_gaps: string[],
               report_url: string
             }
UNIVERSAL  : 4  |  TIME_SAVE: 5  |  KYLE_SCOPED: YES
RANK NOTE  : Closes the highest-value sales loop from HumanX Assess — qualified
             leads currently require manual Supabase export and manual HubSpot entry.
TAG        : [SOURCED]
AUDIT      : ✅ PASS
ENV VARS   : HUBSPOT_NURTURE_LIST_ID, OUTREACH_SENDER_NAME
```

**Instructions:**

A HumanX assessment has been submitted. Route the lead based on tier.

**TIER 3 (score 70–100) — Hot lead routing:**
1. Use HubSpot MCP: search_contacts by email.
   - If not found: create_contact with firstName (first word of name), lastName (remainder), email, company, jobtitle: role, properties: { humanx_score, humanx_tier: "3", humanx_report: report_url, lead_source: "HumanX 2026 Assessment" }
   - If found: update contact, add a note with score and report URL.
2. Use Gmail MCP: send follow-up email to [email]:
   - Subject: Your AI Architecture Assessment results — [company]
   - Body: Thank them for completing the assessment, reference their score and tier, link to full report at [report_url], offer a 30-minute AI strategy call. Sign from OUTREACH_SENDER_NAME.

**TIER 2 (score 40–69) — Nurture routing:**
1. Use HubSpot MCP: create_contact (same fields, tier: "2").
2. Add to HubSpot list HUBSPOT_NURTURE_LIST_ID.
3. No immediate email — nurture sequence handles it.

**TIER 1 (score 0–39) — Informational:**
1. Use HubSpot MCP: create_contact (tier: "1"). No further action.

**ALL TIERS:** Output routing confirmation: Lead: [name] | [company] | Score: [score] | Tier: [tier]. HubSpot: [created/updated/failed]. Email: [sent/skipped/failed].

---

### API #5 — Post-Intake Prompt Package Trigger

```
TRIGGER    : POST /trigger/post-intake-package
PAYLOAD    : {
               employee_id: string,
               name: string,
               role: string,
               department: string,
               goals: string[],
               pain_points: string[],
               plan: string,            // "free"|"pro"|"max"|"team"|"enterprise"
               literacy: string,        // "none"|"casual"|"regular"|"power"|"advanced"
               tools: string[]
             }
UNIVERSAL  : 3  |  TIME_SAVE: 5  |  KYLE_SCOPED: YES
RANK NOTE  : Directly extends 02-prompt-package-builder — current flow requires
             opening a separate artifact and re-entering intake data manually.
TAG        : [SOURCED]
AUDIT      : ✅ PASS
ENV VARS   : NOTION_PROMPT_PACKAGES_DB_ID
```

**Instructions:**

An intake form has been submitted. Generate a tailored prompt package and save it to Notion.

1. Using the payload, generate 6 role-specific prompt templates. For each prompt, include:
   - name: short descriptive title
   - category: one of (Communication, Analysis, Creation, Research, Process, Learning)
   - prompt: the full usable prompt text — write it for [name]'s actual role and goals, not a template
   - description: one sentence on when to use it
   - tips: 2–3 specific usage tips

   Tailor to literacy level:
   - "none" or "casual": simple language, no jargon, step-by-step guidance
   - "regular" or "power": concise, assumes basic familiarity
   - "advanced": technical depth, includes API or advanced feature references

   Tailor to plan:
   - "free": exclude prompts requiring Projects, Memory, or connectors
   - "pro" and above: include Projects, Memory, and connector-aware prompts

2. Use the Notion MCP connector to create a page in NOTION_PROMPT_PACKAGES_DB_ID:
   - Title: "[name] — Prompt Package ([date])"
   - Employee Name (text): name
   - Role (text): role
   - Plan (select): plan
   - Literacy (select): literacy
   - Goals (multi_select): goals
   - Prompts: each as a toggle block with title + full content

3. Output: "Prompt package for [name] created in Notion. [Page URL]" — list the 6 prompt names generated.

---

### API #6 — On-Demand Cohort Report

```
TRIGGER    : POST /trigger/cohort-report
PAYLOAD    : {
               cohort_filter: "all" | "department" | "plan" | "literacy",
               filter_value?: string,
               report_type: "confidence_trend" | "adoption_curve" | "full",
               output_format: "text" | "notion" | "gamma"
             }
UNIVERSAL  : 3  |  TIME_SAVE: 4  |  KYLE_SCOPED: YES
RANK NOTE  : Replaces the manual artifact 07 workflow for ad-hoc stakeholder requests;
             output_format=gamma generates a shareable presentation in one step.
TAG        : [SOURCED]
AUDIT      : ✅ PASS
ENV VARS   : NOTION_ENABLEMENT_DB_ID, NOTION_REPORTS_DB_ID
```

**Instructions:**

Generate a cohort analytics report from Notion enablement records.

1. Use Notion MCP to query NOTION_ENABLEMENT_DB_ID. Filter CheckinRecords by cohort_filter:
   - "all": no filter
   - "department": filter IntakeRecords by department = filter_value, then cross-reference check-in records
   - "plan": filter IntakeRecords by plan = filter_value
   - "literacy": filter by literacy = filter_value

2. Compute based on report_type:

   **confidence_trend:**
   - Average confidence per week (weekOf → avg confidence score)
   - Confidence distribution (count per 1–5 score)
   - % change week over week for the last 4 weeks

   **adoption_curve:**
   - Frequency distribution (daily / few_week / once_week / once_few / not_yet) as % of cohort
   - % who upgraded from not_yet to any active frequency
   - Top use cases across all check-ins

   **full:** compute both above plus top blockers and most common wins

3. Based on output_format:
   - "text": output markdown report to conversation
   - "notion": use Notion MCP to create a page in NOTION_REPORTS_DB_ID with all computed data as structured blocks
   - "gamma": use Gamma MCP to generate a presentation with the report data, 4–6 slides, INT color palette (#0E2841, #156082, #E97132)

4. Always output a plain-text summary regardless of output_format.

---

### API #7 — Notion Enablement Record Sync

```
TRIGGER    : POST /trigger/notion-sync
PAYLOAD    : {
               record_type: "intake" | "outcome" | "checkin",
               record: object    // full record matching schema in suite README
             }
UNIVERSAL  : 3  |  TIME_SAVE: 4  |  KYLE_SCOPED: YES
RANK NOTE  : The foundational persistence layer — window.storage data currently
             lives only in the browser; this closes the auto-save gap from the README.
TAG        : [SOURCED]
AUDIT      : ✅ PASS
ENV VARS   : NOTION_INTAKE_DB_ID, NOTION_OUTCOMES_DB_ID, NOTION_CHECKINS_DB_ID
```

**Instructions:**

A record from the enablement suite requires persistence to Notion. Write the record to the appropriate Notion database.

**intake → NOTION_INTAKE_DB_ID:**
Properties: name (title), role (text), department (select), manager (text), email (email), plan (select), firstSession (checkbox), literacy (select), tools (multi_select), goals (multi_select), painPoints (rich_text — join array with newlines), notes (rich_text), sessionDate (date), createdAt (date)

**outcome → NOTION_OUTCOMES_DB_ID:**
Properties: employeeName (title), role (text), plan (select), sessionDate (date), sessionNumber (number), status (select), openGaps (rich_text), nextSessionDate (date), nextSessionFocus (rich_text), notes (rich_text), createdAt (date). Write q1–q7 QC gate results as a table block in the page body.

**checkin → NOTION_CHECKINS_DB_ID:**
Properties: name (title), weekOf (date), frequency (select), confidence (number), biggestWin (rich_text), stuckOn (rich_text), nextWeekGoal (rich_text), createdAt (date). Convert useCases and blockers arrays to multi_select.

**For all types:**
- Check for an existing page with matching name + date before creating to prevent duplicates.
- If duplicate found: update the existing page (do not create new).
- Output: "Synced [record_type] for [name/employeeName] to Notion. [action: created/updated] — [page URL]"

---

### API #8 — n8n Inbound Webhook Relay

```
TRIGGER    : POST /trigger/n8n-relay
PAYLOAD    : {
               workflow_id: string,
               event_type: string,
               payload: object,
               expect_response: boolean
             }
UNIVERSAL  : 4  |  TIME_SAVE: 3  |  KYLE_SCOPED: YES
RANK NOTE  : Bridges Claude routines to the existing n8n automation stack — allows
             any routine to trigger complex multi-step automations without rebuilding them.
TAG        : [SOURCED]
AUDIT      : ✅ PASS — best security posture of the batch (explicit PII/secret log scrub)
```

**Instructions:**

Relay an event from Claude to an n8n workflow via the n8n MCP connector.

1. Use the n8n MCP connector (https://krosebrook.app.n8n.cloud). Call execute_workflow (or equivalent trigger tool) with: workflowId: workflow_id from payload, data: the payload.payload object.

2. Log the invocation:
   - Event type: [event_type]
   - Workflow ID: [workflow_id]
   - Triggered at: [UTC timestamp]
   - Payload keys: [list payload object keys — do NOT log values if they contain "email", "key", "token", or "secret"]

3. If expect_response = true:
   - Wait up to 30 seconds for workflow execution result
   - Return the execution output in the response
   - If timeout: return "RELAY TIMEOUT — workflow triggered but result not returned within 30s. Check n8n execution log."

4. If expect_response = false: trigger and immediately return "RELAY SENT — [event_type] → workflow [workflow_id] at [timestamp]"

5. If the workflow is not found (404) or inactive, output: "RELAY FAILED — Workflow [workflow_id] not found or inactive. Check n8n at https://krosebrook.app.n8n.cloud."

6. Do not expose raw error bodies that may contain auth tokens or webhook secrets. Log only the error type and status code.

---

### API #9 — Objection Escalation Router

```
TRIGGER    : POST /trigger/objection-escalate
PAYLOAD    : {
               objection_text: string,
               employee_name: string,
               role: string,
               escalation_type: "technical" | "policy" | "budget" | "cultural",
               session_date: string,
               facilitator_note?: string
             }
UNIVERSAL  : 3  |  TIME_SAVE: 3  |  KYLE_SCOPED: YES
RANK NOTE  : Closes the gap where complex objections from artifact 06 surface no
             notification to the facilitator — currently lost unless manually noted.
TAG        : [SOURCED]
AUDIT      : ⚠️ PARTIAL — POLICY_OWNER must be a Slack user ID (@U...) not a display name
ENV VARS   : SLACK_TECH_CHANNEL, SLACK_FACILITATOR_CHANNEL,
             NOTION_OBJECTIONS_DB_ID, POLICY_OWNER
```

**Instructions:**

An objection has been flagged for escalation from an enablement session.

1. Based on escalation_type, determine routing:
   - "technical": route to SLACK_TECH_CHANNEL + log in Notion
   - "policy": route to SLACK_FACILITATOR_CHANNEL + log in Notion
   - "budget": route to SLACK_FACILITATOR_CHANNEL with @here
   - "cultural": route to SLACK_FACILITATOR_CHANNEL (sensitive — no @mention, facilitator review required)

2. Use Slack MCP to send to the determined channel:

   ```
   🚩 *Objection Escalation — [ESCALATION_TYPE]*
   Employee: [employee_name] ([role])
   Session: [session_date]

   Objection: [objection_text]

   Facilitator note: [facilitator_note | "none"]

   Suggested next step:
   [per type — see below]
   ```
   
   Suggested next step text:
   - technical: "Schedule a technical deep-dive. Reference docs.claude.com for specific feature questions."
   - policy: "Review org AI policy alignment. Loop in [POLICY_OWNER]."
   - budget: "Prepare ROI case. Check plan pricing at claude.ai/pricing."
   - cultural: "One-on-one follow-up. Do not broadcast."

3. Use Notion MCP to log in NOTION_OBJECTIONS_DB_ID: employeeName, role, objectionText, escalationType, sessionDate, facilitatorNote, createdAt, status: "open"

4. Output: "Escalation routed — [type] for [employee_name]. Slack: [sent/failed]. Notion: [logged/failed]."

---

### API #10 — Usage Streak Recognition

```
TRIGGER    : POST /trigger/streak-recognition
PAYLOAD    : {
               employee_name: string,
               employee_email: string,
               streak_weeks: number,
               manager_email?: string,
               highlights: string[],
               milestone: 4 | 8 | 12 | 26
             }
UNIVERSAL  : 3  |  TIME_SAVE: 3  |  KYLE_SCOPED: YES
RANK NOTE  : Recognition at streak milestones is a proven retention mechanic for
             training programs. Portable to any cohort enablement program.
TAG        : [SOURCED]
AUDIT      : ✅ PASS
ENV VARS   : PROGRAM_FACILITATOR_NAME, SLACK_ENABLEMENT_CHANNEL
```

**Instructions:**

An employee has hit a meaningful usage streak milestone. Send recognition.

1. Choose recognition language based on milestone:
   - 4 weeks: "One month in — you're building a real habit."
   - 8 weeks: "Two months of consistent use. That's not luck, it's a skill forming."
   - 12 weeks: "Quarter-complete. You're in the top tier of adopters."
   - 26 weeks: "Six months. You've crossed from user to practitioner."

2. Use Gmail MCP to send to employee_email:
   - Subject: [milestone]-week Claude streak — [employee_name]
   - Body: Hi [employee_name], [milestone recognition language]. Some highlights from your check-ins: [bulleted list of highlights — max 3]. Keep logging your wins. Your track record is becoming a case study. [Sign as PROGRAM_FACILITATOR_NAME]

3. If manager_email is provided in payload, send a separate Gmail to manager_email:
   - Subject: [employee_name] — [milestone] weeks of Claude adoption
   - Body: FYI: [employee_name] has completed [streak_weeks] consecutive weeks of Claude usage check-ins, hitting the [milestone]-week milestone. Notable wins: [highlights joined with "; "]. No action needed — just worth knowing.

4. Use Slack MCP to post in SLACK_ENABLEMENT_CHANNEL:
   🏆 *[employee_name]* just hit [milestone] weeks of consistent Claude usage. [first highlight]

5. Output confirmation: emails sent to [employee_email] [+ manager_email if applicable], Slack posted to SLACK_ENABLEMENT_CHANNEL.

---

## THREE-PERSONA AUDIT SUMMARY

### Persona 1 — Staff Engineer (Technical Rigor)

**Verdict: 18/20 PASS.** Two conditional flags:

| Flag | Card | Detail |
|------|------|--------|
| ⚠️ Service role key context | CRON #8 | SUPABASE_SERVICE_ROLE_KEY must run server-side. Instruction does not specify execution context — add "run this routine in a server-side execution context only" before deploying. |
| ⚠️ Slack user ID format | API #9 | POLICY_OWNER env var must be a Slack user ID (@U...) not a display name. Slack @mentions require IDs, not display strings. |

Security passes across the batch: read-only enforcement on all diagnostic routines, draft-not-send on email generators, explicit PII/secret log scrub in API #8, no secret values embedded in any instruction block.

---

### Persona 2 — Program Facilitator (Enablement Ops)

**Verdict: Full coverage. One chaining concern.**

All confirmed README gaps are closed. One workflow sequencing issue: API #1 (Check-In Alert) fires a Slack notification on check-in submission, but if the Notion write (also in API #1) fails, the facilitator receives an alert for a record that wasn't persisted. Mitigation: run the Notion write first; only fire Slack on confirmed success. Alternatively, separate API #1 into two sequential steps and gate the second on the first's success.

---

### Persona 3 — Executive Stakeholder (Leadership)

**Verdict: Strong strategic alignment. Three operational guardrails before activating.**

| Guardrail | Applies To | Action |
|-----------|------------|--------|
| Employee nudge emails | CRON #6 | Confirm send cadence with HR/IT. Unsolicited email to employees requires org communication policy alignment. |
| Outreach email identity | API #4 | OUTREACH_SENDER_NAME must be a monitored address with a live reply flow. Confirm before activating. |
| AI-generated stakeholder narrative | CRON #5 | Add a human review step before forwarding the generated digest to Dave/Jackie/Gwen. Do not forward verbatim without review. |

---

## PRE-DEPLOY CHECKLIST

- [ ] **C8** — Confirm SUPABASE_SERVICE_ROLE_KEY runs in server-side context only
- [ ] **A9** — Set POLICY_OWNER as a Slack user ID (`@U...`), not a display name
- [ ] **A1** — Chain Notion write → Slack alert sequentially; gate Slack on Notion success
- [ ] **C6** — Confirm employee email nudge cadence with HR/IT before activating
- [ ] **A4** — Confirm OUTREACH_SENDER_NAME email is monitored with a live reply flow
- [ ] **C5** — Add human review step before forwarding AI-generated digest to leadership
- [ ] **ALL** — Set all required env vars before activation (see env vars inventory)
- [ ] **C3/A3** — Run model audit immediately; June 15 deadline is ~5 weeks from generation date
