'use client';

import React, { useState } from 'react';
import { useCreatePayment } from '../../../hooks/api/usePayments';
import { X } from 'lucide-react';

interface PaymentFormProps { isOpen: boolean; onClose: () => void; }

export function PaymentForm({ isOpen, onClose }: PaymentFormProps) {
  const createPayment = useCreatePayment();
  const [formData, setFormData] = useState({ invoice_id: '', purchase_id: '', amount: '', payment_method: 'UPI', reference_number: '', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPayment.mutate({
      invoice_id: formData.invoice_id || undefined,
      purchase_id: formData.purchase_id || undefined,
      amount: parseFloat(formData.amount),
      payment_method: formData.payment_method,
      reference_number: formData.reference_number || undefined,
      notes: formData.notes || undefined,
    }, { onSuccess: () => { onClose(); setFormData({ invoice_id: '', purchase_id: '', amount: '', payment_method: 'UPI', reference_number: '', notes: '' }); } });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Record Payment</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Amount *</label>
            <input required type="number" min="0.01" step="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Payment Method</label>
            <select value={formData.payment_method} onChange={e => setFormData({ ...formData, payment_method: e.target.value })} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
              <option value="CASH">Cash</option><option value="UPI">UPI</option><option value="BANK_TRANSFER">Bank Transfer</option><option value="CHEQUE">Cheque</option><option value="CARD">Card</option><option value="OTHER">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Invoice ID (optional)</label>
            <input value={formData.invoice_id} onChange={e => setFormData({ ...formData, invoice_id: e.target.value })} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Paste invoice UUID" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Purchase ID (optional)</label>
            <input value={formData.purchase_id} onChange={e => setFormData({ ...formData, purchase_id: e.target.value })} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Paste purchase UUID" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Reference Number</label>
            <input value={formData.reference_number} onChange={e => setFormData({ ...formData, reference_number: e.target.value })} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Transaction ID / Cheque #" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Notes</label>
            <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows={2} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Payment notes..." />
          </div>
        </form>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button onClick={onClose} type="button" className="flex-1 h-11 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
          <button disabled={createPayment.isPending} onClick={handleSubmit as any} className="flex-1 h-11 bg-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 disabled:opacity-50">{createPayment.isPending ? 'Saving...' : 'Record Payment'}</button>
        </div>
      </div>
    </>
  );
}
