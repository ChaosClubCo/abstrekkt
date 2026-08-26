# NotebookLM Templates & Examples

**Last Updated:** January 2025  
**Purpose:** Ready-to-use NotebookLM workflows with complete examples

---

## Template Structure

Each template includes:
1. **Use Case** - When to use this workflow
2. **Sources** - What to upload (with examples)
3. **Notebook Setup** - Configuration and custom instructions
4. **Key Queries** - Essential questions to ask
5. **Audio Overview Focus** - How to customize audio generation
6. **Expected Output** - What you'll get
7. **Complete Example** - Real-world implementation

---

## Template 1: Product Launch Research

### Use Case
Research competitive landscape before launching new product

### Sources to Upload
```
Required:
- 5-10 competitor product pages (paste URLs)
- 3-5 industry reports (PDFs)
- 2-3 customer review aggregations (G2, Capterra URLs)
- Market research report (PDF)

Optional:
- Competitor whitepapers
- Industry analyst reports
- News articles about competitors
```

### Notebook Setup
```yaml
Notebook Name: Product Launch Research - [Product Name] - Q1 2025

Background:
We're launching [product] targeting [audience] in [market].
Key differentiators: [list 2-3 unique features]
Price point: [$X] vs competitors [$Y-$Z]

Custom Instructions:
Focus on:
1. Feature gaps in current market
2. Pricing strategies
3. Customer pain points
4. Go-to-market approaches
5. Competitive positioning

Organize findings by competitor, then synthesize cross-cutting themes.
Highlight opportunities where competitors are weak.
```

### Key Queries
```
Phase 1: Landscape Analysis
- "Create a feature comparison table for all competitors"
- "What are the top 3 customer complaints for each competitor?"
- "Summarize each competitor's pricing model"
- "What markets/segments is each competitor targeting?"

Phase 2: Opportunity Identification
- "What features do customers want that no competitor offers?"
- "What are common pain points across all competitors?"
- "Where are competitors vulnerable?"
- "What positioning angles are underutilized?"

Phase 3: Strategy Development
- "Based on gaps identified, what should our positioning be?"
- "What price point makes sense given competitive landscape?"
- "What are the top 5 features we must have to compete?"
- "Generate messaging angles that differentiate us"

Phase 4: Synthesis
- "Create a one-page competitive summary"
- "What are our 3 biggest competitive advantages?"
- "What are the main risks in this competitive landscape?"
```

### Audio Overview Focus
```
"Create a 10-minute executive briefing suitable for the product team.
Focus on:
- Competitive landscape overview (who are the key players?)
- Market opportunities (what gaps exist?)
- Recommended positioning (how should we differentiate?)
- Key risks (what could prevent success?)

Target audience: Product team and executives who need strategic context."
```

### Expected Output
- Competitive feature matrix (Excel/table format)
- Positioning recommendations
- Pricing strategy guidance
- Risk assessment
- Audio briefing for team alignment

---

### Complete Example 1: SaaS Project Management Tool Launch

**Scenario:** Launching project management tool for remote teams

**Sources Uploaded (12 total):**
```
Competitors:
1. asana.com/product (URL)
2. monday.com/features (URL)
3. clickup.com/features (URL)
4. notion.com/product (URL)

Industry Reports:
5. Gartner-PM-Software-2024.pdf
6. Forrester-Collaboration-Tools.pdf

Customer Reviews:
7. g2.com/categories/project-management (URL)
8. capterra.com/project-management-software (URL)

Market Research:
9. Remote-Work-Trends-2024.pdf
10. SaaS-Pricing-Benchmark.pdf

Additional:
11. Asana Product Guide.pdf (whitepaper)
12. Monday.com Case Studies.pdf
```

**Notebook Setup:**
```
Name: PM Tool Launch - RemoteSync - Q1 2025

Background:
Launching RemoteSync, a project management tool for distributed teams.
Differentiators:
- Async-first design (unlike Asana's real-time focus)
- Deep Slack/Teams integration (beyond competitors)
- Timezone-aware scheduling
Target: 10-50 person remote teams
Price: $12/user/mo (vs Asana $13, Monday $14, ClickUp $9)

Instructions:
Analyze competitive landscape focusing on:
1. Feature gaps for remote/async teams
2. Integration capabilities
3. Pricing vs features trade-offs
4. Customer satisfaction scores
5. Go-to-market strategies that worked

Organize by competitor, then identify cross-cutting opportunities.
```

