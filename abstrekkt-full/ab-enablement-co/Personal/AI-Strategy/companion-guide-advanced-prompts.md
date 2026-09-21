# COMPANION GUIDE: Advanced Prompting Strategies & Validation

This guide provides follow-up prompts and frameworks to dig deeper after receiving your initial 15 ideas.

---

## 🎯 FOLLOW-UP PROMPTS FOR DEEPER ANALYSIS

### **After Receiving Ideas - Validation Prompts:**

#### **Prompt 1: Deep-Dive on Top 3**
```
From the Tier 1 ideas you provided, I want to deep-dive on ideas #[X], #[Y], and #[Z].

For each, provide:

1. **Week-by-Week MVP Build Plan (4 weeks max)**
   - Week 1: [Specific tasks, features, integrations]
   - Week 2: [Specific tasks, features, integrations]
   - Week 3: [Specific tasks, features, integrations]
   - Week 4: [Testing, deployment, first users]

2. **Exact Tech Stack with Justification**
   - Frontend: [Framework + why]
   - Backend: [Framework + why]
   - Database: [Choice + why]
   - AI/APIs: [Which APIs + estimated costs]
   - Hosting: [Platform + why]

3. **First 100 Users Playbook**
   - Day 1-7: [Specific actions, posts, outreach]
   - Day 8-14: [Specific actions, posts, outreach]
   - Day 15-30: [Specific actions, posts, outreach]
   - Scripts/Templates: [Actual copy for outreach messages, social posts]

4. **Revenue Model Breakdown**
   - Free tier: [Exact limits]
   - Paid tier: [Exact price + features]
   - Target metrics: [X free users → Y% convert → $Z MRR]

5. **Failure Modes & Mitigation**
   - What are the 3 most likely reasons this fails?
   - How do I mitigate each risk?

6. **Validation Before Building**
   - How can I test demand with $0 and 0 code in 1 week?
   - What's the minimum viable test?
```

---

#### **Prompt 2: Platform-Specific Feasibility Check**
```
For idea #[X], I want to build on [Replit | Lovable.dev].

Provide:

1. **Platform Capability Assessment**
   - What features of this idea are EASY on this platform? (1-2 days work)
   - What features are MEDIUM difficulty? (3-7 days work)
   - What features are HARD or IMPOSSIBLE? (Alternative approaches?)

2. **Replit-Specific Considerations** (if using Replit):
   - Best language choice: [Python | Node.js | Other] + why
   - Database strategy: [Replit DB | External PostgreSQL | Firebase]
   - Authentication: [Replit Auth | Clerk | Auth0 | Custom]
   - Deployment concerns: [Always-on vs. on-demand, cost implications]
   - File storage: [Replit storage limits, alternative S3/Cloudinary]

3. **Lovable.dev-Specific Considerations** (if using Lovable):
   - Can this be built as a PWA? [Yes/No + explanation]
   - Backend requirements: [Supabase functions | External API | None]
   - State management approach: [React Context | Zustand | TanStack Query]
   - Mobile-first considerations: [Touch interactions, offline mode, notifications]

4. **Integration Complexity**
   - Which external APIs are required? [List]
   - API costs at 100/1000/10000 users: [$X, $Y, $Z]
   - Rate limits or restrictions: [Details]
   - Authentication flow complexity: [OAuth, API keys, webhooks]

5. **Scalability Breaking Points**
   - At what user count does this platform struggle?
   - What's the migration path if I outgrow it?
   - Estimated monthly costs at 100/1000/10000 users
```

---

