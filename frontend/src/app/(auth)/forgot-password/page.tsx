'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Connect to Auth API forgot-password
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-100">
        
        {!submitted ? (
          <>
            <div className="space-y-2 mb-8">
              <Link href="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
              </Link>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Reset Password</h1>
              <p className="text-sm text-slate-500">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                  placeholder="admin@company.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all shadow-md shadow-indigo-200"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Check your email</h1>
            <p className="text-sm text-slate-500">
              We've sent a password reset link to <span className="font-semibold text-slate-700">{email}</span>.
            </p>
            <div className="pt-6">
              <Link href="/login" className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                Return to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
