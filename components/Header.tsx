
import React from 'react';



const Header: React.FC = () => {
  return (
    <header className="bg-monolith-canvas border-b border-monolith-border py-6 px-12">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="PrintPrice Logo" className="h-10 w-10 object-contain" />
          <div>
            <h1 className="text-[14px] font-bold tracking-[0.4em] text-white uppercase leading-none">
              PrintPrice_Mockup
            </h1>
            <p className="text-[9px] font-mono text-monolith-signal tracking-widest uppercase mt-1">
              Workstation v2.5
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
            <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono text-monolith-text-muted uppercase">Kernel_Status</span>
                <span className="text-[9px] font-mono text-green-500 uppercase">System_Online</span>
            </div>
             <div className="flex flex-col items-end border-l border-monolith-border pl-8">
                <span className="text-[9px] font-mono text-monolith-text-muted uppercase">Render_Core</span>
                <span className="text-[9px] font-mono text-monolith-text-secondary uppercase">Gemini_Vision_v2</span>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
