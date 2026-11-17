import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';

export const HeroSection: React.FC = () => {
  const { cmsData } = useStoreData();
  const hero = cmsData.hero;

  // Authentic high-top dynamic sneaker hero image matching reference
  const heroSneakerImage =
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85';

  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-2 pb-6">
      <div className="max-w-7xl mx-auto bg-[#F6F6F6] rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[440px] sm:min-h-[480px]">
          {/* Left Text Content */}
          <div className="lg:col-span-6 space-y-6 z-10">
            {/* Main Headline */}
            <h1 className="font-heading font-black text-5xl sm:text-6xl lg:text-[72px] text-[#111111] leading-[1.03] tracking-tight">
              Step Into <br />
              <span>Greatness</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#666666] font-normal max-w-md leading-relaxed">
              {hero?.subtitle || 'Discover authentic branded shoes for every step of your journey.'}
            </p>

            {/* Pill CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/shop"
                className="px-8 py-3.5 bg-black text-white hover:bg-neutral-800 text-sm font-bold rounded-full transition-all duration-200 inline-flex items-center gap-2 shadow-sm group"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/shop?filter=brands"
                className="px-8 py-3.5 bg-white text-black hover:bg-gray-50 border border-gray-300 text-sm font-bold rounded-full transition-all duration-200 inline-flex items-center gap-2"
              >
                <span>Explore Brands</span>
              </Link>
            </div>
          </div>

          {/* Right Sneaker Visual */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Sneaker Image with Dynamic Angle & Floor Shadow */}
            <div className="relative w-full max-w-[520px] aspect-[4/3] flex items-center justify-center">
              <img
                src={heroSneakerImage}
                alt="Nike Air Jordan 1 Sneaker"
                className="w-full h-full object-contain -rotate-[12deg] hover:rotate-[-8deg] transition-transform duration-700 select-none drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)]"
              />

              {/* Floor Shadow Simulation */}
              <div className="absolute -bottom-2 w-3/4 h-6 bg-black/15 blur-xl rounded-full" />
            </div>

            {/* Dark Translucent Badge (Matching Reference bottom-right) */}
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black/90 backdrop-blur-md text-white rounded-2xl px-5 py-3 shadow-xl z-20 border border-white/10">
              <p className="text-[10px] font-medium tracking-wider text-gray-400 uppercase">
                New Arrivals
              </p>
              <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                Nike Air Jordan 1
              </p>
              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
