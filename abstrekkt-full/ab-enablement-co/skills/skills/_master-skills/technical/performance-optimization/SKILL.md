---
name: performance-optimization
description: Application profiling, caching strategies, load testing, and performance optimization techniques. Use when diagnosing performance issues, implementing caching, conducting load tests, or optimizing application response times and resource usage.
---

# Performance Optimization

## Overview

Performance is a feature. Slow applications frustrate users, hurt conversion rates, damage SEO rankings, and waste infrastructure resources. Performance optimization is the systematic process of identifying bottlenecks and implementing solutions that make applications faster and more efficient.

This skill covers the full performance optimization lifecycle: measuring current performance, identifying bottlenecks, implementing optimizations, and validating improvements. It provides frameworks for both frontend and backend optimization, caching strategies, and load testing approaches.

The key principle is to measure before optimizing. Premature optimization wastes time on non-problems while real bottlenecks go unaddressed. This skill emphasizes data-driven optimization where changes are guided by profiling and validated by benchmarks.

### Why This Matters
- 1 second delay in page load decreases conversions by 7%
- Core Web Vitals directly impact Google search rankings
- Efficient resource usage reduces infrastructure costs
- Fast applications enable features that slow ones cannot support

## When to Use

### Primary Triggers
- Diagnosing slow page loads or API response times
- Implementing caching strategies
- Preparing for expected traffic increases
- Conducting load testing before launches
- Optimizing infrastructure costs

### Specific Use Cases
- "Our API endpoint is taking 3 seconds - help me find the bottleneck"
- "Implement Redis caching for our most-read data"
- "Run load tests to validate our Black Friday capacity"
- "Improve our Lighthouse score from 45 to 90"
- "Reduce our AWS costs by optimizing resource usage"

## Core Processes

### 1. Performance Measurement Framework

**Frontend Metrics (Core Web Vitals)**

| Metric | What It Measures | Target | Impact |
|--------|-----------------|--------|--------|
| LCP (Largest Contentful Paint) | Loading performance | < 2.5s | User perceives page as loaded |
| INP (Interaction to Next Paint) | Interactivity | < 200ms | Responsiveness to user input |
| CLS (Cumulative Layout Shift) | Visual stability | < 0.1 | No unexpected layout shifts |
| FCP (First Contentful Paint) | Initial render | < 1.8s | Something appears quickly |
| TTFB (Time to First Byte) | Server response | < 800ms | Server is responsive |

**Backend Metrics**

| Metric | What It Measures | Typical Target |
|--------|-----------------|----------------|
| Response Time (p50) | Median performance | < 100ms |
| Response Time (p99) | Tail latency | < 500ms |
| Throughput | Requests/second | Depends on scale |
| Error Rate | Failed requests | < 0.1% |
| Database Query Time | DB performance | < 50ms avg |

**Measurement Tools Setup**

```typescript
// Performance monitoring middleware
import { Request, Response, NextFunction } from 'express';
import { histogram, counter } from './metrics';

export function performanceMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - start) / 1e6; // ms

    histogram.observe(
      {
        method: req.method,
        route: req.route?.path || 'unknown',
        status: res.statusCode,
      },
      duration
    );

    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });

  next();
}

// Database query timing
export function logQuery(query: string, duration: number) {
  if (duration > 100) {
    console.warn(`Slow query (${duration}ms): ${query.substring(0, 200)}`);
  }

  histogram.observe({ type: 'database' }, duration);
}
```

### 2. Frontend Performance Optimization

**Image Optimization**

```typescript
// Next.js optimized image component
import Image from 'next/image';

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      placeholder="blur"
      blurDataURL={generateBlurDataURL(src)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
      loading="lazy"
    />
  );
}

// For above-fold hero images
export function HeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={600}
      priority // Loads immediately, no lazy loading
      placeholder="blur"
      blurDataURL={generateBlurDataURL(src)}
    />
  );
}
```

**Bundle Optimization**

