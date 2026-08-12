'use client';

import React, { useState } from 'react';
import { useSuppliers, Supplier } from '../../../hooks/api/useSuppliers';
import { SupplierForm } from './SupplierForm';
import { Plus, Search, MoreHorizontal, CheckCircle2, XCircle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function SuppliersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useSuppliers(page, 20);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedSupplier(null);
    setIsFormOpen(true);
  };

  const filteredSuppliers = data?.suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    (s.email && s.email.toLowerCase().includes(search.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Suppliers</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your vendors and purchasing contacts.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="inline-flex items-center justify-center h-10 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Supplier
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search suppliers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none bg-slate-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Loading suppliers...</div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No suppliers found</h3>
            <p className="text-sm text-slate-500 mb-6">Get started by adding a vendor to your list.</p>
            <button onClick={handleAddNew} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Add your first supplier</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4 hidden md:table-cell">Contact</th>
                  <th className="px-6 py-4">GSTIN</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{supplier.name}</div>
                      <div className="text-xs text-slate-500 md:hidden mt-1">{supplier.email}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-slate-900">{supplier.email || '-'}</div>
                      <div className="text-xs text-slate-500">{supplier.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                      {supplier.gstin || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {supplier.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/purchases/new?supplier=${supplier.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Create Purchase Bill">
                          <ShoppingCart className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleEdit(supplier)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Edit Supplier">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredSuppliers.length} of {data?.total || 0} suppliers</span>
        </div>
      </div>

      <SupplierForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        supplier={selectedSupplier} 
      />
    </div>
  );
}
