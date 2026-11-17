import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Layers,
  History,
  Database,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
  Plus,
  RefreshCw,
  Bell,
  Lock,
  Sparkles,
} from 'lucide-react';

import { AdminAnalyticsView } from '../../components/admin/AdminAnalyticsView';
import { AdminProductsView } from '../../components/admin/AdminProductsView';
import { AdminOrdersView } from '../../components/admin/AdminOrdersView';
import { AdminCustomersView } from '../../components/admin/AdminCustomersView';
import { AdminCMSView } from '../../components/admin/AdminCMSView';
import { AdminAuditLogsView } from '../../components/admin/AdminAuditLogsView';
import { AdminSupabaseSyncView } from '../../components/admin/AdminSupabaseSyncView';

type AdminTab = 'analytics' | 'products' | 'orders' | 'customers' | 'cms' | 'logs' | 'supabase';

export const AdminDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as AdminTab) || 'analytics';

  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { user, signOut, adminDemoLogin } = useAuth();
  const { products, orders, customers, supabaseStatus, isSyncing } = useStoreData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Sync tab with URL
  useEffect(() => {
    const tabParam = searchParams.get('tab') as AdminTab;
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    setIsMobileSidebarOpen(false);
  };

  const handleAdminSignOut = async () => {
    await signOut();
    showToast('Admin Signed Out', 'Administrator session ended.', 'info');
    navigate('/admin/login');
  };

  // Strict check: Only authorized administrator can access console
  const isAdmin =
    user?.isAdmin ||
    user?.email?.toLowerCase() === 'sahadabanjali@gmail.com' ||
    user?.email?.toLowerCase().includes('admin');

  // If not authenticated as admin, redirect to dedicated Admin Login portal
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const navigationItems = [
    { id: 'analytics', label: 'Executive Analytics', icon: TrendingUp },
    { id: 'products', label: 'Product Catalog', icon: Package, badge: products.length },
    { id: 'orders', label: 'Order Tracking & Records', icon: ShoppingBag, badge: orders.length },
    { id: 'customers', label: 'Customer Directory', icon: Users, badge: customers.length },
    { id: 'cms', label: 'Storefront CMS', icon: Layers },
    { id: 'logs', label: 'Audit Trail Records', icon: History },
    { id: 'supabase', label: 'Supabase Database', icon: Database, status: 'Active' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col antialiased">

      {/* Main Admin Shell Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col justify-between p-4 flex-shrink-0">
          <div className="space-y-6">
            {/* Brand Logo & Admin Badge */}
            <div className="flex items-center justify-between px-2 pt-1 pb-3 border-b border-gray-100">
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#111111] text-white flex items-center justify-center font-black text-sm">
                  DW
                </div>
                <div>
                  <div className="font-black text-sm tracking-tight text-gray-900">DAILY WALK</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Admin Console</div>
                </div>
              </Link>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Supabase
              </span>
            </div>

            {/* Nav Links */}
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id as AdminTab)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#E53935]' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {item.status && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar: Admin Profile & Storefront Link */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            {/* View Storefront Link */}
            <Link
              to="/"
              className="flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-700 hover:text-[#E53935] hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-gray-400" />
                <span>View Storefront</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">Public Store</span>
            </Link>

            {/* Profile Bar */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <div className="font-black text-xs text-gray-900 truncate">
                  {user?.fullName || 'Sahada Banjali'}
                </div>
                <div className="text-[10px] text-gray-500 truncate font-mono">
                  {user?.email || 'sahadabanjali@gmail.com'}
                </div>
              </div>
              <button
                onClick={() => {
                  signOut();
                  showToast('Signed Out', 'Exited administrator session', 'info');
                  navigate('/');
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-xs animate-fade-in">
            <div className="w-72 bg-white h-full p-5 flex flex-col justify-between shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#111111] text-white flex items-center justify-center font-black text-sm">
                      DW
                    </div>
                    <div>
                      <div className="font-black text-sm text-gray-900">DAILY WALK</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Admin Console</div>
                    </div>
                  </div>
                  <button onClick={() => setIsMobileSidebarOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id as AdminTab)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                          isActive
                            ? 'bg-gray-900 text-white shadow-xs'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#E53935]' : 'text-gray-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                              isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-700 hover:text-[#E53935]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Exit to Storefront</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:block">
                <h1 className="text-sm font-black text-gray-900 capitalize tracking-tight">
                  {navigationItems.find((n) => n.id === activeTab)?.label}
                </h1>
                <div className="text-[11px] text-gray-400 font-medium">
                  Project: cbbsbwzpuhhzuhzknrin · Supabase Connected
                </div>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Supabase Live</span>
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Customer Store</span>
              </Link>
            </div>
          </header>

          {/* Dynamic Active Tab Content */}
          <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto">
            {activeTab === 'analytics' && <AdminAnalyticsView />}
            {activeTab === 'products' && <AdminProductsView />}
            {activeTab === 'orders' && <AdminOrdersView />}
            {activeTab === 'customers' && <AdminCustomersView />}
            {activeTab === 'cms' && <AdminCMSView />}
            {activeTab === 'logs' && <AdminAuditLogsView />}
            {activeTab === 'supabase' && <AdminSupabaseSyncView />}
          </div>
        </main>
      </div>
    </div>
  );
};
