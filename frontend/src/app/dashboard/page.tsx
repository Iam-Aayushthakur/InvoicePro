'use client';

import React from 'react';
import { useDashboardStats } from '../../hooks/api/useDashboard';
import { ArrowUpRight, TrendingUp, IndianRupee, Clock, ArrowDownRight, Users, Receipt } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '../../lib/utils/currency';

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 h-32 border border-slate-200 shadow-sm animate-pulse flex flex-col justify-between">
              <div className="h-4 w-24 bg-slate-100 rounded"></div>
              <div className="h-8 w-32 bg-slate-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600">
        <h3 className="font-bold">Failed to load dashboard data</h3>
        <p className="text-sm">Please check your connection and try again.</p>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Business Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with your business today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/invoices/new" className="hidden sm:inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
            Create Invoice
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <IndianRupee className="w-16 h-16 text-indigo-600" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-500 mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-slate-900">{formatCurrency(stats?.total_revenue || 0)}</h3>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-emerald-600 font-medium flex items-center bg-emerald-50 px-2 py-0.5 rounded text-xs">
                <TrendingUp className="w-3 h-3 mr-1" /> +12%
              </span>
              <span className="text-slate-400 ml-2 text-xs">from last month</span>
            </div>
          </div>
        </div>

        {/* Receivables */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowDownRight className="w-16 h-16 text-emerald-600" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-500 mb-1">To Collect (Receivables)</p>
            <h3 className="text-3xl font-bold text-slate-900">{formatCurrency(stats?.receivables || 0)}</h3>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-amber-600 font-medium flex items-center bg-amber-50 px-2 py-0.5 rounded text-xs">
                <Clock className="w-3 h-3 mr-1" /> Overdue
              </span>
            </div>
          </div>
        </div>

        {/* Payables */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowUpRight className="w-16 h-16 text-rose-600" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-500 mb-1">To Pay (Payables)</p>
            <h3 className="text-3xl font-bold text-slate-900">{formatCurrency(stats?.payables || 0)}</h3>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-slate-500 font-medium text-xs">
                Based on purchase bills
              </span>
            </div>
          </div>
        </div>

        {/* Sales */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-indigo-600" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-500 mb-1">Total Sales</p>
            <h3 className="text-3xl font-bold text-slate-900">{stats?.total_sales || 0}</h3>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-slate-500 font-medium text-xs">
                Invoices generated
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Recent Invoices */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Invoices</h2>
            <Link href="/dashboard/invoices" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</Link>
          </div>
          <div className="p-0">
            {stats?.recent_invoices && stats.recent_invoices.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Invoice</th>
                    <th className="px-6 py-3">Client</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recent_invoices.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{inv.invoice_number}</td>
                      <td className="px-6 py-4 text-slate-600">{inv.customer?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 font-medium">{formatCurrency(inv.total_amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                          inv.status === 'OVERDUE' ? 'bg-rose-100 text-rose-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-slate-500">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-slate-300" />
                </div>
                <p>No recent invoices found.</p>
                <Link href="/dashboard/invoices/new" className="text-indigo-600 font-medium text-sm hover:underline mt-2 inline-block">Create your first invoice</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
