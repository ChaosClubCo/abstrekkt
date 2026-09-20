/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import {
  CacheFirst,
  StaleWhileRevalidate,
  NetworkFirst,
} from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { BackgroundSyncPlugin } from "workbox-background-sync";

declare let self: ServiceWorkerGlobalScope;

// ── Versioning ──
const CACHE_VERSION = "v1";
const API_CACHE = `api-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;
const FONT_CACHE = `fonts-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;

// ── Precache ──
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// ── Navigation (SPA fallback) ──
const navigationHandler = new NetworkFirst({
  cacheName: STATIC_CACHE,
  networkTimeoutSeconds: 3,
  plugins: [
    new CacheableResponsePlugin({ statuses: [200] }),
  ],
});
registerRoute(new NavigationRoute(navigationHandler));

// ── API Routes: Stale-While-Revalidate ──
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    cacheName: API_CACHE,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 86_400 }),
      new BackgroundSyncPlugin("api-retry-queue", {
        maxRetentionTime: 24 * 60, // 24 hours in minutes
        onSync: async ({ queue }) => {
          let entry;
          while ((entry = await queue.shiftRequest())) {
            try {
              await fetch(entry.request.clone());
            } catch (err) {
              await queue.unshiftRequest(entry);
              throw err;
            }
          }
        },
      }),
    ],
  })
);

// ── Images: Cache-First, 30 days TTL ──
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: IMAGE_CACHE,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 30 * 86_400 }),
    ],
  })
);

// ── Fonts: Cache-First, 1 year TTL ──
registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: FONT_CACHE,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 365 * 86_400 }),
    ],
  })
);

// ── Push Notifications ──
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json() as {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: Record<string, unknown>;
    actions?: NotificationAction[];
  };

  const options: NotificationOptions = {
    body: data.body,
    icon: data.icon ?? "/pwa-192x192.png",
    badge: data.badge ?? "/badge-72x72.png",
    tag: data.tag ?? "default",
    data: data.data,
    actions: data.actions,
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// ── Notification Click ──
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    (event.notification.data?.url as string) ?? "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        const existing = clients.find((c) => c.url === targetUrl);
        if (existing) return existing.focus();
        return self.clients.openWindow(targetUrl);
      })
  );
});

// ── Background Sync ──
self.addEventListener("sync", (event) => {
  if (event.tag === "offline-mutations") {
    event.waitUntil(replayOfflineMutations());
  }
});

async function replayOfflineMutations(): Promise<void> {
  // Pull queued mutations from IndexedDB and replay
  // Implementation depends on your offline-sync module
  console.log("[SW] Replaying offline mutations");
}

// ── Periodic Background Sync ──
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "content-sync") {
    event.waitUntil(syncContent());
  }
});

async function syncContent(): Promise<void> {
  console.log("[SW] Periodic content sync triggered");
}

// ── Skip Waiting on message ──
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
