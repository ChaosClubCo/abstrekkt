# AI Onboarding — Routing Logic Spec
**Abstrekkt · SparkAcademy**
Version 1.0 (Abstrekkt brand) | Implementation reference for the platform build

---

## Purpose

Defines the complete decision tree, user taxonomy, track assignments, and role-track stubs for the SparkAcademy AI onboarding system. This is the spec a platform owner or developer hands to whoever builds out the institution's instance.

SparkAcademy is Abstrekkt's AI literacy platform. The intake triage widget is its front door; this spec is the routing logic behind it.

---

## System Architecture

```
Entry Point
    │
    ├─ [Direct] → User knows their role → Track Index → Role Track Page
    │
    └─ [Unclear] → Intake Triage Widget
                          │
                    Segment + 3 questions answered
                          │
                    Route to: Track + Depth + 3 live-runnable prompts
                          │
                    Save to SparkAcademy → Role Track (30-day follow)
```

The widget now opens with a **segment selector** (workplace / education / career) before the three role/friction/experience questions. Segment determines which role set appears.

---

## Question 0: Segment

| Selection | Segment | Routes to role set |
|---|---|---|
| I'm in the workforce | `workplace` | 6 workplace roles |
| I'm in education | `education` | 5 education roles |
| I'm figuring it out | `career` | 2 career-transition profiles |

---

## Question 1: Role Taxonomy (by segment)

**Workplace** → `ops`, `comms`, `customer`, `analysis`, `technical`, `leadership`
**Education** → `student_higher_ed`, `teacher_k12`, `professor`, `edu_admin`, `instructional_designer`
**Career** → `retrained_pro`, `ai_first_builder`

Note: K-12 *students* are deliberately excluded (critical-thinking-development concern at that age). K-12 *teachers* are included.

---

## Question 2: Friction Taxonomy

Maps to a use-case emphasis. Determines which 3 prompts surface.

| Selection | Prompt Set Key suffix |
|---|---|
| Writing from scratch | `_writing` |
| Finding / summarizing info | `_research` |
| Repetitive tasks | `_repetitive` |
| Thinking through decisions | `_decisions` |
| Follow-up / documentation | `_meetings` |

---

## Question 3: Experience Depth

Adjusts result framing and the next-step CTA. Does NOT change the prompt set.

| Selection | Depth | ai_comfort |
|---|---|---|
| Starting fresh | `never` | 1 |
| Tried once or twice | `dabbled` | 2 |
| Use it occasionally | `regular` | 3 |

---

## Full Routing Matrix

65 routes (13 roles × 5 friction points). Each returns 3 live-runnable prompts. Full prompt library lives in the widget JS; this documents the routing so the platform can replicate or extend it.

```
WORKPLACE
  ops_{writing,research,repetitive,decisions,meetings}
  comms_{...}
  customer_{...}
  analysis_{...}
  technical_{...}
  leadership_{...}

EDUCATION
  student_higher_ed_{...}
  teacher_k12_{...}
  professor_{...}
  edu_admin_{...}
  instructional_designer_{...}

CAREER
  retrained_pro_{...}
  ai_first_builder_{...}
```

---

## SparkAcademy Data Model (provisioned)

These exist in SparkAcademy (Base44 app `69180d077a5cbed7242f90ab`) now:

**13 LearningPath records** — one per role, all published, each with `persona_slug` and `onboarding_path`.

**Schema enum values** — `UserProfile`, `OnboardingSession`, and `Enrollment` carry all 13 role-track `onboarding_path` values plus a `segment` field (`workplace` / `education` / `career`) and a `triage_answers` object.

**onboarding_path slugs by role:**
```
ops→role_ops          comms→role_comms       customer→role_customer
analysis→role_analysis technical→role_technical leadership→role_leadership
student_higher_ed→edu_student   teacher_k12→edu_teacher
professor→edu_professor          edu_admin→edu_admin
instructional_designer→edu_instructional_designer
retrained_pro→career_retrained   ai_first_builder→career_ai_first
```

---

## Role Track Pages — Stub Specs

Each track gets one SparkAcademy page. Sections each page should contain (prompts generated per institution based on their licensed tool):

