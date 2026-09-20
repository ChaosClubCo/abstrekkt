# Phase E: Evolution

**"What got you to launch won't get you to scale. Let data decide what changes next."**

---

## What This Phase Is

Evolution is the ongoing discipline of improving your app based on evidence rather than intuition. It's not a one-time phase — it's a recurring cycle that begins after deployment and continues for the life of the product.

Phase D got your app into production. Phase E asks: now what? Which features need improvement? Where are users struggling? What's breaking silently? What should you build next — and what should you stop maintaining?

This phase is where the monitoring from Phase A and the deployment infrastructure from Phase D pay off. Without data, evolution is guessing. With data, it's engineering.

### Phase Gate

Do not proceed to Phase L (Launch) until:

- **All audit scores averaging ≥ 60** across the seven dimensions
- **No individual score below 40** — any dimension below 40 blocks launch
- **Performance baselines established** (you know what "normal" looks like for your metrics)
- **Feedback loop operational** — you have a channel for users to report issues and request features

---

## Step 1: Establish Baselines

You can't improve what you don't measure. Before making any changes, record the current state of your app.

### What to Baseline

| Category | Metrics | Source |
|---|---|---|
| **Performance** | LCP, CLS, INP, TTFB, bundle size, startup time | Lighthouse, web-vitals, Sentry Performance |
| **Reliability** | Error rate, crash rate, uptime percentage, failed API calls | Sentry, uptime monitor |
| **Usage** | DAU/WAU/MAU, session length, feature adoption rates | PostHog |
| **Quality** | Audit CLI scores (all 7 dimensions), test coverage percentage | `intinc-audit scan`, vitest coverage |
| **Cost** | Hosting spend, AI feature spend, third-party API costs | Provider dashboards |

### Running a Baseline Audit

```bash
intinc-audit scan --dir . --output baseline-$(date +%Y%m%d).json
```

Save this file. You'll compare against it after every significant change to verify scores are trending upward — or at least not regressing.

### For Prototypes in Ongoing Conversion

If you're incrementally migrating features from a prototype (the approach from Phase T), run the audit after each feature migration. The scores should climb with each batch:

- After scaffolding (Phase S): typically 55-65 overall
- After adding tests (Phase T): climbs to 60-70
- After monitoring setup (Phase A): climbs to 65-75
- After deployment hardening (Phase D): climbs to 70-80

If scores plateau or drop, something in the latest migration introduced a regression. Investigate before continuing.

---

## Step 2: Analyze Usage Data

PostHog (or your analytics tool) answers the questions that drive evolution decisions.

### The Questions That Matter

| Question | What It Tells You | Where to Find It |
|---|---|---|
| Which features are used most? | Where to invest next | PostHog event frequency |
| Which features are never used? | Candidates for removal | PostHog event frequency (zero or near-zero) |
| Where do users drop off? | Friction points to fix | PostHog funnels |
| How long do sessions last? | Engagement depth | PostHog session recordings |
| What do users search for that doesn't exist? | Unmet needs | Search logs, support requests |
| Which errors do users encounter most? | Reliability priorities | Sentry issue frequency |

### Feature Adoption Tracking

For every feature shipped, track:

- **Activation rate** — what percentage of users try it at least once
- **Retention rate** — what percentage continue using it after first try
- **Time to value** — how long between first visit and first meaningful action

Features with high activation but low retention have a UX problem. Features with low activation may have a discovery problem — or may not be solving a real need.

### AI Feature Specific Metrics

If you shipped AI features in Phase A, track:

- **Acceptance rate** — how often users keep the AI-generated output vs. discard it
- **Edit rate** — how often users modify the AI output before using it
- **Fallback rate** — how often the fallback path triggers
- **Cost per useful output** — total AI cost divided by accepted outputs

An acceptance rate below 50% means the AI feature is wrong more often than it's right. Either improve the prompts, constrain the output, or remove the feature.

---

## Step 3: Prioritize Improvements

