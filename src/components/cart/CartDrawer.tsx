import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { CartItemRow } from './CartItemRow';
import { EmptyState } from '../common/EmptyState';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cartCount,
    subtotal,
    freeShippingThreshold,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const handleGoToCart = () => {
    setIsCartDrawerOpen(false);
    navigate('/cart');
  };

  const handleGoToCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  const neededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Slide-out Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between z-50 animate-slide-in-right">
        {/* Header */}
        <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between bg-[#F7F7F7]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#E53935]" />
            <h3 className="text-base font-extrabold text-[#111111]">
              Your Footwear Cart ({cartCount})
            </h3>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Alert Bar */}
        {subtotal > 0 && (
          <div className="bg-[#111111] text-white text-[11px] font-bold py-2 px-4 text-center">
            {neededForFreeShipping > 0 ? (
              <span>
                Add ₹{neededForFreeShipping.toLocaleString('en-IN')} more to get FREE Delivery!
              </span>
            ) : (
              <span className="text-emerald-400">
                🎉 FREE Delivery Unlocked for this order!
              </span>
            )}
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <EmptyState
              type="cart"
              title="Your cart is empty"
              description="Explore our shoes and find your perfect pair for everyday style."
              actionText="Explore Footwear"
              onAction={() => {
                setIsCartDrawerOpen(false);
                navigate('/shop');
              }}
            />
          ) : (
            cart.map((item) => (
              <CartItemRow
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                item={item}
                compact
                onItemClick={() => setIsCartDrawerOpen(false)}
              />
            ))
          )}
        </div>

        {/* Footer Checkout Controls */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-[#E5E5E5] bg-white space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-sm font-bold text-[#111111]">
              <span className="text-[#777777]">Subtotal</span>
              <span className="text-lg font-black text-[#111111]">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-[11px] text-[#777777]">
              Taxes and shipping calculated at checkout.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleGoToCart}
                className="py-3 px-4 bg-[#F7F7F7] border border-[#E5E5E5] text-[#111111] hover:bg-gray-200 text-xs font-extrabold rounded-xl transition-colors"
              >
                View Full Cart
              </button>

              <button
                onClick={handleGoToCheckout}
                className="py-3 px-4 bg-[#111111] text-white hover:bg-[#E53935] text-xs font-extrabold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                Checkout Now
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
