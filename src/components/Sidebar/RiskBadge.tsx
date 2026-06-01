'use client';

import { useSystem } from '@/contexts/SystemContext';

export function RiskBadge() {
  const { riskScore } = useSystem();

  const getRiskLevel = (score: number) => {
    if (score <= 50) return { label: '低风险', color: 'bg-emerald-500', textColor: 'text-emerald-400' };
    if (score <= 75) return { label: '中风险', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
    if (score <= 90) return { label: '高风险', color: 'bg-orange-500', textColor: 'text-orange-400' };
    return { label: '极高风险', color: 'bg-red-500', textColor: 'text-red-400' };
  };

  const risk = getRiskLevel(riskScore);

  return (
    <div className="px-4 py-3">
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider">系统风险评分</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${risk.color} text-white`}>
            {risk.label}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold ${risk.textColor}`}>{riskScore}</span>
          <span className="text-slate-500 text-sm">/ 100</span>
        </div>
        <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${risk.color}`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}