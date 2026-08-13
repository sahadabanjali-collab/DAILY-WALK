import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../common/EmptyState';

interface ProductGridProps {
  products: Product[];
  emptyType?: 'search' | 'filter' | 'cart';
  emptyTitle?: string;
  emptyDescription?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  emptyType = 'filter',
  emptyTitle,
  emptyDescription,
}) => {
  if (products.length === 0) {
    return (
      <EmptyState
        type={emptyType}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
