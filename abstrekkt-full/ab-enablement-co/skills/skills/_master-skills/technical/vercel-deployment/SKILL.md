---
name: vercel-deployment
description: Comprehensive Vercel deployment expertise covering Next.js applications, edge functions, serverless configuration, preview deployments, analytics, and production optimization strategies. Use when building, debugging, or optimizing technical implementations.
---

# Vercel Deployment

## Overview

Vercel deployment provides seamless hosting for Next.js and other modern web applications with built-in CI/CD, edge functions, and global CDN distribution. This skill covers the complete deployment lifecycle from initial project setup through production optimization and monitoring.

Effective Vercel deployment goes beyond simple git-push deployments. It encompasses understanding the platform's unique capabilities including edge middleware, incremental static regeneration, image optimization, and serverless function configuration. Proper configuration dramatically impacts application performance, cost efficiency, and developer experience.

This skill provides patterns for production-grade deployments, including environment management across preview/staging/production, custom domain configuration, team collaboration workflows, and integration with monitoring and analytics tools.

### Why This Matters

- **Zero-config deployment**: Next.js applications deploy with optimal defaults out of the box
- **Preview deployments**: Every PR gets a unique preview URL for testing and stakeholder review
- **Edge performance**: Global edge network delivers content from the nearest location to users
- **Serverless scaling**: Automatic scaling handles traffic spikes without infrastructure management
- **Developer velocity**: Fast feedback loops with instant deployments and preview URLs

## When to Use

### Primary Triggers

- "Deploy our Next.js application"
- "Set up Vercel for our project"
- "Configure preview deployments"
- "Optimize our Vercel deployment"
- "Set up edge functions"
- "Configure custom domains"
- "Debug deployment issues"

### Specific Use Cases

1. **Initial Setup**: Connecting repository and configuring project settings
2. **Environment Configuration**: Managing secrets and variables across environments
3. **Edge Functions**: Deploying middleware and edge-optimized API routes
4. **Performance Optimization**: Configuring caching, ISR, and image optimization
5. **Custom Domains**: Setting up domains, SSL, and redirects
6. **Monorepo Deployment**: Configuring builds for monorepo structures

## Core Processes

### Process 1: Project Setup and Configuration

**Objective**: Configure a Next.js project for optimal Vercel deployment.

**vercel.json Configuration**:

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "outputDirectory": ".next",
  "regions": ["iad1", "sfo1", "cdg1"],
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 30
    },
    "app/api/heavy-computation/route.ts": {
      "memory": 3008,
      "maxDuration": 60
    }
  },
  "crons": [
    {
      "path": "/api/cron/daily-cleanup",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/hourly-sync",
      "schedule": "0 * * * *"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/blog/:path*",
      "destination": "https://blog.example.com/:path*"
    }
  ],
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}
```

**Next.js Configuration for Vercel**:

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental features
  experimental: {
    ppr: true, // Partial Prerendering
    reactCompiler: true,
  },

  // Logging for debugging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Headers (can also be in vercel.json)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },

  // Environment variable validation
  env: {
    NEXT_PUBLIC_APP_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000',
  },
};

export default nextConfig;
```

### Process 2: Environment Variable Management

**Objective**: Properly configure environment variables across deployment contexts.

**Environment Strategy**:

```bash
# Vercel CLI environment management
# Pull current environment variables
vercel env pull .env.local

# Add environment variables
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_SECRET_KEY preview
vercel env add DATABASE_URL production

# Link variables across environments
vercel env add NEXT_PUBLIC_API_URL production --value="https://api.example.com"
vercel env add NEXT_PUBLIC_API_URL preview --value="https://api-staging.example.com"
vercel env add NEXT_PUBLIC_API_URL development --value="http://localhost:3001"
```

**Environment Variable Pattern**:

```typescript
// lib/env.ts - Validated environment configuration
import { z } from 'zod';

const envSchema = z.object({
  // Server-only variables
  DATABASE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  OPENAI_API_KEY: z.string().startsWith('sk-'),

  // Public variables (available in browser)
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),

  // Vercel system variables
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),
});

export const env = envSchema.parse(process.env);

// Type-safe environment access
export function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}
```

### Process 3: Edge Functions and Middleware

**Objective**: Deploy performant edge-optimized code.

