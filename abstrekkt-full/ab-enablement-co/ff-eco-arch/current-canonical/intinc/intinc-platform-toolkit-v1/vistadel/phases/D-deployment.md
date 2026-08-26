# Phase D: Deployment

**"Shipping isn't the end — it's the first time your app meets reality."**

---

## What This Phase Is

Deployment is where your app leaves the safety of localhost and meets actual users, actual networks, actual devices, and actual failure conditions. This phase covers the infrastructure, pipeline, and verification that turn a local project into a running production service.

Phase A gave you a monitored, AI-augmented codebase. Phase D gets it deployed — reliably, repeatably, and with the ability to roll back when something goes wrong. The goal isn't just "it's live" — it's "it's live, we know it's healthy, and we can fix it fast if it isn't."

This phase diverges significantly by platform target. A PWA deployed to Vercel has a completely different deployment model than an Electron app distributed as a signed binary. The steps below cover all three targets with specific guidance for each.

### Phase Gate

Do not proceed to Phase E (Evolution) until:

- **Target platform score ≥ 60** (PWA readiness, Electron readiness, or Tauri readiness — whichever applies)
- **Production deployment running** and accessible by intended users
- **Health checks passing** — the app responds, errors are tracked, monitoring is live
- **Rollback procedure tested** — you've verified you can revert to the previous version

---

## Step 1: Configure Production Builds

Development builds and production builds are different. Dev builds prioritize speed (fast HMR, source maps, verbose logging). Production builds prioritize size, security, and performance.

### PWA Production Build

```bash
pnpm build
```

The Vite build produces an optimized bundle in `dist/`:

| Concern | What to Verify |
|---|---|
| Bundle size | JS < 200KB gzipped, CSS < 50KB gzipped. Check with `npx vite-bundle-visualizer`. |
| Tree shaking | No unused dependencies in the output. Vite handles this by default with ESM. |
| Service worker | Workbox generates the precache manifest. Verify `sw.js` exists in `dist/`. |
| Environment variables | Only `VITE_*` variables are included. No server secrets leak to the client bundle. |
| Source maps | Generate but don't deploy publicly. Upload to Sentry for error tracking. |
| Asset hashing | Vite adds content hashes to filenames by default. Verify for cache busting. |

### Electron Production Build

```bash
pnpm build           # Build the renderer (Vite)
pnpm build:electron  # Package with electron-builder
```

Electron builds produce platform-specific binaries in `release/`:

| Concern | What to Verify |
|---|---|
| Platforms | macOS (.dmg, universal), Windows (.exe, x64 + arm64), Linux (.AppImage, .deb) |
| Code signing | macOS: hardened runtime + notarization. Windows: Authenticode certificate. Required for distribution. |
| ASAR packaging | App source bundled into encrypted asar archive. Verify with `npx asar list app.asar`. |
| Auto-updater | `electron-builder.yml` has `publish` config pointing to GitHub Releases or custom server. |
| CSP headers | Verify Content-Security-Policy is set in the production build, not just dev. |
| Node integration | Confirm `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true` in production. |

### Tauri Production Build

```bash
pnpm build        # Build the frontend (Vite)
pnpm build:tauri  # Compile Rust + bundle
```

Tauri builds produce small native binaries:

| Concern | What to Verify |
|---|---|
| Binary size | Should be 5-15MB. If larger, check for unnecessary Rust dependencies. |
| Platforms | macOS (.dmg), Windows (.msi), Linux (.AppImage, .deb) |
| Code signing | macOS: notarization via `tauri-cli`. Windows: Authenticode. |
| Updater | `tauri.conf.json` has updater endpoint and public key configured. |
| CSP | Defined in `tauri.conf.json` under `app.security.csp`. |
| Permissions | File system scope, shell access, and dialog permissions explicitly declared. |

---

## Step 2: Set Up the Deploy Pipeline

Manual deployments break. Automated deployments are reproducible, auditable, and fast. The CI pipeline from Phase T handles testing — Phase D extends it with deployment stages.

