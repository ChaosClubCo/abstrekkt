# SparkAcademy Course Recommendation Engine
**Maps AI Setup Audit Scorecard outputs → SparkAcademy course recommendations**
**Date: June 2, 2026**

---

## TL;DR

Three-layer recommendation: (1) primary path by scorecard score range, (2) priority courses by stated use cases, (3) governance gate based on org size and regulatory flags. Outputs: one recommended path + 2-3 priority courses + 1 next FlashFusion engagement.

---

## Architecture

```
FreeAssessment Submission
    │
    ▼
┌─────────────────────────────────────┐
│  INPUTS                              │
│  - scorecard_score (0-100)           │
│  - top_use_cases (array)             │
│  - org_size                          │
│  - persona_slug                      │
│  - industry                          │
│  - regulatory_flags (PII, PHI, etc.) │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  LAYER 1: Path by Score Range        │
│  Maps score → primary LearningPath   │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  LAYER 2: Priority Courses by Use    │
│  Cases (3 max)                       │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  LAYER 3: Governance Override        │
│  Adds compliance courses if flagged  │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  OUTPUT                              │
│  - 1 recommended path                │
│  - 2-3 priority courses              │
│  - Next FlashFusion engagement       │
└─────────────────────────────────────┘
```

---

## Layer 1: Path by Scorecard Score Range

| Score Range | AI Maturity | Recommended Path | Rationale |
|---|---|---|---|
| 0-20 | Pre-aware | Foundation: Zero to First Useful Output | Likely never seriously used AI. Start with fundamentals + safety. |
| 21-40 | Curious | Foundation (with skip for Lesson 1) | Used ChatGPT casually. Skip the "what is AI" intro, start at prompt engineering. |
| 41-60 | Adopting | Business Operator: AI for Revenue and Operations | Using AI but not strategically. Operations-focused path is highest impact. |
| 61-80 | Practicing | AI Leadership: From Skeptic to Champion Builder | Already a user; needs to drive adoption across team. |
| 81-100 | Advanced | Technical Practitioner: Power User to Architect | Power user. Path covers system prompts, automation, security. |

