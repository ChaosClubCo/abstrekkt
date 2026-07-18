# AI Ecosystem Scanner — Feed Reference & Setup Guide

**Version:** 1.0  
**Date:** 2026-03-21  
**Purpose:** Content engine for The Prompt newsletter + consulting authority

---

## Architecture Overview

```
24 RSS feeds (organized in 5 tiers)
    ↓
n8n cron (daily 6 AM CT)
    ↓
Claude API relevance filter (score >= 7)
    ↓
Notion Research Inbox (~15-25 items/day)
    ↓
Weekly: Claude API brief generator
    ↓
Newsletter draft (Notion) → Your review → Substack publish
    ↓
Zapier: auto cross-post to LinkedIn + X
```

---

## WordPress + Substack Split Strategy

**Substack** owns:
- Newsletter subscriber list and delivery
- Paid tier ($10-15/month for builder playbooks)
- Free tier (ecosystem intelligence — like Doc 1 material)
- Community/comments

**WordPress** owns:
- SEO landing pages (consulting services, case studies, about)
- Lead capture forms (Tally embed or Contact Form 7)
- Blog posts that rank (long-form guides, framework posts)
- Portfolio of work / social proof

**The link between them:**
- WordPress blog posts link to Substack for newsletter signup
- Substack editions link to WordPress for consulting CTA
- Both feed into the same Notion lead pipeline

**Do NOT duplicate content across both.** WordPress gets evergreen SEO content. Substack gets timely intelligence. Different content, same brand.

---

## Feed List by Tier

### Tier 1 — Primary Sources (5 feeds, ~15 items/week)

These are direct from the companies building AI. Non-negotiable.

| # | Source | Feed URL | Volume | Why |
|---|--------|----------|--------|-----|
| 1 | Anthropic News | `https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_news.xml` | 2-4/wk | Your primary platform. Every product launch matters. |
| 2 | Anthropic Engineering | `https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_engineering.xml` | 1-2/wk | Technical patterns you reference in consulting. |
| 3 | OpenAI Blog | `https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_openai_research.xml` | 3-5/wk | Competitive intel. GPT releases, API changes. |
| 4 | Google AI Blog | `https://blog.google/technology/ai/rss/` | 3-5/wk | Gemini, Workspace AI, research. |
| 5 | Microsoft AI Blog | `https://blogs.microsoft.com/ai/feed/` | 2-4/wk | Copilot ecosystem, Azure AI, enterprise strategy. |

### Tier 2 — Industry News (6 feeds, ~40-80 items/day)

Curated journalism. Ecosystem signals. **This tier generates the most noise — Claude filtering is essential here.**

| # | Source | Feed URL | Volume | Why |
|---|--------|----------|--------|-----|
| 6 | TechCrunch AI | `https://techcrunch.com/category/artificial-intelligence/feed/` | 8-15/day | Funding, launches, startup ecosystem. |
| 7 | The Verge AI | `https://www.theverge.com/rss/ai-artificial-intelligence/index.xml` | 5-10/day | Consumer AI, policy. Good for non-tech tier. |
| 8 | VentureBeat AI | `https://venturebeat.com/category/ai/feed/` | 5-10/day | Enterprise AI focus. B2B consulting relevance. |
| 9 | Ars Technica | `https://feeds.arstechnica.com/arstechnica/index` | 10-20/day | Deep technical. Filter to AI/security only. |
| 10 | Techmeme | `https://www.techmeme.com/feed.xml` | 15-25/day | Aggregator. If it matters, it's here. |
| 11 | Wired AI | `https://www.wired.com/feed/tag/ai/latest/rss` | 3-8/day | Longer analysis pieces for newsletter. |

### Tier 3 — Developer Ecosystem (6 feeds, ~30-50 items/day)

What builders are actually shipping and using.

| # | Source | Feed URL | Volume | Why |
|---|--------|----------|--------|-----|
| 12 | Hacker News Front Page | `https://hnrss.org/frontpage` | 30/day | Developer zeitgeist. High volume, needs filter. |
| 13 | HN AI/ML Filtered | `https://hnrss.org/newest?q=AI+OR+LLM+OR+Claude+OR+GPT+OR+agent` | 10-20/day | Pre-filtered HN for AI discussions. |
| 14 | Product Hunt | `https://www.producthunt.com/feed` | 10-15/day | New AI product launches. Competitive intel. |
| 15 | Cursor Blog | `https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_cursor.xml` | 1-2/wk | AI IDE ecosystem changes. |
| 16 | Vercel Blog | `https://vercel.com/atom` | 2-3/wk | Your deploy platform. AI SDK, Next.js. |
| 17 | Supabase Blog | `https://supabase.com/blog/rss.xml` | 1-2/wk | Your DB platform. Auth, RLS, pgvector. |

### Tier 4 — Research & Analysis (3 feeds, ~5-10 items/week + ArXiv firehose)

Higher insight density, lower volume.

