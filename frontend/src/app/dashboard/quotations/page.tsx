'use client';

import React, { useState } from 'react';
import { useQuotations, Quotation, useCreateQuotation, CreateQuotationInput } from '../../../hooks/api/useQuotations';
import { useCustomers } from '../../../hooks/api/useCustomers';
import { useProducts } from '../../../hooks/api/useProducts';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Plus, Search, FileText, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '../../../lib/utils/currency';
import { QuotationForm } from './QuotationForm';

export default function QuotationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data, isLoading } = useQuotations(page, 20);

  const quotations = data?.quotations || [];
  const filtered = quotations.filter(q =>
    q.quotation_number.toLowerCase().includes(search.toLowerCase()) ||
    (q.customer?.name && q.customer.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quotations & Estimates</h1>
          <p className="text-sm text-slate-500 mt-1">Create price quotes and convert them to invoices.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center h-10 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4 mr-2" /> New Quotation
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search quotations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none bg-slate-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-4 w-24 bg-slate-100 rounded" />
                <div className="h-4 w-32 bg-slate-100 rounded flex-1" />
                <div className="h-6 w-16 bg-slate-100 rounded-full" />
                <div className="h-4 w-24 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No quotations yet</h3>
            <p className="text-sm text-slate-500 mb-6">Send professional price quotes to your clients.</p>
            <button onClick={() => setIsFormOpen(true)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Create your first quotation →</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Quotation #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4 hidden md:table-cell">Date</th>
                  <th className="px-6 py-4 hidden lg:table-cell">Valid Until</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-indigo-600">{q.quotation_number}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{q.customer?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 hidden md:table-cell text-slate-600">{new Date(q.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4 hidden lg:table-cell text-slate-600">{q.valid_until ? new Date(q.valid_until).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900 tabular-nums">{formatCurrency(q.grand_total)}</td>
                    <td className="px-6 py-4"><StatusBadge status={q.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {q.status === 'ACCEPTED' && (
                          <Link href={`/dashboard/invoices/new?customer=${q.customer_id}`} className="px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                            Convert to Invoice
                          </Link>
                        )}
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {(data?.total || 0) > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
            <span>Showing {filtered.length} of {data?.total || 0} quotations</span>
          </div>
        )}
      </div>

      <QuotationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
