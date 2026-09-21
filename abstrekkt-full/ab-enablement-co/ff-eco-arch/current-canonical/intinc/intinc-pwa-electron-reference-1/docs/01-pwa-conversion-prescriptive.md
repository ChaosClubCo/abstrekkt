# PWA Conversion — Prescriptive Guide

> **Audience**: Intinc engineers converting React/TypeScript web apps to PWAs.
> **Effort**: 4–200 hours depending on scope. Each phase ships independently.

---

## Overview

Six incremental phases — stop after any and ship a meaningful improvement:

1. **Installability** (4–8h) — Manifest + icons → "Add to Home Screen"
2. **Service Worker Foundation** (16–24h) — Registration, basic caching, offline shell
3. **Advanced Caching** (24–40h) — Per-route strategies, versioning, storage management
4. **Push Notifications** (24–40h) — VAPID, subscription management, server integration
5. **Performance Optimization** (16–24h) — Precaching, lazy loading, Core Web Vitals
6. **Cross-Browser & Deployment** (8–16h) — Safari quirks, testing matrix, CI

See `diagrams/sw-lifecycle` and `diagrams/caching-layers` for visual architecture references.

---

## Phase 1: Installability (4–8 hours)

### What You Get

Browser recognizes app as installable. Users see "Add to Home Screen" on mobile, "Install" in Chrome address bar. App gets its own window with no browser chrome.

### Prerequisites

- React 18+ with Vite, HTTPS in production (localhost for dev), clean initial load

### Step 1.1: Web App Manifest

Create `public/manifest.json` — see `code/react-pwa/public/manifest.json` for production template.

**Critical details**:
- `display: "standalone"` removes browser chrome. Use `"minimal-ui"` for back button.
- `maskable` icons: content must fit within centered circle, radius 204px in 512×512 canvas.
- `short_name` ≤12 characters — appears under icon on home screen.
- `screenshots` required for Chrome's richer install UI on desktop.

### Step 1.2: HTML Head Tags

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#1a1a2e" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

Safari ignores `manifest.json` for some features. These meta tags are the fallback.

### Step 1.3: Install Prompt Interception

See `code/react-pwa/src/components/InstallPrompt.tsx`.

**Why intercept?** Default browser prompt has low conversion. A contextual custom prompt (shown after a key user action) converts 3–5× better.

### Quality Gate: Phase 1
- ✅ Lighthouse "Installable" badge
- ✅ All manifest fields validate
- ✅ Icons load at correct sizes
- ✅ `theme-color` renders in address bar

---

## Phase 2: Service Worker Foundation (16–24 hours)

### What You Get

Offline app shell, cached assets on repeat visits, infrastructure for push and background sync.

### Step 2.1: Registration

See `code/react-pwa/src/sw-register.ts` — production registration with update checking.

Key decisions:
- **When**: After `load` event (avoids competing with initial resources)
- **Scope**: Register at `/` to intercept all routes
- **Updates**: `registration.update()` every 60 minutes + on `visibilitychange`

### Step 2.2: Service Worker Implementation

See `code/react-pwa/src/sw.ts` and `code/vanilla-pwa/src/sw.ts`.

Three lifecycle phases — see `diagrams/sw-lifecycle.mermaid` for visual:

1. **Install**: Cache app shell with `event.waitUntil()`
2. **Activate**: Delete old cache versions
3. **Fetch**: Intercept requests → serve from cache, network, or fallback

### Step 2.3: Offline Shell

Minimum viable: SW intercepts failed network → serves cached shell → user sees app.

Create `public/offline.html` — standalone page, zero external deps, tells user they're offline.

### Step 2.4: Cache Versioning

Prefix caches with build-derived version. During activate, delete non-matching caches.

See `code/shared/src/cache-strategies.ts` for the complete implementation.

### Quality Gate: Phase 2
- ✅ App loads with DevTools Network → "Offline"
- ✅ Lighthouse PWA ≥ 70
- ✅ Repeat visits load from cache (Network tab shows "ServiceWorker")
- ✅ Old caches cleaned after deploy

---

## Phase 3: Advanced Caching (24–40 hours)

### What You Get

Per-content-type cache strategies, bounded storage, background revalidation.

### Strategy Matrix

| Content Type | Strategy | TTL | Rationale |
|-------------|----------|-----|-----------|
| App shell (HTML) | Network-first, 3s timeout | Session | Latest content, don't wait forever |
| JS/CSS bundles | Cache-first | Until redeploy | Hashed filenames = immutable |
| Images | Cache-first | 30d, max 100 entries | Large, rarely change |
| API responses | Stale-while-revalidate | 1 day | Instant display, background refresh |
| User content | Network-only + offline queue | N/A | Must be fresh |
| Google Fonts | Cache-first | 1 year | Never change once loaded |

