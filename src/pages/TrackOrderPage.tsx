import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TrackOrderPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setSearched(true);
    const cleanId = orderId.trim().toUpperCase();

    // Check localStorage or mock response
    try {
      const saved = localStorage.getItem('daily_walk_last_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.orderId?.toUpperCase() === cleanId) {
          setTrackedOrder(parsed);
          return;
        }
      }
    } catch {}

    // Mock realistic order result
    setTrackedOrder({
      orderId: cleanId,
      date: '10 Aug 2026',
      status: 'In Transit',
      carrier: 'BlueDart Express',
      trackingNumber: 'BD982301923IN',
      estimatedDelivery: '14 Aug 2026',
      location: 'Sorting Hub, Mumbai',
      itemsCount: 1,
    });
  };

  return (
    <div className="py-10 bg-[#F7F7F7]/40 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] flex items-center gap-2">
              <Truck className="w-7 h-7 text-[#E53935]" />
              Track Your Footwear Shipment
            </h1>
            <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
              Enter your Order ID (e.g. DW-829301) or AWB Tracking Number.
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

        {/* Tracking Form */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-xs">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. DW-829301)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#111111] hover:bg-[#E53935] text-white text-xs font-extrabold rounded-xl transition-colors shadow-md"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Tracked Results */}
        {searched && trackedOrder && (
          <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E5E5E5]">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#777777]">
                  Order Number
                </span>
                <h3 className="text-lg font-black text-[#111111]">{trackedOrder.orderId}</h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-extrabold uppercase text-[#777777]">
                  Current Status
                </span>
                <p className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  ⚡ {trackedOrder.status || 'In Transit'}
                </p>
              </div>
            </div>

            {/* Visual Timeline Steps */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[11px] font-bold">
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[#111111]">Confirmed</span>
              </div>

              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-[#111111]">Packed</span>
              </div>

              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-[#E53935] text-white flex items-center justify-center mx-auto animate-pulse">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[#E53935] font-black">In Transit</span>
              </div>

              <div className="space-y-1 opacity-40">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center mx-auto">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Delivered</span>
              </div>
            </div>

            {/* Metadata list */}
            <div className="bg-[#F7F7F7] p-4 rounded-2xl border border-[#E5E5E5] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#777777]">Courier Partner:</span>
                <span className="font-bold text-[#111111]">
                  {trackedOrder.carrier || 'BlueDart Express'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Tracking Number:</span>
                <span className="font-bold text-[#111111]">
                  {trackedOrder.trackingNumber || 'BD982301923IN'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Estimated Delivery:</span>
                <span className="font-extrabold text-[#E53935]">
                  {trackedOrder.estimatedDelivery || '14 Aug 2026'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
