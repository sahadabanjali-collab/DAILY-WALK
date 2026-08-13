import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { CartItem, Product } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: number | null, color: string | null, quantity?: number) => boolean;
  removeFromCart: (productId: string, size: number, color: string) => void;
  updateQuantity: (productId: string, size: number, color: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discountTotal: number;
  freeShippingThreshold: number;
  shippingFee: number;
  finalTotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  toggleCartDrawer: () => void;
}

const CART_STORAGE_KEY = 'daily_walk_cart_v1';
const FREE_SHIPPING_THRESHOLD = 1999;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = useCallback(
    (
      product: Product,
      selectedSize: number | null,
      selectedColor: string | null,
      quantity = 1
    ): boolean => {
      if (!selectedSize) {
        showToast('Please select a size', 'Choose your shoe size before adding to cart', 'warning');
        return false;
      }

      const colorName = selectedColor || (product.colors[0]?.name ?? 'Standard');

      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === colorName
        );

        if (existingIndex > -1) {
          const updated = [...prevCart];
          updated[existingIndex].quantity += quantity;
          return updated;
        } else {
          return [
            ...prevCart,
            {
              product,
              selectedSize,
              selectedColor: colorName,
              quantity,
            },
          ];
        }
      });

      showToast(`${product.name} added to cart`, `Size: ${selectedSize} | Color: ${colorName}`);
      setIsCartDrawerOpen(true);
      return true;
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (productId: string, size: number, color: string) => {
      setCart((prev) =>
        prev.filter(
          (item) =>
            !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
        )
      );
      showToast('Product removed from cart', '', 'info');
    },
    [showToast]
  );

  const updateQuantity = useCallback(
    (productId: string, size: number, color: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, size, color);
        return;
      }

      setCart((prev) =>
        prev.map((item) => {
          if (item.product.id === productId && item.selectedSize === size && item.selectedColor === color) {
            return { ...item, quantity };
          }
          return item;
        })
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleCartDrawer = useCallback(() => {
    setIsCartDrawerOpen((prev) => !prev);
  }, []);

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [cart]
  );

  const discountTotal = useMemo(
    () =>
      cart.reduce((total, item) => {
        const diff = item.product.originalPrice - item.product.price;
        return total + (diff > 0 ? diff * item.quantity : 0);
      }, 0),
    [cart]
  );

  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const finalTotal = subtotal + shippingFee;

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      subtotal,
      discountTotal,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      shippingFee,
      finalTotal,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      toggleCartDrawer,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      subtotal,
      discountTotal,
      shippingFee,
      finalTotal,
      isCartDrawerOpen,
      toggleCartDrawer,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
