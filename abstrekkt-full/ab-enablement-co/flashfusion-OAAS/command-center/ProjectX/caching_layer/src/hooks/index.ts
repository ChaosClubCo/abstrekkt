import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import type { CacheConfig, CacheOptions, CacheResult, CacheStats } from '../types';
import { getCacheClient, CacheClient } from '../api';

// Cache context
interface CacheContextValue {
  client: CacheClient;
  config: CacheConfig;
}

export const CacheContext = createContext<CacheContextValue | null>(null);

export function useCacheContext(): CacheContextValue {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCacheContext must be used within a CacheProvider');
  }
  return context;
}

// Main cache hook
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): CacheResult<T> {
  const { client } = useCacheContext();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { ttl, tags, staleTime = 0, enabled = true, writeThrough, onWrite } = options;

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    try {
      // Try cache first
      const cached = await client.get<T>(key);

      if (cached !== null) {
        setData(cached);
        setIsLoading(false);

        // Check if stale
        if (staleTime > 0) {
          setIsStale(true);
          // Revalidate in background
          const fresh = await fetcher();
          await client.set(key, fresh, { ttl, tags });
          setData(fresh);
          setIsStale(false);
        }
        return;
      }

      // Cache miss - fetch fresh data
      const fresh = await fetcher();
      await client.set(key, fresh, { ttl, tags });
      setData(fresh);

      // Write-through if enabled
      if (writeThrough && onWrite) {
        await onWrite(key, fresh);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Cache fetch failed'));
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, client, enabled, ttl, tags, staleTime, writeThrough, onWrite]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    await client.delete(key);
    await fetchData();
  }, [client, key, fetchData]);

  return { data, isLoading, isStale, error, refetch };
}

// Cache invalidation hook
export function useCacheInvalidation() {
  const { client } = useCacheContext();

  const invalidate = useCallback(
    async (key: string) => {
      await client.delete(key);
    },
    [client]
  );

  const invalidateByTag = useCallback(
    async (tag: string) => {
      return client.invalidateByTag(tag);
    },
    [client]
  );

  const invalidateByPattern = useCallback(
    async (pattern: string) => {
      return client.invalidateByPattern(pattern);
    },
    [client]
  );

  const flush = useCallback(async () => {
    await client.flush();
  }, [client]);

  return { invalidate, invalidateByTag, invalidateByPattern, flush };
}

// Cache stats hook
export function useCacheStats(): { stats: CacheStats | null; isLoading: boolean; refetch: () => void } {
  const { client } = useCacheContext();
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const s = await client.getStats();
      setStats(s);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, refetch: fetchStats };
}

// Cache prefetch hook
export function useCachePrefetch() {
  const { client } = useCacheContext();

  const prefetch = useCallback(
    async <T>(key: string, fetcher: () => Promise<T>, options: CacheOptions = {}) => {
      const exists = await client.exists(key);
      if (!exists) {
        const data = await fetcher();
        await client.set(key, data, options);
      }
    },
    [client]
  );

  const prefetchMany = useCallback(
    async <T>(
      items: Array<{ key: string; fetcher: () => Promise<T>; options?: CacheOptions }>
    ) => {
      await Promise.all(items.map(({ key, fetcher, options }) => prefetch(key, fetcher, options)));
    },
    [prefetch]
  );

  return { prefetch, prefetchMany };
}

// Cache mutation hook
export function useCacheMutation<T, V>(
  key: string,
  mutationFn: (variables: V) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    invalidateTags?: string[];
  } = {}
) {
  const { client } = useCacheContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (variables: V) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mutationFn(variables);
        await client.set(key, result);

        // Invalidate related tags
        if (options.invalidateTags) {
          await Promise.all(options.invalidateTags.map((tag) => client.invalidateByTag(tag)));
        }

        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Mutation failed');
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [client, key, mutationFn, options]
  );

  return { mutate, isLoading, error };
}
