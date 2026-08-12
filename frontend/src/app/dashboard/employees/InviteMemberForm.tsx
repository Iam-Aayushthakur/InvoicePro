'use client';

import React, { useState } from 'react';
import { useInviteMember } from '../../../hooks/api/useEmployees';
import { X, Mail } from 'lucide-react';

interface InviteMemberFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberForm({ isOpen, onClose }: InviteMemberFormProps) {
  const inviteMember = useInviteMember();
  const [formData, setFormData] = useState({ email: '', full_name: '', role: 'EMPLOYEE' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inviteMember.mutate(formData, {
      onSuccess: () => {
        onClose();
        setFormData({ email: '', full_name: '', role: 'EMPLOYEE' });
      }
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Invite Team Member</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Full Name *</label>
            <input required type="text" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email Address *</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Role</label>
            <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="flex h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white">
              <option value="ADMIN">Admin</option>
              <option value="CASHIER">Cashier</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">Role determines what sections they can access.</p>
          </div>
        </form>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button onClick={onClose} type="button" className="flex-1 h-11 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
          <button disabled={inviteMember.isPending} onClick={handleSubmit as any} className="flex-1 h-11 bg-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 disabled:opacity-50">
            {inviteMember.isPending ? 'Sending...' : 'Send Invite'}
          </button>
        </div>
      </div>
    </>
  );
}
