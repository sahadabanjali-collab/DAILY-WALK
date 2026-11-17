import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Heart, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);

  // Subtitle matching reference (e.g. "Men's Shoes", "Unisex Shoes", "Women's Shoes")
  const subtitle = product.gender
    ? `${product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}'s Shoes`
    : `${product.category.charAt(0).toUpperCase() + product.category.slice(1)} Shoes`;

  // Format currency in Indian Rupees
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  const handleQuickAdd = (size: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, product.colors[0]?.name || null);
    setShowSizePicker(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group flex flex-col justify-between select-none relative">
      <div>
        {/* Soft #F6F6F6 Rounded Image Box (Matching Reference) */}
        <div className="relative aspect-square w-full bg-[#F6F6F6] rounded-2xl overflow-hidden flex items-center justify-center p-4 group-hover:bg-[#EFEFEF] transition-colors">
          <Link to={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
            <img
              src={product.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=75'}
              alt={product.name}
              className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500"
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

          {/* Floating Stroke Heart Icon in Top Right (Matching Reference) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute top-3 right-3 p-1 text-neutral-600 hover:text-black transition-colors z-10"
            aria-label="Save to Wishlist"
          >
            <Heart
              className={`w-5 h-5 stroke-[1.6] transition-colors ${
                inWishlist ? 'fill-[#E53935] text-[#E53935]' : 'hover:stroke-black'
              }`}
            />
          </button>

          {/* Subtle Quick Add Button on Hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowSizePicker(!showSizePicker);
            }}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white text-black shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-white"
            title="Quick Add"
          >
            {justAdded ? <Check className="w-4 h-4 text-emerald-500" /> : <Plus className="w-4 h-4" />}
          </button>

          {/* Quick Size Picker Dropdown if opened */}
          {showSizePicker && (
            <div
              className="absolute inset-x-2 bottom-2 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-xl border border-gray-100 z-20 animate-in fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Select Size (UK)</span>
                <button
                  onClick={() => setShowSizePicker(false)}
                  className="text-[10px] text-gray-400 hover:text-black font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={(e) => handleQuickAdd(sz, e)}
                    className="py-1 bg-gray-100 hover:bg-black hover:text-white rounded text-[11px] font-bold text-gray-800 transition-colors"
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Clean Typography Info below image (Matching Reference) */}
        <div className="mt-3">
          <Link
            to={`/product/${product.slug}`}
            className="block font-heading font-bold text-[13px] sm:text-sm text-[#111111] hover:text-black line-clamp-1 transition-colors"
          >
            {product.name}
          </Link>

          <p className="text-[11px] sm:text-xs text-[#777777] font-normal mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Bottom Row: Price & Rating (Matching Reference) */}
      <div className="flex items-center justify-between mt-2 pt-1">
        <span className="font-heading font-extrabold text-[13px] sm:text-sm text-[#111111]">
          {formattedPrice}
        </span>

        <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#444444]">
          <span className="text-amber-500 text-xs">★</span>
          <span>{product.rating.toFixed(1)}</span>
          <span className="text-[#888888] font-normal">
            ({product.reviewCount > 999 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount})
          </span>
        </div>
      </div>
    </div>
  );
};
