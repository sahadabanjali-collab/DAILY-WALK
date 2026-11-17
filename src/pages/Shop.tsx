import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStoreData } from '../context/StoreDataContext';
import { FilterState, SortOption, CategorySlug, Gender, Brand } from '../types';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import { FilterDrawer } from '../components/product/FilterDrawer';
import { SortDropdown } from '../components/product/SortDropdown';
import { SlidersHorizontal, Search, X } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  categories: [],
  genders: [],
  brands: [],
  sizes: [],
  colors: [],
  priceRange: [500, 10000],
  minRating: 0,
  searchQuery: '',
};

export const Shop: React.FC = () => {
  const { products } = useStoreData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Parse URL search params on mount or when searchParams string changes
  useEffect(() => {
    const categoryParam = searchParams.get('category') as CategorySlug | null;
    const genderParam = searchParams.get('gender') as Gender | null;
    const brandParam = searchParams.get('brand') as Brand | null;
    const searchParam = searchParams.get('search');
    const featuredParam = searchParams.get('featured');
    const newParam = searchParams.get('new');
    const bestsellerParam = searchParams.get('bestseller');
    const saleParam = searchParams.get('sale');

    setFilters((prev) => ({
      ...prev,
      categories: categoryParam ? [categoryParam] : prev.categories,
      genders: genderParam ? [genderParam] : prev.genders,
      brands: brandParam ? [brandParam] : prev.brands,
      searchQuery: searchParam ?? prev.searchQuery,
    }));

    if (bestsellerParam) setSortOption('popular');
    else if (newParam) setSortOption('newest');
    else if (saleParam) setSortOption('discount-high');
  }, [searchParams.toString()]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // Gender
    if (filters.genders.length > 0) {
      result = result.filter((p) => filters.genders.includes(p.gender) || p.gender === 'Unisex');
    }

    // Brand
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }

    // Size
    if (filters.sizes.length > 0) {
      result = result.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
    }

    // Color
    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => filters.colors.includes(c.name))
      );
    }

    // Price
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Rating
    if (filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }

    // Sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-high':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'discount-high':
        result.sort((a, b) => b.discount - a.discount);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [filters, sortOption, products]);

  const handleClearAll = () => {
    setFilters(INITIAL_FILTERS);
    setSearchParams({});
  };

  const removeCategoryPill = (cat: CategorySlug) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat),
    }));
  };

  const removeGenderPill = (gen: Gender) => {
    setFilters((prev) => ({
      ...prev,
      genders: prev.genders.filter((g) => g !== gen),
    }));
  };

  const removeBrandPill = (brand: Brand) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.filter((b) => b !== brand),
    }));
  };

  return (
    <div className="py-8 bg-[#F7F7F7]/40 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Heading & Search Bar */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#111111]">
                All Footwear Collection
              </h1>
              <p className="text-xs sm:text-sm text-[#777777] font-medium mt-0.5">
                Showing {filteredProducts.length} of {products.length} premium shoes
              </p>
            </div>

            {/* In-page Live Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by brand, name, type or style..."
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-10 pr-9 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm font-medium text-[#111111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-3 top-3 text-gray-400 hover:text-[#111111]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Badges */}
          {(filters.categories.length > 0 ||
            filters.genders.length > 0 ||
            filters.brands.length > 0 ||
            filters.searchQuery !== '') && (
            <div className="pt-4 mt-4 border-t border-[#E5E5E5] flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#777777]">Active Filters:</span>

              {filters.searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111111] text-white text-xs font-bold rounded-lg">
                  "{filters.searchQuery}"
                  <button onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}>
                    <X className="w-3 h-3 hover:text-[#E53935]" />
                  </button>
                </span>
              )}

              {filters.categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E53935] text-white text-xs font-bold rounded-lg uppercase"
                >
                  {cat}
                  <button onClick={() => removeCategoryPill(cat)}>
                    <X className="w-3 h-3 hover:text-gray-200" />
                  </button>
                </span>
              ))}

              {filters.genders.map((gen) => (
                <span
                  key={gen}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-800 text-white text-xs font-bold rounded-lg"
                >
                  {gen}
                  <button onClick={() => removeGenderPill(gen)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {filters.brands.map((brand) => (
                <span
                  key={brand}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-700 text-white text-xs font-bold rounded-lg"
                >
                  {brand}
                  <button onClick={() => removeBrandPill(brand)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                onClick={handleClearAll}
                className="text-xs font-bold text-[#E53935] underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-2xl border border-[#E5E5E5] h-fit sticky top-24 shadow-xs">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              onClearAll={handleClearAll}
              totalResults={filteredProducts.length}
            />
          </div>

          {/* Right Product Grid Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Toolbar (Mobile Filter Button & Sort) */}
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

            {/* Product Grid */}
            <ProductGrid
              products={filteredProducts}
              emptyType={filters.searchQuery ? 'search' : 'filter'}
              emptyTitle="No footwear matches your filters"
              emptyDescription="Try broadening your category or size selection to find available styles."
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onClearAll={handleClearAll}
        totalResults={filteredProducts.length}
      />
    </div>
  );
};
