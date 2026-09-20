import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { useContext } from 'react';
import { FeatureFlagProvider, FeatureFlagContext } from '../components/FeatureFlagProvider';
import * as api from '../api';
import { mockFeatureFlag, mockFeatureFlags, mockVariantFlag } from './fixtures';

vi.mock('../api');

const mockedApi = vi.mocked(api);

// Test consumer component
function TestConsumer() {
  const context = useContext(FeatureFlagContext);
  if (!context) return <div>No context</div>;

  return (
    <div>
      <div data-testid="loading">{context.isLoading ? 'loading' : 'ready'}</div>
      <div data-testid="flag-count">{context.flags.size}</div>
      <button onClick={() => context.refresh()} data-testid="refresh">
        Refresh
      </button>
    </div>
  );
}

// Evaluation test consumer
function EvaluationConsumer({ flagKey }: { flagKey: string }) {
  const context = useContext(FeatureFlagContext);
  if (!context) return <div>No context</div>;

  const evaluation = context.evaluate(flagKey);

  return (
    <div>
      <div data-testid="enabled">{evaluation.enabled ? 'true' : 'false'}</div>
      <div data-testid="reason">{evaluation.reason}</div>
      <div data-testid="variant">{evaluation.variant ?? 'none'}</div>
    </div>
  );
}

