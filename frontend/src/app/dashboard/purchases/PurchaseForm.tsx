'use client';

import React, { useState, useMemo } from 'react';
import { useCreatePurchase } from '../../../hooks/api/usePurchases';
import { useSuppliers } from '../../../hooks/api/useSuppliers';
import { useProducts } from '../../../hooks/api/useProducts';
import { calculateLineTax, calculateDocumentTotals } from '../../../lib/calculations/gst';
import { formatCurrency } from '../../../lib/utils/currency';
import { X, Plus, Trash2 } from 'lucide-react';

interface PurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LineItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discount: number;
  tax_rate: number;
}

let lineId = 0;
function newLine(): LineItem {
  return { id: `pl-${++lineId}`, product_id: '', quantity: 1, unit_price: 0, discount: 0, tax_rate: 18 };
}

export function PurchaseForm({ isOpen, onClose }: PurchaseFormProps) {
  const createPurchase = useCreatePurchase();
  const { data: suppliersData } = useSuppliers(1, 100);
  const { data: productsData } = useProducts(1, 200);

  const [supplierId, setSupplierId] = useState('');
  const [purchaseNumber, setPurchaseNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([newLine()]);

  const suppliers = suppliersData?.suppliers || [];
  const products = productsData?.products || [];

  const lineResults = useMemo(() => items.map(item => calculateLineTax({
    quantity: item.quantity, unit_price: item.unit_price, discount: item.discount, tax_rate: item.tax_rate, is_inter_state: false,
  })), [items]);

  const totals = useMemo(() => calculateDocumentTotals(lineResults), [lineResults]);

  const selectProduct = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setItems(prev => {
        const next = [...prev];
        next[index] = { ...next[index], product_id: productId, unit_price: Number(product.purchase_price || 0), tax_rate: Number(product.tax_rate || 18) };
        return next;
      });
    }
  };

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    setItems(prev => { const next = [...prev]; next[index] = { ...next[index], [field]: value }; return next; });
  };

  const handleSubmit = () => {
    if (!supplierId || !purchaseNumber || items.some(i => !i.product_id)) return;
    createPurchase.mutate({
      supplier_id: supplierId,
      purchase_number: purchaseNumber,
      notes: notes || undefined,
      items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity, unit_price: i.unit_price, discount: i.discount, tax_rate: i.tax_rate })),
    }, { onSuccess: () => { onClose(); setItems([newLine()]); setSupplierId(''); setPurchaseNumber(''); } });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">New Purchase Order</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700">Supplier *</label>
              <select value={supplierId} onChange={e => setSupplierId(e.target.value)} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
                <option value="">Select supplier...</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700">PO Number *</label>
              <input value={purchaseNumber} onChange={e => setPurchaseNumber(e.target.value)} placeholder="PO-001" className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">Line Items</h3>
              <button onClick={() => setItems(prev => [...prev, newLine()])} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="p-3 border border-slate-200 rounded-lg space-y-2 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <select value={item.product_id} onChange={e => selectProduct(idx, e.target.value)} className="flex-1 h-9 rounded-lg border border-slate-300 px-2 text-sm bg-white">
                      <option value="">Product...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <button onClick={() => items.length > 1 && setItems(prev => prev.filter((_, i) => i !== idx))} className="p-1.5 text-slate-400 hover:text-rose-600 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div><label className="text-[10px] text-slate-500">Qty</label><input type="number" min="1" value={item.quantity} onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value) || 0)} className="h-8 w-full rounded border border-slate-300 px-2 text-xs text-right" /></div>
                    <div><label className="text-[10px] text-slate-500">Price</label><input type="number" value={item.unit_price} onChange={e => updateItem(idx, 'unit_price', parseFloat(e.target.value) || 0)} className="h-8 w-full rounded border border-slate-300 px-2 text-xs text-right" /></div>
                    <div><label className="text-[10px] text-slate-500">Tax%</label><select value={item.tax_rate} onChange={e => updateItem(idx, 'tax_rate', parseFloat(e.target.value))} className="h-8 w-full rounded border border-slate-300 px-1 text-xs bg-white"><option value={0}>0</option><option value={5}>5</option><option value={12}>12</option><option value={18}>18</option><option value={28}>28</option></select></div>
                    <div><label className="text-[10px] text-slate-500">Total</label><div className="h-8 flex items-center justify-end text-xs font-semibold text-slate-900 tabular-nums">{formatCurrency(lineResults[idx]?.line_total || 0)}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 space-y-2 border border-slate-200">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="font-medium tabular-nums">{formatCurrency(totals.subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Tax</span><span className="tabular-nums">{formatCurrency(totals.tax_total)}</span></div>
            <div className="border-t border-slate-200 pt-2 flex justify-between"><span className="font-bold text-slate-900">Grand Total</span><span className="font-bold text-indigo-600 tabular-nums">{formatCurrency(totals.grand_total)}</span></div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Additional notes..." className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-indigo-600 outline-none" />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button onClick={onClose} className="flex-1 h-11 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
          <button disabled={createPurchase.isPending} onClick={handleSubmit} className="flex-1 h-11 bg-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 disabled:opacity-50">
            {createPurchase.isPending ? 'Creating...' : 'Create Purchase'}
          </button>
        </div>
      </div>
    </>
  );
}
