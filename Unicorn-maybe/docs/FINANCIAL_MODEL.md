# FlashFusion — Financial Model to $30K MRR

**Version 1.0 | April 2026 | Kyle Rosebrook**
**Goal**: Define the realistic path from $0 to $30K MRR in 12 months.

---

## TL;DR

$30K MRR in 12 months is achievable **if and only if** services revenue carries the first 6 months while platform subscription ramps. Services-first → platform-led transition is the model.

| Month | Platform MRR | Services MRR (annualized contracts / 12) | **Total MRR** | Customers |
|-------|------------:|---------:|-------------:|---------:|
| M1 | $0 | $0 | $0 | 0 |
| M3 | $0 | $1,250 | **$1,250** | 1 (Grand pilot) |
| M6 | $500 | $8,333 | **$8,833** | 3 |
| M9 | $2,000 | $16,667 | **$18,667** | 6 |
| **M12** | **$5,000** | **$25,000** | **$30,000** | **9** |

---

## Pricing Assumptions

### Platform Subscription (Self-Serve)

| Tier | Price/mo | Includes | Target Customer |
|------|---------:|----------|-----------------|
| **Free** | $0 | 1 agent, 1 pipeline, community support, 10K tokens/mo | Builders, tinkerers |
| **Pro** | $99 | Unlimited agents/pipelines, MCP marketplace, A/B testing, audit logs, 1M tokens/mo | Solo founders, small teams |
| **Enterprise** | $299 | Everything in Pro + SSO, RLS tenant isolation, compliance reports, dedicated support, 10M tokens/mo | Mid-market, multi-location |
| **Enterprise+** | Custom (≥$999/mo) | Everything + custom SLAs, dedicated Applied AI engineer | Regulated industries, 50+ locations |

**Gross margin on platform**: ~70% after Claude API pass-through at blended Haiku/Sonnet rates.

### Services (Custom Pilots)

| Engagement | Price | Duration | Deliverable |
|------------|------:|---------:|-------------|
| Discovery workshop | $2,500 | 2 weeks | Pain-point map, 90-day pilot scope |
| Pilot build | $5,000–$15,000 | 4–8 weeks | Working agent in production, 1 location, 1 use case |
| Annual engagement (small) | $50,000/yr | 12 months | Scaled pilot across locations + 1 new use case/quarter |
| Annual engagement (mid) | $100,000–$150,000/yr | 12 months | Full vertical template, 3+ use cases, dedicated Slack |

**Services MRR calculation**: Annual engagement ÷ 12.
E.g., $60K/yr Grand engagement = $5,000/month in MRR.

