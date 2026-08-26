# ProjectX Coding Conventions

This document outlines the coding conventions and patterns used in this codebase.

---

## 1. Naming Conventions

### Files and Folders

| Type | Convention | Example |
|------|------------|---------|
| Module folders | `snake_case` | `auth_module/`, `user_settings/` |
| Component files | `PascalCase.tsx` | `Auth.tsx`, `ModuleGallery.tsx` |
| Hook files | `camelCase.ts` (prefixed with `use`) | `useAuth.ts`, `useDebounce.ts` |
| Utility files | `camelCase.ts` or `index.ts` | `utils/index.ts` |
| Type files | `index.ts` in `types/` folder | `types/index.ts` |
| Script files | `kebab-case.js` | `generate-module.js` |

### Code Identifiers

| Type | Convention | Example |
|------|------------|---------|
| Components | `PascalCase` | `ModuleGallery`, `Auth` |
| Hooks | `camelCase` with `use` prefix | `useAuth`, `useDebounce`, `useLocalStorage` |
| Functions | `camelCase` | `validateEmail`, `formatDate`, `handleSubmit` |
| Variables | `camelCase` | `storedValue`, `debouncedValue` |
| Constants (module-level) | `camelCase` for arrays/objects | `modules`, `groupedModules` |
| Interfaces | `PascalCase` | `User`, `UseAuthResult`, `ApiResponse` |
| Type aliases | `PascalCase` | `UserRole`, `JobStatus`, `AuditAction` |

---

## 2. File/Folder Structure

### Module Structure

Each module follows this standard layout:

```
module_name/
├── README.md
├── package.json
└── src/
    ├── index.ts          # Barrel exports
    ├── components/
    │   └── index.ts
    ├── hooks/
    │   └── index.ts
    ├── types/
    │   └── index.ts
    └── api/
        └── index.ts
```

### Shared Package Structure

```
packages/shared/
├── package.json
└── src/
    ├── index.ts          # Re-exports all submodules
    ├── types/index.ts    # Core entity types
    ├── utils/index.ts    # Utility functions
    ├── hooks/index.ts    # Shared hooks
    └── components/index.ts
```

---

## 3. Component Patterns

### Functional Components

Use `React.FC` for typed functional components:

```tsx
const Auth: React.FC = () => {
  // Component logic
  return <div>...</div>;
};

export default Auth;
```

### Component Structure

1. Imports
2. Type definitions (if component-specific)
3. Component function
4. Hooks at the top of the function body
5. Event handlers
6. Conditional early returns
7. Main JSX return

```tsx
import React, { useState } from 'react';
import useAuth from './useAuth';

const Auth: React.FC = () => {
  // 1. Hooks first
  const { user, status, signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');

  // 2. Event handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(email, password);
  };

  // 3. Early returns for conditional rendering
  if (user) {
    return <div>Welcome, {user.name}</div>;
  }

  // 4. Main render
  return <form onSubmit={handleSubmit}>...</form>;
};

export default Auth;
```

---

## 4. TypeScript Patterns

### Interfaces vs Types

- **Interfaces**: Use for object shapes, especially entities and API contracts
- **Type aliases**: Use for unions, primitives, and computed types

```typescript
// Interfaces for object shapes
export interface User {
  id: string;
  email: string;
  name?: string;
}

// Type aliases for unions
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

// Generics for reusable patterns
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
```

### Export Patterns

- Use named exports for types, functions, and hooks
- Use default exports for React components
- Use barrel files (`index.ts`) to re-export from directories

```typescript
// types/index.ts - named exports
export interface User { ... }
export type UserRole = ...;

// hooks/useAuth.ts - default export
const useAuth = (): UseAuthResult => { ... };
export default useAuth;

// index.ts - barrel re-exports
export * from './types';
export * from './hooks';
```

---

## 5. Import Ordering

Follow this order with blank lines between groups:

1. External libraries (react, react-router-dom, etc.)
2. Internal shared modules (@projectx/shared, etc.)
3. Relative imports (./hooks, ../types)
4. Type-only imports

```typescript
import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

import * as api from '../api';
import type { User, CreateUserInput } from '../types';
```

---

## 6. State Management Patterns

### Local State with Hooks

```typescript
const [value, setValue] = useState<string>('');
const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle');
```

### Custom Hooks for Shared Logic

Return an object with named properties for clarity:

```typescript
export interface UseAuthResult {
  user: User | null;
  status: 'idle' | 'pending' | 'authenticated';
  signIn: (email: string, password: string) => void;
  signOut: () => void;
}

const useAuth = (): UseAuthResult => {
  // Implementation
  return { user, status, signIn, signOut };
};
```

### React Query for Server State

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['module_name'],
  queryFn: api.getAll,
});

const createMutation = useMutation({
  mutationFn: api.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['module_name'] });
  },
});
```

---

## 7. API Patterns

### API Module Structure

```typescript
// api/index.ts
import axios from 'axios';
import type { Item, CreateItemInput } from '../types';

const API_BASE = '/api/module-name';

export async function getAll(): Promise<Item[]> {
  const response = await axios.get<Item[]>(API_BASE);
  return response.data;
}

export async function getById(id: string): Promise<Item> {
  const response = await axios.get<Item>(`${API_BASE}/${id}`);
  return response.data;
}

export async function create(input: CreateItemInput): Promise<Item> {
  const response = await axios.post<Item>(API_BASE, input);
  return response.data;
}

export async function update(id: string, input: UpdateItemInput): Promise<Item> {
  const response = await axios.patch<Item>(`${API_BASE}/${id}`, input);
  return response.data;
}

export async function remove(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/${id}`);
}
```

### Response Types

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
```

---

## 8. Testing Patterns

### Test File Location

Tests are placed in `__tests__/` directories with `.test.js` or `.test.ts` extension.

### Test Structure

```javascript
describe('Feature Group', () => {
  describe('Specific Behavior', () => {
    test('should do expected behavior', async () => {
      // Arrange
      const input = { ... };

      // Act
      const response = await api.call(input);

      // Assert
      expect(response.status).toBe(200);
    });
  });
});
```

### API Testing Pattern

```javascript
const response = await axios.post(url, payload, {
  timeout: 30000,
  validateStatus: (status) => status < 500, // Accept non-5xx
});

expect(response.status).toBeLessThan(500);
```

---

## 9. Documentation Patterns

### JSDoc Comments

Use JSDoc for functions and hooks:

```typescript
/**
 * Hook for debounced values.
 * Returns the value after the specified delay has passed without changes.
 */
export function useDebounce<T>(value: T, delay: number): T { ... }

/**
 * Format a date to a localized string.
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string { ... }
```

### Component Comments

Add explanatory comments for complex component behavior:

```typescript
/**
 * Auth component toggles between sign-up and sign-in forms.
 * Uses the useAuth hook to manage authentication state.
 */
const Auth: React.FC = () => { ... };
```

---

## 10. General Guidelines

- Prefer arrow functions for callbacks and inline functions
- Use `useCallback` for memoizing handlers passed to child components
- Keep components focused - extract logic to custom hooks
- Use early returns to reduce nesting
- Prefer explicit return types on exported functions
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Never hardcode secrets - use environment variables
