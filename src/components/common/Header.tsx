import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DailyWalkLogo } from './DailyWalkLogo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { MobileNavDrawer } from './MobileNavDrawer';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { cartCount, toggleCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search/mobile menu on route change
  useEffect(() => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Men', path: '/men' },
    { name: 'Women', path: '/women' },
    { name: 'Kids', path: '/kids' },
    { name: 'Sports', path: '/sports' },
    { name: 'Casual', path: '/casual' },
    { name: 'Formal', path: '/formal' },
    { name: 'Sale', path: '/sale', isSale: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white transition-all duration-200 border-b border-[#E5E5E5]">
      {/* 9. Announcement Bar */}
      <div className="bg-[#111111] text-white py-2 px-4 text-center text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2">
        <span>⚡ FREE SHIPPING ON ORDERS ABOVE ₹1,999</span>
        <span className="hidden sm:inline text-gray-400">|</span>
        <span className="hidden sm:inline text-[#E53935]">EASY 15-DAY RETURNS</span>
      </div>

      {/* Sticky Navigation Bar */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isScrolled ? 'py-3 shadow-md' : 'py-4'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#111111] hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <DailyWalkLogo size="md" showTagline={false} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-bold transition-colors relative py-1 ${
                    link.isSale
                      ? 'text-[#E53935] hover:text-red-700 font-extrabold'
                      : isActive
                      ? 'text-[#111111]'
                      : 'text-[#222222] hover:text-[#E53935]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E53935] rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search Icon / Bar Toggle */}
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="p-2 text-[#222222] hover:text-[#E53935] hover:bg-gray-100 rounded-xl transition-colors relative"
              aria-label="Search shoes"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-2 text-[#222222] hover:text-[#E53935] hover:bg-gray-100 rounded-xl transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#E53935] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Icon */}
            <Link
              to="/account"
              className="p-2 text-[#222222] hover:text-[#E53935] hover:bg-gray-100 rounded-xl transition-colors hidden sm:flex"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Icon & Count */}
            <button
              onClick={toggleCartDrawer}
              className="p-2 bg-[#111111] text-white hover:bg-[#E53935] rounded-xl transition-all duration-200 flex items-center gap-2 shadow-xs ml-1"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs font-extrabold pr-0.5">
                ({cartCount})
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Desktop & Mobile Search Dropdown */}
        {isSearchOpen && (
          <div className="mt-3 pt-3 border-t border-[#E5E5E5] animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search Nike, Adidas, Sneakers, Running, Sports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-11 pr-24 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-sm font-medium text-[#111111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#111111] text-white text-xs font-bold rounded-lg hover:bg-[#E53935] transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};
