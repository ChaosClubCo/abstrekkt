# Dependency Upgrade Guide for ProjectX

**Generated**: January 2026
**Current Node Version**: >=20.0.0
**Package Manager**: npm@10.2.0

This guide provides step-by-step instructions for upgrading all outdated dependencies in ProjectX, with risk assessments, migration steps, and rollback procedures.

---

## Table of Contents

1. [Current Dependency Status](#current-dependency-status)
2. [Recommended Upgrade Order](#recommended-upgrade-order)
3. [Zustand 5 Upgrade](#zustand-5-upgrade)
4. [Vite 7 Upgrade](#vite-7-upgrade)
5. [Vitest 4 Upgrade](#vitest-4-upgrade)
6. [ESLint Plugin Updates](#eslint-plugin-updates)
7. [Other Dev Dependencies](#other-dev-dependencies)
8. [Pre-Upgrade Checklist](#pre-upgrade-checklist)
9. [Post-Upgrade Verification](#post-upgrade-verification)
10. [Rollback Procedures](#rollback-procedures)

---

## Current Dependency Status

| Package | Current | Wanted | Latest | Risk Level |
|---------|---------|--------|--------|------------|
| zustand | 4.5.7 | 4.5.7 | 5.0.10 | **HIGH** |
| vite | 6.4.1 | 6.4.1 | 7.3.1 | **MEDIUM** |
| vitest | 3.2.4 | 3.2.4 | 4.0.17 | **MEDIUM** |
| @vitest/coverage-v8 | 3.2.4 | 3.2.4 | 4.0.17 | **MEDIUM** |
| @vitejs/plugin-react | 4.7.0 | 4.7.0 | 5.1.2 | **MEDIUM** |
| eslint-plugin-react-hooks | 5.2.0 | 5.2.0 | 7.0.1 | **LOW** |
| jsdom | 24.1.3 | 24.1.3 | 27.4.0 | **LOW** |
| lint-staged | 15.5.2 | 15.5.2 | 16.2.7 | **LOW** |
| globals | 16.5.0 | 16.5.0 | 17.0.0 | **LOW** |
| rimraf | 5.0.10 | 5.0.10 | 6.1.2 | **LOW** |
| @types/node | 20.19.30 | 20.19.30 | 25.0.10 | **LOW** |
| prettier | 3.8.0 | 3.8.1 | 3.8.1 | **NONE** |
| @types/react | 19.2.8 | 19.2.9 | 19.2.9 | **NONE** |

### Already Up-to-Date (No Changes Needed)

The following major dependencies are already current:
- **React 19.1.0** - Already on React 19
- **Tailwind CSS 4.1.18** - Already on Tailwind v4 with CSS-first config
- **ESLint 9.18.0** - Already on ESLint 9 with flat config
- **React Router 7.12.0** - Already on React Router 7
- **date-fns 4.1.0** - Already on date-fns v4
- **@tanstack/react-query 5.90.19** - Current major version

---

## Recommended Upgrade Order

Execute upgrades in this order to minimize risk and ensure compatibility:

| Order | Package(s) | Reason |
|-------|-----------|--------|
| 1 | prettier, @types/react, @types/node | Patch/minor updates, no breaking changes |
| 2 | globals, rimraf, lint-staged | Low-risk dev tools |
| 3 | jsdom | Testing environment, isolated |
| 4 | eslint-plugin-react-hooks | ESLint plugin update |
| 5 | vitest + @vitest/coverage-v8 | Test runner upgrade (must upgrade together) |
| 6 | vite + @vitejs/plugin-react | Build tool upgrade (must upgrade together) |
| 7 | zustand | State management - highest risk, test thoroughly |

---

## Zustand 5 Upgrade

**Risk Level**: HIGH
**Breaking Changes**: Yes
**Current**: 4.5.7 -> **Target**: 5.0.10

### Breaking Changes to Address

1. **`create` function no longer auto-imports from `zustand/vanilla`**
   - Zustand 5 requires explicit imports for vanilla stores

2. **TypeScript changes**
   - The `create` function signature has changed
   - Generic type inference is now stricter

3. **Middleware changes**
   - `persist` middleware has updated options
   - `devtools` middleware requires explicit naming

4. **`getState` synchronous behavior**
   - Selectors now have stricter typing

### Migration Steps

#### Step 1: Check Current Usage

Search for all Zustand stores in the project:
```bash
grep -r "create(" --include="*.ts" --include="*.tsx" src/ packages/
```

#### Step 2: Update Store Definitions

**Before (Zustand 4):**
```typescript
import { create } from 'zustand';

interface BearState {
  bears: number;
  increase: () => void;
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
}));
```

**After (Zustand 5):**
```typescript
import { create } from 'zustand';

interface BearState {
  bears: number;
  increase: () => void;
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
}));
```

Note the extra `()` after the generic type parameter.

#### Step 3: Update Persist Middleware

**Before (Zustand 4):**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({ ... }),
    { name: 'my-store' }
  )
);
```

**After (Zustand 5):**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create<MyState>()(
  persist(
    (set) => ({ ... }),
    {
      name: 'my-store',
      // partialize is now required if you want to persist partial state
    }
  )
);
```

#### Step 4: Install and Test

```bash
# Create a branch for the upgrade
git checkout -b upgrade/zustand-5

# Update the package
npm install zustand@5

# Run tests
npm test

# Start dev server and test manually
npm run dev
```

### Files Needing Updates

Based on the codebase structure, check these locations:
- `src/store/` or `src/stores/` - Main application stores
- `packages/*/src/` - Shared package stores
- Any module with state management

### Testing Checklist

- [ ] All stores initialize correctly
- [ ] State updates work as expected
- [ ] Persist middleware loads/saves correctly
- [ ] DevTools integration works (if used)
- [ ] All unit tests pass
- [ ] No TypeScript errors

---

## Vite 7 Upgrade

**Risk Level**: MEDIUM
**Breaking Changes**: Yes
**Current**: 6.4.1 -> **Target**: 7.3.1

### Breaking Changes to Address

1. **Node.js version requirement**
   - Vite 7 requires Node.js 20.19+ or 22.12+
   - Verify your Node version: `node --version`

2. **CSS handling changes**
   - CSS modules now use `exports` field resolution
   - PostCSS config loading has changed

3. **Plugin API changes**
   - Some plugin hooks have been modified
   - Rollup 4 is now the default

4. **Configuration changes**
   - `server.middlewareMode` option syntax changed
   - `build.cssCodeSplit` default changed to `true`

### Prerequisites

```bash
# Verify Node.js version
node --version  # Must be >= 20.19.0

# Update @vitejs/plugin-react alongside Vite
```

### Migration Steps

#### Step 1: Update Both Packages Together

```bash
# Create upgrade branch
git checkout -b upgrade/vite-7

# Update Vite and its React plugin together
npm install vite@7 @vitejs/plugin-react@5
```

#### Step 2: Update vite.config.ts

Your current config (`C:\Users\kyler\Desktop\ProjectX\vite.config.ts`) should mostly work, but verify:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

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

#### Step 3: Check for Deprecation Warnings

```bash
# Run dev server and check console for warnings
npm run dev

# Run build and check for warnings
npm run build
```

### Testing Checklist

- [ ] `npm run dev` starts without errors
- [ ] Hot Module Replacement (HMR) works
- [ ] `npm run build` completes successfully
- [ ] Production build runs correctly (`npm run preview`)
- [ ] All path aliases resolve correctly
- [ ] Proxy configuration works

---

## Vitest 4 Upgrade

**Risk Level**: MEDIUM
**Breaking Changes**: Yes
**Current**: 3.2.4 -> **Target**: 4.0.17

### Breaking Changes to Address

1. **Vite 7 peer dependency**
   - Vitest 4 requires Vite 7
   - **Upgrade Vite first before Vitest**

2. **Node.js version**
   - Requires Node.js >= 20.19

3. **Configuration changes**
   - `poolOptions` configuration has changed
   - Some test options have been renamed

4. **Coverage provider changes**
   - `@vitest/coverage-v8` must match Vitest version exactly

### Migration Steps

#### Step 1: Ensure Vite 7 is Installed First

```bash
# Verify Vite version
npm ls vite
```

#### Step 2: Update Vitest and Coverage

```bash
# Update both packages together
npm install vitest@4 @vitest/coverage-v8@4
```

#### Step 3: Update vitest.config.ts

Review your current config (`C:\Users\kyler\Desktop\ProjectX\vitest.config.ts`):

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,

    // Include patterns - unchanged
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'packages/**/*.{test,spec}.{ts,tsx}',
      // ... other patterns
    ],

    exclude: [
      'node_modules',
      'dist',
      '.git',
      '.cache',
      '**/node_modules/**',
    ],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'src/**/*.{ts,tsx}',
        'packages/**/src/**/*.{ts,tsx}',
      ],
      exclude: [
        'node_modules',
        'dist',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },

    reporters: ['default'],
    testTimeout: 10000,
    hookTimeout: 10000,
    watchExclude: ['node_modules', 'dist'],

    // Pool configuration - verify this still works in Vitest 4
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: false,
      },
    },
  },

  resolve: {
    alias: {
      '@projectx/shared': resolve(__dirname, 'packages/shared/src'),
      '@': resolve(__dirname, 'src'),
    },
  },
});
```

#### Step 4: Update jsdom

```bash
# Update jsdom for better compatibility
npm install jsdom@27
```

### Testing Checklist

- [ ] `npm test` runs without errors
- [ ] All tests pass
- [ ] `npm run test:coverage` works
- [ ] Coverage thresholds are met
- [ ] Watch mode works correctly

---

## ESLint Plugin Updates

**Risk Level**: LOW
**Current eslint-plugin-react-hooks**: 5.2.0 -> **Target**: 7.0.1

### Breaking Changes

1. **New hook rules**
   - Additional rules for React hooks validation
   - Stricter exhaustive-deps checking

2. **React version detection**
   - Better React 19 support

### Migration Steps

```bash
# Update the plugin
npm install eslint-plugin-react-hooks@7

# Run lint to check for new violations
npm run lint
```

Your current ESLint config (`C:\Users\kyler\Desktop\ProjectX\eslint.config.js`) already uses flat config format and should work without changes.

### Testing Checklist

- [ ] `npm run lint` runs without errors
- [ ] No new unexpected lint errors
- [ ] `npm run lint:fix` works correctly

---

## Other Dev Dependencies

### Low-Risk Updates (Can Be Done Together)

```bash
# Update all low-risk packages in one command
npm install \
  globals@17 \
  rimraf@6 \
  lint-staged@16 \
  @types/node@25 \
  prettier@latest \
  @types/react@latest
```

### Individual Package Notes

#### globals 17.0.0
- Minor update to global definitions
- No action needed for your ESLint config

#### rimraf 6.1.2
- API unchanged for CLI usage
- Your `clean` script will continue to work

#### lint-staged 16.2.7
- Configuration format unchanged
- Your `.lint-staged` config in package.json is compatible

#### @types/node 25.0.10
- Major version bump but just type definitions
- May require adjusting some Node.js API usage if using deprecated APIs

---

## Pre-Upgrade Checklist

Before starting any upgrades:

```bash
# 1. Ensure clean working directory
git status

# 2. Create a backup branch
git checkout -b backup/pre-upgrade-$(date +%Y%m%d)
git checkout main

# 3. Document current state
npm ls > npm-ls-before.txt
npm outdated > npm-outdated-before.txt

# 4. Run full test suite
npm test

# 5. Ensure build works
npm run build

# 6. Lock down current package-lock.json
git add package-lock.json
git commit -m "chore: lock package-lock.json before upgrades"
```

---

## Post-Upgrade Verification

After each upgrade batch:

### 1. TypeScript Check
```bash
npm run typecheck
```

### 2. Lint Check
```bash
npm run lint
```

### 3. Test Suite
```bash
npm test
npm run test:coverage
```

### 4. Build Verification
```bash
npm run build
npm run preview  # Manual testing
```

### 5. Development Server
```bash
npm run dev  # Check HMR, routing, etc.
```

---

## Rollback Procedures

### Quick Rollback (Single Package)

```bash
# Rollback a single package
npm install <package>@<previous-version>

# Example: Rollback zustand
npm install zustand@4.5.7
```

### Full Rollback (All Changes)

```bash
# Reset to the backup branch
git checkout backup/pre-upgrade-YYYYMMDD

# Or reset package.json and reinstall
git checkout HEAD~1 -- package.json package-lock.json
npm ci
```

### Partial Rollback (Specific Upgrade Batch)

```bash
# Find the commit before the upgrade
git log --oneline

# Reset to that commit
git reset --hard <commit-hash>
npm ci
```

---

## Upgrade Command Summary

### Phase 1: Patch/Minor Updates (Low Risk)
```bash
npm install prettier@latest @types/react@latest
```

### Phase 2: Dev Tool Updates (Low Risk)
```bash
npm install globals@17 rimraf@6 lint-staged@16 @types/node@25
```

### Phase 3: Testing Environment (Low Risk)
```bash
npm install jsdom@27
```

### Phase 4: ESLint Plugins (Low Risk)
```bash
npm install eslint-plugin-react-hooks@7
```

### Phase 5: Build Tools (Medium Risk)
```bash
npm install vite@7 @vitejs/plugin-react@5
npm install vitest@4 @vitest/coverage-v8@4
```

### Phase 6: State Management (High Risk)
```bash
npm install zustand@5
```

---

## Additional Resources

- [Zustand v5 Migration Guide](https://zustand.docs.pmnd.rs/migrations/migrating-to-v5)
- [Vite 7 Release Notes](https://vitejs.dev/blog/)
- [Vitest 4 Changelog](https://vitest.dev/guide/migration.html)
- [ESLint Plugin React Hooks Changelog](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/CHANGELOG.md)

---

## Notes

### What's Already Up-to-Date

Your project is already on the latest major versions for:
- **React 19** - No migration needed
- **Tailwind CSS 4** - Already using CSS-first config with `@import 'tailwindcss'` and `@theme`
- **ESLint 9** - Already using flat config format
- **React Router 7** - No migration needed
- **date-fns 4** - No migration needed
- **TypeScript-ESLint 8** - No migration needed

### React 19 Specific Notes

Your codebase appears to be using React 19 correctly:
- No legacy `useRef` patterns that need updating
- Using modern JSX transform (no React import needed in JSX files)
- `forwardRef` usage appears minimal

The `usePrevious`, `useIsMounted`, and `useInterval` hooks in `packages/shared/src/hooks/index.ts` use `useRef` correctly and don't require changes for React 19.

---

*Last Updated: January 2026*
