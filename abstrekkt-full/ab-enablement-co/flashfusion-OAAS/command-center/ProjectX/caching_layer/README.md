# Caching Layer Module

Redis-based caching system for optimizing application performance.

## Features

- **Redis Integration**: Full Redis client support with connection pooling
- **Cache Strategies**: LRU, TTL-based, and write-through caching
- **Pattern Support**: Cache invalidation patterns and wildcards
- **Multi-Level Cache**: L1 (memory) + L2 (Redis) caching layers
- **Cache Tags**: Group and invalidate related cache entries
- **Metrics**: Hit/miss ratios and performance monitoring
- **Serialization**: JSON and MessagePack support

## Installation

```bash
npm install @projectx/caching-layer
```

## Usage

```typescript
import { useCache, CacheProvider, useCacheInvalidation } from '@projectx/caching-layer';

// Wrap your app
function App() {
  return (
    <CacheProvider config={{ redis: { url: process.env.REDIS_URL } }}>
      <YourApp />
    </CacheProvider>
  );
}

// Use in components
function UserProfile({ userId }) {
  const { data, isLoading } = useCache(
    `user:${userId}`,
    () => fetchUser(userId),
    { ttl: 300, tags: ['users'] }
  );

  return <div>{data?.name}</div>;
}

// Invalidate cache
function UpdateUser() {
  const { invalidate, invalidateByTag } = useCacheInvalidation();

  const handleUpdate = async () => {
    await updateUser(userId, data);
    invalidate(`user:${userId}`);
    // Or invalidate all users: invalidateByTag('users');
  };
}
```

## Cache Strategies

### TTL-Based
```typescript
cache.set('key', value, { ttl: 3600 }); // 1 hour
```

### Write-Through
```typescript
const { data } = useCache('key', fetcher, {
  writeThrough: true,
  onWrite: (key, value) => persistToDb(value)
});
```

### Stale-While-Revalidate
```typescript
const { data } = useCache('key', fetcher, {
  staleTime: 60,
  revalidateOnFocus: true
});
```

## Configuration

```typescript
const cacheConfig: CacheConfig = {
  redis: {
    url: 'redis://localhost:6379',
    maxRetries: 3,
    connectTimeout: 5000,
  },
  defaultTTL: 300,
  keyPrefix: 'app:',
  serializer: 'json', // or 'msgpack'
  enableL1Cache: true,
  l1MaxSize: 1000,
};
```

## API Reference

### CacheProvider Props
| Prop | Type | Description |
|------|------|-------------|
| config | CacheConfig | Redis and cache configuration |
| fallback | ReactNode | Loading fallback component |

### useCache Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| ttl | number | 300 | Time-to-live in seconds |
| tags | string[] | [] | Cache tags for grouped invalidation |
| staleTime | number | 0 | Time data considered fresh |
| enabled | boolean | true | Enable/disable caching |
