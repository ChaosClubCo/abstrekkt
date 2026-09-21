import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import {
  CacheContext,
  useCacheContext,
  useCache,
  useCacheInvalidation,
  useCacheStats,
  useCachePrefetch,
  useCacheMutation,
} from '../hooks';
import type { CacheConfig, CacheStats } from '../types';
import { CacheClient } from '../api';

// Mock the CacheClient
vi.mock('../api', () => {
  return {
    CacheClient: vi.fn().mockImplementation(() => ({
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      invalidateByTag: vi.fn(),
      invalidateByPattern: vi.fn(),
      getStats: vi.fn(),
      flush: vi.fn(),
      exists: vi.fn(),
    })),
    getCacheClient: vi.fn(),
  };
});

describe('useCacheContext', () => {
  it('should throw error when used outside CacheProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useCacheContext());
    }).toThrow('useCacheContext must be used within a CacheProvider');

    consoleSpy.mockRestore();
  });

  it('should return context value when used within provider', () => {
    const mockClient = new CacheClient({} as CacheConfig);
    const mockConfig: CacheConfig = {
      redis: { url: 'redis://localhost:6379', maxRetries: 3, connectTimeout: 5000 },
      defaultTTL: 300,
      keyPrefix: 'test:',
      serializer: 'json',
      enableL1Cache: true,
      l1MaxSize: 1000,
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CacheContext.Provider value={{ client: mockClient, config: mockConfig }}>
        {children}
      </CacheContext.Provider>
    );

    const { result } = renderHook(() => useCacheContext(), { wrapper });

    expect(result.current.client).toBe(mockClient);
    expect(result.current.config).toBe(mockConfig);
  });
});

