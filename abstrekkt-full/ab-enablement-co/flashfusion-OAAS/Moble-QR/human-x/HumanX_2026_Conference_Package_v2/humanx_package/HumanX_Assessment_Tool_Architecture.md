# HumanX Assessment Tool — Architecture Spec
## "The One-Pager That's Actually an App"
**Version:** 1.0 | **Date:** February 21, 2026 | **Author:** Kyle Rosebrook

---

## WHAT THIS IS

An interactive web application where HumanX conference attendees scan a QR code and receive a **personalized multi-tenant AI architecture assessment** — generated in real-time by Claude + Gemini + (optionally) Copilot working together.

This is simultaneously:
1. **A conference tool** — captures leads, starts conversations, gives people something valuable
2. **An InVelo demo** — proves the "Build it. Use it. Retire it." methodology on INT's own problem
3. **A multi-model orchestration showcase** — demonstrates the exact capability INT is positioning to sell
4. **A Data Venue artifact** — the assessment IS the architecture expertise, packaged as a product

---

## THE USER EXPERIENCE (What They See)

### Scan → 90 seconds → Personalized deliverable

**Step 1: QR Code Scan** (0 seconds)
- Printed on business cards, on Kyle's phone, on a small printed card
- URL: `assess.intinc.ai` or `datavenue.intinc.ai` (TBD)
- Loads instantly — no app install, no login

**Step 2: Welcome Screen** (5 seconds)
- Clean, dark branded page (INT navy + teal + orange)
- Headline: "How Secure Is Your Multi-Tenant AI Architecture?"
- Subhead: "Get a personalized assessment in 90 seconds"
- [Start Assessment →] button
- INT Inc. logo + SOC 2 Type II badge

**Step 3: Onboarding Wizard** (60 seconds, 6 questions)

```
Q1: How many client tenants do you manage?
   → 1-10 | 11-50 | 51-100 | 100+

Q2: Which compliance frameworks apply? (select all)
   → HIPAA | SOC 2 | CMMC | PCI-DSS | GDPR | None yet

Q3: What's your current data isolation pattern?
   → Shared database (RLS) | Schema per tenant | Database per tenant | 
     Dedicated infrastructure | No formal isolation | Not sure

Q4: Are you running AI workloads on client data today?
   → Yes, in production | Piloting/testing | Planning to | Not yet

Q5: What's your primary cloud platform?
   → AWS | Azure | Google Cloud | Multi-cloud | On-prem | Hybrid

Q6: Contact info (name, email, company, role)
   → Quick form, pre-filled where possible
```

Each question is a single screen with large tap targets (mobile-first). Progress bar at top. Skip option on Q6 (but incentivize: "Get your full report emailed").

**Step 4: Processing Screen** (15-30 seconds — the "wow" moment)

This is where the magic happens. The screen shows:
- Animated visualization of "analyzing your infrastructure..."
- Real-time status updates:
  - "Evaluating isolation patterns..." ✓
  - "Mapping compliance requirements..." ✓  
  - "Scoring vendor alignment..." ✓
  - "Generating architecture diagram..." ✓
  - "Preparing recommendations..." ✓

Behind the scenes (what actually runs):
```
PARALLEL EXECUTION:

1. Claude API (Opus 4.6) — 3-5 seconds
   Input: All 6 answers + vendor comparison matrix + architecture patterns
   Output: JSON with scores, recommendations, gap analysis, written assessment
   
2. Gemini 3 Pro Image — 5-10 seconds  
   Input: Prompt built from Claude's analysis + their specific answers
   Output: Custom architecture diagram showing their current vs recommended state
   
3. Gemini TTS (2.5 Flash Preview) — 3-5 seconds
   Input: Claude's written assessment summary (2-3 paragraphs)
   Output: Audio file — professional narration of their key findings

4. Imagen 4 Fast — 2-3 seconds
   Input: Branded report header with their company name + assessment date
   Output: Custom header image for their PDF report
```

**Step 5: Results Dashboard** (the deliverable they keep)

A scrollable, mobile-optimized results page:

