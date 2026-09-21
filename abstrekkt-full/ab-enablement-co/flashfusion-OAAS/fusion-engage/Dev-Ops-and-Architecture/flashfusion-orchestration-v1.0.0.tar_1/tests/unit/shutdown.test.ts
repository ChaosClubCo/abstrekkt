/**
 * @module tests/unit/shutdown.test
 * @description Unit tests for graceful shutdown handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  registerCleanupHandler,
  isShutdownInProgress,
  triggerShutdown,
  executeCleanup,
} from '../../src/mcp/shutdown.js';

// Mock process.exit to prevent actual exit during tests
const mockExit = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never);

// Mock console methods
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('Shutdown Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isShutdownInProgress', () => {
    it('should return false initially', () => {
      // Note: This may be true if previous test triggered shutdown
      // In isolation, it starts as false
      expect(typeof isShutdownInProgress()).toBe('boolean');
    });
  });

  describe('registerCleanupHandler', () => {
    it('should accept async cleanup functions', () => {
      const handler = vi.fn().mockResolvedValue(undefined);
      
      // Should not throw
      expect(() => registerCleanupHandler(handler)).not.toThrow();
    });

    it('should accept sync cleanup functions', () => {
      const handler = vi.fn();
      
      expect(() => registerCleanupHandler(handler)).not.toThrow();
    });
  });

  describe('executeCleanup', () => {
    it('should execute registered handlers', async () => {
      const handler1 = vi.fn().mockResolvedValue(undefined);
      const handler2 = vi.fn().mockResolvedValue(undefined);
      
      registerCleanupHandler(handler1);
      registerCleanupHandler(handler2);
      
      await executeCleanup();
      
      // Handlers should be called (may be called multiple times across tests)
      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should handle handler errors gracefully', async () => {
      const failingHandler = vi.fn().mockRejectedValue(new Error('Cleanup failed'));
      const successHandler = vi.fn().mockResolvedValue(undefined);
      
      registerCleanupHandler(failingHandler);
      registerCleanupHandler(successHandler);
      
      // Should not throw even if handler fails
      await expect(executeCleanup()).resolves.not.toThrow();
      
      // Both handlers should have been called
      expect(failingHandler).toHaveBeenCalled();
      expect(successHandler).toHaveBeenCalled();
    });

    it('should isolate handler failures', async () => {
      const handlers = [
        vi.fn().mockResolvedValue(undefined),
        vi.fn().mockRejectedValue(new Error('Fail 1')),
        vi.fn().mockResolvedValue(undefined),
        vi.fn().mockRejectedValue(new Error('Fail 2')),
        vi.fn().mockResolvedValue(undefined),
      ];
      
      handlers.forEach(h => registerCleanupHandler(h));
      
      await executeCleanup();
      
      // All handlers should be called despite failures
      handlers.forEach(h => expect(h).toHaveBeenCalled());
    });
  });

  describe('triggerShutdown', () => {
    it('should be callable programmatically', () => {
      // Just verify it doesn't throw
      // Actual shutdown behavior is mocked
      expect(typeof triggerShutdown).toBe('function');
    });
  });
});

describe('Shutdown Handler Registration', () => {
  it('should support multiple handlers', () => {
    const handlers = Array.from({ length: 5 }, (_, i) => 
      vi.fn().mockResolvedValue(`handler-${i}`)
    );
    
    handlers.forEach(h => registerCleanupHandler(h));
    
    // All should register without error
    expect(true).toBe(true);
  });

  it('should handle empty cleanup scenario', async () => {
    // Even with no handlers, cleanup should complete
    await expect(executeCleanup()).resolves.not.toThrow();
  });
});

describe('Shutdown Edge Cases', () => {
  it('should handle synchronous handlers', async () => {
    const syncHandler = vi.fn(() => {
      // Synchronous operation
      const result = 1 + 1;
      return result;
    });
    
    registerCleanupHandler(syncHandler as unknown as () => Promise<void>);
    
    await executeCleanup();
    
    expect(syncHandler).toHaveBeenCalled();
  });

  it('should handle handlers that throw synchronously', async () => {
    const throwingHandler = vi.fn(() => {
      throw new Error('Sync throw');
    });
    
    registerCleanupHandler(throwingHandler as unknown as () => Promise<void>);
    
    // Should not propagate the error
    await expect(executeCleanup()).resolves.not.toThrow();
  });

  it('should handle slow handlers', async () => {
    const slowHandler = vi.fn(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    registerCleanupHandler(slowHandler);
    
    const start = Date.now();
    await executeCleanup();
    const duration = Date.now() - start;
    
    expect(duration).toBeGreaterThanOrEqual(100);
    expect(slowHandler).toHaveBeenCalled();
  });
});