**Gross margin on services**: ~85% (Kyle's time, minimal infrastructure overhead on Base44 → own stack).

---

## 12-Month Customer Ramp

### Months 1–3: Prove it works (1 customer)

**Activity**: Grand Appliance pilot. Kyle ships post-purchase lifecycle agent in one location.

| Month | Customer | Revenue | MRR Contribution |
|-------|----------|--------:|----------------:|
| M1 | Pipeline building (dinner with Aaron, scope pilot) | $0 | $0 |
| M2 | Grand pilot fee invoiced | $7,500 | $1,250/mo annualized |
| M3 | Pilot live, 100 customers | $0 additional | $1,250/mo |

**M3 MRR: $1,250** (all services)

### Months 4–6: Second customer + first platform subs (3 customers)

**Activity**: Grand scales to 5 locations; Sole Revival pilot kicks off; first 3 paying platform subs (builders experimenting with MCP directory listing).

| Month | Event | Revenue | Running MRR |
|-------|-------|--------:|------------:|
| M4 | Grand expands to 5 locations | +$20K annual ($1,667/mo) | $2,917 |
| M5 | Sole Revival annual engagement ($60K/yr) | +$5,000/mo | $7,917 |
| M5 | MCP directory listing live | +$198/mo (2 Pro subs) | $8,115 |
| M6 | Grand adds service-warranty agent | +$10K annual ($833/mo) | $8,948 |
| M6 | Platform subs: 5 Pro | $495/mo | $9,443 |

**M6 MRR: ~$9,443** (93% services, 7% platform)

### Months 7–9: Case study activates marketing (6 customers)

**Activity**: Grand case study published via Anthropic Partner Network. Inbound accelerates. CSTMPRNT + Centerline pilots. Platform subs 2x.

| Month | Event | Revenue | Running MRR |
|-------|-------|--------:|------------:|
| M7 | Anthropic partnership co-marketing | +10 Pro subs | $10,433 |
| M8 | CSTMPRNT pilot + annual ($50K/yr) | +$4,167/mo | $14,600 |
| M8 | Centerline pilot ($15K fee) | +$1,250/mo (1-yr annualized) | $15,850 |
| M9 | 1 Enterprise-tier customer | +$299/mo | $16,149 |
| M9 | Platform subs: 20 Pro, 2 Enterprise | $2,578/mo | $18,429 |

**M9 MRR: ~$18,667** (80% services, 20% platform)

### Months 10–12: Platform compounds, close with 9 customers (9 customers)

**Activity**: Centerline case study published (aerospace/defense = bigger contracts). Second Enterprise customer. Platform crosses $5K MRR.

| Month | Event | Revenue | Running MRR |
|-------|-------|--------:|------------:|
| M10 | Second regional retailer (Grand clone) annual ($75K) | +$6,250/mo | $24,917 |
| M11 | Centerline expands to MIL-SPEC docs full engagement | +$2,500/mo | $27,417 |
| M12 | 3rd Enterprise customer | +$299/mo | $27,716 |
| M12 | Platform subs: 40 Pro, 5 Enterprise, 1 Enterprise+ | $5,454/mo | **$30,000** |

**M12 MRR: $30,000** (83% services, 17% platform)

---

## Revenue Mix Analysis

### Why services-led is the right answer for Year 1

1. **Kyle is one person with $0 in ad budget**. Platform self-serve only works at scale; you need a marketing machine. Services are pulled through personal relationships — no CAC.
2. **Each pilot teaches what to build**. Services revenue doubles as product discovery. Every pilot generates a vertical template that becomes a platform feature.
3. **Case studies beat landing pages**. A Fortune 500 logo or a 95-year-old family retailer saying "zero security incidents, X revenue attributed" is worth 100x a homepage feature list.
4. **Cash flow reality**. Services are $7.5K–$15K invoices collected on signature. Platform subs take 3–6 months to reach payback on any acquisition cost.

### The Year 2 inversion

By Month 12, services:platform is 83:17. The goal in Year 2 is to flip this to **50:50 by M24 and 30:70 by M36**. Mechanism:

- Each services pilot spawns a productized vertical template (Appliance Retail Template, Corporate Activation Template, Specialty Manufacturing Template)
- Templates are sold as platform add-ons at $499–$1,999/mo per workspace
- Services becomes "implementation partner certification" revenue (bring in other consultants to deliver at 30% margin)

---

## Cost Structure

### Year 1 OpEx (monthly, blended)

| Category | Monthly | Notes |
|----------|--------:|-------|
| Infrastructure (AWS, Supabase, Vercel, Cloudflare) | $350 | Ramps from $100 → $800 over year |
| Claude API (customer workloads, gross margin covers this) | $0 net | Passed through in pricing |
| Claude API (internal dev) | $200 | Kyle's own dev usage |
| Domains + DNS + email | $50 | flashfusion.co, flashnframe.com, Zoho |
| Tools (Figma, Linear, Notion, GitHub, Sentry) | $150 | Solo-founder stack |
| Legal (LLC, contracts, one-time) | $200 avg | $2,400 Year 1 — incorporation, client MSAs |
| Accounting (Year 1 light) | $150 | Bookkeeping only |
| Marketing (organic Year 1) | $100 | Content + Anthropic partner co-marketing |
| **Total OpEx** | **~$1,200/mo** | Sustainable as long as Kyle is employed elsewhere |

### Kyle's personal financial assumption

**Kyle remains employed full-time at INT Inc. through Year 1.** FlashFusion revenue is reinvested, not salary. This means:

- No founder salary draw until M12 or $20K+ sustained MRR
- OpEx is funded from early pilot fees, not personal savings
- Services work is done evenings/weekends until M9–M12 when a go-full-time decision is made

**Decision gate — Month 9**: If MRR ≥ $15K and Anthropic partnership is confirmed, evaluate full-time transition. Otherwise continue dual-role through M15.

---

## Break-Even Analysis

### Operating break-even

With $1,200/mo OpEx and ~80% blended gross margin (services weighted), break-even is:

**Monthly revenue needed = $1,200 / 0.80 = $1,500/mo**

Break-even month: **M2** (first pilot fee of $7,500 covers 5 months of OpEx).

### Kyle's full-time break-even

To replace Kyle's INT Inc. compensation (estimated ~$15K–$20K/mo all-in including equity and benefits):

**MRR needed at 80% margin = $18,750–$25,000/mo**

This target is reached at **M11–M12** under the base case.

---

## Sensitivity — What breaks this model?

| Risk | Base Case | Pessimistic | Impact |
|------|-----------|-------------|--------|
| Grand doesn't sign | 100% close (warm intro) | 50% close | -$1,667/mo starting M4 |
| Sole Revival doesn't sign | 100% close (prior employer) | 70% close | -$5,000/mo starting M5 |
| Platform subs never materialize | 40 Pro by M12 | 10 Pro by M12 | -$3,000/mo by M12 |
| Anthropic partnership delayed | M7 | M12 | -$2,000/mo marketing lift |
| Kyle loses day job | Retained | Lost M6 | Must reach $15K MRR by M6 → need Sole Revival early |

**Pessimistic M12 MRR**: ~$18K–$20K (still strong, still investable, but decision gate shifts to M15)

**Optimistic M12 MRR**: ~$45K–$50K (if all 5 pilots close + Centerline case study lands a defense contractor + 80 platform subs)

---

## Key Assumptions (Flag for Validation)

1. **Grand Appliance closes on a $7.5K pilot → $60K annual engagement**. Needs Aaron Reckling dinner + demo + pilot SOW in Q2 2026. [MEDIUM-HIGH confidence, warm relationship]
2. **Sole Revival closes on $60K annual engagement**. Needs prior-employer outreach + scoped Activation OS demo. [HIGH confidence, previously employed]
3. **Anthropic partnership closes by M7 with case study co-marketing**. Needs certification + MCP listing + one production customer. [MEDIUM confidence, depends on Anthropic's review cadence]
4. **MCP directory listing drives 2–10 Pro subs/month**. Benchmark: other public MCP listings appear to drive low single-digit monthly signups in first 6 months. [LOW-MEDIUM confidence]
5. **Average Pro sub retains 6+ months**. No evidence yet. [LOW confidence]
6. **Services delivery stays at 2 pilots/quarter with Kyle solo**. Requires productized templates by M6 to avoid bottleneck. [MEDIUM confidence]

---

## The One Financial Metric to Watch

**Annualized Run-Rate of Services Committed** (ARR-SC).

Not MRR, not ARR — **signed services contracts annualized**. It's the leading indicator 3–6 months ahead of MRR.

Target ARR-SC trajectory:
- M3: $90K (Grand pilot converted)
- M6: $120K (Grand + Sole Revival)
- M9: $240K (+ CSTMPRNT + Centerline)
- M12: $360K+ (+ second retailer + expansions)

If ARR-SC is on track, MRR will follow. If ARR-SC lags, MRR will lag 3 months later.

---

*This model is a forward-looking projection with explicit assumptions. Update monthly based on pipeline reality, not aspiration. Revisit pricing after the third signed customer.*
