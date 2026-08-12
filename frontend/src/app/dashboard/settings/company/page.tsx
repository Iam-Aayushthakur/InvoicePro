'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../stores/auth.store';
import { useCompany, useUpdateCompany } from '../../../../hooks/api/useCompany';
import { Building2, Save } from 'lucide-react';

import { useCompanyStore } from '../../../../stores/company.store';

export default function CompanySettingsPage() {
  const { activeCompanyId } = useAuthStore();
  const { data, isLoading } = useCompany(activeCompanyId);
  const updateCompany = useUpdateCompany();
  const setPreferences = useCompanyStore(state => state.setPreferences);

  const [formData, setFormData] = useState({
    name: '',
    legal_name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstin: '',
    pan: '',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  });

  useEffect(() => {
    if (data?.company) {
      setFormData({
        name: data.company.name || '',
        legal_name: data.company.legal_name || '',
        address: data.company.address || '',
        city: data.company.city || '',
        state: data.company.state || '',
        pincode: data.company.pincode || '',
        gstin: data.company.gstin || '',
        pan: data.company.pan || '',
        currency: data.company.currency || 'INR',
        timezone: data.company.timezone || 'Asia/Kolkata',
      });
      // Sync store on load
      setPreferences({
        currency: data.company.currency || 'INR',
        timezone: data.company.timezone || 'Asia/Kolkata',
      });
    }
  }, [data, setPreferences]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompanyId) return;
    updateCompany.mutate({ id: activeCompanyId, data: formData }, {
      onSuccess: () => {
        setPreferences({
          currency: formData.currency,
          timezone: formData.timezone,
        });
      }
    });
  };


  if (isLoading) {
    return <div className="p-8 animate-pulse text-slate-500">Loading company profile...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Company Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your business profile, tax information, and preferences.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* General Information */}
            <section>
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">
                <Building2 className="w-5 h-5 text-indigo-600" /> General Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Display Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                  <p className="text-xs text-slate-500">Used internally on your dashboard.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Legal Business Name</label>
                  <input name="legal_name" value={formData.legal_name} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                  <p className="text-xs text-slate-500">Appears on invoices and official documents.</p>
                </div>
              </div>
            </section>

            {/* Address */}
            <section>
              <div className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Address Details</div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Street Address</label>
                  <input name="address" value={formData.address} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">City</label>
                    <input name="city" value={formData.city} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">State</label>
                    <input name="state" value={formData.state} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">PIN Code</label>
                    <input name="pincode" value={formData.pincode} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                </div>
              </div>
            </section>

            {/* Tax & Preferences */}
            <section>
              <div className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Tax & Preferences</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">GSTIN</label>
                  <input name="gstin" value={formData.gstin} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">PAN Number</label>
                  <input name="pan" value={formData.pan} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Currency</label>
                  <select name="currency" value={formData.currency} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Timezone</label>
                  <select name="timezone" value={formData.timezone} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
                    <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </section>

          </div>

          <div className="bg-slate-50 border-t border-slate-200 p-6 flex justify-end gap-3">
            {updateCompany.isSuccess && <span className="text-emerald-600 text-sm font-medium flex items-center mr-auto">Settings saved successfully.</span>}
            <button 
              type="submit" 
              disabled={updateCompany.isPending}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateCompany.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
