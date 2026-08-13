import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WISHLIST_STORAGE_KEY = 'daily_walk_wishlist_v1';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist]);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some((item) => item.id === productId);
    },
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      const exists = wishlist.some((item) => item.id === product.id);
      if (exists) {
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));
        showToast('Removed from wishlist', product.name, 'info');
      } else {
        setWishlist((prev) => [...prev, product]);
        showToast('Added to wishlist', product.name, 'success');
      }
    },
    [wishlist, showToast]
  );

  const value = useMemo(
    () => ({
      wishlist,
      toggleWishlist,
      isInWishlist,
      wishlistCount: wishlist.length,
    }),
    [wishlist, toggleWishlist, isInWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
