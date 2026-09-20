---
name: mobile-patterns
description: "Mobile-native patterns, gestures, and Progressive Web Apps (PWA). Use when: (1) Building app-like mobile experiences, (2) Implementing native gestures (swipe, pinch, drag), (3) Creating PWAs with offline support, (4) Optimizing for mobile performance, (5) Designing mobile-first navigation patterns"
license: MIT
---

# Mobile Patterns & Progressive Web Apps (PWA)

## Overview

Mobile-native patterns create app-like experiences in the browser. This skill covers touch gestures, bottom navigation, pull-to-refresh, PWA architecture, offline functionality, and mobile performance optimization for 2025.

**When to use this skill:**
- Building Progressive Web Apps (installable, offline-capable)
- Implementing native mobile gestures (swipe, pinch-to-zoom, long-press)
- Designing mobile-first navigation (bottom tabs, hamburger menus)
- Optimizing for mobile performance (60fps animations, battery efficiency)
- Creating app-like interactions (splash screens, push notifications)

**PWA Advantages (2025):**
- No app store approval (instant updates)
- Cross-platform (iOS, Android, desktop)
- Smaller install size (avg. 1MB vs. 50MB native app)
- Better discovery (indexed by search engines)

**Sources:** [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps), [Web.dev PWA](https://web.dev/progressive-web-apps/)

---

## Core Concepts

### PWA Requirements (Lighthouse Audit)

**Minimum Criteria:**
1. **HTTPS**: Required for service workers
2. **Manifest**: `manifest.json` (app metadata, icons)
3. **Service Worker**: Offline caching
4. **Responsive**: Works on mobile, tablet, desktop
5. **Installable**: "Add to Home Screen" prompt

**Optional (Enhanced):**
- Push notifications
- Background sync
- App shortcuts
- File handling

### Mobile Navigation Patterns

| Pattern | Use Case | Pros | Cons |
|---------|----------|------|------|
| **Bottom Tabs** | Primary navigation (3-5 items) | Thumb-friendly, always visible | Limited space |
| **Hamburger Menu** | Secondary nav (5+ items) | Hides clutter, saves space | Low discoverability |
| **Tab Bar** | Content sections (news, photos) | Clear sections, swipeable | Max 5 tabs |
| **Drawer** | Settings, profile | Common pattern, familiar | Requires extra tap |

**Best Practice:** Combine bottom tabs (primary) + hamburger (secondary).

---

## Workflow 1: Build Progressive Web App (PWA)

### Step 1: Create Web App Manifest

**manifest.json:**
```json
{
  "name": "My PWA App",
  "short_name": "MyApp",
  "description": "A Progressive Web App example",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#2563EB",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/mobile.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshots/desktop.png",
      "sizes": "1920x1080",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "shortcuts": [
    {
      "name": "New Post",
      "url": "/new-post",
      "description": "Create a new post",
      "icons": [{ "src": "/icons/new-post.png", "sizes": "96x96" }]
    }
  ]
}
```

**Link in HTML:**
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#2563EB">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

**Icon Requirements:**
- **Sizes**: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- **Format**: PNG (WebP for smaller size)
- **Purpose**: `any` (standard), `maskable` (adaptive icons on Android)

**Tool:** [Maskable.app](https://maskable.app/) (test maskable icons)

**Sources:** [MDN Web Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

### Step 2: Implement Service Worker (Offline Caching)

**service-worker.js:**
```javascript
const CACHE_NAME = 'my-pwa-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/script.js',
  '/offline.html',
  '/icons/icon-192x192.png'
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch: Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return cached response
        if (response) {
          return response;
        }

        // Clone request (can only be used once)
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response (can only be used once)
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Network failed, serve offline page
        return caches.match('/offline.html');
      })
  );
});
```

**Register Service Worker (main.js):**
```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
```

**Caching Strategies:**
| Strategy | When to Use | Code Pattern |
|----------|-------------|--------------|
| **Cache First** | Static assets (CSS, JS, images) | Try cache → fallback to network |
| **Network First** | Dynamic content (API calls) | Try network → fallback to cache |
| **Stale While Revalidate** | Content that can be outdated briefly | Serve cache → update in background |

**Example: Network First (for API calls):**
```javascript
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request)) // Fallback to cache
    );
  }
});
```

**Sources:** [MDN Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### Step 3: Add Install Prompt (A2HS)

**Capture Install Prompt:**
```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent default mini-infobar
  e.preventDefault();
  deferredPrompt = e;

  // Show custom install button
  const installBtn = document.getElementById('install-btn');
  installBtn.style.display = 'block';

  installBtn.addEventListener('click', () => {
    // Show install prompt
    deferredPrompt.prompt();

    // Wait for user choice
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted install');
      } else {
        console.log('User dismissed install');
      }
      deferredPrompt = null;
    });
  });
});

// Hide install button after installed
window.addEventListener('appinstalled', () => {
  console.log('PWA installed');
  document.getElementById('install-btn').style.display = 'none';
});
```

**Install Button (HTML):**
```html
<button id="install-btn" style="display: none;">
  Install App
</button>
```

---

## Workflow 2: Implement Mobile Gestures

### Swipe Gestures (Touch Events)

**Swipeable Cards (React):**
```tsx
import { useState, useRef } from 'react';

function SwipeableCard({ onSwipeLeft, onSwipeRight }) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    setCurrentX(e.touches[0].clientX - startX);
  };

  const handleTouchEnd = () => {
    const threshold = 100; // Minimum swipe distance
    if (currentX > threshold) {
      onSwipeRight();
    } else if (currentX < -threshold) {
      onSwipeLeft();
    }
    setIsSwiping(false);
    setCurrentX(0);
  };

  return (
    <div
      ref={cardRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${currentX}px)`,
        transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
      }}
    >
      Card Content
    </div>
  );
}
```

**Vanilla JS (Pointer Events - unified touch/mouse):**
```javascript
const card = document.querySelector('.card');
let startX = 0;

