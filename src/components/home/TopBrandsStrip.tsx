import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const TopBrandsStrip: React.FC = () => {
  const brands = [
    {
      name: 'Nike',
      slug: 'nike',
      svg: (
        <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current" aria-label="Nike">
          <path d="M21.707 5.293c-1.39-1.39-4.27-.47-7.85 2.45-3.3 2.69-5.91 5.74-7.44 7.75-1.12 1.48-1.57 2.37-1.49 2.87.1.58.74.88 1.63.77 1.83-.23 4.88-2.2 8.4-5.38 3.51-3.18 6.07-6.38 6.75-8.46z" />
        </svg>
      ),
      label: 'NIKE',
    },
    {
      name: 'Adidas',
      slug: 'adidas',
      svg: (
        <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current" aria-label="Adidas">
          <path d="M2.5 17.5h3.2L11 8.5H7.8L2.5 17.5zm5.5 0h3.2l5.3-9H13.3l-5.3 9zm5.5 0h3.2l5.3-9h-3.2l-5.3 9z" />
        </svg>
      ),
      label: 'adidas',
    },
    {
      name: 'Puma',
      slug: 'puma',
      svg: (
        <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current" aria-label="Puma">
          <path d="M19.5 7.5c-.8 0-1.8.3-2.6.9-.5.4-1.5 1.4-1.9 1.7-.5.4-1.3.8-2 .9-.5.1-1.3.1-1.7-.1-.6-.3-1.1-.9-1.4-1.5-.4-.7-.5-1.3-.4-2 .1-.8.5-1.6 1.1-2.1.2-.2.2-.4 0-.5-.1-.1-.3-.1-.5 0-.9.6-1.5 1.5-1.7 2.6-.2 1.1 0 2.2.7 3.1.6.8 1.4 1.3 2.4 1.5.8.1 1.6 0 2.4-.4.8-.4 1.6-1.1 2.2-1.7.6-.6 1.3-1.1 2-1.3.6-.2 1.2-.1 1.7.3.2.1.4.1.5 0 .1-.2 0-.4-.3-.6-.6-.5-1.4-.7-2.1-.7zM4 17h16v1.5H4V17z" />
        </svg>
      ),
      label: 'PUMA',
    },
    {
      name: 'New Balance',
      slug: 'new-balance',
      svg: (
        <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current" aria-label="New Balance">
          <path d="M4 16.5l3-9h3.5l1.5 4.5 1.5-4.5H17l3 9h-3.2l-1.3-4.2-1.5 4.2h-2l-1.5-4.2-1.3 4.2H4z" />
        </svg>
      ),
      label: 'new balance',
    },
    {
      name: 'Converse',
      slug: 'converse',
      svg: (
        <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current" aria-label="Converse">
          <path d="M12 2l2.9 6.8 7.1.6-5.3 4.6 1.6 7-6.3-3.7-6.3 3.7 1.6-7L2 9.4l7.1-.6L12 2z" />
        </svg>
      ),
      label: 'CONVERSE',
    },
    {
      name: 'Vans',
      slug: 'vans',
      svg: (
        <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current" aria-label="Vans">
          <path d="M2 9h4.5l2.5 5 2.5-5H22v2.5h-8l-2.5 5h-1.5L4.5 11.5H2V9z" />
        </svg>
      ),
      label: 'VANS',
    },
  ];

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Label */}
        <div className="flex items-center gap-6 sm:gap-10 w-full md:w-auto justify-between md:justify-start">
          <span className="font-heading font-black text-xs sm:text-sm tracking-wider uppercase text-black flex-shrink-0">
            TOP BRANDS
          </span>

          <Link
            to="/shop?filter=brands"
            className="md:hidden text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Brand Logos Row */}
        <div className="flex items-center justify-between gap-6 sm:gap-10 lg:gap-14 overflow-x-auto w-full md:w-auto py-2 scrollbar-none">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              to={`/shop?search=${encodeURIComponent(brand.name)}`}
              className="flex items-center gap-1.5 text-neutral-800 hover:text-black transition-colors flex-shrink-0 group"
              title={brand.name}
            >
              <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                {brand.svg}
              </div>
              <span className="font-heading font-extrabold text-sm sm:text-base tracking-tight uppercase">
                {brand.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop View All Link */}
        <Link
          to="/shop?filter=brands"
          className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-black transition-colors flex-shrink-0"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
};
