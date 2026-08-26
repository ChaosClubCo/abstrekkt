import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useEmailTemplates,
  useEmailTemplate,
  useEmailPreview,
  useSendEmail,
  useSendTestEmail,
} from '../hooks';
import * as api from '../api';
import {
  mockTemplate,
  mockTemplates,
  mockPreview,
  mockSendResult,
  mockUpdateInput,
  mockSendInput,
} from './fixtures';

vi.mock('../api');
const mockedApi = vi.mocked(api);

function createWrapper() {
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

describe('Email Template Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useEmailTemplates', () => {
    it('should fetch templates on mount', async () => {
      mockedApi.getTemplates.mockResolvedValueOnce(mockTemplates);

      const { result } = renderHook(() => useEmailTemplates(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.templates).toEqual(mockTemplates);
    });

    it('should return empty array when no templates', async () => {
      mockedApi.getTemplates.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useEmailTemplates(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.templates).toEqual([]);
    });

    it('should expose updateTemplate mutation', async () => {
      mockedApi.getTemplates.mockResolvedValueOnce(mockTemplates);
      mockedApi.updateTemplate.mockResolvedValueOnce({ ...mockTemplate, ...mockUpdateInput });

      const { result } = renderHook(() => useEmailTemplates(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateTemplate({ key: 'welcome', input: mockUpdateInput });
      });

      expect(mockedApi.updateTemplate).toHaveBeenCalledWith('welcome', mockUpdateInput, undefined);
    });

    it('should expose updateTemplate with locale', async () => {
      mockedApi.getTemplates.mockResolvedValueOnce(mockTemplates);
      mockedApi.updateTemplate.mockResolvedValueOnce(mockTemplate);

      const { result } = renderHook(() => useEmailTemplates(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateTemplate({ key: 'welcome', input: mockUpdateInput, locale: 'es' });
      });

      expect(mockedApi.updateTemplate).toHaveBeenCalledWith('welcome', mockUpdateInput, 'es');
    });

    it('should expose resetTemplate mutation', async () => {
      mockedApi.getTemplates.mockResolvedValueOnce(mockTemplates);
      mockedApi.resetTemplate.mockResolvedValueOnce(mockTemplate);

      const { result } = renderHook(() => useEmailTemplates(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.resetTemplate('welcome');
      });

      expect(mockedApi.resetTemplate).toHaveBeenCalledWith('welcome', expect.anything());
    });

    it('should track isUpdating state', async () => {
      mockedApi.getTemplates.mockResolvedValueOnce(mockTemplates);
      let resolveUpdate: (value: typeof mockTemplate) => void;
      mockedApi.updateTemplate.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveUpdate = resolve;
        })
      );

      const { result } = renderHook(() => useEmailTemplates(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isUpdating).toBe(false);

      act(() => {
        result.current.updateTemplate({ key: 'welcome', input: mockUpdateInput });
      });

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(true);
      });

      await act(async () => {
        resolveUpdate!(mockTemplate);
      });

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(false);
      });
    });
  });

  describe('useEmailTemplate', () => {
    it('should fetch a single template', async () => {
      mockedApi.getTemplate.mockResolvedValueOnce(mockTemplate);

      const { result } = renderHook(() => useEmailTemplate('welcome'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockTemplate);
    });

    it('should fetch template with locale', async () => {
      mockedApi.getTemplate.mockResolvedValueOnce(mockTemplate);

      renderHook(() => useEmailTemplate('welcome', 'fr'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockedApi.getTemplate).toHaveBeenCalledWith('welcome', 'fr');
      });
    });
  });

  describe('useEmailPreview', () => {
    it('should fetch preview with variables', async () => {
      mockedApi.previewTemplate.mockResolvedValueOnce(mockPreview);

      const { result } = renderHook(
        () => useEmailPreview('welcome', { appName: 'MyApp', userName: 'John' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockPreview);
    });

    it('should not fetch when variables are empty', async () => {
      const { result } = renderHook(() => useEmailPreview('welcome', {}), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(false);
      expect(mockedApi.previewTemplate).not.toHaveBeenCalled();
    });
  });

  describe('useSendEmail', () => {
    it('should expose send mutation', async () => {
      mockedApi.sendEmail.mockResolvedValueOnce(mockSendResult);

      const { result } = renderHook(() => useSendEmail(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.send(mockSendInput);
      });

      expect(mockedApi.sendEmail).toHaveBeenCalledWith(mockSendInput, expect.anything());
    });

    it('should track isSending state', async () => {
      let resolveSend: (value: typeof mockSendResult) => void;
      mockedApi.sendEmail.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveSend = resolve;
        })
      );

      const { result } = renderHook(() => useSendEmail(), { wrapper: createWrapper() });

      expect(result.current.isSending).toBe(false);

      act(() => {
        result.current.send(mockSendInput);
      });

      await waitFor(() => {
        expect(result.current.isSending).toBe(true);
      });

      await act(async () => {
        resolveSend!(mockSendResult);
      });

      await waitFor(() => {
        expect(result.current.isSending).toBe(false);
      });
    });

    it('should expose error state', async () => {
      const error = new Error('Send failed');
      mockedApi.sendEmail.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useSendEmail(), { wrapper: createWrapper() });

      try {
        await act(async () => {
          await result.current.send(mockSendInput);
        });
      } catch {
        // Expected to throw
      }

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });
  });

  describe('useSendTestEmail', () => {
    it('should expose sendTest mutation', async () => {
      mockedApi.sendTestEmail.mockResolvedValueOnce(mockSendResult);

      const { result } = renderHook(() => useSendTestEmail(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.sendTest({ key: 'welcome', to: 'test@example.com' });
      });

      expect(mockedApi.sendTestEmail).toHaveBeenCalledWith('welcome', 'test@example.com');
    });

    it('should track isSending state', async () => {
      let resolveSend: (value: typeof mockSendResult) => void;
      mockedApi.sendTestEmail.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveSend = resolve;
        })
      );

      const { result } = renderHook(() => useSendTestEmail(), { wrapper: createWrapper() });

      expect(result.current.isSending).toBe(false);

      act(() => {
        result.current.sendTest({ key: 'welcome', to: 'test@example.com' });
      });

      await waitFor(() => {
        expect(result.current.isSending).toBe(true);
      });

      await act(async () => {
        resolveSend!(mockSendResult);
      });

      await waitFor(() => {
        expect(result.current.isSending).toBe(false);
      });
    });

    it('should expose result', async () => {
      mockedApi.sendTestEmail.mockResolvedValueOnce(mockSendResult);

      const { result } = renderHook(() => useSendTestEmail(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.sendTest({ key: 'welcome', to: 'test@example.com' });
      });

      await waitFor(() => {
        expect(result.current.result).toEqual(mockSendResult);
      });
    });
  });
});