card.addEventListener('pointerdown', (e) => {
  startX = e.clientX;
  card.setPointerCapture(e.pointerId);
});

card.addEventListener('pointermove', (e) => {
  if (e.buttons === 1) { // Left button pressed
    const deltaX = e.clientX - startX;
    card.style.transform = `translateX(${deltaX}px)`;
  }
});

card.addEventListener('pointerup', (e) => {
  const deltaX = e.clientX - startX;
  if (Math.abs(deltaX) > 100) {
    console.log(deltaX > 0 ? 'Swipe Right' : 'Swipe Left');
  }
  card.style.transform = '';
  card.releasePointerCapture(e.pointerId);
});
```

### Pull-to-Refresh

**Using Overscroll Behavior (CSS-only):**
```css
body {
  overscroll-behavior-y: contain; /* Prevent bounce, enable pull-to-refresh */
}
```

**Custom Implementation (React):**
```tsx
import { useState, useEffect } from 'react';

function PullToRefresh({ onRefresh, children }) {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const threshold = 80; // Minimum pull distance

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) { // Only at top of page
        setStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && startY > 0) {
        const distance = e.touches[0].clientY - startY;
        if (distance > 0) {
          setPullDistance(distance);
        }
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance > threshold) {
        setIsRefreshing(true);
        await onRefresh();
        setIsRefreshing(false);
      }
      setPullDistance(0);
      setStartY(0);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startY, pullDistance, onRefresh]);

  return (
    <div>
      {pullDistance > 0 && (
        <div style={{ height: pullDistance, textAlign: 'center' }}>
          {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
        </div>
      )}
      {children}
    </div>
  );
}
```

### Pinch-to-Zoom (Images)

**Using CSS (Simple):**
```css
img {
  touch-action: pinch-zoom; /* Enable pinch gesture */
}
```

**Custom Implementation (React):**
```tsx
import { useState, useRef } from 'react';

