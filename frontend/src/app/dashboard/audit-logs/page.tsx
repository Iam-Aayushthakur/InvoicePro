'use client';

import React, { useState } from 'react';
import { useAuditLogs } from '../../../hooks/api/useAuditLogs';
import { History, Search, Shield } from 'lucide-react';

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAuditLogs(page, 50);

  const logs = data?.auditLogs || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Review security events and system activity.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="p-8 space-y-4">
             {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-slate-100 rounded animate-pulse"></div>)}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Shield className="w-8 h-8 text-slate-300" />
             </div>
             <h3 className="text-lg font-bold text-slate-900 mb-1">No audit logs found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Resource</th>
                  <th className="px-6 py-4 hidden md:table-cell">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                       {new Date(log.created_at).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 truncate max-w-[150px]">
                       {log.user_email || log.user_id}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                       <span className="font-semibold text-slate-800">{log.resource_type}</span>
                       {log.resource_id && <span className="ml-1 text-xs text-slate-400 font-mono">({log.resource_id.slice(0,8)}...)</span>}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-slate-500 font-mono text-xs">
                       {log.ip_address || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {(data?.total || 0) > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
             <span className="text-xs text-slate-500">Showing {logs.length} of {data?.total} logs</span>
             <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p=>p-1)} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-xs font-semibold text-slate-700">Prev</button>
                <button disabled={page >= (data?.totalPages || 1)} onClick={() => setPage(p=>p+1)} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-xs font-semibold text-slate-700">Next</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
