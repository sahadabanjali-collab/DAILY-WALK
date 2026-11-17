import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const TermsConditionsPage: React.FC = () => {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              <ShieldCheck className="w-4 h-4 text-neutral-900" />
              LEGAL
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#111111] tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
              Last updated: October 2026. Governing transactions and use of Daily Walk platform.
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 hover:text-black border border-gray-200 px-3.5 py-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shop</span>
          </Link>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-neutral-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-neutral-900">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or purchasing through dailywalkshoes.com or our affiliated retail services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-neutral-900">2. Product Authenticity Guarantee</h2>
            <p>
              Daily Walk guarantees that all footwear products sold on this platform are 100% authentic, brand-new, and sourced through official distributor agreements. Any proven non-authentic shipment will be eligible for a 200% money-back guarantee.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-neutral-900">3. Pricing and Payments</h2>
            <p>
              All prices listed on the platform are in Indian Rupees (INR) and inclusive of applicable Goods and Services Tax (GST). Payments are securely handled via RBI-authorized payment aggregators (Razorpay) with 256-bit SSL encryption.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-neutral-900">4. Cancellations and Refunds</h2>
            <p>
              Orders can be cancelled before dispatch without cancellation fees. Eligible returns requested within 30 days of delivery will be refunded directly to the original payment source within 24–48 hours of return quality inspection.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
