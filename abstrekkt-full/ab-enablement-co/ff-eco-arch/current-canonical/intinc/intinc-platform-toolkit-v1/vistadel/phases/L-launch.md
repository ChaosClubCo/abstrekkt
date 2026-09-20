# Phase L: Launch

**"Launch is a gate, not a finish line."**

---

## What This Phase Is

Launch is the final quality gate before your app is declared production-ready. It's not a celebration step — it's a verification step. Everything built in Phases V through E gets tested against the highest bar: is this app ready for real users to depend on it?

Phase E established that your app is improving based on data. Phase L confirms it has crossed the threshold from "deployed and iterating" to "production-grade and reliable." The difference is confidence — backed by evidence, not hope.

For prototype conversions, Launch is the moment the rebuilt app replaces or supersedes the prototype. The prototype was a personal tool. The launched app is something others can rely on.

### Phase Gate

This is the final gate. All previous gates must also be met:

- **Overall audit score ≥ 70**
- **No individual dimension below 50**
- **All checklist items from the appropriate platform checklist completed** (PWA audit or Electron security)
- **Incident response plan documented** — you know what to do when something breaks
- **At least one full cycle of Phase E completed** — you've measured, improved, and re-measured

---

## Step 1: Run the Launch Audit

The audit CLI provides the quantitative foundation for the launch decision.

```bash
intinc-audit scan --dir . --output launch-audit.json
```

### Score Requirements

| Dimension | Minimum | Target | What It Means |
|---|---|---|---|
| PWA / Electron / Tauri Readiness | 60 | 80+ | Platform-specific features are complete and working |
| Code Quality | 50 | 75+ | TypeScript strict, linting, modular architecture |
| Security Posture | 50 | 70+ | Auth, RLS, CSP, input validation, no exposed secrets |
| Test Coverage | 50 | 70+ | Unit + integration + E2E, CI enforced |
| Production Readiness | 50 | 70+ | Monitoring, error tracking, deploy pipeline, rollback |
| **Overall** | **70** | **80+** | **Weighted composite of all dimensions** |

If any dimension is below 50, go back to the relevant phase and address the gap before proceeding.

### Comparing to Baseline

Pull up the baseline from Phase E:

```bash
# Compare launch audit to your first audit
# Load both into the dashboard or review side-by-side
```

The overall score should be significantly higher than when you started. If your prototype started at 25 and you're now at 72, that's a successful conversion. If you scaffolded fresh and you're at 78, that's a strong new build. The specific number matters less than the trajectory — scores should have been climbing steadily through Phases S, T, A, D, and E.

---

## Step 2: Complete the Platform Checklist

The toolkit includes comprehensive checklists for PWA and Electron. These are not automated — they require manual verification of items the audit CLI can't check.

### PWA Launch Checklist (`ref/templates/pwa-audit-checklist.md`)

The full checklist covers:

**Caching and Offline:**
- Service worker registered and controlling all pages
- Precache manifest includes all critical assets
- Cache strategies configured per resource type (Cache-First for images, Network-First for API, Stale-While-Revalidate for CSS/JS)
- Offline fallback page exists for uncached routes
- Cache versioning implemented — old caches pruned on activation
- Storage estimate checked — app warns users if storage is low

**Push Notifications:**
- VAPID keys generated and configured
- Subscription flow works (prompt → subscribe → server stores subscription)
- Push messages display correctly across browsers
- Notification click routes to the correct page
- Unsubscribe flow works

**Performance:**
- Lighthouse Performance score ≥ 85
- Lighthouse PWA score ≥ 90
- LCP < 2.5s on mobile
- CLS < 0.1
- INP < 200ms
- Bundle size within budget (JS < 200KB, CSS < 50KB gzipped)

**Security:**
- HTTPS enforced — no mixed content
- CSP headers configured and tested
- No sensitive data in client-side storage
- Auth tokens stored securely (httpOnly cookies or secure session)
- Input validation on all forms

