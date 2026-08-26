import type {
  File,
  UploadResult,
  StorageStats,
  FileFilters,
} from '../types';

export const mockFile: File = {
  id: 'file_001',
  name: 'document.pdf',
  originalName: 'Annual Report 2024.pdf',
  mimeType: 'application/pdf',
  size: 1024000,
  url: 'https://storage.example.com/file_001',
  cdnUrl: 'https://cdn.example.com/file_001',
  thumbnailUrl: 'https://cdn.example.com/file_001/thumb.png',
  folder: 'documents',
  isPublic: false,
  metadata: { pages: 25 },
  uploadedBy: 'user_123',
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-15T10:00:00Z'),
};

export const mockImageFile: File = {
  id: 'file_002',
  name: 'photo.jpg',
  originalName: 'vacation_photo.jpg',
  mimeType: 'image/jpeg',
  size: 2048000,
  url: 'https://storage.example.com/file_002',
  cdnUrl: 'https://cdn.example.com/file_002',
  thumbnailUrl: 'https://cdn.example.com/file_002/thumb.jpg',
  folder: 'images',
  isPublic: true,
  metadata: { width: 1920, height: 1080 },
  uploadedBy: 'user_123',
  createdAt: new Date('2024-01-14T15:00:00Z'),
  updatedAt: new Date('2024-01-14T15:00:00Z'),
};

export const mockFiles: File[] = [
  mockFile,
  mockImageFile,
  {
    id: 'file_003',
    name: 'video.mp4',
    originalName: 'presentation.mp4',
    mimeType: 'video/mp4',
    size: 50000000,
    url: 'https://storage.example.com/file_003',
    folder: 'videos',
    isPublic: false,
    metadata: { width: 1280, height: 720, duration: 120 },
    uploadedBy: 'user_456',
    createdAt: new Date('2024-01-13T12:00:00Z'),
    updatedAt: new Date('2024-01-13T12:00:00Z'),
  },
];

export const mockUploadResult: UploadResult = {
  file: mockFile,
  url: 'https://storage.example.com/file_001',
};

export const mockStorageStats: StorageStats = {
  totalFiles: 150,
  totalSize: 1073741824, // 1GB
  usedQuota: 1073741824,
  maxQuota: 10737418240, // 10GB
  byMimeType: {
    'image/jpeg': { count: 80, size: 512000000 },
    'application/pdf': { count: 50, size: 256000000 },
    'video/mp4': { count: 20, size: 305741824 },
  },
};

export const mockFolders: string[] = ['documents', 'images', 'videos', 'archives'];

export const mockFilters: FileFilters = {
  folder: 'documents',
  mimeType: 'application/pdf',
  isPublic: false,
};
