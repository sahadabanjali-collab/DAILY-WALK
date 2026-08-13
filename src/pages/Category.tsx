import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/products';
import { CategorySlug, Gender, SortOption, FilterState } from '../types';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import { FilterDrawer } from '../components/product/FilterDrawer';
import { SortDropdown } from '../components/product/SortDropdown';
import { CATEGORIES } from '../data/categories';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

interface CategoryConfig {
  title: string;
  subtitle: string;
  bannerImage: string;
  badge?: string;
  filterGender?: Gender;
  filterCategory?: CategorySlug;
  isSaleOnly?: boolean;
}

export const CategoryPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.replace('/', '').toLowerCase();

  const config: CategoryConfig = useMemo(() => {
    switch (path) {
      case 'men':
        return {
          title: "Men's Footwear Collection",
          subtitle: 'Engineered for performance, elegance, and day-long durability.',
          bannerImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80',
          filterGender: 'Men',
        };
      case 'women':
        return {
          title: "Women's Footwear Collection",
          subtitle: 'Stylish sneakers, running shoes, and comfortable everyday pairs.',
          bannerImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1600&q=80',
          filterGender: 'Women',
        };
      case 'kids':
        return {
          title: "Kids' Footwear Collection",
          subtitle: 'Fun, durable, and extra cushioned for school and play days.',
          bannerImage: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1600&q=80',
          filterGender: 'Kids',
          filterCategory: 'kids',
        };
      case 'sports':
        return {
          title: 'Sports & Training Footwear',
          subtitle: 'Multi-sport training, gym workout, and athletics shoes.',
          bannerImage: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1600&q=80',
          filterCategory: 'sports',
        };
      case 'casual':
        return {
          title: 'Casual & Lifestyle Shoes',
          subtitle: 'Loafers, canvas sneakers, and slip-ons for relaxed weekend vibes.',
          bannerImage: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1600&q=80',
          filterCategory: 'casual',
        };
      case 'formal':
        return {
          title: 'Formal Dress Shoes',
          subtitle: 'Handcrafted Oxfords, Derbies, and Monk straps for classic suit elegance.',
          bannerImage: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1600&q=80',
          filterCategory: 'formal',
        };
      case 'sale':
        return {
          title: 'Seasonal Footwear Sale',
          subtitle: 'Up to 40% off top brands and signature Daily Walk styles.',
          bannerImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1600&q=80',
          badge: 'UP TO 40% OFF',
          isSaleOnly: true,
        };
      default: {
        const catObj = CATEGORIES.find((c) => c.slug === path);
        return {
          title: catObj ? catObj.name : 'Footwear Collection',
          subtitle: catObj ? catObj.description : 'Explore our high quality footwear range.',
          bannerImage: catObj ? catObj.image : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80',
          filterCategory: path as CategorySlug,
        };
      }
    }
  }, [path]);

  const [filters, setFilters] = useState<FilterState>({
    categories: config.filterCategory ? [config.filterCategory] : [],
    genders: config.filterGender ? [config.filterGender] : [],
    brands: [],
    sizes: [],
    colors: [],
    priceRange: [500, 10000],
    minRating: 0,
    searchQuery: '',
  });

  useEffect(() => {
    setFilters({
      categories: config.filterCategory ? [config.filterCategory] : [],
      genders: config.filterGender ? [config.filterGender] : [],
      brands: [],
      sizes: [],
      colors: [],
      priceRange: [500, 10000],
      minRating: 0,
      searchQuery: '',
    });
  }, [path, config.filterCategory, config.filterGender]);

  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter products
  const categoryProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter((p) => {
      if (config.isSaleOnly && !p.isSale) return false;
      if (config.filterGender && p.gender !== config.filterGender && p.gender !== 'Unisex') {
        return false;
      }
      if (config.filterCategory && p.category !== config.filterCategory) {
        return false;
      }
      return true;
    });

    // Apply secondary filters
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }
    if (filters.sizes.length > 0) {
      result = result.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
    }
    if (filters.colors.length > 0) {
      result = result.filter((p) => p.colors.some((c) => filters.colors.includes(c.name)));
    }
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Sorting
    switch (sortOption) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-high':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount-high':
        result.sort((a, b) => b.discount - a.discount);
        break;
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [config, filters, sortOption]);

  const handleClearAll = () => {
    setFilters({
      categories: config.filterCategory ? [config.filterCategory] : [],
      genders: config.filterGender ? [config.filterGender] : [],
      brands: [],
      sizes: [],
      colors: [],
      priceRange: [500, 10000],
      minRating: 0,
      searchQuery: '',
    });
  };

  return (
    <div className="py-8 bg-[#F7F7F7]/40 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-[#111111] text-white p-8 sm:p-12 mb-8 border border-gray-800 shadow-xl">
          <div className="absolute inset-0 opacity-40">
            <img
              src={config.bannerImage}
              alt={config.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent" />

          <div className="relative z-10 max-w-xl space-y-3">
            {config.badge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E53935] text-white text-xs font-extrabold uppercase rounded-md tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                {config.badge}
              </span>
            )}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{config.title}</h1>
            <p className="text-sm sm:text-base text-gray-300 font-medium">{config.subtitle}</p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-2xl border border-[#E5E5E5] h-fit sticky top-24 shadow-xs">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              onClearAll={handleClearAll}
              totalResults={categoryProducts.length}
            />
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] flex items-center justify-between shadow-xs">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-xs font-bold rounded-xl hover:bg-[#E53935] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter & Refine</span>
              </button>

              <div className="ml-auto">
                <SortDropdown currentSort={sortOption} onSortChange={setSortOption} />
              </div>
            </div>

            <ProductGrid
              products={categoryProducts}
              emptyType="filter"
              emptyTitle="No footwear matches your selection"
              emptyDescription="Try clearing your filters or exploring another footwear category."
            />
          </div>
        </div>
      </div>

      <FilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onClearAll={handleClearAll}
        totalResults={categoryProducts.length}
      />
    </div>
  );
};
