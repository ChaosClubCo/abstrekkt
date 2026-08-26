/**
 * Detect PWA-relevant browser capabilities.
 * Returns a plain object — safe for JSON serialization.
 */

export interface BrowserCapabilities {
  serviceWorker: boolean;
  pushManager: boolean;
  notifications: boolean;
  backgroundSync: boolean;
  periodicSync: boolean;
  indexedDB: boolean;
  cacheAPI: boolean;
  webShare: boolean;
  persistentStorage: boolean;
  standalone: boolean;
}

export function detectCapabilities(): BrowserCapabilities {
  const n = typeof navigator !== "undefined" ? navigator : null;
  const w = typeof window !== "undefined" ? window : null;

  return {
    serviceWorker: !!n && "serviceWorker" in n,
    pushManager: !!w && "PushManager" in w,
    notifications: !!w && "Notification" in w,
    backgroundSync: !!w && "SyncManager" in w,
    periodicSync: !!n && "serviceWorker" in n && !!w && "PeriodicSyncManager" in w,
    indexedDB: !!w && "indexedDB" in w,
    cacheAPI: !!w && "caches" in w,
    webShare: !!n && "share" in n,
    persistentStorage: !!n?.storage && "persist" in n.storage,
    standalone: !!w && w.matchMedia("(display-mode: standalone)").matches,
  };
}
