'use client';

import { useSystem } from '@/contexts/SystemContext';

export function RiskBadge() {
  const { riskScore } = useSystem();

  const getRiskLevel = (score: number) => {
    if (score <= 50) return { label: '低风险', color: 'bg-[#00C853]', textColor: 'text-[#00C853]' };
    if (score <= 75) return { label: '中风险', color: 'bg-[#FF9100]', textColor: 'text-[#FF9100]' };
    if (score <= 90) return { label: '高风险', color: 'bg-[#FF9100]', textColor: 'text-[#FF9100]' };
    return { label: '极高风险', color: 'bg-[#FF3B30]', textColor: 'text-[#FF3B30]' };
  };

  const risk = getRiskLevel(riskScore);

  return (
    <div className="px-4 py-3">
      <div className="bg-app-bg-surface/50 rounded-lg p-4 border border-app-border-base">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-app-text-secondary uppercase tracking-wider">系统风险评分</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${risk.color} text-app-text-primary`}>
            {risk.label}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold ${risk.textColor}`}>{riskScore}</span>
          <span className="text-app-text-muted text-sm">/ 100</span>
        </div>
        <div className="mt-3 h-2 bg-app-border-base rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${risk.color}`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}