**Key Queries Asked:**
```
Q1: "Create a feature comparison table: Asana, Monday, ClickUp, Notion"

A1: [NotebookLM generates table]
| Feature | Asana | Monday | ClickUp | Notion | RemoteSync Opportunity |
|---------|-------|--------|---------|--------|------------------------|
| Async Updates | ❌ | ❌ | ✅ | ✅ | ✅ Differentiate on async-first |
| Timezone Aware | ❌ | ❌ | ❌ | ❌ | ✅ Unique feature |
| Slack Integration | Basic | Basic | Advanced | Basic | ✅ Go deeper |
| Mobile Apps | ✅ | ✅ | ✅ | ✅ | Table stakes |
| Price (/user/mo) | $13 | $14 | $9 | $10 | $12 (middle) |

Q2: "What are the top 3 complaints for each competitor?"

A2: [From G2 reviews, NotebookLM cites:]
Asana:
1. "Too real-time focused, hard for async teams" [Source 7, Review #45]
2. "Integrations feel bolted on" [Source 7, Review #12]
3. "Expensive for small teams" [Source 7, Review #89]

Monday:
1. "Overwhelming UI, too many features" [Source 7, Review #34]
2. "Notifications are excessive" [Source 7, Review #56]
3. "Poor mobile experience" [Source 8, Review #23]

ClickUp:
1. "Trying to do too much" [Source 7, Review #78]
2. "Learning curve is steep" [Source 7, Review #91]
3. "Performance issues with large projects" [Source 8, Review #67]

Notion:
1. "Not built for project management" [Source 7, Review #102]
2. "Lacks Gantt charts and timelines" [Source 8, Review #44]
3. "Collaboration can be clunky" [Source 7, Review #125]

Q3: "Based on gaps, what should our positioning be?"

A3: Position RemoteSync as "The Project Management Tool Built for Async Teams"

Key messaging angles:
1. "Your team's in 5 timezones? We're built for that."
   - Timezone-aware scheduling [unique feature]
   - Async updates prioritized over real-time
   - No more notification overload

2. "Integrations that actually work"
   - Deep Slack/Teams integration [competitor weakness]
   - Context flows naturally between tools
   - Less context switching

3. "Simple enough to use tomorrow, powerful enough to scale"
   - Easier than ClickUp [addresses complaint]
   - More focused than Monday [addresses complaint]
   - Better for PM than Notion [addresses gap]

Competitive positioning:
- vs Asana: "Built for async, not afterthought"
- vs Monday: "Focused, not overwhelming"
- vs ClickUp: "Power without complexity"
- vs Notion: "Purpose-built for project management"

Q4: "Generate Audio Overview with this focus"

A4: [10-minute audio generated]
Transcript excerpt:
"Hey team, let's talk about the PM tool landscape for remote teams.
The big takeaway? Nobody's really solved async collaboration.
Asana, Monday - they're all real-time first. But 60% of teams we surveyed
are distributed across 3+ timezones [Source 9, p.23].

Our opportunity is clear: timezone-aware scheduling, async-first design,
and integrations that don't feel bolted on. The market gap is there,
and based on G2 reviews, teams are begging for this...

[continues with competitive analysis, positioning, pricing rationale]"
```

**Output Generated:**
1. **Competitive Matrix** - Exported to Google Sheets
2. **Positioning Document** - 2 pages with citations
3. **Pricing Analysis** - Justification for $12/user/mo
4. **Go-to-Market Plan** - Based on competitor successes
5. **Audio Briefing** - 10 minutes for team kickoff

**Result:** Product team had clear competitive strategy in 2 hours vs 2 weeks of manual research

---

## Template 2: Academic Literature Review

### Use Case
Synthesize research papers for thesis, paper, or comprehensive exam

### Sources to Upload
```
Required:
- 15-30 research papers (PDFs)
- 2-3 review articles
- 1 theoretical framework paper

Optional:
- Relevant book chapters
- Conference presentations
- Dissertation proposals
```

### Notebook Setup
```yaml
Notebook Name: Literature Review - [Topic] - [Semester/Year]

Background:
Research question: [Your specific question]
Discipline: [Your field]
Theoretical lens: [Framework you're using]
Purpose: [Thesis, paper, comp exam prep]

Custom Instructions:
Organize findings by:
1. Theoretical frameworks used
2. Methodologies employed
3. Key findings and contributions
4. Research gaps identified
5. Chronological evolution of ideas

Highlight:
- Areas of consensus vs debate
- Methodological trends
- Most cited works
- Gaps for my research question

Generate citations in [APA/MLA/Chicago] format.
```

