import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';

export const PromotionalBanner: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#111111] text-white p-8 sm:p-12 lg:p-16 border border-gray-800 shadow-2xl">
          {/* Background image overlay */}
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1600&q=80"
              alt="Performance Footwear Lifestyle"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent z-10" />

          {/* Content */}
          <div className="relative z-20 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#E53935] text-white text-xs font-extrabold uppercase tracking-widest">
              <Flame className="w-3.5 h-3.5" />
              PERFORMANCE INNOVATION
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Move More. <br />
              <span className="text-[#E53935]">Feel Better.</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed">
              Explore our latest performance footwear collection. Designed for shock absorption, heel lock, and high energy return so you can conquer your workout or daily commute effortlessly.
            </p>

            <div className="pt-2">
              <Link
                to="/sports"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#E53935] hover:bg-red-700 text-white text-sm font-extrabold rounded-2xl shadow-xl transition-all duration-200 group"
              >
                <span>Shop Sports Shoes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
