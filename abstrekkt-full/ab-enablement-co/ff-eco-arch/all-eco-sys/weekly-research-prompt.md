# Weekly Research Prompt

**How to use:** Open a fresh Claude conversation. Paste everything in the `===` block below. Replace `<WEEK START DATE>` and `<WEEK END DATE>` with the actual dates. Submit. Save Claude's response as `content/<year>-w<week>/00-research.md`.

---

```
===

You are conducting weekly research for a multi-lane AI/tech newsletter. The output is a structured research brief that will feed three downstream editions: an internal AI consultancy brief (3 tiers), a creator-tech newsletter, and a personal essay.

DATE RANGE: <WEEK START DATE> through <WEEK END DATE>

Use web search aggressively. For every claim, cite the primary source (vendor blog, press release, official announcement) over secondary aggregators when both exist.

Produce a research brief with the following sections. Every item must include: the date it broke, the primary source URL, and a one-line "why it matters" framing.

## 1. MAJOR MODEL RELEASES
New foundation models, version bumps, or significant capability releases. For each, capture:
- Model name + version
- Vendor + license
- Headline benchmark numbers (with the specific benchmark named)
- Context window size
- Pricing (if known)
- Where to access it (which clouds, which products)

## 2. INFRASTRUCTURE & VENDOR MOVES
Cloud-AI integrations, partnership announcements, acquisitions, large investments, deprecations.

## 3. AGENTS, TOOLS, AND CONNECTORS
New agentic frameworks, MCP server releases, IDE/tool integrations, automation platforms.

## 4. SECURITY & COMPLIANCE
Vulnerabilities disclosed, regulatory changes, enterprise security advisories from major vendors.

## 5. BENCHMARKS & EVALUATIONS
New benchmarks released, notable benchmark results that change vendor recommendations, eval methodology shifts.

## 6. INDUSTRY / CULTURAL SIGNAL
One non-technical story that shapes how clients are going to talk about AI this week (a layoff narrative, a regulatory hearing, a viral incident, a CEO statement). The story you'd be asked about in a meeting.

## 7. THE NUMBER OF THE WEEK
A single statistic worth keeping in your pocket — funding totals, market sizing, adoption metrics. Source must be authoritative (not a vendor's own blog).

---

ROUTING TAGS

After the research, append a routing recommendation. For each story, suggest which of these lanes it should go in:

- [T1] = INT Tier 1 (Non-Tech): only if it materially affects client conversations this week
- [T2] = INT Tier 2 (Tech Dept): if there's an API change, benchmark impact, or migration concern
- [T3] = INT Tier 3 (AI Team): if there's a strategic implication for our consulting practice
- [FF] = FlashFusion: if a creator-tech operator would want to know about it
- [FN] = Field Notes: skip unless the story directly intersects with personal building work this week

Format:
- Story title — [T3] [T2] [FF]
- Story title — [T1] [T3]
- Story title — [FF]

---

QUALITY BAR

Do not include:
- Marketing announcements without substance ("we launched a website redesign")
- Funding rounds under $50M unless the company is strategically interesting
- Recycled stories from the prior week
- Vendor PR phrased as news ("Salesforce announces it is excited about AI")

DO include:
- Anything that materially changes which AI vendor we'd recommend for which use case
- Anything that unblocks (or blocks) a procurement or compliance scenario
- Anything that changes the operator-level workflow for builders

Be honest about confidence. If a benchmark number is self-reported and not yet independently verified, say so. If a deal structure is rumored but not confirmed, say so. The downstream operator depends on this brief being trustworthy.

Begin research now.

===
```

---

## After research returns

1. Save the response as `content/<year>-w<week>/00-research.md`
2. Read through and confirm routing tags. Adjust any that look wrong.
3. Move to **Step 2 — Story routing** in the operating manual.

## Tips for better research output

- Run this on Friday afternoon for the prior week. Most major releases land mid-week and the dust settles by Friday.
- If the week was quiet, ask Claude a follow-up: "Anything I should know that didn't make the headlines but matters for next quarter?" That often surfaces the highest-value items.
- For weeks with major events (Google I/O, OpenAI DevDay, AWS re:Invent), narrow the date range and run two passes — one for the event, one for everything else.
