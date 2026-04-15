
import React from 'react';

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

const SelectInput: React.FC<SelectInputProps> = ({ label, value, onChange, options }) => {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-monolith-text-secondary mb-2">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="block w-full px-4 py-3 text-[11px] font-mono tracking-widest uppercase bg-monolith-canvas border border-monolith-border text-monolith-text-primary focus:outline-none focus:ring-1 focus:ring-monolith-signal focus:border-monolith-signal transition-monolith appearance-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23FF1A1A' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-monolith-surface">
            {option.label.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
