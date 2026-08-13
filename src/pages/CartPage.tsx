import React from 'react';
import { useCart } from '../context/CartContext';
import { CartItemRow } from '../components/cart/CartItemRow';
import { OrderSummary } from '../components/cart/OrderSummary';
import { EmptyState } from '../components/common/EmptyState';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const CartPage: React.FC = () => {
  const { cart, clearCart, cartCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="py-16 bg-[#F7F7F7]/40 min-h-screen flex items-center justify-center">
        <EmptyState
          type="cart"
          title="Your Shopping Cart is Empty"
          description="You haven’t added any shoes to your cart yet. Discover our fresh collection now!"
          actionText="Start Shopping"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#F7F7F7]/40 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] flex items-center gap-2">
              <ShoppingBag className="w-7 h-7 text-[#E53935]" />
              Your Shopping Cart ({cartCount})
            </h1>
            <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
              Review your items before proceeding to secure checkout.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCart}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-[#E53935] hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5 border border-gray-300"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Cart
            </button>

            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#111111] hover:text-[#E53935]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <CartItemRow
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                item={item}
              />
            ))}
          </div>

          {/* Right Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OrderSummary
                showCheckoutBtn={true}
                onCheckoutClick={() => navigate('/checkout')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
