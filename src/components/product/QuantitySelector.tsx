import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQty: number) => void;
  maxStock?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  maxStock = 99,
  size = 'md',
}) => {
  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxStock) {
      onQuantityChange(quantity + 1);
    }
  };

  const heights = {
    sm: 'h-8 text-xs',
    md: 'h-11 text-sm',
    lg: 'h-12 text-base',
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`inline-flex items-center bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl overflow-hidden ${heights[size]}`}
      >
        <button
          type="button"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          className="px-3.5 h-full text-[#111111] hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex items-center justify-center font-bold"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="px-4 font-black text-[#111111] min-w-[2.5rem] text-center select-none">
          {quantity}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={quantity >= maxStock}
          className="px-3.5 h-full text-[#111111] hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex items-center justify-center font-bold"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {maxStock <= 10 && maxStock > 0 && (
        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
          Only {maxStock} left in stock!
        </span>
      )}
    </div>
  );
};
