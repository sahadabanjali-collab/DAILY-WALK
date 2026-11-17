import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { TopBrandsStrip } from '../components/home/TopBrandsStrip';
import { ShopByCategory } from '../components/home/ShopByCategory';
import { PromotionalBanner } from '../components/home/PromotionalBanner';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { ProductCard } from '../components/product/ProductCard';
import { useStoreData } from '../context/StoreDataContext';
import { ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  const { products } = useStoreData();

  // Exactly 5 products for the 5-column Best Sellers row (matching reference image)
  const bestSellersPool = products.filter((p) => p.isBestSeller);
  const bestSellers =
    bestSellersPool.length >= 5
      ? bestSellersPool.slice(0, 5)
      : [...bestSellersPool, ...products.filter((p) => !p.isBestSeller)].slice(0, 5);

  // Additional New Arrivals / Featured styles matching the clean aesthetic
  const newArrivals = products.filter((p) => p.isNew).slice(0, 5);

  return (
    <div className="space-y-0 bg-white">
      {/* 1. Hero Section (Step Into Greatness) */}
      <HeroSection />

      {/* 2. Top Brands Logo Strip (NIKE, Adidas, Puma, New Balance, Converse, Vans) */}
      <TopBrandsStrip />

      {/* 3. Shop by Category (7-column soft rounded cards) */}
      <ShopByCategory />

      {/* 4. Best Sellers (5-column product grid matching reference image) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Header Row: BEST SELLERS on left, View all on right */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="font-heading font-black text-xs sm:text-sm tracking-wider uppercase text-[#111111]">
              BEST SELLERS
            </h2>

            <Link
              to="/shop?bestseller=true"
              className="text-xs font-bold text-gray-600 hover:text-black transition-colors inline-flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 5-column product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Summer Sale Promotional Banner (40% OFF) */}
      <PromotionalBanner />

      {/* 6. Fresh Arrivals 5-column row */}
      {newArrivals.length > 0 && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="font-heading font-black text-xs sm:text-sm tracking-wider uppercase text-[#111111]">
                NEW ARRIVALS
              </h2>

              <Link
                to="/shop?new=true"
                className="text-xs font-bold text-gray-600 hover:text-black transition-colors inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Why Choose Us (Trust Badges matching reference) */}
      <WhyChooseUs />
    </div>
  );
};
