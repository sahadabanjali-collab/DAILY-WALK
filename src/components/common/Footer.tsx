import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DailyWalkLogo } from './DailyWalkLogo';
import { SizeGuideModal } from './SizeGuideModal';
import { Instagram, Facebook, Twitter, ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#0B0B0B] text-white pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand Info Column */}
          <div className="lg:col-span-4 space-y-4">
            <DailyWalkLogo size="md" className="text-white brightness-200" />
            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed">
              Your destination for authentic branded shoes. Quality, style, and comfort — all in one place.
            </p>

            {/* Social Icons matching reference */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#instagram"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                aria-label="Twitter X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* SHOP Column */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-white mb-4">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Shoes</Link></li>
              <li><Link to="/men" className="hover:text-white transition-colors">Men</Link></li>
              <li><Link to="/women" className="hover:text-white transition-colors">Women</Link></li>
              <li><Link to="/kids" className="hover:text-white transition-colors">Kids</Link></li>
              <li><Link to="/sale" className="text-[#E53935] hover:text-red-400 transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* CUSTOMER CARE Column */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-white mb-4">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping-info" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* COMPANY Column */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-white mb-4">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/sustainability" className="hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/stores" className="hover:text-white transition-colors">Store Locator</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER Column */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-white mb-4">
              NEWSLETTER
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              Get updates on new arrivals, exclusive offers and more.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="relative flex items-center">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-3.5 pr-10 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                required
              />
              <button
                type="submit"
                className="absolute right-1.5 p-1.5 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
                aria-label="Subscribe"
              >
                {subscribed ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright and Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 Daily Walk. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-neutral-400 transition-colors">Terms & Conditions</Link>
            <Link to="/privacy" className="hover:text-neutral-400 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </footer>
  );
};