Data tells you what's happening. Prioritization decides what you do about it.

### The Impact/Effort Matrix

For every potential improvement, estimate:

- **Impact**: How many users does this affect? How much does it improve their experience?
- **Effort**: How many hours to implement, test, and deploy?

| | Low Effort | High Effort |
|---|---|---|
| **High Impact** | Do first — quick wins that move metrics | Plan carefully — high-value but resource-intensive |
| **Low Impact** | Do if spare capacity — nice but not urgent | Don't do — poor return on investment |

### Common Evolution Priorities

Based on patterns across the apps I've built and the service engagements I've observed at INT:

**Almost always high priority:**
- Fixing the top 3 most-frequent errors (Sentry)
- Improving the slowest page or interaction (Sentry Performance)
- Adding offline support if users are losing work (PostHog drop-off data)
- Improving onboarding if activation rate is low

**Often deferred but shouldn't be:**
- Accessibility improvements (keyboard navigation, screen reader support)
- Performance optimization on mobile devices
- Data export capabilities (users want their data)
- Documentation and help content

**Often prioritized but shouldn't be:**
- New features before existing features work well
- Visual redesign when the UX is the actual problem
- Technology migration for its own sake (unless security or maintenance demands it)

---

## Step 4: Run the Evolution Cycle

Evolution is a loop, not a line. After each improvement cycle, re-measure and re-prioritize.

### The Cycle

```
Measure → Analyze → Prioritize → Implement → Test → Deploy → Measure
```

### Cadence

| Cycle Type | Frequency | What It Covers |
|---|---|---|
| **Quick fixes** | Continuous | Bug fixes, error resolution, minor UX improvements |
| **Feature iteration** | Every 2-4 weeks | Feature improvements based on usage data |
| **Full audit** | Monthly | `intinc-audit scan` across all dimensions, score comparison to baseline |
| **Architecture review** | Quarterly | Tech debt assessment, dependency updates, security patches |

### The Monthly Audit

```bash
# Run monthly against the production codebase
intinc-audit scan --dir . --output audit-$(date +%Y%m).json

# Compare to baseline
# (manually or load both into the audit dashboard)
```

Track these trends:

- **Overall score**: should increase or hold steady month over month
- **Security posture**: should never decrease
- **Test coverage**: should increase until it stabilizes at 70%+
- **Any dimension below 40**: blocks Phase L, must be addressed immediately

### Handling Regressions

If a score drops after a change:

1. Identify which dimension dropped and by how much
2. Check the most recent commits for changes in that area
3. If the regression is intentional (e.g., removing a feature reduced file count), document why
4. If unintentional, fix before continuing with new work
5. Re-audit to confirm the fix

---

## Step 5: Manage Technical Debt

Every app accumulates technical debt. Phase E is where you pay it down — incrementally, not in a massive rewrite.

### Identifying Debt

| Signal | Likely Debt | Action |
|---|---|---|
| Tests are slow | Test suite grew without optimization | Parallelize, mock expensive operations |
| Build times increasing | Bundle bloat, unnecessary dependencies | Run bundle analyzer, prune deps |
| Audit scores plateauing | Structural issues, not surface fixes | Review architecture, consider refactoring |
| Same bugs recurring | Missing test coverage in that area | Add regression tests |
| New features take longer than expected | Coupling, unclear abstractions | Refactor affected modules |
| Dependency audit shows vulnerabilities | Outdated packages | Update or replace |

### The 20% Rule

A sustainable approach: allocate roughly 20% of development time to debt reduction. Not a debt sprint. Not "we'll clean up later." A consistent, ongoing allocation that prevents debt from compounding.

This means in a 2-week cycle, 2 days go to: dependency updates, test improvements, refactoring, performance optimization, documentation, and security patches. The other 8 days go to features and bug fixes.

### When to Consider a Rewrite

Rewrites are almost always more expensive than incremental improvement. Consider a rewrite only when:

