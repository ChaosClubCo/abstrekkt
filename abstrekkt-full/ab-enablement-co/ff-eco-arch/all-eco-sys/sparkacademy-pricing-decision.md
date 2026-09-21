# SparkAcademy Pricing Structure — Decision Doc
**Date: June 2, 2026**
**Owner: Kyle Rosebrook / FlashFusion**

---

## TL;DR

Recommended structure: **Free / Pro $29/mo / Team $149/mo**.

SparkAcademy is not the primary revenue driver — FlashFusion consulting is. SparkAcademy is a top-of-funnel content engine that converts engaged learners into consulting clients. Pricing should optimize for: enrollment → engagement → consulting pipeline. Not for maximum per-user revenue.

---

## Options Considered

### Option A — Free + Pro + Team (RECOMMENDED)

| Tier | Price | Includes |
|---|---|---|
| **Free** | $0 | Foundation path (5 courses, 15 lessons) + Responsible AI Use + AI for the Skeptical Manager |
| **Pro** | $29/mo or $290/yr | Full catalog: all 32 courses, all 5 paths, certificates, course progress tracking |
| **Team** | $149/mo (up to 10 seats) | Everything in Pro + admin dashboard + completion reporting + priority support → upgrade path to FlashFusion consulting |

**Strengths:**
- Free tier is genuinely useful (3-4 hours of content) — builds trust and reciprocity
- Pro is priced below comparable AI training ($49-99/mo range)
- Team tier is the natural bridge to FlashFusion consulting
- Annual discount (20% off Pro) reduces churn

**Risks:**
- $29/mo may underprice the content given specialty courses (6-hour AI Architecture course is included in Pro). Could leave money on the table from senior practitioners.
- Mitigation: separate "Specialty" pricing for the 4 advanced specialty courses at $99 each, OR keep them in Pro and treat as Pro retention drivers.

---

### Option B — Per-Course + Path Bundles

| Pricing | Description |
|---|---|
| $19 per course | Buy individual courses |
| $79 per path | 5-course bundle |
| $299 all-access lifetime | Everything, no subscription |

**Strengths:**
- One-time payment model, no churn anxiety
- Lifetime price is anchorable to "less than one consulting hour"
- Simpler accounting

**Weaknesses:**
- Eliminates recurring revenue
- No upsell mechanism to consulting
- High-intent buyers max out at $299

**Verdict:** Worse for funnel goals. Skip.

---

### Option C — Single-Tier Freemium

| Tier | Price | Limit |
|---|---|---|
| **Free** | $0 | 3 courses per month |
| **Pro** | $49/mo | Unlimited |

**Strengths:**
- Maximum simplicity
- Forces a paywall decision quickly

**Weaknesses:**
- 3-course/month limit feels arbitrary and frustrating
- Doesn't differentiate B2B from individual
- No team/org SKU = no consulting bridge

**Verdict:** Cleaner pricing but misses the B2B angle. Skip.

---

## Why Option A Wins

The decision hinges on what SparkAcademy is *for*. Three possible answers:

1. **Standalone education product** — optimize per-user revenue, B+/A pricing
2. **Top-of-funnel for consulting** — optimize engagement and Team-tier conversions
3. **Both, eventually** — start with #2, expand to #1 as catalog matures

FlashFusion's actual revenue model says #2. The $222K Year 1 target is driven by:
- AI Setup Audits at $4.5K (50 audits = $225K)
- Enablement Sprints at $5K
- Retainers at $2K/mo

SparkAcademy doesn't need to clear $222K. It needs to make consulting sales easier.

A Team enrollment is a qualified lead — someone whose company is investing in AI training. That's exactly who buys a $4.5K AI Setup Audit.

---

## Tier-by-Tier Details

### Free Tier — Foundation + Skeptic Path

**What's included:**
- AI Fundamentals for Everyone (5 lessons)
- How Claude Actually Reads Your Instructions (3 lessons)
- Prompt Engineering Essentials (6 lessons)
- AI for Everyday Work (3 lessons)
- Responsible AI Use (4 lessons)
- AI for the Skeptical Manager (3 lessons)

**Why this combination:**
- 24 lessons, ~6 hours of content — generous enough to feel real
- Covers complete beginners (Fundamentals + Skeptic) and motivated starters (Prompt Eng + Everyday Work)
- Responsible AI is required for trust — never gate basic safety behind a paywall
- Excludes specialty/governance/B2B content — those are the upgrade triggers

**Conversion goal:** Get learners to complete one full course. Completion = paid conversion candidate.

### Pro Tier — $29/mo or $290/year

**What's included:**
- All 32 courses
- All 5 learning paths
- Certificate generation
- Progress tracking
- Email support

**Pricing rationale:**
- $29/mo is below Coursera Plus ($59/mo), Udemy Business ($30+/user/mo), but above Notion AI ($10/mo)
- $290/year = 17% discount (slightly less aggressive than 20% to preserve cash flow)
- Pro positioning is "serious learner, not a corporation"