```typescript
// vite.config.ts - Advanced splitting
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@tanstack')) {
              return 'tanstack-vendor';
            }
            if (id.includes('lodash')) {
              return 'lodash-vendor';
            }
            return 'vendor';
          }

          // Feature chunks
          if (id.includes('/features/admin/')) {
            return 'admin';
          }
          if (id.includes('/features/analytics/')) {
            return 'analytics';
          }
        },
      },
    },
    // Enable source maps for debugging
    sourcemap: true,
    // Target modern browsers
    target: 'es2020',
  },
});
```

**React Performance Patterns**

```typescript
// Avoid unnecessary re-renders
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive components
export const ExpensiveList = memo(function ExpensiveList({
  items,
  onItemClick,
}: Props) {
  return (
    <ul>
      {items.map((item) => (
        <ListItem key={item.id} item={item} onClick={onItemClick} />
      ))}
    </ul>
  );
});

// Memoize expensive calculations
function Dashboard({ data }: { data: DataPoint[] }) {
  const statistics = useMemo(() => {
    return calculateStatistics(data); // Expensive computation
  }, [data]);

  // Stable callback reference
  const handleExport = useCallback(() => {
    exportToCSV(statistics);
  }, [statistics]);

  return <DashboardView stats={statistics} onExport={handleExport} />;
}

// Virtualize long lists
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size,
            }}
          >
            <ItemRow item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Backend Performance Optimization

**Database Query Optimization**

```sql
-- Find slow queries
SELECT
  query,
  calls,
  mean_exec_time,
  total_exec_time,
  rows
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Analyze query execution plan
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT o.*, u.name as user_name
FROM orders o
JOIN users u ON u.id = o.user_id
WHERE o.status = 'pending'
  AND o.created_at > NOW() - INTERVAL '7 days'
ORDER BY o.created_at DESC
LIMIT 20;

-- Before: Sequential scan on orders
-- After: Add composite index
CREATE INDEX idx_orders_status_created
ON orders(status, created_at DESC)
WHERE status = 'pending';
```

**N+1 Query Prevention**

```typescript
// BAD: N+1 queries
async function getOrdersWithProducts(userId: string) {
  const orders = await db.orders.findMany({ where: { userId } });

  // This queries products once per order!
  for (const order of orders) {
    order.products = await db.products.findMany({
      where: { orderId: order.id },
    });
  }

  return orders;
}

// GOOD: Single query with join
async function getOrdersWithProducts(userId: string) {
  return db.orders.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

// GOOD: Batch loading with DataLoader (for GraphQL)
const productLoader = new DataLoader(async (productIds: string[]) => {
  const products = await db.products.findMany({
    where: { id: { in: productIds } },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));
  return productIds.map((id) => productMap.get(id));
});
```

### 4. Caching Strategies

**Multi-Layer Caching Architecture**

```
┌──────────────────────────────────────────────────────────────────┐
│                        Browser Cache                              │
│                   (Static assets, API responses)                  │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│                          CDN Cache                                │
│                   (CloudFront, Cloudflare)                        │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│                      Application Cache                            │
│                        (Redis, in-memory)                         │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│                       Database Cache                              │
│                    (Query cache, buffer pool)                     │
└──────────────────────────────────────────────────────────────────┘
```

**Redis Caching Implementation**

```typescript
// cache.service.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

interface CacheOptions {
  ttl?: number; // seconds
  staleWhileRevalidate?: number;
}

export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = 300, staleWhileRevalidate = 60 } = options;

  // Try to get from cache
  const cached = await redis.get(key);
  if (cached) {
    const { data, expiresAt } = JSON.parse(cached);

    // If not expired, return immediately
    if (Date.now() < expiresAt) {
      return data;
    }

    // If within stale window, return stale and revalidate in background
    if (Date.now() < expiresAt + staleWhileRevalidate * 1000) {
      // Fire and forget revalidation
      revalidate(key, fetcher, ttl);
      return data;
    }
  }

  // Cache miss or expired beyond stale window
  return revalidate(key, fetcher, ttl);
}

async function revalidate<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T> {
  const data = await fetcher();
  const cacheValue = JSON.stringify({
    data,
    expiresAt: Date.now() + ttl * 1000,
  });
  await redis.setex(key, ttl + 60, cacheValue); // Store slightly longer for SWR
  return data;
}

// Usage
async function getProduct(id: string) {
  return cached(
    `product:${id}`,
    () => db.products.findUnique({ where: { id } }),
    { ttl: 300, staleWhileRevalidate: 60 }
  );
}

