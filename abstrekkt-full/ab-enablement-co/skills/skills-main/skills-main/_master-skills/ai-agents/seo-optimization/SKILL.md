---
name: seo-optimization
description: Plan, implement, and monitor search engine optimization strategies including technical SEO, on-page optimization, keyword research, link building, and performance tracking. Use when configuring, building, or troubleshooting AI agent workflows.
---

# SEO Optimization

## Overview

Search engine optimization is the practice of improving a website's visibility within organic search results by aligning content, technical infrastructure, and off-site authority with search engine ranking criteria. In a landscape where 68% of trackable web traffic originates from organic and paid search combined, and organic alone accounts for 53% of all site visits, SEO is not a discretionary marketing channel -- it is foundational to sustainable growth.

Modern SEO operates across three interdependent layers: technical health (can search engines crawl and index your site efficiently), on-page relevance (does your content match user intent for target queries), and off-site authority (do credible external sources vouch for your content through backlinks). Weaknesses in any single layer limit the effectiveness of the others. A page with excellent content will not rank if the site has critical crawl errors, and a technically perfect site will not rank if its content is thin or irrelevant.

This skill provides a structured, repeatable framework for executing SEO strategy from research through implementation and measurement. Each process is designed to produce auditable outputs and align with current Google Search guidelines.

### Why This Matters

- **Compounding returns**: Unlike paid channels, organic traffic does not stop when spend stops. A page ranking in position one for a target keyword generates traffic indefinitely with only maintenance investment.
- **Cost efficiency**: Organic search delivers the lowest customer acquisition cost of any digital channel for most industries, averaging 60-70% lower than paid search over a 12-month horizon.
- **Trust signal**: 70-80% of users skip paid ads entirely. Ranking organically communicates credibility and relevance that advertising cannot replicate.
- **Competitive moat**: A strong backlink profile and content library take years for competitors to replicate, creating a durable competitive advantage.

## When to Use

### Primary Triggers

- A new website, product, or market launch requires organic visibility from day one.
- Organic traffic has plateaued or declined and the root cause is unknown.
- A site migration, redesign, or CMS change is planned or underway.
- Content is being produced consistently but failing to rank or drive traffic.
- Competitors are outranking you for keywords directly tied to revenue.

### Specific Use Cases

- "Audit our technical SEO and prioritize the fixes by impact."
- "Build keyword clusters for our new product category."
- "Optimize existing blog posts that rank positions 5-20 to break into the top 3."
- "Develop a link building plan to close the authority gap with competitors."
- "Diagnose why new pages are not being indexed within 48 hours."
- "Prepare an SEO migration checklist before we replatform."
- "Align the content calendar with high-intent search terms."
- "Improve Core Web Vitals to pass Google's page experience thresholds."

## Core Workflow

### 1. Keyword Research and Topic Clustering

Keyword research identifies the terms your audience searches and groups them into clusters that drive content strategy.

**Process**

1. **Seed generation** -- Extract core topics from product features, customer FAQs, sales objections, and competitor site structures.
2. **Expansion** -- Use Ahrefs, SEMrush, or Google Keyword Planner to discover long-tail variations, questions, and semantically related terms. Target a minimum of 200 candidate keywords per product area.
3. **Intent classification** -- Tag every keyword with its dominant intent:

| Intent | Signal Words | Target Content Format |
|---|---|---|
| Informational | how, what, why, guide, tutorial | Blog post, wiki, how-to video |
| Navigational | brand name, login, [product] app | Homepage, login page, app store listing |
| Commercial | best, vs, review, comparison, top | Comparison page, listicle, review |
| Transactional | buy, pricing, discount, coupon, demo | Product page, pricing page, signup flow |

4. **Prioritization** -- Score keywords on a 2x2 matrix of search volume vs. keyword difficulty. Prioritize high-volume, low-to-medium difficulty terms where your current domain authority gives a realistic chance of ranking within 6 months.
5. **Cluster formation** -- Group semantically related keywords into topic clusters. Each cluster has one pillar page (broad, 2000+ word guide) supported by 4-8 cluster articles targeting long-tail terms. Every cluster article links to the pillar and to at least two sibling articles.

**Benchmark**: A well-researched cluster of 6 articles should capture 15-25 related keywords and generate measurable ranking movement within 90 days of publication.

### 2. On-Page Optimization

On-page optimization ensures each page communicates its topic to both users and crawlers with maximum clarity.

**Title Tags and Meta Descriptions**
- Place the primary keyword within the first 30 characters of the title tag.
- Keep titles under 60 characters; meta descriptions under 155 characters.
- Write unique titles and descriptions for every indexable page -- zero duplicates.

**Heading Structure**
- One H1 per page, containing the primary keyword.
- H2s for major sections; H3s for subsections. Never skip levels.
- Include secondary and related keywords in subheadings naturally.

