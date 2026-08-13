import React from 'react';
import { FilterState, CategorySlug, Gender, Brand } from '../../types';
import { RotateCcw, Check } from 'lucide-react';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onClearAll: () => void;
  totalResults: number;
}

const CATEGORY_OPTIONS: { label: string; value: CategorySlug }[] = [
  { label: 'Sneakers', value: 'sneakers' },
  { label: 'Running Shoes', value: 'running' },
  { label: 'Sports Shoes', value: 'sports' },
  { label: 'Casual Shoes', value: 'casual' },
  { label: 'Formal Shoes', value: 'formal' },
  { label: 'Boots', value: 'boots' },
  { label: 'Sandals & Slides', value: 'sandals' },
  { label: "Kids' Footwear", value: 'kids' },
];

const GENDER_OPTIONS: Gender[] = ['Men', 'Women', 'Kids', 'Unisex'];

const BRAND_OPTIONS: Brand[] = [
  'Nike',
  'Adidas',
  'Puma',
  'Reebok',
  'Skechers',
  'New Balance',
  'Daily Walk',
];

const SIZE_OPTIONS = [5, 6, 7, 8, 9, 10, 11];

const COLOR_OPTIONS = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Red', hex: '#E53935' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Grey', hex: '#6B7280' },
  { name: 'Brown', hex: '#78350F' },
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  totalResults,
}) => {
  const handleCategoryToggle = (cat: CategorySlug) => {
    const exists = filters.categories.includes(cat);
    const updated = exists
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFilterChange({ ...filters, categories: updated });
  };

  const handleGenderToggle = (gen: Gender) => {
    const exists = filters.genders.includes(gen);
    const updated = exists
      ? filters.genders.filter((g) => g !== gen)
      : [...filters.genders, gen];
    onFilterChange({ ...filters, genders: updated });
  };

  const handleBrandToggle = (brand: Brand) => {
    const exists = filters.brands.includes(brand);
    const updated = exists
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: updated });
  };

  const handleSizeToggle = (size: number) => {
    const exists = filters.sizes.includes(size);
    const updated = exists
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: updated });
  };

  const handleColorToggle = (colorName: string) => {
    const exists = filters.colors.includes(colorName);
    const updated = exists
      ? filters.colors.filter((c) => c !== colorName)
      : [...filters.colors, colorName];
    onFilterChange({ ...filters, colors: updated });
  };

  const handlePriceChange = (maxPrice: number) => {
    onFilterChange({ ...filters, priceRange: [filters.priceRange[0], maxPrice] });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ ...filters, minRating: filters.minRating === rating ? 0 : rating });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.genders.length > 0 ||
    filters.brands.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange[1] < 10000 ||
    filters.minRating > 0 ||
    filters.searchQuery !== '';

  return (
    <div className="space-y-6 text-[#222222]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
        <div>
          <h3 className="text-base font-extrabold text-[#111111]">Filters</h3>
          <p className="text-xs text-[#777777] mt-0.5">{totalResults} products found</p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 text-xs font-bold text-[#E53935] hover:text-red-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Category Section */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111] mb-3">
          Category
        </h4>
        <div className="space-y-2">
          {CATEGORY_OPTIONS.map((opt) => {
            const isChecked = filters.categories.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex items-center justify-between cursor-pointer group text-xs sm:text-sm font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryToggle(opt.value)}
                    className="w-4 h-4 rounded-md border-[#E5E5E5] text-[#111111] focus:ring-[#111111] cursor-pointer"
                  />
                  <span className={isChecked ? 'font-bold text-[#111111]' : 'text-[#222222]'}>
                    {opt.label}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Gender Section */}
      <div className="pt-4 border-t border-[#E5E5E5]">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111] mb-3">
          Gender
        </h4>
        <div className="flex flex-wrap gap-2">
          {GENDER_OPTIONS.map((gen) => {
            const isSelected = filters.genders.includes(gen);
            return (
              <button
                key={gen}
                onClick={() => handleGenderToggle(gen)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-[#F7F7F7] text-[#222222] hover:bg-gray-200 border border-[#E5E5E5]'
                }`}
              >
                {gen}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Section */}
      <div className="pt-4 border-t border-[#E5E5E5]">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111] mb-3">
          Brand
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {BRAND_OPTIONS.map((brand) => {
            const isChecked = filters.brands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-medium"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleBrandToggle(brand)}
                  className="w-4 h-4 rounded-md border-[#E5E5E5] text-[#111111] focus:ring-[#111111] cursor-pointer"
                />
                <span className={isChecked ? 'font-bold text-[#111111]' : 'text-[#222222]'}>
                  {brand}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Size Section */}
      <div className="pt-4 border-t border-[#E5E5E5]">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111] mb-3">
          Shoe Size (UK/US)
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {SIZE_OPTIONS.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all border ${
                  isSelected
                    ? 'bg-[#E53935] text-white border-[#E53935] shadow-xs'
                    : 'bg-[#F7F7F7] text-[#222222] border-[#E5E5E5] hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Section */}
      <div className="pt-4 border-t border-[#E5E5E5]">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111] mb-3">
          Color
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {COLOR_OPTIONS.map((col) => {
            const isSelected = filters.colors.includes(col.name);
            return (
              <button
                key={col.name}
                onClick={() => handleColorToggle(col.name)}
                title={col.name}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  col.border ? 'border border-gray-300' : ''
                } ${isSelected ? 'ring-2 ring-offset-2 ring-[#111111] scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: col.hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-3.5 h-3.5 ${
                      col.name === 'White' ? 'text-[#111111]' : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-[#E5E5E5]">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
            Price Range
          </h4>
          <span className="text-xs font-bold text-[#E53935]">
            Up to ₹{filters.priceRange[1].toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="10000"
          step="500"
          value={filters.priceRange[1]}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full accent-[#111111] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-[#777777] font-medium mt-1">
          <span>₹500</span>
          <span>₹10,000</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="pt-4 border-t border-[#E5E5E5]">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111] mb-3">
          Minimum Rating
        </h4>
        <div className="space-y-2 text-xs font-semibold">
          {[4, 3].map((star) => {
            const isSelected = filters.minRating === star;
            return (
              <button
                key={star}
                onClick={() => handleRatingChange(star)}
                className={`w-full py-1.5 px-3 rounded-xl flex items-center gap-2 border transition-all ${
                  isSelected
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-[#222222] border-[#E5E5E5] hover:bg-gray-100'
                }`}
              >
                <span className="text-amber-400 font-bold">★ {star}.0 & above</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
