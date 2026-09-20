# HumanX 2026 — Conference Package
**INT Inc. | Kyle Rosebrook | April 6–9, Moscone Center South, SF**
**Rebuilt:** February 21, 2026

---

## 🗂️ FILE INDEX

### ⭐ NEW: Assessment Tool (Claude-Powered)
| File | Description |
|------|-------------|
| `HumanX_Assessment_Tool.jsx` | **MAIN DELIVERABLE** — Interactive 6-question multi-tenant architecture assessment. Calls Claude API in real-time. Deploy to Vercel as Next.js component. Mobile-first, dark INT brand UI. |

### 📱 Interactive HTML Tools (Open in browser)
| File | Description |
|------|-------------|
| `HumanX_Pocket_Brief.html` | Conference quick-reference with tabbed navigation: vendors, speakers, questions, SPIN scripts |
| `HumanX_Contact_Tracker.html` | Mobile contact capture app — log conversations on the expo floor |
| `HumanX_Digital_LeaveBehind.html` | Kyle's personal conference card — share via QR or link |
| `HumanX_Research_Synthesis_v2.html` | Full research synthesis dashboard with InVelo + Data Venue intelligence |
| `DataVenue_Architecture_Strategy.html` | Data Venue architecture deep-dive with competitive matrix |

### 📄 Documents (Office files)
| File | Description |
|------|-------------|
| `HumanX_Executive_Brief_Dave.docx` | One-page brief for Dave Linderman — approval request by March 3 |
| `SolutionBridge_Application_Draft.docx` | Ready-to-paste SolutionBridge buyer application (DEADLINE: March 6) |
| `HumanX_Debrief_Template.docx` | Post-conference debrief template (due April 10) |
| `AI_Vendor_Pricing_Matrix_Feb2026.xlsx` | Vendor comparison matrix — 18 vendors across 6 dimensions |

### 📋 Specifications & Research (Markdown)
| File | Description |
|------|-------------|
| `HumanX_Assessment_Tool_Architecture.md` | Complete tech spec for the assessment tool build |
| `InVelo_HumanX_Research_Synthesis.md` | InVelo-specific conference research and speaker targeting |
| `HumanX_Project_Extractor_Prompt.md` | Meta-prompt to extract context from other Claude projects |

---

## 🚨 CRITICAL DEADLINES

| Date | Action |
|------|--------|
| **March 3** | Dave approval deadline (see Executive Brief) |
| **March 6** | SolutionBridge application CLOSES — apply at humanx.co/solution-bridge |
| **March 10** | HumanX app opens — activate AI scoring profile |
| **March 25** | Vendor preferences locked (no more changes) |
| **April 6–9** | CONFERENCE |
| **April 10** | Post-conference debrief due to Dave |

---

## 🔨 Assessment Tool — Quick Deploy

```bash
# 1. Create Next.js app
npx create-next-app@latest humanx-assessment --typescript
cd humanx-assessment

# 2. Copy HumanX_Assessment_Tool.jsx → app/page.jsx (or components/)

# 3. Install deps
npm install

# 4. Add env var
echo "ANTHROPIC_API_KEY=your-key-here" >> .env.local

# 5. Deploy
vercel deploy
```

**Cost per assessment:** ~$0.06–0.15 (Claude API only)
**100 assessments at conference:** ~$6–15 total

---

## 📊 What INT Gets

This package supports 3 simultaneous missions at HumanX:

1. **Data Venue Validation** — Architecture comparison against Snowflake, Rubrik, CockroachDB, AWS, Oracle, GCP
2. **InVelo Market Intelligence** — Pricing validation, competitive landscape, buyer persona confirmation  
3. **MSP Peer Validation** — Peer [X]change conversations with technical directors and CISOs

**ROI:** SolutionBridge Buyer pass = $3,995 value for free. Conference cost drops from ~$4,000 → ~$1,400.

---

*Package assembled by Claude for Kyle Rosebrook, INT Inc.*

---

## v2 ADDITIONS

| File | What's New |
|------|-----------|
| `HumanX_Assessment_Tool_v2.jsx` | Shadow IT question (#6), Supabase capture, AWS S3 backup sink, QR code, PII consent gate, input sanitization |
| `supabase_setup.sql` | Run once in Supabase SQL editor — creates table, RLS policies, indexes |

### Shadow IT question:
> "Do you know which AI tools employees are using with client data?"
> → Scores appear as **Shadow IT Governed** dimension in results
> → Risk badge: CRITICAL / HIGH / MANAGED surfaced in results header

### Data capture architecture:
- **Always stored (no consent required):** Architecture profile + all Claude scores (non-PII)
- **Only stored with consent:** name, email, company, role
- **RLS enforced:** Anon key = INSERT only. No attendee can read other attendees' data.
- **Append-only:** No UPDATE/DELETE policies = audit-safe
- **AWS S3 backup:** Runs silently after Supabase insert, CMK-encrypted
