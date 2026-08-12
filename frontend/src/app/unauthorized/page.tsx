import React from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">401 Unauthorized</h1>
        <p className="text-lg text-slate-600">
          Your session has expired or you do not have valid authentication credentials to access this page.
        </p>
        <div className="pt-4">
          <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-8 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
            Sign In to Continue
          </Link>
        </div>
      </div>
    </div>
  );
}
