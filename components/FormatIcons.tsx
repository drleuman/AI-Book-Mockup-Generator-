import React from 'react';

const iconClasses = "h-10 w-10 mx-auto mb-2 text-monolith-text-muted group-hover:text-monolith-signal transition-monolith";
const selectedIconClasses = "h-10 w-10 mx-auto mb-2 text-monolith-signal";

export const VerticalIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <rect x="6" y="4" width="12" height="16" rx="2" />
  </svg>
);

export const HorizontalIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
     <rect x="4" y="7" width="16" height="10" rx="2" />
  </svg>
);

export const SquareIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
);