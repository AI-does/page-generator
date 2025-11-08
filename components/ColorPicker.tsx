
import React from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (newColor: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, onRemove, canRemove }) => {
  return (
    <div className="relative group">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded-full border-2 border-slate-500 cursor-pointer appearance-none bg-transparent"
        style={{ '--color': color } as React.CSSProperties}
      />
      {canRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove color"
        >
          &times;
        </button>
      )}
      <style>{`
        input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;
        }
        input[type="color"]::-webkit-color-swatch {
          border: none;
          border-radius: 50%;
          background-color: var(--color);
        }
        input[type="color"]::-moz-color-swatch {
          border: none;
          border-radius: 50%;
          background-color: var(--color);
        }
      `}</style>
    </div>
  );
};
