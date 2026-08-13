import React from 'react';
import { CartItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { QuantitySelector } from '../product/QuantitySelector';
import { PriceDisplay } from '../common/PriceDisplay';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartItemRowProps {
  item: CartItem;
  compact?: boolean;
  onItemClick?: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  compact = false,
  onItemClick,
}) => {
  const { removeFromCart, updateQuantity } = useCart();
  const { product, selectedSize, selectedColor, quantity } = item;

  return (
    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl border border-[#E5E5E5] hover:border-gray-300 transition-all">
      {/* Product Image */}
      <Link
        to={`/product/${product.slug}`}
        onClick={onItemClick}
        className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[#F7F7F7] rounded-xl flex-shrink-0 p-2 overflow-hidden flex items-center justify-center border border-[#E5E5E5]"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-extrabold uppercase text-[#777777] tracking-wider">
          {product.brand}
        </p>

        <Link
          to={`/product/${product.slug}`}
          onClick={onItemClick}
          className="text-xs sm:text-sm font-extrabold text-[#111111] hover:text-[#E53935] truncate block transition-colors"
        >
          {product.name}
        </Link>

        {/* Options */}
        <div className="flex items-center gap-2 mt-1 text-xs text-[#777777]">
          <span className="bg-[#F7F7F7] px-2 py-0.5 rounded-md border border-[#E5E5E5] font-bold text-[#111111]">
            Size: {selectedSize}
          </span>
          <span className="bg-[#F7F7F7] px-2 py-0.5 rounded-md border border-[#E5E5E5] font-bold text-[#111111]">
            Color: {selectedColor}
          </span>
        </div>

        {/* Price & Quantity Controls */}
        <div className="flex items-center justify-between gap-2 mt-2">
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={(newQty) =>
              updateQuantity(product.id, selectedSize, selectedColor, newQty)
            }
            maxStock={product.stock}
            size="sm"
          />

          <PriceDisplay
            price={product.price * quantity}
            originalPrice={product.originalPrice ? product.originalPrice * quantity : undefined}
            size={compact ? 'sm' : 'md'}
          />
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(product.id, selectedSize, selectedColor)}
        className="p-2 text-gray-400 hover:text-[#E53935] hover:bg-red-50 rounded-xl transition-colors"
        title="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
