---
name: web-development
description: Frontend and backend web development workflows including tech stack selection, architecture patterns, build tooling, and modern web development best practices. Use when building new web applications, selecting frameworks, implementing features, or optimizing existing web codebases.
---

# Web Development

## Overview

Web development encompasses the full spectrum of building applications for the browser, from static marketing sites to complex single-page applications and server-rendered platforms. This skill provides structured approaches to technology selection, architecture decisions, and implementation patterns that scale from prototype to production.

Modern web development requires balancing multiple concerns: developer experience, performance, accessibility, SEO, and maintainability. The landscape evolves rapidly, but fundamental principles remain constant. This skill helps navigate technology choices while maintaining focus on delivering value to users.

Whether building a new application from scratch or inheriting an existing codebase, this skill provides frameworks for making informed decisions about architecture, tooling, and implementation approaches that align with project requirements and team capabilities.

### Why This Matters
- Technology choices made early in a project compound over time, affecting development velocity for years
- Poor architecture decisions create technical debt that slows feature delivery and increases bug rates
- Strategic framework selection reduces development time by 40-60% compared to building from scratch
- Consistent development patterns improve team onboarding and code maintainability

## When to Use

### Primary Triggers
- Starting a new web application project
- Evaluating or selecting frontend/backend frameworks
- Implementing complex UI components or state management
- Optimizing build pipelines and developer experience
- Migrating between frameworks or major version upgrades

### Specific Use Cases
- "Help me choose between Next.js, Remix, and Nuxt for my e-commerce site"
- "Set up a React project with TypeScript, testing, and proper folder structure"
- "Review my component architecture and suggest improvements"
- "Implement a design system with reusable components"
- "Optimize my webpack/vite configuration for faster builds"

## Core Processes

### 1. Technology Stack Selection

Selecting the right technology stack requires evaluating multiple dimensions against project requirements.

**Selection Matrix**

| Factor | Weight | Questions to Answer |
|--------|--------|---------------------|
| Team Expertise | High | What does the team already know? Learning curve cost? |
| Project Requirements | High | SSR needed? Real-time features? Offline support? |
| Performance Needs | Medium | Core Web Vitals targets? Bundle size constraints? |
| Ecosystem | Medium | Available libraries? Community support? Long-term viability? |
| Hiring Pool | Low-Medium | Can we find developers with this skill? |

**Framework Decision Tree**

```
Need SEO/SSR?
├── Yes → Need React ecosystem?
│   ├── Yes → Next.js or Remix
│   └── No → Nuxt (Vue) or SvelteKit
└── No → Need complex state?
    ├── Yes → React + state management
    └── No → Vue, Svelte, or vanilla JS
```

**Recommended Stacks by Project Type**

| Project Type | Frontend | Backend | Database | Hosting |
|--------------|----------|---------|----------|---------|
| Marketing Site | Next.js/Astro | Headless CMS | - | Vercel/Netlify |
| SaaS App | Next.js/React | Node.js/tRPC | PostgreSQL | Vercel + Supabase |
| E-commerce | Next.js/Remix | Node.js | PostgreSQL | Vercel + Stripe |
| Real-time App | React | Node.js + WebSocket | Redis + PostgreSQL | Railway/Render |
| Internal Tool | React Admin | Node.js/Python | PostgreSQL | Self-hosted |

### 2. Project Structure and Architecture

**Standard React/Next.js Project Structure**

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Route groups
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Base UI components (Button, Input, etc.)
│   ├── forms/             # Form-specific components
│   ├── layout/            # Layout components (Header, Footer, etc.)
│   └── features/          # Feature-specific components
├── lib/
│   ├── api/               # API client functions
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── validations/       # Zod schemas
├── types/                 # TypeScript type definitions
├── styles/                # Global styles
└── config/                # App configuration
```

**Component Organization Patterns**

```typescript
// components/features/user-profile/index.ts
export { UserProfile } from './user-profile';
export { UserProfileSkeleton } from './user-profile-skeleton';
export { useUserProfile } from './use-user-profile';
export type { UserProfileProps } from './types';

// components/features/user-profile/user-profile.tsx
import { useUserProfile } from './use-user-profile';
import { UserAvatar } from './user-avatar';
import { UserStats } from './user-stats';
import type { UserProfileProps } from './types';

