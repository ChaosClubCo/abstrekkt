import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as api from '../api';
import {
  mockFile,
  mockFiles,
  mockUploadResult,
  mockStorageStats,
  mockFolders,
  mockFilters,
} from './fixtures';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('File Management API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should upload a file', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockUploadResult });

      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const result = await api.uploadFile(file);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/files',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );
      expect(result).toEqual(mockUploadResult);
    });

    it('should upload file with folder option', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockUploadResult });

      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      await api.uploadFile(file, { folder: 'documents' });

      const formData = (mockedAxios.post.mock.calls[0][1] as FormData);
      expect(formData.get('folder')).toBe('documents');
    });

    it('should upload file with isPublic option', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockUploadResult });

      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      await api.uploadFile(file, { isPublic: true });

      const formData = (mockedAxios.post.mock.calls[0][1] as FormData);
      expect(formData.get('isPublic')).toBe('true');
    });

    it('should upload file with metadata option', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockUploadResult });

      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      await api.uploadFile(file, { metadata: { customField: 'value' } });

      const formData = (mockedAxios.post.mock.calls[0][1] as FormData);
      expect(formData.get('metadata')).toBe('{"customField":"value"}');
    });

    it('should track upload progress', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockUploadResult });

      const onProgress = vi.fn();
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      await api.uploadFile(file, { onProgress });

      // Verify onUploadProgress callback is set
      expect(mockedAxios.post.mock.calls[0][2]).toHaveProperty('onUploadProgress');
    });
  });

  describe('uploadFiles', () => {
    it('should upload multiple files', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockUploadResult });

      const files = [
        new File(['test1'], 'test1.txt', { type: 'text/plain' }),
        new File(['test2'], 'test2.txt', { type: 'text/plain' }),
      ];
      const result = await api.uploadFiles(files);

      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });
  });

  describe('getFiles', () => {
    it('should fetch files without filters', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockFiles });

      const result = await api.getFiles();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/files', { params: undefined });
      expect(result).toEqual(mockFiles);
    });

    it('should fetch files with filters', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [mockFile] });

      await api.getFiles(mockFilters);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/files', { params: mockFilters });
    });
  });

  describe('getFile', () => {
    it('should fetch a single file', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockFile });

      const result = await api.getFile('file_001');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/files/file_001');
      expect(result).toEqual(mockFile);
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await api.deleteFile('file_001');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/files/file_001');
    });
  });

  describe('deleteFiles', () => {
    it('should delete multiple files', async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await api.deleteFiles(['file_001', 'file_002']);

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/files', { data: { ids: ['file_001', 'file_002'] } });
    });
  });

  describe('updateFile', () => {
    it('should update file name', async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: { ...mockFile, name: 'new-name.pdf' } });

      const result = await api.updateFile('file_001', { name: 'new-name.pdf' });

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/files/file_001', { name: 'new-name.pdf' });
      expect(result.name).toBe('new-name.pdf');
    });

    it('should update file folder', async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: { ...mockFile, folder: 'archives' } });

      await api.updateFile('file_001', { folder: 'archives' });

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/files/file_001', { folder: 'archives' });
    });

    it('should update file visibility', async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: { ...mockFile, isPublic: true } });

      await api.updateFile('file_001', { isPublic: true });

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/files/file_001', { isPublic: true });
    });
  });

  describe('moveFile', () => {
    it('should move file to a new folder', async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: { ...mockFile, folder: 'archives' } });

      const result = await api.moveFile('file_001', 'archives');

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/files/file_001', { folder: 'archives' });
      expect(result.folder).toBe('archives');
    });
  });

  describe('getSignedUrl', () => {
    it('should get signed URL', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { url: 'https://signed.url/file_001?token=abc' } });

      const result = await api.getSignedUrl('file_001');

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/files/file_001/signed-url', undefined);
      expect(result).toBe('https://signed.url/file_001?token=abc');
    });

    it('should get signed URL with options', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { url: 'https://signed.url/file_001' } });

      await api.getSignedUrl('file_001', { expiresIn: 3600, download: true, filename: 'report.pdf' });

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/files/file_001/signed-url', {
        expiresIn: 3600,
        download: true,
        filename: 'report.pdf',
      });
    });
  });

  describe('getTransformedImageUrl', () => {
    it('should get transformed image URL', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { url: 'https://cdn.example.com/file_002?w=200' } });

      const result = await api.getTransformedImageUrl('file_002', { width: 200, quality: 80 });

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/files/file_002/transform', { width: 200, quality: 80 });
      expect(result).toBe('https://cdn.example.com/file_002?w=200');
    });
  });

  describe('getStorageStats', () => {
    it('should fetch storage stats', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockStorageStats });

      const result = await api.getStorageStats();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/files/stats');
      expect(result).toEqual(mockStorageStats);
    });
  });

  describe('getFolders', () => {
    it('should fetch folders', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockFolders });

      const result = await api.getFolders();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/files/folders');
      expect(result).toEqual(mockFolders);
    });
  });

  describe('createFolder', () => {
    it('should create a folder', async () => {
      mockedAxios.post.mockResolvedValueOnce({});

      await api.createFolder('new-folder');

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/files/folders', { name: 'new-folder' });
    });
  });

  describe('deleteFolder', () => {
    it('should delete a folder', async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await api.deleteFolder('documents');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/files/folders/documents');
    });

    it('should encode folder name with special characters', async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await api.deleteFolder('my folder/test');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/files/folders/my%20folder%2Ftest');
    });
  });

  describe('error handling', () => {
    it('should propagate upload errors', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Upload failed'));

      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      await expect(api.uploadFile(file)).rejects.toThrow('Upload failed');
    });

    it('should propagate fetch errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('File not found'));

      await expect(api.getFile('invalid')).rejects.toThrow('File not found');
    });
  });
});