### Every track page contains
1. **Your 3 best use cases** — the role's highest-leverage AI applications
2. **30-day prompt habit** — a week-by-week ramp
3. **Prompt library** — 12–15 prompts by use case (extend from the intake set)
4. **The discipline rule** — the one verification/quality rule that matters for this role
5. **What month 2 looks like** — teaser for intermediate content

### Per-track discipline rule (the section-4 anchor)
| Track | Discipline rule |
|---|---|
| Systems Thinker (ops) | Document the process before automating it |
| Communicator (comms) | Always edit output; never send raw AI copy |
| Relationship Builder (customer) | Add one sentence of real customer context to every prompt |
| Decision Maker (analysis) | Flag AI-generated numbers vs. sourced numbers |
| Builder (technical) | Review all code before deploying; AI makes confident errors |
| Strategic Operator (leadership) | AI helps you think; you still make the call |
| Curious Student | Use AI to understand, not to skip the understanding |
| Classroom Architect (teacher) | AI drafts; you own pedagogical judgment |
| Research Multiplier (professor) | Verify every citation; AI fabricates plausible ones |
| Institution Operator (edu_admin) | Compliance language gets human review, always |
| Learning Designer | Every AI-generated objective maps to a real outcome |
| Experienced Adapter (retrained) | AI augments your expertise; it does not replace your judgment |
| Self-Made Builder (ai_first) | Know what you don't know; verify the fundamentals |

---

## Platform Implementation Guide

### Minimum viable deployment (Week 1)
1. Publish the intake triage widget as a standalone page or iframe
2. Link it from the homepage / AI hub / onboarding checklist
3. Publish the onboarding path content (Doc 2)
4. Route the intake result to the content

No role-track pages required at launch — the widget routes dynamically.

### Full deployment (Month 1)
1. Build 13 role-track pages from the stub spec
2. Populate each prompt library (extend the intake set to 12–15)
3. Link intake result → matching LearningPath
4. Add track links to onboarding path Module 4

### Live-prompt infrastructure (production requirement)
The widget's live Claude call works inside a Claude artifact automatically. On a public host it requires a **server-side proxy** holding the API key — never client-side. Build a minimal Cloudflare Worker or Vercel function that forwards to `api.anthropic.com`. Add rate limiting; an open public endpoint is a cost vector.

### Platform options by effort
| Platform | Effort | Notes |
|---|---|---|
| SparkAcademy (native) | Low | Purpose-built; LearningPaths already provisioned |
| Notion | Low | Linked DB for tracks; embed widget |
| SharePoint (Modern) | Medium | Widget as iframe; pages per module/track |
| Confluence | Medium | Space with structured pages |
| LMS (any) | High | Full flow but course-authoring time |

---

## Maintenance Protocol

### Owner
Assign one named person. This system decays without an owner.

### Update triggers
| Trigger | Action |
|---|---|
| AI tool changes | Update `[TOOL NAME]`; revisit Module 1 analogy |
| New role added | Add a track; extend matrix with 5 prompt sets |
| Consistent confusion at Module X | Rewrite; add to Module 5 |
| 30-day usefulness low | Audit prompt library — likely too generic |
| Major model capability shift | Revisit Module 2 framing and the facts module stats |

### Do not constantly update
Prompting fundamentals are stable. Module 3 formula does not need quarterly rewrites.

---

## Success Criteria

| Metric | Target | Read |
|---|---|---|
| Intake completion | >60% of starters | Drop at Q0/Q1 = too complex; at Q3 = fatigue |
| Time to first use | <7 days | >14 → add a reminder touchpoint |
| 30-day usefulness | >70% of completers | One-question pulse: "Has AI saved you time?" |
| Track page visits | Proportional to role mix | Imbalance = routing/visibility problem |
| Prompt library return visits | Any return | Returners are converting to regular users |
| Live-prompt run rate | >50% of completers | The "watch it work" moment is the conversion event |

---

## Scope Notes

This is an Abstrekkt / SparkAcademy product capability, not a one-off client deliverable. The intake widget, content, and routing are the platform's onboarding layer across all three market segments (workplace, education, career).

Per the SparkAcademy GTM: workplace is consulting-led, education is institutional B2B, career-transition is consumer freemium — three entry points, one platform.

---

*Abstrekkt · SparkAcademy — AI literacy, tested under load.*
