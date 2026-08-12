'use client';

import React, { useState } from 'react';
import { useMembers, useUpdateMemberRole, useRemoveMember } from '../../../hooks/api/useEmployees';
import { InviteMemberForm } from './InviteMemberForm';
import { Shield, MoreHorizontal, UserPlus, Trash2, Mail, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth.store';

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { data, isLoading } = useMembers(page, 50);
  const updateRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();
  const { user } = useAuthStore();

  const members = data?.members || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Employees & Members</h1>
          <p className="text-sm text-slate-500 mt-1">Manage team access and roles for your company.</p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center justify-center h-10 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          <UserPlus className="w-4 h-4 mr-2" /> Invite Member
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex items-center gap-4 animate-pulse">
                 <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                 <div className="flex-1 space-y-2">
                   <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                   <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                 </div>
               </div>
             ))}
          </div>
        ) : members.length === 0 ? (
          <div className="p-16 text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-1">No team members found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {member.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 flex items-center gap-2">
                             {member.full_name}
                             {user?.id === member.user_id && <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] uppercase font-bold tracking-wider">You</span>}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={member.role}
                        onChange={(e) => updateRole.mutate({ userId: member.user_id, role: e.target.value })}
                        disabled={member.role === 'OWNER' && member.user_id === user?.id} // Can't demote self if owner
                        className="h-8 rounded-lg border border-slate-300 text-xs px-2 focus:ring-2 focus:ring-indigo-600 outline-none bg-white text-slate-700 font-medium disabled:opacity-50 disabled:bg-slate-50"
                      >
                        <option value="OWNER">Owner</option>
                        <option value="ADMIN">Admin</option>
                        <option value="CASHIER">Cashier</option>
                        <option value="EMPLOYEE">Employee</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-slate-600">
                      {new Date(member.joined_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {member.user_id !== user?.id && (
                        <button 
                           onClick={() => {
                             if(confirm(`Are you sure you want to remove ${member.full_name}?`)) {
                               removeMember.mutate(member.user_id);
                             }
                           }}
                           className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                           title="Remove Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <InviteMemberForm isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
}