**Content Body Checklist**
- Address search intent within the first 100 words.
- Use the primary keyword in the first paragraph, at least two H2s, and the conclusion.
- Include 5-10 semantically related terms (LSI keywords) distributed throughout.
- Match content depth to the topic -- analyze the word count and structure of current top-5 results as a baseline.
- Add internal links to 3-5 relevant pages using descriptive anchor text.

**Structured Data (JSON-LD)**

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Complete Guide to Keyword Clustering for SEO",
  "description": "Learn how to group keywords into topic clusters that drive organic traffic.",
  "author": {
    "@type": "Organization",
    "name": "Your Brand"
  },
  "datePublished": "2025-09-15",
  "dateModified": "2026-01-10"
}
```

### 3. Technical SEO

Technical SEO removes infrastructure barriers that prevent search engines from crawling, indexing, and ranking your pages.

**Crawlability and Indexation**
- Validate `robots.txt` permits crawling of all critical paths and blocks admin, API, and staging routes.
- Submit an XML sitemap to Google Search Console with all indexable URLs. Audit monthly for accuracy.
- Resolve all crawl errors in Search Console within 7 days of detection.
- Implement canonical tags on every page to prevent duplicate content signals.

**Site Architecture**
- Maintain a maximum crawl depth of 3 clicks from the homepage to any content page.
- Audit for orphaned pages quarterly -- every page must be reachable through internal links.
- Use breadcrumb structured data on all pages below the homepage level.

**Core Web Vitals Targets**

| Metric | Threshold | What It Measures |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5 seconds | Load speed of largest visible element |
| INP (Interaction to Next Paint) | < 200 milliseconds | Responsiveness to user input |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability during page load |

**robots.txt Example**

```text
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /staging/
Disallow: /*?sort=
Disallow: /*?filter=

Sitemap: https://www.example.com/sitemap.xml
```

### 4. Link Building Strategy

Backlinks remain among the top three ranking factors. Quality and relevance outweigh volume -- one link from a high-authority, topically relevant domain is worth more than 50 links from low-quality directories.

**Ethical Tactics**
- **Original research and data studies**: Publish proprietary data, surveys, or benchmarks that others in your industry will cite. Target 2-3 data-driven assets per quarter.
- **Digital PR**: Develop newsworthy angles (industry reports, expert commentary, trend analysis) and pitch to journalists. Aim for 5-10 media placements per quarter.
- **Broken link building**: Use Ahrefs to find broken outbound links on authoritative sites in your niche. Offer your content as a replacement. Conversion rate: 5-15% of outreach emails.
- **Guest contributions**: Write for reputable industry publications with a contextual link back to a relevant page. Limit to 1-2 per month to avoid pattern detection.
- **Resource page inclusion**: Identify curated resource pages and request inclusion where your content adds genuine value.

**What to Avoid**: Purchased links, PBNs, excessive reciprocal linking, link farms, and any scheme designed to manipulate PageRank. Violations risk manual penalties that can suppress organic traffic by 90%+ overnight.

**Tracking**: Monitor new referring domains monthly. A healthy link building program adds 10-30 new referring domains per month for a mid-sized site.

### 5. Content Optimization and Refresh

Existing content represents an untapped ranking opportunity. Updating underperforming pages is typically 3-5x faster than creating new content and can yield ranking improvements within 2-4 weeks.

**Refresh Process**
1. Pull all pages from Google Search Console with impressions but average position > 5 (pages ranking but not in click-generating positions).
2. Analyze the current SERP for each target keyword. Identify content gaps, missing subtopics, and outdated information.
3. Update the content: expand thin sections, add current data and examples, improve heading structure, and refresh the publication date.
4. Add or update internal links to and from the refreshed page.
5. Resubmit the URL for indexing via Search Console.

**Priority Matrix**

| Current Position | Impressions | Action |
|---|---|---|
| 4-10 | High | Highest priority -- small improvements yield large click increases |
| 11-20 | High | Strong potential -- content gaps or authority gaps likely |
| 4-10 | Low | Niche term -- optimize but deprioritize |
| 21+ | Any | Evaluate for rewrite or consolidation |

### 6. Performance Analytics and Reporting

SEO performance must be measured against baselines with clear attribution to specific actions taken.

**Core KPIs**

| Metric | Source | Target Benchmark |
|---|---|---|
| Organic sessions | Google Analytics | Month-over-month growth > 5% |
| Keyword rankings (target terms) | Ahrefs / SEMrush | Top 10 for 70%+ of primary terms within 12 months |
| Click-through rate (organic) | Google Search Console | > 3% average; > 8% for branded terms |
| Domain Rating / Authority | Ahrefs / Moz | Steady quarterly increase of 2-5 points |
| Index coverage ratio | Google Search Console | > 95% of submitted URLs indexed |
| Core Web Vitals pass rate | PageSpeed Insights / CrUX | > 75% of pages passing all thresholds |
| Backlink growth | Ahrefs | 10-30 new referring domains per month |
| Organic conversion rate | Google Analytics | > 2% for commercial pages; > 0.5% for informational |

**Reporting Cadence**
- **Weekly**: Keyword position changes, crawl errors, index coverage anomalies.
- **Monthly**: Traffic trends, backlink acquisition, content performance, CWV scores.
- **Quarterly**: Full technical audit, competitive gap analysis, strategy adjustment.

## Tools & Templates

| Tool | Primary Use | Key Strength |
|---|---|---|
| Ahrefs | Backlink analysis, keyword research, content gap analysis | Largest backlink index, competitor analysis |
| SEMrush | Keyword tracking, site audit, competitive intelligence | All-in-one platform, PPC crossover data |
| Screaming Frog | Technical crawl audits | Deep crawl analysis, custom extraction, JavaScript rendering |
| Google Search Console | Index coverage, performance data, crawl stats | First-party Google data, free, canonical source of truth |
| Surfer SEO | On-page content optimization | NLP-driven content scoring and term recommendations |
| PageSpeed Insights | Core Web Vitals measurement | Uses real Chrome UX Report (CrUX) field data |
| Google Analytics 4 | Traffic analysis, conversion tracking | Free, event-based model, BigQuery export |
| Siteliner | Duplicate content detection | Fast internal duplicate scanning |

## Common Pitfalls

### Pitfall 1: Keyword Stuffing
**Problem**: Overloading pages with target keywords to manipulate rankings. Modern algorithms detect unnatural keyword density and classify it as spam, actively suppressing the page.
**Prevention**: Write for the reader. Use the primary keyword in the title, H1, first paragraph, and 2-3 subheadings. Fill depth with semantically related terms, not repetition. Target a natural keyword density of 0.5-1.5%.

### Pitfall 2: Ignoring Search Intent Alignment
**Problem**: Publishing content in a format that does not match what users expect for a given query. A blog post targeting a transactional keyword like "buy running shoes" will never outrank product pages.
**Prevention**: Before creating any page, search the target keyword and analyze the top 10 results. Match the dominant content format, depth, and angle. Reassess intent quarterly as SERPs evolve.

### Pitfall 3: Neglecting Technical Foundations
**Problem**: Investing heavily in content while ignoring crawl errors, slow load times, and broken internal links. Content cannot rank if search engines cannot efficiently access and render it.
**Prevention**: Run a full technical audit quarterly. Treat Core Web Vitals as hard requirements (LCP < 2.5s, INP < 200ms, CLS < 0.1). Fix critical crawl errors within 7 days. Include technical SEO checkpoints in every deployment pipeline.

### Pitfall 4: Building Links Without a Quality Filter
**Problem**: Pursuing link quantity over quality, resulting in backlinks from low-authority, irrelevant, or spammy domains. This can trigger algorithmic devaluation or manual penalties.
**Prevention**: Evaluate every link opportunity against three criteria: domain authority (DR > 30), topical relevance to your site, and real organic traffic on the linking page. Disavow toxic links quarterly using Google's Disavow Tool.

## Integration Points

### Content Marketing
Keyword research and intent analysis feed directly into the content calendar. Every article should target a specific keyword cluster and be optimized before publication. Post-publication, monitor rankings and refresh content based on performance data. SEO and content teams should share a single editorial workflow.

### Paid Search (SEM)
SEO and paid search data inform each other. Use PPC keyword data to validate organic keyword targets before investing in content. Conversely, reduce paid spend on keywords where you already rank in the top 3 organically. Share conversion rate and quality score data between teams to improve landing page optimization for both channels.

### Web Development and Engineering
Technical SEO depends on a healthy codebase. Site migrations, CMS updates, URL structure changes, and JavaScript framework decisions must include an SEO impact assessment before deployment. Establish a pre-launch SEO checklist for every release cycle that covers canonical tags, redirect maps, structured data, and Core Web Vitals regression testing.

### Analytics and Business Intelligence
Connect organic traffic to downstream business metrics. Build dashboards that surface keyword rankings, landing page performance, crawl health, and conversion attribution in a single view. Use Google Analytics 4 alongside Search Console to correlate organic sessions with revenue, lead volume, and customer lifetime value.

### UX and Design
Page experience is now an explicit ranking factor. UX decisions around layout stability, interactivity, and mobile responsiveness directly affect Core Web Vitals scores. Collaborate with design teams to ensure above-the-fold content loads quickly, interactive elements respond within 200ms, and no layout shifts occur during page rendering.