#### **Prompt 3: Competition & Positioning Analysis**
```
For idea #[X], I need to understand the competitive landscape.

Provide:

1. **Direct Competitors (Top 5)**
   - Name: [Company]
   - Revenue/Users: [If public]
   - Pricing: [Exact tiers]
   - What they do well: [Strengths]
   - What they do poorly: [Weaknesses from user reviews]
   - Why I can win: [Specific advantages]

2. **Indirect Competitors** (Alternative solutions people use)
   - Current workarounds: [Spreadsheets? Manual process? Multiple tools?]
   - Why people tolerate bad solutions: [Lock-in? No better option? Cheap?]

3. **Positioning Statement**
   Write a one-sentence positioning:
   "For [target customer] who [need/pain point], [product name] is a [category] that [unique benefit]. Unlike [competitor], we [key differentiator]."

4. **Red Flags**
   - Have companies tried this and failed? Why?
   - Are there regulatory barriers?
   - Is the market shrinking or growing?
   - Does this rely on a platform that could cut you off? (Twitter API, etc.)

5. **Competitive Moat Strength: [1-10]**
   Explain why this moat is defensible over 2+ years
```

---

#### **Prompt 4: Distribution Channel Deep-Dive**
```
For idea #[X], I need a distribution strategy that doesn't rely on paid ads.

Provide:

1. **Community Infiltration Strategy**
   - List 10 specific communities (with member counts):
     * Reddit: [r/subreddit] (XXX members)
     * Facebook: [Group name] (XXX members)
     * Discord: [Server name] (XXX members)
     * Slack: [Community name] (XXX members)
     * LinkedIn: [Group name] (XXX members)
   - For each, provide:
     * Posting guidelines/rules
     * Best time to post
     * Content format that works (Show HN? Question? Resource?)

2. **Content Strategy**
   - 10 blog post titles that rank for buyer-intent keywords
   - 5 viral LinkedIn post templates
   - 10 Tweet threads that demonstrate value
   - 5 YouTube video ideas (if applicable)

3. **Partnership Strategy**
   - List 20 businesses/tools that serve the same customer but aren't competitive
   - How I approach them (template message)
   - What's in it for them (integration? Referral fee? Co-marketing?)

4. **Influencer/Creator Strategy**
   - List 10 micro-influencers (5K-50K followers) in this niche
   - Why they'd promote this (solves their problem? Affiliate commission?)
   - Outreach template

5. **SEO Quick-Win Strategy**
   - 20 long-tail keywords I can rank for in 90 days
   - Competition level for each keyword [Low | Medium | High]
   - Content format: [How-to guide | Comparison | Tool/Template | Calculator]
```

---

#### **Prompt 5: Monetization Optimization**
```
For idea #[X], I want to maximize revenue without alienating users.

Provide:

1. **Pricing Psychology**
   - Should I have a free tier? [Yes/No + why]
   - Optimal number of paid tiers: [1 | 2 | 3] + why
   - Pricing anchors: [What's the "expensive" tier that makes middle tier look good?]
   - Annual discount strategy: [X% off yearly to improve cash flow]

2. **Value Metric** (What am I charging for?)
   - Per user? Per project? Per usage? Per feature?
   - Why this metric aligns with customer value
   - How this scales with customer success

3. **Freemium Limits** (Where to set the fence)
   - What's free forever: [Features]
   - What's paid: [Features]
   - Logic: [Free tier should demonstrate value but create "pain" to upgrade]

4. **Expansion Revenue**
   - What do I sell to existing customers after they subscribe?
   - Add-ons, premium support, done-for-you services, white-label?

5. **Pricing Comparisons**
   - What's the "old way" cost? (Manual process = X hours/week = $Y/month)
   - What do competitors charge?
   - Where do I position? (20% cheaper? 2x more expensive but 10x better?)

6. **Payment Psychology**
   - Monthly vs. annual: [Both | Annual-only | Monthly-only] + why
   - Trial: [7 days | 14 days | 30 days | No trial] + why
   - Credit card required for trial? [Yes | No] + why
```

---

## 🔍 SPECIALIZED ANALYSIS PROMPTS