**Install Experience:**
- Web app manifest valid (name, icons, start_url, display)
- Install prompt appears and functions correctly
- App works as installed PWA (standalone mode, no browser chrome)
- App icon appears on home screen / desktop

### Electron Security Checklist (`ref/templates/electron-security-checklist.md`)

**Window Configuration:**
- `nodeIntegration: false` on all windows
- `contextIsolation: true` on all windows
- `sandbox: true` on all windows
- `webSecurity: true` (not disabled)
- Navigation blocked to external URLs
- New window creation blocked (setWindowOpenHandler returns deny)

**IPC Security:**
- All IPC uses `invoke`/`handle` pattern — no `send`/`on`
- Input validation on all IPC handlers (using Zod or equivalent)
- File path validation prevents directory traversal
- No raw file system access from renderer

**Distribution:**
- Code signing configured for macOS and Windows
- ASAR packaging enabled
- Auto-updater configured with signature verification
- Hardened runtime enabled (macOS)

**CSP:**
- Content-Security-Policy header set
- No `unsafe-eval` in CSP
- No `unsafe-inline` in script-src (style-src may allow it for CSS-in-JS)
- Connect-src limited to known domains

---

## Step 3: Write the Incident Response Plan

Before launch, document what happens when something goes wrong. Not if — when.

### Incident Response Template

```markdown
# Incident Response Plan: [App Name]

## Detection
- How we detect incidents: [Sentry alerts, uptime monitor, user reports]
- Who gets notified: [names, channels]
- Response time target: [e.g., acknowledge within 15 minutes during business hours]

## Severity Levels
- P1 (Critical): App is down or data loss occurring. [Action: all hands, immediate response]
- P2 (Major): Core feature broken, workaround exists. [Action: fix within 4 hours]
- P3 (Minor): Non-core feature broken or degraded. [Action: fix in next release cycle]

## Diagnosis
- Check Sentry for errors: [dashboard URL]
- Check hosting status: [Vercel/Cloudflare status page]
- Check external dependencies: [Supabase status, API provider status]

## Rollback
- PWA: Redeploy previous version in [host dashboard]
- Desktop: Publish hotfix release or toggle feature flag in PostHog

## Communication
- Internal: [Slack channel, email list]
- External (if applicable): [status page, email to affected users]

## Post-Incident
- Write post-mortem within 48 hours
- Identify root cause
- Add regression test
- Update monitoring to detect earlier
```

This doesn't need to be elaborate. It needs to exist and be findable when you're stressed at 2 AM.

---

## Step 4: Make the Launch Decision

Launch is an explicit decision, just like the go/no-go in Phase V. Review the evidence and decide.

### Decision Framework

| Condition | Decision |
|---|---|
| Audit score ≥ 70, all dimensions ≥ 50, checklists complete, incident plan documented | **LAUNCH** |
| Audit score 60-69, one dimension at 45-49 | **CONDITIONAL** — fix the weak dimension, re-audit, then launch |
| Audit score < 60, or any dimension below 40 | **NOT READY** — return to the relevant phase |
| Checklists incomplete | **NOT READY** — complete all items first |
| No incident response plan | **NOT READY** — write it first, it takes 30 minutes |

### What Launch Means

