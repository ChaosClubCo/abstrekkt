import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';
import type { UploadOptions, FileFilters, SignedUrlOptions } from '../types';

export function useFileUpload() {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const upload = useCallback(
    async (file: File, options: Omit<UploadOptions, 'onProgress'> = {}) => {
      setIsUploading(true);
      setProgress(0);

      try {
        const result = await api.uploadFile(file, {
          ...options,
          onProgress: setProgress,
        });

        queryClient.invalidateQueries({ queryKey: ['files'] });
        return result;
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    },
    [queryClient]
  );

  const uploadMultiple = useCallback(
    async (files: File[], options: Omit<UploadOptions, 'onProgress'> = {}) => {
      setIsUploading(true);
      const results = [];

      try {
        for (let i = 0; i < files.length; i++) {
          const result = await api.uploadFile(files[i], {
            ...options,
            onProgress: (p) => setProgress(((i + p / 100) / files.length) * 100),
          });
          results.push(result);
        }

        queryClient.invalidateQueries({ queryKey: ['files'] });
        return results;
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    },
    [queryClient]
  );

  return {
    upload,
    uploadMultiple,
    progress,
    isUploading,
  };
}

export function useFiles(filters?: FileFilters) {
  const queryClient = useQueryClient();

  const { data: files = [], isLoading, error } = useQuery({
    queryKey: ['files', filters],
    queryFn: () => api.getFiles(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: { name?: string; folder?: string; isPublic?: boolean } }) =>
      api.updateFile(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });

  return {
    files,
    isLoading,
    error,
    deleteFile: deleteMutation.mutateAsync,
    updateFile: updateMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useFile(id: string) {
  return useQuery({
    queryKey: ['file', id],
    queryFn: () => api.getFile(id),
    enabled: !!id,
  });
}

export function useSignedUrl(id: string, options?: SignedUrlOptions) {
  return useQuery({
    queryKey: ['signedUrl', id, options],
    queryFn: () => api.getSignedUrl(id, options),
    enabled: !!id,
    staleTime: (options?.expiresIn ?? 3600) * 1000 * 0.9, // Refresh at 90% of expiry
  });
}

export function useStorageStats() {
  return useQuery({
    queryKey: ['storageStats'],
    queryFn: api.getStorageStats,
    staleTime: 60000, // 1 minute
  });
}

export function useFolders() {
  const queryClient = useQueryClient();

  const { data: folders = [], isLoading } = useQuery({
    queryKey: ['folders'],
    queryFn: api.getFolders,
  });

  const createMutation = useMutation({
    mutationFn: api.createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  return {
    folders,
    isLoading,
    createFolder: createMutation.mutateAsync,
    deleteFolder: deleteMutation.mutateAsync,
  };
}
