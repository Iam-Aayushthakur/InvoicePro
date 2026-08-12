'use client';

import React, { useState } from 'react';
import { useReport } from '../../../hooks/api/useReports';
import { formatCurrency } from '../../../lib/utils/currency';
import { BarChart3, Download, Calendar, Filter, FileText, IndianRupee } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'SALES' | 'GST'>('SALES');
  
  // Default to current month
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });

  const { data, isLoading } = useReport({
    report_type: reportType,
    start_date: startDate,
    end_date: endDate,
  });

  const reportData = data?.report;

  const handleExport = () => {
    // In a real app, this would generate a CSV and trigger a download
    alert(`Exporting ${reportType} report for ${startDate} to ${endDate} as CSV...`);
  };

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Financial Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Generate Sales and GST liability reports.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={isLoading || !reportData}
          className="inline-flex items-center justify-center h-10 px-4 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1.5 w-full">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Report Type</label>
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'SALES' | 'GST')}
              className="w-full pl-9 pr-4 h-10 rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none bg-white border"
            >
              <option value="SALES">Sales Summary Report</option>
              <option value="GST">GST Tax Liability Report</option>
            </select>
          </div>
        </div>
        
        <div className="flex-1 space-y-1.5 w-full">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Start Date</label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-9 pr-4 h-10 rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none border"
            />
          </div>
        </div>

        <div className="flex-1 space-y-1.5 w-full">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">End Date</label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-9 pr-4 h-10 rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none border"
            />
          </div>
        </div>
      </div>

      {/* Report Results */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center h-full text-slate-500">
             <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
             Loading report data...
          </div>
        ) : !reportData ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No data available</h3>
            <p className="text-sm text-slate-500">Adjust the date range or select a different report type.</p>
          </div>
        ) : reportType === 'SALES' ? (
          <div>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-6">
               <div>
                 <p className="text-sm text-slate-500 font-medium mb-1">Total Revenue</p>
                 <p className="text-2xl font-bold text-slate-900">{formatCurrency(reportData.total_revenue || 0)}</p>
               </div>
               <div>
                 <p className="text-sm text-slate-500 font-medium mb-1">Invoices Issued</p>
                 <p className="text-2xl font-bold text-slate-900">{reportData.invoice_count || 0}</p>
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Invoice #</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4 text-right">Taxable Amount</th>
                    <th className="px-6 py-4 text-right">Tax</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(reportData.invoices || []).length > 0 ? (reportData.invoices || []).map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-slate-600">{new Date(inv.invoice_date || inv.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-indigo-600">{inv.invoice_number}</td>
                      <td className="px-6 py-4 text-slate-900">{inv.customer_name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-right tabular-nums">{formatCurrency(inv.taxable_amount)}</td>
                      <td className="px-6 py-4 text-right tabular-nums">{formatCurrency(inv.tax_total)}</td>
                      <td className="px-6 py-4 text-right font-semibold tabular-nums text-slate-900">{formatCurrency(inv.grand_total)}</td>
                    </tr>
                  )) : (
                     <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No sales found in this period.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-6">
               <div>
                 <p className="text-sm text-slate-500 font-medium mb-1">Total CGST</p>
                 <p className="text-2xl font-bold text-slate-900">{formatCurrency(reportData.total_cgst || 0)}</p>
               </div>
               <div>
                 <p className="text-sm text-slate-500 font-medium mb-1">Total SGST</p>
                 <p className="text-2xl font-bold text-slate-900">{formatCurrency(reportData.total_sgst || 0)}</p>
               </div>
               <div>
                 <p className="text-sm text-slate-500 font-medium mb-1">Total IGST</p>
                 <p className="text-2xl font-bold text-slate-900">{formatCurrency(reportData.total_igst || 0)}</p>
               </div>
               <div className="pl-6 border-l border-slate-200">
                 <p className="text-sm text-slate-500 font-medium mb-1">Total Tax Liability</p>
                 <p className="text-2xl font-bold text-indigo-600">{formatCurrency((reportData.total_cgst || 0) + (reportData.total_sgst || 0) + (reportData.total_igst || 0))}</p>
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Tax Rate</th>
                    <th className="px-6 py-4 text-right">Taxable Value</th>
                    <th className="px-6 py-4 text-right">CGST</th>
                    <th className="px-6 py-4 text-right">SGST</th>
                    <th className="px-6 py-4 text-right">IGST</th>
                    <th className="px-6 py-4 text-right">Total Tax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(reportData.tax_buckets || []).length > 0 ? (reportData.tax_buckets || []).map((bucket: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{bucket.tax_rate}%</td>
                      <td className="px-6 py-4 text-right tabular-nums">{formatCurrency(bucket.taxable_value)}</td>
                      <td className="px-6 py-4 text-right tabular-nums">{formatCurrency(bucket.cgst_amount)}</td>
                      <td className="px-6 py-4 text-right tabular-nums">{formatCurrency(bucket.sgst_amount)}</td>
                      <td className="px-6 py-4 text-right tabular-nums">{formatCurrency(bucket.igst_amount)}</td>
                      <td className="px-6 py-4 text-right font-semibold tabular-nums text-slate-900">
                        {formatCurrency(bucket.cgst_amount + bucket.sgst_amount + bucket.igst_amount)}
                      </td>
                    </tr>
                  )) : (
                     <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No GST transactions found in this period.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
