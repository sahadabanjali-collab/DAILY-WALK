import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  MapPin,
  ArrowLeft,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Footprints,
  Lock,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserAddress } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';

export const AccountPage: React.FC = () => {
  const { user, signOut, updateProfile, saveAddress, deleteAddress, quickDemoLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  // Supabase orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    shoeSize: 'UK 8',
  });

  // Address Add/Edit State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState<UserAddress>({
    fullName: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false,
  });
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Sync profile form when user updates
  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        shoeSize: user.shoeSize || 'UK 8',
      });
    }
  }, [user]);

  // Fetch orders from Supabase for this user
  useEffect(() => {
    if (!user?.email) return;

    let isMounted = true;
    async function fetchUserOrders() {
      setLoadingOrders(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .ilike('email', user?.email || '')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Orders fetch warning:', error.message);
        }

        const localOrderStr = localStorage.getItem('daily_walk_last_order');
        let localOrders: any[] = [];
        if (localOrderStr) {
          try {
            const parsed = JSON.parse(localOrderStr);
            if (parsed) localOrders.push(parsed);
          } catch {}
        }

        // Combine Supabase orders & local orders (deduplicating by orderId)
        const combined = [...(data || [])];
        for (const loc of localOrders) {
          const locId = loc.orderId || loc.order_id;
          if (!combined.some((o) => (o.order_id || o.orderId) === locId)) {
            combined.push(loc);
          }
        }

        if (isMounted) {
          setOrders(combined);
        }
      } catch (err) {
        console.warn('Failed to load orders:', err);
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    }

    fetchUserOrders();
    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.fullName.trim()) {
      showToast('Name Required', 'Please enter your full name.', 'error');
      return;
    }

    const res = await updateProfile({
      fullName: profileForm.fullName,
      phone: profileForm.phone,
      shoeSize: profileForm.shoeSize,
    });

    if (res.success) {
      showToast('Profile Updated', 'Your profile details have been saved.', 'success');
      setIsEditingProfile(false);
    } else {
      showToast('Update Failed', res.error || 'Failed to update profile.', 'error');
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.street || !addressForm.city || !addressForm.pincode) {
      showToast('Missing Fields', 'Please complete all required address fields.', 'error');
      return;
    }

    await saveAddress({
      ...addressForm,
      id: editingAddressId || undefined,
    });

    showToast(
      editingAddressId ? 'Address Updated' : 'Address Added',
      'Your address book has been updated.',
      'success'
    );
    setIsAddressModalOpen(false);
    setEditingAddressId(null);
    setAddressForm({
      fullName: user?.fullName || '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      phone: user?.phone || '',
      isDefault: false,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    showToast('Signed Out', 'You have been signed out successfully.', 'info');
    navigate('/login');
  };

  // If not logged in, show Guest / Sign In view
  if (!user) {
    return (
      <div className="py-12 bg-[#F7F7F7]/40 min-h-[80vh] flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E5E5E5] shadow-xs text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-[#E53935] rounded-full flex items-center justify-center mx-auto border border-red-100">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[#111111]">Daily Walk Account</h1>
            <p className="text-xs text-[#777777] font-medium leading-relaxed">
              Sign in with your email to access your past orders, manage delivery addresses, and enjoy faster 1-click checkout.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/login?redirect=/account"
              className="w-full py-3 bg-[#111111] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#E53935] transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Mail className="w-4 h-4" />
              <span>Sign In with Email</span>
            </Link>

            <Link
              to="/login?mode=signup&redirect=/account"
              className="w-full py-3 bg-white text-[#111111] border border-[#E5E5E5] text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <span>Create New Account</span>
            </Link>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E5E5]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400 font-extrabold text-[10px]">Or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                quickDemoLogin('sahadabanjali@gmail.com', 'Sahada Banjali');
                showToast('Welcome Sahada!', 'Signed in instantly.', 'success');
              }}
              className="w-full py-2.5 bg-red-50 text-[#E53935] border border-red-200 text-xs font-black rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sign In as Sahada Banjali</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-[#F7F7F7]/40 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* User Profile Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#111111] text-white flex items-center justify-center text-xl font-black uppercase shadow-xs shrink-0">
              {user.fullName ? user.fullName.charAt(0) : user.email.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#111111]">{user.fullName}</h1>
                <span className="px-2.5 py-0.5 bg-red-50 text-[#E53935] text-[10px] font-black uppercase tracking-wider rounded-full border border-red-200">
                  {user.memberTier || 'VIP Member'}
                </span>
              </div>

              <p className="text-xs text-[#777777] font-medium mt-0.5 flex items-center gap-2">
                <span>{user.email}</span>
                {user.phone && (
                  <>
                    <span>•</span>
                    <span>{user.phone}</span>
                  </>
                )}
              </p>

              <p className="text-[11px] text-gray-400 font-medium mt-1">
                Member since {user.joinedDate || '2026'} • Shoe Size: {user.shoeSize || 'UK 8'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleSignOut}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#F7F7F7] hover:bg-red-50 hover:text-[#E53935] text-[#222222] text-xs font-bold rounded-xl border border-[#E5E5E5] transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <Link
              to="/shop"
              className="flex-1 sm:flex-none px-4 py-2 bg-[#111111] hover:bg-[#E53935] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Shop Shoes</span>
            </Link>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-[#E5E5E5] pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-white text-[#222222] hover:bg-gray-100 border border-[#E5E5E5]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'profile'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-white text-[#222222] hover:bg-gray-100 border border-[#E5E5E5]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'addresses'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-white text-[#222222] hover:bg-gray-100 border border-[#E5E5E5]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({user.addresses?.length || 0})</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
              <div>
                <h2 className="text-lg font-black text-[#111111]">Your Purchases & Orders</h2>
                <p className="text-xs text-[#777777] font-medium mt-0.5">
                  Real-time synchronization with Supabase for email: <strong className="text-[#111111]">{user.email}</strong>
                </p>
              </div>
            </div>

            {loadingOrders ? (
              <div className="py-12 text-center text-xs text-[#777777]">
                <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <span>Loading your verified orders...</span>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((ord, idx) => {
                  const orderId = ord.order_id || ord.orderId || `ORD-${idx + 1}`;
                  const orderTotal = ord.total_amount || ord.totalAmount || 0;
                  const orderDate = ord.created_at
                    ? new Date(ord.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : ord.date || 'Recent';
                  const items = ord.items || [];
                  const paymentMethod = ord.payment_method || ord.paymentMethod || 'Razorpay / Prepaid';

                  return (
                    <div
                      key={orderId}
                      className="p-5 bg-[#F7F7F7] rounded-2xl border border-[#E5E5E5] space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200">
                        <div>
                          <span className="text-[10px] uppercase font-extrabold text-[#777777] block">
                            Order Number
                          </span>
                          <span className="text-sm font-black text-[#111111]">{orderId}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-gray-500">{orderDate}</span>
                          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200">
                            Confirmed • In Transit
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {items.length > 0 ? (
                          items.map((item: any, i: number) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                                  />
                                )}
                                <div>
                                  <p className="font-extrabold text-[#111111]">{item.name}</p>
                                  <p className="text-[11px] text-[#777777]">
                                    Size: {item.selectedSize || 'Standard'} • Qty: {item.quantity || 1}
                                  </p>
                                </div>
                              </div>
                              <span className="font-black text-[#111111]">
                                ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-[#777777]">1x Footwear Package</p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="text-[#777777]">Payment: </span>
                          <span className="font-bold uppercase text-[#111111]">{paymentMethod}</span>
                          <span className="text-[#777777] ml-3">Total: </span>
                          <span className="font-black text-[#E53935]">
                            ₹{Number(orderTotal).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <Link
                          to={`/track-order?orderId=${orderId}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] text-white text-xs font-bold rounded-lg hover:bg-[#E53935] transition-colors self-start sm:self-auto"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>Track Live Courier</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-[#777777] space-y-3">
                <Package className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="font-bold text-[#111111] text-sm">No orders found for this email</p>
                <p>When you complete a purchase, your orders will automatically show up here.</p>
                <Link
                  to="/shop"
                  className="inline-block px-5 py-2.5 bg-[#111111] text-white text-xs font-bold rounded-xl hover:bg-[#E53935] transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile Details */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
              <div>
                <h2 className="text-lg font-black text-[#111111]">Personal Profile Details</h2>
                <p className="text-xs text-[#777777] font-medium mt-0.5">
                  Your identity & preferences synced securely with Supabase.
                </p>
              </div>

              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F7F7F7] hover:bg-gray-200 text-xs font-extrabold text-[#111111] rounded-xl border border-[#E5E5E5] transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg">
                <div>
                  <label className="text-xs font-extrabold text-[#111111] uppercase block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111]"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#111111] uppercase block mb-1">
                    Email Address <span className="text-gray-400 font-normal lowercase">(read-only)</span>
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3.5 py-2 bg-gray-100 border border-[#E5E5E5] rounded-xl text-xs font-bold text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#111111] uppercase block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111]"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#111111] uppercase block mb-1">
                    Preferred Shoe Size
                  </label>
                  <select
                    value={profileForm.shoeSize}
                    onChange={(e) => setProfileForm({ ...profileForm, shoeSize: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#111111]"
                  >
                    {['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#111111] text-white text-xs font-extrabold rounded-xl hover:bg-[#E53935] transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2.5 bg-[#F7F7F7] text-[#222222] text-xs font-bold rounded-xl border border-[#E5E5E5]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-[#111111]">
                <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#E5E5E5]">
                  <span className="text-[#777777] text-[10px] block uppercase font-extrabold mb-1">
                    Full Name
                  </span>
                  <span className="text-sm font-black">{user.fullName}</span>
                </div>

                <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#E5E5E5]">
                  <span className="text-[#777777] text-[10px] block uppercase font-extrabold mb-1">
                    Email Address
                  </span>
                  <span className="text-sm font-black">{user.email}</span>
                </div>

                <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#E5E5E5]">
                  <span className="text-[#777777] text-[10px] block uppercase font-extrabold mb-1">
                    Phone Number
                  </span>
                  <span className="text-sm font-black">{user.phone || 'Not provided yet'}</span>
                </div>

                <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#E5E5E5]">
                  <span className="text-[#777777] text-[10px] block uppercase font-extrabold mb-1">
                    Preferred Shoe Size
                  </span>
                  <span className="text-sm font-black">{user.shoeSize || 'UK 8'}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
              <div>
                <h2 className="text-lg font-black text-[#111111]">Saved Delivery Addresses</h2>
                <p className="text-xs text-[#777777] font-medium mt-0.5">
                  Addresses will be auto-filled during checkout for fast shipping.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingAddressId(null);
                  setAddressForm({
                    fullName: user.fullName || '',
                    street: '',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                    phone: user.phone || '',
                    isDefault: (user.addresses || []).length === 0,
                  });
                  setIsAddressModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#111111] hover:bg-[#E53935] text-white text-xs font-extrabold rounded-xl transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            {user.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      addr.isDefault
                        ? 'border-[#111111] bg-gray-50/50 shadow-xs'
                        : 'border-[#E5E5E5] bg-[#F7F7F7]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-[#111111]">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-[#111111] text-white text-[10px] font-black uppercase rounded-full">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#555555] font-medium leading-relaxed">
                        {addr.street}
                        <br />
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>

                      <p className="text-xs text-[#777777] font-semibold flex items-center gap-1.5 pt-1">
                        <Phone className="w-3.5 h-3.5 text-[#111111]" />
                        <span>{addr.phone}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 mt-4">
                      <button
                        onClick={() => {
                          setEditingAddressId(addr.id || null);
                          setAddressForm({ ...addr });
                          setIsAddressModalOpen(true);
                        }}
                        className="p-1.5 text-gray-500 hover:text-[#111111] rounded-lg"
                        title="Edit address"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {user.addresses && user.addresses.length > 1 && (
                        <button
                          onClick={() => addr.id && deleteAddress(addr.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-[#777777]">
                <p>No saved addresses yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Modal: Add / Edit Address */}
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] shadow-2xl space-y-4">
              <h3 className="text-lg font-black text-[#111111]">
                {editingAddressId ? 'Edit Address' : 'Add Delivery Address'}
              </h3>

              <form onSubmit={handleAddressSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-extrabold text-[#111111] uppercase block mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-[#111111] uppercase block mb-1">
                    Street / Flat / Apartment
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    placeholder="e.g. 14B Green Park, High Street"
                    className="w-full px-3 py-2 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-[#111111] uppercase block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-extrabold text-[#111111] uppercase block mb-1">
                      Pin Code
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-[#111111] uppercase block mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-extrabold text-[#111111] uppercase block mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl font-bold"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-2 cursor-pointer font-bold text-[#111111]">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="rounded text-[#111111] focus:ring-[#111111]"
                  />
                  <span>Make this my primary delivery address</span>
                </label>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="px-4 py-2 bg-[#F7F7F7] text-[#222222] font-bold rounded-xl border border-[#E5E5E5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#111111] text-white font-extrabold rounded-xl hover:bg-[#E53935]"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