**Edge Middleware**:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Geolocation-based routing
  const country = request.geo?.country || 'US';
  const response = NextResponse.next();

  // Add geolocation headers for downstream use
  response.headers.set('x-user-country', country);
  response.headers.set('x-user-city', request.geo?.city || 'Unknown');

  // A/B testing via edge
  if (pathname === '/pricing') {
    const bucket = Math.random() < 0.5 ? 'control' : 'variant';
    response.cookies.set('ab-pricing', bucket, { maxAge: 60 * 60 * 24 * 7 });
    response.headers.set('x-ab-bucket', bucket);
  }

  // Bot detection
  const userAgent = request.headers.get('user-agent') || '';
  if (isBot(userAgent)) {
    response.headers.set('x-is-bot', 'true');
  }

  // Rate limiting check (integrate with edge KV)
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  response.headers.set('x-client-ip', ip);

  return response;
}

function isBot(userAgent: string): boolean {
  const bots = ['googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider'];
  return bots.some(bot => userAgent.toLowerCase().includes(bot));
}
```

**Edge API Route**:

```typescript
// app/api/edge/route.ts
import { NextRequest } from 'next/server';

export const runtime = 'edge';
export const preferredRegion = ['iad1', 'sfo1', 'cdg1', 'hnd1'];

export async function GET(request: NextRequest) {
  const country = request.geo?.country;

  // Edge-compatible operations
  const data = await fetch('https://api.example.com/data', {
    headers: {
      'X-Country': country || 'US',
    },
    next: {
      revalidate: 60, // Cache for 60 seconds at edge
    },
  });

  return Response.json(await data.json(), {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
```

### Process 4: Caching and Performance Optimization

**Objective**: Configure optimal caching strategies for performance.

**ISR and Caching Patterns**:

```typescript
// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';

// Static params for pre-rendering popular products
export async function generateStaticParams() {
  const popularProducts = await getPopularProducts(100);
  return popularProducts.map(p => ({ id: p.id }));
}

// Revalidation configuration
export const revalidate = 3600; // Revalidate every hour

// Or use on-demand revalidation
export const dynamic = 'force-static';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDisplay product={product} />;
}
```

**On-Demand Revalidation API**:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { secret, path, tag } = await request.json();

  // Validate revalidation secret
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  try {
    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path });
    }

    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({ revalidated: true, tag });
    }

    return NextResponse.json({ error: 'Missing path or tag' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
```

**Cache Configuration in Fetch**:

```typescript
// Data fetching with cache configuration
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: {
      revalidate: 3600, // Cache for 1 hour
      tags: ['products'], // Tag for on-demand revalidation
    },
  });
  return res.json();
}

async function getUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`, {
    cache: 'no-store', // Always fetch fresh
  });
  return res.json();
}
```

### Process 5: Monorepo and Build Configuration

**Objective**: Configure Vercel for monorepo deployments.

**Turborepo Configuration**:

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**Vercel Project Settings for Monorepo**:

```json
// apps/web/vercel.json
{
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=web",
  "outputDirectory": ".next",
  "ignoreCommand": "npx turbo-ignore"
}
```

**Root Package Configuration**:

```json
// package.json (root)
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

## Tools & Templates

| Tool | Purpose | When to Use |
|------|---------|-------------|
| Vercel CLI | Local development, deployment | All workflows |
| Vercel Dashboard | Configuration, monitoring | UI-based management |
| Speed Insights | Performance monitoring | Production optimization |
| Web Analytics | User analytics | Traffic analysis |
| Vercel AI SDK | AI integration | LLM features |

### Deployment Commands

```bash
# Development
vercel dev                    # Run local development server
vercel env pull              # Sync environment variables

# Deployment
vercel                       # Deploy to preview
vercel --prod               # Deploy to production
vercel deploy --prebuilt    # Deploy pre-built output

# Project management
vercel link                  # Link local project
vercel project ls           # List projects
vercel domains ls           # List domains
vercel logs                 # View deployment logs
```

### GitHub Actions Integration

```yaml
# .github/workflows/preview.yml
name: Vercel Preview Deployment
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          github-comment: true
```

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Build Time | < 2 minutes | Vercel dashboard |
| Cold Start | < 250ms | Function logs |
| TTFB | < 200ms | Speed Insights |
| LCP | < 2.5s | Web Vitals |
| Cache Hit Rate | > 90% | Analytics |

## Common Pitfalls

1. **Function Size Limits**: Keep serverless functions under 50MB; use tree-shaking.
2. **Cold Starts**: Use edge functions for latency-sensitive endpoints.
3. **Environment Mismatch**: Ensure preview/production env vars are properly scoped.
4. **Build Cache**: Clear build cache when dependencies change unexpectedly.
5. **Region Selection**: Deploy functions to regions near your data sources.

## Integration Points

- **GitHub/GitLab**: Automatic deployments on push
- **Sentry**: Error tracking integration
- **Analytics**: Vercel Analytics or third-party
- **CDN**: Automatic edge caching
- **Database**: Vercel Postgres, Neon, PlanetScale integrations
