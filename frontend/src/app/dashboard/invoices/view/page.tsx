'use client';

import React, { useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useInvoice, useUpdateInvoiceStatus } from '../../../../hooks/api/useInvoices';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { formatCurrency } from '../../../../lib/utils/currency';
import { ArrowLeft, Printer, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function InvoiceDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get('id') as string;
  const { data, isLoading, isError } = useInvoice(invoiceId);
  const updateStatus = useUpdateInvoiceStatus();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = (status: string) => {
    updateStatus.mutate({ id: invoiceId, status }, {
      onSuccess: () => {},
    });
  };

  if (!invoiceId) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-center">
        <h3 className="font-bold text-lg">Invalid Invoice ID</h3>
        <Link href="/dashboard/invoices" className="text-sm font-medium mt-2 inline-block underline">Back to invoices</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (isError || !data?.invoice) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-center">
        <h3 className="font-bold text-lg">Invoice not found</h3>
        <Link href="/dashboard/invoices" className="text-sm font-medium mt-2 inline-block underline">Back to invoices</Link>
      </div>
    );
  }

  const inv = data.invoice;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header - Hidden on print */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices" className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoice {inv.invoice_number}</h1>
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge status={inv.status} size="md" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
          {inv.status === 'DRAFT' && (
            <button onClick={() => handleStatusChange('ISSUED')} disabled={updateStatus.isPending} className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors disabled:opacity-50">
              <CheckCircle className="w-4 h-4" /> Issue Invoice
            </button>
          )}
          {(inv.status === 'ISSUED' || inv.status === 'PARTIALLY_PAID') && (
            <button onClick={() => handleStatusChange('PAID')} disabled={updateStatus.isPending} className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-colors disabled:opacity-50">
              <CheckCircle className="w-4 h-4" /> Mark as Paid
            </button>
          )}
          {inv.status !== 'CANCELLED' && inv.status !== 'PAID' && (
            <button onClick={() => handleStatusChange('CANCELLED')} disabled={updateStatus.isPending} className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-rose-300 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50">
              <XCircle className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* Printable Invoice */}
      <div ref={printRef} className="bg-white rounded-2xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:rounded-none">
        {/* Invoice Header */}
        <div className="p-8 border-b border-slate-100 print:border-slate-300">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-extrabold text-indigo-600">TAX INVOICE</h2>
              <p className="text-sm text-slate-500 mt-1">Invoice # <span className="font-semibold text-slate-900">{inv.invoice_number}</span></p>
            </div>
            <div className="text-right text-sm text-slate-600">
              <p><span className="font-semibold text-slate-700">Date:</span> {new Date(inv.invoice_date || inv.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              {inv.due_date && <p><span className="font-semibold text-slate-700">Due:</span> {new Date(inv.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>}
            </div>
          </div>
        </div>

        {/* Billed To */}
        <div className="p-8 border-b border-slate-100 print:border-slate-300">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Billed To</h3>
              <p className="text-base font-bold text-slate-900">{inv.customer?.name || 'Customer'}</p>
              {inv.customer?.gstin && <p className="text-sm text-slate-600 mt-1">GSTIN: <span className="font-mono">{inv.customer.gstin}</span></p>}
              {inv.customer?.email && <p className="text-sm text-slate-600">{inv.customer.email}</p>}
            </div>
            <div className="text-right">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Payment Status</h3>
              <p className="text-sm text-slate-700">
                Paid: <span className="font-semibold text-emerald-600">{formatCurrency(inv.paid_amount || 0)}</span>
              </p>
              <p className="text-sm text-slate-700">
                Balance: <span className="font-semibold text-amber-600">{formatCurrency(inv.balance_amount || 0)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="px-8 py-4">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 text-left">#</th>
                <th className="py-3 text-left">Item</th>
                <th className="py-3 text-right">Qty</th>
                <th className="py-3 text-right">Rate</th>
                <th className="py-3 text-right">Tax</th>
                <th className="py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(inv.items || []).map((item, idx) => (
                <tr key={item.id}>
                  <td className="py-3 text-slate-500">{idx + 1}</td>
                  <td className="py-3 font-medium text-slate-900">{item.product_name || item.product_id}</td>
                  <td className="py-3 text-right tabular-nums">{item.quantity}</td>
                  <td className="py-3 text-right tabular-nums">{formatCurrency(item.unit_price)}</td>
                  <td className="py-3 text-right tabular-nums">{formatCurrency(item.cgst_amount + item.sgst_amount + item.igst_amount)}</td>
                  <td className="py-3 text-right font-semibold tabular-nums">{formatCurrency(item.line_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="p-8 border-t border-slate-200 print:border-slate-300">
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium tabular-nums">{formatCurrency(inv.subtotal || inv.taxable_amount)}</span>
              </div>
              {(inv.cgst_total > 0) && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">CGST</span>
                    <span className="tabular-nums">{formatCurrency(inv.cgst_total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">SGST</span>
                    <span className="tabular-nums">{formatCurrency(inv.sgst_total)}</span>
                  </div>
                </>
              )}
              {(inv.igst_total > 0) && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">IGST</span>
                  <span className="tabular-nums">{formatCurrency(inv.igst_total)}</span>
                </div>
              )}
              {inv.round_off !== 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Round Off</span>
                  <span className="tabular-nums">{formatCurrency(inv.round_off)}</span>
                </div>
              )}
              <div className="border-t-2 border-slate-900 pt-2 flex justify-between">
                <span className="text-base font-extrabold text-slate-900">Grand Total</span>
                <span className="text-lg font-extrabold text-slate-900 tabular-nums">{formatCurrency(inv.grand_total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {inv.notes && (
          <div className="px-8 pb-8">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Notes</h3>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{inv.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InvoiceDetailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-indigo-600 animate-spin" /></div>}>
      <InvoiceDetailContent />
    </Suspense>
  );
}
