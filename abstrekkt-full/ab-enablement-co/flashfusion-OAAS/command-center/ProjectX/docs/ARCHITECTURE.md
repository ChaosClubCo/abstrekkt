# ProjectX Architecture

> Comprehensive SaaS platform skeleton with 50 modular components
> **Version:** 1.0.0 | **Last Updated:** January 2026

> ⚠️ **Parts of this document are stale.** Where it disagrees with the root
> `CLAUDE.md`, `package.json`, or the config files, trust those. Known drift:
> version numbers below (this repo runs React 19 / Vite 6 / **Tailwind v4** /
> ESLint 9 / Vitest 3), the `tailwind.config.js` references (Tailwind v4 here is
> config-less, loaded via `@tailwindcss/vite`), the `@projectx/shared` package
> (not created yet — alias does not resolve), and the module generator
> (`npm run generate:module` is broken; `scripts/generate-module.js` is missing).
> The conceptual patterns (state management, module structure, data flow) are
> still accurate.

---

## Table of Contents

1. [High-Level System Overview](#high-level-system-overview)
2. [Module Organization](#module-organization)
3. [Data Flow Patterns](#data-flow-patterns)
4. [State Management](#state-management)
5. [Module Communication](#module-communication)
6. [Shared Package Structure](#shared-package-structure)
7. [Build System](#build-system)
8. [Module Generator](#module-generator)
9. [Quick Reference](#quick-reference)

---

## High-Level System Overview

```
+-----------------------------------------------------------------------------------+
|                                   BROWSER CLIENT                                   |
+-----------------------------------------------------------------------------------+
|                                                                                    |
|   +------------------+    +------------------+    +------------------+             |
|   |   React Router   |    |  React Query     |    |     Zustand      |             |
|   |   (Navigation)   |    |  (Server State)  |    |  (Client State)  |             |
|   +--------+---------+    +--------+---------+    +--------+---------+             |
|            |                       |                       |                       |
|            +---------------+-------+-----------------------+                       |
|                            |                                                       |
|                            v                                                       |
|   +--------------------------------------------------------------------------------+
|   |                           @projectx/shared                                     |
|   |  +-------------+  +-------------+  +-------------+  +-------------+            |
|   |  | Components  |  |    Hooks    |  |    Utils    |  |    Types    |            |
|   |  +-------------+  +-------------+  +-------------+  +-------------+            |
|   +--------------------------------------------------------------------------------+
|                            |                                                       |
|            +---------------+---------------+---------------+                       |
|            |               |               |               |                       |
|            v               v               v               v                       |
|   +--------------+  +--------------+  +--------------+  +--------------+           |
|   | Core Platform|  |Infrastructure|  |    AI &      |  |  Analytics & |           |
|   |   Modules    |  |   Modules    |  | Intelligence |  |  Monitoring  |           |
|   |   (7 mods)   |  |  (17 mods)   |  |   (4 mods)   |  |   (3 mods)   |           |
|   +--------------+  +--------------+  +--------------+  +--------------+           |
|            |               |               |               |                       |
|            +---------------+---------------+---------------+                       |
|                            |                                                       |
+-----------------------------------------------------------------------------------+
                             |
                             v
+-----------------------------------------------------------------------------------+
|                              API LAYER (Axios)                                     |
|                         /api/* -> localhost:3001                                   |
+-----------------------------------------------------------------------------------+
                             |
                             v
+-----------------------------------------------------------------------------------+
|                           BACKEND SERVICES                                         |
|   +-------------+  +-------------+  +-------------+  +-------------+               |
|   |    Auth     |  |   Database  |  |    Cache    |  |   Storage   |               |
|   +-------------+  +-------------+  +-------------+  +-------------+               |
+-----------------------------------------------------------------------------------+
```

### Request Flow

```
User Action
    |
    v
+-------------------+
|   React Component |
+-------------------+
    |
    v
+-------------------+     +-------------------+
|   Custom Hook     |---->|   React Query     |  (Server State)
|   (useXxx)        |     |   queryClient     |
+-------------------+     +-------------------+
    |                             |
    v                             v
+-------------------+     +-------------------+
|   Zustand Store   |     |   API Function    |
|   (Client State)  |     |   (axios)         |
+-------------------+     +-------------------+
                                  |
                                  v
                          +-------------------+
                          |   Backend API     |
                          |   /api/endpoint   |
                          +-------------------+
```

---

## Module Organization

### 9 Categories, 50 Modules

| Category | Module Count | Description |
|----------|-------------|-------------|
| **Core Platform** | 7 | Essential user-facing features |
| **Infrastructure** | 11 | Backend systems and security |
| **Infrastructure (New)** | 6 | Extended infrastructure capabilities |
| **AI & Intelligence** | 4 | AI/ML features and tools |
| **Analytics & Monitoring** | 3 | Data visualization and system health |
| **Communication** | 3 | User engagement and support |
| **DevOps** | 3 | Development and deployment tools |
| **Content & Commerce** | 4 | Content management and e-commerce |
| **Enterprise** | 6 | Enterprise-grade features |
| **Data** | 2 | Data management and search |
| **UI/UX** | 3 | User interface enhancements |

---

### Module Details

#### Core Platform (7 modules)

| Module | Purpose | Key Hook |
|--------|---------|----------|
| `auth_module` | Sign-up, sign-in, sign-out flows | `useAuth()` |
| `project_dashboard` | Main dashboard UI | `useProjectDashboard()` |
| `user_settings` | User preferences | `useUserSettings()` |
| `team_management` | Team member management | `useTeamManagement()` |
| `roles_management` | RBAC roles and permissions | `useRolesManagement()` |
| `billing_management` | Subscriptions (Free/Pro/Enterprise) | `useBillingManagement()` |
| `onboarding_assistant` | User onboarding flows | `useOnboarding()` |

#### Infrastructure (11 modules)

| Module | Purpose | Key Hook |
|--------|---------|----------|
| `multi_tenancy` | Workspace isolation, tenant data | `useMultiTenancy()` |
| `audit_logging` | Comprehensive activity trail | `useAuditLogging()` |
| `two_factor_auth` | 2FA/MFA authentication | `useTwoFactorAuth()` |
| `email_templates` | Transactional email system | `useEmailTemplates()` |
| `webhook_manager` | Incoming/outgoing webhooks | `useWebhookManager()` |
| `feature_flags` | Gradual feature rollout | `useFeatureFlags()` |
| `api_documentation` | OpenAPI/Swagger docs | `useApiDocumentation()` |
| `background_jobs` | Queue management | `useBackgroundJobs()` |
| `session_management` | View/revoke sessions | `useSessionManagement()` |
| `api_rate_limiting` | Protect APIs from abuse | `useApiRateLimiting()` |
| `file_management` | Upload, storage, CDN | `useFileManagement()` |

#### Infrastructure - New (6 modules)

| Module | Purpose | Key Hook |
|--------|---------|----------|
| `caching_layer` | Application caching | `useCaching()` |
| `health_status` | System health monitoring | `useHealthStatus()` |
| `usage_pricing` | Usage-based billing | `useUsagePricing()` |
| `sso_saml` | SSO/SAML authentication | `useSsoSaml()` |
| `ip_whitelisting` | IP-based access control | `useIpWhitelisting()` |
| `white_label` | White-label customization | `useWhiteLabel()` |

#### AI & Intelligence (4 modules)

| Module | Purpose | Key Hook |
|--------|---------|----------|
| `AIAgents` | AI agent workflows | `useAiAgents()` |
| `ai_builder_demo` | AI builder interface | `useAiBuilder()` |
| `ai_finetuning` | Model fine-tuning | `useAiFinetuning()` |
| `ai_tools_marketplace` | AI tools marketplace | `useAiToolsMarketplace()` |

#### Analytics & Monitoring (3 modules)

| Module | Purpose | Key Hook |
|--------|---------|----------|
| `analytics_dashboard` | Basic analytics | `useAnalytics()` |
| `advanced_analytics` | Advanced reporting | `useAdvancedAnalytics()` |
| `monitoring_dashboard` | System monitoring | `useMonitoring()` |

#### Communication (3 modules)

| Module | Purpose | Key Hook |
|--------|---------|----------|
| `notifications_module` | User notifications | `useNotifications()` |
| `realtime_chat_support` | Live chat support | `useChatSupport()` |
| `feedback_system` | User feedback collection | `useFeedbackSystem()` |

#### DevOps (3 modules)

| Module | Purpose | Key Hook |
|--------|---------|----------|
| `ci_cd_setup` | CI/CD pipelines | `useCiCd()` |
| `secrets_management` | Secrets vault | `useSecretsManagement()` |
| `testing_interface` | Testing tools | `useTestingInterface()` |

#### Content & Commerce (4 modules)

| Module | Purpose | Key Hook |
|--------|---------|----------|
| `support_docs` | Documentation system | `useSupportDocs()` |
| `template_marketplace` | Template store | `useTemplateMarketplace()` |
| `commerce_demo` | E-commerce demo | `useCommerceDemo()` |
| `publish_demo` | Publishing workflows | `usePublishDemo()` |

#### Enterprise (6 modules)

| Module | Purpose | Key Hook |
|--------|---------|----------|
| `compliance_privacy` | GDPR/compliance tools | `useCompliancePrivacy()` |
| `custom_domain_ssl` | Custom domains | `useCustomDomain()` |
| `localization_support` | i18n/l10n | `useLocalization()` |
| `integrations_manager` | Third-party integrations | `useIntegrationsManager()` |
| `sso_saml` | Enterprise SSO | `useSsoSaml()` |
| `ip_whitelisting` | IP access control | `useIpWhitelisting()` |

#### Data (2 modules)

| Module | Purpose | Key Hook |
|--------|---------|----------|
| `comprehensive_search` | Search functionality | `useComprehensiveSearch()` |
| `data_import_export` | Data portability | `useDataMigration()` |

#### UI/UX (3 modules)

| Module | Purpose | Key Hook |
|--------|---------|----------|
| `dark_mode` | Dark theme support | `useDarkMode()` |
| `keyboard_shortcuts` | Keyboard navigation | `useKeyboardShortcuts()` |
| `pwa_mobile` | PWA/mobile support | `usePwa()` |

---

## Data Flow Patterns

### Pattern 1: Server State (React Query)

Used for: API data that needs caching, synchronization, and background updates.

```
Component
    |
    +---> useQuery({ queryKey, queryFn })
    |         |
    |         +---> API call (axios)
    |         |         |
    |         |         +---> Backend
    |         |
    |         +---> Cache (queryClient)
    |
    +---> useMutation({ mutationFn, onSuccess })
              |
              +---> invalidateQueries()
```

**Example:**

```typescript
// In module hook (e.g., useTeamManagement)
export function useTeamManagement() {
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['team_members'],
    queryFn: api.getAll,
  });

  const createMutation = useMutation({
    mutationFn: api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
    },
  });

  return { members, isLoading, create: createMutation.mutateAsync };
}
```

### Pattern 2: Client State (Zustand)

Used for: UI state, user preferences, and ephemeral data.

```
Component A                    Component B
    |                              |
    +---> useStore() <-------------+
              |
              v
    +-------------------+
    |   Zustand Store   |
    |   - state         |
    |   - actions       |
    +-------------------+
```

**Example:**

```typescript
// Store definition
import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  theme: 'light',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
}));
```

### Pattern 3: Combined State Flow

```
+----------------+     +-----------------+     +----------------+
|   Component    |     |   Custom Hook   |     |   API Layer    |
+----------------+     +-----------------+     +----------------+
        |                      |                      |
        |   1. User Action     |                      |
        +--------------------->|                      |
        |                      |   2. API Call        |
        |                      +--------------------->|
        |                      |                      |
        |                      |   3. Response        |
        |                      |<---------------------+
        |                      |                      |
        |   4. Update Zustand  |                      |
        |   (UI State)         |                      |
        |<---------------------|                      |
        |                      |                      |
        |   5. Invalidate      |                      |
        |   React Query        |                      |
        |   (Server State)     |                      |
        |<---------------------|                      |
        |                      |                      |
        |   6. Re-render       |                      |
        +<---------------------+                      |
```

---

## State Management

### Zustand + React Query Strategy

| State Type | Tool | Use Case |
|------------|------|----------|
| **Server State** | React Query | API data, cached resources, background sync |
| **Client State** | Zustand | UI toggles, forms, local preferences |
| **URL State** | React Router | Navigation, filters, pagination |
| **Form State** | React Hook Form* | Complex forms with validation |

*Optional - many modules use controlled components

### Query Key Conventions

```typescript
// Single resource
['module_name']                    // List
['module_name', id]                // Single item
['module_name', 'search', query]   // Search results

// Examples
['team_members']
['team_members', 'user_123']
['analytics', 'dashboard', { range: '7d' }]
```

### Zustand Store Pattern

```typescript
// stores/uiStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  // State
  value: string;

  // Actions
  setValue: (value: string) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      value: '',
      setValue: (value) => set({ value }),
    }),
    { name: 'store-key' }
  )
);
```

---

## Module Communication

### Direct Import (Same Category)

```typescript
// Within same category, import directly
import { useAuth } from '@projectx/auth_module';
import { useTeamManagement } from '@projectx/team_management';
```

### Via Shared Package (Cross-Category)

```typescript
// Use shared types and utilities
import { User, Tenant, ApiResponse } from '@projectx/shared/types';
import { cn, formatDate } from '@projectx/shared/utils';
import { useDebounce, useLocalStorage } from '@projectx/shared/hooks';
```

### Event-Based Communication

```
+----------------+                    +----------------+
|   Module A     |                    |   Module B     |
+----------------+                    +----------------+
        |                                    ^
        |   1. Trigger Event                 |
        +---> queryClient.invalidateQueries(['shared_key'])
        |                                    |
        |   2. React Query detects           |
        |      invalidation                  |
        +------------------------------------+
```

### Communication Matrix

```
                    +--------+--------+--------+--------+
                    |  Auth  |  Team  | Billing|Analytics|
+-------------------+--------+--------+--------+--------+
| auth_module       |   -    |  Write |  Read  |  Write |
| team_management   |  Read  |   -    |  Read  |  Write |
| billing_management|  Read  |  Read  |   -    |  Write |
| analytics_dashboard| Read  |  Read  |  Read  |   -    |
+-------------------+--------+--------+--------+--------+

Read  = Consumes data from
Write = Triggers updates to
```

---

## Shared Package Structure

### Package: `@projectx/shared`

```
packages/
  shared/
    package.json
    src/
      index.ts           # Main entry - re-exports all
      components/
        index.ts         # Shared UI components
      hooks/
        index.ts         # Shared React hooks
      utils/
        index.ts         # Utility functions
      types/
        index.ts         # TypeScript interfaces
```

### Import Paths

```typescript
// Full package
import { User, cn, useDebounce } from '@projectx/shared';

// Specific subpath
import { User, Tenant } from '@projectx/shared/types';
import { cn, formatDate } from '@projectx/shared/utils';
import { useDebounce } from '@projectx/shared/hooks';
import { Button } from '@projectx/shared/components';
```

### Shared Hooks

| Hook | Purpose |
|------|---------|
| `useDebounce<T>` | Debounce value changes |
| `useLocalStorage<T>` | Persist to localStorage |
| `usePrevious<T>` | Track previous value |
| `useToggle` | Boolean toggle state |
| `useClipboard` | Copy to clipboard |
| `useMediaQuery` | Responsive breakpoints |
| `useIsMounted` | Check mount status |
| `useInterval` | Safe interval handler |

### Shared Utilities

| Utility | Purpose |
|---------|---------|
| `cn()` | Merge Tailwind classes (clsx + tailwind-merge) |
| `formatDate()` | Localized date formatting |
| `formatDateTime()` | Localized datetime formatting |
| `generateId()` | Random ID generation |
| `slugify()` | URL-safe strings |
| `truncate()` | String truncation |
| `debounce()` | Function debouncing |
| `sleep()` | Async delay |
| `isEmpty()` | Check empty values |
| `safeJsonParse()` | Safe JSON parsing |
| `createHash()` | HMAC hash generation |
| `maskSensitive()` | Mask sensitive data |

### Shared Types

| Type | Purpose |
|------|---------|
| `User` | User entity |
| `Tenant` | Tenant/workspace entity |
| `UserRole` | Role enum (owner/admin/member/viewer) |
| `SubscriptionPlan` | Plan enum (free/pro/enterprise) |
| `PaginatedResponse<T>` | Paginated API response |
| `ApiResponse<T>` | Standard API response |
| `ApiError` | Error structure |
| `AuditLogEntry` | Audit log entry |
| `FeatureFlag` | Feature flag definition |
| `Webhook` | Webhook configuration |
| `BackgroundJob` | Job queue item |
| `EmailTemplate` | Email template definition |

---

## Build System

### Tech Stack

| Tool | Purpose | Version |
|------|---------|---------|
| **Vite** | Build tool & dev server | ^6.4.1 |
| **TypeScript** | Type safety | ^5.3.3 |
| **Tailwind CSS** | Styling (v4, via `@tailwindcss/vite`; no config file) | ^4.1.18 |
| **React** | UI framework | ^19.1.0 |
| **ESLint** | Linting (flat config, `eslint.config.js`) | ^9.18.0 |
| **Prettier** | Formatting | ^3.8.0 |
| **Vitest** | Testing | ^3.2.4 |
| **Husky** | Git hooks (inert — no `.husky/`; `.git` is at repo root) | ^9.1.7 |

### NPM Scripts

```bash
# Development
npm run dev              # Start Vite dev server (port 5173)

# Building
npm run build            # TypeScript check + Vite build
npm run preview          # Preview production build

# Testing
npm run test             # Run Vitest
npm run test:coverage    # Run with coverage

# Code Quality
npm run lint             # ESLint check
npm run lint:fix         # ESLint fix
npm run format           # Prettier format
npm run typecheck        # TypeScript check only

# Module Generation
npm run generate:module <name>   # Create new module

# Maintenance
npm run clean            # Clear caches
npm run prepare          # Install Husky hooks
```

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@projectx/shared': path.resolve(__dirname, './packages/shared/src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "paths": {
      "@projectx/shared": ["packages/shared/src"],
      "@projectx/shared/*": ["packages/shared/src/*"],
      "@/*": ["src/*"]
    }
  }
}
```

### Tailwind Configuration

Tailwind **v4** is loaded by the `@tailwindcss/vite` plugin and imported once in
`src/index.css` (`@import "tailwindcss";`). **There is no `tailwind.config.js`** —
v4 auto-detects content, so you do not register module globs by hand.

- Content scanning: automatic (v4)
- Fonts: Inter (sans), JetBrains Mono (mono) — loaded in `index.html`
- Plugins: none beyond the Tailwind Vite plugin

---

## Module Generator

> ⚠️ **Currently broken.** `npm run generate:module` invokes
> `scripts/generate-module.js`, which does not exist. The structure and patterns
> below remain the convention — create a module by hand (copy an existing module's
> `src/`), then register its globs in `tsconfig.json` and `vitest.config.ts`. The
> generated-code snippets are still accurate templates.

### Usage

```bash
npm run generate:module <module_name>

# Example
npm run generate:module user_preferences
```

### Naming Convention

- Use `snake_case` for module names
- Must start with lowercase letter
- Only lowercase letters, numbers, and underscores

### Generated Structure

```
<module_name>/
  README.md              # Module documentation
  package.json           # Package configuration
  src/
    index.ts             # Main exports
    types/
      index.ts           # TypeScript interfaces
    api/
      index.ts           # API functions (axios)
    hooks/
      index.ts           # React Query hooks
    components/
      index.ts           # React components
```

### Generated Hook Pattern

```typescript
// Generated: src/hooks/index.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';
import type { CreateInput, UpdateInput } from '../types';

export function useModuleName() {
  const queryClient = useQueryClient();

  // Query for list
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['module_name'],
    queryFn: api.getAll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: api.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['module_name'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }) => api.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['module_name'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: api.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['module_name'] }),
  });

  return {
    items,
    isLoading,
    error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}

// Query for single item
export function useModuleNameItem(id: string) {
  return useQuery({
    queryKey: ['module_name', id],
    queryFn: () => api.getById(id),
    enabled: !!id,
  });
}
```

### Generated API Pattern

```typescript
// Generated: src/api/index.ts
import axios from 'axios';
import type { Item, CreateInput, UpdateInput } from '../types';

const API_BASE = '/api/module-name';

export async function getAll(): Promise<Item[]> {
  const response = await axios.get<Item[]>(API_BASE);
  return response.data;
}

export async function getById(id: string): Promise<Item> {
  const response = await axios.get<Item>(`${API_BASE}/${id}`);
  return response.data;
}

export async function create(input: CreateInput): Promise<Item> {
  const response = await axios.post<Item>(API_BASE, input);
  return response.data;
}

export async function update(id: string, input: UpdateInput): Promise<Item> {
  const response = await axios.patch<Item>(`${API_BASE}/${id}`, input);
  return response.data;
}

export async function remove(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/${id}`);
}
```

---

## Quick Reference

### Starting Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
# http://localhost:5173
```

### Creating a New Module

```bash
# Generate module scaffold
npm run generate:module my_new_module

# Files created:
# my_new_module/README.md
# my_new_module/package.json
# my_new_module/src/index.ts
# my_new_module/src/types/index.ts
# my_new_module/src/api/index.ts
# my_new_module/src/hooks/index.ts
# my_new_module/src/components/index.ts
```

### Adding to Tailwind Content

Nothing to do — Tailwind v4 auto-detects content. (There is no `tailwind.config.js`
to edit. To make a new module's **tests and types** run, add its globs to
`vitest.config.ts` and `tsconfig.json` instead.)

### Common Import Patterns

```typescript
// Shared utilities
import { cn, formatDate } from '@projectx/shared/utils';

// Shared hooks
import { useDebounce, useLocalStorage } from '@projectx/shared/hooks';

// Shared types
import { User, ApiResponse } from '@projectx/shared/types';

// Module hook
import { useAuth } from '../auth_module/src/hooks';
```

### Environment Requirements

- Node.js >= 20.0.0
- npm >= 10.0.0

### Key Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `vite.config.ts` | Build configuration |
| `tsconfig.json` | TypeScript configuration (also the per-module `include` list) |
| `vitest.config.ts` | Test config + per-module `include` list + 80% coverage thresholds |
| `eslint.config.js` | ESLint 9 flat config |
| `src/index.css` | Tailwind v4 entry (`@import "tailwindcss";`) — replaces a config file |
| `src/App.tsx` | App shell: providers + routes (composes wired modules) |
| `src/main.tsx` | React DOM render |
| `packages/shared/` | Shared code package — **not created yet** (alias unresolved) |
| `scripts/generate-module.js` | Module generator — **missing** (`generate:module` broken) |

---

## Architecture Decision Records

### ADR-001: Module-per-Feature Structure

**Decision:** Each feature is a separate directory with its own package.json.

**Rationale:**
- Clear ownership boundaries
- Independent versioning possible
- Easy to extract to separate packages
- Parallel development without conflicts

### ADR-002: Zustand + React Query

**Decision:** Use Zustand for client state, React Query for server state.

**Rationale:**
- Clear separation of concerns
- React Query handles caching, background updates, optimistic updates
- Zustand is lightweight for UI state
- Both have excellent TypeScript support

### ADR-003: Shared Package

**Decision:** Common code in `@projectx/shared` package.

**Rationale:**
- Single source of truth for types
- Reusable hooks and utilities
- Consistent styling helpers
- Easier refactoring

---

*For questions about this architecture, refer to `DEVELOPER_HANDOFF.md` or contact the development team.*
