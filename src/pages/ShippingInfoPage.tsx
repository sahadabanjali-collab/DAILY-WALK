import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, ShieldCheck, MapPin, ArrowLeft, PackageCheck } from 'lucide-react';

export const ShippingInfoPage: React.FC = () => {
  const shippingTiers = [
    {
      name: 'Standard Surface Delivery',
      time: '3–5 Business Days',
      cost: 'FREE on orders over ₹1,999 (else ₹99)',
      carrier: 'Blue Dart, Delhivery & Bluedart Air',
    },
    {
      name: 'Express Air Shipping',
      time: '1–2 Business Days',
      cost: '₹199 flat',
      carrier: 'Fast-track priority flights',
    },
    {
      name: 'Same Day Metro Delivery',
      time: 'Order before 11 AM (Mumbai, Delhi-NCR, Bangalore)',
      cost: '₹299 flat',
      carrier: 'Direct courier partner dispatch',
    },
  ];

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              <Truck className="w-4 h-4 text-neutral-900" />
              CUSTOMER CARE
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#111111] tracking-tight">
              Shipping & Delivery
            </h1>
            <p className="text-sm text-neutral-500 font-normal mt-1">
              Fast, reliable doorstep delivery with live tracking on all footwear orders across India.
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 hover:text-black border border-gray-200 px-3.5 py-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Highlight Banner */}
        <div className="bg-[#F6F6F6] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Free Shipping Policy</span>
            <h3 className="font-heading font-black text-xl text-neutral-900 mt-0.5">
              Zero delivery fee on all orders above ₹1,999
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Applies automatically at checkout for all pincodes in India.
            </p>
          </div>
          <Link
            to="/track-order"
            className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-colors flex-shrink-0"
          >
            Track Existing Order
          </Link>
        </div>

        {/* Shipping Tiers */}
        <div className="space-y-4">
          <h2 className="font-heading font-black text-lg text-neutral-900">
            Delivery Options & Timeframes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shippingTiers.map((tier, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-black transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#F6F6F6] flex items-center justify-center text-neutral-800 mb-3">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-neutral-900 mb-1">
                    {tier.name}
                  </h3>
                  <p className="text-xs font-semibold text-neutral-500 mb-3">
                    {tier.time}
                  </p>
                  <p className="text-sm font-extrabold text-neutral-900">
                    {tier.cost}
                  </p>
                </div>
                <p className="text-[11px] text-neutral-400 mt-4 pt-3 border-t border-gray-100">
                  Shipped via: {tier.carrier}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Delivery Policies */}
        <div className="space-y-6 pt-4 border-t border-gray-100">
          <h2 className="font-heading font-black text-lg text-neutral-900">
            Frequently Asked Shipping Questions
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <div className="border border-gray-100 rounded-xl p-4 bg-white">
              <h4 className="font-bold text-neutral-900 mb-1">When will my pair be dispatched?</h4>
              <p>
                Orders placed before 2:00 PM IST on business days are dispatched from our Mumbai warehouse on the very same day. Orders placed after 2:00 PM are dispatched on the next working day.
              </p>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 bg-white">
              <h4 className="font-bold text-neutral-900 mb-1">How can I track my shipment?</h4>
              <p>
                As soon as your pair leaves our fulfillment hub, you will receive an SMS and email notification with an AWB tracking code. You can enter your Order ID or tracking code on our <Link to="/track-order" className="text-black font-bold underline">Track Order page</Link> to view live status.
              </p>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 bg-white">
              <h4 className="font-bold text-neutral-900 mb-1">What if I am unavailable during delivery?</h4>
              <p>
                Our courier partners will make up to 3 delivery attempts. You will receive an automated call/SMS to reschedule or confirm OTP.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
