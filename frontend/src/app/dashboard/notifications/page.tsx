'use client';

import React, { useState } from 'react';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../../../hooks/api/useNotifications';
import { Bell, Info, ShieldAlert, CreditCard, Check, CheckCheck } from 'lucide-react';

const NOTIFICATION_ICONS: Record<string, React.ElementType> = {
  SYSTEM: Info,
  ALERT: ShieldAlert,
  BILLING: CreditCard,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  SYSTEM: 'bg-blue-100 text-blue-600',
  ALERT: 'bg-rose-100 text-rose-600',
  BILLING: 'bg-indigo-100 text-indigo-600',
};

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotifications(page, 50);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">Stay updated with your account activity.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
            className="inline-flex items-center justify-center h-10 px-4 py-2 bg-white border border-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-slate-700 disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4 mr-2" /> Mark all read
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="divide-y divide-slate-100">
             {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className="p-4 flex gap-4 animate-pulse">
                 <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0"></div>
                 <div className="flex-1 space-y-2 py-1">
                   <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                   <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                 </div>
               </div>
             ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No notifications</h3>
            <p className="text-sm text-slate-500">You're all caught up! We'll notify you when something happens.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => {
              const Icon = NOTIFICATION_ICONS[notif.type] || Bell;
              const colorClass = NOTIFICATION_COLORS[notif.type] || 'bg-slate-100 text-slate-600';
              
              return (
                <div key={notif.id} className={`p-4 flex gap-4 hover:bg-slate-50/50 transition-colors ${!notif.is_read ? 'bg-indigo-50/30' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold truncate ${!notif.is_read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </p>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                         {new Date(notif.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-sm mt-0.5 ${!notif.is_read ? 'text-slate-700' : 'text-slate-500'}`}>
                      {notif.message}
                    </p>
                  </div>
                  {!notif.is_read && (
                    <button 
                      onClick={() => markAsRead.mutate(notif.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors self-center shrink-0"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {(data?.total || 0) > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
            Showing {notifications.length} of {data?.total || 0} notifications
          </div>
        )}
      </div>
    </div>
  );
}
