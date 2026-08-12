'use client';

import React from 'react';
import { useSubscriptionDetails } from '../../../hooks/api/useSubscription';
import { CreditCard, Zap, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function SubscriptionsPage() {
  const { data, isLoading } = useSubscriptionDetails();

  const sub = data?.subscription;
  const usage = data?.usage || [];

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 max-w-4xl mx-auto">
         <div className="h-40 bg-slate-100 rounded-2xl animate-pulse"></div>
         <div className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Subscription & Billing</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your plan and monitor usage limits.</p>
      </div>

      {/* Plan Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row relative">
        {sub?.plan_name === 'PRO' && (
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Current Plan</div>
        )}
        <div className="p-8 md:w-1/3 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-center text-center">
           <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
             <CreditCard className="w-8 h-8" />
           </div>
           <h2 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide">{sub?.plan_name || 'FREE'} Plan</h2>
           <div className="mt-2 inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
             <CheckCircle2 className="w-3 h-3" /> {sub?.status || 'ACTIVE'}
           </div>
        </div>
        <div className="p-8 md:w-2/3 flex flex-col justify-center">
           <div className="space-y-4">
              <div className="flex items-start gap-3">
                 <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-sm font-semibold text-slate-900">Billing Period</p>
                   <p className="text-sm text-slate-600 mt-0.5">
                      {sub?.current_period_start ? new Date(sub.current_period_start).toLocaleDateString() : '-'} to {sub?.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : '-'}
                   </p>
                 </div>
              </div>
              <div className="flex items-start gap-3">
                 <Zap className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-sm font-semibold text-slate-900">Plan Features</p>
                   <p className="text-sm text-slate-600 mt-0.5">
                      Up to {sub?.max_invoices === -1 ? 'Unlimited' : sub?.max_invoices} invoices/mo, {sub?.max_users} team members, {sub?.max_storage_mb}MB storage.
                   </p>
                 </div>
              </div>
           </div>
           <div className="mt-8 flex gap-3">
             <button className="h-10 px-4 rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors">
               Upgrade Plan
             </button>
             <button className="h-10 px-4 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
               View Invoices
             </button>
           </div>
        </div>
      </div>

      {/* Usage Limits */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Current Usage</h2>
          <p className="text-sm text-slate-500">Your resource consumption for the current billing cycle.</p>
        </div>
        <div className="p-6 space-y-8">
          {usage.map((u, idx) => {
            const percentage = u.limit_value > 0 ? Math.min(100, Math.round((u.current_value / u.limit_value) * 100)) : 0;
            const isNearLimit = percentage >= 80;
            const isAtLimit = percentage >= 100;
            
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700 capitalize">{u.metric.replace('_', ' ')}</h3>
                  <div className="text-sm font-medium text-slate-600">
                    <span className={isAtLimit ? 'text-rose-600' : isNearLimit ? 'text-amber-600' : 'text-slate-900'}>
                      {u.current_value}
                    </span> 
                    <span className="text-slate-400 mx-1">/</span> 
                    {u.limit_value === -1 ? '∞' : u.limit_value}
                  </div>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div 
                     className={`h-full rounded-full transition-all duration-1000 ${isAtLimit ? 'bg-rose-500' : isNearLimit ? 'bg-amber-500' : 'bg-indigo-500'}`}
                     style={{ width: `${u.limit_value === -1 ? 10 : percentage}%` }}
                   />
                </div>
                {isNearLimit && !isAtLimit && (
                  <p className="text-xs text-amber-600 flex items-center gap-1.5 mt-1"><AlertCircle className="w-3.5 h-3.5"/> You are approaching your limit.</p>
                )}
                {isAtLimit && (
                  <p className="text-xs text-rose-600 flex items-center gap-1.5 mt-1"><AlertCircle className="w-3.5 h-3.5"/> Limit reached. Please upgrade to continue.</p>
                )}
              </div>
            );
          })}
          
          {usage.length === 0 && (
             <div className="text-center text-sm text-slate-500 py-4">No usage data available for this cycle.</div>
          )}
        </div>
      </div>
    </div>
  );
}
