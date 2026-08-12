'use client';

import React, { useState, useMemo } from 'react';
import { useCreateInvoice } from '../../../../hooks/api/useInvoices';
import { useCustomers } from '../../../../hooks/api/useCustomers';
import { useProducts, Product } from '../../../../hooks/api/useProducts';
import { calculateLineTax, calculateDocumentTotals, LineTaxResult } from '../../../../lib/calculations/gst';
import { formatCurrency } from '../../../../lib/utils/currency';
import { ArrowLeft, Plus, Trash2, Save, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LineItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  discount: number;
  tax_rate: number;
}

let lineCounter = 0;
function newLine(): LineItem {
  lineCounter++;
  return { id: `line-${lineCounter}`, product_id: '', product_name: '', quantity: 1, unit_price: 0, discount: 0, tax_rate: 18 };
}

export default function NewInvoicePage() {
  const router = useRouter();
  const createInvoice = useCreateInvoice();
  const { data: customersData } = useCustomers(1, 100);
  const { data: productsData } = useProducts(1, 200);

  const [customerId, setCustomerId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([newLine()]);

  const customers = customersData?.customers || [];
  const products = productsData?.products || [];

  const lineResults: LineTaxResult[] = useMemo(() => {
    return items.map(item => calculateLineTax({
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount: item.discount,
      tax_rate: item.tax_rate,
      is_inter_state: false,
    }));
  }, [items]);

  const totals = useMemo(() => calculateDocumentTotals(lineResults), [lineResults]);

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const selectProduct = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setItems(prev => {
        const next = [...prev];
        next[index] = { ...next[index], product_id: productId, product_name: product.name, unit_price: Number(product.selling_price || 0), tax_rate: Number(product.tax_rate || 18) };
        return next;
      });
    }
  };

  const addLine = () => setItems(prev => [...prev, newLine()]);
  const removeLine = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (status: 'DRAFT' | 'ISSUED' = 'DRAFT') => {
    if (!customerId || !invoiceNumber || items.some(i => !i.product_id || i.quantity <= 0)) return;
    createInvoice.mutate({
      customer_id: customerId,
      invoice_number: invoiceNumber,
      due_date: dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      notes: notes || undefined,
      items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity, unit_price: i.unit_price, discount: i.discount || 0, tax_rate: i.tax_rate })),
    }, {
      onSuccess: () => router.push('/dashboard/invoices'),
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/invoices" className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Invoice</h1>
          <p className="text-sm text-slate-500 mt-0.5">Add line items and GST will be calculated automatically.</p>
        </div>
      </div>

      {/* Invoice Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Customer *</label>
            <select
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
            >
              <option value="">Select a customer...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}{c.gstin ? ` (${c.gstin})` : ''}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Invoice Number *</label>
            <input
              value={invoiceNumber}
              onChange={e => setInvoiceNumber(e.target.value)}
              placeholder="INV-001"
              className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Line Items Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Line Items</h2>
          <button onClick={addLine} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200">
            <Plus className="w-3.5 h-3.5" /> Add Item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left min-w-[200px]">Product</th>
                <th className="px-4 py-3 text-right w-20">Qty</th>
                <th className="px-4 py-3 text-right w-28">Unit Price</th>
                <th className="px-4 py-3 text-right w-24">Discount</th>
                <th className="px-4 py-3 text-right w-20">Tax %</th>
                <th className="px-4 py-3 text-right w-24">Taxable</th>
                <th className="px-4 py-3 text-right w-20">Tax</th>
                <th className="px-4 py-3 text-right w-28">Total</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => (
                <tr key={item.id} className="group">
                  <td className="px-4 py-3">
                    <select
                      value={item.product_id}
                      onChange={e => selectProduct(index, e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-300 px-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
                    >
                      <option value="">Select product...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" min="1" value={item.quantity} onChange={e => updateItem(index, 'quantity', parseInt(e.target.value) || 0)} className="h-9 w-full rounded-lg border border-slate-300 px-2 text-sm text-right focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" min="0" step="0.01" value={item.unit_price} onChange={e => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)} className="h-9 w-full rounded-lg border border-slate-300 px-2 text-sm text-right focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" min="0" step="0.01" value={item.discount} onChange={e => updateItem(index, 'discount', parseFloat(e.target.value) || 0)} className="h-9 w-full rounded-lg border border-slate-300 px-2 text-sm text-right focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </td>
                  <td className="px-4 py-3">
                    <select value={item.tax_rate} onChange={e => updateItem(index, 'tax_rate', parseFloat(e.target.value))} className="h-9 w-full rounded-lg border border-slate-300 px-2 text-sm text-right focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
                      <option value={0}>0%</option>
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18%</option>
                      <option value={28}>28%</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 font-medium tabular-nums">{formatCurrency(lineResults[index]?.taxable_amount || 0)}</td>
                  <td className="px-4 py-3 text-right text-slate-600 tabular-nums">{formatCurrency(lineResults[index]?.tax_amount || 0)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums">{formatCurrency(lineResults[index]?.line_total || 0)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => removeLine(index)} disabled={items.length <= 1} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals + Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            placeholder="Payment terms, bank details, or additional notes..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-medium text-slate-900 tabular-nums">{formatCurrency(totals.subtotal)}</span>
          </div>
          {totals.cgst_total > 0 && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">CGST</span>
                <span className="text-slate-700 tabular-nums">{formatCurrency(totals.cgst_total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">SGST</span>
                <span className="text-slate-700 tabular-nums">{formatCurrency(totals.sgst_total)}</span>
              </div>
            </>
          )}
          {totals.igst_total > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">IGST</span>
              <span className="text-slate-700 tabular-nums">{formatCurrency(totals.igst_total)}</span>
            </div>
          )}
          {totals.round_off !== 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Round Off</span>
              <span className="text-slate-700 tabular-nums">{formatCurrency(totals.round_off)}</span>
            </div>
          )}
          <div className="border-t border-slate-200 pt-3 flex justify-between">
            <span className="text-base font-bold text-slate-900">Grand Total</span>
            <span className="text-xl font-bold text-indigo-600 tabular-nums">{formatCurrency(totals.grand_total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <Link href="/dashboard/invoices" className="h-11 px-6 inline-flex items-center justify-center rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          Cancel
        </Link>
        <button
          onClick={() => handleSubmit('DRAFT')}
          disabled={createInvoice.isPending}
          className="h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> Save as Draft
        </button>
        <button
          onClick={() => handleSubmit('ISSUED')}
          disabled={createInvoice.isPending}
          className="h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" /> Issue Invoice
        </button>
      </div>
    </div>
  );
}
