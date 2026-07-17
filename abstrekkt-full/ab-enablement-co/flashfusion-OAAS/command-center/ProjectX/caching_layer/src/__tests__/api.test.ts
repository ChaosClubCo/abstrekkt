import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CacheClient, getCacheClient } from '../api';
import type { CacheConfig } from '../types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('CacheClient', () => {
  const defaultConfig: CacheConfig = {
    redis: {
      url: 'redis://localhost:6379',
      maxRetries: 3,
      connectTimeout: 5000,
    },
    defaultTTL: 300,
    keyPrefix: 'test:',
    serializer: 'json',
    enableL1Cache: true,
    l1MaxSize: 1000,
  };

  let client: CacheClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new CacheClient(defaultConfig);
  });

  describe('constructor', () => {
    it('should create a client with the provided config', () => {
      const customConfig: CacheConfig = {
        ...defaultConfig,
        keyPrefix: 'custom:',
        defaultTTL: 600,
      };
      const customClient = new CacheClient(customConfig);
      expect(customClient).toBeInstanceOf(CacheClient);
    });

    it('should use json serializer by default', () => {
      const jsonClient = new CacheClient({ ...defaultConfig, serializer: 'json' });
      expect(jsonClient).toBeInstanceOf(CacheClient);
    });

    it('should handle msgpack serializer type (falls back to json)', () => {
      const msgpackClient = new CacheClient({ ...defaultConfig, serializer: 'msgpack' });
      expect(msgpackClient).toBeInstanceOf(CacheClient);
    });
  });

  describe('get', () => {
    it('should fetch value from cache API with prefixed key', async () => {
      const mockData = { name: 'test', value: 123 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: JSON.stringify(mockData) }),
      });

      const result = await client.get<typeof mockData>('myKey');

      expect(mockFetch).toHaveBeenCalledWith('/api/cache/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'test:myKey' }),
      });
      expect(result).toEqual(mockData);
    });

    it('should return null when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      const result = await client.get('nonexistent');

      expect(result).toBeNull();
    });

    it('should return null when data is null', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: null }),
      });

      const result = await client.get('emptyKey');

      expect(result).toBeNull();
    });

    it('should deserialize complex nested objects', async () => {
      const complexData = {
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
        metadata: { total: 2, page: 1 },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: JSON.stringify(complexData) }),
      });

      const result = await client.get('complexKey');

      expect(result).toEqual(complexData);
    });

    it('should handle arrays as values', async () => {
      const arrayData = [1, 2, 3, 'test', { nested: true }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: JSON.stringify(arrayData) }),
      });

      const result = await client.get('arrayKey');

      expect(result).toEqual(arrayData);
    });

    it('should handle primitive values', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: JSON.stringify('simple string') }),
      });

      const result = await client.get<string>('stringKey');

      expect(result).toBe('simple string');
    });

    it('should handle numeric values', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: JSON.stringify(42) }),
      });

      const result = await client.get<number>('numberKey');

      expect(result).toBe(42);
    });

    it('should handle boolean values', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: JSON.stringify(true) }),
      });

      const result = await client.get<boolean>('boolKey');

      expect(result).toBe(true);
    });
  });

  describe('set', () => {
    it('should send set request with serialized value', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      const data = { name: 'test', value: 123 };
      await client.set('myKey', data);

      expect(mockFetch).toHaveBeenCalledWith('/api/cache/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(String),
      });

      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.key).toBe('test:myKey');
      expect(requestBody.value).toBe(JSON.stringify(data));
      expect(requestBody.ttl).toBe(300); // defaultTTL
      expect(requestBody.tags).toEqual([]);
    });

    it('should use custom TTL when provided', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await client.set('myKey', 'value', { ttl: 600 });

      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.ttl).toBe(600);
    });

    it('should include tags when provided', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await client.set('myKey', 'value', { tags: ['user', 'profile'] });

      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.tags).toEqual(['user', 'profile']);
    });

    it('should set TTL and tags together', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await client.set('myKey', 'value', { ttl: 1200, tags: ['important'] });

      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.ttl).toBe(1200);
      expect(requestBody.tags).toEqual(['important']);
    });

    it('should handle null values', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await client.set('nullKey', null);

      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.value).toBe('null');
    });

    it('should handle undefined as value (serializes to undefined)', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await client.set('undefinedKey', undefined);

      // JSON.stringify(undefined) returns undefined, not a string
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should send delete request with prefixed key', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await client.delete('myKey');

      expect(mockFetch).toHaveBeenCalledWith('/api/cache/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'test:myKey' }),
      });
    });
  });

  describe('invalidateByTag', () => {
    it('should invalidate entries by tag and return count', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ count: 5 }),
      });

      const count = await client.invalidateByTag('user');

      expect(mockFetch).toHaveBeenCalledWith('/api/cache/invalidate/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: 'user' }),
      });
      expect(count).toBe(5);
    });

    it('should return 0 when no entries match the tag', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ count: 0 }),
      });

      const count = await client.invalidateByTag('nonexistent');

      expect(count).toBe(0);
    });
  });

  describe('invalidateByPattern', () => {
    it('should invalidate entries by pattern with prefixed pattern', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ count: 10 }),
      });

      const count = await client.invalidateByPattern('user:*');

      expect(mockFetch).toHaveBeenCalledWith('/api/cache/invalidate/pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pattern: 'test:user:*' }),
      });
      expect(count).toBe(10);
    });
  });

  describe('getStats', () => {
    it('should fetch and return cache statistics', async () => {
      const mockStats = {
        hits: 1000,
        misses: 200,
        hitRate: 0.833,
        size: 500,
        memoryUsage: 10485760,
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStats),
      });

      const stats = await client.getStats();

      expect(mockFetch).toHaveBeenCalledWith('/api/cache/stats');
      expect(stats).toEqual(mockStats);
    });
  });

  describe('flush', () => {
    it('should send flush request', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await client.flush();

      expect(mockFetch).toHaveBeenCalledWith('/api/cache/flush', { method: 'POST' });
    });
  });

  describe('keys', () => {
    it('should fetch keys matching pattern with prefixed pattern', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ keys: ['test:user:1', 'test:user:2'] }),
      });

      const keys = await client.keys('user:*');

      expect(mockFetch).toHaveBeenCalledWith('/api/cache/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pattern: 'test:user:*' }),
      });
      // Keys should have prefix removed
      expect(keys).toEqual(['user:1', 'user:2']);
    });

    it('should use wildcard pattern by default', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ keys: [] }),
      });

      await client.keys();

      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.pattern).toBe('test:*');
    });

    it('should return empty array when no keys found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ keys: [] }),
      });

      const keys = await client.keys('nonexistent:*');

      expect(keys).toEqual([]);
    });
  });

  describe('exists', () => {
    it('should return true when key exists', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ exists: true }),
      });

      const exists = await client.exists('myKey');

      expect(mockFetch).toHaveBeenCalledWith('/api/cache/exists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'test:myKey' }),
      });
      expect(exists).toBe(true);
    });

    it('should return false when key does not exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ exists: false }),
      });

      const exists = await client.exists('nonexistent');

      expect(exists).toBe(false);
    });
  });

  describe('ttl', () => {
    it('should return TTL for a key', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ttl: 250 }),
      });

      const ttl = await client.ttl('myKey');

      expect(mockFetch).toHaveBeenCalledWith('/api/cache/ttl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'test:myKey' }),
      });
      expect(ttl).toBe(250);
    });

    it('should return -1 for non-existent key', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ttl: -1 }),
      });

      const ttl = await client.ttl('nonexistent');

      expect(ttl).toBe(-1);
    });

    it('should return -2 for key with no expiration', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ttl: -2 }),
      });

      const ttl = await client.ttl('persistentKey');

      expect(ttl).toBe(-2);
    });
  });

  describe('extend', () => {
    it('should extend TTL for a key', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await client.extend('myKey', 600);

      expect(mockFetch).toHaveBeenCalledWith('/api/cache/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'test:myKey', ttl: 600 }),
      });
    });
  });

  describe('key prefixing', () => {
    it('should correctly prefix keys with different prefixes', async () => {
      const customClient = new CacheClient({
        ...defaultConfig,
        keyPrefix: 'app:v2:',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: JSON.stringify('value') }),
      });

      await customClient.get('myKey');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/cache/get',
        expect.objectContaining({
          body: JSON.stringify({ key: 'app:v2:myKey' }),
        })
      );
    });

    it('should handle empty prefix', async () => {
      const noPrefixClient = new CacheClient({
        ...defaultConfig,
        keyPrefix: '',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: JSON.stringify('value') }),
      });

      await noPrefixClient.get('myKey');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/cache/get',
        expect.objectContaining({
          body: JSON.stringify({ key: 'myKey' }),
        })
      );
    });
  });
});

