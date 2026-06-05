/**
 * StatusBadge — 项目统一状态徽章
 *
 * ⚠️ 项目约定：
 * - 业务页面需要状态徽章时，统一使用本组件
 * - **不要**自行 import 'Badge' 或 'badge'（本项目不提供）
 * - **不要**使用 shadcn 风格的 Badge/Dialog/Label（已从代码库移除）
 *
 * 使用示例：
 *   import { StatusBadge } from '@/components/Common/StatusBadge';
 *   <StatusBadge status="running" />
 *   <StatusBadge status="failed" pulse />
 */
'use client';

import React from 'react';

type StatusType = 'running' | 'completed' | 'failed' | 'pending' | 'warning' | 'success' | 'error' | 'info';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  running:  { label: '运行中',  bg: 'bg-blue-500/20',  text: 'text-blue-400' },
  completed:{ label: '已完成',  bg: 'bg-green-500/20',  text: 'text-green-400' },
  success:  { label: '成功',    bg: 'bg-green-500/20',  text: 'text-green-400' },
  failed:   { label: '失败',    bg: 'bg-red-500/20',    text: 'text-red-400' },
  error:    { label: '错误',    bg: 'bg-red-500/20',    text: 'text-red-400' },
  pending:  { label: '待执行',  bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  warning:  { label: '异常',    bg: 'bg-orange-500/20',  text: 'text-orange-400' },
  info:     { label: '信息',    bg: 'bg-gray-500/20',   text: 'text-gray-400' },
  analyzing:{ label: '分析中',  bg: 'bg-purple-500/20',  text: 'text-purple-400' },
  approved: { label: '已审批',  bg: 'bg-green-500/20',  text: 'text-green-400' },
  rejected: { label: '已驳回',  bg: 'bg-red-500/20',    text: 'text-red-400' },
};

export function StatusBadge({ status, size = 'sm', pulse }: StatusBadgeProps) {
  const cfg = statusConfig[status as keyof typeof statusConfig] || { label: status, bg: 'bg-gray-500/20', text: 'text-gray-400' };
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClass} rounded-full ${cfg.bg} ${cfg.text} font-medium`}>
      {pulse && <span className={`w-1.5 h-1.5 rounded-full ${cfg.text} bg-current animate-pulse`} />}
      {cfg.label}
    </span>
  );
}