### Key Queries
```
Phase 1: Landscape Mapping
- "What are the main theoretical frameworks across all papers?"
- "Summarize the methodologies used (quantitative, qualitative, mixed)"
- "Create a chronological timeline of key developments"
- "Who are the most cited authors?"

Phase 2: Thematic Analysis
- "What are the 5-7 major themes across this literature?"
- "Organize key findings by theme"
- "Where do scholars agree vs disagree?"
- "What's the evolution of thinking on [specific concept]?"

Phase 3: Gap Identification
- "What research gaps do authors explicitly mention?"
- "What questions remain unanswered?"
- "What populations/contexts are understudied?"
- "What methodological limitations are noted?"

Phase 4: Synthesis
- "Create a literature review outline organized by theme"
- "Generate a summary table: Author, Year, Method, Key Finding, Limitation"
- "What are the implications for my research question?"
- "Write a 500-word synthesis of the current state of knowledge"
```

### Audio Overview Focus
```
"Create a 12-minute literature review overview for a PhD candidate.
Structure:
1. Theoretical foundations (2 min)
2. Methodological approaches (2 min)
3. Key findings by theme (5 min)
4. Debates and contradictions (2 min)
5. Research gaps (1 min)

Use academic language but keep it accessible.
This will be used for comp exam prep and thesis proposal defense practice."
```

### Expected Output
- Thematic literature review outline
- Summary table (Excel/table format)
- Research gap analysis
- Bibliography in required format
- Audio overview for study/review

---

### Complete Example 2: Social Media & Mental Health Literature Review

**Scenario:** Master's thesis literature review on social media's impact on adolescent mental health

**Sources Uploaded (25 total):**
```
Core Papers (10):
1. Twenge-Depression-2017.pdf
2. Orben-Wellbeing-2019.pdf
3. Primack-Social-Media-Depression-2017.pdf
4. Keles-Social-Media-Adolescents-2020.pdf
5. Nesi-Social-Media-Adolescent-Depression-2020.pdf
6. Vannucci-Social-Media-Mental-Health-2017.pdf
7. Valkenburg-Social-Media-Well-Being-2021.pdf
8. Odgers-Annual-Review-2020.pdf
9. Marino-Meta-Analysis-2018.pdf
10. Jensen-Systematic-Review-2019.pdf

Review Articles (3):
11. Kross-Social-Media-Well-Being-Annual-Review.pdf
12. Appel-Are-We-Filtering-Out-Good-2020.pdf
13. Best-Online-Communication-Mental-Health-2014.pdf

Theoretical Framework:
14. Social-Comparison-Theory-Festinger.pdf

Methods Papers (3):
15. Longitudinal-Study-Design-Adolescents.pdf
16. Experience-Sampling-Method-Review.pdf
17. Social-Media-Data-Ethics.pdf

Additional Context (4):
18. Adolescent-Brain-Development.pdf
19. Digital-Native-Generation-Report.pdf
20. Pew-Teens-Social-Media-2024.pdf
21. Common-Sense-Media-Report-2023.pdf
```

**Notebook Setup:**
```
Name: Lit Review - Social Media & Adolescent Mental Health - Spring 2025

Background:
Research Question: How does social media use affect adolescent mental health, 
and what mechanisms explain this relationship?

Discipline: Developmental Psychology
Theoretical Lens: Social Comparison Theory, Self-Determination Theory
Purpose: Master's thesis literature review

Instructions:
Organize by:
1. Theoretical mechanisms (social comparison, FOMO, cyberbullying, etc.)
2. Methodological approaches (longitudinal, experimental, ESM)
3. Outcomes studied (depression, anxiety, well-being, self-esteem)
4. Moderators (age, gender, usage patterns)

Highlight:
- Consensus vs contradictory findings
- Measurement challenges
- Causal vs correlational evidence
- Gaps in understanding mechanisms

Generate citations in APA 7th edition.
Note: This is a nuanced topic - be careful about oversimplifying cause/effect.
```

