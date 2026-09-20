# n8n Workflow Specs — SparkAcademy Ecosystem
**Environment: krosebrook.app.n8n.cloud**
**Date: June 2, 2026**

---

## TL;DR

Four n8n workflows that wire the SparkAcademy ecosystem: (1) Scorecard → SparkAcademy auto-enrollment, (2) Course completion → certificate + consulting nudge, (3) Inactive user re-engagement, (4) New course publish notification. Plus one scheduled workflow for Memory Store sync.

---

## Prerequisites

**Credentials to configure in n8n:**
- Base44 API token (for SparkAcademy app)
- Base44 API token (for Scorecard app — may be same)
- Resend API key
- HubSpot OAuth (via MCP or direct)
- Anthropic API key (for certificate generation if used)

**Webhooks to enable in Base44:**
- Scorecard app: Lead.created
- SparkAcademy app: Enrollment.updated (specifically lesson_completed events)
- SparkAcademy app: Course.updated (content_status change)

**Email templates to upload to Resend:**
- welcome-email-1
- nudge-email-2
- stuck-points-email-3
- compound-effect-email-4
- next-steps-email-5
- completion-certificate-email
- re-engagement-email
- consulting-readiness-email
- new-course-notification

---

## Workflow 1: Scorecard → SparkAcademy Auto-Enrollment

**ID:** `ff-scorecard-to-spark`
**Trigger:** Webhook from Base44 Scorecard on Lead.created
**Purpose:** Route new leads to SparkAcademy with personalized course recommendations.

### Node sequence

```
1. [Webhook] receive Lead payload
   └─ URL: /webhook/scorecard/lead/created
   └─ Method: POST
   └─ Auth: Bearer token (Base44 webhook secret)

2. [Code] Validate payload
   └─ Required fields: email, scorecard_score, top_use_cases
   └─ If missing → respond 400 and stop

3. [Code] Run recommendation engine
   └─ Input: Lead data
   └─ Output: { recommended_path_id, priority_course_ids[], next_engagement }
   └─ Logic: mirror the recommendation-engine.md spec

4. [HTTP Request] Create SparkAcademy User
   └─ POST to Base44 SparkAcademy API
   └─ Endpoint: /api/v1/apps/69180d077a5cbed7242f90ab/entities/User
   └─ Body: { email, full_name, persona_slug, technical_level, ai_comfort }

5. [HTTP Request] Create Enrollment record
   └─ POST to Base44 SparkAcademy
   └─ Endpoint: /api/v1/apps/69180d077a5cbed7242f90ab/entities/Enrollment
   └─ Body: { student_email, course_id (first course of recommended path),
              enrollment_date, onboarding_path, status: "active" }

6. [Loop] For each priority_course_id (max 3):
   6a. [HTTP Request] Get course details (title, URL)
   6b. [HTTP Request] Store recommendation
        └─ POST to Base44: Lead entity update with recommendations field
        └─ OR: Create new RecommendationLog entity if Lead schema can't be extended

7. [HTTP Request] Send Welcome Email (Email 1)
   └─ POST to Resend API
   └─ Template: welcome-email-1
   └─ Variables: { first_name, path_name, course_name, course_url }

8. [HubSpot - via MCP] Create/update Contact
   └─ Action: upsert by email
   └─ Properties: { firstname, lastname, company, custom_score,
                    custom_persona, custom_path, lifecycle_stage: "lead" }

9. [HTTP Request] Log telemetry event
   └─ POST to Base44 SparkAcademy
   └─ Entity: TelemetryEvent
   └─ Body: { event_name: "learning.enrollment.created",
              layer: "learning", properties: {...} }

10. [Schedule] Queue follow-up emails
    └─ Email 2 in 24h, Email 3 in 5d, Email 4 in 10d, Email 5 in 21d
    └─ Use n8n "Wait" node OR external scheduler

11. [Respond to Webhook] return 200 OK with summary
```

### Error handling

