import React from 'react';

const Spinner: React.FC = () => {
  return (
    <svg 
      className="h-12 w-12 text-monolith-signal" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="currentColor"
    >
      <circle cx="4" cy="12" r="3">
        <animate 
          attributeName="opacity"
          values="0.2; 1; 0.2"
          begin="0s" 
          dur="1.2s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0; 0.5; 1"
          keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
        />
      </circle>
      <circle cx="12" cy="12" r="3">
        <animate 
          attributeName="opacity"
          values="0.2; 1; 0.2"
          begin="0.2s" 
          dur="1.2s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0; 0.5; 1"
          keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
        />
      </circle>
      <circle cx="20" cy="12" r="3">
        <animate 
          attributeName="opacity"
          values="0.2; 1; 0.2"
          begin="0.4s" 
          dur="1.2s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0; 0.5; 1"
          keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
        />
      </circle>
    </svg>
  );
};

export default Spinner;