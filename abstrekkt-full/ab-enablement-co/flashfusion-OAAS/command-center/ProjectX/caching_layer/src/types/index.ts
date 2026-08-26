export interface CacheConfig {
  redis: RedisConfig;
  defaultTTL: number;
  keyPrefix: string;
  serializer: 'json' | 'msgpack';
  enableL1Cache: boolean;
  l1MaxSize: number;
}

export interface RedisConfig {
  url: string;
  maxRetries: number;
  connectTimeout: number;
  password?: string;
  tls?: boolean;
}

export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  ttl: number;
  tags: string[];
  createdAt: number;
  expiresAt: number;
}

export interface CacheOptions {
  ttl?: number;
  tags?: string[];
  staleTime?: number;
  enabled?: boolean;
  writeThrough?: boolean;
  onWrite?: (key: string, value: unknown) => Promise<void>;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  memoryUsage: number;
}

export interface CacheResult<T> {
  data: T | null;
  isLoading: boolean;
  isStale: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface CacheInvalidationOptions {
  pattern?: string;
  tags?: string[];
  broadcast?: boolean;
}

export type CacheSerializer = {
  serialize: (value: unknown) => string;
  deserialize: <T>(data: string) => T;
};

export interface L1CacheConfig {
  max: number;
  ttl: number;
  updateAgeOnGet: boolean;
}

export interface CacheEvent {
  type: 'hit' | 'miss' | 'set' | 'delete' | 'invalidate';
  key: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface CacheProviderProps {
  config: Partial<CacheConfig>;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
