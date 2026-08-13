import React from 'react';
import { SortOption } from '../../types';
import { ArrowUpDown } from 'lucide-react';

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (option: SortOption) => void;
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low-high' },
  { label: 'Price: High to Low', value: 'price-high-low' },
  { label: 'Highest Rated', value: 'rating-high' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Biggest Discount', value: 'discount-high' },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({
  currentSort,
  onSortChange,
}) => {
  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#222222]">
      <ArrowUpDown className="w-4 h-4 text-[#777777] hidden sm:block" />
      <span className="text-[#777777] whitespace-nowrap">Sort by:</span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="bg-[#F7F7F7] border border-[#E5E5E5] text-[#111111] font-bold py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111111] cursor-pointer text-xs sm:text-sm"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
