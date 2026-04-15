import React, { useState, useEffect } from 'react';
import type { GeneratedMockup } from '../types';
import Spinner from './Spinner';
import MockupCard from './MockupCard';

interface GalleryDisplayProps {
  mockups: GeneratedMockup[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const LOADING_MESSAGES = [
  'INITIALIZING GENERATIVE KERNEL...',
  'ANALYZING SOURCE GEOMETRY...',
  'COMPUTING LIGHT TRANSPORT...',
  'RENDERING MATERIAL SUBSURFACES...',
  'MAPPING VOLUMETRIC SHADOWS...',
  'FINALIZING ASSET RENDER...',
  'BUFFERING OUTPUT...'
];

const PlaceholderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-monolith-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const LoadingCard: React.FC = () => (
    <div className="aspect-[3/4] bg-monolith-surface border border-monolith-border flex flex-col items-center justify-center gap-4 animate-pulse">
        <Spinner />
        <span className="text-[9px] font-mono tracking-widest text-monolith-text-muted uppercase">RENDERING_IN_PROGRESS</span>
    </div>
);


const GalleryDisplay: React.FC<GalleryDisplayProps> = ({ mockups, isLoading, onDelete }) => {
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    if (isLoading) {
      setLoadingMessageIndex(0); 
      interval = window.setInterval(() => {
        setLoadingMessageIndex(prevIndex => (prevIndex + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading]);
  
  if (isLoading && mockups.length === 0) {
    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-12 bg-monolith-surface border border-monolith-border h-full min-h-[400px]">
            <Spinner />
            <div className="mt-8 space-y-2">
                <p className="text-[11px] font-bold tracking-[0.2em] text-monolith-signal uppercase h-6">
                {LOADING_MESSAGES[loadingMessageIndex]}
                </p>
                <p className="text-[9px] font-mono text-monolith-text-muted uppercase tracking-widest">Est. Time: <span className="text-monolith-text-secondary">VARIES_BY_COMPLEXITY</span></p>
            </div>
        </div>
    );
  }

  if (!isLoading && mockups.length === 0) {
      return (
        <div className="flex-grow flex flex-col items-center justify-center text-center bg-monolith-surface border border-monolith-border p-12 h-full min-h-[400px]">
          <div className="mb-6 opacity-40">
            <PlaceholderIcon />
          </div>
          <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-monolith-text-primary mb-2">Stage Empty</h3>
          <p className="max-w-xs text-[10px] text-monolith-text-muted uppercase tracking-widest leading-relaxed">
            Configure parameters and initialize render to populate the output stage.
          </p>
        </div>
      );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
      {mockups.map((mockup) => (
        <MockupCard key={mockup.id} mockup={mockup} onDelete={onDelete} />
      ))}
      {isLoading && <LoadingCard />}
    </div>
  );
};

export default GalleryDisplay;

