import React, { useState } from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import { AuditLog } from '../../types';
import {
  History,
  Search,
  Filter,
  Download,
  Shield,
  Layers,
  Clock,
  User,
  Trash2,
  Calendar,
} from 'lucide-react';

export const AdminAuditLogsView: React.FC = () => {
  const { auditLogs } = useStoreData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredLogs = auditLogs.filter((log) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (categoryFilter !== 'all' && log.category !== categoryFilter) return false;
    return true;
  });

  const handleExportLogs = () => {
    const headers = ['ID', 'Timestamp', 'Actor', 'Category', 'Action', 'Details'];
    const rows = auditLogs.map((l) => [
      l.id,
      `"${new Date(l.timestamp).toLocaleString()}"`,
      l.actor,
      l.category,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `daily_walk_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audit Trail Exported', 'Downloaded audit logs CSV file', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">System Audit & Activity Records</h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Immutable tracking log of administrative actions, catalog edits, order fulfillments, and configuration changes
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#111111] text-white hover:bg-[#E53935] rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by action, actor, or detail keywords..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
          >
            <option value="all">All Action Categories</option>
            <option value="product">Product Catalog</option>
            <option value="order">Order Fulfillment</option>
            <option value="cms">CMS & Coupons</option>
            <option value="system">System & Supabase</option>
          </select>
        </div>
      </div>

      {/* Audit Log Timeline */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs divide-y divide-gray-100 overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400">
            No audit records match your search filter.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-gray-50/60 transition-colors flex items-start gap-3.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  log.category === 'product'
                    ? 'bg-blue-50 text-blue-600'
                    : log.category === 'order'
                    ? 'bg-emerald-50 text-emerald-600'
                    : log.category === 'cms'
                    ? 'bg-purple-50 text-purple-600'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {log.category === 'product'
                  ? '👟'
                  : log.category === 'order'
                  ? '📦'
                  : log.category === 'cms'
                  ? '🎨'
                  : '⚙️'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="font-extrabold text-xs text-gray-900">{log.action}</div>
                  <div className="text-[11px] text-gray-400 font-mono">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </div>
                </div>

                <p className="text-xs text-gray-600 font-medium mt-0.5">{log.details}</p>

                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-gray-400" />
                    <strong className="text-gray-600">{log.actor}</strong>
                  </span>
                  <span>·</span>
                  <span className="capitalize">{log.category} subsystem</span>
                  <span>·</span>
                  <span className="font-mono text-[10px]">Log ID: {log.id}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
