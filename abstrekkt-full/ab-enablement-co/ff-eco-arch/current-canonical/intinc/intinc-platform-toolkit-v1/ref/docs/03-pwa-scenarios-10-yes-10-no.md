# PWA Scenarios — 10 Yes / 10 No

> **Purpose**: Concrete examples of when PWA is the right and wrong choice.
> **Use this for**: Stakeholder conversations, project evaluations, and sanity checks.

---

## 10 Scenarios Where PWA Wins

### 1. Commuter / Unreliable Network App
**Example**: Transit schedule app used in subway tunnels.
**Why PWA wins**: Offline cache means schedules load underground. No app store install means immediate access from a QR code.
**Key pillars**: Offline + Installability.

### 2. Data-Constrained Users
**Example**: Educational platform for users with metered mobile data.
**Why PWA wins**: Service worker serves cached lessons without burning data on repeat visits. App is 0MB to "install" vs. 50MB native download.
**Key pillars**: Offline + Performance.

### 3. Content Platforms & Blogs
**Example**: News site or recipe app.
**Why PWA wins**: Articles cache for offline reading. Push drives return visits. Installability puts you on the home screen alongside native news apps.
**Key pillars**: All three.

### 4. Marketplace / Catalog Browsing
**Example**: E-commerce product catalog (not checkout).
**Why PWA wins**: Product pages cache for browsing. Users compare without network dependency. Push for price drops.
**Key pillars**: Offline + Push.

### 5. Productivity / Task Management
**Example**: To-do app, project tracker, notes app.
**Why PWA wins**: Works offline (queue writes, sync later). Lives on home screen for quick access. Push for reminders.
**Key pillars**: All three.

### 6. Educational / Course Platforms
**Example**: LMS with video lessons and quizzes.
**Why PWA wins**: Students download lessons for offline viewing. Progress syncs when back online. Push for deadlines.
**Key pillars**: Offline + Push.

### 7. Travel & Hospitality
**Example**: Hotel booking app, city guide, itinerary planner.
**Why PWA wins**: Travelers lose connectivity. Cached itineraries, maps, and confirmation details are critical. No install friction for one-trip usage.
**Key pillars**: Offline + Installability.

### 8. Enterprise Internal Tools
**Example**: Field inspection app, inventory scanner, warehouse management.
**Why PWA wins**: No app store deployment needed. Works in low-signal warehouses/factories. IT can deploy via URL. Offline queue for data entry.
**Key pillars**: Offline + Installability.

### 9. News / Social / Feed Apps
**Example**: Social media reader, RSS aggregator.
**Why PWA wins**: Feed items cache for offline scrolling. Push for breaking news or mentions. Home screen presence.
**Key pillars**: All three.

### 10. Habit-Forming Apps with Push
**Example**: Meditation app, fitness tracker, language learning.
**Why PWA wins**: Push for daily reminders is the #1 retention driver. Offline content for sessions without WiFi. Home screen for visibility.
**Key pillars**: Push + Installability.

---

## 10 Scenarios Where PWA Loses

### 1. Real-Time Collaborative Editing
**Example**: Google Docs, Figma, Miro.
**Why PWA loses**: Requires persistent WebSocket connections, OT/CRDT synchronization, and sub-100ms latency. Offline support would require full CRDT implementation — enormous complexity for marginal benefit.
**Better choice**: Native web app with optional Electron wrapper for desktop.

### 2. Media Streaming
**Example**: Netflix, Spotify, video conferencing.
**Why PWA loses**: DRM (Widevine L1 requires native), background audio limitations on iOS, no offline download API for protected content. Push adds no value.
**Better choice**: Native app or Electron with native modules.

### 3. Native-First Feature Apps
**Example**: Camera app, AR experience, NFC reader.
**Why PWA loses**: Web APIs for camera/AR/NFC exist but are limited compared to native. No access to HealthKit, CallKit, ARKit, etc.
**Better choice**: Native or React Native/Flutter.

### 4. Highly Dynamic Dashboards
**Example**: Trading terminal, real-time analytics, live monitoring.
**Why PWA loses**: Data is stale within seconds. Caching adds complexity with zero benefit. Users are always online and expect live data.
**Better choice**: Standard web app. Electron if desktop-specific features needed.

### 5. Strict Compliance Environments
**Example**: Healthcare app requiring HIPAA BAA with specific MDM controls.
**Why PWA loses**: Limited control over data at rest, no hardware-backed encryption, no MDM integration. App store compliance requirements may mandate native.
**Better choice**: Native app with MDM enrollment.

### 6. Heavy Native API Dependency
**Example**: App needing Bluetooth LE, USB, file system beyond picker API, background geolocation.
**Why PWA loses**: Web APIs are limited, require permissions on each session, and have inconsistent cross-browser support. Background geolocation doesn't work in PWAs.
**Better choice**: Native, Electron (for desktop), or Capacitor (wraps PWA with native bridge).

### 7. Compute-Heavy Applications
**Example**: Video editor, 3D modeling, CAD software.
**Why PWA loses**: WASM helps but native still has 2–5× better performance for sustained computation. Memory limits in browsers. No GPU compute API equivalent to Metal/CUDA.
**Better choice**: Native or Electron with native modules.

### 8. One-Off Utility Usage
**Example**: QR code scanner, unit converter, calculator.
**Why PWA loses**: Users won't install it. They'll use it once from a search result and forget it. Investment in offline/push has zero ROI.
**Better choice**: Simple web page. Maybe add manifest for Path A if it takes <1 hour.

### 9. Enterprise Desktop with Mandated Software
**Example**: Internal tool that must integrate with Active Directory, read local files, run shell commands.
**Why PWA loses**: Can't access OS-level APIs, local file system (beyond File System Access API), or shell. Can't be deployed via SCCM/Intune as easily.
**Better choice**: Electron or Tauri.

### 10. Live Multi-User Experiences
**Example**: Multiplayer game, live auction, collaborative whiteboard.
**Why PWA loses**: Requires WebSocket/WebRTC with tight latency. Offline mode is meaningless for a live experience. Push adds no value.
**Better choice**: Standard web app or native.

---

## Category Quick Reference

| Category | PWA? | Path | Notes |
|----------|------|------|-------|
| Content / media consumption | ✅ | B or C | High cache value |
| Productivity / task mgmt | ✅ | C | Offline write + push |
| E-commerce (catalog) | ✅ | B | Cache browsing, queue cart |
| E-commerce (checkout) | ⚠️ | A or D | Checkout must be online |
| Enterprise field tools | ✅ | B or C | Offline-first critical |
| Enterprise desktop tools | ❌ | — | Use Electron |
| Real-time collaboration | ❌ | — | Use web app + optional Electron |
| Streaming media | ❌ | — | Use native |
| Games (casual) | ⚠️ | A | Installability only |
| Games (real-time multi) | ❌ | — | Use native/web sockets |
| IoT / hardware integration | ❌ | — | Use native or Electron |
| Internal dashboards | ⚠️ | A or D | Depends on connectivity |

---
*Intinc Engineering — PWA Scenarios v2.0*