```
┌─────────────────────────────────┐
│  YOUR ASSESSMENT RESULTS        │
│  [Company Name] | Feb 2026      │
├─────────────────────────────────┤
│                                 │
│  🎧 Listen to Your Assessment  │
│  [▶ Play Audio Walkthrough]     │
│  (Gemini TTS — 60-90 sec audio) │
│                                 │
├─────────────────────────────────┤
│                                 │
│  ARCHITECTURE DIAGRAM           │
│  ┌───────────────────────────┐  │
│  │  [Gemini-generated image] │  │
│  │  Custom diagram showing   │  │
│  │  their current vs         │  │
│  │  recommended architecture │  │
│  └───────────────────────────┘  │
│                                 │
├─────────────────────────────────┤
│                                 │
│  ISOLATION SCORE: 3.2 / 5.0    │
│  ████████░░░░░░░░ 64%           │
│                                 │
│  COMPLIANCE READINESS: 2.8/5.0  │
│  ██████░░░░░░░░░░ 56%           │
│                                 │
│  AI DATA EXPOSURE RISK: HIGH    │
│  ████████████████ ⚠️            │
│                                 │
│  VENDOR FIT RANKING:            │
│  1. Snowflake (92% match)       │
│  2. AWS Native (87% match)      │
│  3. CockroachDB (81% match)     │
│                                 │
├─────────────────────────────────┤
│                                 │
│  KEY FINDINGS                   │
│  (Claude-generated, 3-5 points) │
│  • Your RLS pattern works for   │
│    <50 tenants but breaks at    │
│    scale without...             │
│  • HIPAA + SOC 2 dual-compliance│
│    requires envelope encryption │
│    with per-tenant KMS keys...  │
│  • AI workloads on shared infra │
│    create cross-tenant exposure │
│    vectors that...              │
│                                 │
├─────────────────────────────────┤
│                                 │
│  RECOMMENDED NEXT STEPS         │
│  (Claude-generated, actionable) │
│  1. Evaluate Skyflow for PII    │
│     tokenization layer ($195K)  │
│  2. Implement envelope encrypt  │
│  3. Add audit logging pipeline  │
│                                 │
├─────────────────────────────────┤
│                                 │
│  [📥 Download Full Report PDF]  │
│  [📧 Email Me This Assessment]  │
│  [📅 Schedule a Conversation]   │
│                                 │
│  ─── or ───                     │
│                                 │
│  [🔗 Share with Your Team]      │
│  (generates unique shareable    │
│   URL for their results)        │
│                                 │
└─────────────────────────────────┘
```

---

## MULTI-MODEL CAPABILITY MAP

### What's API-accessible right now (Feb 2026)

| Capability | Model | API Status | Cost | Use in Assessment Tool |
|---|---|---|---|---|
| **Text Analysis & Reasoning** | Claude Opus 4.6 | GA | ~$0.01-0.05/assessment | Core analysis engine — scores, recommendations, written findings |
| **Image Generation (diagrams)** | Gemini 3 Pro Image | Preview | Free tier available | Custom architecture diagrams with text labels, logos, technical annotations |
| **Image Generation (branded)** | Imagen 4 Fast | GA | $0.02/image | Report headers, compliance badges, branded visual assets |
| **Text-to-Speech** | Gemini 2.5 Flash TTS | Preview | Low | Audio walkthrough of assessment (60-90 seconds per report) |
| **Video Generation** | Veo 3.1 | Paid Preview | $0.75/sec ($6/clip) | STRETCH: 8-sec animated architecture explainer |
| **Video Generation (fast)** | Veo 3 Fast | Paid Preview | $0.40/sec ($3.20/clip) | STRETCH: Lower cost animated clip |
| **Live Voice** | Gemini Live API | Preview | TBD | FUTURE: Real-time voice Q&A about their assessment |
| **Code/UI Generation** | Gemini 3 Pro | Preview | Low | FUTURE: Dynamic UI components based on assessment |
| **Music/Audio** | Lyria | Limited | TBD | NOT RECOMMENDED: No clear use case for conference tool |
| **Document Export** | Microsoft Copilot API | GA (M365) | Included | OPTIONAL: Export to PowerPoint/Excel for enterprise buyers |

### Model Orchestration Flow

```
USER INPUT (6 wizard answers)
       │
       ▼
┌──────────────────────────┐
│     ORCHESTRATION LAYER   │
│     (Next.js API Route)   │
└──────┬───────────────────┘
       │
       ├──── Claude Opus 4.6 ──────────► JSON: scores, gaps, recommendations, 
       │     (analysis + reasoning)       written assessment, diagram prompt
       │
       │     [Claude's output feeds Gemini prompts]
       │
       ├──── Gemini 3 Pro Image ───────► PNG: custom architecture diagram
       │     (diagram generation)          built from Claude's analysis
       │
       ├──── Imagen 4 Fast ────────────► PNG: branded report header
       │     (branded assets)              with company name + date
       │
       ├──── Gemini TTS ──────────────► MP3: audio walkthrough
       │     (voice narration)             of key findings (60-90 sec)
       │
       └──── [STRETCH] Veo 3 Fast ────► MP4: 8-sec animated diagram
             (video explainer)             showing data flow patterns
       
       All outputs assembled into:
       ├── Results dashboard (HTML, real-time)
       ├── PDF report (downloadable)
       ├── Audio file (playable/downloadable)
       └── Shareable URL (unique per assessment)
```

### Why Each Model (Not Just "Because We Can")

