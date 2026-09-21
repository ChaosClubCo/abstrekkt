/**
 * Tests for audit logging API functions
 *
 * Tests all API calls to the audit logging endpoints
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
  createAuditLog,
  searchAuditLogs,
  getAuditLog,
  exportAuditLogs,
  getAuditStats,
  getUniqueActions,
  getUniqueResources,
} from '../api';
import {
  mockUserLoginEntry,
  mockResourceCreatedEntry,
  mockSearchResult,
  mockEmptySearchResult,
  mockSecondPageResult,
  mockAuditStats,
  mockUniqueActions,
  mockUniqueResources,
  mockDefaultSearchParams,
  mockFilteredSearchParams,
  mockCreateLoginInput,
  mockCreateResourceInput,
  createMockBlob,
  mockCsvExportContent,
  mockJsonExportContent,
} from './fixtures';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('Audit Logging API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // createAuditLog Tests
  // ===========================================================================

  describe('createAuditLog', () => {
    it('should send POST request to correct endpoint', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockUserLoginEntry });

      await createAuditLog(mockCreateLoginInput);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/audit-logs', mockCreateLoginInput);
    });

    it('should return created audit log entry', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockUserLoginEntry });

      const result = await createAuditLog(mockCreateLoginInput);

      expect(result).toEqual(mockUserLoginEntry);
      expect(result.action).toBe('user.login');
      expect(result.resource).toBe('auth');
    });

    it('should create audit log with resource ID', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockResourceCreatedEntry });

      const result = await createAuditLog(mockCreateResourceInput);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/audit-logs', mockCreateResourceInput);
      expect(result.resourceId).toBe('doc-123');
    });

    it('should create audit log with metadata', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockUserLoginEntry });

      await createAuditLog(mockCreateLoginInput);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/audit-logs', {
        action: 'user.login',
        resource: 'auth',
        metadata: { method: 'password' },
      });
    });

    it('should throw error on API failure', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Server error'));

      await expect(createAuditLog(mockCreateLoginInput)).rejects.toThrow('Server error');
    });

    it('should handle 400 validation error', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Validation error', errors: ['action is required'] },
        },
      };
      mockedAxios.post.mockRejectedValue(error);

      await expect(createAuditLog({ action: '', resource: 'test' } as any)).rejects.toEqual(error);
    });

    it('should handle 401 unauthorized error', async () => {
      const error = {
        response: { status: 401, data: { message: 'Unauthorized' } },
      };
      mockedAxios.post.mockRejectedValue(error);

      await expect(createAuditLog(mockCreateLoginInput)).rejects.toEqual(error);
    });
  });

  // ===========================================================================
  // searchAuditLogs Tests
  // ===========================================================================

  describe('searchAuditLogs', () => {
    it('should send GET request to correct endpoint with params', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSearchResult });

      await searchAuditLogs(mockDefaultSearchParams);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/audit-logs', {
        params: mockDefaultSearchParams,
      });
    });

    it('should return paginated search results', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSearchResult });

      const result = await searchAuditLogs(mockDefaultSearchParams);

      expect(result.data).toHaveLength(mockSearchResult.data.length);
      expect(result.meta.total).toBe(150);
      expect(result.meta.page).toBe(1);
      expect(result.meta.pageSize).toBe(25);
      expect(result.meta.totalPages).toBe(6);
    });

    it('should return empty results when no matches', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockEmptySearchResult });

      const result = await searchAuditLogs(mockDefaultSearchParams);

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });

    it('should handle filtered search params', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSearchResult });

      await searchAuditLogs(mockFilteredSearchParams);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/audit-logs', {
        params: mockFilteredSearchParams,
      });
    });

    it('should handle pagination correctly', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSecondPageResult });

      const result = await searchAuditLogs({ ...mockDefaultSearchParams, page: 2 });

      expect(result.meta.page).toBe(2);
    });

    it('should handle sorting parameters', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSearchResult });

      await searchAuditLogs({
        ...mockDefaultSearchParams,
        sortBy: 'action',
        sortOrder: 'asc',
      });

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/audit-logs', {
        params: expect.objectContaining({
          sortBy: 'action',
          sortOrder: 'asc',
        }),
      });
    });

    it('should handle date range filters', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-15');

      mockedAxios.get.mockResolvedValue({ data: mockSearchResult });

      await searchAuditLogs({
        ...mockDefaultSearchParams,
        startDate,
        endDate,
      });

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/audit-logs', {
        params: expect.objectContaining({
          startDate,
          endDate,
        }),
      });
    });

    it('should handle search text filter', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSearchResult });

      await searchAuditLogs({
        ...mockDefaultSearchParams,
        search: 'login',
      });

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/audit-logs', {
        params: expect.objectContaining({
          search: 'login',
        }),
      });
    });

    it('should throw error on API failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(searchAuditLogs(mockDefaultSearchParams)).rejects.toThrow('Network error');
    });
  });

  // ===========================================================================
  // getAuditLog Tests
  // ===========================================================================

  describe('getAuditLog', () => {
    it('should send GET request to correct endpoint with ID', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockUserLoginEntry });

      await getAuditLog('audit-login-1');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/audit-logs/audit-login-1');
    });

    it('should return single audit log entry', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockUserLoginEntry });

      const result = await getAuditLog('audit-login-1');

      expect(result).toEqual(mockUserLoginEntry);
      expect(result.id).toBe('audit-login-1');
    });

    it('should throw error when entry not found', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Audit log not found'));

      await expect(getAuditLog('invalid-id')).rejects.toThrow('Audit log not found');
    });

    it('should handle 404 error', async () => {
      const error = {
        response: { status: 404, data: { message: 'Audit log not found' } },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getAuditLog('non-existent')).rejects.toEqual(error);
    });

    it('should handle 403 forbidden error', async () => {
      const error = {
        response: { status: 403, data: { message: 'Forbidden' } },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getAuditLog('forbidden-id')).rejects.toEqual(error);
    });
  });

  // ===========================================================================
  // exportAuditLogs Tests
  // ===========================================================================

  describe('exportAuditLogs', () => {
    it('should send GET request to export endpoint with CSV format', async () => {
      const mockBlob = createMockBlob(mockCsvExportContent, 'text/csv');
      mockedAxios.get.mockResolvedValue({ data: mockBlob });

      await exportAuditLogs(mockDefaultSearchParams, 'csv');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/audit-logs/export', {
        params: { ...mockDefaultSearchParams, format: 'csv' },
        responseType: 'blob',
      });
    });

    it('should send GET request to export endpoint with JSON format', async () => {
      const mockBlob = createMockBlob(mockJsonExportContent, 'application/json');
      mockedAxios.get.mockResolvedValue({ data: mockBlob });

      await exportAuditLogs(mockDefaultSearchParams, 'json');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/audit-logs/export', {
        params: { ...mockDefaultSearchParams, format: 'json' },
        responseType: 'blob',
      });
    });

    it('should return blob data', async () => {
      const mockBlob = createMockBlob(mockCsvExportContent, 'text/csv');
      mockedAxios.get.mockResolvedValue({ data: mockBlob });

      const result = await exportAuditLogs(mockDefaultSearchParams, 'csv');

      expect(result).toBeInstanceOf(Blob);
    });

    it('should include filter params in export request', async () => {
      const mockBlob = createMockBlob(mockCsvExportContent, 'text/csv');
      mockedAxios.get.mockResolvedValue({ data: mockBlob });

      await exportAuditLogs(mockFilteredSearchParams, 'csv');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/audit-logs/export', {
        params: { ...mockFilteredSearchParams, format: 'csv' },
        responseType: 'blob',
      });
    });

    it('should throw error on export failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Export failed'));

      await expect(exportAuditLogs(mockDefaultSearchParams, 'csv')).rejects.toThrow('Export failed');
    });

    it('should handle 413 payload too large error', async () => {
      const error = {
        response: { status: 413, data: { message: 'Export too large' } },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(exportAuditLogs(mockDefaultSearchParams, 'json')).rejects.toEqual(error);
    });
  });

  // ===========================================================================
  // getAuditStats Tests
  // ===========================================================================

  describe('getAuditStats', () => {
    const tenantId = 'tenant-123';
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-15');

    it('should send GET request to stats endpoint with correct params', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAuditStats });

      await getAuditStats(tenantId, startDate, endDate);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/audit-logs/stats', {
        params: {
          tenantId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
    });

    it('should return audit statistics', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAuditStats });

      const result = await getAuditStats(tenantId, startDate, endDate);

      expect(result).toEqual(mockAuditStats);
      expect(result.totalEvents).toBe(1500);
    });

    it('should return stats with events by action breakdown', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAuditStats });

      const result = await getAuditStats(tenantId, startDate, endDate);

      expect(result.eventsByAction).toBeDefined();
      expect(result.eventsByAction['user.login']).toBe(450);
    });

    it('should return stats with events by resource breakdown', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAuditStats });

      const result = await getAuditStats(tenantId, startDate, endDate);

      expect(result.eventsByResource).toBeDefined();
      expect(result.eventsByResource['auth']).toBe(850);
    });

    it('should return stats with events by user breakdown', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAuditStats });

      const result = await getAuditStats(tenantId, startDate, endDate);

      expect(result.eventsByUser).toBeDefined();
      expect(Array.isArray(result.eventsByUser)).toBe(true);
      expect(result.eventsByUser[0].userId).toBe('user-456');
      expect(result.eventsByUser[0].count).toBe(500);
    });

    it('should return stats with timeline data', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAuditStats });

      const result = await getAuditStats(tenantId, startDate, endDate);

      expect(result.timeline).toBeDefined();
      expect(Array.isArray(result.timeline)).toBe(true);
      expect(result.timeline[0]).toHaveProperty('date');
      expect(result.timeline[0]).toHaveProperty('count');
    });

    it('should throw error on API failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Stats unavailable'));

      await expect(getAuditStats(tenantId, startDate, endDate)).rejects.toThrow('Stats unavailable');
    });
  });

  // ===========================================================================
  // getUniqueActions Tests
  // ===========================================================================

  describe('getUniqueActions', () => {
    const tenantId = 'tenant-123';

    it('should send GET request to actions endpoint with tenant ID', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockUniqueActions });

      await getUniqueActions(tenantId);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/audit-logs/actions', {
        params: { tenantId },
      });
    });

    it('should return array of unique actions', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockUniqueActions });

      const result = await getUniqueActions(tenantId);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('user.login');
      expect(result).toContain('resource.created');
    });

    it('should return empty array when no actions found', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });

      const result = await getUniqueActions(tenantId);

      expect(result).toEqual([]);
    });

    it('should throw error on API failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Failed to fetch actions'));

      await expect(getUniqueActions(tenantId)).rejects.toThrow('Failed to fetch actions');
    });
  });

  // ===========================================================================
  // getUniqueResources Tests
  // ===========================================================================

  describe('getUniqueResources', () => {
    const tenantId = 'tenant-123';

    it('should send GET request to resources endpoint with tenant ID', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockUniqueResources });

      await getUniqueResources(tenantId);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/audit-logs/resources', {
        params: { tenantId },
      });
    });

    it('should return array of unique resources', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockUniqueResources });

      const result = await getUniqueResources(tenantId);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('auth');
      expect(result).toContain('users');
      expect(result).toContain('documents');
    });

    it('should return empty array when no resources found', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });

      const result = await getUniqueResources(tenantId);

      expect(result).toEqual([]);
    });

    it('should throw error on API failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Failed to fetch resources'));

      await expect(getUniqueResources(tenantId)).rejects.toThrow('Failed to fetch resources');
    });
  });

  // ===========================================================================
  // Error Response Format Tests
  // ===========================================================================

  describe('Error Response Handling', () => {
    it('should handle 400 Bad Request errors', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Bad Request', errors: ['Invalid parameter'] },
        },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(searchAuditLogs(mockDefaultSearchParams)).rejects.toEqual(error);
    });

    it('should handle 401 Unauthorized errors', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getAuditLog('audit-1')).rejects.toEqual(error);
    });

    it('should handle 403 Forbidden errors', async () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Forbidden' },
        },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getAuditStats('tenant-1', new Date(), new Date())).rejects.toEqual(error);
    });

    it('should handle 500 Internal Server Error', async () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(searchAuditLogs(mockDefaultSearchParams)).rejects.toEqual(error);
    });

    it('should handle network timeout errors', async () => {
      const error = {
        code: 'ECONNABORTED',
        message: 'timeout of 30000ms exceeded',
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(searchAuditLogs(mockDefaultSearchParams)).rejects.toEqual(error);
    });

    it('should handle network connection errors', async () => {
      const error = {
        code: 'ENOTFOUND',
        message: 'getaddrinfo ENOTFOUND api.example.com',
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(getUniqueActions('tenant-1')).rejects.toEqual(error);
    });
  });
});