### **For AIaaS Ideas:**
```
For AI-powered idea #[X], analyze:

1. **AI Provider Selection**
   - Which AI API: [OpenAI | Anthropic | Replicate | Hugging Face | Other]
   - Model choice: [GPT-4 | Claude 3.5 | Llama 3 | Other] + why
   - Cost per request at scale
   - Latency considerations

2. **Prompt Engineering Strategy**
   - Do I need to fine-tune or is prompt engineering enough?
   - How do I version/test prompts?
   - How do I prevent jailbreaking or misuse?

3. **Quality Assurance**
   - How do I measure output quality?
   - Human-in-the-loop requirements?
   - Fallback strategy if AI fails

4. **Cost Structure**
   - Cost per AI call: [$X]
   - How many calls per user per month: [Y]
   - Total AI costs at 100/1000/10000 users: [$A, $B, $C]
   - At what scale do AI costs become unsustainable?
```

---

### **For PWA/Mobile Ideas:**
```
For mobile-focused idea #[X], analyze:

1. **PWA Feasibility**
   - What native features are required? [Push notifications | Camera | GPS | Offline | Other]
   - Can these be achieved with PWA? [Yes | No | Partially]
   - Fallbacks for iOS Safari limitations

2. **Mobile UX Considerations**
   - What gestures are core to experience? [Swipe | Pinch-zoom | Long-press]
   - How does this work on small screens?
   - Offline-first strategy: [Yes | No | Partial]

3. **Installation Strategy**
   - How do users "install" the PWA?
   - What's the onboarding flow on mobile?
   - App store alternative: [PWA directory | Direct link | Other]

4. **Performance**
   - Loading time on 3G/4G: [Target: <3 seconds]
   - Image optimization strategy
   - Code splitting approach
```

---

### **For B2B SaaS Ideas:**
```
For B2B idea #[X], analyze:

1. **Sales Motion**
   - Self-serve or sales-assisted? [Which and why]
   - Typical deal size: [$X/month or $Y/year]
   - Sales cycle length: [X days]

2. **Buyer Personas**
   - Who's the user? [Job title, pain point]
   - Who's the buyer? [If different - job title, what they care about]
   - Who's the champion? [Who advocates internally]

3. **Enterprise Readiness**
   - SSO requirements: [Soon | Later | Never]
   - Multi-seat pricing: [Per user | Per team | Flat rate]
   - Compliance: [SOC 2 | GDPR | HIPAA | None initially]
   - SLA commitments: [Uptime guarantee?]

4. **Onboarding**
   - Self-serve onboarding time: [X minutes target]
   - White-glove onboarding required: [Yes | No]
   - Churn risk points: [Where do users drop off?]
```

---

## ⚡ RAPID VALIDATION PROMPTS (Before Building)

### **Zero-Code Validation Test:**
```
For idea #[X], design a validation test I can run in 1 week with $0:

1. **Landing Page Test**
   - What's the headline? [Benefit-driven]
   - What's the CTA? ["Join Waitlist" | "Book Demo" | "Early Access"]
   - What's the social proof? [If none: "Join 100 founders testing"]

2. **Traffic Strategy**
   - Where do I drive 100-500 visitors in 1 week?
   - Exact posts/comments to make (write out the copy)

3. **Success Metrics**
   - Conversion rate target: [X%]
   - If X people sign up → Build
   - If <X sign up → Pivot or kill

4. **Fake Door Test**
   - Can I test this by manually delivering the service?
   - Example: "AI report generator" = I write reports manually for first 10 users
```

---

### **Competitor Interview Script:**
```
For idea #[X], I want to interview 10 people who currently use [competitor]:

Provide interview script:

**Opening:**
[Icebreaker question]

**Current State:**
1. [Question about their workflow]
2. [Question about pain points]
3. [Question about what they love]

**Alternatives:**
4. [Have they tried other solutions? Why did they leave?]
5. [What's the #1 feature they wish existed?]

**Willingness to Pay:**
6. [What do they currently pay?]
7. [What would they pay for a solution that does X better?]

**Distribution:**
8. [Where do they hang out online?]
9. [Who do they trust for product recommendations?]

**Closing:**
10. [Would they be open to testing a beta?]
```

