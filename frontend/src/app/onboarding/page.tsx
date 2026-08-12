'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/auth.store';
import { useUpdateCompany } from '../../hooks/api/useCompany';
import { CheckCircle2, Building2, Receipt } from 'lucide-react';

export default function OnboardingPage() {
  const { activeCompanyId, setAuth, user, jwtToken } = useAuthStore();
  const router = useRouter();
  const updateCompany = useUpdateCompany();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    legal_name: '',
    address: '',
    city: '',
    state: '',
    gstin: '',
    pan: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleComplete = () => {
    if (!activeCompanyId) return;

    updateCompany.mutate({
      id: activeCompanyId,
      data: {
        ...formData,
        is_onboarded: true
      }
    }, {
      onSuccess: () => {
        router.push('/dashboard');
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-indigo-100 selection:text-indigo-900 font-sans text-slate-900">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-indigo-600 px-8 py-10 text-white text-center">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome to InvoicePro!</h1>
          <p className="text-indigo-100">Let's get your business profile set up in just a minute.</p>
        </div>

        {/* Progress Tracker */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-center gap-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-indigo-100' : 'bg-slate-100'}`}>1</div>
            <span className="text-sm font-semibold">Business Info</span>
          </div>
          <div className="w-12 h-[2px] bg-slate-200 mt-4"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-indigo-100' : 'bg-slate-100'}`}>2</div>
            <span className="text-sm font-semibold">Tax & GST</span>
          </div>
        </div>

        {/* Forms */}
        <div className="p-8">
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Building2 className="w-5 h-5" /></div>
                <h2 className="text-xl font-bold">Business Information</h2>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Legal Business Name</label>
                <input required name="legal_name" value={formData.legal_name} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all" placeholder="Acme Technologies Pvt Ltd" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Registered Address</label>
                <input required name="address" value={formData.address} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all" placeholder="123 Tech Park, Sector 4" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">City</label>
                  <input required name="city" value={formData.city} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all" placeholder="Mumbai" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">State</label>
                  <input required name="state" value={formData.state} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all" placeholder="Maharashtra" />
                </div>
              </div>
              
              <button onClick={() => setStep(2)} className="w-full mt-6 bg-slate-900 text-white font-semibold h-11 rounded-lg hover:bg-slate-800 transition-colors">
                Continue to Tax Details
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Receipt className="w-5 h-5" /></div>
                <h2 className="text-xl font-bold">Tax & GST Information</h2>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">GSTIN (Optional)</label>
                <input name="gstin" value={formData.gstin} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all" placeholder="27XXXXX0000X1ZX" />
                <p className="text-xs text-slate-500">Required if you want to generate B2B Tax Invoices.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">PAN Number (Optional)</label>
                <input name="pan" value={formData.pan} onChange={handleChange} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all" placeholder="XXXXX0000X" />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="w-1/3 bg-slate-100 text-slate-700 font-semibold h-11 rounded-lg hover:bg-slate-200 transition-colors">
                  Back
                </button>
                <button 
                  onClick={handleComplete} 
                  disabled={updateCompany.isPending}
                  className="flex-1 bg-indigo-600 text-white font-semibold h-11 rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 disabled:opacity-50"
                >
                  {updateCompany.isPending ? 'Finalizing Setup...' : 'Complete Onboarding'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