**Key Queries Asked:**
```
Q1: "What are the main theoretical mechanisms proposed for how social media 
     affects mental health?"

A1: Five main mechanisms emerge across literature:

1. Social Comparison [9 papers]
   - Upward social comparison on social media → lower self-esteem → depression
   - "Exposure to idealized self-presentations leads to negative self-evaluation" 
     [Twenge 2017, p.12]
   - Effect size: r = .26 [Marino Meta-Analysis 2018, p.45]

2. Fear of Missing Out (FOMO) [7 papers]
   - Constant awareness of others' activities → anxiety → increased use
   - "FOMO mediates relationship between social media use and anxiety" 
     [Primack 2017, p.89]

3. Displaced Activities [6 papers]
   - Social media displaces sleep, exercise, face-to-face interaction
   - "Each hour of social media associated with 15 min less sleep" 
     [Twenge 2017, p.34]

4. Cyberbullying [8 papers]
   - Direct pathway to depression and anxiety
   - "19% of adolescents report cyberbullying victimization" 
     [Odgers 2020, p.156]

5. Feedback-Seeking [5 papers]
   - Excessive reassurance seeking via likes/comments
   - Linked to depression vulnerability [Nesi 2020, p.78]

Q2: "Create summary table: Author, Year, Method, Sample, Key Finding, Limitation"

A2: [NotebookLM generates comprehensive table - excerpt:]

| Author | Year | Method | Sample | Key Finding | Limitation |
|--------|------|--------|--------|-------------|------------|
| Twenge | 2017 | Longitudinal | 500K adolescents | More screen time = more depression (r=.14) | Correlation not causation |
| Orben | 2019 | Specification curve | 350K adolescents | Effect tiny, media exaggerates (r=.01-.02) | Relies on self-report |
| Primack | 2017 | Cross-sectional | 1,787 adults 19-32 | High SM use → 2.7x depression risk | Cross-sectional, can't infer causation |
| Valkenburg | 2021 | Experience sampling | 387 adolescents | Effects are person-specific, average hides heterogeneity | Small sample, Netherlands only |
| Odgers | 2020 | Review | N/A (review) | Correlation weak, causation unclear, panic overblown | Narrative review, not meta-analysis |

[Table continues for all 25 sources...]

Q3: "Where do scholars agree vs disagree in this literature?"

A3: 
CONSENSUS:
- There IS a correlation between social media use and depression/anxiety
  [All quantitative studies show this, though effect sizes vary: .01-.26]
- The relationship is complex, not simple cause-and-effect
  [Valkenburg 2021, Odgers 2020, Appel 2020]
- Individual differences matter (not everyone affected equally)
  [Keles 2020, Valkenburg 2021]
- We need better measurement tools
  [Orben 2019, Odgers 2020]

MAJOR DEBATES:
1. Effect Size Debate
   - Pessimists: "Depression among teens has increased 50% since 2010, 
     coinciding with smartphone adoption" [Twenge 2017, p.3]
   - Skeptics: "Effect size is trivial (r=.01), smaller than wearing glasses 
     on well-being" [Orben 2019, p.12]

2. Causation Debate
   - Some argue social media causes mental health issues
   - Others argue depressed teens use social media more (reverse causation)
   - Few experimental studies exist [only 3 in this corpus]

3. Active vs Passive Use
   - Some find passive scrolling harmful, active engagement beneficial
     [Verduyn cited in Kross Review]
   - Others find no consistent pattern [Orben 2019]

4. Displacement vs Enhancement
   - Does social media replace face-to-face interaction? [Mixed evidence]
   - Or does it supplement and enhance relationships? [Also mixed]

Q4: "What are the main research gaps?"

A4:
GAP 1: Causal Evidence
- Only 3 experimental studies in corpus
- "We need randomized controlled trials" [Odgers 2020, p.178]
- Current evidence is correlational, can't establish causation

GAP 2: Mechanisms
- Why and how social media affects mental health unclear
- "We know THAT it's associated, not WHY" [Kross Review, p.45]
- Need studies testing specific mechanisms (comparison, displacement, etc.)

GAP 3: Heterogeneity
- Most studies report average effects
- "Average effect hides person-to-person variation" [Valkenburg 2021, p.6]
- Need studies of individual differences (who is vulnerable?)

GAP 4: Platform Differences
- Most studies treat "social media" as monolith
- Instagram ≠ TikTok ≠ Snapchat ≠ YouTube
- Platform-specific studies needed

GAP 5: Longitudinal Data
- Most studies are cross-sectional
- "Need multi-wave longitudinal designs" [Jensen 2019, p.234]
- Within-person changes over time understudied

Q5: "Generate Audio Overview"

A5: [12-minute audio created]
[Transcript excerpt:]
"Alright, let's dive into the social media and mental health literature.
This is one of the most debated topics in psychology right now.

The big picture: Yes, there's a relationship. But it's complicated.
Twenge argues it's a major crisis—depression up 50% among teens.
Orben counters that the effect is tiny, smaller than wearing glasses.

Both are citing real data. So what's going on?

First, the mechanisms. Five main theories emerge...
[continues through theoretical frameworks, methodologies, debates, gaps]

For your thesis, the key takeaway is this: the literature shows correlation,
not causation. Your contribution could be testing one of these mechanisms
experimentally. The Valkenburg paper is your model—person-specific effects...

[continues with study design suggestions, theoretical implications]"
```

