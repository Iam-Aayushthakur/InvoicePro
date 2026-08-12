'use client';

import React, { useState } from 'react';
import { usePayments } from '../../../hooks/api/usePayments';
import { PaymentForm } from './PaymentForm';
import { Plus, Search, Banknote, CreditCard, Smartphone, Building2, Receipt, Wallet } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils/currency';

const METHOD_ICONS: Record<string, React.ElementType> = {
  CASH: Banknote, UPI: Smartphone, BANK_TRANSFER: Building2, CHEQUE: Receipt, CARD: CreditCard, OTHER: Wallet,
};
const METHOD_COLORS: Record<string, string> = {
  CASH: 'bg-emerald-100 text-emerald-700', UPI: 'bg-violet-100 text-violet-700', BANK_TRANSFER: 'bg-sky-100 text-sky-700', CHEQUE: 'bg-amber-100 text-amber-700', CARD: 'bg-indigo-100 text-indigo-700', OTHER: 'bg-slate-100 text-slate-700',
};

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data, isLoading } = usePayments(page, 20);

  const payments = data?.payments || [];

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payments & Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">Record and track all incoming and outgoing payments.</p>
        </div>
        <button onClick={() => setIsFormOpen(true)} className="inline-flex items-center justify-center h-10 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
          <Plus className="w-4 h-4 mr-2" /> Record Payment
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">{[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}</div>
        ) : payments.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"><Banknote className="w-8 h-8 text-slate-300" /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No payments recorded</h3>
            <p className="text-sm text-slate-500 mb-6">Start recording payments against invoices or purchases.</p>
            <button onClick={() => setIsFormOpen(true)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Record your first payment →</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 hidden md:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map(pay => {
                  const Icon = METHOD_ICONS[pay.payment_method] || Wallet;
                  const color = METHOD_COLORS[pay.payment_method] || METHOD_COLORS.OTHER;
                  return (
                    <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-slate-600">{new Date(pay.payment_date || pay.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="px-6 py-4">
                        <span className="text-slate-900 font-medium">{pay.reference_number || '-'}</span>
                        {pay.invoice_id && <span className="text-xs text-indigo-600 ml-2">Invoice</span>}
                        {pay.purchase_id && <span className="text-xs text-amber-600 ml-2">Purchase</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
                          <Icon className="w-3 h-3" /> {pay.payment_method.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600 tabular-nums">{formatCurrency(pay.amount)}</td>
                      <td className="px-6 py-4 hidden md:table-cell text-slate-500 text-xs max-w-[200px] truncate">{pay.notes || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {(data?.total || 0) > 0 && <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">Showing {payments.length} of {data?.total || 0} payments</div>}
      </div>

      <PaymentForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
