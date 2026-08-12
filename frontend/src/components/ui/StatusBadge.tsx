import React from 'react';
import { CheckCircle2, Clock, Send, XCircle, AlertTriangle, FileEdit } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  DRAFT: { label: 'Draft', className: 'bg-slate-100 text-slate-700 border-slate-200', icon: FileEdit },
  ISSUED: { label: 'Issued', className: 'bg-amber-100 text-amber-700 border-amber-200', icon: Send },
  PAID: { label: 'Paid', className: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  PARTIALLY_PAID: { label: 'Partial', className: 'bg-sky-100 text-sky-700 border-sky-200', icon: Clock },
  OVERDUE: { label: 'Overdue', className: 'bg-rose-100 text-rose-700 border-rose-200', icon: AlertTriangle },
  CANCELLED: { label: 'Cancelled', className: 'bg-slate-100 text-slate-500 border-slate-200', icon: XCircle },
  // Quotation statuses
  SENT: { label: 'Sent', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: Send },
  ACCEPTED: { label: 'Accepted', className: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  REJECTED: { label: 'Rejected', className: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle },
  EXPIRED: { label: 'Expired', className: 'bg-slate-100 text-slate-500 border-slate-200', icon: Clock },
  // Purchase statuses
  ORDERED: { label: 'Ordered', className: 'bg-amber-100 text-amber-700 border-amber-200', icon: Send },
  RECEIVED: { label: 'Received', className: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, className: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${config.className} ${
      size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
    }`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {config.label}
    </span>
  );
}
