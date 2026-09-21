# PWA Decision Framework

> **Purpose**: Tool-agnostic guide to deciding IF, WHEN, and HOW MUCH of a PWA to build.
> **Use this when**: Evaluating whether a PWA conversion is worth the investment for a specific project.

See `diagrams/pwa-decision-tree.mermaid` and `diagrams/pwa-decision-tree.svg` for the visual decision flowchart.

---

## The Three Pillars (All Optional)

A "PWA" isn't all-or-nothing. It's three independent capabilities you can adopt separately:

| Pillar | What It Does | Effort | Value Signal |
|--------|-------------|--------|-------------|
| **Installability** | App icon on home screen, standalone window | 4–8h | Users visit ≥3x/week |
| **Offline Support** | Works without network, cached content | 40–80h | Users in low-connectivity environments |
| **Push Notifications** | Server-triggered alerts when app is closed | 24–40h | Time-sensitive content, re-engagement needed |

**You don't need all three.** Pick the pillars that match your users' actual behavior.

---

## Four Implementation Paths

### Path A: Manifest Only (4 hours)

**What**: Add `manifest.json` + icons. Nothing else.

**Result**: "Add to Home Screen" works, app gets standalone window, listed in some app directories.

**When to choose**: App is already fast, users are always online, you just want the install UX.

**Cost**: ~4 hours of engineer time. Zero ongoing maintenance.

### Path B: Offline-Capable (40–80 hours)

**What**: Manifest + service worker + caching strategies.

**Result**: App works offline (at least read-only), loads instantly on repeat visits, resilient to flaky networks.

**When to choose**: Users travel, have unreliable WiFi, or revisit frequently. Content is mostly read-heavy.

**Cost**: 40–80 hours initial + 2–4 hours/month cache strategy tuning.

### Path C: Full PWA (120–200 hours)

**What**: Everything in Path B + push notifications + background sync + advanced performance.

**Result**: App-store-quality experience delivered via the web. Re-engagement via push. Works offline with write support.

**When to choose**: You'd otherwise build a native app, but your team is web-first. Or you need to reach users who won't install from app stores.

**Cost**: 120–200 hours initial + 8–16 hours/month maintenance.

### Path D: Framework Plugin (8–16 hours)

**What**: Drop in Vite PWA Plugin or Next.js PWA module. Handles manifest, SW generation, precaching automatically.

**Result**: Basic PWA with minimal code. Good enough for many apps.

**When to choose**: Standard caching needs, no custom offline logic, want fastest path to "PWA badge."

**Cost**: 8–16 hours initial. Limited customization.

---

## Cost-Benefit Analysis Template

### Benefits Worksheet

| Benefit | Applies? | Estimated Impact |
|---------|----------|-----------------|
| Reduced bounce from slow loads | | % improvement in load time |
| Offline access for field users | | # users affected |
| Push notification re-engagement | | Projected click-through rate |
| Home screen presence | | % increase in return visits |
| Avoid app store fees/review | | $ saved, days saved |
| Single codebase (web + "app") | | Engineering hours saved |

### Cost Worksheet

| Cost | Hours | $/hr | Total |
|------|-------|------|-------|
| Initial development | | | |
| Testing (cross-browser) | | | |
| Monthly maintenance | | | |
| Push server infrastructure | | | |
| Icon/screenshot asset creation | | | |

### Break-Even Question

> "If this PWA increases retention by X% or reduces support tickets by Y, does it pay for itself within 6 months?"

If no → Path A or skip.
If yes → Path B, C, or D depending on which pillars drive the value.

---

## Honest Assessment Questions

Answer these before committing:

1. **Do your users actually revisit?** If your app is used once/month, installability and offline don't matter. Push might.

2. **Is your content cacheable?** Real-time dashboards with per-second updates get little benefit from offline caching. Content platforms and reference apps get enormous benefit.

3. **Does your team have SW expertise?** Service workers are a new execution context with different debugging patterns. Budget learning time.

4. **Can you test on real devices?** Emulators miss Safari quirks, actual offline behavior, and real-world network conditions.

5. **Is your deployment pipeline ready?** SW updates require careful cache invalidation. A broken SW can serve stale content indefinitely.

6. **Will you maintain it?** A neglected SW with outdated caches is worse than no SW. Budget ongoing maintenance.

---

## Common Failure Modes

| Failure | Cause | Prevention |
|---------|-------|-----------|
| Stale content served forever | SW caches aggressively, no versioning | Version-prefix caches, cache-bust on deploy |
| "App" that's just a bookmark | Manifest only, no offline/perf investment | Choose Path B+ or don't call it a PWA |
| Push notification spam | Sent too frequently, irrelevant content | Preference center, frequency caps, relevance scoring |
| Offline mode breaks on update | New routes not in SW, old cache structure | E2E test offline flow in CI |
| Users can't find install button | Relying on browser's default prompt | Custom install UI, contextual timing |
| Safari users get degraded experience | Didn't test on iOS, no workarounds | Test on real iOS devices, implement fallbacks |

---

## Decision Flowchart

See `diagrams/pwa-decision-tree.mermaid` for the full rendered version. Summary:

```
Users visit weekly+ AND content is cacheable?
  YES → Do users need offline access?
    YES → Path B or C
    NO → Do you need push re-engagement?
      YES → Path A + Push (custom path)
      NO → Path A or D
  NO → Is it a content/media app with SEO needs?
    YES → Path D (basic PWA for Lighthouse score)
    NO → Skip PWA, invest elsewhere
```

---
*Intinc Engineering — PWA Decision Framework v2.0*
