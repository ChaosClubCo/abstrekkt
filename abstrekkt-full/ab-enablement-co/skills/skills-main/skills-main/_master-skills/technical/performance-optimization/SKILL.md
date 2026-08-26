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


## References
- `references/4-caching-strategies.md` — 4. Caching Strategies
- `references/references.md` — References
- `references/tools-templates.md` — Tools & Templates
