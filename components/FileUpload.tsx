
import React, { useRef, useState } from 'react';
import { validateAndSanitizeUpload } from '../utils/uploadValidator';
import { SecurityError } from '../utils/security';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  onError?: (message: string) => void;
  previewUrl: string | null;
}

const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-monolith-text-muted group-hover:text-monolith-signal transition-monolith" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);


const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, onError, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const resetInput = () => {
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const processIncomingFile = async (file: File | null) => {
    if (!file) {
      onFileChange(null);
      return;
    }

    setIsValidating(true);

    try {
      const result = await validateAndSanitizeUpload(file);
      onFileChange(result.sanitizedFile);
    } catch (error) {
      const message =
        error instanceof SecurityError
          ? error.message
          : 'CRITICAL_FAULT: ASSET_VALIDATION_FAILED';
      
      if (onError) onError(message);
      onFileChange(null);
      resetInput();
    } finally {
      setIsValidating(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] ?? null;
    await processIncomingFile(file);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
        await processIncomingFile(file);
    }
    resetInput();
  };

  return (
    <div className="group">
      <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-monolith-text-secondary mb-3">SOURCE COVER INGEST</label>
      <div
        className={`mt-1 flex flex-col items-center justify-center p-8 border border-monolith-border bg-monolith-canvas cursor-pointer transition-monolith hover:border-monolith-signal/50 relative overflow-hidden ${isValidating ? 'opacity-50 cursor-wait' : ''}`}
        onClick={handleFileSelect}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="w-full flex flex-col items-center gap-4">
            <div className="relative w-full aspect-[2/3] max-w-[140px] shadow-2xl">
                <img src={previewUrl} alt="Cover preview" className="w-full h-full object-cover border border-monolith-border" />
                <div className="absolute inset-0 bg-monolith-signal/10 opacity-0 group-hover:opacity-100 transition-monolith flex items-center justify-center">
                    <span className="text-[10px] font-bold tracking-widest text-white uppercase bg-black/80 px-3 py-2">Replace Source</span>
                </div>
            </div>
            <p className="text-[10px] font-mono text-monolith-text-muted uppercase tracking-widest">ASSET_LOADED: TRUE</p>
          </div>
        ) : (
          <div className="space-y-4 text-center py-6">
            <div className="flex justify-center">
                <UploadIcon />
            </div>
            <div className="space-y-2">
                <p className="text-[11px] font-bold tracking-widest text-monolith-text-primary uppercase">
                    {isValidating ? 'VALIDATING_ASSET...' : 'Drop Source Asset'}
                </p>
                <p className="text-[10px] text-monolith-text-muted uppercase tracking-tight">
                    JPG, PNG, WEBP UP TO 10MB
                </p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default FileUpload;