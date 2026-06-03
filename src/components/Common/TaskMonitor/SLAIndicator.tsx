'use client';

import React from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SLAIndicatorProps {
  status: 'normal' | 'warning' | 'breached';
  remainingMinutes: number;
  totalMinutes: number;
}

/**
 * SLA 监控指示器
 */
export function SLAIndicator({ status, remainingMinutes, totalMinutes }: SLAIndicatorProps) {
  const config = {
    normal: { color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle2, label: '正常' },
    warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Clock, label: '即将超时' },
    breached: { color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertTriangle, label: '已超时' },
  };

  const cfg = config[status];
  const Icon = cfg.icon;
  const percent = Math.max(0, Math.min(100, (remainingMinutes / totalMinutes) * 100));

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>
        <Icon className="w-3 h-3" />
        {cfg.label}
      </span>
      <div className="w-20 bg-[#111625] rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${
            status === 'breached' ? 'bg-red-500' :
            status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-slate-400">{remainingMinutes}m</span>
    </div>
  );
}
