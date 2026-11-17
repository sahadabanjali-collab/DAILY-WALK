import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import { OrderRecord } from '../../types';
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  FileText,
  Printer,
  Calendar,
  CreditCard,
  MapPin,
  ExternalLink,
} from 'lucide-react';

const COURIER_PARTNERS = [
  'Blue Dart Express',
  'Delhivery',
  'Shadowfax',
  'DTDC Logistics',
  'Ecom Express',
  'India Post Speed Post',
];

export const AdminOrdersView: React.FC = () => {
  const { orders, updateOrderStatus, refreshOrdersFromSupabase, isSyncing } = useStoreData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Selected Order for Status Update modal
  const [statusModalOrder, setStatusModalOrder] = useState<OrderRecord | null>(null);
  const [newStatus, setNewStatus] = useState<OrderRecord['status']>('Processing');
  const [courierPartner, setCourierPartner] = useState('Blue Dart Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Selected Order for Invoice / Details modal
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<OrderRecord | null>(null);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          o.orderId.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (statusFilter !== 'all' && o.status !== statusFilter) return false;

      if (paymentFilter === 'razorpay' && o.paymentMethod.toLowerCase().includes('cod')) return false;
      if (paymentFilter === 'cod' && !o.paymentMethod.toLowerCase().includes('cod')) return false;

      return true;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  // Open Status update modal
  const handleOpenStatusModal = (ord: OrderRecord) => {
    setStatusModalOrder(ord);
    setNewStatus(ord.status);
    setCourierPartner(ord.courierPartner || 'Blue Dart Express');
    setTrackingNumber(ord.trackingNumber || `TRK${Math.floor(100000000 + Math.random() * 900000000)}`);
    setNotes(ord.notes || '');
  };

  // Submit Status update
  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalOrder) return;

    await updateOrderStatus(statusModalOrder.orderId, newStatus, {
      courierPartner,
      trackingNumber,
      notes,
    });

    showToast('Order Status Updated', `Order #${statusModalOrder.orderId} is now ${newStatus}`, 'success');
    setStatusModalOrder(null);
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Phone', 'Amount', 'Payment', 'Status', 'Tracking'];
    const rows = orders.map((o) => [
      o.orderId,
      `"${new Date(o.createdAt).toLocaleString()}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      o.email,
      `"${o.phone || ''}"`,
      o.totalAmount,
      `"${o.paymentMethod.replace(/"/g, '""')}"`,
      o.status,
      `"${o.trackingNumber || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `daily_walk_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders Exported', 'Downloaded orders CSV file', 'success');
  };

  // Trigger manual refresh from Supabase
  const handleRefreshSupabase = async () => {
    showToast('Refreshing from Supabase', 'Fetching latest order transactions...', 'info');
    await refreshOrdersFromSupabase();
    showToast('Orders Synced', 'Latest records fetched from Supabase', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Order Tracking & Fulfillment Records</h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Real-time ledger synced with Supabase table <code className="text-gray-700">orders</code> and Razorpay payments
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefreshSupabase}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#111111] text-white hover:bg-[#E53935] rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Orders</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, customer name, email, or tracking #..."
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

          {/* Fulfillment Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
            >
              <option value="all">All Order Statuses</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
            >
              <option value="all">All Payment Types</option>
              <option value="razorpay">Razorpay Online</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
        </div>

        {/* Results summary */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div>
            Showing <strong className="text-gray-900">{filteredOrders.length}</strong> of {orders.length} orders
          </div>
          {(searchQuery || statusFilter !== 'all' || paymentFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPaymentFilter('all');
              }}
              className="text-xs text-[#E53935] hover:underline font-bold"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold">
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-3 font-semibold">Date & Time</th>
                <th className="py-3 px-3 font-semibold">Customer</th>
                <th className="py-3 px-3 font-semibold">Items</th>
                <th className="py-3 px-3 font-semibold">Total Amount</th>
                <th className="py-3 px-3 font-semibold">Payment</th>
                <th className="py-3 px-3 font-semibold">Fulfillment Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <p className="font-bold text-sm text-gray-600">No orders found</p>
                    <p className="text-xs mt-1">Try adjusting your filters or place a test order on the storefront.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const isCOD = ord.paymentMethod.toLowerCase().includes('cod');
                  return (
                    <tr key={ord.orderId || ord.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Order ID */}
                      <td className="py-3 px-4">
                        <div className="font-black text-gray-900">{ord.orderId}</div>
                        {ord.trackingNumber && (
                          <div className="text-[10px] text-gray-400 font-mono">Trk: {ord.trackingNumber}</div>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-gray-600 font-medium">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                        <div className="text-[10px] text-gray-400">
                          {new Date(ord.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-gray-900">{ord.customerName}</div>
                        <div className="text-[11px] text-gray-500 truncate max-w-[150px]">{ord.email}</div>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-3 text-gray-700 font-medium">
                        {ord.items.length > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-gray-900">
                              {ord.items.reduce((s: number, it: any) => s + (it.quantity || 1), 0)} pairs
                            </span>
                            <span className="text-[11px] text-gray-400 truncate max-w-[120px]">
                              ({ord.items[0]?.product?.name || 'Footwear'})
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">1 Item</span>
                        )}
                      </td>

                      {/* Total */}
                      <td className="py-3 px-3 font-black text-gray-900">
                        ₹{ord.totalAmount.toLocaleString()}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3 px-3">
                        <span className={`font-bold ${isCOD ? 'text-amber-700' : 'text-emerald-700'}`}>
                          {isCOD ? 'Cash on Delivery' : 'Razorpay (Paid)'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleOpenStatusModal(ord)}
                          className="group inline-flex items-center gap-1 text-xs font-bold hover:underline"
                          title="Click to update fulfillment status"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-500'
                                : ord.status === 'Shipped'
                                ? 'bg-blue-500'
                                : ord.status === 'Cancelled'
                                ? 'bg-red-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          <span className="text-gray-800">{ord.status}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenStatusModal(ord)}
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Update Tracking & Status"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setInvoiceModalOrder(ord)}
                            className="p-1.5 text-gray-600 hover:text-[#111111] hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Invoice / Packing Slip"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {statusModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-gray-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-base font-black text-gray-900">Update Order Fulfillment</h3>
                <p className="text-xs text-gray-500 font-medium">Order #{statusModalOrder.orderId}</p>
              </div>
              <button onClick={() => setStatusModalOrder(null)} className="p-1.5 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Fulfillment Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                >
                  <option value="Processing">Processing (Packaging in Warehouse)</option>
                  <option value="Shipped">Shipped (Handed to Courier Partner)</option>
                  <option value="Delivered">Delivered (Successfully Handed to Customer)</option>
                  <option value="Cancelled">Cancelled (Order Voided / Refunded)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Courier Partner</label>
                <select
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                >
                  {COURIER_PARTNERS.map((cp) => (
                    <option key={cp} value={cp}>
                      {cp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Courier Tracking Airway Bill (AWB)</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BD849201948IN"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Internal Fulfillment Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Fragile shoe box, inspected prior to dispatch"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStatusModalOrder(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#111111] hover:bg-[#E53935] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
                >
                  Update Supabase Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice & Packing Slip Modal */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center font-black text-sm">
                  DW
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Tax Invoice & Packing Slip</h3>
                  <p className="text-xs text-gray-500 font-medium">Order #{invoiceModalOrder.orderId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-gray-200"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  onClick={() => setInvoiceModalOrder(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customer & Order Metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-gray-400 font-bold uppercase text-[10px]">Billed & Shipped To:</div>
                <div className="font-extrabold text-gray-900">{invoiceModalOrder.customerName}</div>
                <div className="text-gray-600 font-medium">{invoiceModalOrder.address}</div>
                <div className="text-gray-500">{invoiceModalOrder.phone}</div>
                <div className="text-gray-500">{invoiceModalOrder.email}</div>
              </div>

              <div className="space-y-1 text-right">
                <div className="text-gray-400 font-bold uppercase text-[10px]">Order Details:</div>
                <div className="font-extrabold text-gray-900">Order ID: {invoiceModalOrder.orderId}</div>
                <div className="text-gray-600">
                  Date: {new Date(invoiceModalOrder.createdAt).toLocaleDateString('en-IN')}
                </div>
                <div className="text-gray-600">Payment: {invoiceModalOrder.paymentMethod}</div>
                <div className="text-gray-600">Status: {invoiceModalOrder.status}</div>
                {invoiceModalOrder.trackingNumber && (
                  <div className="font-mono text-gray-700 font-bold">
                    AWB: {invoiceModalOrder.trackingNumber} ({invoiceModalOrder.courierPartner})
                  </div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3">Size & Color</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoiceModalOrder.items.map((it: any, i: number) => (
                    <tr key={i}>
                      <td className="py-2.5 px-3 font-bold text-gray-900">
                        {it.product?.name || 'Daily Walk Shoe'}
                      </td>
                      <td className="py-2.5 px-3 text-gray-600">
                        UK {it.selectedSize || 8} · {it.selectedColor || 'Default'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-gray-800">
                        {it.quantity || 1}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-gray-900">
                        ₹{((it.product?.price || 0) * (it.quantity || 1)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Summary */}
            <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs">
              <div className="text-gray-500">
                <span>Inclusive of all Goods and Services Tax (GST 18%)</span>
              </div>
              <div className="text-right">
                <span className="text-gray-500 mr-2">Grand Total:</span>
                <span className="text-lg font-black text-gray-900">
                  ₹{invoiceModalOrder.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-center pt-2">
              <p className="text-[11px] text-gray-400 font-medium">
                Thank you for choosing Daily Walk. For assistance, reach us at support@dailywalk.com
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
