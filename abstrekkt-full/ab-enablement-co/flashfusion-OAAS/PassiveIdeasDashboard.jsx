import { useState } from "react";

const ideas = [
  {
    id: "freelancerfi",
    emoji: "💰",
    name: "FreelancerFi",
    tagline: "Freelancer Finance Dashboard + Affiliate Engine",
    passivity: 9,
    buildHours: "8–12h",
    mrr: "$500–$3K/mo passive",
    revenueModel: "Affiliate (Wealthfront, QuickBooks, Mercury Bank)",
    complexity: "Low",
    validated: true,
    validationNote: "9/10 passivity score from project. Affiliate clicks = zero recurring ops.",
    risks: ["SEO traffic dependency", "Affiliate program TOS changes", "Content moat needed to rank"],
    replit: `# 🏗️ REPLIT AGENT BUILD PROMPT — FreelancerFi

## ROLE
You are a Senior Full-Stack Engineer building a production-ready mobile-first web app. You prioritize security, clean architecture, and passive income mechanics over cleverness.

## PROJECT
Build **FreelancerFi** — a freelancer retirement & tax calculator dashboard that generates passive income via affiliate referrals. No money movement. No financial licenses required (read-only analytics only).

## CORE FEATURES (MVP, in priority order)
1. **Retirement Savings Calculator** — irregular income input, SEP IRA / Solo 401k projections, tax drag visualization
2. **Quarterly Tax Estimator** — self-employment tax, estimated payment due dates, safe harbor calculator
3. **Affiliate CTA Rail** — sticky sidebar/bottom bar with tracked affiliate links (Wealthfront, QuickBooks, Mercury) with UTM params
4. **SEO-Optimized Blog Scaffold** — 5 pre-seeded posts targeting "freelancer retirement calculator", "1099 tax estimator" keywords

## TECH STACK
- **Frontend:** React + Vite (Replit-native), Tailwind CSS, mobile-first breakpoints
- **Backend:** Node.js Express (Replit), no database required for MVP (stateless calculators)
- **Auth:** Skip for MVP — no user accounts, no PII stored
- **Analytics:** PostHog (free tier) for affiliate click tracking
- **Deployment:** Replit deployment → custom domain

## PASSIVE INCOME MECHANICS
USER FLOW: 
Google search → Calculator page → Gets value → Sees affiliate CTA → Clicks → Signs up with partner → YOU EARN $50–$300/referral

Every affiliate CTA button must:
- Have PostHog event tracking: track("affiliate_click", { partner: "wealthfront", page: "/retirement-calculator" })
- Open in new tab with UTM params: ?utm_source=freelancerfi&utm_medium=calculator&utm_campaign=retirement
- Be positioned BELOW the calculator result (intent moment)

## SECURITY REQUIREMENTS (Non-Negotiable)
- No user PII collected (stateless calculators only)
- All inputs validated client-side with Zod (reject NaN, negative numbers, strings in number fields)
- HTTPS enforced (Replit handles this)
- No third-party scripts except PostHog (minimize attack surface)
- CSP headers set: script-src 'self', img-src 'self' data:
- Disclaimer footer on every page: "Educational content only. Not financial advice. We may earn affiliate commissions."

## FILE STRUCTURE TO GENERATE
src/
├── calculators/
│   ├── RetirementCalc.jsx       # SEP IRA / Solo 401k projections
│   ├── QuarterlyTaxCalc.jsx     # Self-employment tax estimator
│   └── calcUtils.js             # Pure math functions (unit-testable)
├── components/
│   ├── AffiliateRail.jsx        # Sticky affiliate CTAs with tracking
│   ├── ResultsCard.jsx          # Output display with affiliate trigger
│   └── DisclaimerFooter.jsx     # Legal compliance footer
├── pages/
│   ├── Home.jsx                 # Hero + calculator links
│   ├── RetirementPage.jsx       # Full calculator + SEO meta
│   └── TaxPage.jsx              # Tax estimator + SEO meta
├── blog/
│   └── posts/                   # 5 pre-seeded MDX posts
└── lib/
    └── analytics.js             # PostHog wrapper

## QUALITY GATES (Run before calling done)
- [ ] All calc functions have unit tests (happy path + edge cases: $0 income, $1M income, leap year)
- [ ] Affiliate links verified to open in new tab with correct UTM params
- [ ] PostHog events fire on affiliate click (verify in console)
- [ ] Mobile layout tested at 375px width (iPhone SE)
- [ ] Lighthouse score > 90 (performance matters for SEO)
- [ ] No console.log in production code
- [ ] Legal disclaimer visible on every calculator page

## GAPS & BLINDSPOTS TO FLAG
- Keyword difficulty for target terms (need Ahrefs/SEMrush validation)
- Actual affiliate commission rates vary by partner and traffic quality
- "Educational content" vs "financial advice" line — add legal review note in README
- Affiliate account approvals may take 1–4 weeks after launch

## START HERE
Build RetirementCalc.jsx first. It should accept: monthlyIncome (number), age (number), retirementAge (number), contributionRate (number, 0–25). Return: projectedBalance, annualContribution, taxSavings. Validate all inputs. Then wire up PostHog tracking on the results display.`,

    base44: `# 🏗️ BASE44 BUILD PROMPT — FreelancerFi

## WHAT TO BUILD
Build a **freelancer finance calculator app** that earns passive income through affiliate referrals. This is a mobile-first PWA (no App Store needed). Users search Google, use free calculators, then click affiliate links to financial services — you earn $50–$300 per signup.

## APP DESCRIPTION
"FreelancerFi helps 1099 contractors and freelancers estimate retirement savings and quarterly taxes. It's a free tool that earns revenue when users sign up for recommended financial services."

## PAGES TO CREATE
1. **Home** — Hero with "Calculate your freelancer retirement savings" CTA
2. **Retirement Calculator** — Input: monthly income, age, retirement age → Output: projected balance, annual contribution amount, tax savings estimate
3. **Tax Estimator** — Input: quarterly income, filing status → Output: estimated quarterly payment, safe harbor amount, due dates
4. **Resources** — 5 SEO blog posts about freelancer finance topics

## AFFILIATE REVENUE LOGIC
Add a "Recommended Tools" section that appears AFTER the user sees their calculator results:
- Wealthfront: "Invest your SEP IRA contributions automatically → [Open Account]"
- QuickBooks Self-Employed: "Track your income for accurate tax estimates → [Start Free Trial]"  
- Mercury Bank: "Business checking for freelancers → [Open Free Account]"

Each button opens in a new tab. Add URL params: ?ref=freelancerfi to each affiliate link (replace with real affiliate tracking URLs later).

## MUST-HAVES
- Mobile-first layout (most users will be on phones)
- Legal disclaimer on every page: "Educational only. Not financial advice. We may earn commissions."
- Fast load time (calculators run client-side, no API calls)
- No user accounts required — calculators work instantly

## SUCCESS METRIC
When a user completes a calculator and clicks an affiliate link, that's a conversion. Optimize everything toward that moment.`
  },
  {
    id: "contentmorph",
    emoji: "🔄",
    name: "ContentMorph",
    tagline: "AI Content Repurposer with Freemium + Affiliate Model",
    passivity: 7,
    buildHours: "12–20h",
    mrr: "$200–$2K/mo",
    revenueModel: "Freemium ($19/mo) + AI tool affiliate commissions",
    complexity: "Medium",
    validated: true,
    validationNote: "Validated in project. Key moat: brand voice preservation. Differentiation from OpusClip/Repurpose.io = quality + niche focus.",
    risks: ["6+ funded competitors", "AI quality consistency", "Brand voice preservation is hard to prove pre-ship", "CAC may exceed LTV at small scale"],
    replit: `# 🏗️ REPLIT AGENT BUILD PROMPT — ContentMorph

## ROLE
You are a Senior Full-Stack Engineer. Build a production-ready AI content repurposing SaaS. Freemium model: 3 free repurposes/month, unlimited at $19/month.

## PROJECT
**ContentMorph** — Paste a long-form piece (blog, podcast transcript, YouTube script). AI extracts the core ideas and rewrites them as: Twitter/X thread, LinkedIn post, Instagram caption, email newsletter snippet. Revenue: Stripe subscriptions + affiliate links to tools users need next (Typefully for Twitter scheduling, Buffer for LinkedIn, ConvertKit for email).

## DIFFERENTIATOR
Competitors (Repurpose.io, OpusClip) focus on VIDEO. ContentMorph targets WRITERS and CONTENT MARKETERS who have long-form text. Simpler, faster, more focused.

## TECH STACK
- **Frontend:** React + Vite, Tailwind CSS, mobile-first
- **Backend:** Node.js Express on Replit
- **AI:** Anthropic Claude API (claude-haiku-4-5 for cost efficiency, claude-sonnet-4-6 for quality tier)
- **Auth:** Supabase Auth (email/password + Google OAuth)
- **Database:** Supabase Postgres with RLS
- **Payments:** Stripe (subscription billing)
- **Usage Tracking:** PostHog

## SCHEMA (Supabase)
-- Usage tracking
CREATE TABLE repurpose_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  output_formats JSONB NOT NULL,
  model_used TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions (mirror Stripe webhooks)
CREATE TABLE subscriptions (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT DEFAULT 'free',
  repurposes_this_month INTEGER DEFAULT 0,
  reset_date TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE repurpose_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own jobs" ON repurpose_jobs FOR ALL USING (auth.uid() = user_id);

## PASSIVE INCOME MECHANICS
FREE USER: 3 repurposes → hits limit → upgrade prompt → $19/mo Stripe
PAID USER: Unlimited → after each output, sees "Schedule this with Typefully →" affiliate CTA
AFFILIATE STACK: Typefully ($50/referral), Buffer ($29/referral), ConvertKit (30% recurring commission)

## SECURITY REQUIREMENTS
- Rate limiting: 10 req/min per IP on /api/repurpose (prevent API abuse)
- Input sanitization: Strip HTML tags, limit input to 10,000 characters
- Auth middleware on all /api/user/* routes
- Stripe webhook signature verification (NEVER skip this)
- Supabase RLS enforced (users cannot read other users' jobs)
- API key stored in Replit Secrets (never in code)
- Log AI errors but NEVER log user input content (privacy)

## PROMPT ENGINEERING (Core Logic)
const systemPrompt = "You are an expert content repurposer. 
Your job is to transform long-form content into shorter formats while PRESERVING the author's unique voice, tone, and key arguments.
Never add information not in the original. Never change the meaning.
Output ONLY the requested format. No preamble or explanation.";

## FILE STRUCTURE
src/
├── api/
│   ├── repurpose.js          # POST /api/repurpose — core AI logic
│   ├── billing.js            # Stripe checkout + webhook handler
│   └── usage.js              # GET /api/usage — check monthly limit
├── components/
│   ├── RepurposeForm.jsx     # Text input + format selector
│   ├── OutputTabs.jsx        # Twitter / LinkedIn / Email tabs
│   ├── UsageBar.jsx          # "2 of 3 free uses remaining"
│   ├── UpgradePrompt.jsx     # Paywall modal
│   └── AffiliateCTA.jsx      # "Schedule with Typefully" post-output
├── pages/
│   ├── Dashboard.jsx         # Main repurpose interface
│   └── Pricing.jsx           # Freemium vs Pro comparison
└── lib/
    ├── claude.js             # Anthropic API wrapper
    ├── stripe.js             # Stripe client + webhook handler
    └── supabase.js           # DB client

## QUALITY GATES
- [ ] Free tier limit enforced server-side (not just client-side)
- [ ] Stripe webhook handles subscription cancellation → downgrades user
- [ ] RLS policies tested: user A cannot read user B's jobs
- [ ] Input > 10K chars returns 400 with clear error message
- [ ] Rate limiter returns 429 with Retry-After header
- [ ] AI errors caught, logged, returned as user-friendly message (not 500 stack trace)

## START HERE
Build the core repurpose endpoint first: POST /api/repurpose. Accept { text, format, userId }. Check usage limit from DB. Call Claude API. Store result. Return output. Then build the UI around it.`,

    base44: `# 🏗️ BASE44 BUILD PROMPT — ContentMorph

## WHAT TO BUILD
Build an **AI content repurposing app** with freemium monetization. Users paste long-form content (blog post, podcast transcript) and the app rewrites it as Twitter threads, LinkedIn posts, and email newsletters.

## REVENUE MODEL
- **Free:** 3 repurposes per month
- **Pro ($19/mo):** Unlimited repurposes + priority AI
- **Affiliate:** After each output, show links to scheduling tools (Typefully for Twitter, Buffer for LinkedIn)

## APP PAGES
1. **Home/Landing** — "Turn one blog post into a week of content" hero + sign up CTA
2. **Dashboard** — Text input area, format selector (Twitter Thread / LinkedIn / Email), output display
3. **Usage Counter** — Show "2 of 3 free uses remaining" prominently
4. **Upgrade Page** — Side-by-side free vs pro comparison with Stripe checkout

## KEY LOGIC
- After a user submits content, use Base44's built-in LLM integration to call Claude or GPT
- Prompt: "Transform this content into [format] while preserving the author's exact voice and key arguments. Output ONLY the formatted result."
- Track usage per user per month. Block free users after 3 uses. Show upgrade modal.
- After each successful output, show: "Ready to post? Schedule with Typefully → [affiliate link]"

## MUST-HAVES
- User authentication (email signup required to track usage)
- Mobile-friendly layout (users will use this on their phones between meetings)
- Copy button on every output (one-click copy to clipboard)
- Clear upgrade prompt that explains the value: "You've hit your free limit. Go Pro for $19/mo and never stop creating."

## AFFILIATE INTEGRATION
Add a "Tools We Recommend" section in the dashboard sidebar:
- Typefully (Twitter scheduling) — add affiliate link
- Buffer (multi-platform scheduling) — add affiliate link
- ConvertKit (email marketing) — add affiliate link
These only show AFTER a user completes their first repurpose (intent moment).`
  },
  {
    id: "storyweaver",
    emoji: "📖",
    name: "StoryWeaver",
    tagline: "AI Personalized Storybook Generator — Per-Book + Affiliate",
    passivity: 6,
    buildHours: "16–24h",
    mrr: "$300–$5K/mo",
    revenueModel: "Per-book ($9.99 digital) + print affiliate (Lulu, Blurb)",
    complexity: "Medium-High",
    validated: true,
    validationNote: "Validated in project (1.5M volume, +8187% growth). Best aligned with Kinsley Apps lane. Print affiliate = no inventory risk.",
    risks: ["AI image consistency (same child across pages)", "Print fulfillment margins thin", "Seasonal demand spikes (holidays)", "Moderation for child content"],
    replit: `# 🏗️ REPLIT AGENT BUILD PROMPT — StoryWeaver

## ROLE
You are a Senior Full-Stack Engineer building a production-ready AI storybook generator. This is in the Kinsley Apps project lane. The app generates personalized children's storybooks with the child as the main character. Revenue: $9.99/book (digital PDF) + affiliate commissions on print-on-demand orders.

## PROJECT
**StoryWeaver** — Parents enter a child's name, age, and personality traits. AI generates a 10-page illustrated story starring that child. They download the PDF ($9.99 one-time) and optionally order a printed hardcover via affiliate link to Lulu.com or Blurb.com.

## WHY THIS WORKS PASSIVELY
PASSIVE MECHANICS:
- One-time payment (no subscription management)
- Digital delivery (no inventory, no shipping, no support tickets)
- Print affiliate = Lulu/Blurb fulfills the order, you earn 15–25% commission
- Holiday seasonal spike → runs without intervention

## TECH STACK
- **Frontend:** React + Vite, Tailwind CSS
- **Backend:** Node.js Express on Replit
- **AI Story Generation:** Claude API (claude-sonnet-4-6 for narrative quality)
- **AI Illustration Style:** DALL-E 3 via OpenAI API (consistent watercolor style)
- **PDF Generation:** Puppeteer (server-side) or jsPDF (client-side)
- **Payments:** Stripe one-time payment ($9.99)
- **Storage:** Supabase Storage (store generated PDFs, 7-day expiry)
- **Auth:** Minimal — email only for PDF delivery (no account required)

## CORE USER FLOW
1. Landing page → "Create your child's story"
2. Form: Child's name, age (2–10), 3 personality traits (brave, curious, silly), story theme (space, ocean, forest, magic)
3. Stripe payment ($9.99) → payment intent created
4. On payment success → Generate story (Claude) + 3 illustrations (DALL-E 3) in background
5. Email PDF link to parent (Resend API)
6. Thank you page: "Love the story? Order a hardcover → [Lulu affiliate link]"

## SCHEMA (Supabase)
CREATE TABLE story_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_payment_intent TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  child_name TEXT NOT NULL,
  child_age INTEGER CHECK (child_age BETWEEN 2 AND 10),
  personality_traits TEXT[] NOT NULL,
  story_theme TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending | generating | complete | failed
  pdf_storage_path TEXT,
  pdf_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- No RLS needed (no user accounts) — access controlled by payment intent ID

## STORY GENERATION PROMPT (Claude)
const storyPrompt = "Write a 10-page children's storybook for a [age]-year-old child named [name].

Character traits: [traits]
Setting/Theme: [theme]

Requirements:
- Each page: 2–3 sentences, simple vocabulary appropriate for age
- Child is the brave, curious hero who solves a problem using their unique traits
- Warm, positive ending where child helps their community or learns something valuable
- Page 1 is the title page. Pages 2–10 are story pages.
- Output as JSON: { title: string, pages: [{ page: number, text: string, imagePrompt: string }] }
- imagePrompt for each page: describe the scene for a watercolor illustration."

## SECURITY REQUIREMENTS (Child Safety Critical)
- Content moderation: Run ALL story output through a safety check before PDF generation
  - Reject any output containing violence, scary themes, adult content
  - Flag for manual review if moderation score > 0.3
- No child photos collected (illustrations are AI-generated, not based on photos)
- Email stored only for PDF delivery — delete after 30 days
- Stripe handles all payment data (never touch raw card numbers)
- PDF links expire after 7 days (security + storage cost)
- Rate limit story generation: 5/hour per IP (prevent API cost abuse)

## FILE STRUCTURE
src/
├── api/
│   ├── create-story.js       # POST — validate input, create Stripe payment intent
│   ├── stripe-webhook.js     # Handle payment success → trigger generation
│   ├── generate.js           # Story + image generation pipeline
│   └── moderate.js           # Content safety check
├── components/
│   ├── StoryForm.jsx         # Child info input (name, age, traits, theme)
│   ├── PaymentStep.jsx       # Stripe Elements embed
│   ├── GeneratingScreen.jsx  # "Your story is being written..." loading state
│   └── ThankYouPage.jsx      # Download link + Lulu print affiliate CTA
├── lib/
│   ├── claude.js             # Story generation
│   ├── dalle.js              # Image generation (3 key scene illustrations)
│   ├── pdf.js                # PDF assembly (story text + images → PDF)
│   ├── email.js              # Resend API — PDF delivery email
│   └── stripe.js             # Payment + webhook handling

## QUALITY GATES
- [ ] Content moderation fires before EVERY PDF generation (non-negotiable for child safety)
- [ ] Stripe webhook idempotent (replay-safe — don't generate twice on duplicate webhook)
- [ ] PDF storage links verified to expire after 7 days
- [ ] Story generation fails gracefully → customer email sent with refund instructions
- [ ] Rate limiter tested: 6th request in 1 hour returns 429
- [ ] All traits/theme inputs sanitized before Claude prompt injection

## GAPS & BLINDSPOTS TO FLAG
- DALL-E 3 consistency: same child appearance across pages is NOT guaranteed → consider text-only MVP first
- Print affiliate margins: Lulu/Blurb take 60–70% on print, affiliate adds 15–25% → verify math
- Holiday spike capacity: pre-warm generation queue before November/December
- COPPA compliance: if collecting ANY data on children under 13, consult legal

## START HERE
Build the Stripe payment + webhook flow first. That's the revenue-critical path. Once payment succeeds and webhook fires, you can iterate on story quality. Don't build story generation before you have a working payment loop.`,

    base44: `# 🏗️ BASE44 BUILD PROMPT — StoryWeaver

## WHAT TO BUILD
Build an **AI personalized children's storybook generator** with one-time payment monetization. Parents enter their child's name and traits, AI generates a custom illustrated story, they pay $9.99 to download the PDF.

## REVENUE MODEL
- **One-time payment ($9.99):** Digital PDF download (no recurring billing complexity)
- **Print affiliate:** After download, offer printed hardcover via Lulu.com affiliate link (you earn 15–25% commission, zero fulfillment work)

## APP PAGES
1. **Home/Landing** — "Your child becomes the hero" hero section with sample story pages
2. **Story Creator** — Form: child's name, age (2–10), pick 3 traits (brave/curious/kind/silly/adventurous), pick theme (space/ocean/forest/magic)
3. **Preview + Payment** — Show story title + first page preview, then Stripe $9.99 checkout
4. **Delivery** — "Your story is being created!" → email PDF link when ready
5. **Thank You** — Download button + "Love it? Order a hardcover →" print affiliate CTA

## KEY LOGIC
- Use Base44's built-in LLM to generate the story text as JSON: { title, pages: [{page, text, imagePrompt}] }
- Generate 3 watercolor-style illustrations using the imagePrompt fields (use DALL-E integration if available)
- Assemble story + images into a downloadable PDF
- Email the PDF link to the parent after payment confirmation

## MUST-HAVES
- Payment required BEFORE generation (protect against API cost abuse)
- Content safety check on all AI output before delivery (this is a children's product)
- PDF link expires after 7 days (storage cost + security)
- Legal footer: "AI-generated story for entertainment. Illustrations may vary."

## AFFILIATE INTEGRATION
On the Thank You page:
- "Want a real book on your shelf? Order a hardcover at Lulu.com → [affiliate link]"
- "Give a story as a gift → [link to create another story]"

## SEASONAL STRATEGY NOTE
This product has strong holiday demand (Christmas, birthdays). Plan to launch by October to capture Q4 spike.`
  }
];

