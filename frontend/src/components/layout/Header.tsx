'use client';

import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useUIStore } from '../../stores/ui.store';

export function Header() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-500 border border-transparent focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 transition-all w-64 md:w-80">
          <Search className="w-4 h-4 shrink-0" />
          <input 
            type="text" 
            placeholder="Search anything (Ctrl+K)..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-900"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
