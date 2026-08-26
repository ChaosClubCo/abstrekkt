/**
 * Programmatic cache management utilities.
 * Use alongside the service worker for fine-grained cache control.
 */

export const CACHE_NAMES = {
  api: "api-v1",
  images: "images-v1",
  fonts: "fonts-v1",
  static: "static-v1",
} as const;

/** Delete all caches not in the current version set */
export async function pruneOldCaches(): Promise<void> {
  const validNames = new Set(Object.values(CACHE_NAMES));
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((key) => !validNames.has(key))
      .map((key) => caches.delete(key))
  );
}

/** Get estimated storage usage */
export async function getStorageEstimate(): Promise<{
  usage: number;
  quota: number;
  percent: number;
}> {
  if (!navigator.storage?.estimate) {
    return { usage: 0, quota: 0, percent: 0 };
  }
  const { usage = 0, quota = 0 } = await navigator.storage.estimate();
  return { usage, quota, percent: quota > 0 ? (usage / quota) * 100 : 0 };
}

/** Request persistent storage (prevents eviction) */
export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;
  return navigator.storage.persist();
}

/** Count entries in a specific cache */
export async function getCacheEntryCount(
  cacheName: string
): Promise<number> {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    return keys.length;
  } catch {
    return 0;
  }
}

/** Delete a specific URL from a cache */
export async function evictFromCache(
  cacheName: string,
  url: string
): Promise<boolean> {
  const cache = await caches.open(cacheName);
  return cache.delete(url);
}
