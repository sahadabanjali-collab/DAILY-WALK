import React from 'react';
import { Check } from 'lucide-react';

interface ColorOption {
  name: string;
  hex: string;
}

interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor: string | null;
  onSelectColor: (colorName: string) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onSelectColor,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
          Color:
        </label>
        <span className="text-xs font-bold text-[#777777]">
          {selectedColor || colors[0]?.name}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {colors.map((color) => {
          const isSelected = (selectedColor || colors[0]?.name) === color.name;
          const isWhite = color.hex.toLowerCase() === '#ffffff';

          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onSelectColor(color.name)}
              title={color.name}
              className={`group relative flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all ${
                isSelected
                  ? 'border-[#111111] bg-gray-100 ring-2 ring-[#111111] shadow-xs'
                  : 'border-[#E5E5E5] hover:border-gray-400 bg-white'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isWhite ? 'border border-gray-300' : ''
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-3.5 h-3.5 ${isWhite ? 'text-[#111111]' : 'text-white'}`}
                  />
                )}
              </span>
              <span className="text-xs font-bold text-[#222222]">{color.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