describe('useCache', () => {
  const mockConfig: CacheConfig = {
    redis: { url: 'redis://localhost:6379', maxRetries: 3, connectTimeout: 5000 },
    defaultTTL: 300,
    keyPrefix: 'test:',
    serializer: 'json',
    enableL1Cache: true,
    l1MaxSize: 1000,
  };

  let mockClient: {
    get: ReturnType<typeof vi.fn>;
    set: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    };
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <CacheContext.Provider value={{ client: mockClient as unknown as CacheClient, config: mockConfig }}>
        {children}
      </CacheContext.Provider>
    );
  };

  describe('initial state', () => {
    it('should have null data initially', () => {
      mockClient.get.mockResolvedValue(null);

      const { result } = renderHook(
        () => useCache('testKey', () => Promise.resolve('value')),
        { wrapper: createWrapper() }
      );

      expect(result.current.data).toBeNull();
    });

    it('should have isLoading true initially', () => {
      mockClient.get.mockResolvedValue(null);

      const { result } = renderHook(
        () => useCache('testKey', () => Promise.resolve('value')),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should have isStale false initially', () => {
      mockClient.get.mockResolvedValue(null);

      const { result } = renderHook(
        () => useCache('testKey', () => Promise.resolve('value')),
        { wrapper: createWrapper() }
      );

      expect(result.current.isStale).toBe(false);
    });

    it('should have null error initially', () => {
      mockClient.get.mockResolvedValue(null);

      const { result } = renderHook(
        () => useCache('testKey', () => Promise.resolve('value')),
        { wrapper: createWrapper() }
      );

      expect(result.current.error).toBeNull();
    });
  });

  describe('cache hit', () => {
    it('should return cached data on cache hit', async () => {
      const cachedData = { name: 'cached', value: 42 };
      mockClient.get.mockResolvedValue(cachedData);

      const fetcher = vi.fn().mockResolvedValue({ name: 'fresh', value: 100 });

      const { result } = renderHook(
        () => useCache('testKey', fetcher),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(cachedData);
      expect(fetcher).not.toHaveBeenCalled();
    });

    it('should set isLoading to false after cache hit', async () => {
      mockClient.get.mockResolvedValue('cached');

      const { result } = renderHook(
        () => useCache('testKey', () => Promise.resolve('fresh')),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('cache miss', () => {
    it('should fetch and cache data on cache miss', async () => {
      mockClient.get.mockResolvedValue(null);
      mockClient.set.mockResolvedValue(undefined);

      const freshData = { name: 'fresh', value: 100 };
      const fetcher = vi.fn().mockResolvedValue(freshData);

      const { result } = renderHook(
        () => useCache('testKey', fetcher),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(freshData);
      expect(fetcher).toHaveBeenCalled();
      expect(mockClient.set).toHaveBeenCalledWith('testKey', freshData, expect.any(Object));
    });

    it('should use custom TTL option when caching', async () => {
      mockClient.get.mockResolvedValue(null);
      mockClient.set.mockResolvedValue(undefined);

      const fetcher = vi.fn().mockResolvedValue('data');

      renderHook(
        () => useCache('testKey', fetcher, { ttl: 600 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockClient.set).toHaveBeenCalled();
      });

      expect(mockClient.set).toHaveBeenCalledWith('testKey', 'data', expect.objectContaining({ ttl: 600 }));
    });

    it('should use tags option when caching', async () => {
      mockClient.get.mockResolvedValue(null);
      mockClient.set.mockResolvedValue(undefined);

      const fetcher = vi.fn().mockResolvedValue('data');

      renderHook(
        () => useCache('testKey', fetcher, { tags: ['user', 'profile'] }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockClient.set).toHaveBeenCalled();
      });

      expect(mockClient.set).toHaveBeenCalledWith(
        'testKey',
        'data',
        expect.objectContaining({ tags: ['user', 'profile'] })
      );
    });
  });

  describe('stale-while-revalidate', () => {
    it('should set isStale true and revalidate when staleTime is set and cache hits', async () => {
      const cachedData = 'cached';
      const freshData = 'fresh';

      mockClient.get.mockResolvedValue(cachedData);
      mockClient.set.mockResolvedValue(undefined);

      const fetcher = vi.fn().mockResolvedValue(freshData);

      const { result } = renderHook(
        () => useCache('testKey', fetcher, { staleTime: 60 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Initial data should be cached
      expect(result.current.data).toBe(cachedData);
      expect(result.current.isStale).toBe(true);

      // Wait for revalidation
      await waitFor(() => {
        expect(result.current.data).toBe(freshData);
      });

      expect(result.current.isStale).toBe(false);
      expect(fetcher).toHaveBeenCalled();
    });
  });

  describe('write-through', () => {
    it('should call onWrite callback when writeThrough is enabled', async () => {
      mockClient.get.mockResolvedValue(null);
      mockClient.set.mockResolvedValue(undefined);

      const freshData = { id: 1, name: 'test' };
      const fetcher = vi.fn().mockResolvedValue(freshData);
      const onWrite = vi.fn().mockResolvedValue(undefined);

      renderHook(
        () => useCache('testKey', fetcher, { writeThrough: true, onWrite }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(onWrite).toHaveBeenCalled();
      });

      expect(onWrite).toHaveBeenCalledWith('testKey', freshData);
    });

    it('should not call onWrite when writeThrough is disabled', async () => {
      mockClient.get.mockResolvedValue(null);
      mockClient.set.mockResolvedValue(undefined);

      const fetcher = vi.fn().mockResolvedValue('data');
      const onWrite = vi.fn();

      renderHook(
        () => useCache('testKey', fetcher, { writeThrough: false, onWrite }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockClient.set).toHaveBeenCalled();
      });

      expect(onWrite).not.toHaveBeenCalled();
    });
  });

  describe('enabled option', () => {
    it('should not fetch when enabled is false', async () => {
      const fetcher = vi.fn().mockResolvedValue('data');

      const { result } = renderHook(
        () => useCache('testKey', fetcher, { enabled: false }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockClient.get).not.toHaveBeenCalled();
      expect(fetcher).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should set error state when fetcher throws', async () => {
      mockClient.get.mockResolvedValue(null);

      const error = new Error('Fetch failed');
      const fetcher = vi.fn().mockRejectedValue(error);

      const { result } = renderHook(
        () => useCache('testKey', fetcher),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeNull();
    });

    it('should wrap non-Error throws in Error', async () => {
      mockClient.get.mockResolvedValue(null);

      const fetcher = vi.fn().mockRejectedValue('string error');

      const { result } = renderHook(
        () => useCache('testKey', fetcher),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Cache fetch failed');
    });

    it('should set error state when cache get throws', async () => {
      mockClient.get.mockRejectedValue(new Error('Cache error'));

      const { result } = renderHook(
        () => useCache('testKey', () => Promise.resolve('data')),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe('refetch', () => {
    it('should delete cache and refetch on refetch call', async () => {
      mockClient.get.mockResolvedValue('cached');
      mockClient.delete.mockResolvedValue(undefined);
      mockClient.set.mockResolvedValue(undefined);

      const fetcher = vi.fn().mockResolvedValue('fresh');

      const { result } = renderHook(
        () => useCache('testKey', fetcher),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Reset mock to return null (simulating deleted cache)
      mockClient.get.mockResolvedValue(null);

      await act(async () => {
        await result.current.refetch();
      });

      expect(mockClient.delete).toHaveBeenCalledWith('testKey');
      expect(fetcher).toHaveBeenCalled();
    });

    it('should set isLoading true during refetch', async () => {
      mockClient.get.mockResolvedValue('cached');
      mockClient.delete.mockResolvedValue(undefined);
      mockClient.set.mockResolvedValue(undefined);

      const { result } = renderHook(
        () => useCache('testKey', () => Promise.resolve('data')),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockClient.get.mockResolvedValue(null);

      act(() => {
        result.current.refetch();
      });

      expect(result.current.isLoading).toBe(true);
    });
  });
});

describe('useCacheInvalidation', () => {
  const mockConfig: CacheConfig = {
    redis: { url: 'redis://localhost:6379', maxRetries: 3, connectTimeout: 5000 },
    defaultTTL: 300,
    keyPrefix: 'test:',
    serializer: 'json',
    enableL1Cache: true,
    l1MaxSize: 1000,
  };

  let mockClient: {
    delete: ReturnType<typeof vi.fn>;
    invalidateByTag: ReturnType<typeof vi.fn>;
    invalidateByPattern: ReturnType<typeof vi.fn>;
    flush: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      delete: vi.fn().mockResolvedValue(undefined),
      invalidateByTag: vi.fn().mockResolvedValue(5),
      invalidateByPattern: vi.fn().mockResolvedValue(10),
      flush: vi.fn().mockResolvedValue(undefined),
    };
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <CacheContext.Provider value={{ client: mockClient as unknown as CacheClient, config: mockConfig }}>
        {children}
      </CacheContext.Provider>
    );
  };

  describe('invalidate', () => {
    it('should call client.delete with key', async () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.invalidate('testKey');
      });

      expect(mockClient.delete).toHaveBeenCalledWith('testKey');
    });
  });

  describe('invalidateByTag', () => {
    it('should call client.invalidateByTag and return count', async () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper: createWrapper() });

      let count: number;
      await act(async () => {
        count = await result.current.invalidateByTag('user');
      });

      expect(mockClient.invalidateByTag).toHaveBeenCalledWith('user');
      expect(count!).toBe(5);
    });
  });

  describe('invalidateByPattern', () => {
    it('should call client.invalidateByPattern and return count', async () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper: createWrapper() });

      let count: number;
      await act(async () => {
        count = await result.current.invalidateByPattern('user:*');
      });

      expect(mockClient.invalidateByPattern).toHaveBeenCalledWith('user:*');
      expect(count!).toBe(10);
    });
  });

  describe('flush', () => {
    it('should call client.flush', async () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.flush();
      });

      expect(mockClient.flush).toHaveBeenCalled();
    });
  });
});

describe('useCacheStats', () => {
  const mockConfig: CacheConfig = {
    redis: { url: 'redis://localhost:6379', maxRetries: 3, connectTimeout: 5000 },
    defaultTTL: 300,
    keyPrefix: 'test:',
    serializer: 'json',
    enableL1Cache: true,
    l1MaxSize: 1000,
  };

  let mockClient: {
    getStats: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      getStats: vi.fn(),
    };
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <CacheContext.Provider value={{ client: mockClient as unknown as CacheClient, config: mockConfig }}>
        {children}
      </CacheContext.Provider>
    );
  };

  it('should have null stats initially', () => {
    mockClient.getStats.mockResolvedValue({
      hits: 100,
      misses: 20,
      hitRate: 0.833,
      size: 50,
      memoryUsage: 1024000,
    });

    const { result } = renderHook(() => useCacheStats(), { wrapper: createWrapper() });

    expect(result.current.stats).toBeNull();
  });

  it('should have isLoading true initially', () => {
    mockClient.getStats.mockResolvedValue({} as CacheStats);

    const { result } = renderHook(() => useCacheStats(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
  });

  it('should fetch and return stats', async () => {
    const mockStats: CacheStats = {
      hits: 1000,
      misses: 200,
      hitRate: 0.833,
      size: 500,
      memoryUsage: 10485760,
    };
    mockClient.getStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useCacheStats(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stats).toEqual(mockStats);
  });

  it('should set isLoading false after fetch completes', async () => {
    mockClient.getStats.mockResolvedValue({} as CacheStats);

    const { result } = renderHook(() => useCacheStats(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should refetch stats when refetch is called', async () => {
    const initialStats: CacheStats = {
      hits: 100,
      misses: 20,
      hitRate: 0.833,
      size: 50,
      memoryUsage: 1024000,
    };
    const updatedStats: CacheStats = {
      hits: 200,
      misses: 30,
      hitRate: 0.87,
      size: 60,
      memoryUsage: 2048000,
    };

    mockClient.getStats.mockResolvedValueOnce(initialStats).mockResolvedValueOnce(updatedStats);

    const { result } = renderHook(() => useCacheStats(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.stats).toEqual(initialStats);
    });

    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.stats).toEqual(updatedStats);
    });

    expect(mockClient.getStats).toHaveBeenCalledTimes(2);
  });
});

describe('useCachePrefetch', () => {
  const mockConfig: CacheConfig = {
    redis: { url: 'redis://localhost:6379', maxRetries: 3, connectTimeout: 5000 },
    defaultTTL: 300,
    keyPrefix: 'test:',
    serializer: 'json',
    enableL1Cache: true,
    l1MaxSize: 1000,
  };

  let mockClient: {
    exists: ReturnType<typeof vi.fn>;
    set: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      exists: vi.fn(),
      set: vi.fn().mockResolvedValue(undefined),
    };
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <CacheContext.Provider value={{ client: mockClient as unknown as CacheClient, config: mockConfig }}>
        {children}
      </CacheContext.Provider>
    );
  };

  describe('prefetch', () => {
    it('should fetch and cache data when key does not exist', async () => {
      mockClient.exists.mockResolvedValue(false);

      const data = { id: 1, name: 'test' };
      const fetcher = vi.fn().mockResolvedValue(data);

      const { result } = renderHook(() => useCachePrefetch(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.prefetch('newKey', fetcher);
      });

      expect(mockClient.exists).toHaveBeenCalledWith('newKey');
      expect(fetcher).toHaveBeenCalled();
      expect(mockClient.set).toHaveBeenCalledWith('newKey', data, {});
    });

    it('should not fetch when key already exists', async () => {
      mockClient.exists.mockResolvedValue(true);

      const fetcher = vi.fn().mockResolvedValue('data');

      const { result } = renderHook(() => useCachePrefetch(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.prefetch('existingKey', fetcher);
      });

      expect(mockClient.exists).toHaveBeenCalledWith('existingKey');
      expect(fetcher).not.toHaveBeenCalled();
      expect(mockClient.set).not.toHaveBeenCalled();
    });

    it('should pass options to set call', async () => {
      mockClient.exists.mockResolvedValue(false);

      const fetcher = vi.fn().mockResolvedValue('data');

      const { result } = renderHook(() => useCachePrefetch(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.prefetch('newKey', fetcher, { ttl: 600, tags: ['prefetched'] });
      });

      expect(mockClient.set).toHaveBeenCalledWith('newKey', 'data', { ttl: 600, tags: ['prefetched'] });
    });
  });

  describe('prefetchMany', () => {
    it('should prefetch multiple items in parallel', async () => {
      mockClient.exists.mockResolvedValue(false);

      const fetcher1 = vi.fn().mockResolvedValue('data1');
      const fetcher2 = vi.fn().mockResolvedValue('data2');
      const fetcher3 = vi.fn().mockResolvedValue('data3');

      const { result } = renderHook(() => useCachePrefetch(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.prefetchMany([
          { key: 'key1', fetcher: fetcher1 },
          { key: 'key2', fetcher: fetcher2 },
          { key: 'key3', fetcher: fetcher3 },
        ]);
      });

      expect(fetcher1).toHaveBeenCalled();
      expect(fetcher2).toHaveBeenCalled();
      expect(fetcher3).toHaveBeenCalled();
      expect(mockClient.set).toHaveBeenCalledTimes(3);
    });

    it('should skip existing keys in prefetchMany', async () => {
      mockClient.exists
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      const fetcher1 = vi.fn().mockResolvedValue('data1');
      const fetcher2 = vi.fn().mockResolvedValue('data2');
      const fetcher3 = vi.fn().mockResolvedValue('data3');

      const { result } = renderHook(() => useCachePrefetch(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.prefetchMany([
          { key: 'key1', fetcher: fetcher1 },
          { key: 'key2', fetcher: fetcher2 },
          { key: 'key3', fetcher: fetcher3 },
        ]);
      });

      expect(fetcher1).toHaveBeenCalled();
      expect(fetcher2).not.toHaveBeenCalled(); // Key exists
      expect(fetcher3).toHaveBeenCalled();
      expect(mockClient.set).toHaveBeenCalledTimes(2);
    });
  });
});