// Cache invalidation
export async function invalidateProduct(id: string) {
  await redis.del(`product:${id}`);
  await redis.del('products:list'); // Invalidate list cache too
}
```

### 5. Load Testing

**k6 Load Test Script**

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const orderDuration = new Trend('order_duration');

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    errors: ['rate<0.01'],             // Error rate under 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://api.example.com';

export function setup() {
  // Login to get auth token
  const loginRes = http.post(`${BASE_URL}/auth/login`, {
    email: 'loadtest@example.com',
    password: 'loadtest123',
  });
  return { token: loginRes.json('token') };
}

export default function (data) {
  const headers = {
    'Authorization': `Bearer ${data.token}`,
    'Content-Type': 'application/json',
  };

  // Browse products
  const productsRes = http.get(`${BASE_URL}/products?limit=20`, { headers });
  check(productsRes, {
    'products status is 200': (r) => r.status === 200,
    'products returned': (r) => r.json('data').length > 0,
  });

  sleep(1);

  // View product detail
  const products = productsRes.json('data');
  if (products.length > 0) {
    const productId = products[Math.floor(Math.random() * products.length)].id;
    const productRes = http.get(`${BASE_URL}/products/${productId}`, { headers });
    check(productRes, {
      'product status is 200': (r) => r.status === 200,
    });
  }

  sleep(2);

  // Create order (10% of users)
  if (Math.random() < 0.1) {
    const start = Date.now();
    const orderRes = http.post(
      `${BASE_URL}/orders`,
      JSON.stringify({
        items: [{ productId: products[0].id, quantity: 1 }],
      }),
      { headers }
    );

    const duration = Date.now() - start;
    orderDuration.add(duration);

    const success = check(orderRes, {
      'order created': (r) => r.status === 201,
    });

    errorRate.add(!success);
  }

  sleep(1);
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
```

## Tools & Templates

### Recommended Tools

| Tool | Best For | Price Range | Key Features |
|------|----------|-------------|--------------|
| Lighthouse | Frontend audit | Free | Core Web Vitals, suggestions |
| k6 | Load testing | Free/Cloud | Scripted tests, CI integration |
| Datadog APM | Production monitoring | $$$$ | Distributed tracing, profiling |
| New Relic | Full-stack monitoring | $$$ | APM, infrastructure, logs |
| Redis | Application caching | Free/Managed | Fast, versatile caching |
| WebPageTest | Frontend testing | Free | Real devices, filmstrip view |

## Metrics & KPIs

### Performance SLOs
- **API Latency**: p50 < 100ms, p99 < 500ms
- **Page Load (LCP)**: < 2.5s for 75th percentile
- **Availability**: 99.9% uptime
- **Error Rate**: < 0.1% of requests

### Cost Efficiency Metrics
- **Cost per Request**: Track infrastructure cost / requests
- **Cache Hit Rate**: Target > 90% for cacheable content
- **Database Query Efficiency**: Queries per request < 5

## Common Pitfalls

### 1. Premature Optimization
**Problem**: Optimizing code that isn't actually a bottleneck
**Prevention**: Always measure first. Profile in production-like conditions. Focus on the biggest bottlenecks.

### 2. Cache Invalidation Bugs
**Problem**: Stale data served due to improper cache invalidation
**Prevention**: Use cache-aside pattern. Implement proper invalidation. Set appropriate TTLs. Monitor cache hit rates.

### 3. Over-Caching
**Problem**: Caching too aggressively, serving stale data
**Prevention**: Understand data freshness requirements. Use appropriate TTLs. Implement cache invalidation on writes.

### 4. Load Testing in Isolation
**Problem**: Load tests don't reflect real production behavior
**Prevention**: Use realistic scenarios. Test with production-like data. Include all dependencies. Test failure modes.

## Integration Points

- **Database Design**: Indexing and query optimization
- **Cloud Architecture**: Infrastructure scaling and CDN configuration
- **DevOps Practices**: Performance testing in CI/CD
- **API Development**: API design impacts performance
- **Web Development**: Frontend performance optimization
- **Testing Strategies**: Performance regression testing
