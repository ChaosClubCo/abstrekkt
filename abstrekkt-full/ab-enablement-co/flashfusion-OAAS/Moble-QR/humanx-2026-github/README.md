# HumanX 2026 — Conference Intelligence Package

**INT Inc. | Kyle Rosebrook | April 6–9, 2026 | Moscone Center South, San Francisco**

---

## What This Is

A complete conference operations package for HumanX 2026, built to execute three parallel missions:

1. **Data Venue Architecture Validation** — Benchmark INT's multi-tenant data vault design against Snowflake, Rubrik, CockroachDB, AWS, Oracle, and Google Cloud
2. **InVelo Market Intelligence** — Validate pricing, competitive landscape, and buyer persona for INT's "Mission-Complete AI Services" offering
3. **MSP Peer Validation** — Test the multi-tenant data governance pain point with practitioners via Peer [X]change networking

The centerpiece is a **Claude-powered interactive assessment tool** that conference attendees scan via QR code to receive a personalized multi-tenant architecture security assessment in ~90 seconds.

---

## Repository Structure

```
humanx-2026/
├── app/                                    # Deployable application code
│   └── HumanX_Assessment_Tool_v2.jsx       # Main assessment tool (React/Next.js)
│
├── docs/
│   ├── specs/                              # Technical specifications
│   │   ├── HumanX_Assessment_Tool_Architecture.md
│   │   └── SETUP.md                        # Full deployment guide (Supabase → Vercel → AWS)
│   │
│   ├── research/                           # Conference intelligence & strategy
│   │   ├── InVelo_HumanX_Research_Synthesis.md
│   │   ├── HumanX_SPIN_Scripts.md          # Conversation frameworks (vendor + peer)
│   │   ├── HumanX_Project_Extractor_Prompt.md
│   │   └── AI_Vendor_Pricing_Matrix_Feb2026.xlsx
│   │
│   └── templates/                          # Pre-built documents (Word)
│       ├── HumanX_Executive_Brief_Dave.docx
│       ├── SolutionBridge_Application_Draft.docx
│       └── HumanX_Debrief_Template.docx
│
├── tools/
│   ├── html/                               # Standalone browser tools (no build required)
│   │   ├── HumanX_Pocket_Brief.html        # Tabbed conference quick-reference
│   │   ├── HumanX_Contact_Tracker.html     # Mobile contact capture app
│   │   ├── HumanX_Leads_Dashboard.html     # Real-time Supabase lead viewer
│   │   ├── HumanX_Digital_LeaveBehind.html # Personal conference card
│   │   ├── HumanX_QR_Code.html             # QR generator + print cards
│   │   ├── HumanX_Research_Synthesis_v2.html
│   │   └── DataVenue_Architecture_Strategy.html
│   │
│   └── sql/
│       └── supabase_setup.sql              # One-shot schema: table + RLS + indexes
│
├── .env.example                            # Required environment variables
├── .gitignore
└── README.md
```

---

## Quick Start

### Assessment Tool Deploy (~45 min first time)

Full walkthrough: [`docs/specs/SETUP.md`](docs/specs/SETUP.md)

```bash
# 1. Create Next.js app
npx create-next-app@latest humanx-assessment --typescript --tailwind --eslint --app
cd humanx-assessment

# 2. Copy the assessment component
cp ../app/HumanX_Assessment_Tool_v2.jsx ./app/page.jsx

# 3. Set up Supabase — run tools/sql/supabase_setup.sql in your Supabase SQL editor

# 4. Configure environment
cp ../.env.example .env.local
# Edit .env.local with your actual keys

# 5. Deploy
vercel deploy --prod
```

**Cost per assessment:** ~$0.06–0.15 (Claude Sonnet API)
**100 assessments at conference:** ~$6–15 total

### HTML Tools (zero setup)

Open any file in `tools/html/` directly in your browser. No build step, no dependencies.

---

## Critical Deadlines

| Date | Action | Status |
|------|--------|--------|
| **March 3** | Dave Linderman approval deadline | ⏳ Pending |
| **March 6** | SolutionBridge Buyer application CLOSES | 🔴 HARD DEADLINE |
| **March 10** | HumanX app opens — activate AI scoring profile | ⏳ Pending |
| **March 25** | Vendor meeting preferences locked | ⏳ Pending |
| **April 6–9** | Conference | 🎯 Showtime |
| **April 10** | Post-conference debrief due | ⏳ Pending |

---

## Assessment Tool — How It Works

1. Attendee scans QR code → loads mobile-first web app
2. Six questions covering: tenant count, compliance frameworks, isolation method, AI deployment status, cloud platform, Shadow IT governance
3. Answers sent to Claude Sonnet → real-time scoring across 7 dimensions
4. Personalized results: risk level, vendor recommendations, architecture gaps, next steps
5. Optional contact capture (consent-gated, PII-isolated) → Supabase with RLS

**Security model:**
- Supabase RLS: anon = INSERT only, no reads
- Append-only: no UPDATE/DELETE policies (audit-safe)
- PII consent gate: contact info stored only with explicit opt-in
- Optional AWS S3 backup with KMS encryption

---

## Conference ROI

| Item | Standard | With SolutionBridge |
|------|----------|-------------------|
| All-Access Pass | $2,650 | **$0 (FREE)** |
| Travel + Hotel + Meals | $1,100–1,700 | $1,100–1,700 |
| **Total** | **~$3,750–$4,350** | **~$1,100–$1,700** |
| **Savings** | — | **$2,650** |

One validated architecture decision or one partnership lead pays for the trip 10x over.

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Assessment Engine | Claude Sonnet 4 API | Real-time architecture scoring |
| Frontend | React / Next.js / Tailwind | Mobile-first assessment wizard |
| Database | Supabase (PostgreSQL + RLS) | Lead capture, append-only audit trail |
| Hosting | Vercel | Serverless deploy, edge CDN |
| Backup | AWS S3 + KMS (optional) | Encrypted assessment backup |
| Notifications | n8n → Slack | Real-time lead alerts |
| QR Codes | api.qrserver.com | Print-ready conference cards |

---

## Related Project Context

This package supports INT Inc.'s broader strategic initiatives:
- **Data Venue** — Secure multi-tenant data vault for MSP operations (architecture validation is primary conference mission)
- **InVelo** — "Mission-Complete AI Services" offering (market validation is secondary mission)
- **INT OS** — Custom operating system with Claude integration (long-term platform play)

---

*Built for INT Inc. by Kyle Rosebrook | February 2026*
