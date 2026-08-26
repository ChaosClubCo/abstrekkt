# FlashFusion Ecosystem Architecture
**Date: June 2, 2026**
**Status: Authoritative integration spec for SparkAcademy, Scorecard, Fusion AI, and FF Consulting**

---

## TL;DR

Four-tier architecture: data sources (Base44 apps + Supabase + Memory Stores) → middleware (n8n + Anthropic API + Resend) → user-facing surfaces (subdomains) → outbound channels (social, newsletter). Identity is email-based across products. Lead flows: marketing → audit subdomain → recommendation → SparkAcademy enrollment → FF consulting conversion.

---

## System Map

```
                           ┌────────────────────────────────────┐
                           │  OUTBOUND CHANNELS                  │
                           │  LinkedIn · Newsletter · X · Email  │
                           └──────────────┬─────────────────────┘
                                          │ Traffic
                                          ▼
┌──────────────────────────────────────────────────────────────────────┐
│  USER-FACING SURFACES (flashfusion.co + subdomains)                   │
│                                                                       │
│  flashfusion.co          → Marketing + brand hub (in dev)            │
│  audit.flashfusion.co    → AI Setup Audit Scorecard (LIVE)           │
│  spark.flashfusion.co    → SparkAcademy catalog (PROPOSED)           │
│  client.flashfusion.co   → FF ops CRM (needs CNAME)                  │
│  mcp.flashfusion.co      → Multi-MCP hub (in dev)                    │
│  refactor.flashfusion.co → Code refactoring (LIVE)                   │
└────────────────┬─────────────────────┬──────────────────┬───────────┘
                 │                     │                  │
                 ▼                     ▼                  ▼
┌────────────────────────────────────────────────────────────────────┐
│  DATA SOURCES (state lives here)                                     │
│                                                                      │
│  Base44 AI Setup Audit Scorecard (69c440b10249984f1114bc4b)         │
│    └─ Lead, Scorecard responses, Product ($0/$1.5K/$4.5K)           │
│                                                                      │
│  Base44 SparkAcademy (69180d077a5cbed7242f90ab)                     │
│    └─ Course, Lesson, Enrollment, LearningPath, Certificate          │
│                                                                      │
│  Base44 Fusion AI (68dd8e79ca073475565c8e16) [closed beta]          │
│    └─ AI assistant chat state, user sessions                         │
│                                                                      │
│  Supabase: flashfusion + ascend-ai  ⚠ BILL OVERDUE                  │
│  HubSpot: CRM contacts, deals, companies                             │
│  API Memory Stores: FlashFusion Agent Memory + Kyle Personal         │
└────────────────┬─────────────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────────┐
│  INTEGRATION MIDDLEWARE                                              │
│                                                                      │
│  n8n (krosebrook.app.n8n.cloud) — workflow orchestration            │
│  Anthropic API — claude-sonnet-4-20250514                            │
│  Resend — transactional email                                        │
│  Stripe — payment processing  ⚠ BLOCKED on Supabase                  │
│  Cloudflare — DNS, subdomain routing                                 │
└────────────────────────────────────────────────────────────────────┘
```

---

## The Core User Journey

```
Marketing post (LinkedIn/Newsletter)
        │
        ▼
flashfusion.co (lands)
        │
        ▼
audit.flashfusion.co (takes AI Setup Audit Scorecard)
        │
        ▼
Base44 creates Lead entity {score, use_cases, persona, org_size, flags}
        │
        ▼
n8n webhook fires → recommendation engine runs
        │
        ▼
SparkAcademy: User created, path assigned, CourseRecommendation stored
        │
        ▼
Resend: Welcome email sent (Email 1 of 5-email sequence)
        │
        ▼
HubSpot: Contact created, tagged with score + persona + recommended path
        │
        ▼
User completes Foundation path (3 hrs)
        │
        ├─ Triggers completion certificate via Resend
        │
        ├─ Updates HubSpot: lifecycle_stage = "engaged"
        │
        └─ At 3+ completions OR Team tier interest → consulting nudge
                │
                ▼
        Discovery call → AI Setup Audit ($4.5K)
                │
                ▼
        Enablement Sprint ($5K)
                │
                ▼
        Managed Retainer ($2K/mo) OR vCAIO
```

