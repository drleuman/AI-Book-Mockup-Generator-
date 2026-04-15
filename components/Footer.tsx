
import React, { useState } from 'react';

const SocialIconX = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
  </svg>
);

const SocialIconLinkedIn = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const SocialIconFacebook = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83a1.734 1.734 0 0 0-1.957 1.874v2.249h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const SocialIconTikTok = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96a6.622 6.622 0 0 1 7.74-1.06c.36.19.7.42 1.02.68l.04-4.07c-1.4.35-2.86.3-4.26-.06-1.45-.36-2.79-1.18-3.81-2.26-1.04-1.11-1.68-2.52-1.85-4.04H12.525z" />
  </svg>
);

const Footer: React.FC = () => {
  const [showCookiesModal, setShowCookiesModal] = useState(false);

  const handleCookieConsent = () => {
    setShowCookiesModal(true);
    window.dispatchEvent(new CustomEvent('ppp_reopen_consent'));
  };

  return (
    <footer className="bg-[#050505] border-t border-monolith-border pt-16 pb-8 mt-20 relative">
      <div className="container mx-auto px-6 max-w-[1400px]">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          
          {/* Brand Block */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="PrintPrice Logo" className="h-6 w-6 object-contain" />
              <h2 className="text-[12px] font-bold tracking-[0.2em] text-white uppercase">PRINTPRICE PRO</h2>
            </div>
            
            <div className="space-y-1">
              <p className="text-[11px] text-monolith-text-secondary">Know your print cost.</p>
              <p className="text-[11px] text-monolith-text-secondary">Fix your files.</p>
              <p className="text-[11px] text-monolith-text-secondary">Choose the best printer.</p>
            </div>

            <p className="text-[10px] font-bold tracking-[0.1em] text-monolith-signal uppercase">
              PRICE IT. FIX IT. PRINT IT.
            </p>

            <div className="flex items-center gap-2 pt-2">
                {[
                    { icon: SocialIconX, url: 'https://x.com/printpricepro' },
                    { icon: SocialIconLinkedIn, url: 'https://www.linkedin.com/company/print-price-pro/' },
                    { icon: SocialIconFacebook, url: 'https://facebook.com/printpricepro' },
                    { icon: SocialIconTikTok, url: 'https://tiktok.com/@printpricepro' }
                ].map((social, idx) => (
                    <a 
                        key={idx}
                        href={social.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-8 h-8 flex items-center justify-center border border-monolith-border text-monolith-text-muted hover:text-monolith-signal hover:border-monolith-signal transition-monolith"
                    >
                        <social.icon />
                    </a>
                ))}
            </div>
          </div>

          {/* Platform */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-white uppercase mb-6">PLATFORM</h3>
            <ul className="space-y-4">
              <li><a href="https://printprice.pro/platform" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">Overview</a></li>
              <li><a href="https://printprice.pro/products/budget" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">Pricing Engine</a></li>
              <li><a href="https://printprice.pro/products/preflight" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">File Validation</a></li>
              <li><a href="https://printprice.pro/products/control" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">Control Plane</a></li>
              <li><a href="https://mockup.printprice.pro/" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">Mockup Generation</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-white uppercase mb-6">RESOURCES</h3>
            <ul className="space-y-4">
              <li><a href="https://docs.printprice.pro/" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">Documentation</a></li>
              <li><a href="https://api.printprice.pro/" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">API</a></li>
              <li><a href="https://printprice.pro/developers" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">Developer Portal</a></li>
              <li><a href="https://printprice.pro/ai-agent" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">AI Agent</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-white uppercase mb-6">CONNECT</h3>
            <ul className="space-y-4">
              <li><a href="https://printprice.pro/company" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">The Lab</a></li>
              <li><a href="https://printprice.pro/contact" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">Architects</a></li>
              <li><a href="https://printprice.pro/governance" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">Governance</a></li>
              <li><a href="https://printprice.pro/contact/partner" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">Supply Network</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-white uppercase mb-6">LEGAL</h3>
            <ul className="space-y-4">
              <li><a href="https://printprice.pro/legal/terms-of-service" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">Terms</a></li>
              <li><a href="https://printprice.pro/legal/privacy-policy" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">Privacy</a></li>
              <li><a href="https://printprice.pro/legal/legal-notice" className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">Legal</a></li>
              <li><button onClick={handleCookieConsent} className="text-[11px] text-monolith-text-secondary hover:text-white transition-monolith">Cookies</button></li>
            </ul>
          </div>

        </div>

        {/* Corporate Baseline */}
        <div className="pt-12 border-t border-monolith-border space-y-4">
            <p className="text-[9px] font-mono text-monolith-text-muted uppercase tracking-tight">
                WE USE ANALYTICS AND TELEMETRY TO IMPROVE YOUR EXPERIENCE. NO PERSONAL DATA IS SOLD.
            </p>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 lg:gap-4">
                <div className="space-y-1">
                    <p className="text-[9px] font-mono text-monolith-text-muted uppercase tracking-tight">
                        © 2026 PRINTPRICE PRO (V2.5) — PRINT PRICE PRO SIA
                    </p>
                    <p className="text-[9px] font-mono text-monolith-text-muted uppercase tracking-tight">
                        BRIVIBAS IELA 30-8, LATGALES PRIEKSPILSETA, RIGA, LV-1008, LATVIA
                    </p>
                    <p className="text-[9px] font-mono text-monolith-text-muted uppercase tracking-tight">
                        REGISTRATION NUMBER: 40203531570 — VAT ID: LV40203531570
                    </p>
                </div>
                
                <p className="text-[9px] font-mono text-monolith-text-muted uppercase tracking-[0.2em]">
                    INFRASTRUCTURE BY PRINTPRICE OS
                </p>
            </div>
        </div>
      </div>

      {/* Cookie Preferences Modal */}
      {showCookiesModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-6 animate-in fade-in duration-300">
            <div className="w-full max-w-[600px] bg-monolith-surface border border-monolith-border p-10 shadow-2xl animate-in zoom-in duration-300">
                <h3 className="text-xl font-bold text-white mb-8 tracking-tight">Cookie Preferences</h3>
                
                <div className="space-y-8 mb-12">
                    {/* Essential */}
                    <div className="flex justify-between items-center opacity-80 border-b border-monolith-border/30 pb-6">
                        <div className="space-y-1">
                            <div className="text-[11px] font-bold text-white uppercase tracking-wider">Essential Cookies</div>
                            <div className="text-[10px] text-monolith-text-muted uppercase font-mono">Required for platform functionality.</div>
                        </div>
                        <div className="text-[9px] font-bold text-monolith-signal border border-monolith-signal px-2 py-1 tracking-widest">ALWAYS ON</div>
                    </div>

                    {/* Analytics */}
                    <div className="flex justify-between items-center pb-2">
                        <div className="space-y-1">
                            <div className="text-[11px] font-bold text-white uppercase tracking-wider">Analytics & Telemetry</div>
                            <div className="text-[10px] text-monolith-text-muted uppercase font-mono leading-relaxed max-w-[340px]">
                                Behavioral tracking, performance signals, and UX optimization.
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-monolith-border peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-monolith-signal rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-none after:h-5 after:w-5 after:transition-all peer-checked:bg-monolith-signal transition-monolith"></div>
                        </label>
                    </div>
                </div>

                <div className="flex gap-4 justify-end">
                    <button 
                        onClick={() => setShowCookiesModal(false)}
                        className="px-6 py-3 text-[10px] font-bold tracking-widest text-monolith-text-muted border border-monolith-border hover:text-white hover:border-white transition-monolith uppercase"
                    >
                        Back
                    </button>
                    <button 
                         onClick={() => setShowCookiesModal(false)}
                        className="px-8 py-3 text-[10px] font-bold tracking-widest text-white bg-monolith-signal hover:bg-red-800 transition-monolith uppercase"
                    >
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
