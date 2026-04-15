import React from 'react';

const iconClasses = "h-10 w-10 mx-auto mb-2 text-monolith-text-muted group-hover:text-monolith-signal transition-monolith";
const selectedIconClasses = "h-10 w-10 mx-auto mb-2 text-monolith-signal";

// Hardcover (Casebound)
export const HardcoverIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25l-1.5-1.5V5.25l1.5-1.5H18l1.5 1.5v13.5l-1.5 1.5H4.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3.75v16.5" />
  </svg>
);

// Perfect Bound - Thick spine, clean softcover look.
export const PerfectBoundIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 3.75h13.5A2.25 2.25 0 0121 6v12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6a2.25 2.25 0 012.25-2.25z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 3.75v16.5" />
  </svg>
);

// Saddle Stitch - Thin, shows staples on spine.
export const SaddleStitchIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75L4.5 6.75v10.5L12 20.25l7.5-3V6.75L12 3.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 9.75h3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 14.25h3" />
  </svg>
);

// Wire-O
export const WireOIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75h9.75A2.25 2.25 0 0121 6v12a2.25 2.25 0 01-2.25 2.25H9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H7.5a3.75 3.75 0 100 7.5H9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75H7.5a3.75 3.75 0 100 7.5H9" />
  </svg>
);

// Spiral/Coil
export const SpiralIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
     <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75h9.75A2.25 2.25 0 0121 6v12a2.25 2.25 0 01-2.25 2.25H9" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M9 5.25s-1.5 1.5 0 3 1.5 1.5 1.5 1.5-1.5 1.5-1.5 1.5 0 3 0 3" />
  </svg>
);

// Section Sewn
export const SectionSewnIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25l-1.5-1.5V5.25l1.5-1.5H18l1.5 1.5v13.5l-1.5 1.5H4.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3.75v16.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5l-2.25 1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12l-2.25 1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 16.5l-2.25 1.5" />
  </svg>
);
