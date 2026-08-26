# Service Worker Deep Dive

> **Audience**: Engineers implementing or debugging service workers.
> **Diagrams**: `diagrams/sw-lifecycle`, `diagrams/sw-state-machine`, `diagrams/caching-layers`, `diagrams/data-flow`.
> **Code**: `code/react-pwa/src/sw.ts`, `code/vanilla-pwa/src/sw.ts`, `code/shared/src/cache-strategies.ts`.

---

## Service Worker Execution Model

A service worker is a JavaScript file that runs in a **separate thread** from your page. It cannot access the DOM. It communicates with pages via `postMessage` and intercepts network requests via the `fetch` event.

**Key mental model**: Think of the SW as a programmable network proxy sitting between your app and the internet.

### What It Can Do
- Intercept and modify all network requests from its scope
- Cache responses and serve them without network
- Receive push notifications (even when all tabs are closed)
- Perform background sync (limited browser support)
- Run periodic background fetch (very limited support)

### What It Cannot Do
- Access the DOM
- Use synchronous APIs (`localStorage`, `XMLHttpRequest`)
- Run continuously (browser terminates idle SWs)
- Access `window` or `document`
- Run non-HTTPS (except localhost)

---

## Lifecycle Deep Dive

See `diagrams/sw-lifecycle.mermaid` and `diagrams/sw-state-machine.mermaid`.

### Phase 1: Registration

```typescript
// Registration happens in your page, not in the SW
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  });
}
```

**Scope matters**: A SW at `/sw.js` with `scope: '/'` intercepts all requests. A SW at `/app/sw.js` only intercepts requests under `/app/`. The SW file must be at or above the scope path.

### Phase 2: Install

Fires when browser downloads a new SW (first time or byte-different from current).

```typescript
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open('app-shell-v1').then((cache) =>
      cache.addAll([
        '/',
        '/index.html',
        '/assets/main.js',
        '/assets/main.css',
        '/offline.html',
      ])
    )
  );
});
```

**`waitUntil` is critical**: If the promise rejects, the SW installation fails and the browser retries next page load. Don't put optional resources here — if any `addAll` URL 404s, the entire install fails.

**`skipWaiting`**: Calling `self.skipWaiting()` during install causes the new SW to activate immediately, without waiting for existing tabs to close. Use with caution — see "Update Strategy" below.

### Phase 3: Activate

Fires when the SW takes control. This is where you clean up old caches.

```typescript
self.addEventListener('activate', (event: ExtendableEvent) => {
  const currentCaches = new Set(['app-shell-v2', 'dynamic-v2', 'images-v2']);
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => !currentCaches.has(name))
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim()) // Take control of open tabs immediately
  );
});
```

**`clients.claim`**: By default, a newly activated SW doesn't control pages that were loaded before it activated. `clients.claim()` overrides this — the new SW immediately controls all open tabs.

### Phase 4: Fetch

Every network request from a controlled page fires this event.

```typescript
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only intercept same-origin requests and GET
  if (url.origin !== self.location.origin) return;
  if (request.method !== 'GET') return;

  // Route to appropriate strategy
  if (request.destination === 'document') {
    event.respondWith(networkFirst(request, 'pages', 3000));
  } else if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, 'images', 30 * 24 * 60 * 60));
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(staleWhileRevalidate(request, 'api-cache'));
  } else {
    event.respondWith(cacheFirst(request, 'static'));
  }
});
```

---

## Caching Strategies Explained

See `diagrams/caching-layers.mermaid` for visual.

### Cache-First (Fastest)

```
Request → Check cache → HIT → Return cached response
                       MISS → Fetch from network → Cache response → Return
```

**Use for**: Static assets with hashed filenames (JS/CSS bundles), images, fonts.
**Risk**: Stale content if you don't hash filenames or version caches.

### Network-First (Freshest)

```
Request → Try network (with timeout) → SUCCESS → Cache + Return
                                       TIMEOUT/FAIL → Check cache → Return cached (or offline page)
```

**Use for**: HTML pages, API endpoints where freshness matters.
**Risk**: Slow on poor networks (mitigate with timeout).

### Stale-While-Revalidate (Balanced)

```
Request → Return from cache immediately (if available)
          AND simultaneously fetch from network → Update cache for next time
```

**Use for**: API data that should be fast but eventually consistent. User profiles, settings, feed items.
**Risk**: User sees stale data until next request. Acceptable for most content.

### Network-Only

```
Request → Fetch from network → Return (no caching)
```

**Use for**: Analytics pings, authentication endpoints, real-time data.

### Cache-Only

```
Request → Return from cache → MISS → Error
```

**Use for**: Precached app shell resources that should always be available.

---

## Update Strategy

When you deploy new code, browsers check for SW updates on navigation (and via `registration.update()` calls).

### The Problem

A new SW installs but enters "waiting" state until all tabs using the old SW close. This can leave users on stale code for hours or days.

### Option 1: Skip Waiting + Clients Claim (Aggressive)

New SW immediately takes over. Risk: in-flight requests might get responses from different cache versions.

### Option 2: Prompt User to Reload (Recommended)

```typescript
// In your React app
navigator.serviceWorker.addEventListener('controllerchange', () => {
  // New SW took over — reload to get fresh resources
  window.location.reload();
});
```

Show a toast: "New version available — click to update" → user clicks → `registration.waiting.postMessage({ type: 'SKIP_WAITING' })` → new SW activates → `controllerchange` fires → reload.

See `code/react-pwa/src/hooks/useSWUpdate.ts` for the complete React hook.

### Option 3: Let It Happen Naturally (Conservative)

User closes all tabs → next visit gets new SW. Simplest, but slowest update propagation.

---

## Debugging

### Chrome DevTools

- **Application → Service Workers**: See registration, status, update buttons
- **Application → Cache Storage**: Inspect cached resources
- **Network tab**: Filter by "ServiceWorker" to see which requests were intercepted
- **Console**: SW `console.log` appears in DevTools when SW source is selected

### Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| SW not updating | Browser caches SW file | Set `Cache-Control: no-cache` on SW file |
| Stale content after deploy | Old cache not invalidated | Version-prefix caches, clean in activate |
| Offline page not showing | offline.html not precached | Add to install cache list |
| SW registered but not intercepting | Wrong scope | Check scope matches your routes |
| Push works in dev, not prod | Wrong VAPID keys | Check env variables in production |

### Nuclear Reset

If a broken SW is serving stale content and you need to recover:

```javascript
// Run in browser console
navigator.serviceWorker.getRegistrations().then((regs) => {
  regs.forEach((reg) => reg.unregister());
});
caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
// Then hard reload: Ctrl+Shift+R
```

In production, deploy a "kill switch" SW that immediately unregisters itself.

---
*Intinc Engineering — Service Worker Deep Dive v2.0*
