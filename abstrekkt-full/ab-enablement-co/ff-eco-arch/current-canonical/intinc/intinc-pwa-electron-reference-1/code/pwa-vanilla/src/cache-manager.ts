/**
 * Programmatic cache management — framework agnostic.
 *
 * @example
 * ```ts
 * const cache = new CacheManager({
 *   version: "v2",
 *   caches: { api: 86400, images: 2592000, fonts: 31536000 },
 * });
 * await cache.pruneStale();
 * console.log(await cache.getStorageReport());
 * ```
 */

export interface CacheConfig {
  version: string;
  caches: Record<string, number>; // name → maxAgeSeconds
}

export class CacheManager {
  private readonly cacheNames: Map<string, string>;

  constructor(private readonly config: CacheConfig) {
    this.cacheNames = new Map(
      Object.keys(config.caches).map((name) => [
        name,
        `${name}-${config.version}`,
      ])
    );
  }

  /** Delete all caches not belonging to the current version */
  async pruneStale(): Promise<string[]> {
    const validNames = new Set(this.cacheNames.values());
    const allKeys = await caches.keys();
    const stale = allKeys.filter((key) => !validNames.has(key));
    await Promise.all(stale.map((key) => caches.delete(key)));
    return stale;
  }

  /** Get entry count and estimated size for each cache */
  async getStorageReport(): Promise<
    Array<{ name: string; entries: number; versionedName: string }>
  > {
    const report = [];
    for (const [name, versionedName] of this.cacheNames) {
      try {
        const cache = await caches.open(versionedName);
        const keys = await cache.keys();
        report.push({ name, versionedName, entries: keys.length });
      } catch {
        report.push({ name, versionedName, entries: 0 });
      }
    }
    return report;
  }

  /** Evict a specific URL from a named cache */
  async evict(cacheName: string, url: string): Promise<boolean> {
    const versioned = this.cacheNames.get(cacheName);
    if (!versioned) return false;
    const cache = await caches.open(versioned);
    return cache.delete(url);
  }

  /** Request persistent storage to prevent browser eviction */
  async requestPersistence(): Promise<boolean> {
    if (!navigator.storage?.persist) return false;
    return navigator.storage.persist();
  }

  /** Get storage quota usage */
  async getQuotaUsage(): Promise<{ usedMB: number; totalMB: number; percent: number }> {
    if (!navigator.storage?.estimate) {
      return { usedMB: 0, totalMB: 0, percent: 0 };
    }
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    const MB = 1024 * 1024;
    return {
      usedMB: Math.round((usage / MB) * 100) / 100,
      totalMB: Math.round((quota / MB) * 100) / 100,
      percent: quota > 0 ? Math.round((usage / quota) * 10000) / 100 : 0,
    };
  }
}
