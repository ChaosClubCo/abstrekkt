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


## References
- `references/pull-to-refresh.md` — Pull-to-Refresh
- `references/references.md` — References
- `references/workflow-3-mobile-navigation-patterns.md` — Workflow 3: Mobile Navigation Patterns
