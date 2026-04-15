import React from 'react';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-monolith-text-secondary mb-2">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative w-12 h-12 border border-monolith-border bg-monolith-canvas overflow-hidden shrink-0">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer"
          />
        </div>
        <input
            type="text"
            value={color.toUpperCase()}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full px-4 py-3 text-[11px] font-mono tracking-widest bg-monolith-canvas border border-monolith-border text-monolith-text-primary focus:outline-none focus:ring-1 focus:ring-monolith-signal focus:border-monolith-signal transition-monolith"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