**Risk:** $29/mo for content that includes 6-hour AI Architecture course feels light. Acceptable trade-off: those advanced courses are retention drivers, not standalone purchases.

### Team Tier — $149/mo for up to 10 seats

**What's included:**
- Everything in Pro
- Admin dashboard (assign courses, track completion)
- Completion reporting (export CSV/PDF)
- Priority email support
- One free 30-min consulting call per quarter (the consulting bridge)

**Pricing rationale:**
- $149/mo for 10 seats = $14.90/seat — better than Pro's $29
- Volume discount is the explicit value prop
- Per-additional-seat: $14.90/mo above 10
- The "free consulting call" is the upsell mechanism — every Team customer gets a chance to convert to a paid engagement

**Why not a higher price:** The goal is enrollment volume, not Team-tier revenue. Each Team customer is a consulting lead worth potentially $4,500-$60,000 in downstream revenue.

---

## What's NOT in Pricing

- **Per-organization custom pricing:** Not yet. When a 50+ seat company asks, that's a FlashFusion consulting conversation, not a SparkAcademy SKU.
- **Lifetime access:** No. Creates accounting complexity and removes recurring revenue.
- **Course-by-course purchases:** No. Doesn't fit the path-based curriculum.
- **Free trial of Pro:** Not initially. The free tier IS the trial. Re-evaluate if free-to-paid conversion < 3%.

---

## Implementation Dependencies

**Blocked on:**
- Supabase bill overdue (Stripe integration requires Supabase or alternative DB)
- flashfusion.co not yet live (no checkout flow possible)

**Workaround for launch:**
- Use Base44's built-in subscription support if available, OR
- Use Stripe Checkout standalone with a Google Sheet for tracking until Supabase is restored

**Build sequence:**
1. Free tier launches with site (no payment required)
2. Pro tier launches 4-6 weeks after free tier (allows time to gather conversion data)
3. Team tier launches after first 10 Pro customers exist

---

## Revenue Projections (Conservative)

**Assumptions:**
- 100 free signups/month after launch (conservative)
- 5% free → Pro conversion = 5 Pro customers/month
- 1 Team customer/month after Team launch
- 20% of Team customers convert to FlashFusion consulting within 6 months

**Year 1 projection:**
- Pro: ~30 customers × $290/year = **$8,700**
- Team: ~6 customers × $1,788/year = **$10,728**
- Consulting conversion from Team: ~1 × $5,000 sprint = **$5,000**
- **SparkAcademy direct revenue: ~$19,000**
- **FF consulting attribution: ~$5,000+**

**Year 1 total: $24,000-$30,000.** Small relative to $222K target — confirms SparkAcademy as funnel, not flagship.

---

## Decision Required

Confirm Option A. Then:
1. Set up Stripe products (free / pro / team) — blocked on Supabase
2. Implement Pro paywall logic (course access gated by enrollment.tier)
3. Build Team admin dashboard (later — after Pro launches)

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

**CLAIMS:**
- [SOURCED — userMemories] FlashFusion revenue ladder: $4.5K audits → $5K sprints → $2K/mo retainers → vCAIO. Year 1 target $222K.
- [SOURCED — userMemories] Price floor $4,500 hard; Ryan Anderskow $3K exception is non-precedent.
- [SOURCED — Base44 audit Jun 2] SparkAcademy has 32 courses, 125 lessons, 5 active LearningPaths.
- [GENERATED] Coursera Plus $59/mo and Udemy Business $30+/user/mo pricing benchmarks — directionally accurate but not verified for June 2026.
- [GENERATED] 5% free-to-paid conversion rate — industry benchmark for freemium SaaS, not measured for SparkAcademy.
- [GENERATED] $19K SparkAcademy Year 1 direct revenue projection — modeled on assumptions, not historical data.

**COUNTEREXAMPLES:**
- Possible Pro pricing too low: senior practitioners taking AI Architecture course alone would pay $99+ in market. Counter: retention from full catalog access reduces per-customer revenue but improves lifetime value.
- Free tier too generous: 6 hours of free content may suppress paid conversion. Counter: trust-building is more valuable than artificial scarcity at launch.

**! CONTRADICTION:** Pro tier ($290/year) vs. FlashFusion consulting floor ($4,500). A small business owner who'd benefit from FF consulting may stop at Pro and never upgrade. Mitigation: Team-tier free consulting call is the bridge — without it, the funnel breaks.

---

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS

- **No competitive benchmarking done.** Comparable AI training products (Section School, Maven, Tactiq AI) not analyzed for pricing or positioning.
- **No customer interviews.** Pricing should ideally be validated with 5-10 potential buyers before launch.
- **B2B legal:** Team-tier enrollment may require updated Terms of Service for organizational accounts.
- **Refund policy not defined.** Standard SaaS practice is 30-day money-back guarantee — not yet committed.
- **International pricing:** USD-only is fine for US-first launch, but consider purchasing power adjustments for India, Brazil, etc. if traffic warrants.
- **Tax handling:** Stripe Tax or Quaderno may be needed for VAT compliance once non-US revenue grows.
