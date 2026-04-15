import React from 'react';

interface LightboxProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Lightbox: React.FC<LightboxProps> = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/98 transition-opacity duration-500 p-8"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-monolith-text-muted hover:text-white transition-monolith z-10 flex items-center gap-3 group"
        aria-label="Exit inspection"
      >
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-0 group-hover:opacity-100 transition-monolith">EXIT_INSPECTION</span>
        <CloseIcon />
      </button>

      <div className="relative w-full h-full flex items-center justify-center border border-monolith-border bg-monolith-canvas">
        <img
          src={imageUrl}
          alt="Technical asset detail"
          className="max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()} 
        />
        
        {/* Detail Metadata Overlay */}
        <div className="absolute bottom-6 left-6 text-[10px] font-mono text-monolith-text-muted uppercase tracking-[0.2em] flex gap-8">
            <div className="flex flex-col gap-1">
                <span className="text-[8px] text-monolith-signal">SOURCE_PATH</span>
                <span>ROOT://ASSETS/RENDERS/EXPORT_UNIT_01</span>
            </div>
             <div className="flex flex-col gap-1">
                <span className="text-[8px] text-monolith-signal">VIEW_MODE</span>
                <span>FULL_DYNAMIC_RANGE</span>
            </div>
        </div>
      </div>
    </div>
  );
};


export default Lightbox;