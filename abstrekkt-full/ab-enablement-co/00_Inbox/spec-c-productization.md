# SPEC C — PRODUCTIZATION: viz.flashfusion.co (symphony-fable)
Status: READY (gated by decision doc GO) · Executor: Sonnet + manual DNS · Est: 0.5–1 day

## 1. OUTCOME CONTRACT
Public URL `viz.flashfusion.co` serves the visualizer as a FlashFusion demo asset with a
non-blocking CTA into the scorecard funnel. DEBUG hidden by default. One-edit reskin intact.

## 2. ARCHITECTURE
Static single file → Cloudflare Pages project `ff-viz` → custom domain CNAME.
No build step, no framework — the file IS the deployment artifact. [DECISION] Pages over
Workers Sites: simpler, free tier, instant rollback via deployments list.

## 3. CODE CHANGES (str_replace on current file — small, ordered)
1. **DEBUG gating**: wrap dbgToggle/dbgPanel visibility in
   `new URLSearchParams(location.search).has("debug")`. Default hidden in prod;
   `?debug=1` restores full diagnostics. dbg() keeps logging to console regardless.
2. **clientMode via query**: `?client=1` → CONFIG.clientMode=true at boot (neutral reskin
   for embedding in client decks). Default false — on the FF domain, the brand IS the point.
3. **CTA overlay** (config-driven, all strings in CONFIG.brand.cta):
   - Trigger: after 25 s of cumulative playback OR on pause, whichever first; once per session.
   - Render: lower-third pill, dismissible, `aria-live=polite`, never covers the figure's feet:
     "Built on the FlashFusion stack → Get your AI Readiness Score" → link CONFIG.brand.cta.url.
   - Suppressed entirely when clientMode.
4. **Version bump**: CONFIG.version per deploy (file-identity check per Spec A adversarial).
5. **Analytics — decision required**: PostHog pageview + `cta_click` event.
   Default `CONFIG.analytics=false`. ! Privacy tradeoff: even cookieless pageview capture on a
   public page warrants a one-line footer notice. Recommend: ship OFF, enable after notice added.

## 4. DEPLOY RUNBOOK (manual, ~20 min)
1. `npx wrangler pages project create ff-viz` (or dashboard) → upload file as `index.html`.
2. Custom domain: add `viz.flashfusion.co` in Pages → domain tab.
3. DNS: CNAME `viz` → `ff-viz.pages.dev`, proxied. ! Cloudflare MCP lacks DNS zone ops
   (known constraint) → dashboard or direct API via bash, not MCP.
4. Verify: curl -I 200, HTML content-type, version label matches CONFIG.version.

## 5. SECURITY / PERF NOTES
- No secrets exist in the file (keyless by design) — safe for public static hosting.
- CSP header via Pages `_headers` file: `default-src 'self'; media-src blob:; style-src 'unsafe-inline' 'self'`
  — inline script requires either `'unsafe-inline'` script-src or a hash; use the hash
  (single script block → sha256 once per deploy; add to runbook step 1b).
- Cache: `Cache-Control: no-cache` on index.html so version bumps propagate instantly.

## 6. ACCEPTANCE
- viz.flashfusion.co loads on desktop + phone; DEBUG absent; `?debug=1` restores it.
- CTA appears once per session at 25 s, links to audit.flashfusion.co, dismiss works,
  absent under `?client=1`.
- Headless regression suite green against the deployed URL (not just local file).

## GAPS / PRECONDITIONS
- ! CTA destination is only worth wiring if the funnel receives: hello@ bounce +
  Calendly unpublished (per prior sessions — verify current) make the CTA a door to a
  broken hallway. Decision doc sequencing applies.
- OG/social preview image not specced — add `og:image` (one captured frame) if the URL
  will be shared on LinkedIn; 30 min, do at deploy time.
