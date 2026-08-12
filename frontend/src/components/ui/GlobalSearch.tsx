'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, Users, ShoppingCart, Settings, ArrowRight } from 'lucide-react';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const items = [
    { name: 'New Invoice', url: '/dashboard/invoices/new', icon: FileText, category: 'Quick Actions' },
    { name: 'New Quotation', url: '/dashboard/quotations', icon: FileText, category: 'Quick Actions' },
    { name: 'Record Payment', url: '/dashboard/payments', icon: ShoppingCart, category: 'Quick Actions' },
    
    { name: 'Invoices', url: '/dashboard/invoices', icon: FileText, category: 'Pages' },
    { name: 'Customers', url: '/dashboard/customers', icon: Users, category: 'Pages' },
    { name: 'Products & Services', url: '/dashboard/inventory', icon: ShoppingCart, category: 'Pages' },
    { name: 'Reports', url: '/dashboard/reports', icon: FileText, category: 'Pages' },
    { name: 'Company Settings', url: '/dashboard/settings/company', icon: Settings, category: 'Settings' },
  ];

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100]" onClick={() => setIsOpen(false)} aria-hidden="true" />
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-label="Global Search"
        className="fixed left-1/2 top-[15%] -translate-x-1/2 w-full max-w-xl bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400" aria-hidden="true" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for invoices, customers, settings..."
            className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
            aria-label="Search query"
          />
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded" aria-hidden="true">
             ESC
          </div>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-4 last:mb-0">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{category}</div>
              <div className="space-y-1">
                {items.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      router.push(item.url);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 group transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-700 group-hover:text-slate-900">{item.name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
             <div className="py-12 text-center text-slate-500 text-sm">
                No results found for "{query}".
             </div>
          )}
        </div>
      </div>
    </>
  );
}