| Model | Why This Model Specifically | What It Proves to the Audience |
|---|---|---|
| **Claude** | Best-in-class reasoning for complex multi-variable analysis. Vendor matrix scoring requires weighing 6+ dimensions against compliance requirements. No other model does this as reliably. | INT understands which AI does what — not "use AI for everything" but "right model for right task" |
| **Gemini Image** | Native text rendering in images (architecture diagrams NEED readable labels). 4K output. Multi-turn editing means we can iterate on diagram style. | INT can orchestrate across vendors — not locked into one ecosystem |
| **Gemini TTS** | Controllable style/pace. Professional narration without recording. Person can listen while walking the expo floor. | Accessibility-first thinking. Practical, not gimmicky. |
| **Imagen 4** | Fast ($0.02), high-quality branded assets. Report headers need to look professional, not AI-sloppy. | Production-grade output, not demo-quality |
| **Copilot** | Enterprise buyers live in PowerPoint and Excel. Exporting assessment to their native format = instant credibility | INT bridges the Microsoft ecosystem with best-of-breed AI |

---

## TECH STACK

```
FRONTEND
├── React 18+ with TypeScript
├── Tailwind CSS (matching InVelo/INT brand palette)
├── Framer Motion (wizard transitions, loading animations)
├── html2pdf.js or Puppeteer (PDF generation)
└── Deployed on Vercel (Kyle has 31 projects there)

BACKEND (API Routes)
├── Next.js API routes (serverless)
├── Claude API (Anthropic SDK) — analysis engine
├── Gemini API (Google GenAI SDK) — image + TTS + optional video
├── Rate limiting + queue management
└── Supabase (contact storage + assessment results)

DATA
├── Vendor comparison matrix (static JSON, from architecture strategy doc)
├── Scoring algorithms (weighted based on their answers)
├── Assessment templates (Claude prompt templates per profile)
└── Contact database (Supabase with RLS — dogfooding the architecture!)

INFRASTRUCTURE
├── Vercel — frontend + API routes
├── Supabase — database + auth + storage (audio files, images, PDFs)
├── Cloudflare — CDN + custom domain
├── QR code — generated pointing to deployed URL
└── Google Cloud Storage — backup for generated media assets
```

---

## WHAT MAKES THIS AN INVELO DEMO

This tool IS InVelo's methodology applied to INT's own problem:

| InVelo Principle | How This Tool Embodies It |
|---|---|
| **Build it.** | 2-3 week build, purpose-built for HumanX 2026 |
| **Use it.** | Deploy at conference, capture 50-100 assessments |
| **Retire it.** | Could decommission after April 9 — or sell the pattern |
| **Time-boxed** | 4-week cycle: spec → build → deploy → execute |
| **Compliance-ready** | RLS on Supabase, no PII stored without consent, audit trail |
| **Mission-complete** | The mission: validate Data Venue thesis + capture leads |

When someone asks "what does InVelo actually do?", Kyle points to his phone: "This. We built this in 3 weeks. It uses 4 AI models working together. It gives you a personalized architecture assessment. And when HumanX is over, we could retire it — or we could sell you one for your business."

---

## DEPLOYMENT OPTIONS

### Option A: Vercel (Recommended)
- Deploy as Next.js app on Kyle's existing Vercel account
- Custom domain: `assess.intinc.ai` (if INT owns intinc.ai)
- Or: `datavenue.vercel.app` as temporary
- Pros: Fast, free tier sufficient, Kyle knows the platform
- Cons: Needs Vercel Pro for custom domain + higher serverless limits

### Option B: Google Cloud Run (Backup)
- Kyle already has the InVelo temp site deployed here
- Pros: Tighter integration with Gemini APIs (lower latency)
- Cons: More complex deployment, less familiar

### Option C: Hybrid
- Frontend on Vercel (fast, global CDN)
- Heavy API calls (Veo video generation) routed to Cloud Run
- Pros: Best of both
- Cons: More infrastructure to manage

### WiFi Contingency
Moscone Center has conference WiFi but it's unreliable with 5,000 attendees.
- **Cache static assets aggressively** (service worker)
- **Pre-generate 4-5 "profile archetypes"** so common combinations load instantly
- **Graceful degradation**: If API calls fail, show pre-built assessment for their closest profile match
- **Offline contact capture**: Form data saves to localStorage, syncs when back online

---

## SCORING ENGINE (How Assessments Are Personalized)

The assessment isn't generic. Claude receives:

