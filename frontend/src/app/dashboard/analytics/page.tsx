import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, ShoppingCart, Receipt, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Business Analytics</h1>
          <p className="text-slate-500 mt-1">Real-time overview of your company's performance.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-200 text-slate-700 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer shadow-sm">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '₹24,50,000', icon: DollarSign, trend: '+12.5%', color: 'text-emerald-600', bg: 'bg-emerald-100', up: true },
          { label: 'Outstanding Receivables', value: '₹3,45,000', icon: Receipt, trend: '-2.4%', color: 'text-rose-600', bg: 'bg-rose-100', up: false },
          { label: 'New Customers', value: '142', icon: Users, trend: '+18.2%', color: 'text-indigo-600', bg: 'bg-indigo-100', up: true },
          { label: 'Total Sales', value: '856', icon: ShoppingCart, trend: '+8.1%', color: 'text-blue-600', bg: 'bg-blue-100', up: true },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <span className={`inline-flex items-center gap-1 text-sm font-semibold ${kpi.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                {kpi.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {kpi.trend}
              </span>
            </div>
            <h3 className="text-slate-500 font-medium text-sm">{kpi.label}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Shells */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue vs Expenses</h3>
          <div className="flex-1 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center bg-slate-50/50">
            <p className="text-slate-400 font-medium text-sm flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> Chart will render here (Phase 5)
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Top Products</h3>
          <div className="flex-1 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center bg-slate-50/50">
            <p className="text-slate-400 font-medium text-sm">Pie Chart (Phase 5)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