function PinchZoomImage({ src, alt }) {
  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const initialDistance = useRef(0);

  const getDistance = (touch1: Touch, touch2: Touch) => {
    return Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      initialDistance.current = getDistance(e.touches[0], e.touches[1]);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDistance.current > 0) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const newScale = (currentDistance / initialDistance.current) * scale;
      setScale(Math.max(1, Math.min(newScale, 3))); // Clamp 1x-3x
    }
  };

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      style={{
        transform: `scale(${scale})`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
}
```

---

## Workflow 3: Mobile Navigation Patterns

### Bottom Tab Bar (iOS/Android Style)

**HTML:**
```html
<nav class="bottom-nav" role="navigation" aria-label="Main">
  <a href="/" class="nav-item active" aria-current="page">
    <svg class="icon"><!-- Home icon --></svg>
    <span>Home</span>
  </a>
  <a href="/search" class="nav-item">
    <svg class="icon"><!-- Search icon --></svg>
    <span>Search</span>
  </a>
  <a href="/profile" class="nav-item">
    <svg class="icon"><!-- Profile icon --></svg>
    <span>Profile</span>
  </a>
</nav>
```

**CSS:**
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background: #FFFFFF;
  border-top: 1px solid #E5E7EB;
  padding: 8px 0;
  z-index: 100;
  /* Safe area for iPhone notch */
  padding-bottom: max(8px, env(safe-area-inset-bottom));
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  color: #6B7280;
  text-decoration: none;
  font-size: 12px;
  min-width: 60px; /* Touch target */
  min-height: 48px; /* WCAG requirement */
}

.nav-item.active {
  color: #2563EB;
}

.icon {
  width: 24px;
  height: 24px;
}
```

**React Component:**
```tsx
function BottomNav({ activeTab }: { activeTab: string }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon, href: '/' },
    { id: 'search', label: 'Search', icon: SearchIcon, href: '/search' },
    { id: 'profile', label: 'Profile', icon: UserIcon, href: '/profile' },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <a
          key={tab.id}
          href={tab.href}
          className={activeTab === tab.id ? 'nav-item active' : 'nav-item'}
          aria-current={activeTab === tab.id ? 'page' : undefined}
        >
          <tab.icon className="icon" />
          <span>{tab.label}</span>
        </a>
      ))}
    </nav>
  );
}
```

### Hamburger Menu (Off-Canvas Drawer)

**HTML:**
```html
<button class="hamburger" aria-label="Menu" aria-expanded="false">
  <span></span>
  <span></span>
  <span></span>
</button>

<nav class="drawer" role="navigation" aria-label="Main">
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>

<div class="overlay"></div>
```

**CSS:**
```css
/* Hamburger Icon */
.hamburger {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
}

.hamburger span {
  width: 24px;
  height: 3px;
  background: #1F2937;
  transition: transform 0.3s ease;
}

/* Animate to X when open */
.hamburger[aria-expanded="true"] span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger[aria-expanded="true"] span:nth-child(2) {
  opacity: 0;
}

.hamburger[aria-expanded="true"] span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

/* Drawer (Off-Canvas) */
.drawer {
  position: fixed;
  top: 0;
  left: -300px; /* Hidden by default */
  width: 300px;
  height: 100%;
  background: #FFFFFF;
  padding: 64px 24px;
  transition: left 0.3s ease;
  z-index: 200;
}

.drawer.is-open {
  left: 0;
}

/* Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 100;
}

.overlay.is-visible {
  opacity: 1;
  pointer-events: auto;
}
```

**JavaScript (Toggle):**
```javascript
const hamburger = document.querySelector('.hamburger');
const drawer = document.querySelector('.drawer');
const overlay = document.querySelector('.overlay');

hamburger.addEventListener('click', () => {
  const isOpen = drawer.classList.toggle('is-open');
  overlay.classList.toggle('is-visible');
  hamburger.setAttribute('aria-expanded', isOpen);

  // Trap focus inside drawer
  if (isOpen) {
    drawer.querySelector('a').focus();
  }
});

overlay.addEventListener('click', () => {
  drawer.classList.remove('is-open');
  overlay.classList.remove('is-visible');
  hamburger.setAttribute('aria-expanded', 'false');
});
```

---

## Workflow 4: Mobile Performance Optimization

### 60fps Animations (GPU Acceleration)

**Use `transform` and `opacity` (GPU-accelerated):**
```css
/* ✅ GOOD: GPU-accelerated */
.button {
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.button:hover {
  transform: translateX(10px);
}

/* ❌ BAD: CPU-intensive (causes repaints) */
.button {
  left: 0;
  transition: left 0.3s ease;
}

.button:hover {
  left: 10px;
}
```

**Force GPU Layer (for complex animations):**
```css
.animated {
  will-change: transform; /* Hint to browser: GPU layer */
  transform: translateZ(0); /* Force 3D context */
}
```

**Performance Rule:** Only animate `transform` and `opacity` for 60fps.

### Reduce JavaScript Execution (Passive Event Listeners)

**Problem:** Scroll event handlers block rendering.

**Solution:** Use passive listeners (browser won't wait for JS).

```javascript
// ✅ GOOD: Passive (doesn't block scroll)
document.addEventListener('scroll', handleScroll, { passive: true });

// ❌ BAD: Default (blocks scroll until JS finishes)
document.addEventListener('scroll', handleScroll);
```

**When to Use Passive:**
- Scroll tracking (analytics, infinite scroll)
- Touch events (swipe detection)
- Wheel events (custom scrolling)

**When NOT to Use Passive:**
- `preventDefault()` needed (e.g., block default swipe)

### Battery-Efficient Animations (Reduce Motion)

**Respect User Preference:**
```css
/* Normal animations */
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.element {
  animation: slideIn 0.5s ease-out;
}

/* Disable for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .element {
    animation: none;
    transform: translateX(0); /* Instant, no animation */
  }
}
```

**JavaScript Detection:**
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Enable animations
} else {
  // Disable or simplify animations
}
```

---

## Advanced PWA Features

### Push Notifications

**Request Permission:**
```javascript
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.error('Notifications not supported');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted');
    subscribeUserToPush();
  }
}