---

## Identity Model (Phase 1 — Email-Based)

**Decision:** Email is the unique identifier across all systems for v1. No SSO required.

**Rationale:**
- Base44 has built-in User entity per app with email as primary key
- Email-based identity works for HubSpot, Resend, Stripe out of the box
- SSO (Clerk, Auth0, Supabase Auth) adds complexity not justified at current scale
- Migration path to SSO is clean — email becomes the merge key

**Cross-app reconciliation:**
- Same email in Scorecard Lead + SparkAcademy User + HubSpot Contact = same person
- n8n is the reconciliation layer (queries by email across apps)
- No central identity store needed until 1K+ users

**Phase 2 (deferred — 6+ months out):**
- Implement SSO via Clerk (recommended) or Auth0
- Unify Base44 Users across apps via single identity provider
- Trigger: when manual reconciliation overhead exceeds 2 hours/week OR when user reports broken cross-app experience

---

## Integration Patterns

### Pattern 1: Base44 → n8n (webhook trigger)

When a record is created or updated in Base44, fire webhook to n8n.

**Setup:**
- Base44: configure webhook in app settings on Lead/Enrollment/Course entities
- n8n: webhook trigger node listens at `/webhook/[app]/[entity]/[event]`
- Payload: full entity JSON

**Example use cases:**
- New Lead in Scorecard → trigger recommendation engine
- New Enrollment in SparkAcademy → trigger welcome email
- Course completion → trigger certificate + consulting nudge

### Pattern 2: n8n → Base44 (API write)

n8n calls Base44 REST API to create or update entities.

**Setup:**
- Base44 API token stored as n8n credential (NEVER in workflow JSON)
- HTTP Request node POST/PUT to Base44 API endpoint
- Entity-specific JSON body matching schema

**Example use cases:**
- Create CourseRecommendation after recommendation engine runs
- Update Enrollment.progress array on lesson completion
- Mark Lead.status = "converted" when consulting deal closes

### Pattern 3: n8n → Resend (email send)

n8n calls Resend API to send transactional emails.

**Setup:**
- Resend API key stored as n8n credential
- Email templates stored as n8n workflow variables OR Resend template IDs
- Variable substitution at send time

**Templates needed:**
- Email 1: Welcome (immediate)
- Email 2: Day 2 nudge
- Email 3: Day 5 stuck-points
- Email 4: Day 10 compound effect
- Email 5: Day 21 next path / consulting bridge
- Completion certificate email
- Re-engagement email (inactive 14 days)
- Consulting readiness email (3+ completions)

### Pattern 4: n8n → HubSpot (CRM sync)

n8n updates HubSpot contacts and deals via HubSpot MCP or direct API.

**Setup:**
- HubSpot MCP connection at mcp.hubspot.com/anthropic (use existing connector)
- OR HubSpot API key as n8n credential (fallback)
- Map: Base44 Lead → HubSpot Contact, Base44 Enrollment → HubSpot Deal stage

**Field mappings:**
| Base44 Field | HubSpot Field |
|---|---|
| Lead.email | Contact.email |
| Lead.full_name | Contact.firstname + lastname |
| Lead.company | Contact.company |
| Lead.scorecard_score | Contact.custom_score (custom property) |
| Lead.persona_slug | Contact.persona (custom property) |
| Lead.industry | Contact.industry |
| Enrollment.completion_percentage | Deal.custom_completion |
| Course completion count | Contact.lifecycle_stage (engaged → opportunity) |

### Pattern 5: Base44 → API Memory Store (scheduled sync)

FlashFusion Agent Memory should know SparkAcademy state so Fusion AI and other agents can reference it.

**Setup:**
- n8n scheduled workflow runs nightly at 2am CT
- Queries Base44 SparkAcademy for: course count, path list, enrollment count, recent completions
- Writes summary to API Memory Store as structured facts

**Memory store entries needed:**
- "SparkAcademy current catalog: X courses, Y lessons, Z paths"
- "Most popular SparkAcademy path this week: [path name]"
- "Active SparkAcademy enrollments: [count]"
- "Recently completed courses: [list of last 10]"

