import React, { useState } from 'react';
import { useRecordTransaction, Inventory } from '../../../hooks/api/useInventory';
import { X, Save } from 'lucide-react';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItem: Inventory | null;
}

export function StockAdjustmentModal({ isOpen, onClose, inventoryItem }: StockAdjustmentModalProps) {
  const recordTransaction = useRecordTransaction();

  const [formData, setFormData] = useState({
    transaction_type: 'ADJUSTMENT',
    quantity: 0,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryItem) return;

    recordTransaction.mutate(
      {
        product_id: inventoryItem.product_id,
        transaction_type: formData.transaction_type,
        quantity: formData.quantity,
        notes: formData.notes,
      },
      { onSuccess: () => onClose() }
    );
  };

  if (!isOpen || !inventoryItem) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Adjust Stock</h2>
            <p className="text-sm text-slate-500 mt-0.5">{inventoryItem.product?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Available</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{inventoryItem.available_quantity}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reserved</p>
              <p className="text-xl font-bold text-indigo-600 mt-1">{inventoryItem.reserved_quantity}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Adjustment Type</label>
              <select 
                name="transaction_type" 
                value={formData.transaction_type} 
                onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })} 
                className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
              >
                <option value="ADJUSTMENT">Manual Adjustment</option>
                <option value="DAMAGE">Mark as Damaged / Lost</option>
                <option value="OPENING">Update Opening Stock</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Quantity (Add/Remove)</label>
              <div className="relative">
                <input 
                  type="number" 
                  required 
                  name="quantity" 
                  value={formData.quantity} 
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })} 
                  className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none font-mono" 
                  placeholder="e.g. 5 or -2" 
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-sm font-medium">{inventoryItem.product?.unit || 'units'}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">Use negative numbers to reduce stock (e.g. -5).</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Notes / Reason</label>
              <input 
                name="notes" 
                value={formData.notes} 
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })} 
                className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" 
                placeholder="e.g. Found extra in warehouse" 
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 h-11 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button disabled={recordTransaction.isPending || formData.quantity === 0} type="submit" className="flex-[2] flex items-center justify-center gap-2 h-11 bg-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 disabled:opacity-50 transition-colors">
              <Save className="w-4 h-4" />
              {recordTransaction.isPending ? 'Processing...' : 'Confirm Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
