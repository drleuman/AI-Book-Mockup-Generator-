import React, { useState } from 'react';
import type { GeneratedMockup } from '../types';
import ConfirmDialog from './ConfirmDialog';
import Lightbox from './Lightbox';
import { createSafeAssetFilename } from '../utils/security';

interface MockupCardProps {
  mockup: GeneratedMockup;
  onDelete: (id: string) => void;
}

export const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const ZoomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);


const MockupCard: React.FC<MockupCardProps> = ({ mockup, onDelete }) => {
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleDownloadRequest = () => {
    setShowDownloadConfirm(true);
  };

  const executeDownload = () => {
    const link = document.createElement('a');
    link.href = mockup.imageUrl;
    const filename = createSafeAssetFilename('ASSET', '.png', mockup.perspectiveLabel);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadConfirm(false);
  };

  const handleDeleteRequest = () => {
      setShowDeleteConfirm(true);
  }

  const executeDelete = () => {
      onDelete(mockup.id);
      setShowDeleteConfirm(false);
  }

  return (
    <>
      <div className="group relative bg-monolith-canvas border border-monolith-border transition-monolith hover:border-monolith-signal/50 overflow-hidden">
        {mockup.isPreview && (
          <div className="absolute top-0 left-0 bg-monolith-signal text-white text-[9px] font-bold tracking-[0.2em] px-3 py-1.5 z-10 select-none uppercase">
            Preview_Low_Res
          </div>
        )}
        
        <div className="aspect-[3/4] overflow-hidden flex items-center justify-center bg-[#0a0a0a]">
            <img src={mockup.imageUrl} alt="Generated asset render" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-monolith-canvas/80 opacity-0 group-hover:opacity-100 transition-monolith flex flex-col items-center justify-center gap-6">
            <div className="flex items-center gap-3 translate-y-4 group-hover:translate-y-0 transition-monolith duration-300">
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="p-4 bg-monolith-surface border border-monolith-border text-white hover:bg-monolith-signal hover:border-monolith-signal transition-monolith"
                  aria-label="Inspect asset"
                >
                    <ZoomIcon />
                </button>
                <button 
                  onClick={executeDownload} 
                  className="p-4 bg-monolith-surface border border-monolith-border text-white hover:bg-monolith-signal hover:border-monolith-signal transition-monolith" 
                  aria-label="Export asset"
                >
                    <DownloadIcon />
                </button>
                 <button 
                  onClick={handleDeleteRequest} 
                  className="p-4 bg-monolith-surface border border-monolith-border text-monolith-signal hover:bg-monolith-signal hover:text-white transition-monolith" 
                  aria-label="Purge asset"
                 >
                    <DeleteIcon />
                </button>
            </div>
            
            <div className="text-center translate-y-4 group-hover:translate-y-0 transition-monolith duration-500 delay-75">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white mb-1">{mockup.perspectiveLabel}</p>
                <p className="text-[9px] font-mono tracking-widest text-monolith-text-muted">ID: {mockup.id.slice(-8).toUpperCase()}</p>
            </div>
        </div>

        {/* Static Footer Info */}
        <div className="p-4 border-t border-monolith-border bg-monolith-surface flex justify-between items-center">
            <span className="text-[9px] font-bold tracking-widest text-monolith-text-secondary uppercase">{mockup.perspectiveLabel}</span>
            <span className="text-[9px] font-mono text-monolith-text-muted">SYS_READY</span>
        </div>
      </div>

       <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="PURGE ASSET"
        onConfirm={executeDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      >
        <span className="text-monolith-text-secondary uppercase text-[10px] tracking-widest leading-loose">
            Confirm permanent deletion of asset unit <span className="text-white">[{mockup.id}]</span>.
        </span>
      </ConfirmDialog>

      <Lightbox
        isOpen={isLightboxOpen}
        imageUrl={mockup.imageUrl}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
};


export default MockupCard;