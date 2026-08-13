import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DailyWalkLogo } from './DailyWalkLogo';
import { SizeGuideModal } from './SizeGuideModal';
import { Instagram, Facebook, Youtube, Twitter, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-12 border-t border-gray-800">
      {/* Top Value Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#E53935] transition-colors">
            <Truck className="w-8 h-8 text-[#E53935] mb-2" />
            <h4 className="text-sm font-bold text-white">Free Fast Shipping</h4>
            <p className="text-xs text-gray-400 mt-1">On orders above ₹1,999</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#E53935] transition-colors">
            <RotateCcw className="w-8 h-8 text-[#E53935] mb-2" />
            <h4 className="text-sm font-bold text-white">15-Day Easy Returns</h4>
            <p className="text-xs text-gray-400 mt-1">Hassle-free exchange policy</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#E53935] transition-colors">
            <ShieldCheck className="w-8 h-8 text-[#E53935] mb-2" />
            <h4 className="text-sm font-bold text-white">Secure Payments</h4>
            <p className="text-xs text-gray-400 mt-1">100% encrypted checkout</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#E53935] transition-colors">
            <Award className="w-8 h-8 text-[#E53935] mb-2" />
            <h4 className="text-sm font-bold text-white">100% Genuine Quality</h4>
            <p className="text-xs text-gray-400 mt-1">Directly sourced footwear</p>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <DailyWalkLogo size="lg" showTagline={true} className="text-white" />
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            Step Into Your Everyday Style. Daily Walk brings you premium, comfortable, and durable footwear designed to keep you moving every single day.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="#instagram"
              onClick={(e) => e.preventDefault()}
              className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-[#E53935] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#facebook"
              onClick={(e) => e.preventDefault()}
              className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-[#E53935] transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#youtube"
              onClick={(e) => e.preventDefault()}
              className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-[#E53935] transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="#twitter"
              onClick={(e) => e.preventDefault()}
              className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-[#E53935] transition-colors"
              aria-label="Twitter X"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Shop Column */}
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-white mb-4">Shop</h4>
          <ul className="space-y-2.5 text-sm text-gray-400 font-medium">
            <li><Link to="/men" className="hover:text-white transition-colors">Men's Footwear</Link></li>
            <li><Link to="/women" className="hover:text-white transition-colors">Women's Footwear</Link></li>
            <li><Link to="/kids" className="hover:text-white transition-colors">Kids' Shoes</Link></li>
            <li><Link to="/shop?category=sneakers" className="hover:text-white transition-colors">Sneakers</Link></li>
            <li><Link to="/sports" className="hover:text-white transition-colors">Sports & Running</Link></li>
            <li><Link to="/casual" className="hover:text-white transition-colors">Casual Footwear</Link></li>
            <li><Link to="/formal" className="hover:text-white transition-colors">Formal Shoes</Link></li>
            <li><Link to="/sale" className="text-[#E53935] font-bold hover:text-red-400 transition-colors">Seasonal Sale</Link></li>
          </ul>
        </div>

        {/* Help Column */}
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-white mb-4">Help</h4>
          <ul className="space-y-2.5 text-sm text-gray-400 font-medium">
            <li><Link to="/account" className="hover:text-white transition-colors">My Account</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
            <li><Link to="/account" className="hover:text-white transition-colors">Track Orders</Link></li>
            <li>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="hover:text-[#E53935] text-left transition-colors font-bold text-white underline underline-offset-4"
              >
                Size Guide Chart
              </button>
            </li>
            <li><Link to="/account" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Customer FAQs</span></li>
          </ul>
        </div>

        {/* About Column */}
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-white mb-4">About</h4>
          <ul className="space-y-2.5 text-sm text-gray-400 font-medium">
            <li><span className="hover:text-white cursor-pointer transition-colors">About Daily Walk</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Our Story</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Store Locator</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>© 2026 Daily Walk. All rights reserved.</p>
        <div className="flex items-center gap-4 text-gray-400">
          <span>Designed with craftsmanship for everyday style</span>
        </div>
      </div>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </footer>
  );
};
