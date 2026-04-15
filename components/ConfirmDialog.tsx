import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, title, children, onConfirm, onCancel }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className="bg-monolith-surface border border-monolith-border shadow-[0_0_50px_rgba(0,0,0,0.5)] p-10 max-w-md w-full animate-in fade-in zoom-in duration-300">
        <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-4 bg-monolith-signal"></div>
            <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-white" id="modal-title">
            {title}
            </h3>
        </div>
        
        <div className="mb-10 min-h-[60px]">
          <div className="text-[11px] font-medium tracking-widest text-monolith-text-secondary uppercase leading-relaxed text-center">
            {children}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="w-full py-4 text-[10px] font-bold tracking-[0.2em] uppercase bg-transparent text-monolith-text-muted border border-monolith-border hover:text-white hover:border-white transition-monolith"
            onClick={onCancel}
          >
            Abort_Action
          </button>
          <button
            type="button"
            className="w-full py-4 text-[10px] font-bold tracking-[0.2em] uppercase bg-monolith-signal text-white hover:bg-red-700 transition-monolith"
            onClick={onConfirm}
          >
            Confirm_Execute
          </button>
        </div>
      </div>
    </div>
  );
};


export default ConfirmDialog;