describe('getCacheClient', () => {
  beforeEach(() => {
    // Reset the singleton by accessing the module fresh
    vi.resetModules();
  });

  it('should throw error when called without config and not initialized', async () => {
    // Re-import to get fresh module state
    const { getCacheClient: freshGetCacheClient } = await import('../api');

    expect(() => freshGetCacheClient()).toThrow('CacheClient not initialized');
  });

  it('should create and return client when config is provided', async () => {
    const { getCacheClient: freshGetCacheClient } = await import('../api');

    const config: CacheConfig = {
      redis: {
        url: 'redis://localhost:6379',
        maxRetries: 3,
        connectTimeout: 5000,
      },
      defaultTTL: 300,
      keyPrefix: 'test:',
      serializer: 'json',
      enableL1Cache: true,
      l1MaxSize: 1000,
    };

    const client = freshGetCacheClient(config);

    expect(client).toBeInstanceOf(CacheClient);
  });

  it('should return same instance on subsequent calls', async () => {
    const { getCacheClient: freshGetCacheClient } = await import('../api');

    const config: CacheConfig = {
      redis: {
        url: 'redis://localhost:6379',
        maxRetries: 3,
        connectTimeout: 5000,
      },
      defaultTTL: 300,
      keyPrefix: 'test:',
      serializer: 'json',
      enableL1Cache: true,
      l1MaxSize: 1000,
    };

    const client1 = freshGetCacheClient(config);
    const client2 = freshGetCacheClient();

    expect(client1).toBe(client2);
  });
});