describe('useCacheMutation', () => {
  const mockConfig: CacheConfig = {
    redis: { url: 'redis://localhost:6379', maxRetries: 3, connectTimeout: 5000 },
    defaultTTL: 300,
    keyPrefix: 'test:',
    serializer: 'json',
    enableL1Cache: true,
    l1MaxSize: 1000,
  };

  let mockClient: {
    set: ReturnType<typeof vi.fn>;
    invalidateByTag: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      set: vi.fn().mockResolvedValue(undefined),
      invalidateByTag: vi.fn().mockResolvedValue(5),
    };
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <CacheContext.Provider value={{ client: mockClient as unknown as CacheClient, config: mockConfig }}>
        {children}
      </CacheContext.Provider>
    );
  };

  describe('initial state', () => {
    it('should have isLoading false initially', () => {
      const mutationFn = vi.fn().mockResolvedValue('result');

      const { result } = renderHook(
        () => useCacheMutation('testKey', mutationFn),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(false);
    });

    it('should have null error initially', () => {
      const mutationFn = vi.fn().mockResolvedValue('result');

      const { result } = renderHook(
        () => useCacheMutation('testKey', mutationFn),
        { wrapper: createWrapper() }
      );

      expect(result.current.error).toBeNull();
    });
  });

  describe('mutate', () => {
    it('should call mutation function with variables', async () => {
      const mutationFn = vi.fn().mockResolvedValue({ id: 1, name: 'updated' });

      const { result } = renderHook(
        () => useCacheMutation('testKey', mutationFn),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        await result.current.mutate({ name: 'updated' });
      });

      expect(mutationFn).toHaveBeenCalledWith({ name: 'updated' });
    });

    it('should cache the result after successful mutation', async () => {
      const mutationResult = { id: 1, name: 'updated' };
      const mutationFn = vi.fn().mockResolvedValue(mutationResult);

      const { result } = renderHook(
        () => useCacheMutation('testKey', mutationFn),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        await result.current.mutate({ name: 'updated' });
      });

      expect(mockClient.set).toHaveBeenCalledWith('testKey', mutationResult);
    });

    it('should set isLoading true during mutation', async () => {
      let resolvePromise: (value: unknown) => void;
      const mutationFn = vi.fn().mockImplementation(
        () => new Promise((resolve) => { resolvePromise = resolve; })
      );

      const { result } = renderHook(
        () => useCacheMutation('testKey', mutationFn),
        { wrapper: createWrapper() }
      );

      act(() => {
        result.current.mutate({ name: 'test' });
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise!({ id: 1 });
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should call onSuccess callback on successful mutation', async () => {
      const mutationResult = { id: 1, name: 'updated' };
      const mutationFn = vi.fn().mockResolvedValue(mutationResult);
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useCacheMutation('testKey', mutationFn, { onSuccess }),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        await result.current.mutate({ name: 'updated' });
      });

      expect(onSuccess).toHaveBeenCalledWith(mutationResult);
    });

    it('should return the mutation result', async () => {
      const mutationResult = { id: 1, name: 'updated' };
      const mutationFn = vi.fn().mockResolvedValue(mutationResult);

      const { result } = renderHook(
        () => useCacheMutation('testKey', mutationFn),
        { wrapper: createWrapper() }
      );

      let returnedResult: unknown;
      await act(async () => {
        returnedResult = await result.current.mutate({ name: 'updated' });
      });

      expect(returnedResult).toEqual(mutationResult);
    });
  });

  describe('error handling', () => {
    it('should set error state when mutation fails', async () => {
      const error = new Error('Mutation failed');
      const mutationFn = vi.fn().mockRejectedValue(error);

      const { result } = renderHook(
        () => useCacheMutation('testKey', mutationFn),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        try {
          await result.current.mutate({ name: 'test' });
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.error).toEqual(error);
    });

    it('should call onError callback when mutation fails', async () => {
      const error = new Error('Mutation failed');
      const mutationFn = vi.fn().mockRejectedValue(error);
      const onError = vi.fn();

      const { result } = renderHook(
        () => useCacheMutation('testKey', mutationFn, { onError }),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        try {
          await result.current.mutate({ name: 'test' });
        } catch (e) {
          // Expected to throw
        }
      });

      expect(onError).toHaveBeenCalledWith(error);
    });

    it('should wrap non-Error throws in Error', async () => {
      const mutationFn = vi.fn().mockRejectedValue('string error');

      const { result } = renderHook(
        () => useCacheMutation('testKey', mutationFn),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        try {
          await result.current.mutate({ name: 'test' });
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Mutation failed');
    });

    it('should throw the error after handling', async () => {
      const error = new Error('Mutation failed');
      const mutationFn = vi.fn().mockRejectedValue(error);

      const { result } = renderHook(
        () => useCacheMutation('testKey', mutationFn),
        { wrapper: createWrapper() }
      );

      await expect(
        act(async () => {
          await result.current.mutate({ name: 'test' });
        })
      ).rejects.toThrow('Mutation failed');
    });

    it('should reset error on new mutation attempt', async () => {
      const error = new Error('Mutation failed');
      const mutationFn = vi.fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({ id: 1 });

      const { result } = renderHook(
        () => useCacheMutation('testKey', mutationFn),
        { wrapper: createWrapper() }
      );

      // First mutation fails
      await act(async () => {
        try {
          await result.current.mutate({ name: 'test' });
        } catch (e) {
          // Expected
        }
      });

      expect(result.current.error).toBeTruthy();

      // Second mutation succeeds
      await act(async () => {
        await result.current.mutate({ name: 'test2' });
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('tag invalidation', () => {
    it('should invalidate specified tags after successful mutation', async () => {
      const mutationFn = vi.fn().mockResolvedValue({ id: 1 });

      const { result } = renderHook(
        () => useCacheMutation('testKey', mutationFn, { invalidateTags: ['user', 'profile'] }),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        await result.current.mutate({ name: 'test' });
      });

      expect(mockClient.invalidateByTag).toHaveBeenCalledWith('user');
      expect(mockClient.invalidateByTag).toHaveBeenCalledWith('profile');
      expect(mockClient.invalidateByTag).toHaveBeenCalledTimes(2);
    });

    it('should not invalidate tags when mutation fails', async () => {
      const mutationFn = vi.fn().mockRejectedValue(new Error('Failed'));

      const { result } = renderHook(
        () => useCacheMutation('testKey', mutationFn, { invalidateTags: ['user'] }),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        try {
          await result.current.mutate({ name: 'test' });
        } catch (e) {
          // Expected
        }
      });

      expect(mockClient.invalidateByTag).not.toHaveBeenCalled();
    });
  });
});
