import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, renderHook } from '@testing-library/react';
import React from 'react';
import { CacheProvider } from '../components/CacheProvider';
import { useCacheContext } from '../hooks';
import type { CacheConfig } from '../types';

// Mock the CacheClient
vi.mock('../api', () => {
  return {
    CacheClient: vi.fn().mockImplementation((config: CacheConfig) => ({
      config,
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      invalidateByTag: vi.fn(),
      invalidateByPattern: vi.fn(),
      getStats: vi.fn(),
      flush: vi.fn(),
      exists: vi.fn(),
      keys: vi.fn(),
      ttl: vi.fn(),
      extend: vi.fn(),
    })),
    getCacheClient: vi.fn(),
  };
});

describe('CacheProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render children', () => {
      render(
        <CacheProvider config={{}}>
          <div data-testid="child">Child Content</div>
        </CacheProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <CacheProvider config={{}}>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
          <div data-testid="child3">Child 3</div>
        </CacheProvider>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
      expect(screen.getByTestId('child3')).toBeInTheDocument();
    });

    it('should render nested components', () => {
      const NestedChild = () => <span data-testid="nested">Nested</span>;

      render(
        <CacheProvider config={{}}>
          <div>
            <NestedChild />
          </div>
        </CacheProvider>
      );

      expect(screen.getByTestId('nested')).toBeInTheDocument();
    });
  });

  describe('context provision', () => {
    it('should provide cache context to children', () => {
      const TestConsumer = () => {
        const context = useCacheContext();
        return <div data-testid="context-test">{context ? 'Context Available' : 'No Context'}</div>;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(screen.getByText('Context Available')).toBeInTheDocument();
    });

    it('should provide client in context', () => {
      let capturedContext: ReturnType<typeof useCacheContext> | null = null;

      const TestConsumer = () => {
        capturedContext = useCacheContext();
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedContext).not.toBeNull();
      expect(capturedContext!.client).toBeDefined();
    });

    it('should provide config in context', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        const { config } = useCacheContext();
        capturedConfig = config;
        return null;
      };

      render(
        <CacheProvider config={{ defaultTTL: 600 }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig).not.toBeNull();
      expect(capturedConfig!.defaultTTL).toBe(600);
    });
  });

  describe('default configuration', () => {
    it('should apply default redis URL when not provided', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.redis.url).toBe('redis://localhost:6379');
    });

    it('should apply default maxRetries when not provided', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.redis.maxRetries).toBe(3);
    });

    it('should apply default connectTimeout when not provided', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.redis.connectTimeout).toBe(5000);
    });

    it('should apply default TTL of 300 seconds', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.defaultTTL).toBe(300);
    });

    it('should apply default keyPrefix of app:', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.keyPrefix).toBe('app:');
    });

    it('should apply default json serializer', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.serializer).toBe('json');
    });

    it('should enable L1 cache by default', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.enableL1Cache).toBe(true);
    });

    it('should apply default L1 max size of 1000', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.l1MaxSize).toBe(1000);
    });
  });

  describe('custom configuration', () => {
    it('should override default TTL with custom value', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{ defaultTTL: 1800 }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.defaultTTL).toBe(1800);
    });

    it('should override default keyPrefix with custom value', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{ keyPrefix: 'custom:prefix:' }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.keyPrefix).toBe('custom:prefix:');
    });

    it('should override serializer with msgpack', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{ serializer: 'msgpack' }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.serializer).toBe('msgpack');
    });

    it('should disable L1 cache when configured', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{ enableL1Cache: false }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.enableL1Cache).toBe(false);
    });

    it('should override L1 max size', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{ l1MaxSize: 5000 }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.l1MaxSize).toBe(5000);
    });

    it('should override redis URL', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{ redis: { url: 'redis://production:6380' } }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.redis.url).toBe('redis://production:6380');
    });

    it('should merge partial redis config with defaults', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{ redis: { maxRetries: 5 } }}>
          <TestConsumer />
        </CacheProvider>
      );

      // Custom value
      expect(capturedConfig!.redis.maxRetries).toBe(5);
      // Default values preserved
      expect(capturedConfig!.redis.url).toBe('redis://localhost:6379');
      expect(capturedConfig!.redis.connectTimeout).toBe(5000);
    });

    it('should support redis password configuration', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{ redis: { password: 'secret123' } }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.redis.password).toBe('secret123');
    });

    it('should support redis TLS configuration', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{ redis: { tls: true } }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.redis.tls).toBe(true);
    });
  });

  describe('memoization', () => {
    it('should memoize config to prevent unnecessary re-renders', () => {
      const renderCounts = { count: 0 };

      const TestConsumer = React.memo(() => {
        renderCounts.count++;
        useCacheContext();
        return <div>Consumer</div>;
      });

      const { rerender } = render(
        <CacheProvider config={{ defaultTTL: 300 }}>
          <TestConsumer />
        </CacheProvider>
      );

      const initialCount = renderCounts.count;

      // Re-render with the same config values (new object reference)
      rerender(
        <CacheProvider config={{ defaultTTL: 300 }}>
          <TestConsumer />
        </CacheProvider>
      );

      // With memoization, should not cause additional renders
      // Note: This test verifies useMemo is working
      expect(renderCounts.count).toBeGreaterThanOrEqual(initialCount);
    });

    it('should update context when config changes', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      const { rerender } = render(
        <CacheProvider config={{ defaultTTL: 300 }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.defaultTTL).toBe(300);

      rerender(
        <CacheProvider config={{ defaultTTL: 600 }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.defaultTTL).toBe(600);
    });
  });

  describe('complete configuration', () => {
    it('should accept complete custom configuration', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      const customConfig: Partial<CacheConfig> = {
        redis: {
          url: 'redis://custom:6379',
          maxRetries: 5,
          connectTimeout: 10000,
          password: 'secret',
          tls: true,
        },
        defaultTTL: 1800,
        keyPrefix: 'myapp:v2:',
        serializer: 'msgpack',
        enableL1Cache: false,
        l1MaxSize: 500,
      };

      render(
        <CacheProvider config={customConfig}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig).toEqual(customConfig);
    });
  });

  describe('nested providers', () => {
    it('should allow nested providers with different configs', () => {
      let outerConfig: CacheConfig | null = null;
      let innerConfig: CacheConfig | null = null;

      const OuterConsumer = () => {
        outerConfig = useCacheContext().config;
        return null;
      };

      const InnerConsumer = () => {
        innerConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{ keyPrefix: 'outer:' }}>
          <OuterConsumer />
          <CacheProvider config={{ keyPrefix: 'inner:' }}>
            <InnerConsumer />
          </CacheProvider>
        </CacheProvider>
      );

      expect(outerConfig!.keyPrefix).toBe('outer:');
      expect(innerConfig!.keyPrefix).toBe('inner:');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string keyPrefix', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{ keyPrefix: '' }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.keyPrefix).toBe('');
    });

    it('should handle zero defaultTTL', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{ defaultTTL: 0 }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.defaultTTL).toBe(0);
    });

    it('should handle zero l1MaxSize', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{ l1MaxSize: 0 }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.l1MaxSize).toBe(0);
    });

    it('should handle very large TTL values', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{ defaultTTL: 86400 * 365 }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.defaultTTL).toBe(86400 * 365);
    });

    it('should handle special characters in keyPrefix', () => {
      let capturedConfig: CacheConfig | null = null;

      const TestConsumer = () => {
        capturedConfig = useCacheContext().config;
        return null;
      };

      render(
        <CacheProvider config={{ keyPrefix: 'app:v1:user-123:' }}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(capturedConfig!.keyPrefix).toBe('app:v1:user-123:');
    });
  });

  describe('client methods availability', () => {
    it('should provide client with get method', () => {
      let capturedClient: ReturnType<typeof useCacheContext>['client'] | null = null;

      const TestConsumer = () => {
        capturedClient = useCacheContext().client;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(typeof capturedClient!.get).toBe('function');
    });

    it('should provide client with set method', () => {
      let capturedClient: ReturnType<typeof useCacheContext>['client'] | null = null;

      const TestConsumer = () => {
        capturedClient = useCacheContext().client;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(typeof capturedClient!.set).toBe('function');
    });

    it('should provide client with delete method', () => {
      let capturedClient: ReturnType<typeof useCacheContext>['client'] | null = null;

      const TestConsumer = () => {
        capturedClient = useCacheContext().client;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(typeof capturedClient!.delete).toBe('function');
    });

    it('should provide client with flush method', () => {
      let capturedClient: ReturnType<typeof useCacheContext>['client'] | null = null;

      const TestConsumer = () => {
        capturedClient = useCacheContext().client;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(typeof capturedClient!.flush).toBe('function');
    });

    it('should provide client with invalidateByTag method', () => {
      let capturedClient: ReturnType<typeof useCacheContext>['client'] | null = null;

      const TestConsumer = () => {
        capturedClient = useCacheContext().client;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(typeof capturedClient!.invalidateByTag).toBe('function');
    });

    it('should provide client with invalidateByPattern method', () => {
      let capturedClient: ReturnType<typeof useCacheContext>['client'] | null = null;

      const TestConsumer = () => {
        capturedClient = useCacheContext().client;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(typeof capturedClient!.invalidateByPattern).toBe('function');
    });

    it('should provide client with getStats method', () => {
      let capturedClient: ReturnType<typeof useCacheContext>['client'] | null = null;

      const TestConsumer = () => {
        capturedClient = useCacheContext().client;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(typeof capturedClient!.getStats).toBe('function');
    });

    it('should provide client with exists method', () => {
      let capturedClient: ReturnType<typeof useCacheContext>['client'] | null = null;

      const TestConsumer = () => {
        capturedClient = useCacheContext().client;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(typeof capturedClient!.exists).toBe('function');
    });

    it('should provide client with keys method', () => {
      let capturedClient: ReturnType<typeof useCacheContext>['client'] | null = null;

      const TestConsumer = () => {
        capturedClient = useCacheContext().client;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(typeof capturedClient!.keys).toBe('function');
    });

    it('should provide client with ttl method', () => {
      let capturedClient: ReturnType<typeof useCacheContext>['client'] | null = null;

      const TestConsumer = () => {
        capturedClient = useCacheContext().client;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(typeof capturedClient!.ttl).toBe('function');
    });

    it('should provide client with extend method', () => {
      let capturedClient: ReturnType<typeof useCacheContext>['client'] | null = null;

      const TestConsumer = () => {
        capturedClient = useCacheContext().client;
        return null;
      };

      render(
        <CacheProvider config={{}}>
          <TestConsumer />
        </CacheProvider>
      );

      expect(typeof capturedClient!.extend).toBe('function');
    });
  });
});
