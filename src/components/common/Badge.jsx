import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    navy: 'bg-navy-100 text-navy-900 border-navy-200'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const norm = (status || '').toLowerCase();
  switch (norm) {
    case 'approved':
    case 'active':
    case 'available':
      return <Badge variant="success">● {status}</Badge>;
    case 'pending':
      return <Badge variant="warning">⏳ {status}</Badge>;
    case 'overdue':
    case 'suspended':
    case 'rejected':
      return <Badge variant="danger">⚠ {status}</Badge>;
    case 'returned':
      return <Badge variant="primary">✓ {status}</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};
