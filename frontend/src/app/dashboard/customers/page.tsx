'use client';

import React, { useState } from 'react';
import { useCustomers, Customer } from '../../../hooks/api/useCustomers';
import { CustomerForm } from './CustomerForm';
import { Plus, Search, MoreHorizontal, FileText, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useCustomers(page, 20);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const filteredCustomers = data?.customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-6 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customers</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your clients and their billing details.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="inline-flex items-center justify-center h-10 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Customer
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none bg-slate-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Loading customers...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No customers found</h3>
            <p className="text-sm text-slate-500 mb-6">Get started by creating a new customer record.</p>
            <button onClick={handleAddNew} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Add your first customer</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4 hidden md:table-cell">Contact</th>
                  <th className="px-6 py-4">GSTIN</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{customer.name}</div>
                      <div className="text-xs text-slate-500 md:hidden mt-1">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-slate-900">{customer.email || '-'}</div>
                      <div className="text-xs text-slate-500">{customer.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                      {customer.gstin || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {customer.status === 'ACTIVE' ? (
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
                        <Link href={`/dashboard/invoices/new?customer=${customer.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Create Invoice">
                          <FileText className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleEdit(customer)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Edit Customer">
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
          <span>Showing {filteredCustomers.length} of {data?.total || 0} customers</span>
        </div>
      </div>

      <CustomerForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        customer={selectedCustomer} 
      />
    </div>
  );
}
