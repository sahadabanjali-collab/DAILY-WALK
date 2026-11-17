import React from 'react';
import { Link } from 'react-router-dom';

export const ShopByCategory: React.FC = () => {
  const categories = [
    {
      name: 'Running',
      slug: 'sports',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Lifestyle',
      slug: 'casual',
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Basketball',
      slug: 'sneakers',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Training',
      slug: 'sports',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Sneakers',
      slug: 'sneakers',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Slides',
      slug: 'casual',
      image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Boots',
      slug: 'formal',
      image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Title matching reference */}
        <div className="mb-6 sm:mb-8">
          <h2 className="font-heading font-black text-xs sm:text-sm tracking-wider uppercase text-[#111111]">
            SHOP BY CATEGORY
          </h2>
        </div>

        {/* 7-column category cards matching reference */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center text-center select-none"
            >
              {/* Soft #F6F6F6 rounded card container */}
              <div className="w-full h-28 sm:h-32 bg-[#F6F6F6] group-hover:bg-[#EFEFEF] rounded-2xl flex items-center justify-center p-3 transition-all duration-200 group-hover:-translate-y-1">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-300 drop-shadow-xs"
                  loading="lazy"
                />
              </div>

              {/* Bold Category Label below card */}
              <span className="font-heading font-bold text-xs sm:text-sm text-[#111111] mt-2.5 group-hover:text-black transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