---

## 🎯 DECISION FRAMEWORK PROMPT

```
Based on all analysis, help me choose which idea to build:

For each of my top 3 ideas, score (1-10):

1. **Personal Fit**
   - Do I have domain knowledge? [Score + explanation]
   - Will I enjoy building this? [Score + explanation]
   - Do I have unfair advantages (network, skills, audience)? [Score + explanation]

2. **Market Opportunity**
   - Market size: [Score + TAM estimate]
   - Growth trajectory: [Score + trend data]
   - Willingness to pay: [Score + evidence]

3. **Execution Feasibility**
   - Technical feasibility: [Score + time estimate]
   - Time to first dollar: [Score + days estimate]
   - Distribution accessibility: [Score + specific channels]

4. **Defensibility**
   - Moat strength: [Score + type of moat]
   - Competitive threat: [Score + who could kill me]

5. **Downside Protection**
   - What if this fails? Can I pivot? [Score + pivot options]
   - Sunk cost if I quit: [Score + $ and time]

**Total Score: [Sum of all scores]**

**Recommendation: Build idea #[X] because [2-3 sentence explanation of why this has the best risk-adjusted return]**
```

---

## 📚 ADDITIONAL RESOURCES TO REQUEST

### **Ask the LLM for:**

1. **"Generate a Notion/Trello template for managing this build"**
2. **"Create a README.md template for the GitHub repo"**
3. **"Write a Product Hunt launch post for this idea"**
4. **"Create a cold email template for potential customers"**
5. **"Generate 10 Twitter/X threads to build in public"**
6. **"Write a YC application draft for this idea"**
7. **"Create a pitch deck outline (10 slides)"**
8. **"Generate a financial model (revenue projections, costs)"**

---

## 🚨 RED FLAGS TO WATCH FOR

When reviewing ideas from the LLM, be skeptical if:

1. **Vague Distribution:** Says "social media marketing" without specific channels
2. **Unrealistic Timelines:** "Build in 1 week" for complex marketplace
3. **Ignores Competitors:** Doesn't mention obvious competitors
4. **No Clear Monetization:** Relies on "we'll figure it out later"
5. **Platform Risk:** Relies entirely on Twitter API, Facebook Graph, etc. that could shut you off
6. **Regulatory Blindness:** Healthcare/finance ideas without mentioning compliance
7. **Chicken-Egg Problem:** Marketplace that needs both supply and demand from day 1
8. **"First Mover Advantage":** As only moat (this is not a moat)

---

## 💡 FINAL META-PROMPT

After receiving all analysis, use this to synthesize:

```
Based on our entire conversation about app ideas:

1. **Synthesize the top 3 ideas** into a one-page executive summary for each:
   - Problem (2 sentences)
   - Solution (2 sentences)
   - Why me, why now (2 sentences)
   - Go-to-market (3 bullets)
   - Revenue model (1 sentence)
   - 90-day milestones (3 bullets)

2. **Create a decision matrix** comparing the 3 ideas across:
   - Time to first $ (weeks)
   - Technical complexity (1-10)
   - Distribution difficulty (1-10)
   - Market size ($)
   - Personal interest (1-10)

3. **Make a recommendation** on which to build and provide:
   - Week 1-4 action plan (specific tasks for each week)
   - Month 2-3 goals (milestones)
   - 6-month vision (where this could be)

4. **Identify the single biggest risk** for the top idea and how to mitigate it.

5. **Write the first post** I should make on Twitter/Reddit/HN to validate demand before building.
```

---

END OF COMPANION GUIDE

Use these follow-up prompts AFTER you receive your initial 15 ideas to dig deeper on execution, validation, and decision-making.
