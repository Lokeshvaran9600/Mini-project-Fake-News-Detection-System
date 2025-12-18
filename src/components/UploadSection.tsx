import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  onAnalyze: () => void;
  uploadedFile: File | null;
  previewUrl: string;
  analyzing: boolean;
}

export function UploadSection({
  onFileSelect,
  onAnalyze,
  uploadedFile,
  previewUrl,
  analyzing
}: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file type - support images and videos
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image or video file');
      return false;
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 50MB');
      return false;
    }

    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) {
      return;
    }
    onFileSelect(file);
    toast.success('File uploaded successfully!');
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!analyzing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Upload className="w-5 h-5 text-gray-700" />
          <h2 className="text-gray-800">Upload Media</h2>
        </div>
        <p className="text-gray-500 text-sm">
          Select an image or video file to analyze for AI generation
        </p>
      </div>

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
          ${analyzing ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={analyzing}
        />

        {previewUrl ? (
          <div className="space-y-3">
            {uploadedFile?.type.startsWith('image/') ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                className="max-h-64 mx-auto rounded-lg"
              />
            )}
            <p className="text-gray-600 text-sm">{uploadedFile?.name}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto">
              <svg
                className="w-full h-full text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-700 mb-1">
                {isDragging ? 'Drop file here' : 'Click to upload'}
              </p>
              <p className="text-gray-500 text-sm">
                {isDragging ? '' : 'or drag and drop'}
              </p>
            </div>
            <p className="text-gray-400 text-xs pt-2">
              Supports images and videos
            </p>
          </div>
        )}
      </div>

      <Button
        onClick={onAnalyze}
        disabled={!uploadedFile || analyzing}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed h-12"
      >
        {analyzing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing...
          </span>
        ) : (
          'Analyze Media'
        )}
      </Button>
    </div>
  );
}
