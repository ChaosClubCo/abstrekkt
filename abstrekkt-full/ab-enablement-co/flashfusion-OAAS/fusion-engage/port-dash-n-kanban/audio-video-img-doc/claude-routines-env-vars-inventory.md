# Claude Routines — Environment Variables Inventory
**Project:** Claude Ecosystem Mastery / INT Inc. Enablement Platform  
**Generated:** 2026-05-08  
**Scope:** All env vars referenced across 20 routine definitions

Set these before activating any routine. Variables marked **CRITICAL** will cause the routine to fail silently or expose sensitive data if misconfigured.

---

## SUMMARY COUNTS

| Category | Count |
|----------|-------|
| Notion database IDs | 7 |
| Slack channels | 4 |
| Supabase credentials | 2 |
| HubSpot config | 2 |
| Gmail / email | 2 |
| Google Calendar | 1 |
| n8n | 0 (connection via MCP URL — no separate env var) |
| General config | 2 |
| **TOTAL UNIQUE VARS** | **20** |

---

## NOTION DATABASE IDs

These are all Notion database UUIDs. Get them from the database URL in Notion: `notion.so/[workspace]/[DATABASE_UUID]?v=...`

| Variable | Type | Required | Description | Used By |
|----------|------|----------|-------------|---------|
| `NOTION_ENABLEMENT_DB_ID` | UUID string | Required | Master enablement database containing IntakeRecord, OutcomeRecord, and CheckinRecord pages. This is the primary program database. | CRON #5, CRON #6, CRON #7, API #6 |
| `NOTION_CHECKINS_DB_ID` | UUID string | Required | Dedicated check-in records database. May be a separate database or a filtered view of NOTION_ENABLEMENT_DB_ID. | API #1, API #7 |
| `NOTION_INTAKE_DB_ID` | UUID string | Required | Intake form records database. May be a separate database or a filtered view. | API #7 |
| `NOTION_OUTCOMES_DB_ID` | UUID string | Required | Session outcome records database. | API #7 |
| `NOTION_PROMPT_PACKAGES_DB_ID` | UUID string | Required | Prompt packages database where generated prompt packages are saved, one page per employee. | API #5 |
| `NOTION_ACADEMY_DB_ID` | UUID string | Required | Anthropic Academy certification progress database. Fields: course_id, course_name, status, completed_date, certificate_url, notes. Must be created manually if not yet built. | CRON #9 |
| `NOTION_REPORTS_DB_ID` | UUID string | Required if using output_format=notion in cohort report | Ad-hoc cohort report storage database. | API #6 |
| `NOTION_OBJECTIONS_DB_ID` | UUID string | Required | Escalated objection log database. Fields: employeeName, role, objectionText, escalationType, sessionDate, facilitatorNote, createdAt, status. | API #9 |

**Note:** NOTION_CHECKINS_DB_ID, NOTION_INTAKE_DB_ID, and NOTION_OUTCOMES_DB_ID may all point to the same database as NOTION_ENABLEMENT_DB_ID if you're using a single consolidated database with record_type as a property. Confirm your Notion structure before setting.

---

## SLACK CHANNELS

All values should be Slack channel IDs (format: `C0XXXXXXXXX`), not channel names. Get the ID by right-clicking a channel in Slack → View channel details → Copy channel ID.

| Variable | Type | Required | Description | Used By |
|----------|------|----------|-------------|---------|
| `SLACK_FACILITATOR_CHANNEL` | Slack channel ID | Required | Channel where facilitator alerts are posted (check-in alerts, stale session flags, policy objection escalations). Typically a private facilitator channel. | API #1, API #9 |
| `SLACK_TECH_CHANNEL` | Slack channel ID | Required | Channel for technical escalations and model audit notifications. Typically #dev-alerts or equivalent. | API #3, API #9 |
| `SLACK_ENABLEMENT_CHANNEL` | Slack channel ID | Required | Channel for public-facing program milestones (streak recognition posts). Can be a team-wide channel where recognition is appropriate. | API #10 |
| `SLACK_DEV_CHANNEL` | Slack channel ID | Optional | Fallback channel for dev-facing notifications when no explicit channel is provided. Defaults to this if slack_channel not specified in API #3 payload. | API #3 |

---

## SUPABASE CREDENTIALS

**CRITICAL — Server-side only.** The service role key bypasses Row Level Security. Never expose in client-side code, browser context, or any artifact that runs in user browsers.

| Variable | Type | Required | Description | Used By |
|----------|------|----------|-------------|---------|
| `SUPABASE_PROJECT_REF` | String (e.g., `abcdefghijklmnop`) | Required | Supabase project reference ID. Found in Supabase dashboard → Project Settings → General → Reference ID. Used to connect to the HumanX Assess database. | CRON #8 |
| `SUPABASE_SERVICE_ROLE_KEY` | JWT string | **CRITICAL** | Service role key for server-side Supabase access. Bypasses RLS. Must run in a server-side execution context only. Found in Supabase dashboard → Project Settings → API → service_role (secret). | CRON #8 |

