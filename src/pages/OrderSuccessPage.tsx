import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Truck, ShoppingBag, ArrowRight, Package, MapPin, Calendar } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('daily_walk_last_order');
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
  }, []);

  const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(
    'en-IN',
    { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
  );

  return (
    <div className="py-12 bg-[#F7F7F7]/40 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E5E5E5] shadow-xs text-center space-y-6">
          {/* Animated Success Badge */}
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black uppercase rounded-full">
              ORDER CONFIRMED
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#111111] mt-3">
              Thank You for Walking With Us!
            </h1>
            <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
              Your order has been placed and is now being packed in our main warehouse.
            </p>
          </div>

          {order && (
            <div className="bg-[#F7F7F7] p-5 rounded-2xl border border-[#E5E5E5] text-left space-y-4 text-xs sm:text-sm">
              <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-[#E5E5E5]">
                <div>
                  <span className="text-[#777777] font-bold block text-[10px] uppercase">
                    Order ID
                  </span>
                  <span className="font-black text-[#111111] text-base">{order.orderId}</span>
                </div>

                <div>
                  <span className="text-[#777777] font-bold block text-[10px] uppercase">
                    Order Date
                  </span>
                  <span className="font-bold text-[#111111]">{order.date}</span>
                </div>

                <div>
                  <span className="text-[#777777] font-bold block text-[10px] uppercase">
                    Payment Method
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Delivery info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="flex gap-2">
                  <Calendar className="w-4 h-4 text-[#E53935] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#111111] font-extrabold text-xs">
                      Estimated Delivery Date
                    </strong>
                    <span className="text-[#777777] text-xs">{estimatedDelivery}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 text-[#E53935] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#111111] font-extrabold text-xs">
                      Delivering To
                    </strong>
                    <span className="text-[#777777] text-xs">
                      {order.shippingAddress.fullName} ({order.shippingAddress.phone})
                    </span>
                    <p className="text-[#777777] text-[11px] mt-0.5">
                      {order.shippingAddress.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ordered Items Preview */}
              <div className="pt-3 border-t border-[#E5E5E5]">
                <strong className="block text-[#111111] font-extrabold text-xs mb-2">
                  Ordered Footwear ({order.items?.length || 0})
                </strong>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {order.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-white rounded-xl border border-[#E5E5E5]"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-10 h-10 object-contain mix-blend-multiply bg-[#F7F7F7] p-1 rounded-lg border border-[#E5E5E5]"
                        />
                        <div>
                          <p className="text-xs font-extrabold text-[#111111]">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-[#777777]">
                            Size: {item.selectedSize} | Color: {item.selectedColor} | Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-black text-[#111111]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
            <Link
              to="/shop"
              className="px-6 py-3.5 bg-[#111111] text-white hover:bg-[#E53935] text-xs font-extrabold rounded-2xl transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>

            <Link
              to="/"
              className="px-6 py-3.5 bg-[#F7F7F7] border border-[#E5E5E5] text-[#111111] hover:bg-gray-200 text-xs font-extrabold rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
