import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DailyWalkLogo } from './DailyWalkLogo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useStoreData } from '../../context/StoreDataContext';
import { Search, Heart, ShoppingBag, User, Menu, X, ShieldCheck, LogOut, Package } from 'lucide-react';
import { MobileNavDrawer } from './MobileNavDrawer';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const { cartCount, toggleCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, signOut } = useAuth();
  const { cmsData } = useStoreData();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    { name: 'Shop', path: '/shop' },
    { name: 'Men', path: '/men' },
    { name: 'Women', path: '/women' },
    { name: 'Kids', path: '/kids' },
    { name: 'Brands', path: '/shop?filter=brands' },
    { name: 'Sale', path: '/sale', isSale: true },
  ];

  const announcementText = cmsData?.announcement?.isActive
    ? `${cmsData.announcement.text1} ${cmsData.announcement.text2 ? `| ${cmsData.announcement.text2}` : ''}`
    : 'Free shipping on all orders over ₹1,999 | Easy 30-day returns';

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100">
      {/* 1. Slim Black Announcement Bar (Matching Reference) */}
      <div className="bg-[#0B0B0B] text-white py-2 px-4 text-center text-[11px] sm:text-xs font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="text-gray-200">
          {announcementText}
        </span>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between gap-4 transition-all duration-200 ${isScrolled ? 'py-3.5' : 'py-4 sm:py-5'}`}>
          {/* Brand Logo & Mobile Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#111111] hover:bg-gray-100 rounded-lg transition-colors -ml-2"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <DailyWalkLogo size="md" />
          </div>

          {/* Center Navigation Links (Matching Reference with Active Underline) */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path.split('?')[0]);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[13px] tracking-normal transition-colors relative py-1 ${
                    link.isSale
                      ? 'text-[#E53935] font-semibold hover:text-red-700'
                      : isActive
                      ? 'text-[#111111] font-bold'
                      : 'text-[#333333] font-medium hover:text-black'
                  }`}
                >
                  {link.name}
                  {/* Active tab indicator underline */}
                  {isActive && !link.isSale && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Matching Reference: Search, Heart, Bag, User) */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1.5 text-neutral-800 hover:text-black transition-colors"
              aria-label="Search shoes"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="p-1.5 text-neutral-800 hover:text-black transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E53935] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger with Counter Badge */}
            <button
              onClick={toggleCartDrawer}
              className="p-1.5 text-neutral-800 hover:text-black transition-colors relative"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account Dropdown */}
            <div className="relative" ref={accountMenuRef}>
              {user ? (
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="p-1.5 text-neutral-800 hover:text-black transition-colors flex items-center gap-1.5"
                  aria-label="User Account"
                >
                  <User className="w-5 h-5 stroke-[1.75]" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-1.5 text-neutral-800 hover:text-black transition-colors"
                  aria-label="Sign in"
                >
                  <User className="w-5 h-5 stroke-[1.75]" />
                </Link>
              )}

              {/* Account Dropdown Menu */}
              {isAccountMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900 truncate">{user.fullName || 'Member'}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/account"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/account?tab=orders"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-4 h-4 text-gray-500" />
                    <span>My Orders</span>
                  </Link>

                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={() => {
                      signOut();
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Direct Admin Link if admin */}
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
              >
                <span>Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Search Drawer */}
      {isSearchOpen && (
        <div className="border-t border-gray-100 bg-[#F9F9F9] py-3 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by shoe name, brand (Nike, Adidas, Puma...)"
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};