async function subscribeUserToPush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
  });

  // Send subscription to server
  await fetch('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: { 'Content-Type': 'application/json' }
  });
}
```

**Service Worker (Receive Notification):**
```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: { url: data.url }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
```

**Sources:** [MDN Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

### Background Sync (Offline Queue)

**Register Sync (when online):**
```javascript
async function syncData() {
  const registration = await navigator.serviceWorker.ready;
  await registration.sync.register('sync-data');
}

// Queue API request when offline
async function sendMessage(message) {
  if (navigator.onLine) {
    await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify(message)
    });
  } else {
    // Store in IndexedDB, sync later
    await saveToIndexedDB(message);
    await syncData();
  }
}
```

**Service Worker (Process Sync):**
```javascript
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      getFromIndexedDB().then((messages) => {
        return Promise.all(
          messages.map((msg) =>
            fetch('/api/messages', {
              method: 'POST',
              body: JSON.stringify(msg)
            }).then(() => deleteFromIndexedDB(msg.id))
          )
        );
      })
    );
  }
});
```

---

## Quality Gates

### PWA Checklist (Lighthouse Audit)
- [ ] HTTPS enabled (required for service worker)
- [ ] Manifest.json valid (name, icons, start_url, display)
- [ ] Service worker registered (offline caching)
- [ ] Installable (A2HS prompt works)
- [ ] Responsive (works on mobile, tablet, desktop)
- [ ] Fast load (<3s on 3G)
- [ ] Offline fallback page (cached)

### Mobile Gesture Checklist
- [ ] Swipe gestures natural (threshold ≥100px)
- [ ] Pull-to-refresh only at top of page (no conflicts)
- [ ] Pinch-to-zoom enabled (images, maps)
- [ ] Touch targets ≥44x44px (WCAG 2.5.5)
- [ ] Haptic feedback on long-press (vibration API)
- [ ] Scroll momentum (overscroll-behavior: auto)

### Performance Checklist
- [ ] Animations use `transform` and `opacity` only
- [ ] Passive event listeners for scroll/touch
- [ ] No layout thrashing (batch DOM reads/writes)
- [ ] Images lazy-loaded (loading="lazy")
- [ ] Reduced motion respected (prefers-reduced-motion)
- [ ] JavaScript deferred (async/defer attributes)
- [ ] Service worker caches aggressively (static assets)

---

## Gaps / Blindspots

### What I Don't Know
- **iOS PWA limitations**: Safari restricts push notifications, background sync
- **Battery impact**: Aggressive caching/sync may drain battery
- **Storage quotas**: IndexedDB/Cache API limits vary by browser

### Unvalidated Assumptions
- Users understand "Add to Home Screen" prompt
- Network conditions consistent (may need adaptive caching strategies)
- Service workers supported (requires HTTPS, modern browsers)

### Unknown Unknowns
- Future PWA APIs (file system access, Bluetooth, USB)
- Browser vendor restrictions (Apple may limit PWA features)
- Cross-origin caching (CORS issues with CDN assets)

---

## Sources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [MDN Web Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [MDN Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Maskable.app](https://maskable.app/)
- [Lighthouse PWA Audit](https://web.dev/lighthouse-pwa/)
