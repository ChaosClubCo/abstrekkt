# SPARKACADEMY ROADMAP
**Last updated: June 2, 2026**
**Owner:** Kyle Rosebrook / FlashFusion

---

## Current State Summary

SparkAcademy is content-complete for Phase 1. 32 courses, 86 lessons, 5 learning paths, 23 HeyGen scripts ready for recording. No live students. No enrollment flow. No payment integration.

---

## Phase 1: Content Foundation ✅ COMPLETE

| Deliverable | Status |
|---|---|
| 20 published courses with lessons | ✅ |
| 10 new draft courses with lessons | ✅ |
| 5 structured LearningPaths | ✅ |
| 6-track taxonomy | ✅ |
| HeyGen script library (23 scripts) | ✅ |
| Base44 audit + data integrity fixes | ✅ |
| Deprecated entities flagged | ✅ |
| 16 broken LearningPaths unpublished | ✅ |

---

## Phase 2: Content Polish + Recording — TARGET: June 2026

**Goal:** Publish the 10 draft courses. Record all HeyGen videos. Create visual assets.

| Task | Priority | Est. Effort | Dependency |
|---|---|---|---|
| Record 23 HeyGen videos (batch by avatar) | P0 | 3-4 hours | HeyGen Pro account active |
| Review + publish 10 draft courses | P0 | ✅ DONE | Published Jun 2 |
| Create course thumbnails / title cards | P1 | 2 hours | Brand tokens (FF void/violet) |
| Set CTA destination URLs in scripts | P1 | 30 min | flashfusion.co live |
| Assign "Link below" URLs to each video | P1 | 30 min | Course URLs known |
| Build lessons for 13 published courses with phantom counts | P2 | ✅ DONE | 39 lessons created Jun 2 |
| Assign category+track to 2 legacy drafts | P2 | ✅ DONE | Python=technical, Workplace=foundational |

**HeyGen recording batch plan:**
1. Avatar #1 batch (warm): Platform welcome + all 22 course intros → ~25 videos, ~15 min total render
2. Avatar #4 batch (professional): FF intro (3 cuts) + Opus 4.7 (2 cuts) → 5 videos, ~5 min total render

---

## Phase 3: Distribution + Access — TARGET: July 2026

**Goal:** Make SparkAcademy accessible to real humans. First enrollments.

| Task | Priority | Est. Effort | Dependency |
|---|---|---|---|
| Build public course catalog page on flashfusion.co | P0 | 4-6 hours | flashfusion.co live |
| Embed HeyGen welcome video on landing page | P0 | 30 min | Video recorded |
| Set up enrollment flow (free tier) | P0 | 2-3 hours | Auth decision (Base44 built-in vs. external) |
| Create onboarding email sequence (Resend) | P1 | 2 hours | Email templates |
| Wire FreeAssessment → SparkAcademy course recommendation | P1 | 2 hours | audit.flashfusion.co functional |
| Connect SparkAcademy to FlashFusion consulting pipeline | P1 | 1 hour | Scorecard → course → consult upsell path |
| Announce on LinkedIn + newsletter | P1 | 1 hour | Content live |

**GTM lanes (3-lane strategy from memory):**
1. Consumer freemium — free Foundation path, paid Application + Systems
2. Institutional B2B — org licenses, team dashboards, compliance reporting (NO K-12)
3. Consulting-led workplace — FlashFusion clients get SparkAcademy as part of engagement

---

## Phase 4: Monetization — TARGET: August-September 2026

**Goal:** Revenue from SparkAcademy as standalone product.

| Task | Priority | Est. Effort | Dependency |
|---|---|---|---|
| Pricing structure: free / pro / team tiers | P0 | Decision | Revenue modeling |
| Stripe integration for paid courses | P0 | 4-6 hours | Stripe account, Supabase bill resolved |
| Certificate generation (PDF) | P1 | 3-4 hours | Certificate entity schema already exists |
| Pro course gating (paywall on Application + Systems tiers) | P1 | 2-3 hours | Stripe integration |
| Team/org enrollment for B2B clients | P2 | 4-6 hours | Organization entity already built |
| Pilot with first FlashFusion client | P0 | 1-2 hours | Chris Butler or next engagement |

---

## Phase 5: Scale + Engagement — TARGET: Q4 2026

| Task | Priority | Notes |
|---|---|---|
| Analytics dashboard (CourseAnalytics entity exists) | P1 | Completion rates, drop-off, engagement |
| AI tutor / Prompt Playground lab integration | P2 | LabSession entity exists |
| Discussion forums per course | P2 | CourseDiscussion entity exists |
| Badge/gamification system | P3 | Badge + UserBadge entities exist |
| AdoptionHealth scoring for B2B | P2 | Entity exists, needs computation layer |
| Content review cadence (90-day cycle) | P1 | `review_cadence_days` field on Course |

---

## Blockers + Dependencies

| Blocker | Impact | Resolution Path |
|---|---|---|
| Supabase bill overdue | Blocks Stripe integration, any Supabase-dependent feature | Pay bill |
| flashfusion.co not live | Blocks public catalog, CTA URLs, Lee Chong Ming pitch | Ship site |
| HeyGen videos not recorded | Blocks video embeds on course pages | Record batch (3-4 hours) |
| No live students | Can't validate enrollment flow, completion tracking, certificates | Phase 3 launch |
| 25 deprecated schemas | Schema bloat, confusion for future dev | Archive when Base44 supports it |

---

## Decisions Needed

1. **Auth model:** Base44 built-in auth vs. external (Supabase Auth, Clerk, etc.)? Base44 has User entity + RLS built in — may be sufficient for MVP.
2. **Pricing tiers:** What's free vs. paid? Recommendation: Foundation path free, everything else $29/mo or per-course.
3. **Hosting:** SparkAcademy as Base44 app vs. custom Next.js frontend pulling from Base44 API? Base44 is faster to ship; custom gives full brand control.
4. **Legacy drafts:** Publish, archive, or delete Python for Beginners and AI in the Workplace? Both have full lesson content but don't fit current FlashFusion positioning.
5. **B2B pilot:** Which FlashFusion client gets SparkAcademy first? Chris Butler is the natural candidate if permission granted.

---

## Metrics to Track (once live)

- Enrollment count (total + per course + per path)
- Completion rate by course
- Time-to-first-lesson after enrollment
- Drop-off point per course (which lesson loses people)
- Free → paid conversion rate
- NPS or course rating (CourseFeedback entity exists)
- B2B: team completion rate, adoption health score
