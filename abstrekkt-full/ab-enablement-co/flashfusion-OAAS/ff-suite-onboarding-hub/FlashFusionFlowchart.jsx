import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const SC = { todo:"#334155", active:"#7c3aed", done:"#15803d", blocked:"#dc2626", skipped:"#475569" };
const NW = { terminal:200, process:320, decision:160, escalation:240, checklist:320, qc:320 };
const NH = { terminal:48, process:58, decision:72, escalation:58, checklist:58, qc:58 };
const STORAGE_KEY = "flashfusion-build-v1";

// ─── NODE DEFINITIONS ─────────────────────────────────────────────────────────
const INIT_NODES = [
  { id:"START", type:"terminal", label:"FlashFusion Build Start", x:520, y:40, exp:5,
    w:[
      "Confirm all prerequisites are in place before starting.",
      "Node.js 20 LTS installed; verify with node -v",
      "Git configured with SSH key pushed to GitHub",
      "Supabase project created (free tier OK for dev)",
      "Sanity account ready at sanity.io",
      "Vercel account linked to GitHub repo",
    ], u:["Record session start time.","Note any blockers or deferred items in Notes tab."], c:["All prerequisites confirmed.","Session timer started."], i:["Stack: Next.js 14 · TypeScript · Tailwind · Sanity v3 · Supabase · WebAuthn · next-intl"] },

  { id:"ENV_SETUP", type:"process", label:"Phase C · Environment Setup", x:460, y:140, exp:60,
    w:[
      "Create Next.js 14 project: npx create-next-app@14 flashfusion-studio --typescript --tailwind --app",
      "Install core deps: pnpm add @sanity/client @sanity/image-url @supabase/supabase-js @simplewebauthn/browser @simplewebauthn/server next-intl",
      "Copy .env.local.example → .env.local; fill all non-secret vars",
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (these are safe client-side)",
    ],
    u:[
      "⚠ NEVER put SUPABASE_SERVICE_ROLE_KEY in any NEXT_PUBLIC_ variable — server-side only",
      "Run pnpm dev — verify http://localhost:3000 loads without errors",
      "Check TypeScript strict mode is on in tsconfig.json",
    ],
    c:["pnpm dev starts cleanly","No TypeScript errors on fresh build","All env vars populated (no undefined in logs)"],
    i:["SUPABASE_SERVICE_ROLE_KEY → .env.local, server components only","SANITY_API_TOKEN → .env.local, server components only","NEXT_PUBLIC_* → safe for client bundle"] },

  { id:"DESIGN_SYS", type:"process", label:"Phase C · Design System & Tokens", x:460, y:250, exp:90,
    w:[
      "Extend tailwind.config.ts with FlashFusion brand tokens",
      "Primary: #3b82f6 · Accent: #10b981 · Orange: #f97316 · Yellow: #fbbf24",
      "Add globals.css CSS custom properties for light/dark/high-contrast themes",
      "Configure Inter (body) font via next/font/google",
    ],
    u:[
      "Define semantic tokens: --color-surface, --color-text-primary, --color-border",
      "Add 8pt spacing scale in Tailwind extend.spacing",
      "Run pnpm build — no Tailwind purge errors",
    ],
    c:["Tailwind config extended with all brand colors","CSS vars defined for all 3 themes","Font loads with font-display: swap — no FOUT"],
    i:["See /styles/tokens.css for full var list","WCAG AAA target: 7:1 normal text, 4.5:1 large text"] },

  { id:"UI_PRIM", type:"process", label:"Phase C · UI Primitives", x:460, y:360, exp:120,
    w:[
      "Build Button (5 variants + loading state), Input (with persistent label + error), Card (hover + motion-safe), Badge, Avatar",
      "Build Nav with skip-to-content link for WCAG AAA",
      "All interactive elements: min 44×44px touch target",
      "Visible focus ring: 2px offset outline using brand blue",
    ],
    u:[
      "Test keyboard-only navigation through all primitives",
      "Run Pa11y locally: npx pa11y http://localhost:3000 --standard WCAG2AA",
      "Check color contrast with browser DevTools accessibility panel",
    ],
    c:["All primitives render in Storybook (or isolated test page)","Zero WCAG AA violations on component test page","All focus states visible at 4× zoom"],
    i:["error-msg IDs: {fieldId}-error (aria-describedby pattern)","Skip link: absolute, top:-40px, visible on focus"] },

  { id:"D_SANITY", type:"decision", label:"Sanity Project\nReady?", x:540, y:468, exp:5,
    w:["Log into sanity.io → check Projects list for flashfusion-studio"],
    u:["Verify Project ID is in .env.local as NEXT_PUBLIC_SANITY_PROJECT_ID","Confirm dataset named 'production' exists"],
    c:["Project ID present","Dataset 'production' exists","CORS origin includes localhost:3000"],
    i:["If project doesn't exist → branch 'No' to SANITY node"] },

  { id:"SANITY", type:"process", label:"Configure Sanity v3 CMS", x:820, y:455, exp:60,
    w:[
      "Create project: npm create sanity@latest (choose Next.js template)",
      "Add to CORS origins: http://localhost:3000 and production domain",
      "Define schemas: post, page, service, portfolioItem, teamMember, siteSettings",
      "Seed sample content — at least 1 post and 1 service entry",
    ],
    u:[
      "Configure GROQ queries in /lib/sanity/queries.ts",
      "Add CDN for production: useCdn: process.env.NODE_ENV === 'production'",
      "⚠ SANITY_API_TOKEN must stay server-side only — never NEXT_PUBLIC_",
    ],
    c:["Studio accessible at /studio","Fetch test returns data (~50-150ms) from CDN","CORS configured for both localhost and production"],
    i:["Project ID: set in NEXT_PUBLIC_SANITY_PROJECT_ID","Preview secret: SANITY_PREVIEW_SECRET → server only"] },

  { id:"CORE_PAGES", type:"process", label:"Phase A · Core Pages (6)", x:460, y:590, exp:240,
    w:[
      "Pages to build: / (Home), /about, /services, /portfolio, /blog, /contact",
      "Home: hero (with CTA + value prop), features grid, testimonials, FAQ with JSON-LD",
      "Blog: ISR 60s revalidate, article schema, ToC from headings, prev/next nav",
      "Contact: Zod validation, honeypot spam filter, rate limiting, consent checkbox",
    ],
    u:[
      "All pages: proper <h1> → <h2> → <h3> heading hierarchy",
      "All images: next/image with explicit width/height (prevents CLS)",
      "All pages: unique <title> and <meta name=description>",
    ],
    c:["6 pages render without hydration errors","Google Rich Results test passes for FAQ + article schemas","Contact form submits and sends confirmation email"],
    i:["ISR revalidate: blog=60s, services/portfolio=300s","Blog pages: /blog/[slug] → dynamic from Sanity","Portfolio: masonry grid, tag filter with ARIA listbox"] },

  { id:"I18N", type:"process", label:"Phase B · i18n (5 Locales)", x:460, y:700, exp:180,
    w:[
      "Locales: en (default), es, fr, de, ja",
      "Install next-intl: pnpm add next-intl",
      "Configure middleware.ts for locale detection (Accept-Language header, no forced redirect)",
      "Create /messages/{locale}.json for each locale",
    ],
    u:[
      "Wrap app in <NextIntlClientProvider> in layout.tsx",
      "Replace ALL hardcoded strings with useTranslations() hook",
      "Add hreflang alternate links in metadata",
      "Test ja locale — verify date/number formatting with Intl.DateTimeFormat",
    ],
    c:["All 5 locale routes return 200","hreflang tags present on all pages","No untranslated strings visible (check with missing-key logging enabled)","RTL-compatible CSS properties used (no physical margin-left)"],
    i:["Locale detection: middleware reads Accept-Language, sets NEXT_LOCALE cookie","ja needs special attention: verify Intl.DateTimeFormat with 'ja-JP'"] },

  { id:"AUTH", type:"process", label:"Phase B · WebAuthn + Supabase", x:460, y:810, exp:150,
    w:[
      "Install: pnpm add @simplewebauthn/browser @simplewebauthn/server",
      "Create Supabase table: webauthn_credentials (id, user_id, credential_id, public_key, counter BIGINT, created_at)",
      "⚠ counter MUST be BIGINT — INT4 overflows for high-frequency authenticators",
      "Add RLS: users can only SELECT/INSERT/UPDATE their own credentials",
    ],
    u:[
      "Create API routes: /api/auth/register/start, /api/auth/register/finish, /api/auth/login/start, /api/auth/login/finish",
      "Add email OTP fallback via Supabase Auth for non-passkey devices",
      "Implement rate limiting: max 5 auth attempts per IP per minute",
      "⚠ NEVER import supabaseAdmin (service role) in client components",
    ],
    c:["Passkey registration flow works in Chrome + Safari","Biometric login succeeds in <2s","RLS: user A cannot read user B credentials","Email OTP fallback sends and validates correctly","Rate limiting returns 429 after 5 attempts"],
    i:["rpID in dev: 'localhost' | prod: exact domain (no www mismatch)","Counter column: BIGINT not INT4 (known bug if you use default schema)","Supabase Auth Logs: Dashboard > Authentication > Logs"] },

  { id:"ESC_SUPA", type:"escalation", label:"Escalate: Supabase Auth", x:840, y:810, exp:30,
    w:["Check Supabase Dashboard > Authentication > Logs for error details",
      "Verify RLS policies: webauthn_credentials must have policies for SELECT and INSERT",
      "Common fixes: enable RLS (it's sometimes off by default), fix BIGINT vs INT4 on counter column",
      "Supabase Support: https://supabase.com/dashboard/support — Pro plan: 24hr SLA",
    ],
    u:["Open a support ticket with: project ref, error message, repro steps"],
    c:["Root cause identified in logs","Fix deployed","Auth flow succeeds end-to-end — no 401/403"],
    i:["Pro plan SLA: 24hr response","Include: project-ref, error screenshot, curl repro"] },

  { id:"PWA", type:"process", label:"Phase B · PWA + Privacy (GPC)", x:460, y:920, exp:120,
    w:[
      "Install next-pwa or implement custom service worker via /public/sw.js",
      "Create /public/manifest.json: name, icons (192px + 512px), theme_color: #3b82f6",
      "Build GDPR consent banner: Analytics / Marketing / Functional toggles",
      "Check navigator.globalPrivacyControl — if true, auto-disable analytics",
    ],
    u:[
      "Register service worker in layout.tsx useEffect",
      "Cache strategy: network-first for API, cache-first for static assets",
      "Analytics scripts: load ONLY when consent=true AND navigator.globalPrivacyControl !== true",
      "Store consent in localStorage (client) + httpOnly cookie (SSR reads)",
    ],
    c:["Lighthouse PWA score: all checks green","Offline: cached pages load without network","GPC signal respected: analytics do NOT fire when GPC=true","Consent banner: preferences persist across sessions"],
    i:["GPC check: navigator.globalPrivacyControl (boolean, may be undefined in old browsers)","GDPR applies to EU visitors — use geo-detection or show to all"] },

  { id:"TESTING", type:"checklist", label:"Run Full Test Suite", x:460, y:1030, exp:180,
    checks:[
      { id:"t1", label:"Unit tests pass (Jest): pnpm test", critical:true },
      { id:"t2", label:"E2E tests pass (Playwright): pnpm test:e2e", critical:true },
      { id:"t3", label:"Pa11y accessibility audit: zero WCAG AA violations", critical:true },
      { id:"t4", label:"All 5 locale routes return 200", critical:true },
      { id:"t5", label:"Auth flow E2E: register → login → logout", critical:true },
      { id:"t6", label:"Contact form: valid submit + honeypot reject", critical:true },
      { id:"t7", label:"Percy visual regression: no unexpected diffs", critical:false },
      { id:"t8", label:"Cross-browser: Chrome, Firefox, Safari", critical:false },
      { id:"t9", label:"Mobile viewport (375px): no overflow", critical:false },
      { id:"t10", label:"Dark mode: all contrast ratios ≥ 7:1 (AAA)", critical:false },
    ],
    w:["Run full suite: pnpm test && pnpm test:e2e && pnpm lint"],
    u:["Check CI dashboard for any flaky test failures","Review Pa11y report for any axe rule violations"],
    c:["All ★ critical checks pass","Zero accessibility violations","No TypeScript errors"],
    i:["CI: GitHub Actions workflow at .github/workflows/ci.yml","Percy: requires PERCY_TOKEN in CI environment"] },

  { id:"D_LH", type:"decision", label:"Lighthouse\n≥90 All?", x:540, y:1150, exp:10,
    w:["Run Lighthouse in Chrome DevTools against http://localhost:3000 or staging URL",
      "Check all 4 categories: Performance, Accessibility, Best Practices, SEO"],
    u:["Target: Performance ≥90, Accessibility=100, Best Practices=100, SEO=100",
      "Core Web Vitals targets: LCP <2.5s, CLS <0.1, INP <200ms"],
    c:["All 4 Lighthouse categories ≥ 90","Core Web Vitals: LCP/CLS/INP all green"],
    i:["Run on staging (not localhost) for accurate Performance score","Use --preset=desktop for desktop audit"] },

  { id:"PERF", type:"process", label:"Fix Performance Issues", x:840, y:1136, exp:90,
    w:[
      "Priority fixes by LCP impact:",
      "1. Hero image: add priority prop to next/image",
      "2. CLS: add explicit width/height to ALL images — no implicit sizing",
      "3. Bundle: analyze with pnpm build --analyze, split heavy components with dynamic()",
      "4. Fonts: next/font already handles swap — verify no manual @font-face",
    ],
    u:["Re-run Lighthouse after each fix category","Check network waterfall for render-blocking resources"],
    c:["Lighthouse Performance ≥ 90","Main bundle < 200KB gzipped","No render-blocking resources above the fold"],
    i:["Lazy-load: Sanity studio, chart libs, media embeds","next/image priority: only hero/above-fold images get it"] },

  { id:"D_TESTS", type:"decision", label:"All Tests\nPassing?", x:540, y:1270, exp:10,
    w:["Review GitHub Actions run for current branch","Check Playwright HTML report for E2E failures"],
    u:["Download test artifacts from CI if needed","Run failing tests locally with --headed for debugging"],
    c:["Green CI badge on PR","Zero failing tests","Zero skipped tests (except with justification comments)"],
    i:["Playwright report: playwright-report/index.html","Pa11y report: pa11y-report.json"] },

  { id:"FIX_TESTS", type:"process", label:"Fix Failing Tests", x:840, y:1256, exp:120,
    w:[
      "Identify failure category: unit / E2E / accessibility / i18n / visual",
      "Unit: run pnpm test --watch --testPathPattern=failing.test",
      "E2E: run npx playwright test failing.spec --headed --debug",
      "Accessibility: use axe DevTools browser extension for detailed violation report",
    ],
    u:["Replace arbitrary waits (page.waitForTimeout) with proper selectors/responses","Update snapshots ONLY if change is intentional: pnpm test -u"],
    c:["All previously-failing tests now green","No new test skips added without comment explaining why","Flaky tests: root cause fixed, not just retried"],
    i:["i18n test failures often mean missing key in one locale's JSON","Visual regression: accept diff ONLY if design change was intentional"] },

  { id:"DEPLOY_GATE", type:"qc", label:"Deployment Checklist Gate", x:460, y:1390, exp:60,
    checks:[
      { id:"d1", label:"All env vars set in Vercel dashboard (not just .env.local)", critical:true },
      { id:"d2", label:"Zero NEXT_PUBLIC_ vars containing secrets", critical:true },
      { id:"d3", label:"CSP Level 3 header configured in next.config.js", critical:true },
      { id:"d4", label:"HSTS header: max-age=31536000; includeSubDomains", critical:true },
      { id:"d5", label:"Supabase RLS enabled on ALL tables with user data", critical:true },
      { id:"d6", label:"Rate limiting active on /api/auth/* routes", critical:true },
      { id:"d7", label:"WebAuthn rpID matches production domain exactly", critical:true },
      { id:"d8", label:"Sanity CORS: production domain whitelisted", critical:true },
      { id:"d9", label:"Analytics: consent-gated (does NOT fire without opt-in)", critical:true },
      { id:"d10", label:"sitemap.xml and robots.txt present", critical:false },
      { id:"d11", label:"Custom 404 and 500 error pages present", critical:false },
      { id:"d12", label:"Staging smoke test: all 6 pages + auth flow pass", critical:false },
    ],
    w:["Work through all ★ critical items before proceeding"],
    u:["If any ★ item fails — STOP. Fix before deploy.","Recommended: complete all ○ items too"],
    c:["All 9 ★ critical items: PASS","Banner: 'Ready to Deploy' visible","Mark Done button unlocked"],
    i:["rpID mismatch is the #1 WebAuthn prod failure — double-check","CSP: use reportOnly first, then enforce after verifying no violations"] },

  { id:"D_VERCEL", type:"process", label:"Deploy to Vercel", x:260, y:1510, exp:30,
    w:[
      "Ensure repo is linked: vercel link",
      "All env vars set in Vercel project settings (Settings > Environment Variables)",
      "Custom domain DNS: add CNAME → cname.vercel-dns.com",
    ],
    u:["Deploy: git push origin main OR vercel --prod",
      "Monitor build log in real-time at vercel.com/dashboard",
      "Verify: https://yourdomain.com returns 200 with HTTPS"],
    c:["Vercel deployment status: Ready","Production URL responds with HTTP 200","Security headers present (check with securityheaders.com)"],
    i:["Build memory limit: if OOM error → upgrade to Pro plan","NEXT_PUBLIC_ vars must be set BEFORE deploy — re-deploy if added after"] },

  { id:"D_DOCKER", type:"process", label:"Deploy Docker + nginx", x:560, y:1510, exp:60,
    bypassable:true, bypassOwner:"Optional — self-hosted fallback only",
    w:[
      "Build: docker build -t flashfusion-studio .",
      "Multi-stage Dockerfile: node:20-alpine build stage → distroless runtime stage",
      "nginx config: proxy_pass to Next.js :3000, SSL via Let's Encrypt (certbot)",
      "Docker Compose: app + nginx services, healthcheck on /api/health",
    ],
    u:["docker-compose up -d","Verify: curl https://yourdomain.com returns 200","Check nginx access log: tail -f /var/log/nginx/access.log"],
    c:["Container healthy (docker ps shows Up)","SSL cert valid (no browser warning)","Auto-restart policy: --restart=unless-stopped"],
    i:["Dockerfile in repo root","Use .dockerignore to exclude node_modules, .next, .env.local"] },

  { id:"ESC_VCL", type:"escalation", label:"Escalate: Vercel Deploy", x:860, y:1510, exp:30,
    w:["Check Vercel build log for exact error line",
      "Common: missing env var (add in dashboard, re-deploy), OOM (upgrade plan), type error (fix and push)",
      "Run build locally first: pnpm build — catches most issues before CI",
      "Vercel support: https://vercel.com/support"],
    u:["Note: NEXT_PUBLIC_ vars need to exist BEFORE build — adding them after requires re-deploy"],
    c:["Root cause identified","Fix committed and re-deployed","Production URL returns 200"],
    i:["Include in ticket: deployment URL, build ID, error screenshot","Pro plan: priority support queue"] },

  { id:"MONITOR", type:"process", label:"Setup Monitoring & Analytics", x:460, y:1640, exp:60,
    w:[
      "Create Sentry project (Next.js template) → copy DSN to SENTRY_DSN env var",
      "Add error boundary in app/layout.tsx",
      "Choose analytics: GA4 (consent-required) or Plausible (GDPR-compliant, no consent banner needed)",
      "Configure uptime monitoring: Better Uptime or Vercel Monitors",
    ],
    u:["Add Slack webhook for error alerts: SLACK_WEBHOOK_URL → env var","Track KPI events: hero_view, cta_click, form_submit, auth_success"],
    c:["Sentry receives test error (trigger manually)","Analytics events visible in dashboard","Uptime monitor pings every 1 min","Vercel Analytics: Core Web Vitals appearing after first traffic"],
    i:["Sentry DSN: private env var","Plausible: no cookie banner needed — recommended for GDPR simplicity","Alert: page down within 1 min → Slack #ops-alerts"] },

  { id:"LAUNCH", type:"terminal", label:"🚀 FlashFusion Live!", x:520, y:1760, exp:0,
    w:["Announce to team: Slack #general","Post on LinkedIn/X if applicable","Monitor Sentry error rate for first 30 min"],
    u:["Watch Core Web Vitals in Vercel Analytics — first real traffic data","Check error rate: target <0.1% of page views"],
    c:["Zero P0 errors in first hour","Uptime: 100% in first 24h","Lighthouse scores maintained on production"],
    i:["Rollback: Vercel → Deployments → previous deployment → Promote to Production","Recurring: weekly Lighthouse report, monthly security audit"] },
];

