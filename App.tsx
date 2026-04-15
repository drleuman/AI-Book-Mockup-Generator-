
import React, { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { generateBookMockup, generateBookPreview, generateBookPreviewBatch, revokeGeneratedMockupUrl } from './services/geminiService';
import { BINDING_TYPES, COVER_FINISHES, MATERIAL_TEXTURES, CASE_WRAPS, PERSPECTIVE_OPTIONS, BOOK_FORMAT_OPTIONS } from './constants';
import type { MockupOptions, GeneratedMockup } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import SelectInput from './components/SelectInput';
import NumberInput from './components/NumberInput';
import Button from './components/Button';
import GalleryDisplay from './components/GalleryDisplay';
import ErrorDisplay from './components/ErrorDisplay';
import ColorPicker from './components/ColorPicker';
import VisualSelect from './components/VisualSelect';
import { WATERMARK_BASE64 } from './watermark';
import { DownloadIcon } from './components/MockupCard';
import ConfirmDialog from './components/ConfirmDialog';
import Footer from './components/Footer';

import {
  MAX_PREVIEWS_PER_BATCH,
  MAX_SESSION_MOCKUPS,
  SecurityError,
  createSafeAssetFilename,
  ensureFinitePositiveNumber,
} from './utils/security';

import {
  batchPreviewRateLimiter,
  generationCooldownGuard,
  generationDeduper,
  generationRateLimiter,
  getSessionRateLimitKey,
} from './utils/rateLimiter';

const singleGenKey = getSessionRateLimitKey('single_generation');
const batchGenKey = getSessionRateLimitKey('batch_generation');


const applyWatermark = (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const mockupImg = new Image();
    const watermarkImg = new Image();

    let loadedCount = 0;
    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        const canvas = document.createElement('canvas');
        canvas.width = mockupImg.width;
        canvas.height = mockupImg.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // 1. Draw the main mockup image
        ctx.drawImage(mockupImg, 0, 0);

        // 2. Draw the watermark
        const margin = canvas.width * 0.04; // 4% margin
        const scale = canvas.width * 0.12; // Watermark width is 12% of image width
        const watermarkX = canvas.width - scale - margin;
        const watermarkY = canvas.height - scale - margin;
        
        ctx.globalAlpha = 0.6; // Set opacity
        ctx.drawImage(watermarkImg, watermarkX, watermarkY, scale, scale);

        // 3. Get the result
        resolve(canvas.toDataURL('image/png'));
      }
    };

    mockupImg.onload = onImageLoad;
    watermarkImg.onload = onImageLoad;
    
    mockupImg.onerror = () => reject(new Error('Failed to load mockup image for watermarking.'));
    watermarkImg.onerror = () => reject(new Error('Failed to load watermark image.'));

    mockupImg.src = `data:image/png;base64,${base64Image}`;
    watermarkImg.src = `data:image/png;base64,${WATERMARK_BASE64}`;
  });
};

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


