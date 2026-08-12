'use client';

import React, { useState } from 'react';
import { usePurchases, Purchase } from '../../../hooks/api/usePurchases';
import { useUpdatePurchaseStatus } from '../../../hooks/api/usePurchases';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Plus, Search, ShoppingCart, PackageCheck } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils/currency';
import { PurchaseForm } from './PurchaseForm';

export default function PurchasesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data, isLoading } = usePurchases(page, 20);
  const updateStatus = useUpdatePurchaseStatus();

  const purchases = data?.purchases || [];
  const filtered = purchases.filter(p =>
    p.purchase_number.toLowerCase().includes(search.toLowerCase()) ||
    (p.supplier?.name && p.supplier.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Track purchases from your suppliers and manage stock.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center h-10 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4 mr-2" /> New Purchase
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search purchase orders..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 h-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none bg-slate-50" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">{[1,2,3,4].map(i => <div key={i} className="flex items-center gap-4 animate-pulse"><div className="h-4 w-24 bg-slate-100 rounded" /><div className="h-4 w-32 bg-slate-100 rounded flex-1" /><div className="h-6 w-16 bg-slate-100 rounded-full" /><div className="h-4 w-24 bg-slate-100 rounded" /></div>)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No purchase orders yet</h3>
            <p className="text-sm text-slate-500 mb-6">Track your supplier purchases and stock intake.</p>
            <button onClick={() => setIsFormOpen(true)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Create your first purchase order →</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">PO #</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4 hidden md:table-cell">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right hidden md:table-cell">Balance</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-indigo-600">{po.purchase_number}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{po.supplier?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 hidden md:table-cell text-slate-600">{new Date(po.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900 tabular-nums">{formatCurrency(po.grand_total)}</td>
                    <td className="px-6 py-4 text-right hidden md:table-cell"><span className={po.balance_amount > 0 ? 'text-amber-600 font-medium' : 'text-slate-400'}>{formatCurrency(po.balance_amount)}</span></td>
                    <td className="px-6 py-4"><StatusBadge status={po.status} /></td>
                    <td className="px-6 py-4 text-right">
                      {po.status === 'ORDERED' && (
                        <button
                          onClick={() => updateStatus.mutate({ id: po.id, status: 'RECEIVED' })}
                          disabled={updateStatus.isPending}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <PackageCheck className="w-3.5 h-3.5" /> Mark Received
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {(data?.total || 0) > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
            Showing {filtered.length} of {data?.total || 0} purchase orders
          </div>
        )}
      </div>

      <PurchaseForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
