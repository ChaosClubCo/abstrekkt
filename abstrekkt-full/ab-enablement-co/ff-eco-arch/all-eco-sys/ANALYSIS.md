# Phase 1 — Forensic Analysis: Rypple.ai
## Intinc AI Leadership Coaching Prototype

**Date:** 2026-02-14
**Scope:** Complete (Full site + backend scaffolding + auth + API layer)
**Reference Site:** https://get.rypple.ai / https://www.rypple.ai
**Target:** Prototype AI leadership coaching product for Intinc

---

## 1. Site Architecture (Confirmed Routes)

| Route | Purpose | CTA Strategy |
|-------|---------|-------------|
| `/` | Hero + value prop + social proof | "Try Now for Free" |
| `/features` | Feature showcase (6 pillars) | "Start Free" |
| `/why-rypple` | Differentiation + testimonials | "Get Started" |
| `/business` | B2B enterprise page (HR leaders) | "Book a Demo" |
| `/pricing` | Tiered plans (Free/Individual/Team/Company) | Plan-specific CTAs |
| `/about` | Mission, team, board, investors | Trust building |
| `/blog` | Content marketing (15+ articles) | SEO + lead gen |
| `/faqs` | Objection handling | Reduce friction |

**Key Insight:** Two distinct funnels — B2C (individual managers) and B2B (HR leaders at mid-size companies). The `get.rypple.ai` subdomain is a separate landing page optimized for conversion.

---

## 2. UX Pattern Analysis

### Hero Section
- Headline: Problem-aware ("More than coaching — built to help you get things done")
- Subhead: Benefit stack (smarter meetings, tough conversations, delegation, performance tracking)
- Primary CTA: "Try Now for Free — no credit card required"
- Visual: Product screenshot/mockup (not stock imagery)

### Value Proposition Structure
1. **Pain identification** → Managers promoted without training
2. **Solution framing** → 24/7 AI leadership partner
3. **Feature proof** → 6 specific capabilities
4. **Social proof** → Advisory board endorsements + user testimonials
5. **Objection handling** → Free tier, no credit card, SOC 2 certified

### Conversion Architecture
- Freemium model (free tier → paid individual → team → enterprise)
- "No credit card required" repeated on every page
- Testimonials from named users with titles
- Advisory board as trust signal (Dr. Andrew Ng backing, Dr. John Boudreau)
- SOC 2 Type I certification badge

### Information Hierarchy
1. Problem → Solution → Features → Proof → CTA
2. Every page ends with a conversion block
3. Blog functions as SEO top-of-funnel
4. FAQ handles bottom-of-funnel objections

---

## 3. Feature Inventory (from Rypple)

| Feature | Description | Priority for Prototype |
|---------|-------------|----------------------|
| Real-time Guidance | Instant AI coaching for specific situations | P0 — Core |
| Adaptive Pathways | Coaching evolves with user's development | P1 — v2 |
| Practice Guides | Role-play simulations for tough conversations | P1 — v2 |
| Progress Tracking | Analytics on growth/skill development | P0 — Core |
| Voice-to-Voice | "Rypple Voice" — speak and get coached | P2 — v3 |
| Team Dashboard | Manager visibility into team coaching | P1 — v2 |

---

## 4. Design System Analysis

### Typography
- Display: Modern sans-serif (likely custom/Webflow native)
- Body: Clean, high-readability sans-serif
- Weight hierarchy: Bold headlines, regular body, light labels

