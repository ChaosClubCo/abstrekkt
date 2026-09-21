# Template 6: Performance Plan (Targets + Bottleneck Map + Fix List)

## COPY/PASTE INPUT BLOCK

```
GOAL:
Produce a performance plan including target metrics, bottleneck hypotheses, measurement strategy, and prioritized fixes.

CONTEXT:
- App type: SPA/PWA/SSR
- Must be measurable: LCP/TTFB/CLS for web; startup time for mobile

CONSTRAINTS:
- Recommend instrumentation first, then optimizations
- Avoid premature micro-optimizations; focus on top contributors

INPUTS:
[Paste: stack, current metrics (if any), key screens, and network/API patterns]

OUTPUT NEEDS:
- Markdown
- Include: KPI targets; profiling steps; top 10 likely bottlenecks; fixes; verification steps; CLAIMS CHECK

MODE SWITCHES:
- ReasoningEngine=StepBack
- Framework=TAG
- OutputFormat=Markdown
```

## USAGE NOTES

- Paste your tech stack and any existing performance metrics
- StepBack reasoning restates the problem at higher level before diving in
- TAG (Task, Action, Goal) keeps focus on performance objectives
- Output prioritizes measurement before optimization
