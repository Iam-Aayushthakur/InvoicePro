'use client';

import React, { useState } from 'react';
import { useBackups, useTriggerBackup } from '../../../hooks/api/useBackups';
import { HardDrive, Cloud, Database, Play, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export default function BackupsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useBackups(page, 20);
  const triggerBackup = useTriggerBackup();

  const backups = data?.backups || [];

  const handleTriggerBackup = (type: string) => {
    triggerBackup.mutate({ backup_type: type });
  };

  const formatSize = (bytes: number | null) => {
    if (bytes === null) return '-';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Backups</h1>
        <p className="text-sm text-slate-500 mt-1">Manage and trigger database backups.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
           <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
             <Database className="w-8 h-8 text-indigo-600" />
           </div>
           <h3 className="text-lg font-bold text-slate-900">Database Backup</h3>
           <p className="text-sm text-slate-500 mt-2 mb-6">Create a full snapshot of your company data, customers, invoices, and settings.</p>
           <button 
             onClick={() => handleTriggerBackup('FULL_DATABASE')}
             disabled={triggerBackup.isPending}
             className="mt-auto w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors disabled:opacity-50"
           >
             <Play className="w-4 h-4" /> Trigger Backup
           </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
           <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
             <Cloud className="w-8 h-8 text-emerald-600" />
           </div>
           <h3 className="text-lg font-bold text-slate-900">Cloud Storage</h3>
           <p className="text-sm text-slate-500 mt-2 mb-6">Your backups are securely stored in the cloud. Scheduled automatic backups run daily.</p>
           <div className="mt-auto w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-emerald-50 text-sm font-semibold text-emerald-700 border border-emerald-200">
             <CheckCircle2 className="w-4 h-4" /> Cloud Sync Active
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-900">Backup History</h2>
         </div>
        
        {isLoading ? (
          <div className="p-8 space-y-4">
             {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse"></div>)}
          </div>
        ) : backups.length === 0 ? (
          <div className="p-16 text-center">
             <h3 className="text-lg font-bold text-slate-900 mb-1">No backups found</h3>
             <p className="text-sm text-slate-500">Trigger a backup to see it listed here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {backups.map(backup => (
                  <tr key={backup.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-slate-600 font-medium">
                       {new Date(backup.created_at).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {backup.backup_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                       {formatSize(backup.file_size)}
                    </td>
                    <td className="px-6 py-4">
                       {backup.status === 'COMPLETED' ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-semibold"><CheckCircle2 className="w-4 h-4"/> Completed</span>
                       ) : backup.status === 'FAILED' ? (
                          <span className="inline-flex items-center gap-1.5 text-rose-600 text-xs font-semibold"><AlertTriangle className="w-4 h-4"/> Failed</span>
                       ) : (
                          <span className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-semibold"><Clock className="w-4 h-4"/> {backup.status.replace('_', ' ')}</span>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
