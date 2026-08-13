import React from 'react';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  discount?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical';
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  discount,
  size = 'md',
  layout = 'horizontal',
}) => {
  const currentSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base font-extrabold',
    lg: 'text-xl font-black',
    xl: 'text-2xl sm:text-3xl font-black',
  };

  const originalSizes = {
    sm: 'text-xs',
    md: 'text-xs sm:text-sm',
    lg: 'text-sm',
    xl: 'text-base',
  };

  const badgeSizes = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-[11px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1',
    xl: 'text-xs px-3 py-1 font-bold',
  };

  const formattedPrice = `₹${price.toLocaleString('en-IN')}`;
  const formattedOriginal = originalPrice ? `₹${originalPrice.toLocaleString('en-IN')}` : null;

  return (
    <div
      className={`flex ${
        layout === 'vertical' ? 'flex-col items-start gap-0.5' : 'items-center gap-2 flex-wrap'
      }`}
    >
      <span className={`text-[#111111] tracking-tight ${currentSizes[size]}`}>
        {formattedPrice}
      </span>

      {originalPrice && originalPrice > price && (
        <span className={`line-through text-[#777777] font-medium ${originalSizes[size]}`}>
          {formattedOriginal}
        </span>
      )}

      {discount && discount > 0 && (
        <span
          className={`bg-[#E53935] text-white font-bold rounded-md uppercase tracking-wider ${badgeSizes[size]}`}
        >
          {discount}% OFF
        </span>
      )}
    </div>
  );
};