---

## HUBSPOT CONFIGURATION

| Variable | Type | Required | Description | Used By |
|----------|------|----------|-------------|---------|
| `HUBSPOT_NURTURE_LIST_ID` | Numeric string | Required | HubSpot contact list ID for Tier 2 (nurture) leads from HumanX assessments. Create a static list in HubSpot and copy the list ID from the URL. | API #4 |
| `HUBSPOT_PORTAL_ID` | Numeric string | Optional | HubSpot portal (account) ID. May be required by HubSpot MCP for scoping — check connector docs. | CRON #8 |

---

## EMAIL CONFIGURATION

| Variable | Type | Required | Description | Used By |
|----------|------|----------|-------------|---------|
| `GMAIL_SENDER_ADDRESS` | Email string | Required | Authenticated Gmail address used to send check-in nudge emails. Must be the address connected via the Gmail MCP connector. | CRON #6 |
| `FACILITATOR_EMAIL` | Email string | Required | Email address of the program facilitator. Receives session follow-up drafts and stale session alerts. | CRON #7 |

---

## GOOGLE CALENDAR

| Variable | Type | Required | Description | Used By |
|----------|------|----------|-------------|---------|
| `GOOGLE_CALENDAR_ID` | String or "primary" | Optional | Target Google Calendar for session scheduling. Defaults to "primary" (the authenticated user's main calendar) if not set. Set to a specific calendar ID to route sessions to a dedicated enablement calendar. Get the ID from Google Calendar → Settings → [Calendar name] → Integrate Calendar → Calendar ID. | API #2 |

---

## GENERAL CONFIGURATION

| Variable | Type | Required | Description | Used By |
|----------|------|----------|-------------|---------|
| `PROGRAM_FACILITATOR_NAME` | String | Required | Display name used as the email signature in streak recognition emails. E.g., "Kyle Rosebrook" or "The INT AI Team". | API #10 |
| `OUTREACH_SENDER_NAME` | String | Required | Display name used in HumanX lead follow-up emails to Tier 3 contacts. Must correspond to a monitored inbox with a real reply flow. | API #4 |
| `POLICY_OWNER` | Slack User ID | Required | Slack user ID of the person responsible for AI policy questions (format: `@U01XXXXXXXX`). Used in budget and policy objection escalations. **Must be a Slack user ID, not a display name.** | API #9 |

---

## SETUP SEQUENCE

Deploy env vars in this order to minimize dependency issues:

1. **Notion IDs first** (no credential risk, just UUIDs)
   - NOTION_ENABLEMENT_DB_ID
   - NOTION_CHECKINS_DB_ID, NOTION_INTAKE_DB_ID, NOTION_OUTCOMES_DB_ID
   - NOTION_PROMPT_PACKAGES_DB_ID
   - NOTION_ACADEMY_DB_ID
   - NOTION_REPORTS_DB_ID
   - NOTION_OBJECTIONS_DB_ID

2. **Slack channels** (non-sensitive, lookup from Slack)
   - SLACK_FACILITATOR_CHANNEL
   - SLACK_TECH_CHANNEL
   - SLACK_ENABLEMENT_CHANNEL
   - SLACK_DEV_CHANNEL

3. **Email + calendar** (require authenticated connector)
   - GMAIL_SENDER_ADDRESS
   - FACILITATOR_EMAIL
   - GOOGLE_CALENDAR_ID

4. **General config** (human-readable strings)
   - PROGRAM_FACILITATOR_NAME
   - OUTREACH_SENDER_NAME
   - POLICY_OWNER

5. **Supabase LAST** (highest-sensitivity credentials)
   - SUPABASE_PROJECT_REF
   - SUPABASE_SERVICE_ROLE_KEY ← CRITICAL: server-side only

6. **HubSpot**
   - HUBSPOT_NURTURE_LIST_ID
   - HUBSPOT_PORTAL_ID

---

## ROUTINES THAT REQUIRE NO ENV VARS

These routines use only MCP connectors with no additional configuration:

| Routine | Reason |
|---------|--------|
| CRON #1 — Sentry Error Triage | Sentry MCP handles auth; no env vars needed |
| CRON #2 — Vercel Deployment Health | Vercel MCP handles auth |
| CRON #3 — Deprecated Model Watchdog | Web search only |
| CRON #4 — PostHog Analytics Digest | PostHog MCP handles auth |
| CRON #10 — n8n Workflow Health | n8n MCP URL is hardcoded to krosebrook instance |

These five can be activated immediately after confirming their MCP connectors are live.
