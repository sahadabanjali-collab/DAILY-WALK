import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DailyWalkLogo } from './DailyWalkLogo';
import { X, Heart, User, Home, Sparkles, ChevronRight, LogOut, LogIn, ShieldCheck } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { wishlistCount } = useWishlist();
  const { user, signOut } = useAuth();

  if (!isOpen) return null;

  const menuItems = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'Men', path: '/men' },
    { name: 'Women', path: '/women' },
    { name: 'Kids', path: '/kids' },
    { name: 'Sports', path: '/sports' },
    { name: 'Casual', path: '/casual' },
    { name: 'Formal', path: '/formal' },
    { name: 'Sale', path: '/sale', isSale: true, icon: <Sparkles className="w-4 h-4 text-[#E53935]" /> },
    {
      name: 'Wishlist',
      path: '/wishlist',
      icon: <Heart className="w-4 h-4 text-[#E53935]" />,
      badge: wishlistCount > 0 ? wishlistCount : undefined,
    },
    {
      name: user ? 'My Account' : 'Sign In / Register',
      path: user ? '/account' : '/login',
      icon: user ? <User className="w-4 h-4 text-emerald-600" /> : <LogIn className="w-4 h-4 text-[#E53935]" />,
    },
    {
      name: 'Admin Console',
      path: '/admin',
      icon: <ShieldCheck className="w-4 h-4 text-amber-600" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl flex flex-col justify-between z-50 animate-slide-in-left">
        {/* Header */}
        <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <DailyWalkLogo size="sm" showTagline={false} />
          <button
            onClick={onClose}
            className="p-2 text-[#777777] hover:text-[#111111] hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  item.isSale
                    ? 'text-[#E53935] bg-red-50 hover:bg-red-100'
                    : isActive
                    ? 'bg-[#111111] text-white'
                    : 'text-[#222222] hover:bg-[#F7F7F7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 bg-[#E53935] text-white text-xs font-extrabold rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom user / promo info */}
        <div className="p-4 bg-[#F7F7F7] border-t border-[#E5E5E5] text-xs text-[#777777] space-y-2">
          {user ? (
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <div className="truncate pr-2">
                <span className="block font-black text-[#111111] truncate">{user.fullName}</span>
                <span className="text-[11px] text-gray-500 truncate block">{user.email}</span>
              </div>
              <button
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="px-2.5 py-1 bg-white hover:bg-red-50 text-red-600 rounded-lg border border-red-200 text-[11px] font-extrabold shrink-0"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pb-2 border-b border-gray-200">
              <Link
                to="/login"
                onClick={onClose}
                className="w-full py-2 bg-[#111111] text-white text-xs font-black rounded-xl text-center block hover:bg-[#E53935] transition-colors"
              >
                Sign In / Join Daily Walk
              </Link>
            </div>
          )}
          <p className="font-bold text-[#111111]">Daily Walk Footwear</p>
          <p>Step Into Your Everyday Style with 100% original shoes and easy 15-day returns.</p>
        </div>
      </div>
    </div>
  );
};
