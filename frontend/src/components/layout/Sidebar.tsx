'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, ShoppingBag, Box, Tags,
  ShoppingCart, Receipt, FileText, CreditCard, Banknote,
  BarChart3, PieChart,
  Bell, Shield, History, HardDrive, Settings, 
  LogOut, ReceiptText, ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useLogout } from '../../hooks/api/useAuth';

const NAVIGATION = [
  {
    group: 'Main',
    items: [{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    group: 'Business',
    items: [
      { name: 'Customers', href: '/dashboard/customers', icon: Users },
      { name: 'Suppliers', href: '/dashboard/suppliers', icon: ShoppingBag },
      { name: 'Products', href: '/dashboard/products', icon: Box },
      { name: 'Categories', href: '/dashboard/categories', icon: Tags },
      { name: 'Inventory', href: '/dashboard/inventory', icon: ShoppingCart },
    ],
  },
  {
    group: 'Transactions',
    items: [
      { name: 'Sales', href: '/dashboard/sales', icon: Receipt },
      { name: 'Invoices', href: '/dashboard/invoices', icon: ReceiptText },
      { name: 'Quotations', href: '/dashboard/quotations', icon: FileText },
      { name: 'Purchases', href: '/dashboard/purchases', icon: ShoppingCart },
      { name: 'Payments', href: '/dashboard/payments', icon: Banknote },
    ],
  },
  {
    group: 'Analytics',
    items: [
      { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
      { name: 'Analytics', href: '/dashboard/analytics', icon: PieChart },
    ],
  },
  {
    group: 'System',
    items: [
      { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
      { name: 'Employees', href: '/dashboard/settings/employees', icon: Shield },
      { name: 'Audit Logs', href: '/dashboard/settings/audit-logs', icon: History },
      { name: 'Backups', href: '/dashboard/settings/backups', icon: HardDrive },
      { name: 'Settings', href: '/dashboard/settings/company', icon: Settings },
    ],
  },
  {
    group: 'Account',
    items: [
      { name: 'Subscription', href: '/dashboard/settings/billing', icon: CreditCard },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useLogout();
  const { user } = useAuthStore();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col h-full overflow-hidden transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2 text-indigo-600">
          <ShieldCheck className="w-6 h-6" />
          <span className="text-xl font-bold tracking-tight text-slate-900">InvoicePro</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
        {NAVIGATION.map((section, idx) => (
          <div key={idx}>
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {section.group}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.full_name || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => logout.mutate()}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
