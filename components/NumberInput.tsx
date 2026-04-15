
import React from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, min, max, step }) => {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-monolith-text-secondary mb-2">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className="block w-full px-4 py-3 text-[11px] font-mono tracking-widest bg-monolith-canvas border border-monolith-border text-monolith-text-primary focus:outline-none focus:ring-1 focus:ring-monolith-signal focus:border-monolith-signal transition-monolith"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-mono text-monolith-text-muted">MM</div>
      </div>
    </div>
  );
};

export default NumberInput;
