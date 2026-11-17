import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useStoreData } from '../context/StoreDataContext';
import { OrderSummary } from '../components/cart/OrderSummary';
import { ShieldCheck, Truck, CreditCard, ArrowLeft, CheckCircle2, Lock, Smartphone, Building2, Zap, UserCheck, LogIn } from 'lucide-react';
import { createSupabaseOrder } from '../lib/supabase';
import { openRazorpayCheckout } from '../lib/razorpay';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart, finalTotal, subtotal } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { recordNewOrder } = useStoreData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || user?.addresses?.[0]?.phone || '',
    address: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    pincode: user?.addresses?.[0]?.pincode || '',
    paymentMethod: 'razorpay' as 'razorpay' | 'upi' | 'card' | 'cod',
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const defaultAddr = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || defaultAddr?.phone || user.phone || '',
        address: prev.address || defaultAddr?.street || '',
        city: prev.city || defaultAddr?.city || '',
        state: prev.state || defaultAddr?.state || '',
        pincode: prev.pincode || defaultAddr?.pincode || '',
      }));
    }
  }, [user]);

  if (cart.length === 0) {
    return (
      <div className="py-16 bg-[#F7F7F7]/40 min-h-screen flex items-center justify-center px-4 text-center">
        <div className="bg-white p-8 rounded-3xl border border-[#E5E5E5] max-w-md w-full shadow-xs">
          <h2 className="text-2xl font-extrabold text-[#111111]">No Items in Checkout</h2>
          <p className="text-xs text-[#777777] my-3">
            Please add shoes to your cart before proceeding to checkout.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-[#111111] text-white text-xs font-bold rounded-xl hover:bg-[#E53935]"
          >
            Go to Store
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid Email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid 10-digit Phone Number is required';
    if (!formData.address.trim()) newErrors.address = 'Street Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim() || formData.pincode.length < 6) newErrors.pincode = 'Valid 6-digit Pincode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Validation Error', 'Please complete all required shipping fields', 'warning');
      return;
    }

    setIsSubmitting(true);

    const orderId = `DW-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

    const finalizeOrder = async (paymentDetails?: { paymentId: string; orderId?: string }) => {
      const orderData = {
        orderId,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        items: [...cart],
        totalAmount: finalTotal,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: fullAddress,
        },
        paymentMethod: formData.paymentMethod === 'cod' ? 'CASH ON DELIVERY' : 'RAZORPAY ONLINE',
        razorpayPaymentId: paymentDetails?.paymentId,
      };

      // Push order record directly to user's Supabase project database
      const res = await createSupabaseOrder({
        orderId,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: fullAddress,
        items: cart,
        totalAmount: finalTotal,
        paymentMethod:
          formData.paymentMethod === 'cod'
            ? 'COD'
            : `RAZORPAY (${paymentDetails?.paymentId || 'ONLINE'})`,
      });

      if (res.success) {
        console.log('Order successfully created in Supabase project cbbsbwzpuhhzuhzknrin');
      } else {
        console.warn('Note: Order saved locally. Supabase insert response:', res.error);
      }

      const pmStr =
        formData.paymentMethod === 'cod'
          ? 'COD'
          : `RAZORPAY (${paymentDetails?.paymentId || 'ONLINE'})`;

      recordNewOrder({
        id: `ord_${Date.now()}`,
        orderId,
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: fullAddress,
        items: cart,
        totalAmount: finalTotal,
        paymentMethod: pmStr,
        paymentStatus: formData.paymentMethod === 'cod' ? 'Pending' : 'Paid',
        status: 'Processing',
        courierPartner: 'Blue Dart Express',
        trackingNumber: `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem('daily_walk_last_order', JSON.stringify(orderData));
      clearCart();
      setIsSubmitting(false);
      showToast('Order Placed Successfully!', `Order ID: ${orderId}`, 'success');
      navigate('/order-success');
    };

    if (formData.paymentMethod === 'cod') {
      await finalizeOrder();
    } else {
      // Launch Razorpay Payment Gateway popup
      openRazorpayCheckout({
        amount: finalTotal,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        description: `Daily Walk Footwear Order ${orderId}`,
        onSuccess: async (paymentDetails) => {
          showToast('Payment Successful!', `Razorpay ID: ${paymentDetails.paymentId}`, 'success');
          await finalizeOrder(paymentDetails);
        },
        onDismiss: () => {
          setIsSubmitting(false);
          showToast('Payment Cancelled', 'Razorpay checkout window was closed', 'info');
        },
        onError: (errMsg) => {
          setIsSubmitting(false);
          showToast('Payment Failed', errMsg, 'error');
        },
      });
    }
  };

  return (
    <div className="py-8 bg-[#F7F7F7]/40 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5E5E5]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111]">Express Checkout</h1>
            <p className="text-xs sm:text-sm text-[#777777] font-medium mt-0.5">
              Secure 256-bit encrypted transaction
            </p>
          </div>

          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#111111] hover:text-[#E53935]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Cart
          </Link>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Form Sections */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address Box */}
              <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#E53935]" />
                    <h3 className="text-base font-extrabold text-[#111111]">
                      1. Shipping & Delivery Address
                    </h3>
                  </div>
                  {user ? (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Saved Profile</span>
                    </span>
                  ) : (
                    <Link
                      to="/login?redirect=/checkout"
                      className="text-[11px] font-extrabold text-[#E53935] hover:underline flex items-center gap-1"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In for 1-Click</span>
                    </Link>
                  )}
                </div>

                {user && (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 flex items-center justify-between">
                    <p className="font-medium">
                      Delivering to <strong className="font-bold text-[#111111]">{user.fullName}</strong> (<span className="text-gray-500">{user.email}</span>)
                    </p>
                    <Link to="/account" className="text-[11px] font-bold text-[#E53935] hover:underline shrink-0 ml-2">
                      Manage Addresses
                    </Link>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-[#111111] uppercase tracking-wider block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                    />
                    {errors.fullName && (
                      <p className="text-[11px] font-bold text-[#E53935] mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#111111] uppercase tracking-wider block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                    />
                    {errors.phone && (
                      <p className="text-[11px] font-bold text-[#E53935] mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-extrabold text-[#111111] uppercase tracking-wider block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                    />
                    {errors.email && (
                      <p className="text-[11px] font-bold text-[#E53935] mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-extrabold text-[#111111] uppercase tracking-wider block mb-1">
                      Flat / House No. / Building / Street *
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Flat 402, Sunshine Apartments, MG Road"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                    />
                    {errors.address && (
                      <p className="text-[11px] font-bold text-[#E53935] mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#111111] uppercase tracking-wider block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                    />
                    {errors.city && (
                      <p className="text-[11px] font-bold text-[#E53935] mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#111111] uppercase tracking-wider block mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="e.g. Maharashtra"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                    />
                    {errors.state && (
                      <p className="text-[11px] font-bold text-[#E53935] mt-1">{errors.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#111111] uppercase tracking-wider block mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="6-digit pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                    />
                    {errors.pincode && (
                      <p className="text-[11px] font-bold text-[#E53935] mt-1">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method Selector Box */}
              <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#E53935]" />
                    <h3 className="text-base font-extrabold text-[#111111]">
                      2. Payment Method
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    Razorpay Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'razorpay' }))}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      formData.paymentMethod === 'razorpay'
                        ? 'border-[#111111] bg-[#111111] text-white shadow-md'
                        : 'border-[#E5E5E5] bg-[#F7F7F7] text-[#222222] hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-black">Razorpay Gateway</span>
                      </div>
                      <span className="text-[9px] bg-blue-500/20 text-blue-300 font-extrabold px-2 py-0.5 rounded">
                        Fast & Secure
                      </span>
                    </div>
                    <p className="text-[11px] opacity-80 font-medium">
                      Pay via UPI (GPay/PhonePe), Cards, NetBanking or Wallets
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'cod' }))}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-[#111111] bg-[#111111] text-white shadow-md'
                        : 'border-[#E5E5E5] bg-[#F7F7F7] text-[#222222] hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-black">Cash on Delivery</span>
                      </div>
                    </div>
                    <p className="text-[11px] opacity-80 font-medium">
                      Pay in cash upon doorstep delivery
                    </p>
                  </button>
                </div>

                {formData.paymentMethod === 'razorpay' && (
                  <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                    <p className="text-xs text-blue-900 font-medium">
                      When you click <strong className="font-bold">Pay & Place Order</strong>, the official Razorpay Checkout pop-up window will launch securely to process your payment.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Summary and Submit */}
            <div className="lg:col-span-1 space-y-6">
              <OrderSummary showCheckoutBtn={false} />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#E53935] hover:bg-red-700 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{finalTotal.toLocaleString('en-IN')} & Place Order</span>
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-[#777777] font-bold space-y-1">
                <p>🔒 256-Bit SSL Encryption Guaranteed</p>
                <p>Free Easy Returns & Exchange within 15 Days</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