---

## Subdomain + DNS Plan

| Subdomain | Purpose | Hosting | DNS | Status |
|---|---|---|---|---|
| flashfusion.co | Marketing hub | Vercel (proposed) | Cloudflare A record | In dev |
| audit.flashfusion.co | Scorecard | Base44 (onrender.com) | Cloudflare CNAME | LIVE |
| spark.flashfusion.co | SparkAcademy | Base44 OR Vercel (static catalog) | Cloudflare CNAME | PROPOSED |
| client.flashfusion.co | FF ops CRM | Base44 | Cloudflare CNAME | Needs config |
| mcp.flashfusion.co | Multi-MCP hub | Vercel | Cloudflare CNAME | In dev |
| refactor.flashfusion.co | Code refactor | Vercel | Cloudflare CNAME | LIVE |

**Recommendation: `spark.flashfusion.co`** (shorter than sparkacademy.flashfusion.co, easier to remember and type)

**Hosting decision for SparkAcademy:**
- **Option A:** Base44 hosts the entire SparkAcademy app (course UI, lesson player, enrollment, progress) → spark.flashfusion.co CNAMEs to Base44
- **Option B:** Vercel hosts static catalog (the HTML built in last session) → spark.flashfusion.co CNAMEs to Vercel; Base44 still backs data via API
- **Recommendation:** Start with Option B (faster to ship, no Supabase dependency, full brand control). Migrate to Option A only if Base44's hosted UI is preferred.

---

## Data Flow Specifications

### Flow 1: New Lead from Scorecard

```
1. User completes audit.flashfusion.co Scorecard
2. Base44 creates Lead entity in Scorecard app
3. Base44 webhook → n8n endpoint /webhook/scorecard/lead/created
4. n8n receives Lead payload
5. n8n runs recommendation engine logic (in workflow):
   a. Determines path based on score range
   b. Maps use_cases to priority courses
   c. Applies governance overrides
6. n8n writes to Base44 SparkAcademy:
   - User entity (email, name)
   - Enrollment entity (path_id, status = "active")
   - CourseRecommendation entities (one per priority course)
7. n8n triggers Resend Email 1 (Welcome) with personalized course URL
8. n8n creates/updates HubSpot Contact with score + persona + path
9. n8n logs telemetry event "lead.routed" in Base44 TelemetryEvent
```

### Flow 2: Course Completion

```
1. User completes final lesson in a course (Base44 SparkAcademy)
2. Base44 webhook → n8n /webhook/spark/enrollment/lesson_completed
3. n8n checks if completion = 100%
4. If yes:
   a. Create Certificate entity in Base44 SparkAcademy
   b. Generate PDF certificate (Anthropic API or static template + variable substitution)
   c. Upload PDF to Base44 file storage
   d. Send completion email via Resend with certificate URL
   e. Increment user's lifetime course count
5. Check total completed courses for user:
   - 1 course → no action
   - 3 courses → trigger consulting readiness email + update HubSpot lifecycle
   - 5 courses → trigger advanced path recommendation
6. Update HubSpot Contact with completion data
```

### Flow 3: Inactive User Re-engagement

```
1. n8n scheduled workflow runs daily at 9am CT
2. Query Base44 SparkAcademy: Enrollments where last_activity_date > 14 days AND completion < 100%
3. For each inactive enrollment:
   a. Get user's last completed lesson
   b. Identify next lesson in their path
   c. Send re-engagement email with deep link to next lesson
   d. Update HubSpot Contact: tag = "at_risk"
4. If user has been inactive 30+ days:
   a. Send final email with content gap survey
   b. Update HubSpot lifecycle_stage = "churned"
```

### Flow 4: New Course Published Notification

```
1. Course content_status changes to "published" in Base44
2. Base44 webhook → n8n /webhook/spark/course/published
3. n8n gets course details (title, track, level, path_ids)
4. n8n queries Base44 for all Users enrolled in LearningPaths containing this course
5. For each matching user:
   a. Send "new course in your path" email
   b. Add course to their recommended next lesson queue
6. n8n updates API Memory Store with new course entry
```