See `code/shared/src/cache-strategies.ts` for all strategy implementations.

### Storage Management

Chrome gives ~60% of disk, shared across origins. Eviction policy: when >80% used, evict from `dynamic` and `images` caches first. Never evict app shell.

See `code/react-pwa/src/lib/cache-manager.ts` for quota checking and eviction.

### Quality Gate: Phase 3
- ✅ Different caching behavior per content type in Network panel
- ✅ Storage stays below 50MB in typical usage
- ✅ `navigator.storage.persist()` returns true
- ✅ Stale data updates in background

---

## Phase 4: Push Notifications (24–40 hours)

### What You Get

Server-initiated notifications even when app is closed.

See `diagrams/push-notification-sequence.mermaid` for full flow.

### Architecture

Client → requests permission → subscribes via Push API → sends subscription to server
Server → stores subscriptions → creates payloads → sends via web-push to FCM/APNs
Service Worker → receives push event → displays notification → handles click

### Implementation

1. **VAPID keys**: `npx web-push generate-vapid-keys` — private key in env, public key in frontend
2. **Permission**: See `code/react-pwa/src/hooks/usePushNotifications.ts` — NEVER request on page load (< 5% acceptance). Contextual requests get 30–50%.
3. **Push handler**: SW listens for `push` event, parses payload, calls `showNotification`
4. **Click handler**: SW listens for `notificationclick`, focuses existing window or opens new

See `code/push-server/` for the complete server implementation.

### Quality Gate: Phase 4
- ✅ Permission prompt only on user action
- ✅ Subscriptions persist across restarts
- ✅ Notifications display when app is closed
- ✅ Click opens correct page
- ✅ Server handles expired subscriptions (410 responses)

---

## Phase 5: Performance Optimization (16–24 hours)

### What You Get

Sub-2s loads, high Lighthouse scores, smooth interactions.

### Precaching

**Precache** (during SW install): index.html, main JS/CSS bundles, critical fonts (≤2), offline fallback, logo.

**Don't precache**: API data, user content, large media, third-party scripts.

### Code Splitting

Vite does route-level splitting with `React.lazy()`. Rule: if module >50KB and not needed on initial render, lazy-load it.

### Core Web Vitals

| Metric | Target | Common Fixes |
|--------|--------|-------------|
| LCP | < 2.5s | Preload hero image, reduce TTFB, eliminate render-blocking |
| FID | < 100ms | Break long tasks, defer non-critical JS |
| CLS | < 0.1 | Explicit dimensions on images, no above-fold injection |
| INP | < 200ms | Optimize handlers, use `startTransition` |

### Quality Gate: Phase 5
- ✅ Lighthouse Performance ≥ 85
- ✅ JS < 200KB gzipped
- ✅ LCP < 2.5s on 3G throttled

---

## Phase 6: Cross-Browser & Deployment (8–16 hours)

### Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Service Workers | ✅ | ✅ | ✅ 11.1+ | ✅ |
| Push API | ✅ | ✅ | ✅ 16.4+ | ✅ |
| Background Sync | ✅ | ❌ | ❌ | ✅ |
| Install Prompt | ✅ | ❌ | ❌ | ✅ |

### Safari Workarounds

1. No `beforeinstallprompt` → show manual "Add to Home Screen" instructions
2. Push requires Home Screen add-first (16.4+)
3. 50MB storage limit → aggressive cache management
4. No Background Sync → fallback to `visibilitychange` sync

### Deployment Checklist

HTTPS, SW served with no-cache, manifest Content-Type correct, Lighthouse passes, tested on Chrome/Firefox/Safari mobile+desktop, error tracking captures SW errors, analytics tracks install events.

See `ci/github-actions/pwa-ci.yml` for CI workflow with Lighthouse audits.

---

## Phase Selection Guide

```
Need: Just want "Install App" button?     → Phase 1 only (4–8h)
Need: Offline support?                     → Phases 1–2 (20–32h)
Need: Fast repeat visits + offline?        → Phases 1–3 (44–72h)
Need: Re-engagement via notifications?     → Phases 1–4 (68–112h)
Need: Full production PWA?                 → All phases (92–152h)
```

Most teams get highest ROI from Phases 1–3.

---
*Intinc Engineering — PWA Conversion Guide v2.0*
