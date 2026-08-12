'use client';

import React from 'react';
import { useInvoices } from '../../../hooks/api/useInvoices';
import { formatCurrency } from '../../../lib/utils/currency';
import { TrendingUp, ReceiptText, Users, ArrowUpRight, ShoppingCart, FileText } from 'lucide-react';
import Link from 'next/link';

export default function SalesPage() {
  const { data, isLoading } = useInvoices(1, 100);
  const invoices = data?.invoices || [];

  const totalRevenue = invoices.reduce((s, i) => s + (i.grand_total || 0), 0);
  const totalCollected = invoices.reduce((s, i) => s + (i.paid_amount || 0), 0);
  const totalOutstanding = invoices.reduce((s, i) => s + (i.balance_amount || 0), 0);
  const issuedCount = invoices.filter(i => i.status === 'ISSUED' || i.status === 'PARTIALLY_PAID').length;
  const paidCount = invoices.filter(i => i.status === 'PAID').length;

  const topCustomers = Object.values(
    invoices.reduce<Record<string, { name: string; total: number; count: number }>>((acc, inv) => {
      const name = inv.customer?.name || 'Unknown';
      if (!acc[name]) acc[name] = { name, total: 0, count: 0 };
      acc[name].total += inv.grand_total || 0;
      acc[name].count += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sales Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Revenue summary and sales performance at a glance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Sales', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Collected', value: formatCurrency(totalCollected), icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Outstanding', value: formatCurrency(totalOutstanding), icon: ReceiptText, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Invoices Issued', value: `${issuedCount + paidCount}`, icon: FileText, color: 'text-sky-600', bg: 'bg-sky-50' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <kpi.icon className={`w-16 h-16 ${kpi.color}`} />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-semibold text-slate-500 mb-1">{kpi.label}</p>
              <h3 className="text-3xl font-bold text-slate-900">{isLoading ? '...' : kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Customers */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Top Customers</h2>
            <Link href="/dashboard/customers" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</Link>
          </div>
          {isLoading ? (
            <div className="p-6 animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-10 bg-slate-100 rounded" />)}</div>
          ) : topCustomers.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">No sales data yet</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {topCustomers.map((c, idx) => (
                <div key={c.name} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">{idx + 1}</span>
                    <div>
                      <p className="font-medium text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.count} invoices</p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(c.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            {[
              { label: 'Create New Invoice', href: '/dashboard/invoices/new', icon: ReceiptText, desc: 'Generate a GST-compliant tax invoice' },
              { label: 'Create Quotation', href: '/dashboard/quotations', icon: FileText, desc: 'Send a price estimate to a client' },
              { label: 'Record Payment', href: '/dashboard/payments', icon: ArrowUpRight, desc: 'Log an incoming payment' },
              { label: 'View All Invoices', href: '/dashboard/invoices', icon: ShoppingCart, desc: 'Browse and manage your invoice list' },
            ].map((action) => (
              <Link key={action.label} href={action.href} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <action.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 text-sm">{action.label}</p>
                  <p className="text-xs text-slate-500">{action.desc}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
