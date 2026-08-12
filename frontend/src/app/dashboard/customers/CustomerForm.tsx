import React, { useState, useEffect } from 'react';
import { useCreateCustomer, useUpdateCustomer, Customer } from '../../../hooks/api/useCustomers';
import { X } from 'lucide-react';

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

export function CustomerForm({ isOpen, onClose, customer }: CustomerFormProps) {
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    gstin: string;
    status: 'ACTIVE' | 'INACTIVE';
  }>({
    name: '',
    email: '',
    phone: '',
    gstin: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone || '',
        gstin: customer.gstin || '',
        status: customer.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        gstin: '',
        status: 'ACTIVE',
      });
    }
  }, [customer, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customer) {
      updateCustomer.mutate(
        { id: customer.id, data: formData },
        { onSuccess: () => onClose() }
      );
    } else {
      createCustomer.mutate(formData, { onSuccess: () => onClose() });
    }
  };

  if (!isOpen) return null;

  const isPending = createCustomer.isPending || updateCustomer.isPending;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{customer ? 'Edit Customer' : 'Add New Customer'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Customer Name *</label>
            <input required name="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Acme Corp" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="billing@acme.com" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="+91 9876543210" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">GSTIN</label>
            <input name="gstin" value={formData.gstin} onChange={e => setFormData({ ...formData, gstin: e.target.value })} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none uppercase" placeholder="27XXXXX0000X1ZX" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Status</label>
            <select name="status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button onClick={onClose} type="button" className="flex-1 h-11 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button disabled={isPending} onClick={handleSubmit} className="flex-1 h-11 bg-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 disabled:opacity-50">
            {isPending ? 'Saving...' : 'Save Customer'}
          </button>
        </div>
      </div>
    </>
  );
}