---

## API Memory Store Sync Strategy

**Why this matters:** Fusion AI (closed beta) needs to know SparkAcademy state to recommend courses to users in chat. Without sync, Fusion AI is blind to the catalog.

**Sync workflow (nightly, 2am CT):**
- Query SparkAcademy for: published courses, active paths, recent enrollments (count only, no PII)
- Format as structured memory entries
- Write to "FlashFusion Agent Memory" store
- Tag entries with date for staleness detection

**Memory entry structure:**
```yaml
sparkacademy_catalog:
  last_updated: "2026-06-02T02:00:00Z"
  total_courses: 32
  published_courses: 30
  total_lessons: 125
  active_paths: 5
  paths:
    - name: "Foundation: Zero to First Useful Output"
      courses: 5
      duration_hours: 3
    - name: "Business Operator: AI for Revenue and Operations"
      courses: 5
      duration_hours: 3
    # ... etc
  most_recent_courses:
    - "Building AI Champions in Your Organization"
    - "AI for Project Management and Team Coordination"
    # ... etc
```

**What agents do with this:**
- Fusion AI: "Based on what you described, I'd recommend the 'AI for Service Businesses' course in SparkAcademy"
- Sales agents: route prospects to relevant course based on conversation
- Internal Kyle agent: knows what content exists when planning new content

---

## Security & Privacy

### Auth & Access Control

- Base44 RLS (Row-Level Security) handles per-user data isolation within each app
- Cross-app access (e.g., SparkAcademy User reading their Scorecard Lead) NOT supported without code-level integration
- n8n holds privileged API credentials — workflows must NEVER expose API keys in webhook responses

### PII Handling

- Lead entity in Scorecard collects: email, name, company, industry → PII
- Enrollment in SparkAcademy: email, name, progress → PII
- Cross-system PII flow: explicit consent required at Scorecard submission
- CCPA: scorecard.ccpa_consent field must be true before storing for California residents
- CAN-SPAM: scorecard.can_spam_compliant must be true before email enrollment

### Audit Trail

- Base44 AuditLog entity captures: create, update, delete on key entities
- n8n workflow execution logs preserved 30 days
- Email send logs in Resend dashboard

### Data Residency

- Base44: US (verify with vendor)
- Supabase: US East (Virginia) — currently inaccessible (bill overdue)
- Resend: US
- HubSpot: configurable, default US
- Anthropic API: US

---

## Dependency Graph

| Component | Depends On | Blocked By |
|---|---|---|
| SparkAcademy public access | spark.flashfusion.co DNS | None |
| Scorecard → SparkAcademy auto-enrollment | n8n workflow | n8n implementation |
| Email sequence | Resend account + templates | Templates exist (markdown), need to upload to Resend |
| Stripe payments | Supabase | ⚠ Bill overdue |
| HubSpot sync | HubSpot MCP connection | Already connected |
| Memory store sync | API Memory Store + n8n schedule | API Memory Store exists |
| Fusion AI integration | Memory store sync working | Fusion AI is closed beta |
| flashfusion.co marketing hub | Site build | Not started |

---

## Ownership Matrix

| System | Primary Owner | Backup | Status |
|---|---|---|---|
| Base44 apps (all) | Kyle | None | Single-owner risk |
| n8n workflows | Kyle | None | Single-owner risk |
| Cloudflare DNS | Kyle | None | Single-owner risk |
| HubSpot | Kyle | None | Single-owner risk |
| Resend | Kyle | None | Single-owner risk |
| Supabase | Kyle | None | ⚠ Bill overdue + single-owner |
| HeyGen | Kyle | None | Single-owner risk |

**Single-owner risk:** Every system is owned by Kyle. If Kyle is unavailable, the ecosystem has no operational continuity. **Recommended:** Document credential access for one trusted person (Lafu as technical co-founder when formalized) and store in 1Password/Bitwarden shared vault.

---

## Risks Block

