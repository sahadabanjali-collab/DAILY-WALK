import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              <Lock className="w-4 h-4 text-neutral-900" />
              PRIVACY & SECURITY
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#111111] tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
              Last updated: October 2026. How we protect and respect your personal data.
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
            <h2 className="font-heading font-bold text-base text-neutral-900">1. Data Collection</h2>
            <p>
              We collect information necessary to fulfill your footwear orders, provide order tracking, and personalize your sizing recommendations (such as shipping address, contact phone, and shoe size preference).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-neutral-900">2. No Sale of Personal Information</h2>
            <p>
              We do not sell, rent, or trade your personal information to third-party data brokers or marketing agencies under any circumstances.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-neutral-900">3. Payment Information Security</h2>
            <p>
              Your credit card numbers, CVVs, and banking credentials are never processed or stored on our servers. All transactions are securely handled through PCI-DSS Level 1 compliant gateway partners (Razorpay).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-neutral-900">4. Your Rights</h2>
            <p>
              You have the right to request access to the personal data we hold about you or request its complete erasure by emailing support@dailywalkshoes.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
