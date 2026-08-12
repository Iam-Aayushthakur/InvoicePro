'use client';

import React, { useState } from 'react';
import { useInventory, Inventory } from '../../../hooks/api/useInventory';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { Search, AlertTriangle, ArrowUpDown, Archive } from 'lucide-react';
import Link from 'next/link';

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useInventory(page, 50);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);

  const handleAdjust = (item: Inventory) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const inventory = data?.inventory || [];

  const filteredInventory = inventory.filter(item => 
    item.product?.name.toLowerCase().includes(search.toLowerCase()) || 
    (item.product?.sku && item.product.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory Ledger</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor real-time stock levels and manage adjustments.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search stock by product name or SKU..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none bg-slate-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Loading stock ledger...</div>
        ) : filteredInventory.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Archive className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No tracked inventory</h3>
            <p className="text-sm text-slate-500 mb-6">Create products with 'Track Inventory' enabled to see them here.</p>
            <Link href="/dashboard/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Go to Products</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4 text-center">Physical Qty</th>
                  <th className="px-6 py-4 text-center">Reserved</th>
                  <th className="px-6 py-4 text-center">Available</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.map((item) => {
                  const isLowStock = item.product && item.available_quantity <= item.product.minimum_stock;
                  const isOutOfStock = item.available_quantity <= 0;
                  
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {item.product?.name || 'Unknown Product'}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        {item.product?.sku || '-'}
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600">
                        {item.quantity} {item.product?.unit}
                      </td>
                      <td className="px-6 py-4 text-center text-slate-500">
                        {item.reserved_quantity} {item.product?.unit}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-900">
                        {item.available_quantity} {item.product?.unit}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-rose-100 text-rose-700">
                            <AlertTriangle className="w-3 h-3" /> Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-100 text-amber-700">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-700">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleAdjust(item)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-sm" title="Adjust Stock">
                          <ArrowUpDown className="w-3.5 h-3.5" /> Adjust
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredInventory.length} of {data?.total || 0} items</span>
        </div>
      </div>

      <StockAdjustmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        inventoryItem={selectedItem} 
      />
    </div>
  );
}