| Risk | Severity | Mitigation |
|---|---|---|
| Supabase bill blocks Stripe + Continuum | High | Pay bill immediately; non-negotiable |
| n8n workflow failures silent | Medium | Add error handler nodes; route failures to Slack/email |
| Base44 webhooks unreliable | Medium | Add retry logic in n8n; fall back to scheduled polling |
| HubSpot MCP token expires | Medium | Document re-authorization process; check token monthly |
| Email deliverability (spam filters) | Medium | SPF/DKIM/DMARC properly configured on flashfusion.co; warm up Resend domain |
| Single-owner operational risk | High | Document credential vault; designate backup access for Lafu when formalized |
| Data PII flow without explicit consent | High | Enforce can_spam_compliant + ccpa_consent at Scorecard submission |
| Cross-app data drift (same email, different records) | Medium | n8n reconciliation workflow weekly to flag mismatches |

---

## Implementation Priority

### Phase 3a — Wire the critical path (Next 2 weeks)

1. Set up `spark.flashfusion.co` CNAME in Cloudflare
2. Deploy SparkAcademy catalog HTML to Vercel
3. Build n8n Workflow 1 (Scorecard → SparkAcademy auto-enrollment)
4. Upload 5-email sequence to Resend
5. Configure HubSpot custom properties (score, persona, path)
6. Test end-to-end: Scorecard submission → Email 1 sent → HubSpot updated

### Phase 3b — Engagement loops (Weeks 3-4)

1. Build n8n Workflow 2 (Course completion → certificate + nudge)
2. Build n8n Workflow 3 (Inactive re-engagement)
3. Build n8n Workflow 4 (New course notification)
4. Configure Memory Store sync workflow

### Phase 4 — Monetization (Blocked on Supabase)

1. Pay Supabase bill ← critical unblock
2. Set up Stripe products (Free / Pro / Team)
3. Wire Stripe checkout into SparkAcademy
4. Implement Pro paywall logic
5. Build Team admin dashboard

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

**CLAIMS:**
- [SOURCED — userMemories] Base44 apps: SparkAcademy (`69180d077a5cbed7242f90ab`), AI Setup Audit Scorecard (`69c440b10249984f1114bc4b`), Fusion AI (`68dd8e79ca073475565c8e16`).
- [SOURCED — userMemories] n8n at `krosebrook.app.n8n.cloud`; Portfolio Command Center workflow `JPSVa3cLtQPi8NKF`.
- [SOURCED — userMemories] Supabase bill overdue; blocks Stripe and Continuum.
- [SOURCED — Base44 audit Jun 2] SparkAcademy current state: 32 courses, 125 lessons, 5 active paths.
- [GENERATED] "Single-owner operational risk" — observed pattern, not measured downtime.
- [GENERATED] Memory Store sync nightly at 2am CT — operational recommendation, not based on actual access patterns.

**COUNTEREXAMPLES:**
- Identity model: email-based could break if a single user has multiple emails (work + personal). Counter: Phase 2 SSO addresses this; not blocking at current scale.
- "Hosting decision Option B (Vercel)": assumes static catalog is sufficient. Reality: enrollment + progress tracking requires Base44 backend either way. The decision is only about catalog browsing, not full UX.

**! CONTRADICTION:** Recommendation engine doc says CourseRecommendation entity is `_deprecated` in Base44, but this architecture relies on creating CourseRecommendation records. Either un-deprecate the entity, OR extend Lead entity with `recommendations` JSON field, OR create a new entity (`Recommendation_v2`). Decision needed.

---

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS

- **No backup credentials documented anywhere.** If Kyle's primary device is lost or compromised, ecosystem access is lost.
- **No SLA defined for any system.** What's an acceptable downtime for SparkAcademy? Scorecard? Fusion AI? Unanswered.
- **Webhook reliability unknown.** Base44 webhook delivery guarantees not documented.
- **HubSpot MCP token rotation policy not set.** Token could silently expire.
- **No monitoring/alerting beyond manual checks.** If n8n workflow fails at 3am, Kyle finds out when something else breaks.
- **GDPR not assessed.** Architecture assumes US-only audience; first EU enrollment will require GDPR Article 30 record + DPA review.
- **Disaster recovery has no plan.** If Base44 has an extended outage, no fallback for active enrollments.
