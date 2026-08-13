import React from 'react';
import { Ruler } from 'lucide-react';

interface SizeSelectorProps {
  sizes: number[];
  selectedSize: number | null;
  onSelectSize: (size: number) => void;
  onOpenSizeGuide: () => void;
  error?: boolean;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
  onOpenSizeGuide,
  error = false,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
          Select Size (UK/US):
          {selectedSize && (
            <span className="text-xs font-black text-[#E53935]">
              Size {selectedSize}
            </span>
          )}
        </label>

        <button
          type="button"
          onClick={onOpenSizeGuide}
          className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1 transition-colors"
        >
          <Ruler className="w-3.5 h-3.5" />
          Size Guide
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`py-3 rounded-xl font-extrabold text-sm transition-all duration-200 border ${
                isSelected
                  ? 'bg-[#111111] text-white border-[#111111] shadow-md scale-102 ring-2 ring-offset-1 ring-[#111111]'
                  : error
                  ? 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                  : 'bg-white text-[#222222] border-[#E5E5E5] hover:border-[#111111] hover:bg-[#F7F7F7]'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs font-bold text-[#E53935] animate-shake">
          ⚠️ Please select a shoe size to proceed.
        </p>
      )}
    </div>
  );
};
