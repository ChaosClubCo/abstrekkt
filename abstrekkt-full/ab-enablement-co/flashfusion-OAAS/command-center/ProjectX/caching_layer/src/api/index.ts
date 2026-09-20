import type { CacheConfig, CacheEntry, CacheOptions, CacheStats, CacheSerializer } from '../types';

const API_BASE = '/api/cache';

// Cache client for server-side operations
export class CacheClient {
  private config: CacheConfig;
  private serializer: CacheSerializer;

  constructor(config: CacheConfig) {
    this.config = config;
    this.serializer = this.createSerializer(config.serializer);
  }

  private createSerializer(type: 'json' | 'msgpack'): CacheSerializer {
    if (type === 'json') {
      return {
        serialize: (value) => JSON.stringify(value),
        deserialize: <T>(data: string) => JSON.parse(data) as T,
      };
    }
    // MessagePack would require additional library
    return {
      serialize: (value) => JSON.stringify(value),
      deserialize: <T>(data: string) => JSON.parse(data) as T,
    };
  }

  private buildKey(key: string): string {
    return `${this.config.keyPrefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const response = await fetch(`${API_BASE}/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: this.buildKey(key) }),
    });

    if (!response.ok) return null;

    const { data } = await response.json();
    return data ? this.serializer.deserialize<T>(data) : null;
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const entry: CacheEntry<T> = {
      key: this.buildKey(key),
      value,
      ttl: options.ttl ?? this.config.defaultTTL,
      tags: options.tags ?? [],
      createdAt: Date.now(),
      expiresAt: Date.now() + (options.ttl ?? this.config.defaultTTL) * 1000,
    };

    await fetch(`${API_BASE}/set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: entry.key,
        value: this.serializer.serialize(value),
        ttl: entry.ttl,
        tags: entry.tags,
      }),
    });
  }

  async delete(key: string): Promise<void> {
    await fetch(`${API_BASE}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: this.buildKey(key) }),
    });
  }

  async invalidateByTag(tag: string): Promise<number> {
    const response = await fetch(`${API_BASE}/invalidate/tag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag }),
    });

    const { count } = await response.json();
    return count;
  }

  async invalidateByPattern(pattern: string): Promise<number> {
    const response = await fetch(`${API_BASE}/invalidate/pattern`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pattern: this.buildKey(pattern) }),
    });

    const { count } = await response.json();
    return count;
  }

  async getStats(): Promise<CacheStats> {
    const response = await fetch(`${API_BASE}/stats`);
    return response.json();
  }

  async flush(): Promise<void> {
    await fetch(`${API_BASE}/flush`, { method: 'POST' });
  }

  async keys(pattern: string = '*'): Promise<string[]> {
    const response = await fetch(`${API_BASE}/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pattern: this.buildKey(pattern) }),
    });

    const { keys } = await response.json();
    return keys.map((k: string) => k.replace(this.config.keyPrefix, ''));
  }

  async exists(key: string): Promise<boolean> {
    const response = await fetch(`${API_BASE}/exists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: this.buildKey(key) }),
    });

    const { exists } = await response.json();
    return exists;
  }

  async ttl(key: string): Promise<number> {
    const response = await fetch(`${API_BASE}/ttl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: this.buildKey(key) }),
    });

    const { ttl } = await response.json();
    return ttl;
  }

  async extend(key: string, ttl: number): Promise<void> {
    await fetch(`${API_BASE}/extend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: this.buildKey(key), ttl }),
    });
  }
}

// Singleton instance factory
let clientInstance: CacheClient | null = null;

export function getCacheClient(config?: CacheConfig): CacheClient {
  if (!clientInstance && config) {
    clientInstance = new CacheClient(config);
  }
  if (!clientInstance) {
    throw new Error('CacheClient not initialized. Provide config on first call.');
  }
  return clientInstance;
}
