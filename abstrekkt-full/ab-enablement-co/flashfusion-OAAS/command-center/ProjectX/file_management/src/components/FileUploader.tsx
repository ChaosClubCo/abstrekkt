import React, { useCallback, useState } from 'react';
import { useFileUpload } from '../hooks';

interface FileUploaderProps {
  accept?: string[];
  maxSize?: number;
  multiple?: boolean;
  folder?: string;
  isPublic?: boolean;
  onUploadComplete?: (files: Array<{ file: any; url: string }>) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function FileUploader({
  accept = ['*/*'],
  maxSize = 10 * 1024 * 1024,
  multiple = false,
  folder,
  isPublic = false,
  onUploadComplete,
  onError,
  className,
}: FileUploaderProps) {
  const { upload, uploadMultiple, progress, isUploading } = useFileUpload();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `File "${file.name}" exceeds maximum size of ${formatSize(maxSize)}`;
      }

      const acceptPatterns = accept.map((a) => {
        if (a.endsWith('/*')) {
          return new RegExp(`^${a.replace('/*', '/')}`);
        }
        if (a.startsWith('.')) {
          return new RegExp(`${a.replace('.', '\\.')}$`, 'i');
        }
        return new RegExp(`^${a}$`);
      });

      const isAccepted = acceptPatterns.some(
        (pattern) => pattern.test(file.type) || pattern.test(file.name)
      );

      if (!isAccepted) {
        return `File type "${file.type}" is not allowed`;
      }

      return null;
    },
    [accept, maxSize]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);

      // Validate all files
      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          onError?.(new Error(validationError));
          return;
        }
      }

      try {
        const results =
          fileArray.length === 1
            ? [await upload(fileArray[0], { folder, isPublic })]
            : await uploadMultiple(fileArray, { folder, isPublic });

        onUploadComplete?.(results);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setError(message);
        onError?.(err instanceof Error ? err : new Error(message));
      }
    },
    [upload, uploadMultiple, folder, isPublic, validateFile, onUploadComplete, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {isUploading ? (
          <div className="space-y-2">
            <div className="text-gray-600">Uploading...</div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-gray-500">{progress}%</div>
          </div>
        ) : (
          <>
            <div className="text-gray-600 mb-2">
              Drag and drop files here, or{' '}
              <label className="text-blue-600 cursor-pointer hover:underline">
                browse
                <input
                  type="file"
                  accept={accept.join(',')}
                  multiple={multiple}
                  onChange={handleInputChange}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-sm text-gray-400">
              Max file size: {formatSize(maxSize)}
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
