import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F7F7F7] via-white to-[#F7F7F7] py-12 lg:py-16 border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-center lg:text-left">
            {/* Promotional Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E53935]/10 border border-[#E53935]/20 text-[#E53935] text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>UP TO 40% OFF SEASONAL COLLECTION</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#111111] tracking-tight leading-[1.1]">
              Step Into Your <br />
              <span className="text-[#E53935]">Everyday Style</span>
            </h1>

            {/* Supporting text */}
            <p className="text-base sm:text-lg text-[#777777] max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Discover stylish, comfortable footwear designed to keep you moving every day — from ultra-cushioned runners to handcrafted formal leathers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                to="/men"
                className="w-full sm:w-auto px-8 py-4 bg-[#111111] text-white hover:bg-[#E53935] text-sm font-extrabold rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Shop Men</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/women"
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#111111] hover:bg-gray-100 border border-[#E5E5E5] text-sm font-extrabold rounded-2xl shadow-xs transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Shop Women</span>
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#777777] font-bold border-t border-[#E5E5E5]/60">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Original Shoes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#E53935]">★ 4.9/5</span>
                <span>Over 10,000+ Happy Feet</span>
              </div>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="relative">
            <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-3xl overflow-hidden bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-50 border border-[#E5E5E5] shadow-xl p-6 flex items-center justify-center group">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
                alt="Daily Walk Premium Footwear Hero"
                className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Badge */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md border border-[#E5E5E5] p-3 rounded-2xl shadow-lg text-left max-w-[140px]">
                <p className="text-[10px] font-extrabold text-[#777777] uppercase tracking-wider">
                  HOT SELLER
                </p>
                <p className="text-xs font-black text-[#111111] truncate">Nike Air Max 270</p>
                <p className="text-xs font-extrabold text-[#E53935] mt-0.5">₹6,999</p>
              </div>

              <div className="absolute bottom-6 left-6 bg-[#111111]/90 text-white backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E53935] animate-ping" />
                <span>New 2026 Collection Dropped</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