export function UserProfile({ userId }: UserProfileProps) {
  const { user, isLoading, error } = useUserProfile(userId);

  if (isLoading) return <UserProfileSkeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="user-profile">
      <UserAvatar user={user} />
      <UserStats stats={user.stats} />
    </div>
  );
}
```

### 3. State Management Strategy

**State Categories and Solutions**

| State Type | Examples | Recommended Solution |
|------------|----------|---------------------|
| Server State | API data, cached responses | TanStack Query, SWR |
| UI State | Modals, dropdowns, tabs | useState, useReducer |
| Form State | Input values, validation | React Hook Form, Formik |
| Global UI | Theme, sidebar open | Zustand, Jotai |
| URL State | Filters, pagination | nuqs, next/navigation |

**TanStack Query Setup**

```typescript
// lib/api/queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => api.users.get(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.users.update,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(userKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
```

### 4. Build and Development Tooling

**Vite Configuration for Production**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: 'dist/stats.html' }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
    sourcemap: true,
    target: 'es2020',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

**ESLint Configuration**

```javascript
// .eslintrc.cjs
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
```

### 5. Performance Optimization Patterns

**Code Splitting Strategy**

```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/dashboard'));
const Settings = lazy(() => import('./pages/settings'));

// Lazy load heavy components
const ChartComponent = lazy(() =>
  import('./components/chart').then(mod => ({ default: mod.Chart }))
);

// Preload on hover
function NavLink({ to, children }) {
  const preload = () => {
    if (to === '/dashboard') import('./pages/dashboard');
  };

  return (
    <Link to={to} onMouseEnter={preload}>
      {children}
    </Link>
  );
}
```

**Image Optimization Checklist**

- [ ] Use next/image or similar for automatic optimization
- [ ] Implement responsive images with srcset
- [ ] Use WebP/AVIF with fallbacks
- [ ] Lazy load below-fold images
- [ ] Set explicit width/height to prevent layout shift
- [ ] Use blur placeholder for LCP images

## Tools & Templates

### Recommended Tools

| Tool | Best For | Price Range | Key Features |
|------|----------|-------------|--------------|
| Next.js | Full-stack React apps | Free | SSR, API routes, edge functions |
| Vite | Fast development builds | Free | Hot reload, ES modules, plugins |
| TanStack Query | Server state | Free | Caching, background refetch |
| Tailwind CSS | Utility-first styling | Free | JIT, design tokens, responsive |
| Storybook | Component development | Free | Isolation, documentation, testing |
| Playwright | E2E testing | Free | Cross-browser, auto-wait, tracing |

### Project Templates

**package.json Scripts**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "prepare": "husky install"
  }
}
```

## Metrics & KPIs

### Performance Metrics
- **Largest Contentful Paint (LCP)**: Target < 2.5s
- **First Input Delay (FID)**: Target < 100ms
- **Cumulative Layout Shift (CLS)**: Target < 0.1
- **Time to Interactive (TTI)**: Target < 3.5s
- **Bundle Size**: Monitor and set budgets per route

### Development Metrics
- **Build Time**: Track CI build duration
- **Test Coverage**: Maintain > 80% for critical paths
- **Type Coverage**: Target 100% TypeScript strict mode
- **Lighthouse Score**: Maintain > 90 for all categories

## Common Pitfalls

### 1. Premature Optimization
**Problem**: Over-engineering initial architecture with patterns that won't be needed
**Prevention**: Start simple, measure, then optimize. Use the rule of three - refactor after the third occurrence of a pattern.

### 2. Framework Lock-in
**Problem**: Tightly coupling business logic to framework-specific APIs
**Prevention**: Keep business logic in plain TypeScript. Use adapters for framework integration. Maintain clear boundaries between UI and domain logic.

### 3. Ignoring Accessibility
**Problem**: Building inaccessible interfaces that exclude users and create legal liability
**Prevention**: Use semantic HTML, test with screen readers, implement keyboard navigation from the start. Use tools like axe-core in CI.

### 4. Bundle Size Explosion
**Problem**: Importing entire libraries when only small parts are needed
**Prevention**: Use bundle analyzers regularly. Prefer tree-shakable imports. Set bundle budgets in CI.

## Integration Points

- **API Development**: Frontend consumes APIs designed with api-development skill
- **Testing Strategies**: Implement testing patterns from testing-strategies skill
- **Performance Optimization**: Apply performance-optimization techniques
- **Technical Documentation**: Document component APIs and architecture decisions
- **DevOps Practices**: Integrate with CI/CD pipelines and deployment workflows
- **Code Review**: Apply code-review standards to frontend code
