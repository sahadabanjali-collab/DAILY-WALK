import React, { useState } from 'react';
import { User, Package, MapPin, Heart, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  const [lastOrder] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('daily_walk_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  return (
    <div className="py-10 bg-[#F7F7F7]/40 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] flex items-center gap-2">
              <User className="w-7 h-7 text-[#E53935]" />
              My Daily Walk Account
            </h1>
            <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
              Manage your orders, profile, saved addresses, and footwear preferences.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#111111] hover:text-[#E53935]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Shop
          </Link>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-3 border-b border-[#E5E5E5] pb-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-white text-[#222222] hover:bg-gray-100 border border-[#E5E5E5]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-white text-[#222222] hover:bg-gray-100 border border-[#E5E5E5]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-white text-[#222222] hover:bg-gray-100 border border-[#E5E5E5]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-[#111111]">Your Recent Orders</h2>

            {lastOrder ? (
              <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#E5E5E5] space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <div>
                    <span className="text-[#777777] block text-[10px] uppercase">Order ID</span>
                    <span className="text-[#111111] font-black">{lastOrder.orderId}</span>
                  </div>

                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    In Transit
                  </span>
                </div>

                <div className="text-xs text-[#777777] space-y-1">
                  <p>Date: {lastOrder.date}</p>
                  <p>Total Paid: ₹{lastOrder.totalAmount?.toLocaleString('en-IN')}</p>
                  <p>Delivering To: {lastOrder.shippingAddress?.fullName}</p>
                </div>

                <div className="pt-2">
                  <Link
                    to="/track-order"
                    className="inline-block px-4 py-2 bg-[#111111] text-white text-xs font-bold rounded-xl hover:bg-[#E53935]"
                  >
                    Track Shipment
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#777777] space-y-2">
                <p>No past orders placed yet in this browser session.</p>
                <Link
                  to="/shop"
                  className="inline-block px-4 py-2 bg-[#111111] text-white text-xs font-bold rounded-xl hover:bg-[#E53935]"
                >
                  Explore Shoes
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-[#111111]">Profile Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-[#111111]">
              <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5]">
                <span className="text-[#777777] text-[10px] block uppercase">Full Name</span>
                <span>Guest User</span>
              </div>
              <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5]">
                <span className="text-[#777777] text-[10px] block uppercase">Email</span>
                <span>guest@dailywalkshoes.com</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-[#111111]">Saved Address</h2>
            <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#E5E5E5] text-xs font-medium space-y-1">
              <p className="font-extrabold text-[#111111]">Primary Delivery Address</p>
              <p className="text-[#777777]">Level 4, Express Towers, Nariman Point</p>
              <p className="text-[#777777]">Mumbai, Maharashtra - 400021</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