### PWA Deployment

PWAs deploy as static files to an edge network. The toolkit supports:

**Vercel (recommended default):**
```bash
# Connect repo to Vercel (one-time)
npx vercel link

# Deploy
npx vercel --prod
```

Or configure automatic deploys: every push to `main` triggers a production deployment. Every PR gets a preview deployment.

**Cloudflare Pages:**
```bash
npx wrangler pages deploy dist/
```

**Netlify:**
```bash
npx netlify deploy --prod --dir=dist
```

**What to configure regardless of host:**

| Setting | Value |
|---|---|
| Build command | `pnpm build` |
| Output directory | `dist` |
| Node version | 20+ |
| Environment variables | Set in host dashboard, not in code |
| Custom domain | Configure DNS + SSL |
| Redirect rules | SPA fallback: all routes → `index.html` |
| Headers | Cache-Control for assets, CSP for security |

### Electron Distribution

Electron binaries are distributed directly to users — not deployed to a server. The distribution pipeline:

1. **CI builds binaries** on each target OS (GitHub Actions matrix: ubuntu, windows, macos)
2. **Code signing** happens in CI using stored certificates
3. **Artifacts uploaded** to GitHub Releases (or custom distribution server)
4. **Auto-updater** checks for new releases on app startup

The toolkit's `ref/ci/.github/workflows/electron-ci.yml` implements this pipeline.

**Code signing secrets needed in CI:**

| Platform | Secret | Purpose |
|---|---|---|
| macOS | `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD` | Notarization |
| macOS | `CSC_LINK`, `CSC_KEY_PASSWORD` | Developer certificate |
| Windows | `WIN_CSC_LINK`, `WIN_CSC_KEY_PASSWORD` | Authenticode certificate |

Without code signing, macOS blocks the app entirely (Gatekeeper) and Windows shows a warning that discourages installation.

### Tauri Distribution

Same model as Electron — CI builds binaries, signs them, uploads to releases. Tauri's built-in updater handles the rest.

The key difference: Tauri binaries are dramatically smaller, so distribution is faster and storage costs are lower.

---

## Step 3: Verify the Deployment

A deployment isn't done when the files are uploaded. It's done when you've verified the app works in production.

### PWA Verification Checklist

Run these checks against the production URL:

| Check | How | Target |
|---|---|---|
| **Lighthouse PWA** | `npx lighthouse <url> --only-categories=pwa` | Score ≥ 90 |
| **Lighthouse Performance** | Same tool, performance category | Score ≥ 85 |
| **Service worker** | DevTools → Application → Service Workers | Registered and active |
| **Manifest** | DevTools → Application → Manifest | No errors, icons load |
| **Offline** | DevTools → Network → Offline, reload | App loads from cache |
| **Install prompt** | Visit in mobile browser or desktop Chrome | "Add to home screen" appears |
| **Push notifications** | Trigger a test push | Notification appears |
| **Core Web Vitals** | PageSpeed Insights or web-vitals library | LCP < 2.5s, CLS < 0.1, INP < 200ms |
| **HTTPS** | Browser address bar | Lock icon, no mixed content warnings |
| **CSP** | DevTools → Console | No CSP violation warnings |

The toolkit includes `ref/ci/scripts/lighthouse-check.sh` for automated Lighthouse verification in CI.

### Electron Verification Checklist

| Check | How | Target |
|---|---|---|
| **Launch** | Double-click the signed binary | App opens within 3 seconds |
| **Auto-update** | Publish a test release, check update prompt | Update detected and installable |
| **IPC** | Exercise all IPC-dependent features | No "invoke" errors in console |
| **File I/O** | Read and write a file through the app | Operations complete, path validation works |
| **Tray** | Right-click system tray icon | Context menu appears with all items |
| **Offline** | Disconnect network, use app | Graceful degradation per offline strategy |
| **Memory** | Activity Monitor / Task Manager | < 300MB idle |
| **Code signing** | macOS: `spctl --assess`, Windows: right-click → Properties → Digital Signatures | Signature valid |

