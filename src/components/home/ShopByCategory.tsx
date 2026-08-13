import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';
import { ArrowRight } from 'lucide-react';

export const ShopByCategory: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm sm:text-base text-[#777777] font-medium mt-1">
              Find the perfect pair for every occasion.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#111111] hover:text-[#E53935] transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group relative bg-[#F7F7F7] rounded-2xl overflow-hidden border border-[#E5E5E5] hover:border-gray-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Category Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {cat.badge && (
                  <span className="absolute top-3 left-3 bg-[#E53935] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md shadow-xs">
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Text Info */}
              <div className="p-4 bg-white flex items-center justify-between gap-2 border-t border-[#E5E5E5]">
                <div>
                  <h3 className="text-base font-extrabold text-[#111111] group-hover:text-[#E53935] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#777777] line-clamp-1 mt-0.5">
                    {cat.description}
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#F7F7F7] group-hover:bg-[#111111] group-hover:text-white flex items-center justify-center text-[#111111] transition-colors flex-shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