const App: React.FC = () => {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [options, setOptions] = useState<MockupOptions>({
    bindingType: 'hardcover',
    coverFinish: 'matte',
    materialTexture: 'smooth',
    spineWidth: 25,
    caseWrap: 'full case wrap',
    backgroundColor: '#FFFFFF',
    bookFormat: 'vertical',
  });
  const [generatedMockups, setGeneratedMockups] = useState<GeneratedMockup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const buildGenerationFingerprint = (
    file: File,
    opts: MockupOptions,
    perspective: string,
    mode: 'single' | 'preview'
  ) => {
    return JSON.stringify({
      mode,
      perspective,
      fileName: file.name,
      fileSize: file.size,
      bindingType: opts.bindingType,
      coverFinish: opts.coverFinish,
      materialTexture: opts.materialTexture,
      spineWidth: opts.spineWidth,
      caseWrap: opts.caseWrap,
      backgroundColor: opts.backgroundColor,
      bookFormat: opts.bookFormat,
    });
  };

  const handleFileChange = (file: File | null) => {
    setCoverImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverPreview(null);
    }
  };

  const handleOptionChange = (field: keyof MockupOptions, value: string | number) => {
    setOptions((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreviewSubmit = useCallback(async () => {
    if (!coverImage) {
      setError('Please upload a book cover image.');
      return;
    }

    try {
        const previewCount = PERSPECTIVE_OPTIONS.length;

        if (previewCount > MAX_PREVIEWS_PER_BATCH) {
            throw new SecurityError(`CRITICAL_LIMIT: BATCH_SIZE_EXCEEDED (MAX ${MAX_PREVIEWS_PER_BATCH})`, 'PREVIEW_BATCH_TOO_LARGE');
        }

        ensureFinitePositiveNumber(options.spineWidth, 'Spine width', 1, 150);
        
        if (generatedMockups.length + previewCount > MAX_SESSION_MOCKUPS) {
            throw new SecurityError(`CRITICAL_LIMIT: SESSION_STORAGE_FULL (MAX ${MAX_SESSION_MOCKUPS}). PLEASE PURGE GALLERY.`, 'SESSION_ASSET_LIMIT_REACHED');
        }

        batchPreviewRateLimiter.assert(batchGenKey, 'RESOURCE_LOCK: TOO_MANY_BATCH_REQUESTS');
        generationCooldownGuard.assert(batchGenKey, 'SYSTEM_COOLDOWN_ACTIVE');

        setIsPreviewLoading(true);
        setError(null);

        const perspectiveValues = PERSPECTIVE_OPTIONS.map(p => p.value);
        const results = await generateBookPreviewBatch(coverImage, options, perspectiveValues);
        
        const newMockups: GeneratedMockup[] = [];

        for (const res of results) {
            const watermarkedUrl = await applyWatermark(res.imageUrl);
            newMockups.push({
                id: `${Date.now()}-${res.perspectiveValue}`,
                imageUrl: watermarkedUrl,
                options: { ...options },
                isPreview: true,
                perspectiveLabel: res.perspectiveLabel,
                perspectiveValue: res.perspectiveValue,
            });
        }
        
        setGeneratedMockups(prev => [...prev, ...newMockups]);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'CRITICAL_SYSTEM_FAULT');
    } finally {
        setIsPreviewLoading(false);
    }
  }, [coverImage, options, generatedMockups.length]);

  const handleSubmit = useCallback(async () => {
    if (!coverImage) {
      setError('Please upload a book cover image.');
      return;
    }

    try {
        ensureFinitePositiveNumber(options.spineWidth, 'Spine width', 1, 150);

        if (generatedMockups.length >= MAX_SESSION_MOCKUPS) {
            throw new SecurityError(`CRITICAL_LIMIT: SESSION_STORAGE_FULL (MAX ${MAX_SESSION_MOCKUPS}). PLEASE PURGE GALLERY.`, 'SESSION_ASSET_LIMIT_REACHED');
        }

        generationRateLimiter.assert(singleGenKey, 'RESOURCE_LOCK: TOO_MANY_REQUESTS');
        generationCooldownGuard.assert(singleGenKey, 'SYSTEM_COOLDOWN_ACTIVE');

        const defaultPerspective = PERSPECTIVE_OPTIONS[0]; // Default to '3/4 View'
        const fingerprint = buildGenerationFingerprint(coverImage, options, defaultPerspective.value, 'single');
        generationDeduper.assertStart(fingerprint);

        setIsLoading(true);
        setError(null);

        const resultImage = await generateBookMockup(coverImage, options, defaultPerspective.value);
        const watermarkedImageUrl = await applyWatermark(resultImage);
        
        const newMockup: GeneratedMockup = {
            id: Date.now().toString(),
            imageUrl: watermarkedImageUrl,
            options: { ...options },
            isPreview: false,
            perspectiveLabel: defaultPerspective.label,
            perspectiveValue: defaultPerspective.value,
        };
        setGeneratedMockups((prev) => [...prev, newMockup]);
        generationDeduper.end(fingerprint);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'CRITICAL_SYSTEM_FAULT');
    } finally {
        setIsLoading(false);
    }
  }, [coverImage, options, generatedMockups.length]);

  const handleDeleteMockup = useCallback((id: string) => {
    setGeneratedMockups(prev => {
        const target = prev.find(m => m.id === id);
        if (target) revokeGeneratedMockupUrl(target);
        return prev.filter(m => m.id !== id);
    });
  }, []);

  const handleDownloadAll = useCallback(async () => {
    if (generatedMockups.length === 0) return;

    setIsZipping(true);
    setError(null);

    const zip = new JSZip();
    
    try {
      await Promise.all(generatedMockups.map(async (mockup) => {
        const response = await fetch(mockup.imageUrl);
        const blob = await response.blob();
        
        const filename = createSafeAssetFilename(
            'MOCKUP', 
            '.png', 
            mockup.perspectiveLabel
        );
        
        zip.file(filename, blob);
      }));

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = `BATCH_EXPORT_${new Date().toISOString().split('T')[0]}.ZIP`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } finally {
        URL.revokeObjectURL(url);
      }

    } catch (err) {
      console.error('Failed to create zip file:', err);
      setError(err instanceof Error ? err.message : 'Could not create the zip file.');
    } finally {
      setIsZipping(false);
    }
  }, [generatedMockups]);

  const handleClearAll = useCallback(() => {
    if (window.confirm('WARNING: THIS WILL PERMANENTLY PURGE ALL GENERATED ASSETS. PROCEED?')) {
        generatedMockups.forEach(revokeGeneratedMockupUrl);
        setGeneratedMockups([]);
    }
    setShowClearConfirm(false);
  }, [generatedMockups]);

  return (
    <div className="min-h-screen bg-monolith-canvas text-monolith-text-primary font-sans selection:bg-monolith-signal selection:text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-monolith-border">
          
          {/* CONTROL RAIL (Left) */}
          <div className="lg:col-span-4 bg-monolith-surface p-8 space-y-12">
            <div>
              <h2 className="text-xs font-bold tracking-[0.2em] text-monolith-signal uppercase mb-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-monolith-signal animate-pulse"></span>
                Mockup Configuration
              </h2>
              
              <div className="space-y-10">
                <FileUpload onFileChange={handleFileChange} onError={setError} previewUrl={coverPreview} />
                
                <div className="space-y-8">
                  <VisualSelect
                    label="Binding Architecture"
                    value={options.bindingType}
                    onChange={(value) => handleOptionChange('bindingType', value)}
                    options={BINDING_TYPES}
                  />
                  
                  {options.bindingType === 'hardcover' && (
                    <SelectInput
                      label="Case Wrap Specification"
                      value={options.caseWrap}
                      onChange={(e) => handleOptionChange('caseWrap', e.target.value)}
                      options={CASE_WRAPS}
                    />
                  )}

                  <VisualSelect
                    label="Volume Format"
                    value={options.bookFormat}
                    onChange={(value) => handleOptionChange('bookFormat', value)}
                    options={BOOK_FORMAT_OPTIONS}
                  />
                </div>
                
                {/* Advanced Configuration Toggle */}
                <div className="pt-4 border-t border-monolith-border">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-monolith-text-secondary hover:text-monolith-signal transition-monolith"
                  >
                     <svg className={`h-4 w-4 transition-transform duration-300 ${showAdvancedOptions ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                    {showAdvancedOptions ? 'Hide Advanced Specs' : 'Show Advanced Specs'}
                  </button>
                </div>

                {/* Advanced Parameters */}
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showAdvancedOptions ? 'max-h-[1000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                  <div className="space-y-8 pb-4">
                    <SelectInput
                      label="Surface Finish"
                      value={options.coverFinish}
                      onChange={(e) => handleOptionChange('coverFinish', e.target.value)}
                      options={COVER_FINISHES}
                    />
                    <SelectInput
                      label="Material Micro-Texture"
                      value={options.materialTexture}
                      onChange={(e) => handleOptionChange('materialTexture', e.target.value)}
                      options={MATERIAL_TEXTURES}
                    />
                    <ColorPicker
                      label="Stage Background"
                      color={options.backgroundColor}
                      onChange={(color) => handleOptionChange('backgroundColor', color)}
                    />
                    <NumberInput
                      label="Profile Dimension (Spine mm)"
                      value={options.spineWidth}
                      onChange={(e) => handleOptionChange('spineWidth', parseInt(e.target.value, 10))}
                      min={5}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-6">
                  <Button 
                    onClick={handleSubmit} 
                    isLoading={isLoading} 
                    disabled={isPreviewLoading || !coverImage}
                    variant="primary"
                  >
                    {isLoading ? 'RENDERING...' : 'INITIALIZE RENDER'}
                  </Button>
                  <Button
                    onClick={handlePreviewSubmit}
                    isLoading={isPreviewLoading}
                    disabled={isLoading || !coverImage}
                    variant="secondary"
                  >
                    {isPreviewLoading ? 'BATCH RENDERING...' : 'RENDER ALL PERSPECTIVES'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* OUTPUT STAGE (Right) */}
          <div className="lg:col-span-8 bg-monolith-canvas p-8 flex flex-col gap-8 min-h-[800px]">
            <div className="flex justify-between items-end border-b border-monolith-border pb-6 flex-wrap gap-6">
              <div>
                  <h2 className="text-xs font-bold tracking-[0.2em] text-monolith-text-secondary uppercase mb-2">OUTPUT STAGE</h2>
                  <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-light tracking-tight text-white">Rendered Asset Gallery</h1>
                    {generatedMockups.length > 0 && (
                      <span className="text-[10px] font-mono bg-monolith-border text-monolith-text-secondary px-2 py-0.5 border border-monolith-border">
                        COUNT: {generatedMockups.length.toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>
              </div>
              
              {generatedMockups.length > 0 && (
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleDownloadAll}
                    disabled={isZipping || isLoading || isPreviewLoading}
                    variant="secondary"
                    className="!w-auto !py-2 !px-4 !text-[10px]"
                  >
                    <span className="flex items-center gap-2 whitespace-nowrap tracking-widest uppercase">
                      <DownloadIcon className="w-3 h-3" />
                      {isZipping ? 'ZIPPING...' : 'EXPORT ALL'}
                    </span>
                  </Button>
                   <Button
                    onClick={() => setShowClearConfirm(true)}
                    disabled={isZipping || isLoading || isPreviewLoading}
                    variant="danger"
                    className="!w-auto !py-2 !px-4 !text-[10px]"
                  >
                    <span className="flex items-center gap-2 tracking-widest uppercase">
                      <TrashIcon className="w-3 h-3" />
                      PURGE
                    </span>
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1">
              {error && <ErrorDisplay message={error} />}
              <GalleryDisplay
                mockups={generatedMockups}
                isLoading={isLoading || isPreviewLoading}
                onDelete={handleDeleteMockup}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <ConfirmDialog
        isOpen={showClearConfirm}
        title="SYSTEM PURGE"
        onConfirm={handleClearAll}
        onCancel={() => setShowClearConfirm(false)}
      >
        <span className="text-monolith-text-secondary">
          Confirm permanent removal of all rendered assets from the current session. This operation is irreversible.
        </span>
      </ConfirmDialog>
    </div>
  );

};

export default App;