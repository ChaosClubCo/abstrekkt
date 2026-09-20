# File Management Module

Upload, storage, and CDN integration for file handling.

## Features

- **File Upload**: Drag-and-drop, multi-file, progress tracking
- **Storage Providers**: S3, Cloudflare R2, local storage
- **CDN Integration**: Automatic CDN URLs for public files
- **Image Processing**: Resize, crop, optimize images
- **Access Control**: Public/private files with signed URLs

## Usage

```tsx
import {
  FileUploader,
  FileGallery,
  useFileUpload,
  useFiles
} from '@projectx/file_management';

// Simple file uploader
function UploadPage() {
  const { upload, progress, isUploading } = useFileUpload();

  return (
    <FileUploader
      onUpload={upload}
      accept={['image/*', '.pdf']}
      maxSize={10 * 1024 * 1024} // 10MB
      multiple
    />
  );
}

// Display uploaded files
function FilesPage() {
  const { files, isLoading, deleteFile } = useFiles();

  return (
    <FileGallery
      files={files}
      onDelete={deleteFile}
    />
  );
}
```

## Components

| Component | Description |
|-----------|-------------|
| `FileUploader` | Drag-and-drop upload zone |
| `FileGallery` | Grid display of files |
| `FilePreview` | Preview file with actions |
| `ImageCropper` | Image crop/resize tool |
| `UploadProgress` | Upload progress indicator |

## API

### Hooks

| Hook | Description |
|------|-------------|
| `useFileUpload()` | Handle file uploads |
| `useFiles(folder?)` | List files in a folder |
| `useFile(id)` | Get single file details |
| `useSignedUrl(id)` | Get temporary signed URL |

## Storage Configuration

```typescript
// config/storage.ts
export const storageConfig = {
  provider: 's3', // 's3' | 'r2' | 'local'

  s3: {
    bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_REGION,
  },

  // Max file sizes by type
  limits: {
    image: 10 * 1024 * 1024,  // 10MB
    document: 50 * 1024 * 1024, // 50MB
    video: 500 * 1024 * 1024,  // 500MB
  },

  // CDN configuration
  cdn: {
    enabled: true,
    baseUrl: 'https://cdn.yourapp.com',
  },
};
```
