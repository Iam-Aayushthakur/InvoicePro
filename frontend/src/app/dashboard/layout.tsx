'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { GlobalSearch } from '../../components/ui/GlobalSearch';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading session...</div>;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <GlobalSearch />
      
      {/* Sidebar for Desktop */}
      <div className="hidden lg:block h-full shadow-lg shadow-slate-200/50 z-20">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