```javascript
const assessmentPrompt = {
  system: `You are an enterprise data architect specializing in multi-tenant 
    isolation for MSP environments. You have deep knowledge of: Skyflow 
    (privacy vault, ~$195K/yr), Commvault Data Rooms (backup-to-AI, launching 
    2026), AWS patterns (Silo/Bridge/Pool + Lambda tenant isolation), Snowflake 
    (governance + Iceberg), CockroachDB (distributed SQL), and PlanetScale 
    (serverless MySQL).
    
    Score the user's current architecture across 6 dimensions (1-5 each):
    1. Tenant Isolation strength
    2. Encryption depth  
    3. AI data exposure risk
    4. Compliance readiness
    5. Integration surface
    6. MSP operational fit
    
    Return JSON with: scores, gaps, top 3 vendor recommendations with 
    match percentages, 3-5 key findings, 3 recommended next steps, and 
    a 2-paragraph executive summary suitable for TTS narration.`,
    
  user: `Assess this infrastructure profile:
    - Tenants: ${answers.tenantCount}
    - Compliance: ${answers.compliance.join(', ')}
    - Current isolation: ${answers.isolationPattern}
    - AI workloads: ${answers.aiStatus}
    - Cloud platform: ${answers.cloudPlatform}
    - Company: ${answers.company}
    - Role: ${answers.role}`
};
```

Claude's JSON response then feeds Gemini's image prompt:

```javascript
const diagramPrompt = `Create a clean, professional architecture diagram 
  showing a ${answers.isolationPattern} multi-tenant pattern on ${answers.cloudPlatform}.
  
  Show ${answers.tenantCount} client tenants with data flowing through:
  - Current state (left side): ${claudeAnalysis.currentStateDescription}
  - Recommended state (right side): ${claudeAnalysis.recommendedArchitecture}
  
  Use these colors: Navy (#1A1A2E) for infrastructure, Teal (#2DD4BF) for 
  security layers, Orange (#F27A1A) for risk areas, White text labels.
  
  Include text labels for: tenant boundaries, encryption layers, 
  AI inference zone, audit logging, compliance checkpoints.
  
  Style: Clean technical diagram, not cartoonish. Dark background. 
  Professional enough for a CTO presentation.
  Aspect ratio: 16:9. Resolution: 2K.`;
```

---

## BUILD TIMELINE

| Week | Focus | Deliverables |
|---|---|---|
| **Week 1 (Feb 24 - Mar 2)** | Core engine | Wizard UI, Claude scoring API, basic results page |
| **Week 2 (Mar 3 - Mar 9)** | Generative layer | Gemini image integration, TTS, PDF generation |
| **Week 3 (Mar 10 - Mar 16)** | Polish + deploy | Animations, offline mode, QR code, custom domain |
| **Week 4 (Mar 17 - Apr 5)** | Test + refine | Load testing, prompt tuning, archetype pre-caching |

### Prerequisites
- [ ] Gemini API key (Google AI Studio — free tier or paid)
- [ ] Claude API key (Kyle has this via Anthropic)
- [ ] Supabase project (Kyle has this)
- [ ] Vercel deployment (Kyle has 31 projects)
- [ ] Custom domain (TBD — needs INT approval or personal domain)
- [ ] QR code generated after deployment

---

## COST PER ASSESSMENT (Estimated)

| Component | Cost per assessment | Notes |
|---|---|---|
| Claude Opus 4.6 | ~$0.03-0.08 | ~2K input tokens, ~1K output |
| Gemini 3 Pro Image | ~$0.00-0.04 | Free tier may cover conference volume |
| Imagen 4 Fast | $0.02 | One branded header image |
| Gemini TTS | ~$0.01 | 60-90 seconds of audio |
| Supabase | $0.00 | Free tier (< 500MB) |
| Vercel | $0.00 | Free tier for serverless |
| **TOTAL per assessment** | **~$0.06-0.15** | |
| **100 assessments at conference** | **~$6-15 total** | |

Even with Veo video ($3.20/clip via Veo 3 Fast), 100 assessments = $320. Probably not worth it for v1 — save video generation for v2 or high-value leads only.

---

## SUCCESS METRICS

| Metric | Target | Why It Matters |
|---|---|---|
| Assessments completed | 50-100 | Lead capture volume |
| Email capture rate | >70% | Follow-up pipeline |
| Average completion time | <90 seconds | Expo floor attention span |
| "Share with team" clicks | >20% | Viral distribution to decision-makers |
| Post-conference meetings booked | 5-10 | Direct pipeline |
| Demo conversations started | 15-20 | "How did you build this?" = InVelo pitch |

---

## THE CONVERSATION IT STARTS

When someone sees their personalized assessment with a custom diagram, audio walkthrough, and specific vendor recommendations — they ask ONE of two questions:

1. **"How did you build this?"** → InVelo pitch. "We built it in 3 weeks using 4 AI models. That's what we do — purpose-built AI tools for specific business problems. Build it. Use it. Retire it."

2. **"Can you do this for our infrastructure?"** → Consulting engagement lead. "Absolutely. What you just saw is the lightweight version. A full architecture assessment with implementation recommendations is a 4-week engagement."

Both questions lead to revenue. That's the ROI.
