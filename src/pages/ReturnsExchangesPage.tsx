import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export const ReturnsExchangesPage: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              <RotateCcw className="w-4 h-4 text-neutral-900" />
              CUSTOMER CARE
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#111111] tracking-tight">
              30-Day Returns & Exchanges
            </h1>
            <p className="text-sm text-neutral-500 font-normal mt-1">
              Doesn't fit quite right? We offer hassle-free doorstep returns and instant size exchanges.
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

        {/* Return Initiator Box */}
        <div className="bg-[#F6F6F6] rounded-2xl p-6 sm:p-8">
          <h2 className="font-heading font-black text-xl text-neutral-900 mb-2">
            Start a Return or Size Exchange
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mb-5">
            Enter your Order ID (found in your confirmation email/SMS) to initiate a pickup.
          </p>

          {submitted ? (
            <div className="bg-white p-5 rounded-xl border border-emerald-200 flex items-start gap-3.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-neutral-900">Return Request Found for #{orderNumber}</h4>
                <p className="text-xs text-neutral-600 mt-1">
                  Our customer concierge has initiated a complimentary reverse pickup request. The courier will inspect shoe condition and collect the package within 24–48 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-bold text-black underline"
                >
                  Lookup another order
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLookup} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Order ID (e.g., DW-78921)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black"
                required
              />
              <input
                type="text"
                placeholder="Email or Mobile Number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Find My Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* 4 Steps to Return */}
        <div className="space-y-4">
          <h2 className="font-heading font-black text-lg text-neutral-900">
            How Returns Work (4 Simple Steps)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-gray-100 rounded-2xl p-5 bg-white">
              <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold mb-3">
                1
              </div>
              <h4 className="font-heading font-bold text-sm text-neutral-900 mb-1">Request Online</h4>
              <p className="text-xs text-neutral-500">
                Submit your order ID and choose between instant size exchange or full refund.
              </p>
            </div>

            <div className="border border-gray-100 rounded-2xl p-5 bg-white">
              <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold mb-3">
                2
              </div>
              <h4 className="font-heading font-bold text-sm text-neutral-900 mb-1">Pack In Box</h4>
              <p className="text-xs text-neutral-500">
                Keep the original shoe box, brand tags, and accessories in unused condition.
              </p>
            </div>

            <div className="border border-gray-100 rounded-2xl p-5 bg-white">
              <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold mb-3">
                3
              </div>
              <h4 className="font-heading font-bold text-sm text-neutral-900 mb-1">Free Doorstep Pickup</h4>
              <p className="text-xs text-neutral-500">
                Our courier executive will collect the shoe right from your front door at no extra charge.
              </p>
            </div>

            <div className="border border-gray-100 rounded-2xl p-5 bg-white">
              <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold mb-3">
                4
              </div>
              <h4 className="font-heading font-bold text-sm text-neutral-900 mb-1">Instant Refund / Swap</h4>
              <p className="text-xs text-neutral-500">
                Refunds are credited to original payment source (UPI/Cards) within 24 hours of inspection.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Conditions */}
        <div className="border-t border-gray-100 pt-6 space-y-3">
          <h3 className="font-heading font-bold text-base text-neutral-900">
            Eligibility & Guidelines
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-neutral-600">
            <li>Shoes must be tried on clean indoor carpeted surfaces to prevent sole scuff marks.</li>
            <li>Original manufacturer brand boxes must not have direct tape or courier labels slapped onto them.</li>
            <li>Products bought during "Final Clearance" or marked as non-returnable in catalog are eligible for size exchange only.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