- Each HTTP node: on failure, log error + continue (don't break entire flow)
- Critical failures (couldn't create User): retry 3x with exponential backoff
- After retries exhausted: send alert email to Kyle + log to error tracking
- Never silently swallow errors

### Test plan

- Submit test Scorecard with email kyle+test1@flashfusion.co
- Verify: SparkAcademy User created, Enrollment created, Welcome email received
- Verify: HubSpot contact has correct properties
- Verify: Telemetry event logged

---

## Workflow 2: Course Completion → Certificate + Consulting Nudge

**ID:** `ff-spark-completion-flow`
**Trigger:** Webhook from Base44 SparkAcademy on Enrollment.completion_percentage = 100
**Purpose:** Issue certificate, trigger appropriate next-step communication.

### Node sequence

```
1. [Webhook] receive Enrollment update
   └─ URL: /webhook/spark/enrollment/completed

2. [Code] Verify completion_percentage = 100 (filter out partial updates)
   └─ If < 100 → stop

3. [HTTP Request] Get Course details
   └─ Base44 SparkAcademy: GET Course by course_id

4. [HTTP Request] Get User profile
   └─ Base44: GET UserProfile + EmployeeProfile by email

5. [Code] Generate certificate metadata
   └─ cert_number: "FF-2026-" + random(6 digits)
   └─ completion_date: now
   └─ verification_code: random UUID

6. [HTTP Request] Create Certificate entity
   └─ Base44 SparkAcademy: POST Certificate
   └─ Body: { cert_number, course_id, course_title, student_email,
              student_name, completion_date, verification_code }

7. [HTTP Request] Generate certificate PDF
   └─ Option A: Anthropic API generates HTML → headless render to PDF
   └─ Option B: Static template + variable substitution
   └─ Output: PDF file uploaded to Base44 file storage
   └─ Update Certificate.certificate_url with PDF URL

8. [HTTP Request] Send Completion Email
   └─ Resend API
   └─ Template: completion-certificate-email
   └─ Variables: { first_name, course_name, certificate_url, next_path_link }
   └─ Attachment: PDF certificate

9. [HTTP Request] Count user's total completed courses
   └─ Base44: GET Enrollment where student_email = X AND completion_percentage = 100

10. [Switch] Branch on completion count:
    ├─ 1 course → no additional action
    ├─ 3 courses → send Consulting Readiness Email + update HubSpot
    │   └─ Template: consulting-readiness-email
    │   └─ Variables: { first_name, courses_completed, recommended_engagement }
    │   └─ HubSpot: lifecycle_stage = "marketing_qualified_lead"
    └─ 5+ courses → trigger Advanced Path Recommendation
        └─ Re-run recommendation engine with updated context
        └─ Send "ready for next path" email

11. [HubSpot - via MCP] Update Contact
    └─ Properties: { custom_completion_count, last_completion_date,
                     lifecycle_stage }

12. [HTTP Request] Log telemetry event
    └─ Event: "learning.course.completed"

13. [HTTP Request] Award badge if applicable
    └─ Check Badge criteria (courses_completed threshold)
    └─ Create UserBadge if earned
    └─ Optional: send badge-earned email

14. [Respond] 200 OK
```

### Edge cases

- User completes same course multiple times (re-enrollment): don't issue duplicate certificate; check existing Certificate records first
- User email changes between enrollment and completion: reconcile by user_id, not email
- PDF generation fails: store as text-only certificate; queue retry for PDF

---

## Workflow 3: Inactive User Re-engagement

**ID:** `ff-spark-reengagement`
**Trigger:** Scheduled — daily at 9:00 AM CT
**Purpose:** Detect inactive enrolled users and send re-engagement emails.

### Node sequence

```
1. [Schedule] Daily 9am CT trigger

2. [HTTP Request] Query inactive Enrollments
   └─ Base44 SparkAcademy: GET Enrollment WHERE
        last_activity_date < (now - 14 days)
        AND completion_percentage < 100
        AND status = "active"
   └─ Limit: 100 per run (paginate if more)

3. [Loop] For each inactive enrollment:

   3a. [HTTP Request] Get Course details
       └─ Course title, current lesson order

   3b. [HTTP Request] Get next unstarted Lesson
       └─ Find lowest lesson.order not in user's progress array

   3c. [Code] Check user's reengagement history
       └─ Has user received reengagement email in last 14 days? Skip.
       └─ Has user been inactive 30+ days? Use "final" template.

   3d. [HTTP Request] Send Re-engagement Email
       └─ Resend API
       └─ Template: re-engagement-email OR final-reengagement-email
       └─ Variables: { first_name, course_name, next_lesson_title,
                       deep_link_url }

   3e. [HubSpot - via MCP] Update Contact
       └─ Add tag: "at_risk_14d" OR "churned_30d"
       └─ Update last_engagement_email_date

   3f. [Code] If 30+ days inactive:
       └─ Set Enrollment.status = "inactive"
       └─ HubSpot lifecycle_stage = "churned"

4. [HTTP Request] Log telemetry
   └─ Event: "learning.reengagement.batch_completed"
   └─ Properties: { users_emailed, batch_size }

5. [End]
```

### Tuning parameters

- Inactivity threshold: 14 days (initial guess — A/B test 7d vs 14d vs 21d)
- Reengagement frequency: max 1 email per 14 days per user
- Churn threshold: 30 days

---

## Workflow 4: New Course Published Notification

**ID:** `ff-spark-new-course-notification`
**Trigger:** Webhook from Base44 SparkAcademy on Course.content_status changes to "published"
**Purpose:** Notify enrolled users that a new course is available in their path.

### Node sequence

```
1. [Webhook] receive Course update
   └─ URL: /webhook/spark/course/published

2. [Code] Verify content_status changed FROM something TO "published"
   └─ If first-time publish → continue
   └─ If re-publish (already was published) → stop (don't spam)

3. [HTTP Request] Get LearningPaths containing this course
   └─ Base44 SparkAcademy: GET LearningPath WHERE course_ids contains course_id

4. [Loop] For each matching LearningPath:

   4a. [HTTP Request] Get all Users enrolled in this path
       └─ Base44: GET Enrollment WHERE onboarding_path = path.onboarding_path
                  AND status = "active"

   4b. [Loop] For each enrolled user:
       └─ Send "new course in your path" email via Resend
       └─ Variables: { first_name, course_name, path_name, course_url }

5. [HTTP Request] Update API Memory Store
   └─ Add course to "recent_courses" list
   └─ Update sparkacademy_catalog.published_courses count

6. [HubSpot - via MCP] Tag affected contacts
   └─ Property: notified_about_new_course_<course_id> = true

7. [HTTP Request] Log telemetry
   └─ Event: "content.course.notification_sent"

8. [End]
```

### Rate limiting

- Limit to 50 notifications per minute (Resend default)
- Queue overflow if path has > 50 enrollees

---

## Workflow 5: Memory Store Nightly Sync (Scheduled)

**ID:** `ff-memory-store-sync`
**Trigger:** Scheduled — daily at 2:00 AM CT
**Purpose:** Keep API Memory Store entries current for FlashFusion agents.

### Node sequence

```
1. [Schedule] Daily 2am CT trigger

2. [HTTP Request] Query SparkAcademy stats
   └─ Base44: GET Course WHERE is_published = true (count + list)
   └─ Base44: GET Lesson (total count)
   └─ Base44: GET LearningPath WHERE is_published = true (count + list)

3. [HTTP Request] Get recent completions
   └─ Base44: GET Certificate ORDER BY completion_date DESC LIMIT 10

4. [HTTP Request] Get popular paths (by enrollment count this week)
   └─ Base44: GET Enrollment WHERE enrollment_date > (now - 7 days)
   └─ GROUP BY onboarding_path → count

5. [Code] Format memory store payload
   └─ Structure as YAML/JSON per architecture spec

6. [HTTP Request] Write to FlashFusion Agent Memory store
   └─ Endpoint: API Memory Store API
   └─ Key: "sparkacademy_catalog"
   └─ Value: formatted payload
   └─ Tags: ["sparkacademy", "auto-synced", current_date]

7. [HTTP Request] Log success
   └─ Telemetry: "memory.sync.completed"

8. [End]
```

---

## n8n Workflow JSON Skeleton

n8n workflows are stored as JSON. Here's the minimal skeleton for Workflow 1:

```json
{
  "name": "FF Scorecard to SparkAcademy",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "scorecard/lead/created",
        "responseMode": "responseNode"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300],
      "webhookId": "scorecard-to-spark"
    },
    {
      "parameters": {
        "functionCode": "const lead = $input.first().json;\nif (!lead.email || lead.scorecard_score === undefined) {\n  throw new Error('Missing required fields');\n}\nreturn { json: lead };"
      },
      "name": "Validate Payload",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [460, 300]
    }
    // ... additional nodes
  ],
  "connections": {
    "Webhook": { "main": [[{ "node": "Validate Payload", "type": "main", "index": 0 }]] }
    // ... additional connections
  }
}
```

**Note:** Full JSON for all 5 workflows would be ~2000 lines. Build them incrementally in n8n UI rather than importing JSON to allow visual debugging.

---

## Monitoring & Observability

### Metrics to track

- Workflow execution success rate (per workflow)
- Average execution time
- Email send success rate
- Base44 API error rate
- HubSpot sync lag

### Alert conditions

- Workflow fails 3 times in 1 hour → email Kyle
- Email send failure rate > 5% in 24h → email Kyle
- Base44 API timeout > 10s consistently → email Kyle
- HubSpot token expired → email Kyle (urgent)

### Where to set alerts

- n8n has built-in execution monitoring → enable error notifications
- Resend dashboard for email delivery
- HubSpot admin for token health
- Manual check: weekly Friday review of all workflow runs

---

## Cost Considerations

| Service | Pricing | Monthly Estimate |
|---|---|---|
| n8n Cloud | Free tier covers ~10K executions/month | $0 initially |
| Base44 API calls | Included in app subscription | $0 incremental |
| Resend | Free tier 100/day, $20/mo for 50K | $20/mo at scale |
| Anthropic API (certificates) | ~$0.003 per cert | Negligible |
| HubSpot | Free tier covers basic CRM | $0 initially |
| Cloudflare | Free | $0 |
| **Total** | | **~$20/mo** until scale |

n8n free tier may run out at ~100 enrollments/month if each triggers 3-5 workflows. Upgrade to Starter ($20/mo) at that point.

---

## Implementation Order

**Week 1:**
1. Set up Resend account, upload email templates
2. Build Workflow 1 (Scorecard → SparkAcademy)
3. Test end-to-end with kyle+test@flashfusion.co

**Week 2:**
4. Build Workflow 2 (Course Completion)
5. Build Workflow 5 (Memory Store Sync)

**Week 3:**
6. Build Workflow 3 (Re-engagement)
7. Build Workflow 4 (New Course Notification)

**Week 4:**
8. Add monitoring + alerts
9. Stress test with simulated traffic
10. Document runbook for failures

---

## Risks Block

| Risk | Mitigation |
|---|---|
| Webhook payload schema drift between Base44 versions | Validate payload structure at start of each workflow; alert on drift |
| Resend rate limits hit during enrollment spike | Implement queue node in n8n; spread sends |
| Recommendation engine logic embedded in workflow becomes hard to change | Externalize to a callable Cloudflare Worker or Anthropic API call; one source of truth |
| HubSpot custom property names misaligned across workflows | Document property names in single config doc; reference everywhere |
| Email sequence drift (templates updated but workflows reference old IDs) | Use Resend template versioning; pin versions in workflows |
| Loss of n8n credentials = loss of ecosystem | Export credential list (names only, not values) to backup vault |

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

**CLAIMS:**
- [SOURCED — Base44 schemas] All entity references (Lead, User, Enrollment, Course, Certificate, TelemetryEvent) verified against actual Base44 schemas as of Jun 2, 2026.
- [SOURCED — userMemories] n8n location `krosebrook.app.n8n.cloud`; portfolio workflow ID `JPSVa3cLtQPi8NKF` confirmed.
- [GENERATED] Cost estimates — n8n Cloud free tier, Resend $20/mo at scale — directional, not contract-verified.
- [GENERATED] "100 enrollments/month before n8n free tier exhausted" — math based on 5 workflow executions per enrollment; actual ratio unverified.

**! CONTRADICTION:** Workflow 5 (Memory Store Sync) writes to "FlashFusion Agent Memory" but I don't have direct confirmation that this memory store has a write API accessible from n8n. The store exists per memory, but API access pattern for external writes (vs. internal Claude reads) is undocumented. **Resolution required:** confirm Memory Store write endpoint before building Workflow 5.

---

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS

- **Base44 webhook reliability not measured.** Production-grade workflows need retry + dead-letter queue patterns.
- **No staging environment.** All testing happens in production. One bad workflow can spam every enrolled user.
- **Resend domain not warmed up.** New sender domain → initial deliverability < 80% to Gmail/Outlook. Plan: warm up via 50/day for 2 weeks before launch.
- **n8n version compatibility.** Workflow JSON may not be portable across n8n versions.
- **No load testing.** What happens at 100 concurrent webhook hits? 1,000? Unknown.
- **Authentication for webhooks.** Webhook URLs are HTTPS but need shared secret in headers — pattern not yet specified per app.