describe('FeatureFlagProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should render children', async () => {
      mockedApi.getFlags.mockResolvedValueOnce([]);

      render(
        <FeatureFlagProvider refreshInterval={0}>
          <div data-testid="child">Child Content</div>
        </FeatureFlagProvider>
      );

      expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
    });

    it('should start in loading state', async () => {
      mockedApi.getFlags.mockResolvedValueOnce([]);

      render(
        <FeatureFlagProvider refreshInterval={0}>
          <TestConsumer />
        </FeatureFlagProvider>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    });

    it('should load flags on mount', async () => {
      mockedApi.getFlags.mockResolvedValueOnce(mockFeatureFlags);

      render(
        <FeatureFlagProvider refreshInterval={0}>
          <TestConsumer />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      expect(screen.getByTestId('flag-count')).toHaveTextContent(String(mockFeatureFlags.length));
    });

    it('should handle empty flags', async () => {
      mockedApi.getFlags.mockResolvedValueOnce([]);

      render(
        <FeatureFlagProvider refreshInterval={0}>
          <TestConsumer />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      expect(screen.getByTestId('flag-count')).toHaveTextContent('0');
    });

    it('should handle API error gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockedApi.getFlags.mockRejectedValueOnce(new Error('API Error'));

      render(
        <FeatureFlagProvider refreshInterval={0}>
          <TestConsumer />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      expect(consoleError).toHaveBeenCalledWith('Failed to load feature flags:', expect.any(Error));
      consoleError.mockRestore();
    });
  });

  describe('refresh interval', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should refresh flags at default interval (60s)', async () => {
      mockedApi.getFlags.mockResolvedValue(mockFeatureFlags);

      render(
        <FeatureFlagProvider>
          <TestConsumer />
        </FeatureFlagProvider>
      );

      // Wait for initial load
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      expect(mockedApi.getFlags).toHaveBeenCalledTimes(1);

      // Advance past the refresh interval
      await act(async () => {
        await vi.advanceTimersByTimeAsync(60000);
      });

      expect(mockedApi.getFlags).toHaveBeenCalledTimes(2);
    });

    it('should use custom refresh interval', async () => {
      mockedApi.getFlags.mockResolvedValue(mockFeatureFlags);

      render(
        <FeatureFlagProvider refreshInterval={30000}>
          <TestConsumer />
        </FeatureFlagProvider>
      );

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      expect(mockedApi.getFlags).toHaveBeenCalledTimes(1);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(30000);
      });

      expect(mockedApi.getFlags).toHaveBeenCalledTimes(2);
    });

    it('should not refresh when interval is 0', async () => {
      mockedApi.getFlags.mockResolvedValue(mockFeatureFlags);

      render(
        <FeatureFlagProvider refreshInterval={0}>
          <TestConsumer />
        </FeatureFlagProvider>
      );

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      expect(mockedApi.getFlags).toHaveBeenCalledTimes(1);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(120000);
      });

      expect(mockedApi.getFlags).toHaveBeenCalledTimes(1);
    });

    it('should clear interval on unmount', async () => {
      mockedApi.getFlags.mockResolvedValue(mockFeatureFlags);

      const { unmount } = render(
        <FeatureFlagProvider refreshInterval={10000}>
          <TestConsumer />
        </FeatureFlagProvider>
      );

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      expect(mockedApi.getFlags).toHaveBeenCalledTimes(1);

      unmount();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(30000);
      });

      expect(mockedApi.getFlags).toHaveBeenCalledTimes(1);
    });
  });

  describe('evaluate function', () => {
    it('should return disabled for unknown flag', async () => {
      mockedApi.getFlags.mockResolvedValueOnce([mockFeatureFlag]);

      render(
        <FeatureFlagProvider refreshInterval={0}>
          <EvaluationConsumer flagKey="unknown_flag" />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('enabled')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('reason')).toHaveTextContent('flag_disabled');
    });

    it('should return disabled for disabled flag', async () => {
      const disabledFlag = { ...mockFeatureFlag, enabled: false };
      mockedApi.getFlags.mockResolvedValueOnce([disabledFlag]);

      render(
        <FeatureFlagProvider refreshInterval={0}>
          <EvaluationConsumer flagKey={disabledFlag.key} />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('enabled')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('reason')).toHaveTextContent('flag_disabled');
    });

    it('should return enabled for enabled flag with 100% rollout', async () => {
      mockedApi.getFlags.mockResolvedValueOnce([mockFeatureFlag]);

      render(
        <FeatureFlagProvider refreshInterval={0} context={{ userId: 'user_123' }}>
          <EvaluationConsumer flagKey={mockFeatureFlag.key} />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('enabled')).toHaveTextContent('true');
      });

      expect(screen.getByTestId('reason')).toHaveTextContent('default_enabled');
    });

    it('should evaluate targeting rules', async () => {
      const flagWithRule = {
        ...mockFeatureFlag,
        rules: [{ id: 'rule_1', attribute: 'plan', operator: 'eq' as const, value: 'enterprise' }],
      };
      mockedApi.getFlags.mockResolvedValueOnce([flagWithRule]);

      render(
        <FeatureFlagProvider refreshInterval={0} context={{ userId: 'user_123', plan: 'enterprise' }}>
          <EvaluationConsumer flagKey={flagWithRule.key} />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('enabled')).toHaveTextContent('true');
      });

      expect(screen.getByTestId('reason')).toHaveTextContent('rule_matched');
    });

    it('should handle "contains" operator', async () => {
      const flagWithContains = {
        ...mockFeatureFlag,
        rules: [{ id: 'rule_1', attribute: 'email', operator: 'contains' as const, value: '@company.com' }],
      };
      mockedApi.getFlags.mockResolvedValueOnce([flagWithContains]);

      render(
        <FeatureFlagProvider refreshInterval={0} context={{ userId: 'user_123', email: 'user@company.com' }}>
          <EvaluationConsumer flagKey={flagWithContains.key} />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('reason')).toHaveTextContent('rule_matched');
      });
    });

    it('should handle "in" operator', async () => {
      const flagWithIn = {
        ...mockFeatureFlag,
        rules: [{ id: 'rule_1', attribute: 'country', operator: 'in' as const, value: ['US', 'CA', 'UK'] }],
      };
      mockedApi.getFlags.mockResolvedValueOnce([flagWithIn]);

      render(
        <FeatureFlagProvider refreshInterval={0} context={{ userId: 'user_123', country: 'US' }}>
          <EvaluationConsumer flagKey={flagWithIn.key} />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('reason')).toHaveTextContent('rule_matched');
      });
    });

    it('should handle numeric comparison operators', async () => {
      const flagWithGte = {
        ...mockFeatureFlag,
        rules: [{ id: 'rule_1', attribute: 'age', operator: 'gte' as const, value: 18 }],
      };
      mockedApi.getFlags.mockResolvedValueOnce([flagWithGte]);

      render(
        <FeatureFlagProvider refreshInterval={0} context={{ userId: 'user_123', age: 21 }}>
          <EvaluationConsumer flagKey={flagWithGte.key} />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('reason')).toHaveTextContent('rule_matched');
      });
    });
  });

  describe('variant selection', () => {
    it('should select variant based on user ID hash', async () => {
      mockedApi.getFlags.mockResolvedValueOnce([mockVariantFlag]);

      render(
        <FeatureFlagProvider refreshInterval={0} context={{ userId: 'user_123' }}>
          <EvaluationConsumer flagKey={mockVariantFlag.key} />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('enabled')).toHaveTextContent('true');
      });

      // Variant should be selected (deterministic based on hash)
      expect(screen.getByTestId('variant')).not.toHaveTextContent('none');
    });

    it('should return first variant when no userId provided', async () => {
      mockedApi.getFlags.mockResolvedValueOnce([mockVariantFlag]);

      render(
        <FeatureFlagProvider refreshInterval={0}>
          <EvaluationConsumer flagKey={mockVariantFlag.key} />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('enabled')).toHaveTextContent('true');
      });

      expect(screen.getByTestId('variant')).toHaveTextContent('control');
    });

    it('should return no variant for flags without variants', async () => {
      mockedApi.getFlags.mockResolvedValueOnce([mockFeatureFlag]);

      render(
        <FeatureFlagProvider refreshInterval={0} context={{ userId: 'user_123' }}>
          <EvaluationConsumer flagKey={mockFeatureFlag.key} />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('variant')).toHaveTextContent('none');
      });
    });
  });

  describe('manual refresh', () => {
    it('should allow manual refresh', async () => {
      mockedApi.getFlags.mockResolvedValue(mockFeatureFlags);

      render(
        <FeatureFlagProvider refreshInterval={0}>
          <TestConsumer />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(mockedApi.getFlags).toHaveBeenCalledTimes(1);
      });

      const refreshButton = screen.getByTestId('refresh');
      await act(async () => {
        refreshButton.click();
        // Wait for refresh to complete
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      await waitFor(() => {
        expect(mockedApi.getFlags).toHaveBeenCalledTimes(2);
      });
    });
  });
});