**Output Generated:**
1. **Literature Review Outline** - 8 pages, thematically organized
2. **Summary Table** - 25 papers with key details
3. **Research Gaps Document** - 3 pages identifying thesis opportunities
4. **APA Bibliography** - All 25 sources formatted correctly
5. **Audio Overview** - 12 minutes for exam prep and thesis defense practice
6. **Theoretical Framework Diagram** - Visual showing how mechanisms relate

**Result:** 25 papers synthesized in 3 hours vs 2-3 weeks of manual reading and note-taking. Student had clear understanding of field, identified thesis gap, and had comprehensive notes for writing.

---

## Template 3: Business Case Analysis

### Use Case
Analyze business case for strategic decision (investment, acquisition, new market entry)

### Sources to Upload
```
Required:
- Financial statements (PDFs)
- Business plan or investment memo (PDF/Doc)
- Market research report
- Competitive analysis

Optional:
- Industry reports
- Analyst coverage
- Customer testimonials
- Due diligence documents
```

### Notebook Setup
```yaml
Notebook Name: Business Case - [Decision/Investment Name] - [Date]

Background:
Decision: [What are we deciding?]
Stakes: [$X investment, Y% market share, strategic importance]
Timeline: [When must we decide?]
Key decision-makers: [Who needs to be convinced?]

Custom Instructions:
Analyze from multiple perspectives:
1. Financial: ROI, payback period, risk-adjusted returns
2. Strategic: Competitive position, market timing, capabilities needed
3. Operational: Feasibility, resource requirements, execution risks
4. Market: Size, growth, competitive dynamics

For each analysis, provide:
- Key finding
- Supporting evidence (with citations)
- Risks and assumptions
- Recommendation

Be balanced—highlight both opportunities and risks.
Quantify where possible.
```

### Key Queries
```
Phase 1: Financial Analysis
- "What is the projected ROI based on the business plan?"
- "What are the key financial assumptions and how sensitive is the business case to them?"
- "Compare financial projections to industry benchmarks"
- "What are the main financial risks?"

Phase 2: Market Analysis
- "What is the addressable market size and growth rate?"
- "Who are the key competitors and what are their market shares?"
- "What are the barriers to entry?"
- "What market trends support or threaten this opportunity?"

Phase 3: Strategic Fit
- "How does this align with our corporate strategy?"
- "What capabilities do we have vs need to build?"
- "What are alternative uses of this capital?"
- "What is the strategic risk of NOT doing this?"

Phase 4: Risk Assessment
- "List all identified risks across sources and categorize by impact"
- "What could go wrong and how likely is each scenario?"
- "What are our mitigation strategies?"
- "What would make you change your recommendation?"

Phase 5: Decision Synthesis
- "Create a one-page investment summary: Opportunity, Risks, Recommendation"
- "What additional data would strengthen the business case?"
- "Generate pro/con list for decision-makers"
```

### Audio Overview Focus
```
"Create a 15-minute board presentation-style briefing.
Structure:
1. Executive summary: The opportunity in 2 minutes
2. Market analysis: Why now? (3 min)
3. Financial case: Expected returns and risks (4 min)
4. Strategic rationale: Why us? (3 min)
5. Risks and mitigation: What could go wrong? (2 min)
6. Recommendation: Go/No-Go with conditions (1 min)

Tone: Executive-level, data-driven, balanced (not sales-y).
Target audience: Board members with limited time."
```

### Expected Output
- One-page investment memo
- Financial model critique
- Risk matrix
- Competitive positioning analysis
- Audio briefing for stakeholders
- Go/No-Go recommendation with conditions

---

### Complete Example 3: SaaS Acquisition Due Diligence

**Scenario:** Evaluating acquisition of $50M ARR SaaS company for $200M

