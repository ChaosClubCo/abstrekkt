/**
 * Tests for IP Whitelisting hooks
 *
 * Tests all React hooks for IP access, rules management, config, grace periods,
 * session binding, and CIDR validation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useIPAccess,
  useIPRules,
  useIPWhitelistConfig,
  useAccessAttempts,
  useGeoLocation,
  useMyIP,
  useGracePeriod,
  useSessionBinding,
  useCIDRValidation,
} from '../hooks';
import * as api from '../api';
import {
  mockRules,
  mockIPRule,
  mockConfig,
  mockAccessAllowed,
  mockAccessDenied,
  mockGeoLocation,
  mockAccessAttempts,
  mockPendingGraceRequests,
  mockGracePeriodRequest,
  mockSessionIPInfo,
  mockBoundSessionIPInfo,
  mockMyIP,
  mockCreateRuleInput,
} from './fixtures';

// Mock the API module
vi.mock('../api', () => ({
  checkIPAccess: vi.fn(),
  checkIPAccessForAddress: vi.fn(),
  getConfig: vi.fn(),
  updateConfig: vi.fn(),
  getRules: vi.fn(),
  createRule: vi.fn(),
  updateRule: vi.fn(),
  deleteRule: vi.fn(),
  toggleRule: vi.fn(),
  getAccessAttempts: vi.fn(),
  getGeoLocation: vi.fn(),
  getGracePeriodRequests: vi.fn(),
  createGracePeriodRequest: vi.fn(),
  reviewGracePeriodRequest: vi.fn(),
  getSessionIPInfo: vi.fn(),
  bindSessionToIP: vi.fn(),
  validateCIDR: vi.fn(),
  getMyIP: vi.fn(),
}));

const mockedApi = vi.mocked(api);

// Create a wrapper with React Query provider
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useIPAccess Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    mockedApi.checkIPAccess.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useIPAccess(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAllowed).toBe(true); // Default to true
  });

  it('should return allowed access when IP is permitted', async () => {
    mockedApi.checkIPAccess.mockResolvedValue(mockAccessAllowed);

    const { result } = renderHook(() => useIPAccess(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAllowed).toBe(true);
    expect(result.current.reason).toBe('IP address matches allow rule');
    expect(result.current.ipAddress).toBe('192.168.1.100');
    expect(result.current.geoLocation).toEqual(mockGeoLocation);
    expect(result.current.requiresApproval).toBe(false);
  });

  it('should return denied access when IP is blocked', async () => {
    mockedApi.checkIPAccess.mockResolvedValue(mockAccessDenied);

    const { result } = renderHook(() => useIPAccess(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAllowed).toBe(false);
    expect(result.current.reason).toBe('IP address not in allowlist');
    expect(result.current.requiresApproval).toBe(false);
  });

  it('should return matched rule when access is allowed', async () => {
    mockedApi.checkIPAccess.mockResolvedValue(mockAccessAllowed);

    const { result } = renderHook(() => useIPAccess(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.matchedRule).toEqual(mockIPRule);
  });

  it('should expose refetch function', async () => {
    mockedApi.checkIPAccess.mockResolvedValue(mockAccessAllowed);

    const { result } = renderHook(() => useIPAccess(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe('function');
  });
});

describe('useIPRules Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    mockedApi.getRules.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useIPRules(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.rules).toEqual([]);
  });

  it('should return rules when loaded', async () => {
    mockedApi.getRules.mockResolvedValue(mockRules);

    const { result } = renderHook(() => useIPRules(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.rules).toEqual(mockRules);
    expect(result.current.rules).toHaveLength(5);
  });

  it('should create a new rule', async () => {
    const newRule = { ...mockIPRule, id: 'new-rule-1', ...mockCreateRuleInput };
    mockedApi.getRules.mockResolvedValue(mockRules);
    mockedApi.createRule.mockResolvedValue(newRule);

    const { result } = renderHook(() => useIPRules(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.createRule(mockCreateRuleInput);
    });

    expect(mockedApi.createRule).toHaveBeenCalledWith(mockCreateRuleInput);
  });

  it('should show creating state during rule creation', async () => {
    mockedApi.getRules.mockResolvedValue(mockRules);
    mockedApi.createRule.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useIPRules(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.createRule(mockCreateRuleInput);
    });

    await waitFor(() => {
      expect(result.current.isCreating).toBe(true);
    });
  });

  it('should delete a rule', async () => {
    mockedApi.getRules.mockResolvedValue(mockRules);
    mockedApi.deleteRule.mockResolvedValue(undefined);

    const { result } = renderHook(() => useIPRules(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteRule('rule-1');
    });

    expect(mockedApi.deleteRule).toHaveBeenCalledWith('rule-1');
  });

  it('should toggle a rule', async () => {
    mockedApi.getRules.mockResolvedValue(mockRules);
    mockedApi.toggleRule.mockResolvedValue({ ...mockIPRule, enabled: false });

    const { result } = renderHook(() => useIPRules(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.toggleRule('rule-1', false);
    });

    expect(mockedApi.toggleRule).toHaveBeenCalledWith('rule-1', false);
  });

  it('should update a rule', async () => {
    mockedApi.getRules.mockResolvedValue(mockRules);
    mockedApi.updateRule.mockResolvedValue({ ...mockIPRule, label: 'Updated Label' });

    const { result } = renderHook(() => useIPRules(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateRule('rule-1', { label: 'Updated Label' });
    });

    expect(mockedApi.updateRule).toHaveBeenCalledWith('rule-1', { label: 'Updated Label' });
  });
});

describe('useIPWhitelistConfig Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    mockedApi.getConfig.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useIPWhitelistConfig(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.config).toBeUndefined();
  });

  it('should return config when loaded', async () => {
    mockedApi.getConfig.mockResolvedValue(mockConfig);

    const { result } = renderHook(() => useIPWhitelistConfig(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.config).toEqual(mockConfig);
    expect(result.current.config?.enabled).toBe(true);
  });

  it('should update config', async () => {
    mockedApi.getConfig.mockResolvedValue(mockConfig);
    mockedApi.updateConfig.mockResolvedValue({ ...mockConfig, enabled: false });

    const { result } = renderHook(() => useIPWhitelistConfig(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateConfig({ enabled: false });
    });

    expect(mockedApi.updateConfig).toHaveBeenCalledWith({ enabled: false });
  });

  it('should show updating state during config update', async () => {
    mockedApi.getConfig.mockResolvedValue(mockConfig);
    mockedApi.updateConfig.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useIPWhitelistConfig(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateConfig({ enabled: false });
    });

    await waitFor(() => {
      expect(result.current.isUpdating).toBe(true);
    });
  });
});

describe('useAccessAttempts Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch access attempts without query', async () => {
    mockedApi.getAccessAttempts.mockResolvedValue(mockAccessAttempts);

    const { result } = renderHook(() => useAccessAttempts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockAccessAttempts);
    expect(mockedApi.getAccessAttempts).toHaveBeenCalledWith(undefined);
  });

  it('should fetch access attempts with query filters', async () => {
    const query = { userId: 'user-1', action: 'allow' as const };
    mockedApi.getAccessAttempts.mockResolvedValue([mockAccessAttempts[0]]);

    const { result } = renderHook(() => useAccessAttempts(query), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockedApi.getAccessAttempts).toHaveBeenCalledWith(query);
    expect(result.current.data).toHaveLength(1);
  });
});

describe('useGeoLocation Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch geolocation for current IP', async () => {
    mockedApi.getGeoLocation.mockResolvedValue(mockGeoLocation);

    const { result } = renderHook(() => useGeoLocation(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockGeoLocation);
    expect(mockedApi.getGeoLocation).toHaveBeenCalledWith(undefined);
  });

  it('should fetch geolocation for specific IP', async () => {
    mockedApi.getGeoLocation.mockResolvedValue(mockGeoLocation);

    const { result } = renderHook(() => useGeoLocation('8.8.8.8'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockedApi.getGeoLocation).toHaveBeenCalledWith('8.8.8.8');
  });
});

describe('useMyIP Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch current IP with geolocation', async () => {
    mockedApi.getMyIP.mockResolvedValue(mockMyIP);

    const { result } = renderHook(() => useMyIP(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockMyIP);
    expect(result.current.data?.ip).toBe('192.168.1.100');
  });
});

describe('useGracePeriod Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    mockedApi.getGracePeriodRequests.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useGracePeriod(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.pendingRequests).toEqual([]);
  });

  it('should return pending requests when loaded', async () => {
    mockedApi.getGracePeriodRequests.mockResolvedValue(mockPendingGraceRequests);

    const { result } = renderHook(() => useGracePeriod(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pendingRequests).toEqual(mockPendingGraceRequests);
    expect(mockedApi.getGracePeriodRequests).toHaveBeenCalledWith('pending');
  });

  it('should create a grace period request', async () => {
    mockedApi.getGracePeriodRequests.mockResolvedValue([]);
    mockedApi.createGracePeriodRequest.mockResolvedValue(mockGracePeriodRequest);

    const { result } = renderHook(() => useGracePeriod(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.requestAccess('Working from home');
    });

    expect(mockedApi.createGracePeriodRequest).toHaveBeenCalledWith('Working from home');
  });

  it('should show requesting state during request creation', async () => {
    mockedApi.getGracePeriodRequests.mockResolvedValue([]);
    mockedApi.createGracePeriodRequest.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useGracePeriod(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.requestAccess('Test reason');
    });

    await waitFor(() => {
      expect(result.current.isRequesting).toBe(true);
    });
  });

  it('should approve a grace period request', async () => {
    const approvedRequest = { ...mockGracePeriodRequest, status: 'approved' as const };
    mockedApi.getGracePeriodRequests.mockResolvedValue(mockPendingGraceRequests);
    mockedApi.reviewGracePeriodRequest.mockResolvedValue(approvedRequest);

    const { result } = renderHook(() => useGracePeriod(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.reviewRequest('grace-1', 'approve');
    });

    expect(mockedApi.reviewGracePeriodRequest).toHaveBeenCalledWith('grace-1', 'approve');
  });

  it('should deny a grace period request', async () => {
    const deniedRequest = { ...mockGracePeriodRequest, status: 'denied' as const };
    mockedApi.getGracePeriodRequests.mockResolvedValue(mockPendingGraceRequests);
    mockedApi.reviewGracePeriodRequest.mockResolvedValue(deniedRequest);

    const { result } = renderHook(() => useGracePeriod(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.reviewRequest('grace-1', 'deny');
    });

    expect(mockedApi.reviewGracePeriodRequest).toHaveBeenCalledWith('grace-1', 'deny');
  });

  it('should show reviewing state during request review', async () => {
    mockedApi.getGracePeriodRequests.mockResolvedValue(mockPendingGraceRequests);
    mockedApi.reviewGracePeriodRequest.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useGracePeriod(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.reviewRequest('grace-1', 'approve');
    });

    await waitFor(() => {
      expect(result.current.isReviewing).toBe(true);
    });
  });
});

describe('useSessionBinding Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    mockedApi.getSessionIPInfo.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useSessionBinding(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.sessionInfo).toBeUndefined();
  });

  it('should return session info when loaded', async () => {
    mockedApi.getSessionIPInfo.mockResolvedValue(mockSessionIPInfo);

    const { result } = renderHook(() => useSessionBinding(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sessionInfo).toEqual(mockSessionIPInfo);
    expect(result.current.sessionInfo?.isBound).toBe(false);
  });

  it('should bind session to IP', async () => {
    mockedApi.getSessionIPInfo.mockResolvedValue(mockSessionIPInfo);
    mockedApi.bindSessionToIP.mockResolvedValue(mockBoundSessionIPInfo);

    const { result } = renderHook(() => useSessionBinding(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.bindToIP();
    });

    expect(mockedApi.bindSessionToIP).toHaveBeenCalled();
  });

  it('should show binding state during bind operation', async () => {
    mockedApi.getSessionIPInfo.mockResolvedValue(mockSessionIPInfo);
    mockedApi.bindSessionToIP.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useSessionBinding(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.bindToIP();
    });

    await waitFor(() => {
      expect(result.current.isBinding).toBe(true);
    });
  });
});

describe('useCIDRValidation Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate a valid CIDR', async () => {
    mockedApi.validateCIDR.mockResolvedValue({ valid: true });

    const { result } = renderHook(() => useCIDRValidation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const validationResult = await result.current.validate('192.168.1.0/24');
      expect(validationResult.valid).toBe(true);
    });

    expect(mockedApi.validateCIDR).toHaveBeenCalledWith('192.168.1.0/24');
  });

  it('should return invalid for incorrect CIDR', async () => {
    mockedApi.validateCIDR.mockResolvedValue({ valid: false, error: 'Invalid CIDR notation' });

    const { result } = renderHook(() => useCIDRValidation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const validationResult = await result.current.validate('invalid');
      expect(validationResult.valid).toBe(false);
      expect(validationResult.error).toBe('Invalid CIDR notation');
    });
  });

  it('should show validating state during validation', async () => {
    mockedApi.validateCIDR.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useCIDRValidation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.validate('192.168.1.0/24');
    });

    await waitFor(() => {
      expect(result.current.isValidating).toBe(true);
    });
  });

  it('should expose validation result', async () => {
    mockedApi.validateCIDR.mockResolvedValue({ valid: true });

    const { result } = renderHook(() => useCIDRValidation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.validate('10.0.0.0/8');
    });

    await waitFor(() => {
      expect(result.current.result).toEqual({ valid: true });
    });
  });
});
