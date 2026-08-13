import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { ShopByCategory } from '../components/home/ShopByCategory';
import { PromotionalBanner } from '../components/home/PromotionalBanner';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { CustomerReviews } from '../components/home/CustomerReviews';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { ProductCard } from '../components/product/ProductCard';
import { MOCK_PRODUCTS } from '../data/products';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  const featuredProducts = MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = MOCK_PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = MOCK_PRODUCTS.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="space-y-0">
      {/* 3. Hero Section */}
      <HeroSection />

      {/* 4. Category Section */}
      <ShopByCategory />

      {/* 5. Featured Products Section */}
      <section className="py-16 bg-[#F7F7F7]/60 border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E53935] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Handpicked Styles
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
                Featured Shoes
              </h2>
              <p className="text-sm text-[#777777] font-medium mt-1">
                Our most-loved styles, selected for you.
              </p>
            </div>

            <Link
              to="/shop?featured=true"
              className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#111111] hover:text-[#E53935] transition-colors group"
            >
              <span>Explore Featured</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Promotional Banner */}
      <PromotionalBanner />

      {/* 7. Best Sellers Section */}
      <section className="py-16 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
                Best Sellers
              </h2>
              <p className="text-sm text-[#777777] font-medium mt-1">
                The shoes everyone is talking about.
              </p>
            </div>

            <Link
              to="/shop?bestseller=true"
              className="px-5 py-2.5 bg-[#111111] text-white hover:bg-[#E53935] text-xs font-extrabold rounded-xl transition-colors shadow-xs"
            >
              View All Best Sellers
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. New Arrivals Section */}
      <section className="py-16 bg-[#F7F7F7]/60 border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
                Fresh Arrivals
              </h2>
              <p className="text-sm text-[#777777] font-medium mt-1">
                New styles have just landed.
              </p>
            </div>

            <Link
              to="/shop?new=true"
              className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#111111] hover:text-[#E53935] transition-colors group"
            >
              <span>Explore New Arrivals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. Why Choose Daily Walk */}
      <WhyChooseUs />

      {/* 10. Customer Reviews */}
      <CustomerReviews />

      {/* 11. Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};
