import React from 'react';

const iconClasses = "h-10 w-10 mx-auto mb-2 text-monolith-text-muted group-hover:text-monolith-signal transition-monolith";
const selectedIconClasses = "h-10 w-10 mx-auto mb-2 text-monolith-signal";

export const View34Icon: React.FC<{ selected?: boolean }> = ({ selected }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10l8 4 8-4V7l-8-4-8 4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8 4v10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11l8-4" />
    </svg>
);

export const FrontViewIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="6" y="4" width="12" height="16" rx="1" />
    </svg>
);

export const IsometricIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-5 9 5-9 5-9-5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12v6l9 5v-6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12v6l-9 5v-6" />
    </svg>
);

export const FlatLayIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
    </svg>
);

export const DutchAngleIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
         <rect x="3" y="6" width="12" height="16" rx="1" transform="rotate(-15 9 14)" />
    </svg>
);

export const EyeLevelIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="6" y="7" width="12" height="10" rx="1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20" />
    </svg>
);

export const SpineViewIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="10" y="4" width="4" height="16" rx="1" />
    </svg>
);

export const WormsEyeIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 10l8 6 8-6-8-6-8 6z" />
    </svg>
);

export const CloseupIcon: React.FC<{ selected?: boolean }> = ({ selected }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={selected ? selectedIconClasses : iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="8" y="4" width="12" height="16" rx="1" />
        <circle cx="8" cy="8" r="5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4L4.5 11.5" />
    </svg>
);