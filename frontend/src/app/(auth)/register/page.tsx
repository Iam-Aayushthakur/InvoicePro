'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRegister } from '../../../hooks/api/useAuth';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const registerMutation = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ fullName, companyName, email, password });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-100">
        <div className="space-y-2 text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Get Started</h1>
          <p className="text-sm text-slate-500">Register your business account</p>
        </div>

        {registerMutation.isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            {registerMutation.error instanceof Error ? registerMutation.error.message : 'Registration failed'}
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

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              placeholder="owner@acme.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="inline-flex h-11 mt-4 w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all shadow-md shadow-indigo-200"
          >
            {registerMutation.isPending ? 'Creating account...' : 'Start Free 14-Day Trial'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-500 mt-6">
          Already have an account? <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
