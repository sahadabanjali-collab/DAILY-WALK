import React, { useState } from 'react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';
import {
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_SQL_SCHEMA,
  TRACKED_TABLES,
  syncCouponsToSupabase,
  syncCMSToSupabase,
} from '../../services/adminSupabaseService';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  UploadCloud,
  RefreshCw,
  Server,
  Lock,
  Layers,
  FileCode,
  ShieldCheck,
  Check,
  Terminal,
  Play,
  ArrowRight,
} from 'lucide-react';

export const AdminSupabaseSyncView: React.FC = () => {
  const {
    supabaseStatus,
    refreshSupabaseStatus,
    syncProductsWithSupabase,
    isSyncing,
    products,
    orders,
    coupons,
    cmsData,
  } = useStoreData();

  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tables' | 'sql' | 'guide'>('tables');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    showToast('SQL Script Copied!', 'Complete Supabase schema copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleVerifyAndSyncAll = async () => {
    setIsVerifying(true);
    showToast('Verifying Supabase Tables', 'Probing schema and pushing initial records...', 'info');

    try {
      await refreshSupabaseStatus();
      const pRes = await syncProductsWithSupabase();
      await syncCouponsToSupabase(coupons);
      await syncCMSToSupabase(cmsData);

      showToast('Synchronization Complete', 'All available tables synced with Supabase project cbbsbwzpuhhzuhzknrin.', 'success');
    } catch (err: any) {
      showToast('Sync Notice', err?.message || 'Sync complete with notices.', 'info');
    } finally {
      setIsVerifying(false);
    }
  };

  const tablesList = supabaseStatus?.tables || TRACKED_TABLES.map((t) => ({
    name: t.name,
    displayName: t.displayName,
    description: t.description,
    exists: t.name === 'orders',
    rowCount: t.name === 'orders' ? orders.length : t.name === 'products' ? products.length : 0,
  }));

  const activeTablesCount = tablesList.filter((t) => t.exists).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>Supabase Database &amp; Table Provisioning</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full border border-emerald-200">
              Live Connection
            </span>
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Connected to Supabase Project: <code className="text-gray-800 font-bold">{SUPABASE_PROJECT_ID}</code> &middot; Authenticated via Publishable Key.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshSupabaseStatus()}
            disabled={isVerifying}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>Probe Tables</span>
          </button>

          <a
            href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] hover:bg-[#E53935] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Supabase SQL Editor</span>
          </a>
        </div>
      </div>

      {/* Connection & Setup Action Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-gray-900">
                  Supabase Cloud Status: {activeTablesCount} of {tablesList.length} Tables Active
                </h3>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Target endpoint: <code className="text-gray-700">{SUPABASE_URL}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopySchema}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#E53935] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'SQL Script Copied!' : 'Copy Complete SQL Script'}</span>
            </button>

            <button
              onClick={handleVerifyAndSyncAll}
              disabled={isSyncing || isVerifying}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{isSyncing || isVerifying ? 'Syncing...' : 'Verify & Push All Data'}</span>
            </button>
          </div>
        </div>

        {/* 3-Step Setup Instructions Banner */}
        <div className="p-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-2 mb-2 font-bold text-xs text-blue-900">
            <Terminal className="w-4 h-4 text-blue-600" />
            <span>How to Create All 7 Tables in Supabase with 1-Click:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-blue-950">
            <div className="bg-white/80 p-3 rounded-xl border border-blue-100/80">
              <span className="inline-block w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold text-center leading-5 mr-1.5">
                1
              </span>
              <strong>Copy SQL Script</strong>: Click the red <em>"Copy Complete SQL Script"</em> button above.
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-blue-100/80">
              <span className="inline-block w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold text-center leading-5 mr-1.5">
                2
              </span>
              <strong>Run in Supabase</strong>: Click <em>"Open Supabase SQL Editor"</em>, paste the script and press <strong>RUN</strong>.
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-blue-100/80">
              <span className="inline-block w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold text-center leading-5 mr-1.5">
                3
              </span>
              <strong>Verify &amp; Push</strong>: Click <em>"Verify &amp; Push All Data"</em> to seed all products, coupons, and orders.
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Table Health Matrix vs SQL Script vs Guide */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
        <button
          onClick={() => setActiveTab('tables')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 -mb-1 ${
            activeTab === 'tables'
              ? 'border-[#E53935] text-gray-900 bg-white shadow-2xs'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          All 7 Database Tables ({activeTablesCount}/{tablesList.length})
        </button>
        <button
          onClick={() => setActiveTab('sql')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 -mb-1 ${
            activeTab === 'sql'
              ? 'border-[#E53935] text-gray-900 bg-white shadow-2xs'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          SQL Migration Script (Ready to Run)
        </button>
      </div>

      {/* Tab 1: Database Tables Matrix */}
      {activeTab === 'tables' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
              Tracked Supabase Tables Matrix
            </h4>
            <span className="text-[11px] text-gray-500 font-medium">
              Project ID: {SUPABASE_PROJECT_ID}
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {tablesList.map((table) => {
              return (
                <div key={table.name} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                        public.{table.name}
                      </span>
                      <span className="font-bold text-xs text-gray-800">
                        {table.displayName}
                      </span>
                      {table.exists ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active in Supabase</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertCircle className="w-3 h-3" />
                          <span>Pending Migration</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      {table.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-black text-gray-900">
                        {table.name === 'products'
                          ? `${products.length} Products`
                          : table.name === 'orders'
                          ? `${orders.length} Orders`
                          : table.name === 'coupons'
                          ? `${coupons.length} Coupons`
                          : 'Configured'}
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium">Local Cache Ready</div>
                    </div>

                    <a
                      href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/editor`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                      title="Inspect table in Supabase Table Editor"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: SQL Script Code Block */}
      {activeTab === 'sql' && (
        <div className="bg-[#0D1117] rounded-3xl border border-[#30363D] shadow-2xl overflow-hidden space-y-0">
          <div className="p-4 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-gray-200">
                daily_walk_supabase_migration.sql
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySchema}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-gray-200 rounded-xl text-xs font-bold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy SQL'}</span>
              </button>

              <a
                href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E53935] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run in Supabase</span>
              </a>
            </div>
          </div>

          <div className="p-4 max-h-[500px] overflow-y-auto font-mono text-xs text-gray-300 leading-relaxed bg-[#0D1117] selection:bg-red-600 selection:text-white">
            <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SCHEMA}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
