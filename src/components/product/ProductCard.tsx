import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { PriceDisplay } from '../common/PriceDisplay';
import { RatingStars } from '../common/RatingStars';
import { Heart, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedQuickSize, setSelectedQuickSize] = useState<number | null>(null);
  const [isQuickSizeOpen, setIsQuickSizeOpen] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedQuickSize) {
      setIsQuickSizeOpen(true);
      return;
    }

    addToCart(product, selectedQuickSize, product.colors[0]?.name || null);
    setIsQuickSizeOpen(false);
  };

  const handleSelectSizeAndAdd = (size: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedQuickSize(size);
    addToCart(product, size, product.colors[0]?.name || null);
    setIsQuickSizeOpen(false);
  };

  return (
    <div className="group bg-white rounded-2xl p-3 sm:p-4 border border-[#E5E5E5] hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* Product Image Area */}
      <div>
        <div className="relative aspect-square w-full bg-[#F7F7F7] rounded-xl overflow-hidden flex items-center justify-center p-3 mb-3 group-hover:bg-gray-100/80 transition-colors">
          <Link to={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
            <img
              src={product.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=75'}
              alt={product.name}
              className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.failed) {
                  target.dataset.failed = 'true';
                  target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=75';
                }
              }}
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none z-10">
            {product.isNew && (
              <span className="px-2 py-0.5 bg-[#111111] text-white text-[10px] font-extrabold uppercase rounded-md tracking-wider shadow-xs">
                NEW
              </span>
            )}
            {product.isBestSeller && (
              <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-extrabold uppercase rounded-md tracking-wider shadow-xs">
                BEST SELLER
              </span>
            )}
            {product.isSale && product.discount > 0 && (
              <span className="px-2 py-0.5 bg-[#E53935] text-white text-[10px] font-extrabold uppercase rounded-md tracking-wider shadow-xs">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
              inWishlist
                ? 'bg-[#E53935] text-white shadow-md'
                : 'bg-white/90 text-[#222222] hover:bg-[#E53935] hover:text-white shadow-xs'
            }`}
            aria-label="Toggle Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
          </button>

          {/* Hover View Button Overlay (Desktop) */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 hidden lg:flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Link
              to={`/product/${product.slug}`}
              className="flex-1 py-2 bg-white/90 backdrop-blur-xs text-[#111111] hover:bg-[#111111] hover:text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </Link>
          </div>
        </div>

        {/* Product Meta */}
        <div className="space-y-1">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#777777]">
            {product.brand}
          </p>

          <Link
            to={`/product/${product.slug}`}
            className="block text-xs sm:text-sm font-extrabold text-[#222222] hover:text-[#E53935] line-clamp-1 transition-colors"
          >
            {product.name}
          </Link>

          <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
        </div>
      </div>

      {/* Price & Add To Cart Button */}
      <div className="mt-3 pt-3 border-t border-[#E5E5E5]/60 flex flex-col gap-2">
        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
          discount={product.discount}
          size="sm"
        />

        {/* Quick Size Select Drawer overlay if triggered */}
        {isQuickSizeOpen ? (
          <div className="bg-[#F7F7F7] p-2 rounded-xl border border-[#E5E5E5] animate-fade-in">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-[#111111]">Select Size:</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsQuickSizeOpen(false);
                }}
                className="text-[10px] font-bold text-[#777777] hover:text-[#111111]"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-6 gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleSelectSizeAndAdd(size, e)}
                  className="py-1 bg-white hover:bg-[#111111] hover:text-white border border-[#E5E5E5] rounded-md text-xs font-bold text-[#222222] transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 px-3 bg-[#111111] text-white hover:bg-[#E53935] text-xs font-extrabold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};
