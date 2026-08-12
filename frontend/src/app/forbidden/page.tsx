import React from 'react';
import Link from 'next/link';
import { Ban } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Ban className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">403 Forbidden</h1>
        <p className="text-lg text-slate-600">
          You do not have the required permissions to view this page or perform this action.
        </p>
        <div className="pt-4 flex gap-4 justify-center">
          <Link href="/dashboard" className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-8 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
