import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useFeatureFlagContext,
  useFeatureFlag,
  useFeatureFlags,
  useFeatureFlagVariant,
} from '../hooks';
import { FeatureFlagContext } from '../components/FeatureFlagProvider';
import * as api from '../api';
import {
  mockFeatureFlag,
  mockFeatureFlags,
  mockCreateFlagInput,
  mockUpdateFlagInput,
  mockEnabledEvaluation,
  mockDisabledEvaluation,
} from './fixtures';
import type { FeatureFlagContextValue } from '../types';

vi.mock('../api');

const mockedApi = vi.mocked(api);

function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

function createContextWrapper(contextValue: FeatureFlagContextValue) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <FeatureFlagContext.Provider value={contextValue}>
        {children}
      </FeatureFlagContext.Provider>
    );
  };
}

describe('Feature Flag Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useFeatureFlagContext', () => {
    it('should return context value when inside provider', () => {
      const mockContext: FeatureFlagContextValue = {
        flags: new Map([[mockFeatureFlag.key, mockFeatureFlag]]),
        isLoading: false,
        evaluate: vi.fn().mockReturnValue(mockEnabledEvaluation),
        refresh: vi.fn(),
      };

      const { result } = renderHook(() => useFeatureFlagContext(), {
        wrapper: createContextWrapper(mockContext),
      });

      expect(result.current.flags).toBe(mockContext.flags);
      expect(result.current.isLoading).toBe(false);
    });

    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useFeatureFlagContext());
      }).toThrow('useFeatureFlagContext must be used within a FeatureFlagProvider');
    });

    it('should expose evaluate function', () => {
      const evaluate = vi.fn().mockReturnValue(mockEnabledEvaluation);
      const mockContext: FeatureFlagContextValue = {
        flags: new Map(),
        isLoading: false,
        evaluate,
        refresh: vi.fn(),
      };

      const { result } = renderHook(() => useFeatureFlagContext(), {
        wrapper: createContextWrapper(mockContext),
      });

      result.current.evaluate('test_flag');

      expect(evaluate).toHaveBeenCalledWith('test_flag');
    });

    it('should expose refresh function', async () => {
      const refresh = vi.fn().mockResolvedValue(undefined);
      const mockContext: FeatureFlagContextValue = {
        flags: new Map(),
        isLoading: false,
        evaluate: vi.fn(),
        refresh,
      };

      const { result } = renderHook(() => useFeatureFlagContext(), {
        wrapper: createContextWrapper(mockContext),
      });

      await result.current.refresh();

      expect(refresh).toHaveBeenCalled();
    });
  });

  describe('useFeatureFlag', () => {
    it('should return enabled status for a flag', () => {
      const evaluate = vi.fn().mockReturnValue(mockEnabledEvaluation);
      const mockContext: FeatureFlagContextValue = {
        flags: new Map(),
        isLoading: false,
        evaluate,
        refresh: vi.fn(),
      };

      const { result } = renderHook(() => useFeatureFlag('new_dashboard'), {
        wrapper: createContextWrapper(mockContext),
      });

      expect(result.current.enabled).toBe(true);
      expect(result.current.reason).toBe('default_enabled');
    });

    it('should return disabled status for disabled flag', () => {
      const evaluate = vi.fn().mockReturnValue(mockDisabledEvaluation);
      const mockContext: FeatureFlagContextValue = {
        flags: new Map(),
        isLoading: false,
        evaluate,
        refresh: vi.fn(),
      };

      const { result } = renderHook(() => useFeatureFlag('disabled_feature'), {
        wrapper: createContextWrapper(mockContext),
      });

      expect(result.current.enabled).toBe(false);
      expect(result.current.reason).toBe('flag_disabled');
    });

    it('should return variant when present', () => {
      const evaluate = vi.fn().mockReturnValue({ enabled: true, variant: 'treatment', reason: 'rule_matched' });
      const mockContext: FeatureFlagContextValue = {
        flags: new Map(),
        isLoading: false,
        evaluate,
        refresh: vi.fn(),
      };

      const { result } = renderHook(() => useFeatureFlag('ab_test'), {
        wrapper: createContextWrapper(mockContext),
      });

      expect(result.current.variant).toBe('treatment');
    });

    it('should reflect loading state', () => {
      const mockContext: FeatureFlagContextValue = {
        flags: new Map(),
        isLoading: true,
        evaluate: vi.fn().mockReturnValue(mockDisabledEvaluation),
        refresh: vi.fn(),
      };

      const { result } = renderHook(() => useFeatureFlag('new_dashboard'), {
        wrapper: createContextWrapper(mockContext),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('useFeatureFlags (admin)', () => {
    it('should fetch flags on mount', async () => {
      mockedApi.getFlags.mockResolvedValueOnce(mockFeatureFlags);

      const { result } = renderHook(() => useFeatureFlags(), { wrapper: createQueryWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.flags).toEqual(mockFeatureFlags);
    });

    it('should return empty array initially', async () => {
      mockedApi.getFlags.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useFeatureFlags(), { wrapper: createQueryWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.flags).toEqual([]);
    });

    it('should expose createFlag mutation', async () => {
      mockedApi.getFlags.mockResolvedValueOnce([]);
      mockedApi.createFlag.mockResolvedValueOnce(mockFeatureFlag);

      const { result } = renderHook(() => useFeatureFlags(), { wrapper: createQueryWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.createFlag(mockCreateFlagInput);
      });

      expect(mockedApi.createFlag).toHaveBeenCalledWith(mockCreateFlagInput, expect.anything());
    });

    it('should expose updateFlag mutation', async () => {
      mockedApi.getFlags.mockResolvedValueOnce(mockFeatureFlags);
      mockedApi.updateFlag.mockResolvedValueOnce({ ...mockFeatureFlag, name: 'Updated' });

      const { result } = renderHook(() => useFeatureFlags(), { wrapper: createQueryWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateFlag({ key: 'new_dashboard', input: mockUpdateFlagInput });
      });

      expect(mockedApi.updateFlag).toHaveBeenCalledWith('new_dashboard', mockUpdateFlagInput);
    });

    it('should expose deleteFlag mutation', async () => {
      mockedApi.getFlags.mockResolvedValueOnce(mockFeatureFlags);
      mockedApi.deleteFlag.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useFeatureFlags(), { wrapper: createQueryWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.deleteFlag('new_dashboard');
      });

      expect(mockedApi.deleteFlag).toHaveBeenCalledWith('new_dashboard', expect.anything());
    });

    it('should expose toggleFlag mutation', async () => {
      mockedApi.getFlags.mockResolvedValueOnce(mockFeatureFlags);
      mockedApi.toggleFlag.mockResolvedValueOnce({ ...mockFeatureFlag, enabled: false });

      const { result } = renderHook(() => useFeatureFlags(), { wrapper: createQueryWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.toggleFlag({ key: 'new_dashboard', enabled: false });
      });

      expect(mockedApi.toggleFlag).toHaveBeenCalledWith('new_dashboard', false);
    });

    it('should track isCreating state', async () => {
      mockedApi.getFlags.mockResolvedValueOnce([]);
      let resolveCreate: (value: typeof mockFeatureFlag) => void;
      mockedApi.createFlag.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveCreate = resolve;
        })
      );

      const { result } = renderHook(() => useFeatureFlags(), { wrapper: createQueryWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isCreating).toBe(false);

      act(() => {
        result.current.createFlag(mockCreateFlagInput);
      });

      await waitFor(() => {
        expect(result.current.isCreating).toBe(true);
      });

      await act(async () => {
        resolveCreate!(mockFeatureFlag);
      });

      await waitFor(() => {
        expect(result.current.isCreating).toBe(false);
      });
    });
  });

  describe('useFeatureFlagVariant', () => {
    it('should return variant for A/B test flag', () => {
      const evaluate = vi.fn().mockReturnValue({ enabled: true, variant: 'treatment', reason: 'default_enabled' });
      const mockContext: FeatureFlagContextValue = {
        flags: new Map(),
        isLoading: false,
        evaluate,
        refresh: vi.fn(),
      };

      const { result } = renderHook(() => useFeatureFlagVariant('ab_test'), {
        wrapper: createContextWrapper(mockContext),
      });

      expect(result.current.variant).toBe('treatment');
    });

    it('should return "control" as default variant when none specified', () => {
      const evaluate = vi.fn().mockReturnValue({ enabled: true, reason: 'default_enabled' });
      const mockContext: FeatureFlagContextValue = {
        flags: new Map(),
        isLoading: false,
        evaluate,
        refresh: vi.fn(),
      };

      const { result } = renderHook(() => useFeatureFlagVariant('simple_flag'), {
        wrapper: createContextWrapper(mockContext),
      });

      expect(result.current.variant).toBe('control');
    });

    it('should reflect loading state', () => {
      const mockContext: FeatureFlagContextValue = {
        flags: new Map(),
        isLoading: true,
        evaluate: vi.fn().mockReturnValue({ enabled: false, reason: 'flag_disabled' }),
        refresh: vi.fn(),
      };

      const { result } = renderHook(() => useFeatureFlagVariant('ab_test'), {
        wrapper: createContextWrapper(mockContext),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });
});
