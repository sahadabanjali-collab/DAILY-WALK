import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WishlistPage: React.FC = () => {
  const { wishlist, wishlistCount } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="py-16 bg-[#F7F7F7]/40 min-h-screen flex items-center justify-center">
        <EmptyState
          type="wishlist"
          title="Your Wishlist is Empty"
          description="Save your favorite shoes here and come back whenever you're ready."
          actionText="Explore Shoes"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#F7F7F7]/40 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] flex items-center gap-2">
              <Heart className="w-7 h-7 text-[#E53935] fill-[#E53935]" />
              My Saved Wishlist ({wishlistCount})
            </h1>
            <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
              Your personal footwear favorites saved for later.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#111111] hover:text-[#E53935]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Explore More Shoes
          </Link>
        </div>

        {/* Wishlist Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
