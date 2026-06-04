'use client';

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  /** 项目自定义：让 Badge 内容与 StatusBadge 一致，使用 status key 而非 variant */
  status?: 'running' | 'completed' | 'failed' | 'pending' | 'warning' | 'success' | 'error' | 'info' | 'analyzing' | 'approved' | 'rejected';
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  secondary: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  destructive: 'bg-red-500/20 text-red-300 border-red-500/40',
  outline: 'bg-transparent text-slate-300 border-[#2A354D]',
  success: 'bg-green-500/20 text-green-300 border-green-500/40',
  warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  info: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
};

const statusStyles: Record<NonNullable<BadgeProps['status']>, string> = {
  running: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  completed: 'bg-green-500/20 text-green-300 border-green-500/40',
  success: 'bg-green-500/20 text-green-300 border-green-500/40',
  failed: 'bg-red-500/20 text-red-300 border-red-500/40',
  error: 'bg-red-500/20 text-red-300 border-red-500/40',
  pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  warning: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  info: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
  analyzing: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  approved: 'bg-green-500/20 text-green-300 border-green-500/40',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/40',
};

export function Badge({ className = '', variant = 'default', status, children, ...props }: BadgeProps) {
  const style = status ? statusStyles[status] : variantStyles[variant];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${style} ${className}`}
      {...(props as any)}
    >
      {children}
    </span>
  );
}

export default Badge;
