import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Recycle, Droplets, Sun, ArrowLeft, ArrowRight } from 'lucide-react';

export const SustainabilityPage: React.FC = () => {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Leaf className="w-4 h-4 text-emerald-700" />
            CONSCIOUS FOOTWEAR
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-[#111111] tracking-tight leading-tight">
            Light on Your Feet, Gentle on the Planet.
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
            Our commitment to environmental stewardship extends from circular shoe recycling programs to 100% plastic-free recycled corrugated delivery boxes.
          </p>
        </div>

        {/* Big Banner Visual */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-[#F6F6F6]">
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80"
            alt="Sustainable footwear crafting"
            className="w-full h-full object-cover grayscale opacity-90"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 text-center">
            <div className="max-w-md text-white space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-emerald-300">Goal 2028</span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl">Zero Landfill Footwear</h2>
              <p className="text-xs sm:text-sm text-gray-200">
                Working toward 100% closed-loop circularity in every model we distribute across the subcontinent.
              </p>
            </div>
          </div>
        </div>

        {/* Key Initiatives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#F6F6F6] rounded-2xl p-6 space-y-3">
            <Recycle className="w-7 h-7 text-emerald-600" />
            <h3 className="font-heading font-bold text-base text-neutral-900">
              Shoe Trade-In Program
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Send us any pair of gently worn shoes. We partner with grassroots NGOs to clean, disinfect, and donate them to communities in need, while crediting ₹500 to your account.
            </p>
          </div>

          <div className="bg-[#F6F6F6] rounded-2xl p-6 space-y-3">
            <Leaf className="w-7 h-7 text-emerald-600" />
            <h3 className="font-heading font-bold text-base text-neutral-900">
              100% Recycled Packaging
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              We eliminated all plastic polybags and air pillows. All Daily Walk parcels are packed in unbleached, FSC-certified cardboard sealed with water-activated starch tape.
            </p>
          </div>

          <div className="bg-[#F6F6F6] rounded-2xl p-6 space-y-3">
            <Sun className="w-7 h-7 text-emerald-600" />
            <h3 className="font-heading font-bold text-base text-neutral-900">
              Solar Powered Hubs
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Our primary Bhiwandi distribution and quality inspection center operates on a 150kW rooftop solar grid, reducing operational carbon footprint by over 45%.
            </p>
          </div>
        </div>

        {/* Commitment */}
        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading font-bold text-lg text-neutral-900">Have an old pair to recycle?</h3>
            <p className="text-xs sm:text-sm text-neutral-500">Contact our support desk to receive a prepaid shipping label for shoe recycling.</p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-colors inline-flex items-center gap-2 flex-shrink-0"
          >
            <span>Learn About Trade-In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
