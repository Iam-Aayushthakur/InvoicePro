'use client';

import React, { useState } from 'react';
import { useInvoices, Invoice } from '../../../hooks/api/useInvoices';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Plus, Search, ReceiptText, ArrowUpDown, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '../../../lib/utils/currency';

export default function InvoicesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useInvoices(page, 20);

  const invoices = data?.invoices || [];
  const filteredInvoices = invoices.filter(inv =>
    inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
    (inv.customer?.name && inv.customer.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">GST Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">Create, manage and track your tax invoices.</p>
        </div>
        <Link
          href="/dashboard/invoices/new"
          className="inline-flex items-center justify-center h-10 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4 mr-2" /> New Invoice
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Invoices', value: data?.total || 0, color: 'text-slate-900' },
          { label: 'Draft', value: invoices.filter(i => i.status === 'DRAFT').length, color: 'text-slate-600' },
          { label: 'Outstanding', value: formatCurrency(invoices.reduce((s, i) => s + (i.balance_amount || 0), 0)), color: 'text-amber-600' },
          { label: 'Collected', value: formatCurrency(invoices.reduce((s, i) => s + (i.paid_amount || 0), 0)), color: 'text-emerald-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by invoice # or customer..."
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
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-4 w-24 bg-slate-100 rounded" />
                <div className="h-4 w-32 bg-slate-100 rounded" />
                <div className="h-4 w-20 bg-slate-100 rounded flex-1" />
                <div className="h-6 w-16 bg-slate-100 rounded-full" />
                <div className="h-4 w-24 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ReceiptText className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No invoices yet</h3>
            <p className="text-sm text-slate-500 mb-6">Create your first GST-compliant invoice.</p>
            <Link href="/dashboard/invoices/new" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Create your first invoice →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-1">Invoice <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4 hidden md:table-cell">Date</th>
                  <th className="px-6 py-4 hidden lg:table-cell">Due Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right hidden md:table-cell">Balance</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-indigo-600">{invoice.invoice_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{invoice.customer?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-500 md:hidden mt-0.5">{invoice.invoice_date}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-slate-600">
                      {new Date(invoice.invoice_date || invoice.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-slate-600">
                      {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      {formatCurrency(invoice.grand_total)}
                    </td>
                    <td className="px-6 py-4 text-right hidden md:table-cell">
                      <span className={invoice.balance_amount > 0 ? 'text-amber-600 font-medium' : 'text-slate-400'}>
                        {formatCurrency(invoice.balance_amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/invoices/view?id=${invoice.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {(data?.total || 0) > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
            <span>Showing {filteredInvoices.length} of {data?.total || 0} invoices</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-medium"
              >
                Previous
              </button>
              <button
                disabled={page >= (data?.totalPages || 1)}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
