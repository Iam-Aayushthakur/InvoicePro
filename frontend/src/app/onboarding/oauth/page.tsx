'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase/client';
import { useCompleteOAuthRegistration } from '../../../hooks/api/useAuth';

export default function OAuthOnboardingPage() {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [accessToken, setAccessToken] = useState('');
  
  const router = useRouter();
  const supabase = createClient();
  const completeMutation = useCompleteOAuthRegistration();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Not authenticated, redirect to login
        router.push('/login');
        return;
      }
      
      // Try to pre-fill name from OAuth metadata
      const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || '';
      if (name) {
        setFullName(name);
      }
      setAccessToken(session.access_token);
      
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, [router, supabase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeMutation.mutate({ companyName, fullName, accessToken });
  };

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-100">
        <div className="space-y-2 text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Almost there!</h1>
          <p className="text-sm text-slate-500">We just need a few more details to set up your workspace.</p>
        </div>

        {completeMutation.isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            {completeMutation.error instanceof Error ? completeMutation.error.message : 'Failed to complete setup'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Company Name</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              placeholder="Acme Retailers Pvt Ltd"
            />
          </div>

          <button
            type="submit"
            disabled={completeMutation.isPending}
            className="inline-flex h-11 mt-4 w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all shadow-md shadow-indigo-200"
          >
            {completeMutation.isPending ? 'Setting up workspace...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}
