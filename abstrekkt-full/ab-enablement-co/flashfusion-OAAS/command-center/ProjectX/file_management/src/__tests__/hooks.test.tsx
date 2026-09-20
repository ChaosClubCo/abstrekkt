import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useFileUpload,
  useFiles,
  useFile,
  useSignedUrl,
  useStorageStats,
  useFolders,
} from '../hooks';
import * as api from '../api';
import {
  mockFile,
  mockFiles,
  mockUploadResult,
  mockStorageStats,
  mockFolders,
  mockFilters,
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

describe('File Management Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useFileUpload', () => {
    it('should start with no upload in progress', () => {
      const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

      expect(result.current.isUploading).toBe(false);
      expect(result.current.progress).toBe(0);
    });

    it('should upload a file', async () => {
      mockedApi.uploadFile.mockResolvedValueOnce(mockUploadResult);

      const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      let uploadResult;

      await act(async () => {
        uploadResult = await result.current.upload(file);
      });

      expect(mockedApi.uploadFile).toHaveBeenCalled();
      expect(uploadResult).toEqual(mockUploadResult);
    });

    it('should upload file with options', async () => {
      mockedApi.uploadFile.mockResolvedValueOnce(mockUploadResult);

      const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

      const file = new File(['test'], 'test.txt', { type: 'text/plain' });

      await act(async () => {
        await result.current.upload(file, { folder: 'documents', isPublic: true });
      });

      expect(mockedApi.uploadFile).toHaveBeenCalledWith(
        file,
        expect.objectContaining({ folder: 'documents', isPublic: true })
      );
    });

    it('should track uploading state', async () => {
      let resolveUpload: (value: typeof mockUploadResult) => void;
      mockedApi.uploadFile.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveUpload = resolve;
        })
      );

      const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

      const file = new File(['test'], 'test.txt', { type: 'text/plain' });

      expect(result.current.isUploading).toBe(false);

      act(() => {
        result.current.upload(file);
      });

      await waitFor(() => {
        expect(result.current.isUploading).toBe(true);
      });

      await act(async () => {
        resolveUpload!(mockUploadResult);
      });

      await waitFor(() => {
        expect(result.current.isUploading).toBe(false);
      });
    });

    it('should reset progress after upload', async () => {
      mockedApi.uploadFile.mockResolvedValueOnce(mockUploadResult);

      const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

      const file = new File(['test'], 'test.txt', { type: 'text/plain' });

      await act(async () => {
        await result.current.upload(file);
      });

      expect(result.current.progress).toBe(0);
    });

    it('should upload multiple files', async () => {
      mockedApi.uploadFile.mockResolvedValue(mockUploadResult);

      const { result } = renderHook(() => useFileUpload(), { wrapper: createWrapper() });

      const files = [
        new File(['test1'], 'test1.txt', { type: 'text/plain' }),
        new File(['test2'], 'test2.txt', { type: 'text/plain' }),
      ];

      let uploadResults;
      await act(async () => {
        uploadResults = await result.current.uploadMultiple(files);
      });

      expect(mockedApi.uploadFile).toHaveBeenCalledTimes(2);
      expect(uploadResults).toHaveLength(2);
    });
  });

  describe('useFiles', () => {
    it('should fetch files on mount', async () => {
      mockedApi.getFiles.mockResolvedValueOnce(mockFiles);

      const { result } = renderHook(() => useFiles(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.files).toEqual(mockFiles);
    });

    it('should fetch files with filters', async () => {
      mockedApi.getFiles.mockResolvedValueOnce([mockFile]);

      renderHook(() => useFiles(mockFilters), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockedApi.getFiles).toHaveBeenCalledWith(mockFilters);
      });
    });

    it('should return empty array when no files', async () => {
      mockedApi.getFiles.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useFiles(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.files).toEqual([]);
    });

    it('should expose deleteFile mutation', async () => {
      mockedApi.getFiles.mockResolvedValueOnce(mockFiles);
      mockedApi.deleteFile.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useFiles(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.deleteFile('file_001');
      });

      expect(mockedApi.deleteFile).toHaveBeenCalledWith('file_001', expect.anything());
    });

    it('should expose updateFile mutation', async () => {
      mockedApi.getFiles.mockResolvedValueOnce(mockFiles);
      mockedApi.updateFile.mockResolvedValueOnce({ ...mockFile, name: 'new-name.pdf' });

      const { result } = renderHook(() => useFiles(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateFile({ id: 'file_001', updates: { name: 'new-name.pdf' } });
      });

      // The mutation transforms { id, updates } into updateFile(id, updates)
      expect(mockedApi.updateFile).toHaveBeenCalledWith('file_001', { name: 'new-name.pdf' });
    });

    it('should track isDeleting state', async () => {
      mockedApi.getFiles.mockResolvedValueOnce(mockFiles);
      let resolveDelete: () => void;
      mockedApi.deleteFile.mockReturnValueOnce(
        new Promise<void>((resolve) => {
          resolveDelete = resolve;
        })
      );

      const { result } = renderHook(() => useFiles(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isDeleting).toBe(false);

      act(() => {
        result.current.deleteFile('file_001');
      });

      await waitFor(() => {
        expect(result.current.isDeleting).toBe(true);
      });

      await act(async () => {
        resolveDelete!();
      });

      await waitFor(() => {
        expect(result.current.isDeleting).toBe(false);
      });
    });
  });

  describe('useFile', () => {
    it('should fetch a single file', async () => {
      mockedApi.getFile.mockResolvedValueOnce(mockFile);

      const { result } = renderHook(() => useFile('file_001'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockFile);
    });

    it('should not fetch when id is empty', async () => {
      const { result } = renderHook(() => useFile(''), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(false);
      expect(mockedApi.getFile).not.toHaveBeenCalled();
    });
  });

  describe('useSignedUrl', () => {
    it('should fetch signed URL', async () => {
      mockedApi.getSignedUrl.mockResolvedValueOnce('https://signed.url/file_001');

      const { result } = renderHook(() => useSignedUrl('file_001'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBe('https://signed.url/file_001');
    });

    it('should fetch signed URL with options', async () => {
      mockedApi.getSignedUrl.mockResolvedValueOnce('https://signed.url/file_001');

      renderHook(() => useSignedUrl('file_001', { expiresIn: 7200 }), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockedApi.getSignedUrl).toHaveBeenCalledWith('file_001', { expiresIn: 7200 });
      });
    });

    it('should not fetch when id is empty', async () => {
      const { result } = renderHook(() => useSignedUrl(''), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(false);
      expect(mockedApi.getSignedUrl).not.toHaveBeenCalled();
    });
  });

  describe('useStorageStats', () => {
    it('should fetch storage stats', async () => {
      mockedApi.getStorageStats.mockResolvedValueOnce(mockStorageStats);

      const { result } = renderHook(() => useStorageStats(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockStorageStats);
    });
  });

  describe('useFolders', () => {
    it('should fetch folders', async () => {
      mockedApi.getFolders.mockResolvedValueOnce(mockFolders);

      const { result } = renderHook(() => useFolders(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.folders).toEqual(mockFolders);
    });

    it('should expose createFolder mutation', async () => {
      mockedApi.getFolders.mockResolvedValueOnce(mockFolders);
      mockedApi.createFolder.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useFolders(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.createFolder('new-folder');
      });

      expect(mockedApi.createFolder).toHaveBeenCalledWith('new-folder', expect.anything());
    });

    it('should expose deleteFolder mutation', async () => {
      mockedApi.getFolders.mockResolvedValueOnce(mockFolders);
      mockedApi.deleteFolder.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useFolders(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.deleteFolder('documents');
      });

      expect(mockedApi.deleteFolder).toHaveBeenCalledWith('documents', expect.anything());
    });
  });
});
