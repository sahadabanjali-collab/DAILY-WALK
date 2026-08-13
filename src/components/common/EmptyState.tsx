import React from 'react';
import { Link } from 'react-router-dom';
import { Footprints, ShoppingBag, Heart, Search } from 'lucide-react';

interface EmptyStateProps {
  type: 'cart' | 'wishlist' | 'search' | 'filter';
  title?: string;
  description?: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  actionLink = '/shop',
  onAction,
}) => {
  const configs = {
    cart: {
      icon: <ShoppingBag className="w-12 h-12 text-[#E53935]" />,
      title: title || 'Your cart is empty',
      description: description || 'Looks like you haven’t added any shoes to your cart yet.',
      actionText: actionText || 'Start Shopping',
    },
    wishlist: {
      icon: <Heart className="w-12 h-12 text-[#E53935]" />,
      title: title || 'Your wishlist is empty',
      description: description || 'Save your favorite shoes here and come back whenever you’re ready.',
      actionText: actionText || 'Explore Shoes',
    },
    search: {
      icon: <Search className="w-12 h-12 text-gray-400" />,
      title: title || 'No products found',
      description: description || 'We couldn’t find any shoes matching your search terms.',
      actionText: actionText || 'View All Shoes',
    },
    filter: {
      icon: <Footprints className="w-12 h-12 text-gray-400" />,
      title: title || 'No matching footwear',
      description: description || 'Try clearing some of your filter criteria to see available styles.',
      actionText: actionText || 'Reset Filters',
    },
  };

  const config = configs[type];

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-[#F7F7F7]/50 rounded-2xl border border-[#E5E5E5] max-w-lg mx-auto">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-xs border border-[#E5E5E5]">
        {config.icon}
      </div>

      <h3 className="text-xl font-extrabold text-[#111111] mb-2">{config.title}</h3>

      <p className="text-sm text-[#777777] max-w-sm mb-6 leading-relaxed">
        {config.description}
      </p>

      {onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-6 py-3 bg-[#111111] text-white text-sm font-bold rounded-xl hover:bg-[#E53935] transition-colors duration-200 shadow-md"
        >
          {config.actionText}
        </button>
      ) : (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center px-6 py-3 bg-[#111111] text-white text-sm font-bold rounded-xl hover:bg-[#E53935] transition-colors duration-200 shadow-md"
        >
          {config.actionText}
        </Link>
      )}
    </div>
  );
};
