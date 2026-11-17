import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Award, Users, HeartHandshake, ArrowRight } from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <Sparkles className="w-4 h-4 text-neutral-900" />
            OUR STORY
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-[#111111] tracking-tight leading-tight">
            Crafting Everyday Greatness, One Step At A Time.
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
            Daily Walk was founded on a simple premise: footwear should never compromise between cutting-edge athletic engineering and clean, timeless aesthetics.
          </p>
        </div>

        {/* Hero Brand Imagery */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-[#F6F6F6]">
          <img
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1400&q=80"
            alt="Daily Walk Footwear Craftsmanship"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Brand Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#F6F6F6] rounded-2xl p-6 space-y-3">
            <Award className="w-7 h-7 text-neutral-900" />
            <h3 className="font-heading font-black text-lg text-neutral-900">
              100% Authentic Originals
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every sneaker and dress shoe in our catalog is procured directly from authorized global brand manufacturers with verified barcode provenance.
            </p>
          </div>

          <div className="bg-[#F6F6F6] rounded-2xl p-6 space-y-3">
            <Users className="w-7 h-7 text-neutral-900" />
            <h3 className="font-heading font-black text-lg text-neutral-900">
              Designed For Real Steps
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              We test our soles for high-impact cushioning, orthotic arch support, and long-lasting traction across uneven urban pavements and daily commutes.
            </p>
          </div>

          <div className="bg-[#F6F6F6] rounded-2xl p-6 space-y-3">
            <HeartHandshake className="w-7 h-7 text-neutral-900" />
            <h3 className="font-heading font-black text-lg text-neutral-900">
              Customer First Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              From instant doorstep size exchanges to 24/7 dedicated support, our priority is ensuring every customer finds their perfect fit.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="font-heading font-black text-2xl text-neutral-900">
            From a Mumbai Design Studio to Pan-India Footwear Destination
          </h2>
          <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Started in 2026, Daily Walk began with an obsessive team of sneaker enthusiasts, industrial designers, and marathoners who were tired of overpriced reseller markups and fragile fast-fashion footwear.
            </p>
            <p>
              Today, Daily Walk fulfills thousands of pairs each week to customers across all 28 states and union territories in India. Through our direct brand partnerships with Nike, Adidas, Puma, New Balance, and Converse, we make authentic footwear accessible at transparent prices.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-black text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading font-black text-xl">Ready to step into style?</h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">Explore our curated collection of bestselling sneakers and lifestyle footwear.</p>
          </div>
          <Link
            to="/shop"
            className="px-6 py-3 bg-white text-black text-xs font-bold rounded-full hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 flex-shrink-0"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
