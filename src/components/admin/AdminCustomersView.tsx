import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import { Customer, OrderRecord } from '../../types';
import {
  Search,
  Filter,
  Users,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Eye,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AdminCustomersView: React.FC = () => {
  const { customers, orders } = useStoreData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          c.fullName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (tierFilter !== 'all' && c.memberTier !== tierFilter) return false;
      return true;
    });
  }, [customers, searchQuery, tierFilter]);

  // Customer's specific order history
  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter(
      (o) => o.email.toLowerCase().trim() === selectedCustomer.email.toLowerCase().trim()
    );
  }, [orders, selectedCustomer]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Customer ID', 'Full Name', 'Email', 'Phone', 'Location', 'Orders Count', 'Total Spent', 'Tier', 'Joined'];
    const rows = customers.map((c) => [
      c.id,
      `"${c.fullName.replace(/"/g, '""')}"`,
      c.email,
      `"${c.phone}"`,
      `"${c.city}, ${c.state}"`,
      c.ordersCount,
      c.totalSpent,
      c.memberTier,
      `"${c.joinedDate}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `daily_walk_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Customer Directory Exported', 'Downloaded customer CRM CSV', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Customer CRM & Account Profiles</h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Browse verified customer records, contact information, lifetime spend, and purchase frequency
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#111111] text-white hover:bg-[#E53935] rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Customers</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, email address, phone, or city..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Member Tier Filter */}
          <div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
            >
              <option value="all">All Membership Tiers</option>
              <option value="VIP Club">VIP Club</option>
              <option value="Gold">Gold Member</option>
              <option value="Silver">Silver Member</option>
              <option value="Member">Regular Member</option>
            </select>
          </div>
        </div>

        {/* Results summary */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div>
            Showing <strong className="text-gray-900">{filteredCustomers.length}</strong> of {customers.length} registered
            customers
          </div>
          {(searchQuery || tierFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTierFilter('all');
              }}
              className="text-xs text-[#E53935] hover:underline font-bold"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold">
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-3 font-semibold">Email & Phone</th>
                <th className="py-3 px-3 font-semibold">Location</th>
                <th className="py-3 px-3 font-semibold">Total Orders</th>
                <th className="py-3 px-3 font-semibold">Lifetime Spend</th>
                <th className="py-3 px-3 font-semibold">Member Tier</th>
                <th className="py-3 px-3 font-semibold">Joined</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <p className="font-bold text-sm text-gray-600">No customers match criteria</p>
                    <p className="text-xs mt-1">Try modifying your search query or reset tier filters.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Customer Name & Initials */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black text-xs uppercase flex-shrink-0">
                          {cust.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-black text-gray-900 flex items-center gap-1.5">
                            <span>{cust.fullName}</span>
                            {cust.status === 'VIP' && (
                              <span className="text-[10px] text-amber-600 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                VIP
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400 font-medium">ID: {cust.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-gray-900">{cust.email}</div>
                      <div className="text-[11px] text-gray-500">{cust.phone || '+91 98765 43210'}</div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-3 text-gray-700 font-medium">
                      {cust.city}, {cust.state}
                    </td>

                    {/* Total Orders */}
                    <td className="py-3 px-3">
                      <span className="font-extrabold text-gray-900">{cust.ordersCount}</span> orders
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-3 px-3">
                      <span className="font-black text-emerald-700">₹{cust.totalSpent.toLocaleString()}</span>
                    </td>

                    {/* Tier */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-gray-800">{cust.memberTier}</span>
                    </td>

                    {/* Joined */}
                    <td className="py-3 px-3 text-gray-500 font-medium">{cust.joinedDate}</td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile & Past Orders Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black text-lg uppercase">
                  {selectedCustomer.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <span>{selectedCustomer.fullName}</span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {selectedCustomer.memberTier}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">Customer Member since {selectedCustomer.joinedDate}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-1.5 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact & Summary Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-[11px] text-gray-400 font-bold uppercase">Email Address</div>
                <div className="text-xs font-extrabold text-gray-900 truncate mt-0.5">{selectedCustomer.email}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-[11px] text-gray-400 font-bold uppercase">Phone Number</div>
                <div className="text-xs font-extrabold text-gray-900 mt-0.5">{selectedCustomer.phone || 'None provided'}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-[11px] text-gray-400 font-bold uppercase">Lifetime Purchases</div>
                <div className="text-xs font-extrabold text-emerald-700 mt-0.5">
                  ₹{selectedCustomer.totalSpent.toLocaleString()} ({selectedCustomer.ordersCount} orders)
                </div>
              </div>
            </div>

            {/* Purchase History */}
            <div>
              <h4 className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-gray-500" />
                <span>Complete Purchase History</span>
              </h4>

              {customerOrders.length === 0 ? (
                <div className="p-6 bg-gray-50 rounded-2xl text-center text-xs text-gray-400">
                  No orders recorded yet for this customer profile.
                </div>
              ) : (
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
                  {customerOrders.map((ord) => (
                    <div key={ord.orderId} className="p-3 hover:bg-gray-50/60 flex items-center justify-between gap-4">
                      <div>
                        <div className="font-black text-gray-900">Order #{ord.orderId}</div>
                        <div className="text-[11px] text-gray-500">
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}{' '}
                          · {ord.paymentMethod}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-gray-900">₹{ord.totalAmount.toLocaleString()}</div>
                        <div
                          className={`text-[10px] font-bold ${
                            ord.status === 'Delivered'
                              ? 'text-emerald-700'
                              : ord.status === 'Shipped'
                              ? 'text-blue-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {ord.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end border-t border-gray-100">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2.5 bg-gray-900 hover:bg-[#E53935] text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