**Edge cases:**
- Score 0-20 + persona_slug = "compliance" → Governance & Compliance path (skip Foundation)
- Score 81-100 + org_size = "1" → Business Operator (solo doesn't need leadership content)

---

## Layer 2: Priority Courses by Use Cases

The scorecard captures `top_use_cases` as an array. Each use case maps to a specific course. Show up to 3 priority courses based on what the lead said they care about.

### Use Case → Course Mapping

| Use Case (from scorecard) | Priority Course |
|---|---|
| `content_creation` | AI-Powered Content Creation for Business |
| `customer_communication` | AI for Customer Support (B2C) or AI for Sales Teams (B2B) |
| `research_analysis` | AI for Research and Competitive Analysis |
| `operations_automation` | AI Workflow Automation |
| `team_training` | AI Literacy Program Design |
| `governance_policy` | AI Governance for Organizations |
| `hiring_hr` | AI for HR and People Teams |
| `data_security` | Data Privacy and AI |
| `prompt_writing` | Prompt Engineering Essentials OR Custom Instructions and System Prompts |
| `roi_measurement` | Measuring What AI Is Actually Doing for You |
| `service_business` | AI for Service Businesses |
| `small_business` | AI for Small Business Owners |
| `champion_program` | Building AI Champions in Your Organization |
| `architecture_design` | AI-Native System Architecture for Senior Engineers |
| `marketing_strategy` | AI Strategy for Senior Marketing Leaders |

**Tie-breaking:** If 4+ use cases selected, prioritize by: (1) match to current scorecard score range, (2) intermediate level over beginner if score > 40, (3) most recent course addition.

---

## Layer 3: Governance Override

If any of these regulatory flags are set on the Lead entity, ADD the corresponding course to recommendations (regardless of use cases):

| Regulatory Flag | Required Course |
|---|---|
| `handles_pii: true` | Data Privacy and AI |
| `handles_phi: true` | Data Privacy and AI + AI Governance for Organizations |
| `uses_ai_in_hiring: true` | AI for HR and People Teams |
| `employs_minors: true` | AI Governance for Organizations |
| `california_residents: true` | Data Privacy and AI |

These additions are ADDITIONAL to the 2-3 priority courses from Layer 2. They're flagged in the recommendation as "Required for your compliance profile."

---

## Layer 4: Next FlashFusion Engagement

Every recommendation ends with a single suggested next engagement, sized to the lead's stage:

| Scorecard Score | Engagement Recommendation |
|---|---|
| 0-40 | Free SparkAcademy enrollment → schedule discovery call after completing Foundation |
| 41-60 | AI Setup Audit ($4.5K) — they have enough AI use to audit |
| 61-80 | Enablement Sprint ($5K) — they need rollout structure, not basics |
| 81-100 + org_size 11+ | Managed Retainer ($2K/mo) or vCAIO discussion |

**Special cases:**
- `industry: financial` + score > 40 → Add note: "Regulatory complexity recommends starting with Audit, not self-service training."
- `org_size: 1` → Never recommend Managed Retainer. Cap at Enablement Sprint.

---

## Example Outputs

### Example 1: Small business owner, low score, content focus

**Inputs:**
- score: 18
- use_cases: ["content_creation", "customer_communication"]
- org_size: "2-10"
- persona_slug: "fusion"

**Output:**
- **Primary path:** Foundation: Zero to First Useful Output
- **Priority courses:** AI-Powered Content Creation for Business, AI for Customer Support
- **Next engagement:** Complete Foundation path → book free discovery call
- **Reason:** "You're early in AI adoption with a clear focus on content and customer communication. Start with Foundation to build a base, then jump to the two priority courses for immediate application."

---

### Example 2: Mid-sized B2B, intermediate score, operations focus

**Inputs:**
- score: 55
- use_cases: ["operations_automation", "roi_measurement", "team_training"]
- org_size: "51-200"
- persona_slug: "dept_manager"
- regulatory_flags: { handles_pii: true }

**Output:**
- **Primary path:** Business Operator: AI for Revenue and Operations
- **Priority courses:** AI Workflow Automation, Measuring What AI Is Actually Doing for You, AI Literacy Program Design
- **Required for compliance:** Data Privacy and AI
- **Next engagement:** AI Setup Audit ($4.5K) — your team is adopting AI; audit will identify highest-leverage interventions
- **Reason:** "You're at the operational adoption stage with team-level concerns. The Business Operator path gives strategic frame; priority courses match your three stated focuses. Data Privacy is required because you handle PII. An Audit is the right next step before scaling."

---

### Example 3: Senior engineer, advanced score, architecture focus

**Inputs:**
- score: 87
- use_cases: ["architecture_design", "data_security", "prompt_writing"]
- org_size: "200+"
- persona_slug: "it_admin"

**Output:**
- **Primary path:** Technical Practitioner: Power User to Architect
- **Priority courses:** AI-Native System Architecture for Senior Engineers, AI Security: Threats and Defenses, Custom Instructions and System Prompts
- **Next engagement:** vCAIO advisory conversation — your maturity level is past tactical training
- **Reason:** "You're operating at the architecture and security layer. Technical path is sequenced for power users; priority courses target your stated focus areas. At your maturity, training is reinforcement — vCAIO conversation explores how FlashFusion can advise your team."

---

## Base44 Implementation Notes

### Storing the recommendation logic

Two options:

**Option A — Hardcoded in app logic.** Pros: simple. Cons: requires deployment to update mappings.

**Option B — Stored as Base44 entity records.** Create new entity `RecommendationRule` with fields:
- `rule_type` (path, course, engagement, override)
- `condition` (JSON: score range, use case, regulatory flag)
- `action` (course_id or path_id to recommend)
- `priority` (number for tie-breaking)

Option B is more flexible but adds complexity. Recommend starting with Option A and migrating to B once mappings stabilize.

### Wiring the trigger

When a Lead record is created with `source: "scorecard"`:
1. Run the recommendation engine against the lead's data
2. Create a `CourseRecommendation` record (entity exists but is `_deprecated` — use a fresh entity or extend Lead with `recommendations` field)
3. Trigger the onboarding email sequence with personalized course links

### Personalized course URLs

Email 1 should link directly to `{{course_url}}` for the recommended first course, not generic catalog. Increases lesson 1 completion rate significantly.

---

## Risks Block

- **Cold-start problem:** Without conversion data, the score-to-path mapping is a best guess. Plan to A/B test mappings after first 100 enrollments.
- **Over-recommendation:** If a lead has 5 use cases, showing 5 courses dilutes focus. Hard cap at 3 priority courses.
- **Compliance liability:** Recommending "AI for HR" to someone who uses AI in hiring without legal review is a risk. Add disclaimer: "Compliance courses are educational; consult counsel for legal advice specific to your jurisdiction."
- **Use case definition drift:** If scorecard options change, mapping table breaks. Keep this doc versioned with scorecard.
- **Path completion bias:** Score-based path recommendations assume current state is fixed. Reality: someone with score 25 today may be 75 in six months. Re-survey at 90 days.

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

**CLAIMS:**
- [SOURCED — Base44 schema] Lead entity has fields: scorecard_score, top_use_cases, org_size, persona_slug, industry, can_spam_compliant, ccpa_consent.
- [SOURCED — Base44 schema] RegulatoryProfile entity supports flags: handles_pii, handles_phi, uses_ai_in_hiring, employs_minors, california_residents.
- [SOURCED — Base44 audit Jun 2] All 32 courses verified by ID; all 5 active LearningPaths verified.
- [GENERATED] Score-to-path mappings — modeled on AI maturity progression, not validated with real conversion data.
- [GENERATED] "Hard cap at 3 priority courses" — UX intuition, not measured.

**! CONTRADICTION:** Layer 1 recommends Foundation for scores 0-20, but a lead with score 18 who selected `architecture_design` as a use case would be misrouted. Layer 2 priority would point to Senior Engineer course (advanced), conflicting with Layer 1's beginner path. **Resolution rule:** Layer 1 path wins; Layer 2 courses adjusted to fit path level when conflict exists.

---

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS

- **No A/B test infrastructure yet.** Recommendation engine outputs can't be measured for conversion until enrollment data exists.
- **Use case taxonomy not finalized.** The 15 use cases listed in Layer 2 are my proposal — actual FreeAssessment scorecard may have different options. Verify against `audit.flashfusion.co` flow before implementation.
- **Persona slugs:** flash/fusion/int/hr_ld/it_admin/compliance/dept_manager/ai_champion are referenced in schema but not all are used in recommendations above. Need to map every persona to a default path.
- **No re-recommendation logic.** Recommendation runs once at enrollment. Real value comes from re-surveying at 90 days and routing to next-stage content. Not yet built.
- **Localization:** Recommendations are English-only and US-centric. International leads may need different defaults.