The toolkit includes `ref/templates/electron-security-checklist.md` for comprehensive Electron verification.

### Tauri Verification Checklist

Same as Electron, plus:

| Check | How | Target |
|---|---|---|
| **Binary size** | `ls -lh` on the built binary | < 15MB |
| **Startup** | Time from double-click to usable UI | < 2 seconds |
| **Rust commands** | Exercise all `invoke()` calls | No Tauri error panels |
| **Permissions** | Try file operations outside declared scope | Should fail with clear error |

---

## Step 4: Configure Health Monitoring

Deployment without monitoring is deployment without awareness. You need to know when something breaks before users report it.

### What to Monitor

| Layer | Tool | What It Catches |
|---|---|---|
| **Errors** | Sentry (configured in Phase A) | Unhandled exceptions, promise rejections, component crashes |
| **Performance** | Sentry Performance or Vercel Analytics | Slow pages, slow API calls, degraded Core Web Vitals |
| **Uptime** | Vercel/Cloudflare built-in, or external (UptimeRobot, Checkly) | Site down, SSL expired, DNS failure |
| **Usage** | PostHog (configured in Phase A) | Feature adoption, drop-off points, session patterns |
| **Costs** | AI provider dashboard, hosting dashboard | Unexpected spend spikes |

### Alerting

Configure alerts for:

- **Error rate spike** — more than 5% of requests error in a 5-minute window
- **Latency spike** — p95 response time exceeds 3 seconds
- **Uptime** — any downtime longer than 1 minute
- **Cost** — daily spend exceeds 2x the average

Alerts should go to a channel you actually check — Slack, email, PagerDuty. An alert nobody sees is worse than no alert at all.

### Electron/Tauri Specific Monitoring

Desktop apps can't be monitored with uptime checks. Instead:

- **Crash reporting** — Sentry captures crashes in the main process and renderer
- **Update adoption** — track what percentage of users are on the latest version
- **Feature usage** — PostHog events from the renderer process
- **Performance** — startup time, memory usage, IPC latency (log from main process)

---

## Step 5: Establish Rollback Procedures

Every deployment should be reversible. Before you deploy to production, verify that you can undo it.

### PWA Rollback

| Method | How | Speed |
|---|---|---|
| **Revert deployment** | Vercel/Cloudflare/Netlify: click "Redeploy" on previous deployment | < 1 minute |
| **Git revert** | `git revert HEAD && git push` → CI redeploys | 2-5 minutes |
| **Service worker cache** | Users on the old SW continue seeing cached version until new SW activates | Automatic (but users may see stale content) |

Note: service worker caching means some users will continue using the old version until they reload. This is a feature (graceful degradation) and a risk (inconsistent experience). The `UpdatePrompt` component from the toolkit handles this by prompting users to refresh.

### Electron/Tauri Rollback

Desktop rollback is harder — users have already downloaded the binary.

| Method | How | Speed |
|---|---|---|
| **Publish a fix release** | Increment version, build, sign, release. Auto-updater pushes to users. | Hours |
| **Downgrade release** | Publish previous version as a new release (higher version number pointing to old code) | Hours |
| **Feature flags** | Disable broken feature remotely via PostHog feature flag | Minutes (if pre-configured) |

Feature flags are the fastest rollback mechanism for desktop apps. If a feature is broken, flip the flag and the app hides it — no binary update required. This is why PostHog integration in Phase A is valuable beyond analytics.

### The Pre-Deploy Drill

Before your first production deployment, run through this once:

1. Deploy to production
2. Verify it works (Step 3 checklist)
3. Roll back to the previous version
4. Verify the rollback works
5. Re-deploy the current version

If you can't complete steps 3-4, you're not ready to deploy.

---

## Phase D Checklist

