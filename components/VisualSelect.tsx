import React from 'react';

interface VisualSelectOption {
  value: string;
  label: string;
  icon: React.FC<{ selected?: boolean }>;
}

interface VisualSelectProps {
  label: string;
  options: VisualSelectOption[];
  value: string;
  onChange: (value: string) => void;
}

const VisualSelect: React.FC<VisualSelectProps> = ({ label, options, value, onChange }) => {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-monolith-text-secondary mb-3">{label}</label>
      <div className="grid grid-cols-3 gap-2" role="radiogroup">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option.value)}
              className={`group flex flex-col items-center justify-center p-4 border transition-monolith focus:outline-none focus:ring-1 focus:ring-monolith-signal ${
                isSelected
                  ? 'bg-monolith-elevated border-monolith-signal'
                  : 'bg-monolith-surface border-monolith-border hover:border-monolith-text-muted'
              }`}
            >
              <div className={`mb-3 transition-monolith ${isSelected ? 'scale-110 text-monolith-signal' : 'text-monolith-text-muted group-hover:text-monolith-signal'}`}>
                <option.icon selected={isSelected} />
              </div>
              <span
                className={`block text-[9px] font-bold tracking-widest uppercase text-center ${
                  isSelected ? 'text-monolith-signal' : 'text-monolith-text-muted group-hover:text-monolith-signal'
                }`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VisualSelect;

