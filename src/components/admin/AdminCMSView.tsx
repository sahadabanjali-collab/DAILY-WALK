import React, { useState } from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import { PromoCoupon } from '../../types';
import {
  Sparkles,
  Layers,
  Tag,
  Plus,
  Trash2,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  Sliders,
  DollarSign,
  Truck,
  Eye,
  Megaphone,
  Image as ImageIcon,
} from 'lucide-react';

const HERO_IMAGE_PRESETS = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80',
];

export const AdminCMSView: React.FC = () => {
  const { cmsData, updateCMS, resetCMS, coupons, addCoupon, toggleCoupon, deleteCoupon } = useStoreData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'announcement' | 'hero' | 'promo' | 'coupons' | 'settings'>('hero');

  // Hero form
  const [heroForm, setHeroForm] = useState(cmsData.hero);
  // Announcement form
  const [announcementForm, setAnnouncementForm] = useState(cmsData.announcement);
  // Promo banner form
  const [promoForm, setPromoForm] = useState(cmsData.promoBanner);
  // Store settings form
  const [settingsForm, setSettingsForm] = useState(cmsData.storeSettings);

  // New coupon modal form
  const [isNewCouponModalOpen, setIsNewCouponModalOpen] = useState(false);
  const [newCouponForm, setNewCouponForm] = useState<PromoCoupon>({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 999,
    expiresAt: '2026-12-31',
    isActive: true,
    usageCount: 0,
  });

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateCMS('hero', heroForm);
    showToast('Hero Banner Updated', 'Changes are live on the homepage hero section', 'success');
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateCMS('announcement', announcementForm);
    showToast('Announcement Updated', 'Top announcement ticker updated', 'success');
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    updateCMS('promoBanner', promoForm);
    showToast('Promo Banner Updated', 'Promotional campaign banner updated', 'success');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateCMS('storeSettings', settingsForm);
    showToast('Store Policies Updated', 'Thresholds and support details saved', 'success');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newCouponForm.code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!cleanCode) {
      showToast('Validation Error', 'Coupon code is required', 'error');
      return;
    }

    addCoupon({
      ...newCouponForm,
      code: cleanCode,
      discountValue: Number(newCouponForm.discountValue),
      minOrderValue: Number(newCouponForm.minOrderValue),
    });

    showToast('Coupon Created', `Promo code "${cleanCode}" is now active in checkout`, 'success');
    setIsNewCouponModalOpen(false);
    setNewCouponForm({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 15,
      minOrderValue: 999,
      expiresAt: '2026-12-31',
      isActive: true,
      usageCount: 0,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Content Management System (CMS)</h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Control homepage hero banners, announcement messages, promotional campaigns, and discount promo codes
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Restore all CMS sections and coupon codes to default values?')) {
              resetCMS();
              showToast('CMS Reset', 'Restored default promotional content', 'info');
            }
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-bold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* CMS Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 rounded-2xl overflow-x-auto">
        {[
          { key: 'hero', label: 'Hero Banner', icon: Sparkles },
          { key: 'announcement', label: 'Announcement Marquee', icon: Megaphone },
          { key: 'promo', label: 'Promo Campaign', icon: Layers },
          { key: 'coupons', label: 'Discount Coupons', icon: Tag },
          { key: 'settings', label: 'Store Policies & Thresholds', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E53935]' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. HERO BANNER TAB */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edit Form */}
          <form onSubmit={handleSaveHero} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 pb-2 border-b border-gray-100">
              Hero Section Content
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Promotional Badge Text</label>
              <input
                type="text"
                value={heroForm.badge}
                onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Headline Line 1</label>
                <input
                  type="text"
                  value={heroForm.titleLine1}
                  onChange={(e) => setHeroForm({ ...heroForm, titleLine1: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Highlight Word (Red)</label>
                <input
                  type="text"
                  value={heroForm.titleHighlight}
                  onChange={(e) => setHeroForm({ ...heroForm, titleHighlight: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white text-[#E53935]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Supporting Subtitle</label>
              <textarea
                rows={3}
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Primary Button Text</label>
                <input
                  type="text"
                  value={heroForm.primaryBtnText}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryBtnText: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Primary Button Link</label>
                <input
                  type="text"
                  value={heroForm.primaryBtnLink}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryBtnLink: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Banner Image URL</label>
              <input
                type="text"
                value={heroForm.imageUrl}
                onChange={(e) => setHeroForm({ ...heroForm, imageUrl: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
              />
              <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500">
                <span>Presets:</span>
                {HERO_IMAGE_PRESETS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setHeroForm({ ...heroForm, imageUrl: url })}
                    className="text-blue-600 hover:underline"
                  >
                    Image #{i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#111111] hover:bg-[#E53935] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
              >
                Save Hero Section Changes
              </button>
            </div>
          </form>

          {/* Live Preview Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase">Live Storefront Preview</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Real-time
                </span>
              </div>

              <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 space-y-4">
                <div className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#E53935] bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                  {heroForm.badge}
                </div>
                <h4 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                  {heroForm.titleLine1} <br />
                  <span className="text-[#E53935]">{heroForm.titleHighlight}</span>
                </h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{heroForm.subtitle}</p>

                <div className="flex items-center gap-2 pt-2">
                  <div className="px-4 py-2 bg-[#111111] text-white rounded-xl text-xs font-bold">
                    {heroForm.primaryBtnText}
                  </div>
                  <div className="px-4 py-2 bg-white text-gray-800 border border-gray-200 rounded-xl text-xs font-bold">
                    {heroForm.secondaryBtnText}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <img
                    src={heroForm.imageUrl}
                    alt="Hero Preview"
                    className="w-full h-44 rounded-xl object-cover border border-gray-200"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 text-center">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#E53935] font-bold"
              >
                <span>Open Public Homepage in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. ANNOUNCEMENT MARQUEE TAB */}
      {activeTab === 'announcement' && (
        <form onSubmit={handleSaveAnnouncement} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs max-w-2xl space-y-4">
          <h3 className="text-base font-extrabold text-gray-900 pb-2 border-b border-gray-100">
            Top Header Announcement Bar
          </h3>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <div className="text-xs font-bold text-gray-900">Show Announcement Bar</div>
              <div className="text-[11px] text-gray-500 font-medium">Display on top of header across all pages</div>
            </div>
            <input
              type="checkbox"
              checked={announcementForm.isActive}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, isActive: e.target.checked })}
              className="w-5 h-5 rounded text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Announcement Message 1</label>
            <input
              type="text"
              value={announcementForm.text1}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, text1: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Announcement Message 2</label>
            <input
              type="text"
              value={announcementForm.text2}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, text2: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Banner Destination Link</label>
            <input
              type="text"
              value={announcementForm.link}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, link: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#111111] hover:bg-[#E53935] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
            >
              Update Announcement Bar
            </button>
          </div>
        </form>
      )}

      {/* 3. PROMO CAMPAIGN TAB */}
      {activeTab === 'promo' && (
        <form onSubmit={handleSavePromo} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs max-w-2xl space-y-4">
          <h3 className="text-base font-extrabold text-gray-900 pb-2 border-b border-gray-100">
            Promotional Mid-page Banner
          </h3>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <div className="text-xs font-bold text-gray-900">Enable Promo Campaign Banner</div>
              <div className="text-[11px] text-gray-500 font-medium">Show promotional banner on home feed</div>
            </div>
            <input
              type="checkbox"
              checked={promoForm.isActive}
              onChange={(e) => setPromoForm({ ...promoForm, isActive: e.target.checked })}
              className="w-5 h-5 rounded text-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Campaign Headline</label>
              <input
                type="text"
                value={promoForm.title}
                onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Discount Tagline</label>
              <input
                type="text"
                value={promoForm.discountText}
                onChange={(e) => setPromoForm({ ...promoForm, discountText: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#E53935]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle</label>
            <textarea
              rows={2}
              value={promoForm.subtitle}
              onChange={(e) => setPromoForm({ ...promoForm, subtitle: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Banner Background Image URL</label>
            <input
              type="text"
              value={promoForm.imageUrl}
              onChange={(e) => setPromoForm({ ...promoForm, imageUrl: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#111111] hover:bg-[#E53935] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
            >
              Save Promo Banner
            </button>
          </div>
        </form>
      )}

      {/* 4. COUPONS TAB */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Promo Codes & Discounts</h3>
              <p className="text-xs text-gray-500 font-medium">
                Coupons created here can be applied directly in customer checkout and cart summary
              </p>
            </div>

            <button
              onClick={() => setIsNewCouponModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] hover:bg-[#E53935] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon Code</span>
            </button>
          </div>

          {/* Coupons Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold">
                  <th className="py-3 px-4 font-semibold">Promo Code</th>
                  <th className="py-3 px-3 font-semibold">Discount</th>
                  <th className="py-3 px-3 font-semibold">Min Spend</th>
                  <th className="py-3 px-3 font-semibold">Description</th>
                  <th className="py-3 px-3 font-semibold">Expires</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map((c) => (
                  <tr key={c.code} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-black text-gray-900 text-sm tracking-wider">
                        {c.code}
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium">Used {c.usageCount} times</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-black text-emerald-700">
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-medium text-gray-700">₹{c.minOrderValue.toLocaleString()}</td>

                    <td className="py-3 px-3 text-gray-600 max-w-xs">{c.description}</td>

                    <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">{c.expiresAt}</td>

                    <td className="py-3 px-3">
                      <button
                        onClick={() => toggleCoupon(c.code)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                          c.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Paused'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteCoupon(c.code)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. STORE SETTINGS TAB */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs max-w-2xl space-y-4">
          <h3 className="text-base font-extrabold text-gray-900 pb-2 border-b border-gray-100">
            Storefront Policies & Delivery Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={settingsForm.freeShippingThreshold}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
              />
              <span className="text-[11px] text-gray-400">Cart values above this get free shipping</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                value={settingsForm.shippingFee}
                onChange={(e) => setSettingsForm({ ...settingsForm, shippingFee: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
              />
              <span className="text-[11px] text-gray-400">Applied when below threshold</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Return & Exchange Window (Days)</label>
              <input
                type="number"
                value={settingsForm.returnPeriodDays}
                onChange={(e) => setSettingsForm({ ...settingsForm, returnPeriodDays: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Support Contact Phone</label>
              <input
                type="text"
                value={settingsForm.supportPhone}
                onChange={(e) => setSettingsForm({ ...settingsForm, supportPhone: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Customer Support Email</label>
            <input
              type="email"
              value={settingsForm.supportEmail}
              onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#111111] hover:bg-[#E53935] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
            >
              Update Store Policies
            </button>
          </div>
        </form>
      )}

      {/* Create Coupon Modal */}
      {isNewCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-base font-black text-gray-900">Create New Promo Code</h3>
              <button onClick={() => setIsNewCouponModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH30"
                  value={newCouponForm.code}
                  onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black font-mono tracking-wider focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={newCouponForm.discountType}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newCouponForm.discountValue}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCouponForm.minOrderValue}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, minOrderValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Expires On</label>
                  <input
                    type="date"
                    value={newCouponForm.expiresAt}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description / Customer Note</label>
                <input
                  type="text"
                  placeholder="e.g. 15% off on orders above ₹999"
                  value={newCouponForm.description}
                  onChange={(e) => setNewCouponForm({ ...newCouponForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNewCouponModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#111111] hover:bg-[#E53935] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