// ─── EDGE DEFINITIONS ─────────────────────────────────────────────────────────
const INIT_EDGES = [
  { id:"e1",  from:"START",       to:"ENV_SETUP"   },
  { id:"e2",  from:"ENV_SETUP",   to:"DESIGN_SYS"  },
  { id:"e3",  from:"DESIGN_SYS",  to:"UI_PRIM"     },
  { id:"e4",  from:"UI_PRIM",     to:"D_SANITY"    },
  { id:"e5",  from:"D_SANITY",    to:"CORE_PAGES",  label:"Yes" },
  { id:"e6",  from:"D_SANITY",    to:"SANITY",      label:"No"  },
  { id:"e7",  from:"SANITY",      to:"CORE_PAGES"  },
  { id:"e8",  from:"CORE_PAGES",  to:"I18N"        },
  { id:"e9",  from:"I18N",        to:"AUTH"        },
  { id:"e10", from:"AUTH",        to:"ESC_SUPA",    label:"Auth Fails" },
  { id:"e11", from:"ESC_SUPA",    to:"AUTH",        label:"↩ Resolved", loop:true },
  { id:"e12", from:"AUTH",        to:"PWA"         },
  { id:"e13", from:"PWA",         to:"TESTING"     },
  { id:"e14", from:"TESTING",     to:"D_LH"        },
  { id:"e15", from:"D_LH",        to:"PERF",        label:"No"  },
  { id:"e16", from:"D_LH",        to:"D_TESTS",     label:"Yes" },
  { id:"e17", from:"PERF",        to:"D_LH",        loop:true   },
  { id:"e18", from:"D_TESTS",     to:"FIX_TESTS",   label:"No"  },
  { id:"e19", from:"D_TESTS",     to:"DEPLOY_GATE", label:"Yes" },
  { id:"e20", from:"FIX_TESTS",   to:"D_TESTS",     loop:true   },
  { id:"e21", from:"DEPLOY_GATE", to:"D_VERCEL"    },
  { id:"e22", from:"DEPLOY_GATE", to:"D_DOCKER"    },
  { id:"e23", from:"D_VERCEL",    to:"ESC_VCL",     label:"Deploy Fails", below:true },
  { id:"e24", from:"ESC_VCL",     to:"D_VERCEL",    label:"↩ Resolved", loop:true },
  { id:"e25", from:"D_VERCEL",    to:"MONITOR"     },
  { id:"e26", from:"D_DOCKER",    to:"MONITOR"     },
  { id:"e27", from:"MONITOR",     to:"LAUNCH"      },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function nw(type){ return NW[type] || 280; }
function nh(type){ return NH[type] || 56; }
function edgePath(e, nm){
  const s = nm[e.from], t = nm[e.to];
  if(!s || !t) return "";
  const sw = nw(s.type), sh = nh(s.type);
  const tw = nw(t.type), th = nh(t.type);
  const scx = s.x + sw/2, scy = s.y + sh/2;
  const tcx = t.x + tw/2, tcy = t.y + th/2;

  // Loop edges — right-side arc
  if(e.loop){
    const rx = Math.max(s.x+sw, t.x+tw) + 80;
    const sy = s.type==="decision" ? s.y+sh : scy;
    const ty = t.type==="decision" ? t.y+th/2 : tcy;
    return `M ${s.x+sw} ${sy} C ${rx} ${sy} ${rx} ${ty} ${t.x+tw} ${ty}`;
  }

  // Below edges — route under obstacles via vertical detour
  if(e.below){
    const by = Math.max(s.y+sh, t.y+th) + 60;
    const smx = s.x+sw, tmx = t.x+tw;
    return `M ${smx} ${scy} C ${smx} ${by} ${tmx} ${by} ${tmx} ${tcy}`;
  }

  // Decision source — use tip points
  if(s.type === "decision"){
    const stx = s.x + sw; // right tip
    const sty = scy;
    const sbx = scx;      // bottom tip
    const sby = s.y + sh;

    // Right branch
    if(t.x > s.x + sw*0.8){
      const ex = t.x, ey = tcy;
      const dx = Math.abs(ex-stx), dy = Math.abs(ey-sty);
      if(dy < 5) return `M ${stx} ${sty} L ${ex} ${ey}`;
      return `M ${stx} ${sty} C ${stx+dx*0.4} ${sty} ${ex-20} ${ey} ${ex} ${ey}`;
    }
    // Down — bottom tip
    const ex2 = tcx, ey2 = t.y;
    const mid = (sby + ey2)/2;
    return `M ${sbx} ${sby} C ${sbx} ${mid} ${ex2} ${mid} ${ex2} ${ey2}`;
  }

  // Forward (downward)
  if(tcy > scy + sh*0.4){
    const sx2 = scx, sy2 = s.y+sh;
    const ex = tcx, ey = t.y;
    const mid = (sy2+ey)/2;
    return `M ${sx2} ${sy2} C ${sx2} ${mid} ${ex} ${mid} ${ex} ${ey}`;
  }

  // Right branch (same level)
  const sx3 = s.x+sw, sy3 = scy;
  const ex3 = t.x, ey3 = tcy;
  const dx3 = Math.abs(ex3-sx3);
  return `M ${sx3} ${sy3} C ${sx3+dx3*0.4} ${sy3} ${ex3-dx3*0.4} ${ey3} ${ex3} ${ey3}`;
}

function formatElapsed(sec){
  const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
  return [h,m,s].map(v=>String(v).padStart(2,'0')).join(':');
}

function initChecks(nodes){
  const st = {};
  nodes.forEach(n => {
    if(n.checks) st[n.id] = Object.fromEntries(n.checks.map(c=>[c.id, 'todo']));
  });
  return st;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function FlashFusionFlowchart(){
  // STATE — all useState calls in one block (hooks rules)
  const [nodes, setNodes] = useState(INIT_NODES);
  const [edges] = useState(INIT_EDGES);
  const [statuses, setStatuses] = useState(() => Object.fromEntries(INIT_NODES.map(n=>[n.id,'todo'])));
  const [checkStates, setCheckStates] = useState(() => initChecks(INIT_NODES));
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [transform, setTransform] = useState({ x:20, y:20, s:0.65 });
  const [editMode, setEditMode] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startTimes, setStartTimes] = useState({});
  const [notes, setNotes] = useState({});
  const [sessionLog, setSessionLog] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [aiMessages, setAiMessages] = useState([]);
  const [aiMessagesByNode, setAiMessagesByNode] = useState({});
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiEditMode, setAiEditMode] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);
  const [downstreamModal, setDownstreamModal] = useState(null);
  const [bypassModal, setBypassModal] = useState(null);
  const [bypassReason, setBypassReason] = useState('');
  const [resetConfirm, setResetConfirm] = useState(false);
  const [draggingNode, setDraggingNode] = useState(null);
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);

  // REFS
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const timerRef = useRef(null);
  const loadedRef = useRef(false);
  const dragMovedRef = useRef(false);

  // DERIVED
  const nm = Object.fromEntries(nodes.map(n=>[n.id,n]));
  const selNode = selected ? nm[selected] : null;
  const totalNodes = nodes.length;
  const doneCount = nodes.filter(n=>statuses[n.id]==='done').length;
  const progress = Math.round(doneCount/totalNodes*100);

  // EFFECTS
  // Load from window.storage on mount
  useEffect(()=>{
    try {
      window.storage?.get(STORAGE_KEY).then(r=>{
        if(r?.value){
          try {
            const d = JSON.parse(r.value);
            if(d.statuses) setStatuses(d.statuses);
            if(d.checkStates) setCheckStates(d.checkStates);
            if(d.notes) setNotes(d.notes);
            if(d.sessionLog) setSessionLog(d.sessionLog);
            if(d.elapsed) setElapsed(d.elapsed);
            if(d.nodes) setNodes(d.nodes);
            if(d.startTimes) setStartTimes(d.startTimes);
          } catch(e){}
        }
        loadedRef.current = true;
      }).catch(()=>{ loadedRef.current = true; });
    } catch(e){ loadedRef.current = true; }
  },[]);

  // Save to window.storage — guarded by loadedRef, excludes elapsed (saves on pause)
  useEffect(()=>{
    if(!loadedRef.current) return;
    const data = { statuses, checkStates, notes, sessionLog, nodes, startTimes, elapsed };
    try { window.storage?.set(STORAGE_KEY, JSON.stringify(data)).catch(()=>{}); } catch(e){}
  },[statuses, checkStates, notes, sessionLog, nodes, startTimes]);

  // Session timer
  useEffect(()=>{
    if(sessionActive){
      timerRef.current = setInterval(()=> setElapsed(e=>e+1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return ()=> clearInterval(timerRef.current);
  },[sessionActive]);

  // Wheel zoom centered on cursor
  useEffect(()=>{
    const el = svgRef.current;
    if(!el) return;
    const onWheel = e=>{
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setTransform(t=>{
        const ns = Math.min(2, Math.max(0.2, t.s * factor));
        return {
          s: ns,
          x: mx - (mx - t.x) * (ns / t.s),
          y: my - (my - t.y) * (ns / t.s),
        };
      });
    };
    el.addEventListener('wheel', onWheel, {passive:false});
    return ()=> el.removeEventListener('wheel', onWheel);
  },[]);

  // HANDLERS
  const logEvent = (msg)=>{
    const ts = new Date().toLocaleTimeString();
    setSessionLog(l=>[...l, `[${ts}] ${msg}`]);
  };

  const getDownstream = useCallback((nodeId, visited=new Set())=>{
    if(visited.size > 50) return [];
    visited.add(nodeId);
    const out = [];
    edges.forEach(e=>{
      if(e.from === nodeId && !visited.has(e.to)){
        out.push(e.to);
        getDownstream(e.to, visited).forEach(id=> out.push(id));
      }
    });
    return [...new Set(out)];
  },[edges]);

  const setStatus = (id, status, force=false)=>{
    const sel = nm[id];
    if(!sel) return;
    if(status === 'done' && !force){
      const downstream = getDownstream(id);
      const affected = downstream.filter(d=> ['active','done'].includes(statuses[d]));
      if(affected.length > 0){
        setDownstreamModal({ id, status, affected });
        return;
      }
    }
    if(status === 'active' && !startTimes[id]){
      setStartTimes(st=>({...st,[id]:Date.now()}));
    }
    setStatuses(s=>({...s,[id]:status}));
    logEvent(`${sel.label} → ${status.toUpperCase()}`);
  };

  const handleNodeClick = (id)=>{
    setSelected(id);
    setActiveTab('details');
    setAiMessages(aiMessagesByNode[id] || []);
  };

  const handleCanvasMouseDown = (e)=>{
    const tag = e.target.tagName?.toLowerCase();
    const isNode = e.target.closest?.('g[data-node]');
    if(!isNode && (tag==='svg'||tag==='rect'||tag==='path'||tag==='line')){
      setPanning(true);
      setPanStart({x:e.clientX - transform.x, y:e.clientY - transform.y});
    }
  };

  const handleMouseMove = (e)=>{
    if(panning && panStart){
      setTransform(t=>({...t, x:e.clientX-panStart.x, y:e.clientY-panStart.y}));
    }
    if(draggingNode && editMode){
      dragMovedRef.current = true;
      const rect = svgRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left - transform.x) / transform.s;
      const ny = (e.clientY - rect.top - transform.y) / transform.s;
      setNodes(ns=>ns.map(n=> n.id===draggingNode ? {...n,x:nx-dragRef.current.ox,y:ny-dragRef.current.oy} : n));
    }
  };

  const handleMouseUp = ()=>{ setPanning(false); setDraggingNode(null); };

  const handleNodeDragStart = (e, id)=>{
    if(!editMode) return;
    e.stopPropagation();
    dragMovedRef.current = false;
    const n = nm[id];
    const rect = svgRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left - transform.x) / transform.s;
    const my = (e.clientY - rect.top - transform.y) / transform.s;
    dragRef.current = { ox: mx-n.x, oy: my-n.y };
    setDraggingNode(id);
  };

  const cycleCheck = (nodeId, checkId)=>{
    const cur = checkStates[nodeId]?.[checkId] || 'todo';
    const next = cur==='todo'?'pass':cur==='pass'?'fail':'todo';
    setCheckStates(cs=>({...cs,[nodeId]:{...cs[nodeId],[checkId]:next}}));
  };

  const isGateCleared = (nodeId)=>{
    const n = nm[nodeId];
    if(!n?.checks) return true;
    return n.checks.filter(c=>c.critical).every(c=> checkStates[nodeId]?.[c.id]==='pass');
  };

  const overtimeWarning = (id)=>{
    const n = nm[id];
    if(!n || !startTimes[id] || statuses[id]!=='active') return false;
    return (Date.now()-startTimes[id])/60000 > n.exp * 2;
  };

  const addNote = ()=>{
    if(!noteInput.trim() || !selected) return;
    const ts = new Date().toLocaleTimeString();
    setNotes(n=>({...n,[selected]:[...(n[selected]||[]),{ts,text:noteInput.trim()}]}));
    setNoteInput('');
  };

  const copyTicket = ()=>{
    const done = nodes
      .filter(n=>statuses[n.id]==='done')
      .sort((a,b)=>(startTimes[a.id]||0)-(startTimes[b.id]||0))
      .map(n=>`[DONE] ${n.label} (${n.exp}min est)`)
      .join('\n');
    const text = `FlashFusion Build Session\nElapsed: ${formatElapsed(elapsed)}\n\n${done}`;
    if(!navigator.clipboard){
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch(e){}
      document.body.removeChild(ta);
      return;
    }
    navigator.clipboard.writeText(text).catch(()=>{});
  };

  const buildSystemPrompt = (nodeId)=>{
    const n = nm[nodeId];
    const nodeCtx = n ? `\nCurrent step: ${n.label}\nExpected time: ${n.exp} min\nStatus: ${statuses[nodeId]}\nCompletion criteria:\n${(n.c||[]).map(x=>`- ${x}`).join('\n')}` : '';
    const editCtx = aiEditMode ? `\n\n[EDIT MODE ACTIVE]\nFlowchart JSON:\n${JSON.stringify({nodes,edges},null,2)}\n\nTo propose changes, output a JSON block like:\n[FLOWCHART_CHANGE]{"action":"update_node_detail","nodeId":"AUTH","field":"w","value":["new item"]}[/FLOWCHART_CHANGE]\nActions: update_node_detail, update_node_label, update_exp, add_node, remove_node` : '';
    return `You are the FlashFusion Studio build assistant. You help a senior developer (Kyle) build a production Next.js 14 SaaS app.

STACK: Next.js 14 App Router · TypeScript · Tailwind · Sanity v3 · Supabase · @simplewebauthn · next-intl (5 locales) · Vercel/Docker

COMMON FAILURES (in order of likelihood):
1. Missing env var — check .env.local and Vercel dashboard
2. Hydration error — usually CSR/SSR mismatch, check use client vs server component
3. Supabase RLS blocking query — check policies in Supabase dashboard
4. CSP violation — check browser console for blocked resources
5. next-intl locale detection wrong — check middleware.ts
6. WebAuthn rpID mismatch — must exactly match production domain (no www mismatch)
7. Sanity CORS error — add domain to sanity.io project CORS origins

SECURITY HARD RULE: SUPABASE_SERVICE_ROLE_KEY must NEVER appear in client-side code or any NEXT_PUBLIC_ variable.

ESCALATION:
- Supabase: https://supabase.com/dashboard/support (Pro: 24hr SLA)
- Vercel: https://vercel.com/support
- Sanity: https://www.sanity.io/contact/support

TONE: Exhaust all self-fix options before suggesting escalation. Lead with most likely fix. Be concise — user is mid-task.${nodeCtx}${editCtx}`;
  };

  const sendAiMessage = async()=>{
    if(!aiInput.trim() || aiLoading) return;
    const userMsg = aiInput.trim();
    setAiInput('');
    const newMessages = [...aiMessages, {role:'user',content:userMsg}];
    setAiMessages(newMessages);
    if(selected) setAiMessagesByNode(prev=>({...prev,[selected]:newMessages}));
    setAiLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          system: buildSystemPrompt(selected),
          messages: newMessages,
        })
      });
      const data = await res.json();
      const text = data.content?.map(b=>b.text||'').join('') || 'Error getting response.';
      const updated = [...newMessages, {role:'assistant',content:text}];
      setAiMessages(updated);
      if(selected) setAiMessagesByNode(prev=>({...prev,[selected]:updated}));
      const match = text.match(/\[FLOWCHART_CHANGE\]([\s\S]*?)\[\/FLOWCHART_CHANGE\]/);
      if(match && aiEditMode){
        try { setPendingChange(JSON.parse(match[1])); } catch(e){}
      }
    } catch(err){
      const updated = [...newMessages, {role:'assistant',content:'API error: '+err.message}];
      setAiMessages(updated);
      if(selected) setAiMessagesByNode(prev=>({...prev,[selected]:updated}));
    }
    setAiLoading(false);
  };

  const applyFlowchartChange = ()=>{
    if(!pendingChange) return;
    const { action, nodeId, field, value, label, node } = pendingChange;
    if(action==='update_node_detail'){
      setNodes(ns=>ns.map(n=>n.id===nodeId?{...n,[field]:value}:n));
      logEvent(`AI edit: ${nodeId}.${field} updated`);
    } else if(action==='update_node_label'){
      setNodes(ns=>ns.map(n=>n.id===nodeId?{...n,label}:n));
      logEvent(`AI edit: ${nodeId} label`);
    } else if(action==='update_exp'){
      setNodes(ns=>ns.map(n=>n.id===nodeId?{...n,exp:value}:n));
      logEvent(`AI edit: ${nodeId} exp updated`);
    } else if(action==='add_node' && node){
      setNodes(ns=>[...ns, { type:'process', exp:30, w:[], u:[], c:[], i:[], ...node }]);
      setStatuses(s=>({...s,[node.id]:'todo'}));
      logEvent(`AI edit: node ${node.id} added`);
    } else if(action==='remove_node'){
      setNodes(ns=>ns.filter(n=>n.id!==nodeId));
      setStatuses(s=>{ const next={...s}; delete next[nodeId]; return next; });
      logEvent(`AI edit: node ${nodeId} removed`);
    }
    setPendingChange(null);
  };

  const doBypass = ()=>{
    if(!bypassModal) return;
    logEvent(`BYPASS: ${nm[bypassModal]?.label} — reason: ${bypassReason||'(no reason)'}`);
    setStatuses(s=>({...s,[bypassModal]:'skipped'}));
    setBypassModal(null);
    setBypassReason('');
  };

  const doReset = ()=>{
    setStatuses(Object.fromEntries(INIT_NODES.map(n=>[n.id,'todo'])));
    setCheckStates(initChecks(INIT_NODES));
    setNotes({}); setSessionLog([]); setElapsed(0);
    setStartTimes({}); setNodes(INIT_NODES);
    setAiMessages([]); setAiMessagesByNode({});
    setSelected(null); setSessionActive(false);
    setResetConfirm(false);
    try { window.storage?.delete(STORAGE_KEY).catch(()=>{}); } catch(e){}
  };

  // RENDER HELPERS
  const renderNode = (n)=>{
    const w = nw(n.type), h = nh(n.type);
    const status = statuses[n.id] || 'todo';
    const color = SC[status];
    const isSel = selected === n.id;
    const overtime = overtimeWarning(n.id);

    const commonProps = {
      'data-node': n.id,
      style:{cursor: editMode?'grab':'pointer'},
      onMouseDown: e=> editMode ? handleNodeDragStart(e,n.id) : null,
      onClick: e=>{ e.stopPropagation(); if(dragMovedRef.current) return; handleNodeClick(n.id); },
    };

    if(n.type==='decision'){
      const cx2=n.x+w/2, cy2=n.y+h/2;
      const pts=`${cx2},${n.y} ${n.x+w},${cy2} ${cx2},${n.y+h} ${n.x},${cy2}`;
      return (
        <g key={n.id} {...commonProps}>
          {overtime && <polygon points={pts} fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="6 3" opacity="0.8"/>}
          <polygon points={pts} fill={isSel?"#1e293b":"#0f172a"} stroke={isSel?"#3b82f6":color} strokeWidth={isSel?2.5:1.5}/>
          <text x={cx2} y={cy2-6} textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="'JetBrains Mono',monospace" fontWeight="600">{n.label.split('\n')[0]}</text>
          <text x={cx2} y={cy2+8} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="'JetBrains Mono',monospace">{n.label.split('\n')[1]||''}</text>
          <circle cx={n.x+w-14} cy={n.y+10} r={5} fill={color}/>
        </g>
      );
    }

    if(n.type==='terminal'){
      return (
        <g key={n.id} {...commonProps}>
          {overtime && <rect x={n.x-3} y={n.y-3} width={w+6} height={h+6} rx={28} fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="6 3"/>}
          <rect x={n.x} y={n.y} width={w} height={h} rx={24} fill={status==='done'?"#052e16":isSel?"#1e3a5f":"#0f172a"} stroke={isSel?"#3b82f6":color} strokeWidth={isSel?2.5:1.5}/>
          <text x={n.x+w/2} y={n.y+h/2+1} textAnchor="middle" dominantBaseline="middle" fill="#f1f5f9" fontSize="12" fontFamily="'JetBrains Mono',monospace" fontWeight="700">{n.label}</text>
          <circle cx={n.x+w-16} cy={n.y+h/2} r={5} fill={color}/>
        </g>
      );
    }

    const borderColor = n.type==='escalation'?"#f97316":n.type==='qc'?"#8b5cf6":isSel?"#3b82f6":color;
    const fillColor = n.type==='escalation'?"#1c0a00":n.type==='qc'?"#13002e":isSel?"#1e293b":"#0f172a";
    const critCount = n.checks ? n.checks.filter(c=>c.critical && checkStates[n.id]?.[c.id]==='pass').length : 0;
    const critTotal = n.checks ? n.checks.filter(c=>c.critical).length : 0;
    const padX = (n.type==='escalation'||n.type==='qc') ? 12 : 8;

    return (
      <g key={n.id} {...commonProps}>
        {overtime && <rect x={n.x-3} y={n.y-3} width={w+6} height={h+6} rx={7} fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="6 3"/>}
        <rect x={n.x} y={n.y} width={w} height={h} rx={5} fill={fillColor} stroke={borderColor} strokeWidth={isSel?2.5:1.5}/>
        {n.type==='escalation' && <rect x={n.x} y={n.y} width={4} height={h} rx={2} fill="#f97316"/>}
        {n.type==='qc' && <rect x={n.x} y={n.y} width={4} height={h} rx={2} fill="#8b5cf6"/>}
        <text x={n.x+padX} y={n.y+h/2-4} fill="#f1f5f9" fontSize="10" fontFamily="'JetBrains Mono',monospace" fontWeight="600">{n.label}</text>
        <text x={n.x+padX} y={n.y+h/2+9} fill="#64748b" fontSize="8.5" fontFamily="monospace">{n.exp}min est{n.checks?` · ★${critCount}/${critTotal}`:''}{n.bypassable?' · [bypassable]':''}</text>
        <circle cx={n.x+w-14} cy={n.y+12} r={5} fill={color}/>
      </g>
    );
  };

  const renderEdge = (e)=>{
    const d = edgePath(e, nm);
    if(!d) return null;
    const isLoop = e.loop;
    const isResolved = e.label?.includes('↩');
    const isAlert = e.label?.includes('Fails');
    const stroke = isResolved?"#10b981":isAlert?"#f97316":isLoop?"#475569":"#334155";
    let labelEl = null;
    if(e.label){
      const parts = d.replace(/[MCL]/g,' ').trim().split(/\s+/).map(Number).filter(v=>!isNaN(v));
      const mx = parts.length >= 8 ? (parts[0]+parts[2]+parts[4]+parts[6])/4 : parts[0];
      const my = parts.length >= 8 ? (parts[1]+parts[3]+parts[5]+parts[7])/4 : parts[1];
      labelEl = <text x={mx+6} y={my-5} fill={stroke} fontSize="9" fontFamily="monospace" style={{pointerEvents:'none'}}>{e.label}</text>;
    }
    const markerColor = isAlert?'orange':isResolved?'green':'blue';
    return (
      <g key={e.id}>
        <path d={d} fill="none" stroke={stroke} strokeWidth={isLoop?1:1.5} strokeDasharray={isLoop?"5 3":""} markerEnd={`url(#arr-${markerColor})`} opacity={isLoop?0.7:1}/>
        {labelEl}
      </g>
    );
  };

  // RENDER
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#020817',fontFamily:"'JetBrains Mono',monospace",color:'#e2e8f0',overflow:'hidden'}}>

      {/* TOP BAR */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 16px',height:52,background:'#0a0f1e',borderBottom:'1px solid #1e293b',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:sessionActive?'#10b981':'#475569',boxShadow:sessionActive?'0 0 6px #10b981':''}}/>
          <span style={{fontSize:13,fontWeight:700,letterSpacing:'0.05em',color:'#f1f5f9'}}>FLASHFUSION STUDIO</span>
          <span style={{fontSize:10,color:'#475569',borderLeft:'1px solid #1e293b',paddingLeft:12}}>BUILD TRACKER v1</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:12,color:'#64748b',fontVariantNumeric:'tabular-nums'}}>{formatElapsed(elapsed)}</span>
          <span style={{fontSize:11,color:'#3b82f6',background:'#0c1829',padding:'2px 8px',borderRadius:3,border:'1px solid #1e3a5f'}}>{doneCount}/{totalNodes} · {progress}%</span>
          {!sessionActive
            ? <button onClick={()=>{setSessionActive(true);logEvent('Session started');}} style={{...btn('green'),fontSize:11}}>▶ Start</button>
            : <button onClick={()=>{setSessionActive(false);logEvent('Session paused');}} style={{...btn('gray'),fontSize:11}}>⏸ Pause</button>
          }
          <button onClick={()=>setEditMode(e=>!e)} style={{...btn(editMode?'purple':'gray'),fontSize:11}}>{editMode?'✏ Edit ON':'✏ Edit'}</button>
          <button onClick={()=>setResetConfirm(true)} style={{...btn('gray'),fontSize:11}}>↺ Reset</button>
          <button onClick={copyTicket} style={{...btn('gray'),fontSize:11}}>📋 Copy</button>
          <button onClick={()=>window.print()} style={{...btn('gray'),fontSize:11}}>🖨</button>
        </div>
      </div>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* CANVAS */}
        <div style={{flex:1,overflow:'hidden',position:'relative'}}>
          <svg ref={svgRef} width="100%" height="100%" style={{background:'#020817',cursor:panning?'grabbing':editMode?'crosshair':'default'}}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <defs>
              <marker id="arr-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="none" stroke="#3b82f6" strokeWidth="1.5"/>
              </marker>
              <marker id="arr-orange" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="none" stroke="#f97316" strokeWidth="1.5"/>
              </marker>
              <marker id="arr-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="none" stroke="#10b981" strokeWidth="1.5"/>
              </marker>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0f172a" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
            <g transform={`translate(${transform.x},${transform.y}) scale(${transform.s})`}>
              {edges.map(renderEdge)}
              {nodes.map(renderNode)}
            </g>
          </svg>
          <div style={{position:'absolute',bottom:16,left:16,display:'flex',flexDirection:'column',gap:4}}>
            <button style={{...btn('gray'),width:32,height:32,padding:0,fontSize:14}} onClick={()=>setTransform(t=>({...t,s:Math.min(2,t.s*1.15)}))}>+</button>
            <button style={{...btn('gray'),width:32,height:32,padding:0,fontSize:14}} onClick={()=>setTransform(t=>({...t,s:Math.max(0.2,t.s*0.87)}))}>−</button>
            <button style={{...btn('gray'),width:32,height:32,padding:0,fontSize:11}} onClick={()=>setTransform({x:20,y:20,s:0.65})}>⟲</button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{width:380,background:'#0a0f1e',borderLeft:'1px solid #1e293b',display:'flex',flexDirection:'column',flexShrink:0,overflow:'hidden'}}>
          <div style={{display:'flex',borderBottom:'1px solid #1e293b',flexShrink:0}}>
            {['details','ai','notes','progress'].map(tab=>(
              <button key={tab} onClick={()=>setActiveTab(tab)} style={{flex:1,padding:'10px 4px',background:'none',border:'none',borderBottom:activeTab===tab?'2px solid #3b82f6':'2px solid transparent',color:activeTab===tab?'#3b82f6':'#475569',fontSize:10,fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',letterSpacing:'0.08em',cursor:'pointer'}}>
                {tab==='ai'?'AI Help':tab.charAt(0).toUpperCase()+tab.slice(1)}
              </button>
            ))}
          </div>

          <div style={{flex:1,overflow:'auto',padding:16}}>
            {/* DETAILS TAB */}
            {activeTab==='details' && (selNode ? (
              <div>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:12}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:'#f1f5f9',lineHeight:1.3}}>{selNode.label}</div>
                    <div style={{fontSize:10,color:'#475569',marginTop:3}}>
                      {selNode.exp}min est · <span style={{color:SC[statuses[selNode.id]]}}>{(statuses[selNode.id]||'todo').toUpperCase()}</span>
                    </div>
                  </div>
                  {overtimeWarning(selNode.id) && <span style={{fontSize:10,color:'#fbbf24',border:'1px dashed #fbbf24',padding:'2px 6px',borderRadius:3}}>⏱ OVERTIME</span>}
                </div>

                <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:14}}>
                  {['active','done','blocked','skipped'].map(s=>{
                    const gateBlocked = s==='done' && (selNode.type==='checklist'||selNode.type==='qc') && !isGateCleared(selNode.id);
                    return (
                      <button key={s} onClick={()=>{ if(gateBlocked) return; setStatus(selNode.id,s); }}
                        title={gateBlocked?'Critical checklist items not all passing':''}
                        style={{padding:'4px 10px',border:`1px solid ${SC[s]}`,background:statuses[selNode.id]===s?SC[s]+'22':'none',color:SC[s],fontSize:9,borderRadius:3,cursor:gateBlocked?'not-allowed':'pointer',opacity:gateBlocked?0.4:1}}>
                        {s.toUpperCase()}
                      </button>
                    );
                  })}
                  {selNode.bypassable && <button onClick={()=>setBypassModal(selNode.id)} style={{padding:'4px 10px',border:'1px solid #f97316',background:'none',color:'#f97316',fontSize:9,borderRadius:3,cursor:'pointer'}}>BYPASS ↷</button>}
                  {selNode.type==='escalation' && <button onClick={()=>{setStatus(selNode.id,'done',true);logEvent(`ESC resolved: ${selNode.label}`);}} style={{padding:'4px 10px',border:'1px solid #10b981',background:'none',color:'#10b981',fontSize:9,borderRadius:3,cursor:'pointer'}}>↩ RESOLVED</button>}
                </div>

                {selNode.checks && (
                  <div style={{marginBottom:14}}>
                    <div style={{fontSize:10,color:'#64748b',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.06em'}}>Checklist</div>
                    {selNode.checks.map(c=>{
                      const st = checkStates[selNode.id]?.[c.id]||'todo';
                      const stColor = st==='pass'?'#10b981':st==='fail'?'#dc2626':'#475569';
                      return (
                        <div key={c.id} onClick={()=>cycleCheck(selNode.id,c.id)} style={{display:'flex',gap:6,alignItems:'flex-start',marginBottom:5,cursor:'pointer',padding:'4px 6px',borderRadius:3,background:st==='pass'?'#052e1622':st==='fail'?'#7f1d1d22':'transparent',border:`1px solid ${stColor}33`}}>
                          <span style={{color:stColor,fontSize:11,marginTop:1,width:14,flexShrink:0}}>{st==='pass'?'✓':st==='fail'?'✗':'○'}</span>
                          <span style={{fontSize:10,color:stColor==='#10b981'?'#86efac':'#cbd5e1'}}>{c.critical?'★ ':''}{c.label}</span>
                        </div>
                      );
                    })}
                    {selNode.type==='qc' && isGateCleared(selNode.id) && (
                      <div style={{marginTop:8,padding:'8px 12px',background:'#052e16',border:'1px solid #16a34a',borderRadius:4,fontSize:11,color:'#4ade80',textAlign:'center',fontWeight:700}}>✅ READY TO DEPLOY</div>
                    )}
                  </div>
                )}

                {selNode.w?.length > 0 && <DetailSection title="Walk-up / Pre-check" items={selNode.w} color="#64748b"/>}
                {selNode.u?.length > 0 && <DetailSection title="During" items={selNode.u} color="#3b82f6"/>}
                {selNode.c?.length > 0 && <DetailSection title="Completion Criteria" items={selNode.c} color="#10b981"/>}
                {selNode.i?.length > 0 && <DetailSection title="Org-Specific" items={selNode.i} color="#f97316"/>}
              </div>
            ) : (
              <div style={{textAlign:'center',color:'#334155',marginTop:60}}>
                <div style={{fontSize:28,marginBottom:8}}>⬡</div>
                <div style={{fontSize:11}}>Select a node to see details</div>
              </div>
            ))}

            {/* AI TAB */}
            {activeTab==='ai' && (
              <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                  <div style={{fontSize:11,color:'#64748b'}}>{selNode?`Context: ${selNode.label}`:'No node selected'}</div>
                  <div style={{display:'flex',gap:4}}>
                    {aiMessages.length > 0 && <button onClick={()=>{ setAiMessages([]); if(selected) setAiMessagesByNode(p=>({...p,[selected]:[]})); }} style={{...btn('gray'),fontSize:9,padding:'3px 8px'}}>✕ Clear</button>}
                    <button onClick={()=>setAiEditMode(e=>!e)} style={{...btn(aiEditMode?'purple':'gray'),fontSize:9,padding:'3px 8px'}}>
                      {aiEditMode?'✏ EDIT ON':'✏ EDIT'}
                    </button>
                  </div>
                </div>
                <div style={{flex:1,overflow:'auto',background:'#060d1c',borderRadius:4,border:'1px solid #1e293b',padding:10,marginBottom:8,minHeight:200}}>
                  {aiMessages.length===0 && <div style={{color:'#334155',fontSize:10,textAlign:'center',marginTop:20}}>Ask about the current build step…</div>}
                  {aiMessages.map((m,i)=>(
                    <div key={i} style={{marginBottom:10,padding:'6px 8px',borderRadius:3,background:m.role==='user'?'#0c1829':'#0a0f1e',border:`1px solid ${m.role==='user'?'#1e3a5f':'#1e293b'}`}}>
                      <div style={{fontSize:8,color:'#475569',marginBottom:3,textTransform:'uppercase'}}>{m.role}</div>
                      <div style={{fontSize:10,color:'#cbd5e1',lineHeight:1.5,whiteSpace:'pre-wrap'}}>{m.content}</div>
                    </div>
                  ))}
                  {aiLoading && <div style={{color:'#3b82f6',fontSize:10,textAlign:'center'}}>⟳ Thinking…</div>}
                </div>
                {pendingChange && (
                  <div style={{marginBottom:8,padding:'8px',background:'#13002e',border:'1px solid #7c3aed',borderRadius:4}}>
                    <div style={{fontSize:10,color:'#a78bfa',marginBottom:6}}>✏ Proposed: {pendingChange.action} on {pendingChange.nodeId || pendingChange.node?.id || '?'}</div>
                    <div style={{display:'flex',gap:6}}>
                      <button onClick={applyFlowchartChange} style={{...btn('purple'),fontSize:9,padding:'3px 10px'}}>Apply</button>
                      <button onClick={()=>setPendingChange(null)} style={{...btn('gray'),fontSize:9,padding:'3px 10px'}}>Dismiss</button>
                    </div>
                  </div>
                )}
                <div style={{display:'flex',gap:6}}>
                  <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendAiMessage()} placeholder="Ask AI…" style={{flex:1,background:'#060d1c',border:'1px solid #1e293b',borderRadius:3,padding:'6px 8px',color:'#e2e8f0',fontSize:10,fontFamily:"'JetBrains Mono',monospace",outline:'none'}}/>
                  <button onClick={sendAiMessage} disabled={aiLoading} style={{...btn('blue'),fontSize:10,padding:'6px 12px'}}>↑</button>
                </div>
              </div>
            )}

            {/* NOTES TAB */}
            {activeTab==='notes' && (
              <div>
                {selNode && (
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:10,color:'#64748b',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.06em'}}>Notes for: {selNode.label}</div>
                    {(notes[selected]||[]).map((n,i)=>(
                      <div key={i} style={{marginBottom:6,padding:'6px 8px',background:'#060d1c',borderRadius:3,border:'1px solid #1e293b'}}>
                        <span style={{fontSize:8,color:'#475569'}}>[{n.ts}] </span>
                        <span style={{fontSize:10,color:'#cbd5e1'}}>{n.text}</span>
                      </div>
                    ))}
                    <div style={{display:'flex',gap:6,marginTop:8}}>
                      <input value={noteInput} onChange={e=>setNoteInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addNote()} placeholder="Add note…" style={{flex:1,background:'#060d1c',border:'1px solid #1e293b',borderRadius:3,padding:'6px 8px',color:'#e2e8f0',fontSize:10,fontFamily:"'JetBrains Mono',monospace",outline:'none'}}/>
                      <button onClick={addNote} style={{...btn('blue'),fontSize:10,padding:'6px 12px'}}>+</button>
                    </div>
                  </div>
                )}
                <div style={{borderTop:'1px solid #1e293b',paddingTop:12}}>
                  <div style={{fontSize:10,color:'#64748b',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.06em'}}>Session Log</div>
                  {sessionLog.slice().reverse().map((l,i)=>(
                    <div key={i} style={{fontSize:9,color:'#475569',marginBottom:3,fontFamily:'monospace'}}>{l}</div>
                  ))}
                  {sessionLog.length===0 && <div style={{fontSize:10,color:'#334155'}}>No events yet.</div>}
                </div>
              </div>
            )}

            {/* PROGRESS TAB */}
            {activeTab==='progress' && (
              <div>
                <div style={{marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:10,color:'#64748b'}}>Overall Progress</span>
                    <span style={{fontSize:10,color:'#3b82f6'}}>{progress}%</span>
                  </div>
                  <div style={{height:6,background:'#1e293b',borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#3b82f6,#10b981)',transition:'width 0.3s'}}/>
                  </div>
                  <div style={{display:'flex',gap:12,marginTop:8,flexWrap:'wrap'}}>
                    {Object.entries(SC).map(([s,c])=>(
                      <div key={s} style={{display:'flex',alignItems:'center',gap:4}}>
                        <div style={{width:8,height:8,borderRadius:'50%',background:c}}/>
                        <span style={{fontSize:9,color:'#64748b'}}>{nodes.filter(n=>statuses[n.id]===s).length} {s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {nodes.map(n=>{
                  const st = statuses[n.id]||'todo';
                  const elapsedMin = startTimes[n.id] ? Math.round((Date.now()-startTimes[n.id])/60000) : null;
                  return (
                    <div key={n.id} onClick={()=>{setSelected(n.id);setActiveTab('details');}} style={{display:'flex',alignItems:'center',gap:8,marginBottom:5,padding:'5px 8px',borderRadius:3,background:selected===n.id?'#0c1829':'transparent',border:`1px solid ${selected===n.id?'#1e3a5f':'transparent'}`,cursor:'pointer'}}>
                      <div style={{width:8,height:8,borderRadius:'50%',background:SC[st],flexShrink:0}}/>
                      <span style={{fontSize:10,flex:1,color:st==='todo'?'#475569':'#cbd5e1',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{n.label}</span>
                      {elapsedMin!==null && <span style={{fontSize:8,color:'#475569',flexShrink:0}}>{elapsedMin}m</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {downstreamModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
          <div style={{background:'#0a0f1e',border:'1px solid #f97316',borderRadius:6,padding:20,maxWidth:360,width:'90%'}}>
            <div style={{fontSize:13,fontWeight:700,color:'#f97316',marginBottom:8}}>⚠ Downstream Alert</div>
            <div style={{fontSize:11,color:'#cbd5e1',marginBottom:12}}>Marking this step done affects {downstreamModal.affected.length} downstream node(s) already active or done:</div>
            <div style={{marginBottom:14,maxHeight:200,overflow:'auto'}}>
              {downstreamModal.affected.map(id=>(
                <div key={id} style={{fontSize:10,color:'#94a3b8',marginBottom:4}}>• {nm[id]?.label} ({statuses[id]})</div>
              ))}
            </div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>{ setStatus(downstreamModal.id, downstreamModal.status, true); setDownstreamModal(null); }} style={{...btn('orange'),flex:1,fontSize:11}}>Proceed Anyway</button>
              <button onClick={()=>setDownstreamModal(null)} style={{...btn('gray'),flex:1,fontSize:11}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {bypassModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
          <div style={{background:'#0a0f1e',border:'1px solid #f97316',borderRadius:6,padding:20,maxWidth:360,width:'90%'}}>
            <div style={{fontSize:13,fontWeight:700,color:'#f97316',marginBottom:8}}>Skip ↷ {nm[bypassModal]?.label}</div>
            <div style={{fontSize:11,color:'#94a3b8',marginBottom:12}}>{nm[bypassModal]?.bypassOwner}</div>
            <input value={bypassReason} onChange={e=>setBypassReason(e.target.value)} placeholder="Reason for skipping (optional)" style={{width:'100%',background:'#060d1c',border:'1px solid #1e293b',borderRadius:3,padding:'8px',color:'#e2e8f0',fontSize:10,fontFamily:"'JetBrains Mono',monospace",outline:'none',boxSizing:'border-box',marginBottom:12}}/>
            <div style={{display:'flex',gap:8}}>
              <button onClick={doBypass} style={{...btn('orange'),flex:1,fontSize:11}}>Confirm Skip</button>
              <button onClick={()=>setBypassModal(null)} style={{...btn('gray'),flex:1,fontSize:11}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {resetConfirm && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
          <div style={{background:'#0a0f1e',border:'1px solid #dc2626',borderRadius:6,padding:20,maxWidth:320,width:'90%'}}>
            <div style={{fontSize:13,fontWeight:700,color:'#dc2626',marginBottom:8}}>↺ Reset Session</div>
            <div style={{fontSize:11,color:'#94a3b8',marginBottom:16}}>This clears all progress, notes, and session log. Storage will be wiped. Cannot be undone.</div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={doReset} style={{...btn('orange'),flex:1,fontSize:11}}>Confirm Reset</button>
              <button onClick={()=>setResetConfirm(false)} style={{...btn('gray'),flex:1,fontSize:11}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function DetailSection({ title, items, color }){
  return (
    <div style={{marginBottom:12}}>
      <div style={{fontSize:9,color,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:5,borderLeft:`2px solid ${color}`,paddingLeft:6}}>{title}</div>
      {items.map((item,i)=>(
        <div key={i} style={{fontSize:10,color:'#94a3b8',lineHeight:1.6,marginBottom:3,paddingLeft:8}}>{item.startsWith('⚠')?<span style={{color:'#fbbf24'}}>{item}</span>:item}</div>
      ))}
    </div>
  );
}

// ─── STYLE HELPERS ────────────────────────────────────────────────────────────
function btn(variant){
  const variants = {
    blue:  { background:'#1e3a5f', border:'1px solid #3b82f6', color:'#93c5fd' },
    green: { background:'#052e16', border:'1px solid #16a34a', color:'#4ade80' },
    purple:{ background:'#13002e', border:'1px solid #7c3aed', color:'#a78bfa' },
    orange:{ background:'#1c0a00', border:'1px solid #f97316', color:'#fb923c' },
    gray:  { background:'#0f172a', border:'1px solid #1e293b', color:'#64748b' },
  };
  return { ...variants[variant], padding:'5px 12px', borderRadius:3, cursor:'pointer', fontFamily:"'JetBrains Mono',monospace", fontWeight:600 };
}
