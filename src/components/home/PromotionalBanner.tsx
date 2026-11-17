import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const PromotionalBanner: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-[#0B0B0B] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text Content */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gray-400">
              LIMITED TIME ONLY
            </span>

            <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              Summer Sale
            </h2>

            <p className="text-sm sm:text-base text-gray-300 font-normal">
              Up to 40% off on selected items
            </p>

            <div className="pt-4">
              <Link
                to="/sale"
                className="px-8 py-3.5 bg-white text-black hover:bg-gray-100 text-sm font-bold rounded-full transition-all duration-200 inline-flex items-center gap-2 shadow-sm group"
              >
                <span>Shop the Sale</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Visual: Athletic Sneakers & 40% OFF Typography */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end min-h-[220px] sm:min-h-[260px]">
            {/* Sneaker Pair Image */}
            <div className="relative z-10 w-full max-w-[380px] aspect-[4/3] flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
                alt="Summer Sale Shoes"
                className="max-h-full max-w-full object-contain -rotate-[15deg] drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)]"
              />
            </div>

            {/* Giant 40% OFF Typography matching reference */}
            <div className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none text-right">
              <div className="font-heading font-black text-6xl sm:text-7xl lg:text-[110px] leading-none tracking-tighter text-white">
                40%
              </div>
              <div className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl leading-none tracking-tight text-white/90">
                OFF
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
