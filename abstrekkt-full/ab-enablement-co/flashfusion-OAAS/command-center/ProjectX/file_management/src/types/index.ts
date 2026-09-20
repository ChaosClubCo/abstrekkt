export interface File {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  cdnUrl?: string;
  thumbnailUrl?: string;
  folder?: string;
  isPublic: boolean;
  metadata: FileMetadata;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileMetadata {
  width?: number;
  height?: number;
  duration?: number; // for video/audio
  pages?: number; // for PDFs
  [key: string]: unknown;
}

export interface UploadOptions {
  folder?: string;
  isPublic?: boolean;
  metadata?: Record<string, unknown>;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  file: File;
  url: string;
}

export interface SignedUrlOptions {
  expiresIn?: number; // seconds
  download?: boolean;
  filename?: string;
}

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
}

export interface FileFilters {
  folder?: string;
  mimeType?: string;
  search?: string;
  isPublic?: boolean;
  uploadedBy?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface StorageStats {
  totalFiles: number;
  totalSize: number;
  usedQuota: number;
  maxQuota: number;
  byMimeType: Record<string, { count: number; size: number }>;
}

export type FileCategory = 'image' | 'document' | 'video' | 'audio' | 'other';

export function getFileCategory(mimeType: string): FileCategory {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType === 'application/pdf' ||
    mimeType.includes('document') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('presentation')
  ) {
    return 'document';
  }
  return 'other';
}