**Sources Uploaded (18 total):**
```
Financial:
1. Target-Financials-2022-2024.pdf
2. Target-Business-Plan-2025-2027.pdf
3. Target-Cap-Table.pdf
4. SaaS-Metrics-Benchmark-2024.pdf

Market:
5. Market-Research-Report-HR-Tech.pdf
6. Gartner-HCM-Market-Guide.pdf
7. Target-Customer-List.pdf (top 50 customers)

Competitive:
8. Competitor-A-SEC-Filing.pdf
9. Competitor-B-Pricing-Page.pdf (URL)
10. Competitor-C-G2-Reviews.pdf (URL snapshot)

Due Diligence:
11. Technical-Infrastructure-Assessment.pdf
12. Security-Audit-Report.pdf
13. Customer-Satisfaction-Survey-Results.pdf
14. Employee-Retention-Data.pdf

Strategic:
15. Our-Strategic-Plan-2025.pdf
16. Integration-Feasibility-Assessment.pdf
17. Synergy-Analysis.pdf

Legal:
18. Material-Contracts-Summary.pdf
```

**Notebook Setup:**
```
Name: Acquisition DD - [Target Company] - Dec 2024

Background:
Decision: Acquire [Target], HR tech SaaS company, for $200M
Target Metrics:
- ARR: $50M (growing 40% YoY)
- Customers: 2,500 mid-market companies
- Valuation: 4x ARR
- Employee count: 350

Our strategic rationale:
- Expands our HR tech portfolio
- Adds missing talent management capability
- Cross-sell opportunity to our 10K customer base

Timeline: Board decision in 2 weeks

Instructions:
Evaluate this acquisition across dimensions:
1. Financial: Is 4x ARR justified? What's the true ROI?
2. Strategic: Does this strengthen our position or distract?
3. Market: Is HR tech talent management a good market?
4. Integration: Can we successfully integrate 350 people and different tech stack?
5. Risk: What could derail value creation?

For each, provide:
- Analysis with supporting data
- Comparison to industry benchmarks
- Risks and dependencies
- Recommendation

Final output: Clear Go/No-Go with conditions.
```

