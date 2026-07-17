import axios from 'axios';
import type {
  File,
  UploadOptions,
  UploadResult,
  SignedUrlOptions,
  FileFilters,
  StorageStats,
  ImageTransformOptions,
} from '../types';

const API_BASE = '/api/files';

// Upload
export async function uploadFile(
  file: globalThis.File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  if (options.folder) formData.append('folder', options.folder);
  if (options.isPublic !== undefined) formData.append('isPublic', String(options.isPublic));
  if (options.metadata) formData.append('metadata', JSON.stringify(options.metadata));

  const response = await axios.post<UploadResult>(API_BASE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (event.total && options.onProgress) {
        options.onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });

  return response.data;
}

export async function uploadFiles(
  files: globalThis.File[],
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  return Promise.all(files.map((file) => uploadFile(file, options)));
}

// CRUD
export async function getFiles(filters?: FileFilters): Promise<File[]> {
  const response = await axios.get<File[]>(API_BASE, { params: filters });
  return response.data;
}

export async function getFile(id: string): Promise<File> {
  const response = await axios.get<File>(`${API_BASE}/${id}`);
  return response.data;
}

export async function deleteFile(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/${id}`);
}

export async function deleteFiles(ids: string[]): Promise<void> {
  await axios.delete(API_BASE, { data: { ids } });
}

export async function updateFile(
  id: string,
  updates: { name?: string; folder?: string; isPublic?: boolean }
): Promise<File> {
  const response = await axios.patch<File>(`${API_BASE}/${id}`, updates);
  return response.data;
}

export async function moveFile(id: string, folder: string): Promise<File> {
  return updateFile(id, { folder });
}

// Signed URLs
export async function getSignedUrl(id: string, options?: SignedUrlOptions): Promise<string> {
  const response = await axios.post<{ url: string }>(`${API_BASE}/${id}/signed-url`, options);
  return response.data.url;
}

// Image transformations
export async function getTransformedImageUrl(
  id: string,
  transforms: ImageTransformOptions
): Promise<string> {
  const response = await axios.post<{ url: string }>(`${API_BASE}/${id}/transform`, transforms);
  return response.data.url;
}

// Storage stats
export async function getStorageStats(): Promise<StorageStats> {
  const response = await axios.get<StorageStats>(`${API_BASE}/stats`);
  return response.data;
}

// Folders
export async function getFolders(): Promise<string[]> {
  const response = await axios.get<string[]>(`${API_BASE}/folders`);
  return response.data;
}

export async function createFolder(name: string): Promise<void> {
  await axios.post(`${API_BASE}/folders`, { name });
}

export async function deleteFolder(name: string): Promise<void> {
  await axios.delete(`${API_BASE}/folders/${encodeURIComponent(name)}`);
}
