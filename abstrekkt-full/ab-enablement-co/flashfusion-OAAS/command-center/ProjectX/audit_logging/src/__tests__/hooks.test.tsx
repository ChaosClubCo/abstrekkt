/**
 * Tests for audit logging hooks
 *
 * Tests useAuditLog, useAuditLogs, useAuditStats, useUniqueActions,
 * useUniqueResources, useExportAuditLogs, useLogActivity
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import {
  useAuditLog,
  useAuditLogs,
  useAuditStats,
  useUniqueActions,
  useUniqueResources,
  useExportAuditLogs,
  useLogActivity,
} from '../hooks';
import { AuditLogProvider } from '../components/AuditLogProvider';
import * as api from '../api';
import {
  mockSearchResult,
  mockEmptySearchResult,
  mockAuditStats,
  mockUniqueActions,
  mockUniqueResources,
  mockDefaultSearchParams,
  mockFilteredSearchParams,
  mockCreateLoginInput,
  mockUserLoginEntry,
  createMockBlob,
  mockCsvExportContent,
  mockNetworkError,
} from './fixtures';

// Mock the API module
vi.mock('../api');

const mockedApi = vi.mocked(api);

// Create a wrapper with QueryClientProvider for testing hooks
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

// Create a wrapper with AuditLogProvider for useAuditLog tests
function createAuditLogProviderWrapper(options: { maskSensitive?: boolean; sensitiveFields?: string[] } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuditLogProvider
          maskSensitive={options.maskSensitive}
          sensitiveFields={options.sensitiveFields}
        >
          {children}
        </AuditLogProvider>
      </QueryClientProvider>
    );
  };
}

describe('useAuditLog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // Context Access Tests
  // ===========================================================================

  describe('Context Access', () => {
    it('should throw error when used outside AuditLogProvider', () => {
      // Suppress console.error for expected error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuditLog(), {
          wrapper: createWrapper(),
        });
      }).toThrow('useAuditLog must be used within an AuditLogProvider');

      consoleSpy.mockRestore();
    });

    it('should return context when used within AuditLogProvider', () => {
      const { result } = renderHook(() => useAuditLog(), {
        wrapper: createAuditLogProviderWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.log).toBeDefined();
      expect(result.current.isLogging).toBeDefined();
    });

    it('should have log function', () => {
      const { result } = renderHook(() => useAuditLog(), {
        wrapper: createAuditLogProviderWrapper(),
      });

      expect(typeof result.current.log).toBe('function');
    });

    it('should have isLogging boolean', () => {
      const { result } = renderHook(() => useAuditLog(), {
        wrapper: createAuditLogProviderWrapper(),
      });

      expect(typeof result.current.isLogging).toBe('boolean');
      expect(result.current.isLogging).toBe(false);
    });
  });

  // ===========================================================================
  // Log Function Tests
  // ===========================================================================

  describe('Log Function', () => {
    it('should call createAuditLog API when log is called', async () => {
      mockedApi.createAuditLog.mockResolvedValue(mockUserLoginEntry);

      const { result } = renderHook(() => useAuditLog(), {
        wrapper: createAuditLogProviderWrapper(),
      });

      await act(async () => {
        await result.current.log(mockCreateLoginInput);
      });

      expect(mockedApi.createAuditLog).toHaveBeenCalled();
    });

    it('should set isLogging to true during log operation', async () => {
      let resolveLog: (value: any) => void;
      const logPromise = new Promise((resolve) => {
        resolveLog = resolve;
      });
      mockedApi.createAuditLog.mockReturnValue(logPromise as any);

      const { result } = renderHook(() => useAuditLog(), {
        wrapper: createAuditLogProviderWrapper(),
      });

      act(() => {
        result.current.log(mockCreateLoginInput);
      });

      await waitFor(() => {
        expect(result.current.isLogging).toBe(true);
      });

      await act(async () => {
        resolveLog!(mockUserLoginEntry);
      });

      await waitFor(() => {
        expect(result.current.isLogging).toBe(false);
      });
    });

    it('should mask sensitive data when maskSensitive is true', async () => {
      mockedApi.createAuditLog.mockResolvedValue(mockUserLoginEntry);

      const { result } = renderHook(() => useAuditLog(), {
        wrapper: createAuditLogProviderWrapper({ maskSensitive: true }),
      });

      const inputWithSensitiveData = {
        action: 'user.updated' as const,
        resource: 'users',
        metadata: {
          password: 'secretpassword123',
          normalField: 'visible',
        },
      };

      await act(async () => {
        await result.current.log(inputWithSensitiveData);
      });

      // Check that the API was called with masked data
      const callArg = mockedApi.createAuditLog.mock.calls[0][0];
      expect(callArg.metadata?.password).not.toBe('secretpassword123');
      expect(callArg.metadata?.normalField).toBe('visible');
    });

    it('should not mask data when maskSensitive is false', async () => {
      mockedApi.createAuditLog.mockResolvedValue(mockUserLoginEntry);

      const { result } = renderHook(() => useAuditLog(), {
        wrapper: createAuditLogProviderWrapper({ maskSensitive: false }),
      });

      const inputWithSensitiveData = {
        action: 'user.updated' as const,
        resource: 'users',
        metadata: {
          password: 'secretpassword123',
          normalField: 'visible',
        },
      };

      await act(async () => {
        await result.current.log(inputWithSensitiveData);
      });

      const callArg = mockedApi.createAuditLog.mock.calls[0][0];
      expect(callArg.metadata?.password).toBe('secretpassword123');
    });
  });
});

describe('useAuditLogs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // Data Fetching Tests
  // ===========================================================================

  describe('Data Fetching', () => {
    it('should fetch audit logs on mount', async () => {
      mockedApi.searchAuditLogs.mockResolvedValue(mockSearchResult);

      const { result } = renderHook(() => useAuditLogs(mockDefaultSearchParams), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockSearchResult);
      expect(mockedApi.searchAuditLogs).toHaveBeenCalledWith(mockDefaultSearchParams);
    });

    it('should return paginated data with meta information', async () => {
      mockedApi.searchAuditLogs.mockResolvedValue(mockSearchResult);

      const { result } = renderHook(() => useAuditLogs(mockDefaultSearchParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data?.meta.total).toBe(150);
      expect(result.current.data?.meta.page).toBe(1);
      expect(result.current.data?.meta.pageSize).toBe(25);
      expect(result.current.data?.meta.totalPages).toBe(6);
    });

    it('should handle empty results', async () => {
      mockedApi.searchAuditLogs.mockResolvedValue(mockEmptySearchResult);

      const { result } = renderHook(() => useAuditLogs(mockDefaultSearchParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data?.data).toHaveLength(0);
      expect(result.current.data?.meta.total).toBe(0);
    });

    it('should refetch when params change', async () => {
      mockedApi.searchAuditLogs.mockResolvedValue(mockSearchResult);

      const { result, rerender } = renderHook(
        ({ params }) => useAuditLogs(params),
        {
          wrapper: createWrapper(),
          initialProps: { params: mockDefaultSearchParams },
        }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockedApi.searchAuditLogs).toHaveBeenCalledTimes(1);

      // Change params
      rerender({ params: mockFilteredSearchParams });

      await waitFor(() => {
        expect(mockedApi.searchAuditLogs).toHaveBeenCalledTimes(2);
      });

      expect(mockedApi.searchAuditLogs).toHaveBeenLastCalledWith(mockFilteredSearchParams);
    });
  });

  // ===========================================================================
  // Error Handling Tests
  // ===========================================================================

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      mockedApi.searchAuditLogs.mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useAuditLogs(mockDefaultSearchParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.data).toBeUndefined();
    });

    it('should handle network errors', async () => {
      mockedApi.searchAuditLogs.mockRejectedValue(mockNetworkError);

      const { result } = renderHook(() => useAuditLogs(mockDefaultSearchParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });
});

describe('useAuditStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const tenantId = 'tenant-123';
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-01-15');

  // ===========================================================================
  // Data Fetching Tests
  // ===========================================================================

  describe('Data Fetching', () => {
    it('should fetch audit stats on mount', async () => {
      mockedApi.getAuditStats.mockResolvedValue(mockAuditStats);

      const { result } = renderHook(
        () => useAuditStats(tenantId, startDate, endDate),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockAuditStats);
      expect(mockedApi.getAuditStats).toHaveBeenCalledWith(tenantId, startDate, endDate);
    });

    it('should return stats with all required properties', async () => {
      mockedApi.getAuditStats.mockResolvedValue(mockAuditStats);

      const { result } = renderHook(
        () => useAuditStats(tenantId, startDate, endDate),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data?.totalEvents).toBe(1500);
      expect(result.current.data?.eventsByAction).toBeDefined();
      expect(result.current.data?.eventsByResource).toBeDefined();
      expect(result.current.data?.eventsByUser).toBeDefined();
      expect(result.current.data?.timeline).toBeDefined();
    });

    it('should refetch when date range changes', async () => {
      mockedApi.getAuditStats.mockResolvedValue(mockAuditStats);

      const newEndDate = new Date('2024-01-20');

      const { result, rerender } = renderHook(
        ({ end }) => useAuditStats(tenantId, startDate, end),
        {
          wrapper: createWrapper(),
          initialProps: { end: endDate },
        }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      rerender({ end: newEndDate });

      await waitFor(() => {
        expect(mockedApi.getAuditStats).toHaveBeenCalledTimes(2);
      });
    });
  });

  // ===========================================================================
  // Error Handling Tests
  // ===========================================================================

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      mockedApi.getAuditStats.mockRejectedValue(new Error('Stats unavailable'));

      const { result } = renderHook(
        () => useAuditStats(tenantId, startDate, endDate),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.data).toBeUndefined();
    });
  });
});

describe('useUniqueActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const tenantId = 'tenant-123';

  // ===========================================================================
  // Data Fetching Tests
  // ===========================================================================

  describe('Data Fetching', () => {
    it('should fetch unique actions on mount', async () => {
      mockedApi.getUniqueActions.mockResolvedValue(mockUniqueActions);

      const { result } = renderHook(() => useUniqueActions(tenantId), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockUniqueActions);
      expect(mockedApi.getUniqueActions).toHaveBeenCalledWith(tenantId);
    });

    it('should return array of actions', async () => {
      mockedApi.getUniqueActions.mockResolvedValue(mockUniqueActions);

      const { result } = renderHook(() => useUniqueActions(tenantId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(Array.isArray(result.current.data)).toBe(true);
      expect(result.current.data).toContain('user.login');
      expect(result.current.data).toContain('resource.created');
    });

    it('should handle empty actions list', async () => {
      mockedApi.getUniqueActions.mockResolvedValue([]);

      const { result } = renderHook(() => useUniqueActions(tenantId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual([]);
    });
  });

  // ===========================================================================
  // Error Handling Tests
  // ===========================================================================

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      mockedApi.getUniqueActions.mockRejectedValue(new Error('Failed to fetch actions'));

      const { result } = renderHook(() => useUniqueActions(tenantId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });
});

describe('useUniqueResources', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const tenantId = 'tenant-123';

  // ===========================================================================
  // Data Fetching Tests
  // ===========================================================================

  describe('Data Fetching', () => {
    it('should fetch unique resources on mount', async () => {
      mockedApi.getUniqueResources.mockResolvedValue(mockUniqueResources);

      const { result } = renderHook(() => useUniqueResources(tenantId), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockUniqueResources);
      expect(mockedApi.getUniqueResources).toHaveBeenCalledWith(tenantId);
    });

    it('should return array of resources', async () => {
      mockedApi.getUniqueResources.mockResolvedValue(mockUniqueResources);

      const { result } = renderHook(() => useUniqueResources(tenantId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(Array.isArray(result.current.data)).toBe(true);
      expect(result.current.data).toContain('auth');
      expect(result.current.data).toContain('users');
      expect(result.current.data).toContain('documents');
    });

    it('should handle empty resources list', async () => {
      mockedApi.getUniqueResources.mockResolvedValue([]);

      const { result } = renderHook(() => useUniqueResources(tenantId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual([]);
    });
  });

  // ===========================================================================
  // Error Handling Tests
  // ===========================================================================

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      mockedApi.getUniqueResources.mockRejectedValue(new Error('Failed to fetch resources'));

      const { result } = renderHook(() => useUniqueResources(tenantId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });
});

describe('useExportAuditLogs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ===========================================================================
  // Export Function Tests
  // ===========================================================================

  describe('Export Function', () => {
    it('should return exportLogs function', () => {
      const { result } = renderHook(() => useExportAuditLogs(), {
        wrapper: createWrapper(),
      });

      expect(result.current.exportLogs).toBeDefined();
      expect(typeof result.current.exportLogs).toBe('function');
    });

    it('should return isExporting boolean', () => {
      const { result } = renderHook(() => useExportAuditLogs(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isExporting).toBeDefined();
      expect(result.current.isExporting).toBe(false);
    });

    it('should call exportAuditLogs API with correct params', async () => {
      const mockBlob = createMockBlob(mockCsvExportContent, 'text/csv');
      mockedApi.exportAuditLogs.mockResolvedValue(mockBlob);

      // Mock document methods for download trigger
      const mockCreateElement = vi.spyOn(document, 'createElement');
      const mockAppendChild = vi.spyOn(document.body, 'appendChild').mockImplementation(() => document.body);
      const mockRemoveChild = vi.spyOn(document.body, 'removeChild').mockImplementation(() => document.body);

      const mockAnchor = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      mockCreateElement.mockReturnValue(mockAnchor as any);

      const { result } = renderHook(() => useExportAuditLogs(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.exportLogs(mockDefaultSearchParams, 'csv');
      });

      expect(mockedApi.exportAuditLogs).toHaveBeenCalledWith(mockDefaultSearchParams, 'csv');

      mockCreateElement.mockRestore();
      mockAppendChild.mockRestore();
      mockRemoveChild.mockRestore();
    });

    it('should trigger download with correct filename', async () => {
      const mockBlob = createMockBlob(mockCsvExportContent, 'text/csv');
      mockedApi.exportAuditLogs.mockResolvedValue(mockBlob);

      const mockAnchor = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      const mockCreateElement = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
      const mockAppendChild = vi.spyOn(document.body, 'appendChild').mockImplementation(() => document.body);
      const mockRemoveChild = vi.spyOn(document.body, 'removeChild').mockImplementation(() => document.body);

      const { result } = renderHook(() => useExportAuditLogs(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.exportLogs(mockDefaultSearchParams, 'csv', 'custom-export.csv');
      });

      expect(mockAnchor.download).toBe('custom-export.csv');
      expect(mockAnchor.click).toHaveBeenCalled();

      mockCreateElement.mockRestore();
      mockAppendChild.mockRestore();
      mockRemoveChild.mockRestore();
    });

    it('should set isExporting to true during export', async () => {
      let resolveExport: (value: Blob) => void;
      const exportPromise = new Promise<Blob>((resolve) => {
        resolveExport = resolve;
      });
      mockedApi.exportAuditLogs.mockReturnValue(exportPromise);

      const mockAnchor = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => document.body);
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => document.body);

      const { result } = renderHook(() => useExportAuditLogs(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.exportLogs(mockDefaultSearchParams, 'csv');
      });

      await waitFor(() => {
        expect(result.current.isExporting).toBe(true);
      });

      const mockBlob = createMockBlob(mockCsvExportContent, 'text/csv');
      await act(async () => {
        resolveExport!(mockBlob);
      });

      await waitFor(() => {
        expect(result.current.isExporting).toBe(false);
      });
    });
  });

  // ===========================================================================
  // Error Handling Tests
  // ===========================================================================

  describe('Error Handling', () => {
    it('should handle export errors', async () => {
      mockedApi.exportAuditLogs.mockRejectedValue(new Error('Export failed'));

      const { result } = renderHook(() => useExportAuditLogs(), {
        wrapper: createWrapper(),
      });

      // The mutation should throw
      await expect(
        act(async () => {
          await result.current.exportLogs(mockDefaultSearchParams, 'csv');
        })
      ).rejects.toThrow('Export failed');

      // After the error, isExporting should be false
      expect(result.current.isExporting).toBe(false);
    });
  });
});

describe('useLogActivity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // Log Function Tests
  // ===========================================================================

  describe('Log Function', () => {
    it('should return log function', () => {
      const { result } = renderHook(() => useLogActivity(), {
        wrapper: createWrapper(),
      });

      expect(result.current.log).toBeDefined();
      expect(typeof result.current.log).toBe('function');
    });

    it('should return isLogging boolean', () => {
      const { result } = renderHook(() => useLogActivity(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLogging).toBeDefined();
      expect(result.current.isLogging).toBe(false);
    });

    it('should call createAuditLog API when log is called', async () => {
      mockedApi.createAuditLog.mockResolvedValue(mockUserLoginEntry);

      const { result } = renderHook(() => useLogActivity(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.log(mockCreateLoginInput);
      });

      // React Query mutation passes additional context as second arg
      expect(mockedApi.createAuditLog).toHaveBeenCalled();
      expect(mockedApi.createAuditLog.mock.calls[0][0]).toEqual(mockCreateLoginInput);
    });

    it('should return created audit log entry', async () => {
      mockedApi.createAuditLog.mockResolvedValue(mockUserLoginEntry);

      const { result } = renderHook(() => useLogActivity(), {
        wrapper: createWrapper(),
      });

      let logResult: any;
      await act(async () => {
        logResult = await result.current.log(mockCreateLoginInput);
      });

      expect(logResult).toEqual(mockUserLoginEntry);
    });

    it('should set isLogging to true during log operation', async () => {
      let resolveLog: (value: any) => void;
      const logPromise = new Promise((resolve) => {
        resolveLog = resolve;
      });
      mockedApi.createAuditLog.mockReturnValue(logPromise as any);

      const { result } = renderHook(() => useLogActivity(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.log(mockCreateLoginInput);
      });

      await waitFor(() => {
        expect(result.current.isLogging).toBe(true);
      });

      await act(async () => {
        resolveLog!(mockUserLoginEntry);
      });

      await waitFor(() => {
        expect(result.current.isLogging).toBe(false);
      });
    });

    it('should invalidate auditLogs queries after logging', async () => {
      mockedApi.createAuditLog.mockResolvedValue(mockUserLoginEntry);
      mockedApi.searchAuditLogs.mockResolvedValue(mockSearchResult);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: 0, staleTime: 0 },
          mutations: { retry: false },
        },
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      // First, fetch audit logs to populate the cache
      const { result: logsResult } = renderHook(
        () => useAuditLogs(mockDefaultSearchParams),
        { wrapper }
      );

      await waitFor(() => {
        expect(logsResult.current.isLoading).toBe(false);
      });

      // Now use logActivity
      const { result: logResult } = renderHook(() => useLogActivity(), { wrapper });

      mockedApi.searchAuditLogs.mockClear();

      await act(async () => {
        await logResult.current.log(mockCreateLoginInput);
      });

      // Query should be invalidated and refetched
      await waitFor(() => {
        expect(mockedApi.searchAuditLogs).toHaveBeenCalled();
      });
    });
  });

  // ===========================================================================
  // Error Handling Tests
  // ===========================================================================

  describe('Error Handling', () => {
    it('should handle log errors', async () => {
      mockedApi.createAuditLog.mockRejectedValue(new Error('Log failed'));

      const { result } = renderHook(() => useLogActivity(), {
        wrapper: createWrapper(),
      });

      await expect(
        act(async () => {
          await result.current.log(mockCreateLoginInput);
        })
      ).rejects.toThrow('Log failed');
    });
  });
});

// ===========================================================================
// Integration Tests
// ===========================================================================

describe('Hook Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow using useAuditLogs and useUniqueActions hooks', async () => {
    mockedApi.searchAuditLogs.mockResolvedValue(mockSearchResult);
    mockedApi.getUniqueActions.mockResolvedValue(mockUniqueActions);

    // Test useAuditLogs
    const { result: logsResult } = renderHook(
      () => useAuditLogs(mockDefaultSearchParams),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(logsResult.current.isLoading).toBe(false);
    });
    expect(logsResult.current.data?.data).toHaveLength(mockSearchResult.data.length);

    // Test useUniqueActions
    const { result: actionsResult } = renderHook(
      () => useUniqueActions('tenant-123'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(actionsResult.current.isLoading).toBe(false);
    });
    expect(actionsResult.current.data).toContain('user.login');
  });

  it('should allow using useUniqueResources hook', async () => {
    mockedApi.getUniqueResources.mockResolvedValue(mockUniqueResources);

    const { result: resourcesResult } = renderHook(
      () => useUniqueResources('tenant-123'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(resourcesResult.current.isLoading).toBe(false);
    });
    expect(resourcesResult.current.data).toContain('auth');
    expect(resourcesResult.current.data).toContain('users');
  });

  it('should handle errors in individual hooks without affecting others', async () => {
    mockedApi.searchAuditLogs.mockResolvedValue(mockSearchResult);

    // Test logs hook - should succeed
    const { result: logsResult } = renderHook(
      () => useAuditLogs(mockDefaultSearchParams),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(logsResult.current.isLoading).toBe(false);
    });

    expect(logsResult.current.data).toBeDefined();
    expect(logsResult.current.error).toBeNull();
  });

  it('should handle hook failure gracefully', async () => {
    mockedApi.getUniqueActions.mockRejectedValue(new Error('Actions error'));

    const { result } = renderHook(
      () => useUniqueActions('tenant-123'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeTruthy();
  });
});
