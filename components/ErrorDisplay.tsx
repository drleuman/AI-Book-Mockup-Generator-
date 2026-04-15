
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-monolith-canvas border border-monolith-signal/30 p-6 mb-10 w-full relative overflow-hidden group" role="alert">
        <div className="absolute top-0 left-0 w-1 h-full bg-monolith-signal"></div>
        <div className="flex items-start">
            <div className="py-1 shrink-0">
                <ErrorIcon />
            </div>
            <div className="space-y-2">
                <p className="text-[11px] font-bold tracking-[0.3em] text-monolith-signal uppercase">Critical_System_Fault</p>
                <div className="bg-monolith-surface p-4 border border-monolith-border">
                    <p className="text-[10px] font-mono text-monolith-text-secondary leading-relaxed uppercase tracking-tight">{message}</p>
                </div>
                <p className="text-[9px] font-mono text-monolith-text-muted uppercase">Action: Verify parameters and re-initialize terminal.</p>
            </div>
        </div>
    </div>
  );
};


export default ErrorDisplay;