// ─── Utility ───────────────────────────────────────────────────────────────

const complexityColor = {
  Low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Medium: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  "Medium-High": "text-orange-400 bg-orange-400/10 border-orange-400/30",
  High: "text-red-400 bg-red-400/10 border-red-400/30",
};

function PassivityMeter({ score }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-sm transition-all ${
              i < score
                ? "bg-amber-400"
                : "bg-zinc-700"
            }`}
          />
        ))}
      </div>
      <span className="font-mono text-xs text-amber-400 tabular-nums">{score}/10</span>
    </div>
  );
}

function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-mono font-medium transition-all duration-200 border ${
        copied
          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
          : "border-zinc-600 bg-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
      }`}
    >
      {copied ? (
        <>
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

function IdeaCard({ idea }) {
  const [expanded, setExpanded] = useState(false);
  const [activePrompt, setActivePrompt] = useState("replit");

  const activePromptText = activePrompt === "replit" ? idea.replit : idea.base44;

  return (
    <div
      className={`rounded-xl border transition-all duration-300 ${
        expanded
          ? "border-amber-400/40 bg-zinc-900/80"
          : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
      }`}
    >
      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0 mt-0.5">{idea.emoji}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-zinc-100 tracking-tight">{idea.name}</h2>
                {idea.validated && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                    <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Validated
                  </span>
                )}
                <span className={`rounded border px-2 py-0.5 text-xs font-mono font-medium ${complexityColor[idea.complexity] || "text-zinc-400 bg-zinc-800 border-zinc-700"}`}>
                  {idea.complexity}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-zinc-500">{idea.tagline}</p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-mono text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-all"
          >
            {expanded ? "Collapse ↑" : "Expand ↓"}
          </button>
        </div>

        {/* Metrics Row */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
            <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">Passivity</p>
            <PassivityMeter score={idea.passivity} />
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
            <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">Build Time</p>
            <p className="font-mono text-sm font-semibold text-zinc-200">{idea.buildHours}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
            <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">Est. MRR</p>
            <p className="font-mono text-sm font-semibold text-amber-400">{idea.mrr}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 col-span-2 sm:col-span-1">
            <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">Model</p>
            <p className="text-xs text-zinc-300 leading-tight">{idea.revenueModel}</p>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-zinc-800">
          {/* Validation Note */}
          <div className="px-5 pt-4 pb-3">
            <div className="flex gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
              <span className="text-amber-400 flex-shrink-0 mt-0.5">◈</span>
              <p className="text-xs text-zinc-400 leading-relaxed">{idea.validationNote}</p>
            </div>
          </div>

          {/* Risks */}
          <div className="px-5 pb-4">
            <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-2">Risk Factors</p>
            <div className="flex flex-wrap gap-2">
              {idea.risks.map((risk, i) => (
                <span key={i} className="flex items-center gap-1.5 rounded border border-red-500/20 bg-red-500/5 px-2.5 py-1 text-xs text-red-400">
                  <span className="text-red-500">▲</span>
                  {risk}
                </span>
              ))}
            </div>
          </div>

          {/* Build Prompts */}
          <div className="border-t border-zinc-800 px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono">Build Prompt</p>
              <div className="flex items-center gap-2">
                {/* Platform Tabs */}
                <div className="flex rounded-lg border border-zinc-700 overflow-hidden">
                  <button
                    onClick={() => setActivePrompt("replit")}
                    className={`px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
                      activePrompt === "replit"
                        ? "bg-amber-400/10 text-amber-400 border-r border-zinc-700"
                        : "text-zinc-500 hover:text-zinc-300 border-r border-zinc-700"
                    }`}
                  >
                    Replit
                  </button>
                  <button
                    onClick={() => setActivePrompt("base44")}
                    className={`px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
                      activePrompt === "base44"
                        ? "bg-amber-400/10 text-amber-400"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Base44
                  </button>
                </div>
                <CopyButton text={activePromptText} label="Copy Prompt" />
              </div>
            </div>

            {/* Prompt Display */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
              {/* Code Block Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500/60" />
                  <div className="h-2 w-2 rounded-full bg-amber-500/60" />
                  <div className="h-2 w-2 rounded-full bg-emerald-500/60" />
                </div>
                <span className="font-mono text-xs text-zinc-600">
                  {activePrompt === "replit" ? "replit-agent-prompt.md" : "base44-prompt.md"}
                </span>
              </div>
              <pre className="max-h-72 overflow-y-auto p-4 text-xs text-zinc-400 leading-relaxed font-mono whitespace-pre-wrap">
                {activePromptText}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sorting / Filtering ────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { label: "Passivity", key: "passivity" },
  { label: "MRR", key: "mrr" },
  { label: "Build Time", key: "buildHours" },
];

export default function PassiveIdeasDashboard() {
  const [sortKey, setSortKey] = useState("passivity");

  const sorted = [...ideas].sort((a, b) => {
    if (sortKey === "passivity") return b.passivity - a.passivity;
    if (sortKey === "buildHours") {
      const parseHours = (s) => parseInt(s.split("–")[0], 10);
      return parseHours(a.buildHours) - parseHours(b.buildHours);
    }
    if (sortKey === "mrr") {
      const parseMrr = (s) => parseInt(s.replace(/[^0-9]/g, "").slice(0, 4), 10);
      return parseMrr(b.mrr) - parseMrr(a.mrr);
    }
    return 0;
  });

  // Aggregate stats
  const totalIdeas = ideas.length;
  const avgPassivity = (ideas.reduce((s, i) => s + i.passivity, 0) / totalIdeas).toFixed(1);
  const validated = ideas.filter((i) => i.validated).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      {/* Top bar */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/90 sticky top-0 z-10 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">
              Passive Income Pipeline
            </span>
          </div>
          <span className="text-xs font-mono text-zinc-600">FlashFusion / Kinsley</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
            Revenue Ideas{" "}
            <span className="text-amber-400">Dashboard</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Validated passive income concepts — build prompts ready to paste.
          </p>

          {/* Aggregate Stats */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-1">Ideas</p>
              <p className="text-2xl font-bold text-zinc-100 font-mono">{totalIdeas}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-1">Avg Passivity</p>
              <p className="text-2xl font-bold text-amber-400 font-mono">{avgPassivity}<span className="text-sm text-zinc-600">/10</span></p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-1">Validated</p>
              <p className="text-2xl font-bold text-emerald-400 font-mono">{validated}<span className="text-sm text-zinc-600">/{totalIdeas}</span></p>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-zinc-600 font-mono uppercase tracking-wider">Sort by:</span>
          <div className="flex rounded-lg border border-zinc-800 overflow-hidden">
            {SORT_OPTIONS.map((opt, i) => (
              <button
                key={opt.key}
                onClick={() => setSortKey(opt.key)}
                className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                  i < SORT_OPTIONS.length - 1 ? "border-r border-zinc-800" : ""
                } ${
                  sortKey === opt.key
                    ? "bg-amber-400/10 text-amber-400"
                    : "text-zinc-500 hover:text-zinc-300 bg-zinc-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Idea Cards */}
        <div className="flex flex-col gap-4">
          {sorted.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 border-t border-zinc-800/60 pt-5 flex items-center justify-between">
          <p className="text-xs text-zinc-700 font-mono">All ideas validated pre-build · Risk factors modeled</p>
          <p className="text-xs text-zinc-700 font-mono">FlashFusion Labs © 2025</p>
        </div>
      </div>
    </div>
  );
}