- The architecture fundamentally can't support the next major capability (e.g., single-tenant app that needs to become multi-tenant)
- The tech stack is end-of-life with no migration path (e.g., framework abandoned, no security patches)
- Cumulative debt makes every change take 5-10x longer than it should
- And even then, prefer incremental migration (strangler fig pattern) over big-bang rewrite

---

## Phase E Checklist

- [ ] Performance baselines established and documented
- [ ] Usage analytics operational (PostHog events, funnels, sessions)
- [ ] Feature adoption tracked (activation rate, retention, time to value)
- [ ] If AI features: acceptance rate, edit rate, fallback rate tracked
- [ ] Error priorities identified from Sentry (top 3 issues)
- [ ] Impact/effort matrix produced for potential improvements
- [ ] First evolution cycle completed (measure → implement → re-measure)
- [ ] Monthly audit cadence established
- [ ] Score trends documented (should be upward or stable)
- [ ] No individual audit dimension below 40
- [ ] All dimensions averaging ≥ 60
- [ ] Technical debt identified and prioritized
- [ ] 20% time allocation for debt reduction established
- [ ] Feedback channel operational (users can report issues and requests)
- [ ] Dependency audit completed — no known vulnerabilities

---

## Common Failures

**"We'll optimize later."**
Later never comes. Performance, security, and reliability degrade incrementally. Without the monthly audit cycle, you won't notice until users do.

**"Users aren't complaining, so it's fine."**
Most users who encounter problems leave silently. Your error tracking and analytics are your proxy for user experience. If Sentry shows errors and PostHog shows drop-offs, users are having problems — they're just not telling you.

**"We need to rewrite everything."**
Almost never true. Incremental improvement is cheaper, lower-risk, and preserves working functionality. Rewrites throw away working code alongside broken code.

**"Let's add more features."**
New features on top of a shaky foundation create more problems than they solve. Fix reliability and performance first. Phase E should improve existing features before adding new ones — unless usage data clearly shows unmet needs.

**"The audit score doesn't matter once we've launched."**
The audit score is a health check, not a launch gate. A score that drops after launch means something degraded. Track it monthly.

---

## AI Your BI℠: Claude in Phase E

Three specific uses:

**Usage Pattern Analysis** — Export PostHog data and ask Claude to identify patterns: which features are sticky, where users drop off, what usage sequences predict retention. Claude can surface correlations that aren't obvious in dashboards.

**Prioritization Assistance** — Provide your list of potential improvements with rough impact and effort estimates. Ask Claude to challenge your estimates, identify dependencies between items, and suggest a sequence that maximizes cumulative impact.

**Debt Assessment** — Paste your audit scores over time and ask Claude to identify which dimensions are stagnating and what architectural changes would unblock improvement. Claude can also review dependency lists and flag packages that are outdated, deprecated, or have known vulnerabilities.

Example prompt:

```
Here are my audit scores for the last 3 months:
[paste monthly audit JSONs]

And my top 10 Sentry errors:
[paste error summaries]

And my PostHog feature adoption rates:
[paste feature data]

Analyze:
1. Which dimensions are improving, stagnating, or regressing?
2. What are the top 3 highest-impact improvements I should make?
3. Is there technical debt blocking progress in any dimension?
4. What should I stop investing in (low adoption, high maintenance)?
```

---

## References

- Audit CLI: `intinc-audit scan --dir .` for monthly scoring
- Audit Dashboard: `assets/audit-dashboard.jsx` for visual score tracking
- Scoring Spreadsheet: `assets/app-audit-scoring-template.xlsx` for trend documentation
- `ref/diagrams/svg/performance-optimization.svg` — Optimization paths
- PostHog documentation for event tracking and funnel configuration
- Sentry documentation for error prioritization and performance monitoring

---

**Previous Phase:** [← Phase D: Deployment](./D-deployment.md)
**Next Phase:** [Phase L: Launch →](./L-launch.md)
