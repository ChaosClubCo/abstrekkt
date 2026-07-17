/**
 * Vitest Setup File
 *
 * This file runs before each test file and sets up the testing environment.
 * It includes React Testing Library setup, common mocks, and global utilities.
 */

import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// =============================================================================
// React Testing Library Setup
// =============================================================================

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// =============================================================================
// localStorage Mock
// =============================================================================

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] ?? null;
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// =============================================================================
// sessionStorage Mock
// =============================================================================

const sessionStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] ?? null;
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

// =============================================================================
// Fetch Mock
// =============================================================================

export const mockFetch = vi.fn();

beforeAll(() => {
  global.fetch = mockFetch;
});

afterAll(() => {
  vi.restoreAllMocks();
});

// Helper to create fetch responses
export const createFetchResponse = <T>(data: T, ok = true, status = 200) => ({
  ok,
  status,
  statusText: ok ? 'OK' : 'Error',
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
  blob: () => Promise.resolve(new Blob([JSON.stringify(data)])),
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  headers: new Headers(),
  redirected: false,
  type: 'basic' as ResponseType,
  url: '',
  clone: () => createFetchResponse(data, ok, status),
  body: null,
  bodyUsed: false,
  formData: () => Promise.resolve(new FormData()),
});

// =============================================================================
// window.matchMedia Mock
// =============================================================================

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// =============================================================================
// ResizeObserver Mock
// =============================================================================

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock,
});

// =============================================================================
// IntersectionObserver Mock
// =============================================================================

class IntersectionObserverMock {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
});

// =============================================================================
// MutationObserver Mock
// =============================================================================

class MutationObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}

Object.defineProperty(window, 'MutationObserver', {
  writable: true,
  value: MutationObserverMock,
});

// =============================================================================
// scrollTo Mock
// =============================================================================

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(Element.prototype, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(Element.prototype, 'scrollIntoView', {
  writable: true,
  value: vi.fn(),
});

// =============================================================================
// URL.createObjectURL Mock
// =============================================================================

if (typeof URL.createObjectURL === 'undefined') {
  Object.defineProperty(URL, 'createObjectURL', {
    writable: true,
    value: vi.fn(() => 'blob:mock-url'),
  });
}

if (typeof URL.revokeObjectURL === 'undefined') {
  Object.defineProperty(URL, 'revokeObjectURL', {
    writable: true,
    value: vi.fn(),
  });
}

// =============================================================================
// Clipboard API Mock
// =============================================================================

// Make clipboard configurable so userEvent can override it
Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  configurable: true,
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
    write: vi.fn().mockResolvedValue(undefined),
    read: vi.fn().mockResolvedValue([]),
  },
});

// =============================================================================
// Console Error Suppression for Expected Errors
// =============================================================================

const originalError = console.error;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Suppress React act() warnings in tests
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to') &&
      args[0].includes('was not wrapped in act')
    ) {
      return;
    }

    // Suppress React 18 createRoot warnings
    if (
      typeof args[0] === 'string' &&
      args[0].includes('ReactDOM.render is no longer supported')
    ) {
      return;
    }

    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// =============================================================================
// Global Test Utilities
// =============================================================================

/**
 * Wait for a specified amount of time
 */
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Wait for the next tick of the event loop
 */
export const nextTick = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Flush all pending promises
 */
export const flushPromises = () => new Promise(resolve => setImmediate(resolve));

/**
 * Create a mock function that resolves after a delay
 */
export const createDelayedMock = <T>(value: T, delay = 100) =>
  vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(value), delay)));

/**
 * Create a mock for React Query's QueryClient
 */
export const createMockQueryClient = () => ({
  getQueryData: vi.fn(),
  setQueryData: vi.fn(),
  invalidateQueries: vi.fn(),
  cancelQueries: vi.fn(),
  prefetchQuery: vi.fn(),
  fetchQuery: vi.fn(),
  clear: vi.fn(),
});

// =============================================================================
// Custom Matchers Type Declarations
// =============================================================================

// Extend Vitest's expect with jest-dom matchers
declare module 'vitest' {
  interface Assertion<T = unknown> {
    toBeInTheDocument(): T;
    toBeVisible(): T;
    toBeDisabled(): T;
    toBeEnabled(): T;
    toHaveTextContent(text: string | RegExp): T;
    toHaveAttribute(attr: string, value?: string): T;
    toHaveClass(...classNames: string[]): T;
    toHaveStyle(style: Record<string, unknown>): T;
    toHaveFocus(): T;
    toHaveValue(value: string | string[] | number): T;
    toBeChecked(): T;
    toBePartiallyChecked(): T;
    toHaveAccessibleName(name?: string | RegExp): T;
    toHaveAccessibleDescription(description?: string | RegExp): T;
    toHaveErrorMessage(message?: string | RegExp): T;
    toBeEmpty(): T;
    toContainElement(element: HTMLElement | null): T;
    toContainHTML(html: string): T;
    toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): T;
    toBeRequired(): T;
    toBeValid(): T;
    toBeInvalid(): T;
  }
}
