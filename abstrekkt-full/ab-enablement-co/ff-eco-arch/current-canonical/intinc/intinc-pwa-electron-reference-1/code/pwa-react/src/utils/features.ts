/**
 * Feature detection for progressive enhancement.
 * Returns capabilities — never throws.
 */

export interface BrowserCapabilities {
  serviceWorker: boolean;
  pushManager: boolean;
  notifications: boolean;
  backgroundSync: boolean;
  periodicBackgroundSync: boolean;
  indexedDB: boolean;
  cacheAPI: boolean;
  webShare: boolean;
  webShareFiles: boolean;
  mediaSession: boolean;
  badging: boolean;
  persistentStorage: boolean;
  storageEstimate: boolean;
  beforeInstallPrompt: boolean;
  displayModeStandalone: boolean;
}

/** Detect all PWA-relevant capabilities in one pass */
export function detectCapabilities(): BrowserCapabilities {
  const nav = typeof navigator !== "undefined" ? navigator : undefined;
  const win = typeof window !== "undefined" ? window : undefined;

  return {
    serviceWorker: !!nav && "serviceWorker" in nav,
    pushManager: !!win && "PushManager" in win,
    notifications: !!win && "Notification" in win,
    backgroundSync: !!win && "SyncManager" in win,
    periodicBackgroundSync:
      !!nav && "serviceWorker" in nav && "PeriodicSyncManager" in win!,
    indexedDB: !!win && "indexedDB" in win,
    cacheAPI: !!win && "caches" in win,
    webShare: !!nav && "share" in nav,
    webShareFiles: !!nav && "canShare" in nav,
    mediaSession: !!nav && "mediaSession" in nav,
    badging: !!nav && "setAppBadge" in nav,
    persistentStorage: !!nav?.storage && "persist" in nav.storage,
    storageEstimate: !!nav?.storage && "estimate" in nav.storage,
    beforeInstallPrompt: !!win, // Can't detect until event fires
    displayModeStandalone:
      !!win && win.matchMedia("(display-mode: standalone)").matches,
  };
}

/** Get a human-readable support report */
export function getSupportReport(): string {
  const caps = detectCapabilities();
  const lines = Object.entries(caps).map(
    ([key, val]) => `${val ? "✅" : "❌"} ${key}`
  );
  return lines.join("\n");
}
