import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBillingManagement } from '../hooks/useBillingManagement';

describe('useBillingManagement', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should start with null subscription', () => {
      const { result } = renderHook(() => useBillingManagement());
      expect(result.current.subscription).toBeNull();
    });

    it('should start with empty logs', () => {
      const { result } = renderHook(() => useBillingManagement());
      expect(result.current.logs).toEqual([]);
    });

    it('should expose all required functions', () => {
      const { result } = renderHook(() => useBillingManagement());
      expect(typeof result.current.subscribe).toBe('function');
      expect(typeof result.current.updatePaymentMethod).toBe('function');
      expect(typeof result.current.cancelSubscription).toBe('function');
    });
  });

  describe('subscribe', () => {
    it('should create a subscription with correct plan and price', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('pro', 49);
      });

      expect(result.current.subscription).not.toBeNull();
      expect(result.current.subscription?.plan).toBe('pro');
      expect(result.current.subscription?.price).toBe(49);
      expect(result.current.subscription?.status).toBe('active');
    });

    it('should set renewal date 30 days from now', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('enterprise', 99);
      });

      const expectedRenewal = new Date('2024-02-14T10:00:00Z');
      expect(result.current.subscription?.renewalDate.toISOString()).toBe(
        expectedRenewal.toISOString()
      );
    });

    it('should add a log entry for subscription', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('pro', 49);
      });

      expect(result.current.logs).toHaveLength(1);
      expect(result.current.logs[0]).toContain('Subscribed to pro plan');
      expect(result.current.logs[0]).toContain('2024-01-15');
    });

    it('should allow subscribing to free plan with $0', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('free', 0);
      });

      expect(result.current.subscription?.plan).toBe('free');
      expect(result.current.subscription?.price).toBe(0);
    });

    it('should allow changing subscription plan', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('free', 0);
      });

      act(() => {
        result.current.subscribe('enterprise', 99);
      });

      expect(result.current.subscription?.plan).toBe('enterprise');
      expect(result.current.subscription?.price).toBe(99);
      expect(result.current.logs).toHaveLength(2);
    });

    it('should prepend new logs (newest first)', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('free', 0);
      });

      vi.setSystemTime(new Date('2024-01-16T10:00:00Z'));

      act(() => {
        result.current.subscribe('pro', 49);
      });

      expect(result.current.logs[0]).toContain('pro plan');
      expect(result.current.logs[1]).toContain('free plan');
    });
  });

  describe('updatePaymentMethod', () => {
    it('should log payment method update', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.updatePaymentMethod('Visa ending in 4242');
      });

      expect(result.current.logs).toHaveLength(1);
      expect(result.current.logs[0]).toContain('Updated payment method: Visa ending in 4242');
    });

    it('should not affect subscription state', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('pro', 49);
      });

      const subscriptionBefore = result.current.subscription;

      act(() => {
        result.current.updatePaymentMethod('Mastercard');
      });

      expect(result.current.subscription).toEqual(subscriptionBefore);
    });

    it('should work without active subscription', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.updatePaymentMethod('PayPal');
      });

      expect(result.current.logs[0]).toContain('PayPal');
      expect(result.current.subscription).toBeNull();
    });

    it('should handle empty payment method string', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.updatePaymentMethod('');
      });

      expect(result.current.logs[0]).toContain('Updated payment method:');
    });

    it('should handle special characters in payment method', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.updatePaymentMethod('Card #1234 (Primary)');
      });

      expect(result.current.logs[0]).toContain('Card #1234 (Primary)');
    });
  });

  describe('cancelSubscription', () => {
    it('should set subscription status to canceled', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('pro', 49);
      });

      act(() => {
        result.current.cancelSubscription();
      });

      expect(result.current.subscription?.status).toBe('canceled');
    });

    it('should preserve other subscription details', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('enterprise', 99);
      });

      const originalPlan = result.current.subscription?.plan;
      const originalPrice = result.current.subscription?.price;

      act(() => {
        result.current.cancelSubscription();
      });

      expect(result.current.subscription?.plan).toBe(originalPlan);
      expect(result.current.subscription?.price).toBe(originalPrice);
    });

    it('should add cancel log entry', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('pro', 49);
      });

      act(() => {
        result.current.cancelSubscription();
      });

      expect(result.current.logs[0]).toContain('Canceled subscription');
    });

    it('should handle cancel when no subscription exists', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.cancelSubscription();
      });

      expect(result.current.subscription).toBeNull();
      expect(result.current.logs).toHaveLength(1);
    });

    it('should allow canceling an already canceled subscription', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('pro', 49);
      });

      act(() => {
        result.current.cancelSubscription();
      });

      act(() => {
        result.current.cancelSubscription();
      });

      expect(result.current.subscription?.status).toBe('canceled');
      expect(result.current.logs).toHaveLength(3);
    });
  });

  describe('combined operations', () => {
    it('should handle subscribe -> update payment -> cancel flow', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('pro', 49);
      });

      act(() => {
        result.current.updatePaymentMethod('Card 4242');
      });

      act(() => {
        result.current.cancelSubscription();
      });

      expect(result.current.logs).toHaveLength(3);
      expect(result.current.subscription?.status).toBe('canceled');
    });

    it('should allow resubscribing after cancellation', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('pro', 49);
      });

      act(() => {
        result.current.cancelSubscription();
      });

      act(() => {
        result.current.subscribe('enterprise', 99);
      });

      expect(result.current.subscription?.status).toBe('active');
      expect(result.current.subscription?.plan).toBe('enterprise');
    });
  });

  describe('edge cases', () => {
    it('should handle rapid successive subscriptions', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('free', 0);
        result.current.subscribe('pro', 49);
        result.current.subscribe('enterprise', 99);
      });

      expect(result.current.subscription?.plan).toBe('enterprise');
      expect(result.current.logs).toHaveLength(3);
    });

    it('should handle very large price values', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('custom', 9999999);
      });

      expect(result.current.subscription?.price).toBe(9999999);
    });

    it('should handle negative price values', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.subscribe('promo', -10);
      });

      expect(result.current.subscription?.price).toBe(-10);
    });

    it('should handle unicode characters in payment method', () => {
      const { result } = renderHook(() => useBillingManagement());

      act(() => {
        result.current.updatePaymentMethod('カード 💳');
      });

      expect(result.current.logs[0]).toContain('カード 💳');
    });
  });

  describe('state isolation', () => {
    it('should maintain separate state between hook instances', () => {
      const { result: result1 } = renderHook(() => useBillingManagement());
      const { result: result2 } = renderHook(() => useBillingManagement());

      act(() => {
        result1.current.subscribe('pro', 49);
      });

      expect(result1.current.subscription?.plan).toBe('pro');
      expect(result2.current.subscription).toBeNull();
    });
  });
});