Launching doesn't mean:
- The app is finished (it's never finished — Phase E continues)
- No more bugs will be found (they will — Sentry is watching)
- The feature set is complete (it isn't — roadmap continues)

Launching means:
- The app meets minimum quality standards across all dimensions
- You have the infrastructure to detect and respond to problems
- Users can rely on the app for its intended purpose
- You can iterate safely without breaking what works

---

## Step 5: Post-Launch Operations

After launch, Phase E becomes your permanent operating mode. But the first 30 days after launch deserve extra attention.

### First 7 Days

- Check Sentry daily — new errors are most likely to appear when new users interact with the app in unexpected ways
- Monitor performance — real-world performance often differs from Lighthouse tests
- Watch feature adoption — are users finding and using the core features?
- Respond to feedback quickly — first users form strong impressions

### First 30 Days

- Run a full audit at day 30 — compare to launch audit
- Review all Sentry issues — triage and fix the top 5
- Analyze PostHog funnels — identify and fix the biggest drop-off
- Check cost trends — verify spend is within projections
- Decide on the next evolution cycle priorities based on 30 days of data

### Ongoing

Phase E's monthly cycle continues indefinitely:

```
Monthly audit → score comparison → prioritize improvements → implement → re-audit
```

The app is launched. The framework is complete. But the work continues — informed by data, protected by tests, and deployed with confidence.

---

## Phase L Checklist

- [ ] Launch audit completed — overall score ≥ 70
- [ ] No individual dimension below 50
- [ ] Score trajectory shows consistent improvement from baseline
- [ ] PWA checklist completed (if PWA target)
- [ ] Electron security checklist completed (if Electron target)
- [ ] Tauri permissions and security verified (if Tauri target)
- [ ] Incident response plan documented and findable
- [ ] Rollback procedure verified (tested in Phase D)
- [ ] Monitoring live and alerting configured (from Phase A/D)
- [ ] At least one full Phase E cycle completed before launch
- [ ] Launch decision made explicitly — GO / CONDITIONAL / NOT READY
- [ ] Post-launch 7-day monitoring plan in place
- [ ] Post-launch 30-day review scheduled

---

## Common Failures

**"It's good enough, let's just ship."**
"Good enough" without a score is a feeling, not a decision. Run the audit. Check the checklists. If the numbers support it, ship. If they don't, fix what's missing — it's usually less work than you think.

**"We'll write the incident plan when we need it."**
When you need it, you'll be stressed and rushing. Write it now, when you're calm. 30 minutes of planning saves hours of chaos.

**"Launch is the goal."**
Launch is a gate. The goal is a reliable app that users depend on. The gate confirms you're ready. The goal is achieved through the ongoing work of Phase E.

**"We need more features before launch."**
You don't. Your Phase V MVP promise defines what launch requires. Everything else is Phase E evolution. Ship the MVP, measure, then decide what's next — with data, not assumptions.

**"Nobody will notice the issues."**
They will. The first users are the most observant. They're also the most forgiving if you respond quickly. Launch with monitoring in place so you can respond within minutes, not days.

---

## AI Your BI℠: Claude in Phase L

Three specific uses:

**Launch Readiness Review** — Paste your audit scores, checklist status, and any known open issues. Ask Claude to assess launch readiness and identify the highest-risk gaps. Claude can prioritize which remaining items are truly blocking vs. acceptable post-launch.

**Incident Response Drafting** — Describe your app's architecture, hosting, and team structure. Claude generates a tailored incident response plan with detection, diagnosis, rollback, communication, and post-mortem sections.

**Post-Launch Analysis** — After 30 days, paste your Sentry error summary, PostHog adoption data, and score comparison. Ask Claude to identify the top priorities for the next evolution cycle and flag any regressions that need immediate attention.

Example prompt:

```
My app launches today. Here is the current state:
- Audit scores: [paste launch-audit.json summary]
- Open Sentry issues: [count and top 3]
- PostHog: [DAU, top features, known drop-offs]
- Checklist status: [complete / X items remaining]
- Known risks: [list any]

Assess:
1. Am I ready to launch? What's the biggest risk?
2. What should I monitor most closely in the first 7 days?
3. What's the most likely thing to break?
4. Draft a 30-day post-launch review agenda
```

---

## References

- Audit CLI: `intinc-audit scan --dir .`
- `ref/templates/pwa-audit-checklist.md` — Complete PWA launch checklist
- `ref/templates/electron-security-checklist.md` — Complete Electron security checklist
- Audit Dashboard: `assets/audit-dashboard.jsx` — Visual score tracking
- All previous phase documents — each phase's checklist contributes to launch readiness

---

**Previous Phase:** [← Phase E: Evolution](./E-evolution.md)

---

*VISTADEL: Vision → Integration → Stack → Testing → AI Implementation → Deployment → Evolution → Launch*

*This is Version 1.0 of the framework. It will evolve — informed by real usage, real projects, and real feedback. That's the point.*