| # | Source | Feed URL | Volume | Why |
|---|--------|----------|--------|-----|
| 18 | ArXiv CS.AI | `https://rss.arxiv.org/rss/cs.AI` | 50-100/day | **WEEKLY BATCH ONLY.** Do not run daily. |
| 19 | Ahead of AI (Raschka) | `https://magazine.sebastianraschka.com/feed` | 1-2/wk | Best ML research distillation. High signal. |
| 20 | The Algorithmic Bridge | `https://thealgorithmicbridge.substack.com/feed` | 2-3/wk | AI + society analysis. Newsletter fodder. |

### Tier 5 — Security & Infrastructure (4 feeds, ~15-25 items/week)

Feeds your security-first positioning and AppSec consulting angle.

| # | Source | Feed URL | Volume | Why |
|---|--------|----------|--------|-----|
| 21 | The Hacker News (cyber) | `https://feeds.feedburner.com/TheHackersNews` | 5-10/day | AI vulns, supply chain, auth bypasses. |
| 22 | Krebs on Security | `https://krebsonsecurity.com/feed/` | 2-4/wk | Deep security investigations. Low volume, high impact. |
| 23 | Cloudflare Blog | `https://blog.cloudflare.com/rss/` | 3-5/wk | Edge computing, Workers AI, security infra. |
| 24 | Simon Willison | `https://simonwillison.net/atom/everything/` | 3-7/wk | **Best individual AI tooling blogger.** Practical LLM workflows. |

---

## n8n Implementation Notes

### Claude API Filter Prompt

Use this as the system prompt in your Claude API node:

```
You are an AI ecosystem intelligence analyst. Your job is to evaluate RSS feed items for inclusion in a weekly newsletter called "The Prompt" that serves three audiences:

1. Non-technical leaders (want business impact)
2. Technical department heads (want strategic implications)
3. AI practitioners/builders (want actionable implementation details)

Rate this article 1-10 for newsletter relevance based on:
- Does it signal a platform shift, new capability, or ecosystem change?
- Does it have actionable implications for AI builders or enterprises?
- Is it original signal or just rehashed news?

Score >= 7 only if it contains genuine builder intelligence.
Score < 4 for promotional fluff, minor updates, or rehashed coverage.

Respond ONLY with JSON:
{
  "score": <number>,
  "reason": "<1 sentence>",
  "category": "<ai_labs|enterprise|developer|security|research|product_launch>",
  "newsletter_tier": "<tier1_exec|tier2_tech|tier3_builder|all>",
  "newsletter_angle": "<1 sentence: how would you frame this for the newsletter?>"
}
```

### Volume Management

**Expected daily raw volume:** ~120-180 items across all feeds  
**After Claude filter (>= 7):** ~15-25 items  
**After your manual review:** ~8-12 items kept for the week  
**Newsletter output:** 3-5 key signals per edition  

### ArXiv Special Handling

ArXiv dumps 50-100 papers/day. Do NOT run it through the daily pipeline. Instead:

- Separate n8n workflow
- Weekly schedule (Saturday morning)
- Claude prompt tuned for: "Is this paper a potential breakthrough or paradigm shift? Score >= 8 only for papers that would change how practitioners build AI systems."
- Expected output: 0-3 papers per week worth mentioning

---

## Feed Health Monitoring

Add a simple check to your n8n workflow:

```
If any feed returns 0 items for 3 consecutive days → Slack/email alert
```

RSS feeds break silently. The GitHub-hosted feeds (Olshansk) are community-maintained and may go stale. Check quarterly that all feeds are still returning content.

### Backup Feeds (Add If Primary Goes Down)

| Primary | Backup |
|---------|--------|
| Anthropic (GitHub) | Check anthropic.com/blog directly |
| OpenAI (GitHub) | `https://openai.com/blog/rss.xml` (if available) |
| HN Front Page | `https://hnrss.org/best` (lower volume alternative) |

---

## Future Expansion (Week 3+)

Consider adding after the core pipeline is stable:

- **Reddit r/LocalLLaMA:** `https://www.reddit.com/r/LocalLLaMA/.rss` — open-source AI community
- **Reddit r/MachineLearning:** `https://www.reddit.com/r/MachineLearning/.rss` — research discussions
- **Stratechery (Ben Thompson):** Paid RSS — best strategic tech analysis, worth the subscription
- **Twitter/X Lists:** No native RSS, but use Nitter or RSSHub instances to convert
- **YouTube channels:** Use `https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID` for AI YouTubers

---

## Checklist: Pre-Blitz Setup

- [ ] n8n instance running with HTTP Request node confirmed
- [ ] Claude API key stored in n8n credentials
- [ ] Notion databases created (Research Inbox, Newsletter Drafts, Lead Pipeline)
- [ ] Substack account created
- [ ] WordPress site live with contact form
- [ ] Zapier account with LinkedIn + X connections
- [ ] Copy this feed list JSON into n8n workflow
- [ ] Test 3 feeds manually before building full pipeline
