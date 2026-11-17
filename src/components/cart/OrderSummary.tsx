import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useStoreData } from '../../context/StoreDataContext';
import { ShieldCheck, Truck, ArrowRight, Tag, CheckCircle2 } from 'lucide-react';

interface OrderSummaryProps {
  showCheckoutBtn?: boolean;
  onCheckoutClick?: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  showCheckoutBtn = true,
  onCheckoutClick,
}) => {
  const {
    subtotal,
    discountTotal,
    freeShippingThreshold,
    shippingFee,
    finalTotal,
  } = useCart();

  const { validateCoupon, coupons } = useStoreData();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = validateCoupon(couponCode, subtotal);
    if (res.valid) {
      setAppliedCoupon({ code: couponCode.trim().toUpperCase(), discount: res.discount });
      showToast('Coupon Applied!', res.message, 'success');
      setCouponCode('');
    } else {
      showToast('Invalid Coupon', res.message, 'warning');
    }
  };

  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, finalTotal - couponDiscount);

  const neededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleProceed = () => {
    if (onCheckoutClick) {
      onCheckoutClick();
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E5E5] space-y-5 shadow-xs">
      <h3 className="text-base font-extrabold text-[#111111] pb-3 border-b border-[#E5E5E5]">
        Order Summary
      </h3>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-[#F7F7F7] p-3 rounded-xl border border-[#E5E5E5] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
          <Truck className="w-4 h-4 text-[#E53935]" />
          {neededForFreeShipping > 0 ? (
            <span>
              Add <strong className="text-[#E53935]">₹{neededForFreeShipping.toLocaleString('en-IN')}</strong> more for FREE Shipping!
            </span>
          ) : (
            <span className="text-emerald-700 font-extrabold">
              🎉 Congratulations! You unlocked FREE Delivery!
            </span>
          )}
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#E53935] transition-all duration-300"
            style={{ width: `${shippingProgress}%` }}
          />
        </div>
      </div>

      {/* Promo Coupon Form */}
      <form onSubmit={handleApplyCoupon} className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Promo Code (DAILYWALK10)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#111111] uppercase"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[#111111] text-white text-xs font-extrabold rounded-xl hover:bg-[#E53935] transition-colors"
        >
          Apply
        </button>
      </form>

      {appliedCoupon && (
        <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Coupon "{appliedCoupon.code}" (10% OFF)</span>
          </div>
          <button
            onClick={() => setAppliedCoupon(null)}
            className="text-red-600 hover:underline text-[11px]"
          >
            Remove
          </button>
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="space-y-2.5 text-xs sm:text-sm font-medium text-[#222222]">
        <div className="flex justify-between">
          <span className="text-[#777777]">Subtotal</span>
          <span className="font-bold text-[#111111]">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        {discountTotal > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>Product Discounts</span>
            <span className="font-bold">-₹{discountTotal.toLocaleString('en-IN')}</span>
          </div>
        )}

        {couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>Promo Coupon (10%)</span>
            <span className="font-bold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-[#777777]">Estimated Shipping</span>
          <span className="font-bold text-[#111111]">
            {shippingFee === 0 ? (
              <strong className="text-emerald-700 uppercase font-black">FREE</strong>
            ) : (
              `₹${shippingFee}`
            )}
          </span>
        </div>

        <div className="pt-3 border-t border-[#E5E5E5] flex justify-between items-baseline">
          <span className="text-base font-black text-[#111111]">Grand Total</span>
          <span className="text-xl font-black text-[#E53935]">
            ₹{grandTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Proceed Button */}
      {showCheckoutBtn && (
        <button
          onClick={handleProceed}
          disabled={subtotal === 0}
          className="w-full py-3.5 px-4 bg-[#111111] text-white hover:bg-[#E53935] disabled:opacity-50 text-sm font-extrabold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-[#777777] pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Safe & Secure 256-Bit Encrypted Checkout</span>
      </div>
    </div>
  );
};