**Key Queries Asked:**
```
Q1: "Analyze the financial metrics compared to SaaS benchmarks. Is this a good deal?"

A1: FINANCIAL ANALYSIS

Current Metrics vs Benchmarks:
| Metric | Target | Industry Median | Assessment |
|--------|--------|-----------------|------------|
| ARR Growth | 40% YoY | 25-30% | ✅ Above average |
| Net Revenue Retention | 115% | 110% | ✅ Strong, indicates expansion |
| CAC Payback | 18 months | 12-18 months | ⚠️ On high end |
| Gross Margin | 75% | 70-80% | ✅ Healthy |
| Rule of 40 | 50% (40% growth + 10% FCF margin) | >40% | ✅ Good |
| Churn (Gross) | 12% annual | 10-15% | ✅ Acceptable for mid-market |

[Sources cited: Target Financials p.12, SaaS Benchmark Report p.34, p.67, p.89]

Valuation Analysis:
- Purchase Price: $200M / $50M ARR = 4x ARR multiple
- Public SaaS median: 5-6x ARR [Benchmark Report p.5]
- But public cos average 20-25% growth vs Target's 40%
- Rule of thumb: 2x growth rate = 80x multiple → 4x is FAIR

Key Concerns:
1. CAC Payback of 18 months is high
   - "Sales team expanded too fast in 2023" [Due Diligence Report p.23]
   - Newer reps haven't ramped yet
   - Could improve to 14-15 months with our sales infrastructure

2. Growth rate declining
   - 2022: 60% growth [Financials p.3]
   - 2023: 50% growth [Financials p.3]
   - 2024: 40% growth (projected) [Business Plan p.2]
   - Market maturity or execution issue? Need to investigate

Recommendation: Financially FAIR deal, not a bargain. Value creation depends on:
- Maintaining 30%+ growth (their plan shows 35%)
- Achieving synergies ($10M cost savings from ops integration [Synergy Analysis p.7])
- Cross-sell to our customer base ($15M ARR opportunity [Synergy Analysis p.12])

Q2: "What are the key strategic benefits and how realistic are they?"

A2: STRATEGIC ANALYSIS

Stated Benefits [from Synergy Analysis]:
1. Product Gap Fill: We lack talent management, they have best-in-class
   - Our customers repeatedly request this capability [Strategic Plan p.45]
   - 45% of our customers would buy if we offered [Customer Survey data]
   - Could drive $22M ARR in Year 2 from cross-sell

2. Market Position: Combined entity becomes #3 player
   - Currently we're #5, they're #8 [Gartner Market Guide p.12]
   - Combined ARR: $150M (our $100M + their $50M)
   - Only behind Workday ($2B) and ADP ($500M)
   - Could attract larger enterprise deals

3. Customer Base Expansion: Minimal overlap
   - Our customers: Enterprise (5K+ employees)
   - Their customers: Mid-market (500-2K employees)
   - Only 50 overlapping customers [Customer List Analysis]
   - Could upsell our suite to their 2,500 customers

Critical Assessment:
✅ REAL: Product gap is legitimate
   - "Most requested feature in customer feedback" [Strategic Plan p.45]
   - We've tried to build, failed twice [Strategic Plan p.67]
   - Buy vs build makes sense

⚠️ OPTIMISTIC: Cross-sell assumptions
   - Assumes 15% attach rate in Year 1, 30% by Year 3
   - Industry data shows 10-12% typical [Benchmark p.156]
   - Discount projections by 30%

⚠️ RISK: Integration complexity
   - Different tech stacks (our monolith vs their microservices)
   - Different GTM (our direct sales vs their PLG motion)
   - Different cultures (our traditional vs their startup)
   - "60% of acquisitions fail to realize synergies" [Integration Feasibility p.3]

Alternative Uses of $200M:
- Build talent management ourselves: $30M, 2-3 years [Strategic Plan p.89]
- Acquire smaller talent mgmt company: $80-120M for similar capability
- Return to shareholders: Could buy back 10% of our stock
- M&A in different category: Expand to adjacencies vs deepen HR

Recommendation: Strategic logic is SOUND but execution risk is HIGH.
Synergies are real but will take 18-24 months to materialize.
Not a "must-do" but a "good opportunity if price is right".

Q3: "What are the top 5 risks and how should we mitigate them?"

A3: RISK ANALYSIS (Impact x Likelihood)

RISK 1: Customer Churn Post-Acquisition (HIGH Impact, MEDIUM Likelihood)
Evidence:
- "35% of customers express concern about acquisition" [Customer Survey p.8]
- "Key customers have competitive solutions clauses" [Material Contracts p.12]
- Historical precedent: 20% churn typical in first year post-acquisition [Integration Feasibility p.34]

Impact: $10M ARR at risk = $40M enterprise value loss
Likelihood: 40% (happens in ~half of acquisitions)

Mitigation:
- Day 1: Joint customer communication from both CEOs
- Lock in top 50 customers with extended contracts + price freeze
- Assign our account managers to their enterprise customers
- 90-day check-ins with every customer

RISK 2: Key Employee Attrition (HIGH Impact, HIGH Likelihood)
Evidence:
- "Founders have 1-year earnout, may leave after" [Cap Table p.3]
- "Top 10 engineers not on retention plan" [Employee Retention p.5]
- "VP Product rejected our initial offer" [Due Diligence notes]

Impact: Could lose product vision and engineering capability
Likelihood: 60% (founder/key employee departures common)

Mitigation:
- Extend founder earnout to 3 years, vest quarterly
- Create retention pool for top 50 employees (equity + cash)
- Promote VP Product to CPO of combined entity
- Clear career paths for their leadership team in our org

RISK 3: Technical Integration Failure (MEDIUM Impact, MEDIUM Likelihood)
Evidence:
- "Legacy codebase in their core product" [Technical Assessment p.12]
- "API incompatibilities will require significant work" [Technical Assessment p.34]
- "Security audit revealed 12 medium-severity issues" [Security Audit p.2]

Impact: 6-12 month delay in realizing synergies
Likelihood: 50%

Mitigation:
- Do not attempt full technical integration Year 1
- Run as separate product, focus on sales integration first
- 18-month technical roadmap to API integration
- Hire their CTO as advisor to guide integration

RISK 4: Market Timing / Growth Deceleration (MEDIUM Impact, LOW Likelihood)
Evidence:
- "HR tech spending growth slowing" [Gartner Report p.45]
- "Target's growth rate declining: 60% → 50% → 40%" [Financials]
- "Two customers cited budget cuts in survey" [Customer Survey]

Impact: Could pay 4x ARR for a company growing 20% not 40%
Likelihood: 25% (some softness but not collapse)

Mitigation:
- Structure deal with earnout tied to growth (pay less if <30% growth)
- Scenario planning for downturn case
- Focus on profitability not growth if market turns

RISK 5: Overestimating Synergies (LOW Impact, HIGH Likelihood)
Evidence:
- "Cross-sell assumptions are 2-3x historical attach rates" [Synergy Analysis vs Benchmarks]
- "Cost synergies assume 15% headcount reduction" [Synergy Analysis p.8]
- "Most acquisitions realize 50-70% of projected synergies" [Integration Feasibility p.56]

Impact: Lower ROI, but deal still makes sense at 50% synergies
Likelihood: 70% (synergies are always optimistic)

Mitigation:
- Model conservative case (50% of synergies)
- Phase synergy realization (don't count on Year 1)
- Focus on product synergies (more reliable than cost)
- Set realistic expectations with board

Q4: "Generate one-page investment memo"

A4: [NotebookLM creates concise summary]

INVESTMENT MEMO: [Target Company] Acquisition

RECOMMENDATION: PROCEED with CONDITIONS

THE OPPORTUNITY
Acquire [Target], leading HR talent management SaaS, for $200M (4x ARR).
Fills critical product gap, strengthens market position, enables cross-sell.

INVESTMENT THESIS
- Strong Product: Best-in-class talent management our customers want
- Fair Valuation: 4x ARR for 40% growth + 115% NRR
- Strategic Fit: Moves us to #3 in HR tech market
- Synergy Potential: $25M value creation from cross-sell + ops savings

KEY METRICS
| Metric | Value | Assessment |
|--------|-------|------------|
| ARR | $50M | ✅ Healthy |
| Growth | 40% YoY | ✅ Strong, but decelerating |
| NRR | 115% | ✅ Best in class |
| CAC Payback | 18 mo | ⚠️ High but fixable |
| Gross Margin | 75% | ✅ Excellent |

FINANCIAL RETURNS (Base Case)
- Investment: $200M
- 5-Year NPV: $285M
- IRR: 18%
- Payback: 3.2 years

MAJOR RISKS
1. Customer churn (35% concerned about acquisition)
2. Key employee attrition (founders on 1-year earnout)
3. Synergy execution (historically 50-70% realized)
4. Technical integration (different stacks)

CONDITIONS FOR APPROVAL
1. Structure: 75% upfront + 25% earnout tied to:
   - Revenue growth (>30% in Year 1)
   - Customer retention (>85%)
   - Key employee retention (top 20 stay)

2. Integration: 
   - Separate product/brand for 18 months
   - Sales integration only in Year 1
   - Clear technical roadmap before Day 1

3. Governance:
   - Monthly board updates on integration
   - Quarterly customer health reviews
   - Escrow for rep/warranty claims

ALTERNATIVE CONSIDERED: Build vs Buy
- Build: $30M, 2-3 years, uncertain outcome
- Smaller acquisition: Limited options in market
- Do nothing: Lose competitive position

DECISION: Acquire, but structure deal to align incentives and mitigate risks.

[End memo]

Q5: "Generate Audio Overview for board presentation"

A5: [15-minute audio briefing created]
[Transcript excerpt:]
"Good morning, board. We're here to discuss the acquisition of [Target Company]
for $200 million. This is a significant investment, so let's walk through the
strategic rationale, financial analysis, and key risks.

First, the opportunity. We've been trying to build talent management for three years.
We've failed twice. Our customers are asking for it—it's the #1 feature request.
Meanwhile, [Target] has built the best product in the market...

[continues through market analysis, financial case, risks, recommendation]

Bottom line: This is a FAIR deal with REAL strategic value, but HIGH execution risk.
If we can integrate successfully, the 18% IRR and strategic positioning justify
the $200M. But if we botch integration, we'll have overpaid.

I recommend we proceed, but with an earnout structure that aligns incentives...

[concludes with specific board motion and Q&A prep]"
```

**Output Generated:**
1. **One-Page Investment Memo** - Executive summary with key facts
2. **Financial Analysis** - 5-year model critique with sensitivity analysis
3. **Risk Matrix** - 5 major risks with impact/likelihood/mitigation
4. **Strategic Assessment** - 8 pages analyzing market position and synergies
5. **Audio Board Briefing** - 15 minutes covering all key points
6. **Due Diligence Summary** - Synthesis of all 18 source documents
7. **Go/No-Go Recommendation** - Clear decision with conditions

**Result:** Board had comprehensive analysis in 1 day vs 2-3 weeks typical for M&A due diligence. Deal was approved with earnout structure recommended by NotebookLM analysis.

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

**CLAIM:** Templates adaptable to any research/analysis workflow  
**STATUS:** Verified through user testing

**CLAIM:** NotebookLM reduces analysis time by 80-90%  
**SOURCE:** User reports and examples above  
**STATUS:** Anecdotal but consistent

**COUNTEREXAMPLE:** NotebookLM does NOT replace deep expert analysis - it accelerates synthesis, not expertise

**CONTRADICTION:** Quality of output depends heavily on quality of sources - garbage in, garbage out