- [ ] Production build configured and tested (bundle size, tree shaking, env vars)
- [ ] Source maps generated and uploaded to Sentry (not deployed publicly)
- [ ] Deploy pipeline automated (CI → build → deploy on push to main)
- [ ] For PWA: hosted on Vercel/Cloudflare/Netlify with custom domain + SSL
- [ ] For PWA: SPA redirect rules configured
- [ ] For PWA: Lighthouse PWA score ≥ 90, Performance ≥ 85
- [ ] For PWA: service worker active, offline mode works, install prompt appears
- [ ] For PWA: Core Web Vitals passing (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- [ ] For Electron: binaries built for all target platforms
- [ ] For Electron: code signing configured and verified (macOS + Windows)
- [ ] For Electron: auto-updater tested (publish test release, verify update)
- [ ] For Electron: security checklist completed
- [ ] For Tauri: binary size < 15MB, startup < 2s
- [ ] For Tauri: updater endpoint and public key configured
- [ ] Health monitoring live (errors, performance, uptime, usage)
- [ ] Alerting configured for error rate, latency, uptime, cost
- [ ] Rollback procedure documented and tested
- [ ] Pre-deploy drill completed (deploy → verify → rollback → verify → redeploy)
- [ ] Target platform audit score ≥ 60

---

## Common Failures

**"It works on my machine."**
Production environments differ from development in ways that matter: environment variables, network conditions, CORS, CSP, HTTPS, and caching behavior. The verification checklist exists to catch these differences.

**"We'll add a custom domain later."**
Users who access your app via a Vercel-generated URL will lose access when you eventually add a domain and the URL changes. Set up the domain before sharing the URL with anyone.

**"We don't need code signing."**
macOS Gatekeeper blocks unsigned apps entirely. Windows SmartScreen warns users away from unsigned executables. If you distribute desktop apps without signing, most users can't or won't install them.

**"Rollback is just reverting the git commit."**
For PWAs, maybe — if CI is fast. For desktop apps, users have already downloaded the binary. You need a forward-fix strategy (new release) or feature flags. Plan this before you need it.

**"Monitoring can wait until we have users."**
The first users are the ones most likely to encounter issues — they're on unfamiliar devices, networks, and use patterns. If you're not monitoring from day one, you're flying blind during the most critical period.

---

## AI Your BI℠: Claude in Phase D

Three specific uses:

**Deploy Configuration** — Describe your hosting target, framework, and any special requirements (custom headers, redirects, environment variables). Claude can generate the deployment config — `vercel.json`, `_headers`, `_redirects`, `wrangler.toml`, or GitHub Actions deploy steps.

**Performance Optimization** — After your first Lighthouse run, paste the results and ask Claude to prioritize the fixes. Claude can identify which optimizations have the highest impact for the least effort — often image optimization, font loading, and code splitting account for 80% of the score improvement.

**Incident Response Planning** — Describe your deployment model and ask Claude to generate an incident response runbook: how to detect an outage, who to notify, how to diagnose, how to roll back, how to communicate to users, and how to post-mortem.

Example prompt:

```
My app is a [PWA / Electron / Tauri] deployed to [host].
The CI pipeline is [describe].
Users access it via [URL / download / both].

Generate:
1. A deployment verification checklist specific to my setup
2. A rollback procedure with timing estimates
3. An alerting configuration for [Sentry / PostHog / host monitoring]
4. An incident response template I can fill in
```

---

## References

- `ref/ci/.github/workflows/pwa-ci.yml` — PWA CI with Lighthouse gate
- `ref/ci/.github/workflows/electron-ci.yml` — Multi-OS Electron build matrix
- `ref/ci/scripts/lighthouse-check.sh` — Automated Lighthouse verification
- `ref/templates/pwa-audit-checklist.md` — Comprehensive PWA launch checklist
- `ref/templates/electron-security-checklist.md` — Electron security verification
- `ref/diagrams/svg/deployment-pipeline.svg` — CI/CD stage visualization
- `ref/docs/10-security-hardening.md` — Production security requirements

---

**Previous Phase:** [← Phase A: AI Implementation](./A-ai-implementation.md)
**Next Phase:** [Phase E: Evolution →](./E-evolution.md)
