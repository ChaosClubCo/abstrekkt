import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import axios from 'axios';
import { useApiSpec, useEndpoint, useApiSchema } from '../hooks';
import { mockSpec, mockEmptySpec } from './fixtures';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('API Documentation Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useApiSpec', () => {
    it('should fetch OpenAPI spec on mount', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockSpec });

      const { result } = renderHook(() => useApiSpec(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.spec).toEqual(mockSpec);
    });

    it('should use default spec URL', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockSpec });

      renderHook(() => useApiSpec(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/openapi.json');
      });
    });

    it('should accept custom spec URL', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockSpec });

      renderHook(() => useApiSpec('/custom/spec.json'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith('/custom/spec.json');
      });
    });

    it('should extract endpoints from spec', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockSpec });

      const { result } = renderHook(() => useApiSpec(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.endpoints.length).toBe(5);
    });

    it('should include method and path for each endpoint', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockSpec });

      const { result } = renderHook(() => useApiSpec(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      result.current.endpoints.forEach(endpoint => {
        expect(endpoint.method).toBeDefined();
        expect(endpoint.path).toBeDefined();
        expect(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).toContain(endpoint.method);
      });
    });

    it('should include operation details for each endpoint', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockSpec });

      const { result } = renderHook(() => useApiSpec(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const getUsersEndpoint = result.current.endpoints.find(
        e => e.method === 'GET' && e.path === '/users'
      );
      expect(getUsersEndpoint?.operation.operationId).toBe('getUsers');
      expect(getUsersEndpoint?.operation.summary).toBe('Get all users');
    });

    it('should return empty endpoints array when spec is not loaded', () => {
      mockedAxios.get.mockReturnValue(new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useApiSpec(), { wrapper: createWrapper() });

      expect(result.current.endpoints).toEqual([]);
    });

    it('should return empty endpoints for empty spec', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockEmptySpec });

      const { result } = renderHook(() => useApiSpec(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.endpoints).toEqual([]);
    });

    it('should handle fetch error', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useApiSpec(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });
  });

  describe('useEndpoint', () => {
    it('should return specific endpoint operation', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSpec });

      const { result } = renderHook(() => useEndpoint('/users', 'get'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.endpoint?.operationId).toBe('getUsers');
    });

    it('should handle different HTTP methods', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSpec });

      const { result } = renderHook(() => useEndpoint('/users', 'post'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.endpoint?.operationId).toBe('createUser');
    });

    it('should return undefined for non-existent endpoint', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSpec });

      const { result } = renderHook(() => useEndpoint('/nonexistent', 'get'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.endpoint).toBeUndefined();
    });

    it('should handle case-insensitive method', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSpec });

      const { result } = renderHook(() => useEndpoint('/users', 'GET'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.endpoint?.operationId).toBe('getUsers');
    });
  });

  describe('useApiSchema', () => {
    it('should return schema from $ref', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSpec });

      const { result } = renderHook(
        () => useApiSchema('#/components/schemas/User'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.schema).toBeDefined();
      expect(result.current.schema?.type).toBe('object');
      expect(result.current.schema?.properties?.name).toBeDefined();
    });

    it('should parse schema name from $ref', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSpec });

      const { result } = renderHook(
        () => useApiSchema('#/components/schemas/Project'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.schema?.properties?.status?.enum).toEqual(['draft', 'active', 'archived']);
    });

    it('should return undefined for non-existent schema', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSpec });

      const { result } = renderHook(
        () => useApiSchema('#/components/schemas/NonExistent'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.schema).toBeUndefined();
    });

    it('should handle empty schema ref', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSpec });

      const { result } = renderHook(
        () => useApiSchema(''),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.schema).toBeUndefined();
    });
  });
});
