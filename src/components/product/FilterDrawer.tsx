import React from 'react';
import { FilterState } from '../../types';
import { ProductFilters } from './ProductFilters';
import { X, SlidersHorizontal } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearAll: () => void;
  totalResults: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearAll,
  totalResults,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl flex flex-col justify-between z-50 animate-slide-in-right">
        {/* Header */}
        <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between bg-[#F7F7F7]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#E53935]" />
            <h3 className="text-base font-extrabold text-[#111111]">Refine Footwear</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <ProductFilters
            filters={filters}
            onFilterChange={onFilterChange}
            onClearAll={onClearAll}
            totalResults={totalResults}
          />
        </div>

        {/* Footer Apply Button */}
        <div className="p-4 border-t border-[#E5E5E5] bg-white">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#111111] text-white text-sm font-extrabold rounded-xl hover:bg-[#E53935] transition-colors shadow-md"
          >
            Apply Filters ({totalResults} Results)
          </button>
        </div>
      </div>
    </div>
  );
};