### Color System (Estimated from brand presence)
- Primary: Deep blue/navy (#1a1a4e range)
- Accent: Vibrant teal/cyan (#00b4d8 range)
- Secondary: Warm coral/orange for CTAs
- Background: White/light gray
- Text: Dark gray (#1a1a2e) on light, white on dark sections

### Layout Patterns
- Full-width hero with centered content
- Alternating left/right feature sections
- Card-based feature grids (3-column)
- Testimonial carousels
- Sticky navigation with CTA button
- Footer with newsletter signup + link grid

### Micro-interactions
- Scroll-triggered section reveals
- Hover states on cards and buttons
- Navigation transitions
- CTA pulse/glow effects

---

## 5. Technical Assessment

### Current Stack (Rypple)
- **Platform:** Webflow (JS-rendered SPA)
- **Tracking:** Facebook Pixel + LinkedIn Insight Tag
- **Auth:** Custom (subscription service agreement references account creation)
- **Certification:** SOC 2 Type I

### SEO Weakness
- Fully JS-rendered = poor crawlability
- Meta descriptions present but content invisible to basic crawlers
- **Our advantage:** Next.js SSR/SSG will crush their SEO

### Performance Risks
- SPA bundle size (full JS render)
- No visible image optimization strategy
- Third-party tracking scripts (FB/LinkedIn pixels)

---

## 6. Competitive Positioning for Intinc Prototype

### What Rypple Does Well
- Clear value prop for underserved market (200M managers globally)
- Strong advisory board / investor credibility
- Freemium model reduces friction
- Two-funnel approach (B2C + B2B)

### Gaps We Can Exploit
- JS-rendered site = poor SEO performance
- No visible API/integration ecosystem
- No team collaboration features visible
- Voice feature is beta-only
- No visible analytics/reporting depth

---

## Phase 2 — Brand Strategy

### Brand Name Options

| # | Name | Domain | Rationale |
|---|------|--------|-----------|
| 1 | **Vantage** | vantage.coach / getvantage.ai | "Vantage point" = elevated perspective. Leadership is about seeing further. Strong, one-word, memorable. |
| 2 | **Cadence** | cadence.coach / getcadence.ai | Leadership rhythm + consistency. Implies regular practice, growth tempo. Feels modern and approachable. |
| 3 | **Meridian** | meridian.coach / getmeridian.ai | Peak/high point + navigational reference. Suggests reaching your highest potential. Premium positioning. |
| 4 | **Catalyst** | catalyst.coach / getcatalyst.ai | Accelerator of change. Direct, action-oriented. Speaks to transformation without being cheesy. |
| 5 | **Pylon** | pylon.coach / getpylon.ai | Structural support pillar. Implies being the backbone that holds teams up. Distinctive, not overused in SaaS. |

### Recommended: **Vantage**

**Why:**
- One word, instantly memorable
- "Vantage point" metaphor maps perfectly to leadership coaching
- Works for both B2C ("Get a better vantage point on your leadership") and B2B ("Give your managers the vantage they need")
- Domain-friendly across TLDs
- Doesn't conflict with major existing brands in the coaching/HR space
- Strong visual identity potential (elevation, perspective, horizon lines)

### Brand Kit (for Vantage)

**Tagline Options:**
1. "Lead from a better view."
2. "Elevate how you lead."
3. "Your AI leadership edge."

**Color Palette:**
- Primary: `#0F172A` (Slate 900 — deep authority)
- Accent: `#F59E0B` (Amber 500 — warm, approachable energy)
- Secondary: `#3B82F6` (Blue 500 — trust, technology)
- Surface: `#F8FAFC` (Slate 50 — clean, breathable)
- Text: `#1E293B` (Slate 800)
- Muted: `#94A3B8` (Slate 400)

**Typography:**
- Display: Satoshi (bold, geometric, modern — NOT Inter/Roboto)
- Body: General Sans (clean, high readability, pairs with Satoshi)

**Design Tokens:**
- Border radius: 12px (cards), 8px (inputs), 9999px (pills)
- Spacing scale: 4px base (4, 8, 12, 16, 24, 32, 48, 64, 96, 128)
- Shadow: `0 1px 3px rgba(15,23,42,0.08)` (subtle), `0 10px 40px rgba(15,23,42,0.12)` (elevated)
- Motion: 200ms ease-out (micro), 400ms ease-out (section reveals)

---

## Phase 3 — Build Plan

### Stack Decision

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Framework | Next.js 14 App Router | SSR/SSG, API routes, your stack |
| Language | TypeScript (strict) | Type safety, your preference |
| Styling | Tailwind CSS | Rapid prototyping, design token mapping |
| Database | Supabase (Postgres + RLS) | Your stack, auth included |
| Validation | Zod | Schema validation, type inference |
| Auth | Supabase Auth | Integrated, RLS-compatible |
| Deployment | Vercel | Your stack, edge-ready |
| Analytics | PostHog | Your stack, self-hostable |
| Email | Resend | Your stack, transactional |
| Payments | Stripe | Your stack, subscription billing |

### File Structure (Planned)
```
vantage/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout + fonts + metadata
│   │   ├── page.tsx                # Landing page (hero + features + social proof + CTA)
│   │   ├── features/page.tsx       # Feature showcase
│   │   ├── pricing/page.tsx        # Pricing tiers
│   │   ├── about/page.tsx          # About + team
│   │   ├── business/page.tsx       # B2B enterprise page
│   │   ├── blog/page.tsx           # Blog index
│   │   ├── login/page.tsx          # Auth login
│   │   ├── signup/page.tsx         # Auth signup
│   │   ├── dashboard/
│   │   │   ├── layout.tsx          # Protected dashboard layout
│   │   │   ├── page.tsx            # Dashboard home
│   │   │   ├── coaching/page.tsx   # AI coaching interface
│   │   │   ├── progress/page.tsx   # Progress tracking
│   │   │   └── settings/page.tsx   # User settings
│   │   └── api/
│   │       ├── auth/callback/route.ts
│   │       ├── coaching/route.ts   # AI coaching endpoint
│   │       ├── progress/route.ts   # Progress data
│   │       └── webhooks/
│   │           └── stripe/route.ts # Stripe webhooks
│   ├── components/
│   │   ├── ui/                     # Primitives (Button, Card, Input, etc.)
│   │   ├── layout/                 # Nav, Footer, Section wrappers
│   │   ├── marketing/              # Hero, Features, Testimonials, Pricing
│   │   └── dashboard/              # Dashboard-specific components
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client
│   │   │   ├── server.ts           # Server client
│   │   │   └── middleware.ts       # Auth middleware
│   │   ├── stripe.ts               # Stripe client + helpers
│   │   ├── ai.ts                   # AI coaching logic
│   │   └── validation.ts           # Zod schemas
│   ├── types/
│   │   └── index.ts                # Shared types
│   └── styles/
│       └── globals.css             # Tailwind + custom properties
├── supabase/
│   └── migrations/
│       └── 001_initial.sql         # DB schema + RLS policies
├── tests/
│   ├── unit/
│   └── e2e/
├── .env.example
├── README.md
├── DEPLOYMENT.md
├── SECURITY.md
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Security Posture (Phase 4 — baked in from start)
- Supabase RLS on all tables
- Zod validation on all API inputs
- CSRF protection via Next.js defaults
- CSP headers in next.config.ts
- Rate limiting on API routes
- Stripe webhook signature verification
- Environment variable isolation (.env.example, no secrets)
- Auth middleware on all /dashboard routes

---

## Assumptions (Stated Explicitly)

1. **Brand:** Using "Vantage" unless you pick a different name
2. **Scope:** Landing page + marketing pages + auth + dashboard shell + AI coaching endpoint stub
3. **AI Backend:** Stub endpoint (not wiring to a real LLM in prototype — configurable)
4. **Payments:** Stripe integration scaffolded, not live
5. **Database:** Supabase with users, sessions, coaching_logs, subscriptions tables
6. **Deployment:** Vercel-ready, not deployed until you approve
7. **Content:** Rewritten copy inspired by Rypple's structure, NOT copied

---

## Next Steps

Pending your brand name selection, I'll build the full project. Pick from:
1. Vantage
2. Cadence
3. Meridian
4. Catalyst
5. Pylon

Or give me your own. Then I start coding.
